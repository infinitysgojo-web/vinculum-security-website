import { useEffect, useRef, useState } from "react";
import { ChevronUp, Download, Pause, Play } from "lucide-react";
import { bondBand, stageGateAudit, VIABLE_FLOOR, type Signals } from "./engine";
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
    if (pw >= VIABLE_FLOOR && nw < VIABLE_FLOOR)
      out.push({ cls: "GATE_ALERT", text: `VIABLE FLOOR BREACHED // LIMITING BOND ${String(next.weakestBond ?? "").toUpperCase()} ${nw.toFixed(1)} < ${VIABLE_FLOOR.toFixed(1)}` });
    if (pw < VIABLE_FLOOR && nw >= VIABLE_FLOOR) out.push({ cls: "GATE_ALERT", text: `VIABLE FLOOR RESTORED // LIMITING BOND ${nw.toFixed(1)}` });
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

/** CHANCELLERY WIRE // RECORD OF DISPATCHES: a bottom drawer that logs the bus in real time. */
export default function ChancelleryWire({ signals }: { signals: Signals }) {
  const [open, setOpen] = useState(false);
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
    if (!paused && open && box.current) box.current.scrollTop = box.current.scrollHeight;
  }, [shown.length, paused, open]);

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

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-primary bg-background/95 backdrop-blur print:hidden">
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
          <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground [overflow-wrap:anywhere]">
            Live state digest · <span className="text-primary normal-case">{digest ? digest : "computing"}</span>
          </p>
          <div ref={box} className="h-48 sm:h-56 overflow-y-auto border border-border bg-background p-2 font-mono text-[10px] leading-relaxed">
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
        </div>
      )}
    </div>
  );
}
