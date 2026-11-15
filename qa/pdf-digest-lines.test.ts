import { expect, test } from "bun:test";
import { digestLines } from "../src/components/desk/executiveBrief";

test("64-character digests form four bounded lines with no hidden characters or changed bytes", () => {
  const hash = "0123456789abcdef".repeat(4);
  expect(digestLines(hash)).toEqual(Array(4).fill("0123456789abcdef"));
  expect(digestLines(hash).join("")).toBe(hash);
  expect(digestLines(hash, 32)).toEqual([hash.slice(0, 32), hash.slice(32)]);
});