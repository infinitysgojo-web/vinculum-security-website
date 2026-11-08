/**
 * Bus monitor for the Live Bus Signal Inspector (Chancellery Wire, Surface 1).
 *
 * A read-only observer of the MissionEngine publish path. The dashboard calls
 * recordPublication() after the signal guard has accepted a patch; this module keeps
 * which publisher wrote last and when each signal key last changed, so the inspector
 * can pulse a field for 400 ms. It never writes to the bus, never keeps a copy of the
 * signal values, and holds nothing past the tab: a reload or panic purge starts clean.
 */
import { useSyncExternalStore } from "react";
import { signalValueKey } from "@/lib/signalValues";
import { LEGITIMACY_PENALTY } from "./instruments";
import { inscribedShockDelta, round1, type BondVector, type CustomCovenant, type CustomShock, type Signals } from "./engine";

export type Publication = { seq: number; desk: string; keys: string[]; at: number };

type MonitorState = {
  last?: Publication;
  /** Signal key to the sequence number of the publication that last changed it. */
  changedAt: Record<string, number>;
  /** Signal key to the publisher that last changed it. */
  changedBy: Record<string, string>;
  count: number;
};

let state: MonitorState = { changedAt: {}, changedBy: {}, count: 0 };
let seq = 0;
const listeners = new Set<() => void>();

const same = (a: unknown, b: unknown) => signalValueKey(a) === signalValueKey(b);

/**
 * Keys of the patch whose value differs from the current bus state. Pure: used by the
 * dashboard to decide whether a publication changed anything worth recording.
 */
export function changedKeys(prev: Signals, patch: Signals): string[] {
  const p = prev as Record<string, unknown>;
  const n = patch as Record<string, unknown>;
  return Object.keys(n).filter((k) => !same(p[k], n[k])).sort();
}

/** Record one accepted publication that changed at least one key. `at` is injectable for tests. */
export function recordPublication(desk: string, keys: string[], at: number = Date.now()): Publication | undefined {
  if (!keys.length) return undefined;
  const pub: Publication = { seq: ++seq, desk, keys: [...keys], at };
  const changedAt = { ...state.changedAt };
  const changedBy = { ...state.changedBy };
  for (const k of keys) {
    changedAt[k] = pub.seq;
    changedBy[k] = desk;
  }
  state = { last: pub, changedAt, changedBy, count: state.count + 1 };
  listeners.forEach((fn) => fn());
  return pub;
}

/** Forget every publication (panic purge, idle seal and tests). */
export function resetBusMonitor() {
  state = { changedAt: {}, changedBy: {}, count: 0 };
  listeners.forEach((fn) => fn());
}

export function busMonitorState(): MonitorState {
  return state;
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useBusMonitor(): MonitorState {
  return useSyncExternalStore(subscribe, busMonitorState, busMonitorState);
}

/* ------------------------------------------------------------------ */
/* Telemetry snapshot: what the inspector shows, derived, never stored  */
/* ------------------------------------------------------------------ */

export type TelemetrySnapshot = {
  /** Rupture index R, 0 to 100, or null before the Sentinel Matrix publishes. */
  rupture: number | null;
  /** Summed bond delta of every inscribed compound shock, per bond, each within ±5.0. */
  bondDelta: BondVector;
  /** Mean of the four summed deltas, one decimal. */
  bondDeltaMean: number;
  /** Legitimacy penalty on the compound strain: 15 while the communal share is under the 30 per cent floor, else 0 (scale 0 to 40). */
  legitimacyPenalty: number;
  /** Open Questions in the active workspace's Context Tray. */
  openQuestionsCount: number;
  customShocks: { id: string; title: string; deltas: BondVector }[];
  customCovenants: { id: string; article: string; text: string; category: string }[];
};

const clamp5 = (n: number) => Math.max(-5, Math.min(5, round1(n)));

/**
 * The inspector's view of the bus. A pure read: the signals object is not mutated and
 * every list is a fresh copy, so the inspector can never feed anything back into a desk.
 */
export function telemetrySnapshot(s: Signals, extras: { openQuestions?: number } = {}): TelemetrySnapshot {
  const d = inscribedShockDelta(s);
  const bondDelta: BondVector = {
    interpersonal: clamp5(d.interpersonal),
    communal: clamp5(d.communal),
    intergenerational: clamp5(d.intergenerational),
    institutional: clamp5(d.institutional),
  };
  const v = Object.values(bondDelta);
  return {
    rupture: s.rupture ?? null,
    bondDelta,
    bondDeltaMean: round1(v.reduce((a, x) => a + x, 0) / 4),
    legitimacyPenalty: s.legitimacyDeficit === true ? LEGITIMACY_PENALTY : 0,
    openQuestionsCount: Math.max(0, Math.round(extras.openQuestions ?? 0)),
    customShocks: (s.customShocks ?? []).map((x: CustomShock) => ({ id: x.id, title: x.name, deltas: { ...x.deltas } })),
    customCovenants: (s.customCovenants ?? []).map((c: CustomCovenant) => ({
      id: c.id,
      article: c.mandatedArticleRef ?? "",
      text: c.title + (c.obligation ? `: ${c.obligation}` : ""),
      category: c.enforcementMechanism,
    })),
  };
}

/** Which inspector field a bus key feeds, so a publication pulses the right row. */
export const INSPECTOR_FIELD_KEYS: Record<keyof Omit<TelemetrySnapshot, "bondDeltaMean">, string[]> = {
  rupture: ["rupture", "ruptureBand", "ruptureBase"],
  bondDelta: ["customShocks"],
  legitimacyPenalty: ["legitimacyDeficit"],
  openQuestionsCount: [],
  customShocks: ["customShocks"],
  customCovenants: ["customCovenants"],
};
