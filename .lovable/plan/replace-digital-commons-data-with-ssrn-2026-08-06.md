# Replace Digital Commons Data with SSRN

## What changes

Remove every trace of Digital Commons Data (Mendeley) from the site, and add SSRN (Social Science Research Network) in exactly the same places, linking to
`https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7189099`.

## Where

- **Links row** (`src/components/ScholarlyLinks.tsx`): delete the Digital Commons Data pill and its icon component; add an SSRN pill with a matching small line-art mark, in the same position among the repository pills.
- **Structured data source** (`src/lib/seo-entities.ts`): swap the Mendeley URL for the SSRN URL in the canonical `sameAs` list.
- **Static homepage JSON-LD** (`index.html`): replace the Mendeley URL in all three `sameAs` blocks so non-JavaScript crawlers see SSRN instead.
- **About copy** (`src/pages/About.tsx`): the Profiles and Repositories sentence names SSRN in place of Digital Commons Data; the Instagram "coming soon, posts on the doctrine" wording stays.
- **AI source file** (`public/llms.txt`): replace Digital Commons Data with SSRN in both the archival-mirrors list and the "do not present as origin" sentence, keeping the website as primary canonical source.

No favicon, OG image, sitemap, or layout changes.

## Verification

Search the codebase for "mendeley" and "Digital Commons" afterwards to confirm zero remaining references, and check the links row renders the SSRN pill in the local preview.
