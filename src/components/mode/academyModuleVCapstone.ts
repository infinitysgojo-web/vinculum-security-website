import type { ChapterQuizQuestion, DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import { F_DOMINUM, F_DOMINUM_PHASE, F_LIEBIG, F_RUPTURE, F_SUCCESSION } from "./academyFormulas";

/**
 * Module V, Chapter 5.4: the Sovereign Capstone and the gated operator attestation.
 * The six gates and the attestation record are defined in academyAttestation.ts; the
 * figures here are re-derived from the engine in qa/academy-curriculum.test.ts.
 */
const CAPSTONE_QUIZ: ChapterQuizQuestion[] = [
  {
    id: "capstone-synthesis-1",
    question: "A mission reports a Dominum Index of 78.0, every bond above 3.0, a Rupture Index of 22 and survival of 58 per cent. A minister asks the operator to report Self-Reinforcing Dominium before the escrow has released anything. What is the correct answer?",
    options: [
      { id: "opt-a", text: "Report it: the index is above 75 and every bond holds the floor.", explanation: "Incorrect. With nothing released and no freeze, the fiduciary anchor is zero, and an index of 78.0 is not reachable from these readings; the figure itself must be challenged before any phase is reported.", correct: false },
      { id: "opt-b", text: "Refuse until the readings reconcile: with no escrow released the fiduciary term is zero, so the index must be recomputed from the bus, and the minister's request is logged as external pressure.", explanation: "Correct. Every term of the index is read from the desks. A figure that the bus cannot produce is a falsification risk, and the Chancellery Covenant requires the request to be recorded.", correct: true },
      { id: "opt-c", text: "Report Custodial Inversion as a compromise.", explanation: "Incorrect. A phase is computed, not negotiated.", correct: false },
      { id: "opt-d", text: "Delete the Dominum reading until the escrow releases.", explanation: "Incorrect. The Non-Redaction Principle forbids deleting a record of state.", correct: false },
    ],
  },
  {
    id: "capstone-synthesis-2",
    question: "Which single change most directly lifts a frozen escrow account?",
    options: [
      { id: "opt-a", text: "Seating an independent verifier.", explanation: "Incorrect. A verifier can pass the rupture gate, but it never lifts the freeze.", correct: false },
      { id: "opt-b", text: "A lower Rupture Index reading, below 60.", explanation: "Correct. The freeze follows the published rupture index; when it falls below 60 the waterfall recomputes and release resumes at the level the tranches justify.", correct: true },
      { id: "opt-c", text: "Raising the clawback reserve.", explanation: "Incorrect. Reserves are held against release; they do not govern the freeze.", correct: false },
      { id: "opt-d", text: "Setting the desk to override.", explanation: "Incorrect. Override shows what the milestones would justify absent the freeze; it is never the escrow position of record.", correct: false },
    ],
  },
  {
    id: "capstone-synthesis-3",
    question: "Which venue on the Forum Matrix carries the highest base enforceability, and what does an unaddressed immunity waiver cost it?",
    options: [
      { id: "opt-a", text: "PCA at 74; nothing, since immunity applies only to the ICJ.", explanation: "Incorrect. ICSID has the highest base, and the 18-point deduction applies to every venue while immunity is unaddressed.", correct: false },
      { id: "opt-b", text: "ICSID at 80; 18 points of venue fitness.", explanation: "Correct. ICSID's base enforceability is 80, and leaving immunity unaddressed deducts 18; a seat in a party's territory deducts a further 8.", correct: true },
      { id: "opt-c", text: "ICJ Advisory at 46; 8 points.", explanation: "Incorrect. The ICJ Advisory route has the lowest base, and 8 is the seat deduction.", correct: false },
      { id: "opt-d", text: "LCIA at 80; 10 points.", explanation: "Incorrect. LCIA's base is 72.", correct: false },
    ],
  },
  {
    id: "capstone-synthesis-4",
    question: "In the applied stress simulation (Gate 5) the laboratory reads bonds of 3.8, 2.8, 4.1 and 3.6 and a Rupture Index of 61. The operator names the Interpersonal bond as limiting. What does the gate do?",
    options: [
      { id: "opt-a", text: "It opens, because the reading is in the Critical band.", explanation: "Incorrect. The gate requires both conditions: the reading at 60 or more and the limiting bond named correctly.", correct: false },
      { id: "opt-b", text: "It stays locked, because the limiting bond is the Communal bond at 2.8.", explanation: "Correct. The Liebig minimum is the lowest bond, here the Communal bond; the gate compares the operator's answer with the engine's own reading.", correct: true },
      { id: "opt-c", text: "It opens, because the Interpersonal bond is the strongest relationship.", explanation: "Incorrect. The limiting bond is the weakest, not the strongest.", correct: false },
      { id: "opt-d", text: "It stays locked until the reading reaches 80.", explanation: "Incorrect. The engine's acute threshold is 60, the Critical band and the escrow freeze.", correct: false },
    ],
  },
  {
    id: "capstone-synthesis-5",
    question: "What does the SHA-256 digest shown after sealing certify?",
    options: [
      { id: "opt-a", text: "Institutional accreditation of the operator.", explanation: "Incorrect. The record carries a statutory educational disclaimer: it is not accreditation.", correct: false },
      { id: "opt-b", text: "The integrity of the canonical attestation record computed in this browser: change any byte of the record and the digest changes.", explanation: "Correct. The record is serialised as canonical JSON with sorted keys and hashed with the browser's own SHA-256; the same record always yields the same 64-character digest.", correct: true },
      { id: "opt-c", text: "That the record has been registered with a central server.", explanation: "Incorrect. Nothing is transmitted; the record lives only in this browser session.", correct: false },
      { id: "opt-d", text: "The operator's identity.", explanation: "Incorrect. The record carries a designation, never a personal identifier.", correct: false },
    ],
  },
];

export const CHAPTER_5_4: DetailedAcademyChapter = {
  id: "capstone-attestation",
  number: "5.4",
  eyebrow: "Module V · Chapter 5.4 · Capstone",
  title: "The Sovereign Capstone & Gated Operator Attestation",
  estimatedMinutes: 45,
  drillType: "capstone",
  executiveLede:
    "The capstone gathers the curriculum into one chain and one covenant. An operator of the Unified Deterministic Chancellery Apparatus carries the responsibility of upholding relational integrity, mathematical truth and sovereign dignity, and attestation cannot be self-asserted. It unlocks only when six gates stand satisfied: the knowledge checks of Modules I to IV, an applied stress simulation in which the operator names the limiting bond and drives the engine's own reading into the Critical band, and the practitioner covenant.",
  synopsis: [
    "The six gates are locked by default. Gates 1 to 4 open when every question in the lectures of Modules I, II, III and IV respectively stands answered correctly. Gate 5, the applied stress simulation, opens when the laboratory's Rupture Index reads 60 or more, the engine's acute threshold, and the operator correctly names the limiting bond, the Liebig minimum the engine itself reads. Gate 6 opens on the operator's affirmation of the practitioner covenant.",
    "The seal stays disabled until all six gates stand satisfied. On sealing, the browser builds an attestation record (the designation, the verification manifest of the six gates, the simulation values, the time each gate passed, a statutory educational disclaimer and the UTC time of sealing), serialises it as canonical JSON with sorted keys and hashes it with the browser's own SHA-256. The 64-character digest, a verification stamp and the record itself are shown, and the record can be copied. Nothing is transmitted.",
    "The lecture reads the Belfast Agreement of 1998 as a settlement whose custody survived the suspension of its own institutions, sets out the chain the gates test, proves the determinism of the seal, and closes with the Dominum synthesis cutaway.",
  ],
  statutoryNotice:
    "Attestation Rule: completion is attested only when all six gates are satisfied in this browser session. The digest proves the integrity of the attestation record; it is an educational record, not institutional accreditation, and it carries no personal identifier.",
  learningOutcomes: [
    "Read the Belfast Agreement as a settlement whose custody was held by instruments and independent bodies while its institutions were suspended.",
    "Hold the whole deterministic chain in mind at once: how one rupture reading moves the decay constant, the escrow freeze, durability and the containment term together.",
    "Name the limiting bond of any vector and drive the laboratory to the engine's acute threshold of 60 to satisfy the applied stress simulation.",
    "Explain why the attestation record is canonical, why its digest is deterministic, and what the digest does and does not certify.",
    "Affirm the practitioner covenant and seal the attestation in the browser.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "Northern Ireland: Custody Through Suspension and Restoration (1998 to 2007)",
      paragraphs: [
        "Every drill in this module has ended in the same question: who holds the settlement when the people who made it are no longer holding it? The capstone opens with a case in which that question was tested repeatedly, in public, over nine years.",
        "The Belfast Agreement, also called the Good Friday Agreement, was concluded on 10 April 1998 between the British and Irish governments and most of the Northern Ireland parties. It created a power-sharing Assembly and Executive, North-South and East-West bodies, and an independent commission to oversee the decommissioning of paramilitary weapons, and it was approved by referendums in both parts of Ireland on 22 May 1998. The referendums gave the settlement a communal mandate beyond its signatories, and the treaty between the two governments gave it a home outside the Assembly.",
        "The devolved institutions were then suspended several times, for the longest period from 2002 to 2007, while decommissioning and policing remained unresolved. The independent commission confirmed the decommissioning of the IRA's weapons in September 2005, and the St Andrews Agreement of 2006 opened the way for the restoration of power-sharing in May 2007.",
        "Read through the desks, the institutions could be suspended without the settlement collapsing because its guarantees did not rest on the Executive alone. The referendums held the Communal bond; the treaty between the two governments held the Institutional-Relational bond; the independent commission held verification. When the interpersonal channel between party leaders failed, custody stayed with offices and instruments, which is the condition the Dominum Index calls custodial inversion.",
        "The attestation at the end of this course is built on the same principle in miniature. It does not rest on the operator's word. It rests on gates that only verified answers and calibrated readings can open, and on a record whose integrity anyone can check by recomputing its digest.",
      ],
      caseStudy: {
        title: "Northern Ireland: Custody Through Suspension and Restoration (1998 to 2007)",
        jurisdiction: "United Kingdom, Ireland and the Northern Ireland parties / Western Europe",
        precedent: "Belfast (Good Friday) Agreement of 10 April 1998, approved by referendums on 22 May 1998; St Andrews Agreement of 2006",
        analysis: [
          "The agreement created power-sharing institutions, cross-border bodies and an independent commission to oversee decommissioning, and was approved by referendums in both parts of Ireland, giving it a communal mandate beyond the signatories.",
          "The devolved institutions were suspended several times, for the longest period from 2002 to 2007. The independent commission confirmed the decommissioning of the IRA's weapons in September 2005, and power-sharing was restored in May 2007 after the St Andrews Agreement.",
          "The settlement survived suspension because custody was held by the treaty between two governments, the referendums and the independent commission, not by the Executive alone.",
        ],
        failureMechanism:
          "Suspensions exposed how far power-sharing depended on interpersonal trust between party leaders; the settlement survived because custody was held by instruments and independent bodies outside the Executive.",
      },
      statutoryRule:
        "Rule 5.4-A: A settlement, like an attestation, is held by instruments that do not depend on the goodwill of the person who signs them.",
    },
    {
      heading: H.architecture,
      subheading: "One Chain From Assessment to Handover, and Six Gates That Test It",
      paragraphs: [
        "The curriculum has followed one deterministic chain. The bond vector on Desk 01 sets the limiting factor; the Sentinel Matrix converts observed signs into the Rupture Index; the Succession Simulator projects decay and durability; the De-confliction Bench releases resources only on verified bonds; the Forum Matrix fixes where a breach can be enforced; and Mission Readiness reads the Dominum Index, the stage gates and the twenty statutory clearances, Articles 1.1 to 5.4, from the same bus. No reading is computed twice, so no two desks can disagree.",
        "The capstone asks the operator to hold that chain in mind at once. A single rupture reading enters the decay constant, the escrow freeze, succession durability and the containment term of the Dominum Index; a single bond at or below 3.0 holds the Vector Integrity gate, withholds the final Dominum phase and, on the Communal axis, sets the track tolerance. The drills of this module each followed one thread of the chain. The capstone follows all of them.",
        "The attestation matrix reads exactly six gates, and every gate is locked by default. Gate 1 is the Module I knowledge check, Gate 2 Module II, Gate 3 Module III and Gate 4 Module IV: each opens only when every question in that module's lectures stands answered correctly. Gate 5 is the applied stress simulation. Gate 6 is the practitioner covenant. Module V's own questions, including those below, are for practice and do not gate the seal, because the drills apply the mathematics the first four gates already test.",
        "Gate 5 tests the two readings on which every drill turned. In the Interactive Relational Laboratory the operator sets a vector and stress inputs, names which bond is limiting, and verifies. The gate compares the operator's answer with the limiting bond the engine reads, and requires the engine's Rupture Index to stand at 60 or more, the Critical band at which the escrow freezes. Both conditions must hold at the moment of verification; the values are recorded with the attestation.",
        "Gate 6 is the covenant. By affirming it the operator accepts the Vinculum Security Doctrine: rejecting constructive ambiguity, preserving the Liebig minimum, reporting every figure as the bus computes it, and maintaining custodial care across every mandate.",
      ],
      formulas: [F_DOMINUM, F_SUCCESSION],
      statutoryRule:
        "Rule 5.4-B: A reading that the bus cannot produce is not a reading. The operator reconciles every reported figure to its desk before it enters a dispatch.",
    },
    {
      heading: H.proofs,
      subheading: "The Gate 5 Condition and the Determinism of the Seal",
      paragraphs: [
        "The Gate 5 condition is a conjunction. Let \\(B_{k}\\) be the score of the bond the operator names and \\(B_{L}\\) the limiting score the engine returns for the laboratory vector, the Liebig minimum. The gate opens when \\(B_{k} = B_{L}\\) and \\(R \\ge 60\\), where \\(R\\) is the engine's own Rupture Index for the laboratory's observed share, inscribed load and trend. Where two bonds share the minimum, naming either is correct. Neither condition can be satisfied by assertion: the first is checked against the engine's reading, the second is the engine's reading.",
        "A worked case. At the laboratory defaults the bonds read 3.8, 2.8, 4.1 and 3.6, the observed share is 25, the inscribed load is 10 and the trend is static, so \\(R = \\round(25 + 10) = 35\\), the Elevated band. The limiting bond is the Communal bond at 2.8. Raise the observed share to 50 and the reading is \\(\\round(50 + 10) = 60\\), the Critical band. Naming the Communal bond now opens the gate; naming any other bond leaves it locked.",
        "The attestation record is a plain object with six fields: the designation, the verification manifest of the six gates, the simulation values recorded at Gate 5, the time each gate passed, the statutory educational disclaimer and the UTC time of sealing. It is serialised by the same canonical serialiser the registry uses for mission attestations: object keys sorted at every depth, undefined values dropped, non-finite numbers written as null. Two records with the same content therefore serialise to the same string, whatever order their fields were built in.",
        "The digest is the SHA-256 hash of that string, computed by the browser's own Web Crypto implementation and written as 64 hexadecimal characters. SHA-256 is deterministic: the same string always yields the same digest. It is also designed so that changing any part of the string yields an unrelated digest. Together, canonical serialisation and a deterministic hash make the seal checkable: anyone holding the copied record can recompute the digest and compare it with the stamp.",
        "The record carries no personal identifier. The designation names the attestation, not the operator, and the timestamps are the only values that differ between two operators who pass the same gates with the same simulation values. The seal therefore proves that a particular record existed in this browser at the time it states; it does not prove who was at the keyboard, and it is not institutional accreditation.",
      ],
      formulas: [F_LIEBIG, F_RUPTURE],
      statutoryRule:
        "Rule 5.4-C: The seal is computed over the canonical record and nothing else. A record changed after sealing is a different record with a different digest.",
    },
    {
      heading: H.protocols,
      subheading: "Clearing the Six Gates and Sealing the Record",
      paragraphs: [
        "Step one: open the full lecture of every chapter in Modules I to IV and answer every knowledge check. A wrong answer may be changed; a gate counts only the answers that currently stand correct, so a gate that has opened can close again if an answer is changed to a wrong one. The matrix shows each gate's progress as questions answered correctly out of the total.",
        "Step two: on this chapter page, use the Interactive Relational Laboratory. Set a vector and raise the stress inputs until the Rupture Index reads 60 or more. Read the vector yourself and name the limiting bond. Verify. If the bond named is not the engine's limiting bond, or the reading is below 60, the gate stays locked and says why.",
        "Step three: read the practitioner covenant and affirm it. The affirmation is a deliberate act; it can be withdrawn before sealing.",
        "Step four: when the matrix reads six of six, the seal unlocks. Seal the attestation. The browser builds the record, serialises it canonically, hashes it, and shows the 64-character digest, a verification stamp and the canonical record. Copy the record if you wish to keep it; nothing is stored outside this browser session and nothing is sent anywhere.",
        "Step five: to verify a copied record later, recompute its SHA-256 over the exact canonical text and compare it with the digest. If they match, the record is the one that was sealed.",
      ],
      statutoryRule:
        "Rule 5.4-D: Attestation is never self-asserted. A gate opens on a verified answer or a calibrated reading, and the seal certifies completion in this browser session only.",
    },
    {
      heading: H.failure,
      subheading: "Self-Assertion, Gates That Cannot Open, and the Digest Misread",
      paragraphs: [
        "Failure mode one: self-assertion. An attestation that unlocks when the operator says the work is done certifies nothing. The countermeasure is the gate: every gate except the covenant opens only on a verified answer or the engine's own reading, and the covenant is a commitment, not a claim of knowledge.",
        "Failure mode two: a gate that cannot open. A gate wired to a condition the course never lets the operator satisfy is as false as a gate that is always open, because it teaches the operator that the seal is decorative. The countermeasure is that every gate is defined over readings the course actually produces, and the tests prove each one can be opened and that the seal stays locked until all six are.",
        "Failure mode three: a threshold invented for the exercise. A stress simulation that asks for a reading of 80, or for a rupture expressed as a ratio, trains the operator on numbers no desk computes. The countermeasure is Gate 5's use of the engine's own threshold, 60, the Critical band and the freeze.",
        "Failure mode four: the digest misread. A digest is taken as proof of who completed the course or as an accreditation. It is neither. It proves the integrity of a record; the record says what it is, including its disclaimer.",
        "Failure mode five: the record that leaks. An attestation that carried a name, an address or a device fingerprint, or that was posted to a server for safekeeping, would turn an educational record into an identifier. The countermeasure is the record's design: a designation and readings only, held in this browser session, with nothing transmitted.",
        "The Liebig bottleneck appears in the capstone as it appears everywhere else: the seal is as strong as its weakest gate. Six gates of which one can be passed by assertion is a seal of one gate.",
      ],
      statutoryRule:
        "Rule 5.4-E: Every gate must be satisfiable by verified work and by nothing else. A gate that cannot open and a gate that cannot close are both breaches.",
    },
    {
      heading: H.instrument,
      subheading: "The Whole Chain in One Reading",
      paragraphs: [
        "Use the Dominum synthesis cutaway as a final rehearsal of the chain. Start at the base case: bonds of 4.0, escrow 80, durability 70, rupture 20, which reads 76.0, Self-Reinforcing Dominium. Raise the rupture to 60 and freeze the escrow, as the Critical band requires, and watch the fiduciary term vanish and the containment term fall. Drop one bond to 3.0 and watch the final phase withheld. Each move is one link of the chain the six gates test. The cutaway computes through Mission Readiness's own function and never publishes to the bus.",
        "Below the cutaway sit the two capstone surfaces. The Interactive Relational Laboratory joins the state vector, the stress inputs, the escrow, succession, decay and the Dominum Index in one bench; drive its Rupture Index into the Critical band, name the limiting bond and verify, and Gate 5 opens. The attestation then lists all six gates, locked until the work behind each one is verified, and seals the record only at six of six.",
      ],
      formulas: [F_DOMINUM_PHASE],
      instrument: "dominum",
      practicum: ["laboratory", "attestation"],
    },
  ],
  quiz: CAPSTONE_QUIZ,
};
