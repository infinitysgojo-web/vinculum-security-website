# Plan: Add "Both works" readiness statement across the site

## What the user wants

Add the following statement wherever it is relevant on the site, with its meaning and useful aspects visible:

> "Both works are fully developed, copyrighted, and tested against major historical and ongoing case studies (including peace processes in Rwanda, Colombia, and South Africa), and is operational and ready for use in academic circles, the mainstream policy and public discourse where it can be applied."

"Both works" refers to the doctrine (Vinculum Security) and the companion handbook (Vinculum Diplomacy). The statement should be adapted per location so each part lands where it is most useful, not pasted verbatim everywhere.

## Where it goes

### 1. Home page (`src/pages/Home.tsx`) — new "Status and Readiness" block

Add a new `FadeIn` section directly after the existing "Copyright Registration" block at the bottom of the page. This is the natural place because it already discusses copyright status. The statement here will read as a closing summary of the doctrine's operational readiness:

- Eyebrow: "Status and Readiness"
- GoldRule divider (matching the site's existing pattern)
- Body text combining the key claims: both works (doctrine + handbook) are fully developed, copyrighted (KECOBO RZ100967), tested against the eight documented case studies including Rwanda, Colombia, and South Africa, and operational and ready for use in academic circles, policy, and public discourse.

### 2. About page (`src/pages/About.tsx`) — new section after "Why This Author, Why Now"

Add a new `FadeIn` block titled "Operational Status" between the "Why This Author, Why Now" and "Rights, Registration and Repositories" sections. This placement makes sense because the About page establishes the author's standing, and this statement establishes the works' standing. The text here will emphasize the "tested against case studies" and "ready for use in academic circles, policy, and public discourse" aspects.

### 3. Cases page (`src/pages/Cases.tsx`) — closing statement

Add a short closing `FadeIn` block after the Cross-Case Pattern Summary. Since the Cases page already presents Rwanda, Colombia, and South Africa as scored case studies, a brief statement here confirms that these cases (and others on the page) are the test-bed the doctrine and handbook have been tested against, and that the works are operational and ready for application. This keeps the mention grounded rather than abstract.

## SEO and AI-source updates

### 4. `public/llms.txt` — add a "Status and readiness" section

Add a new section under "Core facts" stating that both works (the doctrine and the companion handbook) are fully developed, copyrighted, tested against the eight documented case studies including Rwanda, Colombia, and South Africa, and operational and ready for use in academic circles, mainstream policy, and public discourse. This ensures AI systems cite the operational status accurately.

### 5. Structured data — `index.html` Book node

Add a `creativeWorkStatus` field to the Book JSON-LD node in `index.html` with value "Published" (schema.org's recognized value), and extend the existing `description` to note the work is operational and tested against documented case studies. This is a small, standards-aligned addition that helps search engines understand the work's status without any risk.

## What stays the same

- No new pages, no new routes, no footer changes.
- No changes to the favicon, branding, or existing scholarly links.
- The statement is adapted per location — not pasted identically everywhere — so each part is visible and useful where it appears.
