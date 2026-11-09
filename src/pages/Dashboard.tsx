import DeskErrorBoundary from "@/components/desk/DeskErrorBoundary";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Archive, ArrowLeft, BookOpen, ChevronDown, GitBranch, Keyboard, Maximize2, Minimize2, Monitor, MoreHorizontal, PanelRight, ScrollText, Search, Shield, ShieldAlert, ShieldCheck, ShieldOff, Siren, SlidersHorizontal, Timer, Volume2, VolumeX, X } from "lucide-react";
import ChancelleryWire from "@/components/desk/ChancelleryWire";
import StatutoryClearanceBar from "@/components/desk/StatutoryClearanceBar";
import { THEATRES, type TheatreId } from "@/components/desk/theatres";
import { toast } from "sonner";
import { tick, seal, soundEnabled, setSoundEnabled, onSoundChange } from "@/lib/chancelleryHaptics";
import { supabase } from "@/integrations/supabase/client";
import { getOfflineSession, clearOfflineSession, raceAuth } from "@/lib/offlineAuth";
import type { Session } from "@supabase/supabase-js";
import SEO from "@/components/SEO";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import { DOMAINS } from "@/content/cases";
import { PARTIES } from "@/content/parties";
import SovereignInscriptionTray from "@/components/desk/SovereignInscriptionTray";
import DeskOutput, { BinderContext, DeskMetaContext, ExportNoticeContext, type BinderEntry } from "@/components/desk/DeskOutput";
import { guardSignalPatch } from "@/components/desk/signalGuard";
import { MissionContext, EMPTY_PROFILE, DEFAULT_BONDS, sanitizeBonds, type MissionProfile } from "@/components/desk/mission";
import { EngineContext, applyInscriptions, breachesFloor, bondBand, mathReading, stageGateAudit, telemetryLines, type Signals } from "@/components/desk/engine";
import TelemetryStrip from "@/components/desk/TelemetryStrip";
import MissionChain, { deskIsLive, downstreamOf } from "@/components/desk/MissionChain";
import MissionVault from "@/components/desk/MissionVault";
import SessionLedgerDrawer, { useLedgerWatch } from "@/components/desk/SessionLedger";
import { clearLedger, decisionRecords, ledgerEntries, logDecision, logEvent, restoreLedger, useSessionLedger } from "@/components/desk/ledgerStore";
import EnclaveLockScreen from "@/components/desk/EnclaveLockScreen";
import { ChancellerySentinel, useSentinel } from "@/components/desk/ChancellerySentinel";
import { SENTINEL_SIGN_OUT_MINUTES, enclaveState, lockEnclave, openSnapshot, sealSnapshot, setIdleSealed, useEnclave } from "@/lib/chancelleryEnclave";
import { executePanicPurge, purgeVolatileState } from "@/lib/panicPurge";
import { sanitizeOnBlur, sanitizeOnDrop, sanitizeOnPaste } from "@/lib/sanitizeFields";
import SaveSession from "@/components/desk/SaveSession";
import CommandPalette, { ShortcutSheet } from "@/components/CommandPalette";
import type { PaletteAction } from "@/components/commandIndex";
import { DoctrineAnchors } from "@/components/DoctrinalTooltip";
import { useSovereignHotkeys, stepDesk } from "@/hooks/useSovereignHotkeys";
import { PrivacyProvider, usePrivacy } from "@/components/desk/PrivacyContext";
import HandoverSealBadge from "@/components/desk/HandoverSealBadge";
import { canonicalSeal, clearSeal, computeSealHash, createSeal, readSeal, sealDifferences, sealPayload, sealStatus, writeSeal, type HandoverSeal } from "@/components/desk/handoverSeal";
import { changedKeys, recordPublication, resetBusMonitor } from "@/components/desk/busMonitor";
import { execSummary } from "@/components/desk/executiveBrief";
import { MANIFEST_FORMAT, type ManifestBody } from "@/components/desk/DiplomaticCableExport";
import { missionSlug } from "@/components/desk/executiveBrief";
import type { WireTab } from "@/components/desk/ChancelleryWire";
import RehearsalDrawer, { type RehearsalTab } from "@/components/mode/RehearsalDrawer";
import { BASELINE_ID, createBranch, deleteBranch, emptyBranchStore, readBranches, switchPosture, writeBranches, type BranchStore, type PostureState } from "@/components/mode/postureBranches";
import { LexiconDrawer } from "@/components/desk/Lexicon";
import { ChancelleryBreviary } from "@/components/desk/ChancelleryBreviary";
import { canonicalJson, mintChancelleryApostille, verifyChancelleryApostille } from "@/components/desk/registry";
import MissionFoyer, { type FoyerAction } from "@/components/mode/MissionFoyer";
import LocalDataDialog from "@/components/mode/LocalDataDialog";
import ModeHeader, { ModeBadges, modeStatusText, type HeaderAction } from "@/components/mode/ModeHeader";
import ContextTray, { type TrayTab } from "@/components/mode/ContextTray";
import DeskGuide from "@/components/mode/DeskGuide";
import DeskOrientation from "@/components/mode/DeskOrientation";
import { dismissOrientation, orientationInvited } from "@/components/mode/orientation";
import { storageUsage } from "@/components/mode/localPersistence";
import { Button } from "@/components/ui/button";
import {
  BranchDialog,
  BriefDialog,
  DerivativeDialog,
  ImpactDialog,
  LifecycleDialog,
  PickerDialog,
  PromotionDialog,
  ReplayDialog,
  ReportDialog,
  ScenarioLibraryDialog,
  WarrantDialog,
  type Impact,
} from "@/components/mode/ModeDialogs";
import { DESK_GUIDES, scenarioById, theatreForScenario, type Scenario, type SpineStage } from "@/components/mode/scenarios";
import {
  DERIVED_NOTICE,
  EMPTY_WARRANT,
  TRAINING_NOTICE,
  afterActionReview,
  blankState,
  branchWorkspace,
  continueFromSealed,
  createCustomWorkspace,
  createPresetWorkspace,
  deriveTraining,
  newId,
  openQuestionCount,
  promoteToCustom,
  warrantToProfile,
  type ContextEntry,
  type DeskState,
  type Warrant,
  type Workspace,
} from "@/components/mode/workspace";
import { readActiveId, readMode, useWorkspaceStore, writeActiveId, writeMode } from "@/components/mode/workspaceStore";
import { useNetworkState } from "@/components/mode/ui";

// All 18 desks are bundled statically with the dashboard so that mounting or
// switching desks never fetches a chunk: an air-gapped terminal has every desk
// in memory the moment /dashboard renders.
import BondDiagnostic from "@/components/BondDiagnostic";
import CableComposer from "@/components/CableComposer";
import PatternMatcher from "@/components/PatternMatcher";
import DeltaSimulator from "@/components/desk/DeltaSimulator";
import AuditBench from "@/components/AuditBench";
import LitigationWorkbench from "@/components/LitigationWorkbench";
import AdversarialChamber from "@/components/AdversarialChamber";
import ClauseArchitect from "@/components/desk/ClauseArchitect";
import SentinelMatrix from "@/components/desk/SentinelMatrix";
import ReadinessDesk, { GATE_DESK } from "@/components/desk/ReadinessDesk";
import CounterpartPrompter from "@/components/desk/CounterpartPrompter";
import SuccessionSimulator from "@/components/desk/SuccessionSimulator";
import MissionBinder from "@/components/desk/MissionBinder";
import TrackSequencer from "@/components/desk/TrackSequencer";
import ClauseRedliner from "@/components/desk/ClauseRedliner";
import MultiPartySequencer from "@/components/desk/MultiPartySequencer";
import CompoundShockTester from "@/components/desk/CompoundShockTester";
import VerificationLedger from "@/components/desk/VerificationLedger";
import HandoverProtocol from "@/components/desk/HandoverProtocol";
import MirrorDesk from "@/components/desk/MirrorDesk";


/** Without an unsealed enclave, an idle terminal signs out after the Sentinel's 15 minutes. */
const IDLE_MS = SENTINEL_SIGN_OUT_MINUTES * 60 * 1000;

const DIVISIONS = [
  { id: "assess", label: "I. Assessment and early warning", short: "I. Assess" },
  { id: "engage", label: "II. Diplomatic engagement", short: "II. Engage" },
  { id: "legal", label: "III. Legal architecture", short: "III. Legal" },
  { id: "govern", label: "IV. Mission governance", short: "IV. Govern" },
] as const;

const DESKS = [
  {
    id: "diagnostics",
    division: "assess",
    label: "Diagnostics",
    eyebrow: "§3B · Assessment",
    title: "Bond diagnostic and pattern matching",
    note: "Score the four bonds for a live theatre, then match the profile against the eight documented cases.",
  },
  {
    id: "sentinel",
    division: "assess",
    label: "Sentinel Matrix",
    eyebrow: "§15 · Early Warning",
    title: "Sentinel Matrix (The Eye of Humanity)",
    note: "The Eye of Humanity is the descriptive name of this existing early-warning desk. Record observed warning signs across the four bonds and read the rupture index and latent traps. A rule-based assessment, not surveillance or a prediction.",
  },
  {
    id: "compound",
    division: "assess",
    label: "Compound Shock",
    eyebrow: "§12C · Rupture Model",
    title: "Compound shock and rupture stress test",
    note: "Apply several shocks at once, read the amplified strain, and see which provision breaks first.",
  },
  {
    id: "mirror",
    division: "assess",
    label: "Comparative Mirror",
    eyebrow: "VII · Cross-Theatre",
    title: "The cross-theatre diagnostic mirror",
    note: "Select two or three documented theatres and read them against one rubric.",
  },
  {
    id: "briefing",
    division: "engage",
    label: "Briefing Desk",
    eyebrow: "§12B · Chancellery",
    title: "Compose a chancellery memorandum",
    note: "Assemble a formal memorandum from the documented case record, the §9A scripts, and the §12 protocols.",
  },
  {
    id: "counterpart",
    division: "engage",
    label: "Counterpart Prompter",
    eyebrow: "§9A · Meeting",
    title: "Counterpart protocol prompter",
    note: "Walk a meeting phase by phase with examination questions, custom wording and recorded counterpart tactics.",
  },
  {
    id: "multiparty",
    division: "engage",
    label: "De-confliction Bench",
    eyebrow: "§9A · Multi-Party",
    title: "Multi-party sequencing and de-confliction",
    note: "Seat delegations at the table and calculate multi-party friction matrices across all bilateral pairs.",
  },
  {
    id: "tracks",
    division: "engage",
    label: "Track Sequencing",
    eyebrow: "§9B · Sequencing",
    title: "Track I and Track II sequencing",
    note: "Keep the principals' track and the communal track in step, and see the gap before it becomes an elite pact.",
  },
  {
    id: "audit",
    division: "engage",
    label: "Field Audit",
    eyebrow: "VI.A · Safeguard",
    title: "Stakeholder field audit",
    note: "Review one affected party at a time before an assessment is treated as ready for use.",
  },
  {
    id: "clauses",
    division: "legal",
    label: "Clause Architect",
    eyebrow: "§12 · Drafting",
    title: "Continuity provision architect",
    note: "Draft treaty clauses that bind offices, not officeholders, and survive a change of leadership.",
  },
  {
    id: "redliner",
    division: "legal",
    label: "Clause Redliner",
    eyebrow: "§12 · Review",
    title: "Clause redliner and anti-theatrics audit",
    note: "Paste a draft provision and read it against the doctrine's seven recorded failure modes, with substitute wording.",
  },
  {
    id: "succession",
    division: "legal",
    label: "Succession Simulator",
    eyebrow: "§12C · Stress Test",
    title: "Treaty stress and succession simulator",
    note: "Test a drafted instrument against leadership change, funding loss and capture, and read which clause breaks first.",
  },
  {
    id: "legal",
    division: "legal",
    label: "Legal Desk",
    eyebrow: "§14 · Litigation",
    title: "Litigation preparation",
    note: "Compile a preparation checklist for a new matter from the doctrine's evidentiary and continuity rules.",
  },
  {
    id: "adversarial",
    division: "legal",
    label: "Adversarial Chamber",
    eyebrow: "Section X · Review",
    title: "Tested by its critics",
    note: "Rehearse the standing objections and the answers of record before facing them in a room.",
  },
  {
    id: "readiness",
    division: "govern",
    label: "Mission Readiness",
    eyebrow: "VI.A · Clearance",
    title: "Mission readiness clearance",
    note: "Clear a mission against the doctrine's protection and verification gates before deployment.",
  },
  {
    id: "verification",
    division: "govern",
    label: "Verification Ledger",
    eyebrow: "VIII · Compliance",
    title: "Independent verification and compliance ledger",
    note: "Seat the verifiers, fix the reporting interval, and read compliance against the three standing safeguards.",
  },
  {
    id: "handover",
    division: "govern",
    label: "Mandate Handover",
    eyebrow: "VI.B · Durability",
    title: "Mandate handover and durability protocol",
    note: "Test whether the settlement has taken root locally before the external presence departs, and draft the handover instrument.",
  },
  {
    id: "binder",
    division: "govern",
    label: "Mission Binder",
    eyebrow: "Consolidation · Master Dossier",
    title: "Consolidated mission binder",
    note: "Compile the documents you added from any desk into one numbered master briefing. Save it to a mission archive to keep it past this session.",
  },
] as const;



/** Doctrines each desk relies on, rendered as Breviary tooltips at the head of the desk. */
const DESK_DOCTRINES: Record<string, string[]> = {
  multiparty: ["uti-possidetis", "pacta-sunt-servanda"],
  clauses: ["pacta-sunt-servanda", "rebus-sic-stantibus", "material-breach", "jus-cogens"],
  redliner: ["pacta-sunt-servanda", "rebus-sic-stantibus", "material-breach", "force-majeure", "new-york-convention-v"],
  succession: ["rebus-sic-stantibus", "pacta-sunt-servanda"],
  legal: ["provisional-measures", "new-york-convention-v", "icsid-54", "icsid-55", "sovereign-immunity"],
  readiness: ["pacta-sunt-servanda", "uti-possidetis", "material-breach"],
  verification: ["material-breach", "pacta-sunt-servanda"],
  handover: ["rebus-sic-stantibus", "uti-possidetis"],
};

/** Lets the command palette toggle the redaction shroud, which lives in context. */
function PrivacyBridge({ toggleRef }: { toggleRef: React.MutableRefObject<() => void> }) {
  const { toggle } = usePrivacy();
  toggleRef.current = toggle;
  return null;
}

/** Header shield: Presentation Privacy Mode (Redaction Shroud). Lifting needs a second click within 4 s. */
function PrivacyButton() {
  const { masked, toggle, unmaskArmed } = usePrivacy();
  const label = !masked ? "Enable the presentation privacy mask (Alt+M)" : unmaskArmed ? "Click again to lift the presentation privacy mask" : "Lift the presentation privacy mask (Alt+M, twice)";
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={masked}
      className={`inline-flex items-center gap-1.5 transition-colors ${masked ? "text-accent" : "text-primary hover:text-accent"}`}
      title={label}
      aria-label={label}
      data-testid="privacy-button"
      data-armed={unmaskArmed ? "true" : undefined}
    >
      {masked ? <ShieldOff size={13} /> : <Shield size={13} />}
      <span className="hidden sm:inline">{masked ? (unmaskArmed ? "Confirm" : "Masked") : "Mask"}</span>
    </button>
  );
}

/** Mission Operations Deck tool button: one height for every tool, so the row never grows. */
const deckBtn = (on: boolean) =>
  `inline-flex h-8 min-w-8 shrink-0 items-center justify-center gap-1.5 border px-2 transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-brass/60 ${on ? "border-accent/40 bg-accent/10 text-accent" : "border-transparent text-primary hover:border-border hover:text-accent"}`;

/**
 * Band 1 · Chancellery Sentinel strip (36 px, pinned): canary status, the minimal bus
 * reading, the inactivity countdown, the presentation mask and the panic purge. It reads
 * the Sentinel; the timer, canary and panic keys stay owned by ChancellerySentinel.
 */
function SentinelStrip({ inFoyer, deskLabel, bondMean, rupture }: { inFoyer: boolean; deskLabel?: string; bondMean?: number; rupture?: number }) {
  const { idleRemainingMs, canaryAlerts, now, panic } = useSentinel();
  // The purge needs a second press inside the same 4 s window as the mask; compared
  // against the Sentinel's clock, so the strip keeps no timer of its own.
  const [armedAt, setArmedAt] = useState<number | null>(null);
  const armed = armedAt !== null && Date.now() - armedAt <= 4000 && now - armedAt <= 4000;
  const floor = bondMean !== undefined && breachesFloor(bondMean);
  const mmss = (ms: number) => {
    const t = Math.ceil(ms / 1000);
    return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
  };
  return (
    <div className="sticky top-0 z-40 h-9 border-b border-brass/60 bg-background/95 backdrop-blur" data-testid="sentinel-strip">
      <div className="container flex h-9 items-center gap-2 sm:gap-3 overflow-hidden text-[9px] sm:text-[10px] uppercase tracking-[0.14em] font-semibold text-primary">
        <span className={`inline-flex shrink-0 items-center gap-1 ${canaryAlerts ? "text-destructive" : "text-primary/80"}`} title={canaryAlerts ? `${canaryAlerts} DOM integrity alert(s)` : "DOM canary: no foreign script or frame detected"} data-testid="strip-canary">
          {canaryAlerts ? <ShieldAlert size={12} aria-hidden /> : <ShieldCheck size={12} aria-hidden />}
          <span className="hidden sm:inline">{canaryAlerts ? `Canary · ${canaryAlerts}` : "Sentinel"}</span>
        </span>
        {inFoyer ? (
          <span className="min-w-0 truncate text-muted-foreground normal-case tracking-normal font-normal">Mission Foyer: no mission open</span>
        ) : (
          <>
            {deskLabel && <span className="hidden min-w-0 truncate md:inline">{deskLabel}</span>}
            <span className="shrink-0 text-muted-foreground" data-testid="strip-bond-mean">
              <span className="normal-case">μ</span>B <span className={floor ? "text-destructive" : "text-primary"}>{bondMean !== undefined ? bondMean.toFixed(2) : "—"}</span>
            </span>
            <span className="shrink-0 text-muted-foreground" data-testid="strip-rupture">
              <span className="hidden sm:inline">Rupture </span><span className="sm:hidden">R </span>
              <span className={(rupture ?? 0) >= 60 ? "text-destructive" : "text-primary"}>{rupture !== undefined ? `${rupture}%` : "—"}</span>
            </span>
          </>
        )}
        <span className="ml-auto inline-flex shrink-0 items-center gap-1 font-mono tabular-nums text-muted-foreground" title="Inactivity countdown: the workspace seals or signs out when it reaches zero" data-testid="strip-idle">
          <Timer size={12} aria-hidden />
          {idleRemainingMs === null ? "—" : mmss(idleRemainingMs)}
        </span>
        <PrivacyButton />
        <button
          type="button"
          onClick={() => {
            if (armed) {
              setArmedAt(null);
              panic();
              return;
            }
            setArmedAt(Date.now());
          }}
          className={`inline-flex shrink-0 items-center gap-1 transition-colors ${armed ? "text-destructive" : "text-primary hover:text-destructive"}`}
          title={armed ? "Press again to purge now" : "Panic purge (Ctrl+Shift+X or Escape three times). Press twice to confirm."}
          aria-label={armed ? "Confirm the panic purge" : "Panic purge, press twice to confirm"}
          data-testid="strip-panic"
          data-armed={armed ? "true" : undefined}
        >
          <Siren size={12} aria-hidden />
          <span className="hidden sm:inline">{armed ? "Confirm purge" : "Panic"}</span>
        </button>
      </div>
    </div>
  );
}

/**
 * The integrated theatre preset selector on the deck. A navigation select (data-shroud-nav):
 * it stays usable under the mask, and its option labels pass through the mask itself.
 */
function TheatrePresetSelect({ value, custom, onChange }: { value: string; custom: boolean; onChange: (id: string) => void }) {
  const { mask } = usePrivacy();
  return (
    <label className="relative inline-flex shrink-0 items-center" title={`Theatre preset: hydrates all desks. Training scenarios with illustrative readings, not field measurements.${custom ? " Applying one to this mission shows its impact first and is recorded in the Decision Record." : ""}`}>
      <span className="sr-only">Theatre preset · hydrates all desks</span>
      <select
        data-shroud-nav
        data-testid="theatre-preset"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-36 sm:w-44 2xl:w-52 appearance-none border border-brass/50 bg-background pl-2 pr-6 font-mono text-[10px] uppercase tracking-[0.1em] text-primary"
      >
        <option value="">{value ? "Detach preset" : "Theatre preset…"}</option>
        {THEATRES.map((t) => (
          <option key={t.id} value={t.id}>
            {t.sigil} · {mask(t.name)}
          </option>
        ))}
      </select>
      <ChevronDown size={12} className="pointer-events-none absolute right-1.5 text-primary/70" />
    </label>
  );
}

function offlineSessionAsSession(): Session | null {
  const o = getOfflineSession();
  return o ? ({ user: { id: o.userId, email: o.email } } as unknown as Session) : null;
}

/** Bus publishers whose name differs from the desk that hosts them. */
const BUS_PUBLISHER_DESK: Record<string, string> = { shocks: "compound", asymmetry: "multiparty" };

export default function Dashboard() {
  // Hydrated synchronously: an offline field session (or a disconnected terminal)
  // renders on the first frame instead of waiting on cloud auth.
  const [session, setSession] = useState<Session | null>(() => offlineSessionAsSession());
  const [ready, setReady] = useState<boolean>(() => !navigator.onLine || !!getOfflineSession());
  const [division, setDivision] = useState<(typeof DIVISIONS)[number]["id"]>("assess");
  const [desk, setDesk] = useState<(typeof DESKS)[number]["id"]>("diagnostics");
  // Desks stay mounted once opened, so their inputs survive switching and they keep publishing.
  const [visited, setVisited] = useState<Set<string>>(() => new Set(["diagnostics"]));
  useEffect(() => {
    setVisited((v) => (v.has(desk) ? v : new Set(v).add(desk)));
  }, [desk]);
  const navigate = useNavigate();
  const [binder, setBinder] = useState<BinderEntry[]>([]);
  const [profile, setProfile] = useState<MissionProfile>(EMPTY_PROFILE);
  // The mission engine: every desk publishes its readings here, and every
  // downstream desk reads them. Held in memory only, like the binder.
  const [signals, setSignals] = useState<Signals>({});
  // Mirror of the bus for the Signal Inspector's publisher tracking; never read by a desk.
  const busRef = useRef<Signals>({});
  busRef.current = signals;
  // Custom missions record nothing from a desk until the operator has worked it:
  // a desk's starting values are not an assessment. Preset missions publish at once.
  const customRef = useRef(false);
  const engagedRef = useRef<Set<string>>(new Set());
  const [engageEpoch, setEngageEpoch] = useState(0);
  const engageDesk = useCallback((id: string) => {
    if (!customRef.current || engagedRef.current.has(id)) return;
    engagedRef.current.add(id);
    setEngageEpoch((n) => n + 1);
  }, []);
  const publish = useCallback((desk: string, raw: Signals) => {
    const owner = BUS_PUBLISHER_DESK[desk] ?? desk;
    if (customRef.current && DESKS.some((d) => d.id === owner) && !engagedRef.current.has(owner)) return;
    // Every publication is validated at the bus boundary; refused ones never reach a desk.
    const patch = guardSignalPatch(desk, raw);
    if (!patch || !Object.keys(patch).length) return;
    const moved = changedKeys(busRef.current, patch);
    if (moved.length) {
      busRef.current = { ...busRef.current, ...patch };
      recordPublication(desk, moved);
    }
    setSignals((prev) => {
      return changedKeys(prev, patch).length ? { ...prev, ...patch } : prev;
    });
  }, []);
  // The effective state every desk reads: raw publications with Sovereign inscriptions applied.
  const effective = useMemo(() => applyInscriptions(signals), [signals]);
  const engineValue = useMemo(() => ({ signals: effective, publish, epoch: engageEpoch }), [effective, publish, engageEpoch]);
  // Session ledger: real operational events from the bus and the dispatch registry, in memory only.
  useLedgerWatch(effective);
  // The bond scores live on the mission profile, so presets, archives and saved
  // sessions reach the bond bench. Bond Diagnostic runs controlled from here.
  const bonds = profile.bonds ?? DEFAULT_BONDS;
  const setBonds = useCallback((b: typeof DEFAULT_BONDS) => setProfile((p) => ({ ...p, bonds: b })), []);
  // When bonds arrive from a preset or archive while another desk is open, put the
  // numeric readings on the bus at once so downstream desks never read stale bonds.
  useEffect(() => {
    if (!profile.bonds) return;
    const b = sanitizeBonds(profile.bonds);
    const v: [number, number, number, number] = [b.interpersonal, b.communal, b.intergenerational, b.institutional];
    let w = 0;
    v.forEach((x, i) => { if (x < v[w]) w = i; });
    const mean = v.reduce((a, c) => a + c, 0) / 4;
    publish("diagnostics", {
      bonds: b,
      bondMean: Math.round(mean * 100) / 100,
      weakestBond: DOMAINS[w],
      weakestScore: v[w],
      weakestBand: bondBand(v[w]),
      bondVariance: mathReading(v).variance,
      communalBand: bondBand(b.communal),
    });
  }, [profile.bonds, publish]);
  const addToBinder = useCallback((e: BinderEntry) => {
    setBinder((prev) => (prev.some((x) => x.id === e.id) ? prev.map((x) => (x.id === e.id ? e : x)) : [...prev, e]));
  }, []);
  // Desk-tagged binder adds, so the navigation rail can show which desks have staged excerpts.
  const deskRef = useRef<string>("diagnostics");
  useEffect(() => {
    deskRef.current = desk;
  }, [desk]);
  const addFromDesk = useCallback((e: BinderEntry) => addToBinder({ ...e, desk: e.desk ?? deskRef.current }), [addToBinder]);

  // The theatre named in the mission profile rides the bus, so the registry sigil follows it.
  useEffect(() => {
    const t = profile.theatre.trim();
    if ((signals.theatre ?? "") !== t) publish("mission", { theatre: t || undefined });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.theatre, signals.theatre]);

  // Omni-theatre hydration: write the preset profile and bond vector, then bump the
  // preset epoch so every mounted desk re-seeds its own inputs and republishes.
  // All desks are mounted (kept alive, hidden) so the whole chain moves at once.
  const hydrateTheatre = (id: TheatreId | "") => {
    const t = THEATRES.find((x) => x.id === id);
    if (!t) {
      publish("preset", { presetId: "" });
      return;
    }
    setProfile((p) => ({ ...p, theatre: t.name, parties: t.parties, bonds: t.bonds }));
    publish("preset", { presetId: t.id, presetEpoch: (signals.presetEpoch ?? 0) + 1 });
    logEvent("MISSION_HYDRATED", `${t.name} (theatre preset)`);
    setVisited(new Set(DESKS.map((d) => d.id)));
  };

  // SCIF / Amber Field terminal mode: a token swap on the root, kept for this tab only.
  const [scif, setScif] = useState(false);
  useEffect(() => {
    try {
      setScif(sessionStorage.getItem("vs:scif") === "1");
    } catch {
      // sessionStorage unavailable: mode stays off.
    }
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("scif", scif);
    try {
      sessionStorage.setItem("vs:scif", scif ? "1" : "0");
    } catch {
      // ignore
    }
    return () => document.documentElement.classList.remove("scif");
  }, [scif]);

  // Chancellery Focus view and discrete tactile audio (muted by default).
  const [focus, setFocus] = useState(false);
  // Mission Operations Deck: at most one panel (vault, ledger, controls) open under the deck.
  const [panel, setPanel] = useState<"vault" | "ledger" | "controls" | null>(null);
  // The desk's doctrinal note stays collapsed until asked for.
  // Remembered for this browser session only, so the operator's choice survives desk switches and reloads.
  const [noteOpen, setNoteOpenRaw] = useState(() => {
    try { return sessionStorage.getItem("vs:noteOpen") === "1"; } catch { return false; }
  });
  const setNoteOpen = (f: (v: boolean) => boolean) =>
    setNoteOpenRaw((v) => {
      const n = f(v);
      try { sessionStorage.setItem("vs:noteOpen", n ? "1" : "0"); } catch { /* storage unavailable */ }
      return n;
    });
  const bandRef = useRef<HTMLDivElement>(null);
  // Keep the active desk visible in the band's horizontal scroller (phones and tablets).
  // Only scrollLeft moves, so the page itself never jumps.
  useEffect(() => {
    const band = bandRef.current;
    const el = band?.querySelector<HTMLElement>(`[data-desk="${desk}"]`);
    if (!band || !el) return;
    const b = band.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    if (r.left < b.left || r.right > b.right) band.scrollLeft += r.left - b.left - (b.width - r.width) / 2;
  }, [desk, division]);
  const [sound, setSound] = useState(false);
  useEffect(() => {
    setSound(soundEnabled());
    return onSoundChange(setSound);
  }, []);

  // A stage-gate audit that clears (every gate passing) sounds the seal chime once.
  const gateAudit = stageGateAudit(effective);
  const gatesLocked = gateAudit.locked;
  // Desks that resolve a failed stage-gate; flagged in the desk band once Mission Readiness has been opened.
  const remedialDesks = new Map<string, string[]>();
  for (const g of gateAudit.gates) {
    const host = GATE_DESK[g.name];
    if (!g.passed && host) remedialDesks.set(host.id, [...(remedialDesks.get(host.id) ?? []), g.name]);
  }
  const wasLocked = useRef(gatesLocked);
  useEffect(() => {
    if (wasLocked.current && !gatesLocked) seal();
    wasLocked.current = gatesLocked;
  }, [gatesLocked]);

  const moveEntry = (id: string, dir: -1 | 1) =>
    setBinder((prev) => {
      const i = prev.findIndex((x) => x.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  useEffect(() => {
    let cancelled = false;
    const settle = (next: Session | null) => {
      if (cancelled) return;
      setSession(next);
      setReady(true);
      if (!next) navigate("/login", { replace: true });
    };
    // A cloud auth event never replaces a valid offline session with nothing.
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      if (cancelled) return;
      const offline = offlineSessionAsSession();
      if (!s && offline) {
        setSession(offline);
        return;
      }
      if (!s && !navigator.onLine) return;
      setSession(s);
      if (!s) navigate("/login", { replace: true });
    });
    if (!navigator.onLine) {
      // Disconnected: no cloud request is attempted at all.
      settle(offlineSessionAsSession());
    } else {
      // Online: cloud auth gets a short head start. If it stalls, an offline field
      // session takes over at once; with none, the cloud answer is still awaited
      // rather than signing out a valid account on a slow link.
      const cloud = supabase.auth.getSession().then((r) => r.data.session).catch(() => null);
      raceAuth(cloud).then((res) => {
        if (res.settled) return settle(res.value ?? offlineSessionAsSession());
        const stand = offlineSessionAsSession();
        if (stand) return settle(stand);
        cloud.then((s) => settle(s ?? offlineSessionAsSession()));
      });
    }
    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [navigate]);

  const signOut = useCallback(async () => {
    clearOfflineSession();
    writeActiveId(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Offline: the local session is cleared regardless.
    }
    navigate("/login", { replace: true });
  }, [navigate]);

  // Idle guard, run by the Chancellery Sentinel (one timer, one set of listeners).
  // With the enclave unsealed and an idle seal chosen (15 minutes by default), an
  // unattended terminal seals itself: the working state is sealed into IndexedDB,
  // then it and the key are cleared from memory until the passphrase is entered.
  // Otherwise (no passphrase, enclave not unsealed, or the seal turned off) an idle
  // terminal signs out after IDLE_MS: a lock screen anyone could dismiss would
  // protect nothing.
  const enclave = useEnclave();
  const idleSealArmed = enclave.configured && enclave.unlocked && enclave.idleMinutes > 0;
  // Development-only hook so QA can exercise the seal without waiting minutes.
  const idleTestMs = import.meta.env.DEV ? Number(globalThis.sessionStorage?.getItem("vs:idle-test-ms")) || 0 : 0;
  const workRef = useRef({ profile, binder, signals, division, desk });
  workRef.current = { profile, binder, signals, division, desk };
  const sealForIdle = useCallback(async () => {
    if (!session) return;
    try {
      const w = workRef.current;
      await sealSnapshot(`idle:${session.user.id}`, { ...w, ledger: ledgerEntries().map(({ at, kind, detail }) => ({ at, kind, detail })) });
    } catch {
      // The working state could not be sealed: fall back to the plain idle sign-out.
      void signOut();
      return;
    }
    lockEnclave();
    setIdleSealed(true);
    setProfile({ ...EMPTY_PROFILE });
    setBinder([]);
    setSignals({});
    clearLedger();
    resetBusMonitor();
  }, [session, signOut]);
  const idleMs = session ? idleTestMs || (idleSealArmed ? enclave.idleMinutes * 60 * 1000 : IDLE_MS) : null;
  const onIdle = idleSealArmed ? () => void sealForIdle() : () => void signOut();

  // Panic purge (Sentinel: Ctrl+Shift+X or Escape three times within 600 ms).
  // The desks unmount at once, memory and browser storage are wiped, the vault
  // database is deleted, the clipboard is overwritten, the session is signed out
  // and the practitioner lands on sign-in. Only this page navigates.
  const [purged, setPurged] = useState(false);
  const panicPurge = useCallback(() => {
    setPurged(true);
    setProfile({ ...EMPTY_PROFILE });
    setBinder([]);
    setSignals({});
    setSavedAt(null);
    workRef.current = { profile: { ...EMPTY_PROFILE }, binder: [], signals: {}, division: "assess", desk: "diagnostics" };
    resetBusMonitor();
    purgeVolatileState();
    void (async () => {
      const cap = <T,>(p: Promise<T>, ms: number) => Promise.race([p, new Promise<void>((r) => setTimeout(r, ms))]);
      await cap(executePanicPurge(), 2500);
      clearOfflineSession();
      try {
        await cap(supabase.auth.signOut(), 1500);
      } catch {
        // Offline: the local token copy was already removed by the purge.
      }
      purgeVolatileState();
      toast.error("PANIC PURGE EXECUTED. Memory zeroized.");
      navigate("/login", { replace: true });
    })();
  }, [navigate]);

  // Unsealing restores the sealed working state: the idle snapshot first; after a
  // reload, the sealed saved session, but only onto an untouched dashboard.
  type WorkSnapshot = { profile?: MissionProfile; binder?: BinderEntry[]; signals?: Signals; division?: string; desk?: string; savedAt?: string; ledger?: { at: string; kind: string; detail: string }[] };
  const sawLocked = useRef(false);
  useEffect(() => {
    if (!session) return;
    if (enclave.configured && !enclave.unlocked) {
      sawLocked.current = true;
      return;
    }
    if (!enclave.unlocked || !sawLocked.current) return;
    sawLocked.current = false;
    void (async () => {
      const uid = session.user.id;
      const idle = await openSnapshot<WorkSnapshot>(`idle:${uid}`, true).catch(() => undefined);
      const w = workRef.current;
      const pristine = !w.profile.theatre.trim() && w.binder.length === 0;
      const snap = idle ?? (pristine ? await openSnapshot<WorkSnapshot>(`session:${uid}`).catch(() => undefined) : undefined);
      if (snap) {
        if (snap.profile) setProfile({ ...EMPTY_PROFILE, ...snap.profile, bonds: sanitizeBonds(snap.profile.bonds) });
        if (Array.isArray(snap.binder)) setBinder(snap.binder);
        if (snap.signals) setSignals(snap.signals);
        if (snap.division) setDivision(snap.division as typeof division);
        if (snap.desk) setDesk(snap.desk as typeof desk);
        if (!idle && snap.savedAt) setSavedAt(snap.savedAt);
        if (idle && Array.isArray(snap.ledger)) restoreLedger(snap.ledger as Parameters<typeof restoreLedger>[0]);
        if (!idle) logEvent("MISSION_HYDRATED", `${(snap.profile?.theatre ?? "").trim() || "Unnamed mission"} (sealed browser session)`);
      }
      setIdleSealed(false);
    })();
  }, [session, enclave.configured, enclave.unlocked]);

  // Saved session: kept on this device only, per signed-in account.
  const saveKey = session ? `vinculum-session:${session.user.id}` : null;
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const restoredRef = useRef(false);
  useEffect(() => {
    if (!saveKey || restoredRef.current) return;
    restoredRef.current = true;
    try {
      const raw = window.localStorage.getItem(saveKey);
      if (!raw) return;
      const s = JSON.parse(raw);
      if (s.profile) setProfile(s.profile.bonds ? { ...s.profile, bonds: sanitizeBonds(s.profile.bonds) } : s.profile);
      if (Array.isArray(s.binder)) setBinder(s.binder);
      if (s.signals) setSignals(s.signals);
      if (s.division) setDivision(s.division);
      if (s.desk) setDesk(s.desk);
      if (s.savedAt) setSavedAt(s.savedAt);
      logEvent("MISSION_HYDRATED", `${(s.profile?.theatre ?? "").trim() || "Unnamed mission"} (saved browser session)`);
    } catch {
      /* ignore a damaged save */
    }
  }, [saveKey]);
  // With the enclave configured the saved session is sealed into IndexedDB and no
  // plaintext copy is kept in localStorage.
  const saveSession = useCallback(async (): Promise<boolean> => {
    if (!saveKey || !session) return false;
    const stamp = new Date().toLocaleString();
    const payload = { profile, binder, signals, division, desk, savedAt: stamp };
    const st = enclaveState();
    try {
      if (st.configured) {
        if (!st.unlocked) {
          toast.error("The enclave is sealed. Enter the passphrase under Sovereign Enclave Security to save.");
          return false;
        }
        await sealSnapshot(`session:${session.user.id}`, payload);
        window.localStorage.removeItem(saveKey);
      } else {
        window.localStorage.setItem(saveKey, JSON.stringify(payload));
      }
    } catch {
      toast.error("This browser would not store the session.");
      return false;
    }
    setSavedAt(stamp);
    seal();
    return true;
  }, [saveKey, session, profile, binder, signals, division, desk]);

  // Setting a passphrase seals a plaintext saved session that is already on this device.
  useEffect(() => {
    if (!saveKey || !session || !enclave.configured || !enclave.unlocked) return;
    let raw: string | null = null;
    try {
      raw = window.localStorage.getItem(saveKey);
    } catch {
      return;
    }
    if (!raw) return;
    void (async () => {
      try {
        await sealSnapshot(`session:${session.user.id}`, JSON.parse(raw!));
        window.localStorage.removeItem(saveKey);
      } catch {
        // Left in place; retried on the next unseal.
      }
    })();
  }, [saveKey, session, enclave.configured, enclave.unlocked]);

  // Sovereign Navigation Hotkeys: one listener for [, ], ?, Esc, Ctrl/Cmd+K and Ctrl/Cmd+S.
  // Navigation keys are ignored while typing in a field; the panic keys stay with the Sentinel.
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [orientationOpen, setOrientationOpen] = useState(false);
  const [orientationDismissed, setOrientationDismissed] = useState(() => {
    try { return orientationInvited(window.localStorage); } catch { return false; }
  });
  const rememberOrientation = () => {
    setOrientationDismissed(true);
    try { dismissOrientation(window.localStorage); } catch { /* Preference only. */ }
  };
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [wireOpen, setWireOpen] = useState(false);
  const [wireTab, setWireTab] = useState<WireTab>("wire");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerTab, setDrawerTab] = useState<RehearsalTab>("branches");
  const privacyToggleRef = useRef<() => void>(() => {});
  const stepTo = (dir: -1 | 1) => {
    const n = stepDesk(DESKS, deskRef.current, dir);
    if (!n) return;
    setDivision(n.division);
    setDesk(n.id);
    tick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useSovereignHotkeys({
    palette: () => setPaletteOpen((o) => !o),
    save: () => void saveSession().then((ok) => ok && toast.success("Mission state saved to browser storage")),
    prev: () => stepTo(-1),
    next: () => stepTo(1),
    help: () => setShortcutsOpen(true),
    mask: () => privacyToggleRef.current(),
    // Radix closes its own dialogs, drawers and popovers; with none open, Escape leaves Focus view and folds the wire.
    escape: () => {
      if (orientationOpen) {
        setOrientationOpen(false);
        document.querySelector<HTMLButtonElement>('[data-testid="orientation-button"]')?.focus();
        return;
      }
      setFocus(false);
      setWireOpen(false);
    },
  });


  /* ---------------------------------------------------------------- */
  /* Two-mode mission environment: Preset Proving Ground and Custom    */
  /* Operational Mission. Browser-local workspaces wrap the same desk  */
  /* state; the desks still share readings only through the bus.       */
  /* ---------------------------------------------------------------- */
  const network = useNetworkState();
  const uid = session?.user.id ?? null;
  const wsStore = useWorkspaceStore(uid, !!session && !enclave.idleSealed && !purged, enclave);
  const putWs = wsStore.put;
  const [activeId, setActiveId] = useState<string | null>(() => readActiveId());
  const activeWs = wsStore.store.workspaces.find((w) => w.id === activeId);
  customRef.current = activeWs?.mode === "custom";
  useEffect(() => {
    engagedRef.current = new Set();
  }, [activeId, activeWs?.mode]);
  const activeRef = useRef<Workspace | undefined>(activeWs);
  activeRef.current = activeWs;
  // Bumped whenever a workspace is opened, so every desk remounts on that workspace's state.
  const [deskEpoch, setDeskEpoch] = useState(0);
  type DialogId =
    | "library" | "pick-exercise" | "pick-replay" | "pick-draft" | "pick-review" | "pick-sealed"
    | "new-mission" | "warrant" | "branch" | "replay" | "aar" | "brief" | "lifecycle" | "promote" | "derive" | "local-data";
  const [dialog, setDialog] = useState<DialogId | null>(null);
  const [trayOpen, setTrayOpen] = useState(false);
  const [trayTab, setTrayTab] = useState<TrayTab>("assumptions");
  const [impact, setImpact] = useState<Impact | null>(null);
  const [sealing, setSealing] = useState(false);
  const ledgerNow = useSessionLedger();
  const scenario = activeWs?.scenario ? scenarioById(activeWs.scenario.id) : undefined;
  // Re-read the stored mode whenever the open workspace changes.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const lastMode = useMemo(() => readMode(), [activeId]);
  const legacyKey = uid ? `vinculum-session:${uid}` : null;
  const legacyDraft = useMemo(() => {
    if (!legacyKey) return false;
    try {
      return !!window.localStorage.getItem(legacyKey);
    } catch {
      return false;
    }
    // Re-check storage after the store loads and after each save.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [legacyKey, wsStore.loaded, savedAt]);
  // Warn once per visit, before the browser refuses saves, that local storage is nearly full.
  const storageWarned = useRef(false);
  useEffect(() => {
    if (storageWarned.current || (!savedAt && wsStore.status !== "full")) return;
    let live = true;
    void storageUsage().then((u) => {
      if (!live || storageWarned.current || !(u.constrained || wsStore.status === "full")) return;
      storageWarned.current = true;
      toast.warning("Browser storage is nearly full", {
        description: "Export a backup from Local data. Nothing is removed automatically.",
        action: { label: "Local data", onClick: () => setDialog("local-data") },
        duration: 12000,
      });
    });
    return () => { live = false; };
  }, [savedAt, wsStore.status]);
  const exportNotice = activeWs?.mode === "preset" ? (activeWs.derived ? `${DERIVED_NOTICE}\n${TRAINING_NOTICE}` : TRAINING_NOTICE) : "";

  /* ---------------------------------------------------------------- */
  /* 13-point operational suite: posture branches, handover seal and   */
  /* the decision log of profile amendments. All browser-local.        */
  /* ---------------------------------------------------------------- */
  const [branchStore, setBranchStore] = useState<BranchStore>(() => emptyBranchStore(""));
  useEffect(() => {
    setBranchStore(activeId ? readBranches(activeId) : emptyBranchStore(""));
  }, [activeId]);
  const putBranches = (b: BranchStore) => {
    setBranchStore(b);
    writeBranches(b);
  };
  const branchActive = branchStore.workspaceId === activeId && branchStore.active !== BASELINE_ID;
  const livePosture: PostureState = { signals, bonds: profile.bonds };

  // Tamper-Evident Handover Seal: the canonical payload is recomputed on every change and hashed.
  const decisionsNow = useMemo(() => decisionRecords(ledgerNow), [ledgerNow]);
  const sealInput = useMemo(
    () => sealPayload({ profile, sessionId: activeId ?? "", tray: activeWs?.tray ?? [], signals, decisions: decisionsNow }),
    [profile, activeId, activeWs?.tray, signals, decisionsNow],
  );
  const [hSeal, setHSeal] = useState<HandoverSeal | null>(null);
  useEffect(() => setHSeal(readSeal(activeId)), [activeId]);
  // On every interaction or publication the current SHA-256 is recomputed and compared with the seal.
  const [liveHash, setLiveHash] = useState("");
  useEffect(() => {
    if (!hSeal) return;
    let live = true;
    computeSealHash(sealInput).then((h) => live && setLiveHash(h)).catch(() => undefined);
    return () => {
      live = false;
    };
  }, [sealInput, hSeal]);
  const [sealBusy, setSealBusy] = useState(false);
  // Equal canonical bytes give an equal digest, so the beacon never shows a stale "intact" while the hash computes.
  const sameBytes = !!hSeal && canonicalSeal(sealInput) === hSeal.canonical;
  const sealState = sealStatus(hSeal, sameBytes ? hSeal!.sealHash : liveHash === hSeal?.sealHash ? "" : liveHash, () => (hSeal ? sealDifferences(hSeal.canonical, sealInput) : []));

  // Profile metadata (theatre, envoy, parties, handling) amended: one decision per pause in typing.
  const profileMeta = `${profile.theatre}\u0000${profile.officer}\u0000${profile.parties}\u0000${profile.classification}`;
  const metaRef = useRef<{ key: string; ws: string | null } | null>(null);
  useEffect(() => {
    const prev = metaRef.current;
    if (!prev || prev.ws !== activeId) {
      metaRef.current = { key: profileMeta, ws: activeId };
      return;
    }
    if (prev.key === profileMeta) return;
    const t = window.setTimeout(() => {
      const [a, b] = [prev.key.split("\u0000"), profileMeta.split("\u0000")];
      const names = ["Theatre", "Envoy", "Parties", "Handling"];
      const changes = names.map((n, i) => (a[i] !== b[i] ? `${n} "${a[i] || "—"}" -> "${b[i] || "—"}"` : "")).filter(Boolean);
      if (changes.length) logDecision("00", "PROFILE_AMENDED", changes.join("; "));
      metaRef.current = { key: profileMeta, ws: activeId };
    }, 1200);
    return () => window.clearTimeout(t);
  }, [profileMeta, activeId]);

  const bootWorkspace = useCallback((w: Workspace) => {
    engagedRef.current = new Set();
    customRef.current = w.mode === "custom";
    busRef.current = w.state.signals;
    clearLedger();
    if (w.replay.length) restoreLedger(w.replay as Parameters<typeof restoreLedger>[0]);
    const d = DESKS.find((x) => x.id === w.state.desk) ?? DESKS[0];
    setProfile({ ...EMPTY_PROFILE, ...w.state.profile });
    setBinder(w.state.binder);
    setSignals(w.state.signals);
    setDivision(d.division);
    setDesk(d.id);
    setVisited(new Set(w.state.signals.presetId ? DESKS.map((x) => x.id) : [d.id]));
    setDeskEpoch((e) => e + 1);
    setActiveId(w.id);
    writeActiveId(w.id);
    writeMode(w.mode);
    setFocus(false);
    window.scrollTo({ top: 0 });
  }, []);

  // Reopen this tab's workspace after a reload; forget it if it is no longer stored.
  const bootedRef = useRef(false);
  useEffect(() => {
    if (!wsStore.loaded) return;
    const w = activeId ? wsStore.store.workspaces.find((x) => x.id === activeId) : undefined;
    if (activeId && !w) {
      setActiveId(null);
      writeActiveId(null);
      return;
    }
    if (!bootedRef.current) {
      bootedRef.current = true;
      if (w) bootWorkspace(w);
    }
  }, [wsStore.loaded, wsStore.store, activeId, bootWorkspace]);

  // Autosave the open workspace (never a sealed one, never during idle seal or purge).
  useEffect(() => {
    const w = activeRef.current;
    if (!w || w.lifecycle === "sealed" || purged || enclave.idleSealed || !session) return;
    const t = window.setTimeout(() => {
      const cur = activeRef.current;
      if (!cur || cur.id !== w.id || cur.lifecycle === "sealed") return;
      const base = branchActive ? branchStore.baseline : undefined;
      putWs({
        ...cur,
        state: { profile: base?.bonds ? { ...profile, bonds: base.bonds } : profile, binder, signals: base ? base.signals : signals, division, desk },
        replay: ledgerEntries().map(({ at, kind, detail }) => ({ at, kind, detail })),
        updatedAt: new Date().toISOString(),
      });
    }, 700);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, binder, signals, division, desk, ledgerNow.length, activeId, purged, enclave.idleSealed, session, branchActive]);

  if (!ready || !session || purged) return null;

  // The desk order is the chancellery lifecycle: assess, engage, draft, govern.
  const position = DESKS.findIndex((d) => d.id === desk);
  const active = DESKS[position];
  const prev = position > 0 ? DESKS[position - 1] : null;
  const next = position < DESKS.length - 1 ? DESKS[position + 1] : null;
  const deskList = DESKS.filter((d) => d.division === division);
  const goTo = (d: (typeof DESKS)[number]) => {
    setDivision(d.division);
    setDesk(d.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const openOrientation = () => {
    if (!activeWs) return toast("Open an exercise or mission to view the desk orientation.");
    rememberOrientation();
    setFocus(false);
    setOrientationOpen(true);
    window.scrollTo({ top: 0 });
  };
  const closeOrientation = (work = false) => {
    setOrientationOpen(false);
    if (work) {
      // Focus alone is not engagement; no control is clicked or altered.
      window.requestAnimationFrame(() => {
        const surface = document.querySelector<HTMLElement>(`.desk-surface[data-desk="${desk}"]`);
        const control = surface?.querySelector<HTMLElement>('input:not([type="hidden"]):not(:disabled), select:not(:disabled), textarea:not(:disabled), button:not(:disabled)');
        (control ?? document.getElementById("vs-desk-title"))?.focus();
      });
    } else document.querySelector<HTMLButtonElement>('[data-testid="orientation-button"]')?.focus();
  };

  const deskLabel = (id: string) => DESKS.find((d) => d.id === id)?.label ?? id;
  const now = () => new Date().toISOString();
  // While a posture branch is on the bus, the workspace keeps the baseline posture.
  const baselinePosture = branchActive ? branchStore.baseline : undefined;
  const captureState = (): DeskState => ({
    profile: baselinePosture?.bonds ? { ...profile, bonds: baselinePosture.bonds } : profile,
    binder,
    signals: baselinePosture ? baselinePosture.signals : signals,
    division,
    desk,
  });
  const liveReplay = () => ledgerEntries().map(({ at, kind, detail }) => ({ at, kind, detail }));
  /** Write a change to the open workspace. */
  const updateWs = (patch: Partial<Workspace>) => {
    const cur = activeRef.current;
    if (!cur) return;
    const next = { ...cur, ...patch, updatedAt: now() } as Workspace;
    activeRef.current = next;
    putWs(next);
  };
  /** Store the open workspace with its live state, then open another one. */
  const openWorkspace = (w: Workspace) => {
    const cur = activeRef.current;
    if (cur && cur.id !== w.id && cur.lifecycle !== "sealed") putWs({ ...cur, state: captureState(), replay: liveReplay(), updatedAt: now() });
    putWs(w);
    setDialog(null);
    bootWorkspace(w);
  };
  const workspaces = wsStore.store.workspaces;
  const recent = (list: Workspace[]) => [...list].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));

  const startScenario = (sc: Scenario) => {
    const t = theatreForScenario(sc);
    if (!t) return;
    const first = DESKS.find((d) => d.id === sc.sequence[0]) ?? DESKS[0];
    const state: DeskState = {
      profile: { ...EMPTY_PROFILE, theatre: t.name, parties: t.parties, bonds: { ...t.bonds }, classification: "Training exercise" },
      binder: [],
      signals: { presetId: t.id, presetEpoch: 1 },
      division: first.division,
      desk: first.id,
    };
    openWorkspace(createPresetWorkspace({ id: sc.id, version: sc.version, title: sc.title }, state));
    logEvent("MISSION_HYDRATED", `${sc.title} (training exercise, scenario v${sc.version})`);
  };

  const startMission = (warrant: Warrant, added: ContextEntry[]) => {
    const base = blankState();
    const w = createCustomWorkspace(warrant, { ...base, profile: warrantToProfile(warrant, base.profile) });
    openWorkspace({ ...w, tray: added });
    logEvent("MISSION_HYDRATED", `${w.title} (custom operational mission)`);
  };

  const importLegacy = () => {
    if (!legacyKey) return;
    try {
      const raw = window.localStorage.getItem(legacyKey);
      const s = raw ? JSON.parse(raw) : null;
      if (!s) return;
      const p: MissionProfile = s.profile ? { ...EMPTY_PROFILE, ...s.profile, ...(s.profile.bonds ? { bonds: sanitizeBonds(s.profile.bonds) } : {}) } : { ...EMPTY_PROFILE };
      const state: DeskState = { profile: p, binder: Array.isArray(s.binder) ? s.binder : [], signals: s.signals ?? {}, division: s.division ?? "assess", desk: s.desk ?? "diagnostics" };
      const w = createCustomWorkspace({ ...EMPTY_WARRANT, title: p.theatre.trim() || "Saved browser session", theatre: p.theatre, custodian: p.officer, handling: p.classification }, state);
      openWorkspace({ ...w, lineage: { kind: "import", note: "Imported from a saved browser session.", at: now() } });
    } catch {
      toast.error("The saved browser session could not be read. It has been left in place.");
    }
  };

  const onFoyer = (a: FoyerAction) => {
    const presets = recent(workspaces.filter((w) => w.mode === "preset"));
    if (a.kind === "continue-exercise") {
      if (presets[0]) openWorkspace(presets[0]);
    } else if (a.kind === "library" || a.kind === "new-exercise") setDialog("library");
    else if (a.kind === "replay") setDialog("pick-replay");
    else if (a.kind === "new-mission") setDialog("new-mission");
    else if (a.kind === "resume-draft") setDialog("pick-draft");
    else if (a.kind === "review-ready") setDialog("pick-review");
    else if (a.kind === "sealed") setDialog("pick-sealed");
    else if (a.kind === "local-data") setDialog("local-data");
  };

  const toFoyer = () => {
    const cur = activeRef.current;
    if (cur && cur.lifecycle !== "sealed") putWs({ ...cur, state: captureState(), replay: liveReplay(), updatedAt: now() });
    setTrayOpen(false);
    setDialog(null);
    setActiveId(null);
    writeActiveId(null);
    window.scrollTo({ top: 0 });
  };

  const sealActive = async (reason: string) => {
    const cur = activeRef.current;
    if (!cur || cur.lifecycle !== "ready") return;
    setSealing(true);
    try {
      const at = now();
      const decisions = [...cur.decisions, { id: newId("dc"), what: "Sealed this mission as a local snapshot", why: reason, at, status: "active" as const }];
      const entries = [
        ...binder.map((e) => ({ id: e.id, title: e.title, text: e.text })),
        { id: "mission-warrant", title: "Mission Warrant", text: canonicalJson(cur.warrant ?? {}) },
        { id: "context-tray", title: "Context Tray", text: canonicalJson(cur.tray) },
        { id: "decision-record", title: "Decision Record", text: canonicalJson(decisions) },
      ];
      const a = await mintChancelleryApostille(effective, entries);
      updateWs({ lifecycle: "sealed", decisions, state: captureState(), replay: liveReplay(), sealed: { ref: a.ref, digest: a.digest, at, canonical: a.canonical } });
      toast.success(`Sealed local snapshot ${a.ref}`);
    } catch {
      toast.error("This browser could not compute the SHA-256 seal. Nothing was sealed.");
    } finally {
      setSealing(false);
      setImpact(null);
      setDialog(null);
    }
  };

  const onHeader = (a: HeaderAction) => {
    const cur = activeRef.current;
    if (!cur) return;
    switch (a) {
      case "foyer":
        return toFoyer();
      case "tray":
        return setTrayOpen(true);
      case "reset": {
        if (!cur.baseline) return;
        const w = { ...cur, state: JSON.parse(JSON.stringify(cur.baseline)) as DeskState, replay: [], checkpointsRevealed: [], updatedAt: now() };
        putWs(w);
        bootWorkspace(w);
        logEvent("MISSION_HYDRATED", `${cur.title} (exercise reset to its starting state)`);
        return toast.success("Exercise reset to its starting state. Your notes are kept.");
      }
      case "verify":
        if (!cur.sealed) return;
        return void verifyChancelleryApostille({ canonical: cur.sealed.canonical, digest: cur.sealed.digest }).then((ok) =>
          ok ? toast.success(`SHA-256 recomputed: ${cur.sealed!.ref} matches its sealed record.`) : toast.error("The sealed record does not match its digest."),
        );
      case "continue":
        return openWorkspace(continueFromSealed(cur));
      case "lifecycle":
        return setDialog("lifecycle");
      default:
        return setDialog(a);
    }
  };

  const onStage = (st: SpineStage) => {
    if (st.shell === "warrant") return setDialog(activeWs?.mode === "custom" ? "warrant" : "brief");
    if (st.shell === "decisions") {
      setTrayTab("decisions");
      return setTrayOpen(true);
    }
    const pick = (scenario && st.desks.find((d) => scenario.sequence.includes(d))) || st.desks[0];
    const d = DESKS.find((x) => x.id === pick);
    if (d) goTo(d);
  };

  /** Theatre presets overwrite profile, bonds and desk seeds: in a custom mission, preview the impact first. */
  const requestTheatre = (id: TheatreId | "") => {
    const t = THEATRES.find((x) => x.id === id);
    if (!t || activeWs?.mode !== "custom") return hydrateTheatre(id);
    if (activeWs.lifecycle === "sealed") return toast.error("A sealed local snapshot is read only. Continue in a new draft to change it.");
    setImpact({
      title: `Apply the ${t.name} preset to this mission?`,
      lines: [
        "Replaces the mission profile's theatre, parties and bond vector with the preset's illustrative training figures, which are not facts about this mission.",
        `Re-seeds the inputs of ${Object.keys(t.seeds).map(deskLabel).join(", ")}, which then republish their readings.`,
        `Desks that read the Diagnostics bond readings update with them: ${downstreamOf("diagnostics").map(deskLabel).join(", ")}.`,
        "The change is recorded in the Decision Record with the reason you give.",
      ],
      confirmLabel: "Apply preset",
      onConfirm: (reason) => {
        const before = profile.theatre.trim() || "No theatre";
        hydrateTheatre(id);
        const c = activeRef.current;
        if (c) updateWs({ decisions: [...c.decisions, { id: newId("dc"), what: `Applied theatre preset: ${t.name}`, why: reason, desk: "diagnostics", before, after: t.name, at: now(), status: "active" }] });
        setImpact(null);
      },
    });
  };

  /* ---------------- Surface 1: handover seal ---------------- */
  const sealMission = async () => {
    if (!activeWs) return toast.error("Open a mission before sealing it.");
    setSealBusy(true);
    // Mount every desk first, so the sealed bus carries every desk's readings and merely
    // opening a desk later is not reported as a divergence.
    setVisited(new Set(DESKS.map((d) => d.id)));
    await new Promise((r) => window.setTimeout(r, 700));
    try {
      const w = workRef.current;
      const p = sealPayload({ profile: w.profile, sessionId: activeWs.id, tray: activeWs.tray, signals: w.signals, decisions: decisionRecords(ledgerEntries()) });
      const sl = await createSeal(p, w.profile.officer || activeWs.warrant?.custodian || "");
      writeSeal(sl);
      setHSeal(sl);
      setLiveHash(sl.sealHash);
      logDecision("00", "HANDOVER_SEAL", `Mission assessment sealed · SHA-256 ${sl.sealHash.slice(0, 8)} by ${sl.sealedBy}`);
      seal();
      toast.success(`Sealed · ${sl.sealHash.slice(0, 8)}`);
    } catch {
      toast.error("This browser could not compute the SHA-256 seal. Nothing was sealed.");
    } finally {
      setSealBusy(false);
    }
  };
  const breakSeal = () => {
    clearSeal();
    setHSeal(null);
    setLiveHash("");
    toast.success("Handover seal broken. The mission is unsealed.");
  };

  /* ---------------- Surface 2: posture branching ---------------- */
  const hydratePosture = (st: PostureState) => {
    setSignals(st.signals);
    if (st.bonds) setProfile((p) => ({ ...p, bonds: st.bonds }));
    setVisited(new Set(DESKS.map((d) => d.id)));
    setDeskEpoch((e) => e + 1);
  };
  const onCreateBranch = (name: string) => {
    if (!activeWs) return;
    const next = createBranch(branchStore.workspaceId === activeWs.id ? branchStore : emptyBranchStore(activeWs.id), livePosture, name, newId("br"));
    if (next === branchStore) return toast.error("Eight branches is the limit for one mission.");
    putBranches(next);
    const b = next.branches[next.branches.length - 1];
    logDecision("00", "POSTURE_BRANCH", `Branch opened: ${b.name} (from ${branchStore.active === BASELINE_ID ? "baseline posture" : branchStore.branches.find((x) => x.id === branchStore.active)?.name ?? "branch"})`);
    toast.success(`${b.name} is on the bus`);
  };
  const onSwitchPosture = (id: string) => {
    const r = switchPosture(branchStore, livePosture, id);
    if (!r) return;
    putBranches(r.store);
    hydratePosture(r.state);
    const label = id === BASELINE_ID ? "Baseline posture" : r.store.branches.find((x) => x.id === id)?.name ?? id;
    logDecision("00", "POSTURE_BRANCH", `Posture switched to ${label}`);
    toast.success(`${label} re-hydrated on every desk`);
  };
  const onDeleteBranch = (id: string) => putBranches(deleteBranch(branchStore, id));

  /* ---------------- Executive summary and the pouch ---------------- */
  const openQuestions = activeWs ? openQuestionCount(activeWs.tray) : 0;
  const missionTitle = activeWs?.title || profile.theatre.trim() || "Unnamed mission";
  const summary = execSummary({
    title: missionTitle,
    theatre: profile.theatre,
    parties: profile.parties,
    envoy: profile.officer,
    classification: profile.classification,
    signals: effective,
    openQuestions,
    sealHash: sealState.state === "intact" ? sealState.seal.sealHash : undefined,
    baselineCovenants: branchActive && branchStore.baseline ? applyInscriptions(branchStore.baseline.signals).covenants ?? [] : undefined,
    notice: exportNotice || undefined,
  });
  const manifestBody = (): ManifestBody => ({
    format: MANIFEST_FORMAT,
    mission: { slug: missionSlug(missionTitle), title: missionTitle, theatre: profile.theatre, parties: profile.parties, envoy: profile.officer, classification: profile.classification, sessionId: activeId ?? "" },
    generatedAt: new Date().toISOString(),
    summary,
    signals: effective,
    decisions: decisionRecords(ledgerEntries()),
    workspace: activeWs ? { ...activeWs, state: captureState(), replay: liveReplay() } : null,
    files: [`${missionSlug(missionTitle)}-manifest.json`, `${missionSlug(missionTitle)}-briefing.pdf`, `${missionSlug(missionTitle)}-cable.txt`],
  });

  /* ---------------- Surface 3: palette actions ---------------- */
  const PUBLISHER_DESK = BUS_PUBLISHER_DESK;
  const publisherLabel = (id: string) => {
    if (id === "mission") return "Mission profile";
    if (id === "preset") return "Theatre preset";
    const ins = /^inscription:(\w+)$/.exec(id);
    if (ins) return `Sovereign inscription tray (${ins[1]})`;
    const k = DESKS.findIndex((d) => d.id === (PUBLISHER_DESK[id] ?? id));
    return k >= 0 ? `Desk ${String(k + 1).padStart(2, "0")} · ${DESKS[k].label}` : id;
  };
  const onPaletteAction = (a: PaletteAction) => {
    const drawer = (t: RehearsalTab) => {
      if (!activeWs) return toast.error("Open a mission first.");
      setDrawerTab(t);
      setDrawerOpen(true);
    };
    const wire = (t: WireTab) => {
      setWireTab(t);
      setWireOpen(true);
    };
    switch (a) {
      case "orientation":
        return openOrientation();
      case "seal":
        return sealState.state === "unsealed" ? void sealMission() : toast(sealState.state === "intact" ? "Already sealed. Integrity intact." : "Divergence detected. Open the seal badge to inspect or re-seal.");
      case "wire":
        return wire("wire");
      case "inspector":
        return wire("signals");
      case "ledger":
        return wire("decisions");
      case "export":
        return drawer("pouch");
      case "summary":
        return drawer("summary");
      case "diff":
        return drawer("diff");
      case "branch":
        return drawer("branches");
      case "timeline":
        return drawer("timeline");
      case "mask":
        return privacyToggleRef.current();
      case "shortcuts":
        return setShortcutsOpen(true);
      case "panic":
        if (window.confirm("Panic purge: wipe the working state, browser storage and the vault, then sign out?")) panicPurge();
        return;
    }
  };

  // The redaction shroud's dictionary: the mission's confidential identifiers, never its numbers.
  const shroudInput = {
    theatre: profile.theatre,
    parties: profile.parties,
    officer: profile.officer,
    delegates: (effective.customParties ?? []).map((x) => x.name),
    covenants: (effective.customCovenants ?? []).flatMap((c) => [c.title, c.obligation]),
    restricted: [
      ...(activeWs?.tray ?? []).map((e) => e.text),
      ...(activeWs?.warrant ? [activeWs.warrant.objective, activeWs.warrant.scope, activeWs.warrant.authority, activeWs.warrant.custodian, activeWs.warrant.title] : []),
      activeWs?.title ?? "",
      ...(effective.customNotes ?? []).flatMap((n) => [n.title, n.body]),
    ].filter((t) => t.trim().length >= 4),
  };

  const inFoyer = !activeId;
  const opening = !!activeId && !activeWs;
  const missionOpen = !inFoyer && !opening;
  const guideOn = activeWs?.mode === "preset" && !!DESK_GUIDES[desk] && (scenario ? scenario.sequence.includes(desk) : !!activeWs.derived);

  return (
    <ChancellerySentinel
      idleMs={idleMs}
      onIdle={onIdle}
      locked={enclave.idleSealed}
      onPanic={panicPurge}
      lockScreen={
        <>
          <SEO title="The Vinculum Dashboard" description="Private working desks for Vinculum practitioners." path="/dashboard" noIndex />
          <EnclaveLockScreen onSignOut={() => void signOut()} />
        </>
      }
    >
    <div onPasteCapture={sanitizeOnPaste} onBlurCapture={sanitizeOnBlur} onDropCapture={sanitizeOnDrop} className="contents">
    <PrivacyProvider input={shroudInput}>
      <PrivacyBridge toggleRef={privacyToggleRef} />
      <SEO
        title="The Vinculum Dashboard"
        description="Private working desks for Vinculum practitioners."
        path="/dashboard"
        noIndex
      />
      <SentinelStrip
        inFoyer={inFoyer}
        deskLabel={inFoyer || opening ? undefined : `Desk ${String(position + 1).padStart(2, "0")} · ${active.label}`}
        bondMean={effective.bondMean}
        rupture={effective.rupture}
      />
      {focus && (
        <div className="sticky top-9 z-30 h-10 border-b border-brass/60 bg-background/95 backdrop-blur" data-testid="focus-bar">
          <div className="container flex h-10 items-center gap-2 sm:gap-3 overflow-hidden text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold text-primary">
            <span className="hidden md:inline shrink-0 text-primary/70">Focus view</span>
            {!inFoyer && (
            <label className="relative ml-auto shrink-0 inline-flex items-center">
              <span className="sr-only">Select desk</span>
              <select
                data-shroud-nav
                value={desk}
                onChange={(e) => {
                  const d = DESKS.find((x) => x.id === e.target.value);
                  if (d) goTo(d);
                }}
                className="h-7 max-w-[11rem] sm:max-w-[15rem] appearance-none border border-brass/50 bg-background pl-2 pr-6 text-[10px] uppercase tracking-[0.12em] text-primary"
              >
                {DESKS.map((d, i) => (
                  <option key={d.id} value={d.id}>{String(i + 1).padStart(2, "0")} · {d.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-1.5 text-primary/70" />
            </label>
            )}
            <button
              type="button"
              onClick={() => setFocus(false)}
              className={`${inFoyer ? "ml-auto " : ""}shrink-0 inline-flex items-center gap-1 text-accent hover:underline`}
              title="Exit Focus view (Esc)"
            >
              <Minimize2 size={12} /> <span className="hidden sm:inline">Exit focus</span>
            </button>
          </div>
        </div>
      )}

      {/* Band 2 · Mission Operations Deck: identity, theatre preset and tools in one compact row. */}
      <header className={`diplomatic-deck border-b-2 border-primary bg-background ${focus ? "hidden" : ""}`} data-testid="ops-deck">
        <div className="container flex flex-wrap items-center gap-x-4 gap-y-3 py-3 min-h-[50px]">
          <div className={`flex min-w-0 flex-1 ${missionOpen ? "basis-full" : "basis-[16rem]"} items-start gap-3`}>
            <Logo size={22} />
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="wordmark text-sm sm:text-base leading-snug">{missionOpen ? "Vinculum" : "Vinculum Dashboard"}</span>
                {missionOpen && activeWs && (
                  <>
                    <span className="text-brass" aria-hidden>·</span>
                    <span className="min-w-0 font-serif text-sm sm:text-base leading-snug text-primary [overflow-wrap:anywhere]" data-testid="deck-title">{activeWs.title}</span>
                  </>
                )}
              </div>
              <div className="mt-1 flex min-w-0 flex-wrap items-center gap-2">
                {missionOpen && activeWs ? (
                  <>
                    <ModeBadges ws={activeWs} />
                  </>
                ) : (
                  <span className="text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                    {inFoyer ? "Mission Foyer · no mission open" : "Pro Omni Humanitate"}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className={`flex ${missionOpen ? "w-full" : "flex-1 basis-[16rem]"} min-w-0 flex-wrap items-center gap-2`} data-testid="deck-tools">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
            {missionOpen && (
              <TheatrePresetSelect value={signals.presetId ?? ""} custom={activeWs?.mode === "custom"} onChange={requestTheatre} />
            )}
            <div className="flex min-w-0 flex-wrap items-center gap-0.5 border-l border-brass/40 pl-2 text-[10px] uppercase tracking-[0.16em] font-semibold">
              {missionOpen && activeWs && (
                <>
                  <button type="button" onClick={() => setPanel((p) => (p === "vault" ? null : "vault"))} aria-pressed={panel === "vault"} aria-controls="deck-panel-vault" className={deckBtn(panel === "vault")} title="Mission State Vault: details, library, archives, enclave security" data-testid="vault-toggle">
                    <Archive size={13} /> <span className="hidden 2xl:inline">Vault</span>
                  </button>
                  <button type="button" onClick={() => setPanel((p) => (p === "ledger" ? null : "ledger"))} aria-pressed={panel === "ledger"} aria-controls="deck-panel-ledger" className={deckBtn(panel === "ledger")} title="Session Ledger: this session's events, in memory only" data-testid="ledger-toggle">
                    <ScrollText size={13} /> <span className="hidden 2xl:inline">Ledger</span>
                  </button>
                  <button type="button" onClick={() => setPanel((p) => (p === "controls" ? null : "controls"))} aria-pressed={panel === "controls"} aria-controls="deck-panel-controls" className={deckBtn(panel === "controls")} title={activeWs.mode === "preset" ? "Exercise controls and the Mission Spine" : "Mission controls and the Mission Spine"} data-testid="controls-toggle">
                    <SlidersHorizontal size={13} /> <span className="hidden 2xl:inline">Controls</span>
                  </button>
                  <button type="button" onClick={() => onHeader("tray")} className={deckBtn(false)} aria-label="Open the Context Tray" title="Context Tray">
                    <PanelRight size={13} /> <span className="hidden 2xl:inline">Context</span>
                    {openQuestions > 0 && (
                      <span className="inline-flex min-w-4 h-4 items-center justify-center border border-accent px-1 font-mono text-[10px] tabular-nums tracking-normal text-accent" title={`${openQuestions} open question${openQuestions === 1 ? "" : "s"} in the Context Tray`} data-testid="deck-open-questions">
                        {openQuestions}
                      </span>
                    )}
                  </button>
                </>
              )}
              <ChancelleryBreviary signals={effective} profile={profile} onAddToBinder={addToBinder} />
              <LexiconDrawer />
              {missionOpen && <Button variant="ghost" size="icon" onClick={openOrientation} aria-label="Open desk orientation" aria-expanded={orientationOpen} title="Desk orientation" data-testid="orientation-button" className={deckBtn(orientationOpen)}><BookOpen aria-hidden /></Button>}
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className={deckBtn(false)}
                aria-label="Open the command palette"
                title="Command palette (Ctrl+K)"
                data-testid="palette-button"
              >
                <Search size={13} />
                <span className="hidden 2xl:inline">Find</span>
              </button>
              <button
                type="button"
                onClick={() => setFocus(true)}
                className={deckBtn(false)}
                title="Focus view: collapse the deck to a slim status bar (Alt+Shift+F)"
                aria-label="Enter Focus view"
              >
                <Maximize2 size={13} />
                <span className="hidden 2xl:inline">Focus</span>
              </button>
              {activeWs && (
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className={deckBtn(false)}
                  aria-label="Open the rehearsal and handover drawer"
                  title="Rehearsal and handover: branches, diff, timeline, summary, export"
                  data-testid="rehearsal-button"
                >
                  <GitBranch size={13} />
                  <span className="hidden 2xl:inline">{branchActive ? "Branch" : "Rehearse"}</span>
                </button>
              )}
              {missionOpen && branchActive && (
                <button type="button" onClick={() => { setDrawerTab("branches"); setDrawerOpen(true); }} className="inline-flex h-8 shrink-0 items-center gap-1.5 border border-accent bg-accent/10 px-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent" data-testid="branch-indicator">
                  <GitBranch size={12} /> {branchStore.branches.find((b) => b.id === branchStore.active)?.name ?? "Branch"} · what-if
                </button>
              )}
            </div>
            </div>
            <div className="ml-auto flex max-w-full flex-wrap items-center gap-0.5 text-[10px] uppercase tracking-[0.16em] font-semibold">
              {missionOpen && activeWs && (
                <HandoverSealBadge status={sealState} differences={() => (hSeal ? sealDifferences(hSeal.canonical, sealInput) : [])} sealing={sealBusy} onSeal={() => void sealMission()} onReseal={() => void sealMission()} onClear={breakSeal} />
              )}
              <SaveSession onSave={saveSession} savedAt={savedAt} />
              {missionOpen && activeWs && (
                <button type="button" onClick={() => onHeader("foyer")} className={deckBtn(false)} aria-label="Return to the Mission Foyer" title="Return to the Mission Foyer">
                  <ArrowLeft size={13} />
                </button>
              )}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className={deckBtn(false)} aria-label="More: shortcuts, display, audio, site and sign-out" title="More" data-testid="deck-more">
                    <MoreHorizontal size={15} />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60 rounded-none border-brass/50 text-xs">
                  <DropdownMenuLabel className="truncate text-[10px] font-normal text-muted-foreground">{session.user.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => setShortcutsOpen(true)}>
                    <Keyboard size={13} className="mr-2" /> Keyboard shortcuts (?)
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => setScif((v) => !v)}>
                    <Monitor size={13} className="mr-2" /> {scif ? "Leave Amber Field terminal mode" : "Amber Field terminal mode"}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => {
                      const on = !sound;
                      setSoundEnabled(on);
                      if (on) tick();
                    }}
                  >
                    {sound ? <Volume2 size={13} className="mr-2" /> : <VolumeX size={13} className="mr-2" />} {sound ? "Mute tactile audio" : "Enable tactile audio"}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/">Return to the public site</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => void signOut()} className="text-accent">
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {missionOpen && activeWs && (
        <div className={focus ? "hidden" : ""}>
          <div id="deck-panel-vault" className={panel === "vault" ? "container pt-3" : "hidden"} data-testid="deck-panel-vault">
            <MissionVault profile={profile} setProfile={setProfile} binder={binder} setBinder={setBinder} signals={signals} setSignals={setSignals} />
          </div>
          <div id="deck-panel-ledger" className={panel === "ledger" ? "container pt-3" : "hidden"} data-testid="deck-panel-ledger">
            <SessionLedgerDrawer />
          </div>
          <div id="deck-panel-controls" className={panel === "controls" ? "container pt-3" : "hidden"} data-testid="deck-panel-controls">
            <ModeHeader ws={activeWs} scenario={scenario} network={network} saveStatus={wsStore.status} signals={effective} desk={desk} deskLabel={deskLabel} onAction={onHeader} onStage={onStage} panel />
          </div>
        </div>
      )}

      {/* Band 3 · Desk navigation: division tabs and the desk stepper in one fixed-height band. */}
      {missionOpen && (
        <nav aria-label="Desk navigation" data-testid="desk-band" className={`sticky top-9 z-30 diplomatic-navigation border-b border-brass/40 bg-background/95 backdrop-blur ${focus ? "hidden" : ""}`}>
          <div ref={bandRef} className="container flex h-12 items-center gap-3 overflow-x-auto scrollbar-none scroll-smooth [-webkit-overflow-scrolling:touch]">
            <div className="flex shrink-0 items-center gap-0.5 border border-brass/50 p-0.5" role="group" aria-label="Divisions">
              {DIVISIONS.map((dv) => {
                const on = division === dv.id;
                return (
                  <button
                    key={dv.id}
                    type="button"
                    data-division={dv.id}
                    aria-pressed={on}
                    title={dv.label}
                    onClick={() => {
                      setDivision(dv.id);
                      const first = DESKS.find((d) => d.division === dv.id);
                      if (first) setDesk(first.id);
                    }}
                    className={`h-8 shrink-0 whitespace-nowrap px-2 sm:px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                      on ? "bg-primary text-primary-foreground" : "text-primary/70 hover:text-accent"
                    }`}
                  >
                    {dv.short}
                    <span className="sr-only"> · {dv.label}</span>
                  </button>
                );
              })}
            </div>
            <span className="h-6 w-px shrink-0 bg-brass/50" aria-hidden />
            <div className="flex shrink-0 items-center gap-1.5" role="group" aria-label="Desks in this division">
              {deskList.map((d) => {
                const liveDesk = deskIsLive(d.id, effective);
                const staged = binder.filter((x) => x.desk === d.id).length;
                const on = desk === d.id;
                const remedial = visited.has("readiness") ? remedialDesks.get(d.id) : undefined;
                return (
                  <button
                    key={d.id}
                    type="button"
                    data-desk={d.id}
                    aria-pressed={on}
                    aria-current={on ? "step" : undefined}
                    onClick={() => setDesk(d.id)}
                    className={`inline-flex h-8 shrink-0 items-center whitespace-nowrap border px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] leading-none transition-colors ${
                      on ? "bg-accent text-accent-foreground border-accent" : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
                    }`}
                  >
                    <span className={`mr-1.5 font-mono ${on ? "opacity-70" : "text-muted-foreground"}`}>{String(DESKS.findIndex((x) => x.id === d.id) + 1).padStart(2, "0")}</span>
                    {liveDesk && (
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${on ? "bg-accent-foreground" : "bg-accent shadow-[0_0_6px_hsl(var(--accent)/0.8)]"}`}
                        title="Live telemetry on the mission bus"
                        aria-label="Live telemetry"
                      />
                    )}
                    {d.label}
                    {d.id === "binder" && binder.length > 0 ? ` (${binder.length})` : ""}
                    {remedial && (
                      <span
                        className={`ml-1.5 inline-flex h-4 items-center border px-1 text-[9px] tracking-normal ${on ? "border-accent-foreground/70" : "border-destructive/70 text-destructive"}`}
                        title={`Resolves failed gate: ${remedial.join(", ")}`}
                        aria-label={`Resolves ${remedial.length} failed readiness gate${remedial.length === 1 ? "" : "s"}`}
                      >
                        Gate
                      </span>
                    )}
                    {staged > 0 && d.id !== "binder" && (
                      <span
                        className={`ml-1.5 inline-flex h-4 min-w-4 items-center justify-center border px-1 text-[9px] tracking-normal ${on ? "border-accent-foreground/70" : "border-brass/70 text-primary/80"}`}
                        title={`${staged} excerpt${staged === 1 ? "" : "s"} staged in the Mission Binder`}
                        aria-label={`${staged} staged in binder`}
                      >
                        {staged}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      <div className={`container ${focus ? "py-4" : "py-4 sm:py-5"}`}>
        {inFoyer ? (
          <div className="mb-8 pb-12">
            <MissionFoyer workspaces={workspaces} lastMode={lastMode} network={network} legacyDraft={legacyDraft} storeError={wsStore.error} quarantined={wsStore.store.quarantine.length} onAction={onFoyer} />
          </div>
        ) : opening ? (
          <p role="status" className="mb-8 pb-12 text-sm text-muted-foreground">Opening the local workspace…</p>
        ) : (
        <>
        <div className={`diplomatic-heading mb-5 border-l-2 border-brass pl-4 ${focus ? "hidden" : ""}`} data-testid="desk-heading">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="eyebrow">{active.eyebrow}</p>
            <span className="text-brass" aria-hidden>|</span>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground" data-testid="desk-step">
              Step {String(position + 1).padStart(2, "0")} of {DESKS.length}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
            <h1 id="vs-desk-title" tabIndex={-1} className="font-serif text-primary text-xl sm:text-2xl leading-tight outline-none">{active.title}</h1>
            <button
              type="button"
              onClick={() => setNoteOpen((v) => !v)}
              aria-expanded={noteOpen}
              aria-controls="vs-desk-note"
              className="inline-flex h-7 shrink-0 items-center gap-1 border border-brass/50 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary hover:border-accent hover:text-accent"
              data-testid="doctrinal-note-toggle"
            >
              <span className="font-mono" aria-hidden>[?]</span> Doctrinal note
            </button>
          </div>
          <div
            id="vs-desk-note"
            aria-hidden={!noteOpen}
            className={`grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none ${noteOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
            data-testid="doctrinal-note"
          >
            <div className="overflow-hidden">
              <GoldRule className="mt-3 mb-3" />
              <p className="text-sm text-muted-foreground">{active.note}</p>
            </div>
          </div>
          {profile.theatre.trim() && (
            <p className="mt-2 text-xs text-muted-foreground">
              Active mission: <span className="text-primary">{profile.theatre}</span>
              {profile.classification ? ` · ${profile.classification}` : ""}
            </p>
          )}
        </div>
        {!orientationDismissed && !orientationOpen && (
          <div data-testid="orientation-invitation" className="mb-5 flex flex-wrap items-center gap-3 border-y border-brass/40 py-3 print:hidden">
            <BookOpen size={17} className="shrink-0 text-accent" aria-hidden />
            <p className="min-w-0 flex-1 text-sm text-primary">First time at the desks?</p>
            <Button size="sm" variant="outline" onClick={openOrientation}>Take the desk orientation</Button>
            <Button variant="ghost" size="icon" onClick={rememberOrientation} aria-label="Dismiss desk orientation invitation" title="Dismiss invitation"><X aria-hidden /></Button>
          </div>
        )}
        {orientationOpen && <DeskOrientation desks={DESKS} divisions={DIVISIONS} deskId={desk} onDesk={(id) => { const d = DESKS.find((x) => x.id === id); if (d) goTo(d); }} onClose={() => closeOrientation()} onWork={() => closeOrientation(true)} />}
        {guideOn && activeWs && (
          <div className={`max-w-3xl ${focus ? "hidden" : ""}`}>
            <DeskGuide
              key={`${activeWs.id}:${desk}`}
              deskId={desk}
              step={scenario ? scenario.sequence.indexOf(desk) + 1 : undefined}
              of={scenario?.sequence.length}
              checkpoints={scenario?.checkpoints.filter((c) => c.desk === desk) ?? []}
              revealed={activeWs.checkpointsRevealed}
              signals={effective}
              onReveal={(id) => updateWs({ checkpointsRevealed: [...new Set([...activeWs.checkpointsRevealed, id])] })}
            />
          </div>
        )}

        <EngineContext.Provider value={engineValue}>
          <StatutoryClearanceBar deskId={desk} />
        </EngineContext.Provider>
        <TelemetryStrip signals={effective} onOpenDesk={(id) => { const d = DESKS.find((x) => x.id === id); if (d) goTo(d); }} />
        <MissionChain
          deskId={desk}
          signals={effective}
          onNavigate={(id) => {
            const d = DESKS.find((x) => x.id === id);
            if (d) goTo(d);
          }}
        />

        <EngineContext.Provider value={engineValue}>
        <MissionContext.Provider value={profile}>
        <DeskMetaContext.Provider value={{ title: active.title, eyebrow: active.eyebrow, id: active.id }}>
        <BinderContext.Provider value={{ add: addFromDesk }}>
        <ExportNoticeContext.Provider value={exportNotice}>
        <div
          className="diplomatic-workspace pb-10 w-full min-w-0 max-w-full"
          onInputCapture={(e) => {
            if ((e.target as HTMLInputElement).type === "range") tick();
          }}
          onClickCapture={(e) => {
            if ((e.target as HTMLElement).closest('input[type="checkbox"], input[type="radio"], button[aria-pressed]')) tick();
          }}
        >
            {DESKS.map(({ id }) =>
              visited.has(id) ? (
                <div key={`${id}:${deskEpoch}`} hidden={desk !== id} className="desk-surface w-full min-w-0" data-desk={id}
                  onInputCapture={() => engageDesk(id)}
                  onChangeCapture={() => engageDesk(id)}
                  onClickCapture={(e) => {
                    if ((e.target as HTMLElement).closest("button, input, select, [role='slider'], [role='checkbox'], [role='switch'], [role='option']")) engageDesk(id);
                  }}
                >
                  <p className="sr-only" aria-live="polite">{desk === id ? `Desk ${String(DESKS.findIndex((x) => x.id === id) + 1).padStart(2, "0")}, ${DESKS.find((x) => x.id === id)?.label ?? ""}` : ""}</p>
                  <DeskErrorBoundary label={DESKS.find((x) => x.id === id)?.label ?? "This desk"}>
                  {DESK_DOCTRINES[id] && (
                    <div className="mb-4 border-l-2 border-brass/60 pl-3">
                      <DoctrineAnchors ids={DESK_DOCTRINES[id]} />
                    </div>
                  )}
                  <SovereignInscriptionTray deskId={id} onApplyVector={id === "diagnostics" ? setBonds : undefined} />
                  {id === "briefing" && <CableComposer />}
                  {id === "diagnostics" && (
                    <BondDiagnostic
                      scores={bonds}
                      onScoresChange={setBonds}
                      simulator={<DeltaSimulator baseline={bonds} onApply={(sim) => setBonds(sim)} />}
                      stress={<PatternMatcher />}
                    />
                  )}
                  {id === "audit" && <AuditBench parties={PARTIES} />}
                  {id === "mirror" && <MirrorDesk />}
                  {id === "legal" && <LitigationWorkbench />}
                  {id === "adversarial" && <AdversarialChamber />}
                  {id === "clauses" && <ClauseArchitect />}
                  {id === "redliner" && <ClauseRedliner />}
                  {id === "multiparty" && <MultiPartySequencer />}
                  {id === "compound" && <CompoundShockTester />}
                  {id === "sentinel" && <SentinelMatrix />}
                  {id === "readiness" && <ReadinessDesk onOpenDesk={(target) => { const n = DESKS.find((x) => x.id === target); if (!n) return; setDivision(n.division); setDesk(n.id); window.scrollTo({ top: 0, behavior: "smooth" }); }} openQuestions={activeWs ? openQuestionCount(activeWs.tray) : undefined} />}
                  {id === "counterpart" && <CounterpartPrompter />}
                  {id === "succession" && <SuccessionSimulator />}
                  {id === "tracks" && <TrackSequencer />}
                  {id === "verification" && <VerificationLedger />}
                  {id === "handover" && <HandoverProtocol />}
                  {id === "binder" && (
                    <MissionBinder
                      entries={binder}
                      onRemove={(x) => setBinder((p) => p.filter((e) => e.id !== x))}
                      onMove={moveEntry}
                      onProfileChange={activeWs?.lifecycle === "sealed" ? undefined : (patch) => setProfile((p) => ({ ...p, ...patch }))}
                    />
                  )}
                  </DeskErrorBoundary>
                </div>
              ) : null,
            )}
        </div>
        </ExportNoticeContext.Provider>
        </BinderContext.Provider>
        </DeskMetaContext.Provider>
        </MissionContext.Provider>
        </EngineContext.Provider>

        <div className="mb-8 pb-12 grid gap-3 sm:grid-cols-2 border-t border-brass/40 pt-5" data-testid="desk-prevnext">
          {prev ? (
            <button
              type="button"
              onClick={() => goTo(prev)}
              className="text-left border border-brass/40 p-4 hover:border-accent transition-colors"
            >
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Previous in sequence
              </span>
              <span className="mt-1 block font-serif text-primary">{prev.title}</span>
            </button>
          ) : (
            <span />
          )}
          {next && (
            <button
              type="button"
              onClick={() => goTo(next)}
              className="text-left sm:text-right border border-brass/40 p-4 hover:border-accent transition-colors"
            >
              <span className="block text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Next in sequence
              </span>
              <span className="mt-1 block font-serif text-primary">{next.title}</span>
            </button>
          )}
        </div>
        </>
        )}
      </div>
      <ChancelleryWire
        signals={effective}
        openQuestions={openQuestions}
        publisherLabel={publisherLabel}
        open={wireOpen}
        onOpenChange={setWireOpen}
        tab={wireTab}
        onTab={setWireTab}
      />
      <ScenarioLibraryDialog
        open={dialog === "library"}
        onOpenChange={(v) => setDialog(v ? "library" : null)}
        deskIds={DESKS.map((d) => d.id)}
        deskLabel={deskLabel}
        localCount={(id) => workspaces.filter((w) => w.scenario?.id === id).length}
        onStart={startScenario}
      />
      <PickerDialog
        open={dialog === "pick-replay"}
        onOpenChange={(v) => setDialog(v ? "pick-replay" : null)}
        title="Replay a prior run"
        description="Opens the run with its recorded changes."
        items={workspaces.filter((w) => w.mode === "preset")}
        onPick={(w) => {
          openWorkspace(w);
          setDialog("replay");
        }}
      />
      <PickerDialog
        open={dialog === "pick-draft"}
        onOpenChange={(v) => setDialog(v ? "pick-draft" : null)}
        title="Resume a local draft"
        items={workspaces.filter((w) => w.mode === "custom" && w.lifecycle === "draft")}
        legacy={legacyDraft}
        onPick={openWorkspace}
        onPickLegacy={importLegacy}
      />
      <PickerDialog
        open={dialog === "pick-review"}
        onOpenChange={(v) => setDialog(v ? "pick-review" : null)}
        title="Open review-ready work"
        description="Missions in Internal Review Preparation or Ready for Local Handover."
        items={workspaces.filter((w) => w.mode === "custom" && (w.lifecycle === "review" || w.lifecycle === "ready"))}
        onPick={openWorkspace}
      />
      <PickerDialog
        open={dialog === "pick-sealed"}
        onOpenChange={(v) => setDialog(v ? "pick-sealed" : null)}
        title="Open a sealed snapshot"
        description="Sealed local snapshots open read only."
        items={workspaces.filter((w) => w.lifecycle === "sealed")}
        onPick={openWorkspace}
      />
      <WarrantDialog
        open={dialog === "new-mission"}
        onOpenChange={(v) => setDialog(v ? "new-mission" : null)}
        title="Start new mission: Mission Warrant"
        initial={EMPTY_WARRANT}
        entries={[]}
        requireKeys={["title", "objective"]}
        confirmLabel="Open mission draft"
        onSave={startMission}
      />
      {activeWs && (
        <>
          <ContextTray
            open={trayOpen}
            onOpenChange={setTrayOpen}
            tab={trayTab}
            onTab={setTrayTab}
            ws={activeWs}
            signals={effective}
            desks={DESKS.map((d) => ({ id: d.id, label: d.label }))}
            currentDesk={desk}
            onChange={(next) => updateWs(next)}
          />
          {activeWs.mode === "custom" && (
            <WarrantDialog
              open={dialog === "warrant"}
              onOpenChange={(v) => setDialog(v ? "warrant" : null)}
              title="Mission Warrant"
              initial={activeWs.warrant ?? EMPTY_WARRANT}
              entries={activeWs.tray}
              readOnly={activeWs.lifecycle === "sealed"}
              confirmLabel="Save warrant"
              onSave={(w, added) => {
                updateWs({ warrant: w, title: w.title.trim() || activeWs.title, tray: [...activeWs.tray, ...added] });
                setProfile((p) => warrantToProfile(w, p));
                setDialog(null);
              }}
            />
          )}
          <BranchDialog
            open={dialog === "branch"}
            onOpenChange={(v) => setDialog(v ? "branch" : null)}
            onBranch={(label) => openWorkspace(branchWorkspace({ ...activeWs, state: captureState(), replay: liveReplay() }, label))}
          />
          <ReplayDialog open={dialog === "replay"} onOpenChange={(v) => setDialog(v ? "replay" : null)} ws={{ ...activeWs, replay: liveReplay() }} />
          <ReportDialog
            open={dialog === "aar"}
            onOpenChange={(v) => setDialog(v ? "aar" : null)}
            title="After-action review"
            fileName="Vinculum-After-Action-Review"
            text={
              dialog === "aar"
                ? afterActionReview({ ...activeWs, replay: liveReplay() }, { scenarioTitle: scenario?.title, gates: stageGateAudit(effective).gates, telemetry: telemetryLines(effective), notice: exportNotice || TRAINING_NOTICE })
                : ""
            }
          />
          <BriefDialog open={dialog === "brief"} onOpenChange={(v) => setDialog(v ? "brief" : null)} scenario={scenario} ws={activeWs} deskLabel={deskLabel} />
          <LifecycleDialog
            open={dialog === "lifecycle"}
            onOpenChange={(v) => setDialog(v ? "lifecycle" : null)}
            ws={activeWs}
            sealing={sealing}
            onMove={(to) => updateWs({ lifecycle: to })}
            onSeal={() =>
              setImpact({
                title: "Seal this mission as a local snapshot?",
                lines: [
                  `Hashes the live signals, ${binder.length} binder tab${binder.length === 1 ? "" : "s"}, the Mission Warrant, the Context Tray and the Decision Record with SHA-256 in this browser, using the Chancellery apostille.`,
                  "Draws the next registry reference from the monotonic counter and logs it on the Protocol Wire.",
                  "After sealing, the snapshot is immutable: desk changes are not recorded into it. Continue in a new draft to keep working.",
                  "It stays in this browser. Nothing is uploaded, shared or approved.",
                ],
                confirmLabel: "Seal local snapshot",
                onConfirm: (reason) => void sealActive(reason),
              })
            }
          />
          {activeWs.mode === "preset" && (
            <PromotionDialog
              open={dialog === "promote"}
              onOpenChange={(v) => setDialog(v ? "promote" : null)}
              ws={{ ...activeWs, state: captureState() }}
              onConfirm={(w, reviewed) => {
                const next = promoteToCustom({ ...activeWs, state: captureState() }, w, reviewed);
                openWorkspace(next);
                logEvent("MISSION_HYDRATED", `${next.title} (custom draft promoted from a reviewed training run)`);
              }}
            />
          )}
          {activeWs.mode === "custom" && (
            <DerivativeDialog
              open={dialog === "derive"}
              onOpenChange={(v) => setDialog(v ? "derive" : null)}
              ws={activeWs}
              onConfirm={(choices) => openWorkspace(deriveTraining({ ...activeWs, state: captureState() }, choices))}
            />
          )}
        </>
      )}
      <LocalDataDialog
        open={dialog === "local-data"}
        onOpenChange={(v) => setDialog(v ? "local-data" : null)}
        store={wsStore.store}
        activeId={activeId}
        onImport={(r) => {
          // Store the open workspace's live state first, so an import never loses it. Imports never replace a workspace.
          const cur = activeRef.current;
          const base = cur && cur.lifecycle !== "sealed"
            ? { ...r.store, workspaces: r.store.workspaces.map((w) => (w.id === cur.id ? { ...cur, state: captureState(), replay: liveReplay(), updatedAt: now() } : w)) }
            : r.store;
          wsStore.replace(base);
          logEvent("MISSION_HYDRATED", `Local package imported (${r.added} added, ${r.quarantined} kept aside)`);
        }}
        onStoreChange={(next) => wsStore.replace(next)}
        onOpenWorkspace={(id) => {
          const w = wsStore.store.workspaces.find((x) => x.id === id);
          if (w) openWorkspace(w);
        }}
      />
      <ImpactDialog impact={impact} onClose={() => setImpact(null)} />
      <CommandPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        desks={DESKS}
        onDesk={(id) => {
          const d = DESKS.find((x) => x.id === id);
          if (!d) return;
          goTo(d);
          window.setTimeout(() => document.getElementById("vs-desk-title")?.focus(), 60);
        }}
        onAction={onPaletteAction}
        onGuide={(id) => {
          const d = DESKS.find((x) => x.id === id);
          if (!d || !activeWs) return openOrientation();
          goTo(d);
          openOrientation();
        }}
      />
      <ShortcutSheet open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
      {activeWs && (
        <RehearsalDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          tab={drawerTab}
          onTab={setDrawerTab}
          branches={branchStore.workspaceId === activeWs.id ? branchStore : emptyBranchStore(activeWs.id)}
          live={livePosture}
          startState={activeWs.baseline?.signals}
          readOnly={activeWs.lifecycle === "sealed"}
          onCreateBranch={onCreateBranch}
          onSwitch={onSwitchPosture}
          onDeleteBranch={onDeleteBranch}
          rawSignals={signals}
          summary={summary}
          manifestBody={manifestBody}
        />
      )}
    </PrivacyProvider>
    </div>
    </ChancellerySentinel>
  );
}
