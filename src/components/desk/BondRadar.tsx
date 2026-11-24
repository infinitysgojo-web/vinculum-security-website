import { useState } from "react";
const BONDS = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];

/**
 * Four-bond radar and balance gauge. Pure presentation: scores are 1 to 5
 * and everything is drawn in the browser from the numbers passed in.
 */
export default function BondRadar({
  scores,
  size = 260,
  caption,
}: {
  scores: [number, number, number, number];
  size?: number;
  caption?: string;
}) {
  const [inspected, setInspected] = useState<number | null>(null);
  const c = size / 2;
  const r = size / 2 - 42;
  const pt = (i: number, v: number) => {
    const a = (Math.PI * 2 * i) / 4 - Math.PI / 2;
    const d = (Math.max(0, Math.min(5, v)) / 5) * r;
    return [c + Math.cos(a) * d, c + Math.sin(a) * d] as const;
  };
  const poly = scores.map((v, i) => pt(i, v).join(",")).join(" ");
  const rings = [1, 2, 3, 4, 5];

  const lowest = scores.indexOf(Math.min(...scores));
  const spread = Math.max(...scores) - Math.min(...scores);
  const mean = scores.reduce((a, b) => a + b, 0) / 4;
  const balance =
    spread >= 2.5
      ? "Severe asymmetry. One level is carrying a settlement the others cannot hold."
      : spread >= 1.5
        ? "Uneven continuum. Strength in one level is masking exposure in another."
        : "Broadly even across the continuum.";
  const band =
    mean >= 4 ? "Sound" : mean >= 3 ? "Guarded" : mean >= 2 ? "Strained" : "Ruptured";

  return (
    <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6 min-w-0" data-testid="bond-radar">
      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-4">
        {caption ?? "Four-bond radar and balance gauge"}
      </p>
      <div className="flex flex-col lg:flex-row items-center gap-6">
        <svg width={size} height={size} className="max-w-full shrink-0 drop-shadow-sm" viewBox={`0 0 ${size} ${size}`} role="group" aria-label="Four bond radar">
          <defs>
            <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0.32" />
              <stop offset="70%" stopColor="hsl(var(--accent))" stopOpacity="0.14" />
              <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.02" />
            </radialGradient>
          </defs>
          {rings.map((ring) => (
            <polygon
              key={ring}
              points={[0, 1, 2, 3].map((i) => pt(i, ring).join(",")).join(" ")}
              fill={ring === 5 ? "rgba(0,0,0,0.18)" : "none"}
              stroke="hsl(var(--brass))"
              strokeOpacity={ring === 5 ? 0.65 : ring === 3 ? 0.35 : 0.2}
              strokeDasharray={ring === 3 ? "2 2" : undefined}
            />
          ))}
          {[0, 1, 2, 3].map((i) => {
            const [x, y] = pt(i, 5);
            return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="hsl(var(--brass))" strokeOpacity={0.3} strokeWidth={1} />;
          })}
          <polygon points={poly} fill="url(#radar-glow)" stroke="hsl(var(--accent))" strokeWidth={2.2} className="transition-all duration-300" />
          {scores.map((v, i) => {
            const [x, y] = pt(i, v);
            return <g key={i} role="button" tabIndex={0} aria-label={`${BONDS[i]} bond: ${v} of 5`} aria-pressed={inspected === i}
              className="cursor-pointer outline-none group" onPointerEnter={() => setInspected(i)} onFocus={() => setInspected(i)} onClick={() => setInspected(i)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setInspected(i); } }}>
              <title>{BONDS[i]}: {v} / 5</title>
              <circle cx={x} cy={y} r={14} fill="transparent" />
              {inspected === i && <circle cx={x} cy={y} r={9} fill="none" stroke="hsl(var(--accent))" strokeOpacity={0.5} strokeWidth={1} className="animate-ping" />}
              <circle cx={x} cy={y} r={inspected === i ? 6.5 : 4} fill="hsl(var(--accent))" stroke="hsl(var(--background))" strokeWidth={2} className="transition-all duration-200" />
            </g>;
          })}
          {BONDS.map((b, i) => {
            const [x, y] = pt(i, 5);
            return (
              <text
                key={b}
                x={i === 1 ? size - 4 : i === 3 ? 4 : x}
                y={i === 0 ? y - 14 : i === 2 ? y + 14 : y - 14}
                textAnchor={i === 1 ? "end" : i === 3 ? "start" : "middle"}
                dominantBaseline="middle"
                fontSize={9}
                letterSpacing={0}
                fill="hsl(var(--primary))"
                opacity={0.8}
              >
                {b.toUpperCase()}
              </text>
            );
          })}
        </svg>
        <div className="flex-1 min-w-0 space-y-3 text-sm w-full">
          <p className="min-h-8 font-mono text-xs tabular-nums text-primary" role="status">{inspected === null ? `Mean ${mean.toFixed(2)} · Spread ${spread.toFixed(2)}` : `${BONDS[inspected]}: ${scores[inspected]} / 5${scores[inspected] === Math.min(...scores) ? " · limiting bond" : ""}`}</p>
          <div className="flex items-baseline justify-between border-b border-brass/30 pb-2">
            <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">Overall band</span>
            <span className="font-serif text-xl text-primary">{band}</span>
          </div>
          {BONDS.map((b, i) => (
            <div key={b} className="flex items-center gap-3">
              <span className="w-32 shrink-0 text-xs text-muted-foreground">{b}</span>
              <div className="h-1.5 flex-1 bg-brass/20">
                <div className="h-full bg-accent" style={{ width: `${(scores[i] / 5) * 100}%` }} />
              </div>
              <span className="min-w-8 text-right text-xs tabular-nums text-primary">{scores[i]}</span>
            </div>
          ))}
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {balance} Weakest level: <span className="text-primary">{BONDS[lowest]}</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
