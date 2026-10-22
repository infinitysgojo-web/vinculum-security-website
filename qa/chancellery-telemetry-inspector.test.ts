// Surface 1: the Live Bus Signal Inspector and the Chronological Mission Decision Log.
import { beforeEach, describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { busMonitorState, changedKeys, recordPublication, resetBusMonitor, telemetrySnapshot, INSPECTOR_FIELD_KEYS } from "../src/components/desk/busMonitor";
import { clearLedger, decisionLogText, decisionRecords, ledgerEntries, logDecision, logEvent, restoreLedger } from "../src/components/desk/ledgerStore";
import { guardSignalPatch } from "../src/components/desk/signalGuard";
import type { Signals } from "../src/components/desk/engine";

const deepFreeze = <T,>(o: T): T => {
  if (o && typeof o === "object") {
    Object.values(o as object).forEach(deepFreeze);
    Object.freeze(o);
  }
  return o;
};

const bus: Signals = {
  bonds: { interpersonal: 3.8, communal: 1.2, intergenerational: 2.5, institutional: 4.1 },
  rupture: 48,
  legitimacyDeficit: true,
  customShocks: [
    { id: "s1", name: "Drought displacement", description: "", deltas: { interpersonal: 0, communal: -0.6, intergenerational: -0.3, institutional: 0 } },
    { id: "s2", name: "Corridor closure", description: "", deltas: { interpersonal: -0.2, communal: -0.4, intergenerational: 0, institutional: 0.1 } },
  ],
  customCovenants: [{ id: "c1", title: "Office continuity", obligation: "Binds the office.", enforcementMechanism: "Independent Trustee", mandatedArticleRef: "7" }],
};

describe("Live Bus Signal Inspector", () => {
  beforeEach(() => resetBusMonitor());

  test("reflects the bus exactly: rupture, summed bond delta, legitimacy penalty, open questions, shocks and covenants", () => {
    const t = telemetrySnapshot(bus, { openQuestions: 3 });
    expect(t.rupture).toBe(48);
    expect(t.bondDelta).toEqual({ interpersonal: -0.2, communal: -1, intergenerational: -0.3, institutional: 0.1 });
    expect(t.bondDeltaMean).toBe(-0.3); // −1.4 ÷ 4 = −0.35, rounded half up by round1
    expect(t.legitimacyPenalty).toBe(15);
    expect(t.openQuestionsCount).toBe(3);
    expect(t.customShocks.map((x) => [x.id, x.title])).toEqual([["s1", "Drought displacement"], ["s2", "Corridor closure"]]);
    expect(t.customCovenants[0]).toEqual({ id: "c1", article: "7", text: "Office continuity: Binds the office.", category: "Independent Trustee" });
  });

  test("parses without mutation: a frozen bus is read, and the snapshot shares no object with it", () => {
    const frozen = deepFreeze(JSON.parse(JSON.stringify(bus)) as Signals);
    const before = JSON.stringify(frozen);
    const t = telemetrySnapshot(frozen);
    expect(JSON.stringify(frozen)).toBe(before);
    expect(t.customShocks[0].deltas).not.toBe(frozen.customShocks![0].deltas);
    t.customShocks[0].deltas.communal = 99;
    expect(frozen.customShocks![0].deltas.communal).toBe(-0.6);
  });

  test("empty bus: rupture null, zero deltas, no penalty; bond delta is clamped to ±5.0", () => {
    const t = telemetrySnapshot({});
    expect(t.rupture).toBeNull();
    expect(t.bondDeltaMean).toBe(0);
    expect(t.legitimacyPenalty).toBe(0);
    const big = Array.from({ length: 4 }, (_, i) => ({ id: `x${i}`, name: `x${i}`, description: "", deltas: { interpersonal: -4, communal: 0, intergenerational: 0, institutional: 0 } }));
    expect(telemetrySnapshot({ customShocks: big }).bondDelta.interpersonal).toBe(-5);
  });

  test("publisher tracking: only changed keys are recorded, with the last publisher and per-key sequence for the 400 ms pulse", () => {
    expect(changedKeys({ rupture: 40 }, { rupture: 40 })).toEqual([]);
    expect(changedKeys({ rupture: 40 }, { rupture: 48, ruptureBand: "Elevated" })).toEqual(["rupture", "ruptureBand"]);
    expect(recordPublication("sentinel", [])).toBeUndefined();
    recordPublication("sentinel", ["rupture", "ruptureBand"], 1000);
    recordPublication("inscription:customShocks", ["customShocks"], 2000);
    const m = busMonitorState();
    expect(m.last?.desk).toBe("inscription:customShocks");
    expect(m.count).toBe(2);
    expect(m.changedAt.rupture).toBe(m.last!.seq - 1);
    expect(m.changedBy.customShocks).toBe("inscription:customShocks");
    expect(INSPECTOR_FIELD_KEYS.bondDelta).toContain("customShocks");
  });

  test("the inspector only reads: the wire never publishes, and the dashboard records after the guard", () => {
    const wire = readFileSync("src/components/desk/ChancelleryWire.tsx", "utf8");
    expect(wire).not.toMatch(/usePublish|publish\(/);
    const dash = readFileSync("src/pages/Dashboard.tsx", "utf8");
    expect(dash.indexOf("const patch = guardSignalPatch(desk, raw);")).toBeLessThan(dash.indexOf("recordPublication(desk, moved)"));
    expect(guardSignalPatch("unknown-desk", { rupture: 10 })).toBeNull();
  });

  test("new bus keys pass the guard: ruptureBase and unmitigatedExposure", () => {
    expect(guardSignalPatch("sentinel", { ruptureBase: 33.3333 })).toEqual({ ruptureBase: 33.3333 });
    expect(guardSignalPatch("succession", { unmitigatedExposure: 32.5 })).toEqual({ unmitigatedExposure: 32.5 });
    expect(guardSignalPatch("succession", { unmitigatedExposure: Number.NaN })).toEqual({});
  });
});

describe("Chronological Mission Decision Log", () => {
  beforeEach(() => clearLedger());

  test("records follow the schema: evt_001…, exact UTC ISO timestamp, desk number, action, details", () => {
    logDecision("03", "INSCRIBE_SHOCK", "Shock applied: Drought (inactive -> active)", new Date("2026-01-02T03:04:05.678Z"));
    logEvent("NOTE_VERBALE_MINTED", "Ref VS-1");
    logDecision("10", "AMEND_COVENANT", "Covenant amended: A -> B", new Date("2026-01-02T03:05:00.000Z"));
    const r = decisionRecords();
    expect(r).toEqual([
      { id: "evt_001", timestamp: "2026-01-02T03:04:05.678Z", deskId: "03", action: "INSCRIBE_SHOCK", details: "Shock applied: Drought (inactive -> active)" },
      { id: "evt_002", timestamp: "2026-01-02T03:05:00.000Z", deskId: "10", action: "AMEND_COVENANT", details: "Covenant amended: A -> B" },
    ]);
    for (const x of r) expect(x.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    // Minted references stay on the ledger but are not decisions.
    expect(ledgerEntries()).toHaveLength(3);
  });

  test("plain-text audit ledger for the clipboard, and an empty ledger says so", () => {
    expect(decisionLogText()).toContain("No decisions recorded.");
    logDecision("07", "TRANCHE_RELEASE", "Escrow tranches met 1 -> 2 of 4", new Date("2026-01-02T00:00:00.000Z"));
    const t = decisionLogText();
    expect(t).toContain("evt_001  2026-01-02T00:00:00.000Z  DESK 07  TRANCHE_RELEASE  Escrow tranches met 1 -> 2 of 4");
    expect(t.split("\n")[0]).toBe("VINCULUM SECURITY · MISSION DECISION LOG");
  });

  test("desk numbers survive an idle-seal restore; malformed desks are dropped", () => {
    restoreLedger([
      { at: "2026-01-02T00:00:00.000Z", kind: "GATE_OVERRIDE", detail: "x", desk: "15" },
      { at: "2026-01-02T00:00:01.000Z", kind: "GATE_OVERRIDE", detail: "y", desk: "evil" },
    ]);
    expect(decisionRecords().map((d) => d.deskId)).toEqual(["15", "00"]);
  });

  test("the watch records shocks, covenants, redlines, gate overrides and escrow; copy goes through the clipboard guard; clear asks first", () => {
    const watch = readFileSync("src/components/desk/SessionLedger.tsx", "utf8");
    for (const a of ["INSCRIBE_SHOCK", "LIFT_SHOCK", "INSCRIBE_COVENANT", "AMEND_COVENANT", "STRIKE_COVENANT", "REDLINE_COVENANT", "GATE_OVERRIDE", "TRANCHE_RELEASE", "ESCROW_FREEZE"])
      expect(watch).toContain(`"${a}"`);
    expect(readFileSync("src/components/desk/ReadinessDesk.tsx", "utf8")).toMatch(/logDecision\("15", was \? "GATE_REOPENED" : "GATE_SATISFIED"/);
    expect(readFileSync("src/components/desk/MultiPartySequencer.tsx", "utf8")).toContain('logDecision("07", "ESCROW_TERMS"');
    expect(readFileSync("src/pages/Dashboard.tsx", "utf8")).toContain('logDecision("00", "PROFILE_AMENDED"');
    const wire = readFileSync("src/components/desk/ChancelleryWire.tsx", "utf8");
    expect(wire).toContain('import { copyText } from "@/lib/clipboardGuard";');
    expect(wire).toMatch(/Clear all \{entries\.length\} ledger entries\?/);
  });
});
