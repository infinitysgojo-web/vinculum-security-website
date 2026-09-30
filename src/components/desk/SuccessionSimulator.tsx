import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

/**
 * §12C, the Treaty Stress and Succession Simulator.
 * Deterministic: each shock subtracts a fixed weight from the provisions
 * that do not insulate against it. Nothing is predicted, stored or sent.
 */

type Prov = { id: string; label: string; weight: number; guards: string[]; breaks: string };

const PROVISIONS: Prov[] = [
  { id: "office", label: "Obligations bind the office, not the officeholder", weight: 22, guards: ["principal", "election"], breaks: "Every undertaking given personally lapses with the signatory." },
  { id: "verify", label: "Independent verifier no party can appoint or remove", weight: 18, guards: ["capture", "guarantor"], breaks: "Compliance reporting reverts to self-certification." },
  { id: "budget", label: "Implementation budget protected by statute", weight: 16, guards: ["donor", "austerity"], breaks: "Implementation bodies fall dormant within one cycle." },
  { id: "youth", label: "Standing intergenerational review with binding referral", weight: 15, guards: ["youth", "demographic"], breaks: "The successor generation inherits a settlement it never shaped." },
  { id: "outcome", label: "Outcome test applied to every consultation", weight: 13, guards: ["capture", "theater"], breaks: "Consultation records replace altered decisions as the evidence of repair." },
  { id: "auto", label: "Automatic suspension of benefits on a finding of breach", weight: 10, guards: ["principal", "capture"], breaks: "Sanction requires the consent of the party being sanctioned." },
  { id: "survive", label: "Indefinite duration with a verified conclusion test", weight: 6, guards: ["donor", "attention"], breaks: "The instrument expires by silence rather than by settlement." },
];

const SHOCKS = [
  { id: "principal", label: "Chief signatory dies or is removed within 12 months", sev: 26 },
  { id: "election", label: "Governing party loses the next general election", sev: 20 },
  { id: "donor", label: "Donor funding falls by 40 per cent", sev: 18 },
  { id: "youth", label: "Successor generation mobilises against the settlement at month 36", sev: 22 },
  { id: "capture", label: "A party captures the oversight or judicial appointment process", sev: 24 },
  { id: "guarantor", label: "The regional guarantor withdraws attention and staff", sev: 16 },
  { id: "theater", label: "Compliance reporting becomes wholly procedural", sev: 14 },
  { id: "attention", label: "International attention lapses for three years", sev: 12 },
  { id: "demographic", label: "Rapid demographic shift alters the communal balance", sev: 18 },
  { id: "austerity", label: "National austerity reallocates the implementation budget", sev: 16 },
] as const;

function bandOf(q: number) {
  if (q >= 75) return { name: "Durable", advice: "The instrument survives the modelled shocks. Schedule verification rather than renegotiation." };
  if (q >= 55) return { name: "Resilient with gaps", advice: "Close the named failing provision before the next reporting period." };
  if (q >= 35) return { name: "Fragile", advice: "Renegotiate the failing provisions now; the settlement will not survive a second shock." };
  return { name: "Non-survivable", advice: "The instrument is a declaration, not a settlement. Reopen the mandate, not the schedule." };
}

export default function SuccessionSimulator() {
  const [title, setTitle] = useState("");
  const [inForce, setInForce] = useState<string[]>(["office", "verify", "outcome"]);
  const [shocks, setShocks] = useState<string[]>(["principal"]);

  const tp = (id: string) => setInForce((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const ts = (id: string) => setShocks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const r = useMemo(() => {
    const base = PROVISIONS.reduce((s, p) => s + (inForce.includes(p.id) ? p.weight : 0), 0);
    const exposure = SHOCKS.reduce((s, sh) => {
      if (!shocks.includes(sh.id)) return s;
      const insulated = PROVISIONS.some((p) => inForce.includes(p.id) && p.guards.includes(sh.id));
      return s + (insulated ? sh.sev * 0.25 : sh.sev);
    }, 0);
    const q = Math.max(0, Math.min(100, Math.round(base - exposure + (shocks.length ? 0 : 0))));
    // First clause to break: the highest-weight provision NOT in force that guards an applied shock.
    const gaps = PROVISIONS.filter((p) => !inForce.includes(p.id) && p.guards.some((g) => shocks.includes(g)))
      .sort((a, b) => b.weight - a.weight);
    const first = gaps[0] ?? null;
    const unguarded = SHOCKS.filter(
      (sh) => shocks.includes(sh.id) && !PROVISIONS.some((p) => inForce.includes(p.id) && p.guards.includes(sh.id))
    );
    return { q, b: bandOf(q), first, gaps, unguarded, base };
  }, [inForce, shocks]);

  const text = useMemo(() => {
    const L = [
      "TREATY STRESS AND SUCCESSION SIMULATION",
      "Compiled under Vinculum Diplomacy: The Practitioner Handbook, Section 12C",
      "",
      `INSTRUMENT: ${title.trim() || "Unnamed instrument"}`,
      `DATE: ${todayStamp()}`,
      `AGREEMENT SURVIVAL QUOTIENT: ${r.q} of 100 (${r.b.name.toUpperCase()})`,
      `PROVISION BASE: ${r.base} of 100. SHOCKS MODELLED: ${shocks.length}.`,
      "",
      "PROVISIONS IN FORCE",
    ];
    const held = PROVISIONS.filter((p) => inForce.includes(p.id));
    if (!held.length) L.push("  None recorded.");
    held.forEach((p) => L.push(`  [x] ${p.label} (weight ${p.weight})`));
    L.push("", "PROVISIONS ABSENT");
    const miss = PROVISIONS.filter((p) => !inForce.includes(p.id));
    if (!miss.length) L.push("  None. Every modelled provision is in force.");
    miss.forEach((p) => L.push(`  [ ] ${p.label} (weight ${p.weight})`));
    L.push("", "SHOCKS APPLIED");
    if (!shocks.length) L.push("  None applied.");
    SHOCKS.filter((s) => shocks.includes(s.id)).forEach((s) => {
      const ins = PROVISIONS.some((p) => inForce.includes(p.id) && p.guards.includes(s.id));
      L.push(`  - ${s.label} (severity ${s.sev}) ${ins ? "INSULATED" : "UNINSULATED"}`);
    });
    L.push("", "FIRST CLAUSE TO BREAK");
    L.push(r.first ? `  ${r.first.label}\n    Consequence: ${r.first.breaks}` : "  No modelled provision fails under these shocks.");
    if (r.unguarded.length) {
      L.push("", "UNINSULATED EXPOSURES");
      r.unguarded.forEach((s) => L.push(`  - ${s.label}`));
    }
    L.push("", `READING: ${r.b.advice}`);
    L.push("", "Rule-based simulation of the drafted text, not a forecast of events. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [title, inForce, shocks, r]);

  return (
    <section className={panel}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className={label} htmlFor="ss-t">Instrument under test</label>
            <input id="ss-t" className={`${field} text-base sm:text-sm min-h-11`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Draft Accord on Northern Rift Disengagement" />
          </div>
          <div>
            <span className={label}>Provisions actually in the draft</span>
            <div className="space-y-2">
              {PROVISIONS.map((p) => (
                <label key={p.id} className="flex gap-3 items-start text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={inForce.includes(p.id)} onChange={() => tp(p.id)} />
                  <span className="text-foreground/85">{p.label}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <span className={label}>Shocks to apply</span>
            <div className="space-y-2">
              {SHOCKS.map((s) => (
                <label key={s.id} className="flex gap-3 items-start text-sm cursor-pointer">
                  <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={shocks.includes(s.id)} onChange={() => ts(s.id)} />
                  <span className="text-foreground/85">{s.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          <div className="border border-border bg-background p-4">
            <p className={label}>Agreement survival quotient</p>
            <p className="font-serif text-4xl text-primary">{r.q}<span className="text-lg text-muted-foreground">/100</span> <span className="text-lg text-accent">{r.b.name}</span></p>
            <div className="h-1 bg-border mt-3"><div className="h-1 bg-accent transition-all" style={{ width: `${r.q}%` }} /></div>
          </div>
          {r.first && (
            <div className="border border-brass/40 bg-background p-4">
              <p className={label}>First clause to break</p>
              <p className="font-serif text-lg text-primary leading-tight">{r.first.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{r.first.breaks}</p>
            </div>
          )}
          <DeskOutput text={text} fileName="Vinculum-Succession-Simulation" />
        </div>
      </div>
    </section>
  );
}
