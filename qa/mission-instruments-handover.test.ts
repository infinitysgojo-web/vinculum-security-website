import { describe, expect, test } from "bun:test";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { GLOSSARY } from "../src/content/glossary";
import { LEXICON } from "../src/components/desk/lexiconData";
import { FORUMS, enforceability } from "../src/components/desk/instruments";
import { sanitizeSignals, telemetryLines } from "../src/components/desk/engine";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

describe("public glossary mirrors the three instruments", () => {
  const want = [
    ["decay-horizon", "Decay Horizon (Stability Half-Life)", "method"],
    ["enforceability", "Dispute Forum Enforceability Matrix", "core"],
    ["escrow", "Conditional Escrow Waterfall Protocol", "field"],
  ] as const;

  for (const [id, term, category] of want) {
    test(`${term} is in ${category} with a formal statement`, () => {
      const g = GLOSSARY.find((x) => x.id === id);
      expect(g?.term).toBe(term);
      expect(g?.category).toBe(category);
      expect(g?.formula?.length ?? 0).toBeGreaterThan(2);
      expect(g!.short.length).toBeGreaterThan(80);
    });
  }

  test("the equations are the ones the engine runs", () => {
    const f = (id: string) => GLOSSARY.find((x) => x.id === id)!.formula!.join(" ");
    expect(f("decay-horizon")).toContain("λ = (U + R) ÷ 2000");
    expect(f("decay-horizon")).toContain("T½ = ln 2 ÷ λ");
    expect(f("decay-horizon")).toContain("B_i(t) = 1 + (B_i − 1) × e^(−λ_i t)");
    expect(f("enforceability")).toContain("E = 100 × (0.5 × teeth + 0.3 × (6 − immunity) + 0.2 × pace) ÷ 5");
    expect(f("escrow")).toContain("60 per cent");
    expect(f("escrow")).toContain("Final Cession");
    expect(f("enforceability")).toContain("E − 18");
  });

  test("the published bench values match the engine for every forum", () => {
    const line = GLOSSARY.find((x) => x.id === "enforceability")!.formula!.find((l) => l.startsWith("Bench values"))!;
    expect(line.match(/; /g)?.length).toBe(FORUMS.length - 1);
    for (const forum of FORUMS) {
      const short = forum.name.replace(" (CCJA)", "");
      expect(line).toContain(`${short} ${enforceability(forum)}`);
    }
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
    decayHalfLife: 13.9,
    projectedDegradation: 0.42,
    disputeForum: "Permanent Court of Arbitration",
    disputeEnforceability: 74,
    immunityWaived: false,
    escrowReleased: 0,
    escrowFrozen: true,
    escrowTranchesMet: 1,
    decayConstant: 0.05,
    stabilityHalfLifeDays: 423,
  };

  test("all ten instrument signals survive archive sanitising", () => {
    const s = sanitizeSignals(JSON.parse(JSON.stringify(live)));
    for (const k of ["decayHalfLife", "projectedDegradation", "decayConstant", "stabilityHalfLifeDays", "disputeForum", "disputeEnforceability", "immunityWaived", "escrowReleased", "escrowFrozen", "escrowTranchesMet"] as const)
      expect(s[k]).toEqual(live[k]);
  });

  test("telemetry carries them into every brief and the Binder", () => {
    const t = telemetryLines(live).join("\n");
    expect(t).toContain("treaty half-life 13.9 months (423 days), λ 0.0500 per month, mean bond loss 0.42");
    expect(t).toContain("Dispute forum: Permanent Court of Arbitration, venue fitness 74 of 100; immunity not waived");
    expect(t).toContain("Conditional escrow: frozen");
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
