# Plan: Cookie consent banner (self-hosted Silktide)

## What you'll get
A cookie consent banner on every page, styled to match the site: travertine cream background, imperial blue text and icons, ink-coloured buttons. It sits bottom-left with a small cookie icon to reopen preferences, offers Essential / Analytics / Marketing toggles, and remembers each visitor's choice. Nothing else on the site changes.

## Approach: self-hosted (better than the CDN)
Your uploaded zip contains the Silktide consent-manager CSS and JS. Self-hosting wins over the CDN snippet:
- No reliance on an outside service; the banner can't break or be blocked by ad blockers as easily
- Loads from your own domain, faster and cleaner for privacy
- You control the exact version

## Steps
1. Copy `silktide-consent-manager.js` and `silktide-consent-manager.css` from the upload into `public/vendor/silktide/` (static files, served as-is; no build changes).
2. In `index.html`, before the closing `</body>`:
   - Load the CSS from `/vendor/silktide/silktide-consent-manager.css`
   - Load the JS with `defer` so it never blocks the page or the loading screen
   - Add the override style block, adjusted to the site's real fonts: Inter for banner text (instead of Helvetica), keeping your exact palette variables (`--backgroundColor: #F5EBDD`, `--textColor: #1B3A6B`, `--primaryColor: #2B2B2B`)
   - Add the init script with your three consent types (Essential required, Analytics, Marketing) and your exact button/description wording
3. Add a short "Cookies" line to the footer or the About page legal area so visitors can reopen preferences (the bottom-left icon already covers this, so only added if it fits cleanly — otherwise skipped).
4. Verify: load the preview, confirm the banner appears over the loading screen only after it fades, accept/reject/preferences all work, the choice persists on reload, and no console errors.

## Notes
- No cookies are actually set by the site itself beyond the consent record; Analytics and Marketing stay inert until you add tracking tools later, which is the correct, honest default.
- The banner text is plain English and matches the site's tone; no em dashes.
