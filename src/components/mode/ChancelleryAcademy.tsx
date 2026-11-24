import { useState } from "react";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, GraduationCap, ShieldCheck, Sparkles } from "lucide-react";
import GoldRule from "@/components/GoldRule";
import { Button } from "@/components/ui/button";

export interface AcademyModule {
  id: string;
  number: string;
  title: string;
  eyebrow: string;
  summary: string;
  chapters: {
    id: string;
    title: string;
    lede: string;
    content: string[];
    formula?: string;
    statutoryNote?: string;
  }[];
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
        lede: "For over a century, diplomatic practice relied on 'constructive ambiguity'—intentionally vague treaty language that allowed opposing parties to sign an agreement while retaining contradictory interpretations.",
        content: [
          "In modern asymmetric warfare, digital sovereignty, and cross-border resource covenants, constructive ambiguity is no longer a diplomatic virtue; it is an active vulnerability.",
          "When crisis strikes, ambiguous treaty clauses do not foster compromise. Instead, they serve as the exact fault line along which covenants rupture. The stronger party exploits the textual ambiguity to justify unilateral action, while the vulnerable party suffers catastrophic institutional erosion.",
          "The Unified Deterministic Chancellery Apparatus (UDCA) rejects linguistic elasticity. In its place, the UDCA introduces Relational Determinism: statecraft defined not by aspirational rhetoric, but by quantifiable, verifiable structural thresholds.",
        ],
        statutoryNote: "Invariant: Ambiguity is the mathematical precursor to treaty rupture. If an enforcement obligation cannot be computed or audited, it does not exist.",
      },
      {
        id: "imperium-to-dominium",
        title: "1.2 From Imperium to Dominium: Custody vs. Kinetic Coercion",
        lede: "Traditional geopolitical systems operate on the principle of Imperium—the projection of kinetic force, military supremacy, surveillance scraping, and punitive sanctions.",
        content: [
          "Imperium creates a fragile equilibrium. It demands exponential military expenditure to suppress inevitable resistance, generating resentment and deep communal alienation.",
          "The Vinculum Security Doctrine shifts statecraft from Imperium to Dominium: the solemn responsibility of sovereign custody, relational stewardship, and intergenerational durability.",
          "Under Dominium, a state's security is measured not by how many adversaries it can incinerate, but by the structural integrity of its relational bonds across four non-negotiable dimensions.",
        ],
        formula: "Dominium Quotient \\; \\Phi = \\frac{\\text{Relational Yield}}{\\text{Coercive Friction}} \\ge 1.0",
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
        lede: "The UDCA is not an abstract philosophical construct; it is operationalized across seven distinct arenas of sovereign governance.",
        content: [
          "1. Border Demarcation & Territorial Cessions: Transforming volatile disputed lines into cooperative ecological and economic corridors.",
          "2. Post-Conflict Peace Accords & DDR: Phasing disarmament and demobilization through verifiable decay horizons rather than arbitrary deadlines.",
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
    summary: "The operational rhythm across the 18 desks, organized across the four divisions of statecraft.",
    chapters: [
      {
        id: "division-1",
        title: "2.1 Division I (Desks 01–04): The Diagnostics of Tension",
        lede: "Division I establishes the empirical baseline of tension before any negotiation commences.",
        content: [
          "Desk 01 (Precedent Pattern Matcher): Measures normalized Euclidean distance between current disputes and historic settlements.",
          "Desk 02 (Sentinel Matrix): The central radar tracking all 4 state vector bonds, calculating Façade Syndrome and the Liebig Minimum.",
          "Desk 03 (Compound Shock Tester): Simulates geopolitical shocks (currency devaluation, border skirmishes, leadership succession) across 6-to-36-month timelines.",
          "Desk 04 (Counterpart Mirror): Uncovers structural asymmetry between delegations, ensuring negotiations do not collapse under power imbalances.",
        ],
      },
      {
        id: "division-2-3-4",
        title: "2.2 Divisions II, III & IV: Dialogue, Covenants & Verification",
        lede: "From structured diplomatic cables to cryptographic attestation and handover.",
        content: [
          "Division II (Desks 05–09): Composes high-precision diplomatic cables, manages counterpart questioning scripts, balances multi-party resource parity, and executes field audits.",
          "Division III (Desks 10–14): Drafts binding clauses, simulates succession stress, manages adversarial litigation pleadings, and locks escrow waterfalls.",
          "Division IV (Desks 15–18): Synthesizes the Dominum Index, conducts forensic ledger audits, validates handover durability, and binds the final statutory mission dossier.",
        ],
      },
    ],
  },
  {
    id: "computational-sovereignty",
    number: "03",
    eyebrow: "Module III · Cryptographic Evidence",
    title: "Computational Sovereignty & Anti-Tamper Sealing",
    summary: "Why zero-cloud, deterministic signal buses and SHA-256 canonical hashing guarantee subpoena-proof chancellery integrity.",
    chapters: [
      {
        id: "zero-cloud-signal-bus",
        title: "3.1 The Deterministic Signal Bus (Zero-Cloud)",
        lede: "Traditional enterprise diplomatic software sends sensitive cables and negotiation data to third-party cloud servers.",
        content: [
          "In modern statecraft, foreign cloud hosting creates an unacceptable vector for foreign intelligence interception, corporate data mining, and cross-border subpoenas.",
          "The UDCA operates strictly within the operator's local browser runtime. All 18 desks communicate through a closed, deterministic event loop (MissionEngine). No data is ever transmitted to an external server.",
          "If the device is air-gapped, the UDCA functions with 100% operational fidelity.",
        ],
      },
      {
        id: "anti-tamper-sealing",
        title: "3.2 SHA-256 Canonical Handover Sealing",
        lede: "When an assessment is completed, it must be protected against post-hoc manipulation or retrospective distortion.",
        content: [
          "The UDCA sorts all mission signals, ledger entries, and profile parameters into canonical JSON and hashes them using Web Crypto SubtleCrypto SHA-256.",
          "Any subsequent alteration of even a single bond score or covenant text triggers an instant Divergence Warning.",
          "Reseals and breaks are irrevocably stamped into the Decision Log with UTC timestamps, guaranteeing unbroken chain-of-custody.",
        ],
      },
    ],
  },
];

export default function ChancelleryAcademy({ onExit }: { onExit: () => void }) {
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [activeChapIdx, setActiveChapIdx] = useState(0);

  const activeModule = MODULES[activeModIdx] || MODULES[0];
  const activeChapter = activeModule.chapters[activeChapIdx] || activeModule.chapters[0];

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
          <p className="mt-1 text-xs text-muted-foreground">Master the jurisprudence, relational mathematics and instrument telemetry of sovereign statecraft.</p>
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
            <p>All progress is preserved strictly within browser session memory. No data is shared or transmitted externally.</p>
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
