/**
 * Tamper-Evident Handover Seal and Divergence Beacon (Chancellery Wire, Surface 1).
 *
 * Sealing serialises the active mission into canonical JSON (keys sorted at every depth,
 * the same rule as the Chancellery apostille), hashes it with SHA-256 through the
 * browser's SubtleCrypto, and keeps the seal in sessionStorage for this tab only. Every
 * later change recomputes the hash; a mismatch is a divergence, and the inspector lists
 * the exact parameters that moved. Nothing is uploaded, and a panic purge clears the
 * seal with the rest of sessionStorage.
 */
import { sha256HexText } from "@/lib/chancelleryCrypto";
import { canonicalJson } from "./registry";
import type { Signals } from "./engine";
import type { DecisionRecord } from "./ledgerStore";

export const SEAL_STORAGE_KEY = "vs:handover-seal";

export type SealProfile = { theatre: string; envoy: string; mandate: string; parties: string; sessionId: string };
export type SealBinder = { facts: string[]; assumptions: string[]; exclusions: string[] };
export type SealPayload = {
  profile: SealProfile;
  binder: SealBinder;
  signals: Signals;
  /** Decision ledger at the moment of sealing, without the seal's own entry. */
  decisions: Omit<DecisionRecord, "id">[];
};

export type SealInput = {
  profile: { theatre: string; officer: string; classification: string; parties: string };
  sessionId: string;
  tray: ReadonlyArray<{ status: string; text: string }>;
  signals: Signals;
  decisions: ReadonlyArray<DecisionRecord>;
};

/** The canonical mission state a seal covers. Pure; the same input always yields the same payload. */
export function sealPayload(i: SealInput): SealPayload {
  const pick = (status: string) => i.tray.filter((e) => e.status === status).map((e) => e.text.trim()).filter(Boolean);
  return {
    profile: {
      theatre: i.profile.theatre.trim(),
      envoy: i.profile.officer.trim(),
      mandate: i.profile.classification.trim(),
      parties: i.profile.parties.trim(),
      sessionId: i.sessionId,
    },
    binder: { facts: pick("fact"), assumptions: pick("assumption"), exclusions: pick("excluded") },
    signals: JSON.parse(JSON.stringify(i.signals ?? {})) as Signals,
    // The evt_ numbering is positional, so it is left out: the record content is what is sealed.
    decisions: i.decisions.filter((d) => d.action !== "HANDOVER_SEAL").map(({ timestamp, deskId, action, details }) => ({ timestamp, deskId, action, details })),
  };
}

export const canonicalSeal = (p: SealPayload): string => canonicalJson(p);

/** SHA-256 over the UTF-8 bytes of the canonical payload, as 64 lowercase hex characters. */
export function computeSealHash(p: SealPayload): Promise<string> {
  return sha256HexText(canonicalSeal(p));
}

export type HandoverSeal = {
  sealHash: string;
  sealedAt: string;
  sealedBy: string;
  sessionId: string;
  /** The canonical payload that was hashed, kept so a divergence can be itemised. */
  canonical: string;
};

/** First eight hex characters, as shown on the badge. */
export const sha8 = (h: string) => h.slice(0, 8);

export async function createSeal(p: SealPayload, sealedBy: string, at: Date = new Date()): Promise<HandoverSeal> {
  const canonical = canonicalSeal(p);
  return { sealHash: await sha256HexText(canonical), sealedAt: at.toISOString(), sealedBy: sealedBy.trim() || "Unnamed officer", sessionId: p.profile.sessionId, canonical };
}

const isSeal = (v: unknown): v is HandoverSeal => {
  const o = v as Record<string, unknown> | null;
  return !!o && typeof o === "object" && typeof o.sealHash === "string" && /^[0-9a-f]{64}$/.test(o.sealHash) &&
    typeof o.sealedAt === "string" && typeof o.sealedBy === "string" && typeof o.sessionId === "string" && typeof o.canonical === "string";
};

/** The seal stored for this tab, if it belongs to the given mission. A malformed record reads as none. */
export function readSeal(sessionId: string | null | undefined, store: Pick<Storage, "getItem"> | undefined = globalThis.sessionStorage): HandoverSeal | null {
  if (!sessionId || !store) return null;
  try {
    const v = JSON.parse(store.getItem(SEAL_STORAGE_KEY) ?? "null");
    return isSeal(v) && v.sessionId === sessionId ? v : null;
  } catch {
    return null;
  }
}

export function writeSeal(seal: HandoverSeal, store: Pick<Storage, "setItem"> | undefined = globalThis.sessionStorage): boolean {
  try {
    store?.setItem(SEAL_STORAGE_KEY, JSON.stringify(seal));
    return !!store;
  } catch {
    return false;
  }
}

export function clearSeal(store: Pick<Storage, "removeItem"> | undefined = globalThis.sessionStorage) {
  try {
    store?.removeItem(SEAL_STORAGE_KEY);
  } catch {
    // sessionStorage unavailable: nothing was stored.
  }
}

/* ------------------------------------------------------------------ */
/* Divergence inspection                                               */
/* ------------------------------------------------------------------ */

export type SealDifference = { path: string; sealed: string; current: string };

/** Display only: never feed formatted values into canonicalisation or comparisons. */
export function formatSealValue(value: string): string {
  if (!/^-?\d+(?:\.\d+)?(?:e[+-]?\d+)?$/i.test(value)) return value;
  const number = Number(value);
  return Number.isFinite(number) ? String(Number(number.toPrecision(12))) : value;
}

/** Identify verified sources; unknown signal fields retain their exact path. */
export function sealParameterLabel(path: string): string {
  const labels: Record<string, string> = {
    bonds: "Desk 01 · Bond diagnostic", bondMean: "Desk 01 · Mean bond", bondVariance: "Desk 01 · Bond variance",
    weakestBond: "Desk 01 · Limiting bond", weakestScore: "Desk 01 · Limiting score",
    rupture: "Desk 02 · Rupture index", ruptureBase: "Desk 02 · Base rupture", ruptureBand: "Desk 02 · Rupture band",
    bondStrain: "Desk 02 · Bond strain", traps: "Desk 02 · Failure modes", trend: "Desk 02 · Trend", trendMultiplier: "Desk 02 · Trend multiplier",
    shocks: "Desk 03 · Compound shocks", firstToBreak: "Desk 03 · First bond to break", shockSeverity: "Desk 03 · Shock severity",
    projectedDegradation: "Desk 12 · Projected bond degradation", decayConstant: "Desk 12 · Decay constant",
    stabilityHalfLifeDays: "Desk 12 · Stability half-life", survivalScore: "Desk 12 · Succession durability", unmitigatedExposure: "Desk 12 · Unmitigated exposure",
    fractureMonths: "Desk 12 · Fracture horizon", fractureSeverity: "Desk 12 · Fracture severity",
  };
  const match = /^signals\.([^.\[]+)(?:\.([^.\[]+))?/.exec(path);
  if (match) {
    const label = labels[match[1]];
    if (!label) return path;
    const bond = match[1] === "bonds" ? match[2] : undefined;
    return bond ? `${label} · ${bond[0].toUpperCase()}${bond.slice(1)}` : label;
  }
  if (path.startsWith("profile.")) return "Mission profile";
  if (path.startsWith("binder.")) return "Mission warrant";
  if (path.startsWith("decisions")) return "Decision ledger";
  return path;
}

/** Flatten a JSON value to path → canonical leaf text. Arrays are indexed: covenants[2].title. */
function flatten(v: unknown, path: string, out: Map<string, string>) {
  if (v !== null && typeof v === "object") {
    const entries = Array.isArray(v) ? v.map((x, i) => [`[${i}]`, x] as const) : Object.keys(v as object).sort().map((k) => [path ? `.${k}` : k, (v as Record<string, unknown>)[k]] as const);
    if (!entries.length) out.set(path, Array.isArray(v) ? "[]" : "{}");
    for (const [k, x] of entries) flatten(x, path + k, out);
    return;
  }
  out.set(path, v === undefined ? "absent" : JSON.stringify(v));
}

/**
 * Every leaf that differs between the sealed canonical payload and the current one,
 * in path order. A leaf present on only one side reads "absent" on the other.
 */
export function sealDifferences(sealedCanonical: string, current: SealPayload): SealDifference[] {
  let sealed: unknown;
  try {
    sealed = JSON.parse(sealedCanonical);
  } catch {
    return [{ path: "seal", sealed: "unreadable", current: "present" }];
  }
  const a = new Map<string, string>();
  const b = new Map<string, string>();
  flatten(sealed, "", a);
  flatten(JSON.parse(canonicalSeal(current)), "", b);
  const keys = [...new Set([...a.keys(), ...b.keys()])].sort();
  return keys.filter((k) => a.get(k) !== b.get(k)).map((k) => ({ path: k, sealed: a.get(k) ?? "absent", current: b.get(k) ?? "absent" }));
}

/** The modified parameters named on the beacon: the second-level path of each difference (signals.rupture, decisions). */
export function modifiedParameters(diffs: ReadonlyArray<SealDifference>): string[] {
  const names = diffs.map((d) => {
    const m = /^([a-z]+)(?:\.([A-Za-z]+))?/.exec(d.path);
    if (!m) return d.path;
    return m[1] === "decisions" || !m[2] ? m[1] : `${m[1]}.${m[2]}`;
  });
  return [...new Set(names)];
}

export type SealStatus = { state: "unsealed" } | { state: "intact"; seal: HandoverSeal } | { state: "diverged"; seal: HandoverSeal; parameters: string[] };

/** Compare the current hash against the seal. */
export function sealStatus(seal: HandoverSeal | null, currentHash: string, diffs: () => SealDifference[]): SealStatus {
  if (!seal) return { state: "unsealed" };
  if (seal.sealHash === currentHash) return { state: "intact", seal };
  return { state: "diverged", seal, parameters: modifiedParameters(diffs()) };
}
