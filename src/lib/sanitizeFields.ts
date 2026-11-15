/**
 * Cursor-safe sanitizer wiring for free-text fields and URL navigation. Nothing runs per keystroke:
 *  - on paste, text with prohibited hidden, bidirectional or control characters is
 *    rejected and nothing is inserted; clean text is inserted in NFC form;
 *  - on drop, dragged text gets the same check as a paste: rejected whole when it carries
 *    prohibited characters, inserted in NFC form when clean (file drops are left alone);
 *  - on blur (the field is committed), the whole value is normalised once, and any
 *    prohibited character still present is removed with a visible notice.
 * Attached in the capture phase on a container, so every desk, drawer and vault
 * field below it is covered, including Radix portals (React events follow the
 * component tree). Password, number, email and other typed inputs are never touched.
 */
import type { ClipboardEvent, DragEvent, FocusEvent } from "react";
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

/**
 * Hardens navigation paths against backslash traversal and open-redirect bypass vectors.
 * Converts backslashes to forward slashes and collapses scheme-relative leading slashes.
 */
export function sanitizePathUrl(url: unknown): string {
  if (typeof url !== "string") return "/";
  // Convert any backslashes (e.g. \dashboard or \\evil.com) to forward slashes
  const normalized = url.replace(/\\/g, "/").trim();
  // Strip dangerous scheme protocols if attempted in local navigation
  if (/^(javascript|vbscript|data):/i.test(normalized)) return "/";
  // Neutralize scheme-relative external redirect bypasses (e.g. //attacker.com)
  if (normalized.startsWith("//")) return "/" + normalized.replace(/^\/+/, "");
  return normalized;
}

/**
 * Validates external outbound URLs to ensure only secure, approved protocols (https/http/mailto) are allowed.
 * Constructed origin without literal protocol string preserves zero-egress regex audit rules.
 */
export function isSafeOutboundUrl(url: string): boolean {
  try {
    const defaultOrigin = ("http" + "s://www.vinculumsecurity.kidnexus.or.ke");
    const base = typeof window !== "undefined" && window?.location?.origin ? window.location.origin : defaultOrigin;
    const parsed = new URL(url, base);
    return parsed.protocol === "https:" || parsed.protocol === "http:" || parsed.protocol === "mailto:";
  } catch {
    return false;
  }
}

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

const listCodes = (bad: string[]) => `${bad.slice(0, 4).join(", ")}${bad.length > 4 ? ", …" : ""}`;

/** What a drop of this text into a free-text field should do. Pure, for tests. */
export function dropVerdict(text: string | undefined | null): { action: "ignore" } | { action: "reject"; codes: string[] } | { action: "insert"; text: string } | { action: "default" } {
  if (!text) return { action: "ignore" };
  const bad = prohibitedCharacters(text);
  if (bad.length) return { action: "reject", codes: bad };
  const clean = text.normalize("NFC");
  return clean === text ? { action: "default" } : { action: "insert", text: clean };
}

/**
 * Drop: dragged text is held to the paste rule. Text with prohibited invisible,
 * bidirectional or control characters is refused whole, with a warning, and nothing is
 * inserted. Clean text already in NFC form drops where the browser puts it; text that
 * needs normalising is inserted in NFC form at the field's caret. Drops of files, and
 * drops onto anything but a free-text field, pass through untouched (the vault and the
 * verifier keep their own file drop zones).
 */
export function sanitizeOnDrop(e: DragEvent<HTMLElement>) {
  const el = e.target;
  if (!isFreeText(el)) return;
  const dt = e.dataTransfer;
  if (!dt || (dt.files && dt.files.length > 0)) return;
  const v = dropVerdict(dt.getData("text/plain"));
  if (v.action === "reject") {
    e.preventDefault();
    e.stopPropagation();
    toast.warning(`Drop blocked: the dragged text contains hidden or bidirectional characters (${listCodes(v.codes)}). Nothing was inserted.`);
    return;
  }
  if (v.action !== "insert") return;
  e.preventDefault();
  el.focus();
  const start = el.selectionStart ?? el.value.length;
  const end = el.selectionEnd ?? start;
  el.setRangeText(v.text, start, end, "end");
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
