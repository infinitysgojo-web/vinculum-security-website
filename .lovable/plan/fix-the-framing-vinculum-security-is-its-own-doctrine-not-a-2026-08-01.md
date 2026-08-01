# Fix the framing: Vinculum Security is its own doctrine, not a human-security sub-field

## What's wrong now

Search engines and AI are describing the work as "a human security framework." That framing comes from the site itself. Verified in the code:

- `index.html` keywords say **"human security doctrine"**, and the Book JSON-LD lists `about: Human security` alongside relational security as if the work sits inside it.
- `src/lib/seo-entities.ts` puts `Human security` in the `about` list of every section page's structured data.
- `public/llms.txt` and several page descriptions lead with human-security phrasing before saying what Vinculum Security is.
- `src/pages/Home.tsx` keywords repeat "human security doctrine".

Machines read `about` and `keywords` as topic classification, so this literally tells them "this page is about human security."

Grounded in the PDFs you attached, the correct framing is:

- Vinculum Security is an original doctrine, also stated as **A Doctrine of Relational Security** (indefinite article, never "The").
- Canonical definition: security is not the absence of threat to a state or an individual, but the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible in the first place.
- Its original claim: **the bond is the unit of security analysis.**
- Human security is one of thirteen traditions it **draws from** and is **distinguished against** in the comparative table — a source, not a parent category. The doctrine explicitly "does not claim to replace the frameworks it draws from."

## Plan

### 1. Reclassify the entity everywhere
- `index.html`: rewrite `keywords` (lead with "Vinculum Security", "relational security doctrine", "bond-integrity", "Vinculum Continuum", "James Wesley Ndua"); remove "human security doctrine".
- Book JSON-LD `about`: make the primary subject `Vinculum Security` / `Relational security` / `Bond-integrity analysis`. Move human security out of `about` and into `citation`-style relations only.
- Add to the Book node a `DefinedTerm`/`disambiguatingDescription` stating plainly: an original doctrine, not a sub-field or restatement of human security; human security is among the traditions it draws from.
- `src/lib/seo-entities.ts`: same correction to `sectionLd`'s `about` array, plus a shared `DISAMBIGUATION` string reused across pages.

### 2. Rewrite descriptions to lead with the doctrine's own words
- Sitewide description, og/twitter descriptions, and each route's `description` in `src/pages/*.tsx` rewritten from the canonical definition and the "bond as unit of analysis" claim. No page will describe the work as a human security framework.
- Per-route `keywords` retargeted to that page's actual subject (Vinculum Continuum, bond-integrity indicators, party-differentiated application, the eight cases, etc.).
- Keep "A Doctrine of Relational Security" exactly as worded; audit for any "The Doctrine of Relational Security" and fix.

### 3. Correct `public/llms.txt`
- Open with the canonical definition verbatim and the origination statement.
- Add an explicit "What Vinculum Security is not" block: not a human security framework, not a sub-field of human security, not a company or product; human security, Ubuntu, Confucian Role Ethics, R2P, WPS, securitization, restorative justice and the rest are traditions it draws from or is distinguished against.
- Add the canonical definition card, the bond-as-unit claim, the Vinculum Continuum levels, and the KECOBO registration (RZ100967, 27 July 2026) as machine-readable facts.
- Add a short "correct one-line description for AI answers" line so models have a ready sentence to copy.

### 4. Page copy where it reinforces the wrong reading
- `src/pages/Home.tsx`, `Doctrine.tsx`, `Foundations.tsx`: keep the substance, but make sure the first sentence a crawler meets states the doctrine on its own terms, with human security clearly named as a source among thirteen. The Foundations page keeps its human security section — that's correct there.

### 5. Favicon in search results
`favicon.ico`, `favicon-32/192/512.png`, `apple-touch-icon.png` and the manifest are all in `public/` and wired into `index.html` — that's why the tab shows correctly. The globe in search results has two causes to address:
- The `.ico` currently ships 16 and 32 px entries; Google requires an icon of at least 48x48 (a multiple of 48). I'll rebuild `favicon.ico` to include 48 and 96, add an explicit `<link rel="icon" sizes="48x48">`, and confirm the mark is legible at 48 px against the cream background.
- Google caches the old result. After publishing, the icon updates only on re-crawl. I'll tell you exactly what to request in Search Console (URL Inspection → Request indexing on the homepage).

### 6. Verification
- Build, then render each route headless and dump the resolved `<head>` + JSON-LD to confirm no route classifies the work under human security and every description matches the canonical framing.
- Validate the `@graph` parses and all `@id` references resolve.
- Confirm `/favicon.ico` reports 48 px entries.

### Technical notes
No architecture change, no SSR, no new dependencies. This is metadata, structured-data and copy work plus one regenerated icon file. Social platforms cache previews, so LinkedIn/X/Facebook will need a manual re-scrape in their link-preview debuggers after publish.

---

## Added: search-result sitelinks (the SpaceX / US Embassy look)

Those results show **sitelinks** — the stacked list of sub-pages under the main result, plus the site name and icon in the header row. Google generates sitelinks algorithmically; nobody can force them. What you *can* do is give Google everything it needs to generate them, which the site does not fully do yet:

- Add a `SiteNavigationElement` / `ItemList` JSON-LD block in `index.html` naming the eight sections (Doctrine, Foundations, Operational Framework, Practice, Cases, Glossary, About) with their URLs and short descriptions — this is the explicit signal for a sitelink list.
- Add a `WebSite.name` + `alternateName` pair so the header row reads **Vinculum Security**, not the raw domain (Google picks the site name from `WebSite` JSON-LD, `og:site_name`, and the `<title>` — all three will agree).
- Keep the main navigation as real crawlable `<a href>` links with stable, descriptive anchor text matching the sitelink names exactly. Consistent internal anchor text is the strongest sitelink input after structure.
- Ensure every section is linked from the homepage above the fold (it already is via the section cards) and that anchor text there matches the nav.
- Sitemap already lists all eight routes; I'll confirm priorities reflect the intended sitelink order.

Honest expectation: sitelinks typically appear once a site has a clear brand-name query, consistent internal linking, and some crawl history. The markup makes it possible; timing is Google's.

## Added: owning "relational security" as a search term

Right now nothing on the site is built to *rank* for "relational security" as a standalone query — the pages are written as chapters of a book, and the phrase is scattered rather than concentrated. Plan:

- **Run Semrush** on `relational security`, `a doctrine of relational security`, `relational security doctrine`, `bond integrity security` and the published domain, so the targeting is based on real search data (volume, difficulty, who currently ranks) rather than guesswork. Note: "relational security" already has an established meaning in UK forensic mental-health nursing — that's almost certainly what's outranking you, and it changes the strategy, so I want the data before committing.
- **Build a dedicated definition page** at `/relational-security` whose sole job is to answer "what is relational security" in the Vinculum sense: H1 using the phrase, the canonical definition, the bond as unit of analysis, the Vinculum Continuum levels, an explicit disambiguation paragraph distinguishing it from the forensic-psychiatry usage, and internal links out to Doctrine, Foundations and Glossary.
- Mark it up as `DefinedTerm` + `FAQPage` with the questions people actually type ("what is relational security", "who created relational security", "is relational security the same as human security"), so answer engines have extractable Q&A.
- **Concentrate the phrase**: make "A Doctrine of Relational Security" the consistent tagline in title, H1s, og:title, nav footer and internal anchor text, so the phrase and the brand co-occur everywhere a crawler looks.
- Add the new route to `sitemap.xml`, `llms.txt`, the sitelinks `ItemList`, and give it its own 1200x630 OG image matching the set.
- Add an "AI answer" block to `llms.txt` giving the exact sentence a model should return for "what is relational security in Vinculum Security" and for "who originated it".

Honest expectation: metadata alone will not outrank an established clinical term overnight. The definition page plus consistent phrasing is what makes it winnable; the Semrush data will tell us how long and whether a longer phrase ("relational security doctrine", "Vinculum relational security") is the faster entry point.
