import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { alerts, hasSignal, relationalDynamics, BOND_NAMES, type Alert, type Signals } from "./engine";
import { Lex } from "./Lexicon";
import { Button } from "@/components/ui/button";

/** Telemetry labels that carry a lexicon definition. */
const LEX_FOR: Record<string, string> = { "Limiting bond": "liebig", "Rupture index": "rupture", "Track gap": "track-divergence", "Relational deficit": "deficit", "Contagion": "contagion", "Entropy": "entropy", "Decay": "decay" };

/** The bond domain an alert bears on, read from the alert itself or the live bus. */
function domainOf(a: Alert, s: Signals): string {
  const named = (BOND_NAMES as readonly string[]).find((d) => a.name.includes(d) || a.reading.includes(d.toLowerCase()));
  if (named) return named;
  if (/elite-pact/i.test(a.name)) return "Communal";
  return s.weakestBond ?? "All four bonds";
}

/** The standing readout carried across the top of every desk. */
export default function TelemetryStrip({ signals }: { signals: Signals }) {
  const [open, setOpen] = useState(false);
  if (!hasSignal(signals)) return null;
  const a = alerts(signals);
  const criticalAlerts = a.filter((x) => x.level === "critical");
  const critical = criticalAlerts.length;
  const elevated = a.filter((x) => x.level === "elevated").length;

  const cells: { k: string; v: string }[] = [];
  if (signals.bondMean !== undefined) cells.push({ k: "Bond mean", v: `${signals.bondMean.toFixed(2)} of 5` });
  if (signals.weakestBond) cells.push({ k: "Limiting bond", v: `${signals.weakestBond}${signals.weakestScore !== undefined ? ` ${signals.weakestScore.toFixed(1)}${signals.weakestBand ? ` · ${signals.weakestBand}` : ""}` : ""}` });
  if (signals.rupture !== undefined) cells.push({ k: "Rupture index", v: `${signals.rupture}% ${signals.ruptureBand ?? ""}` });
  if (signals.trackGap !== undefined) cells.push({ k: "Track gap", v: `${signals.trackGap}${signals.trackTolerance !== undefined ? ` (tolerance ${signals.trackTolerance})` : ""}` });
  if (signals.shocks?.length) cells.push({ k: "Shocks active", v: String(signals.shocks.length) });
  if (signals.covenants?.length) cells.push({ k: "Covenants", v: String(signals.covenants.length) });
  const dyn = relationalDynamics(signals);
  if (dyn) {
    cells.push({ k: "Relational deficit", v: `${dyn.deficit.toFixed(1)} · ${dyn.deficitPct}%` });
    cells.push({ k: "Contagion", v: `${dyn.contagion}%` });
    cells.push({ k: "Entropy", v: `H ${dyn.entropy.toFixed(2)}` });
    cells.push({ k: "Decay", v: `${dyn.character} · Ω ${dyn.omega.toFixed(2)}` });
  }
  const alertValue = critical ? `${critical} critical` : elevated ? `${elevated} elevated` : "none standing";

  return (
    <div className="mb-5">
      <div
        className={`relative border px-3 py-3 sm:px-4 ${
          critical ? "border-destructive/60 bg-destructive/5" : "border-brass/40 bg-navy-tint/40"
        }`}
      >
        {critical > 0 && (
          <span aria-hidden className="pointer-events-none absolute -inset-px border-2 border-destructive/60" />
        )}
        <p className="text-[9px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2">
          Mission engine · live telemetry
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-3">
          {cells.map((c) => (
            <div key={c.k} className="min-w-0 border-l border-brass/40 pl-3">
              <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                {LEX_FOR[c.k] ? <Lex term={LEX_FOR[c.k]}>{c.k}</Lex> : c.k}
              </p>
              <p className="min-h-10 text-xs sm:text-sm tabular-nums leading-snug [overflow-wrap:anywhere] text-primary">{c.v}</p>
            </div>
          ))}
          <Button variant="ghost"
            type="button"
            onClick={() => critical && setOpen((o) => !o)}
            aria-expanded={critical ? open : undefined}
            aria-controls="vs-critical-drawer"
            disabled={!critical}
            className={`group h-auto min-w-0 flex-col items-start justify-start whitespace-normal rounded-none border-l border-brass/40 pl-3 text-left ${critical ? "cursor-pointer" : "cursor-default"}`}
          >
            <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Alerts</p>
            <p
              className={`flex items-center gap-1 text-xs sm:text-sm font-serif leading-snug ${
                critical ? "text-destructive group-hover:underline" : "text-primary"
              }`}
            >
              {alertValue}
              {critical > 0 && <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
            </p>
          </Button>
        </div>
      </div>
      {critical > 0 && open && (
        <div id="vs-critical-drawer" className="border border-t-0 border-destructive/50 bg-background px-3 py-3 sm:px-4">
          <p className="text-[9px] uppercase tracking-[0.24em] font-semibold text-destructive mb-2">Standing critical locks</p>
          <ul className="space-y-3">
            {criticalAlerts.map((x) => (
              <li key={x.name} className="min-w-0 border-l-2 border-destructive/60 pl-3">
                <p className="text-xs font-semibold text-primary [overflow-wrap:anywhere]">
                  {x.name}
                  <span className="ml-2 text-[9px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                    Bond · {domainOf(x, signals)}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground [overflow-wrap:anywhere]">{x.reading}</p>
                <p className="mt-1 text-xs text-foreground/90 [overflow-wrap:anywhere]">
                  <span className="text-[9px] uppercase tracking-[0.16em] font-semibold text-accent">Directive · </span>
                  {x.directive}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
