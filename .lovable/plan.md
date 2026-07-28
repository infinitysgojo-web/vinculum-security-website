# Copyright registration, scholarly links, and badge fix

## Verified current state
- `src/components/SiteFooter.tsx` imports `src/assets/cc-by-nc-nd.png.asset.json` and renders `ccBadge.url`.
- That URL (`/__l5e/assets-v1/.../cc-by-nc-nd.png`) returns `200 text/html` (2.7 KB — the SPA index fallback), not the PNG. The CDN asset path is not being served in this preview, which is why the badge is invisible.
- `src/pages/About.tsx` has a "Rights and Licensing" section with the CC text only, no registration or profile links.
- No mention of KECOBO, ORCID, Zenodo, Figshare, or OSF anywhere in `src/`.
- `src/pages/Home.tsx` currently ends with the "Read the doctrine" navigation grid.

## Changes

1. **Fix the CC badge** (`src/components/SiteFooter.tsx`)
   - Replace the remote asset pointer with a local, self-contained inline SVG component (`src/components/CCBadge.tsx`) that draws the standard black-and-white CC BY-NC-ND button (CC circle, person, crossed dollar, equals) at 120x42.
   - No network request, renders identically in preview and production, and scales crisply. Delete the now-unused `cc-by-nc-nd.png.asset.json` pointer.

2. **Home page: registration notice**
   - Add a slim, understated band beneath the navigation grid (above the footer), styled as an institutional colophon rather than a badge/banner: eyebrow "Copyright Registration", brass hairline, then:
     "Registered with the Kenya Copyright Board (KECOBO). Registration No. RZ100967, approved 27 July 2026."
   - Same serif/micro-type treatment as the rest of the site; no card, no CTA.

3. **About page: rename and expand the licensing section**
   - Rename "Rights and Licensing" to **"Rights, Registration and Repositories"**.
   - Keep the CC BY-NC-ND paragraph; add above it the KECOBO registration line (same wording as Home), and add the CC badge next to it for consistency with the footer.
   - Below, add the profile/repository links as a neat row of labelled buttons (see item 4).

4. **Profile and repository links** (new `src/components/ScholarlyLinks.tsx`, used in both footer and About)
   - Five links, each an outlined pill with a small inline monochrome SVG mark and a text label, brass border, gold hover:
     - ORCID — https://orcid.org/0009-0005-9861-8849
     - Zenodo — https://zenodo.org/communities/vinculumsecurity/records/
     - Figshare — https://figshare.com/articles/preprint/_b_Vinculum_Security_Vinculum_Diplomacy_b_/33103223
     - OSF — https://osf.io/user/7ad5x
     - Portfolio — https://jamesndua.kidnexus.or.ke/
   - Logos drawn as small inline SVGs (ORCID iD circle, Zenodo, Figshare, OSF, and a simple mark for the portfolio) so nothing depends on external image hosts. All `target="_blank" rel="noopener noreferrer"` with accessible labels.
   - Footer: placed as a centered wrapping row in the license band, with the KECOBO line appended after the CC text.
   - About: placed as a left-aligned row at the end of the renamed section, with a `me` rel on the profile links.

## Technical notes
- Component takes a `variant` prop (`footer` | `page`) so sizing/alignment differ without duplicating markup.
- No new dependencies; all marks are hand-authored inline SVG paths using `currentColor`.

## Verification
- Build, then Playwright screenshots of Home, About, and the footer at 375px, 768px, and 1280px to confirm the badge now renders and the link row wraps cleanly.
