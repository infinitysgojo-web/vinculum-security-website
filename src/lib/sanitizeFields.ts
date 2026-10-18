/**
 * Cursor-safe sanitizer wiring for free-text fields. Nothing runs per keystroke:
 *  - on paste, hidden and control characters are removed from the pasted text
 *    before it is inserted at the caret (the caret lands after the insertion);
 *  - on blur (the field is committed), the whole value is sanitized once.
 * Attached in the capture phase on a container, so every desk, drawer and vault
 * field below it is covered, including Radix portals (React events follow the
 * component tree). Password, number, email and other typed inputs are never touched.
 */
import type { ClipboardEvent, FocusEvent } from "react";
import { toast } from "sonner";
import { detectSteganographicTokens, sanitizeInscriptionText } from "./sanitizer";

type Field = HTMLInputElement | HTMLTextAreaElement;

const isFreeText = (t: EventTarget | null): t is Field => {
  if (t instanceof HTMLTextAreaElement) return !t.readOnly && !t.disabled && !t.hasAttribute("data-no-sanitize");
  if (t instanceof HTMLInputElement) {
    const type = (t.getAttribute("type") ?? "text").toLowerCase();
    return (type === "text" || type === "search") && !t.readOnly && !t.disabled && !t.hasAttribute("data-no-sanitize");
  }
  return false;
};

/** Write a value the way a user edit would, so React's onChange sees it. */
function commitValue(el: Field, value: string) {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype;
  Object.getOwnPropertyDescriptor(proto, "value")?.set?.call(el, value);
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

export function sanitizeOnPaste(e: ClipboardEvent<HTMLElement>) {
  const el = e.target;
  if (!isFreeText(el)) return;
  const text = e.clipboardData?.getData("text/plain");
  if (!text) return;
  const clean = sanitizeInscriptionText(text, { trim: false });
  if (clean === text) return;
  e.preventDefault();
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  el.setRangeText(clean, start, end, "end");
  el.dispatchEvent(new Event("input", { bubbles: true }));
  const { stripped } = detectSteganographicTokens(text);
  toast.warning(`${stripped || "Hidden"} hidden or control character${stripped === 1 ? "" : "s"} removed from the pasted text.`);
}

export function sanitizeOnBlur(e: FocusEvent<HTMLElement>) {
  const el = e.target;
  if (!isFreeText(el)) return;
  // Multi-line drafts keep their leading indentation and closing line breaks.
  const clean = sanitizeInscriptionText(el.value, { trim: !(el instanceof HTMLTextAreaElement) });
  if (clean !== el.value) commitValue(el, clean);
}
