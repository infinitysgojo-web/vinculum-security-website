import type { DetailedAcademyChapter } from "./academyTypes";
import { F_SEAL } from "./academyFormulas";

export const CHAPTER_1_4: DetailedAcademyChapter = {
  id: "chancellery-covenant",
  number: "1.4",
  eyebrow: "Module I · Chapter 1.4",
  title: "The Chancellery Covenant & The Operator Custodial Duty",
  estimatedMinutes: 42,
  executiveLede: "Diplomatic institutions have frequently succumbed to political expediency, doctoring intelligence cables, bluffing in negotiations, and altering historical records to fit shifting domestic narratives. The Chancellery Covenant establishes the operator non-negotiable custodial duty: to preserve mathematical truth, eliminate asymmetric bluffing through cryptographic pre-commitment, guard air-gap integrity, and refuse all partisan distortion of sovereign telemetry.",
  synopsis: [
    "The Chancellery operator is not a political advocate, an ideological partisan, or a public relations operative. The operator is a sworn fiduciary trustee of the diplomatic record, bound by the constitutional mandate of the Unified Deterministic Chancellery Apparatus.",
    "When political superiors demand that telemetry readings be softened or that rupture risks be concealed to facilitate an ill-advised summit, the operator stands as the final structural defense against systemic delusion.",
    "This chapter examines the ethical architecture of the Chancellery Covenant, details the elimination of diplomatic bluffing through pre-negotiation verification ledgers, formalizes the air-gap defenses of the Sentinel Matrix, and establishes the formal oath of the sovereign plenipotentiary.",
  ],
  statutoryNotice: "Statutory Invariant: An operator who alters, suppresses, or fabricates sovereign telemetry commits an irremediable constitutional breach against the Chancellery covenant.",
  learningOutcomes: [
    "Internalize the constitutional role of the Chancellery operator as an impartial fiduciary of relational truth.",
    "Deploy the Chancellery Sentinel to protect local telemetry against hostile injection, extension snooping, and unauthorized tampering.",
    "Execute the statutory dissent protocol when pressured by political principals to falsify risk readings.",
    "Audit mission decision logs for provenance integrity using cryptographic verification digests and canonical JSON serialization.",
  ],
  sections: [
    {
      heading: "I. The Fiduciary Mandate of the Sovereign Operator",
      subheading: "Impartial Custody in an Age of Political Expediency",
      paragraphs: [
        "In modern governance, diplomatic reporting is constantly subjected to intense domestic political pressure. Ministers and heads of state are driven by electoral cycles, media narratives, and short-term opinion polls. Consequently, there exists a pervasive temptation to distort intelligence assessments, exaggerate diplomatic triumphs, and conceal mounting structural risks to engineer temporary political victories.",
        "The Unified Deterministic Chancellery Apparatus (UDCA) was engineered specifically to break this cycle of self-deception. The Chancellery operator occupies an autonomous constitutional station, analogous to a high court judge or a central bank auditor. The operator allegiance is not to the transient incumbent administration, but to the permanent sovereign health of the nation and its treaty covenants.",
        "The operator does not negotiate treaties to please superiors; the operator measures the structural physics of relationships. If a proposed accord will induce dangerous shear stresses or trigger catastrophic rupture, the operator must register that fact on the mission ledger without equivocation.",
      ],
      caseStudy: {
        title: "The Structural Falsification of the Gulf of Tonkin Incident (1964)",
        jurisdiction: "United States Executive Branch / Southeast Asia Theatre",
        precedent: "The deliberate suppression and manipulation of naval radar telemetry to justify armed conflict",
        analysis: [
          "In August 1964, naval communications and radar telemetry regarding an alleged second North Vietnamese torpedo boat attack on the USS Maddox were ambiguous, contradictory, and heavily influenced by sonar false returns in rough seas.",
          "Rather than conducting a rigorous, independent technical audit, executive officials selected and distorted fragmented intelligence cables to present an unequivocal narrative of unprovoked aggression to Congress, resulting in the Gulf of Tonkin Resolution.",
          "The deliberate politicization of operational telemetry committed the nation to a ten-year war that claimed millions of lives, eroded public trust, and caused catastrophic domestic and international rupture.",
        ],
        failureMechanism: "The subordination of technical telemetry verification to executive political convenience produced fatal strategic overextension.",
      },
      subsections: [
        {
          title: "The Epistemological Integrity of the Ledger",
          paragraphs: [
            "In the UDCA, every operator action, slider adjustment, and gate clearance is recorded in the append-only Chronological Mission Decision Log.",
            "Each log entry is paired with a microsecond-accurate UTC timestamp and a cryptographic hash of the current bus state. Once an entry is committed, it cannot be edited, overwritten, or deleted by any administrative authority.",
            "This immutable record provides permanent provenance. Decades later, future generations can audit the exact data that informed a historic decision, eliminating the possibility of retroactive historical revisionism.",
          ],
          callout: {
            kind: "bridge",
            title: "Bridge to Desk 18: Tamper-Evident Handover",
            paragraphs: [
              "Desk 18 gathers the complete mission trajectory into a canonical JSON export, computes a SHA-256 seal using the browser Web Crypto API, and generates a cryptographic attestation badge that verifies custody without leaking underlying intelligence.",
            ],
          },
        },
      ],
      statutoryRule: "Rule 1.4-A: Any attempt by an operator or administrative superior to modify, backdate, or purge historical decision log entries triggers an automated audit lockdown.",
    },
    {
      heading: "II. The Elimination of Diplomatic Bluff and the Epistemology of Proof",
      subheading: "Game Theory, Cheap Talk, and Pre-Negotiation Verification Ledgers",
      paragraphs: [
        "In classical diplomacy, negotiations are frequently dominated by strategic bluffing: delegations make exaggerated threats, feign walkout intentions, and present unverifiable resource claims to extract concessions from risk-averse counterparts. In game theory, this dynamic is known as cheap talk.",
        "While bluffing can occasionally yield short-term tactical advantages, it is poison to long-term relational stability. When treaties are signed based on unverified bluffs, the subsequent discovery of operational reality results in immediate accusations of bad faith, treaty renegotiation demands, and rapid escalation into armed standoff.",
        "The UDCA eliminates diplomatic bluffing through pre-negotiation verification ledgers (Desk 08). Prior to substantive negotiations, both parties are required to submit canonical data commitments regarding troop deployments, hydrological flows, or economic reserves, sealed with cryptographic digests.",
      ],
      caseStudy: {
        title: "The 1914 July Crisis and the Catastrophe of Strategic Ambiguity",
        jurisdiction: "European Imperial Concert of Nations",
        precedent: "Ambiguous alliance commitments and unverified diplomatic bluffs triggering continental war",
        analysis: [
          "In the weeks following the assassination of Archduke Franz Ferdinand in Sarajevo, European diplomacy degenerated into a series of catastrophic bluffs and ambiguous communications.",
          "Imperial Germany offered Austria-Hungary the infamous blank check, bluffing that firm Austro-Hungarian action would deter Russian mobilization. Great Britain refused to state unequivocally whether it would enter the war if Belgian neutrality were violated, leading German military planners to assume Britain would remain neutral.",
          "Because neither side could verify the true threshold of foreign intervention, all parties mobilized their armed forces in rapid succession. Within thirty days, unhedged diplomatic bluffs plunged the entire European continent into four years of industrial slaughter.",
        ],
        failureMechanism: "The total absence of verifiable communication channels and the reliance on strategic bluffing triggered irreversible military mobilization chains.",
      },
      subsections: [
        {
          title: "The Pre-Commitment Invariant",
          paragraphs: [
            "Under the Chancellery Covenant, an operational commitment cannot be registered on the MissionEngine bus unless it is accompanied by a verifiable cryptographic hash of prerequisite evidence.",
            "This mechanism guarantees that neither party can bluff about troop redeployments or resource reserves: if the cryptographic evidence digest does not verify against the canonical schema, the proposal is rejected at the gate.",
          ],
          callout: {
            kind: "definition",
            title: "Anti-Bluff Invariant",
            paragraphs: [
              "A diplomatic statement constitutes verifiable evidence if and only if it is tethered to an independent sensory or cryptographic data record whose provenance can be audited by third-party verifiers.",
            ],
          },
        },
      ],
      statutoryRule: "Rule 1.4-B: Verbal diplomatic assurances lacking cryptographic pre-commitment hashes cannot be admitted into mission evidence registers.",
    },
    {
      heading: "III. The Chancellery Sentinel and Air-Gap Defense",
      subheading: "Technical Countermeasures Against Unauthorized Interference",
      paragraphs: [
        "To protect the operator from external coercion, surveillance, and cyber interception, the UDCA operates within an air-gapped, browser-local runtime environment.",
        "The Chancellery Sentinel runs continuously in the background, executing cryptographic DOM canary checks every 10 seconds to verify that foreign browser extensions or hostile scripts have not injected tampering hooks into the application memory.",
        "Furthermore, the Sentinel manages an automated inactivity timer: if the operator workstation is unattended for more than the statutory deadline, the entire mission state is zeroized from active RAM and sealed into encrypted local storage.",
      ],
      subsections: [
        {
          title: "The Panic Purge Protocol",
          paragraphs: [
            "In high-stakes diplomatic missions in foreign capitals, physical custody of the operator workstation may be threatened by hostile security services.",
            "The Chancellery Sentinel incorporates a hardware panic key combination (Escape Escape). When engaged, the system instantly overwrites all cryptographic keys, clears session storage buffers, and renders the operational enclave completely unrecoverable.",
            "No foreign intelligence agency can extract mission data from a zeroized memory space.",
          ],
        },
      ],
      statutoryRule: "Rule 1.4-C: The Chancellery Sentinel must maintain uninterrupted background supervision; disabling DOM canaries or extending inactivity timers beyond statutory limits invalidates mission attestation.",
    },
    {
      heading: "IV. The Statutory Dissent Protocol and the Plenipotentiary Oath",
      subheading: "Institutional Mechanics for Defending Truth Under Pressure",
      paragraphs: [
        "What must an operator do when a senior cabinet minister orders them to override a Critical Rupture warning to announce a political victory?",
        "Under the Chancellery Covenant, the operator possesses a legally protected Right of Statutory Dissent.",
        "The operator is prohibited from silently complying with the unlawful order. Instead, the operator executes the formal Dissent Procedure: the minister order is recorded verbatim on the ledger alongside the unmanipulated telemetry readings, and the record is sealed with the Chancellery Dissent Digest. If the minister proceeds, the minister assumes sole personal constitutional liability for the subsequent collapse.",
      ],
      subsections: [
        {
          title: "The Solemn Oath of the Sovereign Plenipotentiary",
          paragraphs: [
            "Before receiving operational credentials, every Chancellery operator affirms the Solemn Oath of the Sovereign Plenipotentiary:",
            "'I solemnly swear to serve as an incorruptible custodian of sovereign relational truth. I will measure without fear, report without distortion, and guard without compromise. I will defend the air-gap of this Chancellery against foreign adversary and domestic political pressure alike. So long as I hold this office, mathematical invariants shall prevail over transient ambition.'",
          ],
        },
      ],
      statutoryRule: "Rule 1.4-D: When ordered by political principals to falsify risk readings, the operator must execute the Statutory Dissent Procedure, recording the directive alongside unmanipulated telemetry.",
    },
  ],
  practice: [
    {
      problem: "During a tense multilateral summit, the Minister of Foreign Affairs demands that the operator reduce the recorded Rupture Index from 68 per cent (Critical) to 48 per cent (Guarded) so that the draft treaty can be signed before prime-time television broadcasts. How must the operator respond under the Chancellery Covenant?",
      solution: [
        "Step 1: Refuse the order to falsify telemetry. Rule 1.4-A strictly prohibits altering objective mission readings.",
        "Step 2: Explain the structural reality. Inform the minister that changing the displayed number does not change the physical stress on the ground; signing with a true rupture score of 68 guarantees treaty repudiation within six months.",
        "Step 3: Invoke the Statutory Dissent Protocol. If the minister insists on proceeding, record the ministerial directive as an administrative override on the decision log, keep the live Rupture Index at 68 per cent, generate the Dissent Seal, and archive the sealed package for constitutional oversight.",
      ],
    },
    {
      problem: "A counterpart delegation during a maritime border negotiation offers verbal assurances that their naval coast guard will not patrol a disputed fishing zone, but refuses to sign a cryptographic coordinates protocol. How must the Chancellery operator classify this offer?",
      solution: [
        "Step 1: Apply Rule 1.4-B. Verbal diplomatic assurances lacking cryptographic pre-commitment hashes cannot be admitted into mission evidence registers.",
        "Step 2: Recognize the cheap talk failure mode. Without an immutable data commit, the counterpart can deny having made the assurance or claim operational misunderstanding as soon as domestic political pressure arises.",
        "Step 3: Action. Flag the clause as an Unverified Ambiguity and require automated sensor telemetry registration on Desk 08 before granting clearance.",
      ],
    },
  ],
  quiz: [
    {
      id: "q1-4-1",
      question: "What is the primary constitutional duty of the Chancellery operator under the Vinculum Security Doctrine?",
      options: [
        {
          id: "opt-a",
          text: "To ensure that the ruling political party wins upcoming elections.",
          explanation: "Incorrect. The operator must remain strictly non-partisan and detached from electoral politics.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "To serve as an impartial fiduciary custodian of relational truth and preserve mathematical invariants without distortion.",
          explanation: "Correct. The operator is bound to record objective structural reality regardless of domestic political desires.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "To maximize the monetary profits of state-owned enterprises in bilateral trade.",
          explanation: "Incorrect. Economic profit is secondary to systemic relational stability and sovereign dignity.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "To leak confidential diplomatic cables to international journalists.",
          explanation: "Incorrect. Air-gap integrity and strict confidentiality are paramount custodial duties.",
          correct: false,
        },
      ],
    },
    {
      id: "q1-4-2",
      question: "How does the Chancellery Sentinel protect mission state from physical seizure during hostile incursions?",
      options: [
        {
          id: "opt-a",
          text: "By automatically transmitting all records to an unencrypted commercial cloud server.",
          explanation: "Incorrect. Commercial cloud storage is an insecure vector subject to foreign interception.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "By providing a panic purge protocol (Escape Escape) that zeroizes memory buffers and cryptographic keys instantaneously.",
          explanation: "Correct. The panic purge protocol ensures that unauthorized physical capture leaves zero readable intelligence in memory.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "By initiating an automated cyber attack against the host nation power grid.",
          explanation: "Incorrect. The Chancellery apparatus strictly avoids offensive cyber warfare; it enforces defensive local integrity.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "By calling emergency telephone hotlines.",
          explanation: "Incorrect. The system operates strictly offline within the browser runtime.",
          correct: false,
        },
      ],
    },
    {
      id: "q1-4-3",
      question: "What is the legal function of the Statutory Dissent Protocol?",
      options: [
        {
          id: "opt-a",
          text: "To allow the operator to unilaterally declare war on a counterparty state.",
          explanation: "Incorrect. Operators have no war-making powers; they provide technical evidence and auditing.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "To protect the integrity of the mission record when political superiors order the falsification of risk readings, recording the directive alongside unmanipulated telemetry.",
          explanation: "Correct. The protocol establishes personal constitutional liability for the political principal while ensuring that objective telemetry is permanently preserved.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "To allow diplomats to skip formal treaty ratification in parliament.",
          explanation: "Incorrect. Constitutional ratification remains mandatory for all sovereign accords.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "To automatically delete all previous treaty chapters from the curriculum.",
          explanation: "Incorrect. Curriculum chapters are permanent educational modules.",
          correct: false,
        },
      ],
    },
  ],
  readingList: [
    {
      citation: "Ellsberg, D. (2002). 'Secrets: A Memoir of Vietnam and the Pentagon Papers.' Viking Press.",
      note: "Primary insider account of how political deception and falsified intelligence led to catastrophic foreign policy failure.",
    },
    {
      citation: "Weber, M. (1919). 'Politik als Beruf (Politics as a Vocation).' Duncker & Humblot, Munich.",
      note: "Foundational sociology of the tension between the ethic of conviction and the ethic of responsibility in public administration.",
    },
    {
      citation: "Clark, C. (2012). 'The Sleepwalkers: How Europe Went to War in 1914.' HarperCollins.",
      note: "Masterful historical exposition on how diplomatic bluffing, unverified cables, and ambiguous commitments caused systemic European breakdown.",
    },
    {
      citation: "Vinculum Security Doctrine (2026). 'The Chancellery Operator Custodial Code and Sentinel Protocols.' Chancellery Working Papers Series.",
      note: "The canonical code of conduct governing plenipotentiary operators, anti-bluff verification, and air-gap defense.",
    },
  ],
};
