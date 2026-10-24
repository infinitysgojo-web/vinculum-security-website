// Chancellery master directive: ergonomic unification, zero-cloud hardening and desk
// modernization. SSR renders, pure-function checks on stand-in elements and source
// assertions, in the style of friction-elimination and presentation-privacy-hardening.
import { describe, expect, test } from "bun:test";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EngineContext, type Signals } from "../src/components/desk/engine";
import ClauseRedliner from "../src/components/desk/ClauseRedliner";
import AuditBench from "../src/components/AuditBench";
import { PARTIES } from "../src/content/parties";
import {
  SHROUD_TITLE,
  createAttrStore,
  isLockableSelect,
  liftAll,
  lockSelect,
  shroudSubtree,
  unlockSelect,
  type FieldStore,
  type SelectStore,
} from "../src/components/desk/privacyDom";
import { IMPORT_LIMITS, precheckJsonText } from "../src/lib/payloadLimits";
import { readPackage } from "../src/components/mode/transfer";
import { verifyArchiveText } from "../src/lib/attestation";
import { decryptEnclavePayload, encryptEnclavePayload, sealEnvelope } from "../src/lib/chancelleryCrypto";

const read = (p: string) => readFileSync(p, "utf8");
const mount = (el: ReturnType<typeof createElement>, signals: Signals = {}) =>
  renderToStaticMarkup(createElement(EngineContext.Provider, { value: { signals, publish: () => {} } }, el));

/* ---------------- a minimal element stand-in ---------------- */
class El {
  tagName: string;
  attrs = new Map<string, string>();
  children: El[] = [];
  parent: El | null = null;
  readOnly = false;
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
  matches(sel: string): boolean {
    return sel.split(",").some((s) => {
      s = s.trim();
      const attr = /^\[([\w-]+)\]$/.exec(s);
      if (attr) return this.attrs.has(attr[1]);
      return this.tagName === s.toUpperCase();
    });
  }
  closest(sel: string): El | null {
    if (this.matches(sel)) return this;
    return this.parent ? this.parent.closest(sel) : null;
  }
  querySelectorAll(_: string): El[] {
    const out: El[] = [];
    const walk = (e: El) => e.children.forEach((c) => (out.push(c), walk(c)));
    walk(this);
    return out;
  }
}
const asEl = (e: El) => e as unknown as Element;
const mask = (t: string) => t.replace(/Ruzizi/g, "[STATE BRAVO]");

/* ------------------------------------------------------------------ */
/* 1. Zero-cloud boundary                                              */
/* ------------------------------------------------------------------ */

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : /\.(tsx?|css|md|json|txt)$/.test(f) ? [p] : [];
  });

describe("1 · zero-cloud boundary", () => {
  test("the backend serves one public function: the Medium feed proxy", () => {
    const fns = readdirSync("supabase/functions").filter((f) => !f.startsWith("_"));
    expect(fns).toEqual(["medium-feed"]);
  });
  test("no consumer cloud is named anywhere in the app, public files or docs", () => {
    const files = [...walk("src"), ...walk("public"), "roadmap.md", "README.md", "SECURITY.md", "AGENTS.md"];
    const hits = files.filter((f) => /dropbox|google ?drive|icloud|onedrive/i.test(read(f)));
    expect(hits).toEqual([]);
  });
  test("the archive custody notice is the standalone-package wording", () => {
    expect(read("src/components/mode/transfer.ts")).toContain(
      "Exported packages are standalone files. Once saved to your device, move them to your organisation’s encrypted vault, offline media, or designated archive to preserve a permanent copy.",
    );
  });
});

/* ------------------------------------------------------------------ */
/* 2. Layout ergonomics                                                */
/* ------------------------------------------------------------------ */

describe("2 · three-band header, fixed desk band, no phantom void", () => {
  const dash = read("src/pages/Dashboard.tsx");
  test("Band 1: the Sentinel strip is a pinned 36 px band with canary, bus reading, countdown, mask and panic", () => {
    expect(dash).toContain('className="sticky top-0 z-40 h-9 border-b border-brass/60 bg-background/95 backdrop-blur" data-testid="sentinel-strip"');
    for (const id of ["strip-canary", "strip-bond-mean", "strip-rupture", "strip-idle", "strip-panic"]) expect(dash).toContain(`data-testid="${id}"`);
    expect(dash).toMatch(/function SentinelStrip[\s\S]*?<PrivacyButton \/>/);
  });
  test("the strip reads the Sentinel; the Sentinel still owns the only timers", () => {
    const sentinel = read("src/components/desk/ChancellerySentinel.tsx");
    expect(sentinel).toContain("export const useSentinel = () => useContext(SentinelCtx);");
    expect(dash).toContain("const { idleRemainingMs, canaryAlerts, now, panic } = useSentinel();");
    expect(dash).not.toMatch(/setInterval\(/);
  });
  test("Band 2: one Mission Operations Deck with the integrated preset selector and the deck tools", () => {
    expect(dash).toContain('data-testid="ops-deck"');
    expect(dash).toContain("min-h-[50px]");
    expect(dash).toContain('data-testid="theatre-preset"');
    expect(dash).not.toContain('role="radiogroup" aria-label="Theatre preset"');
    for (const id of ["vault-toggle", "ledger-toggle", "palette-button"]) expect(dash).toContain(`data-testid="${id}"`);
    expect(dash).toContain('aria-label="Enter Focus view"');
    expect(dash).toContain("<LexiconDrawer />");
  });
  test("Band 3: divisions and the desk stepper share one fixed-height band, so switching divisions never moves the page", () => {
    expect(dash).toMatch(/data-testid="desk-band" className=\{`sticky top-9 z-30/);
    expect(dash).toContain('className="container flex h-12 items-center gap-3 overflow-x-auto');
    expect(dash).toContain("data-division={dv.id}");
    // Only the band's own scrollLeft moves when the active desk changes.
    expect(dash).toContain("band.scrollLeft +=");
    expect(dash).not.toMatch(/scrollIntoView\(/);
  });
  test("the 112 px phantom void is gone: mb-28 replaced by mb-8 pb-12", () => {
    expect(dash).not.toContain("mb-28");
    expect(dash.match(/mb-8 pb-12/g)?.length).toBe(3);
  });
  test("the desk heading is one eyebrow line plus a title with a collapsed doctrinal note", () => {
    expect(dash).toContain("Step {String(position + 1).padStart(2, \"0\")} of {DESKS.length}");
    expect(dash).toContain("const [noteOpen, setNoteOpen] = useState(false);");
    expect(dash).toContain('aria-controls="vs-desk-note"');
    expect(dash).toContain("Doctrinal note");
    expect(dash).toContain('noteOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"');
  });
  test("card padding is standardised on the shared panel token and the named panels", () => {
    expect(read("src/components/desk/DeskOutput.tsx")).toContain('export const panel = "border border-brass/40 bg-navy-tint/40 p-4 sm:p-5";');
    for (const f of ["src/components/desk/BondMathPanel.tsx", "src/components/desk/RelationalDynamicsPanel.tsx", "src/components/desk/EnclaveLockScreen.tsx", "src/components/BondDiagnostic.tsx", "src/components/LitigationWorkbench.tsx"]) {
      expect(read(f)).not.toMatch(/md:p-[78]|sm:p-[68]\b/);
    }
    expect(read("src/components/BondDiagnostic.tsx")).not.toContain("space-y-8");
  });
});

describe("2.4 · responsive grids on the complex desks", () => {
  test("Multi-Party: seated delegations in a 1/2/3-column grid", () => {
    const src = read("src/components/desk/MultiPartySequencer.tsx");
    expect(src).toContain('data-testid="seated-delegations"');
    expect(src).toContain("grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3");
  });
  test("Field Audit: a two-column comparative audit of every party", () => {
    const html = mount(createElement(AuditBench, { parties: PARTIES }));
    expect(html).toContain('data-testid="audit-comparative"');
    expect(html).toContain("grid grid-cols-1 gap-3 md:grid-cols-2");
    expect(html).toContain(`Comparative audit · 0 of ${PARTIES.length} parties complete`);
  });
  test("Legal Desk: a 60/40 workbench", () => {
    expect(read("src/components/LitigationWorkbench.tsx")).toContain("lg:grid-cols-[3fr_2fr]");
  });
});

/* ------------------------------------------------------------------ */
/* 3. Privacy mask and memory defence                                  */
/* ------------------------------------------------------------------ */

describe("3.1 · presentation privacy mask", () => {
  test("the restricted briefing title", () => {
    expect(SHROUD_TITLE).toBe("[RESTRICTED CHANCELLERY BRIEFING] · Vinculum Security");
  });
  test("attribute originals live in a WeakMap-backed store and lift exactly", () => {
    const src = read("src/components/desk/privacyDom.ts");
    expect(src).toContain("const records = new WeakMap<Element, AttrRecord>();");
    expect(read("src/components/desk/PrivacyContext.tsx")).toContain("const attrs: AttrStore = createAttrStore();");
    const btn = new El("button", { title: "Brief Ruzizi", "aria-label": "Open Ruzizi" });
    const attrs = createAttrStore();
    const fields: FieldStore = new Map();
    shroudSubtree(asEl(new El("main", {}, [btn])), mask, attrs, fields);
    expect(btn.getAttribute("title")).toBe("Brief [STATE BRAVO]");
    expect(attrs.size).toBe(1);
    expect([...attrs.keys()]).toEqual([asEl(btn)]);
    liftAll(attrs, fields);
    expect(btn.getAttribute("title")).toBe("Brief Ruzizi");
    expect(btn.getAttribute("aria-label")).toBe("Open Ruzizi");
    expect(attrs.size).toBe(0);
  });
  test("content selects freeze with the fields; navigation selects stay usable", () => {
    const content = new El("select", { tabindex: "2" });
    const nav = new El("select", { "data-shroud-nav": "" });
    expect(isLockableSelect(asEl(content))).toBe(true);
    expect(isLockableSelect(asEl(nav))).toBe(false);
    expect(isLockableSelect(asEl(new El("div", { "data-shroud-keep": "" }, [new El("select")]).children[0]))).toBe(false);
    const store: SelectStore = new Map();
    lockSelect(asEl(content) as HTMLSelectElement, store);
    expect(content.getAttribute("tabindex")).toBe("-1");
    expect(content.getAttribute("aria-readonly")).toBe("true");
    expect(content.getAttribute("data-shroud-locked")).toBe("");
    unlockSelect(asEl(content) as HTMLSelectElement, store);
    expect(content.getAttribute("tabindex")).toBe("2");
    expect(content.getAttribute("aria-readonly")).toBeNull();
    expect(content.getAttribute("data-shroud-locked")).toBeNull();
    const css = read("src/index.css");
    expect(css).toContain("html.vs-shroud select[data-shroud-locked] {");
    expect(css).toMatch(/@media print \{[\s\S]*?html\.vs-shroud select\[data-shroud-locked\]/);
    const dash = read("src/pages/Dashboard.tsx");
    expect(dash.match(/<select\s+data-shroud-nav/g)?.length).toBe(2);
    expect(dash).toContain("{t.sigil} · {mask(t.name)}");
  });
  test("unmasking still needs a second press inside 4 s", () => {
    expect(read("src/components/desk/privacyDom.ts")).toContain("export const UNMASK_CONFIRM_MS = 4000;");
  });
});

describe("3.2 · buffer zeroization", () => {
  const cryptoObj = globalThis.crypto as unknown as { getRandomValues: <T extends ArrayBufferView>(a: T) => T };
  test("sealEnvelope overwrites its salt and IV once they are encoded", async () => {
    const orig = cryptoObj.getRandomValues.bind(globalThis.crypto);
    const fresh: Uint8Array[] = [];
    cryptoObj.getRandomValues = (a) => {
      const out = orig(a);
      if (a instanceof Uint8Array && a.byteOffset === 0 && a.length === a.buffer.byteLength && (a.length === 12 || a.length === 16) && fresh.length < 2) fresh.push(a);
      return out;
    };
    try {
      await sealEnvelope({ mission: "Ruzizi" }, "correct horse battery staple");
    } finally {
      cryptoObj.getRandomValues = orig;
    }
    expect(fresh.length).toBe(2);
    for (const b of fresh) expect(b.every((x) => x === 0)).toBe(true);
  });
  test("the enclave payload round trip still works with the IV and ciphertext copies zeroized", async () => {
    const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    const sealed = await encryptEnclavePayload("Ruzizi corridor", key);
    expect(await decryptEnclavePayload(sealed.ciphertextHex, sealed.ivHex, key)).toBe("Ruzizi corridor");
    await expect(decryptEnclavePayload("zz", sealed.ivHex, key)).rejects.toThrow();
  });
});

describe("3.3 · pre-parse payload limits", () => {
  const nest = (n: number) => "[".repeat(n) + "]".repeat(n);
  test("depth, list, key and string caps are read from the raw text", () => {
    expect(precheckJsonText(nest(33), IMPORT_LIMITS).ok).toBe(true); // 32 levels below the root
    expect(precheckJsonText(nest(34), IMPORT_LIMITS)).toEqual({ ok: false, reason: "nested deeper than 32 levels" });
    expect(precheckJsonText(JSON.stringify(Array(10_000).fill(0)), IMPORT_LIMITS).ok).toBe(true);
    expect(precheckJsonText(JSON.stringify(Array(10_001).fill(0)), IMPORT_LIMITS).ok).toBe(false);
    const obj = (n: number) => JSON.stringify(Object.fromEntries(Array.from({ length: n }, (_, i) => [`k${i}`, i])));
    expect(precheckJsonText(obj(400), IMPORT_LIMITS).ok).toBe(true);
    expect(precheckJsonText(obj(401), IMPORT_LIMITS).ok).toBe(false);
    expect(precheckJsonText(JSON.stringify("a".repeat(200_000)), IMPORT_LIMITS).ok).toBe(true);
    expect(precheckJsonText(JSON.stringify("a".repeat(200_001)), IMPORT_LIMITS).ok).toBe(false);
    // An escape sequence counts as one character, as in the parsed string.
    expect(precheckJsonText(JSON.stringify("\u0001".repeat(200_000)), IMPORT_LIMITS).ok).toBe(true);
    // Brackets and commas inside strings are text, not structure.
    expect(precheckJsonText(JSON.stringify({ a: "[[[[,,,,{{{{" }), IMPORT_LIMITS).ok).toBe(true);
    expect(precheckJsonText(JSON.stringify([[], {}, "", [[1, 2], { a: [] }]]), IMPORT_LIMITS).ok).toBe(true);
  });
  test("imports and the archive verifier refuse a pathological file before parsing it", async () => {
    const r = await readPackage(nest(40));
    expect(r.ok).toBe(false);
    expect(JSON.stringify(r)).toContain("nested deeper than 32 levels");
    const v = await verifyArchiveText(nest(40));
    expect(v.verdict).toBe("invalid");
    expect(v.reason).toContain("nested deeper than 32 levels");
  });
});

/* ------------------------------------------------------------------ */
/* 4. Continuity, modularization, hygiene                              */
/* ------------------------------------------------------------------ */

describe("4 · continuity, modularization and hygiene", () => {
  test("the redliner shows a live count toward the 20-character threshold", () => {
    const html = mount(createElement(ClauseRedliner));
    expect(html).toContain('data-testid="redline-char-count"');
    expect(html).toContain("0 / 20 characters");
    expect(html).toContain("20 more to run the audit");
  });
  test("Desk 04's MirrorDesk lives in its own module and is mounted by the dashboard", () => {
    expect(existsSync("src/components/desk/MirrorDesk.tsx")).toBe(true);
    expect(read("src/components/desk/MirrorDesk.tsx")).toContain("export default function MirrorDesk()");
    const dash = read("src/pages/Dashboard.tsx");
    expect(dash).toContain('import MirrorDesk from "@/components/desk/MirrorDesk";');
    expect(dash).not.toContain("function MirrorDesk(");
    expect(dash).toContain('{id === "mirror" && <MirrorDesk />}');
  });
  test("the multi-party note seats six delegations", () => {
    expect(read("src/pages/Dashboard.tsx")).toContain(
      'note: "Seat up to six delegations at the table and calculate multi-party friction matrices across all bilateral pairs."',
    );
  });
  test("no empty catch in the loading screen; the control-byte regex carries a targeted suppression", () => {
    expect(read("src/components/LoadingScreen.tsx")).not.toMatch(/catch\s*\{\s*\}/);
    expect(read("src/lib/sanitizer.ts")).toMatch(/eslint-disable-next-line no-control-regex\nconst CONTROL_CHARS =/);
  });
  test("the air-gap audit enters through the Mission Foyer before the preset selector", () => {
    const py = read("qa/audit_airgap_egress.py");
    expect(py.indexOf("Open Scenario Library")).toBeGreaterThan(-1);
    expect(py.indexOf("Open Scenario Library")).toBeLessThan(py.indexOf('select[data-testid="theatre-preset"]'));
  });
  test("the roadmap leaves only the Master Architecture Family Tree PDF open", () => {
    const open = read("roadmap.md").split("\n").filter((l) => l.startsWith("- [ ]"));
    expect(open).toEqual(["- [ ] Master Architecture Family Tree PDF"]);
  });
  test("no dates or copyright years in the new and changed dashboard files", () => {
    for (const f of ["src/pages/Dashboard.tsx", "src/components/desk/MirrorDesk.tsx", "src/components/mode/ModeHeader.tsx", "src/components/desk/ChancellerySentinel.tsx", "roadmap.md"]) {
      expect(read(f)).not.toMatch(/©\s*\d{4}|copyright\s+\d{4}|\b20\d{2}-\d{2}-\d{2}\b/i);
    }
  });
});
