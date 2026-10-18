/**
 * Chancellery Vault: zero-dependency, promise-based IndexedDB storage for the
 * theatre library and the enclave metadata. Replaces the blocking 5 MB
 * localStorage library. Everything stays in this browser; nothing here performs
 * a network request.
 *
 * Database `vinculum_chancellery_vault` v1
 *   theatre_library   keyPath "id"   SavedTheatreSlot (plaintext) or a sealed record
 *   enclave_metadata  keyPath "key"  verification marker and sealed session snapshots
 *
 * When the Sovereign Enclave is configured, theatre records are written as
 * { id: <random>, sealed: true, saltHex, ivHex, ciphertextHex } only: no theatre
 * name, bond or binder text rests in plaintext, and even the record id is random.
 *
 * Where IndexedDB is unavailable (some private modes, locked-down profiles) the
 * vault falls back to an in-memory store for the life of the tab.
 */
import type { BinderEntry } from "@/components/desk/DeskOutput";
import type { MissionProfile } from "@/components/desk/mission";
import type { Signals } from "@/components/desk/engine";
import { bytesToHex, hasEnclaveKey, isSealedPayload, openWith, randomBytes, sealWith, type SealedPayload } from "./chancelleryCrypto";

export const VAULT_DB_NAME = "vinculum_chancellery_vault";
export const VAULT_DB_VERSION = 1;
export const THEATRE_STORE = "theatre_library";
export const META_STORE = "enclave_metadata";
/** The localStorage key the theatre library used before the IndexedDB vault. */
export const LEGACY_LIBRARY_KEY = "vinculum-theatre-library";
/** Metadata key of the encrypted known string that tells a right passphrase from a wrong one. */
export const VERIFICATION_KEY = "verification";

export type SavedTheatreSlot = {
  id: string;
  name: string;
  updatedAt: string;
  profile: MissionProfile;
  binder: BinderEntry[];
  signals: Signals;
};

export type SealedTheatreRecord = SealedPayload & { id: string; sealed: true };
export type TheatreRecord = SavedTheatreSlot | SealedTheatreRecord;
export type MetadataRecord = { key: string } & Record<string, unknown>;

type StoreName = typeof THEATRE_STORE | typeof META_STORE;

interface Backend {
  kind: "indexeddb" | "memory";
  getAll(store: StoreName): Promise<unknown[]>;
  get(store: StoreName, key: string): Promise<unknown>;
  put(store: StoreName, value: object): Promise<void>;
  del(store: StoreName, key: string): Promise<void>;
}

/* ------------------------------------------------------------------ */
/* Backends                                                            */
/* ------------------------------------------------------------------ */

let dbPromise: Promise<IDBDatabase> | null = null;

/** Open (or create/upgrade) the vault database. Rejects when IndexedDB is unavailable. */
export function initVaultDb(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const idb = typeof indexedDB !== "undefined" ? indexedDB : undefined;
    if (!idb) {
      reject(new Error("IndexedDB is unavailable in this browser context."));
      return;
    }
    let req: IDBOpenDBRequest;
    try {
      req = idb.open(VAULT_DB_NAME, VAULT_DB_VERSION);
    } catch (e) {
      reject(e);
      return;
    }
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(THEATRE_STORE)) db.createObjectStore(THEATRE_STORE, { keyPath: "id" });
      if (!db.objectStoreNames.contains(META_STORE)) db.createObjectStore(META_STORE, { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed."));
    req.onblocked = () => reject(new Error("IndexedDB open blocked."));
  });
  dbPromise.catch(() => {
    dbPromise = null;
  });
  return dbPromise;
}

const wrap = <T,>(req: IDBRequest<T>) =>
  new Promise<T>((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB request failed."));
  });

function idbBackend(db: IDBDatabase): Backend {
  const tx = (store: StoreName, mode: IDBTransactionMode) => db.transaction(store, mode).objectStore(store);
  const write = (store: StoreName, op: (s: IDBObjectStore) => IDBRequest) =>
    new Promise<void>((resolve, reject) => {
      const t = db.transaction(store, "readwrite");
      op(t.objectStore(store));
      t.oncomplete = () => resolve();
      t.onerror = () => reject(t.error ?? new Error("IndexedDB write failed."));
      t.onabort = () => reject(t.error ?? new Error("IndexedDB write aborted."));
    });
  return {
    kind: "indexeddb",
    getAll: (store) => wrap(tx(store, "readonly").getAll()),
    get: (store, key) => wrap(tx(store, "readonly").get(key)),
    put: (store, value) => write(store, (s) => s.put(value)),
    del: (store, key) => write(store, (s) => s.delete(key)),
  };
}

const memory = new Map<StoreName, Map<string, unknown>>([
  [THEATRE_STORE, new Map()],
  [META_STORE, new Map()],
]);
const clone = <T,>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
const memoryBackend: Backend = {
  kind: "memory",
  getAll: async (store) => [...memory.get(store)!.values()].map(clone),
  get: async (store, key) => clone(memory.get(store)!.get(key)),
  put: async (store, value) => {
    const k = store === THEATRE_STORE ? (value as { id: string }).id : (value as { key: string }).key;
    memory.get(store)!.set(k, clone(value));
  },
  del: async (store, key) => {
    memory.get(store)!.delete(key);
  },
};

let backendPromise: Promise<Backend> | null = null;
function backend(): Promise<Backend> {
  if (!backendPromise) {
    backendPromise = initVaultDb().then(idbBackend, () => memoryBackend);
  }
  return backendPromise;
}

/** "indexeddb" when the vault persists across reloads, "memory" when it lives for this tab only. */
export async function vaultBackendKind(): Promise<Backend["kind"]> {
  return (await backend()).kind;
}

/** Test hook: drop cached handles and empty the in-memory fallback. */
export function __resetVaultForTests() {
  backendPromise = null;
  dbPromise = null;
  storageIds.clear();
  memory.forEach((m) => m.clear());
}

/* ------------------------------------------------------------------ */
/* Theatre library                                                     */
/* ------------------------------------------------------------------ */

/** Logical slot id to the random storage id of its sealed record (known only after unsealing). */
const storageIds = new Map<string, string>();

const isSlot = (s: unknown): s is SavedTheatreSlot =>
  !!s &&
  typeof s === "object" &&
  typeof (s as SavedTheatreSlot).id === "string" &&
  typeof (s as SavedTheatreSlot).name === "string" &&
  !!(s as SavedTheatreSlot).profile &&
  typeof (s as SavedTheatreSlot).profile === "object";

const isSealedRecord = (r: unknown): r is SealedTheatreRecord =>
  isSealedPayload(r) && (r as SealedTheatreRecord).sealed === true && typeof (r as SealedTheatreRecord).id === "string";

/** Every record exactly as stored (ciphertext stays ciphertext). */
export async function readRawTheatreRecords(): Promise<TheatreRecord[]> {
  const all = await (await backend()).getAll(THEATRE_STORE);
  return all.filter((r): r is TheatreRecord => isSealedRecord(r) || isSlot(r));
}

/** Count of sealed records, readable without the passphrase. */
export async function countSealedTheatres(): Promise<number> {
  return (await readRawTheatreRecords()).filter(isSealedRecord).length;
}

/**
 * All saved mission theatres. Plaintext records are returned as stored; sealed
 * records are opened with the in-memory enclave key, and skipped while sealed.
 */
export async function getAllTheatresFromVault(): Promise<SavedTheatreSlot[]> {
  const out: SavedTheatreSlot[] = [];
  for (const r of await readRawTheatreRecords()) {
    if (isSealedRecord(r)) {
      if (!hasEnclaveKey()) continue;
      try {
        const slot: unknown = JSON.parse(await openWith(r));
        if (isSlot(slot)) {
          storageIds.set(slot.id, r.id);
          out.push(slot);
        }
      } catch {
        // A record sealed under another passphrase or damaged: left untouched, not shown.
      }
    } else {
      out.push(r);
    }
  }
  return out.sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : a.updatedAt > b.updatedAt ? -1 : 0));
}

/** True once a passphrase has been set (the verification marker exists). */
export async function isEnclaveConfigured(): Promise<boolean> {
  return !!(await getEnclaveMetadata(VERIFICATION_KEY));
}

/** Upsert a theatre. Sealed under the enclave key whenever the enclave is configured. */
export async function saveTheatreToVault(slot: SavedTheatreSlot): Promise<void> {
  const b = await backend();
  if (await isEnclaveConfigured()) {
    if (!hasEnclaveKey()) throw new Error("The enclave is sealed. Enter the passphrase to save.");
    const storageId = storageIds.get(slot.id) ?? `sealed-${bytesToHex(randomBytes(16))}`;
    const sealed = await sealWith(JSON.stringify(slot));
    await b.put(THEATRE_STORE, { id: storageId, sealed: true, ...sealed } satisfies SealedTheatreRecord);
    storageIds.set(slot.id, storageId);
    // Never leave a plaintext copy beside the sealed one.
    if (storageId !== slot.id) await b.del(THEATRE_STORE, slot.id);
    return;
  }
  await b.put(THEATRE_STORE, slot);
}

/** Remove a theatre by its logical id (plaintext or sealed). */
export async function deleteTheatreFromVault(id: string): Promise<void> {
  const b = await backend();
  const sid = storageIds.get(id);
  if (sid) await b.del(THEATRE_STORE, sid);
  await b.del(THEATRE_STORE, id);
  storageIds.delete(id);
}

/** Remove a stored record by its storage id (enclave re-keying only). */
export async function deleteRawTheatreRecord(storageId: string): Promise<void> {
  await (await backend()).del(THEATRE_STORE, storageId);
  for (const [k, v] of storageIds) if (v === storageId) storageIds.delete(k);
}

/* ------------------------------------------------------------------ */
/* Enclave metadata                                                    */
/* ------------------------------------------------------------------ */

export async function getEnclaveMetadata(key: string): Promise<MetadataRecord | undefined> {
  const v = await (await backend()).get(META_STORE, key);
  return v && typeof v === "object" ? (v as MetadataRecord) : undefined;
}

export async function putEnclaveMetadata(key: string, value: Record<string, unknown>): Promise<void> {
  await (await backend()).put(META_STORE, { ...value, key });
}

/** Every metadata key currently stored. */
export async function listEnclaveMetadataKeys(): Promise<string[]> {
  const all = await (await backend()).getAll(META_STORE);
  return all.map((r) => (r as MetadataRecord).key).filter((k): k is string => typeof k === "string");
}

export async function deleteEnclaveMetadata(key: string): Promise<void> {
  await (await backend()).del(META_STORE, key);
}

/* ------------------------------------------------------------------ */
/* Storage telemetry and migration                                     */
/* ------------------------------------------------------------------ */

/** Ask the browser not to evict the vault. False where unsupported or refused. */
export async function requestPersistentStorage(): Promise<boolean> {
  try {
    const s = typeof navigator !== "undefined" ? navigator.storage : undefined;
    if (!s) return false;
    if (s.persisted && (await s.persisted())) return true;
    return s.persist ? await s.persist() : false;
  } catch {
    return false;
  }
}

/** Origin storage use as the browser reports it (includes the offline cache). */
export async function getStorageQuota(): Promise<{ usedBytes: number; totalBytes: number; percent: number }> {
  try {
    const s = typeof navigator !== "undefined" ? navigator.storage : undefined;
    if (!s?.estimate) return { usedBytes: 0, totalBytes: 0, percent: 0 };
    const { usage = 0, quota = 0 } = await s.estimate();
    return { usedBytes: usage, totalBytes: quota, percent: quota ? Math.round((usage / quota) * 10000) / 100 : 0 };
  } catch {
    return { usedBytes: 0, totalBytes: 0, percent: 0 };
  }
}

/**
 * One-time move of the legacy localStorage library into the vault. The legacy key
 * is removed only after every record was written to a persistent IndexedDB. If the
 * enclave is configured but sealed, migration waits (it would otherwise write
 * plaintext into a sealed vault).
 */
export async function migrateLegacyStorage(): Promise<void> {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(LEGACY_LIBRARY_KEY);
  } catch {
    return;
  }
  if (!raw) return;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return;
  }
  if (!Array.isArray(parsed)) return;
  const b = await backend();
  if ((await isEnclaveConfigured()) && !hasEnclaveKey()) return;
  const existing = new Set((await readRawTheatreRecords()).map((r) => r.id));
  for (const s of parsed.filter(isSlot)) {
    // A theatre already in the vault wins over its legacy copy.
    if (existing.has(s.id) || storageIds.has(s.id)) continue;
    await saveTheatreToVault({ ...s, updatedAt: typeof s.updatedAt === "string" ? s.updatedAt : new Date(0).toISOString() });
  }
  if (b.kind !== "indexeddb") return;
  try {
    window.localStorage.removeItem(LEGACY_LIBRARY_KEY);
  } catch {
    // ignore
  }
}
