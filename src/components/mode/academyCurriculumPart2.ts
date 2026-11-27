import type { DetailedAcademyModule } from "./academyTypes";
import { ACADEMY_MODULE_IV } from "./academyModuleIV";
import { CHAPTER_3_1 } from "./academyModuleIIIChapter31";
import { CHAPTER_3_2 } from "./academyModuleIIIChapter32";
import { CHAPTER_3_3 } from "./academyModuleIIIChapter33";

/** Module III · Computational Sovereignty, followed by Module IV (academyModuleIV.ts). */

export const ACADEMY_MODULES_PART_2: DetailedAcademyModule[] = [
  {
    id: "computational-sovereignty",
    number: "03",
    eyebrow: "Module III · Computational Sovereignty",
    title: "Cryptographic Integrity, Safeguards & Counter-Intelligence",
    summary: "Why sovereign diplomacy demands zero-cloud architecture, how canonical JSON serialization and Web Crypto SHA-256 hashing prevent post-hoc tampering, and how Sentinel guards enforce air-gapped security.",
    chapters: [
      CHAPTER_3_1,
      CHAPTER_3_2,
      CHAPTER_3_3,
    ],
  },
  ACADEMY_MODULE_IV,
];
