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
  estimatedMinutes: 27,
  executiveLede: "Division I establishes a documented, pre-negotiation baseline for analysis before political posturing or bargaining can obscure the evidence. It maps the four-dimensional relational state vector, computes variance and the limiting bond, converts recorded field tripwires into the platform's Rupture Index, and compares a live posture with the Academy's historical reference profiles. These are internal decision aids, not empirical measurements of a society or predictions of conflict.",
  synopsis: [
    "Desk 01 accepts analyst scores across four relational bonds on a 1.0–5.0 scale and publishes the mean, population variance, limiting bond, standing, and three nearest Academy reference profiles. Their labels refer to historical cases; stored coordinates are internal heuristics, not measured historical data.",
    "Desk 02 records analyst-selected tripwires and computes a rule-based Rupture Index from their weighted share, inscribed load, and selected trend multiplier. It is not a forecast or an independently verified measure of conflict risk.",
    "Desk 03 applies severity values and bond assignments supplied by the operator. Its compound term is a fixed amplification rule, not a validated estimate of nonlinear historical causation.",
    "Desk 04 (Comparative Mirror) positions live vectors against two or three historical precedent cases simultaneously, establishing historical context without treating resemblance as a deterministic forecast.",
    "Division I establishes the foundational signals on the MissionEngine bus, enforcing Stage Gate 1 (Vector Integrity) and Stage Gate 2 (Rupture Containment) before diplomatic engagement can proceed.",
  ],
  statutoryNotice: "UDCA operational rule (not a statute): Stage Gate 1 holds until all four bonds are strictly above the 3.0 floor. Stage Gate 2 holds until rupture is computed and, at 35 per cent or higher, an independent verifier is recorded as seated.",
  learningOutcomes: [
    "Operate Desk 01 to record the four-dimensional state vector and evaluate its limiting bond against the platform's strict 3.0 gate floor.",
    "Interpret the Academy's Façade Syndrome flag without treating its internal threshold as an empirical diagnosis.",
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
        "Desk 01 records a four-dimensional state vector: \\(B = (B_{\\text{interpersonal}}, B_{\\text{communal}}, B_{\\text{intergenerational}}, B_{\\text{institutional}})\\). Each coordinate is entered by an analyst on a 1.0-to-5.0 scale; the interface permits tenths. The internal bands are Failing (1.0 to 2.0), Fragile (above 2.0 through 3.0), Viable (above 3.0 through 4.0), and Fortified (above 4.0 through 5.0). These categories organize the application's review and are not legal or scientific classifications.",
        "The desk computes the arithmetic mean \\(\\mu_{B}\\) and the minimum \\(B_{\\min}=\\min(B_1,B_2,B_3,B_4)\\). The gate rule does not allow a high coordinate to compensate for another coordinate at or below 3.0. Calling this the 'Liebig minimum' is an analogy to the limiting-factor idea in agronomy, not a diplomatic law or proof that the lowest-rated dimension objectively controls a relationship.",
        "Desk 01 computes population variance \\(\\sigma_{B}^{2}\\) across the four coordinates. The internal Façade Syndrome flag is engaged only when variance is strictly greater than 1.25, the strongest bond is at least 4.0, and the weakest is at most 2.0. This threshold is an Academy convention, not a validated social-science cutoff; a negative flag cannot establish that the relationship is healthy.",
      ],
      formulas: [F_STATE_VECTOR, F_MEAN, F_VARIANCE, F_LIEBIG, F_CASE_DISTANCE],
      caseStudy: {
        title: "The Oslo Process and Camp David Summit (1993–2000)",
        jurisdiction: "Middle Eastern Bilateral Peace Architecture",
        precedent: "Declaration of Principles on Interim Self-Government Arrangements",
        analysis: [
          "The 1993 Declaration of Principles created an interim Israeli–Palestinian framework, with further negotiations intended to address permanent-status questions. The text is a primary source for its institutions and timetable; it does not contain measurements corresponding to the Academy's four relational bonds.",
          "A retrospective Desk 01 exercise must therefore leave the historical vector unscored unless a researcher defines and documents a defensible evidence-to-score method. Assigning decimal values to interpersonal, communal, intergenerational, or institutional relations after the fact would create data that the historical record does not provide.",
          "The process encountered disputes over implementation and unresolved permanent-status issues. These can be studied through the agreement, subsequent records, and historical scholarship, while keeping dated facts distinct from each author's interpretation of why negotiations failed.",
          "The 2000 Camp David summit did not itself produce a final-status agreement. The outbreak of the Second Intifada followed in the same year, but temporal sequence alone cannot establish that a specific bond deficit, summit decision, or single event caused it. Desk 01 can organize questions for investigation; it cannot establish that causal account.",
        ],
        failureMechanism: "The public record supports analysis of an interim framework, implementation disputes, and failed permanent-status negotiations. It does not support a retrospective UDCA vector or proof that a particular model-defined bond caused the later violence.",
      },
      subsections: [
        {
          title: "Euclidean Pattern Matching Against Canonical Precedents",
          paragraphs: [
            "Desk 01 evaluates a live vector against eight Academy reference profiles using raw Euclidean distance: \\(d=\\sqrt{\\sum_{i=1}^{4}(B_i-P_i)^2}\\). The maximum distance is 8; the displayed resonance is the normalized transformation \\((1-d/8)\\times100\\). The profile coordinates are internal ratings, not historical measurements.",
            "The desk automatically ranks the three nearest historical cases. This pattern matching provides immediate operational context, showing the analytical team whether the live mission shares topological characteristics with the Good Friday Agreement, the Dayton Accords, the Algiers Agreement, or the Treaty of Versailles.",
            "Crucially, Desk 01 treats the nearest cases as analytical mirrors rather than predictive templates. Precedent data informs scenario stress-testing but never predetermines live negotiation outcomes.",
          ],
          callout: {
            kind: "definition",
            title: "The Façade Syndrome Invariant",
            paragraphs: [
              "Façade Syndrome is an internal diagnostic flag, not an empirical finding about a society. In the engine it engages only when population variance is strictly greater than 1.25, the maximum bond is at least 4.0, and the minimum bond is at most 2.0. Stage Gate 1 separately requires each bond to be strictly above 3.0.",
            ],
          },
        },
        {
          title: 'Vector source and uncertainty',
          paragraphs: [
            'In Desk 01, a score is not self-authenticating merely because it has a decimal point. The entry protocol should identify the source period, the assessor, the available evidence, a confidence judgment and the population represented. Analysts should distinguish a high-level diplomatic reading from a household or border-community reading, because a national elite can be much better informed about one sphere than another.',
            'The written analysis should identify primary sources, authority, date, source population and known omissions. It should also state the UDCA rule applied and the distinction between a platform result and a legal or factual conclusion. This prevents the model from changing categories of evidence without notice.',
            'For a postgraduate-level review, compare at least one counter-explanation and explain what evidence would alter the finding. A result should include sensitivity to missing, disputed or low-confidence inputs. Aggregate readings are therefore starting points for inquiry, not verdicts imposed on a people or institution.',
            'Implementation should preserve a remedy, a correction route and a named decision authority. A desk outcome can justify further verification or negotiation, but it should not authorize detention, retaliation or treatment of protected persons as hostile groups. Safeguards are tested through documented process and review.',
            'Where historical material is used, distinguish established fact, source interpretation and later hindsight. Footnotes or an audit trail should identify official records, recognized scholarship and primary instruments. The final judgment should disclose uncertainty and remain revisable when primary evidence is corrected.',
            'Repeated assessments should be treated as observations made under a protocol, not as a time series merely because each has a date. Before comparing two readings, verify that the same bond definitions, question wording, collection method, population, translation practice and assessor instructions were used. A change in the score may reflect a changed condition, but it may also reflect a changed sample or a revised interpretation of the scale. The record should identify which of those explanations is plausible and what evidence distinguishes them.',
            'Analysts should preserve the four coordinates before calculating a mean, minimum, variance or distance. A composite can hide offsetting changes: one dimension may improve while another declines, leaving the mean almost unchanged. A minimum score is useful for drawing attention to a binding weakness, yet it can make a very small difference around a threshold appear categorical. Report the raw vector, the derived reading, the platform rule that uses it and the uncertainty around each source as separate facts.',
            'If two assessors disagree, do not resolve the disagreement by averaging their ratings unless the assessment protocol justifies that operation. First document their evidence, definitions and reasons. A moderation process can identify whether they interpreted the same observations differently, relied on different time periods, or represented distinct populations. The disagreement may reveal a genuine distribution rather than measurement error. A record that retains dissent allows decision-makers to see where additional inquiry is valuable instead of converting uncertainty into a deceptively precise decimal.',
            'A good review also distinguishes reliability from validity. Consistent scoring under repeated use does not prove that the score measures the social or institutional condition named by the label. Conversely, disagreement does not automatically show that one observer is biased; the underlying evidence may be incomplete or the construct may not be sufficiently defined. Until a formal validation study exists, describe these readings as structured operational judgments, document the protocol, and avoid using statistical language that implies established psychometric performance.',
          ],
        },
        {
          title: 'Population variance and falsification',
          paragraphs: [
            'The variance helps expose dispersion, but it should not be treated as an independent proof of crisis. A variable may combine unlike units, or the analyst may have used convenience samples. A robust review asks whether the same low bond appears in interviews, incident records and institutional outputs. It also examines whether missing data could explain a low or high dispersion reading.',
          ],
        },
        {
          title: 'Historical interpretation',
          paragraphs: [
            'The Oslo framework, Rwanda, Dayton, Versailles and the other historical theatres are analytical references, not legal precedents whose metrics require a court to find a match. Historical conclusions change with archives, survivor testimony and later scholarship. Analysts should date every comparison, identify the competing explanation and distinguish correlation observed retrospectively from evidence available before the event.',
          ],
        },
        {
          title: 'Source reconstruction',
          paragraphs: [
            'Reconstructing a source means preserving the author, date, collection method and the population represented. A public speech and a confidential interview create different evidentiary obligations.',
            'A defensible report names the authority for the rule or fact it invokes. It separates established historical facts, disputed allegations and platform doctrine. If the applicable legal source is uncertain, the report should say so rather than raising a model output to the status of law.',
            'The analysis should identify at least one disconfirming observation and state who could challenge the result. Source triangulation may corroborate an event, but confidence should still vary if all sources derive from the same institution or political network.',
            'The recommended action should be limited to what the evidence supports. A monitoring step, preservation request or additional hearing may be more appropriate than a coercive finding. The result should state the responsible decision-maker and the time at which review occurs.',
            'Finally, the record should remain usable for correction and appeal. It should preserve dissent, seal only completed outputs and avoid presenting an internal threshold as universal truth. This is the practical distinction between a transparent operational aid and a claim of legal or scientific authority.',
          ],
        },
        {
          title: 'Variance uncertainty',
          paragraphs: [
            'Because variance is sensitive to outliers and small samples, the analysis should report sample size and test the effect of plausible missing values. A low score can be sensitive data, not objective social fact.',
          ],
        },
        {
          title: 'Distance alternatives',
          paragraphs: [
            'A close Euclidean match should be accompanied by a counter-case and a short explanation of the dimensions that diverge. Similarity is not an explanation of conduct.',
            'The Euclidean calculation gives each coordinate the same mathematical treatment after the chosen normalization. That symmetry is convenient, but it embeds a substantive assumption: a one-point difference in every bond is treated as comparable even when the evidence, social meaning or measurement reliability differs. Analysts should disclose that limitation rather than interpreting the nearest profile as a balanced or legally relevant precedent. If dimensions are measured from different populations or source periods, distance can be numerically precise while substantively incoherent.',
            'Reference-case selection should be made before interpreting the nearest result where practicable. Record the full comparison set, the profile source, the date and any internal coordinates supplied by the application. Do not select only the cases that support a preferred recommendation or omit a contradictory case because its score is inconvenient. Where a reference profile lacks transparent historical provenance, label it as a pedagogical or internal scenario rather than as an empirical reconstruction of the parties.',
          ],
        },
        {
          title: 'Remedial sequencing',
          paragraphs: [
            'The limiting bond suggests a place to begin remediation, while the neighboring bonds indicate which response could create spillover. Remedies should be reversible, monitored and subject to community review.',
          ],
        },
        {
          title: 'Tripwire correction',
          paragraphs: [
            'Corrections should not erase the prior entry. They should add a superseding record, state the cause of the revision and preserve a visible audit trail.',
          ],
        },
        {
          title: 'Corroboration levels',
          paragraphs: [
            'Rank an observation by direct observation, authenticated official record, corroborated report or uncorroborated assertion. The aggregate should not imply that all entries share the same evidentiary weight.',
          ],
        },
        {
          title: 'Threshold sensitivity',
          paragraphs: [
            'Thresholds should be reported with nearby readings. A result at 34.9 per cent is below one procedural threshold but may still represent a serious concern; a binary status is never the whole analysis.',
          ],
        },
        {
          title: 'Community exclusion and sampling',
          paragraphs: [
            'A national average can conceal geographic, linguistic, gender, class, age, or displacement-related differences. Before assigning a communal score, specify the population the estimate is intended to describe and the population actually reached. These are not interchangeable. An interview sample drawn from a capital, an official roster, or a single accessible district may systematically omit people who face the greatest barriers to participation. A score must disclose its sampling frame, collection period, access constraints, and any safety-related exclusions.',
            'The reporting unit also matters. An individual respondent can describe personal experience, but cannot automatically stand for a whole community. An official statement may describe formal policy without showing how it is applied locally. Keep source-level observations separate before aggregation, explain whether the four bond dimensions use comparable evidence, and avoid averaging away a materially different minority view. Where disaggregation could expose participants to retaliation, protect identity and document the limitation rather than publishing a small-cell statistic.',
            'A defensible record identifies who selected participants, how questions were translated, who collected responses, whether participation was voluntary, and what respondents were told about use. Consultation does not itself produce consent, and absence of a complaint does not prove satisfaction. A second collection method—such as administrative records checked against confidential interviews—can reveal disagreement, but correlated sources should not be counted as independent confirmation. These are measurement-quality requirements, not additional engine formulas.',
          ],
        },
        {
          title: 'Case disconfirmation and historical comparison',
          paragraphs: [
            'A comparison should name the proposed similarity before looking at the ranked list: for example, a shared institutional sequence, a comparable implementation bottleneck, or a similar distribution of authority. Analysts should then identify at least one feature that makes the cases importantly different. Choosing a resemblance after seeing the result invites confirmation bias, especially when a small, selected case library is used.',
            'Historical material is also vulnerable to hindsight. An event that became obvious after later archives opened may not have been knowable to a decision-maker at the time. Label contemporaneous evidence, later testimony, post-event inquiry findings, and present interpretation separately. The UN inquiry into Rwanda, for example, is a retrospective institutional assessment; its conclusions can inform lessons about response, but cannot be recast as a real-time score that an operator could have computed from a complete record in January 1994.',
            'A falsification test asks what evidence would make the analogy weaker: different parties with authority to implement, a different external guarantor, a distinct legal mandate, or a different conflict geography. If no conceivable finding could change the chosen analogy, the exercise is not functioning as a test. Desk 04 ranks reference profiles; it neither controls for confounders nor estimates the probability of a future outcome.',
            'For the Oslo process, the Declaration of Principles is evidence of an interim framework and the parties’ stated commitments at the time of signing. It is not a complete record of subsequent implementation, nor does the text measure trust, communal acceptance or institutional capacity in the platform’s four dimensions. When comparing the declaration with later events, separate the negotiated timetable and governing arrangements from the later conduct of parties, changes in political leadership, violence, and external mediation. A result that collapses those periods into one “success” or “failure” label obscures what the documents can actually establish.',
            'The same discipline applies to Rwanda. A warning document, the recipients’ response, subsequent UN decisions and a later inquiry each answer different questions. A message may show that specific allegations were conveyed to an official at a particular time; it does not, by itself, prove every allegation or establish what action was legally or operationally available. The independent inquiry can assess institutional response with the benefit of the record assembled afterward. Analysts should preserve those distinct evidentiary roles, cite the source for each claim and avoid turning an inquiry’s retrospective finding into a counterfactual assertion that one index would have prevented the genocide.',
            'A historical case library also contains a selection problem. If the library includes only celebrated settlements and dramatic collapses, it over-represents extremes and encourages a false binary. If a reference is selected because it resembles a current vector, its inclusion does not show that the similarity is unusual or predictive. State how the library was assembled, which cases were excluded, and whether the same rule was used to include both favorable and unfavorable comparisons. Treat the nearest profile as a prompt for research, not a representative sample of all peace processes.',
          ],
        },
        {
          title: 'Record limitations',
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
      statutoryRule: "UDCA Rule 2.1-A: documented case distance is diagnostic context, never a deterministic prescription. Stage Gate 1 uses the limiting bond and requires all four bonds to be strictly above 3.0.",
    },
    {
      heading: "II. Desk 02: Sentinel Matrix (The Eye of Humanity)",
      subheading: "Field Tripwires, Observation Multipliers, and the Rupture Index",
      paragraphs: [
        "Desk 02 serves as the platform's early-warning instrument. Formally titled Desk 02 (Sentinel Matrix), it converts operator-entered observations and selected indicators into a rule-based Rupture Index \\(R\\). The calculation does not verify the underlying claims; source assessment and corroboration remain separate work.",
        "The standard register has 24 tripwires with combined weight 56; the denominator also includes custom indicators. Analysts select which indicators are present. The register's scope, source quality, and omissions must accompany interpretation.",
        "The engine computes \\(R=\\min(100,\\round((O+I)\\tau))\\), where \\(O\\) is the recorded observed-weight share, \\(I\\) is inscribed shock-and-trap load capped at 30, and \\(\\tau\\) is 0.85, 1.00, or 1.15. A selected trend multiplier is an input, not proof that conditions improved or deteriorated.",
        "The internal bands are Stable below 15, Guarded from 15 to 34, Elevated from 35 to 59, and Critical at 60 or higher. At 35 the platform requires a verifier for its containment gate; at 60 the escrow instrument freezes. These are UDCA workflow thresholds, not UN classifications or general legal tests.",
      ],
      formulas: [F_RUPTURE],
      caseStudy: {
        title: "The Rwandan Pre-Genocide Escalation Trajectory (1993–1994)",
        jurisdiction: "East African Great Lakes Region",
        precedent: "The Arusha Peace Accords and UNAMIR Deployment",
        analysis: [
          "The 1993 Arusha Peace Agreement and the subsequent United Nations Assistance Mission for Rwanda (UNAMIR) record provide a documentary basis for studying the peace process and the international response. The UN's independent inquiry later examined institutional decisions and failures; its findings should be attributed to that inquiry rather than presented as a platform diagnosis.",
          "The 11 January 1994 message from UNAMIR Force Commander Roméo Dallaire to UN headquarters reported an informant's allegations and proposed action. It was a warning received by the mission, not a contemporaneous calculation of the Academy's Rupture Index, and the claims in the message should not be conflated with independently established facts.",
          "The genocide against the Tutsi began in April 1994. Historical and official sources document the violence and the failures of international action, but the record does not supply the Academy's tripwire inputs, register denominator, inscribed load, and trend multiplier for a reproducible retrospective score.",
          "A responsible Desk 02 teaching exercise can map which source documents a warning, who received it, what action followed, and what uncertainties remained. It must not claim a 78 per cent score or assert that telemetry alone would have prevented the genocide.",
        ],
        failureMechanism: "The documented case concerns warning, institutional response, and the failures examined by the UN inquiry. Any UDCA index would be a present-day analytical exercise, not a historical measurement or proof of a counterfactual outcome.",
      },
      subsections: [
        {
          title: "Latent Traps and Verification Thresholds",
          paragraphs: [
            "The application accepts a set of named traps and records whether an operator has marked them active; this is not a machine-learned cross-bond correlation or an algorithmic discovery of causation. A trap description is a hypothesis about a possible interaction. It should specify the mechanism, observable indicators, evidence that would disconfirm it, affected groups, and a proportionate response.",
            "When rupture is at least 35, the platform's Rupture Containment gate requires a verifier to be seated in the Verification Ledger. This is a UDCA rule and does not accredit a verifier automatically; the mandate and independence safeguards remain matters for the responsible mission authority.",
            "At rupture 60 or higher, the escrow instrument freezes releases. The Legal Desk's provisional-measures outline has a separate threshold of 40; neither condition automatically files a case or directs a tribunal to grant relief. These are separate application rules with different meanings.",
          ],
          callout: {
            kind: "bridge",
            title: "Bridge to Desk 07 and Desk 16",
            paragraphs: [
              "The Rupture Index published by Desk 02 travels directly across the MissionEngine bus to Desk 07 (which applies its release-freeze threshold) and Desk 16 (whose verifier-seating record is checked by Stage Gate 2). The platform does not accredit a verifier or establish that a recorded verifier is independent.",
            ],
          },
        },
        {
          title: 'Façade Syndrome safeguards',
          paragraphs: [
            'Calling a vector a Façade Syndrome result is an engine warning, not a psychological diagnosis or a finding of deception. It can justify more disaggregated verification, a source audit and remediation planning. The warning should not be used to stigmatize leaders or communities, and a high score in an interpersonal sector should not be taken as consent for a communal or minority population.',
          ],
        },
        {
          title: 'Tripwire provenance',
          paragraphs: [
            'Each tripwire record should maintain a source chain, timestamp, location, corroboration status and a revision trail. A media report, official statement and eyewitness account carry different evidentiary weight. The aggregate should remain downstream of the raw record so that an independent reviewer can recalculate or challenge it without silently rewriting the evidentiary base.',
            'A useful audit sheet should identify the exact proposition an indicator is intended to represent, the observation period, the geographic unit, the source author and any dependency between sources. For example, several news accounts may all derive from one press release; counting them as independent confirmation would overstate corroboration. Record the original source and the derivative reports separately, then explain how much each contributes to confidence. If the underlying document is unavailable, state that limitation rather than assigning it the same status as a source the reviewer can inspect.',
            'The threshold for marking an indicator present should be written before the analyst reviews the case. Otherwise, a broad label can be stretched to fit an expected outcome. For each tripwire, specify what would count as evidence for presence, what would count as absence, and what condition should remain “unknown.” Absence of reporting is not evidence that an event did not occur, especially where access to a location is restricted. An unknown value should not be converted into a negative merely to complete the arithmetic.',
            'Corrections to an indicator should preserve the earlier value, the reason for correction, the new supporting material and the identity or role of the reviewer. If a correction changes a Rupture Index band, show both readings and explain which downstream workflow conditions changed. This protects the audit from two opposite failures: concealing an error to preserve a convenient score, and treating any correction as proof of deliberate manipulation. The score is a derived view; the source history remains the object of review.',
          ],
        },
        {
          title: 'Rupture bands and limitations',
          paragraphs: [
            'The Stable, Guarded, Elevated and Critical bands are UDCA decision categories. They do not convert into percentages of factual probability and do not state that international law automatically permits or forbids a response. An escalation operator may activate a gate even while sources remain uncertain; the correct response is verification and proportional process, not a manufactured factual finding.',
            'The register’s denominator must be visible whenever the indicator set changes. The standard list has 24 tripwires with a combined weight of 56, while custom indicators can affect the working register. If a custom item is added, removed or assigned a different weight, a change in the index may reflect the measurement system as well as a change in observed conditions. A report should preserve the register version, the selected indicators, the weight basis and the date of calculation so that another reviewer can reproduce the result.',
            'The trend multiplier is an explicit scenario input. It can amplify or reduce the weighted observed share, but it does not prove a trend from observations by itself. A reviewer should ask what time series supports the selection, whether observations are comparable across periods and whether changes in access or reporting created an apparent trend. If no comparable baseline exists, the multiplier should be described as a policy assumption rather than a measured trajectory.',
            'Thresholds create discontinuities in workflow: a score just below 35 does not trigger the same verifier condition as a score at or above 35, although the underlying field conditions may be nearly identical. Reports should show the unrounded intermediate values where available, the final rounded index, the applicable band and the procedural consequence. They should also explain that the threshold is a platform rule; it does not turn a low score into proof that no harm exists or a high score into a finding that a legal response is authorized.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.1-B: when the Rupture Index is at least 35, Stage Gate 2 requires a verifier to be recorded as seated. This platform condition is not a legal rule imposed on external parties.",
    },
    {
      heading: "III. Desk 03: Compound Shock Simulation",
      subheading: "Fixed Interaction Additive and Bond-Specific Vulnerability",
      paragraphs: [
        "Desk 03 is a scenario calculator, not an empirical claim that treaties usually fail in one particular way. The analyst selects shock severities, assigns each shock to a bond, and may enter a legitimacy penalty. The result is conditional on those choices; it does not model every causal interaction among institutions or establish that a real provision would fail.",
        "For \\(n\\) active shocks with severities \\(s_k\\), the engine reports \\(S=\\min(100,\\round_1(\\sum_k s_k + (n-1)\\times1.25\\times4 + L))\\), where \\(L\\) is the non-negative legitimacy penalty. Thus each additional shock beyond the first adds a fixed 5 points before the 100-point cap. The term is additive, not exponential, and the engine does not model cognitive overload or bureaucratic paralysis.",
        "Bond deductions are separately allocated by the shock's selected bond: total severity on a coordinate is divided by ten and subtracted from the live score, with the result held at a 1.0 minimum. Without a live vector, the instrument uses its own baseline calculation. The output names the lowest resulting bond; it does not map a shock to treaty clauses or determine a first legal provision to fracture.",
        "The engine's Gate 4 asks for at least two covenants when two or more shocks are active or when the weakest bond is in the Failing band; it also checks continuity wording when rupture is at least 35. These are count-and-text checks, not a substantive certification that covenants are independent, fortified, enforceable, or adequate.",
      ],
      caseStudy: {
        title: "The 2002 Global and Inclusive Agreement and the DRC Transition",
        jurisdiction: "Central African Inter-Congolese Dialogue",
        precedent: "Global and Inclusive Agreement on Transition in DR Congo",
        analysis: [
          "The Inter-Congolese Dialogue produced the Global and Inclusive Agreement on Transition in the Democratic Republic of the Congo in December 2002. The transitional institutions included a president and four vice-presidents, a political arrangement commonly described as a '1+4' formula.",
          "The transition and the conflict in eastern Congo involved different armed actors, local political dynamics, and implementation challenges. A case analysis should identify the specific period, territory, and documentary record before connecting any event to a provision in the national agreement.",
          "The Academy's compound-shock instrument can test operator-entered hypothetical shocks. No historical input set or validated mapping is supplied here for a numerical strain score, a 'first provision to break,' or a finding that a particular clause caused renewed violence.",
          "Use the case to distinguish an agreement's institutional design from its implementation environment. A comparison may generate questions for further research, but neither a platform simulation nor the sequence of events alone establishes a causal explanation.",
        ],
        failureMechanism: "The agreement and subsequent transition are documented; the former numerical stress result and asserted clause-level failure were not. Compound-shock outputs are hypothetical unless each input and its historical basis is specified.",
      },
      subsections: [
        {
          title: "Bond vulnerability and clause review",
          paragraphs: [
            "Desk 03 reports bond-level effects from the operator's selected shock-to-bond assignments. It does not rank treaty provisions, assess clause specificity, or predict which obligation will fail first. Analysts should use the result to identify a domain for further review, not as evidence that a particular clause is defective.",
            "A separate legal review can map the affected responsibilities to draft text, evidence requirements, authority, and available remedies. Any contingency mechanism must be negotiated and checked under the applicable law; a model result does not make a trigger self-executing or authorize an escrow freeze.",
          ],
        },
        {
          title: 'Compound shock interaction',
          paragraphs: [
            'A compound stress result shows the effect of a selected policy convention. It is useful for forcing a review of staffing, logistics and institutional attention, but it is not a calibrated forecast. A real assessment should ask whether shocks strike independent institutions, whether one creates the other and whether legal duties or available funds change the response.',
            'Before entering a shock, define its source, affected bond, severity rationale, time horizon and whether it is already represented by another input. A conflict-related displacement and a disruption to public services may be related consequences of one event; entering both as wholly independent shocks can count the same underlying mechanism twice. Conversely, merging two shocks that affect distinct institutions can hide real interaction. Keep the event description separate from the severity value so that a reviewer can challenge the evidence without changing the model’s arithmetic.',
            'The legitimacy penalty should receive the same scrutiny as the shock list. It is a non-negative operator input, not a population survey or legal finding. Record who selected it, what evidence supports it, which alternative values were considered, and whether the score changes materially under those alternatives. If the result reaches the 100-point cap, disclose that the cap conceals any additional difference between scenarios. A saturated score cannot distinguish a marginally severe scenario from a much more severe input set.',
            'Use a scenario table to separate baseline, individual shocks and combined shocks. The table can show which bond is affected, how the weakest coordinate changes, which procedural thresholds are crossed, and which actions remain within the responsible authority’s mandate. It should not describe the compounded total as a probability, forecast or estimate of real institutional overload. The output is useful when it clarifies a question for decision-makers; it is misleading when it is presented as an empirical prediction unsupported by calibration.',
          ],
        },
        {
          title: 'Euclidean distance',
          paragraphs: [
            'Distance ranking compares coordinate profiles, not complete histories. It may place a live vector near a case even though the actors, institutions and applicable law differ materially. A case should be included only if the comparison explains a mechanism or opens a testable question. The report should list the counter-cases and out-of-range dimensions.',
          ],
        },
        {
          title: 'Stage Gate 1',
          paragraphs: [
            'The 3.0 floor is a prescribed application rule in this platform. It requires the four bonds to sit above the floor, which makes the limiting bond visible. If the gate is locked, the mission can still collect evidence and propose remediation, but it cannot treat UDCA readiness as established. External legal obligations remain those found by competent legal analysis.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.1-C: Gate 4 counts at least two covenants when two or more shocks are active or a bond is Failing. It does not assess their legal independence or sufficiency.",
    },
    {
      heading: "IV. Desk 04: The Comparative Mirror",
      subheading: "Cross-Theatre Topology, Historical Resemblance, and Doctrinal Humility",
      paragraphs: [
        "Desk 04 provides comparative context by displaying a live mission vector alongside selected reference profiles. Profile coordinates are application inputs, not historical measurements unless independently supported by a documented method and source.",
        "A comparison can help analysts formulate questions about institutional design, representation, implementation or continuity. It cannot show that historical actors were assessed using the Academy's four-bond scale, and a visual resemblance does not establish that the same mechanism caused outcomes across cases. State what feature is being compared and what evidence would make the comparison less useful.",
        "Desk 04 is a mirror, not a forecast. The reference profile set is selected and limited; it does not represent every peace process, control for confounders or estimate a probability of success. Historical difference should be treated as analytically important rather than as noise around a supposedly universal template.",
      ],
      caseStudy: {
        title: "The 1975 Algiers Accord on the Shatt al-Arab Waterway",
        jurisdiction: "Bilateral Boundary Dispute (Iran–Iraq)",
        precedent: "Treaty on the State Frontier and Neighbourly Relations",
        analysis: [
          "The 1975 Algiers settlement was followed by the Treaty concerning the State Frontier and Neighbourly Relations between Iran and Iraq. Its boundary provisions and the political understandings surrounding support for Kurdish groups should be read in the treaty text and contemporaneous diplomatic record, rather than reduced to an assumed personal bargain.",
          "The treaty and its later treatment offer a useful succession-and-compliance question for Desk 04. They do not contain measured values for institutional, interpersonal, or intergenerational bonds; this chapter therefore assigns no historical vector or variance to the parties.",
          "After the 1979 Iranian Revolution, Iraq declared the 1975 arrangements void in 1980 and invaded Iran; the legal and political dispute over the treaty is part of the historical record. The episode does not by itself prove that leadership change was the sole cause of the war or that a model-defined continuity clause would have prevented it.",
          "Use the comparison to ask what the instrument says about the boundary, what obligations the parties undertook, what each government later asserted, and how the dispute developed. The answers must be sourced independently of the Academy's formulas.",
        ],
        failureMechanism: "The treaty's text and its 1980 repudiation support a documented study of treaty continuity and dispute. They do not establish the invented bond scores or a single-cause explanation for the Iran–Iraq War.",
      },
      subsections: [
        {
          title: "Multi-Axis Radar Comparison and Topological Drift",
          paragraphs: [
            "Desk 04 renders comparative multi-axis overlays, allowing negotiators to visually track topological drift between the live theatre and reference cases.",
            "The visualization can make differences among selected coordinates easier to inspect. It does not demonstrate that a particular imbalance caused a historical outcome or that neglect of communal reconciliation inevitably produces boundary change. Such claims require separate evidence and a defined causal analysis.",
          ],
        },
        {
          title: 'Independent verification',
          paragraphs: [
            'The 35 per cent threshold is a normative trigger for further verification in the doctrine. An independent reviewer should receive an explicit mandate, terms of access and a protected method for correction. The platform should not assume that a seat in the ledger proves the verifier is impartial or that a report is true.',
          ],
        },
        {
          title: 'Worked vector methodology',
          paragraphs: [
            'A worked assessment should present raw values, deviations, mean, variance and minimum in separate lines. It should mark which source supports each coordinate and explain if the source population is incomplete. The conclusion should identify an action, such as targeted field inquiry, rather than describe the weakest bond as a failure of a group as a whole.',
          ],
        },
        {
          title: 'Case study method',
          paragraphs: [
            'A responsible case study identifies the decision date, the source horizon and the retrospective knowledge unavailable at the time. It names successful and failed hypotheses, explains intervening events and avoids turning a single modern illustration into a universal rule. Historical facts should be separated from UDCA labels.',
          ],
        },
      ],
      statutoryRule: "UDCA Rule 2.1-D: comparative precedent data serves as contextual reference and cannot substitute for live verification.",
    },
  ],
  quiz: [
    {
      id: "q2-1-1",
      question: "What is the primary operational objective of Desk 02 (Sentinel Matrix)?",
      options: [
        {
          id: "opt-2-1-1a",
          text: "To execute continuous automated electronic surveillance over foreign diplomatic channels.",
          explanation: "Incorrect. The UDCA is an analytical chancellery apparatus; it does not perform covert electronic surveillance.",
          correct: false,
        },
        {
          id: "opt-2-1-1b",
          text: "To aggregate operator-entered tripwires into the weighted Rupture Index and support review of possible failure traps.",
          explanation: "Correct. Desk 02 deterministically calculates an internal early-warning index from selected inputs; it does not verify the evidence or discover causal traps automatically.",
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
      question: "A live mission state vector has Interpersonal 4.8, Communal 4.2, Intergenerational 4.0, and Institutional 1.8. What governing reading does Desk 01 issue?",
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
          explanation: "Incorrect. Stage Gate 1 is an internal platform check requiring all four bonds to be strictly above 3.0.",
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
      question: "When the Rupture Index on Desk 02 reaches or exceeds 35, what UDCA gate condition applies?",
      options: [
        {
          id: "opt-2-1-3a",
          text: "All diplomatic talks must be permanently abandoned.",
          explanation: "Incorrect. The system enforces structural safeguards, not the abandonment of engagement.",
          correct: false,
        },
        {
          id: "opt-2-1-3b",
          text: "Stage Gate 2 (Rupture Containment) locks until a verifier is recorded as seated.",
          explanation: "Correct. UDCA Rule 2.1-B requires a verifier to be recorded as seated when the Rupture Index is at least 35; the platform does not itself accredit the verifier.",
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

    {
      id: "q2-1-4",
      question: "Which statement accurately distinguishes UDCA vector outputs from binding law?",
      options: [
        { id: "opt-2-1-4a", text: "The 3.0 bond floor is a rule of customary international law.", explanation: "Incorrect. The 3.0 floor is a UDCA operational clearance threshold, not a rule of customary international law.", correct: false },
        { id: "opt-2-1-4b", text: "The vector is a judicial judgment that replaces primary evidence.", explanation: "Incorrect. A vector is an analytical record, not a court judgment or substitute for evidence.", correct: false },
        { id: "opt-2-1-4c", text: "UDCA thresholds govern mission gates; binding effect depends on applicable law and valid instruments.", explanation: "Correct. The thresholds organize platform procedure, while enforceability depends on the applicable constitution, treaty, statute, contract or tribunal order.", correct: true },
        { id: "opt-2-1-4d", text: "Façade Syndrome conclusively proves that leaders acted deceptively.", explanation: "Incorrect. Façade Syndrome is an analytical alarm requiring contextual evidence; it does not prove intent.", correct: false }
      ],
    }
  ],
  practice: [
    {
      problem: "An analyst records a four-bond vector of (4.4, 3.8, 1.9, 4.1). Calculate the arithmetic mean, the population variance, identify the Liebig limiting bond, determine whether Façade Syndrome is present, and state the status of Stage Gate 1.",
      solution: [
        "1. Arithmetic Mean: \\(\\mu_{B} = \\frac{4.4 + 3.8 + 1.9 + 4.1}{4} = \\frac{14.2}{4} = 3.55\\).",
        "2. Deviations from mean: \\(4.4 - 3.55 = +0.85\\), \\(3.8 - 3.55 = +0.25\\), \\(1.9 - 3.55 = -1.65\\), \\(4.1 - 3.55 = +0.55\\).",
        "3. Squared deviations: \\(0.85^{2} = 0.7225\\), \\(0.25^{2} = 0.0625\\), \\((-1.65)^{2} = 2.7225\\), \\(0.55^{2} = 0.3025\\).",
        "4. Sum of squared deviations: \\(0.7225 + 0.0625 + 2.7225 + 0.3025 = 3.8100\\).",
        "5. Population Variance: \\(\\sigma_{B}^{2} = \\frac{3.81}{4} = 0.9525\\).",
        "6. Liebig Limiting Bond: \\(B_{\\min} = 1.9\\) (Intergenerational Bond), placing it in the Failing band (1.0 to 2.0).",
        "7. Façade Syndrome Assessment: While \\(B_{\\max} = 4.4 \\ge 4.0\\) and \\(B_{\\min} = 1.9 \\le 2.0\\), the population variance \\(\\sigma_{B}^{2} = 0.9525\\) is not strictly greater than 1.25. The flag is not engaged; this does not change the separate finding that the vector includes a bond below the viable floor.",
        "8. Stage Gate 1 Status: LOCKED. Stage Gate 1 requires all four bonds to exceed 3.0. Because the Intergenerational bond sits at 1.9, the gate holds locked until structural remediation occurs.",
      ],
    },
  ],
  readingList: [
    {
      citation: 'United Nations, Vienna Convention on the Law of Treaties, 23 May 1969, U.N.T.S. vol. 1155, no. 18232.',
      url: 'https://treaties.un.org/doc/Publication/UNTS/Volume%201155/volume-1155-I-18232-English.pdf',
      note: 'Primary treaty text on pacta sunt servanda, reservations, interpretation and termination.',
    },
    {
      citation: 'UN Security Council Resolution 1493 (2003), Democratic Republic of the Congo.',
      url: 'https://undocs.org/S/RES/1493(2003)',
      note: 'Primary Security Council record on the UN mission and conflict context following the Inter-Congolese Dialogue.',
    },
    {
      citation: 'UN Peacekeeping, UNAMIR mission archive.',
      url: 'https://peacekeeping.un.org/en/mission/past/unamir.htm',
      note: 'Official mission mandate and records for Rwanda.',
    },
    {
      citation: 'UN Secretary-General, Report of the Independent Inquiry into the Actions of the United Nations during the 1994 Genocide in Rwanda.',
      url: 'https://digitallibrary.un.org/record/223201',
      note: 'Official primary institutional inquiry.',
    },
    {
      citation: 'U.S. Department of State, Foreign Relations of the United States, 1969–1976, vol. XXVII, document 285, “Telegram from the Interests Section in Baghdad to the Department of State,” 26 April 1975.',
      url: 'https://history.state.gov/historicaldocuments/frus1969-76v27/d285',
      note: 'Contemporaneous U.S. diplomatic record used for the Algiers case; the document itself is a telegram from Baghdad dated 26 April 1975, not the treaty text.',
    },
    {
      citation: 'Treaty concerning the State Frontier and Neighbourly Relations between Iran and Iraq, signed at Baghdad, 13 June 1975, United Nations Treaty Series, vol. 1017, no. 14903.',
      url: 'https://treaties.un.org/doc/Publication/UNTS/Volume%201017/volume-1017-I-14903-English.pdf',
      note: 'Primary treaty text for the 1975 boundary settlement.',
    },
    {
      citation: 'E. Allan Lind and Tom R. Tyler, The Social Psychology of Procedural Justice (Springer, 1988).',
      url: 'https://doi.org/10.1007/978-1-4899-2115-4',
      note: 'Recognized work on procedural legitimacy and institutional relations.',
    },
    {
      citation: 'Stephen John Stedman, “Spoiler Problems in Peace Processes,” International Security 22(2), 1997.',
      url: 'https://doi.org/10.1162/isec.22.2.5',
      note: 'Peer-reviewed study of obstruction in peace processes.',
    },
    {
      citation: 'V. P. Fortna, Does Peacekeeping Work? (Princeton University Press, 2008).',
      url: 'https://doi.org/10.1515/9781400829795',
      note: 'Empirical scholarship on peace durability and implementation.',
    },
    {
      citation: 'Justus von Liebig, Familiar Letters on Chemistry (Taylor and Walton, 1843).',
      url: 'https://archive.org/details/familiarletterso00lieb',
      note: 'Primary historical source for the Law of the Minimum as analogy, not diplomatic law.',
    },
    {
      citation: 'United Nations, UNISPAL historical archive.',
      url: 'https://www.un.org/unispal/',
      note: 'Official primary document archive for Middle East agreements and diplomatic records.',
    },
  ],
};
