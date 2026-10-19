import { label } from "./DeskOutput";
import { ESCROW_FREEZE, escrowWaterfall, type EscrowTerms } from "./instruments";

type Reading = ReturnType<typeof escrowWaterfall>;

const pct = (n: number) => (Number.isInteger(n) ? `${n}` : n.toFixed(1));

/** Desk 07: Conditional Escrow Waterfall, four milestone tranches released in order on conditions read from the bus. */
export default function EscrowWaterfall({ reading, terms, onTerms }: {
  reading: Reading;
  terms: EscrowTerms;
  onTerms: (t: EscrowTerms) => void;
}) {
  const clamp = (v: number, hi: number) => Math.max(0, Math.min(hi, Math.round(Number.isFinite(v) ? v : 0)));
  const setShare = (i: number, v: number) => {
    const shares = [...terms.shares] as EscrowTerms["shares"];
    shares[i] = clamp(v, 100);
    onTerms({ ...terms, shares });
  };
  const input = "w-16 min-h-9 border border-border bg-background px-2 text-right font-mono tabular-nums text-base sm:text-xs";
  return (
    <div className={`border bg-background p-4 min-w-0 ${reading.frozen ? "border-terracotta/60" : "border-brass/40"}`}>
      <span className={label}>Conditional escrow · release waterfall</span>
      <p className="font-serif text-3xl text-primary">
        {pct(reading.released)}<span className="text-base text-muted-foreground">% of {reading.total}% released</span>
      </p>
      {reading.frozen && (
        <p role="alert" className="mt-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-terracotta">
          [Escrow frozen] Rupture index at or above {ESCROW_FREEZE}%; {pct(reading.gross)}% of met tranches held
        </p>
      )}
      {reading.total !== 100 && <p className="mt-1 text-[11px] text-terracotta">Tranche shares total {reading.total}%, not 100%.</p>}
      <div className="mt-3 flex h-3 w-full border border-border" role="img" aria-label={`${pct(reading.released)} per cent released, ${pct(reading.clawbackHeld + reading.bondHeld)} per cent held in reserve`}>
        <div className={reading.frozen ? "bg-terracotta/40" : "bg-accent"} style={{ width: `${reading.frozen ? reading.gross : reading.released}%` }} />
        {!reading.frozen && <div className="bg-brass/50" style={{ width: `${reading.clawbackHeld + reading.bondHeld}%` }} />}
      </div>
      <ol className="mt-3 space-y-3">
        {reading.tranches.map((t, i) => (
          <li key={t.id} className="text-xs">
            <div className="flex items-center gap-3">
              <span className="flex-1 min-w-0">
                <span className="block text-primary">{t.label}</span>
                <span className="block text-muted-foreground">{t.met ? (reading.frozen ? "Cleared, held by freeze" : "Cleared") : "Pending"} · {t.condition}</span>
              </span>
              <input type="number" min={0} max={100} value={t.share} onChange={(e) => setShare(i, Number(e.target.value))}
                aria-label={`${t.label} share in per cent`} className={input} />
            </div>
            <div className="mt-1 h-1.5 w-full bg-border" aria-hidden>
              <div className={`h-full ${t.met ? (reading.frozen ? "bg-terracotta/60" : "bg-accent") : "bg-transparent"}`} style={{ width: t.met ? "100%" : "0%" }} />
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
        <label className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Clawback reserve, % of each release</span>
          <input type="number" min={0} max={50} value={terms.clawback} onChange={(e) => onTerms({ ...terms, clawback: clamp(Number(e.target.value), 50) })} className={input} />
        </label>
        <label className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground">Performance bond, % of pledge</span>
          <input type="number" min={0} max={25} value={terms.bond} onChange={(e) => onTerms({ ...terms, bond: clamp(Number(e.target.value), 25) })} className={input} />
        </label>
      </div>
      {!reading.frozen && reading.gross > 0 && (
        <p className="mt-2 text-[11px] text-muted-foreground">
          {reading.ceded
            ? "Final Cession met: clawback reserve and performance bond discharged."
            : `Met ${pct(reading.gross)}%; held ${pct(reading.clawbackHeld)}% clawback and ${pct(reading.bondHeld)}% bond until Final Cession.`}
        </p>
      )}
      <details className="mt-3 border-t border-border pt-2 text-[11px]">
        <summary className="cursor-pointer min-h-9 flex items-center text-primary">Formulae and clearing criteria</summary>
        <ul className="mt-1 space-y-1 font-mono text-muted-foreground [overflow-wrap:anywhere]">
          <li>A tranche clears only when its criterion holds and every earlier tranche has cleared.</li>
          <li>Gross = Σ share_k for cleared tranches</li>
          <li>Before Final Cession: Released = Gross × (1 − clawback) − performance bond, floor 0</li>
          <li>At Final Cession: Released = Gross; clawback reserve and performance bond discharged</li>
          <li>Emergency freeze: Released = 0 while R ≥ {ESCROW_FREEZE}%</li>
        </ul>
      </details>
    </div>
  );
}
