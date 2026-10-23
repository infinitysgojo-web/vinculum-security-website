// Unified privacy mask, input hygiene, crypto zeroization and clipboard perimeter.
// The DOM helpers are exercised on small stand-in elements (the suite runs without a
// browser DOM); the live page is covered by the Playwright audit.
import { afterEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { maskText, shroudDictionary, foldForMatch, LABEL_STATE_ALPHA, LABEL_THEATRE, LABEL_ENVOY } from "../src/components/desk/privacyShroud";
import {
  SHROUD_TITLE,
  UNMASK_CONFIRM_MS,
  isLockableField,
  liftAll,
  lockField,
  maskAttributes,
  maskCopyEvent,
  restoreAttributes,
  shroudSubtree,
  shroudTitle,
  unlockField,
  unmaskDecision,
  type AttrStore,
  type FieldStore,
} from "../src/components/desk/privacyDom";
import { dropVerdict } from "../src/lib/sanitizeFields";
import { blurActiveField, resolveHotkey } from "../src/hooks/useSovereignHotkeys";
import { appWroteClipboard, copyText, createClipboardEviction, forgetAppClipboard, setClipboardFilter } from "../src/lib/clipboardGuard";
import { decryptEnclavePayload, encryptEnclavePayload, openEnvelope, sealEnvelope } from "../src/lib/chancelleryCrypto";
import { executePanicPurge, purgeVolatileState } from "../src/lib/panicPurge";

const read = (p: string) => readFileSync(p, "utf8");

/* ---------------- a minimal element stand-in ---------------- */
class El {
  tagName: string;
  attrs = new Map<string, string>();
  children: El[] = [];
  parent: El | null = null;
  readOnly = false;
  value = "";
  blurred = 0;
  constructor(tag: string, attrs: Record<string, string> = {}, kids: El[] = []) {
    this.tagName = tag.toUpperCase();
    for (const [k, v] of Object.entries(attrs)) this.attrs.set(k, v);
    for (const k of kids) {
      k.parent = this;
      this.children.push(k);
    }
  }
  getAttribute(a: string) {
    return this.attrs.has(a) ? this.attrs.get(a)! : null;
  }
  setAttribute(a: string, v: string) {
    this.attrs.set(a, String(v));
  }
  removeAttribute(a: string) {
    this.attrs.delete(a);
  }
  hasAttribute(a: string) {
    return this.attrs.has(a);
  }
  matches(sel: string): boolean {
    return sel.split(",").some((s) => {
      s = s.trim();
      const attr = /^\[([\w-]+)\]$/.exec(s);
      if (attr) return this.attrs.has(attr[1]);
      return this.tagName === s.toUpperCase();
    });
  }
  closest(sel: string): El | null {
    for (let e: El | null = this; e; e = e.parent) if (e.matches(sel)) return e;
    return null;
  }
  querySelectorAll(_: string): El[] {
    const out: El[] = [];
    const walk = (e: El) => e.children.forEach((c) => (out.push(c), walk(c)));
    walk(this);
    return out;
  }
  blur() {
    this.blurred++;
  }
}
const asEl = (e: El) => e as unknown as Element;

const dict = shroudDictionary({
  theatre: "Côte d’Ivoire Littoral Corridor",
  parties: "République du Kivu; Federal State of Ruzizi",
  officer: "Amb. José Núñez",
});
const mask = (t: string) => maskText(t, dict);

describe("1. mask lock integrity", () => {
  test("narrative fields freeze (read-only, out of the tab order) and lift to their exact prior state", () => {
    const ta = new El("textarea", { tabindex: "3" });
    const plain = new El("input", { type: "text" });
    const fields: FieldStore = new Map();
    lockField(ta as unknown as HTMLTextAreaElement, fields);
    lockField(plain as unknown as HTMLInputElement, fields);
    expect(ta.readOnly).toBe(true);
    expect(ta.getAttribute("tabindex")).toBe("-1");
    expect(ta.getAttribute("aria-readonly")).toBe("true");
    expect(plain.getAttribute("tabindex")).toBe("-1");
    unlockField(ta as unknown as HTMLTextAreaElement, fields);
    unlockField(plain as unknown as HTMLInputElement, fields);
    expect(ta.readOnly).toBe(false);
    expect(ta.getAttribute("tabindex")).toBe("3");
    expect(plain.hasAttribute("tabindex")).toBe(false);
    expect(plain.hasAttribute("aria-readonly")).toBe(false);
    expect(plain.hasAttribute("data-shroud-locked")).toBe(false);
    // A field that was already read-only stays read-only after the lift.
    const ro = new El("textarea");
    ro.readOnly = true;
    lockField(ro as unknown as HTMLTextAreaElement, fields);
    unlockField(ro as unknown as HTMLTextAreaElement, fields);
    expect(ro.readOnly).toBe(true);
  });

  test("dials, sliders, radios, number fields and the palette search are never frozen", () => {
    for (const type of ["range", "radio", "checkbox", "number", "password", "email"]) expect(isLockableField(asEl(new El("input", { type })))).toBe(false);
    expect(isLockableField(asEl(new El("select")))).toBe(false);
    const kept = new El("input", { type: "search" });
    new El("div", { "data-shroud-keep": "" }, [kept]);
    expect(isLockableField(asEl(kept))).toBe(false);
    expect(isLockableField(asEl(new El("input")))).toBe(true);
    expect(isLockableField(asEl(new El("input", { type: "search" })))).toBe(true);
    expect(isLockableField(asEl(new El("textarea")))).toBe(true);
  });

  test("CSS: no pointer, no selection, transparent caret; opaque in print even without background graphics", () => {
    const css = read("src/index.css");
    const lock = css.slice(css.indexOf("/* Input freeze"));
    expect(lock).toContain("pointer-events: none !important;");
    expect(lock).toContain("user-select: none !important;");
    expect(lock).toContain("caret-color: transparent !important;");
    expect(lock).toContain('html.vs-shroud input[type="range"]');
    const print = css.slice(css.indexOf("@media print {\n  html.vs-shroud"));
    expect(print).toContain("print-color-adjust: exact !important;");
    expect(print).toContain("-webkit-print-color-adjust: exact !important;");
    expect(print).toContain("background: #000 !important;");
    expect(print).toContain("color: transparent !important;");
    expect(print).toContain("box-shadow: none !important;");
    // The old visible caret on redacted fields is gone.
    expect(css).not.toContain("caret-color: hsl(var(--primary));");
  });
});

describe("2. attribute sanitisation", () => {
  test("title, aria-label, alt and placeholder mask and restore byte for byte", () => {
    const raw = {
      title: "Briefing for République du Kivu",
      "aria-label": "Open the Côte d’Ivoire Littoral Corridor dossier",
      alt: "Map of the cote d'ivoire littoral corridor",
      placeholder: "Note for Amb. José Núñez…",
      "data-x": "République du Kivu",
    };
    const btn = new El("button", raw);
    const attrs: AttrStore = new Map();
    maskAttributes(asEl(btn), mask, attrs);
    expect(btn.getAttribute("title")).toBe(`Briefing for ${LABEL_STATE_ALPHA}`);
    expect(btn.getAttribute("aria-label")).toBe(`Open the ${LABEL_THEATRE} dossier`);
    expect(btn.getAttribute("alt")).toBe(`Map of the ${LABEL_THEATRE}`);
    expect(btn.getAttribute("placeholder")).toBe(`Note for ${LABEL_ENVOY}…`);
    // Attributes outside the list are not touched.
    expect(btn.getAttribute("data-x")).toBe(raw["data-x"]);
    restoreAttributes(asEl(btn), attrs);
    for (const [k, v] of Object.entries(raw)) expect(btn.getAttribute(k)).toBe(v);
  });

  test("a tooltip React rewrites while masked is masked again, and never overwritten on lift", () => {
    const el = new El("span", { title: "Federal State of Ruzizi" });
    const attrs: AttrStore = new Map();
    maskAttributes(asEl(el), mask, attrs);
    el.setAttribute("title", "Federal State of Ruzizi reply");
    maskAttributes(asEl(el), mask, attrs);
    expect(el.getAttribute("title")).toBe("[STATE BRAVO] reply");
    restoreAttributes(asEl(el), attrs);
    expect(el.getAttribute("title")).toBe("Federal State of Ruzizi reply");
    // Changed by the page after masking, it keeps the page's value.
    maskAttributes(asEl(el), mask, attrs);
    el.setAttribute("title", "Something new");
    restoreAttributes(asEl(el), attrs);
    expect(el.getAttribute("title")).toBe("Something new");
  });

  test("one subtree pass masks attributes, freezes fields, and liftAll undoes all of it; kept subtrees are skipped", () => {
    const ta = new El("textarea", { placeholder: "Brief République du Kivu" });
    const slider = new El("input", { type: "range", "aria-label": "Shock on Federal State of Ruzizi" });
    const keep = new El("div", { "data-shroud-keep": "" }, [new El("input", { type: "search", placeholder: "Federal State of Ruzizi" })]);
    const root = new El("main", {}, [ta, slider, keep]);
    const attrs: AttrStore = new Map();
    const fields: FieldStore = new Map();
    shroudSubtree(asEl(root), mask, attrs, fields);
    expect(ta.readOnly).toBe(true);
    expect(ta.getAttribute("placeholder")).toBe(`Brief ${LABEL_STATE_ALPHA}`);
    expect(slider.readOnly).toBe(false);
    expect(slider.getAttribute("aria-label")).toBe("Shock on [STATE BRAVO]");
    expect(keep.children[0].getAttribute("placeholder")).toBe("Federal State of Ruzizi");
    liftAll(attrs, fields);
    expect(ta.readOnly).toBe(false);
    expect(ta.getAttribute("placeholder")).toBe("Brief République du Kivu");
    expect(slider.getAttribute("aria-label")).toBe("Shock on Federal State of Ruzizi");
    expect(attrs.size).toBe(0);
    expect(fields.size).toBe(0);
  });
});

describe("3. window title swap", () => {
  const OrigMO = (globalThis as { MutationObserver?: unknown }).MutationObserver;
  afterEach(() => {
    (globalThis as { MutationObserver?: unknown }).MutationObserver = OrigMO;
  });
  test("the title becomes the shrouded banner and returns exactly; a route title set meanwhile is the one restored", () => {
    let fire: (() => void) | null = null;
    (globalThis as { MutationObserver?: unknown }).MutationObserver = class {
      constructor(cb: () => void) {
        fire = cb;
      }
      observe() {}
      disconnect() {
        fire = null;
      }
    };
    const doc = { title: "The Vinculum Dashboard · Vinculum Security", head: {} } as unknown as Document;
    const off = shroudTitle(doc);
    expect(doc.title).toBe(SHROUD_TITLE);
    expect(SHROUD_TITLE).toBe("Vinculum Security · Operational Briefing [SHROUDED]");
    off();
    expect(doc.title).toBe("The Vinculum Dashboard · Vinculum Security");
    const off2 = shroudTitle(doc);
    doc.title = "Kivu desk · Vinculum";
    (fire as unknown as () => void)();
    expect(doc.title).toBe(SHROUD_TITLE);
    off2();
    expect(doc.title).toBe("Kivu desk · Vinculum");
  });
});

describe("4. clipboard interception", () => {
  test("a copy while shrouded writes the masked tokens, not the raw names", () => {
    let written = "";
    let prevented = false;
    const e = { clipboardData: { setData: (_: string, v: string) => (written = v) }, preventDefault: () => (prevented = true), target: null };
    const out = maskCopyEvent(e, "République du Kivu met the Côte d'Ivoire littoral corridor delegation", mask);
    expect(out).toBe(`${LABEL_STATE_ALPHA} met the ${LABEL_THEATRE} delegation`);
    expect(written).toBe(out!);
    expect(prevented).toBe(true);
  });
  test("a copy from the palette search, or an empty selection, is left to the browser", () => {
    const kept = new El("input");
    new El("div", { "data-shroud-keep": "" }, [kept]);
    const e = { clipboardData: { setData: () => {} }, preventDefault: () => {}, target: kept as unknown as EventTarget };
    expect(maskCopyEvent(e, "Ruzizi", mask)).toBeNull();
    expect(maskCopyEvent({ clipboardData: { setData: () => {} }, preventDefault: () => {} }, "", mask)).toBeNull();
  });
  test("copy buttons pass through the mask while it is on, and write as entered when it is off", async () => {
    const nav = globalThis.navigator as unknown as { clipboard?: unknown };
    const prev = Object.getOwnPropertyDescriptor(globalThis.navigator, "clipboard");
    let last = "";
    Object.defineProperty(globalThis.navigator, "clipboard", { configurable: true, value: { writeText: async (t: string) => void (last = t) } });
    try {
      setClipboardFilter(mask);
      await copyText("Cable to République du Kivu");
      expect(last).toBe(`Cable to ${LABEL_STATE_ALPHA}`);
      setClipboardFilter(null);
      await copyText("Cable to République du Kivu");
      expect(last).toBe("Cable to République du Kivu");
      expect(appWroteClipboard()).toBe(true);
      forgetAppClipboard();
      expect(appWroteClipboard()).toBe(false);
    } finally {
      if (prev) Object.defineProperty(globalThis.navigator, "clipboard", prev);
      else delete nav.clipboard;
    }
  });
});

describe("5. drag-and-drop guard", () => {
  test("Trojan Source bidirectional text is refused whole", () => {
    const v = dropVerdict("pay the escrow\u202Eto the guarantor");
    expect(v.action).toBe("reject");
    expect(v.action === "reject" && v.codes).toContain("U+202E");
    for (const c of ["\u2066", "\u2067", "\u2068", "\u2069", "\u202A", "\u202B", "\u200B"]) expect(dropVerdict(`a${c}b`).action).toBe("reject");
  });
  test("clean text drops as typed, or in NFC form; empty drops are ignored", () => {
    expect(dropVerdict("Ruzizi corridor")).toEqual({ action: "default" });
    expect(dropVerdict("Cote\u0301")).toEqual({ action: "insert", text: "Coté" });
    expect(dropVerdict("")).toEqual({ action: "ignore" });
  });
  test("the drop barrier sits on the dashboard root beside paste and blur", () => {
    const dash = read("src/pages/Dashboard.tsx");
    expect(dash).toContain("onPasteCapture={sanitizeOnPaste} onBlurCapture={sanitizeOnBlur} onDropCapture={sanitizeOnDrop}");
    const f = read("src/lib/sanitizeFields.ts");
    expect(f).toContain("export function sanitizeOnDrop");
    // File drops (the vault and the verifier) pass through untouched.
    expect(f).toContain("dt.files && dt.files.length > 0");
  });
});

describe("6. crypto zeroization", () => {
  const subtle = globalThis.crypto.subtle as unknown as Record<string, (...a: unknown[]) => Promise<unknown>>;
  const orig = { decrypt: subtle.decrypt, encrypt: subtle.encrypt };
  afterEach(() => {
    subtle.decrypt = orig.decrypt;
    subtle.encrypt = orig.encrypt;
  });

  test("decryptEnclavePayload wipes the decrypted ArrayBuffer to 0x00 and still returns the text", async () => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const { ciphertextHex, ivHex } = await encryptEnclavePayload("Republic of Kivu · sealed note", key);
    const seen: ArrayBuffer[] = [];
    subtle.decrypt = async (...a: unknown[]) => {
      const r = (await orig.decrypt.apply(globalThis.crypto.subtle, a)) as ArrayBuffer;
      seen.push(r);
      return r;
    };
    expect(await decryptEnclavePayload(ciphertextHex, ivHex, key)).toBe("Republic of Kivu · sealed note");
    expect(seen).toHaveLength(1);
    expect(seen[0].byteLength).toBeGreaterThan(0);
    expect([...new Uint8Array(seen[0])].every((b) => b === 0)).toBe(true);
  });

  test("encryptEnclavePayload wipes the encoded plaintext once the cipher has read it", async () => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const inputs: Uint8Array[] = [];
    subtle.encrypt = async (...a: unknown[]) => {
      inputs.push(a[2] as Uint8Array);
      return orig.encrypt.apply(globalThis.crypto.subtle, a);
    };
    const sealed = await encryptEnclavePayload("plaintext", key);
    expect(inputs[0].length).toBe(9);
    expect([...inputs[0]].every((b) => b === 0)).toBe(true);
    subtle.encrypt = orig.encrypt;
    expect(await decryptEnclavePayload(sealed.ciphertextHex, sealed.ivHex, key)).toBe("plaintext");
  });

  test("openEnvelope wipes the plaintext and the joined ciphertext+tag, on success and on a wrong passphrase", async () => {
    const env = await sealEnvelope({ theatre: "Ruzizi" }, "correct horse battery");
    const joined: Uint8Array[] = [];
    const outs: ArrayBuffer[] = [];
    subtle.decrypt = async (...a: unknown[]) => {
      joined.push(a[2] as Uint8Array);
      const r = (await orig.decrypt.apply(globalThis.crypto.subtle, a)) as ArrayBuffer;
      outs.push(r);
      return r;
    };
    expect(await openEnvelope<{ theatre: string }>(env, "correct horse battery")).toEqual({ theatre: "Ruzizi" });
    expect([...joined[0]].every((b) => b === 0)).toBe(true);
    expect(await openEnvelope(env, "wrong passphrase").catch((e: Error) => e.message)).toContain("Authentication tag mismatch");
    expect([...joined[1]].every((b) => b === 0)).toBe(true);
    const src = read("src/lib/chancelleryCrypto.ts");
    expect(src).toContain("if (plain) zeroizeBuffer(plain);");
    expect(src).toContain("if (combined) zeroizeBuffer(combined);");
  }, 20000);

  test("the panic purge never throws, even with no browser storage, vault or clipboard", async () => {
    expect(() => purgeVolatileState()).not.toThrow();
    const r = await executePanicPurge();
    expect(typeof r.localKeys).toBe("number");
    expect(["deleted", "blocked", "unavailable"]).toContain(r.vault);
    expect(r.clipboard).toBe(false);
    expect(read("src/lib/panicPurge.ts")).toContain("step(forgetAppClipboard);");
  });
});

describe("7. one mask state, three controls", () => {
  test("Alt+M resolves to the mask by physical key, even while typing; AltGr and Cmd combinations do not", () => {
    expect(resolveHotkey({ key: "m", code: "KeyM", altKey: true }, false)).toBe("mask");
    expect(resolveHotkey({ key: "µ", code: "KeyM", altKey: true }, true)).toBe("mask");
    expect(resolveHotkey({ key: "m", code: "KeyM", altKey: true, ctrlKey: true }, false)).toBeNull();
    expect(resolveHotkey({ key: "m", code: "KeyM", altKey: true, metaKey: true }, false)).toBeNull();
    expect(resolveHotkey({ key: "M", code: "KeyM", altKey: true, shiftKey: true }, false)).toBeNull();
    expect(resolveHotkey({ key: "m", code: "KeyM" }, false)).toBeNull();
  });
  test("unmasking needs a confirming second stroke inside the window; engaging is immediate", () => {
    expect(unmaskDecision(null, 1000)).toBe("arm");
    expect(unmaskDecision(1000, 1000 + 500)).toBe("lift");
    expect(unmaskDecision(1000, 1000 + UNMASK_CONFIRM_MS)).toBe("lift");
    expect(unmaskDecision(1000, 1000 + UNMASK_CONFIRM_MS + 1)).toBe("arm");
    const ctx = read("src/components/desk/PrivacyContext.tsx");
    expect(ctx).toContain("Presentation Privacy Mask engaged: confidential identifiers shrouded, inputs locked");
    expect(ctx).not.toMatch(/setTimeout|setInterval/);
  });
  test("the header shield, the palette and Alt+M all call the context's toggle", () => {
    const dash = read("src/pages/Dashboard.tsx");
    expect(dash).toContain("mask: () => privacyToggleRef.current(),");
    expect(dash).toContain('case "mask":\n        return privacyToggleRef.current();');
    expect(dash).toMatch(/const \{ masked, toggle, unmaskArmed \} = usePrivacy\(\);[\s\S]*?aria-pressed=\{masked\}/);
    expect(read("src/components/CommandPalette.tsx")).toContain('["Alt + M"');
  });
  test("Ctrl/Cmd+S blurs the focused field first so its sanitiser commits before the save", () => {
    const el = new El("textarea");
    expect(blurActiveField({ activeElement: el as unknown as Element })).toBe(true);
    expect(el.blurred).toBe(1);
    expect(blurActiveField({ activeElement: null })).toBe(false);
    const hook = read("src/hooks/useSovereignHotkeys.ts");
    expect(hook).toMatch(/blurActiveField\(\);\n\s+queueMicrotask\(\(\) => ref\.current\.save\?\.\(\)\);/);
  });
});

describe("8. Unicode folding", () => {
  test("NFKC, typographic quotes and dashes, diacritics and case fold before matching", () => {
    expect(foldForMatch("Côte d’Ivoire — ＫＩＶＵ ﬁeld")).toBe("cote d'ivoire - kivu field");
    expect(maskText("COTE D'IVOIRE LITTORAL CORRIDOR", dict)).toBe(LABEL_THEATRE);
    expect(maskText("cote d\u2019ivoire\u00a0littoral   corridor!", dict)).toBe(`${LABEL_THEATRE}!`);
    expect(maskText("Amb. Jose Nunez", dict)).toBe(LABEL_ENVOY);
    expect(maskText("Republique du Kivu", dict)).toBe(LABEL_STATE_ALPHA);
    // Text around a hit keeps its original characters exactly.
    expect(maskText("« Côte d’Ivoire Littoral Corridor » — première", dict)).toBe(`« ${LABEL_THEATRE} » — première`);
    expect(maskText("R = 48% · λ = 0.0403", dict)).toBe("R = 48% · λ = 0.0403");
  });
});

describe("9. window-blur clipboard eviction", () => {
  const make = (wrote: boolean, clearOk: boolean) => {
    const timers = new Map<number, () => void>();
    let id = 0;
    let cleared = 0;
    let w = wrote;
    const ev = createClipboardEviction({
      setTimer: (fn) => (timers.set(++id, fn), id),
      clearTimer: (i) => void timers.delete(i),
      wrote: () => w,
      clear: async () => {
        cleared++;
        if (clearOk) w = false;
        return clearOk;
      },
      ms: 60_000,
    });
    return { ev, timers, cleared: () => cleared, flush: () => [...timers.values()].forEach((f) => f()) };
  };
  test("leaving with app-copied text arms 60 s; returning in time disarms it", () => {
    const m = make(true, true);
    m.ev.onBlur();
    expect(m.ev.state().armed).toBe(true);
    m.ev.onFocus();
    expect(m.ev.state().armed).toBe(false);
    expect(m.timers.size).toBe(0);
    expect(m.cleared()).toBe(0);
  });
  test("nothing copied by the app: nothing armed", () => {
    const m = make(false, true);
    m.ev.onBlur();
    expect(m.ev.state().armed).toBe(false);
  });
  test("after 60 s the clipboard is overwritten; refused while unfocused, it runs on the next focus", async () => {
    const ok = make(true, true);
    ok.ev.onBlur();
    ok.flush();
    await Promise.resolve();
    expect(ok.cleared()).toBe(1);
    const refused = make(true, false);
    refused.ev.onBlur();
    refused.flush();
    await new Promise((r) => queueMicrotask(() => r(null)));
    expect(refused.ev.state().pending).toBe(true);
    refused.ev.onFocus();
    expect(refused.cleared()).toBe(2);
    expect(refused.ev.state().pending).toBe(false);
  });
  test("the Sentinel drives it on window blur and focus", () => {
    const s = read("src/components/desk/ChancellerySentinel.tsx");
    expect(s).toContain("export const CLIPBOARD_EVICT_MS = 60_000;");
    expect(s).toContain('window.addEventListener("blur", onBlur);');
    expect(s).toContain('window.addEventListener("focus", onFocus);');
  });
});

describe("10. hardware Permissions-Policy and zero egress", () => {
  test("serial, HID, MIDI, wake lock and the light sensor are denied beside the existing lockdown", () => {
    const rule = JSON.parse(read("vercel.json")).headers.find((e: { source: string }) => e.source === "/(.*)");
    const pp: string = rule.headers.find((h: { key: string }) => h.key === "Permissions-Policy").value;
    for (const f of ["serial=()", "hid=()", "midi=()", "screen-wake-lock=()", "ambient-light-sensor=()", "camera=()", "display-capture=()", "browsing-topics=()"]) expect(pp).toContain(f);
  });
  test("no new file reaches the network", () => {
    for (const f of ["src/components/desk/privacyDom.ts", "src/components/desk/PrivacyContext.tsx", "src/components/desk/privacyShroud.ts", "src/lib/sanitizeFields.ts", "src/lib/clipboardGuard.ts"]) {
      expect(read(f)).not.toMatch(/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|https?:\/\//);
    }
  });
});
