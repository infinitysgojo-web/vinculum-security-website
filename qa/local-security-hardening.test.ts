import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EMPTY_STORE, createCustomWorkspace, readStore, validateRecord, type Workspace, type WorkspaceStore } from "../src/components/mode/workspace";
import { REPLAY_LIMIT, boundHistory, lastGoodKey, localStorageBytes, pendingKey, transactionalRead, transactionalWrite } from "../src/components/mode/localPersistence";
import { buildPackage, decryptPackageText, encryptPackage, planImport, readPackage } from "../src/components/mode/transfer";
import { IMPORT_LIMITS, checkPayload } from "../src/lib/payloadLimits";
import { prohibitedCharacters, prohibitedCharactersDeep } from "../src/lib/sanitizer";
import { guardSignalPatch, isKnownPublisher } from "../src/components/desk/signalGuard";
import MissionFoyer from "../src/components/mode/MissionFoyer";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const warrant = { title: "Corridor mission", objective: "Stabilise", theatre: "Corridor", custodian: "Desk officer", authority: "Mandate", handling: "Restricted", scope: "Corridor only" };
const ws = (patch: Partial<Workspace> = {}): Workspace => ({ ...createCustomWorkspace(warrant), ...patch });
const storeOf = (...w: Workspace[]): WorkspaceStore => ({ ...EMPTY_STORE, workspaces: w, quarantine: [] });

/** In-memory Storage with an optional byte quota, to exercise refused writes. */
class MemStorage {
  m = new Map<string, string>();
  constructor(private quota = Infinity) {}
  get length() { return this.m.size; }
  key(i: number) { return [...this.m.keys()][i] ?? null; }
  getItem(k: string) { return this.m.has(k) ? this.m.get(k)! : null; }
  removeItem(k: string) { this.m.delete(k); }
  setItem(k: string, v: string) {
    const used = [...this.m.entries()].reduce((n, [kk, vv]) => n + (kk === k ? 0 : kk.length + vv.length), 0);
    if (used + k.length + v.length > this.quota) throw new DOMException("full", "QuotaExceededError");
    this.m.set(k, v);
  }
}

describe("1. save, restore and last-known-good recovery", () => {
  test("a transactional write promotes a validated copy and keeps the previous one as last known-good", () => {
    const s = new MemStorage();
    const a = storeOf(ws({ title: "First" }));
    const b = storeOf(ws({ title: "Second" }));
    expect(transactionalWrite(s, "vinculum-workspaces:u", a).ok).toBe(true);
    expect(transactionalWrite(s, "vinculum-workspaces:u", b).ok).toBe(true);
    expect(s.getItem(pendingKey("vinculum-workspaces:u"))).toBeNull();
    expect(JSON.parse(s.getItem(lastGoodKey("vinculum-workspaces:u"))!).workspaces[0].title).toBe("First");
    expect(transactionalRead(s, "vinculum-workspaces:u").store.workspaces[0].title).toBe("Second");
  });
  test("a truncated current copy falls back to last known-good and the bad text is quarantined", () => {
    const s = new MemStorage();
    transactionalWrite(s, "k", storeOf(ws({ title: "Good" })));
    transactionalWrite(s, "k", storeOf(ws({ title: "Newer" })));
    s.m.set("k", s.getItem("k")!.slice(0, 40));
    const r = transactionalRead(s, "k");
    expect(r.recovered).toBe("last-good");
    expect(r.store.workspaces[0].title).toBe("Good");
    expect(r.store.quarantine).toHaveLength(1);
    expect(r.error).toContain("last known-good");
  });
  test("a refused write (storage full) leaves the current copy untouched", () => {
    const s = new MemStorage(6000);
    const small = storeOf(ws({ title: "Small" }));
    expect(transactionalWrite(s, "k", small).ok).toBe(true);
    const huge = storeOf(ws({ title: "x".repeat(10_000) }));
    const r = transactionalWrite(s, "k", huge);
    expect(r).toEqual({ ok: false, reason: "quota" });
    expect(transactionalRead(s, "k").store.workspaces[0].title).toBe("Small");
    expect(s.getItem(pendingKey("k"))).toBeNull();
  });
  test("an interrupted save whose pending copy is complete is recovered", () => {
    const s = new MemStorage();
    s.setItem(pendingKey("k"), JSON.stringify(storeOf(ws({ title: "Pending" }))));
    const r = transactionalRead(s, "k");
    expect(r.recovered).toBe("pending");
    expect(r.store.workspaces[0].title).toBe("Pending");
  });
  test("history is bounded; desk state, notes and decisions are not trimmed", () => {
    const replay = Array.from({ length: REPLAY_LIMIT + 50 }, (_, i) => ({ at: String(i), kind: "k", detail: "d" }));
    const w = ws({ replay, tray: [{ id: "t", panel: "assumptions", status: "assumption", text: "keep", at: "" }] });
    const b = boundHistory(storeOf(w)).workspaces[0];
    expect(b.replay).toHaveLength(REPLAY_LIMIT);
    expect(b.replay[0].at).toBe("50");
    expect(b.tray).toHaveLength(1);
  });
  test("storage usage counts only this app's keys", () => {
    const s = new MemStorage();
    s.setItem("vinculum-workspaces:u", "abcd");
    s.setItem("other-site", "x".repeat(100));
    expect(localStorageBytes(s as unknown as Storage)).toBe(("vinculum-workspaces:u".length + 4) * 2);
  });
});

describe("2. corrupt, truncated, oversized, deeply nested and unsupported-version input", () => {
  test("deep nesting, huge lists, huge strings, non-JSON values and reserved keys are refused", () => {
    let deep: unknown = "x";
    for (let i = 0; i < 40; i++) deep = [deep];
    expect(checkPayload(deep, IMPORT_LIMITS).reason).toContain("deeper");
    expect(checkPayload(new Array(10_001).fill(0), IMPORT_LIMITS).reason).toContain("list longer");
    expect(checkPayload("x".repeat(200_001), IMPORT_LIMITS).reason).toContain("text value longer");
    expect(checkPayload({ a: Number.NaN }, IMPORT_LIMITS).ok).toBe(false);
    expect(checkPayload(JSON.parse('{"__proto__": {"polluted": true}}'), IMPORT_LIMITS).reason).toContain("reserved");
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });
  test("truncated or oversized import files are refused whole", async () => {
    const p = JSON.stringify(await buildPackage([ws()], "handover"));
    expect((await readPackage(p.slice(0, p.length / 2))).error).toContain("not valid JSON");
    expect((await readPackage(" ".repeat(IMPORT_LIMITS.maxBytes + 1))).error).toContain("larger than 20 MB");
  });
  test("future package and workspace versions, and unknown critical fields, are refused", async () => {
    const p = await buildPackage([ws()], "handover");
    expect((await readPackage(JSON.stringify({ ...p, packageVersion: 2 }))).ok).toBe(false);
    expect((await readPackage(JSON.stringify({ ...p, workspaceSchema: 9 }))).ok).toBe(false);
    expect((await readPackage(JSON.stringify({ ...p, critical: ["workspaces", "remoteKeyServer"] }))).error).toContain("does not understand");
    expect((await readPackage(JSON.stringify({ ...p, extraNote: "ignored, not critical" }))).ok).toBe(true);
  });
  test("a stored record from a newer version is quarantined with its reason", () => {
    const r = readStore({ schema: 1, workspaces: [{ ...ws(), schema: 5 }] });
    expect(r.store.workspaces).toHaveLength(0);
    expect((r.store.quarantine[0] as { reason: string }).reason).toContain("newer version");
  });
});

describe("3. digest match, mismatch, duplicates and no overwrite", () => {
  test("match and mismatch are reported as an integrity comparison", async () => {
    const p = await buildPackage([ws()], "handover");
    expect((await readPackage(JSON.stringify(p))).digest).toBe("match");
    const bad = { ...p, workspaces: [{ ...p.workspaces[0], title: "edited" }] };
    expect((await readPackage(JSON.stringify(bad))).digest).toBe("mismatch");
  });
  test("re-importing the same export is detected and defaults to opening the existing workspace", async () => {
    const w = ws();
    const r = await readPackage(JSON.stringify(await buildPackage([w], "handover")));
    const plan = planImport(r.items, [w]);
    expect(plan[0].duplicate).toBe("identical");
    expect(plan[0].options).toEqual(["open", "keep-both", "skip"]);
  });
});

describe("4. cross-desk signals at the bus boundary", () => {
  test("unknown publishers and non-object payloads are refused", () => {
    expect(guardSignalPatch("rogue-desk", { rupture: 1 })).toBeNull();
    expect(guardSignalPatch("sentinel", [1, 2] as never)).toBeNull();
    expect(guardSignalPatch("sentinel", Object.create({ rupture: 1 }))).toBeNull();
    expect(isKnownPublisher("inscription:customParties")).toBe(true);
    expect(isKnownPublisher("inscription:__proto__")).toBe(false);
  });
  test("non-finite numbers, wrong types and unknown keys are dropped; bonds are clamped; clears survive", () => {
    const out = guardSignalPatch("sentinel", { rupture: Number.POSITIVE_INFINITY, trackGap: Number.NaN, weakestBond: 7, bonds: { interpersonal: 99, communal: -4, intergenerational: 3, institutional: "2.5" }, evil: "x", theatre: undefined } as never)!;
    expect("rupture" in out).toBe(false);
    expect("trackGap" in out).toBe(false);
    expect("weakestBond" in out).toBe(false);
    expect("evil" in out).toBe(false);
    expect(out.bonds).toEqual({ interpersonal: 5, communal: 1, intergenerational: 3, institutional: 2.5 });
    expect("theatre" in out && out.theatre === undefined).toBe(true);
  });
  test("the dashboard publishes only through the guard", () => {
    const dash = read("src/pages/Dashboard.tsx");
    expect(dash).toContain("const patch = guardSignalPatch(desk, raw);");
    expect(read("src/components/mode/workspace.ts")).toContain("sanitizeSignals(s.signals)");
  });
});

describe("5. invisible and bidirectional characters", () => {
  test("bidi controls, zero-width marks, BOM and control bytes are prohibited", () => {
    expect(prohibitedCharacters("pay\u202Eevil")).toEqual(["U+202E"]);
    expect(prohibitedCharacters("a\u2066b\u2069")).toEqual(["U+2066", "U+2069"]);
    expect(prohibitedCharacters("x\u200By\uFEFF\x07")).toEqual(["U+0007", "U+200B", "U+FEFF"]);
    expect(prohibitedCharacters("trea\u200Cty")).toEqual(["U+200C"]);
  });
  test("joiners that are spelling in joining scripts, and ordinary text, are allowed", () => {
    expect(prohibitedCharacters("می\u200Cخواهم")).toEqual([]);
    expect(prohibitedCharacters("क्\u200Dष")).toEqual([]);
    expect(prohibitedCharacters("40 km² · ½ · Vinculum™\n\tline")).toEqual([]);
  });
  test("restored and imported text follow the same rule: rejected to quarantine, not rewritten", () => {
    const bad = ws({ title: "Mission\u202E" });
    expect(validateRecord(bad).ok).toBe(false);
    const r = readStore({ schema: 1, workspaces: [bad] });
    expect((r.store.quarantine[0] as { record: Workspace }).record.title).toBe("Mission\u202E");
    expect(prohibitedCharactersDeep({ "k\u200B": ["ok", "x\u202Ay"] })).toEqual(["U+200B", "U+202A"]);
  });
  test("paste rejects prohibited text instead of rewriting it", () => {
    const src = read("src/lib/sanitizeFields.ts");
    expect(src).toContain("Paste blocked");
    expect(src).toContain("e.preventDefault();");
    expect(src).not.toMatch(/onKeyDown|onInput|keystroke\s*=/);
  });
});

describe("6. hostile strings render as plain text", () => {
  test("a hostile workspace title is escaped, never interpreted", () => {
    const hostile = ws({ title: `<img src=x onerror=alert(1)><script>alert(2)</script>` });
    const html = renderToStaticMarkup(
      createElement(MissionFoyer, { workspaces: [hostile], lastMode: null, network: { online: true, cached: true }, legacyDraft: false, onAction: () => {} } as never),
    );
    expect(html).not.toContain("<script>");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
  });
  test("no raw HTML rendering anywhere in the dashboard, desk or mode code", () => {
    for (const dir of ["src/components/desk", "src/components/mode", "src/pages"]) {
      const d = new URL(`../${dir}`, import.meta.url).pathname;
      for (const f of readdirSync(d)) {
        if (!/\.tsx?$/.test(f)) continue;
        const src = readFileSync(join(d, f), "utf8");
        expect(src.includes("dangerouslySetInnerHTML") ? `${dir}/${f}` : "").toBe("");
        expect(/\.innerHTML\s*=|insertAdjacentHTML|new Function\(|\beval\(/.test(src) ? `${dir}/${f}` : "").toBe("");
      }
    }
  });
  test("imports are parsed as data only: no dynamic import, fetch or evaluation", () => {
    const src = read("src/components/mode/transfer.ts") + read("src/components/mode/LocalDataDialog.tsx");
    expect(src).not.toMatch(/fetch\(|import\(|new Function|\beval\(|innerHTML|window\.open|location\.(href|assign)/);
  });
});

describe("7. lock, idle, panic and the single Sentinel owner", () => {
  const sentinel = read("src/components/desk/ChancellerySentinel.tsx");
  test("the Sentinel overwrites app-copied clipboard content on lock and before idle", () => {
    expect(sentinel).toContain("if (locked) void clearAppClipboard();");
    expect(sentinel).toContain("void clearAppClipboard();\n        idleCb.current();");
    expect(sentinel).toContain("{locked ? lockScreen : children}");
  });
  test("the clipboard guard keeps only a marker, never the copied text", () => {
    const g = read("src/lib/clipboardGuard.ts");
    expect(g.match(/^let /gm)).toHaveLength(1);
    expect(g).toContain("let wroteByApp = false;");
  });
  test("no other dashboard file owns an inactivity timer or the panic keys", () => {
    for (const dir of ["src/components/mode", "src/components/desk"]) {
      const d = new URL(`../${dir}`, import.meta.url).pathname;
      for (const f of readdirSync(d)) {
        if (f === "ChancellerySentinel.tsx" || !/\.tsx?$/.test(f)) continue;
        const src = readFileSync(join(d, f), "utf8");
        expect(/TRIPLE_ESCAPE|ctrlKey && e\.shiftKey && e\.key === "X"|"mousemove"/.test(src) ? `${dir}/${f}` : "").toBe("");
      }
    }
  });
  test("panic purge still covers the new transactional keys by prefix", () => {
    const { PURGED_LOCAL_KEY } = require("../src/lib/panicPurge");
    for (const k of ["vinculum-workspaces:u", "vinculum-workspaces:u:pending", "vinculum-workspaces:u:last-good"]) expect(PURGED_LOCAL_KEY.test(k)).toBe(true);
  });
});

describe("8. exported data carries no secrets or transient state", () => {
  test("a package holds workspaces only: no passphrase, key, session or token fields", async () => {
    const text = JSON.stringify(await buildPackage([ws()], "backup"));
    expect(text).not.toMatch(/passphrase|CryptoKey|saltHex|ciphertext|vs:offline-session|access_token|refresh_token|sb-[a-z0-9]+-auth/i);
  });
  test("an encrypted package never contains the passphrase or plaintext, and opens only with it", async () => {
    const pkg = await buildPackage([ws({ title: "Secret corridor" })], "handover");
    const phrase = "correct horse battery staple";
    const sealed = JSON.stringify(await encryptPackage(pkg, phrase));
    expect(sealed).not.toContain(phrase);
    expect(sealed).not.toContain("Secret corridor");
    expect((await readPackage(sealed)).encrypted).toBe(true);
    const plain = await decryptPackageText(sealed, phrase);
    expect((await readPackage(plain)).items[0].workspace.title).toBe("Secret corridor");
    await expect(decryptPackageText(sealed, "wrong passphrase!!")).rejects.toThrow();
    await expect(encryptPackage(pkg, "short")).rejects.toThrow();
  });
  test("passphrase inputs are password fields that the sanitizer never touches, and are cleared on close", () => {
    const src = read("src/components/mode/LocalDataDialog.tsx");
    expect(src.match(/type="password"/g)?.length).toBe(3);
    expect(src).not.toMatch(/localStorage|sessionStorage/);
    expect(src).toContain('setPass("");');
  });
  test("file names do not carry the theatre by default", () => {
    expect(read("src/components/desk/ChancelleryBreviary.tsx")).not.toContain("Vinculum-Breviary-${slug}");
  });
  test("production consoles do not log error details", () => {
    for (const f of ["src/components/RouteErrorBoundary.tsx", "src/components/DossierDownload.tsx", "src/components/WallChart.tsx"]) {
      expect(read(f)).toContain("if (import.meta.env.DEV) console.error(");
    }
  });
});

describe("9. CSP and headers keep the preview working", () => {
  const cfg = JSON.parse(read("vercel.json")) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
  const csps = cfg.headers.flatMap((h) => h.headers.filter((x) => x.key === "Content-Security-Policy").map((x) => x.value));
  test("every CSP blocks objects, pins base-uri and form-action, and frames only self and Lovable", () => {
    expect(csps.length).toBeGreaterThanOrEqual(2);
    for (const c of csps) {
      expect(c).toContain("object-src 'none'");
      expect(c).toContain("base-uri 'self'");
      expect(c).toContain("form-action 'self'");
      const fa = /frame-ancestors ([^;]+)/.exec(c)![1].split(/\s+/);
      for (const src of fa) expect(src === "'self'" || /^https:\/\/(\*\.)?(lovable\.dev|lovable\.app|lovableproject\.com)$/.test(src)).toBe(true);
      expect(c).not.toMatch(/frame-ancestors[^;]*\*(?!\.)/);
      expect(c).toContain("img-src 'self' data: blob:");
      expect(c).not.toMatch(/img-src[^;]*https:/);
    }
  });
  test("no parent-navigation or hide-on-error framing scripts", () => {
    const html = read("index.html");
    expect(html).not.toMatch(/top\.location|parent\.location|self\s*!==\s*top|window\.top\s*!==/);
  });
  test("security.txt is kept", () => {
    expect(read("public/.well-known/security.txt")).toMatch(/Contact:/);
  });
});
