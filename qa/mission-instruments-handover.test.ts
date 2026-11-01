import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { GLOSSARY } from "../src/content/glossary";
import { LEXICON } from "../src/components/desk/lexiconData";
import { sanitizeSignals, telemetryLines } from "../src/components/desk/engine";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

describe("public glossary mirrors the three instruments", () => {
  const want = [
    ["decay-horizon", "Decay Horizon (Stability Half-Life)", "method"],
    ["enforceability", "Dispute Forum Enforceability Matrix", "core"],
    ["escrow", "Conditional Escrow Waterfall Protocol", "field"],
  ] as const;

  for (const [id, term, category] of want) {
    test(`${term} is in ${category} with no published method`, () => {
      const g = GLOSSARY.find((x) => x.id === id);
      expect(g?.term).toBe(term);
      expect(g?.category).toBe(category);
      expect(g?.formula).toBeUndefined();
      expect(g!.short.length).toBeGreaterThan(80);
    });
  }

  test("no public surface publishes a desk formula or weight", () => {
    const pub = [JSON.stringify(GLOSSARY), read("src/content/commentary.ts"), read("public/llms.txt"), read("public/llms-full.txt")].join(" ");
    for (const leak of ["÷ 2000", "0.5 × teeth", "0.30 A", "Σ sev", "ln(meanBond", "4,200 ×", "E − 18", "max(S) − min(S)"]) expect(pub).not.toContain(leak);
    expect(GLOSSARY.every((g) => !g.formula)).toBe(true);
  });

  test("glossary ids are unique and the Lexicon shows each id once", () => {
    const g = GLOSSARY.map((x) => x.id);
    expect(new Set(g).size).toBe(g.length);
    const l = LEXICON.map((x) => x.id);
    expect(new Set(l).size).toBe(l.length);
  });
});

describe("instrument signals ride the browser-local bus", () => {
  const live = {
    bonds: { interpersonal: 2.5, communal: 1.6, intergenerational: 1.4, institutional: 1.8 },
    decayConstant: 0.05,
    stabilityHalfLifeDays: 13.9,
    projectedDegradation: 0.42,
    disputeForum: "PCA / The Hague",
    disputeForumId: "pca",
    activeForumScore: 56,
    enforcementFriction: 44,
    immunityWaived: false,
    neutralSeat: true,
    escrowReleasedPercent: 0,
    escrowFrozen: true,
    escrowTranchesMet: 1,
  };

  test("all twelve instrument signals survive archive sanitising", () => {
    const s = sanitizeSignals(JSON.parse(JSON.stringify(live)));
    for (const k of ["decayConstant", "stabilityHalfLifeDays", "projectedDegradation", "disputeForum", "disputeForumId", "activeForumScore", "enforcementFriction", "immunityWaived", "neutralSeat", "escrowReleasedPercent", "escrowFrozen", "escrowTranchesMet"] as const)
      expect(s[k]).toEqual(live[k]);
  });

  test("telemetry carries them into every brief and the Binder", () => {
    const t = telemetryLines(live).join("\n");
    expect(t).toContain("Decay horizon: λ 0.0500, stability half-life 13.9 days, mean bond loss 0.42");
    expect(t).toContain("Dispute forum (Desk 11): PCA / The Hague, venue fitness 56 of 100, enforcement friction 44; immunity unaddressed");
    expect(t).toContain("Conditional escrow (Desk 07): frozen");
  });

  test("the instruments engine is pure: no network, storage, secrets or cloud client", () => {
    const src = read("src/components/desk/instruments.ts");
    expect(src).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket|sendBeacon|supabase|localStorage|indexedDB|import\.meta\.env|apiKey|secret/i);
    expect(src.match(/^import .*$/gm) ?? []).toEqual(['import type { BondVector } from "./engine";']);
  });
});

describe("public Relational Atlas never routes into the private portal", () => {
  const PUBLIC = /^(\/cases(\/\$\{[^}]+\})?|\/methodology|\/practice|\/the-vinculum-dashboard|\/commentary(#[a-z-]+)?|\/glossary(#[a-z-]+)?)$/;

  for (const file of ["src/pages/Cases.tsx", "src/components/RelationalAtlas.tsx"]) {
    test(`${file} links only to public scholarly views`, () => {
      const src = read(file);
      expect(src).not.toMatch(/["'`]\/(dashboard|login)\b/);
      const targets = [...src.matchAll(/(?:to=\{?|href=|navigate\()\s*["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
      expect(targets.length).toBeGreaterThan(0);
      for (const t of targets) expect(t).toMatch(PUBLIC);
    });
  }

  test("no public page or component outside the portal names /dashboard or /login", () => {
    const walk = (d: string): string[] =>
      readdirSync(d).flatMap((n) => (statSync(join(d, n)).isDirectory() ? walk(join(d, n)) : [join(d, n)]));
    const root = new URL("../src", import.meta.url).pathname;
    const offenders = walk(root)
      .filter((f) => /\.(tsx?|jsx?)$/.test(f))
      .filter((f) => !/\/pages\/(Dashboard|Login)\.tsx$|\/App\.tsx$|\/components\/desk\//.test(f))
      .filter((f) => /["'`]\/(dashboard|login)["'`#?/]/.test(readFileSync(f, "utf8")));
    expect(offenders).toEqual([]);
  });
});
