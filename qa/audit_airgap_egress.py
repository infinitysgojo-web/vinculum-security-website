#!/usr/bin/env python3
"""
Vinculum Security - air-gap egress and header audit.

Drives a real headless Chromium through public pages, the Mission Foyer, a
Preset Proving Ground exercise and the full 18-desk dashboard chain, then fires
the panic purge, and fails on any request to a host
outside the allow-list, any CSP violation, any page error or a Sentinel canary
false positive.

Allowed hosts: the server under test (localhost / 127.0.0.1 / ::1) and the auth
backend, *.supabase.co and *.lovable.cloud (sign-in and the public article feed;
the CSP connect-src names exactly these). Fonts are self-hosted, so Google Fonts
is not allowed.

The dashboard needs a session. The audit uses the dashboard's own offline field
session (sessionStorage "vs:offline-session", the path a cached credential
unlocks with no connection), so no real credential or network sign-in is used.

Usage
  bun x vite                                  # dev server, port 8080 (vite.config.ts)
  python3 qa/audit_airgap_egress.py

  bun x vite build && python3 qa/serve_vercel_headers.py --port 4173 &
  python3 qa/audit_airgap_egress.py --base-url http://127.0.0.1:4173 --require-headers

Requires: pip install playwright && python3 -m playwright install chromium
"""

import argparse
import asyncio
import json
import sys
from urllib.parse import urlparse

from playwright.async_api import async_playwright

LOCAL_HOSTS = {"localhost", "127.0.0.1", "::1", "[::1]"}
AUTH_SUFFIXES = (".supabase.co", ".lovable.cloud")
PUBLIC_ROUTES = ["/", "/the-vinculum-dashboard", "/practice", "/doctrine", "/cases", "/glossary"]
DESK_COUNT = 18
OFFLINE_SESSION = {"userId": "00000000-0000-4000-8000-00000000a11d", "email": "airgap.audit@example.invalid"}

INIT = """
window.__csp = [];
document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(e.violatedDirective + ' ' + e.blockedURI));
"""


def classify(url: str) -> str:
    p = urlparse(url)
    if p.scheme in ("data", "blob", "about", "chrome-extension"):
        return "local"
    host = (p.hostname or "").lower()
    if host in LOCAL_HOSTS:
        return "local"
    if host.endswith(AUTH_SUFFIXES):
        return "auth"
    return "foreign"


async def run(base: str, require_headers: bool) -> int:
    failures: list[str] = []
    foreign: list[str] = []
    auth: list[str] = []
    page_errors: list[str] = []

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 800})
        await context.add_init_script(INIT)
        page = await context.new_page()

        def on_request(req):
            kind = classify(req.url)
            if kind == "foreign":
                foreign.append(f"{req.method} {req.url}")
            elif kind == "auth":
                auth.append(f"{req.method} {req.url}")

        page.on("request", on_request)
        page.on("pageerror", lambda e: page_errors.append(str(e)))

        def check_headers(res, path: str):
            h = res.headers if res else {}
            csp = h.get("content-security-policy", "")
            if not csp:
                msg = f"{path}: no CSP header (dev server sends none; run against the header server for the edge policy)"
                (failures if require_headers else []).append(msg)
                print(f"    [i] {msg}")
                return
            for cond, msg in [
                (h.get("x-content-type-options") == "nosniff", "X-Content-Type-Options nosniff"),
                ("frame-ancestors" in csp, "CSP frame-ancestors"),
                ("https://*.supabase.co" in csp and "https://*.lovable.cloud" in csp, "CSP auth hosts"),
                ("googleapis" not in csp and "gstatic" not in csp, "no Google Fonts in CSP"),
                (h.get("cross-origin-opener-policy") == "same-origin", "COOP same-origin"),
                (h.get("cross-origin-resource-policy") == "same-origin", "CORP same-origin"),
                ("x-frame-options" not in h, "no X-Frame-Options (Lovable preview framing)"),
            ]:
                if not cond:
                    failures.append(f"{path}: header check failed: {msg}")
            if path == "/dashboard":
                if "noindex" not in h.get("x-robots-tag", ""):
                    failures.append("/dashboard: missing X-Robots-Tag noindex")
                if "no-store" not in h.get("cache-control", ""):
                    failures.append("/dashboard: missing Cache-Control no-store")
            print(f"    [+] {path}: security headers present")

        async def dismiss_consent():
            # The essential-only consent banner (self-hosted Silktide) overlays the page on a first visit.
            btn = page.locator(".stcm-accept-all, .stcm-reject-all").first
            if await btn.count() and await btn.is_visible():
                await btn.click()

        print(f"[*] Base URL {base}")
        print("[*] Public routes")
        for path in PUBLIC_ROUTES:
            res = await page.goto(base + path, wait_until="networkidle")
            check_headers(res, path)
            await dismiss_consent()
            links = await page.eval_on_selector_all("a[href]", "els => els.map(e => e.getAttribute('href'))")
            bad = [l for l in links if l and urlparse(l).path in ("/dashboard", "/login")]
            if bad:
                failures.append(f"{path}: links to {bad}")

        print("[*] Mission dashboard (offline field session)")
        await page.evaluate("s => sessionStorage.setItem('vs:offline-session', s)", json.dumps(OFFLINE_SESSION))
        res = await page.goto(base + "/dashboard", wait_until="networkidle")
        check_headers(res, "/dashboard")
        await page.wait_for_selector("text=Vinculum Dashboard", timeout=15000)
        await dismiss_consent()

        # Two-mode architecture: the dashboard opens on the Mission Foyer. Start a Preset Proving
        # Ground exercise from the Scenario Library before the desks (and the preset selector) exist.
        await page.get_by_role("button", name="Open Scenario Library").click()
        await page.get_by_role("button", name="Start exercise").first.click()
        await page.wait_for_selector("#vs-desk-title", timeout=15000)
        print("    [+] Mission Foyer -> Scenario Library -> Preset Proving Ground exercise")

        # Hydrate every desk from the first theatre preset on the Mission Operations Deck's
        # integrated selector, then walk the whole chain with ].
        preset = page.locator('select[data-testid="theatre-preset"]')
        options = await preset.locator("option").evaluate_all("els => els.map(e => e.value).filter(Boolean)")
        if not options:
            failures.append("theatre preset selector carries no presets")
        else:
            await preset.select_option(options[0])
        await page.wait_for_timeout(800)
        await page.locator("body").click(position={"x": 5, "y": 5})
        for _ in range(DESK_COUNT - 1):
            await page.keyboard.press("BracketRight")
            await page.wait_for_timeout(250)
        step = await page.locator("text=/Step \\d+ of \\d+/").first.inner_text()
        if step.strip().lower() != f"step {DESK_COUNT} of {DESK_COUNT}":
            failures.append(f"desk walk ended on '{step}', expected Step {DESK_COUNT} of {DESK_COUNT}")
        else:
            print(f"    [+] walked all {DESK_COUNT} desks ({step})")
        await page.wait_for_load_state("networkidle")

        if await page.locator('[data-testid="sentinel-canary-banner"]').count():
            failures.append("Sentinel canary fired during normal use (false positive)")
        else:
            print("    [+] DOM canary silent in normal use")

        print("[*] Panic purge (Ctrl+Shift+X)")
        await page.evaluate("localStorage.setItem('vinculum-session:' + JSON.parse(sessionStorage.getItem('vs:offline-session')).userId, '{}')")
        await page.keyboard.press("Control+Shift+KeyX")
        try:
            await page.wait_for_url("**/login", timeout=8000)
            print("    [+] landed on /login")
        except Exception:  # noqa: BLE001
            failures.append(f"panic purge did not reach /login (at {page.url})")
        state = await page.evaluate(
            """async () => ({
                session: sessionStorage.length,
                local: Object.keys(localStorage).filter(k => /^(vinculum[-_:]|vs:|sb-)/.test(k) && k !== 'vs:registry_seq'),
                dbs: indexedDB.databases ? (await indexedDB.databases()).map(d => d.name) : [],
            })"""
        )
        if state["session"] or state["local"] or "vinculum_chancellery_vault" in state["dbs"]:
            failures.append(f"panic purge left state behind: {state}")
        else:
            print("    [+] sessionStorage, saved sessions and the IndexedDB vault are gone")

        csp = await page.evaluate("window.__csp")
        if csp:
            failures.append(f"CSP violations: {csp}")
        await browser.close()

    if page_errors:
        failures.append(f"page errors: {page_errors}")
    if foreign:
        failures.append(f"{len(foreign)} request(s) to non-allowed hosts")
    print(f"[i] Auth-backend requests (allowed): {len(auth)}")
    for u in auth:
        print(f"    - {u}")
    if failures:
        print(f"[!] FAILED ({len(failures)})")
        for f in failures:
            print(f"    - {f}")
        for u in foreign:
            print(f"    - egress: {u}")
        return 1
    print("[+] PASS: zero non-allowed network egress, zero CSP violations, zero page errors.")
    return 0


if __name__ == "__main__":
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--base-url", default="http://localhost:8080", help="dev server (8080) or the header server")
    ap.add_argument("--require-headers", action="store_true", help="fail when the edge security headers are missing")
    args = ap.parse_args()
    sys.exit(asyncio.run(run(args.base_url.rstrip("/"), args.require_headers)))
