import { Helmet } from "react-helmet-async";

type Breadcrumb = { name: string; path: string };

type SEOProps = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  keywords?: string;
  breadcrumbs?: Breadcrumb[];
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
};

const SITE_NAME = "Vinculum Security";
const SITE_URL = "https://www.vinculumsecurity.kidnexus.or.ke";

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
  const ogImage = abs("/og-image.jpg");
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
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <link rel="canonical" href={canonical} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
      {extraLd.map((ld, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(ld)}
        </script>
      ))}
    </Helmet>
  );
}
