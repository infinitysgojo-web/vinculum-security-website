import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

/** Pre-deployment mission readiness clearance. Deterministic; nothing stored. */
const GATES = [
  { id: "map", group: "Bond map", text: "All four bonds mapped for the theatre with named sources.", critical: true },
  { id: "handover", group: "Bond map", text: "Counterpart succession chain identified for each principal.", critical: false },
  { id: "standing", group: "Standing", text: "Community recognition of every interlocutor independently confirmed.", critical: true },
  { id: "youth", group: "Standing", text: "Successor-generation participants selected by their own communities.", critical: false },
  { id: "child", group: "Protection", text: "A mandated child-protection framework is in force before any contact.", critical: true },
  { id: "witness", group: "Protection", text: "Retaliation risk assessed for every community participant.", critical: true },
  { id: "gender", group: "Protection", text: "Gendered harm named explicitly in the bond map.", critical: false },
  { id: "verifier", group: "Verification", text: "An independent verifier agreed, not answerable to any party.", critical: true },
  { id: "continuity", group: "Verification", text: "Continuity provisions drafted to survive officeholder change.", critical: false },
  { id: "exit", group: "Verification", text: "Exit and handover plan for the mission itself documented.", critical: false },
] as const;

export default function ReadinessDesk() {
  const [mission, setMission] = useState("");
  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) => setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const r = useMemo(() => {
    const missingCritical = GATES.filter((g) => g.critical && !done.includes(g.id));
    const pct = Math.round((done.length / GATES.length) * 100);
    const verdict = missingCritical.length ? "NOT CLEARED" : pct === 100 ? "CLEARED" : "CLEARED WITH CONDITIONS";
    return { missingCritical, pct, verdict };
  }, [done]);

  const text = useMemo(() => {
    const L = ["MISSION READINESS CLEARANCE", "Compiled under the Vinculum methodology safeguards (Section VI.A)", "", `MISSION: ${mission.trim() || "Unnamed mission"}`, `DATE: ${todayStamp()}`, `VERDICT: ${r.verdict}`, `GATES MET: ${done.length} of ${GATES.length} (${r.pct}%)`, ""];
    let g = "";
    GATES.forEach((x) => {
      if (x.group !== g) { g = x.group; L.push(g.toUpperCase()); }
      L.push(`  [${done.includes(x.id) ? "x" : " "}] ${x.text}${x.critical ? " (critical)" : ""}`);
    });
    L.push("");
    if (r.missingCritical.length) {
      L.push("BLOCKING CONDITIONS");
      r.missingCritical.forEach((x) => L.push(`  - ${x.text}`));
      L.push("", "Deployment must not proceed until every critical gate is met.");
    }
    L.push("", "Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [mission, done, r]);

  let group = "";
  return (
    <section className={panel}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="rd-m">Mission</label>
            <input id="rd-m" className={field} value={mission} onChange={(e) => setMission(e.target.value)} placeholder="e.g. Lake Region mediation support mission" />
          </div>
          {GATES.map((x) => {
            const head = x.group !== group;
            group = x.group;
            return (
              <div key={x.id}>
                {head && <p className={`${label} mt-4`}>{x.group}</p>}
                <label className="flex gap-3 items-start text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1" checked={done.includes(x.id)} onChange={() => toggle(x.id)} />
                  <span className="text-foreground/85">{x.text}{x.critical && <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-accent">Critical</span>}</span>
                </label>
              </div>
            );
          })}
        </div>
        <div className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className={label}>Clearance</p>
            <p className={`font-serif text-3xl ${r.missingCritical.length ? "text-accent" : "text-primary"}`}>{r.verdict}</p>
            <p className="text-xs text-muted-foreground mt-1">{done.length} of {GATES.length} gates met</p>
          </div>
          <DeskOutput text={text} fileName="Vinculum-Mission-Readiness" />
        </div>
      </div>
    </section>
  );
}
