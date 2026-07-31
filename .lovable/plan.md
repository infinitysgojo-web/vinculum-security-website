## What I found

- `public/og-image.jpg` exists at **1200×640** (spec is 1200×630) and every page shares it. `index.html` and `src/components/SEO.tsx` both point at it, so previews are identical everywhere.
- `public/favicon.png` is a **1024×1024, 562 KB** PNG and is the only icon. There is **no `/favicon.ico`**, no 32×32 or 180×180 variant, and no web manifest. Google's search result icon and most browsers probe `/favicon.ico` first — that's the most likely reason a globe placeholder shows next to the result.
- `public/sitemap.xml` covers all 8 routes in `src/App.tsx` and uses correct canonical URLs. `public/robots.txt` is already comprehensive (web + AI crawlers, sitemap directive). Both need only light additions.
- `public/llms.txt` still lists Figshare in the "do not treat as primary" sentence even though the link was removed from the site.

## Plan

### 1. Icons (fixes the blank/globe icon)
- Generate a clean square brand mark derived from the existing Vinculum mark and emit:
  - `public/favicon.ico` (multi-size 16/32/48)
  - `public/favicon-32.png`, `public/favicon-192.png`, `public/apple-touch-icon.png` (180×180)
  - keep `public/favicon.png` but compress it
- Add `public/site.webmanifest` with name, short name, icons, theme colour `#F5EBDD`.
- Wire all of them into `index.html` (`icon`, `shortcut icon`, `apple-touch-icon`, `manifest`).
- Point the Organization JSON-LD `logo` at a real square PNG (Google requires a logo it can crawl for the knowledge panel).

### 2. Per-route OpenGraph / Twitter images
- Generate one 1200×630 JPG per public route (home, doctrine, foundations, methodology, practice, cases, about, glossary), each rendered in the site's existing typography and palette with: page title, "James Wesley Ndua", and a one-line description. Consistent layout across all eight so previews look like a set.
- Replace the 1200×640 default with a new 1200×630 `og-image.jpg`.
- Extend `src/components/SEO.tsx` with an `image` prop (defaults to the site image) and update the width/height meta to 630.
- Pass the matching image from each page in `src/pages/*.tsx`.
- Note: social crawlers (LinkedIn, Slack, Facebook) don't run JS, so they'll read the static `index.html` image; Google and AI crawlers that execute JS will read the per-route ones. That's the ceiling without SSR, which you asked me not to do.

### 3. Metadata and primary-source hardening
- Audit every page's title (<60 chars incl. suffix) and description (<160 chars) for length, keyword accuracy, and no duplication.
- Give each route its own targeted `keywords` set instead of shared generic terms.
- Add to the `index.html` `@graph`: `Organization.logo` as a proper `ImageObject` with width/height, `WebSite.publisher`/`copyrightYear`, and an explicit `CreativeWork.isBasedOn`-free statement that repositories are `sameAs` mirrors (already partly there, will be completed and validated).
- Add `Article`/`ScholarlyArticle` `isPartOf` links from each page back to `#book`, so crawlers see one work with eight chapters rather than eight unrelated pages.
- Add `speakable` and `FAQPage` markup on Home for answer-engine extraction of "what is Vinculum Security" and "who is the author".
- Update `public/llms.txt`: drop the stale Figshare mention, add a machine-readable citation block (APA + BibTeX) and a "primary source precedence" line.

### 4. Sitemap and robots
- Keep the existing sitemap structure and URLs (they are correct); add `<image:image>` entries pointing at each route's new OG image so Google Images can associate the brand visual with each page.
- Leave `<lastmod>` out — there is no authoritative per-page timestamp in the project, and a build-time date would be misleading.
- `robots.txt`: keep every existing block, add `User-agent: Googlebot-News`, `meta-externalagent`, and `Bingbot`-adjacent AI agents that are currently missing, and keep the sitemap directive.

### 5. Verification
- Build, then load each route headless and dump the resolved `<head>` to confirm canonical, og:url, og:image, and JSON-LD are self-referencing and correct per route.
- Validate the JSON-LD graph parses and every `@id` reference resolves.
- Confirm `/favicon.ico` and every generated image are served at their exact paths.

### Technical notes
No architecture change, no SSR, no new dependencies. Image generation runs once and the results are committed as static files under `public/`. After publishing, cached previews on LinkedIn/X/Facebook won't update until you force a refetch in each platform's link-preview debugger.
