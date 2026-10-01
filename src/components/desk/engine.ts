import { createContext, useContext, useEffect } from "react";

/**
 * The Vinculum Mission Engine.
 *
 * A single deterministic signal bus shared by every desk on the dashboard.
 * Upstream desks publish their readings; downstream desks read them and adapt
 * their own output. No model, no network, no storage: every value here is a
 * plain arithmetic result computed in the browser from what the analyst entered.
 */

export type BondVector = {
  /** 1 to 5, as scored on the diagnostic bench. */
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

export type Signals = {
  /** Division I, bond diagnostic. */
  bonds?: BondVector;
  bondMean?: number;
  weakestBond?: string;
  weakestScore?: number;
  standing?: string;
  analogue?: string;
  /** Division I, sentinel matrix. */
  rupture?: number;
  ruptureBand?: string;
  bondStrain?: number[];
  traps?: string[];
  trend?: string;
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
};

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

  if (s.weakestBond && (s.weakestScore ?? 5) <= 2)
    out.push({
      level: "critical",
      name: `${s.weakestBond} bond failing`,
      reading: `The ${s.weakestBond.toLowerCase()} bond scores ${s.weakestScore} of 5 on the diagnostic bench.`,
      directive:
        s.weakestBond === "Institutional-Relational"
          ? "Attach a continuity provision binding the office rather than the officeholder before any further step is tabled."
          : "Rebuild this bond through a lower-stakes exchange before the table is asked to carry weight it cannot hold.",
    });

  if (s.elitePactAlert)
    out.push({
      level: "critical",
      name: "Elite-Pact Mirage alert",
      reading: `The principals' track leads the communal track by ${s.trackGap} phases.`,
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

  return out;
}

/** The telemetry block appended to every downstream chancellery document. */
export function telemetryLines(s: Signals): string[] {
  if (!hasSignal(s)) return [];
  const L: string[] = ["UPSTREAM TELEMETRY (live from the mission engine)"];
  if (s.bonds)
    L.push(
      `  Bond vector: interpersonal ${s.bonds.interpersonal}, communal ${s.bonds.communal}, intergenerational ${s.bonds.intergenerational}, institutional ${s.bonds.institutional} (of 5).`
    );
  if (s.standing) L.push(`  Relational standing: ${s.standing}${s.bondMean ? ` (mean ${s.bondMean.toFixed(2)})` : ""}.`);
  if (s.weakestBond) L.push(`  Most exposed bond: ${s.weakestBond}${s.weakestScore ? ` at ${s.weakestScore} of 5` : ""}.`);
  if (s.rupture !== undefined) L.push(`  Rupture index: ${s.rupture} per cent (${s.ruptureBand ?? "unbanded"}).`);
  if (s.traps?.length) L.push(`  Latent traps active: ${s.traps.join("; ")}.`);
  if (s.shocks?.length) L.push(`  Shocks applied: ${s.shocks.join("; ")}.`);
  if (s.firstToBreak) L.push(`  First provision to break under load: ${s.firstToBreak}.`);
  if (s.trackGap !== undefined)
    L.push(`  Track synchronisation: Track I phase ${s.trackI}, Track II phase ${s.trackII}, gap ${s.trackGap}.`);
  if (s.covenants?.length) L.push(`  Covenants drafted upstream: ${s.covenants.join("; ")}.`);
  if (s.survivalScore !== undefined) L.push(`  Treaty survival under stress: ${s.survivalScore} per cent.`);
  const a = alerts(s);
  if (a.length) {
    L.push("", "STANDING ALERTS");
    a.forEach((x) => L.push(`  [${x.level.toUpperCase()}] ${x.name}. ${x.reading} ${x.directive}`));
  }
  L.push("");
  return L;
}
