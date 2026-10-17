import { useMemo, useState } from "react";
import { Copy, Stamp } from "lucide-react";
import { toast } from "sonner";
import { bondBand, inscriptionLines, stageGateAudit, statutoryClearances, useEngine, VIABLE_FLOOR, type Signals } from "./engine";
import { apostille, mintDispatch, type Dispatch } from "./registry";
import { seal } from "@/lib/chancelleryHaptics";

type Mode = "note-verbale" | "demarche" | "aide-memoire";
const MODES: { id: Mode; label: string; sub: string }[] = [
  { id: "note-verbale", label: "Note Verbale", sub: "Third-person plenipotentiary" },
  { id: "demarche", label: "Diplomatic Démarche", sub: "Urgent gate-breach notice" },
  { id: "aide-memoire", label: "Aide-Mémoire", sub: "Working summary" },
];

const NAMES: [keyof NonNullable<Signals["bonds"]>, string][] = [
  ["interpersonal", "Interpersonal"],
  ["communal", "Communal"],
  ["intergenerational", "Intergenerational"],
  ["institutional", "Institutional-Relational"],
];

/** Formal third-person protocol grammar drawn from the live four-bond vector. */
export function draftTransmittal(s: Signals, mode: Mode): string {
  const ins = inscriptionLines(s);
  const core = draftCore(s, mode);
  return ins.length ? `${core}\n\n${ins.join("\n").trimEnd()}` : core;
}

function draftCore(s: Signals, mode: Mode): string {
  if (!s.bonds) return "";
  const b = s.bonds;
  const rows = NAMES.map(([k, n]) => ({ n, v: b[k], band: bondBand(b[k]) }));
  const breached = rows.filter((r) => r.v < VIABLE_FLOOR);
  const holding = rows.filter((r) => r.v >= VIABLE_FLOOR);
  const theatre = s.theatre?.trim() || "the theatre under review";
  const audit = stageGateAudit(s);
  const passed = audit.gates.filter((g) => g.passed).length;
  const covs = s.covenants ?? [];
  const list = (xs: string[]) => (xs.length <= 1 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
  const limiting = s.weakestBond ?? rows.reduce((m, r) => (r.v < m.v ? r : m), rows[0]).n;
  const vector = rows.map((r) => `${r.n} ${r.v.toFixed(1)} (${r.band})`).join("; ");

  const concern = breached.length
    ? `The Chancellery notes with grave concern that while ${holding.length ? `${list(holding.map((r) => r.n))} channels remain Viable or better` : "no bond holds the floor"}, ${list(breached.map((r) => `the ${r.n} Bond has deteriorated to ${r.v.toFixed(1)} (${r.band})`))}, breaching the statutory floor of ${VIABLE_FLOOR.toFixed(1)} established under §12C.`
    : `The Chancellery records that all four bonds hold at or above the statutory floor of ${VIABLE_FLOOR.toFixed(1)} established under §12C, the ${limiting} Bond remaining the limiting factor.`;
  const covenantLine = covs.length
    ? `Accordingly, the annexed covenants of continuity (${list(covs)}) are deposited herewith under official seal.`
    : "No covenant of continuity has yet been deposited; the Chancellery reserves the drafting of such instruments pending the Legal Architecture desk.";
  const sched = statutoryClearances(s);
  const clr = sched.filter((c) => c.passed).length;
  const gateLine = `Of the ${sched.length} statutory clearances, ${clr} stand satisfied, and ${passed} of the ${audit.gates.length} stage gates are cleared${audit.locked ? "; the mission remains locked pending the remainder" : "; the mission is cleared to proceed"}.`;

  if (mode === "note-verbale") {
    return [
      "NOTE VERBALE",
      "",
      `The Special Envoy presents compliments to the High Contracting Parties and has the honour to communicate the annexed four-bond assessment for ${theatre}.`,
      "",
      concern,
      "",
      `The assessed vector stands as follows: ${vector}.`,
      "",
      covenantLine,
      "",
      gateLine,
      "",
      "The Special Envoy avails itself of this opportunity to renew to the High Contracting Parties the assurances of its highest consideration.",
    ].join("\n");
  }
  if (mode === "demarche") {
    const locks = audit.gates.filter((g) => !g.passed);
    return [
      "DIPLOMATIC DÉMARCHE · URGENT",
      "",
      `The Special Envoy is instructed to draw the immediate attention of the High Contracting Parties to a breach of clearance in ${theatre}.`,
      "",
      concern,
      "",
      locks.length
        ? `The following gates are locked and require remedy before any further step: ${locks.map((g) => `${g.name} (${g.directive})`).join(" ")}`
        : "No clearance gate is presently locked; this démarche is issued as a precautionary record.",
      "",
      `The Chancellery requests that the Parties act upon the limiting ${limiting} Bond without delay, and reserves its position pending their reply.`,
    ].join("\n");
  }
  return [
    "AIDE-MÉMOIRE",
    "",
    `Theatre: ${theatre}.`,
    `Vector: ${vector}.`,
    `Limiting factor: ${limiting}${s.weakestScore !== undefined ? ` at ${s.weakestScore.toFixed(1)}` : ""}.`,
    `Floor: ${breached.length ? `${breached.length} bond${breached.length === 1 ? "" : "s"} below ${VIABLE_FLOOR.toFixed(1)}` : `held at ${VIABLE_FLOOR.toFixed(1)}`}.`,
    `Clearances: ${clr} of ${sched.length} satisfied; stage gates ${passed} of ${audit.gates.length} cleared.`,
    `Covenants deposited: ${covs.length ? list(covs) : "none"}.`,
    s.rupture !== undefined ? `Rupture index: ${s.rupture}%${s.ruptureBand ? ` (${s.ruptureBand})` : ""}.` : "Rupture index: not yet measured.",
  ].join("\n");
}

/** Note Verbale transmittal formatter, bound to the mission bus and the dispatch registry. */
export default function NoteVerbale() {
  const { signals } = useEngine();
  const [mode, setMode] = useState<Mode>("note-verbale");
  const [last, setLast] = useState<Dispatch | null>(null);
  const text = useMemo(() => draftTransmittal(signals, mode), [signals, mode]);

  if (!text) {
    return (
      <div className="border border-border bg-background p-4 text-sm text-muted-foreground">
        The transmittal formatter drafts from the live four-bond vector. Score the bonds on the Assessment Bench first.
      </div>
    );
  }

  const mintAndCopy = async () => {
    const d = await mintDispatch(signals, mode);
    setLast(d);
    try {
      await navigator.clipboard.writeText(`${apostille(d)}\n\n${text}`);
      toast.success(`Transmittal ${d.ref} minted and copied`);
    } catch {
      toast.success(`Transmittal ${d.ref} minted. Select the text to copy.`);
    }
    seal();
  };

  return (
    <div className="border border-brass/40 bg-background p-4 sm:p-5">
      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary mb-3">Transmittal formatter</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4" role="radiogroup" aria-label="Transmittal form">
        {MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`min-h-11 border px-3 py-2 text-left transition-colors ${mode === m.id ? "border-primary bg-primary text-primary-foreground" : "border-brass/50 text-primary hover:border-accent"}`}
          >
            <span className="block text-[10px] uppercase tracking-[0.16em] font-semibold">{m.label}</span>
            <span className={`block text-[10px] ${mode === m.id ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{m.sub}</span>
          </button>
        ))}
      </div>
      <pre className="mb-3 max-h-56 overflow-auto border border-border bg-navy-tint/40 p-3 font-mono text-[10px] leading-relaxed text-primary whitespace-pre">
        {last ? apostille(last) : "+--- VINCULUM PROTOCOL REGISTRY // SIGILLUM CANCELLARIAE ---+\nREF NO  : (minted on copy)\n+-----------------------------------------------------------+"}
      </pre>
      <div className="font-serif text-[0.95rem] leading-relaxed text-foreground/90 whitespace-pre-wrap [overflow-wrap:anywhere]">{text}</div>
      <button
        type="button"
        onClick={mintAndCopy}
        className="mt-4 inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 bg-primary px-4 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary-foreground hover:bg-accent transition-colors"
      >
        <Stamp size={13} /> Mint reference and copy <Copy size={12} />
      </button>
    </div>
  );
}
