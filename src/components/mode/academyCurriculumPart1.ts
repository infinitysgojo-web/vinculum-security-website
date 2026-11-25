import type { DetailedAcademyModule } from "./academyTypes";
import {
  F_DECAY,
  F_DOMINUM,
  F_DOMINUM_PHASE,
  F_ESCROW_CHAIN,
  F_FORUM_E,
  F_FORUM_F,
  F_FRICTION,
  F_LIEBIG,
  F_MEAN,
  F_RUPTURE,
  F_SEAL,
  F_STATE_VECTOR,
  F_SUCCESSION,
  F_TRACK,
} from "./academyFormulas";

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
    chapters: [
      {
        id: "death-of-ambiguity",
        number: "1.1",
        eyebrow: "Module I · Chapter 1.1",
        title: "The Fallacy of Constructive Ambiguity in Sovereign Statecraft",
        estimatedMinutes: 25,
        executiveLede: "For over a century, diplomatic practice relied on constructive ambiguity: intentionally vague treaty language that allowed opposing parties to sign an agreement while retaining contradictory interpretations. In modern asymmetric statecraft, digital sovereignty, and cross-border resource covenants, constructive ambiguity is no longer a diplomatic virtue; it is an active vulnerability that guarantees post-hoc divergence and treaty rupture.",
        synopsis: [
          "When crisis strikes, ambiguous clauses do not foster compromise. They become the fault line along which covenants rupture: the stronger party exploits the ambiguity to justify unilateral action, while the vulnerable party suffers institutional erosion.",
          "The Unified Deterministic Chancellery Apparatus (UDCA) rejects linguistic elasticity. In its place it introduces Relational Determinism: statecraft defined not by aspirational rhetoric but by quantifiable, verifiable structural thresholds.",
        ],
        statutoryNotice: "Statutory Invariant: Ambiguity is the mathematical precursor to treaty rupture. If an enforcement obligation cannot be computed, audited, or falsified, it does not exist as sovereign law.",
        learningOutcomes: [
          "Deconstruct the historical reliance on diplomatic vagueness in twentieth-century accords.",
          "Identify how asymmetric leverage converts linguistic ambiguity into unilateral exploitation.",
          "Apply Relational Determinism to replace aspirational clauses with verifiable thresholds.",
          "Master the Chancellery protocol for auditing covenant texts prior to sovereign ratification."
        ],
        sections: [
          {
            heading: "I. The Historical Genesis of Constructive Ambiguity",
            subheading: "Linguistic Compromise as an Instrument of Postponed Conflict",
            paragraphs: [
              "In classical diplomacy, the mandate of the plenipotentiary was often measured by the achievement of a signed instrument rather than the long-term structural viability of the underlying covenants. When bilateral negotiations reached an impasse over foundational questions such as territorial borders, sovereign resource ownership, or mutual security guarantees, negotiators frequently resorted to what Lord Caradon famously termed constructive ambiguity. This practice entails the deliberate drafting of treaty provisions that permit competing sovereign entities to extract divergent, mutually incompatible legal interpretations from the exact same text.",
              "The underlying assumption of constructive ambiguity was that the passage of time, accompanied by economic trade and normal diplomatic intercourse, would naturally soften ideological rivalries and reconcile conflicting parties. This assumption has been repeatedly disproven by modern geopolitical history. Rather than fostering trust, linguistic elasticity creates a latent constitutional fissure. While both sides celebrate a diplomatic triumph in domestic communiqués, each party begins acting on its own subjective interpretation of the accord.",
              "As soon as an exogenous shock occurs (such as economic stagnation, leadership succession, natural resource depletion, or military realignment), the latent divergence becomes an active crisis. The stronger party inevitably enforces its preferred reading through coercive economic pressure or military mobilization, while the vulnerable party feels betrayed, claiming bad faith and unilateral breach. Consequently, constructive ambiguity does not prevent war; it merely schedules it for a later date under conditions of increased cynicism and diminished structural trust."
            ],
            caseStudy: {
              title: "The Structural Autopsy of United Nations Security Council Resolution 242 (1967)",
              jurisdiction: "International Multilateral Accord / Middle East Theatre",
              precedent: "The deliberate omission of the definite article in treaty provisions",
              analysis: [
                "Following the Six-Day War of June 1967, diplomats drafted Resolution 242 to establish a framework for enduring peace. The English text called for the 'withdrawal of Israel armed forces from territories occupied in the recent conflict,' deliberately omitting the definite article 'the' before 'territories'. Conversely, the French text specified 'retrait des forces armées israéliennes des territoires occupés', which linguistically required total evacuation of all occupied lands.",
                "Diplomats lauded this textual discrepancy as a masterstroke of constructive ambiguity that allowed all parties to vote in favor of the resolution. Yet over the subsequent six decades, this deliberate vagueness became the primary legal weapon in perpetual regional deadlock. One party argued that withdrawal was required only from a portion of the territories to secure defensible borders, while the opposing parties asserted that complete withdrawal was an unconditional prerequisite.",
                "Because the resolution contained no deterministic boundary coordinates, no phased schedule, and no objective verification mechanism, the treaty lacked operational enforceability. Ambiguity ensured that peace was forever postponed."
              ],
              failureMechanism: "The substitution of linguistic evasion for objective demarcation guaranteed sixty years of legal warfare and mutual recrimination."
            }
          },
          {
            heading: "II. The Mechanics of Relational Determinism",
            subheading: "Replacing Aspirational Rhetoric with Falsifiable Invariants",
            paragraphs: [
              "The Unified Deterministic Chancellery Apparatus (UDCA) departs radically from the tradition of diplomatic vagueness. In its place, the Vinculum Security Doctrine establishes the principle of Relational Determinism. Under Relational Determinism, every sovereign agreement is treated as a physical structure governed by immutable stress limits, load capacities, and conservation laws.",
              "Relational Determinism requires that every treaty obligation be expressed in terms that are mathematically falsifiable. If an accord mandates that a signatory reduce military forces within a border corridor, the agreement must not state that forces shall be reduced to 'reasonable or defensive levels'. Instead, the covenant must stipulate exact Euclidean geographic coordinates, precise numerical ceilings, verified sensor telemetry, and an automated suspension of benefits if those parameters are breached.",
              "By eliminating linguistic latitude, the UDCA protects both parties. The weaker party is insulated from the unilateral reinterpretations of an aggressive neighbor, while the stronger party is provided with verifiable proof of compliance that cannot be undermined by bad-faith accusations. Statecraft is thereby elevated from rhetorical persuasion to rigorous relational engineering."
            ],
            statutoryRule: "Rule 1.1-A: Any treaty clause containing subjective adjectives ('reasonable', 'proportional', 'timely', 'equitable') that lacks a companion mathematical definition or verifiable metric is classified as an Unresolved Breach Risk."
          },
          {
            heading: "III. The Five Invariants of Sovereign Drafting",
            subheading: "Custodial Requirements for Permanent Accords",
            paragraphs: [
              "To ensure that sovereign instruments withstand generational transitions and political turnover, the Chancellery mandates adherence to five statutory drafting invariants:",
              "1. Dimensional Coordinate Grounding: Every geographic, maritime, or airspace boundary must be tied to invariant physical reference markers and high-precision geodesic coordinates, with zero tolerance for subjective riparian or shifting natural descriptors.",
              "2. Explicit Verification Triggers: Every concession or resource transfer must be tethered to an auditable escrow trigger, ensuring that assets are released only after independent verification of prerequisite milestones.",
              "3. Universal Divergence Detection: The text and data schemas of all mission agreements must be canonically serialized and cryptographically hashed. Any subsequent alteration of a single word, comma, or parameter immediately registers as a divergence breach.",
              "4. Proportional Rupture Modeling: Treaties must incorporate automated contingency models that forecast how exogenous stress (such as currency volatility or trade blockades) impacts the viability of the covenant.",
              "5. Non-Retroactive Integrity: Amendments or adjustments must be recorded as append-only revisions with unambiguous UTC timestamps, preserving the complete provenance of all prior agreements."
            ]
          }
        ],
        quiz: [
          {
            id: "q1-1-1",
            question: "Why does the Vinculum Security Doctrine classify 'constructive ambiguity' as an active vulnerability rather than a diplomatic virtue?",
            options: [
              {
                id: "opt-a",
                text: "Because it makes treaties too difficult for public citizens to read and understand.",
                explanation: "Incorrect. While public readability is desirable, the doctrinal danger of constructive ambiguity lies in structural fragility and unilateral reinterpretation during crises, not general reading comprehension.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Because it creates latent textual fissures that stronger parties exploit during exogenous shocks to justify unilateral coercion.",
                explanation: "Correct. Constructive ambiguity masks unresolved disputes. When stress hits the relationship, the stronger party invariably enforces its preferred reading, causing catastrophic structural collapse.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Because international law forbids the use of adjectives in multilateral treaties.",
                explanation: "Incorrect. International law does not formally ban descriptive adjectives; rather, the UDCA identifies subjective terminology as an engineering defect that prevents deterministic auditing.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Because ambiguous treaties cannot be translated into multiple languages without clerical errors.",
                explanation: "Incorrect. Translation difficulties are a clerical symptom, not the root structural defect identified by the doctrine.",
                correct: false
              }
            ]
          },
          {
            id: "q1-1-2",
            question: "Under Chancellery Rule 1.1-A, what classification is assigned to a treaty clause that requires 'proportional troop drawdowns' without defining numerical ceilings or spatial boundaries?",
            options: [
              {
                id: "opt-a",
                text: "Legitimate Sovereign Discretion",
                explanation: "Incorrect. Subjective language without verifiable metrics is never classified as legitimate discretion within the UDCA.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Binding Customary Protocol",
                explanation: "Incorrect. Customary norms cannot substitute for falsifiable contractual thresholds.",
                correct: false
              },
              {
                id: "opt-c",
                text: "Unresolved Breach Risk",
                explanation: "Correct. Subjective adjectives lacking mathematical definitions or objective metrics leave the door open to unilateral reinterpretation, creating a direct vulnerability classified as an Unresolved Breach Risk.",
                correct: true
              },
              {
                id: "opt-d",
                text: "Standard Diplomatic Latitude",
                explanation: "Incorrect. Traditional diplomacy accepts such vagueness, but the UDCA rejects it entirely to preserve treaty durability.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "imperium-to-dominium",
        number: "1.2",
        eyebrow: "Module I · Chapter 1.2",
        title: "From Imperium to Dominium: Custody vs. Kinetic Coercion",
        estimatedMinutes: 25,
        executiveLede: "Traditional geopolitical systems operate on the principle of Imperium: the projection of kinetic force, military hegemony, surveillance scraping, and punitive economic sanctions. The Vinculum Security Doctrine shifts statecraft from Imperium to Dominium: the solemn responsibility of sovereign custody, relational stewardship, and intergenerational durability.",
        synopsis: [
          "Traditional geopolitical systems operate on Imperium: the projection of kinetic force, surveillance and punitive sanctions. Imperium creates a fragile equilibrium that demands ever greater expenditure to suppress the resistance it generates.",
          "The Vinculum Security Doctrine shifts statecraft to Dominium: the responsibility of sovereign custody, relational stewardship and intergenerational durability. Under Dominium, security is measured by the structural integrity of the relational bonds across four non-negotiable dimensions.",
          "The platform reads that shift on Mission Readiness (Desk 15) as the Dominum Index, whose phases run from Imperium-Bound through Fiduciary Anchor and Custodial Inversion to Self-Reinforcing Dominium.",
        ],
        statutoryNotice: "Doctrinal Warrant: Coercion produces immediate behavioral compliance at the cost of guaranteed structural decay. Custodial stewardship produces enduring sovereign stability.",
        learningOutcomes: [
          "Contrast the thermodynamic fragility of Imperium with the structural resilience of Dominium.",
          "Read the Dominum Index and its phases to judge whether an accord rests on custody or on the command of its makers.",
          "Articulate the custodial responsibilities of plenipotentiaries under the Vinculum Security Doctrine.",
          "Identify how surveillance scraping and punitive sanctions induce hidden relational fatigue."
        ],
        sections: [
          {
            heading: "I. The Thermodynamic Cost of Hegemony",
            subheading: "Why Imperium Inevitably Collapses Under Its Own Enforcement Overhead",
            paragraphs: [
              "Throughout recorded history, imperial powers have sought to stabilize international orders through the doctrine of Imperium. Imperium is defined as the unilateral assertion of command and control backed by the explicit threat of violence, trade strangulation, or political subversion. In the vocabulary of systems theory, Imperium is an open-loop, non-equilibrium system that requires massive, continuous inputs of energy simply to suppress natural resistance.",
              "Every act of coercive enforcement generates friction. When State A compels State B to sign an accord under threat of bombardment or crippling sanctions, State B does not internalize the legitimacy of the agreement. State B merely yields temporarily to an intolerable power asymmetry. Beneath the surface, State B's institutional apparatus begins working immediately to subvert, circumvent, or break the agreement at the first moment of imperial distraction.",
              "As an imperial power expands its sphere of coercion, the energy required to monitor compliance, police infractions, and punish defiance increases exponentially. Eventually, the enforcement overhead surpasses the total economic and strategic value derived from the subjugated territories. The system reaches an thermodynamic tipping point: the imperial power exhausts its fiscal and military capital trying to hold together an increasingly hostile architecture, culminating in systemic collapse."
            ],
            caseStudy: {
              title: "The Financial and Relational Insolvency of the Treaty of Versailles (1919)",
              jurisdiction: "Allied Powers and the German Weimar Republic",
              precedent: "Imposition of punitive indemnities without relational investment or intergenerational continuity",
              analysis: [
                "The Treaty of Versailles attempted to enforce total Allied hegemony through unconditional reparations, complete disarmament, and territorial amputation under Article 231 (the War Guilt clause). The accord embodied pure Imperium: the defeated party was excluded from negotiations and forced to sign under threat of renewed invasion and total naval blockade.",
                "Because the treaty provided zero institutional incentives for German economic recovery and completely destroyed the intergenerational bond of the German public, the cost of enforcing the treaty was astronomical. The Allied powers lacked the political will and military unity to maintain permanent garrisoning across Central Europe.",
                "The punitive nature of Versailles fueled virulent domestic extremism, destroyed Weimar democratic institutions, and laid the direct foundation for the catastrophic rupture of 1939. Coercion achieved immediate signatures but destroyed the relational fabric required for enduring peace."
              ],
              failureMechanism: "Total reliance on coercive imperium eliminated all relational legitimacy, ensuring the complete annihilation of the European security architecture within twenty years."
            }
          },
          {
            heading: "II. The Dominium Paradigm",
            subheading: "Sovereign Custody and Relational Yield",
            paragraphs: [
              "The Vinculum Security Doctrine replaces the logic of conquest with the logic of custody. Dominium represents the moral and mathematical stewardship of sovereign relationships. Under Dominium, an operator does not ask: 'How much leverage can I exert to force the counterpart to surrender?' Instead, the operator asks: 'What structural configuration will maximize the relational yield while minimizing coercive friction across generations?'",
              "Relational yield represents the voluntary, self-sustaining benefits that flow from a well-engineered covenant: secure commercial trade, ecological preservation, shared intelligence, cultural exchange, and mutual security. Coercive friction represents the ongoing resource expenditure required to police, threaten, and enforce compliance against an unwilling counterpart.",
              "When relational yield outweighs coercive friction, the relationship becomes self-stabilizing. The platform does not measure that balance as a ratio; it reads it through the Dominum Index on Desk 15, which reaches Self-Reinforcing Dominium at 75 or more with every bond above the 3.0 viable floor. Both parties recognize that the benefits of voluntary compliance far exceed any temporary advantage gained by defection. In this state, sovereign dignity is preserved on both sides of the table, eliminating the toxic resentment that fuels future revanchism."
            ],
            formulas: [F_DOMINUM_PHASE],
            statutoryRule: "Rule 1.2-A: A mission cannot be certified for Handover Sealing if its Dominum reading relies on active kinetic or economic coercion without a verified transition plan to voluntary custodial compliance."
          }
        ],
        quiz: [
          {
            id: "q1-2-1",
            question: "What is the primary thermodynamic reason that systems founded on pure Imperium suffer inevitable collapse?",
            options: [
              {
                id: "opt-a",
                text: "The military commanders grow old and lose their tactical acumen.",
                explanation: "Incorrect. Personnel turnover occurs in all systems and is not the underlying thermodynamic flaw of coercive systems.",
                correct: false
              },
              {
                id: "opt-b",
                text: "The energy and resource expenditure required to monitor and police compliance increases exponentially until it exceeds the value of the system.",
                explanation: "Correct. Coercion generates continuous friction and latent resistance. The cost of maintaining control eventually surpasses the total strategic yield, causing systemic exhaustion and collapse.",
                correct: true
              },
              {
                id: "opt-c",
                text: "International courts issue binding arrest warrants against the imperial leadership.",
                explanation: "Incorrect. Imperial powers historically operate outside or above international tribunal jurisdictions.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Trade tariffs automatically decline to zero over twenty-year periods.",
                explanation: "Incorrect. Tariff schedules are contractual and do not cause thermodynamic systemic collapse.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "state-vector-liebig",
        number: "1.3",
        eyebrow: "Module I · Chapter 1.3",
        title: "The 4-Dimensional Relational State Vector & The Liebig Minimum",
        estimatedMinutes: 30,
        executiveLede: "Every bilateral treaty, multilateral peace accord, or sovereign border covenant is modeled in the UDCA as a 4-dimensional relational state vector. Crucially, the structural resilience of this vector is governed by the Law of the Liebig Minimum: A diplomatic covenant does not rupture at its average strength; it shatters at its weakest link.",
        synopsis: [
          "Every bilateral treaty, multilateral peace accord or sovereign border covenant is modelled as a four-dimensional relational state vector. Each bond is scored from 1.0 to 5.0 in steps of 0.1 and read in four bands: Failing (1.0 to 2.0), Fragile (2.1 to 3.0), Viable (3.1 to 4.0) and Fortified (4.1 to 5.0).",
          "The four bonds are the Interpersonal bond between the negotiators on whom the process rests, the Communal bond across divided populations, the Intergenerational bond that carries the settlement across successions, and the Institutional-Relational bond between the governed and the organs of state.",
          "The health of the covenant is governed by the Law of the Liebig Minimum: a chain does not rupture at its average strength; it shatters at its weakest link. If the Communal bond is 1.8, an Institutional-Relational bond of 4.8 cannot avert collapse.",
        ],
        statutoryNotice: "Mathematical Axiom: If any single relational bond sits at or below the 3.0 viable floor, the covenant fails its Vector Integrity gate regardless of the elevated scores of the remaining three bonds.",
        learningOutcomes: [
          "Calibrate the 4-Dimensional Relational State Vector across all four canonical bond domains.",
          "Mathematically prove why mean trust metrics conceal fatal structural vulnerabilities.",
          "Apply Liebig's Law of the Minimum to identify the primary bottleneck in active diplomatic negotiations.",
          "Deploy targeted interventions to shore up the limiting bond before applying additional load."
        ],
        sections: [
          {
            heading: "I. The Geometry of the 4-Bond State Vector",
            subheading: "Deconstructing Relational Architecture into Orthogonal Coordinates",
            paragraphs: [
              "In conventional diplomatic reporting, state relationships are often summarized using subjective, aggregate terms such as 'warm relations', 'strained ties', or 'constructive dialogue'. These generalizations are dangerously misleading because they average distinct, orthogonal dimensions of trust into a single impressionistic narrative.",
              "The UDCA formalizes the relationship between sovereign parties as a four-dimensional state vector \\(S_{B} = \\vec{B_{ip}}{B_{comm}}{B_{igen}}{B_{inst}}\\). Each bond is scored on a bounded scale from 1.0, the sovereign baseline, to 5.0, in steps of 0.1:",
              "1. Interpersonal Bond \\(B_{ip}\\): The direct reciprocal trust, personal integrity and communicative access between the primary negotiators, heads of state or factional commanders on whom a process actually rests. Would the relationship survive a bad-faith moment intact?",
              "2. Communal Bond \\(B_{comm}\\): The inter-group cohesion, civic trust and grassroots solidarity across divided populations. Does an actor's authority survive contact with the community, and not merely with the institution?",
              "3. Intergenerational Bond \\(B_{igen}\\): The plane that connects past sacrifices, present agreements and future cohorts: institutional memory, youth stake and the capacity to transmit a settlement across successions.",
              "4. Institutional-Relational Bond \\(B_{inst}\\): The structural channel linking the governed population to the formal organs of state power, the judiciary, the security services and the administration. Would the bond survive a change in personnel or office?",
              "These four bonds are not interchangeable. Strength in the institutions cannot compensate for the absence of communal trust. Similarly, close personal rapport between two sitting presidents cannot prevent a treaty from collapsing if the broader population harbors intense, unaddressed communal grievances."
            ],
            formulas: [F_STATE_VECTOR]
          },
          {
            heading: "II. Justus von Liebig's Bottleneck in Sovereign Physics",
            subheading: "Why Average Trust Metrics Are Mathematically Fatal",
            paragraphs: [
              "In 1840, agricultural chemist Justus von Liebig formulated his celebrated Law of the Minimum: plant growth is dictated not by total available nutrients, but by the scarcest nutrient available (the limiting factor). If a crop has abundant nitrogen, phosphorus, and potassium, but lacks zinc, its growth is capped strictly by the availability of zinc. Adding more nitrogen will not make the plant grow; it will simply poison the soil.",
              "The Vinculum Security Doctrine applies this exact law to sovereign statecraft. In any diplomatic architecture, the overall structural load capacity is governed strictly by the minimum bond value, \\(\\min(B_{ip},\\, B_{comm},\\, B_{igen},\\, B_{inst})\\).",
              "When an analyst or diplomat calculates the arithmetic mean of the four bonds, they create an illusion of security. For instance, if the Interpersonal bond reads 4.6, the Communal 4.4 and the Intergenerational 4.2, but the Institutional-Relational bond reads 1.6, the arithmetic mean is 3.7, a seemingly respectable Contested standing. Yet in reality, this treaty sits on the brink of total rupture. Because the institutional apparatus is completely fractured, any sudden change in political leadership or a challenge in the domestic courts will instantly invalidate the agreement.",
              "The operator must continually identify the limiting bond and direct diplomatic energy toward elevating that specific coordinate before subjecting the relationship to increased stress."
            ],
            formulas: [F_LIEBIG, F_MEAN],
            caseStudy: {
              title: "The Pre-1914 European Economic Interdependence Paradox",
              jurisdiction: "Great Britain, Imperial Germany, and Continental Europe",
              precedent: "Norman Angell's 'The Great Illusion' and the fallacy of commercial pacification",
              analysis: [
                "Prior to the outbreak of the First World War in 1914, European intellectuals and financiers argued that a major war had become impossible due to unprecedented economic integration. Trade between Great Britain and Germany was at historic highs, cross-border credit was deeply intertwined, and the reigning families enjoyed close personal correspondence, a strong Interpersonal bond at the summit. Commercial interdependence, it should be noted, is not one of the four bonds at all.",
                "However, the institutional mechanisms for conflict resolution (the Institutional-Relational bond) were rigid, secret and militarized, while public jingoism, intense nationalism and naval competition had severely eroded the Communal and Intergenerational bonds.",
                "When the assassination of Archduke Franz Ferdinand delivered a sharp exogenous shock, the high commercial and familial ties proved utterly irrelevant. The system fractured along its weakest links: rigid military mobilization timetables and hostile public sentiment. Within weeks, the entire continent plunged into total war."
              ],
              failureMechanism: "Placing faith in elevated commercial trade while ignoring catastrophic weaknesses in institutional dispute resolution caused systemic world war."
            }
          }
        ],
        quiz: [
          {
            id: "q1-3-1",
            question: "Given a mission state vector \\(S_{B} = \\vec{4.4}{4.6}{4.0}{1.8}\\), what sets the structural resilience of the relationship under Liebig's Law of the Minimum?",
            options: [
              {
                id: "opt-a",
                text: "3.7 (the arithmetic mean of all four bonds)",
                explanation: "Incorrect. The arithmetic mean is mathematically forbidden in the UDCA because it creates a false impression of stability while hiding the fatal weakness.",
                correct: false
              },
              {
                id: "opt-b",
                text: "1.8 (the minimum bond: the Institutional-Relational bond, Failing)",
                explanation: "Correct. Under Liebig's Law of the Minimum, the relationship ruptures at its weakest link: \\(\\min(B) = 1.8\\). The system has an institutional bottleneck and cannot withstand significant exogenous load.",
                correct: true
              },
              {
                id: "opt-c",
                text: "4.6 (the maximum bond: the Communal bond)",
                explanation: "Incorrect. A strong Communal bond cannot substitute for a Failing Institutional-Relational bond.",
                correct: false
              },
              {
                id: "opt-d",
                text: "5.0 (the top of the scale)",
                explanation: "Incorrect. The top of the scale is a bound, not a reading of this relationship.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "chancellery-covenant",
        number: "1.4",
        eyebrow: "Module I · Chapter 1.4",
        title: "The Chancellery Covenant & The Operator's Custodial Duty",
        estimatedMinutes: 25,
        executiveLede: "The operator of the Unified Deterministic Chancellery Apparatus carries a solemn, non-negotiable custodial duty: to preserve evidentiary truth without partisan spin, political flattery, or retrospective redaction. The Chancellery Covenant defines the ethical and operational boundary separating sovereign statecraft from political theater.",
        synopsis: [
          "The operator of the UDCA carries a custodial duty: to preserve evidentiary truth without partisan spin, political flattery or retrospective redaction. The Chancellery Covenant separates sovereign statecraft from political theatre.",
          "That duty is exercised across seven arenas of sovereign governance: border demarcation and territorial cessions; post-conflict peace accords and DDR; bilateral treaties and state immunity; natural resource sharing and sovereign wealth; constitutional transitions and governance; international arbitration and pre-litigation; and diplomatic transition and mandate handover.",
          "This chapter sets out the custodial separation of powers, the Non-Redaction Principle that governs every record, and how the seven sectors map onto the desks.",
        ],
        statutoryNotice: "Custodial Oath: The operator serves the mathematical integrity of the covenant, not the transient political convenience of sitting administrations.",
        learningOutcomes: [
          "Understand the fiduciary distinction between custodial statecraft and partisan advocacy.",
          "Enforce the zero-redaction principle across all mission logs and decision ledgers.",
          "Operate within the air-gapped security perimeter to protect sensitive bilateral assessments.",
          "Map the seven sectors of statecraft onto the desks that serve them."
        ],
        sections: [
          {
            heading: "I. The Custodial Separation of Powers",
            subheading: "Protecting Sovereign Intelligence from Political Manipulation",
            paragraphs: [
              "In contemporary intelligence and foreign policy apparatuses, analytical objectivity is frequently compromised by political pressures. Political leaders often demand intelligence assessments that confirm their preconceived ideological narratives, justify aggressive military postures, or exaggerate the success of their diplomatic initiatives. When intelligence analysts bend to these pressures, they commit an act of strategic self-deception that frequently leads to catastrophic miscalculation.",
              "The Chancellery Covenant establishes an impermeable operational wall between political policymaking and chancellery assessment. The Chancellery operator is not a political cheerleader, an ambassadorial speechwriter, or a partisan propagandist. The operator is a sovereign relational engineer whose sole client is the long-term structural viability of peace and order.",
              "Under this covenant, the operator must record every bond degradation, every tactic stall, every redline breach, and every elevated rupture index with clinical, mathematical detachment. To falsify a bond score to please a superior is treated within the UDCA as the exact moral equivalent of an engineer falsifying stress tests on an aviation wing: it guarantees disaster."
            ]
          },
          {
            heading: "II. The Immutable Ledger and Non-Redaction Principle",
            subheading: "Preserving the Historical Record Against Retrospective Revision",
            paragraphs: [
              "One of the most corrosive practices in modern diplomacy is retrospective revisionism: altering past records, classified minutes, or treaty commitments to conceal errors, shift blame, or align with changing domestic political winds.",
              "The UDCA enforces the Non-Redaction Principle through the browser-local Decision Log and the cryptographic Handover Seal of the Chancellery Wire. Once an operator records a finding, notes a redline breach, or seals a mission state, that record is permanently fixed with an ISO UTC timestamp. The Decision Log is append-only: a correction is a new entry, never an in-place edit.",
              "If subsequent evidence reveals that an earlier assessment was incorrect, the operator must append a new corrective record with a full rationale and fresh evidence. Both the original error and the subsequent correction remain visible in the unbroken chain of custody. This absolute transparency protects the integrity of the state and provides future generations with an untampered historical record."
            ],
            formulas: [F_SEAL]
          },
          {
            heading: "III. Operationalization Across the Seven Sectors of Statecraft",
            subheading: "Where the Custodial Duty Is Exercised",
            paragraphs: [
              "1. Border Demarcation & Territorial Cessions: transforming volatile disputed lines into cooperative ecological and economic corridors, with resources released through the Conditional Escrow Waterfall (Desk 07).",
              "2. Post-Conflict Peace Accords & DDR: phasing disarmament and demobilization through verifiable decay horizons and survival tests (Desk 12) rather than arbitrary political deadlines.",
              "3. Bilateral Treaties & State Immunity: establishing jurisdictional clarity through the dispute forum and an express immunity waiver (Desk 11), without surrender of sovereign dignity.",
              "4. Natural Resource Sharing & Sovereign Wealth: locking joint-revenue extraction into deterministic escrow tranches and the communal resource floor (Desk 07).",
              "5. Constitutional Transitions & Governance: detecting Facade Syndrome (Desk 01) and drafting office-continuity provisions (Desk 10) before institutional collapse occurs.",
              "6. International Arbitration & Pre-Litigation: preparing the pleading heads from the live record (Desk 13) and preserving the evidentiary timeline with hashed, append-only records.",
              "7. Diplomatic Transition & Mandate Handover: passing a mission to its successors (Desk 17) with an unbroken, hash-verified chain of custody (Desk 18 and the Handover Seal)."
            ],
            statutoryRule: "Rule 1.4-A: The sector names the arena; the desks supply the readings. No sector carries its own formula or a parallel store."
          }
        ],
        quiz: [
          {
            id: "q1-4-1",
            question: "Under the Chancellery Covenant, what is an operator required to do when a sitting political minister requests that a critical rupture warning (\\(R \\ge 60\\), the Critical band) be lowered to prevent public controversy?",
            options: [
              {
                id: "opt-a",
                text: "Immediately comply, because sitting ministers hold sovereign executive command.",
                explanation: "Incorrect. The Chancellery Covenant explicitly forbids falsifying mathematical telemetry to satisfy transient political convenience.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Refuse the modification, maintain the mathematically verified score on the bus, and log the ministerial request as an exogenous political stress event in the Decision Log.",
                explanation: "Correct. The operator owes a custodial duty to the truth of the relationship. Modifying telemetry creates dangerous strategic blindness. The request itself must be recorded as external political pressure.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Delete the mission file entirely to avoid taking a controversial position.",
                explanation: "Incorrect. Deleting records violates the Non-Redaction Principle and destroys the evidentiary chain of custody.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Lower the score in the public dashboard while privately keeping the real number in personal notes.",
                explanation: "Incorrect. Dual-book accounting violates the core mandate of transparency and introduces fatal ambiguity.",
                correct: false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "divisional-cadence",
    number: "02",
    eyebrow: "Module II · Divisional Architecture",
    title: "The 18 Operational Desks & Divisional Cadence",
    summary: "The operational rhythm of the 18 desks across the four divisions of the dashboard, tracing one signal chain from assessment and early warning, through engagement and legal architecture, to mission governance and handover.",
    chapters: [
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
