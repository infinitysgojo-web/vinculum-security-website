# Plan: Vibrant Diplomat Layer + Glossary + Cases Filters

Adds a UN-diplomat visual layer (badges, section chips, animated numerals), a glossary system with clickable inline citations sourced from the two PDFs, richer microinteractions, and interactive filtering on the Cases page. Keeps the locked Imperial Folio system (Forum Sunset palette, Cormorant + Inter, cream ground, brass hairlines) intact.

---

## 1. Diplomat Badges & Section Highlights

New reusable `<Badge>` component with variants:
- `doctrine-core` — terracotta fill, cream text, brass hairline border
- `field-notes` — imperial-blue outline, blue text on cream
- `briefing-ready` — brass fill, ink text
- `case-study`, `foundation`, `handbook`, `methodology` — muted variants for taxonomy

Placement:
- **Home** — badge row above the wordmark ("Doctrine Core · Briefing Ready · Field-Tested")
- **Doctrine / Foundations / Methodology / Practice / Cases / About** — a single badge under each PageHeader eyebrow indicating section character
- **NavCards** — small corner badge (top-left) replacing plain eyebrow when the card links to a "core" section
- **Case articles** — badge strip under the title (region · pillar · era)

Shape: micro-caps Inter 10px, `0.22em` tracking, 2px vertical padding, 8px horizontal, subtle `hover:-translate-y-0.5` lift.

## 2. Glossary + Inline Citations

New route `/glossary` with 20–30 canonical terms drawn from the two PDFs (Vinculum, Bond Integrity, Ubuntu, Confucian Role Ethics, Human Security, R2P, Vinculum Continuum, Palava Hut, Gacaca, YPS, etc.). Each entry:
- Term, short definition, doctrine section reference (e.g. "Doctrine § III.2"), and a verbatim quoted passage.
- Anchor `id` per term so `/glossary#ubuntu` deep-links.

Inline citation component `<Cite term="ubuntu">Ubuntu</Cite>`:
- Renders the term with a dotted terracotta underline.
- On hover/focus opens a Radix Popover (already available via shadcn) showing the definition, source section, and a "Open in glossary" link.
- Keyboard accessible (`Enter` opens, `Esc` closes, focus trap).

Data source: a single `src/content/glossary.ts` seeded from the PDFs. No backend; static import.

Rollout: wrap key first-mentions on Home, Doctrine, Foundations, Methodology, Practice, and About with `<Cite>` — not every occurrence, only the first per page to keep prose clean.

Add `/glossary` to `SiteHeader` nav and footer.

## 3. Microinteractions

Keep tasteful; no framer-motion dependency added. Uses existing `FadeIn` + CSS.

- **Hover lift**: `.hover-lift` utility (`transition-transform hover:-translate-y-1 hover:shadow-[0_12px_30px_-18px_hsl(var(--primary)/0.35)]`) applied to NavCards and Case articles.
- **Scroll parallax (subtle)**: a lightweight `useParallax` hook translating a hero decorative numeral (large brass "MMXXVI") at 0.15× scroll speed on Home. Respects `prefers-reduced-motion`.
- **Animated Roman numeral separators**: new `<NumeralDivider n="III" />` component — brass numeral centered on a full-width brass hairline. On scroll into view: hairline draws L→R (existing `rule-draw`), numeral fades + counts up letter-by-letter (I → II → III via CSS steps). Drop between major sections on Doctrine, Foundations, Practice.
- **NavCard hover** already flips to imperial blue; add a 2px terracotta corner accent that expands on hover.
- **Cite underline**: animated dotted underline that thickens on hover.
- **Focus polish**: keep terracotta focus ring, add `ring-offset-background` for clarity.

All transitions ≤ 400ms; `prefers-reduced-motion` disables parallax, numeral count-up, and rule-draw.

## 4. Cases Page — Interactive Filters + Compare

Restructure `Cases.tsx` around a filter bar and a comparison drawer.

**Data model** (extend the existing `CASES` array):
```ts
type Case = {
  slug, title, summary,
  region: "Africa" | "Europe" | "Latin America" | "Southeast Asia",
  pillar: "Interpersonal" | "Communal" | "Intergenerational" | "Institutional",  // dominant pillar
  threats: ("Ethnic conflict" | "Civil war" | "Genocide" | "Political violence" | "Post-conflict transition")[],
  era: "1990s" | "2000s" | "2010s",
  scores: [number, number, number, number],
};
```

**Filter bar** (sticky under PageHeader):
- Three filter groups as toggle-chip clusters: Region, Doctrine Pillar (dominant), Threat Type.
- "Clear filters" ghost button.
- Live-updating result count ("Showing 4 of 6 cases").
- Chip style matches the new Badge system (terracotta when active, cream outline when inactive).

**Compare mode**:
- Each case card gets a "Compare" checkbox (max 3 selected).
- Floating "Compare (N)" pill bottom-right; opens a full-width `<Dialog>` with a side-by-side table: rows = 4 bond domains, columns = selected cases, cells = score with a horizontal terracotta bar (`width: score/5 * 100%`) for quick visual read.
- Dialog also shows a small radar-style summary (pure SVG, 4 axes, no chart lib) per case.

**URL state**: filters and comparison persisted in query string (`?region=Africa&pillar=Communal&compare=liberia,rwanda`) so views are shareable.

## 5. Additional UI/Design Suggestions (for approval, not built unless you say so)

Ranked by impact-to-risk:

1. **Reading progress bar** — 2px terracotta bar at top of long doctrine pages, sitting on the header's blue rule.
2. **Table of contents rail** — sticky right-side TOC on Doctrine/Foundations at ≥lg widths with active-section highlighting; keeps long reads navigable without hurting the editorial feel.
3. **Print stylesheet** — clean "briefing-ready" print CSS so any page prints as a formatted policy brief (cream removed, numerals kept, badges become bracketed labels).
4. **Downloadable one-pager** — a static PDF summary link in the footer ("Download the Doctrine Brief").
5. **Language toggle placeholder** — EN/FR/SW toggle in the header (visual only for now, real translations later). Matches the UN-diplomat register.
6. **Case detail routes** — `/cases/:slug` with a longer treatment (context, bond analysis, sources) instead of only cards. Would let citations link to specific cases too.
7. **Hero micro-video / animated SVG** — a slow 8-second SVG animation of four bond lines weaving through the wordmark. Only if you want more motion; risks feeling less institutional.
8. **Command-K palette** — `⌘K` opens a search over glossary + pages. Very "modern UN diplomat digital brief" feel; low visual cost.
9. **Dark "night briefing" mode** — inverted palette (deep navy ground, brass rules, cream ink) toggled from the footer. Preserves the identity while adding polish.
10. **Ambient audio brief** — link to a spoken excerpt of the doctrine (10–30s) on Home; skippable, muted by default.

Recommend doing 1, 2, 3, and 8 in a follow-up pass — they reinforce the "policy publication" identity without adding visual noise. Hold 5, 7, 9, 10 unless you specifically want them.

---

## Technical Notes

- New files: `src/components/Badge.tsx`, `src/components/Cite.tsx`, `src/components/NumeralDivider.tsx`, `src/components/CompareDialog.tsx`, `src/content/glossary.ts`, `src/pages/Glossary.tsx`, `src/hooks/useParallax.ts`, `src/hooks/useFilters.ts`.
- Edited: `SiteHeader` (+ Glossary link), `SiteFooter` (+ Glossary link), `NavCard` (badge + lift), `Home` (badges + parallax numeral + citations), `Doctrine/Foundations/Methodology/Practice/About` (badges + citations + numeral dividers), `Cases` (filters + compare), `App.tsx` (glossary route), `index.css` (hover-lift, cite underline, numeral animation keyframes).
- Uses existing shadcn `Dialog`, `Popover`, `Checkbox` — no new deps.
- Content: glossary entries and citation targets sourced verbatim from the two PDFs already ingested; no invented references. Sections VIII–XI and Handbook Part V remain excluded per memory rules.
- Accessibility: all new interactive elements keyboard-reachable; badges are `<span>` (decorative) unless linking; citations expose `aria-describedby`; filters are `<button aria-pressed>`; compare dialog uses focus trap and `Esc` close.
- Verification: `tsgo` typecheck, then Playwright pass at 1280 and 390 across `/`, `/glossary`, `/cases` (with filters applied via URL), and one doctrine page to confirm citation popovers and numeral dividers render.

Ready to implement on approval. Confirm whether to include any of the 10 additional suggestions in this pass or defer them.
