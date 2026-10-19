import { label } from "./DeskOutput";
import { FORUMS, enforceability } from "./instruments";

/** Desk 7 comparative dispute-forum bench. Ratings are doctrinal ordinal judgements, 1 to 5. */
export default function ForumMatrix({ value, onChange }: { value: string; onChange: (id: string) => void }) {
  const chosen = FORUMS.find((f) => f.id === value) ?? FORUMS[0];
  return (
    <div className="border border-brass/40 bg-background p-4 min-w-0">
      <span className={label}>Dispute forum · enforceability bench</span>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[22rem] border-collapse text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="text-left py-1 pr-2 font-semibold">Forum</th>
              <th className="py-1 px-1 font-semibold">Teeth</th>
              <th className="py-1 px-1 font-semibold">Immunity</th>
              <th className="py-1 px-1 font-semibold">Pace</th>
              <th className="py-1 pl-1 text-right font-semibold">E</th>
            </tr>
          </thead>
          <tbody>
            {FORUMS.map((f) => (
              <tr key={f.id} className={`border-t border-border ${f.id === chosen.id ? "bg-accent/10" : ""}`}>
                <td className="py-1.5 pr-2">
                  <button type="button" aria-pressed={f.id === chosen.id} onClick={() => onChange(f.id)}
                    className={`text-left min-h-9 ${f.id === chosen.id ? "text-accent font-semibold" : "text-primary hover:text-accent"}`}>
                    {f.name}
                  </button>
                </td>
                <td className="text-center font-mono tabular-nums">{f.teeth}</td>
                <td className="text-center font-mono tabular-nums">{f.immunity}</td>
                <td className="text-center font-mono tabular-nums">{f.pace}</td>
                <td className="text-right font-mono tabular-nums text-primary">{enforceability(f)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground font-mono [overflow-wrap:anywhere]">
        E = 100 × (0.5·teeth + 0.3·(6 − immunity) + 0.2·pace) ÷ 5
      </p>
      <p className="mt-3 text-[11px] text-muted-foreground">{chosen.basis} · {chosen.route}</p>
      <p className="mt-2 text-xs leading-relaxed text-foreground/85">{chosen.article}</p>
      <p className="mt-2 text-[10px] text-muted-foreground">Ratings are doctrinal judgements on a 1 to 5 scale, not measured statistics.</p>
    </div>
  );
}
