/**
 * Chancellery emergency zeroization (the Sentinel's panic purge). Browser-local
 * only: nothing here makes a network request. The dashboard clears its own React
 * state and signs out; this module wipes everything the browser holds for the
 * mission:
 *  - the enclave key material and the in-memory session ledger and registry
 *  - sessionStorage (offline field session, terminal mode, test hooks)
 *  - localStorage saved sessions, the legacy theatre library, the offline
 *    credential digest, chancellery preferences and the auth token copy
 *  - the IndexedDB vault (sealed theatres, verification marker, snapshots)
 *  - the clipboard, overwritten with an empty string where the browser allows
 *
 * The registry sequence floor is kept so dispatch references are never reissued.
 */
import { forgetEnclave } from "./chancelleryEnclave";
import { destroyVault } from "./chancelleryDb";
import { clearLedger } from "@/components/desk/ledgerStore";
import { purgeRegistrySession } from "@/components/desk/registry";

/** localStorage keys the purge removes. */
export const PURGED_LOCAL_KEY = /^(vinculum[-_:]|vs:|sb-.*-auth-token)/;
/** localStorage keys it keeps: the dispatch sequence floor (no mission content). */
export const KEPT_LOCAL_KEYS = new Set(["vs:registry_seq"]);

export type PurgeReport = { localKeys: number; vault: "deleted" | "blocked" | "unavailable"; clipboard: boolean };

/** Synchronous part: memory and Web Storage. Safe to call before anything else. */
export function purgeVolatileState(): number {
  forgetEnclave();
  clearLedger();
  purgeRegistrySession();
  try {
    window.sessionStorage.clear();
  } catch {
    // Storage blocked: nothing was stored there.
  }
  let removed = 0;
  try {
    const ls = window.localStorage;
    const keys: string[] = [];
    for (let i = 0; i < ls.length; i++) {
      const k = ls.key(i);
      if (k && PURGED_LOCAL_KEY.test(k) && !KEPT_LOCAL_KEYS.has(k)) keys.push(k);
    }
    for (const k of keys) {
      ls.removeItem(k);
      removed++;
    }
  } catch {
    // Storage blocked.
  }
  return removed;
}

/** Overwrite the clipboard. Resolves false where the browser refuses (no focus or no permission). */
export async function overwriteClipboard(): Promise<boolean> {
  try {
    if (!navigator.clipboard?.writeText) return false;
    await navigator.clipboard.writeText("");
    return true;
  } catch {
    return false;
  }
}

/** The whole purge. Never throws. */
export async function executePanicPurge(): Promise<PurgeReport> {
  const localKeys = purgeVolatileState();
  const [vault, clipboard] = await Promise.all([destroyVault().catch(() => "unavailable" as const), overwriteClipboard()]);
  return { localKeys, vault, clipboard };
}
