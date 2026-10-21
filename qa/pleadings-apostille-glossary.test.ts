import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { ADMISSIBILITY, FORUMS, pleadingForum, pleadingHeads, pleadingLines } from "../src/components/desk/instruments";
import { apostilleCertificate, apostilleFile, canonicalJson, mintChancelleryApostille, verifyChancelleryApostille } from "../src/components/desk/registry";
import { GLOSSARY } from "../src/content/glossary";
import { LEXICON } from "../src/components/desk/lexiconData";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const LIVE = {
  bonds: { interpersonal: 3.4, communal: 1.8, intergenerational: 2.6, institutional: 3.1 },
  weakestBond: "Communal",
  weakestScore: 1.8,
  rupture: 44,
  covenants: ["Office continuity", "Communal restitution"],
  disputeForum: "PCA / The Hague",
  disputeForumId: "pca",
  immunityWaived: false,
  theatre: "Great Lakes Region",
};

describe("Desk 13 pleadings bench", () => {
  test("heads follow the spec order and read the dispute forum first", () => {
    const p = pleadingHeads({ ...LIVE, litigationForum: "Regional human rights court" });
    expect(p.heads.map((h) => h.title)).toEqual([
      "I. Jurisdictional foundation",
      "II. Substantive relational breach",
      "III. Sovereign covenants at risk",
      "IV. Provisional measures",
    ]);
    expect(p.heads[0].body).toContain("PCA / The Hague");
    expect(p.heads[0].body).toContain("immunity objection");
    expect(p.ready).toBe(4);
  });

  test("every Forum Matrix venue has admissibility criteria and resolves from the bus", () => {
    for (const f of FORUMS) expect(ADMISSIBILITY[f.id]?.length ?? 0).toBeGreaterThan(40);
    expect(pleadingForum({ disputeForumId: "icsid" })?.teeth).toBe(5);
    expect(pleadingForum({ disputeForum: "ICJ Advisory" })?.id).toBe("icj");
  });

  test("export section IV carries the citation, teeth, admissibility and all four heads", () => {
    const t = pleadingLines(LIVE).join("\n");
    expect(t.startsWith("IV. DOCTRINAL PLEADINGS MATRIX")).toBe(true);
    expect(t).toContain("Forum citation: PCA / The Hague");
    expect(t).toContain("Enforcement teeth: 4 of 5 · base enforceability 74 of 100");
    expect(t).toContain("Admissibility:");
    expect(t).toContain("IV. PROVISIONAL MEASURES");
    const calm = pleadingLines({ ...LIVE, rupture: 20 }).join("\n");
    expect(calm).toContain("IV. PROVISIONAL MEASURES (NOT DRAFTED)");
    expect(calm).toContain("below the 40% threshold");
  });

  test("the workbench wires the heads into its card and its checklist", () => {
    const src = read("src/components/LitigationWorkbench.tsx");
    expect(src).toContain('from "@/components/desk/instruments"');
    expect(src).toContain("pleadingHeads(signals)");
    expect(src).toContain("...pleadingLines(signals)");
    expect(src).toContain("Doctrinal pleading heads");
    expect(src).toContain("V. EXAMINATION LINE");
    expect(src).toContain("VII. NOTE ON COMPILATION");
  });
});

describe("Desk 18 chancellery apostille", () => {
  test("canonical JSON is key-order independent and drops undefined", () => {
    expect(canonicalJson({ b: 1, a: { d: [1, undefined], c: undefined } })).toBe('{"a":{"d":[1,null]},"b":1}');
    expect(canonicalJson({ a: 1, b: 2 })).toBe(canonicalJson({ b: 2, a: 1 }));
    expect(canonicalJson({ x: Number.NaN })).toBe('{"x":null}');
  });

  test("mints an NV/VINC reference and a verifiable SHA-256 over signals and binder", async () => {
    const entries = [{ id: "cable", title: "Chancellery cable", text: "CABLE TEXT" }];
    const a = await mintChancelleryApostille(LIVE, entries);
    expect(a.ref).toMatch(/^NV\/VINC-GLR-[0-9A-F]{7}-\d{4}$/);
    expect(a.digest).toMatch(/^[0-9a-f]{64}$/);
    expect(await verifyChancelleryApostille(a)).toBe(true);
    expect(await verifyChancelleryApostille({ ...a, canonical: a.canonical.replace("CABLE TEXT", "CABLE TEXT.") })).toBe(false);
    const payload = JSON.parse(a.canonical);
    expect(payload.ref).toBe(a.ref);
    expect(payload.binder[0]).toEqual({ id: "cable", tab: 1, text: "CABLE TEXT", title: "Chancellery cable" });
    expect(payload.signals.disputeForumId).toBe("pca");
    const b = await mintChancelleryApostille(LIVE, entries);
    expect(b.ref).not.toBe(a.ref);
    expect(b.bodyKey).toBe(a.bodyKey);
  });

  test("certificate is a fixed-width monospace box and the file carries the raw payload", async () => {
    const a = await mintChancelleryApostille(LIVE, []);
    const lines = apostilleCertificate(a).split("\n");
    expect(lines[0].startsWith("+--- [CHANCELLERY APOSTILLE] ")).toBe(true);
    expect(new Set(lines.map((l) => l.length)).size).toBe(1);
    expect(lines.slice(1, -1).every((l) => l.startsWith("| ") && l.endsWith(" |"))).toBe(true);
    expect(lines.join("\n")).toContain(a.digest);
    const file = JSON.parse(apostilleFile(a));
    expect(file.format).toBe("vinculum.attest.v1");
    expect(file.canonical).toBe(a.canonical);
    expect(file.bodyKey).toBeUndefined();
  });

  test("the binder seals with Web Crypto, offers the attestation file and appends the box only while current", () => {
    const src = read("src/components/desk/MissionBinder.tsx");
    expect(src).toContain("Seal & mint chancellery apostille");
    expect(src).toContain("Download .vinculum.attest.json");
    expect(src).toContain('L.push("", bar, "CHANCELLERY APOSTILLE", bar, "", certificate)');
    expect(src).toContain("seal && sealCurrent");
    expect(read("src/components/desk/registry.ts")).toContain('crypto.subtle.digest("SHA-256"');
    expect(src).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon/);
  });
});

describe("cross-corpus glossary parity", () => {
  const g = (id: string) => GLOSSARY.find((x) => x.id === id);
  const l = (id: string) => LEXICON.find((x) => x.id === id);

  test("the three entries exist in the public glossary and the desk lexicon", () => {
    for (const [id, term] of [
      ["critical-fracture-window", "Critical Fracture Window"],
      ["resource-parity-index", "Resource Parity Index"],
      ["doctrinal-pleading-heads", "Doctrinal Pleading Heads"],
    ]) {
      expect(g(id)?.term).toBe(term);
      expect(l(id)?.term).toBe(term);
      expect(g(id)!.formula!.length).toBeGreaterThan(2);
    }
  });

  test("the formulations are stated exactly", () => {
    const f = (id: string) => g(id)!.formula!.join(" ");
    expect(f("critical-fracture-window")).toContain("t_f = ln(meanBond ÷ 2.0) ÷ λ");
    expect(f("resource-parity-index")).toContain("P = 100 − (max(S) − min(S))");
    expect(f("resource-parity-index")).toContain("S_communal ≥ 30%");
    expect(f("doctrinal-pleading-heads")).toContain("R ≥ 40 per cent");
    expect(l("critical-fracture-window")!.short).toContain("t_f = ln(meanBond ÷ 2.0) ÷ λ");
    expect(l("resource-parity-index")!.short).toContain("P = 100 − (max(S) − min(S))");
  });
});
