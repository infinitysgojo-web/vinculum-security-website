import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { setClipboardFilter } from "@/lib/clipboardGuard";
import { maskText, shroudDictionary, shroudMatcher, type ShroudInput } from "./privacyShroud";
import {
  KEEP,
  SHROUD_ATTRS,
  UNMASK_CONFIRM_MS,
  createAttrStore,
  liftAll,
  maskCopyEvent,
  selectedText,
  shroudElement,
  shroudSubtree,
  shroudTitle,
  unmaskDecision,
  type AttrStore,
  type FieldStore,
  type SelectStore,
} from "./privacyDom";

/**
 * Presentation Privacy Mode. While the shroud is on, a text-layer pass replaces the active
 * mission's confidential identifiers wherever they are rendered on the dashboard (desks,
 * drawers and dialogs), together with the attributes that show text on hover or to a
 * screen reader (title, aria-label, alt, placeholder). Free-text fields are drawn as
 * redaction bars by CSS and frozen (read-only, out of the tab order), the window title is
 * replaced, and anything copied passes through the mask. Scores, radars, indices, dials and
 * formulas are untouched and stay interactive. Turning the shroud off restores every
 * original text node, attribute, field state and the title. Nothing is changed in the
 * mission state itself, and exports always carry the record as entered.
 *
 * One state, three controls: the header shield, the command palette and Alt+M all call
 * `toggle`. Engaging is immediate; lifting needs a confirming second stroke within four
 * seconds, so a stray key during a screen share cannot expose the briefing.
 */

type Privacy = {
  masked: boolean;
  /** Set the state directly, with no safeguard (panic, tests). */
  setMasked: (v: boolean) => void;
  /** Engage at once; lift only on a confirming second request. */
  toggle: () => void;
  /** True while a first unmask request waits for its confirmation. */
  unmaskArmed: boolean;
  mask: (text: string) => string;
};

const PrivacyCtx = createContext<Privacy>({ masked: false, setMasked: () => {}, toggle: () => {}, unmaskArmed: false, mask: (t) => t });

export const usePrivacy = () => useContext(PrivacyCtx);

const KEY = "vs:shroud";
const TOAST_ID = "vs-shroud";
const SKIP = "script,style,noscript,textarea,input,select,option,[data-shroud-keep],[contenteditable='true']";
const ENGAGED_NOTICE = "Presentation Privacy Mask engaged: confidential identifiers shrouded, inputs locked";
const LIFTED_NOTICE = "Presentation Privacy Mask lifted";
const CONFIRM_NOTICE = "Press Alt+M again, or choose Lift, to unmask the briefing";

export function PrivacyProvider({ input, children }: { input: ShroudInput; children: ReactNode }) {
  const [masked, setMaskedState] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });
  const [armedAt, setArmedAt] = useState<number | null>(null);
  const armedRef = useRef<number | null>(null);
  armedRef.current = armedAt;
  const setMasked = useCallback((v: boolean) => {
    setMaskedState(v);
    setArmedAt(null);
    try {
      sessionStorage.setItem(KEY, v ? "1" : "0");
    } catch {
      // sessionStorage unavailable: the shroud still applies for this render.
    }
  }, []);
  const key = JSON.stringify(input);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const dict = useMemo(() => shroudDictionary(input), [key]);
  const matcher = useMemo(() => shroudMatcher(dict), [dict]);
  const mask = useCallback((t: string) => (masked ? maskText(t, dict, matcher) : t), [masked, dict, matcher]);

  const maskedRef = useRef(masked);
  maskedRef.current = masked;
  const toggle = useCallback(() => {
    if (!maskedRef.current) {
      setMasked(true);
      toast.success(ENGAGED_NOTICE, { id: TOAST_ID, duration: 3500 });
      return;
    }
    const now = Date.now();
    if (unmaskDecision(armedRef.current, now) === "lift") {
      setMasked(false);
      toast(LIFTED_NOTICE, { id: TOAST_ID, duration: 2500 });
      return;
    }
    setArmedAt(now);
    toast.warning(CONFIRM_NOTICE, {
      id: TOAST_ID,
      duration: UNMASK_CONFIRM_MS,
      // The armed request lapses with its notice; no timer of our own (the Sentinel owns timing).
      onAutoClose: () => setArmedAt(null),
      onDismiss: () => setArmedAt(null),
      action: {
        label: "Lift",
        onClick: () => {
          setMasked(false);
          toast(LIFTED_NOTICE, { id: TOAST_ID, duration: 2500 });
        },
      },
    });
  }, [setMasked]);

  useEffect(() => {
    document.documentElement.classList.toggle("vs-shroud", masked);
    return () => document.documentElement.classList.remove("vs-shroud");
  }, [masked]);

  // Window title: shrouded while masked, restored exactly when lifted.
  useEffect(() => {
    if (!masked || typeof document === "undefined") return;
    return shroudTitle(document);
  }, [masked]);

  // Copy filter: whatever the operator copies passes through the mask first.
  useEffect(() => {
    if (!masked || !matcher || typeof document === "undefined") return;
    const m = (t: string) => maskText(t, dict, matcher);
    setClipboardFilter(m);
    const onCopy = (e: ClipboardEvent) => void maskCopyEvent(e, selectedText(document), m);
    const onCut = (e: ClipboardEvent) => {
      // Fields are read-only while masked; a cut would only copy, so it is masked the same way.
      void maskCopyEvent(e, selectedText(document), m);
    };
    document.addEventListener("copy", onCopy, true);
    document.addEventListener("cut", onCut, true);
    return () => {
      setClipboardFilter(null);
      document.removeEventListener("copy", onCopy, true);
      document.removeEventListener("cut", onCut, true);
    };
  }, [masked, matcher, dict]);

  // Field freeze and attribute pass. Runs whenever the mask is on, even with an empty
  // dictionary, so narrative fields lock the moment the shroud engages.
  useEffect(() => {
    if (!masked || typeof document === "undefined") return;
    const m = (t: string) => (matcher ? maskText(t, dict, matcher) : t);
    const attrs: AttrStore = createAttrStore();
    const fields: FieldStore = new Map();
    const selects: SelectStore = new Map();
    // A focused narrative field is blurred first, so its sanitiser commits before it freezes.
    const active = document.activeElement as HTMLElement | null;
    if (active && (active.tagName === "TEXTAREA" || active.tagName === "INPUT") && !active.closest("[data-shroud-keep]")) active.blur();
    shroudSubtree(document.body, m, attrs, fields, selects);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "attributes") {
          const el = r.target as Element;
          if (!el.closest(KEEP)) shroudElement(el, m, attrs, fields, selects);
        } else r.addedNodes.forEach((n) => n.nodeType === Node.ELEMENT_NODE && shroudSubtree(n as Element, m, attrs, fields, selects));
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: [...SHROUD_ATTRS, "type"] });
    return () => {
      mo.disconnect();
      liftAll(attrs, fields, selects);
    };
  }, [masked, matcher, dict]);

  // Text-layer pass. Each node's original text is kept so the shroud lifts exactly.
  useEffect(() => {
    if (!masked || !matcher || typeof document === "undefined") return;
    const originals = new Map<Text, { raw: string; shown: string }>();
    const visit = (n: Text) => {
      const parent = n.parentElement;
      if (!parent || parent.closest(SKIP)) return;
      const v = n.nodeValue ?? "";
      const known = originals.get(n);
      if (known && known.shown === v) return;
      const shown = maskText(v, dict, matcher);
      if (shown === v) {
        originals.delete(n);
        return;
      }
      originals.set(n, { raw: v, shown });
      n.nodeValue = shown;
    };
    const walk = (root: Node) => {
      if (root.nodeType === Node.TEXT_NODE) return visit(root as Text);
      const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let c = w.nextNode(); c; c = w.nextNode()) visit(c as Text);
    };
    walk(document.body);
    const mo = new MutationObserver((records) => {
      for (const r of records) {
        if (r.type === "characterData") visit(r.target as Text);
        else r.addedNodes.forEach(walk);
      }
    });
    mo.observe(document.body, { subtree: true, childList: true, characterData: true });
    return () => {
      mo.disconnect();
      originals.forEach((o, n) => {
        if (n.nodeValue === o.shown) n.nodeValue = o.raw;
      });
    };
  }, [masked, matcher, dict]);

  const value = useMemo(() => ({ masked, setMasked, toggle, unmaskArmed: armedAt !== null, mask }), [masked, setMasked, toggle, armedAt, mask]);
  return <PrivacyCtx.Provider value={value}>{children}</PrivacyCtx.Provider>;
}
