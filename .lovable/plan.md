Small content and footer pass.

## Verified current state
- `src/pages/Foundations.tsx` already includes the full Human Security freedoms wording: "freedom from want, freedom from fear, and freedom to live in dignity".
- `src/content/glossary.ts` entry for "Human Security" is missing the third freedom: "freedom to live in dignity".
- `src/components/SiteFooter.tsx` currently reads: `© 2026 James Wesley Ndua` and the name is not linked.

## Changes to make

1. **Human Security consistency**
   - Keep the full three-freedoms wording in `src/pages/Foundations.tsx` as the canonical source.
   - Update the glossary definition in `src/content/glossary.ts` to include all three freedoms: "freedom from want, freedom from fear, and freedom to live in dignity".

2. **Footer copyright and author link**
   - In `src/components/SiteFooter.tsx`, change the copyright line to read "Copyright © 2026 James Wesley Ndua".
   - Wrap "James Wesley Ndua" in an external anchor (`<a>`) to `https://jamesndua.kidnexus.or.ke/`, opening in a new tab with `rel="noopener noreferrer"` and the same gold hover treatment used elsewhere.

3. **Cross-viewport check**
   - Build and verify the footer still wraps cleanly on mobile and desktop without breaking the flex layout or the brass separator dots.
