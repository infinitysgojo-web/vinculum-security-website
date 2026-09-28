import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";
import { CASES } from "@/content/cases";

/**
 * Interactive Relational Bond Diagnostic Bench.
 *
 * Runs entirely in the browser. Nothing entered here is stored or transmitted.
 * Scale, level names, descriptive anchors, and boundary rules follow the
 * doctrine (Sections III.D, V.E, VI) and the handbook (Part IV).
 */

type LevelKey = "interpersonal" | "communal" | "intergenerational" | "institutional";

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

/* ---------- component ---------- */

export default function BondDiagnostic() {
  const [context, setContext] = useState("");
  const [scores, setScores] = useState<Record<LevelKey, number>>({
    interpersonal: 3,
    communal: 3,
    intergenerational: 3,
    institutional: 3,
  });
  const [copied, setCopied] = useState(false);

  const values = LEVELS.map((l) => scores[l.key]);
  const mean = values.reduce((a, b) => a + b, 0) / 4;

  const weakest = useMemo(() => {
    let w = LEVELS[0];
    for (const l of LEVELS) if (scores[l.key] < scores[w.key]) w = l;
    return w;
  }, [scores]);

  const spread = Math.max(...values) - Math.min(...values);

  const standing = useMemo(() => {
    if (mean < 2) return { label: "Fractured", note: "The relational base is not carrying the process. Formal progress made now will rest on bonds that are not there." };
    if (mean < 3) return { label: "Degraded", note: "Form exists ahead of substance. The arrangement is likely to hold only while conditions stay favourable." };
    if (mean < 4) return { label: "Contested", note: "Real repair in some places, unresolved grievance in others. The reading depends on which bond you look at." };
    if (mean < 4.6) return { label: "Stabilised", note: "The bonds have taken a shock and held. Vulnerability remains where the reading is uneven." };
    return { label: "Reconstituted", note: "Durable across transitions and independent of any single officeholder." };
  }, [mean]);

  const analogue = useMemo(() => {
    let best = CASES[0];
    let bestDist = Infinity;
    for (const c of CASES) {
      const d = c.scores.reduce((acc, s, i) => acc + Math.abs(s - values[i]), 0);
      if (d < bestDist) {
        bestDist = d;
        best = c;
      }
    }
    return best;
  }, [values]);

  const summary = useMemo(() => {
    const lines = [
      "VINCULUM CONTINUUM ASSESSMENT",
      context.trim() ? `Context: ${context.trim()}` : "Context: unnamed",
      "",
      ...LEVELS.map(
        (l) => `${l.name} (§ ${l.ref}): ${scores[l.key]} of 5, ${ANCHORS[scores[l.key]].label}`
      ),
      "",
      `Standing: ${standing.label} (mean ${mean.toFixed(2)} of 5, spread ${spread})`,
      `Most exposed bond: ${weakest.name}`,
      `Diagnostic question: ${weakest.question}`,
      "",
      "Practice direction:",
      weakest.guidance,
      "",
      `Nearest documented case by profile: ${analogue.shortTitle} (${analogue.scores.join(", ")}).`,
      "",
      "Boundary rules in force: children are a protected party and are not scored; a government does not assess its own institutional-relational bond; a bond score does not substitute for a protection determination.",
      "",
      "Assessed against Vinculum Security, A Doctrine of Relational Security, by James Wesley Ndua.",
    ];
    return lines.join("\n");
  }, [context, scores, standing, mean, spread, weakest, analogue]);

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    } catch {
      setCopied(false);
    }
  }

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

      <FadeIn className="grid gap-5 lg:grid-cols-[1.15fr_1fr] items-start">
        {/* ---- input column ---- */}
        <div className="bg-navy-tint border border-border p-6 md:p-8">
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
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex items-baseline gap-3">
                      <span className="font-serif text-accent text-sm">§ {l.ref}</span>
                      <h4 className="font-serif text-primary">{l.name}</h4>
                    </div>
                    <span className="font-serif text-2xl text-accent leading-none">{v}</span>
                  </div>
                  <p className="mt-2 font-serif italic text-sm text-primary/80">{l.question}</p>

                  <input
                    aria-label={`${l.name} bond score, 1 to 5`}
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={v}
                    onChange={(e) =>
                      setScores((s) => ({ ...s, [l.key]: Number(e.target.value) }))
                    }
                    className="mt-4 w-full accent-[hsl(var(--accent))] cursor-pointer"
                  />
                  <div className="mt-1 flex justify-between text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
                    <span>Severed</span>
                    <span>Durable</span>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-foreground/75">
                    <span className="font-semibold text-primary">{ANCHORS[v].label}.</span>{" "}
                    {ANCHORS[v].text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ---- reading column ---- */}
        <div className="space-y-5">
          <div className="bg-background border border-brass/40 p-6 md:p-8">
            <p className="eyebrow">Reading</p>
            <h4 className="mt-3 font-serif text-primary text-2xl leading-tight">{standing.label}</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Mean {mean.toFixed(2)} of 5 &middot; spread {spread}
            </p>
            <hr className="gold-rule gold-rule-short mt-5 mb-5" />

            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              className="w-full max-w-[280px] mx-auto"
              role="img"
              aria-label={`Bond profile: ${LEVELS.map((l) => `${l.name} ${scores[l.key]}`).join(", ")}`}
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

          <div className="bg-navy-tint border border-border p-6 md:p-8">
            <p className="eyebrow">Most exposed bond</p>
            <h4 className="mt-3 font-serif text-primary text-xl">
              {weakest.name} &middot; {scores[weakest.key]} of 5
            </h4>
            <hr className="gold-rule gold-rule-short mt-4 mb-4" />
            <p className="text-sm leading-relaxed text-foreground/85">{weakest.guidance}</p>
            {spread >= 2 && (
              <p className="mt-4 text-sm leading-relaxed text-accent">
                The reading is uneven by {spread} points. A strong score elsewhere does not compensate for
                this one, and should be read as a reason to look harder here.
              </p>
            )}
          </div>

          <div className="bg-background border border-border p-6 md:p-8">
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

          <div className="bg-gold-tint border border-border p-6 md:p-8">
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

          <button
            type="button"
            onClick={copySummary}
            className="w-full border border-primary bg-primary px-5 py-4 text-[10px] uppercase tracking-[0.22em] font-bold text-background hover:bg-transparent hover:text-primary transition-colors"
          >
            {copied ? "Assessment copied" : "Copy assessment summary"}
          </button>
          <p className="text-xs text-muted-foreground text-center">
            Copies a formatted record you can paste straight into a briefing note.
          </p>
        </div>
      </FadeIn>
    </section>
  );
}
