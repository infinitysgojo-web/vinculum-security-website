import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { inspectElement, WATCHED_SELECTOR, type CanaryFinding } from "@/lib/domCanary";
import { appWroteClipboard, clearAppClipboard, createClipboardEviction } from "@/lib/clipboardGuard";

/** Input that counts as practitioner activity for the inactivity lock. */
const ACTIVITY = ["mousemove", "mousedown", "keydown", "touchstart", "wheel", "scroll", "visibilitychange"] as const;
/** Three Escape presses inside this window trigger the panic purge. */
export const TRIPLE_ESCAPE_WINDOW_MS = 600;
/** Away from the window this long with app-copied text on the clipboard, and it is evicted. */
export const CLIPBOARD_EVICT_MS = 60_000;

/**
 * What the Sentinel lets the dashboard's Sentinel strip read: the time left on the one
 * inactivity timer, the canary's alert count, and the panic purge itself. The strip only
 * reads this; the timer, the canary and the panic keys stay owned here.
 */
export type SentinelReading = {
  /** Milliseconds until the idle seal or sign-out; null when disarmed or locked. */
  idleRemainingMs: number | null;
  /** Foreign scripts or frames the DOM canary has reported and not yet dismissed. */
  canaryAlerts: number;
  /** A clock the strip can compare timestamps against, advanced once a second. */
  now: number;
  /** Run the panic purge, exactly as Ctrl+Shift+X or triple Escape does. */
  panic: () => void;
};

const SentinelCtx = createContext<SentinelReading>({ idleRemainingMs: null, canaryAlerts: 0, now: 0, panic: () => {} });

/** Read the Sentinel from inside the dashboard (the Sentinel strip). */
export const useSentinel = () => useContext(SentinelCtx);

type Props = {
  /**
   * Inactivity threshold. The dashboard passes the idle seal (15 minutes by
   * default) or, without an unsealed enclave, the 15-minute sign-out. null disarms.
   */
  idleMs: number | null;
  /** Called once when the threshold passes: the dashboard seals or signs out. */
  onIdle: () => void;
  /** The workspace is sealed: render `lockScreen` and unmount the desks. */
  locked: boolean;
  lockScreen: ReactNode;
  /**
   * Panic purge (Ctrl+Shift+X or Escape three times within 600 ms). The dashboard
   * zeroizes its state, wipes browser storage, signs out and leaves for sign-in;
   * the Sentinel never navigates itself.
   */
  onPanic: () => void;
  children: ReactNode;
};

/**
 * Chancellery Sentinel: the dashboard's security watchdog. It owns the single
 * inactivity timer, the panic keys and the DOM mutation canary. Mounted only by
 * the dashboard, so none of its listeners exist on any other route.
 */
export function ChancellerySentinel({ idleMs, onIdle, locked, lockScreen, onPanic, children }: Props) {
  const idleCb = useRef(onIdle);
  idleCb.current = onIdle;
  const panicCb = useRef(onPanic);
  panicCb.current = onPanic;
  const fired = useRef(false);
  const [findings, setFindings] = useState<CanaryFinding[]>([]);
  // When the one inactivity timer was last re-armed; read by the strip's countdown.
  const armedAt = useRef<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  // One inactivity timer. Disarmed while the lock screen is up.
  useEffect(() => {
    if (locked || idleMs === null || !(idleMs > 0)) return;
    let t: number | null = null;
    const reset = () => {
      armedAt.current = Date.now();
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => {
        // Overwrite anything this app copied before the workspace seals or signs out.
        void clearAppClipboard();
        idleCb.current();
      }, idleMs);
    };
    ACTIVITY.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      ACTIVITY.forEach((e) => window.removeEventListener(e, reset));
      if (t) window.clearTimeout(t);
      armedAt.current = null;
    };
  }, [idleMs, locked]);

  // The strip's display clock: one tick a second while the timer is armed. It only reads
  // armedAt; it never re-arms, extends or fires the inactivity timer.
  useEffect(() => {
    if (locked || idleMs === null || !(idleMs > 0)) return;
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [idleMs, locked]);

  // Window-blur clipboard eviction. When the operator leaves the window with something this
  // app copied still on the clipboard, a 60-second eviction is armed; returning in time
  // disarms it. Browsers refuse clipboard writes from an unfocused page, so where the wipe
  // cannot run at the 60-second mark it runs the moment the window is focused again,
  // before anything else can be pasted from this tab.
  useEffect(() => {
    const ev = createClipboardEviction({
      setTimer: (fn, ms) => window.setTimeout(fn, ms),
      clearTimer: (id) => window.clearTimeout(id),
      wrote: appWroteClipboard,
      clear: clearAppClipboard,
      ms: CLIPBOARD_EVICT_MS,
    });
    const onBlur = () => ev.onBlur();
    const onFocus = () => ev.onFocus();
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);
    return () => {
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      ev.dispose();
    };
  }, []);

  // On lock the desks unmount (the lock screen replaces them), so sensitive views are
  // paused and hidden; the clipboard is overwritten where the browser allows.
  useEffect(() => {
    if (locked) void clearAppClipboard();
  }, [locked]);

  const panic = useCallback(() => {
    if (fired.current) return;
    fired.current = true;
    panicCb.current();
  }, []);

  // Panic keys, in the capture phase so a dialog that stops propagation cannot swallow them.
  useEffect(() => {
    let escapes: number[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && !e.altKey && e.code === "KeyX") {
        e.preventDefault();
        panic();
        return;
      }
      if (e.key !== "Escape") {
        escapes = [];
        return;
      }
      // A held key auto-repeats; only distinct presses count.
      if (e.repeat) return;
      const now = performance.now();
      escapes = [...escapes.filter((t) => now - t <= TRIPLE_ESCAPE_WINDOW_MS), now];
      if (escapes.length >= 3) {
        escapes = [];
        panic();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [panic]);

  // DOM mutation canary: foreign scripts and frames anywhere in the document.
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const check = (el: Element, out: CanaryFinding[]) => {
      if (seen.has(el)) return;
      const f = inspectElement(el, location.href);
      if (f) {
        seen.add(el);
        out.push(f);
      }
    };
    const observer = new MutationObserver((mutations) => {
      const out: CanaryFinding[] = [];
      for (const m of mutations) {
        if (m.type === "attributes" && m.target instanceof Element) {
          seen.delete(m.target);
          check(m.target, out);
          continue;
        }
        for (const node of Array.from(m.addedNodes)) {
          if (!(node instanceof Element)) continue;
          if (node.matches(WATCHED_SELECTOR)) check(node, out);
          node.querySelectorAll(WATCHED_SELECTOR).forEach((el) => check(el, out));
        }
      }
      if (!out.length) return;
      setFindings((prev) => [...prev, ...out].slice(-5));
      toast.error("Security alert: an unauthorised script or frame was added to this page.", {
        description: `${out[0].reason}: ${out[0].source.slice(0, 80)}`,
      });
    });
    observer.observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "srcdoc", "data"] });
    return () => observer.disconnect();
  }, []);

  const reading = useMemo<SentinelReading>(
    () => ({
      idleRemainingMs: locked || idleMs === null || !(idleMs > 0) || armedAt.current === null ? null : Math.max(0, idleMs - (now - armedAt.current)),
      canaryAlerts: findings.length,
      now,
      panic,
    }),
    [locked, idleMs, now, findings.length, panic],
  );

  return (
    <SentinelCtx.Provider value={reading}>
      {findings.length > 0 && (
        <div
          role="alert"
          data-testid="sentinel-canary-banner"
          className="sticky top-0 z-50 border-b border-destructive bg-destructive px-4 py-2 font-mono text-[11px] text-destructive-foreground"
        >
          <div className="container flex flex-wrap items-center justify-between gap-2 px-0">
            <span className="flex min-w-0 items-start gap-2">
              <ShieldAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
              <span className="min-w-0 break-words">
                DOM integrity warning: {findings[findings.length - 1].reason.toLowerCase()} ({findings[findings.length - 1].source.slice(0, 120)}).
                Disable untrusted browser extensions before continuing.
              </span>
            </span>
            <button type="button" onClick={() => setFindings([])} className="shrink-0 underline hover:opacity-80">
              Dismiss
            </button>
          </div>
        </div>
      )}
      {locked ? lockScreen : children}
    </SentinelCtx.Provider>
  );
}

export default ChancellerySentinel;
