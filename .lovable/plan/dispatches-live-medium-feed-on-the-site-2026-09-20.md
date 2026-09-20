# Dispatches: Live Medium Feed on the Site

## Goal

A public **Dispatches** page on the site that automatically shows every article you publish on Medium, in the site's existing travertine/imperial-blue/terracotta/brass design. Each article card links straight to the article on Medium. No separate editor, no duplicated content, no manual work. Publish on Medium; it appears here.

Medium profile: `https://medium.com/@jamesndua` (RSS feed confirmed live at `https://medium.com/feed/@jamesndua`).

## How it works

Medium serves a public RSS feed of all your articles. The browser cannot fetch it directly because Medium does not send CORS headers, so the feed is fetched and parsed server-side by a backend function, cached, and served to the site as clean JSON. The frontend just reads that JSON and renders cards. Articles always link out to Medium; the site never hosts the full text.

This runs on the backend already connected to the project. The Medium feed is public content, so caching it is low-risk, and the same code deploys unchanged if you later point the project at your own Supabase.

## Backend (server-side fetch and cache)

**Table `medium_articles`** (cache; one row per Medium article):

| column | type | notes |
|---|---|---|
| `id` | text PK | the Medium post GUID slug (stable) |
| `title` | text | article title |
| `link` | text | full Medium URL (the card opens this) |
| `pub_date` | timestamptz | publish date |
| `author` | text | `dc:creator` from the feed |
| `categories` | text[] | Medium tags |
| `cover_image` | text | first `<img>` in the article body, or null |
| `excerpt` | text | first ~280 plain-text chars, HTML stripped |
| `fetched_at` | timestamptz | when this row was last refreshed |

- `GRANT SELECT ON public.medium_articles TO anon, authenticated;` (public read; it is Medium's public content).
- `GRANT ALL ON public.medium_articles TO service_role;`
- RLS enabled; policy: anyone can `SELECT`, only `service_role` can write.

**Table `medium_sync_runs`** (staleness check):

| column | type |
|---|---|
| `id` | uuid PK |
| `run_at` | timestamptz |
| `status` | text |
| `article_count` | int |

Same grant pattern: service-role write, no public read needed.

**Edge function `medium-feed`** (`supabase/functions/medium-feed/index.ts`):

1. On `GET`, read the latest `medium_sync_runs.run_at`.
2. If the last successful sync was less than 1 hour ago, skip fetching and return cached rows.
3. Otherwise fetch `https://medium.com/feed/@jamesndua`, parse the RSS XML, and for each `<item>` extract title, link, guid, pubDate, dc:creator, categories, first image from `content:encoded`, and a stripped-text excerpt.
4. Upsert each item into `medium_articles` by `id` (update in place, no duplicates).
5. Insert a `medium_sync_runs` row.
6. Return all `medium_articles` rows newest-first as JSON.

XML parsing uses the browser-style `DOMParser` available in Deno (`text/xml`). No third-party parser needed.

## Frontend

**New page `src/pages/Dispatches.tsx`** at route `/dispatches`:

- `SEO` component with title "Dispatches", description mentioning Vinculum Security and Vinculum Diplomacy commentary through the relational-security lens, keywords, breadcrumbs, and a route OG image (`/og/dispatches.jpg`).
- JSON-LD: a `Blog` node plus an `ItemList` of `BlogPosting` entries (title, url, datePublished, author = James Wesley Ndua), so search engines and AI see the article list as structured data.
- Fetches the cached article list from the edge function on mount; renders a loading state, then the grid.
- Each article is a card: cover image (or a brass/terracotta placeholder if none), date in diplomatic date format, title in Cormorant Garamond, two-line excerpt, category chips, and a brass-bordered "Read on Medium" link that opens the Medium URL in a new tab.
- Layout matches the existing card-grid pattern used on Cases and the homepage NavCards. Same `FadeIn`, `eyebrow`, `gold-rule`, color tokens. No em dashes.
- Empty state: a short note that new dispatches appear as soon as they are published on Medium.

**Homepage strip** (`src/pages/Home.tsx`):

- A compact "Latest Dispatches" section above the footer showing the three most recent articles, each linking to Medium, with a "View all dispatches" link to `/dispatches`. Fetched from the same edge function.

**Navigation**:

- Add `{ to: "/dispatches", label: "Dispatches" }` to the `NAV` array in `src/components/SiteHeader.tsx` (desktop and mobile).
- Add a Dispatches link in the footer scholarly-links row.

## SEO, AI, and discoverability

- `public/sitemap.xml`: add `/dispatches`.
- `public/llms.txt`: add a Dispatches section noting the page mirrors the author's Medium publications and links out to them, with the Medium profile URL.
- `index.html`: add "Dispatches" to the site description keywords where the page list appears.
- `src/lib/seo-entities.ts`: add the Medium profile URL to the scholarly/social links list so it appears in structured data and the About page.
- Structured data: the `Blog`/`ItemList` on the Dispatches page; the Medium profile added to the author's `sameAs` links.

## Standing constraints (unchanged)

- Never call Vinculum Security a "human security framework" or "The Doctrine of Relational Security". Use the indefinite article.
- Preserve the KECOBO RZ100967 (27 July 2026) copyright claim, sole-originator rights, stable icon stack, plain English, no em dashes, and the non-repetitive statement distribution.
- The publisher bio / About content is not changed by this task.

## Verification

1. Deploy the migration and edge function; invoke `medium-feed` once and confirm rows land in `medium_articles` (count matches the feed item count).
2. Load `/dispatches` in the preview; confirm cards render with cover images, dates, excerpts, and working Medium links.
3. Confirm the homepage strip shows the three newest articles.
4. Typecheck passes; no console errors.
5. Sitemap, `llms.txt`, and structured data include Dispatches.

## Notes

- Changes reach Google and the live URL only after publishing and recrawling.
- This does not block or depend on the UN Data Commons backend work, which remains paused until you connect your own Supabase.
