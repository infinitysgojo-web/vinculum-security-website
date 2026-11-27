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
    summary: "Why constructive ambiguity fails modern multilateralism, and how the shift from Imperium to Dominium restores structural dignity across sovereign covenants.",
    chapters: [CHAPTER_1_1, CHAPTER_1_2, CHAPTER_1_3, CHAPTER_1_4],
  },
  {
    id: "divisional-cadence",
    number: "02",
    eyebrow: "Module II · Divisional Architecture",
    title: "The 18 Operational Desks & Divisional Cadence",
    summary: "The operational rhythm of the 18 desks across the four divisions of the dashboard, tracing one signal chain from assessment and early warning, through engagement and legal architecture, to mission governance and handover.",
    chapters: [CHAPTER_2_1, CHAPTER_2_2, CHAPTER_2_3, CHAPTER_2_4],
  },
];
      {
        id: "division-1",
        number: "2.1",
        eyebrow: "Module II · Chapter 2.1",
        title: "Division I (Desks 01–04): Assessment and Early Warning",
        estimatedMinutes: 30,
        executiveLede: "Division I establishes the empirical baseline of tension before any negotiation commences. It scores the four bonds and matches the profile against the documented cases, converts observed warning signs into the Rupture Index, stress-tests the settlement against concurrent shocks, and holds the live theatre beside comparable documented theatres.",
        synopsis: [
          "Desk 01 (Diagnostics) scores the four bonds from 1.0 to 5.0 and publishes the mean, the variance, the limiting bond and its band, and the three nearest documented cases by Euclidean distance. Desk 02 (Sentinel Matrix, The Eye of Humanity) records observed tripwires across the four bonds and reads the Rupture Index and its latent traps.",
          "Desk 03 (Compound Shock) applies several shocks at once, reads the amplified strain and names the first provision to break. Desk 04 (Comparative Mirror) reads two or three documented theatres against one rubric, beside the live vector, as context rather than prescription.",
          "Every reading Division I publishes travels the same bus to every later desk; nothing downstream is computed from a different source.",
        ],
        statutoryNotice: "Statutory Directive: Stage Gate 1 (Vector Integrity) holds until all four bonds sit above the 3.0 viable floor, and Stage Gate 2 (Rupture Containment) holds until the rupture index is measured and, at 35 per cent or more, an independent verifier is seated.",
        learningOutcomes: [
          "Score the four bonds on Desk 01 and read the mean, variance, limiting bond, band and relational standing.",
          "Record tripwires on Desk 02 and read the Rupture Index, its band and the latent traps.",
          "Apply concurrent shocks on Desk 03 and identify the first provision to break.",
          "Use Desk 04 to compare documented theatres without treating resemblance as a forecast."
        ],
        sections: [
          {
            heading: "I. Desk 01: Diagnostics and Pattern Matching",
            subheading: "The Bond Vector and the Nearest Documented Cases",
            paragraphs: [
              "Every mission begins at Desk 01. The analyst scores the Interpersonal, Communal, Intergenerational and Institutional-Relational bonds in steps of 0.1 between 1.0 and 5.0. The desk publishes the mean \\(\\mu_{B}\\) and the population variance, the limiting bond and its band (Failing 1.0 to 2.0, Fragile 2.1 to 3.0, Viable 3.1 to 4.0, Fortified 4.1 to 5.0), the Communal band that sets the track tolerance, and the relational standing.",
              "The desk also measures the Euclidean distance from the live vector to each of the eight documented cases and ranks the three nearest. It flags Facade Syndrome, superficial harmony masking severe rupture, when the variance exceeds 1.25, the strongest bond is at least 4.0 and the weakest is at most 2.0."
            ],
            formulas: [F_STATE_VECTOR, F_MEAN, F_LIEBIG],
            statutoryRule: "Rule 2.1-A: Preset scores are training figures, not field measurements. A nearest case is a mirror, not a template."
          },
          {
            heading: "II. Desk 02: Sentinel Matrix (The Eye of Humanity)",
            subheading: "Observed Warning Signs and the Rupture Index",
            paragraphs: [
              "The Eye of Humanity is the descriptive name of the early-warning desk. The analyst records observed tripwires across the four bonds, sets the observation trend and may add custom indicators with a bond and a severity weight. The desk reads the weighted share present as the Rupture Index, in bands Stable, Guarded, Elevated and Critical at 15, 35 and 60 per cent, and publishes the strain on each bond and any latent traps.",
              "The index reads what the analyst records; it does not observe the theatre, and it is not surveillance or a prediction."
            ],
            formulas: [F_RUPTURE],
            statutoryRule: "Rule 2.1-B: At a rupture index of 35 per cent or more an independent verifier must be seated before the Rupture Containment gate passes."
          },
          {
            heading: "III. Desk 03: Compound Shock and Desk 04: Comparative Mirror",
            subheading: "Concurrent Stress and Cross-Theatre Context",
            paragraphs: [
              "Desk 03 applies several shocks at once (currency collapse, a border incident, a leadership succession) and reads the amplified strain, because concurrent shocks compound rather than add. It names the first provision to break. With two or more shocks active, the Structural Covenants gate requires at least two covenants.",
              "Desk 04 places two or three documented theatres side by side against the same four-bond rubric, optionally plotted beside the live mission vector. Historical resemblance is context; it is never a predicted outcome or a prescription."
            ]
          }
        ],
        quiz: [
          {
            id: "q2-1-1",
            question: "What is the operational purpose of Desk 02 (Sentinel Matrix, The Eye of Humanity)?",
            options: [
              {
                id: "opt-a",
                text: "To calculate tariff schedules for agricultural goods.",
                explanation: "Incorrect. No desk computes tariffs.",
                correct: false
              },
              {
                id: "opt-b",
                text: "To record observed warning signs across the four bonds and read the weighted Rupture Index, its band and the latent traps.",
                explanation: "Correct. Desk 02 is the early-warning desk: a rule-based reading of the tripwires the analyst records, not surveillance or a prediction.",
                correct: true
              },
              {
                id: "opt-c",
                text: "To track social media sentiment during the negotiations.",
                explanation: "Incorrect. The desk reads only what the analyst records; it observes nothing by itself.",
                correct: false
              },
              {
                id: "opt-d",
                text: "To draft press statements for the delegation.",
                explanation: "Incorrect. The UDCA is an analytical apparatus, not a public relations tool.",
                correct: false
              }
            ]
          },
          {
            id: "q2-1-2",
            question: "A vector reads 4.6, 4.4, 4.2 and 1.6. Which Division I reading governs what the relationship can carry?",
            options: [
              {
                id: "opt-a",
                text: "The mean, 3.7, a Contested standing.",
                explanation: "Incorrect. The mean characterises the theatre but never overrides the limiting bond.",
                correct: false
              },
              {
                id: "opt-b",
                text: "The limiting bond, 1.6, in the Failing band.",
                explanation: "Correct. Under the Liebig minimum the weakest bond sets the ceiling, and a Failing bond trips a critical alert.",
                correct: true
              },
              {
                id: "opt-c",
                text: "The strongest bond, 4.6.",
                explanation: "Incorrect. Strength elsewhere cannot compensate for a failing bond.",
                correct: false
              },
              {
                id: "opt-d",
                text: "The nearest documented case.",
                explanation: "Incorrect. A nearest case is context, not a governing reading.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "division-2",
        number: "2.2",
        eyebrow: "Module II · Chapter 2.2",
        title: "Division II (Desks 05–09): Diplomatic Engagement",
        estimatedMinutes: 30,
        executiveLede: "Division II carries the assessment into the room. It composes the chancellery memorandum, prepares ordered examination questions for each counterpart, seats the parties and sets resource and escrow terms, keeps the principals' track and the communal track in step, and audits the safeguards owed to each affected party.",
        synopsis: [
          "Desk 05 (Briefing Desk) assembles a formal memorandum from the documented case record and the analyst's entries. Desk 06 (Counterpart Prompter) walks a meeting phase by phase with ordered examination questions for each counterpart, without inferring any answer.",
          "Desk 07 (De-confliction Bench) seats delegations, reads inter-party friction, sets the three resource heads and runs the Conditional Escrow Waterfall. Desk 08 (Track Sequencing) holds Track I within the tolerance the Communal bond allows. Desk 09 (Field Audit) records the stakeholder safeguard checks for each affected party.",
          "Division II publishes the readings the gates of Division IV will test: the track gap and tolerance, the friction pairs, the escrow release and the resource parity.",
        ],
        statutoryNotice: "Diagnostic Axiom: an accord signed above the communities it governs looks like peace and behaves like a ceasefire. Stage Gate 3 (Track Synchronization) holds while Track I leads beyond the communal tolerance.",
        learningOutcomes: [
          "Compose a chancellery memorandum on Desk 05 from recorded inputs and existing wording.",
          "Prepare ordered, non-leading examination scripts on Desk 06 without inferring counterpart answers.",
          "Seat parties, read friction and set resource and escrow terms on Desk 07.",
          "Apply the communal tolerance rule on Desk 08 and record safeguards on Desk 09."
        ],
        sections: [
          {
            heading: "I. Desk 05: Briefing Desk and Desk 06: Counterpart Prompter",
            subheading: "From Record to Meeting Script",
            paragraphs: [
              "Desk 05 composes a formal memorandum from a documented case or the analyst's own theatre, problem statement and bond scores, with receiving office, instrument, precedence and handling caveat. The text is assembled deterministically from recorded inputs and existing wording; composition is not dispatch.",
              "Desk 06 prepares ordered examination questions for each seated counterpart. Nonblank custom-script lines are treated as ordered questions, and counterpart tactics are read from the shared mission notes. When a counterpart stalls, the operator selects the condition and the desk offers the matching follow-up question; it never infers an answer, advances a phase or clears a gate."
            ]
          },
          {
            heading: "II. Desk 07: De-confliction Bench",
            subheading: "Seating, Friction, Resources and Escrow",
            paragraphs: [
              "The De-confliction Bench seats delegations and reads the friction coefficient of every pair from their tolerance vectors. Named friction pairs feed the contagion coefficient, and a spoiler-coalition warning is raised when two or more pairs are active while the rupture index is 35 or more or the Elite-Pact alert holds.",
              "The bench also sets the three resource heads (a community restitution trust, a cross-border corridor fund, and joint demarcation and monitoring). A communal share below 30 per cent raises a legitimacy deficit. Its Conditional Escrow Waterfall releases four tranches in order on verified bus readings and freezes at a rupture index of 60 or more."
            ],
            formulas: [F_FRICTION, F_ESCROW_CHAIN],
            statutoryRule: "Rule 2.2-A: Resource and escrow figures are design terms, not commitments. The release conditions are read from the bus and never negotiated at the desk."
          },
          {
            heading: "III. Desk 08: Track Sequencing and Desk 09: Field Audit",
            subheading: "Keeping the Tracks in Step and the Affected Parties Heard",
            paragraphs: [
              "Desk 08 records the phases completed on the principals' track and the communal track. The tolerated lead is zero phases when the Communal bond is Failing, one when Fragile and two when Viable or Fortified. A lead beyond tolerance raises the Elite-Pact Mirage alert, fails the Track Synchronization gate and holds Escrow Tranche 3.",
              "Desk 09 records, for each affected party, whether evidence was reviewed, the party heard directly and independent verification recorded. Completion is not certification and never replaces protection obligations."
            ],
            formulas: [F_TRACK]
          }
        ],
        quiz: [
          {
            id: "q2-2-1",
            question: "The Communal bond reads 2.6 (Fragile) and Track I leads Track II by two phases. What does the engine do?",
            options: [
              {
                id: "opt-a",
                text: "Nothing; two phases are always tolerated.",
                explanation: "Incorrect. Two phases are tolerated only when the Communal bond is Viable or Fortified.",
                correct: false
              },
              {
                id: "opt-b",
                text: "It raises the Elite-Pact Mirage alert, fails the Track Synchronization gate and holds Escrow Tranche 3.",
                explanation: "Correct. A Fragile Communal bond tolerates a lead of one phase; a lead of two exceeds it.",
                correct: true
              },
              {
                id: "opt-c",
                text: "It lowers the Communal bond automatically.",
                explanation: "Incorrect. Desks never change another desk's inputs.",
                correct: false
              },
              {
                id: "opt-d",
                text: "It freezes the whole escrow account.",
                explanation: "Incorrect. Only a rupture index of 60 or more freezes the account; the track gap holds Tranche 3.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "division-3",
        number: "2.3",
        eyebrow: "Module II · Chapter 2.3",
        title: "Division III (Desks 10–14): Legal Architecture",
        estimatedMinutes: 35,
        executiveLede: "Division III binds the engagement into enforceable law. It drafts continuity provisions that bind offices rather than officeholders, audits draft clauses and chooses the dispute forum, stress-tests the instrument against succession, prepares the litigation checklist and pleading heads, and rehearses the standing objections of the doctrine's critics.",
        synopsis: [
          "Desk 10 (Clause Architect) turns each chosen fragility into a covenant of record. Desk 11 (Clause Redliner) reads a draft provision against the doctrine's seven recorded failure modes and carries the Dispute Forum Enforceability Matrix across seven venues.",
          "Desk 12 (Succession Simulator) tests the instrument against leadership change, funding loss and capture, publishes the survival score and carries the Decay Horizon. Desk 13 (Legal Desk) fills the pleading heads from the bus, adding a provisional-measures head at a rupture of 40 per cent or more. Desk 14 (Adversarial Chamber) rehearses the objections of record.",
          "Stage Gate 4 (Structural Covenants) and Stage Gate 5 (Succession Durability) are cleared here.",
        ],
        statutoryNotice: "Operational Requirement: at a rupture index of 35 per cent or more an office-continuity provision is mandatory, and survival below the 55 per cent Succession Trap holds the Succession Durability gate.",
        learningOutcomes: [
          "Draft covenants on Desk 10 that bind offices, not officeholders.",
          "Score dispute venues on Desk 11 from teeth, immunity exposure and pace, with the immunity and seat deductions.",
          "Read survival, decay and the fracture window on Desk 12.",
          "Prepare pleading heads on Desk 13 and rehearse the standing objections on Desk 14."
        ],
        sections: [
          {
            heading: "I. Desk 10: Clause Architect and Desk 11: Clause Redliner",
            subheading: "Continuity Provisions and the Dispute Forum",
            paragraphs: [
              "Desk 10 drafts treaty clauses that survive a change of leadership. Each fragility the analyst picks becomes one covenant; the gates count covenants and look for an office-continuity provision. Picking the asymmetric-verification fragility also marks a verifier seated on the bus.",
              "Desk 11 audits a pasted provision against seven recorded failure modes and offers substitute wording, and carries the Forum Matrix. Each venue's base enforceability combines teeth, exposure to an immunity defence and pace on doctrinal ordinal scales: ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss Arbitration Centre 68, SIAC 66 and ICJ Advisory 46. Fitness deducts 18 while immunity is unaddressed and 8 when the seat lies in a party's territory; enforcement friction is the remainder to 100."
            ],
            formulas: [F_FORUM_E, F_FORUM_F],
            statutoryRule: "Rule 2.3-A: Venue ratings are doctrinal ordinal judgements, not legal advice for a particular filing."
          },
          {
            heading: "II. Desk 12: Succession Simulator",
            subheading: "Survival Under Leadership Change, and the Decay Horizon",
            paragraphs: [
              "Desk 12 tests the drafted instrument against succession, funding loss and capture. Provisions in force insulate the shocks they guard against; insulated shocks count at a quarter of their severity. The desk publishes the survival score that Stage Gate 5 and Escrow Tranche 4 read, and the Decay Horizon: the decay constant, the stability half-life and the critical fracture window."
            ],
            formulas: [F_SUCCESSION, F_DECAY]
          },
          {
            heading: "III. Desk 13: Legal Desk and Desk 14: Adversarial Chamber",
            subheading: "Pleading Heads and the Critics of Record",
            paragraphs: [
              "Desk 13 compiles a litigation checklist and fills three standing pleading heads only from the bus: jurisdictional foundation from the dispute forum, substantive breach from the weakest bond, and covenants at risk. At a rupture index of 40 per cent or more it adds a fourth head for provisional measures. A missing input is named as missing.",
              "Desk 14 rehearses the standing objections to the doctrine and the answers of record, each marked answered, partly conceded or held open. The chamber does not score the instrument."
            ]
          }
        ],
        quiz: [
          {
            id: "q2-3-1",
            question: "A PCA clause is drafted with immunity unaddressed and the seat in one party's capital. What is its venue fitness on Desk 11?",
            options: [
              {
                id: "opt-a",
                text: "74",
                explanation: "Incorrect. 74 is the base enforceability before the deductions.",
                correct: false
              },
              {
                id: "opt-b",
                text: "48",
                explanation: "Correct. \\(F = \\max(0,\\, 74 - 18 - 8) = 48\\), and enforcement friction is 52.",
                correct: true
              },
              {
                id: "opt-c",
                text: "56",
                explanation: "Incorrect. Both the immunity and the seat deductions apply.",
                correct: false
              },
              {
                id: "opt-d",
                text: "100",
                explanation: "Incorrect. No venue reaches 100.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "division-4",
        number: "2.4",
        eyebrow: "Module II · Chapter 2.4",
        title: "Division IV (Desks 15–18): Mission Governance and Handover",
        estimatedMinutes: 30,
        executiveLede: "Division IV clears the mission and passes custody on. It audits readiness against the five stage gates and twenty statutory clearances and reads the Dominum Index on Desk 15, seats independent verifiers on Desk 16, tests whether the settlement can stand without the external presence on Desk 17, and binds the staged outputs into a sealed binder on Desk 18.",
        synopsis: [
          "Desk 15 (Mission Readiness) reads five stage gates (Vector Integrity, Rupture Containment, Track Synchronization, Structural Covenants and Succession Durability) and itemises them as twenty statutory clearances, Articles 1.1 to 5.4, read from the live chain. Any failed gate locks the mission disposition. The desk also shows the Dominum Index with its proof.",
          "Desk 16 (Verification Ledger) seats the verifiers and fixes the reporting interval. Desk 17 (Mandate Handover) reads a durability quotient: 80 per cent clears, 60 to 79 is conditional, and each residual dependence on the departing presence costs 7 points. Desk 18 (Mission Binder) compiles the staged documents and mints a SHA-256 apostille over the live signals and tabs.",
          "Alongside the desks, the Chancellery Wire holds the Signal Inspector, the Decision Log and the Handover Seal, each a view of the same bus.",
        ],
        statutoryNotice: "Statutory Mandate: no disposition is cleared while any stage gate fails. Sign-off on the desk is a desk record, not institutional approval, and the apostille proves integrity of what was hashed, not truth of its content.",
        learningOutcomes: [
          "Read the five stage gates and the twenty statutory clearances on Desk 15.",
          "Seat verifiers on Desk 16 and explain which gates and tranches respond.",
          "Read the handover durability quotient on Desk 17.",
          "Compile and seal the mission binder on Desk 18, and distinguish the apostille from the Handover Seal."
        ],
        sections: [
          {
            heading: "I. Desk 15: Mission Readiness and the Dominum Index",
            subheading: "Five Gates, Twenty Clearances",
            paragraphs: [
              "Each stage gate decomposes into four articles. Binding clearances decompose their gate exactly; six advisory clearances (vector cohesion within a spread of 1.5, no latent trap active, communal track opened, no open redline flag, mandate handover viability of 60 per cent or more, and an oversight body named) are recorded on the schedule and the attestation but never lock the mission.",
              "The Dominum Index is shown on the same desk once the bond vector, the escrow release, the succession survival and the rupture index are all on the bus."
            ],
            formulas: [F_DOMINUM],
            statutoryRule: "Rule 2.4-A: The stage gate audit is the sole authority on locks; the clearance schedule only itemises it."
          },
          {
            heading: "II. Desk 16: Verification Ledger and Desk 17: Mandate Handover",
            subheading: "Independent Verification and Durability Without the Mission",
            paragraphs: [
              "Seating an independent verifier on Desk 16 satisfies the Rupture Containment gate while the rupture index is 35 or more, releases the independent-verifier lock and meets the Mobilisation condition of the escrow. Seating records a design choice; it does not appoint anyone.",
              "Desk 17 tests whether the settlement has taken root locally before the external presence departs. Handover is withheld while any critical test is open, and the successor office is named as the oversight body."
            ]
          },
          {
            heading: "III. Desk 18: Mission Binder and the Chancellery Wire",
            subheading: "Apostille, Decision Log and Handover Seal",
            paragraphs: [
              "Desk 18 compiles the staged outputs into one numbered binder and seals it with a SHA-256 apostille over the canonical JSON of the signals and tabs; the seal is marked superseded if anything changes after sealing.",
              "The Chancellery Wire carries the Decision Log, an append-only view of the ledger with UTC timestamps, and the Handover Seal, which hashes the active mission and lists the exact parameters that moved when it diverges."
            ],
            formulas: [F_SEAL]
          }
        ],
        quiz: [
          {
            id: "q2-4-1",
            question: "What occurs if a bond score inside a sealed mission is changed after the Handover Seal was taken?",
            options: [
              {
                id: "opt-a",
                text: "The application deletes all local session data.",
                explanation: "Incorrect. The UDCA never erases records on detecting a change; unreadable records are quarantined, not erased.",
                correct: false
              },
              {
                id: "opt-b",
                text: "The seal silently recomputes and accepts the new value.",
                explanation: "Incorrect. Silent acceptance would defeat the purpose of tamper evidence.",
                correct: false
              },
              {
                id: "opt-c",
                text: "The recomputed digest no longer matches, a divergence is shown with the exact parameters that moved, and any reseal leaves the break on the Decision Log.",
                explanation: "Correct. The SHA-256 digest of the canonical state changes with any edit, and the divergence is surfaced, not hidden.",
                correct: true
              },
              {
                id: "opt-d",
                text: "The browser sends an alert to an external security server.",
                explanation: "Incorrect. The UDCA is browser-local and contacts no server.",
                correct: false
              }
            ]
          }
        ]
      }
    ]
  }
];
