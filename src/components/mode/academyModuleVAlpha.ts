import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import { F_CASE_DISTANCE, F_ESCROW_CHAIN, F_FORUM_F, F_LIEBIG, F_RESONANCE, F_RUPTURE, F_TRACK } from "./academyFormulas";

/**
 * Module V, Chapter 5.1: Drill Alpha. The scenario states are fictional training
 * figures; the precedents are read from the open public record only, and every
 * figure is re-derived from the engine in qa/academy-curriculum.test.ts.
 */
export const CHAPTER_5_1: DetailedAcademyChapter = {
  id: "drill-border",
  number: "5.1",
  eyebrow: "Module V · Chapter 5.1 · Drill Alpha",
  title: "Drill Alpha: Transboundary River Basin Demarcation",
  estimatedMinutes: 45,
  drillType: "border",
  executiveLede:
    "Two states share one river. State A sits upstream: an industrialising economy that has built barrages and a hydroelectric cascade on the main stem and wants the flow regulated for power and factories. State B sits downstream: an agrarian economy whose irrigated plains depend on the same water arriving in the planting season. A seasonal drought has turned an old disagreement over the line of the river boundary into rationing in the downstream districts. The foreign ministers trust each other; the farmers do not trust anyone. The drill asks what an operator can build on that split.",
  synopsis: [
    "Diagnostic profile: the drill opens with the vector \\(B = (3.8,\\, 1.9,\\, 3.2,\\, 3.0)\\). The Communal bond at 1.9 is Failing and limits the whole relationship; the Institutional-Relational bond at exactly 3.0 also breaches the viable floor. The nearest documented case on Desk 01 is Kenya, at a distance of 1.221 and a resonance of 84.7: a settlement in which agreement among elites outran communal trust.",
    "Strategic objective: move the dispute from fortification to a joint basin commission whose resources release through the Conditional Escrow Waterfall, with a graded route for disagreement. With the Communal bond Failing, the track tolerance is zero phases, so the principals' track may not lead the communal track at all, and the Demarcation tranche cannot release until the Communal bond rises above 3.0. The drought enters as a deteriorating trend: a register score of 20 that reads 36 under a static trend reads 41 under a deteriorating one, which crosses the provisional-measures threshold of 40 on the Legal Desk.",
    "The precedents are the Indus Waters Treaty of 1960, which answered an upstream and downstream asymmetry with allocation by rule and a neutral ladder, and the Nile Basin, where allocation among the downstream states left the states holding the headwaters outside the settlement. The lecture walks the corridor through the desks in seven parts and closes with the radar cutaway, on which the reader can watch the limiting bond move.",
  ],
  formulas: [F_LIEBIG, F_TRACK],
  statutoryNotice:
    "Drill Rule: with a Failing Communal bond the track tolerance is zero, the Vector Integrity gate holds, and no corridor resource may release past Mobilisation. Preset scores are training figures, not field measurements, and the states in the scenario are fictional.",
  learningOutcomes: [
    "Read the Indus and Nile instruments as two answers to the same upstream and downstream asymmetry: allocation by neutral rule and allocation by exclusion.",
    "Diagnose a basin dispute on Desk 01, name the limiting bond and its band, and explain why ministerial trust cannot lift it.",
    "Compute the effect of a seasonal drought on the Rupture Index through the trend multiplier, and trace the provisional-measures consequence at 40.",
    "Apply the communal tolerance rule on Track Sequencing (Desk 08) and predict which escrow tranches can release on Desk 07.",
    "Design a dispute clause that fixes in advance which forum hears which class of disagreement, and read its venue fitness on Desk 11.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "Two Rivers, Two Answers: The Indus Ladder and the Nile Allocation",
      paragraphs: [
        "Water is the oldest boundary problem in statecraft because it does not stay on its side of the line. A river that rises in one state and irrigates another carries the asymmetry of geography into every negotiation: the upstream party can act on the flow, and the downstream party can only receive it. The two great basin settlements of the modern record answer that asymmetry in opposite ways, and the drill is built on the difference.",
        "The Indus Waters Treaty was signed at Karachi on 19 September 1960 by India and Pakistan, with the World Bank a signatory for specified purposes. Partition in 1947 had left the headworks of the Indus system largely in India and the irrigated plains largely in Pakistan. After nearly a decade of negotiation under the Bank's good offices, the treaty did not try to share every river. It divided them: the waters of the eastern rivers, the Ravi, the Beas and the Sutlej, to India, and those of the western rivers, the Indus, the Jhelum and the Chenab, to Pakistan, subject to defined uses by India on the western rivers. Replacement works on the Pakistani side, among them the Mangla and Tarbela dams, were financed through an international fund.",
        "The treaty then gave disagreement somewhere to go. A Permanent Indus Commission, with a commissioner from each side, meets and exchanges data. Questions go to the Commission; technical differences go to a Neutral Expert; disputes go to a Court of Arbitration. The ladder was used. A Neutral Expert determined the Baglihar difference in 2007, and a Court of Arbitration rendered its final award in the Kishenganga proceedings in 2013, permitting a diversion while requiring a minimum flow downstream.",
        "The Nile tells the other story. The 1929 exchange of notes between Egypt and the United Kingdom, and the 1959 Agreement for the Full Utilization of the Nile Waters between Egypt and Sudan, allocated the measured flow of the river between the two downstream states. The upstream states, where most of the water originates, were not parties to the 1959 allocation. When the basin states sought a common framework through the Nile Basin Initiative, launched in 1999, the Cooperative Framework Agreement opened for signature at Entebbe in 2010 was not signed by Egypt or Sudan. It entered into force in October 2024 among upstream ratifying states. Meanwhile the Grand Ethiopian Renaissance Dam, begun in 2011, became the focus of a Declaration of Principles signed by Egypt, Ethiopia and Sudan at Khartoum in March 2015, without a binding agreement on filling and operation.",
        "Read through the desks, the two basins differ not in hydrology but in custody. The Indus instrument placed the allocation in a rule and the disagreement in a neutral ladder; its weakness, exposed in April 2025 when India announced that it would hold the treaty in abeyance, is that a ladder works only while both parties stay on it. The Nile instruments placed the allocation among the parties who signed them; each framework is strong among its own signatories and absent across the divide, so the communal bond of the basin as a whole has remained the limiting factor for a century.",
        "Drill Alpha is a fictional basin with features of both. Its upstream state has the engineering capacity of the Indus headworks and none of the treaty discipline; its downstream state has the agricultural dependence of the lower Nile and no seat in any instrument that governs the upstream works. The drought is the trigger, not the cause. The cause is that the relationship has never been given an architecture that the farmers can see.",
      ],
      caseStudy: {
        title: "The Indus Waters Treaty and the Nile Basin: Allocation by Rule and Allocation by Exclusion",
        jurisdiction: "India and Pakistan with the World Bank; the Nile riparian states / South Asia and Eastern and Northern Africa",
        precedent: "Indus Waters Treaty, Karachi, 19 September 1960; Nile Waters Agreement of 1929; Agreement for the Full Utilization of the Nile Waters of 1959; Cooperative Framework Agreement, opened for signature 2010, in force October 2024",
        analysis: [
          "The Indus treaty allocated whole rivers rather than shares of each river, created a Permanent Indus Commission, and routed disagreement up a graded ladder from the Commission to a Neutral Expert and a Court of Arbitration. The Baglihar determination of 2007 and the Kishenganga award of 2013 show the ladder in use.",
          "The 1959 Nile agreement allocated 55.5 billion cubic metres a year to Egypt and 18.5 billion to Sudan, measured at Aswan, and was concluded without the upstream states. The later Cooperative Framework Agreement was concluded without Egypt and Sudan. Each instrument built institutional strength among its own parties and none across the basin.",
          "In 2016 India and Pakistan sought different rungs of the Indus ladder for objections to the same projects, one a Neutral Expert and the other a Court of Arbitration, and the World Bank, after a pause, proceeded with both processes in 2022. The ladder strained where the instrument had not fixed in advance which rung heard which class of disagreement.",
        ],
        failureMechanism:
          "On the Nile, allocation that excluded the states holding the headwaters produced institutional strength on one side of the basin and none across it, so every new project reopened the dispute. On the Indus, a neutral ladder contained the asymmetry for generations but could not fix the choice of rung or compel a party to remain within the instrument.",
      },
      statutoryRule:
        "Rule 5.1-A: A basin settlement must seat every riparian whose waters it allocates. An allocation that excludes the headwaters is a Failing Communal bond written into the treaty.",
    },
    {
      heading: H.architecture,
      subheading: "The Limiting Bond, the Track Tolerance and the Mirror Case",
      paragraphs: [
        "The relational architecture of the drill is set on Desk 01. The four bonds read 3.8 on the Interpersonal bond, 1.9 on the Communal bond, 3.2 on the Intergenerational bond and 3.0 on the Institutional-Relational bond. The foreign ministers have met often and speak plainly to each other, so the Interpersonal bond is Viable. The irrigation boards, the hydropower utility and the river police of the two states have no standing channel at all, and the one inherited boundary commission has not met in years: the Institutional-Relational bond sits exactly on the floor. The downstream districts are rationed and the upstream districts are blamed: the Communal bond is Failing.",
        "Under the Liebig minimum, the relationship is as strong as its weakest bond, not its average. The mean of the four bonds is about 2.98, which looks like a Fragile relationship close to viability; the minimum is 1.9, which is a Failing one. The doctrine reads the minimum, because the minimum is where a settlement breaks: no amount of ministerial rapport can deliver water to a district that does not believe the ministers. The Institutional-Relational bond at 3.0 is a second breach, because the floor test is strict. A bond must stand above 3.0, not on it.",
        "Track Sequencing on Desk 08 converts the Communal bond into a tolerance. A Failing Communal bond, from 1.0 to 2.0, tolerates no lead at all of the principals' track over the communal track; a Fragile bond tolerates one phase; a Viable or Fortified bond tolerates two. In the drill the tolerance is zero. Every ministerial step that runs ahead of a communal step trips the Elite-Pact Mirage, the trap in which leaders agree in the capital and the agreement dies in the districts.",
        "Desk 01 also places the live vector in the space of documented cases. The nearest is Kenya, 1.221 away, a resonance of 84.7, followed by Colombia. A resonance is a rescaled distance in the four-bond space, normalised by 8, the widest distance two vectors on the 1 to 5 scale can reach. It tells the operator which settlement shares the structural shape of this one; it does not say the drill will end the same way. Here the shape is the familiar one: elite trust strong, communal trust failing, and institutions too thin to carry the difference.",
        "Three readings follow on other desks, and the operator should hold them together before acting. The Vector Integrity gate holds while any bond is at or below the floor. The Conditional Escrow Waterfall can release Mobilisation once a verifier is seated, and nothing further while the Communal bond is at or below 3.0. The Forum Matrix is unaffected by the bonds, which is why the dispute clause can be drafted early, before the bonds that will later depend on it have moved.",
      ],
      formulas: [F_LIEBIG, F_TRACK, F_CASE_DISTANCE, F_RESONANCE],
      statutoryRule:
        "Rule 5.1-B: The limiting bond sets the ceiling. Effort spent on a bond that is already above the floor does not move the relationship while another bond is failing.",
    },
    {
      heading: H.proofs,
      subheading: "The Drought as a Trend, and the Arithmetic of the Corridor",
      paragraphs: [
        "The drought does not enter the engine as a separate variable. It enters as what an analyst observes: tripwires marked on the Sentinel Matrix and a trend direction. Suppose the analyst has marked tripwires totalling a weight of 20 on the standard register of 56. Under a static trend the Rupture Index is \\(\\round(\\frac{100 \\times 20}{56}) = \\round(35.71) = 36\\), the Elevated band. When the drought sets in and the register is read as deteriorating, the same observed share is multiplied by 1.15: \\(\\round(35.71 \\times 1.15) = \\round(41.07) = 41\\).",
        "The difference of five points is the whole lesson of the trend multiplier. Nothing new has been observed; the direction of what has been observed has changed. At 41 the reading has crossed the provisional-measures threshold of 40, and the Legal Desk drafts a fourth pleading head asking for provisional measures. At 36 it had not. The drought, in other words, moves the dispute from a negotiation that can wait for a forum into one that may need interim protection from it.",
        "The Critical band is further away than the drought makes it feel. Under a deteriorating trend the standard register enters the Critical band at a score of 29: \\(\\round(\\frac{100 \\times 29}{56} \\times 1.15) = 60\\). Nine more points of weight, three tripwires of weight 3, would freeze every disbursement in the corridor fund. The operator should know that number before the season turns, because the freeze is the consequence the downstream districts will feel first.",
        "The escrow arithmetic follows from the bonds. With a verifier seated and the Communal bond at 1.9, only the Mobilisation tranche is met. The gross is 25; the clawback reserve is ten per cent of the gross, 2.5; the performance bond is \\(\\min(5,\\, 25 - 2.5) = 5\\); the corridor fund releases \\(25 - 2.5 - 5 = 17.5\\), that is 17.5 per cent of the pledge. Raise the Communal bond to 3.4 and Demarcation is met as well: the gross is 50, the reserves 5 and 5, and 40 per cent is released. Operational Commissioning still waits on the Institutional-Relational bond rising above 3.0, and Final Cession on the Intergenerational bond and survival under succession stress.",
        "The track tolerance moves in steps with the Communal bond: zero phases at 1.9, one phase at 2.6, two phases at 3.4. The proof is a reading of the band table, not a calculation, but the consequence is quantitative. At zero phases the commission's ministerial plenary cannot be convened until a communal step has been completed; at one phase a plenary may precede the next communal step by one stage; at two it may lead by two. Raising the Communal bond is therefore the only move that both releases money and frees the principals.",
        "Finally, the venue. The Forum Matrix computes venue fitness as base enforceability less 18 while immunity is unaddressed and less 8 when the seat lies in a party's territory. A Permanent Court of Arbitration clause carries a base of 74. Drafted with a neutral seat and an express waiver, it keeps 74; with neither, it falls to 48. The 26 points are not a property of the venue; they are a property of the drafting, and the drafting is in the operator's hands on the first day.",
      ],
      formulas: [F_RUPTURE, F_ESCROW_CHAIN, F_FORUM_F],
      statutoryRule:
        "Rule 5.1-C: A change of trend is a change of reading. When the season turns, the analyst re-reads the register and the desks recompute; no one adjusts a threshold to absorb the drought.",
    },
    {
      heading: H.protocols,
      subheading: "Walking the Corridor Through the Desks",
      paragraphs: [
        "Step one, Desk 01 and Desk 02: record the vector and the register as they stand, with the trend set to deteriorating for the drought season. Publish them to the bus. Every later desk reads these figures; none re-enters them.",
        "Step two, Track Sequencing (Desk 08): with the tolerance at zero, sequence the communal track first. The basin commission's first work is in the rationed districts: public hearings on the allocation, joint gauging stations on the main stem with readings published to both banks at the same hour, and a drought protocol that states in advance how the reduced flow will be shared. These are communal steps because they change what the farmers can see. A ministerial communiqué is not.",
        "Step three, Verification Ledger (Desk 16): seat an independent verifier for the gauging data. At a Rupture Index of 35 or more the Rupture Containment gate requires one in any case, and seating one meets the Mobilisation condition of the escrow downstream. The verifier must be neither appointed nor funded nor removable by either state; in a basin, the natural candidate is a technical body that both banks already use for data.",
        "Step four, the Conditional Escrow Waterfall (Desk 07): structure the corridor fund in the four default tranches of 25, 25, 30 and 20. Mobilisation funds the gauging network and the hearings. Demarcation funds the survey of the river boundary and waits on the Communal bond. Operational Commissioning funds the joint operating rules for the barrages and waits on the Institutional-Relational bond and the track gap. Final Cession funds the long-term basin trust and waits on the Intergenerational bond and survival under succession stress. The waterfall reads every condition from the bus; the operator does not negotiate them.",
        "Step five, the Forum Matrix (Desk 11): draft the dispute clause now, before it is needed, and fix the rungs. Flow data and gauging questions go to the commission. Technical differences on the operation of the barrages go to a neutral expert named by an institution outside the basin. Disputes on allocation or on the boundary go to arbitration administered by the Permanent Court of Arbitration, seated outside both states, with an express waiver of immunity. The clause states which class of disagreement goes where, so that neither party can choose a different rung for the same question.",
        "Step six, the Legal Desk: with the Rupture Index at 41, prepare the provisional-measures head. It is not filed to win the dispute; it is filed so that the downstream districts can be protected during the drought season while the commission does its work.",
        "Step seven, Mission Readiness (Desk 15): read the stage gates and the statutory clearances. The Vector Integrity gate will hold until both breaching bonds rise above 3.0. That is the correct reading, and the operator reports it as such.",
      ],
      statutoryRule:
        "Rule 5.1-D: No corridor resource releases past Mobilisation while the Communal bond sits at or below 3.0. The waterfall enforces this from the bus; the operator does not negotiate it.",
    },
    {
      heading: H.failure,
      subheading: "Ministerial Summits, Allocation by Exclusion and the Unfixed Rung",
      paragraphs: [
        "Failure mode one: the summit cure. The foreign ministers trust each other, so the first instinct is a summit and a joint declaration. Under the Liebig minimum this moves nothing: the Interpersonal bond is already the strongest of the four. Worse, with the track tolerance at zero, a ministerial step ahead of the communal track trips the Elite-Pact Mirage. The countermeasure is sequencing. The ministers may meet, but what they announce must be a communal step: a published drought-sharing protocol, not a statement of friendship.",
        "Failure mode two: allocation by exclusion. Under pressure of the season, the downstream state proposes an emergency allocation with a third downstream user and presents it to the upstream state as settled. This is the Nile pattern, and it produces the same result: institutional strength among the parties who signed and none across the river. The countermeasure is the seating rule. Every riparian whose water is allocated sits at the commission, or the allocation does not enter the instrument.",
        "Failure mode three: the unfixed rung. The dispute clause names a neutral expert and an arbitral tribunal but leaves the choice to the parties. When the first barrage dispute arises, the upstream state seeks an expert and the downstream state a tribunal, and the instrument has no answer. This is the strain the Indus ladder showed from 2016. The countermeasure is drafting: each class of disagreement is assigned to one rung in the clause itself.",
        "Failure mode four: averaging the vector. An analyst reports the mean bond of about 2.98 to the principals as evidence that the relationship is nearly viable. The countermeasure is the Liebig reading. The mean is reported beside the minimum and never in place of it, and the limiting bond is named in every dispatch.",
        "Failure mode five: freezing the threshold instead of the money. As the drought deepens and the Rupture Index approaches 60, someone proposes to raise the freeze threshold so that the corridor fund can keep paying for water trucks. The countermeasure is that the threshold is part of the engine and not a mission setting. If the reading reaches 60, the account freezes; the remedy is a lower reading, achieved by the communal steps that lower it.",
        "The Liebig bottleneck is the thread through all five. The basin relationship is limited by the bond the farmers carry, and every failure mode is a way of working on a different bond because it is easier to reach.",
      ],
      statutoryRule:
        "Rule 5.1-E: The dispute clause must fix which forum hears which class of disagreement. Leaving the choice of rung to the parties reopens the asymmetry at the moment of dispute.",
    },
    {
      heading: H.instrument,
      subheading: "The Limiting Bond on the Radar",
      paragraphs: [
        "Load the drill vector on the radar cutaway: 3.8, 1.9, 3.2 and 3.0. The polygon collapses toward the Communal axis, and the readout names it as the limiting bond in the Failing band. Raise the Interpersonal bond to 5.0 and watch the limiting reading stay where it was. Then raise the Communal bond step by step: at 2.1 it leaves the Failing band, and above 3.0 the limiting bond passes to the Institutional-Relational axis, which still sits on the floor. Only when both are above 3.0 does the vector hold the floor. The cutaway computes through the desks' own functions and never publishes to the bus.",
      ],
      instrument: "radar",
    },
  ],
  quiz: [
    {
      id: "q5-1-1",
      question: "In Drill Alpha the Communal bond reads 1.9. What is the tolerated lead of Track I over Track II?",
      options: [
        { id: "opt-a", text: "Two phases.", explanation: "Incorrect. Two phases are tolerated only when the Communal bond is Viable or Fortified.", correct: false },
        { id: "opt-b", text: "One phase.", explanation: "Incorrect. One phase is tolerated when the Communal bond is Fragile.", correct: false },
        { id: "opt-c", text: "Zero phases.", explanation: "Correct. A Failing Communal bond tolerates no lead of the principals' track at all.", correct: true },
        { id: "opt-d", text: "Unlimited, because the ministers trust each other at 3.8.", explanation: "Incorrect. Interpersonal trust does not set the track tolerance; the Communal bond does.", correct: false },
      ],
    },
    {
      id: "q5-1-2",
      question: "With a verifier seated and the Communal bond at 1.9, what does the corridor escrow release at the default terms?",
      options: [
        { id: "opt-a", text: "17.5 per cent: Mobilisation only.", explanation: "Correct. Gross 25, clawback 2.5, performance bond 5: \\(25 - 2.5 - 5 = 17.5\\).", correct: true },
        { id: "opt-b", text: "50 per cent: Mobilisation and Demarcation.", explanation: "Incorrect. Demarcation requires the Communal bond above 3.0.", correct: false },
        { id: "opt-c", text: "25 per cent: the full Mobilisation share.", explanation: "Incorrect. Before Final Cession the clawback and the performance bond are held back.", correct: false },
        { id: "opt-d", text: "0 per cent.", explanation: "Incorrect. The account is not frozen and the Mobilisation condition holds.", correct: false },
      ],
    },
    {
      id: "q5-1-3",
      question: "A register score of 20 on the standard register reads 36 under a static trend. The drought sets in and the analyst reads the trend as deteriorating. What follows?",
      options: [
        { id: "opt-a", text: "The index stays at 36, because nothing new was observed.", explanation: "Incorrect. The trend multiplier scales the whole reading; a change of direction is a change of reading.", correct: false },
        { id: "opt-b", text: "The index reads 41 and the Legal Desk drafts a provisional-measures head.", explanation: "Correct. \\(\\round(35.71 \\times 1.15) = 41\\), which crosses the provisional-measures threshold of 40.", correct: true },
        { id: "opt-c", text: "The index reads 60 and the escrow freezes.", explanation: "Incorrect. Under a deteriorating trend the Critical band is entered at a register score of 29, not 20.", correct: false },
        { id: "opt-d", text: "The freeze threshold is lowered for the drought season.", explanation: "Incorrect. Thresholds are part of the engine and do not move with the season.", correct: false },
      ],
    },
    {
      id: "q5-1-4",
      question: "What structural lesson do the Nile and Indus instruments offer the drill together?",
      options: [
        { id: "opt-a", text: "Allocation among some riparians builds strength on one side only, and a neutral ladder must fix in advance which rung hears which disagreement.", explanation: "Correct. The Nile shows the cost of exclusion; the Indus shows both the value of a neutral ladder and the strain of an unfixed rung.", correct: true },
        { id: "opt-b", text: "Basin disputes are settled by hydrology alone.", explanation: "Incorrect. The disputes are relational and institutional, not only hydrological.", correct: false },
        { id: "opt-c", text: "A single large dam resolves the asymmetry.", explanation: "Incorrect. On the Nile a dam became a new focus of the dispute.", correct: false },
        { id: "opt-d", text: "Basin treaties need no dispute clause if the ministers trust each other.", explanation: "Incorrect. Ministerial trust is the Interpersonal bond; it is not the limiting factor here.", correct: false },
      ],
    },
  ],
};
