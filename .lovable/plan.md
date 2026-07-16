# Fold the Final Edition additions into the site

The uploaded PDF is the **Final Edition** of the doctrine. Structurally it is the same as the Expanded Fortified Edition the site already reflects (13 foundations, 8 cases, party-differentiated table, Ubuntu + Confucian ontology). What is genuinely new is concentrated in three places, plus one new methodological concept. This plan folds only those in, preserving the Imperial Folio tone and respecting the standing rule not to add doctrine Sections VIII–XI.

## What's actually new

1. **Section V.E — Scoring Rubric and Descriptive Anchors.** A 1–5 rubric with a stated descriptive anchor for each level (Severed → Nominal → Mixed → Functional and tested → Fully durable and institutionalized).
2. **Section VII — Full per-case scoring.** Every one of the 8 cases now carries a four-row bond table (Interpersonal / Communal / Intergenerational / Institutional-Relational) with a numeric score 1–5 and a one-line rationale. This is more granular than what the Cases page currently shows.
3. **Section VII.I — Cross-Case Pattern Summary.** A single consolidated table of all 32 scores across the 8 cases, with a "pattern" column, and the observation that only Cambodia scores uniformly low.
4. **Adversarial Rescoring** — a new methodological concept demonstrated on the Rwanda case: deliberately rescoring against the doctrine's favorable tendencies. Referenced in V.E and IX as a partial answer to the self-scoring critique.

Also newly emphasized (small wording tweaks, not new sections):
- The **child-protection carve-out is absolute** (Section VI paragraph after the party table).
- The **government non-self-assessment principle** (also Section VI).

## Page-by-page changes

1. **Methodology (`src/pages/Methodology.tsx`)**
   - Add a new sub-section **V.E Scoring Rubric and Descriptive Anchors** as a compact 5-row table (Score → Descriptive Anchor), placed directly after the existing scoring methodology block.
   - Add a short lede paragraph explaining the rubric narrows scorer judgment without eliminating it.
   - Under the existing party-differentiated table, add two short call-out lines: the absolute child-protection carve-out and the government non-self-assessment principle.

2. **Cases (`src/pages/Cases.tsx`)**
   - For each of the 8 cases, add a compact 4-row bond-score table (Bond → Score 1–5 → Rationale) using the exact numbers from Section VII of the PDF. Style: same alternating cream/gold-tint row treatment used on the Doctrine comparison table.
   - Add a new closing section **Cross-Case Pattern Summary** rendering the 8×6 consolidated table (Case, Interp., Communal, Intergen., Instit., Pattern) with a single-line takeaway underneath ("only Cambodia scores uniformly low; it is the doctrine's single most important falsifiability test").
   - Add a small **Adversarial Rescoring** call-out under the Rwanda card, in the same "Practice Under Time Constraint" mini-card style already used on the Practice page, noting the scores shown were produced by a deliberate skeptical re-pass.

3. **Doctrine (`src/pages/Doctrine.tsx`)**
   - No structural change. Add one sentence to the falsifiability line at the bottom of the page pointing readers to the new Cross-Case Pattern Summary on `/cases` as the concrete falsifiability test-bed.
   - Extend `CITED` with the new glossary IDs so print footnotes stay accurate.

4. **Glossary (`src/content/glossary.ts`)**
   - Add:
     - `scoring-rubric` — the 1–5 descriptive-anchor rubric.
     - `adversarial-rescoring` — the deliberate skeptical re-pass method (Rwanda demo).
     - `cross-case-pattern` — the consolidated 32-score summary.
     - `government-non-self-assessment` — the safeguard principle from Section VI.
   - Existing IDs stay untouched.

5. **Home (`src/pages/Home.tsx`)** and **About (`src/pages/About.tsx`)**
   - Small copy sweep: where the site currently says "eight cases", tighten to "eight documented processes, all four bond levels scored" so the new scoring depth is signaled from the entry pages. No layout changes.

## Out of scope

- Doctrine Sections VIII (safeguards), IX (critiques), X (adversarial review panels), XI (research agenda) — not added (project rule).
- Handbook Part V and appendices — not added.
- No new components, palette changes, motifs, or typography.

## Verification

- `tsgo` typecheck.
- Playwright load of `/methodology` and `/cases` at desktop and mobile widths; screenshot the new scoring rubric, the per-case tables, and the cross-case summary to confirm they render inside the existing grid and read cleanly without horizontal overflow.
