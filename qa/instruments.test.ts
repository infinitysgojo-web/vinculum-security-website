import { describe, expect, test } from "bun:test";
import { decayHorizon, enforceability, escrowWaterfall, FORUMS } from "../src/components/desk/instruments";

const B = { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 };

describe("decay horizon", () => {
  test("λ = (U + R) ÷ 2000 and T½ = ln2 ÷ λ", () => {
    const r = decayHorizon(B, [0, 0, 0, 0], 60, 40, 12);
    expect(r.lambda).toBeCloseTo(0.05, 10);
    expect(r.halfLife!).toBeCloseTo(13.863, 3);
  });
  test("no exposure and no rupture means no decay", () => {
    const r = decayHorizon(B, [0, 0, 0, 0], 0, 0, 36);
    expect(r.halfLife).toBeNull();
    expect(r.meanLoss).toBe(0);
  });
  test("bonds never fall below the 1.0 floor", () => {
    const r = decayHorizon(B, [100, 100, 100, 100], 500, 100, 36);
    r.bonds.forEach((b) => expect(b.then).toBeGreaterThanOrEqual(1));
  });
});

describe("dispute enforceability", () => {
  test("ICSID scores 74", () => expect(enforceability(FORUMS.find((f) => f.id === "icsid")!)).toBe(74));
  test("ICJ scores 46", () => expect(enforceability(FORUMS.find((f) => f.id === "icj")!)).toBe(46));
});

describe("escrow waterfall", () => {
  test("releases only met tranches", () => {
    const r = escrowWaterfall([40, 35, 25], { verifierSeated: true, communal: 3.0, intergenerational: 2.9, rupture: 20 });
    expect(r.released).toBe(75);
  });
  test("freezes everything at rupture 60", () => {
    const r = escrowWaterfall([40, 35, 25], { verifierSeated: true, communal: 4, intergenerational: 4, rupture: 60 });
    expect(r.released).toBe(0);
    expect(r.frozen).toBe(true);
  });
});
