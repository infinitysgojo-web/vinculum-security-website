/**
 * Sovereign Enclave lifecycle: set, unseal, change and clear the passphrase, the
 * idle-seal preference, and sealed session snapshots. A small external store so
 * the Mission Vault drawer and the dashboard read one state.
 *
 * The passphrase is never stored. What rests in IndexedDB is a verification
 * marker (a known string sealed under the passphrase) used to tell a right
 * passphrase from a wrong one, and ciphertext records with their salt and IV.
 */
import { useSyncExternalStore } from "react";
import { TAG_MISMATCH, hasEnclaveKey, importPassphrase, isSealedPayload, openWith, sealWith, setEnclaveMaterial } from "./chancelleryCrypto";
import {
  VERIFICATION_KEY,
  deleteEnclaveMetadata,
  deleteRawTheatreRecord,
  getAllTheatresFromVault,
  getEnclaveMetadata,
  listEnclaveMetadataKeys,
  putEnclaveMetadata,
  readRawTheatreRecords,
  saveTheatreToVault,
} from "./chancelleryDb";

export const VERIFICATION_TEXT = "VINCULUM SOVEREIGN ENCLAVE // VERIFICATION MARKER";
export const MIN_PASSPHRASE = 8;
export const IDLE_PREF_KEY = "vs:enclave-idle-minutes";
export const IDLE_OPTIONS = [0, 5, 15, 30] as const;
export type IdleMinutes = (typeof IDLE_OPTIONS)[number];

export type EnclaveState = {
  /** The metadata store has been read at least once. */
  ready: boolean;
  /** A passphrase has been set: records are written sealed. */
  configured: boolean;
  /** The passphrase material is held in memory for this tab. */
  unlocked: boolean;
  /** The idle guard sealed the session; the desks wait for the passphrase. */
  idleSealed: boolean;
  /** Idle guard in minutes, 0 for off. A plain preference, not a secret. */
  idleMinutes: IdleMinutes;
};

const readIdlePref = (): IdleMinutes => {
  try {
    const n = Number(window.localStorage.getItem(IDLE_PREF_KEY));
    return (IDLE_OPTIONS as readonly number[]).includes(n) ? (n as IdleMinutes) : 0;
  } catch {
    return 0;
  }
};

let state: EnclaveState = { ready: false, configured: false, unlocked: false, idleSealed: false, idleMinutes: 0 };
const listeners = new Set<() => void>();
const set = (patch: Partial<EnclaveState>) => {
  state = { ...state, ...patch, unlocked: hasEnclaveKey() };
  listeners.forEach((fn) => fn());
};
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
};
const snapshot = () => state;

export function enclaveState(): EnclaveState {
  return state;
}

export function useEnclave(): EnclaveState {
  return useSyncExternalStore(subscribe, snapshot, snapshot);
}

/** Re-read whether a passphrase is configured. Call on mount. */
export async function refreshEnclave(): Promise<EnclaveState> {
  let configured = false;
  try {
    configured = !!(await getEnclaveMetadata(VERIFICATION_KEY));
  } catch {
    configured = false;
  }
  set({ ready: true, configured, idleMinutes: typeof window === "undefined" ? 0 : readIdlePref() });
  return state;
}

/** Check a passphrase against the marker. Throws TAG_MISMATCH on a wrong one. */
async function verify(passphrase: string): Promise<CryptoKey> {
  const marker = await getEnclaveMetadata(VERIFICATION_KEY);
  if (!marker || !isSealedPayload(marker)) throw new Error("No enclave passphrase is set.");
  const mat = await importPassphrase(passphrase);
  const text = await openWith(marker, mat);
  if (text !== VERIFICATION_TEXT) throw new Error(TAG_MISMATCH);
  return mat;
}

async function writeMarker(mat: CryptoKey) {
  await putEnclaveMetadata(VERIFICATION_KEY, { ...(await sealWith(VERIFICATION_TEXT, mat)) });
}

/** First passphrase: seal every plaintext theatre already in the vault. */
export async function setEnclavePassphrase(passphrase: string): Promise<void> {
  if (passphrase.length < MIN_PASSPHRASE) throw new Error(`Use at least ${MIN_PASSPHRASE} characters.`);
  if (await getEnclaveMetadata(VERIFICATION_KEY)) throw new Error("A passphrase is already set. Use change passphrase.");
  const plain = (await readRawTheatreRecords()).filter((r) => !("sealed" in r && r.sealed));
  const mat = await importPassphrase(passphrase);
  await writeMarker(mat);
  setEnclaveMaterial(mat);
  for (const slot of plain) await saveTheatreToVault(slot as Parameters<typeof saveTheatreToVault>[0]);
  set({ configured: true });
}

/** Unseal for this tab. Throws the exact tag-mismatch error on a wrong passphrase. */
export async function unsealEnclave(passphrase: string): Promise<void> {
  const mat = await verify(passphrase);
  setEnclaveMaterial(mat);
  set({ configured: true });
}

/** Re-seal every record and snapshot under a new passphrase. */
export async function changeEnclavePassphrase(current: string, next: string): Promise<void> {
  if (next.length < MIN_PASSPHRASE) throw new Error(`Use at least ${MIN_PASSPHRASE} characters.`);
  const oldMat = await verify(current);
  setEnclaveMaterial(oldMat);
  // Open everything first, so a failure leaves the vault exactly as it was.
  const slots = await getAllTheatresFromVault();
  const snaps = await openSnapshots(oldMat);
  const mat = await importPassphrase(next);
  await writeMarker(mat);
  setEnclaveMaterial(mat);
  for (const slot of slots) await saveTheatreToVault(slot);
  for (const [key, text] of snaps) await putEnclaveMetadata(key, { ...(await sealWith(text, mat)) });
  set({});
}

/** Remove the passphrase: records return to plaintext local storage. */
export async function clearEnclavePassphrase(current: string): Promise<void> {
  const mat = await verify(current);
  setEnclaveMaterial(mat);
  const slots = await getAllTheatresFromVault();
  const sealedIds = (await readRawTheatreRecords()).filter((r) => "sealed" in r && r.sealed).map((r) => r.id);
  const snaps = await openSnapshots(mat);
  await deleteEnclaveMetadata(VERIFICATION_KEY);
  for (const [key, text] of snaps) {
    // A saved dashboard session returns to its plaintext browser save; idle snapshots are transient.
    const name = key.slice(SNAPSHOT_PREFIX.length);
    if (name.startsWith("session:")) {
      try {
        window.localStorage.setItem(`vinculum-${name}`, text);
      } catch {
        // Storage blocked: the session is dropped with the passphrase.
      }
    }
    await deleteEnclaveMetadata(key);
  }
  setEnclaveMaterial(null);
  for (const slot of slots) await saveTheatreToVault(slot);
  for (const id of sealedIds) await deleteRawTheatreRecord(id);
  set({ configured: false, idleSealed: false });
}

/** Drop the key from memory (the records stay sealed). */
export function lockEnclave() {
  setEnclaveMaterial(null);
  set({});
}

export function setIdleMinutes(m: IdleMinutes) {
  try {
    window.localStorage.setItem(IDLE_PREF_KEY, String(m));
  } catch {
    // Preference not stored; it still applies for this tab.
  }
  set({ idleMinutes: m });
}

export function setIdleSealed(on: boolean) {
  set({ idleSealed: on });
}

/* ------------------------------------------------------------------ */
/* Sealed snapshots (idle seal and saved dashboard session)            */
/* ------------------------------------------------------------------ */

export const SNAPSHOT_PREFIX = "snapshot:";
const snapshotKeys = async () => (await listEnclaveMetadataKeys()).filter((k) => k.startsWith(SNAPSHOT_PREFIX));

async function openSnapshots(mat: CryptoKey): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  for (const key of await snapshotKeys()) {
    const rec = await getEnclaveMetadata(key);
    if (rec && isSealedPayload(rec)) out.set(key, await openWith(rec, mat));
  }
  return out;
}

/** Seal a JSON-serialisable value under the in-memory key into the metadata store. */
export async function sealSnapshot(name: string, value: unknown): Promise<void> {
  await putEnclaveMetadata(SNAPSHOT_PREFIX + name, { ...(await sealWith(JSON.stringify(value))) });
}

/** Open a sealed snapshot (undefined when none). Optionally delete it once read. */
export async function openSnapshot<T>(name: string, consume = false): Promise<T | undefined> {
  const rec = await getEnclaveMetadata(SNAPSHOT_PREFIX + name);
  if (!rec || !isSealedPayload(rec)) return undefined;
  const value = JSON.parse(await openWith(rec)) as T;
  if (consume) await deleteEnclaveMetadata(SNAPSHOT_PREFIX + name);
  return value;
}
