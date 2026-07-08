import { Helmet } from "react-helmet-async";

export default function SEO({ title, description, path }: { title: string; description: string; path: string }) {
  const full = `${title} — Vinculum Security`;
  return (
    <Helmet>
      <title>{full}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={path} />
      <meta property="og:title" content={full} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={path} />
      <meta name="twitter:title" content={full} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
}
