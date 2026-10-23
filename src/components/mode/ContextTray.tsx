import { useState } from "react";
import { Plus } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Signals } from "@/components/desk/engine";
import {
  PANEL_DEFAULT_STATUS,
  OPEN_QUESTION_GUIDANCE,
  PANEL_LABEL,
  STATUS_LABEL,
  STATUS_MARK,
  newId,
  type ContextEntry,
  type Decision,
  type DecisionStatus,
  type EntryStatus,
  type TrayPanel,
  type Workspace,
} from "./workspace";
import { btn, btnPrimary, fieldCls, labelCls, localStamp } from "./ui";

export type TrayTab = TrayPanel | "decisions";

/** The live reading a desk publishes, in a few words, for a decision's before/after. */
export function deskReading(desk: string, s: Signals): string | undefined {
  switch (desk) {
    case "diagnostics":
      return s.weakestBond && s.weakestScore !== undefined ? `Weakest ${s.weakestBond} ${s.weakestScore.toFixed(1)}; mean ${s.bondMean?.toFixed(2) ?? "?"}` : undefined;
    case "sentinel":
      return s.rupture !== undefined ? `Rupture ${s.rupture}%${s.ruptureBand ? ` (${s.ruptureBand})` : ""}` : undefined;
    case "compound":
      return s.shocks?.length ? `${s.shocks.length} shocks; first to break ${s.firstToBreak || "none"}` : undefined;
    case "tracks":
      return s.trackGap !== undefined ? `Track gap ${s.trackGap} against tolerance ${s.trackTolerance ?? "?"}` : undefined;
    case "clauses":
      return s.covenants ? `${s.covenants.length} covenant${s.covenants.length === 1 ? "" : "s"}` : undefined;
    case "redliner":
      return s.disputeForum ? `${s.disputeForum}; friction ${s.enforcementFriction ?? "?"}` : undefined;
    case "succession":
      return s.survivalScore !== undefined ? `Survival ${s.survivalScore}%` : undefined;
    case "legal":
      return s.litigationForum || undefined;
    case "readiness":
      return s.gatesCleared ? `Stages cleared ${s.gatesCleared}` : undefined;
    case "verification":
      return s.verifierSeated !== undefined ? (s.verifierSeated ? "Verifier seated" : "No verifier seated") : undefined;
    case "handover":
      return s.handoverViability !== undefined ? `Durability ${s.handoverViability}% · ${s.handoverBand ?? ""}` : undefined;
    case "multiparty":
      return s.seatedParties !== undefined ? `${s.seatedParties} seated; escrow ${s.escrowTranchesMet ?? 0} of 4 tranches` : undefined;
    case "audit":
      return s.safeguardCoverage !== undefined ? `Safeguard coverage ${s.safeguardCoverage}%` : undefined;
    case "counterpart":
      return s.counterpart || undefined;
    case "mirror":
      return s.mirrors?.length ? `Mirrors: ${s.mirrors.join(", ")}` : undefined;
    default:
      return undefined;
  }
}

function StatusChip({ status }: { status: EntryStatus }) {
  const tone =
    status === "fact" ? "border-primary text-primary" : status === "assumption" ? "border-brass text-primary/80" : status === "question" ? "border-accent text-accent" : "border-border text-muted-foreground line-through";
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${tone}`}>
      <span className="font-mono" aria-hidden>{STATUS_MARK[status]}</span>
      {STATUS_LABEL[status]}
    </span>
  );
}

/**
 * Context Tray: Assumptions, Evidence, Open Questions and Decisions, held with the
 * workspace in this browser. A right-hand panel on desktop and a bottom sheet on phones,
 * so the desk canvas is never squeezed. Free text is sanitized on paste and blur by the
 * dashboard container (Radix portals follow the React tree).
 */
export default function ContextTray({
  open,
  onOpenChange,
  tab,
  onTab,
  ws,
  signals,
  desks,
  currentDesk,
  onChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tab: TrayTab;
  onTab: (t: TrayTab) => void;
  ws: Workspace;
  signals: Signals;
  desks: { id: string; label: string }[];
  currentDesk: string;
  onChange: (next: Pick<Workspace, "tray" | "decisions">) => void;
}) {
  const mobile = useIsMobile();
  const readOnly = ws.lifecycle === "sealed";
  const deskName = (id?: string) => desks.find((d) => d.id === id)?.label ?? "";
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side={mobile ? "bottom" : "right"}
        className={mobile ? "max-h-[85vh] overflow-y-auto" : "w-full overflow-y-auto sm:max-w-md"}
      >
        <SheetHeader>
          <SheetTitle className="font-serif text-primary">Context Tray</SheetTitle>
          <SheetDescription className="text-xs">
            Held in this browser with {ws.title}. {readOnly ? "Sealed: read only." : "Each entry carries its status; nothing here is verified by the app."}
          </SheetDescription>
        </SheetHeader>
        <Tabs value={tab} onValueChange={(v) => onTab(v as TrayTab)} className="mt-4">
          <TabsList className="grid h-auto w-full grid-cols-2 gap-1">
            {(["assumptions", "evidence", "questions"] as TrayPanel[]).map((p) => (
              <TabsTrigger key={p} value={p} className="min-w-0 whitespace-normal px-2 py-1.5 text-center text-[10px] uppercase leading-tight tracking-[0.1em]">
                {PANEL_LABEL[p]} ({ws.tray.filter((e) => e.panel === p).length})
              </TabsTrigger>
            ))}
            <TabsTrigger value="decisions" className="min-w-0 whitespace-normal px-2 py-1.5 text-center text-[10px] uppercase leading-tight tracking-[0.1em]">
              Decisions ({ws.decisions.length})
            </TabsTrigger>
          </TabsList>
          {(["assumptions", "evidence", "questions"] as TrayPanel[]).map((p) => (
            <TabsContent key={p} value={p} className="mt-4">
              {p === "questions" && (
                <p className="mb-3 border-l-2 border-accent pl-3 text-[11px] leading-relaxed text-foreground/85">{OPEN_QUESTION_GUIDANCE}</p>
              )}
              <EntryPanel
                panel={p}
                entries={ws.tray.filter((e) => e.panel === p)}
                readOnly={readOnly}
                desks={desks}
                currentDesk={currentDesk}
                deskName={deskName}
                onAdd={(e) => onChange({ tray: [...ws.tray, e], decisions: ws.decisions })}
                onStatus={(id, status) => onChange({ tray: ws.tray.map((e) => (e.id === id ? { ...e, status } : e)), decisions: ws.decisions })}
              />
            </TabsContent>
          ))}
          <TabsContent value="decisions" className="mt-4">
            <DecisionPanel
              decisions={ws.decisions}
              readOnly={readOnly}
              signals={signals}
              desks={desks}
              currentDesk={currentDesk}
              deskName={deskName}
              onAdd={(d) => onChange({ tray: ws.tray, decisions: [...ws.decisions, d] })}
              onStatus={(id, status) => onChange({ tray: ws.tray, decisions: ws.decisions.map((d) => (d.id === id ? { ...d, status } : d)) })}
            />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

function DeskSelect({ id, value, onChange, desks }: { id: string; value: string; onChange: (v: string) => void; desks: { id: string; label: string }[] }) {
  return (
    <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={fieldCls}>
      <option value="">No particular desk</option>
      {desks.map((d, i) => (
        <option key={d.id} value={d.id}>
          {String(i + 1).padStart(2, "0")} · {d.label}
        </option>
      ))}
    </select>
  );
}

function EntryPanel({
  panel,
  entries,
  readOnly,
  desks,
  currentDesk,
  deskName,
  onAdd,
  onStatus,
}: {
  panel: TrayPanel;
  entries: ContextEntry[];
  readOnly: boolean;
  desks: { id: string; label: string }[];
  currentDesk: string;
  deskName: (id?: string) => string;
  onAdd: (e: ContextEntry) => void;
  onStatus: (id: string, s: EntryStatus) => void;
}) {
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [status, setStatus] = useState<EntryStatus>(PANEL_DEFAULT_STATUS[panel]);
  const [desk, setDesk] = useState(currentDesk);
  const fid = `tray-${panel}`;
  return (
    <div className="space-y-4">
      {!readOnly && (
        <form
          className="space-y-3 border border-brass/40 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!text.trim()) return;
            onAdd({ id: newId("ce"), panel, status, text: text.trim(), source: source.trim() || undefined, desk: desk || undefined, at: new Date().toISOString() });
            setText("");
            setSource("");
          }}
        >
          <div>
            <label htmlFor={`${fid}-text`} className={labelCls}>New entry</label>
            <textarea id={`${fid}-text`} rows={2} value={text} onChange={(e) => setText(e.target.value)} className={fieldCls} />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label htmlFor={`${fid}-status`} className={labelCls}>Status</label>
              <select id={`${fid}-status`} value={status} onChange={(e) => setStatus(e.target.value as EntryStatus)} className={fieldCls}>
                {(Object.keys(STATUS_LABEL) as EntryStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${fid}-desk`} className={labelCls}>Concerns desk</label>
              <DeskSelect id={`${fid}-desk`} value={desk} onChange={setDesk} desks={desks} />
            </div>
          </div>
          <div>
            <label htmlFor={`${fid}-source`} className={labelCls}>Source or reference label (optional)</label>
            <input id={`${fid}-source`} type="text" value={source} onChange={(e) => setSource(e.target.value)} className={fieldCls} />
          </div>
          <button type="submit" className={btnPrimary} disabled={!text.trim()}>
            <Plus size={13} /> Add to {PANEL_LABEL[panel]}
          </button>
        </form>
      )}
      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground">No entries yet.</p>
      ) : (
        <ul className="space-y-2">
          {entries.map((e) => (
            <li key={e.id} className="border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <StatusChip status={e.status} />
                {e.desk && <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{deskName(e.desk)}</span>}
              </div>
              <p className={`mt-2 text-sm [overflow-wrap:anywhere] ${e.status === "excluded" ? "text-muted-foreground" : "text-foreground"}`}>{e.text}</p>
              {e.source && <p className="mt-1 text-[11px] text-muted-foreground [overflow-wrap:anywhere]">Source label: {e.source}</p>}
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground">{localStamp(e.at)}</span>
                {!readOnly && (
                  <label className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.12em] text-primary/70">
                    <span className="sr-only">Status for this entry</span>
                    <select value={e.status} onChange={(ev) => onStatus(e.id, ev.target.value as EntryStatus)} className="border border-input bg-background px-2 py-1 text-xs normal-case tracking-normal">
                      {(Object.keys(STATUS_LABEL) as EntryStatus[]).map((s) => (
                        <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                      ))}
                    </select>
                  </label>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function DecisionPanel({
  decisions,
  readOnly,
  signals,
  desks,
  currentDesk,
  deskName,
  onAdd,
  onStatus,
}: {
  decisions: Decision[];
  readOnly: boolean;
  signals: Signals;
  desks: { id: string; label: string }[];
  currentDesk: string;
  deskName: (id?: string) => string;
  onAdd: (d: Decision) => void;
  onStatus: (id: string, s: DecisionStatus) => void;
}) {
  const [what, setWhat] = useState("");
  const [why, setWhy] = useState("");
  const [desk, setDesk] = useState(currentDesk);
  const [impact, setImpact] = useState("");
  const live = desk ? deskReading(desk, signals) : undefined;
  // The before value is the after value last recorded for the same desk, when there is one.
  const before = desk ? [...decisions].reverse().find((d) => d.desk === desk && d.after)?.after : undefined;
  return (
    <div className="space-y-4">
      {!readOnly && (
        <form
          className="space-y-3 border border-brass/40 p-3"
          onSubmit={(e) => {
            e.preventDefault();
            if (!what.trim()) return;
            onAdd({ id: newId("dc"), what: what.trim(), why: why.trim(), desk: desk || undefined, impact: impact.trim() || undefined, before, after: live, at: new Date().toISOString(), status: "active" });
            setWhat("");
            setWhy("");
            setImpact("");
          }}
        >
          <div>
            <label htmlFor="dec-what" className={labelCls}>What changed</label>
            <input id="dec-what" type="text" value={what} onChange={(e) => setWhat(e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label htmlFor="dec-why" className={labelCls}>Why</label>
            <textarea id="dec-why" rows={2} value={why} onChange={(e) => setWhy(e.target.value)} className={fieldCls} />
          </div>
          <div>
            <label htmlFor="dec-desk" className={labelCls}>Desk or context</label>
            <DeskSelect id="dec-desk" value={desk} onChange={setDesk} desks={desks} />
            <p className="mt-1 text-[11px] text-muted-foreground">
              {live ? `Recorded with the live reading: ${live}${before ? `; before: ${before}` : ""}.` : "No live reading from this desk to record."}
            </p>
          </div>
          <div>
            <label htmlFor="dec-impact" className={labelCls}>Downstream impact note (optional)</label>
            <input id="dec-impact" type="text" value={impact} onChange={(e) => setImpact(e.target.value)} className={fieldCls} />
          </div>
          <button type="submit" className={btnPrimary} disabled={!what.trim()}>
            <Plus size={13} /> Record decision
          </button>
        </form>
      )}
      {decisions.length === 0 ? (
        <p className="text-xs text-muted-foreground">No decisions recorded.</p>
      ) : (
        <ol className="space-y-2">
          {[...decisions].reverse().map((d) => (
            <li key={d.id} className="border border-border p-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.14em] ${d.status === "active" ? "border-primary text-primary" : "border-border text-muted-foreground"}`}>{d.status}</span>
                {d.desk && <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{deskName(d.desk)}</span>}
                <span className="text-[10px] text-muted-foreground">{localStamp(d.at)}</span>
              </div>
              <p className={`mt-2 text-sm [overflow-wrap:anywhere] ${d.status === "active" ? "text-foreground" : "text-muted-foreground line-through"}`}>{d.what}</p>
              {d.why && <p className="mt-1 text-xs text-foreground/80 [overflow-wrap:anywhere]">Why: {d.why}</p>}
              {(d.before || d.after) && <p className="mt-1 font-mono text-[11px] text-muted-foreground [overflow-wrap:anywhere]">{d.before ? `Before: ${d.before}` : ""}{d.before && d.after ? " → " : ""}{d.after ? `After: ${d.after}` : ""}</p>}
              {d.impact && <p className="mt-1 text-[11px] text-muted-foreground [overflow-wrap:anywhere]">Impact note: {d.impact}</p>}
              {!readOnly && d.status === "active" && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button type="button" className={btn} onClick={() => onStatus(d.id, "superseded")}>Mark superseded</button>
                  <button type="button" className={btn} onClick={() => onStatus(d.id, "withdrawn")}>Withdraw</button>
                </div>
              )}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
