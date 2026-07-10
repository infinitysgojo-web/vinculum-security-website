import { useEffect, useState, useMemo } from "react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import ReadingProgress from "@/components/ReadingProgress";
import GlossaryCommand from "@/components/GlossaryCommand";
import { GLOSSARY } from "@/content/glossary";

export default function Glossary() {
  const [q, setQ] = useState("");
  const [cmdOpen, setCmdOpen] = useState(false);

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
      />
      <ReadingProgress />
      <GlossaryCommand open={cmdOpen} onOpenChange={setCmdOpen} />
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
          <div className="flex items-center gap-2 md:w-auto w-full">
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search terms, sources, definitions…"
              className="flex-1 md:w-80 bg-transparent border border-brass/50 px-3 py-2 text-sm font-sans placeholder:text-foreground/40 focus:outline-none focus:border-accent"
              aria-label="Search glossary"
            />
            <button
              type="button"
              onClick={() => setCmdOpen(true)}
              className="hidden md:inline-flex items-center gap-1 border border-brass/50 px-2 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/70 hover:border-accent hover:text-accent transition-colors"
              title="Jump to term (⌘K)"
              aria-label="Open quick jump"
            >
              <kbd className="font-sans">⌘</kbd>
              <kbd className="font-sans">K</kbd>
            </button>
          </div>
        </FadeIn>


        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/60 mb-8">
          {results.length} of {GLOSSARY.length} terms
        </p>

        <div className="grid gap-px bg-brass/40 border border-brass/40 md:grid-cols-2 pb-8">
          {results.map((g) => (
            <FadeIn key={g.id}>
              <article
                id={g.id}
                className="group bg-background p-6 md:p-7 h-full transition-colors hover:bg-navy-tint/60 scroll-mt-24"
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
