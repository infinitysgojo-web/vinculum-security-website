import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { COMMENTARY } from "../src/content/commentary";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const legal = COMMENTARY.flatMap((d) => d.items).find((i) => i.id === "legal-status")!;
const files = ["src/components/SiteFooter.tsx", "src/pages/About.tsx", "public/llms-full.txt", "public/llms.txt"];

describe("Compact and Codex named as statutorily protected works", () => {
  test("legal-status inquiry names both works with the statutory wording", () => {
    const p = legal.a[0];
    expect(p).toContain("The Vinculum Compact (the sovereign relational accord and covenantal framework)");
    expect(p).toContain("The Vinculum Codex (the canonical jurisprudential and operational formulations of Deterministic Relational Law)");
    expect(p).toContain("statutorily protected under national copyright legislation and international conventions");
  });

  test("footer, About, and both AI feeds name the Compact and the Codex", () => {
    for (const f of files) {
      const s = read(f);
      expect(s).toContain("The Vinculum Compact");
      expect(s).toContain("The Vinculum Codex");
    }
  });

  test("llms-full mirrors the commentary answer word for word", () => {
    expect(read("public/llms-full.txt")).toContain(legal.a[0].replace("${A}", "James Wesley Ndua"));
  });

  test("no registration numbers, certificate ids, or copyright years are introduced", () => {
    const bad = /registration\s+(no|number)|certificate\s+(no|number|id)|copyright\s*(©\s*)?\d{4}|©\s*\d{4}|KECOBO\s*\/|\bCR\s*\d{3,}/i;
    for (const s of [legal.a.join(" "), ...files.map(read)]) expect(bad.test(s)).toBe(false);
  });
});
