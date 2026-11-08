import { expect, test } from "bun:test";
import { changedKeys } from "../src/components/desk/busMonitor";
import { guardSignalPatch } from "../src/components/desk/signalGuard";
import { dominumIndex, relationalDynamics, ruptureIndex } from "../src/components/desk/engine";
import { newSeat, questionCheckpoint, seatScriptLines } from "../src/components/desk/questioning";
import { createClipboardEviction } from "../src/lib/clipboardGuard";
import { idleDeadlineExpired } from "../src/lib/sentinelDeadline";
import { createWriteRevision } from "../src/lib/writeRevision";
import { mergeStores } from "../src/components/mode/workspaceStore";
import { EMPTY_STORE, quarantineEntry } from "../src/components/mode/workspace";
import { transactionalRead } from "../src/components/mode/localPersistence";
import { governingLaws } from "../src/components/desk/TelemetryStrip";

test("equivalent bond keys are not publications but array order and clears are", () => {
  const bonds = { interpersonal: 3, communal: 4, intergenerational: 2, institutional: 5 };
  expect(changedKeys({ bonds }, { bonds: { institutional: 5, intergenerational: 2, communal: 4, interpersonal: 3 } })).toEqual([]);
  expect(changedKeys({ shocks: ["a", "b"] }, { shocks: ["b", "a"] })).toEqual(["shocks"]);
  expect(changedKeys({ counterpart: "a" }, { counterpart: undefined })).toEqual(["counterpart"]);
  expect(guardSignalPatch("counterpart", { counterfeit: undefined, counterpart: undefined })).toEqual({ counterpart: undefined });
});

test("idle deadline cannot be renewed after 15 minutes of suspended callbacks", () => {
  expect(idleDeadlineExpired(1000, 900_000, 900_999)).toBe(false);
  expect(idleDeadlineExpired(1000, 900_000, 901_000)).toBe(true);
});

test("clipboard return checks 60 seconds even when its timer never executes", () => {
  let now = 0, attempts = 0, id = 0;
  const ev = createClipboardEviction({ now: () => now, ms: 60_000,
    wrote: () => true, clear: async () => { attempts++; return true; },
    setTimer: () => ++id, clearTimer: () => {} });
  ev.onBlur(); now = 59_000; ev.onFocus(); expect(attempts).toBe(0);
  ev.onBlur(); now = 70_000; ev.onBlur(); // duplicate hidden/blur does not extend the deadline
  now = 120_000; ev.onFocus(); expect(attempts).toBe(1);
});

test("only the latest durable write clears unsaved state", () => {
  const w = createWriteRevision();
  const first = w.begin(), second = w.begin();
  expect(w.complete(first)).toBe(false); expect(w.dirty()).toBe(true);
  expect(w.complete(second)).toBe(true); expect(w.dirty()).toBe(false);
  const cancelled = w.begin(); w.reset(); expect(w.complete(cancelled)).toBe(false);
});

test("quarantine merge is idempotent and never truncates distinct raw records", () => {
  const raw = "x".repeat(210_000);
  const a = quarantineEntry(raw, "Unreadable", "store", "2026-01-01");
  const b = quarantineEntry(raw + "different", "Unreadable", "store", "2026-01-01");
  const s = { ...EMPTY_STORE, quarantine: [a] };
  expect(mergeStores(s, s).quarantine).toEqual([a]);
  expect(mergeStores(s, { ...EMPTY_STORE, quarantine: [b] }).quarantine).toEqual([a, b]);
  const recovered = transactionalRead({ getItem: (k) => k === "test" ? raw : null, setItem: () => {}, removeItem: () => {} }, "test");
  expect(recovered.store.quarantine[0]).toMatchObject({ record: raw });
});

test("Codex Part IV §4.3.2 deficit amplification preserves exact executing arithmetic", () => {
  const bonds = { interpersonal: 1, communal: 1, intergenerational: 1, institutional: 5 };
  expect(relationalDynamics({ bonds })?.contagion).toBe(32.9);
  expect(relationalDynamics({ bonds: { ...bonds, institutional: 1 } })).toMatchObject({ contagion: 0, deficitPct: 100, character: "Systemic" });
  expect(relationalDynamics({ bonds, rupture: 100, shocks: ["a", "b", "c", "d"] })?.contagion).toBe(100);
});

test("Dominum anchor and rupture remain bounded at direct-call extremes", () => {
  const d = dominumIndex({ bonds: { interpersonal: 0, communal: 0, intergenerational: 0, institutional: 0 }, rupture: 0, survivalScore: 0, escrowReleasedPercent: 0 });
  if ("missing" in d) throw new Error("Expected a complete reading");
  expect(d.terms[0].input).toBe(0); expect(d.index).toBe(20);
  expect(ruptureIndex(-5, 0, 1)).toBe(0); expect(ruptureIndex(150, 0, 1)).toBe(100);
});

test("every counterpart exports its own full script with a bounded operator checkpoint", () => {
  const defaults = [["Opening?"], ["Probing?"], ["Commitment?"], ["Close?"]];
  const phases = ["Opening", "Probing", "Commitment", "Close"];
  const a = { ...newSeat("a"), customOn: true, cQ: ["Office A?\nRecord A?", "", "", ""] as [string, string, string, string], questionIndex: 10 };
  const b = { ...newSeat("b"), customOn: true, cQ: ["Office B?", "", "", ""] as [string, string, string, string] };
  const text = [seatScriptLines(a, "A", "Caution A", "Pivot A", defaults, phases), seatScriptLines(b, "B", "Caution B", "Pivot B", defaults, phases)].flat().join("\n");
  expect(text).toContain('1. "Office A?"'); expect(text).toContain('2. "Record A?"'); expect(text).toContain('1. "Office B?"');
  expect(text).toContain("Opening · question 2 of 2"); expect(questionCheckpoint(10, 1)).toBe(0);
});

test("zero fracture months is imminent, never absence; contagion is not clearance", () => {
  const laws = governingLaws({ bonds: { interpersonal: 1, communal: 1, intergenerational: 1, institutional: 1 }, fractureMonths: 0, fractureSeverity: "imminent" }).flatMap((p) => p.laws);
  expect(laws.find((l) => l.name === "Critical Fracture Window")?.reading).toBe("0 months · imminent");
  expect(laws.find((l) => l.name === "Relational Contagion")?.status).toBe("reading");
});