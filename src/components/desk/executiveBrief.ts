/**
 * Data model for the 1-Page Executive Action Summary and the three-tier evidentiary pouch.
 * One pure function assembles what the printed sheet, the briefing PDF and the cable all
 * show, so the three formats can never disagree.
 */
import { BOND_NAMES, bondBand, round1, stageGateAudit, type Signals } from "./engine";
import { exposureOf } from "@/components/mode/postureBranches";

export const STATUTORY_NOTICE =
  "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.";
export const NON_COMMERCIAL_NOTICE =
  "Non-commercial diplomatic instrument. Prepared in a browser-local chancellery terminal; deterministic readings from documented formulas, not forecasts.";

export type ReadinessGate = { name: string; cleared: boolean; reading: string };

/**
 * The six evidentiary readiness gates: the five canonical stage gates of stageGateAudit,
 * plus Evidentiary Hygiene, the Readiness Desk's rule that every Open Question is resolved
 * and every inscribed sovereign gate attested before clearance.
 */
export function readinessGates(s: Signals, openQuestions = 0): ReadinessGate[] {
  const gates: ReadinessGate[] = stageGateAudit(s).gates.map((g) => ({ name: g.name, cleared: g.passed, reading: g.reading }));
  const pending = (s.customGates ?? []).filter((g) => !g.verified).length;
  gates.push({
    name: "Evidentiary Hygiene",
    cleared: openQuestions === 0 && pending === 0,
    reading: `${openQuestions} open question${openQuestions === 1 ? "" : "s"} in the Context Tray; ${pending} inscribed gate${pending === 1 ? "" : "s"} awaiting attestation.`,
  });
  return gates;
}

export type ExecSummaryInput = {
  title: string;
  theatre: string;
  parties: string;
  envoy: string;
  classification: string;
  signals: Signals;
  openQuestions?: number;
  /** The handover seal hash, when the mission is sealed. */
  sealHash?: string;
  /** Covenants of the baseline posture, so covenants introduced since are marked contested. */
  baselineCovenants?: string[];
  assessedAt?: Date;
  notice?: string;
};

export type ExecSummary = {
  masthead: { title: string; parties: string; theatre: string; envoy: string; classification: string; assessedUtc: string; seal: string };
  bonds: { name: string; score: number | null; band: string }[];
  meanBond: number | null;
  rupture: number | null;
  ruptureBand: string;
  exposure: number | null;
  survival: number | null;
  shocks: string[];
  covenants: { text: string; contested: boolean }[];
  redlineFlags: number;
  gates: ReadinessGate[];
  gatesCleared: number;
  notice: string;
};

export function execSummary(i: ExecSummaryInput): ExecSummary {
  const s = i.signals;
  const b = s.bonds;
  const v = b ? [b.interpersonal, b.communal, b.intergenerational, b.institutional] : null;
  const base = i.baselineCovenants ? new Set(i.baselineCovenants) : null;
  const gates = readinessGates(s, i.openQuestions ?? 0);
  return {
    masthead: {
      title: i.title.trim() || "Unnamed mission",
      parties: i.parties.trim() || "Not recorded",
      theatre: i.theatre.trim() || "Not recorded",
      envoy: i.envoy.trim() || "Not recorded",
      classification: i.classification.trim() || "Unrestricted, working draft",
      assessedUtc: (i.assessedAt ?? new Date()).toISOString().replace("T", " ").slice(0, 16) + " UTC",
      seal: i.sealHash ? `SHA-256 ${i.sealHash}` : "Not sealed",
    },
    bonds: BOND_NAMES.map((name, k) => ({ name, score: v ? v[k] : null, band: v ? bondBand(v[k]) : "Not scored" })),
    meanBond: v ? Math.round((v.reduce((a, x) => a + x, 0) / 4) * 100) / 100 : null,
    rupture: s.rupture ?? null,
    ruptureBand: s.ruptureBand ?? (s.rupture === undefined ? "Not measured" : "Unbanded"),
    exposure: exposureOf(s) ?? null,
    survival: s.survivalScore ?? null,
    shocks: [...(s.shocks ?? [])],
    covenants: (s.covenants ?? []).map((c) => ({ text: c, contested: !!base && !base.has(c) })),
    redlineFlags: s.redlineFlags ?? 0,
    gates,
    gatesCleared: gates.filter((g) => g.cleared).length,
    notice: [i.notice, NON_COMMERCIAL_NOTICE, STATUTORY_NOTICE].filter(Boolean).join(" "),
  };
}

/** Radar polygon points for the four bonds on a 1 to 5 scale, centred in a square of side `size`. */
export function radarPoints(scores: ReadonlyArray<number | null>, size: number, pad = 18): { x: number; y: number }[] {
  const c = size / 2;
  const r = c - pad;
  return scores.map((sc, k) => {
    const a = -Math.PI / 2 + (k * 2 * Math.PI) / scores.length;
    const t = sc === null ? 0 : Math.max(0, Math.min(1, (sc - 1) / 4));
    return { x: round1(c + r * t * Math.cos(a)), y: round1(c + r * t * Math.sin(a)) };
  });
}

/** A file-safe mission slug: lowercase ASCII words joined by hyphens, at most 48 characters. */
export function missionSlug(title: string): string {
  const s = title
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48)
    .replace(/-+$/g, "");
  return s || "vinculum-mission";
}
