# The Dominum Effect: Integration Plan

The Law of Sovereign Custodial Inversion, built into the existing dashboard and reference pages. No new routes, no new storage, no new subsystem.

## 1. The Dominum Index (dashboard)
- One pure function combining readings the desks already publish: bond strength and variance (Desk 01), rupture index (Desk 02), decay horizon, escrow waterfall coverage (Desk 07) and succession durability (Desk 12).
- Read from the MissionEngine signal bus only. If any input is unassessed, the index shows "not yet assessed" rather than a number.
- Three phases shown as status, never predictions: Fiduciary Anchor, Custodial Inversion, Self-Reinforcing Dominium.

## 2. Where it appears
- Desk 15 · Mission Readiness: a Dominum reading inside the existing clearance card, with an [ƒx] proof chip that walks through the live numbers.
- Desk 17 · Mandate Handover: the same reading included in the handover summary and sealed record.
- No extra cards; uses the existing wide and paired layouts so small screens stay clear.

## 3. Reference entries (like always)
- Dashboard Lexicon: entry for Dominum Effect, Dominium vs Imperium, Custodial Inversion, Dominum Index.
- Glossary page: the same terms with formal definitions and etymology (Latin *dominium*).
- Commentary page: a doctrinal commentary on the canon, its three phases and its role as the Codex's positive counterpart to rupture.
- Quick search and Doctrine page cross-links where those terms already have a home.
- Wording: no em dashes, formal punctuation, formulas typeset as mathematics.

## 4. Checks
- Tests: the index equals the sum of its desk inputs, shows "not assessed" when an input is missing, phase thresholds hold, and the proof chip result matches the desk display.
- Run all tests, confirm a clean build, and open Desk 15 and 17 in a practice mission at desktop and mobile sizes.

## Technical details
- New pure function `dominumIndex` and `dominumProof` beside the existing formulas (formulaProofs.ts); views call it, never re-implement it.
- Content added to src/content/glossary.ts, src/content/commentary.ts and src/components/desk/lexiconData.ts.
- Desk 15 and 17 read via useEngine; neither publishes a new signal.
- AGENTS.md gets one rule: the Dominum Index is a derived view of bus readings only.
- The Codex PDF is not changed in this step; it can be added on the next compile.
