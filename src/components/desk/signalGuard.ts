/**
 * Boundary validation for the MissionEngine bus. Every publication passes through here
 * before it reaches the shared signal state, so a desk can never put a non-finite
 * number, an out-of-range bond score, a malformed list or an unknown key on the bus,
 * and an unknown publisher is refused. MissionEngine stays the only signal chain: this
 * is a filter on its publish path, not a second store.
 */
import { sanitizeSignals, type Signals } from "./engine";

/** Every id that publishes to the bus: the desks, the mission profile, presets and the inscription tray. */
export const SIGNAL_PUBLISHERS: ReadonlySet<string> = new Set([
  "diagnostics", "sentinel", "shocks", "asymmetry", "mirror", "multiparty", "tracks", "clauses", "redliner",
  "succession", "readiness", "verification", "handover", "audit", "legal", "counterpart", "mission", "preset",
]);

const INSCRIPTION_KEYS = new Set([
  "customParties", "customTraps", "customShocks", "customCovenants", "customGates", "customTracks", "customPrecedents", "customPhrases", "customNotes",
]);

export function isKnownPublisher(id: string): boolean {
  if (SIGNAL_PUBLISHERS.has(id)) return true;
  const m = /^inscription:([A-Za-z]+)$/.exec(id);
  return !!m && INSCRIPTION_KEYS.has(m[1]);
}

/**
 * Validate one publication. Returns null when it must be refused outright (unknown
 * publisher or a payload that is not a plain object); otherwise the patch with every
 * invalid value removed. An explicit `undefined` is kept: that is how a desk clears a key.
 */
export function guardSignalPatch(desk: string, patch: unknown): Signals | null {
  if (!isKnownPublisher(desk)) return null;
  if (!patch || typeof patch !== "object" || Array.isArray(patch) || Object.getPrototypeOf(patch) !== Object.prototype) return null;
  const raw = patch as Record<string, unknown>;
  const clean = sanitizeSignals(raw) as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(raw)) {
    if (raw[k] === undefined) out[k] = undefined;
    else if (k in clean) out[k] = clean[k];
  }
  return out as Signals;
}
