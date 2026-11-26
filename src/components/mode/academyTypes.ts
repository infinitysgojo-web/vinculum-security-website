/**
 * Chancellery Academy curriculum types.
 *
 * The detailed curriculum (academyCurriculumPart1 to Part3, academyModuleIV) is the
 * single source of truth: the hub cards, chapter overview pages, full lectures, quizzes
 * and attestation gates are all derived from it, so module and chapter ids cannot drift.
 *
 * Text fields may carry inline mathematics between \( and \); formula fields use the
 * Academy notation typeset by academyMath.tsx. Neither is ever shown as source text.
 */

export interface ChapterQuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    explanation: string;
    correct: boolean;
  }[];
}

export interface AcademyFormulaParameter {
  /** Symbol in the Academy notation, e.g. "B_{i}" or "\\lambda". */
  symbol: string;
  name: string;
  domain: string;
  description: string;
  threshold?: string;
}

export interface AcademyFormula {
  id: string;
  title: string;
  /** Where the platform computes it, e.g. "Desk 02 · Sentinel Matrix". */
  classification?: string;
  lhs: string;
  rhs: string;
  condition?: string;
  parameters: AcademyFormulaParameter[];
  statutoryInvariant?: string;
  /**
   * The exported engine or instrument functions that compute this formula
   * (engine.ts, instruments.ts). The Academy tests check that each one exists,
   * so a lecture formula always names its single source of truth.
   */
  computedBy: string[];
}

export interface LectureCaseStudy {
  title: string;
  jurisdiction: string;
  precedent: string;
  analysis: string[];
  failureMechanism: string;
}

/** Section VI instrument cutaways (academyInstruments.tsx), read-only and never on the bus. */
export type AcademyInstrumentKind = "radar" | "asymmetry" | "timeline" | "escrow" | "dominum" | "forum";

export interface DetailedLectureSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  formulas?: AcademyFormula[];
  caseStudy?: LectureCaseStudy;
  statutoryRule?: string;
  /** An interactive instrument rendered after the section text. */
  instrument?: AcademyInstrumentKind;
  /**
   * Capstone practicum surfaces rendered after the instrument: the Interactive Relational
   * Laboratory (which carries the Gate 5 stress simulation) and the six-gate attestation.
   */
  practicum?: ("laboratory" | "attestation")[];
}

/**
 * Practicum drill kinds. Any drill type opens the Interactive Relational Laboratory on the
 * chapter page; "capstone" also opens the gated attestation.
 */
export type DrillType = "border" | "debt" | "maritime" | "capstone";

export interface DetailedAcademyChapter {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  estimatedMinutes: number;
  executiveLede: string;
  /**
   * The lecture's opening overview, read inside the reader before Section I. The chapter
   * page (Tier 1) carries only the number, eyebrow, title, executive lede, statutory notice,
   * reading time, learning outcomes and the button that opens the lecture.
   */
  synopsis: string[];
  statutoryNotice: string;
  learningOutcomes: string[];
  sections: DetailedLectureSection[];
  quiz: ChapterQuizQuestion[];
  drillType?: DrillType;
}

export interface DetailedAcademyModule {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  chapters: DetailedAcademyChapter[];
}
