import { useMemo, useState } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput, { label, panel, todayStamp } from "./DeskOutput";

/** Handbook §15 early-warning matrix. Weighted, rule-based; nothing stored. */
const SIGNS: { bond: number; text: string; w: number }[] = [
  { bond: 0, text: "A key principal has left office without a documented handover.", w: 3 },
  { bond: 0, text: "Back-channel contact between leaders has lapsed for over 90 days.", w: 2 },
  { bond: 0, text: "Assurances are being given by named individuals, not offices.", w: 2 },
  { bond: 1, text: "Community grievances are lodged but none has been resolved.", w: 3 },
  { bond: 1, text: "Representatives are no longer recognised by their own communities.", w: 3 },
  { bond: 1, text: "Inflammatory rhetoric is rising in local media or gatherings.", w: 2 },
  { bond: 2, text: "Youth input has not altered a single documented decision.", w: 3 },
  { bond: 2, text: "Youth participation funding ends with the current budget cycle.", w: 2 },
  { bond: 2, text: "Successor-generation unemployment or displacement is rising.", w: 2 },
  { bond: 3, text: "The verifying body is not independent of the party it verifies.", w: 3 },
  { bond: 3, text: "Implementing bodies lack statutory footing or protected budgets.", w: 2 },
  { bond: 3, text: "Senior personnel turnover exceeds one rotation per year.", w: 2 },
];

const MAX = SIGNS.reduce((s, x) => s + x.w, 0);

function band(pct: number) {
  if (pct >= 60) return { name: "Critical", advice: "Convene principals and verifier within 14 days; activate continuity provisions." };
  if (pct >= 35) return { name: "Elevated", advice: "Open a protected channel on the weakest bond and schedule independent verification." };
  if (pct >= 15) return { name: "Guarded", advice: "Monitor monthly; document handovers and confirm community standing." };
  return { name: "Stable", advice: "Maintain quarterly review; no immediate intervention indicated." };
}

export default function SentinelMatrix() {
  const [on, setOn] = useState<number[]>([]);
  const toggle = (i: number) => setOn((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));

  const r = useMemo(() => {
    const byBond = DOMAINS.map((_, b) => {
      const all = SIGNS.filter((s) => s.bond === b);
      const max = all.reduce((s, x) => s + x.w, 0);
      const hit = SIGNS.reduce((s, x, i) => s + (x.bond === b && on.includes(i) ? x.w : 0), 0);
      return Math.round((hit / max) * 100);
    });
    const score = SIGNS.reduce((s, x, i) => s + (on.includes(i) ? x.w : 0), 0);
    const pct = Math.round((score / MAX) * 100);
    const traps: string[] = [];
    if (byBond[1] >= 50 && byBond[2] >= 50 && byBond[0] < 50) traps.push("The Elite-Pact Mirage: principals are aligned while communities and youth disengage.");
    if (byBond[2] >= 60) traps.push("The Generational Cliff: the successor generation has no stake in the settlement.");
    if (byBond[3] >= 60 && byBond[1] < 50) traps.push("Unanchored Repair: communal goodwill has no institution to settle into.");
    if (on.includes(6) || on.includes(9)) traps.push("Bond Theater: process is being recorded in place of changed outcomes.");
    if (byBond.every((b) => b >= 50)) traps.push("Systemic Bond Collapse: all four bonds are under simultaneous strain.");
    return { byBond, pct, b: band(pct), traps };
  }, [on]);

  const text = useMemo(() => {
    const L = ["EARLY-WARNING SENTINEL READING", "Compiled under Handbook Section 15 (failure modes)", "", `DATE: ${todayStamp()}`, `RELATIONAL RUPTURE INDEX: ${r.pct}% (${r.b.name.toUpperCase()})`, ""];
    L.push("BOND STRAIN");
    DOMAINS.forEach((d, i) => L.push(`  ${d}: ${r.byBond[i]}%`));
    L.push("", "SIGNS OBSERVED");
    if (!on.length) L.push("  None recorded.");
    on.forEach((i) => L.push(`  - ${SIGNS[i].text}`));
    L.push("", "LATENT TRAPS");
    if (!r.traps.length) L.push("  No trap pattern indicated.");
    r.traps.forEach((t) => L.push(`  - ${t}`));
    L.push("", `RECOMMENDED POSTURE: ${r.b.advice}`, "", "Rule-based reading, not a prediction. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [r, on]);

  return (
    <section className={panel}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          {DOMAINS.map((d, b) => (
            <div key={d}>
              <div className="flex justify-between items-baseline">
                <span className={label}>{d}</span>
                <span className="text-xs text-muted-foreground">{r.byBond[b]}%</span>
              </div>
              <div className="h-1 bg-border mb-3"><div className="h-1 bg-accent transition-all" style={{ width: `${r.byBond[b]}%` }} /></div>
              <div className="space-y-1.5">
                {SIGNS.map((s, i) => s.bond === b && (
                  <label key={i} className="flex gap-3 items-start text-sm cursor-pointer">
                    <input type="checkbox" className="mt-1" checked={on.includes(i)} onChange={() => toggle(i)} />
                    <span className="text-foreground/85">{s.text}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className={label}>Relational rupture index</p>
            <p className="font-serif text-4xl text-primary">{r.pct}% <span className="text-lg text-accent">{r.b.name}</span></p>
          </div>
          <DeskOutput text={text} fileName="Vinculum-Sentinel-Reading" />
        </div>
      </div>
    </section>
  );
}
