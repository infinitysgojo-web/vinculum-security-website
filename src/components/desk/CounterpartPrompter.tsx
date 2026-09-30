import { useMemo, useState } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

/** Handbook §9A counterpart protocol prompter: a sequenced meeting script. */
const COUNTERPARTS = [
  { id: "gov", label: "Government official", caution: "Treat their account of their own institution as a hypothesis, never a conclusion." },
  { id: "armed", label: "Armed group or ex-combatant leader", caution: "Do not trade recognition for access; standing is tested, not conferred." },
  { id: "civil", label: "Civil society representative", caution: "Ask who authorised them, and verify with the community separately." },
  { id: "elder", label: "Traditional or religious elder", caution: "Test whether authority is actually transferred to the next generation." },
  { id: "youth", label: "Youth delegate", caution: "Never tokenise; ask what changed because they spoke." },
] as const;

const PHASES = ["Opening", "Probing", "Commitment", "Close"] as const;

const SCRIPT: Record<number, [string, string, string, string]> = {
  0: [
    "Who in your office carries this relationship if you are not here next year?",
    "Which named person gave the last assurance, and what happened when they left?",
    "What would you put in writing today that binds your successor?",
    "Whom should I call, by office, if this conversation needs to continue without you?",
  ],
  1: [
    "How would the community you speak for describe why you are in this room?",
    "Which grievance from your community has been resolved this year, and by whom?",
    "What would the community need to see before it believed this process?",
    "How will you report this meeting back, and to whom?",
  ],
  2: [
    "Who from the next generation should be hearing this conversation?",
    "What happened to the last input young people gave, after the session closed?",
    "What would you commit to that outlasts the current budget cycle?",
    "When will the successor generation see a decision they changed?",
  ],
  3: [
    "What in this arrangement survives a change of officeholder?",
    "Which body verifies your compliance, and who appoints it?",
    "Where is the undertaking written, and what office holds it?",
    "What happens by default if neither of us is here in two years?",
  ],
};

export default function CounterpartPrompter() {
  const [cp, setCp] = useState(0);
  const [bond, setBond] = useState(0);
  const [phase, setPhase] = useState(0);

  const text = useMemo(() => {
    const c = COUNTERPARTS[cp];
    const L = ["COUNTERPART MEETING SCRIPT", "Compiled from Vinculum Diplomacy: The Practitioner Handbook, Section 9A", "", `COUNTERPART: ${c.label}`, `FOCUS BOND: ${DOMAINS[bond]}`, `DATE: ${todayStamp()}`, "", `STANDING CAUTION: ${c.caution}`, ""];
    PHASES.forEach((p, i) => L.push(`${i + 1}. ${p.toUpperCase()}`, `   "${SCRIPT[bond][i]}"`, ""));
    L.push("GUARDRAILS", "  - Record the answer, not your interpretation of it.", "  - Never expose a community participant without a protection framework in force.", "  - Children are a protected party and never a bond source.", "", "Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [cp, bond]);

  return (
    <section className={panel}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={label} htmlFor="cp-c">Counterpart</label>
              <select id="cp-c" className={`${field} text-base sm:text-sm min-h-11`} value={cp} onChange={(e) => setCp(Number(e.target.value))}>
                {COUNTERPARTS.map((c, i) => <option key={c.id} value={i}>{c.label}</option>)}
              </select>
            </div>
            <div className="min-w-0">
              <label className={label} htmlFor="cp-b">Focus bond</label>
              <select id="cp-b" className={`${field} text-base sm:text-sm min-h-11`} value={bond} onChange={(e) => setBond(Number(e.target.value))}>
                {DOMAINS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </div>
          </div>
          <p className="text-xs text-muted-foreground italic">{COUNTERPARTS[cp].caution}</p>
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-1 mb-4">
              {PHASES.map((p, i) => (
                <button key={p} type="button" aria-pressed={phase === i} onClick={() => setPhase(i)}
                  className={`w-full min-h-11 px-2 py-2 border text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] leading-tight ${phase === i ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                  {p}
                </button>
              ))}
            </div>
            <blockquote className="border-l-2 border-accent bg-background p-4 sm:p-5 font-serif text-lg sm:text-xl md:text-2xl text-primary leading-snug break-words">
              "{SCRIPT[bond][phase]}"
            </blockquote>
            <div className="flex justify-between items-center gap-3 mt-3">
              <button type="button" disabled={phase === 0} onClick={() => setPhase(phase - 1)} className="min-h-11 px-1 text-[10px] uppercase tracking-[0.2em] text-primary disabled:opacity-30">Previous</button>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{phase + 1} / 4</span>
              <button type="button" disabled={phase === 3} onClick={() => setPhase(phase + 1)} className="min-h-11 px-1 text-[10px] uppercase tracking-[0.2em] text-accent disabled:opacity-30">Next</button>
            </div>
          </div>
        </div>
        <DeskOutput text={text} fileName="Vinculum-Counterpart-Script" />
      </div>
    </section>
  );
}
