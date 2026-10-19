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
  nearest: CaseMatch;
  /** The three nearest canonical cases, closest first (ties go to the earlier case). */
  topThree: CaseMatch[];
};

export type CaseMatch = { slug: string; shortTitle: string; distance: number; resonance: number };

/**
 * Canonical cases ranked by Euclidean distance to the vector, closest first.
 * The sort is stable, so cases at the same distance keep canonical order.
 */
export function rankCases(v: readonly number[], n = 3): CaseMatch[] {
  return CASES.map((c, i) => {
    const d = Math.sqrt(c.scores.reduce((a, s, k) => a + (s - v[k]) ** 2, 0));
    return { i, m: { slug: c.slug, shortTitle: c.shortTitle, distance: d, resonance: Math.round((1 - d / MAX_DISTANCE) * 100) } };
  })
    // Distances within floating-point noise count as a tie and keep canonical order.
    .sort((a, b) => (Math.abs(a.m.distance - b.m.distance) > TIE_EPSILON ? a.m.distance - b.m.distance : a.i - b.i))
    .slice(0, n)
    .map((x) => x.m);
}

/** Two case distances closer than this are the same distance (scores are given to one decimal). */
const TIE_EPSILON = 1e-9;

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
  const topThree = rankCases(v, 3);
  return {
    vector: v,
    mean,
    variance,
    spread,
    limitingIndex,
    limitingScore,
    nearest: topThree[0],
    topThree,
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
  /** 1, 2 or 3 for the three closest cases, otherwise null. */
  rank: 1 | 2 | 3 | null;
};

/**
 * Euclidean distance d(B, C_k) and resonance R_k to all eight canonical cases,
 * in canonical case order, with the closest historical twin flagged and the
 * three closest ranked 1 to 3.
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
      rank: null as DistanceRow["rank"],
    };
  });
  // Same ordering and tie rule as rankCases, so every desk agrees on the top three.
  rankCases(v).forEach((m, k) => {
    const row = rows.find((r) => r.slug === m.slug)!;
    row.rank = (k + 1) as 1 | 2 | 3;
    if (k === 0) row.nearest = true;
  });
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

/* ------------------------------------------------------------------ */
/* Sovereign Custom Mode: analyst-inscribed entities on the bus        */
/* ------------------------------------------------------------------ */

export type SpoilerRisk = "Low" | "Medium" | "High" | "Critical";
export type CustomParty = {
  id: string;
  name: string;
  constituency: string;
  /** 1 to 5. */
  vulnerability: number;
  /** 1 to 5. */
  leverage: number;
  spoilerRisk: SpoilerRisk;
  vetoPower: boolean;
};
export type CustomTrap = { id: string; name: string; condition: string; warningSymptom: string; countermeasure: string; active: boolean };
export type CustomShock = { id: string; name: string; description: string; deltas: BondVector };
export const ENFORCEMENT_MECHANISMS = ["Automatic Jurisdiction", "Independent Trustee", "Sunset Audit", "Communal Quorum"] as const;
export type CustomCovenant = {
  id: string;
  title: string;
  obligation: string;
  enforcementMechanism: (typeof ENFORCEMENT_MECHANISMS)[number];
  mandatedArticleRef?: string;
};
export type CustomGate = { id: string; label: string; verified: boolean };
export type CustomTrack = { id: string; name: string; phase: number; description: string };
export type CustomPrecedent = { id: string; name: string; scores: [number, number, number, number]; lesson: string };
export type CustomPhrase = { id: string; phrase: string; replacement: string; rationale: string };
/** Free inscriptions recorded by a desk (tribunal, hostile posture, tactic, protocol, seal, annex). */
export type CustomNote = { id: string; desk: string; kind: string; title: string; body: string };

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
  /** The three nearest documented cases by short title, closest first. */
  analogues?: string[];
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
  /** Active theatre named in the mission profile; feeds the registry sigil. */
  theatre?: string;
  /** Division II, asymmetry matrix: highest inter-party friction coefficient (0 to 1) and the veto holder on the limiting bond. */
  partyFriction?: number;
  vetoHolder?: string;
  /** Omni-theatre preset: the active preset id and a counter bumped on every hydration, so desks re-seed. */
  presetId?: string;
  presetEpoch?: number;
  /** Field Audit Bench: share of affected parties with all safeguards complete (0 to 100). */
  safeguardCoverage?: number;
  /** Litigation desk: the forum the matter is being prepared for. */
  litigationForum?: string;
  /** Counterpart desk: the archetype being prepared for. */
  counterpart?: string;
  /** Desk 17, decay horizon: treaty half-life T½ in months (0 when no modelled decay) and mean bond loss at the chosen horizon. */
  decayHalfLife?: number;
  projectedDegradation?: number;
  /** Desk 17: monthly decay constant λ = (U + R) ÷ 2000, and the half-life restated in days. */
  decayConstant?: number;
  stabilityHalfLifeDays?: number;
  /** Desk 7, dispute forum chosen for the accord and its enforceability index E (0 to 100). */
  disputeForum?: string;
  disputeEnforceability?: number;
  /** Whether the dispute clause waives immunity from jurisdiction and execution. */
  immunityWaived?: boolean;
  /** Desk 11, sovereign escrow: share released (0 to 100) and whether the rupture freeze is engaged. */
  escrowReleased?: number;
  escrowFrozen?: boolean;
  /** Number of escrow tranches met, in order, out of four. */
  escrowTranchesMet?: number;
  /** Sovereign Custom Mode inscriptions. Every list rides the bus, the digest and the manifest. */
  customRules?: string[];
  customParties?: CustomParty[];
  customTraps?: CustomTrap[];
  customShocks?: CustomShock[];
  customCovenants?: CustomCovenant[];
  customGates?: CustomGate[];
  customTracks?: CustomTrack[];
  customPrecedents?: CustomPrecedent[];
  customPhrases?: CustomPhrase[];
  customNotes?: CustomNote[];
};

const SIGNAL_NUMBERS = [
  "bondMean", "weakestScore", "bondVariance", "trackTolerance", "rupture", "trendMultiplier",
  "shockSeverity", "trackI", "trackII", "trackGap", "seatedParties", "redlineFlags", "survivalScore",
  "handoverViability", "partyFriction", "presetEpoch", "safeguardCoverage",
  "decayHalfLife", "projectedDegradation", "disputeEnforceability", "escrowReleased",
  "decayConstant", "stabilityHalfLifeDays", "escrowTranchesMet",
] as const;
const SIGNAL_STRINGS = [
  "weakestBond", "weakestBand", "communalBand", "standing", "analogue", "ruptureBand", "trend",
  "firstToBreak", "gatesCleared", "handoverBand", "oversightBody", "theatre", "vetoHolder", "presetId", "litigationForum", "counterpart",
  "disputeForum",
] as const;
const SIGNAL_BOOLEANS = ["elitePactAlert", "verifierSeated", "escrowFrozen", "immunityWaived"] as const;
const SIGNAL_STRING_LISTS = ["analogues", "traps", "shocks", "frictionPairs", "covenants", "mirrors", "customRules"] as const;

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
  Object.assign(out, sanitizeInscriptions(src));
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

/* Sanitisers for the inscription lists read back from an archive. */
const str = (x: unknown, max = 600) => (typeof x === "string" ? x.slice(0, max) : "");
const num = (x: unknown, lo: number, hi: number, d: number) => {
  const n = Number(x);
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, round1(n))) : d;
};
const objs = (x: unknown) => (Array.isArray(x) ? x.filter((o): o is Record<string, unknown> => !!o && typeof o === "object").slice(0, 40) : undefined);
const delta = (x: unknown) => num(x, -4, 4, 0);

function sanitizeInscriptions(src: Record<string, unknown>): Partial<Signals> {
  const out: Partial<Signals> = {};
  const id = (o: Record<string, unknown>) => str(o.id, 40) || Math.random().toString(36).slice(2, 10);
  const parties = objs(src.customParties);
  if (parties)
    out.customParties = parties.map((o) => ({
      id: id(o), name: str(o.name, 120), constituency: str(o.constituency, 200),
      vulnerability: num(o.vulnerability, 1, 5, 3), leverage: num(o.leverage, 1, 5, 3),
      spoilerRisk: (["Low", "Medium", "High", "Critical"] as const).find((r) => r === o.spoilerRisk) ?? "Low",
      vetoPower: o.vetoPower === true,
    })).filter((p) => p.name);
  const traps = objs(src.customTraps);
  if (traps)
    out.customTraps = traps.map((o) => ({ id: id(o), name: str(o.name, 120), condition: str(o.condition), warningSymptom: str(o.warningSymptom), countermeasure: str(o.countermeasure), active: o.active !== false })).filter((t) => t.name);
  const shocks = objs(src.customShocks);
  if (shocks)
    out.customShocks = shocks.map((o) => {
      const d = (o.deltas ?? {}) as Record<string, unknown>;
      return { id: id(o), name: str(o.name, 120), description: str(o.description), deltas: { interpersonal: delta(d.interpersonal), communal: delta(d.communal), intergenerational: delta(d.intergenerational), institutional: delta(d.institutional) } };
    }).filter((x) => x.name);
  const covs = objs(src.customCovenants);
  if (covs)
    out.customCovenants = covs.map((o) => ({
      id: id(o), title: str(o.title, 160), obligation: str(o.obligation),
      enforcementMechanism: ENFORCEMENT_MECHANISMS.find((m) => m === o.enforcementMechanism) ?? "Independent Trustee",
      mandatedArticleRef: str(o.mandatedArticleRef, 20) || undefined,
    })).filter((c) => c.title);
  const gates = objs(src.customGates);
  if (gates) out.customGates = gates.map((o) => ({ id: id(o), label: str(o.label, 160), verified: o.verified === true })).filter((g) => g.label);
  const tracks = objs(src.customTracks);
  if (tracks) out.customTracks = tracks.map((o) => ({ id: id(o), name: str(o.name, 120), phase: Math.round(num(o.phase, 0, 6, 0)), description: str(o.description) })).filter((t) => t.name);
  const precs = objs(src.customPrecedents);
  if (precs)
    out.customPrecedents = precs.map((o) => {
      const sc = Array.isArray(o.scores) ? o.scores : [];
      return { id: id(o), name: str(o.name, 120), scores: [0, 1, 2, 3].map((i) => num(sc[i], 1, 5, 3)) as [number, number, number, number], lesson: str(o.lesson) };
    }).filter((p) => p.name);
  const phrases = objs(src.customPhrases);
  if (phrases) out.customPhrases = phrases.map((o) => ({ id: id(o), phrase: str(o.phrase, 160), replacement: str(o.replacement, 300), rationale: str(o.rationale) })).filter((p) => p.phrase.trim());
  const notes = objs(src.customNotes);
  if (notes) out.customNotes = notes.map((o) => ({ id: id(o), desk: str(o.desk, 40), kind: str(o.kind, 60), title: str(o.title, 160), body: str(o.body, 2000) })).filter((n) => n.title);
  return out;
}

/**
 * The effective mission state every desk reads. Inscribed compound shocks depress
 * the published bond vector (clamped to the 1.0 to 5.0 scale), and the limiting bond,
 * communal band and Track I tolerance are re-derived from the stressed vector. Active
 * inscribed traps join the latent trap list, inscribed covenants join the covenant
 * register, and inscribed shocks join the shock list. Raw inputs stay untouched on the
 * bus, so removing an inscription restores the reading exactly.
 */
export function applyInscriptions(s: Signals): Signals {
  const shocks = s.customShocks ?? [];
  const traps = (s.customTraps ?? []).filter((t) => t.active);
  const covs = s.customCovenants ?? [];
  if (!shocks.length && !traps.length && !covs.length) return withCaseMatches(s);
  const out: Signals = { ...s };
  if (shocks.length && s.bonds) {
    const d = inscribedShockDelta(s);
    const b: BondVector = {
      interpersonal: clampScore(s.bonds.interpersonal + d.interpersonal),
      communal: clampScore(s.bonds.communal + d.communal),
      intergenerational: clampScore(s.bonds.intergenerational + d.intergenerational),
      institutional: clampScore(s.bonds.institutional + d.institutional),
    };
    const v: [number, number, number, number] = [b.interpersonal, b.communal, b.intergenerational, b.institutional];
    let w = 0;
    v.forEach((x, i) => { if (x < v[w]) w = i; });
    const m = mathReading(v);
    out.bonds = b;
    out.bondMean = Math.round(m.mean * 100) / 100;
    out.bondVariance = m.variance;
    out.weakestBond = BOND_NAMES[w];
    out.weakestScore = v[w];
    out.weakestBand = bondBand(v[w]);
    out.communalBand = bondBand(b.communal);
    out.trackTolerance = communalTolerance(b.communal).phases;
    if (s.trackGap !== undefined) out.elitePactAlert = s.trackGap > out.trackTolerance;
  }
  if (shocks.length) out.shocks = [...(s.shocks ?? []), ...shocks.map((x) => x.name)];
  if (traps.length) out.traps = [...(s.traps ?? []), ...traps.map((t) => t.name)];
  if (covs.length) out.covenants = [...(s.covenants ?? []), ...covs.map((c) => `${c.title} (${c.enforcementMechanism})`)];
  return withCaseMatches(out);
}

/**
 * Derive the nearest documented cases from whatever bond vector the state carries.
 * This runs on the effective state, so the top three follow every change from any
 * source: sliders, the delta simulator, presets, archive restores, imports and
 * inscribed shocks. It returns the same object when the ranking is unchanged.
 */
export function withCaseMatches(s: Signals): Signals {
  if (!s.bonds) return s;
  const b = s.bonds;
  const titles = rankCases([b.interpersonal, b.communal, b.intergenerational, b.institutional]).map((m) => m.shortTitle);
  if (s.analogue === titles[0] && s.analogues?.length === titles.length && s.analogues.every((t, i) => t === titles[i])) return s;
  return { ...s, analogue: titles[0], analogues: titles };
}

/** Summed bond deltas of every inscribed shock. */
export function inscribedShockDelta(s: Signals): BondVector {
  const z: BondVector = { interpersonal: 0, communal: 0, intergenerational: 0, institutional: 0 };
  for (const x of s.customShocks ?? []) {
    z.interpersonal = round1(z.interpersonal + x.deltas.interpersonal);
    z.communal = round1(z.communal + x.deltas.communal);
    z.intergenerational = round1(z.intergenerational + x.deltas.intergenerational);
    z.institutional = round1(z.institutional + x.deltas.institutional);
  }
  return z;
}

/** Count of every inscription on the bus. */
export function inscriptionCount(s: Signals): number {
  return (s.customRules?.length ?? 0) + (s.customParties?.length ?? 0) + (s.customTraps?.length ?? 0) + (s.customShocks?.length ?? 0) +
    (s.customCovenants?.length ?? 0) + (s.customGates?.length ?? 0) + (s.customTracks?.length ?? 0) + (s.customPrecedents?.length ?? 0) +
    (s.customPhrases?.length ?? 0) + (s.customNotes?.length ?? 0);
}

/** The Sovereign Inscriptions schedule printed in every transmittal manifest. */
export function inscriptionLines(s: Signals): string[] {
  if (!inscriptionCount(s)) return [];
  const L: string[] = ["SOVEREIGN INSCRIPTIONS (custom mode, entered by the drafting officer)"];
  const f = (n: number) => (n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1));
  s.customRules?.forEach((r) => L.push(`  Boundary rule: ${r}`));
  s.customParties?.forEach((p) => L.push(`  Party: ${p.name}${p.constituency ? ` (${p.constituency})` : ""}; leverage ${p.leverage.toFixed(1)}, vulnerability ${p.vulnerability.toFixed(1)}, spoiler risk ${p.spoilerRisk}${p.vetoPower ? ", holds a veto" : ""}.`));
  s.customShocks?.forEach((x) => L.push(`  Compound shock: ${x.name}; deltas ${f(x.deltas.interpersonal)} / ${f(x.deltas.communal)} / ${f(x.deltas.intergenerational)} / ${f(x.deltas.institutional)}${x.description ? `. ${x.description}` : ""}`));
  s.customTraps?.forEach((t) => L.push(`  Latent trap (${t.active ? "active" : "dormant"}): ${t.name}${t.condition ? `. Trigger: ${t.condition}` : ""}${t.warningSymptom ? `. Warning: ${t.warningSymptom}` : ""}${t.countermeasure ? `. Counter-measure: ${t.countermeasure}` : ""}`));
  s.customCovenants?.forEach((c) => L.push(`  Covenant: ${c.title}; ${c.obligation} Enforcement: ${c.enforcementMechanism}${c.mandatedArticleRef ? `; article ${c.mandatedArticleRef}` : ""}.`));
  s.customGates?.forEach((g) => L.push(`  Readiness gate: ${g.label} (${g.verified ? "attested" : "awaiting attestation"}).`));
  s.customTracks?.forEach((t) => L.push(`  Track III: ${t.name} at phase ${t.phase}${t.description ? `. ${t.description}` : ""}`));
  s.customPrecedents?.forEach((p) => L.push(`  Precedent: ${p.name} (${p.scores.map((x) => x.toFixed(1)).join(", ")})${p.lesson ? `. ${p.lesson}` : ""}`));
  s.customPhrases?.forEach((p) => L.push(`  Prohibited phrase: "${p.phrase}" to read "${p.replacement}"${p.rationale ? `. ${p.rationale}` : ""}`));
  s.customNotes?.forEach((n) => L.push(`  ${n.kind}: ${n.title}${n.body ? `. ${n.body}` : ""}`));
  L.push("");
  return L;
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
    (s.covenants?.length ?? 0) > 0 ||
    inscriptionCount(s) > 0
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

  // Canonical 3.0 viable floor: a limiting bond below it trips a critical alert even before it reaches Failing.
  if (s.weakestBond && s.weakestScore !== undefined && breachesFloor(s.weakestScore) && bondBand(s.weakestScore) !== "Failing")
    out.push({
      level: "critical",
      name: "Viable floor breached",
      reading: `The ${s.weakestBond.toLowerCase()} bond, the limiting factor, scores ${s.weakestScore.toFixed(1)} of 5, at or below the ${VIABLE_FLOOR.toFixed(1)} viable floor.`,
      directive: "Lift the limiting bond above the viable floor through targeted repair before any further step is tabled.",
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

  if (s.trackI !== undefined)
    for (const t of s.customTracks ?? []) {
      const lead = s.trackI - t.phase;
      const tol = s.trackTolerance ?? 1;
      if (lead > tol)
        out.push({
          level: "elevated",
          name: `Track III shear: ${t.name}`,
          reading: `Track I leads the inscribed ${t.name} track by ${lead} phases, against a tolerance of ${tol}.`,
          directive: "Advance the civil society or communal assembly track before Track I tables its next step.",
        });
    }

  const pending = (s.customGates ?? []).filter((g) => !g.verified);
  if (pending.length)
    out.push({
      level: "note",
      name: "Sovereign readiness gates awaiting attestation",
      reading: `${pending.length} inscribed gate${pending.length === 1 ? "" : "s"} not yet attested: ${pending.map((g) => g.label).join("; ")}.`,
      directive: "Attest each inscribed gate on the Mission Readiness Bench before certification.",
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

/** The five chancellery stage-gates read from the bus. Any failed gate locks the mission disposition. */
export type StageGate = { name: string; passed: boolean; reading: string; directive: string };
export function stageGateAudit(s: Signals): { gates: StageGate[]; locked: boolean } {
  const cov = (s.covenants ?? []).join(" ").toLowerCase();
  const continuity = /personal|continuity|office|atrophy/.test(cov);
  const nCov = s.covenants?.length ?? 0;
  const gates: StageGate[] = [];

  // 1. Vector Integrity: all four bonds scored, none in the Failing band.
  if (!s.bonds) {
    gates.push({ name: "Vector Integrity", passed: false, reading: "No bond vector on the bus.", directive: "Score all four bonds on the Assessment Bench (Desk 1)." });
  } else {
    const v = [s.bonds.interpersonal, s.bonds.communal, s.bonds.intergenerational, s.bonds.institutional];
    const failing = v.filter((x) => bondBand(x) === "Failing").length;
    const below = v.filter(breachesFloor).length;
    const deficit = round1(v.reduce((n, x) => n + Math.max(0, VIABLE_FLOOR - x), 0));
    gates.push({
      name: "Vector Integrity",
      passed: below === 0,
      reading: `${below} bond${below === 1 ? "" : "s"} at or below the ${VIABLE_FLOOR.toFixed(1)} viable floor (${failing} Failing); relational deficit Δ ${deficit.toFixed(1)}.`,
      directive: `Lift every bond above the ${VIABLE_FLOOR.toFixed(1)} viable floor through targeted repair before the mission proceeds.`,
    });
  }

  // 2. Rupture Containment: rupture measured; Elevated or worse requires a seated verifier.
  if (s.rupture === undefined) {
    gates.push({ name: "Rupture Containment", passed: false, reading: "Rupture index not yet measured.", directive: "Record tripwires in the Sentinel Matrix (Desk 2)." });
  } else {
    const ok = s.rupture < 35 || s.verifierSeated === true;
    gates.push({
      name: "Rupture Containment",
      passed: ok,
      reading: `Rupture index ${s.rupture}%${s.ruptureBand ? ` (${s.ruptureBand})` : ""}${s.rupture >= 35 ? `; verifier ${s.verifierSeated ? "seated" : "not seated"}` : ""}.`,
      directive: "Seat an independent verifier in the Verification Ledger while the rupture index is 35% or higher.",
    });
  }

  // 3. Track Synchronization: Track I within the communal tolerance.
  if (s.trackGap === undefined) {
    gates.push({ name: "Track Synchronization", passed: false, reading: "Track sequence not yet recorded.", directive: "Record both tracks in the Kinematic Track Sequencer (Desk 8)." });
  } else {
    const tol = s.trackTolerance ?? 1;
    gates.push({
      name: "Track Synchronization",
      passed: !s.elitePactAlert && s.trackGap <= tol,
      reading: `Track I ${s.trackI ?? 0} · Track II ${s.trackII ?? 0}; lead ${s.trackGap} against a tolerance of ${tol}.`,
      directive: "Hold Track I and advance the communal track until the lead is within tolerance.",
    });
  }

  // 4. Structural Covenants: at least one covenant; two under compound shock or a Failing bond; continuity when rupture is Elevated.
  const weakFailing = s.weakestScore !== undefined && bondBand(s.weakestScore) === "Failing";
  const needed = (s.shocks?.length ?? 0) >= 2 || weakFailing ? 2 : 1;
  const needContinuity = s.rupture !== undefined && s.rupture >= 35;
  gates.push({
    name: "Structural Covenants",
    passed: nCov >= needed && (!needContinuity || continuity),
    reading: `${nCov} covenant${nCov === 1 ? "" : "s"} drafted; ${needed} required${needContinuity ? ", including an office-continuity provision" : ""}.`,
    directive: needContinuity && !continuity
      ? "Draft an office-continuity provision in the Clause Architect."
      : `Draft at least ${needed} covenant${needed === 1 ? "" : "s"} in the Clause Architect.`,
  });

  // 5. Succession Durability: treaty survival at or above the succession trap.
  if (s.survivalScore === undefined) {
    gates.push({ name: "Succession Durability", passed: false, reading: "Succession not yet stress-tested.", directive: "Run the Succession Simulator." });
  } else {
    gates.push({
      name: "Succession Durability",
      passed: s.survivalScore >= SUCCESSION_TRAP,
      reading: `Survival under succession stress ${s.survivalScore}% (trap below ${SUCCESSION_TRAP}%).`,
      directive: `Close failing provisions in the Succession Simulator until survival reaches ${SUCCESSION_TRAP}%.`,
    });
  }

  return { gates, locked: gates.some((g) => !g.passed) };
}

export type Clearance = {
  /** Article number within the schedule, 1.1 to 5.4. */
  id: string;
  /** The canonical stage gate this clearance belongs to. */
  gate: string;
  name: string;
  passed: boolean;
  /**
   * Binding clearances decompose their gate exactly: a gate passes if and only if
   * all of its binding clearances pass. Advisory clearances are recorded on the
   * schedule and the attestation but never lock the mission.
   */
  binding: boolean;
};

/**
 * Schedule of the twenty statutory clearances: four articles under each of the five
 * canonical stage gates. stageGateAudit() stays the sole authority on locks; this
 * schedule only itemises it, plus five advisory readings, deterministically from the bus.
 */
export function statutoryClearances(s: Signals): Clearance[] {
  const v = s.bonds ? [s.bonds.interpersonal, s.bonds.communal, s.bonds.intergenerational, s.bonds.institutional] : [];
  const cov = (s.covenants ?? []).join(" ").toLowerCase();
  const nCov = s.covenants?.length ?? 0;
  const weakFailing = s.weakestScore !== undefined && bondBand(s.weakestScore) === "Failing";
  const needed = (s.shocks?.length ?? 0) >= 2 || weakFailing ? 2 : 1;
  const needContinuity = s.rupture !== undefined && s.rupture >= 35;
  const tol = s.trackTolerance ?? 1;
  const C = (id: string, gate: string, name: string, passed: boolean, binding = true): Clearance => ({ id, gate, name, passed, binding });
  const VI = "Vector Integrity", RC = "Rupture Containment", TS = "Track Synchronization", SC = "Structural Covenants", SD = "Succession Durability";
  return [
    C("1.1", VI, "Four-bond vector recorded", v.length === 4),
    C("1.2", VI, "No bond in the Failing band", v.length === 4 && v.every((x) => bondBand(x) !== "Failing")),
    C("1.3", VI, `Every bond above the ${VIABLE_FLOOR.toFixed(1)} viable floor`, v.length === 4 && v.every(holdsFloor)),
    C("1.4", VI, "Vector cohesion: spread within 1.5", v.length === 4 && Math.max(...v) - Math.min(...v) <= 1.5, false),
    C("2.1", RC, "Rupture index measured", s.rupture !== undefined),
    C("2.2", RC, "Below the 60% critical threshold, or verifier seated", s.rupture !== undefined && (s.rupture < 60 || s.verifierSeated === true)),
    C("2.3", RC, "Below the 35% elevated threshold, or verifier seated", s.rupture !== undefined && (s.rupture < 35 || s.verifierSeated === true)),
    C("2.4", RC, "No latent trap active", !(s.traps?.length), false),
    C("3.1", TS, "Both tracks recorded", s.trackGap !== undefined),
    C("3.2", TS, "No Elite-Pact Mirage alert", s.trackGap !== undefined && !s.elitePactAlert),
    C("3.3", TS, "Track I lead within communal tolerance", s.trackGap !== undefined && s.trackGap <= tol),
    C("3.4", TS, "Communal track opened", (s.trackII ?? 0) > 0, false),
    C("4.1", SC, "At least one covenant drafted", nCov >= 1),
    C("4.2", SC, "Second covenant under compound shock or a Failing bond", nCov >= needed),
    C("4.3", SC, "Office-continuity provision while rupture is 35% or higher", !needContinuity || /personal|continuity|office|atrophy/.test(cov)),
    C("4.4", SC, "No open redline flag", !s.redlineFlags, false),
    C("5.1", SD, "Succession stress-tested", s.survivalScore !== undefined),
    C("5.2", SD, `Survival at or above the ${SUCCESSION_TRAP}% succession trap`, s.survivalScore !== undefined && s.survivalScore >= SUCCESSION_TRAP),
    C("5.3", SD, "Mandate handover viability 60% or higher", (s.handoverViability ?? 0) >= 60, false),
    C("5.4", SD, "Oversight body named", !!s.oversightBody?.trim(), false),
  ];
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
  if (s.safeguardCoverage !== undefined) L.push(`  Stakeholder safeguards complete: ${s.safeguardCoverage} per cent of affected parties.`);
  if (s.decayHalfLife !== undefined)
    L.push(s.decayHalfLife > 0
      ? `  Decay horizon: treaty half-life ${s.decayHalfLife} months${s.stabilityHalfLifeDays ? ` (${s.stabilityHalfLifeDays} days)` : ""}${s.decayConstant !== undefined ? `, λ ${s.decayConstant.toFixed(4)} per month` : ""}${s.projectedDegradation !== undefined ? `, mean bond loss ${s.projectedDegradation.toFixed(2)} at the chosen horizon` : ""}.`
      : "  Decay horizon: no modelled decay (no uninsulated exposure and no rupture).");
  if (s.disputeForum)
    L.push(`  Dispute forum: ${s.disputeForum}${s.disputeEnforceability !== undefined ? `, venue fitness ${s.disputeEnforceability} of 100` : ""}${s.immunityWaived === false ? "; immunity not waived" : ""}.`);
  if (s.escrowReleased !== undefined)
    L.push(s.escrowFrozen
      ? "  Conditional escrow: frozen, rupture at or above 60 per cent; 0 per cent released."
      : `  Conditional escrow: ${s.escrowReleased} per cent released${s.escrowTranchesMet !== undefined ? `, ${s.escrowTranchesMet} of 4 tranches met` : ""}.`);
  if (s.litigationForum) L.push(`  Litigation forum in preparation: ${s.litigationForum}.`);
  if (s.counterpart) L.push(`  Counterpart being prepared for: ${s.counterpart}.`);
  const dyn = relationalDynamics(s);
  if (dyn) {
    L.push(`  Relational deficit: Δrel ${dyn.deficit.toFixed(1)} of 8 (${dyn.deficitPct}%), ${dyn.bondsInDeficit} bond(s) below the Viable floor.`);
    L.push(`  Relational contagion: ${dyn.contagion}% spread coefficient.`);
    L.push(`  Relational entropy: H ${dyn.entropy.toFixed(2)}, entropy index ${dyn.entropyIndex.toFixed(3)}.`);
    L.push(`  Decay character: ${dyn.character} (Ω ${dyn.omega.toFixed(2)}).`);
  }
  const ins = inscriptionLines(s);
  if (ins.length) L.push("", ...ins.slice(0, -1));
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
/** Canonical floor test: a score at or below 3.0 is a statutory rupture. */
export const breachesFloor = (x: number) => x <= VIABLE_FLOOR;
/** A bond holds the floor only when it sits strictly above 3.0. */
export const holdsFloor = (x: number) => x > VIABLE_FLOOR;

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
