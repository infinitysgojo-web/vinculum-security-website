import type { DetailedAcademyModule } from "./academyTypes";
import { CHAPTER_4_1, CHAPTER_4_2, CHAPTER_4_3 } from "./academyModuleIVChapters1";
import { CHAPTER_4_4, CHAPTER_4_5 } from "./academyModuleIVChapters2";

/**
 * Module IV · Relational Physics. The chapters live in academyModuleIVChapters1.ts
 * (4.1 to 4.3) and academyModuleIVChapters2.ts (4.4 and 4.5), each in the seven-part
 * lecture structure (academyLectureHeadings.ts). Every formula, constant and worked
 * figure is the one the desks compute (engine.ts, instruments.ts); the worked figures
 * are re-derived from those functions in qa/academy-curriculum.test.ts. Historical
 * case studies are drawn from the open public record only.
 */
export const ACADEMY_MODULE_IV: DetailedAcademyModule = {
  id: "relational-mathematics",
  number: "04",
  eyebrow: "Module IV · Relational Physics",
  title: "Canonical Mathematics & Relational Physics",
  summary:
    "The formal mathematics the desks compute: the composite Rupture Index, the Decay Horizon and its half-life, normalised Euclidean asymmetry, the Dominum Index that synthesises the mission, and the conservation law of the Conditional Escrow Waterfall, each opened by a historical settlement and closed by a live instrument.",
  chapters: [CHAPTER_4_1, CHAPTER_4_2, CHAPTER_4_3, CHAPTER_4_4, CHAPTER_4_5],
};
