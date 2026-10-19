import type { BondVector } from "./engine";

/**
 * Three deterministic instruments: the Succession desk's decay horizon, the Clause Architect's forum bench and the Multi-Party desk's escrow.
 * Pure arithmetic on what the analyst entered and what the MissionEngine carries.
 * Nothing here predicts events; every figure is a rule applied to the inputs.
 */

/* ------------------------------------------------------------------ */
/* Decay Horizon (Succession desk)                                             */
/* ------------------------------------------------------------------ */

export const DECAY_HORIZONS = [6, 12, 24, 36] as const;

/** Mean Gregorian month, used only to restate the half-life in days. */
export const DAYS_PER_MONTH = 30.4375;

export type DecayReading = {
  /** Monthly decay constant λ = (U + R) ÷ 2000. */
  lambda: number;
  /** T½ = ln 2 ÷ λ, in months; null when λ = 0. */
  halfLife: number | null;
  /** The same half-life in days (months × 30.4375); null when λ = 0. */
  halfLifeDays: number | null;
  months: number;
  bonds: { name: string; now: number; then: number; lambda: number }[];
  /** Mean loss across the four bonds at the horizon, to two decimals. */
  meanLoss: number;
};

/**
 * U is the uninsulated exposure in points (full severity of each uninsulated shock,
 * a quarter of each insulated one); R is the rupture index in per cent.
 * Each bond decays toward the 1.0 floor at λᵢ = λ × (0.5 + strainᵢ ÷ 100):
 *   Bᵢ(t) = 1 + (Bᵢ − 1) × e^(−λᵢ t)
 */
export function decayHorizon(
  bonds: BondVector,
  strain: number[],
  exposure: number,
  rupture: number,
  months: number,
): DecayReading {
  const lambda = Math.max(0, exposure + rupture) / 2000;
  const halfLife = lambda > 0 ? Math.LN2 / lambda : null;
  const halfLifeDays = halfLife === null ? null : Math.round(halfLife * DAYS_PER_MONTH);
  const vals = [bonds.interpersonal, bonds.communal, bonds.intergenerational, bonds.institutional];
  const names = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];
  const rows = vals.map((now, i) => {
    const li = lambda * (0.5 + (strain[i] ?? 0) / 100);
    const then = 1 + (now - 1) * Math.exp(-li * months);
    return { name: names[i], now, then: Math.round(then * 100) / 100, lambda: li };
  });
  const meanLoss = Math.round((rows.reduce((a, r) => a + (r.now - r.then), 0) / 4) * 100) / 100;
  return { lambda, halfLife, halfLifeDays, months, bonds: rows, meanLoss };
}

/* ------------------------------------------------------------------ */
/* Dispute forum enforceability matrix (Clause Architect)                                       */
/* ------------------------------------------------------------------ */

/**
 * Ratings are doctrinal ordinal judgements on a 1 to 5 scale, not measured statistics:
 * teeth = strength of the enforcement route, immunity = exposure to a sovereign-immunity
 * defence at execution (5 = most exposed), pace = speed of the procedure (5 = fastest).
 */
export type Forum = { id: string; name: string; basis: string; route: string; teeth: number; immunity: number; pace: number; article: string; interState?: boolean };

export const FORUMS: Forum[] = [
  { id: "icsid", name: "ICSID", basis: "Washington Convention 1965, arts. 25, 53–55", route: "Pecuniary obligations enforced as a final domestic judgment (art. 54); execution subject to art. 55", teeth: 5, immunity: 3, pace: 3,
    article: "Any dispute arising out of an investment made under this instrument shall be submitted to the International Centre for Settlement of Investment Disputes for arbitration under the Washington Convention, each Party giving its consent under Article 25 and agreeing that the award shall be binding and recognised under Article 54." },
  { id: "pca", name: "Permanent Court of Arbitration", basis: "PCA Arbitration Rules 2012; New York Convention 1958", route: "Recognition under the New York Convention in any Contracting State", teeth: 4, immunity: 3, pace: 4,
    article: "Any dispute arising under this instrument shall be finally settled by arbitration administered by the Permanent Court of Arbitration under its Arbitration Rules 2012, seated at The Hague." },
  { id: "lcia", name: "LCIA", basis: "LCIA Arbitration Rules 2020; New York Convention 1958", route: "Recognition under the New York Convention; English supervisory courts at a London seat", teeth: 4, immunity: 4, pace: 5,
    article: "Any dispute arising out of or in connection with this instrument shall be referred to and finally resolved by arbitration under the LCIA Rules, which Rules are deemed to be incorporated by reference into this clause." },
  { id: "icc", name: "ICC International Court of Arbitration", basis: "ICC Arbitration Rules 2021; New York Convention 1958", route: "Recognition under the New York Convention; scrutiny of the award by the ICC Court", teeth: 4, immunity: 3, pace: 3,
    article: "All disputes arising out of or in connection with this instrument shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by one or more arbitrators appointed in accordance with the said Rules." },
  { id: "swiss", name: "Swiss Arbitration Centre", basis: "Swiss Rules of International Arbitration 2021; PILA ch. 12", route: "Recognition under the New York Convention; limited annulment before the Swiss Federal Supreme Court", teeth: 4, immunity: 4, pace: 4,
    article: "Any dispute arising out of or in relation to this instrument shall be resolved by arbitration in accordance with the Swiss Rules of International Arbitration of the Swiss Arbitration Centre in force on the date the Notice of Arbitration is submitted." },
  { id: "siac", name: "SIAC Singapore", basis: "SIAC Rules 2025; International Arbitration Act 1994 (Singapore)", route: "Recognition under the New York Convention; Singapore courts at a Singapore seat", teeth: 3, immunity: 2, pace: 3,
    article: "Any dispute arising out of or in connection with this instrument shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre in accordance with the Arbitration Rules of the Singapore International Arbitration Centre for the time being in force." },
  { id: "ccja", name: "OHADA Common Court (CCJA)", basis: "OHADA Treaty art. 21; Uniform Act on Arbitration", route: "Exequatur granted by the CCJA, enforceable across OHADA member States", teeth: 4, immunity: 3, pace: 3,
    article: "Any dispute arising under this instrument shall be settled by arbitration under the Rules of Arbitration of the Common Court of Justice and Arbitration of OHADA, the award to receive exequatur from that Court and to be enforceable in every member State." },
  { id: "uncitral", name: "UNCITRAL ad hoc tribunal", basis: "UNCITRAL Arbitration Rules; Model Law", route: "Recognition under the New York Convention at the seat and abroad", teeth: 3, immunity: 4, pace: 4,
    article: "Any dispute arising under this instrument shall be settled by an ad hoc tribunal of three arbitrators under the UNCITRAL Arbitration Rules, seated in a State party to the New York Convention." },
  { id: "icj", name: "International Court of Justice", basis: "ICJ Statute art. 36; UN Charter art. 94", route: "Compliance by the State; referral to the Security Council under art. 94(2)", teeth: 3, immunity: 4, pace: 1, interState: true,
    article: "Any dispute between the Contracting States concerning the interpretation or application of this instrument shall, failing settlement by negotiation within six months, be submitted to the International Court of Justice by either Party, each Party hereby accepting the jurisdiction of the Court under Article 36(1) of its Statute." },
];

/** Deducted when the clause does not waive immunity from jurisdiction and execution (award forums only). */
export const IMMUNITY_PENALTY = 18;
/** Deducted when the seat lies in the territory of a party to the dispute. */
export const SEAT_PENALTY = 8;

export const WAIVER_TEXT = " Each Party expressly and irrevocably waives any immunity from jurisdiction and from execution, including attachment of assets other than diplomatic, consular and military property, in respect of any proceedings or award under this clause.";

export type ForumTerms = { immunityWaived: boolean; neutralSeat: boolean };

/**
 * Venue fitness F = E − 18 (immunity not waived, award forums only) − 8 (seat not neutral), floored at 0.
 * The ICJ binds States directly and is not executed in domestic courts, so neither deduction applies to it.
 */
export function forumFitness(f: Forum, t: ForumTerms) {
  const base = enforceability(f);
  const immunity = !f.interState && !t.immunityWaived ? IMMUNITY_PENALTY : 0;
  const seat = !f.interState && !t.neutralSeat ? SEAT_PENALTY : 0;
  return { base, immunity, seat, fitness: Math.max(0, base - immunity - seat) };
}

/** The operative clause as it will be drafted: the forum article, plus the waiver when it is given. */
export const forumClause = (f: Forum, t: ForumTerms) => f.article + (!f.interState && t.immunityWaived ? WAIVER_TEXT : "");

/** E = round(100 × (0.5 × teeth + 0.3 × (6 − immunity) + 0.2 × pace) ÷ 5). */
export function enforceability(f: Pick<Forum, "teeth" | "immunity" | "pace">): number {
  return Math.round((100 * (0.5 * f.teeth + 0.3 * (6 - f.immunity) + 0.2 * f.pace)) / 5);
}

/* ------------------------------------------------------------------ */
/* Conditional escrow waterfall (Multi-Party desk)                                */
/* ------------------------------------------------------------------ */

export const ESCROW_FREEZE = 60;

export type Tranche = { id: string; label: string; condition: string; share: number; met: boolean };

export type EscrowInput = {
  verifierSeated?: boolean;
  communal?: number;
  institutional?: number;
  intergenerational?: number;
  trackGap?: number;
  trackTolerance?: number;
  survivalScore?: number;
  rupture?: number;
};

export type EscrowTerms = {
  /** Shares of the four tranches, in per cent of the pledge. */
  shares: [number, number, number, number];
  /** Per cent of every released tranche held back as a clawback reserve until Final Cession. */
  clawback: number;
  /** Per cent of the whole pledge retained as a sovereign performance bond until Final Cession. */
  bond: number;
};

export const DEFAULT_ESCROW: EscrowTerms = { shares: [25, 25, 30, 20], clawback: 10, bond: 5 };

/** Survival score a settlement must reach before Final Cession; the Succession Trap sits at 55. */
export const CESSION_SURVIVAL = 55;

/**
 * Four tranches released in order on verified conditions. A tranche is met only when its own
 * condition holds and every earlier tranche is met. While R ≥ 60 the whole account is frozen.
 *   Gross = Σ shareₖ for met tranches
 *   Before Final Cession: Released = Gross × (1 − clawback) − bond, floored at 0
 *   At Final Cession: Released = Gross, and both reserves are discharged
 */
export function escrowWaterfall(terms: EscrowTerms, s: EscrowInput) {
  const { shares, clawback, bond } = terms;
  const gapOk = s.trackGap !== undefined && s.trackTolerance !== undefined && s.trackGap <= s.trackTolerance;
  const raw = [
    { id: "t1", label: "Tranche 1 · Mobilization", condition: "Independent verifier seated", ok: s.verifierSeated === true },
    { id: "t2", label: "Tranche 2 · Demarcation", condition: "Communal bond above the 3.0 floor", ok: (s.communal ?? 0) > 3.0 },
    { id: "t3", label: "Tranche 3 · Operational Commissioning", condition: "Institutional bond above 3.0 and track gap within tolerance", ok: (s.institutional ?? 0) > 3.0 && gapOk },
    { id: "t4", label: "Tranche 4 · Final Cession", condition: `Intergenerational bond above 3.0 and survival at or above ${CESSION_SURVIVAL}%`, ok: (s.intergenerational ?? 0) > 3.0 && (s.survivalScore ?? 0) >= CESSION_SURVIVAL },
  ];
  let chain = true;
  const tranches: Tranche[] = raw.map((t, i) => {
    chain = chain && t.ok;
    return { id: t.id, label: t.label, condition: t.condition, share: shares[i], met: chain };
  });
  const frozen = (s.rupture ?? 0) >= ESCROW_FREEZE;
  const total = shares.reduce((a, b) => a + b, 0);
  const gross = tranches.filter((t) => t.met).reduce((a, t) => a + t.share, 0);
  const ceded = tranches[3].met;
  const clawbackHeld = frozen || ceded ? 0 : Math.round(gross * clawback) / 100;
  const bondHeld = frozen || ceded || gross === 0 ? 0 : Math.min(bond, gross - clawbackHeld);
  const released = frozen ? 0 : Math.max(0, Math.round((gross - clawbackHeld - bondHeld) * 100) / 100);
  return { tranches, frozen, total, gross, clawbackHeld, bondHeld, released, ceded };
}
