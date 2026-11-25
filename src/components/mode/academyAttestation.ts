import {
  BOND_NAMES,
  RUPTURE_BANDS,
  TREND_MULT,
  mathReading,
  ruptureBand,
  ruptureIndex,
  type BondVector,
  type RuptureBandName,
} from "@/components/desk/engine";
import { canonicalJson } from "@/components/desk/registry";
import { ACADEMY_CURRICULUM, QUIZ_GATES, gateProgress, gateSatisfied } from "./academyCurriculum";

/**
 * The capstone attestation of the Chancellery Academy, as pure functions: the six
 * gates, the applied stress simulation (Gate 5), and the canonical attestation record
 * and its SHA-256 digest. Nothing here reads or writes storage, touches the network
 * or publishes to the MissionEngine bus; the component holds all state.
 */

export const BOND_KEYS: readonly (keyof BondVector)[] = ["interpersonal", "communal", "intergenerational", "institutional"];

/** The engine's acute threshold: the Critical rupture band, at which the escrow freezes. */
export const STRESS_THRESHOLD = RUPTURE_BANDS.critical;

export const ATTESTATION_FORMAT = "udca-academy-attestation/1";
export const ATTESTATION_DESIGNATION = "Sovereign Chancellery Practitioner · Chancellery Academy Curriculum Attestation";
export const EDUCATIONAL_DISCLAIMER =
  "Statutory educational disclaimer: this record attests completion of the Chancellery Academy curriculum in one browser session. It is an educational record, not institutional accreditation, a professional licence or a security clearance. It carries no personal identifier and was not transmitted.";

export type StressInput = {
  bonds: BondVector;
  observedShare: number;
  inscribedLoad: number;
  trend: keyof typeof TREND_MULT;
  namedBond: keyof BondVector | null;
};

export type StressVerdict = {
  passed: boolean;
  rupture: number;
  band: RuptureBandName;
  limitingBond: keyof BondVector;
  limitingBondName: string;
  limitingScore: number;
  namedBond: keyof BondVector | null;
  namedCorrectly: boolean;
  reachedThreshold: boolean;
  reason: string;
};

/**
 * Gate 5. The engine computes the Rupture Index and the Liebig minimum; the gate opens
 * when the reading stands at the acute threshold or above and the operator has named a
 * bond at the minimum (where bonds tie at the minimum, naming any of them is correct).
 */
export function evaluateStressSimulation(input: StressInput): StressVerdict {
  const vector = BOND_KEYS.map((k) => input.bonds[k]) as [number, number, number, number];
  const reading = mathReading(vector);
  const rupture = ruptureIndex(input.observedShare, input.inscribedLoad, TREND_MULT[input.trend]);
  const limitingBond = BOND_KEYS[reading.limitingIndex];
  const named = input.namedBond;
  const namedCorrectly = named !== null && reading.vector[BOND_KEYS.indexOf(named)] === reading.limitingScore;
  const reachedThreshold = rupture >= STRESS_THRESHOLD;
  const reason = !reachedThreshold
    ? `The Rupture Index reads ${rupture}; raise the stress inputs until it reaches ${STRESS_THRESHOLD}, the Critical band.`
    : named === null
      ? "Name the limiting bond."
      : !namedCorrectly
        ? `The ${BOND_NAMES[BOND_KEYS.indexOf(named)]} bond is not the limiting bond; read the Liebig minimum again.`
        : `Verified: the ${BOND_NAMES[reading.limitingIndex]} bond is limiting at ${reading.limitingScore.toFixed(1)} and the Rupture Index reads ${rupture}.`;
  return {
    passed: reachedThreshold && namedCorrectly,
    rupture,
    band: ruptureBand(rupture),
    limitingBond,
    limitingBondName: BOND_NAMES[reading.limitingIndex],
    limitingScore: reading.limitingScore,
    namedBond: named,
    namedCorrectly,
    reachedThreshold,
    reason,
  };
}

/** The values recorded with the attestation when Gate 5 passes. */
export type StressRecord = {
  bonds: BondVector;
  observedShare: number;
  inscribedLoad: number;
  trend: keyof typeof TREND_MULT;
  trendMultiplier: number;
  ruptureIndex: number;
  ruptureBand: RuptureBandName;
  threshold: number;
  limitingBond: string;
  limitingScore: number;
  namedBond: string;
};

export function stressRecord(input: StressInput, verdict: StressVerdict): StressRecord | null {
  if (!verdict.passed || input.namedBond === null) return null;
  return {
    bonds: { ...input.bonds },
    observedShare: input.observedShare,
    inscribedLoad: input.inscribedLoad,
    trend: input.trend,
    trendMultiplier: TREND_MULT[input.trend],
    ruptureIndex: verdict.rupture,
    ruptureBand: verdict.band,
    threshold: STRESS_THRESHOLD,
    limitingBond: verdict.limitingBondName,
    limitingScore: verdict.limitingScore,
    namedBond: BOND_NAMES[BOND_KEYS.indexOf(input.namedBond)],
  };
}

export const GATE_IDS = [...QUIZ_GATES.map((g) => g.id), "applied-stress-simulation", "practitioner-covenant"] as const;

export type AttestationGate = {
  number: number;
  id: string;
  label: string;
  kind: "knowledge-check" | "stress-simulation" | "covenant";
  satisfied: boolean;
  evidence: string;
};

/**
 * The six attestation gates, locked by default: Gates 1 to 4 are the Module I to IV
 * knowledge checks, Gate 5 the applied stress simulation, Gate 6 the practitioner covenant.
 */
export function attestationGates(state: {
  answers: Readonly<Record<string, string>>;
  stress: StressRecord | null;
  covenantAffirmed: boolean;
}): AttestationGate[] {
  const checks: AttestationGate[] = QUIZ_GATES.map((g, i) => ({
    number: i + 1,
    id: g.id,
    label: g.label,
    kind: "knowledge-check",
    satisfied: gateSatisfied(g, state.answers),
    evidence: `${gateProgress(g, state.answers)} of ${g.questionIds.length} questions answered correctly`,
  }));
  return [
    ...checks,
    {
      number: 5,
      id: "applied-stress-simulation",
      label: "Applied Stress Simulation",
      kind: "stress-simulation",
      satisfied: state.stress !== null,
      evidence: state.stress
        ? `Limiting bond named: ${state.stress.namedBond}; Rupture Index ${state.stress.ruptureIndex} at threshold ${state.stress.threshold}`
        : `Name the limiting bond with the Rupture Index at ${STRESS_THRESHOLD} or above`,
    },
    {
      number: 6,
      id: "practitioner-covenant",
      label: "Practitioner Covenant",
      kind: "covenant",
      satisfied: state.covenantAffirmed === true,
      evidence: state.covenantAffirmed ? "Affirmed" : "Not yet affirmed",
    },
  ];
}

/** The seal unlocks only with exactly six gates, every one satisfied. */
export const canSeal = (gates: readonly AttestationGate[]) => gates.length === 6 && gates.every((g) => g.satisfied);

export type AttestationRecord = {
  format: string;
  algorithm: "SHA-256";
  designation: string;
  curriculum: string[];
  verificationManifest: { gate: number; id: string; label: string; satisfied: true; evidence: string }[];
  simulation: StressRecord;
  passedAt: Record<string, string>;
  disclaimer: string;
  sealedAtUtc: string;
};

/**
 * Builds the attestation record. Throws unless all six gates stand satisfied and a
 * pass time is held for each, so a record can never describe a locked attestation.
 */
export function buildAttestationRecord(input: {
  gates: readonly AttestationGate[];
  stress: StressRecord | null;
  passedAt: Readonly<Record<string, string>>;
  sealedAt: Date;
}): AttestationRecord {
  if (!canSeal(input.gates) || input.stress === null) throw new Error("Attestation is locked: all six gates must be satisfied.");
  const passedAt: Record<string, string> = {};
  for (const g of input.gates) {
    const t = input.passedAt[g.id];
    if (!t) throw new Error(`Attestation is locked: no pass time for gate ${g.number}.`);
    passedAt[g.id] = t;
  }
  return {
    format: ATTESTATION_FORMAT,
    algorithm: "SHA-256",
    designation: ATTESTATION_DESIGNATION,
    curriculum: ACADEMY_CURRICULUM.map((m) => m.id),
    verificationManifest: input.gates.map((g) => ({ gate: g.number, id: g.id, label: g.label, satisfied: true as const, evidence: g.evidence })),
    simulation: input.stress,
    passedAt,
    disclaimer: EDUCATIONAL_DISCLAIMER,
    sealedAtUtc: input.sealedAt.toISOString(),
  };
}

/** Canonical JSON of the record: the registry's own serialiser, keys sorted at every depth. */
export const attestationCanonical = (record: AttestationRecord) => canonicalJson(record);

const toHex = (buf: ArrayBuffer) => Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");

/** SHA-256 of a canonical string as 64 lowercase hexadecimal characters. */
export async function sha256Digest(canonical: string, subtle: SubtleCrypto = globalThis.crypto.subtle): Promise<string> {
  return toHex(await subtle.digest("SHA-256", new TextEncoder().encode(canonical)));
}

export type SealedAttestation = { record: AttestationRecord; canonical: string; digest: string };

export async function sealAttestation(record: AttestationRecord, subtle?: SubtleCrypto): Promise<SealedAttestation> {
  const canonical = attestationCanonical(record);
  return { record, canonical, digest: await sha256Digest(canonical, subtle) };
}

/** Recompute the digest over the canonical text and compare it with the stamp. */
export async function verifyAttestation(sealed: Pick<SealedAttestation, "canonical" | "digest">, subtle?: SubtleCrypto): Promise<boolean> {
  return /^[0-9a-f]{64}$/.test(sealed.digest) && (await sha256Digest(sealed.canonical, subtle)) === sealed.digest;
}
