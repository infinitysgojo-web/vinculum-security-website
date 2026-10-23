import { useEffect, useState } from "react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import { AUTHOR_NAME, SITE_URL, personLd, ORG_ID } from "@/lib/seo-entities";
import { supabase } from "@/integrations/supabase/client";
import DispatchCover from "@/components/DispatchCover";

export const DISPATCH_CACHE = "vs:dispatches-cache";

interface Article {
  id: string;
  title: string;
  link: string;
  pub_date: string;
  author: string | null;
  categories: string[] | null;
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

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <FadeIn delay={index * 80}>
      <article className="group flex flex-col bg-background border border-brass/40 overflow-hidden transition-colors duration-500 hover:border-brass">
        <a
          href={article.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          aria-label={`Read "${article.title}" on Medium`}
        >
          <DispatchCover src={article.cover_image} large />
        </a>
        <div className="flex flex-col flex-1 p-6 md:p-8">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-muted-foreground">
            <time dateTime={article.pub_date}>{formatDate(article.pub_date)}</time>
            {article.author && (
              <>
                <span className="text-brass" aria-hidden>·</span>
                <span>{article.author}</span>
              </>
            )}
          </div>
          <h3 className="mt-3 font-serif text-xl md:text-2xl text-primary group-hover:text-accent transition-colors leading-snug">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {article.title}
            </a>
          </h3>
          {article.excerpt && (
            <p className="mt-3 text-sm text-foreground/70 leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}
          {article.categories && article.categories.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {article.categories.slice(0, 5).map((cat) => (
                <span
                  key={cat}
                  className="px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] font-semibold text-primary/70 border border-brass/30 bg-navy-tint/40"
                >
                  {cat.replace(/-/g, " ")}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto pt-6">
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-accent/60 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Read on Medium
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </article>
    </FadeIn>
  );
}

export default function Dispatches() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [savedCopy, setSavedCopy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // Show the last saved copy at once, then refresh from the network.
    let cached: Article[] = [];
    try {
      cached = JSON.parse(localStorage.getItem(DISPATCH_CACHE) || "[]");
    } catch {
      cached = [];
    }
    if (cached.length) {
      setArticles(cached);
      setLoading(false);
    }
    (async () => {
      try {
        const { data, error: fnError } = await supabase.functions.invoke("medium-feed");
        if (fnError) throw fnError;
        const fresh: Article[] = data?.articles ?? [];
        if (!cancelled) {
          setArticles(fresh);
          setSavedCopy(false);
          setLoading(false);
        }
        try {
          localStorage.setItem(DISPATCH_CACHE, JSON.stringify(fresh));
        } catch {
          // storage full: the live list still shows
        }
      } catch (e) {
        if (cancelled) return;
        if (cached.length) setSavedCopy(true);
        else setError(String(e));
        setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const itemListLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/dispatches#blog`,
    name: "Dispatches",
    description:
      "Commentary and analysis by James Wesley Ndua through the lens of Vinculum Security and Vinculum Diplomacy, the relational security way. Articles are published on Medium and linked here.",
    url: `${SITE_URL}/dispatches`,
    author: personLd,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: a.link,
      datePublished: a.pub_date,
      author: personLd,
      mainEntityOfPage: a.link,
    })),
  };

  return (
    <>
      <SEO
        title="Dispatches"
        description="Dispatches by James Wesley Ndua: commentary on world events through the Vinculum Security and Vinculum Diplomacy lens, the relational security way. Articles are published on Medium and linked here."
        path="/dispatches"
        type="website"
        keywords="Vinculum Security dispatches, Vinculum Diplomacy commentary, relational security analysis, James Wesley Ndua Medium, diplomatic commentary, relational security lens, international relations analysis"
        image="/og/dispatches.jpg"
        jsonLd={itemListLd}
      />
      <div className="container">
        <PageHeader
          eyebrow="Commentary"
          title="Dispatches"
          lede="Current affairs and world events read through the Vinculum Security and Vinculum Diplomacy lens, the relational security way. Articles are published on Medium; each card opens the full piece there."
        />
      </div>

      <section className="container pb-20">
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-2 border-brass/30 border-t-brass rounded-full animate-spin" />
            <p className="eyebrow">Loading dispatches</p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center py-24">
            <p className="text-muted-foreground">
              Dispatches could not be loaded at the moment. Please check back shortly.
            </p>
          </div>
        )}

        {!loading && !error && articles.length === 0 && (
          <div className="text-center py-24">
            <GoldRule className="gold-rule-short mx-auto" />
            <p className="mt-6 text-foreground/70 max-w-md mx-auto">
              New dispatches will appear here as soon as they are published on Medium.
            </p>
            <a
              href="https://medium.com/@jamesndua"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 border border-accent/60 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              Visit Medium profile
              <span aria-hidden>→</span>
            </a>
          </div>
        )}

        {!loading && !error && articles.length > 0 && (
          <>
            {savedCopy && (
              <p className="mb-8 text-center text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground" role="status">
                Offline · showing your last saved dispatches. Opening an article needs a connection.
              </p>
            )}
            <div className="grid gap-6 md:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, i) => (
                <ArticleCard key={article.id} article={article} index={i} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <a
                href="https://medium.com/@jamesndua"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-accent transition-colors"
              >
                Read all articles on Medium
                <span aria-hidden>→</span>
              </a>
            </div>
          </>
        )}
      </section>
    </>
  );
}
