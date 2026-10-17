import { ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { type Signals } from "./engine";

type Read = { from: string; label: string; live: (s: Signals) => boolean };
type Flow = { reads: Read[]; publishes: string[] };

const BOND: Read = { from: "Diagnostics", label: "Bond vector and limiting bond", live: (s) => s.bonds !== undefined };
const COMMUNAL: Read = { from: "Diagnostics", label: "Communal bond band", live: (s) => s.bonds !== undefined };
const WEAK: Read = { from: "Diagnostics", label: "Limiting (weakest) bond", live: (s) => s.weakestBond !== undefined };
const RUPT: Read = { from: "Sentinel Matrix", label: "Rupture index and trend", live: (s) => s.rupture !== undefined };
const SHOCK: Read = { from: "Compound Shock", label: "Active shocks and first break", live: (s) => (s.shocks?.length ?? 0) > 0 };
const GAP: Read = { from: "Track Sequencing", label: "Track gap and Elite-Pact alert", live: (s) => s.trackGap !== undefined };
const COV: Read = { from: "Clause Architect", label: "Drafted covenants", live: (s) => (s.covenants?.length ?? 0) > 0 };
const SURV: Read = { from: "Succession Simulator", label: "Treaty survival score", live: (s) => s.survivalScore !== undefined };
const VER: Read = { from: "Verification Ledger", label: "Verifier seated", live: (s) => s.verifierSeated !== undefined };
const GATES: Read = { from: "Mission Readiness", label: "Lifecycle stages cleared", live: (s) => s.gatesCleared !== undefined };
const ANALOGUE: Read = { from: "Diagnostics", label: "Nearest documented case", live: (s) => s.analogue !== undefined };
const FRICTION: Read = { from: "De-confliction Bench", label: "Party friction pairs", live: (s) => (s.frictionPairs?.length ?? 0) > 0 };

/** Which desks feed which, keyed by dashboard desk id. Mirrors what each desk actually reads from the bus. */
const FLOW: Record<string, Flow> = {
  diagnostics: { reads: [], publishes: ["Bond vector (0.1 precision)", "Mean, variance, limiting bond and band", "Nearest documented case"] },
  sentinel: { reads: [], publishes: ["Rupture index and band", "Observation trend and multiplier (0.85 / 1.00 / 1.15)", "Latent traps"] },
  compound: { reads: [], publishes: ["Active shocks", "First provision to break", "Compound strain index"] },
  mirror: { reads: [ANALOGUE, BOND], publishes: ["Comparative precedent selection"] },
  briefing: { reads: [WEAK, RUPT], publishes: [] },
  counterpart: { reads: [WEAK, RUPT, GAP], publishes: [] },
  multiparty: { reads: [RUPT, GAP], publishes: ["Seated parties", "Friction pairs"] },
  tracks: { reads: [COMMUNAL, RUPT], publishes: ["Track I and II phase depth", "Communal-bond tolerance (0 / 1 / 2 phases)", "Elite-Pact alert"] },
  audit: { reads: [WEAK, RUPT, FRICTION], publishes: [] },
  clauses: { reads: [WEAK, RUPT, SHOCK, GAP], publishes: ["Covenants drafted"] },
  redliner: { reads: [WEAK, RUPT, SHOCK], publishes: ["Redline flag count"] },
  succession: { reads: [BOND, RUPT, COV], publishes: ["Treaty survival under stress"] },
  legal: { reads: [WEAK], publishes: [] },
  adversarial: { reads: [WEAK, GAP, COV, SURV], publishes: [] },
  readiness: { reads: [RUPT, GAP, WEAK, SURV, SHOCK, COV, VER], publishes: ["Lifecycle stages cleared"] },
  verification: { reads: [WEAK, COV, SHOCK], publishes: ["Verifier seated (releases the independent-verifier lock)"] },
  handover: { reads: [WEAK, RUPT, COV, GATES], publishes: ["Handover durability quotient H%", "Designated local oversight body"] },
  binder: { reads: [BOND, RUPT, SHOCK, GAP, COV, SURV, VER, GATES], publishes: [] },
};

/** Canonical desk id for each upstream source named in the chain. */
export const DESK_FOR_SOURCE: Record<string, string> = {
  Diagnostics: "diagnostics",
  "Sentinel Matrix": "sentinel",
  "Compound Shock": "compound",
  "Track Sequencing": "tracks",
  "Clause Architect": "clauses",
  "Succession Simulator": "succession",
  "Verification Ledger": "verification",
  "Mission Readiness": "readiness",
  "De-confliction Bench": "multiparty",
};

/** Whether a desk currently has its own telemetry live on the mission bus. */
const PUBLISHES: Record<string, (s: Signals) => boolean> = {
  diagnostics: (s) => s.bonds !== undefined,
  sentinel: (s) => s.rupture !== undefined,
  compound: (s) => (s.shocks?.length ?? 0) > 0,
  mirror: (s) => (s.mirrors?.length ?? 0) > 0,
  multiparty: (s) => (s.seatedParties ?? 0) > 0,
  tracks: (s) => s.trackGap !== undefined,
  clauses: (s) => (s.covenants?.length ?? 0) > 0,
  redliner: (s) => s.redlineFlags !== undefined,
  succession: (s) => s.survivalScore !== undefined,
  readiness: (s) => s.gatesCleared !== undefined,
  verification: (s) => s.verifierSeated !== undefined,
  handover: (s) => s.handoverViability !== undefined,
};
export function deskIsLive(deskId: string, s: Signals) {
  return PUBLISHES[deskId]?.(s) ?? false;
}

/**
 * Shows, for the active desk, which upstream readings it consumes (and whether
 * each is currently live on the bus) and what it publishes downstream.
 */
export default function MissionChain({
  deskId,
  signals,
  onNavigate,
}: {
  deskId: string;
  signals: Signals;
  onNavigate?: (deskId: string) => void;
}) {
  const flow = FLOW[deskId];
  if (!flow || (!flow.reads.length && !flow.publishes.length)) return null;
  return (
    <div className="mb-5 grid gap-4 border border-brass/40 bg-background/70 p-3 sm:grid-cols-2 sm:px-4">
      <div className="min-w-0">
        <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-primary/70">
          <ArrowDownToLine size={12} /> Reads from upstream
        </p>
        {flow.reads.length === 0 ? (
          <p className="text-xs text-muted-foreground">An origin desk. It takes no upstream input.</p>
        ) : (
          <ul className="space-y-1.5">
            {flow.reads.map((r) => {
              const on = r.live(signals);
              return (
                <li key={r.from + r.label} className="flex gap-2 text-xs">
                  <span className={on ? "text-accent" : "text-muted-foreground"} aria-hidden>{on ? "●" : "○"}</span>
                  <span className="min-w-0 [overflow-wrap:anywhere]">
                    <span className="text-foreground/90">{r.label}</span>{" "}
                    <span className="text-muted-foreground">
                      ·{" "}
                      {onNavigate && DESK_FOR_SOURCE[r.from] ? (
                        <button
                          type="button"
                          onClick={() => onNavigate(DESK_FOR_SOURCE[r.from])}
                          className="font-medium underline decoration-brass/60 underline-offset-2 hover:text-accent transition-colors"
                          title={on ? `Open ${r.from}` : `Calibrate ${r.from}`}
                        >
                          {r.from}
                        </button>
                      ) : (
                        r.from
                      )}{" "}
                      · {on ? "live" : "not yet set"}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="min-w-0">
        <p className="mb-2 flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.22em] text-primary/70">
          <ArrowUpFromLine size={12} /> Publishes downstream
        </p>
        {flow.publishes.length === 0 ? (
          <p className="text-xs text-muted-foreground">An output desk. It publishes no signal to the bus.</p>
        ) : (
          <ul className="space-y-1.5">
            {flow.publishes.map((p) => (
              <li key={p} className="flex gap-2 text-xs text-foreground/90">
                <span className="text-accent" aria-hidden>→</span>
                <span className="[overflow-wrap:anywhere]">{p}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
