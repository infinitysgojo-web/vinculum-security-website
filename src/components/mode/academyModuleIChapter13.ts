import type { DetailedAcademyChapter } from "./academyTypes";
import { F_LIEBIG, F_MEAN, F_STATE_VECTOR } from "./academyFormulas";

export const CHAPTER_1_3: DetailedAcademyChapter = {
  id: "state-vector-liebig",
  number: "1.3",
  eyebrow: "Module I · Chapter 1.3",
  title: "The 4-Dimensional Relational State Vector & The Liebig Minimum",
  estimatedMinutes: 42,
  executiveLede: "International relations traditionally measures national strength and alliance durability through scalar aggregates such as gross domestic product, military warhead counts, or bilateral trade tonnage. This scalar reductionism conceals fatal systemic vulnerabilities within secondary relational sectors. The Vinculum Security Doctrine models bilateral relations as a 4-dimensional vector, demonstrating that systemic stability is strictly bounded by the weakest relational bond under Justus von Liebig Law of the Relational Minimum.",
  synopsis: [
    "A sovereign partnership with immense financial volume and military alignment will still suffer catastrophic rupture if its communal or intergenerational bonds fall below the statutory viability floor. Aggregation into a single scalar average is a dangerous analytical fallacy that masks latent fault lines.",
    "Carl Sprengel and Justus von Liebig formulated the Law of the Minimum in agricultural chemistry: biological crop yield is governed not by the total volume of nutrients present in the soil, but by the scarcest limiting factor. In relational statecraft, sovereign stability is similarly governed strictly by its minimum bond.",
    "This chapter defines the four canonical bond axes (Interpersonal, Communal, Intergenerational, and Institutional), derives the Liebig limiting constraint, analyzes the fatal collapse of imperial alliances, and formalizes the diagnostic pathology known as the Façade Syndrome.",
  ],
  statutoryNotice: "Statutory Invariant: A sovereign relationship is only as strong as its lowest relational bond. No surplus in secondary sectors can compensate for a primary bond breaching the statutory floor.",
  learningOutcomes: [
    "Map bilateral sovereign relations across the four canonical relational bond dimensions with mathematical rigor.",
    "Apply Justus von Liebig Law of the Relational Minimum to identify structural failure points in multilateral treaties.",
    "Diagnose the Façade Syndrome using the Chancellery Bond Radar when elite harmony masks communal decay.",
    "Calculate targeted minimum bond remediation investments required to lift an accord above the rupture threshold.",
  ],
  sections: [
    {
      heading: "I. The 4-Dimensional Relational Vector Architecture",
      subheading: "The Orthogonal Pillars of Sovereign Cohesion and the Fallacy of Scalar Aggregation",
      paragraphs: [
        "In classical realist diplomacy, state power and bilateral alliance health are routinely treated as scalar quantities: an aggregate score combining gross domestic product, defense expenditures, demographic mass, and bilateral trade volume. This scalar reductionism routinely blinds policymakers and intelligence analysts to imminent systemic collapse. Diplomatic history is replete with great powers and alliances whose aggregate economic and military metrics appeared impregnable right up to the moment of sudden, catastrophic disintegration.",
        "The Vinculum Security Doctrine replaces scalar metrics with a rigorous vector representation. A sovereign relationship between two entities is formalized as a four-dimensional vector \\(B = (B_{\\text{interpersonal}}, B_{\\text{communal}}, B_{\\text{intergenerational}}, B_{\\text{institutional}})\\), where each component is evaluated on a standardized scale from 1.0 to 5.0.",
        "These four axes are mutually non-substitutable. Each represents an autonomous domain of human and political reality. A catastrophic failure in one dimension cannot be repaired simply by expanding another: no volume of bilateral trade can compensate for deep-seated communal hatred, and no amount of personal rapport between heads of state can compensate for the total absence of formal institutional treaties.",
        "By evaluating bilateral relationships as vectors rather than scalars, the Chancellery apparatus prevents the artificial dilution of risk. An alliance with three fortified bonds at 4.8 and one collapsed bond at 1.4 does not possess an average health of 3.95; it possesses an operational load-bearing capacity of exactly 1.4.",
      ],
      caseStudy: {
        title: "The Structural Rupture of the Austro-Hungarian Dual Monarchy (1914-1918)",
        jurisdiction: "Central European Imperial Dual Monarchy",
        precedent: "Total institutional apparatus paired with complete communal and intergenerational alienation",
        analysis: [
          "On the eve of the First World War in 1914, the Austro-Hungarian Empire possessed formidable aggregate statistics: the second largest land area in Europe, the third largest population, and a sophisticated industrial manufacturing base centered in Bohemia and Upper Austria.",
          "However, its relational vector was profoundly asymmetrical. While its institutional legal apparatus and elite interpersonal treaties were highly developed (scoring above 4.2), the communal bond between its eleven distinct linguistic nationalities had decayed below the existential floor (collapsing below 1.8). The Slavic, Romanian, and Italian populations felt excluded from imperial governance.",
          "When the exogenous shock of world war struck, the imperial center could not command popular legitimacy. Whole regiments surrendered without firing a shot, domestic food distribution broke down, and by 1918 the empire dissolved completely into eleven separate successor states.",
          "The Austro-Hungarian catastrophe provides definitive proof that an advanced institutional superstructure built upon a collapsed communal foundation violates the Liebig minimum, guaranteeing systemic dissolution under operational stress.",
        ],
        failureMechanism: "An advanced institutional superstructure built upon a collapsed communal bond violated the Liebig minimum, leading to systemic structural dissolution under stress.",
      },
      subsections: [
        {
          title: "The Four Canonical Bond Dimensions Defined",
          paragraphs: [
            "1. Interpersonal Bond (\\(B_{\\text{interpersonal}}\\)): Measures the direct fiduciary rapport, mutual verification credibility, and crisis communication access between the sovereign heads of state, chief negotiators, and cabinet principals.",
            "2. Communal Bond (\\(B_{\\text{communal}}\\)): Evaluates the societal, cross-border, and civic resonance between the respective populations, including commercial trade, diaspora ties, and cultural affinity.",
            "3. Intergenerational Bond (\\(B_{\\text{intergenerational}}\\)): Measures whether covenants are structured to endure across political successions, ecological horizons, and demographic transitions without repudiation by youth cohorts.",
            "4. Institutional Bond (\\(B_{\\text{institutional}}\\)): Assesses formal treaties, joint regulatory commissions, arbitral seats, and technical standards that operate independently of transient political personalities.",
          ],
          callout: {
            kind: "bridge",
            title: "Bridge to Desk 01: The Bond Radar",
            paragraphs: [
              "Desk 01 renders the live four-bond vector on an interactive radar display, instantly calculating the limiting bond score, the distance to the 3.0 statutory floor, and the presence of the Façade Syndrome.",
            ],
          },
        },
      ],
      statutoryRule: "Rule 1.3-A: Every bilateral mission assessment must score all four canonical bonds independently; aggregation into a single scalar average without reporting the minimum bond is strictly prohibited.",
    },
    {
      heading: "II. Justus von Liebig Law of the Relational Minimum",
      subheading: "Mathematical Formalization of Limiting Capacity",
      paragraphs: [
        "In 1840, agricultural chemist Justus von Liebig popularized the biological discovery that plant growth is governed not by the total nutrients available in the soil, but by the nutrient in shortest supply. A agricultural field abundantly supplied with nitrogen, phosphorus, and potassium will produce zero harvest if boron or zinc is entirely absent.",
        "In the Vinculum Security Doctrine, this biological principle is formalized as a fundamental law of sovereign statecraft. The operational load-bearing capacity of an alliance or treaty is strictly bounded by the minimum component of its relational vector: \\(B_{\\min} = \\min(B_1, B_2, B_3, B_4)\\).",
        "If any single bond drops below the statutory viable floor of 3.0, the entire relationship enters the Vulnerable or Rupture band, regardless of how high the remaining three bonds are scored. The system cannot bear additional geopolitical loads without immediate risk of structural failure.",
      ],
      caseStudy: {
        title: "The Structural Collapse of the Pahlavi Dynasty (1979)",
        jurisdiction: "Middle Eastern Sovereign Monarchical State",
        precedent: "Massive institutional and military alignment with foreign superpowers masking total domestic communal rupture",
        analysis: [
          "Throughout the 1970s, Imperial Iran was regarded by Western strategists as the unshakeable pillar of stability in the Persian Gulf. Iran possessed the world fifth-largest military, billions of dollars in oil revenues, and deep institutional defense treaties with Western powers.",
          "However, the regime relational vector suffered from fatal asymmetry. While institutional treaties (4.6) and interpersonal monarchical diplomacy (4.8) were exceptionally high, the internal communal bond between the ruling elite and traditional societal institutions had collapsed to 1.4, exacerbated by severe intergenerational alienation among university youth.",
          "When domestic demonstrations erupted in 1978, the regime vast military arsenals and international defense pacts were completely irrelevant. The military leadership refused to fire upon civilian populations, and the imperial state collapsed within months, replaced by an adversarial revolutionary regime.",
        ],
        failureMechanism: "Relying on external institutional and military bonds to compensate for a collapsed domestic communal bond violated the Liebig minimum, guaranteeing sudden systemic collapse.",
      },
      subsections: [
        {
          title: "The Mechanics of Load Concentration on the Weakest Axis",
          paragraphs: [
            "When geopolitical pressure strikes a bilateral accord, the stress does not distribute evenly across all sectors. It migrates naturally to the weakest link.",
            "If two states share deep institutional treaties and trade agreements (bonds at 4.5), but public communal sentiment between their populations has decayed to 1.8 due to inflammatory political rhetoric, any minor economic dispute will immediately be weaponized by domestic factions.",
            "The weak communal bond snaps first, triggering protests that paralyze politicians and force the cancellation of otherwise sound institutional treaties.",
          ],
          callout: {
            kind: "definition",
            title: "The Relational Minimum Invariant",
            paragraphs: [
              "The structural integrity of an international covenant \\(\\Psi\\) under external load \\(L\\) is governed by \\(\\Psi(L) \\le f(B_{\\min})\\). No expansion of \\(B_j\\) where \\(j \\ne \\arg\\min(B)\\) can increase \\(\\Psi(L)\\).",
            ],
          },
        },
      ],
      statutoryRule: "Rule 1.3-B: A relationship in which the limiting bond score is less than or equal to 3.0 is legally classified as an At-Risk Covenant, requiring mandatory remediation before new obligations can be assumed.",
    },
    {
      heading: "III. The Façade Syndrome: Diagnostic Pathology",
      subheading: "Distinguishing Surface Rhetoric from Structural Integrity",
      paragraphs: [
        "The Chancellery defines the Façade Syndrome as a strategic pathology where sovereign leaders create an illusion of bilateral harmony by signing elaborate public communiqués while ignoring decaying communal or security foundations.",
        "This syndrome is common in authoritarian partnerships or asymmetrical client-state arrangements. Heads of state sign multi-billion dollar memorandums of understanding, but border communities remain hostile, trade barriers persist, and intelligence agencies engage in mutual espionage.",
        "When an exogenous shock exposes the façade, collapse is sudden and total. The Chancellery Bond Radar detects this pathology automatically by calculating the divergence between the maximum and minimum bond scores: if \\(B_{\\max} - B_{\\min} > 2.0\\), the system flags an Acute Façade Warning.",
      ],
      subsections: [
        {
          title: "The Mathematical Mechanics of Façade Detection",
          paragraphs: [
            "On Desk 01, the system computes the population variance \\(\\sigma^2\\) across the four bond scores alongside the peak-to-trough divergence \\(\\Delta B = B_{\\max} - B_{\\min}\\).",
            "When \\(\\sigma^2 > 1.25\\) and \\(\\Delta B > 2.0\\), the software locks the Mission Stage Gate 1, preventing the operator from certifying the mission vector until a remediation protocol is scheduled.",
          ],
        },
      ],
      statutoryRule: "Rule 1.3-C: When Façade Divergence exceeds 2.0, the mission must immediately flag an Acute Façade Warning and freeze upstream treaty ratifications.",
    },
    {
      heading: "IV. The Economics of Targeted Remediation",
      subheading: "Optimizing Diplomatic Investment on the Limiting Constraint",
      paragraphs: [
        "Understanding Liebig Law of the Minimum revolutionizes foreign aid, diplomatic staffing, and mediation budgets.",
        "Pouring millions of dollars into cultural exchanges (communal bond) when the limiting factor is unaddressed cross-border customs corruption (institutional bond) yields zero improvement in systemic resilience.",
        "The Chancellery apparatus instructs operators to direct 100 per cent of discretionary diplomatic capital toward lifting the single limiting bond above the 3.0 floor. Once the limiting bond is stabilized, the entire system experiences an immediate lift in structural capacity.",
      ],
      subsections: [
        {
          title: "The Law of Diminishing Returns on Saturated Bonds",
          paragraphs: [
            "Investing diplomatic resources into a bond that already scores above 4.2 produces negligible marginal returns for systemic security.",
            "A relationship with an institutional score of 4.5 and a communal score of 2.1 will gain vastly more resilience from lifting the communal score to 3.1 than from attempting to push the institutional score to 4.9.",
          ],
        },
      ],
      statutoryRule: "Rule 1.3-D: Discretionary diplomatic development assistance must be prioritized strictly toward the limiting bond until it reaches the 3.0 viability floor.",
    },
  ],
  practice: [
    {
      problem: "A bilateral security partnership exhibits the following bond profile: \\(B_{\\text{interpersonal}} = 4.6\\), \\(B_{\\text{communal}} = 1.9\\), \\(B_{\\text{intergenerational}} = 3.2\\), and \\(B_{\\text{institutional}} = 4.4\\). Calculate the Liebig minimum score, determine whether the relationship holds the statutory floor, and identify the required diplomatic intervention.",
      solution: [
        "Step 1: Identify the Liebig minimum. The vector components are (4.6, 1.9, 3.2, 4.4). The minimum is \\(B_{\\min} = 1.9\\).",
        "Step 2: Evaluate the statutory floor. The statutory floor is 3.0. Because 1.9 is less than 3.0, the relationship breaches the viable floor.",
        "Step 3: Evaluate Façade divergence. \\(B_{\\max} - B_{\\min} = 4.6 - 1.9 = 2.7\\). Because 2.7 exceeds 2.0, the system is in an Acute Façade Syndrome condition.",
        "Step 4: Prescribe intervention. All diplomatic capital must be redirected away from top-level summits toward repairing the communal bond: easing border crossing visa restrictions, establishing joint educational and municipal partnerships, and countering cross-border disinformation.",
      ],
    },
    {
      problem: "An international consortium is evaluating a cross-border energy pipeline treaty. The financial models show a projected 18 per cent internal rate of return, but the Intergenerational Bond scores 2.2 due to unresolved environmental compensation agreements with indigenous youth councils. Why will this project fail without remediation?",
      solution: [
        "Step 1: Apply the Liebig Law of the Relational Minimum. High financial returns cannot substitute for an intergenerational bond below the 3.0 statutory floor.",
        "Step 2: Trace the failure mechanism. As soon as the pipeline begins operations, unaddressed environmental grievances will mobilize youth protests, legal blockades, and infrastructure sabotage.",
        "Step 3: Prescribe Chancellery remedy. Allocate 2.5 per cent of pipeline transit revenues into an autonomous youth environmental stewardship escrow fund, raising the Intergenerational Bond above 3.5 before commencing construction.",
      ],
    },
  ],
  quiz: [
    {
      id: "q1-3-1",
      question: "According to Liebig Law of the Minimum in relational statecraft, what determines the overall load-bearing capacity of a sovereign alliance?",
      options: [
        {
          id: "opt-a",
          text: "The mathematical average of all four relational bonds.",
          explanation: "Incorrect. Taking the average hides catastrophic vulnerabilities on individual axes.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "The strength of the single lowest relational bond in the state vector.",
          explanation: "Correct. Systemic capacity is strictly limited by the weakest component; a surplus elsewhere cannot prevent rupture at the limiting point.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "The total gross domestic product of the participating states.",
          explanation: "Incorrect. Economic scale is a scalar resource, not a measure of relational vector integrity.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "The number of military warheads deployed along the frontier.",
          explanation: "Incorrect. Excessive military deployment often suppresses communal and intergenerational bonds.",
          correct: false,
        },
      ],
    },
    {
      id: "q1-3-2",
      question: "What diagnostic condition triggers an 'Acute Façade Warning' on the Chancellery Bond Radar?",
      options: [
        {
          id: "opt-a",
          text: "When all four bonds score exactly 3.0.",
          explanation: "Incorrect. An even score of 3.0 represents a balanced baseline, not an artificial façade.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "When the divergence between the maximum bond and the minimum bond exceeds 2.0.",
          explanation: "Correct. A spread greater than 2.0 indicates an artificial elite façade masking severe latent decay in underlying sectors.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "When a treaty is signed during an election year.",
          explanation: "Incorrect. Political timing is tracked on Desk 12, not on the Bond Radar.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "When the communal bond exceeds the institutional bond.",
          explanation: "Incorrect. Strong communal affinity is positive; danger arises when underlying bonds collapse while surface metrics are high.",
          correct: false,
        },
      ],
    },
    {
      id: "q1-3-3",
      question: "Why does investing diplomatic resources into an already saturated bond (score > 4.2) yield negligible security improvements?",
      options: [
        {
          id: "opt-a",
          text: "Because international law prohibits bond scores from exceeding 5.0.",
          explanation: "Incorrect. While 5.0 is the upper scale bound, the issue is diminishing marginal utility while limiting bottlenecks remain unaddressed.",
          correct: false,
        },
        {
          id: "opt-b",
          text: "Because under the Liebig Minimum, systemic capacity is bounded strictly by the weakest bond, making additional gains on strong bonds non-load-bearing.",
          explanation: "Correct. Expanding an already strong bond does nothing to prevent rupture at the limiting bottleneck.",
          correct: true,
        },
        {
          id: "opt-c",
          text: "Because diplomats lose interest in projects once they become successful.",
          explanation: "Incorrect. Professional incentives often favor over-investing in easy, successful sectors rather than tackling hard bottlenecks.",
          correct: false,
        },
        {
          id: "opt-d",
          text: "Because saturated bonds trigger automated sanctions.",
          explanation: "Incorrect. No desk penalizes high bond scores.",
          correct: false,
        },
      ],
    },
  ],
  readingList: [
    {
      citation: "Liebig, J. von (1840). 'Die organische Chemie in ihrer Anwendung auf Agricultur und Physiologie.' Friedrich Vieweg und Sohn, Braunschweig.",
      note: "The original scientific treatise formulating the Law of the Minimum in biological systems.",
    },
    {
      citation: "Jaszi, O. (1929). 'The Dissolution of the Habsburg Monarchy.' University of Chicago Press.",
      note: "Definitive historical post-mortem demonstrating how advanced institutional cohesion failed to withstand communal collapse.",
    },
    {
      citation: "Skocpol, T. (1979). 'States and Social Revolutions: A Comparative Analysis of France, Russia, and China.' Cambridge University Press.",
      note: "Foundational structural analysis of state collapse when institutional superstructures detach from domestic societal legitimacy.",
    },
    {
      citation: "Vinculum Security Doctrine (2026). 'Vector Topology and the Liebig Limit in Multilateral Statecraft.' Chancellery Working Papers Series.",
      note: "Mathematical formalization of the 4-dimensional state vector, the Façade Syndrome, and targeted remediation algorithms.",
    },
  ],
};
