/**
 * Pure state rules for the Chancellery Academy lecture reader (academyReader.tsx).
 * Kept free of React and the DOM so the exit, resume and progress behaviour is tested
 * directly in qa/academy-curriculum.test.ts. Everything stays in this browser tab's
 * sessionStorage; nothing is transmitted.
 */

import type { StressRecord } from "./academyAttestation";

/** sessionStorage key for quiz answers, the covenant, the Gate 5 record and gate times. */
export const SESSION_KEY = "udca-academy-session-v1";

export type SessionState = {
  answers: Record<string, string>;
  covenantAffirmed: boolean;
  stress: StressRecord | null;
  passedAt: Record<string, string>;
};

export const EMPTY_SESSION: SessionState = { answers: {}, covenantAffirmed: false, stress: null, passedAt: {} };

/**
 * Academy progress for this tab. Quiz answers live here, not in the reader, so closing and
 * reopening a lecture never loses them.
 */
export function loadAcademySession(store: Pick<Storage, "getItem"> | null | undefined): SessionState {
  if (!store) return EMPTY_SESSION;
  try {
    const raw = store.getItem(SESSION_KEY);
    if (!raw) return EMPTY_SESSION;
    const v = JSON.parse(raw) as Partial<SessionState>;
    return {
      answers: v.answers && typeof v.answers === "object" ? (v.answers as Record<string, string>) : {},
      covenantAffirmed: v.covenantAffirmed === true,
      stress: v.stress && typeof v.stress === "object" ? (v.stress as StressRecord) : null,
      passedAt: v.passedAt && typeof v.passedAt === "object" ? (v.passedAt as Record<string, string>) : {},
    };
  } catch {
    return EMPTY_SESSION;
  }
}

/** sessionStorage key for the per-chapter reading position. */
export const READING_KEY = "udca-academy-reading-v1";

/** What an Escape press does: close an open menu first, otherwise close the lecture. */
export type ReaderKeyAction = "close-menu" | "close-lecture" | null;

export function readerKeyAction(key: string, state: { menuOpen: boolean }): ReaderKeyAction {
  if (key !== "Escape" && key !== "Esc") return null;
  return state.menuOpen ? "close-menu" : "close-lecture";
}

type StorageLike = Pick<Storage, "getItem" | "setItem">;

/** Saved reading positions, by chapter id, as a fraction 0..1 of the lecture scrolled. */
export function loadPositions(store: StorageLike | null | undefined): Record<string, number> {
  if (!store) return {};
  try {
    const raw = store.getItem(READING_KEY);
    if (!raw) return {};
    const v = JSON.parse(raw) as unknown;
    if (!v || typeof v !== "object") return {};
    const out: Record<string, number> = {};
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) if (typeof x === "number" && Number.isFinite(x)) out[k] = Math.min(1, Math.max(0, x));
    return out;
  } catch {
    return {};
  }
}

/** Store the position of one chapter; a position within the first 3 per cent is cleared (nothing to resume). */
export function savePosition(store: StorageLike | null | undefined, chapterId: string, fraction: number): Record<string, number> {
  const all = loadPositions(store);
  const f = Number.isFinite(fraction) ? Math.min(1, Math.max(0, fraction)) : 0;
  if (f < 0.03) delete all[chapterId];
  else all[chapterId] = Math.round(f * 1000) / 1000;
  try {
    store?.setItem(READING_KEY, JSON.stringify(all));
  } catch {
    /* storage unavailable: the position is simply not offered on reopen */
  }
  return all;
}

/** Fraction of the lecture read, from the scroll container's geometry. */
export function readingProgress(scrollTop: number, scrollHeight: number, clientHeight: number): number {
  const range = scrollHeight - clientHeight;
  if (!(range > 0)) return 1;
  return Math.min(1, Math.max(0, scrollTop / range));
}

/** Whole minutes left at a given progress, never below 0. */
export const minutesLeft = (totalMinutes: number, progress: number) => Math.max(0, Math.ceil(totalMinutes * (1 - Math.min(1, Math.max(0, progress)))));

/**
 * The index of the section being read: the last section whose top has passed the reading
 * line (offset below the top of the scroll area). -1 before the first section.
 */
export function activeSection(sectionTops: readonly number[], scrollTop: number, offset = 96): number {
  let idx = -1;
  sectionTops.forEach((top, i) => {
    if (top - offset <= scrollTop) idx = i;
  });
  return idx;
}
