import { useMemo } from "react";
import { Link } from "react-router-dom";
import { BOND_BANDS, BOND_NAMES, bondBand, mathReading } from "./engine";

/**
 * The mathematical reading of a bond profile. Pure arithmetic, computed in the
 * browser from the four scores passed in. Nothing is stored or transmitted.
 */
export default function BondMathPanel({ scores }: { scores: [number, number, number, number] }) {
  const m = useMemo(() => mathReading(scores), [scores]);
  const sd = Math.sqrt(m.variance);

  return (
    <div className="bg-background border border-brass/40 p-6 md:p-8">
      <p className="eyebrow">Mathematical reading</p>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />

      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">State vector</p>
      <p className="mt-1 font-serif text-primary text-lg [overflow-wrap:anywhere]">
        (b₁, b₂, b₃, b₄) = ({m.vector.map((v) => v.toFixed(1)).join(", ")})
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Mean score</dt>
          <dd className="font-serif text-primary text-xl">{m.mean.toFixed(2)}</dd>
          <dd className="text-[11px] text-muted-foreground">b̄ = Σbᵢ ÷ 4</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Variance</dt>
          <dd className="font-serif text-primary text-xl">{m.variance.toFixed(2)}</dd>
          <dd className="text-[11px] text-muted-foreground">σ² = Σ(bᵢ − b̄)² ÷ 4 · σ = {sd.toFixed(2)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Spread</dt>
          <dd className="font-serif text-primary text-xl">{m.spread.toFixed(1)}</dd>
          <dd className="text-[11px] text-muted-foreground">max bᵢ − min bᵢ</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Limiting factor</dt>
          <dd className="font-serif text-primary text-xl">{m.limitingScore.toFixed(1)}</dd>
          <dd className="text-[11px] text-muted-foreground [overflow-wrap:anywhere]">
            {BOND_NAMES[m.limitingIndex]} · {bondBand(m.limitingScore)}
          </dd>
        </div>
      </dl>

      <hr className="gold-rule gold-rule-short mt-5 mb-4" />
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
        Resonance with the nearest canonical case
      </p>
      <p className="mt-1 font-serif text-primary text-lg">
        {m.nearest.shortTitle} · {m.nearest.resonance}%
      </p>
      <p className="text-[11px] text-muted-foreground mt-1">
        d = √Σ(bᵢ − cᵢ)² = {m.nearest.distance.toFixed(2)} · resonance = 1 − d ÷ 8
      </p>
      <Link
        to={`/cases/${m.nearest.slug}`}
        className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] font-semibold text-accent hover:underline"
      >
        Open {m.nearest.shortTitle} →
      </Link>

      <hr className="gold-rule gold-rule-short mt-5 mb-4" />
      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground mb-2">Canonical bond bands</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/85">
        {BOND_BANDS.map((b) => (
          <li key={b.name} className={bondBand(m.limitingScore) === b.name ? "font-semibold text-accent" : ""}>
            {b.name} <span className="text-muted-foreground">{b.range}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
