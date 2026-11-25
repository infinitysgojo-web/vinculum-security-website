import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import { F_ESCROW_RELEASE, F_FORUM_E, F_FORUM_F, F_INSCRIBED, F_LIEBIG, F_RUPTURE } from "./academyFormulas";

/**
 * Module V, Chapter 5.3: Drill Gamma. The scenario states are fictional; the precedents
 * are read from the open public record only, and every figure, including the seven
 * venue scores, is re-derived from the engine in qa/academy-curriculum.test.ts.
 */
export const CHAPTER_5_3: DetailedAcademyChapter = {
  id: "drill-maritime",
  number: "5.3",
  eyebrow: "Module V · Chapter 5.3 · Drill Gamma",
  title: "Drill Gamma: Maritime EEZ Conflict",
  estimatedMinutes: 45,
  drillType: "maritime",
  executiveLede:
    "Two coastal states face each other across a semi-enclosed sea. Their claimed exclusive economic zones overlap over a rich fishing ground, and for years their fleets have fished it under an informal understanding. This season one state's coast guard arrested a trawler of the other; the other state sent a naval patrol to escort its fleet; the two vessels have shadowed each other for a week. A joint fisheries fund, created under the informal understanding, holds licence revenues for both coasts. The drill asks how to choose a forum both states can be held to, and what the desks do when enforcement at sea pushes the reading into the Critical band.",
  synopsis: [
    "Diagnostic profile: the bonds read \\(B = (3.1,\\, 2.2,\\, 3.4,\\, 2.6)\\). The Communal bond, carried by the fishing communities of both coasts, is the limiting bond at 2.2, in the Fragile band; the Institutional-Relational bond at 2.6 also breaches the floor. A register score of 28 reads a Rupture Index of 50 under a static trend and 57 under a deteriorating one; an inscribed naval-escort trap adds six points of load, and the reading becomes 64, in the Critical band. At 60 or more the joint fisheries fund freezes.",
    "Strategic objective: select a venue on the Forum Matrix that can reach both states and their assets, using the engine's seven venue scores: base enforceability of ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss Arbitration Centre 68, SIAC 66 and ICJ Advisory 46, less 18 while immunity is unaddressed and 8 when the seat is not neutral. The venue must also have a jurisdictional basis for an inter-state maritime dispute, which the score does not measure.",
    "The precedents are the South China Sea Arbitration between the Philippines and China, administered by the Permanent Court of Arbitration, award of 12 July 2016; the Cod Wars between Iceland and the United Kingdom from 1958 to 1976; and Maritime Delimitation in the Indian Ocean between Somalia and Kenya, judgment of the International Court of Justice of 12 October 2021. Each shows a different relation between a forum's decision and a party's compliance.",
  ],
  formulas: [F_FORUM_F, F_RUPTURE],
  statutoryNotice:
    "Drill Rule: the engine has no distance-based naval trigger. Enforcement at sea enters the desks only as observed tripwires, inscribed load and trend; the joint fund freezes when, and only when, the Rupture Index reaches 60. Venue fitness measures enforceability, not jurisdiction, and the states in the scenario are fictional.",
  learningOutcomes: [
    "Compare the South China Sea Arbitration, the Cod Wars and Kenya v Somalia on what a forum's decision achieved without a party's participation or consent to the result.",
    "Compute the Rupture Index of a maritime standoff from the register, the trend and the inscribed naval load, and name the moment the joint fund freezes.",
    "Read the seven venue scores of the Forum Matrix and compute venue fitness under each combination of immunity waiver and seat.",
    "Distinguish enforceability, which the Forum Matrix scores, from jurisdiction over an inter-state maritime dispute, which the operator must establish separately.",
    "Sequence the communal and institutional steps that lower the reading below 60 and release the fund.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "Three Maritime Disputes and the Distance Between a Ruling and Compliance",
      paragraphs: [
        "Maritime disputes are disputes about lines that cannot be seen. A fishing ground does not look different on one side of a claimed boundary, and a fleet that has fished it for generations does not experience a new claim as law; it experiences an arrest. That is why maritime disputes so often move from the chart table to the water, and why the forum that decides them must be chosen with compliance in mind from the start.",
        "The Cod Wars between Iceland and the United Kingdom are the classic case of a fisheries standoff enforced at sea. Iceland extended its fisheries limit to twelve miles in 1958, to fifty miles in 1972 and to two hundred miles in 1975. Each extension was resisted by British trawlers fishing under Royal Navy protection, and each produced confrontations in which Icelandic coast guard vessels cut trawl wires and ships collided. The first dispute ended with an exchange of notes in 1961; the second with an interim agreement in 1973. In the third, Iceland broke off diplomatic relations with the United Kingdom in February 1976, and an agreement was reached at Oslo in June 1976 that accepted Icelandic control of the two-hundred-mile zone with limited British access for a transitional period.",
        "The Cod Wars also produced a judgment that the victor did not need. The United Kingdom brought proceedings before the International Court of Justice, and in July 1974 the Court held that Iceland's fifty-mile extension was not opposable to the United Kingdom. Iceland did not appear. Within two years the law of the sea had moved toward two-hundred-mile zones, and the dispute was settled by negotiation on terms close to Iceland's position. A judgment rendered against the direction of state practice, and without one party's participation, decided the case and did not decide the outcome.",
        "The South China Sea Arbitration was brought by the Philippines against China in January 2013 under Annex VII of the United Nations Convention on the Law of the Sea, with the Permanent Court of Arbitration acting as registry. It followed a standoff at Scarborough Shoal in 2012 that began with fishing vessels and government ships on both sides. China did not participate. The tribunal found it had jurisdiction in October 2015, and in its award of 12 July 2016 it held, among other things, that there was no legal basis for China to claim historic rights to resources within the sea areas falling within the nine-dash line, that none of the Spratly features was capable of generating an exclusive economic zone, and that certain Chinese actions had violated the Philippines' sovereign rights. China declared the award null and void and without binding force.",
        "Maritime Delimitation in the Indian Ocean was brought by Somalia against Kenya before the International Court of Justice in August 2014. Kenya's preliminary objections were rejected in 2017. Kenya did not take part in the oral hearings on the merits in March 2021. In its judgment of 12 October 2021 the Court found that there was no agreed maritime boundary between the parties, rejected Kenya's claim that Somalia had acquiesced in a boundary along a parallel of latitude, and drew a boundary largely by an adjusted equidistance line. Kenya stated that it did not recognise the judgment.",
        "The three cases teach one lesson in three forms. A forum can decide a maritime dispute without the participation of one party; it cannot, by deciding, make that party comply. In the Cod Wars the negotiated settlement outran the judgment; in the South China Sea the award stands as law and is rejected in practice; in the Indian Ocean the judgment fixed a line that one party says it does not accept. The forum choice in Drill Gamma is therefore not only a question of which venue scores highest. It is a question of which venue both states will stay inside, and what the instrument can reach if one of them does not.",
      ],
      caseStudy: {
        title: "The South China Sea Arbitration (2013 to 2016), the Cod Wars (1958 to 1976) and Kenya v Somalia (2014 to 2021)",
        jurisdiction: "Philippines and China; Iceland and the United Kingdom; Somalia and Kenya / South China Sea, North Atlantic and Indian Ocean",
        precedent: "South China Sea Arbitration, PCA Case No. 2013-19, award of 12 July 2016; Fisheries Jurisdiction (United Kingdom v. Iceland), ICJ judgment of 25 July 1974; Oslo agreement of 1 June 1976; Maritime Delimitation in the Indian Ocean (Somalia v. Kenya), ICJ judgment of 12 October 2021",
        analysis: [
          "In the Cod Wars, fisheries limits extended in three stages were enforced at sea by coast guard and naval vessels, and the dispute was settled by negotiation in 1976 after an ICJ judgment of 1974 that Iceland, which did not appear, never accepted.",
          "In the South China Sea Arbitration, an Annex VII tribunal administered by the PCA found jurisdiction and ruled on the merits without China's participation; China rejected the award.",
          "In Somalia v Kenya, the ICJ drew a maritime boundary after Kenya withdrew from the oral hearings, and Kenya stated that it did not recognise the judgment.",
        ],
        failureMechanism:
          "In each case the forum produced a decision without the participation or acceptance of one party, and no mechanism in the underlying instrument converted the decision into compliance. Enforcement at sea, not the ruling, shaped the facts on the water.",
      },
      statutoryRule:
        "Rule 5.3-A: A forum is chosen for the compliance it can secure, not only for the decision it can render. The dispute clause must name what the award can reach if a party does not perform.",
    },
    {
      heading: H.architecture,
      subheading: "The Fishing Communities, the Fund and the Seven Venues",
      paragraphs: [
        "The relational vector of the drill reads 3.1 on the Interpersonal bond, 2.2 on the Communal bond, 3.4 on the Intergenerational bond and 2.6 on the Institutional-Relational bond. The fisheries ministers have worked together for years under the informal understanding, so the Interpersonal bond is just above the floor. Both states' fishing communities have depended on the ground for generations and expect their children to fish it, so the Intergenerational bond is Viable. The communities now see each other's fleets as intruders and their own coast guard or navy as their only protection: the Communal bond is the limiting bond, Fragile at 2.2. The informal understanding was never written down and the joint fund has no dispute clause: the Institutional-Relational bond is Fragile at 2.6.",
        "Under the Liebig minimum the operator reads the Communal bond first. A Fragile Communal bond tolerates one phase of lead by the principals' track, so a ministerial meeting may run one step ahead of the communal track but no further. Two bonds breach the floor, so the Vector Integrity gate holds.",
        "The Sentinel Matrix reads the standoff from the register. The arrest, the escort and the shadowing are observed tripwires on the Communal and Institutional-Relational bonds. The naval escort is also inscribed through the Sovereign Inscription tray as an active custom trap, because it is a structural change in how the dispute is conducted. The engine has no rule that reads a distance from the coast or a class of vessel; it reads only what the analyst records, weighted by the register, and the trend.",
        "The joint fisheries fund is a Conditional Escrow Waterfall in all but name. Its licence revenues are partitioned into four tranches, its conditions are the default conditions read from the bus, and, like every waterfall on the desks, it freezes at a Rupture Index of 60 or more. In the drill the verifier is seated, so Mobilisation is met; Demarcation is not, because the Communal bond stands at 2.2, below the floor, and under the chain rule nothing later can be met before it.",
        "The Forum Matrix on Desk 11 carries seven venues, each with three doctrinal ratings on a 1 to 5 scale: teeth, the strength of the enforcement route; immunity, the exposure to a sovereign-immunity defence at execution, where 5 is the most exposed; and pace, the speed of the procedure. Base enforceability is \\(E = \\round(\\frac{100 \\times (0.5\\, t + 0.3\\, (6 - i) + 0.2\\, p)}{5})\\). The seven bases are ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss Arbitration Centre 68, SIAC 66 and ICJ Advisory 46. Venue fitness subtracts 18 while the clause leaves immunity unaddressed and 8 when the seat lies in a party's territory, floored at zero; enforcement friction is 100 less fitness.",
        "The ratings are ordinal judgements, not measured statistics, and the engine does not score jurisdiction. ICSID's high base reflects the strength of its enforcement route for pecuniary awards, but ICSID hears disputes between a state and a national of another state arising out of an investment; it is not a forum for a boundary or fisheries dispute between two states. The operator reads the scores for enforceability and establishes jurisdiction separately, from the instrument the states sign.",
      ],
      formulas: [F_LIEBIG, F_INSCRIBED, F_FORUM_E],
      statutoryRule:
        "Rule 5.3-B: The engine has no distance or vessel trigger. A naval movement enters the desks only as a tripwire, an inscribed trap or a trend, and the analyst records it as such.",
    },
    {
      heading: H.proofs,
      subheading: "The Standoff in the Critical Band, and the Venue Table",
      paragraphs: [
        "The reading before the escort. The analyst has marked tripwires totalling a weight of 28 on the standard register. Under a static trend the Rupture Index is \\(\\round(\\frac{100 \\times 28}{56}) = 50\\), the Elevated band. The fund releases normally on its met tranches.",
        "The reading during the standoff. The trend is read as deteriorating: \\(\\round(50 \\times 1.15) = \\round(57.5) = 57\\). The naval escort is inscribed as one active custom trap, which adds six points of inscribed load, \\(I = 6\\). The reading becomes \\(\\round((50 + 6) \\times 1.15) = \\round(64.4) = 64\\), the Critical band. Nothing else has changed; the escort and the direction of the standoff have moved the dispute across the freeze threshold.",
        "The freeze. With the verifier seated and only Mobilisation met, the gross is 25. Below 60 the fund would release \\(25 - 2.5 - 5 = 17.5\\) per cent. At 64 it releases nothing: the freeze holds the whole gross, the met tranche remains met, and release resumes at 17.5 per cent the day the reading falls below 60. The freeze is not a forfeiture, and seating another verifier does not lift it. The larger tranches wait on the Communal bond, which is why the communal track, not the forum, is what eventually opens the fund.",
        "The venue table. With immunity unaddressed and a seat in a party's territory, fitness is the base less 26: ICSID 54, PCA 48, LCIA 46, ICC 44, Swiss Arbitration Centre 42, SIAC 40 and ICJ Advisory 20. With an express waiver but a party seat, the base less 8: PCA 66 and ICJ Advisory 38. With a neutral seat but no waiver, the base less 18: PCA 56 and ICJ Advisory 28. With both, fitness equals the base: PCA 74 and ICJ Advisory 46. Fitness and friction always sum to 100.",
        "The selection. Among the venues that can hear an inter-state maritime dispute, the drill's instrument will choose between arbitration administered by the Permanent Court of Arbitration and the International Court of Justice. The engine's ICJ entry is the advisory and contentious route with no execution mechanism of its own, which is why its pace and teeth are rated low and its base is 46. The PCA entry is rated on recognition and enforcement under the New York Convention, base 74. With an express waiver and a seat outside both states, a PCA clause keeps a fitness of 74 against an enforcement friction of 26. The drafting is worth 26 points; the choice of venue is worth 28 more.",
        "The proof the operator must carry is that the score supports the choice without making it. The PCA's higher fitness says that an award under its administration is more likely to be enforceable against assets; the South China Sea Arbitration says that an award can be rendered under its administration without a party's consent to the result. The operator therefore chooses PCA arbitration for its enforceability and adds what the score cannot: consent to the forum written into the instrument by both states, and an asset the award can reach, the joint fund itself.",
      ],
      formulas: [F_RUPTURE, F_ESCROW_RELEASE, F_FORUM_F],
      statutoryRule:
        "Rule 5.3-C: Venue fitness is computed, never asserted. A clause that leaves immunity unaddressed or seats the forum in a party's territory is scored with its penalties, whatever the drafting party believes.",
    },
    {
      heading: H.protocols,
      subheading: "From the Water to the Clause",
      paragraphs: [
        "Step one, Sentinel Matrix (Desk 02): record the arrest, the escort and the shadowing as tripwires with their bonds and weights, set the trend to deteriorating, and inscribe the escort as an active custom trap. Read the index: 64, Critical. Publish.",
        "Step two, the Conditional Escrow Waterfall (Desk 07): read the freeze. Notify both fisheries ministries that the fund is frozen under the engine's rule, that the tranches remain met, and that release resumes at the level the tranches justify when the reading falls below 60. A freeze announced as a rule is a lever on both states; a freeze announced as a sanction is a grievance for one.",
        "Step three, Track Sequencing (Desk 08): with a Fragile Communal bond, one phase of ministerial lead is tolerated. Use it for a single step: a joint instruction to both fleets and both enforcement services to stand off to agreed positions while the commission meets. Then return to the communal track: a joint catch-reporting system with data published to both coasts, and a hotline between the two coast guards.",
        "Step four, Verification Ledger (Desk 16): seat an independent verifier for catch and vessel-position data. It is already seated for the fund; extend its mandate to the fishing ground so that the next arrest is preceded by a shared record rather than a single state's account.",
        "Step five, Forum Matrix (Desk 11): draft the dispute clause for a written fisheries agreement. Disputes go to arbitration administered by the Permanent Court of Arbitration, seated outside both states, with an express waiver of immunity from jurisdiction and execution over the fund's assets. Both states consent to the forum in the instrument itself, so that neither can later argue that it never accepted it.",
        "Step six, Sentinel Matrix again: as the fleets stand off and the hotline operates, the analyst re-reads the register. When the escort is withdrawn the inscribed trap is deactivated; when the trend is read as static, the index returns toward 50. Below 60 the fund recomputes and releases 17.5 per cent, and more as the Communal bond rises above the floor. No threshold has moved; the reading has.",
      ],
      statutoryRule:
        "Rule 5.3-D: The joint fund freezes at a Rupture Index of 60 and releases when the reading falls below it. No ministry may order a release under the freeze, and no ministry may order a freeze above it.",
    },
    {
      heading: H.failure,
      subheading: "The Highest Score, the Absent Party and the Imagined Trigger",
      paragraphs: [
        "Failure mode one: choosing the highest score. An analyst reads ICSID's base of 80 and drafts an ICSID clause for a fisheries agreement between two states. The score measures enforceability; it does not confer jurisdiction, and ICSID does not hear inter-state boundary or fisheries disputes. The countermeasure is to establish the jurisdictional basis first and read the score among the venues that have one.",
        "Failure mode two: the imagined trigger. An operator expects the fund to freeze automatically when a naval vessel enters a certain distance of the other coast. The engine has no such rule. It freezes the fund only when the Rupture Index reaches 60. If the escort is never recorded as a tripwire or an inscribed trap, the fund keeps releasing while the vessels shadow each other. The countermeasure is the register: what is observed is recorded, with its bond and weight, the same day.",
        "Failure mode three: the absent party. One state announces that it will not take part in any proceedings over the fishing ground. The South China Sea and Kenya v Somalia show that a forum may proceed and decide without that party; they also show that the decision may then be rejected. The countermeasure is consent written into the instrument before the dispute and an asset the award can reach. The fund is that asset.",
        "Failure mode four: the unwaived clause. The clause names PCA arbitration but leaves immunity unaddressed and seats the tribunal in one state's capital. Its fitness is 48, not 74, and the award may be unenforceable against the very fund it was meant to govern. The countermeasure is the waiver text and a neutral seat, drafted before signature.",
        "Failure mode five: enforcement as communal repair. Each state's navy or coast guard is presented to its own fishing communities as their protection. In the short run this lifts each community's trust in its own state; in the relation between the two coasts it lowers the Communal bond further, because each fleet now sees the other state's guns. The Cod Wars ended not because one navy prevailed but because a negotiated settlement replaced enforcement at sea. The countermeasure is to move protection from navies to a shared record and a shared verifier.",
        "The Liebig bottleneck in this drill is communal. The forum, however well chosen, is an Institutional-Relational repair; it cannot lift the fishing communities' trust in each other, and while that bond is the minimum, the dispute will keep returning to the water.",
      ],
      statutoryRule:
        "Rule 5.3-E: The score is read among the venues that have jurisdiction. An enforceable forum that cannot hear the dispute is not a forum for it.",
    },
    {
      heading: H.instrument,
      subheading: "Seven Venues Under Waiver and Seat",
      paragraphs: [
        "Open the forum cutaway with immunity unaddressed and the seat in a party's territory. The seven bars read ICSID 54, PCA 48, LCIA 46, ICC 44, Swiss Arbitration Centre 42, SIAC 40 and ICJ Advisory 20. Waive immunity and watch every bar rise by 18; move the seat to neutral ground and watch it rise by 8 more. Select the PCA and read its fitness, 74, and its enforcement friction, 26. The cutaway computes through the Clause Redliner's own function and never publishes to the bus.",
      ],
      instrument: "forum",
    },
  ],
  quiz: [
    {
      id: "q5-3-1",
      question: "A register score of 28 reads 50 under a static trend. The trend turns deteriorating and the naval escort is inscribed as one active custom trap. What does the Sentinel Matrix read, and what happens to the joint fund?",
      options: [
        { id: "opt-a", text: "57, Elevated; the fund keeps releasing.", explanation: "Incorrect. 57 is the deteriorating reading without the inscribed trap; the trap adds six points of load.", correct: false },
        { id: "opt-b", text: "64, Critical; the fund freezes and releases nothing.", explanation: "Correct. \\(\\round((50 + 6) \\times 1.15) = 64\\). At 60 or more the waterfall releases nothing, though its tranches remain met.", correct: true },
        { id: "opt-c", text: "56, Elevated; the trap adds to the share but the trend does not.", explanation: "Incorrect. The trend multiplier scales the whole reading, inscribed load included.", correct: false },
        { id: "opt-d", text: "100, because a naval vessel has crossed a distance trigger.", explanation: "Incorrect. The engine has no distance-based naval trigger.", correct: false },
      ],
    },
    {
      id: "q5-3-2",
      question: "A PCA clause leaves immunity unaddressed and seats the tribunal in one party's capital. What is its venue fitness?",
      options: [
        { id: "opt-a", text: "74", explanation: "Incorrect. 74 is the base, before the penalties.", correct: false },
        { id: "opt-b", text: "56", explanation: "Incorrect. That deducts only the immunity penalty.", correct: false },
        { id: "opt-c", text: "48", explanation: "Correct. \\(74 - 18 - 8 = 48\\); enforcement friction is 52.", correct: true },
        { id: "opt-d", text: "66", explanation: "Incorrect. That deducts only the seat penalty.", correct: false },
      ],
    },
    {
      id: "q5-3-3",
      question: "Why is ICSID, with the highest base enforceability of 80, not the forum for Drill Gamma?",
      options: [
        { id: "opt-a", text: "Because its immunity rating is the worst of the seven venues.", explanation: "Incorrect. ICSID's immunity rating is 3, in the middle of the range.", correct: false },
        { id: "opt-b", text: "Because the score measures enforceability, and ICSID hears investment disputes between a state and a foreign national, not inter-state fisheries or boundary disputes.", explanation: "Correct. Jurisdiction is established from the instrument; the score is read among the venues that have it.", correct: true },
        { id: "opt-c", text: "Because ICSID awards cannot be enforced.", explanation: "Incorrect. ICSID's enforcement route for pecuniary awards is why its base is the highest.", correct: false },
        { id: "opt-d", text: "Because the engine forbids arbitration in maritime disputes.", explanation: "Incorrect. The engine scores venues; it does not forbid any.", correct: false },
      ],
    },
    {
      id: "q5-3-4",
      question: "What do the South China Sea Arbitration and Somalia v Kenya teach together about forum selection?",
      options: [
        { id: "opt-a", text: "A forum cannot proceed without both parties present.", explanation: "Incorrect. In both cases the forum proceeded and decided without one party's participation in the hearings.", correct: false },
        { id: "opt-b", text: "A forum may decide without a party's participation, but deciding does not secure compliance; consent and a reachable asset must be built into the instrument.", explanation: "Correct. Both decisions were rejected by a party; the instrument must name what the award can reach.", correct: true },
        { id: "opt-c", text: "Maritime disputes are always settled by negotiation, never by a forum.", explanation: "Incorrect. Both cases produced binding decisions.", correct: false },
        { id: "opt-d", text: "The ICJ always has a higher venue fitness than the PCA.", explanation: "Incorrect. On the Forum Matrix the ICJ Advisory base is 46 and the PCA base is 74.", correct: false },
      ],
    },
  ],
};
