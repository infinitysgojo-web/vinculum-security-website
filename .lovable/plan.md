# Layout Cleanup Pass

Fix the visible inconsistencies in the screenshots (empty gold bars under grids, awkward wrap around the Cite button on Doctrine, cramped tables on mobile in Cases) and audit the same patterns on every page so the whole site behaves at 360, 768, and 1280 CSS px.

## Root causes identified

1. **Empty gold bar under card grids** (Home "Read the doctrine", Glossary, Practice, About): grids use `gap-px bg-brass/40 border-brass/40` to draw hairlines between cells. Two problems:
   - `FadeIn` wrappers are grid items but don't have `h-full`, so shorter cards don't stretch to the row height, revealing the brass background as a bar.
   - When the item count is odd for the current column count, the last row leaves empty cells that render as a solid gold rectangle.

2. **Cite button wraps as centered block** (Doctrine III.D intro, some Foundations/Methodology paragraphs): `<Cite>` renders a `<button>`, and buttons default to `text-align: center` + `display: inline-block`. When the cited phrase is long enough to wrap, it centers inside its own inline-block, and the trailing `, governed by...` appears on the next line looking detached.

3. **Cramped case tables on narrow screens**: each case card holds a 3-column table (Domain / Score / Rationale). `whitespace-nowrap` on the domain column plus tight padding makes text stack one word per line when the card is narrow (below ~420 px card width, i.e. mobile and the 2-col md layout).

4. **Doctrine comparative-positioning table overflow** on mobile: table sits in a full-bleed section with no horizontal scroll cue, so it either overflows or squishes into unreadable columns.

## Changes

**`src/index.css`**
- Add `.cite-term { text-align: left; display: inline; }` (fall back to `inline` so wrapping follows the parent paragraph). Keep the dotted underline.
- Add a `.hairline-grid` utility that draws inter-cell brass hairlines via `outline` on each child instead of `gap-px + bg-brass`, so odd trailing cells don't render a gold rectangle. Alternative kept in one place so every grid can use it.

**`src/components/FadeIn.tsx`**
- Apply `h-full` when the parent is a grid item. Simplest: always set `h-full` on the wrapper via `className`, so grid children stretch. Confirms cards fill their row.

**`src/pages/Home.tsx`**
- Swap the "Read the doctrine" grid to the new hairline pattern and ensure `NavCard` uses `h-full flex flex-col` so all six cards match the tallest.
- Add a filler cell when the item count is odd for the active breakpoint (only relevant if content grows; keep as a safeguard).

**`src/pages/Glossary.tsx`**
- Same hairline swap. Each article already has `h-full`, but the wrapping FadeIn does not; fix via the FadeIn change. Confirms no gold trailing bar when the term count is odd.

**`src/pages/Practice.tsx`, `src/pages/About.tsx`**
- Audit the two-column card grids that use the same `gap-px bg-brass/40` idiom and switch them to the new pattern.

**`src/pages/Doctrine.tsx`**
- III.D intro paragraph: keep the `<Cite>` inline; the CSS fix removes the centered-block wrap. Verify the same paragraph pattern in III.F and V.
- Comparative positioning table (III.C): wrap in `overflow-x-auto` with a subtle right-edge fade so users on mobile know it scrolls, and lower cell padding on small screens.

**`src/pages/Cases.tsx`**
- Remove `whitespace-nowrap` from the domain column so "Institutional-Relational" can wrap on two lines instead of forcing a narrow-column stack.
- Tighten table padding and typography on `< md` (`px-2 py-1.5`, `text-[0.78rem]`).
- Force the grid to a single column below `lg` so cards get enough width for the embedded table (`grid-cols-1 lg:grid-cols-2`); the current `md:grid-cols-2` is the source of the cramped tablet/desktop-narrow look.
- Apply the same hairline pattern where relevant, and ensure the Rwanda adversarial-rescoring callout has proper bottom spacing so it doesn't butt against the card border.

**`src/pages/Methodology.tsx`, `src/pages/Foundations.tsx`**
- Same audit: any `gap-px bg-brass/40` grid gets the FadeIn `h-full` fix; any table gets `overflow-x-auto`.

## Verification

- Drive Playwright at 360, 768, and 1280 CSS px against `/`, `/doctrine`, `/foundations`, `/cases`, `/methodology`, `/practice`, `/about`, `/glossary`. Screenshot the specific regions circled in the uploaded shots (Home cards, Doctrine III.D intro, Cases grid, Practice/Government-Non-Self-Assessment card, Glossary tail) and confirm no gold rectangles, no centered-wrap Cite, and no cramped tables.

## Out of scope

- No content or wording changes.
- No new features, no palette or typography changes.
