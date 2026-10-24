import { describe, expect, test } from "bun:test";
import { readFileSync } from "fs";
import path from "path";

const root = path.resolve(import.meta.dir, "..");
const read = (f: string) => readFileSync(path.join(root, f), "utf8");

describe("phone layout: scoped consent clearance", () => {
  const css = read("src/index.css");
  const app = read("src/App.tsx");

  test("mobile 4.5rem clearance applies only to public <main>", () => {
    expect(css).toContain("main:not([data-dashboard]):not([data-portal]) { padding-bottom: 4.5rem; }");
    expect(css).not.toMatch(/@media \(max-width: 640px\) \{ main \{ padding-bottom/);
  });

  test("portal <main> carries data-portal / data-dashboard and pb-0", () => {
    expect(app).toContain('data-portal={portal ? "true" : undefined}');
    expect(app).toContain('data-dashboard={pathname.startsWith("/dashboard") ? "true" : undefined}');
    expect(app).toContain('portal ? "flex-1 pb-0" : "flex-1"');
  });
});

describe("build packaging: vendor chunks", () => {
  const cfg = read("vite.config.ts");

  test("warning threshold calibrated", () => {
    expect(cfg).toContain("chunkSizeWarningLimit: 2000");
  });

  test("manualChunks splits pdf, icons, radix and react core by exact package", () => {
    expect(cfg).toContain("manualChunks: vendorChunk");
    for (const name of ["vendor-pdf", "vendor-icons", "vendor-radix", "vendor-react-core"]) expect(cfg).toContain(`"${name}"`);
    expect(cfg).not.toContain("id.includes('react')");
  });

  test("CommonJS helpers pinned to core so the PDF chunk stays lazy", () => {
    expect(cfg).toMatch(/commonjsHelpers"\)\) return "vendor-react-core"/);
  });

  test("offline manifest plugin still stamps every asset into sw.js", () => {
    expect(cfg).toContain("offlineManifest()");
    expect(cfg).toContain('.replace("/*__BUILD_ASSETS__*/ []", JSON.stringify(urls))');
  });
});
