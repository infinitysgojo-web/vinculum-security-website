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
import DiplomatBadge from "@/components/DiplomatBadge";
import ReadingProgress from "@/components/ReadingProgress";

import { GLOSSARY } from "@/content/glossary";

export default function Glossary() {
  const [q, setQ] = useState("");
  

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
    const query = q.trim().toLowerCase();
    if (!query) return GLOSSARY;
    return GLOSSARY.filter(
      (g) =>
        g.term.toLowerCase().includes(query) ||
        g.short.toLowerCase().includes(query) ||
        g.source.toLowerCase().includes(query)
    );
  }, [q]);

  return (
    <>
      <SEO
        title="Glossary"
        description="Canonical terms of the Vinculum Security doctrine and the Vinculum Diplomacy handbook, each with source section and verbatim passage."
        path="/glossary"
        image="/og/glossary.jpg"
        keywords="Vinculum Security glossary, relational security terms, vinculum, bond integrity, definitions"
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
          lede="Canonical terms of Vinculum Security and Vinculum Diplomacy, each linked to its source section and verbatim passage."
        />

        <FadeIn className="mb-10 flex flex-col md:flex-row md:items-center gap-4 justify-between">
          <div className="flex gap-2 flex-wrap">
            <DiplomatBadge variant="doctrine-core">Doctrine Core</DiplomatBadge>
            <DiplomatBadge variant="briefing-ready">Briefing Ready</DiplomatBadge>
            <DiplomatBadge variant="field-notes">Field Notes</DiplomatBadge>
          </div>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search terms, sources, definitions…"
            className="md:w-80 w-full bg-transparent border border-brass/50 px-3 py-2 text-sm font-sans placeholder:text-foreground/40 focus:outline-none focus:border-accent"
            aria-label="Search glossary"
          />
        </FadeIn>


        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/60 mb-8">
          {results.length} of {GLOSSARY.length} terms
        </p>

        <div className="grid gap-4 md:gap-5 md:grid-cols-2 pb-8">
          {results.map((g) => (
            <FadeIn key={g.id} className="h-full">
              <article
                id={g.id}
                className="group bg-background border border-brass/40 p-6 md:p-7 h-full transition-colors hover:bg-navy-tint/60 hover:border-brass scroll-mt-24"
              >
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                  {g.source}
                </p>
                <h2 className="mt-2 font-serif text-primary text-2xl leading-tight">{g.term}</h2>
                <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">{g.short}</p>
                <blockquote className="mt-4 pl-4 border-l-2 border-brass text-sm italic font-serif text-primary/80 leading-relaxed">
                  {g.quote}
                </blockquote>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
