/**
 * Cursor-safe sanitizer wiring for free-text fields. Nothing runs per keystroke:
 *  - on paste, text with prohibited hidden, bidirectional or control characters is
 *    rejected and nothing is inserted; clean text is inserted in NFC form;
 *  - on blur (the field is committed), the whole value is normalised once, and any
 *    prohibited character still present is removed with a visible notice.
 * Attached in the capture phase on a container, so every desk, drawer and vault
 * field below it is covered, including Radix portals (React events follow the
 * component tree). Password, number, email and other typed inputs are never touched.
 */
import type { ClipboardEvent, FocusEvent } from "react";
import { toast } from "sonner";
import { prohibitedCharacters, sanitizeInscriptionText } from "./sanitizer";

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

/**
 * Paste: text carrying prohibited invisible, bidirectional or control characters is
 * rejected whole (nothing is inserted) rather than silently rewritten. Clean text is
 * inserted in NFC form. Joiners that are spelling in a joining script are allowed.
 */
export function sanitizeOnPaste(e: ClipboardEvent<HTMLElement>) {
  const el = e.target;
  if (!isFreeText(el)) return;
  const text = e.clipboardData?.getData("text/plain");
  if (!text) return;
  const bad = prohibitedCharacters(text);
  if (bad.length) {
    e.preventDefault();
    toast.error(`Paste blocked: the copied text contains hidden or bidirectional characters (${bad.slice(0, 4).join(", ")}${bad.length > 4 ? ", …" : ""}). Nothing was inserted.`);
    return;
  }
  const clean = text.normalize("NFC");
  if (clean === text) return;
  e.preventDefault();
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  el.setRangeText(clean, start, end, "end");
  el.dispatchEvent(new Event("input", { bubbles: true }));
}

/**
 * Blur: the committed value is normalised to NFC once. Should a prohibited character
 * still be present (typed through an input method), it is removed and the user is told
 * which code points went: never a silent rewrite.
 */
export function sanitizeOnBlur(e: FocusEvent<HTMLElement>) {
  const el = e.target;
  if (!isFreeText(el)) return;
  const bad = prohibitedCharacters(el.value);
  // Multi-line drafts keep their leading indentation and closing line breaks.
  const clean = sanitizeInscriptionText(el.value, { trim: !(el instanceof HTMLTextAreaElement) });
  if (clean !== el.value) commitValue(el, clean);
  if (bad.length) toast.warning(`Removed hidden or bidirectional characters from this field: ${bad.slice(0, 4).join(", ")}${bad.length > 4 ? ", …" : ""}.`);
}
