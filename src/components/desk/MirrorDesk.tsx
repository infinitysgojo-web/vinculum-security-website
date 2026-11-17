import { useMemo, useState } from "react";
import { CASES, DOMAINS } from "@/content/cases";
import { PAIRINGS } from "@/content/pairings";
import DiagnosticMirror from "@/components/DiagnosticMirror";
import DeskOutput from "./DeskOutput";
import SyncPanel from "./SyncPanel";
import { useEngine, usePublish } from "./engine";
import { useMission } from "./mission";

/**
 * Desk 04 · Comparative Mirror. Two or three documented theatres read against one rubric,
 * with the live theatre's bond vector plotted beside them while the desk is linked to the
 * mission engine. Publishes only its selection ("mirrors") to the bus.
 */
export default function MirrorDesk() {
  const [picked, setPicked] = useState<string[]>(["kenya", "northern-ireland"]);
  const { signals } = useEngine();
  // Linked: the live theatre's own bond vector can be drawn on the radar. Unlinked: historical cases only.
  const [linked, setLinked] = useState(true);
  const [showLive, setShowLive] = useState(true);
  const liveVector = useMemo(
    () =>
      linked && signals.bonds
        ? [signals.bonds.interpersonal, signals.bonds.communal, signals.bonds.intergenerational, signals.bonds.institutional]
        : null,
    [linked, signals.bonds],
  );
  const analogue = linked && signals.analogue ? CASES.find((c) => c.shortTitle === signals.analogue) : undefined;
  // The three nearest documented cases from the live reading, closest first.
  const nearestThree = linked
    ? ((signals.analogues ?? (signals.analogue ? [signals.analogue] : []))
        .map((t) => CASES.find((c) => c.shortTitle === t))
        .filter(Boolean) as typeof CASES)
    : [];
  const topThreeMirrored = nearestThree.length > 0 && nearestThree.every((c) => picked.includes(c.slug)) && picked.length === nearestThree.length;

  const toggle = (slug: string) =>
    setPicked((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= 3
          ? prev
          : [...prev, slug]
    );

  const selected = picked
    .map((s) => CASES.find((c) => c.slug === s))
    .filter(Boolean) as typeof CASES;

  const mission = useMission();
  // Publish the comparative selection to the mission engine.
  usePublish("mirror", { mirrors: picked });

  const mirrorText = useMemo(() => {
    const bar = "-".repeat(64);
    const fmt = (v: readonly number[]) => v.map((n) => n.toFixed(1)).join(", ");
    const rank = (c: (typeof CASES)[number]) =>
      c.scores.map((score, idx) => ({ score, domain: DOMAINS[idx], why: c.rationales[idx] })).sort((a, b) => a.score - b.score);
    const pairing = PAIRINGS.find((p) => p.slugs.length === picked.length && p.slugs.every((x) => picked.includes(x)));
    const L = [
      "VINCULUM SECURITY · COMPARATIVE PRECEDENT MIRROR",
      "Desk 4 · Cross-Theater Diagnostic Mirror",
      "",
      `THEATRE: ${mission.theatre.trim() || "Unnamed theatre"}`,
      `DRAFTING OFFICER: ${mission.officer.trim() || "Not recorded"}`,
      `CLASSIFICATION: ${mission.classification.trim() || "Unrestricted, working draft"}`,
      "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.",
      "",
      bar,
      "I. SELECTED THEATRES (Interpersonal, Communal, Intergenerational, Institutional)",
      bar,
      ...(liveVector ? [`  Live theatre: (${fmt(liveVector)})`] : ["  Live theatre: not linked or not yet scored"]),
      ...selected.map((c) => {
        const d = liveVector ? Math.sqrt(c.scores.reduce((a, v, i) => a + (v - liveVector[i]) ** 2, 0)) : null;
        return `  ${c.shortTitle} (§ VII.${c.ref}): (${fmt(c.scores)})${d !== null ? ` · distance from live ${d.toFixed(2)}` : ""}`;
      }),
      "",
      bar,
      "II. CURATED PAIRING",
      bar,
      pairing ? `  ${pairing.label}: ${pairing.note}` : "  No curated pairing; a custom comparison.",
      "",
      bar,
      "III. THE FOUR DOCTRINAL INQUIRIES",
      bar,
    ];
    selected.forEach((c) => {
      const r = rank(c);
      L.push(
        "",
        `  ${c.shortTitle.toUpperCase()}`,
        `  Inquiry I · Primary rupture point: ${r[0].domain} (${r[0].score.toFixed(1)}). ${r[0].why}`,
        `  Inquiry II · Intervention mechanism: ${r[3].domain} (${r[3].score.toFixed(1)}). ${r[3].why}`,
        `  Inquiry III · Unresolved vulnerability: ${r[1].domain} (${r[1].score.toFixed(1)}). ${r[1].why}`,
        `  Inquiry IV · Transferable lesson: ${c.takeaway}`
      );
    });
    L.push(
      "",
      bar,
      "IV. CAUTIONARY NOTES",
      bar,
      "  · A precedent is a mirror, not a template. Institutions do not transfer between theatres; only tested relational lessons do.",
      "  · Resemblance in scores is not resemblance in history. Verify each lesson against the live theatre's own sources.",
      "  · Do not stage a precedent's ceremony without its substance. Anti-theatrics: an outcome test applies to every borrowed mechanism.",
      "",
      "Pro Omni Humanitate."
    );
    return L.join("\n");
  }, [mission, picked, selected, liveVector]);

  return (
    <div className="space-y-5">
      <SyncPanel
        linked={linked}
        onToggle={setLinked}
        summary={(x) =>
          x.bonds
            ? [
                `The live theatre vector (${[x.bonds.interpersonal, x.bonds.communal, x.bonds.intergenerational, x.bonds.institutional].map((n) => n.toFixed(1)).join(", ")}) is available to plot on the radar beside the selected cases.`,
                ...(x.analogues?.length
                  ? [`Nearest documented cases by Euclidean distance: ${x.analogues.join(", ")}.`]
                  : x.analogue
                    ? [`Closest documented case by Euclidean distance: ${x.analogue}.`]
                    : []),
              ]
            : []
        }
      />
      {liveVector && (
        <label className="flex min-h-11 cursor-pointer items-center gap-3 border border-brass/40 bg-background/70 px-4 py-2 text-xs text-foreground/85">
          <input
            type="checkbox"
            checked={showLive}
            onChange={(e) => setShowLive(e.target.checked)}
            className="accent-[hsl(var(--accent))]"
          />
          Plot the live theatre vector on the radar
        </label>
      )}
      {nearestThree.length > 0 && !topThreeMirrored && (
        <div className="border border-brass/40 bg-background/70 p-4 flex flex-wrap items-center justify-between gap-3" data-testid="mirror-top-three">
          <p className="text-xs text-foreground/85 min-w-0 [overflow-wrap:anywhere]">
            Your live bond reading sits closest to{" "}
            {nearestThree.map((c, i) => (
              <span key={c.slug}>
                {i > 0 && (i === nearestThree.length - 1 ? ", then " : ", ")}
                <span className="font-semibold">{c.shortTitle}</span>
              </span>
            ))}
            .
          </p>
          <button type="button" onClick={() => setPicked(nearestThree.map((c) => c.slug).slice(0, 3))}
            className="min-h-10 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent">
            {nearestThree.length > 1 ? "Mirror top three" : "Mirror it"}
          </button>
        </div>
      )}
      <div className="border border-brass/40 bg-navy-tint/40 p-4 sm:p-5" role="group" aria-label="Select two or three documented theatres for comparison">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70">
            Select two or three theatres
          </p>
          <span className="text-[10px] font-mono text-muted-foreground">
            {picked.length}/3 selected
          </span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {CASES.map((c) => {
            const on = picked.includes(c.slug);
            return (
              <button
                key={c.slug}
                type="button"
                aria-pressed={on}
                onClick={() => toggle(c.slug)}
                disabled={!on && picked.length >= 3}
                className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.2em] transition-all disabled:opacity-40 ${
                  on
                    ? "bg-accent text-accent-foreground border-accent"
                    : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
                }`}
              >
                {c.shortTitle}
              </button>
            );
          })}
        </div>
      </div>
      <DiagnosticMirror cases={selected} onSelectPairing={setPicked} live={showLive ? liveVector : null} custom={signals.customPrecedents ?? []} />
      {(signals.customPrecedents?.length ?? 0) > 0 && (
        <div className="w-full min-w-0 overflow-x-auto border border-brass/40 bg-background p-4">
          <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-3">Inscribed precedents against the live vector</p>
          <table className="w-full min-w-[420px] border-collapse text-xs">
            <thead>
              <tr className="border-b border-border text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <th className="py-2 pr-3 whitespace-nowrap">Precedent</th>
                <th className="py-2 pr-3 whitespace-nowrap">Vector</th>
                <th className="py-2 pr-3 whitespace-nowrap">Distance</th>
                <th className="py-2 whitespace-nowrap">Resonance</th>
              </tr>
            </thead>
            <tbody>
              {signals.customPrecedents!.map((p) => {
                const d = liveVector ? Math.sqrt(p.scores.reduce((a, v, i) => a + (v - liveVector[i]) ** 2, 0)) : null;
                return (
                  <tr key={p.id} className="border-b border-border/60">
                    <td className="py-2 pr-3 text-primary">{p.name}</td>
                    <td className="py-2 pr-3 font-mono">({p.scores.map((x) => x.toFixed(1)).join(", ")})</td>
                    <td className="py-2 pr-3 font-mono">{d === null ? "not linked" : d.toFixed(2)}</td>
                    <td className="py-2 font-mono">{d === null ? "not linked" : `${Math.round((1 - d / 8) * 100)}%`}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      {selected.length >= 2 && (
        <div className="w-full min-w-0">
          <DeskOutput text={mirrorText} fileName="Vinculum-Comparative-Mirror" />
        </div>
      )}
    </div>
  );
}
