/**
 * Equal Earth projection arithmetic for the Relational Atlas, matched to the
 * geometry in `@/content/geo` (projected with d3-geo's geoEqualEarth fitted to
 * 1000 x 487: scale 184.7316, centre 500, 243.5). Forward and inverse
 * projection, the 30-degree graticule, and the nominal ground scale.
 */
import { MAP_W, MAP_H } from "@/content/geo";

const A1 = 1.340264;
const A2 = -0.081106;
const A3 = 0.000893;
const A4 = 0.003796;
const M = Math.sqrt(3) / 2;
const SCALE = 184.7316;
const CX = MAP_W / 2;
const CY = MAP_H / 2;
const RAD = Math.PI / 180;

/** Longitude and latitude in degrees to Equal Earth map coordinates. */
export function project(lon: number, lat: number): [number, number] {
  const l = lon * RAD;
  const t = Math.asin(M * Math.sin(lat * RAD));
  const t2 = t * t;
  const t6 = t2 * t2 * t2;
  const x = (l * Math.cos(t)) / (M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2)));
  const y = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2));
  return [CX + x * SCALE, CY - y * SCALE];
}

/** Map coordinates back to longitude and latitude in degrees, clamped to the sphere. */
export function invert(px: number, py: number): [number, number] {
  const x = (px - CX) / SCALE;
  const y = (CY - py) / SCALE;
  let t = y / A1;
  for (let i = 0; i < 12; i++) {
    const t2 = t * t;
    const t6 = t2 * t2 * t2;
    const f = t * (A1 + A2 * t2 + t6 * (A3 + A4 * t2)) - y;
    const fp = A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2);
    const d = f / fp;
    t -= d;
    if (Math.abs(d) < 1e-9) break;
  }
  const tMax = Math.asin(M);
  t = Math.max(-tMax, Math.min(tMax, t));
  const t2 = t * t;
  const t6 = t2 * t2 * t2;
  const lon = (x * M * (A1 + 3 * A2 * t2 + t6 * (7 * A3 + 9 * A4 * t2))) / Math.cos(t) / RAD;
  const lat = Math.asin(Math.sin(t) / M) / RAD;
  return [Math.max(-180, Math.min(180, lon)), Math.max(-90, Math.min(90, lat))];
}

/** Degrees and minutes with a hemisphere letter, e.g. 0°19′ N. */
export function dms(v: number, axis: "lat" | "lon") {
  const h = axis === "lat" ? (v >= 0 ? "N" : "S") : v >= 0 ? "E" : "W";
  const a = Math.abs(v);
  let d = Math.floor(a);
  let m = Math.round((a - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}°${String(m).padStart(2, "0")}′ ${h}`;
}

/** Curved meridians every 30 degrees, drawn pole to pole. */
export const MERIDIANS: { lon: number; d: string }[] = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => {
  const pts: string[] = [];
  for (let lat = -90; lat <= 90; lat += 3) {
    const [x, y] = project(lon, lat);
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return { lon, d: `M${pts.join("L")}` };
});

/** Named parallels. In Equal Earth every parallel is a straight horizontal line. */
export const NAMED_PARALLELS: { label: string; lat: number; y: number }[] = [
  { label: "Tropic of Cancer", lat: 23.4367 },
  { label: "Equator", lat: 0 },
  { label: "Tropic of Capricorn", lat: -23.4367 },
].map((p) => ({ ...p, y: project(0, p.lat)[1] }));

/** The half-width of the sphere at a given map y, so parallels stop at the frame of the world. */
export function parallelExtent(lat: number): [number, number] {
  return [project(-180, lat)[0], project(180, lat)[0]];
}

/** Graduation ticks for the neatline: latitudes on the side margins, longitudes on the top and bottom. */
export const LAT_TICKS = [-60, -30, 0, 30, 60].map((lat) => ({ lat, y: project(0, lat)[1] }));
export const LON_TICKS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150].map((lon) => ({ lon, x: project(lon, 0)[0] }));

/**
 * Nominal ground distance per map unit along the Equator. At the Equator Equal
 * Earth gives x = lambda / (M * A1), so one radian of longitude (6,371 km) spans
 * SCALE / (M * A1) map units.
 */
export const KM_PER_UNIT = 6371 / (SCALE / (M * A1));

/** A round bar-scale length (1, 2 or 5 times a power of ten) near the target, in kilometres. */
export function niceKm(target: number) {
  const p = Math.pow(10, Math.floor(Math.log10(target)));
  const m = target / p;
  return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p;
}
