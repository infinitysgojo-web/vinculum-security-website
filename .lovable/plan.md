
# Update site to the Expanded / Fortified edition

The two uploaded PDFs are newer editions of the source texts. The site currently reflects the earlier version (six cases, one civilizational tradition, no digital/climate foundations, no party-differentiated layer, no Annan-method note). This plan folds the new material into the existing pages without breaking the "Imperial Folio" tone, and respects the standing rule not to add doctrine Sections VIII–XI or handbook Part V / appendices.

## What's actually new in the docs

**Doctrine (Fortified, Expanded):**
- Two independent civilizational traditions now underwrite the ontological claim: Ubuntu (with the Menkiti–Gyekye debate) *and* Confucian Role Ethics.
- Two new theoretical foundations: **L. Digital and Information-Age Bonds** and **M. Environmental and Climate-Displacement Bonds**.
- Section II.B is sharpened as "Ubuntu Philosophy and the Menkiti–Gyekye Debate"; II.C is framed as "Political Realism: The Counterweight".
- Section III.E "Nomenclature and the African Contribution" and III.F "Boundary Rules and Weighting" are new / sharpened.
- Section VI "Party-Differentiated Application" (children, youth, elders, women, government, civil society, ex-combatants) is a new layer.
- Case engagement is now **eight** cases: adds **South Africa TRC** and **Tuvalu / Kiribati climate displacement** to the existing six.

**Handbook:**
- New §3A "Relation to the Annan Method".
- Part IV now covers eight cases, and adds **IV.B Practice Under Time Constraint** and **IV.C Practice Under WPS and Child-Protection Boundaries**.
- Introduces the term **Continuity Provision**.

## Page-by-page changes

1. **Foundations (`src/pages/Foundations.tsx`)**
   - Rename II.B card to "Ubuntu Philosophy and the Menkiti–Gyekye Debate" and add a short line noting the internal African debate.
   - Reframe II.C as "Political Realism: The Counterweight" (kept as counterweight, not competitor).
   - Add two new entries: **II.L Digital and Information-Age Bonds** and **II.M Environmental and Climate-Displacement Bonds**, each with the same card style and a brass numeral.
   - Update any lede that says "eleven foundations" → "thirteen".

2. **Doctrine (`src/pages/Doctrine.tsx`)**
   - Update ontology paragraph to say the claim rests on **two independent civilizational traditions**.
   - Comparison table already includes Political Realism — leave rows intact, just verify wording matches "counterweight" framing.
   - Add **III.E Nomenclature and the African Contribution** section (short, one paragraph, with `NumeralDivider n="V"`).
   - Add **III.F Boundary Rules and Weighting** as a compact two-column list (boundary rule → weighting rule), pulled from the doctrine's own table.
   - Extend `CITED` with the new glossary IDs so print footnotes stay accurate.

3. **Methodology (`src/pages/Methodology.tsx`)**
   - Add a new section **VI. Party-Differentiated Application** rendered as a table (Party → Bond focus → Practice adjustment) covering children, youth, elders, women, government, civil society, ex-combatants.
   - Keep existing diagnostic method + scoring rubric intact.

4. **Cases (`src/pages/Cases.tsx`)**
   - Expand from six to **eight** cases. Add:
     - **South Africa — Truth and Reconciliation Commission (1996–1998)**
     - **Tuvalu & Kiribati — Climate Displacement / Falepili Union (2023–2024)**
   - Update page eyebrow / lede from "six documented processes" → "eight documented processes across Africa, Latin America, Europe, Southeast Asia, and the Pacific".

5. **Practice (`src/pages/Practice.tsx`)** — handbook page
   - Add **§3A Relation to the Annan Method** as a short block under Part I.
   - Add **Part IV.B Practice Under Time Constraint** and **Part IV.C Practice Under WPS and Child-Protection Boundaries** as two small companion cards to the existing applied-practice section.
   - Do not add Part V or appendices (per project memory).

6. **Home (`src/pages/Home.tsx`) & About (`src/pages/About.tsx`)**
   - Swap "six cases" → "eight cases" and "one civilizational tradition" / "Ubuntu" → "two independent civilizational traditions (Ubuntu and Confucian role ethics)" wherever those phrases appear in hero copy or summaries.

7. **Glossary (`src/content/glossary.ts`)**
   - Add new entries so `<Cite term="…">` can reference them from the updated pages:
     - `political-realism` — "The Counterweight" framing
     - `menkiti-gyekye` — the African communitarian/moderate-communitarian debate
     - `digital-bonds` — Digital & Information-Age Bonds
     - `climate-bonds` — Environmental & Climate-Displacement Bonds
     - `party-differentiated` — Party-Differentiated Application
     - `nomenclature-african` — Nomenclature and the African Contribution
     - `boundary-weighting` — Boundary Rules and Weighting
     - `annan-method` — Relation to the Annan Method
     - `continuity-provision` — from the handbook
     - `south-africa-trc` — the SA TRC case
     - `falepili-union` — Tuvalu / Kiribati case anchor
   - Existing IDs stay untouched so current `Cite` usages keep working.

## Out of scope (per project memory)

- Doctrine Sections VIII, IX, X, XI (safeguards, critiques, adversarial review, research agenda) — not added.
- Handbook Part V, Part VI drills, Part VII formation code, and all appendices — not added.
- No new visual features, no command palette, no new components beyond content changes; typography, palette, motifs, and existing components stay exactly as they are.

## Verification

- `tsgo` typecheck after the edits.
- Playwright load of `/foundations`, `/doctrine`, `/methodology`, `/cases`, `/practice` at desktop and mobile viewports; screenshot each to confirm the new sections read cleanly and no glossary `Cite` calls resolve to missing IDs.
