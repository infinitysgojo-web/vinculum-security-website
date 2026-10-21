import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import {
  EMPTY_STORE,
  createCustomWorkspace,
  createPresetWorkspace,
  carriedValues,
  derivativeChoices,
  deriveTraining,
  promoteToCustom,
  readStore,
  type DeskState,
  type Workspace,
  type WorkspaceStore,
} from "../src/components/mode/workspace";
import {
  LOCAL_DATA_NOTICE,
  PACKAGE_FORMAT,
  PACKAGE_NOTICE,
  applyImport,
  buildPackage,
  exportBlocker,
  planImport,
  quarantineExport,
  readPackage,
} from "../src/components/mode/transfer";
import { sha256 } from "../src/components/desk/integrity";
import { EMPTY_PROFILE } from "../src/components/desk/mission";
import { THEATRES } from "../src/components/desk/theatres";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const presetState = (): DeskState => {
  const t = THEATRES[0];
  return {
    profile: { ...EMPTY_PROFILE, theatre: t.name, parties: t.parties, bonds: { ...t.bonds }, classification: "Training exercise" },
    binder: [{ id: "b1", title: "Tab", text: "Training text" }],
    signals: { presetId: t.id, presetEpoch: 2, covenants: ["Elite personalisation"], bonds: { ...t.bonds } },
    division: "assess",
    desk: "diagnostics",
  };
};
const warrant = { title: "Corridor mission", objective: "Stabilise", theatre: "Corridor", custodian: "Desk officer", authority: "Mandate", handling: "Restricted", scope: "Corridor only" };
const preset = () => createPresetWorkspace({ id: "covenant-failing-bond", version: 1, title: "Covenants" }, presetState());
const custom = () => ({ ...createCustomWorkspace(warrant), tray: [{ id: "ce1", panel: "assumptions" as const, status: "assumption" as const, text: "Operational note", at: "2026-10-21T08:00:00.000Z" }] });
const storeOf = (...ws: Workspace[]): WorkspaceStore => ({ ...EMPTY_STORE, workspaces: ws, quarantine: [] });

/** A sealed custom mission whose record hashes correctly, as the dashboard's seal step writes it. */
async function sealedMission(): Promise<Workspace> {
  const canonical = JSON.stringify({ warrant, at: "2026-10-21" });
  return { ...custom(), lifecycle: "sealed", sealed: { ref: "NV/VINC-TEST", digest: await sha256(canonical), at: "2026-10-21T09:00:00.000Z", canonical } };
}

describe("save and restore through the local store", () => {
  test("a saved store round-trips through JSON with every workspace intact", () => {
    const s = storeOf(preset(), custom());
    const r = readStore(JSON.parse(JSON.stringify(s)));
    expect(r.error).toBeUndefined();
    expect(r.store.workspaces.map((w) => w.id)).toEqual(s.workspaces.map((w) => w.id));
    expect(r.store.workspaces[1].tray[0].text).toBe("Operational note");
  });
  test("missing local data opens an empty dashboard", () => {
    expect(readStore(null).store.workspaces).toEqual([]);
    expect(readStore(undefined).error).toBeUndefined();
  });
  test("an outdated record is migrated, unknown fields carried", () => {
    const old = { id: "ms-old", mode: "custom", state: {}, lifecycle: "training", legacyField: 3 };
    const r = readStore({ schema: 0, workspaces: [old] });
    expect(r.store.workspaces[0].lifecycle).toBe("draft");
    expect(r.store.workspaces[0].legacyField).toBe(3);
  });
});

describe("corruption quarantine", () => {
  test("an unreadable record is kept aside, valid ones still load", () => {
    const r = readStore({ schema: 1, workspaces: [preset(), { id: 7 }, "garbage"] });
    expect(r.store.workspaces).toHaveLength(1);
    expect(r.store.quarantine).toEqual([{ id: 7 }, "garbage"]);
    expect(r.error).toContain("kept aside unchanged");
  });
  test("a store that is not a list is kept whole, never erased", () => {
    const r = readStore("not a store");
    expect(r.store.quarantine).toEqual(["not a store"]);
  });
  test("the quarantine downloads exactly as kept", () => {
    const q = JSON.parse(quarantineExport({ ...EMPTY_STORE, workspaces: [], quarantine: [{ id: 7 }, "x"] }, "2026-10-21T00:00:00.000Z"));
    expect(q.records).toEqual([{ id: 7 }, "x"]);
  });
});

describe("export package", () => {
  test("carries format, versions, purpose, the honest notice and a SHA-256 of its canonical contents", async () => {
    const p = await buildPackage([preset(), custom()], "backup", "2026-10-21T10:00:00.000Z");
    expect(p.format).toBe(PACKAGE_FORMAT);
    expect(p.packageVersion).toBe(1);
    expect(p.workspaceSchema).toBe(1);
    expect(p.digest).toMatch(/^[0-9a-f]{64}$/);
    expect(p.notice).toBe(PACKAGE_NOTICE);
    expect(PACKAGE_NOTICE).toContain("Not encrypted and not access-controlled");
    expect(PACKAGE_NOTICE).toContain("not a signature");
    expect(LOCAL_DATA_NOTICE).toContain("Nothing is synced or backed up");
  });
  test("the same workspaces always produce the same digest", async () => {
    const ws = [preset()];
    expect((await buildPackage(ws, "transfer", "a")).digest).toBe((await buildPackage(ws, "transfer", "b")).digest);
  });
  test("purpose rules: derivatives only in a derivative package, custom only in a handover", () => {
    expect(exportBlocker([custom()], "training-derivative")).toContain("sanitized derivatives");
    expect(exportBlocker([preset()], "handover")).toContain("custom missions only");
    expect(exportBlocker([], "backup")).toContain("at least one");
    expect(exportBlocker([custom()], "handover")).toBeNull();
  });
});

describe("import validation", () => {
  test("a clean package round-trips with a matching digest", async () => {
    const p = await buildPackage([preset(), custom()], "backup");
    const r = await readPackage(JSON.stringify(p));
    expect(r.ok).toBe(true);
    expect(r.digest).toBe("match");
    expect(r.items).toHaveLength(2);
  });
  test("an edited package is detected and flagged", async () => {
    const p = await buildPackage([custom()], "handover");
    p.workspaces[0].title = "Edited after export";
    const r = await readPackage(JSON.stringify(p));
    expect(r.digest).toBe("mismatch");
    expect(r.warnings.join(" ")).toContain("changed after it was exported");
  });
  test("non-JSON, foreign files, newer package versions and unknown purposes are refused", async () => {
    expect((await readPackage("{oops")).ok).toBe(false);
    expect((await readPackage(JSON.stringify({ hello: 1 }))).ok).toBe(false);
    expect((await readPackage(JSON.stringify({ format: PACKAGE_FORMAT, packageVersion: 99, purpose: "backup", workspaces: [] }))).error).toContain("newer version");
    expect((await readPackage(JSON.stringify({ format: PACKAGE_FORMAT, packageVersion: 1, purpose: "cloud", workspaces: [] }))).ok).toBe(false);
  });
  test("an unreadable workspace inside a package goes to quarantine", async () => {
    const p = await buildPackage([preset()], "backup");
    const raw = { ...p, workspaces: [...p.workspaces, { broken: true }] };
    const r = await readPackage(JSON.stringify(raw));
    expect(r.items).toHaveLength(1);
    expect(r.quarantined).toEqual([{ broken: true }]);
  });
  test("a sealed snapshot whose record was altered is kept aside", async () => {
    const s = await sealedMission();
    const p = await buildPackage([s], "handover");
    const good = await readPackage(JSON.stringify(p));
    expect(good.items[0].seal).toBe("match");
    const bad = JSON.parse(JSON.stringify(p));
    bad.workspaces[0].sealed.canonical += " ";
    const r = await readPackage(JSON.stringify(bad));
    expect(r.items).toHaveLength(0);
    expect(r.quarantined).toHaveLength(1);
  });
  test("a newer workspace schema imports with unknown fields preserved", async () => {
    const p = await buildPackage([{ ...preset(), futureField: "keep" }], "transfer");
    const r = await readPackage(JSON.stringify({ ...p, workspaceSchema: 2 }));
    expect(r.newer).toBe(true);
    expect(r.items[0].workspace.futureField).toBe("keep");
  });
  test("hidden characters are reported but imported text is not rewritten", async () => {
    const w = { ...custom(), title: "Mission\u200b title" };
    const r = await readPackage(JSON.stringify(await buildPackage([w], "handover")));
    expect(r.items[0].hiddenCharacters).toBe(1);
    expect(r.items[0].workspace.title).toBe("Mission\u200b title");
  });
});

describe("duplicate handling and the import decision", () => {
  test("new, identical, conflicting and same-content items are told apart", () => {
    const a = custom();
    const b = { ...a, title: "Changed" };
    const c = { ...a, id: "ms-other" };
    const fresh = preset();
    const plan = planImport([a, b, c, fresh].map((workspace) => ({ workspace, seal: "none" as const, hiddenCharacters: 0 })), [a]);
    expect(plan.map((p) => p.duplicate)).toEqual(["identical", "conflict", "same-content", "new"]);
    expect(plan[1].options).toEqual(["keep-both", "replace", "skip"]);
    expect(plan[3].options[0]).toBe("restore");
  });
  test("restore adds, replace overwrites, keep both copies with import lineage, skip does nothing", () => {
    const local = custom();
    const changed = { ...local, title: "Changed" };
    const fresh = preset();
    const items = [changed, fresh].map((workspace) => ({ workspace, seal: "none" as const, hiddenCharacters: 0 }));
    const plan = planImport(items, [local]);
    const replaced = applyImport(storeOf(local), plan, ["replace", "restore"], []);
    expect(replaced.store.workspaces.find((w) => w.id === local.id)?.title).toBe("Changed");
    expect(replaced.added).toBe(1);
    const both = applyImport(storeOf(local), plan, ["keep-both", "skip"], []);
    expect(both.store.workspaces).toHaveLength(2);
    const copy = both.store.workspaces[1];
    expect(copy.id).not.toBe(local.id);
    expect(copy.lineage).toMatchObject({ kind: "import", parentId: local.id });
    expect(both.store.workspaces[0]).toBe(local);
  });
  test("a sealed local snapshot is never replaced", async () => {
    const s = await sealedMission();
    const incoming = { ...s, title: "Tampered", lifecycle: "draft" as const };
    const plan = planImport([{ workspace: incoming, seal: "none", hiddenCharacters: 0 }], [s]);
    expect(plan[0].options).not.toContain("replace");
    const r = applyImport(storeOf(s), plan, ["replace"], []);
    expect(r.store.workspaces[0]).toBe(s);
    expect(r.skipped).toBe(1);
  });
  test("quarantined import records join the local quarantine; nothing local is deleted", () => {
    const local = storeOf(preset());
    const r = applyImport({ ...local, quarantine: ["old"] }, [], [], [{ broken: 1 }]);
    expect(r.store.quarantine).toEqual(["old", { broken: 1 }]);
    expect(r.store.workspaces).toHaveLength(1);
  });
});

describe("preset promotion", () => {
  test("creates a separate custom copy with lineage and leaves the training run untouched", () => {
    const run = preset();
    const before = JSON.stringify(run);
    const next = promoteToCustom(run, warrant, carriedValues(run));
    expect(next.id).not.toBe(run.id);
    expect(next.mode).toBe("custom");
    expect(next.lineage?.kind).toBe("promotion");
    expect(next.state.signals.presetId).toBeUndefined();
    expect(JSON.stringify(run)).toBe(before);
  });
});

describe("sanitized training derivative", () => {
  test("all named fields are omitted by default and nothing free-text is carried", () => {
    const src = custom();
    const choices = derivativeChoices(src);
    expect(choices.every((c) => c.omit)).toBe(true);
    const d = deriveTraining(src, choices);
    expect(d.derived).toBe(true);
    expect(d.mode).toBe("preset");
    expect(d.tray).toEqual([]);
    expect(d.decisions).toEqual([]);
    expect(JSON.stringify(d)).not.toContain("Operational note");
    expect(JSON.stringify(d)).not.toContain("Corridor mission");
  });
  test("only explicitly chosen replacement labels are carried", () => {
    const src = custom();
    const choices = derivativeChoices(src).map((c) => (c.key === "title" ? { ...c, omit: false, replacement: "Exercise Alpha" } : c));
    const d = deriveTraining(src, choices);
    expect(d.title).toBe("Exercise Alpha");
    expect(JSON.stringify(d)).not.toContain("Desk officer");
  });
  test("the dialog requires an explicit confirmation before creating it", () => {
    const src = read("src/components/mode/ModeDialogs.tsx");
    expect(src).toContain("disabled={incomplete || !confirmed}");
    expect(src).toContain("Nothing is classified as training-safe automatically.");
  });
  test("only derivatives travel in a training-derivative package", async () => {
    const d = deriveTraining(custom(), derivativeChoices(custom()));
    const p = await buildPackage([d], "training-derivative");
    const smuggled = { ...p, workspaces: [...p.workspaces, custom()] };
    const r = await readPackage(JSON.stringify(smuggled));
    expect(r.items).toHaveLength(1);
    expect(r.quarantined).toHaveLength(1);
  });
});

describe("guardrails", () => {
  const files = ["src/components/mode/transfer.ts", "src/components/mode/LocalDataDialog.tsx"].map(read).join("\n");
  test("no network, remote backend or second store in the new layer", () => {
    expect(files).not.toMatch(/fetch\(|XMLHttpRequest|supabase|WebSocket|sendBeacon/);
    expect(files).not.toMatch(/usePublish|createContext/);
  });
  test("no claims of encryption, sync, certification or proof", () => {
    const claims = files.replace(/Not encrypted|not access-controlled|not a signature, certification or proof|Nothing is synced or backed up|It is not encryption, access control, a signature,\s*\n?\s*\* third-party certification or legal proof/g, "");
    expect(claims).not.toMatch(/\bencrypted\b|cloud backup|blockchain|certified|legally binding/i);
  });
  test("no new routes", () => {
    expect(read("src/App.tsx").match(/<Route /g)?.length).toBe(15);
  });
});
