import { describe, expect, test } from "bun:test";
import { CASES } from "../src/content/cases";
import { distanceTable, mathReading, rankCases, sanitizeSignals } from "../src/components/desk/engine";

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
