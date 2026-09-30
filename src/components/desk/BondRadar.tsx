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
    <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6">
      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-4">
        {caption ?? "Four-bond radar and balance gauge"}
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Four bond radar">
          {rings.map((ring) => (
            <polygon
              key={ring}
              points={[0, 1, 2, 3].map((i) => pt(i, ring).join(",")).join(" ")}
              fill="none"
              stroke="hsl(var(--brass))"
              strokeOpacity={ring === 5 ? 0.55 : 0.2}
            />
          ))}
          {[0, 1, 2, 3].map((i) => {
            const [x, y] = pt(i, 5);
            return <line key={i} x1={c} y1={c} x2={x} y2={y} stroke="hsl(var(--brass))" strokeOpacity={0.25} />;
          })}
          <polygon points={poly} fill="hsl(var(--accent))" fillOpacity={0.22} stroke="hsl(var(--accent))" strokeWidth={2} />
          {scores.map((v, i) => {
            const [x, y] = pt(i, v);
            return <circle key={i} cx={x} cy={y} r={3.5} fill="hsl(var(--accent))" />;
          })}
          {BONDS.map((b, i) => {
            const [x, y] = pt(i, 6.1);
            return (
              <text
                key={b}
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize={9}
                letterSpacing={1}
                fill="hsl(var(--primary))"
                opacity={0.8}
              >
                {b.toUpperCase()}
              </text>
            );
          })}
        </svg>
        <div className="flex-1 space-y-3 text-sm w-full">
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
              <span className="w-6 text-right text-xs tabular-nums text-primary">{scores[i]}</span>
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
