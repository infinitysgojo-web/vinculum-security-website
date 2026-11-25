import { Fragment, useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Copy, Lock, Minus, OctagonAlert, Pause, Play, Plus, RotateCcw, Snowflake, ArrowDownUp, ArrowUpDown } from "lucide-react";
import BondRadar from "@/components/desk/BondRadar";
import {
  BOND_NAMES,
  DOMINUM_THRESHOLDS,
  RUPTURE_BANDS,
  TREND_MULT,
  VIABLE_FLOOR,
  bondBand,
  breachesFloor,
  dominumIndex,
  facadeSyndrome,
  frictionCoefficient,
  inscribedRuptureLoad,
  mathReading,
  ruptureBand,
  type BondVector,
  type CustomShock,
  type DominumReading,
  type Signals,
} from "@/components/desk/engine";
import { DEFAULT_ESCROW, ESCROW_FREEZE, FORUMS, PROVISIONAL_THRESHOLD, escrowWaterfall, forumFitness, type EscrowInput, type EscrowTerms, type ForumTerms } from "@/components/desk/instruments";
import { firstTrips, inscriptionTimeline, type TimelineFlag, type TimelineStep } from "@/components/desk/shockTimeline";
import ScholarlyFormula from "./ScholarlyFormula";
import { MathExpr } from "./academyMath";
import { F_DOMINUM, F_ESCROW_RELEASE, F_FORUM_F, F_FRICTION, F_HALF_LIFE, F_LIEBIG, F_RUPTURE } from "./academyFormulas";
import type { AcademyFormula, AcademyInstrumentKind } from "./academyTypes";

/**
 * Section VI instrument cutaways. Each one is a read-only demonstration: it keeps its
 * inputs in local state, computes only through the desks' own exported functions, and
 * never publishes to the MissionEngine bus: it imports no publishing hook and no engine context.
 *
 * Layout follows each instrument's own width (container queries), not the viewport, so the
 * instruments read the same inside the lecture reader at every breakpoint. Below about
 * 640px of container width the parts stack: visual, then readouts, then controls.
 *
 * The preset tables and reading functions are exported so qa/academy-curriculum.test.ts
 * can check that every preset reading equals the engine function's own output.
 */

const KEYS: (keyof BondVector)[] = ["interpersonal", "communal", "intergenerational", "institutional"];
const toVec = (b: BondVector) => KEYS.map((k) => b[k]) as [number, number, number, number];
const fromVec = (v: readonly number[]): BondVector => ({ interpersonal: v[0], communal: v[1], intergenerational: v[2], institutional: v[3] });
const fx = (n: number, d = 1) => n.toFixed(d);
const signed = (n: number, d = 1) => `${n > 0 ? "+" : n < 0 ? "−" : "±"}${Math.abs(n).toFixed(d)}`;

/* ------------------------------------------------------------------ */
/* Value clamping (exported for tests)                                 */
/* ------------------------------------------------------------------ */

/** Clamp to the control's range and snap to its step, so no out-of-range value reaches an engine call. */
export function clampStep(v: number, min: number, max: number, step: number): number {
  if (!Number.isFinite(v)) return min;
  const decimals = (String(step).split(".")[1] ?? "").length;
  const snapped = Math.round((Math.min(max, Math.max(min, v)) - min) / step) * step + min;
  return Number(Math.min(max, Math.max(min, snapped)).toFixed(decimals));
}

/** The valid ranges the instruments enforce, taken from the engine's scales. */
export const RANGES = {
  bond: { min: 1, max: 5, step: 0.1 },
  percent: { min: 0, max: 100, step: 1 },
  rupture: { min: 0, max: 100, step: 1 },
  exposure: { min: 0, max: 100, step: 1 },
  shockSize: { min: 0.5, max: 2, step: 0.1 },
  trackGap: { min: 0, max: 3, step: 1 },
} as const;

/* ------------------------------------------------------------------ */
/* Shared parts                                                        */
/* ------------------------------------------------------------------ */

const frame = "@container my-6 border border-brass/60 bg-card p-4 sm:p-5 space-y-5 text-[14px] leading-normal min-w-0";
const tile = "border border-border/50 bg-background/50 p-2.5 font-mono text-xs min-w-0";
const tileLabel = "text-[10px] text-muted-foreground uppercase tracking-wide";
const btn = "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 border px-3 font-mono text-[11px] transition-colors motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const choice = (on: boolean) => `${btn} ${on ? "border-brass bg-accent/20 text-primary font-semibold" : "border-border/60 text-muted-foreground hover:text-primary"}`;

function Header({ title, note }: { title: string; note: string }) {
  return (
    <div className="border-b border-border/50 pb-3">
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-brass">Instrument Cutaway · read-only demonstration</p>
      <h5 className="mt-1 font-serif text-lg text-primary">{title}</h5>
      <p className="mt-1 text-xs text-muted-foreground">{note}</p>
    </div>
  );
}

/** A slider with a matching number field and step buttons. Arrows step one unit; Shift with an arrow steps five. */
function Control({ id, label, value, onChange, min, max, step, suffix }: { id: string; label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; suffix?: string }) {
  const set = (v: number) => onChange(clampStep(v, min, max, step));
  const decimals = (String(step).split(".")[1] ?? "").length;
  const [draft, setDraft] = useState<string | null>(null);
  const onKey = (e: KeyboardEvent) => {
    const up = e.key === "ArrowRight" || e.key === "ArrowUp";
    const down = e.key === "ArrowLeft" || e.key === "ArrowDown";
    if (!up && !down) return;
    e.preventDefault();
    const d = (e.shiftKey ? 5 : 1) * step * (up ? 1 : -1);
    set(value + d);
  };
  return (
    <div className="min-w-0 space-y-1">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
        <label htmlFor={id} className="min-w-[8rem] flex-1 font-mono text-[11px] text-muted-foreground">{label}</label>
        <div className="flex items-center">
          <button type="button" className={`${btn} border-border/60 text-primary`} onClick={() => set(value - step)} aria-label={`Decrease ${label}`} disabled={value <= min}><Minus size={14} aria-hidden /></button>
          <input
            type="number"
            inputMode="decimal"
            aria-label={`${label} value`}
            className="h-11 w-[4.75rem] border-y border-border/60 bg-background text-center font-mono text-sm tabular-nums text-primary [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
            min={min}
            max={max}
            step={step}
            value={draft ?? fx(value, decimals)}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => {
              if (draft !== null && draft.trim() !== "") set(parseFloat(draft));
              setDraft(null);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                e.preventDefault();
                setDraft(null);
                set(value + (e.shiftKey ? 5 : 1) * step * (e.key === "ArrowUp" ? 1 : -1));
              }
            }}
          />
          <button type="button" className={`${btn} border-border/60 text-primary`} onClick={() => set(value + step)} aria-label={`Increase ${label}`} disabled={value >= max}><Plus size={14} aria-hidden /></button>
          {suffix && <span className="ml-1.5 font-mono text-[11px] text-muted-foreground">{suffix}</span>}
        </div>
      </div>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => set(parseFloat(e.target.value))} onKeyDown={onKey} className="academy-range w-full cursor-pointer" />
    </div>
  );
}

type Preset<T> = { id: string; label: string; caption: string; value: T };

function Presets<T>({ presets, active, onPick, onReset }: { presets: Preset<T>[]; active: string | null; onPick: (p: Preset<T>) => void; onReset: () => void }) {
  const cur = presets.find((p) => p.id === active);
  return (
    <div className="space-y-2" data-testid="instrument-presets">
      <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Scenario presets</p>
      <div className="flex flex-wrap gap-2">
        {presets.map((p) => (
          <button key={p.id} type="button" aria-pressed={active === p.id} onClick={() => onPick(p)} className={choice(active === p.id)} title={p.caption}>{p.label}</button>
        ))}
        <button type="button" onClick={onReset} className={`${btn} border-border/60 text-muted-foreground hover:text-primary`}><RotateCcw size={13} aria-hidden /> Reset</button>
      </div>
      <p className="min-h-[1.25rem] text-xs text-muted-foreground" aria-live="polite">{cur ? cur.caption : "Custom settings: no preset selected."}</p>
    </div>
  );
}

type Tone = "ok" | "warn" | "alert";
const TONE: Record<Tone, { cls: string; icon: ReactNode; word: string }> = {
  ok: { cls: "border-emerald/60 text-primary", icon: <CheckCircle2 size={16} aria-hidden className="text-emerald" />, word: "Holding" },
  warn: { cls: "border-ochre/70 text-primary", icon: <AlertTriangle size={16} aria-hidden className="text-ochre" />, word: "Caution" },
  alert: { cls: "border-destructive/70 text-primary", icon: <OctagonAlert size={16} aria-hidden className="text-destructive" />, word: "Breach" },
};

/** A plain-language verdict, never colour alone: an icon, a word and a sentence. */
function Verdict({ tone, children }: { tone: Tone; children: ReactNode }) {
  const t = TONE[tone];
  return (
    <p className={`flex items-start gap-2 border-l-4 bg-background/50 px-3 py-2 text-sm ${t.cls}`} aria-live="polite" data-testid="instrument-verdict" data-tone={tone}>
      <span className="mt-0.5 shrink-0">{t.icon}</span>
      <span><span className="font-mono text-[11px] font-semibold uppercase tracking-wider">{t.word}: </span>{children}</span>
    </p>
  );
}

/** Show the working: the canonical formula, then the same formula with the live values, step by step. */
function Working({ formula, steps, result }: { formula: AcademyFormula; steps: string[]; result: string }) {
  return (
    <details className="group border border-border/60 bg-background/40" data-testid="instrument-working">
      <summary className="flex min-h-11 cursor-pointer items-center px-3 font-mono text-[11px] uppercase tracking-[0.14em] text-primary">Show the working · {formula.title}</summary>
      <div className="px-3 pb-3">
        <ScholarlyFormula title={formula.title} classification={formula.classification} expression={{ lhs: <MathExpr src={formula.lhs} />, rhs: <MathExpr src={formula.rhs} /> }} parameters={[]} className="my-3" />
        <ol className="academy-scroll-x space-y-1.5 py-1 font-serif text-base text-primary" aria-live="polite">
          {steps.map((s, i) => (
            <li key={i} className="flex items-center gap-2 whitespace-nowrap">
              <span className="w-5 shrink-0 text-right font-mono text-[10px] text-muted-foreground">{i + 1}</span>
              <MathExpr src={`${formula.lhs} = ${s}`} />
            </li>
          ))}
          <li className="flex items-center gap-2 whitespace-nowrap font-semibold">
            <span className="w-5 shrink-0" />
            <MathExpr src={`${formula.lhs} = ${result}`} />
            <span className="font-mono text-[10px] font-normal text-muted-foreground">engine result</span>
          </li>
        </ol>
      </div>
    </details>
  );
}

function Delta({ label, now, base, digits = 1, unit = "" }: { label: string; now: number | null; base: number | null; digits?: number; unit?: string }) {
  if (now === null || base === null) return null;
  const d = Math.round((now - base) * 10 ** digits) / 10 ** digits;
  return <span className="inline-flex items-center border border-border/60 px-2 py-1 font-mono text-[11px] tabular-nums text-muted-foreground">{label} {d === 0 ? "unchanged" : `${signed(d, digits)}${unit}`}</span>;
}

function Deltas({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5" aria-live="polite" data-testid="instrument-deltas">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Change from baseline</span>
      {children}
    </div>
  );
}

function CopySettings({ data }: { data: unknown }) {
  const [done, setDone] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return (
    <button
      type="button"
      className={`${btn} border-border/60 text-muted-foreground hover:text-primary`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
          setDone(true);
          window.clearTimeout(timer.current);
          timer.current = window.setTimeout(() => setDone(false), 1800);
        } catch {
          setDone(false);
        }
      }}
    >
      <Copy size={13} aria-hidden /> {done ? "Settings copied" : "Copy settings"}
    </button>
  );
}

/** Instrument grid: visual, readouts, controls; stacked under 40rem of container width. */
const twoCol = "grid gap-5 @[40rem]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]";

/* ------------------------------------------------------------------ */
/* 1. Four-Bond Radar and the Liebig minimum                           */
/* ------------------------------------------------------------------ */

export type RadarPreset = [number, number, number, number];
export const RADAR_DEFAULT: RadarPreset = [3.8, 1.9, 3.2, 3.0];
export const RADAR_PRESETS: Preset<RadarPreset>[] = [
  { id: "alpha", label: "Drill Alpha basin", caption: "Drill Alpha (5.1): the downstream communal bond at 1.9 limits the basin while the other bonds hold.", value: [3.8, 1.9, 3.2, 3.0] },
  { id: "beta", label: "Drill Beta restructuring", caption: "Drill Beta (5.2): the institutional-relational bond at 2.4 is the limiting factor of the restructuring.", value: [3.4, 3.2, 3.1, 2.4] },
  { id: "gamma", label: "Drill Gamma standoff", caption: "Drill Gamma (5.3): the fishing communities' communal bond at 2.2 limits the maritime standoff.", value: [3.1, 2.2, 3.4, 2.6] },
  { id: "lab", label: "Capstone laboratory", caption: "Capstone (5.4): the laboratory's starting vector; the communal bond at 2.8 is the one Gate 5 asks you to name.", value: [3.8, 2.8, 4.1, 3.6] },
  { id: "decay", label: "Decay worked case", caption: "Chapter 4.2: the worked Decay Horizon vector 4.0, 2.0, 2.0, 3.0, two bonds Failing at once.", value: [4, 2, 2, 3] },
];

/** Every radar reading, from the Diagnostics desk's own functions. */
export function radarReading(v: RadarPreset) {
  const reading = mathReading(v);
  const facade = facadeSyndrome(v);
  const bonds = v.map((x, i) => ({ name: BOND_NAMES[i], score: x, band: bondBand(x), breaches: breachesFloor(x) }));
  // The floor test is strict (holds only above 3.0); on the 0.1 grid the nearest passing score is 3.1.
  const raiseTo = Math.round((VIABLE_FLOOR + 0.1) * 10) / 10;
  const need = breachesFloor(reading.limitingScore) ? Math.round((raiseTo - reading.limitingScore) * 10) / 10 : 0;
  return { reading, facade, bonds, raiseTo, need };
}

function RadarCutaway() {
  const [v, setV] = useState<RadarPreset>(RADAR_DEFAULT);
  const [base, setBase] = useState<RadarPreset>(RADAR_DEFAULT);
  const [active, setActive] = useState<string | null>("alpha");
  const r = radarReading(v);
  const b0 = radarReading(base);
  const lim = r.reading.limitingIndex;
  const setOne = (i: number, x: number) => {
    setActive(null);
    setV((cur) => cur.map((y, j) => (j === i ? x : y)) as RadarPreset);
  };
  const tone: Tone = r.need > 0 ? "alert" : r.reading.limitingScore <= 3.5 ? "warn" : "ok";
  return (
    <div className={frame} data-testid="instrument-radar">
      <Header title="Four-Bond Radar and the Liebig Minimum" note="Move the bonds. The limiting bond, its band and the floor test are read from the Diagnostics desk's own functions; the dashed ring is the 3.0 viable floor and the dotted outline is the baseline." />
      <Presets presets={RADAR_PRESETS} active={active} onPick={(p) => { setActive(p.id); setV(p.value); setBase(p.value); }} onReset={() => { setActive("alpha"); setV(RADAR_DEFAULT); setBase(RADAR_DEFAULT); }} />
      <div className={twoCol}>
        <div className="min-w-0"><BondRadar scores={v} size={300} caption="Live demonstration vector" variant="stacked" highlight={lim} ghost={base} /></div>
        <div className="min-w-0 space-y-3" aria-live="polite">
          <ul className="space-y-1.5" data-testid="radar-bond-list">
            {r.bonds.map((b, i) => (
              <li key={b.name} className={`flex flex-wrap items-center justify-between gap-x-3 gap-y-0.5 border px-2.5 py-2 font-mono text-xs ${i === lim ? "border-destructive/60 bg-destructive/5" : "border-border/50"}`} data-limiting={i === lim ? "true" : undefined}>
                <span className="min-w-[9rem] text-primary">{b.name}{i === lim ? " · limiting" : ""}</span>
                <span className="flex items-center gap-1.5 tabular-nums text-muted-foreground">
                  {fx(b.score)} · {b.band} ·
                  {b.breaches ? <><OctagonAlert size={12} aria-hidden className="text-destructive" /> breaches floor</> : <><CheckCircle2 size={12} aria-hidden className="text-emerald" /> holds floor</>}
                </span>
              </li>
            ))}
          </ul>
          <div className="grid gap-2 @[28rem]:grid-cols-3">
            <div className={tile}><p className={tileLabel}>Liebig minimum</p><p className="mt-1 text-sm font-bold text-primary">{fx(r.reading.limitingScore)}</p><p className="text-[10px] text-muted-foreground">{BOND_NAMES[lim]} · {bondBand(r.reading.limitingScore)}</p></div>
            <div className={tile}><p className={tileLabel}>Mean</p><p className="mt-1 text-sm font-bold text-primary">{fx(r.reading.mean, 2)}</p><p className="text-[10px] text-muted-foreground">Never overrides the minimum</p></div>
            <div className={tile}><p className={tileLabel}>Spread</p><p className="mt-1 text-sm font-bold text-primary">{fx(r.reading.spread, 2)}</p><p className="text-[10px] text-muted-foreground">Variance {fx(r.reading.variance, 2)} · Facade {r.facade.engaged ? "engaged" : "not engaged"}</p></div>
          </div>
          <Deltas><Delta label="Minimum" now={r.reading.limitingScore} base={b0.reading.limitingScore} /><Delta label="Mean" now={r.reading.mean} base={b0.reading.mean} digits={2} /><Delta label="Spread" now={r.reading.spread} base={b0.reading.spread} digits={2} /></Deltas>
        </div>
      </div>
      <Verdict tone={tone}>
        {r.need > 0
          ? `The ${BOND_NAMES[lim]} bond at ${fx(r.reading.limitingScore)} is ${r.bonds[lim].band} and limits the whole vector. Raise it by ${fx(r.need)} to ${fx(r.raiseTo)} to clear the 3.0 floor before any other bond is worked; an operator opens the Diagnostics desk and routes remedies to that bond first.`
          : `Every bond holds the 3.0 floor. The ${BOND_NAMES[lim]} bond at ${fx(r.reading.limitingScore)} is still the limiting factor and the first place an operator invests to widen the margin.`}
      </Verdict>
      <div className="grid gap-4 @[40rem]:grid-cols-2">
        {KEYS.map((k, i) => (
          <Control key={k} id={`radar-${k}`} label={`${BOND_NAMES[i]} bond`} value={v[i]} onChange={(x) => setOne(i, x)} {...RANGES.bond} />
        ))}
      </div>
      <Working formula={F_LIEBIG} steps={[`\\min(${v.map((x) => fx(x)).join(",\\, ")})`]} result={fx(r.reading.limitingScore)} />
      <div className="flex justify-end"><CopySettings data={{ instrument: "radar", bonds: fromVec(v) }} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Asymmetry Matrix                                                 */
/* ------------------------------------------------------------------ */

export type AsymPreset = { a: RadarPreset; b: RadarPreset };
export const ASYM_DEFAULT: AsymPreset = { a: [4, 3, 3, 3], b: [3, 4, 3, 3] };
export const ASYM_PRESETS: Preset<AsymPreset>[] = [
  { id: "one-axis", label: "One-axis gap", caption: "Chapter 4.3: a four-point gap on the interpersonal bond alone reads 0.50.", value: { a: [5, 3, 3, 3], b: [1, 3, 3, 3] } },
  { id: "crossed", label: "Crossed priorities", caption: "Chapter 4.3: opposed four-point gaps on two bonds read 0.71, wider than either alone.", value: { a: [5, 1, 3, 3], b: [1, 5, 3, 3] } },
  { id: "maximum", label: "Maximum separation", caption: "Chapter 4.3: one party at 5.0 on every bond and the other at 1.0 reads the ceiling of 1.00.", value: { a: [5, 5, 5, 5], b: [1, 1, 1, 1] } },
  { id: "parity", label: "Parity", caption: "Both parties hold the Drill Beta vector: identical tolerances read 0.00.", value: { a: [3.4, 3.2, 3.1, 2.4], b: [3.4, 3.2, 3.1, 2.4] } },
];

export function asymmetryReading(p: AsymPreset) {
  const friction = frictionCoefficient(p.a, p.b);
  const gaps = p.a.map((x, i) => Math.round(Math.abs(x - p.b[i]) * 10) / 10);
  const widest = gaps.indexOf(Math.max(...gaps));
  return { friction, gaps, widest, parity: friction === 0 };
}

function AsymmetryCutaway() {
  const [p, setP] = useState<AsymPreset>(ASYM_DEFAULT);
  const [base, setBase] = useState<AsymPreset>(ASYM_DEFAULT);
  const [active, setActive] = useState<string | null>(null);
  const r = asymmetryReading(p);
  const r0 = asymmetryReading(base);
  const set = (side: "a" | "b", i: number, x: number) => {
    setActive(null);
    setP((cur) => ({ ...cur, [side]: cur[side].map((y, j) => (j === i ? x : y)) as RadarPreset }));
  };
  const sq = p.a.map((x, i) => `(${fx(x)} - ${fx(p.b[i])})^{2}`).join(" + ");
  const sum = p.a.reduce((n, x, i) => n + (x - p.b[i]) ** 2, 0);
  return (
    <div className={frame} data-testid="instrument-asymmetry">
      <Header title="Asymmetry Matrix Visualiser" note="Set the minimum each party will accept on each bond. The coefficient is the De-confliction Bench's own frictionCoefficient: the Euclidean distance between the two vectors over the maximum of 8, rounded to two decimals." />
      <Presets presets={ASYM_PRESETS} active={active} onPick={(x) => { setActive(x.id); setP(x.value); setBase(x.value); }} onReset={() => { setActive(null); setP(ASYM_DEFAULT); setBase(ASYM_DEFAULT); }} />
      <div className="space-y-2" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Per-bond gap (which bond drives the distance)</p>
        {r.gaps.map((g, i) => (
          <div key={i} className="grid grid-cols-[minmax(0,1fr)_3rem] items-center gap-x-3 gap-y-1 font-mono text-[11px] @[32rem]:grid-cols-[11rem_minmax(0,1fr)_3rem]">
            <span className="text-muted-foreground">{BOND_NAMES[i]}{i === r.widest && g > 0 ? " · widest" : ""}</span>
            <span className="order-last col-span-2 h-2.5 bg-border/40 @[32rem]:order-none @[32rem]:col-span-1"><span className={`block h-2.5 transition-[width] motion-reduce:transition-none ${i === r.widest && g > 0 ? "bg-destructive/70" : "bg-brass/70"}`} style={{ width: `${(g / 4) * 100}%` }} /></span>
            <span className="text-right tabular-nums text-primary">{fx(g)}</span>
          </div>
        ))}
      </div>
      <div className="grid gap-2 @[32rem]:grid-cols-2" aria-live="polite">
        <div className={tile}><p className={tileLabel}>Normalised distance (friction)</p><p className="mt-1 text-sm font-bold text-primary">{fx(r.friction, 2)} of 1.00</p><p className="text-[10px] text-muted-foreground">0 is parity; 1 is the widest possible separation</p></div>
        <div className={tile}><p className={tileLabel}>Widest axis of vulnerability</p><p className="mt-1 text-sm font-bold text-primary">{r.parity ? "None" : BOND_NAMES[r.widest]}</p><p className="text-[10px] text-muted-foreground">Where a neutral guarantee is needed first</p></div>
      </div>
      <Deltas><Delta label="Friction" now={r.friction} base={r0.friction} digits={2} /></Deltas>
      <Verdict tone={r.parity ? "ok" : r.friction >= 0.5 ? "alert" : "warn"}>
        {r.parity
          ? "Parity: the two parties accept the same minimum on every bond, so the bench reads no friction between them."
          : `Vulnerability, not parity: the parties stand ${fx(r.friction, 2)} apart, and the ${BOND_NAMES[r.widest]} bond (gap ${fx(r.gaps[r.widest])}) drives the distance. An operator seats a neutral guarantee on that bond before the parties meet.`}
      </Verdict>
      <div className="flex flex-wrap gap-2">
        <button type="button" className={`${btn} border-border/60 text-primary`} onClick={() => { setActive(null); setP((cur) => ({ a: cur.b, b: cur.a })); }}><ArrowDownUp size={13} aria-hidden /> Swap parties</button>
      </div>
      <div className="grid gap-5 @[40rem]:grid-cols-2">
        {(["a", "b"] as const).map((side) => (
          <div key={side} className="min-w-0 space-y-3 border border-border/40 p-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-accent">Party {side.toUpperCase()} tolerance</p>
            {KEYS.map((k, i) => <Control key={k} id={`asym-${side}-${k}`} label={BOND_NAMES[i]} value={p[side][i]} onChange={(x) => set(side, i, x)} {...RANGES.bond} />)}
          </div>
        ))}
      </div>
      <Working formula={F_FRICTION} steps={[`\\frac{\\sqrt{${sq}}}{8}`, `\\frac{\\sqrt{${fx(sum, 2)}}}{8}`]} result={fx(r.friction, 2)} />
      <div className="flex justify-end"><CopySettings data={{ instrument: "asymmetry", partyA: fromVec(p.a), partyB: fromVec(p.b) }} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Shock Timeline Scrubber                                          */
/* ------------------------------------------------------------------ */

const DEMO_SHOCKS: CustomShock[] = [
  { id: "demo-border", name: "Border incident", description: "", deltas: { interpersonal: -0.4, communal: -0.8, intergenerational: 0, institutional: -0.2 } },
  { id: "demo-currency", name: "Currency collapse", description: "", deltas: { interpersonal: 0, communal: -0.6, intergenerational: -0.5, institutional: -0.4 } },
  { id: "demo-succession", name: "Leadership succession", description: "", deltas: { interpersonal: -1.0, communal: 0, intergenerational: -0.2, institutional: -0.8 } },
];
const TIMELINE_BONDS: BondVector = { interpersonal: 3.8, communal: 3.4, intergenerational: 3.3, institutional: 3.6 };

export type TimelinePreset = { observed: number; exposure: number; trend: keyof typeof TREND_MULT; size: number };
export const TIMELINE_DEFAULT: TimelinePreset = { observed: 25, exposure: 10, trend: "static", size: 1 };
export const TIMELINE_PRESETS: Preset<TimelinePreset>[] = [
  { id: "default", label: "Demonstration baseline", caption: "The three demonstration shocks on a static trend: the inscribed load lifts R step by step.", value: TIMELINE_DEFAULT },
  { id: "deteriorating", label: "Deteriorating trend", caption: "Chapter 4.1: the same register under a deteriorating trend (× 1.15) crosses thresholds earlier.", value: { observed: 25, exposure: 10, trend: "deteriorating", size: 1 } },
  { id: "improving", label: "Improving trend", caption: "Chapter 4.1: an improving trend (× 0.85) damps every step of the same shocks.", value: { observed: 25, exposure: 10, trend: "improving", size: 1 } },
  { id: "beta", label: "Drill Beta exposure", caption: "Chapter 5.2: uninsulated exposure of 26 shortens the half-life at every step.", value: { observed: 25, exposure: 26, trend: "static", size: 1 } },
  { id: "severe", label: "Severe compound shock", caption: "Shocks at 1.5 × their size on a deteriorating trend drive R into the Critical band.", value: { observed: 25, exposure: 10, trend: "deteriorating", size: 1.5 } },
];

/** The demonstration shocks with every delta scaled by the shock-size control, to one decimal. */
export const timelineShocks = (size: number): CustomShock[] =>
  DEMO_SHOCKS.map((s) => ({ ...s, deltas: fromVec(toVec(s.deltas).map((d) => Math.round(d * size * 10) / 10)) }));

/** The Rehearsal Drawer's own timeline over the demonstration shocks. */
export function timelineSteps(p: TimelinePreset): TimelineStep[] {
  const s: Signals = { bonds: TIMELINE_BONDS, ruptureBase: p.observed, trendMultiplier: TREND_MULT[p.trend], unmitigatedExposure: p.exposure, customShocks: timelineShocks(p.size) };
  return inscriptionTimeline(s);
}

const FLAG_SHORT: Record<TimelineFlag, string> = { SOVEREIGN_FLOOR: "Bond at 1.0", PROVISIONAL_PLEADINGS: `R ≥ ${PROVISIONAL_THRESHOLD}`, ESCROW_FREEZE: `R ≥ ${ESCROW_FREEZE}` };

function RuptureChart({ steps, cur, ghost }: { steps: TimelineStep[]; cur: number; ghost: TimelineStep[] | null }) {
  const W = 560, H = 220, L = 36, Rm = 12, T = 10, B = 28;
  const n = Math.max(1, steps.length - 1);
  const x = (i: number) => L + ((W - L - Rm) * i) / n;
  const y = (r: number) => T + (H - T - B) * (1 - r / 100);
  const bands = [
    { from: 0, to: RUPTURE_BANDS.guarded, name: "Stable", cls: "fill-emerald/10" },
    { from: RUPTURE_BANDS.guarded, to: RUPTURE_BANDS.elevated, name: "Guarded", cls: "fill-brass/10" },
    { from: RUPTURE_BANDS.elevated, to: RUPTURE_BANDS.critical, name: "Elevated", cls: "fill-ochre/15" },
    { from: RUPTURE_BANDS.critical, to: 100, name: "Critical", cls: "fill-destructive/10" },
  ];
  const line = (ss: TimelineStep[]) => ss.map((s, i) => `${x(i)},${y(s.rupture ?? 0)}`).join(" ");
  const trips = firstTrips(steps);
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`Rupture Index across ${steps.length} steps: ${steps.map((s) => `T${s.t} ${s.rupture}`).join(", ")}`} data-testid="timeline-chart">
      {bands.map((b) => (
        <g key={b.name}>
          <rect x={L} width={W - L - Rm} y={y(b.to)} height={y(b.from) - y(b.to)} className={b.cls} />
          <text x={W - Rm - 4} y={y(b.to) + 11} textAnchor="end" fontSize={9} className="fill-muted-foreground">{b.name}</text>
        </g>
      ))}
      {[RUPTURE_BANDS.guarded, RUPTURE_BANDS.elevated, PROVISIONAL_THRESHOLD, RUPTURE_BANDS.critical].map((t) => (
        <g key={t}>
          <line x1={L} x2={W - Rm} y1={y(t)} y2={y(t)} className={t === RUPTURE_BANDS.critical ? "stroke-destructive" : "stroke-border"} strokeDasharray={t === PROVISIONAL_THRESHOLD ? "3 3" : undefined} strokeWidth={t === RUPTURE_BANDS.critical ? 1.5 : 1} />
          <text x={L - 4} y={y(t) + 3} textAnchor="end" fontSize={9} className="fill-muted-foreground">{t}</text>
        </g>
      ))}
      {ghost && <polyline points={line(ghost)} fill="none" className="stroke-muted-foreground" strokeOpacity={0.5} strokeDasharray="4 3" strokeWidth={1.5} />}
      <polyline points={line(steps)} fill="none" className="stroke-accent" strokeWidth={2.2} />
      {steps.map((s, i) => (
        <g key={s.t}>
          <circle cx={x(i)} cy={y(s.rupture ?? 0)} r={i === cur ? 6 : 3.5} className={i === cur ? "fill-accent stroke-background" : "fill-accent"} strokeWidth={2} />
          <text x={x(i)} y={H - 10} textAnchor="middle" fontSize={10} className={i === cur ? "fill-primary font-semibold" : "fill-muted-foreground"}>T{s.t}</text>
        </g>
      ))}
      {(Object.entries(trips) as [TimelineFlag, number][]).filter(([f]) => f !== "SOVEREIGN_FLOOR").map(([f, at]) => (
        <g key={f} data-testid={`trip-${f}`}>
          <line x1={x(at)} x2={x(at)} y1={T} y2={H - B} className="stroke-destructive" strokeDasharray="2 2" />
          <text x={x(at) + 3} y={T + 9 + (f === "ESCROW_FREEZE" ? 11 : 0)} fontSize={9} className="fill-destructive">{FLAG_SHORT[f]} at T{at}</text>
        </g>
      ))}
    </svg>
  );
}

function TimelineCutaway() {
  const [p, setP] = useState<TimelinePreset>(TIMELINE_DEFAULT);
  const [base, setBase] = useState<TimelinePreset>(TIMELINE_DEFAULT);
  const [active, setActive] = useState<string | null>("default");
  const steps = useMemo(() => timelineSteps(p), [p]);
  const ghost = useMemo(() => timelineSteps(base), [base]);
  const n = steps.length - 1;
  const [t, setT] = useState(n);
  const [playing, setPlaying] = useState(false);
  useEffect(() => setT((x) => Math.min(x, n)), [n]);
  useEffect(() => {
    if (!playing) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const id = window.setInterval(() => setT((x) => (x >= n ? (setPlaying(false), n) : x + 1)), reduce ? 1600 : 900);
    return () => window.clearInterval(id);
  }, [playing, n]);
  const cur = steps[Math.min(t, n)];
  const g = ghost[Math.min(t, ghost.length - 1)];
  const upd = (patch: Partial<TimelinePreset>) => { setActive(null); setP((x) => ({ ...x, ...patch })); };
  const shocksSoFar = timelineShocks(p.size).slice(0, cur.t);
  const load = inscribedRuptureLoad(shocksSoFar, 0);
  const band = ruptureBand(cur.rupture ?? 0);
  const tone: Tone = (cur.rupture ?? 0) >= RUPTURE_BANDS.critical ? "alert" : (cur.rupture ?? 0) >= RUPTURE_BANDS.elevated ? "warn" : "ok";
  const lim = cur.bonds.indexOf(Math.min(...cur.bonds));
  return (
    <div className={frame} data-testid="instrument-timeline">
      <Header title="Shock Timeline Scrubber" note="Three demonstration shocks are applied in order to the vector 3.8, 3.4, 3.3, 3.6 through the Rehearsal Drawer's own inscriptionTimeline. Each step re-reads the Rupture Index through the Sentinel rule (inscribed load included) and the half-life through the Decay Horizon." />
      <Presets presets={TIMELINE_PRESETS} active={active} onPick={(x) => { setActive(x.id); setP(x.value); setBase(x.value); setT(timelineSteps(x.value).length - 1); }} onReset={() => { setActive("default"); setP(TIMELINE_DEFAULT); setBase(TIMELINE_DEFAULT); setT(3); setPlaying(false); }} />
      <div className="border border-border/50 bg-background/40 p-2"><RuptureChart steps={steps} cur={cur.t} ghost={active === null ? ghost : null} /></div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" className={`${btn} border-border/60 text-primary`} onClick={() => { setPlaying(false); setT((x) => Math.max(0, x - 1)); }} disabled={t <= 0} aria-label="Previous step"><ChevronLeft size={14} aria-hidden /> Step back</button>
        <button type="button" className={`${btn} border-brass/60 text-primary`} onClick={() => { if (!playing && t >= n) setT(0); setPlaying((x) => !x); }} aria-pressed={playing}>{playing ? <><Pause size={14} aria-hidden /> Pause</> : <><Play size={14} aria-hidden /> Play</>}</button>
        <button type="button" className={`${btn} border-border/60 text-primary`} onClick={() => { setPlaying(false); setT((x) => Math.min(n, x + 1)); }} disabled={t >= n} aria-label="Next step">Step forward <ChevronRight size={14} aria-hidden /></button>
        <output className="ml-auto font-mono text-xs tabular-nums text-primary" aria-live="polite">{cur.label}</output>
      </div>
      <input type="range" min={0} max={n} step={1} value={t} onChange={(e) => { setPlaying(false); setT(Number(e.target.value)); }} aria-label="Timeline step" aria-valuetext={cur.label} className="academy-range w-full" />
      <div className="grid gap-2 @[30rem]:grid-cols-2 @[48rem]:grid-cols-4" aria-live="polite">
        <div className={tile}><p className={tileLabel}>Rupture Index</p><p className={`mt-1 text-sm font-bold ${tone === "alert" ? "text-destructive" : "text-primary"}`}>{cur.rupture}</p><p className="text-[10px] text-muted-foreground">{band} band · inscribed load {load}</p></div>
        <div className={tile}><p className={tileLabel}>Half-life</p><p className="mt-1 text-sm font-bold text-primary">{cur.halfLifeDays === null ? "∞" : `${cur.halfLifeDays} d`}</p><p className="text-[10px] text-muted-foreground">λ {cur.lambda === null ? "none" : cur.lambda.toFixed(4)} per day</p></div>
        <div className={tile}><p className={tileLabel}>Mean bond B(t)</p><p className="mt-1 text-sm font-bold text-primary">{fx(cur.meanBond, 2)}</p><p className="text-[10px] text-muted-foreground">Fracture window {cur.fractureDays === null ? "∞" : `${cur.fractureDays} d`}</p></div>
        <div className={tile}><p className={tileLabel}>Thresholds held</p><p className="mt-1 text-sm font-bold text-primary">{cur.flags.length ? cur.flags.map((f) => FLAG_SHORT[f]).join(", ") : "None"}</p><p className="text-[10px] text-muted-foreground">{cur.tripped.length ? `First reached here: ${cur.tripped.map((f) => FLAG_SHORT[f]).join(", ")}` : "Nothing first reached at this step"}</p></div>
      </div>
      <div className="grid grid-cols-2 gap-2 @[40rem]:grid-cols-4">
        {cur.bonds.map((b, i) => (
          <div key={BOND_NAMES[i]} className={`${tile} ${i === lim ? "border-destructive/50" : ""}`}><p className={`${tileLabel} truncate`}>{BOND_NAMES[i]}</p><p className="mt-1 text-sm font-bold tabular-nums text-primary">{fx(b)}</p><p className="text-[10px] text-muted-foreground">{bondBand(b)}{i === lim ? " · limiting" : ""}</p></div>
        ))}
      </div>
      <Deltas><Delta label="R" now={cur.rupture} base={g?.rupture ?? null} digits={0} /><Delta label="Half-life" now={cur.halfLifeDays} base={g?.halfLifeDays ?? null} unit=" d" /></Deltas>
      <Verdict tone={tone}>
        {`At ${cur.label} the Rupture Index reads ${cur.rupture}, ${band}, with the ${BOND_NAMES[lim]} bond limiting at ${fx(cur.bonds[lim])}. `}
        {(cur.rupture ?? 0) >= ESCROW_FREEZE ? "The escrow is frozen and provisional pleadings are drafted; the operator works the limiting bond before any release." : (cur.rupture ?? 0) >= PROVISIONAL_THRESHOLD ? "Provisional pleadings are drafted on the Legal Desk; the operator moves to contain the next shock before the freeze at 60." : "No threshold binds yet; the operator watches the next shock in the register."}
      </Verdict>
      <div className="grid gap-4 @[40rem]:grid-cols-2">
        <Control id="tl-observed" label="Observed tripwire share" value={p.observed} onChange={(x) => upd({ observed: x })} {...RANGES.percent} />
        <Control id="tl-exposure" label="Unmitigated exposure U" value={p.exposure} onChange={(x) => upd({ exposure: x })} {...RANGES.exposure} />
        <Control id="tl-size" label="Shock size (× each delta)" value={p.size} onChange={(x) => upd({ size: x })} {...RANGES.shockSize} />
        <div className="min-w-0 space-y-1">
          <span className="font-mono text-[11px] text-muted-foreground">Trend</span>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(TREND_MULT) as (keyof typeof TREND_MULT)[]).map((k) => (
              <button key={k} type="button" aria-pressed={p.trend === k} onClick={() => upd({ trend: k })} className={`${choice(p.trend === k)} flex-1 capitalize`}>{k} × {TREND_MULT[k].toFixed(2)}</button>
            ))}
          </div>
        </div>
      </div>
      <Working formula={F_RUPTURE} steps={[`\\min(100,\\, \\round((${p.observed} + ${load}) \\times ${TREND_MULT[p.trend].toFixed(2)}))`]} result={String(cur.rupture)} />
      {cur.lambda !== null && cur.lambda > 0 && (
        <Working formula={F_HALF_LIFE} steps={[`\\frac{\\ln 2}{\\frac{${p.exposure} + ${cur.rupture}}{2000}}`, `\\frac{0.6931}{${cur.lambda.toFixed(4)}}`]} result={`${cur.halfLifeDays}\\, \\text{days}`} />
      )}
      <div className="flex justify-end"><CopySettings data={{ instrument: "timeline", ...p, step: cur.t }} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Escrow Waterfall                                                 */
/* ------------------------------------------------------------------ */

export type EscrowPreset = { terms: EscrowTerms; input: Required<Pick<EscrowInput, "verifierSeated" | "communal" | "institutional" | "intergenerational" | "trackGap" | "trackTolerance" | "survivalScore" | "rupture">> };
export const ESCROW_DEFAULT: EscrowPreset = { terms: DEFAULT_ESCROW, input: { verifierSeated: true, communal: 3.4, institutional: 3.1, intergenerational: 2.9, trackGap: 1, trackTolerance: 2, survivalScore: 58, rupture: 30 } };
export const ESCROW_PRESETS: Preset<EscrowPreset>[] = [
  { id: "alpha-failing", label: "Drill Alpha, communal failing", caption: "Chapter 5.1: with the communal bond at 1.9 only Mobilization is met, releasing 17.5 per cent after reserves.", value: { terms: DEFAULT_ESCROW, input: { verifierSeated: true, communal: 1.9, institutional: 3.0, intergenerational: 3.2, trackGap: 0, trackTolerance: 0, survivalScore: 50, rupture: 36 } } },
  { id: "alpha-restored", label: "Drill Alpha, communal restored", caption: "Chapter 5.1: the communal bond restored to 3.4 meets Demarcation; release rises to 40 per cent.", value: { terms: DEFAULT_ESCROW, input: { verifierSeated: true, communal: 3.4, institutional: 3.0, intergenerational: 3.2, trackGap: 0, trackTolerance: 2, survivalScore: 50, rupture: 36 } } },
  { id: "beta-final", label: "Drill Beta, Final Cession", caption: "Chapter 5.2: every condition met and survival at 56.9 per cent, so the reserves discharge and 100 per cent is released.", value: { terms: DEFAULT_ESCROW, input: { verifierSeated: true, communal: 3.2, institutional: 3.4, intergenerational: 3.1, trackGap: 1, trackTolerance: 2, survivalScore: 56.9, rupture: 38 } } },
  { id: "gamma-freeze", label: "Drill Gamma, frozen", caption: "Chapter 5.3: the standoff drives R to 64; the whole account freezes and nothing is released.", value: { terms: DEFAULT_ESCROW, input: { verifierSeated: true, communal: 2.2, institutional: 2.6, intergenerational: 3.4, trackGap: 0, trackTolerance: 1, survivalScore: 50, rupture: 64 } } },
  { id: "front-loaded", label: "Front-loaded shares", caption: "Chapter 4.5: shares of 40, 20, 20 and 20 with only Mobilization met release 31 per cent.", value: { terms: { shares: [40, 20, 20, 20], clawback: 10, bond: 5 }, input: { verifierSeated: true, communal: 1.5, institutional: 3.0, intergenerational: 3.0, trackGap: 0, trackTolerance: 0, survivalScore: 50, rupture: 10 } } },
];

/** The De-confliction Bench's escrowWaterfall, plus the conservation partition it implies. */
export function escrowReading(p: EscrowPreset) {
  const r = escrowWaterfall(p.terms, p.input);
  const unmet = Math.round(Math.max(0, r.total - r.gross) * 100) / 100;
  const heldByFreeze = r.frozen ? r.gross : 0;
  const parts = [
    { k: "Released", v: r.released, cls: "bg-accent" },
    { k: "Clawback reserve", v: r.clawbackHeld, cls: "bg-brass" },
    { k: "Performance bond", v: r.bondHeld, cls: "bg-primary/60" },
    { k: "Held by freeze", v: heldByFreeze, cls: "bg-destructive/70" },
    { k: "Not yet met", v: unmet, cls: "bg-border" },
  ];
  const accounted = Math.round(parts.reduce((n, x) => n + x.v, 0) * 100) / 100;
  return { ...r, parts, accounted, conserved: Math.abs(accounted - r.total) < 1e-9 };
}

function EscrowCutaway() {
  const [p, setP] = useState<EscrowPreset>(ESCROW_DEFAULT);
  const [base, setBase] = useState<EscrowPreset>(ESCROW_DEFAULT);
  const [active, setActive] = useState<string | null>(null);
  const r = escrowReading(p);
  const r0 = escrowReading(base);
  const upd = (patch: Partial<EscrowPreset["input"]>) => { setActive(null); setP((x) => ({ ...x, input: { ...x.input, ...patch } })); };
  const tone: Tone = r.frozen ? "alert" : r.ceded ? "ok" : "warn";
  const firstUnmet = r.tranches.find((t) => !t.met);
  const clawPct = p.terms.clawback;
  return (
    <div className={frame} data-testid="instrument-escrow">
      <Header title="Escrow Waterfall Balance Bar" note="Every figure comes from the De-confliction Bench's escrowWaterfall. The four tranches always share 100 per cent of the pledge; the balance bar proves conservation: released, reserves, freeze and unmet tranches account for the whole." />
      <Presets presets={ESCROW_PRESETS} active={active} onPick={(x) => { setActive(x.id); setP(x.value); setBase(x.value); }} onReset={() => { setActive(null); setP(ESCROW_DEFAULT); setBase(ESCROW_DEFAULT); }} />
      {r.frozen && (
        <p className="flex items-start gap-2 border-2 border-destructive/70 bg-destructive/10 px-3 py-2 text-sm text-destructive" role="status" data-testid="escrow-frozen">
          <Snowflake size={16} aria-hidden className="mt-0.5 shrink-0" /> <span><span className="font-mono text-[11px] font-bold uppercase tracking-wider">Frozen: </span>the Rupture Index reads {p.input.rupture}, at or above {ESCROW_FREEZE}. The whole account is held; nothing is released until R falls below {ESCROW_FREEZE}.</span>
        </p>
      )}
      <div className="space-y-1.5">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Tranche shares of the pledge</p>
        <div className="flex h-8 w-full overflow-hidden border border-border/60" role="img" aria-label={`Tranche shares: ${r.tranches.map((t) => `${t.label} ${t.share} per cent`).join(", ")}`} data-testid="escrow-shares">
          {r.tranches.map((t, i) => (
            <span key={t.id} className={`flex h-full items-center justify-center overflow-hidden border-r border-background/60 font-mono text-[10px] ${t.met && !r.frozen ? "bg-accent/70 text-accent-foreground" : "bg-muted text-muted-foreground"}`} style={{ width: `${(t.share / Math.max(r.total, 1)) * 100}%` }}>T{i + 1} · {t.share}%</span>
          ))}
        </div>
        <div className="flex h-5 w-full overflow-hidden border border-border/60" role="img" aria-label={`Balance: ${r.parts.map((x) => `${x.k} ${x.v} per cent`).join(", ")}`}>
          {r.parts.map((x) => (x.v > 0 ? <span key={x.k} className={`${x.cls} h-full transition-[width] motion-reduce:transition-none`} style={{ width: `${(x.v / Math.max(r.total, 1)) * 100}%` }} title={`${x.k}: ${x.v}%`} /> : null))}
        </div>
        <div className="grid grid-cols-1 gap-1 font-mono text-[11px] @[30rem]:grid-cols-2 @[48rem]:grid-cols-5">
          {r.parts.map((x) => <span key={x.k} className="flex items-center gap-1.5 text-muted-foreground"><span className={`inline-block h-2.5 w-2.5 shrink-0 ${x.cls}`} aria-hidden />{x.k} {x.v}%</span>)}
        </div>
        <p className={`flex items-center gap-1.5 font-mono text-[11px] ${r.conserved && r.balanced ? "text-primary" : "text-destructive"}`} data-testid="escrow-conservation">
          {r.conserved && r.balanced ? <CheckCircle2 size={13} aria-hidden className="text-emerald" /> : <OctagonAlert size={13} aria-hidden />}
          Conservation: shares {r.tranches.map((t) => t.share).join(" + ")} = {r.total}; parts {r.parts.map((x) => x.v).join(" + ")} = {r.accounted}
        </p>
      </div>
      <ul className="grid gap-1.5 @[40rem]:grid-cols-2" aria-live="polite" data-testid="escrow-checklist">
        {r.tranches.map((t) => (
          <li key={t.id} className={`flex items-start gap-2 border px-2.5 py-2 text-xs ${t.met ? "border-emerald/50" : "border-border/50"}`}>
            {t.met ? <CheckCircle2 size={14} aria-hidden className="mt-0.5 shrink-0 text-emerald" /> : <Lock size={14} aria-hidden className="mt-0.5 shrink-0 text-muted-foreground" />}
            <span className="min-w-0"><span className="block font-mono text-primary">{t.label} · {t.share}% · {t.met ? "met" : "not met"}</span><span className="block text-muted-foreground">{t.condition}</span></span>
          </li>
        ))}
      </ul>
      <div className="grid gap-2 @[30rem]:grid-cols-3" aria-live="polite">
        <div className={tile}><p className={tileLabel}>Released</p><p className={`mt-1 text-sm font-bold ${r.frozen ? "text-destructive" : "text-primary"}`}>{r.released}%</p><p className="text-[10px] text-muted-foreground">{r.ceded ? "Final Cession: reserves discharged" : "Net of reserves"}</p></div>
        <div className={tile}><p className={tileLabel}>Held</p><p className="mt-1 text-sm font-bold text-primary">{Math.round((r.clawbackHeld + r.bondHeld) * 100) / 100}%</p><p className="text-[10px] text-muted-foreground">Clawback {r.clawbackHeld}% · bond {r.bondHeld}%</p></div>
        <div className={tile}><p className={tileLabel}>Frozen</p><p className={`mt-1 text-sm font-bold ${r.frozen ? "text-destructive" : "text-primary"}`}>{r.frozen ? `${r.gross}%` : "0%"}</p><p className="text-[10px] text-muted-foreground">{r.frozen ? `Gross met, held while R ≥ ${ESCROW_FREEZE}` : `Freeze at R ≥ ${ESCROW_FREEZE}`}</p></div>
      </div>
      <Deltas><Delta label="Released" now={r.released} base={r0.released} unit="%" /></Deltas>
      <Verdict tone={tone}>
        {r.frozen
          ? `The account is frozen at R ${p.input.rupture}; an operator contains the rupture on the Sentinel before any tranche can move.`
          : r.ceded
            ? "Every tranche is met: Final Cession discharges both reserves and the whole pledge is released."
            : firstUnmet
              ? `${r.released} per cent is released. The waterfall stops at ${firstUnmet.label}: ${firstUnmet.condition.toLowerCase()}. That condition is the operator's next task.`
              : `${r.released} per cent is released.`}
      </Verdict>
      <div className="grid gap-4 @[40rem]:grid-cols-2">
        <Control id="esc-comm" label="Communal bond" value={p.input.communal} onChange={(x) => upd({ communal: x })} {...RANGES.bond} />
        <Control id="esc-inst" label="Institutional-Relational bond" value={p.input.institutional} onChange={(x) => upd({ institutional: x })} {...RANGES.bond} />
        <Control id="esc-igen" label="Intergenerational bond" value={p.input.intergenerational} onChange={(x) => upd({ intergenerational: x })} {...RANGES.bond} />
        <Control id="esc-surv" label="Survival (per cent)" value={p.input.survivalScore} onChange={(x) => upd({ survivalScore: x })} min={0} max={100} step={0.1} />
        <Control id="esc-r" label="Rupture Index" value={p.input.rupture} onChange={(x) => upd({ rupture: x })} {...RANGES.rupture} />
        <Control id="esc-gap" label="Track gap (phases)" value={p.input.trackGap} onChange={(x) => upd({ trackGap: x })} {...RANGES.trackGap} />
        <div className="min-w-0 space-y-1">
          <span className="font-mono text-[11px] text-muted-foreground">Independent verifier</span>
          <button type="button" aria-pressed={p.input.verifierSeated} onClick={() => upd({ verifierSeated: !p.input.verifierSeated })} className={`w-full ${choice(p.input.verifierSeated)}`}>{p.input.verifierSeated ? "Seated" : "Not seated"}</button>
        </div>
        <p className="self-end font-mono text-[11px] text-muted-foreground">Track tolerance {p.input.trackTolerance} phase{p.input.trackTolerance === 1 ? "" : "s"} · clawback {clawPct}% · bond {p.terms.bond}%</p>
      </div>
      <Working
        formula={F_ESCROW_RELEASE}
        steps={r.frozen ? [`0 \\quad \\text{since } R = ${p.input.rupture} \\ge ${ESCROW_FREEZE}`] : r.ceded ? [`G = ${r.gross}`] : [`\\max(0,\\, ${r.gross} - ${r.clawbackHeld} - ${r.bondHeld})`]}
        result={String(r.released)}
      />
      <div className="flex justify-end"><CopySettings data={{ instrument: "escrow", terms: p.terms, input: p.input }} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Dominum synthesis                                                */
/* ------------------------------------------------------------------ */

export type DominumPreset = { bonds: RadarPreset; released: number; frozen: boolean; survival: number; rupture: number };
export const DOMINUM_DEFAULT: DominumPreset = { bonds: [4, 4, 4, 4], released: 80, frozen: false, survival: 70, rupture: 20 };
export const DOMINUM_PRESETS: Preset<DominumPreset>[] = [
  { id: "base", label: "Base case", caption: "Chapter 4.4: bonds of 4.0, escrow 80, durability 70 and rupture 20 read 76.0, Self-Reinforcing Dominium.", value: DOMINUM_DEFAULT },
  { id: "frozen", label: "Escrow frozen", caption: "Chapter 4.4: the same mission with the escrow frozen loses its fiduciary term and reads 56.0, Fiduciary Anchor.", value: { ...DOMINUM_DEFAULT, frozen: true } },
  { id: "floor", label: "Floor breached", caption: "Chapter 4.4: one bond at 3.0 reads 79.8 yet is withheld from Dominium: Custodial Inversion.", value: { bonds: [5, 3, 5, 5], released: 80, frozen: false, survival: 70, rupture: 20 } },
  { id: "imperium", label: "Imperium-bound", caption: "Chapter 4.4: bonds of 2.0, nothing released, durability 30 and rupture 50 read 25.0.", value: { bonds: [2, 2, 2, 2], released: 0, frozen: false, survival: 30, rupture: 50 } },
  { id: "beta", label: "Drill Beta final", caption: "Chapter 5.2: the restructuring's final reading, 68.7, Custodial Inversion.", value: { bonds: [3.4, 3.2, 3.1, 3.4], released: 100, frozen: false, survival: 56.9, rupture: 38 } },
];

const domSignals = (p: DominumPreset): Signals => ({ bonds: fromVec(p.bonds), escrowReleasedPercent: p.released, escrowFrozen: p.frozen, survivalScore: p.survival, rupture: p.rupture });

/** Mission Readiness's own dominumIndex. */
export function dominumReadingOf(p: DominumPreset): DominumReading {
  const d = dominumIndex(domSignals(p));
  if (!("index" in d)) throw new Error("dominum preset is missing a reading");
  return d;
}

const PHASE_ORDER = ["Imperium-Bound", "Fiduciary Anchor", "Custodial Inversion", "Self-Reinforcing Dominium"] as const;

/**
 * For each single input, the smallest move (in control steps) that lifts the phase, found
 * by re-running dominumIndex; null when that input alone cannot lift it.
 */
export function dominumLift(p: DominumPreset) {
  const cur = PHASE_ORDER.indexOf(dominumReadingOf(p).phase);
  const lifted = (q: DominumPreset) => PHASE_ORDER.indexOf(dominumReadingOf(q).phase) > cur;
  const lim = p.bonds.indexOf(Math.min(...p.bonds));
  const levers: { id: string; label: string; steps: number | null; to: string }[] = [];
  const search = (id: string, label: string, make: (k: number) => DominumPreset | null, show: (q: DominumPreset) => string) => {
    for (let k = 1; k <= 400; k++) {
      const q = make(k);
      if (!q) break;
      if (lifted(q)) return levers.push({ id, label, steps: k, to: show(q) });
    }
    levers.push({ id, label, steps: null, to: "cannot lift the phase alone" });
  };
  search("bond", `${BOND_NAMES[lim]} bond (the limiting bond)`, (k) => {
    const x = Math.round((p.bonds[lim] + 0.1 * k) * 10) / 10;
    return x > 5 ? null : { ...p, bonds: p.bonds.map((y, i) => (i === lim ? x : y)) as RadarPreset };
  }, (q) => `raise to ${fx(q.bonds[lim])}`);
  if (p.frozen) levers.push({ id: "freeze", label: "Escrow freeze", steps: lifted({ ...p, frozen: false }) ? 1 : null, to: lifted({ ...p, frozen: false }) ? "lift the freeze" : "lifting the freeze alone does not lift the phase" });
  else search("escrow", "Escrow released", (k) => (p.released + k > 100 ? null : { ...p, released: p.released + k }), (q) => `raise to ${q.released}%`);
  search("survival", "Succession durability", (k) => (p.survival + k > 100 ? null : { ...p, survival: Math.round((p.survival + k) * 10) / 10 }), (q) => `raise to ${fx(q.survival)}%`);
  search("rupture", "Rupture Index", (k) => (p.rupture - k < 0 ? null : { ...p, rupture: p.rupture - k }), (q) => `lower to ${q.rupture}`);
  const best = levers.filter((l) => l.steps !== null).sort((a, b) => (a.steps ?? 0) - (b.steps ?? 0))[0] ?? null;
  return { levers, best, top: cur === PHASE_ORDER.length - 1 };
}

function DominumCutaway() {
  const [p, setP] = useState<DominumPreset>(DOMINUM_DEFAULT);
  const [base, setBase] = useState<DominumPreset>(DOMINUM_DEFAULT);
  const [active, setActive] = useState<string | null>("base");
  const d = dominumReadingOf(p);
  const d0 = dominumReadingOf(base);
  const lift = dominumLift(p);
  const upd = (patch: Partial<DominumPreset>) => { setActive(null); setP((x) => ({ ...x, ...patch })); };
  const T = DOMINUM_THRESHOLDS;
  const tone: Tone = d.phase === "Self-Reinforcing Dominium" ? "ok" : d.phase === "Imperium-Bound" ? "alert" : "warn";
  return (
    <div className={frame} data-testid="instrument-dominum">
      <Header title="Dominum Index Synthesis" note="The four readings are fed to Mission Readiness's own dominumIndex: 0.30 on the bond anchor, 0.25 on the fiduciary anchor, 0.25 on succession durability and 0.20 on containment. Nothing here is published; the desk computes the same figure from the bus." />
      <Presets presets={DOMINUM_PRESETS} active={active} onPick={(x) => { setActive(x.id); setP(x.value); setBase(x.value); }} onReset={() => { setActive("base"); setP(DOMINUM_DEFAULT); setBase(DOMINUM_DEFAULT); }} />
      <div className="space-y-2" aria-live="polite">
        <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Weighted contributions (each bar's full length is its weight)</p>
        {d.terms.map((t) => (
          <div key={t.key} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-x-3 gap-y-1 font-mono text-[11px] @[34rem]:grid-cols-[14rem_minmax(0,1fr)_4.5rem]">
            <span className="text-muted-foreground">{t.label}</span>
            <span className="order-last col-span-2 h-3 bg-border/40 @[34rem]:order-none @[34rem]:col-span-1">
              <span className="block h-3 bg-brass/30" style={{ width: `${t.weight * 100 / 0.3}%`, maxWidth: "100%" }}><span className="block h-3 bg-accent transition-[width] motion-reduce:transition-none" style={{ width: `${(t.input) * 100}%` }} /></span>
            </span>
            <span className="text-right tabular-nums text-primary">{fx(100 * t.value)}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1" data-testid="dominum-phase-bar">
        <div className="relative h-6 w-full border border-border/60 bg-background/40" role="img" aria-label={`Dominum Index ${fx(d.index)} against the phase lines at ${T.anchor}, ${T.inversion} and ${T.dominium}`}>
          <span className="absolute inset-y-0 left-0 bg-accent/70 transition-[width] motion-reduce:transition-none" style={{ width: `${d.index}%` }} />
          {[T.anchor, T.inversion, T.dominium].map((x) => <span key={x} className="absolute inset-y-0 w-0.5 bg-primary" style={{ left: `${x}%` }} />)}
        </div>
        <div className="relative h-4 font-mono text-[10px] text-muted-foreground">
          {[T.anchor, T.inversion, T.dominium].map((x) => <span key={x} className="absolute -translate-x-1/2" style={{ left: `${x}%` }}>{x}</span>)}
        </div>
      </div>
      <div className="grid gap-2 @[30rem]:grid-cols-2" aria-live="polite">
        <div className={tile}><p className={tileLabel}>Dominum Index</p><p className="mt-1 text-sm font-bold text-primary">{fx(d.index)} of 100</p><p className="text-[10px] text-muted-foreground">{d.phase}{d.floorHeld ? " · every bond above 3.0" : " · a bond at or below 3.0"}</p></div>
        <div className={tile}><p className={tileLabel}>Lifts the phase soonest</p><p className="mt-1 text-sm font-bold text-primary">{lift.top ? "Top phase reached" : lift.best ? lift.best.label : "No single input"}</p><p className="text-[10px] text-muted-foreground">{lift.top ? "Hold every input" : lift.best ? `${lift.best.to} (${lift.best.steps} step${lift.best.steps === 1 ? "" : "s"})` : "Several inputs must move together"}</p></div>
      </div>
      {!lift.top && (
        <ul className="grid gap-1 font-mono text-[11px] text-muted-foreground @[40rem]:grid-cols-2" data-testid="dominum-levers">
          {lift.levers.map((l) => <li key={l.id} className={l === lift.best ? "text-primary" : ""}>{l.label}: {l.steps === null ? l.to : `${l.to}, ${l.steps} step${l.steps === 1 ? "" : "s"}`}</li>)}
        </ul>
      )}
      <Deltas><Delta label="D" now={d.index} base={d0.index} /></Deltas>
      <Verdict tone={tone}>
        {`The index reads ${fx(d.index)}, ${d.phase}. `}
        {!d.floorHeld && d.index >= T.dominium ? "The figure clears 75 but a bond sits at or below the 3.0 floor, so Dominium is withheld; the operator works that bond first. " : ""}
        {lift.top ? "Every input should be held where it is." : lift.best ? `The nearest lift is the ${lift.best.label.toLowerCase()}: ${lift.best.to}.` : "No single input lifts the phase; the operator works several desks together."}
      </Verdict>
      <div className="grid gap-4 @[40rem]:grid-cols-2">
        {KEYS.map((k, i) => <Control key={k} id={`dom-${k}`} label={`${BOND_NAMES[i]} bond`} value={p.bonds[i]} onChange={(x) => upd({ bonds: p.bonds.map((y, j) => (j === i ? x : y)) as RadarPreset })} {...RANGES.bond} />)}
        <Control id="dom-e" label="Escrow released (per cent)" value={p.released} onChange={(x) => upd({ released: x })} {...RANGES.percent} />
        <Control id="dom-s" label="Succession durability (per cent)" value={p.survival} onChange={(x) => upd({ survival: x })} min={0} max={100} step={0.1} />
        <Control id="dom-r" label="Rupture Index" value={p.rupture} onChange={(x) => upd({ rupture: x })} {...RANGES.rupture} />
        <div className="min-w-0 space-y-1">
          <span className="font-mono text-[11px] text-muted-foreground">Escrow</span>
          <button type="button" aria-pressed={p.frozen} onClick={() => upd({ frozen: !p.frozen })} className={`w-full ${choice(p.frozen)}`}>{p.frozen ? <><Snowflake size={13} aria-hidden /> Frozen</> : "Not frozen"}</button>
        </div>
      </div>
      <Working formula={F_DOMINUM} steps={[`100 \\times (0.30 \\times ${fx(d.terms[0].input, 3)} + 0.25 \\times ${fx(d.terms[1].input, 3)} + 0.25 \\times ${fx(d.terms[2].input, 3)} + 0.20 \\times ${fx(d.terms[3].input, 3)})`]} result={fx(d.index)} />
      <div className="flex justify-end"><CopySettings data={{ instrument: "dominum", ...p, bonds: fromVec(p.bonds) }} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Forum matrix                                                     */
/* ------------------------------------------------------------------ */

export const FORUM_DEFAULT: ForumTerms = { immunityWaived: false, neutralSeat: false };
export const FORUM_PRESETS: Preset<ForumTerms>[] = [
  { id: "bare", label: "Bare clause", caption: "Chapter 5.3: immunity unaddressed and a seat in a party's territory: every venue loses 26 points.", value: FORUM_DEFAULT },
  { id: "waiver", label: "Waiver only", caption: "Chapter 5.3: an express waiver of immunity restores 18 points to every venue.", value: { immunityWaived: true, neutralSeat: false } },
  { id: "seat", label: "Neutral seat only", caption: "Chapter 5.3: a seat outside both states restores 8 points.", value: { immunityWaived: false, neutralSeat: true } },
  { id: "both", label: "Waiver and neutral seat", caption: "Chapter 5.3: the drafted clause; PCA keeps its full 74 against a friction of 26.", value: { immunityWaived: true, neutralSeat: true } },
];

export function forumRows(t: ForumTerms) {
  return FORUMS.map((f, order) => ({ f, order, r: forumFitness(f, t) }));
}

type SortKey = "order" | "base" | "fitness" | "friction" | "teeth" | "immunity" | "pace";
const SORT_LABEL: Record<SortKey, string> = { order: "Venue", base: "Base", fitness: "Fitness", friction: "Friction", teeth: "Teeth", immunity: "Immunity", pace: "Pace" };

function ForumCutaway() {
  const [t, setT] = useState<ForumTerms>(FORUM_DEFAULT);
  const [active, setActive] = useState<string | null>("bare");
  const [sort, setSort] = useState<{ key: SortKey; desc: boolean }>({ key: "order", desc: false });
  const rows = forumRows(t);
  const best = rows.reduce((a, b) => (b.r.fitness > a.r.fitness ? b : a));
  const val = (x: (typeof rows)[number], k: SortKey) => (k === "order" ? x.order : k === "teeth" || k === "immunity" || k === "pace" ? x.f[k] : x.r[k]);
  const sorted = [...rows].sort((a, b) => (val(a, sort.key) - val(b, sort.key)) * (sort.desc ? -1 : 1) || a.order - b.order);
  const head = (k: SortKey) => (
    <th scope="col" aria-sort={sort.key === k ? (sort.desc ? "descending" : "ascending") : "none"} className="px-2 py-1 text-left font-normal">
      <button type="button" className="inline-flex min-h-11 items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground hover:text-primary" onClick={() => setSort((s) => ({ key: k, desc: s.key === k ? !s.desc : k !== "order" }))}>
        {SORT_LABEL[k]} <ArrowUpDown size={11} aria-hidden />
      </button>
    </th>
  );
  return (
    <div className={frame} data-testid="instrument-forum">
      <Header title="Dispute Forum Enforceability Matrix" note="Venue fitness from the Clause Redliner's own forumFitness: base enforceability, less 18 while immunity is unaddressed and 8 when the seat is not neutral. The scores rate enforceability; jurisdiction is established from the instrument itself." />
      <Presets presets={FORUM_PRESETS} active={active} onPick={(x) => { setActive(x.id); setT(x.value); }} onReset={() => { setActive("bare"); setT(FORUM_DEFAULT); }} />
      <div className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={t.immunityWaived} onClick={() => { setActive(null); setT((x) => ({ ...x, immunityWaived: !x.immunityWaived })); }} className={choice(t.immunityWaived)}>{t.immunityWaived ? "Immunity waived" : "Immunity unaddressed"}</button>
        <button type="button" aria-pressed={t.neutralSeat} onClick={() => { setActive(null); setT((x) => ({ ...x, neutralSeat: !x.neutralSeat })); }} className={choice(t.neutralSeat)}>{t.neutralSeat ? "Neutral seat" : "Seat in a party's territory"}</button>
      </div>
      <div className="hidden @[40rem]:block academy-scroll-x" data-testid="forum-table">
        <table className="w-full min-w-[36rem] border-collapse font-mono text-xs">
          <thead><tr className="border-b border-border/60">{(["order", "base", "fitness", "friction", "teeth", "immunity", "pace"] as SortKey[]).map((k) => <Fragment key={k}>{head(k)}</Fragment>)}</tr></thead>
          <tbody aria-live="polite">
            {sorted.map(({ f, r }) => (
              <tr key={f.id} className={`border-b border-border/30 ${f.id === best.f.id ? "bg-accent/15" : ""}`} data-best={f.id === best.f.id ? "true" : undefined}>
                <th scope="row" className="px-2 py-2 text-left font-normal text-primary">{f.name}{f.id === best.f.id ? " · best" : ""}</th>
                <td className="px-2 tabular-nums">{r.base}</td>
                <td className="px-2 tabular-nums font-semibold text-primary">{r.fitness}</td>
                <td className="px-2 tabular-nums">{r.friction}</td>
                <td className="px-2 tabular-nums">{f.teeth}</td>
                <td className="px-2 tabular-nums">{f.immunity}</td>
                <td className="px-2 tabular-nums">{f.pace}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="space-y-2 @[40rem]:hidden" data-testid="forum-cards">
        {sorted.map(({ f, r }) => (
          <li key={f.id} className={`border px-3 py-2 font-mono text-xs ${f.id === best.f.id ? "border-accent bg-accent/10" : "border-border/50"}`}>
            <p className="text-primary">{f.name}{f.id === best.f.id ? " · best" : ""}</p>
            <p className="mt-1 text-muted-foreground">Fitness <span className="font-semibold text-primary">{r.fitness}</span> · base {r.base} · friction {r.friction}</p>
            <p className="text-muted-foreground">Teeth {f.teeth} · immunity {f.immunity} · pace {f.pace}</p>
          </li>
        ))}
        <li className="flex flex-wrap gap-2">
          {(["order", "fitness", "base"] as SortKey[]).map((k) => (
            <button key={k} type="button" className={choice(sort.key === k)} onClick={() => setSort({ key: k, desc: k !== "order" })}>Sort by {SORT_LABEL[k].toLowerCase()}</button>
          ))}
        </li>
      </ul>
      <Verdict tone={best.r.immunity || best.r.seat ? "warn" : "ok"}>
        {`${best.f.name} scores highest at ${best.r.fitness} (base ${best.r.base}${best.r.immunity ? `, less ${best.r.immunity} for unaddressed immunity` : ""}${best.r.seat ? `, less ${best.r.seat} for the seat` : ""}), leaving an enforcement friction of ${best.r.friction}. `}
        {best.r.immunity || best.r.seat ? "The operator drafts the waiver and a neutral seat before choosing the venue. " : "The clause is fully drafted. "}
        Check jurisdiction separately: a high score does not make a venue competent for the dispute.
      </Verdict>
      <Working formula={F_FORUM_F} steps={[`\\max(0,\\, ${best.r.base} - ${best.r.immunity} - ${best.r.seat})`]} result={String(best.r.fitness)} />
      <div className="flex justify-end"><CopySettings data={{ instrument: "forum", ...t }} /></div>
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
