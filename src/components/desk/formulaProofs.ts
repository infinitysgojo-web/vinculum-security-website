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
      ? ["λ = 0: no unmitigated exposure and no rupture, so the bonds do not decay and t½ is undefined (∞)."]
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
