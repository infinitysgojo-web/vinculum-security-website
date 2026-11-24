import { breachesFloor, stageGateAudit, statutoryClearances, useEngine, VIABLE_FLOOR } from "./engine";

/**
 * Which articles of the twenty-clearance schedule each desk feeds. Desks that
 * consolidate the whole mission (briefing, readiness, binder and the like) show
 * the five gates instead of single articles.
 */
const DESK_ARTICLES: Record<string, string[]> = {
  diagnostics: ["1.1", "1.2", "1.3", "1.4"],
  mirror: ["1.1", "1.3", "1.4"],
  sentinel: ["2.1", "2.2", "2.3", "2.4"],
  compound: ["4.2", "5.2"],
  multiparty: ["3.2", "3.3"],
  tracks: ["3.1", "3.2", "3.3", "3.4"],
  audit: ["2.2", "2.3"],
  verification: ["2.2", "2.3"],
  clauses: ["4.1", "4.2", "4.3"],
  redliner: ["4.4"],
  legal: ["4.1", "4.3"],
  succession: ["5.1", "5.2"],
  handover: ["5.3", "5.4"],
};

/** Statutory anchor shown under every desk header: the articles this desk bears on, read live from the bus. */
export default function StatutoryClearanceBar({ deskId }: { deskId: string }) {
  const { signals } = useEngine();
  const all = statutoryClearances(signals);
  const audit = stageGateAudit(signals);
  const ids = DESK_ARTICLES[deskId];
  const floorBreached = signals.weakestScore !== undefined && breachesFloor(signals.weakestScore);
  const cleared = all.filter((c) => c.passed).length;

  const chip = "inline-flex items-center gap-1.5 border px-2 py-1 font-mono text-[10px] whitespace-nowrap transition-all";
  const tone = (passed: boolean, binding: boolean) =>
    passed
      ? "border-emerald/70 bg-emerald/15 text-emerald shadow-[0_0_6px_hsl(var(--emerald)/0.2)] font-semibold"
      : binding
        ? "border-destructive/70 bg-destructive/15 text-destructive font-semibold shadow-[0_0_6px_hsl(var(--destructive)/0.2)]"
        : "border-brass/35 bg-navy-tint/25 text-muted-foreground";

  return (
    <div className={`mb-6 border px-3 sm:px-4 py-2.5 transition-colors shadow-sm ${floorBreached ? "border-destructive/60 bg-destructive/5" : "border-brass/45 bg-navy-tint/35"}`} aria-label="Statutory clearance anchor">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">
          Statutory anchor ·{" "}
          <span className="text-foreground">{ids ? `Articles ${ids.join(", ")}` : "Five stage gates"}</span>
        </p>
        <p className={`font-mono text-[10px] uppercase tracking-[0.12em] flex items-center gap-1.5 ${floorBreached ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
          {floorBreached && <span className="inline-block h-1.5 w-1.5 rounded-full bg-destructive animate-pulse" />}
          {cleared}/{all.length} clearances · {floorBreached ? `statutory rupture: floor ${VIABLE_FLOOR.toFixed(1)} breached` : `floor ${VIABLE_FLOOR.toFixed(1)} held`}
        </p>
      </div>
      <div className="mt-2 -mx-1 flex gap-1.5 overflow-x-auto pl-1 pr-4 pb-0.5 scrollbar-none [-webkit-overflow-scrolling:touch]">
        {ids
          ? all
              .filter((c) => ids.includes(c.id))
              .map((c) => (
                <span key={c.id} className={`${chip} ${tone(c.passed, c.binding)}`} title={c.name}>
                  <span>{c.id}</span>
                  <span className="text-[9px] uppercase tracking-wider">
                    {c.passed ? "Cleared" : c.binding ? (floorBreached && c.gate === "Vector Integrity" ? "Lock active" : "Locked") : "Advisory"}
                  </span>
                </span>
              ))
          : audit.gates.map((g, i) => (
              <span key={g.name} className={`${chip} ${tone(g.passed, true)}`} title={g.directive}>
                <span>G{i + 1}</span>
                <span className="text-[9px] uppercase tracking-wider">{g.passed ? "Cleared" : "Locked"}</span>
              </span>
            ))}
      </div>
    </div>
  );
}
