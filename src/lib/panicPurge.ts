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
import { forgetAppClipboard } from "./clipboardGuard";

/** localStorage keys the purge removes. */
export const PURGED_LOCAL_KEY = /^(vinculum[-_:]|vs:|sb-.*-auth-token)/;
/** localStorage keys it keeps: the dispatch sequence floor (no mission content). */
export const KEPT_LOCAL_KEYS = new Set(["vs:registry_seq"]);

export type PurgeReport = { localKeys: number; vault: "deleted" | "blocked" | "unavailable"; clipboard: boolean };

/** Run one purge step; a failing step never stops the ones after it. */
function step(fn: () => void): void {
  try {
    fn();
  } catch {
    // A step that throws (storage blocked, store already torn down) is skipped.
  }
}

/**
 * Synchronous part: memory and Web Storage. Safe to call before anything else, and it
 * never throws: each step runs on its own. The enclave key reference (the
 * non-extractable PBKDF2 base key) is dropped first, so nothing sealed can be opened
 * from this tab afterwards.
 */
export function purgeVolatileState(): number {
  step(forgetEnclave);
  step(clearLedger);
  step(purgeRegistrySession);
  step(forgetAppClipboard);
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
  let localKeys = 0;
  try {
    localKeys = purgeVolatileState();
  } catch {
    // purgeVolatileState does not throw; this guards the contract.
  }
  const vaultP = (async () => {
    try {
      return await destroyVault();
    } catch {
      return "unavailable" as const;
    }
  })();
  const [vault, clipboard] = await Promise.all([vaultP, overwriteClipboard().catch(() => false)]);
  return { localKeys, vault, clipboard };
}
