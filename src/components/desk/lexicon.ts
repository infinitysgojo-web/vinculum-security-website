import { GLOSSARY } from "@/content/glossary";

export type LexEntry = { id: string; term: string; short: string; source: string };

/**
 * Operational terms used by the dashboard desks, defined from the fixed
 * thresholds the MissionEngine applies, followed by the public Glossary.
 */
const OPERATIONAL: LexEntry[] = [
  { id: "liebig", term: "Liebig Limiting Factor", short: "The weakest of the four bonds. A settlement holds only as well as its lowest bond, so remedial effort goes there first.", source: "Dashboard mathematics · minimum of the bond vector" },
  { id: "elite-pact", term: "Elite-Pact Mirage", short: "The principals' track running ahead of the communal track by more than the communal tolerance allows: agreement at the top that the community has not carried.", source: "Track Sequencing · gap above tolerance" },
  { id: "tolerance", term: "Communal Tolerance", short: "How many phases Track I may lead Track II: none when the communal bond is Failing, one when Fragile, two when Viable or Fortified.", source: "Track Sequencing · communal-bond rule" },
  { id: "rupture", term: "Rupture Index", short: "The Sentinel Matrix reading of observed warning signs, in per cent. 35 per cent is elevated; 60 per cent is critical.", source: "Sentinel Matrix · early warning" },
  { id: "facade", term: "Structural Facade Syndrome", short: "Superficial harmony masking severe rupture: variance above 1.25 with the strongest bond at least 4.0 and the weakest at most 2.0.", source: "Diagnostics · variance test" },
  { id: "succession-trap", term: "Succession Trap", short: "Succession durability below 55 per cent: the settlement is unlikely to survive a change of the people who made it.", source: "Succession · S% = S_raw ÷ 5 × 100" },
  { id: "resonance", term: "Case Resonance", short: "Closeness of the live bond vector to a documented case: one minus the Euclidean distance over the maximum distance of 8.", source: "Diagnostics · nearest-case distance" },
  { id: "bands", term: "Bond Bands", short: "Failing 1.0–2.0, Fragile above 2.0 to 3.0, Viable above 3.0 to 4.0, Fortified above 4.0 to 5.0.", source: "Diagnostics · canonical bands" },
  { id: "integrity", term: "Integrity Stamp", short: "A SHA-256 fingerprint of an exported document or mission file, computed on this device. Any change to the text changes the fingerprint.", source: "Chain of custody" },
];

export const LEXICON: LexEntry[] = [
  ...OPERATIONAL,
  ...GLOSSARY.map((g) => ({ id: g.id, term: g.term, short: g.short, source: g.source })),
];

export const findLex = (term: string) =>
  LEXICON.find((e) => e.term.toLowerCase() === term.toLowerCase() || e.id === term);
