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
    const k = f.toLowerCase();
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

/** A single case-insensitive matcher for the dictionary, or null when it is empty. */
export function shroudMatcher(dict: ReadonlyArray<ShroudEntry>): RegExp | null {
  if (!dict.length) return null;
  return new RegExp(dict.map((e) => escape(e.find).replace(/ /g, "\\s+")).join("|"), "gi");
}

/** Apply the dictionary to one string. Text without an identifier is returned unchanged. */
export function maskText(text: string, dict: ReadonlyArray<ShroudEntry>, matcher: RegExp | null = shroudMatcher(dict)): string {
  if (!matcher || !text) return text;
  const map = new Map(dict.map((e) => [e.find.toLowerCase(), e.replace]));
  return text.replace(matcher, (m) => map.get(m.replace(/\s+/g, " ").toLowerCase()) ?? m);
}
