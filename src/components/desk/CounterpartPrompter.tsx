import { useMemo, useState } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

/** Handbook §9A counterpart protocol prompter: a sequenced meeting script. */
const COUNTERPARTS = [
  { id: "gov", label: "Government official", caution: "Treat their account of their own institution as a hypothesis, never a conclusion.", pivot: "If they answer with a policy document, ask which decision that document changed last year." },
  { id: "armed", label: "Armed group or ex-combatant leader", caution: "Do not trade recognition for access; standing is tested, not conferred.", pivot: "If they claim to speak for the whole movement, ask who would dispute that, and whether you may ask them." },
  { id: "civil", label: "Civil society representative", caution: "Ask who authorised them, and verify with the community separately.", pivot: "If they speak in the language of donors, ask how they would put the same point to their own village." },
  { id: "elder", label: "Traditional or religious elder", caution: "Test whether authority is actually transferred to the next generation.", pivot: "If they invoke custom as settled, ask who under thirty agrees with that reading and where they said so." },
  { id: "youth", label: "Youth delegate", caution: "Never tokenise; ask what changed because they spoke.", pivot: "If they defer to the elders in the room, offer a written channel and hold the question open." },
  { id: "spoiler", label: "Spoiler or paramilitary commander", caution: "Assume every concession is a probe; concede nothing verbally that is not already written.", pivot: "If they escalate, restate the cost to their own constituency and end the session on time." },
  { id: "guarantor", label: "Regional guarantor envoy", caution: "Their interest is regional stability, which is not the same as this settlement holding.", pivot: "If they promise pressure, ask what instrument carries it and who signs it." },
  { id: "donor", label: "Donor or international financier", caution: "Funding horizons shorter than the settlement create the Generational Cliff.", pivot: "If the horizon is one cycle, ask what survives the cycle and who owns it afterwards." },
  { id: "bureau", label: "Legalistic bureaucrat", caution: "Procedure is being offered in place of outcome; apply the outcome test every time.", pivot: "If they cite process compliance, ask for one altered decision from the last two reporting periods." },
  { id: "media", label: "Media or information broker", caution: "Nothing said is off the record; assume publication and speak to the constituency, not the reporter.", pivot: "If they seek a quote on a concession, refer them to the written record and decline the elaboration." },
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

const AUDIT = [
  "Did any answer name an office rather than a person?",
  "Was a single altered decision identified, with a date?",
  "Did the counterpart accept independent verification without conditions?",
  "Was anything conceded verbally that is not yet written?",
  "Does a named successor exist for every commitment recorded?",
];

export default function CounterpartPrompter() {
  const [cp, setCp] = useState(0);
  const [bond, setBond] = useState(0);
  const [phase, setPhase] = useState(0);

  // Custom mode: define a counterpart the ten archetypes do not cover,
  // and override any scripted question with your own wording.
  const [customOn, setCustomOn] = useState(false);
  const [cLabel, setCLabel] = useState("");
  const [cCaution, setCCaution] = useState("");
  const [cPivot, setCPivot] = useState("");
  const [cQ, setCQ] = useState<[string, string, string, string]>(["", "", "", ""]);
  const setQ = (i: number, v: string) =>
    setCQ((p) => p.map((x, j) => (j === i ? v : x)) as [string, string, string, string]);

  const active = useMemo(() => {
    const base = COUNTERPARTS[cp];
    if (!customOn) return { label: base.label, caution: base.caution, pivot: base.pivot, custom: false };
    return {
      label: cLabel.trim() || "Counterpart defined by the drafting officer",
      caution: cCaution.trim() || base.caution,
      pivot: cPivot.trim() || base.pivot,
      custom: true,
    };
  }, [cp, customOn, cLabel, cCaution, cPivot]);

  const questions = useMemo(
    () => SCRIPT[bond].map((q, i) => (customOn && cQ[i].trim() ? cQ[i].trim() : q)) as [string, string, string, string],
    [bond, customOn, cQ]
  );

  const text = useMemo(() => {
    const L = ["COUNTERPART MEETING SCRIPT", "Compiled from Vinculum Diplomacy: The Practitioner Handbook, Section 9A", "", `COUNTERPART: ${active.label}${active.custom ? " (own definition)" : ""}`, `FOCUS BOND: ${DOMAINS[bond]}`, `DATE: ${todayStamp()}`, "", `STANDING CAUTION: ${active.caution}`, `TACTICAL PIVOT: ${active.pivot}`, ""];
    PHASES.forEach((p, i) => L.push(`${i + 1}. ${p.toUpperCase()}`, `   "${questions[i]}"`, ""));
    L.push("GUARDRAILS", "  - Record the answer, not your interpretation of it.", "  - Never expose a community participant without a protection framework in force.", "  - Children are a protected party and never a bond source.", "");
    L.push("POST-MEETING AUDIT LEDGER");
    AUDIT.forEach((a) => L.push(`  [ ] ${a}`));
    L.push("", "Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [active, bond, questions]);


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
          <p className="text-xs text-muted-foreground italic">{active.caution}</p>

          <div className="border border-brass/40 bg-background p-4">
            <div className="flex items-center justify-between gap-3">
              <span className={`${label} mb-0`}>Own counterpart and own wording</span>
              <button type="button" aria-pressed={customOn} onClick={() => setCustomOn(!customOn)}
                className={`min-h-9 px-3 border text-[10px] uppercase tracking-[0.18em] font-semibold ${customOn ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                {customOn ? "On" : "Off"}
              </button>
            </div>
            {customOn && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Anything you leave blank falls back to the selected archetype above.
                </p>
                <input className={`${field} text-base sm:text-sm min-h-11`} value={cLabel} onChange={(e) => setCLabel(e.target.value)} placeholder="Counterpart, for example: diaspora elders' council" />
                <input className={`${field} text-base sm:text-sm min-h-11`} value={cCaution} onChange={(e) => setCCaution(e.target.value)} placeholder="Standing caution to carry into the room" />
                <input className={`${field} text-base sm:text-sm min-h-11`} value={cPivot} onChange={(e) => setCPivot(e.target.value)} placeholder="Pivot if they deflect or attack" />
                <div className="grid gap-2">
                  {PHASES.map((p, i) => (
                    <input key={p} className={`${field} text-base sm:text-sm min-h-11`} value={cQ[i]} onChange={(e) => setQ(i, e.target.value)} placeholder={`${p} question, your own wording`} />
                  ))}
                </div>
              </div>
            )}
          </div>

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
              "{questions[phase]}"
            </blockquote>
            <div className="border border-brass/40 bg-background p-4 mt-3">
              <p className={label}>If they deflect or attack</p>
              <p className="text-sm text-foreground/85 break-words">{active.pivot}</p>
            </div>
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
