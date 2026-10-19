import { describe, expect, test } from "bun:test";
import { DEFAULT_ESCROW, decayHorizon, enforceability, escrowWaterfall, forumFitness, FORUMS } from "../src/components/desk/instruments";

const B = { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 };

describe("decay horizon", () => {
  test("λ = (U + R) ÷ 2000 and T½ = ln2 ÷ λ", () => {
    const r = decayHorizon(B, [0, 0, 0, 0], 60, 40, 12);
    expect(r.lambda).toBeCloseTo(0.05, 10);
    expect(r.halfLife!).toBeCloseTo(13.863, 3);
    expect(r.halfLifeDays).toBe(422);
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
  test("venue scores: ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss 68, SIAC 66", () => {
    const e = (id: string) => enforceability(FORUMS.find((f) => f.id === id)!);
    expect([e("icsid"), e("pca"), e("lcia"), e("icc"), e("swiss"), e("siac")]).toEqual([80, 74, 72, 70, 68, 66]);
  });
  test("ICJ scores 46 and takes no immunity or seat deduction; award forums lose 18 without a waiver", () => {
    const icj = FORUMS.find((f) => f.id === "icj")!;
    expect(forumFitness(icj, { immunityWaived: false, neutralSeat: false }).fitness).toBe(46);
    const icsid = FORUMS.find((f) => f.id === "icsid")!;
    expect(forumFitness(icsid, { immunityWaived: false, neutralSeat: true }).fitness).toBe(62);
    expect(forumFitness(icsid, { immunityWaived: false, neutralSeat: false }).fitness).toBe(54);
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
