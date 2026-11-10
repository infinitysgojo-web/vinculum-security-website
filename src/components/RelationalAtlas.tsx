import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import { holdsFloor } from "@/components/desk/engine";
import { CASES, DOMAINS, type CaseStudy, type Region } from "@/content/cases";
import { LAND_PATH, SPHERE_PATH, MAP_W, MAP_H, COUNTRY_WORLD, PIN_XY } from "@/content/geo";
import { tick, soundEnabled, setSoundEnabled, onSoundChange } from "@/lib/chancelleryHaptics";
import {
  MERIDIANS,
  NAMED_PARALLELS,
  LAT_TICKS,
  LON_TICKS,
  KM_PER_UNIT,
  parallelExtent,
  invert,
  dms,
  niceKm,
} from "@/components/atlasGeo";

const PAD = 26;
const MIN_K = 1;
const MAX_K = 9;
const ZOOM_STEP = 1.5;
const PAN_STEP = 60;
/** The canonical viable floor: 3.0 of 5.0, i.e. the 60% mark on every bond bar. */
const FLOOR = 3.0;

/** Monospace territory sigils (ISO 3166 alpha-3 where one applies). */
const SIGIL: Record<string, string> = {
  "northern-ireland": "NIR",
  colombia: "COL",
  cambodia: "KHM",
  liberia: "LBR",
  rwanda: "RWA",
  kenya: "KEN",
  "south-africa": "ZAF",
  "tuvalu-kiribati": "TUV",
};

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

// Keeps names clear of the map edge and of neighbouring markers.
const LABEL_ANCHOR: Record<string, "start" | "middle" | "end"> = { "tuvalu-kiribati": "end", kenya: "start" };
const LABEL_DX: Record<string, number> = { "tuvalu-kiribati": -12, kenya: 12, rwanda: -10 };

/** Mean of all thirty-two scores across the eight processes, computed from the record. */
const GLOBAL_MEAN = CASES.reduce((a, c) => a + c.scores.reduce((x, y) => x + y, 0), 0) / (CASES.length * 4);

const breaches = (c: CaseStudy) => c.scores.some((v) => v < FLOOR);

type View = { k: number; x: number; y: number };

/** Keeps the map covering the frame at every scale, so no empty margin opens on any side. */
function clampView({ k, x, y }: View): View {
  const kk = Math.min(MAX_K, Math.max(MIN_K, k));
  return {
    k: kk,
    x: Math.min(0, Math.max(MAP_W - MAP_W * kk, x)),
    y: Math.min(0, Math.max(MAP_H - MAP_H * kk, y)),
  };
}

function zoomFor(slug: string | null): View {
  if (!slug || !COUNTRY_WORLD[slug]) return { k: 1, x: 0, y: 0 };
  const [bx, by, bw, bh] = COUNTRY_WORLD[slug].bbox;
  const k = Math.min(MAP_W / (bw + PAD * 2), MAP_H / (bh + PAD * 2), MAX_K);
  return clampView({ k, x: MAP_W / 2 - (bx + bw / 2) * k, y: MAP_H / 2 - (by + bh / 2) * k });
}

/** Rescales about the current centre of the frame. */
function rescale(v: View, factor: number): View {
  const cx = (MAP_W / 2 - v.x) / v.k;
  const cy = (MAP_H / 2 - v.y) / v.k;
  const k = Math.min(MAX_K, Math.max(MIN_K, v.k * factor));
  return clampView({ k, x: MAP_W / 2 - cx * k, y: MAP_H / 2 - cy * k });
}

const pan = (v: View, dx: number, dy: number) => clampView({ ...v, x: v.x + dx, y: v.y + dy });

const activate = (fn: () => void) => (e: KeyboardEvent) => {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    fn();
  }
};

const ctrl =
  "min-h-8 min-w-8 sm:min-h-9 sm:min-w-9 bg-background/95 border border-brass/60 px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:text-accent hover:border-accent transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:text-primary disabled:hover:border-brass/60 aria-pressed:border-accent aria-pressed:text-accent";

/* ------------------------------------------------------------------ */
/* The map itself                                                      */
/* ------------------------------------------------------------------ */

type MapProps = {
  idp: string;
  view: View;
  active: string | null;
  lit: string | null;
  showGrid: boolean;
  onPin: (slug: string) => void;
  onHover: (slug: string | null) => void;
  onPointer?: (mx: number, my: number) => void;
};

function AtlasSvg({ idp, view, active, lit, showGrid, onPin, onHover, onPointer }: MapProps) {
  const { k, x, y } = view;
  const hair = 0.6 / k;
  const furniture = k < 1.4 ? 1 : 0;
  // The engraved waterlines are masked strokes of the whole coastline: costly to repaint on
  // every animation frame. They are lifted while the map moves and re-engraved once it settles.
  // `rest` is the view the map last came to rest at. While the live view differs, the map is
  // in motion, decided in the same render as the click, so the costly layer is never painted
  // at the new scale before it is lifted.
  const [rest, setRest] = useState<View>(view);
  const settled = rest.k === k && rest.x === x && rest.y === y;
  useEffect(() => {
    if (settled) return;
    const t = window.setTimeout(() => setRest({ k, x, y }), 760);
    return () => window.clearTimeout(t);
  }, [settled, k, x, y]);
  return (
    <div
      className="absolute inset-0 overflow-hidden text-primary select-none"
      onMouseMove={
        onPointer
          ? (e) => {
              const r = e.currentTarget.getBoundingClientRect();
              const sx = ((e.clientX - r.left) / r.width) * MAP_W;
              const sy = ((e.clientY - r.top) / r.height) * MAP_H;
              onPointer((sx - x) / k, (sy - y) / k);
            }
          : undefined
      }
    >
    {/* Only the beacons take the pointer. Hit-testing the full coastline path while the map moves
        under a resting cursor costs whole seconds per frame, so the cartography is inert. */}
    {/* The zoom moves an HTML layer, not an SVG group, so the browser composites the motion
        on the GPU instead of repainting the coastline on every frame. */}
    <div
      className="absolute inset-0"
      style={{
        transform: `translate(${(x / MAP_W) * 100}%, ${(y / MAP_H) * 100}%) scale(${k})`,
        transformOrigin: "0 0",
        transition: "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)",
        willChange: settled ? "auto" : "transform",
      }}
    >
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="w-full h-full block overflow-visible pointer-events-none"
      role="group"
      aria-label="Equal Earth world map showing the eight documented cases"
    >
      <defs>
        <clipPath id={`${idp}-sphere`}>
          <path d={SPHERE_PATH} />
        </clipPath>
        <filter id={`${idp}-lift`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.6" stdDeviation="0.9" floodOpacity="0.28" />
        </filter>
      </defs>

      <g>
        <path d={SPHERE_PATH} className="fill-background stroke-brass" strokeOpacity={0.5} strokeWidth={1 / k} />

        {/* Engraved waterlines 2, 5 and 9 screen units off every coast, held constant against zoom.
            Each is a dashed coastal stroke whose inner half is overprinted in the ocean tone, leaving
            one dashed contour; the land is then laid over the inner side. No masks, so it paints fast. */}
        {settled && (
          <g clipPath={`url(#${idp}-sphere)`} aria-hidden>
            {[9, 5, 2].map((d) => (
              <g key={d}>
                <path d={LAND_PATH} fill="none" stroke="currentColor" strokeOpacity={0.08} strokeWidth={(d * 2 + 0.7) / k} strokeDasharray={`${2 / k},${3 / k}`} strokeLinejoin="round" />
                <path d={LAND_PATH} fill="none" className="stroke-background" strokeWidth={(d * 2 - 0.7) / k} strokeLinejoin="round" />
              </g>
            ))}
          </g>
        )}

        <path d={LAND_PATH} className="fill-gold-tint stroke-brass" strokeOpacity={0.75} strokeWidth={hair} strokeLinejoin="round" />

        {showGrid && (
          <g clipPath={`url(#${idp}-sphere)`} aria-hidden>
            {MERIDIANS.map((m) => (
              <path key={m.lon} d={m.d} fill="none" className="stroke-brass/30" strokeWidth={0.7 / k} strokeDasharray={`${2 / k},${4 / k}`} />
            ))}
            {NAMED_PARALLELS.map((p) => {
              const [x1, x2] = parallelExtent(p.lat);
              return (
                <g key={p.label}>
                  <line x1={x1} x2={x2} y1={p.y} y2={p.y} className="stroke-brass/30" strokeWidth={0.7 / k} strokeDasharray={`${2 / k},${4 / k}`} />
                  <text
                    x={x1 + 22}
                    y={p.y - 2.5 / k}
                    className="fill-primary/50 font-serif italic"
                    fontSize={7 / k}
                    letterSpacing={0.4 / k}
                  >
                    {p.label}
                  </text>
                </g>
              );
            })}
          </g>
        )}

        {lit && COUNTRY_WORLD[lit] && (
          <path
            d={COUNTRY_WORLD[lit].d}
            className={lit === active ? "fill-accent/30 stroke-accent" : "fill-accent/20 stroke-accent"}
            strokeWidth={1.2 / k}
            strokeLinejoin="round"
            filter={settled ? `url(#${idp}-lift)` : undefined}
          />
        )}

        {CASES.map((c) => {
          const p = PIN_XY[c.slug];
          if (!p) return null;
          const on = c.slug === active;
          const show = on || c.slug === lit;
          const r = 6 / k;
          const tk = 3 / k;
          const hw = 0.8 / k;
          const decay = breaches(c);
          return (
            <g
              key={c.slug}
              tabIndex={0}
              role="button"
              aria-pressed={on}
              aria-label={`${on ? "Close" : "Open"} ${c.shortTitle} on the map${decay ? ", a bond below the 3.0 viable floor" : ""}`}
              // A mouse press must not focus the beacon: focusing an element inside the clipped,
              // transformed map makes the browser scroll that clip box and repaint the whole map.
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => onPin(c.slug)}
              onKeyDown={activate(() => onPin(c.slug))}
              onMouseEnter={() => onHover(c.slug)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(c.slug)}
              onBlur={() => onHover(null)}
              className="group cursor-pointer outline-none pointer-events-auto"
            >
              {/* name shown on hover and in aria-label */}
              <circle cx={p[0]} cy={p[1]} r={r * 2.2} className="fill-transparent" />
              <circle cx={p[0]} cy={p[1]} r={r * 1.8} className="fill-none stroke-primary opacity-0 group-focus-visible:opacity-100" strokeWidth={hw} strokeDasharray={`${1.5 / k},${1.5 / k}`} />
              <circle cx={p[0]} cy={p[1]} r={r} className={on ? "fill-accent/15 stroke-primary" : "fill-background/60 stroke-accent/70"} strokeWidth={hw} />
              <g className={on ? "stroke-primary" : "stroke-accent/70"} strokeWidth={hw}>
                <line x1={p[0]} x2={p[0]} y1={p[1] - r - tk} y2={p[1] - r + tk * 0.6} />
                <line x1={p[0]} x2={p[0]} y1={p[1] + r - tk * 0.6} y2={p[1] + r + tk} />
                <line x1={p[0] - r - tk} x2={p[0] - r + tk * 0.6} y1={p[1]} y2={p[1]} />
                <line x1={p[0] + r - tk * 0.6} x2={p[0] + r + tk} y1={p[1]} y2={p[1]} />
              </g>
              <circle cx={p[0]} cy={p[1]} r={1.5 / k} className={on ? "fill-accent" : "fill-primary"} />
              {/* Status pip: brass while every bond holds at or above 3.0, crimson when any bond falls below. */}
              <circle cx={p[0] + r * 0.72} cy={p[1] - r * 0.72} r={1.6 / k} className={decay ? "fill-destructive" : "fill-brass"} strokeWidth={0.5 / k} stroke="hsl(var(--background))" />
              <text
                x={p[0]}
                y={p[1] + r + tk + 9 / k}
                textAnchor="middle"
                className="fill-primary/90 font-mono uppercase pointer-events-none"
                fontSize={8 / k}
                letterSpacing={1.2 / k}
              >
                {SIGIL[c.slug]}
              </text>
              {show && (
                <text
                  x={p[0] + (LABEL_DX[c.slug] ?? 0) / k}
                  y={p[1] - r - tk - 4 / k}
                  textAnchor={LABEL_ANCHOR[c.slug] ?? "middle"}
                  className="fill-primary font-serif pointer-events-none"
                  fontSize={13 / k}
                  fontWeight={on ? 700 : 500}
                >
                  {c.shortTitle}
                </text>
              )}
            </g>
          );
        })}
      </g>

    </svg>
    </div>
    {/* Frame furniture, outside the zoom: compass rose in the North Atlantic, cartouche in the South Pacific. */}
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden>
      <g style={{ opacity: furniture, transition: "opacity 400ms" }}>
        <CompassRose cx={405} cy={150} r={22} />
        <g transform="translate(88 383)">
          <rect x={0} y={0} width={204} height={47} className="fill-background/90 stroke-brass" strokeWidth={0.8} />
          <rect x={2.5} y={2.5} width={199} height={42} className="fill-none stroke-brass/70" strokeWidth={0.4} />
          {[
            { t: "THE VINCULUM RELATIONAL SECURITY CONTINUUM", y: 15, s: 6.2, c: "fill-primary" },
            { t: "EQUAL EARTH PROJECTION · UN CARTOGRAPHIC STANDARD", y: 26, s: 5, c: "fill-primary/75" },
            { t: "EIGHT DOCUMENTED PROCESSES · VIABLE FLOOR: 3.0", y: 36.5, s: 5, c: "fill-accent" },
          ].map((l) => (
            <text key={l.t} x={102} y={l.y} textAnchor="middle" className={`${l.c} font-serif`} fontSize={l.s} letterSpacing={0.7}>
              {l.t}
            </text>
          ))}
        </g>
      </g>
    </svg>
    </div>
  );
}

function CompassRose({ cx, cy, r }: { cx: number; cy: number; r: number }) {
  const pts = (len: number, w: number, a: number) => {
    const rad = (a * Math.PI) / 180;
    const tip = [cx + Math.sin(rad) * len, cy - Math.cos(rad) * len];
    const l = [cx + Math.sin(rad - Math.PI / 2) * w, cy - Math.cos(rad - Math.PI / 2) * w];
    const rr = [cx + Math.sin(rad + Math.PI / 2) * w, cy - Math.cos(rad + Math.PI / 2) * w];
    return { left: `${cx},${cy} ${l.join(",")} ${tip.join(",")}`, right: `${cx},${cy} ${rr.join(",")} ${tip.join(",")}` };
  };
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} className="fill-none stroke-brass/60" strokeWidth={0.5} />
      <circle cx={cx} cy={cy} r={r * 0.82} className="fill-none stroke-brass/40" strokeWidth={0.4} strokeDasharray="1,1.5" />
      <line x1={cx - r - 4} x2={cx + r + 4} y1={cy} y2={cy} className="stroke-brass/60" strokeWidth={0.4} />
      <line x1={cx} x2={cx} y1={cy - r - 4} y2={cy + r + 4} className="stroke-brass/60" strokeWidth={0.4} />
      {[45, 135, 225, 315].map((a) => {
        const p = pts(r * 0.62, 2.2, a);
        return (
          <g key={a}>
            <polygon points={p.left} className="fill-brass/40" />
            <polygon points={p.right} className="fill-background stroke-brass/60" strokeWidth={0.3} />
          </g>
        );
      })}
      {[0, 90, 180, 270].map((a) => {
        const p = pts(r * 0.98, 3, a);
        return (
          <g key={a}>
            <polygon points={p.left} className="fill-primary/80" />
            <polygon points={p.right} className="fill-background stroke-primary/70" strokeWidth={0.3} />
          </g>
        );
      })}
      <circle cx={cx} cy={cy} r={1.2} className="fill-brass" />
      <text x={cx} y={cy - r - 6} textAnchor="middle" className="fill-primary font-serif" fontSize={7}>
        N
      </text>
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* The frame: neatline, graduation, corner coordinates, bar scale      */
/* ------------------------------------------------------------------ */

function fmtDeg(v: number, axis: "lat" | "lon") {
  if (v === 0) return axis === "lat" ? "0°" : "0°";
  return `${Math.abs(v)}°${axis === "lat" ? (v > 0 ? "N" : "S") : v > 0 ? "E" : "W"}`;
}

function BarScale({ k, align = "start" }: { k: number; align?: "start" | "end" }) {
  // Aim for a bar about 18% of the frame, then round to 1, 2 or 5 times a power of ten.
  const km = niceKm((0.18 * MAP_W * KM_PER_UNIT) / k);
  const pct = ((km / KM_PER_UNIT) * k * 100) / MAP_W;
  return (
    <div className={`pointer-events-none select-none w-full flex flex-col ${align === "end" ? "items-end" : "items-start"}`} aria-label={`Bar scale: ${km.toLocaleString("en-GB")} kilometres at the Equator`}>
      <div className="flex border border-primary/80 h-1.5" style={{ width: `${pct}%`, minWidth: 64 }}>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`flex-1 ${i % 2 === 0 ? "bg-primary" : "bg-brass/70"}`} />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[8px] sm:text-[9px] text-primary/80 mt-0.5" style={{ width: `${pct}%`, minWidth: 64 }}>
        <span>0</span>
        <span className="whitespace-nowrap pl-1">{km.toLocaleString("en-GB")} km</span>
      </div>
      <p className="hidden sm:block font-mono text-[8px] uppercase tracking-[0.16em] text-muted-foreground">At the Equator</p>
    </div>
  );
}

function Neatline({ view, children, footnote = true }: { view: View; children: ReactNode; footnote?: boolean }) {
  const { k, x, y } = view;
  const latTicks = LAT_TICKS.map((t) => ({ ...t, f: (t.y * k + y) / MAP_H })).filter((t) => t.f > 0.03 && t.f < 0.97);
  const lonTicks = LON_TICKS.map((t) => ({ ...t, f: (t.x * k + x) / MAP_W })).filter((t) => t.f > 0.04 && t.f < 0.96);
  const [lonL, latT] = invert(-x / k, -y / k);
  const [lonR, latB] = invert((MAP_W - x) / k, (MAP_H - y) / k);
  const corner = "pointer-events-none absolute font-mono text-[8px] sm:text-[9px] leading-none text-brass bg-card px-0.5";
  return (
    <div className="relative border border-brass/50 p-2.5 sm:p-3.5 bg-card">
      <span className={`${corner} top-0.5 left-1`}>{`${dms(latT, "lat")} · ${dms(lonL, "lon")}`}</span>
      <span className={`${corner} top-0.5 right-1 hidden sm:inline`}>{`${dms(latT, "lat")} · ${dms(lonR, "lon")}`}</span>
      <span className={`${corner} bottom-0.5 left-1 hidden sm:inline`}>{`${dms(latB, "lat")} · ${dms(lonL, "lon")}`}</span>
      <span className={`${corner} bottom-0.5 right-1`}>{`${dms(latB, "lat")} · ${dms(lonR, "lon")}`}</span>
      <div className="relative border-[0.5px] border-brass/60">
        {latTicks.map((t) => (
          <span key={`l${t.lat}`} aria-hidden className="pointer-events-none absolute -left-2.5 sm:-left-3.5 z-10 flex items-center" style={{ top: `${t.f * 100}%` }}>
            <span className="h-px w-2 sm:w-3 bg-brass/70" />
            <span className="hidden md:inline absolute left-3.5 -translate-y-1/2 top-0 font-mono text-[7px] text-brass/90 bg-background/70 px-0.5">{fmtDeg(t.lat, "lat")}</span>
          </span>
        ))}
        {lonTicks.map((t) => (
          <span key={`t${t.lon}`} aria-hidden className="pointer-events-none absolute -top-2.5 sm:-top-3.5 z-10 h-2 sm:h-3 w-px bg-brass/70" style={{ left: `${t.f * 100}%` }} />
        ))}
        {lonTicks.map((t) => (
          <span key={`b${t.lon}`} aria-hidden className="pointer-events-none absolute -bottom-2.5 sm:-bottom-3.5 z-10 h-2 sm:h-3 w-px bg-brass/70" style={{ left: `${t.f * 100}%` }}>
            <span className="hidden md:inline absolute bottom-3.5 left-1 font-mono text-[7px] text-brass/90 bg-background/70 px-0.5 whitespace-nowrap">{fmtDeg(t.lon, "lon")}</span>
          </span>
        ))}
        {children}
      </div>
      {footnote && (
        <p className="mt-1.5 px-1 text-center text-[8px] sm:text-[9px] uppercase tracking-[0.18em] sm:tracking-[0.22em] leading-relaxed text-muted-foreground [overflow-wrap:anywhere]">
          Equal Earth projection · Pseudo-cylindrical equal-area (Winkel / Šavrič et al.) · UN cartographic standard
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dossier                                                             */
/* ------------------------------------------------------------------ */

function BondBars({ c }: { c: CaseStudy }) {
  return (
    <ul className="space-y-3">
      {DOMAINS.map((d, i) => {
        const v = c.scores[i];
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
              <span className="absolute -translate-x-1/2 font-mono text-[8px] uppercase tracking-[0.12em] text-muted-foreground" style={{ left: `${(FLOOR / 5) * 100}%` }}>
                3.0 floor
              </span>
            </div>
            {decay && <p className="text-[0.72rem] leading-snug text-destructive">Below the viable floor: acute relational decay.</p>}
          </li>
        );
      })}
    </ul>
  );
}

function CaseHead({ c }: { c: CaseStudy }) {
  return (
    <>
      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
        {c.region} · Section {c.ref} · <span className="font-mono">{SIGIL[c.slug]}</span>
      </p>
      <h3 className="font-serif text-primary text-2xl mt-1 leading-tight">{c.shortTitle}</h3>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <span className="border border-primary/40 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-primary">Pillar · {c.pillar}</span>
        {c.threats[0] && <span className="border border-accent/50 px-1.5 py-0.5 text-[9px] uppercase tracking-[0.16em] text-accent">{c.threats[0]}</span>}
        {SPAN[c.slug] && (
          <span className="border border-brass/50 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{SPAN[c.slug]}</span>
        )}
      </div>
      <p className="mt-2 font-mono text-[10px] text-muted-foreground">{COORDS[c.slug]}</p>
      <hr className="gold-rule gold-rule-short mt-3 mb-4" />
    </>
  );
}

function RegionIndex({ onPick, onHover }: { onPick: (slug: string) => void; onHover: (slug: string | null) => void }) {
  return (
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
                    onClick={() => onPick(c.slug)}
                    onKeyDown={activate(() => onPick(c.slug))}
                    onMouseEnter={() => onHover(c.slug)}
                    onMouseLeave={() => onHover(null)}
                    onFocus={() => onHover(c.slug)}
                    onBlur={() => onHover(null)}
                    className="text-left w-full min-h-9 flex items-center justify-between gap-2 font-serif text-primary hover:text-accent focus-visible:text-accent transition-colors"
                  >
                    <span>{c.shortTitle}</span>
                    <span className="flex items-center gap-1.5 font-mono text-[9px] text-muted-foreground">
                      {SIGIL[c.slug]}
                      <span aria-hidden className={`inline-block h-1.5 w-1.5 rounded-full ${breaches(c) ? "bg-destructive" : "bg-brass"}`} />
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The atlas                                                           */
/* ------------------------------------------------------------------ */

export default function RelationalAtlas() {
  const [active, setActive] = useState<string | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [view, setView] = useState<View>(zoomFor(null));
  const [room, setRoom] = useState(false);
  const [grid, setGrid] = useState(true);
  const [sound, setSound] = useState(false);
  const [pointer, setPointer] = useState<[number, number] | null>(null);
  const current = CASES.find((c) => c.slug === active) ?? null;
  const lit = hover ?? active;
  const { k } = view;
  const isWhole = !active && k === 1;
  const opener = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSound(soundEnabled());
    return onSoundChange(setSound);
  }, []);

  const select = useCallback((slug: string | null) => {
    tick();
    setActive(slug);
    setView(zoomFor(slug));
  }, []);
  const togglePin = useCallback((slug: string) => select(active === slug ? null : slug), [active, select]);
  const zoom = useCallback((f: number) => {
    tick();
    setView((v) => rescale(v, f));
  }, []);
  const whole = () => select(null);

  const controls = (inRoom: boolean) => (
    <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Map controls">
      <button type="button" className={ctrl} onClick={whole} disabled={isWhole} aria-label="Return to the whole map">
        ← <span className="hidden sm:inline">Whole map</span>
      </button>
      <button type="button" className={ctrl} onClick={() => zoom(ZOOM_STEP)} disabled={k >= MAX_K} aria-label="Zoom in">
        +
      </button>
      <button type="button" className={ctrl} onClick={() => zoom(1 / ZOOM_STEP)} disabled={k <= MIN_K} aria-label="Zoom out">
        −
      </button>
      {inRoom && (
        <button type="button" className={ctrl} onClick={() => select(null)} disabled={isWhole} aria-label="Reset to one-to-one scale">
          1:1
        </button>
      )}
      <span
        className="min-h-8 sm:min-h-9 inline-flex items-center bg-background/95 border border-brass/40 px-1.5 sm:px-2 font-mono text-[10px] text-primary"
        aria-live="polite"
        aria-label={`Scale ${k.toFixed(1)} times`}
      >
        {k.toFixed(1)}×
      </span>
      {inRoom ? (
        <>
          <button type="button" className={ctrl} aria-pressed={grid} onClick={() => { tick(); setGrid((g) => !g); }} aria-label="Toggle graticule">
            Grid
          </button>
          <button type="button" className={ctrl} aria-pressed={sound} onClick={() => setSoundEnabled(!sound)} aria-label={sound ? "Mute audio ticks" : "Enable audio ticks"}>
            {sound ? "Audio on" : "Audio off"}
          </button>
          <button type="button" className={ctrl} onClick={() => setRoom(false)} aria-label="Exit fullscreen (Escape)">
            Exit <span className="hidden sm:inline">(Esc)</span>
          </button>
        </>
      ) : (
        <button ref={opener} type="button" className={ctrl} onClick={() => { tick(); setRoom(true); }} aria-label="Expand fullscreen map room">
          ⛶ <span className="hidden sm:inline">Expand</span>
        </button>
      )}
    </div>
  );

  const badge = lit && COORDS[lit] && (
    <div className="absolute top-2 right-2 sm:top-3 sm:right-3 max-w-[55%] border border-brass/50 bg-background/95 px-1.5 py-1 sm:px-2.5 sm:py-1.5 text-right">
      {(() => {
        const c = CASES.find((x) => x.slug === lit);
        return c ? (
          <>
            <p className="font-serif text-[12px] sm:text-sm leading-tight text-primary truncate">{c.shortTitle}</p>
            <p className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-0.5">
              Section {c.ref} · {c.era}
            </p>
          </>
        ) : null;
      })()}
      <p className="hidden sm:block text-[9px] uppercase tracking-[0.2em] text-muted-foreground mt-1 border-t border-brass/30 pt-1">Nominal reference</p>
      <p className="font-mono text-[10px] sm:text-[11px] text-primary whitespace-nowrap">{COORDS[lit]}</p>
      {(() => {
        const c = CASES.find((x) => x.slug === lit);
        if (!c) return null;
        const below = c.scores.filter((s) => !holdsFloor(s)).length;
        return (
          <p className="hidden sm:block text-[9px] uppercase tracking-[0.18em] mt-0.5 text-muted-foreground">
            {below === 0 ? "All four bonds above the 3.0 floor" : `${below} of 4 bonds at or below 3.0`}
          </p>
        );
      })()}
    </div>
  );

  return (
    <section aria-labelledby="atlas-title" className="mb-20">
      <p className="eyebrow">The Relational Atlas</p>
      <h2 id="atlas-title" className="font-serif text-primary text-3xl md:text-4xl mt-2">
        Where the doctrine has been tested
      </h2>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />
      <p className="text-foreground/80 max-w-3xl mb-6">
        Eight documented processes, set on an Equal Earth projection, the equal-area world map now used by United Nations
        cartography in place of Mercator. Select a marker to move in on the territory and read its bond record, or expand the
        map into the Map Room.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start min-w-0">
        <figure className="m-0 min-w-0">
          <Neatline view={view}>
            <div className="relative overflow-hidden bg-navy-tint/30 aspect-[1000/487]">
              {!room && <AtlasSvg idp="atlas" view={view} active={active} lit={lit} showGrid onPin={togglePin} onHover={setHover} />}
              <div className="absolute top-2 left-2 sm:top-3 sm:left-3">{controls(false)}</div>
              {badge}
              <div className="pointer-events-none absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                <BarScale k={k} align="end" />
              </div>
            </div>
          </Neatline>
        </figure>

        {/* Dossier: docks directly beneath the map below the lg breakpoint. */}
        <aside className="border border-border bg-card p-5 flex flex-col min-h-[280px] min-w-0" aria-live="polite">
          {current ? (
            <>
              <CaseHead c={current} />
              <BondBars c={current} />
              <p className="text-[0.85rem] leading-snug text-foreground/80 mt-4">{current.pattern}</p>
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <Link
                  to={`/cases/${current.slug}`}
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline inline-flex items-center gap-1"
                >
                  Open the full case study →
                </Link>
                <Link
                  to="/methodology"
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80 hover:text-accent hover:underline inline-flex items-center gap-1"
                >
                  Continuum Scoring Methodology →
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Eight documented processes</p>
              <hr className="gold-rule gold-rule-short mt-3 mb-4" />
              <RegionIndex onPick={select} onHover={setHover} />
              <div className="mt-auto pt-4 flex flex-col gap-2">
                <p className="text-[0.82rem] leading-snug text-muted-foreground">Select a marker or a name to move in on that territory.</p>
                <Link
                  to="/methodology"
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80 hover:text-accent hover:underline inline-flex items-center gap-1"
                >
                  Explore Continuum Scoring Methodology →
                </Link>
              </div>
            </>
          )}
        </aside>
      </div>

      {room &&
        createPortal(
          <MapRoom
            view={view}
            setView={setView}
            active={active}
            lit={lit}
            current={current}
            grid={grid}
            pointer={pointer}
            onPointer={(mx, my) => setPointer(invert(mx, my))}
            onPin={togglePin}
            onHover={setHover}
            onPick={select}
            onZoom={zoom}
            onClose={() => {
              setRoom(false);
              window.setTimeout(() => opener.current?.focus(), 0);
            }}
            controls={controls(true)}
            badge={badge}
          />,
          document.body,
        )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Fullscreen Diplomatic Map Room                                      */
/* ------------------------------------------------------------------ */

type RoomProps = {
  view: View;
  setView: (fn: (v: View) => View) => void;
  active: string | null;
  lit: string | null;
  current: CaseStudy | null;
  grid: boolean;
  pointer: [number, number] | null;
  onPointer: (mx: number, my: number) => void;
  onPin: (slug: string) => void;
  onHover: (slug: string | null) => void;
  onPick: (slug: string | null) => void;
  onZoom: (f: number) => void;
  onClose: () => void;
  controls: ReactNode;
  badge: ReactNode;
};

function MapRoom({ view, setView, active, lit, current, grid, pointer, onPointer, onPin, onHover, onPick, onZoom, onClose, controls, badge }: RoomProps) {
  const shell = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState<{ w: number; h: number }>({ w: 0, h: 0 });

  // Keep the map at its true 1000:487 proportion inside whatever space the room has.
  useLayoutEffect(() => {
    const el = stage.current;
    if (!el) return;
    const fit = () => {
      // The neatline adds a margin of about 30px around the map on every side.
      const F = window.innerWidth >= 640 ? 30 : 22;
      const W = el.clientWidth;
      const H = el.clientHeight;
      const inner = Math.max(0, Math.min(W - F, ((H - F) * MAP_W) / MAP_H));
      setBox({ w: inner + F, h: (inner * MAP_H) / MAP_W + F });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Esc closes, arrows pan, + and - zoom. Scroll is held while the room is open. The handlers are
  // read through a ref so the effect runs once: re-running it would steal focus on every render.
  const keys = useRef({ onClose, onZoom, setView });
  keys.current = { onClose, onZoom, setView };
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    shell.current?.focus();
    const { current: h } = keys;
    const onKey = (e: globalThis.KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA")) return;
      if (e.key === "Escape") {
        e.preventDefault();
        h.onClose();
      } else if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        h.onZoom(ZOOM_STEP);
      } else if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        h.onZoom(1 / ZOOM_STEP);
      } else if (e.key.startsWith("Arrow")) {
        e.preventDefault();
        const dx = e.key === "ArrowLeft" ? PAN_STEP : e.key === "ArrowRight" ? -PAN_STEP : 0;
        const dy = e.key === "ArrowUp" ? PAN_STEP : e.key === "ArrowDown" ? -PAN_STEP : 0;
        h.setView((v) => pan(v, dx, dy));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const telemetry = useMemo(() => `GLOBAL MEAN: ${GLOBAL_MEAN.toFixed(2)} · ACTIVE CASES: ${CASES.length} · BENCHMARK: 3.0 FLOOR`, []);

  return (
    <div
      ref={shell}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Diplomatic Map Room"
      className="fixed inset-0 z-50 bg-background p-3 sm:p-6 flex flex-col outline-none"
    >
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brass/40 pb-3">
        <div className="min-w-0">
          <p className="wordmark text-lg sm:text-xl leading-none text-primary">The Relational Atlas</p>
          <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Equal Earth · UN cartographic standard</p>
        </div>
        <p className="hidden xl:block border border-brass/50 px-3 py-1.5 font-mono text-[10px] tracking-[0.16em] text-primary whitespace-nowrap">{telemetry}</p>
        <div>{controls}</div>
      </header>

      <div className="relative flex-1 min-h-0 mt-3 sm:mt-4">
        <div ref={stage} className="absolute inset-0 bottom-[46%] lg:bottom-0 flex items-start lg:items-center justify-center lg:pr-[25rem]">
          <div style={{ width: box.w }} className="relative">
            <Neatline view={view} footnote={false}>
              <div className="relative overflow-hidden bg-navy-tint/30" style={{ width: "100%", aspectRatio: `${MAP_W} / ${MAP_H}` }}>
                <AtlasSvg idp="room" view={view} active={active} lit={lit} showGrid={grid} onPin={onPin} onHover={onHover} onPointer={onPointer} />
                {badge}
                <div className="pointer-events-none absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-3 sm:right-3">
                  <BarScale k={view.k} />
                </div>
                <p className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 border border-brass/40 bg-background/90 px-2 py-1 font-mono text-[9px] sm:text-[10px] text-primary" aria-live="off">
                  {pointer ? `${dms(pointer[1], "lat")}, ${dms(pointer[0], "lon")}` : "Move across the map for coordinates"}
                </p>
              </div>
            </Neatline>
          </div>
        </div>

        <aside
          className="absolute z-10 left-0 right-0 bottom-0 max-h-[45%] lg:left-auto lg:top-0 lg:bottom-auto lg:right-0 lg:w-96 lg:max-h-[85vh] overflow-y-auto border border-brass/40 bg-card/95 p-5 sm:p-6 shadow-2xl"
          aria-live="polite"
          aria-label="Territory dossier"
        >
          {current ? (
            <>
              <CaseHead c={current} />
              <BondBars c={current} />
              <p className="text-[0.85rem] leading-snug text-foreground/80 mt-4">{current.pattern}</p>
              <div className="mt-5 flex flex-col gap-2">
                <Link
                  to={`/cases/${current.slug}`}
                  onClick={onClose}
                  className="w-full border border-accent bg-accent/10 px-3 py-2.5 text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  Open the full case study →
                </Link>
                <Link
                  to="/methodology"
                  onClick={onClose}
                  className="w-full border border-border bg-card/60 px-3 py-2 text-center text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/80 hover:text-accent hover:border-accent/60 transition-colors"
                >
                  Continuum Scoring Methodology →
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-border/50">
                <Link
                  to="/the-vinculum-dashboard"
                  onClick={onClose}
                  className="text-[9px] uppercase tracking-[0.18em] font-mono text-muted-foreground hover:text-primary transition-colors"
                >
                  System Architecture ↗
                </Link>
                <button
                  type="button"
                  onClick={() => onPick(null)}
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground hover:text-accent transition-colors"
                >
                  ← Whole map
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Territory dossier</p>
              <hr className="gold-rule gold-rule-short mt-3 mb-4" />
              <RegionIndex onPick={onPick} onHover={onHover} />
              <div className="mt-4 pt-3 border-t border-border/50 flex flex-col gap-2">
                <Link
                  to="/methodology"
                  onClick={onClose}
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/80 hover:text-accent hover:underline"
                >
                  Explore Continuum Scoring Methodology →
                </Link>
                <p className="font-mono text-[9px] leading-relaxed text-muted-foreground">
                  Esc exits · arrow keys pan · + and − zoom · Enter on a beacon opens it
                </p>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
