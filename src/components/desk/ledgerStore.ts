/**
 * Chancellery chronological session ledger. In memory only: nothing is persisted,
 * nothing leaves the tab, and a reload starts a fresh ledger. Each entry carries a
 * UTC wall-clock stamp so a debrief can be read against any theatre's local time.
 */
import { useSyncExternalStore } from "react";

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
  | `${string}_MINTED`;

export type LedgerEntry = { seq: number; at: string; kind: LedgerKind; detail: string };

const MAX_ENTRIES = 500;
let entries: LedgerEntry[] = [];
let seq = 0;
const listeners = new Set<() => void>();

const emit = () => listeners.forEach((fn) => fn());

/** Record one operational event. `at` is an ISO instant, injectable for tests. */
export function logEvent(kind: LedgerKind, detail: string, at: Date = new Date()): LedgerEntry {
  const entry: LedgerEntry = { seq: ++seq, at: at.toISOString(), kind, detail: detail.replace(/\s+/g, " ").trim() };
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

export function subscribeLedger(fn: () => void): () => void {
  listeners.add(fn);
  return () => {
    listeners.delete(fn);
  };
}

export function useSessionLedger(): LedgerEntry[] {
  return useSyncExternalStore(subscribeLedger, ledgerEntries, ledgerEntries);
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
