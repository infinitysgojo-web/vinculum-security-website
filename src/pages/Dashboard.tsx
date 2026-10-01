import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import { CASES } from "@/content/cases";
import { PARTIES } from "@/content/parties";
import { BinderContext, DeskMetaContext, type BinderEntry } from "@/components/desk/DeskOutput";
import { MissionContext, EMPTY_PROFILE, type MissionProfile } from "@/components/desk/mission";
import MissionVault from "@/components/desk/MissionVault";

// Proprietary desks are split into separate chunks that are only fetched
// once a valid session exists, so they never ship with the public site.
const BondDiagnostic = lazy(() => import("@/components/BondDiagnostic"));
const CableComposer = lazy(() => import("@/components/CableComposer"));
const PatternMatcher = lazy(() => import("@/components/PatternMatcher"));
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
  const addToBinder = useCallback((e: BinderEntry) => {
    setBinder((prev) => (prev.some((x) => x.id === e.id) ? prev.map((x) => (x.id === e.id ? e : x)) : [...prev, e]));
  }, []);
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
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (!s) navigate("/login", { replace: true });
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (!data.session) navigate("/login", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
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

  if (!ready || !session) return null;

  const active = DESKS.find((d) => d.id === desk)!;

  return (
    <>
      <SEO
        title="The Vinculum Dashboard"
        description="Private working desks for Vinculum practitioners."
        path="/dashboard"
        noIndex
      />
      <div className="border-b-2 border-primary bg-background">
        <div className="container flex flex-wrap items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Logo size={26} />
            <div>
              <span className="wordmark text-lg leading-none block">Vinculum Dashboard</span>
              <span className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Pro Omni Humanitate
              </span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-semibold">
            <span className="hidden sm:inline text-muted-foreground normal-case tracking-normal text-xs">
              {session.user.email}
            </span>
            <Link to="/" className="text-primary hover:text-accent transition-colors">Public site</Link>
            <button onClick={signOut} className="text-accent hover:underline">Sign out</button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-8">
          <MissionVault profile={profile} setProfile={setProfile} binder={binder} setBinder={setBinder} />
        </div>

        <div className="mb-6 flex flex-wrap gap-x-6 gap-y-3 border-b border-brass/40 pb-3">
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
                className={`pb-2 -mb-3 border-b-2 text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
                  on ? "border-accent text-accent" : "border-transparent text-primary/60 hover:text-accent"
                }`}
              >
                {dv.label}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mb-10">
          {DESKS.filter((d) => d.division === division).map((d) => (
            <button
              key={d.id}
              type="button"
              aria-pressed={desk === d.id}
              onClick={() => setDesk(d.id)}
              className={`px-4 py-2 border text-[10px] font-semibold uppercase tracking-[0.2em] transition-all ${
                desk === d.id
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
              }`}
            >
              {d.label}
              {d.id === "binder" && binder.length > 0 ? ` (${binder.length})` : ""}
            </button>
          ))}
        </div>

        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">{active.eyebrow}</p>
          <h1 className="mt-3 font-serif text-primary text-2xl md:text-3xl">{active.title}</h1>
          <GoldRule className="mt-4 mb-4" />
          <p className="text-sm text-muted-foreground">{active.note}</p>
          {profile.theatre.trim() && (
            <p className="mt-3 text-xs text-muted-foreground">
              Active mission: <span className="text-primary">{profile.theatre}</span>
              {profile.classification ? ` · ${profile.classification}` : ""}
            </p>
          )}
        </div>

        <BinderContext.Provider value={{ add: addToBinder }}>
        <div className="pb-24">
          <Suspense fallback={<p className="text-sm text-muted-foreground">Opening the desk…</p>}>
            {desk === "briefing" && <CableComposer />}
            {desk === "diagnostics" && (
              <div className="space-y-12">
                <BondDiagnostic />
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
            {desk === "binder" && (
              <MissionBinder entries={binder} onRemove={(id) => setBinder((p) => p.filter((x) => x.id !== id))} onMove={moveEntry} />
            )}


          </Suspense>
        </div>
        </BinderContext.Provider>
      </div>
    </>
  );
}

function MirrorDesk() {
  const [picked, setPicked] = useState<string[]>(["kenya", "northern-ireland"]);

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

  return (
    <div className="space-y-8">
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
      <DiagnosticMirror cases={selected} onSelectPairing={setPicked} />
    </div>
  );
}

