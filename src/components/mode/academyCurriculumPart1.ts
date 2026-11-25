export interface ChapterQuizQuestion {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    explanation: string;
    correct: boolean;
  }[];
}

export interface DetailedLectureSection {
  heading: string;
  subheading?: string;
  paragraphs: string[];
  caseStudy?: {
    title: string;
    jurisdiction: string;
    precedent: string;
    analysis: string[];
    failureMechanism: string;
  };
  statutoryRule?: string;
}

export interface DetailedAcademyChapter {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  estimatedMinutes: number;
  executiveLede: string;
  statutoryNotice: string;
  learningOutcomes: string[];
  sections: DetailedLectureSection[];
  quiz: ChapterQuizQuestion[];
  drillType?: "border" | "ddr" | "escrow" | "capstone";
}

export interface DetailedAcademyModule {
  id: string;
  number: string;
  eyebrow: string;
  title: string;
  summary: string;
  chapters: DetailedAcademyChapter[];
}

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
        statutoryNotice: "Doctrinal Warrant: Coercion produces immediate behavioral compliance at the cost of guaranteed structural decay. Custodial stewardship produces enduring sovereign stability.",
        learningOutcomes: [
          "Contrast the thermodynamic fragility of Imperium with the structural resilience of Dominium.",
          "Calculate the Dominum Quotient to evaluate whether an accord relies on relational yield or coercive friction.",
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
              "When a covenant achieves a Dominum Quotient greater than or equal to 1.0, the relationship becomes self-stabilizing. Both parties recognize that the benefits of voluntary compliance far exceed any temporary advantage gained by defection. In this state, sovereign dignity is preserved on both sides of the table, eliminating the toxic resentment that fuels future revanchism."
            ],
            statutoryRule: "Rule 1.2-A: A mission cannot be certified for Handover Sealing if its computed Dominum Quotient relies on active kinetic or economic coercion without a verified transition plan to voluntary custodial compliance."
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
        statutoryNotice: "Mathematical Axiom: If any single relational bond drops below its critical rupture threshold, the entire covenant enters acute systemic failure regardless of the elevated scores of the remaining three bonds.",
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
              "The UDCA formalizes the relationship between sovereign parties as a four-dimensional state vector denoted as S_B = [B_ip, B_comm, B_igen, B_inst]. Each bond coordinate is measured on a strictly bounded continuum from 0.00 (complete systemic rupture) to 1.00 (absolute structural integrity):",
              "1. Interpersonal Bond (B_ip): Measures the direct psychological attunement, candor, and reciprocal reliability between primary plenipotentiaries, heads of state, and lead negotiators.",
              "2. Commercial & Transactional Bond (B_comm): Measures the mutually beneficial economic flows, trade velocity, debt servicing, and supply-chain interdependence linking the two states.",
              "3. Intergenerational & Cultural Bond (B_igen): Measures the shared historical memory, diaspora ties, ecological stewardship, and perceived legitimacy across generational cohorts.",
              "4. Institutional & Statutory Bond (B_inst): Measures the formal treaties, ratified statutes, joint commissions, and constitutional mechanisms that legally bind the parties.",
              "These four bonds are not interchangeable. A surplus of commercial trade cannot compensate for the total absence of institutional legitimacy. Similarly, close personal rapport between two sitting presidents cannot prevent a treaty from collapsing if the broader population harbors intense, unaddressed communal grievances."
            ]
          },
          {
            heading: "II. Justus von Liebig's Bottleneck in Sovereign Physics",
            subheading: "Why Average Trust Metrics Are Mathematically Fatal",
            paragraphs: [
              "In 1840, agricultural chemist Justus von Liebig formulated his celebrated Law of the Minimum: plant growth is dictated not by total available nutrients, but by the scarcest nutrient available (the limiting factor). If a crop has abundant nitrogen, phosphorus, and potassium, but lacks zinc, its growth is capped strictly by the availability of zinc. Adding more nitrogen will not make the plant grow; it will simply poison the soil.",
              "The Vinculum Security Doctrine applies this exact law to sovereign statecraft. In any diplomatic architecture, the overall structural load capacity is governed strictly by the minimum bond value: min(B_ip, B_comm, B_igen, B_inst).",
              "When an analyst or diplomat calculates the arithmetic mean of the four bonds, they create an illusion of security. For instance, if B_ip = 0.90, B_comm = 0.85, B_igen = 0.80, but B_inst = 0.15, the arithmetic mean is 0.675 (a seemingly respectable and healthy reading). Yet in reality, this treaty sits on the brink of total rupture. Because the institutional apparatus is completely fractured, any sudden change in political leadership or a challenge in the domestic courts will instantly invalidate the agreement.",
              "The operator must continually identify the limiting bond and direct diplomatic energy toward elevating that specific coordinate before subjecting the relationship to increased stress."
            ],
            caseStudy: {
              title: "The Pre-1914 European Economic Interdependence Paradox",
              jurisdiction: "Great Britain, Imperial Germany, and Continental Europe",
              precedent: "Norman Angell's 'The Great Illusion' and the fallacy of commercial pacification",
              analysis: [
                "Prior to the outbreak of the First World War in 1914, European intellectuals and financiers argued that a major war had become impossible due to unprecedented economic integration. Bilateral trade volumes (B_comm) between Great Britain and Germany were at historic highs, cross-border financial credit was deeply intertwined, and monarchical families enjoyed close personal correspondence (B_ip).",
                "However, the institutional mechanisms for conflict resolution (B_inst) were rigid, secret, and militarized, while public jingoism, intense nationalism, and naval competition had severely eroded communal trust (B_comm / B_igen).",
                "When the assassination of Archduke Franz Ferdinand delivered a sharp exogenous shock, the high commercial and familial ties proved utterly irrelevant. The system fractured along its weakest links: rigid military mobilization timetables and hostile public sentiment. Within weeks, the entire continent plunged into total war."
              ],
              failureMechanism: "Placing faith in elevated commercial trade while ignoring catastrophic weaknesses in institutional dispute resolution caused systemic world war."
            }
          }
        ],
        quiz: [
          {
            id: "q1-3-1",
            question: "Given a mission state vector of B_ip = 0.85, B_comm = 0.90, B_igen = 0.75, and B_inst = 0.20, what is the effective structural resilience of the relationship under Liebig's Law of the Minimum?",
            options: [
              {
                id: "opt-a",
                text: "0.675 (The arithmetic mean of all four bonds)",
                explanation: "Incorrect. The arithmetic mean is mathematically forbidden in the UDCA because it creates a false impression of stability while hiding the fatal weakness.",
                correct: false
              },
              {
                id: "opt-b",
                text: "0.20 (The minimum bond coordinate: B_inst)",
                explanation: "Correct. Under Liebig's Law of the Minimum, the relationship ruptures at its weakest link: min(B) = 0.20. The system has an institutional bottleneck and cannot withstand significant exogenous load.",
                correct: true
              },
              {
                id: "opt-c",
                text: "0.90 (The maximum bond coordinate: B_comm)",
                explanation: "Incorrect. High commercial trade cannot substitute for near-zero institutional durability.",
                correct: false
              },
              {
                id: "opt-d",
                text: "1.00 (Normalized baseline)",
                explanation: "Incorrect. Normalized baselines apply only to pristine, unstressed systems.",
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
        statutoryNotice: "Custodial Oath: The operator serves the mathematical integrity of the covenant, not the transient political convenience of sitting administrations.",
        learningOutcomes: [
          "Understand the fiduciary distinction between custodial statecraft and partisan advocacy.",
          "Enforce the zero-redaction principle across all mission logs and decision ledgers.",
          "Operate within the air-gapped security perimeter to protect sensitive bilateral assessments.",
          "Uphold the statutory mandate of James Wesley Ndua in the architecture of sovereign peace."
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
              "The UDCA enforces the Non-Redaction Principle through its browser-local immutable decision ledger (Desk 16) and cryptographic handover seal (Desk 17). Once an operator records a finding, notes a redline breach, or seals a mission state, that record is permanently fixed with an ISO UTC timestamp. The system does not permit the deletion or in-place modification of historical log entries.",
              "If subsequent intelligence reveals that an earlier assessment was incorrect, the operator must append a new corrective record with a full rationale and fresh evidence. Both the original error and the subsequent correction remain visible in the unbroken chain of custody. This absolute transparency protects the integrity of the state and provides future generations with an untampered historical record."
            ]
          }
        ],
        quiz: [
          {
            id: "q1-4-1",
            question: "Under the Chancellery Covenant, what is an operator required to do when a sitting political minister requests that a critical rupture warning (R >= 1.20) be lowered to prevent public controversy?",
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
    summary: "Comprehensive operational treatise on the four operational divisions of the UDCA, tracing signals from diagnostic intake to final handover sealing.",
    chapters: [
      {
        id: "division-1",
        number: "2.1",
        eyebrow: "Module II · Chapter 2.1",
        title: "Division I (Desks 01–04): Foundation & Perimeter Security",
        estimatedMinutes: 30,
        executiveLede: "Division I establishes the perimeter of the mission. It classifies the sovereign mandate, activates the moral and physical guardrails of the Sentinel Matrix, quantifies structural asymmetries between parties, and profiles counterpart delegation dynamics.",
        statutoryNotice: "Statutory Directive: No mission may advance to relational stress diagnostics in Division II until the Sentinel Matrix is armed and counterpart asymmetry is mapped.",
        learningOutcomes: [
          "Configure Desk 01 to establish mandate parameters, territorial scope, and operational legal constraints.",
          "Arm Desk 02 (Sentinel Matrix & The Eye of Humanity) to protect fundamental human dignity.",
          "Execute Euclidean distance modeling on Desk 03 (Asymmetry Matrix) across all four power axes.",
          "Deploy Desk 04 (Counterpart Intelligence) to map psychological tactics and delegation seating."
        ],
        sections: [
          {
            heading: "I. Desk 01: Sovereign Context & Mandate Classification",
            subheading: "Establishing the Operational Boundaries of Statecraft",
            paragraphs: [
              "Every mission within the UDCA begins at Desk 01 (Sovereign Context). Before a single bond score is calibrated or a negotiation script is deployed, the operator must define the legal, territorial, and historical scope of the mandate. Is this an international bilateral border demarcation, an internal peace accord between sovereign factions, an offshore maritime boundary dispute, or a critical mineral resource covenant?",
              "Desk 01 binds the mandate to its governing international legal instruments: relevant United Nations conventions, historical bilateral treaties, arbitration compromises, and constitutional frameworks. It also records the official delegation titles, plenary powers, and statutory authorizations of all participating negotiators. This ensures that the mission does not operate in an abstract theoretical vacuum, but remains strictly anchored to valid legal authority."
            ]
          },
          {
            heading: "II. Desk 02: Sentinel Matrix & The Eye of Humanity",
            subheading: "Preserving Human Dignity and Moral Redlines",
            paragraphs: [
              "In high-stakes statecraft, negotiators can become so fixated on abstract geopolitical objectives or financial balances that they lose sight of the physical human beings whose lives are governed by their decisions. Desk 02 (Sentinel Matrix) acts as the moral conscience of the chancellery, known doctrinally as The Eye of Humanity.",
              "Desk 02 establishes immutable human rights invariants: prohibition of forced population displacement, protection of civilian infrastructure, guarantees of humanitarian passage, and the non-negotiability of bodily integrity. If a proposed concession or treaty term violates these core humanitarian boundaries, the Sentinel Matrix flags an immediate statutory breach that freezes mission advancement.",
              "Furthermore, Desk 02 houses the technical Sentinel that protects the operator's digital workspace: controlling the single inactivity timer, monitoring the DOM canary for tamper attempts, and managing panic zeroization keys."
            ]
          },
          {
            heading: "III. Desk 03: Asymmetry Matrix",
            subheading: "Quantifying Power Differentials via Normalized Euclidean Distance",
            paragraphs: [
              "Negotiations between states are rarely conducted between equals. Vast asymmetries in military force, gross domestic product, institutional depth, and informational access constantly shape the diplomatic landscape. Desk 03 quantifies these disparities using a normalized multi-dimensional Euclidean distance model.",
              "By mapping both parties across four normalized axes (Military Capacity, Economic Leverage, Institutional Durability, and Informational Dominance), Desk 03 computes the exact power asymmetry delta. If the asymmetry is extreme, Desk 03 warns the operator that the stronger party will likely attempt to bypass formal compromise in favor of coercive dictation. The operator must then utilize third-party forums or escrow structures to restore structural balance."
            ]
          },
          {
            heading: "IV. Desk 04: Counterpart Intelligence & Psychological Profiling",
            subheading: "Mapping Delegation Dynamics and Seating Rosters",
            paragraphs: [
              "A treaty is negotiated not by monolithic state entities, but by living human plenipotentiaries with specific psychological profiles, internal domestic rivalries, and institutional mandates. Desk 04 provides rigorous intelligence mapping of the opposing delegation.",
              "Desk 04 records lead negotiator psychological profiles, decision-making styles (authoritarian, consultative, legalistic, delay-oriented), and internal delegation factionalism. It also structures the seating roster, mapping counter-tactics to specific counterpart seats. By identifying which counterpart delegates act as hardline ideological anchors and which act as pragmatic bridge-builders, the operator can tailor negotiation inquiry to maximize constructive movement."
            ]
          }
        ],
        quiz: [
          {
            id: "q2-1-1",
            question: "What is the primary operational purpose of Desk 02 (Sentinel Matrix & The Eye of Humanity)?",
            options: [
              {
                id: "opt-a",
                text: "To calculate tariff schedules for agricultural goods.",
                explanation: "Incorrect. Commercial tariff schedules are managed in Division III.",
                correct: false
              },
              {
                id: "opt-b",
                text: "To enforce non-negotiable moral and humanitarian redlines, ensuring that human dignity and civilian protection are never traded away for political expediency.",
                explanation: "Correct. Desk 02 anchors the entire system to fundamental human rights, preventing agreements that sacrifice human life or dignity.",
                correct: true
              },
              {
                id: "opt-c",
                text: "To track social media sentiment during the negotiations.",
                explanation: "Incorrect. The UDCA relies on verified structural telemetry, not social media sentiment.",
                correct: false
              },
              {
                id: "opt-d",
                text: "To act as an automated speechwriter for delegation press conferences.",
                explanation: "Incorrect. The UDCA is an analytical apparatus, not a public relations tool.",
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
        title: "Division II (Desks 05–09): Relational Dynamics & Stress Diagnostics",
        estimatedMinutes: 30,
        executiveLede: "Division II forms the diagnostic engine of the UDCA. It calibrates the four-bond state vector, measures inscribed environmental loads, calculates the mathematical Rupture Index, forecasts temporal decay horizons, and audits historical precedent coordinates.",
        statutoryNotice: "Diagnostic Axiom: Exogenous load does not rupture a relationship; it merely reveals the pre-existing fragility of the limiting bond.",
        learningOutcomes: [
          "Calibrate the four relational bonds on Desk 05 using empirical diplomatic evidence.",
          "Quantify domestic and geopolitical stress loads on Desk 06 (Inscribed Stress).",
          "Compute and interpret the live Rupture Index (R) on Desk 07.",
          "Model temporal decay horizons (tau) on Desk 08 to determine crisis half-life.",
          "Audit historical treaties and boundary precedents on Desk 09 (Historical Resonance)."
        ],
        sections: [
          {
            heading: "I. Desk 05: Bond Architecture & Vector Calibration",
            subheading: "Translating Qualitative Intelligence into Normalized Coordinates",
            paragraphs: [
              "Desk 05 is the bedrock upon which all relational physics in the UDCA operates. It takes qualitative diplomatic intelligence (reports from bilateral meetings, economic indicators, public polls, constitutional legal challenges) and translates them into the four bounded coordinates: B_ip, B_comm, B_igen, and B_inst.",
              "Each coordinate must be defended with empirical justifications before being inscribed into the MissionEngine bus. Desk 05 prevents 'score inflation' by requiring the operator to satisfy specific evidential criteria before assigning scores above 0.70. Once calibrated, Desk 05 continuously exposes the Liebig bottleneck to the rest of the dashboard."
            ]
          },
          {
            heading: "II. Desk 06: Inscribed Stress & Environmental Load",
            subheading: "Measuring Exogenous Pressures on the Diplomatic Architecture",
            paragraphs: [
              "Relationships do not exist in sterile isolation. They are subjected to continuous exogenous pressures: domestic electoral cycles, currency inflation, crop failures, border provocations, cyber intrusions, and third-party imperial interference. Desk 06 measures this total inscribed stress load (L).",
              "Stress is classified across three operational tiers: Acute Shock (sudden, high-impact events like an armed border skirmish), Chronic Friction (sustained low-level drag like ongoing trade sanctions or hostile media rhetoric), and Latent Vulnerability (unresolved historical grievances that flare up under pressure). Desk 06 sums and weights these loads to determine the total pressure currently bearing down on the relational bonds."
            ]
          },
          {
            heading: "III. Desk 07: Rupture Index (R)",
            subheading: "The Mathematical Fragility Quotient",
            paragraphs: [
              "Desk 07 synthesizes the bond coordinates from Desk 05 and the stress load from Desk 06 to calculate the primary fragility indicator of the UDCA: the Rupture Index (R).",
              "When R < 0.80, the system is in the Stable Zone: the bonds possess sufficient structural capacity to absorb ongoing stress without permanent distortion. When 0.80 <= R < 1.20, the system enters the Warning Zone: micro-fractures begin appearing, and the limiting bond begins undergoing plastic deformation. When R >= 1.20, the system enters Acute Rupture: structural collapse is imminent or already underway, and all discretionary negotiation must halt in favor of emergency stabilization."
            ]
          },
          {
            heading: "IV. Desk 08: Decay Horizon (tau) & Desk 09: Historical Resonance",
            subheading: "Temporal Half-Life and Historical Precedent",
            paragraphs: [
              "Desk 08 calculates the Decay Horizon (tau), which models the temporal half-life of an unaddressed diplomatic crisis. If a severe rupture warning is ignored, how many days remain before the relationship undergoes irrevocable institutional dissolution? Desk 08 demonstrates that high stress accelerates time: crises that could have been resolved in six months during peace can cause complete collapse in forty-eight hours under acute rupture.",
              "Desk 09 anchors the assessment to historical precedent. It audits past treaties, boundary demarcations, and prior peace agreements between the two parties, identifying historical cycles of compliance and breach. By understanding where past accords fractured, the operator avoids repeating identical structural mistakes."
            ]
          }
        ],
        quiz: [
          {
            id: "q2-2-1",
            question: "If Desk 07 indicates a Rupture Index of R = 1.35, what is the mandatory operational protocol for the chancellery operator?",
            options: [
              {
                id: "opt-a",
                text: "Proceed with normal economic concession trading on Desk 13.",
                explanation: "Incorrect. In Acute Rupture, trading non-essential concessions while the foundation is fracturing leads to catastrophic collapse.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Halt discretionary negotiations immediately, activate emergency stabilization protocols, and direct all efforts toward reinforcing the limiting bond.",
                explanation: "Correct. An index of R >= 1.20 signifies Acute Rupture. Normal statecraft must pause immediately to prevent irreversible covenant failure.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Recalibrate Desk 05 to raise the bond scores so R drops back below 1.00.",
                explanation: "Incorrect. Artificially falsifying bond scores to conceal an acute rupture is a severe violation of the Chancellery Covenant.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Issue an immediate declaration of war against the counterpart.",
                explanation: "Incorrect. The UDCA is an instrument for preserving sovereign peace and structural integrity, not a mechanism for hasty militarization.",
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
        title: "Division III (Desks 10–14): Negotiation Tactics, Forum & Fiduciary Escrow",
        estimatedMinutes: 35,
        executiveLede: "Division III governs the tactical workbench of negotiation. It executes non-coercive Socratic inquiry, neutralizes counterpart stalling maneuvers, evaluates arbitral forum fitness, optimizes mutual concession trade-offs, and enforces multi-tranche fiduciary escrow waterfalls.",
        statutoryNotice: "Operational Requirement: No financial disbursement or territorial concession may be executed without an auditable verification trigger in Desk 14.",
        learningOutcomes: [
          "Deploy Desk 10 (Questioning Engine) to conduct structured, non-leading inquiry.",
          "Identify and counter stalling tactics on Desk 11 (Tactic Countermeasures).",
          "Score international legal venues on Desk 12 (Forum Fitness & Admissibility).",
          "Structure balanced value exchanges on Desk 13 (Concession Matrix).",
          "Design and verify a four-tranche escrow waterfall on Desk 14 (Escrow Mechanics)."
        ],
        sections: [
          {
            heading: "I. Desk 10: Questioning Engine & Desk 11: Tactic Countermeasures",
            subheading: "Non-Coercive Elicitation and Countering Bad-Faith Stalling",
            paragraphs: [
              "Desk 10 (Questioning Engine) replaces aggressive cross-examination with disciplined Socratic elicitation. It guides the operator in asking precise, open-ended questions that reveal the counterpart's true operational constraints without triggering defensive hostility. By mapping inquiries to specific seats, Desk 10 ensures that questions are addressed to the officials who possess actual decision-making authority.",
              "Desk 11 (Tactic Countermeasures) monitors counterpart behavior for bad-faith negotiation tactics: procedural filibustering, artificial delegation turnover, last-minute demands, and selective leaks. When a stall pattern is detected, Desk 11 provides deterministic countermeasures: conditioning continued talks on verified benchmark fulfillment, freezing discretionary concessions, or invoking formal time-bound procedural deadlines."
            ]
          },
          {
            heading: "II. Desk 12: Forum Fitness & Admissibility Scoring",
            subheading: "Selecting the Optimal Venue for Sovereign Dispute Resolution",
            paragraphs: [
              "When disputes arise, the choice of arbitral forum often determines the outcome. Desk 12 evaluates competing dispute resolution venues (such as the International Court of Justice, the Permanent Court of Arbitration, ad-hoc bilateral tribunals, or regional treaty secretariats) across five objective criteria:",
              "1. Jurisdictional Invariant: Does the venue possess unambiguous, binding jurisdiction recognized by both sovereign states?",
              "2. Procedural Speed: Can the forum deliver interim protective measures before irreversible physical damage occurs?",
              "3. Sovereign Immunity Protection: Does the forum respect state assets against commercial seizure or third-party attachment?",
              "4. Enforcement Mechanism: Are decisions backed by multilateral compliance guarantees or escrow penalties?",
              "5. Neutrality Index: Is the forum free from political manipulation by external regional powers?",
              "Desk 12 scores each candidate venue, providing an objective Admissibility Score that prevents parties from being dragged into biased or unenforceable judicial traps."
            ]
          },
          {
            heading: "III. Desk 13: Concession Matrix & Desk 14: Escrow Waterfall",
            subheading: "Conservation of Value and Verifiable Tranche Releases",
            paragraphs: [
              "Desk 13 maps and prices all proposed treaty concessions. It prevents the dangerous practice of 'concession unbalancing', where one state yields permanent territorial or military ground in exchange for temporary, revocable commercial favors. Desk 13 ensures that value is conserved and that every concession granted is met with an equivalent, durable return.",
              "Desk 14 represents the fiduciary pinnacle of Division III: the Escrow Waterfall. Rather than transferring assets, funds, or sovereign rights immediately upon signature, Desk 14 locks the assets into a multi-tranche escrow trust governed by strict mathematical conservation: the sum of all tranches must equal total escrowed assets at all times.",
              "Tranches are released only upon cryptographic or field-audit proof that milestone conditions have been fully satisfied. If a party breaches a redline or halts compliance, Desk 14 triggers an immediate freeze, protecting sovereign wealth from bad-faith confiscation."
            ]
          }
        ],
        quiz: [
          {
            id: "q2-3-1",
            question: "Why does Desk 14 require an Escrow Waterfall with gated tranches instead of an immediate lump-sum transfer upon treaty signature?",
            options: [
              {
                id: "opt-a",
                text: "To allow the bank to earn higher interest on the escrowed capital.",
                explanation: "Incorrect. The purpose of escrow is relational security and milestone enforcement, not commercial banking profit.",
                correct: false
              },
              {
                id: "opt-b",
                text: "To ensure that assets are released strictly in response to verified compliance benchmarks, maintaining continuous leverage and preventing post-signature defection.",
                explanation: "Correct. Gated tranches eliminate the moral hazard of bad-faith defection after receiving payment, guaranteeing that compliance is verified at every step.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Because international law prohibits financial transactions larger than one million dollars.",
                explanation: "Incorrect. There is no such limitation in sovereign transactions.",
                correct: false
              },
              {
                id: "opt-d",
                text: "To give the diplomats time to convert the funds into physical gold.",
                explanation: "Incorrect. Currency conversions are irrelevant to the structural enforcement purpose of the waterfall.",
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
        title: "Division IV (Desks 15–18): Readiness, Handover & Statutory Dossier",
        estimatedMinutes: 30,
        executiveLede: "Division IV synthesizes all operational signals into a finalized mission architecture. It audits holistic readiness on Desk 15, maintains the immutable UTC audit trail on Desk 16, executes cryptographic SHA-256 sealing on Desk 17, and binds publication-grade archival packages on Desk 18.",
        statutoryNotice: "Statutory Mandate: No mission record is legally complete until it is cryptographically sealed and bound into an archival PDF dossier with verified provenance.",
        learningOutcomes: [
          "Evaluate holistic mission readiness and the Dominum Index on Desk 15.",
          "Audit the chronological UTC decision trail on Desk 16 (Decision Log).",
          "Execute Web Crypto SHA-256 canonical hashing on Desk 17 (Handover Seal).",
          "Verify divergence alerts and detect retrospective tampering.",
          "Compile publication-grade archival PDF dossiers on Desk 18."
        ],
        sections: [
          {
            heading: "I. Desk 15: Mission Readiness & Dominum Synthesis",
            subheading: "The Final Clearance Audit Before Diplomatic Execution",
            paragraphs: [
              "Desk 15 acts as the comprehensive pre-flight audit for the mission. It interrogates all prior desks to confirm that every statutory clearance gate has been satisfied: Are all four bonds calibrated? Is the Rupture Index in the stable zone? Have all counterpart stalls been neutralized? Are escrow tranches fully funded? Has the Sentinel Matrix certified civilian protections?",
              "Desk 15 synthesizes these diverse metrics into the holistic Dominum Index (D). If any clearance gate remains red, Desk 15 blocks handover, displaying the precise operational deficiency that must be resolved before the mission can proceed."
            ]
          },
          {
            heading: "II. Desk 16: Chronological Decision Log & Desk 17: Handover Seal",
            subheading: "Cryptographic Tamper-Evidence and the Chain of Custody",
            paragraphs: [
              "Desk 16 maintains an immutable, append-only record of every operator decision, redline flag, bond adjustment, and shock test conducted throughout the mission. Every record is stamped with a high-precision ISO UTC timestamp, creating an auditable ledger that cannot be manipulated.",
              "Desk 17 executes the ultimate technological guarantee of the UDCA: the Handover Seal. When an assessment is finalized, Desk 17 sorts all mission signals, profiles, and ledger entries into normalized canonical JSON and computes a cryptographic SHA-256 digest using the browser's native Web Crypto API.",
              "If any actor subsequently attempts to alter a single number, name, or covenant term in the local storage or exported file, Desk 17 detects the divergence instantly upon loading, illuminating a red Divergence Warning and identifying the exact modified field. Resealing leaves an immutable break stamp in the ledger, guaranteeing that tampering cannot be hidden."
            ]
          },
          {
            heading: "III. Desk 18: Mission Dossier & Statutory Export",
            subheading: "Binding Publication-Grade Archival Packages",
            paragraphs: [
              "The final operational step of the UDCA occurs at Desk 18 (Mission Dossier). This desk takes the sealed mission data, analytical charts, mathematical proofs, and statutory attestations, and compiles them into publication-grade, archival PDF packages.",
              "The exported dossiers adhere to strict diplomatic design invariants: bounded running headers, clear statutory disclaimers, high-legibility typographic hierarchy, and embedded cryptographic digests. These documents serve as the formal instruments of sovereign handover, ready for archival preservation in national registries."
            ]
          }
        ],
        quiz: [
          {
            id: "q2-4-1",
            question: "What occurs if an external actor modifies a single bond coordinate inside a previously sealed mission file before loading it back into the UDCA?",
            options: [
              {
                id: "opt-a",
                text: "The application crashes and deletes all local session data.",
                explanation: "Incorrect. The UDCA never erases records upon detecting corruption; it protects data and isolates irregularities.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Desk 17 automatically recalculates the digest and silently accepts the new value.",
                explanation: "Incorrect. Silently accepting modified data without warning would defeat the entire purpose of tamper evidence.",
                correct: false
              },
              {
                id: "opt-c",
                text: "Desk 17 detects the cryptographic divergence immediately, displays a Divergence Warning badge, and reveals the exact fields that were modified.",
                explanation: "Correct. The Web Crypto SHA-256 canonical digest fails to match the recalculated payload, immediately surfacing the divergence and preserving evidence of tampering.",
                correct: true
              },
              {
                id: "opt-d",
                text: "The browser sends an automated alert to the United Nations security server.",
                explanation: "Incorrect. The UDCA operates strictly browser-local with zero network egress; it never contacts foreign servers.",
                correct: false
              }
            ]
          }
        ]
      }
    ]
  }
];
