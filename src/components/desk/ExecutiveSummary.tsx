import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Printer } from "lucide-react";
import { sha256HexText } from "@/lib/chancelleryCrypto";
import { canonicalJson } from "./registry";
import { radarPoints, type ExecSummary } from "./executiveBrief";

/** Compact SVG radar of the four bonds (1.0 to 5.0). */
export function SummaryRadar({ scores, size = 150 }: { scores: (number | null)[]; size?: number }) {
  const pts = radarPoints(scores, size);
  const ring = (t: number) => radarPoints([1 + 4 * t, 1 + 4 * t, 1 + 4 * t, 1 + 4 * t], size).map((p) => `${p.x},${p.y}`).join(" ");
  const axes = radarPoints([5, 5, 5, 5], size);
  const labels = ["I", "C", "G", "R"];
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label={`Bond radar: ${scores.map((x) => (x === null ? "not scored" : x.toFixed(1))).join(", ")}`} className="max-w-full">
      {[0.25, 0.5, 0.75, 1].map((t) => <polygon key={t} points={ring(t)} fill="none" stroke="hsl(var(--border))" strokeWidth={0.8} />)}
      {axes.map((p, i) => (
        <g key={i}>
          <line x1={size / 2} y1={size / 2} x2={p.x} y2={p.y} stroke="hsl(var(--border))" strokeWidth={0.8} />
          <text x={p.x + (p.x - size / 2) * 0.08} y={p.y + (p.y - size / 2) * 0.08 + 3} textAnchor="middle" fontSize={8} fill="hsl(var(--muted-foreground))">{labels[i]}</text>
        </g>
      ))}
      <polygon points={pts.map((p) => `${p.x},${p.y}`).join(" ")} fill="hsl(var(--brass) / 0.35)" stroke="hsl(var(--primary))" strokeWidth={1.4} />
    </svg>
  );
}

/** The sheet itself: one page, masthead, two columns, footer. Used on screen and in print. */
export function ExecutiveSheet({ m, archivalHash }: { m: ExecSummary; archivalHash: string }) {
  const meta: [string, string][] = [
    ["Sovereign parties", m.masthead.parties],
    ["Active theatre", m.masthead.theatre],
    ["Accredited envoy", m.masthead.envoy],
    ["Assessment (UTC)", m.masthead.assessedUtc],
    ["Handling", m.masthead.classification],
    ["Seal stamp", m.masthead.seal],
  ];
  const th = "py-1 pr-2 text-left text-[9px] uppercase tracking-[0.12em] font-semibold text-muted-foreground";
  return (
    <article className="vs-exec-sheet border-2 border-double border-primary bg-background p-4 text-foreground" data-testid="executive-summary">
      <div className="border-b border-brass pb-2">
        <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Vinculum Chancellery · Executive Action Summary</p>
        <h2 className="font-serif text-xl leading-tight text-primary [overflow-wrap:anywhere]">{m.masthead.title}</h2>
        <dl className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1">
          {meta.map(([k, v]) => (
            <div key={k} className="min-w-0">
              <dt className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">{k}</dt>
              <dd className="text-[11px] [overflow-wrap:anywhere]">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
      <div className="mt-3 grid gap-4 sm:grid-cols-[2fr_3fr]">
        <section className="vs-exec-block min-w-0">
          <h3 className="text-[9px] uppercase tracking-[0.16em] font-semibold text-primary">Bond ratings</h3>
          <div className="flex justify-center"><SummaryRadar scores={m.bonds.map((b) => b.score)} /></div>
          <table className="w-full text-[11px]">
            <tbody>
              {m.bonds.map((b) => (
                <tr key={b.name} className="border-t border-border">
                  <td className="py-0.5 pr-2">{b.name}</td>
                  <td className="py-0.5 text-right font-mono tabular-nums">{b.score === null ? "—" : b.score.toFixed(1)}</td>
                  <td className="py-0.5 pl-2 text-right text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{b.band}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="border border-border p-2"><p className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Rupture R</p><p className="font-serif text-2xl text-primary tabular-nums">{m.rupture === null ? "—" : `${m.rupture}%`}</p><p className="text-[9px] text-muted-foreground">{m.ruptureBand}</p></div>
            <div className="border border-border p-2"><p className="text-[8px] uppercase tracking-[0.14em] text-muted-foreground">Exposure U</p><p className="font-serif text-2xl text-primary tabular-nums">{m.exposure === null ? "—" : m.exposure}</p><p className="text-[9px] text-muted-foreground">points</p></div>
          </div>
        </section>
        <section className="vs-exec-block min-w-0 space-y-3">
          <table className="w-full text-[11px]">
            <thead><tr><th className={th}>Active inscribed shocks</th></tr></thead>
            <tbody>
              {m.shocks.length ? m.shocks.map((x, i) => <tr key={i} className="border-t border-border"><td className="py-0.5 [overflow-wrap:anywhere]">{x}</td></tr>) : <tr><td className="py-0.5 text-muted-foreground">None active.</td></tr>}
            </tbody>
          </table>
          <table className="w-full text-[11px]">
            <thead><tr><th className={th}>Covenants · open redline flags {m.redlineFlags}</th><th className={`${th} text-right`}>Status</th></tr></thead>
            <tbody>
              {m.covenants.length ? m.covenants.map((c, i) => (
                <tr key={i} className="border-t border-border"><td className="py-0.5 pr-2 [overflow-wrap:anywhere]">{c.text}</td><td className={`py-0.5 text-right text-[9px] uppercase tracking-[0.1em] ${c.contested ? "text-terracotta" : "text-muted-foreground"}`}>{c.contested ? "Contested" : "Of record"}</td></tr>
              )) : <tr><td className="py-0.5 text-muted-foreground" colSpan={2}>No covenants of record.</td></tr>}
            </tbody>
          </table>
          <table className="w-full text-[11px]">
            <thead><tr><th className={th}>Evidentiary readiness gates · {m.gatesCleared} of {m.gates.length}</th><th className={`${th} text-right`}>Verdict</th></tr></thead>
            <tbody>
              {m.gates.map((g) => (
                <tr key={g.name} className="border-t border-border">
                  <td className="py-0.5 pr-2">{g.name}</td>
                  <td className="py-0.5 text-right"><span className={`inline-block border px-1.5 text-[9px] font-semibold uppercase tracking-[0.1em] ${g.cleared ? "border-emerald text-emerald" : "border-destructive text-destructive"}`}>{g.cleared ? "Cleared" : "Not cleared"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
      <div className="mt-3 border-t border-brass pt-2 text-[9px] leading-snug text-muted-foreground">
        <p>{m.notice}</p>
        <p className="mt-1 font-mono [overflow-wrap:anywhere]">Archival hash (SHA-256 of this summary) · {archivalHash || "computing"}</p>
      </div>
    </article>
  );
}

/** SHA-256 of the canonical summary model, the sheet's archival hash. */
export function useArchivalHash(m: ExecSummary): string {
  const [h, setH] = useState("");
  const key = canonicalJson(m);
  useEffect(() => {
    let live = true;
    sha256HexText(key).then((x) => live && setH(x)).catch(() => live && setH(""));
    return () => {
      live = false;
    };
  }, [key]);
  return h;
}

/**
 * The on-screen summary with a Print action. Printing mounts the sheet in a dedicated
 * body-level node and the print stylesheet shows only that node, on one portrait page
 * with 0.5 in margins and exact colours.
 */
export default function ExecutiveSummary({ m }: { m: ExecSummary }) {
  const hash = useArchivalHash(m);
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    if (!printing) return;
    document.documentElement.classList.add("vs-print-exec");
    const done = () => setPrinting(false);
    window.addEventListener("afterprint", done);
    const t = window.setTimeout(() => window.print(), 50);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("afterprint", done);
      document.documentElement.classList.remove("vs-print-exec");
    };
  }, [printing]);
  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <button type="button" onClick={() => setPrinting(true)} className="inline-flex min-h-10 items-center gap-2 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent">
          <Printer size={13} /> Print one-page summary
        </button>
      </div>
      <ExecutiveSheet m={m} archivalHash={hash} />
      {printing && createPortal(<div id="vs-exec-print"><ExecutiveSheet m={m} archivalHash={hash} /></div>, document.body)}
    </div>
  );
}
