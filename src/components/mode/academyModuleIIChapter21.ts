import type { DetailedAcademyChapter } from "./academyTypes";
import {
  F_CASE_DISTANCE,
  F_LIEBIG,
  F_MEAN,
  F_RUPTURE,
  F_STATE_VECTOR,
  F_VARIANCE,
} from "./academyFormulas";

export const CHAPTER_2_1: DetailedAcademyChapter = {
  id: "division-1",
  number: "2.1",
  eyebrow: "Module II · Chapter 2.1",
  title: "Division I (Desks 01–04): Assessment and Early Warning",
  estimatedMinutes: 48,
  executiveLede: "Division I establishes the empirical, pre-negotiation baseline of relational health before political posturing or diplomatic bargaining can distort reality. By mapping the four-dimensional relational state vector across orthogonal bonds, computing variance and Liebig limiting floors, converting verified field tripwires into the weighted Rupture Index, stress-testing covenants against concurrent compound shocks, and evaluating live postures beside eight historical documented theatres, Division I anchors sovereign diplomacy in verifiable empirical measurement.",
  synopsis: [
    "Desk 01 (Diagnostics and Pattern Matching) accepts analyst scores across four relational bonds on an interval of 1.0 to 5.0, publishing the mean, population variance, Liebig limiting bond, relational standing, and the three nearest historical documented theatres via normalized Euclidean distance. It automatically trips the Façade Syndrome alarm when high variance masks acute sectoral vulnerability.",
    "Desk 02 (Sentinel Matrix, formally designated Desk 02 with The Eye of Humanity as its descriptive operational title) tracks observed field tripwires across all four bond axes, computes the weighted Rupture Index, tracks systemic trajectory multipliers, and identifies latent failure traps.",
    "Desk 03 (Compound Shock Simulator) applies concurrent exogenous shocks (currency collapse, sudden leadership transition, border confrontation, energy blockade) to model non-linear amplified strain and identify the first provision to fracture.",
    "Desk 04 (Comparative Mirror) positions live vectors against two or three historical precedent cases simultaneously, establishing historical context without treating resemblance as a deterministic forecast.",
    "Division I establishes the foundational signals on the MissionEngine bus, enforcing Stage Gate 1 (Vector Integrity) and Stage Gate 2 (Rupture Containment) before diplomatic engagement can proceed.",
  ],
  statutoryNotice: "Statutory Directive: Stage Gate 1 (Vector Integrity) holds locked until all four relational bonds sit strictly above the 3.0 viable floor. Stage Gate 2 (Rupture Containment) holds locked until the Rupture Index is computed and, if the reading reaches or exceeds the 35 per cent threshold, an accredited independent verifier is seated.",
  learningOutcomes: [
    "Operate Desk 01 to record the four-dimensional state vector and evaluate the Liebig limiting bond against the 3.0 statutory floor.",
    "Detect and isolate the Façade Syndrome when aggregate mean scores conceal critical institutional or communal collapse.",
    "Configure Desk 02 (The Eye of Humanity) to record field tripwires and determine the governing Rupture Index band (Stable, Guarded, Elevated, Critical).",
    "Model non-linear stress compounding on Desk 03 to identify vulnerable treaty covenants before exogenous shocks occur.",
    "Deploy Desk 04 to contextualize live tensions against historical documented settlements without falling into false historical equivalence.",
  ],
  sections: [
    {
      heading: "I. Desk 01: Diagnostics, Pattern Matching, and the Relational State Vector",
      subheading: "The Geometry of Bilateral Statehood and the Liebig Minimum",
      paragraphs: [
        "In traditional diplomatic analysis, the health of bilateral relationships is frequently expressed through high-level diplomatic narrative or scalar approximations such as gross bilateral trade figures or joint communiqués. These qualitative summaries routinely obscure acute systemic vulnerabilities. A relationship may boast thriving commercial exchange and polished diplomatic summits while community-level friction or generational alienation pushes the treaty structure toward imminent failure.",
        "Desk 01 replaces qualitative intuition with a formalized four-dimensional state vector: \\(B = (B_{\\text{interpersonal}}, B_{\\text{communal}}, B_{\\text{intergenerational}}, B_{\\text{institutional}})\\). Each coordinate is evaluated by field analysts in increments of 0.1 across a continuous domain from 1.0 (absolute failure) to 5.0 (fortified resilience). The operational state vector is partitioned into four statutory operational bands: Failing (1.0 to 2.0), Fragile (2.1 to 3.0), Viable (3.1 to 4.0), and Fortified (4.1 to 5.0).",
        "The desk computes the arithmetic mean \\(\\mu_{B}\\) to characterize overall relational volume, but its binding operational constraint is governed strictly by the Justus von Liebig Law of the Relational Minimum: \\(B_{\\min} = \\min(B_{\\text{interpersonal}}, B_{\\text{communal}}, B_{\\text{intergenerational}}, B_{\\text{institutional}})\\). The limiting bond dictates the load-bearing capacity of the entire bilateral relationship. High scores in secondary bonds cannot compensate for a primary bond trapped in the Failing or Fragile bands.",
        "Desk 01 continuously monitors the population variance \\(\\sigma_{B}^{2}\\) across the four coordinates. When the vector exhibits a high variance (\\(\\sigma_{B}^{2} \\ge 1.25\\)) where the strongest bond reaches or exceeds 4.0 while the weakest bond collapses to 2.0 or below, the desk raises the critical diagnostic flag: Façade Syndrome. This warning warns chancellery principals that an illusion of elite harmony or institutional formality is concealing acute communal or intergenerational fracture.",
      ],
      formulas: [F_STATE_VECTOR, F_MEAN, F_VARIANCE, F_LIEBIG, F_CASE_DISTANCE],
      caseStudy: {
        title: "The Collapse of the Oslo Accord Framework (1993–2000)",
        jurisdiction: "Middle Eastern Bilateral Peace Architecture",
        precedent: "Declaration of Principles on Interim Self-Government Arrangements",
        analysis: [
          "The Oslo Accords of 1993 established a sophisticated institutional framework between Israeli and Palestinian leadership, accompanied by intense interpersonal rapport among chief principals.",
          "On Desk 01, the post-1993 state vector exhibited classic Façade Syndrome: Interpersonal bonds (\\(B_{\\text{interpersonal}} = 4.1\\)) and Institutional mechanisms (\\(B_{\\text{institutional}} = 3.8\\)) appeared viable, but Communal resonance (\\(B_{\\text{communal}} = 1.7\\)) and Intergenerational continuity (\\(B_{\\text{intergenerational}} = 1.6\\)) remained critically fractured.",
          "The population variance \\(\\sigma_{B}^{2}\\) exceeded 1.30. Because elite diplomacy proceeded without repairing the communal and youth foundations, daily checkpoints, settlement expansion, and extremist violence rapidly degraded public legitimacy.",
          "When the Camp David Summit in July 2000 attempted to resolve permanent status issues, the structure suffered immediate catastrophic collapse, culminating in the outbreak of the Second Intifada.",
        ],
        failureMechanism: "Elite institutional diplomacy masked extreme communal and intergenerational alienation, triggering a Façade Syndrome collapse under summit pressure.",
      },
      subsections: [
        {
          title: "Euclidean Pattern Matching Against Canonical Precedents",
          paragraphs: [
            "Desk 01 evaluates the live state vector against eight canonical documented historical theatres preserved within the Chancellery reference library. It calculates the normalized Euclidean distance in four-space: \\(d = \\sqrt{\\sum_{i=1}^{4} (B_{i} - P_{i})^{2}}\\), where \\(P_{i}\\) denotes the documented coordinates of historical precedents.",
            "The desk automatically ranks the three nearest historical cases. This pattern matching provides immediate operational context, showing the analytical team whether the live mission shares topological characteristics with the Good Friday Agreement, the Dayton Accords, the Algiers Agreement, or the Treaty of Versailles.",
            "Crucially, Desk 01 treats the nearest cases as analytical mirrors rather than predictive templates. Precedent data informs scenario stress-testing but never predetermines live negotiation outcomes.",
          ],
          callout: {
            kind: "definition",
            title: "The Façade Syndrome Invariant",
            paragraphs: [
              "Façade Syndrome represents a severe diplomatic hazard wherein ceremonial head-of-state alignment masks existential societal decay. When \\(\\sigma_{B}^{2} \\ge 1.25\\) with \\(B_{\\max} \\ge 4.0\\) and \\(B_{\\min} \\le 2.0\\), Stage Gate 1 refuses clearance until targeted remediation covenants are introduced to elevate the limiting bond.",
            ],
          },
        },
      ],
      statutoryRule: "Rule 2.1-A: Documented case distance is diagnostic context, never a deterministic prescription. The limiting bond \\(B_{\\min}\\) governs the statutory clearance of Stage Gate 1.",
    },
    {
      heading: "II. Desk 02: Sentinel Matrix (The Eye of Humanity)",
      subheading: "Field Tripwires, Observation Multipliers, and the Rupture Index",
      paragraphs: [
        "Desk 02 serves as the primary early-warning instrument of the Chancellery apparatus. Formally titled Desk 02 (Sentinel Matrix) with 'The Eye of Humanity' serving as its operational descriptor, this desk translates verified field observations into an actionable, rule-based quantitative reading known as the Rupture Index \\(R\\).",
        "The desk monitors sixteen standardized field tripwires distributed across the four relational bond axes, spanning physical boundary harassment, hate-speech escalation, discriminatory administrative edicts, water rights disputes, and sudden military mobilizations. Field analysts record observed tripwires as active binary or weighted indicators, supplemented by custom local indicators assigned specific severity coefficients.",
        "The raw tripwire count is normalized against maximum potential severity and scaled by the observation trend multiplier \\(\\gamma\\), where \\(\\gamma = 1.0\\) indicates a stable trajectory, \\(\\gamma = 1.15\\) indicates an accelerating escalation, and \\(\\gamma = 0.85\\) indicates verifiable de-escalation: \\(R = \\text{clamp}((R_{\\text{base}} + \\Delta L) \\cdot \\gamma, 0, 100)\\).",
        "The resulting Rupture Index is categorized into four statutory warning bands: Stable (0 to 14 per cent), Guarded (15 to 34 per cent), Elevated (35 to 59 per cent), and Critical (60 to 100 per cent). Entry into each successive band enforces automated procedural safeguards across the MissionEngine signal bus.",
      ],
      formulas: [F_RUPTURE],
      caseStudy: {
        title: "The Rwandan Pre-Genocide Escalation Trajectory (1993–1994)",
        jurisdiction: "East African Great Lakes Region",
        precedent: "The Arusha Peace Accords and UNAMIR Deployment",
        analysis: [
          "Following the signing of the Arusha Accords in August 1993, external diplomatic observers asserted that Rwanda was progressing steadily toward constitutional power-sharing.",
          "A retrospective Desk 02 audit demonstrates that active tripwires across the Communal and Interpersonal bonds were multiplying rapidly: RTLM hate-radio broadcasts, the systematic importation of hundreds of thousands of machetes, and the compilation of assassination lists.",
          "By January 1994, when General Roméo Dallaire dispatched the famous 'Genocide Cable' alerting UN headquarters of informant disclosures regarding arms caches and extermination plans, the calculated Rupture Index stood in the Critical band at 78 per cent.",
          "Because the international community relied on political communiqués rather than systematic tripwire telemetry, early-warning signals were dismissed as political maneuvering, culminating in the April 1994 genocide.",
        ],
        failureMechanism: "Failure of international observers to aggregate verified field tripwires into an objective rupture index allowed elite political rhetoric to conceal imminent genocidal rupture.",
      },
      subsections: [
        {
          title: "Latent Traps and Verification Thresholds",
          paragraphs: [
            "Desk 02 continuously executes cross-bond correlation algorithms to identify latent traps: systemic vulnerabilities where two or more sub-critical tripwires interact to produce sudden catastrophic failure. Examples include the 'Resource-Identity Nexus' (where water scarcity triggers ethnic scapegoating) and the 'Succession Chokepoint' (where an ailing executive's inner circle forms unaccountable militias).",
            "When the Rupture Index breaches the 35 per cent threshold into the Elevated band, Statutory Directive 2.1-B activates immediately. The Chancellery Sentinel automatically locks Stage Gate 2 (Rupture Containment) until an accredited, independent verification mechanism is seated on Desk 16.",
            "If the Rupture Index breaches 60 per cent into the Critical band, the system engages an automated covenant freeze protocol: all pending escrow disbursements on Desk 07 are halted, and Desk 13 must automatically prepare emergency provisional-measures filings.",
          ],
          callout: {
            kind: "bridge",
            title: "Bridge to Desk 07 and Desk 16",
            paragraphs: [
              "The Rupture Index published by Desk 02 travels directly across the MissionEngine bus to Desk 07 (governing escrow account freeze conditions) and Desk 16 (mandating independent verifier seating before Stage Gate 2 can clear).",
            ],
          },
        },
      ],
      statutoryRule: "Rule 2.1-B: When the Rupture Index reaches or exceeds 35 per cent, Stage Gate 2 requires verified seating of an independent verification body before diplomatic texts may be finalized.",
    },
    {
      heading: "III. Desk 03: Compound Shock Simulation",
      subheading: "Non-Linear Stress Accumulation and Provision Fracture Testing",
      paragraphs: [
        "Treaties and international covenants rarely fail under isolated, single-variable stresses. Historic peace accords are typically engineered to withstand predictable friction within a single sector. Catastrophic treaty failure occurs when multiple distinct shocks strike concurrently, overwhelming systemic resilience through non-linear stress compounding.",
        "Desk 03 enables mission planners to apply multiple exogenous shocks simultaneously, selecting from standard chancellery stress profiles: hyperinflationary currency collapse, sudden assassination or succession crises, unilateral border militarization, cross-border refugee influxes, or critical infrastructure sabotage.",
        "Rather than simply summing the discrete strains, Desk 03 applies an exponential interaction penalty: \\(S_{\\text{total}} = (\\sum S_{k}) \\cdot (1 + 0.25 \\cdot (n - 1))\\), where \\(n\\) represents the number of concurrent shocks active in the simulation. This mathematical formulation accounts for institutional cognitive overload, bureaucratic paralysis, and resource exhaustion during compound crises.",
        "The desk cross-references the amplified compound strain against the drafted provisions, identifying the precise legal or operational clause that will fracture first under the simulated crisis load. Furthermore, when two or more concurrent shocks are activated, the Chancellery engine requires the mission to incorporate at least two fortified structural covenants on Desk 10 before Stage Gate 4 can pass.",
      ],
      caseStudy: {
        title: "The Breakdown of the Sun City Agreement in the DR Congo (2002–2003)",
        jurisdiction: "Central African Inter-Congolese Dialogue",
        precedent: "Global and Inclusive Agreement on Transition in DR Congo",
        analysis: [
          "The 2002 Sun City Agreement established a fragile transitional government in the Democratic Republic of the Congo, featuring a complex '1+4' executive structure (one president, four vice-presidents).",
          "In 2003, the agreement was subjected to simultaneous compound shocks: localized ethnic massacres in Ituri, delays in integrating opposing military factions into a unified national army, and sudden competition over illicit coltan and gold export corridors.",
          "On Desk 03, this compound stress profile generated an amplified strain index of 84 per cent. The simulator accurately highlights the first provision to break: Article V, governing unified military command structures.",
          "Because the peace architecture lacked self-executing contingency provisions or independent escrow insulation, localized military commanders resumed autonomous operations, perpetuating conflict in eastern Congo.",
        ],
        failureMechanism: "Concurrent military, commercial, and ethnic shocks compounded non-linearly, instantly overwhelming the uninsulated power-sharing provisions of the transitional accord.",
      },
      subsections: [
        {
          title: "Provision Fracture Ranking and Contingency Hardening",
          paragraphs: [
            "Desk 03 generates a provision fracture hierarchy, ranking every operative clause by its vulnerability to systemic shock. Vulnerability is a function of clause specificity, verification dependencies, and the underlying bond score supporting that sector.",
            "By identifying the first provision to break prior to mission finalization, Desk 03 enables legal drafters on Desk 10 to embed self-executing contingency triggers, dynamic dispute arbitration mechanisms, and automatic escrow freezes directly into the draft treaty.",
          ],
        },
      ],
      statutoryRule: "Rule 2.1-C: When two or more concurrent shocks are active in the threat model, Stage Gate 4 requires at least two independent structural covenants to insulate the accord.",
    },
    {
      heading: "IV. Desk 04: The Comparative Mirror",
      subheading: "Cross-Theatre Topology, Historical Resemblance, and Doctrinal Humility",
      paragraphs: [
        "Desk 04 provides comparative historical context by projecting the live mission's relational state vector alongside two or three historical settlements evaluated under the exact same four-bond metric.",
        "By comparing the live vector's topological profile against historical successes and failures, analysts can observe how specific structural imbalances played out across decades. For example, comparing a live Caspian maritime negotiation to the 1975 Algiers Accord or the 1920 Spitsbergen Treaty reveals how historical negotiators structured resource sharing and territorial sovereignty.",
        "Desk 04 enforces strict doctrinal humility: historical resemblance is an analytical mirror, never an automated forecast. The desk explicitly prohibits deterministic claims that a live negotiation 'will repeat' a historical outcome. Local historical idiosyncrasies, cultural nuance, and shifting geopolitical realities ensure that every sovereign covenant remains unique.",
      ],
      caseStudy: {
        title: "The 1975 Algiers Accord on the Shatt al-Arab Waterway",
        jurisdiction: "Bilateral Boundary Dispute (Iran–Iraq)",
        precedent: "Treaty on the State Frontier and Neighbourly Relations",
        analysis: [
          "The 1975 Algiers Accord resolved border disputes over the Shatt al-Arab waterway by adopting the thalweg principle (the median navigable channel) in exchange for Iran ceasing support to Kurdish rebels in northern Iraq.",
          "Evaluated on Desk 04, the 1975 accord exhibited high Institutional formality (\\(B_{\\text{institutional}} = 4.4\\)) and momentary Interpersonal alignment between the Shah and Saddam Hussein (\\(B_{\\text{interpersonal}} = 3.9\\)). However, the Intergenerational bond was acutely fragile (\\(B_{\\text{intergenerational}} = 1.9\\)), relying entirely on the personal tenure of the two autocratic leaders.",
          "When the Iranian Revolution of 1979 altered Tehran's governance structure, Iraq unilaterally abrogated the treaty in September 1980, citing fundamental change of circumstances and initiating the eight-year Iran–Iraq War.",
          "Desk 04 demonstrates that treaties lacking intergenerational insulation and institutionalized dispute arbitration rarely survive regime transitions.",
        ],
        failureMechanism: "The accord relied exclusively on autocratic personal alignment, leaving the border regime defenseless against the shock of domestic regime transition.",
      },
      subsections: [
        {
          title: "Multi-Axis Radar Comparison and Topological Drift",
          paragraphs: [
            "Desk 04 renders comparative multi-axis overlays, allowing negotiators to visually track topological drift between the live theatre and reference cases.",
            "This visualization assists delegations in recognizing structural blind spots, demonstrating how accords that neglect communal reconciliation inevitably suffer from long-term boundary erosion.",
          ],
        },
      ],
      statutoryRule: "Rule 2.1-D: Comparative precedent data serves strictly as contextual reference. No historical parallel may be cited to bypass live empirical verification.",
    },
  ],
  quiz: [
    {
      id: "q2-1-1",
      question: "What is the primary operational objective of Desk 02 (Sentinel Matrix, The Eye of Humanity)?",
      options: [
        {
          id: "opt-2-1-1a",
          text: "To execute continuous automated electronic surveillance over foreign diplomatic channels.",
          explanation: "Incorrect. The UDCA is an analytical chancellery apparatus; it does not perform covert electronic surveillance.",
          correct: false,
        },
        {
          id: "opt-2-1-1b",
          text: "To aggregate verified field tripwires across the four bonds into the weighted Rupture Index and identify latent failure traps.",
          explanation: "Correct. Desk 02 serves as the rule-based early-warning engine, translating observed field indicators into an objective Rupture Index and enforcing verifier seating when \\(R \\ge 35\\%\\).",
          correct: true,
        },
        {
          id: "opt-2-1-1c",
          text: "To automatically draft press statements explaining relational friction to domestic media outlets.",
          explanation: "Incorrect. The desk generates internal analytical telemetry, not public media releases.",
          correct: false,
        },
        {
          id: "opt-2-1-1d",
          text: "To compute currency exchange tariffs for cross-border commercial transactions.",
          explanation: "Incorrect. Economic tariffs fall outside the scope of chancellery early warning.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-1-2",
      question: "A live mission state vector evaluates to: Interpersonal = 4.8, Communal = 4.2, Intergenerational = 4.0, Institutional = 1.8. What governing reading does Desk 01 issue?",
      options: [
        {
          id: "opt-2-1-2a",
          text: "A Fortified rating, because the arithmetic mean is 3.7.",
          explanation: "Incorrect. The arithmetic mean characterizes relational volume but is strictly bounded by the Liebig minimum.",
          correct: false,
        },
        {
          id: "opt-2-1-2b",
          text: "A Failing limiting bond rating of 1.8 (Institutional), triggering the Façade Syndrome alarm due to high variance masking structural vulnerability.",
          explanation: "Correct. Under the Liebig Law of the Relational Minimum, the weakest bond (1.8) governs the relationship's load-bearing capacity. Because variance is high and \\(B_{\\max} \\ge 4.0\\) while \\(B_{\\min} \\le 2.0\\), Façade Syndrome is confirmed.",
          correct: true,
        },
        {
          id: "opt-2-1-2c",
          text: "An immediate clearance of Stage Gate 1, because three out of four bonds exceed the 3.0 floor.",
          explanation: "Incorrect. Stage Gate 1 mandates that ALL four bonds sit above the 3.0 statutory floor.",
          correct: false,
        },
        {
          id: "opt-2-1-2d",
          text: "A recommendation to disregard the institutional coordinate in favour of high interpersonal rapport.",
          explanation: "Incorrect. The four relational bonds are mutually non-substitutable.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-1-3",
      question: "When the Rupture Index on Desk 02 reaches or breaches the 35 per cent threshold, what statutory requirement is enforced?",
      options: [
        {
          id: "opt-2-1-3a",
          text: "All diplomatic talks must be permanently abandoned.",
          explanation: "Incorrect. The system enforces structural safeguards, not the abandonment of engagement.",
          correct: false,
        },
        {
          id: "opt-2-1-3b",
          text: "Stage Gate 2 (Rupture Containment) locks until an accredited independent verifier is seated on Desk 16.",
          explanation: "Correct. Statutory Rule 2.1-B mandates independent verification whenever the Rupture Index enters the Elevated band (35 to 59 per cent).",
          correct: true,
        },
        {
          id: "opt-2-1-3c",
          text: "The escrow account on Desk 07 is permanently forfeited to the host state.",
          explanation: "Incorrect. Escrow forfeiture is not triggered by the 35 per cent early-warning threshold.",
          correct: false,
        },
        {
          id: "opt-2-1-3d",
          text: "The state vector is automatically reset to default coordinates.",
          explanation: "Incorrect. Telemetry is never altered or deleted automatically.",
          correct: false,
        },
      ],
    },
  ],
  practice: [
    {
      problem: "An analyst records a four-bond vector of (4.4, 3.8, 1.9, 4.1). Calculate the arithmetic mean, the population variance, identify the Liebig limiting bond, determine whether Façade Syndrome is present, and state the status of Stage Gate 1.",
      solution: [
        "1. Arithmetic Mean: \\(\\mu_{B} = \\frac{4.4 + 3.8 + 1.9 + 4.1}{4} = \\frac{14.2}{4} = 3.55\\).",
        "2. Deviations from mean: (4.4 - 3.55 = +0.85), (3.8 - 3.55 = +0.25), (1.9 - 3.55 = -1.65), (4.1 - 3.55 = +0.55).",
        "3. Squared deviations: \\(0.85^{2} = 0.7225\\), \\(0.25^{2} = 0.0625\\), \\((-1.65)^{2} = 2.7225\\), \\(0.55^{2} = 0.3025\\).",
        "4. Sum of squared deviations: \\(0.7225 + 0.0625 + 2.7225 + 0.3025 = 3.8100\\).",
        "5. Population Variance: \\(\\sigma_{B}^{2} = \\frac{3.81}{4} = 0.9525\\).",
        "6. Liebig Limiting Bond: \\(B_{\\min} = 1.9\\) (Intergenerational Bond), placing it in the Failing band (1.0 to 2.0).",
        "7. Façade Syndrome Assessment: While \\(B_{\\max} = 4.4 \\ge 4.0\\) and \\(B_{\\min} = 1.9 \\le 2.0\\), the population variance \\(\\sigma_{B}^{2} = 0.9525\\) sits below the 1.25 threshold. Thus, Façade Syndrome is technically avoided, but the vector exhibits extreme sectoral fragility.",
        "8. Stage Gate 1 Status: LOCKED. Stage Gate 1 requires all four bonds to exceed 3.0. Because the Intergenerational bond sits at 1.9, the gate holds locked until structural remediation occurs.",
      ],
    },
  ],
  readingList: [
    {
      citation: "Justus von Liebig, Familiar Letters on Chemistry and Its Relation to Commerce, Physiology, and Agriculture (London: Taylor & Walton, 1843).",
      note: "Foundational articulation of the Law of the Minimum, adapted into sovereign relational statecraft by the Vinculum Doctrine.",
    },
    {
      citation: "Roméo Dallaire, Shake Hands with the Devil: The Failure of Humanity in Rwanda (Toronto: Random House Canada, 2003).",
      note: "Field examination of unheeded early-warning tripwires and the tragic consequences of political complacency.",
    },
    {
      citation: "E. Allan Lind and Tom R. Tyler, The Social Psychology of Procedural Justice (New York: Springer Science & Business Media, 1988).",
      note: "Theoretical grounding for relational diagnostics versus purely transactional legal bargaining.",
    },
  ],
};
