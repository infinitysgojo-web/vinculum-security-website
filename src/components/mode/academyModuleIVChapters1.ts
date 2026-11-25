import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import {
  F_CASE_DISTANCE,
  F_FRICTION,
  F_INSCRIBED,
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
  title: "The Rupture Index (R): Load-to-Bond Derivation",
  eyebrow: "Module IV · Chapter 4.1",
  estimatedMinutes: 33,
  executiveLede: "Relational rupture rarely announces itself. It accumulates through signs that are individually unremarkable: a principal who now speaks only through intermediaries, a grievance mechanism that receives complaints and resolves none, a verifier quietly dependent on the party it verifies. The Sentinel Matrix (Desk 02, The Eye of Humanity) gathers these signs into a weighted register, adds the structural load inscribed on the bus, scales the sum by the observed trend, and reports the composite Rupture Index \\(R\\) as a whole number from 0 to 100.",
  synopsis: [
    "The Rupture Index measures how near a covenant stands to open breakdown. Its load is the weighted share of observed tripwires plus the inscribed structural load placed on the bus through the Sovereign Inscription tray; its direction is a verified trend multiplier: improving 0.85, static 1.00, deteriorating 1.15. The result is rounded half-up and capped at 100.",
    "The index is read in four bands: Stable below 15, Guarded from 15 to 34, Elevated from 35 to 59 and Critical at 60 and above. The bands carry consequences on other desks. At 35 an independent verifier must be seated and an office-continuity covenant drafted; at 40 the Legal Desk drafts a provisional-measures head; at 60 the Conditional Escrow Waterfall freezes every disbursement.",
    "The lecture opens with two settlements read from the open record, the Arusha Accords of 1993 and the Sierra Leone agreements from Abidjan to Lomé, each as a register of tripwires that filled in plain view. It then defines every term of the index as the code defines it, sets it beside the scholarship on composite indicators and on African early-warning systems, derives its arithmetic and its band thresholds, places it on the desks, and closes with the failure modes that make an analyst misread it."
  ],
  statutoryNotice: "Canonical Rule (Desk 02): \\(R = \\min(100,\\, \\round((\\frac{100\\, \\sigma}{W} + I) \\times \\tau))\\). The index is a rule applied to what the analyst recorded; it does not observe the theatre and it predicts nothing.",
  learningOutcomes: [
    "Read a historical settlement as a register of weighted tripwires rather than a narrative of sudden collapse.",
    "Derive the Rupture Index from the weighted tripwire register, the inscribed load and the trend multiplier.",
    "Prove the step granularity of the index and compute the minimum register score that enters each band under each trend.",
    "Trace the consequences of the Elevated (35), provisional-measures (40) and Critical (60) thresholds across the desks.",
    "Place the index within the literature on composite indicators and conflict early warning, and explain where the code departs from it.",
    "Diagnose the common misreadings of the index and apply their countermeasures."
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Arusha Accords and the Sierra Leone Agreements: Registers That Filled in Plain View",
      paragraphs: [
        "The doctrine of the Sentinel Matrix holds that the rupture of a settlement is visible in its tripwires before it is visible in its violence. That is a strong claim, and a lecture that asks the reader to build a desk around it owes the reader a test against the record. This section takes two settlements, read only from open United Nations documents and the signed texts, and asks of each the questions the desk asks: which signs were present, on which bond, with what gravity, and what, if anything, converted them into an obligation to act.",
        "The two cases are chosen because they differ in the way that matters. In Rwanda the register filled and nothing converted it into action before the settlement collapsed into genocide. In Sierra Leone the register filled twice, two agreements failed, and a third survived a near-collapse because the response to the warning was, at the last, large enough and fast enough. Read together they separate the two halves of the index: the share of the register present, which measures load, and the trend, which measures direction."
      ],
      caseStudy: {
        title: "The Arusha Accords and the Unread Register (1993 to 1994)",
        jurisdiction: "Government of Rwanda and the Rwandese Patriotic Front / Great Lakes",
        precedent: "Arusha Peace Agreement, signed 4 August 1993; UNAMIR established by Security Council Resolution 872 (5 October 1993); Report of the Independent Inquiry, S/1999/1257 (15 December 1999)",
        analysis: [
          "Fighting between the Rwandan Government forces and the Rwandese Patriotic Front began in October 1990. A ceasefire negotiated at Arusha on 22 July 1992 placed a fifty-member Neutral Military Observer Group of the Organization of African Unity in the country; hostilities resumed in February 1993, and the talks, supported by the OAU and facilitated by Tanzania, reconvened in March and closed with the Peace Agreement signed at Arusha on 4 August 1993.",
          "The Agreement gathered the earlier protocols into one instrument: the rule of law, power-sharing in a Broad-Based Transitional Government and a transitional National Assembly, the repatriation of refugees, and the integration of the two armed forces. The parties attached importance to 10 September 1993 as the date for establishing the transitional institutions. On 5 October 1993 the Security Council, by Resolution 872, established the United Nations Assistance Mission for Rwanda to help implement it.",
          "The institutions were not installed on that date or on any later one. The President was sworn in on 5 January 1994, but disagreement blocked the formation of the transitional government and assembly. On 11 January 1994 the force commander cabled headquarters that an informant inside the Interahamwe militia described plans to provoke the killing of Belgian peacekeepers and the location of an arms cache; headquarters instructed the mission to take no action until clear guidance was received.",
          "On 6 April 1994 the aircraft carrying the Presidents of Rwanda and Burundi was shot down on its approach to Kigali, and the killing of Tutsi and of moderate Hutu began within hours. On 21 April the Council, by Resolution 912, reduced the mission from its authorised 2,548 to 270. By October 1994 United Nations estimates put the dead at no fewer than half a million."
        ],
        failureMechanism: "An accord with no weighted early-warning register and no automatic consequence for slipping milestones allowed signs on the Institutional-Relational, Communal and Interpersonal bonds to accumulate for months without any of them converting into an obligation to act."
      },
      subsections: [
        {
          title: "The Arusha register, bond by bond",
          paragraphs: [
            "Read through the Sentinel Matrix, the eight months between the signature and the collapse show a register filling on three bonds at once. The Institutional-Relational bond carried the slipping calendar: a target date for the transitional institutions that passed, then a swearing-in that installed one office while the government and the assembly that were meant to share power with it remained blocked. Each postponement had a plausible procedural explanation. None carried a consequence written into the instrument.",
            "The Communal bond carried the mobilisation. The informant's account, as the Independent Inquiry later summarised it, concerned a militia being trained and armed and demonstrations organised to provoke violence. In the desk's vocabulary that is a tripwire of the gravest weight on the Communal bond: organised mobilisation against a group, not a grievance lodged through a channel. The Interpersonal bond carried the closure of the channel between principals, which no longer moved the process.",
            "The Inquiry's findings are the part of the record most instructive for this desk, because they concern what happened to a sign once it was observed. It found that serious mistakes were made in dealing with the 11 January cable, that the Secretary-General and the Security Council should have been informed rather than only three embassies in Kigali, and that more should have been done to follow up the information. It also recorded that the reconnaissance mission had estimated a force of 4,500 while the Secretariat recommended 2,548 in the expectation that the Council would not support more. Its overall conclusion was that the overriding failure lay in a lack of resources and political will and in errors of judgement as to the nature of the events.",
            "None of this describes a settlement that failed for want of information. It describes a settlement whose information was held in separate hands, read one item at a time, and never aggregated into a reading that carried its own consequence. That is the specific defect the Rupture Index is built to remove: a sign is either recorded, with its bond and its weight, or it is not, and once recorded it moves a number that other desks are bound to read."
          ]
        },
        {
          title: "Sierra Leone from Abidjan to Lomé (1996 to 2000)",
          paragraphs: [
            "The war in Sierra Leone began in March 1991, when the Revolutionary United Front attacked from the east near the Liberian border. After elections in February 1996, in which the RUF did not take part, a United Nations Special Envoy helped negotiate a peace agreement between the Government and the RUF, the Abidjan Accord of November 1996. In May 1997 it was derailed by a military coup in which the army joined the RUF in a ruling junta and the elected President went into exile.",
            "A second instrument followed. On 23 October 1997 the ECOWAS Committee of Five and representatives of the junta signed a peace plan at Conakry providing for a ceasefire monitored by the ECOWAS force. The junta committed itself publicly, then criticised key provisions, and the plan was never implemented. In February 1998 the ECOWAS force expelled the junta from Freetown and the President returned in March; in January 1999 the rebel alliance overran most of the capital before being driven out again.",
            "The third instrument was the Lomé agreement of 7 July 1999, which ended hostilities and provided for a government of national unity. On 22 October 1999 the Security Council established the United Nations Mission in Sierra Leone with up to 6,000 military personnel, and in February 2000 raised the ceiling to 11,100. In May 2000 the mission nearly collapsed: the RUF seized hundreds of peacekeepers and renounced the ceasefire. The Council raised the ceiling again to 13,000 on 19 May 2000 and to 17,500 in March 2001; a British force deployed; sanctions were applied to the RUF's sponsors; and by early 2002 more than 75,000 fighters had been disarmed and the war was declared over."
          ]
        },
        {
          title: "What the two registers teach",
          paragraphs: [
            "The Sierra Leone sequence shows the second half of the index at work. Each signature was followed by a period in which an observer could have been tempted to read the trend as improving because an agreement existed. The record shows why the desk forbids that reading. The Conakry plan was signed and never implemented; the Lomé agreement was signed and, ten months later, a party renounced its ceasefire. A signature clears no tripwire. What cleared tripwires in Sierra Leone after May 2000 was observable and verifiable: fighters disarmed, a larger force deployed, sponsors sanctioned.",
            "The Arusha record shows the first half. The share of the register present was rising for months on three bonds, and the instrument had no rule that turned that share into a consequence. The Sentinel Matrix supplies both halves, and the separation is deliberate: the observed share is a count of evidence; the trend is a separate judgement about direction, which must itself be evidenced; and the bands attach consequences that no participant can talk away.",
            "Two cautions keep this reading honest. First, the index is a rule applied to what an analyst records; it would not have known anything that the people in Kigali or New York did not know, and the lesson of Arusha is about aggregation and consequence, not about foresight. Second, nothing here supports a claim that a number would have prevented a genocide. The Inquiry located the decisive failures in resources and political will. The narrower claim the chapter makes is that a weighted register with automatic consequences removes one specific failure, the failure to aggregate, from the list of things that can go wrong."
          ]
        }
      ],
      statutoryRule: "Rule 4.1-A: Every warning sign observed in a theatre is recorded with its bond and its weight. An unrecorded sign is not a reading, and a narrative impression is never a substitute for the register."
    },
    {
      heading: H.architecture,
      subheading: "Tripwires, Weights, Load and Trend: The Terms as the Code Defines Them",
      paragraphs: [
        "This section fixes vocabulary. Every term below is defined as the engine (engine.ts) and the Sentinel Matrix (SentinelMatrix.tsx) define it, and in the words the Codex uses where the Codex agrees with the code. Where the two differ, the code governs and the difference is logged in the reconciliation register of the pull request."
      ],
      formulas: [F_INSCRIBED],
      subsections: [
        {
          title: "The register",
          paragraphs: [
            "The standard register of the Sentinel Matrix comprises twenty-four tripwires, six for each bond. Each carries a weight of 1, 2 or 3 according to its doctrinal gravity, and the weights total 56: thirteen on the Interpersonal bond, fifteen on the Communal, fourteen on the Intergenerational and fourteen on the Institutional-Relational. Nine tripwires carry weight 3, fourteen carry weight 2, and one carries weight 1: that meeting records are kept by one party alone and not exchanged.",
            "The analyst may add custom indicators for a theatre the standard register does not cover, each assigned to a bond and given a weight. A custom indicator enters both the observed score when it is marked and the register total whether or not it is marked, so adding indicators never inflates the index by itself: it widens the denominator before it can raise the numerator. An analyst who adds four custom indicators of weight 2 raises the register total from 56 to 64, and each point of observed weight is then worth \\(\\frac{100}{64}\\) of the index rather than \\(\\frac{100}{56}\\).",
            "The weights are doctrinal judgements of gravity, not frequencies. A tripwire of weight 3 marks a sign that on its own already describes a bond under structural attack: a principal channel closed, a verifier captured, a communal mobilisation against a group. A tripwire of weight 1 marks a sign that matters only in company. The register therefore rewards an analyst who records many small signs honestly and punishes one who records only the dramatic, because the share of weight present is what the index reports."
          ],
          callout: {
            kind: "definition",
            title: "Observed share, inscribed load and trend",
            paragraphs: [
              "Observed share: \\(\\frac{100\\, \\sigma}{W}\\), the weight of the tripwires marked present over the weight of the whole register, standard and custom, as a percentage. The desk publishes it as ruptureBase, to four decimals.",
              "Inscribed load \\(I\\): five points per point of negative bond delta carried by the custom shocks inscribed on the bus, plus six points per active inscribed trap, rounded and capped at INSCRIBED_LOAD_CAP, which is 30 (inscribedRuptureLoad). Positive deltas are ignored.",
              "Trend \\(\\tau\\): one of the three values of TREND_MULT, improving 0.85, static 1.00 or deteriorating 1.15, selected by the analyst on evidence of signs cleared or added in the period."
            ]
          }
        },
        {
          title: "Strain, traps and what they do not do",
          paragraphs: [
            "From the same register the desk computes a strain percentage for each bond: the weight present on that bond over that bond's own total, standard and custom, as a whole-number percentage. The four figures are published as bondStrain. Because each bond is divided by its own instrumentation, a strain of 50 means the same thing on every bond: half of the observable warning weight on that bond is present.",
            "The strains drive five latent traps. The Elite-Pact Mirage engages when Communal and Intergenerational strain are each at least 50 and Interpersonal strain is below 50; the Generational Cliff when Intergenerational strain is at least 60; Unanchored Repair when Institutional strain is at least 60 and Communal strain is below 50; Bond Theater when either of two named tripwires is marked, that youth input has not altered a single documented decision or that the verifying body is not independent of the party it verifies; and Systemic Bond Collapse when all four strains are at least 50.",
            "The traps are diagnostic readings for the drafting and governance divisions. They do not add to the index. Only custom traps placed on the bus through the Sovereign Inscription tray, and marked active, enter the inscribed load. The distinction matters operationally, and Section V returns to it as a failure mode."
          ]
        },
        {
          title: "Codex grounding: the boundary between entered and computed",
          paragraphs: [
            "The Codex draws one boundary on which the whole apparatus rests. On one side stand the inputs: the bond scores, the tripwires recorded and the trend classification, the shocks applied, the parties seated, the covenants drafted. These are qualitative assessments made by qualified officers. On the other side stands everything else, including the rupture index, its band and every consequence downstream. These are computed, and only computed.",
            "The Rupture Index sits exactly on that boundary, which is why its definition is so spare. The analyst's judgement enters at two points only: whether each sign is present, and which of three trends the evidence supports. Everything after that, the share, the load, the multiplication, the rounding, the band and the obligations, is arithmetic that no participant can negotiate. That is the property the Arusha register lacked."
          ]
        },
        {
          title: "The outside theory: composite indicators",
          paragraphs: [
            "The Rupture Index belongs to a family that statisticians call composite indicators: single numbers built by normalising, weighting and aggregating several individual indicators. The standard reference is the Handbook on Constructing Composite Indicators, published by the OECD with the European Commission's Joint Research Centre in 2008. It treats weighting and aggregation as the heart of the exercise and insists that they follow from a stated theoretical framework, with correlation between indicators and compensability, the extent to which strength on one indicator offsets weakness on another, either corrected for or deliberately kept.",
            "The Joint Research Centre's guidance makes the compensability point concrete. In a linear sum the weights act as trade-off rates, not as measures of importance: a poor value on one indicator can be bought back by high values elsewhere. Its own illustration takes two hypothetical countries scoring (21, 1, 1, 1) and (6, 6, 6, 6) on four indicators; both average 6 under additive aggregation, while a geometric mean separates them sharply. Where an analyst holds that a loss on one dimension cannot be compensated by gains on another, the guidance points to non-compensatory methods."
          ],
          callout: {
            kind: "bridge",
            title: "How the code expresses composite-indicator theory, and where it departs",
            paragraphs: [
              "The Rupture Index is a linear, weighted, normalised sum: the observed share is \\(\\frac{100\\, \\sigma}{W}\\), a weighted proportion with each tripwire's weight fixed in the register, and ruptureIndex adds the inscribed load and scales by the trend. In the Handbook's terms the normalisation is by the maximum attainable, the weighting is expert-assigned, and the aggregation is additive.",
              "The departure is deliberate and lies in what is being added. The index sums warning signs, not achievements, so compensation in the dangerous direction cannot occur: no tripwire can be offset by the absence of another. The non-compensatory logic the literature recommends for the bonds themselves is carried elsewhere in the system, by the Liebig minimum and the viable floor (VIABLE_FLOOR, 3.0) on the bond vector, and by the bands, which act on thresholds rather than on averages."
            ]
          }
        },
        {
          title: "The outside practice: African early-warning systems",
          paragraphs: [
            "Early warning has an institutional form in Africa that the desk deliberately resembles. Article 12 of the 2002 Protocol establishing the Peace and Security Council of the African Union creates a Continental Early Warning System: an observation and monitoring centre, the Situation Room, responsible for data collection and analysis on the basis of an early warning indicators module, linked to the monitoring units of the regional mechanisms. The Chairperson of the Commission is to use the information to advise the Council on potential threats and recommend the best course of action.",
            "One of those regional mechanisms, IGAD's Conflict Early Warning and Response Mechanism (CEWARN), was established in 2002 under a protocol of the IGAD member states. Its mandate is to receive and share information on potentially violent conflicts, analyse it, develop scenarios and formulate options for response. Its field monitors filed incident reports as violent events occurred and weekly situation reports against a fixed set of questions whether or not anything had happened, so that the absence of incidents was itself recorded.",
            "The bridge to the desk is direct. The standard register is an indicators module in the AU's sense, fixed in advance so that observers record the same things; the weekly situation report's discipline of answering every question every period is the discipline the register imposes on each tripwire; and the trend field corresponds to the comparison of one period's report with the last. Where the desk departs from both systems is in the response half: CEWARN formulates options, and the Situation Room advises, whereas the Sentinel Matrix binds. A band is not advice to the Legal Desk or the escrow; it is an input they cannot decline to read."
          ]
        }
      ],
      statutoryRule: "Rule 4.1-B: Only inscribed custom shocks and active inscribed traps contribute to the inscribed load. An analyst who expects a standard trap on the matrix to raise the index will be mistaken."
    },
    {
      heading: H.proofs,
      subheading: "The Formal Definition, Its Granularity and the Band Thresholds",
      paragraphs: [
        "Let \\(\\sigma\\) be the weight of the tripwires marked present, \\(W\\) the weight of the whole register, \\(I\\) the inscribed load and \\(\\tau\\) the trend multiplier. The base term \\(\\frac{100\\, \\sigma}{W}\\) is the weighted proportion of the register present; the engine function ruptureIndex adds the inscribed load, multiplies by the trend, rounds to a whole number and caps the result at 100. The band is then read by ruptureBand against RUPTURE_BANDS: guarded 15, elevated 35, critical 60."
      ],
      formulas: [F_RUPTURE, F_INSCRIBED],
      subsections: [
        {
          title: "Monotonicity and bounds",
          paragraphs: [
            "Three properties follow from the form and are worth stating because the desks downstream depend on them. The index is monotone non-decreasing in \\(\\sigma\\), in \\(I\\) and in \\(\\tau\\): marking a further tripwire, inscribing a further shock or worsening the trend can never lower it. It is bounded below by 0, because the engine reads any negative or non-finite share or load as zero, and above by 100, because of the cap. And it is not continuous: rounding to whole numbers makes it a step function of its inputs.",
            "Monotonicity is what allows the bands to carry obligations. If a further warning sign could lower the index, an analyst could reduce an obligation by recording more evidence, and the register would reward concealment of the wrong kind. Because it cannot, the only way down is the way the doctrine intends: unmark tripwires that are verifiably no longer present, clear inscribed shocks that no longer bear on the bond, or evidence an improving trend.",
            "The bounds have a practical edge. With the full standard register marked, the observed share is 100. Under a static trend with no inscribed load the index reads 100; under an improving trend it reads \\(\\round(100 \\times 0.85) = 85\\), the highest an improving trend can reach without inscribed load. With the maximum inscribed load of 30 added, even the improving trend gives \\(\\round(130 \\times 0.85) = 111\\), which the cap returns to 100."
          ]
        },
        {
          title: "Granularity: why the index cannot read 35 or 60 on a static register",
          paragraphs: [
            "With the standard register alone each point of weight is worth \\(\\frac{100}{56} \\approx 1.786\\) points of the index, so the index moves in steps of roughly 1.8, 3.6 or 5.4 as tripwires of weight 1, 2 or 3 are marked. Under a static trend the index therefore skips values. A weight of 19 gives \\(\\frac{1900}{56} = 33.93\\), which rounds to 34; a weight of 20 gives 35.71, which rounds to 36. A weight of 33 gives 58.93, which rounds to 59; a weight of 34 gives 60.71, which rounds to 61. The Elevated band is entered at a weight of 20 and the Critical band at 34, and the readings 35 and 60 cannot occur.",
            "The general result is simple to state. For a band threshold \\(T\\), a register of total \\(W\\), no inscribed load and trend \\(\\tau\\), the band is entered at the smallest whole weight \\(\\sigma\\) for which \\(\\round(\\frac{100\\, \\sigma}{W} \\times \\tau) \\ge T\\). Because the engine rounds halves upward, this is the smallest \\(\\sigma\\) with \\(\\frac{100\\, \\sigma\\, \\tau}{W} \\ge T - 0.5\\), that is \\(\\sigma \\ge \\frac{(T - 0.5)\\, W}{100\\, \\tau}\\), taken to the next whole number.",
            "Applied to the standard register of 56 the formula gives the full table. Under a static trend: Guarded at a weight of 9 (16), Elevated at 20 (36), Critical at 34 (61). Under a deteriorating trend: Guarded at 8 (16), Elevated at 17 (35), Critical at 29 (60). Under an improving trend: Guarded at 10 (15), Elevated at 23 (35), Critical at 40 (61). The Codex states the deteriorating and improving thresholds in the same terms, and the Academy tests recompute every entry from ruptureIndex."
          ],
          callout: {
            kind: "definition",
            title: "Threshold weight",
            paragraphs: [
              "The threshold weight of a band is the smallest observed register weight that places the index in that band, for a given register total, inscribed load and trend. It is the number an analyst should report alongside the band: a register at weight 19 on a static trend is one weight-1 tripwire from the Elevated band."
            ]
          }
        },
        {
          title: "The inscribed load: magnitude, traps and the cap",
          paragraphs: [
            "The inscribed load is computed by inscribedRuptureLoad from the custom shocks and the count of active inscribed traps. Let \\(\\delta\\) be the total magnitude of the negative deltas across the inscribed shocks and \\(n_{T}\\) the number of active inscribed traps; then \\(I = \\min(30,\\, \\round(5\\, \\delta + 6\\, n_{T}))\\). One inscribed shock with deltas of \\(-0.5\\) on the Interpersonal bond and \\(-1.0\\) on the Communal bond, together with one active trap, gives \\(\\delta = 1.5\\) and \\(I = \\round(7.5 + 6) = 14\\).",
            "The cap binds quickly. Five active traps alone give \\(\\round(30) = 30\\); four give 24. A shock vector removing two points from each of three bonds has \\(\\delta = 6\\) and alone reaches the cap. Above the cap further inscriptions add nothing to the index, which is deliberate: the inscribed load is a structural supplement to the register, not a substitute for it, and the Codex is explicit that the observed signs carry the reading.",
            "The inscribed load is added before the trend is applied, so the trend scales it. An observed share of 40 with an inscribed load of 12 reads \\(\\round(52 \\times 1.15) = \\round(59.8) = 60\\) under a deteriorating trend and \\(\\round(52 \\times 0.85) = \\round(44.2) = 44\\) under an improving one: the same field, read in two directions, sits in two different bands."
          ]
        },
        {
          title: "Edge cases and guards",
          paragraphs: [
            "Two guards complete the definition, and both lean toward caution. A negative or non-finite observed share or inscribed load is read as zero by the engine's nonNegative guard, so missing data can never manufacture rupture. A non-finite trend multiplier is read as the static 1.00 by finiteOr. The desk itself offers only the three canonical values of TREND_MULT, so a finite multiplier outside them never reaches the engine from the interface; the engine applies a finite multiplier as given. The earlier lecture text said that any value outside the three canonical ones falls back to 1.00; that overstated the guard and is corrected here.",
            "Downstream readers apply their own guards to a missing index, and they lean in different directions for stated reasons. The succession durability formula (successionDurability) counts a missing rupture reading as zero, so it never invents a penalty. The Dominum Index (dominumIndex) refuses to compute until the rupture reading is published, and treats an unreadable value as full rupture, so that containment is never overstated. The analyst should know both: an absent Sentinel reading weakens nothing on the succession desk and blocks the synthesis entirely."
          ]
        },
        {
          title: "A full worked example with the engine's functions",
          paragraphs: [
            "Consider a theatre in which the analyst has marked tripwires of total weight 22 on the standard register, has inscribed one custom shock with deltas \\(-0.5\\) Interpersonal and \\(-1.0\\) Communal, has marked one inscribed trap active, and has evidence that signs were added this quarter. Step one: the observed share is \\(\\frac{100 \\times 22}{56} = 39.2857\\). Step two: inscribedRuptureLoad returns 14, as above. Step three: the trend is deteriorating, 1.15.",
            "Step four: ruptureIndex computes \\(\\round((39.2857 + 14) \\times 1.15) = \\round(61.2786) = 61\\). Step five: ruptureBand returns Critical. Step six, the consequences: the engine's alerts raise the critical alert with its directive to convene principals and the verifier within fourteen days; the escrow freezes; the Legal Desk drafts its provisional-measures head because 61 is at or above 40. Had the trend been static the index would read \\(\\round(53.2857) = 53\\), Elevated, and the escrow would release what its tranches justify.",
            "The example shows the index doing what it is for. A reading that an analyst might summarise as a moderately worrying register with one bad quarter is, under the rule, a Critical reading that freezes funds and summons the principals. The rule does not ask whether the analyst finds that proportionate. It asks only whether the twenty-two points of weight are present, whether the shock is real, and whether the evidence shows signs added."
          ]
        }
      ],
      statutoryRule: "Rule 4.1-C: The bands are Stable below 15, Guarded 15 to 34, Elevated 35 to 59 and Critical 60 and above. No other threshold applies to the index itself; the provisional-measures marker at 40 belongs to the Legal Desk."
    },
    {
      heading: H.protocols,
      subheading: "Where Each Threshold Bites Across the Desks",
      paragraphs: [
        "The Rupture Index is published to the bus with its band, the per-bond strain, the latent traps, the trend and the multiplier: the keys rupture, ruptureBand, bondStrain, traps, trend and trendMultiplier, with the pre-trend observed share as ruptureBase. Every downstream desk reads that one value; none recomputes it. This section follows the value from the desk that produces it to each desk that is bound by it."
      ],
      subsections: [
        {
          title: "Operating the Sentinel Matrix",
          paragraphs: [
            "The operator opens Desk 02 after the bond vector has been scored on Desk 01, because the matrix flags the tripwires that sit on the weakest live bond when the two are linked. The register is worked bond by bond, and each tripwire is marked present only on evidence that the operator could produce to the verifier: a document, an observation, a pattern recorded in the Decision Log. The trend is set last, and only after comparing the current register with the previous period's.",
            "The desk's own notes state the discipline for each trend. Deteriorating, signs added this quarter: rupture velocity is rising, and the review interval should be compressed. Static, no material change: hold the current interval. Improving, signs cleared this quarter: rupture velocity is falling, and the clearance must be verified independently before anything is relaxed. The notes encode a rule worth stating plainly: the trend is evidence about the register, never about the mood of the talks."
          ]
        },
        {
          title: "The bands and their obligations",
          paragraphs: [
            "Stable, below 15: the register is quiet. The operator maintains the review cadence and the record. Guarded, 15 to 34: signs are present but below the level that binds other desks. The prudent operator reports the threshold weight to the Elevated band alongside the reading, and begins to identify a verifier before one is required.",
            "Elevated, 35 to 59: two obligations attach. Stage Gate 2 (Rupture Containment) fails unless an independent verifier is seated in the Verification Ledger (Desk 16), and Stage Gate 4 (Structural Covenants) requires an office-continuity provision drafted in the Clause Architect (Desk 10). The engine's locks (engineLocks) name exactly those remedies, and its elevated alert directs the operator to open a protected channel on the weakest bond and schedule independent verification before further concessions.",
            "At 40, inside the Elevated band, the Legal Desk (Desk 13) adds a fourth pleading head for provisional measures, requesting interim protection of the relational record pending the merits; the threshold is the constant PROVISIONAL_THRESHOLD in instruments.ts. Below 40 the pleading records the head as not drafted and states the reading.",
            "Critical, 60 and above: the Conditional Escrow Waterfall on the De-confliction Bench (Desk 07) freezes and releases nothing, whatever tranches are met; the threshold is ESCROW_FREEZE. Statutory clearance 2.2 fails unless a verifier is seated. The critical alert directs the operator to convene principals and the verifier within fourteen days and to activate the continuity provisions."
          ]
        },
        {
          title: "Hand-offs: one reading, five instruments",
          paragraphs: [
            "Upstream of these obligations the index enters four other instruments as an input. On the Succession Simulator (Desk 12) it enters the decay constant of the Decay Horizon, \\(\\lambda = \\frac{U + R}{2000}\\) per day, computed by decayHorizon, so a higher index shortens the half-life of every bond; Chapter 4.2 develops this. It enters the succession durability formula as a penalty of 0.20 on its normalised value. It enters the contagion coefficient as a multiplier. And it enters the Dominum Index as containment, \\(C = 1 - \\frac{R}{100}\\), weighted 0.20; Chapter 4.4 develops this.",
            "The operator should therefore expect a change on Desk 02 to move five readings at once, and should read them together. A move from 33 to 41 on a static register, for example, crosses into the Elevated band, opens the provisional-measures head, shortens every half-life, lowers durability and lowers containment, all from one additional tripwire of weight 3 and one of weight 2 marked on one afternoon."
          ]
        },
        {
          title: "Comparison with monitoring practice",
          paragraphs: [
            "The protocol borrows its rhythm from field monitoring. CEWARN's weekly situation reports were filed whether or not an incident occurred, so that silence was recorded as data; the Sentinel register is to be worked in full at each review for the same reason. The AU Situation Room aggregates reports from the regional mechanisms into analysis for the Chairperson; the bus aggregates the register into a reading for every desk.",
            "The difference is the binding character of the output. In both African systems the step from warning to response passes through a political decision, which is proper for intergovernmental bodies and is also, as the Rwanda Inquiry's findings show, the point at which a warning can be held without being acted on. The desk cannot and does not replace that decision for the parties; what it does is bind the operator's own instruments, so that a mission cannot release escrow, clear a gate or omit a pleading head while its own register reads above the line."
          ]
        }
      ],
      statutoryRule: "Rule 4.1-D: The Critical band freezes the Conditional Escrow Waterfall absolutely. Seating a verifier may pass the rupture gate; it never lifts the freeze. Only a lower rupture reading does."
    },
    {
      heading: H.failure,
      subheading: "Misreadings of the Index, Three Case Files and the Weakest Bond",
      paragraphs: [
        "The index fails in two ways: in the field, when the register is incomplete or its consequences are not applied, and at the desk, when an operator reads a correct number wrongly. This section takes three case files from the open record for the first kind and five recurrent misreadings for the second, and closes with the reason the weakest bond governs both."
      ],
      subsections: [
        {
          title: "Case file one: the cable that stayed in the building (Kigali, January 1994)",
          paragraphs: [
            "Warning signs. A target date for transitional institutions passed in September 1993 without them; a swearing-in in January 1994 installed one office while the rest remained blocked; an informant inside a militia described its training and an arms cache; the force commander proposed to act and was told to wait for guidance. On the desk these are tripwires of the gravest weight on the Communal and Institutional-Relational bonds, marked within a few weeks of each other.",
            "What happened to them. The Independent Inquiry found that the cable's information was shared with three embassies in Kigali rather than with the Secretary-General and the Council, and that its follow-up was inadequate. The signs were observed and then held by separate hands, each of which could reasonably treat its own item as one ambiguous report among many.",
            "The countermeasure that would have worked is the one the desk enforces. Recorded on a single register, these tripwires move one number, and the number crosses a line that triggers obligations every desk must read: a verifier to be seated, continuity provisions drafted, the principals convened within a fixed period. The register does not decide what the Council does; it removes the possibility that no one aggregates the signs."
          ]
        },
        {
          title: "Case file two: the signature read as a trend (Conakry, 1997, and Lomé, 1999 to 2000)",
          paragraphs: [
            "Warning signs. In each case a signed instrument was followed by conduct that contradicted it: after Conakry, a junta that committed publicly and then criticised key provisions; after Lomé, a ten-month implementation period that ended with peacekeepers seized and the ceasefire renounced in May 2000. The first sign in each case was on the Interpersonal bond, a principal's commitment that did not survive contact with the text.",
            "The misreading. The temptation in each post-signature period is to read the trend as improving because an agreement exists and talks continue. On the desk that choice would hide up to fifteen per cent of the reading. A register of weight 34 on the standard register, Critical at 61 under a static trend, reads \\(\\round(60.71 \\times 0.85) = 52\\) under an improving one, Elevated: the escrow would unfreeze on the strength of a mood.",
            "The countermeasure is written into the desk's own note: improving means signs cleared this quarter, verified independently. After May 2000 the record shows exactly such clearance in Sierra Leone: tens of thousands of fighters disarmed, a larger force, sanctions on sponsors. Those are tripwires that can be unmarked with evidence. A signature is not."
          ]
        },
        {
          title: "Case file three: the instrument derailed by a single bond (Abidjan, 1996 to 1997)",
          paragraphs: [
            "Warning signs. The Abidjan Accord was concluded in November 1996 between a Government elected in February of that year and an armed movement that had not taken part in the election and did not recognise its result. Six months later the army overthrew the Government and joined the movement. The open record does not tell us which signs inside the army were visible beforehand, and the lecture does not invent them.",
            "What the record does show is the structure. The Accord bound two parties; the actor that derailed it, the army, was a third institution whose relationship to the settlement the Accord did not secure. In the desk's terms the Institutional-Relational bond, the relationship between the governed and the institutions that hold force, was the weakest, and it was the one that failed first.",
            "The countermeasure is the one Section IV describes for the Elevated band: an office-continuity provision and an independent verifier, with tripwires on the Institutional-Relational bond worked as carefully as those on the Interpersonal bond. A register that watches only the two signatories will read Stable until the day a third institution moves."
          ]
        },
        {
          title: "Five misreadings at the desk",
          paragraphs: [
            "The narrative override. A principal argues that the register overstates danger because the signs are routine. The countermeasure is the register itself: each sign is present or not, and its weight is fixed. A disagreement about presence is resolved by evidence recorded in the Decision Log, never by lowering a weight.",
            "Trend optimism. An improving trend is selected because talks resumed, not because tripwires cleared. As case file two shows, the multiplier can then hide a band. The countermeasure is to set improving only on independently verified clearance in the period.",
            "The trap illusion. The analyst sees the Generational Cliff appear on the matrix and expects the index to rise. It does not; only active inscribed traps add load. The countermeasure is to carry a detected standard trap into the drafting desks as a covenant requirement, not to wait for the index to react.",
            "The threshold step. Because the index moves in steps, a register reading 34 can enter the Elevated band with one tripwire of weight 1. An analyst who reports only the band reports something arithmetically true and operationally careless. The countermeasure is to report the threshold weight to the next band alongside the band, and to seat the verifier before it is mandatory.",
            "The improving-trend ceiling. A register of weight 40 under an improving trend reads \\(\\round(71.43 \\times 0.85) = 61\\), still Critical. An analyst who expects the improving trend to lift the freeze will be disappointed: while that much of the register remains marked, no trend can take the index below 60. Improvement is measured by unmarking tripwires that are verifiably gone."
          ]
        },
        {
          title: "The Liebig bottleneck: why the weakest bond governs",
          paragraphs: [
            "The average comfort is the misreading that underlies all the others. A mean bond of 3.7 on Desk 01 is cited as evidence that a high index must be wrong. But the register does not fill evenly: its tripwires accumulate on the bond under attack, and the strain readings show it. The index and the limiting bond tell the same story from two sides, and the mean tells neither.",
            "The principle comes from agronomy. The law of the minimum, stated in essence by Carl Sprengel in 1828 and carried to wide notice by Justus von Liebig's books of 1840 and 1855, holds that growth is limited by the scarcest necessary factor rather than by the total supplied; van der Ploeg, Böhm and Kirkham, reviewing the history in 1999, proposed calling it the Sprengel-Liebig law. The system applies the same logic through the viable floor of 3.0 and the limiting-bond reading of mathReading. Each case file above shows it: Arusha's Communal and Institutional-Relational bonds, Lomé's Interpersonal bond, Abidjan's Institutional-Relational bond. In none did strength on the other bonds hold the settlement once one had failed.",
            "The operational consequence is Rule 4.1-E. Repair on the limiting bond is the only intervention that lowers the index durably, because it is the only one that clears the tripwires concentrated there. Concessions on bonds that were already holding move the mean and leave the register where it was."
          ]
        }
      ],
      statutoryRule: "Rule 4.1-E: The weakest bond is where the register fills first. Repair on the limiting bond is the only intervention that lowers the index durably."
    },
    {
      heading: H.instrument,
      subheading: "Rupture Jumps Under Compound Shock",
      paragraphs: [
        "The cutaway below is the Rehearsal Drawer's own timeline (inscriptionTimeline) run over a demonstration state held only in this lecture. It starts from a viable vector of 3.8, 3.4, 3.3 and 3.6, an observed share you set, and an unmitigated exposure of 10, then applies three demonstration shocks in order: a border incident, a currency collapse and a leadership succession. At each step the inscribed load of the shocks applied so far is recomputed through inscribedRuptureLoad, the index through ruptureIndex, and the half-life through the Decay Horizon. Nothing reaches the mission."
      ],
      subsections: [
        {
          title: "Walkthrough: the demonstration baseline",
          paragraphs: [
            "Select the Demonstration baseline preset. The observed share is 25 and the trend static, so at step T0 the index reads 25, Guarded, with a half-life of 39.6 days. Step to T1: the border incident carries 1.4 points of negative delta, the inscribed load becomes \\(\\round(5 \\times 1.4) = 7\\), and the index reads 32. Step to T2: the currency collapse adds 1.5 points, the cumulative load is \\(\\round(14.5) = 15\\), and the index reads 40. The provisional-pleadings marker trips here, exactly at PROVISIONAL_THRESHOLD.",
            "Step to T3: the succession shock adds 2.0 points, the load is \\(\\round(24.5) = 25\\), and the index reads 50, Elevated. The half-life has fallen to 23.1 days and the mean bond to 2.3. Note what has not happened: the escrow marker has not tripped, because 50 is below 60. Note also that the inscribed load is still below its cap of 30, so a fourth shock of the same size would still register."
          ]
        },
        {
          title: "Counterfactual one: change only the trend",
          paragraphs: [
            "Select Deteriorating trend. The register and shocks are identical; only the multiplier changes to 1.15. T0 now reads 29 and T1 reads 37, so the Elevated band arrives one shock earlier. T2 reads 46 and T3 reads 57, three points short of the freeze. The half-life at T3 is 20.7 days, against 23.1 on the baseline, because the higher index enters the decay constant.",
            "Now select Improving trend. The same shocks give 21, 27, 34 and 43. The index stays Guarded through the second shock, and the provisional-pleadings marker trips only at the third. This is the trend-optimism failure mode made visible: the same events, read with a multiplier the evidence may not support, delay the Legal Desk's head by a full step."
          ]
        },
        {
          title: "Counterfactual two: change the size of the shocks",
          paragraphs: [
            "Select Severe compound shock: the deteriorating trend with every shock delta scaled to 1.5 times its size. T1 reads 40, so the provisional-pleadings marker trips after the first shock; T2 reads 54; and T3 reads 63, which trips the escrow-freeze marker. At that step the mean bond is 1.7, the half-life 19.0 days, and the fracture window has closed to zero days. Trace the Dominum consequence by hand: containment \\(C = 1 - \\frac{63}{100} = 0.37\\), and the frozen escrow removes the fiduciary contribution, so the synthesis falls with both.",
            "Return to the baseline and use the shock-size control to find the smallest scaling at which T3 reaches 60 on a static trend. Then switch to the deteriorating trend and find it again. The difference between the two answers is the margin the trend field controls, and it is the reason the desk demands evidence before the field is set."
          ]
        },
        {
          title: "Counterfactual three: exposure without rupture",
          paragraphs: [
            "Select Drill Beta exposure. The index readings are identical to the baseline, 25, 32, 40 and 50, because unmitigated exposure does not enter the Rupture Index. But the half-lives fall to 27.2, 23.9, 21.0 and 18.2 days, because exposure does enter the decay constant. The lesson closes the chapter's argument: the Rupture Index measures warning signs on the register, not every source of danger, and Chapter 4.2 takes up the instrument that combines the two."
          ]
        }
      ],
      instrument: "timeline"
    }
  ],
  quiz: [
    {
      id: "q4-1-1",
      question: "With the standard register (\\(W = 56\\)), a static trend and no inscribed load, an analyst marks tripwires totalling a weight of 20. What does the Sentinel Matrix read?",
      options: [
        {
          id: "opt-a",
          text: "34 per cent, Guarded",
          explanation: "Incorrect. A weight of 19 yields 34. A weight of 20 yields \\(\\frac{2000}{56} = 35.71\\), which rounds to 36.",
          correct: false
        },
        {
          id: "opt-b",
          text: "36 per cent, Elevated",
          explanation: "Correct. \\(\\frac{100 \\times 20}{56} = 35.71\\), times 1.00, rounds to 36: the Elevated band, which requires a verifier seated and an office-continuity covenant.",
          correct: true
        },
        {
          id: "opt-c",
          text: "35 per cent, Elevated",
          explanation: "Incorrect. Under a static trend the standard register cannot produce exactly 35; the index steps from 34 to 36.",
          correct: false
        },
        {
          id: "opt-d",
          text: "20 per cent, Guarded",
          explanation: "Incorrect. The index is the weighted share of the register, not the raw weight.",
          correct: false
        }
      ]
    },
    {
      id: "q4-1-2",
      question: "The Rupture Index reads 61 per cent and an independent verifier is seated. What happens to the Conditional Escrow Waterfall?",
      options: [
        {
          id: "opt-a",
          text: "It releases normally, because the verifier satisfies the rupture gate.",
          explanation: "Incorrect. The verifier satisfies the Rupture Containment gate, but the escrow freeze is a separate rule that a verifier cannot discharge.",
          correct: false
        },
        {
          id: "opt-b",
          text: "It releases only Tranche 1.",
          explanation: "Incorrect. Under the freeze nothing is released, whatever tranches are met.",
          correct: false
        },
        {
          id: "opt-c",
          text: "It is frozen and releases nothing until the index falls below 60.",
          explanation: "Correct. At \\(R \\ge 60\\) the released share is zero. The freeze is not a forfeiture: when the index falls below 60, release resumes at the level the tranches then justify.",
          correct: true
        },
        {
          id: "opt-d",
          text: "It forfeits all unreleased tranches permanently.",
          explanation: "Incorrect. The tranches remain met and the account recomputes once the rupture reading falls.",
          correct: false
        }
      ]
    },
    {
      id: "q4-1-3",
      question: "Which of the following raises the Rupture Index directly?",
      options: [
        {
          id: "opt-a",
          text: "The Generational Cliff trap appearing on the matrix.",
          explanation: "Incorrect. Standard traps are diagnostic readings published for the drafting divisions; they do not add to the index.",
          correct: false
        },
        {
          id: "opt-b",
          text: "An active inscribed custom trap placed through the Sovereign Inscription tray.",
          explanation: "Correct. Each active inscribed trap adds six points of inscribed load, within the cap of 30.",
          correct: true
        },
        {
          id: "opt-c",
          text: "A higher mean bond on Desk 01.",
          explanation: "Incorrect. The bond mean does not enter the Rupture Index.",
          correct: false
        },
        {
          id: "opt-d",
          text: "A higher unmitigated exposure on Desk 12.",
          explanation: "Incorrect. Exposure enters the decay constant of the Decay Horizon, not the Rupture Index; the Drill Beta preset of the cutaway shows identical indices with shorter half-lives.",
          correct: false
        }
      ]
    },
    {
      id: "q4-1-4",
      question: "Under a deteriorating trend, an observed share of 40 and an inscribed load of 12 give which band?",
      options: [
        {
          id: "opt-a",
          text: "Elevated, at 52.",
          explanation: "Incorrect. The trend multiplies the whole sum: \\((40 + 12) \\times 1.15 = 59.8\\).",
          correct: false
        },
        {
          id: "opt-b",
          text: "Critical, at 60.",
          explanation: "Correct. \\(\\round(52 \\times 1.15) = \\round(59.8) = 60\\), the Critical band, and the escrow freezes.",
          correct: true
        },
        {
          id: "opt-c",
          text: "Guarded, at 34.",
          explanation: "Incorrect. Recompute the sum before applying the multiplier.",
          correct: false
        },
        {
          id: "opt-d",
          text: "Stable, because inscribed load is ignored under a deteriorating trend.",
          explanation: "Incorrect. The inscribed load is always added before the trend is applied.",
          correct: false
        }
      ]
    },
    {
      id: "q4-1-5",
      question: "After a peace agreement is signed, talks resume but no tripwire has been cleared. Which trend should the analyst select?",
      options: [
        {
          id: "opt-a",
          text: "Improving, because an agreement now exists.",
          explanation: "Incorrect. A signature clears no tripwire. The desk's note defines improving as signs cleared this quarter, verified independently; the Conakry and Lomé records show signatures followed by renunciation.",
          correct: false
        },
        {
          id: "opt-b",
          text: "Static, unless signs were added or cleared in the period.",
          explanation: "Correct. The trend is evidence about the register. With no sign added or cleared, static is the reading the evidence supports.",
          correct: true
        },
        {
          id: "opt-c",
          text: "Deteriorating, as a precaution after every signature.",
          explanation: "Incorrect. The trend is not a precaution either way; deteriorating requires signs added in the period.",
          correct: false
        },
        {
          id: "opt-d",
          text: "Any trend, because the trend does not change the band.",
          explanation: "Incorrect. The trend can move the index across a band: weight 34 reads 61 static and 52 improving.",
          correct: false
        }
      ]
    },
    {
      id: "q4-1-6",
      question: "In the language of the composite-indicator literature, why does the Rupture Index not suffer from compensability in the dangerous direction?",
      options: [
        {
          id: "opt-a",
          text: "Because it uses a geometric mean.",
          explanation: "Incorrect. The index is a linear, weighted, normalised sum, not a geometric aggregation.",
          correct: false
        },
        {
          id: "opt-b",
          text: "Because it adds warning signs only, so no sign can be offset by strength elsewhere.",
          explanation: "Correct. Every term is a sign of danger; the absence of one tripwire cannot buy back the presence of another. The non-compensatory treatment of the bonds themselves is carried by the Liebig minimum and the viable floor.",
          correct: true
        },
        {
          id: "opt-c",
          text: "Because the weights are equal.",
          explanation: "Incorrect. The weights are 1, 2 or 3 by doctrinal gravity, and equal weights would not remove compensability in any case.",
          correct: false
        },
        {
          id: "opt-d",
          text: "Because the trend multiplier cancels compensation.",
          explanation: "Incorrect. The trend scales the whole sum and has nothing to do with compensation between indicators.",
          correct: false
        }
      ]
    }
  ],
  practice: [
    {
      problem: "A standard register (\\(W = 56\\)) has tripwires of weight 3, 3, 2 and 2 marked on the Communal bond and nothing else. There is no inscribed load and the trend is static. Give the observed share, the index, the band and the Communal strain.",
      solution: [
        "The observed weight is \\(\\sigma = 10\\), so the share is \\(\\frac{1000}{56} = 17.857\\). The index is \\(\\round(17.857) = 18\\), Guarded. The Communal strain is the Communal weight present over the Communal total, \\(\\frac{100 \\times 10}{15} = 66.7\\), published as 67.",
        "The reading illustrates why the strain and the index must be read together. The index is in the second band; the Communal bond carries two-thirds of its warning weight. No standard trap engages on the Communal strain alone, but the Elite-Pact Mirage would engage if Intergenerational strain also reached 50 while Interpersonal stayed below 50."
      ]
    },
    {
      problem: "The analyst adds two custom indicators of weight 3 to the register of Problem 1 and marks neither. What happens to the index?",
      solution: [
        "The register total becomes \\(W = 62\\). The share falls to \\(\\frac{1000}{62} = 16.13\\) and the index to 16, still Guarded. Adding indicators without marking them dilutes every existing tripwire.",
        "That is the intended discipline: a custom indicator is a commitment to watch something, and the register holds the analyst to it. If the analyst later marks both, the share rises to \\(\\frac{1600}{62} = 25.81\\) and the index to 26."
      ]
    },
    {
      problem: "Under a deteriorating trend, what is the smallest standard-register weight that enters the Critical band with an inscribed load of 6?",
      solution: [
        "The condition is \\(\\round((\\frac{100\\, \\sigma}{56} + 6) \\times 1.15) \\ge 60\\), so \\((\\frac{100\\, \\sigma}{56} + 6) \\times 1.15 \\ge 59.5\\), which gives \\(\\frac{100\\, \\sigma}{56} \\ge 45.74\\) and \\(\\sigma \\ge 25.61\\). The threshold weight is 26.",
        "Check: \\(\\frac{2600}{56} = 46.43\\); adding 6 gives 52.43; times 1.15 gives 60.29, which rounds to 60, Critical. At a weight of 25 the same steps give 57.96 and an index of 58, Elevated. One inscribed trap has moved the Critical threshold from 29 to 26."
      ]
    },
    {
      problem: "An index of 41 is read on Desk 02. List every consequence on other desks.",
      solution: [
        "41 is in the Elevated band and at or above the provisional-measures marker. Gate 2 fails unless a verifier is seated on Desk 16; Gate 4 requires an office-continuity provision drafted on Desk 10; the engine raises both locks and the elevated alert. The Legal Desk drafts its fourth head for provisional measures because 41 is at least 40.",
        "The escrow is not frozen, because 41 is below 60. Upstream, the index enters the decay constant, the durability penalty, the contagion multiplier and containment, \\(C = 0.59\\)."
      ]
    }
  ],
  readingList: [
    {
      citation: "Peace Agreement between the Government of the Republic of Rwanda and the Rwandese Patriotic Front, Arusha, 4 August 1993 (UN Peacemaker)",
      url: "https://peacemaker.un.org/en/node/9540",
      note: "The signed text and its protocols, with the transitional timetable."
    },
    {
      citation: "United Nations Security Council, Resolution 872 (1993), 5 October 1993",
      url: "https://digitallibrary.un.org/record/197341",
      note: "Establishes UNAMIR to support implementation of the Arusha Agreement."
    },
    {
      citation: "United Nations, UNAMIR mission background (Department of Peace Operations)",
      url: "https://peacekeeping.un.org/en/mission/past/unamirS.htm",
      note: "Deployment, authorised strength, Resolutions 912 and 918, and the casualty estimates cited in Section I."
    },
    {
      citation: "Report of the Independent Inquiry into the Actions of the United Nations during the 1994 Genocide in Rwanda, S/1999/1257 (15 December 1999)",
      url: "https://digitallibrary.un.org/record/405039",
      note: "The 11 January 1994 cable, its handling and the Inquiry's conclusions on resources, will and judgement."
    },
    {
      citation: "United Nations Security Council Repertoire 1993 to 1995, Chapter VIII, item on Rwanda",
      url: "https://main.un.org/securitycouncil/sites/default/files/en/sc/repertoire/93-95/Chapter%208/AFRICA/93-95_8-5-RWANDA.pdf",
      note: "The Council's statement of 10 September 1993 and the target date for transitional institutions."
    },
    {
      citation: "United Nations, UNAMSIL background (Department of Peace Operations)",
      url: "https://peacekeeping.un.org/mission/past/unamsil/background.html",
      note: "Abidjan, Conakry and Lomé; the May 2000 crisis; force levels; disarmament figures."
    },
    {
      citation: "OECD and European Commission Joint Research Centre, Handbook on Constructing Composite Indicators: Methodology and User Guide (2008)",
      url: "https://www.oecd.org/en/publications/handbook-on-constructing-composite-indicators-methodology-and-user-guide_9789264043466-en.html",
      note: "Normalisation, weighting, aggregation and compensability."
    },
    {
      citation: "European Commission JRC Competence Centre on Composite Indicators, 10 Step Guide, Step 7: Aggregating indicators",
      url: "https://knowledge4policy.ec.europa.eu/composite-indicators/toolkit_en/navigation-page/10-step-guide_en/step-7-aggregating-indicators_en",
      note: "Weights as trade-offs, full compensability and non-compensatory alternatives."
    },
    {
      citation: "Protocol Relating to the Establishment of the Peace and Security Council of the African Union (2002), Article 12",
      url: "https://www.au.int/sites/default/files/treaties/37293-treaty-0024_-_protocol_relating_to_the_establishment_of_the_peace_and_security_council_of_the_african_union_e.pdf",
      note: "The Continental Early Warning System and its Situation Room."
    },
    {
      citation: "IGAD Conflict Early Warning and Response Mechanism (CEWARN), About",
      url: "https://cewarn.org/about",
      note: "Mandate, structure and data-based early warning in the IGAD region."
    },
    {
      citation: "IGAD, CEWARN Strategy 2007 to 2011",
      url: "https://resilience.igad.int/wp-content/uploads/2020/06/Conflict-CEWARN-Strategy-2007-2011.pdf",
      note: "Incident and weekly situation reports by field monitors."
    },
    {
      citation: "R. R. van der Ploeg, W. Böhm and M. B. Kirkham, 'On the Origin of the Theory of Mineral Nutrition of Plants and the Law of the Minimum', Soil Science Society of America Journal 63(5) (1999) 1055 to 1062",
      url: "https://doi.org/10.2136/sssaj1999.6351055x",
      note: "Sprengel's 1828 statement of the law of the minimum and Liebig's later popularisation."
    },
    {
      citation: "The Vinculum Codex and Compact, UDCA Official Edition, Part VI, 6.1 The Composite Rupture Index",
      note: "The doctrinal statement of the register, the traps and the granularity results (supplied edition; not public)."
    }
  ]
};

export { CHAPTER_4_2 } from "./academyModuleIVChapter42";

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
