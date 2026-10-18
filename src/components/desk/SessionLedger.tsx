import { useEffect, useRef, useState } from "react";
import { ChevronDown, ClipboardCopy, ScrollText } from "lucide-react";
import { toast } from "sonner";
import { statutoryClearances, type BondVector, type Signals } from "./engine";
import { onDispatch } from "./registry";
import { auditLogText, formatEntry, logEvent, mintedKind, useSessionLedger } from "./ledgerStore";

const DOMAIN_KEYS = ["interpersonal", "communal", "intergenerational", "institutional"] as const satisfies readonly (keyof BondVector)[];

const DOMAIN_LABEL: Record<keyof BondVector, string> = {
  interpersonal: "Interpersonal",
  communal: "Communal",
  intergenerational: "Intergenerational",
  institutional: "Institutional-Relational",
};

const signed = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}`;

/**
 * Watches the live engine bus and the dispatch registry and writes real operational
 * events to the session ledger: shocks injected, custom covenants, traps and parties
 * inscribed, statutory articles cleared, and every reference minted. The readings the
 * desks publish while they mount form the baseline, so opening the dashboard logs
 * nothing by itself; only later transitions are recorded.
 */
const BASELINE_MS = 1500;

export function useLedgerWatch(signals: Signals) {
  const mountedAt = useRef(0);
  useEffect(() => {
    mountedAt.current = performance.now();
  }, []);
  const prev = useRef({
    shocks: new Set<string>(),
    customShocks: new Set<string>(),
    covenants: new Set<string>(),
    traps: new Set<string>(),
    parties: new Set<string>(),
    cleared: new Set<string>(),
  });

  useEffect(() => onDispatch((d) => logEvent(mintedKind(d.kind), `Ref ${d.ref}`)), []);

  useEffect(() => {
    const p = prev.current;
    const shocks = new Set(signals.shocks ?? []);
    const customShocks = new Map((signals.customShocks ?? []).map((s) => [s.id, s]));
    const covenants = new Map((signals.customCovenants ?? []).map((c) => [c.id, c]));
    const traps = new Map((signals.customTraps ?? []).map((t) => [t.id, t]));
    const parties = new Map((signals.customParties ?? []).map((x) => [x.id, x]));
    const clearances = statutoryClearances(signals);
    const cleared = new Set(clearances.filter((c) => c.passed).map((c) => c.id));

    if (mountedAt.current && performance.now() - mountedAt.current > BASELINE_MS) {
      shocks.forEach((s) => !p.shocks.has(s) && logEvent("SHOCK_INJECTED", s));
      customShocks.forEach((s, id) => {
        if (p.customShocks.has(id)) return;
        const deltas = DOMAIN_KEYS.filter((k) => s.deltas[k]).map((k) => `${signed(s.deltas[k])} ${DOMAIN_LABEL[k]}`);
        logEvent("SHOCK_INJECTED", `${s.name}${deltas.length ? ` (${deltas.join(", ")})` : ""}`);
      });
      covenants.forEach((c, id) => !p.covenants.has(id) && logEvent("CUSTOM_COVENANT", c.title));
      traps.forEach((t, id) => !p.traps.has(id) && logEvent("CUSTOM_TRAP", t.name));
      parties.forEach((x, id) => !p.parties.has(id) && logEvent("CUSTOM_PARTY", x.name));
      clearances.forEach((c) => {
        if (c.passed && !p.cleared.has(c.id)) logEvent("GATE_CLEARED", `Statutory Art. ${c.id} · ${c.name}`);
      });
    }
    prev.current = {
      shocks,
      customShocks: new Set(customShocks.keys()),
      covenants: new Set(covenants.keys()),
      traps: new Set(traps.keys()),
      parties: new Set(parties.keys()),
      cleared,
    };
  }, [signals]);
}

/** Collapsible drawer showing the in-memory chronological ledger, with a Copy Audit Log action. */
export default function SessionLedgerDrawer() {
  const entries = useSessionLedger();
  const [open, setOpen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(auditLogText(entries));
      toast.success(`Audit log copied · ${entries.length} entr${entries.length === 1 ? "y" : "ies"}`);
    } catch {
      toast.error("Copy failed. Open the ledger and select the entries manually.");
    }
  };

  return (
    <div className="border border-brass/40 bg-card/40 w-full min-w-0 max-w-full" data-testid="session-ledger">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="session-ledger-body"
          className="flex min-h-11 min-w-0 items-center gap-2 text-left"
        >
          <ScrollText size={14} className="text-accent shrink-0" />
          <span className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80">Session ledger</span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground" data-testid="session-ledger-count">
            {entries.length} event{entries.length === 1 ? "" : "s"} · in memory only
          </span>
          <ChevronDown size={14} className={`shrink-0 text-brass transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <button
          type="button"
          onClick={copy}
          disabled={entries.length === 0}
          className="inline-flex min-h-11 items-center gap-2 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ClipboardCopy size={13} /> Copy audit log
        </button>
      </div>
      {open && (
        <div id="session-ledger-body" className="border-t border-brass/30 px-4 py-3">
          {entries.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No events yet. Hydrating a theatre, injecting a shock, inscribing a covenant, clearing an article, minting a
              reference or moving an archive is recorded here with a UTC stamp. The ledger is cleared when the tab closes.
            </p>
          ) : (
            <ol className="max-h-64 overflow-y-auto space-y-1 font-mono text-[11px] leading-relaxed text-foreground/85">
              {[...entries].reverse().map((e) => (
                <li key={e.seq} className="[overflow-wrap:anywhere]">
                  {formatEntry(e)}
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
}
