import { useEffect, useState, useMemo } from "react";
import SEO from "@/components/SEO";
import {
  AUTHOR_NAME,
  LICENSE_URL,
  ORG_ID,
  PERSON_ID,
  SITE_URL,
  WORK_TITLE,
  personLd,
} from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import ReadingProgress from "@/components/ReadingProgress";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

import { GLOSSARY, GlossaryCategory, GlossaryEntry } from "@/content/glossary";

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
  const { toast } = useToast();

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
        g.source.toLowerCase().includes(query)
    );
  }, [q, activeCategory]);

  const copyCitation = (entry: GlossaryEntry) => {
    const citation = `${AUTHOR_NAME} (2026). "${entry.term}." ${WORK_TITLE}. ${SITE_URL}/glossary#${entry.id}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopiedId(entry.id);
      toast({
        title: "Citation Copied",
        description: "Canonical citation for this term is ready to paste.",
      });
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  return (
    <>
      <SEO
        title="Glossary"
        description="Canonical terms of the Vinculum Security doctrine and the Vinculum Diplomacy handbook, each with source section and verbatim passage."
        path="/glossary"
        image="/og/glossary.jpg"
        keywords="Vinculum Security glossary, relational security definition, vinculum, bond integrity, Vinculum Continuum, canonical terms"
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
            description: entry.short,
            url: `${SITE_URL}/glossary#${entry.id}`,
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
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold border transition-all ${
                    activeCategory === cat 
                      ? "bg-accent border-accent text-primary" 
                      : "border-brass/30 text-foreground/60 hover:border-brass/60 hover:text-primary"
                  }`}
                >
                  {CATEGORY_LABELS[cat]}
                </button>
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
            {results.length} of {GLOSSARY.length} terms ${activeCategory !== "all" ? `in ${CATEGORY_LABELS[activeCategory]}` : ""}
          </p>
        </FadeIn>

        <div className="grid gap-4 md:gap-5 md:grid-cols-2 pb-16">
          {results.map((g) => (
            <FadeIn key={g.id} className="h-full">
              <article
                id={g.id}
                className="group relative bg-background border border-brass/40 p-6 md:p-7 h-full transition-colors hover:bg-navy-tint/60 hover:border-brass scroll-mt-24"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                      {g.source}
                    </p>
                    <h2 className="mt-2 font-serif text-primary text-2xl leading-tight">{g.term}</h2>
                  </div>
                  <button
                    onClick={() => copyCitation(g)}
                    className="p-2 text-foreground/40 hover:text-accent transition-colors shrink-0"
                    title="Export Canonical Citation"
                    aria-label="Export Canonical Citation"
                  >
                    {copiedId === g.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
                
                <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">{g.short}</p>
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
      </div>
    </>
  );
}
