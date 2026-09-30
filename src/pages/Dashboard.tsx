import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Session } from "@supabase/supabase-js";
import SEO from "@/components/SEO";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import BondDiagnostic from "@/components/BondDiagnostic";
import CableComposer from "@/components/CableComposer";
import PatternMatcher from "@/components/PatternMatcher";
import AuditBench from "@/components/AuditBench";
import LitigationWorkbench from "@/components/LitigationWorkbench";
import DiagnosticMirror from "@/components/DiagnosticMirror";
import AdversarialChamber from "@/components/AdversarialChamber";
import { CASES } from "@/content/cases";
import { PARTIES } from "@/content/parties";

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
    id: "legal",
    label: "Legal Desk",
    eyebrow: "§14 · Litigation",
    title: "Litigation preparation",
    note: "Compile a preparation checklist for a new matter from the doctrine's evidentiary and continuity rules.",
  },
] as const;

export default function Dashboard() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [desk, setDesk] = useState<(typeof DESKS)[number]["id"]>("briefing");
  const navigate = useNavigate();

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
      if (!data.session) navigate("/login", { replace: true });
    });
    return () => sub.subscription.unsubscribe();
  }, [navigate]);

  if (!ready || !session) return null;

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate("/login", { replace: true });
  };

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
            </button>
          ))}
        </div>

        <div className="mb-8 max-w-3xl">
          <p className="eyebrow">{active.eyebrow}</p>
          <h1 className="mt-3 font-serif text-primary text-2xl md:text-3xl">{active.title}</h1>
          <GoldRule className="mt-4 mb-4" />
          <p className="text-sm text-muted-foreground">{active.note}</p>
        </div>

        <div className="pb-24">
          {desk === "briefing" && <CableComposer />}
          {desk === "diagnostics" && (
            <div className="space-y-12">
              <BondDiagnostic />
              <PatternMatcher />
            </div>
          )}
          {desk === "audit" && <AuditBench parties={PARTIES} />}
          {desk === "legal" && <LitigationWorkbench />}
        </div>
      </div>
    </>
  );
}
