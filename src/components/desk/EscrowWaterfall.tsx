import { label } from "./DeskOutput";
import { ESCROW_FREEZE, escrowWaterfall } from "./instruments";

type Reading = ReturnType<typeof escrowWaterfall>;

/** Desk 11 sovereign escrow: three tranches released on conditions read from the bus. */
export default function EscrowWaterfall({ reading, shares, onShares }: {
  reading: Reading;
  shares: [number, number, number];
  onShares: (s: [number, number, number]) => void;
}) {
  const set = (i: number, v: number) => {
    const n = [...shares] as [number, number, number];
    n[i] = Math.max(0, Math.min(100, Math.round(v)));
    onShares(n);
  };
  return (
    <div className={`border bg-background p-4 min-w-0 ${reading.frozen ? "border-terracotta/60" : "border-brass/40"}`}>
      <span className={label}>Sovereign escrow · release waterfall</span>
      <p className="font-serif text-3xl text-primary">
        {reading.released}<span className="text-base text-muted-foreground">% of {reading.total}% released</span>
      </p>
      {reading.frozen && (
        <p role="alert" className="mt-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-terracotta">
          [Escrow frozen] Rupture index at or above {ESCROW_FREEZE}%
        </p>
      )}
      {reading.total !== 100 && <p className="mt-1 text-[11px] text-terracotta">Tranche shares total {reading.total}%, not 100%.</p>}
      <ul className="mt-3 space-y-2">
        {reading.tranches.map((t, i) => (
          <li key={t.id} className="flex items-center gap-3 text-xs">
            <span className={`w-4 text-center ${t.met ? "text-accent" : "text-muted-foreground"}`} aria-hidden>{t.met ? "✓" : "○"}</span>
            <span className="flex-1 min-w-0">
              <span className="block text-primary">{t.label}</span>
              <span className="block text-muted-foreground">{t.condition}</span>
            </span>
            <input type="number" min={0} max={100} value={t.share} onChange={(e) => set(i, Number(e.target.value))}
              aria-label={`${t.label} share in per cent`}
              className="w-16 min-h-9 border border-border bg-background px-2 text-right font-mono tabular-nums text-base sm:text-xs" />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[11px] text-muted-foreground font-mono [overflow-wrap:anywhere]">
        Released = Σ shareₖ for each met tranche; 0 while R ≥ {ESCROW_FREEZE}%
      </p>
    </div>
  );
}
