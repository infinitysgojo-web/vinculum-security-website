import type { ChapterQuizQuestion, DetailedAcademyChapter, DetailedAcademyModule } from "./academyTypes";
import { ACADEMY_MODULES_PART_1 } from "./academyCurriculumPart1";
import { ACADEMY_MODULES_PART_2 } from "./academyCurriculumPart2";
import { ACADEMY_MODULES_PART_3 } from "./academyCurriculumPart3";

/**
 * The single Chancellery Academy curriculum: Modules I and II (Part 1), Module III
 * and Module IV (Part 2 and academyModuleIV), Module V (Part 3, academyModuleV*). The hub, chapter
 * overviews, lectures, quizzes and attestation gates all read this array.
 */
export const ACADEMY_CURRICULUM: readonly DetailedAcademyModule[] = [
  ...ACADEMY_MODULES_PART_1,
  ...ACADEMY_MODULES_PART_2,
  ...ACADEMY_MODULES_PART_3,
];

export const chapterHeading = (c: DetailedAcademyChapter) => `${c.number} ${c.title}`;

const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

export type QuizGate = { id: string; label: string; questionIds: string[] };

/**
 * Knowledge-check gates for the capstone attestation: one per module for Modules I
 * to IV (attestation Gates 1 to 4), each requiring every question in that module's
 * lectures to stand answered correctly. Module V's drill and capstone questions are
 * practice and do not gate the seal; Gate 5 (the applied stress simulation) and Gate 6
 * (the practitioner covenant) are defined in academyAttestation.ts.
 */
export const QUIZ_GATES: QuizGate[] = ACADEMY_CURRICULUM.slice(0, 4).map((m, i) => ({
  id: `module-${m.id}`,
  label: `Module ${ROMAN[i] ?? i + 1} Knowledge Check`,
  questionIds: m.chapters.flatMap((c) => c.quiz.map((q) => q.id)),
}));

const ALL_QUESTIONS: ChapterQuizQuestion[] = ACADEMY_CURRICULUM.flatMap((m) => m.chapters.flatMap((c) => c.quiz));
const CORRECT = new Map(ALL_QUESTIONS.map((q) => [q.id, q.options.find((o) => o.correct)?.id]));

/** A gate is satisfied when every one of its questions currently stands answered correctly. */
export function gateSatisfied(gate: QuizGate, answers: Readonly<Record<string, string>>): boolean {
  return gate.questionIds.length > 0 && gate.questionIds.every((id) => answers[id] !== undefined && answers[id] === CORRECT.get(id));
}

export function gateProgress(gate: QuizGate, answers: Readonly<Record<string, string>>): number {
  return gate.questionIds.filter((id) => answers[id] !== undefined && answers[id] === CORRECT.get(id)).length;
}

const proseWords = (t: string) => t.replace(/\\\(.*?\\\)/g, " x ").split(/\s+/).filter(Boolean).length;

/** Words of lecture prose in a chapter: lede, synopsis, section text, subsections, callouts, case studies, rules and worked practice problems (quiz items, formulas and reading lists excluded). */
export function chapterProseWords(c: DetailedAcademyChapter): number {
  const parts = [c.executiveLede, ...c.synopsis];
  for (const s of c.sections) {
    parts.push(...s.paragraphs);
    if (s.caseStudy) parts.push(...s.caseStudy.analysis, s.caseStudy.failureMechanism);
    for (const sub of s.subsections ?? []) {
      parts.push(...sub.paragraphs);
      if (sub.callout) parts.push(...sub.callout.paragraphs);
    }
    if (s.statutoryRule) parts.push(s.statutoryRule);
  }
  for (const pr of c.practice ?? []) parts.push(pr.problem, ...pr.solution);
  return parts.reduce((n, p) => n + proseWords(p), 0);
}

/** Reading pace of a lecture not yet expanded in Phase B, in words a minute. */
export const READING_WPM = 200;
/** Reading pace of the expanded (Phase B) graduate lectures, in words a minute. */
export const EXPANDED_READING_WPM = 230;
/** Modules whose lectures have been expanded in Phase B and read at the expanded pace. */
export const EXPANDED_MODULES: ReadonlySet<string> = new Set(["relational-mathematics"]);

/** Words a minute for a chapter: 230 for an expanded module's lectures, otherwise 200. */
export function readingWpm(c: DetailedAcademyChapter): number {
  const m = ACADEMY_CURRICULUM.find((x) => x.chapters.some((y) => y.id === c.id));
  return m && EXPANDED_MODULES.has(m.id) ? EXPANDED_READING_WPM : READING_WPM;
}

/** Reading time of the lecture prose at the chapter's pace, rounded up. */
export const readingMinutes = (c: DetailedAcademyChapter) => Math.max(1, Math.ceil(chapterProseWords(c) / readingWpm(c)));
