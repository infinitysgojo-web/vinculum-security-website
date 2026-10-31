import { expect, test } from "bun:test";
import { sentinelRuptureProof, trackShearProof } from "../src/components/desk/formulaProofs";
import { ruptureIndex } from "../src/components/desk/engine";

test("sentinel proof equals the desk's rupture index", () => {
  const r = ruptureIndex((30 / 60) * 100, 12, 1.15);
  expect(r).toBe(72);
  expect(sentinelRuptureProof(30, 60, 12, 1.15, r).result).toBe("R = 72%");
});

test("track shear fires only when lead exceeds tolerance", () => {
  expect(trackShearProof(3, 1, 1).result).toContain("shear");
  expect(trackShearProof(3, 1, 2).result).toContain("in step");
});
