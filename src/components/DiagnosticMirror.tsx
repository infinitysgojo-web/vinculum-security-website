import { useMemo } from "react";
import { Link } from "react-router-dom";
import { CASES, DOMAINS, type CaseStudy } from "@/content/cases";

/**
 * The Cross-Theater Diagnostic Mirror.
 *
 * Upgrades the plain side-by-side score table into a comparative reading of
 * two or three documented theaters: a dual radar of the four bond domains,
 * followed by the four diagnostic inquiries the doctrine asks of any process.
 * Everything is derived from the canonical case content; nothing is stored.
 */

const SERIES = [
  { stroke: "hsl(var(--primary))", fill: "hsl(var(--primary) / 0.14)" },
  { stroke: "hsl(var(--accent))", fill: "hsl(var(--accent) / 0.14)" },
  { stroke: "hsl(var(--brass))", fill: "hsl(var(--brass) / 0.16)" },
];

export const PAIRINGS: { label: string; note: string; slugs: [string, string] }[] = [
  {
    label: "The Annan Parallel",
    note: "How personal trust rescues elite negotiations under acute escalation.",
    slugs: ["kenya", "northern-ireland"],
  },
  {
    label: "Accords and Communities",
    note: "Why institutional drafting fails without communal grounding.",
    slugs: ["colombia", "cambodia"],
  },
  {
    label: "The 1994 Divergence",
    note: "Two transitions in one year: total severance beside relational transition.",
    slugs: ["rwanda", "south-africa"],
  },
  {
    label: "Sovereignty Beyond Land",
    note: "Bonds tested when territory or formal authority dissolves.",
    slugs: ["liberia", "tuvalu-kiribati"],
  },
];

const SIZE = 300;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 96;

function point(i: number, value: number) {
  const angle = (Math.PI * 2 * i) / 4 - Math.PI / 2;
  const r = (value / 5) * R;
  return [CX + r * Math.cos(angle), CY + r * Math.sin(angle)] as const;
}

function polygon(scores: readonly number[]) {
  return scores.map((s, i) => point(i, s).join(",")).join(" ");
}

function ordered(c: CaseStudy) {
  return c.scores.map((score, idx) => ({ score, idx, domain: DOMAINS[idx], why: c.rationales[idx] }));
}

function lowest(c: CaseStudy) {
  return [...ordered(c)].sort((a, b) => a.score - b.score)[0];
}
function secondLowest(c: CaseStudy) {
  return [...ordered(c)].sort((a, b) => a.score - b.score)[1];
}
function highest(c: CaseStudy) {
  return [...ordered(c)].sort((a, b) => b.score - a.score)[0];
}

function Radar({ cases }: { cases: CaseStudy[] }) {
  const rings = [1, 2, 3, 4, 5];
  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      className="w-full max-w-[320px] mx-auto"
      role="img"
      aria-label="Four bond domains compared across the selected theaters"
    >
      {rings.map((r) => (
        <polygon
          key={r}
          points={polygon([r, r, r, r])}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={0.7}
        />
      ))}
      {DOMAINS.map((_, i) => {
        const [x, y] = point(i, 5);
        return <line key={i} x1={CX} y1={CY} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth={0.7} />;
      })}
      {cases.map((c, n) => (
        <polygon
          key={c.slug}
          points={polygon(c.scores)}
          fill={SERIES[n % 3].fill}
          stroke={SERIES[n % 3].stroke}
          strokeWidth={1.8}
        />
      ))}
      {cases.map((c, n) =>
        c.scores.map((s, i) => {
          const [x, y] = point(i, s);
          return <circle key={`${c.slug}-${i}`} cx={x} cy={y} r={3} fill={SERIES[n % 3].stroke} />;
        })
      )}
      {DOMAINS.map((d, i) => {
        const side = i === 1 || i === 3;
        const [x, y] = point(i, side ? 5 : 6.15);
        return (
          <text
            key={d}
            x={x}
            y={side ? y - 12 : y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-primary"
            style={{ fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600 }}
          >
            {d === "Institutional-Relational" ? "Institutional" : d}
          </text>
        );
      })}
    </svg>
  );
}

function Inquiry({
  n,
  title,
  question,
  cases,
  render,
}: {
  n: string;
  title: string;
  question: string;
  cases: CaseStudy[];
  render: (c: CaseStudy) => { head: string; body: string };
}) {
  return (
    <div className="border-t border-brass/40 pt-5">
      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
        {n} · {title}
      </p>
      <p className="mt-1.5 font-serif italic text-primary text-[1.05rem] leading-snug">{question}</p>
      <div className={`mt-4 grid gap-4 ${cases.length > 2 ? "md:grid-cols-3" : "md:grid-cols-2"}`}>
        {cases.map((c, i) => {
          const { head, body } = render(c);
          return (
            <div key={c.slug} className="bg-navy-tint/50 border border-border p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary/70">
                <span
                  className="inline-block h-2 w-2 shrink-0"
                  style={{ backgroundColor: SERIES[i % 3].stroke }}
                  aria-hidden
                />
                {c.shortTitle}
              </p>
              <p className="mt-2 font-serif text-primary text-base leading-snug">{head}</p>
              <p className="mt-2 text-[0.85rem] leading-relaxed text-foreground/80">{body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function DiagnosticMirror({
  cases,
  onSelectPairing,
}: {
  cases: CaseStudy[];
  onSelectPairing: (slugs: string[]) => void;
}) {
  const activePairing = useMemo(() => {
    if (cases.length !== 2) return null;
    const set = new Set(cases.map((c) => c.slug));
    return PAIRINGS.find((p) => p.slugs.every((s) => set.has(s))) ?? null;
  }, [cases]);

  if (cases.length < 2) {
    return (
      <div className="py-8">
        <p className="text-foreground/75 text-[0.95rem] leading-relaxed">
          Select a second theater on the case cards to open the mirror, or begin from one of the
          curated pairings below.
        </p>
        <PairingBar onSelect={onSelectPairing} active={null} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PairingBar onSelect={onSelectPairing} active={activePairing?.label ?? null} />
      {activePairing && (
        <p className="font-serif italic text-primary/80 text-[1rem] leading-snug">
          {activePairing.note}
        </p>
      )}

      <div className="grid gap-6 md:grid-cols-[320px_1fr] items-start border border-brass/40 bg-gold-tint/40 p-5">
        <Radar cases={cases} />
        <div className="space-y-4">
          {cases.map((c, i) => (
            <div key={c.slug}>
              <p className="flex items-center gap-2 font-serif text-primary text-lg leading-tight">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0"
                  style={{ backgroundColor: SERIES[i % 3].stroke }}
                  aria-hidden
                />
                <Link to={`/cases/${c.slug}`} className="hover:text-accent transition-colors">
                  {c.title}
                </Link>
              </p>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2">
                {DOMAINS.map((d, idx) => (
                  <div key={d}>
                    <p className="text-[9px] uppercase tracking-[0.14em] font-semibold text-primary/60 leading-tight">
                      {d === "Institutional-Relational" ? "Institutional" : d}
                    </p>
                    <p className="font-serif text-accent text-sm">{c.scores[idx]} / 5</p>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-[0.85rem] italic text-foreground/70 leading-snug">{c.pattern}</p>
            </div>
          ))}
        </div>
      </div>

      <Inquiry
        n="I"
        title="Primary rupture point"
        question="Which bond fractured first, and carried the process down with it?"
        cases={cases}
        render={(c) => {
          const l = lowest(c);
          return { head: `${l.domain}, scored ${l.score} of 5`, body: l.why };
        }}
      />
      <Inquiry
        n="II"
        title="Intervention mechanism"
        question="Which bond did the mediators actually work through to hold the process?"
        cases={cases}
        render={(c) => {
          const h = highest(c);
          return { head: `${h.domain}, scored ${h.score} of 5`, body: h.why };
        }}
      />
      <Inquiry
        n="III"
        title="Unresolved vulnerability"
        question="What remained fragile after the settlement was signed?"
        cases={cases}
        render={(c) => {
          const s = secondLowest(c);
          return { head: `${s.domain}, scored ${s.score} of 5`, body: s.why };
        }}
      />
      <Inquiry
        n="IV"
        title="Transferable lesson"
        question="What does a mediator facing a live crisis take from this theater?"
        cases={cases}
        render={(c) => ({ head: c.ref, body: c.takeaway })}
      />

      <p className="text-xs text-foreground/60 border-t border-brass/40 pt-4">
        Scores run 1 to 5 across the four bond domains of the Vinculum Continuum. The rupture,
        intervention, and vulnerability readings are drawn from each case's own scoring rationale in
        Section VII. Nothing selected here is stored or transmitted.
      </p>
    </div>
  );
}

function PairingBar({
  onSelect,
  active,
}: {
  onSelect: (slugs: string[]) => void;
  active: string | null;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2">
        Curated pairings
      </p>
      <div className="flex flex-wrap gap-2">
        {PAIRINGS.map((p) => (
          <button
            key={p.label}
            type="button"
            aria-pressed={active === p.label}
            onClick={() => onSelect([...p.slugs])}
            title={p.note}
            className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
              active === p.label
                ? "bg-accent text-accent-foreground border-accent"
                : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export function caseBySlug(slug: string) {
  return CASES.find((c) => c.slug === slug);
}
