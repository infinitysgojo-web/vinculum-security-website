import { useMemo } from "react";
import { BOND_NAMES, relationalDynamics, useEngine, type Signals } from "./engine";
import { Lex } from "./Lexicon";

const sub = "text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground";
const mono = "font-mono tabular-nums";

/**
 * Relational dynamics derivation: deficit, contagion, entropy and decay character.
 * Bonds come from the scores on this bench; shocks, friction, rupture and trend
 * are read from the MissionEngine bus. Browser-local arithmetic only.
 */
export default function RelationalDynamicsPanel({ scores }: { scores: [number, number, number, number] }) {
  const { signals } = useEngine();
  const s: Signals = useMemo(
    () => ({
      ...signals,
      bonds: { interpersonal: scores[0], communal: scores[1], intergenerational: scores[2], institutional: scores[3] },
    }),
    [signals, scores]
  );
  const d = relationalDynamics(s);
  if (!d) return null;
  const tone = d.character === "Systemic" ? "text-terracotta" : d.character === "None" ? "text-primary" : "text-brass";

  return (
    <div className="mt-6 bg-background border border-brass/40 p-4 sm:p-5 min-w-0 w-full max-w-full overflow-hidden">
      <p className="eyebrow">Relational dynamics</p>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />

      <p className={sub}><Lex term="deficit">Relational deficit</Lex> · Δrel = Σ max(0, 3.0 − Bᵢ)</p>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {d.deficits.map((x, i) => (
          <li key={i} className="min-w-0 border-l-2 border-brass/40 pl-2">
            <span className="block text-[10px] uppercase tracking-[0.14em] text-muted-foreground truncate">{BOND_NAMES[i]}</span>
            <span className={`${mono} ${x > 0 ? "text-terracotta" : "text-primary"}`}>d = {x.toFixed(1)}</span>
          </li>
        ))}
      </ul>
      <p className={`mt-2 font-serif text-primary text-lg ${mono}`}>Δrel = {d.deficit.toFixed(1)} of 8 · {d.deficitPct}%</p>

      <p className={`${sub} mt-6`}><Lex term="contagion">Relational contagion</Lex></p>
      <ul className="mt-2 space-y-1 text-sm">
        {d.contagionTerms.map((t) => (
          <li key={t.label} className="flex justify-between gap-3"><span className="text-muted-foreground min-w-0">{t.label}</span><span className={mono}>{t.value.toFixed(3)}</span></li>
        ))}
        <li className="flex justify-between gap-3"><span className="text-muted-foreground">× (1 + Δrel ÷ 8) ÷ 4.6 × 100</span><span className={mono}>{(1 + d.deficit / 8).toFixed(3)}</span></li>
      </ul>
      <p className={`mt-2 font-serif text-lg ${mono} ${d.contagion >= 75 ? "text-terracotta" : d.contagion >= 50 ? "text-brass" : "text-primary"}`}>C = {d.contagion}%</p>

      <p className={`${sub} mt-6`}><Lex term="entropy">Relational entropy</Lex> · H = −Σ pᵢ ln pᵢ ÷ ln 4</p>
      <p className={`mt-1 font-serif text-primary text-lg ${mono}`}>H = {d.entropy.toFixed(3)} · S = H × τ × Δrel ÷ 8 = {d.entropyIndex.toFixed(3)}</p>

      <p className={`${sub} mt-6`}><Lex term="decay">Decay discriminator</Lex> · Ω = H × k ÷ 4</p>
      <p className={`mt-1 font-serif text-lg ${tone}`}>
        <span className={mono}>Ω = {d.omega.toFixed(3)}</span> · k = {d.bondsInDeficit} · {d.character}
      </p>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
        {d.character === "None" && "No bond sits below the Viable floor, so there is no deficit-based decay to classify. A bond exactly at 3.0 still breaches the floor."}
        {d.character === "Acute" && "Decay is confined to one bond. A targeted remedy on that bond is proportionate."}
        {d.character === "Mixed" && "Decay touches two bonds without full diffusion. Remedy both, largest deficit first, and watch for spread."}
        {d.character === "Systemic" && "Decay is structural. Clearance locks until two covenants, one binding office continuity, are drafted."}
      </p>
    </div>
  );
}
