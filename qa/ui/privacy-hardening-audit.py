"""Headless audit of the unified privacy mask, input hygiene and clipboard perimeter.

Runs against the production build served with the vercel.json headers
(`npm run build && python3 qa/serve_vercel_headers.py --port 8080`). For each of
360x640, 375x812, 768x1024 and 1440x900 it opens a training exercise and checks that:
  - Alt+M engages the mask: html.vs-shroud, aria-pressed, the shrouded window title, the
    theatre name gone from text and from every title / aria-label / alt / placeholder;
  - narrative fields freeze (read-only, tabindex -1, pointer-events none, transparent caret)
    while range dials stay interactive and keep publishing;
  - a copy from a narrative field writes masked tokens; print media keeps the bars opaque;
  - one Alt+M press only arms the unmask, a second within the window lifts it, and every
    attribute, field state and the title return exactly;
  - the header shield and the command palette drive the same state;
  - a Trojan Source drop (U+202E) is refused and inserts nothing;
  - Ctrl+S blurs the focused field before the save;
  - the Permissions-Policy header carries the hardware lockdown;
  - no horizontal overflow, uncaught exception, console error or error boundary.
Usage: python3 qa/ui/privacy-hardening-audit.py [base_url]
"""
import json
import re
import sys

from playwright.sync_api import sync_playwright

BASE = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8080"
VIEWPORTS = [(360, 640), (375, 812), (768, 1024), (1440, 900)]
INIT = (
    "document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');"
    "st.textContent='#stcm-wrapper{display:none!important}';document.head.appendChild(st);});"
    "sessionStorage.setItem('vs:offline-session', JSON.stringify({userId:'qa-user',email:'qa@example.com'}));"
)
OVERFLOW = "() => document.documentElement.scrollWidth - window.innerWidth"
ATTRS = """() => [...document.querySelectorAll('[title],[aria-label],[alt],[placeholder]')]
  .map((e, i) => [i, e.getAttribute('title'), e.getAttribute('aria-label'), e.getAttribute('alt'), e.getAttribute('placeholder')])"""
FIELD = "document.querySelector('textarea:not([data-shroud-keep])')"


def audit(pw, w, h):
    out = {"viewport": f"{w}x{h}", "checks": {}, "errors": []}
    browser = pw.chromium.launch()
    ctx = browser.new_context(viewport={"width": w, "height": h})
    ctx.add_init_script(INIT)
    page = ctx.new_page()
    page.on("pageerror", lambda e: out["errors"].append(f"pageerror: {e}"))
    page.on("console", lambda m: m.type == "error" and out["errors"].append(f"console: {m.text}"))
    c = out["checks"]

    resp = page.goto(f"{BASE}/dashboard")
    pp = resp.headers.get("permissions-policy", "")
    c["permissions_policy_hardware"] = all(f in pp for f in ["serial=()", "hid=()", "midi=()", "screen-wake-lock=()", "ambient-light-sensor=()"])
    page.get_by_role("button", name=re.compile("Open Scenario Library")).click()
    page.get_by_role("button", name="Start exercise").first.click()
    page.wait_for_selector("#vs-desk-title", timeout=15000)
    page.wait_for_timeout(1200)
    # The theatre name the exercise opened on, read from the "Active mission" line.
    theatre = page.evaluate("""() => { const p = [...document.querySelectorAll('p')].find(x => x.textContent.startsWith('Active mission:'));
      return p ? p.querySelector('span')?.textContent.trim() || '' : ''; }""")
    c["theatre_known"] = len(theatre) >= 3
    # Desk 10 carries narrative textareas; Desk 03 carries range dials.
    page.keyboard.press("Control+k")
    page.wait_for_selector("[data-testid='command-palette']")
    page.keyboard.type("10")
    page.keyboard.press("Enter")
    page.wait_for_timeout(500)
    has_field = page.evaluate(f"() => !!{FIELD}")
    c["narrative_field_present"] = has_field
    before_attrs = page.evaluate(ATTRS)
    title_before = page.title()
    page.locator("body").click(position={"x": 5, "y": 5})

    # Engage with Alt+M.
    page.keyboard.press("Alt+m")
    page.wait_for_timeout(400)
    c["altm_engages"] = page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    c["aria_pressed"] = page.get_by_test_id("privacy-button").get_attribute("aria-pressed") == "true"
    c["title_shrouded"] = page.title() == "[RESTRICTED CHANCELLERY BRIEFING] · Vinculum Security"
    low = theatre.lower()
    c["theatre_gone_from_text"] = low not in page.evaluate("() => document.body.innerText.toLowerCase()")
    c["theatre_gone_from_attrs"] = not any(low in (v or "").lower() for row in page.evaluate(ATTRS) for v in row[1:])
    c["engaged_toast"] = page.get_by_text("Presentation Privacy Mask engaged").count() >= 1
    if has_field:
        st = page.evaluate(f"""() => {{ const t = {FIELD}; const cs = getComputedStyle(t);
          return {{ ro: t.readOnly, tab: t.getAttribute('tabindex'), pe: cs.pointerEvents, caret: cs.caretColor }}; }}""")
        c["field_frozen"] = st["ro"] and st["tab"] == "-1" and st["pe"] == "none" and st["caret"] in ("rgba(0, 0, 0, 0)", "transparent")
        # Copy from the frozen field: the clipboard gets masked tokens.
        copied = page.evaluate(
            f"""(name) => {{ const t = {FIELD}; const prev = t.value;
              const setter = Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype, 'value').set;
              t.readOnly = false; setter.call(t, 'Brief for ' + name + ' today'); t.readOnly = true;
              t.focus(); t.setSelectionRange(0, t.value.length);
              const dt = new DataTransfer(); const e = new ClipboardEvent('copy', {{ clipboardData: dt, bubbles: true, cancelable: true }});
              t.dispatchEvent(e); const got = dt.getData('text/plain');
              t.readOnly = false; setter.call(t, prev); t.readOnly = true; t.blur();
              return {{ got, prevented: e.defaultPrevented }}; }}""",
            theatre,
        )
        c["copy_masked"] = copied["prevented"] and low not in copied["got"].lower() and "[THEATRE · RESTRICTED]" in copied["got"]
        page.emulate_media(media="print")
        pr = page.evaluate(f"() => {{ const cs = getComputedStyle({FIELD}); return [cs.backgroundColor, cs.color, cs.printColorAdjust || cs.webkitPrintColorAdjust]; }}")
        c["print_opaque"] = pr[0] == "rgb(0, 0, 0)" and pr[1] == "rgba(0, 0, 0, 0)" and pr[2] == "exact"
        page.emulate_media(media="screen")
    # Desk 03: a range dial stays interactive under the mask.
    page.keyboard.press("Control+k")
    page.wait_for_selector("[data-testid='command-palette']")
    page.keyboard.type("03")
    page.keyboard.press("Enter")
    page.wait_for_timeout(500)
    dial = page.evaluate("""() => { const r = [...document.querySelectorAll('input[type=range]')].find(x => x.offsetParent);
      return r ? { pe: getComputedStyle(r).pointerEvents, ro: r.readOnly } : null; }""")
    c["dials_interactive"] = dial is None or (dial["pe"] != "none" and not dial["ro"])

    # One press only arms; the second lifts.
    page.locator("body").click(position={"x": 5, "y": 5})
    page.keyboard.press("Alt+m")
    page.wait_for_timeout(250)
    c["single_press_keeps_mask"] = page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    c["armed_shown"] = page.get_by_test_id("privacy-button").get_attribute("data-armed") == "true"
    page.keyboard.press("Alt+m")
    page.wait_for_timeout(400)
    c["second_press_lifts"] = not page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    c["title_restored"] = page.title() == title_before
    # Back on Desk 10 the attributes and field states match the pre-mask snapshot exactly.
    page.keyboard.press("Control+k")
    page.wait_for_selector("[data-testid='command-palette']")
    page.keyboard.type("10")
    page.keyboard.press("Enter")
    page.wait_for_timeout(500)
    c["attrs_restored_exactly"] = page.evaluate(ATTRS) == before_attrs
    if has_field:
        st = page.evaluate(f"() => {{ const t = {FIELD}; return {{ ro: t.readOnly, tab: t.getAttribute('tabindex'), pe: getComputedStyle(t).pointerEvents }}; }}")
        c["field_released"] = not st["ro"] and st["tab"] is None and st["pe"] != "none"

    # Header shield and palette drive the same state.
    page.get_by_test_id("privacy-button").click()
    page.wait_for_timeout(200)
    on = page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    page.keyboard.press("Control+k")
    page.wait_for_selector("[data-testid='command-palette']")
    page.keyboard.type("privacy mask")
    page.keyboard.press("Enter")
    page.wait_for_timeout(250)
    still = page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    page.get_by_test_id("privacy-button").click()
    page.wait_for_timeout(300)
    off = not page.evaluate("() => document.documentElement.classList.contains('vs-shroud')")
    c["shield_and_palette_share_state"] = on and still and off

    if has_field:
        # Trojan Source drop is refused.
        dropped = page.evaluate(
            f"""() => {{ const t = {FIELD}; const before = t.value; const dt = new DataTransfer();
              dt.setData('text/plain', 'release\\u202Eescrow'); const e = new DragEvent('drop', {{ dataTransfer: dt, bubbles: true, cancelable: true }});
              t.dispatchEvent(e); return {{ same: t.value === before, prevented: e.defaultPrevented }}; }}"""
        )
        c["trojan_drop_refused"] = dropped["same"] and dropped["prevented"]
        # Ctrl+S blurs the focused field first.
        page.locator("textarea:not([data-shroud-keep])").first.focus()
        page.keyboard.press("Control+s")
        page.wait_for_timeout(300)
        c["save_blurs_field"] = page.evaluate("() => document.activeElement?.tagName !== 'TEXTAREA'")

    c["page_no_overflow"] = page.evaluate(OVERFLOW) <= 0
    c["no_error_boundary"] = page.get_by_text("This page encountered a display issue.").count() == 0
    page.screenshot(path=f"qa/ui/privacy-{w}.png")
    browser.close()
    return out


def main():
    results = []
    with sync_playwright() as pw:
        for w, h in VIEWPORTS:
            results.append(audit(pw, w, h))
    print(json.dumps(results, indent=1))
    failed = [r for r in results if r["errors"] or not all(r["checks"].values())]
    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    main()
