## Plan

### 1. Fix the 404 on reload / hard refresh / layout change (published site)

The screenshot is a platform-level `DEPLOYMENT_NOT_FOUND` from the host, not the app's own 404. That happens when the browser requests a deep path (e.g. `/doctrine`) directly and the host doesn't fall back to `index.html`. Lovable's own hosting handles SPA fallback automatically, but a stale/renamed deployment or a mismatched hosting layer will not.

Actions:
- Confirm `BrowserRouter` is used (it is) and that every route resolves in-app on a fresh reload of the current preview.
- Add `public/_redirects` with `/*  /index.html  200` as a safety net for any host that reads it (harmless on Lovable, fixes Netlify-style hosts).
- Add a matching `vercel.json` rewrite `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }` so Vercel-hosted deployments also fall back.
- Re-publish so the current deployment is the live one; the screenshot's deployment ID is likely an old build that was replaced/removed.
- Verify by hard-refreshing `/doctrine`, `/glossary`, `/cases`, and a fake path on the live URL — none should show the platform 404 again.

### 2. Remember scroll position per page
- Add a `ScrollMemory` behavior in `App.tsx` replacing the current `ScrollToTop`.
- Save `window.scrollY` per route path into `sessionStorage`, throttled via rAF.
- On route change: if a hash is present, jump to that element; else if a saved position exists, restore it after layout; else scroll to top.

### 3. Roman-vibe Not Found page
- Rewrite `src/pages/NotFound.tsx` in the Imperial Folio language: brass rules, Roman-numeral "CDIV" ornament, terracotta eyebrow ("Ignotum"), serif headline like "This road is not on the imperial map.", one-line witty subhead, three quiet links back to Home / Doctrine / Glossary. Light in tone, still dignified.

### 4. Remove the command palette
- Delete `src/components/GlossaryCommand.tsx`.
- Remove the ⌘K chip, import, state, and dialog usage from `src/pages/Glossary.tsx`. Keep the existing search input untouched.

### 5. Remove the Doctrine section nav
- Remove `SectionNav` usage and the two-column grid wrapper from `src/pages/Doctrine.tsx`.
- Delete `src/components/SectionNav.tsx` (no other page uses it).
- Keep section anchor IDs so citations still deep-link; keep `ReadingProgress` as the discreet orientation aid.

### 6. Verify
- Typecheck.
- Playwright: reload `/doctrine` and `/cases` in the local dev preview to confirm no 404, then screenshot the new Not Found page and the Doctrine mobile layout without the rail.

### Technical notes
- `_redirects` and `vercel.json` are additive safety nets; they don't affect Lovable hosting behavior.
- Scroll memory uses `sessionStorage` so it resets when the tab closes — matches user expectation of "pick up where I left off during this visit" without polluting long-term storage.