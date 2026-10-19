import { GLOSSARY } from "@/content/glossary";

export type LexEntry = { id: string; term: string; short: string; source: string };

/**
 * Operational terms used by the dashboard desks, defined from the fixed
 * thresholds the MissionEngine applies, followed by the public Glossary.
 */
const OPERATIONAL: LexEntry[] = [
  { id: "deficit", term: "Relational Deficit", short: "Δrel: the summed shortfall of each bond below the Viable floor of 3.0, from 0 to 8. Shows how much relational capital must be rebuilt before the settlement can bear weight.", source: "Mission engine · Δrel = Σ max(0, 3.0 − Bᵢ)" },
  { id: "contagion", term: "Relational Contagion", short: "The coefficient at which rupture in one bond spreads to the others, driven by bond asymmetry, concurrent shocks, party friction and the rupture index. 50 per cent is elevated; 75 per cent is critical.", source: "Mission engine · C = σ/2 × shock × friction × rupture loads" },
  { id: "entropy", term: "Relational Entropy", short: "How diffused the deficit is across the four bonds (normalised Shannon entropy H), weighted by depth and trend into the entropy index S = H × τ × Δrel ÷ 8.", source: "Mission engine · H = −Σ pᵢ ln pᵢ ÷ ln 4" },
  { id: "decay", term: "Acute vs Systemic Decay", short: "Ω = H × k ÷ 4. Acute decay sits in one bond and takes a targeted remedy; Systemic decay (three or more bonds in deficit, or Ω ≥ 0.5) is structural and locks clearance until continuity covenants are in place.", source: "Mission engine · decay discriminator" },
  { id: "liebig", term: "Liebig Limiting Factor", short: "The weakest of the four bonds. A settlement holds only as well as its lowest bond, so remedial effort goes there first.", source: "Dashboard mathematics · minimum of the bond vector" },
  { id: "elite-pact", term: "Elite-Pact Mirage", short: "The principals' track running ahead of the communal track by more than the communal tolerance allows: agreement at the top that the community has not carried.", source: "Track Sequencing · gap above tolerance" },
  { id: "tolerance", term: "Communal Tolerance", short: "How many phases Track I may lead Track II: none when the communal bond is Failing, one when Fragile, two when Viable or Fortified.", source: "Track Sequencing · communal-bond rule" },
  { id: "rupture", term: "Rupture Index", short: "The Sentinel Matrix reading of observed warning signs, in per cent. 35 per cent is elevated; 60 per cent is critical.", source: "Sentinel Matrix · early warning" },
  { id: "facade", term: "Structural Facade Syndrome", short: "Superficial harmony masking severe rupture: variance above 1.25 with the strongest bond at least 4.0 and the weakest at most 2.0.", source: "Diagnostics · variance test" },
  { id: "succession-trap", term: "Succession Trap", short: "Succession durability below 55 per cent: the settlement is unlikely to survive a change of the people who made it.", source: "Succession · S% = S_raw ÷ 5 × 100" },
  { id: "resonance", term: "Case Resonance", short: "Closeness of the live bond vector to a documented case: one minus the Euclidean distance over the maximum distance of 8.", source: "Diagnostics · nearest-case distance" },
  { id: "bands", term: "Bond Bands", short: "Failing 1.0–2.0, Fragile above 2.0 to 3.0, Viable above 3.0 to 4.0, Fortified above 4.0 to 5.0.", source: "Diagnostics · canonical bands" },
  { id: "variance", term: "Spread Variance", short: "Population variance of the four bond scores, σ². Above 1.25 the bonds are badly uneven, which is the first test of Structural Facade Syndrome.", source: "Diagnostics · σ² = Σ(Bᵢ − μ)² ÷ 4" },
  { id: "track-divergence", term: "Track Divergence", short: "ΔT: how many phases the principals' track (Track I) runs ahead of the communal track (Track II). It is tolerated only up to the Communal Tolerance.", source: "Track Sequencing · ΔT = Track I − Track II" },
  { id: "engine-lock", term: "Engine Lock", short: "A fixed doctrinal condition read from the upstream desks that blocks clearance until its remedy is met, for example a high rupture index with no continuity covenant.", source: "Mission Readiness · engine locks" },
  { id: "readiness-gate", term: "Readiness Gate", short: "One of the twenty protection and verification checks across the four lifecycle stages. A stage clears only when every critical gate is met and no engine lock is open.", source: "Mission Readiness · lifecycle clearance" },
  { id: "handover-viability", term: "Handover Viability", short: "H%: the durability quotient of the handover protocol, the weighted share of rooting tests cleared minus 7 points for each residual dependence on the departing presence. 80 and above clears; 60 to 79 is conditional.", source: "Mandate Handover · durability quotient" },
  { id: "oversight-body", term: "Oversight Body", short: "The successor office named in the handover protocol that inherits every open commitment as an office, not through any officeholder.", source: "Mandate Handover · successor office" },
  { id: "breviary", term: "Chancellery Breviary", short: "A one-page executive snapshot of the live mission engine, built for a 90-second principal briefing and exportable with an integrity stamp.", source: "Dashboard header · executive briefing" },
  { id: "what-if", term: "What-If Simulator", short: "A sandbox beside the bond diagnostic. It recomputes the limiting factor, mean, variance and communal tolerance for a hypothetical intervention without touching the live mission until you apply it.", source: "Diagnostics · delta simulator" },
  { id: "theatre-library", term: "Theatre Library", short: "Operational theatres saved in this browser so you can switch between them without losing records. Nothing is uploaded.", source: "Mission State Vault · local library" },
  { id: "integrity", term: "Integrity Stamp", short: "A SHA-256 fingerprint of an exported document or mission file, computed on this device. Any change to the text changes the fingerprint.", source: "Chain of custody" },
  { id: "decay-horizon", term: "Decay Horizon", short: "Treaty half-life T½: the months until each bond loses half its height above the 1.0 floor without remedy. λ = (U + R) ÷ 2000, where U is uninsulated shock exposure and R the rupture index; T½ = ln 2 ÷ λ; each bond follows Bᵢ(t) = 1 + (Bᵢ − 1)·e^(−λᵢ t) with λᵢ = λ(0.5 + strainᵢ ÷ 100). A rule, not a forecast.", source: "Succession desk · decay horizon" },
  { id: "enforceability", term: "Dispute Enforceability Index", short: "E, from 0 to 100, ranks a dispute forum on doctrinal 1 to 5 ratings: E = 100 × (0.5·teeth + 0.3·(6 − immunity) + 0.2·pace) ÷ 5. Teeth is the enforcement route, immunity the exposure to a sovereign-immunity defence, pace the speed of procedure.", source: "Clause Architect · forum bench" },
  { id: "escrow", term: "Sovereign Escrow Waterfall", short: "Funds held by a neutral custodian and released in three tranches: verifier seated, communal bond ≥ 3.0, intergenerational bond ≥ 3.0. Released = Σ shares of met tranches; everything freezes while the rupture index is 60 per cent or more.", source: "Multi-party desk · escrow" },
];

export const LEXICON: LexEntry[] = [
  ...OPERATIONAL,
  ...GLOSSARY.map((g) => ({ id: g.id, term: g.term, short: g.short, source: g.source })),
];

export const findLex = (term: string) =>
  LEXICON.find((e) => e.term.toLowerCase() === term.toLowerCase() || e.id === term);
