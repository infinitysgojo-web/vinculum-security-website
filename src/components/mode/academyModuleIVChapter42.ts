import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import { F_DECAY, F_EXPOSURE, F_FRACTURE, F_HALF_LIFE, F_PRESERVED } from "./academyFormulas";

/**
 * Module IV, Chapter 4.2 (Phase B expansion), in the seven-part lecture structure. Every
 * figure is the one the Succession Simulator computes through decayHorizon, preservedBond and
 * fractureWindow (instruments.ts); the worked figures are re-derived in qa/academy-curriculum.test.ts.
 * Historical claims are drawn only from the open sources in the reading list.
 */
export const CHAPTER_4_2: DetailedAcademyChapter = {
  id: "decay-horizon-half-life",
  number: "4.2",
  eyebrow: "Module IV · Chapter 4.2",
  title: "The Decay Horizon (τ): Exponential Half-Life Modeling",
  estimatedMinutes: 67,
  executiveLede:
    "A relational settlement is not a static object. A bond scored at 3.8 is scored at that level on the day of the reading, under the exposures then in force. Relational capital depreciates when it is not maintained, and faster when the settlement carries unabsorbed shocks and when the early-warning matrix reads active rupture. The Decay Horizon on the Succession Simulator (Desk 12) turns that doctrine into one declared law, whose time constant the doctrine calls the horizon \\(\\tau\\) and the code computes as a decay constant \\(\\lambda\\) and a half-life \\(t_{1/2}\\).",
  synopsis: [
    "The decay constant is the sum of the unmitigated exposure \\(U\\) and the Rupture Index \\(R\\), divided by 2000, per day. Each bond then decays by first-order kinetics, \\(B_{i}(t) = \\max(1.0,\\, B_{i}(0)\\, e^{-\\lambda t})\\), and no bond is ever projected below the 1.0 sovereign floor.",
    "The stability half-life \\(t_{1/2} = \\frac{\\ln 2}{\\lambda}\\) states how many days it would take for a bond to lose half its strength if nothing were done. The critical fracture window states when the mean bond would reach the 2.0 fracture level. When the projected mean falls below 2.0 within the horizon, a change of leadership risks acute covenant failure.",
    "These are not forecasts. They are the arithmetic consequence of a declared law applied to declared inputs. The lecture reads two settlements whose clocks ran down in the open record, the Oslo interim period of 1993 to 2000 and the Angolan accords from Bicesse to Lusaka, then derives the law, sets it beside reliability engineering and the survival analysis of ceasefires, places it on the desks, and closes with the ways an operator misreads a clock.",
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
      subheading: "Two Clocks That Ran Down: The Oslo Interim Period and the Angolan Accords",
      paragraphs: [
        "An interim agreement that postpones its hardest questions does not freeze the relationship while the parties deliberate. Under the decay law, every day of unaddressed exposure and measured rupture subtracts the same fraction of whatever trust remains. The longer the core is deferred under load, the less relational capital is left to carry it when it is finally tabled.",
        "This section reads two settlements from the open record and asks of each the question the Succession Simulator asks: what load was the settlement carrying, which provisions insulated it, and how long could the bonds hold under that load if nothing changed? The cases differ in the way that matters for the law. Oslo was a long calendar that deferred its core; the first Angolan accord was a short calendar that brought its heaviest shock forward. Both clocks ran down, and the law explains why the length of the calendar was never the variable that decided it.",
      ],
      caseStudy: {
        title: "The Oslo Interim Period and the Deferred Core (1993 to 2000)",
        jurisdiction: "Government of Israel and the Palestine Liberation Organization / Middle East",
        precedent: "Declaration of Principles on Interim Self-Government Arrangements, signed at Washington on 13 September 1993 (circulated as UN document A/48/486 and S/26560); Interim Agreement (Oslo II), September 1995",
        analysis: [
          "The Declaration of Principles set a transitional period not exceeding five years, to begin upon the withdrawal from the Gaza Strip and the Jericho area. Permanent status negotiations were to begin as soon as possible and not later than the beginning of the third year of that period, and were to cover the remaining issues, among them Jerusalem, refugees, settlements, security arrangements and borders. The parties agreed that nothing in the interim arrangements should prejudice or pre-empt the outcome of those negotiations.",
          "The instrument provided its own machinery for the interim. A Joint Israeli-Palestinian Liaison Committee was to deal with coordination, issues of common interest and disputes. Under Article XV, disputes were first to be negotiated through that committee, then could go to a conciliation mechanism still to be agreed, and only upon the agreement of both parties to an arbitration committee. No third party was given a monitoring role; the United States Department of State's own history records that because the accord gave Washington no monitoring responsibilities, it was largely confined to defusing crises.",
          "The interim period carried a heavy and rising load. The Cairo Agreement of May 1994 completed the withdrawal from most of Gaza and Jericho, and the Taba agreement of September 1995 divided the West Bank into areas of differing control. In November 1995 Prime Minister Yitzhak Rabin was assassinated by an Israeli opponent of the accords, and a string of attacks by Hamas followed. The Hebron Protocol of January 1997 and the Wye River Memorandum of October 1998 were each negotiated under intensive American mediation, and disputes over implementing Wye brought down the Israeli government in January 1999.",
          "The permanent status questions were still open when the five-year period ran out. A memorandum signed at Sharm el-Sheikh in September 1999 committed the parties to begin permanent status negotiations; by December the Palestinian side had suspended them over settlement-building. The Camp David summit of July 2000 ended without a settlement on borders, Jerusalem or refugees, and the violence that began at the end of September 2000 became the al-Aqsa Intifada.",
        ],
        failureMechanism:
          "Deferring the core questions behind a fixed interim calendar, with disputes routed to a joint committee and to arbitration only by mutual consent and with no independent monitor, left the exposure of the interim period uninsulated while the date for the core approached; the bonds that were meant to carry the core had been spent by the time it was tabled.",
      },
      subsections: [
        {
          title: "The Oslo clock, read through the decay law",
          paragraphs: [
            "The premise of the interim design was that cooperation during the transitional years would build the confidence to resolve the permanent status questions. The decay law makes the hidden assumption in that premise explicit. Confidence-building measures add to the bonds; unabsorbed shocks and active rupture subtract a fixed fraction of the bonds every day. The design could succeed only if the first process outran the second, and nothing in the instrument measured whether it did.",
            "The historical record documents Yitzhak Rabin's assassination in November 1995 and subsequent electoral and implementation disputes. It does not provide an operator-entered Succession Simulator record for the Oslo process. The severity values assigned to shock categories in the software are internal parameters, not measurements derived from those events; classifying a historical event under a category and deciding whether a clause insulated it would also require an explicit, contemporaneous coding rule. This chapter therefore does not assign Oslo a shock score, exposure, decay constant, or half-life, and it does not claim that a particular clause would have altered the outcome.",
            "The following calculation is a synthetic mechanics exercise, not a reconstruction of Oslo. If a hypothetical mission enters shocks of severity 26 and 20, sets rupture to 40, and marks both shocks uninsulated, the exposure is 46 and the decay constant is \\(\\frac{86}{2000} = 0.043\\) per day, giving a half-life of about 16.1 days. If both are instead marked insulated, their combined exposure is 11.5 and the half-life is about 26.9 days. These outputs demonstrate only how the defined formula responds to those inputs; they do not establish that the categories fit Oslo, that either event had those measured severities, or that a longer interim calendar caused the historical outcome.",
          ],
          callout: {
            kind: "definition",
            title: "Deferral is not neutral time",
            paragraphs: [
              "Under the decay law, time is priced by load. A day under a decay constant of 0.043 consumes as much of each bond's remaining strength as two days under 0.0215. A calendar that defers the core does not hold the relationship still; it exposes the relationship to whatever load the interim carries, for as long as the interim lasts.",
            ],
          },
        },
        {
          title: "Angola from Bicesse to the 1992 election",
          paragraphs: [
            "The Peace Accords for Angola, known as the Bicesse Accords, were initialled at Estoril on 1 May 1991 and signed in Lisbon on 31 May 1991 by President José Eduardo dos Santos and the UNITA leader Jonas Savimbi, after talks with Portugal as mediator and the United States and the Soviet Union as observers. A de facto suspension of hostilities took effect on 15 May. The United Nations Angola Verification Mission (UNAVEM II), with up to 350 unarmed military observers, was given a narrow role: to verify that joint monitoring groups, composed and chaired by the two parties, did their work.",
            "The accords ran on a short calendar. Troops were to assemble, demobilise and form a unified army, a neutral police was to be created, and presidential and legislative elections were to be held in the autumn of 1992. By October 1991 troop assembly had fallen seriously behind schedule and the joint police monitoring groups had not been created. The unified Angolan Armed Forces came formally into being two days before the elections of 29 and 30 September 1992. By 7 October, 96,620 government troops had been demobilised, about 80 per cent of the projected figure; a much lower proportion of UNITA's troops had been.",
            "The elections were declared generally free and fair by the Special Representative. UNITA rejected the results, eleven of its generals withdrew from the unified army, and heavy fighting broke out in Luanda on 31 October 1992. In January 1993 the Secretary-General reported that Angola had to all intents and purposes returned to civil war, in a situation probably worse than before the accords were signed. His diagnosis named a root cause: the incomplete fulfilment of key provisions, among them demobilisation, the storage of weapons, the formation of the unified army and a neutral police. He added that it had been difficult to create mutual confidence in sixteen months after as many years of war.",
          ],
        },
        {
          title: "Lusaka: a longer clock that also ran down",
          paragraphs: [
            "Talks resumed in Lusaka in November 1993, chaired by the Special Representative Alioune Blondin Beye, and agreement was reached item by item over the following year. The Lusaka Protocol was initialled on 31 October and signed on 20 November 1994, its ten annexes covering the ceasefire, the quartering and demilitarisation of UNITA's forces, the completion of the unified army, the neutrality of the police, the completion of the electoral process and national reconciliation. The Security Council established UNAVEM III on 8 February 1995 to verify its implementation.",
            "This time the calendar was long, and the process proceeded, in the words of the United Nations' own account, much slower than expected. When the Council replaced UNAVEM III with an observer mission, MONUA, on 30 June 1997, three major tasks were still pending: the demilitarisation of UNITA's forces, the extension of state administration throughout the country and the transformation of UNITA's radio. The mission's military component was drawn down on a planned schedule while those tasks remained open. By mid-1998 attacks, mine-laying and troop movements were affecting eight of the eighteen provinces, the Special Representative was killed in an air crash on 26 June 1998, and in January 1999 the Secretary-General reported that the peace process had collapsed and the country was in a state of war. MONUA's mandate ended on 26 February 1999.",
          ],
        },
        {
          title: "What the two clocks teach",
          paragraphs: [
            "Bicesse and Lusaka look like opposite errors. The first calendar was too short; the second was long enough and still failed. The decay law dissolves the apparent contradiction, because it does not price time by the calendar at all. It prices time by load. Bicesse applied the heaviest succession shock a settlement can carry, a contested transfer of power, while the provisions that would have insulated it were not in force: two armies still existed, the unified army was two days old and the neutral police had not been formed. Lusaka removed that particular error but left a chronic residual load, unfinished demilitarisation and contested administration, sitting on the bonds year after year.",
            "Oslo shows the same arithmetic from a third angle. A five-year interim was neither long nor short in itself; what mattered was the load it carried and the absence of provisions that would have lowered that load's effect. In every case the question an operator should have asked was not how much time the calendar allowed but what half-life the present inputs implied, and whether the next scheduled milestone fell inside it.",
            "The cautions that governed Chapter 4.1 govern here. The desk would have known nothing that the participants did not know, and no figure in this section is a reconstruction of what a Succession Simulator would have read in Luanda or Jerusalem. The claim is narrower: the open record of all three clocks is consistent with a law in which the rate of loss depends on present load and not on elapsed time, and inconsistent with the intuition, common to all three designs, that a longer interim is a safer one.",
          ],
          callout: {
            kind: "bridge",
            title: "How the code expresses the lesson",
            paragraphs: [
              "decayHorizon takes no input for the age of the settlement or the length of its calendar. Its only inputs are the bond vector, the unmitigated exposure, the Rupture Index and the projection horizon. The constant DECAY_HORIZONS fixes the horizons at 30, 90, 180 and 365 days, so the operator reads the clock forward from today, never backward from the signature. That is the code's answer to the interim-period fallacy.",
            ],
          },
        },
      ],
      statutoryRule:
        "Rule 4.2-A: An interim instrument must carry its own decay clock. Renewals and insulating provisions are scheduled against the stability half-life, not against a political calendar.",
    },
    {
      heading: H.architecture,
      subheading: "Exposure, Insulation, Link State and the Published Readings",
      paragraphs: [
        "This section fixes the vocabulary of the instrument exactly as the Succession Simulator (SuccessionSimulator.tsx) and the instruments module (instruments.ts) define it, and in the words the Codex uses where the Codex agrees with the code. The Decay Horizon takes two inputs from the bus and one choice from the analyst; it publishes three readings to the bus and two more through the fracture window.",
      ],
      formulas: [F_EXPOSURE, F_DECAY],
      subsections: [
        {
          title: "Shocks, provisions and the unmitigated exposure",
          paragraphs: [
            "The Succession Simulator keeps its own register of ten succession shocks, each with a severity in points: the chief signatory dying or being removed within twelve months (26), capture of the oversight or judicial appointment process (24), the successor generation mobilising against the settlement (22), the governing party losing the next general election (20), donor funding falling by 40 per cent (18), a rapid demographic shift (18), the regional guarantor withdrawing attention and staff (16), national austerity reallocating the implementation budget (16), compliance reporting becoming wholly procedural (14) and international attention lapsing for three years (12). The ten severities sum to 186 points.",
            "Beside them the desk lists seven provisions, each naming the shocks it guards against: obligations that bind the office rather than the officeholder, an independent verifier no party can appoint or remove, an implementation budget protected by statute, a standing intergenerational review with binding referral, an outcome test applied to every consultation, automatic suspension of benefits on a finding of breach, and indefinite duration with a verified conclusion test. A shock is insulated when at least one provision in force lists it.",
            "The unmitigated exposure \\(U\\) is the sum over the shocks the analyst has applied of each shock's full severity if it is uninsulated and one quarter of its severity if it is insulated. Insulation therefore removes three quarters of a shock's contribution and never all of it: a provision reduces the effect of a shock on time, it does not make the shock impossible. Analyst-defined shocks and provisions inscribed through the Sovereign Inscription tray enter the same sum on the same terms.",
            "Insulation is a binary property of each shock, not a sum of the provisions that touch it. A shock guarded by two provisions in force contributes the same quarter as a shock guarded by one, so a second provision on a shock that is already insulated buys no time at all; the desk also publishes the exposure, rounded to two decimals, as unmitigatedExposure. The drafting lesson follows directly from the arithmetic: breadth of coverage across the register is worth more than depth of coverage on any single shock, and a draft that piles three clauses onto the most discussed risk while leaving a heavier one bare has misallocated its effort.",
          ],
          callout: {
            kind: "definition",
            title: "Decay constant, half-life and preserved bond",
            paragraphs: [
              "Decay constant \\(\\lambda\\): \\(\\frac{\\max(0,\\, U + R)}{2000}\\) per day, computed by decayHorizon and published as decayConstant to four decimals.",
              "Stability half-life \\(t_{1/2}\\): \\(\\frac{\\ln 2}{\\lambda}\\) days when \\(\\lambda\\) is positive, published as stabilityHalfLifeDays to one decimal; the engine returns no value and the bus carries zero when there is no decay to model.",
              "Preserved bond: \\(B_{i}(t) = \\max(1.0,\\, B_{i}(0)\\, e^{-\\lambda t})\\), computed by preservedBond, with the floor at SOVEREIGN_FLOOR, which is 1.0.",
            ],
          },
        },
        {
          title: "The rupture term and the link state",
          paragraphs: [
            "The Rupture Index enters the decay constant from the Sentinel Matrix, Desk 02, but only while the Succession Simulator is linked to the bus. Under override the desk takes \\(R\\) as zero and only the exposure drives decay. The link state therefore changes the meaning of every figure the desk shows: a half-life read under override is the half-life of the succession provisions alone, and a half-life read linked is the half-life of the whole settlement.",
            "The code imposes no upper bound on \\(U\\). The Codex records that the doctrinal specification once described the exposure as bounded between 0 and 100; the production code does not, and the Codex follows the code. With all ten registered shocks applied and uninsulated and a Rupture Index of 100, the combined load is 286 and the half-life about 4.8 days. The only clamp is the floor at zero on the sum, which guards against a negative or malformed input.",
          ],
        },
        {
          title: "Horizons, curve, mean loss and the fracture window",
          paragraphs: [
            "The analyst chooses one of the four horizons fixed in DECAY_HORIZONS: 30, 90, 180 or 365 days. For that horizon the desk projects each bond, rounds each projection to two decimals, samples a seven-point curve of the mean bond at evenly spaced days from zero to the horizon, and reports the mean loss across the four bonds, computed from the already rounded projections and published as projectedDegradation. Because the mean loss depends on the horizon chosen, two readings of the bus taken under different horizons carry different degradation figures for the same mission, and the horizon must be cited with the figure.",
            "The fracture window is computed by fractureWindow from the present mean bond and the decay constant. It states the number of days, and the months at 30.44 days a month, until the mean bond would fall to FRACTURE_LEVEL, which is 2.0, the level at which the standing reads Fractured. It is zero when the mean is already at or below 2.0 and undefined when there is no decay. Its band is stable above 24 months, monitored above 12, acute above 6 and imminent otherwise; the desk publishes fractureMonths and fractureSeverity.",
          ],
        },
        {
          title: "Codex grounding: the price of inaction",
          paragraphs: [
            "The Codex states the purpose of the instrument in a sentence worth keeping: the projection is the trajectory the settlement would follow if the present reading were frozen in place, and its doctrinal purpose is to show principals the price of inaction, not to forecast what they will do. An envoy who can say that on present exposures a settlement has a half-life of nineteen days has given principals a figure they can contest, verify and act upon; one who says only that the situation is deteriorating has given them nothing.",
            "The Codex is equally clear about what the instrument does not encode. It is indifferent to the identity of a bond: a settlement whose Institutional-Relational bond is anchored in statute may in practice prove more durable under neglect than one whose Interpersonal bond rests on a single relationship, but the law gives every bond the same decay constant. That judgement enters through the provisions modelled on the same desk, which reduce the exposure, and so lengthen the half-life through the only channel the law admits.",
          ],
        },
        {
          title: "The outside theory: reliability and the constant hazard",
          paragraphs: [
            "The decay law belongs to a family that reliability engineers have used for decades. The NIST/SEMATECH e-Handbook of Statistical Methods sets out the exponential life model: the reliability function, the probability that a unit survives to time \\(t\\), is \\(e^{-\\lambda t}\\); the failure rate is the constant \\(\\lambda\\); the mean life is \\(\\frac{1}{\\lambda}\\); and the median life is \\(\\frac{\\ln 2}{\\lambda}\\). The Handbook adds that the exponential is the only distribution with a constant failure rate, which is the property usually called memorylessness: the chance of failing in the next interval does not depend on how long the unit has already lasted.",
            "The same Handbook places the constant rate inside a larger picture. Empirical failure rates of many products trace a bathtub curve: a high early-failure rate that falls during the first weeks or months, a long flat period of roughly constant intrinsic failure, and a rising wear-out period. The exponential model fits the flat middle. The Handbook also notes that any changing failure rate can be approximated by constant rates over short intervals, patched together into a piecewise exponential.",
            "Peace research has asked the same question of ceasefires. Virginia Page Fortna's study of ceasefires in interstate wars between 1946 and 1997, published in International Organization in 2003, tests agreement-strength hypotheses with hazard analysis. Her abstract reports that stronger agreements enhance the durability of peace and identifies demilitarized zones, explicit third-party guarantees, peacekeeping, and joint dispute-resolution commissions among the mechanisms that affect duration.",
            "Fortna's abstract also describes the logic behind the agreement variables: provisions can alter incentives, reduce uncertainty about intentions, and help manage accidents. Her analysis controls for baseline conditions including the decisiveness of victory, the costs of war, and relative capabilities, then reports that stronger agreements are associated with longer peace. This is a different kind of evidence from the simulator's deterministic curve. It asks whether agreement features help explain variation in observed ceasefire duration across cases; it does not estimate the daily rate by which an individual relational bond loses strength, nor does it supply the Academy's divisor of 2000.",
            "The comparison is methodological, not a transfer of an empirical result to the desk. Fortna estimates a duration relationship from a defined set of ceasefires; the Succession Simulator applies a fixed rule to operator-entered exposures, rupture, and bonds. The former asks how the hazard of renewed interstate war varies with elapsed time in the observed sample. The latter calculates how a bond value changes under an assumed constant rate during a chosen projection. Neither method establishes the rate for a particular present-day settlement without appropriate data and a defensible research design. A user must not report the simulator's half-life as a statistical estimate of the time until a real agreement fails.",
            "NIST's discussion of the bathtub curve further cautions against treating a constant rate as a universal description. It places the exponential model in the approximately flat, intrinsic-failure portion of that curve, while early failures and wear-out can have changing rates; it notes that varying rates may be approximated piecewise over short intervals. The Academy does not observe such a hazard curve or fit its segments. Re-entering changed inputs can produce a new deterministic projection, but that is a scenario update, not a fitted piecewise survival model. This limitation belongs beside every interpretation of the clock, particularly when the underlying exposure changes abruptly or the assumed decay relationship is disputed.",
          ],
          callout: {
            kind: "bridge",
            title: "How the code expresses reliability theory, and where it departs",
            paragraphs: [
              "preservedBond is the exponential reliability function applied to strength rather than to the probability of survival, and the stability half-life is the Handbook's median life, \\(\\frac{\\ln 2}{\\lambda}\\). The decay constant is a constant hazard over the projection, so the law is memoryless: the age of a settlement never enters decayHorizon.",
              "The departure is deliberate. Fortna's empirical analysis concerns agreement mechanisms and the duration of observed ceasefires; the doctrine refuses to treat elapsed time alone as evidence that any particular settlement has become safer. The code re-reads its constant whenever its inputs change. That resembles a sequence of scenario updates, not a statistically fitted piecewise survival model: a settlement that appears to stabilise does so in the instrument only when its entered Rupture Index or unmitigated exposure changes.",
            ],
          },
        },
      ],
      statutoryRule:
        "Rule 4.2-B: A reading taken under override excludes measured rupture from the decay constant and must never be cited as the decay position of the mission.",
    },
    {
      heading: H.proofs,
      subheading: "First-Order Kinetics, the Floor, the Fracture Window and the Calibration Constant",
      paragraphs: [
        "The decay law is the law of first-order kinetics, familiar from radioactive decay and pharmacokinetics. Its premise is that the rate of loss is proportional to what remains: \\(\\frac{db}{dt} = -\\lambda\\, b\\). A strong bond loses more points per day than a weak one under the same load, because it has more to lose, but both lose the same fraction. Separating variables and integrating from zero gives \\(b(t) = B_{i}(0)\\, e^{-\\lambda t}\\).",
        "Setting \\(b(t_{1/2}) = \\frac{1}{2} B_{i}(0)\\) gives \\(e^{-\\lambda t_{1/2}} = \\frac{1}{2}\\), hence \\(t_{1/2} = \\frac{\\ln 2}{\\lambda}\\). The half-life is independent of the starting score: every bond, strong or weak, halves in the same number of days.",
      ],
      formulas: [F_HALF_LIFE, F_PRESERVED, F_FRACTURE],
      subsections: [
        {
          title: "The canonical worked example",
          paragraphs: [
            "At the desk defaults and linked, \\(U = 6.5\\) and \\(R = 40\\), so \\(\\lambda = \\frac{46.5}{2000} = 0.02325\\) per day and \\(t_{1/2} = \\frac{0.693147}{0.02325} = 29.8\\) days. At the 30-day horizon \\(e^{-30 \\lambda} = 0.4978\\): a vector of 4.0, 2.0, 2.0 and 3.0 projects to 1.99, 1.00, 1.00 and 1.49, the Communal and Intergenerational bonds held at the sovereign floor. The mean loss across the four bonds is 1.38.",
            "At the 90-day horizon every bond of that vector is on the floor and the mean loss reaches its ceiling, the starting mean less one, which here is 1.75. The same figure is returned at 180 and 365 days, because a floored bond cannot lose more. A mean loss that stops changing as the horizon lengthens is therefore a signal that every bond has already reached severance within the shortest of the horizons that shows it.",
          ],
        },
        {
          title: "The floor as a barrier, and the floor-arrival time",
          paragraphs: [
            "The pure exponential is positive for every finite time and tends to zero. A bond score below 1.0 has no meaning on the scale, whose lowest anchor is 1, so the code takes the maximum with the floor. For a bond that starts above 1.0, the floor is reached at the finite time \\(t_{\\text{floor}} = \\frac{\\ln B_{i}(0)}{\\lambda}\\), which can also be written \\(t_{\\text{floor}} = t_{1/2} \\cdot \\log_{2} B_{i}(0)\\). A bond at 4.0 reaches the floor after exactly two half-lives, a bond at 2.0 after exactly one, and a bond at 1.0 is already there.",
            "The floor is a barrier and not merely a lower limit. For \\(t \\ge t_{\\text{floor}}\\) the exponential term is at most 1, so the projection is exactly 1.0; before \\(t_{\\text{floor}}\\) the exponential exceeds 1 and is returned unchanged. The projected trajectory is therefore continuous, non-increasing and bounded below by 1.0, which it attains in finite time and never crosses. In the canonical example the two bonds at 2.0 reach the floor at about 29.8 days, the bond at 4.0 at about 59.6 days and the bond at 3.0 at about 47.3 days.",
            "The ordering of floor-arrival times follows the ordering of starting scores, because \\(\\ln B_{i}(0)\\) is increasing in the score and the decay constant is common. The weakest bond always reaches severance first. Chapter 4.1 found the same bond carrying the most tripwires; the decay law adds that it is also the first to run out of time.",
          ],
          callout: {
            kind: "definition",
            title: "Floor-arrival time",
            paragraphs: [
              "The floor-arrival time of a bond is the number of days after which its projection rests at the 1.0 sovereign floor under the present decay constant: \\(\\frac{\\ln B_{i}(0)}{\\lambda}\\). It is the bond-level counterpart of the fracture window, which applies the same logic to the mean bond and the 2.0 level.",
            ],
          },
        },
        {
          title: "The fracture window and the floored curve",
          paragraphs: [
            "The critical fracture window solves the same law for the moment the mean bond reaches 2.0: \\(t_{f} = \\frac{\\ln(\\frac{\\mu_{B}}{2.0})}{\\lambda}\\). It applies the decay to the mean without the floor, and the choice is exact rather than approximate: because every bond shares one constant, the mean of the unfloored projections is the starting mean times \\(e^{-\\lambda t}\\). Divided by 30.44 it reads in months: above 24 stable, above 12 monitored, above 6 acute, otherwise imminent.",
            "The seven-point curve on the desk is the mean of the floored projections, which can only be equal to or higher than the unfloored mean. The two agree until the first bond reaches the floor. Take the Codex's illustrative vector of 3.8, 2.6, 2.2 and 3.4, whose mean is 3.0, under \\(U = 4.5\\) and \\(R = 9\\): the decay constant is 0.00675 per day and the fracture window is 60 days, 2.0 months, imminent. The 180-day curve passes through 2.00 at day 60, exactly as the window says, because the first floor arrival, the Intergenerational bond's, comes only at day 116.8.",
            "When a bond reaches the floor before the mean reaches 2.0, the curve flattens and the window, which ignores the floor, still reports the unfloored date. The window is then the earlier and more cautious of the two readings, and the operator should cite it. The floor protects the scale; it does not protect the settlement.",
          ],
        },
        {
          title: "The calibration constant and the load a horizon can bear",
          paragraphs: [
            "The constant 2000 calibrates the law so that one point of combined load removes one two-thousandth of every bond per day. Its practical meaning is best read in reverse. The combined load at which the half-life equals a target of \\(T\\) days is \\(U + R = \\frac{2000\\, \\ln 2}{T}\\), about \\(\\frac{1386.29}{T}\\). A half-life of 30 days tolerates a load of about 46.2; 90 days tolerates about 15.4; 180 days about 7.7; and a full year about 3.8, which is to say almost no rupture and almost no unmitigated exposure.",
            "The constant is severe by design. It expresses the Codex's position that a settlement carrying even moderate unresolved strain cannot be presumed to hold across a full annual cycle. An operator who wants a settlement to survive a twelve-month renewal cycle on its own momentum is asking for a Stable reading on the Sentinel Matrix and almost every succession shock insulated; anything less, and the renewals must come sooner.",
          ],
        },
        {
          title: "Daily retention and the error of the straight line",
          paragraphs: [
            "The law can be read one day at a time. Each day a bond keeps the fraction \\(e^{-\\lambda}\\) of its strength and loses \\(1 - e^{-\\lambda}\\), which for small constants is very close to \\(\\lambda\\) itself. At the canonical constant of 0.02325 the daily retention is 0.9770, a loss of about 2.30 per cent a day. Thirty such days compound to \\(e^{-30 \\lambda} = 0.4978\\), the multiplier used in the worked example.",
            "The straight-line reading of the same rate is badly wrong in both directions. Taken as a fixed share of the starting strength, a loss of 2.325 per cent a day would leave about 30 per cent after thirty days rather than about 50, and would reach zero after \\(\\frac{1}{0.02325} = 43\\) days, whereas the exponential never reaches zero and the floor stops it at 1.0. Over short horizons the two readings agree closely; over long ones the straight line overstates the loss and then predicts a collapse that the law does not contain. That is the mathematical content of the misreading Section V calls linear extrapolation, and it is why the desk publishes a half-life, a rate that stays meaningful at every horizon, rather than a points-per-day figure.",
          ],
        },
        {
          title: "Sensitivity, rounding and the edge cases",
          paragraphs: [
            "Because \\(U\\) and \\(R\\) enter as a sum, a reduction of ten points in either buys the same runway. Because the half-life is inversely proportional to the sum, halving the sum doubles the half-life. With no unmitigated exposure, a Rupture Index of 20 gives \\(\\lambda = 0.01\\) per day and a half-life of 69.3 days; 40 gives 0.02 and 34.7 days; 60 gives 0.03 and 23.1 days. The same settlement, read at three levels of rupture, has three very different clocks, and the operator who schedules renewals against the slowest of them will be late for the other two.",
            "The fracture window is more sensitive to the starting mean than intuition suggests, because it depends on the logarithm of the ratio to 2.0. At the canonical decay constant of 0.02325 per day, a mean bond of 3.0 reaches the fracture level in about 17 days and a mean of 3.5 in about 24 days: half a point of mean bond buys a week. A mean of 4.0 under a gentle decay constant of 0.002 per day reaches it in about 347 days, 11.4 months, which the desk classifies as acute rather than monitored, because the band boundary sits at twelve months.",
            "Three edge cases complete the definition. A sum of zero gives no decay: the half-life is undefined, the desk shows infinity, the bus carries zero, and the fracture window is undefined with a stable band. A negative or non-finite exposure or rupture is read as zero by the engine's guards, so a malformed input can never manufacture decay. And the published decay constant is rounded half-up to four decimals, so 0.00675 is carried on the bus as 0.0068 and 0.03625 as 0.0363; any recomputation from the bus should start from the unrounded inputs.",
          ],
        },
        {
          title: "A second worked example: what one shock costs",
          paragraphs: [
            "Hold the Codex vector of 3.8, 2.6, 2.2 and 3.4. In Setting A the analyst applies one shock, donor funding falling by 40 per cent (severity 18), with the statutory budget provision in force; the shock is insulated and contributes \\(18 \\times 0.25 = 4.5\\). The Sentinel Matrix reads 9 and the desk is linked. Then \\(\\lambda = \\frac{13.5}{2000} = 0.00675\\) and the half-life is 102.7 days. At 30 days the bonds read 3.10, 2.12, 1.80 and 2.78, a mean loss of 0.55.",
            "In Setting B the chief signatory is removed (severity 26, uninsulated) and the Sentinel Matrix rises to 42. Then \\(U = 30.5\\), \\(\\lambda = \\frac{72.5}{2000} = 0.03625\\), and the half-life is 19.1 days. At 30 days the bonds read 1.28, 1.00, 1.00 and 1.15, a mean loss of 1.89. One uninsulated shock and the rupture it provoked have cut the half-life by a factor of \\(\\frac{72.5}{13.5} = 5.37\\) and moved the first severance from day 116.8 to day 21.8.",
          ],
        },
      ],
      statutoryRule:
        "Rule 4.2-C: When the projected mean bond falls below the 2.0 fracture level within the chosen horizon, a leadership transition risks acute covenant failure, and renewals must be scheduled before the window closes.",
    },
    {
      heading: H.protocols,
      subheading: "Reading the Horizon on Desk 12 and Carrying It Downstream",
      paragraphs: [
        "On the Succession Simulator the operator ticks the provisions actually in the draft, applies the succession shocks to be tested, chooses the horizon and links the desk to the bus. The desk publishes the decay constant to four places, the half-life in days, the projected mean loss at the horizon, the fracture window in months and its severity band.",
      ],
      subsections: [
        {
          title: "The two-reading protocol",
          paragraphs: [
            "The horizon is read twice. The first reading applies every shock the theatre plausibly faces with no provisions ticked, which shows the exposure the draft must answer. The second ticks only the provisions actually written into the draft, which shows the runway the draft buys. The difference between the two half-lives is the value of the provisions in days, and it is the figure a drafting team should be asked to defend.",
            "Because insulation removes three quarters of a shock's contribution, the order in which provisions are drafted matters. The provision that insulates the heaviest uninsulated shock buys the most time per clause. Binding obligations to the office rather than the officeholder guards against the two heaviest leadership shocks together, 46 points between them, and is therefore usually the first clause the desk's arithmetic recommends; an independent verifier guards against capture, at 24, and the withdrawal of a guarantor, at 16.",
            "The operator then reads the clock against the calendar. Every milestone, renewal and review in the draft is placed on the projection, and any that falls after the fracture window, or after the floor-arrival time of the limiting bond, is either brought forward or preceded by an action that lowers the load. A milestone scheduled beyond the window is a milestone the settlement is not expected to reach in the condition the milestone assumes.",
          ],
        },
        {
          title: "What the operator does in each fracture band",
          paragraphs: [
            "Stable, more than 24 months: the present load leaves the mean bond above 2.0 for two years. The operator maintains the review cycle and records the reading with its horizon and link state, so that a later reading can be compared with it.",
            "Monitored, more than 12 and up to 24 months: the window is long enough to plan but short enough to matter within an ordinary renewal cycle. The operator schedules the next renewal inside the window and identifies the heaviest uninsulated shock for the next drafting round.",
            "Acute, more than 6 and up to 12 months: a leadership transition inside the window risks acute covenant failure. The operator brings renewals forward, insulates the heaviest shocks now rather than at the next round, and takes the Sentinel register to the Chapter 4.1 protocol, because rupture reduction lowers the same constant.",
            "Imminent, 6 months or less, or a mean already at or below 2.0: the settlement is inside its fracture window. The operator treats the reading as an emergency for the limiting bond, convenes the parties on its repair, and suspends any milestone that assumes the bonds will still hold. Where the mean is already at or below 2.0 the window reads zero; no amount of insulation can restore it without repair, because insulation slows decay and does not reverse it.",
          ],
        },
        {
          title: "Hand-offs between desks",
          paragraphs: [
            "Upstream, the desk reads one value it does not compute: the Rupture Index from the Sentinel Matrix, Desk 02. Every change on that desk moves the decay constant here, which is why the Chapter 4.1 protocol of working the register down from the limiting bond is also a protocol for lengthening the half-life. The Compound Shock Tester, Desk 03, publishes shock labels and a strain index to the bus but does not feed the decay constant; the two desks model overlapping but distinct phenomena, and an analyst who adds a shock on Desk 03 and expects the half-life to move will be mistaken.",
            "The same desk publishes the survival score that Stage Gate 5 and Escrow Tranche 4 read. The decay figures and the survival score are separate readings from the same inputs: a settlement can survive succession on paper and still carry a short half-life if its rupture reading is high. Downstream, the half-life appears in the Governing Relational Laws console under Relational Entropy and Decay Horizon, the fracture window under the Critical Fracture Window law, and both are carried into every chancellery document through the upstream telemetry block, which states the decay constant, the half-life and the mean loss at the chosen horizon, or records that no decay is modelled.",
          ],
        },
        {
          title: "Choosing the cheaper day: insulation against rupture reduction",
          paragraphs: [
            "Because exposure and rupture enter the constant as a sum, the operator who wants more runway has two levers and must choose between them on cost. The desk makes the comparison exact. Take the Drill Beta reading of Module V, linked, with a Rupture Index of 38 and an uninsulated exposure of 26: the constant is 0.032 per day and the half-life 21.7 days. Writing in the provisions that insulate the applied shocks brings the exposure to 6.5 and the half-life to 31.2 days, a gain of about 9.5 days. Clearing enough of the Sentinel register to lower the index by ten points instead, with the exposure left at 26, brings the constant to 0.027 and the half-life to about 25.7 days, a gain of about 4.0 days.",
            "On those inputs insulation is the cheaper day, because nineteen and a half points of exposure are available to remove at the stroke of a drafting pen, while ten points of rupture require tripwires to be verifiably cleared in the field. Once the provisions are in, the balance reverses: the remaining exposure is 6.5 against a rupture of 38, and every further day must come from the register. The protocol is therefore sequential. Insulate first while the exposure dominates the sum, then turn the effort to the Sentinel Matrix once the rupture term does, and re-read the clock after each step, because the half-life is inversely proportional to the whole load and each lever's worth depends on the size of the other.",
            "The same comparison disciplines a negotiating team's requests. A party that asks for a concession which removes no shock and clears no tripwire is asking for something the clock cannot see. The desk does not forbid such concessions; it records that they buy no time, and it lets the operator say so with a figure.",
          ],
        },
        {
          title: "Comparison with practice: ripeness and the precipice",
          paragraphs: [
            "Mediation theory has its own account of time, and it is worth setting beside the desk's. I. William Zartman's theory of ripeness, restated for the National Research Council in 2000, holds that parties resolve a conflict when they perceive themselves in a mutually hurting stalemate and perceive a way out; the stalemate is most compelling when associated with an impending catastrophe, which Zartman images as a precipice beyond a plateau. Ripeness is a perceptual event, necessary but not sufficient, and a ripe moment can be fleeting: failure to seize it often hastens its passing.",
            "Zartman draws two further points that bear directly on the desk. First, a mediator can ripen a conflict by highlighting objective referents of the stalemate and its pain when the parties do not see them. Second, a hurting stalemate can open negotiations but cannot carry them to a durable settlement; for that the parties need what he calls a mutually enticing opportunity, a formula that pulls them forward once the push of the stalemate fades.",
            "Fortna's findings point the same way from the other end of the process. Among the mechanisms she examined, demilitarised zones, explicit third-party guarantees, peacekeeping, joint commissions for resolving disputes and the specificity of the agreement were associated with more durable ceasefires, while ongoing third-party mediation after a ceasefire was not. In the desk's terms each effective mechanism is an insulating provision: something written into the settlement that reduces the effect of a shock when it comes.",
          ],
          callout: {
            kind: "bridge",
            title: "How the desk relates to ripeness, and where it departs",
            paragraphs: [
              "The half-life and the fracture window are objective referents of exactly the kind Zartman says a mediator can use to bring parties to perceive the cost of the present course: a precipice with a date. The desk supplies the date; it does not supply the perception, and the code measures nothing about whether a party feels the stalemate.",
              "The departure is one of direction. Ripeness theory concerns the moment to begin negotiating; the Decay Horizon concerns the time a signed settlement has before its bonds run out. The two meet at the point Zartman marks, when the push of the stalemate fades: from then on the settlement lives on its insulating provisions and its rupture reading, which are the only inputs decayHorizon reads.",
            ],
          },
        },
      ],
      statutoryRule:
        "Rule 4.2-D: Decay figures are cited with the horizon and the link state under which they were read. A half-life without its inputs is not a reading.",
    },
    {
      heading: H.failure,
      subheading: "Three Case Files, Six Misreadings and the Limiting Bond",
      paragraphs: [
        "The decay law fails in two ways: in the field, when a settlement's schedule ignores the load it carries, and at the desk, when an operator reads a correct clock wrongly. This section takes three case files from the open record for the first kind and six recurrent misreadings for the second, and closes with the reason the limiting bond runs out of time first.",
      ],
      subsections: [
        {
          title: "Case file one: the shock applied before the insulation (Angola, 1991 to 1992)",
          paragraphs: [
            "Warning signs. Troop assembly behind schedule within five months of signature; joint police monitoring groups never created; demobilisation far further advanced on one side than the other; a unified army formed two days before the vote; a verification mission whose role was limited to checking monitoring groups chaired by the parties themselves. The Secretary-General's later assessment named each of these as part of the root cause.",
            "The mechanism. An election in a two-army country is the heaviest succession shock a settlement can face, a contested transfer of power, and the provisions that would have insulated it, a single army, a neutral police and a verifier with authority to correct drift, were not in force when it was applied. On the desk the shock entered at full severity rather than at a quarter.",
            "The countermeasure that would have worked is sequencing: the provision before the shock. The decay law does not forbid an early election; it prices one. An operator reading Desk 12 would have seen that the half-life with the election applied and nothing insulated was a matter of weeks, and would have made the vote conditional on the provisions being in force, not on the date in the accord. The United Nations' own conclusion, that the time-frame for cantonment and demobilisation was too short and the mission's role too narrow, is the same lesson stated in the language of mandates.",
          ],
        },
        {
          title: "Case file two: the deferred core under an unmeasured load (Oslo, 1993 to 2000)",
          paragraphs: [
            "Warning signs. The assassination of a principal signatory; attacks by an armed opponent of the accords; a change of government in 1996 to a party that had historically opposed key elements of the settlement; agreements on implementation, Hebron and Wye, that each needed intensive outside mediation; and a government brought down by disputes over implementing one of them. Each is a shock on the desk's register; none was insulated by a provision binding the office, and the dispute ladder ended in arbitration only by mutual consent.",
            "The misreading. The design treated time as an asset that would accumulate confidence. Under a constant load, time is a cost. By the end of the five-year period the question was no longer whether the permanent status issues could be resolved but whether bonds strong enough to carry them still existed.",
            "The countermeasure is the one Rule 4.2-A states: the interim instrument carries its own clock. Renewals and confidence measures are scheduled against the half-life read at each stage, a provision binding obligations to the office is in force before the first change of government, and provisions such as joint dispute-resolution commissions or explicit third-party guarantees are written into the agreement rather than left to a crisis role. Fortna's study identifies these kinds of mechanisms among those associated with more durable ceasefires; it does not establish that any single provision guarantees success.",
          ],
        },
        {
          title: "Case file three: the drawdown on the calendar (Angola, 1997 to 1999)",
          paragraphs: [
            "Warning signs. Three major tasks of the Lusaka Protocol still pending more than two years after signature; a process the United Nations itself described as proceeding much slower than expected; a peacekeeping military component withdrawn on schedule while those tasks remained; and, by mid-1998, attacks, mine-laying and troop movements in eight of eighteen provinces.",
            "The mechanism. A chronic residual load is the most deceptive input the desk can carry, because nothing dramatic happens on any given day. The exposure stays where it is, the rupture reading edges upward, and the decay constant holds or rises while the political calendar moves on to drawdown. The guarantor's withdrawal of attention and staff is itself a registered shock, of severity 16.",
            "The countermeasure is to tie every relaxation to the clock rather than to the calendar. A mission drawdown, an escrow release or a closing of the file is justified only when the decay constant has fallen, which means insulated shocks and a lower Rupture Index, and never by the passage of time alone. This is the decreasing-hazard intuition, tested and refused at the desk: peace may become easier to keep with time, but the desk waits to see it in the inputs.",
          ],
        },
        {
          title: "From warning sign to desk input",
          paragraphs: [
            "The three case files share a pattern worth stating as a procedure. Each warning sign in the record corresponds to a shock on the desk's register or to a tripwire on the Sentinel Matrix, and the operator's first task is to translate it into one or the other. The removal of a signatory is the heaviest registered shock; the loss of an election by the governing party is the next; the withdrawal of a guarantor's attention and staff, of the kind a mission drawdown represents, is registered at 16; the capture of oversight by a party at 24. A sign that fits no registered shock is inscribed as a custom shock through the Sovereign Inscription tray, with deltas that state which bonds it strikes.",
            "Once translated, every sign is either insulated by a provision in the draft or it is not, and the clock prices the difference without argument. In Bicesse the decisive shock was applied uninsulated; in Oslo the heaviest shocks of the period had no provision binding the office; in the Lusaka period a chronic load sat on the bonds while the guarantor's presence was reduced. None of these required foresight to record. Each required only that the sign be written down as an input and that its effect on the clock be read before the next milestone was confirmed.",
          ],
        },
        {
          title: "Six misreadings at the desk",
          paragraphs: [
            "Linear extrapolation. A principal assumes that a crisis that has simmered for ten years leaves ten more years to act. Under first-order decay the remaining runway depends on today's exposure and rupture, not on history. The countermeasure is to quote the half-life and the fracture window, never the age of the dispute.",
            "Zero read as collapse. On the bus a half-life of zero means that no decay is modelled, because there is no exposure and no rupture, not that the half-life has collapsed. A genuinely short half-life is always a positive number. Any automated reading of the bus must test the decay constant before interpreting the half-life.",
            "The reassuring floor. Because no bond is projected below 1.0, a projection can show several bonds resting at the floor and the mean loss can look modest. A bond held at 1.0 is a bond the law would have taken lower if the scale allowed. The countermeasure is to read the floor-arrival time beside every floored bond and to treat a floored bond as a renewal already overdue.",
            "Insulating the wrong shock. Provisions that guard against light shocks reduce exposure little. The countermeasure is to insulate the heaviest uninsulated shock first.",
            "Horizon shopping. Because the published mean loss depends on the horizon selected, a team can make the same settlement look healthier by quoting the shortest horizon. The canonical vector under the default inputs loses 1.38 points of mean bond at 30 days and 1.75 at 90; the second figure is the honest one for any settlement whose next milestone lies beyond a month. The countermeasure is to quote the horizon that reaches the next scheduled milestone, and the fracture window beside it, which does not depend on the horizon at all.",
            "Ignoring rupture in the constant. Where the Rupture Index dominates the sum, insulation alone cannot restore the runway. With the chief signatory's removal and the loss of an election both insulated, the exposure is 11.5; against a Rupture Index of 40 that is barely a fifth of the load. The countermeasure is to work the Sentinel register down, starting with the tripwires on the limiting bond.",
            "The wrong desk or the wrong state. A shock applied on the Compound Shock Tester, a reading taken under override, or a degradation figure quoted without its horizon each produces a true number about a different question. The countermeasure is Rule 4.2-D: the horizon and the link state travel with every figure.",
          ],
        },
        {
          title: "The Liebig bottleneck: why the limiting bond runs out of time first",
          paragraphs: [
            "All four bonds decay by the same fraction, so the bond that reaches the floor first is the one that started lowest. The floor-arrival time \\(\\frac{\\ln B_{i}(0)}{\\lambda}\\) is shortest for the smallest score, and the limiting bond of Chapter 4.1, the one carrying the most tripwires, is the one with least time.",
            "The law of the minimum therefore operates in time as well as in level. Raising a strong bond lengthens nothing that matters, because the settlement fails when its weakest bond fails. Repairing the limiting bond before its floor-arrival time is the only intervention that moves the fracture window without changing the decay constant, because it is the only one that raises the part of the mean that is closest to running out.",
          ],
        },
      ],
      statutoryRule:
        "Rule 4.2-E: The limiting bond reaches the floor first. Renewal effort is directed at it before any other bond is strengthened.",
    },
    {
      heading: H.instrument,
      subheading: "Half-Life Under Accumulating Shock",
      paragraphs: [
        "The cutaway is the Rehearsal Drawer's own timeline (inscriptionTimeline) over a demonstration state held only in this lecture: a viable vector of 3.8, 3.4, 3.3 and 3.6, an observed share of 25, an unmitigated exposure of 10, and three demonstration shocks applied in order, a border incident, a currency collapse and a leadership succession. At each step the half-life is recomputed through decayHorizon from the exposure and the Rupture Index of that step. Nothing reaches the mission.",
      ],
      subsections: [
        {
          title: "Walkthrough: the demonstration baseline",
          paragraphs: [
            "Select Demonstration baseline. At T0 the load is \\(10 + 25 = 35\\), the decay constant 0.0175 per day and the half-life 39.6 days; the mean bond is 3.53 and the fracture window 32 days. Step to T1: the border incident lifts the Rupture Index to 32, the half-life falls to 33.0 days, the mean bond to 3.18 and the window to 22 days. Step to T2: the currency collapse lifts the index to 40, the half-life falls to 27.7 days and the window to 13 days. Step to T3: the succession shock lifts the index to 50, the half-life falls to 23.1 days, the mean bond is 2.3 and the window is 5 days.",
            "Note how the window shrinks faster than the half-life. Between T0 and T3 the half-life falls by about two fifths, while the window falls from 32 days to 5, because the window depends on both the constant and the distance of the mean from 2.0, and each shock moved both.",
          ],
        },
        {
          title: "Counterfactual one: exposure without rupture",
          paragraphs: [
            "Select Drill Beta exposure, which raises the unmitigated exposure from 10 to 26 and changes nothing else. The Rupture Index readings are identical, 25, 32, 40 and 50, because exposure does not enter the index. The half-lives fall to 27.2, 23.9, 21.0 and 18.2 days, and the fracture windows to 22, 16, 10 and 4 days. This is the counterpart of the Chapter 4.1 cutaway: there the lesson was that the index does not see exposure; here it is that the clock sees both.",
            "Use the exposure control to find the exposure at which the T0 half-life equals the baseline's T3 half-life of 23.1 days. The answer, a combined load of 60 and so an exposure of 35 against an observed share of 25, shows that twenty-five points of extra uninsulated exposure cost as much time as the three demonstration shocks together.",
          ],
        },
        {
          title: "Counterfactual two: the trend and the shock size",
          paragraphs: [
            "Select Deteriorating trend. The index reads 29, 37, 46 and 57, and the half-lives 35.5, 29.5, 24.8 and 20.7 days: the trend reaches the clock through the index. Select Improving trend and the half-lives lengthen to 44.7, 37.5, 31.5 and 26.2 days.",
            "Select Severe compound shock, the deteriorating trend with every shock delta scaled to 1.5 times its size. At T3 the index is 63, the half-life 19.0 days, the mean bond 1.7 and the fracture window zero: the mean is already below 2.0. Trace the escrow and Dominum consequences: at 63 the waterfall is frozen, so the fiduciary term of the Dominum Index falls to zero, and containment is \\(1 - \\frac{63}{100} = 0.37\\).",
          ],
        },
        {
          title: "Reading the instrument precisely",
          paragraphs: [
            "Every control on the cutaway has a numeric field and step buttons beside its slider; the arrow keys move a value by one step of its control, a point of exposure or a tenth of shock size, and Shift with an arrow by five steps; every value is clamped to the range the engine accepts, so the exposure runs from 0 to 100 and the observed share from 0 to 100 per cent. The step controls play, pause and advance the timeline one shock at a time, and the working panel beneath the chart substitutes the live exposure and index into \\(\\lambda = \\frac{U + R}{2000}\\) and then into \\(\\frac{\\ln 2}{\\lambda}\\), ending in the figure the desk would publish.",
            "When you leave a preset, a faint ghost of the preset's curve remains under the live one and the change in each reading is shown beside it, so that a counterfactual is always read as a difference from a stated baseline. Use Copy settings to record the inputs of any reading you intend to cite. The copied record holds the observed share, the exposure, the trend, the shock size and the step shown, which are exactly the inputs Rule 4.2-D says must travel with a decay figure; it is copied locally and nothing leaves the browser.",
          ],
        },
        {
          title: "Counterfactual three: what insulation can and cannot do",
          paragraphs: [
            "Return to the baseline and lower the exposure toward zero, as if every shock on Desk 12 were insulated and then resolved. At T3 the half-life lengthens only to \\(\\frac{\\ln 2}{0.025} = 27.7\\) days, because the Rupture Index of 50 still dominates the load. Then return the exposure to 10 and lower the observed share instead: each point removed from the register buys exactly what a point of exposure buys. The cutaway closes the argument of the chapter. The clock answers to load, the load has two parts, and an operator who works only one of them will find the other setting the time.",
          ],
        },
        {
          title: "The first-order assumption and what remains constant",
          paragraphs: [
            "The familiar exponential form follows from a specific modelling premise: over a short interval, the absolute rate of change is proportional to the amount of bond that remains. The proportionality factor is held fixed for the projection. This is why the trajectory is multiplicative rather than a subtraction of a fixed number of points each day. A bond at 4.0 loses more raw points in an early interval than a bond at 2.0 under the same constant, even though each retains the same fraction.",
            "The fixed-rate premise gives the projection a useful compositional property. Projecting first over one interval and then another produces the same result as projecting over their total duration, so long as the decay constant and input state remain unchanged. The property is often called the semigroup property of exponential decay. It lets an analyst compare a 30-day projection with a sequence of shorter projections without inventing a new rule at each step.",
            "That property is mathematical, not empirical. It says what the declared model will return when the same constant is applied over successive intervals. It does not show that real relationships lose a constant fraction of strength each day. Social trust, institutional capacity, and political incentives can change abruptly, respond to events, or recover through deliberate action. The exponential is a disciplined scenario law, not a universal law of political behaviour.",
            "The model also applies a common rate to all four bond coordinates. Consequently, before the floor is reached, their relative proportions are preserved: a bond that begins stronger remains proportionally stronger under the same multiplier. The model does not make the strongest bond decay more slowly because it is institutionally resilient, nor does it assign a separate hazard to each bond. Those differences, if important, must be represented in the source inputs or investigated with a separately labelled research model.",
            "This common-rate structure is what makes the mean projection tractable. Before flooring, the mean is multiplied by the same retention factor as each component. Once one or more components reach the sovereign floor, the mean of the floored values no longer follows the same pure exponential exactly. The distinction explains why the instrument can display a floor-aware trajectory while the analytic fracture calculation describes the unfloored mean reaching its specified level.",
            "When teaching the law, ask students to identify the assumptions before they calculate. The rate is treated as constant over the chosen projection, the same rate applies across bonds, and changes in load are represented through the declared inputs rather than through an independently estimated path. This short list helps distinguish correct algebra from an unsupported claim about how a settlement will actually evolve."
          ],
        },
        {
          title: "Why exposure and rupture are added, and what additivity commits the model to",
          paragraphs: [
            "The load entering the decay constant has two named sources: unmitigated exposure and the Rupture Index. Their addition means that the model treats one point of exposure and one point of rupture as equal contributions to the combined load at that stage of the calculation. This is a calibration and modelling choice encoded by the engine, not a finding that those risks are interchangeable in law, politics, or field operations.",
            "The distinction between the two inputs remains essential even though they are added. Exposure is assembled from applied succession shocks and the provisions that insulate them. Rupture comes from the Sentinel Matrix. One can change while the other stays constant, as the timeline exercises demonstrate. A report that gives only the combined load loses the operational answer to the question of which desk or intervention might reduce it.",
            "Suppose the existing demonstration baseline uses exposure 10 and observed share 25. The initial combined load is 35. Raising the exposure to 26 while holding the Sentinel reading fixed leaves the Rupture Index unchanged but shortens the half-life. Raising the observed share through the staged shocks changes the rupture term and therefore the clock, while exposure remains 10. The two counterfactuals have similar algebraic roles in the sum but different evidentiary meanings.",
            "Additivity also makes marginal sensitivity simple: within the model and away from the zero guard, a unit reduction in either input produces the same unit reduction in combined load. It does not follow that the same practical intervention can achieve those reductions at equal cost. Insulating a shock may require a legal clause and an independent guarantor; lowering rupture may require changing conditions across several relationships and validating the signs that have cleared.",
            "A further consequence is that the two inputs are not substitutes for diagnosis. If the clock is short because exposure is high, drafting provisions may help. If rupture dominates the load, additional clauses may produce little runway until the underlying warning register improves. The worked comparisons in the chapter show why the operator should calculate the contribution of each input before recommending a remedy.",
            "No new input for elapsed time since signature appears in the decay constant. The horizon is projected forward from the present state, not backward from the date of the agreement. An older settlement is not automatically assigned a shorter half-life; the model responds to its declared current load. This is a central interpretive distinction between the calendar age of an agreement and the rate implied by the present inputs."
          ],
        },
        {
          title: "Half-life as a scale parameter rather than a deadline",
          paragraphs: [
            "A half-life is a scale parameter of the chosen exponential curve: under the fixed-rate assumption, it is the interval in which the unfloored quantity would be reduced by half. It is not the time when every bond reaches the floor, and it is not the time at which the agreement expires. The starting value matters for floor-arrival time even though it does not change the half-life itself.",
            "This distinction can be seen in the canonical vector. The bonds begin at 4.0, 2.0, 2.0, and 3.0 under the same decay constant. Each has the same half-life, but they reach the floor at different times because they start at different distances above 1.0. The value 2.0 reaches the floor after one half-life, while 4.0 requires two. Reading one number as both the decay scale and the individual floor-arrival date confuses two separate calculations.",
            "The half-life is also not a probabilistic survival median in the empirical sense used in survival analysis. In a statistical survival model, a median is estimated from observations and describes the point at which a modelled survival function crosses a probability level. Here the half-life is an algebraic transformation of a declared constant. It carries no confidence interval, sample-based uncertainty, or probability that a treaty will fail on that day.",
            "The Decay Horizon's named horizons are observation points for displaying projections. They do not alter the half-life. A reader can inspect the 30-, 90-, 180-, and 365-day readings without treating those horizon choices as a fitted curve. If two horizons show the same floored score, that is a result of the lower bound in the projection, not evidence that the underlying political process has become stable.",
            "The practical use of a half-life is comparative and conditional. Given the same calibration and the same model assumptions, a longer half-life indicates a slower fractional loss under the present declared load than a shorter one. That can help compare proposed mitigations or identify when a planned review falls beyond the modelled runway. It should not be stated as an unconditional guarantee that an agreement will remain intact until the indicated day.",
            "A careful briefing can say, 'Under the current inputs and the engine's fixed-rate projection, the half-life is about thirty days.' It should not say, 'The agreement will fail in thirty days.' The first statement reports the model; the second makes a forecast the formula does not contain."
          ],
        },
        {
          title: "The floor and fracture window answer different operational questions",
          paragraphs: [
            "The sovereign floor and the fracture level are distinct boundaries. The floor prevents the projected bond from leaving the scale at its lower limit. The fracture calculation asks when the unfloored mean reaches 2.0. The first is a coordinate-level guard; the second is a time-to-condition calculation. They cannot be exchanged simply because both are expressed as levels on the same bond scale.",
            "A floor-arrival calculation asks when a particular bond would be reduced to the minimum under the assumed constant. It therefore depends on that bond's own starting score. The fracture window instead uses the mean bond and its distance above the fracture level. A strong individual bond may have substantial time before it reaches the floor even when the mean is near the fracture level; conversely, the mean can remain above 2.0 after a weak individual bond has reached the floor.",
            "The curve shown by the instrument incorporates the floor, whereas the analytic fracture window follows the stated formula for the mean. Where the two readings diverge after flooring begins, the difference is informative: the visual projection cannot fall below the scale minimum, while the window continues to describe the unfloored crossing time. Operators should not replace one with the other or claim that a floor-protected curve means the relationship is protected.",
            "The example in the architecture section makes the distinction concrete. With the cited vector and load, the mean begins at 3.0 and the fracture window is about 60 days, while the first individual bond reaches the sovereign floor on a later schedule. The mean-level warning therefore arrives before the first floor event in that example. The exact ordering depends on the given vector and the shared decay constant, not on a general rule that one boundary always precedes the other.",
            "The classification labels applied to the window are also categorical summaries of a continuous duration. A date near a band boundary should be reported with enough precision to show the underlying calculation, and the band should be described as the engine's classification rather than a legal status. The chapter's bands do not create an international-law deadline.",
            "Operationally, compare the earliest relevant warning with the next actual decision point: a renewal, leadership transition, scheduled withdrawal, or funding review. That comparison is a planning task, not a new function of the engine. A date that lies outside the modelled window may justify bringing a review forward, but the decision-maker must also consider evidence, mandate, and feasibility."
          ],
        },
        {
          title: "Calibration, dimensions, and the responsibility to preserve units",
          paragraphs: [
            "The divisor of 2000 is the calibration constant that maps the combined load, expressed in the model's points, into a daily rate. The resulting constant has units of inverse days, which is why multiplying it by an interval measured in days produces a dimensionless exponent. This dimensional check is a useful safeguard against a common computational mistake: using months or years directly in the exponential without converting the time unit.",
            "The half-life consequently inherits the time unit used by the constant. Since the engine defines the rate per day, the direct calculation returns days. The display's month conversion uses a stated average month length; it is a presentation convention for the fracture window, not a separate physical period embedded in the underlying law. When comparing a date with a calendar event, use the day value and the relevant calendar rather than treating a fractional month as an exact number of days.",
            "The calibration constant is not estimated from historical conflict durations in the examples. It is part of the platform's canonical definition. The historical cases help explain why a clock under load is analytically useful, but they do not supply a statistical fit for 2000. A paper that evaluates the model empirically would need a separate dataset, a clearly defined outcome, a sampling design, and a pre-specified estimation method.",
            "This distinction between a declared parameter and an estimated parameter is central to reproducibility. If a number is fixed by the engine, it should be cited as a canonical constant and not described as a coefficient discovered in field data. If a future research project tests the calibration, it should report that analysis separately and should not quietly substitute an estimated value into the canonical function.",
            "Units also matter when comparing against other models. A reliability engineering text may use hours or years; a ceasefire survival study may use months; a project timeline may use calendar dates. The mathematical form can look similar while the rate scale differs. Before comparing values, convert units consistently and verify that the underlying quantity and event are genuinely comparable.",
            "A good technical note labels the time unit every time the decay constant or half-life appears for the first time, and repeats it when a value is copied into a chart or handover. This small practice prevents the visual similarity of decimal rates from hiding an order-of-magnitude error."
          ],
        },
        {
          title: "Sensitivity analysis using the chapter's supplied inputs",
          paragraphs: [
            "Sensitivity analysis asks how the output changes when a stated input changes, holding the rest of the scenario fixed. It is not a forecast of the likely input change. The chapter's worked examples let the reader isolate the influence of exposure, rupture, insulation, and horizon without adding a new variable or changing the engine's constants.",
            "Use the default linked reading of exposure 6.5 and rupture 40 as a baseline. The combined load is 46.5, the decay constant is 0.02325 per day, and the half-life is about 29.8 days. If rupture is lowered to 30 while exposure stays fixed, the combined load becomes 36.5 and the corresponding half-life lengthens. The change is attributable to the rupture input alone; the exposure register has not changed.",
            "Now hold rupture at 40 and compare the stated exposure values 6.5 and 26. The first is a mitigated example and the second is Drill Beta exposure. Each has a different half-life even though the same Rupture Index is present. This comparison illustrates that an intervention to insulate shocks and an intervention to clear tripwires can both lengthen the modelled runway, while remaining different actions with different evidence and responsible desks.",
            "The proportionate relationship between load and rate has an inverse relationship with half-life. Doubling a positive combined load doubles the decay constant and halves the half-life. This is a property of the specified formula, not a universal rule that political risk doubles when two pressures are combined. It should be taught as an arithmetic implication of this model.",
            "Near a phase boundary, a small numerical change can alter the fracture-window label even if the underlying duration changes only slightly. Analysts should therefore show the underlying day value in addition to the category. A label such as 'imminent' communicates a band, while the actual duration helps a decision-maker understand how close the reading is to the boundary.",
            "A sensitivity table should retain all held-constant assumptions. If the Rupture Index is changed while also changing exposure or the bond vector, the comparison no longer isolates one input. Write the scenario definition beside the result and use the exact same horizon and link state. This makes the counterfactual auditable and avoids attributing the result to the wrong intervention."
          ],
        },
        {
          title: "Rounding and non-finite guards are part of the interface contract",
          paragraphs: [
            "The engine's mathematical calculation and its published values have different roles. Internal calculations use the canonical inputs, while selected bus fields are rounded for display and downstream use according to the implementation. A reader who reconstructs a result from a rounded display may not reproduce the internal value exactly. The lecture's worked figures should therefore be read at the precision stated and checked against the canonical function rather than treated as arbitrary hand-rounding.",
            "Half-up rounding is not identical to the default rounding conventions of every programming language or spreadsheet. At a tie, different libraries may round toward even, away from zero, or according to binary floating-point representation. A proof that must match the engine should use the same rounding helper and input precision as the engine, not a spreadsheet's default setting.",
            "Non-finite inputs require separate attention. A missing, infinite, or otherwise invalid numeric value should never be allowed to flow into a bus reading where it could contaminate later calculations. The project-wide math guards define how these conditions are handled for canonical formulas. Those guards are data-safety rules; they do not alter the formula, its calibration, or its thresholds.",
            "The zero-load case is conceptually special because the logarithmic half-life calculation has no finite denominator. The implementation uses its defined no-decay representation rather than asking the operator to divide by zero. A bus value of zero in this context must be interpreted together with the decay constant and its associated status; it is not evidence that the bonds themselves have reached zero.",
            "Edge-case testing should cover an input at each boundary, just below and above it, and any non-finite or missing state accepted by the user interface. The chapter's quiz and practice items exercise several of these distinctions, but a production test suite should derive expected values from the same functions used by the desks.",
            "These details illustrate a broader point in computational governance: a formula is not fully specified by mathematical notation alone. Units, guards, rounding, input defaults, and missing-state behavior form part of the executable contract. The Academy should describe these semantics faithfully and should not invent alternatives for the sake of a smoother worked example."
          ],
        },
        {
          title: "What reliability engineering and survival analysis can teach by analogy",
          paragraphs: [
            "The exponential survival function appears in reliability engineering when a component is modelled with a constant failure rate. It is attractive because it is analytically simple and has the memoryless property: conditional on survival to the present under a constant hazard, the remaining waiting-time distribution has the same form. In the Academy, the parallel is the use of a fixed daily rate to project proportional loss under a declared load.",
            "The analogy stops at the modelling structure. A mechanical component has a defined failure event and a body of test or service data; a political settlement has contested meanings, strategic actors, and outcomes that may not be binary. Empirical ceasefire studies often model duration with event-history methods and may find that hazard changes with time or with agreement characteristics. The Academy's half-life is not estimated from such studies and does not inherit their probabilities.",
            "The literature on peace agreement durability is nevertheless useful for asking better questions. Researchers such as Virginia Page Fortna have examined how implementation mechanisms, third-party guarantees, and monitoring relate to the durability of ceasefires. These findings do not validate the Academy's particular constant. They provide a scholarly context for why monitoring, institutional mechanisms, and post-agreement arrangements are relevant variables in a discussion of time and risk.",
            "A constant-rate model may be a useful local approximation over a short period even when the real process changes over time. If shocks accumulate, provisions take effect, or the rupture register is revised, the inputs change and the operator should recalculate from the updated state. The original projection remains a conditional calculation for the state at which it was made; it should not be carried forward as if the constant were permanently true.",
            "Statistical survival models also make uncertainty explicit through estimated distributions, confidence intervals, and tests of model fit. The Desk 12 calculation is deterministic and does not output those quantities. An analyst must not manufacture confidence intervals or probabilities from the half-life. If probabilistic risk is needed for a separate decision, it requires a distinct empirical model and transparent data, not a verbal reinterpretation of the deterministic horizon.",
            "The correct scholarly posture is comparative but bounded: explain the shared exponential mathematics, identify the difference between a declared scenario law and an empirically estimated hazard model, and state what additional evidence would be required to test the Academy's calibration. This preserves the educational value of the analogy without mistaking mathematical resemblance for empirical equivalence."
          ],
        },
        {
          title: "From forecast language to scenario language",
          paragraphs: [
            "Because the calculation projects values into the future, it is easy to call it a forecast. The word can imply that the model has estimated the likelihood of an outcome from observed historical data. That is not the status of the Desk 12 calculation. It applies the present declared inputs through a canonical rule and returns a conditional trajectory.",
            "Use scenario verbs: projects, would reach under the current assumptions, or implies within the model. Avoid categorical verbs such as will fail or is certain to collapse. The difference is not stylistic hedging. It identifies whether the statement is a deterministic implication of the rule or a probabilistic claim about actual events.",
            "A scenario should disclose its input date, bond vector, exposure, rupture reading, linked or override status, and horizon. If a leadership shock or another event changes the input state, the original curve no longer describes the new state. Recalculate and retain both readings if the change itself is analytically important.",
            "When the scenario is used in a negotiation, parties may challenge both the evidence and the model premise. Preserve the underlying values, document the challenge, and distinguish a dispute about the facts from a disagreement about the doctrine. Changing a factual input is not the same as revising the formula; changing the formula is not the same as correcting the record.",
            "The time projection is most useful as a prompt to examine whether a renewal, review, or leadership handover is scheduled before the indicated fracture window. The answer remains subject to other institutional facts and applicable law. A modelled warning can justify earlier attention without becoming a binding deadline.",
            "This language discipline completes the chapter's derivation. The formula is exact within its declared domain; its interpretation remains conditional on inputs and assumptions. A reader who can state both the result and the limits of the result has understood the instrument more fully than one who merely memorises the half-life equation."
          ],
        },
        {
          title: "Uncertainty in the inputs and uncertainty in the model",
          paragraphs: [
            "There are at least two different uncertainties in a projection. Input uncertainty concerns whether the bond vector, exposure, or rupture reading accurately reflects the present record. Model uncertainty concerns whether a fixed exponential law is an adequate representation of how the relationship changes. A deterministic calculation can be exact relative to its inputs while both kinds of uncertainty remain substantial.",
            "The engine does not attach a confidence interval to the reading, and a precise decimal should not be mistaken for one. The displayed value reflects the implementation's rounding and publication conventions. It does not quantify the uncertainty of field reporting, disagreement among observers, or the possibility that the governing assumption is unsuitable for a particular case.",
            "Input uncertainty can be managed through transparent provenance, repeat observations, independent verification, and documented corrections. Model uncertainty is managed differently: it requires comparison with alternative theoretical accounts, empirical evaluation where appropriate, and a clear statement about the domain in which the current rule is being used. Conflating these two types leads to ineffective remedies.",
            "A sensitivity exercise can show how the output responds to plausible changes in a declared input, but it does not produce a probability distribution unless one is independently specified. Showing the half-life at several rupture values helps the reader see the functional relationship; it does not establish how likely any one rupture value is.",
            "In a contested setting, parties may agree on the calculation but disagree about an input, or agree on the input but question the model. The report should separate these disputes. The first is an evidentiary or measurement issue; the second is a disagreement about the doctrine or its applicability. Keeping them separate makes challenge and resolution more tractable.",
            "This epistemic discipline is particularly important when a projection informs resource allocation. A very short modelled horizon may warrant urgent review, but it should not be converted into a self-fulfilling label that discourages investment or creates an expectation of failure. The objective is to identify conditions for intervention, not to stigmatise a party or settlement."
          ],
        },
        {
          title: "Using the clock to structure review and negotiation",
          paragraphs: [
            "A clock becomes operationally useful when it is compared with an actual decision calendar. An analyst can place the fracture window beside the next renewal, scheduled leadership handover, budget appropriation, or planned reduction in monitoring. If the event falls after the modelled window, the team has a concrete reason to examine whether an earlier review or an insulating measure is feasible.",
            "The comparison does not imply that the calendar event will fail if it occurs later. It identifies a mismatch between the present scenario and the timing assumed by the plan. The parties may change the load, alter the schedule, create an interim safeguard, or decide that the model does not capture an important condition. Each response should be recorded with its legal authority and evidence.",
            "A negotiation team can use the decomposition of exposure to identify which clauses are likely to buy time in the model. The shock register and the insulation provisions show whether a particular shock is covered. Adding a second clause for a shock that is already insulated may not further reduce its modelled contribution; broadening coverage to an uninsulated shock can change the total exposure. The exact calculations remain those supplied by the desk.",
            "If the Rupture Index dominates the combined load, the most effective analytical route may be to address the warning signs rather than to draft additional protective provisions. This does not mean that an operator should edit the index directly. It means the team should examine the Sentinel Matrix's recorded tripwires and the evidence required to mark signs cleared.",
            "The clock also helps distinguish temporary protection from durable repair. An insulating provision reduces the modelled effect of an applied shock; it does not necessarily remove the underlying cause or make the shock impossible. The shock register remains useful even where a provision exists, because the calculation still attributes a residual contribution.",
            "A mature briefing therefore offers a sequence: state the current load, identify the dominant source, name the available intervention, explain what evidence would show that it worked, and schedule a new reading. The platform supplies the calculation and a common vocabulary; the negotiation plan supplies the accountable action."
          ],
        },
        {
          title: "Historical and technical sources: what each can support",
          paragraphs: [
            "The Oslo and Angola sections draw on official texts and United Nations mission histories to establish what the agreements required, what verification arrangements existed, and which implementation tasks remained outstanding. Those sources are appropriate for the chronology and institutional description. They do not prove that the decay equation would have returned a particular reading at the time, because the chapter does not reconstruct historical input vectors.",
            "The NIST/SEMATECH reliability handbook explains the exponential model in its own technical domain, including the constant-rate assumption and the meaning of a survival function. Its authority is methodological, not political: it helps explain the mathematics, but it does not validate the application of that mathematics to diplomatic relationships.",
            "Virginia Page Fortna's empirical work on ceasefire durability is relevant to the broader question of why agreements endure and how monitoring and implementation mechanisms matter. Her statistical analysis studies observed agreements and their duration. It is not the source of the Academy's calibration constant, and it should not be cited as if her results estimated this engine's half-life.",
            "Zartman's work on ripeness provides a complementary theory of negotiation timing, especially the mutually hurting stalemate and the perception of an impending precipice. It explains a different construct from the deterministic decay constant. The comparison is useful because both ask how time and pressure shape negotiation, but they should not be collapsed into one formula.",
            "The source hierarchy should remain visible. Signed agreements and official records support historical facts; technical handbooks explain mathematical conventions; peer-reviewed research supports claims about empirical patterns; and the Codex supplies the platform's normative doctrine. No one category substitutes for the others.",
            "When a claim concerns binding legal effect, cite the agreement or applicable legal instrument and qualify the claim according to its terms. When a claim concerns empirical conflict behavior, cite the research design and its limits. When a claim concerns the platform's output, cite the code and canonical functions. This practice allows readers to trace the origin of each proposition."
          ],
        },
        {
          title: "A capstone exercise in interpreting the clock",
          paragraphs: [
            "Ask the reader to begin with the provided vector of 4.0, 2.0, 2.0, and 3.0, the linked exposure of 6.5, and rupture reading 40. They should state the combined load, the decay constant, and the half-life, then identify which bond reaches the floor first. The numerical answer should be accompanied by a sentence describing the model assumptions.",
            "Next, change only exposure to the Drill Beta value of 26. The student should recalculate the constant and half-life while holding the bond vector and rupture reading fixed. They should explain why the Rupture Index itself does not change and why the comparison is a controlled counterfactual rather than an observation about a historical case.",
            "Then consider a plan that schedules its next review after the fracture window. The student should not conclude that the treaty will fail before the review. Instead, they should identify the mismatch, list evidence needed to confirm the present inputs, and propose a lawful review of available mitigations or the schedule itself.",
            "Finally, ask whether the shorter half-life is a statistical probability of failure. The correct answer is no: it is a deterministic parameter-derived interval under a declared law. A separate empirical survival analysis would need observed events, a defined outcome, model estimation, and uncertainty reporting.",
            "The exercise can be graded on four dimensions: mathematical fidelity to the existing function, careful distinction between inputs, use of conditional scenario language, and recognition of the legal and empirical limits. This assesses postgraduate understanding rather than rote substitution into a formula.",
            "The chapter's most important result is therefore not a date. It is a method for making assumptions explicit: define the state, apply the declared law, preserve the floor, distinguish the fracture window from half-life, and communicate the answer without turning a scenario into a prophecy."
          ],
        },
        {
          title: "A final operational distinction",
          paragraphs: [
            "The decay clock describes how the declared model transforms a present state across time; it does not decide which institution has authority to act. A scheduled renewal, a leadership transition, and an emergency response remain governed by their own legal and political procedures. The clock can help a team ask whether those procedures are scheduled soon enough, but it cannot amend them.",
            "Keep the present reading, the projected curve, and the later observed state distinct in the record. The present reading is the input state; the curve is a conditional calculation; the later observation is new evidence that may confirm or contradict the scenario. Replacing the later observation with the old projection would turn analysis into self-confirmation.",
            "If a new shock occurs, if a provision comes into force, or if the warning register changes, update the input state and recompute. Preserve the earlier run so that the team can see what changed and why. This preserves reproducibility without treating an obsolete scenario as the current condition.",
            "The best use of the instrument is disciplined attention. It makes the cost of present load legible, connects that load to the remaining bond strength, and helps operators identify when an assumption should be revisited. Its value lies in prompting evidence-led action, not in claiming certainty about a political future."
          ],
        },
        {
          title: "Reviewing a projection after new evidence arrives",
          paragraphs: [
            "A projection should be stored with the state from which it was computed. When the register, exposure, or bond vector changes, calculate a new projection from the new state and label the observation date. The earlier scenario remains useful for understanding what the team believed at the time, but it no longer describes the current inputs.",
            "Compare the old and new results by identifying which inputs changed and whether those changes were verified. If the half-life lengthens because exposure fell, say that the applied shock burden or its insulation changed; do not claim that rupture improved unless the Sentinel reading also changed. If rupture falls while exposure remains fixed, preserve that distinction in the explanation.",
            "A later observation can also show that a prior projection was a poor representation of events. That discrepancy is an opportunity for model evaluation, not a reason to rewrite the old calculation. The team should ask whether inputs were inaccurate, whether the rate assumption was inappropriate, or whether an unrepresented event changed the state.",
            "This is the difference between updating a live operational reading and validating a theory. The first is a routine consequence of new evidence. The second requires a separate study and should not be inferred from one agreement or one projection."
          ],
        },
        {
          title: "What a projection can responsibly contribute",
          paragraphs: [
            "The projection contributes a common conditional description of time under stated load. It can reveal that a planned review is scheduled beyond the current modelled window, distinguish exposure from rupture as sources of that load, and make the consequences of insulation visible. It cannot decide whether a party will comply or whether a political agreement will endure.",
            "For that reason, the number should initiate a review of evidence and safeguards rather than end the discussion. A team that preserves the state, checks the assumptions, and updates the reading as conditions change can use the clock as a disciplined planning aid. A team that quotes it as a guaranteed deadline has mistaken the algebra for an empirical prediction."
          ],
        },
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
    {
      id: "q4-2-5",
      question: "Under a common decay constant, which bond of the vector 4.0, 2.0, 2.0, 3.0 reaches the 1.0 floor last, and after how many half-lives?",
      options: [
        { id: "opt-a", text: "The bond at 4.0, after exactly two half-lives.", explanation: "Correct. The floor-arrival time is \\(t_{1/2} \\cdot \\log_{2} B_{i}(0)\\), and \\(\\log_{2} 4 = 2\\).", correct: true },
        { id: "opt-b", text: "The bond at 4.0, after four half-lives.", explanation: "Incorrect. Each half-life halves the bond, so 4.0 becomes 2.0 and then 1.0: two half-lives.", correct: false },
        { id: "opt-c", text: "Every bond at the same moment, because they share one constant.", explanation: "Incorrect. They share a half-life, but stronger bonds start further from the floor.", correct: false },
        { id: "opt-d", text: "The bonds at 2.0, because weak bonds decay more slowly.", explanation: "Incorrect. The weakest bonds reach the floor first, after one half-life.", correct: false },
      ],
    },
    {
      id: "q4-2-6",
      question: "The bus carries a stability half-life of 0. What should an automated reader conclude?",
      options: [
        { id: "opt-a", text: "The settlement has collapsed; the half-life has reached zero.", explanation: "Incorrect. A short half-life is always a positive number; zero is the bus value when no decay is modelled.", correct: false },
        { id: "opt-b", text: "No decay is modelled, because exposure and rupture are both zero; it must check the decay constant to confirm.", explanation: "Correct. The bus carries zero when the half-life is undefined, so the reader tests the decay constant first.", correct: true },
        { id: "opt-c", text: "The desk is under override.", explanation: "Incorrect. Override removes the rupture term but leaves any exposure, so the half-life is usually still positive.", correct: false },
        { id: "opt-d", text: "The horizon was set to zero days.", explanation: "Incorrect. The horizons are fixed at 30, 90, 180 and 365 days and do not affect the half-life.", correct: false },
      ],
    },
  ],
  practice: [
    {
      problem: "On the Codex vector 3.8, 2.6, 2.2 and 3.4, with one insulated shock of severity 18, a Rupture Index of 9 and the desk linked, compute the exposure, the decay constant, the half-life, the 30-day projections and the mean loss.",
      solution: [
        "The insulated shock contributes a quarter of its severity, \\(U = 4.5\\). The load is \\(4.5 + 9 = 13.5\\), so \\(\\lambda = 0.00675\\) per day and \\(t_{1/2} = \\frac{0.693147}{0.00675} = 102.7\\) days. The bus carries the constant rounded half-up to four decimals, 0.0068.",
        "At 30 days the multiplier is \\(e^{-0.2025} = 0.8167\\), giving 3.10, 2.12, 1.80 and 2.78 after rounding. The losses are 0.70, 0.48, 0.40 and 0.62, which sum to 2.20, so the mean loss is 0.55.",
      ],
    },
    {
      problem: "A drafting team wants the settlement to carry a half-life of at least 90 days. The Sentinel Matrix reads 9. What is the largest unmitigated exposure the desk can tolerate?",
      solution: [
        "The load for a 90-day half-life is \\(\\frac{2000\\, \\ln 2}{90} = 15.40\\). With a Rupture Index of 9, the exposure must not exceed \\(15.40 - 9 = 6.4\\) points.",
        "That is one insulated shock of severity up to 25, or a few light shocks insulated together, and nothing uninsulated. The arithmetic explains why the desk's calibration is described as severe: a three-month half-life is available only to a settlement that is already nearly quiet.",
      ],
    },
    {
      problem: "On the Drill Beta vector, linked with a Rupture Index of 38, the uninsulated exposure is 26 and the insulated exposure is 6.5. What is the value of the provisions in days?",
      solution: [
        "Uninsulated, \\(\\lambda = \\frac{64}{2000} = 0.032\\) and the half-life is 21.7 days. Insulated, \\(\\lambda = \\frac{44.5}{2000} = 0.02225\\) and the half-life is 31.2 days.",
        "The provisions buy about 9.5 days of half-life. That is the figure the drafting team defends; and because the Rupture Index of 38 now carries most of the load, further runway must come from the Sentinel register, not from more provisions.",
      ],
    },
    {
      problem: "With a decay constant of 0.03625 per day, give the floor-arrival time of a bond at 2.2 and the fracture window of a mean bond of 3.0, and classify the window.",
      solution: [
        "The floor-arrival time is \\(\\frac{\\ln 2.2}{0.03625} = 21.8\\) days. The fracture window is \\(\\frac{\\ln 1.5}{0.03625} = 11.2\\) days, which the desk rounds to 11 days and 0.4 months: imminent.",
        "The mean reaches the fracture level about ten days before the weakest bond reaches the floor. The operator should cite the window, which is the earlier reading, and should not take comfort from the fact that no bond has yet reached severance.",
      ],
    },
    {
      problem: "On the Drill Beta reading (Rupture Index 38, uninsulated exposure 26, linked), compare the half-life gained by insulating the applied shocks, which leaves an exposure of 6.5, with the gain from lowering the Rupture Index by ten points while leaving the exposure at 26. Which lever should the operator pull first?",
      solution: [
        "The starting load is 64, so \\(\\lambda = 0.032\\) and the half-life is 21.7 days. Insulating gives a load of 44.5, \\(\\lambda = 0.02225\\) and 31.2 days, a gain of 9.5 days. Lowering the index to 28 gives a load of 54, \\(\\lambda = 0.027\\) and \\(\\frac{0.693147}{0.027} = 25.7\\) days, a gain of 4.0 days.",
        "Insulation first: it removes more load and is delivered by drafting rather than by verified clearance in the field. After it, the rupture term is 38 of the remaining 44.5, and every further day must come from the Sentinel register.",
      ],
    },
    {
      problem: "Every one of the ten registered shocks is applied and the Sentinel Matrix reads 100. Give the half-life with nothing insulated, and then with every shock insulated. Can the register be fully insulated?",
      solution: [
        "Uninsulated, the exposure is the full 186 points, the load is 286, \\(\\lambda = 0.143\\) and the half-life is 4.8 days. Each of the ten shocks is listed by at least one of the seven provisions, so the register can be fully insulated; the exposure then falls to a quarter, 46.5, the load to 146.5, \\(\\lambda = 0.07325\\) and the half-life to about 9.5 days.",
        "Full insulation roughly doubles the runway, but against a Rupture Index of 100 it cannot buy even ten days. The same exposure of 46.5 with the index at zero would give 29.8 days. The register and the provisions are complements, not substitutes: insulation caps what the shocks cost, and only rupture reduction removes the rest of the load.",
      ],
    },
    {
      problem: "The canonical vector 4.0, 2.0, 2.0 and 3.0 is read at the default inputs. A briefing quotes a mean loss of 1.38. The next renewal is scheduled for day 75. What should the briefing have said?",
      solution: [
        "1.38 is the mean loss at the 30-day horizon. At 90 days, the shortest published horizon that reaches the renewal, every bond is on the floor and the mean loss is 1.75, its ceiling of the starting mean less one.",
        "More decisive still is the fracture window: the starting mean is 2.75, so \\(t_{f} = \\frac{\\ln(2.75 \\div 2.0)}{0.02325} = 13.7\\) days, which the desk reports as 14 days, imminent. The renewal at day 75 falls far outside the window; the briefing should have said that the settlement is not expected to reach its renewal in the condition the renewal assumes, and that the limiting bonds reach the floor at day 29.8.",
      ],
    },
  ],
  readingList: [
    {
      citation: "Declaration of Principles on Interim Self-Government Arrangements, Washington, 13 September 1993 (Avalon Project, Yale Law School)",
      url: "https://avalon.law.yale.edu/20th_century/isrplo.asp",
      note: "Articles V, X and XV: the five-year transitional period, the Joint Liaison Committee and the dispute ladder. Also circulated as UN document A/48/486 and S/26560.",
    },
    {
      citation: "United States Department of State, Office of the Historian, The Oslo Accords and the Arab-Israeli Peace Process",
      url: "https://history.state.gov/milestones/1993-2000/oslo",
      note: "Cairo and Taba agreements, the November 1995 assassination, Hebron, Wye, Sharm el-Sheikh, Camp David and the absence of a monitoring role.",
    },
    {
      citation: "United Nations, UNAVEM II background (Department of Public Information)",
      url: "https://peacekeeping.un.org/sites/default/files/past/Unavem2/UnavemIIB.htm",
      note: "The Bicesse Accords, demobilisation figures, the 1992 elections, the return to war and the Lusaka Protocol.",
    },
    {
      citation: "United Nations, MONUA background (Department of Public Information)",
      url: "https://peacekeeping.un.org/sites/default/files/past/monua/monuab.htm",
      note: "Pending Lusaka tasks, the 1997 to 1998 drawdown, the death of the Special Representative and the collapse of the process.",
    },
    {
      citation: "NIST/SEMATECH e-Handbook of Statistical Methods, 8.1.6.1 Exponential",
      url: "https://www.itl.nist.gov/div898/handbook/apr/section1/apr161.htm",
      note: "Reliability function, constant failure rate, median life and the piecewise exponential approximation.",
    },
    {
      citation: "NIST/SEMATECH e-Handbook of Statistical Methods, 8.1.2.4 Bathtub curve",
      url: "https://www.itl.nist.gov/div898/handbook/apr/section1/apr124.htm",
      note: "Early failure, intrinsic failure and wear-out periods.",
    },
    {
      citation: "V. P. Fortna, 'Scraps of Paper? Agreements and the Durability of Peace', International Organization 57(2) (2003) 337 to 372",
      url: "https://doi.org/10.1017/S0020818303572046",
      note: "Hazard analysis of ceasefire durability, agreement content, controls, and mechanisms associated with more durable peace.",
    },
    {
      citation: "I. W. Zartman, 'Ripeness: The Hurting Stalemate and Beyond', in P. C. Stern and D. Druckman (eds), International Conflict Resolution After the Cold War (National Academies Press, 2000) 225 to 250",
      url: "https://www.nationalacademies.org/read/9897/chapter/7",
      note: "The mutually hurting stalemate, the precipice, ripening and the mutually enticing opportunity.",
    },
    {
      citation: "The Vinculum Codex and Compact, UDCA Official Edition, Part V, 5.1 Decay Horizon and Stability Half-Life",
      note: "Doctrine, derivation, floor-arrival time, horizon table and worked Settings A and B (supplied edition; not public).",
    },
  ],
};
