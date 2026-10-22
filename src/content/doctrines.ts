/**
 * In-desk Doctrinal Breviary: statutory and treaty concepts rendered with a dotted
 * underline on the desks. Each entry gives the formal term, a plain-language meaning and
 * the instrument or judgment it rests on. Citations name the primary source itself.
 */
export type Doctrine = {
  id: string;
  term: string;
  meaning: string;
  citation: string;
  /** Text forms that render as this doctrine, most specific first. */
  patterns: RegExp[];
};

export const DOCTRINES: Doctrine[] = [
  {
    id: "pacta-sunt-servanda",
    term: "Pacta sunt servanda",
    meaning: "Agreements must be kept. A treaty in force binds its parties, who must perform it in good faith.",
    citation: "Vienna Convention on the Law of Treaties 1969, art. 26.",
    patterns: [/pacta sunt servanda/i],
  },
  {
    id: "rebus-sic-stantibus",
    term: "Clausula rebus sic stantibus",
    meaning: "A fundamental, unforeseen change of the circumstances that formed the essential basis of consent may be invoked to end or suspend a treaty, but only on narrow conditions and never for a boundary treaty.",
    citation: "Vienna Convention on the Law of Treaties 1969, art. 62; Gabčíkovo-Nagymaros Project (Hungary/Slovakia), ICJ Reports 1997, para. 104.",
    patterns: [/(?:clausula\s+)?rebus sic stantibus/i, /VCLT,?\s+Art(?:icle|\.)?\s?62\b/i, /fundamental change of circumstances/i],
  },
  {
    id: "material-breach",
    term: "Material breach (VCLT Art. 60)",
    meaning: "A repudiation of the treaty, or a violation of a provision essential to its object or purpose, entitles the other party to invoke the breach to terminate or suspend the treaty.",
    citation: "Vienna Convention on the Law of Treaties 1969, art. 60.",
    patterns: [/VCLT,?\s+Art(?:icle|\.)?\s?60\b/i, /material breach/i],
  },
  {
    id: "uti-possidetis",
    term: "Uti possidetis juris",
    meaning: "New States inherit the administrative boundaries in place at independence, so frontiers are not reopened by force.",
    citation: "Frontier Dispute (Burkina Faso/Republic of Mali), ICJ Reports 1986, paras. 20–26; OAU Cairo Resolution AHG/Res. 16(I), 1964.",
    patterns: [/uti possidetis(?:\s+juris)?/i],
  },
  {
    id: "jus-cogens",
    term: "Jus cogens",
    meaning: "A peremptory norm accepted by the community of States as one from which no derogation is permitted; a treaty that conflicts with it is void.",
    citation: "Vienna Convention on the Law of Treaties 1969, art. 53.",
    patterns: [/jus cogens/i, /peremptory norm/i],
  },
  {
    id: "new-york-convention-v",
    term: "New York Convention, Art. V",
    meaning: "Recognition and enforcement of a foreign arbitral award may be refused only on the closed list of grounds in Article V, such as invalidity of the agreement, lack of due process, excess of mandate or public policy.",
    citation: "Convention on the Recognition and Enforcement of Foreign Arbitral Awards, New York 1958, art. V.",
    patterns: [/New York Convention(?:\s+1958)?,?\s+Art(?:icle|\.)?\s?V\b/i],
  },
  {
    id: "new-york-convention",
    term: "New York Convention 1958",
    meaning: "Contracting States recognise written arbitration agreements and enforce foreign arbitral awards, subject only to the grounds for refusal in Article V.",
    citation: "Convention on the Recognition and Enforcement of Foreign Arbitral Awards, New York 1958, arts. II, III and V.",
    patterns: [/New York Convention(?:\s+1958)?/i],
  },
  {
    id: "icsid-54",
    term: "ICSID Convention, art. 54",
    meaning: "Every Contracting State recognises an ICSID award as binding and enforces its pecuniary obligations as if it were a final judgment of its own courts.",
    citation: "Convention on the Settlement of Investment Disputes between States and Nationals of Other States 1965, art. 54.",
    patterns: [/ICSID(?:\s+Convention)?,?\s+art(?:icle|\.)?\s?54\b/i, /\bart\.\s?54\b/],
  },
  {
    id: "icsid-55",
    term: "ICSID Convention, art. 55",
    meaning: "Recognition does not displace the law on State immunity from execution: assets may still be shielded when the award is executed.",
    citation: "Convention on the Settlement of Investment Disputes between States and Nationals of Other States 1965, art. 55.",
    patterns: [/ICSID(?:\s+Convention)?,?\s+art(?:icle|\.)?\s?55\b/i, /\bart\.\s?55\b/],
  },
  {
    id: "sovereign-immunity",
    term: "Sovereign immunity",
    meaning: "A State is immune from the jurisdiction of foreign courts, and its property from measures of execution, unless it has expressly waived the immunity or the property is in commercial use.",
    citation: "United Nations Convention on Jurisdictional Immunities of States and Their Property 2004, arts. 5, 7 and 18–19.",
    patterns: [/sovereign immunity/i, /immunity from execution/i],
  },
  {
    id: "provisional-measures",
    term: "Provisional measures",
    meaning: "Interim orders a court or tribunal may indicate to preserve the respective rights of the parties pending its final decision.",
    citation: "Statute of the International Court of Justice, art. 41; ICSID Convention 1965, art. 47.",
    patterns: [/provisional measures/i],
  },
  {
    id: "force-majeure",
    term: "Force majeure",
    meaning: "An irresistible force or unforeseen event beyond a State's control, making performance materially impossible, precludes the wrongfulness of the non-performance.",
    citation: "International Law Commission, Articles on Responsibility of States for Internationally Wrongful Acts 2001, art. 23.",
    patterns: [/force majeure/i],
  },
];

export type DoctrineSegment = { text: string; doctrine?: Doctrine };

/**
 * Split text into plain runs and doctrine matches. The earliest match wins; at the same
 * position the entry listed first (the more specific) wins. Pure, for tests and rendering.
 */
export function segmentDoctrines(text: string, list: ReadonlyArray<Doctrine> = DOCTRINES): DoctrineSegment[] {
  const out: DoctrineSegment[] = [];
  let rest = text;
  while (rest) {
    let best: { i: number; len: number; d: Doctrine } | null = null;
    for (const d of list)
      for (const p of d.patterns) {
        const m = new RegExp(p.source, p.flags.replace("g", "")).exec(rest);
        if (m && (best === null || m.index < best.i)) best = { i: m.index, len: m[0].length, d };
      }
    if (!best) {
      out.push({ text: rest });
      break;
    }
    if (best.i > 0) out.push({ text: rest.slice(0, best.i) });
    out.push({ text: rest.slice(best.i, best.i + best.len), doctrine: best.d });
    rest = rest.slice(best.i + best.len);
  }
  return out;
}

export const doctrineById = (id: string) => DOCTRINES.find((d) => d.id === id);
