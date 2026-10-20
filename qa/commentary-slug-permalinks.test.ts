import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { COMMENTARY, COMMENTARY_COUNT, INQUIRY_BY_NUMBER, INQUIRY_NUMBER } from "../src/content/commentary";

const ids = COMMENTARY.flatMap((d) => d.items.map((i) => i.id));
const page = readFileSync(new URL("../src/pages/Commentary.tsx", import.meta.url), "utf8");
const search = readFileSync(new URL("../src/components/QuickSearch.tsx", import.meta.url), "utf8");

describe("commentary slug permalinks", () => {
  test("every inquiry has a unique, URL-safe slug", () => {
    expect(ids.length).toBe(COMMENTARY_COUNT);
    expect(new Set(ids).size).toBe(ids.length);
    for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  });

  test("slugs never collide with division anchors", () => {
    const divs = new Set(COMMENTARY.map((d) => d.id));
    for (const id of ids) expect(divs.has(`q-${id}`)).toBe(false);
  });

  test("legacy numeric links still resolve to their slug", () => {
    for (const id of ids) expect(INQUIRY_BY_NUMBER[INQUIRY_NUMBER[id]]).toBe(id);
    for (const slug of ["decay-horizon", "forum-enforceability", "escrow-waterfall", "instruments-together"])
      expect(ids).toContain(slug);
  });

  test("copied permalinks and quick search use #q-<slug>", () => {
    expect(page).toContain("/commentary#q-${id}");
    expect(page).toContain('replaceState(null, "", `#q-${id}`)');
    expect(page).toContain("id={`q-${item.id}`}");
    expect(page).toContain("<span id={`inquiry-${n}`}");
    expect(page).not.toContain("/commentary#inquiry-${");
    expect(page).not.toContain("href={`#inquiry-");
    expect(search).toContain("to: `/commentary#q-${item.id}`");
    expect(search).toContain("anchor: `q-${item.id}`");
    expect(search).not.toContain("#inquiry-");
  });
});
