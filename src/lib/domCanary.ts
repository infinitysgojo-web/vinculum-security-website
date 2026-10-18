/**
 * DOM mutation canary rules. Pure, so they can be tested without a browser.
 *
 * Normal operation adds plenty of nodes: lazy desk chunks (dynamic import, plus
 * <link rel="modulepreload"> in production), sonner toasts, Radix portals, the
 * SEO component's JSON-LD and the self-hosted consent manager. None of those is
 * an executable script or a frame from another origin, so none trips the canary.
 * What does: an executable <script> whose src is not this origin, an inline
 * executable script injected after load (the app ships none), or a frame,
 * object or embed that is not a same-origin http(s) or blob: document.
 */

export type CanaryElement = {
  tagName: string;
  getAttribute(name: string): string | null;
  hasAttribute(name: string): boolean;
};

export type CanaryFinding = { tag: string; source: string; reason: string };

const EXECUTABLE_TYPE = /^(|module|(text|application)\/(x-)?(java|ecma)script)$/i;

/** Origin of a URL as the page would resolve it; "null" for opaque URLs (data:, about:). */
export function resolvedOrigin(url: string, base: string): string {
  try {
    const u = new URL(url, base);
    if (u.protocol === "blob:") return new URL(u.pathname).origin;
    if (u.protocol !== "http:" && u.protocol !== "https:") return "null";
    return u.origin;
  } catch {
    return "null";
  }
}

/** The finding for one element, or null when the element is part of normal operation. */
export function inspectElement(el: CanaryElement, pageUrl: string): CanaryFinding | null {
  const tag = el.tagName.toLowerCase();
  const origin = resolvedOrigin(pageUrl, pageUrl);
  if (tag === "script") {
    const type = (el.getAttribute("type") ?? "").trim();
    if (!EXECUTABLE_TYPE.test(type)) return null; // JSON-LD, importmap data, templates
    const src = el.getAttribute("src");
    if (src === null) return { tag, source: "inline", reason: "Inline script injected after load" };
    return resolvedOrigin(src, pageUrl) === origin ? null : { tag, source: src, reason: "Script from a foreign origin" };
  }
  if (tag === "iframe" || tag === "frame" || tag === "object" || tag === "embed") {
    if (el.hasAttribute("srcdoc")) return { tag, source: "srcdoc", reason: "Frame with injected document" };
    const src = el.getAttribute(tag === "object" ? "data" : "src");
    if (!src) return { tag, source: "about:blank", reason: "Blank frame injected (scriptable by its parent)" };
    return resolvedOrigin(src, pageUrl) === origin ? null : { tag, source: src, reason: "Frame from a foreign origin" };
  }
  return null;
}

export const WATCHED_SELECTOR = "script, iframe, frame, object, embed";
