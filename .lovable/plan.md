# Instagram link, favicon fix, and a keyword/branding pass

## 1. Instagram in the scholarly links
Add a tenth pill in `ScholarlyLinks` for `https://www.instagram.com/vinculumsecurity/`, with a
line-art Instagram mark in the same style as the other nine. Label: "Instagram".

The About page statement gets the new destination and the note you asked for:

"The author's scholarly profiles and the doctrine's underlying repositories are accessible
through the links below, from ORCID and HALOpenScience to Zenodo, OpenAire, OSF, Harvard
Dataverse, Knowledge Commons, Cambridge Open Engage, and the author's portfolio, alongside
Instagram, coming soon, for posts on the doctrine."

Instagram is a social profile, not an archival mirror, so it goes into the `Person` `sameAs`
list (what Google reads to link a person to their accounts) — not into the `Book` sameAs list,
which stays reserved for deposits of the work itself.

## 2. The globe icon in search results
What I verified in the project right now: the icon files are all correct and square with a
solid cream background (16/32/48/96/192/512 PNG plus a multi-size `.ico`), robots.txt allows
Googlebot and Googlebot-Image, and the homepage head declares them. Nothing is broken in the
obvious sense. What is wrong is the *shape* of the declaration, and that is the exact thing
that makes Google fall back to the globe:

- Six competing `<link rel="icon">` tags. Google picks one favicon per site and does not merge
  a set; when several candidates compete it frequently discards all of them. The fix is a
  single authoritative `rel="icon"` (one PNG at a multiple of 48px, Google's documented
  requirement) plus one `rel="apple-touch-icon"` and the manifest. The rest go.
- `favicon.ico` currently holds 16, 32, 48, 64, 96, 128 and 256 frames. It gets rebuilt with
  only 48-multiple frames (48, 96, 144, 192), so whichever frame Google reads satisfies the
  size rule.
- The primary icon URL moves to a stable path Google has not already cached under a rejected
  verdict, with the `.ico` kept only as the legacy browser fallback. A fresh URL is
  re-evaluated on the next crawl instead of being served from the old negative cache — this is
  the part that made the fix land on your other site.
- `og-image.jpg`, `apple-touch-icon.png` and the manifest icons are confirmed present and
  branded; the manifest gets an `id` and its icon list is trimmed to match the new declaration.

Honest limit: the icon shown in a result is whatever Googlebot last fetched. These changes make
the next fetch succeed and stop it discarding the icon; the swap lands on Google's crawl
schedule, which no code can force. You are not being asked to re-index — the point is the next
crawl now resolves to the Vinculum mark instead of the globe.

## 3. Branding audit across every surface
Check and correct where needed so all of these carry the Vinculum mark and current wording:
favicon set, apple-touch-icon, `site.webmanifest`, `og-image.jpg`, the seven per-route OG
images in `public/og/`, the `Organization` logo node, the sitemap `image:` entries, and the
`og:image` / `twitter:image` fallbacks. Routes without a dedicated OG image (Home, Practice)
fall back to the branded default rather than to nothing.

## 4. Keywords and metadata sharpening
Keywords are currently one generic list repeated sitewide, which dilutes every page. Instead:

- A tight sitewide core in `index.html`: Vinculum Security, a doctrine of relational security,
  relational security doctrine, bond integrity, the bond as the unit of security analysis,
  Vinculum Continuum, Vinculum Diplomacy, James Wesley Ndua.
- Per-page keyword sets already flow through the `SEO` component's `keywords` prop — each route
  gets its own, drawn from that page's actual vocabulary (continuum levels, the thirteen
  traditions, the eight cases, bond-integrity indicators, glossary terms).
- Descriptions re-checked so each is unique, under 160 characters, leads with "doctrine", and
  never subordinates the work to another field.
- `llms.txt` refreshed with the Instagram entry and the current link roster.

## Files touched
- `src/components/ScholarlyLinks.tsx` — Instagram mark + entry
- `src/pages/About.tsx` — statement rewrite
- `src/lib/seo-entities.ts` — Instagram in `SAME_AS`, keyword constants
- `index.html` — icon declarations, keywords, `sameAs`
- `public/favicon.ico`, `public/site.webmanifest` — rebuilt icon set
- `public/llms.txt`, `public/sitemap.xml` — link roster and image entries
- Page files under `src/pages/` — per-route keywords and descriptions