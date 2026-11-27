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
  estimatedMinutes: 25,
  executiveLede: "Division III supports the drafting and review of proposed legal instruments. Its clause checks, venue ratings, succession scenarios, and pleading outline are UDCA aids, not sources of binding law or guarantees of treaty performance. The legal effect of an agreement depends on its parties, form, consent, applicable law, domestic authority, and any dispute mechanism actually accepted.",
  synopsis: [
    "Desk 10 (Clause Architect) supports covenant drafting; the platform's Gate 4 checks continuity wording when the Rupture Index is at least 35.",
    "Desk 11 (Clause Redliner) reviews draft text using seven Academy-defined risk categories (constructive ambiguity, unanchored aspirational language, asymmetric termination clauses, subjective benchmarks, ineffective dispute clauses, unbounded liabilities, and missing severability) and hosts the Dispute Forum Enforceability Matrix.",
    "Desk 12 (Succession Simulator) models executive turnover, institutional capture, and external funding cutoffs, computing treaty survival probability, the Decay Horizon constant \\(\\lambda\\), the stability half-life \\(t_{1/2}\\), and the critical fracture window.",
    "Desk 13 (Legal Desk) populates three standing litigation pleading heads (Jurisdictional Foundation, Substantive Breach, Covenants at Risk) directly from bus signals, automatically appending a fourth head for Emergency Provisional Measures when the Rupture Index reaches or exceeds 40 per cent.",
    "Desk 14 (Adversarial Chamber) stress-tests the draft treaty against standing historical and doctrinal objections, recording whether each challenge is answered, partly conceded, or held open.",
  ],
  statutoryNotice: "UDCA operational rules (not statutes): at rupture 35 or higher, Gate 4 checks for continuity wording; succession durability below 55 locks Gate 5 until inputs or provisions change and the instrument is recalculated.",
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
        "A change of government does not by itself establish whether an international obligation continues, whether a political commitment remains operative, or whether domestic implementation can proceed. The answers depend on the instrument's legal form and the applicable rules. A drafting team should avoid turning the general observation that personal diplomacy can be fragile into the unsupported claim that successor governments routinely repudiate agreements.",
        "Desk 10 helps identify the state organ responsible for an obligation and the domestic steps needed to implement it. A reference to an office can improve administrative continuity, but it does not create jurisdiction, defeat constitutional limits, attach every duty to state assets, or make an obligation perpetual by wording alone.",
        "The Rule 2.3-A condition is internal to the UDCA gate system: when rupture is at least 35, the structural-covenant gate looks for continuity language. It is not a statutory mandate of international law. Verifier seating is a separate signal recorded through the Verification Ledger; a clause-drafting action does not itself accredit or seat a verifier.",
      ],
      caseStudy: {
        title: "The Joint Comprehensive Plan of Action (JCPOA) Repudiation (2015–2018)",
        jurisdiction: "Multilateral Nuclear Non-Proliferation Diplomacy",
        precedent: "UN Security Council Resolution 2231",
        analysis: [
          "The JCPOA was a multilateral political commitment endorsed by UN Security Council Resolution 2231. Its status and implementation must be described in the relevant domestic and international legal context; it should not be treated as interchangeable with a treaty ratified by the United States Senate.",
          "On 8 May 2018, the United States announced that it would cease participation and reimpose sanctions. That decision illustrates the practical vulnerability of political commitments to a change in executive policy, but it does not establish a general legal rule about treaty succession or show that a model-defined office-continuity clause would have prevented the withdrawal.",
          "The Security Council resolution, the JCPOA text, and the U.S. announcement are distinct instruments and sources. A careful Desk 10 review identifies which actor undertook which commitment, the legal form of that commitment, and the available enforcement or review mechanism.",
          "The case is a prompt for examining institutional durability, not proof that the agreement failed in every respect or that one drafting change could have guaranteed its continued implementation.",
        ],
        failureMechanism: "The 2018 U.S. withdrawal is documented; characterizing it as proof of a universal succession rule or of a counterfactual office-continuity remedy would go beyond the cited record.",
      },
      subsections: [
        {
          title: "The Mechanics of Office-Continuity Drafting",
          paragraphs: [
            "Article 26 of the Vienna Convention on the Law of Treaties states that a treaty in force is binding upon the parties and must be performed in good faith. Article 27 generally precludes a party from invoking its internal law as justification for failure to perform a treaty. Neither provision turns an internal Academy clause into international law or makes every political commitment a treaty.",
            "A continuity provision should specify the state organ responsible for performance, domestic procedures needed for implementation, notice and consultation duties, and the dispute process. It cannot, by its own wording, override constitutional limits, create consent to jurisdiction, or remove the requirements governing termination and withdrawal under the applicable instrument and law.",
            'Drafting should begin by identifying the instrument’s legal character and parties. A treaty, a Security Council resolution, a political commitment and a domestic implementing statute can interact without becoming interchangeable. The record should identify who had authority to make the commitment, what form was used, whether entry-into-force conditions were met, and which institution is responsible for performance. If the instrument is not a treaty, treaty rules should not be casually applied as though ratification and legal effect were established.',
            'The Convention’s provisions on termination and withdrawal underscore that continuity wording does not make an agreement irrevocable. Article 54 addresses termination or withdrawal in accordance with the treaty’s provisions or by consent of the parties; Article 62 treats a fundamental change of circumstances as a narrow ground subject to conditions. A drafting team should therefore state the agreed duration, amendment route, notice requirements and consequences of withdrawal, then obtain legal analysis of the rule applicable to the instrument. A broad promise of permanence may conceal rather than solve the parties’ disagreement about exit.',
            'International performance and domestic implementation should be reviewed separately. A government may need constitutional approval, legislation, appropriations, or administrative regulations to carry out an undertaking. The clause should identify those steps and assign responsibility, but should not falsely promise that a negotiating team can bind a legislature or court that has not acted. If a commitment depends on later domestic action, the text can specify a timetable, reporting duty and consultation process while preserving the legal roles of the relevant institutions.',
            'Finally, specify what “continuity” means in operational terms. It might refer to retaining records, maintaining a designated contact point, preserving a reporting duty during a cabinet transition, or requiring notice before a responsible office changes. Each obligation needs a defined actor, trigger and consequence. The UDCA gate’s search for continuity wording is much less demanding: it does not decide whether the clause is valid, enforceable or politically sustainable. Legal review must examine the actual text and the parties’ authority independently of that binary check.',
          ],
        },
        {
          title: 'Office-continuity language',
          paragraphs: [
            'Office-continuity drafting binds a designated state organ or institution only to the extent the state has authority to bind itself and the clause is incorporated in the relevant instrument. It may improve successor planning, but it does not automatically supersede constitutional law or displace the entity actually liable.',
            'The written analysis should identify primary sources, authority, date, source population and known omissions. It should also state the UDCA rule applied and the distinction between a platform result and a legal or factual conclusion. This prevents the model from changing categories of evidence without notice.',
            'For a postgraduate-level review, compare at least one counter-explanation and explain what evidence would alter the finding. A result should include sensitivity to missing, disputed or low-confidence inputs. Aggregate readings are therefore starting points for inquiry, not verdicts imposed on a people or institution.',
            'Implementation should preserve a remedy, a correction route and a named decision authority. A desk outcome can justify further verification or negotiation, but it should not authorize detention, retaliation or treatment of protected persons as hostile groups. Safeguards are tested through documented process and review.',
            'Where historical material is used, distinguish established fact, source interpretation and later hindsight. Footnotes or an audit trail should identify official records, recognized scholarship and primary instruments. The final judgment should disclose uncertainty and remain revisable when primary evidence is corrected.',
          ],
        },
        {
          title: 'JCPOA distinction',
          paragraphs: [
            'The JCPOA is accurately treated as a complex political agreement with a Security Council resolution context; it was not a single fully ratified United States treaty. Its later withdrawal illustrates executive and domestic legal context, not a general rule that every successor government may disregard obligations.',
          ],
        },
        {
          title: 'Redline modes',
          paragraphs: [
            'Ambiguity, aspiration, asymmetry, subjective benchmarks, weak dispute clauses, unbounded liabilities and missing severability should be assessed separately. A redline should identify the operative language, the source of uncertainty and a concrete cure. Broadly characterizing a defect as “legal” is not enough.',
          ],
        },
        {
          title: 'Clause precision',
          paragraphs: [
            'A covenant should identify actor, obligation, standard, evidence, review, remedy and duration. Vagueness in one of these fields may shift the cost of implementation onto the weakest party.',
            'A defensible report names the authority for the rule or fact it invokes. It separates established historical facts, disputed allegations and platform doctrine. If the applicable legal source is uncertain, the report should say so rather than raising a model output to the status of law.',
            'The analysis should identify at least one disconfirming observation and state who could challenge the result. Source triangulation may corroborate an event, but confidence should still vary if all sources derive from the same institution or political network.',
            'The recommended action should be limited to what the evidence supports. A monitoring step, preservation request or additional hearing may be more appropriate than a coercive finding. The result should state the responsible decision-maker and the time at which review occurs.',
            'Finally, the record should remain usable for correction and appeal. It should preserve dissent, seal only completed outputs and avoid presenting an internal threshold as universal truth. This is the practical distinction between a transparent operational aid and a claim of legal or scientific authority.',
          ],
        },
        {
          title: 'Legal hierarchy',
          paragraphs: [
            'A treaty may be valid at the international level yet require legislative incorporation or execution under domestic law. The analysis should identify the hierarchy rule in the relevant constitution.',
          ],
        },
        {
          title: 'Redline ownership',
          paragraphs: [
            'A redline should name who can make the drafting change and who can accept a deviation. Unresolved language should remain visible rather than being silently converted into a summary.',
          ],
        },
        {
          title: 'Interpretive presumptions',
          paragraphs: [
            'Interpretation depends on text, context, object and purpose and applicable treaty rules. The drafter should avoid assuming that a negotiator’s later explanation controls the final instrument.',
          ],
        },
        {
          title: 'Arbitral transparency',
          paragraphs: [
            'An arbitral process may be confidential, transparent or hybrid. Confidentiality can protect sensitive interests but can also hinder public legitimacy and precedent; the instrument should state the chosen rule.',
          ],
        },
        {
          title: 'Asset analysis',
          paragraphs: [
            'Before promising enforcement, counsel should identify the entity liable, the assets subject to attachment and the law of enforcement. Arbitral consent does not itself place assets in a debtor’s account.',
          ],
        },
        {
          title: 'Scenario provenance',
          paragraphs: [
            'Every succession scenario should identify source evidence for leadership change, funding loss or capture. It should not assume that a new government is hostile merely because it differs politically.',
          ],
        },
        {
          title: 'Decay calibration',
          paragraphs: [
            'The decay constant should be calibrated or described as a planning assumption. The reporting format should show whether the result is stable across plausible alternatives.',
          ],
        },
        {
          title: 'Relief proportionality',
          paragraphs: [
            'Interim relief should be no broader than necessary to preserve rights or prevent irreparable harm. The proposal should include notice, duration, review and an explanation of the harm if denied.',
          ],
        },
        {
          title: 'Drafting quality control',
          paragraphs: [
            'UDCA doctrine supplies a procedural threshold rather than an independent finding of fact or law. The analysis should identify applicable law separately and avoid importing a platform label into a court, treaty or constitutional conclusion.',
            'A serious practice reports the strongest contrary interpretation, any affected population and the evidence needed to resolve uncertainty. It also identifies who can correct the record and how a correction changes the result.',
            'The remedy or recommendation should be proportionate, reviewable and connected to the identified risk. Monitoring, clarification and mediation may be preferable to punitive action, especially where the evidence remains incomplete.',
            'A complete chapter review ends with preserved dissent, a source trail and a list of unresolved assumptions. This permits later independent review and prevents a summarized result from becoming detached from the evidence that produced it.',
          ],
        },
        {
          title: 'Evidence source',
          paragraphs: [
            'The appropriate UDCA reading is a procedural or analytical result. It does not substitute for binding international law, domestic constitutional requirements or adjudicative findings. Counsel and qualified institutions must determine the legal rule; historical accounts must be tested against primary records and recognized scholarship rather than repeated as rhetorical certainty.',
            'Before a conclusion is used, the analyst should test an alternative explanation. This includes omitted actors, changed incentives, incomplete records and selection effects. The result should identify evidence that would disconfirm it and state which assumption carries the greatest uncertainty. A close fit to a precedent does not establish causation.',
            'A recommended response should be linked to the exact finding and remain proportionate to the evidence. Where facts are uncertain, preservation, corroboration, consultation or a review hearing may be more appropriate than punishment or escalation. Responsible authority, duration and a route for appeal should be recorded.',
            'The final audit trail should preserve the original entry, any later correction and the reason for the change. It should also identify affected groups and independent reviewers. Sealing or logging a result does not prove that the underlying evidence is true; it protects the integrity of the recorded state when custody controls operate as described.',
          ],
        },

      ],
      statutoryRule: "UDCA Rule 2.3-A: when rupture is at least 35, Gate 4 checks for continuity language. This text check does not establish a provision's legal effect.",
    },
    {
      heading: "II. Desk 11: Clause Redliner & The Forum Enforceability Matrix",
      subheading: "Academy Drafting-Risk Categories and Forum Selection",
      paragraphs: [
        "Desk 11 operates a dual analytical engine: it audits drafted text against the doctrine's seven canonical failure modes, and it runs the Dispute Forum Enforceability Matrix across seven international arbitral venues.",
        "The redline screen groups seven drafting risks for this curriculum: ambiguity, aspirational language without an operative duty, asymmetric termination, subjective benchmarks, an ineffective dispute clause, unbounded liabilities, and missing severability. These are review categories, not a canonical list of seven fatal pathologies in international jurisprudence. A clause's legal effect must be assessed in context, not decided by a label.",
        "The forum matrix displays ordinal internal base scores for institutions with materially different functions. ICSID, PCA, LCIA, ICC, Swiss Arbitration Centre, SIAC, and ICJ advisory proceedings are not interchangeable venues: an advisory opinion is not an arbitral award, and an arbitral institution administers a process rather than guaranteeing enforcement.",
        "The engine's Venue Fitness subtracts fixed internal deductions for unaddressed immunity and a non-neutral seat. These are heuristic points, not measured probabilities or legal conclusions. Separate questions include consent to jurisdiction, scope of a tribunal's authority, the seat's procedural law where relevant, recognition of an award, immunity from execution, and whether assets are legally attachable.",
      ],
      formulas: [F_FORUM_E, F_FORUM_F],
      caseStudy: {
        title: "The Abyei Boundary Arbitration (PCA Case No. 2008-07)",
        jurisdiction: "Sudan / South Sudan Borderland Delimitation",
        precedent: "Permanent Court of Arbitration Final Award (2009)",
        analysis: [
          "The Abyei arbitration arose under the 2005 Comprehensive Peace Agreement, which provided for an arbitral determination of the Abyei Area boundaries. The Government of Sudan and the Sudan People's Liberation Movement/Army submitted the dispute to a tribunal constituted under the PCA Optional Rules; the tribunal issued its award on 22 July 2009.",
          "The tribunal decided the boundary question under the mandate and evidence before it. This was not a general adjudication of sovereignty over all disputed territory, and the Academy's venue ratings are not historical measurements of the tribunal's enforceability.",
          "The published award and later records are the appropriate sources for the parties' submissions, the tribunal's reasoning, and implementation. They do not support the previous claims of a particular Desk 11 score, a specific sovereign-immunity waiver, or the conclusion that neutral seating eliminated enforcement friction.",
          "Use the case to distinguish consent to arbitration, the tribunal's jurisdiction, the scope of its mandate, the award, and subsequent implementation. Venue selection can reduce or allocate procedural risks, but no rating in this application predicts compliance.",
        ],
        failureMechanism: "The arbitration demonstrates a treaty-based boundary reference and a published award. Assertions about platform scores, immunity waivers, and friction-free enforcement were unsupported.",
      },
      subsections: [
        {
          title: "The Forum Selection Decision Tree",
          paragraphs: [
            "Venue selection begins with the parties' consent and the dispute they intend to submit. Investment arbitration, commercial arbitration, interstate arbitration, and an ICJ advisory proceeding have different jurisdictional bases, rules, parties, and available remedies. No institution automatically supplies the enforcement mechanism for every asset or claim.",
            "A clause should identify the dispute class, the parties entitled to bring it, the applicable consent instrument, any pre-arbitration steps, the tribunal or appointing authority, governing law, and the intended route for recognition or compliance. Advice on assets and sovereign immunity requires jurisdiction-specific legal review; a desk score cannot replace it.",
          ],
        },
        {
          title: 'Constructive ambiguity',
          paragraphs: [
            'Ambiguity can gain agreement by postponing a hard conflict, but it can also shift the conflict into implementation. The drafter should distinguish a deliberate interpretive margin from an accidental omission. If ambiguity remains, it needs an agreed rule for evidence and interim application.',
          ],
        },
        {
          title: 'Forum consent',
          paragraphs: [
            'ICSID, PCA, ICC, LCIA and SIAC jurisdiction rests on applicable consent and rules. Their recognition and enforcement depend on awards, state assets and the jurisdiction asked to enforce. A venue fitness number is a mission ranking, not a legal opinion or a ranking of courts.',
            "A drafting review should test consent before comparing procedural advantages. For an investment claim, the relevant consent may be in a treaty, statute, or contract and must meet the chosen forum's requirements. A commercial arbitration clause binds only the parties and claims it covers. Interstate arbitration likewise depends on an instrument of consent. The institutional label alone does not make an unconsenting sovereign a party to the proceeding.",
            "Jurisdiction and execution are separate stages. A valid arbitration agreement can permit a tribunal to hear a dispute without guaranteeing voluntary performance or that a particular state asset can be seized. The ICSID Convention's recognition and enforcement framework does not erase the distinct rule on immunity from execution in Article 55. Under the New York Convention, recognition and enforcement are carried out by courts under its terms and applicable procedural law. These differences are why the desk's fixed immunity deduction is an internal caution signal, not a conclusion that a waiver is always required or sufficient.",
            "A useful clause audit asks who gave consent, what dispute is covered, what procedural prerequisites apply, which law governs, where the proceeding is seated if a seat is relevant, and where the debtor has assets. It should then identify any immunity waiver's scope, including the distinction between immunity from adjudication and immunity from execution. Counsel must confirm current law in each relevant jurisdiction; the Academy does not provide jurisdiction-specific legal advice.",
            'The forum name should not be used as a substitute for describing the parties and relief sought. The International Court of Justice decides disputes between states where jurisdiction exists under a recognized basis; its advisory function is legally distinct from contentious proceedings. An arbitral institution may administer a proceeding under agreed rules, but it does not create consent or ensure that a resulting award will be enforceable against every asset. A drafting table should therefore record the legal route to jurisdiction separately from the preferred seat, administrator, and enforcement forum.',
            'A forum matrix should also distinguish legal availability from practical suitability. A proceeding can be legally available but inaccessible because of cost, evidence constraints, language, security or the time needed to constitute a tribunal. Conversely, a convenient institution may lack jurisdiction over the dispute or the relevant party. Record the assumptions behind each internal rating, identify the evidence needed to test them, and preserve a “not assessed” option when critical facts are missing. A numeric ranking should not force a choice before counsel has confirmed that the proposed mechanism is valid.',
            'Remedy design belongs in the same analysis. A declaration, damages award, interim order, boundary determination and advisory opinion are not interchangeable. The parties should identify the type of relief the forum may grant under the instrument, whether interim measures are available, and what process would follow an adverse decision. The model may help compare institutional features, but it cannot enlarge a tribunal’s mandate or make a remedy binding on a person who did not consent to the proceeding.',
          ],
        },
        {
          title: 'Sovereign immunity',
          paragraphs: [
            'A waiver should name the covered entity, proceedings, interim measures, award enforcement and protected immunity. Whether assets are available also depends on local law and whether an entity is treated as the state or a separate commercial actor.',
            'The question is not simply whether the clause says “waiver.” Legal systems may distinguish jurisdictional immunity from immunity of state property against execution, and may give special protection to central-bank, diplomatic, military, or other public-use assets. Consent to arbitrate should not be drafted as though it automatically waives every defense or authorizes attachment of all state property.',
            'The audit should name the state or entity that undertook the obligation, determine whether a separate public corporation has its own legal personality, and identify the specific assets realistically available for performance. A rating that subtracts 18 points whenever a waiver is absent compresses this legal analysis into an internal convention. That may prompt counsel to investigate; it cannot tell counsel what a court will decide.',
            'Enforcement planning should begin with the actual debtor, not with a list of assets that appear connected to a state. Determine who holds title, what the asset is used for, whether the entity is legally separate, and which court would be asked to recognize an award or permit execution. The same asset may be treated differently across jurisdictions, and local statutes or decisions can change. A generalized “commercial use” label is not a substitute for reviewing the asset’s ownership, function and location.',
            'A waiver can be drafted narrowly or broadly, but breadth does not remove the need for authority and specificity. The clause should clarify whether it concerns adjudicative jurisdiction, interim relief, recognition, or execution, and identify any protected categories that remain outside it. Negotiators should not promise access to diplomatic premises, military property, central-bank assets or third-party property without a legal basis. A provision that appears forceful but cannot lawfully be performed may undermine confidence rather than increase it.',
            'The ICSID Convention illustrates why enforcement provisions must be read as a whole: recognition and enforcement obligations coexist with a separate rule preserving immunity from execution. Under the New York Convention, domestic courts apply the Convention’s grounds and local procedure when asked to recognize or enforce an award. These instruments do not create a universal right to seize state property. The governing forum, the award, the asset and the law of the place where enforcement is sought all remain relevant.',
            'A sound matrix should therefore record uncertainty rather than mask it with one deduction. It can identify a missing consent instrument, an unresolved immunity question, an unknown asset location or a possible enforcement route, then assign each question to qualified counsel. If no reliable answer is available, mark the risk as unassessed and explain the consequence for planning. This is more useful than treating a low fitness score as a legal conclusion or a high score as a guarantee of collection.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.3-B: the venue fitness calculation applies an internal 18-point deduction when no immunity waiver is recorded. This score is not a legal finding about whether a waiver is required or effective.",
    },
    {
      heading: "III. Desk 12: Succession Simulator & The Decay Horizon",
      subheading: "Treaty Survival, Exponential Decay, and the Critical Fracture Window",
      paragraphs: [
        "Desk 12 stress-tests the draft treaty against three existential operational shocks: sudden executive succession, catastrophic loss of international donor funding, and institutional capture by hostile factions.",
        "The desk computes the overall Treaty Survival Score \\(S_{\\text{treaty}}\\). Covenants drafted on Desk 10 provide protective insulation against their designated shocks: an insulated shock counts at only 25 per cent of its raw severity: \\(S_{k}^{\\text{effective}} = S_{k} \\cdot 0.25\\). Uninsulated shocks strike with 100 per cent force.",
        "A succession durability result below 55 activates the internal Stage Gate 5 lock and prevents the final escrow condition from passing. It does not show that a treaty will fail, and the lock is not permanent: changed, supportable inputs can be recalculated. The durability formula weights the bond mean, intergenerational and institutional readings, a capped covenant indicator, and normalized rupture; it is a deterministic convention, not a probability estimate.",
        "A separate decay calculation uses unmitigated exposure and rupture to derive \\(\\lambda=\\max(0,U+R)/2000\\), then calculates a half-life when \\(\\lambda>0\\). The result depends on operator-entered severity, selected insulation, and the time unit specified by the implementation. It is not an empirically estimated law of social decay. The desk's fracture window is a mathematical projection from current inputs, not a universal 18–36-month historical interval.",
      ],
      formulas: [F_SUCCESSION, F_DECAY, F_EXPOSURE, F_HALF_LIFE, F_PRESERVED, F_FRACTURE],
      caseStudy: {
        title: "The Lancaster House Settlement and Later Land Policy",
        jurisdiction: "Zimbabwean Constitutional Independence Settlement",
        precedent: "The Lancaster House Agreement (Southern Rhodesia)",
        analysis: [
          "The Lancaster House negotiations produced the 1979 constitutional settlement and the transition to Zimbabwean independence in 1980. The independence constitution included time-limited protections for specified property rights and a land-resettlement framework; the primary constitutional text and contemporaneous records are necessary to state their precise terms.",
          "No historical source provides inputs for the Academy's decay constant, stability half-life, or succession score for this settlement. Those values in the former case study were invented and have been removed.",
          "Later land-reform policy, the end of constitutional restrictions, economic change, and political conflict require analysis across distinct periods and sources. A sequence of events cannot establish that the expiry of a single constitutional provision caused the later crisis.",
          "Desk 12's exponential decay model is an internal scenario tool, not a validated historical model. A researcher may use it for an explicitly hypothetical sensitivity exercise, but must disclose assumptions and must not describe its output as an observed treaty half-life.",
        ],
        failureMechanism: "The constitutional transition and later land-policy disputes are documented subjects; the former decay estimate and causal account were unsupported and are not retained as historical findings.",
      },
      subsections: [
        {
          title: "Calculating the Critical Fracture Window",
          paragraphs: [
            "The engine's fracture-window function solves for the projected time at which the mean bond reaches 2.0 under its exponential model, with zero returned when the mean is already at or below 2.0. It does not use a generic interval of one-half to 1.2 half-lives, and the resulting day or month figure is conditional on the entered exposure and rupture.",
            "A review cycle may change future inputs if it produces documented evidence of mitigation; merely holding a meeting does not reset \\(\\lambda\\). The model does not contain a verification-cycle variable that automatically extends half-life. Report the calculation, what was assumed insulated, and which observation would justify updating the input.",
          ],
        },
        {
          title: 'Succession simulation',
          paragraphs: [
            'The survival formula is a deterministic UDCA stress convention. It does not estimate empirical probability. Raw shocks, insulation values and baseline assumptions should be reproducible, and the report should name which shock was insulated by which covenant.',
            'A sensitivity table should vary one major assumption at a time: the initial bond vector, the assigned severity of each shock, the count of covenants, the capped covenant contribution, and the rupture input. Show the resulting score and whether the Gate 5 category changes. This makes clear whether a disposition depends on a robust pattern or a narrow threshold crossing. Do not select only the most favorable variation; include adverse but plausible assumptions and state why each belongs in the range.',
            'The formula’s weights are normative choices in this application. A 35 per cent contribution from the mean bond and equal 25 per cent weights for intergenerational and institutional measures do not follow from a historical law of succession. The covenant indicator and rupture deduction are also model choices. An analyst can explain their intended policy meaning, but should not claim they are statistically calibrated unless a validation study and data are available. When stakeholders dispute the weighting, report the disagreement rather than presenting the arithmetic as neutral consensus.',
            'A result below the internal trap threshold is a reason to identify specific continuity work, not to label a society unsustainable. The assessment should identify which public function is at risk, what legal authority protects it, who will fund it, and how residents can seek review if the transition fails. If a treaty contains a continuity provision, examine its text, parties, entry into force, termination clauses and relationship to domestic law. A score alone cannot show whether the provision survives a change in government or binds a successor under the applicable law.',
          ],
        },
        {
          title: 'Decay model',
          paragraphs: [
            'Exponential decay is a simplification that makes maintenance visible. It should not be described as inevitable biological or historical decay. Institutional renewal, external shocks and implementation milestones can change the real trajectory, and a model should disclose the evidence for lambda.',
          ],
        },
        {
          title: 'Provisional measures',
          paragraphs: [
            'At the ICJ, provisional measures can be binding and are assessed under the Court’s jurisdictional and procedural criteria. In arbitration, interim measures follow the governing instrument and rules. The filing should identify urgency, plausible rights, preservation and the authority to grant relief.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.3-C: succession durability below 55 locks Stage Gate 5. The final escrow condition checks its configured score and bond thresholds; neither is an empirical certification of treaty survival.",
    },
    {
      heading: "IV. Desk 13 & Desk 14: Legal Desk and the Adversarial Chamber",
      subheading: "Pleading Heads and Doctrinal Resistance Rehearsal",
      paragraphs: [
        "Desk 13 (Legal Desk) prepares for the reality that even the most meticulously drafted sovereign covenant may eventually face formal legal dispute. The desk automates the compilation of standing litigation briefs, generating three standardized Pleading Heads populated strictly from live bus signals:",
        "1. Jurisdictional Foundation: Extracted directly from the dispute forum and arbitral seat selected on Desk 11.",
        "2. Substantive Breach: Derived from the limiting bond and failing tripwires identified on Desk 01 and Desk 02.",
        "3. Covenants at Risk: Mapped directly from the active structural covenants drafted on Desk 10.",
        "The internal Desk 13 workflow adds an Emergency Provisional Measures heading when rupture is at least 40. It is an outline prompt, not a filed pleading, legal recommendation, or finding that a court has jurisdiction or should grant relief.",
        "Desk 14 (Adversarial Chamber) completes Division III by subjecting the draft treaty to formal adversarial cross-examination. It rehearses the standing historical objections of doctrinal critics: national sovereignty encroachment, neo-colonial oversight accusations, domestic constitutional supremacy conflicts, and resource alienation concerns.",
        "The chamber records each adversarial challenge as Answered, Partly Conceded, or Held Open. The desk does not assign an aggregate pass/fail score; its function is cognitive hardening, ensuring that sovereign delegations enter ratification with full awareness of counterparty legal strategies.",
      ],
      caseStudy: {
        title: "Provisional Measures in Georgia v. Russian Federation (ICJ 2008)",
        jurisdiction: "International Court of Justice Interstate Litigation",
        precedent: "Application of the International Convention on the Elimination of All Forms of Racial Discrimination (CERD)",
        analysis: [
          "Georgia filed its application against the Russian Federation at the International Court of Justice on 12 August 2008 and requested provisional measures under the Convention on the Elimination of All Forms of Racial Discrimination (CERD). The Court indicated provisional measures in its order of 15 October 2008.",
          "In its 2011 preliminary-objections judgment, the Court found that it lacked jurisdiction because the procedural preconditions in CERD had not been met. The case therefore illustrates why a provisional-measures request, the Court's prima facie assessment, and final jurisdiction are distinct legal questions.",
          "No historical Rupture Index is recorded in the ICJ case materials, and the Court's order was not triggered by a platform score. The Academy's threshold for automatically adding a pleading head is an internal workflow convention, not a rule of the ICJ or a substitute for counsel's jurisdictional analysis.",
          "The documented sequence is suitable for studying urgency, treaty jurisdiction, negotiation preconditions, and the limited nature of interim relief. The outcome should not be described as proof that a pre-structured pleading automatically secures relief.",
          'The Court’s public case summary records that the 2008 order followed hearings and an assessment of prima facie jurisdiction under CERD Article 22. It directed both parties to refrain from racial discrimination and to take specified steps concerning the security, movement and property of persons in the affected areas, and required them to report on compliance. Those directions were provisional measures in that proceeding; they were not a general adjudication of every factual allegation or a final finding of responsibility.',
          'The 2011 judgment then examined the jurisdictional preconditions in Article 22. The Court distinguished earlier negotiations from negotiations addressing a CERD dispute and concluded that the relevant requirements had not been fulfilled before Georgia filed its application. The sequence shows why urgency and a provisional order cannot cure a missing jurisdictional basis at the merits stage. For a pleading exercise, students should identify the treaty clause, the precise dispute, the evidence of negotiations or other procedures, and the dates on which those steps occurred.',
          'This chronology also cautions against treating “the Court granted measures” as the only outcome worth studying. A complete case note tracks the application, request, hearing, order, preliminary objections and jurisdictional judgment, then reports what remained undecided. The ICJ’s official materials are primary sources for its procedural history and orders; claims about events on the ground should be checked against the separate record the Court considered and not inferred from the requested relief alone.',
        ],
        failureMechanism: "The Court indicated provisional measures but later declined jurisdiction after considering CERD's preconditions. No platform index caused the order, and the case demonstrates the need to plead jurisdiction as well as urgency.",
      },
      subsections: [
        {
          title: "Cognitive Hardening via Adversarial Rehearsal",
          paragraphs: [
            "Desk 14 prevents chancellery echo chambers. Diplomatic teams frequently fall prey to groupthink, convincing themselves that their draft treaty is legally invulnerable.",
            "By forcing negotiators to formally record answers to rigorous counter-arguments, Desk 14 exposes latent jurisdictional ambiguities before adversary state legal advisors can exploit them.",
          ],
        },
        {
          title: 'Pleading evidence',
          paragraphs: [
            'A pleading head should be supported by primary legal authority and a factual record. The bus may point to records, but it does not authenticate them. Jurisdictional analysis, admissibility, evidence and remedies require counsel-specific review under the relevant forum.',
          ],
        },
        {
          title: 'Adversarial rehearsal',
          paragraphs: [
            'The adversarial chamber is a quality-control method. Challenges should be characterized by their source, strength and answer status. An “answered” label must mean the draft has a responsive provision or evidence, not merely that a team member disagrees with the critique.',
          ],
        },
        {
          title: 'Termination and severability',
          paragraphs: [
            'Termination, suspension and cure provisions should match treaty rules and domestic authority. Severability should identify which provisions survive, the consequences for benefits and whether a tribunal can preserve the parties’ reasonable reliance.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.3-D: when rupture is at least 40, Desk 13 adds a provisional-measures heading to its outline. This does not file a case or establish entitlement to relief.",
    },
  ],
  quiz: [
    {
      id: "q2-3-1",
      question: "A bilateral treaty clause designates the Permanent Court of Arbitration (PCA, base score 74) as its dispute forum, but sovereign immunity is left unaddressed, and the arbitral seat is situated within one party's capital territory. What is the operative Venue Fitness score on Desk 11?",
      options: [
        {
          id: "opt-2-3-1a",
          text: "74",
          explanation: "Incorrect. 74 is the internal base score before the platform's configured deductions.",
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
          text: "The draft treaty is treated as legally void.",
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

    {
      id: "q2-3-4",
      question: "Which proposition most accurately describes an office-continuity clause in this framework?",
      options: [
        { id: "opt-2-3-4a", text: "It automatically binds every successor government under customary law.", explanation: "Incorrect. Successor obligations require applicable treaty, constitutional and agency analysis.", correct: false },
        { id: "opt-2-3-4b", text: "It replaces ratification and forum-consent requirements.", explanation: "Incorrect. Ratification, consent and domestic authorization are separate legal questions.", correct: false },
        { id: "opt-2-3-4c", text: "It is a designed covenant for institutional continuity that must be tested against applicable law.", explanation: "Correct. Desk 10 drafts for continuity, but entry into force and enforcement depend on valid authorization and applicable law.", correct: true },
        { id: "opt-2-3-4d", text: "It guarantees treaty survival regardless of breach or institutional capture.", explanation: "Incorrect. Continuity language does not eliminate legal defenses, breach or enforcement limitations.", correct: false }
      ],
    }
  ],
  practice: [
    {
      problem: "An illustrative succession scenario has bond readings \\((B_{1},B_{2},B_{3},B_{4})=(4.0,3.5,3.0,3.5)\\), two covenants in force, and a Rupture Index of 40. Use the engine's succession-durability formula to calculate the percentage and decide whether the 55 per cent Succession Trap threshold is met. Treat these values as hypothetical inputs, not empirical observations.",
      solution: [
        "1. The mean is \\(\\mu_{B}=(4.0+3.5+3.0+3.5)/4=3.5\\). Two covenants give \\(I_{cov}=1.0\\); rupture is normalized to \\(\\tilde R=40/100=0.4\\).",
        "2. Apply the engine formula: \\(S_{raw}=0.35(3.5)+0.25(3.0)+0.25(3.5)+0.15(1.0)-0.20(0.4)=1.225+0.75+0.875+0.15-0.08=2.92\\).",
        "3. Convert to a percentage: \\(S_{\\%}=(2.92/5)\\times100=58.4\\%\\). The engine rounds to one decimal place and bounds the result between 0 and 100.",
        "4. Since \\(58.4\\%\\ge55\\%\\), the Succession Trap is not raised and this gate's numerical survival condition passes. This does not establish that the treaty is durable in practice or that the other stage gates pass.",
        "5. The scenario is only a worked calculation using stated inputs. The formula does not model currency shocks, and an office-continuity covenant does not automatically insulate any shock unless its effect is represented in the desk's actual inputs.",
      ],
    },
  ],
  readingList: [
    {
      citation: 'Vienna Convention on the Law of Treaties, 23 May 1969.',
      url: 'https://treaties.un.org/doc/Publication/UNTS/Volume%201155/volume-1155-I-18232-English.pdf',
      note: 'Primary treaty-law text.',
    },
    {
      citation: 'UN Security Council Resolution 2231 (2015).',
      url: 'https://www.undocs.org/S/RES/2231(2015)',
      note: 'Primary resolution for the JCPOA framework.',
    },
    {
      citation: 'Gary B. Born, International Commercial Arbitration, 3rd ed. (Kluwer, 2021).',
      url: 'https://lrus.wolterskluwer.com/store/product/international-commercial-arbitration-third-edition/',
      note: 'Authoritative treatise on consent, seats and enforcement.',
    },
    {
      citation: 'PCA, Abyei Arbitration (PCA case 2008-07).',
      url: 'https://pca-cpa.org/en/cases/29/',
      note: 'Primary arbitral award and tribunal record.',
    },
    {
      citation: 'ICJ, Georgia v. Russian Federation (Case 140).',
      url: 'https://www.icj-cij.org/case/140',
      note: 'Official case record for jurisdiction and provisional measures.',
    },
    {
      citation: 'Shabtai Rosenne, Provisional Measures in International Law (Oxford, 2005).',
      url: 'https://global.oup.com/academic/product/provisional-measures-in-international-law-9789004134648',
      note: 'Recognized jurisprudential treatment of interim relief.',
    },
    {
      citation: 'ICSID Convention, Regulations and Rules.',
      url: 'https://icsid.worldbank.org/resources/rules-and-regulations',
      note: 'Primary official arbitration materials.',
    },
    {
      citation: 'ICC 2021 Arbitration Rules.',
      url: 'https://iccwbo.org/dispute-resolution/dispute-resolution-services/arbitration/rules-of-arbitration/',
      note: 'Primary institutional rules.',
    },
    {
      citation: 'PCA Optional Rules for Arbitrating Disputes between Two States.',
      url: 'https://pca-cpa.org/en/services/arbitration-services/pca-arbitration-rules-2012/',
      note: 'Primary state-arbitration rules.',
    },
    {
      citation: 'International Law Commission, Draft Articles on State Responsibility (2001).',
      url: 'https://legal.un.org/ilc/texts/instruments/english/draft_articles/9_6_2001.pdf',
      note: 'Official ILC text and commentaries.',
    },
    {
      citation: 'Zimbabwe Constitution Order 1979, S.I. 1979/1600, Schedule, Chapter XIV (Independence Constitution).',
      note: 'Text of the independence constitution for checking the time-limited constitutional arrangements discussed in the Lancaster House case.',
    },
  ],
};
