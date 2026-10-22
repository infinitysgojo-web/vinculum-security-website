// Mount integrity for the new surfaces: each renders inside the MissionEngine context
// without a ReferenceError, on an empty bus and on a bus carrying inscriptions.
import { describe, expect, test } from "bun:test";
import { createElement, type ComponentType } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EngineContext, type Signals } from "../src/components/desk/engine";
import ChancelleryWire from "../src/components/desk/ChancelleryWire";
import SuccessionSimulator from "../src/components/desk/SuccessionSimulator";
import CompoundShockTester from "../src/components/desk/CompoundShockTester";
import ShockTimelineScrubber from "../src/components/desk/ShockTimelineScrubber";
import { ExecutiveSheet } from "../src/components/desk/ExecutiveSummary";
import HandoverSealBadge from "../src/components/desk/HandoverSealBadge";
import { DoctrineText, DoctrineAnchors } from "../src/components/DoctrinalTooltip";
import { execSummary } from "../src/components/desk/executiveBrief";
import { inscriptionTimeline } from "../src/components/desk/shockTimeline";

const inscribed: Signals = {
  bonds: { interpersonal: 3.8, communal: 1.2, intergenerational: 2.5, institutional: 4.1 },
  rupture: 48,
  ruptureBase: 35,
  unmitigatedExposure: 32.5,
  customShocks: [{ id: "s1", name: "Drought", description: "", deltas: { interpersonal: 0, communal: -0.6, intergenerational: 0, institutional: 0 } }],
  customCovenants: [{ id: "c1", title: "Office continuity", obligation: "Binds the office.", enforcementMechanism: "Independent Trustee" }],
};
const mount = (C: ComponentType<Record<string, unknown>>, props: Record<string, unknown>, signals: Signals) =>
  renderToStaticMarkup(createElement(EngineContext.Provider, { value: { signals, publish: () => {} } }, createElement(C, props)));

describe("new surfaces mount", () => {
  for (const [name, signals] of [["empty bus", {}], ["inscribed bus", inscribed]] as const) {
    test(`Chancellery Wire trays (${name})`, () => {
      for (const tab of ["wire", "signals", "decisions"]) {
        const html = mount(ChancelleryWire as never, { signals, open: true, tab }, signals);
        expect(html).toContain("Chancellery wire");
        if (tab === "signals") expect(html).toContain('data-testid="signal-inspector"');
        if (tab === "decisions") expect(html).toContain('data-testid="decision-log"');
      }
    });
    test(`Desks 03 and 12 with their timeline scrubbers (${name})`, () => {
      expect(mount(CompoundShockTester as never, {}, signals)).toContain('data-testid="shock-timeline"');
      expect(mount(SuccessionSimulator as never, {}, signals)).toContain('data-testid="shock-timeline"');
    });
  }
  test("scrubber, sheet, seal badge and breviary render", () => {
    expect(renderToStaticMarkup(createElement(ShockTimelineScrubber, { steps: inscriptionTimeline(inscribed), title: "T" }))).toContain("T1 · Drought");
    const m = execSummary({ title: "M", theatre: "T", parties: "", envoy: "", classification: "", signals: inscribed });
    expect(renderToStaticMarkup(createElement(ExecutiveSheet, { m, archivalHash: "abc" }))).toContain("Evidentiary Hygiene");
    expect(renderToStaticMarkup(createElement(HandoverSealBadge, { status: { state: "unsealed" }, differences: () => [], sealing: false, onSeal() {}, onReseal() {}, onClear() {} }))).toContain("Seal assessment");
    expect(renderToStaticMarkup(createElement(DoctrineText, { text: "pacta sunt servanda" }))).toContain('data-doctrine="pacta-sunt-servanda"');
    expect(renderToStaticMarkup(createElement(DoctrineAnchors, { ids: ["uti-possidetis"] }))).toContain("Uti possidetis juris");
  });
});
