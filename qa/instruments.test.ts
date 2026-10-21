import { describe, expect, test } from "bun:test";
import { DEFAULT_ESCROW, decayHorizon, enforceability, escrowWaterfall, forumFitness, FORUMS } from "../src/components/desk/instruments";

const B = { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 };

describe("decay horizon", () => {
  test("λ = (U + R) ÷ 2000 and t½ = ln2 ÷ λ in days", () => {
    const r = decayHorizon(B, 60, 40, 30);
    expect(r.lambda).toBeCloseTo(0.05, 10);
    expect(r.halfLifeDays!).toBeCloseTo(13.863, 3);
    expect(r.bonds[0].then).toBeCloseTo(Math.max(1, 3 * Math.exp(-0.05 * 30)), 2);
  });
  test("zero exposure and zero rupture preserve the baseline", () => {
    const r = decayHorizon(B, 0, 0, 365);
    expect(r.halfLifeDays).toBeNull();
    expect(r.meanLoss).toBe(0);
    r.bonds.forEach((b) => expect(b.then).toBe(3));
  });
  test("bonds never fall below the 1.0 sovereign floor", () => {
    const r = decayHorizon(B, 500, 100, 365);
    r.bonds.forEach((b) => expect(b.then).toBe(1));
    r.curve.forEach((p) => expect(p.mean).toBeGreaterThanOrEqual(1));
  });
});

describe("dispute enforceability", () => {
  test("venue fitness calibration: ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss 68, SIAC 66, ICJ 46", () => {
    const e = (id: string) => enforceability(FORUMS.find((f) => f.id === id)!);
    expect(FORUMS.map((f) => f.id)).toEqual(["icsid", "pca", "lcia", "icc", "swiss", "siac", "icj"]);
    expect([e("icsid"), e("pca"), e("lcia"), e("icc"), e("swiss"), e("siac"), e("icj")]).toEqual([80, 74, 72, 70, 68, 66, 46]);
  });
  test("ICSID outranks ICJ; an unaddressed immunity costs 18 and a non-neutral seat 8", () => {
    const icsid = FORUMS.find((f) => f.id === "icsid")!;
    const icj = FORUMS.find((f) => f.id === "icj")!;
    const ok = { immunityWaived: true, neutralSeat: true };
    expect(forumFitness(icsid, ok).fitness).toBeGreaterThan(forumFitness(icj, ok).fitness);
    expect(forumFitness(icsid, { immunityWaived: false, neutralSeat: true }).fitness).toBe(62);
    expect(forumFitness(icsid, { immunityWaived: false, neutralSeat: false })).toMatchObject({ fitness: 54, friction: 46 });
  });
});

const LIVE = { verifierSeated: true, communal: 3.2, institutional: 3.4, intergenerational: 3.1, trackGap: 1, trackTolerance: 1, survivalScore: 60, rupture: 20 };

describe("escrow waterfall", () => {
  test("releases met tranches in order, net of clawback and bond until Final Cession", () => {
    const r = escrowWaterfall(DEFAULT_ESCROW, { ...LIVE, communal: 3.0 });
    expect(r.tranches.map((t) => t.met)).toEqual([true, false, false, false]);
    expect(r.gross).toBe(25);
    expect(r.released).toBe(17.5);
    const done = escrowWaterfall(DEFAULT_ESCROW, LIVE);
    expect(done.ceded).toBe(true);
    expect(done.released).toBe(100);
  });
  test("freezes everything at rupture 60", () => {
    const r = escrowWaterfall(DEFAULT_ESCROW, { ...LIVE, rupture: 60 });
    expect(r.released).toBe(0);
    expect(r.frozen).toBe(true);
  });
});

import { fractureWindow, rebalance, resourceReading, pleadingHeads } from "../src/components/desk/instruments";

describe("fracture window", () => {
  test("t_f = ln(B̄₀ ÷ 2) ÷ λ", () => {
    const f = fractureWindow(4, 0.001);
    expect(f.days).toBe(Math.round(Math.log(2) / 0.001));
    expect(f.severity).toBe("monitored");
  });
  test("no decay is stable; mean at or below 2.0 is imminent", () => {
    expect(fractureWindow(4, 0).severity).toBe("stable");
    expect(fractureWindow(2, 0.5).days).toBe(0);
  });
});

describe("resource covenant", () => {
  test("rebalance keeps the total at 100", () => {
    const s = rebalance([40, 35, 25], 0, 20);
    expect(s[0] + s[1] + s[2]).toBe(100);
    expect(s[0]).toBe(20);
  });
  test("communal under 30 is a deficit", () => {
    expect(resourceReading([29, 40, 31]).deficit).toBe(true);
    expect(resourceReading([30, 40, 30]).deficit).toBe(false);
  });
});

describe("pleadings bench", () => {
  test("provisional head appears only at rupture ≥ 40", () => {
    expect(pleadingHeads({ rupture: 39 }).total).toBe(3);
    expect(pleadingHeads({ rupture: 40 }).total).toBe(4);
  });
});
