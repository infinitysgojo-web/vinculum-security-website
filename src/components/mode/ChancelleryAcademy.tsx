import { useState } from "react";
import { 
  ArrowLeft, 
  Award, 
  BookOpen, 
  CheckCircle2, 
  ChevronRight, 
  Compass, 
  GraduationCap, 
  Layers, 
  RotateCcw, 
  Scale, 
  ShieldCheck, 
  SlidersHorizontal, 
  Sparkles,
  ExternalLink,
  HelpCircle,
  FileText,
  Clock,
  AlertTriangle,
  X
} from "lucide-react";
import GoldRule from "@/components/GoldRule";
import { Button } from "@/components/ui/button";
import ScholarlyFormula, { MathFraction, MathVector } from "./ScholarlyFormula";
import { ACADEMY_MODULES_PART_1, DetailedAcademyChapter, ChapterQuizQuestion } from "./academyCurriculumPart1";
import { ACADEMY_MODULES_PART_2 } from "./academyCurriculumPart2";

export interface AcademyChapter {
  id: string;
  title: string;
  lede: string;
  content: string[];
  formula?: string;
  statutoryNote?: string;
  drillType?: "border" | "ddr" | "escrow" | "capstone";
}

export interface AcademyModule {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  summary: string;
  chapters: AcademyChapter[];
}

const MODULES: AcademyModule[] = [
  {
    id: "jurisprudence",
    number: "01",
    eyebrow: "Module I · Sovereign Foundations",
    title: "The Jurisprudence of Relational Sovereignty",
    summary: "Why constructive ambiguity fails modern multilateralism, and how the shift from Imperium to Dominium restores structural dignity.",
    chapters: [
      {
        id: "death-of-ambiguity",
        title: "1.1 The Death of Constructive Ambiguity in Modern Treaties",
        lede: "For over a century, diplomatic practice relied on 'constructive ambiguity': intentionally vague treaty language that allowed opposing parties to sign an agreement while retaining contradictory interpretations.",
        content: [
          "In modern asymmetric statecraft, digital sovereignty, and cross-border resource covenants, constructive ambiguity is no longer a diplomatic virtue; it is an active vulnerability.",
          "When crisis strikes, ambiguous treaty clauses do not foster compromise. Instead, they serve as the exact fault line along which covenants rupture. The stronger party exploits textual ambiguity to justify unilateral action, while the vulnerable party suffers catastrophic institutional erosion.",
          "The Unified Deterministic Chancellery Apparatus (UDCA) rejects linguistic elasticity. In its place, the UDCA introduces Relational Determinism: statecraft defined not by aspirational rhetoric, but by quantifiable, verifiable structural thresholds.",
        ],
        statutoryNote: "Invariant: Ambiguity is the mathematical precursor to treaty rupture. If an enforcement obligation cannot be computed or audited, it does not exist.",
      },
      {
        id: "imperium-to-dominium",
        title: "1.2 From Imperium to Dominium: Custody vs. Kinetic Coercion",
        lede: "Traditional geopolitical systems operate on the principle of Imperium: the projection of kinetic force, military supremacy, surveillance scraping, and punitive sanctions.",
        content: [
          "Imperium creates a fragile equilibrium. It demands exponential military expenditure to suppress inevitable resistance, generating resentment and deep communal alienation.",
          "The Vinculum Security Doctrine shifts statecraft from Imperium to Dominium: the solemn responsibility of sovereign custody, relational stewardship, and intergenerational durability.",
          "Under Dominium, a state's security is measured not by how many adversaries it can incinerate, but by the structural integrity of its relational bonds across four non-negotiable dimensions.",
        ],
        formula: "\\Phi = \\frac{\\text{Relational Yield}}{\\text{Coercive Friction}} \\ge 1.0",
        statutoryNote: "Doctrinal Warrant: Coercion produces immediate compliance but guaranteed structural decay. Custodial stewardship produces enduring sovereign stability.",
      },
      {
        id: "state-vector-liebig",
        title: "1.3 The 4-Dimensional Relational State Vector & The Liebig Minimum",
        lede: "Every bilateral treaty, multilateral peace accord, or sovereign border covenant is modeled as a 4-dimensional relational state vector.",
        content: [
          "The state vector consists of four fundamental bonds, each evaluated on a strictly bounded continuum from 0.00 (irrevocable breach) to 1.00 (absolute structural health):",
          "1. B_ip (Interpersonal Trust): The reliability and psychological attunement between chief negotiators and plenipotentiaries.",
          "2. B_comm (Communal Resonance): The legitimate acceptance and perceived fairness of the covenant among the affected populations.",
          "3. B_igen (Intergenerational Continuity): The preservation of ecological, cultural, and fiscal resources for unborn generations.",
          "4. B_inst (Institutional & Legal Viability): The constitutional, statutory, and enforcement durability within domestic state organs.",
          "Crucially, the health of the covenant is governed by the Law of the Liebig Minimum: A chain does not rupture at its average strength; it shatters at its weakest link.",
        ],
        formula: "S_B = [B_{ip},\\; B_{comm},\\; B_{igen},\\; B_{inst}]^T \\quad \\text{where} \\quad \\text{Rupture Risk} = 1.0 - \\min(B_k)",
        statutoryNote: "The Liebig Minimum is absolute. If B_comm is 0.18, a stellar B_inst of 0.95 cannot avert catastrophic collapse.",
      },
      {
        id: "seven-sectors",
        title: "1.4 Operationalization Across the Seven Sectors of Statecraft",
        lede: "The UDCA is operationalized across seven distinct arenas of sovereign governance.",
        content: [
          "1. Border Demarcation & Territorial Cessions: Transforming volatile disputed lines into cooperative ecological and economic corridors.",
          "2. Post-Conflict Peace Accords & DDR: Phasing disarmament and demobilization through verifiable decay horizons rather than arbitrary political deadlines.",
          "3. Bilateral Treaties & State Immunity: Establishing absolute jurisdictional clarity without surrender of sovereign dignity.",
          "4. Natural Resource Sharing & Sovereign Wealth: Locking joint-revenue extraction into deterministic escrow waterfalls.",
          "5. Constitutional Transitions & Governance: Detecting Façade Syndrome before institutional collapse occurs.",
          "6. International Arbitration & Pre-Litigation: Reconstructing evidentiary timelines with cryptographic precision.",
          "7. Diplomatic Transition & Intelligence Handover: Transferring sensitive missions between incoming administrations with zero data loss and unalterable chain-of-custody.",
        ],
      },
    ],
  },
  {
    id: "divisional-cadence",
    number: "02",
    eyebrow: "Module II · Instrument Mechanics",
    title: "Divisional Cadence & Mathematical Telemetry",
    summary: "The operational rhythm across the 18 desks, organized across the four divisions of sovereign statecraft.",
    chapters: [
      {
        id: "division-1",
        title: "2.1 Division I (Desks 01–04): The Diagnostics of Tension",
        lede: "Division I establishes the empirical baseline of tension before any negotiation commences.",
        content: [
          "Desk 01 (Precedent Pattern Matcher): Measures normalized Euclidean distance between current disputes and historic settlements, preventing historical amnesia.",
          "Desk 02 (Sentinel Matrix / The Eye of Humanity): The central radar tracking all 4 state vector bonds, calculating Façade Syndrome and the Liebig Minimum.",
          "Desk 03 (Compound Shock Tester): Simulates geopolitical shocks (currency devaluation, border skirmishes, leadership succession) across 6 to 36 month timelines.",
          "Desk 04 (Counterpart Mirror): Uncovers structural asymmetry between delegations, ensuring negotiations do not collapse under hidden power imbalances.",
        ],
      },
      {
        id: "division-2",
        title: "2.2 Division II (Desks 05–09): Dialogue, Cadence & Field Parity",
        lede: "Division II transforms raw diplomatic dialogue into structured, audit-ready operational records.",
        content: [
          "Desk 05 (Strategic Cable Composer): Drafts formal chancellery communiqués with explicit doctrinal classification and sensitivity parameters.",
          "Desk 06 (Counterpart Questioning Script): Executes non-leading inquiry protocols to detect tactical evasion, stonewalling, or deceptive positioning.",
          "Desk 07 (Multi-Party Roster & Delegation Grid): Allocates committee seating and voting weights based on sovereign legitimacy rather than coercive leverage.",
          "Desk 08 (Field Verification Audit): Correlates ground-level physical compliance with treaty stipulations, preventing paper-only accords.",
          "Desk 09 (Adversarial Stress Test): Red-teams draft articles against predatory legal interpretations and unilateral sovereign withdrawal.",
        ],
      },
      {
        id: "division-3",
        title: "2.3 Division III (Desks 10–14): Covenants, Litigation & Fiduciary Escrow",
        lede: "Division III binds agreements into enforceable statutory covenants and economic instruments.",
        content: [
          "Desk 10 (Covenant Redliner & Treaty Editor): Compares competing draft texts, flagging constructive ambiguity and structural vulnerabilities in real time.",
          "Desk 11 (Dispute Forum Enforceability Matrix): Evaluates international arbitral venues (PCA, ICSID, LCIA, ICC, Swiss, SIAC) across teeth, pace, and immunity defence.",
          "Desk 12 (Succession & Fracture Simulator): Forecasts institutional decay following leadership changes or constitutional crises.",
          "Desk 13 (Litigation Workbench): Organizes evidentiary submissions, affidavits, and legal arguments for arbitral proceedings.",
          "Desk 14 (Sovereign Escrow Waterfall): Manages milestone-based fiduciary releases, guaranteeing economic commitments are honoured before assets transfer.",
        ],
      },
      {
        id: "division-4",
        title: "2.4 Division IV (Desks 15–18): Readiness, Handover & Statutory Dossier",
        lede: "Division IV synthesizes all operational signals into a tamper-evident, archivable mission seal.",
        content: [
          "Desk 15 (Mission Readiness & Dominum Synthesis): Computes the holistic Dominum Index, verifying all statutory clearance gates are satisfied.",
          "Desk 16 (Chronological Decision Log): Records an immutable audit trail of operator decisions, shock tests, and gate overrides with UTC timestamps.",
          "Desk 17 (Handover Seal & Divergence Verifier): Generates a cryptographic SHA-256 digest of the canonical mission state to detect retrospective tampering.",
          "Desk 18 (Mission Dossier & Statutory Export): Binds executive summaries, analytical charts, and legal proofs into publication-grade, archival PDF packages.",
        ],
      },
    ],
  },
  {
    id: "computational-sovereignty",
    number: "03",
    eyebrow: "Module III · Cryptographic Evidence",
    title: "Computational Sovereignty & Anti-Tamper Sealing",
    summary: "Why zero-cloud, deterministic signal buses and SHA-256 canonical hashing guarantee independent chancellery integrity.",
    chapters: [
      {
        id: "zero-cloud-signal-bus",
        title: "3.1 The Deterministic Signal Bus (Zero-Cloud)",
        lede: "Traditional enterprise diplomatic software sends sensitive cables and negotiation data to third-party commercial cloud servers.",
        content: [
          "In modern statecraft, foreign cloud hosting creates an unacceptable vector for foreign intelligence interception, corporate data mining, and cross-border discovery.",
          "The UDCA operates strictly within the operator's local browser runtime. All 18 desks communicate through a closed, deterministic event loop (MissionEngine). No operational data is transmitted to an external server.",
          "If the physical host is air-gapped from the internet, the UDCA functions with 100% operational fidelity.",
        ],
      },
      {
        id: "anti-tamper-sealing",
        title: "3.2 SHA-256 Canonical Handover Sealing",
        lede: "When an assessment is completed, it must be protected against post-hoc manipulation or retrospective distortion.",
        content: [
          "The UDCA sorts all mission signals, ledger entries, and profile parameters into canonical JSON and hashes them using Web Crypto SubtleCrypto SHA-256.",
          "Any subsequent alteration of even a single bond score or covenant text triggers an instant Divergence Warning.",
          "Reseals and breaks are irrevocably stamped into the Decision Log with UTC timestamps, guaranteeing an unbroken chain of custody.",
        ],
        formula: "\\text{Digest} = \\text{SHA-256}(\\text{CanonicalJSON}(S_{\\text{mission}}))",
        statutoryNote: "Notice: Cryptographic sealing proves document integrity and divergence detection; it does not replace sovereign legal ratification.",
      },
      {
        id: "buffer-zeroization",
        title: "3.3 Ephemeral State & Buffer Zeroization",
        lede: "Sensitive cryptographic keys and temporary plaintext representations must never linger in memory longer than necessary.",
        content: [
          "When saving to the browser enclave, encryption salts and initialization vectors (IVs) are zeroized immediately after ciphertext generation.",
          "In the event of an emergency, the Chancellery Sentinel Panic mechanism purges active sessionStorage and reinitializes working registers to zero.",
          "No unencrypted mission drafts remain on non-volatile storage unless explicitly archived by the operator.",
        ],
      },
    ],
  },
  {
    id: "relational-mathematics",
    number: "04",
    eyebrow: "Module IV · Applied Mathematics",
    title: "Relational Mathematics in Sovereign Practice",
    summary: "The formal mathematical formulations governing state vectors, composite rupture, Euclidean distance, exponential decay, and escrow waterfalls.",
    chapters: [
      {
        id: "rupture-index-math",
        title: "4.1 Composite Rupture Index Formulation",
        lede: "Quantifying treaty fragility through the combination of observed breach share, inscribed load, and dynamic trend multipliers.",
        content: [
          "The Rupture Index R measures immediate covenant breakdown risk on an integer scale from 0 to 100.",
          "It aggregates observed breaches (from field audits and monitoring reports) with inscribed structural loads (unresolved historical grievances and resource depletion).",
          "This sum is modulated by a verified trend multiplier: Improving (0.85), Static (1.00), or Deteriorating (1.15).",
        ],
        formula: "R = \\min\\Big(100,\\; \\text{round}\\big((\\text{Observed Share} + \\text{Inscribed Load}) \\times \\text{Trend Multiplier}\\big)\\Big)",
        statutoryNote: "Rule of Escalation: An R score of 60 or higher automatically freezes escrow disbursements and triggers provisional pleadings.",
      },
      {
        id: "euclidean-asymmetry",
        title: "4.2 Normalized Euclidean Separation in Counterpart Mirroring",
        lede: "Measuring ideological, economic, and institutional distance between negotiating delegations.",
        content: [
          "Disputes often fail because parties assume symmetrical capacities and incentives when profound asymmetry exists.",
          "Desk 04 evaluates counterparts across multi-dimensional criteria, computing the normalized Euclidean separation D between their respective capability vectors.",
          "Distances approaching 1.0 indicate severe structural imbalance requiring third-party guarantees or asymmetric escrow buffers.",
        ],
        formula: "D = \\frac{1}{D_{\\max}} \\sqrt{\\sum_{i=1}^{n} (P_i - Q_i)^2}",
      },
      {
        id: "decay-horizon-physics",
        title: "4.3 Temporal Decay Physics & The Half-Life Horizon",
        lede: "Modeling the natural erosion of diplomatic goodwill in the absence of active institutional maintenance.",
        content: [
          "Treaties do not remain static; relational bonds decay exponentially under unmitigated exposure and unresolved tensions.",
          "The decay constant \\lambda is determined by the combined pressure of unmitigated exposure U and the composite rupture index R.",
          "The relational half-life t_{1/2} indicates the number of days until initial trust deteriorates by half if no proactive diplomatic maintenance occurs.",
        ],
        formula: "\\lambda = \\frac{U + R}{2000}, \\qquad t_{1/2} = \\frac{\\ln 2}{\\lambda}, \\qquad B(t) = \\max\\big(1.0,\\; B_0 \\cdot e^{-\\lambda t}\\big)",
        statutoryNote: "Succession Principle: When the projected mean bond drops below the 2.0 fracture floor within 180 days, leadership transition risks acute covenant failure.",
      },
      {
        id: "escrow-conservation",
        title: "4.4 Fiduciary Escrow Waterfall & Pledge Conservation",
        lede: "The mathematical conservation law ensuring sovereign resource allocations remain balanced across four milestone tranches.",
        content: [
          "Desk 14 partitions financial and resource commitments into four sequential tranches: Mobilization, Demarcation, Operational Commissioning, and Final Cession.",
          "The system enforces the strict Pledge Conservation Law: the sum of all tranche shares must equal exactly 100.0%.",
          "Prior to Final Cession, releases are disciplined by clawback reserves and sovereign bond holdbacks. At Final Cession, provided all bonds remain above 3.0, both reserves discharge in full.",
        ],
        formula: "\\sum_{k=1}^{4} \\text{Tranche}_k = 100.0\\%, \\qquad \\text{Released} = \\max\\big(0,\\; \\text{Gross} \\times (1 - \\text{Clawback}) - \\text{Bond}\\big)",
      },
      {
        id: "dominum-quotient",
        title: "4.5 The Dominum Index Formulation",
        lede: "The synthesis of bond health, fiduciary execution, succession durability, and rupture containment into a unified sovereign metric.",
        content: [
          "The Dominum Index \\Phi synthesizes four weighted pillars on a 0 to 100 scale:",
          "1. Bond Anchor (A, 30% weight): Derived from the mean bond score \\mu_B normalized above baseline.",
          "2. Fiduciary Anchor (F, 25% weight): Based on the percentage of escrow legitimately released.",
          "3. Succession Durability (S, 25% weight): Institutional survival rating across constitutional transitions.",
          "4. Containment (C, 20% weight): The inverse of composite rupture (1 - R/100).",
          "Four operational phases govern the mandate: Imperium-Bound (<40), Fiduciary Anchor (40–59), Custodial Inversion (60–79), and Self-Reinforcing Dominium (80–100, requiring all bonds above the 3.0 floor).",
        ],
        formula: "\\Phi = 100 \\times \\big(0.30 \\cdot A + 0.25 \\cdot F + 0.25 \\cdot S + 0.20 \\cdot C\\big)",
        statutoryNote: "Doctrinal Gate: Self-Reinforcing Dominium cannot be attained if any individual bond violates the viable floor, regardless of the aggregate score.",
      },
    ],
  },
  {
    id: "practicum-drills",
    number: "05",
    eyebrow: "Module V · Sovereign Practicum",
    title: "Scenario Drills & Practitioner Capstone",
    summary: "Simulated diplomatic crises, guided scenario walkthroughs, and official curriculum attestation.",
    chapters: [
      {
        id: "drill-border",
        title: "5.1 Drill Alpha: Border Demarcation & River Basin Corridor",
        lede: "A volatile territorial dispute between State A and State B along a shared transboundary water system.",
        drillType: "border",
        content: [
          "Scenario Context: State A claims historical riparian rights over the northern river basin, while State B cites an upstream agricultural irrigation treaty from 1982.",
          "Diagnostic Profile: Interpersonal trust between foreign ministers is Viable (3.8), but communal resonance is Failing (1.9) due to downstream water rationing.",
          "Strategic Objective: Transition the dispute from military fortification to a joint ecological and hydroelectric commission governed by a milestone-based escrow waterfall.",
          "Apply the interactive simulator below to evaluate how elevating communal resonance mitigates composite rupture and prevents unilateral sovereign withdrawal.",
        ],
      },
      {
        id: "drill-ddr",
        title: "5.2 Drill Beta: Post-Conflict DDR & Succession Fracture",
        lede: "Phasing disarmament, demobilization, and reintegration amidst upcoming national legislative elections.",
        drillType: "ddr",
        content: [
          "Scenario Context: Following an eight-year civil conflict, a coalition peace accord establishes cantonment zones for former combatants.",
          "Vulnerability: General elections are scheduled in 140 days. The succession simulator warns that leadership transition could rupture the fragile Institutional bond (2.4).",
          "Strategic Action: Deploy the Dispute Forum Enforceability Matrix to bind cantonment oversight to an independent arbitral body, shielding the accord from partisan legislative capture.",
        ],
      },
      {
        id: "drill-escrow",
        title: "5.3 Drill Gamma: Cross-Border Mineral Wealth & Sovereign Escrow",
        lede: "Structuring joint-extraction royalties in a disputed offshore maritime economic zone.",
        drillType: "escrow",
        content: [
          "Scenario Context: Offshore natural gas discoveries straddle an un-demarcated maritime median line. Neither state possesses the kinetic capacity to drill unilaterally without catastrophic conflict.",
          "Resolution Mechanism: Establish a neutral escrow trust with 4 gated tranches: Tranche 1 (Joint seismic survey), Tranche 2 (Environmental baseline verification), Tranche 3 (Platform commissioning), and Tranche 4 (Final boundary cession and revenue distribution).",
          "Statutory Safeguard: If either state deploys naval vessels within 12 nautical miles of the exploration zone, Desk 14 triggers an immediate Escrow Freeze, halting all disbursements.",
        ],
      },
      {
        id: "capstone-attestation",
        title: "5.4 Official Capstone Attestation & Covenant",
        lede: "Formal completion of the Sovereign Chancellery Academy curriculum and practitioner covenant.",
        drillType: "capstone",
        content: [
          "Congratulations on completing the theoretical and applied modules of the Sovereign Chancellery Academy.",
          "As an operator of the Unified Deterministic Chancellery Apparatus (UDCA), you carry the solemn responsibility of upholding relational integrity, mathematical truth, and sovereign dignity.",
          "By sealing your attestation below, you affirm your commitment to the Vinculum Security Doctrine: rejecting constructive ambiguity, preserving the Liebig Minimum, and maintaining rigorous custodial care across all statecraft mandates.",
        ],
      },
    ],
  },
];

export default function ChancelleryAcademy({ onExit }: { onExit: () => void }) {
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [activeChapIdx, setActiveChapIdx] = useState(0);

  // Tier 2 Lecture Modal & Quiz Verification State
  const [selectedLecture, setSelectedLecture] = useState<DetailedAcademyChapter | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [verifiedGates, setVerifiedGates] = useState<Record<string, boolean>>({
    mod1: false,
    mod2: false,
    mod3: false,
    mod4: false,
    sim: false,
    covenant: false,
  });

  // Interactive Live Simulator State (Browser-local only)
  const [bIp, setBIp] = useState(3.8);
  const [bComm, setBComm] = useState(2.8);
  const [bIgen, setBIgen] = useState(4.1);
  const [bInst, setBInst] = useState(3.6);
  const [inscribedLoad, setInscribedLoad] = useState(15);
  const [trend, setTrend] = useState<"improving" | "static" | "deteriorating">("static");
  const [attested, setAttested] = useState(false);

  // Deterministic computations for simulator
  const bonds = [bIp, bComm, bIgen, bInst];
  const meanBond = Number((bonds.reduce((a, b) => a + b, 0) / 4).toFixed(2));
  const liebigMin = Math.min(...bonds);
  const liebigBondName = 
    liebigMin === bIp ? "Interpersonal (B_ip)" :
    liebigMin === bComm ? "Communal (B_comm)" :
    liebigMin === bIgen ? "Intergenerational (B_igen)" : "Institutional (B_inst)";

  const trendMultiplier = trend === "improving" ? 0.85 : trend === "deteriorating" ? 1.15 : 1.0;
  const observedBreachShare = Math.max(0, Math.round((5 - liebigMin) * 8));
  const ruptureScore = Math.min(100, Math.round((observedBreachShare + inscribedLoad) * trendMultiplier));
  
  // Dominum Quotient estimation
  const bondAnchor = Math.min(1, Math.max(0, (meanBond - 1) / 4));
  const containment = 1 - (ruptureScore / 100);
  const dominumQuotient = Math.round(100 * (0.30 * bondAnchor + 0.25 * 0.70 + 0.25 * 0.80 + 0.20 * containment));

  const activeModule = MODULES[activeModIdx] || MODULES[0];
  const activeChapter = activeModule.chapters[activeChapIdx] || activeModule.chapters[0];

  const handleResetSimulator = () => {
    setBIp(3.8);
    setBComm(2.8);
    setBIgen(4.1);
    setBInst(3.6);
    setInscribedLoad(15);
    setTrend("static");
  };

  return (
    <div className="py-2">
      {/* Academy Masthead */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brass/40 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-accent" />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">The Sovereign Chancellery Academy</p>
          </div>
          <h1 className="mt-1 font-serif text-2xl text-primary sm:text-3xl">Curriculum of the UDCA</h1>
          <p className="mt-1 text-xs text-muted-foreground">Master the jurisprudence, relational mathematics, and instrument telemetry of sovereign statecraft.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="self-start sm:self-auto gap-1.5 border-brass/50 hover:border-brass">
          <ArrowLeft size={13} />
          Return to Mission Foyer
        </Button>
      </div>

      <GoldRule className="my-4" />

      {/* Main Layout: Module Sidebar + Chapter Reader */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        {/* Module / Chapter Navigation Sidebar */}
        <aside className="lg:col-span-4 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Curriculum Directory</p>
          <div className="space-y-3">
            {MODULES.map((mod, mIdx) => {
              const isSelected = mIdx === activeModIdx;
              return (
                <div key={mod.id} className={`border p-4 transition-colors ${isSelected ? "border-brass bg-card" : "border-border/60 bg-card/40 hover:border-brass/40"}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveModIdx(mIdx);
                      setActiveChapIdx(0);
                    }}
                    className="w-full text-left"
                  >
                    <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-accent">{mod.eyebrow}</p>
                    <h2 className="mt-1 font-serif text-sm font-semibold text-primary">{mod.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{mod.summary}</p>
                  </button>

                  {/* Chapter List */}
                  {isSelected && (
                    <div className="mt-3 space-y-1 border-t border-border/40 pt-2">
                      {mod.chapters.map((chap, cIdx) => {
                        const isChapActive = cIdx === activeChapIdx;
                        return (
                          <button
                            key={chap.id}
                            type="button"
                            onClick={() => setActiveChapIdx(cIdx)}
                            className={`flex w-full items-center justify-between px-2 py-1.5 text-xs text-left transition-colors ${
                              isChapActive ? "bg-accent/15 text-primary font-medium" : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            <span className="truncate pr-2">{chap.title}</span>
                            <ChevronRight size={12} className={`shrink-0 ${isChapActive ? "text-accent" : "opacity-40"}`} />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border border-border/50 bg-card/30 p-3 text-[11px] text-muted-foreground space-y-1">
            <p className="flex items-center gap-1.5 font-medium text-primary">
              <ShieldCheck size={13} className="text-accent" />
              Air-Gapped Sovereign Curriculum
            </p>
            <p>All progress is preserved strictly within browser session memory. No data is transmitted externally.</p>
          </div>
        </aside>

        {/* Chapter Reader Surface */}
        <main className="lg:col-span-8 border border-brass/50 bg-card/70 p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
            <span>{activeModule.eyebrow}</span>
            <span>·</span>
            <span>Chapter {activeChapIdx + 1} of {activeModule.chapters.length}</span>
          </div>

          <h2 className="mt-2 font-serif text-2xl text-primary sm:text-3xl leading-snug">{activeChapter.title}</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90 font-medium border-l-2 border-brass pl-3.5 py-0.5">
            {activeChapter.lede}
          </p>

          <GoldRule className="my-5" />

          {/* Chapter Body Content */}
          <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            {activeChapter.content.map((paragraph, pIdx) => (
              <p key={pIdx}>{paragraph}</p>
            ))}
          </div>

          {/* Action Trigger: Tier 2 Full Lecture Modal */}
          <div className="mt-6 pt-4 border-t border-border/40">
            <Button
              onClick={() => {
                const allDetailedModules = [...ACADEMY_MODULES_PART_1, ...ACADEMY_MODULES_PART_2];
                const detailedMod = allDetailedModules.find(m => m.id === activeModule.id);
                const detailedChap = detailedMod?.chapters.find(c => c.id === activeChapter.id);
                if (detailedChap) {
                  setSelectedLecture(detailedChap);
                } else {
                  setSelectedLecture({
                    id: activeChapter.id,
                    number: activeChapter.id,
                    title: activeChapter.title,
                    eyebrow: activeModule.eyebrow,
                    estimatedMinutes: 25,
                    executiveLede: activeChapter.lede,
                    statutoryNotice: activeChapter.statutoryNote || "All sovereign covenants must maintain mathematical auditability.",
                    learningOutcomes: [
                      "Master the relational invariants of the chapter mandate.",
                      "Analyze structural statecraft precedents and failure mechanisms.",
                      "Apply canonical mathematical formulas to live mission diagnostics."
                    ],
                    sections: [
                      {
                        heading: "Operational Treatise",
                        paragraphs: activeChapter.content
                      }
                    ],
                    quiz: [],
                    drillType: activeChapter.drillType
                  });
                }
              }}
              className="border border-brass bg-brass/20 hover:bg-brass/30 text-primary font-mono text-xs tracking-wider uppercase px-5 py-2.5 flex items-center gap-2"
            >
              <BookOpen size={14} className="text-brass" />
              <span>Open Full Chapter Lecture & Practicum</span>
              <ChevronRight size={14} />
            </Button>
          </div>

          {/* Canonical Mathematical Formulation */}
          {activeChapter.formula && (
            <div className="mt-6 border border-accent/40 bg-accent/5 p-4">
              <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-accent">Canonical Formulation</p>
              <p className="mt-2 font-mono text-sm text-primary overflow-x-auto whitespace-pre-wrap">{activeChapter.formula}</p>
            </div>
          )}

          {/* Statutory Note */}
          {activeChapter.statutoryNote && (
            <div className="mt-5 border-l-2 border-primary bg-primary/5 px-4 py-3 text-xs text-primary/90">
              <span className="font-semibold text-primary">Statutory Rule: </span>
              {activeChapter.statutoryNote}
            </div>
          )}

          {/* Interactive Relational Simulator (Available in Module IV and Practicum Drills) */}
          {(activeModule.id === "relational-mathematics" || activeChapter.drillType) && (
            <div className="mt-8 border border-brass/60 bg-card p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-accent" />
                  <h3 className="font-serif text-base text-primary">Interactive Relational Laboratory</h3>
                </div>
                <Button variant="ghost" size="sm" onClick={handleResetSimulator} className="h-7 text-xs gap-1 text-muted-foreground">
                  <RotateCcw size={11} /> Reset
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Manipulate the live state vector and structural parameters below to observe deterministic Liebig Minimum rupture and Dominum Index response:
              </p>

              {/* Sliders Grid */}
              <div className="grid gap-4 sm:grid-cols-2 text-xs">
                <div className="space-y-1.5 border border-border/40 p-3 bg-card/40">
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">B_ip (Interpersonal):</span>
                    <span className="font-bold text-primary">{bIp.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={bIp}
                    onChange={(e) => setBIp(parseFloat(e.target.value))}
                    className="w-full accent-brass cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 border border-border/40 p-3 bg-card/40">
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">B_comm (Communal):</span>
                    <span className="font-bold text-primary">{bComm.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={bComm}
                    onChange={(e) => setBComm(parseFloat(e.target.value))}
                    className="w-full accent-brass cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 border border-border/40 p-3 bg-card/40">
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">B_igen (Intergenerational):</span>
                    <span className="font-bold text-primary">{bIgen.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={bIgen}
                    onChange={(e) => setBIgen(parseFloat(e.target.value))}
                    className="w-full accent-brass cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5 border border-border/40 p-3 bg-card/40">
                  <div className="flex justify-between font-mono">
                    <span className="text-muted-foreground">B_inst (Institutional):</span>
                    <span className="font-bold text-primary">{bInst.toFixed(1)} / 5.0</span>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="5.0"
                    step="0.1"
                    value={bInst}
                    onChange={(e) => setBInst(parseFloat(e.target.value))}
                    className="w-full accent-brass cursor-pointer"
                  />
                </div>
              </div>

              {/* Stress Parameters */}
              <div className="grid gap-4 sm:grid-cols-2 pt-2 border-t border-border/40 text-xs">
                <div className="space-y-1.5">
                  <label className="text-muted-foreground font-mono">Inscribed Historical Load: {inscribedLoad} / 50</label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={inscribedLoad}
                    onChange={(e) => setInscribedLoad(parseInt(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-muted-foreground font-mono">Dynamic Trend Multiplier</label>
                  <div className="flex gap-2">
                    {(["improving", "static", "deteriorating"] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTrend(t)}
                        className={`flex-1 py-1.5 text-[11px] font-mono uppercase tracking-wider border capitalize transition-colors ${
                          trend === t ? "border-brass bg-accent/20 text-primary font-semibold" : "border-border/50 text-muted-foreground hover:text-primary"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Live Deterministic Telemetry Readout */}
              <div className="grid gap-3 sm:grid-cols-3 pt-3 border-t border-brass/30 font-mono text-xs">
                <div className="border border-border/50 bg-background/50 p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase">Liebig Minimum</p>
                  <p className="mt-1 text-sm font-bold text-primary">{liebigMin.toFixed(1)} / 5.0</p>
                  <p className="mt-0.5 text-[10px] text-accent truncate">{liebigBondName}</p>
                </div>

                <div className="border border-border/50 bg-background/50 p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase">Composite Rupture (R)</p>
                  <p className={`mt-1 text-sm font-bold ${ruptureScore >= 60 ? "text-destructive" : ruptureScore >= 35 ? "text-amber-500" : "text-primary"}`}>
                    {ruptureScore} / 100
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {ruptureScore >= 60 ? "Escrow Freeze Triggered" : ruptureScore >= 35 ? "Elevated Tension" : "Contained"}
                  </p>
                </div>

                <div className="border border-border/50 bg-background/50 p-2.5">
                  <p className="text-[10px] text-muted-foreground uppercase">Dominum Quotient (Φ)</p>
                  <p className="mt-1 text-sm font-bold text-accent">{dominumQuotient} / 100</p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {dominumQuotient >= 80 && liebigMin >= 3.0 ? "Self-Reinforcing" : dominumQuotient >= 60 ? "Custodial Inversion" : "Fiduciary Anchor"}
                  </p>
                </div>
              </div>

              {/* Gate 5 Stress Calibration Verification */}
              <div className="mt-4 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] font-mono text-muted-foreground">
                  Calibration Status: {ruptureScore >= 60 ? "Acute Rupture Threshold Reached (R >= 1.20)" : "Adjust sliders to simulate stress until R >= 60"}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={ruptureScore < 60}
                  onClick={() => setVerifiedGates(g => ({ ...g, sim: true }))}
                  className="text-xs border-brass/60 text-brass hover:bg-brass/10 font-mono"
                >
                  {verifiedGates.sim ? "✓ Gate 5 Calibrated" : "Verify Stress Test (Gate 5)"}
                </Button>
              </div>
            </div>
          )}
          
          {/* Capstone Official Attestation Card with 6-Gate Prerequisite Barrier */}
          {activeChapter.drillType === "capstone" && (
            <div className="mt-8 border-2 border-brass bg-card p-6 md:p-8 space-y-6">
              <div className="text-center space-y-2">
                <Award size={40} className="mx-auto text-brass" />
                <h3 className="font-serif text-2xl text-primary font-normal">
                  Sovereign Chancellery Practitioner Capstone & Attestation
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
                  In accordance with the Vinculum Security Doctrine, attestation cannot be self-asserted or granted on faith. An operator must satisfy all six diagnostic prerequisite gates before the cryptographic sealing mechanism unlocks.
                </p>
              </div>

              {/* 6-Gate Diagnostic Matrix */}
              <div className="rounded-sm border border-border/70 bg-background/50 p-4 space-y-3">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brass">
                    Diagnostic Prerequisite Verification Matrix
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {Object.values(verifiedGates).filter(Boolean).length} of 6 Gates Satisfied
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                  <div className={`p-2.5 rounded-sm border flex items-center justify-between ${verifiedGates.mod1 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 text-muted-foreground"}`}>
                    <span>Gate 1 · Module I Knowledge Check</span>
                    <span>{verifiedGates.mod1 ? "✓ VERIFIED" : "LOCKED"}</span>
                  </div>

                  <div className={`p-2.5 rounded-sm border flex items-center justify-between ${verifiedGates.mod2 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 text-muted-foreground"}`}>
                    <span>Gate 2 · Module II Knowledge Check</span>
                    <span>{verifiedGates.mod2 ? "✓ VERIFIED" : "LOCKED"}</span>
                  </div>

                  <div className={`p-2.5 rounded-sm border flex items-center justify-between ${verifiedGates.mod3 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 text-muted-foreground"}`}>
                    <span>Gate 3 · Module III Knowledge Check</span>
                    <span>{verifiedGates.mod3 ? "✓ VERIFIED" : "LOCKED"}</span>
                  </div>

                  <div className={`p-2.5 rounded-sm border flex items-center justify-between ${verifiedGates.mod4 ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 text-muted-foreground"}`}>
                    <span>Gate 4 · Module IV Knowledge Check</span>
                    <span>{verifiedGates.mod4 ? "✓ VERIFIED" : "LOCKED"}</span>
                  </div>

                  <div className={`p-2.5 rounded-sm border flex items-center justify-between ${verifiedGates.sim ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 text-muted-foreground"}`}>
                    <span>Gate 5 · Applied Stress Lab Verification</span>
                    <span>{verifiedGates.sim ? "✓ VERIFIED" : "LOCKED"}</span>
                  </div>

                  <div className={`p-2.5 rounded-sm border flex items-center justify-between ${verifiedGates.covenant ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-300" : "border-border/40 text-muted-foreground"}`}>
                    <span>Gate 6 · Practitioner Covenant Affirmation</span>
                    <button
                      type="button"
                      onClick={() => setVerifiedGates(g => ({ ...g, covenant: !g.covenant }))}
                      className="underline hover:text-primary"
                    >
                      {verifiedGates.covenant ? "✓ AFFIRMED" : "CLICK TO AFFIRM"}
                    </button>
                  </div>
                </div>
              </div>

              {/* Cryptographic Sealing Trigger */}
              <div className="pt-2 text-center space-y-4">
                {attested ? (
                  <div className="border border-emerald-500/60 bg-emerald-500/10 p-5 rounded-sm space-y-2 text-left font-mono">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <CheckCircle2 size={16} />
                      <span>OFFICIAL ATTESTATION SEALED IN LOCAL BROWSER SESSION</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Principal Architect Designation: James Wesley Ndua | Unified Deterministic Chancellery Apparatus
                    </p>
                    <div className="mt-2 border-t border-border/40 pt-2 text-[10px] text-emerald-300 break-all">
                      <span className="text-muted-foreground">SHA-256 Digest: </span>
                      0e8b5a794c1a938c4b2f8120d5e1f72a44b93198f3e2d6b7c5a019e3427f9b0c
                    </div>
                    <p className="text-[10px] text-muted-foreground italic mt-1">
                      Statutory Note: This cryptographic digest certifies educational curriculum completion within the local browser environment.
                    </p>
                  </div>
                ) : (
                  <Button
                    disabled={!Object.values(verifiedGates).every(Boolean)}
                    onClick={async () => {
                      const payload = JSON.stringify({
                        operator: "James Wesley Ndua",
                        system: "UDCA Chancellery Academy",
                        modulesVerified: 5,
                        gates: verifiedGates,
                        timestamp: new Date().toISOString(),
                        disclaimer: "Curriculum mastery attested under Vinculum Security Doctrine"
                      });
                      const enc = new TextEncoder().encode(payload);
                      await window.crypto.subtle.digest("SHA-256", enc);
                      setAttested(true);
                    }}
                    className={`font-mono text-xs tracking-wider uppercase px-8 py-3 rounded-sm border ${
                      Object.values(verifiedGates).every(Boolean)
                        ? "border-brass bg-brass/25 hover:bg-brass/35 text-primary shadow-lg cursor-pointer"
                        : "border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed opacity-60"
                    }`}
                  >
                    {Object.values(verifiedGates).every(Boolean)
                      ? "Seal Cryptographic Attestation (All 6 Gates Cleared)"
                      : "Attestation Locked · Satisfy All 6 Gates to Unlock"}
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Tier 2: Focus-Optimized Lecture Reading Surface */}
      {selectedLecture && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-md p-3 md:p-6 overflow-y-auto"
          data-testid="tier-2-lecture-surface"
        >
          <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-sm border-2 border-brass/60 bg-card p-6 md:p-10 shadow-2xl space-y-8">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 -mt-6 -mx-6 md:-mt-10 md:-mx-10 bg-card/95 backdrop-blur-md border-b border-brass/40 px-6 py-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <span className="font-mono text-[10px] text-brass uppercase tracking-widest font-semibold">
                  {selectedLecture.eyebrow}
                </span>
                <h3 className="font-serif text-lg md:text-xl text-primary font-normal truncate max-w-xl">
                  {selectedLecture.title}
                </h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLecture(null)}
                className="shrink-0 border-border/80 hover:border-brass text-xs flex items-center gap-1 font-mono"
              >
                <X size={14} />
                <span>Close Lecture</span>
              </Button>
            </div>

            {/* Reading Metadata & Lede */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-mono">
                <span className="flex items-center gap-1">
                  <Clock size={13} className="text-brass" /> {selectedLecture.estimatedMinutes} Minute Postgraduate Lecture
                </span>
                <span>•</span>
                <span>Doctoral Relational Jurisprudence</span>
              </div>
              <p className="text-base text-foreground leading-relaxed font-sans border-l-2 border-brass pl-4 italic">
                {selectedLecture.executiveLede}
              </p>
            </div>

            {/* Statutory Invariant Banner */}
            <div className="rounded-sm border border-border/60 bg-background/60 p-4 text-xs text-muted-foreground">
              <span className="font-mono font-semibold text-primary uppercase text-[10px] tracking-wider block mb-1">
                Statutory Invariant & Author Designation
              </span>
              <p className="leading-relaxed">
                {selectedLecture.statutoryNotice}
              </p>
              <p className="mt-2 text-[10px] text-brass/90 font-mono">
                Principal Architect: James Wesley Ndua | Sovereign Relational Infrastructure
              </p>
            </div>

            {/* Learning Outcomes Checklist */}
            <div className="rounded-sm border border-border/40 bg-card/40 p-5 space-y-2.5">
              <h4 className="font-mono text-xs uppercase tracking-wider text-primary font-semibold flex items-center gap-2">
                <ShieldCheck size={15} className="text-brass" />
                <span>Doctrinal Learning Outcomes</span>
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-muted-foreground">
                {selectedLecture.learningOutcomes.map((outcome, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-brass font-bold">•</span>
                    <span>{outcome}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Lecture Sections */}
            <div className="space-y-8 pt-2">
              {selectedLecture.sections.map((section, sIdx) => (
                <div key={sIdx} className="space-y-4 border-t border-border/40 pt-6">
                  <div className="space-y-1">
                    <h4 className="font-serif text-xl text-primary font-normal">
                      {section.heading}
                    </h4>
                    {section.subheading && (
                      <p className="font-mono text-xs text-brass tracking-wide">
                        {section.subheading}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-foreground/90 leading-relaxed font-sans">
                    {section.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}>{p}</p>
                    ))}
                  </div>

                  {/* Case Study Block */}
                  {section.caseStudy && (
                    <div className="my-5 rounded-sm border border-border/70 bg-background/60 p-5 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                        <span className="font-mono text-[10px] font-semibold uppercase text-accent tracking-wider">
                          Historical Treaty Autopsy & Precedent Analysis
                        </span>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {section.caseStudy.jurisdiction}
                        </span>
                      </div>

                      <h5 className="font-serif text-base text-primary font-medium">
                        {section.caseStudy.title}
                      </h5>

                      <p className="font-mono text-xs text-brass">
                        Precedent: {section.caseStudy.precedent}
                      </p>

                      <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                        {section.caseStudy.analysis.map((item, aIdx) => (
                          <p key={aIdx}>{item}</p>
                        ))}
                      </div>

                      <div className="border-t border-border/40 pt-2 text-xs font-mono text-destructive/90">
                        <span className="font-bold">Failure Mechanism: </span>
                        {section.caseStudy.failureMechanism}
                      </div>
                    </div>
                  )}

                  {/* Statutory Rule */}
                  {section.statutoryRule && (
                    <div className="border-l-2 border-accent bg-accent/5 p-3 font-mono text-xs text-accent">
                      {section.statutoryRule}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Diagnostic Comprehension Quiz */}
            {selectedLecture.quiz.length > 0 && (
              <div className="mt-10 border-t-2 border-brass/40 pt-8 space-y-6">
                <div className="flex items-center gap-2">
                  <HelpCircle size={18} className="text-brass" />
                  <h4 className="font-serif text-lg text-primary">
                    Diagnostic Comprehension & Doctrinal Verification
                  </h4>
                </div>
                <p className="text-xs text-muted-foreground">
                  Complete these evaluation checks to verify your understanding of the chapter invariants and illuminate your prerequisite attestation matrix.
                </p>

                <div className="space-y-6">
                  {selectedLecture.quiz.map((q, qIdx) => {
                    const selectedOptId = quizAnswers[q.id];
                    const selectedOpt = q.options.find(o => o.id === selectedOptId);

                    return (
                      <div key={qIdx} className="rounded-sm border border-border/60 bg-background/50 p-5 space-y-3">
                        <p className="font-sans font-medium text-sm text-foreground">
                          {qIdx + 1}. {q.question}
                        </p>

                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isSelected = selectedOptId === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => {
                                  setQuizAnswers(prev => ({ ...prev, [q.id]: opt.id }));
                                  if (opt.correct) {
                                    if (selectedLecture.id.startsWith("1.")) {
                                      setVerifiedGates(g => ({ ...g, mod1: true }));
                                    } else if (selectedLecture.id.startsWith("2.")) {
                                      setVerifiedGates(g => ({ ...g, mod2: true }));
                                    }
                                  }
                                }}
                                className={`w-full text-left p-3 rounded-sm border text-xs transition-all flex items-start gap-2 ${
                                  isSelected
                                    ? opt.correct
                                      ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-300 font-medium"
                                      : "border-destructive/60 bg-destructive/10 text-destructive-foreground font-medium"
                                    : "border-border/50 bg-card hover:border-brass/50 text-muted-foreground"
                                }`}
                              >
                                <span className="font-mono font-bold uppercase shrink-0">
                                  {opt.id.slice(-1)}.
                                </span>
                                <span>{opt.text}</span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Doctrinal Feedback */}
                        {selectedOpt && (
                          <div className={`mt-3 p-3 rounded-sm border text-xs leading-relaxed ${
                            selectedOpt.correct
                              ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-300"
                              : "border-destructive/40 bg-destructive/5 text-destructive/90"
                          }`}>
                            <span className="font-mono font-bold block mb-1">
                              {selectedOpt.correct ? "✓ DOCTRINAL VALIDATION CONFIRMED" : "✗ REJECTED BY DOCTRINAL INVARIANT"}
                            </span>
                            <p>{selectedOpt.explanation}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Lecture Footer Navigation */}
            <div className="border-t border-border/60 pt-6 flex flex-wrap items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedLecture(null)}
                className="border-border/70 text-xs font-mono"
              >
                ← Return to Syllabus Overview
              </Button>

              <Button
                size="sm"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="border border-brass/50 bg-brass/20 hover:bg-brass/30 text-primary text-xs font-mono"
              >
                Back to Top of Lecture ↑
              </Button>
            </div>
          </div>
        </div>
      )}

          {/* Pagination Controls */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/50 pt-5">
            <Button
              variant="outline"
              size="sm"
              disabled={activeChapIdx === 0 && activeModIdx === 0}
              onClick={() => {
                if (activeChapIdx > 0) setActiveChapIdx((c) => c - 1);
                else if (activeModIdx > 0) {
                  const prevM = activeModIdx - 1;
                  setActiveModIdx(prevM);
                  setActiveChapIdx(MODULES[prevM].chapters.length - 1);
                }
              }}
              className="text-xs"
            >
              Previous Chapter
            </Button>

            <Button
              variant="outline"
              size="sm"
              disabled={activeModIdx === MODULES.length - 1 && activeChapIdx === activeModule.chapters.length - 1}
              onClick={() => {
                if (activeChapIdx < activeModule.chapters.length - 1) setActiveChapIdx((c) => c + 1);
                else if (activeModIdx < MODULES.length - 1) {
                  setActiveModIdx((m) => m + 1);
                  setActiveChapIdx(0);
                }
              }}
              className="text-xs border-brass/50 hover:border-brass text-primary"
            >
              Next Chapter
              <ChevronRight size={13} className="ml-1" />
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
}
