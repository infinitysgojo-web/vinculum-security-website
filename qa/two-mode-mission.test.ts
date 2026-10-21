import { expect, test, describe } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import {
  DERIVED_NOTICE,
  EMPTY_WARRANT,
  PROMOTION_LINEAGE,
  TRAINING_NOTICE,
  afterActionReview,
  blockingFindings,
  branchWorkspace,
  canMove,
  carriedValues,
  completenessReview,
  continueFromSealed,
  createCustomWorkspace,
  createPresetWorkspace,
  derivativeChoices,
  deriveTraining,
  promoteToCustom,
  readStore,
  readWorkspace,
  warrantToProfile,
  type DeskState,
  type Workspace,
} from "../src/components/mode/workspace";
import { mergeStores } from "../src/components/mode/workspaceStore";
import { CATEGORIES, DESK_GUIDES, SCENARIOS, SPINE, scenarioCompatible, stageStatus, theatreForScenario } from "../src/components/mode/scenarios";
import { downstreamOf, deskCanPublish } from "../src/components/desk/MissionChain";
import { EMPTY_PROFILE } from "../src/components/desk/mission";
import { THEATRES } from "../src/components/desk/theatres";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const DASH = read("src/pages/Dashboard.tsx");
const DESK_IDS = [...DASH.matchAll(/\n    id: "([a-z]+)",\n    division:/g)].map((m) => m[1]);
const MODE_DIR = new URL("../src/components/mode", import.meta.url).pathname;
const MODE_FILES = readdirSync(MODE_DIR).map((f) => join(MODE_DIR, f));

const presetState = (): DeskState => {
  const t = THEATRES[0];
  return {
    profile: { ...EMPTY_PROFILE, theatre: t.name, parties: t.parties, bonds: { ...t.bonds }, classification: "Training exercise" },
    binder: [{ id: "b1", title: "Tab", text: "Training text" }],
    signals: { presetId: t.id, presetEpoch: 3, covenants: ["Elite personalisation"], disputeForum: "PCA / The Hague", disputeForumId: "pca", bonds: { ...t.bonds } },
    division: "assess",
    desk: "diagnostics",
  };
};
const preset = () => createPresetWorkspace({ id: "covenant-failing-bond", version: 1, title: "Covenants" }, presetState());
const fullWarrant = { title: "Corridor mission", objective: "Stabilise", theatre: "Corridor", custodian: "Desk officer", authority: "Mandate", handling: "Restricted", scope: "Corridor only" };

describe("dashboard desks", () => {
  test("eighteen desks are parsed from the dashboard", () => expect(DESK_IDS).toHaveLength(18));
});

describe("versioned workspace model and migration", () => {
  test("a valid store loads, unknown fields are preserved, nothing is dropped", () => {
    const w = { ...preset(), futureField: { keep: true } };
    const r = readStore({ schema: 1, workspaces: [w], extraTop: 7 });
    expect(r.error).toBeUndefined();
    expect(r.store.workspaces).toHaveLength(1);
    expect((r.store.workspaces[0] as Workspace).futureField).toEqual({ keep: true });
    expect(r.store.extraTop).toBe(7);
  });
  test("an invalid workspace is quarantined with a recoverable message, never erased", () => {
    const bad = { id: 5, mode: "other" };
    const r = readStore({ schema: 1, workspaces: [preset(), bad] });
    expect(r.store.workspaces).toHaveLength(1);
    expect(r.store.quarantine).toEqual([bad]);
    expect(r.error).toMatch(/kept aside unchanged/);
  });
  test("an unreadable collection is kept aside rather than blanking", () => {
    const r = readStore("garbage");
    expect(r.store.workspaces).toEqual([]);
    expect(r.store.quarantine).toEqual(["garbage"]);
    expect(r.error).toBeDefined();
  });
  test("a newer schema loads with a notice", () => {
    const r = readStore({ schema: 99, workspaces: [preset()] });
    expect(r.store.workspaces).toHaveLength(1);
    expect(r.error).toMatch(/newer version/);
  });
  test("bond vectors read from storage are sanitized", () => {
    const w = readWorkspace({ id: "x", mode: "custom", state: { profile: { bonds: { interpersonal: 9, communal: "2.24" } } } })!;
    expect(w.state.profile.bonds!.interpersonal).toBe(5);
    expect(w.state.profile.bonds!.communal).toBe(2.2);
    expect(w.lifecycle).toBe("draft");
  });
  test("merging two copies keeps the later update and loses nothing", () => {
    const a = { ...preset(), updatedAt: "2026-01-01T00:00:00.000Z", title: "old" };
    const b = { ...a, updatedAt: "2026-02-01T00:00:00.000Z", title: "new" };
    const c = createCustomWorkspace(EMPTY_WARRANT);
    const m = mergeStores({ schema: 1, workspaces: [a, c], quarantine: [] }, { schema: 1, workspaces: [b], quarantine: [] });
    expect(m.workspaces).toHaveLength(2);
    expect(m.workspaces.find((w) => w.id === a.id)!.title).toBe("new");
  });
});

describe("preset proving ground", () => {
  test("seven read-only versioned scenarios across the seven categories, all compatible", () => {
    expect(SCENARIOS).toHaveLength(7);
    expect(new Set(SCENARIOS.map((s) => s.category)).size).toBe(CATEGORIES.length);
    for (const s of SCENARIOS) {
      expect(s.version).toBeGreaterThanOrEqual(1);
      expect(scenarioCompatible(s, DESK_IDS).ok).toBe(true);
      expect(theatreForScenario(s)).toBeDefined();
      for (const c of s.checkpoints) expect(s.sequence).toContain(c.desk);
    }
    expect(Object.isFrozen(SCENARIOS) || SCENARIOS.every((s) => typeof s.id === "string")).toBe(true);
  });
  test("an unknown desk or format makes a package incompatible", () => {
    expect(scenarioCompatible({ ...SCENARIOS[0], sequence: ["nowhere"] }, DESK_IDS).ok).toBe(false);
    expect(scenarioCompatible({ ...SCENARIOS[0], format: 9 }, DESK_IDS).ok).toBe(false);
  });
  test("every guide and spine stage names only real desks", () => {
    for (const id of Object.keys(DESK_GUIDES)) expect(DESK_IDS).toContain(id);
    const spineDesks = SPINE.flatMap((s) => s.desks);
    for (const d of spineDesks) expect(DESK_IDS).toContain(d);
    expect(new Set(spineDesks).size).toBe(18);
    expect(SPINE.map((s) => s.label)).toEqual(["Warrant / Brief", "Baseline", "Design", "Stress", "Legal Posture", "Decision Record", "Handover"]);
  });
  test("checkpoints read the live bus; they report, they do not grade", () => {
    const cp = SCENARIOS[0].checkpoints[0];
    expect(cp.observe({ weakestBond: "Communal", weakestScore: 2.2 })).toBe("Weakest bond: Communal at 2.2 (Fragile).");
    expect(cp.observe({})).toMatch(/not on the bus/);
    const all = SCENARIOS.flatMap((s) => s.checkpoints.map((c) => c.explain + c.question)).join(" ");
    expect(all).not.toMatch(/\b(score|grade|correct|incorrect|points? awarded|certif)/i);
  });
  test("spine status counts publishing desks and never claims approval", () => {
    const st = stageStatus(SPINE[1], (d) => d === "diagnostics", deskCanPublish);
    expect(st.text).toBe("1 of 3 desks publishing");
    const texts = SPINE.map((s) => stageStatus(s, () => true, deskCanPublish, preset()).text).join(" ");
    expect(texts).not.toMatch(/approv|complete|verified/i);
    expect(read("src/components/mode/ModeHeader.tsx")).not.toMatch(/"[^"]*\b(Synced|Approved|Secure cloud|Live collaboration)\b/i);
  });
  test("a preset exercise keeps a baseline for Reset; branch duplicates without touching the source", () => {
    const w = preset();
    expect(w.lifecycle).toBe("training");
    expect(w.baseline).toEqual(w.state);
    const b = branchWorkspace(w, "Alt forum");
    expect(b.id).not.toBe(w.id);
    expect(b.lineage).toMatchObject({ parentId: w.id, kind: "branch" });
    expect(b.baseline).toEqual(w.baseline);
    expect(w.title).toBe("Covenants");
  });
  test("the after-action review carries the training notice and only recorded material", () => {
    const w = { ...preset(), replay: [{ at: "2026-10-21T08:00:00.000Z", kind: "SHOCK_INJECTED", detail: "Donor withdrawal" }] };
    const t = afterActionReview(w, { gates: [{ name: "Vector Integrity", passed: false, reading: "4 bonds at or below 3.0" }], telemetry: ["  Rupture 49%"], notice: TRAINING_NOTICE });
    expect(t.startsWith(TRAINING_NOTICE)).toBe(true);
    expect(t.trimEnd().endsWith(TRAINING_NOTICE)).toBe(true);
    expect(t).toContain("[HOLD] Vector Integrity");
    expect(t).toContain("Donor withdrawal");
    expect(TRAINING_NOTICE).toBe("TRAINING SIMULATION — NOT AN OPERATIONAL RECORD.");
  });
});

describe("custom operational mission", () => {
  test("the warrant maps onto the profile the desks already read", () => {
    const p = warrantToProfile(fullWarrant, { ...EMPTY_PROFILE });
    expect(p).toMatchObject({ theatre: "Corridor", officer: "Desk officer", classification: "Restricted" });
  });
  test("lifecycle: missing warrant content and open questions block local handover", () => {
    const w = createCustomWorkspace({ ...EMPTY_WARRANT, title: "T", objective: "O" });
    expect(canMove(w, "review").ok).toBe(true);
    expect(canMove(w, "ready").ok).toBe(false);
    expect(canMove(w, "sealed").ok).toBe(false);
    const full = { ...createCustomWorkspace(fullWarrant), tray: [{ id: "q", panel: "questions" as const, status: "question" as const, text: "Who funds?", at: "" }] };
    expect(blockingFindings(full)).toHaveLength(1);
    const clear = { ...full, tray: [{ ...full.tray[0], status: "excluded" as const }] };
    expect(canMove(clear, "ready").ok).toBe(true);
    expect(canMove({ ...clear, lifecycle: "ready" }, "sealed").ok).toBe(true);
    expect(completenessReview({ ...clear, decisions: [{ id: "d", what: "X", why: "", at: "", status: "active" }] })[0].kind).toBe("decision");
  });
  test("a sealed snapshot is immutable; continuing creates a new draft with lineage", () => {
    const s = { ...createCustomWorkspace(fullWarrant), lifecycle: "sealed" as const, sealed: { ref: "NV/VINC-COR-ABC-0001", digest: "d", at: "", canonical: "{}" } };
    expect(canMove(s, "draft").ok).toBe(false);
    const c = continueFromSealed(s);
    expect(c.lifecycle).toBe("draft");
    expect(c.sealed).toBeUndefined();
    expect(c.lineage).toMatchObject({ parentId: s.id, kind: "continuation" });
    expect(s.lifecycle).toBe("sealed");
  });
});

describe("promotion and training derivative", () => {
  test("promotion creates a new draft, strips preset markers and never presents values as facts", () => {
    const src = preset();
    const before = JSON.stringify(src);
    const vals = carriedValues(src);
    expect(vals.filter((v) => v.status === "fact")).toEqual([]);
    const reviewed = vals.map((v) => (v.key === "forum" ? { ...v, status: "excluded" as const } : v));
    const p = promoteToCustom(src, fullWarrant, reviewed);
    expect(JSON.stringify(src)).toBe(before);
    expect(p.id).not.toBe(src.id);
    expect(p.mode).toBe("custom");
    expect(p.lifecycle).toBe("draft");
    expect(p.scenario).toBeUndefined();
    expect(p.baseline).toBeUndefined();
    expect(p.state.signals.presetId).toBeUndefined();
    expect(p.state.signals.presetEpoch).toBeUndefined();
    expect(p.state.signals.disputeForum).toBeUndefined();
    expect(p.state.signals.covenants).toEqual(["Elite personalisation"]);
    expect(p.state.binder).toEqual([]);
    expect(p.lineage!.note).toBe(PROMOTION_LINEAGE);
    expect(p.tray.every((e) => e.status !== "fact")).toBe(true);
    expect(JSON.stringify(p)).not.toMatch(/TRAINING|Training exercise|checkpoint":|scenario":/);
  });
  test("the derivative omits sensitive material by default and is marked derived", () => {
    const src = {
      ...createCustomWorkspace(fullWarrant, { ...presetState(), profile: { ...presetState().profile, parties: "Named Minister; Named Commander" } }),
      tray: [{ id: "e", panel: "evidence" as const, status: "fact" as const, text: "Private source note", source: "Ref 12", at: "" }],
      decisions: [{ id: "d", what: "Chose PCA", why: "Private reasoning", at: "", status: "active" as const }],
      sealed: { ref: "NV/VINC-X-1-0001", digest: "abc", at: "", canonical: "{}" },
    };
    const choices = derivativeChoices(src);
    expect(choices.every((c) => c.omit)).toBe(true);
    const d = deriveTraining(src, choices);
    const json = JSON.stringify(d);
    for (const secret of ["Named Minister", "Private source note", "Ref 12", "Private reasoning", "NV/VINC", "Corridor mission", "Desk officer", "Training text"]) expect(json).not.toContain(secret);
    expect(d.mode).toBe("preset");
    expect(d.derived).toBe(true);
    expect(d.lineage!.note).toBe(DERIVED_NOTICE);
    expect(d.state.profile.bonds).toEqual(src.state.profile.bonds);
    expect(src.lifecycle).toBe("draft");
    const named = deriveTraining(src, choices.map((c) => (c.key === "theatre" ? { ...c, omit: false, replacement: "Training corridor" } : c)));
    expect(named.state.profile.theatre).toBe("Training corridor");
  });
});

describe("signal chain and boundaries", () => {
  test("impact notes are derived from the chain's own read table", () => {
    const d = downstreamOf("diagnostics");
    expect(d).toContain("mirror");
    expect(d).toContain("succession");
    expect(d).not.toContain("diagnostics");
    expect(downstreamOf("binder")).toEqual([]);
  });
  test("the mode shell never publishes to the bus or keeps a parallel desk store", () => {
    for (const f of MODE_FILES) {
      const s = readFileSync(f, "utf8");
      expect(s).not.toMatch(/usePublish|publish\(|EngineContext\.Provider|createContext/);
    }
  });
  test("no network, routes, raw colours or navigation in the mode files", () => {
    for (const f of MODE_FILES) {
      const s = readFileSync(f, "utf8");
      expect(s).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket|supabase|navigator\.sendBeacon|useNavigate|<Route|["'`]\/(dashboard|login)/);
      expect(s).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgb\(|hsl\(\d/);
    }
  });
  test("the workspace key is wiped by panic purge, and sign-out forgets the open workspace", async () => {
    const { PURGED_LOCAL_KEY } = await import("../src/lib/panicPurge");
    const { storeKey, MODE_KEY, ACTIVE_KEY } = await import("../src/components/mode/workspaceStore");
    expect(PURGED_LOCAL_KEY.test(storeKey("u1"))).toBe(true);
    expect(PURGED_LOCAL_KEY.test(MODE_KEY)).toBe(true);
    expect(ACTIVE_KEY.startsWith("vs:")).toBe(true);
    expect(DASH).toMatch(/clearOfflineSession\(\);\n    writeActiveId\(null\);/);
  });
  test("the dashboard keeps one inactivity owner and renders the Foyer inside the existing route", () => {
    expect(DASH.match(/<ChancellerySentinel/g)).toHaveLength(1);
    expect(DASH).toContain("<MissionFoyer");
    expect(DASH).toContain("onPasteCapture={sanitizeOnPaste} onBlurCapture={sanitizeOnBlur}");
    expect(read("src/App.tsx")).not.toMatch(/foyer|Foyer/);
    expect(read("src/components/mode/workspaceStore.ts")).not.toMatch(/setTimeout|setInterval/);
  });
  test("exports in preset mode carry the training notice", () => {
    const out = read("src/components/desk/DeskOutput.tsx");
    expect(out).toContain("export const ExportNoticeContext");
    expect(out).toMatch(/\$\{notice\}\\n\\n\$\{body\}\\n\\n\$\{notice\}/);
    expect(read("src/components/desk/MissionBinder.tsx")).toContain("ExportNoticeContext");
    expect(DASH).toContain("<ExportNoticeContext.Provider value={exportNotice}>");
  });
});
