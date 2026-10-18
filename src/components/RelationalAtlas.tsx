import { useState, type KeyboardEvent } from "react";
import { Link } from "react-router-dom";
import { CASES, DOMAINS, type Region } from "@/content/cases";
import { LAND_PATH, SPHERE_PATH, MAP_W, MAP_H, COUNTRY_WORLD, PIN_XY } from "@/content/geo";

const PAD = 26;
const MIN_K = 1;
const MAX_K = 9;
const ZOOM_STEP = 1.5;
/** The canonical viable floor: 3.0 of 5.0, i.e. the 60% mark on every bond bar. */
const FLOOR = 3.0;

/**
 * Parallels in Equal Earth map space. The geometry was projected with d3-geo's
 * Equal Earth at scale 184.73, centred on (500, 243.5); parallels are straight
 * horizontal lines in this projection, so each needs only its y coordinate.
 */
const PARALLELS: { label: string; y: number }[] = [
  { label: "Tropic of Cancer", y: 157.1 },
  { label: "Equator", y: 243.5 },
  { label: "Tropic of Capricorn", y: 329.9 },
];

/** Nominal reference coordinates for each territory, shown in the frame badge. */
const COORDS: Record<string, string> = {
  "northern-ireland": "54°36′ N, 5°55′ W",
  colombia: "4°34′ N, 74°17′ W",
  cambodia: "12°34′ N, 104°59′ E",
  liberia: "6°26′ N, 9°26′ W",
  rwanda: "1°56′ S, 29°53′ E",
  kenya: "0°19′ N, 37°54′ E",
  "south-africa": "30°34′ S, 22°56′ E",
  "tuvalu-kiribati": "7°06′ S, 177°39′ E",
};

/** Historical span of each process, from the instrument to the close of the record. */
const SPAN: Record<string, string> = {
  "northern-ireland": "1998 to present",
  colombia: "2016 to present",
  cambodia: "2001 to 2022",
  liberia: "2005 to 2009",
  rwanda: "2002 to 2012",
  kenya: "2008 to 2012",
  "south-africa": "1995 to 2003",
  "tuvalu-kiribati": "2023 to present",
};

const REGION_ORDER: Region[] = ["Africa", "Latin America", "Europe", "Southeast Asia", "Pacific"];

// Keeps labels clear of the map edge and of neighbouring markers.
const LABEL_ANCHOR: Record<string, "start" | "middle" | "end"> = {
  "tuvalu-kiribati": "end",
  kenya: "start",
};
const LABEL_DX: Record<string, number> = {
  "tuvalu-kiribati": -12,
  kenya: 12,
  rwanda: -10,
};

type View = { k: number; x: number; y: number };

function zoomFor(slug: string | null): View {
  if (!slug || !COUNTRY_WORLD[slug]) return { k: 1, x: 0, y: 0 };
  const [bx, by, bw, bh] = COUNTRY_WORLD[slug].bbox;
  const k = Math.min(MAP_W / (bw + PAD * 2), MAP_H / (bh + PAD * 2), MAX_K);
  return clampView({ k, x: MAP_W / 2 - (bx + bw / 2) * k, y: MAP_H / 2 - (by + bh / 2) * k });
}

/** Keeps the map covering the frame at every scale, so no empty margin opens on any side. */
function clampView({ k, x, y }: View): View {
  const kk = Math.min(MAX_K, Math.max(MIN_K, k));
  return {
    k: kk,
    x: Math.min(0, Math.max(MAP_W - MAP_W * kk, x)),
    y: Math.min(0, Math.max(MAP_H - MAP_H * kk, y)),
  };
}

/** Rescales about the current centre of the frame. */
function rescale(v: View, factor: number): View {
  const cx = (MAP_W / 2 - v.x) / v.k;
  const cy = (MAP_H / 2 - v.y) / v.k;
  const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
  return clampView({ k, x: MAP_W / 2 - cx * k, y: MAP_H / 2 - cy * k });
}

const activate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

const ctrl =
  "min-h-8 min-w-8 sm:min-h-9 sm:min-w-9 bg-background/95 border border-brass/60 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:text-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-primary disabled:hover:border-brass/60";

export default function RelationalAtlas() {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<View>(zoomFor(null));
  const current = CASES.find((c) => c.slug === active) ?? null;
  const { k, x, y } = view;

  const select = (slug: string | null) => {
    setActive(slug);
    setView(zoomFor(slug));
  };
  const whole = () => select(null);
  const lit = hover ?? active;
  const isWhole = !active && k === 1;

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

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start min-w-0">
        {/* Diplomatic neatline: brass outer rule, hairline inner rule, graduation marks and the technical footnote. */}
        <figure className="m-0 min-w-0 border border-brass/50 p-1.5 sm:p-2 bg-card">
          <div className="relative border border-brass/30">
            <span aria-hidden className="pointer-events-none absolute left-1/2 -top-[7px] sm:-top-[9px] -translate-x-1/2 bg-card px-1 font-mono text-[9px] leading-none text-brass">N</span>
            <span aria-hidden className="pointer-events-none absolute left-1/2 -bottom-[7px] sm:-bottom-[9px] -translate-x-1/2 bg-card px-1 font-mono text-[9px] leading-none text-brass">S</span>
            <span aria-hidden className="pointer-events-none absolute top-1/2 -left-[7px] sm:-left-[9px] -translate-y-1/2 bg-card py-1 font-mono text-[9px] leading-none text-brass">W</span>
            <span aria-hidden className="pointer-events-none absolute top-1/2 -right-[7px] sm:-right-[9px] -translate-y-1/2 bg-card py-1 font-mono text-[9px] leading-none text-brass">E</span>

            {/* Graduation marks at the four cardinal points of the neatline. */}
            <span aria-hidden className="pointer-events-none absolute z-10 left-1/2 top-0 h-2 w-px bg-brass/60" />
            <span aria-hidden className="pointer-events-none absolute z-10 left-1/2 bottom-0 h-2 w-px bg-brass/60" />
            <span aria-hidden className="pointer-events-none absolute z-10 top-1/2 left-0 w-2 h-px bg-brass/60" />
            <span aria-hidden className="pointer-events-none absolute z-10 top-1/2 right-0 w-2 h-px bg-brass/60" />
            <div className="overflow-hidden bg-navy-tint/30">
              <svg
                viewBox={`0 0 ${MAP_W} ${MAP_H}`}
                className="w-full h-auto block"
                role="group"
                aria-label="Equal Earth world map showing the eight documented cases"
              >
                <defs>
                  <clipPath id="atlas-sphere">
                    <path d={SPHERE_PATH} />
                  </clipPath>
                </defs>
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
                  {/* Graticule: Equator and Tropics, hairline and dashed, held constant against zoom. */}
                  <g clipPath="url(#atlas-sphere)" aria-hidden>
                    {PARALLELS.map((p) => (
                      <line
                        key={p.label}
                        x1={0}
                        x2={MAP_W}
                        y1={p.y}
                        y2={p.y}
                        className="stroke-brass/25"
                        strokeWidth={0.8 / k}
                        strokeDasharray={`${2 / k},${4 / k}`}
                      />
                    ))}
                    <line x1={MAP_W / 2} x2={MAP_W / 2} y1={0} y2={MAP_H} className="stroke-brass/25" strokeWidth={0.8 / k} strokeDasharray={`${2 / k},${4 / k}`} />
                  </g>
                  {lit && COUNTRY_WORLD[lit] && (
                    <path
                      d={COUNTRY_WORLD[lit].d}
                      className={lit === active ? "fill-accent/30 stroke-primary/70" : "fill-accent/20 stroke-primary/50"}
                      strokeWidth={1.1 / k}
                      strokeLinejoin="round"
                    />
                  )}
                  {CASES.map((c) => {
                    const p = PIN_XY[c.slug];
                    if (!p) return null;
                    const on = c.slug === active;
                    const r = 6.5 / k;
                    const tick = 3.5 / k;
                    const hair = 0.9 / k;
                    return (
                      <g
                        key={c.slug}
                        tabIndex={0}
                        role="button"
                        aria-pressed={on}
                        aria-label={`${on ? "Close" : "Open"} ${c.shortTitle} on the map`}
                        onClick={() => select(on ? null : c.slug)}
                        onKeyDown={activate(() => select(on ? null : c.slug))}
                        onMouseEnter={() => setHover(c.slug)}
                        onMouseLeave={() => setHover(null)}
                        onFocus={() => setHover(c.slug)}
                        onBlur={() => setHover(null)}
                        className="group cursor-pointer outline-none"
                      >
                        {/* Generous hit area; invisible. */}
                        <circle cx={p[0]} cy={p[1]} r={r * 2.2} className="fill-transparent" />
                        {/* Focus ring for keyboard users. */}
                        <circle cx={p[0]} cy={p[1]} r={r * 1.9} className="fill-none stroke-primary opacity-0 group-focus-visible:opacity-100" strokeWidth={hair} strokeDasharray={`${1.5 / k},${1.5 / k}`} />
                        {/* Reticle: hairline ring, cardinal ticks, centre pip. */}
                        <circle cx={p[0]} cy={p[1]} r={r} className={on ? "fill-accent/15 stroke-primary" : "fill-background/60 stroke-accent/70"} strokeWidth={hair} />
                        <g className={on ? "stroke-primary" : "stroke-accent/70"} strokeWidth={hair}>
                          <line x1={p[0]} x2={p[0]} y1={p[1] - r - tick} y2={p[1] - r + tick * 0.6} />
                          <line x1={p[0]} x2={p[0]} y1={p[1] + r - tick * 0.6} y2={p[1] + r + tick} />
                          <line x1={p[0] - r - tick} x2={p[0] - r + tick * 0.6} y1={p[1]} y2={p[1]} />
                          <line x1={p[0] + r - tick * 0.6} x2={p[0] + r + tick} y1={p[1]} y2={p[1]} />
                        </g>
                        <circle cx={p[0]} cy={p[1]} r={1.9 / k} className={on ? "fill-accent" : "fill-primary"} />
                        <text
                          x={p[0] + (LABEL_DX[c.slug] ?? 0) / k}
                          y={p[1] - r - tick - 4 / k}
                          textAnchor={LABEL_ANCHOR[c.slug] ?? "middle"}
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
            </div>

            {/* Map controls, top-left. */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-wrap items-center gap-1" role="toolbar" aria-label="Map controls">
              <button type="button" className={ctrl} onClick={whole} disabled={isWhole} aria-label="Return to the whole map">
                ← <span className="hidden sm:inline">Whole map</span>
              </button>
              <button type="button" className={ctrl} onClick={() => setView((v) => rescale(v, ZOOM_STEP))} disabled={k >= MAX_K} aria-label="Zoom in">+</button>
              <button type="button" className={ctrl} onClick={() => setView((v) => rescale(v, 1 / ZOOM_STEP))} disabled={k <= MIN_K} aria-label="Zoom out">−</button>
              <span className="min-h-8 sm:min-h-9 inline-flex items-center bg-background/95 border border-brass/40 px-1.5 sm:px-2 font-mono text-[10px] text-primary" aria-live="polite" aria-label={`Scale ${k.toFixed(1)} times`}>
                {k.toFixed(1)}×
              </span>
            </div>

            {/* Coordinates badge, top-right. */}
            {lit && COORDS[lit] && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[55%] border border-brass/50 bg-background/95 px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-right">
                <p className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Nominal reference</p>
                <p className="font-mono text-[10px] sm:text-[11px] text-primary whitespace-nowrap">{COORDS[lit]}</p>
              </div>
            )}
          </div>
          <figcaption className="mt-1.5 px-1 text-center text-[8px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.22em] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
            Equal Earth projection · Pseudo-cylindrical equal-area (Winkel / Šavrič et al.) · UN cartographic standard
          </figcaption>
        </figure>

        {/* Dossier: docks directly beneath the map below the lg breakpoint. */}
        <aside className="border border-border bg-card p-5 flex flex-col min-h-[280px] min-w-0" aria-live="polite">
          {current ? (
            <>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                {current.region} · Section {current.ref}
              </p>
              <h3 className="font-serif text-primary text-2xl mt-1 leading-tight">{current.shortTitle}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="border border-primary/40 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-primary">Pillar · {current.pillar}</span>
                {current.threats[0] && (
                  <span className="border border-accent/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-accent">{current.threats[0]}</span>
                )}
                {SPAN[current.slug] && (
                  <span className="border border-brass/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{SPAN[current.slug]}</span>
                )}
              </div>
              <hr className="gold-rule gold-rule-short mt-3 mb-4" />
              <ul className="space-y-3">
                {DOMAINS.map((d, i) => {
                  const v = current.scores[i];
                  const decay = v < FLOOR;
                  return (
                    <li key={d}>
                      <div className="flex justify-between gap-2 text-[0.78rem] text-primary">
                        <span>{d}</span>
                        <span className={`font-serif ${decay ? "text-destructive" : "text-accent"}`}>{v} / 5</span>
                      </div>
                      <div className="relative h-1.5 bg-brass/30 mt-1">
                        <div className={`h-full transition-all ${decay ? "bg-destructive/70" : "bg-accent"}`} style={{ width: `${(v / 5) * 100}%` }} />
                        <span aria-hidden className="absolute -top-1 -bottom-1 w-px bg-primary" style={{ left: `${(FLOOR / 5) * 100}%` }} />
                      </div>
                      <div className="relative h-3 mt-0.5">
                        <span className="absolute -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground" style={{ left: `${(FLOOR / 5) * 100}%` }}>3.0 floor</span>
                      </div>
                      {decay && (
                        <p className="text-[0.72rem] leading-snug text-destructive">Below the viable floor: acute relational decay.</p>
                      )}
                    </li>
                  );
                })}
              </ul>
              <p className="text-[0.85rem] leading-snug text-foreground/80 mt-4">{current.pattern}</p>
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <Link
                  to={`/cases/${current.slug}`}
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
                >
                  Open the full case study →
                </Link>
                <Link
                  to="/dashboard"
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80 hover:text-accent hover:underline"
                >
                  Analyze in Live Chancellery Dashboard →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Eight documented processes</p>
              <hr className="gold-rule gold-rule-short mt-3 mb-4" />
              <div className="space-y-3">
                {REGION_ORDER.map((r) => {
                  const rows = CASES.filter((c) => c.region === r);
                  if (!rows.length) return null;
                  return (
                    <div key={r}>
                      <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground border-b border-border pb-1 mb-1">{r}</p>
                      <ul className="space-y-0.5">
                        {rows.map((c) => (
                          <li key={c.slug}>
                            <button
                              type="button"
                              onClick={() => select(c.slug)}
                              onKeyDown={activate(() => select(c.slug))}
                              onMouseEnter={() => setHover(c.slug)}
                              onMouseLeave={() => setHover(null)}
                              onFocus={() => setHover(c.slug)}
                              onBlur={() => setHover(null)}
                              className="text-left w-full min-h-9 font-serif text-primary hover:text-accent focus-visible:text-accent transition-colors"
                            >
                              {c.shortTitle}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <p className="text-[0.82rem] leading-snug text-muted-foreground">Select a marker or a name to move in on that territory.</p>
                <Link
                  to="/dashboard"
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80 hover:text-accent hover:underline"
                >
                  Analyze in Live Chancellery Dashboard →
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>
    </section>
  );
}
