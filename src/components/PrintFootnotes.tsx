import { GLOSSARY_MAP } from "@/content/glossary";

/**
 * Print-only footnotes block. Pass the term IDs cited on the page in order of appearance.
 */
export default function PrintFootnotes({ terms }: { terms: string[] }) {
  const seen = new Set<string>();
  const ordered = terms.filter((t) => (seen.has(t) ? false : (seen.add(t), true)));
  const entries = ordered
    .map((t) => GLOSSARY_MAP[t])
    .filter((e): e is NonNullable<typeof e> => !!e);
  if (entries.length === 0) return null;

  return (
    <section className="hidden print:block mt-12">
      <hr className="border-0 border-t border-black mb-4" />
      <h2 className="font-serif text-lg mb-3">Notes &amp; Citations</h2>
      <ol className="list-decimal pl-5 space-y-2 text-[10pt] leading-snug">
        {entries.map((e) => (
          <li key={e.id}>
            <span className="font-serif italic">{e.term}.</span> {e.short}{" "}
            <span className="text-[9pt]">· {e.source}.</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
