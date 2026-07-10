## Scope

Four discreet, high-craft additions that respect the Imperial Folio system (Forum Sunset palette, Cormorant + Inter, brass hairlines, cream ground). No new dependencies — reuses shadcn `Dialog` + `Command` (already installed) and native APIs.

---

### 1. Reading Progress Bar — long pages only

A 2px terracotta bar fixed to the very top of the viewport, drawn *underneath* the header's 2px imperial-blue rule so the two read as a single hairline pair (blue baseline, terracotta fill).

- New `<ReadingProgress />` component: listens to `scroll` on a target ref, writes `transform: scaleX(n)` on rAF.
- Renders only when the page opts in (`<ReadingProgress />` mounted in `Doctrine`, `Foundations`, `Methodology`, `Cases`, `Practice`, `Glossary`). Not on `Home` or `About`.
- Fades in after 200px scrolled so it doesn't flicker on short viewports.
- `prefers-reduced-motion` → no transition, just snap.

### 2. Sticky Table of Contents — long pages only

A slim right-rail TOC on `lg+` screens; collapses into an inline "In this section" block at the top on mobile. Understated, not a sidebar chrome-block.

- New `<SectionNav />` component: takes `items: { id, label, numeral? }[]`.
- Desktop (`lg+`): `position: sticky; top: 6rem;` in a narrow right column. Vertical brass hairline on the left edge; each item is Inter 11px uppercase, letter-spacing 0.18em, `text-primary/60` inactive → `text-accent` active with a 1px terracotta tick to the left. Optional small Roman numeral prefix in brass.
- Mobile: renders as a compact "Contents" disclosure below the PageHeader with the same list, no sticky behavior.
- Active section: `IntersectionObserver` with `rootMargin: "-40% 0px -55% 0px"` so the active item updates when the section crosses the viewport's upper third.
- Anchor targets: add `id` + `scroll-mt-24` to each `<section>`/eyebrow block on Doctrine (III.A–D), Foundations (thinkers), Methodology (phases), Cases (each case), Practice, Glossary (letter groups).
- Layout: wrap page body in `lg:grid lg:grid-cols-[1fr_180px] lg:gap-12`. Only applied on pages that use `<SectionNav />`.

### 3. Print Stylesheet

Add a `@media print` block in `index.css`. Goals: readable folio, preserved citations, no chrome.

- Hide: `SiteHeader`, `SiteFooter`, `ReadingProgress`, `SectionNav`, filter/compare controls on Cases, mobile menu, search inputs.
- Body: white background, black ink, Cormorant 11pt body / 10pt sidenotes, 1.45 line-height, single column, 2cm margins.
- Links: keep terracotta underline; append the `href` for external links via `a[href^="http"]::after { content: " (" attr(href) ")"; font-size: 8pt; }`.
- Citations (`<Cite>` popovers): expand inline — after each `.cite-term`, print `[n]` and collect a numbered footnotes list at page end using CSS counters. Approach: `counter-increment` on `.cite-term`, `content: " [" counter(cite) "]"`, plus a print-only `<PrintFootnotes />` block rendered on each long page that lists the glossary entries actually cited on that page (small serif, brass rule above).
- Page breaks: `h2, h3 { break-after: avoid; }`, `blockquote, table { break-inside: avoid; }`.
- Roman numeral dividers, brass rules → keep (they print as thin black rules).

### 4. Command Palette — my recommendation

**Recommendation: skip the sitewide ⌘K.** You're right — with the top nav, Glossary search, and Cases filters, a global palette duplicates existing surfaces and adds a "SaaS product" feel that fights the diplomatic-folio tone.

**Instead, do one focused thing:** a **⌘K Glossary Jump** available *only* on the `/glossary` page and inside any `<Cite>` popover ("Search all terms →"). It reuses the existing search, adds keyboard-first navigation, and stays scoped to reference material — which is where fast lookup actually helps a reader.

- On `/glossary`: `⌘K` / `Ctrl+K` opens a shadcn `CommandDialog` filtered to glossary terms only. Enter jumps to the term with the existing highlight animation.
- No global hotkey listener elsewhere. No page-jump entries. No recent items. No "AI" affordance.
- Small "⌘K" chip next to the glossary search input as the only discovery hint.

If you'd rather have nothing at all, say so and I'll drop item 4 entirely.

---

### 5. Logo, Favicon, OG Image

One coherent mark in the Imperial Folio language. No stock heraldry, no laurel clip-art.

**Concept — "The Bond":** a hand-drawn monogram of two interlocking serif `V`s (Vinculum) forming a single continuous ligature — reading as a knot / bond / infinity turn. Imperial blue `#1B3A6B` on cream `#F5EBDD`, with a single 1px terracotta hairline underscoring it. Cormorant proportions, slightly weighted strokes with terminal serifs. Feels like a diplomatic seal engraving, not a tech logo.

- Generate one master SVG-style PNG at 1024×1024 (transparent) via `imagegen`, premium quality (typography-sensitive), transparent background.
- **Favicon**: crop the monogram tight, export 512×512 PNG → `public/favicon.png`. Delete `public/favicon.ico`. Update `<link rel="icon">` in `index.html`.
- **OG image** (1200×630): centered monogram, brass hairline above and below, wordmark "VINCULUM SECURITY" in Cormorant small-caps, single italic line "A Doctrine of Relational Security" below in terracotta. Saved to `public/og-image.jpg`. Since Lovable serves social previews from the deployment, I'll only wire `og:image` if you provide a published domain later — otherwise the file sits ready and Lovable's hosting will pick it up on publish.
- **In-app usage**: replace the plain "Vinculum Security" wordmark in `SiteHeader` with the monogram (24px) + wordmark, and place a larger version on the `Home` hero and `About` page. Footer keeps the three-dot signature.
- Iterate once — if the first generation isn't right I'll refine before shipping.

---

## Files touched

- **New:** `src/components/ReadingProgress.tsx`, `src/components/SectionNav.tsx`, `src/components/PrintFootnotes.tsx`, `src/components/Logo.tsx`
- **New assets:** `src/assets/vinculum-mark.png` (+ favicon, og-image via `public/`)
- **Edited:** `index.css` (print block, `.reading-progress`, `.section-nav` styles), `index.html` (favicon link, og:image only if domain provided), `SiteHeader.tsx` (logo), `Home.tsx` (logo hero), `About.tsx` (logo), `Doctrine.tsx` / `Foundations.tsx` / `Methodology.tsx` / `Cases.tsx` / `Practice.tsx` / `Glossary.tsx` (section IDs + `<ReadingProgress />` + `<SectionNav />` wrapper + `<PrintFootnotes />`), `Glossary.tsx` (scoped ⌘K CommandDialog + chip)

## What I'm deliberately NOT doing

- No global ⌘K palette
- No dark/night mode toggle
- No animated logo, no gradient logo, no icon set
- No page-transition animations
- No new fonts, no new colors
- No changes to Cases filters, comparison dialog, or existing glossary data

Confirm and I'll build it; say "drop 4" and I'll ship 1–3 + logo only.
