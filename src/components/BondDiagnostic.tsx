import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { CASES } from "@/content/cases";
import { usePublish, useEngine, bondBand, clampScore, mathReading, rankCases, inscribedShockDelta, relationalDynamics, stageGateAudit } from "@/components/desk/engine";
import DeskOutput from "@/components/desk/DeskOutput";
import { useMission } from "@/components/desk/mission";
import BondMathPanel from "@/components/desk/BondMathPanel";
import RelationalDynamicsPanel from "@/components/desk/RelationalDynamicsPanel";

/**
 * Interactive Relational Bond Diagnostic Bench.
 *
 * Runs entirely in the browser. Nothing entered here is stored or transmitted.
 * Scale, level names, descriptive anchors, and boundary rules follow the
 * doctrine (Sections III.D, V.E, VI) and the handbook (Part IV).
 */
type LevelKey = "interpersonal" | "communal" | "intergenerational" | "institutional";
export type BondScores = Record<LevelKey, number>;

/** Optional controlled mode: the dashboard owns the scores so presets and archives reach the bench. */
interface BondDiagnosticProps {
  /** Stress-testing modules rendered between the analysis tier and the transmittal console. */
  stress?: ReactNode;
  /** Delta simulator, seated in its own full-width landscape workbench. */
  simulator?: ReactNode;
  scores?: BondScores;
  onScoresChange?: (scores: BondScores) => void;
}

const DEFAULT_SCORES: BondScores = {
  interpersonal: 3.0,
  communal: 3.0,
  intergenerational: 3.0,
  institutional: 3.0,
};

/** Calibrated working theatres used in test missions (bonds only; illustrative, not field findings). */
const SEEDS: { label: string; scores: BondScores }[] = [
  { label: "Great Lakes test mission", scores: { interpersonal: 2.8, communal: 1.4, intergenerational: 1.8, institutional: 2.2 } },
  { label: "Northern Rift test mission", scores: { interpersonal: 2.6, communal: 1.6, intergenerational: 2.1, institutional: 2.5 } },
  { label: "Flat 3.0 baseline", scores: DEFAULT_SCORES },
];
const LEVELS: {
  key: LevelKey;
  ref: string;
  name: string;
  question: string;
  guidance: string;
}[] = [
  {
    key: "interpersonal",
    ref: "III.D.I",
    name: "Interpersonal",
    question: "Would this relationship survive a bad-faith moment intact?",
    guidance:
      "Name the two counterparts whose trust the process actually rests on, and test that trust deliberately before the table needs it. Where the bond is thin, build a lower-stakes exchange first rather than assuming position or protocol will carry it.",
  },
  {
    key: "communal",
    ref: "III.D.II",
    name: "Communal",
    question: "Does this actor's authority survive contact with the community, not just the institution?",
    guidance:
      "Treat standing to speak for a community as a claim to be tested, not a credential to be assumed. Verify that a delegate would still be recognised by the sending community on return, and record who would not recognise them.",
  },
  {
    key: "intergenerational",
    ref: "III.D.III",
    name: "Intergenerational",
    question: "Are youth present at the table, or only in the room?",
    guidance:
      "Count standing, not attendance. Ask whether a young delegate's place would survive the funding cycle, political moment, or personal relationship that created it, and give elders a formal role in verifying that knowledge and standing have actually been passed on.",
  },
  {
    key: "institutional",
    ref: "III.D.IV",
    name: "Institutional-Relational",
    question: "Would this bond survive a change in personnel or office?",
    guidance:
      "Design for succession. Write a continuity provision into the agreement itself, a clause or mechanism built specifically to survive a change in the officeholders who negotiated it, so the outcome does not depend on anyone's tenure or goodwill.",
  },
];

/** Scores are decimal (0.1 steps); the descriptive anchor follows the nearest whole level. */
const anchorFor = (v: number) => ANCHORS[Math.min(5, Math.max(1, Math.round(v)))];

const ANCHORS: Record<number, { label: string; text: string }> = {
  1: {
    label: "Severed",
    text: "Absent, broken, or actively hostile. No functioning channel of relationship exists between the parties.",
  },
  2: {
    label: "Nominal",
    text: "Exists in form, such as a signed provision or a consultative body, with little evidence of substantive trust or durability under stress.",
  },
  3: {
    label: "Contested",
    text: "Credible evidence on both sides: genuine relational progress in some respects, documented gaps or unresolved grievance in others.",
  },
  4: {
    label: "Tested",
    text: "Tested by at least one significant setback or transition and has held, though some vulnerability remains.",
  },
  5: {
    label: "Durable",
    text: "Tested repeatedly over an extended period, including through leadership transitions or major shocks, with continuity independent of any single individual.",
  },
};

const BOUNDARY_RULES = [
  "Children are a protected party. Their participation is never scored as a bond, and age-appropriate participation is admissible only where a mandated child-protection framework is already in force.",
  "A government never assesses its own institutional-relational bond. That score requires an independent rater.",
  "A bond score never substitutes for a factual determination of a protection obligation.",
  "Meaningful participation is tested against outcomes, not headcount. Gendered harm is named explicitly in the bond map.",
];

/* ---------- radar geometry ---------- */

const SIZE = 260;
const C = SIZE / 2;
const R = 92;

function point(index: number, value: number) {
  const angle = (Math.PI * 2 * index) / 4 - Math.PI / 2;
  const radius = (value / 5) * R;
  return [C + radius * Math.cos(angle), C + radius * Math.sin(angle)] as const;
}

function ring(value: number) {
  return [0, 1, 2, 3]
    .map((i) => point(i, value).join(","))
    .join(" ");
}

/* ---------- decimal score controls: nudge, numeric entry, quick-select chips ---------- */

/** Canonical test scores, one tap each. */
const QUICK_SCORES: { v: number; label: string }[] = [
  { v: 1.0, label: "Severed" },
  { v: 1.4, label: "Worked Ex." },
  { v: 2.0, label: "Failing" },
  { v: 2.6, label: "Contested" },
  { v: 3.1, label: "Viable" },
  { v: 4.0, label: "Tested" },
  { v: 5.0, label: "Durable" },
];

const nudgeCls =
  "inline-flex items-center justify-center min-h-11 min-w-11 px-2 border border-brass/60 bg-background font-mono text-xs font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-35 disabled:hover:border-brass/60 disabled:hover:text-primary transition-colors";

function ScoreInput({ id, value, onChange, name }: { id: string; value: number; onChange: (v: number) => void; name: string }) {
  const [draft, setDraft] = useState(value.toFixed(1));
  // Follow outside changes (slider, nudge, chips, presets, archives) without
  // overwriting a decimal the analyst is still typing, such as "2." or "2.65".
  useEffect(() => {
    const typed = parseFloat(draft);
    if (Number.isNaN(typed) || clampScore(typed) !== value) setDraft(value.toFixed(1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  const commit = () => {
    const n = parseFloat(draft);
    if (Number.isNaN(n)) return setDraft(value.toFixed(1));
    const v = clampScore(n);
    onChange(v);
    setDraft(v.toFixed(1));
  };
  const nudge = (delta: number) => {
    const v = clampScore(value + delta);
    onChange(v);
    setDraft(v.toFixed(1));
  };
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        aria-label={`Lower the ${name} bond score by 0.1`}
        onClick={() => nudge(-0.1)}
        disabled={value <= 1}
        className={nudgeCls}
      >
        −0.1
      </button>
      <input
        id={id}
        aria-label={`${name} bond score, numeric entry, 1.0 to 5.0`}
        type="number"
        inputMode="decimal"
        min={1}
        max={5}
        step={0.1}
        value={draft}
        onChange={(e) => {
          setDraft(e.target.value);
          const n = parseFloat(e.target.value);
          if (!Number.isNaN(n) && n >= 1 && n <= 5) onChange(clampScore(n));
        }}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && commit()}
        className="w-20 min-h-11 bg-background border border-border px-2 py-1.5 text-center font-serif text-xl text-accent leading-none focus:outline-none focus:border-accent"
      />
      <button
        type="button"
        aria-label={`Raise the ${name} bond score by 0.1`}
        onClick={() => nudge(0.1)}
        disabled={value >= 5}
        className={nudgeCls}
      >
        +0.1
      </button>
    </div>
  );
}

function QuickScores({ name, value, onPick }: { name: string; value: number; onPick: (v: number) => void }) {
  return (
    <div className="mt-3 flex flex-wrap gap-1.5 min-w-0" role="group" aria-label={`Quick-select scores for ${name}`}>
      {QUICK_SCORES.map((q) => {
        const on = Math.abs(value - q.v) < 0.001;
        return (
          <button
            key={q.v}
            type="button"
            aria-pressed={on}
            onClick={() => onPick(q.v)}
            className={`min-h-9 px-2.5 border text-[10px] font-semibold uppercase tracking-[0.12em] transition-colors ${
              on
                ? "bg-accent text-accent-foreground border-accent"
                : "border-brass/50 text-primary hover:border-accent hover:text-accent"
            }`}
          >
            <span className="font-mono">{q.v.toFixed(1)}</span> {q.label}
          </button>
        );
      })}
    </div>
  );
}

/* ---------- component ---------- */

export default function BondDiagnostic({ scores: controlled, onScoresChange, stress, simulator }: BondDiagnosticProps = {}) {
  const mission = useMission();
  const [context, setContext] = useState(mission.theatre);
  // Follow the Mission Vault when the active theatre changes.
  useEffect(() => setContext(mission.theatre), [mission.theatre]);
  // Controlled when `scores` is passed; otherwise it keeps its own state as before.
  const [internal, setInternal] = useState<BondScores>(DEFAULT_SCORES);
  const scores = controlled ?? internal;
  const setScores = (update: (s: BondScores) => BondScores) => {
    const next = update(scores);
    if (!controlled) setInternal(next);
    onScoresChange?.(next);
  };

  const values = LEVELS.map((l) => scores[l.key]) as [number, number, number, number];
  const mean = values.reduce((a, b) => a + b, 0) / 4;
  const reading = useMemo(() => mathReading(values), [values.join(",")]);

  const weakest = useMemo(() => {
    let w = LEVELS[0];
    for (const l of LEVELS) if (scores[l.key] < scores[w.key]) w = l;
    return w;
  }, [scores]);

  const spread = Math.round((Math.max(...values) - Math.min(...values)) * 10) / 10;

  const standing = useMemo(() => {
    if (mean < 2) return { label: "Fractured", note: "The relational base is not carrying the process. Formal progress made now will rest on bonds that are not there." };
    if (mean < 3) return { label: "Degraded", note: "Form exists ahead of substance. The arrangement is likely to hold only while conditions stay favourable." };
    if (mean < 4) return { label: "Contested", note: "Real repair in some places, unresolved grievance in others. The reading depends on which bond you look at." };
    if (mean < 4.6) return { label: "Stabilised", note: "The bonds have taken a shock and held. Vulnerability remains where the reading is uneven." };
    return { label: "Reconstituted", note: "Durable across transitions and independent of any single officeholder." };
  }, [mean]);

  // Publish the reading onto the mission engine for every downstream desk.
  usePublish("diagnostics", {
    bonds: {
      interpersonal: scores.interpersonal,
      communal: scores.communal,
      intergenerational: scores.intergenerational,
      institutional: scores.institutional,
    },
    bondMean: Math.round(mean * 100) / 100,
    weakestBond: weakest.name,
    weakestScore: scores[weakest.key],
    weakestBand: bondBand(scores[weakest.key]),
    bondVariance: reading.variance,
    communalBand: bondBand(scores.communal),
    standing: standing.label,
  });

  // Ghost target projection: a what-if remediation drawn beside the live vector.
  // It reads the live bus (shocks, friction, rupture, trend) and changes nothing until applied.
  const { signals: bus } = useEngine();
  const [simulate, setSimulate] = useState(false);
  const [targetKey, setTargetKey] = useState<LevelKey | null>(null);
  const [lift, setLift] = useState(1.0);
  const tKey = targetKey ?? weakest.key;
  const target: BondScores = { ...scores, [tKey]: clampScore(scores[tKey] + lift) };
  const projection = useMemo(() => {
    if (!simulate) return null;
    const asBonds = (b: BondScores) => ({ interpersonal: b.interpersonal, communal: b.communal, intergenerational: b.intergenerational, institutional: b.institutional });
    const base = relationalDynamics({ ...bus, bonds: asBonds(scores) });
    const next = relationalDynamics({ ...bus, bonds: asBonds(target) });
    const gateNow = stageGateAudit({ ...bus, bonds: asBonds(scores) }).gates[0];
    const gateNext = stageGateAudit({ ...bus, bonds: asBonds(target) }).gates[0];
    return {
      contagion: base && next ? Math.round((next.contagion - base.contagion) * 10) / 10 : 0,
      deficit: base && next ? Math.round((next.deficit - base.deficit) * 10) / 10 : 0,
      gateNow: gateNow.passed,
      gateNext: gateNext.passed,
      applied: Math.round((target[tKey] - scores[tKey]) * 10) / 10,
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [simulate, bus, scores, tKey, lift]);

  /** Doctrinal band labels used in the dossier (Failing <2.0, Fragile 2.0-2.9, Viable 3.0-3.9, Fortified 4.0-5.0). */
  const dossierBand = (v: number) => (v < 2 ? "Failing" : v < 3 ? "Fragile" : v < 4 ? "Viable" : "Fortified");

  /** The active structural archetype, evaluated in order of severity. */
  const archetype = useMemo(() => {
    const { interpersonal: ip, communal: cm, intergenerational: ig, institutional: inst } = scores;
    if (values.every((v) => v < 2))
      return { name: "Systemic Bond Collapse", text: "Every bond reads Failing. No channel can carry a settlement; restore a single tested interpersonal channel before any formal process is attempted." };
    if ((ip >= 3 || inst >= 3) && cm < 2.5)
      return { name: "The Elite-Pact Mirage", text: "Elite or institutional bonds run ahead of communal standing. An agreement struck now will be signed above the community and disowned within it." };
    if (ig < 2.5 && mean >= 2.8)
      return { name: "Generational Cliff", text: "The successor generation holds no standing. The settlement may hold for its signatories and fail with their succession." };
    if (ip >= 3.5 && inst < 2.5)
      return { name: "Unanchored Repair", text: "Personal trust is real but no office carries it. The repair ends when the people who made it leave their posts." };
    if (inst >= 3.5 && (ip + cm + ig) / 3 < 2.5)
      return { name: "Bond Theater Risk", text: "Formal machinery outstrips the relationships it is meant to serve. Treat institutional scores as form until tested by a setback." };
    if (spread >= 1.5)
      return { name: "Uneven Continuum", text: `The reading is uneven by ${spread.toFixed(1)} points. A strong bond does not compensate for the limiting one.` };
    return { name: "No warning archetype engaged", text: "The four bonds move together within a 1.5-point spread. Continue monitoring the limiting bond." };
  }, [scores, values, mean, spread]);

  const customRules = useMemo(() => bus.customRules ?? [], [bus.customRules]);
  // When inscribed shocks are active the bus carries a stressed vector; show it beside the raw bench.
  const stressed =
    (bus.customShocks?.length ?? 0) > 0 && bus.bonds
      ? [bus.bonds.interpersonal, bus.bonds.communal, bus.bonds.intergenerational, bus.bonds.institutional].map((x) => x.toFixed(1))
      : null;

  // The vector the rest of the mission reads: the bench plus any inscribed shocks.
  // Computed here from the bench so it never lags a slider by a render.
  const shockCount = bus.customShocks?.length ?? 0;
  const liveVector = useMemo(() => {
    if (!shockCount) return values;
    const d = inscribedShockDelta(bus);
    return [
      clampScore(values[0] + d.interpersonal),
      clampScore(values[1] + d.communal),
      clampScore(values[2] + d.intergenerational),
      clampScore(values[3] + d.institutional),
    ] as [number, number, number, number];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values.join(","), shockCount, JSON.stringify(bus.customShocks ?? [])]);

  /** The three nearest documented cases to the live vector, closest first. Re-ranked on every change. */
  const topThree = useMemo(
    () =>
      rankCases(liveVector).flatMap((m) => {
        const c = CASES.find((x) => x.slug === m.slug);
        return c ? [{ c, m }] : [];
      }),
    [liveVector],
  );

  const summary = useMemo(() => {
    const bar = "-".repeat(64);
    const theatre = context.trim() || mission.theatre.trim() || "Unnamed theatre";
    const lines = [
      "VINCULUM SECURITY · OPERATIONAL RELATIONAL DOSSIER",
      "Desk 1 · Relational Bond Diagnostic",
      "",
      `THEATRE: ${theatre}`,
      `DRAFTING OFFICER: ${mission.officer.trim() || "Not recorded"}`,
      `CLASSIFICATION: ${mission.classification.trim() || "Unrestricted, working draft"}`,
      "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.",
      "",
      bar,
      "I. FOUR-BOND SCORES",
      bar,
      ...LEVELS.map(
        (l) => `  ${l.name} (§ ${l.ref}): ${scores[l.key].toFixed(1)} of 5 · ${dossierBand(scores[l.key])} · ${anchorFor(scores[l.key]).label}`
      ),
      `  State vector: (${values.map((v) => v.toFixed(1)).join(", ")})`,
      "",
      bar,
      "II. MATHEMATICAL DERIVATION",
      bar,
      `  Mean μ = ${mean.toFixed(2)} of 5 (standing: ${standing.label})`,
      `  Population variance σ² = ${reading.variance.toFixed(3)}`,
      `  Spread (max − min) = ${spread.toFixed(1)}`,
      `  Liebig limiting factor: ${weakest.name} at ${scores[weakest.key].toFixed(1)} (${dossierBand(scores[weakest.key])})`,
      "",
      bar,
      "III. STRUCTURAL DIAGNOSIS AND WARNING ARCHETYPE",
      bar,
      `  Active archetype: ${archetype.name}`,
      `  ${archetype.text}`,
      `  Standing note: ${standing.note}`,
      "",
      bar,
      "IV. HISTORICAL PRECEDENTS (Euclidean distance over the bond vector)",
      bar,
      ...(shockCount ? [`  Ranked against the live vector after ${shockCount} inscribed shock${shockCount === 1 ? "" : "s"}.`] : []),
      ...topThree.map(
        ({ c, m }, i) => `  ${i + 1}. ${c.shortTitle} (${c.scores.map((v) => v.toFixed(1)).join(", ")}) · distance ${m.distance.toFixed(2)} · resonance ${m.resonance}%`
      ),
      `  Pattern of nearest case: ${topThree[0]?.c.pattern ?? ""}`,
      "",
      bar,
      "V. BOUNDARY RULES AND PRACTICE DIRECTIVE",
      bar,
      `  Diagnostic question for the limiting bond: ${weakest.question}`,
      `  Practice directive: ${weakest.guidance}`,
      ...BOUNDARY_RULES.map((r) => `  · ${r}`),
      ...customRules.map((r) => `  · Sovereign inscription: ${r}`),
      ...(stressed ? [`  Bus vector after inscribed shocks: (${stressed.join(", ")})`] : []),
      "",
      "Assessed against Vinculum Security, A Doctrine of Relational Security, by James Wesley Ndua.",
      "Pro Omni Humanitate.",
    ];
    return lines.join("\n");
  }, [context, mission, scores, standing, mean, spread, weakest, reading, archetype, topThree, shockCount, values, customRules, stressed]);

  return (
    <section id="bench" className="scroll-mt-24">
      <FadeIn>
        <p className="eyebrow">§3B · Assessment Bench</p>
        <hr className="gold-rule mt-4 mb-6" />
        <p className="max-w-3xl text-foreground/85 mb-2">
          A working surface for the diagnostic method. Score each of the four continuum levels against the
          descriptive anchors, and the bench returns the standing of the relational base, the most exposed
          bond, the practice direction that follows from it, and the documented case whose profile sits
          closest to yours.
        </p>
        <p className="max-w-3xl text-sm italic text-muted-foreground mb-10">
          Nothing entered here leaves your device. No entry is saved, sent, or recorded anywhere.
        </p>
      </FadeIn>

      {/* Tier 1: working bench and primary gauge, balanced halves. */}
      <div className="diagnostic-layout grid grid-cols-1 gap-6 items-start w-full min-w-0 [&>*]:min-w-0">
        {/* ---- input column ---- */}
        <div className="bg-navy-tint border border-border p-4 sm:p-5 min-w-0 w-full max-w-full">
          <label htmlFor="bench-context" className="eyebrow block">
            Theatre or process
          </label>
          <input
            id="bench-context"
            type="text"
            value={context}
            onChange={(e) => setContext(e.target.value)}
            placeholder="Cross-border grazing dispute, second round"
            className="mt-3 w-full bg-background border border-border px-4 py-3 text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-accent transition-colors"
          />

          <div className="mt-6">
            <p className="eyebrow">Seed the bench</p>
            <p className="mt-1 text-xs text-muted-foreground">Start from a calibrated profile instead of the flat 3.0 baseline, then adjust.</p>
            <div className="mt-3 flex flex-wrap gap-1.5" role="group" aria-label="Seed bond scores from a profile">
              {SEEDS.map((s) => (
                <button key={s.label} type="button" onClick={() => setScores(() => s.scores)} className="min-h-9 px-2.5 border border-brass/50 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:border-accent hover:text-accent transition-colors">
                  {s.label}
                </button>
              ))}
              {CASES.map((c) => (
                <button key={c.slug} type="button" onClick={() => setScores(() => ({ interpersonal: c.scores[0], communal: c.scores[1], intergenerational: c.scores[2], institutional: c.scores[3] }))} className="min-h-9 px-2.5 border border-border text-[10px] font-semibold uppercase tracking-[0.12em] text-primary/80 hover:border-accent hover:text-accent transition-colors">
                  {c.shortTitle}
                </button>
              ))}
            </div>
          </div>

          <hr className="gold-rule gold-rule-short mt-8 mb-7" />

          <div className="instrument-pair mt-5">
            {LEVELS.map((l) => {
              const v = scores[l.key];
              return (
                <div key={l.key} className="min-w-0 border-t border-brass/40 pt-4">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-accent text-sm">§ {l.ref}</span>
                      <h4 className="font-serif text-primary">{l.name}</h4>
                    </div>
                    <ScoreInput
                      id={`bench-${l.key}`}
                      name={l.name}
                      value={v}
                      onChange={(n) => setScores((s) => ({ ...s, [l.key]: n }))}
                    />
                  </div>
                  <p className="mt-2 font-serif italic text-sm text-primary/80">{l.question}</p>

                  <input
                    aria-label={`${l.name} bond score, 1 to 5`}
                    type="range"
                    min={1}
                    max={5}
                    step={0.1}
                    value={v}
                    onChange={(e) =>
                      setScores((s) => ({ ...s, [l.key]: clampScore(Number(e.target.value)) }))
                    }
                    className="mt-4 w-full accent-[hsl(var(--accent))] cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                    <span>Severed</span>
                    <span>Durable</span>
                  </div>
                  <QuickScores
                    name={l.name}
                    value={v}
                    onPick={(n) => setScores((s) => ({ ...s, [l.key]: n }))}
                  />
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    <span className="font-semibold text-primary">{bondBand(v)} band · {anchorFor(v).label}.</span>{" "}
                    {anchorFor(v).text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- reading column ---- */}
        <div className="diagnostic-readings instrument-pair min-w-0">
          <div className="instrument-wide bg-background border border-brass/40 p-4 sm:p-5 min-w-0 w-full max-w-full">
            <p className="eyebrow">Reading</p>
            <h4 className="mt-3 font-serif text-primary text-2xl leading-tight">{standing.label}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Mean {mean.toFixed(2)} of 5 &middot; spread {spread.toFixed(1)}
            </p>
            <hr className="gold-rule gold-rule-short mt-5 mb-5" />

            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full max-w-[280px] mx-auto"
              role="img"
              aria-label={`Bond profile: ${LEVELS.map((l) => `${l.name} ${scores[l.key].toFixed(1)}`).join(", ")}`}
            >
              {[1, 2, 3, 4, 5].map((r) => (
                <polygon
                  key={r}
                  points={ring(r)}
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeWidth={r === 5 ? 1.4 : 0.8}
                />
              ))}
              {[0, 1, 2, 3].map((i) => {
                const [x, y] = point(i, 5);
                return (
                  <line
                    key={i}
                    x1={C}
                    y1={C}
                    x2={x}
                    y2={y}
                    stroke="hsl(var(--border))"
                    strokeWidth={0.8}
                  />
                );
              })}
              <polygon
                points={LEVELS.map((l, i) => point(i, scores[l.key]).join(",")).join(" ")}
                fill="hsl(var(--primary) / 0.16)"
                stroke="hsl(var(--primary))"
                strokeWidth={1.8}
                style={{ transition: "all 400ms ease" }}
              />
              {simulate && (
                <polygon
                  points={LEVELS.map((l, i) => point(i, target[l.key]).join(",")).join(" ")}
                  fill="hsl(var(--accent) / 0.06)"
                  stroke="hsl(var(--accent))"
                  strokeWidth={1.6}
                  strokeDasharray="5 4"
                  style={{ transition: "all 400ms ease" }}
                />
              )}
              {LEVELS.map((l, i) => {
                const [x, y] = point(i, scores[l.key]);
                return <circle key={l.key} cx={x} cy={y} r={3.4} fill="hsl(var(--accent))" />;
              })}
              {LEVELS.map((l, i) => {
                const [x, y] = point(i, 5);
                const dx = x === C ? 0 : x > C ? 8 : -8;
                const dy = y === C ? 0 : y > C ? 16 : -8;
                return (
                  <text
                    key={l.key}
                    x={x + dx}
                    y={y + dy}
                    textAnchor={x === C ? "middle" : x > C ? "end" : "start"}
                    className="fill-muted-foreground"
                    style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase" }}
                  >
                    {l.name === "Institutional-Relational" ? "Institutional" : l.name}
                  </text>
                );
              })}
            </svg>

            <div className="mt-4 border-t border-brass/30 pt-4">
              <label className="flex min-h-11 cursor-pointer items-center gap-3 text-xs text-foreground/85">
                <input type="checkbox" checked={simulate} onChange={(e) => setSimulate(e.target.checked)} className="accent-[hsl(var(--accent))]" />
                <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">Simulate remediation</span>
              </label>
              {simulate && projection && (
                <div className="mt-2 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <select
                      value={tKey}
                      onChange={(e) => setTargetKey(e.target.value as LevelKey)}
                      className="w-full border border-input bg-background px-3 py-2 text-sm min-h-11"
                      aria-label="Bond to remediate"
                    >
                      {LEVELS.map((l) => (
                        <option key={l.key} value={l.key}>{l.name === "Institutional-Relational" ? "Institutional" : l.name}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-2 text-xs text-muted-foreground min-h-11">
                      <span className="shrink-0">Lift +{lift.toFixed(1)}</span>
                      <input type="range" min={0} max={3} step={0.1} value={lift} onChange={(e) => setLift(Number(e.target.value))} className="w-full accent-[hsl(var(--accent))]" aria-label="Remediation lift" />
                    </label>
                  </div>
                  <p className="font-mono text-[11px] leading-relaxed text-primary [overflow-wrap:anywhere]">
                    Target {LEVELS.find((l) => l.key === tKey)!.name.replace("-Relational", "")} {projection.applied >= 0 ? "+" : ""}{projection.applied.toFixed(1)} → Contagion {projection.contagion > 0 ? "+" : ""}{projection.contagion.toFixed(1)}% · Deficit {projection.deficit > 0 ? "+" : ""}{projection.deficit.toFixed(1)} ·{" "}
                    <span className={projection.gateNext ? "text-emerald" : "text-destructive"}>
                      {projection.gateNow ? "Gate 1 already clear" : projection.gateNext ? "Clears Gate 1" : "Gate 1 still locked"}
                    </span>
                  </p>
                  <button
                    type="button"
                    disabled={projection.applied === 0}
                    onClick={() => setScores(() => target)}
                    className="min-h-11 w-full border border-brass/50 px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40"
                  >
                    Apply projected target to the mission
                  </button>
                </div>
              )}
            </div>

            <p className="mt-5 text-sm leading-relaxed text-foreground/80">{standing.note}</p>
            {stressed && (
              <p className="mt-3 border-l-2 border-accent/60 pl-3 font-mono text-[11px] leading-relaxed text-accent [overflow-wrap:anywhere]">
                Inscribed shocks active: the mission bus reads ({stressed.join(", ")}) for every downstream desk.
              </p>
            )}
          </div>

          <div className="bg-navy-tint border border-border p-4 sm:p-5 min-w-0 w-full max-w-full">
            <p className="eyebrow">Most exposed bond</p>
            <h4 className="mt-3 font-serif text-primary text-xl">
              {weakest.name} &middot; {scores[weakest.key].toFixed(1)} of 5 &middot; {bondBand(scores[weakest.key])}
            </h4>
            <hr className="gold-rule gold-rule-short mt-4 mb-4" />
            <p className="text-sm leading-relaxed text-foreground/85">{weakest.guidance}</p>
            {spread >= 2 && (
              <p className="mt-4 text-sm leading-relaxed text-accent">
                The reading is uneven by {spread.toFixed(1)} points. A strong score elsewhere does not compensate for
                this one, and should be read as a reason to look harder here.
              </p>
            )}
          </div>

          <RelationalDynamicsPanel scores={values} />
          <div className="instrument-wide bg-background border border-border p-4 sm:p-5 min-w-0 w-full max-w-full" data-testid="nearest-cases">
            <p className="eyebrow">Nearest documented cases</p>
            {shockCount > 0 && (
              <p className="mt-2 text-[11px] text-muted-foreground" data-testid="nearest-cases-live">
                Ranked against the live vector after {shockCount} inscribed shock{shockCount === 1 ? "" : "s"}.
              </p>
            )}
            <ol className="mt-3 grid gap-5 xl:grid-cols-3">
              {topThree.map(({ c, m }, i) => (
                <li key={c.slug} className="min-w-0 border-t border-border pt-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
                    {i + 1 === 1 ? "1st" : i + 1 === 2 ? "2nd" : "3rd"} · d = {m.distance.toFixed(2)} · {m.resonance}% resonance
                  </p>
                  <h4 className={`mt-2 font-serif text-primary ${i === 0 ? "text-xl" : "text-lg"}`}>{c.shortTitle}</h4>
                  {i === 0 && <hr className="gold-rule gold-rule-short mt-4 mb-4" />}
                  <p className={`text-sm leading-relaxed text-foreground/80 ${i === 0 ? "" : "mt-2"}`}>{c.pattern}</p>
                  <Link
                    to={`/cases/${c.slug}`}
                    className={
                      i === 0
                        ? "mt-5 inline-flex items-center border border-brass px-5 py-3 text-[10px] uppercase tracking-[0.22em] font-bold text-primary hover:bg-primary hover:text-background hover:border-primary transition-colors"
                        : "mt-3 inline-flex items-center text-[10px] uppercase tracking-[0.22em] font-bold text-primary hover:text-accent transition-colors"
                    }
                  >
                    Open the full case study &rarr;
                  </Link>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>

      {/* Tier 2: full-width analysis, safeguards and intervention workbench. */}
      <div className="mt-8 instrument-pair w-full min-w-0">
        <div className="instrument-wide min-w-0">
          <BondMathPanel scores={liveVector} />
        </div>
        <div className="instrument-wide min-w-0">
          <div className="bg-gold-tint border border-border p-4 sm:p-5 min-w-0 w-full max-w-full">
            <p className="eyebrow">Boundary rules in force</p>
            <hr className="gold-rule gold-rule-short mt-4 mb-4" />
            <ul className="space-y-3">
              {[...BOUNDARY_RULES, ...customRules].map((r, idx) => (
                <li key={`${idx}-${r}`} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="text-brass font-bold shrink-0">&middot;</span>
                  <span>
                    {idx >= BOUNDARY_RULES.length && <span className="mr-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">Sovereign</span>}
                    {r}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
        {simulator && <div className="instrument-wide min-w-0">{simulator}</div>}
      </div>

      {stress && <div className="mt-8 grid grid-cols-1 gap-8 w-full min-w-0 [&>*]:min-w-0">{stress}</div>}

      {/* Tier 3: sovereign transmittal console, full width. */}
      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={summary} fileName="Vinculum-Bond-Diagnostic" />
      </div>
    </section>
  );
}
