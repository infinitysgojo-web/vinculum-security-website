import type { BondVector } from "./engine";

/**
 * Three deterministic instruments: Decay Horizon (Desk 12 instrument, SuccessionSimulator), Dispute Forum Enforceability Matrix (Desk 11) and Conditional Escrow Waterfall (Desk 07).
 * Pure arithmetic on what the analyst entered and what the MissionEngine carries.
 * Nothing here predicts events; every figure is a rule applied to the inputs.
 */

/* ------------------------------------------------------------------ */
/* Decay Horizon & Stability Half-Life (Desk 12, SuccessionSimulator)  */
/* ------------------------------------------------------------------ */

/** Projection horizons, in days. */
export const DECAY_HORIZONS = [30, 90, 180, 365] as const;

/** The statutory sovereign baseline no bond may decay below. */
export const SOVEREIGN_FLOOR = 1.0;

export type DecayReading = {
  /** Decay constant λ = (U_unmitigated + R_rupture) ÷ 2000, per day. */
  lambda: number;
  /** Stability half-life t½ = ln 2 ÷ λ, in days; null when λ = 0. */
  halfLifeDays: number | null;
  days: number;
  bonds: { name: string; now: number; then: number }[];
  /** Breakdown curve of the mean bond, B(t) at evenly spaced days from 0 to the horizon. */
  curve: { day: number; mean: number }[];
  /** Mean loss across the four bonds at the horizon, to two decimals. */
  meanLoss: number;
};

/** B(t) = max(1.0, B₀ · e^(−λt)). */
export const preservedBond = (b0: number, lambda: number, days: number) =>
  Math.max(SOVEREIGN_FLOOR, b0 * Math.exp(-lambda * days));

/**
 * U is the unmitigated exposure in points (full severity of each uninsulated shock,
 * a quarter of each insulated one); R is the rupture index in per cent.
 *   λ = (U + R) ÷ 2000        t½ = ln 2 ÷ λ (days)        B(t) = max(1.0, B₀ · e^(−λt))
 */
export function decayHorizon(bonds: BondVector, unmitigated: number, rupture: number, days: number): DecayReading {
  const lambda = Math.max(0, unmitigated + rupture) / 2000;
  const halfLifeDays = lambda > 0 ? Math.LN2 / lambda : null;
  const vals = [bonds.interpersonal, bonds.communal, bonds.intergenerational, bonds.institutional];
  const names = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];
  const r2 = (n: number) => Math.round(n * 100) / 100;
  const rows = vals.map((now, i) => ({ name: names[i], now, then: r2(preservedBond(now, lambda, days)) }));
  const curve = Array.from({ length: 7 }, (_, k) => {
    const day = Math.round((days * k) / 6);
    return { day, mean: r2(vals.reduce((a, b0) => a + preservedBond(b0, lambda, day), 0) / 4) };
  });
  const meanLoss = r2(rows.reduce((a, r) => a + (r.now - r.then), 0) / 4);
  return { lambda, halfLifeDays, days, bonds: rows, curve, meanLoss };
}

/* ------------------------------------------------------------------ */
/* Dispute Forum Enforceability Matrix (Desk 11, ForumMatrix)                                       */
/* ------------------------------------------------------------------ */

/**
 * Ratings are doctrinal ordinal judgements on a 1 to 5 scale, not measured statistics:
 * teeth = strength of the enforcement route, immunity = exposure to a sovereign-immunity
 * defence at execution (5 = most exposed), pace = speed of the procedure (5 = fastest).
 */
export type Forum = { id: string; name: string; basis: string; route: string; teeth: number; immunity: number; pace: number; article: string };

export const FORUMS: Forum[] = [
  { id: "icsid", name: "ICSID", basis: "ICSID Convention 1965, arts. 25, 53–55", route: "Pecuniary obligations enforced as a final domestic judgment in every Contracting State (art. 54); execution subject to art. 55", teeth: 5, immunity: 3, pace: 3,
    article: "Any dispute arising out of an investment made under this instrument shall be submitted to the International Centre for Settlement of Investment Disputes for arbitration under the ICSID Convention, each Party giving its consent under Article 25 and agreeing that the award shall be binding and recognised under Article 54." },
  { id: "pca", name: "PCA / The Hague", basis: "PCA Arbitration Rules 2012; New York Convention 1958", route: "Recognition and enforcement under the New York Convention in any Contracting State", teeth: 4, immunity: 3, pace: 4,
    article: "Any dispute arising under this instrument shall be finally settled by arbitration administered by the Permanent Court of Arbitration under its Arbitration Rules 2012, seated at The Hague." },
  { id: "lcia", name: "LCIA", basis: "LCIA Arbitration Rules 2020; New York Convention 1958", route: "Recognition and enforcement under the New York Convention; English supervisory courts at a London seat", teeth: 4, immunity: 4, pace: 5,
    article: "Any dispute arising out of or in connection with this instrument shall be referred to and finally resolved by arbitration under the LCIA Rules, which Rules are deemed to be incorporated by reference into this clause." },
  { id: "icc", name: "ICC Paris", basis: "ICC Arbitration Rules 2021; New York Convention 1958", route: "Recognition and enforcement under the New York Convention; scrutiny of the award by the ICC Court", teeth: 4, immunity: 3, pace: 3,
    article: "All disputes arising out of or in connection with this instrument shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by one or more arbitrators appointed in accordance with the said Rules, the seat of arbitration being Paris." },
  { id: "swiss", name: "Swiss Arbitration Centre", basis: "Swiss Rules of International Arbitration 2021; New York Convention 1958", route: "Recognition and enforcement under the New York Convention; limited annulment before the Swiss Federal Supreme Court", teeth: 4, immunity: 4, pace: 4,
    article: "Any dispute arising out of or in relation to this instrument shall be resolved by arbitration in accordance with the Swiss Rules of International Arbitration of the Swiss Arbitration Centre in force on the date the Notice of Arbitration is submitted." },
  { id: "siac", name: "Singapore SIAC", basis: "SIAC Rules 2025; New York Convention 1958", route: "Recognition and enforcement under the New York Convention; Singapore courts at a Singapore seat", teeth: 3, immunity: 2, pace: 3,
    article: "Any dispute arising out of or in connection with this instrument shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre in accordance with the Arbitration Rules of the Singapore International Arbitration Centre for the time being in force." },
  { id: "icj", name: "ICJ Advisory", basis: "ICJ Statute arts. 36 and 65; UN Charter arts. 94 and 96", route: "No execution route: compliance rests on the State, with referral to the Security Council under art. 94(2) for contentious judgments", teeth: 3, immunity: 4, pace: 1,
    article: "Any question concerning the interpretation or application of this instrument may, failing settlement by negotiation within six months, be referred to the International Court of Justice, by contentious proceedings under Article 36(1) of its Statute or by a request for an advisory opinion through an authorised organ under Article 96 of the Charter." },
];

/** Sovereign immunity waiver penalty: deducted while the clause leaves immunity unaddressed. */
export const IMMUNITY_PENALTY = 18;
/** Seat neutrality weighting: deducted when the seat lies in the territory of a party to the dispute. */
export const SEAT_PENALTY = 8;

export const WAIVER_TEXT = " Each Party expressly and irrevocably waives any immunity from jurisdiction and from execution, including attachment of assets other than diplomatic, consular and military property, in respect of any proceedings or award under this clause.";

export type ForumTerms = { immunityWaived: boolean; neutralSeat: boolean };

/**
 * Venue fitness F = E − 18 (immunity unaddressed) − 8 (seat not neutral), floored at 0.
 * Enforcement friction = 100 − F: the share of the award's value at risk at the enforcement stage.
 */
export function forumFitness(f: Forum, t: ForumTerms) {
  const base = enforceability(f);
  const immunity = t.immunityWaived ? 0 : IMMUNITY_PENALTY;
  const seat = t.neutralSeat ? 0 : SEAT_PENALTY;
  const fitness = Math.max(0, base - immunity - seat);
  return { base, immunity, seat, fitness, friction: 100 - fitness };
}

/** The operative clause as it will be drafted: the forum article, plus the waiver when it is given. */
export const forumClause = (f: Forum, t: ForumTerms) => f.article + (t.immunityWaived ? WAIVER_TEXT : "");

/** E = round(100 × (0.5 × teeth + 0.3 × (6 − immunity) + 0.2 × pace) ÷ 5). */
export function enforceability(f: Pick<Forum, "teeth" | "immunity" | "pace">): number {
  return Math.round((100 * (0.5 * f.teeth + 0.3 * (6 - f.immunity) + 0.2 * f.pace)) / 5);
}

/* ------------------------------------------------------------------ */
/* Conditional Escrow Waterfall (Desk 07, EscrowWaterfall)                                */
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

/* ------------------------------------------------------------------ */
/* Critical Fracture Window (Desk 12, SuccessionSimulator)             */
/* ------------------------------------------------------------------ */

/** Mean-bond level at which the reading is treated as fractured. */
export const FRACTURE_LEVEL = 2.0;

export type FractureSeverity = "stable" | "monitored" | "acute" | "imminent";

/**
 * Days until the mean bond, decaying as B(t) = B̄₀ · e^(−λt), reaches the fracture level:
 *   t_f = ln(B̄₀ ÷ 2.0) ÷ λ    (0 when B̄₀ ≤ 2.0; null when λ = 0)
 * Months = t_f ÷ 30.44. Bands: > 24 stable, > 12 monitored, > 6 acute, otherwise imminent.
 * A rule applied to the inputs, not a forecast of events.
 */
export function fractureWindow(meanBond: number, lambda: number) {
  if (meanBond <= FRACTURE_LEVEL) return { days: 0, months: 0, severity: "imminent" as FractureSeverity };
  if (lambda <= 0) return { days: null, months: null, severity: "stable" as FractureSeverity };
  const days = Math.log(meanBond / FRACTURE_LEVEL) / lambda;
  const months = Math.round((days / 30.44) * 10) / 10;
  const severity: FractureSeverity = months > 24 ? "stable" : months > 12 ? "monitored" : months > 6 ? "acute" : "imminent";
  return { days: Math.round(days), months, severity };
}

/* ------------------------------------------------------------------ */
/* Resource-Sharing Covenant (Desk 07, MultiPartySequencer)            */
/* ------------------------------------------------------------------ */

/** Statutory minimum share for the community restitution trust. */
export const COMMUNAL_FLOOR = 30;
/** Strain added on the Compound Shock desk while the communal share is under the floor. */
export const LEGITIMACY_PENALTY = 15;
export const RESOURCE_HEADS = ["Community restitution trust", "Cross-border corridor fund", "Joint demarcation and monitoring"] as const;
export const DEFAULT_RESOURCES: [number, number, number] = [40, 35, 25];

/**
 * Setting one head rebalances the other two in proportion so the total stays 100.
 * Parity P = round(100 − (max − min) × 1.5), floored at 0. Deficit when communal < 30.
 */
export function rebalance(shares: [number, number, number], i: number, v: number): [number, number, number] {
  const val = Math.max(0, Math.min(100, Math.round(v)));
  const others = [0, 1, 2].filter((k) => k !== i);
  const rest = others.reduce((a, k) => a + shares[k], 0);
  const out = [...shares] as [number, number, number];
  out[i] = val;
  const left = 100 - val;
  const a = rest > 0 ? Math.round((shares[others[0]] / rest) * left) : Math.round(left / 2);
  out[others[0]] = a;
  out[others[1]] = left - a;
  return out;
}

export function resourceReading(shares: [number, number, number]) {
  const parity = Math.max(0, Math.round(100 - (Math.max(...shares) - Math.min(...shares)) * 1.5));
  const deficit = shares[0] < COMMUNAL_FLOOR;
  return { parity, deficit, total: shares[0] + shares[1] + shares[2] };
}

/* ------------------------------------------------------------------ */
/* Pleadings Bench (Desk 13, LitigationWorkbench)                      */
/* ------------------------------------------------------------------ */

/** Rupture index at which a provisional-measures head is drafted. */
export const PROVISIONAL_THRESHOLD = 40;

export type PleadingInput = { disputeForum?: string; disputeForumId?: string; forum?: string; litigationForum?: string; covenants?: string[]; weakestBond?: string; weakestScore?: number; rupture?: number; immunityWaived?: boolean };

/**
 * Jurisdictional admissibility criteria for each venue on the Forum Matrix. Doctrinal
 * summaries of the governing instrument, not legal advice for a particular filing.
 */
export const ADMISSIBILITY: Record<string, string> = {
  icsid: "A legal dispute arising directly out of an investment, between a Contracting State and a national of another Contracting State, with the written consent of both (ICSID Convention art. 25).",
  pca: "A written agreement to arbitrate under the PCA Arbitration Rules 2012; at least one party a State, a State-controlled entity or an intergovernmental organisation, or otherwise by agreement of the parties.",
  lcia: "A written agreement referring the dispute to the LCIA Rules, with the subject matter arbitrable under the law of the seat.",
  icc: "An agreement referring the dispute to the ICC Rules; the ICC Court confirms that such an agreement prima facie exists before the case proceeds (art. 6).",
  swiss: "An agreement referring the dispute to the Swiss Rules; at a Swiss seat, any claim involving an economic interest is arbitrable (PILA art. 177).",
  siac: "An agreement referring the dispute to SIAC; the Court of Arbitration screens for a prima facie arbitration agreement before constitution of the tribunal.",
  icj: "Contentious proceedings only between States that have consented under art. 36 of the Statute; an advisory opinion only on request of an organ or agency authorised under art. 96 of the Charter.",
};

/** The Forum Matrix venue on the bus, matched by id and then by name. */
export const pleadingForum = (s: Pick<PleadingInput, "disputeForumId" | "disputeForum">): Forum | undefined =>
  FORUMS.find((f) => f.id === s.disputeForumId) ?? FORUMS.find((f) => f.name === s.disputeForum);

/**
 * Fixed pleading heads filled only from what is on the bus; a missing input is named as missing.
 * I Jurisdictional foundation (dispute forum), II Substantive relational breach (weakest bond),
 * III Sovereign covenants at risk (covenants of record), and IV Provisional measures, drafted
 * only when the rupture index is at or above 40 per cent.
 */
export function pleadingHeads(s: PleadingInput) {
  const forum = s.disputeForum || s.forum || s.litigationForum || "";
  const heads: { id: string; title: string; body: string; ready: boolean }[] = [
    { id: "jurisdiction", title: "I. Jurisdictional foundation", ready: !!forum,
      body: forum ? `Consent to the jurisdiction of ${forum} is founded on the dispute settlement clause of the instrument.${s.immunityWaived === false ? " Immunity is not waived in the clause; anticipate an immunity objection at execution." : ""}` : "No forum chosen. Select a venue on the Forum Matrix." },
    { id: "breach", title: "II. Substantive relational breach", ready: !!s.weakestBond,
      body: s.weakestBond ? `The breach is specified against the ${s.weakestBond.toLowerCase()} bond${s.weakestScore !== undefined ? `, scored ${s.weakestScore.toFixed(1)} of 5.0` : ""}, the most exposed bond on the diagnostic.` : "No bond reading. Score the bonds on Desk 1." },
    { id: "covenants", title: "III. Sovereign covenants at risk", ready: !!s.covenants?.length,
      body: s.covenants?.length ? `${s.covenants.length} covenant${s.covenants.length === 1 ? "" : "s"} of record ${s.covenants.length === 1 ? "is" : "are"} placed at risk by the breach: ${s.covenants.join("; ")}.` : "No covenants on the bus. Draft them in the Clause Architect." },
  ];
  const r = s.rupture ?? 0;
  if (r >= PROVISIONAL_THRESHOLD)
    heads.push({ id: "provisional", title: "IV. Provisional measures", ready: true,
      body: `Urgency: the rupture index stands at ${r}%, at or above the ${PROVISIONAL_THRESHOLD}% threshold. Interim protection of the relational record is requested pending the merits.` });
  return { heads, ready: heads.filter((h) => h.ready).length, total: heads.length };
}

/** The pleadings matrix as export text, under section IV of the litigation checklist. */
export function pleadingLines(s: PleadingInput): string[] {
  const p = pleadingHeads(s);
  const f = pleadingForum(s);
  const r = s.rupture ?? 0;
  const L = ["IV. DOCTRINAL PLEADINGS MATRIX"];
  if (f) {
    L.push(`  Forum citation: ${f.name} · ${f.basis}`);
    L.push(`  Enforcement teeth: ${f.teeth} of 5 · base enforceability ${enforceability(f)} of 100`);
    L.push(`  Admissibility: ${ADMISSIBILITY[f.id] ?? "Not recorded."}`);
  } else L.push("  Forum citation: none on the bus. Select a venue on the Forum Matrix (Desk 11).");
  p.heads.forEach((h) => L.push(`  ${h.title.toUpperCase()}${h.ready ? "" : " (INCOMPLETE)"}`, `    ${h.body}`));
  if (!p.heads.some((h) => h.id === "provisional"))
    L.push("  IV. PROVISIONAL MEASURES (NOT DRAFTED)", `    The rupture index stands at ${r}%, below the ${PROVISIONAL_THRESHOLD}% threshold for interim relief.`);
  L.push(`  Heads ready: ${p.ready} of ${p.total}.`);
  return L;
}
