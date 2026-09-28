import { useState } from "react";
import { Link } from "react-router-dom";
import { CASES, DOMAINS } from "@/content/cases";

// Approximate [longitude, latitude] for each documented case.
const COORDS: Record<string, [number, number]> = {
  "northern-ireland": [-6.5, 54.6],
  colombia: [-74, 4.6],
  cambodia: [104.9, 12.5],
  liberia: [-10.8, 6.4],
  rwanda: [29.9, -1.9],
  kenya: [37.9, 0],
  "south-africa": [25, -29],
  "tuvalu-kiribati": [176, -4],
};

const W = 1000;
const H = 320;
const LABEL: Record<string, [number, number, "start" | "middle" | "end"]> = {
  "northern-ireland": [0, 34, "middle"],
  rwanda: [-14, 30, "end"],
  kenya: [14, -14, "start"],
  "tuvalu-kiribati": [0, -22, "end"],
};
const project = ([lon, lat]: [number, number]) => [
  ((lon + 180) / 360) * W,
  ((62 - lat) / 100) * H,
];

type Lens = "all" | 0 | 1 | 2 | 3;

export default function RelationalAtlas() {
  const [lens, setLens] = useState<Lens>("all");
  const [active, setActive] = useState<string>(CASES[0].slug);
  const current = CASES.find((c) => c.slug === active) ?? CASES[0];

  const value = (scores: number[]) =>
    lens === "all" ? scores.reduce((a, b) => a + b, 0) / scores.length : scores[lens];

  return (
    <section aria-labelledby="atlas-title" className="mb-16">
      <p className="eyebrow">The Relational Atlas</p>
      <h2 id="atlas-title" className="font-serif text-primary text-3xl md:text-4xl mt-2">
        Where the doctrine has been tested
      </h2>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />
      <p className="text-foreground/80 max-w-3xl mb-6">
        Each point is a documented case. Choose a bond domain to read the map through it: the
        stronger the observed bond, the fuller the mark. Select a point to see its profile.
      </p>

      <div className="flex gap-2 flex-wrap mb-5" role="group" aria-label="Bond domain lens">
        {(["all", 0, 1, 2, 3] as Lens[]).map((l) => (
          <button
            key={String(l)}
            type="button"
            aria-pressed={lens === l}
            onClick={() => setLens(l)}
            className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.2em] transition-colors ${
              lens === l
                ? "bg-primary text-primary-foreground border-primary"
                : "text-primary border-brass/50 hover:border-accent hover:text-accent"
            }`}
          >
            {l === "all" ? "All four bonds" : DOMAINS[l]}
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="border border-brass/40 bg-navy-tint/40 p-3 flex items-center">
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto" role="img" aria-label="Map of documented cases">
            {[...Array(13)].map((_, i) => (
              <line key={`v${i}`} x1={(i * W) / 12} x2={(i * W) / 12} y1={0} y2={H} className="stroke-brass" strokeOpacity={0.25} strokeWidth={0.6} />
            ))}
            {[...Array(7)].map((_, i) => (
              <line key={`h${i}`} x1={0} x2={W} y1={(i * H) / 6} y2={(i * H) / 6} className="stroke-brass" strokeOpacity={0.25} strokeWidth={0.6} />
            ))}
            <line x1={0} x2={W} y1={(62 / 100) * H} y2={(62 / 100) * H} className="stroke-accent" strokeOpacity={0.4} strokeDasharray="4 6" />
            <text x={8} y={(62 / 100) * H - 6} className="fill-primary" fillOpacity={0.5} fontSize={11} letterSpacing={2}>EQUATOR</text>
            {CASES.map((c) => {
              const coord = COORDS[c.slug];
              if (!coord) return null;
              const [x, y] = project(coord);
              const v = value(c.scores);
              const on = c.slug === active;
              return (
                <g
                  key={c.slug}
                  tabIndex={0}
                  role="button"
                  aria-label={`${c.shortTitle}, score ${v.toFixed(1)} of 5`}
                  onClick={() => setActive(c.slug)}
                  onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setActive(c.slug)}
                  className="cursor-pointer outline-none"
                >
                  <circle cx={x} cy={y} r={on ? 22 : 16} className="fill-brass" fillOpacity={0.15} />
                  <circle cx={x} cy={y} r={7 + v * 1.6} className="fill-accent stroke-primary" fillOpacity={0.15 + (v / 5) * 0.8} strokeWidth={on ? 2 : 0.8} />
                  <text x={x + (LABEL[c.slug]?.[0] ?? 0)} y={LABEL[c.slug] ? y + LABEL[c.slug][1] : y - 18 - v} textAnchor={LABEL[c.slug]?.[2] ?? "middle"} className="fill-primary font-serif" fontSize={14} fontWeight={on ? 700 : 500}>
                    {c.shortTitle}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <aside className="border border-border bg-card p-5 flex flex-col">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">{current.region}</p>
          <h3 className="font-serif text-primary text-2xl mt-1 leading-tight">{current.shortTitle}</h3>
          <hr className="gold-rule gold-rule-short mt-3 mb-4" />
          <ul className="space-y-3">
            {DOMAINS.map((d, i) => (
              <li key={d}>
                <div className="flex justify-between text-[0.8rem] text-primary">
                  <span>{d}</span>
                  <span className="font-serif text-accent">{current.scores[i]} / 5</span>
                </div>
                <div className="h-1.5 bg-brass/30 mt-1">
                  <div className="h-full bg-accent transition-all" style={{ width: `${(current.scores[i] / 5) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
          <p className="text-[0.85rem] leading-snug text-foreground/80 mt-4">{current.pattern}</p>
          <Link
            to={`/cases/${current.slug}`}
            className="mt-auto pt-4 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
          >
            Open the full case study →
          </Link>
        </aside>
      </div>

      <div className="overflow-x-auto mt-6 border border-border">
        <table className="w-full text-sm border-collapse">
          <caption className="sr-only">Bond integrity heat grid across all documented cases</caption>
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="px-3 py-2 text-left font-serif font-medium">Case</th>
              {DOMAINS.map((d) => (
                <th key={d} className="px-2 py-2 font-serif font-medium text-center">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CASES.map((c) => (
              <tr
                key={c.slug}
                onClick={() => setActive(c.slug)}
                className={`cursor-pointer ${c.slug === active ? "outline outline-1 outline-accent" : ""}`}
              >
                <td className="px-3 py-2 font-medium text-primary whitespace-nowrap bg-background">{c.shortTitle}</td>
                {c.scores.map((s, j) => (
                  <td key={j} className="p-0 text-center relative">
                    <span className="absolute inset-0 bg-accent" style={{ opacity: 0.08 + (s / 5) * 0.6 }} aria-hidden />
                    <span className="relative font-serif text-primary">{s}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
