import type { DetailedAcademyModule } from "./academyTypes";
import { CHAPTER_1_1 } from "./academyModuleIChapter11";
import { CHAPTER_1_2 } from "./academyModuleIChapter12";
import { CHAPTER_1_3 } from "./academyModuleIChapter13";
import { CHAPTER_1_4 } from "./academyModuleIChapter14";
import { CHAPTER_2_1 } from "./academyModuleIIChapter21";
import { CHAPTER_2_2 } from "./academyModuleIIChapter22";
import { CHAPTER_2_3 } from "./academyModuleIIChapter23";
import { CHAPTER_2_4 } from "./academyModuleIIChapter24";

export type {
  AcademyFormula,
  ChapterQuizQuestion,
  DetailedAcademyChapter,
  DetailedAcademyModule,
  DetailedLectureSection,
} from "./academyTypes";

/** Modules I and II. Types live in academyTypes.ts; formulas in academyFormulas.ts. */
export const ACADEMY_MODULES_PART_1: DetailedAcademyModule[] = [
  {
    id: "jurisprudence",
    number: "01",
    eyebrow: "Module I · Sovereign Foundations",
    title: "The Jurisprudence of Relational Sovereignty",
    summary:
      "Why constructive ambiguity fails modern multilateralism, and how the shift from Imperium to Dominium restores structural dignity across sovereign covenants.",
    chapters: [CHAPTER_1_1, CHAPTER_1_2, CHAPTER_1_3, CHAPTER_1_4],
  },
  {
    id: "divisional-cadence",
    number: "02",
    eyebrow: "Module II · Divisional Architecture",
    title: "The 18 Operational Desks & Divisional Cadence",
    summary:
      "The operational rhythm of the 18 desks across the four divisions of the dashboard, tracing one signal chain from assessment and early warning, through engagement and legal architecture, to mission governance and handover.",
    chapters: [CHAPTER_2_1, CHAPTER_2_2, CHAPTER_2_3, CHAPTER_2_4],
  },
];
