import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { COMMENTARY, COMMENTARY_COUNT, INQUIRY_THEME, THEMES, THEME_COUNTS } from "../src/content/commentary";
import { ARCHIVE_FORMAT, ARCHIVE_SCHEMA, ARCHIVE_VERSION, archiveFileName, validateArchive } from "../src/components/desk/archive";
import { auditLogText, clearLedger, formatEntry, ledgerEntries, logEvent, mintedKind } from "../src/components/desk/ledgerStore";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

test("every commentary inquiry belongs to exactly one theme, and the pills sum to the corpus", () => {
  const ids = COMMENTARY.flatMap((d) => d.items.map((i) => i.id));
  expect(ids.length).toBe(COMMENTARY_COUNT);
  expect(Object.keys(INQUIRY_THEME).length).toBe(ids.length);
  for (const id of ids) expect(THEMES.map((t) => t.id)).toContain(INQUIRY_THEME[id]);
  expect(Object.values(THEME_COUNTS).reduce((a, b) => a + b, 0)).toBe(COMMENTARY_COUNT);
});

test("the consent banner offers only the essential category, with no commercial wording", () => {
  const html = read("index.html");
  const init = html.slice(html.indexOf("silktideConsentManager.init"));
  expect(init).not.toMatch(/id:\s*"marketing"/);
  expect(init).not.toMatch(/id:\s*"analytics"/);
  expect(init).not.toMatch(/ad_storage|ad_user_data|ad_personalization|analytics_storage/);
  expect(init).not.toMatch(/advertising partners|relevant ads|marketing campaigns|personalized content/i);
  expect((init.match(/\bid:\s*"/g) ?? []).length).toBe(1);
  expect(init).toContain('id: "essential"');
});

for (const source of ["/(.*)", "/dashboard", "/login"]) {
  test(`${source} CSP restricts connections and keeps object-src none`, () => {
    const config = JSON.parse(read("vercel.json"));
    const rule = config.headers.find((e: { source: string }) => e.source === source);
    const csp: string = rule.headers.find((h: { key: string }) => h.key === "Content-Security-Policy").value;
    expect(csp).toContain("object-src 'none'");
    const connect = csp.split(";").map((d) => d.trim()).find((d) => d.startsWith("connect-src"))!;
    for (const src of ["'self'", "https://*.supabase.co", "https://*.lovable.cloud"]) expect(connect).toContain(src);
    expect(connect).not.toMatch(/(^|\s)(\*|https:)(\s|$)/);
  });
}

test("Permissions-Policy disables device APIs and interest cohorts", () => {
  const config = JSON.parse(read("vercel.json"));
  const rule = config.headers.find((e: { source: string }) => e.source === "/(.*)");
  const pp: string = rule.headers.find((h: { key: string }) => h.key === "Permissions-Policy").value;
  for (const f of ["camera=()", "microphone=()", "geolocation=()", "payment=()", "usb=()", "interest-cohort=()"]) expect(pp).toContain(f);
});

test("route scroll memory is gone: no stored scroll positions", () => {
  const app = read("src/App.tsx");
  expect(app).not.toMatch(/SCROLL_KEY|readMap|ScrollMemory|vs:scroll/);
  expect(app).toContain("<ScrollToTop />");
});

test("mission archive filename and schema validation", () => {
  expect(archiveFileName("Great Lakes Region", new Date("2026-03-04T23:30:00Z"))).toBe("VINCULUM-MISSION-GREAT-LAKES-REGION-2026-03-04.vinculum");
  expect(archiveFileName("  ", new Date("2026-03-04T00:00:00Z"))).toBe("VINCULUM-MISSION-UNNAMED-2026-03-04.vinculum");
  const good = { format: ARCHIVE_FORMAT, schema: ARCHIVE_SCHEMA, version: ARCHIVE_VERSION, profile: { theatre: "X", bonds: {} }, binder: [], signals: {} };
  expect(validateArchive(good).ok).toBe(true);
  expect(validateArchive({ format: ARCHIVE_FORMAT, version: 3, profile: {} }).ok).toBe(true);
  for (const bad of [null, [], "x", { format: "other", profile: {} }, { ...good, schema: "nope" }, { ...good, version: 99 }, { ...good, version: 1.5 }, { ...good, profile: null }, { ...good, binder: {} }, { ...good, signals: [] }, { ...good, profile: { theatre: 4 } }]) {
    const v = validateArchive(bad);
    expect(v.ok).toBe(false);
    expect(typeof v.reason).toBe("string");
  }
});

test("session ledger formats UTC entries and copies an audit log", () => {
  clearLedger();
  logEvent("MISSION_HYDRATED", "Great Lakes Theatre", new Date("2026-01-02T03:04:05Z"));
  logEvent(mintedKind("demarche"), "Ref SAMPLE-REFERENCE", new Date("2026-01-02T03:04:06Z"));
  const [a, b] = ledgerEntries();
  expect(formatEntry(a)).toBe("[03:04:05 UTC] MISSION_HYDRATED: Great Lakes Theatre");
  expect(formatEntry(b)).toBe("[03:04:06 UTC] DEMARCHE_MINTED: Ref SAMPLE-REFERENCE");
  expect(mintedKind("note-verbale")).toBe("NOTE_VERBALE_MINTED");
  expect(auditLogText()).toContain("[03:04:06 UTC] DEMARCHE_MINTED");
  clearLedger();
});
