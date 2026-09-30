const ROOTS = [
  { word: "Vinculum", lang: "Latin", root: "from vincire, to bind", sense: "A bond, tie or fetter. In Roman law, the obligatio was a vinculum iuris, a bond of law. The doctrine takes the bond, not the state, as its unit of analysis." },
  { word: "Securitas", lang: "Latin", root: "se- (without) + cura (care, anxiety)", sense: "Freedom from anxiety. The doctrine reads the root relationally: one is without care because one is held within bonds of care." },
  { word: "Relatio", lang: "Latin", root: "from referre, to carry back", sense: "A bearing of one thing toward another. Grounds the claim that persons and communities exist in, and are secured through, their relations." },
  { word: "Ubuntu", lang: "Nguni Bantu", root: "umuntu ngumuntu ngabantu", sense: "A person is a person through other persons. One of the intellectual traditions the doctrine places in dialogue." },
  { word: "Westphalian", lang: "Historical", root: "Peace of Westphalia, 1648", sense: "Shorthand for the sovereignty-centred order the doctrine contrasts itself with: security of territory and state, rather than of the bonds between people." },
  { word: "Pro Omni Humanitate", lang: "Latin", root: "pro + omnis + humanitas", sense: "For all humanity. The motto of the work; humanitas carries both humankind and humane conduct." },
];

/** Reading-only etymology reference for the Glossary. */
export default function Etymology() {
  return (
    <section id="etymology" className="scroll-mt-24 pb-20">
      <p className="eyebrow">Roots of the vocabulary</p>
      <h2 className="mt-3 font-serif text-primary text-2xl md:text-3xl">Etymology of the key terms</h2>
      <hr className="gold-rule gold-rule-short mt-4 mb-8" />
      <dl className="grid gap-x-10 gap-y-7 md:grid-cols-2 max-w-5xl">
        {ROOTS.map((r) => (
          <div key={r.word} className="border-t border-brass/40 pt-4">
            <dt className="flex flex-wrap items-baseline gap-x-3">
              <span className="font-serif text-xl text-primary italic">{r.word}</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent">{r.lang}</span>
            </dt>
            <dd className="mt-1 text-xs text-muted-foreground">{r.root}</dd>
            <dd className="mt-2 text-sm text-foreground/85 leading-relaxed">{r.sense}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
