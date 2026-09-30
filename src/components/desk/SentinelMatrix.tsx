import { useMemo, useState } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

/** Handbook §15 early-warning matrix. Weighted, rule-based; nothing stored or transmitted. */
const SIGNS: { bond: number; text: string; w: number }[] = [
  // Interpersonal
  { bond: 0, text: "A key principal has left office without a documented handover.", w: 3 },
  { bond: 0, text: "Back-channel contact between leaders has lapsed for over 90 days.", w: 2 },
  { bond: 0, text: "Assurances are being given by named individuals, not offices.", w: 2 },
  { bond: 0, text: "A principal now negotiates only through intermediaries they control.", w: 2 },
  { bond: 0, text: "Personal security of a principal has become a bargaining item.", w: 3 },
  { bond: 0, text: "Meeting records are kept by one party alone and not exchanged.", w: 1 },
  // Communal
  { bond: 1, text: "Community grievances are lodged but none has been resolved.", w: 3 },
  { bond: 1, text: "Representatives are no longer recognised by their own communities.", w: 3 },
  { bond: 1, text: "Inflammatory rhetoric is rising in local media or gatherings.", w: 2 },
  { bond: 1, text: "Movement between communal areas has become restricted or policed.", w: 2 },
  { bond: 1, text: "Coordinated disinformation is circulating about the other community.", w: 2 },
  { bond: 1, text: "Shared markets, schools or services have segregated by community.", w: 3 },
  // Intergenerational
  { bond: 2, text: "Youth input has not altered a single documented decision.", w: 3 },
  { bond: 2, text: "Youth participation funding ends with the current budget cycle.", w: 2 },
  { bond: 2, text: "Successor-generation unemployment or displacement is rising.", w: 2 },
  { bond: 2, text: "Successor leaders are recruited by armed or criminal networks.", w: 3 },
  { bond: 2, text: "School curricula still teach the conflict in single-community terms.", w: 2 },
  { bond: 2, text: "The diaspora generation funds positions harder than those at home.", w: 2 },
  // Institutional
  { bond: 3, text: "The verifying body is not independent of the party it verifies.", w: 3 },
  { bond: 3, text: "Implementing bodies lack statutory footing or protected budgets.", w: 2 },
  { bond: 3, text: "Senior personnel turnover exceeds one rotation per year.", w: 2 },
  { bond: 3, text: "Judicial or oversight appointments have been purged or packed.", w: 3 },
  { bond: 3, text: "Implementation depends on a donor line that expires within a year.", w: 2 },
  { bond: 3, text: "A guarantor state has withdrawn attention, staff or funding.", w: 2 },
];

const MAX = SIGNS.reduce((s, x) => s + x.w, 0);

const TREND = [
  { id: "accel", label: "Accelerating (signs added this quarter)", mult: 1.15, note: "Rupture velocity is rising; compress the review interval." },
  { id: "stable", label: "Stable (no material change)", mult: 1, note: "Rupture velocity is flat; hold the current review interval." },
  { id: "decel", label: "Decelerating (signs cleared this quarter)", mult: 0.9, note: "Rupture velocity is falling; verify the clearance independently before relaxing." },
] as const;

function band(pct: number) {
  if (pct >= 60) return { name: "Critical", advice: "Convene principals and verifier within 14 days; activate continuity provisions." };
  if (pct >= 35) return { name: "Elevated", advice: "Open a protected channel on the weakest bond and schedule independent verification." };
  if (pct >= 15) return { name: "Guarded", advice: "Monitor monthly; document handovers and confirm community standing." };
  return { name: "Stable", advice: "Maintain quarterly review; no immediate intervention indicated." };
}

export default function SentinelMatrix() {
  const [theater, setTheater] = useState("");
  const [trend, setTrend] = useState(1);
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
    const raw = (score / MAX) * 100;
    const pct = Math.min(100, Math.round(raw * TREND[trend].mult));
    const traps: { name: string; reading: string; counter: string }[] = [];
    if (byBond[1] >= 50 && byBond[2] >= 50 && byBond[0] < 50)
      traps.push({
        name: "The Elite-Pact Mirage",
        reading: "Principals are aligned while communities and the successor generation disengage.",
        counter: "Suspend further principal-level announcements until a communal verification round reports.",
      });
    if (byBond[2] >= 60)
      traps.push({
        name: "The Generational Cliff",
        reading: "The successor generation holds no stake in the settlement.",
        counter: "Constitute a standing intergenerational review with a decision it can actually alter.",
      });
    if (byBond[3] >= 60 && byBond[1] < 50)
      traps.push({
        name: "Unanchored Repair",
        reading: "Communal goodwill has no institution to settle into.",
        counter: "Give the implementing body statutory footing and a budget protected from reallocation.",
      });
    if (on.includes(12) || on.includes(18))
      traps.push({
        name: "Bond Theater",
        reading: "Process is being recorded in place of changed outcomes.",
        counter: "Apply the outcome test: name one decision each consultation altered, or record non-compliance.",
      });
    if (byBond.every((b) => b >= 50))
      traps.push({
        name: "Systemic Bond Collapse",
        reading: "All four bonds are under simultaneous strain.",
        counter: "Treat the settlement as lapsed in practice and reopen the mandate rather than the schedule.",
      });
    // Compound co-occurrence
    const compound =
      traps.length >= 2
        ? `Compound exposure: ${traps.map((t) => t.name).join(" together with ")}. Traps in combination fail faster than the sum of their parts; sequence the counter-measures rather than running them in parallel.`
        : "";
    return { byBond, pct, b: band(pct), traps, compound };
  }, [on, trend]);

  const text = useMemo(() => {
    const L = [
      "EARLY-WARNING SENTINEL READING",
      "Compiled under Handbook Section 15 (failure modes)",
      "",
      `THEATER: ${theater.trim() || "Unnamed theater"}`,
      `DATE: ${todayStamp()}`,
      `OBSERVATION TREND: ${TREND[trend].label}`,
      `RELATIONAL RUPTURE INDEX: ${r.pct}% (${r.b.name.toUpperCase()})`,
      `SIGNS RECORDED: ${on.length} of ${SIGNS.length}`,
      "",
    ];
    L.push("BOND STRAIN");
    DOMAINS.forEach((d, i) => L.push(`  ${d}: ${r.byBond[i]}%`));
    L.push("", "SIGNS OBSERVED");
    if (!on.length) L.push("  None recorded.");
    [...on].sort((a, b) => a - b).forEach((i) => L.push(`  - [${DOMAINS[SIGNS[i].bond]}] ${SIGNS[i].text}`));
    L.push("", "LATENT TRAPS");
    if (!r.traps.length) L.push("  No trap pattern indicated.");
    r.traps.forEach((t) => {
      L.push(`  ${t.name}`);
      L.push(`    Reading: ${t.reading}`);
      L.push(`    Counter-measure: ${t.counter}`);
    });
    if (r.compound) L.push("", r.compound);
    L.push("", `RUPTURE VELOCITY: ${TREND[trend].note}`, `RECOMMENDED POSTURE: ${r.b.advice}`, "", "Rule-based reading, not a prediction. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [r, on, trend, theater]);

  return (
    <section className={panel}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={label} htmlFor="sm-t">Theater or file name</label>
              <input id="sm-t" className={`${field} text-base sm:text-sm min-h-11`} value={theater} onChange={(e) => setTheater(e.target.value)} placeholder="e.g. Northern Rift corridor" />
            </div>
            <div className="min-w-0">
              <label className={label} htmlFor="sm-v">Observation trend</label>
              <select id="sm-v" className={`${field} text-base sm:text-sm min-h-11`} value={trend} onChange={(e) => setTrend(Number(e.target.value))}>
                {TREND.map((t, i) => <option key={t.id} value={i}>{t.label}</option>)}
              </select>
            </div>
          </div>
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
                    <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={on.includes(i)} onChange={() => toggle(i)} />
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
            <p className="text-xs text-muted-foreground mt-2">{on.length} of {SIGNS.length} tripwires recorded. {TREND[trend].note}</p>
          </div>
          {r.traps.length > 0 && (
            <div className="border border-brass/40 bg-background p-4 space-y-3">
              <p className={label}>Latent traps indicated</p>
              {r.traps.map((t) => (
                <div key={t.name}>
                  <p className="font-serif text-lg text-primary leading-tight">{t.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{t.counter}</p>
                </div>
              ))}
            </div>
          )}
          <DeskOutput text={text} fileName="Vinculum-Sentinel-Reading" />
        </div>
      </div>
    </section>
  );
}
