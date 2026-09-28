import { Link, useParams, Navigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { sectionLd, SITE_URL, personLd, AUTHOR_NAME, PUBLISHED, LICENSE_URL, casePlaceLd } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import PullQuote from "@/components/PullQuote";
import DiplomatBadge from "@/components/DiplomatBadge";
import ReadingProgress from "@/components/ReadingProgress";
import NumeralDivider from "@/components/NumeralDivider";
import CountryOutline from "@/components/CountryOutline";
import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { CASES, DOMAINS, getCase } from "@/content/cases";

export default function CaseDetail() {
  const { slug } = useParams();
  const c = getCase(slug);
  if (!c) return <Navigate to="/cases" replace />;

  const idx = CASES.findIndex((x) => x.slug === c.slug);
  const prev = CASES[(idx - 1 + CASES.length) % CASES.length];
  const next = CASES[(idx + 1) % CASES.length];
  const path = `/cases/${c.slug}`;

  const caseLd = {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${SITE_URL}${path}#article`,
    headline: c.title,
    name: c.title,
    abstract: c.summary,
    description: c.metaDescription,
    url: `${SITE_URL}${path}`,
    mainEntityOfPage: `${SITE_URL}${path}`,
    author: personLd,
    inLanguage: "en",
    datePublished: PUBLISHED,
    license: LICENSE_URL,
    isAccessibleForFree: true,
    articleSection: `Section VII ${c.ref}`,
    keywords: c.keywords,
    copyrightHolder: { "@type": "Person", name: AUTHOR_NAME },
    isPartOf: {
      "@type": "WebPage",
      name: "Vinculum Security: Applied Case Engagement",
      url: `${SITE_URL}/cases`,
    },
    citation: c.sources.map((s) => ({ "@type": "CreativeWork", name: s })),
    contentLocation: casePlaceLd(c.slug),
    spatialCoverage: casePlaceLd(c.slug),
  };

  const datasetLd = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `${c.shortTitle}: Vinculum Continuum bond scores`,
    description: `Four-level bond integrity scoring (interpersonal, communal, intergenerational, institutional-relational) for ${c.shortTitle} under the Vinculum Security doctrine.`,
    url: `${SITE_URL}${path}`,
    creator: { "@type": "Person", name: AUTHOR_NAME },
    license: LICENSE_URL,
    variableMeasured: DOMAINS.map((d, i) => ({
      "@type": "PropertyValue",
      name: d,
      value: c.scores[i],
      minValue: 1,
      maxValue: 5,
      description: c.rationales[i],
    })),
    spatialCoverage: casePlaceLd(c.slug),
    temporalCoverage: c.era,
    keywords: c.keywords,
    isAccessibleForFree: true,
    measurementTechnique:
      "Vinculum Continuum four-level bond integrity scoring, 1 to 5, under the Vinculum Security doctrine",
    includedInDataCatalog: {
      "@type": "DataCatalog",
      name: "Vinculum Security: Applied Case Engagement",
      url: `${SITE_URL}/cases`,
    },
  };

  return (
    <>
      <SEO
        title={c.title}
        description={c.metaDescription}
        path={path}
        image="/og/cases.jpg"
        keywords={c.keywords}
        scholarly
        citationTitle={`Vinculum Security, Applied Case Engagement: ${c.title}`}
        breadcrumbs={[
          { name: "Home", path: "/" },
          { name: "Case Studies", path: "/cases" },
          { name: c.shortTitle, path },
        ]}
        jsonLd={[caseLd, datasetLd]}
      />
      <ReadingProgress />
      <CaseDossier c={c} />

      <div className="container">
        <nav aria-label="Breadcrumb" className="pt-10 flex items-center justify-between gap-4">
          <Link
            to="/cases"
            className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
          >
            ← All case studies
          </Link>
          <Button type="button" variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
            <Printer aria-hidden="true" /> Print executive dossier
          </Button>
        </nav>

        <PageHeader eyebrow={`Section ${c.ref} · Applied Case Engagement`} title={c.title} lede={c.summary} />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="foundation">{c.region}</DiplomatBadge>
          <DiplomatBadge variant="methodology">{c.pillar}</DiplomatBadge>
          <DiplomatBadge variant="handbook">{c.era}</DiplomatBadge>
          {c.threats.map((t) => (
            <DiplomatBadge key={t} variant="case-study">
              {t}
            </DiplomatBadge>
          ))}
        </FadeIn>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] items-start pb-8">
          <div className="space-y-5">
            {c.narrative.map((p, i) => (
              <FadeIn key={i} delay={i * 60}>
                <p className="text-[1.02rem] leading-[1.85] text-foreground/85">{p}</p>
              </FadeIn>
            ))}
          </div>

          <FadeIn className="lg:sticky lg:top-24">
            <aside className="border border-brass/40 bg-navy-tint/40 p-6">
              <div className="flex justify-center mb-4">
                <CountryOutline slug={c.slug} size={150} label={c.shortTitle} />
              </div>
              <p className="eyebrow">The record</p>
              <GoldRule className="mt-3 mb-4" />
              <dl className="space-y-4">
                {c.facts.map((f) => (
                  <div key={f.label}>
                    <dt className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
                      {f.label}
                    </dt>
                    <dd className="mt-1 text-[0.9rem] leading-relaxed text-foreground/85">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </aside>
          </FadeIn>
        </div>

        <NumeralDivider n={c.ref.replace("VII.", "")} label="Bond scoring" />

        <FadeIn>
          <p className="eyebrow">The four bond domains</p>
          <h2 className="mt-3 font-serif text-primary text-2xl md:text-3xl">Vinculum Continuum scoring</h2>
          <GoldRule className="mt-4 mb-6" />
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground text-left">
                  <th className="px-3 py-3 font-serif font-medium">Bond Domain</th>
                  <th className="px-2 py-3 font-serif font-medium w-32">Score</th>
                  <th className="px-3 py-3 font-serif font-medium">Rationale</th>
                </tr>
              </thead>
              <tbody>
                {DOMAINS.map((d, i) => (
                  <tr key={d} className={i % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                    <td className="px-3 py-3 align-top font-medium text-primary">{d}</td>
                    <td className="px-2 py-3 align-top">
                      <div className="flex items-center gap-2">
                        <span className="flex-1 h-1.5 bg-brass/30 relative overflow-hidden">
                          <span
                            className="absolute inset-y-0 left-0 bg-accent"
                            style={{ width: `${(c.scores[i] / 5) * 100}%` }}
                          />
                        </span>
                        <span className="font-serif text-accent w-4 text-right">{c.scores[i]}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 align-top text-foreground/80 text-[0.85rem] leading-snug">
                      {c.rationales[i]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-foreground/60">
            Scores run 1 to 5 per bond domain. Higher values indicate stronger observed bond integrity.
          </p>
          {c.slug === "rwanda" && (
            <div className="mt-6 border-l-2 border-accent bg-gold-tint/40 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                Adversarial Rescoring · Worked Demonstration
              </p>
              <p className="mt-2 text-[0.88rem] leading-relaxed text-foreground/85">
                The scores above were produced by a deliberate skeptical re-pass: interpersonal was
                reduced from a sympathetic 4 to a 3 to reflect variance between genuine and coerced
                apology; communal from a straightforwardly strong reading to a contested 3;
                intergenerational assigned a 2 for a gap, the bond between the 1994 generation and
                those born after, that earlier readings had not scored at all. Offered as a
                demonstration of method, not as a substitute for genuine third-party verification.
              </p>
            </div>
          )}
        </FadeIn>

        <FadeIn className="my-16">
          <PullQuote cite={`${c.shortTitle}, Section ${c.ref}`}>{c.quote}</PullQuote>
        </FadeIn>

        <FadeIn>
          <p className="eyebrow">What the case shows</p>
          <h2 className="mt-3 font-serif text-primary text-2xl md:text-3xl">Doctrinal finding</h2>
          <GoldRule className="mt-4 mb-6" />
          <div className="space-y-5 max-w-3xl">
            {c.finding.map((p, i) => (
              <p key={i} className="text-[1.02rem] leading-[1.85] text-foreground/85">
                {p}
              </p>
            ))}
          </div>
        </FadeIn>

        <NumeralDivider n="12" label="Handbook practice" />

        <FadeIn>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="border border-border bg-card p-6 md:p-7">
              <p className="eyebrow">What a Vinculum diplomat does</p>
              <GoldRule className="mt-3 mb-4" />
              <p className="text-[0.95rem] leading-relaxed text-foreground/85">{c.practice}</p>
            </div>
            <div className="border-l-2 border-accent bg-gold-tint/40 p-6 md:p-7">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                Transferable takeaway
              </p>
              <p className="mt-4 text-[0.95rem] leading-relaxed text-foreground/85">{c.takeaway}</p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="mt-16">
          <p className="eyebrow">Cross-case position</p>
          <GoldRule className="mt-3 mb-4" />
          <p className="max-w-3xl font-serif italic text-primary text-lg leading-snug">{c.pattern}</p>
        </FadeIn>

        <FadeIn className="mt-14">
          <p className="eyebrow">Sources of record</p>
          <GoldRule className="mt-3 mb-4" />
          <ul className="space-y-2 max-w-3xl list-none">
            {c.sources.map((s, i) => (
              <li key={i} className="text-[0.88rem] leading-relaxed text-foreground/75 pl-5 relative">
                <span className="absolute left-0 text-accent">·</span>
                {s}
              </li>
            ))}
          </ul>
        </FadeIn>

        <nav className="mt-20 mb-28 grid gap-4 md:grid-cols-2" aria-label="Case navigation">
          <Link
            to={`/cases/${prev.slug}`}
            className="border border-border bg-card p-5 hover-lift transition-all"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/60">
              Previous case
            </p>
            <p className="mt-2 font-serif text-primary text-lg leading-tight">{prev.title}</p>
          </Link>
          <Link
            to={`/cases/${next.slug}`}
            className="border border-border bg-card p-5 hover-lift transition-all md:text-right"
          >
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/60">
              Next case
            </p>
            <p className="mt-2 font-serif text-primary text-lg leading-tight">{next.title}</p>
          </Link>
        </nav>
      </div>
    </>
  );
}
