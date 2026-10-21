import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Copy, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES, SCENARIOS, scenarioCompatible, theatreForScenario, type Category, type Difficulty, type Scenario } from "./scenarios";
import {
  DERIVED_NOTICE,
  EMPTY_WARRANT,
  LIFECYCLE_LABEL,
  PROMOTION_LINEAGE,
  STATUS_LABEL,
  STATUS_MARK,
  WARRANT_FIELDS,
  canMove,
  carriedValues,
  completenessReview,
  derivativeChoices,
  newId,
  type CarriedValue,
  type ContextEntry,
  type DerivativeChoice,
  type EntryStatus,
  type Lifecycle,
  type Warrant,
  type Workspace,
} from "./workspace";
import { btn, btnPrimary, fieldCls, labelCls, localStamp } from "./ui";

const wide = "max-h-[90vh] w-[calc(100vw-1.5rem)] max-w-3xl overflow-y-auto";

function Shell({ open, onOpenChange, title, description, children, footer }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; description?: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={wide}>
        <DialogHeader>
          <DialogTitle className="font-serif text-primary">{title}</DialogTitle>
          {description && <DialogDescription className="text-xs">{description}</DialogDescription>}
        </DialogHeader>
        <div className="min-w-0">{children}</div>
        {footer && <DialogFooter className="gap-2 sm:gap-2">{footer}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Scenario Library                                                    */
/* ------------------------------------------------------------------ */

export function ScenarioLibraryDialog({ open, onOpenChange, deskIds, deskLabel, localCount, onStart }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  deskIds: readonly string[];
  deskLabel: (id: string) => string;
  localCount: (scenarioId: string) => number;
  onStart: (s: Scenario) => void;
}) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "">("");
  const [diff, setDiff] = useState<Difficulty | "">("");
  const list = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return SCENARIOS.filter((s) => (!cat || s.category === cat) && (!diff || s.difficulty === diff) && (!needle || `${s.title} ${s.purpose} ${s.trains} ${s.category}`.toLowerCase().includes(needle)));
  }, [q, cat, diff]);
  return (
    <Shell open={open} onOpenChange={onOpenChange} title="Scenario Library" description="Read-only packages bundled with this build. Starting one creates a separate local exercise; the package itself never changes.">
      <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
        <label className="relative block">
          <span className="sr-only">Search scenarios</span>
          <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search scenarios" className={`${fieldCls} pl-8`} />
        </label>
        <label>
          <span className="sr-only">Category</span>
          <select value={cat} onChange={(e) => setCat(e.target.value as Category | "")} className={fieldCls}>
            <option value="">All categories</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <label>
          <span className="sr-only">Difficulty</span>
          <select value={diff} onChange={(e) => setDiff(e.target.value as Difficulty | "")} className={fieldCls}>
            <option value="">All levels</option>
            {(["Foundation", "Practitioner", "Red-Team"] as Difficulty[]).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </label>
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground" role="status">{list.length} of {SCENARIOS.length} scenarios</p>
      <ul className="mt-3 grid gap-3">
        {list.map((s) => {
          const compat = scenarioCompatible(s, deskIds);
          const t = theatreForScenario(s);
          const n = localCount(s.id);
          return (
            <li key={s.id} className="border border-brass/40 p-3 sm:p-4">
              <div className="flex flex-wrap items-center gap-2 text-[9px] uppercase tracking-[0.16em]">
                <span className="border border-border px-1.5 py-0.5 text-muted-foreground">{s.category}</span>
                <span className="border border-brass px-1.5 py-0.5 text-primary">{s.difficulty}</span>
                <span className="font-mono text-muted-foreground">v{s.version}</span>
                <span className="text-muted-foreground">{compat.ok ? "Available offline in this build" : "Not compatible"}</span>
              </div>
              <h3 className="mt-2 font-serif text-base text-primary">{s.title}</h3>
              <p className="mt-1 text-xs text-foreground/85"><span className="font-semibold">What this trains:</span> {s.trains}</p>
              <p className="mt-1 text-[11px] text-muted-foreground [overflow-wrap:anywhere]">
                {s.sequence.length} desks: {s.sequence.map(deskLabel).join(" → ")}{t ? ` · Theatre preset: ${t.name}` : ""}
              </p>
              {!compat.ok && <p className="mt-1 text-[11px] text-destructive">{compat.reason}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <button type="button" className={btnPrimary} disabled={!compat.ok} onClick={() => onStart(s)}>Start exercise</button>
                {n > 0 && <span className="text-[11px] text-muted-foreground">{n} local exercise{n === 1 ? "" : "s"} from this scenario</span>}
              </div>
            </li>
          );
        })}
        {list.length === 0 && <li className="text-xs text-muted-foreground">No scenario matches these filters.</li>}
      </ul>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Workspace picker                                                    */
/* ------------------------------------------------------------------ */

export function PickerDialog({ open, onOpenChange, title, description, items, legacy, onPick, onPickLegacy }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  items: Workspace[];
  legacy?: boolean;
  onPick: (w: Workspace) => void;
  onPickLegacy?: () => void;
}) {
  const sorted = [...items].sort((a, b) => (b.updatedAt || "").localeCompare(a.updatedAt || ""));
  return (
    <Shell open={open} onOpenChange={onOpenChange} title={title} description={description}>
      <ul className="grid gap-2">
        {legacy && onPickLegacy && (
          <li>
            <button type="button" onClick={onPickLegacy} className="w-full border border-brass/40 p-3 text-left hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="block text-sm text-primary">Saved browser session</span>
              <span className="block text-[11px] text-muted-foreground">Saved before the two modes existed. Opens as a new custom draft; the saved session itself is left in place.</span>
            </button>
          </li>
        )}
        {sorted.map((w) => (
          <li key={w.id}>
            <button type="button" onClick={() => onPick(w)} className="w-full border border-brass/40 p-3 text-left hover:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <span className="block text-sm text-primary [overflow-wrap:anywhere]">{w.title}</span>
              <span className="block text-[11px] text-muted-foreground">
                {LIFECYCLE_LABEL[w.lifecycle]} · {localStamp(w.updatedAt)}{w.replay.length ? ` · ${w.replay.length} recorded change${w.replay.length === 1 ? "" : "s"}` : ""}
              </span>
            </button>
          </li>
        ))}
        {!sorted.length && !legacy && <li className="text-xs text-muted-foreground">Nothing stored in this browser.</li>}
      </ul>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Mission Warrant                                                     */
/* ------------------------------------------------------------------ */

const STATUS_ORDER: EntryStatus[] = ["fact", "assumption", "question", "excluded"];
const STATUS_PANEL: Record<EntryStatus, ContextEntry["panel"]> = { fact: "evidence", assumption: "assumptions", question: "questions", excluded: "assumptions" };
const STATUS_PROMPT: Record<EntryStatus, string> = { fact: "Known facts", assumption: "Working assumptions", question: "Unresolved questions", excluded: "Explicit exclusions" };

export function WarrantDialog({ open, onOpenChange, title, initial, entries, readOnly, confirmLabel, requireKeys = [], onSave }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  initial: Warrant;
  entries: ContextEntry[];
  readOnly?: boolean;
  confirmLabel: string;
  /** Fields that must hold text before the dialog can be confirmed. */
  requireKeys?: (keyof Warrant)[];
  onSave: (w: Warrant, added: ContextEntry[]) => void;
}) {
  const [w, setW] = useState<Warrant>(initial);
  const [drafts, setDrafts] = useState<Record<EntryStatus, string>>({ fact: "", assumption: "", question: "", excluded: "" });
  const [more, setMore] = useState(false);
  useEffect(() => {
    if (open) {
      setW(initial);
      setDrafts({ fact: "", assumption: "", question: "", excluded: "" });
    }
  }, [open, initial]);
  const required = WARRANT_FIELDS.filter((f) => f.required);
  const filled = required.filter((f) => w[f.key].trim()).length;
  const essentials = WARRANT_FIELDS.slice(0, 3);
  const rest = WARRANT_FIELDS.slice(3);
  const field = (f: (typeof WARRANT_FIELDS)[number]) => (
    <div key={f.key}>
      <label htmlFor={`w-${f.key}`} className={labelCls}>{f.label}</label>
      {f.key === "objective" || f.key === "scope" ? (
        <textarea id={`w-${f.key}`} rows={2} value={w[f.key]} readOnly={readOnly} onChange={(e) => setW({ ...w, [f.key]: e.target.value })} className={fieldCls} />
      ) : (
        <input id={`w-${f.key}`} type="text" value={w[f.key]} readOnly={readOnly} onChange={(e) => setW({ ...w, [f.key]: e.target.value })} className={fieldCls} />
      )}
      <p className="mt-1 text-[10px] text-muted-foreground">{f.hint}</p>
    </div>
  );
  const save = () => {
    const at = new Date().toISOString();
    const added: ContextEntry[] = [];
    for (const s of STATUS_ORDER) {
      for (const line of drafts[s].split("\n").map((x) => x.trim()).filter(Boolean)) {
        added.push({ id: newId("ce"), panel: STATUS_PANEL[s], status: s, text: line, at });
      }
    }
    onSave(w, added);
  };
  return (
    <Shell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description="A structured local record of the mission's basis. The app records what you enter; it does not verify evidence or obtain approval."
      footer={
        readOnly ? undefined : (
          <>
            <span className="mr-auto self-center text-[11px] text-muted-foreground">{filled} of {required.length} warrant fields recorded</span>
            <button type="button" className={btn} onClick={() => onOpenChange(false)}>Cancel</button>
            <button type="button" className={btnPrimary} disabled={requireKeys.some((k) => !w[k].trim())} title={requireKeys.some((k) => !w[k].trim()) ? "Enter at least a title and an objective" : undefined} onClick={save}>{confirmLabel}</button>
          </>
        )
      }
    >
      <div className="grid gap-3 sm:grid-cols-2">{essentials.map(field)}</div>
      <button type="button" className={`${btn} mt-3`} aria-expanded={more} onClick={() => setMore((v) => !v)}>
        {more ? "Hide" : "Show"} custodian, authority, handling and scope
      </button>
      {more && <div className="mt-3 grid gap-3 sm:grid-cols-2">{rest.map(field)}</div>}

      <div className="mt-5 border-t border-brass/40 pt-4">
        <p className={labelCls}>Facts, assumptions, questions and exclusions</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {STATUS_ORDER.map((s) => {
            const mine = entries.filter((e) => e.status === s);
            return (
              <div key={s} className="min-w-0 border border-border p-3">
                <p className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary">
                  <span className="border border-current px-1 font-mono">{STATUS_MARK[s]}</span> {STATUS_PROMPT[s]} ({mine.length})
                </p>
                {mine.length > 0 && (
                  <ul className="mt-2 space-y-1 text-xs text-foreground/85">
                    {mine.map((e) => <li key={e.id} className={`[overflow-wrap:anywhere] ${s === "excluded" ? "line-through text-muted-foreground" : ""}`}>{e.text}</li>)}
                  </ul>
                )}
                {!readOnly && (
                  <label className="mt-2 block">
                    <span className="sr-only">Add {STATUS_LABEL[s]} entries, one per line</span>
                    <textarea rows={2} value={drafts[s]} onChange={(e) => setDrafts({ ...drafts, [s]: e.target.value })} placeholder="One per line" className={fieldCls} />
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Branch, replay, report, brief, impact                               */
/* ------------------------------------------------------------------ */

export function BranchDialog({ open, onOpenChange, onBranch }: { open: boolean; onOpenChange: (v: boolean) => void; onBranch: (label: string) => void }) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (open) setLabel("");
  }, [open]);
  return (
    <Shell
      open={open}
      onOpenChange={onOpenChange}
      title="Branch this exercise"
      description="Duplicates the current local exercise under a label. The current run is kept unchanged."
      footer={
        <>
          <button type="button" className={btn} onClick={() => onOpenChange(false)}>Cancel</button>
          <button type="button" className={btnPrimary} disabled={!label.trim()} onClick={() => onBranch(label)}>Create branch</button>
        </>
      }
    >
      <label htmlFor="branch-label" className={labelCls}>Branch label</label>
      <input id="branch-label" type="text" value={label} onChange={(e) => setLabel(e.target.value)} className={fieldCls} />
    </Shell>
  );
}

export function ReplayDialog({ open, onOpenChange, ws }: { open: boolean; onOpenChange: (v: boolean) => void; ws: Workspace }) {
  const events = [
    ...ws.replay.map((r) => ({ at: r.at, label: r.kind.replace(/_/g, " ").toLowerCase(), detail: r.detail })),
    ...ws.decisions.map((d) => ({ at: d.at, label: `decision (${d.status})`, detail: d.what })),
  ].sort((a, b) => a.at.localeCompare(b.at));
  return (
    <Shell open={open} onOpenChange={onOpenChange} title={`Replay · ${ws.title}`} description="The meaningful changes recorded in this browser for this run: session ledger events and decisions, oldest first.">
      {events.length === 0 ? (
        <p className="text-xs text-muted-foreground">No changes have been recorded for this run yet.</p>
      ) : (
        <ol className="space-y-2 border-l-2 border-brass/50 pl-4">
          {events.map((e, i) => (
            <li key={`${e.at}-${i}`} className="text-xs">
              <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")} · {localStamp(e.at)}</span>
              <p className="text-primary"><span className="uppercase tracking-[0.12em] text-[10px]">{e.label}</span></p>
              <p className="text-foreground/85 [overflow-wrap:anywhere]">{e.detail}</p>
            </li>
          ))}
        </ol>
      )}
    </Shell>
  );
}

export function ReportDialog({ open, onOpenChange, title, text, fileName }: { open: boolean; onOpenChange: (v: boolean) => void; title: string; text: string; fileName: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy was blocked. Select the text instead.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };
  return (
    <Shell
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      footer={
        <>
          <button type="button" className={btn} onClick={copy}><Copy size={13} /> Copy</button>
          <button type="button" className={btnPrimary} onClick={download}><Download size={13} /> Download text</button>
        </>
      }
    >
      <pre className="max-h-[55vh] overflow-auto whitespace-pre-wrap border border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground">{text}</pre>
    </Shell>
  );
}

export function BriefDialog({ open, onOpenChange, scenario, ws, deskLabel }: { open: boolean; onOpenChange: (v: boolean) => void; scenario?: Scenario; ws: Workspace; deskLabel: (id: string) => string }) {
  return (
    <Shell open={open} onOpenChange={onOpenChange} title={scenario ? scenario.title : ws.title} description={scenario ? `${scenario.category} · ${scenario.difficulty} · package v${scenario.version} (read-only)` : DERIVED_NOTICE}>
      {scenario ? (
        <div className="space-y-4 text-sm">
          <p className="text-foreground/90">{scenario.purpose}</p>
          <Section title="Desk sequence">
            <ol className="list-decimal space-y-0.5 pl-5 text-xs">{scenario.sequence.map((d) => <li key={d}>{deskLabel(d)}</li>)}</ol>
          </Section>
          <Section title="Expected signal relationships (from the existing formulas)">
            <ul className="list-disc space-y-1 pl-5 text-xs">{scenario.relationships.map((r) => <li key={r}>{r}</li>)}</ul>
          </Section>
          <Section title="Instructional notes">
            <ul className="list-disc space-y-1 pl-5 text-xs">{scenario.notes.map((r) => <li key={r}>{r}</li>)}</ul>
          </Section>
        </div>
      ) : (
        <p className="text-sm text-foreground/85">A sanitized training copy of a custom mission. It carries the bond vector and the labels chosen at derivation; no source references, notes, binder text or integrity records.</p>
      )}
    </Shell>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <p className={labelCls}>{title}</p>
      {children}
    </div>
  );
}

export type Impact = { title: string; lines: string[]; confirmLabel: string; onConfirm: (reason: string) => void };

/** Plain-language dependency note before a high-leverage change; the reason goes to the Decision Record. */
export function ImpactDialog({ impact, onClose }: { impact: Impact | null; onClose: () => void }) {
  const [reason, setReason] = useState("");
  useEffect(() => setReason(""), [impact]);
  return (
    <Shell
      open={!!impact}
      onOpenChange={(v) => !v && onClose()}
      title={impact?.title ?? ""}
      description="What this change touches, derived from which desks actually read the affected readings. It predicts nothing beyond the dashboard."
      footer={
        <>
          <button type="button" className={btn} onClick={onClose}>Cancel</button>
          <button type="button" className={btnPrimary} onClick={() => impact?.onConfirm(reason.trim())}>{impact?.confirmLabel}</button>
        </>
      }
    >
      <ul className="list-disc space-y-1 pl-5 text-xs text-foreground/85">{impact?.lines.map((l) => <li key={l}>{l}</li>)}</ul>
      <label htmlFor="impact-reason" className={`${labelCls} mt-4`}>Reason, recorded in the Decision Record (optional)</label>
      <textarea id="impact-reason" rows={2} value={reason} onChange={(e) => setReason(e.target.value)} className={fieldCls} />
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Lifecycle                                                           */
/* ------------------------------------------------------------------ */

const STEPS: Lifecycle[] = ["draft", "review", "ready", "sealed"];

export function LifecycleDialog({ open, onOpenChange, ws, onMove, onSeal, sealing }: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  ws: Workspace;
  onMove: (to: Lifecycle) => void;
  onSeal: () => void;
  sealing: boolean;
}) {
  const findings = completenessReview(ws);
  const at = STEPS.indexOf(ws.lifecycle);
  return (
    <Shell open={open} onOpenChange={onOpenChange} title="Review and lifecycle" description="Browser-local workflow states. None of them is a legal approval, an institutional sign-off or a cloud record.">
      <ol className="grid gap-2 sm:grid-cols-4">
        {STEPS.map((s, i) => (
          <li key={s} className={`border p-2 text-[10px] uppercase tracking-[0.12em] ${s === ws.lifecycle ? "border-accent text-accent" : i < at ? "border-brass text-primary" : "border-border text-muted-foreground"}`} aria-current={s === ws.lifecycle ? "step" : undefined}>
            <span className="font-mono">{String(i + 1).padStart(2, "0")}</span> {LIFECYCLE_LABEL[s]}
            {s === ws.lifecycle && <span className="block normal-case tracking-normal">Current</span>}
          </li>
        ))}
      </ol>

      {ws.lifecycle === "sealed" && ws.sealed ? (
        <div className="mt-4 space-y-1 border border-brass/50 p-3 font-mono text-[11px] [overflow-wrap:anywhere]">
          <p>REF {ws.sealed.ref}</p>
          <p>SHA-256 {ws.sealed.digest}</p>
          <p>SEALED {localStamp(ws.sealed.at)}</p>
        </div>
      ) : (
        <>
          <div className="mt-4">
            <p className={labelCls}>Local completeness review</p>
            {findings.length === 0 ? (
              <p className="text-xs text-foreground/85">No missing warrant content and no unresolved structured items.</p>
            ) : (
              <ul className="space-y-1 text-xs">
                {findings.map((f) => (
                  <li key={f.text} className="flex gap-2 [overflow-wrap:anywhere]">
                    <span className="font-mono text-[10px] uppercase text-accent">{f.kind === "warrant" || f.kind === "question" ? "Blocks" : "Note"}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["draft", "review", "ready"] as Lifecycle[]).filter((s) => s !== ws.lifecycle).map((s) => {
              const c = canMove(ws, s);
              return (
                <button key={s} type="button" className={btn} disabled={!c.ok} title={c.reason} onClick={() => onMove(s)}>
                  Move to {LIFECYCLE_LABEL[s]}
                </button>
              );
            })}
            <button type="button" className={btnPrimary} disabled={!canMove(ws, "sealed").ok || sealing} title={canMove(ws, "sealed").reason} onClick={onSeal}>
              {sealing ? "Sealing" : "Seal local snapshot"}
            </button>
          </div>
          {!canMove(ws, "ready").ok && ws.lifecycle !== "ready" && <p className="mt-2 text-[11px] text-muted-foreground">{canMove(ws, "ready").reason}</p>}
        </>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Promotion review                                                    */
/* ------------------------------------------------------------------ */

export function PromotionDialog({ open, onOpenChange, ws, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; ws: Workspace; onConfirm: (w: Warrant, reviewed: CarriedValue[]) => void }) {
  const [step, setStep] = useState(1);
  const [w, setW] = useState<Warrant>(EMPTY_WARRANT);
  const [vals, setVals] = useState<CarriedValue[]>([]);
  useEffect(() => {
    if (open) {
      setStep(1);
      setW({ ...EMPTY_WARRANT, theatre: "" });
      setVals(carriedValues(ws));
    }
  }, [open, ws]);
  const required = WARRANT_FIELDS.filter((f) => f.required);
  const warrantDone = required.every((f) => w[f.key].trim());
  const kept = vals.filter((v) => v.status !== "excluded");
  return (
    <Shell
      open={open}
      onOpenChange={onOpenChange}
      title="Promotion review"
      description="Creates a new custom draft. The training run stays exactly as it is."
      footer={
        <>
          {step > 1 && <button type="button" className={btn} onClick={() => setStep(step - 1)}>Back</button>}
          {step < 3 ? (
            <button type="button" className={btnPrimary} disabled={step === 1 && !warrantDone} onClick={() => setStep(step + 1)}>Continue</button>
          ) : (
            <button type="button" className={btnPrimary} onClick={() => onConfirm(w, vals)}>Create custom draft</button>
          )}
        </>
      }
    >
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Step {step} of 3 · {step === 1 ? "Complete the Mission Warrant" : step === 2 ? "Review every carried value" : "Compatibility summary"}</p>
      {step === 1 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {WARRANT_FIELDS.map((f) => (
            <div key={f.key}>
              <label htmlFor={`pw-${f.key}`} className={labelCls}>{f.label}</label>
              <input id={`pw-${f.key}`} type="text" value={w[f.key]} onChange={(e) => setW({ ...w, [f.key]: e.target.value })} className={fieldCls} />
            </div>
          ))}
        </div>
      )}
      {step === 2 && (
        <div>
          <p className="mb-3 text-xs text-muted-foreground">Preset values are scenario figures. They start as Working Assumptions, never as verified facts. Mark each one.</p>
          {vals.length === 0 ? (
            <p className="text-xs text-muted-foreground">This run carries no values.</p>
          ) : (
            <ul className="space-y-2">
              {vals.map((v, i) => (
                <li key={v.key} className="grid gap-2 border border-border p-3 sm:grid-cols-[1fr_12rem]">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.14em] text-primary/70">{v.label}</p>
                    <p className="text-xs text-foreground [overflow-wrap:anywhere]">{v.value}</p>
                  </div>
                  <label>
                    <span className="sr-only">Status for {v.label}</span>
                    <select value={v.status} onChange={(e) => setVals(vals.map((x, j) => (j === i ? { ...x, status: e.target.value as EntryStatus } : x)))} className={fieldCls}>
                      {(Object.keys(STATUS_LABEL) as EntryStatus[]).map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {step === 3 && (
        <div className="space-y-3 text-xs text-foreground/85">
          <p><span className="font-semibold">Carried:</span> {kept.length} value{kept.length === 1 ? "" : "s"} ({kept.filter((v) => v.status === "fact").length} marked Fact, {kept.filter((v) => v.status === "assumption").length} Working Assumption, {kept.filter((v) => v.status === "question").length} Open Question). Excluded: {vals.length - kept.length}.</p>
          <p><span className="font-semibold">Removed from the operational draft:</span> the scenario link and preset markers, desk guides, checkpoint answers, training notes and training-only labels.</p>
          <p><span className="font-semibold">How the desks will read it:</span> carried bus readings stay until the desk that publishes them is opened; that desk then publishes from its own inputs, which start from its defaults because the preset seeds are not carried.</p>
          <p><span className="font-semibold">Lineage recorded:</span> {PROMOTION_LINEAGE}</p>
        </div>
      )}
    </Shell>
  );
}

/* ------------------------------------------------------------------ */
/* Training derivative                                                 */
/* ------------------------------------------------------------------ */

export function DerivativeDialog({ open, onOpenChange, ws, onConfirm }: { open: boolean; onOpenChange: (v: boolean) => void; ws: Workspace; onConfirm: (c: DerivativeChoice[]) => void }) {
  const [choices, setChoices] = useState<DerivativeChoice[]>([]);
  useEffect(() => {
    if (open) setChoices(derivativeChoices(ws));
  }, [open, ws]);
  const incomplete = choices.some((c) => !c.omit && !c.replacement.trim());
  return (
    <Shell
      open={open}
      onOpenChange={onOpenChange}
      title="Create sanitized training derivative"
      description="A new local training copy. The custom mission is not changed, demoted or shared."
      footer={
        <>
          <button type="button" className={btn} onClick={() => onOpenChange(false)}>Cancel</button>
          <button type="button" className={btnPrimary} disabled={incomplete} onClick={() => onConfirm(choices)}>Create derivative</button>
        </>
      }
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">{DERIVED_NOTICE}</p>
      <p className="mt-3 text-xs text-foreground/85">Always excluded: source references, private notes, binder text and attachments, sealed records, integrity references, decisions and every free-text entry. Kept: the bond vector only.</p>
      <ul className="mt-4 space-y-2">
        {choices.map((c, i) => (
          <li key={c.key} className="border border-border p-3">
            <p className="text-[10px] uppercase tracking-[0.14em] text-primary/70">{c.label}</p>
            <label className="mt-2 flex items-center gap-2 text-xs">
              <input type="checkbox" checked={c.omit} onChange={(e) => setChoices(choices.map((x, j) => (j === i ? { ...x, omit: e.target.checked } : x)))} />
              Omit
            </label>
            {!c.omit && (
              <label className="mt-2 block">
                <span className={labelCls}>Safe replacement label</span>
                <input type="text" value={c.replacement} onChange={(e) => setChoices(choices.map((x, j) => (j === i ? { ...x, replacement: e.target.value } : x)))} className={fieldCls} />
              </label>
            )}
          </li>
        ))}
        {choices.length === 0 && <li className="text-xs text-muted-foreground">No named material to replace.</li>}
      </ul>
    </Shell>
  );
}
