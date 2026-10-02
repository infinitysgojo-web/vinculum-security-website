import { alerts, hasSignal, type Signals } from "./engine";

/** The standing readout carried across the top of every desk. */
export default function TelemetryStrip({ signals }: { signals: Signals }) {
  if (!hasSignal(signals)) return null;
  const a = alerts(signals);
  const critical = a.filter((x) => x.level === "critical").length;
  const elevated = a.filter((x) => x.level === "elevated").length;

  const cells: { k: string; v: string }[] = [];
  if (signals.bondMean !== undefined) cells.push({ k: "Bond mean", v: `${signals.bondMean.toFixed(2)} of 5` });
  if (signals.weakestBond) cells.push({ k: "Limiting bond", v: `${signals.weakestBond}${signals.weakestScore !== undefined ? ` ${signals.weakestScore.toFixed(1)}${signals.weakestBand ? ` · ${signals.weakestBand}` : ""}` : ""}` });
  if (signals.rupture !== undefined) cells.push({ k: "Rupture index", v: `${signals.rupture}% ${signals.ruptureBand ?? ""}` });
  if (signals.trackGap !== undefined) cells.push({ k: "Track gap", v: `${signals.trackGap}${signals.trackTolerance !== undefined ? ` (tolerance ${signals.trackTolerance})` : ""}` });
  if (signals.shocks?.length) cells.push({ k: "Shocks active", v: String(signals.shocks.length) });
  if (signals.covenants?.length) cells.push({ k: "Covenants", v: String(signals.covenants.length) });
  cells.push({ k: "Alerts", v: critical ? `${critical} critical` : elevated ? `${elevated} elevated` : "none standing" });

  return (
    <div className="mb-5 border border-brass/40 bg-navy-tint/40 px-3 py-3 sm:px-4">
      <p className="text-[9px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2">
        Mission engine · live telemetry
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-2">
        {cells.map((c) => (
          <div key={c.k} className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{c.k}</p>
            <p
              className={`text-xs sm:text-sm font-serif leading-snug [overflow-wrap:anywhere] ${
                c.k === "Alerts" && critical ? "text-terracotta" : "text-primary"
              }`}
            >
              {c.v}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
