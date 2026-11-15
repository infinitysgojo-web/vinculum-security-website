import { describe, expect, test } from "bun:test";
import { CASES } from "../src/content/cases";
import {
  INSCRIBED_LOAD_CAP, MAX_DISTANCE, SUCCESSION_TRAP, TREND_MULT, VIABLE_FLOOR,
  alerts, breachesFloor, clampScore, communalTolerance, distanceTable, dominumIndex, facadeSyndrome,
  holdsFloor, inscribedRuptureLoad, mathReading, rankCases, round1, ruptureIndex, successionDurability,
  type Signals,
} from "../src/components/desk/engine";
import {
  ADMISSIBILITY, DECAY_HORIZONS, DEFAULT_ESCROW, ESCROW_FREEZE, FORUMS, PROVISIONAL_THRESHOLD, SOVEREIGN_FLOOR,
  decayHorizon, enforceability, escrowWaterfall, forumFitness, fractureWindow, preservedBond, rebalance,
} from "../src/components/desk/instruments";
import { compoundStress } from "../src/components/desk/shockTimeline";
import { finiteOr, ordinal5, percent, trendMultiplierOr } from "../src/components/desk/mathGuards";

/**
 * Master Catalog of mathematical refinements: invariants pinned against the live engine.
 * Production code governs: where the catalog proposed a different constant, the test pins the code's.
 */
const fin = (n: number) => Number.isFinite(n);
const B = (a: number, b: number, c: number, d: number) => ({ interpersonal: a, communal: b, intergenerational: c, institutional: d });

describe("Domain I · state vector", () => {
  test("1 · clampScore holds [1.0, 5.0] at one decimal, and NaN reads at the 1.0 baseline", () => {
    expect(clampScore(7)).toBe(5);
    expect(clampScore(-3)).toBe(1);
    expect(clampScore(3.04999999)).toBe(3);
    expect(clampScore(NaN)).toBe(1);
    expect(clampScore(Infinity)).toBe(1); // unreadable, not "maximal"
    expect(clampScore(-Infinity)).toBe(1);
  });
  test("2 · mathReading never emits NaN or Infinity", () => {
    const m = mathReading([NaN, 3, Infinity, 2] as [number, number, number, number]);
    for (const x of [m.mean, m.variance, m.spread, m.limitingScore, m.nearest.distance, m.nearest.resonance]) expect(fin(x)).toBe(true);
  });
  test("3 · the limiting bond is the first of tied minima", () => {
    expect(mathReading([2, 3, 2, 4]).limitingIndex).toBe(0);
    expect(mathReading([3, 1.5, 4, 1.5]).limitingIndex).toBe(1);
  });
  test("4 · distance never exceeds 8 and resonance stays in [0, 100]", () => {
    expect(MAX_DISTANCE).toBe(8);
    for (const v of [[1, 1, 1, 1], [5, 5, 5, 5], [1, 5, 1, 5]] as [number, number, number, number][])
      for (const r of distanceTable(v)) {
        expect(r.distance).toBeLessThanOrEqual(8);
        expect(r.resonance).toBeGreaterThanOrEqual(0);
        expect(r.resonance).toBeLessThanOrEqual(100);
      }
  });
  test("5 · facade syndrome survives empty and non-finite input", () => {
    expect(facadeSyndrome([]).engaged).toBe(false);
    const f = facadeSyndrome([NaN, 5, 1, 5]);
    expect(fin(f.variance)).toBe(true);
  });
  test("6 · communal tolerance is 0, 1 or 2 phases, never negative", () => {
    expect(communalTolerance(1).phases).toBe(0);
    expect(communalTolerance(2.5).phases).toBe(1);
    expect(communalTolerance(4.5).phases).toBe(2);
  });
  test("8 · canonical precedent coordinates are read-only", () => {
    for (const c of CASES) expect(Object.isFrozen(c.scores)).toBe(true);
  });
  test("9 · no shock drives a bond below 1.0", () => {
    const r = compoundStress([{ id: "x", label: "x", sev: 400, bond: 0 }], [1.2, 3, 3, 3], 0);
    expect(Math.min(...r.bondScores)).toBeGreaterThanOrEqual(1);
  });
  test("10 · round1 is one-decimal rounding", () => {
    expect(round1(2.25)).toBe(2.3);
    expect(round1(2.24)).toBe(2.2);
  });
});

describe("Domain II · rupture, shock and traps (code governs)", () => {
  test("11 · inscribed load is capped at 30", () => {
    expect(INSCRIBED_LOAD_CAP).toBe(30);
    expect(inscribedRuptureLoad([{ deltas: B(-5, -5, -5, -5) }], 10)).toBe(30);
  });
  test("12 · each trap adds exactly 6 points (doctrine, not the catalog's 4)", () => {
    expect(inscribedRuptureLoad([], 1)).toBe(6);
    expect(inscribedRuptureLoad([], 2)).toBe(12);
    expect(inscribedRuptureLoad([], NaN)).toBe(0);
    expect(inscribedRuptureLoad([], -3)).toBe(0);
  });
  test("13 · trend multipliers are frozen at 0.85, 1.00, 1.15; a non-finite one reads 1.00", () => {
    expect(Object.isFrozen(TREND_MULT)).toBe(true);
    expect([TREND_MULT.improving, TREND_MULT.static, TREND_MULT.deteriorating]).toEqual([0.85, 1, 1.15]);
    expect(ruptureIndex(40, 0, NaN)).toBe(40);
    expect(trendMultiplierOr(2)).toBe(1);
    expect(trendMultiplierOr(1.15)).toBe(1.15);
  });
  test("14 · R stays in [0, 100] for any input", () => {
    expect(ruptureIndex(200, 30, 1.15)).toBe(100);
    expect(ruptureIndex(-50, 0, 1)).toBe(0);
    expect(ruptureIndex(NaN, NaN, NaN)).toBe(0);
  });
  test("15 · compound stress keeps strain in [0, 100] and ignores bad severities", () => {
    const r = compoundStress([{ id: "a", label: "a", sev: NaN, bond: 1 }, { id: "b", label: "b", sev: -10, bond: 2 }], [3, 3, 3, 3], NaN);
    expect(fin(r.strain)).toBe(true);
    expect(r.strain).toBeGreaterThanOrEqual(0);
    expect(r.bondScores.every(fin)).toBe(true);
  });
  test("18 · rupture alerts sit at 35 (elevated) and 60 (critical)", () => {
    const lvl = (r: number) => alerts({ rupture: r } as Signals).find((a) => /rupture index/i.test(a.name))?.level;
    expect(lvl(34)).toBeUndefined();
    expect(lvl(35)).toBe("elevated");
    expect(lvl(59)).toBe("elevated");
    expect(lvl(60)).toBe("critical");
  });
});

describe("Domain V · escrow waterfall", () => {
  const all = { verifierSeated: true, communal: 4, institutional: 4, intergenerational: 4, trackGap: 1, trackTolerance: 2, survivalScore: 70 };
  test("41 · the default pledge is balanced at 100", () => {
    const r = escrowWaterfall(DEFAULT_ESCROW, all);
    expect(r.total).toBe(100);
    expect(r.balanced).toBe(true);
    expect(escrowWaterfall({ ...DEFAULT_ESCROW, shares: [25, 25, 25, 20] }, all).balanced).toBe(false);
  });
  test("42 · shares, clawback and bond clamp to [0, 100]", () => {
    const r = escrowWaterfall({ shares: [NaN, 200, -5, 20], clawback: Infinity, bond: -1 }, all);
    for (const x of [r.gross, r.clawbackHeld, r.bondHeld, r.released]) expect(fin(x)).toBe(true);
    expect(r.released).toBeGreaterThanOrEqual(0);
  });
  test("43, 49 · R ≥ 60 freezes the account and releases exactly 0", () => {
    expect(ESCROW_FREEZE).toBe(60);
    expect(escrowWaterfall(DEFAULT_ESCROW, { ...all, rupture: 60 }).released).toBe(0);
    expect(escrowWaterfall(DEFAULT_ESCROW, { ...all, rupture: 59 }).frozen).toBe(false);
  });
  test("44 · a tranche is met only when every earlier tranche is met", () => {
    const r = escrowWaterfall(DEFAULT_ESCROW, { ...all, verifierSeated: false });
    expect(r.tranches.every((t) => !t.met)).toBe(true);
  });
  test("47 · Final Cession discharges both reserves", () => {
    const r = escrowWaterfall(DEFAULT_ESCROW, all);
    expect(r.ceded).toBe(true);
    expect(r.clawbackHeld + r.bondHeld).toBe(0);
    expect(r.released).toBe(100);
  });
  test("50 · rebalancing conserves 100 and ignores a non-finite value", () => {
    const s = rebalance([40, 35, 25], 0, 70);
    expect(s[0] + s[1] + s[2]).toBe(100);
    expect(rebalance([40, 35, 25], 1, NaN)).toEqual([40, 35, 25]);
  });
});

describe("Domain VIII · forum enforceability", () => {
  test("71 · E matches the canonical equation for every forum", () => {
    for (const f of FORUMS) expect(enforceability(f)).toBe(Math.round((100 * (0.5 * f.teeth + 0.3 * (6 - f.immunity) + 0.2 * f.pace)) / 5));
  });
  test("72 · ordinal ratings clamp to integers 1 to 5", () => {
    expect(ordinal5(9)).toBe(5);
    expect(ordinal5(0)).toBe(1);
    expect(ordinal5(NaN)).toBe(1);
    expect(enforceability({ teeth: 99, immunity: -4, pace: 99 })).toBe(enforceability({ teeth: 5, immunity: 1, pace: 5 }));
  });
  test("73–76 · penalties 18 and 8, floor 0, fitness + friction = 100", () => {
    for (const f of FORUMS)
      for (const immunityWaived of [true, false])
        for (const neutralSeat of [true, false]) {
          const r = forumFitness(f, { immunityWaived, neutralSeat });
          expect(r.fitness).toBeGreaterThanOrEqual(0);
          expect(r.fitness + r.friction).toBe(100);
          expect(r.immunity).toBe(immunityWaived ? 0 : 18);
          expect(r.seat).toBe(neutralSeat ? 0 : 8);
        }
  });
  test("77 · the seven forums and their admissibility profiles are frozen", () => {
    expect(FORUMS.length).toBe(7);
    expect(Object.isFrozen(FORUMS)).toBe(true);
    expect(FORUMS.every((f) => Object.isFrozen(f))).toBe(true);
    expect(Object.isFrozen(ADMISSIBILITY)).toBe(true);
    expect(FORUMS.every((f) => typeof ADMISSIBILITY[f.id] === "string")).toBe(true);
  });
  test("80 · provisional measures draft at R ≥ 40", () => {
    expect(PROVISIONAL_THRESHOLD).toBe(40);
  });
});

describe("Domain IX · decay horizon", () => {
  const b = B(3.5, 3.2, 3.8, 3.4);
  test("81, 82 · λ = (U + R) ÷ 2000 and t½ = ln 2 ÷ λ; λ = 0 gives null", () => {
    const r = decayHorizon(b, 60, 40, 90);
    expect(r.lambda).toBeCloseTo(0.05, 12);
    expect(r.halfLifeDays!).toBeCloseTo(Math.LN2 / 0.05, 9);
    expect(decayHorizon(b, 0, 0, 90).halfLifeDays).toBeNull();
  });
  test("83, 84 · B(t) is floored at the 1.0 sovereign baseline", () => {
    expect(SOVEREIGN_FLOOR).toBe(1);
    expect(preservedBond(4, 10, 365)).toBe(1);
    expect(preservedBond(NaN, 0.1, 30)).toBe(1);
  });
  test("85 · horizons are frozen at 30, 90, 180, 365", () => {
    expect([...DECAY_HORIZONS]).toEqual([30, 90, 180, 365]);
    expect(Object.isFrozen(DECAY_HORIZONS)).toBe(true);
  });
  test("86, 87 · fracture window is finite, and 0 at or below the 2.0 level", () => {
    expect(fractureWindow(2, 0.01).days).toBe(0);
    expect(fractureWindow(3.5, 0).severity).toBe("stable");
    expect(fractureWindow(NaN, 0.05).severity).toBe("imminent");
    expect(fractureWindow(3.5, NaN).severity).toBe("stable");
  });
  test("88, 89 · succession trap at 55 and survival bounded", () => {
    expect(SUCCESSION_TRAP).toBe(55);
    const s = successionDurability({ bonds: B(NaN, 3, 3, 3), rupture: NaN } as Signals)!;
    expect(fin(s.percent)).toBe(true);
    expect(s.percent).toBeGreaterThanOrEqual(0);
    expect(s.percent).toBeLessThanOrEqual(100);
  });
  test("90 · the curve has exactly 7 points from day 0 to the horizon, two decimals", () => {
    const r = decayHorizon(b, 30, 20, 180);
    expect(r.curve.length).toBe(7);
    expect(r.curve[0].day).toBe(0);
    expect(r.curve[6].day).toBe(180);
    for (const p of r.curve) expect(Math.round(p.mean * 100) / 100).toBe(p.mean);
    expect(decayHorizon(b, NaN, NaN, NaN).curve.every((p) => fin(p.mean))).toBe(true);
  });
});

describe("Domain X · Dominum and precedent resonance (code governs)", () => {
  const full: Signals = { bonds: B(4, 4, 4, 4), escrowReleasedPercent: 100, survivalScore: 100, rupture: 0 } as Signals;
  test("91, 92 · the live Dominum formula, bounded to [0, 100]", () => {
    const r = dominumIndex({ bonds: B(3.5, 3.5, 3.5, 3.5), escrowReleasedPercent: 50, survivalScore: 60, rupture: 40 } as Signals);
    if ("missing" in r) throw new Error("expected a reading");
    expect(r.index).toBe(58.3);
    expect(r.phase).toBe("Fiduciary Anchor");
  });
  test("94 · Self-Reinforcing Dominium is withheld while any bond is at or under 3.0", () => {
    expect(VIABLE_FLOOR).toBe(3);
    expect(breachesFloor(3.0)).toBe(true);
    expect(holdsFloor(3.0)).toBe(false);
    const ok = dominumIndex(full);
    const held = dominumIndex({ ...full, bonds: B(5, 5, 5, 3.0) });
    if ("missing" in ok || "missing" in held) throw new Error("expected readings");
    expect(ok.phase).toBe("Self-Reinforcing Dominium");
    expect(held.phase).not.toBe("Self-Reinforcing Dominium");
  });
  test("95 · missing signals are named, never filled in", () => {
    const r = dominumIndex({ bonds: B(4, 4, 4, 4) } as Signals);
    expect("missing" in r && r.missing.length).toBe(3);
  });
  test("Dominum never emits NaN, and an unreadable rupture counts as full rupture", () => {
    const r = dominumIndex({ ...full, bonds: B(NaN, 4, 4, 4), rupture: NaN });
    if ("missing" in r) throw new Error("expected a reading");
    expect(fin(r.index)).toBe(true);
    expect(r.terms.find((t) => t.key === "C")!.input).toBe(0);
  });
  test("96 · resonance = 100 × (1 − d ÷ 8), and rankCases agrees with distanceTable", () => {
    const v = [3, 3, 3, 3];
    const top = rankCases(v, 3);
    const rows = distanceTable(v);
    top.forEach((m, k) => {
      const row = rows.find((r) => r.slug === m.slug)!;
      expect(row.rank).toBe((k + 1) as 1 | 2 | 3);
      expect(m.resonance).toBe(Math.round((1 - m.distance / 8) * 100));
      expect(row.resonance).toBe(round1((1 - row.distance / 8) * 100));
    });
  });
});

describe("guards", () => {
  test("finiteOr, percent", () => {
    expect(finiteOr(NaN, 3)).toBe(3);
    expect(finiteOr("4" as unknown as number, 3)).toBe(3);
    expect(percent(150)).toBe(100);
    expect(percent(-1)).toBe(0);
  });
});
