import { DetailedAcademyModule } from "./academyCurriculumPart1";

export const ACADEMY_MODULES_PART_2: DetailedAcademyModule[] = [
  {
    id: "computational-sovereignty",
    number: "03",
    eyebrow: "Module III · Computational Sovereignty",
    title: "Cryptographic Integrity, Safeguards & Counter-Intelligence",
    summary: "Why sovereign diplomacy demands zero-cloud architecture, how canonical JSON serialization and Web Crypto SHA-256 hashing prevent post-hoc tampering, and how Sentinel guards enforce air-gapped security.",
    chapters: [
      {
        id: "zero-cloud-telemetry",
        number: "3.1",
        eyebrow: "Module III · Chapter 3.1",
        title: "Browser-Local Architecture & Threat Surface Elimination",
        estimatedMinutes: 30,
        executiveLede: "Storing sovereign diplomatic intelligence on remote third-party cloud infrastructure exposes bilateral accords to foreign subpoena, interception, and algorithmic harvesting. The UDCA operates strictly within the local browser runtime with zero network persistence.",
        statutoryNotice: "Architectural Invariant: No mission data, bond readings, or counterpart psychological profiles shall be transmitted across the network or stored in a persistent external database.",
        learningOutcomes: [
          "Analyze the structural counter-intelligence vulnerabilities of cloud-hosted diplomatic workspaces.",
          "Enforce browser-local execution boundaries across all 18 desks.",
          "Verify that mission state is strictly zeroized from system memory upon session termination."
        ],
        sections: [
          {
            heading: "I. The Illusion of Third-Party Cloud Confidentiality",
            subheading: "Why Commercial Server Infrastructure Invalides Sovereign Diplomatic Immunity",
            paragraphs: [
              "In contemporary international relations, sovereign states increasingly contract commercial cloud providers for diplomatic data management. This introduces a fatal structural vulnerability: data stored on remote physical servers is subject to the jurisdictional laws, legal subpoenas, and clandestine intelligence operations of foreign host nations.",
              "When a sovereign state's confidential treaty drafts, redline concessions, and psychological counterpart assessments sit on remote servers, foreign adversaries do not need to penetrate diplomatic missions physically. They can obtain lawful or clandestine access via cloud provider subpoenas, supply-chain exploits, or privileged insider breaches.",
              "The Vinculum Security Doctrine establishes that true sovereign confidentiality requires complete computational independence. The UDCA operates as a closed, browser-local computational environment. Every calculation, from bond stress modeling to cryptographic sealing, executes strictly within local volatile memory."
            ],
            caseStudy: {
              title: "The CLOUD Act Subpoena Risk in Transnational Negotiations",
              jurisdiction: "United States Federal Jurisdiction / Foreign Sovereign Counterparties",
              precedent: "Extraterritorial data attachment on commercial cloud servers",
              analysis: [
                "Under modern extraterritorial data statutes such as the United States Clarifying Lawful Overseas Use of Data (CLOUD) Act, domestic judicial authorities can compel commercial cloud providers to disclose customer data stored on servers located anywhere in the world.",
                "If State A and State B conduct bilateral negotiations using a commercial SaaS platform headquartered in a third-party superpower, that third party can legally compel disclosure of all negotiation drafts, internal concession matrices, and real-time posture assessments without notifying either negotiating party.",
                "This legal vulnerability invalidates the sovereign equality of states. Knowledge of a counterpart's private redlines before walking into the negotiating chamber allows the observer to orchestrate diplomatic coercion with mathematical precision."
              ],
              failureMechanism: "Entrusting sovereign diplomatic telemetry to third-party cloud infrastructure permits foreign judicial and intelligence exploitation."
            }
          }
        ],
        quiz: [
          {
            id: "q3-1-1",
            question: "Why does the UDCA require all mission calculations and bond telemetry to remain strictly browser-local?",
            options: [
              {
                id: "opt-a",
                text: "To reduce cloud hosting expenses for the software developer.",
                explanation: "Incorrect. The architectural design is dictated by sovereign security, not hosting budget constraints.",
                correct: false
              },
              {
                id: "opt-b",
                text: "To eliminate remote network threat surfaces, foreign subpoena exposure, and clandestine intelligence harvesting.",
                explanation: "Correct. Keeping data in local memory eliminates cloud interception and extraterritorial subpoenas.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Because web browsers are incapable of sending HTTP POST requests.",
                explanation: "Incorrect. Browsers easily send HTTP requests; the UDCA intentionally disables external calls to protect sovereign statecraft.",
                correct: false
              },
              {
                id: "opt-d",
                text: "To make the application operate faster on low-bandwidth satellite links.",
                explanation: "Incorrect. While performance improves offline, the governing rationale is counter-intelligence security.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "anti-tamper-sealing",
        number: "3.2",
        eyebrow: "Module III · Chapter 3.2",
        title: "Canonical JSON Serialization & Web Crypto SHA-256 Hashing",
        estimatedMinutes: 30,
        executiveLede: "When an assessment or diplomatic handover is completed, it must be protected against post-hoc manipulation or retrospective distortion. The UDCA sorts all mission data into canonical JSON and hashes it using the browser native SubtleCrypto engine.",
        statutoryNotice: "Cryptographic Rule: Changing a single bond score, operator identifier, or punctuation mark generates a completely different SHA-256 digest, illuminating an immediate Divergence Warning.",
        learningOutcomes: [
          "Understand the mathematical properties of deterministic canonical JSON serialization.",
          "Audit the Web Crypto SubtleCrypto SHA-256 pipeline on Desk 17.",
          "Identify and isolate cryptographic divergence alerts upon importing archived records."
        ],
        sections: [
          {
            heading: "I. The Mathematics of Canonical Handover Sealing",
            subheading: "Eliminating Object Key Ordering Variance in Cryptographic Hashing",
            paragraphs: [
              "In standard software runtimes, JSON serialization is non-deterministic: object keys can be serialized in arbitrary order, and differences in whitespace, line endings, or character encoding will yield different binary representations for identical semantic data. If two diplomats hash their respective copies of a treaty, inconsistent key order will produce completely different hash digests, creating false divergence alarms.",
              "The UDCA eliminates this by enforcing Canonical JSON Serialization: all object keys are sorted lexicographically at every level of depth, all extraneous whitespace is stripped, and Unicode strings are normalized using NFC. This ensures that identical mission state vectors always produce bit-for-bit identical UTF-8 byte streams.",
              "This canonical byte stream is then passed directly into `window.crypto.subtle.digest('SHA-256')`, generating an immutable 64-character hexadecimal fingerprint that proves exact data custody without exposing the underlying confidential numbers to public networks."
            ]
          }
        ],
        quiz: [
          {
            id: "q3-2-1",
            question: "What is the critical prerequisite before passing mission data into the SHA-256 hashing algorithm?",
            options: [
              {
                id: "opt-a",
                text: "Compressing the file with a ZIP utility.",
                explanation: "Incorrect. Compression algorithms vary across platforms and destroy deterministic hashing.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Sorting all object keys lexicographically and normalizing whitespace into canonical JSON.",
                explanation: "Correct. Deterministic sorting guarantees that identical mission states produce identical binary digests.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Translating all narrative fields into Latin.",
                explanation: "Incorrect. The doctrine preserves original language records under strict Unicode normalization.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Encrypting the payload with an external commercial API key.",
                explanation: "Incorrect. The UDCA relies strictly on browser-native Web Crypto without external APIs.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "buffer-zeroization",
        number: "3.3",
        eyebrow: "Module III · Chapter 3.3",
        title: "The Chancellery Sentinel: Air-Gap Integrity, DOM Canaries & Zeroization",
        estimatedMinutes: 30,
        executiveLede: "The Chancellery Sentinel serves as the digital praetorian guard of the dashboard. It manages the single inactivity timer, monitors the DOM canary against unauthorized script injection, and executes panic zeroization.",
        statutoryNotice: "Sentinel Mandate: Two idle timers shall never race. The Sentinel owns the sole inactivity countdown, DOM watchdog, and clipboard eviction cycle.",
        learningOutcomes: [
          "Configure the Sentinel inactivity countdown and wall-time verification mechanism.",
          "Understand how DOM canaries detect unauthorized extension tampering or DOM manipulation.",
          "Execute the panic-key sequence (Escape) to zeroize session tokens and redirect to secure login."
        ],
        sections: [
          {
            heading: "I. Defending the Local Runtime Against Physical and Digital Intrusion",
            subheading: "Inactivity Expiry, Clipboard Scrubbing, and Panic Zeroization",
            paragraphs: [
              "When an operator works inside a physical chancellery or hostile diplomatic venue, security risks include both remote surveillance and physical shoulder surfing or device abandonment.",
              "The Sentinel enforces a single, pinned inactivity countdown. Unlike standard web timers that can be fooled by computer sleep or background tab throttling, the Sentinel calculates real elapsed wall-clock time between animation frames. If the operator steps away from the terminal for more than the configured security threshold, the Sentinel locks the display and masks all sensitive narrative fields.",
              "Furthermore, if an operator presses the designated panic key sequence (Escape), the system immediately overwrites ephemeral session buffers, evicts confidential text from the OS clipboard, and redirects the browser back to the unauthenticated login screen."
            ]
          }
        ],
        quiz: [
          {
            id: "q3-3-1",
            question: "Why does the Chancellery Sentinel use real elapsed wall-clock time rather than a simple setInterval loop to track inactivity?",
            options: [
              {
                id: "opt-a",
                text: "Because setInterval consumes too much battery power.",
                explanation: "Incorrect. Battery optimization is minor compared to security integrity.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Because background tab throttling and laptop sleep modes freeze setInterval, which could leave an abandoned session unlocked for hours.",
                explanation: "Correct. Wall-clock delta verification ensures that if a laptop lid is closed and opened later, the session immediately recognizes expired time and locks.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Because wall-clock time is required by international maritime law.",
                explanation: "Incorrect. Maritime rules do not govern browser timer architecture.",
                correct: false
              },
              {
                id: "opt-d",
                text: "To sync the display countdown with satellite atomic clocks.",
                explanation: "Incorrect. The Sentinel runs offline and does not connect to external time servers.",
                correct: false
              }
            ]
          }
        ]
      }
    ]
  },
  {
    id: "relational-mathematics",
    number: "04",
    eyebrow: "Module IV · Relational Physics",
    title: "Canonical Mathematics & Relational Physics",
    summary: "Formal derivations and mathematical proofs of the core equations governing the UDCA: Rupture Index (R), Decay Horizon (tau), Asymmetry Distance, Dominum Index, and Escrow Conservation.",
    chapters: [
      {
        id: "rupture-index-proof",
        number: "4.1",
        eyebrow: "Module IV · Chapter 4.1",
        title: "The Rupture Index (R): Load-to-Bond Derivation",
        estimatedMinutes: 35,
        executiveLede: "The Rupture Index (R) formalizes treaty fragility into a single, bounded dimension. It measures the ratio of total inscribed environmental stress to the limiting Liebig bond, adjusted by operational trend velocity.",
        statutoryNotice: "Canonical Formula: R = (L / min(B_i)) * (1 + mu_trend). Any covenant where R >= 1.20 is in Acute Rupture.",
        learningOutcomes: [
          "Derive the Rupture Index from first principles of structural load mechanics.",
          "Calculate R given multi-bond state vectors and diverse inscribed stress loads.",
          "Interpret the sub-critical (< 0.80), warning (0.80–1.19), and rupture (>= 1.20) zones."
        ],
        sections: [
          {
            heading: "I. Mathematical Derivation of R",
            subheading: "Expressing Sovereign Fragility as a Stress-to-Yield Ratio",
            paragraphs: [
              "In mechanical engineering, the safety factor of a structural truss is computed by dividing its ultimate tensile strength by the applied mechanical load. When load exceeds yield strength, plastic deformation occurs, followed by catastrophic shear fracture.",
              "The UDCA inverts this formulation to produce a vulnerability index, the Rupture Index (R). The numerator is total inscribed stress load (L), representing domestic economic pressures, military skirmishes, and political friction. The denominator is strictly the Liebig minimum bond: min(B_ip, B_comm, B_igen, B_inst).",
              "This base ratio is then scaled by an operational trend modifier (mu_trend): deteriorating trends apply a 1.15 multiplier, static conditions apply 1.00, and verified improving trajectories apply a 0.85 dampener. If R exceeds 1.20, the covenant has entered plastic deformation: the treaty is actively rupturing."
            ]
          }
        ],
        quiz: [
          {
            id: "q4-1-1",
            question: "Given an inscribed stress load of L = 0.40, a state vector with min(B) = 0.25, and a deteriorating trend (mu_trend = +0.15), what is the computed Rupture Index (R)?",
            options: [
              {
                id: "opt-a",
                text: "R = 0.84 (Stable Zone)",
                explanation: "Incorrect. Review the arithmetic: 0.40 / 0.25 = 1.60. Multiplying by 1.15 yields 1.84.",
                correct: false
              },
              {
                id: "opt-b",
                text: "R = 1.84 (Acute Rupture Zone)",
                explanation: "Correct. (0.40 / 0.25) * 1.15 = 1.60 * 1.15 = 1.84. This exceeds the 1.20 rupture threshold, signaling imminent structural collapse.",
                correct: true
              },
              {
                id: "opt-c",
                text: "R = 1.05 (Warning Zone)",
                explanation: "Incorrect. This calculation fails to account for the low limiting bond denominator.",
                correct: false
              },
              {
                id: "opt-d",
                text: "R = 0.15 (Pristine Reserve)",
                explanation: "Incorrect. The formula indicates severe fragility, not pristine stability.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "decay-horizon-half-life",
        number: "4.2",
        eyebrow: "Module IV · Chapter 4.2",
        title: "The Decay Horizon (tau): Exponential Half-Life Modeling",
        estimatedMinutes: 30,
        executiveLede: "Unresolved diplomatic crises do not decay linearly; they accelerate exponentially. The Decay Horizon (tau) models how elevated rupture indices collapse the operational half-life of a peace accord.",
        statutoryNotice: "Axiom: Doubling the Rupture Index causes an exponential drop in available diplomatic resolution time.",
        learningOutcomes: [
          "Apply the exponential decay equation tau = tau_0 * e^(-lambda * R) to diplomatic crises.",
          "Identify the compression of negotiation windows as R approaches acute thresholds.",
          "Structure emergency de-escalation actions to restore temporal runway."
        ],
        sections: [
          {
            heading: "I. The Non-Linear Compression of Diplomatic Time",
            subheading: "Why Procrastination in Acute Crises Is Catastrophic",
            paragraphs: [
              "Novice diplomats often assume that if a territorial dispute has simmered for ten years, they have ample time to deliberate over future terms. This linear fallacy ignores the exponential dynamics of relational decay.",
              "When a crisis flares and R rises above 1.0, the temporal runway collapses according to the exponential formula tau = tau_0 * e^(-lambda * R). Public media outrage expands, military mobilizations become difficult to reverse, and domestic political costs of compromise skyrocket.",
              "A window of opportunity that spanned six months during baseline conditions can shrink to forty-eight hours when R enters acute rupture. Desk 08 computes this live horizon to warn leadership when immediate stabilization is mandatory."
            ]
          }
        ],
        quiz: [
          {
            id: "q4-2-1",
            question: "Why does the Decay Horizon (tau) drop exponentially rather than linearly as the Rupture Index rises?",
            options: [
              {
                id: "opt-a",
                text: "Because sovereign debt interest compounds continuously on foreign exchanges.",
                explanation: "Incorrect. Debt interest is financial, whereas tau models overall crisis stability time.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Because elevated stress induces positive feedback loops (media escalation, military mobilization, reciprocal threats) that rapidly destroy the remaining window for compromise.",
                explanation: "Correct. Acute stress accelerates escalatory cycles exponentially, destroying the diplomatic runway.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Because international court dockets automatically schedule trials within 14 days.",
                explanation: "Incorrect. Tribunal proceedings are notoriously slow and not the cause of rapid crisis decay.",
                correct: false
              },
              {
                id: "opt-d",
                text: "To conform to standard radioactive decay tables in physics textbooks.",
                explanation: "Incorrect. While borrowing mathematical models from physical decay, the application is grounded in diplomatic reality.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "asymmetry-distance",
        number: "4.3",
        eyebrow: "Module IV · Chapter 4.3",
        title: "Normalized Asymmetry Distance (Delta_asym)",
        estimatedMinutes: 30,
        executiveLede: "Power disparities across military, economic, institutional, and informational axes prevent genuine compromise. The UDCA models asymmetry using normalized 4-dimensional Euclidean distance.",
        statutoryNotice: "Formula: Delta_asym = sqrt( sum( (Coord_A - Coord_B)^2 ) / 4 ). If Delta_asym >= 0.70, bilateral negotiations are prone to coercive dictation.",
        learningOutcomes: [
          "Plot negotiating parties in 4D power coordinate space.",
          "Calculate normalized Euclidean distance between delegation capabilities.",
          "Deploy third-party escrow buffers to neutralize high power differentials."
        ],
        sections: [
          {
            heading: "I. Quantifying Structural Power Disparities",
            subheading: "Preventing Coercive Imbalance from Masquerading as Consent",
            paragraphs: [
              "When a superpower sits down with a small developing nation, calling the negotiation 'bilateral diplomacy between sovereign equals' is a legal fiction. If the superpower possesses a military coordinate of 0.95 and the smaller nation sits at 0.10, the shadow of kinetic force permeates every draft clause.",
              "Desk 03 normalizes all four power coordinates between 0.00 and 1.00 and computes the Euclidean distance Delta_asym. If Delta_asym exceeds 0.70, the weaker party cannot freely withhold consent. The UDCA flags this structural imbalance and mandates third-party arbitral guarantees or neutral escrow holdbacks before certifying the accord."
            ]
          }
        ],
        quiz: [
          {
            id: "q4-3-1",
            question: "When Delta_asym >= 0.70, what structural safeguard does the UDCA recommend to preserve sovereign fairness?",
            options: [
              {
                id: "opt-a",
                text: "Canceling all peace talks permanently.",
                explanation: "Incorrect. The goal is fair resolution, not abandonment of dialogue.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Mandating neutral third-party escrow holdbacks, international legal arbitration, or multilateral guarantees to counterbalance bilateral coercion.",
                explanation: "Correct. Neutral third-party instruments neutralize raw power disparities, protecting sovereign dignity.",
                correct: true
              },
              {
                id: "opt-c",
                text: "Giving the weaker nation unilateral control over the stronger nation's armed forces.",
                explanation: "Incorrect. Unrealistic structural transfers are impossible in sovereign statecraft.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Ignoring the disparity because international law treats all states as formally equal.",
                explanation: "Incorrect. Relying on formal legal fiction while ignoring raw asymmetry leads to unviable, coercive treaties.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "dominum-index-proof",
        number: "4.4",
        eyebrow: "Module IV · Chapter 4.4",
        title: "The Dominum Index (D): Holistic Mission Synthesis",
        estimatedMinutes: 35,
        executiveLede: "The Dominum Index (D) combines the Liebig bond minimum, the Rupture Index, the Decay Horizon, and forum compliance into a unified health coefficient between 0 and 100.",
        statutoryNotice: "Clearance Gate: A mission requires D >= 75 and min(B) >= 0.30 to qualify for final statutory handover certification.",
        learningOutcomes: [
          "Understand the multi-variable synthesis of the holistic Dominum Index.",
          "Verify that Dominum telemetry correctly reflects all 18 desks without parallel stores.",
          "Audit the final readiness score on Desk 15 before handover."
        ],
        sections: [
          {
            heading: "I. The Comprehensive Synthesis of Statecraft Health",
            subheading: "Translating Discrete Operational Desks into an Integrated Sovereign Metric",
            paragraphs: [
              "A chief chancellery operator cannot present sixteen disconnected charts to a prime minister or head of state during an international summit. Leadership requires a unified, mathematically defensible synthesis that captures whether the overall covenant is strengthening or deteriorating.",
              "The Dominum Index (D) provides this synthesis on Desk 15. It incorporates the limiting bond capacity, the inverse of rupture stress, the stability of the escrow waterfall, and the admissibility of the arbitral forum into a score from 0 to 100.",
              "A score of D >= 75 indicates a self-sustaining custodial relationship where relational yield far outweighs coercive friction. A score between 50 and 74 indicates a vulnerable accord requiring continuous diplomatic maintenance. A score below 50 indicates systemic failure."
            ]
          }
        ],
        quiz: [
          {
            id: "q4-4-1",
            question: "What are the minimum conditions for a mission to achieve statutory clearance on Desk 15?",
            options: [
              {
                id: "opt-a",
                text: "D >= 75 and min(B) >= 0.30 with zero unmitigated redlines.",
                explanation: "Correct. The Dominum Index must exceed 75 and the limiting bond must sit above 0.30, with all redlines resolved.",
                correct: true
              },
              {
                id: "opt-b",
                text: "A simple majority vote among the negotiating delegates.",
                explanation: "Incorrect. The UDCA relies on mathematical thresholds, not subjective political votes.",
                correct: false
              },
              {
                id: "opt-c",
                text: "An average bond score of 0.50 regardless of rupture index.",
                explanation: "Incorrect. Average scores are forbidden by Liebig's Law of the Minimum.",
                correct: false
              },
              {
                id: "opt-d",
                text: "Full payment of foreign consultancy fees.",
                explanation: "Incorrect. Commercial fees have no bearing on sovereign structural integrity.",
                correct: false
              }
            ]
          }
        ]
      },
      {
        id: "escrow-conservation-proof",
        number: "4.5",
        eyebrow: "Module IV · Chapter 4.5",
        title: "Conservation of Value in Escrow Waterfalls",
        estimatedMinutes: 30,
        executiveLede: "Financial and resource escrows must follow strict mathematical conservation: total assets must equal the sum of active, released, contested, and frozen tranches with zero leakage.",
        statutoryNotice: "Conservation Law: sum(Tranche_i) = Escrow_total. No funds may enter or exit the trust without an auditable verification proof.",
        learningOutcomes: [
          "Apply the conservation of value equation across all four escrow tranches on Desk 14.",
          "Verify milestone fulfillment criteria before releasing capital disbursements.",
          "Execute automated freeze procedures when counterpart breach conditions are met."
        ],
        sections: [
          {
            heading: "I. Fiduciary Integrity in Post-Conflict and Resource Statecraft",
            subheading: "Preventing Capital Siphoning and Unverified Concessions",
            paragraphs: [
              "In historical peace accords and resource treaties, financial assistance and concession fees are often siphoned away through corrupt intermediaries or released prematurely before compliance milestones are met. Once funds are dispersed, the paying state loses all leverage, and the recipient state has no incentive to carry out difficult institutional reforms.",
              "Desk 14 enforces the Escrow Waterfall under strict mathematical conservation: at any moment in time, the sum of all tranches (active, released, contested, frozen) must exactly equal total committed capital: sum(T_i) = E_total.",
              "Funds are held in neutral custody and released in discrete stages: Tranche 1 (initial demilitarization baseline), Tranche 2 (joint boundary survey verification), Tranche 3 (civilian administration handover), and Tranche 4 (final boundary treaty ratification). If a breach occurs at Stage 2, remaining tranches are automatically locked, preserving capital and enforcing treaty compliance."
            ]
          }
        ],
        quiz: [
          {
            id: "q4-5-1",
            question: "Under the conservation law of Desk 14, what occurs if the counterpart deploys armed forces into a demilitarized corridor after Tranche 1 has been released?",
            options: [
              {
                id: "opt-a",
                text: "Tranche 2 is automatically doubled to appease the counterpart.",
                explanation: "Incorrect. Paying extra funds in response to military provocation constitutes appeasement and encourages further bad faith.",
                correct: false
              },
              {
                id: "opt-b",
                text: "Desk 14 triggers an immediate automated freeze on all unreleased tranches (Tranches 2, 3, and 4), halting capital flow until compliance is restored.",
                explanation: "Correct. Automated freeze prevents the adversary from collecting funds while violating treaty invariants.",
                correct: true
              },
              {
                id: "opt-c",
                text: "The escrow trust dissolves and donates all assets to charity.",
                explanation: "Incorrect. Assets remain preserved in sovereign trust under dispute jurisdiction.",
                correct: false
              },
              {
                id: "opt-d",
                text: "The operator must manually forge the milestone checklist to keep talks moving.",
                explanation: "Incorrect. Forging milestones is a criminal breach of the Chancellery Covenant.",
                correct: false
              }
            ]
          }
        ]
      }
    ]
  }
];
