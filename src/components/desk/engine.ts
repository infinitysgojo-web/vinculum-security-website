import { createContext, useContext, useEffect } from "react";
import { CASES } from "@/content/cases";

/**
 * The Vinculum Mission Engine.
 *
 * A single deterministic signal bus shared by every desk on the dashboard.
 * Upstream desks publish their readings; downstream desks read them and adapt
 * their own output. No model, no network, no storage: every value here is a
 * plain arithmetic result computed in the browser from what the analyst entered.
 */

export type BondVector = {
  /** 1.0 to 5.0 in steps of 0.1, as scored on the diagnostic bench. */
  interpersonal: number;
  communal: number;
  intergenerational: number;
  institutional: number;
};

export const BOND_NAMES = [
  "Interpersonal",
  "Communal",
  "Intergenerational",
  "Institutional-Relational",
] as const;

/* ------------------------------------------------------------------ */
/* Canonical mathematics                                               */
/* ------------------------------------------------------------------ */

/** Round to one decimal place. All bond scores on the bus use this precision. */
export const round1 = (n: number) => Math.round(n * 10) / 10;

/** Clamp a score to the 1.0 to 5.0 scale and round it to one decimal. */
export const clampScore = (n: number) => round1(Math.min(5, Math.max(1, n)));

export type BondBandName = "Failing" | "Fragile" | "Viable" | "Fortified";

/** Canonical bond bands. 1.0-2.0 Failing, 2.1-3.0 Fragile, 3.1-4.0 Viable, 4.1-5.0 Fortified. */
export const BOND_BANDS: { name: BondBandName; range: string; max: number }[] = [
  { name: "Failing", range: "1.0 – 2.0", max: 2.0 },
  { name: "Fragile", range: "2.1 – 3.0", max: 3.0 },
  { name: "Viable", range: "3.1 – 4.0", max: 4.0 },
  { name: "Fortified", range: "4.1 – 5.0", max: 5.0 },
];

export function bondBand(score: number): BondBandName {
  const v = round1(score);
  return (BOND_BANDS.find((b) => v <= b.max) ?? BOND_BANDS[3]).name;
}

/** Canonical trend multipliers applied to the rupture index. */
export const TREND_MULT = { improving: 0.85, static: 1.0, deteriorating: 1.15 } as const;

/**
 * Communal-bond tolerance rule for Track I. The principals' track may lead the
 * communal track by: nil phases when the communal bond is Failing, one phase when
 * Fragile, two phases when Viable or Fortified.
 */
export function communalTolerance(communalScore: number): { band: BondBandName; phases: number } {
  const band = bondBand(communalScore);
  return { band, phases: band === "Failing" ? 0 : band === "Fragile" ? 1 : 2 };
}

export type MathReading = {
  vector: [number, number, number, number];
  mean: number;
  variance: number;
  spread: number;
  limitingIndex: number;
  limitingScore: number;
  nearest: { slug: string; shortTitle: string; distance: number; resonance: number };
};

/** Largest possible Euclidean distance between two four-bond vectors on a 1 to 5 scale. */
export const MAX_DISTANCE = Math.sqrt(4 * 16);

/**
 * The state-vector reading: mean, population variance, spread, limiting factor
 * (the minimum bond) and the Euclidean distance to the nearest canonical case.
 */
export function mathReading(v: [number, number, number, number]): MathReading {
  const mean = v.reduce((a, b) => a + b, 0) / 4;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / 4;
  const spread = Math.max(...v) - Math.min(...v);
  const limitingScore = Math.min(...v);
  const limitingIndex = v.indexOf(limitingScore);
  let best = CASES[0];
  let bestD = Infinity;
  for (const c of CASES) {
    const d = Math.sqrt(c.scores.reduce((a, s, i) => a + (s - v[i]) ** 2, 0));
    if (d < bestD) {
      bestD = d;
      best = c;
    }
  }
  return {
    vector: v,
    mean,
    variance,
    spread,
    limitingIndex,
    limitingScore,
    nearest: {
      slug: best.slug,
      shortTitle: best.shortTitle,
      distance: bestD,
      resonance: Math.round((1 - bestD / MAX_DISTANCE) * 100),
    },
  };
}

/* ------------------------------------------------------------------ */
/* Full mathematical derivation (Section III of the deposition)        */
/* ------------------------------------------------------------------ */

/** Year of the settlement instrument for each canonical case, from the Section VII quick-facts. */
export const CASE_YEARS: Record<string, number> = {
  "northern-ireland": 1998,
  colombia: 2016,
  cambodia: 2001,
  liberia: 2009,
  rwanda: 2002,
  kenya: 2008,
  "south-africa": 1995,
  "tuvalu-kiribati": 2023,
};

export type FacadeReading = {
  engaged: boolean;
  variance: number;
  max: number;
  min: number;
  /** The three conditions, evaluated separately so the panel can show which hold. */
  tests: { varianceAbove: boolean; maxAtLeast: boolean; minAtMost: boolean };
};

/**
 * Structural Facade Syndrome: superficial harmony masking severe rupture.
 * Engaged when variance exceeds 1.25 AND the strongest bond is at least 4.0
 * AND the weakest bond is at most 2.0.
 */
export function facadeSyndrome(v: readonly number[]): FacadeReading {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance = v.reduce((a, b) => a + (b - mean) ** 2, 0) / v.length;
  const max = Math.max(...v);
  const min = Math.min(...v);
  const tests = { varianceAbove: variance > 1.25 + 1e-9, maxAtLeast: max >= 4.0, minAtMost: min <= 2.0 };
  return { engaged: tests.varianceAbove && tests.maxAtLeast && tests.minAtMost, variance, max, min, tests };
}

export type DistanceRow = {
  slug: string;
  shortTitle: string;
  year: number | undefined;
  coords: [number, number, number, number];
  distance: number;
  /** R_k = (1 - d / 8) x 100, to one decimal place. */
  resonance: number;
  nearest: boolean;
};

/**
 * Euclidean distance d(B, C_k) and resonance R_k to all eight canonical cases,
 * in canonical case order, with the closest historical twin flagged.
 * Ties for closest go to the earlier case in canonical order.
 */
export function distanceTable(v: readonly number[]): DistanceRow[] {
  const rows = CASES.map((c) => {
    const d = Math.sqrt(c.scores.reduce((a, s, i) => a + (v[i] - s) ** 2, 0));
    return {
      slug: c.slug,
      shortTitle: c.shortTitle,
      year: CASE_YEARS[c.slug],
      coords: [...c.scores] as [number, number, number, number],
      distance: d,
      resonance: round1((1 - d / MAX_DISTANCE) * 100),
      nearest: false,
    };
  });
  let best = 0;
  rows.forEach((r, i) => {
    if (r.distance < rows[best].distance) best = i;
  });
  rows[best].nearest = true;
  return rows;
}

/** Number of covenants in force at which the covenant indicator saturates. */
export const COVENANT_SATURATION = 2;

export type SuccessionReading = {
  mu: number;
  ig: number;
  ir: number;
  covenantCount: number;
  /** 1.0 when two or more covenants are in force, otherwise 0.5 per covenant. */
  covenantIndicator: number;
  /** Rupture index R, in per cent, and its normalised form R/100. */
  rupturePct: number;
  rupturePenaltyBase: number;
  terms: { label: string; weight: number; input: number; value: number }[];
  raw: number;
  percent: number;
  trap: boolean;
};

/** Terminal succession trap gate, in per cent. */
export const SUCCESSION_TRAP = 55.0;

/**
 * Canonical succession durability from Section 4.5:
 * S_raw = 0.35 mu_B + 0.25 B_IG + 0.25 B_IR + 0.15 I_cov - 0.20 R~,  S% = S_raw / 5 x 100.
 * A missing rupture reading counts as R = 0; missing covenants count as none.
 * Returns undefined until the bond vector is on the bus.
 */
export function successionDurability(s: Signals): SuccessionReading | undefined {
  if (!s.bonds) return undefined;
  const b = s.bonds;
  const mu = (b.interpersonal + b.communal + b.intergenerational + b.institutional) / 4;
  const covenantCount = s.covenants?.length ?? 0;
  const covenantIndicator = covenantCount >= COVENANT_SATURATION ? 1.0 : 0.5 * covenantCount;
  const rupturePct = s.rupture ?? 0;
  const rTilde = rupturePct / 100;
  const terms = [
    { label: "0.35 × μB (composite mean)", weight: 0.35, input: mu, value: 0.35 * mu },
    { label: "0.25 × B_IG (intergenerational)", weight: 0.25, input: b.intergenerational, value: 0.25 * b.intergenerational },
    { label: "0.25 × B_IR (institutional-relational)", weight: 0.25, input: b.institutional, value: 0.25 * b.institutional },
    { label: "0.15 × I_cov (covenant indicator)", weight: 0.15, input: covenantIndicator, value: 0.15 * covenantIndicator },
    { label: "−0.20 × R̃ (rupture, R ÷ 100)", weight: -0.2, input: rTilde, value: -0.2 * rTilde },
  ];
  const raw = terms.reduce((a, t) => a + t.value, 0);
  const percent = Math.min(100, Math.max(0, round1((raw / 5.0) * 100)));
  return {
    mu,
    ig: b.intergenerational,
    ir: b.institutional,
    covenantCount,
    covenantIndicator,
    rupturePct,
    rupturePenaltyBase: rTilde,
    terms,
    raw,
    percent,
    trap: percent < SUCCESSION_TRAP,
  };
}

export type Signals = {
  /** Division I, bond diagnostic. */
  bonds?: BondVector;
  bondMean?: number;
  weakestBond?: string;
  weakestScore?: number;
  weakestBand?: string;
  bondVariance?: number;
  communalBand?: string;
  /** Maximum phases Track I may lead Track II, set by the communal bond band. */
  trackTolerance?: number;
  standing?: string;
  analogue?: string;
  /** Division I, sentinel matrix. */
  rupture?: number;
  ruptureBand?: string;
  bondStrain?: number[];
  traps?: string[];
  trend?: string;
  trendMultiplier?: number;
  /** Division I, compound shock tester. */
  shocks?: string[];
  firstToBreak?: string;
  shockSeverity?: number;
  /** Division II, track sequencing. */
  trackI?: number;
  trackII?: number;
  trackGap?: number;
  elitePactAlert?: boolean;
  /** Division II, multi-party bench. */
  seatedParties?: number;
  frictionPairs?: string[];
  /** Division III, legal architecture. */
  covenants?: string[];
  redlineFlags?: number;
  survivalScore?: number;
  /** Division IV, governance. */
  verifierSeated?: boolean;
  gatesCleared?: string;
  /** Division IV, mandate handover: durability quotient H, in per cent, its band, and the successor office named as oversight body. */
  handoverViability?: number;
  handoverBand?: string;
  oversightBody?: string;
  /** Division I, comparative mirror: selected case slugs. */
  mirrors?: string[];
};

const SIGNAL_NUMBERS = [
  "bondMean", "weakestScore", "bondVariance", "trackTolerance", "rupture", "trendMultiplier",
  "shockSeverity", "trackI", "trackII", "trackGap", "seatedParties", "redlineFlags", "survivalScore",
  "handoverViability",
] as const;
const SIGNAL_STRINGS = [
  "weakestBond", "weakestBand", "communalBand", "standing", "analogue", "ruptureBand", "trend",
  "firstToBreak", "gatesCleared", "handoverBand", "oversightBody",
] as const;
const SIGNAL_BOOLEANS = ["elitePactAlert", "verifierSeated"] as const;
const SIGNAL_STRING_LISTS = ["traps", "shocks", "frictionPairs", "covenants", "mirrors"] as const;

/**
 * Coerce anything read from a mission archive into a valid Signals object.
 * Unknown keys and wrongly typed values are dropped; bond scores are clamped to 1.0 to 5.0.
 */
export function sanitizeSignals(raw: unknown): Signals {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const src = raw as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of SIGNAL_NUMBERS) if (typeof src[k] === "number" && Number.isFinite(src[k])) out[k] = src[k];
  for (const k of SIGNAL_STRINGS) if (typeof src[k] === "string") out[k] = src[k];
  for (const k of SIGNAL_BOOLEANS) if (typeof src[k] === "boolean") out[k] = src[k];
  for (const k of SIGNAL_STRING_LISTS)
    if (Array.isArray(src[k])) out[k] = (src[k] as unknown[]).filter((x): x is string => typeof x === "string");
  if (Array.isArray(src.bondStrain))
    out.bondStrain = (src.bondStrain as unknown[]).filter((x): x is number => typeof x === "number" && Number.isFinite(x));
  const b = src.bonds as Record<string, unknown> | undefined;
  if (b && typeof b === "object") {
    const pick = (key: keyof BondVector) => {
      const n = Number(b[key]);
      return Number.isFinite(n) ? clampScore(n) : undefined;
    };
    const bonds = {
      interpersonal: pick("interpersonal"),
      communal: pick("communal"),
      intergenerational: pick("intergenerational"),
      institutional: pick("institutional"),
    };
    if (Object.values(bonds).every((x) => x !== undefined)) out.bonds = bonds as BondVector;
  }
  return out as Signals;
}

export type Engine = {
  signals: Signals;
  publish: (desk: string, patch: Signals) => void;
};

export const EngineContext = createContext<Engine>({ signals: {}, publish: () => {} });

export function useEngine() {
  return useContext(EngineContext);
}

/** Publish a desk's readings onto the bus whenever they change. */
export function usePublish(desk: string, patch: Signals) {
  const { publish } = useEngine();
  const key = JSON.stringify(patch);
  useEffect(() => {
    publish(desk, JSON.parse(key) as Signals);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [desk, key]);
}

/* ------------------------------------------------------------------ */
/* Derived readings                                                    */
/* ------------------------------------------------------------------ */

/** Does the bus carry anything at all yet? */
export function hasSignal(s: Signals) {
  return (
    s.bonds !== undefined ||
    s.rupture !== undefined ||
    (s.shocks?.length ?? 0) > 0 ||
    s.trackGap !== undefined ||
    (s.covenants?.length ?? 0) > 0
  );
}

export type Alert = { level: "critical" | "elevated" | "note"; name: string; reading: string; directive: string };

/**
 * The standing alert set. Every rule below is a fixed doctrinal threshold,
 * evaluated against whatever the upstream desks have published.
 */
export function alerts(s: Signals): Alert[] {
  const out: Alert[] = [];

  if (s.rupture !== undefined && s.rupture >= 60)
    out.push({
      level: "critical",
      name: "Critical rupture index",
      reading: `The sentinel matrix reads ${s.rupture} per cent, above the 60 per cent critical threshold.`,
      directive: "Convene principals and the verifier within fourteen days and activate the continuity provisions.",
    });
  else if (s.rupture !== undefined && s.rupture >= 35)
    out.push({
      level: "elevated",
      name: "Elevated rupture index",
      reading: `The sentinel matrix reads ${s.rupture} per cent, above the 35 per cent elevated threshold.`,
      directive: "Open a protected channel on the weakest bond and schedule independent verification before further concessions.",
    });

  if (s.weakestBond && s.weakestScore !== undefined && bondBand(s.weakestScore) === "Failing")
    out.push({
      level: "critical",
      name: `${s.weakestBond} bond failing`,
      reading: `The ${s.weakestBond.toLowerCase()} bond scores ${s.weakestScore.toFixed(1)} of 5 on the diagnostic bench, in the Failing band (1.0 – 2.0).`,
      directive:
        s.weakestBond === "Institutional-Relational"
          ? "Attach a continuity provision binding the office rather than the officeholder before any further step is tabled."
          : "Rebuild this bond through a lower-stakes exchange before the table is asked to carry weight it cannot hold.",
    });

  if (s.elitePactAlert)
    out.push({
      level: "critical",
      name: "Elite-Pact Mirage alert",
      reading: `The principals' track leads the communal track by ${s.trackGap} phases${s.trackTolerance !== undefined ? `, against a tolerance of ${s.trackTolerance} set by the ${(s.communalBand ?? "communal").toLowerCase()} communal bond` : ""}.`,
      directive: "Hold Track I at its present phase and run Track II forward before any further concession is tabled.",
    });

  if ((s.shocks?.length ?? 0) >= 2)
    out.push({
      level: "elevated",
      name: "Compound shock loading",
      reading: `${s.shocks!.length} shocks are active at once${s.firstToBreak ? `; the first provision to break is ${s.firstToBreak}` : ""}.`,
      directive: "Sequence the counter-measures rather than running them in parallel, and redraft the exposed provision first.",
    });

  if (s.traps?.length)
    for (const t of s.traps)
      out.push({
        level: "note",
        name: t,
        reading: "A latent trap pattern is active on the early-warning matrix.",
        directive: "Carry the matching counter-measure into the drafting and governance divisions.",
      });

  return out.concat(dynamicsAlerts(s));
}

/** Engine locks: fixed doctrinal conditions read from the upstream divisions. */
export type Lock = { name: string; held: boolean; remedy: string };
export function engineLocks(s: Signals): Lock[] {
  const cov = (s.covenants ?? []).join(" ").toLowerCase();
  const continuity = /personal|continuity|office|atrophy/.test(cov);
  const out: Lock[] = [];
  if (s.rupture !== undefined && s.rupture >= 35)
    out.push({ name: `Rupture index ${s.rupture}% requires a continuity covenant`, held: continuity, remedy: "Draft an office-continuity provision in the Clause Architect before clearance." });
  if (s.rupture !== undefined && s.rupture >= 35)
    out.push({ name: `Rupture index ${s.rupture}% requires an independent verifier seated`, held: s.verifierSeated === true, remedy: "Seat an independent verifier in the Verification Ledger; no party may appoint, fund or remove it." });
  if (s.elitePactAlert)
    out.push({ name: `Track gap of ${s.trackGap} phases (Elite-Pact Mirage)`, held: false, remedy: "Hold Track I and advance the communal track until the gap closes to one phase." });
  if (s.weakestBond && s.weakestScore !== undefined && bondBand(s.weakestScore) === "Failing")
    out.push({ name: `${s.weakestBond} bond at ${s.weakestScore.toFixed(1)} of 5 (Failing)`, held: (s.covenants?.length ?? 0) > 0, remedy: "Attach at least one remedial covenant addressing the failing bond." });
  if (s.survivalScore !== undefined)
    out.push({ name: `Treaty survival under stress at ${s.survivalScore}%`, held: s.survivalScore >= 55, remedy: "Close the first failing provision in the Succession Simulator until survival reaches 55%." });
  if ((s.shocks?.length ?? 0) >= 2)
    out.push({ name: `${s.shocks!.length} compound shocks active`, held: (s.covenants?.length ?? 0) >= 2, remedy: "Carry at least two covenants to absorb concurrent shocks." });
  const dyn = relationalDynamics(s);
  if (dyn?.character === "Systemic")
    out.push({ name: `Systemic decay (Ω ${dyn.omega.toFixed(2)})`, held: (s.covenants?.length ?? 0) >= 2 && continuity, remedy: "Carry two or more covenants, one of them an office-continuity provision, before clearance." });
  if (dyn && dyn.contagion >= 75)
    out.push({ name: `Contagion coefficient ${dyn.contagion}%`, held: s.verifierSeated === true && (s.covenants?.length ?? 0) > 0, remedy: "Seat the independent verifier and draft a firebreak covenant on the limiting bond." });
  return out;
}

/** The telemetry block appended to every downstream chancellery document. */
export function telemetryLines(s: Signals): string[] {
  if (!hasSignal(s)) return [];
  const L: string[] = ["UPSTREAM TELEMETRY (live from the mission engine)"];
  if (s.bonds)
    L.push(
      `  Bond vector: interpersonal ${s.bonds.interpersonal.toFixed(1)}, communal ${s.bonds.communal.toFixed(1)}, intergenerational ${s.bonds.intergenerational.toFixed(1)}, institutional ${s.bonds.institutional.toFixed(1)} (of 5).`
    );
  if (s.standing) L.push(`  Relational standing: ${s.standing}${s.bondMean ? ` (mean ${s.bondMean.toFixed(2)}${s.bondVariance !== undefined ? `, variance ${s.bondVariance.toFixed(2)}` : ""})` : ""}.`);
  if (s.weakestBond) L.push(`  Limiting bond: ${s.weakestBond}${s.weakestScore ? ` at ${s.weakestScore.toFixed(1)} of 5${s.weakestBand ? ` (${s.weakestBand})` : ""}` : ""}.`);
  if (s.rupture !== undefined) L.push(`  Rupture index: ${s.rupture} per cent (${s.ruptureBand ?? "unbanded"}${s.trend ? `; trend ${s.trend}${s.trendMultiplier !== undefined ? ` ×${s.trendMultiplier.toFixed(2)}` : ""}` : ""}).`);
  if (s.traps?.length) L.push(`  Latent traps active: ${s.traps.join("; ")}.`);
  if (s.shocks?.length) L.push(`  Shocks applied: ${s.shocks.join("; ")}.`);
  if (s.firstToBreak) L.push(`  First provision to break under load: ${s.firstToBreak}.`);
  if (s.trackGap !== undefined)
    L.push(`  Track synchronisation: Track I phase ${s.trackI}, Track II phase ${s.trackII}, gap ${s.trackGap}${s.trackTolerance !== undefined ? `, tolerated lead ${s.trackTolerance}` : ""}.`);
  if (s.covenants?.length) L.push(`  Covenants drafted upstream: ${s.covenants.join("; ")}.`);
  if (s.survivalScore !== undefined) L.push(`  Treaty survival under stress: ${s.survivalScore} per cent.`);
  const dyn = relationalDynamics(s);
  if (dyn) {
    L.push(`  Relational deficit: Δrel ${dyn.deficit.toFixed(1)} of 8 (${dyn.deficitPct}%), ${dyn.bondsInDeficit} bond(s) below the Viable floor.`);
    L.push(`  Relational contagion: ${dyn.contagion}% spread coefficient.`);
    L.push(`  Relational entropy: H ${dyn.entropy.toFixed(2)}, entropy index ${dyn.entropyIndex.toFixed(3)}.`);
    L.push(`  Decay character: ${dyn.character} (Ω ${dyn.omega.toFixed(2)}).`);
  }
  const a = alerts(s);
  if (a.length) {
    L.push("", "STANDING ALERTS");
    a.forEach((x) => L.push(`  [${x.level.toUpperCase()}] ${x.name}. ${x.reading} ${x.directive}`));
  }
  L.push("");
  return L;
}

/* ------------------------------------------------------------------ */
/* Relational dynamics: deficit, contagion, entropy, decay character   */
/* ------------------------------------------------------------------ */

/** Viability threshold: a bond at or below 3.0 sits outside the Viable band. */
export const VIABLE_FLOOR = 3.0;

export type DecayCharacter = "None" | "Acute" | "Mixed" | "Systemic";

export type RelationalDynamics = {
  /** Per-bond deficit d_i = max(0, 3.0 - B_i). */
  deficits: [number, number, number, number];
  /** Δ_rel = Σ d_i, range 0 to 8. */
  deficit: number;
  /** Δ_rel ÷ 8 × 100. */
  deficitPct: number;
  bondsInDeficit: number;
  /** Normalised Shannon entropy of the deficit distribution, 0 to 1. */
  entropy: number;
  /** S_rel = H × trend multiplier × (Δ_rel ÷ 8): disorder weighted by depth and direction. */
  entropyIndex: number;
  /** Contagion coefficient C_rel in per cent. */
  contagion: number;
  contagionTerms: { label: string; value: number }[];
  /** Ω = H × (k ÷ 4), the systemic share of decay, 0 to 1. */
  omega: number;
  character: DecayCharacter;
};

/**
 * Relational dynamics, read from the bus. Undefined until the bond vector is published.
 *
 *   d_i     = max(0, 3.0 − B_i)              Δ_rel = Σ d_i          (Relational Deficit)
 *   p_i     = d_i ÷ Δ_rel                    H = −Σ p_i ln p_i ÷ ln 4
 *   S_rel   = H × τ × Δ_rel ÷ 8              (Relational Entropy; τ = trend multiplier)
 *   C_rel   = 100 × (σ_B ÷ 2) × (1 + 0.15 n_shock) × (1 + 0.10 n_friction) × (1 + R ÷ 100) ÷ 4.6, capped 100
 *   Ω       = H × k ÷ 4                      (k = bonds in deficit)
 *   Character: None if Δ_rel = 0; Systemic if k ≥ 3 or Ω ≥ 0.5; Acute if k = 1; otherwise Mixed.
 */
export function relationalDynamics(s: Signals): RelationalDynamics | undefined {
  if (!s.bonds) return undefined;
  const b = s.bonds;
  const v = [b.interpersonal, b.communal, b.intergenerational, b.institutional];
  const deficits = v.map((x) => round1(Math.max(0, VIABLE_FLOOR - x))) as [number, number, number, number];
  const deficit = deficits.reduce((a, x) => a + x, 0);
  const k = deficits.filter((x) => x > 0).length;
  let entropy = 0;
  if (deficit > 0)
    for (const d of deficits) if (d > 0) { const p = d / deficit; entropy -= p * Math.log(p); }
  entropy = entropy / Math.log(4);
  const tau = s.trendMultiplier ?? 1;
  const entropyIndex = entropy * tau * (deficit / 8);
  const mean = v.reduce((a, x) => a + x, 0) / 4;
  const sigma = Math.sqrt(v.reduce((a, x) => a + (x - mean) ** 2, 0) / 4);
  const nShock = s.shocks?.length ?? 0;
  const nFric = s.frictionPairs?.length ?? 0;
  const R = s.rupture ?? 0;
  const terms = [
    { label: "σB ÷ 2 (asymmetry carrier)", value: sigma / 2 },
    { label: "1 + 0.15 × shocks", value: 1 + 0.15 * nShock },
    { label: "1 + 0.10 × friction pairs", value: 1 + 0.1 * nFric },
    { label: "1 + R ÷ 100 (rupture load)", value: 1 + R / 100 },
  ];
  const product = terms.reduce((a, t) => a * t.value, 1);
  const contagion = Math.min(100, round1((100 * product) / 4.6 * (1 + deficit / 8)));
  const omega = entropy * (k / 4);
  const character: DecayCharacter =
    deficit === 0 ? "None" : k >= 3 || omega >= 0.5 ? "Systemic" : k === 1 ? "Acute" : "Mixed";
  return {
    deficits,
    deficit: round1(deficit),
    deficitPct: round1((deficit / 8) * 100),
    bondsInDeficit: k,
    entropy,
    entropyIndex,
    contagion,
    contagionTerms: terms,
    omega,
    character,
  };
}

/** Alerts raised by relational dynamics, appended to the standing set. */
export function dynamicsAlerts(s: Signals): Alert[] {
  const d = relationalDynamics(s);
  if (!d) return [];
  const out: Alert[] = [];
  if (d.deficitPct >= 25)
    out.push({
      level: d.deficitPct >= 50 ? "critical" : "elevated",
      name: "Relational deficit",
      reading: `Δrel = ${d.deficit.toFixed(1)} (${d.deficitPct}% of the maximum) across ${d.bondsInDeficit} bond${d.bondsInDeficit === 1 ? "" : "s"} below the Viable floor of 3.0.`,
      directive: "Retire the deficit bond by bond, largest gap first, before the settlement is asked to carry new obligations.",
    });
  if (d.contagion >= 50)
    out.push({
      level: d.contagion >= 75 ? "critical" : "elevated",
      name: "Relational contagion",
      reading: `Contagion coefficient reads ${d.contagion}%: rupture in the weakest bond is positioned to spread to the others.`,
      directive: "Ring-fence the limiting bond with a firebreak provision and sequence shock responses so no two run at once.",
    });
  if (d.character === "Systemic")
    out.push({
      level: "critical",
      name: "Systemic decay",
      reading: `Decay is diffused (H = ${d.entropy.toFixed(2)}, Ω = ${d.omega.toFixed(2)}, entropy index ${d.entropyIndex.toFixed(3)}); this is not a single flashpoint.`,
      directive: "Treat as structural: carry at least two covenants including office continuity, and do not close the file on incident response alone.",
    });
  else if (d.character === "Acute")
    out.push({
      level: "note",
      name: "Acute decay",
      reading: `Decay is concentrated in one bond (Ω = ${d.omega.toFixed(2)}).`,
      directive: "Targeted remedy on the single affected bond is proportionate; monitor for diffusion.",
    });
  return out;
}
