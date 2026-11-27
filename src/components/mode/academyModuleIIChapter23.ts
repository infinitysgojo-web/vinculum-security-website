import type { DetailedAcademyChapter } from "./academyTypes";
import {
  F_DECAY,
  F_EXPOSURE,
  F_FORUM_E,
  F_FORUM_F,
  F_FRACTURE,
  F_HALF_LIFE,
  F_PRESERVED,
  F_SUCCESSION,
} from "./academyFormulas";

export const CHAPTER_2_3: DetailedAcademyChapter = {
  id: "division-3",
  number: "2.3",
  eyebrow: "Module II · Chapter 2.3",
  title: "Division III (Desks 10–14): Legal & Treaty Architecture",
  estimatedMinutes: 55,
  executiveLede: "Division III transmutes diplomatic understanding into binding, intergenerationally durable international law. By engineering clauses that bind sovereign offices rather than transient political officeholders, auditing draft provisions against the seven documented legal failure modes, evaluating dispute arbitral seats across seven international venues, stress-testing instruments against executive succession, and preparing standing pleading heads directly from bus telemetry, Division III ensures that sovereign covenants survive political turnover, economic collapse, and legal challenge.",
  synopsis: [
    "Desk 10 (Clause Architect) translates sector fragilities into binding covenants of record, enforcing mandatory office-continuity clauses when the Rupture Index reaches or exceeds 35 per cent.",
    "Desk 11 (Clause Redliner) audits draft treaty texts against the seven documented failure modes of international jurisprudence (constructive ambiguity, unanchored aspirational language, asymmetric termination clauses, unverified subjective benchmarks, non-justiciable dispute mechanisms, perpetual unhedged liabilities, and missing severability) and hosts the Dispute Forum Enforceability Matrix.",
    "Desk 12 (Succession Simulator) models executive turnover, institutional capture, and external funding cutoffs, computing treaty survival probability, the Decay Horizon constant \\(\\lambda\\), the stability half-life \\(t_{1/2}\\), and the critical fracture window.",
    "Desk 13 (Legal Desk) populates three standing litigation pleading heads (Jurisdictional Foundation, Substantive Breach, Covenants at Risk) directly from bus signals, automatically appending a fourth head for Emergency Provisional Measures when the Rupture Index reaches or exceeds 40 per cent.",
    "Desk 14 (Adversarial Chamber) stress-tests the draft treaty against standing historical and doctrinal objections, recording whether each challenge is answered, partly conceded, or held open.",
  ],
  statutoryNotice: "Operational Requirement: At a Rupture Index of 35 per cent or greater, an explicit office-continuity provision is mandatory. Treaty survival below the 55 per cent Succession Trap holds Stage Gate 5 (Succession Durability) permanently locked.",
  learningOutcomes: [
    "Draft structural covenants on Desk 10 that bind sovereign legal offices rather than individual political incumbents.",
    "Audit treaty texts on Desk 11 against the seven canonical failure modes, selecting dispute venues using the Enforceability Matrix.",
    "Calculate the base enforceability \\(E\\), venue fitness \\(F\\), and enforcement friction across the seven arbitral forums.",
    "Execute succession stress simulations on Desk 12, computing survival scores, the decay constant \\(\\lambda\\), and stability half-life \\(t_{1/2}\\).",
    "Populate standing pleading heads on Desk 13 directly from bus telemetry, verifying jurisdictional foundations.",
    "Rehearse adversarial challenges in Desk 14 without introducing ideological or political bias.",
  ],
  sections: [
    {
      heading: "I. Desk 10: Clause Architect & Office-Continuity Provisions",
      subheading: "Binding the Sovereign Office Rather Than the Incumbent",
      paragraphs: [
        "A primary cause of treaty breakdown throughout modern history is the 'Personalized Covenant Fallacy': international agreements drafted around the personal rapport, prestige, or political tenure of specific heads of state. When an incumbent leaves office through electoral defeat, military coup, or mortality, their successor routinely repudiates the accord as an illegitimate relic of the prior regime.",
        "Desk 10 (Clause Architect) addresses this vulnerability by transmuting the fragilities identified on Desk 01 into binding structural covenants. Every covenant engineered on Desk 10 binds the legal organ of the sovereign state (the Presidency, the Ministry of Foreign Affairs, the Sovereign State Council, the Department of Boundary Waters) rather than named officeholders.",
        "Statutory Directive 2.3-A mandates that whenever the Rupture Index on Desk 02 reaches or exceeds 35 per cent, the treaty draft must incorporate an explicit Office-Continuity Provision. This provision establishes that obligations are perpetual sovereign encumbrances that attach to territory, national assets, and institutional offices, enforceable regardless of constitutional transitions or changes of government.",
        "Furthermore, Desk 10 seats the accredited independent verifier on the bus whenever an asymmetric-verification fragility is selected, satisfying Stage Gate 2 and opening Escrow Tranche 1.",
      ],
      caseStudy: {
        title: "The Joint Comprehensive Plan of Action (JCPOA) Repudiation (2015–2018)",
        jurisdiction: "Multilateral Nuclear Non-Proliferation Diplomacy",
        precedent: "UN Security Council Resolution 2231",
        analysis: [
          "The 2015 JCPOA was concluded as a non-binding political arrangement rather than a formal, ratified treaty under US constitutional jurisprudence.",
          "It relied heavily on the personal political commitment of the Obama administration and President Hassan Rouhani. The accord lacked an institutionalized, domestic office-continuity anchor within the US legislative architecture.",
          "In May 2018, the Trump administration exercised executive authority to unilaterally withdraw from the agreement, reimposing sweeping economic sanctions on Iran.",
          "On Desk 10, the JCPOA lacked an insulated office-continuity covenant, demonstrating how political accords lacking formal treaty ratification disintegrate upon executive succession.",
        ],
        failureMechanism: "Structuring a major multilateral settlement as an unratified executive arrangement left it defenseless against unilateral repudiation by a successor administration.",
      },
      subsections: [
        {
          title: "The Mechanics of Office-Continuity Drafting",
          paragraphs: [
            "An office-continuity clause explicitly recites that the rights and obligations contained within the treaty constitute continuous state responsibilities under customary international law (Vienna Convention on the Law of Treaties, Articles 26 and 27).",
            "The clause specifies that domestic constitutional reorganization, changes in governing ideology, or executive decrees shall not constitute a fundamental change of circumstances (rebus sic stantibus) sufficient to terminate treaty validity.",
          ],
        },
      ],
      statutoryRule: "Rule 2.3-A: At a Rupture Index of 35 per cent or greater, an office-continuity provision is mandatory. Covenants must attach to constitutional offices rather than named incumbents.",
    },
    {
      heading: "II. Desk 11: Clause Redliner & The Forum Enforceability Matrix",
      subheading: "The Seven Failure Modes and Arbitral Seat Optimization",
      paragraphs: [
        "Desk 11 operates a dual analytical engine: it audits drafted text against the doctrine's seven canonical failure modes, and it runs the Dispute Forum Enforceability Matrix across seven international arbitral venues.",
        "The redline engine scans draft clauses for seven fatal drafting pathologies: Constructive Ambiguity, Unanchored Aspirational Language, Asymmetric Termination Clauses, Unverified Subjective Benchmarks, Non-Justiciable Dispute Mechanisms, Perpetual Unhedged Liabilities, and Missing Severability. When a pathology is detected, Desk 11 highlights the flaw and provides substitute chancellery text.",
        "The Dispute Forum Enforceability Matrix evaluates seven international venues: International Centre for Settlement of Investment Disputes (ICSID, Base = 80), Permanent Court of Arbitration (PCA, Base = 74), London Court of International Arbitration (LCIA, Base = 72), International Chamber of Commerce (ICC, Base = 70), Swiss Arbitration Centre (SAC, Base = 68), Singapore International Arbitration Centre (SIAC, Base = 66), and International Court of Justice Advisory Opinions (ICJ Advisory, Base = 46).",
        "The desk computes the operative Venue Fitness \\(F\\): \\(F = \\max(0, E_{\\text{base}} - D_{\\text{immunity}} - D_{\\text{seat}})\\). When sovereign immunity is unaddressed in the text, the desk deducts 18 points (\\(D_{\\text{immunity}} = 18\\)). When the arbitral seat is situated within a party's sovereign territory, risking judicial interference, the desk deducts 8 points (\\(D_{\\text{seat}} = 8\\)). The remaining gap to 100 represents Enforcement Friction: \\(\\text{Friction} = 100 - F\\).",
      ],
      formulas: [F_FORUM_E, F_FORUM_F],
      caseStudy: {
        title: "The Abyei Boundary Arbitration (PCA Case No. 2008-07)",
        jurisdiction: "Sudan / South Sudan Borderland Delimitation",
        precedent: "Permanent Court of Arbitration Final Award (2009)",
        analysis: [
          "Following the 2005 Comprehensive Peace Agreement in Sudan, the delimitation of the oil-rich Abyei area was referred to the Permanent Court of Arbitration under PCA Optional Rules.",
          "On Desk 11, the PCA forum exhibited strong base enforceability (74). Both parties explicitly waived sovereign immunity regarding arbitral jurisdiction (\\(D_{\\text{immunity}} = 0\\)), and the seat was established neutrally in The Hague, Netherlands (\\(D_{\\text{seat}} = 0\\)), yielding a high venue fitness of 74 (Friction = 26).",
          "The PCA tribunal rendered its final award in July 2009, redrawing the boundaries of Abyei. Both the Government of Sudan and the Sudan People's Liberation Movement publicly accepted the award.",
          "While local implementation faced communal friction, the legal architecture held firm, proving that neutral venue seating and explicit immunity waivers minimize enforcement friction.",
        ],
        failureMechanism: "A neutral forum seat and explicit sovereign immunity waiver eliminated legal friction, securing international arbitral enforceability.",
      },
      subsections: [
        {
          title: "The Forum Selection Decision Tree",
          paragraphs: [
            "Negotiators must match dispute venues to the underlying assets. Commercial infrastructure and cross-border resource corridors benefit from institutional arbitration with direct asset attachment mechanisms (ICSID, ICC, LCIA).",
            "Sovereign boundary demarcation and diplomatic sovereignty questions require interstate arbitral registries (PCA). Advisory venues lacking self-executing award enforcement (ICJ Advisory) should never serve as the sole dispute forum for high-rupture covenants.",
          ],
        },
      ],
      statutoryRule: "Rule 2.3-B: Arbitral venue fitness scores represent doctrinal ordinal evaluations. Failure to waive sovereign immunity automatically incurs an 18-point enforcement deduction.",
    },
    {
      heading: "III. Desk 12: Succession Simulator & The Decay Horizon",
      subheading: "Treaty Survival, Exponential Decay, and the Critical Fracture Window",
      paragraphs: [
        "Desk 12 stress-tests the draft treaty against three existential operational shocks: sudden executive succession, catastrophic loss of international donor funding, and institutional capture by hostile factions.",
        "The desk computes the overall Treaty Survival Score \\(S_{\\text{treaty}}\\). Covenants drafted on Desk 10 provide protective insulation against their designated shocks: an insulated shock counts at only 25 per cent of its raw severity: \\(S_{k}^{\\text{effective}} = S_{k} \\cdot 0.25\\). Uninsulated shocks strike with 100 per cent force.",
        "If the resulting survival score falls below the 55 per cent statutory threshold, the treaty is trapped within the 'Succession Trap'. Stage Gate 5 (Succession Durability) locks, and Escrow Tranche 4 is withheld. The treaty cannot be certified while it remains vulnerable to executive turnover.",
        "Desk 12 also computes the Decay Horizon. In the absence of institutional maintenance, sovereign agreements experience natural relational decay governed by the decay constant \\(\\lambda\\). The desk derives the treaty stability half-life \\(t_{1/2} = \\frac{\\ln(2)}{\\lambda}\\), and identifies the Critical Fracture Window: the precise historical interval (typically 18 to 36 months post-signing) where initial political euphoria wanes and unaddressed implementation friction threatens terminal collapse.",
      ],
      formulas: [F_SUCCESSION, F_DECAY, F_EXPOSURE, F_HALF_LIFE, F_PRESERVED, F_FRACTURE],
      caseStudy: {
        title: "The Intergenerational Breakdown of the Lancaster House Agreement (1979–2000)",
        jurisdiction: "Zimbabwean Constitutional Independence Settlement",
        precedent: "The Lancaster House Agreement (Southern Rhodesia)",
        analysis: [
          "The 1979 Lancaster House Agreement concluded the Rhodesian Bush War, creating independent Zimbabwe under a constitutional framework that protected white commercial farmland for ten years under a 'willing-buyer, willing-seller' mechanism.",
          "On Desk 12, the agreement suffered from a high decay constant (\\(\\lambda = 0.082\\)), resulting in a stability half-life \\(t_{1/2}\\) of approximately 8.5 years.",
          "The agreement contained no self-executing intergenerational funding escrow once British colonial subsidies expired. When the ten-year constitutional protection clause lapsed in 1990 without a sustainable land restitution fund in place, relational friction mounted rapidly.",
          "By 2000, unaddressed land hunger led to violent farm invasions, systemic agricultural collapse, and international sanctions, demonstrating how an accord lacking intergenerational decay insulation fractures once its initial horizon expires.",
        ],
        failureMechanism: "Absence of long-term financial escrow architecture and intergenerational land mechanisms led to catastrophic systemic breakdown after the initial 10-year term.",
      },
      subsections: [
        {
          title: "Calculating the Critical Fracture Window",
          paragraphs: [
            "The Critical Fracture Window is mathematically defined as the temporal domain \\(t \\in [t_{1/2} \\cdot 0.5, t_{1/2} \\cdot 1.2]\\). During this window, initial political capital is exhausted while institutional monitoring costs reach their peak.",
            "Covenants must deploy self-renewing verification cycles and periodic review assemblies to reset the decay clock, artificially extending the stability half-life.",
          ],
        },
      ],
      statutoryRule: "Rule 2.3-C: A treaty survival score below 55 per cent activates the Succession Trap lock on Stage Gate 5. Escrow Tranche 4 is released only when durability is empirically certified.",
    },
    {
      heading: "IV. Desk 13 & Desk 14: Legal Desk and the Adversarial Chamber",
      subheading: "Pleading Heads and Doctrinal Resistance Rehearsal",
      paragraphs: [
        "Desk 13 (Legal Desk) prepares for the reality that even the most meticulously drafted sovereign covenant may eventually face formal legal dispute. The desk automates the compilation of standing litigation briefs, generating three standardized Pleading Heads populated strictly from live bus signals:",
        "1. Jurisdictional Foundation: Extracted directly from the dispute forum and arbitral seat selected on Desk 11.",
        "2. Substantive Breach: Derived from the limiting bond and failing tripwires identified on Desk 01 and Desk 02.",
        "3. Covenants at Risk: Mapped directly from the active structural covenants drafted on Desk 10.",
        "Statutory Directive 2.3-D dictates that whenever the Rupture Index reaches or exceeds 40 per cent, Desk 13 automatically appends a fourth pleading head: Emergency Provisional Measures. This head details specific procedural orders (e.g., immediate cessation of border construction, temporary asset freezing, or urgent observer access) necessary to preserve sovereign rights pendente lite.",
        "Desk 14 (Adversarial Chamber) completes Division III by subjecting the draft treaty to formal adversarial cross-examination. It rehearses the standing historical objections of doctrinal critics: national sovereignty encroachment, neo-colonial oversight accusations, domestic constitutional supremacy conflicts, and resource alienation concerns.",
        "The chamber records each adversarial challenge as Answered, Partly Conceded, or Held Open. The desk does not assign an aggregate pass/fail score; its function is cognitive hardening, ensuring that sovereign delegations enter ratification with full awareness of counterparty legal strategies.",
      ],
      caseStudy: {
        title: "Provisional Measures in Georgia v. Russian Federation (ICJ 2008)",
        jurisdiction: "International Court of Justice Interstate Litigation",
        precedent: "Application of the International Convention on the Elimination of All Forms of Racial Discrimination (CERD)",
        analysis: [
          "In August 2008, following the outbreak of armed conflict in South Ossetia and Abkhazia, Georgia instituted proceedings against the Russian Federation before the ICJ, submitting an urgent request for the indication of provisional measures.",
          "On Desk 13, the live Rupture Index exceeded 85 per cent, triggering the automated fourth pleading head for provisional measures. The prompt filing enabled Georgia to secure an ICJ Provisional Measures Order in October 2008 calling upon both parties to refrain from acts of ethnic discrimination.",
          "While the ICJ later dismissed the case on procedural grounds in 2011 (finding that pre-filing statutory negotiation requirements under CERD had not been exhausted), the provisional measures order established crucial international legal visibility during active combat.",
          "Desk 13 illustrates the vital operational importance of pre-structured provisional measures pleading heads during high-rupture crises.",
        ],
        failureMechanism: "Pre-structured provisional measures pleading heads secured immediate international legal relief during an active military crisis.",
      },
      subsections: [
        {
          title: "Cognitive Hardening via Adversarial Rehearsal",
          paragraphs: [
            "Desk 14 prevents chancellery echo chambers. Diplomatic teams frequently fall prey to groupthink, convincing themselves that their draft treaty is legally invulnerable.",
            "By forcing negotiators to formally record answers to rigorous counter-arguments, Desk 14 exposes latent jurisdictional ambiguities before adversary state legal advisors can exploit them.",
          ],
        },
      ],
      statutoryRule: "Rule 2.3-D: When the Rupture Index reaches or exceeds 40 per cent, Desk 13 automatically generates the Emergency Provisional Measures pleading head. Missing inputs are named as missing.",
    },
  ],
  quiz: [
    {
      id: "q2-3-1",
      question: "A bilateral treaty clause designates the Permanent Court of Arbitration (PCA, Base = 74) as its dispute forum, but sovereign immunity is left unaddressed, and the arbitral seat is situated within one party's capital territory. What is the operative Venue Fitness score on Desk 11?",
      options: [
        {
          id: "opt-2-3-1a",
          text: "74",
          explanation: "Incorrect. 74 is the raw base enforceability before mandatory statutory deductions.",
          correct: false,
        },
        {
          id: "opt-2-3-1b",
          text: "48",
          explanation: "Correct. \\(F = \\max(0, 74 - 18 - 8) = 48\\). The unaddressed immunity deduction is 18 points, and the domestic territorial seat deduction is 8 points, leaving an enforcement friction of 52.",
          correct: true,
        },
        {
          id: "opt-2-3-1c",
          text: "56",
          explanation: "Incorrect. 56 accounts for the 18-point immunity deduction but forgets the 8-point seat deduction.",
          correct: false,
        },
        {
          id: "opt-2-3-1d",
          text: "66",
          explanation: "Incorrect. 66 only deducts 8 points for the domestic seat.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-3-2",
      question: "What occurs if the calculated Treaty Survival Score \\(S_{\\text{treaty}}\\) on Desk 12 falls below 55 per cent?",
      options: [
        {
          id: "opt-2-3-2a",
          text: "The draft treaty is permanently deleted from the Chancellery database.",
          explanation: "Incorrect. Records are never deleted; telemetry is preserved for audit.",
          correct: false,
        },
        {
          id: "opt-2-3-2b",
          text: "The treaty triggers the Succession Trap, locking Stage Gate 5 and holding Escrow Tranche 4.",
          explanation: "Correct. Survival below 55 per cent indicates that the accord will fracture upon executive transition, locking Stage Gate 5 and withholding Tranche 4.",
          correct: true,
        },
        {
          id: "opt-2-3-2c",
          text: "The dispute forum is automatically upgraded to the International Court of Justice.",
          explanation: "Incorrect. The Succession Simulator does not unilaterally alter arbitral forum clauses.",
          correct: false,
        },
        {
          id: "opt-2-3-2d",
          text: "The four-bond vector on Desk 01 is cleared to zero.",
          explanation: "Incorrect. Downstream desks never erase upstream diagnostic scores.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-3-3",
      question: "At what Rupture Index threshold does Desk 13 automatically append a fourth pleading head for Emergency Provisional Measures?",
      options: [
        {
          id: "opt-2-3-3a",
          text: "15 per cent (Guarded band).",
          explanation: "Incorrect. 15 per cent represents the baseline early-warning threshold.",
          correct: false,
        },
        {
          id: "opt-2-3-3b",
          text: "35 per cent (Elevated band).",
          explanation: "Incorrect. 35 per cent mandates independent verifier seating on Desk 16.",
          correct: false,
        },
        {
          id: "opt-2-3-3c",
          text: "40 per cent (Active Crisis domain).",
          explanation: "Correct. Statutory Rule 2.3-D dictates that whenever the Rupture Index reaches or exceeds 40 per cent, Desk 13 automatically compiles the Emergency Provisional Measures pleading head.",
          correct: true,
        },
        {
          id: "opt-2-3-3d",
          text: "60 per cent (Critical band).",
          explanation: "Incorrect. 60 per cent triggers the escrow freeze on Desk 07.",
          correct: false,
        },
      ],
    },
  ],
  practice: [
    {
      problem: "A draft treaty faces two uninsulated exogenous shocks: a currency devaluation shock with raw strain \\(S_{1} = 40\\) and an executive turnover shock with raw strain \\(S_{2} = 50\\). Drafters add an office-continuity covenant on Desk 10 that insulates the turnover shock. Calculate the effective strain for both shocks, determine the composite survival score (assuming 100 baseline minus total effective strain), and state whether Stage Gate 5 can clear.",
      solution: [
        "1. Evaluate Shock 1 (Currency Devaluation): This shock is uninsulated. Effective strain = \\(40 \\cdot 1.0 = 40\\).",
        "2. Evaluate Shock 2 (Executive Turnover): This shock is insulated by the office-continuity covenant on Desk 10. Effective strain is reduced to 25 per cent: \\(50 \\cdot 0.25 = 12.5\\).",
        "3. Total Effective Strain: \\(S_{\\text{total}} = 40 + 12.5 = 52.5\\).",
        "4. Composite Survival Score: \\(S_{\\text{treaty}} = 100 - 52.5 = 47.5\\%\\).",
        "5. Evaluate Succession Trap Threshold: The statutory threshold for Stage Gate 5 is 55 per cent. Because \\(47.5\\% < 55\\%\\), the treaty remains trapped in the Succession Trap.",
        "6. Operational Mandate: Stage Gate 5 holds LOCKED. To clear the gate, drafters must introduce an additional covenant on Desk 10 (e.g., an economic stabilization escrow) to insulate the currency shock.",
      ],
    },
  ],
  readingList: [
    {
      citation: "United Nations, Vienna Convention on the Law of Treaties, 23 May 1969, United Nations Treaty Series, vol. 1155, p. 331.",
      note: "Articles 26 (pacta sunt servanda), 27 (internal law), and 62 (fundamental change of circumstances), foundational to Desk 10.",
    },
    {
      citation: "Gary B. Born, International Commercial Arbitration, 3rd ed. (Alphen aan den Rijn: Kluwer Law International, 2021).",
      note: "Authoritative treatise on arbitral seats, enforceability, and sovereign immunity waivers.",
    },
    {
      citation: "Shabtai Rosenne, Provisional Measures in International Law: The International Court of Justice and the International Tribunal for the Law of the Sea (Oxford: Oxford University Press, 2005).",
      note: "Detailed procedural analysis of provisional measures jurisprudence, adapted into Desk 13.",
    },
  ],
};
