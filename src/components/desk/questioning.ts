import type { CustomNote } from "./engine";

/** One entered line is one examination question; blank lines do not consume a turn. */
export function questionLines(text: string): string[] {
  return text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
}

/** Custom wording replaces that phase, never truncates it. */
export function phaseQuestions(custom: string, fallback: readonly string[]): string[] {
  const entered = questionLines(custom);
  return entered.length ? entered : [...fallback];
}

/** One counterpart seated in the room, carrying its own place and wording. */
export type Seat = {
  key: string;
  cp: number;
  customOn: boolean;
  cLabel: string;
  cCaution: string;
  cPivot: string;
  cQ: [string, string, string, string];
  phase: number;
  questionIndex: number;
  stall: StallKind;
};

export function newSeat(key: string, cp = 0): Seat {
  return { key, cp, customOn: false, cLabel: "", cCaution: "", cPivot: "", cQ: ["", "", "", ""], phase: 0, questionIndex: 0, stall: "none" };
}

/** Operator-selected conditions reuse the existing examination sequence; no answer inference. */
export const STALL_CONDITIONS = [
  { id: "evidence", label: "Evidence not supplied", phase: 1, index: 1 },
  { id: "mandate", label: "Mandate disputed", phase: 0, index: 1 },
  { id: "ownership", label: "Obligation owner or date unclear", phase: 2, index: 1 },
  { id: "verification", label: "Verification unresolved", phase: 2, index: 2 },
  { id: "unanswered", label: "Answer withheld or disputed", phase: 3, index: 1 },
] as const;

export type StallKind = "none" | typeof STALL_CONDITIONS[number]["id"];

export function stallResponse(kind: StallKind, defaults: readonly (readonly string[])[], pivot: string) {
  const condition = STALL_CONDITIONS.find((entry) => entry.id === kind);
  if (!condition) return undefined;
  const question = defaults[condition.phase]?.[condition.index];
  if (!question) return undefined;
  return { question, pivot, phase: condition.phase, index: condition.index };
}

/** Update one seat; every other seat keeps its progress exactly. */
export function updateSeat(room: readonly Seat[], key: string, patch: Partial<Seat>): Seat[] {
  return room.map((s) => (s.key === key ? { ...s, ...patch } : s));
}

/** Remove a seat, never leaving the room empty. */
export function removeSeat(room: readonly Seat[], key: string): Seat[] {
  return room.length > 1 ? room.filter((s) => s.key !== key) : [...room];
}

export function counterpartTactics(notes: readonly CustomNote[] = []): CustomNote[] {
  return notes.filter((note) => note.desk === "counterpart");
}