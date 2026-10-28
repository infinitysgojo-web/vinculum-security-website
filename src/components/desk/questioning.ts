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

export function counterpartTactics(notes: readonly CustomNote[] = []): CustomNote[] {
  return notes.filter((note) => note.desk === "counterpart");
}