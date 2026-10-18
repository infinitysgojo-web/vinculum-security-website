import { describe, expect, test } from "bun:test";
import { CASES } from "../src/content/cases";
import { applyInscriptions, distanceTable, mathReading, rankCases, sanitizeSignals, withCaseMatches } from "../src/components/desk/engine";

const slugs = (v: number[]) => rankCases(v).map((m) => m.slug);

describe("top three nearest cases", () => {
  test("returns three cases, closest first", () => {
    const r = rankCases([2.6, 2.2, 2.4, 2.8]);
    expect(r).toHaveLength(3);
    expect(r[0].slug).toBe("cambodia");
    expect(r[0].distance).toBeLessThanOrEqual(r[1].distance);
    expect(r[1].distance).toBeLessThanOrEqual(r[2].distance);
  });

  test("a low reading no longer surfaces Cambodia alone", () => {
    const r = slugs([2.6, 2.2, 2.4, 2.8]);
    expect(r).toContain("cambodia");
    expect(new Set(r).size).toBe(3);
  });

  test("tied cases both appear, in canonical order", () => {
    // Rwanda and South Africa share the vector (3, 3, 2, 2).
    const r = slugs([3, 3, 2, 2]);
    const iR = CASES.findIndex((c) => c.slug === "rwanda");
    const iS = CASES.findIndex((c) => c.slug === "south-africa");
    expect(r.slice(0, 2)).toEqual(iR < iS ? ["rwanda", "south-africa"] : ["south-africa", "rwanda"]);
  });

  test("nearest stays the first of the three", () => {
    for (const v of [[3, 3, 3, 3], [2.9, 2.5, 2.3, 2.6], [4, 3, 2, 5], [1, 1, 1, 1], [5, 5, 5, 5]] as [number, number, number, number][]) {
      const m = mathReading(v);
      expect(m.topThree).toHaveLength(3);
      expect(m.nearest).toEqual(m.topThree[0]);
    }
  });

  test("the distance table ranks exactly three rows and flags the closest", () => {
    const t = distanceTable([2.9, 2.5, 2.3, 2.6]);
    expect(t.filter((r) => r.rank !== null).map((r) => r.rank).sort()).toEqual([1, 2, 3]);
    const first = t.find((r) => r.rank === 1)!;
    expect(first.nearest).toBe(true);
    expect(t.filter((r) => r.nearest)).toHaveLength(1);
    expect(t.map((r) => r.slug).filter((s) => t.find((x) => x.slug === s)!.rank !== null)).toEqual(
      expect.arrayContaining(rankCases([2.9, 2.5, 2.3, 2.6]).map((m) => m.slug)),
    );
  });
});

test("imported mission signals keep the top-three list", () => {
  const s = sanitizeSignals({ analogue: "Cambodia", analogues: ["Cambodia", "Rwanda", "South Africa"] });
  expect(s.analogues).toEqual(["Cambodia", "Rwanda", "South Africa"]);
});

describe("top three follow any vector, not just presets", () => {
  // Deterministic pseudo-random vectors across the whole 1.0 to 5.0 scale.
  let seed = 20261018;
  const rnd = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
  const vec = () => [0, 0, 0, 0].map(() => Math.round((1 + rnd() * 4) * 10) / 10) as [number, number, number, number];
  const brute = (v: number[]) =>
    CASES.map((c, i) => ({ slug: c.slug, i, d: Math.hypot(...c.scores.map((x, k) => x - v[k])) }))
      .sort((a, b) => (Math.abs(a.d - b.d) > 1e-9 ? a.d - b.d : a.i - b.i))
      .slice(0, 3)
      .map((x) => x.slug);

  test("5,000 random readings each rank exactly the three nearest cases", () => {
    const seen = new Set<string>();
    for (let n = 0; n < 5000; n++) {
      const v = vec();
      const got = slugs(v);
      expect(got).toEqual(brute(v));
      const t = distanceTable(v);
      expect([1, 2, 3].map((k) => t.find((r) => r.rank === k)!.slug)).toEqual(got);
      expect(mathReading(v).nearest.slug).toBe(got[0]);
      got.forEach((s) => seen.add(s));
    }
    // Every documented case can surface somewhere in the top three.
    expect(seen.size).toBe(CASES.length);
  });

  test("the effective state re-derives the top three from its bonds", () => {
    const s = applyInscriptions({ bonds: { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 } });
    expect(s.analogues).toEqual(rankCases([3, 3, 3, 3]).map((m) => m.shortTitle));
    expect(s.analogue).toBe(s.analogues![0]);
  });

  test("inscribed shocks re-rank against the stressed vector", () => {
    const bonds = { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 };
    const shock = { id: "x", name: "Coup", description: "", deltas: { interpersonal: -1, communal: -1, intergenerational: -1, institutional: -1 } };
    const s = applyInscriptions({ bonds, customShocks: [shock] });
    expect(s.analogues).toEqual(rankCases([2, 2, 2, 2]).map((m) => m.shortTitle));
    expect(s.analogue).toBe("Cambodia");
  });

  test("a stale published ranking is replaced, and an unchanged one keeps identity", () => {
    const bonds = { interpersonal: 4, communal: 3, intergenerational: 2, institutional: 5 };
    const fresh = withCaseMatches({ bonds, analogue: "Cambodia", analogues: ["Cambodia"] });
    expect(fresh.analogues).toEqual(rankCases([4, 3, 2, 5]).map((m) => m.shortTitle));
    expect(withCaseMatches(fresh)).toBe(fresh);
    expect(withCaseMatches({})).toEqual({});
  });
});
