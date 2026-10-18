import { CASES, DOMAINS, type CaseStudy } from "@/content/cases";

/** The canonical viable floor, 3.0 of 5.0. */
export const VIABLE_FLOOR = 3.0;

/** Mean score per bond domain across the eight documented processes, computed from the record itself. */
export const PROCESS_MEAN: [number, number, number, number] = [0, 1, 2, 3].map(
  (i) => CASES.reduce((a, c) => a + c.scores[i], 0) / CASES.length,
) as [number, number, number, number];

/** Mean of all thirty-two scores across the eight processes. */
export const GLOBAL_MEAN = PROCESS_MEAN.reduce((a, v) => a + v, 0) / 4;

const SIZE = 300;
const C = SIZE / 2;
const R = 104;
const SHORT = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];

/** Four axes: north, east, south, west. */
const point = (i: number, v: number) => {
  const a = -Math.PI / 2 + (i * Math.PI) / 2;
  const r = (v / 5) * R;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const poly = (vals: readonly number[]) => vals.map((v, i) => point(i, v).join(",")).join(" ");

export default function CaseRadar({ c }: { c: CaseStudy }) {
  return (
    <figure className="m-0 border border-brass/40 bg-card p-4 sm:p-5">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
        <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Comparative bond profile</span>
        <span className="font-mono text-[10px] text-muted-foreground">{c.shortTitle} against the eight-process mean</span>
      </figcaption>
      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_12rem] items-center">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          className="w-full max-w-[22rem] h-auto mx-auto block"
          role="img"
          aria-label={`Radar chart. ${c.shortTitle}: ${DOMAINS.map((d, i) => `${d} ${c.scores[i]}`).join(", ")}. Eight-process mean: ${DOMAINS.map((d, i) => `${d} ${PROCESS_MEAN[i].toFixed(2)}`).join(", ")}. Viable floor 3.0.`}
        >
          {[1, 2, 4, 5].map((v) => (
            <circle key={v} cx={C} cy={C} r={(v / 5) * R} className="fill-none stroke-brass/30" strokeWidth={0.6} />
          ))}
          {/* The canonical 3.0 viable floor. */}
          <circle cx={C} cy={C} r={(VIABLE_FLOOR / 5) * R} className="fill-none stroke-destructive/70" strokeWidth={0.9} strokeDasharray="3,3" />
          <text
            x={C - ((VIABLE_FLOOR / 5) * R) * Math.SQRT1_2 - 2}
            y={C + ((VIABLE_FLOOR / 5) * R) * Math.SQRT1_2 + 9}
            textAnchor="end"
            className="fill-destructive font-mono"
            fontSize={7}
            letterSpacing={0.8}
            stroke="hsl(var(--card))"
            strokeWidth={3}
            paintOrder="stroke"
          >
            3.0 FLOOR
          </text>
          {[0, 1, 2, 3].map((i) => {
            const [x, y] = point(i, 5);
            return <line key={i} x1={C} y1={C} x2={x} y2={y} className="stroke-brass/40" strokeWidth={0.6} />;
          })}
          <polygon points={poly(PROCESS_MEAN)} className="fill-primary/5 stroke-primary/70" strokeWidth={1} strokeDasharray="4,2" />
          <polygon points={poly(c.scores)} className="fill-accent/20 stroke-accent" strokeWidth={1.4} strokeLinejoin="round" />
          {c.scores.map((v, i) => {
            const [x, y] = point(i, v);
            return <circle key={i} cx={x} cy={y} r={2.6} className={v < VIABLE_FLOOR ? "fill-destructive" : "fill-accent"} />;
          })}
          {SHORT.map((label, i) => {
            const [x, y] = point(i, 5.75);
            return (
              <text
                key={label}
                x={x}
                y={y + (i === 0 ? 0 : i === 2 ? 8 : 3)}
                textAnchor={i === 1 ? "end" : i === 3 ? "start" : "middle"}
                className="fill-primary font-serif"
                fontSize={10.5}
              >
                {label}
              </text>
            );
          })}
        </svg>
        <div>
          <ul className="space-y-1.5 text-[0.8rem]">
            <li className="flex items-center gap-2">
              <span className="inline-block h-2.5 w-4 bg-accent/30 border border-accent" aria-hidden />
              <span className="text-primary">{c.shortTitle}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-0 w-4 border-t border-dashed border-primary/70" aria-hidden />
              <span className="text-primary">Eight-process mean</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="inline-block h-0 w-4 border-t border-dashed border-destructive/70" aria-hidden />
              <span className="text-primary">Viable floor, 3.0</span>
            </li>
          </ul>
          <table className="mt-3 w-full text-[0.75rem]">
            <thead>
              <tr className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                <th className="text-left font-normal pb-1">Bond</th>
                <th className="text-right font-normal pb-1">Case</th>
                <th className="text-right font-normal pb-1">Mean</th>
              </tr>
            </thead>
            <tbody>
              {SHORT.map((d, i) => (
                <tr key={d} className="border-t border-border">
                  <td className="py-1 text-primary">{d}</td>
                  <td className={`py-1 text-right font-mono ${c.scores[i] < VIABLE_FLOOR ? "text-destructive" : "text-accent"}`}>{c.scores[i].toFixed(1)}</td>
                  <td className="py-1 text-right font-mono text-muted-foreground">{PROCESS_MEAN[i].toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </figure>
  );
}
