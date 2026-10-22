// Surface 2: Posture Branching (isolated what-if sandboxes) and the Bilateral Posture Diff.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  BASELINE_ID,
  BRANCH_STORAGE_KEY,
  MAX_BRANCHES,
  createBranch,
  deleteBranch,
  emptyBranchStore,
  exposureOf,
  postureDiff,
  postureOf,
  readBranches,
  switchPosture,
  writeBranches,
  type PostureState,
} from "../src/components/mode/postureBranches";
import type { Signals } from "../src/components/desk/engine";

const bonds = { interpersonal: 3.8, communal: 1.2, intergenerational: 2.5, institutional: 4.1 };
const baseline: PostureState = { signals: { bonds, rupture: 48, unmitigatedExposure: 32.5, covenants: ["Office continuity (Independent Trustee)"], escrowReleasedPercent: 22.5, escrowFrozen: false }, bonds };
const store = () => {
  const m = new Map<string, string>();
  return { m, getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) };
};

describe("posture branching keeps session states isolated", () => {
  test("a branch inherits the live posture and becomes active; the baseline slot keeps the posture as it was", () => {
    const b = createBranch(emptyBranchStore("ws_1"), baseline, "Branch B: Total Sovereign Rupture", "br_1", new Date("2026-01-02T00:00:00.000Z"));
    expect(b.active).toBe("br_1");
    expect(b.baseline?.signals.rupture).toBe(48);
    expect(b.branches[0]).toMatchObject({ id: "br_1", name: "Branch B: Total Sovereign Rupture", createdAt: "2026-01-02T00:00:00.000Z" });
    expect(b.branches[0].state.signals.rupture).toBe(48);
  });

  test("mutating the live posture never reaches a stored slot (deep copies)", () => {
    const live: PostureState = JSON.parse(JSON.stringify(baseline));
    const b = createBranch(emptyBranchStore("ws_1"), live, "A", "br_1");
    live.signals.rupture = 99;
    live.signals.bonds!.communal = 5;
    expect(b.baseline?.signals.rupture).toBe(48);
    expect(b.branches[0].state.signals.bonds?.communal).toBe(1.2);
  });

  test("switching stashes the branch, returns the baseline exactly, and back again", () => {
    let b = createBranch(emptyBranchStore("ws_1"), baseline, "A", "br_1");
    const branchLive: PostureState = { ...baseline, signals: { ...baseline.signals, rupture: 72, escrowFrozen: true, escrowReleasedPercent: 0 } };
    const toBase = switchPosture(b, branchLive, BASELINE_ID)!;
    expect(toBase.state.signals.rupture).toBe(48);
    expect(toBase.store.active).toBe(BASELINE_ID);
    expect(toBase.store.branches[0].state.signals.rupture).toBe(72);
    b = toBase.store;
    const back = switchPosture(b, toBase.state, "br_1")!;
    expect(back.state.signals.rupture).toBe(72);
    expect(back.store.baseline?.signals.rupture).toBe(48);
    expect(switchPosture(back.store, back.state, "br_1")).toBeNull();
    expect(switchPosture(back.store, back.state, "missing")).toBeNull();
  });

  test("the active branch cannot be deleted; the limit is eight branches", () => {
    let b = createBranch(emptyBranchStore("ws_1"), baseline, "A", "br_1");
    expect(deleteBranch(b, "br_1")).toBe(b);
    expect(deleteBranch(b, BASELINE_ID)).toBe(b);
    for (let i = 2; i <= MAX_BRANCHES + 2; i++) b = createBranch(b, baseline, `B${i}`, `br_${i}`);
    expect(b.branches).toHaveLength(MAX_BRANCHES);
    const other = switchPosture(b, baseline, BASELINE_ID)!.store;
    expect(deleteBranch(other, "br_1").branches.map((x) => x.id)).not.toContain("br_1");
  });

  test("stored in sessionStorage under vs:branches, scoped to one workspace; malformed data reads empty", () => {
    const st = store();
    const b = createBranch(emptyBranchStore("ws_1"), baseline, "A", "br_1");
    expect(writeBranches(b, st)).toBe(true);
    expect([...st.m.keys()]).toEqual([BRANCH_STORAGE_KEY]);
    const back = readBranches("ws_1", st);
    expect(back.active).toBe("br_1");
    expect(back.branches[0].state.signals.rupture).toBe(48);
    expect(readBranches("ws_2", st)).toEqual(emptyBranchStore("ws_2"));
    st.m.set(BRANCH_STORAGE_KEY, "{oops");
    expect(readBranches("ws_1", st)).toEqual(emptyBranchStore("ws_1"));
    // Unknown signal keys are dropped on read: branches pass the same sanitiser as archives.
    st.m.set(BRANCH_STORAGE_KEY, JSON.stringify({ ...b, branches: [{ ...b.branches[0], state: { signals: { rupture: 5, evil: 1 } } }] }));
    expect(readBranches("ws_1", st).branches[0].state.signals).toEqual({ rupture: 5 });
  });

  test("postureOf reads the live posture for the active slot", () => {
    const b = createBranch(emptyBranchStore("ws_1"), baseline, "A", "br_1");
    const live = { signals: { rupture: 1 } };
    expect(postureOf(b, "br_1", live)).toBe(live);
    expect(postureOf(b, BASELINE_ID, live)?.signals.rupture).toBe(48);
  });

  test("the workspace on disk keeps the baseline posture while a branch is active", () => {
    const dash = readFileSync("src/pages/Dashboard.tsx", "utf8");
    expect(dash).toContain("signals: baselinePosture ? baselinePosture.signals : signals");
    expect(dash).toContain("signals: base ? base.signals : signals");
  });
});

describe("bilateral posture diff", () => {
  const active: Signals = {
    bonds: { interpersonal: 3.6, communal: 1.0, intergenerational: 2.5, institutional: 3.4 },
    rupture: 64,
    unmitigatedExposure: 50,
    covenants: ["Office continuity (Independent Trustee)", "Firebreak (Sunset Audit)"],
    escrowReleasedPercent: 0,
    escrowFrozen: true,
  };

  test("ΔR = R_active − R_baseline, ΔU, per-bond deltas, survival", () => {
    const d = postureDiff(baseline.signals, active);
    expect(d.rupture).toMatchObject({ baseline: 48, active: 64, delta: 16 });
    expect(d.exposure).toMatchObject({ baseline: 32.5, active: 50, delta: 17.5 });
    expect(d.bonds.map((r) => r.delta)).toEqual([-0.2, -0.2, 0, -0.7]);
    expect(d.survival.delta).toBeNull();
  });

  test("contested covenants: introduced and withdrawn", () => {
    const d = postureDiff(baseline.signals, active);
    expect(d.covenants.introduced).toEqual(["Firebreak (Sunset Audit)"]);
    expect(d.covenants.withdrawn).toEqual([]);
    expect(postureDiff(active, baseline.signals).covenants.withdrawn).toEqual(["Firebreak (Sunset Audit)"]);
  });

  test("escrow capital at risk in per cent of the pledge, and in currency when a pledge is given", () => {
    const d = postureDiff(baseline.signals, active, 200_000_000);
    expect(d.escrow).toMatchObject({ atRiskBaseline: 77.5, atRiskActive: 100, deltaAtRisk: 22.5, frozenActive: true, currencyDelta: 45_000_000 });
    expect(postureDiff(baseline.signals, active).escrow.currencyDelta).toBeNull();
  });

  test("inscribed shocks are applied before differencing, exactly as the desks read the bus", () => {
    const shocked: Signals = { ...baseline.signals, customShocks: [{ id: "s", name: "S", description: "", deltas: { interpersonal: 0, communal: -0.5, intergenerational: 0, institutional: 0 } }] };
    expect(postureDiff(baseline.signals, shocked).bonds[1]).toMatchObject({ baseline: 1.2, active: 1, delta: -0.2 });
  });

  test("U falls back to the decay law solved for U when an older posture lacks it", () => {
    expect(exposureOf({ decayConstant: 0.0403, rupture: 48 })).toBe(32.6);
    expect(exposureOf({})).toBeUndefined();
  });
});
