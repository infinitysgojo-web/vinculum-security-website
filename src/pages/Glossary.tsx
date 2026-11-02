import { useEffect, useState, useMemo } from "react";
import SEO from "@/components/SEO";
import {
  LICENSE_URL,
  ORG_ID,
  PERSON_ID,
  SITE_URL,
  personLd,
} from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import ReadingProgress from "@/components/ReadingProgress";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

import { GLOSSARY, GlossaryCategory, GlossaryEntry } from "@/content/glossary";
import Etymology from "@/components/Etymology";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

/** Index letter for a term: a leading article ("The") is ignored, as in a printed glossary. */
function indexLetter(term: string): string {
  const c = term.replace(/^the\s+/i, "").trim().charAt(0).toUpperCase();
  return /[A-Z]/.test(c) ? c : "#";
}

const sortKey = (term: string) => term.replace(/^the\s+/i, "").toLowerCase();

const CATEGORY_LABELS: Record<GlossaryCategory | "all", string> = {
  all: "All Terms",
  core: "Doctrine Core",
  continuum: "The Continuum",
  lineage: "Foundations & Lineage",
  method: "Methodology",
  field: "Practice & Cases",
};

export default function Glossary() {
  const [q, setQ] = useState("");
  const [activeCategory, setActiveCategory] = useState<GlossaryCategory | "all">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (window.location.hash) {
      const id = window.location.hash.slice(1);
      setTimeout(() => {
        const el = document.getElementById(id);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
        el?.classList.add("glossary-highlight");
      }, 200);
    }
  }, []);

  const results = useMemo(() => {
    let filtered = GLOSSARY;
    
    if (activeCategory !== "all") {
      filtered = filtered.filter(g => g.category === activeCategory);
    }

    const query = q.trim().toLowerCase();
    if (!query) return filtered;
    
    return filtered.filter(
      (g) =>
        g.term.toLowerCase().includes(query) ||
        g.short.toLowerCase().includes(query) ||
        g.source.toLowerCase().includes(query) ||
        (g.formula ?? []).some((line) => line.toLowerCase().includes(query))
    );
  }, [q, activeCategory]);

  const groups = useMemo(() => {
    const map = new Map<string, GlossaryEntry[]>();
    [...results]
      .sort((x, y) => sortKey(x.term).localeCompare(sortKey(y.term)))
      .forEach((g) => {
        const l = indexLetter(g.term);
        map.set(l, [...(map.get(l) ?? []), g]);
      });
    return [...map.entries()].sort(([a], [b]) => (a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)));
  }, [results]);

  const present = useMemo(() => new Set(groups.map(([l]) => l)), [groups]);

  const jumpTo = (letter: string) => {
    document.getElementById(`letter-${letter.toLowerCase()}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  /** Copies the canonical definition with its persistent citation URI. */
  const copyDefinition = async (entry: GlossaryEntry) => {
    const uri = `${SITE_URL}/glossary#${entry.id}`;
    const text = `${entry.term}: ${entry.short}\n${uri}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(entry.id);
      toast.success(`Definition of ${entry.term} copied`, { description: uri });
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error("Copy failed. Select the definition and copy it manually.", { description: uri });
    }
  };

  return (
    <>
      <SEO
        title="Glossary"
        description="Canonical terms of the Vinculum Security doctrine and the Vinculum Diplomacy handbook, each with source section and verbatim passage."
        path="/glossary"
        image="/og/glossary.jpg"
        keywords="Vinculum Security glossary, relational security definition, vinculum, bond integrity, Vinculum Continuum, canonical terms, The Dominum Effect, Dominum Effect, Law of Sovereign Custodial Inversion, dominium and imperium, Custodial Inversion, James Wesley Ndua"
        citationTitle="Vinculum Security: Doctrine Glossary"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "DefinedTermSet",
          "@id": `${SITE_URL}/glossary#termset`,
          name: "Vinculum Security Doctrine Glossary",
          url: `${SITE_URL}/glossary`,
          description:
            "Canonical terms of the Vinculum Security doctrine and the Vinculum Diplomacy handbook.",
          inLanguage: "en",
          license: LICENSE_URL,
          author: personLd,
          creator: { "@id": PERSON_ID },
          publisher: { "@id": ORG_ID },
          hasDefinedTerm: GLOSSARY.map((entry) => ({
            "@type": "DefinedTerm",
            "@id": `${SITE_URL}/glossary#${entry.id}`,
            name: entry.term,
            ...(entry.id === "dominum-effect"
              ? { alternateName: ["The Dominium Effect", "The Law of Sovereign Custodial Inversion"] }
              : {}),
            description: entry.short,
            url: `${SITE_URL}/glossary#${entry.id}`,
            isPartOf: { "@id": `${SITE_URL}/glossary#termset` },
            subjectOf: { "@type": "ScholarlyArticle", name: entry.source },
            inDefinedTermSet: `${SITE_URL}/glossary#termset`,
          })),
        }}
      />
      <ReadingProgress />
      
      <div className="container">
        <PageHeader
          eyebrow="Reference"
          title="Doctrine Glossary"
          lede="Canonical terms of Vinculum Security and Vinculum Diplomacy, organized by thematic lineage."
        />

        <FadeIn className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(CATEGORY_LABELS) as Array<GlossaryCategory | "all">).map((cat) => (
                <Button
                  key={cat}
                  type="button"
                  variant={activeCategory === cat ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-none text-[10px] uppercase tracking-[0.2em]"
                >
                  {CATEGORY_LABELS[cat]}
                </Button>
              ))}
            </div>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search terms, sources, definitions…"
              className="md:w-80 w-full bg-transparent border border-brass/50 px-3 py-2 text-sm font-sans placeholder:text-foreground/40 focus:outline-none focus:border-accent"
              aria-label="Search glossary"
            />
          </div>
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/60">
            {results.length} of {GLOSSARY.length} terms{activeCategory !== "all" ? ` in ${CATEGORY_LABELS[activeCategory]}` : ""}
          </p>
        </FadeIn>

        <nav aria-label="Alphabetical index" className="mb-10 border-y border-brass/30 py-3" data-testid="alpha-bar">
          <ol className="flex flex-wrap gap-x-1 gap-y-1">
            {ALPHABET.map((l) => {
              const on = present.has(l);
              return (
                <li key={l}>
                  <button
                    type="button"
                    disabled={!on}
                    onClick={() => jumpTo(l)}
                    data-letter={l}
                    aria-label={on ? `Jump to terms beginning with ${l}` : `No terms beginning with ${l}`}
                    className="min-w-8 min-h-8 px-1.5 font-serif text-base text-primary hover:text-accent focus-visible:text-accent disabled:text-muted-foreground/40 disabled:cursor-not-allowed transition-colors"
                  >
                    {l}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="pb-16 space-y-12">
          {groups.map(([letter, entries]) => (
            <section key={letter} aria-labelledby={`letter-${letter.toLowerCase()}`}>
              <h2
                id={`letter-${letter.toLowerCase()}`}
                className="scroll-mt-24 font-serif text-3xl text-accent border-b border-brass/40 pb-2 mb-5"
              >
                {letter}
              </h2>
              <div className="grid gap-4 md:gap-5 md:grid-cols-2">
                {entries.map((g) => (
                  <FadeIn key={g.id} className="h-full">
                    <article
                      id={g.id}
                      className="group relative bg-background border border-brass/40 p-6 md:p-7 h-full transition-colors hover:bg-navy-tint/60 hover:border-brass scroll-mt-24"
                    >
                      <div className="flex justify-between items-start gap-4">
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                            {g.source}
                          </p>
                          <h3 className="mt-2 font-serif text-primary text-2xl leading-tight">{g.term}</h3>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => copyDefinition(g)}
                          className="shrink-0 text-foreground/50"
                          title="Copy definition and canonical URI"
                          aria-label={`Copy definition and canonical URI for ${g.term}`}
                          data-copy-term={g.id}
                        >
                          {copiedId === g.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>

                      <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                      <p className="text-[0.95rem] leading-relaxed text-foreground/85">{g.short}</p>
                      {g.formula?.length ? (
                        <div className="mt-4 border border-brass/30 bg-navy-tint/40 p-3 min-w-0">
                          <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-accent">Formal statement</p>
                          <ul className="mt-2 space-y-1.5">
                            {g.formula.map((line) => (
                              <li key={line} className="font-mono text-[11px] leading-relaxed text-foreground/85 [overflow-wrap:anywhere]">{line}</li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                      <blockquote className="mt-4 pl-4 border-l-2 border-brass text-sm italic font-serif text-primary/80 leading-relaxed">
                        {g.quote}
                      </blockquote>

                      <div className="mt-4 pt-4 border-t border-brass/10 flex items-center justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-foreground/30 font-bold">
                          Theme: {CATEGORY_LABELS[g.category]}
                        </span>
                      </div>
                    </article>
                  </FadeIn>
                ))}
              </div>
            </section>
          ))}
        </div>
        <Etymology />
      </div>
    </>
  );
}
