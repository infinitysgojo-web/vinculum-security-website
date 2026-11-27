import type { DetailedAcademyChapter } from "./academyTypes";
import {
  F_DOMINUM,
  F_DOMINUM_PHASE,
  F_SEAL,
} from "./academyFormulas";

export const CHAPTER_2_4: DetailedAcademyChapter = {
  id: "division-4",
  number: "2.4",
  eyebrow: "Module II · Chapter 2.4",
  title: "Division IV (Desks 15–18): Mission Governance & Handover",
  estimatedMinutes: 34,
  executiveLede: "Division IV brings the mission to readiness review, synthesis, verification, and handover. It applies the engine's five stage gates and twenty-item clearance schedule, derives the Dominum Index from readings already on the MissionEngine bus, and supports a documented transfer of responsibilities. A SHA-256 digest can help detect changes to the exact canonicalized payload that was hashed; it does not authenticate the truth of that payload or guarantee an outcome.",
  synopsis: [
    "Desk 15 audits five UDCA stage gates through a twenty-item clearance schedule (Articles 1.1–5.4). The derived Dominum Index is a view of existing bus readings, not an unalterable or independent measure of relational health.",
    "Desk 16 (Verification Ledger) seats accredited independent verifiers, registers reporting cadences, satisfies Stage Gate 2 requirements, and unlocks Escrow Tranche 1.",
    "Desk 17 (Mandate Handover) evaluates post-mission institutional viability via the Mandate Durability Quotient, enforcing the 80 per cent full handover clearance threshold and deducting 7 points for each unaddressed external dependency.",
    "Desk 18 compiles staged mission material into a numbered binder and can hash its defined canonical payload with SHA-256. A digest makes later comparison possible; it does not make the record immutable or authenticate its contents.",
    "The Chancellery Wire provides a read-only Signal Inspector, a view of the decision ledger, and a Handover Seal. These application records support review but do not replace a governed external archive or certify a factual claim.",
  ],
  statutoryNotice: "UDCA disposition rule (not a statute): mission disposition remains locked while a binding stage gate fails. A matching SHA-256 digest supports integrity checking of a defined payload; it does not establish truth, authorship, consent, or legal approval.",
  learningOutcomes: [
    "Execute the Mission Readiness audit on Desk 15, evaluating the five Stage Gates and twenty UDCA clearance items.",
    "Derive the composite Dominum Index \\(D\\) from its constituent four-part mathematical proof.",
    "Seat accredited independent verifiers on Desk 16 and verify the release of independent-verification locks.",
    "Audit mandate handover durability on Desk 17, evaluating the 80 per cent viability clearance threshold and dependency penalties.",
    "Compile the Chancellery Mission Binder on Desk 18 and create a SHA-256 digest for its defined canonical payload.",
    "Operate the Chancellery Wire (Signal Inspector, Decision Log, Handover Seal) to detect state divergence and preserve tamper-evident audit trails.",
  ],
  sections: [
    {
      heading: "I. Desk 15: Mission Readiness, the Five Gates, and the Dominum Index",
      subheading: "Twenty Clearances and the Mathematical Synthesis of Sovereignty",
      paragraphs: [
        "Desk 15 is the platform's audit surface for five stage gates. It can hold a UDCA disposition when a binding gate fails; it does not decide whether a treaty is legally ready for signature or replace political and legal approval.",
        "The desk audits five primary Stage Gates, each itemized through four UDCA clearance entries (Articles 1.1 through 5.4):",
        "1. Stage Gate 1 (Vector Integrity): Audits the four-bond vector from Desk 01, requiring all bonds to exceed the 3.0 floor.",
        "2. Stage Gate 2 (Rupture Containment): Audits the Rupture Index from Desk 02, requiring verifier seating if \\(R \\ge 35\\%\\).",
        "3. Stage Gate 3 (Track Synchronization): Audits track divergence from Desk 08, prohibiting unhedged Track I leads.",
        "4. Stage Gate 4 (Structural Covenants): Requires at least one covenant, two when two or more shocks are active or the weakest bond is Failing, and continuity language when rupture is at least 35.",
        "5. Stage Gate 5 (Succession Durability): Audits treaty survival from Desk 12, requiring \\(S_{\\text{treaty}} \\ge 55\\%\\).",
        "Desk 15 computes \\(D=100(0.30A+0.25F+0.25S+0.20C)\\), where \\(A=(\\mu_B-1)/4\\), \\(F=E/100\\) for released escrow (zero when frozen), \\(S=\\text{survival}/100\\), and \\(C=1-R/100\\). It returns no index until all four readings exist and publishes no signal of its own. This is a derived internal indicator, not a standalone audit or empirical measure.",
      ],
      formulas: [F_DOMINUM, F_DOMINUM_PHASE],
      caseStudy: {
        title: "UNAMSIL and the Sierra Leone Crisis of 2000",
        jurisdiction: "West African Peacekeeping and Disarmament Architecture",
        precedent: "The 1999 Lomé Peace Accord",
        analysis: [
          "The Lomé Peace Agreement of July 1999 provided for a power-sharing transition and named RUF leader Foday Sankoh to chair the Commission for the Management of Strategic Resources, National Reconstruction and Development. The agreement's text and the Sierra Leone Truth and Reconciliation Commission's report are the primary starting points for evaluating these provisions and their context.",
          "The Security Council established UNAMSIL in October 1999. In May 2000, RUF forces detained UN personnel during the crisis that followed the peace process's deterioration; the UN mission archive and the Commission's report document the event and the subsequent international response.",
          "There are no historical readings for the Academy's five gates, no verified 28 per cent succession score, and no evidence that UNAMSIL's deployment was decided by this framework. Calling the event a 'premature transition' or assigning gate failures retrospectively would confuse the internal audit with the historical record.",
          "British forces deployed in Operation Palliser in May 2000, alongside other international and Sierra Leonean actions. The episode is relevant to mission risk and mandate design, but it does not prove that a particular checklist would have prevented the crisis or that one intervention alone resolved it.",
          "A careful chronology should distinguish the peace agreement, the Security Council’s mandate for UNAMSIL, the May 2000 detention crisis, and subsequent changes in the international response. Those are related events but not a single decision point. The agreement establishes what the parties undertook; the resolution establishes the mission’s authority and assigned tasks; the mission archive and later truth commission report address different parts of implementation and accountability. Students should cite each record for the proposition it supports rather than use one document as a substitute for the whole chronology.",
          "The record also demonstrates a limitation of retrospective readiness scoring. A modern reviewer knows the crisis that followed and may be tempted to select only the indicators that make the eventual outcome appear obvious. To avoid hindsight bias, set a cutoff date and ask what evidence was available to the decision-makers at that time, what the mandate allowed them to do, and what actions were realistically within their capacity. Then separately assess later evidence and institutional findings. This produces a more useful account of decision constraints than a score constructed after the event.",
          "A counterfactual question should be framed narrowly: which particular decision or capability might plausibly have changed, what evidence supports that mechanism, and what other conditions would still have mattered? A claim that “a gate would have prevented the crisis” is too broad to test. The Academy’s gate checklist can organize a present-day discussion of mandate clarity, operational readiness and monitoring, but it cannot prove the effect of an alternative historical decision without a documented causal argument.",
        ],
        failureMechanism: "The Lomé agreement, UNAMSIL mandate, and May 2000 crisis are documented. The previous retrospective gate readings and deterministic causal claim were unsupported and have been removed.",
      },
      subsections: [
        {
          title: "Binding vs Advisory Clearances",
          paragraphs: [
            "Of the twenty engine clearances, fourteen are binding: failure of any binding item contributes to a locked mission gate.",
            "Six clearances are advisory: vector cohesion within a spread of 1.5, absence of latent traps, communal track initiation, absence of open redline flags, handover viability of at least 60 per cent, and naming an oversight body. They are reported but do not themselves lock disposition. The schedule and its distinction between binding and advisory items are platform rules, not legislation.",
          ],
        },
        {
          title: 'Gate evidence',
          paragraphs: [
            'Each gate result should link to the underlying article and source. A locked gate should remain linked to a specific missing condition rather than a general statement about readiness.',
            'A defensible report names the authority for the rule or fact it invokes. It separates established historical facts, disputed allegations and platform doctrine. If the applicable legal source is uncertain, the report should say so rather than raising a model output to the status of law.',
            'The analysis should identify at least one disconfirming observation and state who could challenge the result. Source triangulation may corroborate an event, but confidence should still vary if all sources derive from the same institution or political network.',
            'The recommended action should be limited to what the evidence supports. A monitoring step, preservation request or additional hearing may be more appropriate than a coercive finding. The result should state the responsible decision-maker and the time at which review occurs.',
            'Finally, the record should remain usable for correction and appeal. It should preserve dissent, seal only completed outputs and avoid presenting an internal threshold as universal truth. This is the practical distinction between a transparent operational aid and a claim of legal or scientific authority.',
          ],
        },
        {
          title: 'Article independence',
          paragraphs: [
            'Articles should not be collapsed into a composite score if they answer distinct legal or operational questions. The audit should report each result and explain any known dependency.',
          ],
        },
        {
          title: 'Sub-index provenance',
          paragraphs: [
            'Every sub-index should identify its data source and computation version. A result from stale or incomplete telemetry should not be presented as current readiness.',
          ],
        },
        {
          title: 'Sensitivity analysis',
          paragraphs: [
            'Sensitivity analysis varies one assumption at a time and reports whether the gate decision changes. It is more useful than an unqualified final percentage.',
            'The Dominum Index combines normalized readings from bond mean, released escrow, succession durability and rupture containment. Its weights are internal design choices, and the result is a view of those bus values rather than an independent measurement of legitimacy or wellbeing. A higher composite cannot cancel a failed binding gate, validate weak evidence, or make a treaty enforceable. The report should show the component readings beside the composite so that a reader can see which inputs drive it.',
            'Phase classification has an additional condition: the highest phase requires each bond to be strictly above 3.0. A high rounded composite with one bond at or below that floor therefore does not meet the highest-phase rule. This non-compensatory check is important because a strong mean can mask a critically weak coordinate. Explain the phase and the gate status separately; they answer different questions and should not be collapsed into a single readiness label.',
            'Escrow inputs also require temporal context. The index uses released escrow, with the frozen state represented as zero, so two snapshots taken before and after a release or freeze can differ even if the underlying bond readings do not. Record the snapshot date, the release state and the source of each component. A value copied from a prior mission state should not be presented as current merely because the same mission identifier is shown.',
          ],
        },
        {
          title: 'Verifier access',
          paragraphs: [
            'The verifier should have a prearranged right to inspect the relevant records and interview protected sources. Access conditions should state timing and confidentiality.',
          ],
        },
        {
          title: 'Conflict disclosure',
          paragraphs: [
            'A verifier should disclose financial, political and institutional interests. Recusal and appeal procedures make independence meaningful.',
          ],
        },
        {
          title: 'Ledger correction',
          paragraphs: [
            'A correction method should preserve the original entry and identify the reason for change. The presence of a correction is not itself evidence of fraud.',
          ],
        },
        {
          title: 'Seal version',
          paragraphs: [
            'The seal should state the canonicalization and serialization version. It should distinguish a hash of the data from a signature created under a private key.',
          ],
        },
        {
          title: 'Key custody',
          paragraphs: [
            'If signing is used, the key and revocation process require independent governance. Loss or compromise can invalidate the inference that a named signer approved the data.',
          ],
        },
        {
          title: 'Exit criteria',
          paragraphs: [
            'Exit should be based on measurable institutional capacity and not a fixed date alone. Critical functions should have backup personnel and funding.',
          ],
        },
        {
          title: 'Local ownership',
          paragraphs: [
            'Local ownership means legally responsible institutions exercise real authority. A long roster of externally trained staff does not establish sustainable control.',
          ],
        },
        {
          title: 'Review after handover',
          paragraphs: [
            'Post-handover review should preserve the baseline and use the same evidence standards as the pre-handover audit. It should identify which dependencies returned.',
          ],
        },
        {
          title: 'Audit completeness',
          paragraphs: [
            'UDCA doctrine supplies a procedural threshold rather than an independent finding of fact or law. The analysis should identify applicable law separately and avoid importing a platform label into a court, treaty or constitutional conclusion.',
            'A serious practice reports the strongest contrary interpretation, any affected population and the evidence needed to resolve uncertainty. It also identifies who can correct the record and how a correction changes the result.',
            'The remedy or recommendation should be proportionate, reviewable and connected to the identified risk. Monitoring, clarification and mediation may be preferable to punitive action, especially where the evidence remains incomplete.',
            'A complete chapter review ends with preserved dissent, a source trail and a list of unresolved assumptions. This permits later independent review and prevents a summarized result from becoming detached from the evidence that produced it.',
          ],
        },
        {
          title: 'Review authority',
          paragraphs: [
            'The appropriate UDCA reading is a procedural or analytical result. It does not substitute for binding international law, domestic constitutional requirements or adjudicative findings. Counsel and qualified institutions must determine the legal rule; historical accounts must be tested against primary records and recognized scholarship rather than repeated as rhetorical certainty.',
            'Before a conclusion is used, the analyst should test an alternative explanation. This includes omitted actors, changed incentives, incomplete records and selection effects. The result should identify evidence that would disconfirm it and state which assumption carries the greatest uncertainty. A close fit to a precedent does not establish causation.',
            'A recommended response should be linked to the exact finding and remain proportionate to the evidence. Where facts are uncertain, preservation, corroboration, consultation or a review hearing may be more appropriate than punishment or escalation. Responsible authority, duration and a route for appeal should be recorded.',
            'The final audit trail should preserve the original entry, any later correction and the reason for the change. It should also identify affected groups and independent reviewers. Sealing or logging a result does not prove that the underlying evidence is true; it protects the integrity of the recorded state when custody controls operate as described.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.4-A: the stage-gate audit governs platform disposition locks; the clearance schedule itemizes those internal requirements.",
    },
    {
      heading: "II. Desk 16: Verification Ledger & Desk 17: Mandate Handover",
      subheading: "Independent Verification and Sustainable Local Sovereignty",
      paragraphs: [
        "Desk 16 records verifier information and seating. Under the UDCA's internal gate rules, a Rupture Index at or above 35 requires a verifier to be recorded before Stage Gate 2 clears; the application does not independently accredit that person or establish impartiality. This platform threshold is not a general mandate of international law.",
        "Desk 16 records the selected reporting cadence, verifier information, and compliance submissions in the application's ledger. These entries are not an immutable external archive, and a recorded verifier is not thereby independently accredited.",
        "Desk 17 (Mandate Handover) addresses the final challenge of multilateral statecraft: 'Exit Shock'. When an external peacekeeping or mediation mission withdraws, fragile post-conflict institutions frequently collapse because local institutions remain dependent on external security, logistics, and financing.",
        "Desk 17 computes the Mandate Durability Quotient \\(Q_{\\text{durability}}\\). Under the platform's disposition bands, a quotient of 80 per cent or greater permits an unconditional handover status; scores from 60 through 79 permit a conditional, phased status; scores below 60 hold the status locked. Each recorded unresolved dependency deducts 7 points. These workflow results do not authorize a real-world transfer of legal powers, and reducing a score does not itself build local capacity.",
      ],
      caseStudy: {
        title: "The UNTAET Mandate Handover in East Timor (1999–2002)",
        jurisdiction: "Southeast Asian Transitional Administration",
        precedent: "UN Security Council Resolution 1272",
        analysis: [
          "Security Council Resolution 1272 (1999) established UNTAET and set out its transitional administration mandate. The mission operated until Timor-Leste's independence in May 2002; UN resolutions and Secretary-General reporting provide a basis for studying the transfer of responsibilities.",
          "The transition involved the creation and development of local institutions under a UN transitional administration. Specific claims about staffing, authority transfer, or the timing of individual functions should be tied to the relevant UN reports rather than generalized as a single 'Timorisation' policy.",
          "The case record contains no Academy handover score, 14-point dependency deduction, or 84 per cent capacity reading. Nor does the sequence establish that any single handover practice caused the later course of the independent state.",
          "Desk 17 can frame a current audit around decision authority, budget, staffing, records, public accountability, and the receiving institution's ability to perform functions without external substitution. Such an audit is a proposed framework and must be distinguished from UNTAET's own mandate and evaluations.",
        ],
        failureMechanism: "The mandate and transition are documented; the former score and causal account were not. A handover checklist is an analytical aid, not an independent evaluation of UNTAET.",
      },
      subsections: [
        {
          title: "The Six Critical Handover Tests",
          paragraphs: [
            "Desk 17 evaluates six autonomous capabilities before certifying handover: domestic revenue generation, autonomous boundary security, judicial dispute arbitration, civil infrastructure administration, emergency disaster response, and legitimate electoral succession.",
            "Handover clearance remains suspended while any of the six critical tests is failed.",
            'Each capability needs an observable definition and a responsible authority. “Domestic revenue generation” might be assessed through an enacted budget, collection records and lawful audit access, while “judicial dispute arbitration” requires evidence about jurisdiction, staffing, procedural safeguards and the ability to enforce lawful decisions. These examples describe evidence categories, not extra engine thresholds. The mission should preserve a crosswalk showing which evidence supports each capability and which legal or operational question remains unanswered.',
            'The tests also interact. Revenue supports staffing and maintenance; records and communications support security, justice and emergency response; and credible succession arrangements affect whether decisions survive leadership change. Treating the six items as independent checkboxes may conceal a shared dependency, such as a single externally operated data system or a donor-funded payroll. A handover assessment should show those links in a dependency map while leaving the chapter’s arithmetic unchanged.',
            'A failed test should identify whether the problem is authority, capacity, resources, access or evidence. The response differs: a legal authority gap may require legislation or an agreement, while a resource gap may require a funded bridge and an exit plan. A lack of evidence may require a safe demonstration rather than an assumption of failure. The assessor should not substitute a favorable narrative for a failed threshold, but should state the least disruptive step that would produce a reliable answer.',
          ],
        },
        {
          title: "Verifier mandate, independence, and safeguards",
          paragraphs: [
            "The verification threshold in this chapter is an operational rule of the UDCA, not a universal rule of international law. A verifier's authority therefore comes from the mission mandate, the parties' agreement, applicable domestic law, and the defined terms of appointment. Before seating, the record should state the question the verifier is empowered to answer, the period and territory in scope, the evidence available, and the procedure for communicating a finding. This precision prevents an operational certification from being misread as a court judgment, a finding of state responsibility, or an authorization to impose sanctions. The distinction matters most when a gate result will release resources or influence public claims about compliance.",
            "Independence is practical, not ceremonial. Appointment records should disclose the verifier's financial interests, prior work for a party, institutional dependencies, and any relationship that a reasonable observer might consider relevant. The parties should understand how conflicts are assessed, how a recusal request is made, and who may replace a verifier without selecting a more favorable outcome. Payment and logistical support should not depend on a desired conclusion. A fixed term and published scope reduce pressure to expand or narrow the inquiry after evidence appears. Where the parties jointly select a verifier, the record should still explain the selection method and preserve objections rather than equating agreement with impartiality.",
            "Access must be sufficient to test the question while bounded by lawful confidentiality, safety, and privacy protections. A protocol can distinguish records the verifier may inspect directly, records available in redacted form, and material that requires consent or protective handling. Interviews should explain purpose, confidentiality limits, recording practice, and available support in language participants can understand. The verifier should avoid exposing a source's identity merely to make a report appear more persuasive. If a necessary item cannot be inspected, the limitation should be recorded with its likely effect on confidence, not concealed by a categorical conclusion.",
            "A reproducible method begins with a defined evidence universe. The verifier should record how documents were selected, which time periods were covered, what was excluded, and whether the same event appears in more than one source. Several reports derived from one official statement are not independent corroboration simply because they have different authors. A sample should be tested for gaps that could systematically omit remote communities, minority groups, people displaced from the territory, or those unable to approach official channels. The workpaper should allow an authorized reviewer to follow each material observation back to its source without publishing protected details.",
            "Findings should separate direct observation, source testimony, documentary inference, and the verifier's assessment. A useful report states what is known, what remains disputed, and what evidence would change the conclusion. It should identify an alternative explanation and explain why it was accepted or rejected. The affected party should have a defined opportunity to correct factual errors or respond to a proposed adverse inference, subject to urgent safeguards and source protection. That opportunity is not a veto over publication; it is a check against avoidable mistakes and a way to make disagreement visible rather than burying it in a single score.",
            "The reporting cadence should be matched to the risk and the capacity to act on findings. A weekly report that no institution can review may create a paper trail without oversight, while a quarterly report may be too slow for a rapidly changing condition. Each submission should identify its observation window, the date evidence closed, unresolved requests, and any change from the previous report. An urgent notice can be separated from a periodic assessment, with a record of who received it and what interim protective action was within their authority. The verifier should not quietly alter an earlier finding; corrections should preserve the original version and explain the basis of revision.",
            "A verification ledger is useful only when its users understand what a recorded entry proves. It can show that a verifier submitted a report at a given time and that the registered record has not changed, but neither fact establishes the truth of every underlying statement. The responsible mission authority remains accountable for decisions taken on the report. It should document whether it accepts, rejects, or defers a recommendation and identify a review route. This separation protects both the verifier's independence and the decision-maker's responsibility, while making clear to parties and affected communities that the ledger is evidence of process rather than a substitute for due process.",
            "The verifier's mandate should also specify how it interacts with the five stage gates. A verifier may test a defined condition, report an observation, and identify an evidentiary gap; the verifier should not silently redefine the condition or change its threshold. If the evidence raises a concern outside the assigned scope, the report can refer it to the competent authority without presenting the referral as a finding. This keeps the gate's logic stable and prevents an independent review from becoming an unbounded political mandate. Any proposed change to scope should be documented, communicated to the parties, and applied prospectively where practicable, so that no party is surprised by a new test after the evidence has been collected.",
            "Communication should be planned for both officials and people affected by the underlying conduct. A technical report may need a public summary, but the summary should preserve the distinction between confirmed facts, contested accounts, and the verifier's assessment. It should not disclose protected identities or imply that a confidential interview is a public finding. Translation and accessible formats can determine whether a party or community can correct a material mistake. Where disclosure is restricted, the report should say that a limitation exists and describe its effect at a safe level of detail. This is more reliable than issuing a polished conclusion whose omissions are invisible to the reader.",
          ],
        },
        {
          title: "Capability transfer and dependency testing",
          paragraphs: [
            "A handover score is a structured readiness aid, not proof that a successor institution will remain stable under every future shock. The stated clearance bands govern the platform's disposition, but the decision record should also explain the evidence behind the score and the conditions under which it was measured. A high result based on a single exercise, an unusually large external budget, or temporary staffing can exaggerate durable capacity. Analysts should state whether capabilities were demonstrated in ordinary conditions, under stress, or only described in policy documents. The number must remain an entry point to review rather than a guarantee of future performance.",
            "The dependency register should name each function still supported from outside the receiving institution and identify its owner, resource, duration, and exit plan. Dependencies may include payroll processing, fuel, communications, data hosting, specialist maintenance, legal interpretation, procurement approval, or emergency transport. Each one should be connected to the public service or statutory responsibility it enables. Bundling several functions under a vague label such as 'technical assistance' hides whether the local institution could operate if one component disappeared. A transparent register also distinguishes temporary cooperation requested by the recipient from a dependency that exists because it lacks authority, trained staff, or a recurrent budget.",
            "Testing should focus on demonstrated ability rather than written assurance alone. A receiving institution can be asked to run a routine process using its own staff, records, budget authority, and escalation chain while external personnel observe without taking over. A second exercise can test a disruption: a delayed transfer, a communications outage, a personnel absence, or an urgent service request. The scenario should be realistic, safe, and agreed in advance; it should not manufacture a crisis for the sake of scoring. The record should identify what succeeded, where external intervention became necessary, and whether the shortfall was a training issue, a legal constraint, or a missing resource.",
            "Fiscal and administrative continuity deserves particular scrutiny because visible service delivery can conceal fragile financing. Reviewers should trace whether the successor can forecast revenue, authorize spending, reconcile accounts, pay staff, publish procurement decisions, and maintain essential supplies over a budget cycle. A one-time donor transfer or uncosted staffing promise is not a substitute for an approved recurrent allocation. Budget documents should be read alongside actual disbursements and service records, with disagreements documented rather than averaged away. The aim is not to demand fiscal self-sufficiency from a state that cannot reasonably achieve it; it is to identify which functions require an agreed bridge and who is accountable for that bridge.",
            "Institutional memory is another dependency. Handover plans should identify who holds the authoritative records, how they are indexed, which officials can access them, and what happens when staff rotate or leave. Training should include supervised practice and a succession path, not merely attendance certificates. Where software or technical systems support a public function, the recipient should understand the system's limits, maintenance needs, and lawful data responsibilities. If an outside contractor remains necessary, the arrangement should specify service levels, access controls, portability, and an exit route so that the institution does not lose operational control when a contract ends.",
            "Security, justice, and essential services require evidence that the chain of responsibility works across institutions. Reviewers can trace a case from the first report through referral, decision, remedy, and closure, checking whether lawful procedures and records survive the transition. Emergency preparedness can be tested through a tabletop exercise that includes local authorities, service providers, and affected communities. The objective is to identify coordination failures before they become public harms, not to simulate coercive action or to treat a group's conduct as evidence against every member. A handover plan should also identify safeguards for people who may face retaliation, displacement, or loss of access during the change in authority.",
            "When readiness is conditional, the remaining work should be expressed as specific actions with responsible owners, resources, milestones, and review dates. A dependency should not disappear from the register merely because a deadline passed. If an external function must continue temporarily, the parties should document the legal authority, funding, oversight, and conditions for extension. The decision record must preserve the chapter's stated threshold and penalty rules; a narrative explanation cannot silently waive a failed test or recalculate the quotient. This gives mission leaders room to plan a safe transition while making any continuing limitation visible to the receiving institution, the verifier, and the public bodies that must authorize it.",
            "The dependency register should be revisited whenever the operating environment or the receiving institution changes materially. A function that was independent during a stable period may become externally supported after a budget shortfall, leadership turnover, a disrupted supply route, or a new legal obligation. Reassessment should therefore compare the current evidence with the original baseline and identify whether a capability has strengthened, weakened, or simply moved to another provider. A changed provider does not necessarily mean a dependency has ended. Naming the actual control path, including any subcontractor or donor intermediary, helps the decision-maker understand who can stop the service and what continuity arrangements remain available.",
            "A phased transition needs a defined boundary between assistance and substitution. External advisers may coach, observe, or provide temporary specialist support, but the receiving institution should retain the authority to make decisions assigned to it by law. If outside staff continue to approve routine decisions in practice, local participation on paper does not establish operational ownership. The handover record should explain who exercised each decision right during the test, who was accountable for any failure, and whether the recipient can repeat the process without the adviser. This distinction supports honest reporting without treating all international assistance as harmful or assuming that immediate withdrawal is always safer.",
          ],
        },
      ],
      statutoryRule: "Rule 2.4-B: Mandate Handover requires a minimum durability quotient of 80 per cent. Each unresolved dependency deducts 7 points from the clearance baseline.",
    },
    {
      heading: "III. Desk 18: Mission Binder & The Chancellery Wire",
      subheading: "Cryptographic Integrity, the Decision Log, and the Handover Seal",
      paragraphs: [
        "Desk 18 compiles staged analytical outputs into a numbered binder view. Its index should make the scope and version of each item clear; it does not turn the source documents into an immutable archive or prove that every relevant annex is present.",
        "The Handover Seal computes SHA-256 over the application's canonical JSON payload. If a value inside that payload changes, the digest will normally differ; a digest comparison does not identify which value changed, who changed it, or whether the change was authorized. Verification also depends on retaining the expected digest and using the same canonicalization rules.",
        "The Chancellery Wire has three distinct surfaces: Signal Inspector reads bus telemetry without publishing, Decision Log presents records from the ledger store, and Handover Seal compares a digest of a defined snapshot. These are browser application surfaces, not a sovereign records authority or an external cryptographic trust service.",
        "A hash is not a digital signature. It does not show who approved a payload, establish the time of approval independently, or prove that testimony or legal claims are true. A mismatch is a reason to compare versions and inspect the record trail, not proof of tampering or misconduct.",
      ],
      formulas: [F_SEAL],
      caseStudy: {
        title: "The Chaco Peace Treaty (1938): Documentary Record and Digital-Seal Limits",
        jurisdiction: "South American Boundary Delimitation (Bolivia–Paraguay)",
        precedent: "The Chaco Peace Treaty of 1938",
        analysis: [
          "The Treaty of Peace, Friendship and Boundaries between Bolivia and Paraguay was signed in 1938 after the Chaco War. Its text is a historical diplomatic instrument that can be compared with the state held in a modern mission binder; no claim is made here that the negotiations involved document falsification or a disputed cryptographic record.",
          "SHA-256 and canonical JSON are modern technical tools, not features of the 1938 process. A digest computed today can help a recipient check whether a later payload matches the bytes represented by the same canonicalization procedure, provided the expected digest and canonicalization rules are themselves obtained from a trusted record.",
          "A matching digest does not prove that the source document was authentic, that its claims are true, that all parties saw the same version when it was created, or that a named official approved it. Those questions require provenance, access controls, signatures where appropriate, and documentary corroboration.",
          "Desk 18 should therefore describe a seal narrowly: it detects a change to the covered payload when the expected digest and canonicalization rules are available. It cannot eliminate all document risks or certify the underlying history.",
        ],
        failureMechanism: "The treaty provides a real historical instrument for demonstrating the difference between a diplomatic record and a modern integrity check. The former allegation of a falsification crisis and causal link to delay was invented and is withdrawn.",
      },
      subsections: [
        {
          title: "Cryptographic Tamper Evidence vs Subjective Truth",
          paragraphs: [
            "Chancellery officers must state the seal's limited function precisely: it provides a cryptographic digest for comparing a defined payload under the same canonicalization rules.",
            "A matching digest supports the conclusion that the compared payload matches the expected hashed representation, subject to the custody and collision-resistance assumptions of the process. It does not prove that field informants spoke the truth, that the payload was complete, or that a named official approved it; factual verification remains separate.",
          ],
        },
        {
          title: "Binder scope, canonical boundaries, and privacy",
          paragraphs: [
            "A binder should be understood as a defined snapshot, not as an all-purpose archive of every conversation or every document created during a mission. Its scope is the staged analytical output that the mission has chosen to compile: signals, decision records, and the documents represented by its tabs. The operator should be able to explain which version of each item belongs to the snapshot and which material remains outside it. A clear boundary prevents a reader from assuming that an unlisted annex was reviewed or that a later document was part of an earlier seal. The index should help a human reviewer navigate the record without implying that inclusion makes a claim accurate.",
            "Canonicalization makes byte-level comparison meaningful only when the same defined data is serialized under the same rules. The reader should distinguish a change to the mission state from a display-only difference, and should not manually reformat canonical data before verification. A digest can be reproduced only if the relevant input and serialization procedure are available; a label that says 'sealed' is not enough. This is an operational explanation of the existing seal, not a new formula or a substitute canonicalization method. The system's established serialization remains authoritative, and any future version change should be handled as a separate, explicit compatibility decision.",
            "The binder index should preserve context that affects interpretation: the mission identifier, the point in the workflow, the state of relevant gates, and the source or revision represented by an item. This context should be descriptive and traceable, not an invitation to add informal values to the canonical signal bus. A reader needs to know whether a record is a draft, a corrected item, or the version selected for disposition. If two versions are retained, the binder should make their relationship plain and identify which one was used for the reported decision. That simple distinction avoids the familiar archival problem in which a later copy appears to be the original because its date or title is unclear.",
            "Privacy should shape the binder before it is assembled. Identifiable testimony, medical details, security-sensitive locations, and information that could expose a source should not be copied into a broadly shared compilation merely because the binder can hold it. The responsible institution should determine lawful access, retention, and disclosure rules, and should consider whether a protected annex or a redacted copy is appropriate. Redaction itself changes the represented document and must not be described as the exact sealed original. Where the mandate requires preservation of an original, access controls and a separate disclosure copy can preserve evidentiary integrity while reducing avoidable exposure.",
            "The same care applies to exports and handover. A browser-local record may be under an operator's control on one device, but that does not make it an approved long-term archive or a universally recoverable backup. Before transfer, the receiving institution should know what is included, what is excluded, who is authorized to receive it, and how the recipient can verify the material without receiving unnecessary personal data. A manifest can describe the package and identify its version. The operator should use the receiving institution's approved records process rather than assuming that a local storage feature supplies legal custody, durable backup, or access control.",
            "When an item is corrected, the record should retain enough lineage to explain what changed and why. A corrected annex is not interchangeable with the copy that was previously circulated; the revised package needs its own clear identity and verification process. The earlier digest remains useful as evidence of the earlier snapshot, even when the underlying item is later found inaccurate. This avoids two opposite errors: erasing a historically relevant version, or presenting a superseded version as current. A good binder can preserve both without implying that either digest decides which factual account is true.",
            "A final scope review should be performed by a person who understands both the mission record and its information risks. The reviewer checks that required tabs are present, that restricted material is handled according to the mandate, and that each included item has a known source and status. Missing material should be listed as missing rather than recreated from memory. If the record is incomplete, the decision-maker can decide whether a limited seal is useful or whether the disposition must wait; the seal should never be used to disguise a gap in the evidentiary package.",
            "A binder's structure should help a receiving official locate the record that supports a decision without forcing that official to infer relationships from filenames. A contents list can identify the responsible desk, the item type, its version, and whether it is a source record, analysis, or decision. The description should not imply that every supporting item was independently verified. If an item references another record that is not included, the index should make that dependency visible and state where the authorized custodian can be contacted. These modest cataloguing practices improve review and reduce accidental reliance on an incomplete extract while leaving the canonical signal data and its existing order unchanged.",
            "The binder should also be designed for the reader who did not participate in the mission. Acronyms, institutional roles, dates, and decision statuses should be understandable from the record or a controlled explanatory index. Context can be supplied without copying an entire sensitive source into a wider distribution package. A clear distinction between contemporaneous records and later commentary helps prevent hindsight from being mistaken for information available to the original decision-maker. The goal is not to make every reader an expert in the underlying dispute; it is to make the record sufficiently legible that a qualified reviewer can understand the path from evidence to decision and ask a focused question where the trail breaks.",
          ],
        },
        {
          title: "Seal lifecycle, verification, and recovery",
          paragraphs: [
            "The seal lifecycle begins with a deliberate decision about what state is ready to preserve. An operator should identify the mission and the selected binder version, confirm that pending edits are complete, and make sure that the visible record corresponds to the state intended for review. Sealing an active draft can be valid if its draft status is clear, but it should not be mistaken for a final disposition. The distinction belongs in the surrounding record and operator communication, not in an improvised alteration to the canonical hash. This deliberate step reduces accidental seals and prevents a convenience action from being mistaken for approval.",
            "After the seal is created, verification asks whether the presented state is the same state that was hashed under the system's established process. If the comparison fails, the result is evidence of divergence, not evidence by itself of who changed the record, why it changed, or whether the change was improper. A legitimate correction, a changed source document, a different serialization version, or an unauthorized edit can all require investigation. The response should preserve the observed mismatch and identify the records needed to explain it. No one should infer culpability from a digest alone.",
            "A seal also has a lifecycle after successful verification. If new evidence requires a change, the correct response is not to overwrite the earlier snapshot and pretend it never existed. The responsible official should record the reason, preserve the prior version under applicable retention rules, prepare a clearly identified successor version, and repeat the review and sealing process if the new snapshot is ready. This does not create a new formula or gate. It applies ordinary version control to the evidence record so later readers can distinguish what was known at each decision point.",
            "A hash is not a digital signature. It does not by itself identify a person, prove that a named official approved the contents, or provide non-repudiation. If a mission needs attributable authorization, that must come from an appropriate governance and signing process beyond the hash described here. The seal is a tamper-evident checksum over a defined state, not a claim that SubtleCrypto authenticates a sovereign's consent. Precise language protects the value of the seal: it can demonstrate integrity within its defined boundary without being asked to establish provenance or authority it does not possess.",
            "The browser-local lifecycle also sets a practical boundary on persistence. The Handover Seal is held in the browser's session storage according to the application's design. An operator should not assume that it will survive closing the session, moving to another browser profile, or opening the mission on a different device. A required durable record must be preserved through the authorized export and records-management process, with a means for the receiving custodian to verify the relevant content. This warning is not a reason to weaken local-first behavior or to introduce a network service; it is a reason to plan custody before the browser session ends.",
            "If the expected seal is absent, unreadable, or inconsistent, the response should be explicit. The operator should preserve the available state, note the condition, consult the relevant record authority, and determine whether the mission can be safely reconstructed from retained inputs. A failed comparison must not be converted into a success-shaped fallback or a silent re-seal, because either action would erase the distinction between the original and the recovery. Where the application identifies an unreadable record, established quarantine and recovery procedures take precedence over deletion or ad hoc repair.",
            "Independent verification should use the same defined snapshot and serialization rules, and the reviewer should record what materials were available. If the original data cannot lawfully be shared, the parties can agree on a controlled review or a redacted package, but should not claim a reproduction that was not actually performed. A second reviewer may confirm the digest and still disagree with the underlying evidence or the decision drawn from it. The final handover report should keep those questions separate: whether the state matches, whether the record is complete, whether the evidence is credible, and whether the competent authority had grounds to act.",
            "The receiving institution should designate a custodian who can explain where the authoritative copy resides and who may authorize access. That role should be distinct from the analyst who prepared the assessment where local governance permits, so that later review does not depend on the original author's memory. The transfer record should identify the copy delivered, any restrictions, and how the recipient can request clarification or report a discrepancy. Custody does not require public release of protected material, and it does not turn a file transfer into legal acceptance of every conclusion. Clear responsibility makes it possible to preserve the evidence while allowing the recipient to question, correct, or supersede an earlier interpretation through an accountable process. Any difference found later should be routed to the responsible records authority with its effect on the decision clearly described. Record any later disagreement against the relevant version so a replacement file or summary cannot hide it, and identify who will review it.",
            "The seal's security depends on the surrounding process as well as the hash function. Operators should protect the device and browser session from unauthorized access, avoid leaving a sensitive mission open on a shared workstation, and follow the institution's incident procedure if a device or account may have been exposed. These are ordinary custody controls, not additional properties supplied by SHA-256. A digest can remain mathematically correct even when a device was used by an unauthorized person before sealing. Reporting that limitation plainly prevents a cryptographic term from creating misplaced confidence in the access history of a local browser.",
            "Recovery should be rehearsed before a deadline, not invented during a crisis. The mission team can identify the authorized custodian, the approved destination for an export, the information needed to reconstruct a verification, and the official who decides whether an incomplete record may be relied upon. A rehearsal should test that a receiving reviewer can locate the relevant version and understand the verification result without being given unnecessary access to unrelated material. If the expected state cannot be restored, the record should state that limitation and preserve the available evidence. A failed recovery is operationally serious, but it does not justify silently replacing a missing original with a newly generated seal.",
            'A verification protocol should specify where the expected digest is retained and how a recipient knows it belongs to the intended snapshot. If the digest and payload travel together through the same uncontrolled channel, an actor able to replace both may defeat the comparison’s practical value even though the hash function is sound. A trusted custodian, independently authenticated signature, or governed records service can provide a stronger reference point, but each requires its own access, key-management and recovery rules. The application’s digest alone should not be described as a chain of custody.',
            'The input boundary is equally important. If a document is omitted from the canonical payload, its later alteration cannot be detected by comparing the digest of the included data. If a source file changes while a summary remains the same, the digest may not reveal the source-level change unless that file is included in the sealed package. The binder manifest should therefore state which records were hashed, which were represented only by links or descriptions, and which were outside scope. A reviewer can then assess what the checksum covers without assuming it protects every annex.',
            'A mismatch should trigger a controlled comparison rather than immediate restoration from an older copy. First preserve the observed payload and expected digest, then establish whether the same canonicalization version and input set were used. Compare the mission state with prior authorized versions, record any known correction, and obtain an independent review when provenance is uncertain. Only after these steps should an authority decide whether to issue a corrected snapshot or open a misconduct inquiry. The sequence protects legitimate updates while preserving evidence of a potentially unauthorized change.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.4-C: the Handover Seal hashes a defined canonical JSON snapshot. A later digest mismatch signals divergence; the hash itself does not identify an editor or create a permanent record of the change.",
    },
  ],
  quiz: [
    {
      id: "q2-4-1",
      question: "What occurs if an analyst edits a bond score inside a mission that has already received its Handover Seal?",
      options: [
        {
          id: "opt-2-4-1a",
          text: "The application deletes the entire mission record to prevent tampering.",
          explanation: "Incorrect. The UDCA never erases mission data; corrupted or unreadable records are quarantined.",
          correct: false,
        },
        {
          id: "opt-2-4-1b",
          text: "The seal silently recomputes in the background and accepts the new score without alert.",
          explanation: "Incorrect. Silent updates would defeat the fundamental purpose of cryptographic tamper evidence.",
          correct: false,
        },
        {
          id: "opt-2-4-1c",
          text: "A later digest comparison can indicate that the covered canonical state differs, without identifying the changed field or attributing the change.",
          explanation: "Correct. A digest mismatch signals divergence in the covered payload under the expected canonicalization; it does not by itself identify an editor, prove misconduct, or guarantee a permanent log entry.",
          correct: true,
        },
        {
          id: "opt-2-4-1d",
          text: "The browser sends an automated security alert to an external cloud server.",
          explanation: "Incorrect. The UDCA is strictly browser-local and communicates with zero external servers.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-4-2",
      question: "What minimum Mandate Durability Quotient \\(Q_{\\text{durability}}\\) is required on Desk 17 to clear an unconditional mandate handover?",
      options: [
        {
          id: "opt-2-4-2a",
          text: "50 per cent.",
          explanation: "Incorrect. 50 per cent holds handover strictly locked.",
          correct: false,
        },
        {
          id: "opt-2-4-2b",
          text: "60 per cent.",
          explanation: "Incorrect. 60 to 79 per cent permits only conditional, phased handover.",
          correct: false,
        },
        {
          id: "opt-2-4-2c",
          text: "80 per cent.",
          explanation: "Correct. A durability quotient of 80 per cent or greater is required to clear full, unconditional handover.",
          correct: true,
        },
        {
          id: "opt-2-4-2d",
          text: "100 per cent.",
          explanation: "Incorrect. 100 per cent is not required by the UDCA handover convention; the internal full-handover threshold is 80 per cent.",
          correct: false,
        },
      ],
    },
    {
      id: "q2-4-3",
      question: "How many points are deducted from the Mandate Durability Quotient on Desk 17 for each unresolved operational dependency on the departing external presence?",
      options: [
        {
          id: "opt-2-4-3a",
          text: "2 points.",
          explanation: "Incorrect. 2 points is too small to deter external dependence.",
          correct: false,
        },
        {
          id: "opt-2-4-3b",
          text: "5 points.",
          explanation: "Incorrect. Five points is not the internal dependency deduction used by Desk 17.",
          correct: false,
        },
        {
          id: "opt-2-4-3c",
          text: "7 points.",
          explanation: "Correct. Each unresolved dependency deducts exactly 7 points from the durability quotient.",
          correct: true,
        },
        {
          id: "opt-2-4-3d",
          text: "15 points.",
          explanation: "Incorrect. 15 points is the mobilization tranche proportion, not the dependency penalty.",
          correct: false,
        },
      ],
    },

    {
      id: "q2-4-4",
      question: "What is the strongest accurate statement about a cryptographic handover seal?",
      options: [
        { id: "opt-2-4-4a", text: "It proves every factual assertion in the binder is historically true.", explanation: "Incorrect. Cryptography verifies recorded bytes, not truth of the underlying evidence.", correct: false },
        { id: "opt-2-4-4b", text: "It detects a later mismatch with the canonical sealed state if custody assumptions hold.", explanation: "Correct. A matching-hash process detects post-seal change under key and canonicalization assumptions, but cannot authenticate underlying truth.", correct: true },
        { id: "opt-2-4-4c", text: "It makes the mission binder a self-executing treaty.", explanation: "Incorrect. A seal has no independent treaty-making effect.", correct: false },
        { id: "opt-2-4-4d", text: "It permanently removes the need for independent verification.", explanation: "Incorrect. Integrity evidence does not replace verification of facts or institutional compliance.", correct: false }
      ],
    },
  ],
  practice: [
    {
      problem: "Assume escrow is not frozen. The bus contains a mean bond reading of 4.0, an escrow release of 90 per cent, a succession durability of 70 per cent, and a Rupture Index of 40. Compute the Dominum Index from the engine's normalized inputs and weights, then identify the phase. Explain how the phase would be classified if another scenario reached at least 75 while one bond remained exactly 3.0. For a separate Desk 17 example, a base handover score of 92 has two unresolved dependencies, each costing 7 points; calculate the resulting quotient and compare it with the 80 per cent full-handover threshold. All values are illustrative.",
      solution: [
        "1. Normalize the bond mean: \\(A=(4.0-1)/4=0.75\\). Normalize escrow release \\(F=0.90\\), succession durability \\(S=0.70\\), and containment \\(C=1-(40/100)=0.60\\).",
        "2. Apply the engine formula: \\(D=100(0.30A+0.25F+0.25S+0.20C)=100(0.225+0.225+0.175+0.120)=74.5\\). The phase is Custodial Inversion because the rounded index is at least 60 but below 75.",
        "3. Independently of the index, a bond exactly at 3.0 fails the strict viable-floor test. If a different scenario reached \\(D\\ge75\\) while any bond was at or below 3.0, the engine would still classify it as Custodial Inversion, not Self-Reinforcing Dominium.",
        "2. Calculate Mandate Durability Quotient on Desk 17:",
        "   - Initial quotient is 92 per cent.",
        "   - Two unresolved dependencies incur a penalty of \\(2 \\cdot 7 = 14\\) points.",
        "   - Final Durability Quotient: \\(Q_{\\text{durability}} = 92 - 14 = 78\\%\\).",
        "3. Evaluate Handover Clearance:",
        "   - Full unconditional handover requires \\(Q_{\\text{durability}} \\ge 80\\%\\).",
        "   - Because \\(78\\%\\) falls within the 60 to 79 per cent window, handover is CONDITIONAL: phased transition is authorized, but external technical oversight must continue until at least one dependency is eliminated.",
      ],
    },
  ],
  readingList: [
    {
      citation: 'Michael W. Doyle and Nicholas Sambanis, Making War and Building Peace (Princeton, 2006).',
      url: 'https://doi.org/10.1515/9781400835727',
      note: 'Empirical scholarship on peace operations and durability.',
    },
    {
      citation: 'UN Security Council Resolution 1272 (1999), East Timor mandate.',
      url: 'https://www.undocs.org/S/RES/1272(1999)',
      note: 'Primary UNTAET mandate.',
    },
    {
      citation: 'UN Department of Peace Operations, mission transitions.',
      url: 'https://peacekeeping.un.org/en/transition',
      note: 'Official policy context for mission exit.',
    },
    {
      citation: 'NIST, FIPS 180-4: Secure Hash Standard.',
      url: 'https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf',
      note: 'Official SHA-256 specification.',
    },
    {
      citation: 'Roland Paris, At War’s End (Cambridge, 2004).',
      url: 'https://doi.org/10.1017/CBO9780511790999',
      note: 'Recognized scholarship on peacebuilding institutionalization.',
    },
    {
      citation: 'Agenda for Peace, UN document A/47/277–S/24111 (1992).',
      url: 'https://www.un.org/sg/en/content/sg/reports/1992-06-17/agendaforpeace',
      note: 'Foundational UN report on prevention and post-conflict peacebuilding.',
    },
    {
      citation: 'UN Peacemaker, Lomé Peace Agreement archive.',
      url: 'https://peacemaker.un.org/sierra-leone-lome-agreement1999',
      note: 'Primary agreement and archival context.',
    },
    {
      citation: 'Sierra Leone Truth and Reconciliation Commission, Final Report.',
      url: 'https://www.sierraleonetrc.org/index.php',
      note: 'Official historical record of conflict and institutional failure.',
    },
    {
      citation: 'UNDP, local governance and institution-building resources.',
      url: 'https://www.undp.org/governance',
      note: 'Official guidance for durable domestic capacity.',
    },
    {
      citation: 'UN Peacekeeping, UNAMSIL mission archive.',
      url: 'https://peacekeeping.un.org/en/mission/past/unamsil/',
      note: 'Primary mission mandate and operational archive.',
    },
    {
      citation: 'Treaty of Peace, Friendship and Boundaries between Bolivia and Paraguay, signed at Buenos Aires, 21 July 1938, League of Nations Treaty Series, vol. 193, p. 59.',
      note: 'Primary diplomatic instrument used to distinguish the historical treaty record from the modern cryptographic-integrity example.',
    },
  ],
};
