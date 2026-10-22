import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BOND_NAMES } from "./engine";
import { FLAG_LABEL, firstTrips, type TimelineFlag, type TimelineStep } from "./shockTimeline";

const FLAG_TONE: Record<TimelineFlag, string> = {
  SOVEREIGN_FLOOR: "border-terracotta text-terracotta",
  PROVISIONAL_PLEADINGS: "border-ochre text-ochre",
  ESCROW_FREEZE: "border-destructive text-destructive",
};
const FLAG_SHORT: Record<TimelineFlag, string> = { SOVEREIGN_FLOOR: "Floor 1.0", PROVISIONAL_PLEADINGS: "R ≥ 40", ESCROW_FREEZE: "R ≥ 60" };

/**
 * Deterministic temporal scrubber: T0 → TN, one shock per step. Drag the slider or use
 * Previous / Next; each step re-reads λ, the fracture window t_f and R, and the track marks
 * the exact step at which a threshold is first reached.
 */
export default function ShockTimelineScrubber({ steps, title, note }: { steps: TimelineStep[]; title: string; note?: string }) {
  const n = Math.max(0, steps.length - 1);
  const [t, setT] = useState(n);
  // Follow the package: a newly applied shock moves the head to full compound stress.
  useEffect(() => setT(n), [n]);
  if (steps.length === 0)
    return (
      <div className="border border-brass/40 bg-background p-4 text-xs text-muted-foreground" data-testid="shock-timeline">
        {title}: no bond vector on the bus yet.
      </div>
    );
  const cur = steps[Math.min(t, n)];
  const trips = firstTrips(steps);
  const btn = "inline-flex min-h-9 items-center gap-1 border border-brass/50 px-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-primary hover:border-accent disabled:opacity-40";
  return (
    <div className="border border-brass/40 bg-background p-4 min-w-0" data-testid="shock-timeline">
      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/80">{title}</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" className={btn} onClick={() => setT((x) => Math.max(0, x - 1))} disabled={t <= 0} aria-label="Previous step">
          <ChevronLeft size={12} /> Previous step
        </button>
        <button type="button" className={btn} onClick={() => setT((x) => Math.min(n, x + 1))} disabled={t >= n} aria-label="Next step">
          Next step <ChevronRight size={12} />
        </button>
        <span className="ml-auto font-mono text-xs text-primary tabular-nums">T{cur.t} of T{n}</span>
      </div>
      <input
        type="range"
        min={0}
        max={n}
        step={1}
        value={Math.min(t, n)}
        onChange={(e) => setT(Number(e.target.value))}
        aria-label="Timeline step"
        aria-valuetext={cur.label}
        className="mt-3 w-full accent-[hsl(var(--accent))]"
        disabled={n === 0}
      />
      <ol className="mt-1 flex w-full gap-0.5" aria-label="Threshold markers">
        {steps.map((s) => (
          <li key={s.t} className="flex-1 min-w-0">
            <button type="button" onClick={() => setT(s.t)} title={s.label}
              className={`block h-2 w-full ${s.t === cur.t ? "bg-accent" : s.flags.length ? "bg-terracotta/50" : "bg-brass/30"}`} aria-label={`Go to ${s.label}`} />
            <span className="block text-center font-mono text-[9px] text-muted-foreground">{s.t}</span>
          </li>
        ))}
      </ol>
      {Object.keys(trips).length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-1.5" aria-label="Thresholds first reached">
          {(Object.entries(trips) as [TimelineFlag, number][]).map(([f, at]) => (
            <li key={f}>
              <button type="button" onClick={() => setT(at)} className={`min-h-8 border px-2 text-[10px] uppercase tracking-[0.12em] font-semibold ${FLAG_TONE[f]}`} title={FLAG_LABEL[f]}>
                {FLAG_SHORT[f]} · trips at T{at}
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-3 border-t border-border pt-3">
        <p className="text-sm text-primary [overflow-wrap:anywhere]">{cur.label}</p>
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
          {cur.bonds.map((b, i) => (
            <div key={BOND_NAMES[i]} className="border border-border p-2 min-w-0">
              <p className="truncate text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{BOND_NAMES[i]}</p>
              <p className={`font-mono text-base tabular-nums ${b <= 1 ? "text-terracotta" : "text-primary"}`}>{b.toFixed(1)}</p>
            </div>
          ))}
        </div>
        <dl className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 font-mono text-[11px] tabular-nums">
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">B̄</dt><dd className="text-primary">{cur.meanBond.toFixed(2)}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">R</dt><dd className={cur.rupture !== null && cur.rupture >= 60 ? "text-destructive" : "text-primary"}>{cur.rupture ?? "—"}</dd></div>
          {cur.strain !== undefined && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">Strain</dt><dd className="text-primary">{cur.strain}</dd></div>}
          {cur.exposure !== undefined && <div className="flex justify-between gap-2"><dt className="text-muted-foreground">U</dt><dd className="text-primary">{cur.exposure}</dd></div>}
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">λ</dt><dd className="text-primary">{cur.lambda === null ? "—" : cur.lambda.toFixed(4)}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">t½</dt><dd className="text-primary">{cur.halfLifeDays === null ? "∞" : `${cur.halfLifeDays} d`}</dd></div>
          <div className="flex justify-between gap-2"><dt className="text-muted-foreground">t_f</dt><dd className="text-primary">{cur.fractureDays === null ? "∞" : `${cur.fractureDays} d`}</dd></div>
        </dl>
        {cur.flags.length > 0 && (
          <ul className="mt-2 space-y-1" role="status">
            {cur.flags.map((f) => (
              <li key={f} className={`border-l-2 pl-2 text-[11px] ${FLAG_TONE[f]}`}>
                {FLAG_LABEL[f]}{cur.tripped.includes(f) ? " · first reached at this step" : ""}
              </li>
            ))}
          </ul>
        )}
      </div>
      {note && <p className="mt-2 text-[10px] text-muted-foreground">{note}</p>}
    </div>
  );
}
