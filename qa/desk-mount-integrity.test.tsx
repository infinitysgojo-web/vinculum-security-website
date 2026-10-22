// Mount integrity for the Clause Architect (Desk 10) and the Compound Shock Tester (Desk 03).
// Rendering each desk inside the MissionEngine context surfaces lexical and lifecycle faults
// (a hook used without its import, a binding read before its declaration, an unbound helper in the
// treaty compiler) as thrown ReferenceErrors, on an empty boot bus and on a bus carrying inscriptions.
import { describe, expect, test } from "bun:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { EngineContext, type Signals } from "../src/components/desk/engine";
import ClauseArchitect from "../src/components/desk/ClauseArchitect";
import CompoundShockTester from "../src/components/desk/CompoundShockTester";

const mount = (Desk: () => JSX.Element, signals: Signals) =>
  renderToStaticMarkup(createElement(EngineContext.Provider, { value: { signals, publish: () => {} } }, createElement(Desk)));

const inscribed: Signals = {
  bonds: { interpersonal: 2.4, communal: 2.1, intergenerational: 1.5, institutional: 2.2 },
  weakestBond: "Intergenerational",
  weakestScore: 1.5,
  rupture: 40,
  customShocks: [
    { id: "sh1", name: "Inscribed shock one", description: "Test shock", deltas: { interpersonal: -0.2, communal: -0.3, intergenerational: -0.1, institutional: -0.2 } },
    { id: "sh2", name: "Inscribed shock two", description: "", deltas: { interpersonal: 0, communal: -0.3, intergenerational: 0, institutional: -0.1 } },
  ],
  customCovenants: [
    { id: "cv1", title: "Successor briefing covenant", obligation: "Every incoming head of delegation receives the full relational record.", enforcementMechanism: "Independent Trustee" },
    { id: "cv2", title: "Second covenant", obligation: "Budget lines survive the cycle.", enforcementMechanism: "Independent Trustee" },
  ],
} as Signals;

describe("desk mount integrity", () => {
  for (const [name, Desk] of [["Clause Architect", ClauseArchitect], ["Compound Shock Tester", CompoundShockTester]] as const) {
    test(`${name} mounts on an empty boot bus`, () => {
      expect(() => mount(Desk as any, {})).not.toThrow();
    });
    test(`${name} mounts with inscribed shocks and covenants`, () => {
      expect(() => mount(Desk as any, inscribed)).not.toThrow();
    });
  }

  test("inscribed shocks join the Compound Shock Tester's register", () => {
    const html = mount(CompoundShockTester as any, inscribed);
    expect(html).toContain("Inscribed shock one [INSCRIBED]");
    expect(html).toContain("Inscribed shock two [INSCRIBED]");
  });

  test("inscribed covenants compile as sequential Article C.N provisions", () => {
    const html = mount(ClauseArchitect as any, inscribed);
    expect(html).toContain("Successor briefing covenant [INSCRIBED]");
    expect(html).not.toMatch(/ARTICLE (undefined|NaN)/);
    expect(html).not.toContain("rom(");
  });
});
