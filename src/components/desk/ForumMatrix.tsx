import { label } from "./DeskOutput";
import { FORUMS, IMMUNITY_PENALTY, SEAT_PENALTY, forumFitness, type ForumTerms } from "./instruments";

/** Clause Architect: dispute forum enforceability matrix. Ratings are doctrinal ordinal judgements, 1 to 5. */
export default function ForumMatrix({ value, onChange, terms, onTerms }: {
  value: string;
  onChange: (id: string) => void;
  terms: ForumTerms;
  onTerms: (t: ForumTerms) => void;
}) {
  const chosen = FORUMS.find((f) => f.id === value) ?? FORUMS[0];
  const fit = forumFitness(chosen, terms);
  const toggle = "min-h-9 px-3 border text-[10px] uppercase tracking-[0.14em]";
  return (
    <div className="border border-brass/40 bg-background p-4 min-w-0">
      <span className={label}>Dispute forum · enforceability matrix</span>
      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Clause terms">
        <button type="button" aria-pressed={terms.immunityWaived} onClick={() => onTerms({ ...terms, immunityWaived: !terms.immunityWaived })}
          className={`${toggle} ${terms.immunityWaived ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
          Immunity waived
        </button>
        <button type="button" aria-pressed={terms.neutralSeat} onClick={() => onTerms({ ...terms, neutralSeat: !terms.neutralSeat })}
          className={`${toggle} ${terms.neutralSeat ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
          Neutral seat
        </button>
      </div>
      <div className="w-full overflow-x-auto">
        <table className="w-full min-w-[24rem] border-collapse text-xs">
          <thead>
            <tr className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
              <th className="text-left py-1 pr-2 font-semibold">Forum</th>
              <th className="py-1 px-1 font-semibold">Teeth</th>
              <th className="py-1 px-1 font-semibold">Immunity</th>
              <th className="py-1 px-1 font-semibold">Pace</th>
              <th className="py-1 px-1 text-right font-semibold">E</th>
              <th className="py-1 pl-1 text-right font-semibold">F</th>
            </tr>
          </thead>
          <tbody>
            {FORUMS.map((f) => {
              const r = forumFitness(f, terms);
              return (
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
                  <td className="text-right font-mono tabular-nums text-muted-foreground">{r.base}</td>
                  <td className="text-right font-mono tabular-nums text-primary">{r.fitness}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground font-mono [overflow-wrap:anywhere]">
        E = 100 × (0.5·teeth + 0.3·(6 − immunity) + 0.2·pace) ÷ 5 · F = E − {IMMUNITY_PENALTY} without an immunity waiver − {SEAT_PENALTY} without a neutral seat (not applied to the ICJ)
      </p>
      <p className="mt-2 text-xs text-primary">
        {chosen.name}: E {fit.base}{fit.immunity ? `, immunity −${fit.immunity}` : ""}{fit.seat ? `, seat −${fit.seat}` : ""}, fitness {fit.fitness} of 100.
      </p>
      <p className="mt-2 text-[11px] text-muted-foreground">{chosen.basis} · {chosen.route}</p>
      <p className="mt-2 text-[10px] text-muted-foreground">Ratings are doctrinal judgements on a 1 to 5 scale, not measured statistics.</p>
    </div>
  );
}
