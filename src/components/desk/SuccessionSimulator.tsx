import { useMemo, useState } from "react";
import { useTheatreSeed } from "./theatres";
import DeskOutput, { field, label, panel } from "./DeskOutput";
import { usePublish, useEngine, successionDurability, SUCCESSION_TRAP } from "./engine";
import SyncPanel from "./SyncPanel";
import { AlertTriangle, ShieldCheck } from "lucide-react";

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

const BONDS = [
  { name: "Interpersonal", shocks: ["principal", "election"] },
  { name: "Communal", shocks: ["capture", "demographic", "theater"] },
  { name: "Intergenerational", shocks: ["youth", "demographic", "attention"] },
  { name: "Institutional", shocks: ["donor", "austerity", "guarantor", "capture", "theater"] },
];

function bandOf(q: number) {
  if (q >= 75) return { name: "Durable", advice: "The instrument survives the modelled shocks. Schedule verification rather than renegotiation." };
  if (q >= 55) return { name: "Resilient with gaps", advice: "Close the named failing provision before the next reporting period." };
  if (q >= 35) return { name: "Fragile", advice: "Renegotiate the failing provisions now; the settlement will not survive a second shock." };
  return { name: "Non-survivable", advice: "The instrument is a declaration, not a settlement. Reopen the mandate, not the schedule." };
}

type Shock = { id: string; label: string; sev: number };

/** Semi-circular durability dial for the treaty stress survival score S%. */
function DurabilityDial({ score }: { score: number }) {
  const cx = 130;
  const cy = 122;
  const R = 100;
  const clamp = Math.max(0, Math.min(100, score));
  const pt = (p: number, r = R) => {
    const a = (Math.PI * p) / 100;
    return [cx - r * Math.cos(a), cy - r * Math.sin(a)] as const;
  };
  const arc = (p0: number, p1: number) => {
    const [x0, y0] = pt(p0);
    const [x1, y1] = pt(p1);
    return `M ${x0} ${y0} A ${R} ${R} 0 0 1 ${x1} ${y1}`;
  };
  const zones = [
    { from: 0, to: 35, stroke: "hsl(var(--destructive))", name: "Non-survivable" },
    { from: 35, to: 55, stroke: "hsl(var(--ochre))", name: "Fragile" },
    { from: 55, to: 75, stroke: "hsl(var(--brass))", name: "Resilient" },
    { from: 75, to: 100, stroke: "hsl(var(--emerald))", name: "Durable" },
  ];
  const [nx0, ny0] = pt(SUCCESSION_TRAP, R - 14);
  const [nx1, ny1] = pt(SUCCESSION_TRAP, R + 10);
  const [tx, ty] = pt(SUCCESSION_TRAP, R + 20);
  const band = bandOf(clamp);
  return (
    <div className="border border-brass/40 bg-background p-4">
      <p className={label}>Treaty stress survival · S%</p>
      <svg viewBox="0 -14 260 154" className="mx-auto w-full max-w-[320px] h-auto" role="img" aria-label={`Survival score ${clamp.toFixed(1)} per cent, ${band.name}`}>
        {zones.map((z) => (
          <path key={z.name} d={arc(z.from, z.to)} fill="none" stroke={z.stroke} strokeWidth="14" strokeOpacity="0.85" />
        ))}
        <line x1={nx0} y1={ny0} x2={nx1} y2={ny1} stroke="hsl(var(--foreground))" strokeWidth="2.2" />
        <text x={tx} y={ty} textAnchor="middle" className="fill-foreground" style={{ fontSize: 8, fontWeight: 700 }}>
          {SUCCESSION_TRAP.toFixed(1)}
        </text>
        <g style={{ transform: `rotate(${-90 + (180 * clamp) / 100}deg)`, transformOrigin: `${cx}px ${cy}px`, transition: "transform 700ms cubic-bezier(.2,.8,.2,1)" }}>
          <polygon points={`${cx - 3.5},${cy} ${cx + 3.5},${cy} ${cx},${cy - (R - 6)}`} fill="hsl(var(--primary))" />
        </g>
        <circle cx={cx} cy={cy} r="6" fill="hsl(var(--primary))" stroke="hsl(var(--brass))" strokeWidth="2" />
        <text x={cx - R} y={cy + 14} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>0</text>
        <text x={cx + R} y={cy + 14} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>100</text>
      </svg>
      <p className="mt-1 text-center font-serif text-3xl font-bold text-primary tabular-nums">
        {clamp.toFixed(1)}<span className="text-base text-muted-foreground">%</span>
      </p>
      <p className="text-center text-[10px] uppercase tracking-[0.18em] font-semibold text-accent">{band.name}</p>
      <p className="mt-2 text-center text-xs text-foreground/85">{band.advice}</p>
      <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[9px] uppercase tracking-[0.12em] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-destructive" aria-hidden /> 0–34</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-ochre" aria-hidden /> 35–54</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-brass" aria-hidden /> 55–74</span>
        <span className="inline-flex items-center gap-1"><span className="h-2 w-2 bg-emerald" aria-hidden /> 75–100</span>
      </div>
    </div>
  );
}

export default function SuccessionSimulator() {
  const [title, setTitle] = useState("");
  // Linked: the canonical durability formula reads the live mission bus. Override: the drafted-text quotient alone.
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const [inForce, setInForce] = useState<string[]>(["office", "verify", "outcome"]);
  const [shocks, setShocks] = useState<string[]>(["principal"]);
  useTheatreSeed("succession", (s) => {
    setInForce(s.inForce);
    setShocks(s.shocks);
  });

  // Custom mode: provisions and shocks the practitioner defines for their own instrument.
  const [ownProv, setOwnProv] = useState<Prov[]>([]);
  const [ownShock, setOwnShock] = useState<Shock[]>([]);
  const [pLabel, setPLabel] = useState("");
  const [pWeight, setPWeight] = useState(12);
  const [pGuards, setPGuards] = useState<string[]>([]);
  const [sLabel, setSLabel] = useState("");
  const [sSev, setSSev] = useState(18);
  const [sBond, setSBond] = useState(3);

  const allProvisions = useMemo(() => [...PROVISIONS, ...ownProv], [ownProv]);
  const allShocks = useMemo<Shock[]>(() => [...SHOCKS, ...ownShock], [ownShock]);
  const bondMap = useMemo(
    () =>
      BONDS.map((b, i) => ({
        name: b.name,
        shocks: [...b.shocks, ...ownShock.filter((s) => s.id.endsWith(`-b${i}`)).map((s) => s.id)],
      })),
    [ownShock]
  );

  const tp = (id: string) => setInForce((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const ts = (id: string) => setShocks((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const tg = (id: string) => setPGuards((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const addProv = () => {
    const l = pLabel.trim();
    if (!l) return;
    const id = `own-p${Date.now()}`;
    setOwnProv((p) => [...p, { id, label: l, weight: pWeight, guards: pGuards, breaks: "The protection this provision carried is absent from the instrument." }]);
    setInForce((p) => [...p, id]);
    setPLabel("");
    setPGuards([]);
  };
  const addShock = () => {
    const l = sLabel.trim();
    if (!l) return;
    const id = `own-s${Date.now()}-b${sBond}`;
    setOwnShock((p) => [...p, { id, label: l, sev: sSev }]);
    setShocks((p) => [...p, id]);
    setSLabel("");
  };
  const dropProv = (id: string) => {
    setOwnProv((p) => p.filter((x) => x.id !== id));
    setInForce((p) => p.filter((x) => x !== id));
  };
  const dropShock = (id: string) => {
    setOwnShock((p) => p.filter((x) => x.id !== id));
    setShocks((p) => p.filter((x) => x !== id));
    setPGuards((p) => p.filter((x) => x !== id));
  };

  const r = useMemo(() => {
    const totalWeight = allProvisions.reduce((s, p) => s + p.weight, 0) || 100;
    const rawBase = allProvisions.reduce((s, p) => s + (inForce.includes(p.id) ? p.weight : 0), 0);
    // Normalised so custom provisions keep the quotient on a 0 to 100 scale.
    const base = Math.round((rawBase / totalWeight) * 100);
    const insulatedBy = (sh: Shock) => allProvisions.some((p) => inForce.includes(p.id) && p.guards.includes(sh.id));
    const exposure = allShocks.reduce((s, sh) => {
      if (!shocks.includes(sh.id)) return s;
      return s + (insulatedBy(sh) ? sh.sev * 0.25 : sh.sev);
    }, 0);
    const uninsulatedCount = allShocks.filter((sh) => shocks.includes(sh.id) && !insulatedBy(sh)).length;
    const compound = Math.max(0, uninsulatedCount - 1) * 6;
    const q = Math.max(0, Math.min(100, Math.round(base - exposure - compound)));
    const bonds = bondMap.map((b) => {
      const hit = allShocks.filter((sh) => shocks.includes(sh.id) && b.shocks.includes(sh.id));
      const strain = hit.reduce((t, sh) => t + (insulatedBy(sh) ? sh.sev * 0.25 : sh.sev), 0);
      return { name: b.name, strain: Math.min(100, Math.round(strain * 1.6)) };
    });
    const gaps = allProvisions
      .filter((p) => !inForce.includes(p.id) && p.guards.some((g) => shocks.includes(g)))
      .sort((a, b) => b.weight - a.weight);
    const first = gaps[0] ?? null;
    const unguarded = allShocks.filter((sh) => shocks.includes(sh.id) && !insulatedBy(sh));
    return { q, b: bandOf(q), first, gaps, unguarded, base, compound, bonds };
  }, [inForce, shocks, allProvisions, allShocks, bondMap]);

  // Section 4.5 canonical durability, from the live bonds, rupture index and covenants on the bus.
  const canon = useMemo(() => (linked ? successionDurability(signals) : undefined), [linked, signals]);
  // Publish the canonical S% when linked, otherwise the drafted-text quotient, so Desk 15 always has live data.
  usePublish("succession", { survivalScore: canon ? canon.percent : r.q });

  const text = useMemo(() => {
    const L = [
      "TREATY STRESS AND SUCCESSION SIMULATION",
      "Compiled under Vinculum Diplomacy: The Practitioner Handbook, Section 12C",
      "",
      `INSTRUMENT: ${title.trim() || "Unnamed instrument"}`,
      canon
        ? `SUCCESSION DURABILITY S%: ${canon.percent.toFixed(1)} of 100 (${bandOf(canon.percent).name.toUpperCase()}${canon.trap ? "; TERMINAL SUCCESSION TRAP ENGAGED" : ""})`
        : "SUCCESSION DURABILITY S%: not computed (override engaged or no bond vector on the bus)",
      `DRAFTED-TEXT PROVISION QUOTIENT: ${r.q} of 100 (${r.b.name.toUpperCase()})`,
      `PROVISION BASE: ${r.base} of 100. SHOCKS MODELLED: ${shocks.length}. COMPOUND AMPLIFICATION: -${r.compound}.`,
      `OWN PROVISIONS DEFINED: ${ownProv.length}. OWN SHOCKS DEFINED: ${ownShock.length}.`,
      "",
      "STRAIN BY BOND (0 to 100)",
      ...r.bonds.map((b) => `  ${b.name.padEnd(18)} ${b.strain}`),
      "",
      "PROVISIONS IN FORCE",
    ];
    const own = (id: string) => (id.startsWith("own-") ? " (own)" : "");
    const held = allProvisions.filter((p) => inForce.includes(p.id));
    if (!held.length) L.push("  None recorded.");
    held.forEach((p) => L.push(`  [x] ${p.label}${own(p.id)} (weight ${p.weight})`));
    L.push("", "PROVISIONS ABSENT");
    const miss = allProvisions.filter((p) => !inForce.includes(p.id));
    if (!miss.length) L.push("  None. Every modelled provision is in force.");
    miss.forEach((p) => L.push(`  [ ] ${p.label}${own(p.id)} (weight ${p.weight})`));
    L.push("", "SHOCKS APPLIED");
    if (!shocks.length) L.push("  None applied.");
    allShocks.filter((s) => shocks.includes(s.id)).forEach((s) => {
      const ins = allProvisions.some((p) => inForce.includes(p.id) && p.guards.includes(s.id));
      L.push(`  - ${s.label}${own(s.id)} (severity ${s.sev}) ${ins ? "INSULATED" : "UNINSULATED"}`);
    });
    L.push("", "FIRST CLAUSE TO BREAK");
    L.push(r.first ? `  ${r.first.label}\n    Consequence: ${r.first.breaks}` : "  No modelled provision fails under these shocks.");
    if (r.unguarded.length) {
      L.push("", "UNINSULATED EXPOSURES");
      r.unguarded.forEach((s) => L.push(`  - ${s.label}`));
    }
    if (canon) {
      L.push("", "CANONICAL DURABILITY DERIVATION (Section 4.5)");
      L.push("  S_raw = 0.35 mu_B + 0.25 B_IG + 0.25 B_IR + 0.15 I_cov - 0.20 R~     S% = S_raw / 5.0 x 100");
      L.push(`  mu_B = ${canon.mu.toFixed(3)}, B_IG = ${canon.ig.toFixed(1)}, B_IR = ${canon.ir.toFixed(1)}, covenants in force = ${canon.covenantCount} (I_cov = ${canon.covenantIndicator.toFixed(1)}), R = ${canon.rupturePct}% (R~ = ${canon.rupturePenaltyBase.toFixed(2)})`);
      canon.terms.forEach((t) => L.push(`  ${t.value >= 0 ? "+" : "-"} ${Math.abs(t.value).toFixed(4)}   ${t.label}`));
      L.push(`  S_raw = ${canon.raw.toFixed(4)}`);
      L.push(`  S% = ${canon.raw.toFixed(4)} / 5.0 x 100 = ${canon.percent.toFixed(1)}%`);
      L.push(canon.trap ? `  [TERMINAL SUCCESSION TRAP ENGAGED] S% is below the ${SUCCESSION_TRAP.toFixed(1)}% gate; Desk 15 clearance is locked.` : `  Gate passed: S% is at or above ${SUCCESSION_TRAP.toFixed(1)}%.`);
    }
    L.push("", `READING: ${r.b.advice}`);
    L.push("", "Rule-based simulation of the drafted text, not a forecast of events. Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    return L.join("\n");
  }, [title, inForce, shocks, r, allProvisions, allShocks, ownProv, ownShock, canon]);

  return (
    <section className={panel}>
      <div className="mb-6">
        <SyncPanel
          linked={linked}
          onToggle={setLinked}
          summary={(x) =>
            x.bonds
              ? [
                  `Durability is computed from the live bonds, ${x.rupture !== undefined ? `the ${x.rupture} per cent rupture index` : "no rupture reading yet (taken as 0)"} and ${x.covenants?.length ?? 0} covenant(s) drafted upstream.`,
                  `The score published to Desk 15 is the canonical S%, gated at ${SUCCESSION_TRAP.toFixed(1)}%.`,
                ]
              : []
          }
        />
        {linked && !signals.bonds && (
          <p className="mt-2 text-xs text-muted-foreground">
            No bond vector is on the bus yet. Score the four bonds in Desk 1 to compute the canonical durability; until then
            the drafted-text quotient below is what Desk 15 receives.
          </p>
        )}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5">
          <div>
            <label className={label} htmlFor="ss-t">Instrument under test</label>
            <input id="ss-t" className={`${field} text-base sm:text-sm min-h-11`} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Draft Accord on Northern Rift Disengagement" />
          </div>
          <div>
            <span className={label}>Provisions actually in the draft</span>
            <div className="space-y-2">
              {allProvisions.map((p) => (
                <div key={p.id} className="flex gap-3 items-start text-sm">
                  <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={inForce.includes(p.id)} onChange={() => tp(p.id)} id={`ss-p-${p.id}`} />
                  <label htmlFor={`ss-p-${p.id}`} className="text-foreground/85 flex-1 cursor-pointer">
                    {p.label}
                    {p.id.startsWith("own-") && <span className="text-[10px] uppercase tracking-[0.18em] text-accent ml-2">own · w{p.weight}</span>}
                  </label>
                  {p.id.startsWith("own-") && (
                    <button type="button" onClick={() => dropProv(p.id)} className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div>
            <span className={label}>Shocks to apply</span>
            <div className="space-y-2">
              {allShocks.map((s) => (
                <div key={s.id} className="flex gap-3 items-start text-sm">
                  <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={shocks.includes(s.id)} onChange={() => ts(s.id)} id={`ss-s-${s.id}`} />
                  <label htmlFor={`ss-s-${s.id}`} className="text-foreground/85 flex-1 cursor-pointer">
                    {s.label}
                    {s.id.startsWith("own-") && <span className="text-[10px] uppercase tracking-[0.18em] text-accent ml-2">own · severity {s.sev}</span>}
                  </label>
                  {s.id.startsWith("own-") && (
                    <button type="button" onClick={() => dropShock(s.id)} className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent">Remove</button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-brass/40 bg-background p-4 space-y-3">
            <span className={label}>Add a provision of your own</span>
            <input className={`${field} text-base sm:text-sm min-h-11`} value={pLabel} onChange={(e) => setPLabel(e.target.value)} placeholder="e.g. County assembly must ratify every boundary variation" />
            <div className="grid gap-2 sm:grid-cols-2">
              <select className={`${field} text-base sm:text-sm min-h-11`} value={pWeight} onChange={(e) => setPWeight(Number(e.target.value))} aria-label="Structural weight">
                {[6, 10, 13, 16, 18, 22].map((w) => <option key={w} value={w}>Structural weight {w}</option>)}
              </select>
              <button type="button" onClick={addProv} disabled={!pLabel.trim()} className="min-h-11 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">
                Add provision
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Which shocks does it insulate against?</p>
            <div className="flex flex-wrap gap-2">
              {allShocks.map((s) => (
                <button key={s.id} type="button" aria-pressed={pGuards.includes(s.id)} onClick={() => tg(s.id)}
                  className={`px-2 py-1.5 border text-[10px] uppercase tracking-[0.14em] ${pGuards.includes(s.id) ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                  {s.label.split(" ").slice(0, 4).join(" ")}
                </button>
              ))}
            </div>
          </div>

          <div className="border border-brass/40 bg-background p-4 space-y-3">
            <span className={label}>Add a shock of your own</span>
            <input className={`${field} text-base sm:text-sm min-h-11`} value={sLabel} onChange={(e) => setSLabel(e.target.value)} placeholder="e.g. Drought displaces a third of the pastoral population" />
            <div className="grid gap-2 sm:grid-cols-3">
              <select className={`${field} text-base sm:text-sm min-h-11`} value={sSev} onChange={(e) => setSSev(Number(e.target.value))} aria-label="Shock severity">
                {[10, 14, 18, 22, 26, 30].map((v) => <option key={v} value={v}>Severity {v}</option>)}
              </select>
              <select className={`${field} text-base sm:text-sm min-h-11`} value={sBond} onChange={(e) => setSBond(Number(e.target.value))} aria-label="Bond most exposed">
                {BONDS.map((b, i) => <option key={b.name} value={i}>{b.name}</option>)}
              </select>
              <button type="button" onClick={addShock} disabled={!sLabel.trim()} className="min-h-11 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">
                Add shock
              </button>
            </div>
          </div>
        </div>
        <div className="space-y-4 min-w-0">
          <DurabilityDial score={signals.survivalScore ?? (canon ? canon.percent : r.q)} />
          {canon && (
            <div className={`border bg-background p-4 ${canon.trap ? "border-terracotta/60" : "border-brass/40"}`}>
              <p className={label}>Succession durability S% · Section 4.5</p>
              <p className="font-serif text-4xl text-primary">
                {canon.percent.toFixed(1)}<span className="text-lg text-muted-foreground">%</span>{" "}
                <span className="text-lg text-accent">{bandOf(canon.percent).name}</span>
              </p>
              <div className="h-1 bg-border mt-3 relative">
                <div className="h-1 bg-accent transition-all" style={{ width: `${canon.percent}%` }} />
                <span className="absolute -top-1 h-3 w-px bg-terracotta" style={{ left: `${SUCCESSION_TRAP}%` }} aria-hidden />
              </div>
              <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Gate at {SUCCESSION_TRAP.toFixed(1)}%</p>
              {canon.trap ? (
                <div role="alert" className="mt-3 border border-terracotta/60 bg-terracotta/10 px-3 py-2">
                  <p className="flex items-start gap-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-terracotta">
                    <AlertTriangle size={13} className="shrink-0 mt-px" />
                    <span>[TERMINAL SUCCESSION TRAP ENGAGED]</span>
                  </p>
                  <p className="mt-1 text-xs text-foreground/85">
                    S% = {canon.percent.toFixed(1)} is below {SUCCESSION_TRAP.toFixed(1)}. Mission clearance in Desk 15 stays locked until durability reaches the gate.
                  </p>
                </div>
              ) : (
                <p className="mt-3 flex items-start gap-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary/80">
                  <ShieldCheck size={13} className="shrink-0 mt-px" /> Gate passed
                </p>
              )}

              <p className="mt-4 text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">Step 5 · Derivation</p>
              <p className="mt-1 text-[11px] text-muted-foreground">
                S_raw = 0.35 μB + 0.25 B_IG + 0.25 B_IR + 0.15 𝕀_cov − 0.20 R̃ · S% = S_raw ÷ 5.0 × 100%
              </p>
              <div className="mt-2 w-full max-w-full min-w-0 overflow-x-auto">
                <table className="w-full min-w-[20rem] border-collapse text-xs">
                  <tbody>
                    {canon.terms.map((t) => (
                      <tr key={t.label} className="border-t border-border">
                        <td className="py-1.5 pr-2 text-foreground/85">{t.label}</td>
                        <td className="py-1.5 px-2 text-right font-mono tabular-nums text-muted-foreground">
                          {t.weight < 0 ? "−" : ""}{Math.abs(t.weight).toFixed(2)} × {t.input.toFixed(t.label.startsWith("0.35") ? 3 : 2)}
                        </td>
                        <td className="py-1.5 pl-2 text-right font-mono tabular-nums text-primary">{t.value >= 0 ? "+" : "−"}{Math.abs(t.value).toFixed(4)}</td>
                      </tr>
                    ))}
                    <tr className="border-t-2 border-brass/60 font-semibold">
                      <td className="py-1.5 pr-2 text-primary" colSpan={2}>S_raw</td>
                      <td className="py-1.5 pl-2 text-right font-mono tabular-nums text-primary">{canon.raw.toFixed(4)}</td>
                    </tr>
                    <tr className="font-semibold">
                      <td className="py-1.5 pr-2 text-primary" colSpan={2}>S% = {canon.raw.toFixed(4)} ÷ 5.0 × 100</td>
                      <td className="py-1.5 pl-2 text-right font-mono tabular-nums text-accent">{canon.percent.toFixed(1)}%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11px] text-muted-foreground">
                {canon.covenantCount} covenant(s) in force → 𝕀_cov = {canon.covenantIndicator.toFixed(1)} (1.0 from two covenants, otherwise 0.5 each).
                R = {canon.rupturePct}% → R̃ = {canon.rupturePenaltyBase.toFixed(2)}.
              </p>
            </div>
          )}
          <div className="border border-border bg-background p-4">
            <p className={label}>{canon ? "Drafted-text provision quotient (supplementary)" : "Agreement survival quotient"}</p>
            <p className="font-serif text-4xl text-primary">{r.q}<span className="text-lg text-muted-foreground">/100</span> <span className="text-lg text-accent">{r.b.name}</span></p>
            <div className="h-1 bg-border mt-3"><div className="h-1 bg-accent transition-all" style={{ width: `${r.q}%` }} /></div>
          </div>
          <div className="border border-border bg-background p-4">
            <p className={label}>Compound strain across the four bonds</p>
            <div className="space-y-2">
              {r.bonds.map((b) => (
                <div key={b.name} className="text-xs">
                  <div className="flex justify-between"><span className="text-foreground/80">{b.name}</span><span className="text-muted-foreground">{b.strain}</span></div>
                  <div className="h-1 bg-border mt-1"><div className="h-1 bg-primary transition-all" style={{ width: `${b.strain}%` }} /></div>
                </div>
              ))}
            </div>
            {r.compound > 0 && <p className="text-xs text-accent mt-3">Compound amplification: {r.compound} points lost to simultaneous uninsulated shocks.</p>}
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
