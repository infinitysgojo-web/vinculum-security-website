import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { CASES, DOMAINS } from "@/content/cases";

const LEVELS: string[][] = [
  ["Hostile", "Cold", "Guarded", "Cooperative", "Partnership"],
  ["Polarized", "Segregated", "Tolerant", "Coexisting", "Integrated"],
  ["Disenfranchised", "Tokenized", "Consulted", "Active", "Entrenched"],
  ["Captured", "Fragile", "Functional", "Independent", "Robust"],
];

const MAX_DIST = Math.sqrt(4 * 16);

function warning(s: number[]) {
  const [ip, cm, ig, ins] = s;
  const min = Math.min(...s);
  const max = Math.max(...s);
  if (max <= 2)
    return { name: "Systemic Bond Collapse", text: "Every level is weak at once. No single channel can carry the settlement; repair must begin simultaneously at the communal and interpersonal levels before institutions can hold." };
  if (ip >= 4 && (cm <= 2 || ig <= 2))
    return { name: "The Elite-Pact Mirage", text: "Trust at the leadership level is masking weakness below it. An accord signed here risks collapsing at the first grassroots shock or leadership transition." };
  if (ins >= 4 && ig <= 2)
    return { name: "Generational Cliff", text: "Institutions are sound but the generation that did not live the conflict has no stake in them. Durability is borrowed time unless transfer is built in." };
  if (cm >= 4 && ins <= 2)
    return { name: "Unanchored Repair", text: "Communities are reconciling faster than institutions can follow through. Without institutional anchoring, communal gains decay into disillusionment." };
  if (max - min <= 1)
    return { name: "Bond Theater Risk", text: "Scores are even and moderate, the profile most easily performed rather than lived. Verify each bond independently before treating it as real." };
  return { name: "Uneven Continuum", text: `The ${DOMAINS[s.indexOf(min)].toLowerCase()} bond is the weakest link. Sequence intervention there first; strength elsewhere will not compensate for it.` };
}

export default function PatternMatcher() {
  const [scores, setScores] = useState([3, 3, 3, 3]);

  const ranked = useMemo(
    () =>
      CASES.map((c) => {
        const d = Math.sqrt(c.scores.reduce((a, v, i) => a + (v - scores[i]) ** 2, 0));
        return { c, sim: Math.round((1 - d / MAX_DIST) * 100) };
      }).sort((a, b) => b.sim - a.sim),
    [scores],
  );
  const [top, second] = ranked;
  const w = warning(scores);

  return (
    <section aria-labelledby="matcher-title" className="mb-20">
      <p className="eyebrow">Cross-Case Stress Tester</p>
      <h2 id="matcher-title" className="font-serif text-primary text-3xl md:text-4xl mt-2">
        Which precedent does your theater resemble?
      </h2>
      <hr className="gold-rule gold-rule-short mt-4 mb-4" />
      <p className="text-foreground/80 max-w-3xl mb-6">
        Set the current condition of each bond in the theater you are watching. The matcher measures
        its distance from the eight scored cases and names the pattern to guard against. It runs in
        your browser and stores nothing.
      </p>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6 items-start">
        <div className="border border-brass/40 bg-navy-tint/30 p-5 md:p-6 space-y-6">
          {DOMAINS.map((d, i) => (
            <div key={d}>
              <div className="flex justify-between items-baseline gap-3">
                <label htmlFor={`pm-${i}`} className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary">
                  {d}
                </label>
                <span className="font-serif text-accent text-sm">
                  {LEVELS[i][scores[i] - 1]} · {scores[i]}/5
                </span>
              </div>
              <input
                id={`pm-${i}`}
                type="range"
                min={1}
                max={5}
                step={1}
                value={scores[i]}
                onChange={(e) => setScores((s) => s.map((v, j) => (j === i ? Number(e.target.value) : v)))}
                className="w-full mt-2 accent-[hsl(var(--accent))]"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setScores([3, 3, 3, 3])}
            className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/70 hover:text-accent"
          >
            Reset
          </button>
        </div>

        <aside className="border border-border bg-card p-5" aria-live="polite">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Closest precedent</p>
          <h3 className="font-serif text-primary text-2xl mt-1 leading-tight">{top.c.shortTitle}</h3>
          <p className="font-serif text-accent">{top.sim}% structural resonance</p>
          <p className="text-[0.85rem] text-foreground/80 mt-2 leading-snug">{top.c.pattern}</p>
          <p className="text-[0.78rem] text-muted-foreground mt-2">
            Secondary: {second.c.shortTitle} · {second.sim}%
          </p>
          <hr className="gold-rule gold-rule-short my-4" />
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Watch for · {w.name}</p>
          <p className="text-[0.85rem] text-foreground/80 mt-2 leading-snug">{w.text}</p>
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent mt-4">Transferable lesson</p>
          <p className="text-[0.85rem] text-foreground/80 mt-2 leading-snug">{top.c.takeaway}</p>
          <Link
            to={`/cases/${top.c.slug}`}
            className="inline-block mt-4 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
          >
            Open {top.c.shortTitle} →
          </Link>
          <p className="text-[0.72rem] text-muted-foreground mt-4 leading-snug">
            An analytical prompt, not a forecast. Verify every reading in the field.
          </p>
        </aside>
      </div>
    </section>
  );
}
