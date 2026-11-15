/**
 * Numeric guards for the Mission Engine (Master Catalog refinements, Domains I, II, V, VIII, IX, X).
 *
 * These never change a canonical formula. They only decide what a formula receives when an
 * input is not a finite number (NaN, ±Infinity, a blank field read as NaN), so that no reading
 * on the bus, in a proof or in an export can ever show NaN or Infinity.
 *
 * The rule is conservative: a missing or unreadable bond reads at the 1.0 sovereign baseline
 * (it can never manufacture health), and a missing load, exposure or penalty reads as 0
 * (it can never manufacture rupture).
 */

/** The statutory sovereign baseline: no bond score may read below it. */
export const BOND_MIN = 1.0;
/** The top of the bond scale. */
export const BOND_MAX = 5.0;

/** n when it is a finite number, otherwise the fallback. */
export const finiteOr = (n: unknown, fallback: number): number =>
  typeof n === "number" && Number.isFinite(n) ? n : fallback;

/** Clamp to [lo, hi]; a non-finite value takes the fallback (itself clamped). */
export const clampTo = (n: unknown, lo: number, hi: number, fallback = lo): number =>
  Math.min(hi, Math.max(lo, finiteOr(n, fallback)));

/** A bond input: finite values pass through unchanged; anything else reads at the 1.0 baseline. */
export const finiteBond = (n: unknown): number => finiteOr(n, BOND_MIN);

/** A non-negative load, exposure or penalty: non-finite or negative reads as 0. */
export const nonNegative = (n: unknown): number => Math.max(0, finiteOr(n, 0));

/** An ordinal 1 to 5 rating, rounded to an integer (Forum Matrix teeth, immunity, pace). */
export const ordinal5 = (n: unknown): number => Math.round(clampTo(n, 1, 5, 1));

/** A percentage share in [0, 100]; non-finite reads as 0. */
export const percent = (n: unknown): number => clampTo(n, 0, 100, 0);

/** Two-decimal financial rounding, Math.round(v × 100) ÷ 100. */
export const round2 = (n: number): number => Math.round(n * 100) / 100;

/** The canonical trend multipliers; any other value falls back to 1.00 (static). */
export const ALLOWED_TREND_MULTIPLIERS: readonly number[] = Object.freeze([0.85, 1.0, 1.15]);
export const trendMultiplierOr = (m: unknown): number =>
  typeof m === "number" && ALLOWED_TREND_MULTIPLIERS.some((x) => Math.abs(x - m) < 1e-9) ? m : 1.0;

/** Recursively freeze a canonical constant so no desk can mutate it at runtime. */
export function deepFreeze<T>(o: T): T {
  if (o && typeof o === "object" && !Object.isFrozen(o)) {
    Object.freeze(o);
    for (const v of Object.values(o as Record<string, unknown>)) deepFreeze(v);
  }
  return o;
}
