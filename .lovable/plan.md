# Plan: Add the readiness statement, split across the site without repetition

## The statement

> "Both works are fully developed, copyrighted, and tested against major historical and ongoing case studies (including peace processes in Rwanda, Colombia, and South Africa), and is operational and ready for use in academic circles, the mainstream policy and public discourse where it can be applied."

"Both works" = the doctrine (Vinculum Security) and the companion handbook (Vinculum Diplomacy).

The statement carries four distinct claims. Rather than repeat the whole sentence in several places, each claim goes where it already belongs, so the site reads as one coherent argument instead of a slogan repeated:

1. **Fully developed and copyrighted** — the works are complete and registered.
2. **Tested against major historical and ongoing case studies** — Rwanda, Colombia, South Africa.
3. **Operational** — usable, not theoretical.
4. **Ready for academic, policy, and public discourse** — the audiences it serves.

## Where each part goes (one place each, no overlap)

### 1. Home page (`src/pages/Home.tsx`) — the full, complete statement

The existing bottom block is "Copyright Registration". Widen it into a single **"Status of the Works"** block that states the whole thing once, in full and in the site's voice: both the doctrine and the companion handbook are complete, registered with KECOBO (RZ100967, 27 July 2026), tested against the documented case studies, and operational and ready for academic, policy, and public use.

This is the only place the complete statement appears. The existing copyright line folds into it rather than sitting separately, so nothing is said twice.

### 2. Cases page (`src/pages/Cases.tsx`) — only the "tested against" claim

Add one short closing line beneath the Cross-Case Pattern Summary noting that these eight processes, Rwanda, Colombia, and South Africa among them, are the historical and ongoing test-bed against which both the doctrine and the handbook have been tested. No mention of copyright or readiness here — that belongs on Home.

### 3. Practice page (`src/pages/Practice.tsx`) — only the "operational" claim

One sentence added to the existing closing note: the handbook is operational, not provisional, and is intended for direct use in the field alongside the doctrine. Nothing about case studies or copyright.

### 4. About page (`src/pages/About.tsx`) — only the "ready for use" audiences

The "Rights, Registration and Repositories" section already carries the KECOBO line. Extend it with one sentence on the audiences: both works are ready for use in academic circles, mainstream policy, and public discourse. No case-study or "operational" repetition.

## SEO, metadata, and AI-answer surfaces

The same meaning is carried into the places search engines and AI systems read, stated once per surface in the appropriate register:

### 5. `public/llms.txt` — a "Status and readiness" section

Add a compact section after "Core facts": both works fully developed and copyrighted (KECOBO RZ100967); tested against eight documented processes including Rwanda, Colombia, and South Africa; operational and ready for academic, policy, and public discourse use. This is what AI systems will quote when asked whether the doctrine is usable.

### 6. `index.html` — structured data

- Add `creativeWorkStatus: "Published"` to the Book node (schema.org's recognised value for a complete work).
- Extend the Book node's `description` with the tested-and-operational fact so the graph carries it.
- Add the same readiness sentence to the WebSite node's `description`.

### 7. Page descriptions and keywords

- **Home** (`src/pages/Home.tsx` SEO block, and the matching static tags in `index.html`): extend the description to note the doctrine is tested against documented peace processes and ready for academic and policy use. Add keywords covering the operational framing.
- **Cases** (`src/pages/Cases.tsx` SEO block): extend the description to say the cases are the doctrine's test-bed.
- **Practice** (`src/pages/Practice.tsx` SEO block): note the handbook is operational and field-ready.

### 8. A new FAQ entry on the home page

The home page already carries an `FAQPage` block. Add one question — "Is Vinculum Security ready for practical use?" — answered with the full readiness statement. This is the entry Google and AI assistants surface directly for that kind of question, and it gives the statement one authoritative machine-readable home.

## What stays unchanged

No new pages or routes, no footer changes, no favicon or branding work, no changes to the scholarly links.

## Note on going live

These changes appear in the preview immediately; the search and social metadata reaches the live address on the next publish.
