import type { BondVector } from "./engine";

/**
 * Three deterministic instruments shared by Desks 7, 11 and 17.
 * Pure arithmetic on what the analyst entered and what the MissionEngine carries.
 * Nothing here predicts events; every figure is a rule applied to the inputs.
 */

/* ------------------------------------------------------------------ */
/* Decay Horizon (Desk 17)                                             */
/* ------------------------------------------------------------------ */

export const DECAY_HORIZONS = [6, 12, 24, 36] as const;

export type DecayReading = {
  /** Monthly decay constant λ = (U + R) ÷ 2000. */
  lambda: number;
  /** T½ = ln 2 ÷ λ, in months; null when λ = 0. */
  halfLife: number | null;
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
  const vals = [bonds.interpersonal, bonds.communal, bonds.intergenerational, bonds.institutional];
  const names = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];
  const rows = vals.map((now, i) => {
    const li = lambda * (0.5 + (strain[i] ?? 0) / 100);
    const then = 1 + (now - 1) * Math.exp(-li * months);
    return { name: names[i], now, then: Math.round(then * 100) / 100, lambda: li };
  });
  const meanLoss = Math.round((rows.reduce((a, r) => a + (r.now - r.then), 0) / 4) * 100) / 100;
  return { lambda, halfLife, months, bonds: rows, meanLoss };
}

/* ------------------------------------------------------------------ */
/* Dispute forum matrix (Desk 7)                                       */
/* ------------------------------------------------------------------ */

/**
 * Ratings are doctrinal ordinal judgements on a 1 to 5 scale, not measured statistics:
 * teeth = strength of the enforcement route, immunity = exposure to a sovereign-immunity
 * defence at execution (5 = most exposed), pace = speed of the procedure (5 = fastest).
 */
export type Forum = { id: string; name: string; basis: string; route: string; teeth: number; immunity: number; pace: number; article: string };

export const FORUMS: Forum[] = [
  { id: "icj", name: "International Court of Justice", basis: "ICJ Statute art. 36; UN Charter art. 94", route: "Compliance by the State; referral to the Security Council under art. 94(2)", teeth: 3, immunity: 4, pace: 1,
    article: "Any dispute between the Contracting States concerning the interpretation or application of this instrument shall, failing settlement by negotiation within six months, be submitted to the International Court of Justice by either Party, each Party hereby accepting the jurisdiction of the Court under Article 36(1) of its Statute." },
  { id: "icsid", name: "ICSID", basis: "Washington Convention 1965, arts. 25, 53–55", route: "Pecuniary obligations enforced as a final domestic judgment (art. 54); execution subject to art. 55", teeth: 5, immunity: 3, pace: 3,
    article: "Any dispute arising out of an investment made under this instrument shall be submitted to the International Centre for Settlement of Investment Disputes for arbitration under the Washington Convention, each Party giving its consent under Article 25 and agreeing that the award shall be binding and recognised under Article 54." },
  { id: "pca", name: "Permanent Court of Arbitration", basis: "PCA Arbitration Rules 2012; New York Convention 1958", route: "Recognition under the New York Convention in any Contracting State", teeth: 4, immunity: 3, pace: 3,
    article: "Any dispute arising under this instrument shall be finally settled by arbitration administered by the Permanent Court of Arbitration under its Arbitration Rules 2012, and each Party expressly waives immunity from jurisdiction and from execution in respect of any award so rendered." },
  { id: "ccja", name: "OHADA Common Court (CCJA)", basis: "OHADA Treaty art. 21; Uniform Act on Arbitration", route: "Exequatur granted by the CCJA, enforceable across OHADA member States", teeth: 4, immunity: 3, pace: 3,
    article: "Any dispute arising under this instrument shall be settled by arbitration under the Rules of Arbitration of the Common Court of Justice and Arbitration of OHADA, the award to receive exequatur from that Court and to be enforceable in every member State." },
  { id: "uncitral", name: "UNCITRAL ad hoc tribunal", basis: "UNCITRAL Arbitration Rules; Model Law", route: "Recognition under the New York Convention at the seat and abroad", teeth: 3, immunity: 4, pace: 4,
    article: "Any dispute arising under this instrument shall be settled by an ad hoc tribunal of three arbitrators under the UNCITRAL Arbitration Rules, seated in a State party to the New York Convention, and each Party waives immunity from execution in respect of the award." },
];

/** E = round(100 × (0.5 × teeth + 0.3 × (6 − immunity) + 0.2 × pace) ÷ 5). */
export function enforceability(f: Pick<Forum, "teeth" | "immunity" | "pace">): number {
  return Math.round((100 * (0.5 * f.teeth + 0.3 * (6 - f.immunity) + 0.2 * f.pace)) / 5);
}

/* ------------------------------------------------------------------ */
/* Sovereign escrow waterfall (Desk 11)                                */
/* ------------------------------------------------------------------ */

export const ESCROW_FREEZE = 60;

export type Tranche = { id: string; label: string; condition: string; share: number; met: boolean };

export type EscrowInput = { verifierSeated?: boolean; communal?: number; intergenerational?: number; rupture?: number };

/**
 * Three tranches released on verified conditions; the whole account freezes while the
 * rupture index is at or above 60 per cent. Released = Σ shareₖ for every met tranche, 0 when frozen.
 */
export function escrowWaterfall(shares: [number, number, number], s: EscrowInput) {
  const tranches: Tranche[] = [
    { id: "t1", label: "Tranche 1 · signature", condition: "Independent verifier seated", share: shares[0], met: s.verifierSeated === true },
    { id: "t2", label: "Tranche 2 · communal", condition: "Communal bond at or above 3.0", share: shares[1], met: (s.communal ?? 0) >= 3.0 },
    { id: "t3", label: "Tranche 3 · succession", condition: "Intergenerational bond at or above 3.0", share: shares[2], met: (s.intergenerational ?? 0) >= 3.0 },
  ];
  const frozen = (s.rupture ?? 0) >= ESCROW_FREEZE;
  const total = shares.reduce((a, b) => a + b, 0);
  const released = frozen ? 0 : tranches.filter((t) => t.met).reduce((a, t) => a + t.share, 0);
  return { tranches, frozen, total, released };
}
