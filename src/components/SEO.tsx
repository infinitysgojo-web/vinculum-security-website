import { Helmet } from "react-helmet-async";
import {
  AUTHOR_NAME,
  CITATION,
  LICENSE_URL,
  ORCID_URL,
  PUBLISHED,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo-entities";

type Breadcrumb = { name: string; path: string };

type SEOProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string;
  breadcrumbs?: Breadcrumb[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Emit Google Scholar + Dublin Core citation tags (scholarly pages). */
  scholarly?: boolean;
  /** Override the citation title for this page. */
  citationTitle?: string;
  /** Keep the page out of the index (error pages only). */
  noIndex?: boolean;
  /** Route-specific social preview image (absolute or site-relative). */
  image?: string;
};

function abs(path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function SEO({
  title,
  description,
  path,
  type = "article",
  keywords,
  breadcrumbs,
  jsonLd,
  scholarly = false,
  citationTitle,
  noIndex = false,
  image,
}: SEOProps) {
  const full = `${title} · ${SITE_NAME}`;
  const crumbs: Breadcrumb[] =
    breadcrumbs ??
    (path === "/"
      ? [{ name: "Home", path: "/" }]
      : [
          { name: "Home", path: "/" },
          { name: title, path },
        ]);

  const canonical = abs(path);
  const ogImage = abs(image ?? "/og-image.jpg");
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  };

  const extraLd = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta
        name="robots"
        content={
          noIndex
            ? "noindex, follow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <link rel="canonical" href={canonical} />
      <meta name="author" content={AUTHOR_NAME} />
      <link rel="author" href={ORCID_URL} />
      <link rel="license" href={LICENSE_URL} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:secure_url" content={ogImage} />
      <meta property="og:image:type" content="image/jpeg" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta
        property="og:image:alt"
        content="Vinculum Security — a doctrine of relational security by James Wesley Ndua"
      />
      <meta property="og:locale" content="en_US" />
      {type === "article" && (
        <meta property="article:author" content={AUTHOR_NAME} />
      )}
      {type === "article" && (
        <meta property="article:published_time" content={PUBLISHED} />
      )}
      {type === "article" && (
        <meta property="article:section" content="Security Studies" />
      )}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta
        name="twitter:image:alt"
        content="Vinculum Security — a doctrine of relational security by James Wesley Ndua"
      />
      <meta name="twitter:label1" content="Written by" />
      <meta name="twitter:data1" content={AUTHOR_NAME} />
      <meta name="twitter:label2" content="License" />
      <meta name="twitter:data2" content="CC BY-NC-ND 4.0" />

      {/* Dublin Core — read by academic and library indexers */}
      <meta name="dcterms.title" content={citationTitle ?? full} />
      <meta name="dcterms.creator" content={AUTHOR_NAME} />
      <meta name="dcterms.publisher" content={SITE_NAME} />
      <meta name="dcterms.date" content={PUBLISHED} />
      <meta name="dcterms.language" content="en" />
      <meta name="dcterms.type" content="Text" />
      <meta name="dcterms.identifier" content={canonical} />
      <meta name="dcterms.rights" content="CC BY-NC-ND 4.0" />
      <meta name="dcterms.license" content={LICENSE_URL} />
      <meta name="dcterms.description" content={description} />

      {/* Google Scholar citation tags */}
      {scholarly && (
        <meta name="citation_title" content={citationTitle ?? CITATION.title} />
      )}
      {scholarly && <meta name="citation_author" content={CITATION.author} />}
      {scholarly && (
        <meta name="citation_author_orcid" content={ORCID_URL} />
      )}
      {scholarly && (
        <meta name="citation_author_institution" content="Nairobi, Kenya" />
      )}
      {scholarly && (
        <meta name="citation_publication_date" content={CITATION.date} />
      )}
      {scholarly && <meta name="citation_publisher" content={SITE_NAME} />}
      {scholarly && <meta name="citation_doi" content={CITATION.doi} />}
      {scholarly && <meta name="citation_language" content="en" />}
      {scholarly && <meta name="citation_public_url" content={canonical} />}
      {scholarly && <meta name="citation_abstract_html_url" content={canonical} />}

      <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      {extraLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}
