/**
 * The seven-part Tier 2 lecture structure used by Modules IV and V. Sections I to VI are
 * lecture sections in this order; Part VII is the chapter quiz, rendered under QUIZ.
 */
export const LECTURE_HEADINGS = {
  autopsy: "I. Historical Statecraft & Treaty Autopsy",
  architecture: "II. Canonical Relational Architecture & Formal Mechanics",
  proofs: "III. Mathematical Derivations & Scholarly Proofs",
  protocols: "IV. Operational Protocols & Desk Integration",
  failure: "V. Failure Modes, Countermeasures & The Liebig Bottleneck",
  instrument: "VI. Interactive Instrument Cutaway / Dynamic Demonstration",
  quiz: "VII. Comprehension Knowledge Check",
} as const;

export const SEVEN_PART_ORDER = [
  LECTURE_HEADINGS.autopsy,
  LECTURE_HEADINGS.architecture,
  LECTURE_HEADINGS.proofs,
  LECTURE_HEADINGS.protocols,
  LECTURE_HEADINGS.failure,
  LECTURE_HEADINGS.instrument,
] as const;
