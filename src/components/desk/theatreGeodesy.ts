/**
 * Pure mathematical geodesy & sovereign temporal calculations.
 * Air-gapped, zero external dependencies, runs 100% in-browser.
 */

export interface LatLng {
  lat: number;
  lng: number;
}

export interface GeodesicResult {
  distanceNm: number;
  distanceKm: number;
  bearingDeg: number;
  fiberLatencyMs: number;
  flightHoursMach082: number;
}

export interface BarycentreResult {
  lat: number;
  lng: number;
  dispersionNm: number;
}

const NM_PER_KM = 0.539957;
const EARTH_RADIUS_KM = 6371.0;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

/**
 * Great-circle distance and initial forward bearing between two coordinates.
 */
const clampLatLng = (p: LatLng): LatLng => ({
  lat: Number.isFinite(p.lat) ? Math.max(-90, Math.min(90, p.lat)) : 0,
  lng: Number.isFinite(p.lng) ? ((((p.lng + 180) % 360) + 360) % 360) - 180 : 0,
});

export function bilateralGeodesic(rawFrom: LatLng, rawTo: LatLng): GeodesicResult {
  const from = clampLatLng(rawFrom);
  const to = clampLatLng(rawTo);
  const phi1 = from.lat * DEG2RAD;
  const phi2 = to.lat * DEG2RAD;
  const deltaPhi = (to.lat - from.lat) * DEG2RAD;
  const deltaLambda = (to.lng - from.lng) * DEG2RAD;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(Math.max(0, 1 - a)));

  const distanceKm = EARTH_RADIUS_KM * c;
  const distanceNm = distanceKm * NM_PER_KM;

  const y = Math.sin(deltaLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
  const bearingDeg = ((Math.atan2(y, x) * RAD2DEG) + 360) % 360;

  // Subsea fiber optic transmission speed ~4.9 microseconds per km (core index ~1.468)
  const fiberLatencyMs = (distanceKm * 4.9) / 1000;
  // Diplomatic flight envelope at standard Mach 0.82 cruise (~480 knots)
  const flightHoursMach082 = distanceNm / 480;

  return {
    distanceNm: Math.round(distanceNm),
    distanceKm: Math.round(distanceKm),
    bearingDeg: Math.round(bearingDeg * 10) / 10,
    fiberLatencyMs: Math.round(fiberLatencyMs * 10) / 10,
    flightHoursMach082: Math.round(flightHoursMach082 * 10) / 10,
  };
}

/**
 * True 3D Cartesian spherical weighted centroid for multilateral parties.
 */
export function sphericalCentroid(
  points: { lat: number; lng: number; weight?: number }[]
): BarycentreResult | null {
  if (!points.length) return null;

  let totalWeight = 0;
  let X = 0;
  let Y = 0;
  let Z = 0;

  for (const pt of points) {
    const w = pt.weight ?? 1;
    totalWeight += w;
    const latR = pt.lat * DEG2RAD;
    const lngR = pt.lng * DEG2RAD;
    X += w * Math.cos(latR) * Math.cos(lngR);
    Y += w * Math.cos(latR) * Math.sin(lngR);
    Z += w * Math.sin(latR);
  }

  if (totalWeight === 0) return null;

  X /= totalWeight;
  Y /= totalWeight;
  Z /= totalWeight;

  const hyp = Math.sqrt(X * X + Y * Y);
  const lat = Math.atan2(Z, hyp) * RAD2DEG;
  const lng = Math.atan2(Y, X) * RAD2DEG;

  // Average dispersion distance in NM from the computed barycentre
  const bary = { lat, lng };
  let dispersionKm = 0;
  for (const pt of points) {
    const geo = bilateralGeodesic(pt, bary);
    dispersionKm += geo.distanceKm;
  }
  const dispersionNm = Math.round((dispersionKm / points.length) * NM_PER_KM);

  return {
    lat: Math.round(lat * 1000) / 1000,
    lng: Math.round(lng * 1000) / 1000,
    dispersionNm,
  };
}

/**
 * Calculates physical rupture shock propagation radius in Nautical Miles.
 */
export function ruptureShockRadiusNm(ruptureIndex: number): number {
  const clamped = Math.max(0, Math.min(100, ruptureIndex));
  // Scaled non-linear contagion envelope: 0 index = 0 NM, 100 index = 4,200 NM
  return Math.round(4200 * Math.pow(clamped / 100, 1.4));
}
