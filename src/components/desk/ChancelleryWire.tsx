import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Activity, ChevronUp, ClipboardCopy, Download, Pause, Play, ScrollText, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { copyText } from "@/lib/clipboardGuard";
import { canonicalJson } from "./registry";
import { telemetrySnapshot, useBusMonitor, INSPECTOR_FIELD_KEYS } from "./busMonitor";
import { clearLedger, decisionLogText, decisionRecords, useSessionLedger } from "./ledgerStore";
import { bondBand, breachesFloor, holdsFloor, stageGateAudit, VIABLE_FLOOR, type Signals } from "./engine";
import { onDispatch, useStateDigest } from "./registry";

export type WireClass = "DISPATCH" | "GATE_ALERT" | "VECTOR_SHIFT";
type WireEvent = { n: number; t: number; cls: WireClass; text: string };

const BOND_LABEL: Record<string, string> = {
  interpersonal: "Interpersonal",
  communal: "Communal",
  intergenerational: "Intergenerational",
  institutional: "Institutional-Relational",
};

/** Session-relative wire clock: T+hh:mm:ss from the moment the terminal opened. */
function clock(ms: number): string {
  const s = Math.floor(ms / 1000);
  const p = (x: number) => String(x).padStart(2, "0");
  return `T+${p(Math.floor(s / 3600))}:${p(Math.floor((s % 3600) / 60))}:${p(s % 60)}`;
}

/** Differences between two bus states, as wire entries. */
function diff(prev: Signals, next: Signals): { cls: WireClass; text: string }[] {
  const out: { cls: WireClass; text: string }[] = [];
  if (next.bonds) {
    for (const k of Object.keys(BOND_LABEL) as (keyof NonNullable<Signals["bonds"]>)[]) {
      const a = prev.bonds?.[k];
      const b = next.bonds[k];
      if (a === undefined || a === b) continue;
      const ba = bondBand(a);
      const bb = bondBand(b);
      const d = Math.round((b - a) * 10) / 10;
      out.push({
        cls: "VECTOR_SHIFT",
        text: `${BOND_LABEL[k].toUpperCase()} ${a.toFixed(1)} -> ${b.toFixed(1)} (${d > 0 ? "+" : ""}${d.toFixed(1)})${ba !== bb ? ` // BAND ${ba.toUpperCase()} -> ${bb.toUpperCase()}` : ""}`,
      });
    }
  }
  const pw = prev.weakestScore;
  const nw = next.weakestScore;
  if (pw !== undefined && nw !== undefined) {
    if (holdsFloor(pw) && breachesFloor(nw))
      out.push({ cls: "GATE_ALERT", text: `VIABLE FLOOR BREACHED // LIMITING BOND ${String(next.weakestBond ?? "").toUpperCase()} ${nw.toFixed(1)} <= ${VIABLE_FLOOR.toFixed(1)}` });
    if (breachesFloor(pw) && holdsFloor(nw)) out.push({ cls: "GATE_ALERT", text: `VIABLE FLOOR RESTORED // LIMITING BOND ${nw.toFixed(1)}` });
  }
  const newTraps = (next.traps ?? []).filter((t) => !(prev.traps ?? []).includes(t));
  newTraps.forEach((t) => out.push({ cls: "GATE_ALERT", text: `SENTINEL TRAP ELEVATED // ${t.toUpperCase()}` }));
  if (prev.rupture !== next.rupture && next.rupture !== undefined && prev.ruptureBand !== next.ruptureBand)
    out.push({ cls: "GATE_ALERT", text: `RUPTURE INDEX ${next.rupture}% // BAND ${String(next.ruptureBand ?? "").toUpperCase()}` });
  const newShocks = (next.shocks ?? []).filter((x) => !(prev.shocks ?? []).includes(x));
  newShocks.forEach((x) =>
    out.push({ cls: "VECTOR_SHIFT", text: `SHOCK APPLIED // ${x.toUpperCase()}${next.shockSeverity !== undefined ? ` // STRAIN ${next.shockSeverity}` : ""}` }),
  );
  if (!prev.elitePactAlert && next.elitePactAlert) out.push({ cls: "GATE_ALERT", text: `ELITE-PACT MIRAGE // TRACK GAP ${next.trackGap ?? "?"} EXCEEDS TOLERANCE ${next.trackTolerance ?? "?"}` });
  if (prev.vetoHolder !== next.vetoHolder && next.vetoHolder) out.push({ cls: "GATE_ALERT", text: `VETO ASYMMETRY // HOLDOUT LEVERAGE: ${next.vetoHolder.toUpperCase()}` });
  if (next.presetEpoch !== undefined && prev.presetEpoch !== next.presetEpoch && next.presetId)
    out.push({ cls: "VECTOR_SHIFT", text: `THEATRE HYDRATED // ${next.presetId} // ${next.theatre ?? ""}`.trim() });
  if (prev.safeguardCoverage !== next.safeguardCoverage && next.safeguardCoverage !== undefined && prev.safeguardCoverage !== undefined)
    out.push({ cls: "VECTOR_SHIFT", text: `SAFEGUARD COVERAGE ${next.safeguardCoverage}%` });
  if (prev.litigationForum !== next.litigationForum && next.litigationForum && prev.litigationForum)
    out.push({ cls: "VECTOR_SHIFT", text: `LITIGATION FORUM // ${next.litigationForum.toUpperCase()}` });
  if (prev.counterpart !== next.counterpart && next.counterpart && prev.counterpart)
    out.push({ cls: "VECTOR_SHIFT", text: `COUNTERPART // ${next.counterpart.toUpperCase()}` });
  // Sovereign Custom Mode: every new inscription is announced on the wire by kind and name.
  const INS: [keyof Signals, string, (x: never) => string][] = [
    ["customRules", "BOUNDARY RULE", (x: string) => x],
    ["customParties", "PARTY", (x: { name: string }) => x.name],
    ["customTraps", "LATENT TRAP", (x: { name: string }) => x.name],
    ["customShocks", "COMPOUND SHOCK", (x: { name: string }) => x.name],
    ["customCovenants", "COVENANT", (x: { title: string }) => x.title],
    ["customGates", "READINESS GATE", (x: { label: string }) => x.label],
    ["customTracks", "TRACK III", (x: { name: string }) => x.name],
    ["customPrecedents", "PRECEDENT", (x: { name: string }) => x.name],
    ["customPhrases", "PROHIBITED PHRASE", (x: { phrase: string }) => x.phrase],
    ["customNotes", "NOTE", (x: { kind: string; title: string }) => `${x.kind}: ${x.title}`],
  ];
  for (const [k, label, name] of INS) {
    const before = new Set(((prev[k] as unknown[] | undefined) ?? []).map((x) => JSON.stringify(x)));
    for (const x of (next[k] as unknown[] | undefined) ?? [])
      if (!before.has(JSON.stringify(x)) && !(k === "customNotes" || k === "customTraps" || k === "customGates" || k === "customTracks"
        ? ((prev[k] as { id: string }[] | undefined) ?? []).some((p) => p.id === (x as { id: string }).id)
        : false))
        out.push({ cls: "VECTOR_SHIFT", text: `SOVEREIGN INSCRIPTION // ${label} // ${name(x as never).toUpperCase()}` });
  }
  const ga = stageGateAudit(prev).gates;
  const gb = stageGateAudit(next).gates;
  gb.forEach((g) => {
    const before = ga.find((x) => x.name === g.name);
    if (before && before.passed !== g.passed) out.push({ cls: "GATE_ALERT", text: `GATE ${g.name.toUpperCase()} ${g.passed ? "CLEARED" : "LOCKED"}` });
  });
  return out;
}

export type WireTab = "wire" | "signals" | "decisions";

/**
 * CHANCELLERY WIRE // RECORD OF DISPATCHES: a bottom drawer that logs the bus in real time.
 * Surface 1 of the operational suite expands it with two more trays: the Live Bus Signal
 * Inspector (read-only view of the reactive payload, with a 400 ms freshness pulse and the
 * last publisher) and the Chronological Mission Decision Log. Open state and tab can be
 * driven by the command palette.
 */
export default function ChancelleryWire({
  signals,
  openQuestions = 0,
  publisherLabel = (id: string) => id,
  open: openProp,
  onOpenChange,
  tab: tabProp,
  onTab,
}: {
  signals: Signals;
  openQuestions?: number;
  publisherLabel?: (id: string) => string;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
  tab?: WireTab;
  onTab?: (t: WireTab) => void;
}) {
  const [openState, setOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(open) : v;
    setOpenState(next);
    onOpenChange?.(next);
  };
  const [tabState, setTabState] = useState<WireTab>("wire");
  const tab = tabProp ?? tabState;
  const setTab = (t: WireTab) => {
    setTabState(t);
    onTab?.(t);
  };
  const [paused, setPaused] = useState(false);
  const [filter, setFilter] = useState<"ALL" | WireClass>("ALL");
  const [events, setEvents] = useState<WireEvent[]>([]);
  const t0 = useRef(performance.now());
  const n = useRef(0);
  const prev = useRef<Signals>(signals);
  const box = useRef<HTMLDivElement>(null);
  const digest = useStateDigest(signals);

  const push = (rows: { cls: WireClass; text: string }[]) => {
    if (!rows.length) return;
    const t = performance.now() - t0.current;
    setEvents((e) => [...e, ...rows.map((r) => ({ ...r, n: ++n.current, t }))].slice(-400));
  };

  useEffect(() => {
    push(diff(prev.current, signals));
    prev.current = signals;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signals]);

  useEffect(() => onDispatch((d) => push([{ cls: "DISPATCH", text: `MINTED ${d.kind.toUpperCase()}${d.desk ? ` FROM ${d.desk.toUpperCase()}` : ""} // ${d.ref} // ${d.digest.slice(0, 16)}` }])), []);

  const shown = filter === "ALL" ? events : events.filter((e) => e.cls === filter);

  useEffect(() => {
    if (!paused && open && tab === "wire" && box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [shown.length, paused, open, tab]);

  const line = (e: WireEvent) => `${String(e.n).padStart(4, "0")}  ${clock(e.t)}  ${e.cls.padEnd(12)}  ${e.text}`;

  const exportWire = () => {
    const body = [
      "CHANCELLERY WIRE // RECORD OF DISPATCHES",
      "Session-relative audit trail. Times are elapsed from terminal open (T+hh:mm:ss).",
      `STATE DIGEST AT EXPORT: ${digest || "pending"}`,
      "",
      ...events.map(line),
      "",
      "ENDS",
    ].join("\n");
    const url = URL.createObjectURL(new Blob([body], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "Vinculum-Chancellery-Wire.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const last = events[events.length - 1];
  const chip = "min-h-8 px-2 border text-[9px] uppercase tracking-[0.14em] font-semibold transition-colors";
  const tabs: { id: WireTab; label: string; icon: JSX.Element }[] = [
    { id: "wire", label: "Wire", icon: <ScrollText size={11} /> },
    { id: "signals", label: "Signal inspector", icon: <Activity size={11} /> },
    { id: "decisions", label: "Decision log", icon: <ScrollText size={11} /> },
  ];

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-primary bg-background/95 backdrop-blur print:hidden" data-testid="chancellery-wire">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="vs-wire"
        className="container flex h-9 w-full items-center gap-3 overflow-hidden text-left font-mono text-[10px] uppercase tracking-[0.14em] text-primary"
      >
        <span className="shrink-0 font-semibold">Chancellery wire</span>
        <span className="hidden sm:inline shrink-0 text-muted-foreground">// record of dispatches</span>
        <span className="min-w-0 flex-1 truncate normal-case tracking-normal text-muted-foreground">{last ? `${clock(last.t)} ${last.text}` : "Listening to the mission bus"}</span>
        <span className="shrink-0 text-muted-foreground">{events.length}</span>
        <ChevronUp size={14} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div id="vs-wire" className="container pb-3">
          <div className="mb-2 flex flex-wrap gap-1.5 border-b border-border pb-2" role="tablist" aria-label="Chancellery wire trays">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`${chip} inline-flex items-center gap-1 ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-brass/50 text-primary hover:border-accent"}`}
                data-testid={`wire-tab-${t.id}`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
          {tab === "wire" && (
            <>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                {(["ALL", "DISPATCH", "GATE_ALERT", "VECTOR_SHIFT"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFilter(f)}
                    aria-pressed={filter === f}
                    className={`${chip} ${filter === f ? "border-primary bg-primary text-primary-foreground" : "border-brass/50 text-primary hover:border-accent"}`}
                  >
                    {f}
                  </button>
                ))}
                <span className="ml-auto flex gap-2">
                  <button type="button" onClick={() => setPaused((p) => !p)} className={`${chip} inline-flex items-center gap-1 border-brass/50 text-primary hover:border-accent`}>
                    {paused ? <Play size={11} /> : <Pause size={11} />} {paused ? "Resume" : "Pause"}
                  </button>
                  <button type="button" onClick={exportWire} disabled={!events.length} className={`${chip} inline-flex items-center gap-1 border-brass/50 text-primary hover:border-accent disabled:opacity-40`}>
                    <Download size={11} /> Export
                  </button>
                </span>
              </div>
              <p className="mb-1 font-mono text-[10px] tabular-nums uppercase tracking-[0.12em] text-muted-foreground [overflow-wrap:anywhere]">
                Live state digest · <span className="text-primary normal-case">{digest ? digest : "computing"}</span>
              </p>
              <div ref={box} className="h-48 sm:h-56 overflow-y-auto border border-border bg-background p-2 font-mono text-[10px] tabular-nums leading-relaxed">
                {shown.length === 0 ? (
                  <p className="text-muted-foreground">No entries in this class yet. Adjust a bond or mint a dispatch.</p>
                ) : (
                  shown.map((e) => (
                    <p key={e.n} className="whitespace-pre-wrap [overflow-wrap:anywhere]">
                      <span className="text-muted-foreground">{String(e.n).padStart(4, "0")} {clock(e.t)} </span>
                      <span className={e.cls === "GATE_ALERT" ? "text-destructive" : e.cls === "DISPATCH" ? "text-accent" : "text-primary"}>{e.cls}</span>{" "}
                      <span className="text-foreground/90">{e.text}</span>
                    </p>
                  ))
                )}
              </div>
            </>
          )}
          {tab === "signals" && <SignalInspector signals={signals} openQuestions={openQuestions} publisherLabel={publisherLabel} />}
          {tab === "decisions" && <DecisionLog />}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Live Bus Signal Inspector                                           */
/* ------------------------------------------------------------------ */

const signed1 = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(1)}`;

/** One inspector value. The key changes with each publication that touches it, restarting the 400 ms pulse. */
function Fresh({ seq, children, className = "" }: { seq: number; children: ReactNode; className?: string }) {
  return (
    <span key={seq} className={`${seq > 0 ? "vs-signal-fresh" : ""} ${className}`} data-seq={seq}>
      {children}
    </span>
  );
}

function SignalInspector({ signals, openQuestions, publisherLabel }: { signals: Signals; openQuestions: number; publisherLabel: (id: string) => string }) {
  const mon = useBusMonitor();
  // A pure read of the bus: the snapshot is a fresh object and is never written back.
  const t = useMemo(() => telemetrySnapshot(signals, { openQuestions }), [signals, openQuestions]);
  const seqOf = (k: keyof typeof INSPECTOR_FIELD_KEYS) => Math.max(0, ...INSPECTOR_FIELD_KEYS[k].map((x) => mon.changedAt[x] ?? 0));
  const [oq, setOq] = useState({ v: openQuestions, seq: 0 });
  useEffect(() => setOq((p) => (p.v === openQuestions ? p : { v: openQuestions, seq: p.seq + 1 })), [openQuestions]);
  const [age, setAge] = useState(0);
  useEffect(() => {
    if (!mon.last) return;
    setAge(0);
    const id = window.setInterval(() => setAge(Math.round((Date.now() - (mon.last?.at ?? Date.now())) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [mon.last]);
  const raw = useMemo(() => JSON.stringify(JSON.parse(canonicalJson(signals)), null, 1), [signals]);
  const cell = "border border-border p-2 min-w-0";
  const k = "block text-[9px] uppercase tracking-[0.12em] text-muted-foreground [overflow-wrap:anywhere]";
  return (
    <div className="max-h-[50vh] overflow-y-auto font-mono text-xs tabular-nums" data-testid="signal-inspector">
      <p className="mb-2 text-[10px] text-muted-foreground [overflow-wrap:anywhere]" data-testid="active-publisher">
        Active publisher ·{" "}
        {mon.last ? (
          <span className="text-primary">
            {publisherLabel(mon.last.desk)} <span className="text-muted-foreground">({mon.last.keys.slice(0, 6).join(", ")}{mon.last.keys.length > 6 ? ` +${mon.last.keys.length - 6}` : ""}) · {age}s ago · {mon.count} publication{mon.count === 1 ? "" : "s"}</span>
          </span>
        ) : (
          "no publication since this terminal opened"
        )}
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className={cell}><span className={k}>rupture (0–100)</span><Fresh seq={seqOf("rupture")} className="text-primary text-sm">{t.rupture ?? "—"}</Fresh></div>
        <div className={cell}><span className={k}>bondDelta mean (±5.0)</span><Fresh seq={seqOf("bondDelta")} className="text-primary text-sm">{signed1(t.bondDeltaMean)}</Fresh></div>
        <div className={cell}><span className={k}>legitimacyPenalty (0–40)</span><Fresh seq={seqOf("legitimacyPenalty")} className="text-primary text-sm">{t.legitimacyPenalty}</Fresh></div>
        <div className={cell}><span className={k}>openQuestionsCount</span><Fresh seq={oq.seq} className="text-primary text-sm">{t.openQuestionsCount}</Fresh></div>
      </div>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(Object.entries(t.bondDelta) as [string, number][]).map(([b, v]) => (
          <div key={b} className={cell}><span className={k}>bondDelta.{b}</span><Fresh seq={seqOf("bondDelta")} className="text-primary">{signed1(v)}</Fresh></div>
        ))}
      </div>
      <p className={`${k} mt-3`}>customShocks [{t.customShocks.length}]</p>
      <Fresh seq={seqOf("customShocks")} className="block">
        {t.customShocks.length === 0 ? <span className="text-muted-foreground">[]</span> : (
          <ul aria-live="polite" aria-relevant="additions" className="space-y-0.5">
            {t.customShocks.map((x) => (
              <li key={x.id} className="[overflow-wrap:anywhere]"><span className="text-muted-foreground">{x.id}</span> <span className="text-primary">{x.title}</span> <span className="text-muted-foreground">Δ {signed1(x.deltas.interpersonal)} / {signed1(x.deltas.communal)} / {signed1(x.deltas.intergenerational)} / {signed1(x.deltas.institutional)}</span></li>
            ))}
          </ul>
        )}
      </Fresh>
      <p className={`${k} mt-3`}>customCovenants [{t.customCovenants.length}]</p>
      <Fresh seq={seqOf("customCovenants")} className="block">
        {t.customCovenants.length === 0 ? <span className="text-muted-foreground">[]</span> : (
          <ul className="space-y-0.5">
            {t.customCovenants.map((c) => (
              <li key={c.id} className="[overflow-wrap:anywhere]"><span className="text-muted-foreground">Art. {c.article || "—"}</span> <span className="text-primary">{c.text}</span> <span className="text-muted-foreground">[{c.category}]</span></li>
            ))}
          </ul>
        )}
      </Fresh>
      <details className="mt-3 border-t border-border pt-2">
        <summary className="cursor-pointer text-[10px] uppercase tracking-[0.12em] text-primary min-h-8 flex items-center">Raw reactive payload ({Object.keys(signals).length} keys)</summary>
        <pre className="mt-1 max-h-48 overflow-auto whitespace-pre-wrap text-[10px] text-foreground/85 [overflow-wrap:anywhere]">{raw}</pre>
      </details>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chronological Mission Decision Log                                  */
/* ------------------------------------------------------------------ */

function DecisionLog() {
  const entries = useSessionLedger();
  const rows = useMemo(() => decisionRecords(entries), [entries]);
  const [confirm, setConfirm] = useState(false);
  const chip = "inline-flex min-h-8 items-center gap-1 border px-2 text-[9px] uppercase tracking-[0.14em] font-semibold disabled:opacity-40";
  const copy = async () => {
    try {
      await copyText(decisionLogText(entries));
      toast.success(`Audit ledger copied · ${rows.length} decision${rows.length === 1 ? "" : "s"}`);
    } catch {
      toast.error("Copy failed. Select the entries manually.");
    }
  };
  return (
    <div data-testid="decision-log">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{rows.length} decision{rows.length === 1 ? "" : "s"} · UTC · this tab only</span>
        <span className="ml-auto flex flex-wrap gap-2">
          <button type="button" onClick={copy} disabled={!rows.length} className={`${chip} border-brass/50 text-primary hover:border-accent`}>
            <ClipboardCopy size={11} /> Copy audit ledger
          </button>
          {confirm ? (
            <span className="inline-flex items-center gap-1" role="group" aria-label="Confirm clearing the session ledger">
              <span className="text-[10px] text-destructive">Clear all {entries.length} ledger entries?</span>
              <button type="button" onClick={() => { clearLedger(); setConfirm(false); toast.success("Session ledger cleared"); }} className={`${chip} border-destructive text-destructive`}>Confirm</button>
              <button type="button" onClick={() => setConfirm(false)} className={`${chip} border-border text-muted-foreground`}>Cancel</button>
            </span>
          ) : (
            <button type="button" onClick={() => setConfirm(true)} disabled={!entries.length} className={`${chip} border-border text-muted-foreground hover:text-destructive`}>
              <Trash2 size={11} /> Clear session ledger
            </button>
          )}
        </span>
      </div>
      <div className="h-48 sm:h-56 overflow-auto border border-border bg-background">
        {rows.length === 0 ? (
          <p className="p-2 font-mono text-[10px] text-muted-foreground">No decisions yet. Inscribing or lifting a shock, inscribing, amending or striking a covenant, a redline, a readiness gate, an escrow change or a profile amendment is recorded here.</p>
        ) : (
          <table className="w-full min-w-[36rem] border-collapse font-mono text-[10px] tabular-nums">
            <thead className="sticky top-0 bg-background">
              <tr className="text-left text-muted-foreground">
                <th className="px-2 py-1 font-semibold">id</th>
                <th className="px-2 py-1 font-semibold">timestamp (UTC)</th>
                <th className="px-2 py-1 font-semibold">desk</th>
                <th className="px-2 py-1 font-semibold">action</th>
                <th className="px-2 py-1 font-semibold">details</th>
              </tr>
            </thead>
            <tbody>
              {[...rows].reverse().map((r) => (
                <tr key={r.id} className="border-t border-border align-top">
                  <td className="px-2 py-1 text-muted-foreground">{r.id}</td>
                  <td className="px-2 py-1 whitespace-nowrap">{r.timestamp}</td>
                  <td className="px-2 py-1">{r.deskId}</td>
                  <td className="px-2 py-1 text-accent">{r.action}</td>
                  <td className="px-2 py-1 [overflow-wrap:anywhere]">{r.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
