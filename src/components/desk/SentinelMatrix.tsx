import { useMemo, useState } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";
import { useMission } from "./mission";
import { usePublish, useEngine, TREND_MULT } from "./engine";
import SyncPanel from "./SyncPanel";

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
  { id: "deteriorating", label: "Deteriorating (signs added this quarter)", mult: TREND_MULT.deteriorating, note: "Rupture velocity is rising; compress the review interval." },
  { id: "static", label: "Static (no material change)", mult: TREND_MULT.static, note: "Rupture velocity is flat; hold the current review interval." },
  { id: "improving", label: "Improving (signs cleared this quarter)", mult: TREND_MULT.improving, note: "Rupture velocity is falling; verify the clearance independently before relaxing." },
] as const;

function band(pct: number) {
  if (pct >= 60) return { name: "Critical", advice: "Convene principals and verifier within 14 days; activate continuity provisions." };
  if (pct >= 35) return { name: "Elevated", advice: "Open a protected channel on the weakest bond and schedule independent verification." };
  if (pct >= 15) return { name: "Guarded", advice: "Monitor monthly; document handovers and confirm community standing." };
  return { name: "Stable", advice: "Maintain quarterly review; no immediate intervention indicated." };
}

type Custom = { id: string; bond: number; text: string; w: number };

const quickCls = "min-h-9 px-2.5 border border-border text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:border-accent hover:text-accent transition-colors";

function bandTone(name: string) {
  if (name === "Critical") return { text: "text-destructive", bg: "bg-destructive" };
  if (name === "Elevated") return { text: "text-brass", bg: "bg-brass" };
  if (name === "Guarded") return { text: "text-accent", bg: "bg-accent" };
  return { text: "text-primary", bg: "bg-primary" };
}

export default function SentinelMatrix() {
  // The theatre is inherited from the active mission; typing here overrides it for this desk only.
  const mission = useMission();
  // Linked: signs that sit on the weakest bond from Desk 1 are flagged. Override: work standalone.
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const weakestIdx = linked && signals.weakestBond ? DOMAINS.findIndex((d) => d === signals.weakestBond) : -1;
  const [theaterOverride, setTheater] = useState("");
  const theater = theaterOverride.trim() || mission.theatre.trim();
  const [trend, setTrend] = useState(1);
  const [on, setOn] = useState<number[]>([]);
  const toggle = (i: number) => setOn((p) => (p.includes(i) ? p.filter((x) => x !== i) : [...p, i]));
  // -1 all, -2 weakest live bond only, 0-3 a single bond.
  const [filter, setFilter] = useState(-1);

  // Custom field mode: indicators the practitioner defines for their own theater.
  const [custom, setCustom] = useState<Custom[]>([]);
  const [cOn, setCOn] = useState<string[]>([]);
  const [cText, setCText] = useState("");
  const [cBond, setCBond] = useState(0);
  const [cW, setCW] = useState(2);
  const addCustom = () => {
    const t = cText.trim();
    if (!t) return;
    const id = `c${Date.now()}`;
    setCustom((p) => [...p, { id, bond: cBond, text: t, w: cW }]);
    setCOn((p) => [...p, id]);
    setCText("");
  };
  const dropCustom = (id: string) => {
    setCustom((p) => p.filter((x) => x.id !== id));
    setCOn((p) => p.filter((x) => x !== id));
  };
  const toggleCustom = (id: string) => setCOn((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const r = useMemo(() => {
    const totalMax = MAX + custom.reduce((s, c) => s + c.w, 0);
    const byBond = DOMAINS.map((_, b) => {
      const max =
        SIGNS.reduce((s, x) => s + (x.bond === b ? x.w : 0), 0) +
        custom.reduce((s, c) => s + (c.bond === b ? c.w : 0), 0);
      const hit =
        SIGNS.reduce((s, x, i) => s + (x.bond === b && on.includes(i) ? x.w : 0), 0) +
        custom.reduce((s, c) => s + (c.bond === b && cOn.includes(c.id) ? c.w : 0), 0);
      return max ? Math.round((hit / max) * 100) : 0;
    });
    const score =
      SIGNS.reduce((s, x, i) => s + (on.includes(i) ? x.w : 0), 0) +
      custom.reduce((s, c) => s + (cOn.includes(c.id) ? c.w : 0), 0);
    const raw = (score / totalMax) * 100;
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
  }, [on, trend, custom, cOn]);

  usePublish("sentinel", {
    rupture: r.pct,
    ruptureBand: r.b.name,
    bondStrain: r.byBond,
    traps: r.traps.map((t) => t.name),
    trend: TREND[trend].label.split(" (")[0],
    trendMultiplier: TREND[trend].mult,
  });

  const text = useMemo(() => {
    const L = [
      "EARLY-WARNING SENTINEL READING",
      "Compiled under Handbook Section 15 (failure modes)",
      "",
      `THEATER: ${theater.trim() || "Unnamed theater"}`,
      `DATE: ${todayStamp()}`,
      `OBSERVATION TREND: ${TREND[trend].label} (multiplier ×${TREND[trend].mult.toFixed(2)})`,
      `RELATIONAL RUPTURE INDEX: ${r.pct}% (${r.b.name.toUpperCase()})`,
      `SIGNS RECORDED: ${on.length + cOn.length} of ${SIGNS.length + custom.length}`,
      `CUSTOM INDICATORS DEFINED: ${custom.length}`,
      "",
    ];
    L.push("BOND STRAIN");
    DOMAINS.forEach((d, i) => L.push(`  ${d}: ${r.byBond[i]}%`));
    L.push("", "SIGNS OBSERVED");
    if (!on.length && !cOn.length) L.push("  None recorded.");
    [...on].sort((a, b) => a - b).forEach((i) => L.push(`  - [${DOMAINS[SIGNS[i].bond]}] ${SIGNS[i].text}`));
    custom.filter((c) => cOn.includes(c.id)).forEach((c) => L.push(`  - [${DOMAINS[c.bond]}] ${c.text} (own indicator, weight ${c.w})`));

    L.push("", "LATENT TRAPS");
    if (!r.traps.length) L.push("  No trap pattern indicated.");
    r.traps.forEach((t) => {
      L.push(`  ${t.name}`);
      L.push(`    Reading: ${t.reading}`);
      L.push(`    Counter-measure: ${t.counter}`);
    });
    if (r.compound) L.push("", r.compound);
    L.push("", `RUPTURE VELOCITY: ${TREND[trend].note}`, `RECOMMENDED POSTURE: ${r.b.advice}`, "", "Rule-based reading, not a prediction. Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    return L.join("\n");
  }, [r, on, trend, theater, custom, cOn]);

  const alignedCount = weakestIdx >= 0 ? SIGNS.filter((x) => x.bond === weakestIdx).length : 0;
  const alignedOn = weakestIdx >= 0 ? SIGNS.reduce((n, x, i) => n + (x.bond === weakestIdx && on.includes(i) ? 1 : 0), 0) : 0;

  // Proximity of each latent trap to its trigger, using the same thresholds as the trap rules above.
  const [ip, cm, ig, inst] = r.byBond;
  const counterOf = (n: string) => r.traps.find((t) => t.name === n)?.counter;
  const proximity = [
    { name: "The Elite-Pact Mirage", status: `Communal ${cm}% / Intergenerational ${ig}% (need ≥50 each), Interpersonal ${ip}% (need <50)` },
    { name: "The Generational Cliff", status: `Intergenerational ${ig}% of the 60% trigger` },
    { name: "Unanchored Repair", status: `Institutional ${inst}% (need ≥60), Communal ${cm}% (need <50)` },
    { name: "Bond Theater", status: "Engaged by unresolved grievances or youth input that alters nothing" },
    { name: "Systemic Bond Collapse", status: `${r.byBond.filter((x) => x >= 50).length} of 4 bonds at ≥50% strain` },
  ].map((t) => ({ ...t, active: !!counterOf(t.name), counter: counterOf(t.name) }));

  return (
    <section className={panel}>
      <div className="mb-6">
        <SyncPanel
          linked={linked}
          onToggle={setLinked}
          summary={(x) =>
            x.weakestBond
              ? [
                  `The weakest bond on the diagnostic bench is ${x.weakestBond}${x.weakestScore !== undefined ? ` at ${x.weakestScore.toFixed(1)} of 5` : ""}. Its ${alignedCount} tripwires are flagged below as aligned with the live reading.`,
                  `${alignedOn} of ${alignedCount} aligned tripwires are recorded so far; check these first.`,
                ]
              : []
          }
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={label} htmlFor="sm-t">Theater or file name</label>
              <input id="sm-t" className={`${field} text-base sm:text-sm min-h-11`} value={theaterOverride} onChange={(e) => setTheater(e.target.value)} placeholder={mission.theatre.trim() || "e.g. Northern Rift corridor"} />
              {!theaterOverride.trim() && mission.theatre.trim() && <p className="mt-1.5 text-[11px] text-muted-foreground">Inherited from the active mission. Type to override on this desk.</p>}
            </div>
            <div className="min-w-0">
              <label className={label} htmlFor="sm-v">Observation trend</label>
              <select id="sm-v" className={`${field} text-base sm:text-sm min-h-11`} value={trend} onChange={(e) => setTrend(Number(e.target.value))}>
                {TREND.map((t, i) => <option key={t.id} value={i}>{t.label} ×{t.mult.toFixed(2)}</option>)}
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter tripwires">
              {[
                { id: -1, l: `All (${SIGNS.length + custom.length})` },
                ...(weakestIdx >= 0 ? [{ id: -2, l: "Weakest bond only" }] : []),
                ...DOMAINS.map((d, i) => ({ id: i, l: d })),
              ].map((f) => (
                <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={`min-h-9 px-2.5 border text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${filter === f.id ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent hover:text-accent"}`}>
                  {f.l}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Quick actions">
              {weakestIdx >= 0 && (
                <button type="button" onClick={() => setOn((p) => Array.from(new Set([...p, ...SIGNS.flatMap((s, i) => (s.bond === weakestIdx ? [i] : []))])))} className={quickCls}>Mark weakest-bond tripwires</button>
              )}
              <button type="button" onClick={() => setOn((p) => Array.from(new Set([...p, ...SIGNS.flatMap((s, i) => (s.w === 3 ? [i] : []))])))} className={quickCls}>Mark all Critical (W3) tripwires</button>
              <button type="button" onClick={() => { setOn([]); setCOn([]); }} className={quickCls}>Clear all</button>
            </div>
          </div>
          {DOMAINS.map((d, b) => (filter === -1 || filter === b || (filter === -2 && b === weakestIdx)) && (
            <div key={d} className={b === weakestIdx ? "border-l-2 border-destructive pl-3" : ""}>
              <button type="button" onClick={() => setFilter(filter === b ? -1 : b)} className="w-full text-left" aria-label={`Show only ${d} tripwires`}>
                <div className="flex justify-between items-baseline gap-3">
                  <span className={label}>
                    {d}
                    {b === weakestIdx && (
                      <span className="ml-2 inline-block border border-destructive/60 px-1.5 py-0.5 align-middle text-[9px] normal-case tracking-[0.1em] font-semibold text-destructive">
                        Weakest live bond{signals.weakestScore !== undefined ? ` · ${signals.weakestScore.toFixed(1)}` : ""}
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-muted-foreground">{r.byBond[b]}%</span>
                </div>
                <div className="relative h-1.5 bg-border mb-3">
                  <div className={`h-1.5 transition-all ${r.byBond[b] >= 60 ? "bg-destructive" : r.byBond[b] >= 50 ? "bg-brass" : "bg-accent"}`} style={{ width: `${r.byBond[b]}%` }} />
                  <span className="absolute -top-0.5 h-2.5 w-px bg-primary/60" style={{ left: "50%" }} />
                  <span className="absolute -top-0.5 h-2.5 w-px bg-primary/60" style={{ left: "60%" }} />
                </div>
              </button>
              <div className="space-y-1.5">
                {SIGNS.map((s, i) => s.bond === b && (
                  <label key={i} className="flex gap-3 items-start text-sm cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={on.includes(i)} onChange={() => toggle(i)} />
                    <span className="text-foreground/85">
                      <span className={`mr-2 inline-block border px-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] align-middle ${s.w === 3 ? "border-destructive/60 text-destructive" : s.w === 2 ? "border-brass/60 text-brass" : "border-border text-muted-foreground"}`}>
                        W{s.w} · {s.w === 3 ? "Acute" : s.w === 2 ? "Material" : "Signal"}
                      </span>
                      {s.text}
                      {s.bond === weakestIdx && (
                        <span className="ml-2 text-[9px] uppercase tracking-[0.14em] font-semibold text-destructive whitespace-nowrap">· Aligned with weakest bond</span>
                      )}
                    </span>
                  </label>
                ))}
                {custom.filter((c) => c.bond === b).map((c) => (
                  <div key={c.id} className="flex gap-3 items-start text-sm">
                    <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={cOn.includes(c.id)} onChange={() => toggleCustom(c.id)} />
                    <span className="text-foreground/85 flex-1">
                      {c.text}
                      <span className="text-[10px] uppercase tracking-[0.18em] text-accent ml-2">own · w{c.w}</span>
                    </span>
                    <button type="button" onClick={() => dropCustom(c.id)} className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent">Remove</button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="border border-brass/40 bg-background p-4">
            <span className={label}>Add your own warning indicator</span>
            <p className="text-xs text-muted-foreground mb-3">
              For a theater the standard tripwires do not cover. Your indicator is weighted alongside them
              in the same arithmetic, and it stays in this browser.
            </p>
            <input
              className={`${field} text-base sm:text-sm min-h-11 mb-2`}
              value={cText}
              onChange={(e) => setCText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustom(); } }}
              placeholder="e.g. The county peace committee has not met for two quarters."
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <select className={`${field} text-base sm:text-sm min-h-11`} value={cBond} onChange={(e) => setCBond(Number(e.target.value))} aria-label="Bond for the custom indicator">
                {DOMAINS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
              <select className={`${field} text-base sm:text-sm min-h-11`} value={cW} onChange={(e) => setCW(Number(e.target.value))} aria-label="Severity weight">
                <option value={1}>Weight 1, minor</option>
                <option value={2}>Weight 2, material</option>
                <option value={3}>Weight 3, severe</option>
              </select>
              <button type="button" onClick={addCustom} disabled={!cText.trim()} className="min-h-11 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">
                Add indicator
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className={label}>Relational rupture index</p>
            <p className="font-serif text-4xl text-primary">{r.pct}% <span className={`text-lg ${bandTone(r.b.name).text}`}>{r.b.name}</span></p>
            <div className="relative mt-3 h-3 bg-border" aria-hidden>
              <div className={`h-3 transition-all ${bandTone(r.b.name).bg}`} style={{ width: `${r.pct}%` }} />
              {[15, 35, 60].map((t) => <span key={t} className="absolute top-0 h-3 w-px bg-primary/50" style={{ left: `${t}%` }} />)}
            </div>
            {/* Labels sit under their own tick marks (15 / 35 / 60), not on an even grid. */}
            <div className="relative mt-1 h-3 text-[9px] uppercase tracking-[0.14em] text-muted-foreground" aria-hidden>
              <span className="absolute left-0">Stable</span>
              <span className="absolute hidden sm:inline" style={{ left: "15%" }}>Guarded 15</span>
              <span className="absolute sm:hidden" style={{ left: "15%" }}>15</span>
              <span className="absolute hidden sm:inline" style={{ left: "35%" }}>Elevated 35</span>
              <span className="absolute sm:hidden" style={{ left: "35%" }}>35</span>
              <span className="absolute" style={{ left: "60%" }}>Critical 60</span>
            </div>
            <p className="mt-3 text-[10px] uppercase tracking-[0.16em] text-accent">
              Velocity ×{TREND[trend].mult.toFixed(2)} · {TREND[trend].id === "deteriorating" ? "rising" : TREND[trend].id === "improving" ? "falling" : "stable"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">{on.length + cOn.length} of {SIGNS.length + custom.length} tripwires recorded. {TREND[trend].note}</p>
            <p className="text-xs text-foreground/85 mt-2">{r.b.advice}</p>
          </div>
          <div className="border border-brass/40 bg-background p-4 space-y-3">
            <p className={label}>Latent trap proximity</p>
            {proximity.map((t) => (
              <div key={t.name} className={`border-l-2 pl-3 ${t.active ? "border-destructive" : "border-border"}`}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-serif text-base text-primary leading-tight">{t.name}</p>
                  <span className={`text-[9px] uppercase tracking-[0.14em] font-semibold ${t.active ? "text-destructive" : "text-muted-foreground"}`}>{t.active ? "Engaged" : "Not engaged"}</span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{t.status}</p>
                {t.active && t.counter && <p className="text-xs text-foreground/85 mt-1">Counter: {t.counter}</p>}
              </div>
            ))}
            {r.compound && <p className="text-xs text-destructive">{r.compound}</p>}
          </div>
          <DeskOutput text={text} fileName="Vinculum-Sentinel-Reading" />
        </div>
      </div>
    </section>
  );
}
