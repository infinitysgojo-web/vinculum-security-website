# Dispatches: a diplomatic news section with a hidden publisher desk

A new public section, **Dispatches**, at `/dispatches`, where you publish news and analysis on world events read through the Vinculum Security and Vinculum Diplomacy lens. Behind it, a private publisher desk that is not linked anywhere on the site.

## What readers see

**Dispatches index (`/dispatches`)**
- Same page header style as the rest of the site (eyebrow, serif title, gold rule, lede).
- Latest dispatch as a lead feature: large image, title, subtitle, date, reading time.
- Grid of remaining dispatches as cards in the existing card and hover-lift style.
- Topic filter row (regions and themes such as Peace Processes, Youth Peace and Security, Climate Security) and a tag list.
- "Dispatches" added to the header and mobile navigation.

**Single dispatch (`/dispatches/your-title`)**
- Diplomatic masthead: "Dispatch No. 0007", date, dateline (city), reading time, topic badge.
- Title, subtitle, full-width cover image with caption and credit.
- Body typography in the site's serif reading style, with drop-cap opening, pull quotes, headings, lists, links and images.
- Reading progress bar (reusing the existing component).
- Share row: copy link, X, LinkedIn, WhatsApp.
- "Download as Policy Brief" button (see below).
- "About the Publisher" block with your portrait mark, a short high-value paragraph drawn from the About page, editable from the desk.
- Three related dispatches by shared topic or tag.
- Previous and next navigation.

**Policy Brief download**
- One click produces a PDF styled like a high-level brief: navy masthead with the Vinculum mark and "Vinculum Security · Dispatch", brief number and date, title and subtitle, a "Key Points" box (you write these in the desk; optional), the body text in two clean columns of serif type, and a footer with byline, citation line, licence and site address.
- Generated in the browser from the article content, so nothing on the site can crash if it fails; a failure only shows a polite message.

**RSS feed** at `/dispatches/feed.xml`, so readers and aggregators can subscribe.

## The publisher desk (private)

- Reached only at `/desk` (not linked or listed anywhere, excluded from the sitemap and robots).
- Sign in with email and password. A 4-digit PIN then quickly re-unlocks the desk on the same device after the first sign-in; the PIN alone can never open the desk.
- Only your account can enter. Anyone else who finds the address sees a plain sign-in and gets nowhere.

**Desk tools**
- Dashboard: counts of published and draft dispatches, the latest pieces, quick "New Dispatch".
- Editor with: title, slug (auto from title, editable), cover image upload with caption and credit, subtitle, dateline, topic, tags, Key Points for the brief, rich text body (headings, bold, italic, quotes, lists, links, inline images, no em dashes inserted automatically), and a search preview snippet.
- Autosave of drafts every few seconds, with a "last saved" indicator.
- Live preview toggle that renders the piece exactly as readers will see it.
- Status: Draft, Scheduled (publish at a date and time), Published, Archived.
- Article list with search, filter by status and topic, duplicate, archive, delete with confirmation.
- Media library of uploaded images.
- Publisher profile page: edit the "About the Publisher" paragraph and the desk PIN, change password.
- Sign out.

## Search engines and AI

- Every dispatch gets its own title, description, canonical address, social preview (its cover image), NewsArticle structured data with author, publisher, dates and keywords, and Article breadcrumbs.
- The index page gets CollectionPage structured data.
- Sitemap is generated dynamically from published dispatches so new pieces are indexed without code changes.
- `llms.txt` gains a Dispatches section pointing at the index and the feed.
- Draft, scheduled and archived pieces are never visible publicly or to crawlers.

## Content and voice rules kept

- No em dashes anywhere in templates or generated text.
- Vinculum Security is referred to as a doctrine, also stated as A Doctrine of Relational Security.
- Existing colour palette, serif and sans pairing, gold rules, badges and fade-in motion are reused; no new visual language.

## Technical details

- Lovable Cloud is enabled for the database, sign-in and image storage.
- Tables: `dispatches` (title, slug, subtitle, dateline, cover image and caption, body as rich text JSON plus rendered HTML, key points, topic, tags, status, published_at, reading time, SEO fields), `topics`, `publisher_profile` (bio paragraph, hashed PIN), `user_roles` with a `publisher` role checked through a security-definer function. Public reads are limited to `status = published and published_at <= now()`; all writes require the publisher role. Grants and row-level security on every table.
- Storage bucket `dispatch-media` (public read, publisher-only write).
- Your account is created with the email you gave; the password is set through the Cloud sign-in form, not stored in code. The PIN is hashed and only accepted when a valid session already exists on the device.
- Rich text editor: TipTap. Rendered HTML is sanitised with DOMPurify before display.
- PDF: `@react-pdf/renderer` builds the brief client-side from the stored content; wrapped in an error boundary.
- New routes: `/dispatches`, `/dispatches/:slug`, `/desk`, `/desk/new`, `/desk/edit/:id`, `/desk/media`, `/desk/profile`. `/desk*` is guarded by the role check.
- Sitemap and RSS are served by two small edge functions reading published dispatches; `public/sitemap.xml` keeps the static pages and references the dynamic one.
- Data fetching with the existing TanStack Query setup; toasts with sonner.

## Order of work

1. Enable Cloud, create tables, roles, storage, your account.
2. Desk sign-in, PIN unlock, route guard.
3. Editor, autosave, media upload, article list, profile.
4. Public index and single dispatch pages, navigation link, share row, related pieces.
5. SEO, structured data, dynamic sitemap, RSS, llms.txt.
6. Policy Brief PDF.
7. Full check that nothing existing changed and that every page still renders.
