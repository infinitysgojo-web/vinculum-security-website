import { useState, useMemo } from "react";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import { Search, ChevronDown, BookOpen } from "lucide-react";
import { COMMENTARY, COMMENTARY_COUNT, Division, Inquiry } from "@/content/commentary";
import { SITE_URL, PERSON_ID } from "@/lib/seo-entities";

function buildCommentarySchema() {
  const allItems: { q: string; a: string }[] = [];
  COMMENTARY.forEach((div) => {
    div.items.forEach((item) => {
      allItems.push({ q: item.q, a: item.a.join(" ") });
    });
  });

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/commentary#faq`,
        url: `${SITE_URL}/commentary`,
        name: "Doctrinal Commentary & Interpretive Inquiries",
        author: { "@id": PERSON_ID },
        mainEntity: allItems.map((item) => ({
          "@type": "Question",
          name: item.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.a,
          },
        })),
      },
      {
        "@type": "ScholarlyArticle",
        "@id": `${SITE_URL}/commentary#article`,
        url: `${SITE_URL}/commentary`,
        name: "Vinculum Security: Doctrinal Commentary & Interpretive Inquiries",
        headline: "Canonical commentary, analytical laws, and systemic determinations of Vinculum Security",
        author: { "@id": PERSON_ID },
        description: "Exhaustive thirty-six inquiry authoritative commentary on Vinculum Security, Deterministic Relational Law, and chancellery deployment protocols.",
      },
    ],
  };
}

export default function Commentary() {
  const [query, setQuery] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDivisions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COMMENTARY;

    return COMMENTARY.map((div) => {
      const matchingItems = div.items.filter(
        (item) =>
          item.q.toLowerCase().includes(q) ||
          item.a.some((paragraph) => paragraph.toLowerCase().includes(q))
      );
      return { ...div, items: matchingItems };
    }).filter((div) => div.items.length > 0);
  }, [query]);

  const totalFilteredCount = useMemo(
    () => filteredDivisions.reduce((acc, div) => acc + div.items.length, 0),
    [filteredDivisions]
  );

  return (
    <>
      <SEO
        title="Doctrinal Commentary & Interpretive Inquiries | Vinculum Security"
        description="Authoritative doctrinal commentary, analytical laws, and systemic determinations by James Wesley Ndua. 36 canonical inquiries across 7 analytical divisions."
        path="/commentary"
        structuredData={buildCommentarySchema()}
      />

      <div className="container max-w-4xl">
        <PageHeader
          eyebrow="Canonical Interpretation"
          title="Doctrinal Commentary & Interpretive Inquiries"
          lede="Thirty-six authoritative determinations across seven analytical divisions. Rigorous doctrinal commentary, mathematical axioms, and operational protocols governing Vinculum Security."
        />

        <div className="py-8">
        {/* Search Bar & Stats */}
        <div className="mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter inquiries by keyword (e.g. 'Liebig', 'deterministic', 'continuum', 'succession')..."
              aria-label="Filter inquiries by keyword"
              className="w-full bg-card/60 border border-border/80 pl-11 pr-4 py-3 text-sm rounded-none focus:outline-none focus:border-accent text-foreground placeholder:text-muted-foreground/60 transition-colors"
            />
          </div>
          <div className="flex items-center justify-between mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>
              Showing {totalFilteredCount} of {COMMENTARY_COUNT} Canonical Inquiries
            </span>
            <span>7 Analytical Divisions</span>
          </div>
        </div>

        {/* Divisions & Accordions */}
        <div className="space-y-16">
          {filteredDivisions.map((div: Division) => (
            <section key={div.id} className="scroll-mt-24">
              <FadeIn>
                <div className="border-b border-brass/40 pb-4 mb-6">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-accent text-lg font-semibold">
                      Division {div.numeral}
                    </span>
                    <h2 className="font-serif text-2xl text-primary font-medium tracking-tight">
                      {div.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {div.summary}
                  </p>
                </div>

                <div className="space-y-4">
                  {div.items.map((item: Inquiry) => {
                    const isOpen = openItems[item.id] ?? false;
                    return (
                      <div
                        key={item.id}
                        className="border border-border/70 bg-card/40 transition-colors hover:border-accent/40"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(item.id)}
                          aria-expanded={isOpen}
                          className="w-full p-5 text-left flex items-start justify-between gap-4 group cursor-pointer"
                        >
                          <span className="font-serif text-base font-semibold text-foreground group-hover:text-accent transition-colors leading-snug">
                            {item.q}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-brass shrink-0 mt-1 transition-transform duration-200 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-6 pt-1 border-t border-border/40 text-[0.95rem] text-foreground/85 leading-relaxed space-y-3">
                            {item.a.map((paragraph, idx) => (
                              <p key={idx}>{paragraph}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </FadeIn>
            </section>
          ))}

          {filteredDivisions.length === 0 && (
            <div className="text-center py-16 border border-border/60 bg-card/20">
              <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <p className="font-serif text-lg text-primary">No inquiries match your query</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try searching for broader terms or clear your search filter.
              </p>
            </div>
          )}
        </div>

        {/* Formal Statutory Notice */}
        <div className="mt-20 p-6 border border-brass/40 bg-card/30">
          <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-accent mb-2">
            Statutory Legal Notice & Attribution
          </p>
          <GoldRule className="mb-3" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            All doctrinal determinations, analytical frameworks, and operational software architectures
            are original intellectual property authored by James Wesley Ndua. Statutorily registered and
            legally protected under copyright law and international conventions. All statutory rights strictly
            reserved. Made available for scholarly reading under CC BY-NC-ND 4.0.
          </p>
        </div>
      </div>
    </>
  );
}
      
