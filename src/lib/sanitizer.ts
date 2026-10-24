/**
 * Chancellery text and inscription sanitizer. Strips zero-width steganography,
 * invisible format watermarks, bidirectional override ("Trojan Source") controls
 * and stray ASCII control bytes from text before it enters a desk, a redline
 * audit or a restored archive. Pure functions, no DOM and no storage.
 *
 * Two deliberate departures from a blanket strip, so legitimate drafting text is
 * never altered in meaning:
 *  - Normalisation is NFC (canonical), not NFKC. NFKC folds compatibility forms
 *    a treaty can mean literally: "km²" becomes "km2", "½" becomes "1/2", "™"
 *    becomes "TM", the "ﬁ" ligature and full-width forms change. NFC only
 *    unifies canonically identical sequences. Pass { compatibility: true } for
 *    NFKC where folding is wanted.
 *  - U+200C ZERO WIDTH NON-JOINER and U+200D ZERO WIDTH JOINER are spelling in
 *    joining scripts (Persian, Urdu, Arabic, the Indic scripts, Sinhala, Khmer,
 *    Mongolian): removing them changes how a word is written. They are kept when
 *    they sit between two letters of such a script, and stripped everywhere else
 *    (between Latin letters they are invisible markers with no linguistic role).
 */

/** Joining scripts in which ZWJ / ZWNJ carry orthographic meaning. */
const JOINING = String.raw`\p{Script=Arabic}\p{Script=Syriac}\p{Script=Nko}\p{Script=Mongolian}\p{Script=Devanagari}\p{Script=Bengali}\p{Script=Gurmukhi}\p{Script=Gujarati}\p{Script=Oriya}\p{Script=Tamil}\p{Script=Telugu}\p{Script=Kannada}\p{Script=Malayalam}\p{Script=Sinhala}\p{Script=Khmer}\p{Script=Myanmar}\p{Script=Thaana}\p{Mn}\p{Mc}`;

/**
 * Invisible characters that are always removed:
 * U+200B zero width space, U+200E/U+200F LRM/RLM marks, U+202A-U+202E bidi
 * embeddings and overrides, U+2060-U+206F word joiner, invisible operators,
 * bidi isolates and deprecated format controls, U+FEFF zero width no-break space.
 */
const ALWAYS_INVISIBLE = /[\u200B\u200E\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;

/** ZWNJ / ZWJ not flanked on both sides by a joining-script letter or mark. */
const STRAY_JOINER = new RegExp(String.raw`(?<![${JOINING}])[\u200C\u200D]|[\u200C\u200D](?![${JOINING}])`, "gu");

/** Every zero-width / format control, counted for the audit regardless of context. */
const ANY_HIDDEN = /[\u200B-\u200F\u202A-\u202E\u2060-\u206F\uFEFF]/g;

/** ASCII control bytes other than tab, line feed and carriage return. */
// Security-critical: this pattern exists to match control bytes so they can be stripped on
// paste and blur (Trojan Source and log-injection defence). no-control-regex flags exactly
// that, so the rule is suppressed for this one deliberate pattern only.
// eslint-disable-next-line no-control-regex
const CONTROL_CHARS = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g;

export type SanitizeOptions = {
  /** Trim leading and trailing whitespace (default true). Off for text pasted mid-field. */
  trim?: boolean;
  /** NFKC compatibility folding instead of NFC (default false). */
  compatibility?: boolean;
};

export function sanitizeInscriptionText(input: string, options: SanitizeOptions = {}): string {
  if (!input) return "";
  const { trim = true, compatibility = false } = options;
  const out = input
    .normalize(compatibility ? "NFKC" : "NFC")
    .replace(ALWAYS_INVISIBLE, "")
    .replace(STRAY_JOINER, "")
    .replace(CONTROL_CHARS, "");
  return trim ? out.trim() : out;
}

/** Audit a text block for hidden tokens that sanitizeInscriptionText would act on. */
export function detectSteganographicTokens(input: string): { hasHiddenTokens: boolean; count: number; stripped: number } {
  if (!input) return { hasHiddenTokens: false, count: 0, stripped: 0 };
  const count = (input.match(ANY_HIDDEN) ?? []).length + (input.match(CONTROL_CHARS) ?? []).length;
  const kept = sanitizeInscriptionText(input, { trim: false });
  // Characters actually removed (joiners kept in Persian or Devanagari are not counted as stripped).
  const stripped = count === 0 ? 0 : Math.max(0, [...input.normalize("NFC")].length - [...kept].length);
  return { hasHiddenTokens: count > 0, count, stripped };
}

/**
 * The prohibited characters in a text, as code points ("U+202E"): every character
 * sanitizeInscriptionText would remove (invisible format controls, bidirectional
 * embeddings, overrides and isolates, stray joiners, ASCII control bytes). Joiners that
 * are spelling inside a joining script are not prohibited. Used to reject text on paste,
 * import and restore instead of silently rewriting it.
 */
export function prohibitedCharacters(input: string): string[] {
  if (!input) return [];
  const n = input.normalize("NFC");
  const found = new Set<string>();
  for (const m of n.matchAll(ALWAYS_INVISIBLE)) found.add(m[0]);
  for (const m of n.matchAll(STRAY_JOINER)) found.add(m[0]);
  for (const m of n.matchAll(CONTROL_CHARS)) found.add(m[0]);
  return [...found].map((c) => `U+${c.codePointAt(0)!.toString(16).toUpperCase().padStart(4, "0")}`).sort();
}

/** Every prohibited code point in any string (keys included) inside a JSON value. */
export function prohibitedCharactersDeep(value: unknown, depth = 0): string[] {
  if (depth > 64) return [];
  if (typeof value === "string") return prohibitedCharacters(value);
  const out = new Set<string>();
  if (Array.isArray(value)) for (const v of value) for (const c of prohibitedCharactersDeep(v, depth + 1)) out.add(c);
  else if (value && typeof value === "object")
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      for (const c of prohibitedCharacters(k)) out.add(c);
      for (const c of prohibitedCharactersDeep(v, depth + 1)) out.add(c);
    }
  return [...out].sort();
}

/**
 * Sanitize every string inside a JSON value (keys untouched), for archive and
 * file import. Whitespace is preserved inside strings so binder documents keep
 * their layout; only hidden and control characters go.
 */
export function sanitizeDeep<T>(value: T): T {
  if (typeof value === "string") return sanitizeInscriptionText(value, { trim: false }) as T;
  if (Array.isArray(value)) return value.map((v) => sanitizeDeep(v)) as T;
  if (value && typeof value === "object") {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) out[k] = sanitizeDeep(v);
    return out as T;
  }
  return value;
}

/** How many hidden or control characters sanitizeDeep would strip from every string in a JSON value. */
export function countStrippedDeep(value: unknown): number {
  if (typeof value === "string") return detectSteganographicTokens(value).stripped;
  const children: unknown[] = Array.isArray(value) ? value : value && typeof value === "object" ? Object.values(value as Record<string, unknown>) : [];
  let n = 0;
  for (const v of children) n += countStrippedDeep(v);
  return n;
}
