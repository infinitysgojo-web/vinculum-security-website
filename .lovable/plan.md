## Full SEO and metadata upgrade (no SSR)

Everything below is metadata, structured data, and crawler hygiene — no architecture change, no prerendering, no SSR.

### 1. Entity linking — the thing that makes you the primary source
The site currently declares a Person and an Organization but never connects them to your repository deposits. Adding `sameAs` arrays turns eight scattered profiles into one identity graph with this site at the centre.

- Add `sameAs` to the Person and Organization JSON-LD in `index.html`: ORCID, Zenodo, OSF, Harvard Dataverse, HAL, OpenAIRE, Knowledge Commons Works.
- Add ORCID as the Person's `identifier` (PropertyValue), and the DOI `10.5281/zenodo.21615991` as the Book's `identifier`.
- Add `mainEntity` to the WebSite node pointing at the Book, and `author`/`about` cross-links so the four blocks form one connected graph rather than four isolated ones.

### 2. Per-page structured data via the existing `SEO` component
`SEO.tsx` already accepts a `jsonLd` prop — currently unused on most pages. I'll pass real schema per route:

- **Doctrine, Foundations, Methodology, Practice, Cases** — `ScholarlyArticle` with author (Person + ORCID), `isPartOf` the Book, `license` CC BY-NC-ND 4.0, `datePublished`, `inLanguage`, `publisher`, DOI identifier.
- **Glossary** — `DefinedTermSet` with a `DefinedTerm` per entry from `src/content/glossary.ts`, so a model lifting a definition carries your attribution.
- **About** — `ProfilePage` + full `Person` with ORCID and all `sameAs` links.
- **Home** — `WebPage` bound to the Book as `mainEntity`.

### 3. Harden the `SEO` component itself
- Add `og:locale`, `og:image:width` (1200), `og:image:height` (630), `og:image:alt`.
- Add `article:author`, `article:published_time`, and `twitter:creator` where relevant.
- Add `<meta name="citation_title">`, `citation_author`, `citation_publication_date`, `citation_doi`, `citation_language` — Google Scholar tags. These matter a lot for a scholarly work and are currently absent entirely.
- Add `dcterms.*` Dublin Core tags (title, creator, rights, identifier) — read by academic indexers.

### 4. Page-level metadata audit
Check every page's title length (<60 chars), description (<160), keyword targeting, single H1, and heading hierarchy. Tighten any that are generic, truncated, or duplicated across routes.

### 5. Crawler and discovery files
- **`llms.txt`** — add the ORCID, DOI, preferred-attribution line, KECOBO registration number, and an explicit "this site is the canonical origin; repository deposits are archival mirrors" statement. This file is read directly by several AI crawlers.
- **`robots.txt`** — already strong; I'll verify only and leave the crawler blocks intact.
- **`sitemap.xml`** — verify all eight routes match `App.tsx`, no `lastmod` invented.
- Confirm `googlefb38a3123ab3f382.html` verification file still serves.

### 6. Social preview correctness
- Verify `og-image.jpg` exists, is 1200×630, and resolves at the absolute canonical URL.
- Confirm the static `index.html` OG block stays as the fallback for non-JS social crawlers, while `SEO.tsx` supplies per-route tags for Google.

### 7. Verify
- Build and confirm no errors.
- Validate every JSON-LD block against schema.org's structural rules.
- Screenshot-check nothing visual regressed.

### Technical note
`react-helmet-async` applies per-route tags client-side. Google executes JS and reads them; LinkedIn, Slack, and Facebook do not, which is why the sitewide OG block in `index.html` stays as the fallback. Every JSON-LD change to `index.html` ships in the raw HTML and is visible to all crawlers including AI ones — that's where the entity-linking work lives, so it lands regardless of JS.

### One thing outside the code
Ranking above Zenodo also needs those repository records pointing back here. In each Zenodo, OSF, Dataverse, HAL, and Knowledge Commons deposit, set the related-identifier or "alternate identifier" field to `https://www.vinculumsecurity.kidnexus.or.ke/`. Ten minutes of edits, and it's the strongest single signal that this site is the origin and they are mirrors.
