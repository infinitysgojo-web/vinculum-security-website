import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import {
  F_INSCRIBED,
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
  estimatedMinutes: 69,
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
          "On 6 April 1994 the aircraft carrying the Presidents of Rwanda and Burundi was shot down on its approach to Kigali, and the killing of Tutsi and of moderate Hutu began within hours. On 21 April the Council, by Resolution 912, reduced the mission from its authorised 2,548 to 270. By October 1994 United Nations estimates put the dead at no fewer than half a million.",
          "The mission's changing authorization also separates a Council decision from an operational capability. Resolution 918, adopted in May, increased the authorized strength to 5,500, but the UNAMIR history records that it took nearly six months for Member States to provide the additional troops. The smaller mission nevertheless protected thousands of people who had taken shelter at UN-controlled sites. Both facts matter: field personnel could provide direct protection in particular locations, while the force's overall scale and the delay in reinforcement constrained what the mission could do across the country."
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
            "The third instrument was the Lomé agreement of 7 July 1999, which ended hostilities and provided for a government of national unity. On 22 October 1999 the Security Council established the United Nations Mission in Sierra Leone with up to 6,000 military personnel, and in February 2000 raised the ceiling to 11,100. In May 2000 the mission nearly collapsed: the RUF seized hundreds of peacekeepers and renounced the ceasefire. The Council raised the ceiling again to 13,000 on 19 May 2000 and to 17,500 in March 2001; a British force deployed; sanctions were applied to the RUF's sponsors; and by early 2002 more than 75,000 fighters had been disarmed and the war was declared over.",
            "The UNAMSIL account describes a wider set of tasks after the immediate security crisis. The mission helped organise national elections, supported the voluntary return of more than half a million refugees and internally displaced people, worked to restore government authority and services in areas formerly held by rebels, trained police, and assisted in rebuilding police stations. It also contributed to the Truth and Reconciliation Commission and the Special Court for Sierra Leone. These outcomes show that the response involved institution-building and accountability as well as a larger military presence; they are not reducible to the troop ceiling alone.",
            "The same institutional history records continuing vulnerabilities after the war was declared over: reliance on donor financing, illicit diamond income reaching private hands, unemployment among ex-combatants and young people, and limited economic benefits for much of the population. Those observations put a boundary around a simple 'register cleared' narrative. Disarmament and election support are important observable changes, but a decision-maker still needs evidence about service delivery, fiscal dependence, distribution, and employment before treating the broader settlement as resilient. A rupture register can make selected warning signs visible; it cannot substitute for these separate post-conflict outcome measures."
          ]
        },
        {
          title: "What the two registers teach",
          paragraphs: [
            "The Sierra Leone sequence shows the second half of the index at work. Each signature was followed by a period in which an observer could have been tempted to read the trend as improving because an agreement existed. The record shows why the desk forbids that reading. The Conakry plan was signed and never implemented; the Lomé agreement was signed and, ten months later, a party renounced its ceasefire. A signature clears no tripwire. What cleared tripwires in Sierra Leone after May 2000 was observable and verifiable: fighters disarmed, a larger force deployed, sponsors sanctioned.",
            "The Arusha record shows the first half. The share of the register present was rising for months on three bonds, and the instrument had no rule that turned that share into a consequence. The Sentinel Matrix supplies both halves, and the separation is deliberate: the observed share is a count of evidence; the trend is a separate judgement about direction, which must itself be evidenced; and the bands attach consequences that no participant can talk away.",
            "Two cautions keep this reading honest. First, the index is a rule applied to what an analyst records; it would not have known anything that the people in Kigali or New York did not know, and the lesson of Arusha is about aggregation and consequence, not about foresight. Second, nothing here supports a claim that a number would have prevented a genocide. The Inquiry located the decisive failures in resources and political will. The narrower claim the chapter makes is that a weighted register with automatic consequences removes one specific failure, the failure to aggregate, from the list of things that can go wrong."
          ],
        },
        {
          title: "How to use a historical autopsy without inventing a score",
          paragraphs: [
            "The case studies are not retrospective applications of the software. The record does not provide complete contemporary tripwire registers, a total weight denominator, or the exact trend classifications that the engine requires. Assigning these inputs after the event would create a false impression of measurement and invite hindsight bias: once the outcome is known, every earlier sign can appear more obvious than it was to the people who received it.",
            "The historical method used here is narrower. It identifies documented events, locates the institutions and bonds implicated by those events, and asks how the platform's stated categories would direct an operator to examine them. This is mechanism tracing, not numerical reconstruction. The difference matters because the chapter's doctrinal framework must not be presented as a hidden measure that historical actors actually used.",
            "Arusha and Sierra Leone also differ in what their records can support. The Independent Inquiry into Rwanda provides an unusually detailed account of information handling, command decisions, and the constraints on UNAMIR. The Sierra Leone sequence shows how multiple agreements, force deployments, and disarmament measures changed over time. Neither source set makes the counterfactual claim that a dashboard would have altered political will or resource allocation.",
            "A reader should distinguish an observed warning from an analyst's classification of that warning. The informant's cable is a documented event; assigning it a weight within a register is an analytical step. A monitoring report may document delayed implementation; calling it a particular tripwire is a mapping decision. Both steps can be defensible, but they should not be collapsed into a claim that the source itself contains a Rupture Index.",
            "The same care applies to trend. Later evidence that a settlement collapsed does not establish that every earlier period was deteriorating according to the desk's rules. The trend is selected from signs added or cleared during the review period. It therefore requires contemporaneous comparison, not retrospective intuition about the eventual outcome.",
            "This methodological restraint strengthens rather than weakens the case studies. They show why aggregation and consequence can matter while respecting what historical evidence can establish. The lesson is not that a formula would have prevented a catastrophe; it is that a disciplined register can make the handling of known signs more visible and auditable."
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
            "That mandate illustrates why an indicator register is only one part of an early-warning system. CEWARN's stated work includes information collection and exchange, analysis, scenario development, response options, communication to decision-makers, and studies of particular conflict types and areas. A weighted reading can make a defined set of signs easier to compare, but it does not perform those functions by itself: it cannot establish why a sign appeared, identify an appropriate response without an authorized procedure, or ensure that institutions have the capacity and resources to act. The register's output must therefore be read as a structured input to a decision process, not as the decision process or as evidence that an intervention will be effective.",
            "The distinction also limits what can be inferred from comparison with regional mechanisms. CEWARN is a network established by member states and linked to regional and continental arrangements; the Sentinel Matrix is a deterministic component of a browser-local application. Similar vocabulary—indicators, reporting periods, analysis—does not establish equivalence in mandate, coverage, data quality, or response authority. Nor does the existence of CEWARN empirically validate this curriculum's 24 indicators or their weights. Those are internal design choices that require their own provenance, review, and version control.",
            "CEWARN's own description makes the institutional difference more specific. It describes a network spanning local, national, and regional levels, with a secretariat and participation by both government and civil society; its stated work moves from field data through analysis and scenario development to the communication of response options. The page also credits its operations with reductions in violence in named border areas. That last statement is an institutional self-assessment, not, by itself, an independently identified causal estimate. It is useful evidence of how the mechanism describes its experience and mandate, but it does not establish a counterfactual, quantify the size of an effect, or show that every reported reduction followed from early warning.",
            "A careful assessment of an early-warning mechanism would therefore keep three evidence layers distinct: the system's formal mandate, its administrative record of observations and responses, and an evaluation of outcomes against a credible comparison. The mandate can be verified against a protocol; operational activity can be checked against reports, coverage, and response records; causal impact requires a research design that addresses other changes in the region. This distinction matters for the chapter's comparison because a deterministic index can be internally reproducible without demonstrating that its readings improve response or reduce conflict. The register may support disciplined recording, but efficacy is a separate empirical question.",
            "The bridge to the desk is direct. The standard register is an indicators module in the AU's sense, fixed in advance so that observers record the same things; the weekly situation report's discipline of answering every question every period is the discipline the register imposes on each tripwire; and the trend field corresponds to the comparison of one period's report with the last. Where the desk departs from both systems is in the response half: CEWARN formulates options, and the Situation Room advises, whereas the Sentinel Matrix binds. A band is not advice to the Legal Desk or the escrow; it is an input they cannot decline to read."
          ]
        },
        {
          title: "Register design, redundancy, and denominator discipline",
          paragraphs: [
            "A register is not a neutral inventory. Selecting indicators determines which conditions become visible to the instrument, how often they can be observed, and which absences remain outside the calculation. The standard register fixes a common baseline, while custom indicators allow an operator to address a theatre-specific concern. Both choices carry an obligation to explain why an item is relevant and how evidence will be collected.",
            "Adding a custom indicator changes the denominator whether or not it is marked present. This discourages a particular form of cherry-picking: adding only a new warning that is already observed would otherwise raise the numerator without registering the broader monitoring commitment. The new item becomes part of the full universe under review, so its inclusion dilutes the share until evidence supports marking it.",
            "The denominator effect creates an important discipline for longitudinal comparison. If a custom indicator is added between review periods, the observed share can change even if none of the previously recorded signs changed. A trend report should therefore disclose changes to the register itself, not just changes to the items marked present. Comparing raw index values without that context can mistake a measurement redesign for an improvement or deterioration in the theatre.",
            "Composite-indicator methodology also warns that multiple indicators can be correlated or partially redundant. The fixed weights in this system are doctrinal weights of gravity, not estimates of statistical independence. If several tripwires capture closely related manifestations of one underlying condition, marking them together can make that condition contribute more than an analyst expects. The correct response is not to invent an adjustment to the formula, but to inspect the register design, document the rationale, and use any formal change process for doctrinal revision.",
            "The same principle applies to custom indicators that duplicate a standard tripwire. Before adding one, identify the specific gap it fills, the bond to which it belongs, and the evidence that distinguishes it from existing items. A well-designed custom item expands observability; a duplicate can double-count a single event and create false precision.",
            "The denominator is therefore part of the substantive method, not a bookkeeping detail. Record the version of the register, the standard and custom items included, their weights, and the date of any change. This allows another analyst to reproduce the weighted share and to understand whether a change in the reading came from the world, the register, or both."
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
        },
        {
          title: "A deeper reading of weighted normalisation",
          paragraphs: [
            "The normalised share answers a specific question: what fraction of the total assigned warning weight is currently marked present? It does not answer what fraction of all possible real-world dangers exists. The denominator is the register, not the universe of risks. This distinction prevents a common interpretive overreach in which a percentage is treated as a claim about the completeness of knowledge.",
            "Weights make the register a structured aggregation rather than a simple count. Ten observed low-weight signs need not carry the same sum as ten high-weight signs, and the same raw number of marked indicators can produce different readings depending on their assigned weights. The weight system encodes a prior doctrinal judgment about gravity. The engine executes that judgment consistently; it does not empirically validate the judgments merely by calculating them.",
            "The additive form has an interpretable marginal property before rounding and the cap: each additional unit of observed weight changes the base share by the same amount, given a fixed register total. Adding a custom indicator changes that total and therefore changes the contribution of every marked item. This is why custom register design must be governed and documented rather than treated as casual data entry.",
            "The index is not a probability. A reading of 40 does not mean there is a forty-per-cent chance of rupture, nor does the trend multiplier convert the weighted share into a probability. The units are points on the platform's defined index. They are useful for deterministic banding and downstream rules, but they do not carry a probabilistic interpretation unless a separate empirical model explicitly supplies one.",
            "The distinction between numerator and denominator also helps diagnose apparent improvement. If signs are cleared while the register stays constant, the observed share falls because the numerator is smaller. If new indicators are added and remain unmarked, the share may also fall because the denominator grows. Those two changes have different substantive meanings even if they yield similar arithmetic.",
            "A reproducible report should therefore state the marked weight, the total register weight, the inscribed load, and the trend, not only the final index. This small set of quantities allows a reviewer to identify whether the reading is driven by observed signs, custom inscriptions, or the selected direction of the trend."
          ]
        },
        {
          title: "Rounding boundaries and threshold proximity",
          paragraphs: [
            "Rounding creates a discrete output from inputs that can vary continuously or in weight increments. The band is selected from the rounded integer, so a raw value near a half-integer can determine whether a reading moves up or down. The proof should reproduce the engine's half-up rule and should not rely on a software environment with a different default tie convention.",
            "Threshold proximity is operationally important even when the displayed band has not changed. A reading just below a threshold can be one low-weight indicator away from a new obligation; a reading well inside a band may have a larger buffer. Reporting only 'Elevated' or 'Guarded' conceals this difference, which is why the chapter recommends giving the threshold weight and the next-step margin.",
            "The possibility of skipped integer values follows from the discrete weight structure and fixed denominator. A static standard register cannot necessarily produce every integer between zero and one hundred. The absence of a particular display value does not mean the threshold is inactive; it means the set of attainable outputs jumps across that value.",
            "Inscribed load and trend change the attainable set. The same observed share can land in different bands under the three canonical multipliers, and the addition of an inscribed load shifts the pre-multiplier total. Analysts should not assume the standard-register threshold table remains valid after custom indicators, shocks, or traps change the inputs.",
            "A useful audit exercise is to calculate the raw value immediately below and above a threshold, then apply the exact rounding and band lookup. This exposes whether a purported boundary case depends on a mistaken rounding convention or on an unreported custom load.",
            "The published classification is still authoritative once the canonical function has executed. An operator may note that the unrounded value is near a boundary, but must not replace the engine's band with a personal interpretation. The analytical commentary supplements the output; it does not silently revise it."
          ]
        },
        {
          title: "Sensitivity is not the same as certainty",
          paragraphs: [
            "Sensitivity analysis asks how the output responds to an input change, holding other inputs fixed. In this chapter, the trend examples show that the same register can produce materially different readings under improving, static, or deteriorating classifications. This does not establish which trend is correct; it makes the consequence of that evidence judgment visible.",
            "An improving trend changes the multiplier but does not erase any marked sign. The register remains the evidence inventory, and the trend is a separate period-to-period classification. An operator who uses the multiplier to compensate for signs that remain present is not measuring improvement; the operator is applying an unsupported optimism adjustment.",
            "Likewise, changing the register to reflect genuinely cleared signs is different from selecting an improving trend. A sign can be cleared while the period-level direction remains static, and the trend can be deteriorating when new signs are added even if other signs were also cleared. The desk's defined choices should be applied to the evidence available for that period, not to an intuitive overall mood.",
            "The index's sensitivity to weights also deserves attention. A tripwire of weight three moves the observed share more than one of weight one, but the weights are fixed doctrinal assignments. An analyst should not lower a weight to make a case look calmer or raise one because the outcome later proved severe. Any change to the register's design requires a governed revision and a transparent account of how results before and after the revision compare.",
            "Uncertainty can be expressed in the evidence record without converting the index into a range. If a tripwire's presence is disputed, record the competing evidence and the decision process. Do not mark fractional presence unless the schema expressly provides for it. If a separate research analysis explores alternative classifications, label it a sensitivity scenario, retain the canonical output, and do not present the scenario as an engine reading.",
            "This is the difference between sensitivity and certainty: the calculation can tell us what follows from a set of inputs, while evidence and judgment determine whether those inputs are warranted. The platform is designed to make the former deterministic and the latter visible."
          ]
        },
        {
          title: "Interpreting the cap and the diminishing information above it",
          paragraphs: [
            "The cap at 100 keeps the index within its published domain, but it also means that different high-load states can share the same displayed value. One state may reach the cap through a fully marked register; another may do so through a smaller observed share combined with a deteriorating trend and inscribed load. At the cap, the overall number no longer distinguishes those input combinations.",
            "This is another reason to preserve the components. A reading of 100 does not tell the operator which signs are present, whether the trend is improving or deteriorating, or how much inscribed load is active. The register, source notes, strain values, and trend remain necessary for deciding what to investigate and how to respond.",
            "Capping does not make additional evidence irrelevant. New signs can matter to the bond profile, the latent traps, and other operational analyses even when the headline index remains at 100. The cap applies to the index value; it does not erase the underlying record or imply that all possible risk has been measured.",
            "Similarly, a reading below the cap should not be read as a complete measure of severity. It is the output of the defined instrument, not an exhaustive scale of harm. The analyst should avoid phrases such as 'maximum possible danger' unless the statement is explicitly limited to the index's numerical domain.",
            "The cap is also distinct from a band. Critical begins at 60, while 100 is the upper numerical bound. The Critical band includes a range of readings and the rule set does not automatically distinguish all of them. A report should give the actual index value, not only the word Critical.",
            "In an audit, reconstruct the pre-cap value if the implementation exposes the required inputs, but label it as an intermediate calculation rather than a published reading. The official index remains the canonical capped value."
          ]
        },
        {
          title: "Why an auditable derivation matters more than a persuasive headline",
          paragraphs: [
            "The headline number is easy to repeat and easy to detach from its evidence. A derivation makes the reading contestable in a productive way: another analyst can check the register total, the marked weights, the inscribed load, the trend, the rounding, and the band lookup.",
            "Reproducibility does not require the reader to agree with every classification. It requires the reader to see how the classification was made and where a different evidentiary judgment would alter the result. That is a stronger basis for disagreement than a narrative that cites a number without showing its source.",
            "The derived value should also be traceable across desks. If the number triggered an escrow freeze or a legal drafting requirement, the record should identify the same source reading and the applicable downstream rule. This makes it possible to detect whether the issue is the index, the consequence function, or a stale display.",
            "A good audit separates formula verification from policy review. The former asks whether the engine computed the value correctly; the latter asks whether the register and consequences remain appropriate under the doctrine and governing instruments. Both are legitimate reviews, but they must not be mixed into an ad hoc recalculation.",
            "Scholarly criticism can proceed in the same manner. One may question the choice of indicators, the assignment of weights, or the use of an additive share, while still accurately describing what the implemented function returns. A critique that changes the method without disclosure cannot be compared fairly with the canonical result.",
            "The index is most credible when it is reproducible even by a critic. That standard is not a demand for agreement; it is a condition for serious examination."
          ]
        },
        {
          title: "Concluding interpretation of the Rupture Index",
          paragraphs: [
            "The Rupture Index is a weighted register of declared warning signs, supplemented by an inscribed load and adjusted by a period-based trend. Its whole-number value and band follow from the canonical engine function, including its rounding and cap. The bands connect that reading to specified obligations across the operational desks.",
            "It is not a forecast, probability, legal finding, or complete account of a conflict. The analyst remains responsible for the quality of the observations, the fairness of the classification process, and the limits of any historical comparison. Those responsibilities are not weakened by the fact that the arithmetic is deterministic.",
            "The practical objective is to prevent known evidence from remaining fragmented and consequence-free. The index can make aggregation reproducible and downstream duties visible. It cannot provide the resources or political will needed to act, and it cannot guarantee that action will avert harm.",
            "For that reason, a correct reading is always accompanied by its provenance: the register version, marked weight, denominator, inscribed load, trend evidence, and date. The result then becomes a verifiable part of a decision record rather than a free-floating number.",
            "The chapter's mathematical derivation supports this modest but important claim. When inputs change, the result changes in a defined way; when thresholds are crossed, the platform routes the consequences in a defined way. Whether those inputs faithfully describe the world and whether the resulting obligations are legitimate remain questions for evidence, law, and accountable institutions.",
            "A reader who can explain both halves—the deterministic transformation and the human evidentiary burden—can use the matrix with rigor. The score is a disciplined summary, not a substitute for the record it summarizes."
          ]
        },
        {
          title: "Final checklist for the next reading",
          paragraphs: [
            "Before the next review, confirm the register version, the full denominator, the status of each marked tripwire, the evidence for any clearance, and the provenance of each custom inscription. Recompute the index through the canonical function and check the band, strain profile, and downstream consequences. State whether the current result is live or a local rehearsal.",
            "Keep the threshold margin visible. A band alone does not show how many units of evidence would move the reading, and a high strain on one bond may remain important even when the overall band is lower. The report should show both the aggregate and the location of pressure.",
            "If the team cannot verify a sign, record the uncertainty and follow the agreed review process. Do not silently convert missing evidence into a cleared item or change a weight to obtain a preferred outcome. Preserve corrections and objections in the decision record.",
            "These steps do not add a new formula. They make the existing register reproducible and usable by the next operator, which is the purpose of an auditable warning system."
          ]
        },
        {
          title: "Continuity between the signal and the response",
          paragraphs: [
            "The register's final test is whether its evidence can be followed into the response record. A warning that is marked present should have an identifiable source; a band consequence should have an identifiable function or responsible desk; and a later clearance should show what evidence changed. This chain does not guarantee effective action, but it makes inaction and disagreement visible enough to review. Where no response follows a triggered obligation, the record should identify whether the cause was lack of authority, resources, access, or political will rather than treating the missing response as a change in the index. This continuity keeps the warning accountable across staff rotations, reporting periods, and later review."
          ]
        },
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
        },
        {
          title: "A review cycle that preserves evidence over time",
          paragraphs: [
            "A register should be read as a dated observation, not as a permanent label attached to a community or institution. The operator begins a review by preserving the previous reading and its evidence set, then records current observations using the same definitions. That sequence allows the team to distinguish a newly observed sign from an old sign that remains present.",
            "The review interval should be short enough to detect relevant change and long enough for the evidence process to be meaningful. The curriculum describes compressed review when the trend is deteriorating and independently verified clearance before relaxing a cadence when the trend is improving. The appropriate real-world cadence depends on the mandate and evidence environment; the chapter does not add a new interval beyond the existing rules.",
            "For each marked item, record its source, observation date, bond assignment, weight, and the basis for treating it as present. For each unmarked item, retain enough information to show whether it was assessed and found absent or simply not investigated. This distinction prevents silence in the record from being misread as proof that a condition has cleared.",
            "When evidence arrives after the period closes, the analyst should date the correction and preserve the original entry rather than silently rewriting history. A later source may change the present reading, but it does not change what an operator could have known at an earlier date. Maintaining both versions supports retrospective accountability without hindsight distortion.",
            "A periodic review should also examine whether the register itself remains fit for purpose. New patterns may require a governed custom indicator; an obsolete measure may require formal retirement. Any such change should be versioned because it affects the denominator and the meaning of comparisons across periods.",
            "The resulting record is more than an audit trail. It is the basis for deciding whether a trend multiplier is supported, whether a tripwire can be cleared, and whether downstream obligations should change. Without a consistent time series, the trend field collapses into subjective impression."
          ]
        },
        {
          title: "The band is a routing rule, not a complete response plan",
          paragraphs: [
            "A band routes the reading into specified institutional consequences. It does not answer every question about how those consequences should be implemented. At Elevated, for example, the stated verifier and office-continuity obligations have named desks and gates; the quality, independence, authority, and practical access of the verifier still require substantive assessment.",
            "At Critical, the escrow freeze is a rule of the platform and the alert carries an instruction to convene principals and the verifier within the stated period. Neither action alone resolves the political disagreement or supplies the legal authority of a real-world mission. The applicable mandate, treaty, and domestic law govern what officials may do outside the platform.",
            "This distinction between routing and adjudication is familiar in administrative design. A trigger can automatically initiate a review or safeguard while leaving a competent authority responsible for findings and remedies. Here the index is deterministic in how it routes its value through the desks; it is not an adjudicator of whether a party breached international law.",
            "The decision record should make that separation explicit. Quote the band and the engine-generated obligation, identify the official responsible for the next step, and cite the source of legal authority for any external measure. Do not write that a dashboard alert itself authorises sanctions, intervention, or the withholding of funds outside the modeled escrow.",
            "When the band changes, explain which input caused it. A transition from 34 to 36 on a static standard register follows from additional recorded weight and rounding; it is not evidence that the underlying world suddenly changed in a categorical way at that exact point. The category marks an operational boundary while the evidence changes in its own continuous and contested manner.",
            "The routing rule is strongest when it is understood as a minimum procedural obligation. It ensures that certain desks must address a reading, but it does not prevent officials from taking other lawful measures or from considering relevant facts beyond the index. The Academy should not be read as narrowing legal authority or replacing ordinary institutional responsibility."
          ]
        },
        {
          title: "Cross-desk consistency and the single-source-of-truth principle",
          paragraphs: [
            "The shared bus is intended to keep downstream instruments aligned on one rupture reading. If each desk independently recalculated the index from its own partial view of the register, two instruments could disagree about whether the same mission was Elevated or Critical. Publishing one canonical signal avoids that form of analytic divergence.",
            "Consistency does not mean every downstream desk uses the signal in the same way. The Decay Horizon incorporates rupture into its decay constant; the Succession Simulator applies its own durability calculation; the escrow uses the critical freeze condition; and the Dominum synthesis uses containment. Each instrument has its own function and interpretation, but each reads the same published source value rather than re-inventing it.",
            "This architecture makes provenance particularly important. If the Sentinel Matrix has not published a reading, downstream systems may defer, apply their own documented guard, or treat the state differently according to their defined behavior. The analyst should not fill the gap with a value chosen to make the instruments agree. The correct action is to resolve the missing source state and then inspect the downstream responses.",
            "An override or rehearsal state can be legitimate for analysis, but the result must be labeled as a counterfactual. It should not be confused with the mission bus or sealed as an operational finding. The operator must know which state is linked and which is locally simulated before carrying a number into another desk or an official handover.",
            "The single-source principle also makes change impact traceable. When a new tripwire is marked or a trend is updated, the analyst can follow the same value to every dependent instrument and identify which consequences changed. This permits an audit of the chain without duplicating the underlying formula.",
            "A good cross-desk review asks both whether the Sentinel reading is correct and whether every dependent instrument responds to that reading as specified. The first is a question about source evidence; the second is a question about implementation. Keeping those questions separate makes both easier to test."
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
        },
        {
          title: "A warning sign is evidence of a condition, not an explanation of its cause",
          paragraphs: [
            "The register is designed to make observable signs comparable, not to supply a complete causal account of why they appeared. A tripwire can show that a channel has closed, a commitment has not been implemented, or a verification body lacks independence. It does not by itself establish the political motive behind that condition or determine which party bears legal responsibility.",
            "This distinction is essential in conflict analysis. The same observable failure can arise from deliberate obstruction, limited administrative capacity, insecurity, an ambiguous clause, or a genuine disagreement about the meaning of the agreement. Those mechanisms call for different responses. The register may place the observed condition on a bond and add its weight; the accompanying case file should investigate the mechanism before recommending a remedy.",
            "Analysts should avoid converting a descriptive category into an accusation. Marking a sign present is not equivalent to finding a treaty breach or assigning culpability. The evidence may support the former while leaving the latter contested. A legal conclusion requires the applicable rule, relevant facts, and a competent process; the index does not provide those elements on its own.",
            "The same restraint protects against treating an institution's failure as proof that an entire community is unreliable. Tripwires describe defined conditions in a relationship or process. They should not become generalized labels about identity groups or political constituencies. Reports should name the institution, conduct, or procedural condition at issue and avoid language that essentializes the actors.",
            "A well-constructed evidence note separates observation, classification, inference, and proposed response. For example, it can record that a scheduled body did not meet, classify the missed milestone under the relevant tripwire, note that the reason remains disputed, and propose independent verification. Each sentence then makes clear what is known and what remains a hypothesis.",
            "This layered approach is compatible with deterministic computation. The engine can compute a fixed output once the sign is marked, while the human record preserves the uncertainty and disagreement around the evidence. Determinism in the calculation should not be mistaken for certainty in the underlying political interpretation."
          ]
        },
        {
          title: "False positives, false negatives, and the cost of the register",
          paragraphs: [
            "Any early-warning system must consider both false positives and false negatives. A false positive occurs when a sign is marked present but the underlying condition is absent or misclassified; a false negative occurs when a genuine warning is missed or left unrecorded. The index does not estimate the statistical rates of either error. It applies the declared rule to the register it receives.",
            "False positives can impose real costs. An elevated band may require a verifier, an office-continuity covenant, or additional legal preparation; a critical band freezes the escrow. If the evidence is weak or the indicator ambiguous, those consequences may strain cooperation. The answer is not to weaken a weight informally, but to define the evidence standard, document the basis for marking, and permit a timely review.",
            "False negatives can be more dangerous because the system may remain quiet while a condition worsens. A standard register cannot cover every theatre-specific risk, and an item can be missed because observers lack access or because the relevant institution suppresses information. Custom indicators and independent sources can improve coverage, but they cannot eliminate uncertainty.",
            "The weight structure means a high-gravity tripwire can move the index more than a low-gravity one, but the weight is not a probability that the sign is true. It reflects doctrinal severity conditional on the sign being recorded. Analysts should not conflate high weight with high confidence, or low weight with low evidentiary quality.",
            "Confidence belongs in the evidence record. State whether a source is firsthand or secondhand, whether it can be corroborated, whether the same event appears in multiple reports, and whether those reports are independent. If the schema provides no confidence field, do not pretend that the index has one; retain the caveat in the accompanying note.",
            "Review procedures should be symmetric: a party should have a fair way to challenge a marked sign and an affected group should have a way to raise an omitted one. The point is not to let participants bargain over the arithmetic, but to ensure that the inputs reflect a defensible record before the deterministic consequences attach."
          ]
        },
        {
          title: "Bias in observation and safeguards for accountable scoring",
          paragraphs: [
            "Observers are not outside the political setting they measure. They may have unequal access to government and opposition sources, depend on local intermediaries, face safety constraints, or interpret the same conduct through different institutional assumptions. A standardized register helps structure attention, but it does not remove these sources of bias.",
            "Several practices can reduce avoidable inconsistency: train observers on the written definitions, record examples that satisfy or fail each indicator, use more than one reviewer for consequential classifications, and maintain a process for documenting disagreement. Where feasible, compare the account with independent monitoring reports and primary records rather than relying on one party's narrative.",
            "The bond assignment should also be explained. A missed budget commitment may implicate institutional continuity, but its consequences could also affect communal trust or intergenerational equity. The register assigns a sign to a defined bond so that the instrument can compute it; the analyst should state why that assignment is appropriate and whether a second effect is captured elsewhere.",
            "There is a risk of double counting when the same underlying event appears in multiple tripwires or custom indicators. Sometimes separate entries legitimately describe distinct consequences of one event. Sometimes duplication inflates the observed weight. The analyst should make the distinction explicit and avoid creating custom items that simply restate a standard sign.",
            "There is also a risk of omission when a category is difficult to observe. Interpersonal trust, for example, may not be visible in formal documents, while institutional procedures may be easy to count. The register's weights do not compensate for data access gaps. A quiet item may reflect lack of evidence rather than absence of the condition.",
            "The remedy is to treat the matrix as one evidentiary instrument within a broader monitoring design. Preserve diverse sources, make the limits of access visible, and solicit information from affected parties through safe channels. The numerical result remains the engine's output, but the credibility of that result depends on the fairness and quality of the observation process."
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
        },
        {
          title: "A second controlled register exercise",
          paragraphs: [
            "Return to the standard register with total weight 56, no inscribed load, and a static trend. First mark indicators whose weights total 19. The raw share is just under 34 and the displayed index is 34, so the band remains Guarded. Then add one weight-1 indicator, keeping every other input fixed. The resulting raw share is a little above 35.5 and rounds to 36, which enters Elevated.",
            "This is not a claim that the underlying relationship transformed instantaneously when a box was checked. It shows how the defined classification responds when the evidence record crosses a discrete boundary. The additional indicator may describe a condition that has developed over time; the register records the assessment at the moment the evidence is entered.",
            "Now hold the total weight present constant and add two custom indicators of weight 3, neither marked. The denominator becomes 62, and the same observed weight represents a smaller share. The index falls even though no existing warning sign was cleared. That result is a direct consequence of the expanded register and should be reported as such, not described as an improvement in the theatre.",
            "If the custom indicators are later marked present, their weights enter the numerator as well as the denominator. The new reading should be calculated from the full revised register. Comparing it with the original 56-weight reading without noting the changed instrument would be methodologically unsound.",
            "The exercise teaches two forms of discipline: record every indicator in the denominator whether or not it is present, and preserve the version of the register used to calculate each reading. These controls are essential for reproducibility when custom indicators are used.",
            "In a real case, the analyst should also justify why the custom indicators are needed and whether their addition duplicates an existing item. Numerical correctness is necessary but does not cure a poorly designed register."
          ]
        },
        {
          title: "Trend as a period comparison, not a second score of the same event",
          paragraphs: [
            "The trend multiplier is not another weight assigned to each tripwire. It is a period-level classification selected after comparing the register with the preceding period. The current share answers how much weighted warning is present; the trend indicates whether signs were added, remained materially unchanged, or were cleared during the review period.",
            "The distinction prevents a common double-counting error. If a new tripwire is marked present, its weight already increases the observed share. The deteriorating multiplier then reflects the separate fact that the period brought new signs. The model intentionally lets both dimensions affect the result, but the analyst must be able to support each with distinct evidence.",
            "Conversely, an indicator that remains present from one quarter to the next does not automatically justify an improving or deteriorating trend. The sign's continued presence contributes to the level; the period comparison determines direction. If there is no material addition or clearance, static is the defensible classification under the desk's stated method.",
            "An improving trend must be grounded in clearance, not simply in the existence of dialogue, a new communiqué, or a more conciliatory public statement. A sign should be marked cleared only when the evidence supports that status under the register's definition. If clearance is provisional, disputed, or not independently verified, retain the caveat and do not treat it as conclusive improvement.",
            "Trend selection can be vulnerable to political pressure because it shifts the whole reading. The report should therefore identify who selected it, the period compared, which signs changed, and what verification supports the classification. A transparent rationale makes it possible to review the input without negotiating over the arithmetic.",
            "The baseline and the trend should travel together in any handover. A number without its trend classification is not enough to reconstruct the index; a trend without the underlying register is not enough to understand it. Both are part of the declared state."
          ]
        },
        {
          title: "Reading a band transition alongside the four bond strains",
          paragraphs: [
            "The index summarizes the weighted register across all bonds, while bondStrain reports the proportion of warning weight present on each bond's own register. These are complementary views. A single overall band can conceal concentration, and a high strain on one bond can coexist with a lower aggregate if the other bonds remain comparatively quiet.",
            "In the practice example, weight 10 on the Communal bond yields a Communal strain of 67 while the overall rupture index is 18, Guarded. That combination is not contradictory. It says that the Communal register is heavily loaded relative to its own capacity while the total weighted register remains below the Elevated band.",
            "The operator should therefore avoid using the overall index as a substitute for the per-bond profile. A remedy aimed at a single concentrated strain may be more appropriate than a general response to the total; conversely, broadly distributed warning signs can justify action even if no one bond reaches an individual trap condition.",
            "The strain values are rounded percentages and should be read at the precision the engine publishes. Near a trap boundary, the exact classification depends on the specified comparison. An analyst should not round a value for narrative convenience and then infer that the trap has or has not engaged.",
            "A trap is a derived diagnostic, not an extra observed sign. It may help the drafting division identify a structural pattern, but only an active inscribed custom trap contributes to the index's inscribed load. Keeping these categories separate prevents the same evidence from entering the calculation twice by mistake.",
            "A complete desk note therefore pairs the overall index and band with the four strain readings, the status of any latent traps, and the separate inscribed load. That view makes both the level and the location of pressure visible."
          ]
        },
        {
          title: "The arithmetic of consequence and the limits of automation",
          paragraphs: [
            "The platform's strength is that a band can route a reading consistently across desks. A person cannot persuade the escrow to ignore a critical reading by citing the number of tranches already met, and a verifier's presence does not erase the freeze condition. Such consistency reduces the opportunity for ad hoc exceptions within the software workflow.",
            "Automatic routing is not the same as automatic legitimacy. A real institution must still determine whether the monitoring body is genuinely independent, whether a proposed continuity provision is legally sufficient, and whether a requested protective measure is within the mission's authority. The dashboard can require those tasks to be considered; it cannot complete them merely by displaying a lock.",
            "This distinction is particularly important at the provisional-measures marker. The Rupture Index threshold prompts the Legal Desk to draft a specified pleading head. It does not itself issue an order, create jurisdiction, or establish that a tribunal will grant relief. The pleading must still satisfy the procedural and legal requirements of the forum.",
            "Likewise, an escrow freeze is a state of the platform's waterfall, not a conclusion that money has been forfeited or that a party is legally in breach. The underlying tranches remain governed by their own conditions, and the chapter's own quiz explains that release recomputes when the rupture reading falls below the freeze boundary.",
            "A formal handover should therefore distinguish three layers: the numerical reading, the platform's derived consequence, and the legal or institutional action taken in response. Each layer should cite its own source. This helps prevent software behavior from being misrepresented as international law.",
            "The automation is best understood as an internal commitment mechanism. It constrains the operator's own workflow so that the mission cannot selectively ignore a reading. External actors remain governed by the legal instruments that bind them and by the competent institutions that interpret those instruments."
          ]
        },
        {
          title: "A complete citation-ready report",
          paragraphs: [
            "A citation-ready report begins by naming the observation date, the standard and custom register version, the total register weight, and the marked weight. It then identifies the inscribed shocks and active inscribed traps, the trend category and its period evidence, the resulting index and band, and the four strain readings.",
            "The report next states the threshold consequences that follow under the platform: whether the verifier and continuity requirements apply, whether the provisional-measures head is triggered, and whether the escrow is frozen. It distinguishes these internal workflow effects from any external legal action actually taken.",
            "The evidence record should link each marked indicator to its sources without exposing protected information unnecessarily. If sources conflict, say so. If an item is marked on indirect evidence, describe the basis and confidence in prose; do not imply that the index has an internal confidence estimate.",
            "The interpretation should also identify what did not enter the index. The mean bond and unmitigated exposure, for instance, are not part of the Rupture Index calculation, though they matter on other desks. State this boundary when a reader could otherwise confuse the related measurements.",
            "Where a historical comparison is made, cite the primary agreement or official report and label the comparison as qualitative. Do not assign retrospective coordinates or claim that the historical case would have crossed a specific band absent records supporting each input.",
            "Finally, record the responsible analyst and the review date. The next review should be able to reproduce the original state before entering new evidence. This turns the index from a one-time display into an auditable series while preserving the distinction between old observations and current conditions."
          ]
        },
        {
          title: "The register as a contract with the future analyst",
          paragraphs: [
            "A fixed register makes a promise to the next analyst: the same defined signs will be examined again, even if the person doing the review has changed. That continuity is valuable in a long mission, where staff rotation can otherwise reset institutional memory and make each new team retell the situation from scratch.",
            "The promise works only if definitions are sufficiently clear. Each indicator should be described in observable terms, with examples and non-examples where ambiguity is likely. An indicator that depends on a vague adjective invites different reviewers to produce different readings from the same evidence.",
            "Weighting should also be protected from outcome bias. If a crisis later becomes severe, an analyst may be tempted to argue that the earliest signs deserved a larger weight all along. If a warning proves benign, another may wish to reduce it retrospectively. Neither response is appropriate without a governed methodology revision, because it makes past readings impossible to compare fairly.",
            "A versioned register allows methodological improvement without erasing history. When a change is approved, document its rationale and describe how the revised register affects comparison. If a bridge series is needed, it should be labelled as an analytical exercise rather than as an engine output.",
            "This is similar to maintaining a measurement instrument in a longitudinal study. Definitions need to remain stable enough to support comparison, but the instrument may need revision when it systematically misses relevant conditions. Transparency about the version protects both continuity and improvement.",
            "The register is thus a commitment to disciplined attention across personnel and time. It does not guarantee that observers will see every sign, but it makes omissions, revisions, and disagreements more visible to those who inherit the file."
          ]
        },
        {
          title: "Why the trend multiplier cannot replace a time series",
          paragraphs: [
            "The three trend categories are compact summaries of a period-to-period comparison. They do not retain the full sequence of past readings. Two theatres can each be classified as deteriorating while having very different trajectories: one may show a sustained gradual increase, another a single recent cluster of new indicators after several quiet periods.",
            "The multiplier therefore should not be read as a velocity estimate in the statistical sense. It does not measure a rate of change per day, nor does it quantify the slope of a fitted time series. The word velocity in operational notes is a doctrinal metaphor for direction; the engine applies one of three fixed multipliers.",
            "Maintaining the underlying series permits more nuanced analysis without changing the canonical index. The analyst can examine when signs were added, how long they persisted, and whether clearances were followed by recurrence. Those descriptive questions may be important for research and planning, but they are not extra variables in the Rupture Index.",
            "The sequence also helps detect oscillation. If a trend is set improving one period and deteriorating the next, the operator should review the evidence and explain what changed rather than smooth the readings with an unofficial average. Smoothing could hide a threshold crossing and would introduce behavior that the canonical function does not define.",
            "Trend classification is consequently best supported by a comparison table that lists additions, clearances, and unchanged items for the review interval. The summary label can then be checked against the underlying record and challenged if necessary.",
            "A complete time series also helps a later researcher test whether the doctrine's categories were applied consistently. Without it, a final score may be reproducible from its current inputs but the path by which it was reached remains opaque."
          ]
        },
        {
          title: "The operator's burden when evidence is contested",
          paragraphs: [
            "A participant may dispute that a tripwire is present, argue that a source is unreliable, or claim that a condition was caused by the other party. The index does not settle those disputes. The operator's duty is to preserve the competing evidence and apply the agreed evidentiary procedure, not to let either party bargain directly over the resulting number.",
            "The distinction between input contest and arithmetic contest is useful in practice. If parties agree that a sign is present but challenge the displayed index, reproduce the arithmetic and inspect register weights, custom indicators, and rounding. If they disagree about the sign itself, the issue is evidentiary and must be handled through the source and review process.",
            "An independent verifier can reduce the influence of either party's self-report, but independence is not a magic word. Appointment, tenure, access, funding, conflicts of interest, methodology, and the publication of reasons all affect whether a monitor is credible. The corresponding desk can require a verifier to be seated; legal and institutional design must determine what seated means.",
            "The analyst should avoid making confidence judgments appear more objective than they are. If the record supports multiple plausible interpretations, state the range of views and the process used to choose the input. If the schema allows only a binary presence status, do not pretend that the score itself captures uncertainty.",
            "Where an error is discovered, correct the current record through the defined process and preserve the original entry with the correction history. Silent alteration undermines trust in the entire time series and makes it impossible to understand why a downstream consequence changed.",
            "These practices protect the model from being weaponized as a negotiating threat. A number should follow from documented evidence and a transparent rule, not from pressure to punish, reward, or discredit a party."
          ]
        },
        {
          title: "Synthesis: a warning system that remains accountable",
          paragraphs: [
            "A warning system is accountable when it can explain both what it counted and what it did not count. The Rupture Index offers a clear arithmetic pathway from a weighted register through inscribed load and trend to a bounded whole-number reading. Its transparency is valuable only if the underlying register and evidence can also be inspected.",
            "Its strongest contribution is procedural. It makes it harder for an operator to dismiss separate warnings one by one without recording their combined implication, and it ties defined bands to predictable actions across desks. It does not supply political will, field access, adequate resources, or the legitimacy of the institutions that carry out those actions.",
            "Its greatest risk is interpretive overreach. A composite score can be mistaken for a probability, a legal finding, a full description of a society, or a retrospective explanation of failure. Each of those claims requires evidence beyond the index.",
            "The discipline of this chapter is therefore two-sided: exactness about the engine and humility about inference. Preserve the equation, weights, constants, and downstream behavior as implemented; keep source claims grounded in the record; and state the boundaries of what the score can establish.",
            "In postgraduate use, the best answer is not merely the correct integer. It is the reproducible derivation, a faithful account of provenance, an explanation of the band consequences, and a careful statement about the political and legal questions the calculation leaves open.",
            "The Sentinel Matrix can make warning signs harder to ignore. Whether they are acted upon still depends on human institutions, their authority, their resources, and their willingness to meet the obligations they have undertaken."
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

export { CHAPTER_4_3 } from "./academyModuleIVChapter43";
