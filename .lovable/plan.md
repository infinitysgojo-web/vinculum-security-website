# Your own Supabase + UN Data Commons backend

Two parts: move the backend to your own Supabase project, then build the UN System Data Commons connection inside it. Backend only for now, no frontend work.

## Part 1: Move to your own Supabase

The current backend is empty, so nothing needs copying.

Switching the project from the built-in backend to your own Supabase project is done from the editor, not by me: open the Plus (+) menu, remove the built-in backend, then choose "Connect Supabase" and pick the project at `yquxgvsifdklbgbtqjrh`. After that every table, function, and file I create lands in your Supabase project and nowhere else.

I will pause here until that switch is done, because anything I build before it would be created in the wrong place.

The publishable key you pasted is safe to keep in the project (it is the public one). Please do not paste the direct connection string or the service key in chat; once the project is connected through the editor I already have the access I need.

## Part 2: UN System Data Commons

I checked the service directly. Two things are true:

- The MCP server address you gave is an assistant tool. It helps me explore the data while building, but a website cannot call it. It is added once in your workspace connector settings, under "New MCP server".
- The data itself is available over a plain public web API on the same host, no key required. I confirmed live responses from it. That is what your site will use.

Following your choice, the server fetches and stores the data, so pages load fast and stay up even if the UN service is briefly down.

### What gets built

1. **Storage tables** in your Supabase project:
   - `un_entities` — countries and regions (code, name, type)
   - `un_indicators` — the statistical measures (code, title, description, unit, topic)
   - `un_observations` — one row per entity, indicator, year, value, with the source named
   - `un_sync_runs` — a log of each refresh: when, what, how many rows, any error
2. **A fetch-and-store function** that pulls a requested set of indicators and countries from the UN service, normalises them, and saves them, updating rather than duplicating existing rows.
3. **A scheduled refresh** that runs the fetch on a regular timer so the stored copy stays current without anyone pressing anything.
4. **A read endpoint** so the site can later ask for a country, an indicator, or a time series in one simple call.
5. **Public read, locked writes.** Anyone can read the stored statistics; only the scheduled job and you can write.

### Starting data

You said to choose, so the first load covers the countries already featured in your case studies (Rwanda, Colombia, South Africa, Northern Ireland via the United Kingdom, Kenya, Liberia, Cambodia, Tuvalu, Kiribati) plus global totals, across a themed set of indicators that fit the doctrine: population, conflict and security, governance and institutions, development and poverty, health, education, and climate exposure. The set is stored as data, so adding countries or indicators later is a row, not a rebuild.

### Verification before I call it done

I will run a real refresh, show you the row counts per indicator, and read a few values back out, so you can see actual UN numbers sitting in your own database.

## Technical notes

- REST base confirmed as `https://unsd-datacommons.gcp.un-icc.cloud/core/api/v2` (`/node` and `/observation` both respond, unauthenticated).
- Edge function `un-data-sync` performs the pull in batches, with retry and backoff; `un-data-query` serves reads. Scheduling via `pg_cron` plus `pg_net`.
- Every table gets explicit grants, RLS enabled, public `SELECT` policy, writes restricted to the service role.
- Unique keys on `(entity_code, indicator_code, period)` so repeat runs update in place.
