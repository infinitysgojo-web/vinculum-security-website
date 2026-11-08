/** Deterministic change key for bus data; preserves explicit clears and array order. */
export function signalValueKey(value: unknown): string {
  if (value === undefined) return '["undefined"]';
  if (value === null) return '["null"]';
  if (Array.isArray(value)) return `["array",${JSON.stringify(value.map(signalValueKey))}]`;
  if (typeof value === "object") {
    const record = value as Record<string, unknown>;
    return `["object",${JSON.stringify(Object.keys(record).sort().map((key) => [key, signalValueKey(record[key])]))}]`;
  }
  return JSON.stringify([typeof value, value]);
}