/**
 * Structural limits for untrusted JSON (import files, stored records). Checked before any
 * field is read, so a pathological payload (huge, deeply nested, enormous lists or
 * strings) is refused cheaply instead of exhausting memory or storage. Pure data checks:
 * nothing in a payload is executed, fetched, rendered or followed.
 */
export type PayloadLimits = {
  /** Largest file accepted, in bytes. */
  maxBytes: number;
  maxDepth: number;
  /** Longest array anywhere in the payload. */
  maxList: number;
  /** Longest string anywhere in the payload. */
  maxString: number;
  /** Most keys on one object. */
  maxKeys: number;
  /** Total values in the payload. */
  maxNodes: number;
};

export const IMPORT_LIMITS: PayloadLimits = {
  maxBytes: 20 * 1024 * 1024,
  maxDepth: 32,
  maxList: 10_000,
  maxString: 200_000,
  maxKeys: 400,
  maxNodes: 1_000_000,
};

/** Limits for one stored workspace record. */
export const RECORD_LIMITS: PayloadLimits = { ...IMPORT_LIMITS, maxBytes: 5 * 1024 * 1024, maxNodes: 250_000 };

export type LimitCheck = { ok: true; reason?: undefined } | { ok: false; reason: string };

/** Walk a parsed JSON value iteratively (no recursion, so no stack exhaustion). */
export function checkPayload(value: unknown, limits: PayloadLimits): LimitCheck {
  const stack: [unknown, number][] = [[value, 0]];
  let nodes = 0;
  while (stack.length) {
    const [v, depth] = stack.pop()!;
    if (++nodes > limits.maxNodes) return { ok: false, reason: `more than ${limits.maxNodes.toLocaleString("en")} values` };
    if (depth > limits.maxDepth) return { ok: false, reason: `nested deeper than ${limits.maxDepth} levels` };
    if (typeof v === "string") {
      if (v.length > limits.maxString) return { ok: false, reason: `a text value longer than ${limits.maxString.toLocaleString("en")} characters` };
    } else if (typeof v === "number") {
      if (!Number.isFinite(v)) return { ok: false, reason: "a non-finite number" };
    } else if (Array.isArray(v)) {
      if (v.length > limits.maxList) return { ok: false, reason: `a list longer than ${limits.maxList.toLocaleString("en")} items` };
      for (const x of v) stack.push([x, depth + 1]);
    } else if (v !== null && typeof v === "object") {
      const keys = Object.keys(v);
      if (keys.length > limits.maxKeys) return { ok: false, reason: `an object with more than ${limits.maxKeys} fields` };
      for (const k of keys) {
        if (k === "__proto__" || k === "constructor" || k === "prototype") return { ok: false, reason: `a reserved field name (${k})` };
        if (k.length > 200) return { ok: false, reason: "a field name longer than 200 characters" };
        stack.push([(v as Record<string, unknown>)[k], depth + 1]);
      }
    } else if (v !== null && typeof v !== "boolean") {
      return { ok: false, reason: "a value that is not JSON data" };
    }
  }
  return { ok: true };
}

/** Byte size of a text as UTF-8. */
export const utf8Bytes = (text: string) => new TextEncoder().encode(text).length;
