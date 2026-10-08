import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { sectionLd, SITE_URL } from "@/lib/seo-entities";
import FaqBlock, { faqLd } from "@/components/FaqBlock";
import { CASES_FAQ } from "@/content/faqs";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import ReadingProgress from "@/components/ReadingProgress";
import RelationalAtlas from "@/components/RelationalAtlas";

import { Link, useNavigate } from "react-router-dom";
import { CASES, DOMAINS, type Region, type Pillar, type Threat } from "@/content/cases";


const REGIONS: Region[] = ["Africa", "Europe", "Latin America", "Southeast Asia", "Pacific"];
const PILLARS: Pillar[] = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5 ${
        active
          ? "bg-accent text-accent-foreground border-accent"
          : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

export default function Cases() {
  const navigate = useNavigate();
  const [regions, setRegions] = useState<Set<Region>>(new Set());
  const [pillars, setPillars] = useState<Set<Pillar>>(new Set());
  const [threats, setThreats] = useState<Set<Threat>>(new Set());

  const toggle = <T,>(s: Set<T>, v: T, set: (s: Set<T>) => void) => {
    const next = new Set(s);
        if (next.has(v)) {
      next.delete(v);
    } else {
      next.add(v);
    }
    set(next);
  };

  const filtered = useMemo(
    () =>
      CASES.filter(
        (c) =>
          (regions.size === 0 || regions.has(c.region)) &&
          (pillars.size === 0 || pillars.has(c.pillar)) &&
          (threats.size === 0 || c.threats.some((t) => threats.has(t)))
      ),
    [regions, pillars, threats]
  );

  const clearAll = () => {
    setRegions(new Set());
    setPillars(new Set());
    setThreats(new Set());
  };

  const anyActive = regions.size + pillars.size + threats.size > 0;


  return (
    <>
      <SEO
        title="Case Studies"
        description="Eight documented processes (Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya, South Africa, and Tuvalu & Kiribati) scored across the four bond domains of the Vinculum Continuum. These major historical and ongoing case studies are the test-bed against which the doctrine and its companion handbook have been tested."
        path="/cases"
        image="/og/cases.jpg"
        keywords="peace process case studies, Northern Ireland, Colombia, Rwanda, South Africa, Vinculum Continuum scoring, relational security case analysis, bond domains, case-tested doctrine, doctrine test-bed"
        scholarly
        citationTitle="Vinculum Security: Applied Case Engagement"
        jsonLd={[
          sectionLd({
            path: "/cases",
            headline: "Vinculum Security: Applied Case Engagement",
            description:
              "Eight documented processes (Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya, South Africa, and Tuvalu & Kiribati) scored across the four bond domains of the Vinculum Continuum.",
            section: "Section VII — Cases",
          }),
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Vinculum Security case studies",
            itemListOrder: "https://schema.org/ItemListOrderAscending",
            numberOfItems: CASES.length,
            itemListElement: CASES.map((c, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: c.title,
              description: c.summary,
              url: `${SITE_URL}/cases/${c.slug}`,
            })),
          },
          faqLd("/cases", CASES_FAQ),
        ]}
      />
      />
      <ReadingProgress />
      <div className="container">
        <PageHeader
          eyebrow="Section VII"
          title="Applied Case Engagement"
          lede="Eight documented processes across Africa, Latin America, Europe, Southeast Asia, and the Pacific. Open any case for the full study."
        />

        <FadeIn className="flex gap-2 mb-8 flex-wrap">
          <DiplomatBadge variant="case-study">Case Study Atlas</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Briefing Ready</DiplomatBadge>
          <DiplomatBadge variant="field-notes">Field-Tested</DiplomatBadge>
        </FadeIn>

        <FadeIn>
          <RelationalAtlas />
        </FadeIn>

        {/* Cross-Case Pattern Summary, directly beneath the Relational Atlas */}
        <FadeIn className="mb-16">
          <p className="eyebrow">VII.I · Cross-Case Pattern Summary</p>
          <hr className="gold-rule mt-4 mb-6" />
          <p className="text-muted-foreground mb-6 max-w-3xl">
            All thirty-two scores across the eight cases, ordered here with no case privileged as
            flagship. Select any row to open its case dossier.
          </p>

          {/* All viewports: the full 32-score matrix, scrollable sideways on narrow screens; every row opens its case */}
          <p className="md:hidden mb-2 text-[11px] italic text-muted-foreground">
            Swipe horizontally to inspect all 32 scores across the 8 cases.
          </p>
          <div className="w-full overflow-x-auto border border-border" tabIndex={0} role="region" aria-label="Cross-case pattern summary, scrollable">
            <table className="w-full min-w-[40rem] text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground text-left">
                  <th className="px-3 py-3 font-serif font-medium">Case</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Interp.</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Communal</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Intergen.</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Instit.</th>
                  <th className="px-3 py-3 font-serif font-medium">Pattern</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c, i) => (
                  <tr
                    key={c.slug}
                    tabIndex={0}
                    role="link"
                    aria-label={`Open the case dossier: ${c.title}`}
                    onClick={() => navigate(`/cases/${c.slug}`)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        navigate(`/cases/${c.slug}`);
                      }
                    }}
                    className={`cursor-pointer transition-colors hover:bg-accent/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      i % 2 === 0 ? "bg-background" : "bg-gold-tint"
                    }`}
                  >
                    <td className="px-3 py-2 align-top font-medium text-primary whitespace-nowrap">
                      <Link
                        to={`/cases/${c.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-accent hover:underline"
                      >
                        {c.shortTitle}
                      </Link>
                    </td>
                    {c.scores.map((s, j) => (
                      <td key={j} className="px-2 py-2 align-top text-center font-serif text-accent">
                        {s}
                      </td>
                    ))}
                    <td className="px-3 py-2 align-top text-foreground/80 text-[0.8rem] leading-snug">
                      {c.pattern}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm italic text-foreground/70 max-w-3xl">
            The pattern holds across all eight cases: no case scores uniformly high, and Cambodia is
            the only case scoring uniformly low, making it the doctrine's single most important
            test case for the falsifiability standard.
          </p>
          <p className="mt-4 text-sm text-foreground/75 max-w-3xl">
            These eight processes, among them Rwanda, Colombia, and South Africa, are the major historical and ongoing
            case studies against which both the doctrine and its companion handbook have been tested.
          </p>
        </FadeIn>


        <FadeIn>
          <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6 mb-8 space-y-5">
            <FilterGroup
              label="Region"
              items={REGIONS}
              active={regions}
              onToggle={(v) => toggle(regions, v, setRegions)}
            />
            <FilterGroup
              label="Doctrine Pillar"
              items={PILLARS}
              active={pillars}
              onToggle={(v) => toggle(pillars, v, setPillars)}
            />
            <div className="flex items-center justify-between pt-3 border-t border-brass/30">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
                Showing {filtered.length} of {CASES.length} cases
              </p>
              {anyActive && (
                <button
                  onClick={clearAll}
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </FadeIn>


        <div className="grid gap-6 lg:grid-cols-2 pb-32">
          {filtered.map((c, i) => {
            return (
              <FadeIn key={c.slug} delay={i * 40} className="h-full">
                <article className="bg-card border border-border p-6 md:p-7 h-full flex flex-col hover-lift transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <DiplomatBadge variant="foundation">{c.region}</DiplomatBadge>
                      <DiplomatBadge variant="methodology">{c.pillar}</DiplomatBadge>
                    </div>
                  </div>

                  <h2 className="font-serif text-primary text-xl leading-tight">
                    <Link to={`/cases/${c.slug}`} className="hover:text-accent transition-colors">
                      {c.title}
                    </Link>
                  </h2>
                  <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                  <p className="text-[0.95rem] leading-relaxed text-foreground/85 mb-6">
                    {c.summary}
                  </p>

                  <div className="mt-auto grid grid-cols-1 sm:grid-cols-[1.1fr_0.8fr_1.5fr_2fr] gap-y-3 sm:gap-y-2 sm:gap-x-3 border-t border-border/70 pt-4">
                    {DOMAINS.map((d, idx) => (
                      <div key={d}>
                        <div className="flex items-baseline justify-between gap-4 sm:block">
                          <p className="text-[9px] uppercase tracking-[0.14em] font-semibold text-primary/60 leading-tight whitespace-nowrap">
                            {d}
                          </p>
                          <p className="font-serif text-accent text-sm sm:hidden">
                            {c.scores[idx]} / 5
                          </p>
                        </div>
                        <div className="h-1.5 bg-brass/30 mt-1">
                          <div
                            className="h-full bg-accent"
                            style={{ width: `${(c.scores[idx] / 5) * 100}%` }}
                          />
                        </div>
                        <p className="font-serif text-accent text-sm hidden sm:block sm:mt-0.5">
                          {c.scores[idx]} / 5
                        </p>
                      </div>
                    ))}
                  </div>


                  <Link
                    to={`/cases/${c.slug}`}
                    aria-label={`Open the full case study: ${c.title}`}
                    className="mt-5 inline-flex items-center gap-2 border border-accent/60 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    Open the full case study →
                  </Link>
                </article>
              </FadeIn>
            );
          })}
        </div>

        <FaqBlock
          items={CASES_FAQ}
          eyebrow="Section VII Determinations"
          title="Empirical Methodology &amp; Case Evidence Inquiries"
        />
      </div>
    </>
  );
}
function FilterGroup<T extends string>({
  label,
  items,
  active,
  onToggle,
}: {
  label: string;
  items: readonly T[];
  active: Set<T>;
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2">
        {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {items.map((it) => (
          <Chip key={it} active={active.has(it)} onClick={() => onToggle(it)}>
            {it}
          </Chip>
        ))}
      </div>
    </div>
  );
}
