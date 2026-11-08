/**
 * Inline Formula Proofs ([ƒx] chips). Each proof restates a formula the desk already
 * computes, substitutes the live numbers, and shows the arithmetic to the displayed value.
 * The proof calls the same instrument functions as the desk, so it cannot drift from it.
 * Citations name the section of the Vinculum Codex and Compact that records the formula,
 * and the treaty instrument where the rule rests on one.
 */
import {
  CESSION_SURVIVAL,
  ESCROW_FREEZE,
  FRACTURE_LEVEL,
  IMMUNITY_PENALTY,
  SEAT_PENALTY,
  SOVEREIGN_FLOOR,
  enforceability,
  escrowWaterfall,
  forumFitness,
  fractureWindow,
  type EscrowInput,
  type EscrowTerms,
  type Forum,
  type ForumTerms,
} from "./instruments";
import type { DominumReading } from "./engine";

export type FormulaProof = {
  id: string;
  title: string;
  /** The formal equation. */
  equation: string;
  /** The equation with the live mission values substituted. */
  substitution: string;
  /** Step-by-step arithmetic to the displayed value. */
  steps: string[];
  result: string;
  citation: string;
};

const f4 = (n: number) => n.toFixed(4);
const f2 = (n: number) => n.toFixed(2);
const pct = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(2));

export const CODEX = "The Vinculum Codex and Compact";

/** λ = max(0, U + R) ÷ 2000 (Desk 12, Decay Horizon). */
export function decayProof(U: number, R: number): FormulaProof {
  const sum = U + R;
  const lambda = Math.max(0, sum) / 2000;
  return {
    id: "decay-constant",
    title: "Decay constant λ",
    equation: "λ = max(0, U + R) ÷ 2000",
    substitution: `λ = max(0, ${f2(U)} + ${R}) ÷ 2000`,
    steps: [`U + R = ${f2(U)} + ${R} = ${f2(sum)}`, `max(0, ${f2(sum)}) = ${f2(Math.max(0, sum))}`, `${f2(Math.max(0, sum))} ÷ 2000 = ${f4(lambda)} per day`],
    result: `λ = ${f4(lambda)} per day`,
    citation: `${CODEX}, Part V §5.1 (Decay Horizon and Relational Stability Half-Life). U: full severity of each uninsulated succession shock, a quarter of each insulated one; R: rupture index from the Sentinel Matrix (Part VI §6.1).`,
  };
}

/** t½ = ln 2 ÷ λ. */
export function halfLifeProof(lambda: number): FormulaProof {
  const t = lambda > 0 ? Math.LN2 / lambda : null;
  return {
    id: "half-life",
    title: "Stability half-life t½",
    equation: "t½ = ln 2 ÷ λ",
    substitution: `t½ = 0.6931 ÷ ${f4(lambda)}`,
    steps: t === null
      ? ["λ = 0: no exponential decay; the half-life limit is ∞, not a finite duration or a guarantee of stability."]
      : [`ln 2 = 0.693147`, `0.693147 ÷ ${f4(lambda)} = ${t.toFixed(1)} days`, `B(t) = max(${SOVEREIGN_FLOOR.toFixed(1)}, B₀ · e^(−λt)): no bond decays below the sovereign floor.`],
    result: t === null ? "t½ = ∞" : `t½ = ${t.toFixed(1)} days`,
    citation: `${CODEX}, Part V §5.1; the exponential law B(t) = B₀e^(−λt) with the ${SOVEREIGN_FLOOR.toFixed(1)} sovereign floor.`,
  };
}

/** t_f = ln(B̄₀ ÷ 2.0) ÷ λ. */
export function fractureProof(meanBond: number, lambda: number): FormulaProof {
  const w = fractureWindow(meanBond, lambda);
  const ratio = meanBond / FRACTURE_LEVEL;
  const steps =
    meanBond <= FRACTURE_LEVEL
      ? [`B̄₀ = ${f2(meanBond)} ≤ ${FRACTURE_LEVEL.toFixed(1)}: the mean bond already sits at the fracture level, so t_f = 0 (imminent).`]
      : lambda <= 0
        ? ["λ = 0: no decay, so the fracture level is never reached (stable)."]
        : [
            `B̄₀ ÷ ${FRACTURE_LEVEL.toFixed(1)} = ${f2(meanBond)} ÷ ${FRACTURE_LEVEL.toFixed(1)} = ${ratio.toFixed(4)}`,
            `ln(${ratio.toFixed(4)}) = ${Math.log(ratio).toFixed(4)}`,
            `${Math.log(ratio).toFixed(4)} ÷ ${f4(lambda)} = ${(Math.log(ratio) / lambda).toFixed(1)} days`,
            `÷ 30.44 = ${w.months} months → band ${w.severity} (> 24 stable, > 12 monitored, > 6 acute, otherwise imminent)`,
          ];
  return {
    id: "fracture-window",
    title: "Critical fracture window t_f",
    equation: `t_f = ln(B̄₀ ÷ ${FRACTURE_LEVEL.toFixed(1)}) ÷ λ`,
    substitution: `t_f = ln(${f2(meanBond)} ÷ ${FRACTURE_LEVEL.toFixed(1)}) ÷ ${f4(lambda)}`,
    steps,
    result: w.days === null ? "t_f = ∞ (stable)" : `t_f = ${w.days} days (${w.months} months, ${w.severity})`,
    citation: `${CODEX}, Part V §5.1 decay law, solved for the Fractured standing threshold μB < ${FRACTURE_LEVEL.toFixed(1)} (Part III §3.2).`,
  };
}

/** F = E − 18 (immunity unaddressed) − 8 (seat not neutral), floored at 0 (Desk 11, Forum Matrix). */
export function forumProof(forum: Forum, terms: ForumTerms): FormulaProof {
  const r = forumFitness(forum, terms);
  const inner = 0.5 * forum.teeth + 0.3 * (6 - forum.immunity) + 0.2 * forum.pace;
  return {
    id: "forum-fitness",
    title: `Venue fitness · ${forum.name}`,
    equation: `E = round(100 × (0.5·teeth + 0.3·(6 − immunity) + 0.2·pace) ÷ 5);  F = max(0, E − ${IMMUNITY_PENALTY}·[immunity unaddressed] − ${SEAT_PENALTY}·[seat not neutral])`,
    substitution: `E = round(100 × (0.5·${forum.teeth} + 0.3·(6 − ${forum.immunity}) + 0.2·${forum.pace}) ÷ 5);  F = max(0, ${r.base} − ${r.immunity} − ${r.seat})`,
    steps: [
      `0.5·${forum.teeth} + 0.3·${6 - forum.immunity} + 0.2·${forum.pace} = ${(0.5 * forum.teeth).toFixed(1)} + ${(0.3 * (6 - forum.immunity)).toFixed(1)} + ${(0.2 * forum.pace).toFixed(1)} = ${inner.toFixed(1)}`,
      `100 × ${inner.toFixed(1)} ÷ 5 = ${(100 * inner / 5).toFixed(1)} → E = ${enforceability(forum)}`,
      terms.immunityWaived ? "Immunity waived in the clause: no deduction." : `Immunity unaddressed: −${IMMUNITY_PENALTY}.`,
      terms.neutralSeat ? "Seat neutral: no deduction." : `Seat in a party's territory: −${SEAT_PENALTY}.`,
      `F = max(0, ${r.base} − ${r.immunity} − ${r.seat}) = ${r.fitness};  enforcement friction = 100 − F = ${r.friction}`,
    ],
    result: `F = ${r.fitness} of 100 · friction ${r.friction}`,
    citation: `${CODEX}, Part V §5.2 (Dispute Forum Enforceability Matrix and Venue Calibration). Enforcement basis: ${forum.basis}. Ratings are doctrinal ordinal judgements, not measured statistics.`,
  };
}

/** Escrow release (Desk 07, Conditional Escrow Waterfall). */
export function escrowProof(terms: EscrowTerms, input: EscrowInput): FormulaProof {
  const r = escrowWaterfall(terms, input);
  const met = r.tranches.filter((t) => t.met);
  const steps: string[] = [
    "Tranches release in order: a tranche counts as met only when its condition holds and every earlier tranche is met.",
    ...r.tranches.map((t, i) => `Tranche ${i + 1} (${t.share}%): ${t.condition}: ${t.met ? "met" : "not met"}`),
    `Gross = Σ met shares = ${met.length ? met.map((t) => t.share).join(" + ") : "0"} = ${pct(r.gross)}%`,
  ];
  if (r.frozen) steps.push(`R = ${input.rupture ?? 0} ≥ ${ESCROW_FREEZE}: the whole account is frozen; Released = 0%.`);
  else if (r.ceded) steps.push("Final Cession reached: both reserves are discharged; Released = Gross.");
  else
    steps.push(
      `Clawback reserve = Gross × ${terms.clawback}% = ${pct(r.clawbackHeld)}%`,
      `Performance bond = min(${terms.bond}, Gross − clawback) = ${pct(r.bondHeld)}%`,
      `Released = max(0, ${pct(r.gross)} − ${pct(r.clawbackHeld)} − ${pct(r.bondHeld)}) = ${pct(r.released)}%`,
    );
  return {
    id: "escrow-release",
    title: "Escrow release",
    equation: `Released = 0 if R ≥ ${ESCROW_FREEZE};  Gross at Final Cession;  otherwise max(0, Gross − Gross·c − min(b, Gross − Gross·c))`,
    substitution: `R = ${input.rupture ?? 0}, Gross = ${pct(r.gross)}%, c = ${terms.clawback}%, b = ${terms.bond}%`,
    steps,
    result: `Released = ${pct(r.released)}% of ${r.total}%${r.frozen ? " (frozen)" : ""}`,
    citation: `${CODEX}, Part V §5.3 (Conditional Escrow Waterfall): tranches release in order on verified conditions; Final Cession requires survival at or above ${CESSION_SURVIVAL}% (Part VI §6.5); the ${ESCROW_FREEZE}% freeze is the critical rupture threshold (Part VI §6.1).`,
  };
}

/** Plain-text form of a proof, for the clipboard and the export pouch. */
export function proofText(p: FormulaProof): string {
  return [p.title.toUpperCase(), `  ${p.equation}`, `  ${p.substitution}`, ...p.steps.map((s, i) => `  ${i + 1}. ${s}`), `  = ${p.result}`, `  Source: ${p.citation}`].join("\n");
}

/* ------------------------------------------------------------------ */
/* Desk 01 · Assessment Bench — state vector & mean proof            */
/* ------------------------------------------------------------------ */

/** μB = ¼ Σ Bᵢ and σB² = ¼ Σ (Bᵢ − μB)² (Desk 01, BondMathPanel). */
export function meanBondProof(scores: [number, number, number, number]): FormulaProof {
  const sum = scores.reduce((a, b) => a + b, 0);
  const mean = sum / 4;
  const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / 4;
  const sd = Math.sqrt(variance);

  return {
    id: "desk01-mean-bond",
    title: "Composite Bond Mean & Variance",
    equation: "μB = ¼ Σ Bᵢ ;  σB² = ¼ Σ (Bᵢ − μB)² ;  σB = √(σB²)",
    substitution: `B = (${scores.map((s) => s.toFixed(1)).join(", ")}), Σ Bᵢ = ${sum.toFixed(1)}`,
    steps: [
      `Sum of bond dimensions: ${scores.map((s) => s.toFixed(1)).join(" + ")} = ${sum.toFixed(2)}`,
      `Arithmetic mean: ${sum.toFixed(2)} ÷ 4 = ${mean.toFixed(3)}`,
      `Squared deviations: ${scores.map((s) => `(${s.toFixed(1)} − ${mean.toFixed(2)})² = ${Math.pow(s - mean, 2).toFixed(3)}`).join(", ")}`,
      `Variance σB²: (${scores.map((s) => Math.pow(s - mean, 2).toFixed(2)).join(" + ")}) ÷ 4 = ${variance.toFixed(3)}`,
      `Standard deviation σB: √${variance.toFixed(3)} = ${sd.toFixed(3)}`,
    ],
    result: `μB = ${mean.toFixed(3)} (variance σB² = ${variance.toFixed(3)})`,
    citation: `${CODEX}, Part III §3.1 (Bond Vector Quantification and State Space): all four dimensions carry equal weight; the arithmetic mean forms the baseline composite state.`,
  };
}

/* ------------------------------------------------------------------ */
/* Desk 02 · Asymmetry Matrix — bilateral friction & geodesic axis     */
/* ------------------------------------------------------------------ */

/** Asymmetry friction F = max |Bᵢ₁ − Bᵢ₂| and geodesic distance (Desk 02, AsymmetryMatrix). */
export function frictionProof(
  friction: number,
  tolerance: number,
  geo?: { distanceNm: number; distanceKm: number; bearingDeg: number } | null,
): FormulaProof {
  const breached = friction > tolerance;
  const steps: string[] = [
    `Observed peak inter-party bond divergence: F = ${friction.toFixed(2)}`,
    `Communal tolerance limit: τ = ${tolerance.toFixed(2)}`,
    breached
      ? `F (${friction.toFixed(2)}) > τ (${tolerance.toFixed(2)}): Asymmetry breach detected. Hold principals until divergence narrows.`
      : `F (${friction.toFixed(2)}) ≤ τ (${tolerance.toFixed(2)}): Divergence is within viable communal tolerance floor.`,
  ];
  if (geo) {
    steps.push(
      `Great-circle geodesic axis: ${geo.distanceNm.toLocaleString()} NM (${geo.distanceKm.toLocaleString()} km) along bearing ${geo.bearingDeg}°T.`,
    );
  }

  return {
    id: "desk02-friction",
    title: "Bilateral Bond Friction & Geodesic Axis",
    equation: "F = max_{i} |B_i,1 − B_i,2|  with constraint  F ≤ τ_communal",
    substitution: `F = ${friction.toFixed(2)}, τ = ${tolerance.toFixed(2)}${geo ? `, d = ${geo.distanceNm} NM` : ""}`,
    steps,
    result: `Friction = ${friction.toFixed(2)} · ${breached ? "Tolerance Breached" : "Viable Tolerance"}`,
    citation: `${CODEX}, Part IV §4.1 (Bilateral Asymmetry and Friction Bounds): divergence exceeding communal tolerance introduces destabilising leverage.`,
  };
}

/* ------------------------------------------------------------------ */
/* Desk 05 · Compound Shock Tester — compound strain arithmetic       */
/* ------------------------------------------------------------------ */

/** Existing asymmetry instrument: normalized Euclidean distance, never a track-phase tolerance. */
export function asymmetryProof(friction: number, parties: { label: string; vector: number[] }[]): FormulaProof {
  return {
    id: "multiparty-asymmetry", title: "Inter-party friction coefficient",
    equation: "F_ab = round₂(√(Σᵢ (Bᵢ,a − Bᵢ,b)²) ÷ 8); F = max F_ab",
    substitution: parties.map((p) => `${p.label}: (${p.vector.join(", ")})`).join("; "),
    steps: parties.flatMap((a, i) => parties.slice(i + 1).map((b) => {
      const sum = a.vector.reduce((n, x, k) => n + (x - b.vector[k]) ** 2, 0);
      return `${a.label} / ${b.label}: √${f4(sum)} ÷ 8 = ${f2(Math.round(Math.sqrt(sum) / 8 * 100) / 100)}`;
    })),
    result: `Friction = ${f2(friction)} (0 to 1)`,
    citation: `${CODEX}, Desk 07 asymmetry instrument: Euclidean distance normalized by the maximum four-bond distance of 8. Not a transmission probability or Track I/II phase tolerance.`,
  };
}

/** Compound strain = min(100, Σ ω + (k − 1) × 1.25 × 4 + penalty) (Desk 05). */
export function compoundShockProof(
  shockCount: number,
  baseSeverity: number,
  amplification: number,
  legitimacyPenalty: number,
  strain: number,
): FormulaProof {
  return {
    id: "desk05-compound-strain",
    title: "Compound Shock Strain Amplification",
    equation: "Strain = min(100, Σ ω + max(0, k − 1) × 1.25 × 4 + L_penalty)",
    substitution: `k = ${shockCount}, Base Σ ω = ${baseSeverity}, Amp = ${amplification.toFixed(1)}, L_pen = ${legitimacyPenalty}`,
    steps: [
      `Base severity sum across ${shockCount} shock(s): Σ ω = ${baseSeverity}`,
      `Nonlinear compounding: max(0, ${shockCount} − 1) × 1.25 × 4 levels = +${amplification.toFixed(1)} strain points`,
      `Legitimacy structural penalty: +${legitimacyPenalty} strain points`,
      `Gross sum: ${baseSeverity} + ${amplification.toFixed(1)} + ${legitimacyPenalty} = ${(baseSeverity + amplification + legitimacyPenalty).toFixed(1)}`,
      `Clamped to [0, 100]: min(100, ${(baseSeverity + amplification + legitimacyPenalty).toFixed(1)}) = ${strain}`,
    ],
    result: `Compound Strain = ${strain}%`,
    citation: `${CODEX}, Part VI §6.2 (Compound Shock Cascade and Nonlinear Amplification): multiple simultaneous shocks compound nonlinearly across all four bond dimensions.`,
  };
}

/** R = min(100, round((observed share + inscribed load) × trend multiplier)) (Desk 02, Sentinel Matrix). */
export function sentinelRuptureProof(score: number, totalMax: number, inscribed: number, mult: number, result: number): FormulaProof {
  const share = totalMax > 0 ? (score / totalMax) * 100 : 0;
  const raw = (share + inscribed) * mult;
  return {
    id: "rupture-index",
    title: "Rupture index R",
    equation: "R = min(100, round((100 · w_obs ÷ w_max + L_ins) × m_trend))",
    substitution: `R = min(100, round((100 · ${score} ÷ ${totalMax} + ${inscribed}) × ${mult.toFixed(2)}))`,
    steps: [
      `Observed share = 100 · ${score} ÷ ${totalMax} = ${f2(share)}`,
      `Inscribed load L_ins = ${inscribed} (5 per point of negative inscribed delta, 6 per active inscribed trap, capped at 30)`,
      `(${f2(share)} + ${inscribed}) × ${mult.toFixed(2)} = ${f2(raw)}`,
      `min(100, round(${f2(raw)})) = ${result}`,
    ],
    result: `R = ${result}%`,
    citation: `${CODEX}, Part VI §6.1 (Early-Warning Sentinel Matrix). Trend multipliers: improving ×0.85, static ×1.00, deteriorating ×1.15. A rule-based reading, not a prediction.`,
  };
}

/** Δ = d_I − d_II against τ(B_communal) (Desk 08, Track Sequencing). */
export function trackShearProof(a: number, b: number, tolerance: number, communal?: number, band?: string): FormulaProof {
  const gap = a - b;
  const shear = gap > tolerance;
  return {
    id: "track-shear",
    title: "Track lead Δ and communal tolerance τ",
    equation: "Δ = d_I − d_II;  shear ⇔ Δ > τ(B_communal), with τ = 0 (Failing), 1 (Fragile), 2 (Viable, Fortified)",
    substitution: `Δ = ${a} − ${b};  τ = ${tolerance}`,
    steps: [
      communal !== undefined && band
        ? `B_communal = ${communal.toFixed(1)} → band ${band} → τ = ${tolerance}`
        : `No live communal reading: baseline τ = ${tolerance}, advisory only`,
      `d_I = ${a}, d_II = ${b} (contiguous phases recorded on each track)`,
      `Δ = ${a} − ${b} = ${gap}`,
      shear ? `${gap} > ${tolerance}: Elite-Pact shear` : `${gap} ≤ ${tolerance}: within tolerance`,
    ],
    result: shear ? `Δ = ${gap} > τ = ${tolerance} · shear` : `Δ = ${gap} ≤ τ = ${tolerance} · in step`,
    citation: `${CODEX}, Handbook §9B (Track I and Track II sequencing); communal tolerance rule of the MissionEngine.`,
  };
}

/** D = 100 × (0.30 A + 0.25 F + 0.25 S + 0.20 C) (Desk 15, The Dominum Effect). */
export function dominumProof(d: DominumReading): FormulaProof {
  const [A, F, S, C] = d.terms;
  return {
    id: "dominum-index",
    title: "Dominum Index D",
    equation: "D = 100 × (0.30 A + 0.25 F + 0.25 S + 0.20 C)",
    substitution: `D = 100 × (0.30 × ${f4(A.input)} + 0.25 × ${f4(F.input)} + 0.25 × ${f4(S.input)} + 0.20 × ${f4(C.input)})`,
    steps: [
      ...d.terms.map((t) => `${t.label}: ${t.weight.toFixed(2)} × ${f4(t.input)} = ${f4(t.value)}`),
      `D = min(100, max(0, round₁(100 × ${f4(d.terms.reduce((a, t) => a + t.value, 0))}))) = ${d.index}; displayed intermediate terms are rounded`,
      `Phase: ${d.phase}${d.floorHeld ? "" : " (Self-Reinforcing Dominium withheld: a bond sits at or below the 3.0 viable floor)"}`,
    ],
    result: `D = ${d.index}% · ${d.phase}`,
    citation: `${CODEX}, The Dominum Effect (Law of Sovereign Custodial Inversion). Thresholds: Fiduciary Anchor 40, Custodial Inversion 60, Self-Reinforcing Dominium 75. A rule-based reading, not a prediction.`,
  };
}
