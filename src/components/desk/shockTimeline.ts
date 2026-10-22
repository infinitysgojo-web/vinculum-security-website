/**
 * Shock Timeline Scrubber (Rehearsal Drawer and Desks 03 and 12).
 *
 * Instead of applying a shock package all at once, the package is broken into discrete
 * steps T0 (baseline) → T1 (first shock) → … → TN (full compound stress). Each step is
 * evaluated with the formulas the desks already use, so TN is exactly what the desk shows:
 *
 *   Desk 03 bonds        B′ᵢ = max(1.0, round1(Bᵢ − Σ ωₐ ÷ 10))
 *   Desk 03 strain       min(100, round1(Σ ω + (k − 1) × 1.25 × 4 + legitimacy penalty))
 *   Rupture (Desk 02)    R = min(100, round((observed share + inscribed load) × τ))
 *   Decay (Desk 12)      λ = max(0, U + R) ÷ 2000,  t½ = ln 2 ÷ λ,  t_f = ln(B̄ ÷ 2.0) ÷ λ
 *
 * Only inscribed shocks carry rupture load in the doctrine (the Sentinel's inscribed-load
 * rule); registered desk shocks move the bonds and the strain but not R. Nothing here
 * predicts events: each step is the same rule applied to fewer or more inputs.
 */
import { clampScore, inscribedRuptureLoad, ruptureIndex, round1, type BondVector, type CustomShock, type Signals } from "./engine";
import { ESCROW_FREEZE, fractureWindow, PROVISIONAL_THRESHOLD, SOVEREIGN_FLOOR } from "./instruments";

/** Each shock beyond the first adds 1.25 severity points per bond level (four levels). */
export const COMPOUND_AMPLIFY = 1.25;

export type DeskShock = { id: string; label: string; sev: number; bond: number; inscribed?: boolean };

export type CompoundReading = {
  strain: number;
  bondScores: [number, number, number, number];
  deductions: [number, number, number, number];
  failIndex: number;
};

/**
 * Desk 03's compound reading for a set of active shocks. Shared by the desk and the
 * scrubber so the final step can never disagree with the desk.
 */
export function compoundStress(active: ReadonlyArray<DeskShock>, live: readonly number[] | undefined, legitimacyPenalty: number): CompoundReading {
  const base = active.reduce((a, s) => a + s.sev, 0);
  const amp = active.length > 1 ? (active.length - 1) * COMPOUND_AMPLIFY * 4 : 0;
  const strain = Math.min(100, round1(base + amp + legitimacyPenalty));
  const omega = [0, 1, 2, 3].map((i) => active.filter((x) => x.bond === i).reduce((a, x) => a + x.sev, 0));
  const bondScores = (live
    ? live.map((v, i) => Math.max(1, round1(v - omega[i] / 10)))
    : omega.map((s) => Math.max(1, round1(5 - Math.min(4, s / 9))))) as [number, number, number, number];
  const failIndex = bondScores.indexOf(Math.min(...bondScores));
  return { strain, bondScores, deductions: omega.map((w) => round1(w / 10)) as [number, number, number, number], failIndex };
}

export type TimelineFlag = "SOVEREIGN_FLOOR" | "PROVISIONAL_PLEADINGS" | "ESCROW_FREEZE";

export type TimelineStep = {
  /** 0 for the baseline. */
  t: number;
  label: string;
  bonds: [number, number, number, number];
  meanBond: number;
  rupture: number | null;
  lambda: number | null;
  halfLifeDays: number | null;
  /** Days to the 2.0 fracture level: 0 when already there, null when λ = 0 or no reading. */
  fractureDays: number | null;
  strain?: number;
  exposure?: number;
  /** Thresholds that hold at this step. */
  flags: TimelineFlag[];
  /** Thresholds first reached at this step (not held at the step before). */
  tripped: TimelineFlag[];
};

export const FLAG_LABEL: Record<TimelineFlag, string> = {
  SOVEREIGN_FLOOR: `Bond at the ${SOVEREIGN_FLOOR.toFixed(1)} sovereign floor`,
  PROVISIONAL_PLEADINGS: `Rupture at or above ${PROVISIONAL_THRESHOLD} (provisional pleadings)`,
  ESCROW_FREEZE: `Rupture at or above ${ESCROW_FREEZE} (escrow frozen)`,
};

const mean4 = (v: readonly number[]) => v.reduce((a, b) => a + b, 0) / 4;

function evaluate(t: number, label: string, bonds: [number, number, number, number], rupture: number | null, exposure: number | undefined, extra: Partial<TimelineStep> = {}): Omit<TimelineStep, "tripped"> {
  const meanBond = Math.round(mean4(bonds) * 100) / 100;
  const lambda = exposure === undefined && rupture === null ? null : Math.max(0, (exposure ?? 0) + (rupture ?? 0)) / 2000;
  const halfLifeDays = lambda && lambda > 0 ? Math.round((Math.LN2 / lambda) * 10) / 10 : null;
  const fw = lambda === null ? null : fractureWindow(mean4(bonds), lambda);
  const flags: TimelineFlag[] = [];
  if (bonds.some((b) => b <= SOVEREIGN_FLOOR)) flags.push("SOVEREIGN_FLOOR");
  if (rupture !== null && rupture >= PROVISIONAL_THRESHOLD) flags.push("PROVISIONAL_PLEADINGS");
  if (rupture !== null && rupture >= ESCROW_FREEZE) flags.push("ESCROW_FREEZE");
  return { t, label, bonds, meanBond, rupture, lambda: lambda === null ? null : Math.round(lambda * 10000) / 10000, halfLifeDays, fractureDays: fw ? fw.days : null, exposure, flags, ...extra };
}

/** Mark each threshold at the first step it holds (the baseline counts as a step). */
function withTrips(steps: Omit<TimelineStep, "tripped">[]): TimelineStep[] {
  return steps.map((s, i) => ({ ...s, tripped: s.flags.filter((f) => i === 0 || !steps[i - 1].flags.includes(f)) }));
}

/** Rupture at a step: the Sentinel rule over the inscribed shocks applied so far; the bus value when no observed share is carried. */
function ruptureAt(s: Signals, inscribedSoFar: ReadonlyArray<{ deltas: BondVector }>): number | null {
  if (s.ruptureBase === undefined) return s.rupture ?? null;
  const traps = (s.customTraps ?? []).filter((t) => t.active).length;
  return ruptureIndex(s.ruptureBase, inscribedRuptureLoad(inscribedSoFar, traps), s.trendMultiplier ?? 1);
}

/**
 * Desk 03 timeline: the desk's active shocks in the order they were applied. Bonds and
 * strain follow compoundStress(); R follows the Sentinel rule over the inscribed shocks
 * applied so far; λ uses the exposure U the Succession Simulator carries on the bus.
 */
export function compoundTimeline(s: Signals, ordered: ReadonlyArray<DeskShock>, live: readonly number[] | undefined, legitimacyPenalty: number): TimelineStep[] {
  const byId = new Map((s.customShocks ?? []).map((c) => [c.id, c]));
  const base = live ? ([...live] as [number, number, number, number]) : ([5, 5, 5, 5] as [number, number, number, number]);
  const steps: Omit<TimelineStep, "tripped">[] = [];
  const insc0 = (s.customShocks ?? []).filter((c) => !ordered.some((o) => o.id === c.id));
  steps.push(evaluate(0, "T0 · Initial baseline", base, ruptureAt(s, insc0), s.unmitigatedExposure, { strain: 0 }));
  for (let k = 1; k <= ordered.length; k++) {
    const active = ordered.slice(0, k);
    const r = compoundStress(active, live, legitimacyPenalty);
    const insc = [...insc0, ...active.map((a) => byId.get(a.id)).filter((x): x is CustomShock => !!x)];
    steps.push(evaluate(k, `T${k} · ${ordered[k - 1].label}`, r.bondScores, ruptureAt(s, insc), s.unmitigatedExposure, { strain: r.strain }));
  }
  return withTrips(steps);
}

/**
 * Bus timeline (Rehearsal Drawer): the inscribed compound shocks on the bus, one at a time,
 * applied to the raw bond vector exactly as applyInscriptions does (clamped to 1.0 to 5.0).
 */
export function inscriptionTimeline(raw: Signals): TimelineStep[] {
  const shocks = raw.customShocks ?? [];
  if (!raw.bonds) return [];
  const b = raw.bonds;
  const acc = { ...b };
  const steps: Omit<TimelineStep, "tripped">[] = [];
  const vec = (x: BondVector) => [x.interpersonal, x.communal, x.intergenerational, x.institutional] as [number, number, number, number];
  steps.push(evaluate(0, "T0 · Initial baseline", vec(b), ruptureAt(raw, []), raw.unmitigatedExposure));
  // Unclamped running sums, so a bond driven below the floor and back reads exactly like applyInscriptions.
  const sum = { interpersonal: 0, communal: 0, intergenerational: 0, institutional: 0 };
  shocks.forEach((x, i) => {
    (Object.keys(sum) as (keyof BondVector)[]).forEach((k) => {
      sum[k] = round1(sum[k] + x.deltas[k]);
      acc[k] = clampScore(b[k] + sum[k]);
    });
    steps.push(evaluate(i + 1, `T${i + 1} · ${x.name}`, vec(acc), ruptureAt(raw, shocks.slice(0, i + 1)), raw.unmitigatedExposure));
  });
  return withTrips(steps);
}

export type SuccessionShock = { id: string; label: string; sev: number; insulated: boolean };

/**
 * Desk 12 timeline: the succession shocks in order, each adding its exposure (full
 * severity, or a quarter when a provision in force insulates against it) to U. R is the
 * bus reading and holds across the steps; λ, t½ and the fracture window follow U.
 */
export function successionTimeline(s: Signals, ordered: ReadonlyArray<SuccessionShock>): TimelineStep[] {
  if (!s.bonds) return [];
  const v = [s.bonds.interpersonal, s.bonds.communal, s.bonds.intergenerational, s.bonds.institutional] as [number, number, number, number];
  const R = s.rupture ?? 0;
  let U = 0;
  const steps: Omit<TimelineStep, "tripped">[] = [evaluate(0, "T0 · No succession shock", v, R, 0)];
  ordered.forEach((x, i) => {
    U += x.insulated ? x.sev * 0.25 : x.sev;
    steps.push(evaluate(i + 1, `T${i + 1} · ${x.label}${x.insulated ? " (insulated)" : ""}`, v, R, Math.round(U * 100) / 100));
  });
  return withTrips(steps);
}

/** The step at which each threshold is first reached, for the timeline's markers. */
export function firstTrips(steps: ReadonlyArray<TimelineStep>): Partial<Record<TimelineFlag, number>> {
  const out: Partial<Record<TimelineFlag, number>> = {};
  for (const s of steps) for (const f of s.tripped) if (out[f] === undefined) out[f] = s.t;
  return out;
}
