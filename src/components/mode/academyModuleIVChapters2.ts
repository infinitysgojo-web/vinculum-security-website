import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import {
  F_DOMINUM,
  F_DOMINUM_PHASE,
  F_ESCROW_CHAIN,
  F_ESCROW_CONSERVATION,
  F_ESCROW_RELEASE,
  F_LIEBIG,
  F_SUCCESSION,
} from "./academyFormulas";

/** Module IV, Chapters 4.4 and 4.5, in the seven-part lecture structure. */

export const CHAPTER_4_4: DetailedAcademyChapter = {
  id: "dominum-index-proof",
  number: "4.4",
  eyebrow: "Module IV · Chapter 4.4",
  title: "The Dominum Index: Holistic Mission Synthesis",
  estimatedMinutes: 40,
  executiveLede:
    "Most of the mathematics of the platform is written against failure: rupture, decay, contagion and the succession trap. The Dominum Index supplies the condition those instruments work toward. Formally the Law of Sovereign Custodial Inversion, it synthesises bond health, fiduciary execution, succession durability and rupture containment into one reading on Mission Readiness (Desk 15), so that a mission can tell a fragile ceasefire from a peace that has begun to sustain itself.",
  synopsis: [
    "The Dominum Index is a derived view of four readings already on the bus, with weights fixed by doctrine: the bond anchor \\(A\\) at 0.30, the fiduciary anchor \\(F\\) at 0.25, succession durability \\(S\\) at 0.25 and containment \\(C\\) at 0.20. It introduces no new input and never publishes a signal of its own, so it cannot disagree with the desks it summarises. The decay horizon and forum fitness are not terms of the index; they act on it through the readings they move.",
    "Four phases govern the mandate: Imperium-Bound below 40, Fiduciary Anchor from 40, Custodial Inversion from 60, and Self-Reinforcing Dominium at 75 and above, which further requires every bond above the 3.0 viable floor. A high index over a bond at or below the floor is recorded as Custodial Inversion.",
    "The lecture reads the Helsinki Memorandum of Understanding on Aceh of 2005 as a settlement in which custody passed from commanders to offices, derives the index and its phase rule, and works the canonical cases.",
  ],
  formulas: [F_DOMINUM, F_DOMINUM_PHASE],
  statutoryNotice:
    "Doctrinal Gate (Desk 15): Self-Reinforcing Dominium cannot be attained while any bond sits at or below the 3.0 viable floor, regardless of the aggregate score. The index is read, never predicted.",
  learningOutcomes: [
    "Identify, in a historical settlement, the passage of custody from discretionary command to offices that outlast officeholders.",
    "State the four terms of the Dominum Index, their weights and the desks that supply them.",
    "Compute the index and its phase from a bond vector, an escrow release, a succession durability and a rupture index.",
    "Explain why a frozen escrow costs the fiduciary term entirely and why a floor breach withholds the final phase.",
    "Trace how decay and forum fitness reach the index through the readings they move, without being terms of it.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Helsinki Memorandum of Understanding on Aceh (2005)",
      paragraphs: [
        "A settlement attains the Dominum Effect when its guarantees are anchored to verified relational conditions, its custody has passed from discretionary political control to offices that outlast any officeholder, and its bonds hold above the viable floor. The case below is read for that passage of custody, from the public record.",
        "Imperium is the right of command and coercion over persons; dominium is title and custodial stewardship. Aceh is instructive because the settlement moved deliberately from the first to the second: from a military contest to a statute, a monitored decommissioning and elected local institutions.",
      ],
      caseStudy: {
        title: "The Helsinki Memorandum of Understanding on Aceh (2005)",
        jurisdiction: "Government of the Republic of Indonesia and the Free Aceh Movement (GAM) / Southeast Asia",
        precedent: "Memorandum of Understanding signed at Helsinki on 15 August 2005; Law on the Governing of Aceh (Law No. 11 of 2006)",
        analysis: [
          "After nearly three decades of conflict, and months after the Indian Ocean tsunami of December 2004 devastated Aceh, the parties concluded a memorandum facilitated by former Finnish President Martti Ahtisaari through the Crisis Management Initiative. The memorandum provided for self-government for Aceh, the decommissioning of GAM's weapons, the relocation of non-organic military and police forces, amnesty, reintegration support, and the right to form local political parties.",
          "Verification was placed outside both parties. The Aceh Monitoring Mission, deployed by the European Union with contributing countries from ASEAN, oversaw decommissioning and redeployment from September 2005, and GAM's declared weapons were handed over in phases by the end of that year. Disputes over implementation were routed to the head of the monitoring mission rather than left to the parties' discretion.",
          "Custody then passed into offices. The Law on the Governing of Aceh of 2006 gave the settlement a statutory home, local parties contested elections, and former commanders entered government through the ballot. When the monitoring mission withdrew in December 2006, the settlement no longer depended on the people who had signed it: the condition the Dominum Index calls custodial inversion.",
        ],
        failureMechanism:
          "Not a failure: verification held by a neutral mission and guarantees moved into statute and elected offices let the settlement outlive its signatories. Disputes over the full implementation of the 2006 law show that custody, once passed, must still be tended.",
      },
      statutoryRule:
        "Rule 4.4-A: Durability through succession is a precondition, not a consequence, of custodial inversion. A mission may not report Self-Reinforcing Dominium on the strength of its signatories' goodwill.",
    },
    {
      heading: H.architecture,
      subheading: "Four Terms, Four Desks, No Input of Its Own",
      paragraphs: [
        "The bond anchor \\(A = \\frac{\\mu_{B} - 1}{4}\\) maps the mean bond from Desk 01 onto the unit interval: a mean of 1.0 reads 0 and a mean of 5.0 reads 1. The fiduciary anchor \\(F = \\frac{E}{100}\\) reads the share of the escrow pledge released on Desk 07, and is zero while the escrow is frozen. Succession durability \\(S\\) reads the durability percentage from Desk 12. Containment \\(C = 1 - \\frac{R}{100}\\) reads the Rupture Index from Desk 02; an unreadable rupture reading counts as full rupture, so containment is never overstated.",
        "The bond anchor carries the greatest weight because the doctrine treats the bond as the unit of security. The fiduciary and succession terms carry 0.25 each, since together they describe custody: what is held, and whether it survives the departure of those who hold it. Containment carries 0.20, because the absence of rupture is necessary but never sufficient.",
        "Two readings the treatise associates with synthesis are deliberately not terms. The decay horizon reaches the index through the readings that drive it: the rupture index that feeds the decay constant is the same rupture index that sets containment, and the succession shocks that feed exposure are the same shocks that lower durability. Forum fitness reaches it through enforcement: a weak forum leaves breaches unremedied, which shows up as tripwires and rupture rather than as a separate term. Adding them as terms would count the same evidence twice.",
        "Until all four readings exist, the instrument names the missing ones instead of computing a number. A mission that has not run the Succession Simulator sees succession survival listed as awaited, never a substituted zero.",
      ],
      formulas: [F_DOMINUM, F_SUCCESSION],
      statutoryRule:
        "Rule 4.4-B: The Dominum Index is shown only when all four readings are on the bus. A missing reading is named, never substituted with zero.",
    },
    {
      heading: H.proofs,
      subheading: "Worked Derivations and the Phase Rule",
      paragraphs: [
        "Base case: bonds of 4.0 on every dimension, \\(E = 80\\), a durability of 70 and \\(R = 20\\). Then \\(A = 0.75\\), \\(F = 0.80\\), \\(S = 0.70\\), \\(C = 0.80\\), and \\(D = 100 \\times (0.225 + 0.200 + 0.175 + 0.160) = 76.0\\). Since 76.0 is at least 75 and every bond stands above 3.0, the reading is Self-Reinforcing Dominium.",
        "Frozen escrow: hold the base case but freeze the account. Then \\(F = 0\\) and \\(D = 56.0\\), the Fiduciary Anchor phase. Withdrawing custody of the pledge costs twenty points and a full phase.",
        "Floor withholding: bonds of 5.0, 3.0, 5.0 and 5.0 with the base values of the other terms give \\(A = 0.875\\) and \\(D = 79.8\\). Although the index exceeds 75, the Communal bond sits exactly at the 3.0 floor, which is a breach, so the reading is Custodial Inversion. No custody arrangement can compensate for a failing bond.",
        "Sensitivity follows from the weights. One point of mean bond moves \\(A\\) by a quarter and the index by 7.5. Ten points of escrow release move the index by 2.5, ten points of durability by 2.5, and ten points of rupture by 2.0. A mission short of the 75 threshold therefore gains most per unit of effort by lifting the bonds, and least by lowering an already contained rupture reading.",
        "The phase rule is applied after the index is rounded to one decimal, and the floor test uses the strict inequality: every bond must be strictly above 3.0. An index of 75.0 with every bond at 3.1 is Self-Reinforcing Dominium; the same index with one bond at 3.0 is Custodial Inversion.",
        "Two further cases fix the scale of the phases. A settlement with every bond at 2.0, nothing released, a durability of 30 and a Rupture Index of 50 reads \\(100 \\times (0.075 + 0 + 0.075 + 0.100) = 25.0\\), Imperium-Bound: order held by force or by the personal authority of its makers. A settlement with every bond at 3.5, 67 per cent released, a durability of 56 and a Rupture Index of 30 reads \\(100 \\times (0.1875 + 0.1675 + 0.140 + 0.140) = 63.5\\), Custodial Inversion: custody has begun to pass, but the bonds are not yet strong enough, nor the release complete enough, for the settlement to sustain itself.",
        "Between those two readings lies most of the practical work of a mission. Thirty-eight and a half points separate them, and the weights say where they come from: about 11 from the bonds, about 17 from the escrow, 6.5 from durability and 4 from containment. The escrow term moves most here because a frozen or unreleased pledge is worth nothing and a released one is worth a quarter of its share, which is why the doctrine treats verified release on verified bonds as the hinge of custodial inversion.",
      ],
      formulas: [F_DOMINUM_PHASE, F_LIEBIG],
      statutoryRule:
        "Rule 4.4-C: Money released on a verified bond counts toward dominium; money frozen under rupture counts for nothing.",
    },
    {
      heading: H.protocols,
      subheading: "Reading the Index on Desk 15 and in Handover",
      paragraphs: [
        "On Mission Readiness the index appears with an inspectable proof that substitutes every live term and shows the arithmetic to the displayed value. The proof calls the same function as the desk, so it cannot drift from it.",
        "The index is carried in the upstream telemetry of every chancellery document, including the Mandate Handover (Desk 17), and in the Governing Relational Laws console under The Dominum Effect, where it holds while the phase is above Imperium-Bound and reads as a breach while it is not.",
        "The index does not clear a gate. The five stage gates and the twenty statutory clearances remain the sole authority on locks. A mission can read Custodial Inversion with a gate failing, and the operator must clear the gate; the phase is a characterisation, not a clearance.",
        "The operating protocol is to read the four terms before the total: the term furthest below its share of the weight is where the next effort belongs. The proof's term-by-term substitution exists for exactly that purpose.",
        "In handover, the index is read as a trajectory rather than a single figure. An incoming principal who receives a mission at 63.5 with every term rising inherits a different mandate from one who receives it at 63.5 after a fall from 76.0. The desk does not compute the trajectory; the mandate handover records the readings in sequence so that the successor can see it.",
      ],
      statutoryRule:
        "Rule 4.4-D: The Dominum phase characterises the mission; the stage gates clear it. No phase, however high, substitutes for a failed gate.",
    },
    {
      heading: H.failure,
      subheading: "Proclaimed Dominium, Frozen Custody and the Floor",
      paragraphs: [
        "Failure mode one: proclaimed dominium. A principal announces that the settlement has become self-sustaining. The countermeasure is the fourth axiom of the Effect: it is read, never predicted. The phase is whatever the four readings produce.",
        "Failure mode two: counting frozen money. An analyst reports the escrow pledge as custody while the account is frozen. The fiduciary term reads zero under a freeze, by design, because money that cannot move is not held in trust for anyone.",
        "Failure mode three: the high-index floor breach. A strong mean lifts the index above 75 while one bond sits at or below 3.0. The countermeasure is the floor gate in the phase rule; the remedy is repair on that bond, not more effort on the others.",
        "Failure mode four: incomplete records. A missing succession test is quietly treated as a pass. The engine refuses: it names the missing reading and computes nothing.",
        "The Liebig bottleneck appears twice in the index: in the floor gate, which withholds the final phase while any bond is at or below the floor, and in the bond anchor, which uses the mean and so rewards strength everywhere. The two together mean the index can reward breadth of repair but can never certify a settlement whose weakest bond is failing.",
      ],
      statutoryRule:
        "Rule 4.4-E: No custody arrangement can compensate for a failing bond. The floor gate is the Liebig minimum written into the phase rule.",
    },
    {
      heading: H.instrument,
      subheading: "Synthesis Under Live Inputs",
      paragraphs: [
        "Set the four bonds, the escrow release, the freeze, the succession durability and the rupture index. The cutaway passes them to Mission Readiness's own function and shows each weighted term, the index and the phase. Freeze the escrow and watch twenty points leave; drop one bond to 3.0 and watch the final phase withheld.",
      ],
      instrument: "dominum",
    },
  ],
  quiz: [
    {
      id: "q4-4-1",
      question: "Bonds of 4.0 on every dimension, \\(E = 80\\), succession durability 70 per cent and \\(R = 20\\). What is the Dominum Index and its phase?",
      options: [
        { id: "opt-a", text: "\\(D = 76.0\\), Self-Reinforcing Dominium", explanation: "Correct. \\(100 \\times (0.30 \\times 0.75 + 0.25 \\times 0.80 + 0.25 \\times 0.70 + 0.20 \\times 0.80) = 76.0\\), at least 75 with every bond above 3.0.", correct: true },
        { id: "opt-b", text: "\\(D = 76.0\\), Custodial Inversion, because 80 is required", explanation: "Incorrect. The engine's threshold for Self-Reinforcing Dominium is 75, not 80.", correct: false },
        { id: "opt-c", text: "\\(D = 56.0\\), Fiduciary Anchor", explanation: "Incorrect. 56.0 is the reading if the escrow is frozen.", correct: false },
        { id: "opt-d", text: "\\(D = 80.0\\), Self-Reinforcing Dominium", explanation: "Incorrect. Recompute the weighted sum term by term.", correct: false },
      ],
    },
    {
      id: "q4-4-2",
      question: "The index reads 79.8 but the Communal bond is exactly 3.0. Which phase is recorded?",
      options: [
        { id: "opt-a", text: "Self-Reinforcing Dominium, because the index exceeds 75.", explanation: "Incorrect. Self-Reinforcing Dominium also requires every bond strictly above 3.0.", correct: false },
        { id: "opt-b", text: "Custodial Inversion, because a bond at exactly 3.0 breaches the viable floor.", explanation: "Correct. Exactly 3.0 is a breach; a high index over a floor breach is recorded as Custodial Inversion.", correct: true },
        { id: "opt-c", text: "Fiduciary Anchor.", explanation: "Incorrect. The index is above 60.", correct: false },
        { id: "opt-d", text: "Imperium-Bound.", explanation: "Incorrect. Imperium-Bound is a reading below 40.", correct: false },
      ],
    },
    {
      id: "q4-4-3",
      question: "Which weights does the engine assign to the four terms of the Dominum Index?",
      options: [
        { id: "opt-a", text: "Equal weights of 0.25 on every term.", explanation: "Incorrect. The bond anchor carries more weight and containment less.", correct: false },
        { id: "opt-b", text: "0.30 on the bond anchor, 0.25 on the fiduciary anchor, 0.25 on succession durability and 0.20 on containment.", explanation: "Correct. These are the weights in dominumIndex on Desk 15.", correct: true },
        { id: "opt-c", text: "0.40 on containment and 0.20 on each of the others.", explanation: "Incorrect. Containment carries the smallest weight, 0.20.", correct: false },
        { id: "opt-d", text: "Weights chosen by the operator for each mission.", explanation: "Incorrect. The weights are fixed doctrinal rules, not mission settings.", correct: false },
      ],
    },
    {
      id: "q4-4-4",
      question: "Why are the decay horizon and forum fitness not terms of the Dominum Index?",
      options: [
        { id: "opt-a", text: "Because they are not computed by any desk.", explanation: "Incorrect. Both are computed, on Desks 12 and 11.", correct: false },
        { id: "opt-b", text: "Because they act through readings already in the index, and adding them would count the same evidence twice.", explanation: "Correct. Rupture drives both decay and containment; succession shocks drive both exposure and durability.", correct: true },
        { id: "opt-c", text: "Because the index ignores time.", explanation: "Incorrect. Time enters through durability and rupture.", correct: false },
        { id: "opt-d", text: "Because the operator adds them manually.", explanation: "Incorrect. The operator adds nothing to the index.", correct: false },
      ],
    },
  ],
};

export const CHAPTER_4_5: DetailedAcademyChapter = {
  id: "escrow-conservation-proof",
  number: "4.5",
  eyebrow: "Module IV · Chapter 4.5",
  title: "Conservation of Value in Escrow Waterfalls",
  estimatedMinutes: 40,
  executiveLede:
    "Money released in full at signature rewards the act of signing, not the work of implementation; money withheld indefinitely corrodes the trust it was meant to build. The Conditional Escrow Waterfall on the De-confliction Bench (Desk 07) answers with conditionality: four tranches released in a fixed order, each on a verified relational milestone read from the bus, with reserves held until the settlement can survive a change of hands, the whole account frozen at critical rupture, and the pledge conserved at exactly 100.",
  synopsis: [
    "The pledge is partitioned into four tranches: Mobilisation (25 per cent, independent verifier seated), Demarcation (25, Communal bond above 3.0), Operational Commissioning (30, Institutional bond above 3.0 and track gap within tolerance) and Final Cession (20, Intergenerational bond above 3.0 and survival at or above 55 per cent). The shares must sum to exactly 100: the law of pledge conservation.",
    "Before Final Cession, releases are disciplined by a clawback reserve (10 per cent of the gross) and a performance bond (5 per cent of the pledge, capped at what remains after the clawback). At Final Cession both reserves discharge and the released share equals the gross. At a rupture index of 60 or more the whole account is frozen.",
    "The lecture reads the Chad-Cameroon pipeline revenue law of 1999 as an escrow whose conditions were rewritten by the party that held the account, then derives the release arithmetic and works the canonical figures.",
  ],
  formulas: [F_ESCROW_CONSERVATION, F_ESCROW_RELEASE],
  statutoryNotice:
    "Conservation Law (Desk 07): \\(\\sum_{k=1}^{4} s_{k} = 100\\). No tranche releases out of order, no release occurs at \\(R \\ge 60\\), and the conditions are read from the bus, never negotiated at the desk.",
  learningOutcomes: [
    "Explain, from the Chad precedent, why the custody of an escrow's rules must sit outside the party it disciplines.",
    "State the four tranches, their default shares and the bus readings that release them.",
    "Apply the chain rule under which a tranche is met only when every earlier tranche is met.",
    "Compute the clawback reserve, the performance bond and the released share before and at Final Cession.",
    "Distinguish a frozen account from one whose milestones are unmet, and cite all three escrow signals in any dispatch.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Chad-Cameroon Pipeline and the Petroleum Revenue Management Law (1999 to 2008)",
      paragraphs: [
        "A waterfall is only as strong as the custody of its rules. If the party whose conduct the tranches discipline can amend the conditions unilaterally, the escrow becomes a promise rather than an instrument. The Chad arrangement is the most cited modern example of a revenue escrow designed with care and then dismantled by the party it bound.",
      ],
      caseStudy: {
        title: "The Chad-Cameroon Pipeline and the Petroleum Revenue Management Law (1999 to 2008)",
        jurisdiction: "Republic of Chad, the World Bank Group and a private consortium / Central Africa",
        precedent: "Chad's Petroleum Revenue Management Law of 1999; World Bank Group financing approved in 2000",
        analysis: [
          "To secure World Bank Group participation in the Doba oil fields and the export pipeline through Cameroon, Chad enacted a revenue management law in 1999. Direct oil revenues were to be paid into an offshore escrow account; ten per cent was to be set aside in a Future Generations Fund, and the greater part of the remainder was earmarked for priority sectors such as health, education, rural development and infrastructure, with a share for the producing region. A joint oversight body was created to authorise disbursements.",
          "Oil began to flow in 2003. In late 2005 the government amended the law: the Future Generations Fund was abolished, and the list of priority sectors was widened to include security. The World Bank responded in January 2006 by suspending new disbursements and freezing the escrow account. An interim arrangement followed later that year, and in 2008 the World Bank Group withdrew from the project after Chad repaid its outstanding loans.",
          "In the vocabulary of the waterfall, the intergenerational reserve was the Final Cession tranche of the arrangement, and the party under discipline was able to delete it by statute. The freeze that followed was real, but it was a negotiation lever, not a rule read from verified conditions.",
        ],
        failureMechanism:
          "The conditions of release were held in domestic law that the disciplined party could amend alone, so the intergenerational tranche was removed and the escrow lost its anchor.",
      },
      statutoryRule:
        "Rule 4.5-A: The tranche conditions and the freeze must be fixed in an instrument that the recipient cannot amend unilaterally, and the intergenerational tranche must be the last to release, never the first to be cut.",
    },
    {
      heading: H.architecture,
      subheading: "Tranches, Conditions and the Chain Rule",
      paragraphs: [
        "The four conditions are read from the bus, so that the release of money follows the same readings that govern the gates and the clearances. Mobilisation reads the verifier seated on the Verification Ledger; Demarcation reads the Communal bond; Operational Commissioning reads the Institutional-Relational bond together with the track gap and tolerance from Track Sequencing; Final Cession reads the Intergenerational bond and the survival score from the Succession Simulator.",
        "Each condition is an indicator \\(c_{k}\\), and the chain rule makes the order binding: tranche \\(k\\) is met only if its own condition and every earlier condition hold. A Demarcation condition satisfied while no verifier is seated releases nothing. A missing bond or survival reading is treated as zero and fails its test.",
        "The four default shares sum to exactly 100. The operator may adjust them on the desk, but the waterfall reports the pledge as balanced only when they still sum to exactly 100, so that no value can be created or lost by the partition itself. The clawback percentage and the performance bond are also adjustable, within limits set on the desk.",
        "The Final Cession threshold of 55 per cent survival coincides with the Succession Trap. The two rules are one rule read from two desks: a settlement that cannot clear the trap cannot cede.",
      ],
      formulas: [F_ESCROW_CHAIN, F_ESCROW_CONSERVATION],
      statutoryRule:
        "Rule 4.5-B: A missing bond or survival reading is treated as zero and fails its test. Absence of evidence is never a met condition.",
    },
    {
      heading: H.proofs,
      subheading: "The Release Arithmetic and Its Conservation",
      paragraphs: [
        "Let \\(G\\) be the gross share of met tranches, \\(\\kappa\\) the clawback percentage and \\(\\beta\\) the performance bond. Before Final Cession the clawback held is \\(K = \\frac{G\\, \\kappa}{100}\\), the bond held is \\(P = \\min(\\beta,\\, G - K)\\), and the release is \\(\\max(0,\\, G - K - P)\\). At Final Cession both reserves discharge and the release equals \\(G\\). Under the freeze the release is zero.",
        "Worked figures at the defaults. With a verifier seated and the Communal bond at 1.4, only Mobilisation is met: \\(G = 25\\), the clawback is 2.5, the bond is \\(\\min(5,\\, 22.5) = 5\\), and 17.5 per cent is released. Were the first three tranches met, \\(G = 80\\) and the release is \\(80 - 8 - 5 = 67\\). At Final Cession the release is 100. At \\(R = 60\\) it is 0, even with every tranche met.",
        "Conservation can be proved term by term. At any moment the pledge divides into the released share, the clawback, the bond, the gross held by a freeze, and the shares of unmet tranches. Because the bond is capped at \\(G - K\\), the reserves can never exceed the gross; because the shares sum to 100, the five parts always account for the whole pledge. Nothing leaks and nothing is created.",
        "The effective release ratio before cession is \\(1 - \\frac{\\kappa}{100} - \\frac{\\beta}{G}\\), which rises toward \\(1 - \\frac{\\kappa}{100}\\) as more tranches clear. Early tranches bear the fixed bond most heavily, deliberately, because the settlement's capacity to absorb a clawback is least proven at the outset.",
        "The cap on the performance bond is what keeps the release non-negative when tranche shares are small. With custom shares of 5, 35, 40 and 20 and only Mobilisation met, the gross is 5, the clawback is 0.5, and the performance bond is capped at what remains, \\(\\min(5,\\, 5 - 0.5) = 4.5\\): the release is exactly zero, not negative. With shares of 40, 20, 20 and 20 and only Mobilisation met, the gross is 40, the reserves are 4 and 5, and 31 per cent is released. Shares of 30, 30, 30 and 20 sum to 110 and are reported as unbalanced: the waterfall will compute them, but the pledge does not conserve.",
        "Conservation holds at every state, not only at Final Cession. Released share, clawback reserve, performance bond, the gross held by a freeze, and the shares of tranches not met always add up to the whole pledge. Nothing in the arithmetic can create value or lose it; a dispute over the escrow is therefore always a dispute over which state a given share is in, never over whether it exists.",
      ],
      formulas: [F_ESCROW_RELEASE],
      statutoryRule:
        "Rule 4.5-C: Both reserves discharge at Final Cession because its condition is exactly the failure they were held against.",
    },
    {
      heading: H.protocols,
      subheading: "Running the Waterfall on the De-confliction Bench",
      paragraphs: [
        "The operator sets the tranche shares, the clawback and the bond on Desk 07 and links the desk to the bus. The desk publishes the released share, the number of tranches met and the freeze state; the Dominum Index reads the released share as its fiduciary term, and the Governing Relational Laws console reports the waterfall as frozen whenever the freeze holds.",
        "Override exists so that the analyst can examine the release schedule the milestones would justify absent the freeze. Under override the desk passes a rupture of zero to the waterfall, and the freeze lifts on the desk. A reading taken under override must never be cited as the escrow position of the mission, and the link must be restored before any dispatch is minted.",
        "Upstream actions move the tranches: seating a verifier on Desk 16 meets Mobilisation; communal repair on the Communal bond meets Demarcation; an office-continuity provision and a closed track gap meet Operational Commissioning; succession survival at 55 or more with an Intergenerational bond above the floor meets Final Cession.",
        "Any dispatch citing escrow cites three signals together: the released percentage, the tranches met, and the freeze state.",
      ],
      statutoryRule:
        "Rule 4.5-D: Any dispatch citing escrow must cite the released share, the tranches met and the freeze state together. A reading of zero released is not evidence that no milestone was met.",
    },
    {
      heading: H.failure,
      subheading: "Lump Sums, Leaky Partitions and the Limiting Bond",
      paragraphs: [
        "Failure mode one: the signature payment. Releasing the pledge at signature removes all leverage at the moment it is most needed. The countermeasure is the ordered waterfall.",
        "Failure mode two: the leaky partition. Shares that sum to less than 100 leave value outside the trust; shares above 100 promise value that does not exist. The countermeasure is the conservation law, enforced by the balanced flag.",
        "Failure mode three: reading zero as failure. Under the freeze every tranche may be met and the account still reads zero. The countermeasure is the three-signal citation rule.",
        "Failure mode four: rules held by the recipient. As the Chad case shows, conditions in the recipient's own law can be amended away. The countermeasure is custody of the rules in the instrument and a neutral trustee.",
        "The Liebig bottleneck orders the waterfall. Because tranches release in sequence and each reads one bond, the weakest bond in the sequence holds every tranche after it. A Communal bond at 2.9 caps release at Mobilisation however strong the other three bonds are: the limiting bond sets the ceiling on what the trust can release.",
        "Failure mode, the front-loaded partition. A drafting party proposes shares of 70, 10, 10 and 10 so that the recipient receives most of the money on the seating of a verifier. The partition conserves, but it converts the waterfall into a lump sum with a short tail: the later conditions, which test the bonds and survival under succession, then govern almost nothing. The countermeasure is doctrinal rather than arithmetic. The default shares of 25, 25, 30 and 20 place more than half the pledge behind the Institutional and Intergenerational conditions, and a departure from them must say why the later bonds deserve less weight.",
      ],
      statutoryRule:
        "Rule 4.5-E: Repair the bond that holds the first unmet tranche before any other. Every later tranche waits on it.",
    },
    {
      heading: H.instrument,
      subheading: "The Balance Bar",
      paragraphs: [
        "Adjust the shares, the bonds, the survival score and the rupture index. The bar divides the pledge into released, clawback, bond, held by freeze and unmet tranches, computed by the De-confliction Bench's own escrowWaterfall, and the conservation tile confirms that the shares sum to exactly 100. Push the rupture index to 60 and watch the whole gross move into the freeze.",
      ],
      instrument: "escrow",
    },
  ],
  quiz: [
    {
      id: "q4-5-1",
      question: "The first three tranches are met at the default terms, Final Cession is not, and \\(R = 30\\). What share of the pledge is released?",
      options: [
        { id: "opt-a", text: "80 per cent", explanation: "Incorrect. 80 is the gross; before Final Cession the clawback and the performance bond are held back.", correct: false },
        { id: "opt-b", text: "67 per cent", explanation: "Correct. \\(G = 80\\), the clawback is \\(\\frac{80 \\times 10}{100} = 8\\), the bond is \\(\\min(5,\\, 72) = 5\\), so \\(80 - 8 - 5 = 67\\).", correct: true },
        { id: "opt-c", text: "72 per cent", explanation: "Incorrect. The performance bond is also held until Final Cession.", correct: false },
        { id: "opt-d", text: "0 per cent", explanation: "Incorrect. The account freezes only at a rupture index of 60 or more.", correct: false },
      ],
    },
    {
      id: "q4-5-2",
      question: "The Communal bond reads 3.4 but no independent verifier is seated. Which tranches are met?",
      options: [
        { id: "opt-a", text: "Demarcation only.", explanation: "Incorrect. Under the chain rule Demarcation cannot be met while Mobilisation is not.", correct: false },
        { id: "opt-b", text: "None.", explanation: "Correct. Mobilisation requires a verifier seated, and every later tranche requires every earlier one.", correct: true },
        { id: "opt-c", text: "Mobilisation and Demarcation.", explanation: "Incorrect. Mobilisation's own condition fails.", correct: false },
        { id: "opt-d", text: "All four, because the bond is above the floor.", explanation: "Incorrect. Each tranche carries its own condition.", correct: false },
      ],
    },
    {
      id: "q4-5-3",
      question: "What does the law of pledge conservation require?",
      options: [
        { id: "opt-a", text: "That the released share always equals 100.", explanation: "Incorrect. Release depends on the conditions met.", correct: false },
        { id: "opt-b", text: "That the four tranche shares sum to exactly 100.", explanation: "Correct. The waterfall reports the pledge as balanced only when \\(\\sum_{k=1}^{4} s_{k} = 100\\).", correct: true },
        { id: "opt-c", text: "That the clawback equals the performance bond.", explanation: "Incorrect. One is proportional to the gross, the other a fixed share of the pledge.", correct: false },
        { id: "opt-d", text: "That every tranche carries 25 per cent.", explanation: "Incorrect. The default shares are 25, 25, 30 and 20.", correct: false },
      ],
    },
    {
      id: "q4-5-4",
      question: "Every tranche is met but the Rupture Index reads 62. What should a dispatch cite?",
      options: [
        { id: "opt-a", text: "That no milestone has been met, since nothing is released.", explanation: "Incorrect. A freeze with every tranche met is not the same as unmet milestones.", correct: false },
        { id: "opt-b", text: "0 per cent released, 4 of 4 tranches met, escrow frozen.", explanation: "Correct. All three escrow signals are cited together so the freeze cannot be mistaken for failure.", correct: true },
        { id: "opt-c", text: "100 per cent released, because Final Cession is met.", explanation: "Incorrect. The freeze holds even after Final Cession.", correct: false },
        { id: "opt-d", text: "The figure read under override.", explanation: "Incorrect. An override reading is never the escrow position of record.", correct: false },
      ],
    },
  ],
};
