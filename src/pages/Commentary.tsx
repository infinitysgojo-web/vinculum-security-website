import { useState, useMemo, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PageHeader from "@/components/PageHeader";
import SEO from "@/components/SEO";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import { Search, ChevronDown, BookOpen } from "lucide-react";
import { toast } from "sonner";
import {
  COMMENTARY,
  COMMENTARY_COUNT,
  INQUIRY_NUMBER,
  INQUIRY_BY_NUMBER,
  INQUIRY_THEME,
  THEMES,
  THEME_COUNTS,
  type ThemeId,
  type Division,
  type Inquiry,
} from "@/content/commentary";
import { SITE_URL, PERSON_ID } from "@/lib/seo-entities";

const ITEM_BY_ID: Record<string, Inquiry> = Object.fromEntries(COMMENTARY.flatMap((d) => d.items).map((i) => [i.id, i]));

function matchesQuery(item: Inquiry, raw: string) {
  const q = raw.trim().toLowerCase();
  if (!q) return true;
  return item.q.toLowerCase().includes(q) || item.a.some((paragraph) => paragraph.toLowerCase().includes(q));
}

type ThemeFilter = "all" | ThemeId;

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
        description: `Exhaustive ${COMMENTARY_COUNT}-inquiry authoritative commentary on Vinculum Security, Deterministic Relational Law, and chancellery deployment protocols.`,
      },
    ],
  };
}

export default function Commentary() {
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<ThemeFilter>("all");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const [marked, setMarked] = useState<string | null>(null);

  const { hash } = useLocation();

  // Deep links: /commentary#<division-id> scrolls to a division;
  // /commentary#q-<slug> (the permanent permalink form) and the legacy /commentary#inquiry-<N>
  // both scroll to that inquiry, open it and mark it. Slugs never shift when inquiries are added or reordered.
  useEffect(() => {
    if (!hash) return;
    let target = decodeURIComponent(hash.slice(1));
    const num = /^inquiry-(\d+)$/.exec(target);
    const itemId = num ? INQUIRY_BY_NUMBER[Number(num[1])] : target.startsWith("q-") ? target.slice(2) : undefined;
    if (itemId) {
      // A permalink always lands: if the active theme or search hides the inquiry, reset them.
      const item = ITEM_BY_ID[itemId];
      setTheme((t) => (t === "all" || INQUIRY_THEME[itemId] === t ? t : "all"));
      if (item) setQuery((q) => (matchesQuery(item, q) ? q : ""));
      setOpenItems((prev) => ({ ...prev, [itemId]: true }));
      setMarked(itemId);
      target = `q-${itemId}`;
    }
    const t = window.setTimeout(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [hash]);

  const copyPermalink = async (id: string) => {
    const n = INQUIRY_NUMBER[id];
    const url = `${window.location.origin}/commentary#q-${id}`;
    window.history.replaceState(null, "", `#q-${id}`);
    setMarked(id);
    setOpenItems((prev) => ({ ...prev, [id]: true }));
    try {
      await navigator.clipboard.writeText(url);
      toast(`Permalink to Inquiry ${n} copied`, { description: url });
    } catch {
      toast(`Permalink to Inquiry ${n}`, { description: url });
    }
  };

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredDivisions = useMemo(() => {
    if (!query.trim() && theme === "all") return COMMENTARY;
    return COMMENTARY.map((div) => ({
      ...div,
      items: div.items.filter((item) => (theme === "all" || INQUIRY_THEME[item.id] === theme) && matchesQuery(item, query)),
    })).filter((div) => div.items.length > 0);
  }, [query, theme]);

  const totalFilteredCount = useMemo(
    () => filteredDivisions.reduce((acc, div) => acc + div.items.length, 0),
    [filteredDivisions]
  );

  return (
    <>
      <SEO
        title="Doctrinal Commentary"
        description={`${COMMENTARY_COUNT} answered questions on Vinculum Security by James Wesley Ndua, across seven divisions: claims, method, mathematics, and practice.`}
        path="/commentary"
        keywords="Vinculum Security commentary, relational security doctrine, The Dominum Effect, Dominum Effect, Dominum Index, Law of Sovereign Custodial Inversion, dominium and imperium, Deterministic Relational Law, James Wesley Ndua"
        jsonLd={buildCommentarySchema()}
      />

      <div className="container max-w-4xl">
        <PageHeader
          eyebrow="Canonical Interpretation"
          title="Doctrinal Commentary & Interpretive Inquiries"
          lede={`${COMMENTARY_COUNT} authoritative determinations across ${COMMENTARY.length} analytical divisions. Rigorous doctrinal commentary, mathematical axioms, and operational protocols governing Vinculum Security.`}
        />

        <div className="py-8">
        {/* Thematic filter ribbon (sticky beneath the site header) */}
        <div
          className="sticky top-[66px] z-30 -mx-4 px-4 py-3 mb-4 bg-background/95 backdrop-blur border-b border-brass/30 print:hidden"
          data-testid="theme-ribbon"
        >
          <div role="group" aria-label="Filter inquiries by theme" className="flex gap-2 overflow-x-auto scrollbar-none">
            {([{ id: "all", label: "All", count: COMMENTARY_COUNT }, ...THEMES.map((t) => ({ ...t, count: THEME_COUNTS[t.id] }))] as {
              id: ThemeFilter;
              label: string;
              count: number;
            }[]).map((t) => {
              const active = theme === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTheme(t.id)}
                  aria-pressed={active}
                  data-theme-pill={t.id}
                  data-count={t.count}
                  className={`shrink-0 whitespace-nowrap border px-3 py-1.5 min-h-9 text-[11px] uppercase tracking-[0.12em] transition-colors ${
                    active
                      ? "border-accent bg-accent text-accent-foreground"
                      : "border-border/80 bg-card/60 text-foreground/80 hover:border-accent hover:text-accent"
                  }`}
                >
                  {t.label} ({t.count})
                </button>
              );
            })}
          </div>
        </div>

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
            <span>{COMMENTARY.length} Analytical Divisions</span>
          </div>
        </div>

        {/* Divisions & Accordions */}
        <div className="space-y-16">
          {filteredDivisions.map((div: Division) => (
            <section key={div.id} id={div.id} className="scroll-mt-40">
              <FadeIn>
                <div className="border-b border-brass/40 pb-4 mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3">
                    <span className="font-serif text-accent text-lg font-semibold whitespace-nowrap">
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
                    const n = INQUIRY_NUMBER[item.id];
                    const isMarked = marked === item.id;
                    return (
                      <div
                        key={item.id}
                        id={`q-${item.id}`}
                        className={`scroll-mt-40 border bg-card/40 transition-colors hover:border-accent/40 ${
                          isMarked ? "border-accent ring-1 ring-accent/30" : "border-border/70"
                        }`}
                      >
                        {/* Legacy anchor, so older #inquiry-<n> links still land here. */}
                        <span id={`inquiry-${n}`} className="block scroll-mt-40" aria-hidden />
                        <div className="flex items-start">
                          <a
                            href={`#q-${item.id}`}
                            onClick={(e) => {
                              e.preventDefault();
                              copyPermalink(item.id);
                            }}
                            className="shrink-0 pl-4 pt-5 pr-1 font-mono text-[11px] leading-6 text-brass hover:text-accent focus-visible:text-accent transition-colors"
                            aria-label={`Copy permalink to Inquiry ${n}`}
                            title={`Copy permalink to Inquiry ${n}`}
                          >
                            #{n}
                          </a>
                          <button
                            type="button"
                            onClick={() => toggleItem(item.id)}
                            aria-expanded={isOpen}
                            className="flex-1 min-w-0 p-5 pl-2 text-left flex items-start justify-between gap-4 group cursor-pointer"
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
                        </div>

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
      </div>
    </>
  );
}     
