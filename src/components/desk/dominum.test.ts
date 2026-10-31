import { describe, expect, it } from "bun:test";
import { dominumIndex, telemetryLines, type Signals } from "./engine";
import { dominumProof } from "./formulaProofs";

const base: Signals = {
  bonds: { interpersonal: 4, communal: 4, intergenerational: 4, institutional: 4 },
  escrowReleasedPercent: 80,
  survivalScore: 70,
  rupture: 20,
};

describe("Dominum Index", () => {
  it("weights the four desk readings 0.30, 0.25, 0.25, 0.20", () => {
    // A = 0.75, F = 0.8, S = 0.7, C = 0.8 → 22.5 + 20 + 17.5 + 16 = 76
    const d = dominumIndex(base);
    expect("index" in d && d.index).toBe(76);
    expect("index" in d && d.phase).toBe("Self-Reinforcing Dominium");
  });
  it("is not assessed while any reading is missing", () => {
    const d = dominumIndex({ ...base, survivalScore: undefined });
    expect("missing" in d && d.missing).toEqual(["succession survival (Desk 12)"]);
  });
  it("counts a frozen escrow as nothing released", () => {
    const d = dominumIndex({ ...base, escrowFrozen: true });
    expect("index" in d && d.index).toBe(56);
  });
  it("withholds Self-Reinforcing Dominium while a bond is at the 3.0 floor", () => {
    const d = dominumIndex({ ...base, bonds: { interpersonal: 5, communal: 3, intergenerational: 5, institutional: 5 } });
    expect("index" in d && d.index).toBeGreaterThanOrEqual(75);
    expect("index" in d && d.phase).toBe("Custodial Inversion");
  });
  it("phase thresholds: 40 anchor, 60 inversion", () => {
    const low = dominumIndex({ ...base, bonds: { interpersonal: 1, communal: 1, intergenerational: 1, institutional: 1 }, escrowReleasedPercent: 0, survivalScore: 10, rupture: 90 });
    expect("index" in low && low.phase).toBe("Imperium-Bound");
  });
  it("proof and telemetry match the desk reading", () => {
    const d = dominumIndex(base);
    if (!("index" in d)) throw new Error("expected reading");
    expect(dominumProof(d).result).toBe("D = 76% · Self-Reinforcing Dominium");
    expect(telemetryLines(base).some((l) => l.includes("Dominum Index: D 76 per cent"))).toBe(true);
  });
});
