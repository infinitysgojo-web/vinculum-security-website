/**
 * Browser-local persistence for mission workspaces. Follows the saved-session rule:
 * with the Sovereign Enclave configured, the collection is sealed into IndexedDB under
 * the enclave key and no plaintext copy is kept in localStorage; without it, it lives in
 * localStorage for this account. Nothing is sent anywhere. Panic purge removes both
 * (the localStorage key matches its vinculum- prefix; the vault database is deleted).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { openSnapshot, sealSnapshot } from "@/lib/chancelleryEnclave";
import { EMPTY_STORE, readStore, type Mode, type Workspace, type WorkspaceStore } from "./workspace";

export const storeKey = (uid: string) => `vinculum-workspaces:${uid}`;
const snapshotName = (uid: string) => `workspaces:${uid}`;
/** The workspace open in this tab. Session-scoped, cleared on sign-out and by panic purge. */
export const ACTIVE_KEY = "vs:active-workspace";
/** The last working mode chosen, remembered on this device only. */
export const MODE_KEY = "vs:working-mode";

export type SaveStatus =
  /** Written to this browser (localStorage, or sealed into the enclave). */
  | "saved"
  /** Enclave configured but sealed: kept in memory until the passphrase is entered. */
  | "held"
  /** The browser refused the write. */
  | "unavailable"
  | "idle";

/** Merge two collections by workspace id; the later local update wins, nothing is dropped. */
export function mergeStores(a: WorkspaceStore, b: WorkspaceStore): WorkspaceStore {
  const byId = new Map<string, Workspace>();
  for (const w of [...a.workspaces, ...b.workspaces]) {
    const prev = byId.get(w.id);
    if (!prev || (w.updatedAt || "") >= (prev.updatedAt || "")) byId.set(w.id, w);
  }
  return { ...a, ...b, workspaces: [...byId.values()], quarantine: [...a.quarantine, ...b.quarantine] };
}

export function readActiveId(): string | null {
  try {
    return window.sessionStorage.getItem(ACTIVE_KEY);
  } catch {
    return null;
  }
}
export function writeActiveId(id: string | null) {
  try {
    if (id) window.sessionStorage.setItem(ACTIVE_KEY, id);
    else window.sessionStorage.removeItem(ACTIVE_KEY);
  } catch {
    // Session storage blocked: the Foyer opens on reload.
  }
}
export function readMode(): Mode | null {
  try {
    const m = window.localStorage.getItem(MODE_KEY);
    return m === "preset" || m === "custom" ? m : null;
  } catch {
    return null;
  }
}
export function writeMode(m: Mode) {
  try {
    window.localStorage.setItem(MODE_KEY, m);
  } catch {
    // ignore
  }
}

/**
 * The workspace collection for one account. `active` is false while signed out, idle
 * sealed or purged: the collection is then dropped from memory and reloaded on return.
 */
export function useWorkspaceStore(uid: string | null, active: boolean, enclave: { configured: boolean; unlocked: boolean }) {
  const [store, setStore] = useState<WorkspaceStore>(EMPTY_STORE);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<SaveStatus>("idle");
  const storeRef = useRef(store);
  storeRef.current = store;
  const openedSealed = useRef(false);

  useEffect(() => {
    if (!uid || !active) {
      setStore({ ...EMPTY_STORE, workspaces: [], quarantine: [] });
      setLoaded(false);
      openedSealed.current = false;
      return;
    }
    let cancelled = false;
    void (async () => {
      let plain: WorkspaceStore | undefined;
      let err: string | undefined;
      try {
        const t = window.localStorage.getItem(storeKey(uid));
        if (t) {
          const r = readStore(JSON.parse(t));
          plain = r.store;
          err = r.error;
        }
      } catch {
        err = "The local workspace list could not be parsed. It has been left in place unchanged.";
      }
      let sealed: WorkspaceStore | undefined;
      if (enclave.configured && enclave.unlocked && !openedSealed.current) {
        try {
          const snap = await openSnapshot<unknown>(snapshotName(uid));
          if (snap !== undefined) {
            const r = readStore(snap);
            sealed = r.store;
            err = err ?? r.error;
          }
          openedSealed.current = true;
        } catch {
          err = err ?? "The sealed workspace list could not be opened.";
        }
      }
      if (cancelled) return;
      setStore((cur) => {
        let next = cur;
        if (plain) next = mergeStores(next, plain);
        if (sealed) next = mergeStores(next, sealed);
        return next;
      });
      setError(err);
      setLoaded(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [uid, active, enclave.configured, enclave.unlocked]);

  const persist = useCallback(
    async (next: WorkspaceStore) => {
      if (!uid) return;
      try {
        if (enclave.configured) {
          if (!enclave.unlocked) {
            setStatus("held");
            return;
          }
          await sealSnapshot(snapshotName(uid), next);
          window.localStorage.removeItem(storeKey(uid));
        } else {
          window.localStorage.setItem(storeKey(uid), JSON.stringify(next));
        }
        setStatus("saved");
      } catch {
        setStatus("unavailable");
      }
    },
    [uid, enclave.configured, enclave.unlocked],
  );

  /** Insert or replace one workspace and write the collection. */
  const put = useCallback(
    (w: Workspace) => {
      const cur = storeRef.current;
      const exists = cur.workspaces.some((x) => x.id === w.id);
      const next = { ...cur, workspaces: exists ? cur.workspaces.map((x) => (x.id === w.id ? w : x)) : [...cur.workspaces, w] };
      storeRef.current = next;
      setStore(next);
      void persist(next);
    },
    [persist],
  );

  return { store, loaded, error, status, put };
}
