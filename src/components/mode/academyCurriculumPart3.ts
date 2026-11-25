import type { DetailedAcademyModule } from "./academyTypes";
import { CHAPTER_5_1 } from "./academyModuleVAlpha";
import { CHAPTER_5_2 } from "./academyModuleVBeta";
import { CHAPTER_5_3 } from "./academyModuleVGamma";
import { CHAPTER_5_4 } from "./academyModuleVCapstone";

/**
 * Module V · Applied Scenario Drills, Capstone & Gated Attestation. Three applied
 * drills (border, debt, maritime) and the capstone, each in the seven-part lecture
 * structure (academyLectureHeadings.ts). Scenario states are fictional; precedents
 * are drawn from the open public record only, with no sensitive intelligence; where
 * text and code differ, the code wins. Drill figures are re-derived from the engine
 * in qa/academy-curriculum.test.ts.
 */
export const ACADEMY_MODULES_PART_3: DetailedAcademyModule[] = [
  {
    id: "practicum-drills",
    number: "05",
    eyebrow: "Module V · Applied Scenario Drills, Capstone & Gated Attestation",
    title: "Applied Scenario Drills, Capstone & Gated Attestation",
    summary:
      "Three applied drills walk a transboundary river basin, a sovereign debt restructuring with contested mineral collateral, and a maritime EEZ standoff through the live desks, each opened by historical precedent. The capstone then gathers the chain into six locked gates and a browser-local SHA-256 attestation.",
    chapters: [CHAPTER_5_1, CHAPTER_5_2, CHAPTER_5_3, CHAPTER_5_4],
  },
];
