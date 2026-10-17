import { useEffect, useMemo, useState } from "react";
import { useTheatreSeed } from "./theatres";
import DeskOutput, { field, label, panel } from "./DeskOutput";
import { usePublish, useEngine, hasSignal, telemetryLines, communalTolerance } from "./engine";
import SyncPanel from "./SyncPanel";

/**
 * §9B, the Track I and Track II sequencing workbench.
 * Deterministic: the sequence is fixed doctrine; the desk reports where the
 * two tracks have fallen out of step and what that gap produces.
 */

type Step = { id: string; phase: string; track: "I" | "II"; text: string };

const STEPS: Step[] = [
  { id: "i1", phase: "Phase 1 · Contact", track: "I", text: "Confidential contact opened with each principal, by office." },
  { id: "ii1", phase: "Phase 1 · Contact", track: "II", text: "Community interlocutors identified and their standing verified independently." },
  { id: "i2", phase: "Phase 2 · Framing", track: "I", text: "Principals agree the agenda and the confidentiality rule." },
  { id: "ii2", phase: "Phase 2 · Framing", track: "II", text: "Communities state, in their own terms, what repair would look like." },
  { id: "i3", phase: "Phase 3 · Testing", track: "I", text: "Concessions tested privately with each principal before they are tabled." },
  { id: "ii3", phase: "Phase 3 · Testing", track: "II", text: "Draft positions carried back to communities for reaction before announcement." },
  { id: "i4", phase: "Phase 4 · Convergence", track: "I", text: "Provisional text drafted with continuity provisions attached." },
  { id: "ii4", phase: "Phase 4 · Convergence", track: "II", text: "Successor-generation forum reviews the provisional text and records dissent." },
  { id: "i5", phase: "Phase 5 · Commitment", track: "I", text: "Principals sign obligations attaching to their offices." },
  { id: "ii5", phase: "Phase 5 · Commitment", track: "II", text: "Communities publicly acknowledge the text they were consulted on." },
  { id: "i6", phase: "Phase 6 · Verification", track: "I", text: "Independent verifier seated and reporting intervals fixed." },
  { id: "ii6", phase: "Phase 6 · Verification", track: "II", text: "Communal monitoring channel opened directly to the verifier." },
];

const PHASES = Array.from(new Set(STEPS.map((s) => s.phase)));

/**
 * Kinematic shear: Track I (state principals) on the upper rail, Track II
 * (communal assemblies) on the lower, with the shear line joining the two depths.
 */
function DualRail({ a, b, tolerance }: { a: number; b: number; tolerance: number }) {
  const W = 340;
  const x = (d: number) => 34 + d * ((W - 58) / PHASES.length);
  const top = 30;
  const bot = 92;
  const shear = a - b > tolerance;
  return (
    <div className="border border-border bg-background p-3 sm:p-4">
      <p className={label}>Kinematic shear · dual-rail</p>
      <svg viewBox={`0 0 ${W} 124`} className="w-full h-auto" role="img" aria-label={`Track I at phase ${a}, Track II at phase ${b}, tolerance ${tolerance}`}>
        <defs>
          <pattern id="vs-shear-hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="7" height="7" fill="hsl(var(--destructive) / 0.08)" />
            <line x1="0" y1="0" x2="0" y2="7" stroke="hsl(var(--destructive) / 0.7)" strokeWidth="2.5" />
          </pattern>
        </defs>
        {shear && (
          <rect x={x(b + tolerance)} y={top} width={Math.max(0, x(a) - x(b + tolerance))} height={bot - top} fill="url(#vs-shear-hatch)" stroke="hsl(var(--destructive) / 0.6)" strokeWidth="1" />
        )}
        {[top, bot].map((y, r) => (
          <g key={y}>
            <line x1={x(0)} y1={y} x2={x(PHASES.length)} y2={y} stroke="hsl(var(--brass))" strokeWidth="1.5" />
            <line x1={x(0)} y1={y} x2={x(r === 0 ? a : b)} y2={y} stroke={r === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} strokeWidth="4" style={{ transition: "all 400ms ease" }} />
            {Array.from({ length: PHASES.length + 1 }, (_, i) => (
              <g key={i}>
                <circle cx={x(i)} cy={y} r={i === 0 ? 2 : 3.2} fill={i <= (r === 0 ? a : b) ? (r === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))") : "hsl(var(--background))"} stroke="hsl(var(--brass))" strokeWidth="1" />
                {i > 0 && (
                  <text x={x(i)} y={r === 0 ? y - 8 : y + 15} textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 8 }}>{i}</text>
                )}
              </g>
            ))}
            <text x={2} y={y + 3} className="fill-primary" style={{ fontSize: 8, fontWeight: 600, letterSpacing: "0.08em" }}>{r === 0 ? "TR I" : "TR II"}</text>
          </g>
        ))}
        <line
          x1={x(a)} y1={top} x2={x(b)} y2={bot}
          stroke={shear ? "hsl(var(--destructive))" : "hsl(var(--primary) / 0.6)"}
          strokeWidth={shear ? 2.2 : 1.5}
          strokeDasharray={shear ? undefined : "4 3"}
          style={{ transition: "all 400ms ease" }}
        />
      </svg>
      <div className="mt-1 flex flex-wrap justify-between gap-x-3 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">
        <span>Upper · Track I, state principals</span>
        <span>Lower · Track II, communal assemblies</span>
      </div>
      {shear && (
        <p role="status" className="mt-2 border border-destructive/50 bg-destructive/10 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-destructive [overflow-wrap:anywhere]">
          Elite-Pact Shear Zone: Lead exceeds communal tolerance ({tolerance} phase{tolerance === 1 ? "" : "s"})
        </p>
      )}
    </div>
  );
}

export default function TrackSequencer() {
  const [process, setProcess] = useState("");
  const [linked, setLinked] = useState(true);
  const { signals } = useEngine();
  const live = linked && hasSignal(signals);
  const [done, setDone] = useState<string[]>([]);
  useTheatreSeed("tracks", (s) => setDone(s.done));
  const toggle = (id: string) => setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  // Set when the envoy tries to advance Track I past the communal tolerance; cleared by any change to the sequence.
  const [mirageAttempt, setMirageAttempt] = useState(false);
  useEffect(() => setMirageAttempt(false), [done]);

  // Communal-bond tolerance: Failing = Track I may not lead, Fragile = one phase,
  // Viable or Fortified = two phases. With no live communal reading, the
  // baseline of one phase applies and the rule is advisory only.
  const communal = linked ? signals.bonds?.communal : undefined;
  const tol = communal !== undefined ? communalTolerance(communal) : null;
  const tolerance = tol ? tol.phases : 1;
  const enforced = tol !== null;

  const r = useMemo(() => {
    const depthOf = (t: "I" | "II") => {
      let d = 0;
      PHASES.forEach((ph, i) => {
        const s = STEPS.find((x) => x.phase === ph && x.track === t)!;
        if (done.includes(s.id) && d === i) d = i + 1;
      });
      return d;
    };
    const a = depthOf("I");
    const b = depthOf("II");
    const gap = a - b;
    let reading: string;
    let counter: string;
    if (gap > tolerance) {
      reading = `The Elite-Pact Mirage is forming: the principals' track leads the communal track by ${gap} phases, beyond the ${tolerance}-phase tolerance${tol ? ` set by the ${tol.band.toLowerCase()} communal bond` : ""}.`;
      counter = "Hold Track I at its current phase and run Track II forward before any further concession is tabled.";
    } else if (gap >= 1 && gap === tolerance) {
      reading = `Track I leads Track II by ${gap} phase${gap === 1 ? "" : "s"}, which is the maximum tolerable lead${tol ? ` while the communal bond is ${tol.band}` : ""}.`;
      counter = "Do not table a further Track I step until the matching Track II step is recorded.";
    } else if (gap >= 1) {
      reading = `Track I leads Track II by ${gap} phase${gap === 1 ? "" : "s"}, inside the ${tolerance}-phase tolerance.`;
      counter = "Keep Track II moving; the next Track I step stays inside tolerance only until the lead reaches the limit.";
    } else if (gap <= -2) {
      reading = "Unanchored Repair is forming: communal work has advanced with no principal-level instrument to settle into.";
      counter = "Convert the communal findings into a tabled Track I item before expectation outpaces authority.";
    } else if (gap === -1) {
      reading = "Track II leads Track I by one phase, which is safe and usually productive.";
      counter = "Carry the communal findings into the next principal session as a tabled item.";
    } else {
      reading = "The two tracks are in step.";
      counter = "Maintain the pairing: advance each phase on both tracks before opening the next.";
    }
    const nextI = STEPS.find((s) => s.track === "I" && !done.includes(s.id));
    const nextII = STEPS.find((s) => s.track === "II" && !done.includes(s.id));
    const blockedNow = gap >= tolerance;
    return { a, b, gap, reading, counter, nextI, nextII, blockedNow };
  }, [done, tolerance, tol?.band]);

  /** Would completing this Track I step push the lead beyond the tolerance? */
  const blockedStep = (s: Step) => {
    if (!enforced || s.track !== "I" || done.includes(s.id)) return false;
    const idx = PHASES.indexOf(s.phase);
    return idx + 1 - r.b > tolerance;
  };

  usePublish("tracks", {
    trackI: r.a,
    trackII: r.b,
    trackGap: r.gap,
    elitePactAlert: r.gap > tolerance,
    trackTolerance: tolerance,
    ...(tol ? { communalBand: tol.band } : {}),
  });

  const text = useMemo(() => {
    const L = [
      "TRACK I AND TRACK II SEQUENCING READING",
      "Compiled under Vinculum Diplomacy: The Practitioner Handbook, Section 9B",
      "",
      `PROCESS: ${process.trim() || "Unnamed process"}`,
      `TRACK I DEPTH: Phase ${r.a} of ${PHASES.length}`,
      `TRACK II DEPTH: Phase ${r.b} of ${PHASES.length}`,
      `SYNCHRONISATION GAP: ${r.gap > 0 ? `+${r.gap} (Track I ahead)` : r.gap < 0 ? `${r.gap} (Track II ahead)` : "0 (in step)"}`,
      `COMMUNAL-BOND TOLERANCE: Track I may lead by ${tolerance} phase${tolerance === 1 ? "" : "s"}${tol ? ` (communal bond ${communal!.toFixed(1)}, ${tol.band})` : " (baseline, no live communal reading)"}`,
      "",
      ...(live ? telemetryLines(signals) : []),
      "SEQUENCE LEDGER",
    ];
    PHASES.forEach((ph) => {
      L.push(`  ${ph}`);
      STEPS.filter((s) => s.phase === ph).forEach((s) => L.push(`    [${done.includes(s.id) ? "x" : " "}] Track ${s.track}: ${s.text}`));
    });
    L.push("", "READING", `  ${r.reading}`, "", "DIRECTIVE", `  ${r.counter}`, "");
    L.push("NEXT STEPS OF RECORD");
    L.push(`  Track I:  ${r.nextI ? r.nextI.text : "Sequence complete."}`);
    L.push(`  Track II: ${r.nextII ? r.nextII.text : "Sequence complete."}`);
    L.push("", "Rule-based sequencing aid. Nothing entered here is stored or transmitted. Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    return L.join("\n");
  }, [process, done, r, live, signals, tolerance, tol, communal]);

  return (
    <section className={panel}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5">
          <div>
            <label className={label} htmlFor="tk-p">Process</label>
            <input id="tk-p" className={`${field} text-base sm:text-sm min-h-11`} value={process} onChange={(e) => setProcess(e.target.value)} placeholder="e.g. Lake Region talks, second round" />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Sequence presets">
            {[1, 2, 3].map((n) => (
              <button key={n} type="button" onClick={() => setDone(STEPS.filter((s) => PHASES.indexOf(s.phase) < n).map((s) => s.id))} className="min-h-9 px-2.5 border border-brass/50 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:border-accent hover:text-accent">
                Both tracks to Phase {n}
              </button>
            ))}
            <button type="button" onClick={() => setDone(STEPS.filter((s) => s.track === "II" && PHASES.indexOf(s.phase) < 2).map((s) => s.id))} className="min-h-9 px-2.5 border border-brass/50 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:border-accent hover:text-accent">
              Track II leads by two
            </button>
            <button type="button" onClick={() => setDone([])} className="min-h-9 px-2.5 border border-border text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-accent">Reset sequence</button>
          </div>
          {PHASES.map((ph) => (
            <div key={ph}>
              <p className={label}>{ph}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {STEPS.filter((s) => s.phase === ph).map((s) => {
                  const blocked = blockedStep(s);
                  return (
                    <label key={s.id} className={`flex gap-3 items-start border border-border bg-background p-3 text-sm ${blocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
                      <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={done.includes(s.id)} aria-disabled={blocked} onChange={() => (blocked ? setMirageAttempt(true) : toggle(s.id))} />
                      <span>
                        <span className="block text-[10px] uppercase tracking-[0.18em] text-accent mb-1">
                          Track {s.track}{blocked ? " · Blocked by communal tolerance" : ""}
                        </span>
                        <span className="text-foreground/85">{s.text}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {(r.gap > tolerance || mirageAttempt) && (
            <div role="alert" className="border-2 border-destructive bg-destructive/10 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-destructive">CRITICAL ALERT: ELITE-PACT MIRAGE DETECTED</p>
              <p className="mt-2 text-sm text-foreground/90">
                {communal !== undefined && communal <= 2.0
                  ? `The communal bond is ${communal.toFixed(1)} of 5 (Failing), so Track I may not lead Track II by any phase.`
                  : `Track I leads Track II beyond the ${tolerance}-phase communal tolerance.`}{" "}
                Hold Track I and advance the communal track first.
              </p>
            </div>
          )}
          <DualRail a={r.a} b={r.b} tolerance={tolerance} />
          <div className="border border-border bg-background p-4">
            <p className={label}>Synchronisation</p>
            <p className="font-serif text-3xl text-primary">Track I {r.a} · Track II {r.b}</p>
            <p className="text-sm text-foreground/85 mt-2">{r.reading}</p>
            <p className="text-xs text-muted-foreground mt-2">{r.counter}</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-accent mt-3">
              Tolerated Track I lead: {tolerance} phase{tolerance === 1 ? "" : "s"}
              {tol ? ` · communal ${tol.band}` : " · baseline"}
              {r.blockedNow ? " · next Track I step blocked" : ""}
            </p>
          </div>
          <SyncPanel
            linked={linked}
            onToggle={setLinked}
            summary={(s) => {
              const n: string[] = [];
              if (s.bonds)
                {
                  const t = communalTolerance(s.bonds.communal);
                  n.push(
                    `The communal bond scores ${s.bonds.communal.toFixed(1)} of 5 (${t.band}), so ${
                      t.phases === 0
                        ? "Track I leads are blocked until the communal bond leaves the Failing band"
                        : `Track I may lead by at most ${t.phases === 1 ? "one phase" : "two phases"}`
                    }.`
                  );
                }
              if (s.rupture !== undefined && s.rupture >= 35)
                n.push("With the rupture index elevated, no Track I concession should be tabled ahead of a communal round.");
              return n;
            }}
          />
        </div>
      </div>
      {(signals.customTracks?.length ?? 0) > 0 && (
        <div className="mt-8 w-full min-w-0 border border-brass/40 bg-background p-4 sm:p-5">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-3">Track III · inscribed civil society and communal tracks</p>
          <ul className="space-y-3">
            {signals.customTracks!.map((t) => {
              const lead = r.a - t.phase;
              const shear = lead > tolerance;
              return (
                <li key={t.id} className="min-w-0">
                  <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs">
                    <span className="font-semibold text-primary [overflow-wrap:anywhere]">{t.name}</span>
                    <span className={shear ? "text-destructive" : "text-emerald"}>
                      Phase {t.phase} · Track I lead {lead} of {tolerance} tolerated{shear ? " · shear" : ""}
                    </span>
                  </div>
                  <div className="relative mt-2 h-2 bg-border" aria-hidden>
                    <div className="absolute inset-y-0 left-0 bg-accent" style={{ width: `${(Math.min(6, t.phase) / 6) * 100}%` }} />
                    <span className="absolute top-[-3px] h-3.5 w-0.5 bg-primary" style={{ left: `${(Math.min(6, r.a) / 6) * 100}%` }} />
                  </div>
                  {t.description && <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={text} fileName="Vinculum-Track-Sequencing" />
      </div>
    </section>
  );
}
