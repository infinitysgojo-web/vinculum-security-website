import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import { F_CASE_DISTANCE, F_FRICTION, F_RESONANCE } from "./academyFormulas";

/**
 * Module IV, Chapter 4.3 (Phase B expansion), in the seven-part lecture structure. Every figure
 * is computed by frictionCoefficient, rankCases, distanceTable and MAX_DISTANCE (engine.ts) or by
 * the De-confliction Bench's tolerance rules; the worked figures are re-derived in
 * qa/academy-curriculum.test.ts. No historical party is given coordinates: precedents are read
 * qualitatively, and every number belongs to the canonical cases or to a stated drill vector.
 */
export const CHAPTER_4_3: DetailedAcademyChapter = {
  id: "asymmetry-distance",
  number: "4.3",
  eyebrow: "Module IV · Chapter 4.3",
  title: "Normalized Asymmetry Distance (Δasym)",
  estimatedMinutes: 60,
  executiveLede:
    "Disputes often fail because parties are assumed to stand at equal distance from a settlement when profound asymmetry separates them. The platform measures that distance in one space only, the four-bond space: between a live theatre and the eight documented cases on Desk 01, and between the tolerance vectors of seated parties on the De-confliction Bench (Desk 07). Both are Euclidean distances normalised by 8, the largest distance two four-bond vectors on the 1 to 5 scale can reach. The doctrine's \\(\\Delta_{asym}\\) is that normalised distance.",
  synopsis: [
    "On Desk 01 the distance \\(d(B,\\, C_{k})\\) from the live vector to each canonical case is converted into a resonance, \\((1 - \\frac{d}{8}) \\times 100\\), and the three nearest cases are ranked, ties going to the earlier case. A nearest case is a mirror, not a template.",
    "On Desk 07 each party carries a tolerance vector, and the friction coefficient of a pair is the distance between their vectors divided by 8, rounded to two decimals. The largest pairwise coefficient is published as the party friction reading, and the veto holder is the party whose tolerance on the limiting bond most exceeds the live limiting score. The engine attaches no breach threshold to the coefficient; it tells the operator where third-party guarantees or neutral holdbacks are needed.",
    "The axes are the four bonds, not military, economic or informational power. The lecture reads the Indus Waters Treaty of 1960 and the parallel procedures requested by India and Pakistan in 2016, beside the Panama Canal Treaties of 1977, in which a stark asymmetry was answered with a dated transfer of custody, then derives the metric and sets it beside the theory of power in negotiation.",
  ],
  statutoryNotice:
    "Canonical Rule: distances in the four-bond space are normalised by \\(8 = \\sqrt{4 \\times 16}\\). Asymmetry proofs use the normalised Euclidean distance of actual inputs and never invented party coordinates.",
  learningOutcomes: [
    "Explain, from the Indus precedent, how architecture answers an asymmetry the parties cannot close themselves.",
    "Compute the Euclidean distance and resonance between a live vector and a documented case.",
    "Prove that the maximum distance in the four-bond space is 8 and explain why normalisation makes readings comparable.",
    "Compute the friction coefficient between two seated parties from their tolerance vectors and name the veto holder.",
    "Design neutral guarantees and graded dispute routes that do not depend on the stronger party's goodwill.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "The Indus Waters Treaty and the Panama Canal Treaties: Two Answers to Structural Asymmetry",
      paragraphs: [
        "Asymmetry cannot be negotiated away; it can only be answered by structure. The instruments that survive great asymmetry place a neutral party inside the treaty, divide the contested resource by rule rather than by discretion, and give the weaker party a graded path to an independent decision that the stronger party cannot block. They also carry a second, harder lesson: a neutral structure can keep deciding after a party walks away, but it cannot by itself make the party come back.",
        "This section reads two instruments from the open record. The Indus Waters Treaty answered an asymmetry written into a river with allocation by rule and a ladder of neutral decision-makers, and its recent history tests that ladder under the most severe strain an instrument can face. The Panama Canal Treaties answered an asymmetry of power and possession with something different: a dated calendar on which custody passed from the stronger party to the weaker. Neither case is given coordinates in the four-bond space. The record does not supply them, and the platform's rule forbids inventing them.",
      ],
      caseStudy: {
        title: "The Indus Waters Treaty: Geography as Asymmetry (1960 to 2023)",
        jurisdiction: "India and Pakistan, with the World Bank / Indus Basin",
        precedent: "Indus Waters Treaty, signed at Karachi on 19 September 1960; World Bank account of the parallel requests and appointments through 2022",
        analysis: [
          "Partition in 1947 left the headworks of the Indus system largely in India while the irrigated plains that depended on them lay in Pakistan: an upstream and downstream asymmetry written into the river itself. After nine years of negotiation initiated by the World Bank, which is itself a signatory, the treaty allocated the Eastern Rivers (the Ravi, the Beas and the Sutlej) to India and the Western Rivers (the Indus, the Jhelum and the Chenab) to Pakistan, while allowing each country certain uses on the rivers allocated to the other, including Indian run-of-river hydro-electric plants on the Western Rivers subject to design constraints in the treaty's annexures.",
          "The treaty answered the asymmetry with architecture rather than trust. A Permanent Indus Commission, with a commissioner from each country, exchanges information; questions go to the Commission, technical differences to a Neutral Expert, and disputes to an ad hoc Court of Arbitration. The World Bank describes its own role as limited and procedural: it designates individuals to serve in those proceedings when asked. A Neutral Expert decided the Baglihar difference in 2007, after about a year and a half, and a Court of Arbitration decided the Kishenganga case in 2013, after about three years.",
          "The ladder was then tested at its entry point. In 2016 Pakistan asked the World Bank to facilitate a Court of Arbitration on the design of the Kishenganga and Ratle plants; India asked for a Neutral Expert on essentially the same questions. The treaty did not empower the Bank to choose between the routes, and in December 2016 the Bank paused both appointments to give the parties time to agree. After five years without agreement, it resumed the process and in 2022 appointed a Neutral Expert and the Chairman of the Court.",
          "The World Bank's account makes an important procedural distinction: it did not adjudicate which route should prevail, and it describes the Court and Neutral Expert processes as independent mechanisms whose competence and procedure are for the decision-makers themselves. Its role is limited to appointments and related functions specified by the treaty. This is not simply a ladder in which an institution can direct a dispute upward whenever it prefers; the treaty's categories and the parties' requests shaped the available route, while the Bank's inability to choose between competing requests contributed to the pause. The design lesson is specific: when parallel procedures are possible, the instrument should state how conflicts of invocation are handled, rather than assuming that a neutral appointing body can resolve a jurisdictional choice it was not given authority to make.",
        ],
        failureMechanism:
          "A graded neutral mechanism contained a structural asymmetry for six decades and continued to decide after one party withdrew, but its entry point was contestable, its appointing authority could only pause when the parties chose different rungs, and no rung could compel the stronger party to remain within the instrument once political rupture rose.",
      },
      subsections: [
        {
          title: "Reading the Indus ladder as asymmetry architecture",
          paragraphs: [
            "The design of the treaty answers three features that the four-bond reading of asymmetry also isolates. First, the resource is divided by rule: which rivers go to which party, and on what conditions each may use the other's, is written in the text and its annexures, so that a dispute concerns the application of a rule rather than the bargaining power of the moment. Second, the routes to decision are graded by the kind of disagreement: a question of information goes to the joint body, a technical difference to an engineer, and a legal dispute to a court. Third, the persons who decide are neutral, and the institution that appoints them has no stake in the outcome.",
            "In the language of the De-confliction Bench, the Indus architecture is a set of neutral guarantees placed on the bond where the asymmetry bites, here the Institutional-Relational bond between two states and the river institutions they share. The design does not pretend the parties are equal. It accepts that one holds the headworks, and it makes the use of that position subject to rules and to decisions the holder does not control.",
            "The 2016 requests exposed a limit in the entry design. When the parties invoked different procedures for substantially the same questions, the treaty did not authorize the World Bank to choose between them. The Bank paused its appointments, encouraged an agreed mechanism, and resumed the appointments in 2022 after five years without agreement. This record supports a bounded lesson: a treaty may define distinct routes and still leave a procedural gap when parties disagree over which route applies.",
          ],
        },
        {
          title: "The Panama Canal Treaties: custody on a calendar (1977 to 1999)",
          paragraphs: [
            "The second instrument answered a different asymmetry. Under the Hay-Bunau-Varilla Treaty of 1903 the United States held permanent rights over a Canal Zone across the isthmus, negotiated for Panama by a representative who, as the State Department's own history records, entered the negotiations without formal consent from the Panamanian government. Tension over that arrangement grew through the century; riots in 1964 over the right to fly the Panamanian flag in the Zone led to a brief interruption of diplomatic relations and an agreement to negotiate a new settlement.",
            "Three draft treaties agreed in 1967 did not survive a change of government in Panama: the president who had negotiated them lost the 1968 election, and his successor was deposed by a coup eleven days into his term. Negotiations resumed under a new American negotiator from 1973, who shifted the aim from perpetual American control of the Zone to perpetual American use of the Canal. Two treaties were signed on 7 September 1977. The Neutrality Treaty provided that the United States could defend the Canal's neutrality, and the Panama Canal Treaty provided that the Zone would cease to exist on 1 October 1979 and that the Canal itself would pass to Panama on 31 December 1999.",
            "Ratification required two thirds of the United States Senate, and opposition was strong. The Senate ratified the Neutrality Treaty on 16 March 1978 and the Panama Canal Treaty on 18 April 1978, each by 68 votes to 32. Relations between the two countries grew contentious after the death of Omar Torrijos in 1981, and in December 1989 the United States invaded Panama to remove its leader. The transfer nevertheless took place on the date the treaty set, and Panama has administered the Canal since.",
            "The State Department's historical account explains that the Carter administration treated Senate ratification as a second negotiation: officials held hundreds of public forums, and the two-instrument structure separated perpetual neutrality and U.S. use from the dated transfer of the Canal Zone and eventual control. The administration later returned to Congress for implementation legislation, signed on 27 September 1979. This sequence distinguishes agreement between governments from the domestic steps needed to put the schedule into effect. In a comparative analysis, the legal date is therefore not a substitute for examining ratification, implementing authority, and the institutions responsible for carrying out a transfer.",
          ],
        },
        {
          title: "What the two instruments teach",
          paragraphs: [
            "The two designs answer asymmetry from opposite ends. The Indus treaty leaves the asymmetry in place and surrounds it with rules and neutral decision-makers; the Panama treaties remove the asymmetry over time by moving custody from the stronger party to the weaker on a fixed date, while protecting the stronger party's core interest, the use and neutrality of the Canal, by a separate instrument. Both refused the fiction that the parties stood at the same distance from a settlement, and both put the decisive step beyond the reach of the stronger party's discretion: a neutral to decide, or a date to arrive.",
            "Both also show where structure stops. The Indus ladder could not choose its own entry rung when the parties disagreed, and it could not keep a party on it. The Panama calendar survived a change of leadership, a deterioration of relations and an invasion, but the 1967 drafts that preceded it did not survive a coup, because they had not yet become an instrument. Asymmetry architecture protects a settlement that exists; it does not create the will to conclude one.",
            "These are the lessons the De-confliction Bench is built to apply. It measures how far apart the parties' demands stand, names the party that can block a settlement on the weakest bond, and tells the operator where a neutral guarantee or a dated holdback must be placed. It does not claim to measure power, and it does not claim that a guarantee will be honoured.",
          ],
          callout: {
            kind: "bridge",
            title: "How the code expresses the two answers",
            paragraphs: [
              "The Indus answer, a neutral decision-maker on the bond where asymmetry bites, is what the bench recommends when it names a veto holder: a guarantee on the limiting bond that does not depend on that party's goodwill. The Panama answer, custody moved on a fixed schedule, is what the Conditional Escrow Waterfall of Chapter 4.5 does with money: value released in a fixed order on verified conditions, never at the discretion of the party holding it. frictionCoefficient tells the operator how wide the gap is; the escrow and the guarantee are how the gap is bridged.",
            ],
          },
        },
      ],
      statutoryRule:
        "Rule 4.3-A: Where the asymmetry is geographic or structural, the instrument must allocate by rule and route disagreement to a neutral decision-maker in graded steps; goodwill is never a load-bearing member.",
    },
    {
      heading: H.architecture,
      subheading: "Two Distances in One Space, and Where Power Enters",
      paragraphs: [
        "The platform measures asymmetry in the four-bond space because that is the space in which every other reading lives. A distance computed on axes the desks do not score could not be reconciled with the rupture index, the escrow conditions or the Dominum Index, and would be a parallel store by another name. This section defines the two distances, the tolerance vectors on which the second is measured, the veto holder and the friction pairs, exactly as engine.ts, AsymmetryMatrix.tsx and MultiPartySequencer.tsx define them.",
      ],
      formulas: [F_FRICTION],
      subsections: [
        {
          title: "The diagnostic distance and resonance",
          paragraphs: [
            "Each of the eight documented cases carries a recorded four-bond profile, held in the canonical case table in a fixed order: Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya, South Africa, and Tuvalu and Kiribati. Desk 01 measures the Euclidean distance from the live vector to each profile and converts it to a resonance, \\((1 - \\frac{d}{8}) \\times 100\\). The engine publishes resonance at two precisions through two functions that share the formula: rankCases rounds to a whole per cent and supplies the three nearest cases to the bus, and distanceTable rounds to one decimal for the full table.",
            "Ranking always uses the unrounded distance, and ties go to the earlier case in canonical order. Ties are not hypothetical. Rwanda and South Africa carry the same profile, 3, 3, 2 and 2, so their distances to any live vector are always equal, their resonances always identical, and Rwanda, fifth in canonical order, is always listed before South Africa, seventh. The reading answers one question only: which documented settlement shares the structural shape of this one.",
          ],
        },
        {
          title: "Tolerance vectors and the friction coefficient",
          paragraphs: [
            "On the De-confliction Bench every seated party carries a tolerance vector: the minimum it will accept on each bond. By default a seated delegation tolerates 3.0, the viable floor, on every bond and holds out at 4.0 on the bond it carries itself. An inscribed party, entered through the Sovereign Inscription tray with a leverage and a vulnerability each scored from 1 to 5, receives a derived vector: every bond at \\(3 + 0.25\\, (L - V)\\), plus one on the live limiting bond if the party holds a veto, rounded to one decimal and clamped to the 1 to 5 scale.",
            "The friction coefficient of a pair is computed by frictionCoefficient: the Euclidean distance between the two tolerance vectors divided by MAX_DISTANCE, which is 8, clamped to the unit interval and rounded to two decimals; a non-finite distance reads as zero. The bench computes the coefficient for every pair at the table and publishes the largest as partyFriction, or zero when fewer than two parties are seated.",
          ],
          callout: {
            kind: "definition",
            title: "Tolerance, friction and veto holder",
            paragraphs: [
              "Tolerance vector: the minimum a party will accept on each of the four bonds, on the 1 to 5 scale.",
              "Friction coefficient: \\(\\round_{2}(\\frac{\\lVert T_{a} - T_{b} \\rVert}{8})\\), the normalised Euclidean distance between two tolerance vectors, computed by frictionCoefficient.",
              "Veto holder: the party whose tolerance on the live limiting bond exceeds the live limiting score by the largest strictly positive gap, rounded to one decimal; the first such party in seating order wins a tie, and no party is named when no gap is positive. Published as vetoHolder.",
            ],
          },
        },
        {
          title: "Where power enters: leverage and vulnerability",
          paragraphs: [
            "Leverage and vulnerability are where the treatise's power axes enter the platform. A party with great military or economic weight is inscribed with high leverage; a party exposed to it with high vulnerability. Those two numbers move the party's tolerance on every bond together, so the power differential is carried into the same four-bond space as everything else rather than measured on separate axes of military, economic, institutional or informational power that no desk scores.",
            "The mapping has a property worth knowing before it is used. Because leverage and vulnerability each run from 1 to 5, the difference runs from minus 4 to plus 4, and the base tolerance therefore runs from 2.0 to 4.0. Power alone can move a party's demands by at most a point in either direction from the viable floor; only a veto, adding a point on the limiting bond, can push a demand to 5.0. The design is deliberate. It treats power as a reason a party may ask for more or settle for less, not as a measure of what the settlement requires.",
          ],
        },
        {
          title: "Friction pairs and the spoiler warning",
          paragraphs: [
            "Separately from the coefficient, the bench carries named friction rules: pairs of actors recorded as conflicting at the table. Each active pair enters the contagion coefficient of the relational dynamics through the factor \\(1 + 0.10\\, n_{f}\\), and the list is published as frictionPairs. When two or more pairs are active while the Rupture Index is 35 or more, or while the Elite-Pact alert holds, the bench raises a spoiler-coalition warning and directs that the frictional parties be seated in separate opening sessions.",
            "The coefficient itself feeds no gate and no lock, and the engine attaches no breach threshold to it. The bench's matrix tints a cell more strongly at 0.12 and again at 0.25 so that the eye finds the widest pairs; those tints are visual emphasis on the desk, not statutory thresholds, and they appear nowhere in the engine.",
          ],
        },
        {
          title: "What the coefficient does not capture",
          paragraphs: [
            "Three things lie outside the coefficient by construction. It has no direction: the distance from one vector to another equals the distance back, so it cannot say which party demands more. It has no intensity: a party that would accept 3.0 reluctantly and one that would accept it gladly enter the same number. And it has no time: it reads the demands stated now, not the pace at which either party is willing to move.",
            "Each omission is covered elsewhere on the platform rather than patched into the number. Direction is supplied by the veto test, which compares each party with the live limiting score. Intensity enters, for inscribed parties, through leverage and vulnerability, and for seated delegations through the analyst's stated tolerances. Time is the business of the Decay Horizon and of the escrow's ordered tranches. Keeping the coefficient narrow is what keeps it computable from actual inputs alone.",
          ],
        },
        {
          title: "Codex grounding: a metric space and a non-linear reading",
          paragraphs: [
            "The Codex states the doctrine behind the metric precisely. Nearness in the four-bond space is resonance and distance is dissonance; the distance is a metric in the strict sense, non-negative, zero only between identical vectors, symmetric and obeying the triangle inequality, so the cases and the live theatre together form a metric space. It calls the reading non-linear because a gap of two points on one bond moves the distance further than gaps of one point on each of two bonds, since \\(\\sqrt{4} > \\sqrt{1 + 1}\\). The metric therefore treats a single large divergence as more significant than several small ones, which accords with the doctrine that one severed bond matters more than general mediocrity.",
            "The Codex also records a discrepancy that this lecture inherits. An explanatory proof function in the codebase, frictionProof, prints the friction as the largest single component of the difference and compares it with a track tolerance counted in phases. The Codex identifies the mismatch and states that the Euclidean definition remains the correct description of the computed coefficient; the current code does not render that function on any desk. The lecture follows the computed coefficient, and the reconciliation register records the discrepancy.",
          ],
        },
        {
          title: "The outside theory: power and symmetry in negotiation",
          paragraphs: [
            "The study of power in international negotiation has long asked how weaker parties negotiate with stronger ones and still obtain something. The comparative study edited by I. William Zartman and Jeffrey Z. Rubin, Power and Negotiation, published by the University of Michigan Press in 2000 under the Processes of International Negotiation programme, rejects the notions of power as a resource or an ability and defines it as an act designed to move another party in a desired direction, separating power from its sources and its effects.",
            "Its cases include clear asymmetries, among them the Canada-United States free trade negotiations, American aid negotiations with Egypt and Indonesia, the Andorra-European Community trade agreement and Nepal-India water relations, set beside two cases of near symmetry, the Mali-Burkina Faso armistice and the Korean War armistice. The editors conclude, against much received wisdom, that negotiations between unequal parties tend to be more efficient and effective than symmetrical ones: each side knows its role, whereas near-equals spend much of their time maintaining status and allow inordinate time to pass before agreement.",
          ],
          callout: {
            kind: "bridge",
            title: "How the code relates to the theory of power, and where it departs",
            paragraphs: [
              "The bench does not measure the asymmetry Zartman and Rubin study. It measures the distance between what parties will accept, which is a consequence of power, perception and interest together. Leverage and vulnerability carry power into that measure, but two parties of very unequal power that demand the same minimum on every bond read a coefficient of zero, and two equals with opposed priorities can read 0.71.",
              "The departure is therefore one of object, not of conclusion. The theory's finding that recognised inequality can make negotiation efficient is consistent with the bench: what makes a table hard is not unequal power but unequal demands on the bond where the settlement is weakest, which is why frictionCoefficient is read beside the veto holder and never alone.",
            ],
          },
        },
      ],
      statutoryRule:
        "Rule 4.3-B: Where one party's tolerance on the limiting bond far exceeds the live limiting score, that party is named veto holder, and the instrument must carry a neutral guarantee that does not depend on its goodwill.",
    },
    {
      heading: H.proofs,
      subheading: "The Maximum Distance, the Choice of Metric, Resonance Floors and the Coefficient",
      paragraphs: [
        "Each bond spans 1 to 5, so the widest possible gap on one bond is 4. The distance is the square root of the summed squared gaps, so the widest possible distance across four bonds is \\(\\sqrt{4 \\times 4^{2}} = \\sqrt{64} = 8\\), reached only when one vector reads 1.0 on every bond and the other 5.0. Dividing by 8 maps every distance onto the unit interval, so a coefficient of 0.25 means the same separation in any theatre.",
      ],
      formulas: [F_CASE_DISTANCE, F_RESONANCE, F_FRICTION],
      subsections: [
        {
          title: "Why the Euclidean metric, and not another",
          paragraphs: [
            "Euclidean distance is one member of a family. The NIST Dictionary of Algorithms and Data Structures defines the general \\(L_{m}\\) or Minkowski distance as the \\(m\\)-th root of the summed \\(m\\)-th powers of the coordinate gaps: the Euclidean distance is the case \\(m = 2\\), the Manhattan or rectilinear distance the case \\(m = 1\\), and the \\(L_{\\infty}\\) distance the largest single gap. The choice among them is a doctrinal choice about how gaps on different bonds should combine.",
            "Three pairs of vectors show the difference. A single gap of 4 on one bond reads 4 under all three metrics. Opposed gaps of 4 on two bonds, one party at 5 and 1 where the other is at 1 and 5, read 8 under the Manhattan metric, about 5.66 under the Euclidean and 4 under the largest-gap metric. Gaps of 1 on all four bonds read 4, 2 and 1. The Manhattan metric counts breadth and concentration alike; the largest-gap metric sees only the single worst bond and is blind to breadth; the Euclidean metric sits between them, weighting a concentrated gap more heavily than the same total spread thinly, while still registering disagreement on every bond.",
            "In four dimensions the three are bound together by the inequalities \\(L_{\\infty} \\le L_{2} \\le L_{1}\\) and \\(L_{2} \\le 2\\, L_{\\infty}\\), the factor 2 being the square root of the number of bonds. The Euclidean reading of a pair therefore never exceeds twice its worst single gap and never falls below it. That bound is why the coefficient can be read with some confidence without the gap table, and why the gap table is still needed to say which bond drives it.",
          ],
          callout: {
            kind: "bridge",
            title: "How the code expresses the metric choice",
            paragraphs: [
              "rankCases, distanceTable and frictionCoefficient all use \\(L_{2}\\), and MAX_DISTANCE is the \\(L_{2}\\) diagonal of the hypercube from 1 to 5 in four dimensions. The Codex's doctrine that one severed bond matters more than general mediocrity is the reason \\(L_{2}\\) was preferred to \\(L_{1}\\); the doctrine that breadth of disagreement still matters is the reason it was preferred to \\(L_{\\infty}\\). The unused frictionProof chip printed the \\(L_{\\infty}\\) reading, which is the discrepancy the Codex flags.",
            ],
          },
        },
        {
          title: "Resonance and its floors",
          paragraphs: [
            "Resonance rescales the case distance so that an identical profile reads 100 and the most distant possible profile reads 0. A live vector of 3.8, 1.9, 3.2 and 3.0 stands 1.221 from the Kenya profile, a resonance of 84.7, and that case is ranked nearest; Colombia follows at 1.300, a resonance of 83.8, and Rwanda third at 2.071, tied in distance with South Africa and with Tuvalu and Kiribati and ranked ahead of both by canonical order.",
            "The range of resonance against any particular case is narrower than 0 to 100, because every canonical profile lies inside the hypercube. The greatest distance from a live vector to a case is reached at the corner farthest from it, taking for each bond whichever of 1 and 5 is farther. For Cambodia, at 2 on every bond, the farthest corner is 5 on every bond, at a distance of \\(\\sqrt{4 \\times 9} = 6\\), so Cambodia's resonance can never fall below 25.0. For Northern Ireland, at 4, 3, 2 and 5, the floor is 22.9; for Kenya 30.4; and for each of the other five cases 36.3.",
            "The floors explain a misreading. Because no live vector can be wholly dissonant with any case, a resonance in the seventies can describe a poor match, and resonance should be read comparatively, case against case for the same live vector, rather than as an absolute score.",
          ],
        },
        {
          title: "The coefficient: reference values and rounding",
          paragraphs: [
            "Two default parties whose tolerance vectors differ by 1.0 on two bonds stand \\(\\sqrt{2}\\) apart, and their coefficient is \\(\\round_{2}(\\frac{\\sqrt{2}}{8}) = 0.18\\). If they differ by 1.0 on all four bonds the distance is 2 and the coefficient 0.25; a single gap of 4 on one bond gives a distance of 4 and a coefficient of 0.50; opposed gaps of 4 on two bonds give about 5.66 and 0.71; and one party at 5 on every bond against another at 1 gives the maximum of 8 and 1.00.",
            "A coefficient of one half can therefore describe a single, absolute disagreement or a broad, moderate one, and the operator reads the bond-by-bond gaps before choosing a remedy. A pair whose friction comes from one bond can be de-conflicted by one targeted guarantee on that bond; a pair whose friction is spread across all four needs a broader architecture.",
            "The rounding is half-up to two decimals, and it has a visible edge. A gap of exactly one point on a single bond gives \\(\\frac{1}{8} = 0.125\\), which the bench publishes as 0.13; a gap of half a point on two bonds gives about 0.088, published as 0.09. The coefficient is a reporting figure, and any argument that turns on its second decimal should be made from the underlying vectors.",
          ],
        },
        {
          title: "Bounds on inscribed parties",
          paragraphs: [
            "The tolerance rule for inscribed parties bounds the coefficient they can produce. Without a veto, every bond of an inscribed party sits at the same base, between 2.0 and 4.0, so two inscribed parties differ by the same amount on every bond and stand at most \\(\\sqrt{4 \\times 2^{2}} = 4\\) apart, a coefficient of at most 0.50. A party of leverage 4 and vulnerability 2 against one of leverage 2 and vulnerability 4 reads 4.5 against 2.5 on every bond, and their coefficient is exactly 0.50; a single point of difference on each side gives 0.25.",
            "A veto adds one point on the limiting bond. The most extreme pair the rule can produce, a party of leverage 5 and vulnerability 1 holding a veto against a party of leverage 1 and vulnerability 5 holding none, reads 4, 5, 4 and 4 against 2, 2, 2 and 2 when the Communal bond is limiting, a distance of \\(\\sqrt{21} = 4.58\\) and a coefficient of 0.57. If the weaker party also holds a veto, its vector becomes 2, 3, 2 and 2 and the coefficient returns to 0.50. Inscribed parties alone can never produce the extreme coefficients that the default rule and hand-set tolerances can; a reading above 0.57 always involves a stated tolerance, never power alone.",
          ],
        },
        {
          title: "Sensitivity and the fragility of near ties",
          paragraphs: [
            "The distance to a case changes with each bond at the rate \\(\\frac{B_{i} - C_{k,i}}{d}\\), the bond's signed gap divided by the whole distance. The bond whose gap is the largest share of the distance moves the reading most. For the live vector 3.8, 1.9, 3.2 and 3.0 against Kenya, the gaps are \\(-0.2\\), \\(-0.1\\), 1.2 and 0 at a distance of 1.221, so the Intergenerational bond carries a rate of 0.983 and almost every tenth of a point on it moves the distance by nearly a tenth, while the Institutional-Relational bond, exactly at Kenya's score, does not move it at first order at all.",
            "The triangle inequality gives a second, more practical result. If the live vector moves by a step of length \\(\\delta\\), its distance to every case changes by at most \\(\\delta\\). Two cases whose distances differ by \\(g\\) can therefore exchange places only if the live vector moves by at least \\(\\frac{g}{2}\\). For this live vector Kenya stands at 1.221 and Colombia at 1.300, a margin of 0.079, so a movement of about 0.04 could in principle reverse them.",
            "The engine confirms how fragile the ranking is. Raise the Intergenerational bond from 3.2 to 3.3 and the two distances become equal at 1.319; the tie goes to the earlier case in canonical order, and Colombia, second in the table, displaces Kenya, sixth, as the nearest case. Raising the Institutional-Relational bond from 3.0 to 3.1 instead produces the same tie at 1.225 and the same change. A nearest case whose margin over the second is smaller than the uncertainty in the scoring is not a finding, and the operator should report both cases with their distances.",
          ],
        },
        {
          title: "A full worked example with the engine's functions",
          paragraphs: [
            "Take the Drill Beta vector of Module V, 3.4, 3.2, 3.1 and 2.4. distanceTable places it 0.985 from Liberia, a resonance of 87.7, ranked first; Rwanda and South Africa follow tied at 1.253 and 84.3, Rwanda second by canonical order and South Africa third. mathReading names the Institutional-Relational bond, at 2.4, as the limiting bond.",
            "Seat two default delegations, one carrying the Institutional-Relational bond and one the Communal bond. Their tolerance vectors are 3, 3, 3 and 4 and 3, 4, 3 and 3; frictionCoefficient returns 0.18. The veto test compares each party's tolerance on the limiting bond with the live 2.4: the first demands 4.0, a gap of 1.6; the second demands 3.0, a gap of 0.6. The first is named veto holder. The bench's reading is therefore modest friction between the parties but a clear holdout on the limiting bond, and the remedy is a neutral guarantee on the Institutional-Relational bond, not a general effort to bring the parties closer together.",
          ],
        },
      ],
      statutoryRule:
        "Rule 4.3-C: A nearest case is a mirror, not a template. Historical resemblance is context, never a predicted outcome or a prescription.",
    },
    {
      heading: H.protocols,
      subheading: "Seating, Friction Pairs, the Veto Holder and the Comparative Mirror",
      paragraphs: [
        "On Desk 07 the operator seats delegations from the available roster or inscribes parties of their own. The bench reads the coefficient of every pair, publishes the largest as the party friction reading and names the veto holder. On Desk 01 the three nearest cases flow into the Comparative Mirror (Desk 04) and the Briefing Desk (Desk 05), where they supply comparative annexes. This section sets out the protocol for each reading and its hand-offs.",
      ],
      subsections: [
        {
          title: "Reading the matrix",
          paragraphs: [
            "The operator reads the matrix in three passes. The first finds the widest pair, the reading the bench publishes. The second reads that pair's gap table bond by bond, to decide whether its friction is concentrated on one bond or spread across several. The third reads the veto holder against the live limiting bond, because a pair can be close on average and still contain a party that can block the settlement where it is weakest.",
            "The coefficient's operational use is sequencing. The pair with the largest coefficient is seated in separate opening sessions, with a mediator, and the bond with the widest gap is the first on which a neutral guarantee or a holdback is drafted. Where the veto holder's gap is large, its concession is sequenced first, as the bench's own note directs: open with the party that can block, on the bond where it can block.",
          ],
        },
        {
          title: "Hand-offs between desks",
          paragraphs: [
            "The veto holder's demand on the limiting bond is a target for every desk that can raise that bond. Communal repair raises the Communal bond; office-continuity provisions drafted on the Clause Architect, Desk 10, raise the Institutional-Relational bond's durability; the escrow's tranche conditions on the De-confliction Bench reward the same repair. Lifting the limiting bond above the veto holder's tolerance dissolves the veto without any concession on the other three bonds.",
            "The friction pairs hand off in another direction: into the relational dynamics, where each active pair multiplies the contagion coefficient by \\(1 + 0.10\\, n_{f}\\), and into the spoiler warning, which reads the Rupture Index from Desk 02. A table with two friction pairs reads no spoiler warning at a Rupture Index of 34 and reads one at 35, so the Sentinel Matrix of Chapter 4.1 also governs how the bench seats its parties.",
            "On the diagnostic side, the three nearest cases enter the Comparative Mirror and the Briefing Desk with their distances stated. The protocol for using them is the Codex's: a resonance is a statement of structural likeness, not of outcome. The operator reads the nearest case as a list of the mechanisms that broke or held it and checks each against the present design.",
          ],
        },
        {
          title: "A worked sequencing protocol",
          paragraphs: [
            "Take the Drill Beta table of Section III: two default delegations, a coefficient of 0.18 between them, the Institutional-Relational bond limiting at 2.4 and the delegation carrying that bond named veto holder with a gap of 1.6. The protocol runs in four steps. First, the veto holder is seated first and alone, because it can block on the limiting bond and the other party cannot. Second, the operator carries its demand to the drafting desks as a requirement: a neutral guarantee on the Institutional-Relational bond, an office-continuity provision, and a forum whose enforcement does not rest on that party's consent.",
            "Third, the joint session opens only once the guarantee is drafted, so that the veto holder's demand is met on its bond by structure rather than traded against concessions elsewhere. Fourth, the bench is re-read after each repair. If communal and institutional work lifts the limiting bond to 3.4, the veto holder's gap falls to 0.6 and the other party's gap to zero; a further lift to 4.0 removes the veto entirely, and the coefficient between the parties, still 0.18, was never the obstacle.",
          ],
        },
        {
          title: "Reporting asymmetry in a dispatch",
          paragraphs: [
            "Any dispatch that cites asymmetry carries three readings together: the widest coefficient at the table with the pair that produces it, the bond that carries the widest gap in that pair, and the veto holder with its gap on the live limiting bond, or a statement that none stands. A dispatch that cites the nearest case carries its distance and the distance of the second case, so that a reader can see whether the ranking is a finding or a near tie.",
            "Two things never appear in such a dispatch: a coordinate for any party that did not state its tolerances, and a statement that the coefficient is above or below a threshold. The first is invented data; the second attributes to the engine a rule it does not contain. The bench's own wording is the model: a party holds holdout leverage on the limiting bond, it demands a stated figure against a stated live score, and its concession is sequenced first.",
          ],
        },
        {
          title: "Comparison with practice: neutral ladders and the choice of rung",
          paragraphs: [
            "The Indus record supplies the most practical lesson for this desk. A graded ladder of neutral decision-makers is one architecture for managing technical and legal differences. The Permanent Indus Commission, a Neutral Expert and a Court of Arbitration each have distinct treaty roles; the World Bank reports earlier decisions by a Neutral Expert in 2007 and a Court in 2013. Its 2016 account also shows the cost of leaving competing requests unresolved: when the parties selected different procedures for the same plant-design questions, the Bank lacked authority to choose between them, paused, and resumed appointments after five years of efforts to reach agreement.",
            "The World Bank explains that the Treaty gives each of the two mechanisms authority to determine its own jurisdiction and competence, while the Bank itself has no power to choose which requested process takes precedence. A drafting team can learn from the distinction: state both the decision-maker for competing procedural requests and whether each forum determines its own competence. The Indus record shows why these are separate clauses, not a single generic promise of neutral review.",
            "Peace research offers a further, quantitative reason to prefer explicit guarantees. In Virginia Page Fortna's study of ceasefires in interstate wars between 1946 and 1997, ceasefires reached with outside mediation did not last longer, but explicit guarantees by a third party, though not frequent, were much more successful: she found no case in which peace failed after an outside state had explicitly underwritten the ceasefire. The finding concerns interstate wars, not every asymmetric settlement, and the lecture draws only the narrow inference the bench already makes: a guarantee that a third party has committed to is worth more than good offices.",
          ],
          callout: {
            kind: "bridge",
            title: "How the desk applies the lesson",
            paragraphs: [
              "The bench names the bond and the party; the drafting desks write the guarantee. When the veto holder is named, the operator carries to the Clause Architect a requirement for a neutral mechanism on the limiting bond with a defined entry rule and self-determined competence, and to the Forum Matrix, Desk 11, the choice of a venue whose enforcement route does not depend on the veto holder's consent. frictionCoefficient measures the need; the clause meets it.",
            ],
          },
        },
      ],
    },
    {
      heading: H.failure,
      subheading: "Three Case Files, Six Misreadings and the Limiting Bond",
      paragraphs: [
        "Asymmetry architecture fails in two ways: in the field, when a structure meets a strain it was not designed for, and at the desk, when an operator reads a correct distance wrongly. This section takes three case files from the open record and six recurrent misreadings, and closes with the reason the veto is defined on the limiting bond.",
      ],
      subsections: [
        {
          title: "Case file one: two parties, two rungs (Indus, 2016 to 2022)",
          paragraphs: [
            "Warning signs. A disagreement over the design of two hydro-electric plants that the Permanent Indus Commission had discussed for some time without resolution; a downstream party framing it as a legal dispute for a Court of Arbitration; an upstream party framing the same questions as technical differences for a Neutral Expert; and an appointing authority with no power to choose between them.",
            "The mechanism. The ladder's rungs were well designed, but its entry rule was not. Each party chose the rung it expected to favour it, and the neutral institution, unable to choose, paused. In the bench's terms the friction between the parties was concentrated on one bond, the Institutional-Relational bond of the treaty's own institutions, and the guarantee meant to sit on that bond could not engage.",
            "The countermeasure is a defined entry rule: a provision stating which body hears a disagreement that the parties have characterised differently, or that the bodies may proceed in parallel with a rule for coordinating their findings, together with the principle, later applied by the Court, that each body decides its own competence.",
          ],
        },
        {
          title: "Case file two: a scheduled transfer across political rupture (Panama, 1981 to 1999)",
          paragraphs: [
            "Warning signs. The death of Panamanian leader Omar Torrijos in 1981 was followed by contentious relations between the United States and Panama; in December 1989 the United States invaded Panama and removed Manuel Noriega from power.",
            "The mechanism. The 1977 treaties had already set 31 December 1999 as the date for transfer of the Canal. The State Department's historical account records that the transfer took place on that date and that Panama has administered the Canal since. This is evidence that a calendared treaty obligation outlasted the leader associated with its negotiation and a later period of severe political rupture; it is not evidence that the treaty prevented conflict or made the path to transfer peaceful.",
            "The countermeasure is a schedule that binds the parties to a public date, paired with a separate account of the stronger party's continuing interests in canal use and neutrality. The limitation is equally important: a fixed date can structure transfer, but the Panama record does not prove that a calendar alone will secure compliance in every dispute. The operator should distinguish an obligation's continuity from the political conditions surrounding its implementation.",
          ],
        },
        {
          title: "Case file three: the draft that did not survive a coup (Panama, 1967 to 1968)",
          paragraphs: [
            "Warning signs. Three draft treaties agreed in 1967 with a government whose president then lost an election, and a successor deposed by a coup eleven days into his term.",
            "The mechanism. The asymmetry between the parties was answered on paper, but the paper had not become an instrument, and the counterpart that had agreed it ceased to exist. In the bench's terms, the friction between the parties was not the problem; the Interpersonal bond carrying the agreement was held by a single government, and the agreement was not yet in a form any successor was bound to read.",
            "The countermeasure is the one the 1977 treaties eventually supplied: obligations written to bind offices and states rather than governments, with a dated calendar that a successor government on either side inherits. The decision of the 1977 negotiators to separate the interest the stronger party most needed protected, the Canal's use and neutrality, into its own treaty is the same move the bench recommends when it names a veto holder: satisfy the holdout's core demand on its bond, by a separate guarantee, so that it does not block everything else.",
          ],
        },
        {
          title: "Six misreadings at the desk",
          paragraphs: [
            "The fiction of formal equality. International law treats states as sovereign equals, and a negotiation conducted on that premise alone ignores the distance between the parties' tolerances. The countermeasure is to read the coefficient and design for it.",
            "Invented coordinates. An analyst scores parties on axes of military or informational power that no desk records, or places a historical party at a point in the four-bond space to complete an argument. The countermeasure is the platform's rule: asymmetry is measured on actual inputs in the four-bond space, with power carried through leverage and vulnerability, and precedents are read qualitatively.",
            "Resemblance as forecast. A high resonance with a documented failure is read as a prediction of failure. The countermeasure is to use the case as a list of the mechanisms that broke it, and to check each against the present design.",
            "The averaged gap. An analyst reports that two parties are close because the means of their tolerance vectors are the same. Two vectors of 5, 1, 3 and 3 and of 1, 5, 3 and 3 have the same mean and stand about 5.66 apart, a coefficient of 0.71. Asymmetry lives in the components, not the average, and the countermeasure is the bond-by-bond gap table.",
            "Colour read as threshold. The matrix's tints at 0.12 and 0.25 are read as breach levels. The engine attaches no threshold to the coefficient; the tints locate the widest pairs and nothing more. The countermeasure is to cite the coefficient, the widest bond and the veto holder together.",
            "The coefficient without the veto. A table whose widest pair reads 0.18 is reported as low friction while one party holds out two points above the live limiting score. The countermeasure is to read the veto holder in every report, because the coefficient measures the parties against each other and the veto measures a party against the settlement.",
          ],
        },
        {
          title: "Asymmetry over time: decay widens the veto",
          paragraphs: [
            "The coefficient between two parties is a reading of their stated demands, and it does not change while the demands stand still. The veto gap is different, because one of its two terms is the live limiting score, and that score decays under the law of Chapter 4.2. A table can therefore grow more blocked without any party changing its position.",
            "Take the Drill Beta vector with the Institutional-Relational bond at 2.4 and the veto holder demanding 4.0, a gap of 1.6. Read on the Succession Simulator with an uninsulated exposure of 26 and a Rupture Index of 38, the decay constant is 0.032 per day: in thirty days the limiting bond is projected at the 1.0 floor, which it reaches after about 27.4 days, and the veto gap has widened to 3.0. With the applied shocks insulated, the constant falls to 0.02225, the bond is projected at 1.23 after thirty days and reaches the floor only after about 39.3 days, and the gap stands at about 2.8.",
            "The countermeasure follows from combining the two chapters. Time spent at the table while the limiting bond decays is time in which the veto holder's position strengthens, even if the holder concedes nothing. The operator therefore treats the veto holder's guarantee as urgent in proportion to the half-life, and reads the bench and the Decay Horizon together before agreeing to any adjournment.",
          ],
        },
        {
          title: "The Liebig bottleneck: why the veto lives on the limiting bond",
          paragraphs: [
            "The veto holder is defined on the limiting bond because that is where the settlement is weakest and where a party with a high tolerance can block it. A party demanding 4.0 on a bond that already reads 3.8 has little leverage; the same demand on a bond reading 2.4 can hold the whole settlement, because no settlement survives with its weakest bond below what a necessary party will accept.",
            "The law of the minimum therefore turns asymmetry into a design problem with a precise target. Lifting the limiting bond above the veto holder's tolerance dissolves the veto without any concession on the other three bonds, and the coefficient between the parties may not change at all. Concessions spread across the bonds may narrow the coefficient while leaving the veto in place. The operator who wants agreement works the limiting bond first.",
          ],
        },
      ],
      statutoryRule:
        "Rule 4.3-D: Every asymmetry reading is computed from the tolerance vectors the parties actually stated. A coordinate supplied by the analyst to complete a proof is a breach of the record, not an estimate.",
    },
    {
      heading: H.instrument,
      subheading: "Two Parties in the Four-Bond Space",
      paragraphs: [
        "The cutaway places two tolerance vectors side by side, computes their coefficient with the De-confliction Bench's own frictionCoefficient, draws the gap on each bond with the widest marked, and states a verdict in words. Each control has a numeric field and step buttons; the arrow keys move a tolerance by a tenth and Shift with an arrow by half a point, and every value is clamped to the 1 to 5 scale. Nothing reaches the mission.",
      ],
      subsections: [
        {
          title: "Walkthrough: the four presets",
          paragraphs: [
            "Select One-axis gap: party A at 5, 3, 3 and 3 and party B at 1, 3, 3 and 3. The coefficient reads 0.50, and the gap bars show a single bar of 4 on the Interpersonal bond, marked as the widest. The verdict names that bond as the place where a neutral guarantee is needed first.",
            "Select Crossed priorities: A at 5, 1, 3 and 3 and B at 1, 5, 3 and 3. Both parties have the same mean, 3.0, and the coefficient reads 0.71, wider than either single gap alone. Two bars of 4 appear, and the verdict names the first of them. Select Maximum separation and the coefficient reaches its ceiling of 1.00; select Parity, both parties at the Drill Beta vector, and it reads 0.00 with the parity verdict.",
          ],
        },
        {
          title: "Reading the instrument precisely",
          paragraphs: [
            "Beneath the bars the working panel substitutes the live squared gaps into \\(\\frac{\\sqrt{\\sum (a_{i} - b_{i})^{2}}}{8}\\) and ends in the coefficient the bench would publish. When you leave a preset a ghost reading remains and the change in the coefficient is shown beside it, so that every counterfactual is read as a difference from a stated baseline. Copy settings records both parties' vectors locally, with nothing sent anywhere.",
            "The verdict uses its strongest tone from 0.50 upward. That is a teaching choice of this cutaway, made so that the single absolute gap and the maximum separation stand out; neither the engine nor the bench attaches a threshold to the coefficient, and Section V lists reading a colour as a threshold among the misreadings to avoid.",
          ],
        },
        {
          title: "Counterfactual one: concentration against breadth",
          paragraphs: [
            "Set party B to 1 on every bond and party A to 2 on every bond: a gap of one point on each of the four bonds, four points in all. The coefficient reads 0.25. Now set A to 5, 1, 1 and 1: the same four points, concentrated on one bond. The coefficient reads 0.50. The comparison is the non-linear doctrine of the Codex made visible: the same total disagreement weighs twice as much when it sits on one bond.",
            "Now set A to 3 on every bond: two points on each bond, eight in all. The coefficient reads 0.50 again, with four equal bars. Two very different tables read the same coefficient, and only the bars tell them apart. That is the reason Section III insists on the gap table before a remedy is chosen.",
          ],
        },
        {
          title: "Counterfactual two: swap and symmetry",
          paragraphs: [
            "Press Swap parties on any setting. The coefficient does not change, because the distance is symmetric; the gap bars do not change either, because each bar is an absolute difference. What changes is only which party stands where. The instrument thereby demonstrates the property the Codex lists among the metric axioms, and also a limit of the reading: the coefficient cannot say which party is demanding more. The veto test on the desk, which compares each party with the live limiting score, is what supplies direction.",
          ],
        },
        {
          title: "Counterfactual: power alone has a ceiling",
          paragraphs: [
            "Set party A to 4 on every bond and party B to 2 on every bond: the tolerance vectors the bench derives for an inscribed party of leverage 5 and vulnerability 1 and one of leverage 1 and vulnerability 5, neither holding a veto. The coefficient reads 0.50, the most that power alone can produce between inscribed parties. Now raise A's second bond to 5, the effect of a veto when the Communal bond is limiting: the coefficient reads 0.57, the most the tolerance rule can produce at all. Anything wider on the bench comes from tolerances someone has stated, and the operator should ask who stated them and on what evidence.",
          ],
        },
        {
          title: "Counterfactual three: the veto and the escrow",
          paragraphs: [
            "Set party A to 3, 3, 3 and 4 and party B to 3, 4, 3 and 3, the two default delegations of the Section III worked example. The coefficient reads 0.18. Recall that on the Drill Beta vector the Institutional-Relational bond reads 2.4, so party A holds a veto with a gap of 1.6. Trace the consequences across the module: on the escrow of Chapter 4.5, Operational Commissioning cannot be met while that bond is at 2.4, so the veto holder's bond also holds every later tranche; on the Dominum Index of Chapter 4.4, every tenth of a point by which the bond is lifted raises the mean by 0.025 and the index by about 0.19 points. The cutaway shows the friction; the other instruments show what lifting the limiting bond buys.",
          ],
        },
        {
          title: "Metric structure and the geometry of the four-bond space",
          paragraphs: [
            "The four-bond space is a Cartesian product of four bounded intervals. A point in that space is a vector of four bond readings, and the distance between two points is formed from their coordinate differences. Euclidean distance squares each coordinate gap, sums those squared gaps, and takes the square root. The operation has the familiar metric properties of non-negativity, identity, symmetry, and the triangle inequality, provided the compared vectors inhabit the same four-dimensional space.",
            "The upper bound follows from the domain. On each coordinate, the largest possible absolute gap between two values on the 1-to-5 scale is four. The greatest Euclidean distance therefore occurs when all four coordinates are at opposite endpoints; the squared coordinate gaps sum to four times sixteen, and the root is eight. Dividing by that maximum places the result on a common zero-to-one scale before rounding.",
            "This normalization makes the magnitude interpretable relative to the space's possible extent. A coefficient of zero means that the two recorded vectors coincide. A coefficient of one is the maximum separation allowed by the four dimensions and their bounded ranges. Intermediate values express a fraction of that maximum distance, not a percentage probability of conflict, a probability of compliance, or a legal threshold.",
            "Normalization is only meaningful when the underlying scales and dimensions are the same. Adding a fifth coordinate, changing the bond range, or comparing a different set of constructs would change the maximum distance and make the present denominator inappropriate. This is why the engine's constant is tied to four coordinates on the 1-to-5 scale; it is not a generic divisor that can be reused in any negotiation model.",
            "The geometry also explains why Euclidean distance responds to concentration. A fixed total gap distributed evenly across coordinates can yield a different distance from the same amount concentrated in one coordinate because the gaps are squared before summation. The formula therefore gives greater influence to a large coordinate discrepancy than a simple sum of absolute differences would.",
            "The chosen metric is a design decision, not a theorem that political disagreement is Euclidean. It offers symmetry, a clear upper bound, and familiar geometric properties. A different metric could produce different rankings or coefficients. The lecture's responsibility is to explain the consequences of this choice faithfully and to avoid replacing it with another metric in a hand calculation."
          ],
        },
        {
          title: "Distance, resonance, and the limits of historical similarity",
          paragraphs: [
            "Desk 01 uses the same four-bond geometry to compare a live vector with documented case vectors. The nearest cases are selected by distance, and resonance is a linear transformation of that distance into a bounded score. This is a retrieval and comparison aid: it gives the reader a structured way to identify records whose four-coordinate profiles are close in the defined space.",
            "A high resonance does not mean that two conflicts share the same causes, actors, legal status, or likely outcome. It means only that the recorded vectors are close under the four specified coordinates and the stated metric. Case selection, the quality of the source records, and the construction of the vectors shape the result. Those features should be disclosed when a historical comparison is used in a policy argument.",
            "The ranking should lead to mechanism questions rather than prediction. What institutions failed or endured in the nearby cases? Which commitments were independently verified? Did a successor inherit obligations? Were affected communities able to use the dispute process? These questions are more informative than treating a nearest match as a template for action.",
            "Ties in distance require a deterministic ordering so that repeated calculations do not reorder equivalent cases unpredictably. The engine retains canonical order for distances within its specified floating-point tolerance. This is a reproducibility rule, not a substantive claim that the earlier-listed case is historically more important.",
            "Resonance is also sensitive to the recorded coordinates and to the chosen dimensions. If a case vector was scored from incomplete sources, its nearest-neighbour status may reflect missing information as much as substantive similarity. The analyst should consult the case's underlying documentation, and should not infer that the ranking validates the vector's historical accuracy.",
            "A sound written comparison names the metric, the four dimensions, the date of the live reading, and the cases ranked nearest. It then treats each precedent as a source of questions to investigate. The number can direct attention; it cannot establish causation or provide a forecast."
          ],
        },
        {
          title: "Tolerance is not the same construct as power",
          paragraphs: [
            "The De-confliction Bench compares tolerance vectors, not national power indices. Tolerance describes the stated or derived position a party can accept across the four bonds. Leverage and vulnerability influence the tolerance assigned to an inscribed party under the platform's rule, and a veto modifies the relevant bond, but these terms do not amount to a comprehensive measure of military, economic, demographic, or diplomatic power.",
            "The distinction matters because a larger tolerance value does not necessarily mean a party is stronger in every sense. It represents the party's position in the defined model. A party may have substantial military resources but limited political room to accept a particular clause; another may be materially weaker yet hold a legal veto or control a necessary local institution. The vector records the tolerance construct, while other forms of power remain outside this particular metric.",
            "The coefficient is symmetric: swapping the two parties leaves their Euclidean distance unchanged. It can therefore describe the scale of their separation but cannot identify which party's position is more demanding. The veto-holder assessment supplies a separate directional reading by comparing a party's tolerance on the limiting bond with the live score. These two readings answer different questions and should be reported together when a veto is material.",
            "The maximum-pair rule adds another distinction. The published party-friction reading is the largest pairwise coefficient among the seated parties. That summary identifies the most separated pair, but does not describe every relationship in a multi-party table. The analyst should inspect the pairwise matrix before drawing conclusions about coalition structure or which parties can broker agreement.",
            "Because the function rounds the coefficient to two decimals, close pairs can appear equal in the published display even when their unrounded distances differ. The canonical ranking and full instrument details should be consulted when the ordering matters. Analysts should not infer that a displayed tie proves exact identity of positions.",
            "Power analysis remains a substantive task. A negotiation brief may separately examine control of resources, ability to delay, external sponsorship, internal legitimacy, and exposure to costs. Those observations should be supported by sources and should not be smuggled into the Euclidean coefficient by assigning invented coordinates."
          ],
        },
        {
          title: "The interval-scale assumption behind distance calculations",
          paragraphs: [
            "A distance calculation treats coordinate differences as meaningful quantities. If the four-bond ratings are ordinal categories only, the arithmetic requires an additional interpretive assumption: the step from one category to the next is treated as comparable across the scale. The platform supplies a 1-to-5 numerical domain and computes Euclidean distance on those values. The lecture should explain that operational convention rather than presenting it as an empirical discovery about the spacing between all political conditions.",
            "For example, the calculation treats a change from 1 to 2 as the same numerical distance as a change from 4 to 5. That property follows from the numeric coding. It does not prove that the underlying social difference is substantively identical at every point. A reader who wants to question the scale can do so as a model-design critique, but must not silently change the scores in the official calculation.",
            "The four coordinates also receive equal geometric treatment in the distance formula: each squared difference enters the sum in the same way. This differs from a model with explicit coordinate weights. The symmetry can be valuable because it avoids privileging one bond in the distance calculation, but it does not mean that each bond has equal political importance in every case.",
            "Normalization by the maximum possible distance addresses range, not measurement validity. It ensures that the coefficient can be interpreted relative to the theoretical span of the defined space. It cannot repair inconsistent rating practices, weak evidence, or differences in how analysts interpret a bond across theatres.",
            "A measurement protocol should therefore document how each bond score or tolerance position was assigned, what evidence supports it, who reviewed it, and how disagreement was handled. Consistency over time matters if two readings are to be compared. A change in rating practice can create an apparent movement in distance without any corresponding change in the parties' position.",
            "This is a common challenge in social measurement: arithmetic can be reproducible while the construct remains contestable. Postgraduate analysis should be able to do both things at once—reproduce the engine's number exactly and evaluate the assumptions under which that number is meaningful."
          ],
        },
        {
          title: "Worked geometry from the existing instrument presets",
          paragraphs: [
            "The One-axis gap preset sets party A to 5, 3, 3, and 3 and party B to 1, 3, 3, and 3. Three coordinate differences are zero and one is four. The Euclidean distance is therefore the maximum single-coordinate gap, four, and normalising by eight yields a coefficient of 0.50. This case is useful because the geometry is visible without a calculator.",
            "The Crossed priorities preset changes the first two coordinates in opposite directions: one party is more tolerant on one bond and less tolerant on another. Each of those gaps is four, so the distance is the square root of the sum of two squared gaps, about 5.66, and the normalised coefficient is approximately 0.71 after the bench's two-decimal rounding. The parties can have the same mean tolerance and still have substantial distance.",
            "In the Maximum separation preset, each of the four coordinates is at opposite ends of the permitted range. Every difference is four, which reaches the upper bound of eight; the coefficient is one. In Parity, the vectors coincide, distance is zero, and so is the coefficient. These two endpoints verify the normalization and give the reader anchors for interpreting intermediate settings.",
            "A less extreme comparison uses the Chapter 4.3 default delegations: 3, 3, 3, and 4 versus 3, 4, 3, and 3. There are two differences of one and two of zero. The unrounded Euclidean distance is the square root of two, and division by eight gives about 0.1768, which the instrument publishes as 0.18.",
            "These calculations demonstrate the distance function, not the bargaining outcome. The 0.71 reading does not mean that negotiations are 71 per cent difficult, and a 0.18 reading does not imply that agreement is likely. They describe geometric separation between inputs. The operator must still determine whether the differences concern a decisive bond, a tolerable trade-off, or a subject on which no party has authority to compromise.",
            "When a worked number is carried into a report, include the vectors or a concise representation of their gaps. The coefficient by itself hides whether the distance comes from one large discrepancy or several smaller ones. The bar display on the cutaway is pedagogically useful because it keeps the coordinate-level structure visible alongside the summary."
          ],
        },
        {
          title: "Multi-party tables and the information lost in the maximum pair",
          paragraphs: [
            "In a negotiation with more than two parties, the complete input is a set of vectors and the natural intermediate result is a pairwise distance matrix. The published maximum friction coefficient selects the largest of those pairwise values. That is a useful alert to the most separated pair, but it discards the rest of the matrix and therefore cannot describe the whole coalition structure.",
            "Two tables can have the same maximum coefficient and differ in every other relationship. In one, a single outlier may be distant from a cluster of parties who otherwise agree closely. In another, several pairs may all be far apart. The maximum alone does not distinguish these patterns, so the analyst should inspect the pairwise details before designing a mediation sequence.",
            "A maximum is also sensitive to adding a party. When a new participant is seated, the number of possible pairs increases and the maximum can stay the same or rise, even if no existing party changes its tolerance vector. A change in the published maximum may therefore reflect the composition of the table rather than a deterioration in any pair's relationship.",
            "This is not a flaw in the defined summary; it is a consequence of using an extreme statistic. The maximum is designed to highlight the widest gap. It should not be interpreted as a central tendency, average level of disagreement, or measure of overall negotiation climate.",
            "The same care applies to missing parties. If an affected group or necessary guarantor is not represented in the vectors, the pairwise matrix is incomplete relative to the actual political process. The software can only compare seated inputs. It cannot infer the preferences of an absent actor or certify that the table includes everyone with a legitimate claim.",
            "A robust multi-party brief reports the maximum pair, identifies its members, and names the bond on which the separate veto assessment is concentrated. It then notes whether other pairs show a different pattern and whether any relevant actor is absent from the model. This preserves the signal while acknowledging its scope."
          ],
        },
        {
          title: "From a geometric gap to a negotiable institutional remedy",
          paragraphs: [
            "A distance is diagnostic only at the level of the inputs. It tells the operator that two tolerance vectors are separated; it does not tell the operator how to close the gap. A remedy requires an account of the underlying issue, the parties' authority, and the institution that can provide a credible guarantee.",
            "The platform's veto-holder reading helps direct attention to the limiting bond. If one party's tolerance on that bond exceeds the live score, the required remedy may be a guarantee, a staged condition, or an external verification process that makes the contested obligation safer to accept. This is a general negotiation-design principle, not a promise that any one device will resolve the dispute.",
            "The Indus treaty illustrates how a procedural ladder can move technical questions and legal disputes into different forums. Its history also shows the cost of ambiguity when parties invoke different rungs and the appointing institution lacks authority to choose between them. The comparison suggests that a well-drafted ladder should specify not only the forums but how jurisdictional disagreement is resolved.",
            "The Panama Canal treaties illustrate a different response: a dated transfer of custody and separate instruments for use and neutrality. The historical account can prompt questions about successor governments, domestic ratification, and long-term guarantees. It does not establish that a transfer date is always sufficient or that the power asymmetry was eliminated.",
            "A negotiator should test whether the proposed remedy changes the parties' underlying tolerance, reduces the risk attached to accepting a position, or simply changes the procedure for disagreement. These are distinct mechanisms. A tribunal may improve the credibility of interpretation without changing the parties' substantive demands; a guarantee may reduce vulnerability without narrowing the raw distance.",
            "The operator can then trace consequences through the other module instruments. If a limiting bond blocks an escrow tranche, the financial schedule may need to hold value until the bond changes. If the same bond controls viability in the Dominum phase, improving it may affect the phase condition as well as the distance. These are downstream implications of existing signals and rules, not new thresholds in the asymmetry calculation."
          ],
        },
        {
          title: "A source discipline for historical asymmetry",
          paragraphs: [
            "The Indus Waters Treaty is a primary legal text, and the Permanent Indus Commission, Neutral Expert, Court of Arbitration, and World Bank each have distinct roles under its provisions. A discussion of the treaty should not collapse those roles into a generic 'neutral monitor.' The source record supports a careful account of the dispute ladder and its institutional limits.",
            "The Panama Canal Treaties are likewise primary instruments, while the U.S. Department of State's historical materials supply context about negotiation and ratification. Scholarship on the canal can add perspectives on nationalism, sovereignty, and U.S. policy. The lecture should distinguish the treaty dates and legal obligations from later scholarly interpretations of their political significance.",
            "The cases are used qualitatively because the historical record does not provide the platform's four-bond tolerance vectors for each party. Assigning scores would create unsupported precision. This is more than a stylistic caution: invented coordinates could make a historical narrative appear to validate a metric that was not used and whose inputs were never measured at the time.",
            "The same rule applies to contemporary developments. A legal ruling may clarify a tribunal's jurisdiction or the status of an instrument, while compliance with that ruling remains a separate factual question. A lecture must not convert a tribunal's statement of law into a claim that the parties have complied or that a conflict has been resolved.",
            "Students should use primary documents to establish the instrument's terms and official records to establish procedural events, then consult scholarly analysis for context and competing interpretations. Where sources conflict, identify the disagreement and its scope rather than smoothing it into a single confident chronology.",
            "A methodologically sound historical comparison asks what architecture answered a particular asymmetry, what the architecture could do, what it could not do, and how the design depends on legal and political conditions. It does not ask which historical party would have had the highest coefficient if an analyst could assign numbers after the fact."
          ],
        },
        {
          title: "The coefficient does not identify bargaining power or settlement space",
          paragraphs: [
            "The coefficient measures separation between tolerance vectors, not the distribution of bargaining power. In negotiation theory, power may arise from alternatives to agreement, control over resources, the capacity to impose costs, domestic coalition constraints, or the ability to delay. None of those dimensions is fully represented by a four-coordinate distance.",
            "A large geometric gap can coexist with a broad zone of possible agreement if the parties have flexibility not represented in their stated vectors. A small gap can coexist with a deadlock if one issue is legally non-negotiable or if a domestic veto prevents the representative from accepting a compromise. The coefficient therefore cannot tell the analyst whether the bargaining range is empty.",
            "The tolerance vector is an input to a structured assessment, not a direct observation of private preferences. Parties may strategically understate or overstate what they can accept, and an inscribed party's vector follows the platform's stated derivation from recorded leverage and vulnerability. The operator should distinguish an explicitly stated tolerance from one generated by the model's rule.",
            "This distinction is especially important when the party's authority is fragmented. A negotiator may indicate willingness to accept a clause but lack approval from a legislature, armed command, coalition partner, or affected constituency. A vector attributed to the negotiating principal does not automatically describe every institution that can block implementation.",
            "The practical question is therefore not merely how far apart the vectors are, but why. Is a position driven by security concerns, a distributional demand, a constitutional constraint, or a distrust of the proposed verifier? Each cause suggests a different response. A guarantee may address vulnerability; a redesigned forum may address procedural mistrust; neither necessarily changes the underlying allocation.",
            "The coefficient can structure the diagnostic conversation, but the parties' actual alternatives, authority, and constraints must be established through negotiation and evidence. Do not describe the metric as a measure of willingness, power, or probability of settlement."
          ],
        },
        {
          title: "Testing a proposed metric interpretation",
          paragraphs: [
            "A useful way to test an interpretation is to ask what would change if the same total disagreement were rearranged across dimensions. The One-axis gap and evenly distributed gap examples have equal sums of absolute differences but different Euclidean distances. This reveals the mathematical consequence of squaring coordinate gaps and helps the reader see why a single verbal description such as 'four points apart' is incomplete.",
            "Next, swap the parties. The coefficient stays the same, confirming symmetry. If a briefing claims that the coefficient identifies which party is more demanding, the claim fails this simple invariance test. Direction must come from the actual coordinates or from the separate veto-holder analysis.",
            "Then consider a common translation of both vectors within the permitted domain. Their coordinate differences, and therefore their distance, remain unchanged. This means the coefficient captures relative separation, not the absolute level of tolerance. Two parties both at the low end can be close to one another; two parties both at the high end can also be close.",
            "Finally, compare the coefficient with the bond-by-bond gap display. If the total appears small but one bond contains the largest gap, the operator should not infer that the disagreement is unimportant. The scale of the gap and its institutional significance are different questions. A small difference may control access to a critical process; a larger difference may concern a negotiable implementation detail.",
            "These tests do not establish that the metric is the best possible choice. They establish that the interpretation is consistent with the properties of the chosen metric. A formal critique can compare Euclidean distance with alternatives, but it should explain which properties would be gained or lost and preserve the canonical result for the official instrument.",
            "A postgraduate paper should be able to defend the interpretation at three levels: the algebraic properties of the calculation, the measurement assumptions behind the input scales, and the institutional meaning of the observed gap. Confusing these levels leads either to overconfident technocracy or to vague criticism that never engages with the actual method."
          ],
        },
        {
          title: "A practical protocol for reading asymmetry in a briefing",
          paragraphs: [
            "Start by naming the instrument and its purpose. If the figure comes from the Pattern Matching desk, describe the distance between the live bond vector and the documented cases. If it comes from the De-confliction Bench, describe the separation between seated parties' tolerance vectors. Do not use the single word asymmetry without clarifying which pair of objects is being compared.",
            "State the four coordinates and their provenance. For each party, indicate whether the vector is a stated tolerance or a derived one, and identify any leverage, vulnerability, or veto input used by the platform. This prevents a reader from assuming that the number is a direct measurement of comprehensive national power.",
            "Report the coefficient with its relevant pair and, where useful, the bond-by-bond gaps. If a veto holder is identified, state the limiting bond and the comparison that supports that conclusion. If no threshold applies to the coefficient, say so explicitly; do not convert colour, rank, or an informal descriptor into a breach rule.",
            "Use historical cases as qualitative context. Cite the signed treaty or official record for the institutional arrangement, and cite scholarship when making interpretive claims about power or negotiation. Never fill gaps in the historical record with coordinates devised solely to support an analogy.",
            "Then identify a possible institutional remedy and its limits. A neutral forum can make interpretation less dependent on the stronger party; a scheduled transfer can address a different kind of asymmetry; an independent guarantee can reduce vulnerability. The chosen measure should respond to the diagnosed mechanism rather than to the coefficient in isolation.",
            "Close with a statement of uncertainty and authority. The model describes declared inputs. It does not decide the legal status of an agreement, bind a party to accept a compromise, or establish that a remedy will work. Those judgments require evidence, negotiation, and the applicable legal framework."
          ],
        },
        {
          title: "Boundaries, rounding, and disciplined comparison",
          paragraphs: [
            "The theoretical boundary is fixed by the scale, but published values are rounded. A displayed coefficient of 0.18 represents the rounded output, not an exact statement that the underlying distance is exactly 1.44. When a close ordering or tie matters, consult the source calculation and preserve the engine's precision rather than deriving a new order from rounded labels.",
            "The coefficient is bounded from zero to one under valid four-coordinate inputs. A value outside that interval signals a problem with the input domain, the calculation, or the reporting process; it is not evidence of an unusually severe negotiation. The instrument's guards and clamping rules protect the published domain, but an audit should still check the source values.",
            "A zero coefficient means the vectors match on the defined coordinates. It does not mean that the parties agree on issues outside those coordinates, trust each other, or share a legal interpretation. Conversely, a coefficient of one means maximum separation within the instrument's domain, not that negotiation is impossible or that violence is inevitable.",
            "The same reading may carry different significance depending on which bond contains the gap and what institution governs that bond. That context is why the pairwise number should be accompanied by the vector-level display and by the veto-holder assessment where applicable.",
            "If several readings are compared over time, hold the scale, party set, and scoring protocol constant or clearly document changes. Adding a party changes the maximum-pair candidate; changing a vector's measurement convention changes the meaning of its coordinates. Without that continuity, a time trend in the coefficient may reflect model composition rather than altered relations.",
            "The final interpretive discipline is simple: report the number, report the objects compared, identify the most consequential coordinate, and state what the metric does not claim. This yields a precise comparison without turning geometry into a metaphor for political certainty."
          ],
        },
        {
          title: "Concluding reflection on asymmetry",
          paragraphs: [
            "The metric is most useful when it forces the analyst to stop speaking about parties as if they were interchangeable. It makes a specified distance visible, preserves the bond-by-bond pattern, and invites attention to the party whose tolerance is most consequential on the limiting bond. Its value depends on honest inputs and careful comparison.",
            "It is not a substitute for negotiation theory, legal analysis, or contextual history. Those disciplines explain why a party may hold a position, what authority constrains it, and which procedural or substantive change could make agreement possible. The Euclidean coefficient contributes one reproducible description within that wider inquiry.",
            "Never manufacture a historical vector, treat the coefficient as a probability, or infer a breach threshold that the engine does not define. Keep the distance, resonance, friction pair, and veto reading analytically distinct. That is how the instrument remains useful without claiming more than its mathematics can support."
          ],
        },
        {
          title: "A final check before publishing the coefficient",
          paragraphs: [
            "Before publishing a friction reading, verify that the comparison uses the intended seated parties, the same four coordinates, and values within the declared domain. Record which vectors were operator-stated and which were derived. Reproduce the coefficient with the engine's normalization and rounding rather than a hand-selected distance measure.",
            "Name the pair that controls the maximum, and inspect its four coordinate gaps. If a separate veto holder is reported, identify the limiting bond and keep that result distinct from the symmetric distance. A maximum coefficient alone cannot supply direction.",
            "For a historical resonance, identify the live vector and the documented cases returned by the ranking. Cite the case records and explain that similarity under the defined dimensions does not imply equivalent causes or outcomes.",
            "If the coefficient changes, determine whether a party's tolerance changed, whether the table's membership changed, or whether the underlying scoring method changed. These can produce different interpretations even where the displayed movement is identical.",
            "The distance is a descriptive tool for a defined geometry. Publish it with its scope, preserve the underlying values, and treat any proposed remedy as a separate legal and negotiation judgment."
          ],
        },
        {
          title: "Interpretive safeguards for the next analyst",
          paragraphs: [
            "The next analyst should be able to reproduce the comparison without inferring which actors or dimensions were intended. Preserve the four coordinates, the canonical order of parties or cases, the observation date, and whether a tolerance was stated or derived. This keeps the distance auditable even when the displayed coefficient is rounded.",
            "If the comparison is used to design a guarantee, explain the mechanism the guarantee addresses. A neutral forum can reduce dependence on unilateral interpretation; an external account can protect a resource; a dated transfer can bind successors. None follows automatically from a coefficient, and each requires a legal instrument and authority appropriate to the case.",
            "When the party set changes, note that the largest pair may change simply because a new pair is now included. When the metric or scale changes, do not compare the new coefficient directly with the old one as though it had the same denominator. Versioning the setup is as important here as versioning the evidence.",
            "Historical analogies should stay attached to their primary records. The Indus and Panama materials can show institutional designs and their limitations, but they do not supply party coordinates. Keeping the cases qualitative preserves their evidentiary value without manufacturing a quantitative validation that never occurred.",
            "The metric's disciplined use is therefore modest: quantify distance on the four-bond tolerance space, show the bond-level pattern, and direct attention to the party or bond that may require a guarantee. Keep law, power, and political judgment visible beside the number. Preserve prior versions so later analysts can reproduce how the comparison was reached."
          ],
        },
      ],
      instrument: "asymmetry",
    },
  ],
  quiz: [
    {
      id: "q4-3-1",
      question: "Why are distances in the four-bond state space normalised by 8?",
      options: [
        { id: "opt-a", text: "Because there are eight documented cases.", explanation: "Incorrect. The number of cases is a coincidence; the normalisation follows from the scale.", correct: false },
        { id: "opt-b", text: "Because 8 is the largest possible distance between two vectors whose four components each lie between 1 and 5.", explanation: "Correct. The widest gap per bond is 4, so the widest distance is \\(\\sqrt{4 \\times 16} = 8\\).", correct: true },
        { id: "opt-c", text: "Because the Dominum Index is out of 8.", explanation: "Incorrect. The Dominum Index runs from 0 to 100.", correct: false },
        { id: "opt-d", text: "Because the viable floor is 3.0 and the fracture level 5.0.", explanation: "Incorrect. The fracture level is 2.0, and neither constant sets the normalisation.", correct: false },
      ],
    },
    {
      id: "q4-3-2",
      question: "Two seated parties have default tolerance vectors that differ by 1.0 on two bonds. What is their friction coefficient?",
      options: [
        { id: "opt-a", text: "0.25", explanation: "Incorrect. That would be a distance of 2, divided by 8.", correct: false },
        { id: "opt-b", text: "0.18", explanation: "Correct. The distance is \\(\\sqrt{2} = 1.414\\), and \\(\\frac{1.414}{8} = 0.1768\\), which rounds to 0.18.", correct: true },
        { id: "opt-c", text: "2.00", explanation: "Incorrect. The coefficient is normalised to the range 0 to 1.", correct: false },
        { id: "opt-d", text: "0.50", explanation: "Incorrect. Recompute the Euclidean distance before normalising.", correct: false },
      ],
    },
    {
      id: "q4-3-3",
      question: "On which axes does the platform measure asymmetry between parties?",
      options: [
        { id: "opt-a", text: "Military, economic, institutional and informational power.", explanation: "Incorrect. No desk scores those axes; power enters through each inscribed party's leverage and vulnerability, which move its tolerance on the four bonds.", correct: false },
        { id: "opt-b", text: "The four bonds: Interpersonal, Communal, Intergenerational and Institutional-Relational.", explanation: "Correct. Every distance on the platform is computed in the four-bond space, so it can be reconciled with every other reading.", correct: true },
        { id: "opt-c", text: "Population and territory.", explanation: "Incorrect. Neither is a desk reading.", correct: false },
        { id: "opt-d", text: "Whatever axes the operator chooses for the mission.", explanation: "Incorrect. Invented coordinates are prohibited.", correct: false },
      ],
    },
    {
      id: "q4-3-4",
      question: "Which feature of the Indus Waters Treaty most directly answered the upstream and downstream asymmetry between the parties?",
      options: [
        { id: "opt-a", text: "A bilateral promise to consult in good faith, without a third party.", explanation: "Incorrect. Consultation alone would have left the stronger position unchecked.", correct: false },
        { id: "opt-b", text: "A rule-based allocation of rivers and a graded ladder from the Permanent Indus Commission to a Neutral Expert and a Court of Arbitration, with the World Bank as a signatory.", explanation: "Correct. Allocation by rule and a neutral, graded route to decision are the architecture of asymmetry management.", correct: true },
        { id: "opt-c", text: "Joint military patrols of the headworks.", explanation: "Incorrect. The treaty contains no such provision.", correct: false },
        { id: "opt-d", text: "An automatic expiry after ten years.", explanation: "Incorrect. The treaty has no fixed term; it remains in force until the parties terminate it together.", correct: false },
      ],
    },
    {
      id: "q4-3-5",
      question: "An inscribed party has leverage 5 and vulnerability 1 and holds no veto. Another has leverage 1 and vulnerability 5 and holds no veto. What is their friction coefficient?",
      options: [
        { id: "opt-a", text: "1.00, because they are at opposite extremes of power.", explanation: "Incorrect. The tolerance rule maps power into a base between 2.0 and 4.0, so the parties read 4.0 and 2.0 on every bond, not 5 and 1.", correct: false },
        { id: "opt-b", text: "0.50", explanation: "Correct. Each base is \\(3 \\pm 0.25 \\times 4\\), giving 4.0 and 2.0 on every bond; the distance is \\(\\sqrt{4 \\times 4} = 4\\) and the coefficient 0.50.", correct: true },
        { id: "opt-c", text: "0.25", explanation: "Incorrect. The gap is two points on every bond, not one.", correct: false },
        { id: "opt-d", text: "0.00, because inscribed parties carry no tolerance vector.", explanation: "Incorrect. Inscribed parties receive a derived tolerance vector on the bench.", correct: false },
      ],
    },
    {
      id: "q4-3-6",
      question: "The widest pair at the table reads 0.18, but one party demands 4.0 on a limiting bond that reads 2.4. What should the operator report?",
      options: [
        { id: "opt-a", text: "Low friction; no further action is needed.", explanation: "Incorrect. The coefficient measures the parties against each other; the veto measures a party against the settlement.", correct: false },
        { id: "opt-b", text: "A coefficient of 0.18 and a named veto holder with a gap of 1.6 on the limiting bond, calling for a neutral guarantee there.", explanation: "Correct. The veto holder is the party whose tolerance on the limiting bond most exceeds the live score; a guarantee on that bond is the remedy.", correct: true },
        { id: "opt-c", text: "A breach, because the coefficient exceeds 0.12.", explanation: "Incorrect. The tints on the matrix are visual emphasis; the engine attaches no threshold to the coefficient.", correct: false },
        { id: "opt-d", text: "That the coefficient must be recomputed with the largest single gap.", explanation: "Incorrect. The coefficient is the normalised Euclidean distance; the largest-gap reading is the discrepancy the Codex records.", correct: false },
      ],
    },
  ],
  practice: [
    {
      problem: "For the live vector 3.8, 1.9, 3.2 and 3.0, give the three nearest canonical cases with their distances and one-decimal resonances, and explain the order of the third place.",
      solution: [
        "distanceTable gives Kenya at 1.221, resonance 84.7; Colombia at 1.300, resonance 83.8; and Rwanda, South Africa, and Tuvalu and Kiribati tied at 2.071, resonance 74.1.",
        "The tie for third is broken by canonical order: Rwanda is fifth in the table, South Africa seventh and Tuvalu and Kiribati eighth, so Rwanda takes third place. rankCases reports the same three cases with whole-number resonances of 85, 84 and 74.",
      ],
    },
    {
      problem: "Give the Manhattan, Euclidean and largest-gap distances between 4, 4, 4, 4 and 3, 3, 3, 3, and the friction coefficient. Which metric would make this pair look most distant, relative to its own maximum?",
      solution: [
        "The gaps are 1 on each bond. The Manhattan distance is 4, the Euclidean 2 and the largest gap 1. The coefficient is \\(\\frac{2}{8} = 0.25\\).",
        "Relative to their maxima of 16, 8 and 4, the three readings are 0.25, 0.25 and 0.25: for a uniform gap they agree. They diverge only when the gap is uneven, which is exactly the case in which the choice of metric is a doctrinal choice.",
      ],
    },
    {
      problem: "What is the lowest resonance any live vector can have with Kenya, whose profile is 4, 2, 2 and 3?",
      solution: [
        "The farthest corner takes, for each bond, whichever of 1 and 5 is farther: 1, 5, 5 and 1, at gaps of 3, 3, 3 and 2. The distance is \\(\\sqrt{9 + 9 + 9 + 4} = \\sqrt{31} = 5.568\\).",
        "The resonance floor is \\((1 - \\frac{5.568}{8}) \\times 100 = 30.4\\). A resonance of 40 with Kenya is therefore much closer to the worst possible match than the number suggests on its own.",
      ],
    },
    {
      problem: "An inscribed party of leverage 5 and vulnerability 1 holds a veto, the limiting bond is the Communal bond, and the other party has leverage 1 and vulnerability 5 and no veto. Give both tolerance vectors and the coefficient. What changes if the second party also holds a veto?",
      solution: [
        "The first party's base is \\(3 + 0.25 \\times 4 = 4.0\\), plus one on the Communal bond: 4.0, 5.0, 4.0 and 4.0. The second party's base is 2.0: 2.0 on every bond. The gaps are 2, 3, 2 and 2, the distance \\(\\sqrt{21} = 4.58\\), and the coefficient 0.57.",
        "With a veto the second party reads 2.0, 3.0, 2.0 and 2.0; the gaps are 2 on every bond, the distance 4 and the coefficient 0.50. A veto on the weaker side narrows the friction on the limiting bond, but it also creates a second holdout on that bond if the live score is below 3.0.",
      ],
    },
    {
      problem: "On the Drill Beta vector, two default delegations carry the Institutional-Relational and Communal bonds. Which party is the veto holder, and what single repair dissolves the veto?",
      solution: [
        "The limiting bond is the Institutional-Relational bond at 2.4. The first delegation demands 4.0 there, a gap of 1.6; the second demands 3.0, a gap of 0.6. The first is the veto holder, and the coefficient between them is 0.18.",
        "Lifting the Institutional-Relational bond to 4.0 dissolves both gaps. Until then, a neutral guarantee on that bond, written so that it does not depend on the veto holder's consent, is the protocol's remedy.",
      ],
    },
    {
      problem: "For the live vector 3.8, 1.9, 3.2 and 3.0, by how much must the vector move before Kenya and Colombia could exchange places as nearest case? Verify with a one-tenth change on the Intergenerational bond.",
      solution: [
        "The distances are 1.221 to Kenya and 1.300 to Colombia, a margin of 0.079. By the triangle inequality each distance changes by at most the length of the movement, so a movement of at least \\(\\frac{0.079}{2} = 0.040\\) is needed for the order to change.",
        "Raising the Intergenerational bond to 3.3 is a movement of 0.1, more than enough. The two distances become equal at 1.319, and the tie goes to Colombia, the earlier case in canonical order. The nearest-case finding for the original vector should therefore be reported with both distances, not as Kenya alone.",
      ],
    },
    {
      problem: "On the Drill Beta vector the veto holder demands 4.0 on the Institutional-Relational bond, which reads 2.4. Using the Decay Horizon with a Rupture Index of 38 and an uninsulated exposure of 26, give the projected limiting score and the veto gap after thirty days, and the same with the shocks insulated to an exposure of 6.5.",
      solution: [
        "Uninsulated, \\(\\lambda = \\frac{64}{2000} = 0.032\\); the bond's floor-arrival time is \\(\\frac{\\ln 2.4}{0.032} = 27.4\\) days, so at thirty days it is projected at 1.00 and the gap has widened from 1.6 to 3.0.",
        "Insulated, \\(\\lambda = 0.02225\\); the bond is projected at \\(2.4\\, e^{-0.6675} = 1.23\\) and the gap is about 2.8, with the floor reached after about 39.3 days. Insulation slows the widening but does not stop it; only repair of the limiting bond closes the gap.",
      ],
    },
  ],
  readingList: [
    {
      citation: "World Bank, Fact Sheet: The Indus Waters Treaty 1960 and the Role of the World Bank",
      url: "https://www.worldbank.org/en/region/sar/brief/fact-sheet-the-indus-waters-treaty-1960-and-the-world-bank",
      note: "Allocation of rivers, the Commission, the Neutral Expert and Court of Arbitration, the Bank's procedural role, the 2016 requests, the pause and the 2022 appointments.",
    },
    {
      citation: "Indus Waters Treaty 1960, United Nations Treaty Series vol. 419, No. 6032",
      url: "https://treaties.un.org/doc/Publication/UNTS/Volume%20419/volume-419-I-6032-English.pdf",
      note: "The text and its annexures.",
    },
    {
      citation: "United States Department of State, Office of the Historian, The Panama Canal and the Torrijos-Carter Treaties",
      url: "https://history.state.gov/milestones/1977-1980/panama-canal",
      note: "The 1903 treaty, the 1967 drafts, the 1977 treaties, Senate ratification and the 1999 transfer.",
    },
    {
      citation: "I. W. Zartman and J. Z. Rubin (eds), Power and Negotiation (University of Michigan Press, 2000), Processes of International Negotiation programme",
      url: "https://www.pin-negotiation.org/en/publications/pin-books/pin-book-or-power-and-negotiation",
      note: "Power as an act; the comparative finding on symmetry and asymmetry. DOI 10.3998/mpub.16897.",
    },
    {
      citation: "P. E. Black (ed.), Dictionary of Algorithms and Data Structures, NIST: Euclidean distance",
      url: "https://xlinux.nist.gov/dads/HTML/euclidndstnc.html",
      note: "Definition of Euclidean distance in N dimensions.",
    },
    {
      citation: "P. E. Black (ed.), Dictionary of Algorithms and Data Structures, NIST: Lm distance",
      url: "https://xlinux.nist.gov/dads/HTML/lmdistance.html",
      note: "The Minkowski family: Manhattan, Euclidean and the largest-gap distance.",
    },
    {
      citation: "The Vinculum Codex and Compact, UDCA Official Edition, Part III, 3.4 The Non-Linear Topological Metric and Euclidean Case Resonance; Asymmetry: corrected proof register",
      note: "Metric properties, resonance precisions, the canonical table and the frictionProof discrepancy (supplied edition; not public).",
    },
  ],
};
