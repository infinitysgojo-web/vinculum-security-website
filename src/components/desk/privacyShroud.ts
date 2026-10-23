/**
 * Presentation Privacy Mask (Redaction Shroud). Builds the substitution dictionary for the
 * active mission's confidential identifiers and applies it to text. Scores, bond vectors,
 * indices and formulas are never in the dictionary, so they stay visible. Pure functions;
 * the DOM layer lives in PrivacyContext.tsx.
 */

export const LABEL_STATE_ALPHA = "[STATE ALPHA]";
export const LABEL_STATE_BRAVO = "[STATE BRAVO]";
export const LABEL_THIRD_PARTY = "[THIRD-PARTY SOVEREIGN]";
export const LABEL_ENVOY = "[ENVOY EXTRAORDINARY]";
export const LABEL_RESTRICTED = "[RESTRICTED OPERATIONAL TEXT - PRIVILEGED]";
export const LABEL_ARTICLE = "[ARTICLE CLASSIFIED · MUTUAL RESTRAINT]";
export const LABEL_THEATRE = "[THEATRE · RESTRICTED]";
export const delegateLabel = (n: number) => `[DELEGATE ${String(n).padStart(2, "0")}]`;

export type ShroudInput = {
  theatre?: string;
  /** Parties as typed on the mission profile: separated by semicolons, commas or "and". */
  parties?: string;
  officer?: string;
  /** Inscribed party names (customParties). */
  delegates?: string[];
  /** Inscribed covenant titles and obligations. */
  covenants?: string[];
  /** Free text: warrant notes, context tray entries, inscribed notes. */
  restricted?: string[];
};

export type ShroudEntry = { find: string; replace: string };

/** The smallest identifier worth masking; shorter strings would mangle ordinary words. */
const MIN_LEN = 3;

const clean = (x: string | undefined) => (x ?? "").replace(/\s+/g, " ").trim();

/** Split a parties field into its named parties, in the order typed. */
export function splitParties(parties: string | undefined): string[] {
  return clean(parties)
    .split(/\s*(?:;|,|\band\b|\/|\bvs\.?\b|\bversus\b)\s*/i)
    .map((p) => p.trim())
    .filter((p) => p.length >= MIN_LEN);
}

/**
 * The substitution dictionary, longest identifier first so that a full name is replaced
 * before any shorter name inside it. A string claimed by an earlier category keeps it.
 */
export function shroudDictionary(i: ShroudInput): ShroudEntry[] {
  const out = new Map<string, string>();
  const add = (find: string | undefined, replace: string) => {
    const f = clean(find);
    if (f.length < MIN_LEN || /^[\d\s.,%+−-]+$/.test(f)) return;
    const k = foldForMatch(f);
    if (!out.has(k)) out.set(k, replace);
  };
  add(i.theatre, LABEL_THEATRE);
  splitParties(i.parties).forEach((p, n) => add(p, n === 0 ? LABEL_STATE_ALPHA : n === 1 ? LABEL_STATE_BRAVO : LABEL_THIRD_PARTY));
  add(i.officer, LABEL_ENVOY);
  (i.delegates ?? []).forEach((d, n) => add(d, delegateLabel(n + 1)));
  (i.covenants ?? []).forEach((c) => add(c, LABEL_ARTICLE));
  (i.restricted ?? []).forEach((t) => add(t, LABEL_RESTRICTED));
  return [...out.entries()].map(([find, replace]) => ({ find, replace })).sort((a, b) => b.find.length - a.find.length);
}

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Typographic quotes and dashes folded to their plain forms before matching. */
const QUOTE_FOLD: Record<string, string> = {
  "\u2018": "'", "\u2019": "'", "\u201A": "'", "\u201B": "'", "\u2032": "'", "\u02BC": "'",
  "\u201C": '"', "\u201D": '"', "\u201E": '"', "\u201F": '"', "\u2033": '"',
  "\u2010": "-", "\u2011": "-", "\u2012": "-", "\u2013": "-", "\u2014": "-", "\u2015": "-", "\u2212": "-",
};

/**
 * Fold one string for matching: NFKC (compatibility forms such as ligatures and
 * full-width letters), typographic quotes and dashes to plain ASCII, combining
 * diacritics removed (Côte d'Ivoire matches Cote d'Ivoire), lower case.
 */
export function foldForMatch(text: string): string {
  return foldWithMap(text).folded;
}

/**
 * Fold text one code point at a time and keep, for every folded UTF-16 unit, the
 * index of the original code point it came from, so a match in the folded text maps
 * back to an exact range of the original. Rendering keeps the original characters.
 */
export function foldWithMap(text: string): { folded: string; start: number[]; end: number[] } {
  let folded = "";
  const start: number[] = [];
  const end: number[] = [];
  let i = 0;
  for (const ch of text) {
    const f = QUOTE_FOLD[ch] ?? ch.normalize("NFKC").normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[\u2018\u2019\u201C\u201D\u2013\u2014]/g, (q) => QUOTE_FOLD[q]).toLowerCase();
    for (let k = 0; k < f.length; k++) {
      start.push(i);
      end.push(i + ch.length);
    }
    folded += f;
    i += ch.length;
  }
  return { folded, start, end };
}

/** A single case-insensitive matcher over folded text, or null when the dictionary is empty. */
export function shroudMatcher(dict: ReadonlyArray<ShroudEntry>): RegExp | null {
  if (!dict.length) return null;
  const finds = [...new Set(dict.map((e) => foldForMatch(e.find)))].sort((a, b) => b.length - a.length);
  return new RegExp(finds.map((f) => escape(f).replace(/ /g, "\\s+")).join("|"), "gi");
}

/**
 * Apply the dictionary to one string. Matching runs on the folded text (NFKC, quotes,
 * dashes, diacritics, case, runs of whitespace), and each hit replaces the exact range
 * of the original string it came from. Text without an identifier is returned unchanged.
 */
export function maskText(text: string, dict: ReadonlyArray<ShroudEntry>, matcher: RegExp | null = shroudMatcher(dict)): string {
  if (!matcher || !text) return text;
  const map = new Map<string, string>();
  for (const e of dict) {
    const k = foldForMatch(e.find);
    if (!map.has(k)) map.set(k, e.replace);
  }
  const { folded, start, end } = foldWithMap(text);
  let out = "";
  let last = 0;
  matcher.lastIndex = 0;
  for (let m = matcher.exec(folded); m; m = matcher.exec(folded)) {
    if (!m[0]) {
      matcher.lastIndex++;
      continue;
    }
    const a = start[m.index];
    const b = end[m.index + m[0].length - 1];
    if (a < last) continue;
    const label = map.get(m[0].replace(/\s+/g, " "));
    if (!label) continue;
    out += text.slice(last, a) + label;
    last = b;
  }
  matcher.lastIndex = 0;
  return last === 0 && !out ? text : out + text.slice(last);
}
