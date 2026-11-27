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
  estimatedMinutes: 24,
  executiveLede: "Division II turns recorded assessments into a documented engagement process: briefings, ordered questions, party-sequencing aids, conditional resource rules, track checks, and stakeholder audits. These are UDCA operational conventions. They can support review and accountability but cannot prevent political capture, establish a party's motives, or substitute for applicable law and consent.",
  synopsis: [
    "Desk 05 (Briefing Desk) automatically compiles structured chancellery memoranda directly from MissionEngine telemetry, incorporating handling caveats, formal problem statements, and the limiting bond reading.",
    "Desk 06 (Counterpart Prompter) structures bilateral and multilateral negotiation sessions phase by phase, enforcing non-leading questioning protocols, tracking counterpart tactics from live custom notes, and providing scripted responses to counterpart stalls without inferring unverified answers.",
    "Desk 07 computes normalized Euclidean distances between operator-entered party tolerance vectors and a separate relational-contagion reading. It applies the UDCA resource heads and four-tranche waterfall; neither the labels nor allocation rules are statutory law.",
    "Desk 08 (Track Sequencing) enforces synchronization between high-level Track I diplomacy and communal Track II progress, applying the Communal Bond tolerance threshold to prevent the dangerous Elite-Pact Mirage.",
    "Desk 09 (Field Audit) conducts rigorous stakeholder safeguard audits, verifying whether affected local communities have been directly consulted and documented.",
  ],
  statutoryNotice: "UDCA operational rule (not a statute): Stage Gate 3 holds when the recorded Track I lead exceeds the tolerance derived from the communal-bond band. This gate flags a sequencing condition; it does not determine whether an agreement has legal or public legitimacy.",
  learningOutcomes: [
    "Assemble standardized Chancellery Briefing Memoranda on Desk 05 without introducing unverified narrative assumptions.",
    "Conduct structured, non-leading diplomatic examinations on Desk 06 using verified prompt sequences.",
    "Calculate pairwise friction coefficients \\(f_{ij}\\) and spoiler-coalition contagion risks on Desk 07.",
    "Configure the Conditional Escrow Waterfall across its four platform-defined tranches and review the ordered release conditions.",
    "Enforce Track Sequencing rules on Desk 08 to prevent the emergence of an Elite-Pact Mirage.",
    "Execute comprehensive stakeholder safeguard audits on Desk 09 across affected borderland populations.",
  ],
  sections: [
    {
      heading: "I. Desk 05 & Desk 06: Briefing Architecture and Examination Discipline",
      subheading: "From Empirical Vector to Chancellery Script",
      paragraphs: [
        "Diplomatic memoranda can be affected by selective reporting, incomplete sources and pressure to present a coherent position. Those risks cannot be eliminated by a template. Desk 05 (Briefing Desk) assembles a formal memorandum from recorded MissionEngine telemetry while leaving the source quality, uncertainty and author responsibility visible for review.",
        "The briefing engine ingests the four-bond vector from Desk 01, the active Rupture Index from Desk 02, and the compound stress profile from Desk 03. It populates standardized chancellery sections: Operational Precedence, Handling Caveat, Sovereign Relational Posture, Governing Limiting Bond, and Doctrinal Mandates. The analyst selects the target jurisdiction and problem statement, but the core analytical findings cannot be edited or softened.",
        "Desk 06 (Counterpart Prompter) organizes ordered questions for a negotiation. A delayed or disputed answer may arise from a mandate limit, translation issue, unresolved evidence or strategic choice; the operator should not assume bad faith. The scripts are intended to establish what is known, what remains disputed and which authority can respond without asking a leading question.",
        "Each custom script line is an ordered inquiry, not a compulsory demand. Counterpart tactics are mapped from operator-entered MissionEngine notes. When a selected condition is recorded, the desk surfaces its existing follow-up question; it does not infer a concession, advance phases, publish findings or clear gates. The operator remains responsible for deciding whether the condition was recorded fairly and whether the follow-up is appropriate.",
      ],
      caseStudy: {
        title: "The Rambouillet Negotiations on Kosovo (February 1999)",
        jurisdiction: "Balkans Contact Group Diplomacy",
        precedent: "Interim Agreement for Peace and Self-Government in Kosovo",
        analysis: [
          "The February 1999 Rambouillet talks sought an interim settlement for Kosovo. The proposed text included an international military presence and an Appendix B setting out status-of-forces arrangements; those provisions became a major point of dispute. The text and the parties' public positions should be consulted directly before characterizing either side's negotiating conduct.",
          "The negotiations did not produce agreement by both delegations. The Independent International Commission on Kosovo and later scholarship offer competing accounts of the conference, the proposed terms, and the decision to use force. The claim that an appendix was inserted late, or that a specific negotiating tactic alone caused the failure, should not be stated as settled fact without a source that supports it.",
          "Desk 06 can be used as a modern exercise in drafting neutral questions about authority, consent, sequence, and the text under discussion. It cannot retroactively establish that a historical delegation was stalling or that a different interview protocol would have secured agreement.",
          "NATO commenced its air campaign on 24 March 1999, after the conference failed. That chronology is documented; it does not alone prove that the conference's outcome directly caused the campaign or resolve the legal and political dispute over the intervention.",
        ],
        failureMechanism: "The conference text, disagreement, and subsequent air campaign are documented. Claims about the timing or effect of particular negotiating tactics require attribution and cannot be inferred from the chronology alone.",
      },
      subsections: [
        {
          title: "The Doctrine of Non-Leading Examination",
          paragraphs: [
            "In relational statecraft, a leading question ('Do you agree that border stability requires immediate joint patrols?') invites diplomatic equivocation or bad-faith compliance.",
            "Desk 06 enforces neutral, boundary-defining inquiries ('What specific operational mandate will your military forces execute in Sector 4 during Phase II?'). This methodology forces counterparts to articulate concrete commitments, exposing operational gaps before treaties are signed.",
          ],
        },
        {
          title: 'Briefing evidence hierarchy',
          paragraphs: [
            'A briefing should preserve a hierarchy of findings: direct instrument output, verified primary record, secondary analysis and proposed judgment. Text copied from the MissionEngine bus should remain reproducible, while inference should carry an author and basis. This structure prevents a political preference from silently becoming telemetry.',
            'The written analysis should identify primary sources, authority, date, source population and known omissions. It should also state the UDCA rule applied and the distinction between a platform result and a legal or factual conclusion. This prevents the model from changing categories of evidence without notice.',
            'For a postgraduate-level review, compare at least one counter-explanation and explain what evidence would alter the finding. A result should include sensitivity to missing, disputed or low-confidence inputs. Aggregate readings are therefore starting points for inquiry, not verdicts imposed on a people or institution.',
            'Implementation should preserve a remedy, a correction route and a named decision authority. A desk outcome can justify further verification or negotiation, but it should not authorize detention, retaliation or treatment of protected persons as hostile groups. Safeguards are tested through documented process and review.',
            'Where historical material is used, distinguish established fact, source interpretation and later hindsight. Footnotes or an audit trail should identify official records, recognized scholarship and primary instruments. The final judgment should disclose uncertainty and remain revisable when primary evidence is corrected.',
          ],
        },
        {
          title: 'Non-leading questions',
          paragraphs: [
            'A neutral question asks who acted, what authority existed and what evidence can be produced. It avoids asking a delegate to accept the examiner’s premise. Answers should be coded by whether they admit a fact, dispute it, refer to a mandate or provide no answer. The code must not infer truth.',
            'An examiner should distinguish open prompts, clarification prompts and challenge questions in the record. An open prompt invites a narrative; a clarification prompt asks the person to explain an expression or identify a time; a challenge prompt tests a material inconsistency against a disclosed source. Each has a different purpose and risk. Mixing them without notation makes it difficult for a later reviewer to tell whether a detail came from the witness, the questioner or an interpretation of a document.',
            'Where translation is needed, preserve the original question and the interpreted version when consent and safety permit. A seemingly neutral word can carry different legal or social meaning across languages. The record should identify who interpreted, whether the interpreter had a relationship to a party, and whether a second review was requested. A corrected translation should be recorded as a correction, not silently substituted into a transcript that already informed a decision.',
            'A counterpart’s refusal to answer, request for clarification or use of a different term is not itself proof of obstruction. The examiner should record the precise question, the response, any stated reason and the procedural context. If a question concerns a protected source, confidential negotiation position or matter outside the witness’s mandate, the refusal may be reasonable. Desk 06 can organize follow-up, but it should not infer a concession, admission or motive from silence.',
          ],
        },
        {
          title: 'Stall taxonomy',
          paragraphs: [
            'A lack of domestic mandate, translation error, internal coalition conflict and deliberate delay can produce the same interruption. The operator should log the exact condition and choose the published follow-up. The desk should not convert silence into cooperation or stalling into bad faith.',
          ],
        },
        {
          title: 'Evidence control',
          paragraphs: [
            'A briefing line should identify the source and the time at which it became available. Late intelligence should not be retroactively presented as contemporaneous fact.',
            'A defensible report names the authority for the rule or fact it invokes. It separates established historical facts, disputed allegations and platform doctrine. If the applicable legal source is uncertain, the report should say so rather than raising a model output to the status of law.',
            'The analysis should identify at least one disconfirming observation and state who could challenge the result. Source triangulation may corroborate an event, but confidence should still vary if all sources derive from the same institution or political network.',
            'The recommended action should be limited to what the evidence supports. A monitoring step, preservation request or additional hearing may be more appropriate than a coercive finding. The result should state the responsible decision-maker and the time at which review occurs.',
            'Finally, the record should remain usable for correction and appeal. It should preserve dissent, seal only completed outputs and avoid presenting an internal threshold as universal truth. This is the practical distinction between a transparent operational aid and a claim of legal or scientific authority.',
          ],
        },
        {
          title: 'Question structure',
          paragraphs: [
            'A good inquiry identifies the decision to be made and asks for the facts and authority needed for that decision. It should avoid a compound premise or an answer that is impossible to disprove.',
          ],
        },
        {
          title: 'Tactical labels',
          paragraphs: [
            'A tactic can be logged as conduct observed, not as motive inferred. The log should permit a party to correct translation or mandate misunderstandings.',
          ],
        },
        {
          title: 'Weight disclosure',
          paragraphs: [
            'Any weighting system should be justified and stress-tested. Equal weights may be appropriate for a first pass, but a later instrument should not conceal the choice that produced the result.',
          ],
        },
        {
          title: 'Coalition evidence',
          paragraphs: [
            'An alleged coalition should be supported by documented coordination, not similarity in policy. The review should preserve dissent and distinguish public association from private misconduct.',
          ],
        },
        {
          title: 'Custody accountability',
          paragraphs: [
            'The escrow custodian should publish defined reconciliation reports and preserve exceptions for independent review. Reconciliation is a control, not an assurance that the original purpose was lawful.',
          ],
        },
        {
          title: 'Implementation milestones',
          paragraphs: [
            'A milestone should be observable, dated and independently verifiable. It should not depend only on a signatory’s self-certification.',
          ],
        },
        {
          title: 'Remedy design',
          paragraphs: [
            'If restitution is inadequate, remedies may include information, adjudication, return of property, public acknowledgement or service delivery. The relevant law determines which remedy is available.',
          ],
        },
        {
          title: 'Track representation',
          paragraphs: [
            'Representatives should have a mandate and a method for reporting back to those they claim to represent. Community consultation can be captured without tokenism only through transparent selection.',
          ],
        },
        {
          title: 'Mandate transparency',
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
      statutoryRule: "UDCA Rule 2.2-A: Desk 05 briefings derive from recorded telemetry. Desk 06 prompt sequences do not infer unstated counterpart concessions.",
    },
    {
      heading: "II. Desk 07: De-confliction Bench, Friction, and the Escrow Waterfall",
      subheading: "Seating Delegations, Spatial Friction, and Capital Insulation",
      paragraphs: [
        "Desk 07 computes the pairwise friction coefficient as normalized Euclidean distance: \\(f_{ij}=\\lVert T_i-T_j\\rVert/8\\), rounded to two decimals. The four tolerance coordinates range from 1.0 to 5.0, so 8 is the maximum possible distance. The resulting number compares declared vectors; it does not measure hostility, ideology, responsibility, or probability of violence.",
        "The separate relational-contagion function uses the bond-vector standard deviation, shock count, friction-pair count, rupture reading, and relational deficit. It raises an alert at 50 and a critical lock at 75. A single high-friction pair and a rupture reading alone do not determine contagion, and the engine does not infer a coordinated spoiler coalition or motive from that score.",
        "The resource instrument names Community Restitution Trust, Cross-Border Corridor Infrastructure, and Joint Demarcation & Monitoring as allocation heads. A 30 per cent communal allocation floor is a UDCA rule in this chapter, not a universal statutory requirement; the instrument's head labels and threshold do not determine property rights or entitlement under local law.",
        "The waterfall is a simulation of ordered conditional release, not an actual escrow account or enforceable trust. Its default shares are 25, 25, 30, and 20 per cent; each tranche requires its own condition and all earlier conditions. Rupture at 60 or above freezes release. Contract formation, custodian duties, applicable law, audit access, and remedies must be established outside the simulation.",
      ],
      formulas: [F_FRICTION, F_CONTAGION, F_DEFICIT, F_ESCROW_CHAIN, F_ESCROW_CONSERVATION, F_ESCROW_RELEASE],
      caseStudy: {
        title: "The Lusaka Protocol Implementation in Angola (1994–1998)",
        jurisdiction: "Southern African Civil Conflict (MPLA–UNITA)",
        precedent: "The Lusaka Protocol and UNAVEM III Mandate",
        analysis: [
          "The Lusaka Protocol, signed in November 1994, provided for a ceasefire, disarmament, and political arrangements involving the Government of Angola and UNITA. The UN Security Council established UNAVEM III to support implementation; its mandate and the Secretary-General's reporting provide a contemporaneous record of the process.",
          "The agreement did not end the conflict permanently. UN reporting describes implementation difficulties and renewed fighting; these sources support analysis of compliance and monitoring, not a retrospective numerical friction coefficient between two named individuals.",
          "No source cited here establishes that donors used a particular escrow model, that affected communities received zero restitution, or that escrow would have prevented renewed fighting. The Academy's tranche waterfall is an internal design convention and must not be presented as an historical feature of Lusaka.",
          "A disciplined Desk 07 exercise compares the agreement's obligations with documented implementation reports, identifies which claims are attributed to which source, and records alternative explanations. It avoids treating a hypothetical model output as evidence about the historical parties.",
        ],
        failureMechanism: "Documented implementation difficulties and renewed conflict make this a relevant case for monitoring and conditionality questions. The earlier claims about friction scores, donor disbursement, and causation by absent escrow were unsupported.",
      },
      subsections: [
        {
          title: "The Four-Tranche Conditional Escrow Waterfall",
          paragraphs: [
            "The waterfall models one way to make release contingent on ordered conditions. Its value is pedagogical: a broken commitment can be represented as a failed condition rather than hidden in narrative. It does not solve the commitment problem by itself. Parties still need an executed instrument, lawful custody, funding, a dispute mechanism, and an independent means of verifying each milestone.",
            "Default shares are 25 per cent for Mobilisation, 25 for Demarcation, 30 for Operational Commissioning, and 20 for Final Cession. The corresponding conditions are verifier seating; communal bond above 3.0; institutional bond above 3.0 with track gap within tolerance; and intergenerational bond above 3.0 with survival at or above 55. Each milestone is cumulative, so a failed earlier condition blocks later tranches even if their own indicators pass.",
            "When rupture is at least 60, the instrument sets released funds to zero. This is a platform freeze, not evidence that a real custodian has legally frozen an account or that the parties agreed to such a remedy. The operator should not describe it as a self-executing sovereign obligation unless the actual financing instrument establishes that result.",
          ],
          callout: {
            kind: "definition",
            title: "Escrow Conservation Law",
            paragraphs: [
              "The instrument checks that the four scheduled tranche shares sum to 100. Its release calculation also tracks gross milestones, clawback and performance-bond reserves. Arithmetic balance is not legal title, proof of custody, or a guarantee against a real-world transfer outside the model.",
            ],
          },
        },
        {
          title: 'Friction coefficient',
          paragraphs: [
            'Pairwise friction is a distance over declared tolerance vectors. It does not measure hatred, legal responsibility or the probability of violence. The weight scheme should be disclosed, and a high coefficient should lead to sequencing and verification, not coercive assumptions about a party.',
          ],
        },
        {
          title: 'Spoiler analysis',
          paragraphs: [
            'A spoiler is a contestable political characterization, not a fact established by a desk score. Evidence of obstruction may support a review of motives and implementation, but should also consider whether the actor is protecting a constituency or has reasonable legal objections. The alert should be narrowly scoped.',
          ],
        },
        {
          title: 'Escrow conservation',
          paragraphs: [
            'The conservation equation reconciles amounts but not legal title. Custody terms should identify the account operator, governing law, signatories, audit rights and consequences for loss or unauthorized transfer. A valid zero-balance change may still be improper if the release breached a contractual condition.',
            'A real financing instrument must define which assets are placed in custody, who can instruct the custodian, how interest and fees are treated, what happens to funds after termination, and which law governs a disputed transfer. The platform’s percentage schedule answers none of those questions. If contributions come from multiple parties, the legal documents should state whether a share is refundable, conditional, restricted to a purpose, or transferred to a beneficiary once a milestone is met.',
            'Milestones should be observable without giving the reviewer an incentive to overstate compliance. A condition such as “successful demarcation” needs an agreed map, an authorized signatory, a method for resolving boundary disagreement and a record of unresolved segments. A condition such as “community parity” needs a defined population, a transparent method for determining eligibility, protection for dissenting views and a remedy when the process excludes affected people. An indicator that cannot be independently checked is not made objective merely by connecting it to a tranche.',
            'The parties should consider cure periods and partial performance before money is frozen. A missed report, a contested measurement, and a material breach are not necessarily equivalent events. The contractual schedule can specify which failures pause a future tranche, which require notice and an opportunity to cure, and which justify suspension or recovery. The UDCA freeze is a single workflow response at a threshold; real instruments require negotiated terms consistent with their governing law and funding source.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.2-B: the Community Restitution head is set to at least 30 per cent in this operational framework. The rupture freeze at 60 is an instrument rule, not a statutory order to an external custodian.",
    },
    {
      heading: "III. Desk 08: Track Sequencing and the Elite-Pact Mirage",
      subheading: "Harmonizing Principal Diplomacy with Communal Reconciliation",
      paragraphs: [
        "Desk 08 uses the label 'Elite-Pact Mirage' for a risk that official negotiations may progress without sufficient attention to local representation, implementation capacity or public accountability. The label is an internal alert, not a finding that a community rejects an agreement or that negotiators acted in bad faith.",
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
          "The 1998 Belfast (Good Friday) Agreement set out institutions and commitments across several strands and was endorsed in referendums held on 22 May 1998 in Northern Ireland and the Republic of Ireland. Official results and the agreement itself are primary sources for the institutional design and public vote.",
          "The agreement's public endorsement is evidence of electoral support at that time; it does not establish that all communities participated equally, that every civic group was represented in negotiations, or that social consent was uniform. Those questions require additional historical and electoral evidence.",
          "The Academy's Track I/Track II phases and track-gap variable are internal tools. No contemporaneous phase series exists in the sources cited here, so the historical value of \\(\\Delta_{\\text{track}}\\) cannot be set to zero or otherwise calculated from the referendum results.",
          "The case is useful for distinguishing negotiated institutional design, party participation, public endorsement, and later implementation. It cannot establish that synchronization alone caused the agreement's adoption or durability.",
        ],
        failureMechanism: "The agreement and referendum results document both negotiated provisions and public endorsement. They do not prove complete grassroots representation or provide a historical measurement of the platform's track-gap indicator.",
      },
      subsections: [
        {
          title: "The Mechanics of Track Resynchronization",
          paragraphs: [
            "When the alert is triggered, the operator should identify which recorded track condition is driving it and who has authority to respond. A pause in Track I drafting or additional Track II consultation may be appropriate, but neither is automatically required by law or by the mathematical alert itself.",
            "Possible responses include a defined consultation, clarification of mandates, review of implementation resources or a joint timetable for unresolved questions. Town halls, commercial reopening and prisoner-related measures are context-dependent options, not universal prerequisites. Any proposed step should be safe, within the participants' authority and open to review by affected groups.",
          ],
        },
        {
          title: 'Tranche triggers',
          paragraphs: [
            'Each tranche trigger needs objective evidence, a decision maker, a cure period and a dispute route. Mobilization, demarcation, communal parity and succession are mutually related. Releasing money should not imply that a later legal or factual problem has disappeared.',
          ],
        },
        {
          title: 'Community restitution',
          paragraphs: [
            'The 30 per cent restitution rule is a UDCA allocation doctrine. It does not determine who is entitled under property law or whether compensation is the appropriate remedy. Beneficiaries, eligibility, consultation and grievance procedures must be defined in the underlying instrument.',
            'An allocation percentage is only a budget rule; it does not identify a rightful recipient or prove that a transfer is adequate. A real plan should define the harm or public purpose being addressed, the eligible population, how conflicting claims are resolved, and whether non-monetary remedies are available. If legal title is disputed, paying a locally recognized intermediary may expose the process to capture or exclude people whose interests are not represented by that intermediary.',
            'The grievance process should be accessible to people who cannot safely or practically use the main consultation channel. It should permit confidential complaints where appropriate, explain the limits of anonymity, prohibit retaliation, provide a tracking number or receipt, and identify an independent review route. A record of complaints is not proof that the underlying allegation is true, but a pattern can indicate a need for additional inquiry. The reporting system should protect personal data and avoid publishing small groups in a way that makes complainants identifiable.',
            'Conditional funding can also shift risk to people who did not control the underlying failure. If a public authority misses a milestone, an automatic freeze may withhold services from the same community the mechanism was intended to support. Before adopting a real clause, assess who bears the consequence, whether essential services are protected, whether a partial release or cure period is lawful, and how the parties can correct a false or incomplete verification report. The internal platform’s freeze is an analytical condition, not a normative answer to these distributional questions.',
          ],
        },
        {
          title: 'Track I and Track II',
          paragraphs: [
            'Track I and Track II describe a level of engagement, not a hierarchy of legitimacy. A civic delegate may lack a mandate, while an official may lack local acceptance. Both processes should disclose representation, conflicts and records and provide routes for affected people to challenge results.',
            'The official description of the Belfast Agreement identifies three strands: institutions for Northern Ireland, North–South cooperation, and East–West cooperation. It also distinguishes the Multi-Party Agreement from the British–Irish Agreement and records referendums on 22 May 1998, followed by entry into force on 2 December 1999. These facts show why “synchronization” cannot be reduced to a single pair of negotiation tracks. The settlement linked local political institutions with intergovernmental relationships and public endorsement, each having a different legal and political function.',
            'That architecture is a useful comparison precisely because its design cannot be converted into a UDCA Track I/Track II timeline. The Agreement’s three strands are not the same as the Academy’s two phases, and the referendum totals do not establish which groups had meaningful access to negotiation or how later implementation proceeded. An analyst should describe the source’s own categories first, then identify the limited question for which a platform comparison is being used.',
            'A sequencing plan should make clear which decisions require elected authority, which require consultation, and which are matters of technical implementation. A public meeting can gather views but does not confer legal authority; a signed text can bind its parties but does not prove broad social acceptance. If a track is delayed, document who decided to pause, whose participation is sought, the expected duration and the standard for resuming. This turns an alert into a reviewable process rather than an unexplained veto over negotiations.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.2-C: Stage Gate 3 holds when the recorded Track I lead exceeds the platform tolerance derived from the Communal Bond.",
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
          "The 2016 Final Agreement includes a comprehensive rural-reform chapter and provisions on victims, participation, and implementation. Its text is the primary source for the parties' commitments; the UN Verification Mission's mandate and reports document the verification role assigned to it.",
          "The post-agreement environment included implementation challenges and serious violence affecting social leaders and communities. Any account of the pattern, period, and responsible actors should cite a specific UN or Colombian monitoring report rather than attribute a finding to an Academy field audit.",
          "No cited source supports the earlier claim that 65 per cent of rural municipalities breached a safeguard standard, or that a UDCA instrument exposed that result and forced guarantors to change conditions. The Academy has no historical Colombian audit dataset from which to calculate that percentage.",
          "Desk 09 can structure a present-day audit plan: identify affected groups, consultation records, safety risks, access to remedy, and the authority responsible for follow-up. The checklist is a proposed analytical aid, not a substitute for the agreement's monitoring bodies or their findings.",
        ],
        failureMechanism: "The accord and UN verification mandate support analysis of implementation and safeguards. The previously asserted 65 per cent result and its claimed effect on international conditions were unsupported and are not historical findings.",
      },
      subsections: [
        {
          title: "Audit Completeness vs Legal Certification",
          paragraphs: [
            "A frequent error among junior chancellery officers is conflating audit completion with substantive compliance. Desk 09 explicitly records procedural completion: whether the mandated inspection took place.",
            "The platform's checklist and verification records do not exhaust substantive compliance. Desk 09 can organize field evidence, while applicable legal duties and any independent findings must be assessed under their own mandates and procedures.",
          ],
        },
        {
          title: 'Elite-Pact Mirage',
          paragraphs: [
            'The Mirage alert is a platform protection against premature synchronization. It does not establish that any elite acted in bad faith or that the whole population rejects an agreement. Public consent and legal ratification require separate evidence and procedure.',
          ],
        },
        {
          title: 'Field audit independence',
          paragraphs: [
            'An independent audit should use written protocols, trained personnel, data security and an escalation process for threats. The protocol should state which records are confidential and how witnesses can correct or withdraw information. An audit team must not promise outcomes it cannot control.',
          ],
        },
        {
          title: 'Consultation limits',
          paragraphs: [
            'Consultation is a process that gives affected people a meaningful opportunity to receive information and respond. It is not always consent. Consent standards for indigenous peoples, property takings or institutional ratification arise from the applicable legal rule and context.',
            'An audit plan should state its purpose before contact begins: whether it is documenting experience, testing compliance with an agreed safeguard, identifying remedy needs, or evaluating the quality of an earlier consultation. Combining these functions can confuse participants about the consequences of their answers. A person speaking to describe an impact should not be told that participation itself approves a project or waives a legal claim. The audit protocol should explain who will see the record, how it may be quoted, and how a participant can correct a material error.',
            'Sampling should be designed around the groups likely to bear different effects, not only around administrative convenience. A list of recognized organizations can miss informal residents, displaced people, people with disabilities, seasonal workers or those who distrust official channels. At the same time, a very small or identifiable group may face a heightened risk if its testimony is published. The reviewer should record what groups were reached and not reached, why, and how that limitation affects confidence. Disaggregation is useful only when privacy and safety can be preserved.',
            'A credible field audit also needs a response pathway. It should identify an authority able to address an immediate danger, an independent route for grievances, a deadline for acknowledging submissions and a way to report back on action taken. A checklist that discovers harm but has no referral or remedy mechanism risks becoming extractive research. Where a claim is outside the auditor’s mandate, the report should say who can receive it and whether the participant agreed to a referral.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.2-D: the field-audit checklist records process steps; it does not certify political or legal compliance.",
    },
  ],
  quiz: [
    {
      id: "q2-2-1",
      question: "The Communal Bond score on Desk 01 reads 2.4 (Fragile), and Track I diplomacy has advanced three phases while Track II has completed only one phase (a lead of 2). How does the Chancellery engine respond?",
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
      question: "Under the UDCA allocation convention in Rule 2.2-B, what minimum proportion of total resource allocation is assigned to the Community Restitution Trust?",
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
          explanation: "Incorrect. 20 per cent falls below the UDCA convention used by this instrument.",
          correct: false,
        },
        {
          id: "opt-2-2-2c",
          text: "30 per cent.",
          explanation: "Correct. This operational framework sets a 30 per cent minimum; it is not a general legal entitlement rule.",
          correct: true,
        },
        {
          id: "opt-2-2-2d",
          text: "50 per cent.",
          explanation: "Incorrect. The minimum used by this UDCA allocation convention is 30 per cent.",
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

    {
      id: "q2-2-4",
      question: "How should a result showing that stakeholder consultation occurred be used?",
      options: [
        { id: "opt-2-2-4a", text: "It proves substantive consent from every affected person.", explanation: "Incorrect. Completion of a consultation process does not prove universal or substantive consent.", correct: false },
        { id: "opt-2-2-4b", text: "It records procedural completion and remains distinct from compliance certification.", explanation: "Correct. Desk 09 preserves a field-audit record; substantive certification requires separate applicable authority and evidence.", correct: true },
        { id: "opt-2-2-4c", text: "It automatically releases every escrow tranche.", explanation: "Incorrect. Consultation completion is not, by itself, every tranche's release condition.", correct: false },
        { id: "opt-2-2-4d", text: "It makes community representatives state treaty officials.", explanation: "Incorrect. Consultation does not confer treaty-making authority or alter legal status.", correct: false }
      ],
    }
  ],
  practice: [
    {
      problem: "Two parties have tolerance vectors (3.0, 4.0, 2.0, 5.0) and (1.0, 2.0, 4.0, 3.0). Calculate the pairwise friction coefficient using the engine's normalized Euclidean-distance rule. If the Rupture Index is 42 per cent, state its band and whether the supplied information is enough to determine the relational-contagion alert.",
      solution: [
        "1. The coordinate differences are \\((2, 2, -2, 2)\\); their squared sum is \\(4 + 4 + 4 + 4 = 16\\).",
        "2. Euclidean distance is \\(\\sqrt{16} = 4\\). The maximum possible distance on four coordinates ranging from 1 to 5 is 8, so normalized friction is \\(4 / 8 = 0.50\\).",
        "3. A Rupture Index of 42 is in the Elevated band (35–59), and the rupture-containment gate requires a verifier when the reading is at least 35.",
        "4. The relational-contagion calculation also requires the bond vector, shock count, number of friction pairs, and relational deficit. The rupture reading and one pair's coefficient are insufficient to decide whether contagion reaches the engine's 50-point alert threshold; do not infer that it does.",
      ],
    },
    {
      problem: "Under the default waterfall schedule, rupture is 38, the verifier is seated, and only the Mobilisation condition is satisfied. Calculate gross milestone share, the default 10 per cent clawback reserve, the 5-point performance bond, and the net release. Explain why this output does not establish a real-world escrow transfer.",
      solution: [
        "1. Tranche 1's 25 per cent condition is satisfied. The later tranches are blocked in sequence, so gross met share \\(G=25\\).",
        "2. The clawback reserve is \\(K=G\\times0.10=2.5\\). The performance bond is \\(P=\\min(5,G-K)=\\min(5,22.5)=5\\).",
        "3. Since rupture 38 is below the 60-point freeze and final cession has not occurred, released share is \\(\\max(0,G-K-P)=25-2.5-5=17.5\\). The remaining gross is held in the two reserves; unmet tranches total 75.",
        "4. This verifies only the instrument's arithmetic. A real disbursement requires a valid agreement, a funded account, an authorized custodian, and evidence that the conditions were met under the governing instrument.",
      ],
    },
  ],
  readingList: [
    {
      citation: 'Harold H. Saunders, A Public Peace Process (Palgrave, 1999).',
      url: 'https://doi.org/10.1007/978-1-349-27113-3',
      note: 'Recognized work on sustained dialogue and public peace processes.',
    },
    {
      citation: 'Independent International Commission on Kosovo, The Kosovo Report: Conflict, International Response, Lessons Learned (Oxford University Press, 2000).',
      note: 'Retrospective independent inquiry used to contextualize Rambouillet and the subsequent international response; its interpretations are attributed rather than treated as uncontested fact.',
    },
    {
      citation: 'UN Security Council Resolution 976 (1995), Angola (UNAVEM III).',
      url: 'https://undocs.org/S/RES/976(1995)',
      note: 'Primary mandate record for the UN verification mission supporting implementation of the Lusaka Protocol.',
    },
    {
      citation: 'Good Friday Agreement, 10 April 1998.',
      url: 'https://www.gov.uk/government/publications/the-belfast-agreement',
      note: 'Primary agreement text published by the UK government.',
    },
    {
      citation: 'UN Verification Mission in Colombia, mandate and reports.',
      url: 'https://colombia.unmissions.org/en',
      note: 'Official institutional record of verification and reporting.',
    },
    {
      citation: 'Stephen John Stedman, “Spoiler Problems in Peace Processes,” International Security 22(2), 1997.',
      url: 'https://doi.org/10.1162/isec.22.2.5',
      note: 'Peer-reviewed analysis of spoiler behavior.',
    },
    {
      citation: 'Roger Fisher, William Ury and Bruce Patton, Getting to Yes, 3rd ed. (Penguin, 2011).',
      url: 'https://archive.org/details/gettingtoyesnego00fish',
      note: 'Classic negotiation methods for principled bargaining, not a source of binding law.',
    },
    {
      citation: 'United Nations, Guiding Principles on Business and Human Rights (2011).',
      url: 'https://www.ohchr.org/en/publications-and-resources/publications/guiding-principles-business-and-human-rights',
      note: 'Official framework for due diligence and stakeholder safeguards.',
    },
    {
      citation: 'World Bank, Environmental and Social Framework.',
      url: 'https://www.worldbank.org/en/projects-operations/environmental-and-social-framework',
      note: 'Recognized framework for consultation and grievance systems.',
    },
    {
      citation: 'Northern Ireland Statistics and Research Agency, 1998 referendum results.',
      url: 'https://www.nisra.gov.uk/statistics/election-results',
      note: 'Official referendum evidence.',
    },
    {
      citation: 'UNDP, Peacebuilding and governance resources.',
      url: 'https://www.undp.org/governance',
      note: 'Official development guidance for local institutions and participation.',
    },
  ],
};
