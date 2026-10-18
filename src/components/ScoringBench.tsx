import { useId, useState } from "react";
import { DOMAINS } from "@/content/cases";
import { VIABLE_FLOOR, holdsFloor } from "@/components/desk/engine";

/**
 * Continuum Scoring Bench: a restrained, browser-local estimator for the
 * mathematical model. Four bond sliders (1.0 to 5.0, step 0.1) feed a live
 * readout of the viable floor target, the observed mean and the limiting
 * domain. Strictly local React state: nothing is published or stored.
 *
 * The floor test is the canonical one used by the 20-gate engine: a bond holds
 * the 3.0 viable floor only when it scores above it.
 */
const START: [number, number, number, number] = [3.6, 2.8, 3.2, 3.9];

export default function ScoringBench() {
  const [bonds, setBonds] = useState<[number, number, number, number]>(START);
  const baseId = useId();

  const mean = bonds.reduce((a, b) => a + b, 0) / bonds.length;
  const limiting = Math.min(...bonds);
  const limitingIndex = bonds.indexOf(limiting);
  const limitingDomain = DOMAINS[limitingIndex];
  const viable = holdsFloor(limiting);

  const set = (i: number, v: number) =>
    setBonds((prev) => {
      const next = [...prev] as [number, number, number, number];
      next[i] = Math.round(v * 10) / 10;
      return next;
    });

  return (
    <div className="border border-brass/50 bg-card/40 p-5 md:p-7" data-testid="scoring-bench">
      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Continuum Scoring Bench</p>
      <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
        Move each bond on the 1.0 to 5.0 scale. The bench computes in your browser only; nothing is sent or saved.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {DOMAINS.map((d, i) => {
          const id = `${baseId}-b${i}`;
          return (
            <div key={d} className="min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={id} className="font-serif text-primary">
                  {d}
                </label>
                <output htmlFor={id} className="font-mono text-sm tabular-nums text-foreground" data-testid={`bench-value-${i}`}>
                  {bonds[i].toFixed(1)}
                </output>
              </div>
              <input
                id={id}
                type="range"
                min={1}
                max={5}
                step={0.1}
                value={bonds[i]}
                onChange={(e) => set(i, Number(e.target.value))}
                className="mt-2 w-full accent-accent"
                data-testid={`bench-slider-${i}`}
                aria-valuetext={`${d} bond ${bonds[i].toFixed(1)} of 5`}
              />
            </div>
          );
        })}
      </div>

      <dl className="mt-6 grid grid-cols-1 sm:grid-cols-3 border-t border-border pt-4 gap-4 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Viable floor target</dt>
          <dd className="mt-1 font-mono tabular-nums text-primary" data-testid="bench-floor">{VIABLE_FLOOR.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Observed mean B̄</dt>
          <dd className="mt-1 font-mono tabular-nums text-primary" data-testid="bench-mean">{mean.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Limiting domain min(Bᵢ)</dt>
          <dd className="mt-1 font-mono tabular-nums text-primary" data-testid="bench-limiting">
            {limitingDomain} · {limiting.toFixed(1)}
          </dd>
        </div>
      </dl>

      <div
        role="status"
        aria-live="polite"
        data-testid="bench-status"
        data-state={viable ? "viable" : "breach"}
        className={
          viable
            ? "mt-5 border-l-2 border-accent bg-gold-tint px-4 py-3 text-sm text-foreground"
            : "mt-5 border-l-2 border-destructive bg-destructive/5 px-4 py-3 text-sm text-destructive"
        }
      >
        {viable
          ? "All bonds satisfy the viability threshold."
          : `Viable Floor Breach detected in ${limitingDomain}. Escalation gate engaged.`}
      </div>
      <p className="mt-3 text-xs text-muted-foreground">
        A bond holds the {VIABLE_FLOOR.toFixed(1)} viable floor only when it scores above it; a limiting bond at or below the
        floor engages the escalation gate.
      </p>
    </div>
  );
}
