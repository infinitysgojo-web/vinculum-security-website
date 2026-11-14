import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { CASES } from "../src/content/cases";
import { GLOSSARY } from "../src/content/glossary";
import { LEXICON, findLex } from "../src/components/desk/lexiconData";
import { PUBLIC_PILLARS, SITE_URL, navigationLd } from "../src/lib/seo-entities";
const read = (path: string) => readFileSync(path, "utf8");

test("sitemap contains exactly the real public routes and cases, never private desks", () => {
  const paths = [...read("public/sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => new URL(m[1]).pathname).sort();
  const app = read("src/App.tsx");
  const routes = [...app.matchAll(/<Route path="([^"]+)"/g)].map((m) => m[1]).filter((p) => !["*", "/login", "/dashboard", "/cases/:slug"].includes(p));
  expect(paths).toEqual([...routes, ...CASES.map((c) => `/cases/${c.slug}`)].sort());
  expect(new Set(paths).size).toBe(paths.length);
});

test("every referenced desk Lex term resolves and both reference collections have unique IDs", () => {
  expect(new Set(GLOSSARY.map((g) => g.id)).size).toBe(GLOSSARY.length);
  expect(new Set(LEXICON.map((g) => g.id)).size).toBe(LEXICON.length);
  for (const file of ["src/components/desk/RelationalDynamicsPanel.tsx", "src/components/desk/TelemetryStrip.tsx"]) {
    for (const m of read(file).matchAll(/<Lex term="([^"]+)"/g)) expect(findLex(m[1])).toBeDefined();
  }
});

test("static and rendered navigation reference the same canonical public destinations", () => {
  const scripts = [...read("index.html").matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  const graph = scripts.flatMap((match) => JSON.parse(match[1])["@graph"] ?? []);
  const directory = graph.find((node) => node["@id"] === navigationLd["@id"]);
  expect(directory).toBeDefined();
  expect(directory.itemListElement).toEqual(navigationLd.itemListElement);
  expect(directory.numberOfItems).toBe(PUBLIC_PILLARS.length);
  const sitemapUrls = [...read("public/sitemap.xml").matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
  for (const pillar of PUBLIC_PILLARS) {
    expect(new URL(`${SITE_URL}${pillar.to}`).hostname).toBe("www.vinculumsecurity.kidnexus.or.ke");
    expect(sitemapUrls).toContain(`${SITE_URL}${pillar.to}`);
    expect(["/dashboard", "/login"]).not.toContain(pillar.to);
  }
});