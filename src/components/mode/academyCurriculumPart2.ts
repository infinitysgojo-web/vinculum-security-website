import type { DetailedAcademyModule } from "./academyTypes";
import { ACADEMY_MODULE_IV } from "./academyModuleIV";
import { F_SEAL } from "./academyFormulas";

/** Module III · Computational Sovereignty, followed by Module IV (academyModuleIV.ts). */

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
        title: "Browser-Local Architecture & the Deterministic Signal Bus",
        estimatedMinutes: 30,
        executiveLede: "Storing sovereign diplomatic intelligence on remote third-party cloud infrastructure exposes bilateral accords to foreign subpoena, interception, and algorithmic harvesting. The UDCA operates strictly within the local browser runtime with zero network persistence: all 18 desks communicate through one closed, deterministic signal bus, the MissionEngine.",
        synopsis: [
          "Traditional enterprise diplomatic software sends sensitive cables and negotiation data to third-party commercial servers, where they fall under the jurisdiction and the subpoena power of the host state. In modern statecraft that is an unacceptable vector for interception, data mining and cross-border discovery.",
          "The UDCA keeps every calculation in the operator's browser. Upstream desks publish their readings on the MissionEngine bus and downstream desks read them; no model, no network call and no external database sits in the chain. Mission records are kept in the browser, sealed into an encrypted enclave when one is configured, and unreadable records are quarantined rather than erased.",
          "This chapter examines why cloud custody undermines sovereign equality, how the signal bus guarantees that every desk reads the same figure, and why the calculations remain fully deterministic when the host is disconnected from the internet.",
        ],
        statutoryNotice: "Architectural Invariant: No mission data, bond readings, or counterpart psychological profiles shall be transmitted across the network or stored in a persistent external database.",
        learningOutcomes: [
          "Analyze the structural counter-intelligence vulnerabilities of cloud-hosted diplomatic workspaces.",
          "Enforce browser-local execution boundaries across all 18 desks.",
          "Explain how the MissionEngine bus gives every desk one deterministic reading, with no parallel store.",
          "Describe how the panic purge zeroizes working state and wipes browser storage."
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
          },
          {
            heading: "II. The Deterministic Signal Bus",
            subheading: "One Chain From Assessment to Handover, With No Parallel Store",
            paragraphs: [
              "All 18 desks share their readings through a single deterministic signal bus. A desk publishes what its own formula computes from what the analyst entered; the desks downstream read the published value and adapt. The mode shell, the inspectors and the Dominum Index read the bus but never publish to it, so no view can hold a figure that differs from the desk that computed it.",
              "Canonical formulas take their inputs through numeric guards: a non-finite bond reads at the 1.0 baseline and a non-finite load or exposure reads as zero, so that missing data can never manufacture health or rupture, and no NaN or infinity reaches the bus, a proof or an export.",
              "Because the bus is pure arithmetic in the browser, the calculations do not depend on any network call. A host disconnected from the internet computes every reading exactly as a connected one does."
            ],
            statutoryRule: "Rule 3.1-A: Every reading is computed once, by its own desk, and read everywhere else from the bus. A view that re-implements a formula is a parallel store and is prohibited."
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
        synopsis: [
          "The Handover Seal serialises the active mission (profile, binder, signals and decision ledger) into canonical JSON, with object keys sorted at every depth, and hashes it with SHA-256 through the browser's own Web Crypto. The digest is a 64-character hexadecimal fingerprint of exactly what was sealed.",
          "Every later change recomputes the hash. A mismatch is a divergence, and the inspector lists the exact parameters that moved. Seals and their breaks are recorded in the Decision Log with UTC timestamps, so tampering cannot be hidden by resealing.",
          "Cryptographic sealing proves integrity and detects divergence; it does not replace sovereign legal ratification, and it proves nothing about the truth of what was sealed.",
        ],
        formulas: [F_SEAL],
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
              "The UDCA eliminates this by enforcing Canonical JSON Serialization: all object keys are sorted lexicographically at every level of depth and no extraneous whitespace is emitted, while array order is preserved. Free text is normalised to NFC when it is pasted or edited, not at hashing time, and a verifier hashes the record exactly as received, so that normalisation can never mask tampering. Identical mission states therefore produce bit-for-bit identical UTF-8 byte streams.",
              "This canonical byte stream is then passed to the browser's SubtleCrypto SHA-256 digest, generating a 64-character hexadecimal fingerprint that proves exact data custody without sending the underlying confidential numbers anywhere."
            ],
            formulas: [F_SEAL],
            statutoryRule: "Rule 3.2-A: A seal is kept in this browser tab only and is cleared by a panic purge. Resealing after a divergence leaves the break on the Decision Log; it never erases it."
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
                text: "Sorting all object keys lexicographically at every depth into canonical JSON.",
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
        executiveLede: "The Chancellery Sentinel serves as the digital praetorian guard of the dashboard. It owns the single inactivity timer, the panic keys and the DOM canary against unauthorized script injection, while the dashboard decides what idle and panic do.",
        synopsis: [
          "Sensitive keys and temporary plaintext must never linger longer than necessary. When the enclave is opened or sealed, the passphrase bytes and working buffers are zeroized as soon as they have been used.",
          "In an emergency, the panic purge (Ctrl+Shift+X, or Escape three times within 600 milliseconds) zeroizes the dashboard's state, wipes browser storage and signs out. Without an unsealed enclave, an idle terminal signs out after 15 minutes; with one, it seals.",
          "No unencrypted mission draft remains in storage beyond the session unless the operator saves it to a mission archive.",
        ],
        statutoryNotice: "Sentinel Mandate: Two idle timers shall never race. The Sentinel owns the sole inactivity countdown, DOM watchdog, and clipboard eviction cycle.",
        learningOutcomes: [
          "Configure the Sentinel inactivity countdown and wall-time verification mechanism.",
          "Understand how DOM canaries detect unauthorized extension tampering or DOM manipulation.",
          "Execute the panic purge (Ctrl+Shift+X or Escape three times) and describe what the dashboard zeroizes."
        ],
        sections: [
          {
            heading: "I. Defending the Local Runtime Against Physical and Digital Intrusion",
            subheading: "Inactivity Expiry, Clipboard Scrubbing, and Panic Zeroization",
            paragraphs: [
              "When an operator works inside a physical chancellery or hostile diplomatic venue, security risks include both remote surveillance and physical shoulder surfing or device abandonment.",
              "The Sentinel enforces a single, pinned inactivity countdown. Unlike standard web timers that can be fooled by computer sleep or background tab throttling, the Sentinel checks real elapsed wall-clock time before renewing the deadline, and checks expiry again whenever the tab regains visibility or focus. When the threshold passes (15 minutes by default), the dashboard seals the workspace into the enclave or, without an unsealed enclave, signs out.",
              "Text the application copied is evicted from the clipboard after the operator has been away from the window for a minute. If the operator triggers the panic purge (Ctrl+Shift+X, or Escape three times within 600 milliseconds), the dashboard zeroizes its working state, wipes browser storage, signs out and returns to sign-in. The Sentinel itself never navigates; only the dashboard decides where the operator goes.",
              "The DOM canary watches for foreign scripts or frames inserted into the page and raises an alert the operator must dismiss."
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
  ACADEMY_MODULE_IV,
];
