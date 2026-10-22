import { useEffect, useRef } from "react";

/**
 * Sovereign Navigation Hotkeys: the dashboard's one keyboard listener for navigation.
 *   [  previous desk      ]  next desk      ?  shortcut sheet      Esc  close / leave Focus
 *   Ctrl/Cmd+K  command palette             Ctrl/Cmd+S  save the mission state
 * Navigation keys are ignored while the user types in an input, textarea, select or
 * content-editable field; Ctrl/Cmd+K and Ctrl/Cmd+S work everywhere. The panic keys stay
 * with the Chancellery Sentinel: this hook never stops propagation, so the Sentinel's own
 * listener still counts every Escape press.
 */

export type HotkeyAction = "palette" | "save" | "prev" | "next" | "help" | "escape";

export type KeyLike = { key: string; metaKey?: boolean; ctrlKey?: boolean; altKey?: boolean; shiftKey?: boolean };

/** Is the event target a field the user is typing in? */
export function isTypingTarget(el: unknown): boolean {
  const t = el as { isContentEditable?: boolean; tagName?: string } | null;
  if (!t || typeof t !== "object") return false;
  return t.isContentEditable === true || ["INPUT", "TEXTAREA", "SELECT"].includes(String(t.tagName ?? "").toUpperCase());
}

/** Map a key press to a dashboard action, or null. Pure, for tests. */
export function resolveHotkey(e: KeyLike, typing: boolean): HotkeyAction | null {
  const mod = !!(e.metaKey || e.ctrlKey);
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  if (mod && !e.altKey && k === "k") return "palette";
  if (mod && !e.altKey && k === "s") return "save";
  if (typing) return null;
  if (e.key === "Escape") return "escape";
  if (mod) return null;
  if (e.key === "[" || (e.altKey && e.key === "ArrowLeft")) return "prev";
  if (e.key === "]" || (e.altKey && e.key === "ArrowRight")) return "next";
  if (e.key === "?") return "help";
  return null;
}

/** Step through an ordered desk list; null at either end. */
export function stepDesk<T extends { id: string }>(desks: readonly T[], current: string, dir: -1 | 1): T | null {
  const i = desks.findIndex((d) => d.id === current);
  return desks[i + dir] ?? null;
}

export function useSovereignHotkeys(handlers: Partial<Record<HotkeyAction, () => void>>) {
  const ref = useRef(handlers);
  ref.current = handlers;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const a = resolveHotkey(e, isTypingTarget(e.target));
      if (!a) return;
      const fn = ref.current[a];
      if (!fn) return;
      // Escape is left to Radix while any dialog, drawer or popover is open.
      if (a === "escape") {
        if (document.querySelector('[role="dialog"][data-state="open"]')) return;
      } else e.preventDefault();
      fn();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}
