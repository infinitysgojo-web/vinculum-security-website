import type { DetailedAcademyChapter } from "./academyTypes";
import { F_SEAL } from "./academyFormulas";

type ChapterDiscussion = { title: string; paragraphs: string[] };
type DiscussionSeed = { focus: string; claim: string; illustration: string; evidence: string; limit: string };

const developDiscussions = (seeds: DiscussionSeed[]): ChapterDiscussion[] =>
  seeds.map(({ focus, claim, illustration, evidence, limit }) => ({
    title: focus,
    paragraphs: [
      `The custodial question in ${focus.toLowerCase()} is not whether an operator can eliminate political judgment, but whether judgment is made visible, reviewable, and appropriately bounded. The working claim is that ${claim}. That is a normative commitment of the UDCA curriculum, not a description of a universal office or a claim that every jurisdiction has adopted this specific covenant. Actual authority and professional duties arise from constitutions, statutes, regulations, employment rules, treaties, and the circumstances of a particular office.`,
      `Consider ${illustration}. A careful operator separates the original observation, the source's account, the analyst's inference, and the decision-maker's judgment. Each may be reasonable while differing in confidence and authority. The record should preserve those distinctions instead of laundering an uncertain report into a precise-looking conclusion. Use a contemporaneous chronology, identify the responsible custodian, record material revisions, and make the chain of review clear enough that a later reader can reconstruct how the assessment changed.`,
      `Evidence about ${evidence} should be assessed for provenance, completeness, access restrictions, and incentives. A hash can show that a file is byte-for-byte unchanged relative to a previously recorded digest, but it does not prove that the file is authentic, accurate, complete, lawfully obtained, or interpreted correctly. Independent corroboration and a documented chain of custody remain necessary. The analyst should retain competing explanations, mark missing data, and distinguish verified facts from assertions so that the integrity of the record does not become an unwarranted claim of truth.`,
      `The limitation in this area is that ${limit}. Security controls do not create an air gap merely because software runs in a browser, and an append-only interface does not guarantee that its storage, device, operating system, or administrator is beyond alteration. A sound control design states a threat model: assets, adversaries, access paths, assumptions, and residual risks. It also names what the measure cannot defend against. Honest boundaries are a condition of trust, not a weakness to be hidden from senior officials.`,
      `A responsible implementation begins with the least intrusive control that meets the lawful purpose. Define who may access the data, why they may access it, how long it may be retained, and what process permits correction or challenge. Preserve provenance without collecting unnecessary personal information. Where disclosure could endanger a source, use an authorized classification and access process rather than silently deleting context. Independent review, documented exceptions, and a tested recovery process reduce the risk that a safeguard itself becomes an instrument of arbitrary control.`,
      `In the setting above, the practical exercise is to prepare a short evidence note with four headings in ordinary language: what is known, what is inferred, what remains disputed, and what decision is requested. Attach source descriptions and dates; identify any transformation performed on the data; and record the reviewer and version. If a superior requests a change, ask whether the request corrects evidence, changes an assumption, or seeks to alter the conclusion for political convenience. Preserve the request and response through an authorized, auditable channel.`,
      `Finally, assess the institutional setting before invoking a model-defined rule. A UDCA warning, seal, dissent procedure, or threshold has no independent legal force unless validly adopted under applicable law and delegated authority. The Vienna Convention on the Law of Treaties concerns treaties between states and does not convert an internal training framework into law. Scholars of public administration likewise distinguish personal conscience from lawful duty, accountability, and institutional design. The sound conclusion is limited: transparent records and verification can improve scrutiny, while legal authority and factual responsibility remain with the institutions empowered to exercise them.`,
    ],
  }));

const CHAPTER_1_4_DISCUSSIONS = developDiscussions([
  { focus: "Public service ethics and role morality", claim: "impartial analysis requires fair methods and accountable authority rather than personal infallibility", illustration: "a policy office asked to assess a treaty proposal favored by its political leadership", evidence: "applicable codes, role descriptions, decision records, and accounts of affected parties", limit: "ethical ideals can conflict with lawful secrecy, safety, and duties of loyalty" },
  { focus: "Fiduciary language and actual legal duties", claim: "calling an operator a fiduciary does not itself create a legally recognized fiduciary relationship", illustration: "an analyst whose obligations are set by civil-service rules and employment law", evidence: "jurisdiction-specific statutes, regulations, contracts, and professional standards", limit: "legal duties vary and require advice from authorized counsel" },
  { focus: "Separating fact, inference, and advocacy", claim: "a trustworthy assessment labels observation, source claim, analytic inference, and recommendation separately", illustration: "a disputed report about a cross-border incident used in an urgent ministerial briefing", evidence: "original reports, corroboration, confidence statements, and preserved dissent", limit: "labels do not remove bias and must be applied consistently" },
  { focus: "Document provenance and records management", claim: "an auditable record depends on provenance, controlled revisions, access rules, and retention", illustration: "a mission file revised after new satellite observations arrive", evidence: "version histories, custodial logs, source descriptions, and retention schedules", limit: "an application log is not automatically an official record or legally immutable" },
  { focus: "The Gulf of Tonkin as a historical case", claim: "the 1964 episode illustrates disputed reporting and policy escalation but not a simple story of fabricated radar data", illustration: "the confirmed August 2 encounter and uncertainty surrounding the reported August 4 attack", evidence: "State Department history and declassified records, read with scholarly debate", limit: "retrospective findings should not erase contemporary uncertainty or the broader war context" },
  { focus: "Professional dissent and lawful channels", claim: "raising analytic concerns is different from disclosing protected information or disobeying a lawful order", illustration: "an official asked to omit a material qualification from a classified assessment", evidence: "agency procedures, inspector-general routes, whistleblower protections, and legal advice", limit: "protection and reporting mechanisms differ substantially by jurisdiction" },
  { focus: "Organizational pressure and groupthink", claim: "hierarchy can suppress alternatives even when no individual explicitly orders falsification", illustration: "a review group that narrows its estimates after a senior official signals a preferred outcome", evidence: "draft histories, meeting records, independent red teams, and interview testimony", limit: "a later disagreement does not by itself prove improper pressure" },
  { focus: "Error correction and responsible revision", claim: "a credible record allows corrections without erasing the original basis for earlier decisions", illustration: "an intelligence estimate revised when a source is discredited", evidence: "version control, correction notices, validation dates, and a record of downstream reliance", limit: "preservation rules must coexist with privacy, classification, and lawful deletion requirements" },
  { focus: "Cheap talk and strategic communication", claim: "in signaling theory, costless statements may be uninformative but are not necessarily deceptive", illustration: "a negotiator's public assurance that domestic political constraints limit concessions", evidence: "repeated behavior, institutional incentives, costly signals, and independent verification", limit: "classifying all verbal assurances as worthless ignores how diplomacy uses language" },
  { focus: "Credible commitments and costly signals", claim: "a commitment becomes more credible through incentives and observable follow-through, not by rhetoric alone", illustration: "a ceasefire pledge accompanied by monitoring access and a dispute-resolution channel", evidence: "implementation, verification arrangements, sanctions for breach, and third-party observation", limit: "costly signals may be coercive or strategically staged" },
  { focus: "Cryptographic commitments and their limits", claim: "a cryptographic digest can bind a later disclosure to earlier bytes without proving the claim's truth", illustration: "two delegations committing to sealed maritime coordinates before a joint inspection", evidence: "published algorithms, independent timestamping, custody procedures, and later opening", limit: "the commitment may faithfully preserve false, incomplete, or manipulated input" },
  { focus: "The verification problem", claim: "verification requires a credible observation process as well as a record of the observation", illustration: "a troop-withdrawal claim supported by imagery from only one party's sensor network", evidence: "independent monitors, access rights, sampling plans, and transparent methods", limit: "verification can be obstructed, politicized, or too costly to make conclusive" },
  { focus: "Treaty interpretation and legal authority", claim: "binding international obligations depend on applicable law, consent, entry into force, and interpretation", illustration: "a memorandum whose legal character differs from a ratified treaty", evidence: "the text, context, subsequent practice, reservations, and competent legal analysis", limit: "labels alone do not decide whether an instrument is legally binding" },
  { focus: "The July Crisis and causal complexity", claim: "the 1914 crisis involved interacting decisions, mobilization plans, alliance expectations, and national politics", illustration: "the July ultimatums, mobilizations, and violation of Belgian neutrality", evidence: "diplomatic documents and Christopher Clark's account alongside other historians", limit: "the crisis cannot be reduced to bluffing or to one country's single decision" },
  { focus: "Commitment design in negotiation", claim: "clear scope, sequencing, monitoring, and dispute procedures can reduce avoidable ambiguity", illustration: "a shared river protocol with measurement access and a process for seasonal revisions", evidence: "drafting history, institutional capacity, implementation data, and affected-state positions", limit: "clarity in text cannot resolve every disagreement about facts or changing circumstances" },
  { focus: "Browser security and threat modeling", claim: "a browser-local application is not automatically air-gapped or immune from compromise", illustration: "a workstation that can load software updates and uses extensions or shared profiles", evidence: "network configuration, dependency review, device controls, and security testing", limit: "no client-side canary can reliably detect every hostile process or guarantee complete protection" },
  { focus: "Data minimization and classification", claim: "security practice should minimize retained information and apply lawful access classifications", illustration: "an operator exporting a handover package containing source identities and negotiation positions", evidence: "data inventories, access logs, retention policy, and disclosure review", limit: "classification cannot substitute for sound collection, accurate records, or lawful process" },
  { focus: "Cryptographic hash and seal semantics", claim: "a seal supports integrity checking only when canonicalization, key handling, and verification are sound", illustration: "two operators hashing semantically identical records serialized with different key order", evidence: "published standards such as NIST's Secure Hash Standard and test vectors", limit: "a digest does not encrypt data, authenticate a person, or establish that a statement is true" },
  { focus: "Inactivity controls and safe recovery", claim: "timeouts reduce exposure but must account for operator safety, accessibility, and unsaved work", illustration: "a mission workspace interrupted during a briefing or emergency evacuation", evidence: "tested session behavior, recovery procedures, user research, and incident records", limit: "clearing an interface does not prove that every copy has been securely erased" },
  { focus: "Panic actions and realistic assurance", claim: "a panic affordance can limit casual exposure but cannot promise forensic unrecoverability", illustration: "a device with browser storage, backups, swap space, or operating-system telemetry", evidence: "platform documentation, realistic tests, and an explicit device threat model", limit: "software cannot guarantee instantaneous zeroization of all physical storage" },
  { focus: "Security claims and independent testing", claim: "assurance should be calibrated to tested controls and disclosed residual risk", illustration: "a vendor describing a browser warning as complete defense against extension interference", evidence: "independent assessments, vulnerability disclosures, configuration records, and repeatable tests", limit: "a passing test is bounded by the threats and conditions actually tested" },
  { focus: "Dissent protocol and constitutional accountability", claim: "an internal dissent record can support review but does not transfer legal liability automatically", illustration: "a minister proceeding despite an analyst's documented contrary estimate", evidence: "delegated authority, decision minutes, applicable law, and oversight findings", limit: "a framework cannot declare an official personally liable by its own rule" },
  { focus: "Confidentiality and protected disclosure", claim: "preserving evidence must be reconciled with lawful confidentiality and protected reporting routes", illustration: "an operator asked to retain a sensitive source identity in a broadly accessible log", evidence: "classification rules, privacy law, retention schedules, and authorized audit access", limit: "permanent retention can itself create legal and human risk" },
  { focus: "Oaths, professional identity, and pluralism", claim: "an oath can articulate standards but cannot replace institutional checks, fair process, or law", illustration: "a new operator facing pressure from both domestic leaders and a foreign counterpart", evidence: "comparative public-service ethics, training, review mechanisms, and actual practice", limit: "high-minded language may conceal rather than constrain unchecked authority" },
]);

export const CHAPTER_1_4: DetailedAcademyChapter = {
  id: "chancellery-covenant",
  number: "1.4",
  eyebrow: "Module I · Chapter 1.4",
  title: "The Chancellery Covenant & The Operator Custodial Duty",
  estimatedMinutes: 42,
  executiveLede: "Diplomatic institutions have frequently succumbed to political expediency, doctoring intelligence cables, bluffing in negotiations, and altering historical records to fit shifting domestic narratives. The Chancellery Covenant establishes the operator non-negotiable custodial duty: to preserve mathematical truth, eliminate asymmetric bluffing through cryptographic pre-commitment, guard air-gap integrity, and refuse all partisan distortion of sovereign telemetry.",
  synopsis: [
    "The UDCA presents an aspirational model of impartial recordkeeping, evidence discipline, and accountable analysis. Its use of fiduciary and constitutional language is normative: this curriculum does not confer public office, legal status, or a special legal duty on an operator.",
    "Political pressure can distort analysis, but identifying distortion requires evidence and context. Professional disagreement, a lawful policy choice, and deliberate falsification are distinct matters that must not be conflated.",
    "This chapter examines record provenance, signaling and verification, the actual limits of browser-local safeguards, and ways to raise concerns through channels established by applicable institutional rules and law.",
  ],
  statutoryNotice: "UDCA framework notice: the Covenant, Sentinel procedures, and dissent protocol are proposed internal governance norms, not binding law by virtue of appearing here. Actual duties, authority, confidentiality, retention, and liability depend on applicable law and valid institutional rules.",
  learningOutcomes: [
    "Explain the UDCA's normative ideal of impartial analysis without mistaking it for an enacted constitutional office.",
    "Describe the Sentinel's implemented browser-local safeguards and their threat-model limitations.",
    "Identify authorized channels for raising analytic concerns and distinguish internal procedure from legal rights.",
    "Explain what a canonicalized cryptographic digest can and cannot establish about a handover record.",
  ],
  sections: [
    {
      heading: "I. The Fiduciary Mandate of the Sovereign Operator",
      subheading: "Impartial Custody in an Age of Political Expediency",
      paragraphs: [
        "In modern governance, diplomatic reporting is constantly subjected to intense domestic political pressure. Ministers and heads of state are driven by electoral cycles, media narratives, and short-term opinion polls. Consequently, there exists a pervasive temptation to distort intelligence assessments, exaggerate diplomatic triumphs, and conceal mounting structural risks to engineer temporary political victories.",
        "The UDCA describes an ideal of disciplined public service; it is not an enacted constitutional office. A real analyst's independence, reporting line, confidentiality, and duties depend on the governing constitution, legislation, employment rules, and delegated authority. Comparisons with judges or auditors are analogies, not sources of equivalent powers.",
        "An analyst can report a model result and the evidence behind it, but should not present an index as physical law or a prediction of certain rupture. Recommendations should state uncertainty and alternatives, while the competent decision-maker remains responsible for choices within their authority.",
      ],
      caseStudy: {
        title: "Gulf of Tonkin Reporting and the Escalation of 1964",
        jurisdiction: "United States Executive Branch / Southeast Asia Theatre",
        precedent: "Ambiguous reports, contested interpretation, and congressional authorization in a consequential policy decision",
        analysis: [
          "On August 2, 1964, the USS Maddox reported an encounter with North Vietnamese patrol boats. On August 4, the Maddox and Turner Joy reported another attack, but doubts later emerged about whether that second attack occurred. The reports arrived amid naval operations and a rapidly changing conflict.",
          "The Johnson administration presented the reports to Congress and requested authority to respond. Congress passed the Gulf of Tonkin Resolution on August 7. The U.S. Department of State's historical account notes the later doubts about the August 4 incident; declassified records and subsequent scholarship provide further evidence and remain important to interpretation.",
          "The resolution became a consequential authorization for escalation, but its passage and the later course of the Vietnam War cannot be explained by a simple claim that one operator falsified a single instrument reading. The case is better used to examine uncertainty, executive framing, congressional deliberation, and the need to preserve contrary evidence.",
        ],
        failureMechanism: "A model exercise can examine how uncertainty and political framing affect oversight; it should not substitute a simplified allegation for the documentary and historical record.",
      },
      subsections: [
        {
          title: "The Epistemological Integrity of the Ledger",
          paragraphs: [
            "The application records selected user-driven decisions in a browser-tab session ledger. Its current implementation uses UTC ISO timestamps, keeps the ledger in memory, limits it to a bounded number of entries, and permits an explicit clear; a reload starts a fresh ledger unless the dashboard has separately preserved a lock-state snapshot.",
            "The session ledger is not an immutable, independently witnessed archive. It can be reset or lost with the tab, and its timestamp and contents depend on the client and the information recorded. The handover feature separately hashes a canonical mission payload and stores the seal in session storage for the tab.",
            "A later digest comparison can reveal that the compared payload differs from the sealed bytes, but cannot prove who created the payload, that it was true when recorded, or that no other copy was changed. Long-term evidentiary provenance requires governed records management, independent custody, access controls, and lawful retention.",
          ],
          callout: {
            kind: "bridge",
            title: "Bridge to Desk 18: Tamper-Evident Handover",
            paragraphs: [
              "The handover surface hashes its canonicalized mission payload with browser SubtleCrypto and keeps the seal in session storage for that tab. The payload includes mission information; the hash is an integrity comparison aid, not encryption, proof of truth, or a guarantee of custody.",
            ],
          },
        },
        ...CHAPTER_1_4_DISCUSSIONS.slice(0, 6),
      ],
      statutoryRule: "UDCA Internal Rule 1.4-A: Preserve and explain material changes when the applicable records system permits. The current browser ledger is not immutable and does not trigger an automated audit lockdown; formal recordkeeping duties arise from governing rules and law.",
    },
    {
      heading: "II. Diplomatic Bluff, Signaling, and the Limits of Proof",
      subheading: "Game Theory, Cheap Talk, and Pre-Negotiation Verification",
      paragraphs: [
        "Game theory uses cheap talk for communication that does not directly alter payoffs or impose a cost on the sender. Such communication can be uninformative in some models, but context, reputational incentives, repeated interaction, and shared understandings can make words meaningful. The concept does not imply that diplomacy is generally dominated by deception.",
        "Statements can be mistaken, strategic, incomplete, or truthful. A disagreement after an agreement may arise from changed circumstances, ambiguous drafting, domestic constraints, or different evidence, not necessarily a prior bluff. A sound analysis distinguishes these mechanisms rather than treating every unverifiable statement as bad faith.",
        "The UDCA can use pre-commitment records to organize later comparison, but it does not eliminate bluffing or guarantee truthful inputs. A MissionEngine bus can carry information for an exercise, but a cryptographic digest only binds a later opening to a previously committed data string; independent verification is still needed to establish whether the underlying claim accurately describes troop deployments, water flows, or reserves.",
      ],
      caseStudy: {
        title: "The 1914 July Crisis and the Catastrophe of Strategic Ambiguity",
        jurisdiction: "European Imperial Concert of Nations",
        precedent: "A debated crisis shaped by alliance expectations, mobilization, domestic politics, and decisions by several governments",
        analysis: [
          "The July Crisis followed the assassination of Archduke Franz Ferdinand and involved a sequence of decisions by Austria-Hungary, Germany, Russia, France, Britain, and other actors. Historians debate responsibility, intention, and the relative weight of alliance commitments, military planning, domestic politics, and individual choices.",
          "Germany's assurance of support to Austria-Hungary is commonly called the 'blank cheque,' but reducing it to a bluff obscures how policymakers understood the risk and how the assurance affected subsequent decisions. British policy and the question of intervention over Belgium were also debated; uncertainty should not be recast as a single verified belief shared by all German planners.",
          "Mobilizations and declarations escalated the crisis into a general European war, but neither a hash nor a pre-commitment ledger is a historically established remedy whose absence alone explains the outcome. The case is useful for studying signaling and uncertainty only when read alongside primary diplomatic records and competing histories.",
        ],
        failureMechanism: "A UDCA exercise may examine how uncertain commitments and mobilization decisions interacted; historical explanation remains multi-causal and contested.",
      },
      subsections: [
        {
          title: "The Pre-Commitment Invariant",
          paragraphs: [
            "The course's commitment procedure is a proposed governance convention, not a feature that establishes real-world treaty validity. A mission bus can carry information for an exercise, but a value's presence there does not establish that a state made a commitment or that it is legally binding.",
            "A digest check can establish whether a candidate string matches the committed string under the chosen procedure. It cannot guarantee that the evidence is genuine, complete, independently observed, or honestly characterized; those questions require an agreed verification regime and accountable custodians.",
          ],
          callout: {
            kind: "definition",
            title: "Anti-Bluff Invariant",
            paragraphs: [
              "A cryptographic digest can support integrity checking of specified data. Whether a diplomatic statement is accurate, attributable, admissible, or legally binding depends on evidence, context, applicable law, and the authority of the parties.",
            ],
          },
        },
        ...CHAPTER_1_4_DISCUSSIONS.slice(6, 12),
      ],
      statutoryRule: "UDCA Internal Rule 1.4-B: An exercise may label an assurance unverified until supporting evidence is assessed. No general rule of international law requires cryptographic hashes for diplomatic assurances or excludes unsealed statements as evidence.",
    },
    {
      heading: "III. The Chancellery Sentinel and Browser-Local Security",
      subheading: "Implemented Safeguards, Threat Models, and Residual Risk",
      paragraphs: [
        "The dashboard includes browser-local safeguards, but a browser application is not thereby air-gapped. Network connectivity, the host operating system, browser, dependencies, extensions, device access, and storage remain part of the threat model. The interface should not be used to imply protection beyond controls that have actually been implemented and tested.",
        "The Sentinel observes selected DOM mutations for suspicious added scripts or frames; it is not a cryptographic scan of application memory and does not detect every extension or hostile process. Its inactivity supervision checks elapsed time and calls the dashboard's configured lock or sign-out behavior; it does not itself encrypt or seal all mission state.",
        "The dashboard's lock and panic paths clear selected browser-held state, call the configured vault and clipboard cleanup, and can fail where browser permissions or storage access prevent an operation. These are best-effort client controls, not proof that all physical or forensic copies have been destroyed.",
      ],
      subsections: [
        {
          title: "The Panic Purge Protocol",
          paragraphs: [
            "The application offers a user-triggered panic action; the configured keys are Ctrl+Shift+X or three distinct Escape presses within 600 milliseconds. This is a software shortcut, not a hardware switch, and its behavior is limited to the browser application's own cleanup path.",
            "The cleanup drops selected in-memory key references, clears browser session storage and specified local data, attempts to destroy the local vault, and tries to overwrite the clipboard. Storage APIs can fail, the vault operation can be blocked, and the browser or operating system may retain other copies.",
            "Consequently, the feature is not a guarantee of forensic unrecoverability. Secure deployment requires a tested device and storage threat model, platform-level controls, and an honest description of residual risk.",
          ],
        },
        ...CHAPTER_1_4_DISCUSSIONS.slice(12, 18),
      ],
      statutoryRule: "UDCA Internal Rule 1.4-C: Use the implemented Sentinel controls as one layer of defense and document their limits. The application cannot establish an external statutory deadline or automatically invalidate a real-world mission attestation.",
    },
    {
      heading: "IV. The UDCA Dissent Procedure and the Plenipotentiary Oath",
      subheading: "Institutional Channels for Raising Analytic Concerns",
      paragraphs: [
        "What must an operator do when a senior cabinet minister orders them to override a Critical Rupture warning to announce a political victory?",
        "The UDCA proposes an internal dissent procedure; this curriculum cannot confer a legally protected right or determine whether an instruction is unlawful. An official should use applicable supervisory, legal, inspector-general, or protected-disclosure procedures and seek authorized advice.",
        "Where authorized, a concern can be recorded with the underlying assessment and its uncertainty. The current session ledger is a bounded, in-memory application view, not a guaranteed permanent record or a special dissent seal. It does not automatically transfer legal responsibility to a minister, establish sole personal liability, or excuse an operator from duties imposed by applicable law.",
      ],
      subsections: [
        {
          title: "The Solemn Oath of the Sovereign Plenipotentiary",
          paragraphs: [
            "Before receiving operational credentials, every Chancellery operator affirms the Solemn Oath of the Sovereign Plenipotentiary:",
            "'I solemnly swear to serve as an incorruptible custodian of sovereign relational truth. I will measure without fear, report without distortion, and guard without compromise. I will defend the air-gap of this Chancellery against foreign adversary and domestic political pressure alike. So long as I hold this office, mathematical invariants shall prevail over transient ambition.'",
          ],
        },
        ...CHAPTER_1_4_DISCUSSIONS.slice(18, 24),
      ],
      statutoryRule: "UDCA Internal Rule 1.4-D: Document material disagreements through authorized procedures, preserve the analytic basis where permitted, and seek qualified advice. The curriculum's dissent protocol is not itself a statutory right, legal defense, or liability determination.",
    },
  ],
  practice: [
    {
      problem: "During a summit, a minister asks an analyst to replace a recorded model output with a lower value to support a preferred announcement. The input file contains a documented transcription error, but the minister also wants the corrected value presented without its remaining uncertainty. How should the analyst proceed?",
      solution: [
        "Step 1: Separate a warranted correction from pressure to distort. Verify the source data and correct the transcription error through the authorized process, preserving the original value, the reason for change, the date, and the responsible reviewer where the records rules permit.",
        "Step 2: Recompute the model result from the corrected input using the canonical instrument. Report the resulting value together with the model's scope, assumptions, confidence limitations, and any contrary evidence. A dashboard label is a rule-based reading, not a forecast that a treaty will fail on a particular date.",
        "Step 3: Explain which requested wording is unsupported. Do not remove material uncertainty merely to make the result appear conclusive. Ask the minister to distinguish the analytic finding from the policy choice; authorized officials may make policy decisions, but the analysis should not misstate evidence.",
        "Step 4: If pressure continues, consult applicable supervisory, legal, records, inspector-general, or protected-disclosure procedures. The UDCA describes an internal dissent norm but cannot create a legal right, guarantee a permanent record, or assign personal liability. Use only a lawful and authorized channel for documenting the dispute.",
      ],
    },
    {
      problem: "A counterpart delegation offers a verbal assurance that its coast guard will avoid a disputed fishing zone but declines to commit to a cryptographic coordinates protocol. The sides have not agreed that such a protocol is a condition of the undertaking. How should the analyst assess and communicate the assurance?",
      solution: [
        "Step 1: Record accurately what was said, by whom, in what setting, and with what apparent authority. A verbal statement is evidence that an assurance was made; it is not by itself proof that future patrol behavior will conform or that both parties share the same geographic understanding.",
        "Step 2: Identify the unresolved facts: the zone's coordinates, the duration and scope of the undertaking, permitted exceptions, and the process for raising an alleged breach. Ask the parties to agree on a feasible verification method, which may involve joint coordinates, notices, observers, or another mutually accepted procedure.",
        "Step 3: Explain the limit of a hash. A cryptographic digest could help compare a later file with an earlier commitment, but would not prove the coordinates were accurate, that the patrol occurred, or that the assurance is binding. Do not state that international law excludes verbal assurances or requires cryptographic signatures.",
        "Step 4: Present the assurance with a clear status and uncertainty statement, then route questions about legal effect to qualified counsel. Whether it creates an obligation depends on authority, intent, context, applicable law, and the complete record, not on whether the exercise's gate accepts a particular data format.",
      ],
    },
    {
      problem: "A successor asks whether a matching handover seal proves that the outgoing delegation's factual claims were true and that no one could have altered the record. Explain what the current browser feature actually verifies and design a more responsible handover check.",
      solution: [
        "Step 1: Define the comparison. The feature canonicalizes the selected mission payload and computes a SHA-256 digest in the browser. A later recomputation that matches the stored digest is evidence that the compared canonical bytes have not changed relative to that seal, subject to the trustworthiness of the implementation, device, and stored seal.",
        "Step 2: State what it cannot establish. A digest alone does not authenticate the author, verify the truth or completeness of a claim, establish lawful collection, prove informed consent, or show that the device and storage were never compromised. The seal is stored in this tab's session storage and can be removed or replaced.",
        "Step 3: Verify the handover content independently. Identify each claim's source, collection date, confidence, and outstanding dispute; compare important items against authoritative records or an agreed independent monitor. Confirm that the receiving officer understands the limits and accepts custody through an authorized procedure.",
        "Step 4: Record only information permitted by the classification and retention rules. Use a second custodian or trusted timestamping mechanism only if the institution has approved and tested it. Preserve a clear distinction between the software's integrity signal and the institution's decision that the record is authentic and fit for use.",
      ],
    },
  ],
  quiz: [
    {
      id: "q1-4-1",
      question: "Which statement best describes the operator's role as proposed by the UDCA Covenant?",
      options: [
        {
          id: "opt-a",
          text: "To ensure that the ruling political party wins upcoming elections.",
          explanation: "Incorrect. The framework calls for evidence-led analysis, not partisan advocacy.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "To report evidence and uncertainty honestly, preserve a reviewable analytic record where authorized, and act within applicable law and delegated authority.",
          explanation: "Correct. This describes the framework's professional ideal without claiming that the UDCA itself creates a public office or legal power.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "To maximize the monetary profits of state-owned enterprises in bilateral trade.",
          explanation: "Incorrect. This option mistakes the analyst's role for a substantive policy objective.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "To leak confidential diplomatic cables to international journalists.",
          explanation: "Incorrect. Confidentiality must follow governing rules; leaking records is not the role described by the framework.",
          correct: false,
        },
      ],
    },
    {
      id: "q1-4-2",
      question: "What is an accurate description of the Sentinel's panic action?",
      options: [
        {
          id: "opt-a",
          text: "By automatically transmitting all records to an unencrypted commercial cloud server.",
          explanation: "Incorrect. Commercial cloud storage is an insecure vector subject to foreign interception.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "By offering an application-level panic action that clears selected browser-held state and attempts additional cleanup, without guaranteeing that every copy is erased.",
          explanation: "Correct. The configured shortcut is a browser software control; platform storage, permissions, and residual copies limit any zeroization claim.",
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
          explanation: "Incorrect. The browser application does not place calls; this control is limited to local application cleanup.",
          correct: false,
        },
      ],
    },
    {
      id: "q1-4-3",
      question: "What can the UDCA dissent procedure reasonably accomplish?",
      options: [
        {
          id: "opt-a",
          text: "To allow the operator to unilaterally declare war on a counterparty state.",
          explanation: "Incorrect. Operators have no war-making powers; they provide technical evidence and auditing.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "It can provide an internal method to document an analytic disagreement and route it for review, subject to applicable rules; it does not itself create legal protection or determine liability.",
          explanation: "Correct. A curriculum procedure cannot create legal rights, guarantee permanent preservation, or assign responsibility under a jurisdiction's law.",
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
    {
      id: "q1-4-4",
      question: "What does a matching SHA-256 digest of a handover payload establish by itself?",
      options: [
        {
          id: "opt-a",
          text: "That the payload's factual claims are true and complete.",
          explanation: "Incorrect. A digest operates on bytes; it does not assess factual accuracy or completeness.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "That the compared canonical payload matches the bytes represented by the stored digest, assuming the comparison process is trustworthy.",
          explanation: "Correct. It supports an integrity comparison, but says nothing by itself about authorship, truth, or lawful custody.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "That no administrator, browser, or operating system could have changed the payload before it was sealed.",
          explanation: "Incorrect. A digest does not prove the integrity of the device or the source data before hashing.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "That the handover constitutes a treaty binding on both states.",
          explanation: "Incorrect. Treaty status and legal effect depend on applicable law and the parties' authority and intent, not on a digest.",
          correct: false,
        },
      ],
    },
  ],
  readingList: [
    {
      citation: "U.S. Department of State, Office of the Historian. 'U.S. Involvement in the Vietnam War: The Gulf of Tonkin and Escalation, 1964.'",
      url: "https://history.state.gov/milestones/1961-1968/gulf-of-tonkin",
      note: "Official historical overview of the reported August 1964 incidents, the resolution, and later escalation. It notes uncertainty about the reported August 4 attack; read alongside declassified records and scholarship.",
    },
    {
      citation: "United States Congress. Gulf of Tonkin Resolution, Pub. L. 88-408, 78 Stat. 384 (1964), H.J. Res. 1145.",
      url: "https://www.govinfo.gov/content/pkg/STATUTE-78/pdf/STATUTE-78-Pg384.pdf",
      note: "Primary statutory text authorizing presidential action in Southeast Asia. It documents what Congress enacted, not the truth of every factual claim made during the debate.",
    },
    {
      citation: "United Nations. (1969). 'Vienna Convention on the Law of Treaties.' United Nations Treaty Series, vol. 1155, p. 331.",
      url: "https://legal.un.org/ilc/texts/instruments/english/conventions/1_1_1969.pdf",
      note: "Primary treaty text relevant to treaty-making, entry into force, interpretation, and the distinction between an internal UDCA rule and binding international obligations.",
    },
    {
      citation: "National Institute of Standards and Technology. (2015). 'Secure Hash Standard.' FIPS PUB 180-4. https://doi.org/10.6028/NIST.FIPS.180-4",
      url: "https://www.nist.gov/publications/secure-hash-standard",
      note: "Primary technical standard for SHA-256. It defines a hash function, not a way to prove the truth, authorship, or completeness of a claim.",
    },
    {
      citation: "National Institute of Standards and Technology. (2020). 'Security and Privacy Controls for Information Systems and Organizations.' SP 800-53 Rev. 5, Update 1.",
      url: "https://csrc.nist.gov/pubs/sp/800/53/r5/upd1/final",
      note: "Authoritative control catalog for organizational security and privacy programs. It supports risk-based threat modeling; it is guidance, not automatically binding outside the institutions that adopt it.",
    },
    {
      citation: "Schelling, T. C. (2005). 'An Astonishing Sixty Years: The Legacy of Hiroshima.' Prize Lecture, Sveriges Riksbank Prize in Economic Sciences.",
      url: "https://www.nobelprize.org/prizes/economic-sciences/2005/schelling/lecture/",
      note: "A first-person scholarly lecture by a leading strategist on communication, commitment, and nuclear risk; useful context for signaling without equating every assurance with a bluff.",
    },
    {
      citation: "Ellsberg, D. (2002). 'Secrets: A Memoir of Vietnam and the Pentagon Papers.' Viking Press.",
      note: "A participant's memoir and primary perspective on secrecy and policy analysis. Treat it as situated testimony and compare it with documentary and scholarly accounts.",
    },
    {
      citation: "Weber, M. (1919). 'Politik als Beruf (Politics as a Vocation).' Duncker & Humblot, Munich.",
      note: "A primary text for Weber's discussion of political responsibility and vocation; it is not a modern legal code for civil servants.",
    },
    {
      citation: "Jervis, R. (1976). 'Perception and Misperception in International Politics.' Princeton University Press.",
      note: "Foundational scholarship on inference, signaling, and how decision-makers interpret one another under uncertainty.",
    },
    {
      citation: "Clark, C. (2012). 'The Sleepwalkers: How Europe Went to War in 1914.' Allen Lane.",
      note: "A major interpretive history of the July Crisis. Compare its account with other scholarship and primary diplomatic documents; the causes and responsibility remain subjects of historical debate.",
    },
  ],
};
