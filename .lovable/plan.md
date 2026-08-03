# Cambridge Open Engage link, About cleanup, and a sitelinks panel

## 1. Add Cambridge Open Engage to the scholarly links
Add a ninth pill in `ScholarlyLinks` (footer + wherever the component renders) for
`https://www.cambridge.org/engage/coe/article-details/6a69e74c4770e67d9259a4fc`, with a small
line-art mark in the same style as the others. Also add the URL to the canonical `sameAs`
list so search engines and AI crawlers treat it as another archival mirror of the same work.

## 2. About page: statement only, no duplicate pills
Under "Profiles and Repositories", keep just the sentence and remove the pill row (it already
lives in the footer). Updated sentence naming every current destination:

"The author's scholarly profiles and the doctrine's underlying repositories are accessible
through the links below, from ORCID and HALOpenScience to Zenodo, OpenAire, OSF, Harvard
Dataverse, Knowledge Commons, Cambridge Open Engage, and the author's portfolio."

## 3. Remove every trace of Figshare
The only remaining mention in the project is that About sentence; a repo-wide search confirms
nothing else references it. The rewrite removes it completely.

## 4. Sitelinks-style navigation panel on the home page
Add a layout-only component rendered on the home page directly beneath a short overview blurb:
a vertical stack of full-width rows, one per page, each clickable with the page name on the
left and a right-facing chevron on the right, thin rules between rows — matching the Google
sitelinks pattern in the reference screenshots.

Rows (every public page): Doctrine, Theoretical Foundations, Case Studies, Methodology,
Vinculum Diplomacy, Doctrine Glossary, About the Author.

Styling uses existing tokens (brass rules, serif/primary text, accent hover). No content,
routing, or data changes.

## 5. Schema.org Organization and Article — what it does, and what's already there
The site already emits `Organization`, `Person`, `Book`, `BreadcrumbList`, `FAQPage`, and a
`ScholarlyArticle` on every doctrine page. So the requested markup is largely in place. What it
buys you:

- **Organization** — lets Google attach a name, logo, and official-site identity to the domain,
  which is what drives the brand icon and knowledge-panel-style result.
- **Article / ScholarlyArticle** — tells crawlers each doctrine page is an authored work with a
  headline, author, publish date, license, and DOI, so AI answers attribute the doctrine to
  James Wesley Ndua and cite this site rather than a mirror.

Two additions worth making while here:
- `SiteNavigationElement` JSON-LD listing the same rows as the sitelinks panel — the markup
  Google reads when choosing sitelinks.
- `ItemList` of the doctrine sections on the home page, reinforcing this site as the parent
  work rather than any repository deposit.

## Files touched
- `src/components/ScholarlyLinks.tsx` — Cambridge mark + entry
- `src/lib/seo-entities.ts` — `SAME_AS` entry
- `src/pages/About.tsx` — statement rewrite, remove pill row
- `src/components/SitelinksNav.tsx` — new layout component
- `src/pages/Home.tsx` — render blurb + panel, add navigation JSON-LD