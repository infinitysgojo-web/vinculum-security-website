"""Multi-viewport headless audit of the 13-point Chancellery operational suite.

Runs against a production build served at http://localhost:8080/dashboard
(`npm run build && npx vite preview --port 8080`). For each of 360x640, 375x812,
768x1024 and 1440x900 it opens a training exercise and checks that:
  - the Chancellery Wire and its Signal Inspector and Decision Log trays expand and collapse
    without horizontal overflow,
  - the Rehearsal Drawer slides over without horizontal overflow and every tab renders,
  - Ctrl+K opens the command palette and "09" + Enter selects Desk 09,
  - the [ and ] hotkeys step desks, ? opens the shortcut sheet, Escape closes it,
  - the handover seal goes SEALED and the privacy mask toggles,
  - no uncaught exception, console error or error-boundary notice appears.
Usage: python3 qa/ui/operational-suite-audit.py [base_url]
"""
import json
import re
import sys
import time

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
VIEWPORTS = [(360, 640), (375, 812), (768, 1024), (1440, 900)]
INIT = (
    "document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');"
    "st.textContent='#stcm-wrapper{display:none!important}';document.head.appendChild(st);});"
    "sessionStorage.setItem('vs:offline-session', JSON.stringify({userId:'qa-user',email:'qa@example.com'}));"
)
OVERFLOW = "() => document.documentElement.scrollWidth - window.innerWidth"


def audit(pw, w, h):
    out = {"viewport": f"{w}x{h}", "checks": {}, "errors": []}
    browser = pw.chromium.launch()
    ctx = browser.new_context(viewport={"width": w, "height": h})
    ctx.add_init_script(INIT)
    page = ctx.new_page()
    page.on("pageerror", lambda e: out["errors"].append(f"pageerror: {e}"))
    page.on("console", lambda m: m.type == "error" and out["errors"].append(f"console: {m.text}"))
    c = out["checks"]

    page.goto(f"{BASE}/dashboard")
    page.get_by_role("button", name=re.compile("Open Scenario Library")).click()
    page.get_by_role("button", name="Start exercise").first.click()
    page.wait_for_selector("#vs-desk-title", timeout=15000)
    page.wait_for_timeout(1200)
    c["page_no_overflow"] = page.evaluate(OVERFLOW) <= 0

    # Surface 1: Chancellery Wire trays.
    wire = page.locator("[aria-controls='vs-wire']")
    wire.click()
    page.wait_for_selector("#vs-wire")
    for tab in ["signals", "decisions", "wire"]:
        page.get_by_test_id(f"wire-tab-{tab}").click()
        page.wait_for_timeout(150)
        c[f"wire_{tab}_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    c["inspector_publisher"] = True
    page.get_by_test_id("wire-tab-signals").click()
    c["inspector_publisher"] = "Active publisher" in page.get_by_test_id("active-publisher").inner_text()
    wire.click()
    page.wait_for_timeout(150)
    c["wire_collapses"] = page.locator("#vs-wire").count() == 0

    # Surface 3: command palette, hotkeys, shortcut sheet.
    page.locator("body").click(position={"x": 5, "y": 5})
    t0 = time.perf_counter()
    page.keyboard.press("Control+k")
    page.wait_for_selector("[data-testid='command-palette']")
    c["palette_open_ms"] = round((time.perf_counter() - t0) * 1000)
    page.keyboard.type("09")
    page.keyboard.press("Enter")
    page.wait_for_timeout(400)
    c["palette_jumps_desk_09"] = page.locator("#vs-desk-title").inner_text().strip() == "Stakeholder field audit"
    page.locator("body").click(position={"x": 5, "y": 5})
    page.keyboard.press("]")
    page.wait_for_timeout(300)
    c["hotkey_next"] = page.locator("#vs-desk-title").inner_text().strip() == "Continuity provision architect"
    page.keyboard.press("[")
    page.wait_for_timeout(300)
    c["hotkey_prev"] = page.locator("#vs-desk-title").inner_text().strip() == "Stakeholder field audit"
    page.keyboard.press("Shift+?")
    page.wait_for_selector("[data-testid='shortcut-sheet']")
    page.keyboard.press("Escape")
    page.wait_for_timeout(300)
    c["shortcut_sheet_escape"] = page.locator("[data-testid='shortcut-sheet']").count() == 0

    # Surface 2: Rehearsal Drawer.
    page.get_by_test_id("rehearsal-button").click()
    page.wait_for_selector("[data-testid='rehearsal-drawer']")
    page.wait_for_timeout(400)
    drawer_ok = True
    for tab in ["branches", "diff", "timeline", "summary", "pouch"]:
        page.get_by_test_id(f"rehearsal-tab-{tab}").click()
        page.wait_for_timeout(200)
        d = page.evaluate("() => { const e = document.querySelector('[data-testid=rehearsal-drawer]'); return e.scrollWidth - e.clientWidth; }")
        drawer_ok = drawer_ok and d <= 0 and page.evaluate(OVERFLOW) <= 0
    c["drawer_tabs_no_overflow"] = drawer_ok
    page.get_by_test_id("rehearsal-tab-branches").click()
    page.get_by_label("Branch name").fill("Branch B: Total Sovereign Rupture")
    page.get_by_test_id("create-branch").click()
    page.wait_for_timeout(500)
    c["branch_created"] = page.get_by_test_id("branch-indicator").count() == 1
    page.keyboard.press("Escape")
    page.wait_for_timeout(400)
    c["drawer_escape_closes"] = page.locator("[data-testid='rehearsal-drawer']").count() == 0

    # Seal and privacy mask.
    page.get_by_test_id("seal-badge").click()
    page.wait_for_function("() => document.querySelector('[data-testid=seal-badge]')?.dataset.sealState === 'intact'", timeout=8000)
    c["sealed_intact"] = True
    page.get_by_test_id("privacy-button").click()
    page.wait_for_timeout(200)
    c["mask_on"] = page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    # Lifting needs a confirming second click (the unmask safeguard).
    page.get_by_test_id("privacy-button").click()
    page.wait_for_timeout(150)
    page.get_by_test_id("privacy-button").click()
    page.wait_for_timeout(200)
    c["mask_off"] = not page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    c["page_no_overflow_end"] = page.evaluate(OVERFLOW) <= 0
    c["no_error_boundary"] = page.get_by_text("This page encountered a display issue.").count() == 0
    page.screenshot(path=f"qa/ui/suite-{w}.png")
    browser.close()
    return out


def main():
    results = []
    with sync_playwright() as pw:
        for w, h in VIEWPORTS:
            results.append(audit(pw, w, h))
    print(json.dumps(results, indent=1))
    failed = [r for r in results if r["errors"] or not all(v for k, v in r["checks"].items() if k != "palette_open_ms")]
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
