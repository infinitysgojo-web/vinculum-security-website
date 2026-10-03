import { useMemo } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { BOND_BANDS, BOND_NAMES, bondBand, distanceTable, facadeSyndrome, mathReading } from "./engine";

const sub = "text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground";
const mono = "font-mono tabular-nums";

/**
 * The full mathematical derivation of a bond profile (Section III of the deposition).
 * Pure deterministic arithmetic, computed in the browser from the four scores
 * passed in. Nothing is stored or transmitted.
 *
 *   mu_B      = (1/4) sum B_i
 *   sigma_B^2 = (1/4) sum (B_i - mu_B)^2
 *   d(B, C_k) = sqrt( sum (B_i - C_k,i)^2 )      R_k = (1 - d / 8) x 100%
 */
export default function BondMathPanel({ scores }: { scores: [number, number, number, number] }) {
  const m = useMemo(() => mathReading(scores), [scores]);
  const facade = useMemo(() => facadeSyndrome(scores), [scores]);
  const table = useMemo(() => distanceTable(scores), [scores]);
  const sd = Math.sqrt(m.variance);
  const limitingBand = bondBand(m.limitingScore);
  const liebigFails = m.limitingScore <= 2.0;
  const nearest = table.find((r) => r.nearest)!;

  return (
    <div className="bg-background border border-brass/40 p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full overflow-hidden">
      <p className="eyebrow">Mathematical reading</p>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />

      <p className={sub}>State vector</p>
      <p className={`mt-1 font-serif text-primary text-lg [overflow-wrap:anywhere]`}>
        B = (B₁, B₂, B₃, B₄) = ({m.vector.map((v) => v.toFixed(1)).join(", ")})
      </p>

      <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Composite mean μB</dt>
          <dd className="font-serif text-primary text-xl">{m.mean.toFixed(3)}</dd>
          <dd className="text-[11px] text-muted-foreground">μB = ¼ Σ Bᵢ · {bondBand(m.mean)} band</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Population variance σB²</dt>
          <dd className="font-serif text-primary text-xl">{m.variance.toFixed(3)}</dd>
          <dd className="text-[11px] text-muted-foreground">σB² = ¼ Σ (Bᵢ − μB)² · σB = {sd.toFixed(3)}</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Spread</dt>
          <dd className="font-serif text-primary text-xl">{m.spread.toFixed(1)}</dd>
          <dd className="text-[11px] text-muted-foreground">max Bᵢ − min Bᵢ</dd>
        </div>
        <div>
          <dt className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Liebig limiting factor</dt>
          <dd className="font-serif text-primary text-xl">{m.limitingScore.toFixed(1)}</dd>
          <dd className="text-[11px] text-muted-foreground [overflow-wrap:anywhere]">
            B_min = min Bᵢ · {BOND_NAMES[m.limitingIndex]} · {limitingBand}
          </dd>
        </div>
      </dl>
      <p className="mt-2 text-[11px] text-muted-foreground">
        Ties for the limiting factor go to the lower bond index.
      </p>

      {liebigFails && (
        <div role="alert" className="mt-4 border-l-2 border-terracotta bg-terracotta/10 pl-3 pr-2 py-2">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-terracotta">
            <AlertTriangle size={13} /> [LIEBIG LOCK FAILING]
          </p>
          <p className="mt-1 text-xs text-foreground/85">
            {BOND_NAMES[m.limitingIndex]} scores {m.limitingScore.toFixed(1)}, at or below 2.0. The weakest bond caps
            the whole continuum; strength elsewhere does not compensate for it.
          </p>
        </div>
      )}

      <hr className="gold-rule gold-rule-short mt-5 mb-4" />
      <p className={sub}>Structural Facade Syndrome check</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        Active if σB² &gt; 1.25 ∧ max(B) ≥ 4.0 ∧ min(B) ≤ 2.0
      </p>
      <ul className={`mt-2 grid gap-1 text-xs ${mono}`}>
        <li className={facade.tests.varianceAbove ? "text-terracotta" : "text-foreground/70"}>
          {facade.tests.varianceAbove ? "✓" : "✗"} σB² = {facade.variance.toFixed(3)} {facade.tests.varianceAbove ? ">" : "≤"} 1.25
        </li>
        <li className={facade.tests.maxAtLeast ? "text-terracotta" : "text-foreground/70"}>
          {facade.tests.maxAtLeast ? "✓" : "✗"} max(B) = {facade.max.toFixed(1)} {facade.tests.maxAtLeast ? "≥" : "<"} 4.0
        </li>
        <li className={facade.tests.minAtMost ? "text-terracotta" : "text-foreground/70"}>
          {facade.tests.minAtMost ? "✓" : "✗"} min(B) = {facade.min.toFixed(1)} {facade.tests.minAtMost ? "≤" : ">"} 2.0
        </li>
      </ul>
      {facade.engaged ? (
        <div role="alert" className="mt-3 border border-terracotta/60 bg-terracotta/10 px-3 py-2">
          <p className="flex items-start gap-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-terracotta">
            <AlertTriangle size={13} className="shrink-0 mt-px" />
            <span>[ENGAGED — Superficial Harmony Masking Severe Rupture]</span>
          </p>
        </div>
      ) : (
        <div className="mt-3 border border-brass/50 px-3 py-2">
          <p className="flex items-start gap-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary/80">
            <ShieldCheck size={13} className="shrink-0 mt-px" />
            <span>[SUPPRESSED — Continuum Coherent]</span>
          </p>
        </div>
      )}

      <hr className="gold-rule gold-rule-short mt-5 mb-4" />
      <p className={sub}>Resonance with the nearest canonical case</p>
      <p className="mt-1 font-serif text-primary text-lg">
        {nearest.shortTitle}
        {nearest.year ? ` (${nearest.year})` : ""} · {nearest.resonance.toFixed(1)}%
      </p>
      <p className="text-[11px] text-muted-foreground mt-1">
        d = √Σ(Bᵢ − Cᵢ)² = {nearest.distance.toFixed(3)} · Rₖ = (1 − d ÷ 8) × 100%
      </p>
      <Link
        to={`/cases/${nearest.slug}`}
        className="mt-3 inline-block text-[10px] uppercase tracking-[0.2em] font-semibold text-accent hover:underline"
      >
        Open {nearest.shortTitle} →
      </Link>

      <hr className="gold-rule gold-rule-short mt-5 mb-4" />
      <p className={sub}>Canonical distance table, all eight settlements</p>
      <p className="mt-1 text-[11px] text-muted-foreground">
        d(B, C<sub>k</sub>) = √Σ(Bᵢ − C<sub>k,i</sub>)² · R<sub>k</sub> = (1 − d ÷ 8) × 100%
      </p>
      <div className="mt-3 w-full max-w-full min-w-0 overflow-x-auto border border-border">
        <table className="w-full min-w-[30rem] border-collapse text-xs">
          <thead>
            <tr className="bg-primary text-primary-foreground text-left">
              <th className="px-2 py-2 font-serif font-medium">Case</th>
              <th className="px-2 py-2 font-serif font-medium">Year</th>
              <th className="px-2 py-2 font-serif font-medium text-center">(C₁, C₂, C₃, C₄)</th>
              <th className="px-2 py-2 font-serif font-medium text-right">d</th>
              <th className="px-2 py-2 font-serif font-medium text-right">Rₖ</th>
            </tr>
          </thead>
          <tbody>
            {table.map((r, i) => (
              <tr
                key={r.slug}
                className={`${r.nearest ? "bg-accent/15 font-semibold" : i % 2 === 0 ? "bg-background" : "bg-gold-tint"}`}
              >
                <td className="px-2 py-1.5 text-primary whitespace-nowrap">
                  <Link to={`/cases/${r.slug}`} className="hover:text-accent hover:underline">
                    {r.shortTitle}
                  </Link>
                  {r.nearest && (
                    <span className="ml-2 text-[9px] uppercase tracking-[0.14em] text-accent">Closest twin</span>
                  )}
                </td>
                <td className={`px-2 py-1.5 ${mono}`}>{r.year ?? "—"}</td>
                <td className={`px-2 py-1.5 text-center ${mono} whitespace-nowrap`}>
                  ({r.coords.map((c) => c.toFixed(1)).join(", ")})
                </td>
                <td className={`px-2 py-1.5 text-right ${mono}`}>{r.distance.toFixed(3)}</td>
                <td className={`px-2 py-1.5 text-right ${mono} text-accent`}>{r.resonance.toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground sm:hidden">Swipe the table sideways to read every column.</p>

      <hr className="gold-rule gold-rule-short mt-5 mb-4" />
      <p className={`${sub} mb-2`}>Canonical bond bands</p>
      <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-foreground/85">
        {BOND_BANDS.map((b) => (
          <li key={b.name} className={limitingBand === b.name ? "font-semibold text-accent" : ""}>
            {b.name} <span className="text-muted-foreground">{b.range}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
