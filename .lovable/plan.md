# Vinculum Security — Build Plan

Replace the existing MOJJU template with a quiet, institute-style multi-page site for the Vinculum Security doctrine by James Wesley Ndua. All content pulled from the two uploaded PDFs (doctrine + handbook), respecting the section allow/exclude list.

Note on stack: this project is **classic Vite + React Router** (`src/pages/`, `src/App.tsx`), not TanStack file routing. The plan is the same shape as provided; routes just live in `src/pages/*.tsx` and are wired in `App.tsx`, and site-wide `<head>` metadata is set in `index.html` (with `react-helmet-async` for per-page titles/descriptions).

## 1. Teardown

- Delete MOJJU sections in `src/components/` (Hero, Work, Process, Capabilities, Team, Contact, Footer, etc.) and MOJJU-specific assets in `src/assets/`.
- Reset `src/index.css` design tokens.
- Rewrite `src/App.tsx` route table and `src/pages/Index.tsx`.
- Update `index.html` head (title, description, og/twitter). No og:image.
- Wipe project memory entries that describe the MOJJU brand (design system, hero video, awards, team, process, contact) so they don't leak into future work.

## 2. Design system (globals)

In `src/index.css` and `tailwind.config.ts`:

- `--background` `#FAF9F6` warm off-white
- `--foreground` near-black on off-white
- `--primary` navy `#1B2A4A` (header, nav, footer, headings)
- `--accent` gold `#B08D45` (links, rules, hover, focus ring)
- `--navy-tint` `#EAEEF5` (card surfaces)
- `--gold-tint` `#F3ECDC` (alternating table rows, quote surfaces)
- Border radius small (2–4px), no soft startup rounding
- Fonts via `<link>` in `index.html`: **Source Serif 4** (headings) + **Inter** (body); expose as `font-serif` / `font-sans` in Tailwind

Motif rules:

- 1px gold horizontal rule as section divider
- Small-caps navy eyebrow labels above serif H1s
- No stock photography, no decorative icons
- Scroll-triggered fade-in via a small `IntersectionObserver` hook (no framer-motion for this)

## 3. Routing

`src/App.tsx` wires react-router:

```text
/               → Home
/doctrine       → The Doctrine
/foundations    → Theoretical Foundations
/cases          → Case Studies
/methodology    → Methodology
/practice       → Practice: Vinculum Diplomacy
/about          → About the Author
*               → NotFound (kept)
```

Add `HelmetProvider` at the app root and a `<Helmet>` block in each page for per-route title + description + og:title/og:description + self-referential canonical + og:url. Sitewide fallback tags stay in `index.html`.

## 4. Shared components (new)

- `SiteHeader` — sticky navy bar, serif wordmark "VINCULUM SECURITY" left, nav links right with gold underline on active/hover, mobile hamburger opens full-width dropdown panel.
- `SiteFooter` — navy background, gold rule, two centered lines: "© 2026 James Wesley Ndua. All rights reserved." and "First articulated 2026."
- `GoldRule` — short + full-width variants.
- `PageHeader` — small-caps eyebrow + serif H1 + gold rule.
- `FadeIn` — IntersectionObserver one-shot fade+rise wrapper.
- `PullQuote` — gold left-border, serif italic, for canonical definition and founding quotes.
- `NavCard` — home-page navigation cards.

## 5. Pages (content sourced verbatim from the PDFs)

**Home (`/`)** — eyebrow "A Doctrine of Relational Security", serif "VINCULUM SECURITY", gold rule, byline "James Wesley Ndua · Human Security Diplomat". Large pull-quote = canonical definition verbatim from Appendix A. Below the fold: 2–3 sentence plain-language summary from the Executive Summary. Six nav cards to the other pages.

**The Doctrine (`/doctrine`)** — Section III only: III.A canonical definition (verbatim), III.B ontological claim, III.C comparative positioning as a clean semantic `<table>` (navy header row, gold-tint alt rows, columns Framework · Referent of Security · What Vinculum adds), III.D four-level Vinculum Continuum as four navy-tint cards with gold numerals (Interpersonal / Communal / Intergenerational / Institutional-Relational). One-line footnote acknowledging Section IV falsifiability without reproducing it.

**Theoretical Foundations (`/foundations`)** — 11 cards, one per tradition A–K from Section II (Human Security, Ubuntu, Political Realism, Securitization Theory, Positive Peace, R2P, YPS, African Continental Frameworks, Relational & Restorative Justice, Confucian Role Ethics, WPS). 2–3 sentences each summarizing the tradition's core move and what the doctrine takes from it. Two-column grid on desktop, stacked on mobile.

**Case Studies (`/cases`)** — Section VII only. Six cards (Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya). Each: case name (serif) + one summary sentence + compact 4-row bond-integrity table (Interpersonal / Communal / Intergenerational / Institutional-Relational · Score 1–5) with gold-tint alt rows, scores from Section VII. No practice-takeaway prose, no VII.G falsifiability framing.

**Methodology (`/methodology`)** — Section V only: V.A Diagnostic Method as plain prose, V.B Bond-Integrity Indicators as four typographic lists grouped by continuum level. No V.C scoring mechanics.

**Practice: Vinculum Diplomacy (`/practice`)** — Intro pulled from handbook Executive Summary + Statement of Origination, including the founding pull-quote *"I cannot leave the community or the people and substitute it for a role or a room."* Summary of Part I (doctrine → practice; the core behavioral shift). Four Part II principles listed by name + one line each (Interpersonal, Communal, Intergenerational, Institutional-Relational Practice). One closing paragraph noting the handbook includes practical tools for negotiators and mediators — no scripts, worksheets, templates, or failure-modes detail.

**About the Author (`/about`)** — from doctrine Section I. Name; role "Human Security Diplomat · Youth, Peace and Security Advocate"; location Nairobi, Kenya; founding pull-quote; brief "Why This Author, Why Now" note.

## 6. Explicitly excluded (nowhere on the site)

Doctrine Sections VIII, IX, X, XI. Handbook Part V and all appendices. No downloadable PDFs, no forms, no external CTAs.

## 7. Head metadata

`index.html`: title "Vinculum Security — A Doctrine of Relational Security", matching description + og/twitter tags, Organization JSON-LD, no og:image. Per-page `<Helmet>` sets unique title/description/canonical/og:url/og:title/og:description.

## 8. Accessibility & responsiveness

Single H1 per page, semantic `<nav>/<main>/<footer>`, focus-visible gold ring, mobile-first layout, sticky nav `sticky top-0 z-50` with a bottom gold rule.

## 9. Verification

After build: read the two PDFs to lift verbatim strings for the canonical definition, III.C table rows, six case score tables, V.B indicator lists, and Section I / handbook Executive Summary passages. Then run a quick Playwright pass across all seven routes at desktop + mobile widths to confirm sticky nav, table styling, and fade-ins render correctly.
