import type { StageGate } from "./engine";

/**
 * Sign-off status for the Readiness Desk. Pure and deterministic: it only
 * itemises the holds the desk already computes, so the envoy can see exactly
 * why the formal transmittal is held instead of facing a disabled button.
 */
export type SignOffHold = { name: string; reason: string };

export type SignOffInput = {
  /** The five canonical stage gates from stageGateAudit(). */
  stageGates: StageGate[];
  /** Binding statutory clearances not yet satisfied. */
  bindingOpen: number;
  /** Open Questions still unresolved in the Context Tray. */
  openQuestions: number;
  /** The active lifecycle stage and its unmet critical checklist items. */
  stageLabel: string;
  missingCritical: string[];
  /** Inscribed sovereign gates awaiting attestation. */
  sovereignOpen: string[];
  /** Engine locks still holding. */
  openLocks: string[];
  /** Whether the desk's own verdict and binding schedule permit sign-off. */
  canSignOff: boolean;
};

export function signOffHolds(i: SignOffInput): SignOffHold[] {
  const out: SignOffHold[] = i.stageGates.filter((g) => !g.passed).map((g) => ({ name: g.name, reason: g.reading }));
  if (i.openQuestions > 0)
    out.push({
      name: "Evidentiary Hygiene",
      reason: `${i.openQuestions} open question${i.openQuestions === 1 ? "" : "s"} unresolved in the Context Tray; reclassify each as Fact, Working Assumption or Excluded.`,
    });
  if (i.missingCritical.length)
    out.push({ name: `${i.stageLabel} checklist`, reason: `Critical gate${i.missingCritical.length === 1 ? "" : "s"} not met: ${i.missingCritical.join("; ")}` });
  if (i.sovereignOpen.length)
    out.push({ name: "Sovereign gates", reason: `Awaiting attestation: ${i.sovereignOpen.join("; ")}` });
  if (i.openLocks.length)
    out.push({ name: "Engine locks", reason: i.openLocks.join("; ") });
  return out;
}

export const SIGN_OFF_CLEARED =
  "Clearance Verified: All 5 stage gates and binding clearances satisfied. Mission ready for formal transmittal.";

export function signOffStatus(i: SignOffInput): { ready: boolean; text: string; holds: SignOffHold[] } {
  const holds = signOffHolds(i);
  if (i.canSignOff && holds.length === 0) return { ready: true, text: SIGN_OFF_CLEARED, holds };
  const names = holds.map((h) => h.name).join(", ");
  return {
    ready: false,
    holds,
    text: `Sign-off Held: ${holds.length} stage gate${holds.length === 1 ? "" : "s"}${holds.length ? ` (${names})` : ""} and ${i.bindingOpen} binding statutory clearance${i.bindingOpen === 1 ? "" : "s"} pending resolution.`,
  };
}
