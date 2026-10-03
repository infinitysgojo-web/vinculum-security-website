import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";
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

export default function TrackSequencer() {
  const [process, setProcess] = useState("");
  const [linked, setLinked] = useState(true);
  const { signals } = useEngine();
  const live = linked && hasSignal(signals);
  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) => setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

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
      `DATE: ${todayStamp()}`,
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
    L.push("", "Rule-based sequencing aid. Nothing entered here is stored or transmitted. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [process, done, r, live, signals, tolerance, tol, communal]);

  return (
    <section className={panel}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5">
          <div>
            <label className={label} htmlFor="tk-p">Process</label>
            <input id="tk-p" className={`${field} text-base sm:text-sm min-h-11`} value={process} onChange={(e) => setProcess(e.target.value)} placeholder="e.g. Lake Region talks, second round" />
          </div>
          {PHASES.map((ph) => (
            <div key={ph}>
              <p className={label}>{ph}</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {STEPS.filter((s) => s.phase === ph).map((s) => {
                  const blocked = blockedStep(s);
                  return (
                    <label key={s.id} className={`flex gap-3 items-start border border-border bg-background p-3 text-sm ${blocked ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}>
                      <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={done.includes(s.id)} disabled={blocked} onChange={() => toggle(s.id)} />
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
          <DeskOutput text={text} fileName="Vinculum-Track-Sequencing" />
        </div>
      </div>
    </section>
  );
}
