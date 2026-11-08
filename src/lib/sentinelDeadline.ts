/** Wall-clock expiry checked before any activity can renew an idle deadline. */
export function idleDeadlineExpired(armedAt: number, idleMs: number, now: number): boolean {
  return now - armedAt >= idleMs;
}