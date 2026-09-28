import SEO from "@/components/SEO";
import {
  AUTHOR_NAME,
  BOOK_ID,
  DOI,
  DOI_URL,
  LICENSE_URL,
  ORG_ID,
  PERSON_ID,
  PUBLISHED,
  SITE_URL,
  WORK_TITLE,
  personLd,
} from "@/lib/seo-entities";
import NavCard from "@/components/NavCard";
import ReadingPathways from "@/components/ReadingPathways";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Cite from "@/components/Cite";
import Logo from "@/components/Logo";
import { useParallax } from "@/hooks/useParallax";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

interface MediumArticle {
  id: string;
  title: string;
  link: string;
  pub_date: string;
  cover_image: string | null;
  excerpt: string | null;
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

const CARDS = [
  { to: "/doctrine", eyebrow: "Section III", title: "The Doctrine", description: "Canonical definition, ontological claim, comparative positioning, and the four-level Vinculum Continuum." },
  { to: "/foundations", eyebrow: "Section II", title: "Theoretical Foundations", description: "Thirteen independent traditions engaged comparatively, including Ubuntu, role ethics, restorative justice, peacebuilding, and intergenerational policy." },
  { to: "/cases", eyebrow: "Section VII", title: "Case Studies", description: "Eight documented processes across Africa, Latin America, Europe, Southeast Asia, and the Pacific, each scored across four bond domains." },
  { to: "/methodology", eyebrow: "Section V", title: "Methodology", description: "The diagnostic method and bond-integrity indicators used to assess a case in plain terms." },
  { to: "/practice", eyebrow: "Handbook", title: "Vinculum Diplomacy", description: "The applied practitioner discipline derived from the doctrine, oriented around four practice principles." },
  { to: "/glossary", eyebrow: "Reference", title: "Doctrine Glossary", description: "Canonical terms with source sections and verbatim passages from the doctrine and companion handbook." },
];

function LatestDispatches() {
  const [articles, setArticles] = useState<MediumArticle[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("medium-feed");
        if (!cancelled && !error && data?.articles) {
          setArticles(data.articles.slice(0, 3));
        }
      } catch {
        // silent fail on home strip
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (articles.length === 0) return null;

  return (
    <section className="container pb-20">
      <FadeIn>
        <p className="eyebrow">Dispatches</p>
        <h2 className="mt-3 font-serif text-primary">Latest Commentary</h2>
        <div className="mt-6 h-px w-16 bg-accent" />
      </FadeIn>
      <div className="mt-10 grid gap-6 md:gap-8 md:grid-cols-3">
        {articles.map((article, i) => (
          <FadeIn key={article.id} delay={i * 80}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group block h-full bg-background border border-brass/40 overflow-hidden transition-colors duration-500 hover:border-brass"
            >
              {article.cover_image ? (
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <img
                    src={article.cover_image}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-navy-tint to-gold-tint flex items-center justify-center">
                  <span className="font-serif text-3xl text-brass/50">VS</span>
                </div>
              )}
              <div className="p-5">
                <time
                  dateTime={article.pub_date}
                  className="text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground"
                >
                  {formatDate(article.pub_date)}
                </time>
                <h3 className="mt-2 font-serif text-lg text-primary group-hover:text-accent transition-colors leading-snug">
                  {article.title}
                </h3>
              </div>
            </a>
          </FadeIn>
        ))}
      </div>
      <div className="mt-8">
        <Link
          to="/dispatches"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
        >
          View all dispatches
          <span aria-hidden>→</span>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const offset = useParallax(0.18);

  return (
    <>
      <SEO
        title="A Doctrine of Relational Security"
        description="Vinculum Security holds that security is the presence and integrity of the relational bonds that make protection, dignity, and peace possible. An original doctrine by James Wesley Ndua: fully developed and copyrighted, tested against peace processes in Rwanda, Colombia, and South Africa, and operational and ready for academic, policy, and public use."
        path="/"
        type="website"
        keywords="Vinculum Security, relational security, a doctrine of relational security, relational security doctrine, bond integrity, Vinculum Continuum, Vinculum Diplomacy, James Wesley Ndua, operational security doctrine, case-tested peace doctrine, Rwanda Colombia South Africa peace processes"
        scholarly
        jsonLd={[{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": `${SITE_URL}/#webpage`,
          url: `${SITE_URL}/`,
          name: "Vinculum Security: A Doctrine of Relational Security",
          inLanguage: "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          about: { "@id": BOOK_ID },
          mainEntity: {
            "@type": "Book",
            "@id": BOOK_ID,
            name: WORK_TITLE,
            url: `${SITE_URL}/`,
            author: personLd,
            publisher: { "@id": ORG_ID },
            datePublished: PUBLISHED,
            inLanguage: "en",
            bookEdition: "Expanded Version, Final Edition",
            license: LICENSE_URL,
            copyrightHolder: { "@id": PERSON_ID },
            copyrightYear: 2026,
            isAccessibleForFree: true,
            creativeWorkStatus: "Published",
            identifier: {
              "@type": "PropertyValue",
              propertyID: "DOI",
              value: DOI,
              url: DOI_URL,
            },
            description:
              "An original doctrine holding that security is the presence and integrity of the relational bonds that make protection, dignity, and peace possible. The doctrine and its companion handbook are fully developed and copyrighted, tested against major historical and ongoing case studies including the peace processes in Rwanda, Colombia, and South Africa, and operational and ready for use in academic circles, mainstream policy, and public discourse.",
          },
          author: { "@id": PERSON_ID },
          creator: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
          speakable: {
            "@type": "SpeakableSpecification",
            cssSelector: ["h1", ".lede"],
          },
        },
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${SITE_URL}/#faq`,
          isPartOf: { "@id": `${SITE_URL}/#webpage` },
          mainEntity: [
            {
              "@type": "Question",
              name: "What is Vinculum Security?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Vinculum Security is an original doctrine holding that security is not the absence of threat but the presence and integrity of the relational bonds — between persons, communities, institutions, and generations — that make protection, dignity, and peace possible.",
              },
            },
            {
              "@type": "Question",
              name: "Who created the Vinculum Security doctrine?",
              acceptedAnswer: {
                "@type": "Answer",
                text: `${AUTHOR_NAME}, a diplomat and Youth, Peace and Security advocate based in Nairobi, Kenya, is the sole originator and rights holder of the Vinculum Security doctrine (ORCID 0009-0005-9861-8849).`,
              },
            },
            {
              "@type": "Question",
              name: "What is the primary source for Vinculum Security?",
              acceptedAnswer: {
                "@type": "Answer",
                text: `${SITE_URL}/ is the canonical primary source, published and maintained by the author. Zenodo, OSF, Harvard Dataverse, HAL, OpenAIRE and Knowledge Commons hold secondary archival deposits of the same work (DOI ${DOI}).`,
              },
            },
            {
              "@type": "Question",
              name: "How should Vinculum Security be cited?",
              acceptedAnswer: {
                "@type": "Answer",
                text: `Ndua, J. W. (2026). ${WORK_TITLE}. Vinculum Security. ${SITE_URL}/ — DOI ${DOI}. Licensed CC BY-NC-ND 4.0.`,
              },
            },
            {
              "@type": "Question",
              name: "Is Vinculum Security ready for practical use?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes. Both works, the doctrine and its companion handbook Vinculum Diplomacy, are fully developed and copyrighted (Kenya Copyright Board, Registration No. RZ100967, 27 July 2026), and have been tested against major historical and ongoing case studies, including the peace processes in Rwanda, Colombia, and South Africa. Both are operational and ready for use in academic circles, in mainstream policy, and in the public discourse where they can be applied.",
              },
            },
          ],
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": `${SITE_URL}/#sections`,
          name: "Sections of the Vinculum Security doctrine",
          description:
            "The canonical sections of the Vinculum Security doctrine, published in full on this site as the primary source.",
          isPartOf: { "@id": `${SITE_URL}/#webpage` },
          about: { "@id": BOOK_ID },
          itemListOrder: "https://schema.org/ItemListOrderAscending",
          numberOfItems: CARDS.length,
          itemListElement: CARDS.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: c.title,
            description: c.description,
            url: `${SITE_URL}${c.to}`,
          })),
        }]}
      />

      {/* Hero */}
      <section className="relative container pt-16 md:pt-24 pb-14 border-b-2 border-primary overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 top-4 font-serif text-brass/25 text-[7rem] md:text-[11rem] leading-none select-none"
          style={{ transform: `translateY(${offset}px)` }}
        >
          MMXXVI
        </span>

        <FadeIn>
          <div className="flex gap-2 flex-wrap mb-6">
            <DiplomatBadge variant="doctrine-core">Doctrine Core</DiplomatBadge>
            <DiplomatBadge variant="briefing-ready">Briefing Ready</DiplomatBadge>
            <DiplomatBadge variant="field-notes">Field-Tested</DiplomatBadge>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-8 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-4 mb-2">
                <Logo size={56} />
                <span className="h-10 w-px bg-brass/60" aria-hidden />
                <span className="eyebrow">Est. MMXXVI</span>
              </div>
              <h1 className="wordmark text-6xl md:text-8xl lg:text-9xl leading-[0.9]">
                Vinculum<br />Security
              </h1>
            </div>
            <div className="max-w-sm md:text-right relative z-10">
              <p className="text-lg leading-snug text-foreground/85 font-medium">
                An original diplomatic doctrine on the bonds that make protection, dignity, and peace possible.
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] font-semibold text-accent">
                James Wesley Ndua · Human Security Diplomat
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Canonical Definition */}
      <section className="container py-20 md:py-28">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
            <div className="md:col-span-8">
              <p className="eyebrow mb-6">Canonical Definition</p>
              <blockquote className="font-serif italic text-3xl md:text-5xl leading-[1.1] text-accent">
                Security is not the absence of threat, but the presence and integrity of the{" "}
                <Cite term="bond">relational bonds</Cite>, between persons, communities, and generations,
                that make protection, dignity, and peace possible in the first place.
              </blockquote>
              <p className="mt-6 text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70">
                James Wesley Ndua, 2026
              </p>
            </div>
            <aside className="md:col-span-4 md:border-l border-brass md:pl-8 py-2">
              <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary mb-4">
                Core Doctrine
              </p>
              <p className="text-foreground/75 leading-relaxed">
                A signed agreement that leaves bonds unrepaired is unfinished business. The doctrine rests on two
                independent civilizational traditions, <Cite term="ubuntu">Ubuntu</Cite> and{" "}
                <Cite term="confucian-role-ethics">Confucian Role Ethics</Cite>, arriving at the same
                relationally constituted account of personhood.
              </p>
            </aside>
          </div>
        </FadeIn>
      </section>

      {/* Navigation Grid */}
      <section className="container pb-24">
        <FadeIn>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="eyebrow">Contents</p>
              <h2 className="mt-2 font-serif text-primary">Read the doctrine</h2>
            </div>
            <p className="hidden md:block text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/60">
              I to VI
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CARDS.map((c, i) => (
            <FadeIn key={c.to} delay={i * 60} className="h-full">
              <NavCard {...c} index={i} />
            </FadeIn>
          ))}
        </div>

        <FadeIn className="mt-16 max-w-3xl">
          <p className="eyebrow">Status of the Works</p>
          <hr className="gold-rule gold-rule-short mt-4 mb-4" />
          <p className="text-sm leading-relaxed text-foreground/75">
            Both works, the doctrine and its companion handbook, are fully developed and copyrighted, registered with
            the Kenya Copyright Board (KECOBO) under Registration No. RZ100967, approved 27 July 2026. Both have been
            tested against major historical and ongoing case studies, including the peace processes in Rwanda,
            Colombia, and South Africa, and are operational and ready for use in academic circles, in mainstream policy,
            and in the public discourse where they can be applied.
          </p>
         </FadeIn>

      </section>

      <ReadingPathways />

      <LatestDispatches />

    </>
  );
}
