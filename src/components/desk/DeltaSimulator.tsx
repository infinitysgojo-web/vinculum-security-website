import { useEffect, useMemo, useState } from "react";
import { Sliders, RefreshCw, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { DOMAINS } from "@/content/cases";
import {
  bondBand,
  clampScore,
  communalTolerance,
  facadeSyndrome,
  mathReading,
  useEngine,
  type BondVector,
} from "./engine";
import { Lex } from "./Lexicon";

const KEYS: { key: keyof BondVector; name: string }[] = [
  { key: "interpersonal", name: DOMAINS[0] },
  { key: "communal", name: DOMAINS[1] },
  { key: "intergenerational", name: DOMAINS[2] },
  { key: "institutional", name: DOMAINS[3] },
];

const tuple = (b: BondVector): [number, number, number, number] => [b.interpersonal, b.communal, b.intergenerational, b.institutional];

/** Closed-form readings for one hypothetical vector. */
function read(b: BondVector) {
  const v = tuple(b);
  const m = mathReading(v);
  return {
    m,
    limiting: DOMAINS[m.limitingIndex] as string,
    facade: facadeSyndrome(v),
    tol: communalTolerance(b.communal),
  };
}

/**
 * Diplomatic Intervention "What-If" simulator. A sandbox: every slider moves a
 * hypothetical copy of the bond vector, and the same closed-form readings the
 * live desks use are recomputed beside the baseline. Nothing reaches the
 * MissionEngine until "Apply to live mission" is pressed.
 */
export default function DeltaSimulator({
  baseline,
  onApply,
}: {
  baseline: BondVector;
  onApply: (simulated: BondVector) => void;
}) {
  const { signals } = useEngine();
  const [sim, setSim] = useState<BondVector>({ ...baseline });

  // When the live baseline changes (apply, preset, archive, theatre switch) the sandbox re-bases on it.
  useEffect(() => {
    setSim({ ...baseline });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseline.interpersonal, baseline.communal, baseline.intergenerational, baseline.institutional]);

  const base = useMemo(() => read(baseline), [baseline]);
  const next = useMemo(() => read(sim), [sim]);
  const dirty = KEYS.some(({ key }) => sim[key] !== baseline[key]);

  const reset = () => setSim({ ...baseline });
  const update = (key: keyof BondVector, val: number) => setSim((p) => ({ ...p, [key]: clampScore(val) }));
  const apply = () => {
    onApply({ ...sim });
    toast.success("Simulated bond vector applied to the live mission");
  };

  const signed = (n: number) => (n > 0 ? `+${n.toFixed(1)}` : n.toFixed(1));
  const liveGap = signals.trackGap;
  const stat = "min-w-0 border border-brass/30 bg-muted/20 p-3";
  const statLabel = "block text-[9px] uppercase tracking-[0.18em] text-muted-foreground";

  return (
    <section className="border border-brass/50 bg-background/80 p-4 sm:p-5 w-full min-w-0 max-w-full">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brass/30 pb-3">
        <div className="flex items-center gap-2 min-w-0">
          <Sliders size={16} className="text-accent shrink-0" />
          <h4 className="font-serif text-primary text-base sm:text-lg leading-tight">
            Diplomatic intervention <Lex term="what-if">“what-if” simulator</Lex>
          </h4>
        </div>
        <button
          type="button"
          onClick={reset}
          disabled={!dirty}
          className="inline-flex items-center gap-1 min-h-9 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent disabled:opacity-40"
        >
          <RefreshCw size={12} /> Reset to baseline
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Test an intervention before it touches the mission, for example what happens if mediation lifts the communal bond
        from 1.4 to 2.4. The live bond scores above do not change until you apply.
      </p>

      <div className="delta-controls mt-4 grid gap-3">
        {KEYS.map(({ key, name }) => {
          const d = Math.round((sim[key] - baseline[key]) * 10) / 10;
          return (
            <div key={key} className={stat}>
              <div className="flex justify-between items-baseline gap-2 mb-1">
                <label htmlFor={`ds-${key}`} className="text-[10px] uppercase tracking-[0.14em] font-semibold text-primary min-w-0 [overflow-wrap:normal] [hyphens:none]">
                  {name}
                </label>
                <span className="font-mono text-xs text-accent font-semibold shrink-0">{sim[key].toFixed(1)}</span>
              </div>
              <input
                id={`ds-${key}`}
                type="range"
                min={1}
                max={5}
                step={0.1}
                value={sim[key]}
                onChange={(e) => update(key, parseFloat(e.target.value))}
                className="w-full min-h-6 accent-[hsl(var(--accent))]"
              />
              <div className="flex justify-between gap-2 text-[10px] text-muted-foreground mt-1">
                <span>Base {baseline[key].toFixed(1)} · {bondBand(baseline[key])}</span>
                <span className={d === 0 ? "" : d > 0 ? "text-primary font-semibold" : "text-destructive font-semibold"}>
                  {signed(d)}
                </span>
              </div>
              {bondBand(sim[key]) !== bondBand(baseline[key]) && (
                <p className="mt-1 text-[10px] font-semibold text-accent">
                  {bondBand(baseline[key])} → {bondBand(sim[key])}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="delta-readings mt-4 border-t border-brass/30 pt-4 grid gap-3 text-center">
        <div className={stat}>
          <span className={statLabel}><Lex term="liebig">Limiting factor</Lex></span>
          <p className="mt-1 font-serif text-sm [overflow-wrap:anywhere]">
            <span className="text-muted-foreground">{base.limiting}</span>
            <ArrowRight size={10} className="inline text-accent mx-1" />
            <span className="font-semibold text-accent">{next.limiting}</span>
          </p>
        </div>
        <div className={stat}>
          <span className={statLabel}>Vector mean μ</span>
          <p className="mt-1 font-mono text-sm">
            {base.m.mean.toFixed(2)} <ArrowRight size={10} className="inline text-accent mx-1" />
            <span className="font-semibold">{next.m.mean.toFixed(2)}</span>
          </p>
        </div>
        <div className={stat}>
          <span className={statLabel}><Lex term="variance">Spread variance σ²</Lex></span>
          <p className="mt-1 font-mono text-sm">
            {base.m.variance.toFixed(3)} <ArrowRight size={10} className="inline text-accent mx-1" />
            <span className={next.m.variance > 1.25 ? "text-destructive font-semibold" : "font-semibold text-primary"}>
              {next.m.variance.toFixed(3)}
            </span>
          </p>
        </div>
        <div className={stat}>
          <span className={statLabel}><Lex term="tolerance">Communal tolerance</Lex></span>
          <p className="mt-1 font-mono text-sm">
            {base.tol.phases} <ArrowRight size={10} className="inline text-accent mx-1" />
            <span className="font-semibold">{next.tol.phases}</span>
            <span className="font-sans text-[10px] text-muted-foreground"> phase{next.tol.phases === 1 ? "" : "s"}</span>
          </p>
          {liveGap !== undefined && (
            <p className="mt-1 text-[10px] text-muted-foreground">
              Live ΔT {liveGap}:{" "}
              <span className={liveGap > next.tol.phases ? "text-accent font-semibold" : "text-primary font-semibold"}>
                {liveGap > next.tol.phases ? "still a mirage" : "within tolerance"}
              </span>
            </p>
          )}
        </div>
        <div className={stat}>
          <span className={statLabel}>Nearest documented case</span>
          <p className="mt-1 font-serif text-sm [overflow-wrap:anywhere]">
            <span className="text-muted-foreground">{base.m.nearest.shortTitle}</span>
            <ArrowRight size={10} className="inline text-accent mx-1" />
            <span className="font-semibold text-accent">{next.m.nearest.shortTitle}</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-mono">
            {base.m.nearest.resonance}% → {next.m.nearest.resonance}%
          </p>
        </div>
        <div className={stat}>
          <span className={statLabel}>Structural facade</span>
          <p className="mt-1 text-sm">
            <span className="text-muted-foreground">{base.facade.engaged ? "Engaged" : "Clear"}</span>
            <ArrowRight size={10} className="inline text-accent mx-1" />
            <span className={next.facade.engaged ? "font-semibold text-destructive" : "font-semibold text-primary"}>
              {next.facade.engaged ? "Engaged" : "Clear"}
            </span>
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={apply}
        disabled={!dirty}
        className="mt-4 w-full sm:w-auto min-h-11 border border-accent bg-accent/10 px-5 py-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-40 disabled:hover:bg-accent/10 disabled:hover:text-accent"
      >
        {dirty ? "Apply to live mission" : "No change to apply"}
      </button>
    </section>
  );
}
