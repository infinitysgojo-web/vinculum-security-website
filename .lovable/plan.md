# Add HALOpenScience and OpenAire profile links

## Verified current state

- `src/components/ScholarlyLinks.tsx` already contains six pill links (ORCID, Zenodo, Figshare, OSF, Portfolio, Dataverse) with inline SVG marks, and the pattern for adding another entry is well established.
- `src/pages/About.tsx` has a "Profiles and Repositories" subsection that only tells readers to look in the footer; it does not list the links directly on the page.

## Proposed changes

1. **Extend `src/components/ScholarlyLinks.tsx` with two new entries**
  - Add a `HalMark` inline SVG component (monochrome, `currentColor`, `aria-hidden`, `w-3.5 h-3.5`, matching the existing mark style).
  - Add an `OpenAireMark` inline SVG component (same styling rules as above).
  - Append to the `LINKS` array:
    - `{ label: "HAL", href: "https://cv.hal.science/james-wesley-ndua", Icon: HalMark }`
    - `{ label: "OpenAire", href: "https://explore.openaire.eu/search/result?pid=10.5281/zenodo.21615991", Icon: OpenAireMark }`
  - Preserve the existing `rel="me noopener noreferrer"`, accessible `aria-label`, and pill styling so the new links match the existing row.
2. **Improve the About page "Profiles and Repositories" section**
  - Replace the current sentence that points only to the footer with a more descriptive statement, for example:
    > "The author’s scholarly profiles and the doctrine’s underlying repositories are accessible through the links below, from ORCID and HALOpenScience to Zenodo, OpenAire, Figshare, OSF, Harvard Dataverse, and the author’s portfolio."
  - Optionally render the `ScholarlyLinks` component directly beneath that statement so the links are actually on the About page rather than only referenced from the footer. This is the recommended approach because the user asked for the links to be "below" the statement.

## Verification

- Build the project and confirm no TypeScript or lint errors.
- Check the footer and the About page to verify the HAL and OpenAire pills appear with the correct URLs, use the correct icon styling, and wrap cleanly on the current mobile viewport (360px).