import { useState } from "react";
import { Link } from "react-router-dom";
import { CASES, DOMAINS } from "@/content/cases";
import { LAND_PATH, SPHERE_PATH, MAP_W, MAP_H, COUNTRY_WORLD, PIN_XY } from "@/content/geo";

const PAD = 26;
const MAX_K = 9;

function zoomFor(slug: string | null) {
  if (!slug || !COUNTRY_WORLD[slug]) return { k: 1, x: 0, y: 0 };
  const [bx, by, bw, bh] = COUNTRY_WORLD[slug].bbox;
  const k = Math.min(MAP_W / (bw + PAD * 2), MAP_H / (bh + PAD * 2), MAX_K);
  return {
    k,
    x: MAP_W / 2 - (bx + bw / 2) * k,
    y: MAP_H / 2 - (by + bh / 2) * k,
  };
}

export default function RelationalAtlas() {
  const [active, setActive] = useState<string | null>(null);
  const current = CASES.find((c) => c.slug === active) ?? null;
  const { k, x, y } = zoomFor(active);

  return (
    <section aria-labelledby="atlas-title" className="mb-20">
      <p className="eyebrow">The Relational Atlas</p>
      <h2 id="atlas-title" className="font-serif text-primary text-3xl md:text-4xl mt-2">
        Where the doctrine has been tested
      </h2>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />
      <p className="text-foreground/80 max-w-3xl mb-6">
        Eight documented processes, set on an Equal Earth projection, the equal-area world map now
        used by United Nations cartography in place of Mercator. Select a marker to move in on the
        territory and read its bond record.
      </p>

      <div className="grid lg:grid-cols-[1fr_300px] gap-6 items-start">
        <div className="relative border border-brass/40 bg-navy-tint/30">
          <svg
            viewBox={`0 0 ${MAP_W} ${MAP_H}`}
            className="w-full h-auto block"
            role="img"
            aria-label="Equal Earth world map showing the eight documented cases"
          >
            <g
              style={{
                transform: `translate(${x}px, ${y}px) scale(${k})`,
                transformOrigin: "0 0",
                transition: "transform 800ms cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              <path d={SPHERE_PATH} className="fill-background stroke-brass" strokeOpacity={0.5} strokeWidth={1 / k} />
              <path
                d={LAND_PATH}
                className="fill-gold-tint stroke-brass"
                strokeOpacity={0.75}
                strokeWidth={0.6 / k}
                strokeLinejoin="round"
              />
              {current && COUNTRY_WORLD[current.slug] && (
                <path
                  d={COUNTRY_WORLD[current.slug].d}
                  className="fill-accent stroke-primary"
                  fillOpacity={0.28}
                  strokeWidth={1.2 / k}
                  strokeLinejoin="round"
                />
              )}
              {CASES.map((c) => {
                const p = PIN_XY[c.slug];
                if (!p) return null;
                const on = c.slug === active;
                const r = (on ? 5.5 : 6.5) / k;
                return (
                  <g
                    key={c.slug}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open ${c.shortTitle} on the map`}
                    onClick={() => setActive(on ? null : c.slug)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setActive(on ? null : c.slug);
                      }
                    }}
                    className="cursor-pointer outline-none"
                  >
                    <circle cx={p[0]} cy={p[1]} r={r * 2.6} className="fill-accent" fillOpacity={on ? 0.2 : 0.1} />
                    <circle
                      cx={p[0]}
                      cy={p[1]}
                      r={r}
                      className={on ? "fill-primary stroke-accent" : "fill-accent stroke-primary"}
                      strokeWidth={1.4 / k}
                    />
                    <text
                      x={p[0]}
                      y={p[1] - r * 2.9}
                      textAnchor="middle"
                      className="fill-primary font-serif pointer-events-none"
                      fontSize={(on ? 13 : 15) / k}
                      fontWeight={on ? 700 : 500}
                    >
                      {c.shortTitle}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {active && (
            <button
              type="button"
              onClick={() => setActive(null)}
              className="absolute top-3 left-3 bg-background/90 border border-brass/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary hover:text-accent hover:border-accent transition-colors"
            >
              ← Whole map
            </button>
          )}
        </div>

        <aside className="border border-border bg-card p-5 flex flex-col min-h-[280px]">
          {current ? (
            <>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                {current.region}
              </p>
              <h3 className="font-serif text-primary text-2xl mt-1 leading-tight">
                {current.shortTitle}
              </h3>
              <hr className="gold-rule gold-rule-short mt-3 mb-4" />
              <ul className="space-y-2.5">
                {DOMAINS.map((d, i) => (
                  <li key={d}>
                    <div className="flex justify-between text-[0.78rem] text-primary">
                      <span>{d}</span>
                      <span className="font-serif text-accent">{current.scores[i]} / 5</span>
                    </div>
                    <div className="h-1.5 bg-brass/30 mt-1">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${(current.scores[i] / 5) * 100}%` }}
                      />
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
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                Eight documented processes
              </p>
              <hr className="gold-rule gold-rule-short mt-3 mb-4" />
              <ul className="space-y-1.5">
                {CASES.map((c) => (
                  <li key={c.slug}>
                    <button
                      type="button"
                      onClick={() => setActive(c.slug)}
                      className="text-left w-full font-serif text-primary hover:text-accent transition-colors"
                    >
                      {c.shortTitle}
                    </button>
                  </li>
                ))}
              </ul>
              <p className="text-[0.82rem] leading-snug text-muted-foreground mt-auto pt-4">
                Select a marker or a name to move in on that territory.
              </p>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
