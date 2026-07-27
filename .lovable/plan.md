# License notice and footer update

## Verified current state
- No mention of "license", "Creative Commons", or "All Rights Reserved" exists anywhere in `src/` or `index.html`.
- `src/components/SiteFooter.tsx` currently shows: `Copyright © 2026 James Wesley Ndua` (name linked to the portfolio), then `First articulated MMXXVI`, `A Doctrine of Relational Security`, `Glossary`, plus three brass dots.

## Changes

1. **Footer copyright line** (`src/components/SiteFooter.tsx`)
   - After the linked name, add `. All Rights Reserved.`

2. **License block in the footer**
   - Add a second row beneath the existing footer row, separated by a thin brass hairline.
   - Contents: the official CC BY-NC-ND 4.0 badge (the black-and-white icon strip: CC, person, crossed-out dollar, equals sign) on the left, and to its right the text:
     "This work is licensed under a Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0). To view a copy of this license, visit creativecommons.org/licenses/by-nc-nd/4.0/"
   - The license name and the URL link out to `https://creativecommons.org/licenses/by-nc-nd/4.0/` with `target="_blank" rel="license noopener noreferrer"`, gold hover treatment matching the rest of the footer.
   - Small-caps/uppercase micro-type styling consistent with the current footer so it reads as an institutional colophon, not a banner.

3. **Badge asset**
   - Ship the badge as a local SVG (`src/assets/cc-by-nc-nd.svg`), recreating the standard Wikimedia CC BY-NC-ND button in black and white so it renders crisply at any size and needs no external request. Imported as an ES6 image with alt text "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License".

4. **About page** (`src/pages/About.tsx`)
   - Add the same license line as a short closing note under the author bio, since that is the natural "rights" location for a doctrine site. Text only there, badge stays in the footer.

5. **Machine-readable metadata**
   - Add `<link rel="license" href="https://creativecommons.org/licenses/by-nc-nd/4.0/" />` in `index.html` head, and add `"license"` to the existing Book JSON-LD block.

## Verification
- Build, then check the footer at mobile (375px), tablet (768px) and desktop (1280px) so the badge and license text wrap cleanly without reintroducing brass gaps.
