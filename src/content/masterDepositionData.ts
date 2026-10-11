/**
 * Canonical Master Deposition for Vinculum Security.
 * Statutorily Protected Intellectual Property · James Wesley Ndua
 */

export interface DepositionVolume {
  volume: string;
  title: string;
  eyebrow: string;
  sections: { heading: string; body: string[] }[];
}

export const MASTER_DEPOSITION: DepositionVolume[] = [
  {
    volume: "VOLUME I",
    title: "FOUNDATIONS OF RELATIONAL SECURITY & STATUTORY EXECUTIVE WARRANT",
    eyebrow: "Epistemological Architecture & Doctrine",
    sections: [
      {
        heading: "1.1 STATUTORY JURISDICTION AND EXECUTIVE WARRANT",
        body: [
          "This Master Architectural and Operational Deposition establishes the binding theoretical, mathematical, and field procedures governing the Doctrine of Relational Security and the operation of the Vinculum Dashboard.",
          "Originated and formulated by James Wesley Ndua (Nairobi, Kenya), this corpus represents an original scientific and diplomatic work protected under international statutory copyright law, the Berne Convention for the Protection of Literary and Artistic Works, and all applicable national intellectual property enactments. All statutory rights are strictly reserved.",
          "The doctrine replaces subjective diplomatic intuition and linguistic optimism with Deterministic Relational Law (Lex Relationalis Determinata). In sovereign mediation, treaty durability is deterministically governed by physical and social relational thresholds, not diplomatic consensus or verbal nominalism.",
        ],
      },
      {
        heading: "1.2 THE FOUR-BOND TOPOLOGICAL CONTINUUM",
        body: [
          "The Vinculum System models conflict and reconciliation across four interdependent relational dimensions:",
          "1. Inter-Political Bond (B_IP): The structural equilibrium and power-distribution integrity between sovereign elites, executive leaderships, and warring factions.",
          "2. Communal Bond (B_COM): The grassroots inter-ethnic, inter-religious, and territorial social capital between populations bearing the direct physical impact of conflict.",
          "3. Intergenerational Bond (B_IG): The transmission of historical memory, collective trauma, educational narratives, and generational grievance or reconciliation.",
          "4. Institutional / Inter-Regional Bond (B_IR): The enforceable legal, judicial, security-sector, and cross-border geopolitical architecture upholding the settlement.",
          "Every bond is scored on a continuous scale from 1.00 (Total Fracture) to 5.00 (Harmonic Equilibrium). The system enforces a strict Viable Floor (V_floor = 3.00). Any bond falling below 3.00 indicates systemic decay; any bond at or below 2.00 represents active structural failure.",
        ],
      },
      {
        heading: "1.3 LIEBIG'S LAW OF RELATIONAL CAPACITY",
        body: [
          "Borrowed from agronomy and formalized for statecraft: An agricultural crop's yield is limited not by the total resources available, but by the scarcest nutrient. Similarly, the durability of any peace settlement, sovereign covenant, or constitutional order is strictly bounded by its weakest relational bond.",
          "Liebig Formalism: B_cap = min(B_IP, B_COM, B_IG, B_IR).",
          "No surplus of goodwill, ministerial signatures, or foreign financial subsidies in the Inter-Political sphere can compensate for an acute deficit in the Communal or Intergenerational spheres. If the weakest bond fails, the entire treaty structure collapses along that exact fault line.",
        ],
      },
    ],
  },
  {
    volume: "VOLUME II",
    title: "MATHEMATICAL FORMALISMS, ENGINE EQUATIONS & RELATIONAL DYNAMICS",
    eyebrow: "Deterministic Engine Proofs",
    sections: [
      {
        heading: "2.1 PRIMARY VECTOR AND MOMENTS DERIVATIONS",
        body: [
          "Let B = [B_IP, B_COM, B_IG, B_IR] represent the systemic bond vector.",
          "1. Composite Bond Mean (mu_B): The arithmetic mean across all four dimensions: mu_B = (B_IP + B_COM + B_IG + B_IR) / 4.",
          "2. Relational Asymmetry Variance (sigma_B^2): Measures the internal tension and polarization between tracks: sigma_B^2 = (1/4) * sum_{i=1}^4 (B_i - mu_B)^2.",
          "3. High Variance Warning: When sigma_B^2 > 0.64, the system detects severe structural strain, typically manifesting as an elite-level agreement disconnected from communal reality.",
        ],
      },
      {
        heading: "2.2 THE FOUR ADVANCED RELATIONAL DYNAMICS",
        body: [
          "The engine continuously computes four advanced non-linear relational dynamics to expose latent vulnerabilities:",
          "A. Relational Deficit (Delta_rel): Delta_rel = sum_{i=1}^4 max(0, 3.00 - B_i). Measures cumulative distance beneath the viability threshold. Normalized against the maximum possible deficit of 8.00. Severity Bands: Balanced (< 25%), Elevated (25% - 49%), Critical (>= 50%).",
          "B. Shannon Relational Entropy (H): Computed over normalized bond weights: p_i = B_i / sum(B). H = -sum_{i=1}^4 (p_i * ln(p_i)) / ln(4). Relational Entropy Index: S_rel = H * tau * (Delta_rel / 8), where tau represents the temporal crisis multiplier.",
          "C. Relational Contagion (C_rel): Quantifies cross-elasticity leakage from a failing bond into adjacent domains: C_rel = 100 * (sigma_B / 2) * (1 + 0.15*n_shocks) * (1 + 0.10*n_friction) * (1 + R / 100) / 4.6 * (1 + Delta_rel / 8). Capped at 100. Contagion >= 75% triggers an immediate mandate freeze until firebreak protocols are executed.",
          "D. Acute vs Systemic Decay (Omega): Evaluates the qualitative vector of decay: Omega = H * (k_failing / 4). Classified into: None (Omega = 0), Acute (single localized shock), Mixed, or Systemic (multi-bond systemic collapse requiring structural constitutional renegotiation).",
        ],
      },
      {
        heading: "2.3 RUPTURE INDEX (R) & ELITE-PACT MIRAGE",
        body: [
          "The Rupture Index (R, scale 0 to 100) models early-warning systemic strain from twenty-four weighted indicators across the four dimensions:",
          "R = min(100, (sum_{j=1}^{24} w_j * I_j * trend_j) * tau).",
          "Elite-Pact Mirage Detection: Occurs when Track I political leadership reaches an apparent agreement while communal and intergenerational tracks remain critically alienated:",
          "Condition: B_IP >= 3.50 AND B_COM <= 2.20. When triggered, the system voids any certification of stability, identifying the instrument as an ephemeral elite arrangement destined for violent collapse upon leadership transition.",
        ],
      },
    ],
  },
  {
    volume: "VOLUME III",
    title: "THE MISSIONENGINE SIGNAL BUS & THE 18-DESK OPERATIONAL REGISTRY",
    eyebrow: "Sovereign Architecture & Desk Directory",
    sections: [
      {
        heading: "3.1 ZERO-CLOUD SOVEREIGN RUNTIME ARCHITECTURE",
        body: [
          "The operational core of the Vinculum System is the MissionEngine: a deterministic, zero-dependency, browser-local state bus.",
          "State Isolation: All calculations, mission parameters, counterpart leverage profiles, and sensitive telemetry execute exclusively inside volatile browser memory. Zero external network requests, zero telemetry tracking, and zero cloud storage.",
          "Cryptographic Proof of Audit: Every exported dossier, treaty clause, and readiness certification is stamped with a client-side SHA-256 hash, verifying exact tamper-evident lineage without compromising sovereign privilege.",
        ],
      },
      {
        heading: "3.2 DIRECTORY OF THE 18 OPERATIONAL DESKS",
        body: [
          "DIVISION I: ASSESSMENT & EARLY WARNING",
          "• Desk 01 (Bond Diagnostic): 4D vector profiling and Liebig bottleneck identification.",
          "• Desk 02 (Sentinel Matrix): 24-indicator early warning tripwire matrix across deteriorating trends.",
          "• Desk 03 (Compound Shock Tester): Simulates simultaneous stress across economic, political, and ecological axes.",
          "• Desk 04 (Comparative Mirror): Distance-normalized pattern matching against historical peace accords.",
          "",
          "DIVISION II: DIPLOMATIC ENGAGEMENT & COUNTERPART RELATIONS",
          "• Desk 05 (Relational Atlas): Topological mapping of interpersonal leverage and grievances across factions.",
          "• Desk 06 (Multi-Party Sequencer): Optimizes bilateral and multilateral consultation sequencing.",
          "• Desk 07 (Counterpart Prompter & Cable Composer): Structured tactical briefing generators for mediation teams.",
          "• Desk 08 (Kinematic Track Sequencer): Enforces kinematic synchronization between Track I and Track II diplomacy.",
          "",
          "DIVISION III: LEGAL & STRUCTURAL ARCHITECTURE",
          "• Desk 09 (Litigation Workbench): Translates relational obligations into defensible legal and arbitration postures.",
          "• Desk 10 (Clause Architect): Drafts non-fungible covenants linked to physical bond-integrity conditions.",
          "• Desk 11 (Clause Redliner): Adversarial audit of draft treaties to expose optical evasions and off-ramps.",
          "• Desk 12 (Succession Simulator): Mathematical verification of treaty durability across leadership transitions.",
          "",
          "DIVISION IV: MISSION GOVERNANCE & VERIFICATION",
          "• Desk 13 (Readiness Desk): Enforces the 20 Stage-Gates—no delegation advances without verified metrics.",
          "• Desk 14 (Mission Binder): Dynamic aggregation of all operational desk outputs into a sealed master file.",
          "• Desk 15 (Handover Protocol): Structured transition workflows for successor envoys and sovereign chanceries.",
          "• Desk 16 (Verification Ledger): Continuous compliance tracking against signed covenants with automated breach triggers.",
          "• Desk 17 (Chancellery Breviary): Tactical operational manual and doctrinal reference under field conditions.",
          "• Desk 18 (Mission State Vault): Tamper-evident archival custody of mission parameters under zero-cloud integrity.",
        ],
      },
    ],
  },
  {
    volume: "VOLUME IV",
    title: "THE 20 READINESS GATES FORMAL SPECIFICATION",
    eyebrow: "Stage-Gate Verification Protocol",
    sections: [
      {
        heading: "4.1 ENFORCEMENT PHILOSOPHY OF STAGE-GATES",
        body: [
          "In conventional diplomacy, negotiations advance based on political calendars, funding cycles, or press optics. Under Deterministic Relational Law, advance is strictly conditional upon passing twenty binary readiness gates (G_01 through G_20).",
          "If any single mandatory gate is unresolved (G_i = 0), the MissionEngine executes an automated lock, preventing diplomatic teams from proceeding to formal treaty execution.",
        ],
      },
      {
        heading: "4.2 COMPLETE REGISTRY OF THE 20 READINESS GATES",
        body: [
          "• Gate 01 (Assessment Floor): All four bonds must exceed the viable floor (min(B) >= 3.00).",
          "• Gate 02 (Variance Clearance): Relational asymmetry variance sigma_B^2 must remain below 0.64.",
          "• Gate 03 (Rupture Ceasefire): Sentinel rupture index R must remain below 45.00 points.",
          "• Gate 04 (Shock Survival): The agreement must survive three concurrent simulated shocks without any bond breaching <= 2.00.",
          "• Gate 05 (Historical Precedent Audit): Comparative pattern matching must resolve known historical failure modes.",
          "• Gate 06 (Counterpart Verification): Primary political principals must be individually audited for authority and bad-faith off-ramps.",
          "• Gate 07 (Multi-Party Deconfliction): Bilateral sequencing friction across all factions must be formally cleared.",
          "• Gate 08 (Track Synchronization): Kinematic delta between Track I and Track II must not exceed 0.80 bond units.",
          "• Gate 09 (Stakeholder Field Audit): 100% of affected communal factions must be surveyed and validated.",
          "• Gate 10 (Objective Verification Benchmarks): All treaty covenants must be tied to measurable physical indices.",
          "• Gate 11 (Breach Definition Clarity): Explicit, non-subjective breach conditions must be codified in treaty text.",
          "• Gate 12 (Dispute Escalation Ladder): A 3-tier sovereign arbitration mechanism must be formally seated.",
          "• Gate 13 (Institutional Office Continuity): Provisions must bind institutional offices rather than individual signatories.",
          "• Gate 14 (Generational Succession Floor): Succession Durability (S_dur) must equal or exceed 70.00%.",
          "• Gate 15 (Anti-Theatrics Redline Clearance): Textual redliner audit must confirm zero optical evasions or non-binding declarations.",
          "• Gate 16 (Independent Monitor Mandate): Third-party verification council must possess unhindered inspection access.",
          "• Gate 17 (Independent Funding Guarantee): Verification budget must be held in an escrow structure independent of signatories.",
          "• Gate 18 (Local Rootedness Index): Handover Viability (H_viab) must exceed 65.00% prior to external delegation drawdown.",
          "• Gate 19 (Chancellery Protocol Conformance): Full operational dossier must pass compliance with the Breviary.",
          "• Gate 20 (Cryptographic State Seal): The final mission state must be cryptographically hashed and sealed with SHA-256.",
        ],
      },
    ],
  },
  {
    volume: "VOLUME V",
    title: "HISTORICAL CALIBRATIONS & CANONICAL FIELD DOSSIERS",
    eyebrow: "Empirical Case Validations",
    sections: [
      {
        heading: "5.1 THE MARA-SERENGETI CROSS-BORDER PASTORALIST CORRIDOR",
        body: [
          "Historical Baseline: Persistent seasonal rangeland conflict between Maasai pastoralist communities, wildlife conservancies, and cross-border agrarian settlements along the Kenya-Tanzania border.",
          "Initial Calibration: B = [3.20, 1.80, 2.40, 3.60]. Liebig Minimum: B_COM = 1.80 (Critical Failing).",
          "Diagnosis: A classic Elite-Pact Mirage. National conservation treaties and inter-state cross-border policing (B_IR = 3.60) operated smoothly at ministerial levels, while communal grazing access and customary livestock corridors (B_COM = 1.80) remained severely fractured.",
          "Operational Intervention: Enforced Track II pastoralist council treaties, water-point co-management covenants, and customary boundary arbitration. Revised equilibrium raised B_COM to 3.40, stabilizing the corridor without external militarization.",
        ],
      },
      {
        heading: "5.2 THE KARAMOJA CLUSTER DISARMAMENT & SECURITY MATRIX",
        body: [
          "Historical Baseline: Cross-border cattle rustling, small arms proliferation, and inter-clan raids across Uganda, Kenya, and South Sudan (Karamojong, Pokot, Turkana, Toposa).",
          "Initial Calibration: B = [2.10, 1.40, 1.90, 2.30]. Relational Deficit: 68.75% (Critical). Contagion: 84.20% (Systemic Lock).",
          "Diagnosis: Multi-dimensional systemic decay. Disarmament campaigns led by central security forces produced temporary suppression but accelerated communal mistrust and retaliatory cross-border raids.",
          "Operational Intervention: Implementation of inter-community grazing agreements, shared watering points, kraal elder council verification, and synchronized cross-border development covenants. Systemic contagion reduced from 84.20% to 29.50%.",
        ],
      },
      {
        heading: "5.3 THE 2008 KENYA NATIONAL ACCORD & RECONCILIATION ACT",
        body: [
          "Historical Baseline: Severe post-election crisis in 2007–2008 threatening total state collapse.",
          "Initial Calibration: B_IP = 1.60, B_COM = 1.20, B_IG = 2.10, B_IR = 3.80. Rupture Index: R = 92.40 (Critical Emergency).",
          "Analysis: The National Accord created a grand coalition power-sharing executive (raising B_IP to 3.80 within 90 days). However, because underlying land grievances and institutional reforms remained unaddressed for several years, Communal tolerance lagged behind.",
          "Long-term Durability: Only through the comprehensive 2010 Constitutional overhaul (devolution, judicial independence, reformed electoral system) was Succession Durability permanently raised above 72.00%, confirming the predictive accuracy of the Succession Simulator.",
        ],
      },
    ],
  },
  {
    volume: "VOLUME VI",
    title: "HAND-CALCULATED BENCHMARK SCENARIO, LEXICON & STATUTORY ATTESTATION",
    eyebrow: "Verification Proofs & Legal Attestation",
    sections: [
      {
        heading: "6.1 END-TO-END BENCHMARK DERIVATION",
        body: [
          "Scenario Parameters: Live theatre with inputs: B_IP = 3.80, B_COM = 1.40, B_IG = 3.10, B_IR = 2.20. Number of active shocks: 2. Inter-party friction: 3. Rupture indicators active: 14 (R = 57.00).",
          "Mathematical Derivations:",
          "1. Liebig Bottleneck: min(B) = B_COM = 1.40 (Failing Floor Breach).",
          "2. Composite Mean: mu_B = (3.80 + 1.40 + 3.10 + 2.20) / 4 = 2.625.",
          "3. Relational Asymmetry Variance: sigma_B^2 = 0.817 (Exceeds 0.64 critical threshold).",
          "4. Elite-Pact Mirage: B_IP (3.80) >= 3.50 AND B_COM (1.40) <= 2.20 -> TRIGGERED. The agreement is certified as an ungrounded political illusion.",
          "5. Relational Deficit: Delta_rel = max(0, 3-3.8) + max(0, 3-1.4) + max(0, 3-3.1) + max(0, 3-2.2) = 0 + 1.6 + 0 + 0.8 = 2.40 / 8.00 = 30.00% (Elevated Deficit).",
          "6. Succession Durability: S_dur = 41.88% (Terminal Succession Trap). Gate Clearance: 5 of 5 core gates locked. The MissionEngine orders an immediate operational halt.",
        ],
      },
      {
        heading: "6.2 FORMAL STATUTORY COPYRIGHT ATTESTATION",
        body: [
          "This Master Architectural and Operational Deposition is the proprietary intellectual property of James Wesley Ndua (Nairobi, Kenya).",
          "Protected by statutory copyright under national and international law, the Berne Convention for the Protection of Literary and Artistic Works, and all applicable bilateral intellectual property treaties. All statutory rights reserved.",
          "No unauthorized reproduction, digital distribution, automated model ingestion, AI training extraction, or reverse engineering of the mathematical formulas is permitted without express written covenant executed with the Originator.",
          "Formulated and sealed in Nairobi, Kenya. Pro Omni Humanitate.",
        ],
      },
    ],
  },
];
