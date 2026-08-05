# Add Digital Commons Data and verify Google search-result branding

## 1. Add the new repository link everywhere repository identity is maintained

- Add a **Digital Commons Data** pill linking to `https://data.mendeley.com/datasets/tykj4jm49b/1` in the shared scholarly-links component, with a small line-art repository icon matching the existing pills.
- Add the exact URL to the canonical `sameAs` list used by structured data.
- Add it to the static homepage JSON-LD `sameAs` references so non-JavaScript crawlers see the same repository relationship.
- Add it to the archival-mirrors list in `llms.txt`, preserving the website as the primary canonical source and repositories as secondary copies.
- Update the About-page Profiles and Repositories sentence to name Digital Commons Data while keeping Instagram’s “coming soon, posts on the doctrine” wording.

## 2. Keep the favicon setup clean and Google-compatible

The live custom domain currently serves:

- `/vinculum-security-favicon.png?v=20260804` as a valid 96×96 PNG from the homepage `<link rel="icon">`.
- `/favicon.ico` as a valid 48×48 icon.
- The 192×192 and 512×512 manifest icons, plus the 180×180 Apple icon.
- The Vinculum organization logo in JSON-LD.

These dimensions satisfy Google’s favicon requirement that the icon be square and a multiple of 48px. No additional logo sizes or duplicate declarations will be added. The existing files will only be changed if visual verification shows that the mark itself is blank, illegible, or excessively padded at search-result size.

## 3. Verify the result without overpromising Google’s cache timing

- Confirm the favicon and new repository link render correctly in the local preview.
- Recheck the deployed homepage source and icon responses after the change is published.
- Check the homepage’s Google Search Console indexing state when the current deployment is available there.

The site can provide the correct favicon signal, but Google chooses when to recrawl it and may retain the globe while its search cache refreshes. Publishing and requesting homepage re-indexing in Search Console can encourage a refresh, but cannot guarantee an immediate replacement.

## Files to update

- `src/components/ScholarlyLinks.tsx`
- `src/lib/seo-entities.ts`
- `src/pages/About.tsx`
- `public/llms.txt`
- `index.html`