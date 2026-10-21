/**
 * Preset Proving Ground: versioned, read-only scenario packages, desk guides and
 * checkpoints. A scenario carries only what the dashboard already supports: a theatre
 * preset from theatres.ts (its bond vector, profile and desk seeds), a real desk
 * sequence, instructional notes, checkpoints that read the live bus, and the signal
 * relationships the existing formulas define. No outcome is predicted or graded.
 */
import { stageGateAudit, bondBand, VIABLE_FLOOR, SUCCESSION_TRAP, type Signals } from "@/components/desk/engine";
import { ESCROW_FREEZE, IMMUNITY_PENALTY, SEAT_PENALTY, PROVISIONAL_THRESHOLD, CESSION_SURVIVAL } from "@/components/desk/instruments";
import { THEATRES, type TheatreId } from "@/components/desk/theatres";
import type { Workspace } from "./workspace";

/** Bumped when the package format changes; packages from another format do not load. */
export const SCENARIO_FORMAT = 1;

export type Difficulty = "Foundation" | "Practitioner" | "Red-Team";

export type Category =
  | "Covenant drafting"
  | "Forum and enforceability"
  | "Staged escrow"
  | "Compound shocks"
  | "Succession and relational decay"
  | "Adversarial review"
  | "Handover";

export const CATEGORIES: Category[] = [
  "Covenant drafting",
  "Forum and enforceability",
  "Staged escrow",
  "Compound shocks",
  "Succession and relational decay",
  "Adversarial review",
  "Handover",
];

export type Checkpoint = {
  id: string;
  desk: string;
  question: string;
  /** The real reading the question is about, read from the bus at the moment it is shown. */
  observe: (s: Signals) => string;
  explain: string;
};

export type Scenario = {
  id: string;
  version: number;
  format: number;
  title: string;
  category: Category;
  difficulty: Difficulty;
  purpose: string;
  trains: string;
  theatre: TheatreId;
  /** Real dashboard desk ids, in the order the exercise walks them. */
  sequence: string[];
  notes: string[];
  relationships: string[];
  checkpoints: Checkpoint[];
};

const weakest = (s: Signals) =>
  s.weakestBond && s.weakestScore !== undefined ? `${s.weakestBond} at ${s.weakestScore.toFixed(1)} (${bondBand(s.weakestScore)})` : "not on the bus";
const gate = (s: Signals, name: string) => {
  const g = stageGateAudit(s).gates.find((x) => x.name === name);
  return g ? `${g.passed ? "Passing" : "Holding"}: ${g.reading}` : "not evaluated";
};

const R_FLOOR = `Any bond at or below the ${VIABLE_FLOOR.toFixed(1)} viable floor holds the Vector Integrity gate; exactly ${VIABLE_FLOOR.toFixed(1)} is a breach.`;
const R_VERIFIER = "A rupture index of 35% or more requires an independent verifier seated (Rupture Containment gate).";
const R_COVENANTS = "Two or more compound shocks, or a Failing weakest bond, require at least two covenants (Structural Covenants gate).";
const R_SURVIVAL = `Treaty survival below ${SUCCESSION_TRAP}% holds the Succession Durability gate.`;

export const SCENARIOS: Scenario[] = [
  {
    id: "covenant-failing-bond",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Covenants against a failing communal bond",
    category: "Covenant drafting",
    difficulty: "Foundation",
    purpose: "Draft covenants that answer the limiting bond and the rupture reading, then watch the stage gates respond.",
    trains: "Reading the limiting bond, choosing fragilities to insulate against, and how covenants clear the Structural Covenants gate.",
    theatre: "GREAT_LAKES",
    sequence: ["diagnostics", "sentinel", "clauses", "redliner", "readiness"],
    notes: [
      "The preset bond vector and desk seeds are illustrative training figures, not field measurements.",
      "Clause Architect publishes the fragilities you pick as covenants; picking the Asymmetric verification fragility also marks a verifier seated on the bus.",
    ],
    relationships: [R_FLOOR, R_COVENANTS, R_VERIFIER, "An office-continuity covenant is required once the rupture index is 35% or higher."],
    checkpoints: [
      {
        id: "cfb-1",
        desk: "diagnostics",
        question: "Which bond limits this theatre, and which band does it fall in?",
        observe: (s) => `Weakest bond: ${weakest(s)}.`,
        explain: "The limiting bond is the minimum of the four. Bands: 1.0 to 2.0 Failing, 2.1 to 3.0 Fragile, 3.1 to 4.0 Viable, 4.1 to 5.0 Fortified.",
      },
      {
        id: "cfb-2",
        desk: "clauses",
        question: "How many covenants does the Structural Covenants gate require here, and is it met?",
        observe: (s) => gate(s, "Structural Covenants"),
        explain: R_COVENANTS + " With rupture at 35% or more, one covenant must address office continuity.",
      },
    ],
  },
  {
    id: "forum-friction",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Forum choice and enforcement friction",
    category: "Forum and enforceability",
    difficulty: "Practitioner",
    purpose: "Compare dispute venues on the Forum Matrix and see how immunity and seat terms move enforcement friction.",
    trains: "Venue fitness, the immunity waiver, seat neutrality, and how the chosen forum reaches the Pleadings Bench.",
    theatre: "HORN_AFRICA",
    sequence: ["diagnostics", "redliner", "legal"],
    notes: [
      "Forum ratings are doctrinal ordinal judgements on a 1 to 5 scale, not measured statistics.",
      "The Legal Desk reads the dispute forum from the bus when it is set.",
    ],
    relationships: [
      `Venue fitness F = E − ${IMMUNITY_PENALTY} while immunity is unaddressed − ${SEAT_PENALTY} when the seat is not neutral, floored at 0.`,
      "Enforcement friction = 100 − F.",
      `The provisional measures head is drafted when the rupture index is at or above ${PROVISIONAL_THRESHOLD}%.`,
    ],
    checkpoints: [
      {
        id: "ff-1",
        desk: "redliner",
        question: "What is the enforcement friction of the selected venue, and what would the immunity waiver change?",
        observe: (s) =>
          s.disputeForum
            ? `${s.disputeForum}: fitness ${s.activeForumScore ?? "?"}, friction ${s.enforcementFriction ?? "?"}; immunity ${s.immunityWaived ? "waived" : "unaddressed"}, seat ${s.neutralSeat ? "neutral" : "not neutral"}.`
            : "No dispute forum on the bus yet.",
        explain: `Unaddressed immunity deducts ${IMMUNITY_PENALTY} points from venue fitness; friction is 100 minus fitness, so the waiver lowers friction by up to ${IMMUNITY_PENALTY}.`,
      },
    ],
  },
  {
    id: "escrow-staged",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Staged escrow on verified conditions",
    category: "Staged escrow",
    difficulty: "Practitioner",
    purpose: "Follow the four escrow tranches as verifier, bond and track readings change upstream.",
    trains: "Why a tranche releases only when its own condition and every earlier one holds, and when the account freezes.",
    theatre: "COLOMBIA_ANDES",
    sequence: ["diagnostics", "sentinel", "tracks", "verification", "succession", "multiparty"],
    notes: ["The escrow waterfall sits on the De-confliction Bench and reads verifier, bond, track and survival readings from the bus."],
    relationships: [
      "Tranche 1 needs an independent verifier seated; Tranche 2 the communal bond above 3.0; Tranche 3 the institutional bond above 3.0 and the track gap within tolerance.",
      `Tranche 4 (Final Cession) needs the intergenerational bond above 3.0 and survival at or above ${CESSION_SURVIVAL}%.`,
      `While the rupture index is ${ESCROW_FREEZE}% or more, the whole account is frozen.`,
    ],
    checkpoints: [
      {
        id: "es-1",
        desk: "multiparty",
        question: "How many tranches are met, and is the account frozen?",
        observe: (s) =>
          s.escrowTranchesMet !== undefined
            ? `${s.escrowTranchesMet} of 4 tranches met; ${s.escrowFrozen ? "account frozen" : `${s.escrowReleasedPercent ?? 0}% released`}; rupture ${s.rupture ?? "not measured"}%.`
            : "The escrow reading is not on the bus yet. Open the De-confliction Bench.",
        explain: "Tranches are met in order: a later tranche cannot be met while an earlier one is not, whatever its own condition reads.",
      },
    ],
  },
  {
    id: "compound-first-break",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Compound shocks and the first provision to break",
    category: "Compound shocks",
    difficulty: "Practitioner",
    purpose: "Apply concurrent shocks, read the amplified strain, and draft enough covenants to absorb them.",
    trains: "Shock packages, the first provision to break, and the two-covenant rule under compound shock.",
    theatre: "HORN_AFRICA",
    sequence: ["diagnostics", "compound", "clauses", "readiness"],
    notes: ["Shock severities and breakers are the Compound Shock desk's own table, applied as rules to the inputs."],
    relationships: [R_COVENANTS, "Two or more active shocks add a lock until at least two covenants are carried."],
    checkpoints: [
      {
        id: "cs-1",
        desk: "compound",
        question: "Which provision breaks first under the active shocks?",
        observe: (s) => ((s.shocks?.length ?? 0) > 0 ? `${s.shocks!.length} shocks active; first to break: ${s.firstToBreak || "none named"}; strain ${s.shockSeverity ?? "?"}.` : "No shocks active."),
        explain: "The first provision to break is the breaker of the shock that strikes hardest on the bond it rests on.",
      },
    ],
  },
  {
    id: "succession-decay",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Succession stress and relational decay",
    category: "Succession and relational decay",
    difficulty: "Practitioner",
    purpose: "Stress a mature accord against leadership change and read survival, decay and the fracture window.",
    trains: "Survival under succession stress, the decay constant λ, the stability half-life and the critical fracture window.",
    theatre: "NORTHERN_IRELAND",
    sequence: ["diagnostics", "sentinel", "clauses", "succession"],
    notes: ["Decay and fracture figures are rules applied to the inputs, not forecasts of events."],
    relationships: [
      R_SURVIVAL,
      "λ = (U + R) ÷ 2000, t½ = ln 2 ÷ λ days, B(t) = max(1.0, B₀ · e^(−λt)).",
      "Fracture window t_f = ln(meanBond ÷ 2.0) ÷ λ days.",
    ],
    checkpoints: [
      {
        id: "sd-1",
        desk: "succession",
        question: "Does treaty survival clear the succession trap?",
        observe: (s) => gate(s, "Succession Durability"),
        explain: `Survival below ${SUCCESSION_TRAP}% holds the gate. Close the first failing provision to lift it.`,
      },
      {
        id: "sd-2",
        desk: "succession",
        question: "What decay constant and half-life does the current reading give?",
        observe: (s) => (s.decayConstant ? `λ ${s.decayConstant} per day; half-life ${s.stabilityHalfLifeDays ?? "?"} days; fracture window ${s.fractureMonths ?? "?"} months (${s.fractureSeverity || "unbanded"}).` : "No decay reading on the bus yet."),
        explain: "λ rises with unmitigated shock exposure and the rupture index, so insulating shocks or lowering rupture lengthens the half-life.",
      },
    ],
  },
  {
    id: "adversarial-redteam",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Red-team review of a drafted instrument",
    category: "Adversarial review",
    difficulty: "Red-Team",
    purpose: "Draft, stress, and then put the instrument before the standing objections of record.",
    trains: "Reading the instrument through its critics, and separating answered, conceded and open objections.",
    theatre: "MINDANAO_BARMM",
    sequence: ["diagnostics", "clauses", "succession", "adversarial"],
    notes: ["The Adversarial Chamber marks each answer as answered, partly conceded or held open; it does not score the instrument."],
    relationships: [R_SURVIVAL, R_COVENANTS],
    checkpoints: [
      {
        id: "ar-1",
        desk: "adversarial",
        question: "Before reading the panels: which stage gates still hold this mission?",
        observe: (s) => {
          const held = stageGateAudit(s).gates.filter((g) => !g.passed).map((g) => g.name);
          return held.length ? `Holding: ${held.join(", ")}.` : "All five stage gates pass.";
        },
        explain: "A critic will start where the audit holds. The five stage gates are read from the bus on every desk.",
      },
    ],
  },
  {
    id: "handover-durability",
    version: 1,
    format: SCENARIO_FORMAT,
    title: "Handover durability and the binder",
    category: "Handover",
    difficulty: "Foundation",
    purpose: "Clear readiness, seat verifiers, test handover durability and compile the binder.",
    trains: "Critical handover tests, residual dependence, the durability quotient and compiling a binder from desk outputs.",
    theatre: "MINDANAO_BARMM",
    sequence: ["readiness", "verification", "handover", "binder"],
    notes: ["Each residual dependence ticked on the Mandate Handover desk deducts 7 points from durability."],
    relationships: [
      "Handover is withheld while any critical test is open; 80% or more clears it, 60% to 79% is conditional.",
      R_VERIFIER,
    ],
    checkpoints: [
      {
        id: "hd-1",
        desk: "handover",
        question: "What durability quotient and band does the handover read?",
        observe: (s) => (s.handoverViability !== undefined ? `Durability ${s.handoverViability}% · ${s.handoverBand ?? ""}.` : "Not on the bus yet. Open Mandate Handover."),
        explain: "Durability is the weighted share of cleared tests minus 7 points per residual dependence; an open critical test withholds handover whatever the figure.",
      },
    ],
  },
];

export const scenarioById = (id?: string) => SCENARIOS.find((s) => s.id === id);
export const theatreForScenario = (s: Scenario) => THEATRES.find((t) => t.id === s.theatre);

/** A package loads only when its format matches and every desk it names exists. */
export function scenarioCompatible(s: Scenario, deskIds: readonly string[]): { ok: boolean; reason?: string } {
  if (s.format !== SCENARIO_FORMAT) return { ok: false, reason: `Package format ${s.format} is not supported by this build.` };
  const missing = s.sequence.filter((d) => !deskIds.includes(d));
  if (missing.length) return { ok: false, reason: `Unknown desk${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}.` };
  if (!theatreForScenario(s)) return { ok: false, reason: "Its theatre preset is not in this build." };
  return { ok: true };
}

/* ------------------------------------------------------------------ */
/* Guided desk layer                                                   */
/* ------------------------------------------------------------------ */

export type DeskGuide = { purpose: string; do: string[]; expect: string[]; why: string; handsOff: string[] };

/** Only real controls and real readings of each desk. */
export const DESK_GUIDES: Record<string, DeskGuide> = {
  diagnostics: {
    purpose: "Score the four relational bonds and read the state vector.",
    do: ["Move the four bond sliders (1.0 to 5.0 in 0.1 steps).", "Optionally seed the scores from a profile with the seed control.", "Try the Delta Simulator, then apply it to the baseline only if you mean to."],
    expect: ["Mean, variance, limiting bond and band on the bus.", "The three nearest documented cases by Euclidean distance.", "Stage gate 1 (Vector Integrity) reacting to every bond at or below 3.0."],
    why: "Mean and population variance of the four scores; distance d = √Σ(bᵢ − cᵢ)² to each canonical case; resonance R = (1 − d ÷ 8) × 100.",
    handsOff: ["Preset scores are training figures, not field measurements.", "A nearest case is a mirror, not a template."],
  },
  sentinel: {
    purpose: "Record observed warning signs and read the rupture index.",
    do: ["Tick tripwires, or mark the weakest-bond tripwires in one click.", "Set the observation trend.", "Filter tripwires, or add a custom indicator with its bond and severity weight."],
    expect: ["Rupture index and band on the bus.", "Strain per bond and any latent traps.", "Trend multiplier 0.85, 1.00 or 1.15 applied to the index."],
    why: "Weighted tripwire strain across the bonds, multiplied by the trend factor and capped at 100%.",
    handsOff: ["The index reads what you record; it does not observe the theatre."],
  },
  compound: {
    purpose: "Apply several shocks at once and find the first provision to break.",
    do: ["Tick shocks, or apply a shock package preset.", "Add and apply a shock of your own with its bond and severity."],
    expect: ["Active shocks, first provision to break and compound strain on the bus.", "With two or more shocks, the two-covenant requirement on the Structural Covenants gate."],
    why: "Each shock strikes one bond with its own severity; concurrent shocks amplify strain.",
    handsOff: ["Shock severities are the desk's own table, not probabilities."],
  },
  clauses: {
    purpose: "Draft continuity provisions that bind offices, not officeholders.",
    do: ["Choose the agreement type and enforcement posture.", "Tick the fragilities to insulate against.", "Optionally add a clause requirement of your own."],
    expect: ["Covenants of record on the bus.", "Picking the Asymmetric verification fragility marks a verifier seated on the bus.", "Structural Covenants and Rupture Containment gates reacting."],
    why: "Each picked fragility becomes one covenant; the gates count covenants and look for an office-continuity provision.",
    handsOff: ["The preview is drafting text for review, not an executed instrument."],
  },
  redliner: {
    purpose: "Audit a draft provision and choose the dispute forum.",
    do: ["Paste or pick a sample clause.", "Select a venue on the Forum Matrix.", "Set the immunity waiver and seat neutrality terms."],
    expect: ["Redline flag count on the bus.", "Dispute forum, venue fitness and enforcement friction on the bus."],
    why: `Fitness F = E − ${IMMUNITY_PENALTY} (immunity unaddressed) − ${SEAT_PENALTY} (seat not neutral); friction = 100 − F.`,
    handsOff: ["Venue ratings are doctrinal ordinal judgements, not legal advice for a filing."],
  },
  succession: {
    purpose: "Stress the drafted instrument against succession, funding loss and capture.",
    do: ["Tick the provisions actually in the draft.", "Tick the shocks to apply, or add your own.", "Choose the projection horizon."],
    expect: ["Survival score on the bus.", "Decay constant, half-life and critical fracture window.", "Succession Durability gate reacting at 55%."],
    why: "λ = (U + R) ÷ 2000; t½ = ln 2 ÷ λ; t_f = ln(meanBond ÷ 2.0) ÷ λ.",
    handsOff: ["Decay and fracture figures are rules applied to the inputs, not forecasts."],
  },
  legal: {
    purpose: "Prepare a litigation checklist and the doctrinal pleading heads.",
    do: ["Enter the matter caption, facts and procedural posture.", "Choose the primary strained bond and counterpart posture."],
    expect: ["Four pleading heads filled from the bus; a missing input is named as missing.", `Provisional measures marked urgent at rupture ${PROVISIONAL_THRESHOLD}% or more.`],
    why: "Heads are filled only from the dispute forum, weakest bond, covenants and rupture on the bus.",
    handsOff: ["Admissibility notes are doctrinal summaries, not advice for a particular filing."],
  },
  readiness: {
    purpose: "Clear the mission against the protection and verification gates.",
    do: ["Name the mission.", "Read the statutory clearances and active locks.", "Mint a readiness minute or sign off the mission when the gates allow."],
    expect: ["Lifecycle stages cleared on the bus.", "Twenty statutory clearances, Articles 1.1 to 5.4, read from the live chain."],
    why: "Every clearance is a rule on the bus readings; any failed stage gate locks the disposition.",
    handsOff: ["Sign-off here is a desk record, not institutional approval."],
  },
  verification: {
    purpose: "Seat independent verifiers and read compliance.",
    do: ["Tick the verifiers seated.", "Tick obligations met.", "Choose the reporting interval."],
    expect: ["Verifier seated on the bus, releasing the independent-verifier lock.", "Escrow Tranche 1 condition met downstream."],
    why: "A seated verifier satisfies the Rupture Containment gate while the rupture index is 35% or more.",
    handsOff: ["Seating a verifier here records a design choice; it does not appoint anyone."],
  },
  handover: {
    purpose: "Test whether the settlement can stand without the external presence.",
    do: ["Tick the handover tests cleared.", "Tick any residual dependence on the departing presence.", "Name the successor office."],
    expect: ["Durability quotient and band on the bus.", "Handover withheld while any critical test is open."],
    why: "Durability = weighted share of cleared tests − 7 per residual dependence; 80% clears, 60% to 79% is conditional.",
    handsOff: ["The band is a desk reading, not a decision to depart."],
  },
  binder: {
    purpose: "Compile staged desk outputs into one numbered binder.",
    do: ["Reorder or remove tabs.", "Copy the compiled binder, mint a dossier reference, or seal and mint the chancellery apostille."],
    expect: ["A SHA-256 apostille over the live signals and tabs.", "The seal marked superseded if anything changes after sealing."],
    why: "Canonical JSON of the signals and tabs, hashed with Web Crypto SHA-256 in this browser.",
    handsOff: ["The apostille proves integrity of what was hashed, not truth of its content."],
  },
  tracks: {
    purpose: "Keep the principals' track and the communal track in step.",
    do: ["Tick phases done on each track.", "Use a sequence preset, or reset the sequence."],
    expect: ["Track I and II depth, track gap and tolerance on the bus.", "The Elite-Pact alert when the gap exceeds tolerance."],
    why: "Tolerance is 0 phases when the communal bond is Failing, 1 when Fragile, 2 when Viable or Fortified.",
    handsOff: ["Phases are recorded by you; the desk does not observe talks."],
  },
  multiparty: {
    purpose: "Seat parties, read friction, and set resource shares and escrow terms.",
    do: ["Seat up to four parties and set their friction.", "Set the three resource heads.", "Adjust escrow tranche shares, clawback and performance bond."],
    expect: ["Seated parties and friction pairs on the bus.", "Resource parity and the communal-share legitimacy check.", "Escrow tranches met, released share and freeze state."],
    why: `Tranches release in order on verified conditions; the account freezes at rupture ${ESCROW_FREEZE}% or more.`,
    handsOff: ["Resource and escrow figures are design terms, not commitments."],
  },
  adversarial: {
    purpose: "Rehearse the standing objections and the answers of record.",
    do: ["Filter by verdict.", "Choose a review panel.", "Open each question to read its answer."],
    expect: ["Each answer marked answered, partly conceded or held open."],
    why: "The doctrine names its critics in advance; the chamber reads the live telemetry beside them.",
    handsOff: ["The chamber does not score your instrument."],
  },
};

/* ------------------------------------------------------------------ */
/* Mission Spine                                                       */
/* ------------------------------------------------------------------ */

export type SpineStage = { id: string; label: string; desks: string[]; shell?: "warrant" | "decisions" };

/** Orientation over the real 18-desk order. Warrant and Decision Record open shell panels. */
export const SPINE: SpineStage[] = [
  { id: "warrant", label: "Warrant / Brief", desks: [], shell: "warrant" },
  { id: "baseline", label: "Baseline", desks: ["diagnostics", "sentinel", "mirror"] },
  { id: "design", label: "Design", desks: ["briefing", "counterpart", "multiparty", "tracks", "audit", "clauses", "redliner"] },
  { id: "stress", label: "Stress", desks: ["compound", "succession", "adversarial"] },
  { id: "legal", label: "Legal Posture", desks: ["legal", "readiness", "verification"] },
  { id: "decisions", label: "Decision Record", desks: [], shell: "decisions" },
  { id: "handover", label: "Handover", desks: ["handover", "binder"] },
];

export type StageStatus = { publishing: number; publishable: number; text: string };

/**
 * Truthful stage reading: how many of the stage's desks currently publish their own
 * telemetry on the bus. Visiting a desk never counts; nothing is called approved.
 */
export function stageStatus(stage: SpineStage, live: (desk: string) => boolean, canPublish: (desk: string) => boolean, ws?: Workspace): StageStatus {
  if (stage.shell === "warrant") {
    if (!ws) return { publishing: 0, publishable: 0, text: "No workspace" };
    if (ws.mode === "preset") return { publishing: 0, publishable: 0, text: "Scenario brief" };
    const w = ws.warrant;
    const filled = w ? Object.values(w).filter((v) => typeof v === "string" && v.trim()).length : 0;
    return { publishing: filled, publishable: 7, text: `${filled} of 7 fields recorded` };
  }
  if (stage.shell === "decisions") {
    const n = ws?.decisions.filter((d) => d.status === "active").length ?? 0;
    return { publishing: n, publishable: 0, text: `${n} active decision${n === 1 ? "" : "s"}` };
  }
  const pub = stage.desks.filter(canPublish);
  const on = pub.filter(live).length;
  return { publishing: on, publishable: pub.length, text: pub.length ? `${on} of ${pub.length} desks publishing` : "No bus output" };
}
