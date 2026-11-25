import { useCallback, useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  ArrowLeft,
  ArrowUp,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Copy,
  GraduationCap,
  HelpCircle,
  RotateCcw,
  ListChecks,
  Lock,
  ShieldCheck,
  SlidersHorizontal,
  X,
} from "lucide-react";
import GoldRule from "@/components/GoldRule";
import { Button } from "@/components/ui/button";
import {
  bondBand,
  communalTolerance,
  dominumIndex,
  mathReading,
  ruptureBand,
  ruptureIndex,
  successionDurability,
  INSCRIBED_LOAD_CAP,
  TREND_MULT,
  type BondVector,
} from "@/components/desk/engine";
import { DEFAULT_ESCROW, decayHorizon, escrowWaterfall, fractureWindow } from "@/components/desk/instruments";
import { AcademyFormulaBlock, MathText } from "./academyMath";
import { ACADEMY_CURRICULUM, chapterHeading, readingMinutes } from "./academyCurriculum";
import { AcademyInstrument } from "./academyInstruments";
import AcademyReader, { type ReaderTocEntry } from "./academyReader";
import { SESSION_KEY, loadAcademySession, loadPositions, readingProgress, savePosition, type SessionState } from "./academyReaderState";
import { LECTURE_HEADINGS } from "./academyLectureHeadings";
import {
  BOND_KEYS,
  STRESS_THRESHOLD,
  attestationGates,
  buildAttestationRecord,
  canSeal,
  evaluateStressSimulation,
  sealAttestation,
  stressRecord,
  verifyAttestation,
  type SealedAttestation,
  type StressRecord,
} from "./academyAttestation";
import type { DetailedAcademyChapter, DetailedAcademyModule } from "./academyTypes";

const BOND_LABELS: { key: keyof BondVector; label: string }[] = [
  { key: "interpersonal", label: "Interpersonal" },
  { key: "communal", label: "Communal" },
  { key: "intergenerational", label: "Intergenerational" },
  { key: "institutional", label: "Institutional-Relational" },
];

const DEFAULT_LAB = {
  bonds: { interpersonal: 3.8, communal: 2.8, intergenerational: 4.1, institutional: 3.6 } as BondVector,
  observedShare: 25,
  inscribedLoad: 10,
  trend: "static" as keyof typeof TREND_MULT,
  verifierSeated: true,
  covenants: 1,
  exposure: 10,
};

const FLAT_CHAPTERS = ACADEMY_CURRICULUM.flatMap((m, mIdx) => m.chapters.map((c, cIdx) => ({ mIdx, cIdx, chapter: c })));

/**
 * The Sovereign Chancellery Academy. Every module, chapter, lecture and quiz is read
 * from ACADEMY_CURRICULUM; the Interactive Relational Laboratory and the section
 * instruments compute only through the desks' own functions and never publish to the
 * MissionEngine bus. All progress stays in this component's state and sessionStorage.
 */
export default function ChancelleryAcademy({ onExit }: { onExit: () => void }) {
  const MODULES = ACADEMY_CURRICULUM;
  const [activeModIdx, setActiveModIdx] = useState(0);
  const [activeChapIdx, setActiveChapIdx] = useState(0);

  // Tier 2 lecture surface and attestation state (browser-local only)
  const [selectedLecture, setSelectedLecture] = useState<DetailedAcademyChapter | null>(null);
  const [session] = useState<SessionState>(() => loadAcademySession(typeof window === "undefined" ? null : window.sessionStorage));
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>(session.answers);
  const [covenantAffirmed, setCovenantAffirmed] = useState(session.covenantAffirmed);
  const [stressPass, setStressPass] = useState<StressRecord | null>(session.stress);
  const [passedAt, setPassedAt] = useState<Record<string, string>>(session.passedAt);
  const [namedBond, setNamedBond] = useState<keyof BondVector | null>(null);
  const [stressMessage, setStressMessage] = useState<string | null>(null);
  const [sealed, setSealed] = useState<SealedAttestation | null>(null);
  const [sealVerified, setSealVerified] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const lectureRef = useRef<HTMLDivElement>(null);
  const openerRef = useRef<HTMLButtonElement>(null);

  // Interactive Relational Laboratory inputs (browser-local only)
  const [bonds, setBonds] = useState<BondVector>(DEFAULT_LAB.bonds);
  const [observedShare, setObservedShare] = useState(DEFAULT_LAB.observedShare);
  const [inscribedLoad, setInscribedLoad] = useState(DEFAULT_LAB.inscribedLoad);
  const [trend, setTrend] = useState<keyof typeof TREND_MULT>(DEFAULT_LAB.trend);
  const [verifierSeated, setVerifierSeated] = useState(DEFAULT_LAB.verifierSeated);
  const [covenants, setCovenants] = useState(DEFAULT_LAB.covenants);
  const [exposure, setExposure] = useState(DEFAULT_LAB.exposure);

  // Every laboratory reading is computed by the desks' own functions; nothing is re-derived here.
  const lab = useMemo(() => {
    const vector: [number, number, number, number] = [bonds.interpersonal, bonds.communal, bonds.intergenerational, bonds.institutional];
    const reading = mathReading(vector);
    const R = ruptureIndex(observedShare, inscribedLoad, TREND_MULT[trend]);
    const succession = successionDurability({ bonds, rupture: R, covenants: Array.from({ length: covenants }, (_, i) => `Laboratory covenant ${i + 1}`) });
    const survival = succession?.percent ?? 0;
    const escrow = escrowWaterfall(DEFAULT_ESCROW, {
      verifierSeated,
      communal: bonds.communal,
      institutional: bonds.institutional,
      intergenerational: bonds.intergenerational,
      trackGap: 0,
      trackTolerance: communalTolerance(bonds.communal).phases,
      survivalScore: survival,
      rupture: R,
    });
    const decay = decayHorizon(bonds, exposure, R, 180);
    const fracture = fractureWindow(reading.mean, decay.lambda);
    const dominum = dominumIndex({ bonds, rupture: R, survivalScore: survival, escrowReleasedPercent: escrow.released, escrowFrozen: escrow.frozen });
    return { reading, R, survival, trap: succession?.trap ?? true, escrow, decay, fracture, dominum };
  }, [bonds, observedShare, inscribedLoad, trend, verifierSeated, covenants, exposure]);

  const limitingLabel = BOND_LABELS[lab.reading.limitingIndex].label;
  const dominumReading = "index" in lab.dominum ? lab.dominum : null;

  const activeModule = MODULES[activeModIdx] ?? MODULES[0];
  const activeChapter = activeModule.chapters[activeChapIdx] ?? activeModule.chapters[0];

  // The six attestation gates, all locked until verified work opens them.
  const gates = useMemo(() => attestationGates({ answers: quizAnswers, stress: stressPass, covenantAffirmed }), [quizAnswers, stressPass, covenantAffirmed]);
  const gatesCleared = gates.filter((g) => g.satisfied).length;
  const allGates = canSeal(gates);
  const gateKey = gates.map((g) => (g.satisfied ? "1" : "0")).join("");

  // Record when each gate first passed in this session; a gate that closes again loses its time.
  useEffect(() => {
    setPassedAt((prev) => {
      const next: Record<string, string> = {};
      let changed = false;
      for (const g of gates) {
        if (g.satisfied) {
          next[g.id] = prev[g.id] ?? new Date().toISOString();
          if (!prev[g.id]) changed = true;
        } else if (prev[g.id]) changed = true;
      }
      return changed ? next : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gateKey]);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ answers: quizAnswers, covenantAffirmed, stress: stressPass, passedAt }));
    } catch {
      /* storage unavailable: progress stays in memory only */
    }
  }, [quizAnswers, covenantAffirmed, stressPass, passedAt]);

  const verifyStress = () => {
    const input = { bonds, observedShare, inscribedLoad, trend, namedBond };
    const verdict = evaluateStressSimulation(input);
    setStressMessage(verdict.reason);
    if (verdict.passed) setStressPass(stressRecord(input, verdict));
  };

  const handleSeal = async () => {
    if (!allGates) return;
    const record = buildAttestationRecord({ gates, stress: stressPass, passedAt, sealedAt: new Date() });
    const result = await sealAttestation(record, window.crypto.subtle);
    setSealed(result);
    setSealVerified(await verifyAttestation(result, window.crypto.subtle));
  };

  const copyRecord = async () => {
    if (!sealed) return;
    try {
      await navigator.clipboard.writeText(sealed.canonical);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  const flatIndex = (ch: DetailedAcademyChapter | null) => (ch ? FLAT_CHAPTERS.findIndex((x) => x.chapter.id === ch.id) : -1);
  const lectureIdx = flatIndex(selectedLecture);

  // Reader position: saved per chapter in sessionStorage on close, offered back on reopen.
  const storage = () => {
    try {
      return typeof window === "undefined" ? null : window.sessionStorage;
    } catch {
      return null;
    }
  };
  const progressRef = useRef(0);
  const [resumeAt, setResumeAt] = useState<number | null>(null);
  const onProgress = useCallback((p: number) => {
    progressRef.current = p;
  }, []);

  const openLecture = (ch: DetailedAcademyChapter) => {
    progressRef.current = 0;
    setResumeAt(loadPositions(storage())[ch.id] ?? null);
    setSelectedLecture(ch);
  };

  const closeLecture = useCallback(() => {
    // Read the position at the moment of closing, not from the last animation frame.
    const el = lectureRef.current;
    if (el) progressRef.current = readingProgress(el.scrollTop, el.scrollHeight, el.clientHeight);
    setSelectedLecture((cur) => {
      if (cur) savePosition(storage(), cur.id, progressRef.current);
      return null;
    });
    setResumeAt(null);
    // Focus returns to the button that opened the lecture once the dialog has unmounted.
    window.requestAnimationFrame(() => openerRef.current?.focus({ preventScroll: true }));
  }, []);

  const openLectureAt = (i: number) => {
    const target = FLAT_CHAPTERS[i];
    if (!target) return;
    const el = lectureRef.current;
    if (selectedLecture) savePosition(storage(), selectedLecture.id, el ? readingProgress(el.scrollTop, el.scrollHeight, el.clientHeight) : progressRef.current);
    setActiveModIdx(target.mIdx);
    setActiveChapIdx(target.cIdx);
    progressRef.current = 0;
    setResumeAt(loadPositions(storage())[target.chapter.id] ?? null);
    setSelectedLecture(target.chapter);
    lectureRef.current?.scrollTo({ top: 0 });
  };

  const resume = () => {
    const el = lectureRef.current;
    if (el && resumeAt !== null) el.scrollTo({ top: resumeAt * (el.scrollHeight - el.clientHeight) });
    setResumeAt(null);
  };

  const handleResetSimulator = () => {
    setBonds(DEFAULT_LAB.bonds);
    setObservedShare(DEFAULT_LAB.observedShare);
    setInscribedLoad(DEFAULT_LAB.inscribedLoad);
    setTrend(DEFAULT_LAB.trend);
    setVerifierSeated(DEFAULT_LAB.verifierSeated);
    setCovenants(DEFAULT_LAB.covenants);
    setExposure(DEFAULT_LAB.exposure);
    setNamedBond(null);
    setStressMessage(null);
  };

  const ruptureTone = lab.R >= 60 ? "text-destructive" : lab.R >= 35 ? "text-brass" : "text-primary";
  const toggle = (on: boolean) =>
    `min-h-11 flex-1 px-2 py-1.5 text-[11px] font-mono border transition-colors motion-reduce:transition-none ${on ? "border-brass bg-accent/20 text-primary font-semibold" : "border-border/50 text-muted-foreground hover:text-primary"}`;

  /** The Interactive Relational Laboratory: the capstone practicum, carrying Gate 5. */
  const renderLaboratory = () => (
    <div className="@container my-6 border border-brass/60 bg-card p-4 sm:p-5 space-y-4 text-[14px] leading-normal" data-testid="academy-laboratory">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={15} className="text-accent" aria-hidden />
          <h4 className="font-serif text-lg text-primary">Interactive Relational Laboratory</h4>
        </div>
        <Button variant="ghost" size="sm" onClick={handleResetSimulator} className="min-h-11 text-xs gap-1 text-muted-foreground">
          <RotateCcw size={12} aria-hidden /> Reset
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        Move the state vector and the stress inputs to watch the Liebig minimum, the Rupture Index, the escrow, succession, decay and the Dominum Index respond. Every reading below is computed by the desks' own functions; the track gap is taken as zero (the tracks in step).
      </p>

      <div className="grid gap-3 @[40rem]:grid-cols-2 text-xs">
        {BOND_LABELS.map(({ key, label }) => (
          <div key={key} className="space-y-1.5 border border-border/40 p-3 bg-card/40 min-w-0">
            <div className="flex flex-wrap justify-between gap-x-2 font-mono">
              <label htmlFor={`lab-${key}`} className="text-muted-foreground">{label}</label>
              <span className="font-bold text-primary tabular-nums">{bonds[key].toFixed(1)} / 5.0 · {bondBand(bonds[key])}</span>
            </div>
            <input id={`lab-${key}`} type="range" min="1.0" max="5.0" step="0.1" value={bonds[key]}
              onChange={(e) => setBonds((b) => ({ ...b, [key]: parseFloat(e.target.value) }))}
              className="academy-range w-full accent-brass cursor-pointer" />
          </div>
        ))}
      </div>

      <div className="grid gap-3 @[40rem]:grid-cols-2 pt-2 border-t border-border/40 text-xs">
        <div className="space-y-1.5 min-w-0">
          <label className="text-muted-foreground font-mono" htmlFor="lab-observed">Observed tripwire share: {observedShare} / 100</label>
          <input id="lab-observed" type="range" min="0" max="100" step="1" value={observedShare} onChange={(e) => setObservedShare(parseInt(e.target.value))} className="academy-range w-full accent-accent cursor-pointer" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-muted-foreground font-mono" htmlFor="lab-inscribed">Inscribed load: {inscribedLoad} / {INSCRIBED_LOAD_CAP}</label>
          <input id="lab-inscribed" type="range" min="0" max={INSCRIBED_LOAD_CAP} step="1" value={inscribedLoad} onChange={(e) => setInscribedLoad(parseInt(e.target.value))} className="academy-range w-full accent-accent cursor-pointer" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <label className="text-muted-foreground font-mono" htmlFor="lab-exposure">Unmitigated exposure U: {exposure}</label>
          <input id="lab-exposure" type="range" min="0" max="100" step="0.5" value={exposure} onChange={(e) => setExposure(parseFloat(e.target.value))} className="academy-range w-full accent-accent cursor-pointer" />
        </div>
        <div className="space-y-1.5 min-w-0">
          <span className="text-muted-foreground font-mono">Trend multiplier</span>
          <div className="flex flex-wrap gap-2">
            {(["improving", "static", "deteriorating"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setTrend(t)} aria-pressed={trend === t} className={`${toggle(trend === t)} uppercase tracking-wider`}>
                {t} ×{TREND_MULT[t].toFixed(2)}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 min-w-0">
          <span className="text-muted-foreground font-mono">Covenants in force</span>
          <div className="flex gap-2">
            {[0, 1, 2].map((n) => (
              <button key={n} type="button" onClick={() => setCovenants(n)} aria-pressed={covenants === n} className={toggle(covenants === n)}>{n}</button>
            ))}
          </div>
        </div>
        <div className="space-y-1.5 min-w-0">
          <span className="text-muted-foreground font-mono">Independent verifier</span>
          <button type="button" onClick={() => setVerifierSeated((v) => !v)} aria-pressed={verifierSeated} className={`w-full ${toggle(verifierSeated)} uppercase tracking-wider`}>
            {verifierSeated ? "Seated" : "Not seated"}
          </button>
        </div>
      </div>

      <div className="grid gap-3 @[34rem]:grid-cols-2 @[52rem]:grid-cols-3 pt-3 border-t border-brass/30 font-mono text-xs" aria-live="polite">
        <div className="border border-border/50 bg-background/50 p-2.5 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase">Liebig Minimum</p>
          <p className={`mt-1 text-sm font-bold ${lab.reading.limitingScore <= 3.0 ? "text-destructive" : "text-primary"}`}>{lab.reading.limitingScore.toFixed(1)} / 5.0</p>
          <p className="mt-0.5 text-[10px] text-accent">{limitingLabel} · {bondBand(lab.reading.limitingScore)}{lab.reading.limitingScore <= 3.0 ? " · breaches the 3.0 floor" : " · holds the floor"}</p>
        </div>
        <div className="border border-border/50 bg-background/50 p-2.5 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase">Rupture Index (R)</p>
          <p className={`mt-1 text-sm font-bold ${ruptureTone}`}>{lab.R} / 100</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{ruptureBand(lab.R)} band</p>
        </div>
        <div className="border border-border/50 bg-background/50 p-2.5 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase">Escrow Released</p>
          <p className={`mt-1 text-sm font-bold ${lab.escrow.frozen ? "text-destructive" : "text-primary"}`}>{lab.escrow.released}%</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{lab.escrow.frozen ? "Frozen at R of 60 or more" : `${lab.escrow.tranches.filter((t) => t.met).length} of 4 tranches met`}</p>
        </div>
        <div className="border border-border/50 bg-background/50 p-2.5 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase">Succession Durability</p>
          <p className={`mt-1 text-sm font-bold ${lab.trap ? "text-destructive" : "text-primary"}`}>{lab.survival.toFixed(1)}%</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{lab.trap ? "Below the 55% Succession Trap" : "Clears the Succession Trap"}</p>
        </div>
        <div className="border border-border/50 bg-background/50 p-2.5 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase">Decay Horizon</p>
          <p className="mt-1 text-sm font-bold text-primary">{lab.decay.halfLifeDays === null ? "Half-life ∞" : `Half-life ${lab.decay.halfLifeDays.toFixed(1)} d`}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">λ {lab.decay.lambda.toFixed(4)} · fracture {lab.fracture.days === null ? "∞" : `${lab.fracture.days} d`} ({lab.fracture.severity})</p>
        </div>
        <div className="border border-border/50 bg-background/50 p-2.5 min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase">Dominum Index (D)</p>
          <p className="mt-1 text-sm font-bold text-accent">{dominumReading ? `${dominumReading.index.toFixed(1)} / 100` : "Awaiting readings"}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">{dominumReading?.phase ?? ""}</p>
        </div>
      </div>

      {/* Gate 5: applied stress simulation */}
      <div className="mt-4 pt-3 border-t border-border/40 space-y-3" data-testid="stress-simulation">
        <p className="text-[11px] font-mono text-muted-foreground">
          Capstone Gate 5 · Applied stress simulation: drive the Rupture Index to {STRESS_THRESHOLD} or above, the Critical band, then name the limiting bond (the Liebig minimum) and verify.
        </p>
        <div className="grid grid-cols-1 gap-2 @[24rem]:grid-cols-2 @[48rem]:grid-cols-4">
          {BOND_KEYS.map((k) => {
            const lbl = BOND_LABELS.find((b) => b.key === k)!.label;
            return (
              <button key={k} type="button" aria-pressed={namedBond === k} onClick={() => setNamedBond(k)} className={toggle(namedBond === k)}>
                {lbl}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-muted-foreground" role="status">
            {stressMessage ?? (lab.R >= STRESS_THRESHOLD ? `Rupture Index ${lab.R}: Critical band reached, escrow frozen. Name the limiting bond.` : `Rupture Index ${lab.R}: raise the stress inputs until it reaches ${STRESS_THRESHOLD}.`)}
          </span>
          <Button size="sm" variant="outline" disabled={namedBond === null} onClick={verifyStress} className="min-h-11 text-xs border-brass/60 text-brass hover:bg-brass/10 font-mono gap-1">
            {stressPass ? <><Check size={12} aria-hidden /> Gate 5 Verified</> : "Verify Stress Simulation"}
          </Button>
        </div>
      </div>
    </div>
  );

  /** The six-gate attestation, all gates locked until verified work opens them. */
  const renderAttestation = () => (
    <div className="@container my-6 border-2 border-brass bg-card p-4 sm:p-6 space-y-6 text-[14px] leading-normal" data-testid="academy-attestation">
      <div className="text-center space-y-2">
        <Award size={40} className="mx-auto text-brass" aria-hidden />
        <h4 className="font-serif text-2xl text-primary font-normal">Sovereign Capstone & Gated Operator Attestation</h4>
        <p className="text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Attestation cannot be self-asserted or granted on faith. All {gates.length} gates are locked until verified work opens them, and the seal unlocks only at {gates.length} of {gates.length}.
        </p>
      </div>

      <div className="rounded-sm border border-border/70 bg-background/50 p-3 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-brass">Verification Manifest</span>
          <span className="font-mono text-[10px] text-muted-foreground" data-testid="gates-cleared">{gatesCleared} of {gates.length} Gates Satisfied</span>
        </div>
        <ol className="grid grid-cols-1 @[40rem]:grid-cols-2 gap-2 text-xs font-mono">
          {gates.map((g) => (
            <li key={g.id} data-gate-id={g.id} data-gate-state={g.satisfied ? "satisfied" : "locked"}
              className={`p-2.5 rounded-sm border flex items-start justify-between gap-2 min-w-0 ${g.satisfied ? "border-accent/60 bg-accent/10 text-accent" : "border-border/40 text-muted-foreground"}`}>
              <span className="min-w-0">
                <span className="block">Gate {g.number} · {g.label}</span>
                <span className="block text-[10px] opacity-80 break-words">{g.evidence}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1">{g.satisfied ? <><Check size={12} aria-hidden /> VERIFIED</> : <><Lock size={12} aria-hidden /> LOCKED</>}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="rounded-sm border border-border/60 bg-background/40 p-3 sm:p-4 space-y-3 text-xs text-muted-foreground">
        <p className="font-mono text-[10px] uppercase tracking-wider text-primary">Gate 6 · Practitioner Covenant</p>
        <p className="leading-relaxed">
          I will reject constructive ambiguity, preserve the Liebig minimum, report every figure as the bus computes it and never as a principal wishes it, refuse any reading the desks cannot produce, and maintain custodial care across every mandate I hold.
        </p>
        <Button size="sm" variant="outline" aria-pressed={covenantAffirmed} disabled={sealed !== null} onClick={() => setCovenantAffirmed((c) => !c)} className="min-h-11 h-auto whitespace-normal text-xs border-brass/60 font-mono gap-1">
          {covenantAffirmed ? <><Check size={12} aria-hidden /> Covenant Affirmed</> : "Affirm the Practitioner Covenant"}
        </Button>
      </div>

      <div className="pt-2 text-center space-y-4">
        {sealed ? (
          <div className="border border-accent/60 bg-accent/10 p-3 sm:p-5 rounded-sm space-y-3 text-left min-w-0" data-testid="attestation-sealed">
            <div className="flex flex-wrap items-center gap-2 text-accent font-bold text-xs font-mono">
              <CheckCircle2 size={16} aria-hidden />
              <span>ATTESTATION SEALED IN THIS BROWSER SESSION</span>
            </div>
            <p className="text-[11px] text-muted-foreground">{sealed.record.designation}</p>
            <div className="border-t border-border/40 pt-2 font-mono text-[10px] text-primary break-all">
              <span className="text-muted-foreground">SHA-256 Digest: </span>
              <span data-testid="attestation-digest">{sealed.digest}</span>
            </div>
            <p className={`font-mono text-[10px] break-words ${sealVerified ? "text-accent" : "text-destructive"}`} data-testid="attestation-stamp">
              {sealVerified === null
                ? "Verifying the digest"
                : sealVerified
                  ? `Verification stamp: digest recomputed over the canonical record and matched · ${gates.length} of ${gates.length} gates · sealed ${sealed.record.sealedAtUtc}`
                  : "Verification failed: the recomputed digest does not match"}
            </p>
            <details className="text-[10px] text-muted-foreground">
              <summary className="min-h-11 flex items-center cursor-pointer font-mono text-primary">Canonical attestation record (JSON)</summary>
              <pre className="mt-2 max-h-56 overflow-auto whitespace-pre-wrap break-all border border-border/40 bg-background/60 p-2 font-mono">{sealed.canonical}</pre>
            </details>
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" variant="outline" onClick={copyRecord} className="min-h-11 text-xs font-mono gap-1 border-brass/60">
                <Copy size={12} aria-hidden /> {copied ? "Record Copied" : "Copy Record JSON"}
              </Button>
            </div>
            <p className="text-[10px] text-muted-foreground italic">{sealed.record.disclaimer}</p>
          </div>
        ) : (
          <Button
            disabled={!allGates}
            onClick={handleSeal}
            data-testid="seal-attestation"
            className={`min-h-11 h-auto whitespace-normal font-mono text-xs tracking-wider uppercase px-6 py-3 rounded-sm border ${
              allGates ? "border-brass bg-brass/25 hover:bg-brass/35 text-primary shadow-lg cursor-pointer" : "border-border/60 bg-muted/40 text-muted-foreground cursor-not-allowed opacity-60"
            }`}
          >
            {allGates ? `Seal Attestation (All ${gates.length} Gates Cleared)` : `Attestation Locked · ${gatesCleared} of ${gates.length} Gates`}
          </Button>
        )}
      </div>
    </div>
  );

  const toc: ReaderTocEntry[] = selectedLecture
    ? [
        { id: "lecture-overview", label: "Chapter Overview" },
        ...selectedLecture.sections.map((s, i) => ({ id: `lecture-s-${i}`, label: s.heading, sub: s.subheading })),
        ...(selectedLecture.quiz.length ? [{ id: "lecture-quiz", label: LECTURE_HEADINGS.quiz }] : []),
        ...(selectedLecture.readingList?.length ? [{ id: "lecture-reading", label: "Sources & Reading List" }] : []),
      ]
    : [];

  return (
    <div className="py-2">
      {/* Academy Masthead */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-brass/40 pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <GraduationCap size={18} className="text-accent" aria-hidden />
            <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground">The Sovereign Chancellery Academy</p>
          </div>
          <h1 className="mt-1 font-serif text-2xl text-primary sm:text-3xl">Curriculum of the UDCA</h1>
          <p className="mt-1 text-xs text-muted-foreground">Master the jurisprudence, relational mathematics, and instrument telemetry of sovereign statecraft.</p>
        </div>
        <Button variant="outline" size="sm" onClick={onExit} className="min-h-11 self-start sm:self-auto gap-1.5 border-brass/50 hover:border-brass">
          <ArrowLeft size={13} aria-hidden />
          Return to Mission Foyer
        </Button>
      </div>

      <GoldRule className="my-4" />

      {/* Main Layout: Module Sidebar + Chapter Page (Tier 1) */}
      <div className="mt-6 grid gap-6 lg:grid-cols-12">
        <aside className="min-w-0 lg:col-span-4 space-y-4">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground">Curriculum Directory</p>
          <div className="space-y-3" data-testid="academy-directory">
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
                    data-module-id={mod.id}
                    aria-expanded={isSelected}
                  >
                    <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-accent">{mod.eyebrow}</p>
                    <h2 className="mt-1 font-serif text-sm font-semibold text-primary" style={{ fontSize: "0.95rem", lineHeight: 1.3 }}>{mod.title}</h2>
                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{mod.summary}</p>
                  </button>

                  {isSelected && (
                    <div className="mt-3 space-y-1 border-t border-border/40 pt-2">
                      {mod.chapters.map((chap, cIdx) => {
                        const isChapActive = cIdx === activeChapIdx;
                        return (
                          <button
                            key={chap.id}
                            type="button"
                            onClick={() => setActiveChapIdx(cIdx)}
                            data-chapter-id={chap.id}
                            aria-current={isChapActive ? "page" : undefined}
                            className={`flex min-h-11 w-full items-center justify-between px-2 py-1.5 text-xs text-left transition-colors ${
                              isChapActive ? "bg-accent/15 text-primary font-medium" : "text-muted-foreground hover:text-primary"
                            }`}
                          >
                            <span className="min-w-0 pr-2">{chapterHeading(chap)}</span>
                            <ChevronRight size={12} className={`shrink-0 ${isChapActive ? "text-accent" : "opacity-40"}`} aria-hidden />
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
              <ShieldCheck size={13} className="text-accent" aria-hidden />
              Air-Gapped Sovereign Curriculum
            </p>
            <p>All progress is preserved strictly within browser session memory. No data is transmitted externally.</p>
          </div>
        </aside>

        <main className="min-w-0 lg:col-span-8 border border-brass/50 bg-card/70 p-5 sm:p-8" data-testid="academy-chapter" data-chapter-id={activeChapter.id}>
          <ChapterTier1
            module={activeModule}
            chapter={activeChapter}
            position={activeChapIdx}
            onOpen={() => openLecture(activeChapter)}
            openerRef={openerRef}
          />

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
              className="min-h-11 text-xs gap-1"
            >
              <ChevronLeft size={13} aria-hidden /> Previous Chapter
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
              className="min-h-11 text-xs gap-1 border-brass/50 hover:border-brass text-primary"
            >
              Next Chapter <ChevronRight size={13} aria-hidden />
            </Button>
          </div>
        </main>
      </div>

      {/* Tier 2: the near-full-page lecture reader */}
      {selectedLecture && (
        <AcademyReader
          number={selectedLecture.number}
          eyebrow={ACADEMY_CURRICULUM[FLAT_CHAPTERS[lectureIdx]?.mIdx ?? 0]?.eyebrow ?? selectedLecture.eyebrow}
          title={selectedLecture.title}
          minutes={readingMinutes(selectedLecture)}
          toc={toc}
          scrollRef={lectureRef}
          onClose={closeLecture}
          onProgress={onProgress}
        >
          <article className="mx-auto w-full max-w-[1040px] px-4 pb-10 pt-6 sm:px-5 md:px-8 md:pt-10 text-[16px] leading-[1.65] md:text-[17px] xl:text-[18px] xl:leading-[1.7]" data-testid="lecture-body">
            {/* Lecture title block: the same eyebrow, title and lede as the chapter page */}
            <div className={`${PROSE} space-y-3`}>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-brass">{selectedLecture.eyebrow}</p>
              <h3 className="font-serif text-3xl font-normal leading-tight text-primary md:text-4xl">{chapterHeading(selectedLecture)}</h3>
              <p className="border-l-2 border-brass pl-4 italic text-foreground">
                <MathText text={selectedLecture.executiveLede} />
              </p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1"><Clock size={13} className="text-brass" aria-hidden /> Reading time {readingMinutes(selectedLecture)} min</span>
                <span>{selectedLecture.estimatedMinutes} minute lecture and practicum</span>
              </p>
              <p className="font-mono text-[10px] text-brass/90">Principal Architect: James Wesley Ndua | Sovereign Relational Infrastructure</p>
            </div>

            {resumeAt !== null && (
              <div className={`${PROSE} mt-5 flex flex-wrap items-center justify-between gap-2 border border-brass/50 bg-brass/10 px-3 py-2 text-sm`} role="status" data-testid="reader-resume">
                <span className="text-primary">You left this lecture {Math.round(resumeAt * 100)}% of the way through.</span>
                <span className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={resume} className="min-h-11 text-xs font-mono border-brass/60">Resume reading</Button>
                  <Button size="sm" variant="ghost" onClick={() => setResumeAt(null)} className="min-h-11 text-xs font-mono">Start at the top</Button>
                </span>
              </div>
            )}

            {/* Chapter overview: the lecture's opening, read before Section I */}
            <section id="lecture-overview" tabIndex={-1} className="mt-8 scroll-mt-4 border-t border-border/40 pt-6 outline-none" data-lecture-section="overview">
              <div className={`${PROSE} space-y-4`}>
                <h4 className="font-serif text-2xl font-normal text-primary">Chapter Overview</h4>
                {selectedLecture.synopsis.map((p, i) => (
                  <p key={i} className="text-foreground/90"><MathText text={p} /></p>
                ))}
              </div>
            </section>

            {selectedLecture.sections.map((section, sIdx) => (
              <section key={sIdx} id={`lecture-s-${sIdx}`} tabIndex={-1} data-lecture-section={sIdx} className="mt-10 scroll-mt-4 border-t border-border/40 pt-6 outline-none">
                <div className={`${PROSE} space-y-1`}>
                  <h4 className="font-serif text-2xl font-normal text-primary">{section.heading}</h4>
                  {section.subheading && <p className="font-mono text-xs tracking-wide text-brass">{section.subheading}</p>}
                </div>

                <div className={`${PROSE} mt-4 space-y-4 text-foreground/90`}>
                  {section.paragraphs.map((p, pIdx) => (
                    <p key={pIdx}><MathText text={p} /></p>
                  ))}
                </div>

                {section.formulas?.map((f) => (
                  <div key={f.id} className="academy-breakout min-w-0 text-[14px] leading-normal"><AcademyFormulaBlock formula={f} /></div>
                ))}

                {section.caseStudy && (
                  <div className="my-6 rounded-sm border border-border/70 bg-background/60 p-4 sm:p-5 space-y-3 text-[15px] leading-relaxed">
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2">
                      <span className="font-mono text-[10px] font-semibold uppercase text-accent tracking-wider">Historical Treaty Autopsy & Precedent Analysis</span>
                      <span className="font-mono text-[10px] text-muted-foreground">{section.caseStudy.jurisdiction}</span>
                    </div>
                    <h5 className="font-serif text-lg text-primary font-medium">{section.caseStudy.title}</h5>
                    <p className="font-mono text-xs text-brass">Precedent: {section.caseStudy.precedent}</p>
                    <div className="space-y-2 text-muted-foreground">
                      {section.caseStudy.analysis.map((item, aIdx) => (
                        <p key={aIdx}><MathText text={item} /></p>
                      ))}
                    </div>
                    <div className="border-t border-border/40 pt-2 text-sm text-destructive/90">
                      <span className="font-bold">Failure Mechanism: </span>
                      <MathText text={section.caseStudy.failureMechanism} />
                    </div>
                  </div>
                )}

                {section.subsections?.map((sub, subIdx) => (
                  <div key={subIdx} className={`${PROSE} mt-8 space-y-4 text-foreground/90`} data-lecture-subsection={`${sIdx}-${subIdx}`}>
                    <h5 className="font-serif text-xl font-normal text-primary">{sub.title}</h5>
                    {sub.paragraphs.map((p, pIdx) => (
                      <p key={pIdx}><MathText text={p} /></p>
                    ))}
                    {sub.callout && (
                      <aside
                        className={`rounded-sm border-l-2 p-4 text-[0.95em] leading-relaxed ${sub.callout.kind === "bridge" ? "border-brass bg-brass/5" : "border-accent bg-accent/5"}`}
                        aria-label={`${sub.callout.kind === "bridge" ? "Bridge to the code" : "Key definition"}: ${sub.callout.title}`}
                      >
                        <p className="font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {sub.callout.kind === "bridge" ? "Bridge to the code" : "Key definition"}
                        </p>
                        <p className="mt-1 font-serif text-base text-primary">{sub.callout.title}</p>
                        <div className="mt-2 space-y-2">
                          {sub.callout.paragraphs.map((p, cIdx) => (
                            <p key={cIdx}><MathText text={p} /></p>
                          ))}
                        </div>
                      </aside>
                    )}
                  </div>
                ))}

                {section.statutoryRule && (
                  <div className={`${PROSE} my-5 border-l-2 border-accent bg-accent/5 p-3 font-mono text-xs leading-relaxed text-accent`}>
                    <MathText text={section.statutoryRule} />
                  </div>
                )}

                {/* Section VI instrument cutaway: read-only, never on the bus */}
                {section.instrument && <AcademyInstrument kind={section.instrument} />}

                {section.practicum?.includes("laboratory") && renderLaboratory()}
                {section.practicum?.includes("attestation") && renderAttestation()}
              </section>
            ))}

            {selectedLecture.quiz.length > 0 && (
              <section id="lecture-quiz" tabIndex={-1} className="mt-12 scroll-mt-4 border-t-2 border-brass/40 pt-8 outline-none" data-testid="lecture-quiz">
                <div className={`${PROSE} space-y-3`}>
                  <div className="flex items-center gap-2">
                    <HelpCircle size={18} className="text-brass" aria-hidden />
                    <h4 className="font-serif text-2xl font-normal text-primary">{LECTURE_HEADINGS.quiz}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedLecture.drillType
                      ? "Practice questions on the drill. Module V questions do not gate the seal; Gates 1 to 4 are the knowledge checks of Modules I to IV."
                      : "Answer every question correctly to open this module's knowledge-check gate on the capstone attestation. Your answers are kept for this browser session, including when you close the lecture."}
                  </p>
                </div>

                {selectedLecture.practice && selectedLecture.practice.length > 0 && (
                  <div className={`${PROSE} mt-6 space-y-5 text-foreground/90`} data-testid="lecture-practice">
                    <h5 className="font-serif text-xl font-normal text-primary">Practice Problems with Worked Answers</h5>
                    {selectedLecture.practice.map((pr, prIdx) => (
                      <div key={prIdx} className="space-y-2 rounded-sm border border-border/60 bg-background/50 p-4 sm:p-5">
                        <p className="font-medium text-foreground"><span className="font-mono text-brass">Problem {prIdx + 1}. </span><MathText text={pr.problem} /></p>
                        {pr.solution.map((p, sIdx2) => (
                          <p key={sIdx2} className="text-muted-foreground"><MathText text={p} /></p>
                        ))}
                      </div>
                    ))}
                    <h5 className="font-serif text-xl font-normal text-primary">Knowledge-Check Questions</h5>
                  </div>
                )}

                <div className={`${PROSE} mt-6 space-y-6`}>
                  {selectedLecture.quiz.map((q, qIdx) => {
                    const selectedOptId = quizAnswers[q.id];
                    const selectedOpt = q.options.find((o) => o.id === selectedOptId);
                    return (
                      <fieldset key={q.id} className="rounded-sm border border-border/60 bg-background/50 p-4 sm:p-5 space-y-3" data-question-id={q.id}>
                        <legend className="sr-only">Question {qIdx + 1}</legend>
                        <p className="font-medium text-foreground">
                          {qIdx + 1}. <MathText text={q.question} />
                        </p>
                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const isSelected = selectedOptId === opt.id;
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => setQuizAnswers((prev) => ({ ...prev, [q.id]: opt.id }))}
                                aria-pressed={isSelected}
                                className={`flex min-h-11 w-full items-start gap-2 rounded-sm border p-3 text-left text-sm transition-colors motion-reduce:transition-none ${
                                  isSelected
                                    ? opt.correct
                                      ? "border-accent/60 bg-accent/10 text-accent font-medium"
                                      : "border-destructive/60 bg-destructive/10 text-destructive font-medium"
                                    : "border-border/50 bg-card hover:border-brass/50 text-muted-foreground"
                                }`}
                              >
                                <span className="font-mono font-bold uppercase shrink-0">{opt.id.slice(-1)}.</span>
                                <span><MathText text={opt.text} /></span>
                              </button>
                            );
                          })}
                        </div>
                        {selectedOpt && (
                          <div className={`mt-3 rounded-sm border p-3 text-sm leading-relaxed ${selectedOpt.correct ? "border-accent/40 bg-accent/5 text-accent" : "border-destructive/40 bg-destructive/5 text-destructive/90"}`} role="status">
                            <span className="mb-1 flex items-center gap-1 font-mono text-xs font-bold">
                              {selectedOpt.correct ? <><Check size={12} aria-hidden /> DOCTRINAL VALIDATION CONFIRMED</> : <><X size={12} aria-hidden /> REJECTED BY DOCTRINAL INVARIANT</>}
                            </span>
                            <p><MathText text={selectedOpt.explanation} /></p>
                          </div>
                        )}
                      </fieldset>
                    );
                  })}
                </div>
              </section>
            )}

            {selectedLecture.readingList && selectedLecture.readingList.length > 0 && (
              <section id="lecture-reading" tabIndex={-1} className="mt-12 scroll-mt-4 border-t border-border/40 pt-6 outline-none" data-testid="lecture-reading-list">
                <div className={`${PROSE} space-y-4`}>
                  <h4 className="font-serif text-2xl font-normal text-primary">Sources &amp; Reading List</h4>
                  <ol className="list-decimal space-y-3 pl-5 text-[0.95em] text-foreground/90">
                    {selectedLecture.readingList.map((r, rIdx) => (
                      <li key={rIdx} className="break-words">
                        {r.url ? (
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-primary underline decoration-brass/60 underline-offset-2 hover:decoration-brass focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            {r.citation}
                          </a>
                        ) : (
                          <span className="text-primary">{r.citation}</span>
                        )}
                        <span className="block text-muted-foreground">{r.note}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {/* Lecture Footer Navigation (every module) */}
            <nav className="mt-12 grid grid-cols-1 gap-2 border-t border-border/60 pt-6 sm:grid-cols-3 sm:items-center" aria-label="Lecture navigation" data-testid="lecture-footer">
              <Button variant="outline" disabled={lectureIdx <= 0} onClick={() => openLectureAt(lectureIdx - 1)} className="min-h-12 justify-self-stretch sm:justify-self-start border-border/70 text-xs font-mono gap-1">
                <ChevronLeft size={14} aria-hidden /> Previous Chapter
              </Button>
              <Button variant="outline" onClick={closeLecture} className="min-h-12 justify-self-stretch sm:justify-self-center border-brass/50 text-xs font-mono gap-1">
                <ArrowLeft size={14} aria-hidden /> Return to Syllabus
              </Button>
              <Button disabled={lectureIdx < 0 || lectureIdx >= FLAT_CHAPTERS.length - 1} onClick={() => openLectureAt(lectureIdx + 1)} className="min-h-12 justify-self-stretch sm:justify-self-end border border-brass/50 bg-brass/20 hover:bg-brass/30 text-primary text-xs font-mono gap-1">
                Next Chapter <ChevronRight size={14} aria-hidden />
              </Button>
            </nav>
            <div className="mt-4 flex justify-center">
              <Button
                variant="ghost"
                onClick={() => {
                  const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
                  lectureRef.current?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
                }}
                className="min-h-11 text-[11px] font-mono gap-1 text-muted-foreground"
              >
                Back to Top of Lecture <ArrowUp size={12} aria-hidden />
              </Button>
            </div>
          </article>
        </AcademyReader>
      )}
    </div>
  );
}

/** The reading column: body text capped near 70 characters, centred in the reader. */
const PROSE = "mx-auto max-w-[70ch]";

/**
 * Tier 1 chapter page, identical for all twenty chapters: number and eyebrow, title,
 * executive lede, statutory notice, reading time, learning outcomes and the button that
 * opens the lecture. Every other piece of a chapter lives inside the lecture.
 */
export function ChapterTier1({
  module,
  chapter,
  position,
  onOpen,
  openerRef,
}: {
  module: DetailedAcademyModule;
  chapter: DetailedAcademyChapter;
  position: number;
  onOpen: () => void;
  openerRef?: RefObject<HTMLButtonElement>;
}) {
  return (
    <div data-testid="chapter-tier-1">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-[0.18em] text-accent">
        <span>{module.eyebrow}</span>
        <span aria-hidden>·</span>
        <span>Chapter {position + 1} of {module.chapters.length}</span>
      </div>

      <h2 className="mt-2 font-serif text-2xl text-primary sm:text-3xl leading-snug">{chapterHeading(chapter)}</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90 font-medium border-l-2 border-brass pl-3.5 py-0.5" data-testid="chapter-lede">
        <MathText text={chapter.executiveLede} />
      </p>

      <GoldRule className="my-5" />

      <div className="border-l-2 border-primary bg-primary/5 px-4 py-3 text-xs text-primary/90" data-testid="chapter-statutory-notice">
        <span className="font-semibold text-primary">Statutory Rule: </span>
        <MathText text={chapter.statutoryNotice} />
      </div>

      <div className="mt-5 border border-border/50 bg-background/40 p-4 text-xs" data-testid="chapter-outline">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="flex items-center gap-1 text-brass"><Clock size={12} aria-hidden /> Reading time {readingMinutes(chapter)} min</span>
          <span>{chapter.estimatedMinutes} minute lecture and practicum</span>
        </p>
        <div className="mt-3">
          <p className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-primary">
            <ListChecks size={12} className="text-brass" aria-hidden /> Learning outcomes
          </p>
          <ul className="mt-1.5 space-y-1 text-muted-foreground" data-testid="chapter-outcomes">
            {chapter.learningOutcomes.map((o, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-brass font-bold" aria-hidden>•</span>
                <span><MathText text={o} /></span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <Button
          ref={openerRef}
          onClick={onOpen}
          data-testid="open-lecture"
          className="min-h-11 h-auto whitespace-normal border border-brass bg-brass/20 hover:bg-brass/30 text-primary font-mono text-xs tracking-wider uppercase px-5 py-2.5 flex items-center gap-2"
        >
          <BookOpen size={14} className="text-brass shrink-0" aria-hidden />
          <span>Open Full Chapter Lecture & Practicum</span>
          <ChevronRight size={14} className="shrink-0" aria-hidden />
        </Button>
      </div>
    </div>
  );
}
