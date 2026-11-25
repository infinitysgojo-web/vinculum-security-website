import { useMemo, useState } from "react";
import BondRadar from "@/components/desk/BondRadar";
import ShockTimelineScrubber from "@/components/desk/ShockTimelineScrubber";
import {
  BOND_NAMES,
  TREND_MULT,
  bondBand,
  dominumIndex,
  facadeSyndrome,
  frictionCoefficient,
  mathReading,
  type BondVector,
  type CustomShock,
  type Signals,
} from "@/components/desk/engine";
import { DEFAULT_ESCROW, FORUMS, escrowWaterfall, forumFitness } from "@/components/desk/instruments";
import { inscriptionTimeline } from "@/components/desk/shockTimeline";
import type { AcademyInstrumentKind } from "./academyTypes";

/**
 * Section VI instrument cutaways. Each one is a read-only demonstration: it keeps its
 * inputs in local state, computes only through the desks' own exported functions, and
 * never publishes to the MissionEngine bus: it imports no publishing hook and no engine context.
 */

const KEYS: (keyof BondVector)[] = ["interpersonal", "communal", "intergenerational", "institutional"];
const toVec = (b: BondVector) => KEYS.map((k) => b[k]) as [number, number, number, number];

const frame = "my-5 border border-brass/60 bg-card p-5 space-y-4";
const tile = "border border-border/50 bg-background/50 p-2.5 font-mono text-xs";
const label = "text-[10px] text-muted-foreground uppercase";
const choice = (on: boolean) =>
  `flex-1 py-1.5 text-[11px] font-mono border transition-colors ${on ? "border-brass bg-accent/20 text-primary font-semibold" : "border-border/50 text-muted-foreground hover:text-primary"}`;

function Header({ title, note }: { title: string; note: string }) {
  return (
    <div className="border-b border-border/50 pb-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">Instrument Cutaway · read-only demonstration</p>
      <h5 className="mt-1 font-serif text-base text-primary">{title}</h5>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

function Slider({ id, text, value, min, max, step, onChange }: { id: string; text: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="flex justify-between gap-2 font-mono text-[11px] text-muted-foreground">
        <span>{text}</span>
        <span className="font-bold text-primary tabular-nums">{Number.isInteger(step) ? value : value.toFixed(1)}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} className="w-full accent-brass cursor-pointer" />
    </div>
  );
}

function BondSliders({ prefix, bonds, setBonds }: { prefix: string; bonds: BondVector; setBonds: (b: BondVector) => void }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {KEYS.map((k, i) => (
        <Slider key={k} id={`${prefix}-${k}`} text={`${BOND_NAMES[i]} · ${bondBand(bonds[k])}`} value={bonds[k]} min={1} max={5} step={0.1} onChange={(v) => setBonds({ ...bonds, [k]: v })} />
      ))}
    </div>
  );
}

/** 4-Bond Radar cutaway: the state vector, its limiting bond and Facade Syndrome. */
function RadarCutaway() {
  const [bonds, setBonds] = useState<BondVector>({ interpersonal: 3.8, communal: 1.9, intergenerational: 3.2, institutional: 3.0 });
  const v = toVec(bonds);
  const r = mathReading(v);
  const facade = facadeSyndrome(v);
  return (
    <div className={frame} data-testid="instrument-radar">
      <Header title="Four-Bond Radar and the Liebig Minimum" note="Move the bonds. The limiting bond, its band and the floor test are read from the Diagnostics desk's own functions." />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-center">
        <div className="mx-auto w-full max-w-[260px]"><BondRadar scores={v} size={240} caption="Live demonstration vector" /></div>
        <BondSliders prefix="radar" bonds={bonds} setBonds={setBonds} />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={tile}><p className={label}>Liebig minimum</p><p className={`mt-1 text-sm font-bold ${r.limitingScore <= 3 ? "text-destructive" : "text-primary"}`}>{r.limitingScore.toFixed(1)} · {BOND_NAMES[r.limitingIndex]}</p><p className="text-[10px] text-muted-foreground">{bondBand(r.limitingScore)}{r.limitingScore <= 3 ? " · at or below the 3.0 floor" : " · holds the floor"}</p></div>
        <div className={tile}><p className={label}>Mean and variance</p><p className="mt-1 text-sm font-bold text-primary">{r.mean.toFixed(2)} · {r.variance.toFixed(2)}</p><p className="text-[10px] text-muted-foreground">The mean never overrides the minimum</p></div>
        <div className={tile}><p className={label}>Facade Syndrome</p><p className={`mt-1 text-sm font-bold ${facade.engaged ? "text-destructive" : "text-primary"}`}>{facade.engaged ? "Engaged" : "Not engaged"}</p><p className="text-[10px] text-muted-foreground">Variance above 1.25, max at least 4.0, min at most 2.0</p></div>
      </div>
    </div>
  );
}

/** Asymmetry visualiser: two parties' tolerance vectors and their normalised distance. */
function AsymmetryCutaway() {
  const [a, setA] = useState<BondVector>({ interpersonal: 4.0, communal: 3.0, intergenerational: 3.0, institutional: 3.0 });
  const [b, setB] = useState<BondVector>({ interpersonal: 3.0, communal: 4.0, intergenerational: 3.0, institutional: 3.0 });
  const va = toVec(a), vb = toVec(b);
  const f = frictionCoefficient(va, vb);
  const gaps = va.map((x, i) => Math.round(Math.abs(x - vb[i]) * 10) / 10);
  const widest = gaps.indexOf(Math.max(...gaps));
  return (
    <div className={frame} data-testid="instrument-asymmetry">
      <Header title="Asymmetry Matrix Visualiser" note="Set the minimum each party will accept on each bond. The coefficient is the De-confliction Bench's own: the Euclidean distance over 8, rounded to two decimals." />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Party A tolerance</p><BondSliders prefix="asym-a" bonds={a} setBonds={setA} /></div>
        <div className="space-y-2"><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Party B tolerance</p><BondSliders prefix="asym-b" bonds={b} setBonds={setB} /></div>
      </div>
      <div className="space-y-1.5">
        {gaps.map((g, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,9rem)_minmax(0,1fr)_3rem] items-center gap-2 font-mono text-[11px]">
            <span className="truncate text-muted-foreground">{BOND_NAMES[i]}</span>
            <span className="h-2 bg-border/40"><span className={`block h-2 ${i === widest && g > 0 ? "bg-destructive/70" : "bg-brass/70"}`} style={{ width: `${(g / 4) * 100}%` }} /></span>
            <span className="text-right tabular-nums text-primary">{g.toFixed(1)}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className={tile}><p className={label}>Friction coefficient</p><p className="mt-1 text-sm font-bold text-primary">{f.toFixed(2)} of 1.00</p><p className="text-[10px] text-muted-foreground">0 is parity; 1 is the widest possible separation</p></div>
        <div className={tile}><p className={label}>Widest axis of vulnerability</p><p className="mt-1 text-sm font-bold text-primary">{gaps[widest] > 0 ? BOND_NAMES[widest] : "None: the parties stand at parity"}</p><p className="text-[10px] text-muted-foreground">Where a neutral guarantee is needed first</p></div>
      </div>
    </div>
  );
}

const DEMO_SHOCKS: CustomShock[] = [
  { id: "demo-border", name: "Border incident", description: "", deltas: { interpersonal: -0.4, communal: -0.8, intergenerational: 0, institutional: -0.2 } },
  { id: "demo-currency", name: "Currency collapse", description: "", deltas: { interpersonal: 0, communal: -0.6, intergenerational: -0.5, institutional: -0.4 } },
  { id: "demo-succession", name: "Leadership succession", description: "", deltas: { interpersonal: -1.0, communal: 0, intergenerational: -0.2, institutional: -0.8 } },
];

/** Shock timeline: the Rehearsal Drawer's own timeline over demonstration shocks. */
function TimelineCutaway() {
  const [observed, setObserved] = useState(25);
  const [exposure, setExposure] = useState(10);
  const [trend, setTrend] = useState<keyof typeof TREND_MULT>("static");
  const steps = useMemo(() => {
    const s: Signals = {
      bonds: { interpersonal: 3.8, communal: 3.4, intergenerational: 3.3, institutional: 3.6 },
      ruptureBase: observed,
      trendMultiplier: TREND_MULT[trend],
      unmitigatedExposure: exposure,
      customShocks: DEMO_SHOCKS,
    };
    return inscriptionTimeline(s);
  }, [observed, exposure, trend]);
  return (
    <div className={frame} data-testid="instrument-timeline">
      <Header title="Shock Timeline Scrubber" note="Three demonstration shocks are applied in order to the vector 3.8, 3.4, 3.3, 3.6. Each step re-reads the Rupture Index through the Sentinel rule (inscribed load included) and the half-life through the Decay Horizon." />
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider id="tl-observed" text="Observed tripwire share" value={observed} min={0} max={100} step={1} onChange={setObserved} />
        <Slider id="tl-exposure" text="Unmitigated exposure U" value={exposure} min={0} max={100} step={1} onChange={setExposure} />
        <div className="space-y-1 sm:col-span-2">
          <span className="font-mono text-[11px] text-muted-foreground">Trend</span>
          <div className="flex gap-1">
            {(Object.keys(TREND_MULT) as (keyof typeof TREND_MULT)[]).map((t) => (
              <button key={t} type="button" aria-pressed={trend === t} onClick={() => setTrend(t)} className={choice(trend === t)}>{t}</button>
            ))}
          </div>
        </div>
      </div>
      <ShockTimelineScrubber steps={steps} title="Demonstration timeline (not on the bus)" />
    </div>
  );
}

/** Escrow balance bar: conservation of the pledge and the freeze on breach. */
function EscrowCutaway() {
  const [shares, setShares] = useState<[number, number, number, number]>([...DEFAULT_ESCROW.shares]);
  const [verifier, setVerifier] = useState(true);
  const [communal, setCommunal] = useState(3.4);
  const [institutional, setInstitutional] = useState(3.1);
  const [intergenerational, setIntergenerational] = useState(2.9);
  const [survival, setSurvival] = useState(58);
  const [rupture, setRupture] = useState(30);
  const r = escrowWaterfall({ ...DEFAULT_ESCROW, shares }, { verifierSeated: verifier, communal, institutional, intergenerational, trackGap: 0, trackTolerance: 1, survivalScore: survival, rupture });
  const unmet = Math.max(0, r.total - r.gross);
  const held = r.frozen ? r.gross : 0;
  const parts = [
    { k: "Released", v: r.released, cls: "bg-accent" },
    { k: "Clawback reserve", v: r.clawbackHeld, cls: "bg-brass" },
    { k: "Performance bond", v: r.bondHeld, cls: "bg-primary/60" },
    { k: "Held by freeze", v: held, cls: "bg-destructive/70" },
    { k: "Tranches not met", v: unmet, cls: "bg-border" },
  ];
  return (
    <div className={frame} data-testid="instrument-escrow">
      <Header title="Escrow Waterfall Balance Bar" note="Every segment comes from the De-confliction Bench's escrowWaterfall. The bar proves conservation: released, reserves, freeze and unmet tranches always account for the whole pledge." />
      <div className="grid gap-3 sm:grid-cols-4">
        {shares.map((x, i) => (
          <Slider key={i} id={`esc-share-${i}`} text={`Tranche ${i + 1} share`} value={x} min={0} max={100} step={1} onChange={(v) => setShares((s) => s.map((y, j) => (j === i ? v : y)) as [number, number, number, number])} />
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Slider id="esc-comm" text="Communal bond" value={communal} min={1} max={5} step={0.1} onChange={setCommunal} />
        <Slider id="esc-inst" text="Institutional-Relational bond" value={institutional} min={1} max={5} step={0.1} onChange={setInstitutional} />
        <Slider id="esc-igen" text="Intergenerational bond" value={intergenerational} min={1} max={5} step={0.1} onChange={setIntergenerational} />
        <Slider id="esc-surv" text="Survival (per cent)" value={survival} min={0} max={100} step={1} onChange={setSurvival} />
        <Slider id="esc-r" text="Rupture Index" value={rupture} min={0} max={100} step={1} onChange={setRupture} />
        <div className="space-y-1"><span className="font-mono text-[11px] text-muted-foreground">Independent verifier</span><button type="button" aria-pressed={verifier} onClick={() => setVerifier((x) => !x)} className={`w-full ${choice(verifier)}`}>{verifier ? "Seated" : "Not seated"}</button></div>
      </div>
      <div className="flex h-5 w-full overflow-hidden border border-border/60" role="img" aria-label="Escrow balance bar">
        {parts.map((p) => (p.v > 0 ? <span key={p.k} className={`${p.cls} h-full`} style={{ width: `${(p.v / Math.max(r.total, 1)) * 100}%` }} title={`${p.k}: ${p.v}%`} /> : null))}
      </div>
      <div className="grid gap-2 sm:grid-cols-5 font-mono text-[10px]">
        {parts.map((p) => <span key={p.k} className="flex items-center gap-1.5 text-muted-foreground"><span className={`inline-block h-2 w-2 ${p.cls}`} />{p.k} {p.v}%</span>)}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={tile}><p className={label}>Pledge conservation</p><p className={`mt-1 text-sm font-bold ${r.balanced ? "text-primary" : "text-destructive"}`}>Σ shares = {r.total}</p><p className="text-[10px] text-muted-foreground">{r.balanced ? "Balanced: exactly 100" : "Unbalanced: the shares must sum to exactly 100"}</p></div>
        <div className={tile}><p className={label}>Tranches met</p><p className="mt-1 text-sm font-bold text-primary">{r.tranches.filter((t) => t.met).length} of 4</p><p className="text-[10px] text-muted-foreground">In order: each needs every earlier tranche</p></div>
        <div className={tile}><p className={label}>Released</p><p className={`mt-1 text-sm font-bold ${r.frozen ? "text-destructive" : "text-accent"}`}>{r.released}%</p><p className="text-[10px] text-muted-foreground">{r.frozen ? "Frozen: rupture at 60 or more" : r.ceded ? "Final Cession: reserves discharged" : "Reserves held until Final Cession"}</p></div>
      </div>
    </div>
  );
}

/** Dominum synthesis: the four terms, the index and the phase. */
function DominumCutaway() {
  const [bonds, setBonds] = useState<BondVector>({ interpersonal: 4, communal: 4, intergenerational: 4, institutional: 4 });
  const [released, setReleased] = useState(80);
  const [frozen, setFrozen] = useState(false);
  const [survival, setSurvival] = useState(70);
  const [rupture, setRupture] = useState(20);
  const d = dominumIndex({ bonds, escrowReleasedPercent: released, escrowFrozen: frozen, survivalScore: survival, rupture });
  return (
    <div className={frame} data-testid="instrument-dominum">
      <Header title="Dominum Index Synthesis" note="The four readings below are fed to Mission Readiness's own dominumIndex. Nothing here is published; the desk computes the same figure from the bus." />
      <BondSliders prefix="dom" bonds={bonds} setBonds={setBonds} />
      <div className="grid gap-3 sm:grid-cols-4">
        <Slider id="dom-e" text="Escrow released (per cent)" value={released} min={0} max={100} step={1} onChange={setReleased} />
        <Slider id="dom-s" text="Succession durability" value={survival} min={0} max={100} step={1} onChange={setSurvival} />
        <Slider id="dom-r" text="Rupture Index" value={rupture} min={0} max={100} step={1} onChange={setRupture} />
        <div className="space-y-1"><span className="font-mono text-[11px] text-muted-foreground">Escrow</span><button type="button" aria-pressed={frozen} onClick={() => setFrozen((x) => !x)} className={`w-full ${choice(frozen)}`}>{frozen ? "Frozen" : "Not frozen"}</button></div>
      </div>
      {"index" in d ? (
        <div className="grid gap-3 sm:grid-cols-5">
          {d.terms.map((t) => (
            <div key={t.key} className={tile}><p className={label}>{t.key} · weight {t.weight.toFixed(2)}</p><p className="mt-1 text-sm font-bold text-primary">{t.input.toFixed(3)}</p><p className="text-[10px] text-muted-foreground">contributes {(100 * t.value).toFixed(1)}</p></div>
          ))}
          <div className={tile}><p className={label}>Dominum Index</p><p className="mt-1 text-sm font-bold text-accent">{d.index.toFixed(1)}</p><p className="text-[10px] text-muted-foreground">{d.phase}{d.floorHeld ? "" : " · floor breached"}</p></div>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">Awaiting: {d.missing.join(", ")}</p>
      )}
    </div>
  );
}

/** Forum selector: venue fitness and enforcement friction across the seven venues. */
function ForumCutaway() {
  const [id, setId] = useState("pca");
  const [waived, setWaived] = useState(false);
  const [neutral, setNeutral] = useState(false);
  const rows = FORUMS.map((f) => ({ f, r: forumFitness(f, { immunityWaived: waived, neutralSeat: neutral }) }));
  const cur = rows.find((x) => x.f.id === id) ?? rows[0];
  return (
    <div className={frame} data-testid="instrument-forum">
      <Header title="Dispute Forum Enforceability Matrix" note="Venue fitness from the Clause Redliner's own forumFitness: base enforceability, less 18 while immunity is unaddressed and 8 when the seat is not neutral." />
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={waived} onClick={() => setWaived((x) => !x)} className={choice(waived)}>{waived ? "Immunity waived" : "Immunity unaddressed"}</button>
        <button type="button" aria-pressed={neutral} onClick={() => setNeutral((x) => !x)} className={choice(neutral)}>{neutral ? "Neutral seat" : "Seat in a party's territory"}</button>
      </div>
      <div className="space-y-1.5">
        {rows.map(({ f, r }) => (
          <button key={f.id} type="button" onClick={() => setId(f.id)} aria-pressed={f.id === id}
            className={`grid w-full grid-cols-[minmax(0,1fr)_auto] sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)_7rem] items-center gap-x-2 gap-y-1 px-1 py-1 text-left font-mono text-[11px] ${f.id === id ? "bg-accent/15" : ""}`}>
            <span className="truncate text-primary">{f.name}</span>
            <span className="col-span-2 order-last h-2 bg-border/40 sm:col-span-1 sm:order-none"><span className="block h-2 bg-accent/70" style={{ width: `${r.fitness}%` }} /></span>
            <span className="text-right tabular-nums text-muted-foreground">{r.fitness} · base {r.base}</span>
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <div className={tile}><p className={label}>Selected venue</p><p className="mt-1 text-sm font-bold text-primary">{cur.f.name}</p><p className="text-[10px] text-muted-foreground">{cur.f.basis}</p></div>
        <div className={tile}><p className={label}>Venue fitness</p><p className="mt-1 text-sm font-bold text-accent">{cur.r.fitness} of 100</p><p className="text-[10px] text-muted-foreground">Base {cur.r.base}, less {cur.r.immunity} and {cur.r.seat}</p></div>
        <div className={tile}><p className={label}>Enforcement friction</p><p className="mt-1 text-sm font-bold text-primary">{cur.r.friction}</p><p className="text-[10px] text-muted-foreground">Fitness plus friction is always 100</p></div>
      </div>
    </div>
  );
}

export function AcademyInstrument({ kind }: { kind: AcademyInstrumentKind }) {
  switch (kind) {
    case "radar": return <RadarCutaway />;
    case "asymmetry": return <AsymmetryCutaway />;
    case "timeline": return <TimelineCutaway />;
    case "escrow": return <EscrowCutaway />;
    case "dominum": return <DominumCutaway />;
    case "forum": return <ForumCutaway />;
  }
}
