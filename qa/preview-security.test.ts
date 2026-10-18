import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";

const config = JSON.parse(readFileSync(new URL("../vercel.json", import.meta.url), "utf8"));
for (const source of ["/(.*)", "/dashboard", "/login"]) {
  test(`${source} permits Lovable previews but not arbitrary framing`, () => {
    const rule = config.headers.find((entry: { source: string }) => entry.source === source);
    const policy = rule.headers.find((header: { key: string }) => header.key === "Content-Security-Policy").value;
    const ancestors = policy.split(";").map((d: string) => d.trim()).find((d: string) => d.startsWith("frame-ancestors")).split(/\s+/).slice(1);
    expect(ancestors).toContain("'self'");
    expect(ancestors).toContain("https://lovable.dev");
    expect(ancestors).toContain("https://*.lovable.app");
    expect(ancestors).not.toContain("*");
    expect(ancestors).not.toContain("https:");
    expect(rule.headers.some((header: { key: string }) => header.key === "X-Frame-Options")).toBe(false);
  });
}