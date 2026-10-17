import { useCallback, useEffect, useMemo, useRef, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Maximize2, Minimize2, Volume2, VolumeX } from "lucide-react";
import { toast } from "sonner";
import { tick, seal, soundEnabled, setSoundEnabled, onSoundChange } from "@/lib/chancelleryHaptics";
import { supabase } from "@/integrations/supabase/client";
import { getOfflineSession, clearOfflineSession } from "@/lib/offlineAuth";
import type { Session } from "@supabase/supabase-js";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import { CASES, DOMAINS } from "@/content/cases";
import { PARTIES } from "@/content/parties";
import DeskOutput, { BinderContext, DeskMetaContext, type BinderEntry } from "@/components/desk/DeskOutput";
import { useMission } from "@/components/desk/mission";
import { PAIRINGS } from "@/content/pairings";
import { MissionContext, EMPTY_PROFILE, DEFAULT_BONDS, sanitizeBonds, type MissionProfile } from "@/components/desk/mission";
import { EngineContext, useEngine, usePublish, bondBand, mathReading, stageGateAudit, type Signals } from "@/components/desk/engine";
import SyncPanel from "@/components/desk/SyncPanel";
import TelemetryStrip from "@/components/desk/TelemetryStrip";
import MissionChain, { deskIsLive } from "@/components/desk/MissionChain";
import MissionVault from "@/components/desk/MissionVault";
import SaveSession from "@/components/desk/SaveSession";
import DeskFinder from "@/components/desk/DeskFinder";
import { LexiconDrawer } from "@/components/desk/Lexicon";
import { ChancelleryBreviary } from "@/components/desk/ChancelleryBreviary";

// Proprietary desks are split into separate chunks that are only fetched
// once a valid session exists, so they never ship with the public site.
const BondDiagnostic = lazy(() => import("@/components/BondDiagnostic"));
const CableComposer = lazy(() => import("@/components/CableComposer"));
const PatternMatcher = lazy(() => import("@/components/PatternMatcher"));
const DeltaSimulator = lazy(() => import("@/components/desk/DeltaSimulator"));
const AuditBench = lazy(() => import("@/components/AuditBench"));
const LitigationWorkbench = lazy(() => import("@/components/LitigationWorkbench"));
const DiagnosticMirror = lazy(() => import("@/components/DiagnosticMirror"));
const AdversarialChamber = lazy(() => import("@/components/AdversarialChamber"));
const ClauseArchitect = lazy(() => import("@/components/desk/ClauseArchitect"));
const SentinelMatrix = lazy(() => import("@/components/desk/SentinelMatrix"));
const ReadinessDesk = lazy(() => import("@/components/desk/ReadinessDesk"));
const CounterpartPrompter = lazy(() => import("@/components/desk/CounterpartPrompter"));
const SuccessionSimulator = lazy(() => import("@/components/desk/SuccessionSimulator"));
const MissionBinder = lazy(() => import("@/components/desk/MissionBinder"));
const TrackSequencer = lazy(() => import("@/components/desk/TrackSequencer"));
const ClauseRedliner = lazy(() => import("@/components/desk/ClauseRedliner"));
const MultiPartySequencer = lazy(() => import("@/components/desk/MultiPartySequencer"));
const CompoundShockTester = lazy(() => import("@/components/desk/CompoundShockTester"));
const VerificationLedger = lazy(() => import("@/components/desk/VerificationLedger"));
const HandoverProtocol = lazy(() => import("@/components/desk/HandoverProtocol"));


const IDLE_MS = 20 * 60 * 1000;

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
    title: "Early-warning sentinel matrix",
    note: "Record observed warning signs across the four bonds and read the rupture index and latent traps.",
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
    note: "Walk a meeting phase by phase with the scripted question for each counterpart and bond.",
  },
  {
    id: "multiparty",
    division: "engage",
    label: "De-confliction Bench",
    eyebrow: "§9A · Multi-Party",
    title: "Multi-party sequencing and de-confliction",
    note: "Seat up to four parties at one table, synchronise the four phases, and read the friction between them.",
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



export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [division, setDivision] = useState<(typeof DIVISIONS)[number]["id"]>("assess");
  const [desk, setDesk] = useState<(typeof DESKS)[number]["id"]>("diagnostics");
  const navigate = useNavigate();
  const [binder, setBinder] = useState<BinderEntry[]>([]);
  const [profile, setProfile] = useState<MissionProfile>(EMPTY_PROFILE);
  // The mission engine: every desk publishes its readings here, and every
  // downstream desk reads them. Held in memory only, like the binder.
  const [signals, setSignals] = useState<Signals>({});
  const publish = useCallback((_desk: string, patch: Signals) => {
    setSignals((prev) => {
      const next = { ...prev, ...patch };
      return JSON.stringify(next) === JSON.stringify(prev) ? prev : next;
    });
  }, []);
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

  // Chancellery Focus view and discrete tactile audio (muted by default).
  const [focus, setFocus] = useState(false);
  const [sound, setSound] = useState(false);
  useEffect(() => {
    setSound(soundEnabled());
    return onSoundChange(setSound);
  }, []);

  // A stage-gate audit that clears (every gate passing) sounds the seal chime once.
  const gatesLocked = stageGateAudit(signals).locked;
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
    // Offline field session: unlocked on this device by the cached credential.
    const offlineSession = (): Session | null => {
      const o = getOfflineSession();
      return o ? ({ user: { id: o.userId, email: o.email } } as unknown as Session) : null;
    };
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      const next = s ?? offlineSession();
      setSession(next);
      if (!next) navigate("/login", { replace: true });
    });
    supabase.auth
      .getSession()
      .catch(() => ({ data: { session: null } }))
      .then(({ data }) => {
        const next = data.session ?? offlineSession();
        setSession(next);
        setReady(true);
        if (!next) navigate("/login", { replace: true });
      });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = useCallback(async () => {
    clearOfflineSession();
    try {
      await supabase.auth.signOut();
    } catch {
      // Offline: the local session is cleared regardless.
    }
    navigate("/login", { replace: true });
  }, [navigate]);

  // Idle auto sign-out: an unattended terminal closes itself.
  const idleRef = useRef<number | null>(null);
  useEffect(() => {
    if (!session) return;
    const reset = () => {
      if (idleRef.current) window.clearTimeout(idleRef.current);
      idleRef.current = window.setTimeout(() => {
        void signOut();
      }, IDLE_MS);
    };
    const events = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "visibilitychange"];
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => {
      events.forEach((e) => window.removeEventListener(e, reset));
      if (idleRef.current) window.clearTimeout(idleRef.current);
    };
  }, [session, signOut]);

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
    } catch {
      /* ignore a damaged save */
    }
  }, [saveKey]);
  const saveSession = useCallback(() => {
    if (!saveKey) return;
    const stamp = new Date().toLocaleString();
    window.localStorage.setItem(
      saveKey,
      JSON.stringify({ profile, binder, signals, division, desk, savedAt: stamp }),
    );
    setSavedAt(stamp);
    seal();
  }, [saveKey, profile, binder, signals, division, desk]);

  // Power-user shortcuts. Ignored while typing in a field, except Ctrl/Cmd+S.
  useEffect(() => {
    const typing = (el: EventTarget | null) => {
      const t = el as HTMLElement | null;
      if (!t) return false;
      return t.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(t.tagName);
    };
    const step = (dir: -1 | 1) => {
      const i = DESKS.findIndex((d) => d.id === deskRef.current);
      const n = DESKS[i + dir];
      if (!n) return;
      setDivision(n.division);
      setDesk(n.id);
      tick();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
    const onKey = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "s") {
        e.preventDefault();
        saveSession();
        toast.success("Mission state saved to browser storage");
        return;
      }
      if (typing(e.target)) return;
      if (e.key === "Escape") {
        // Radix closes its own dialogs and drawers; with none open, Escape leaves Focus view.
        if (!document.querySelector('[role="dialog"][data-state="open"]')) setFocus(false);
        return;
      }
      if (mod) return;
      if (e.key === "[" || (e.altKey && e.key === "ArrowLeft")) {
        e.preventDefault();
        step(-1);
      } else if (e.key === "]" || (e.altKey && e.key === "ArrowRight")) {
        e.preventDefault();
        step(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [saveSession]);

  if (!ready || !session) return null;

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

  return (
    <>
      <SEO
        title="The Vinculum Dashboard"
        description="Private working desks for Vinculum practitioners."
        path="/dashboard"
        noIndex
      />
      {focus && (
        <div className="sticky top-0 z-40 h-10 border-b border-brass/60 bg-background/95 backdrop-blur">
          <div className="container flex h-10 items-center gap-2 sm:gap-3 overflow-hidden text-[9px] sm:text-[10px] uppercase tracking-[0.14em] sm:tracking-[0.18em] font-semibold text-primary">
            <span className="hidden md:inline shrink-0 text-primary/70">Vinculum Chancellery</span>
            <span className="hidden md:inline text-brass" aria-hidden>·</span>
            <span className="min-w-0 truncate">
              Desk {String(position + 1).padStart(2, "0")}: <span className="text-accent">{active.label}</span>
            </span>
            <span className="hidden sm:inline shrink-0 text-muted-foreground">
              <span className="normal-case">μ</span>B: <span className="text-primary">{signals.bondMean !== undefined ? signals.bondMean.toFixed(2) : "—"}</span>
            </span>
            <span className="hidden sm:inline shrink-0 text-muted-foreground">
              Rupture: <span className={(signals.rupture ?? 0) >= 60 ? "text-destructive" : "text-primary"}>{signals.rupture !== undefined ? `${signals.rupture}%` : "—"}</span>
            </span>
            <label className="relative ml-auto shrink-0 inline-flex items-center">
              <span className="sr-only">Select desk</span>
              <select
                value={desk}
                onChange={(e) => {
                  const d = DESKS.find((x) => x.id === e.target.value);
                  if (d) goTo(d);
                }}
                className="h-7 max-w-[9rem] sm:max-w-[13rem] appearance-none border border-brass/50 bg-background pl-2 pr-6 text-[10px] uppercase tracking-[0.12em] text-primary"
              >
                {DESKS.map((d, i) => (
                  <option key={d.id} value={d.id}>{String(i + 1).padStart(2, "0")} · {d.label}</option>
                ))}
              </select>
              <ChevronDown size={12} className="pointer-events-none absolute right-1.5 text-primary/70" />
            </label>
            <button
              type="button"
              onClick={() => setFocus(false)}
              className="shrink-0 inline-flex items-center gap-1 text-accent hover:underline"
              title="Exit Focus view (Esc)"
            >
              <Minimize2 size={12} /> <span className="hidden sm:inline">Exit focus</span>
            </button>
          </div>
        </div>
      )}
      <div className={`border-b-2 border-primary bg-background ${focus ? "hidden" : ""}`}>
        <div className="container flex flex-wrap items-center justify-between gap-x-3 gap-y-2 py-3 sm:py-4">
          <div className="flex items-center gap-2.5 min-w-0">
            <Logo size={24} />
            <div className="min-w-0">
              <span className="wordmark text-base sm:text-lg leading-none block truncate">Vinculum Dashboard</span>
              <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Pro Omni Humanitate
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-x-3 sm:gap-x-4 gap-y-2 min-w-0 max-w-full text-[10px] uppercase tracking-[0.18em] font-semibold">
            <span className="hidden md:inline text-muted-foreground normal-case tracking-normal text-xs">
              {session.user.email}
            </span>
            <ChancelleryBreviary signals={signals} profile={profile} onAddToBinder={addToBinder} />
            <LexiconDrawer />
            <DeskFinder
              desks={DESKS}
              divisions={DIVISIONS}
              onPick={(id) => {
                const d = DESKS.find((x) => x.id === id);
                if (d) goTo(d);
              }}
            />
            <SaveSession onSave={saveSession} savedAt={savedAt} />
            <button
              type="button"
              onClick={() => setFocus(true)}
              className="inline-flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
              title="Focus view: collapse the masthead to a slim status bar"
              aria-label="Enter Focus view"
            >
              <Maximize2 size={13} />
              <span className="hidden sm:inline">Focus</span>
            </button>
            <button
              type="button"
              onClick={() => {
                const on = !sound;
                setSoundEnabled(on);
                if (on) tick();
              }}
              aria-pressed={sound}
              className="inline-flex items-center text-primary hover:text-accent transition-colors"
              title={sound ? "Mute tactile audio" : "Enable tactile audio"}
              aria-label={sound ? "Mute tactile audio" : "Enable tactile audio"}
            >
              {sound ? <Volume2 size={14} /> : <VolumeX size={14} />}
            </button>
            <Link to="/" className="text-primary hover:text-accent transition-colors">Site</Link>
            <button onClick={signOut} className="text-accent hover:underline">Sign out</button>
          </div>
        </div>
      </div>

      <div className={`container ${focus ? "py-4" : "py-6 sm:py-8"}`}>
        <div className={`mb-6 sm:mb-8 ${focus ? "hidden" : ""}`}>
          <MissionVault profile={profile} setProfile={setProfile} binder={binder} setBinder={setBinder} signals={signals} setSignals={setSignals} />
        </div>

        <div className={`mb-5 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto border-b border-brass/40 scrollbar-none [webkit-overflow-scrolling:touch] ${focus ? "hidden" : ""}`}>
          <div className="flex w-max min-w-full gap-5 sm:gap-6 pb-3">
            {DIVISIONS.map((dv) => {
              const on = division === dv.id;
              return (
                <button
                  key={dv.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    setDivision(dv.id);
                    const first = DESKS.find((d) => d.division === dv.id);
                    if (first) setDesk(first.id);
                  }}
                  className={`shrink-0 pb-2 -mb-3 border-b-2 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                    on ? "border-accent text-accent" : "border-transparent text-primary/60 hover:text-accent"
                  }`}
                >
                  <span className="sm:hidden">{dv.short}</span>
                  <span className="hidden sm:inline">{dv.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className={focus ? "hidden" : "grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-8 sm:mb-10 w-full min-w-0"}>
          {deskList.map((d) => {
            const liveDesk = deskIsLive(d.id, signals);
            const staged = binder.filter((x) => x.desk === d.id).length;
            return (
            <button
              key={d.id}
              type="button"
              aria-pressed={desk === d.id}
              onClick={() => setDesk(d.id)}
              className={`min-w-0 break-words px-3 sm:px-4 py-2.5 min-h-11 border text-[10px] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.2em] leading-tight transition-all ${
                desk === d.id
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
              }`}
            >
              <span>
                {liveDesk && (
                  <span
                    className={`w-1.5 h-1.5 rounded-full inline-block mr-1.5 align-middle ${
                      desk === d.id ? "bg-accent-foreground" : "bg-accent shadow-[0_0_6px_hsl(var(--accent)/0.8)]"
                    }`}
                    title="Live telemetry on the mission bus"
                    aria-label="Live telemetry"
                  />
                )}
                {d.label}
                {d.id === "binder" && binder.length > 0 ? ` (${binder.length})` : ""}
                {staged > 0 && d.id !== "binder" && (
                  <span
                    className={`ml-1.5 inline-flex min-w-4 h-4 items-center justify-center border px-1 align-middle text-[9px] tracking-normal ${
                      desk === d.id ? "border-accent-foreground/70" : "border-brass/70 text-primary/80"
                    }`}
                    title={`${staged} excerpt${staged === 1 ? "" : "s"} staged in the Mission Binder`}
                    aria-label={`${staged} staged in binder`}
                  >
                    {staged}
                  </span>
                )}
              </span>
            </button>
            );
          })}
        </div>

        <div className={`mb-7 max-w-3xl ${focus ? "hidden" : ""}`}>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <p className="eyebrow">{active.eyebrow}</p>
            <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Step {position + 1} of {DESKS.length}
            </span>
          </div>
          <h1 className="mt-3 font-serif text-primary text-xl sm:text-2xl md:text-3xl leading-tight">{active.title}</h1>
          <GoldRule className="mt-4 mb-4" />
          <p className="text-sm text-muted-foreground">{active.note}</p>
          {profile.theatre.trim() && (
            <p className="mt-3 text-xs text-muted-foreground">
              Active mission: <span className="text-primary">{profile.theatre}</span>
              {profile.classification ? ` · ${profile.classification}` : ""}
            </p>
          )}
        </div>

        <TelemetryStrip signals={signals} />
        <MissionChain
          deskId={desk}
          signals={signals}
          onNavigate={(id) => {
            const d = DESKS.find((x) => x.id === id);
            if (d) goTo(d);
          }}
        />

        <EngineContext.Provider value={{ signals, publish }}>
        <MissionContext.Provider value={profile}>
        <DeskMetaContext.Provider value={{ title: active.title, eyebrow: active.eyebrow }}>
        <BinderContext.Provider value={{ add: addFromDesk }}>
        <div
          className="pb-10 w-full min-w-0 max-w-full overflow-x-hidden"
          onInputCapture={(e) => {
            if ((e.target as HTMLInputElement).type === "range") tick();
          }}
          onClickCapture={(e) => {
            if ((e.target as HTMLElement).closest('input[type="checkbox"], input[type="radio"], button[aria-pressed]')) tick();
          }}
        >
          <Suspense fallback={<p className="text-sm text-muted-foreground">Opening the desk…</p>}>
            {desk === "briefing" && <CableComposer />}
            {desk === "diagnostics" && (
              <div className="space-y-12">
                <BondDiagnostic scores={bonds} onScoresChange={setBonds} />
                <DeltaSimulator baseline={bonds} onApply={(sim) => setBonds(sim)} />
                <PatternMatcher />
              </div>
            )}
            {desk === "audit" && <AuditBench parties={PARTIES} />}
            {desk === "mirror" && <MirrorDesk />}
            {desk === "legal" && <LitigationWorkbench />}
            {desk === "adversarial" && <AdversarialChamber />}
            {desk === "clauses" && <ClauseArchitect />}
            {desk === "redliner" && <ClauseRedliner />}
            {desk === "multiparty" && <MultiPartySequencer />}
            {desk === "compound" && <CompoundShockTester />}
            {desk === "sentinel" && <SentinelMatrix />}
            {desk === "readiness" && <ReadinessDesk />}
            {desk === "counterpart" && <CounterpartPrompter />}
            {desk === "succession" && <SuccessionSimulator />}
            {desk === "tracks" && <TrackSequencer />}
            {desk === "verification" && <VerificationLedger />}
            {desk === "handover" && <HandoverProtocol />}
            {desk === "binder" && (
              <MissionBinder entries={binder} onRemove={(id) => setBinder((p) => p.filter((x) => x.id !== id))} onMove={moveEntry} />
            )}
          </Suspense>
        </div>
        </BinderContext.Provider>
        </DeskMetaContext.Provider>
        </MissionContext.Provider>
        </EngineContext.Provider>

        <div className="mb-20 grid gap-3 sm:grid-cols-2 border-t border-brass/40 pt-5">
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
      </div>
    </>
  );
}

function MirrorDesk() {
  const [picked, setPicked] = useState<string[]>(["kenya", "northern-ireland"]);
  const { signals } = useEngine();
  // Linked: the live theatre's own bond vector can be drawn on the radar. Override: historical cases only.
  const [linked, setLinked] = useState(true);
  const [showLive, setShowLive] = useState(true);
  const liveVector =
    linked && signals.bonds
      ? [signals.bonds.interpersonal, signals.bonds.communal, signals.bonds.intergenerational, signals.bonds.institutional]
      : null;
  const analogue = linked && signals.analogue ? CASES.find((c) => c.shortTitle === signals.analogue) : undefined;

  const toggle = (slug: string) =>
    setPicked((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= 3
          ? prev
          : [...prev, slug]
    );

  const selected = picked
    .map((s) => CASES.find((c) => c.slug === s))
    .filter(Boolean) as typeof CASES;

  const mission = useMission();
  // Publish the comparative selection to the mission engine.
  usePublish("mirror", { mirrors: picked });

  const mirrorText = useMemo(() => {
    const bar = "-".repeat(64);
    const fmt = (v: readonly number[]) => v.map((n) => n.toFixed(1)).join(", ");
    const rank = (c: (typeof CASES)[number]) =>
      c.scores.map((score, idx) => ({ score, domain: DOMAINS[idx], why: c.rationales[idx] })).sort((a, b) => a.score - b.score);
    const pairing = PAIRINGS.find((p) => p.slugs.length === picked.length && p.slugs.every((x) => picked.includes(x)));
    const L = [
      "VINCULUM SECURITY · COMPARATIVE PRECEDENT MIRROR",
      "Desk 4 · Cross-Theater Diagnostic Mirror",
      "",
      `THEATRE: ${mission.theatre.trim() || "Unnamed theatre"}`,
      `DRAFTING OFFICER: ${mission.officer.trim() || "Not recorded"}`,
      `CLASSIFICATION: ${mission.classification.trim() || "Unrestricted, working draft"}`,
      "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.",
      "",
      bar,
      "I. SELECTED THEATRES (Interpersonal, Communal, Intergenerational, Institutional)",
      bar,
      ...(liveVector ? [`  Live theatre: (${fmt(liveVector)})`] : ["  Live theatre: not linked or not yet scored"]),
      ...selected.map((c) => {
        const d = liveVector ? Math.sqrt(c.scores.reduce((a, v, i) => a + (v - liveVector[i]) ** 2, 0)) : null;
        return `  ${c.shortTitle} (§ VII.${c.ref}): (${fmt(c.scores)})${d !== null ? ` · distance from live ${d.toFixed(2)}` : ""}`;
      }),
      "",
      bar,
      "II. CURATED PAIRING",
      bar,
      pairing ? `  ${pairing.label}: ${pairing.note}` : "  No curated pairing; a custom comparison.",
      "",
      bar,
      "III. THE FOUR DOCTRINAL INQUIRIES",
      bar,
    ];
    selected.forEach((c) => {
      const r = rank(c);
      L.push(
        "",
        `  ${c.shortTitle.toUpperCase()}`,
        `  Inquiry I · Primary rupture point: ${r[0].domain} (${r[0].score.toFixed(1)}). ${r[0].why}`,
        `  Inquiry II · Intervention mechanism: ${r[3].domain} (${r[3].score.toFixed(1)}). ${r[3].why}`,
        `  Inquiry III · Unresolved vulnerability: ${r[1].domain} (${r[1].score.toFixed(1)}). ${r[1].why}`,
        `  Inquiry IV · Transferable lesson: ${c.takeaway}`
      );
    });
    L.push(
      "",
      bar,
      "IV. CAUTIONARY NOTES",
      bar,
      "  · A precedent is a mirror, not a template. Institutions do not transfer between theatres; only tested relational lessons do.",
      "  · Resemblance in scores is not resemblance in history. Verify each lesson against the live theatre's own sources.",
      "  · Do not stage a precedent's ceremony without its substance. Anti-theatrics: an outcome test applies to every borrowed mechanism.",
      "",
      "Pro Omni Humanitate."
    );
    return L.join("\n");
  }, [mission, picked, selected, liveVector]);

  return (
    <div className="space-y-8">
      <SyncPanel
        linked={linked}
        onToggle={setLinked}
        summary={(x) =>
          x.bonds
            ? [
                `The live theatre vector (${[x.bonds.interpersonal, x.bonds.communal, x.bonds.intergenerational, x.bonds.institutional].map((n) => n.toFixed(1)).join(", ")}) is available to plot on the radar beside the selected cases.`,
                ...(x.analogue ? [`Closest documented case by Euclidean distance: ${x.analogue}.`] : []),
              ]
            : []
        }
      />
      {liveVector && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 border border-brass/40 bg-background/70 px-4 py-2 text-xs text-foreground/85">
          <input
            type="checkbox"
            checked={showLive}
            onChange={(e) => setShowLive(e.target.checked)}
            className="accent-[hsl(var(--accent))]"
          />
          Plot the live theatre vector on the radar
        </label>
      )}
      {analogue && !picked.includes(analogue.slug) && (
        <div className="border border-brass/40 bg-background/70 p-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-foreground/85">Your live bond reading sits closest to <span className="font-semibold">{analogue.shortTitle}</span>.</p>
          <button type="button" onClick={() => setPicked((p) => [analogue.slug, ...p].slice(0, 3))}
            className="min-h-10 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent">Mirror it</button>
        </div>
      )}
      <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6">
        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-3">
          Select two or three theatres
        </p>
        <div className="flex gap-2 flex-wrap">
          {CASES.map((c) => {
            const on = picked.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(c.slug)}
                disabled={!on && picked.length >= 3}
                className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.2em] transition-all disabled:opacity-40 ${
                  on
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
                }`}
              >
                {c.shortTitle}
              </button>
            );
          })}
        </div>
      </div>
      <DiagnosticMirror cases={selected} onSelectPairing={setPicked} live={showLive ? liveVector : null} />
      {selected.length >= 2 && <DeskOutput text={mirrorText} fileName="Vinculum-Comparative-Mirror" />}
    </div>
  );
}
