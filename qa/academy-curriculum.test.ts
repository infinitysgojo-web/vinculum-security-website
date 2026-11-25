// Chancellery Academy: one curriculum source, full lectures for every chapter, typeset
// mathematics only, and every number in the lectures re-derived from the engine.
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as engine from "../src/components/desk/engine";
import * as instruments from "../src/components/desk/instruments";
import * as proofs from "../src/components/desk/formulaProofs";
import * as seal from "../src/components/desk/handoverSeal";
import * as registry from "../src/components/desk/registry";
import { ACADEMY_CURRICULUM, QUIZ_GATES, chapterProseWords, gateSatisfied, readingMinutes } from "../src/components/mode/academyCurriculum";
import * as attest from "../src/components/mode/academyAttestation";
import * as inst from "../src/components/mode/academyInstruments";
import { AcademyInstrument } from "../src/components/mode/academyInstruments";
import * as reader from "../src/components/mode/academyReaderState";
import { LECTURE_HEADINGS, SEVEN_PART_ORDER } from "../src/components/mode/academyLectureHeadings";
import { AcademyFormulaBlock, MathText, parseMath, splitInlineMath } from "../src/components/mode/academyMath";
import type { AcademyFormula, AcademyInstrumentKind, DetailedAcademyChapter } from "../src/components/mode/academyTypes";
import ChancelleryAcademy, { ChapterTier1 } from "../src/components/mode/ChancelleryAcademy";

const chapters = ACADEMY_CURRICULUM.flatMap((m) => m.chapters.map((c) => ({ m, c })));
const mod = (id: string) => ACADEMY_CURRICULUM.find((m) => m.id === id)!;

/** Every formula object reachable from a chapter. */
const formulasOf = (c: DetailedAcademyChapter): AcademyFormula[] => c.sections.flatMap((s) => s.formulas ?? []);

/** Every prose string of a chapter (anything that may carry inline math). */
function proseOf(c: DetailedAcademyChapter): string[] {
  const out = [c.title, c.executiveLede, c.statutoryNotice, ...c.synopsis, ...c.learningOutcomes];
  for (const s of c.sections) {
    out.push(s.heading, ...(s.subheading ? [s.subheading] : []), ...s.paragraphs, ...(s.statutoryRule ? [s.statutoryRule] : []));
    if (s.caseStudy) out.push(s.caseStudy.title, s.caseStudy.jurisdiction, s.caseStudy.precedent, ...s.caseStudy.analysis, s.caseStudy.failureMechanism);
  }
  for (const q of c.quiz) out.push(q.question, ...q.options.flatMap((o) => [o.text, o.explanation]));
  for (const f of formulasOf(c)) {
    out.push(f.title, ...(f.statutoryInvariant ? [f.statutoryInvariant] : []));
    for (const p of f.parameters) out.push(p.name, p.domain, p.description, ...(p.threshold ? [p.threshold] : []));
  }
  return out;
}

const allProse = chapters.flatMap(({ c }) => proseOf(c));
const allText = allProse.join("\n");

describe("one curriculum source", () => {
  test("the hub carries the five modules in order with their canonical ids", () => {
    expect(ACADEMY_CURRICULUM.map((m) => m.id)).toEqual(["jurisprudence", "divisional-cadence", "computational-sovereignty", "relational-mathematics", "practicum-drills"]);
  });

  test("module, chapter, question and option ids are unique", () => {
    const uniq = (xs: string[]) => expect(new Set(xs).size).toBe(xs.length);
    uniq(ACADEMY_CURRICULUM.map((m) => m.id));
    uniq(chapters.map(({ c }) => c.id));
    uniq(chapters.flatMap(({ c }) => c.quiz.map((q) => q.id)));
    for (const { c } of chapters) for (const q of c.quiz) uniq(q.options.map((o) => o.id));
  });

  test("Modules IV and V carry the new chapter order, titles and drill types", () => {
    expect(mod("jurisprudence").chapters.map((c) => c.id)).toContain("chancellery-covenant");
    expect(mod("computational-sovereignty").chapters[0].id).toBe("zero-cloud-telemetry");
    expect(mod("relational-mathematics").chapters.map((c) => [c.id, c.title])).toEqual([
      ["rupture-index-proof", "The Rupture Index (R): Load-to-Bond Derivation"],
      ["decay-horizon-half-life", "The Decay Horizon (τ): Exponential Half-Life Modeling"],
      ["asymmetry-distance", "Normalized Asymmetry Distance (Δasym)"],
      ["dominum-index-proof", "The Dominum Index: Holistic Mission Synthesis"],
      ["escrow-conservation-proof", "Conservation of Value in Escrow Waterfalls"],
    ]);
    const v = mod("practicum-drills");
    expect(v.eyebrow).toContain("Applied Scenario Drills, Capstone & Gated Attestation");
    expect(v.chapters.map((c) => [c.id, c.drillType, c.title])).toEqual([
      ["drill-border", "border", "Drill Alpha: Transboundary River Basin Demarcation"],
      ["drill-debt", "debt", "Drill Beta: Sovereign Debt Restructuring & Mineral Collateral"],
      ["drill-maritime", "maritime", "Drill Gamma: Maritime EEZ Conflict"],
      ["capstone-attestation", "capstone", "The Sovereign Capstone & Gated Operator Attestation"],
    ]);
  });

  test("Modules IV and V follow the seven-part lecture structure", () => {
    for (const c of [...mod("relational-mathematics").chapters, ...mod("practicum-drills").chapters]) {
      expect({ c: c.id, headings: c.sections.map((s) => s.heading) }).toEqual({ c: c.id, headings: [...SEVEN_PART_ORDER] });
      expect(c.sections[0].caseStudy).toBeDefined();
      expect(c.sections[5].instrument).toBeDefined();
      expect(c.quiz.length).toBeGreaterThanOrEqual(3);
    }
    expect(LECTURE_HEADINGS.quiz).toBe("VII. Comprehension Knowledge Check");
  });

  test("Modules IV and V lectures carry substantial prose, and reading time follows it", () => {
    for (const c of [...mod("relational-mathematics").chapters, ...mod("practicum-drills").chapters]) {
      expect({ c: c.id, enough: chapterProseWords(c) >= 1500 }).toEqual({ c: c.id, enough: true });
      expect(readingMinutes(c)).toBe(Math.ceil(chapterProseWords(c) / 200));
    }
  });

  test("chapter numbers follow the module and chapter order", () => {
    ACADEMY_CURRICULUM.forEach((m, i) => m.chapters.forEach((c, j) => expect(c.number).toBe(`${i + 1}.${j + 1}`)));
  });
});

describe("every chapter resolves to a full lecture", () => {
  test.each(chapters.map(({ m, c }) => [`${m.id}/${c.id}`, c] as const))("%s", (_, c) => {
    expect(c.executiveLede.length).toBeGreaterThan(80);
    expect(c.synopsis.length).toBeGreaterThanOrEqual(2);
    expect(c.estimatedMinutes).toBeGreaterThan(0);
    expect(c.statutoryNotice.length).toBeGreaterThan(20);
    expect(c.learningOutcomes.length).toBeGreaterThanOrEqual(3);
    expect(c.sections.length).toBeGreaterThan(0);
    for (const s of c.sections) expect(s.paragraphs.length).toBeGreaterThan(0);
    expect(c.quiz.length).toBeGreaterThan(0);
    for (const q of c.quiz) {
      expect(q.options.length).toBe(4);
      expect(q.options.filter((o) => o.correct).length).toBe(1);
      for (const o of q.options) expect(o.explanation.length).toBeGreaterThan(10);
    }
  });

  test.each([...mod("relational-mathematics").chapters, ...mod("practicum-drills").chapters].map((c) => [c.id, c] as const))(
    "Module IV and V depth: %s",
    (_, c) => {
      expect(c.sections.length).toBeGreaterThanOrEqual(2);
      expect(c.learningOutcomes.length).toBeGreaterThanOrEqual(4);
      expect(c.quiz.length).toBeGreaterThanOrEqual(3);
      const cases = c.sections.filter((s) => s.caseStudy);
      expect(cases.length).toBeGreaterThanOrEqual(1);
      for (const s of cases) {
        const k = s.caseStudy!;
        expect(k.analysis.length).toBeGreaterThanOrEqual(2);
        for (const v of [k.title, k.jurisdiction, k.precedent, k.failureMechanism]) expect(v.length).toBeGreaterThan(10);
      }
      expect(c.sections.filter((s) => s.statutoryRule).length).toBeGreaterThanOrEqual(2);
    },
  );
});

describe("mathematics is typeset, never shown as source", () => {
  test("every formula parses with no unknown command", () => {
    for (const { c } of chapters)
      for (const f of formulasOf(c))
        for (const src of [f.lhs, f.rhs, f.condition ?? "", ...f.parameters.map((p) => p.symbol)]) {
          if (!src) continue;
          expect({ src, errors: parseMath(src).errors }).toEqual({ src, errors: [] });
        }
  });

  test("every inline formula parses, and prose outside it carries no formula notation", () => {
    for (const text of allProse) {
      for (const part of splitInlineMath(text)) {
        if (part.math) expect({ src: part.s, errors: parseMath(part.s).errors }).toEqual({ src: part.s, errors: [] });
        else expect({ text, bad: part.s.match(/[\\_^=≥≤×÷√]/g) }).toEqual({ text, bad: null });
      }
    }
  });

  test("rendered formulas and prose contain no backslash and use true fraction bars", () => {
    const html = chapters.flatMap(({ c }) => [
      ...formulasOf(c).map((f) => renderToStaticMarkup(createElement(AcademyFormulaBlock, { formula: f }))),
      ...proseOf(c).map((t) => renderToStaticMarkup(createElement(MathText, { text: t }))),
    ]).join("");
    expect(html.includes("\\")).toBe(false);
    expect(html).toContain('data-math="frac"');
    expect(html).toContain('data-math="sqrt"');
    expect(html).toContain('data-math="bigop"');
    expect(html).toContain('data-math="vector"');
    expect(html).toContain('data-math="cases"');
  });

  test("every formula names an engine function that exists", () => {
    const exported: Record<string, unknown> = { ...engine, ...instruments, ...proofs, ...seal, ...registry };
    for (const { c } of chapters)
      for (const f of formulasOf(c)) {
        expect(f.computedBy.length).toBeGreaterThan(0);
        for (const name of f.computedBy) expect({ formula: f.id, name, found: name in exported }).toEqual({ formula: f.id, name, found: true });
      }
  });
});

describe("lecture figures agree with the engine", () => {
  const has = (s: string) => expect({ s, present: allText.includes(s) }).toEqual({ s, present: true });

  test("Dominum weights, thresholds and worked cases", () => {
    expect(engine.DOMINUM_THRESHOLDS).toEqual({ anchor: 40, inversion: 60, dominium: 75 });
    const base = engine.dominumIndex({ bonds: { interpersonal: 4, communal: 4, intergenerational: 4, institutional: 4 }, escrowReleasedPercent: 80, survivalScore: 70, rupture: 20 });
    expect(base).toMatchObject({ index: 76, phase: "Self-Reinforcing Dominium" });
    const frozen = engine.dominumIndex({ bonds: { interpersonal: 4, communal: 4, intergenerational: 4, institutional: 4 }, escrowReleasedPercent: 80, escrowFrozen: true, survivalScore: 70, rupture: 20 });
    expect(frozen).toMatchObject({ index: 56, phase: "Fiduciary Anchor" });
    const floor = engine.dominumIndex({ bonds: { interpersonal: 5, communal: 3, intergenerational: 5, institutional: 5 }, escrowReleasedPercent: 80, survivalScore: 70, rupture: 20 });
    expect(floor).toMatchObject({ index: 79.8, phase: "Custodial Inversion", floorHeld: false });
    has("0.30 on the bond anchor, 0.25 on the fiduciary anchor, 0.25 on succession durability and 0.20 on containment");
    has("76.0"); has("56.0"); has("79.8");
  });

  test("Rupture Index steps, bands and inscribed load", () => {
    expect(engine.ruptureIndex((100 * 19) / 56, 0, 1)).toBe(34);
    expect(engine.ruptureIndex((100 * 20) / 56, 0, 1)).toBe(36);
    expect(engine.ruptureIndex((100 * 33) / 56, 0, 1)).toBe(59);
    expect(engine.ruptureIndex((100 * 34) / 56, 0, 1)).toBe(61);
    expect(engine.ruptureIndex((100 * 29) / 56, 0, 1.15)).toBe(60);
    expect(engine.ruptureIndex(40, 12, 1.15)).toBe(60);
    expect(engine.ruptureIndex(40, 12, 0.85)).toBe(44);
    expect(engine.inscribedRuptureLoad([{ deltas: { interpersonal: -0.5, communal: -1, intergenerational: 0, institutional: 0 } }], 1)).toBe(14);
    expect([14, 15, 34, 35, 59, 60].map(engine.ruptureBand)).toEqual(["Stable", "Guarded", "Guarded", "Elevated", "Elevated", "Critical"]);
    has("36 per cent, Elevated");
  });

  test("Decay Horizon worked examples", () => {
    const d = instruments.decayHorizon({ interpersonal: 4, communal: 2, intergenerational: 2, institutional: 3 }, 6.5, 40, 30);
    expect(d.lambda).toBeCloseTo(0.02325, 10);
    expect(d.halfLifeDays!.toFixed(1)).toBe("29.8");
    expect(d.bonds.map((b) => b.then)).toEqual([1.99, 1, 1, 1.49]);
    expect(d.meanLoss).toBe(1.38);
    const beta = instruments.decayHorizon({ interpersonal: 3.4, communal: 3.2, intergenerational: 3.1, institutional: 2.4 }, 26, 38, 30);
    expect(beta.lambda).toBeCloseTo(0.032, 10);
    expect(beta.halfLifeDays!.toFixed(1)).toBe("21.7");
    const insulated = instruments.decayHorizon({ interpersonal: 3.4, communal: 3.2, intergenerational: 3.1, institutional: 2.4 }, 6.5, 38, 30);
    expect(insulated.lambda).toBeCloseTo(0.02225, 10);
    expect(insulated.halfLifeDays!.toFixed(1)).toBe("31.2");
    expect(instruments.fractureWindow(1.9, 0.02)).toMatchObject({ days: 0, severity: "imminent" });
    has("29.8"); has("21.7 days"); has("31.2 days"); has("1.99, 1.00, 1.00 and 1.49");
  });

  test("escrow waterfall worked figures", () => {
    const base = { verifierSeated: true, trackGap: 1, trackTolerance: 2, survivalScore: 58 };
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 1.4, rupture: 10 }).released).toBe(17.5);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 1.9, rupture: 10 }).released).toBe(17.5);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 3.4, institutional: 3.1, intergenerational: 2.9, rupture: 30 }).released).toBe(67);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 3.4, institutional: 3.1, intergenerational: 3.3, rupture: 30 }).released).toBe(100);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 3.4, institutional: 3.1, intergenerational: 3.3, rupture: 61 }).released).toBe(0);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, verifierSeated: false, communal: 3.4, rupture: 10 }).tranches.every((t) => !t.met)).toBe(true);
    expect(instruments.DEFAULT_ESCROW.shares).toEqual([25, 25, 30, 20]);
    has("25, 25, 30 and 20"); has("17.5 per cent"); has("67 per cent");
  });

  test("forum venues and penalties", () => {
    expect(Object.fromEntries(instruments.FORUMS.map((f) => [f.id, instruments.enforceability(f)]))).toEqual({ icsid: 80, pca: 74, lcia: 72, icc: 70, swiss: 68, siac: 66, icj: 46 });
    const pca = instruments.FORUMS.find((f) => f.id === "pca")!;
    expect(instruments.forumFitness(pca, { immunityWaived: false, neutralSeat: false }).fitness).toBe(48);
    has("ICSID 80, PCA 74, LCIA 72, ICC 70, Swiss Arbitration Centre 68, SIAC 66 and ICJ Advisory 46");
  });

  test("succession durability in Drill Beta", () => {
    const b = { interpersonal: 3.4, communal: 3.2, intergenerational: 3.1, institutional: 2.4 };
    expect(engine.successionDurability({ bonds: b, covenants: ["a"], rupture: 38 })!.percent).toBe(48.7);
    expect(engine.successionDurability({ bonds: b, covenants: ["a", "b"], rupture: 38 })!.percent).toBe(50.2);
    expect(engine.successionDurability({ bonds: { ...b, institutional: 3.4 }, covenants: ["a", "b"], rupture: 38 })!.percent).toBe(56.9);
    has("48.7 per cent"); has("50.2 per cent"); has("56.9 per cent");
  });

  test("distance, resonance and friction", () => {
    const rows = engine.distanceTable([3.8, 1.9, 3.2, 3.0]);
    const nearest = rows.find((r) => r.rank === 1)!;
    expect([nearest.shortTitle, nearest.distance.toFixed(3), nearest.resonance]).toEqual(["Kenya", "1.221", 84.7]);
    expect(engine.MAX_DISTANCE).toBe(8);
    expect(Math.round((Math.sqrt(2) / 8) * 100) / 100).toBe(0.18);
    has("1.221"); has("84.7");
  });

  test("track tolerance, floor and clearances", () => {
    expect([1.9, 2.6, 3.4].map((x) => engine.communalTolerance(x).phases)).toEqual([0, 1, 2]);
    expect(engine.breachesFloor(3.0)).toBe(true);
    expect(engine.holdsFloor(3.0)).toBe(false);
    const cl = engine.statutoryClearances({});
    expect(cl.map((c) => c.id)).toEqual(["1.1", "1.2", "1.3", "1.4", "2.1", "2.2", "2.3", "2.4", "3.1", "3.2", "3.3", "3.4", "4.1", "4.2", "4.3", "4.4", "5.1", "5.2", "5.3", "5.4"]);
    expect(cl.filter((c) => !c.binding).length).toBe(6);
    has("six advisory clearances");
  });

  test("Module IV extended worked figures", () => {
    const v = { interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 };
    expect([20, 40, 60].map((r) => instruments.decayHorizon(v, 0, r, 30).halfLifeDays!.toFixed(1))).toEqual(["69.3", "34.7", "23.1"]);
    expect([instruments.fractureWindow(3.0, 0.02325).days, instruments.fractureWindow(3.5, 0.02325).days]).toEqual([17, 24]);
    expect(instruments.fractureWindow(4.0, 0.002)).toMatchObject({ days: 347, months: 11.4, severity: "acute" });
    expect(engine.ruptureIndex((100 * 40) / 56, 0, engine.TREND_MULT.improving)).toBe(61);
    expect([engine.frictionCoefficient([5, 3, 3, 3], [1, 3, 3, 3]), engine.frictionCoefficient([5, 5, 5, 5], [1, 1, 1, 1]), engine.frictionCoefficient([5, 1, 3, 3], [1, 5, 3, 3])]).toEqual([0.5, 1, 0.71]);
    const all = (x: number) => ({ interpersonal: x, communal: x, intergenerational: x, institutional: x });
    expect(engine.dominumIndex({ bonds: all(2), escrowReleasedPercent: 0, survivalScore: 30, rupture: 50 })).toMatchObject({ index: 25, phase: "Imperium-Bound" });
    expect(engine.dominumIndex({ bonds: all(3.5), escrowReleasedPercent: 67, survivalScore: 56, rupture: 30 })).toMatchObject({ index: 63.5, phase: "Custodial Inversion" });
    const one = { verifierSeated: true, communal: 1.5, rupture: 10, trackGap: 0, trackTolerance: 0 };
    expect(instruments.escrowWaterfall({ shares: [5, 35, 40, 20], clawback: 10, bond: 5 }, one)).toMatchObject({ bondHeld: 4.5, released: 0 });
    expect(instruments.escrowWaterfall({ shares: [40, 20, 20, 20], clawback: 10, bond: 5 }, one).released).toBe(31);
    expect(instruments.escrowWaterfall({ shares: [30, 30, 30, 20], clawback: 10, bond: 5 }, one).balanced).toBe(false);
    has("69.3 days"); has("63.5"); has("0.71"); has("11.4 months");
  });

  test("Drill Alpha: limiting bond, drought trend, corridor escrow", () => {
    const r = engine.mathReading([3.8, 1.9, 3.2, 3.0]);
    expect([r.limitingIndex, r.limitingScore]).toEqual([1, 1.9]);
    expect(engine.ruptureIndex((100 * 20) / 56, 0, engine.TREND_MULT.static)).toBe(36);
    expect(engine.ruptureIndex((100 * 20) / 56, 0, engine.TREND_MULT.deteriorating)).toBe(41);
    expect(41 >= instruments.PROVISIONAL_THRESHOLD && 36 < instruments.PROVISIONAL_THRESHOLD).toBe(true);
    expect(engine.ruptureIndex((100 * 29) / 56, 0, engine.TREND_MULT.deteriorating)).toBe(60);
    const base = { verifierSeated: true, institutional: 3.0, intergenerational: 3.2, trackGap: 0, survivalScore: 50, rupture: 36 };
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 1.9, trackTolerance: 0 }).released).toBe(17.5);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, communal: 3.4, trackTolerance: 2 }).released).toBe(40);
    const pca = instruments.FORUMS.find((f) => f.id === "pca")!;
    expect(instruments.forumFitness(pca, { immunityWaived: true, neutralSeat: true }).fitness).toBe(74);
    has("reads 41"); has("register score of 20");
  });

  test("Drill Beta: multi-tranche release and the final Dominum reading", () => {
    const b = { interpersonal: 3.4, communal: 3.2, intergenerational: 3.1, institutional: 2.4 };
    expect(engine.mathReading([3.4, 3.2, 3.1, 2.4]).nearest.shortTitle).toBe("Liberia");
    const base = { verifierSeated: true, trackGap: 1, trackTolerance: 2, rupture: 38, communal: 3.2, intergenerational: 3.1 };
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, institutional: 2.4, survivalScore: 50.2 }).released).toBe(40);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, institutional: 3.4, survivalScore: 50.2 }).released).toBe(67);
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...base, institutional: 3.4, survivalScore: 56.9 }).released).toBe(100);
    expect(engine.dominumIndex({ bonds: { ...b, institutional: 3.4 }, escrowReleasedPercent: 100, survivalScore: 56.9, rupture: 38 })).toMatchObject({ index: 68.7, phase: "Custodial Inversion" });
    expect(engine.dominumIndex({ bonds: b, escrowReleasedPercent: 40, survivalScore: 50.2, rupture: 38 })).toMatchObject({ index: 50.1, phase: "Fiduciary Anchor" });
    has("40 per cent"); has("68.7"); has("50.1");
  });

  test("Drill Gamma: standoff into the Critical band, freeze and the venue table", () => {
    expect(engine.ruptureIndex(50, 0, 1)).toBe(50);
    expect(engine.ruptureIndex(50, 0, engine.TREND_MULT.deteriorating)).toBe(57);
    expect(engine.inscribedRuptureLoad([], 1)).toBe(6);
    expect(engine.ruptureIndex(50, 6, engine.TREND_MULT.deteriorating)).toBe(64);
    expect(engine.mathReading([3.1, 2.2, 3.4, 2.6]).limitingIndex).toBe(1);
    const e = { verifierSeated: true, communal: 2.2, institutional: 2.6, intergenerational: 3.4, trackGap: 0, trackTolerance: 1, survivalScore: 50 };
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...e, rupture: 64 })).toMatchObject({ frozen: true, released: 0, gross: 25 });
    expect(instruments.escrowWaterfall(instruments.DEFAULT_ESCROW, { ...e, rupture: 50 }).released).toBe(17.5);
    const fit = (w: boolean, n: boolean) => Object.fromEntries(instruments.FORUMS.map((f) => [f.id, instruments.forumFitness(f, { immunityWaived: w, neutralSeat: n }).fitness]));
    expect(fit(false, false)).toEqual({ icsid: 54, pca: 48, lcia: 46, icc: 44, swiss: 42, siac: 40, icj: 20 });
    expect([fit(true, false).pca, fit(true, false).icj, fit(false, true).pca, fit(false, true).icj, fit(true, true).pca]).toEqual([66, 38, 56, 28, 74]);
    has("ICSID 54, PCA 48, LCIA 46, ICC 44, Swiss Arbitration Centre 42, SIAC 40 and ICJ Advisory 20"); has("64");
  });

  test("Capstone Gate 5 worked case", () => {
    expect(engine.ruptureIndex(25, 10, 1)).toBe(35);
    expect(engine.ruptureIndex(50, 10, 1)).toBe(60);
    expect(engine.mathReading([3.8, 2.8, 4.1, 3.6]).limitingIndex).toBe(1);
  });

  test("stale claims that conflict with the engine are gone", () => {
    for (const stale of ["1.20", "0.675", "Dominum Quotient", "80–100", "0.00 (", "Delta_asym", "tau_0", "mu_trend", "min(B) >= 0.30", "D >= 75 and", "12 nautical miles"])
      expect({ stale, present: allText.includes(stale) }).toEqual({ stale, present: false });
  });
});

describe("attestation gates and seal", () => {
  const right: Record<string, string> = {};
  for (const { c } of chapters) for (const q of c.quiz) right[q.id] = q.options.find((o) => o.correct)!.id;
  const passingInput: attest.StressInput = {
    bonds: { interpersonal: 3.8, communal: 2.8, intergenerational: 4.1, institutional: 3.6 },
    observedShare: 50,
    inscribedLoad: 10,
    trend: "static",
    namedBond: "communal",
  };

  test("knowledge-check gates are Modules I to IV, one per module", () => {
    expect(QUIZ_GATES.map((g) => g.id)).toEqual(ACADEMY_CURRICULUM.slice(0, 4).map((m) => `module-${m.id}`));
    for (const g of QUIZ_GATES) expect(g.questionIds.length).toBeGreaterThan(0);
  });

  test("exactly six gates, every one locked by default, and the seal disabled", () => {
    const gates = attest.attestationGates({ answers: {}, stress: null, covenantAffirmed: false });
    expect(gates.map((g) => [g.number, g.id, g.kind])).toEqual([
      [1, "module-jurisprudence", "knowledge-check"],
      [2, "module-divisional-cadence", "knowledge-check"],
      [3, "module-computational-sovereignty", "knowledge-check"],
      [4, "module-relational-mathematics", "knowledge-check"],
      [5, "applied-stress-simulation", "stress-simulation"],
      [6, "practitioner-covenant", "covenant"],
    ]);
    expect(gates.every((g) => !g.satisfied)).toBe(true);
    expect(attest.canSeal(gates)).toBe(false);
  });

  test("a knowledge-check gate opens only when every question stands answered correctly", () => {
    const g = QUIZ_GATES[3];
    expect(gateSatisfied(g, right)).toBe(true);
    expect(gateSatisfied(g, { ...right, [g.questionIds[0]]: "opt-z" })).toBe(false);
    expect(gateSatisfied(g, {})).toBe(false);
  });

  test("Gate 5 needs the engine's limiting bond and R of 60 or more", () => {
    expect(attest.STRESS_THRESHOLD).toBe(60);
    expect(attest.evaluateStressSimulation(passingInput)).toMatchObject({ passed: true, rupture: 60, band: "Critical", limitingBond: "communal" });
    expect(attest.evaluateStressSimulation({ ...passingInput, namedBond: "interpersonal" }).passed).toBe(false);
    expect(attest.evaluateStressSimulation({ ...passingInput, observedShare: 49 }).passed).toBe(false);
    expect(attest.evaluateStressSimulation({ ...passingInput, namedBond: null }).passed).toBe(false);
    const tie = { ...passingInput, bonds: { interpersonal: 2.5, communal: 2.5, intergenerational: 4, institutional: 4 } };
    expect(attest.evaluateStressSimulation({ ...tie, namedBond: "communal" }).passed).toBe(true);
  });

  test("the seal unlocks only at six of six", () => {
    const stress = attest.stressRecord(passingInput, attest.evaluateStressSimulation(passingInput));
    const five = [
      attest.attestationGates({ answers: right, stress, covenantAffirmed: false }),
      attest.attestationGates({ answers: right, stress: null, covenantAffirmed: true }),
      attest.attestationGates({ answers: { ...right, [QUIZ_GATES[0].questionIds[0]]: "opt-z" }, stress, covenantAffirmed: true }),
    ];
    for (const g of five) {
      expect(g.filter((x) => x.satisfied).length).toBe(5);
      expect(attest.canSeal(g)).toBe(false);
      expect(() => attest.buildAttestationRecord({ gates: g, stress, passedAt: {}, sealedAt: new Date(0) })).toThrow();
    }
    expect(attest.canSeal(attest.attestationGates({ answers: right, stress, covenantAffirmed: true }))).toBe(true);
  });

  test("the record is canonical and its SHA-256 digest is deterministic", async () => {
    const stress = attest.stressRecord(passingInput, attest.evaluateStressSimulation(passingInput))!;
    const gates = attest.attestationGates({ answers: right, stress, covenantAffirmed: true });
    const passedAt = Object.fromEntries(gates.map((g, i) => [g.id, `2026-01-01T00:0${i}:00.000Z`]));
    const sealedAt = new Date("2026-01-01T01:00:00.000Z");
    const r1 = attest.buildAttestationRecord({ gates, stress, passedAt, sealedAt });
    const r2 = attest.buildAttestationRecord({ gates: [...gates], stress: { ...stress }, passedAt: Object.fromEntries(Object.entries(passedAt).reverse()), sealedAt });
    const a = await attest.sealAttestation(r1);
    const b = await attest.sealAttestation(r2);
    expect(a.canonical).toBe(b.canonical);
    expect(a.digest).toBe(b.digest);
    expect(a.digest).toMatch(/^[0-9a-f]{64}$/);
    expect(a.canonical).toBe(registry.canonicalJson(r1));
    const expected = Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(a.canonical))), (x) => x.toString(16).padStart(2, "0")).join("");
    expect(a.digest).toBe(expected);
    expect(await attest.verifyAttestation(a)).toBe(true);
    expect(await attest.verifyAttestation({ ...a, canonical: a.canonical.replace("Critical", "Elevated") })).toBe(false);
    const later = await attest.sealAttestation(attest.buildAttestationRecord({ gates, stress, passedAt, sealedAt: new Date("2026-01-01T01:00:01.000Z") }));
    expect(later.digest).not.toBe(a.digest);
    const keys = Object.keys(JSON.parse(a.canonical));
    expect(keys).toEqual([...keys].sort());
    expect(keys).toEqual(["algorithm", "curriculum", "designation", "disclaimer", "format", "passedAt", "sealedAtUtc", "simulation", "verificationManifest"]);
    expect(r1.sealedAtUtc.endsWith("Z")).toBe(true);
    expect(r1.verificationManifest.length).toBe(6);
    expect(r1.disclaimer).toContain("not institutional accreditation");
  });
});

describe("section instruments", () => {
  const kinds: AcademyInstrumentKind[] = ["radar", "asymmetry", "timeline", "escrow", "dominum", "forum"];
  test.each(kinds)("%s renders read-only", (kind) => {
    const html = renderToStaticMarkup(createElement(AcademyInstrument, { kind }));
    expect(html).toContain(`data-testid="instrument-${kind}"`);
    expect(html.includes("\\")).toBe(false);
  });

  test("instruments never publish to the MissionEngine bus", () => {
    for (const f of ["academyInstruments.tsx", "academyReader.tsx", "academyReaderState.ts"]) {
      const code = readFileSync(`src/components/mode/${f}`, "utf8").replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
      expect(code).not.toMatch(/usePublish|useEngine|EngineContext|publish\(/);
    }
  });
});

describe("the Academy view", () => {
  const src = readFileSync("src/components/mode/ChancelleryAcademy.tsx", "utf8");

  test("renders from the curriculum with no stub lecture", () => {
    const html = renderToStaticMarkup(createElement(ChancelleryAcademy, { onExit: () => {} }));
    for (const m of ACADEMY_CURRICULUM) expect(html).toContain(`data-module-id="${m.id}"`);
    expect(html.includes("\\")).toBe(false);
    expect(src).not.toContain("Operational Treatise");
    expect(src).not.toContain("const MODULES: AcademyModule[]");
  });

  test("the laboratory computes through the desks' own functions", () => {
    for (const fn of ["ruptureIndex(", "dominumIndex(", "escrowWaterfall(", "successionDurability(", "decayHorizon(", "mathReading("]) expect(src).toContain(fn);
    expect(src).not.toMatch(/0\.30 \* |\(5 - liebigMin\)/);
  });

  test("the chapter page shows reading time and learning outcomes; the lecture renders instruments, the quiz heading and footer navigation for every module", () => {
    const html = renderToStaticMarkup(createElement(ChancelleryAcademy, { onExit: () => {} }));
    expect(html).toContain("Reading time");
    expect(html).toContain('data-testid="chapter-outcomes"');
    expect(src).toContain("<AcademyInstrument kind={section.instrument} />");
    expect(src).toContain("{LECTURE_HEADINGS.quiz}");
    for (const label of ["Previous Chapter", "Return to Syllabus", "Next Chapter"]) expect(src).toContain(label);
    expect(src).not.toMatch(/activeModule\.id === "relational-mathematics" && \(\s*<nav/);
  });

  test("progress stays in the browser: no network, no telemetry, no persistent storage", () => {
    for (const f of ["ChancelleryAcademy.tsx", "academyAttestation.ts", "academyInstruments.tsx", "academyReader.tsx", "academyReaderState.ts"]) {
      const text = readFileSync(`src/components/mode/${f}`, "utf8");
      expect(text).not.toMatch(/fetch\(|XMLHttpRequest|sendBeacon|localStorage|WebSocket|analytics|telemetry\(/);
    }
    expect(src).toContain("window.crypto.subtle");
    expect(src).toContain("sessionStorage");
  });

  test("standing rules: semantic tokens, no emoji glyphs, no private routes, no fixed digest", () => {
    const files = ["ChancelleryAcademy.tsx", "academyMath.tsx", "ScholarlyFormula.tsx", "academyFormulas.ts", "academyModuleIV.ts", "academyModuleIVChapters1.ts", "academyModuleIVChapters2.ts", "academyCurriculumPart1.ts", "academyCurriculumPart2.ts", "academyCurriculumPart3.ts", "academyModuleVAlpha.ts", "academyModuleVBeta.ts", "academyModuleVGamma.ts", "academyModuleVCapstone.ts", "academyAttestation.ts", "academyInstruments.tsx", "academyCurriculum.ts", "academyLectureHeadings.ts", "academyReader.tsx", "academyReaderState.ts"]
      .map((f) => readFileSync(`src/components/mode/${f}`, "utf8"));
    for (const f of files) {
      expect(f).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
      expect(f).not.toMatch(/\b(emerald|amber|green|red|blue|yellow)-\d{2,3}\b/);
      expect(f).not.toMatch(/[✓✗\u{1F300}-\u{1FAFF}]/u);
      expect(f).not.toMatch(/\/dashboard|\/login/);
      expect(f).not.toMatch(/[A-Za-z]+ Dawn\b/);
    }
    expect(src).not.toContain("0e8b5a794c1a938c");
    expect(src).not.toContain('operator: "');
  });
});

describe("Tier 1 chapter pages show only Tier 1", () => {
  const md = (t: string) => renderToStaticMarkup(createElement(MathText, { text: t }));
  const sentences = (t: string) => t.split(/(?<=[.:;])\s+/).map((x) => x.trim()).filter((x) => x.length > 40);

  test.each(chapters.map(({ m, c }) => [c.number, m, c] as const))("chapter %s", (_, m, c) => {
    const html = renderToStaticMarkup(createElement(ChapterTier1, { module: m, chapter: c, position: m.chapters.indexOf(c), onOpen: () => {} }));
    // The Tier 1 fields, in every chapter.
    expect(html).toContain(md(m.eyebrow));
    expect(html).toContain(md(`${c.number} ${c.title}`));
    expect(html).toContain(md(c.executiveLede));
    expect(html).toContain(md(c.statutoryNotice));
    expect(html).toContain(`Reading time ${readingMinutes(c)} min`);
    for (const o of c.learningOutcomes) expect(html).toContain(md(o));
    expect(html).toContain("Open Full Chapter Lecture &amp; Practicum");
    // Nothing that belongs to the lecture.
    for (const p of [...c.synopsis, ...c.sections.flatMap((s) => [...s.paragraphs, ...(s.statutoryRule ? [s.statutoryRule] : [])])]) expect({ c: c.number, leaked: html.includes(md(p)) }).toEqual({ c: c.number, leaked: false });
    for (const s of c.sections) {
      expect(html.includes(md(s.heading))).toBe(false);
      if (s.caseStudy) expect(html.includes(md(s.caseStudy.title))).toBe(false);
    }
    for (const id of ["scholarly-formula", "instrument-", "academy-laboratory", "academy-attestation", "lecture-quiz"]) expect({ c: c.number, id, present: html.includes(id) }).toEqual({ c: c.number, id, present: false });
    expect("formulas" in c).toBe(false);
  });

  test("no lecture text is duplicated in Tier 1", () => {
    for (const { c } of chapters) {
      const lecture = [...c.synopsis, ...c.sections.flatMap((s) => [...s.paragraphs, ...(s.caseStudy ? s.caseStudy.analysis : []), ...(s.statutoryRule ? [s.statutoryRule] : [])])].join("\n");
      for (const t of [c.executiveLede, c.statutoryNotice, ...c.learningOutcomes])
        for (const sn of sentences(t)) expect({ c: c.number, sn, duplicated: lecture.includes(sn) }).toEqual({ c: c.number, sn, duplicated: false });
    }
  });

  test("the Academy page renders the Tier 1 component and no laboratory or capstone outside the lecture", () => {
    const html = renderToStaticMarkup(createElement(ChancelleryAcademy, { onExit: () => {} }));
    expect(html).toContain('data-testid="chapter-tier-1"');
    for (const id of ["academy-laboratory", "academy-attestation", "scholarly-formula", 'data-testid="instrument-']) expect(html.includes(id)).toBe(false);
    const cap = ACADEMY_CURRICULUM.flatMap((m) => m.chapters).find((c) => c.drillType === "capstone")!;
    expect(cap.sections[5].practicum).toEqual(["laboratory", "attestation"]);
  });
});

describe("the lecture reader", () => {
  const src = readFileSync("src/components/mode/academyReader.tsx", "utf8");
  const view = readFileSync("src/components/mode/ChancelleryAcademy.tsx", "utf8");

  test("Escape closes the lecture, and closes an open menu first", () => {
    expect(reader.readerKeyAction("Escape", { menuOpen: false })).toBe("close-lecture");
    expect(reader.readerKeyAction("Escape", { menuOpen: true })).toBe("close-menu");
    expect(reader.readerKeyAction("Tab", { menuOpen: false })).toBe(null);
    // Captured on the document, so a slider, an input, a quiz option or the menu cannot swallow it.
    expect(src).toContain('document.addEventListener("keydown", onKey, true)');
    expect(src).toMatch(/action === "close-lecture"[\s\S]{0,80}onClose\(\)/);
  });

  test("the X closes the lecture, is labelled and stays in the sticky header", () => {
    expect(src).toContain('aria-label="Close lecture"');
    expect(src).toMatch(/onClick=\{onClose\}\s*aria-label="Close lecture"/);
    expect(src).toMatch(/min-h-11 min-w-11[^"]*focus-visible:outline/);
    expect(src).toContain('role="dialog"');
    expect(src).toContain('aria-modal="true"');
    expect(src).toContain("aria-labelledby={titleId}");
    expect(view).toContain("onClose={closeLecture}");
    expect(view).not.toMatch(/confirm\(/);
  });

  test("closing returns focus to the opener and saves the reading position", () => {
    expect(view).toContain("ref={openerRef}");
    expect(view).toMatch(/const closeLecture = useCallback\([\s\S]*?savePosition\([\s\S]*?openerRef\.current\?\.focus/);
    const mem = new Map<string, string>();
    const store = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    reader.savePosition(store, "rupture-index-proof", 0.4213);
    expect(reader.loadPositions(store)).toEqual({ "rupture-index-proof": 0.421 });
    reader.savePosition(store, "rupture-index-proof", 0.01);
    expect(reader.loadPositions(store)).toEqual({});
    expect(reader.loadPositions({ getItem: () => "{bad", setItem: () => {} })).toEqual({});
  });

  test("quiz progress survives a close and a reopen", () => {
    const mem = new Map<string, string>();
    const store = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
    const q = chapters[0].c.quiz[0];
    mem.set(reader.SESSION_KEY, JSON.stringify({ answers: { [q.id]: "opt-b" }, covenantAffirmed: false, stress: null, passedAt: {} }));
    reader.savePosition(store, chapters[0].c.id, 0.5); // what a close writes
    expect(reader.loadAcademySession(store).answers).toEqual({ [q.id]: "opt-b" });
    const closeBody = view.match(/const closeLecture = useCallback\(\(\) => \{([\s\S]*?)\}, \[\]\);/)![1];
    expect(closeBody).not.toMatch(/setQuizAnswers|removeItem/);
  });

  test("progress, time left and the current section", () => {
    expect(reader.readingProgress(0, 1000, 500)).toBe(0);
    expect(reader.readingProgress(250, 1000, 500)).toBe(0.5);
    expect(reader.readingProgress(0, 400, 500)).toBe(1);
    expect(reader.minutesLeft(13, 0.5)).toBe(7);
    expect(reader.minutesLeft(13, 1)).toBe(0);
    expect(reader.activeSection([0, 800, 1600], 0)).toBe(0);
    expect(reader.activeSection([0, 800, 1600], 720)).toBe(1);
    expect(reader.activeSection([200, 800], 0)).toBe(-1);
  });

  test("the reader's dimensions follow the brief at each breakpoint", () => {
    expect(src).toContain("xl:h-[94dvh] xl:w-[96vw] xl:max-w-[1600px]");
    expect(src).toContain("md:h-[calc(100dvh-16px)] md:w-[calc(100vw-16px)]");
    expect(src).toContain("h-[100dvh] w-screen");
    expect(src).toContain("pt-[env(safe-area-inset-top)]");
    expect(src).toContain("pb-[env(safe-area-inset-bottom)]");
    expect(src).toContain("w-[260px]");
    expect(view).toContain('const PROSE = "mx-auto max-w-[70ch]"');
    expect(view).toContain("max-w-[1040px]");
  });

  test("every chapter's lecture shares the seven-heading frame where it has those sections, and the same quiz heading and footer", () => {
    expect(view).toContain("{LECTURE_HEADINGS.quiz}");
    expect((view.match(/data-testid="lecture-footer"/g) ?? []).length).toBe(1);
  });
});

describe("instrument presets agree with the engine", () => {
  test("radar presets", () => {
    for (const p of inst.RADAR_PRESETS) {
      const r = inst.radarReading(p.value);
      expect(r.reading).toEqual(engine.mathReading(p.value));
      expect(r.facade).toEqual(engine.facadeSyndrome(p.value));
      for (const b of r.bonds) expect(b.breaches).toBe(engine.breachesFloor(b.score));
      if (engine.breachesFloor(r.reading.limitingScore)) expect(engine.holdsFloor(r.reading.limitingScore + r.need)).toBe(true);
    }
    expect(inst.radarReading([3.8, 1.9, 3.2, 3.0]).need).toBe(1.2);
  });

  test("asymmetry presets", () => {
    for (const p of inst.ASYM_PRESETS) expect(inst.asymmetryReading(p.value).friction).toBe(engine.frictionCoefficient(p.value.a, p.value.b));
    expect(inst.ASYM_PRESETS.map((p) => inst.asymmetryReading(p.value).friction)).toEqual([0.5, 0.71, 1, 0]);
  });

  test("timeline presets", () => {
    for (const p of inst.TIMELINE_PRESETS) {
      const steps = inst.timelineSteps(p.value);
      const shocks = inst.timelineShocks(p.value.size);
      expect(steps.length).toBe(shocks.length + 1);
      for (const st of steps) {
        expect(st.rupture).toBe(engine.ruptureIndex(p.value.observed, engine.inscribedRuptureLoad(shocks.slice(0, st.t), 0), engine.TREND_MULT[p.value.trend]));
        const lambda = instruments.decayHorizon({ interpersonal: 3, communal: 3, intergenerational: 3, institutional: 3 }, p.value.exposure, st.rupture!, 0).lambda;
        expect(st.lambda).toBe(Math.round(lambda * 10000) / 10000);
      }
    }
    expect(inst.timelineSteps(inst.TIMELINE_PRESETS[4].value).at(-1)!.rupture).toBeGreaterThanOrEqual(60);
  });

  test("escrow presets: engine output, shares summing to 100 and conservation", () => {
    for (const p of inst.ESCROW_PRESETS) {
      const r = inst.escrowReading(p.value);
      const e = instruments.escrowWaterfall(p.value.terms, p.value.input);
      expect([r.released, r.frozen, r.gross, r.clawbackHeld, r.bondHeld]).toEqual([e.released, e.frozen, e.gross, e.clawbackHeld, e.bondHeld]);
      expect(p.value.terms.shares.reduce((a, b) => a + b, 0)).toBe(100);
      expect(r.balanced).toBe(true);
      expect(r.conserved).toBe(true);
    }
    expect(inst.ESCROW_PRESETS.map((p) => inst.escrowReading(p.value).released)).toEqual([17.5, 40, 100, 0, 31]);
    expect(inst.escrowReading(inst.ESCROW_PRESETS[3].value).frozen).toBe(true);
  });

  test("the escrow freeze triggers at exactly R = 60", () => {
    const at = (rupture: number) => inst.escrowReading({ ...inst.ESCROW_DEFAULT, input: { ...inst.ESCROW_DEFAULT.input, rupture } });
    expect(at(59).frozen).toBe(false);
    expect(at(60).frozen).toBe(true);
    expect(at(60).released).toBe(0);
    expect(instruments.ESCROW_FREEZE).toBe(60);
  });

  test("dominum presets and the phase lift", () => {
    for (const p of inst.DOMINUM_PRESETS) {
      const d = engine.dominumIndex({ bonds: { interpersonal: p.value.bonds[0], communal: p.value.bonds[1], intergenerational: p.value.bonds[2], institutional: p.value.bonds[3] }, escrowReleasedPercent: p.value.released, escrowFrozen: p.value.frozen, survivalScore: p.value.survival, rupture: p.value.rupture });
      expect(inst.dominumReadingOf(p.value)).toEqual(d as engine.DominumReading);
    }
    expect(inst.DOMINUM_PRESETS.map((p) => inst.dominumReadingOf(p.value).index)).toEqual([76, 56, 79.8, 25, 68.7]);
    expect(inst.dominumLift(inst.DOMINUM_PRESETS[0].value).top).toBe(true);
    const floor = inst.dominumLift(inst.DOMINUM_PRESETS[2].value);
    expect(floor.best).toMatchObject({ id: "bond", steps: 1, to: "raise to 3.1" });
    expect(inst.dominumLift(inst.DOMINUM_PRESETS[1].value).levers.find((l) => l.id === "freeze")?.steps).toBe(1);
  });

  test("forum presets", () => {
    for (const p of inst.FORUM_PRESETS) for (const row of inst.forumRows(p.value)) expect(row.r).toEqual(instruments.forumFitness(row.f, p.value));
    expect(inst.forumRows(inst.FORUM_PRESETS[0].value).map((x) => x.r.fitness)).toEqual([54, 48, 46, 44, 42, 40, 20]);
    expect(inst.forumRows(inst.FORUM_PRESETS[3].value).find((x) => x.f.id === "pca")!.r.fitness).toBe(74);
  });

  test("inputs clamp to the engine's valid ranges", () => {
    expect(inst.clampStep(7, 1, 5, 0.1)).toBe(5);
    expect(inst.clampStep(0.2, 1, 5, 0.1)).toBe(1);
    expect(inst.clampStep(3.04, 1, 5, 0.1)).toBe(3);
    expect(inst.clampStep(Number.NaN, 0, 100, 1)).toBe(0);
    expect(inst.clampStep(101, 0, 100, 1)).toBe(100);
    expect(inst.RANGES.bond).toEqual({ min: 1, max: 5, step: 0.1 });
  });

  test.each(["radar", "asymmetry", "timeline", "escrow", "dominum", "forum"] as AcademyInstrumentKind[])("%s carries presets, a verdict, the working, live readouts and copy settings", (kind) => {
    const html = renderToStaticMarkup(createElement(AcademyInstrument, { kind }));
    for (const id of ["instrument-presets", "instrument-verdict", "instrument-working", "aria-live=\"polite\"", "Copy settings", "@container", "Reset"]) expect({ kind, id, present: html.includes(id) }).toEqual({ kind, id, present: true });
  });
});
