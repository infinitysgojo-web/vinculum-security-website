/**
 * The DOM layer of the Presentation Privacy Mask, apart from the text-node pass in
 * PrivacyContext.tsx: attributes that show text on hover or to assistive technology,
 * the free-text field freeze, the window title and the copy filter. Every function
 * keeps what it replaced so lifting the mask restores the page byte for byte, and
 * none of them touches mission state: the MissionEngine bus and every desk reading
 * keep running underneath. Browser-local; no network.
 */

/** Attributes that carry readable text: hover tooltips, accessible names, image text, field hints. */
export const SHROUD_ATTRS = ["title", "aria-label", "alt", "placeholder"] as const;

/** The window title shown while the mask is on. */
export const SHROUD_TITLE = "[RESTRICTED CHANCELLERY BRIEFING] · Vinculum Security";

/** How long a first unmask request stays armed for the confirming second stroke. */
export const UNMASK_CONFIRM_MS = 4000;

/** Subtrees the mask never rewrites: the palette search, code, and anything marked keep. */
export const KEEP = "[data-shroud-keep],script,style,noscript";

type AttrRecord = Record<string, { raw: string; shown: string }>;
/**
 * Where masked attributes keep their originals. Any Map-shaped store works (the tests
 * use a plain Map); the live mask uses createAttrStore(), whose records sit in a private
 * WeakMap so an element React discards while the mask is on is never kept alive by it.
 */
export interface AttrStore {
  get(el: Element): AttrRecord | undefined;
  set(el: Element, rec: AttrRecord): unknown;
  delete(el: Element): boolean;
  keys(): IterableIterator<Element>;
  readonly size: number;
}

type WeakRefLike<T extends object> = { deref(): T | undefined };
type WeakRefCtor = new <T extends object>(t: T) => WeakRefLike<T>;

/**
 * The live attribute store: originals in a private WeakMap<Element, AttrRecord>, plus weak
 * references so liftAll can still visit every element that is alive. Where the browser has
 * no WeakRef the references fall back to strong ones, which liftAll empties all the same.
 */
export function createAttrStore(): AttrStore {
  const records = new WeakMap<Element, AttrRecord>();
  const refs = new Map<Element | WeakRefLike<Element>, true>();
  const WR = (globalThis as { WeakRef?: WeakRefCtor }).WeakRef;
  const index = new WeakMap<Element, Element | WeakRefLike<Element>>();
  const live = function* (): IterableIterator<Element> {
    for (const r of [...refs.keys()]) {
      const el = WR && !(typeof Element !== "undefined" && r instanceof Element) && typeof (r as WeakRefLike<Element>).deref === "function" ? (r as WeakRefLike<Element>).deref() : (r as Element);
      if (el && records.has(el)) yield el;
      else refs.delete(r);
    }
  };
  return {
    get: (el) => records.get(el),
    set(el, rec) {
      if (!records.has(el)) {
        const r = WR ? new WR(el) : el;
        refs.set(r, true);
        index.set(el, r);
      }
      records.set(el, rec);
      return this;
    },
    delete(el) {
      const r = index.get(el);
      if (r) refs.delete(r);
      index.delete(el);
      return records.delete(el);
    },
    keys: live,
    get size() {
      return [...live()].length;
    },
  };
}

/**
 * Mask the text attributes of one element. The original of each attribute is kept
 * with the value written, so a later change by React (a new tooltip) is masked again
 * and an attribute React rewrote while masked is never overwritten on restore.
 */
export function maskAttributes(el: Element, mask: (t: string) => string, store: AttrStore): void {
  if (el.closest(KEEP)) return;
  let rec = store.get(el);
  for (const a of SHROUD_ATTRS) {
    const v = el.getAttribute(a);
    if (v === null) continue;
    const known = rec?.[a];
    if (known && known.shown === v) continue;
    const shown = mask(v);
    if (shown === v) {
      if (rec) delete rec[a];
      continue;
    }
    if (!rec) {
      rec = {};
      store.set(el, rec);
    }
    rec[a] = { raw: v, shown };
    el.setAttribute(a, shown);
  }
}

/** Restore every attribute this element had masked, unless something else changed it since. */
export function restoreAttributes(el: Element, store: AttrStore): void {
  const rec = store.get(el);
  if (!rec) return;
  for (const [a, { raw, shown }] of Object.entries(rec)) {
    if (el.getAttribute(a) === shown) el.setAttribute(a, raw);
  }
  store.delete(el);
}

/**
 * A select that chooses mission content (a party, a bond, a clause type) is frozen with the
 * text fields. Navigation selects (desk picker, theatre preset, Mission Spine) carry
 * data-shroud-nav and stay usable; their option labels are masked by the component.
 */
export function isLockableSelect(el: Element): el is HTMLSelectElement {
  return el.tagName?.toUpperCase() === "SELECT" && !el.closest("[data-shroud-keep],[data-shroud-nav]");
}

type SelectRecord = { tabIndex: string | null; ariaReadonly: string | null };
export type SelectStore = Map<HTMLSelectElement, SelectRecord>;

/** Freeze a content select: out of the tab order, aria-readonly, and (by CSS) unclickable. */
export function lockSelect(el: HTMLSelectElement, store: SelectStore): void {
  if (store.has(el)) return;
  store.set(el, { tabIndex: el.getAttribute("tabindex"), ariaReadonly: el.getAttribute("aria-readonly") });
  el.setAttribute("tabindex", "-1");
  el.setAttribute("aria-readonly", "true");
  el.setAttribute("data-shroud-locked", "");
}

/** Release a frozen select to exactly the tab order and aria it had. */
export function unlockSelect(el: HTMLSelectElement, store: SelectStore): void {
  const rec = store.get(el);
  if (!rec) return;
  if (rec.tabIndex === null) el.removeAttribute("tabindex");
  else el.setAttribute("tabindex", rec.tabIndex);
  if (rec.ariaReadonly === null) el.removeAttribute("aria-readonly");
  else el.setAttribute("aria-readonly", rec.ariaReadonly);
  el.removeAttribute("data-shroud-locked");
  store.delete(el);
}

/** A field that holds narrative or nominal text: textarea, text, search and untyped inputs. */
export function isLockableField(el: Element): el is HTMLInputElement | HTMLTextAreaElement {
  const tag = el.tagName?.toUpperCase();
  if (tag === "TEXTAREA") return !el.closest("[data-shroud-keep]");
  if (tag !== "INPUT") return false;
  const type = (el.getAttribute("type") ?? "text").toLowerCase();
  return (type === "text" || type === "search") && !el.closest("[data-shroud-keep]");
}

type FieldRecord = { readOnly: boolean; tabIndex: string | null; ariaReadonly: string | null };
export type FieldStore = Map<HTMLInputElement | HTMLTextAreaElement, FieldRecord>;

/**
 * Freeze a narrative field while the mask is on: read-only, out of the tab order, and
 * (by CSS) unclickable with a transparent caret. Dials, sliders, radios and number
 * inputs are never matched, so the instruments stay interactive.
 */
export function lockField(el: HTMLInputElement | HTMLTextAreaElement, store: FieldStore): void {
  if (store.has(el)) return;
  store.set(el, { readOnly: el.readOnly, tabIndex: el.getAttribute("tabindex"), ariaReadonly: el.getAttribute("aria-readonly") });
  el.readOnly = true;
  el.setAttribute("tabindex", "-1");
  el.setAttribute("aria-readonly", "true");
  el.setAttribute("data-shroud-locked", "");
}

/** Return a frozen field to exactly the read-only state, tab order and aria it had. */
export function unlockField(el: HTMLInputElement | HTMLTextAreaElement, store: FieldStore): void {
  const rec = store.get(el);
  if (!rec) return;
  el.readOnly = rec.readOnly;
  if (rec.tabIndex === null) el.removeAttribute("tabindex");
  else el.setAttribute("tabindex", rec.tabIndex);
  if (rec.ariaReadonly === null) el.removeAttribute("aria-readonly");
  else el.setAttribute("aria-readonly", rec.ariaReadonly);
  el.removeAttribute("data-shroud-locked");
  store.delete(el);
}

/** Visit an element and everything below it: attributes masked, narrative fields frozen. */
export function shroudElement(el: Element, mask: (t: string) => string, attrs: AttrStore, fields: FieldStore, selects?: SelectStore): void {
  maskAttributes(el, mask, attrs);
  if (isLockableField(el)) lockField(el, fields);
  else if (selects && isLockableSelect(el)) lockSelect(el, selects);
}

/** The same pass over an element and everything below it. */
export function shroudSubtree(root: Element, mask: (t: string) => string, attrs: AttrStore, fields: FieldStore, selects?: SelectStore): void {
  shroudElement(root, mask, attrs, fields, selects);
  root.querySelectorAll("*").forEach((el) => shroudElement(el, mask, attrs, fields, selects));
}

/** Lift the pass: every masked attribute restored and every frozen field and select released. */
export function liftAll(attrs: AttrStore, fields: FieldStore, selects?: SelectStore): void {
  [...attrs.keys()].forEach((el) => restoreAttributes(el, attrs));
  [...fields.keys()].forEach((el) => unlockField(el, fields));
  if (selects) [...selects.keys()].forEach((el) => unlockSelect(el, selects));
}

/**
 * Keep the window title shrouded while the mask is on. A title set by the page meanwhile
 * (a route's SEO tag) becomes the one restored when the mask lifts. Returns the cleanup.
 */
export function shroudTitle(doc: Document): () => void {
  let saved = doc.title;
  doc.title = SHROUD_TITLE;
  const mo = new MutationObserver(() => {
    if (doc.title === SHROUD_TITLE) return;
    saved = doc.title;
    doc.title = SHROUD_TITLE;
  });
  mo.observe(doc.head, { subtree: true, childList: true, characterData: true });
  return () => {
    mo.disconnect();
    if (doc.title === SHROUD_TITLE) doc.title = saved;
  };
}

type CopyLike = {
  clipboardData: { setData: (type: string, value: string) => void } | null;
  preventDefault: () => void;
  target?: EventTarget | null;
};

/**
 * Copy filter while shrouded: the selected text reaches the clipboard only after the
 * mask has run over it. Copies inside a kept subtree (the palette search) pass as typed.
 * Returns the text written, or null when the event was left to the browser.
 */
export function maskCopyEvent(e: CopyLike, selected: string, mask: (t: string) => string): string | null {
  const t = e.target as Element | null;
  if (t && typeof (t as Element).closest === "function" && (t as Element).closest("[data-shroud-keep]")) return null;
  if (!e.clipboardData || !selected) return null;
  const shown = mask(selected);
  e.clipboardData.setData("text/plain", shown);
  e.preventDefault();
  return shown;
}

/** Read the text an operator is copying: a field's selected range, or the document selection. */
export function selectedText(doc: Document): string {
  const a = doc.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
  if (a && (a.tagName === "TEXTAREA" || a.tagName === "INPUT") && typeof a.selectionStart === "number") {
    return a.value.slice(a.selectionStart ?? 0, a.selectionEnd ?? 0);
  }
  return doc.getSelection()?.toString() ?? "";
}

/**
 * The unmask safeguard: a request to lift the mask is honoured only when it confirms an
 * earlier request inside the window, so one stray key or click during a screen share
 * cannot expose the briefing. Pure, for tests.
 */
export function unmaskDecision(armedAt: number | null, now: number, windowMs: number = UNMASK_CONFIRM_MS): "lift" | "arm" {
  return armedAt !== null && now - armedAt >= 0 && now - armedAt <= windowMs ? "lift" : "arm";
}
