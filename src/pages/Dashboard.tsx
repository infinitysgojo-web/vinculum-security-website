import { useCallback, useEffect, useRef, useState, lazy, Suspense } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import { CASES } from "@/content/cases";
import { PARTIES } from "@/content/parties";
import { BinderContext, type BinderEntry } from "@/components/desk/DeskOutput";
import MissionVault, { EMPTY_PROFILE, type MissionProfile } from "@/components/desk/MissionVault";

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


const IDLE_MS = 20 * 60 * 1000;

const DESKS = [
  {
    id: "briefing",
    label: "Briefing Desk",
    eyebrow: "§12B · Chancellery",
    title: "Compose a chancellery memorandum",
    note: "Assemble a formal memorandum from the documented case record, the §9A scripts, and the §12 protocols.",
  },
  {
    id: "diagnostics",
    label: "Diagnostics",
    eyebrow: "§3B · Assessment",
    title: "Bond diagnostic and pattern matching",
    note: "Score the four bonds for a live theatre, then match the profile against the eight documented cases.",
  },
  {
    id: "audit",
    label: "Field Audit",
    eyebrow: "VI.A · Safeguard",
    title: "Stakeholder field audit",
    note: "Review one affected party at a time before an assessment is treated as ready for use.",
  },
  {
    id: "mirror",
    label: "Comparative Mirror",
    eyebrow: "VII · Cross-Theatre",
    title: "The cross-theatre diagnostic mirror",
    note: "Select two or three documented theatres and read them against one rubric.",
  },
  {
    id: "legal",
    label: "Legal Desk",
    eyebrow: "§14 · Litigation",
    title: "Litigation preparation",
    note: "Compile a preparation checklist for a new matter from the doctrine's evidentiary and continuity rules.",
  },
  {
    id: "adversarial",
    label: "Adversarial Chamber",
    eyebrow: "Section X · Review",
    title: "Tested by its critics",
    note: "Rehearse the standing objections and the answers of record before facing them in a room.",
  },
  {
    id: "clauses",
    label: "Clause Architect",
    eyebrow: "§12 · Drafting",
    title: "Continuity provision architect",
    note: "Draft treaty clauses that bind offices, not officeholders, and survive a change of leadership.",
  },
  {
    id: "sentinel",
    label: "Sentinel Matrix",
    eyebrow: "§15 · Early Warning",
    title: "Early-warning sentinel matrix",
    note: "Record observed warning signs across the four bonds and read the rupture index and latent traps.",
  },
  {
    id: "readiness",
    label: "Mission Readiness",
    eyebrow: "VI.A · Clearance",
    title: "Mission readiness clearance",
    note: "Clear a mission against the doctrine's protection and verification gates before deployment.",
  },
  {
    id: "counterpart",
    label: "Counterpart Prompter",
    eyebrow: "§9A · Meeting",
    title: "Counterpart protocol prompter",
    note: "Walk a meeting phase by phase with the scripted question for each counterpart and bond.",
  },
  {
    id: "succession",
    label: "Succession Simulator",
    eyebrow: "§12C · Stress Test",
    title: "Treaty stress and succession simulator",
    note: "Test a drafted instrument against leadership change, funding loss and capture, and read which clause breaks first.",
  },
  {
    id: "tracks",
    label: "Track Sequencing",
    eyebrow: "§9B · Sequencing",
    title: "Track I and Track II sequencing",
    note: "Keep the principals' track and the communal track in step, and see the gap before it becomes an elite pact.",
  },
  {
    id: "binder",
    label: "Mission Binder",
    eyebrow: "Consolidation · Master Dossier",
    title: "Consolidated mission binder",
    note: "Compile the documents you added from any desk into one numbered master briefing. Held in memory only; it clears on sign-out or refresh.",
  },
] as const;



export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [desk, setDesk] = useState<(typeof DESKS)[number]["id"]>("briefing");
  const navigate = useNavigate();
  const [binder, setBinder] = useState<BinderEntry[]>([]);
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
        <div className="flex flex-wrap gap-2 mb-8">
          {DESKS.map((d) => (
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

