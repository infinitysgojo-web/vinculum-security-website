import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { maskText, shroudDictionary, shroudMatcher, type ShroudInput } from "./privacyShroud";

/**
 * Presentation Privacy Mode. While the shroud is on, a text-layer pass replaces the active
 * mission's confidential identifiers wherever they are rendered on the dashboard (desks,
 * drawers and dialogs), and free-text fields are drawn as redaction bars by CSS. Scores,
 * radars, indices and formulas are untouched and stay interactive. Turning the shroud off
 * restores every original text node. Nothing is changed in the mission state itself, and
 * exports always carry the record as entered.
 */

type Privacy = { masked: boolean; setMasked: (v: boolean) => void; toggle: () => void; mask: (text: string) => string };

const PrivacyCtx = createContext<Privacy>({ masked: false, setMasked: () => {}, toggle: () => {}, mask: (t) => t });

export const usePrivacy = () => useContext(PrivacyCtx);

const KEY = "vs:shroud";
const SKIP = "script,style,noscript,textarea,input,select,option,[data-shroud-keep],[contenteditable='true']";

export function PrivacyProvider({ input, children }: { input: ShroudInput; children: ReactNode }) {
  const [masked, setMaskedState] = useState(() => {
    try {
      return sessionStorage.getItem(KEY) === "1";
    } catch {
      return false;
    }
  });
  const setMasked = useCallback((v: boolean) => {
    setMaskedState(v);
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

  useEffect(() => {
    document.documentElement.classList.toggle("vs-shroud", masked);
    return () => document.documentElement.classList.remove("vs-shroud");
  }, [masked]);

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

  const value = useMemo(() => ({ masked, setMasked, toggle: () => setMasked(!masked), mask }), [masked, setMasked, mask]);
  return <PrivacyCtx.Provider value={value}>{children}</PrivacyCtx.Provider>;
}
