import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import {
  F_CASE_DISTANCE,
  F_DECAY,
  F_EXPOSURE,
  F_FRACTURE,
  F_FRICTION,
  F_HALF_LIFE,
  F_INSCRIBED,
  F_PRESERVED,
  F_RESONANCE,
  F_RUPTURE,
} from "./academyFormulas";

/**
 * Module IV, Chapters 4.1 to 4.3, in the seven-part lecture structure. Every formula,
 * constant and worked figure is the one the desks compute; the worked figures are
 * re-derived from engine.ts and instruments.ts in qa/academy-curriculum.test.ts.
 */

export const CHAPTER_4_1: DetailedAcademyChapter = {
  id: "rupture-index-proof",
  number: "4.1",
  eyebrow: "Module IV · Chapter 4.1",
  title: "The Rupture Index (R): Load-to-Bond Derivation",
  estimatedMinutes: 40,
  executiveLede:
    "Relational rupture rarely announces itself. It accumulates through signs that are individually unremarkable: a principal who now speaks only through intermediaries, a grievance mechanism that receives complaints and resolves none, a verifier quietly dependent on the party it verifies. The Sentinel Matrix (Desk 02, The Eye of Humanity) gathers these signs into a weighted register, adds the structural load inscribed on the bus, scales the sum by the observed trend, and reports the composite Rupture Index \\(R\\) as a whole number from 0 to 100.",
  synopsis: [
    "The Rupture Index measures how near a covenant stands to open breakdown. Its load is the weighted share of observed tripwires plus the inscribed structural load placed on the bus through the Sovereign Inscription tray; its direction is a verified trend multiplier: improving 0.85, static 1.00, deteriorating 1.15. The result is rounded half-up and capped at 100.",
    "The index is read in four bands: Stable below 15, Guarded from 15 to 34, Elevated from 35 to 59 and Critical at 60 and above. The bands carry consequences on other desks. At 35 an independent verifier must be seated and an office-continuity covenant drafted; at 40 the Legal Desk drafts a provisional-measures head; at 60 the Conditional Escrow Waterfall freezes every disbursement.",
    "The lecture opens with the Arusha Accords of 1993, read as a register of tripwires that filled in plain view, then derives the index from its register, proves its step granularity, places it on the desks, and closes with the failure modes that make an analyst misread it.",
  ],
  statutoryNotice:
    "Canonical Rule (Desk 02): \\(R = \\min(100,\\, \\round((\\frac{100\\, \\sigma}{W} + I) \\times \\tau))\\). The index is a rule applied to what the analyst recorded; it does not observe the theatre and it predicts nothing.",
  learningOutcomes: [
    "Read a historical settlement as a register of weighted tripwires rather than a narrative of sudden collapse.",
    "Derive the Rupture Index from the weighted tripwire register, the inscribed load and the trend multiplier.",
    "Prove the step granularity of the index and compute the minimum register score that enters each band.",
    "Trace the consequences of the Elevated (35), provisional-measures (40) and Critical (60) thresholds across the desks.",
    "Diagnose the common misreadings of the index and apply their countermeasures.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Arusha Accords and the Unread Register (1993 to 1994)",
      paragraphs: [
        "The doctrine holds that the rupture of a settlement is visible in its tripwires before it is visible in its violence. The first task of the chapter is to see what that claim means in a real case, read only from the open public record, and to notice how little of the warning was hidden.",
        "The Arusha negotiation between the Government of Rwanda and the Rwandese Patriotic Front ran through 1992 and 1993 under Tanzanian facilitation, with regional states and international observers present. Its product was not a single text but a set of protocols: on the rule of law, on power-sharing in a Broad-Based Transitional Government, on the repatriation of refugees, and on the integration of the two armed forces. Taken together they were among the most detailed peace instruments of their time.",
        "Detail, however, is not the same thing as a register. The protocols specified what the transitional institutions would be; they did not specify what would happen if their installation slipped, if armed groups outside the agreement mobilised, or if the language of public broadcasting turned toward incitement. Nothing in the instrument converted an accumulation of warning signs into an obligatory response.",
        "This is the structural point of the case. Each sign, taken alone, could be explained away as delay, politics or noise. Taken together and weighted, they described a settlement whose Communal, Interpersonal and Institutional-Relational bonds were all under load at once. The Sentinel Matrix exists to prevent exactly that kind of explaining away.",
      ],
      caseStudy: {
        title: "The Arusha Accords and the Unread Register (1993 to 1994)",
        jurisdiction: "Government of Rwanda and the Rwandese Patriotic Front / Great Lakes",
        precedent: "Arusha Peace Agreement, signed 4 August 1993; UNAMIR established by Security Council Resolution 872 (5 October 1993)",
        analysis: [
          "The Arusha Peace Agreement provided for power-sharing in a Broad-Based Transitional Government, a transitional National Assembly, the integration of the two armies and the return of refugees. The Security Council established the United Nations Assistance Mission for Rwanda to support its implementation.",
          "The transitional institutions the Accords required were repeatedly delayed and never installed. In the same period, broadcasting that incited hatred against the Tutsi was on the air, and in January 1994 the mission's force commander reported warnings of arms caches and planned killings to United Nations headquarters. Read through the Sentinel Matrix, these are tripwires on three bonds at once: an institutional calendar slipping without consequence, communal signals of mobilisation against a group, and an interpersonal channel between principals that no longer carried the process.",
          "On 6 April 1994 the aircraft carrying the President of Rwanda was shot down, and the genocide against the Tutsi began within hours. The Accords did not fail on that night alone; their register had been filling for months, and no mechanism in the instrument converted the accumulating signs into an obligatory response.",
        ],
        failureMechanism:
          "An accord with no weighted early-warning register and no automatic consequence for slipping milestones allowed signs on several bonds to accumulate without any of them triggering action.",
      },
      statutoryRule:
        "Rule 4.1-A: Every warning sign observed in a theatre is recorded with its bond and its weight. An unrecorded sign is not a reading, and a narrative impression is never a substitute for the register.",
    },
    {
      heading: H.architecture,
      subheading: "Twenty-Four Tripwires, Four Bonds, Fifty-Six Points of Weight",
      paragraphs: [
        "The standard register of the Sentinel Matrix comprises twenty-four tripwires, six for each bond. Each carries a weight of 1, 2 or 3 according to its doctrinal gravity, and the weights total 56: thirteen on the Interpersonal bond, fifteen on the Communal, fourteen on the Intergenerational and fourteen on the Institutional-Relational. Nine tripwires carry weight 3, fourteen carry weight 2, and one carries weight 1.",
        "The analyst may add custom indicators for a theatre the standard register does not cover, each assigned to a bond and given a weight. A custom indicator enters both the observed score when it is marked and the register total whether or not it is marked, so that adding indicators never inflates the index by itself: it widens the denominator before it can raise the numerator.",
        "The second component is the inscribed load. When the analyst places custom shocks or custom traps on the bus through the Sovereign Inscription tray, the engine converts them into rupture pressure: five points per point of negative bond delta carried by the inscribed shocks, and six points per active inscribed trap, capped at 30. Positive deltas are ignored, because an inscription that strengthens a bond is not a source of rupture.",
        "The third component is the trend. The analyst sets the observation trend to improving, static or deteriorating, and the engine applies the canonical multipliers 0.85, 1.00 and 1.15. The multiplier scales the whole sum, the inscribed load included, so a settlement losing ground is read as worse than its static count, and one gaining ground as better.",
        "The desk also computes a strain percentage for each bond, the weight present on that bond over the bond's own total, and from these strains it detects five latent traps: the Elite-Pact Mirage, the Generational Cliff, Unanchored Repair, Bond Theater and Systemic Bond Collapse. These traps are diagnostic readings for the drafting and governance divisions. They do not add to the index.",
        "The weights are doctrinal judgements of gravity, not frequencies. A tripwire of weight 3 marks a sign that, on its own, already describes a bond under structural attack: a principal channel closed, a verifier captured, a communal mobilisation against a group. A tripwire of weight 1 marks a sign that matters only in company. The register therefore rewards an analyst who records many small signs honestly, and it punishes an analyst who records only the dramatic ones, because the share of weight present is what the index reports.",
        "Because the denominator is the whole register, adding custom indicators changes what each existing tripwire is worth. An analyst who adds four custom indicators of weight 2 raises the register total from 56 to 64, and each point of observed weight is then worth \\(\\frac{100}{64}\\) of the index rather than \\(\\frac{100}{56}\\). A custom indicator is a commitment to watch something, and the register holds the analyst to it: an indicator added and never marked lowers the reading of everything else.",
      ],
      formulas: [F_INSCRIBED],
      statutoryRule:
        "Rule 4.1-B: Only inscribed custom shocks and active inscribed traps contribute to the inscribed load. An analyst who expects a standard trap on the matrix to raise the index will be mistaken.",
    },
    {
      heading: H.proofs,
      subheading: "The Formal Definition, Its Granularity and the Band Thresholds",
      paragraphs: [
        "Let \\(\\sigma\\) be the weight of the tripwires marked present, \\(W\\) the weight of the whole register, \\(I\\) the inscribed load and \\(\\tau\\) the trend multiplier. The base term \\(\\frac{100\\, \\sigma}{W}\\) is the weighted proportion of the register present; the engine adds the inscribed load, multiplies by the trend, rounds half-up to a whole number and caps the result at 100.",
        "Granularity follows directly. With the standard register alone each point of weight is worth \\(\\frac{100}{56} \\approx 1.786\\) points of the index, so the index moves in steps of roughly 1.8, 3.6 or 5.4 as tripwires of weight 1, 2 or 3 are marked. Under a static trend the index cannot take the values 35 or 60: a weight of 19 yields 34 and a weight of 20 yields 36, so the Elevated band is entered at a weight of 20; a weight of 33 yields 59 and a weight of 34 yields 61, so the Critical band is entered at 34.",
        "The trend moves the thresholds. Under a deteriorating trend a weight of 29 yields \\(\\round(51.786 \\times 1.15) = 60\\), so the Critical band arrives five points of weight earlier. Under an improving trend the Critical band is not entered until a weight of 40, and the improving multiplier caps the index attainable from the standard register at 85.",
        "The inscribed load is additive before the trend. One inscribed shock with deltas of \\(-0.5\\) on the Interpersonal bond and \\(-1.0\\) on the Communal bond, together with one active inscribed trap, yields \\(I = \\min(30,\\, \\round(5 \\times 1.5 + 6)) = 14\\). An observed share of 40 with an inscribed load of 12 reads 60 under a deteriorating trend and 44 under an improving one: the same field, read in two directions, sits in two different bands.",
        "Two guards complete the definition. A negative or non-finite observed share or load reads as zero, so missing data can never manufacture rupture; and a trend multiplier outside the three canonical values falls back to the static 1.00.",
      ],
      formulas: [F_RUPTURE, F_INSCRIBED],
      statutoryRule:
        "Rule 4.1-C: The bands are Stable below 15, Guarded 15 to 34, Elevated 35 to 59 and Critical 60 and above. No other threshold applies to the index.",
    },
    {
      heading: H.protocols,
      subheading: "Where Each Threshold Bites Across the Desks",
      paragraphs: [
        "The Rupture Index is published to the bus with its band, the per-bond strain, the latent traps, the trend and the multiplier. Every downstream desk reads that one value; none recomputes it.",
        "At 35 per cent, the Elevated band, two obligations attach. Stage Gate 2 (Rupture Containment) fails unless an independent verifier is seated in the Verification Ledger (Desk 16), and Stage Gate 4 (Structural Covenants) requires an office-continuity provision drafted in the Clause Architect (Desk 10). The engine also raises two locks naming exactly those remedies.",
        "At 40 per cent the Legal Desk (Desk 13) adds a fourth pleading head for provisional measures, requesting interim protection of the relational record pending the merits.",
        "At 60 per cent, the Critical band, the Conditional Escrow Waterfall on the De-confliction Bench (Desk 07) freezes and releases nothing, whatever tranches are met. Statutory clearance 2.2 fails unless a verifier is seated. The standing alert directs the operator to convene principals and the verifier within fourteen days and to activate the continuity provisions.",
        "Upstream of all these, the index enters the Decay Horizon on the Succession Simulator (Desk 12) as part of the decay constant, the succession durability formula as a penalty of 0.20 on its normalised value, the contagion coefficient as a multiplier, and the Dominum Index as containment, \\(C = 1 - \\frac{R}{100}\\). One reading therefore moves five other instruments at once.",
        "The operating protocol is therefore sequential: record the tripwires honestly, set the trend only on verified evidence of movement, read the band, and then discharge each obligation the band attaches before any further concession is tabled.",
      ],
      statutoryRule:
        "Rule 4.1-D: The Critical band freezes the Conditional Escrow Waterfall absolutely. Seating a verifier may pass the rupture gate; it never lifts the freeze. Only a lower rupture reading does.",
    },
    {
      heading: H.failure,
      subheading: "Misreadings of the Index and Their Countermeasures",
      paragraphs: [
        "Failure mode one: the narrative override. A principal argues that the register is overstating danger because the signs are routine. The countermeasure is the register itself: each sign is either present or not, and its weight is fixed. A disagreement about whether a sign is present is resolved by evidence, recorded in the Decision Log, never by lowering the weight.",
        "Failure mode two: trend optimism. An improving trend is selected because talks resumed, not because tripwires cleared. The multiplier then hides as much as a fifth of the reading. The countermeasure is to set improving only when signs have been cleared in the period and the clearance has been verified independently.",
        "Failure mode three: the trap illusion. The analyst sees the Generational Cliff appear on the matrix and expects the index to rise. It does not. Only inscribed custom traps add load. The countermeasure is to carry a detected standard trap into the drafting desks as a covenant requirement, not to wait for the index to react.",
        "Failure mode four: the average comfort. A mean bond of 3.7 is cited as evidence that a high index must be wrong. The countermeasure is the Liebig minimum. The tripwires that fill the register are concentrated on the weakest bond; the index and the limiting bond tell the same story from two sides, and the mean tells neither.",
        "Failure mode five: the threshold step. Because the index moves in steps, a register that reads 34 can cross into Elevated with a single weight-2 tripwire. The countermeasure is to treat the Guarded band's upper edge as a planning threshold: seat the verifier before it is mandatory, not on the day it becomes so.",
        "A worked misreading. The register stands at a weight of 19 under a static trend, and the index reads 34, Guarded. The analyst reports that the mission is below the Elevated band and that no verifier is yet required. The report is arithmetically true and operationally careless: one further tripwire of weight 1 takes the score to 20 and the index to 36, which requires a verifier seated and an office-continuity covenant drafted. The countermeasure is to report the distance to the next band in weight, not only the band itself.",
        "A second misreading runs the other way. A register of 40 of weight under an improving trend reads \\(\\round(71.43 \\times 0.85) = 61\\), still Critical. An analyst who expects the improving trend to lift the freeze will be disappointed: the multiplier scales what has been observed, and while that much of the register remains marked, no trend reading can take the index below 60. Improvement is measured by unmarking tripwires that are no longer present, with the evidence that they are gone.",
      ],
      statutoryRule:
        "Rule 4.1-E: The weakest bond is where the register fills first. Repair on the limiting bond is the only intervention that lowers the index durably.",
    },
    {
      heading: H.instrument,
      subheading: "Rupture Jumps Under Compound Shock",
      paragraphs: [
        "The cutaway below applies three demonstration shocks in order to a viable vector. At each step the Rupture Index is recomputed through the Sentinel rule with the inscribed load of the shocks applied so far, and the half-life through the Decay Horizon. Move the observed share and the trend to see the index cross 40 and 60, and watch the steps at which the provisional-pleadings and escrow-freeze markers first trip.",
        "Nothing in the cutaway reaches the mission. It is the Rehearsal Drawer's own timeline function run over a demonstration state held only in this lecture.",
      ],
      instrument: "timeline",
    },
  ],
  quiz: [
    {
      id: "q4-1-1",
      question: "With the standard register (\\(W = 56\\)), a static trend and no inscribed load, an analyst marks tripwires totalling a weight of 20. What does the Sentinel Matrix read?",
      options: [
        { id: "opt-a", text: "34 per cent, Guarded", explanation: "Incorrect. A weight of 19 yields 34. A weight of 20 yields \\(\\frac{2000}{56} = 35.71\\), which rounds to 36.", correct: false },
        { id: "opt-b", text: "36 per cent, Elevated", explanation: "Correct. \\(\\frac{100 \\times 20}{56} = 35.71\\), times 1.00, rounds to 36: the Elevated band, which requires a verifier seated and an office-continuity covenant.", correct: true },
        { id: "opt-c", text: "35 per cent, Elevated", explanation: "Incorrect. Under a static trend the standard register cannot produce exactly 35; the index steps from 34 to 36.", correct: false },
        { id: "opt-d", text: "20 per cent, Guarded", explanation: "Incorrect. The index is the weighted share of the register, not the raw weight.", correct: false },
      ],
    },
    {
      id: "q4-1-2",
      question: "The Rupture Index reads 61 per cent and an independent verifier is seated. What happens to the Conditional Escrow Waterfall?",
      options: [
        { id: "opt-a", text: "It releases normally, because the verifier satisfies the rupture gate.", explanation: "Incorrect. The verifier satisfies the Rupture Containment gate, but the escrow freeze is a separate rule that a verifier cannot discharge.", correct: false },
        { id: "opt-b", text: "It releases only Tranche 1.", explanation: "Incorrect. Under the freeze nothing is released, whatever tranches are met.", correct: false },
        { id: "opt-c", text: "It is frozen and releases nothing until the index falls below 60.", explanation: "Correct. At \\(R \\ge 60\\) the released share is zero. The freeze is not a forfeiture: when the index falls below 60, release resumes at the level the tranches then justify.", correct: true },
        { id: "opt-d", text: "It forfeits all unreleased tranches permanently.", explanation: "Incorrect. The tranches remain met and the account recomputes once the rupture reading falls.", correct: false },
      ],
    },
    {
      id: "q4-1-3",
      question: "Which of the following raises the Rupture Index directly?",
      options: [
        { id: "opt-a", text: "The Generational Cliff trap appearing on the matrix.", explanation: "Incorrect. Standard traps are diagnostic readings published for the drafting divisions; they do not add to the index.", correct: false },
        { id: "opt-b", text: "An active inscribed custom trap placed through the Sovereign Inscription tray.", explanation: "Correct. Each active inscribed trap adds six points of inscribed load, within the cap of 30.", correct: true },
        { id: "opt-c", text: "A higher mean bond on Desk 01.", explanation: "Incorrect. The bond mean does not enter the Rupture Index.", correct: false },
        { id: "opt-d", text: "Selecting a forum with low enforceability on Desk 11.", explanation: "Incorrect. Forum fitness is a separate reading and does not feed the index.", correct: false },
      ],
    },
    {
      id: "q4-1-4",
      question: "Under a deteriorating trend, an observed share of 40 and an inscribed load of 12 give which band?",
      options: [
        { id: "opt-a", text: "Elevated, at 52.", explanation: "Incorrect. The trend multiplies the whole sum: \\((40 + 12) \\times 1.15 = 59.8\\).", correct: false },
        { id: "opt-b", text: "Critical, at 60.", explanation: "Correct. \\(\\round(52 \\times 1.15) = \\round(59.8) = 60\\), the Critical band, and the escrow freezes.", correct: true },
        { id: "opt-c", text: "Guarded, at 34.", explanation: "Incorrect. Recompute the sum before applying the multiplier.", correct: false },
        { id: "opt-d", text: "Stable, because inscribed load is ignored under a deteriorating trend.", explanation: "Incorrect. The inscribed load is always added before the trend is applied.", correct: false },
      ],
    },
  ],
};

export const CHAPTER_4_2: DetailedAcademyChapter = {
  id: "decay-horizon-half-life",
  number: "4.2",
  eyebrow: "Module IV · Chapter 4.2",
  title: "The Decay Horizon (τ): Exponential Half-Life Modeling",
  estimatedMinutes: 40,
  executiveLede:
    "A relational settlement is not a static object. A bond scored at 3.8 is scored at that level on the day of the reading, under the exposures then in force. Relational capital depreciates when it is not maintained, and faster when the settlement carries unabsorbed shocks and when the early-warning matrix reads active rupture. The Decay Horizon on the Succession Simulator (Desk 12) turns that doctrine into one declared law, whose time constant the doctrine calls the horizon \\(\\tau\\) and the code computes as a decay constant \\(\\lambda\\) and a half-life \\(t_{1/2}\\).",
  synopsis: [
    "The decay constant is the sum of the unmitigated exposure \\(U\\) and the Rupture Index \\(R\\), divided by 2000, per day. Each bond then decays by first-order kinetics, \\(B_{i}(t) = \\max(1.0,\\, B_{i}(0)\\, e^{-\\lambda t})\\), and no bond is ever projected below the 1.0 sovereign floor.",
    "The stability half-life \\(t_{1/2} = \\frac{\\ln 2}{\\lambda}\\) states how many days it would take for a bond to lose half its strength if nothing were done. The critical fracture window states when the mean bond would reach the 2.0 fracture level. When the projected mean falls below 2.0 within the horizon, a change of leadership risks acute covenant failure.",
    "These are not forecasts. They are the arithmetic consequence of a declared law applied to declared inputs. The lecture reads the Oslo interim period of 1993 to 1999 as a settlement whose deferred core decayed while the clock ran, then derives the law and places it on the desks.",
  ],
  statutoryNotice:
    "Canonical Rule (Desk 12): \\(\\lambda = \\frac{\\max(0,\\, U + R)}{2000}\\) per day; \\(t_{1/2} = \\frac{\\ln 2}{\\lambda}\\); \\(B_{i}(t) = \\max(1.0,\\, B_{i}(0)\\, e^{-\\lambda t})\\). Decay and fracture figures are rules applied to the inputs, not forecasts.",
  learningOutcomes: [
    "Explain why an interim settlement that defers its core questions carries a decay clock from the day it is signed.",
    "Derive the decay law from the first-order premise that a bond loses a constant fraction of its strength per day.",
    "Compute the decay constant, the stability half-life and the projected bonds at the 30, 90, 180 and 365 day horizons.",
    "Compute the critical fracture window and classify it as stable, monitored, acute or imminent.",
    "Use insulating provisions and rupture reduction to restore temporal runway, and recognise when each dominates.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Oslo Interim Period and the Deferred Core (1993 to 1999)",
      paragraphs: [
        "An interim agreement that postpones its hardest questions does not freeze the relationship while the parties deliberate. Under the decay law, every day of unaddressed exposure and measured rupture subtracts the same fraction of whatever trust remains. The longer the core is deferred, the less relational capital is left to carry it when it is finally tabled.",
        "The Oslo process is the most studied modern example of a settlement designed around deferral. Its architects judged, reasonably, that the parties could not resolve the permanent status questions in 1993, and that a period of cooperation would build the confidence to resolve them later. The judgement turned on a premise the decay law makes explicit: that confidence would accumulate faster than it was consumed.",
      ],
      caseStudy: {
        title: "The Oslo Interim Period and the Deferred Core (1993 to 1999)",
        jurisdiction: "Government of Israel and the Palestine Liberation Organization / Middle East",
        precedent: "Declaration of Principles on Interim Self-Government Arrangements, signed 13 September 1993; Interim Agreement (Oslo II), 28 September 1995",
        analysis: [
          "The Declaration of Principles established a transitional period not exceeding five years, beginning with the withdrawal from the Gaza Strip and the Jericho area in May 1994. Permanent status negotiations on the most contested issues, including Jerusalem, refugees, settlements, security arrangements and borders, were to begin no later than the beginning of the third year of the interim period.",
          "The interim period was designed as a confidence-building runway. In the event it carried mounting exposure: violent attacks, the assassination of Prime Minister Yitzhak Rabin on 4 November 1995, delays in scheduled redeployments and the expansion of settlements. The permanent status questions were not resolved when the five-year period ran out in May 1999, and the Camp David summit of July 2000 ended without agreement.",
          "Read through the Decay Horizon, the deferral was not neutral time. Each unabsorbed shock entered the exposure, each period of active violence entered the rupture reading, and the decay constant rose while the deadline approached. By the time the core was tabled, the bonds that were meant to carry it had been spent.",
        ],
        failureMechanism:
          "Deferring the core questions behind a fixed interim calendar, without insulating provisions or scheduled renewals, let relational capital decay faster than the confidence-building measures could replace it.",
      },
      statutoryRule:
        "Rule 4.2-A: An interim instrument must carry its own decay clock. Renewals and insulating provisions are scheduled against the stability half-life, not against a political calendar.",
    },
    {
      heading: H.architecture,
      subheading: "Inputs: Unmitigated Exposure and Measured Rupture",
      paragraphs: [
        "The Decay Horizon takes two inputs from the bus and one choice from the analyst. The unmitigated exposure \\(U\\) is read from the Succession Simulator on the same desk: the sum, over every succession shock the analyst has applied, of the full severity of each shock that no provision in force insulates, plus one quarter of the severity of each insulated shock. A provision insulates a shock when it is in force and lists that shock among those it guards against.",
        "The Rupture Index enters the decay constant only while the Succession Simulator is linked to the bus; under override, \\(R\\) is taken as zero and only the exposure drives decay. The code imposes no upper bound on \\(U\\): the registered shocks of the desk sum to well over 100 severity points, and analyst-defined shocks may add more. The only clamp is the floor at zero on the sum.",
        "The analyst's choice is the projection horizon: 30, 90, 180 or 365 days. The desk projects each of the four bonds to that horizon, draws a seven-point curve of the mean bond from day zero to the horizon, and reports the mean loss across the four bonds.",
        "The doctrine's horizon, written \\(\\tau\\) in the treatise, is not a separate formula in the code. It is expressed through two derived quantities: the half-life, which states how fast decay runs, and the fracture window, which states how long until the mean bond reaches the 2.0 level at which the standing reads Fractured.",
      ],
      formulas: [F_EXPOSURE, F_DECAY],
      statutoryRule:
        "Rule 4.2-B: A reading taken under override excludes measured rupture from the decay constant and must never be cited as the decay position of the mission.",
    },
    {
      heading: H.proofs,
      subheading: "First-Order Kinetics, the Half-Life and the Fracture Window",
      paragraphs: [
        "The decay law is the law of first-order kinetics, familiar from radioactive decay and pharmacokinetics. Its premise is that the rate of loss is proportional to what remains: \\(\\frac{db}{dt} = -\\lambda\\, b\\). A strong bond loses more points per day than a weak one under the same load, because it has more to lose, but both lose the same fraction. Separating variables and integrating from zero gives \\(b(t) = B_{i}(0)\\, e^{-\\lambda t}\\).",
        "Setting \\(b(t_{1/2}) = \\frac{1}{2} B_{i}(0)\\) gives \\(e^{-\\lambda t_{1/2}} = \\frac{1}{2}\\), hence \\(t_{1/2} = \\frac{\\ln 2}{\\lambda}\\). The half-life is independent of the starting score: every bond, strong or weak, halves in the same number of days.",
        "Worked example, at the desk defaults and linked: \\(U = 6.5\\) and \\(R = 40\\), so \\(\\lambda = \\frac{46.5}{2000} = 0.02325\\) per day and \\(t_{1/2} = \\frac{0.693147}{0.02325} = 29.8\\) days. At the 30-day horizon \\(e^{-30 \\lambda} = 0.4978\\): a vector of 4.0, 2.0, 2.0 and 3.0 projects to 1.99, 1.00, 1.00 and 1.49, the Communal and Intergenerational bonds held at the sovereign floor. The mean loss across the four bonds is 1.38.",
        "The critical fracture window solves the same law for the moment the mean bond reaches 2.0. It is zero when the mean is already at or below 2.0, and infinite when the decay constant is zero. Divided by 30.44 it reads in months: above 24 stable, above 12 monitored, above 6 acute, otherwise imminent.",
        "Sensitivity follows from the form of the constant. Because \\(U\\) and \\(R\\) enter as a sum, a reduction of ten points in either buys the same runway. Because the half-life is inversely proportional to the sum, halving the sum doubles the half-life. Rupture reduction and shock insulation are therefore interchangeable in their effect on time, and the operator chooses whichever is cheaper to deliver.",
        "The half-life scales inversely with the decay constant, so doubling the load halves the time. With no unmitigated exposure, a Rupture Index of 20 gives \\(\\lambda = 0.01\\) per day and a half-life of 69.3 days; a Rupture Index of 40 gives \\(\\lambda = 0.02\\) and 34.7 days; a Rupture Index of 60 gives \\(\\lambda = 0.03\\) and 23.1 days. The same settlement, read at three levels of rupture, has three very different clocks, and the operator who schedules renewals against the slowest of them will be late for the other two.",
        "The fracture window is more sensitive to the starting mean than intuition suggests, because it depends on the logarithm of the ratio to 2.0. At the canonical decay constant of 0.02325 per day, a mean bond of 3.0 reaches the fracture level in about 17 days and a mean of 3.5 in about 24 days: half a point of mean bond buys a week. A mean of 4.0 under a gentle decay constant of 0.002 per day reaches it in about 347 days, 11.4 months, which the desk classifies as acute rather than monitored, because the band boundary sits at twelve months.",
      ],
      formulas: [F_HALF_LIFE, F_PRESERVED, F_FRACTURE],
      statutoryRule:
        "Rule 4.2-C: When the projected mean bond falls below the 2.0 fracture level within the chosen horizon, a leadership transition risks acute covenant failure, and renewals must be scheduled before the window closes.",
    },
    {
      heading: H.protocols,
      subheading: "Reading the Horizon on Desk 12 and Carrying It Downstream",
      paragraphs: [
        "On the Succession Simulator the operator ticks the provisions actually in the draft, applies the succession shocks to be tested, chooses the horizon and links the desk to the bus. The desk publishes the decay constant to four places, the half-life in days, the projected mean loss at the horizon, the fracture window in months and its severity band.",
        "The same desk publishes the survival score that Stage Gate 5 and Escrow Tranche 4 read. The decay figures and the survival score are separate readings from the same inputs: a settlement can survive succession on paper and still carry a short half-life if its rupture reading is high.",
        "Downstream, the half-life appears in the Governing Relational Laws console under Relational Entropy and Decay Horizon, and the fracture window under the Critical Fracture Window law. Both are carried into every chancellery document through the upstream telemetry block.",
        "The operating protocol is to read the horizon twice: once with the shocks uninsulated, to see the exposure the draft must answer, and once with the insulating provisions in force, to see the runway the draft buys. The difference between the two half-lives is the value of the provisions in days.",
      ],
      statutoryRule:
        "Rule 4.2-D: Decay figures are cited with the horizon and the link state under which they were read. A half-life without its inputs is not a reading.",
    },
    {
      heading: H.failure,
      subheading: "Linear Thinking, Floor Blindness and the Limiting Bond",
      paragraphs: [
        "Failure mode one: linear extrapolation. A principal assumes that a crisis that has simmered for ten years leaves ten more years to act. Under first-order decay the remaining runway depends on today's exposure and rupture, not on history. The countermeasure is to quote the half-life, not the age of the dispute.",
        "Failure mode two: floor blindness. Because projected bonds stop at 1.0, a bond already near the floor appears stable on the projection. It is not stable; it has nowhere left to fall. The countermeasure is to read the floor flag on each projected bond and treat a bond held at the floor as a bond already lost.",
        "Failure mode three: insulating the wrong shock. Provisions that guard against low-severity shocks reduce exposure little. The countermeasure is to insulate the heaviest uninsulated shock first, because each insulated shock contributes a quarter of its severity rather than all of it.",
        "Failure mode four: ignoring rupture in the constant. Where the rupture reading dominates the sum, insulation alone cannot restore the runway. The countermeasure is to work the Sentinel register down, starting with the tripwires on the limiting bond.",
        "The Liebig bottleneck governs the projection as it governs the present. All four bonds decay by the same fraction, so the bond that reaches the floor or drives the mean below 2.0 first is the one that started lowest. Repairing the limiting bond before the horizon is the only intervention that moves the fracture window without changing the constant.",
        "Failure mode, the reassuring floor. Because no bond is projected below 1.0, a projection can show several bonds resting at the floor and the mean loss can look modest. The floor is a limit of the scale, not a sign of stability: a bond held at 1.0 in a projection is a bond that the law would have taken lower if the scale allowed it. The countermeasure is to read the unfloored product beside the published figure whenever a bond touches the floor, and to treat every floored bond as a renewal that is already overdue.",
      ],
      statutoryRule:
        "Rule 4.2-E: The limiting bond reaches the floor first. Renewal effort is directed at it before any other bond is strengthened.",
    },
    {
      heading: H.instrument,
      subheading: "Half-Life Under Accumulating Shock",
      paragraphs: [
        "The cutaway applies three demonstration shocks in order. Raise the unmitigated exposure and the observed share and watch the half-life shorten step by step as the decay constant grows; watch the fracture window move from stable toward imminent. Lower them again and the runway returns exactly, because the law has no memory beyond its inputs.",
      ],
      instrument: "timeline",
    },
  ],
  quiz: [
    {
      id: "q4-2-1",
      question: "With \\(U = 6.5\\) and \\(R = 40\\), linked to the bus, what are the decay constant and the stability half-life?",
      options: [
        { id: "opt-a", text: "\\(\\lambda = 0.02325\\) per day and \\(t_{1/2} = 29.8\\) days", explanation: "Correct. \\(\\lambda = \\frac{6.5 + 40}{2000} = 0.02325\\), and \\(\\frac{\\ln 2}{0.02325} = 29.8\\) days.", correct: true },
        { id: "opt-b", text: "\\(\\lambda = 0.0465\\) per day and \\(t_{1/2} = 14.9\\) days", explanation: "Incorrect. The divisor is 2000, not 1000.", correct: false },
        { id: "opt-c", text: "\\(\\lambda = 0.00325\\) per day and \\(t_{1/2} = 213\\) days", explanation: "Incorrect. The rupture index enters the sum while the desk is linked.", correct: false },
        { id: "opt-d", text: "\\(\\lambda = 0\\) and an infinite half-life", explanation: "Incorrect. Decay is zero only when the exposure and the rupture reading are both zero.", correct: false },
      ],
    },
    {
      id: "q4-2-2",
      question: "A bond of 2.0 is projected 30 days ahead with \\(e^{-30 \\lambda} = 0.4978\\). What does the desk publish?",
      options: [
        { id: "opt-a", text: "0.99", explanation: "Incorrect. The unfloored product is 0.9957, but no bond is projected below the 1.0 sovereign floor.", correct: false },
        { id: "opt-b", text: "1.00, held at the sovereign floor", explanation: "Correct. \\(B(30) = \\max(1.0,\\, 2.0 \\times 0.4978) = 1.00\\).", correct: true },
        { id: "opt-c", text: "2.00, because weak bonds do not decay", explanation: "Incorrect. Every bond decays by the same fraction; only the floor stops it.", correct: false },
        { id: "opt-d", text: "0, a total rupture", explanation: "Incorrect. The bond scale begins at 1.0; zero is not a bond score.", correct: false },
      ],
    },
    {
      id: "q4-2-3",
      question: "The mean bond is 1.9 and the decay constant is positive. What is the critical fracture window?",
      options: [
        { id: "opt-a", text: "Infinite, because the bonds are already low.", explanation: "Incorrect. The window is infinite only when the decay constant is zero.", correct: false },
        { id: "opt-b", text: "Zero days, imminent: the mean is already at or below the 2.0 fracture level.", explanation: "Correct. When the mean is at or below 2.0 the window is zero and the band is imminent.", correct: true },
        { id: "opt-c", text: "Exactly one half-life.", explanation: "Incorrect. The fracture window solves for the 2.0 level, not for half the starting strength.", correct: false },
        { id: "opt-d", text: "24 months, stable.", explanation: "Incorrect. A mean below the fracture level can never read stable.", correct: false },
      ],
    },
    {
      id: "q4-2-4",
      question: "Halving the sum of exposure and rupture has what effect on the stability half-life?",
      options: [
        { id: "opt-a", text: "It halves the half-life.", explanation: "Incorrect. The half-life is inversely proportional to the decay constant.", correct: false },
        { id: "opt-b", text: "It doubles the half-life.", explanation: "Correct. \\(t_{1/2} = \\frac{\\ln 2}{\\lambda}\\), and the constant is proportional to the sum, so halving the sum doubles the half-life.", correct: true },
        { id: "opt-c", text: "None; the half-life depends only on the starting score.", explanation: "Incorrect. The half-life is independent of the starting score but depends entirely on the constant.", correct: false },
        { id: "opt-d", text: "It sets the half-life to infinity.", explanation: "Incorrect. Only a sum of zero gives an infinite half-life.", correct: false },
      ],
    },
  ],
};

export const CHAPTER_4_3: DetailedAcademyChapter = {
  id: "asymmetry-distance",
  number: "4.3",
  eyebrow: "Module IV · Chapter 4.3",
  title: "Normalized Asymmetry Distance (Δasym)",
  estimatedMinutes: 35,
  executiveLede:
    "Disputes often fail because parties are assumed to stand at equal distance from a settlement when profound asymmetry separates them. The platform measures that distance in one space only, the four-bond space: between a live theatre and the eight documented cases on Desk 01, and between the tolerance vectors of seated parties on the De-confliction Bench (Desk 07). Both are Euclidean distances normalised by 8, the largest distance two four-bond vectors on the 1 to 5 scale can reach. The doctrine's \\(\\Delta_{asym}\\) is that normalised distance.",
  synopsis: [
    "On Desk 01 the distance \\(d(B,\\, C_{k})\\) from the live vector to each canonical case is converted into a resonance, \\((1 - \\frac{d}{8}) \\times 100\\), and the three nearest cases are ranked, ties going to the earlier case. A nearest case is a mirror, not a template.",
    "On Desk 07 each party carries a tolerance vector, and the friction coefficient of a pair is the distance between their vectors divided by 8, rounded to two decimals. The largest pairwise coefficient is published as the party friction reading, and the veto holder is the party whose tolerance on the limiting bond most exceeds the live limiting score. The engine attaches no breach threshold to the coefficient; it tells the operator where third-party guarantees or neutral holdbacks are needed.",
    "The axes are the four bonds, not military, economic or informational power. The lecture reads the Indus Waters Treaty of 1960 as an instrument that answered a stark geographic asymmetry with a neutral guarantor and a graded dispute ladder.",
  ],
  statutoryNotice:
    "Canonical Rule: distances in the four-bond space are normalised by \\(8 = \\sqrt{4 \\times 16}\\). Asymmetry proofs use the normalised Euclidean distance of actual inputs and never invented party coordinates.",
  learningOutcomes: [
    "Explain, from the Indus precedent, how architecture answers an asymmetry the parties cannot close themselves.",
    "Compute the Euclidean distance and resonance between a live vector and a documented case.",
    "Prove that the maximum distance in the four-bond space is 8 and explain why normalisation makes readings comparable.",
    "Compute the friction coefficient between two seated parties from their tolerance vectors and name the veto holder.",
    "Design neutral guarantees and graded dispute routes that do not depend on the stronger party's goodwill.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Indus Waters Treaty: Geography as Asymmetry (1960)",
      paragraphs: [
        "Asymmetry cannot be negotiated away; it can only be answered by structure. The instruments that survive great asymmetry place a neutral party inside the treaty, divide the contested resource by rule rather than by discretion, and give the weaker party a graded path to an independent decision that the stronger party cannot block.",
        "The Indus Waters Treaty is the clearest modern example. The asymmetry it answered was written into the river itself: whoever holds the headworks holds the flow. Its negotiators could not change the geography. They could only change what the geography was allowed to decide.",
      ],
      caseStudy: {
        title: "The Indus Waters Treaty: Geography as Asymmetry (1960)",
        jurisdiction: "India and Pakistan, with the World Bank / Indus Basin",
        precedent: "Indus Waters Treaty, signed at Karachi on 19 September 1960",
        analysis: [
          "Partition in 1947 left the headworks of the Indus system largely in India while the irrigated plains that depended on them lay in Pakistan: an upstream and downstream asymmetry written into the river itself. After nearly a decade of negotiation under the good offices of the World Bank, the treaty allocated the waters of the eastern rivers (the Ravi, the Beas and the Sutlej) to India and those of the western rivers (the Indus, the Jhelum and the Chenab) to Pakistan, subject to defined uses.",
          "The treaty answered the asymmetry with architecture rather than trust. It created a Permanent Indus Commission with a commissioner from each side, and a graded ladder for disagreement: questions go to the Commission, technical differences to a Neutral Expert, and disputes to a Court of Arbitration. The World Bank was itself a signatory for specified purposes. A Neutral Expert decided the Baglihar difference in 2007, and a Court of Arbitration rendered its award in the Kishenganga proceedings in 2013.",
          "The architecture held for more than six decades through wars and crises. Its limit is the limit of every instrument that rests on continued participation: in April 2025 India announced that it would hold the treaty in abeyance, and the ladder can only function while both parties remain on it.",
        ],
        failureMechanism:
          "A graded neutral mechanism contained a structural asymmetry for generations, but it could not compel the stronger party to remain within the instrument when political rupture rose.",
      },
      statutoryRule:
        "Rule 4.3-A: Where the asymmetry is geographic or structural, the instrument must allocate by rule and route disagreement to a neutral decision-maker in graded steps; goodwill is never a load-bearing member.",
    },
    {
      heading: H.architecture,
      subheading: "Two Distances in One Space",
      paragraphs: [
        "The platform measures asymmetry in the four-bond space because that is the space in which every other reading lives. A distance computed on axes the desks do not score could not be reconciled with the rupture index, the escrow conditions or the Dominum Index, and would be a parallel store by another name.",
        "The first distance is diagnostic. Each of the eight documented cases carries a recorded four-bond profile. Desk 01 measures the distance from the live vector to each profile, converts it to a resonance, and ranks the three nearest. The reading answers the question: which documented settlement shares the structural shape of this one?",
        "The second distance is relational. On the De-confliction Bench every seated party carries a tolerance vector: the minimum it will accept on each bond. By default a party tolerates 3.0, the viable floor, on every bond and holds out at 4.0 on the bond it carries itself. An inscribed party's tolerance is three plus a quarter of the difference between its leverage and its vulnerability on every bond, plus one on the limiting bond if it holds a veto, clamped to the 1 to 5 scale. The distance between two tolerance vectors, normalised and rounded, is the friction coefficient of the pair.",
        "Leverage and vulnerability are where the treatise's power axes enter the platform. A party with great military or economic weight is inscribed with high leverage; a party exposed to it with high vulnerability. Those two numbers move the party's tolerance on every bond, so the power differential is carried into the same four-bond space as everything else rather than measured on separate axes.",
        "The veto holder is the party whose tolerance on the limiting bond exceeds the live limiting score by the largest strictly positive gap. That party can block any settlement that does not first lift the limiting bond to its tolerance.",
      ],
      formulas: [F_FRICTION],
      statutoryRule:
        "Rule 4.3-B: Where one party's tolerance on the limiting bond far exceeds the live limiting score, that party is named veto holder, and the instrument must carry a neutral guarantee that does not depend on its goodwill.",
    },
    {
      heading: H.proofs,
      subheading: "The Maximum Distance, Resonance and the Coefficient",
      paragraphs: [
        "Each bond spans 1 to 5, so the widest possible gap on one bond is 4. The distance is the square root of the summed squared gaps, so the widest possible distance across four bonds is \\(\\sqrt{4 \\times 4^{2}} = \\sqrt{64} = 8\\), reached only when one vector reads 1.0 on every bond and the other 5.0. Dividing by 8 maps every distance onto the unit interval, so a coefficient of 0.25 means the same separation in any theatre.",
        "Resonance rescales the case distance so that an identical profile reads 100 and the most distant possible profile reads 0. A live vector of 3.8, 1.9, 3.2 and 3.0 stands 1.221 from the Kenya profile, a resonance of 84.7, and that case is ranked nearest.",
        "Two default parties whose tolerance vectors differ by 1.0 on two bonds stand \\(\\sqrt{2}\\) apart, and their coefficient is \\(\\round_{2}(\\frac{\\sqrt{2}}{8}) = 0.18\\). If they differ by 1.0 on all four bonds the distance is 2 and the coefficient 0.25; a single gap of 4 on one bond gives a distance of 4 and a coefficient of 0.50. The coefficient therefore rewards concentrated disagreement more than diffuse disagreement of the same total size, because the squares weight the largest gap most.",
        "That property matters for design. A pair whose friction comes from one axis can be de-conflicted by one targeted guarantee on that axis; a pair whose friction is spread across all four needs a broader architecture. The per-axis gaps tell the operator which case applies.",
        "Three reference distances anchor the reading of the friction coefficient. Two parties whose tolerance vectors differ by one point on two bonds stand \\(\\sqrt{2}\\) apart, a coefficient of 0.18. Two parties four points apart on a single bond, one demanding 5 and the other accepting 1, stand 4 apart, a coefficient of 0.50. Two parties four points apart on every bond stand 8 apart, the maximum, a coefficient of 1.00. A coefficient of one half can therefore describe a single, absolute disagreement or a broad, moderate one, and the operator reads the bond-by-bond gaps before choosing a remedy.",
        "The normalisation by 8 is what makes a coefficient read on one theatre comparable with a coefficient read on another, and it is also why the coefficient never needs a breach threshold of its own. A coefficient is a position on a fixed scale between parity and the widest possible separation; the remedy it calls for depends on which bond carries the gap, which is a question the coefficient alone cannot answer.",
      ],
      formulas: [F_CASE_DISTANCE, F_RESONANCE, F_FRICTION],
      statutoryRule:
        "Rule 4.3-C: A nearest case is a mirror, not a template. Historical resemblance is context, never a predicted outcome or a prescription.",
    },
    {
      heading: H.protocols,
      subheading: "Seating, Friction Pairs and the Spoiler Warning",
      paragraphs: [
        "On Desk 07 the operator seats delegations from the available roster or inscribes parties of their own. The bench reads the coefficient of every pair, publishes the largest as the party friction reading and names the veto holder.",
        "Separately, the bench carries named friction rules: pairs of actors recorded as conflicting at the table. Each active pair enters the contagion coefficient through the factor \\(1 + 0.10\\, n_{f}\\), and when two or more pairs are active while the rupture index is 35 or more, or the Elite-Pact alert holds, the bench raises a spoiler-coalition warning.",
        "The coefficient feeds no gate and no lock. Its operational use is sequencing: the pair with the largest coefficient is seated in separate opening sessions, with a mediator, and the axis with the widest gap is the first on which a neutral guarantee or a holdback is drafted.",
        "On Desk 01 the three nearest cases flow into the Comparative Mirror (Desk 04) and the Briefing Desk (Desk 05), where they supply comparative annexes. Resemblance enters the record as context with its distance stated.",
      ],
    },
    {
      heading: H.failure,
      subheading: "Formal Equality, Invented Coordinates and the Limiting Bond",
      paragraphs: [
        "Failure mode one: the fiction of formal equality. International law treats states as sovereign equals, and a negotiation conducted on that premise alone ignores the distance between the parties' tolerances. The countermeasure is to read the coefficient and design for it.",
        "Failure mode two: invented coordinates. An analyst scores parties on axes of military or informational power that no desk records, and produces a distance that cannot be reconciled with the bus. The countermeasure is the platform's rule: asymmetry is measured on actual inputs in the four-bond space, with power carried through leverage and vulnerability.",
        "Failure mode three: treating resemblance as forecast. A high resonance with a documented failure is read as a prediction of failure. The countermeasure is to use the case as a list of the mechanisms that broke it, and to check each against the present design.",
        "The Liebig bottleneck sets where asymmetry bites. A veto holder is defined on the limiting bond, because that is where the settlement is weakest and where a party with a high tolerance can block it. Lifting the limiting bond above the veto holder's tolerance dissolves the veto without any concession on the other three.",
        "Failure mode, the averaged gap. An analyst reports that two parties are close because the mean of their tolerance vectors is the same. Two vectors of 5, 1, 3 and 3 and of 1, 5, 3 and 3 have the same mean and stand about 5.66 apart, a coefficient of 0.71. Asymmetry lives in the components, not the average, and the countermeasure is the bond-by-bond gap table that the asymmetry instrument draws beside the coefficient.",
      ],
      statutoryRule:
        "Rule 4.3-D: Every asymmetry reading is computed from the tolerance vectors the parties actually stated. A coordinate supplied by the analyst to complete a proof is a breach of the record, not an estimate.",
    },
    {
      heading: H.instrument,
      subheading: "Two Parties in the Four-Bond Space",
      paragraphs: [
        "Set the tolerance vectors of two parties. The cutaway computes the coefficient with the De-confliction Bench's own function and shows the gap on each axis, marking the widest. Concentrate a difference on one bond and watch the coefficient rise faster than when the same total difference is spread across four.",
      ],
      instrument: "asymmetry",
    },
  ],
  quiz: [
    {
      id: "q4-3-1",
      question: "Why are distances in the four-bond state space normalised by 8?",
      options: [
        { id: "opt-a", text: "Because there are eight documented cases.", explanation: "Incorrect. The number of cases is a coincidence; the normalisation follows from the scale.", correct: false },
        { id: "opt-b", text: "Because 8 is the largest possible distance between two vectors whose four components each lie between 1 and 5.", explanation: "Correct. The widest gap per bond is 4, so the widest distance is \\(\\sqrt{4 \\times 16} = 8\\).", correct: true },
        { id: "opt-c", text: "Because the Dominum Index is out of 8.", explanation: "Incorrect. The Dominum Index runs from 0 to 100.", correct: false },
        { id: "opt-d", text: "Because the viable floor is 3.0 and the fracture level 5.0.", explanation: "Incorrect. The fracture level is 2.0, and neither constant sets the normalisation.", correct: false },
      ],
    },
    {
      id: "q4-3-2",
      question: "Two seated parties have default tolerance vectors that differ by 1.0 on two bonds. What is their friction coefficient?",
      options: [
        { id: "opt-a", text: "0.25", explanation: "Incorrect. That would be a distance of 2, divided by 8.", correct: false },
        { id: "opt-b", text: "0.18", explanation: "Correct. The distance is \\(\\sqrt{2} = 1.414\\), and \\(\\frac{1.414}{8} = 0.1768\\), which rounds to 0.18.", correct: true },
        { id: "opt-c", text: "2.00", explanation: "Incorrect. The coefficient is normalised to the range 0 to 1.", correct: false },
        { id: "opt-d", text: "0.50", explanation: "Incorrect. Recompute the Euclidean distance before normalising.", correct: false },
      ],
    },
    {
      id: "q4-3-3",
      question: "On which axes does the platform measure asymmetry between parties?",
      options: [
        { id: "opt-a", text: "Military, economic, institutional and informational power.", explanation: "Incorrect. No desk scores those axes; power enters through each inscribed party's leverage and vulnerability, which move its tolerance on the four bonds.", correct: false },
        { id: "opt-b", text: "The four bonds: Interpersonal, Communal, Intergenerational and Institutional-Relational.", explanation: "Correct. Every distance on the platform is computed in the four-bond space, so it can be reconciled with every other reading.", correct: true },
        { id: "opt-c", text: "Population and territory.", explanation: "Incorrect. Neither is a desk reading.", correct: false },
        { id: "opt-d", text: "Whatever axes the operator chooses for the mission.", explanation: "Incorrect. Invented coordinates are prohibited.", correct: false },
      ],
    },
    {
      id: "q4-3-4",
      question: "Which feature of the Indus Waters Treaty most directly answered the upstream and downstream asymmetry between the parties?",
      options: [
        { id: "opt-a", text: "A bilateral promise to consult in good faith, without a third party.", explanation: "Incorrect. Consultation alone would have left the stronger position unchecked.", correct: false },
        { id: "opt-b", text: "A rule-based allocation of rivers and a graded ladder from the Permanent Indus Commission to a Neutral Expert and a Court of Arbitration, with the World Bank as a signatory.", explanation: "Correct. Allocation by rule and a neutral, graded route to decision are the architecture of asymmetry management.", correct: true },
        { id: "opt-c", text: "Joint military patrols of the headworks.", explanation: "Incorrect. The treaty contains no such provision.", correct: false },
        { id: "opt-d", text: "An automatic expiry after ten years.", explanation: "Incorrect. The treaty has no fixed term.", correct: false },
      ],
    },
  ],
};
