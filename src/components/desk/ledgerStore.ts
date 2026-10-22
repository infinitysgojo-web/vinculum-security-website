/**
 * Chancellery chronological session ledger. In memory only: nothing is persisted,
 * nothing leaves the tab, and a reload starts a fresh ledger. Each entry carries a
 * UTC wall-clock stamp so a debrief can be read against any theatre's local time.
 */
import { useEffect, useState, useSyncExternalStore } from "react";
import { calculateMerkleRoot } from "@/lib/chancelleryCrypto";

export type LedgerKind =
  | "MISSION_HYDRATED"
  | "SHOCK_INJECTED"
  | "CUSTOM_SHOCK"
  | "CUSTOM_COVENANT"
  | "CUSTOM_TRAP"
  | "CUSTOM_PARTY"
  | "GATE_CLEARED"
  | "ARCHIVE_EXPORTED"
  | "ARCHIVE_IMPORTED"
  | DecisionAction
  | `${string}_MINTED`;

/**
 * Doctrinal action descriptors recorded in the Mission Decision Log. Each is a user-driven
 * change to the mission; minted references and archive moves are logged but are not decisions.
 */
export type DecisionAction =
  | "INSCRIBE_SHOCK"
  | "LIFT_SHOCK"
  | "INSCRIBE_COVENANT"
  | "AMEND_COVENANT"
  | "STRIKE_COVENANT"
  | "REDLINE_COVENANT"
  | "GATE_OVERRIDE"
  | "GATE_SATISFIED"
  | "GATE_REOPENED"
  | "TRANCHE_RELEASE"
  | "ESCROW_FREEZE"
  | "ESCROW_TERMS"
  | "PROFILE_AMENDED"
  | "POSTURE_BRANCH"
  | "HANDOVER_SEAL";

export type LedgerEntry = { seq: number; at: string; kind: LedgerKind; detail: string; /** Origin desk number ("07"), or "00" for the mission shell. */ desk?: string };

const MAX_ENTRIES = 500;
let entries: LedgerEntry[] = [];
let seq = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

/** Record one operational event. `at` is an ISO instant, injectable for tests. */
export function logEvent(kind: LedgerKind, detail: string, at: Date = new Date(), desk?: string): LedgerEntry {
  const entry: LedgerEntry = { seq: ++seq, at: at.toISOString(), kind, detail: detail.replace(/\s+/g, " ").trim(), ...(desk ? { desk } : {}) };
  entries = [...entries, entry].slice(-MAX_ENTRIES);
  emit();
  return entry;
}

export function ledgerEntries(): LedgerEntry[] {
  return entries;
}

/** Empty the ledger (tests and an explicit operator reset only). */
export function clearLedger() {
  entries = [];
  emit();
}

/** Put back a ledger that the idle seal took out of memory. */
export function restoreLedger(list: ReadonlyArray<Pick<LedgerEntry, "at" | "kind" | "detail"> & { desk?: string }>) {
  entries = list.slice(-MAX_ENTRIES).map((e) => ({ seq: ++seq, at: e.at, kind: e.kind, detail: e.detail, ...(typeof e.desk === "string" && /^\d{2}$/.test(e.desk) ? { desk: e.desk } : {}) }));
  emit();
}

/** Merkle session root over the current ledger, computed on demand (always fresh). */
export function currentMerkleRoot(list: LedgerEntry[] = entries): Promise<string> {
  return calculateMerkleRoot(list);
}

export function subscribeLedger(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useSessionLedger(): LedgerEntry[] {
  return useSyncExternalStore(subscribeLedger, ledgerEntries, ledgerEntries);
}

/** Live Merkle session root; recomputed whenever an event is added. Empty while hashing. */
export function useSessionMerkleRoot(): string {
  const list = useSessionLedger();
  const [root, setRoot] = useState("");
  useEffect(() => {
    let live = true;
    calculateMerkleRoot(list).then((r) => live && setRoot(r));
    return () => {
      live = false;
    };
  }, [list]);
  return root;
}

/** `[HH:MM:SS UTC] KIND: detail` */
export function formatEntry(e: LedgerEntry): string {
  return `[${e.at.slice(11, 19)} UTC] ${e.kind}: ${e.detail}`;
}

/** The plain-text audit log handed to the clipboard for a mission debrief. */
export function auditLogText(list: LedgerEntry[] = entries): string {
  const day = list[0]?.at.slice(0, 10);
  return [
    "VINCULUM SECURITY · CHANCELLERY SESSION LEDGER",
    day ? `Session opened ${day} (UTC)` : "No events recorded",
    "",
    ...list.map(formatEntry),
  ].join("\n");
}

/** Ledger kind for a minted dispatch: "note-verbale" gives NOTE_VERBALE_MINTED. */
export function mintedKind(kind: string): LedgerKind {
  return `${kind.toUpperCase().replace(/[^A-Z]+/g, "_")}_MINTED` as LedgerKind;
}

/* ------------------------------------------------------------------ */
/* Mission Decision Log (Chancellery Wire, Surface 1)                  */
/* ------------------------------------------------------------------ */

export const DECISION_ACTIONS: ReadonlySet<string> = new Set<DecisionAction>([
  "INSCRIBE_SHOCK", "LIFT_SHOCK", "INSCRIBE_COVENANT", "AMEND_COVENANT", "STRIKE_COVENANT", "REDLINE_COVENANT",
  "GATE_OVERRIDE", "GATE_SATISFIED", "GATE_REOPENED", "TRANCHE_RELEASE", "ESCROW_FREEZE", "ESCROW_TERMS",
  "PROFILE_AMENDED", "POSTURE_BRANCH", "HANDOVER_SEAL",
]);

/** Record one user decision against its origin desk ("07", or "00" for the mission shell). */
export function logDecision(desk: string, action: DecisionAction, details: string, at: Date = new Date()): LedgerEntry {
  return logEvent(action, details, at, desk);
}

/** One row of the Mission Decision Log, in the published schema. */
export type DecisionRecord = { id: string; timestamp: string; deskId: string; action: string; details: string };

/**
 * The decision view of the ledger: user-driven decisions only, numbered evt_001, evt_002…
 * in chronological order. Derived on demand, so it can never drift from the ledger.
 */
export function decisionRecords(list: ReadonlyArray<LedgerEntry> = entries): DecisionRecord[] {
  return list
    .filter((e) => DECISION_ACTIONS.has(e.kind))
    .map((e, i) => ({ id: `evt_${String(i + 1).padStart(3, "0")}`, timestamp: e.at, deskId: e.desk ?? "00", action: e.kind, details: e.detail }));
}

/** The plain-text UTC decision ledger handed to the clipboard. */
export function decisionLogText(list: ReadonlyArray<LedgerEntry> = entries): string {
  const rows = decisionRecords(list);
  return [
    "VINCULUM SECURITY · MISSION DECISION LOG",
    "Chronological, UTC. Recorded in this browser tab only.",
    "",
    ...(rows.length ? rows.map((r) => `${r.id}  ${r.timestamp}  DESK ${r.deskId}  ${r.action}  ${r.details}`) : ["No decisions recorded."]),
    "",
    "ENDS",
  ].join("\n");
}
