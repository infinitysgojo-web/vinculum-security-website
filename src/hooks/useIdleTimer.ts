import { useEffect, useRef } from "react";

const ACTIVITY = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "visibilitychange"] as const;

/**
 * Fire `onIdle` once after `timeoutMs` without operator input. Pass null to disarm.
 * Any input re-arms the timer. The latest `onIdle` is always the one called.
 */
export function useIdleTimer(timeoutMs: number | null, onIdle: () => void) {
  const cb = useRef(onIdle);
  cb.current = onIdle;
  useEffect(() => {
    if (timeoutMs === null || !(timeoutMs > 0)) return;
    let t: number | null = null;
    const reset = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(() => cb.current(), timeoutMs);
    };
    ACTIVITY.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      ACTIVITY.forEach((e) => window.removeEventListener(e, reset));
      if (t) window.clearTimeout(t);
    };
  }, [timeoutMs]);
}
