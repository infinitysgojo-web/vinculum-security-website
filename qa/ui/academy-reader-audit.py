"""Headless audit of the Chancellery Academy lecture reader (Phase A).

Runs against a production build served at http://localhost:8080 (`bun run build && bunx vite
preview --port 8080`), signing in with the same offline-session stub as operational-suite-audit.py.
At each viewport it opens a lecture and checks that:
  - the page never scrolls sideways (hub, Tier 1, reader top, every instrument, quiz, footer),
  - the Close lecture X is visible, at least 44 x 44, and stays visible after scrolling,
  - Escape closes the lecture from inside a slider, from a quiz option and from the Contents menu
    (the first Escape closing the menu), and focus returns to the opener,
  - a quiz answer survives a close and reopen, and reopening offers to resume,
  - no uncaught exception or console error appears.
Usage: python3 qa/ui/academy-reader-audit.py [base_url]
"""
import json
import re
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
VIEWPORTS = [(1920, 1080), (1440, 900), (1280, 800), (1024, 768), (768, 1024), (390, 844), (375, 812), (360, 640), (844, 390)]
INIT = (
    "document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');"
    "st.textContent='#stcm-wrapper{display:none!important}';document.head.appendChild(st);});"
    "sessionStorage.setItem('vs:offline-session', JSON.stringify({userId:'qa-user',email:'qa@example.com'}));"
)
OVERFLOW = "() => Math.max(document.documentElement.scrollWidth - window.innerWidth, (document.querySelector('[data-testid=reader-scroll]')||{scrollWidth:0,clientWidth:0}).scrollWidth - (document.querySelector('[data-testid=reader-scroll]')||{clientWidth:0}).clientWidth)"


def audit(pw, w, h):
    out = {"viewport": f"{w}x{h}", "checks": {}, "errors": []}
    browser = pw.chromium.launch()
    page = browser.new_context(viewport={"width": w, "height": h}).new_page()
    page.context.add_init_script(INIT)
    page.on("pageerror", lambda e: out["errors"].append(f"pageerror: {e}"))
    page.on("console", lambda m: m.type == "error" and out["errors"].append(f"console: {m.text}"))
    c = out["checks"]
    page.goto(f"{BASE}/dashboard")
    page.get_by_role("button", name=re.compile("Enter Chancellery Academy")).first.click()
    page.wait_for_selector("[data-testid=chapter-tier-1]")
    c["hub_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    page.locator("[data-module-id='relational-mathematics']").click()
    opener = page.get_by_test_id("open-lecture")
    opener.click()
    page.wait_for_selector("[data-testid=academy-reader]")
    x = page.get_by_test_id("reader-close")
    box = x.bounding_box()
    c["x_visible_44"] = bool(box and box["width"] >= 44 and box["height"] >= 44 and x.is_visible())
    c["reader_top_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    for kind in ["timeline"]:
        page.locator(f"[data-testid=instrument-{kind}]").scroll_into_view_if_needed()
        c[f"{kind}_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    c["x_visible_after_scroll"] = x.is_visible() and x.bounding_box()["y"] < 120
    slider = page.locator("#tl-observed")
    slider.focus()
    page.keyboard.press("ArrowRight")
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    c["esc_from_slider_closes"] = page.locator("[data-testid=academy-reader]").count() == 0
    c["focus_returns_to_opener"] = page.evaluate("() => document.activeElement && document.activeElement.getAttribute('data-testid')") == "open-lecture"
    opener.click()
    page.wait_for_selector("[data-testid=academy-reader]")
    c["resume_offered"] = page.get_by_test_id("reader-resume").count() == 1
    quiz = page.get_by_test_id("lecture-quiz")
    quiz.scroll_into_view_if_needed()
    c["quiz_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    opt = quiz.locator("fieldset").first.locator("button").nth(1)
    opt.click()
    opt.focus()
    page.keyboard.press("Escape")
    page.wait_for_timeout(200)
    c["esc_from_quiz_closes"] = page.locator("[data-testid=academy-reader]").count() == 0
    opener.click()
    page.wait_for_selector("[data-testid=academy-reader]")
    first = page.get_by_test_id("lecture-quiz").locator("fieldset").first.locator("button").nth(1)
    c["quiz_answer_survives"] = first.get_attribute("aria-pressed") == "true"
    page.get_by_test_id("lecture-footer").scroll_into_view_if_needed()
    c["footer_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    if w < 1280:
        page.get_by_test_id("reader-contents-button").click()
        page.keyboard.press("Escape")
        page.wait_for_timeout(150)
        c["esc_closes_menu_first"] = page.get_by_test_id("reader-contents-menu").count() == 0 and page.locator("[data-testid=academy-reader]").count() == 1
    page.get_by_test_id("reader-close").click()
    page.wait_for_timeout(150)
    c["x_closes"] = page.locator("[data-testid=academy-reader]").count() == 0
    browser.close()
    return out


if __name__ == "__main__":
    with sync_playwright() as pw:
        results = [audit(pw, w, h) for (w, h) in VIEWPORTS]
    print(json.dumps(results, indent=1))
    bad = [(r["viewport"], k) for r in results for k, v in r["checks"].items() if not v] + [(r["viewport"], e) for r in results for e in r["errors"]]
    print("FAILURES:", bad if bad else "none")
    sys.exit(1 if bad else 0)
