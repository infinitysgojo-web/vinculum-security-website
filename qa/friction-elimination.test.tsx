// Friction elimination: six pillars that replace silent refusals and disabled controls with
// visible, explained states, while every reading stays on the single MissionEngine bus and in
// this browser. SSR renders plus source assertions, in the style of browser-local-continuity.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EngineContext, communalTolerance, stageGateAudit, statutoryClearances, type Signals } from "../src/components/desk/engine";
import TrackSequencer, { offendingPhase, sequenceDepths } from "../src/components/desk/TrackSequencer";
import MultiPartySequencer, { seatingSelection, radialSeat } from "../src/components/desk/MultiPartySequencer";
import ReadinessDesk from "../src/components/desk/ReadinessDesk";
import SyncPanel, { SYNC_TOGGLE_HINT, syncToggleLabel } from "../src/components/desk/SyncPanel";
import ClauseRedliner from "../src/components/desk/ClauseRedliner";
import { SIGN_OFF_CLEARED, signOffStatus, type SignOffInput } from "../src/components/desk/signOff";
import { readBreviary } from "../src/components/desk/breviary";
import { EMPTY_PROFILE } from "../src/components/desk/mission";
import { EMPTY_WARRANT, OPEN_QUESTION_GUIDANCE, STATUS_LABEL, WARRANT_MANDATORY, warrantMeterText, warrantProgress } from "../src/components/mode/workspace";
import { ARCHIVE_CUSTODY_NOTICE } from "../src/components/mode/transfer";

const read = (p: string) => readFileSync(p, "utf8");
const mount = (el: ReturnType<typeof createElement>, signals: Signals = {}) =>
  renderToStaticMarkup(createElement(EngineContext.Provider, { value: { signals, publish: () => {} } }, el));

/* ------------------------------------------------------------------ */
/* 1. Track Sequencer                                                  */
/* ------------------------------------------------------------------ */

describe("pillar 1 · Track Sequencer toggles freely and diagnoses the Elite-Pact Mirage", () => {
  const src = read("src/components/desk/TrackSequencer.tsx");

  test("no click interception and no disabled styling remain", () => {
    expect(src).not.toContain("blockedStep");
    expect(src).not.toContain("aria-disabled");
    expect(src).not.toContain("cursor-not-allowed");
    expect(src).not.toContain("setMirageAttempt");
    expect(src).not.toContain("Blocked by communal tolerance");
    expect(src).toContain("onChange={() => toggle(s.id)}");
  });

  test("depth is contiguous per track and the offending phase is Track I's leading phase", () => {
    expect(sequenceDepths(["i1", "i2", "i3"])).toEqual({ a: 3, b: 0 });
    expect(sequenceDepths(["i1", "i3", "ii1"])).toEqual({ a: 1, b: 1 });
    expect(offendingPhase(3, 0, 1)).toBe("Phase 3 · Testing");
    expect(offendingPhase(2, 0, 2)).toBeUndefined();
    expect(offendingPhase(1, 0, 0)).toBe("Phase 1 · Contact");
  });

  test("a Track I lead beyond tolerance renders the badge, the shear zone and the critical banner", () => {
    const html = mount(createElement(TrackSequencer, { initialDone: ["i1", "i2", "i3"] }));
    expect(html).toContain("Track I · Exceeds Communal Tolerance (+3)");
    expect(html).toContain('fill="url(#vs-shear-hatch)"');
    expect(html).toContain('stroke="hsl(var(--destructive))"');
    expect(html).toContain("Critical Alert: Elite-Pact Mirage Detected");
    expect(html).not.toContain("aria-disabled");
    expect(html).not.toContain("cursor-not-allowed");
    // The badge sits on exactly one phase.
    expect(html.split("Exceeds Communal Tolerance").length - 1).toBe(1);
  });

  test("the communal bond sets the tolerance: a Failing bond flags a one-phase lead", () => {
    const failing: Signals = { bonds: { interpersonal: 3, communal: 1.8, intergenerational: 3, institutional: 3 } };
    expect(communalTolerance(1.8).phases).toBe(0);
    const html = mount(createElement(TrackSequencer, { initialDone: ["i1"] }), failing);
    expect(html).toContain("Track I · Exceeds Communal Tolerance (+1)");
    expect(html).toContain("Critical Alert: Elite-Pact Mirage Detected");
  });

  test("inside tolerance nothing is flagged", () => {
    const viable: Signals = { bonds: { interpersonal: 3.5, communal: 3.6, intergenerational: 3.5, institutional: 3.5 } };
    const html = mount(createElement(TrackSequencer, { initialDone: ["i1", "i2"] }), viable);
    expect(html).not.toContain("Exceeds Communal Tolerance");
    expect(html).not.toContain("Critical Alert");
    expect(html).not.toContain('fill="url(#vs-shear-hatch)"');
  });

  test("the presets apply cleanly: both tracks in step, and Track II leading by two", () => {
    const both = ["i1", "ii1", "i2", "ii2"];
    expect(sequenceDepths(both)).toEqual({ a: 2, b: 2 });
    const ii = ["ii1", "ii2"];
    expect(sequenceDepths(ii)).toEqual({ a: 0, b: 2 });
    for (const done of [both, ii]) {
      const html = mount(createElement(TrackSequencer, { initialDone: done }));
      expect(html).not.toContain("Critical Alert");
      expect(html).not.toContain("Exceeds Communal Tolerance");
    }
    expect(mount(createElement(TrackSequencer, { initialDone: ii }))).toContain("Unanchored Repair is forming");
    expect(src).toContain('setDone(STEPS.filter((s) => s.track === "II" && PHASES.indexOf(s.phase) < 2).map((s) => s.id))');
    expect(src).toContain("setDone(STEPS.filter((s) => PHASES.indexOf(s.phase) < n).map((s) => s.id))");
  });

  test("elitePactAlert and trackGap ride the bus, and the Breviary and Wire read them", () => {
    expect(src).toMatch(/usePublish\("tracks", \{[\s\S]*trackGap: r\.gap,[\s\S]*elitePactAlert: r\.mirage,/);
    const b = readBreviary({ trackI: 3, trackII: 0, trackGap: 3, trackTolerance: 1, elitePactAlert: true }, EMPTY_PROFILE);
    expect(b.tracks.mirage).toBe(true);
    expect(b.tracks.gap).toBe(3);
    expect(readBreviary({ trackGap: 0, trackTolerance: 1, elitePactAlert: false }, EMPTY_PROFILE).tracks.mirage).toBe(false);
    expect(read("src/components/desk/ChancelleryWire.tsx")).toContain("if (!prev.elitePactAlert && next.elitePactAlert)");
  });
});

/* ------------------------------------------------------------------ */
/* 2. Multi-Party Sequencer                                            */
/* ------------------------------------------------------------------ */

describe("pillar 2 · six-seat negotiation table", () => {
  const src = read("src/components/desk/MultiPartySequencer.tsx");
  const SIX = ["state", "armed", "youth", "elders", "civil", "donor"];

  test("all available delegations can be selected without truncation", () => {
    const roster = [...SIX, "guarantor", "spoiler"];
    expect(seatingSelection(roster, roster)).toEqual(roster);
  });

  test("stale and duplicate selections cannot inflate the seated count", () => {
    expect(seatingSelection(["state", "state", "missing", "youth"], SIX)).toEqual(["state", "youth"]);
  });

  test("radial layout θi = 2πi/N, starting at the head of the table", () => {
    const r = 92;
    const s0 = radialSeat(0, 6, 140, 140, r);
    expect(s0.theta).toBe(0);
    expect(s0.x).toBeCloseTo(140, 6);
    expect(s0.y).toBeCloseTo(48, 6);
    for (let i = 0; i < 6; i++) {
      const s = radialSeat(i, 6, 140, 140, r);
      expect(s.theta).toBeCloseTo((2 * Math.PI * i) / 6, 9);
      expect(Math.hypot(s.x - 140, s.y - 140)).toBeCloseTo(r, 6);
    }
    expect(src).toContain("radialSeat(i, seated.length, c, c, r)");
  });

  test("six delegations seat, and friction counts across every seated pair", () => {
    const html = mount(createElement(MultiPartySequencer, { initialPicked: SIX }));
    expect(html.match(/r="13"/g)?.length).toBe(6);
    // Seven recorded friction pairs among these six: multiplier 1 + 0.10 × 7.
    expect(html).toContain("×1.70");
    expect(html).toContain("PARTIES SEATED: 6");
    for (const pair of ["Traditional or religious elders / Youth coalition", "Civil society and verifiers / Donor or funding body", "Donor or funding body / State executive"])
      expect(html).toContain(pair);
  });

  test("a seventh valid delegation remains seated", () => {
    const html = mount(createElement(MultiPartySequencer, { initialPicked: [...SIX, "guarantor"] }));
    expect(html.match(/r="13"/g)?.length).toBe(7);
  });

  test("the asymmetry matrix (coalition balance and veto) receives every seated party", () => {
    expect(src).toContain("...seated.map((a) => ({ id: a.id, label: a.label, bond: a.bond })),");
    const am = read("src/components/desk/AsymmetryMatrix.tsx");
    expect(am).toContain("parties.forEach((a, i) => parties.slice(i + 1).forEach((b)");
  });
});

/* ------------------------------------------------------------------ */
/* 3. Readiness Desk                                                   */
/* ------------------------------------------------------------------ */

describe("pillar 3 · Readiness Desk sign-off status", () => {
  const base: SignOffInput = {
    stageGates: stageGateAudit({}).gates,
    bindingOpen: statutoryClearances({}).filter((c) => c.binding && !c.passed).length,
    openQuestions: 2,
    stageLabel: "Pre-deployment authorisation",
    missingCritical: [],
    sovereignOpen: [],
    openLocks: [],
    canSignOff: false,
  };

  test("unready: itemises the gate names and the binding count", () => {
    const s = signOffStatus(base);
    expect(s.ready).toBe(false);
    expect(s.text).toBe(
      `Sign-off Held: 6 stage gates (Vector Integrity, Rupture Containment, Track Synchronization, Structural Covenants, Succession Durability, Evidentiary Hygiene) and ${base.bindingOpen} binding statutory clearances pending resolution.`,
    );
    const q = s.holds.find((h) => h.name === "Evidentiary Hygiene")!;
    expect(q.reason).toContain("2 open questions unresolved in the Context Tray");
  });

  test("cleared: the verified message", () => {
    const s = signOffStatus({ ...base, stageGates: base.stageGates.map((g) => ({ ...g, passed: true })), bindingOpen: 0, openQuestions: 0, canSignOff: true });
    expect(s.ready).toBe(true);
    expect(s.text).toBe("Clearance Verified: All 5 stage gates and binding clearances satisfied. Mission ready for formal transmittal.");
    expect(SIGN_OFF_CLEARED).toBe(s.text);
  });

  test("the button is active and the held block renders directly under it", () => {
    const html = mount(createElement(ReadinessDesk, { openQuestions: 1 }));
    const btn = html.slice(html.lastIndexOf("<button", html.indexOf(">Sign off mission<")), html.indexOf(">Sign off mission<"));
    expect(btn).not.toContain("disabled");
    const after = html.slice(html.indexOf(">Sign off mission<"));
    expect(after.indexOf('id="rd-signoff-status"')).toBeGreaterThan(-1);
    expect(after.indexOf('id="rd-signoff-status"')).toBeLessThan(after.indexOf("Statutorily registered"));
    expect(html).toContain("Sign-off Held: ");
    expect(html).toContain("Evidentiary Hygiene");
  });

  test("clicking while unready raises a sonner toast listing each open gate and reason", () => {
    const src = read("src/components/desk/ReadinessDesk.tsx");
    expect(src).toContain('import { toast } from "sonner";');
    expect(src).toMatch(/toast\.error\("Sign-off held: open gates"/);
    expect(src).toContain("{signOff.holds.map((h) => (");
    expect(src).toContain('void mint("attestation")');
    expect(src).not.toContain("disabled={!canSignOff}");
  });
});

/* ------------------------------------------------------------------ */
/* 4. Promotion warrant meter and Open Question guidance                */
/* ------------------------------------------------------------------ */

describe("pillar 4 · warrant formulation meter and open-question guidance", () => {
  const dialogs = read("src/components/mode/ModeDialogs.tsx");

  test("seven mandatory fields drive the meter", () => {
    expect(WARRANT_MANDATORY).toEqual(["title", "objective", "theatre", "custodian", "authority", "handling", "scope"]);
    expect(warrantMeterText(EMPTY_WARRANT)).toBe("Warrant Formulation: 0 of 7 mandatory fields completed");
    const part = { ...EMPTY_WARRANT, title: "T", objective: "O", scope: "  " };
    expect(warrantProgress(part)).toEqual({ filled: 2, total: 7, missing: ["theatre", "custodian", "authority", "handling", "scope"], complete: false });
    expect(warrantMeterText(part)).toBe("Warrant Formulation: 2 of 7 mandatory fields completed");
  });

  test("Continue is active; an incomplete attempt accents the empty fields and does not advance", () => {
    expect(dialogs).not.toContain("disabled={step === 1 && !warrantDone}");
    expect(dialogs).toContain("onClick={advance}>Continue</button>");
    const adv = dialogs.slice(dialogs.indexOf("const advance = () => {"), dialogs.indexOf("const kept"));
    expect(adv).toMatch(/if \(step === 1 && !progress\.complete\) \{\s*setAttempted\(true\);\s*return;\s*\}/);
    expect(dialogs).toContain("const flag = attempted && progress.missing.includes(f.key);");
    expect(dialogs).toContain("!border-accent/70");
    expect(dialogs).toContain("{warrantMeterText(w)}");
  });

  test("guidance names the repo's real classifications and appears in the tray and lifecycle status", () => {
    expect(OPEN_QUESTION_GUIDANCE).toBe(
      `Open questions represent unresolved evidentiary inquiries and hold mission sign-off. Reclassify as ${STATUS_LABEL.fact}, ${STATUS_LABEL.assumption}, or ${STATUS_LABEL.excluded} to clear.`,
    );
    expect(read("src/components/mode/ContextTray.tsx")).toContain("{OPEN_QUESTION_GUIDANCE}");
    expect(read("src/components/mode/ModeHeader.tsx")).toContain("{OPEN_QUESTION_GUIDANCE}");
    expect(dialogs).toContain("{OPEN_QUESTION_GUIDANCE}");
  });
});

/* ------------------------------------------------------------------ */
/* 5. SyncPanel and Clause Redliner                                     */
/* ------------------------------------------------------------------ */

describe("pillar 5 · Unlink Feed / Relink to Engine and the redliner minimum", () => {
  test("labels and hint, linked and unlinked", () => {
    expect(syncToggleLabel(true)).toBe("Unlink Feed");
    expect(syncToggleLabel(false)).toBe("Relink to Engine");
    expect(SYNC_TOGGLE_HINT).toBe("Disconnect upstream division readings to model standalone variations locally without altering the live mission bus.");
    const live: Signals = { bonds: { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 } };
    const on = mount(createElement(SyncPanel, { linked: true, onToggle: () => {} }), live);
    const off = mount(createElement(SyncPanel, { linked: false, onToggle: () => {} }), live);
    expect(on).toContain("Unlink Feed");
    expect(off).toContain("Relink to Engine");
    for (const h of [on, off]) {
      expect(h).toContain(`title="${SYNC_TOGGLE_HINT}"`);
      expect(h).not.toContain("Override");
    }
  });

  test("every desk takes the label from the shared SyncPanel; no desk keeps its own Override", () => {
    const desks = ["TrackSequencer", "MultiPartySequencer", "ReadinessDesk", "ClauseRedliner", "ClauseArchitect", "CompoundShockTester", "CounterpartPrompter", "HandoverProtocol", "SentinelMatrix", "SuccessionSimulator", "VerificationLedger"];
    for (const d of desks) {
      const s = read(`src/components/desk/${d}.tsx`);
      expect(s).toContain("SyncPanel");
      expect(s).not.toMatch(/["'>]Override["'<]/);
    }
    expect(read("src/components/desk/SyncPanel.tsx")).toContain("{syncToggleLabel(linked)}");
  });

  test("the redliner explains the 20-character minimum under the textarea", () => {
    const html = mount(createElement(ClauseRedliner));
    expect(html).toContain("Enter at least 20 characters to execute the statutory anti-theatrics audit.");
    const src = read("src/components/desk/ClauseRedliner.tsx");
    expect(src).toContain("const REDLINE_MIN_CHARS = 20;");
    expect(src.indexOf('id="rl-min"')).toBeGreaterThan(src.indexOf('id="rl-body"'));
  });
});

/* ------------------------------------------------------------------ */
/* 6. Archive custody notice                                            */
/* ------------------------------------------------------------------ */

describe("pillar 6 · archive custody notice", () => {
  test("brass at fifty per cent, exact text with the typographic apostrophe", async () => {
    const { ArchiveCustodyNotice } = await import("../src/components/mode/LocalDataDialog");
    const html = renderToStaticMarkup(createElement(ArchiveCustodyNotice));
    expect(html).toContain("border-brass/50");
    expect(html).not.toContain("border-brass/40");
    expect(ARCHIVE_CUSTODY_NOTICE).toContain("organisation\u2019s");
    expect(html).toContain("organisation\u2019s encrypted vault");
    expect(read("src/components/mode/LocalDataDialog.tsx")).not.toMatch(/gold/i);
  });
});

/* ------------------------------------------------------------------ */
/* Guardrails                                                           */
/* ------------------------------------------------------------------ */

describe("guardrails · no egress, one bus, browser-local only", () => {
  const files = [
    "src/components/desk/TrackSequencer.tsx",
    "src/components/desk/MultiPartySequencer.tsx",
    "src/components/desk/ReadinessDesk.tsx",
    "src/components/desk/signOff.ts",
    "src/components/desk/SyncPanel.tsx",
    "src/components/desk/ClauseRedliner.tsx",
    "src/components/mode/ModeDialogs.tsx",
    "src/components/mode/ModeHeader.tsx",
    "src/components/mode/ContextTray.tsx",
    "src/components/mode/workspace.ts",
  ].map(read).join("\n");
  test("no network, telemetry, cloud or second store", () => {
    expect(files).not.toMatch(/fetch\(|XMLHttpRequest|WebSocket|sendBeacon|supabase|firebase|google ?drive|dropbox|onedrive|icloud|analytics|createContext\(/i);
  });
  test("signOff.ts is pure: no React state or engine publishing", () => {
    const s = read("src/components/desk/signOff.ts");
    expect(s).not.toMatch(/useState|usePublish|localStorage|indexedDB/);
  });
});
