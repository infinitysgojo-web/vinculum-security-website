// The rest of the 13-point suite: shock timeline, formula proofs, doctrinal breviary,
// redaction shroud, executive summary, three-tier export pouch, and the doctrine rules
// (no network, no new routes, single bus).
import { describe, expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { applyInscriptions, inscribedRuptureLoad, ruptureIndex, type Signals } from "../src/components/desk/engine";
import { compoundStress, compoundTimeline, firstTrips, inscriptionTimeline, successionTimeline, type DeskShock } from "../src/components/desk/shockTimeline";
import { decayProof, escrowProof, forumProof, fractureProof, halfLifeProof } from "../src/components/desk/formulaProofs";
import { DEFAULT_ESCROW, FORUMS, decayHorizon, escrowWaterfall, forumFitness, fractureWindow } from "../src/components/desk/instruments";
import { DOCTRINES, segmentDoctrines } from "../src/content/doctrines";
import { LABEL_ARTICLE, LABEL_ENVOY, LABEL_STATE_ALPHA, LABEL_STATE_BRAVO, LABEL_THIRD_PARTY, maskText, shroudDictionary, splitParties } from "../src/components/desk/privacyShroud";
import { execSummary, missionSlug, radarPoints, readinessGates } from "../src/components/desk/executiveBrief";
import { CABLE_WIDTH, MANIFEST_FORMAT, buildManifest, diplomaticCable, telegraphic, verifyManifest } from "../src/components/desk/DiplomaticCableExport";
import { canonicalJson } from "../src/components/desk/registry";

const bonds = { interpersonal: 3.8, communal: 1.2, intergenerational: 2.5, institutional: 4.1 };
const shock = (id: string, d: Partial<typeof bonds>) => ({ id, name: id, description: "", deltas: { interpersonal: 0, communal: 0, intergenerational: 0, institutional: 0, ...d } });

describe("shock timeline scrubber", () => {
  const desk: DeskShock[] = [
    { id: "principal", label: "Principal removal", sev: 26, bond: 0 },
    { id: "s1", label: "Drought [INSCRIBED]", sev: 18, bond: 1, inscribed: true },
    { id: "donor", label: "Donor withdrawal", sev: 18, bond: 3 },
  ];
  const bus: Signals = { bonds, rupture: 0, ruptureBase: 30, trendMultiplier: 1.15, unmitigatedExposure: 40, customShocks: [shock("s1", { communal: -0.6, intergenerational: -0.4 })] };
  bus.rupture = ruptureIndex(30, inscribedRuptureLoad(bus.customShocks!, 0), 1.15);

  test("T0 is the baseline and TN is exactly the desk's own compound reading", () => {
    const live = [3.8, 1.2, 2.5, 4.1];
    const steps = compoundTimeline(bus, desk, live, 15);
    expect(steps).toHaveLength(4);
    expect(steps[0].bonds).toEqual([3.8, 1.2, 2.5, 4.1]);
    const full = compoundStress(desk, live, 15);
    expect(steps[3].bonds).toEqual(full.bondScores);
    expect(steps[3].strain).toBe(full.strain);
    expect(full.strain).toBe(Math.min(100, 26 + 18 + 18 + 2 * 1.25 * 4 + 15));
  });

  test("R follows the Sentinel rule: only inscribed shocks add load, so TN equals the bus rupture", () => {
    const steps = compoundTimeline(bus, desk, [3.8, 1.2, 2.5, 4.1], 0);
    expect(steps[0].rupture).toBe(ruptureIndex(30, 0, 1.15)); // 35
    expect(steps[1].rupture).toBe(steps[0].rupture); // a registered shock carries no rupture load
    expect(steps[2].rupture).toBe(bus.rupture!); // 30 + 5 = 35 × 1.15 = 40.25 → 40
    expect(steps[3].rupture).toBe(bus.rupture!);
  });

  test("λ, t½ and t_f are re-evaluated per step and match the instruments", () => {
    const steps = compoundTimeline(bus, desk, [3.8, 1.2, 2.5, 4.1], 0);
    for (const s of steps) {
      const lam = (40 + (s.rupture ?? 0)) / 2000;
      expect(s.lambda).toBe(Math.round(lam * 10000) / 10000);
      expect(s.halfLifeDays).toBe(Math.round((Math.LN2 / lam) * 10) / 10);
      expect(s.fractureDays).toBe(fractureWindow(s.bonds.reduce((a, b) => a + b, 0) / 4, lam).days);
    }
  });

  test("flags the exact step a threshold is first reached: sovereign floor 1.0, R ≥ 40 provisional pleadings, R ≥ 60 escrow freeze", () => {
    const steps = compoundTimeline(bus, desk, [3.8, 1.2, 2.5, 4.1], 0);
    const trips = firstTrips(steps);
    expect(trips.PROVISIONAL_PLEADINGS).toBe(2);
    expect(trips.SOVEREIGN_FLOOR).toBe(2); // communal 1.2 − 1.8 → floored at 1.0
    expect(trips.ESCROW_FREEZE).toBeUndefined();
    const hot = compoundTimeline({ ...bus, ruptureBase: 55, trendMultiplier: 1 }, desk, [3.8, 1.2, 2.5, 4.1], 0);
    expect(firstTrips(hot).ESCROW_FREEZE).toBe(2);
    expect(hot[0].tripped).toContain("PROVISIONAL_PLEADINGS"); // already tripped at T0
  });

  test("bus timeline: inscribed shocks one at a time, TN equal to applyInscriptions", () => {
    const raw: Signals = { bonds, ruptureBase: 30, trendMultiplier: 1, customShocks: [shock("a", { communal: -0.5 }), shock("b", { communal: -0.5, institutional: -1 })] };
    const steps = inscriptionTimeline(raw);
    const eff = applyInscriptions(raw).bonds!;
    expect(steps[2].bonds).toEqual([eff.interpersonal, eff.communal, eff.intergenerational, eff.institutional]);
    expect(steps[1].bonds[1]).toBe(1.0);
    expect(steps[2].rupture).toBe(ruptureIndex(30, inscribedRuptureLoad(raw.customShocks!, 0), 1));
    expect(inscriptionTimeline({})).toEqual([]);
  });

  test("succession timeline: U accumulates (a quarter when insulated) and TN λ equals the Decay Horizon", () => {
    const s: Signals = { bonds, rupture: 48 };
    const steps = successionTimeline(s, [
      { id: "principal", label: "Principal", sev: 26, insulated: true },
      { id: "donor", label: "Donor", sev: 18, insulated: false },
    ]);
    expect(steps.map((x) => x.exposure)).toEqual([0, 6.5, 24.5]);
    expect(steps[2].lambda).toBe(Math.round(decayHorizon(bonds, 24.5, 48, 180).lambda * 10000) / 10000);
    expect(steps[0].tripped).toContain("PROVISIONAL_PLEADINGS");
  });
});

describe("inline formula proofs", () => {
  test("decay, half-life and fracture proofs reproduce the instruments", () => {
    const d = decayProof(32.5, 48);
    expect(d.result).toBe(`λ = ${(80.5 / 2000).toFixed(4)} per day`);
    expect(d.citation).toContain("Part V §5.1");
    expect(halfLifeProof(0.04025).result).toBe(`t½ = ${(Math.LN2 / 0.04025).toFixed(1)} days`);
    expect(halfLifeProof(0).result).toBe("t½ = ∞");
    const w = fractureWindow(2.9, 0.04025);
    expect(fractureProof(2.9, 0.04025).result).toBe(`t_f = ${w.days} days (${w.months} months, ${w.severity})`);
    expect(fractureProof(1.9, 0.04).result).toContain("t_f = 0 days");
  });

  test("forum proof: E, the −18 immunity and −8 seat deductions, fitness and friction", () => {
    for (const f of FORUMS)
      for (const t of [{ immunityWaived: false, neutralSeat: false }, { immunityWaived: true, neutralSeat: true }]) {
        const r = forumFitness(f, t);
        const p = forumProof(f, t);
        expect(p.result).toBe(`F = ${r.fitness} of 100 · friction ${r.friction}`);
        expect(p.substitution).toContain(`max(0, ${r.base} − ${r.immunity} − ${r.seat})`);
      }
    expect(forumProof(FORUMS[0], { immunityWaived: false, neutralSeat: false }).steps.join(" ")).toContain("−18");
  });

  test("escrow proof: tranche chain, reserves and the R ≥ 60 freeze", () => {
    const input = { verifierSeated: true, communal: 3.4, institutional: 3.2, intergenerational: 2.5, trackGap: 0, trackTolerance: 1, survivalScore: 50, rupture: 20 };
    const r = escrowWaterfall(DEFAULT_ESCROW, input);
    expect(escrowProof(DEFAULT_ESCROW, input).result).toBe(`Released = ${r.released}% of 100%`);
    const frozen = escrowProof(DEFAULT_ESCROW, { ...input, rupture: 60 });
    expect(frozen.result).toBe("Released = 0% of 100% (frozen)");
    expect(frozen.steps.join(" ")).toContain("R = 60 ≥ 60");
  });
});

describe("doctrinal breviary", () => {
  test("every doctrine carries a term, a plain meaning and a primary-source citation", () => {
    for (const d of DOCTRINES) {
      expect(d.term.length).toBeGreaterThan(3);
      expect(d.meaning.split(/[.!?]\s/).length).toBeLessThanOrEqual(3);
      expect(d.citation).toMatch(/Convention|Statute|ICJ Reports|Commission|Resolution/);
    }
  });

  test("terms are segmented in text, most specific match first", () => {
    const segs = segmentDoctrines("Recognition may be refused under the New York Convention Art. V; pacta sunt servanda and VCLT Art. 62 apply.");
    const hits = segs.filter((s) => s.doctrine).map((s) => s.doctrine!.id);
    expect(hits).toEqual(["new-york-convention-v", "pacta-sunt-servanda", "rebus-sic-stantibus"]);
    expect(segs.map((s) => s.text).join("")).toBe("Recognition may be refused under the New York Convention Art. V; pacta sunt servanda and VCLT Art. 62 apply.");
    expect(segmentDoctrines("No doctrine here.")).toEqual([{ text: "No doctrine here." }]);
  });
});

describe("presentation privacy mask", () => {
  const dict = shroudDictionary({
    theatre: "Great Lakes Cross-Border Corridor",
    parties: "Republic of Kivu; Federal State of Ruzizi; Regional Guarantor",
    officer: "Amb. Jane Doe",
    delegates: ["General Okoro"],
    covenants: ["Office continuity covenant"],
    restricted: ["Source in the ministry confirms the corridor plan"],
  });

  test("sovereigns, envoy, delegates, covenant articles and warrant text map to their labels", () => {
    expect(splitParties("A State; B State, C State and D State")).toEqual(["A State", "B State", "C State", "D State"]);
    const t = maskText("Republic of Kivu and Federal State of Ruzizi met Regional Guarantor; Amb. Jane Doe briefed General Okoro on the Office continuity covenant.", dict);
    expect(t).toBe(`${LABEL_STATE_ALPHA} and ${LABEL_STATE_BRAVO} met ${LABEL_THIRD_PARTY}; ${LABEL_ENVOY} briefed [DELEGATE 01] on the ${LABEL_ARTICLE}.`);
    expect(maskText("Source in the ministry confirms the corridor plan", dict)).toBe("[RESTRICTED OPERATIONAL TEXT - PRIVILEGED]");
  });

  test("scores, indices and formulas stay visible", () => {
    const t = "R = 48% · λ = 0.0403 · B = (3.8, 1.2, 2.5, 4.1) · t½ = 17.2 days";
    expect(maskText(t, dict)).toBe(t);
    expect(shroudDictionary({ theatre: "48", officer: "3.8" })).toEqual([]);
  });

  test("case-insensitive, whitespace-tolerant, and the shroud never touches inputs or the palette", () => {
    expect(maskText("republic   of KIVU", dict)).toBe(LABEL_STATE_ALPHA);
    const ctx = readFileSync("src/components/desk/PrivacyContext.tsx", "utf8");
    expect(ctx).toContain("textarea,input,select");
    expect(readFileSync("src/components/CommandPalette.tsx", "utf8")).toContain("data-shroud-keep");
    expect(readFileSync("src/index.css", "utf8")).toContain("html.vs-shroud textarea:not([data-shroud-keep])");
  });
});

describe("executive summary and the three-tier pouch", () => {
  const signals: Signals = { bonds, rupture: 48, ruptureBand: "Elevated", unmitigatedExposure: 32.5, survivalScore: 54.4, covenants: ["A (Independent Trustee)", "B (Sunset Audit)"], shocks: ["Drought"], redlineFlags: 1, customGates: [{ id: "g", label: "Census", verified: false }] };
  const m = execSummary({ title: "Northern Rift Mission", theatre: "Northern Rift", parties: "State A; State B", envoy: "Envoy A", classification: "Restricted", signals, openQuestions: 2, baselineCovenants: ["A (Independent Trustee)"], assessedAt: new Date("2026-01-02T03:04:00.000Z") });

  test("six evidentiary readiness gates: the five stage gates plus Evidentiary Hygiene", () => {
    const g = readinessGates(signals, 2);
    expect(g.map((x) => x.name)).toEqual(["Vector Integrity", "Rupture Containment", "Track Synchronization", "Structural Covenants", "Succession Durability", "Evidentiary Hygiene"]);
    expect(g[5]).toMatchObject({ cleared: false });
    expect(readinessGates({ ...signals, customGates: [] }, 0)[5].cleared).toBe(true);
  });

  test("masthead, bonds, indices, contested covenants and the statutory notice", () => {
    expect(m.masthead).toMatchObject({ title: "Northern Rift Mission", assessedUtc: "2026-01-02 03:04 UTC", seal: "Not sealed" });
    expect(m.bonds.map((b) => b.score)).toEqual([3.8, 1.2, 2.5, 4.1]);
    expect(m.exposure).toBe(32.5);
    expect(m.covenants).toEqual([{ text: "A (Independent Trustee)", contested: false }, { text: "B (Sunset Audit)", contested: true }]);
    expect(m.notice).toContain("All statutory rights reserved.");
    expect(m.notice).not.toMatch(/©|\b20\d\d\b/);
    expect(radarPoints([5, 5, 5, 5], 100, 10)[0]).toEqual({ x: 50, y: 10 });
  });

  test("cable: 7-bit ASCII, at most 69 columns, Note Verbale formulas, ZCZC … NNNN", () => {
    const c = diplomaticCable(m, { digest: "a".repeat(64) });
    const lines = c.trimEnd().split("\n");
    expect(lines[0]).toBe("ZCZC");
    expect(lines[lines.length - 1]).toBe("NNNN");
    for (const l of lines) {
      expect(l.length).toBeLessThanOrEqual(CABLE_WIDTH);
      expect(/^[\x20-\x7E]*$/.test(l)).toBe(true);
    }
    const flat = c.replace(/\s+/g, " ");
    expect(flat).toContain("PRESENTS ITS COMPLIMENTS AND HAS THE HONOUR TO TRANSMIT");
    expect(flat).toContain("RENEW THE ASSURANCES OF ITS HIGHEST CONSIDERATION");
    expect(c).toContain("REF MANIFEST SHA-256");
    expect(telegraphic("λ ≥ 0.5 — Ω")).toBe("LAMBDA >= 0.5 - OMEGA");
  });

  test("manifest: top-level SHA-256 over the canonical body; any tamper fails verification", async () => {
    const man = await buildManifest({
      format: MANIFEST_FORMAT,
      mission: { slug: missionSlug("Northern Rift Mission"), title: "Northern Rift Mission", theatre: "Northern Rift", parties: "", envoy: "", classification: "", sessionId: "ws_1" },
      generatedAt: "2026-01-02T03:04:00.000Z",
      summary: m,
      signals,
      decisions: [],
      workspace: null,
      files: ["northern-rift-mission-manifest.json", "northern-rift-mission-briefing.pdf", "northern-rift-mission-cable.txt"],
    });
    const { integrity, ...body } = man;
    expect(integrity.hash).toBe(createHash("sha256").update(canonicalJson(body), "utf8").digest("hex"));
    expect(await verifyManifest(man)).toBe(true);
    expect(await verifyManifest({ ...man, signals: { ...signals, rupture: 47 } })).toBe(false);
    expect(missionSlug("Ñorthern Rift: Phase II / Draft")).toBe("northern-rift-phase-ii-draft");
    expect(missionSlug("  ")).toBe("vinculum-mission");
  });

  test("print stylesheet: one portrait sheet, 0.5 in margins, exact colours, no breaks inside blocks", () => {
    const css = readFileSync("src/index.css", "utf8");
    expect(css).toContain("@page vs-exec { size: portrait; margin: 0.5in; }");
    expect(css).toContain("print-color-adjust: exact !important");
    expect(css).toMatch(/\.vs-exec-block \{ break-inside: avoid; page-break-inside: avoid; \}/);
  });
});

describe("doctrine rules hold for the new code", () => {
  const NEW = [
    "src/components/desk/busMonitor.ts", "src/components/desk/handoverSeal.ts", "src/components/desk/shockTimeline.ts", "src/components/desk/formulaProofs.ts",
    "src/components/desk/privacyShroud.ts", "src/components/desk/executiveBrief.ts", "src/components/desk/DiplomaticCableExport.ts", "src/components/desk/ChancelleryWire.tsx",
    "src/components/desk/HandoverSealBadge.tsx", "src/components/desk/ShockTimelineScrubber.tsx", "src/components/desk/FormulaProof.tsx", "src/components/desk/PrivacyContext.tsx",
    "src/components/desk/ExecutiveSummary.tsx", "src/components/desk/ExecutiveSummaryPdf.tsx", "src/components/CommandPalette.tsx", "src/components/commandIndex.ts",
    "src/components/DoctrinalTooltip.tsx", "src/content/doctrines.ts", "src/components/mode/RehearsalDrawer.tsx", "src/components/mode/postureBranches.ts", "src/hooks/useSovereignHotkeys.ts",
  ];

  test("zero cloud egress: no fetch, XHR, beacon, websocket or remote URL", () => {
    for (const f of NEW) {
      const s = readFileSync(f, "utf8");
      expect(s).not.toMatch(/\bfetch\(|XMLHttpRequest|sendBeacon|WebSocket|EventSource|https?:\/\//);
    }
  });

  test("zero new routes and no history manipulation", () => {
    for (const f of NEW) expect(readFileSync(f, "utf8")).not.toMatch(/<Route|useNavigate|navigate\(|history\.(push|replace)State|location\.(href|assign)/);
    // The route table is unchanged: fifteen routes, and /dashboard hosts every surface.
    const app = readFileSync("src/App.tsx", "utf8");
    expect((app.match(/<Route /g) ?? []).length).toBe(15);
  });

  test("single deterministic bus: no new component publishes, and desks never import a sibling desk", () => {
    for (const f of NEW) expect(readFileSync(f, "utf8")).not.toMatch(/usePublish\(/);
    const deskFiles = ["CompoundShockTester", "SuccessionSimulator", "SentinelMatrix", "MultiPartySequencer", "ReadinessDesk", "ClauseRedliner"];
    for (const d of deskFiles) {
      const s = readFileSync(`src/components/desk/${d}.tsx`, "utf8");
      for (const other of deskFiles.filter((x) => x !== d)) expect(s).not.toContain(`from "./${other}"`);
    }
  });

  test("the Sentinel stays the only owner of idle timers and panic keys", () => {
    for (const f of NEW) {
      const s = readFileSync(f, "utf8");
      expect(s).not.toMatch(/executePanicPurge|ctrlKey && e\.shiftKey|visibilitychange|"mousemove"|"pointermove"/);
    }
  });
});
