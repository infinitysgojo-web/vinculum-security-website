import type { AcademyFormula } from "./academyTypes";

/**
 * Canonical formulas shared across the Chancellery Academy.
 *
 * Each entry restates a formula the desks already compute and names, in computedBy,
 * the exported function that computes it. Constants are the engine's own: bonds on
 * the 1.0 to 5.0 scale, the 3.0 viable floor (exactly 3.0 is a breach), rupture
 * bands at 15, 35 and 60 per cent, the 30-point inscribed load cap, the 2000 decay
 * divisor and 1.0 sovereign floor, the 2.0 fracture level, forum penalties 18 and 8,
 * the 60 per cent escrow freeze, the 55 per cent succession trap and the Dominum
 * thresholds 40, 60 and 75. Text uses the Academy notation (academyMath.tsx).
 */

export const F_STATE_VECTOR: AcademyFormula = {
  id: "state-vector",
  title: "The Four-Bond Relational State Vector",
  classification: "Desk 01 · Diagnostics",
  lhs: "S_{B}",
  rhs: "\\vec{B_{1}}{B_{2}}{B_{3}}{B_{4}}",
  condition: "B_{i} \\in [1.0,\\, 5.0]",
  parameters: [
    { symbol: "B_{1}", name: "Interpersonal bond", domain: "1.0 to 5.0", description: "Direct reciprocal trust between the negotiators on whom the process actually rests." },
    { symbol: "B_{2}", name: "Communal bond", domain: "1.0 to 5.0", description: "Inter-group cohesion and civic trust across divided populations." },
    { symbol: "B_{3}", name: "Intergenerational bond", domain: "1.0 to 5.0", description: "Transmission of the settlement across successions; youth stake and institutional memory." },
    { symbol: "B_{4}", name: "Institutional-Relational bond", domain: "1.0 to 5.0", description: "The channel between the governed and the organs of state; survival of a change of office." },
  ],
  statutoryInvariant: "Scores move in steps of 0.1 and are clamped to the 1.0 sovereign baseline and the 5.0 ceiling. Bands: 1.0 to 2.0 Failing, 2.1 to 3.0 Fragile, 3.1 to 4.0 Viable, 4.1 to 5.0 Fortified.",
  computedBy: ["mathReading", "clampScore", "bondBand"],
};

export const F_LIEBIG: AcademyFormula = {
  id: "liebig-minimum",
  title: "The Liebig Limiting Factor",
  classification: "Desk 01 · Diagnostics",
  lhs: "B_{\\min}",
  rhs: "\\min(B_{1},\\, B_{2},\\, B_{3},\\, B_{4})",
  condition: "\\text{viable only if } B_{i} > 3.0 \\text{ for every } i",
  parameters: [
    { symbol: "B_{\\min}", name: "Limiting bond", domain: "1.0 to 5.0", description: "The weakest of the four bonds; ties go to the earlier bond in vector order." },
    { symbol: "3.0", name: "Viable floor", domain: "constant", description: "A bond holds the floor only when it sits strictly above 3.0.", threshold: "A score of exactly 3.0 is a statutory breach." },
  ],
  statutoryInvariant: "No settlement holds while any bond sits at or below the floor; strength elsewhere cannot compensate.",
  computedBy: ["mathReading", "breachesFloor", "holdsFloor"],
};

export const F_MEAN: AcademyFormula = {
  id: "bond-mean",
  title: "Composite Bond Mean",
  classification: "Desk 01 · Diagnostics",
  lhs: "\\mu_{B}",
  rhs: "\\frac{1}{4} \\sum_{i=1}^{4} B_{i}",
  parameters: [
    { symbol: "\\mu_{B}", name: "Mean bond", domain: "1.0 to 5.0", description: "Sets the relational standing: below 2.0 Fractured, 2.0 to below 3.0 Degraded, 3.0 to below 4.0 Contested, 4.0 to below 4.6 Stabilised, 4.6 and above Reconstituted." },
  ],
  statutoryInvariant: "The mean characterises the theatre; it never overrides the limiting bond.",
  computedBy: ["mathReading"],
};

export const F_VARIANCE: AcademyFormula = {
  id: "bond-variance",
  title: "Population Variance of the Vector",
  classification: "Desk 01 · Diagnostics",
  lhs: "\\sigma_{B}^{2}",
  rhs: "\\frac{1}{4} \\sum_{i=1}^{4} (B_{i} - \\mu_{B})^{2}",
  parameters: [
    { symbol: "\\sigma_{B}^{2}", name: "Variance", domain: "0 to 4", description: "Facade Syndrome engages when the variance exceeds 1.25, the strongest bond is at least 4.0 and the weakest is at most 2.0." },
  ],
  computedBy: ["mathReading", "facadeSyndrome"],
};

export const F_DEFICIT: AcademyFormula = {
  id: "relational-deficit",
  title: "Relational Deficit",
  classification: "Engine · Relational Dynamics",
  lhs: "\\Delta_{rel}",
  rhs: "\\sum_{i=1}^{4} \\max(0,\\, 3.0 - B_{i})",
  condition: "0 \\le \\Delta_{rel} \\le 8",
  parameters: [
    { symbol: "\\Delta_{rel}", name: "Relational deficit", domain: "0 to 8", description: "The total depth by which the bonds fall short of the viable floor." },
  ],
  statutoryInvariant: "A deficit of 25 per cent of the maximum raises an elevated alert; 50 per cent raises a critical one.",
  computedBy: ["relationalDynamics"],
};

export const F_RUPTURE: AcademyFormula = {
  id: "rupture-index",
  title: "Composite Rupture Index",
  classification: "Desk 02 · Sentinel Matrix",
  lhs: "R",
  rhs: "\\min(100,\\, \\round((\\frac{100\\, \\sigma}{W} + I) \\times \\tau))",
  condition: "R \\in [0,\\, 100]",
  parameters: [
    { symbol: "\\sigma", name: "Observed weight", domain: "0 to W", description: "Sum of the weights (1, 2 or 3) of the tripwires marked present." },
    { symbol: "W", name: "Register weight", domain: "56 plus custom", description: "Total weight of the register: 56 for the 24 standard tripwires, plus any custom indicators." },
    { symbol: "I", name: "Inscribed load", domain: "0 to 30", description: "Pressure from inscribed shocks and active inscribed traps, capped at 30." },
    { symbol: "\\tau", name: "Trend multiplier", domain: "0.85, 1.00, 1.15", description: "Improving, static or deteriorating.", threshold: "Bands: Stable below 15, Guarded 15 to 34, Elevated 35 to 59, Critical 60 and above." },
  ],
  statutoryInvariant: "A rule-based reading of what the analyst recorded, not a prediction. At 60 per cent the escrow account freezes.",
  computedBy: ["ruptureIndex", "sentinelRuptureProof"],
};

export const F_INSCRIBED: AcademyFormula = {
  id: "inscribed-load",
  title: "Inscribed Load",
  classification: "Desk 02 · Sentinel Matrix",
  lhs: "I",
  rhs: "\\min(30,\\, \\round(5\\, \\delta + 6\\, n_{T}))",
  parameters: [
    { symbol: "\\delta", name: "Negative delta", domain: "0 and above", description: "Total magnitude of the negative bond deltas carried by inscribed custom shocks." },
    { symbol: "n_{T}", name: "Active inscribed traps", domain: "0 and above", description: "Inscribed custom traps marked active. Standard traps detected on the matrix do not add to the index." },
  ],
  computedBy: ["inscribedRuptureLoad"],
};

export const F_DECAY: AcademyFormula = {
  id: "decay-constant",
  title: "Decay Constant",
  classification: "Desk 12 · Succession Simulator",
  lhs: "\\lambda",
  rhs: "\\frac{\\max(0,\\, U + R)}{2000}",
  condition: "\\text{per day}",
  parameters: [
    { symbol: "U", name: "Unmitigated exposure", domain: "severity points", description: "Full severity of every uninsulated succession shock plus one quarter of every insulated one. The code sets no upper bound." },
    { symbol: "R", name: "Rupture index", domain: "0 to 100", description: "Read from the Sentinel Matrix while the desk is linked to the bus; zero under override." },
  ],
  computedBy: ["decayHorizon", "decayProof"],
};

export const F_EXPOSURE: AcademyFormula = {
  id: "unmitigated-exposure",
  title: "Unmitigated Exposure",
  classification: "Desk 12 · Succession Simulator",
  lhs: "U",
  rhs: "\\sum_{j \\in S} s_{j}\\, (1 - \\frac{3}{4}\\, \\iota_{j})",
  parameters: [
    { symbol: "s_{j}", name: "Shock severity", domain: "points", description: "The severity of an active succession shock." },
    { symbol: "\\iota_{j}", name: "Insulation indicator", domain: "0 or 1", description: "1 when a provision in force guards against the shock." },
  ],
  computedBy: ["decayHorizon"],
};

export const F_HALF_LIFE: AcademyFormula = {
  id: "half-life",
  title: "Stability Half-Life",
  classification: "Desk 12 · Succession Simulator",
  lhs: "t_{1/2}",
  rhs: "\\frac{\\ln 2}{\\lambda}",
  condition: "\\lambda > 0",
  parameters: [
    { symbol: "t_{1/2}", name: "Half-life", domain: "days", description: "Days for an unfloored bond to lose half its strength. When the decay constant is zero the limit is infinite, which is not a guarantee of stability." },
  ],
  computedBy: ["decayHorizon", "halfLifeProof"],
};

export const F_PRESERVED: AcademyFormula = {
  id: "preserved-bond",
  title: "Preserved Bond After t Days",
  classification: "Desk 12 · Succession Simulator",
  lhs: "B_{i}(t)",
  rhs: "\\max(1.0,\\, B_{i}(0)\\, e^{-\\lambda t})",
  parameters: [
    { symbol: "1.0", name: "Sovereign floor", domain: "constant", description: "No bond is projected below the statutory baseline." },
    { symbol: "t", name: "Horizon", domain: "30, 90, 180, 365 days", description: "The projection horizons offered on the desk." },
  ],
  computedBy: ["preservedBond", "decayHorizon"],
};

export const F_FRACTURE: AcademyFormula = {
  id: "fracture-window",
  title: "Critical Fracture Window",
  classification: "Desk 12 · Succession Simulator",
  lhs: "t_{f}",
  rhs: "\\frac{\\ln(\\frac{\\mu_{B}}{2.0})}{\\lambda}",
  condition: "t_{f} = 0 \\text{ if } \\mu_{B} \\le 2.0",
  parameters: [
    { symbol: "2.0", name: "Fracture level", domain: "constant", description: "The mean bond below which the standing reads Fractured." },
    { symbol: "t_{f}", name: "Fracture window", domain: "days", description: "Converted to months by dividing by 30.44.", threshold: "Above 24 months stable, above 12 monitored, above 6 acute, otherwise imminent." },
  ],
  computedBy: ["fractureWindow", "fractureProof"],
};

export const F_SUCCESSION: AcademyFormula = {
  id: "succession-durability",
  title: "Succession Durability",
  classification: "Desk 12 · Succession Simulator",
  lhs: "S_{raw}",
  rhs: "0.35\\, \\mu_{B} + 0.25\\, B_{3} + 0.25\\, B_{4} + 0.15\\, I_{cov} - 0.20\\, \\frac{R}{100}",
  condition: "S_{\\%} = \\frac{S_{raw}}{5} \\times 100",
  parameters: [
    { symbol: "I_{cov}", name: "Covenant indicator", domain: "0, 0.5 or 1.0", description: "0.5 per covenant in force, saturating at 1.0 with two covenants." },
    { symbol: "S_{\\%}", name: "Durability", domain: "0 to 100", description: "Rounded to one decimal.", threshold: "Below 55 per cent the Succession Trap is raised." },
  ],
  computedBy: ["successionDurability"],
};

export const F_CASE_DISTANCE: AcademyFormula = {
  id: "case-distance",
  title: "Euclidean Distance to a Documented Case",
  classification: "Desk 01 · Pattern Matching",
  lhs: "d(B,\\, C_{k})",
  rhs: "\\sqrt{\\sum_{i=1}^{4} (B_{i} - C_{k,i})^{2}}",
  condition: "0 \\le d \\le 8",
  parameters: [
    { symbol: "C_{k}", name: "Canonical case vector", domain: "1.0 to 5.0", description: "The recorded four-bond profile of one of the eight documented cases." },
    { symbol: "8", name: "Maximum distance", domain: "constant", description: "The largest possible distance between two four-bond vectors on the 1 to 5 scale." },
  ],
  computedBy: ["rankCases", "distanceTable"],
};

export const F_RESONANCE: AcademyFormula = {
  id: "case-resonance",
  title: "Historical Resonance",
  classification: "Desk 01 · Pattern Matching",
  lhs: "\\rho_{k}",
  rhs: "(1 - \\frac{d(B,\\, C_{k})}{8}) \\times 100",
  parameters: [
    { symbol: "\\rho_{k}", name: "Resonance with case k", domain: "0 to 100", description: "Recorded on the desk as the resonance of each case; the three nearest cases are ranked, ties to the earlier case." },
  ],
  computedBy: ["distanceTable"],
};

export const F_FRICTION: AcademyFormula = {
  id: "friction-coefficient",
  title: "Inter-Party Friction Coefficient",
  classification: "Desk 07 · De-confliction Bench",
  lhs: "F_{ab}",
  rhs: "\\round_{2}(\\frac{\\lVert t_{a} - t_{b} \\rVert}{8})",
  condition: "F = \\max F_{ab}",
  parameters: [
    { symbol: "t_{a}", name: "Tolerance vector", domain: "1.0 to 5.0", description: "Default 3.0 on every bond and 4.0 on the party's own bond; an inscribed party reads 3 plus a quarter of leverage minus vulnerability, plus 1 on the limiting bond if it holds a veto." },
    { symbol: "F", name: "Party friction", domain: "0 to 1", description: "The largest pairwise coefficient, published as the asymmetry reading. The engine sets no breach threshold on it." },
  ],
  computedBy: ["asymmetryProof"],
};

export const F_FORUM_E: AcademyFormula = {
  id: "forum-enforceability",
  title: "Base Enforceability of a Venue",
  classification: "Desk 11 · Forum Matrix",
  lhs: "E",
  rhs: "\\round(\\frac{100\\, (0.5\\, T + 0.3\\, (6 - M) + 0.2\\, P)}{5})",
  parameters: [
    { symbol: "T", name: "Teeth", domain: "1 to 5", description: "Strength of the enforcement route." },
    { symbol: "M", name: "Immunity exposure", domain: "1 to 5", description: "Exposure to a sovereign-immunity defence at execution; 5 is most exposed." },
    { symbol: "P", name: "Pace", domain: "1 to 5", description: "Speed of the procedure; 5 is fastest.", threshold: "Seven venues: ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss 68, SIAC 66, ICJ Advisory 46." },
  ],
  statutoryInvariant: "Ratings are doctrinal ordinal judgements, not measured statistics.",
  computedBy: ["enforceability", "FORUMS"],
};

export const F_FORUM_F: AcademyFormula = {
  id: "forum-fitness",
  title: "Venue Fitness and Enforcement Friction",
  classification: "Desk 11 · Forum Matrix",
  lhs: "F",
  rhs: "\\max(0,\\, E - 18\\, \\iota_{imm} - 8\\, \\iota_{seat})",
  condition: "\\text{friction} = 100 - F",
  parameters: [
    { symbol: "\\iota_{imm}", name: "Immunity unaddressed", domain: "0 or 1", description: "1 while the clause leaves sovereign immunity unwaived: an 18-point deduction." },
    { symbol: "\\iota_{seat}", name: "Seat not neutral", domain: "0 or 1", description: "1 when the seat lies in a party's territory: an 8-point deduction." },
  ],
  computedBy: ["forumFitness", "forumProof"],
};

export const F_ESCROW_CHAIN: AcademyFormula = {
  id: "escrow-chain",
  title: "Ordered Tranche Release",
  classification: "Desk 07 · Conditional Escrow Waterfall",
  lhs: "m_{k}",
  rhs: "\\prod_{j=1}^{k} c_{j}",
  condition: "G = \\sum_{k=1}^{4} s_{k}\\, m_{k}",
  parameters: [
    { symbol: "c_{1}", name: "Mobilisation", domain: "0 or 1", description: "Independent verifier seated (default share 25)." },
    { symbol: "c_{2}", name: "Demarcation", domain: "0 or 1", description: "Communal bond above 3.0 (default share 25)." },
    { symbol: "c_{3}", name: "Operational Commissioning", domain: "0 or 1", description: "Institutional bond above 3.0 and track gap within tolerance (default share 30)." },
    { symbol: "c_{4}", name: "Final Cession", domain: "0 or 1", description: "Intergenerational bond above 3.0 and survival at or above 55 per cent (default share 20)." },
  ],
  statutoryInvariant: "A tranche counts as met only when its own condition and every earlier condition hold.",
  computedBy: ["escrowWaterfall"],
};

export const F_ESCROW_CONSERVATION: AcademyFormula = {
  id: "pledge-conservation",
  title: "Pledge Conservation",
  classification: "Desk 07 · Conditional Escrow Waterfall",
  lhs: "\\sum_{k=1}^{4} s_{k}",
  rhs: "100",
  parameters: [
    { symbol: "s_{k}", name: "Tranche share", domain: "0 to 100", description: "Default shares 25, 25, 30 and 20 per cent of the pledge." },
  ],
  statutoryInvariant: "The waterfall reports the pledge as balanced only when the four shares sum to exactly 100.",
  computedBy: ["escrowWaterfall", "DEFAULT_ESCROW"],
};

export const F_ESCROW_RELEASE: AcademyFormula = {
  id: "escrow-release",
  title: "Released Share of the Pledge",
  classification: "Desk 07 · Conditional Escrow Waterfall",
  lhs: "\\text{Released}",
  rhs: "\\cases{0}{\\text{if } R \\ge 60}{G}{\\text{at Final Cession}}{\\max(0,\\, G - K - P)}{\\text{otherwise}}",
  parameters: [
    { symbol: "K", name: "Clawback reserve", domain: "per cent", description: "\\(K = \\frac{G\\, \\kappa}{100}\\), with \\(\\kappa\\) the clawback (default 10)." },
    { symbol: "P", name: "Performance bond", domain: "per cent", description: "\\(P = \\min(\\beta,\\, G - K)\\), with \\(\\beta\\) the bond (default 5)." },
    { symbol: "60", name: "Escrow freeze", domain: "constant", description: "At a rupture index of 60 per cent or more the account is frozen; the freeze cannot be discharged by seating a verifier." },
  ],
  computedBy: ["escrowWaterfall", "escrowProof", "ESCROW_FREEZE"],
};

export const F_DOMINUM: AcademyFormula = {
  id: "dominum-index",
  title: "The Dominum Index",
  classification: "Desk 15 · Mission Readiness",
  lhs: "D",
  rhs: "100 \\times (0.30\\, A + 0.25\\, F + 0.25\\, S + 0.20\\, C)",
  condition: "D \\in [0,\\, 100]",
  parameters: [
    { symbol: "A", name: "Bond anchor", domain: "0 to 1", description: "\\(A = \\frac{\\mu_{B} - 1}{4}\\), from Desk 01." },
    { symbol: "F", name: "Fiduciary anchor", domain: "0 to 1", description: "\\(F = \\frac{E}{100}\\), the escrow share released on Desk 07; zero while the escrow is frozen." },
    { symbol: "S", name: "Succession durability", domain: "0 to 1", description: "\\(S = \\frac{S_{\\%}}{100}\\), from Desk 12." },
    { symbol: "C", name: "Containment", domain: "0 to 1", description: "\\(C = 1 - \\frac{R}{100}\\), from Desk 02.", threshold: "Phases: Imperium-Bound below 40, Fiduciary Anchor 40 to below 60, Custodial Inversion 60 and above, Self-Reinforcing Dominium at 75 and above with every bond above 3.0." },
  ],
  statutoryInvariant: "D is not computed until all four readings exist. It never publishes a signal of its own.",
  computedBy: ["dominumIndex", "dominumProof", "DOMINUM_THRESHOLDS"],
};

export const F_DOMINUM_PHASE: AcademyFormula = {
  id: "dominum-phase",
  title: "Phase of the Dominum Effect",
  classification: "Desk 15 · Mission Readiness",
  lhs: "\\text{Phase}(D)",
  rhs: "\\cases{\\text{Self-Reinforcing Dominium}}{D \\ge 75 \\land B_{i} > 3.0 \\text{ for all } i}{\\text{Custodial Inversion}}{D \\ge 60 \\text{ otherwise}}{\\text{Fiduciary Anchor}}{40 \\le D < 60}{\\text{Imperium-Bound}}{D < 40}",
  parameters: [],
  statutoryInvariant: "The phase rule is applied after rounding D to one decimal. A high index over a bond at or below the floor is recorded as Custodial Inversion.",
  computedBy: ["dominumIndex"],
};

export const F_TRACK: AcademyFormula = {
  id: "track-tolerance",
  title: "Track Lead and Communal Tolerance",
  classification: "Desk 08 · Track Sequencing",
  lhs: "\\tau_{g}",
  rhs: "\\cases{0}{B_{2} \\text{ Failing}}{1}{B_{2} \\text{ Fragile}}{2}{B_{2} \\text{ Viable or Fortified}}",
  condition: "\\text{shear if } d_{I} - d_{II} > \\tau_{g}",
  parameters: [
    { symbol: "d_{I}", name: "Track I depth", domain: "phases", description: "Phases completed on the principals' track." },
    { symbol: "d_{II}", name: "Track II depth", domain: "phases", description: "Phases completed on the communal track." },
  ],
  statutoryInvariant: "A lead beyond tolerance raises the Elite-Pact Mirage alert and holds Escrow Tranche 3.",
  computedBy: ["communalTolerance", "trackShearProof"],
};

export const F_SEAL: AcademyFormula = {
  id: "handover-seal",
  title: "Canonical Handover Seal",
  classification: "Chancellery Wire · Handover Seal",
  lhs: "\\text{Digest}",
  rhs: "\\op{SHA-256}(\\op{CanonicalJSON}(S_{mission}))",
  parameters: [
    { symbol: "S_{mission}", name: "Mission state", domain: "profile, binder, signals, decisions", description: "Serialised with object keys sorted at every depth; the same input always yields the same bytes." },
  ],
  statutoryInvariant: "Sealing proves the integrity of what was hashed, not the truth of its content, and does not replace sovereign ratification.",
  computedBy: ["sealPayload", "canonicalJson", "computeSealHash"],
};

export const F_CONTAGION: AcademyFormula = {
  id: "contagion",
  title: "Relational Contagion Coefficient",
  classification: "Engine · Relational Dynamics",
  lhs: "C_{rel}",
  rhs: "\\min(100,\\, \\frac{100}{4.6} \\cdot \\frac{\\sigma_{B}}{2} (1 + 0.15\\, n_{s})(1 + 0.10\\, n_{f})(1 + \\frac{R}{100})(1 + \\frac{\\Delta_{rel}}{8}))",
  parameters: [
    { symbol: "n_{s}", name: "Active shocks", domain: "count", description: "Shocks on the bus." },
    { symbol: "n_{f}", name: "Friction pairs", domain: "count", description: "Active friction pairs at the table.", threshold: "50 per cent raises an elevated alert; 75 per cent a critical one and a contagion lock." },
  ],
  computedBy: ["relationalDynamics"],
};
