import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { CASES } from "@/content/cases";
import {
  usePublish,
  bondBand,
  clampScore,
  mathReading,
  bondArchetype,
  distanceTable,
  facadeSyndrome,
  BOND_NAMES,
} from "@/components/desk/engine";
import BondMathPanel from "@/components/desk/BondMathPanel";
import DeskOutput, { todayStamp } from "@/components/desk/DeskOutput";
import { useMission } from "@/components/desk/mission";

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
  scores?: BondScores;
  onScoresChange?: (scores: BondScores) => void;
}

const DEFAULT_SCORES: BondScores = {
  interpersonal: 3.0,
  communal: 3.0,
  intergenerational: 3.0,
  institutional: 3.0,
};
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

export default function BondDiagnostic({ scores: controlled, onScoresChange }: BondDiagnosticProps = {}) {
  const mission = useMission();
  // Inherits the active theatre from the Mission Vault; the analyst may overwrite it here.
  const [context, setContext] = useState(mission.theatre);
  useEffect(() => {
    setContext(mission.theatre);
  }, [mission.theatre]);
  // Controlled when `scores` is passed; otherwise it keeps its own state as before.
  const [internal, setInternal] = useState<BondScores>(DEFAULT_SCORES);
  const scores = controlled ?? internal;
  const setScores = (update: (s: BondScores) => BondScores) => {
    const next = update(scores);
    if (!controlled) setInternal(next);
    onScoresChange?.(next);
  };

  const values = useMemo(() => LEVELS.map((l) => scores[l.key]) as [number, number, number, number], [scores]);
  const mean = values.reduce((a, b) => a + b, 0) / 4;
  const reading = useMemo(() => mathReading(values), [values]);

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

  const analogue = useMemo(
    () => CASES.find((c) => c.slug === reading.nearest.slug) ?? CASES[0],
    [reading],
  );

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
    analogue: analogue.shortTitle,
  });

  const archetype = useMemo(() => bondArchetype(values), [values]);
  const precedents = useMemo(
    () => [...distanceTable(values)].sort((x, y) => x.distance - y.distance).slice(0, 3),
    [values],
  );
  const facade = useMemo(() => facadeSyndrome(values), [values]);

  // The chancellery dossier: one deterministic text, built only from what is on the bench.
  const text = useMemo(() => {
    const bar = "=".repeat(64);
    const theatre = context.trim() || mission.theatre.trim() || "No active mission named";
    const weakScore = scores[weakest.key];
    const weakBand = bondBand(weakScore);
    const pad = (t: string, n: number) => t.padEnd(n, " ");
    const L: string[] = [
      "VINCULUM SECURITY · OPERATIONAL RELATIONAL DOSSIER",
      "Compiled under A Doctrine of Relational Security (Sections III.D, V.E and VI)",
      "",
      `THEATRE         : ${theatre}`,
      `DRAFTING OFFICER: ${mission.officer.trim() || "Not recorded"}`,
      `CLASSIFICATION  : ${mission.classification.trim() || "Unrestricted, working draft"}`,
      `DATE            : ${todayStamp()}`,
      "REGISTRY        : KECOBO RZ100967 (Kenya Copyright Board Registration No. RZ100967)",
      "",
      bar,
      "I. THE FOUR-BOND SCORES",
      bar,
      "Scale 1.0 to 5.0. Bands: Failing 1.0-2.0, Fragile 2.1-3.0, Viable 3.1-4.0, Fortified 4.1-5.0.",
      "",
      ...LEVELS.flatMap((l) => [
        `  ${pad(`${l.name} (§ ${l.ref})`, 40)}${scores[l.key].toFixed(1)} of 5 · ${bondBand(scores[l.key])} band · ${anchorFor(scores[l.key]).label}`,
        `      ${anchorFor(scores[l.key]).text}`,
      ]),
      "",
      `  State vector B = (${values.map((v) => v.toFixed(1)).join(", ")})`,
      "",
      bar,
      "II. MATHEMATICAL DERIVATION",
      bar,
      `  Composite mean  μB  = ¼ Σ Bᵢ            = ${reading.mean.toFixed(3)}  (${bondBand(reading.mean)} band)`,
      `  Population variance σB² = ¼ Σ (Bᵢ − μB)² = ${reading.variance.toFixed(3)}  (σB = ${Math.sqrt(reading.variance).toFixed(3)})`,
      `  Spread          max Bᵢ − min Bᵢ     = ${spread.toFixed(1)}`,
      `  Liebig limiting factor  B_min = min Bᵢ = ${reading.limitingScore.toFixed(1)}  (${BOND_NAMES[reading.limitingIndex]}, ${bondBand(reading.limitingScore)} band)`,
      "  Ties for the limiting factor go to the lower bond index.",
      ...(reading.limitingScore <= 2.0
        ? [`  [LIEBIG LOCK FAILING] ${BOND_NAMES[reading.limitingIndex]} scores ${reading.limitingScore.toFixed(1)}, at or below 2.0. The weakest bond caps the whole continuum; strength elsewhere does not compensate for it.`]
        : []),
      `  Structural Facade Syndrome: ${facade.engaged ? "ENGAGED" : "not engaged"} (σB² > 1.25: ${facade.tests.varianceAbove ? "yes" : "no"}; max ≥ 4.0: ${facade.tests.maxAtLeast ? "yes" : "no"}; min ≤ 2.0: ${facade.tests.minAtMost ? "yes" : "no"}).`,
      "",
      bar,
      "III. STRUCTURAL DIAGNOSIS AND WARNING ARCHETYPE",
      bar,
      `  Relational standing : ${standing.label}`,
      `  ${standing.note}`,
      "",
      `  ACTIVE ARCHETYPE    : ${archetype.name}`,
      `  ${archetype.text}`,
      "",
      bar,
      "IV. HISTORICAL PRECEDENTS (three nearest canonical cases)",
      bar,
      "  Euclidean distance d = √Σ(Bᵢ − Cᵢ)²; resonance R = (1 − d / 8) × 100%.",
      "",
      ...precedents.flatMap((r, i) => {
        const c = CASES.find((x) => x.slug === r.slug);
        return [
          `  ${i + 1}. ${r.shortTitle}${r.year ? ` (${r.year})` : ""}${r.nearest ? "  [closest historical twin]" : ""}`,
          `     Vector (${r.coords.join(", ")}) · distance ${r.distance.toFixed(2)} · resonance ${r.resonance.toFixed(1)}%`,
          ...(c ? [`     ${c.pattern}`] : []),
        ];
      }),
      "",
      bar,
      "V. BOUNDARY RULES AND PRACTICE DIRECTIVE",
      bar,
      `  Limiting bond: ${weakest.name} (§ ${weakest.ref}) at ${weakScore.toFixed(1)} of 5, ${weakBand} band.`,
      `  Diagnostic question: ${weakest.question}`,
      "",
      "  Practice directive:",
      `  ${weakest.guidance}`,
      ...(spread >= 2
        ? ["", `  The reading is uneven by ${spread.toFixed(1)} points. A strong score elsewhere does not compensate for this one, and should be read as a reason to look harder here.`]
        : []),
      "",
      "  Boundary rules in force:",
      ...BOUNDARY_RULES.map((r, i) => `  ${i + 1}. ${r}`),
      "",
      bar,
      "Assessed against Vinculum Security, A Doctrine of Relational Security, by James Wesley Ndua.",
      "Pro Omni Humanitate. Kenya Copyright Board Registration No. RZ100967.",
    ];
    return L.join("\n");
  }, [context, mission, scores, standing, spread, weakest, archetype, precedents, facade, reading, values]);

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

      <FadeIn className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-5 items-start w-full min-w-0 [&>*]:min-w-0">
        {/* ---- input column ---- */}
        <div className="bg-navy-tint border border-border p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full">
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

          <hr className="gold-rule gold-rule-short mt-8 mb-7" />

          <div className="space-y-8">
            {LEVELS.map((l) => {
              const v = scores[l.key];
              return (
                <div key={l.key}>
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
        <div className="space-y-5">
          <div className="bg-background border border-brass/40 p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full">
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

            <p className="mt-5 text-sm leading-relaxed text-foreground/80">{standing.note}</p>
          </div>

          <BondMathPanel scores={values} />

          <div className="bg-navy-tint border border-border p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full">
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

          <div className="bg-background border border-border p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full">
            <p className="eyebrow">Nearest documented case</p>
            <h4 className="mt-3 font-serif text-primary text-xl">{analogue.shortTitle}</h4>
            <hr className="gold-rule gold-rule-short mt-4 mb-4" />
            <p className="text-sm leading-relaxed text-foreground/80">{analogue.pattern}</p>
            <Link
              to={`/cases/${analogue.slug}`}
              className="mt-5 inline-flex items-center border border-brass px-5 py-3 text-[10px] uppercase tracking-[0.22em] font-bold text-primary hover:bg-primary hover:text-background hover:border-primary transition-colors"
            >
              Open the full case study &rarr;
            </Link>
          </div>

          <div className="bg-gold-tint border border-border p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full">
            <p className="eyebrow">Boundary rules in force</p>
            <hr className="gold-rule gold-rule-short mt-4 mb-4" />
            <ul className="space-y-3">
              {BOUNDARY_RULES.map((r) => (
                <li key={r} className="flex gap-3 text-sm leading-relaxed text-foreground/85">
                  <span className="text-brass font-bold shrink-0">&middot;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-background border border-brass/40 p-4 sm:p-6 md:p-8 min-w-0 w-full max-w-full">
            <p className="eyebrow">Chancellery dossier</p>
            <hr className="gold-rule gold-rule-short mt-4 mb-4" />
            <p className="mb-5 text-sm leading-relaxed text-foreground/80">
              The full operational relational dossier for this reading. Copy it, download it as text or as a
              PDF dossier, or add it to the Mission Binder. Every export carries a SHA-256 seal computed on this device.
            </p>
            <DeskOutput text={text} fileName="Vinculum-Bond-Diagnostic" />
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
