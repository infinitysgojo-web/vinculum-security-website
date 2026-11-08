import { useEffect, useMemo, useState } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput, { field, label, panel } from "./DeskOutput";
import { useEngine, usePublish, hasSignal, telemetryLines } from "./engine";
import SyncPanel from "./SyncPanel";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { phaseQuestions, counterpartTactics, newSeat, updateSeat, removeSeat, type Seat } from "./questioning";

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

const FOLLOW_UPS = [
  ["Who authorised your participation, and how can that mandate be independently checked?", "Who is absent from this conversation whose standing must be protected?"],
  ["What dated record supports that answer, and who can verify it independently?", "Who would dispute that account, and what safe channel lets them be heard?", "What would change your answer, and what remains unverified?"],
  ["Which office owns the obligation, and by what date must it act?", "What evidence will demonstrate performance, and what happens if it fails?"],
  ["Which points remain disputed or unanswered in the written record?", "Who receives the record, and when will the parties review it?"],
] as const;

const AUDIT = [
  "Did any answer name an office rather than a person?",
  "Was a single altered decision identified, with a date?",
  "Did the counterpart accept independent verification without conditions?",
  "Was anything conceded verbally that is not yet written?",
  "Does a named successor exist for every commitment recorded?",
];

export default function CounterpartPrompter() {
  const [bond, setBond] = useState(0);
  const [tacticId, setTacticId] = useState("");
  // The room: several counterparts at once, each keeping its own phase, place and wording.
  const [room, setRoom] = useState<Seat[]>(() => [newSeat("s1", 0)]);
  const [activeKey, setActiveKey] = useState("s1");
  const [nextId, setNextId] = useState(2);
  const seat = room.find((s) => s.key === activeKey) ?? room[0];
  const patch = (p: Partial<Seat>) => setRoom((r) => updateSeat(r, seat.key, p));
  const { cp, phase, questionIndex, customOn, cLabel, cCaution, cPivot, cQ } = seat;
  const setCp = (v: number) => patch({ cp: v });
  const setPhase = (v: number) => patch({ phase: v, questionIndex: 0 });
  const setQuestionIndex = (v: number) => patch({ questionIndex: v });
  const setCustomOn = (v: boolean) => patch({ customOn: v, questionIndex: 0 });
  const setCLabel = (v: string) => patch({ cLabel: v });
  const setCCaution = (v: string) => patch({ cCaution: v });
  const setCPivot = (v: string) => patch({ cPivot: v });
  const seatLabel = (s: Seat) => (s.customOn ? s.cLabel.trim() || "Custom counterpart" : COUNTERPARTS[s.cp]?.label ?? "");
  const addSeat = () => {
    const key = `s${nextId}`;
    const used = new Set(room.map((s) => s.cp));
    const free = COUNTERPARTS.findIndex((_, i) => !used.has(i));
    setRoom((r) => [...r, newSeat(key, free >= 0 ? free : 0)]);
    setNextId((n) => n + 1);
    setActiveKey(key);
  };
  const dropSeat = (key: string) => {
    const next = removeSeat(room, key);
    setRoom(next);
    if (key === activeKey) setActiveKey(next[0].key);
  };

  // Division I decides which bond this meeting is actually about.
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const live = linked && hasSignal(signals);
  const upstreamBond = live && signals.weakestBond ? (DOMAINS as readonly string[]).indexOf(signals.weakestBond) : -1;
  useEffect(() => {
    if (upstreamBond >= 0) setBond(upstreamBond);
  }, [upstreamBond]);

  // Custom mode: define a counterpart the ten archetypes do not cover,
  // and override any scripted question with your own wording.
  usePublish("counterpart", { counterpart: room.map(seatLabel).join("; ") });
  const setQ = (i: number, v: string) =>
    patch({ cQ: cQ.map((x, j) => (j === i ? v : x)) as [string, string, string, string] });

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
    () => SCRIPT[bond].map((q, i) => phaseQuestions(customOn ? cQ[i] : "", [q, ...FOLLOW_UPS[i]])),
    [bond, customOn, cQ]
  );

  const tactics = counterpartTactics(linked ? signals.customNotes : []);
  const selectedTactic = tactics.find((note) => note.id === tacticId);
  const currentIndex = Math.min(questionIndex, questions[phase].length - 1);

  const text = useMemo(() => {
    const L = ["COUNTERPART MEETING SCRIPT", "Compiled from Vinculum Diplomacy: The Practitioner Handbook, Section 9A", "", `COUNTERPART: ${active.label}${active.custom ? " (own definition)" : ""}`, `FOCUS BOND: ${DOMAINS[bond]}`, ...(room.length > 1 ? [`IN THE ROOM: ${room.map(seatLabel).join("; ")}`] : []), "", `STANDING CAUTION: ${active.caution}`, `TACTICAL PIVOT: ${active.pivot}`, ""];
    PHASES.forEach((p, i) => {
      L.push(`${i + 1}. ${p.toUpperCase()}`);
      questions[i].forEach((q, j) => L.push(`   ${j + 1}. "${q}"`));
      L.push("");
    });
    if (tactics.length) {
      L.push("INSCRIBED COUNTERPART TACTICS");
      tactics.forEach((note) => L.push(`  ${note.title}`, note.body, ""));
    }
    L.push("GUARDRAILS", "  - Record the answer, not your interpretation of it.", "  - Never expose a community participant without a protection framework in force.", "  - Children are a protected party and never a bond source.", "");
    L.push("POST-MEETING AUDIT LEDGER");
    AUDIT.forEach((a) => L.push(`  [ ] ${a}`));
    if (live) L.push("", ...telemetryLines(signals));
    L.push("", "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    return L.join("\n");
  }, [active, bond, questions, live, signals, tactics, room]);


  return (
    <section className="w-full min-w-0">
      <div className="instrument-layout w-full min-w-0">
        <div className="space-y-5">
          <div className="border border-brass/40 bg-background p-4">
            <p className={label}>Counterparts in the room · {room.length}</p>
            <div className="flex flex-wrap gap-2" role="tablist" aria-label="Counterparts in the room">
              {room.map((s) => (
                <span key={s.key} className={`inline-flex items-center border ${s.key === seat.key ? "border-accent bg-accent text-accent-foreground" : "border-brass/50 text-primary"}`}>
                  <Button variant="ghost" type="button" role="tab" aria-selected={s.key === seat.key} onClick={() => setActiveKey(s.key)} className="h-auto min-h-9 px-3 py-1 text-xs whitespace-normal text-left hover:bg-transparent">
                    {seatLabel(s)} · {PHASES[s.phase]}
                  </Button>
                  {room.length > 1 && (
                    <Button variant="ghost" type="button" aria-label={`Remove ${seatLabel(s)} from the room`} onClick={() => dropSeat(s.key)} className="h-9 w-9 p-0 hover:bg-transparent">×</Button>
                  )}
                </span>
              ))}
              <Button variant="outline" type="button" onClick={addSeat} className="min-h-9 text-[10px] uppercase tracking-[0.16em]">Add counterpart</Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Each counterpart keeps its own phase, question and wording when you switch between them.</p>
          </div>
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
              <Button variant="ghost" type="button" aria-pressed={customOn} onClick={() => setCustomOn(!customOn)}
                className={`min-h-9 px-3 border text-[10px] uppercase tracking-[0.18em] font-semibold ${customOn ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                {customOn ? "On" : "Off"}
              </Button>
            </div>
            {customOn && (
              <div className="mt-4 space-y-3">
                <p className="text-xs text-muted-foreground">
                  Anything you leave blank falls back to the selected archetype above.
                </p>
                <input aria-label="Custom counterpart name" className={`${field} text-base sm:text-sm min-h-11`} value={cLabel} onChange={(e) => setCLabel(e.target.value)} placeholder="Counterpart, for example: diaspora elders' council" />
                <textarea rows={3} aria-label="Custom standing caution" className={`${field} text-base sm:text-sm min-h-11`} value={cCaution} onChange={(e) => setCCaution(e.target.value)} placeholder="Standing caution to carry into the room" />
                <textarea rows={3} aria-label="Custom tactical pivot" className={`${field} text-base sm:text-sm min-h-11`} value={cPivot} onChange={(e) => setCPivot(e.target.value)} placeholder="Pivot if they deflect or attack" />
                <div className="grid gap-2">
                  {PHASES.map((p, i) => (
                    <label key={p} className="block"><span className={label}>{p} questions</span><textarea rows={3} aria-label={`${p} questions`} className={`${field} text-base sm:text-sm min-h-11 resize-y`} value={cQ[i]} onChange={(e) => setQ(i, e.target.value)} placeholder={`${p}: one examination question per line`} /></label>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="border border-border bg-navy-tint/40 p-4">
            <p className={label}>Live mission posture</p>
            <dl className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">
              <div><dt className="text-muted-foreground">Limiting bond</dt><dd className="text-primary">{signals.weakestBond ? `${signals.weakestBond}${signals.weakestScore !== undefined ? ` · ${signals.weakestScore.toFixed(1)}` : ""}` : "Not yet scored"}</dd></div>
              <div><dt className="text-muted-foreground">Rupture index</dt><dd className={(signals.rupture ?? 0) >= 35 ? "text-destructive" : "text-primary"}>{signals.rupture !== undefined ? `${signals.rupture}%` : "Not yet read"}</dd></div>
              <div><dt className="text-muted-foreground">Track alignment</dt><dd className={signals.elitePactAlert ? "text-destructive" : "text-primary"}>{signals.trackGap === undefined ? "Not recorded" : signals.elitePactAlert ? "Elite-Pact Mirage" : "Within tolerance"}</dd></div>
              <div><dt className="text-muted-foreground">Covenants on the table</dt><dd className="text-primary">{signals.covenants?.length ?? 0}</dd></div>
            </dl>
          </div>
          <div className="border border-border bg-background p-4">
            <p className={label}>Full four-phase sequence</p>
            <ol className="space-y-2">
              {PHASES.map((p, k) => (
                <li key={p} className="text-xs leading-relaxed">
                  <Button variant="ghost" type="button" onClick={() => setPhase(k)} className={`h-auto min-h-11 w-full flex-col items-start whitespace-normal text-left ${phase === k ? "text-accent" : "text-foreground/85 hover:text-accent"}`}>
                    <span className="block font-mono text-[10px] uppercase tracking-[0.14em]">{k + 1}. {p}</span>
                    <span className="font-serif italic">“{questions[k][0]}” · {questions[k].length} questions</span>
                  </Button>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="space-y-4 min-w-0">
          <SyncPanel
            linked={linked}
            onToggle={setLinked}
            summary={(s) => {
              const n: string[] = [];
              if (s.weakestBond) n.push(`The focus bond is set to ${s.weakestBond}, the most exposed reading from Division I.`);
              if (s.rupture !== undefined && s.rupture >= 35)
                n.push("Rupture is elevated, so hold the commitment phase until the verification question has been answered.");
              if (s.elitePactAlert) n.push("An Elite-Pact Mirage is active: ask who in the community would dispute this answer.");
              return n;
            }}
          />
          <div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-1 mb-4">
              {PHASES.map((p, i) => (
                <Button variant="ghost" key={p} type="button" aria-pressed={phase === i} onClick={() => setPhase(i)}
                  className={`w-full min-h-11 px-2 py-2 border text-[10px] font-semibold uppercase tracking-[0.12em] sm:tracking-[0.18em] leading-tight ${phase === i ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                  {p}
                </Button>
              ))}
            </div>
            <blockquote className="border-l-2 border-accent bg-background p-4 sm:p-5 font-serif text-lg sm:text-xl md:text-2xl text-primary leading-snug break-words">
              “{questions[phase][currentIndex]}”
            </blockquote>
            <div className="mt-3 flex items-center justify-between gap-3" aria-label="Question navigation">
              <Button variant="outline" size="icon" aria-label="Previous question" disabled={currentIndex === 0} onClick={() => setQuestionIndex(currentIndex - 1)}><ChevronLeft /></Button>
              <span className="text-xs font-mono text-muted-foreground">Question {currentIndex + 1} / {questions[phase].length}</span>
              <Button variant="outline" size="icon" aria-label="Next question" disabled={currentIndex === questions[phase].length - 1} onClick={() => setQuestionIndex(currentIndex + 1)}><ChevronRight /></Button>
            </div>
            <ol className="mt-4 space-y-2" aria-label={`${PHASES[phase]} examination sequence`}>
              {questions[phase].map((q, i) => <li key={i}><Button variant="ghost" aria-pressed={currentIndex === i} onClick={() => setQuestionIndex(i)} className={`h-auto min-h-11 w-full justify-start whitespace-normal text-left text-xs ${currentIndex === i ? "text-accent" : "text-foreground"}`}><span className="shrink-0 font-mono">{i + 1}.</span><span className="min-w-0 [overflow-wrap:anywhere]">{q}</span></Button></li>)}
            </ol>
            {tactics.length > 0 && <div className="mt-4 border-t border-border pt-4">
              <label htmlFor="cp-tactic" className={label}>Inscribed counterpart tactic</label>
              <select id="cp-tactic" className={field} value={selectedTactic?.id ?? ""} onChange={(e) => setTacticId(e.target.value)}>
                <option value="">Select recorded tactic</option>
                {tactics.map((note) => <option key={note.id} value={note.id}>{note.title}</option>)}
              </select>
              {selectedTactic && <p className="mt-3 whitespace-pre-wrap text-sm text-foreground [overflow-wrap:anywhere]">{selectedTactic.body || "No examination detail recorded."}</p>}
            </div>}
            <div className="border border-brass/40 bg-background p-4 mt-3">
              <p className={label}>If they deflect or attack</p>
              <p className="text-sm text-foreground/85 break-words">{active.pivot}</p>
            </div>
            <div className="flex justify-between items-center gap-3 mt-3">
              <Button variant="ghost" type="button" disabled={phase === 0} onClick={() => setPhase(phase - 1)} className="min-h-11 px-1 text-[10px] uppercase tracking-[0.2em] text-primary disabled:opacity-30">Previous</Button>
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{phase + 1} / 4</span>
              <Button variant="ghost" type="button" disabled={phase === 3} onClick={() => setPhase(phase + 1)} className="min-h-11 px-1 text-[10px] uppercase tracking-[0.2em] text-accent disabled:opacity-30">Next</Button>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full min-w-0">
        <DeskOutput cable text={text} fileName="Vinculum-Counterpart-Script" />
      </div>
    </section>
  );
}
