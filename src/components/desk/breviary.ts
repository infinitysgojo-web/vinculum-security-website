import { DOMAINS } from "@/content/cases";
import { DEFAULT_BONDS, type MissionProfile } from "./mission";
import {
  bondBand,
  communalTolerance,
  engineLocks,
  facadeSyndrome,
  hasSignal,
  mathReading,
  successionDurability,
  type BondBandName,
  type BondVector,
  type FacadeReading,
  type Lock,
  type Signals,
  type SuccessionReading,
} from "./engine";

/**
 * The One-Page Chancellery Breviary: a 90-second principal briefing assembled
 * from the live MissionEngine bus. Every figure is a closed-form reading already
 * defined by the doctrine; no estimate or inference is added here.
 */

export type BreviaryReading = {
  bonds: BondVector;
  bondSource: "live" | "profile" | "default";
  rows: { name: string; score: number; band: BondBandName }[];
  mean: number;
  variance: number;
  limiting: { name: string; score: number; band: BondBandName };
  facade: FacadeReading;
  rupture?: number;
  ruptureBand?: string;
  /** Latent traps from the sentinel matrix plus any the engine derives from the live readings. */
  traps: string[];
  tracks: { read: boolean; trackI?: number; trackII?: number; gap?: number; tolerance: number; mirage: boolean };
  locks: Lock[];
  activeLocks: Lock[];
  gatesCleared?: string;
  handover: { viability?: number; band?: string; oversight?: string };
  succession?: SuccessionReading;
  cleared: boolean;
  text: string;
};

export function readBreviary(signals: Signals, profile: MissionProfile, now: Date = new Date()): BreviaryReading {
  const bonds: BondVector = signals.bonds ?? profile.bonds ?? DEFAULT_BONDS;
  const bondSource = signals.bonds ? "live" : profile.bonds ? "profile" : "default";
  const v: [number, number, number, number] = [bonds.interpersonal, bonds.communal, bonds.intergenerational, bonds.institutional];
  const m = mathReading(v);
  const facade = facadeSyndrome(v);
  const rows = DOMAINS.map((name, i) => ({ name: name as string, score: v[i], band: bondBand(v[i]) }));
  const limiting = { name: DOMAINS[m.limitingIndex] as string, score: m.limitingScore, band: bondBand(m.limitingScore) };

  const tolerance = signals.trackTolerance ?? communalTolerance(bonds.communal).phases;
  const trackRead = signals.trackGap !== undefined;
  const mirage = signals.elitePactAlert ?? (trackRead ? (signals.trackGap as number) > tolerance : false);

  const traps = [...(signals.traps ?? [])];
  if (facade.engaged) traps.push("Structural Facade Syndrome");
  if (mirage && !traps.some((t) => /elite-pact/i.test(t))) traps.push("The Elite-Pact Mirage (track divergence above tolerance)");

  const locks = engineLocks(signals);
  const activeLocks = locks.filter((l) => !l.held);
  const succession = successionDurability(signals);
  const handover = {
    viability: signals.handoverViability,
    band: signals.handoverBand,
    oversight: signals.oversightBody?.trim() ? signals.oversightBody.trim() : undefined,
  };

  const r: BreviaryReading = {
    bonds,
    bondSource,
    rows,
    mean: m.mean,
    variance: m.variance,
    limiting,
    facade,
    rupture: signals.rupture,
    ruptureBand: signals.ruptureBand,
    traps,
    tracks: { read: trackRead, trackI: signals.trackI, trackII: signals.trackII, gap: signals.trackGap, tolerance, mirage },
    locks,
    activeLocks,
    gatesCleared: signals.gatesCleared,
    handover,
    succession,
    cleared: activeLocks.length === 0,
    text: "",
  };
  r.text = breviaryText(r, profile, now, hasSignal(signals));
  return r;
}

const BAR = "=".repeat(64);

function breviaryText(r: BreviaryReading, profile: MissionProfile, now: Date, anySignal: boolean): string {
  const f1 = (n: number) => n.toFixed(1);
  const bondLines = r.rows.map((x) => `   ${x.name.padEnd(26)}: ${f1(x.score)} / 5.0  (${x.band})`);
  const source =
    r.bondSource === "live" ? "live from the diagnostic bench" : r.bondSource === "profile" ? "mission profile baseline" : "default 3.0, not yet scored";
  const t = r.tracks;
  const trackLine = t.read
    ? `   Track I = Phase ${t.trackI} | Track II = Phase ${t.trackII} | ΔT = ${t.gap} | T_tol = ${t.tolerance}`
    : `   Not yet read (open Track Sequencing). Communal tolerance T_tol = ${t.tolerance} phase${t.tolerance === 1 ? "" : "s"}.`;
  const lines = [
    BAR,
    "VINCULUM SECURITY · ONE-PAGE CHANCELLERY BREVIARY",
    "90-Second Executive Mission Snapshot · Relational Security Doctrine",
    "KECOBO Registrations: RZ100967 (Doctrine) · RZ104942 (Dashboard) · RZ105005 (Nervous System)",
    BAR,
    "",
    `THEATRE        : ${profile.theatre.trim() || "Not named"}`,
    `PRINCIPALS     : ${profile.parties.trim() || "Not recorded"}`,
    `OFFICER        : ${profile.officer.trim() || "Not recorded"}`,
    `CLASSIFICATION : ${profile.classification.trim() || "Unrestricted, working draft"}`,
    `DATE           : ${now.toISOString().slice(0, 10)}`,
    "",
    `1. BOND VECTOR AND DISPERSION (${source})`,
    ...bondLines,
    `   Limiting factor (Liebig)   : ${r.limiting.name} at ${f1(r.limiting.score)} (${r.limiting.band}). Invest here first.`,
    `   Vector mean μ              : ${r.mean.toFixed(2)}`,
    `   Spread variance σ²         : ${r.variance.toFixed(3)} ${r.facade.engaged ? "[STRUCTURAL FACADE SYNDROME ENGAGED]" : r.variance > 1.25 ? "[ABOVE 1.25, FACADE TEST PARTLY MET]" : "[WITHIN 1.25]"}`,
    "",
    "2. EARLY WARNING AND LATENT TRAPS",
    `   Rupture index R%           : ${r.rupture !== undefined ? `${r.rupture}% (${r.ruptureBand ?? "unbanded"})` : "Not yet read (open Sentinel Matrix)"}`,
    `   Latent traps active        : ${r.traps.length ? r.traps.join("; ") : "None on the bus"}`,
    "",
    "3. TRACK I VERSUS TRACK II",
    trackLine,
    `   Elite-Pact Mirage          : ${t.read ? (t.mirage ? "ENGAGED. The principals' track has outrun the communal track." : "CLEAR. Gap is within communal tolerance.") : "Not assessed"}`,
    "",
    "4. ENGINE LOCKS AND READINESS GATES",
    `   Status                     : ${
      !anySignal
        ? "No upstream readings on the bus yet"
        : r.cleared
          ? r.locks.length
            ? `NO ACTIVE LOCK (${r.locks.length} of ${r.locks.length} engine conditions satisfied)`
            : "No engine lock raised by the current readings"
          : `LOCKED (${r.activeLocks.length} active of ${r.locks.length})`
    }`,
    ...r.activeLocks.map((l) => `   - [LOCK] ${l.name}. Remedy: ${l.remedy}`),
    `   Readiness stages cleared   : ${r.gatesCleared ?? "Not yet read (open Mission Readiness)"}`,
    "",
    "5. GOVERNANCE AND HANDOVER HORIZON",
    `   Handover viability H%      : ${r.handover.viability !== undefined ? `${r.handover.viability}% (${r.handover.band ?? "unbanded"})` : "Not yet assessed (open Mandate Handover)"}`,
    `   Oversight body             : ${r.handover.oversight ?? "Not designated"}`,
    `   Succession durability S%   : ${r.succession ? `${r.succession.percent}%${r.succession.trap ? " [BELOW 55% TRAP GATE]" : ""}` : "Awaiting a bond vector"}`,
    "",
    "Rule-based reading. Deterministic, computed in this browser. Nothing is stored or transmitted.",
  ];
  return lines.join("\n");
}
