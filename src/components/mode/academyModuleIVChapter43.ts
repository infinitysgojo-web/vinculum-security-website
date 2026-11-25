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
  estimatedMinutes: 41,
  executiveLede:
    "Disputes often fail because parties are assumed to stand at equal distance from a settlement when profound asymmetry separates them. The platform measures that distance in one space only, the four-bond space: between a live theatre and the eight documented cases on Desk 01, and between the tolerance vectors of seated parties on the De-confliction Bench (Desk 07). Both are Euclidean distances normalised by 8, the largest distance two four-bond vectors on the 1 to 5 scale can reach. The doctrine's \\(\\Delta_{asym}\\) is that normalised distance.",
  synopsis: [
    "On Desk 01 the distance \\(d(B,\\, C_{k})\\) from the live vector to each canonical case is converted into a resonance, \\((1 - \\frac{d}{8}) \\times 100\\), and the three nearest cases are ranked, ties going to the earlier case. A nearest case is a mirror, not a template.",
    "On Desk 07 each party carries a tolerance vector, and the friction coefficient of a pair is the distance between their vectors divided by 8, rounded to two decimals. The largest pairwise coefficient is published as the party friction reading, and the veto holder is the party whose tolerance on the limiting bond most exceeds the live limiting score. The engine attaches no breach threshold to the coefficient; it tells the operator where third-party guarantees or neutral holdbacks are needed.",
    "The axes are the four bonds, not military, economic or informational power. The lecture reads the Indus Waters Treaty of 1960 and its recent history, in which a graded neutral ladder met a party's withdrawal, beside the Panama Canal Treaties of 1977, in which a stark asymmetry was answered with a dated transfer of custody, then derives the metric and sets it beside the theory of power in negotiation.",
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
        title: "The Indus Waters Treaty: Geography as Asymmetry (1960 to 2026)",
        jurisdiction: "India and Pakistan, with the World Bank / Indus Basin",
        precedent: "Indus Waters Treaty, signed at Karachi on 19 September 1960; Indus Waters Western Rivers Arbitration (PCA Case No. 2023-01), awards of 6 July 2023, 27 June 2025 and 31 August 2026",
        analysis: [
          "Partition in 1947 left the headworks of the Indus system largely in India while the irrigated plains that depended on them lay in Pakistan: an upstream and downstream asymmetry written into the river itself. After nine years of negotiation initiated by the World Bank, which is itself a signatory, the treaty allocated the Eastern Rivers (the Ravi, the Beas and the Sutlej) to India and the Western Rivers (the Indus, the Jhelum and the Chenab) to Pakistan, while allowing each country certain uses on the rivers allocated to the other, including Indian run-of-river hydro-electric plants on the Western Rivers subject to design constraints in the treaty's annexures.",
          "The treaty answered the asymmetry with architecture rather than trust. A Permanent Indus Commission, with a commissioner from each country, exchanges information; questions go to the Commission, technical differences to a Neutral Expert, and disputes to an ad hoc Court of Arbitration. The World Bank describes its own role as limited and procedural: it designates individuals to serve in those proceedings when asked. A Neutral Expert decided the Baglihar difference in 2007, after about a year and a half, and a Court of Arbitration decided the Kishenganga case in 2013, after about three years.",
          "The ladder was then tested at its entry point. In August 2016 Pakistan asked for a Court of Arbitration on the design of the Kishenganga and Ratle plants; in October 2016 India asked for a Neutral Expert on essentially identical questions. The treaty did not empower the Bank to choose between the two routes, and in December 2016 the Bank paused both appointments to give the parties time to agree; after five years without agreement it resumed them, and in 2022 it appointed a Neutral Expert and the Chairman of the Court. In July 2023 the Court unanimously rejected India's objections to its competence.",
          "On 23 April 2025, after an attack in India-administered Jammu and Kashmir, India announced that the treaty would be held in abeyance with immediate effect. In June 2025 the Court found that a party's unilateral decision after proceedings had begun could not remove its competence, and in August 2026, with India declining to participate, it found unanimously that none of the grounds India had invoked could justify suspension or termination, that the treaty remains fully in force, and ordered interim measures on the Ratle plant pending the Neutral Expert's decision.",
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
            "The recent history shows the two limits every such design carries. The entry point to the ladder was itself contestable: when each party invoked a different rung for the same questions, the appointing authority had no power to choose, and the answer was a pause of nearly six years. And the ladder cannot keep a party on it. The Court's August 2026 award settles the legal position, that the treaty remains in force; it does not, by itself, change the conduct of a party that did not appear before it.",
          ],
        },
        {
          title: "The treaty's own exit rule and what the Court did with it",
          paragraphs: [
            "The Court of Arbitration's reasoning in 2025 and 2026 turned on a feature of the treaty that is easy to overlook in a lecture about asymmetry: the instrument says how it ends. According to the Court, the treaty provides for no unilateral abeyance or suspension and continues in force until India and Pakistan, acting together, modify or terminate it through a further treaty. A rule of mutual termination is itself an answer to asymmetry, because it denies the stronger party a lawful exit that the weaker party has not agreed.",
            "Faced with India's April 2025 statement, the Court first held, in June 2025, that a party's unilateral act after proceedings had begun cannot remove a tribunal's competence, citing a settled rule of customary international law and noting that a unilateral power to suspend dispute settlement would fundamentally undermine the value of the treaty's compulsory third-party process. In August 2026 it went further. It examined the grounds India had invoked in public statements, among them material breach, a fundamental change of circumstances, the effect of armed conflict and countermeasures, and found that none could justify suspension or termination. It also took India's positions into account from its statements and conduct outside the proceedings, as international tribunals do when a party does not appear.",
            "For the operator the lesson is precise. A neutral architecture can be built so that it keeps its competence, keeps deciding and keeps the legal position of the weaker party intact when the stronger party withdraws. The Court's interim order on the Ratle plant, prohibiting concreting above stated levels until ninety days after the Neutral Expert's final decision, shows such an architecture still issuing concrete directions. Whether those directions are followed is a different question, and the open record does not yet answer it.",
          ],
        },
        {
          title: "The Panama Canal Treaties: custody on a calendar (1977 to 1999)",
          paragraphs: [
            "The second instrument answered a different asymmetry. Under the Hay-Bunau-Varilla Treaty of 1903 the United States held permanent rights over a Canal Zone across the isthmus, negotiated for Panama by a representative who, as the State Department's own history records, entered the negotiations without formal consent from the Panamanian government. Tension over that arrangement grew through the century; riots in 1964 over the right to fly the Panamanian flag in the Zone led to a brief interruption of diplomatic relations and an agreement to negotiate a new settlement.",
            "Three draft treaties agreed in 1967 did not survive a change of government in Panama: the president who had negotiated them lost the 1968 election, and his successor was deposed by a coup eleven days into his term. Negotiations resumed under a new American negotiator from 1973, who shifted the aim from perpetual American control of the Zone to perpetual American use of the Canal. Two treaties were signed on 7 September 1977. The Neutrality Treaty provided that the United States could defend the Canal's neutrality, and the Panama Canal Treaty provided that the Zone would cease to exist on 1 October 1979 and that the Canal itself would pass to Panama on 31 December 1999.",
            "Ratification required two thirds of the United States Senate, and opposition was strong. The Senate ratified the Neutrality Treaty on 16 March 1978 and the Panama Canal Treaty on 18 April 1978, each by 68 votes to 32. Relations between the two countries grew contentious after the death of Omar Torrijos in 1981, and in December 1989 the United States invaded Panama to remove its leader. The transfer nevertheless took place on the date the treaty set, and Panama has administered the Canal since.",
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
            "The Indus record supplies the most practical lesson for this desk. A graded ladder of neutral decision-makers is the standard architecture for asymmetric water and boundary arrangements, and it worked on the Indus for decades, through a Neutral Expert's decision in 2007 and a Court of Arbitration's in 2013. Its weak point was not any rung but the choice between them: when each party invoked a different rung for the same questions in 2016, the treaty gave the appointing authority no power to choose, and nearly six years passed before both processes were set in motion side by side.",
            "The Court of Arbitration's own reasoning in 2025 points to the countermeasure. It held that, under the treaty, the Court alone decides questions about its competence, and that a party's unilateral act after proceedings have begun cannot remove that competence. A drafting team working on the bench should write the same two protections into any graded ladder it recommends: a rule for which rung hears a disagreement that both parties have framed differently, and a provision that each body decides its own competence.",
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
          title: "Case file two: the party that leaves (Indus, 2025 to 2026)",
          paragraphs: [
            "Warning signs. An attack and a sharp rise in political rupture between the parties; a statement by one party that the treaty would be held in abeyance until the other met a political condition; and that party's non-participation in proceedings already under way.",
            "The mechanism. The neutral mechanism continued to function. The Court held that it remained competent, considered the absent party's positions from its public statements, and found the treaty fully in force. What no rung can do is compel conduct. The architecture preserved the legal position of the weaker party and the record of the dispute; it did not, by its own force, return the stronger party to the instrument.",
            "The countermeasure is not available inside the treaty, which is the lesson. A design that answers asymmetry must assume that, at the highest rupture readings, the stronger party may test it, and must place its most valuable protections where withdrawal is costly: in obligations that other parties and institutions also hold, in money held by a neutral, and in the continued functioning of the neutral bodies themselves. The desk's version is Rule 4.3-D's insistence on guarantees that do not depend on the veto holder's goodwill.",
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
      citation: "Permanent Court of Arbitration, Indus Waters Western Rivers Arbitration (Pakistan v. India), PCA Case No. 2023-01",
      url: "https://pca-cpa.org/en/cases/284",
      note: "Case record: awards of 6 July 2023, 27 June 2025, 8 August 2025, 15 May 2026 and 31 August 2026.",
    },
    {
      citation: "Permanent Court of Arbitration, Press Release, Supplemental Award on Competence, 27 June 2025",
      url: "https://docs.pca-cpa.org/2025/06/b2159e4f-2023-01-20250627-press-release.pdf",
      note: "India's April 2025 abeyance statement and the Court's holding on competence.",
    },
    {
      citation: "Permanent Court of Arbitration, Press Release, Award on the Status of the Indus Waters Treaty and Order on Interim Measures, 31 August 2026",
      url: "https://pcacases.com/web/sendAttach/105089",
      note: "The treaty found fully in force; interim measures on the Ratle plant.",
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
