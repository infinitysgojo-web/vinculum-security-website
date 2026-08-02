# Correct Vinculum Security’s search framing and undo the unwanted UI additions

## Outcome

Present Vinculum Security consistently as an original, standalone doctrine—also stated as **A Doctrine of Relational Security**—without creating a separate “Relational Security” page or adding a sitemap-style footer. Preserve “relational security” in titles, metadata, structured data, glossary content, and keywords.

Search engines and AI systems ultimately choose their own summaries and rankings, so no site can guarantee exclusive or immediate source status. This work will make the official site’s signals as clear and authoritative as possible; Google must then recrawl them.

## Implementation

### 1. Remove the unwanted page and footer navigation
- Delete the `/relational-security` page and remove its route and header link.
- Remove the recently added page-directory block from the footer, restoring the earlier compact footer.
- Remove the retired route from `sitemap.xml` and `llms.txt`.
- Remove its navigation entry from structured data.
- Retarget the existing “Relational security” `DefinedTerm` to the glossary rather than deleting the term or its SEO value.

### 2. Eliminate machine-readable misclassification signals
- Rewrite the central doctrine description and JSON-LD disambiguation in affirmative language that does not repeat the phrase “human security framework,” because AI summaries may ignore negation and retain the nearby category words.
- Keep the canonical doctrine definition and the claim that **the bond is the unit of security analysis** prominent.
- Remove “Human Security” from flat `about` and `knowsAbout` taxonomies where it can be read as a parent category of the doctrine.
- Preserve “Human Security Diplomat” only as the author’s biographical title where accurate, clearly separated from the classification of Vinculum Security.
- Rewrite Foundations wording such as “point of departure” and “relational specification” so the page describes other traditions as comparative intellectual sources, not parent frameworks.
- Audit all visible copy, metadata, JSON-LD, `llms.txt`, keywords, and descriptions for remaining language that could subordinate Vinculum Security to human security.

### 3. Strengthen the official-source signals
- Make the site, author, doctrine name, DOI, canonical definition, and archival relationships agree across `index.html`, route metadata, JSON-LD, and `llms.txt`.
- Describe repositories such as Zenodo, Harvard Dataverse, HAL, OpenAIRE, OSF, and Knowledge Commons as archival mirrors or secondary access points; the official website remains the canonical originating source.
- Keep “relational security,” “A Doctrine of Relational Security,” “Vinculum Security doctrine,” “bond-integrity,” and “Vinculum Continuum” in relevant metadata without keyword stuffing.
- Keep canonical URLs, sitemap entries, and crawl rules aligned with `https://www.vinculumsecurity.kidnexus.or.ke`.

### 4. Correct and verify the search favicon
- Keep the existing public 48×48 and larger favicon assets; live checks confirm they return HTTP 200 with the correct image types, and the ICO contains 48×48 and 96×96 entries.
- Correct the ICO declaration from a misleading single `48x48` size to `sizes="any"` while retaining the explicit 48×48 PNG declaration.
- Create/use a padded mask-safe icon for the web manifest instead of marking the edge-to-edge logo as maskable.
- Verify the raw deployed HTML exposes the icon links without JavaScript and that the icon URLs remain crawlable.
- Document the required external step: request indexing for the homepage in Google Search Console. The current globe is most likely Google’s cached favicon; code cannot force an immediate refresh.

### 5. Verify the result
- Build the project and render every public route.
- Confirm `/relational-security` and the footer directory are gone.
- Inspect resolved metadata and JSON-LD to ensure there is no remaining statement or taxonomy classifying Vinculum Security under human security.
- Validate the JSON-LD graph, sitemap, `robots.txt`, `llms.txt`, canonical URLs, favicon dimensions, and live favicon response types.
- Confirm “relational security” remains strongly represented through the doctrine’s established name, route metadata, glossary entity, and keywords.

## Technical notes

- No SSR migration is required for the favicon or this classification correction. Static sitewide metadata and icon links are already visible in raw HTML; Google can render the route metadata.
- Client-rendered route-specific social metadata remains less reliable for non-JavaScript social crawlers. Accurate per-route previews for every crawler would require SSR, but it is separate from the requested rollback and framing correction.
- Existing SEO scanner results are stale, so verification will rely on the updated source and rendered output; a fresh SEO rescan can be run afterward.