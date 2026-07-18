# Sync site to Final Edition PDFs + em-dash removal

Both uploaded PDFs are the **Final Edition**: "Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition" and "Vinculum Diplomacy: The Practitioner Handbook, Final Edition." The site was built off the earlier "Expanded Fortified" pass. Structure matches; edition labels and some wording need refreshing, plus a punctuation cleanup pass. Excluded content (doctrine VIII-XI; handbook Part V and appendices) stays excluded.

## What changes

**1. Edition labels site-wide**
- Update About, Home, Practice intro, glossary source refs, `<SEO>` descriptions, and `index.html` meta to say "Final Edition" instead of "Expanded Fortified Edition."

**2. Doctrine page**
- Verify III.A canonical definition, III.B ontological claim, III.C comparative table, III.D continuum, III.E nomenclature, III.F boundary rules and weighting against Final Edition wording. Patch any drift.
- Confirm the Section IV falsifiability pointer reads correctly.

**3. Foundations page**
- Re-verify all 13 tradition cards (A-M), including Menkiti-Gyekye framing, Realism as Counterweight, Digital and Information-Age Bonds, and Environmental and Climate-Displacement Bonds. Correct any tightened wording.

**4. Methodology page**
- Cross-check V.A diagnostic method, V.B indicators, V.E scoring rubric anchors (Severed to Durable, 1-5), the child-protection carve-out, and the government non-self-assessment note.
- Confirm the VI Party-Differentiated Application table rows match the final table.

**5. Cases page**
- Reconfirm all 8 cases and the Cross-Case Pattern Summary numbers against Section VII. Patch any score or rationale that shifted. Keep the Cambodia falsifiability call-out and Rwanda adversarial rescoring note if still supported.

**6. Practice page**
- Refresh intro (Executive Summary and Statement of Origination) with Final Edition wording, keeping the founding pull-quote.
- Confirm section 3A "Relation to the Annan Method," the four practice principles, and the tools mention. Keep excluding Part V and appendices.

**7. Glossary**
- Refresh source citations (page numbers, edition label). Verify each definition against the Final Edition; patch drifted entries. Add a term only if a Final-Edition-only concept surfaces during the diff pass.

**8. Em-dash removal (site-wide, punctuation pass)**
- Every em dash (`—`) and standalone en dash (`–`) used as punctuation in visible copy will be removed and replaced with the correct punctuation for the sentence, chosen per instance:
  - Parenthetical asides `text — aside — more` become commas: `text, aside, more`.
  - Clause breaks that introduce or expand an idea become a colon or semicolon depending on the relationship.
  - Simple pauses become a comma or a period splitting into two sentences.
  - Lists or ranges (`1-5`, `A-K`) keep their hyphens.
- Scope: all page copy, components, glossary entries, badges, tooltips, pull-quotes, and SEO/meta strings.
- Hyphens inside compound words, code identifiers, class names, hex colors, and numeric ranges are untouched.
- Method: ripgrep the repo for `—` and spaced ` – `, review each hit in context, and rewrite the sentence with the appropriate punctuation instead of a blind substitution.

## Method

Diff each page's copy against the parsed Final Edition text section by section, apply targeted line edits, then run the em/en dash punctuation pass, rewriting each sentence for correct grammar. Preserve the current "Imperial Folio" design, diplomat badges, citations, filters, and scroll memory. This is content and punctuation only.

## Out of scope

- No new pages or sections beyond the current allow-list.
- Excluded sections remain excluded.
- No design or interaction changes.
