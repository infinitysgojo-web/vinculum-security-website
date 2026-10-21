/**
 * Crash-safe local writes and bounded retention for the workspace collection.
 *
 * Transactional write (localStorage): the complete new collection is first written to a
 * pending key, read back and validated; only then is the current copy kept as the last
 * known-good revision and the new one promoted to current. A failed or refused write
 * (storage full, browser blocked) leaves the current copy untouched. On read, an
 * unreadable current copy falls back to the last known-good one, and the unreadable
 * text is kept in quarantine rather than erased.
 */
import { quarantineEntry, readStore, type StoreRead, type WorkspaceStore } from "./workspace";

export const pendingKey = (key: string) => `${key}:pending`;
export const lastGoodKey = (key: string) => `${key}:last-good`;

/** Replay events kept per workspace. Older events beyond this are dropped on save; desk state, notes and decisions are never trimmed. */
export const REPLAY_LIMIT = 1000;

export function boundHistory(store: WorkspaceStore): WorkspaceStore {
  if (!store.workspaces.some((w) => w.replay.length > REPLAY_LIMIT)) return store;
  return { ...store, workspaces: store.workspaces.map((w) => (w.replay.length > REPLAY_LIMIT ? { ...w, replay: w.replay.slice(-REPLAY_LIMIT) } : w)) };
}

type KV = Pick<Storage, "getItem" | "setItem" | "removeItem">;

export type WriteResult = { ok: true; reason?: undefined } | { ok: false; reason: "quota" | "blocked" | "verify" };

const isQuota = (e: unknown) => e instanceof DOMException && (e.name === "QuotaExceededError" || e.code === 22);

export function transactionalWrite(storage: KV, key: string, store: WorkspaceStore): WriteResult {
  const text = JSON.stringify(store);
  const pending = pendingKey(key);
  try {
    storage.setItem(pending, text);
  } catch (e) {
    try {
      storage.removeItem(pending);
    } catch {
      // ignore
    }
    return { ok: false, reason: isQuota(e) ? "quota" : "blocked" };
  }
  try {
    const back = storage.getItem(pending);
    const check = back === text ? readStore(JSON.parse(back)) : null;
    if (!check || check.store.workspaces.length !== store.workspaces.length) {
      storage.removeItem(pending);
      return { ok: false, reason: "verify" };
    }
    const cur = storage.getItem(key);
    if (cur !== null && cur !== text) {
      try {
        JSON.parse(cur);
        storage.setItem(lastGoodKey(key), cur);
      } catch {
        // An unreadable current copy is not promoted to last known-good.
      }
    }
    storage.setItem(key, text);
    storage.removeItem(pending);
    return { ok: true };
  } catch (e) {
    try {
      storage.removeItem(pending);
    } catch {
      // ignore
    }
    return { ok: false, reason: isQuota(e) ? "quota" : "blocked" };
  }
}

export type LocalRead = StoreRead & { recovered?: "last-good" | "pending"; found: boolean };

const parse = (t: string | null): { ok: true; value: unknown } | { ok: false } => {
  if (t === null) return { ok: false };
  try {
    return { ok: true, value: JSON.parse(t) };
  } catch {
    return { ok: false };
  }
};

export function transactionalRead(storage: KV, key: string): LocalRead {
  const cur = storage.getItem(key);
  const parsed = parse(cur);
  if (parsed.ok) return { ...readStore(parsed.value), found: true };
  if (cur !== null) {
    // The current copy is unreadable (truncated or altered): restore the last known-good copy, keep the bad text aside.
    const good = parse(storage.getItem(lastGoodKey(key)));
    const bad = quarantineEntry(cur.slice(0, 200_000), "The latest local save could not be parsed (truncated or altered).");
    if (good.ok) {
      const r = readStore(good.value);
      return {
        store: { ...r.store, quarantine: [...r.store.quarantine, bad] },
        error: "The latest local save could not be read. The last known-good copy was restored, and the unreadable save is kept aside in quarantine.",
        recovered: "last-good",
        found: true,
      };
    }
    return {
      store: { schema: 1, workspaces: [], quarantine: [bad] },
      error: "The local workspace list could not be read and no earlier good copy exists. It is kept aside in quarantine, unchanged.",
      found: true,
    };
  }
  // No current copy: a write interrupted after its pending copy was complete.
  const pend = parse(storage.getItem(pendingKey(key)));
  if (pend.ok) return { ...readStore(pend.value), recovered: "pending", error: "An interrupted save was recovered.", found: true };
  return { ...readStore(null), found: false };
}

/* ------------------------------------------------------------------ */
/* Storage usage                                                       */
/* ------------------------------------------------------------------ */

/** Typical per-origin localStorage allowance. Browsers vary; this is a planning figure, not a guarantee. */
export const LOCAL_STORAGE_BUDGET = 5 * 1024 * 1024;
export const STORAGE_WARN_RATIO = 0.8;

/** Bytes this app holds in localStorage (UTF-16, two bytes a character). */
export function localStorageBytes(storage: Pick<Storage, "length" | "key" | "getItem">): number {
  let n = 0;
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (!k || !/^(vinculum[-_:]|vs:)/.test(k)) continue;
    n += (k.length + (storage.getItem(k)?.length ?? 0)) * 2;
  }
  return n;
}

export type StorageUsage = { localBytes: number; originUsage?: number; originQuota?: number; constrained: boolean };

export async function storageUsage(): Promise<StorageUsage> {
  let localBytes = 0;
  try {
    localBytes = localStorageBytes(window.localStorage);
  } catch {
    // storage blocked
  }
  let originUsage: number | undefined;
  let originQuota: number | undefined;
  try {
    const est = await navigator.storage?.estimate?.();
    originUsage = est?.usage;
    originQuota = est?.quota;
  } catch {
    // not reported
  }
  const constrained =
    localBytes > LOCAL_STORAGE_BUDGET * STORAGE_WARN_RATIO || (!!originQuota && !!originUsage && originUsage / originQuota > STORAGE_WARN_RATIO);
  return { localBytes, originUsage, originQuota, constrained };
}

export const formatBytes = (n: number) => (n < 1024 ? `${n} B` : n < 1024 * 1024 ? `${(n / 1024).toFixed(1)} KB` : `${(n / 1024 / 1024).toFixed(1)} MB`);
