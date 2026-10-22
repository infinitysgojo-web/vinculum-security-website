/**
 * Posture Branching and the Bilateral Posture Diff (Rehearsal Drawer, Surface 2).
 *
 * A branch is a local what-if: it inherits the open mission's profile, warrant and desk
 * state, but keeps its own copy of the bus signals and bond vector in sessionStorage
 * (`vs:branches`), scoped to the open workspace and this tab. Switching posture re-hydrates
 * the MissionEngine with the stored signals exactly as opening a workspace does; the
 * workspace on disk keeps the baseline posture only. The diff is plain subtraction
 * between two stored postures, read from the bus values each one carries.
 */
import { escrowWaterfall, DEFAULT_ESCROW } from "@/components/desk/instruments";
import { applyInscriptions, round1, sanitizeSignals, type BondVector, type Signals } from "@/components/desk/engine";
import { sanitizeBonds, type MissionBonds } from "@/components/desk/mission";

export const BRANCH_STORAGE_KEY = "vs:branches";
export const BASELINE_ID = "baseline";
export const MAX_BRANCHES = 8;

export type PostureState = { signals: Signals; bonds?: MissionBonds };
export type PostureBranch = { id: string; name: string; createdAt: string; state: PostureState };
export type BranchStore = {
  workspaceId: string;
  /** The posture currently on the bus: "baseline" or a branch id. */
  active: string;
  /** The baseline posture, captured when the first branch is opened. */
  baseline?: PostureState;
  branches: PostureBranch[];
};

export const emptyBranchStore = (workspaceId: string): BranchStore => ({ workspaceId, active: BASELINE_ID, branches: [] });

const cloneState = (s: PostureState): PostureState => ({
  signals: sanitizeSignals(JSON.parse(JSON.stringify(s.signals ?? {}))),
  ...(s.bonds ? { bonds: sanitizeBonds(s.bonds) } : {}),
});

/** Read the branch store for a workspace; anything malformed or belonging to another workspace reads as empty. */
export function readBranches(workspaceId: string, store: Pick<Storage, "getItem"> | undefined = globalThis.sessionStorage): BranchStore {
  try {
    const raw = JSON.parse(store?.getItem(BRANCH_STORAGE_KEY) ?? "null") as Partial<BranchStore> | null;
    if (!raw || raw.workspaceId !== workspaceId || !Array.isArray(raw.branches)) return emptyBranchStore(workspaceId);
    const branches = raw.branches
      .filter((b): b is PostureBranch => !!b && typeof b.id === "string" && typeof b.name === "string" && !!b.state)
      .slice(0, MAX_BRANCHES)
      .map((b) => ({ id: b.id, name: b.name.slice(0, 80), createdAt: typeof b.createdAt === "string" ? b.createdAt : "", state: cloneState(b.state) }));
    const active = typeof raw.active === "string" && (raw.active === BASELINE_ID || branches.some((b) => b.id === raw.active)) ? raw.active : BASELINE_ID;
    return { workspaceId, active, branches, ...(raw.baseline ? { baseline: cloneState(raw.baseline) } : {}) };
  } catch {
    return emptyBranchStore(workspaceId);
  }
}

export function writeBranches(b: BranchStore, store: Pick<Storage, "setItem"> | undefined = globalThis.sessionStorage): boolean {
  try {
    store?.setItem(BRANCH_STORAGE_KEY, JSON.stringify(b));
    return !!store;
  } catch {
    return false;
  }
}

/** Store the live posture into whichever slot is active. */
export function stashActive(b: BranchStore, live: PostureState): BranchStore {
  const s = cloneState(live);
  if (b.active === BASELINE_ID) return { ...b, baseline: s };
  return { ...b, branches: b.branches.map((x) => (x.id === b.active ? { ...x, state: s } : x)) };
}

/**
 * Open a new branch from the live posture. The branch inherits the live posture and
 * becomes active; the slot it left keeps the posture as it was.
 */
export function createBranch(b: BranchStore, live: PostureState, name: string, id: string, at: Date = new Date()): BranchStore {
  if (b.branches.length >= MAX_BRANCHES) return b;
  const stashed = stashActive(b, live);
  const label = name.trim().slice(0, 80) || `Branch ${String.fromCharCode(65 + b.branches.length)}`;
  return { ...stashed, active: id, branches: [...stashed.branches, { id, name: label, createdAt: at.toISOString(), state: cloneState(live) }] };
}

/** Switch posture: stash the live posture, then return the target's stored state to hydrate the bus with. */
export function switchPosture(b: BranchStore, live: PostureState, target: string): { store: BranchStore; state: PostureState } | null {
  if (target === b.active) return null;
  const stashed = stashActive(b, live);
  const state = target === BASELINE_ID ? stashed.baseline : stashed.branches.find((x) => x.id === target)?.state;
  if (!state) return null;
  return { store: { ...stashed, active: target }, state: cloneState(state) };
}

/** Remove a branch. Removing the active branch is refused: switch away first. */
export function deleteBranch(b: BranchStore, id: string): BranchStore {
  if (id === b.active || id === BASELINE_ID) return b;
  return { ...b, branches: b.branches.filter((x) => x.id !== id) };
}

/** The stored posture for a slot, with the live posture standing in for the active one. */
export function postureOf(b: BranchStore, id: string, live: PostureState): PostureState | undefined {
  if (id === b.active) return live;
  return id === BASELINE_ID ? b.baseline : b.branches.find((x) => x.id === id)?.state;
}

/* ------------------------------------------------------------------ */
/* Bilateral Posture Diff                                              */
/* ------------------------------------------------------------------ */

const BOND_KEYS = ["interpersonal", "communal", "intergenerational", "institutional"] as const satisfies readonly (keyof BondVector)[];
export const BOND_LABELS: Record<keyof BondVector, string> = {
  interpersonal: "Interpersonal",
  communal: "Communal",
  intergenerational: "Intergenerational",
  institutional: "Institutional-Relational",
};

export type DiffRow = { key: string; label: string; baseline: number | null; active: number | null; delta: number | null; unit: string };

export type PostureDiff = {
  rupture: DiffRow;
  exposure: DiffRow;
  bonds: DiffRow[];
  survival: DiffRow;
  covenants: { introduced: string[]; withdrawn: string[]; shared: string[] };
  escrow: {
    releasedBaseline: number | null;
    releasedActive: number | null;
    /** Per cent of the pledge not released (frozen, withheld in reserve or on unmet tranches). */
    atRiskBaseline: number | null;
    atRiskActive: number | null;
    deltaAtRisk: number | null;
    frozenBaseline: boolean;
    frozenActive: boolean;
    /** Currency delta at risk, when a pledge value is supplied: pledge × ΔatRisk ÷ 100. */
    currencyDelta: number | null;
  };
};

const d1 = (a: number | null, b: number | null) => (a === null || b === null ? null : round1(b - a));
const row = (key: string, label: string, a: number | undefined, b: number | undefined, unit = ""): DiffRow => {
  const x = a ?? null;
  const y = b ?? null;
  return { key, label, baseline: x, active: y, delta: d1(x, y), unit };
};

/**
 * Unmitigated exposure U, in points, as carried on the bus by the Succession Simulator.
 * Older postures without it fall back to U = 2000 λ − R, the decay law solved for U.
 */
export function exposureOf(s: Signals): number | undefined {
  if (s.unmitigatedExposure !== undefined) return s.unmitigatedExposure;
  if (s.decayConstant === undefined) return undefined;
  return Math.max(0, round1(2000 * s.decayConstant - (s.rupture ?? 0)));
}

/** Capital not released, per cent of the pledge: the escrow published on the bus, or recomputed from the posture with default terms. */
function escrowOf(s: Signals): { released: number; frozen: boolean } | null {
  if (s.escrowReleasedPercent !== undefined) return { released: s.escrowReleasedPercent, frozen: s.escrowFrozen === true };
  if (!s.bonds) return null;
  const r = escrowWaterfall(DEFAULT_ESCROW, {
    verifierSeated: s.verifierSeated, communal: s.bonds.communal, institutional: s.bonds.institutional, intergenerational: s.bonds.intergenerational,
    trackGap: s.trackGap, trackTolerance: s.trackTolerance, survivalScore: s.survivalScore, rupture: s.rupture,
  });
  return { released: r.released, frozen: r.frozen };
}

/**
 * Delta of the active posture against the baseline: ΔR = R_active − R_baseline, ΔU, ΔB per bond,
 * covenants introduced or withdrawn, and the escrow capital at risk. Both postures are read
 * through applyInscriptions, the same effective state the desks read.
 */
export function postureDiff(baselineRaw: Signals, activeRaw: Signals, pledge?: number): PostureDiff {
  const a = applyInscriptions(baselineRaw);
  const b = applyInscriptions(activeRaw);
  const bonds = BOND_KEYS.map((k) => row(`bonds.${k}`, `B ${BOND_LABELS[k]}`, a.bonds?.[k], b.bonds?.[k]));
  const ca = new Set(a.covenants ?? []);
  const cb = new Set(b.covenants ?? []);
  const ea = escrowOf(a);
  const eb = escrowOf(b);
  const atRiskA = ea ? round1(100 - ea.released) : null;
  const atRiskB = eb ? round1(100 - eb.released) : null;
  const deltaAtRisk = d1(atRiskA, atRiskB);
  const p = pledge !== undefined && Number.isFinite(pledge) && pledge > 0 ? pledge : null;
  return {
    rupture: row("rupture", "Rupture index R", a.rupture, b.rupture, "%"),
    exposure: row("exposure", "Unmitigated exposure U", exposureOf(a), exposureOf(b), " pts"),
    bonds,
    survival: row("survivalScore", "Succession durability S", a.survivalScore, b.survivalScore, "%"),
    covenants: {
      introduced: [...cb].filter((c) => !ca.has(c)),
      withdrawn: [...ca].filter((c) => !cb.has(c)),
      shared: [...cb].filter((c) => ca.has(c)),
    },
    escrow: {
      releasedBaseline: ea?.released ?? null,
      releasedActive: eb?.released ?? null,
      atRiskBaseline: atRiskA,
      atRiskActive: atRiskB,
      deltaAtRisk,
      frozenBaseline: ea?.frozen ?? false,
      frozenActive: eb?.frozen ?? false,
      currencyDelta: p !== null && deltaAtRisk !== null ? Math.round(p * deltaAtRisk) / 100 : null,
    },
  };
}
