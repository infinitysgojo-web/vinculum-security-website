# Redesign: "Imperial Folio" — vibrant, youthful UN-diplomat × modern classical Rome

Roll the selected prototype's language across the whole site. Content stays; visuals become warm, editorial, and confident. And remove em dashes, and use good punctuation unless em dashes are needed use where necessary.

## 1. Design tokens (index.css + tailwind.config.ts)

Replace the current navy/gold/off-white tokens with the Forum Sunset palette:

- `--background` → travertine cream `#F5EBDD`
- `--foreground` → ink `#2B2B2B`
- `--primary` → imperial blue `#1B3A6B` (headings, wordmark, hover surfaces)
- `--accent` → terracotta `#C84B31` (eyebrows, links, selection, active states)
- `--brass` → `#D4A24C` (hairline rules, Roman numerals, dividers) — new token
- `--navy-tint` → keep as subtle cream card surface `#EFE4D0`
- `--gold-tint` → `#F3E3C6` (alt table rows, quote surfaces)
- Selection color: terracotta background, cream text
- Focus ring: terracotta (was gold)

Type stays Cormorant Garamond + Inter (already loaded). Add `font-weight: 300` to the wordmark for the light-Cormorant hero feel. Radius stays small.

## 2. Shared components

- **SiteHeader**: switch from solid navy bar to cream ground with a 2px imperial-blue bottom rule (matches the prototype header). Wordmark in light Cormorant, imperial blue. Nav links in Inter uppercase micro-caps, terracotta hover, active = terracotta underline. Mobile hamburger toggles a cream dropdown with brass hairline separators.
- **SiteFooter**: cream ground, brass hairline top rule, left = uppercase micro-cap nav (© 2026 James Wesley Ndua · First articulated MMXXVI · A Doctrine of Relational Security), right = three colored dots (terracotta / imperial blue / brass) as a signature motif.
- **PageHeader**: terracotta eyebrow (was navy), oversized light Cormorant H1 in imperial blue, brass hairline underneath.
- **PullQuote**: large italic Cormorant in terracotta (hero variant) OR imperial blue (in-body variant), brass left border, cite line in terracotta micro-caps.
- **NavCard**: on hover, background flips to imperial blue with cream text; large Roman numeral (I–VI) in brass, top-right, animates from 30% → 100% opacity; a terracotta hairline sweeps left→right along the bottom on hover. Card grid uses `gap-px` on a brass/30 background for that hairline-divider look.
- **GoldRule** → rename intent (keep filename): defaults to brass; add `variant="terracotta"` and `variant="blue"` for accent rules.
- New **RomanNumeral** helper (tiny) so cards, sections, and case studies can share the ornamental numeral treatment.

## 3. Page-level updates (content unchanged)

**Home** — adopt the prototype directly: hero row with terracotta "EST. MMXXVI" eyebrow + huge light-Cormorant "Vinculum Security" wordmark left, right-aligned lede on the right, imperial-blue 2px baseline rule. Canonical definition becomes the terracotta italic pull-quote with a right-column "Core Doctrine" side note. Six NavCards in a `gap-px` brass-hairline grid with Roman numerals I–VI.

**The Doctrine / Foundations / Cases / Methodology / Practice / About** — reuse the same header/eyebrow/hairline treatment. Tables restyle: header row imperial blue with cream text, alt rows brass-tint `#F3E3C6`, first column serif italic. Foundations cards get Roman numerals I–XI. Cases keep the compact 4-row bond-integrity tables, restyled to the new tokens. About uses the terracotta pull-quote treatment for the founding quote.

**Motion** — keep the existing IntersectionObserver `FadeIn`; add a subtle CSS "rule-draw" animation for the brass underline in PageHeader (scale-x 0 → 1, 600ms ease-out). No framer-motion needed.

## 4. Head & meta

`index.html` title and description stay ("Vinculum Security — A Doctrine of Relational Security"). Update `theme-color` meta (if present) to `#F5EBDD`. Per-page `<Helmet>` unchanged.

## 5. Accessibility

Contrast checked: ink `#2B2B2B` on cream = AAA; imperial blue on cream = AAA; terracotta on cream ≈ 4.6:1 (AA for body sizes ≥14px; keep terracotta reserved for headings, eyebrows, links, and hover surfaces — never long body copy). Focus-visible ring switches to terracotta. Single H1 per page preserved.

## 6. Guardrails

- Semantic tokens only in JSX — no hardcoded hex outside `index.css` / `tailwind.config.ts`.
- Keep the doctrine content scope intact (no VIII–XI, no handbook Part V).
- No stock imagery, no marble textures, no laurel clip-art — Roman feel comes from type, numerals, and the palette only.

## 7. Verification

TypeScript typecheck, then Playwright pass at 1280 and 390 widths across `/`, `/doctrine`, `/foundations`, `/cases`, `/methodology`, `/practice`, `/about`. Screenshot each; confirm terracotta pull-quote, brass hairline grid on nav cards, imperial-blue hover flip, and cream sticky header render correctly.

## 8. Memory

Update `mem://index.md` Core rules: swap navy/gold/off-white token values for the Forum Sunset palette (`#F5EBDD` / `#1B3A6B` / `#C84B31` / `#D4A24C` / `#2B2B2B`) and note the "Imperial Folio" editorial direction (cream ground, brass hairlines, Roman numerals on cards, terracotta accents).