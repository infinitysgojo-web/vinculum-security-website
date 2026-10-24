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

/**
 * Structural limits checked on the raw JSON text, before JSON.parse allocates anything:
 * size, nesting depth, list length, keys per object and string length. One linear pass
 * over the characters with an explicit stack (no recursion). It reads the text only as
 * data; malformed JSON is left for JSON.parse to refuse. A string's length counts each
 * escape sequence as one character, as the parsed value would.
 */
export function precheckJsonText(text: string, limits: PayloadLimits): LimitCheck {
  if (utf8Bytes(text) > limits.maxBytes) return { ok: false, reason: `larger than ${Math.round(limits.maxBytes / (1024 * 1024))} MB` };
  const stack: { list: boolean; commas: number; filled: boolean }[] = [];
  let inString = false;
  let strLen = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text.charCodeAt(i);
    if (inString) {
      if (c === 0x5c /* \ */) {
        i += text.charCodeAt(i + 1) === 0x75 /* u */ ? 5 : 1;
        strLen++;
      } else if (c === 0x22 /* " */) {
        inString = false;
      } else {
        // A surrogate pair is two UTF-16 units in the text and two in the parsed string.
        strLen++;
      }
      if (strLen > limits.maxString) return { ok: false, reason: `a text value longer than ${limits.maxString.toLocaleString("en")} characters` };
      continue;
    }
    const top = stack[stack.length - 1];
    if (c === 0x22) {
      inString = true;
      strLen = 0;
      if (top) top.filled = true;
    } else if (c === 0x7b /* { */ || c === 0x5b /* [ */) {
      if (top) top.filled = true;
      stack.push({ list: c === 0x5b, commas: 0, filled: false });
      if (stack.length > limits.maxDepth + 1) return { ok: false, reason: `nested deeper than ${limits.maxDepth} levels` };
    } else if (c === 0x7d /* } */ || c === 0x5d /* ] */) {
      const done = stack.pop();
      if (!done) continue;
      const items = done.filled ? done.commas + 1 : 0;
      if (done.list && items > limits.maxList) return { ok: false, reason: `a list longer than ${limits.maxList.toLocaleString("en")} items` };
      if (!done.list && items > limits.maxKeys) return { ok: false, reason: `an object with more than ${limits.maxKeys} fields` };
    } else if (c === 0x2c /* , */) {
      if (top) top.commas++;
      if (top?.list && top.commas + 1 > limits.maxList) return { ok: false, reason: `a list longer than ${limits.maxList.toLocaleString("en")} items` };
      if (top && !top.list && top.commas + 1 > limits.maxKeys) return { ok: false, reason: `an object with more than ${limits.maxKeys} fields` };
    } else if (c > 0x20 && c !== 0x3a /* : */ && top) {
      top.filled = true;
    }
  }
  return { ok: true };
}
