import type { DetailedAcademyChapter } from "./academyTypes";
import { LECTURE_HEADINGS as H } from "./academyLectureHeadings";
import { F_DECAY, F_DOMINUM, F_ESCROW_CHAIN, F_ESCROW_CONSERVATION, F_ESCROW_RELEASE, F_EXPOSURE, F_HALF_LIFE, F_SUCCESSION } from "./academyFormulas";

/**
 * Module V, Chapter 5.2: Drill Beta. The scenario state is fictional; the precedents
 * are read from the open public record only, and every figure is re-derived from the
 * engine in qa/academy-curriculum.test.ts.
 */
export const CHAPTER_5_2: DetailedAcademyChapter = {
  id: "drill-debt",
  number: "5.2",
  eyebrow: "Module V · Chapter 5.2 · Drill Beta",
  title: "Drill Beta: Sovereign Debt Restructuring & Mineral Collateral",
  estimatedMinutes: 45,
  drillType: "debt",
  executiveLede:
    "A coastal state emerging from a decade of instability has defaulted on its external bonds. Its creditors will accept a restructuring, and a group of conservation funders will finance part of it as a debt-for-nature swap, but the state's most valuable remaining asset is a set of mineral concessions whose award is contested by communities in the mining districts and by a former government's licensees. The finance ministry proposes to pledge the concession revenues as collateral. An election falls due within the restructuring period. The drill asks how to release money in a way that survives a change of hands.",
  synopsis: [
    "Diagnostic profile: the bonds read \\(B = (3.4,\\, 3.2,\\, 3.1,\\, 2.4)\\). The Institutional-Relational bond is the limiting bond at 2.4, in the Fragile band: the concession awards, the creditor committee and the conservation trust have no institution that all parties accept. The Rupture Index reads 38, in the Elevated band. With one covenant in force, succession durability on Desk 12 reads 48.7 per cent, below the 55 per cent Succession Trap.",
    "Strategic objective: structure the swap proceeds and the concession revenues as a multi-tranche escrow whose conditions are read from the bus and whose custody sits outside the debtor, lift the Institutional-Relational bond with an office-continuity covenant before the election, and insulate the succession shock so that the decay clock slows. With a verifier seated, the waterfall releases 40 per cent at first, 67 per cent once the institutions hold, and the whole pledge at Final Cession.",
    "The precedents are the Seychelles debt conversion of 2016 and its sovereign blue bond of 2018, which tied debt relief to a marine protection commitment held by an independent trust, and Ecuador's Galápagos debt-for-nature conversion of 2023, which tied a bond buyback to conservation funding under credit guarantees. The lecture closes with the escrow balance bar, on which the conservation of the pledge can be watched under every condition.",
  ],
  formulas: [F_ESCROW_RELEASE, F_SUCCESSION],
  statutoryNotice:
    "Drill Rule: at a Rupture Index of 35 or more an independent verifier and an office-continuity provision are mandatory; survival below 55 per cent holds the Succession Durability gate and withholds Final Cession. Collateral is never released by the party that pledged it.",
  learningOutcomes: [
    "Read the Seychelles and Ecuador conversions as escrows whose conditions and custody sit outside the debtor government.",
    "Map a debt-for-nature swap and a contested mineral collateral onto the four tranches of the Conditional Escrow Waterfall, and compute the release at each stage.",
    "Compute the decay constant and half-life with and without an insulating provision, and explain why measured rupture dominates the clock.",
    "Compute succession durability against the 55 per cent Succession Trap and show why covenants alone cannot clear it.",
    "Compute the Dominum Index at the end of the drill and explain why a fully released escrow still reads Custodial Inversion.",
  ],
  sections: [
    {
      heading: H.autopsy,
      subheading: "Debt Relief Held in Trust: Seychelles 2016 to 2018 and Ecuador 2023",
      paragraphs: [
        "A sovereign debt restructuring is a relational settlement before it is a financial one. The creditors accept less than they are owed because they believe the debtor will perform on the new terms; the debtor accepts conditions because it believes the creditors will not walk away at the first missed milestone. When a third party funds part of the relief in exchange for a public commitment, such as protecting a marine area, the settlement acquires a fourth bond: the communities who must live inside the commitment.",
        "The debt-for-nature swap is the instrument that makes this explicit. A funder buys or refinances part of a state's debt at a discount, and the state commits a share of the savings to conservation, usually through an independent trust that disburses against agreed milestones. The idea is decades old. Its recent sovereign form is the one the drill uses, because it is the form in which money, collateral and verification meet in one instrument.",
        "Seychelles concluded a debt conversion with The Nature Conservancy in 2016 under which part of its official bilateral debt was refinanced, and the savings were directed to a new independent trust, the Seychelles Conservation and Climate Adaptation Trust. In return the state committed to protect thirty per cent of its marine area under a marine spatial plan, a target it announced as reached in 2020. In 2018 Seychelles issued what the World Bank described as the world's first sovereign blue bond, raising fifteen million US dollars for sustainable fisheries and marine projects, supported by a partial guarantee from the World Bank and a concessional loan from the Global Environment Facility.",
        "Ecuador completed in 2023 what was then the largest debt-for-nature conversion on record. It repurchased international bonds with a face value of roughly 1.6 billion US dollars at a deep discount, financed by a new loan of 656 million US dollars backed by political-risk insurance from the United States International Development Finance Corporation and a guarantee from the Inter-American Development Bank. In exchange it committed long-term funding to marine conservation around the Galápagos Islands, disbursed through a dedicated trust, the Galápagos Life Fund.",
        "Read through the desks, the two conversions share a structure that the drill will reproduce. The relief was conditional on a verifiable public commitment. The money for that commitment did not pass through the ordinary budget of the debtor government; it was held by a trust whose governance included parties other than the government. And the credit of the new instrument rested on guarantors outside the parties, so that the bondholders' confidence did not depend on any one minister remaining in office.",
        "What neither conversion had to resolve is the problem the drill adds: collateral whose ownership is itself in dispute. A concession contested by the communities who live on it and by the licensees of a former government is not a neutral asset. Pledging it can turn a restructuring into a second front of the same conflict. The Chad-Cameroon revenue law, studied in Chapter 4.5, is the warning: when the party under discipline holds the rules of release, the intergenerational reserve is the first thing it can delete.",
      ],
      caseStudy: {
        title: "Seychelles (2016 to 2018) and Ecuador (2023): Debt Relief Conditioned on a Public Commitment",
        jurisdiction: "Republic of Seychelles and The Nature Conservancy; Republic of Ecuador with the United States International Development Finance Corporation and the Inter-American Development Bank / Indian Ocean and Eastern Pacific",
        precedent: "Seychelles debt conversion of 2016 and the Seychelles Conservation and Climate Adaptation Trust; Seychelles sovereign blue bond of October 2018; Ecuador Galápagos debt-for-nature conversion of May 2023 and the Galápagos Life Fund",
        analysis: [
          "In Seychelles, the savings from the conversion were placed with an independent trust and tied to a commitment to protect thirty per cent of the marine area under a marine spatial plan. The blue bond of 2018 raised fifteen million US dollars with a partial World Bank guarantee and a Global Environment Facility concessional loan behind it.",
          "In Ecuador, a bond buyback at a deep discount was financed by a new loan carrying political-risk insurance and a multilateral guarantee, and the conservation commitment for the Galápagos was funded through a dedicated trust rather than the ordinary budget.",
          "In both, three features recur: a commitment that can be verified by parties other than the government, custody of the conservation money outside the treasury, and credit support from guarantors who are not parties to the dispute. These are the Mobilisation verifier, the custody rule and the neutral guarantee of the Conditional Escrow Waterfall.",
        ],
        failureMechanism:
          "Not a failure: relief conditioned on a verifiable commitment and held in an independent trust outlasted changes of government. The limit of the model is collateral whose ownership is itself contested; neither conversion pledged an asset that communities on the ground disputed.",
      },
      statutoryRule:
        "Rule 5.2-A: Relief money and pledged collateral are held by a trust outside the debtor's treasury, under conditions the debtor cannot amend alone. Custody follows the instrument, not the minister.",
    },
    {
      heading: H.architecture,
      subheading: "Four Tranches for a Swap and a Contested Concession",
      paragraphs: [
        "The relational vector of the drill reads 3.4 on the Interpersonal bond, 3.2 on the Communal bond, 3.1 on the Intergenerational bond and 2.4 on the Institutional-Relational bond. The finance minister and the creditor committee's chair speak frankly, so the Interpersonal bond is Viable. The coastal and fishing communities broadly support the marine commitment, so the Communal bond is just above the floor, though the mining districts are restive. The Intergenerational bond is just above the floor because the conservation commitment is designed to outlast the restructuring. The Institutional-Relational bond is the limiting bond: no institution yet exists that the communities, the creditors and the former licensees all accept as the custodian of the concession revenues.",
        "On Desk 01 the nearest documented case is Liberia, a settlement in which institutions had to be built while the transition ran. On Desk 02 the analyst has recorded a register that, with the inscribed load and a static trend, reads a Rupture Index of 38. That is the Elevated band: an independent verifier must be seated, and an office-continuity provision drafted, before the gates will clear.",
        "The Conditional Escrow Waterfall on Desk 07 is the instrument for the money. The pledge is the total of the swap proceeds committed to conservation and the concession revenues pledged as collateral, divided into the four default tranches of 25, 25, 30 and 20. The mapping is direct. Mobilisation, released when an independent verifier is seated, funds the conservation trust's secretariat and the independent audit of the concession awards. Demarcation, released when the Communal bond stands above 3.0, funds the marine spatial plan and the community consultations in the mining districts. Operational Commissioning, released when the Institutional-Relational bond stands above 3.0 and the tracks are in step, opens the first disbursements against the concession revenues to the new custodian. Final Cession, released when the Intergenerational bond stands above 3.0 and survival under succession stress is at or above 55 per cent, discharges the reserves and transfers the long-term endowment to the trust.",
        "The holdbacks the scenario calls for are the reserves of the waterfall. The clawback reserve, ten per cent of whatever has been released, is the pool from which a later finding of breach can be recovered: if the concession audit finds an award was corrupt, the clawback is where restitution begins. The performance bond, five per cent of the pledge capped at what remains after the clawback, is the state's stake in completion. Both are held until Final Cession, because Final Cession's condition is exactly the risk they were held against: that the settlement does not survive a change of government.",
        "The Succession Simulator on Desk 12 reads the election as a succession shock. Its severity enters the unmitigated exposure in full unless a provision in force insulates it, in which case only a quarter enters. Together with the Rupture Index, the exposure sets the decay constant. The Dominum Index on Desk 15 reads all of this at the end: the bonds, the released share of the escrow, the succession durability and the containment of rupture.",
      ],
      formulas: [F_ESCROW_CHAIN, F_ESCROW_CONSERVATION, F_EXPOSURE],
      statutoryRule:
        "Rule 5.2-B: A missing reading is treated as zero and fails its test. A concession audit that has not reported is not a met condition, and the tranche it guards does not release.",
    },
    {
      heading: H.proofs,
      subheading: "Release, Decay, Durability and the Final Reading",
      paragraphs: [
        "Release at the opening position. With a verifier seated, the Communal bond at 3.2 and the Institutional-Relational bond at 2.4, Mobilisation and Demarcation are met and Operational Commissioning is not. The gross is 50; the clawback is \\(\\frac{50 \\times 10}{100} = 5\\); the performance bond is \\(\\min(5,\\, 50 - 5) = 5\\); the release is \\(50 - 5 - 5 = 40\\) per cent. Without the verifier, the chain rule would release nothing, though the Communal bond stands above the floor.",
        "Release once the institutions hold. Raise the Institutional-Relational bond to 3.4 with the track gap within tolerance, and Operational Commissioning is met. The gross is 80; the clawback is 8; the performance bond is 5; the release is 67 per cent. Raise survival to 56.9 per cent with the Intergenerational bond at 3.1, and Final Cession is met: both reserves discharge and the release is 100. At every stage the four shares, 25, 25, 30 and 20, sum to exactly 100. The pledge is conserved; only its state changes.",
        "The decay clock. With the election unabsorbed the unmitigated exposure is 26, and with the Rupture Index at 38 the decay constant is \\(\\lambda = \\frac{26 + 38}{2000} = 0.032\\) per day, a stability half-life of \\(\\frac{\\ln 2}{0.032} = 21.7\\) days. An office-continuity provision that guards against the election shock cuts the exposure to 6.5, the constant to 0.02225 per day and lengthens the half-life to 31.2 days. The provision buys nine and a half days of half-life. It does not buy more, because the measured rupture of 38 is the larger term in the sum: the verifier and the communal work that lower the rupture reading matter as much as the provision.",
        "Succession durability. With one covenant the covenant indicator reads 0.5, the mean bond is 3.025, and durability is \\(0.35 \\times 3.025 + 0.25 \\times 3.1 + 0.25 \\times 2.4 + 0.15 \\times 0.5 - 0.20 \\times 0.38 = 2.433\\), that is 48.7 per cent of the maximum, below the trap. A second covenant saturates the indicator and lifts durability to 50.2 per cent, still below the trap, because the covenant indicator carries only 0.15 of the weight. Lifting the Institutional-Relational bond to 3.4 with two covenants in force raises durability to 56.9 per cent and clears it. The bond must move; paper alone cannot clear the trap.",
        "The final reading. With bonds of 3.4, 3.2, 3.1 and 3.4, the escrow fully released, durability of 56.9 and a Rupture Index of 38, the Dominum Index is \\(100 \\times (0.30 \\times 0.56875 + 0.25 \\times 1 + 0.25 \\times 0.569 + 0.20 \\times 0.62) = 68.7\\), the Custodial Inversion phase. Every bond holds the floor and every tranche has released, yet the mission does not read Self-Reinforcing Dominium, because the bonds are only just above the floor and the rupture reading is still Elevated. At the opening position, with 40 per cent released and durability of 50.2, the index reads 50.1, the Fiduciary Anchor phase.",
        "The arithmetic teaches the order of work. Money released on verified bonds raises the fiduciary term by a quarter of a point per point released; bonds raised from the floor move the bond anchor and the durability together; and the rupture reading enters three times, in the decay constant, the durability and the containment term. A restructuring that releases money while leaving the rupture reading Elevated will read well on Desk 07 and poorly everywhere else.",
      ],
      formulas: [F_ESCROW_RELEASE, F_DECAY, F_HALF_LIFE, F_SUCCESSION, F_DOMINUM],
      statutoryRule:
        "Rule 5.2-C: Covenants that bind offices, not officeholders, are the only covenants that count toward succession durability in practice. A second covenant on paper without a stronger institution behind it will not clear the trap.",
    },
    {
      heading: H.protocols,
      subheading: "Running the Restructuring Through the Desks",
      paragraphs: [
        "Step one, Verification Ledger (Desk 16): seat an independent verifier for the conservation commitment and the concession audit. At a Rupture Index of 38 the Rupture Containment gate requires one, and its seating meets Mobilisation. The verifier is appointed by an institution outside the restructuring, funded from the Mobilisation tranche through the trust rather than through the treasury, and removable only by the same outside institution.",
        "Step two, Clause Architect (Desk 10): draft the office-continuity provision. It binds the custody of the concession revenues to the trust's board, an office whose composition is fixed in the instrument, and lists the election among the shocks it guards against. Draft a second covenant fixing the conservation commitment in a schedule that a later government cannot amend without the trust's consent. Both enter the covenant indicator; the first also insulates the election shock.",
        "Step three, the Conditional Escrow Waterfall (Desk 07): enter the pledge in the four default tranches and let the conditions read from the bus. Confirm the released share, the tranches met and the freeze state together in every dispatch. A dispatch that cites the 40 per cent release without the two tranches met and the unfrozen state is incomplete.",
        "Step four, Succession Simulator (Desk 12): apply the election shock and read the exposure, the half-life and durability with and without the insulating provision. Schedule the renewal of the creditor committee's mandate and the trust's first audit within the half-life, not on the political calendar.",
        "Step five, Forum Matrix (Desk 11): place disputes over the restructuring and the concession audit in a forum outside both the debtor's courts and the creditors' home courts, with an express waiver of immunity from execution over the pledged revenues. A forum that cannot reach the collateral leaves the clawback reserve without a remedy.",
        "Step six, Mission Readiness (Desk 15): read the stage gates, the clearances and the Dominum Index. Report the phase as computed. At the end of the drill that phase is Custodial Inversion, not Self-Reinforcing Dominium, and the report says so.",
      ],
      statutoryRule:
        "Rule 5.2-D: Any dispatch citing escrow must cite the released share, the tranches met and the freeze state together. A reading of zero released is not evidence that no milestone was met.",
    },
    {
      heading: H.failure,
      subheading: "Treasury Custody, Pledged Disputes and the Paper Covenant",
      paragraphs: [
        "Failure mode one: treasury custody. The finance ministry proposes to hold the swap proceeds in a ministry account and report on them quarterly. This is the Chad pattern in a new instrument. The countermeasure is the custody rule: the money is held by the trust, the conditions sit in the instrument, and the ministry cannot amend either alone.",
        "Failure mode two: pledging the dispute. The ministry pledges the concession revenues to the creditors before the audit of the awards has reported. If an award is later found void, the collateral is gone and the communities in the mining districts have been made parties to a debt they never accepted. The countermeasure is the tranche sequence: the concession revenues enter at Operational Commissioning, after the audit funded at Mobilisation and the consultations funded at Demarcation, and only when the Institutional-Relational bond holds.",
        "Failure mode three: the paper covenant. A second covenant is drafted to lift durability, and the analyst expects it to clear the trap. It lifts durability from 48.7 to 50.2 per cent and no further, because the covenant indicator saturates. The countermeasure is to move the bond the covenant was meant to protect.",
        "Failure mode four: releasing ahead of verification. Under pressure from the funders' disbursement calendar, the trust is asked to release Demarcation before the verifier is seated, on the ground that the Communal bond already stands above 3.0. The chain rule refuses: Demarcation is met only when Mobilisation is met. A programme released ahead of its verification capacity is the pattern of every overwhelmed first phase in the record.",
        "Failure mode five: reading the waterfall in isolation. The escrow reaches 100 per cent and the ministry announces that the restructuring has succeeded. The Dominum Index reads 68.7, Custodial Inversion. The countermeasure is the synthesis: the mission is characterised by the four readings together, and a fully released escrow over bonds just above the floor and an Elevated rupture reading is a mission still in custody, not one that sustains itself.",
        "The Liebig bottleneck in this drill is institutional. Every failure mode above is a way of moving money while the Institutional-Relational bond, the one bond that would make the money safe, stays where it was.",
      ],
      statutoryRule:
        "Rule 5.2-E: Collateral whose ownership is contested is pledged only after an independent audit has reported and only through a tranche that waits on the Institutional-Relational bond.",
    },
    {
      heading: H.instrument,
      subheading: "The Escrow Balance Bar Under Restructuring",
      paragraphs: [
        "Set the escrow cutaway to the opening position of the drill: verifier seated, Communal bond 3.2, Institutional-Relational bond 2.4, Intergenerational bond 3.1, survival 50 and rupture 38. The bar shows 40 released, 5 in the clawback reserve, 5 in the performance bond and 50 in tranches not met. Raise the Institutional-Relational bond to 3.4 and watch the release rise to 67; raise survival to 57 and watch both reserves discharge to a release of 100. Then raise the rupture to 60 and watch the whole gross move into the freeze. At every setting the segments sum to the pledge. The cutaway computes through the desk's own function and never publishes to the bus.",
      ],
      instrument: "escrow",
    },
  ],
  quiz: [
    {
      id: "q5-2-1",
      question: "With a verifier seated, the Communal bond at 3.2 and the Institutional-Relational bond at 2.4, what share of the pledge does the waterfall release?",
      options: [
        { id: "opt-a", text: "50 per cent", explanation: "Incorrect. 50 is the gross; before Final Cession the clawback and the performance bond are held back.", correct: false },
        { id: "opt-b", text: "40 per cent", explanation: "Correct. Gross 50, clawback 5, performance bond 5: \\(50 - 5 - 5 = 40\\).", correct: true },
        { id: "opt-c", text: "17.5 per cent", explanation: "Incorrect. Demarcation is also met, because the Communal bond stands above 3.0.", correct: false },
        { id: "opt-d", text: "67 per cent", explanation: "Incorrect. Operational Commissioning waits on the Institutional-Relational bond rising above 3.0.", correct: false },
      ],
    },
    {
      id: "q5-2-2",
      question: "With an exposure of 26 and a Rupture Index of 38, an insulating provision cuts the exposure to 6.5. What happens to the stability half-life?",
      options: [
        { id: "opt-a", text: "It rises from 21.7 days to 31.2 days.", explanation: "Correct. \\(\\lambda\\) falls from 0.032 to 0.02225 per day; the half-life rises from 21.7 to 31.2 days.", correct: true },
        { id: "opt-b", text: "It becomes infinite, because the shock is insulated.", explanation: "Incorrect. The rupture reading still drives decay.", correct: false },
        { id: "opt-c", text: "It quadruples, because only a quarter of the shock enters.", explanation: "Incorrect. The rupture term is unchanged and dominates the sum.", correct: false },
        { id: "opt-d", text: "It is unchanged.", explanation: "Incorrect. The exposure term of the decay constant falls.", correct: false },
      ],
    },
    {
      id: "q5-2-3",
      question: "Durability reads 48.7 per cent with one covenant. Which change clears the 55 per cent Succession Trap?",
      options: [
        { id: "opt-a", text: "A second covenant.", explanation: "Incorrect. A second covenant saturates the indicator and lifts durability only to 50.2 per cent.", correct: false },
        { id: "opt-b", text: "A third and fourth covenant.", explanation: "Incorrect. The covenant indicator saturates at two covenants.", correct: false },
        { id: "opt-c", text: "Lifting the Institutional-Relational bond to 3.4 with two covenants in force.", explanation: "Correct. Durability rises to 56.9 per cent and clears the trap.", correct: true },
        { id: "opt-d", text: "Releasing the full escrow.", explanation: "Incorrect. The escrow release does not enter succession durability.", correct: false },
      ],
    },
    {
      id: "q5-2-4",
      question: "At the end of the drill every tranche has released, the bonds read 3.4, 3.2, 3.1 and 3.4, durability is 56.9 and the Rupture Index is 38. What does Mission Readiness read?",
      options: [
        { id: "opt-a", text: "Self-Reinforcing Dominium, because every bond holds the floor.", explanation: "Incorrect. The index must also reach 75; it reads 68.7.", correct: false },
        { id: "opt-b", text: "Custodial Inversion at 68.7.", explanation: "Correct. \\(100 \\times (0.170625 + 0.25 + 0.14225 + 0.124) = 68.7\\), at least 60 and below 75.", correct: true },
        { id: "opt-c", text: "Fiduciary Anchor at 50.1.", explanation: "Incorrect. 50.1 is the reading at the opening position.", correct: false },
        { id: "opt-d", text: "Imperium-Bound, because the rupture reading is Elevated.", explanation: "Incorrect. Imperium-Bound is a reading below 40.", correct: false },
      ],
    },
  ],
};
