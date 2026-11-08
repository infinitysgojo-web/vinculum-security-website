/**
 * Clipboard writes made by this app go through here, so a lock or panic can overwrite
 * a value the app itself placed on the clipboard. Only a marker that the app wrote
 * something is kept in memory, never the copied text. Browsers allow the overwrite only
 * while the page has focus; where they refuse, nothing more can be done from a page.
 */
let wroteByApp = false;
/** The privacy mask's filter for app copies, set only while the mask is on. A function, never text. */
const copyFilter: { fn: ((text: string) => string) | null } = { fn: null };

/**
 * While the presentation privacy mask is on, PrivacyProvider installs its mask here so a
 * copy button cannot place a raw identifier on the clipboard during a screen share.
 * null removes it. Files and exports are not affected: they carry the record as entered.
 */
export function setClipboardFilter(fn: ((text: string) => string) | null): void {
  copyFilter.fn = fn;
}

export async function copyText(text: string): Promise<void> {
  await navigator.clipboard.writeText(copyFilter.fn ? copyFilter.fn(text) : text);
  wroteByApp = true;
}

/** Did this app write to the clipboard since it was last cleared? (Only a flag; never the text.) */
export function appWroteClipboard(): boolean {
  return wroteByApp;
}

/** Drop the marker without touching the clipboard (the panic purge overwrites it itself). */
export function forgetAppClipboard(): void {
  wroteByApp = false;
}

/** Overwrite the clipboard if this app last wrote to it. Resolves whether it was cleared. */
export async function clearAppClipboard(): Promise<boolean> {
  if (!wroteByApp) return false;
  try {
    if (!navigator.clipboard?.writeText || (typeof document !== "undefined" && !document.hasFocus())) return false;
    await navigator.clipboard.writeText("");
    wroteByApp = false;
    return true;
  } catch {
    return false;
  }
}

type EvictionDeps = {
  setTimer: (fn: () => void, ms: number) => number;
  clearTimer: (id: number) => void;
  wrote: () => boolean;
  clear: () => Promise<boolean>;
  ms: number;
  now?: () => number;
};

/**
 * Window-blur clipboard eviction, as a small state machine the Sentinel drives:
 * blur with app-copied text on the clipboard arms one timer; focus inside the window
 * disarms it; when it fires the clipboard is overwritten, and where the browser refuses
 * (an unfocused page may not write) the overwrite runs on the next focus instead.
 */
export function createClipboardEviction(d: EvictionDeps) {
  let t: number | null = null;
  let pending = false;
  let awayAt: number | null = null;
  const now = d.now ?? Date.now;
  const disarm = () => {
    if (t !== null) d.clearTimer(t);
    t = null;
  };
  return {
    onBlur() {
      if (!d.wrote() || awayAt !== null) return;
      awayAt = now();
      disarm();
      t = d.setTimer(() => {
        t = null;
        void d.clear().then((ok) => {
          pending = !ok && d.wrote();
        });
      }, d.ms);
    },
    onFocus() {
      disarm();
      const overdue = awayAt !== null && now() - awayAt >= d.ms;
      awayAt = null;
      if (pending || overdue) {
        pending = false;
        void d.clear();
      }
    },
    dispose() { disarm(); awayAt = null; pending = false; },
    state: () => ({ armed: t !== null, pending }),
  };
}
