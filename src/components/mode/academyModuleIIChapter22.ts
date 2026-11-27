import type { DetailedAcademyChapter } from "./academyTypes";
import {
  F_CONTAGION,
  F_DEFICIT,
  F_ESCROW_CHAIN,
  F_ESCROW_CONSERVATION,
  F_ESCROW_RELEASE,
  F_FRICTION,
  F_TRACK,
} from "./academyFormulas";

export const CHAPTER_2_2: DetailedAcademyChapter = {
  id: "division-2",
  number: "2.2",
  eyebrow: "Module II · Chapter 2.2",
  title: "Division II (Desks 05–09): Diplomatic Engagement",
  estimatedMinutes: 52,
  executiveLede: "Division II transforms empirical baseline assessments into disciplined diplomatic engagement. By generating formal, unvarnished chancellery memoranda, structuring non-leading counterpart examination scripts, computing inter-party friction coefficients and spoiler-coalition alerts, managing the conditional multi-tranche escrow waterfall, synchronizing Track I elite diplomacy with Track II communal progress, and executing mandatory stakeholder safeguard audits, Division II prevents diplomatic capture and elite-pact mirages.",
  synopsis: [
    "Desk 05 (Briefing Desk) automatically compiles structured chancellery memoranda directly from MissionEngine telemetry, incorporating handling caveats, formal problem statements, and the limiting bond reading.",
    "Desk 06 (Counterpart Prompter) structures bilateral and multilateral negotiation sessions phase by phase, enforcing non-leading questioning protocols, tracking counterpart tactics from live custom notes, and providing scripted responses to counterpart stalls without inferring unverified answers.",
    "Desk 07 (De-confliction Bench) seats delegations, calculates pairwise friction coefficients \\(f_{ij}\\) from tolerance divergence, monitors spoiler-coalition contagion, governs the three statutory resource allocation heads (restitution, corridor, demarcation), and administers the four-tranche Conditional Escrow Waterfall.",
    "Desk 08 (Track Sequencing) enforces synchronization between high-level Track I diplomacy and communal Track II progress, applying the Communal Bond tolerance threshold to prevent the dangerous Elite-Pact Mirage.",
    "Desk 09 (Field Audit) conducts rigorous stakeholder safeguard audits, verifying whether affected local communities have been directly consulted and documented.",
  ],
  statutoryNotice: "Diagnostic Axiom: An accord signed above the communities it governs looks like peace and behaves like a ceasefire. Stage Gate 3 (Track Synchronization) holds locked whenever Track I leads Track II beyond the statutory communal tolerance window.",
  learningOutcomes: [
    "Assemble standardized Chancellery Briefing Memoranda on Desk 05 without introducing unverified narrative assumptions.",
    "Conduct structured, non-leading diplomatic examinations on Desk 06 using verified prompt sequences.",
    "Calculate pairwise friction coefficients \\(f_{ij}\\) and spoiler-coalition contagion risks on Desk 07.",
    "Configure the Conditional Escrow Waterfall across its four statutory tranches, verifying self-executing release conditions.",
    "Enforce Track Sequencing rules on Desk 08 to prevent the emergence of an Elite-Pact Mirage.",
    "Execute comprehensive stakeholder safeguard audits on Desk 09 across affected borderland populations.",
  ],
  sections: [
    {
      heading: "I. Desk 05 & Desk 06: Briefing Architecture and Examination Discipline",
      subheading: "From Empirical Vector to Chancellery Script",
      paragraphs: [
        "Diplomatic memoranda are notoriously vulnerable to political tailoring, selective filtering, and bureaucratic sanitization. When diplomats filter bad news to appease political superiors, strategic blunders become inevitable. Desk 05 (Briefing Desk) removes this vulnerability by assembling formal Chancellery Memoranda deterministically from verified MissionEngine telemetry.",
        "The briefing engine ingests the four-bond vector from Desk 01, the active Rupture Index from Desk 02, and the compound stress profile from Desk 03. It populates standardized chancellery sections: Operational Precedence, Handling Caveat, Sovereign Relational Posture, Governing Limiting Bond, and Doctrinal Mandates. The analyst selects the target jurisdiction and problem statement, but the core analytical findings cannot be edited or softened.",
        "Desk 06 (Counterpart Prompter) structures the physical negotiation room. Sovereign negotiations frequently falter because delegations employ evasive rhetoric, intentional obfuscation, or bad-faith stalling tactics. Desk 06 equips the chancellery negotiator with phase-by-phase ordered examination scripts designed to establish factual baselines without asking leading questions.",
        "Crucially, Desk 06 treats every custom script line as an ordered, non-negotiable inquiry. Counterpart tactics are mapped from live mission notes. When a counterpart engages in deliberate stalling (e.g., claiming lack of domestic mandate, contesting baseline definitions, or introducing irrelevant historical grievances), the operator logs the condition, and Desk 06 surfaces the corresponding procedural counter-inquiry. Desk 06 never infers answers, never advances phases automatically, and never clears stage gates on speculative optimism.",
      ],
      caseStudy: {
        title: "The Rambouillet Negotiations on Kosovo (February 1999)",
        jurisdiction: "Balkans Contact Group Diplomacy",
        precedent: "Interim Agreement for Peace and Self-Government in Kosovo",
        analysis: [
          "During the February 1999 Rambouillet conference, international mediators sought an end to armed conflict between the Federal Republic of Yugoslavia and the Kosovo Liberation Army.",
          "The negotiation lacked structured, neutral examination architecture. International drafters introduced non-negotiable military appendices (Appendix B, granting NATO forces unimpeded access throughout Yugoslavia) late in the process without structured phase verification.",
          "On Desk 06, the Yugoslav delegation's tactical stalls regarding constitutional sovereignty were met with coercive ultimatums rather than disciplined, step-by-step counter-inquiries.",
          "The diplomatic breakdown led directly to the failure of the conference and the subsequent 78-day NATO bombing campaign against Yugoslavia.",
        ],
        failureMechanism: "Divergent negotiation scripts and coercive ultimatums replaced structured factual examination, causing terminal diplomatic breakdown.",
      },
      subsections: [
        {
          title: "The Doctrine of Non-Leading Examination",
          paragraphs: [
            "In relational statecraft, a leading question ('Do you agree that border stability requires immediate joint patrols?') invites diplomatic equivocation or bad-faith compliance.",
            "Desk 06 enforces neutral, boundary-defining inquiries ('What specific operational mandate will your military forces execute in Sector 4 during Phase II?'). This methodology forces counterparts to articulate concrete commitments, exposing operational gaps before treaties are signed.",
          ],
        },
      ],
      statutoryRule: "Rule 2.2-A: Desk 05 briefings derive strictly from verified telemetry. Desk 06 prompt sequences never infer unstated counterpart concessions.",
    },
    {
      heading: "II. Desk 07: De-confliction Bench, Friction, and the Escrow Waterfall",
      subheading: "Seating Delegations, Spatial Friction, and Capital Insulation",
      paragraphs: [
        "Desk 07 (De-confliction Bench) manages the operational mechanics of the physical meeting room, calculating interpersonal and ideological friction between seated delegations and administering financial escrow architecture.",
        "When multilateral delegations are seated, Desk 07 computes the pairwise friction coefficient \\(f_{ij}\\) between any two parties: \\(f_{ij} = \\frac{1}{2} \\sum_{k=1}^{4} |T_{ik} - T_{jk}| \\cdot w_{k}\\), where \\(T\\) represents each delegation's verified tolerance vector across the four bonds, and \\(w_{k}\\) represents dimensional importance weights.",
        "When two or more high-friction pairs operate concurrently while the Rupture Index reaches or exceeds 35 per cent, or when an Elite-Pact alert is active, Desk 07 flags a critical 'Spoiler-Coalition Contagion'. This warning alerts the chancellery that opposing fringe delegations are coordinating to sabotage the primary negotiation track.",
        "Desk 07 also governs the three statutory resource allocation heads: Community Restitution Trust, Cross-Border Corridor Infrastructure, and Joint Demarcation & Monitoring. To prevent predatory elite appropriation, Statutory Directive 2.2-B mandates that the Community Restitution Trust receive at least 30 per cent of total allocated capital. Any lower allocation automatically trips a Legitimacy Deficit Alert.",
      ],
      formulas: [F_FRICTION, F_CONTAGION, F_DEFICIT, F_ESCROW_CHAIN, F_ESCROW_CONSERVATION, F_ESCROW_RELEASE],
      caseStudy: {
        title: "The Lusaka Protocol Implementation in Angola (1994–1998)",
        jurisdiction: "Southern African Civil Conflict (MPLA–UNITA)",
        precedent: "The Lusaka Protocol and UNAVEM III Mandate",
        analysis: [
          "The 1994 Lusaka Protocol sought to conclude the Angolan civil war by integrating UNITA into a government of national unity and demobilizing its armed forces.",
          "On Desk 07, the friction coefficient \\(f_{ij}\\) between President José Eduardo dos Santos and Jonas Savimbi exceeded 0.85, accompanied by intense spoiler-coalition contagion in diamond-mining regions.",
          "Critically, international donors distributed demobilization funds without establishing a conditional, multi-tranche escrow waterfall. Diamond revenues and oil concessions were captured by political elites, while local communities received zero restitution.",
          "Savimbi secretly rearmed UNITA with illicit diamond revenue, and by late 1998 the peace process dissolved into full-scale conventional warfare.",
        ],
        failureMechanism: "Unconditional financial disbursements without escrow holdbacks allowed spoilers to rearm while communities remained impoverished.",
      },
      subsections: [
        {
          title: "The Four-Tranche Conditional Escrow Waterfall",
          paragraphs: [
            "The Conditional Escrow Waterfall on Desk 07 solves the fundamental commitment problem in sovereign peacemaking: neither party trusts the other to fulfill future promises once concessions are delivered.",
            "Escrow capital is partitioned into four distinct, self-executing tranches: Tranche 1 (Mobilization, 15 per cent, released upon treaty signing and seating of verifiers); Tranche 2 (Demarcation, 25 per cent, released upon verified border or cantonment verification); Tranche 3 (Communal Parity, 35 per cent, released only when Track II communal milestones are certified); and Tranche 4 (Succession Endowment, 25 per cent, held until peaceful institutional succession occurs).",
            "The Escrow Waterfall is fully automated: if the Rupture Index breaches 60 per cent into the Critical band, the entire escrow account is instantly frozen, preventing the misuse of sovereign funds during an active breach.",
          ],
          callout: {
            kind: "definition",
            title: "Escrow Conservation Law",
            paragraphs: [
              "Total allocated capital \\(C_{\\text{total}}\\) must strictly equal the sum of released capital, held capital, and penalty forfeitures: \\(C_{\\text{total}} = C_{\\text{released}} + C_{\\text{held}} + C_{\\text{forfeited}}\\). No discretionary transfers or unverified capital leakages are permitted by the engine.",
            ],
          },
        },
      ],
      statutoryRule: "Rule 2.2-B: Community Restitution must constitute at least 30 per cent of total resource allocation. A breach of 60 per cent on the Rupture Index automatically freezes all escrow disbursements.",
    },
    {
      heading: "III. Desk 08: Track Sequencing and the Elite-Pact Mirage",
      subheading: "Harmonizing Principal Diplomacy with Communal Reconciliation",
      paragraphs: [
        "A chronic flaw in international peacemaking is the 'Elite-Pact Mirage': a condition where political, military, and diplomatic principals sign polished peace treaties in luxury conference centers, while on the ground, their respective communities remain locked in intense hatred, fear, and economic boycotts.",
        "Desk 08 (Track Sequencing) formalizes and monitors the progression of diplomacy across two concurrent tracks: Track I (Official Principals: political elites, cabinet ministers, commanding generals) and Track II (Communal Pillars: traditional leaders, women's associations, regional civil society, merchant networks).",
        "The desk computes the operational lead: \\(\\Delta_{\\text{track}} = \\text{Phase}(\\text{Track I}) - \\text{Phase}(\\text{Track II})\\). It enforces a strict tolerance threshold governed by the Communal Bond score \\(B_{\\text{communal}}\\) established on Desk 01:",
        "1. Failing Communal Bond (1.0 to 2.0): Tolerated lead is exactly 0 phases. Track I cannot advance to a new phase until Track II has successfully closed that phase.",
        "2. Fragile Communal Bond (2.1 to 3.0): Tolerated lead is 1 phase.",
        "3. Viable or Fortified Communal Bond (3.1 to 5.0): Tolerated lead is at most 2 phases.",
        "Whenever Track I exceeds the tolerated communal lead, Desk 08 automatically fires the Elite-Pact Mirage Alert. Stage Gate 3 (Track Synchronization) locks immediately, and Escrow Tranche 3 (Communal Parity) is suspended until communal milestones are achieved.",
      ],
      formulas: [F_TRACK],
      caseStudy: {
        title: "The Good Friday Agreement Track Harmonization (1998)",
        jurisdiction: "Northern Ireland Multi-Party Constitutional Settlement",
        precedent: "The Belfast (Good Friday) Agreement",
        analysis: [
          "The negotiation of the 1998 Good Friday Agreement succeeded precisely because negotiators avoided an Elite-Pact Mirage by synchronizing Track I and Track II.",
          "While political leaders (Tony Blair, Bertie Ahern, David Trimble, Gerry Adams) engaged in Track I constitutional negotiations, Track II civic bodies, community forums, and victims' groups were systematically engaged.",
          "When the agreement was finalized, it was subjected to concurrent public referendums in both Northern Ireland (71.1 per cent approval) and the Republic of Ireland (94.4 per cent approval).",
          "On Desk 08, the track differential \\(\\Delta_{\\text{track}}\\) remained exactly 0 throughout ratification, ensuring that communal legitimacy directly anchored the constitutional compromise.",
        ],
        failureMechanism: "Synchronized dual-track diplomacy ensured that elite constitutional bargains were legitimate at the grassroots communal level.",
      },
      subsections: [
        {
          title: "The Mechanics of Track Resynchronization",
          paragraphs: [
            "When an Elite-Pact Mirage alert is triggered, chancellery diplomats must suspend formal Track I text drafting and redirect negotiation resources to Track II local assemblies.",
            "Resynchronization requires verifiable civic town halls, cross-line commercial reopening, or verified prisoner amnesties before Track I may resume.",
          ],
        },
      ],
      statutoryRule: "Rule 2.2-C: Track I lead over Track II must not exceed the tolerance defined by the Communal Bond. Stage Gate 3 refuses clearance while an Elite-Pact alert is active.",
    },
    {
      heading: "IV. Desk 09: Field Audit and Stakeholder Safeguards",
      subheading: "Empirical Verification of Human and Environmental Protection",
      paragraphs: [
        "The final instrument of Division II is Desk 09 (Field Audit). Sovereign agreements routinely contain sweeping declarations regarding human rights, minority safeguards, and environmental protection that are never audited in practice.",
        "Desk 09 systematically tracks three mandatory safeguard criteria for every affected stakeholder group (e.g., indigenous populations, borderland pastoralists, displaced persons, minority linguistic communities):",
        "1. Direct Evidentiary Review: Verifiable field documentation of local land, water, and security conditions.",
        "2. Direct Consultation: Independent, documented oral hearings where community representatives testify without state security intimidation.",
        "3. Independent Verification: Formal corroboration of field conditions by an accredited international or civil society monitor.",
        "Desk 09 maintains a live audit ledger: completion of an audit step does not constitute substantive approval or legal certification. It records an empirical fact: that an audit was conducted. By separating field audit tracking from diplomatic advocacy, Desk 09 ensures that vulnerable populations cannot be quietly negotiated away behind closed chancellery doors.",
      ],
      caseStudy: {
        title: "The Colombia Peace Accord Land Restitution Field Audits (2016)",
        jurisdiction: "South American Internal Armed Conflict (FARC-EP)",
        precedent: "Final Agreement for Ending the Conflict and Building a Stable and Lasting Peace",
        analysis: [
          "Chapter 1 of the 2016 Havana Peace Accord mandated comprehensive rural reform and land restitution to campesino and Afro-Colombian communities displaced by decades of civil war.",
          "On Desk 09, initial field audits revealed a catastrophic deficit: while elite demobilization proceeded, land restitution tribunals lacked judicial personnel, demining was incomplete, and local social leaders faced targeted assassinations by neo-paramilitary cartels.",
          "By publishing unvarnished field audit telemetry, Desk 09 instruments in Colombia exposed that while the national state proclaimed historic peace, local community safeguards were breached in 65 per cent of rural municipalities.",
          "This objective tracking forced international guarantors (Norway, Cuba, UN Verification Mission) to condition diplomatic milestones on rural protection.",
        ],
        failureMechanism: "Empirical field audits revealed that national disarmament declarations masked acute local insecurity, forcing remediation.",
      },
      subsections: [
        {
          title: "Audit Completeness vs Legal Certification",
          paragraphs: [
            "A frequent error among junior chancellery officers is conflating audit completion with substantive compliance. Desk 09 explicitly records procedural completion: whether the mandated inspection took place.",
            "Substantive compliance is evaluated exclusively by Stage Gate 3 and the Verification Ledger on Desk 16. Desk 09 preserves the integrity of raw field evidence.",
          ],
        },
      ],
      statutoryRule: "Rule 2.2-D: Field audit records document procedural completion, not political certification. No safeguard check may be waived by executive discretion.",
    },
  ],
  quiz: [
    {
      id: "q2-2-1",
      question: "The Communal Bond score on Desk 01 reads 2.4 (Fragile), and Track I diplomacy has advanced three phases while Track II has completed only one phase (lead = 2). How does the Chancellery engine respond?",
      options: [
        {
          id: "opt-2-2-1a",
          text: "It permits the negotiation to continue because a two-phase lead is universally acceptable.",
          explanation: "Incorrect. A two-phase lead is tolerated only when the Communal bond sits in the Viable or Fortified bands (3.1 to 5.0).",
          correct: false,
        },
        {
          id: "opt-2-2-1b",
          text: "It triggers the Elite-Pact Mirage Alert, locks Stage Gate 3 (Track Synchronization), and suspends Escrow Tranche 3.",
          explanation: "Correct. For a Fragile Communal bond (2.1 to 3.0), the maximum tolerated lead is exactly 1 phase. A lead of 2 phases breaches tolerance, triggering the Elite-Pact Mirage alert and locking Stage Gate 3.",
          correct: true,
        },
        {
          id: "opt-2-2-1c",
          text: "It automatically reduces the scores of all other bonds on Desk 01.",
          explanation: "Incorrect. Desks do not automatically overwrite inputs on preceding desks.",
          correct: false,
        },
        {
          id: "opt-2-2-1d",
          text: "It immediately forfeits the entire escrow balance to the host mediator.",
          explanation: "Incorrect. Escrow is frozen or held, not forfeited to the mediator.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-2-2",
      question: "Under Statutory Directive 2.2-B, what minimum proportion of total resource allocation must be assigned to the Community Restitution Trust?",
      options: [
        {
          id: "opt-2-2-2a",
          text: "10 per cent.",
          explanation: "Incorrect. 10 per cent is insufficient and triggers a legitimacy deficit alert.",
          correct: false,
        },
        {
          id: "opt-2-2-2b",
          text: "20 per cent.",
          explanation: "Incorrect. 20 per cent falls below the statutory threshold.",
          correct: false,
        },
        {
          id: "opt-2-2-2c",
          text: "30 per cent.",
          explanation: "Correct. The Community Restitution Trust must receive at least 30 per cent of allocated resources to prevent elite capture.",
          correct: true,
        },
        {
          id: "opt-2-2-2d",
          text: "50 per cent.",
          explanation: "Incorrect. While 50 per cent is commendable, the minimum statutory requirement is 30 per cent.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-2-3",
      question: "What immediate event occurs within the Conditional Escrow Waterfall if the Rupture Index breaches 60 per cent (Critical band)?",
      options: [
        {
          id: "opt-2-2-3a",
          text: "Tranche 4 is released immediately to pacify the parties.",
          explanation: "Incorrect. Releasing funds during a critical crisis rewards aggression and violates escrow conservation.",
          correct: false,
        },
        {
          id: "opt-2-2-3b",
          text: "The entire escrow account is automatically frozen across all tranches.",
          explanation: "Correct. A Rupture Index of 60 per cent or greater triggers an automated, self-executing freeze across the entire escrow account.",
          correct: true,
        },
        {
          id: "opt-2-2-3c",
          text: "The dispute is automatically referred to an administrative tribunal.",
          explanation: "Incorrect. Referral to arbitration is managed on Desk 11 and Desk 13, not by the escrow engine.",
          correct: false,
        },
        {
          id: "opt-2-2-3d",
          text: "Escrow funds are converted into non-voting sovereign debt bonds.",
          explanation: "Incorrect. The Chancellery does not convert escrow funds into debt instruments.",
          correct: false,
        },
      ],
    },
  ],
  practice: [
    {
      problem: "A sovereign negotiation seats two delegations with tolerance vectors of (3.0, 4.0, 2.0, 5.0) and (1.0, 2.0, 4.0, 3.0) with equal dimensional weights \\(w_{k} = 0.25\\). Calculate the pairwise friction coefficient \\(f_{ij}\\). If the Rupture Index is 42 per cent, evaluate whether a Spoiler-Coalition Contagion warning is active.",
      solution: [
        "1. Compute absolute differences across coordinates:",
        "   - Coordinate 1: |3.0 - 1.0| = 2.0",
        "   - Coordinate 2: |4.0 - 2.0| = 2.0",
        "   - Coordinate 3: |2.0 - 4.0| = 2.0",
        "   - Coordinate 4: |5.0 - 3.0| = 2.0",
        "2. Apply weights \\(w_{k} = 0.25\\):",
        "   - \\(\\sum |T_{ik} - T_{jk}| \\cdot w_{k} = (2.0 \\cdot 0.25) + (2.0 \\cdot 0.25) + (2.0 \\cdot 0.25) + (2.0 \\cdot 0.25) = 0.5 + 0.5 + 0.5 + 0.5 = 2.0\\).",
        "3. Pairwise Friction Coefficient: \\(f_{ij} = \\frac{1}{2} (2.0) = 1.00\\). This represents maximum friction.",
        "4. Evaluate Spoiler Contagion: The Rupture Index is 42 per cent, which sits in the Elevated band (\\(R \\ge 35\\%\\)). If two or more pairs exhibit this high-friction profile, Desk 07 immediately triggers the Spoiler-Coalition Contagion warning.",
      ],
    },
  ],
  readingList: [
    {
      citation: "Harold H. Saunders, A Public Peace Process: Sustained Dialogue to Transform Racial and Ethnic Conflicts (New York: Palgrave Macmillan, 1999).",
      note: "Seminal examination of Track II diplomacy and multi-level peace synchronization.",
    },
    {
      citation: "Stephen John Stedman, 'Spoiler Problems in Peace Processes', International Security 22, no. 2 (1997): 5-53.",
      note: "Foundational study on diplomatic spoilers, informing Desk 07 friction and contagion calculations.",
    },
    {
      citation: "Roger Fisher and William Ury, Getting to Yes: Negotiating Agreement Without Giving In (Boston: Houghton Mifflin, 1981).",
      note: "Principled negotiation concepts adapted into the structured non-leading prompt architecture of Desk 06.",
    },
  ],
};
