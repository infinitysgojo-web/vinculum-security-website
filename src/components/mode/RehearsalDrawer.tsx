import { useEffect, useMemo, useState } from "react";
import { Check, FileJson, FileText, GitBranch, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import ShockTimelineScrubber from "@/components/desk/ShockTimelineScrubber";
import ExecutiveSummary from "@/components/desk/ExecutiveSummary";
import { inscriptionTimeline } from "@/components/desk/shockTimeline";
import { missionSlug, type ExecSummary } from "@/components/desk/executiveBrief";
import { buildManifest, diplomaticCable, downloadBlob, type ManifestBody } from "@/components/desk/DiplomaticCableExport";
import type { Signals } from "@/components/desk/engine";
import { BASELINE_ID, MAX_BRANCHES, postureDiff, postureOf, type BranchStore, type DiffRow, type PostureState } from "./postureBranches";

type ExportKind = "manifest" | "briefing" | "cable";

export type RehearsalTab = "branches" | "diff" | "timeline" | "summary" | "pouch";

const TABS: { id: RehearsalTab; label: string }[] = [
  { id: "branches", label: "Branches" },
  { id: "diff", label: "Posture diff" },
  { id: "timeline", label: "Timeline" },
  { id: "summary", label: "Summary" },
  { id: "pouch", label: "Export pouch" },
];

const sign = (n: number | null, unit = "") => (n === null ? "—" : `${n > 0 ? "+" : ""}${Number.isInteger(n) ? n : n.toFixed(1)}${unit}`);
const show = (n: number | null, unit = "") => (n === null ? "—" : `${Number.isInteger(n) ? n : n.toFixed(1)}${unit}`);

/**
 * Surface 2, the Rehearsal and Handover Drawer: posture branching, the bilateral posture
 * diff, the shock timeline, the one-page executive summary and the three-tier evidentiary
 * export pouch, in one slide-over workbench embedded in /dashboard.
 */
export default function RehearsalDrawer({
  open,
  onOpenChange,
  tab,
  onTab,
  branches,
  live,
  startState,
  readOnly,
  onCreateBranch,
  onSwitch,
  onDeleteBranch,
  rawSignals,
  summary,
  manifestBody,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  tab: RehearsalTab;
  onTab: (t: RehearsalTab) => void;
  branches: BranchStore;
  live: PostureState;
  /** The exercise's starting state (preset default), when the workspace has one. */
  startState?: Signals;
  readOnly?: boolean;
  onCreateBranch: (name: string) => void;
  onSwitch: (id: string) => void;
  onDeleteBranch: (id: string) => void;
  rawSignals: Signals;
  summary: ExecSummary;
  manifestBody: () => ManifestBody;
}) {
  const [name, setName] = useState("");
  const slots = useMemo(
    () => [
      { id: BASELINE_ID, label: "Baseline posture" },
      ...branches.branches.map((b) => ({ id: b.id, label: b.name })),
      ...(startState ? [{ id: "start", label: "Preset default (exercise start)" }] : []),
    ],
    [branches.branches, startState],
  );
  const [aId, setA] = useState(BASELINE_ID);
  const [bId, setB] = useState<string | null>(null);
  const bSel = bId ?? branches.active;
  const [pledge, setPledge] = useState("");
  const stateOf = (id: string): Signals | undefined => (id === "start" ? startState : postureOf(branches, id, live)?.signals);
  const A = stateOf(aId);
  const B = stateOf(bSel);
  const diff = useMemo(() => (A && B ? postureDiff(A, B, Number(pledge) || undefined) : null), [A, B, pledge]);
  const timeline = useMemo(() => inscriptionTimeline(rawSignals), [rawSignals]);
  const slug = missionSlug(summary.masthead.title);
  const [busy, setBusy] = useState<string | null>(null);

  const [requested, setRequested] = useState<Partial<Record<ExportKind, number>>>({});
  useEffect(() => {
    setRequested({});
  }, [open, slug, rawSignals, summary]);
  useEffect(() => {
    if (!Object.keys(requested).length) return;
    const timer = window.setTimeout(() => setRequested({}), 6000);
    return () => window.clearTimeout(timer);
  }, [requested]);
  const markRequested = (kind: ExportKind) => setRequested((previous) => ({ ...previous, [kind]: Date.now() }));

  const exportFile = async (kind: ExportKind | "all") => {
    setBusy(kind);
    try {
      const m = await buildManifest(manifestBody());
      if (kind === "manifest" || kind === "all") {
        downloadBlob(new Blob([JSON.stringify(m, null, 2)], { type: "application/json" }), `${slug}-manifest.json`);
        markRequested("manifest");
      }
      if (kind === "cable" || kind === "all") {
        downloadBlob(new Blob([diplomaticCable(summary, { digest: m.integrity.hash })], { type: "text/plain;charset=us-ascii" }), `${slug}-cable.txt`);
        markRequested("cable");
      }
      if (kind === "briefing" || kind === "all") {
        const { buildExecutiveBriefingPdf } = await import("@/components/desk/ExecutiveSummaryPdf");
        downloadBlob(await buildExecutiveBriefingPdf(summary), `${slug}-briefing.pdf`);
        markRequested("briefing");
      }
      toast.success(kind === "all" ? `Pouch sealed · manifest SHA-256 ${m.integrity.hash.slice(0, 12)}…` : "Download requested");
    } catch {
      toast.error("Export assembly failed. Any downloads already requested remain available.");
    } finally {
      setBusy(null);
    }
  };

  const btn = "inline-flex min-h-10 items-center gap-2 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.14em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40";
  const sel = "min-h-10 w-full min-w-0 border border-border bg-background px-2 text-sm";
  const Row = ({ r }: { r: DiffRow }) => (
    <tr className="border-t border-border">
      <td className="py-1 pr-2">{r.label}</td>
      <td className="py-1 px-2 text-right font-mono tabular-nums">{show(r.baseline, r.unit)}</td>
      <td className="py-1 px-2 text-right font-mono tabular-nums">{show(r.active, r.unit)}</td>
      <td className={`py-1 pl-2 text-right font-mono tabular-nums ${r.delta === null || r.delta === 0 ? "text-muted-foreground" : r.delta > 0 ? "text-terracotta" : "text-emerald"}`}>{sign(r.delta, r.unit)}</td>
    </tr>
  );

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto overflow-x-hidden p-4 sm:p-6" data-testid="rehearsal-drawer">
        <SheetHeader className="text-left">
          <SheetTitle className="font-serif text-primary">Rehearsal and handover</SheetTitle>
          <SheetDescription>Local what-if postures, deltas, playback and the leadership pouch. Browser-local; nothing leaves this device.</SheetDescription>
        </SheetHeader>
        <div className="mt-4 -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 scrollbar-none" role="tablist" aria-label="Rehearsal tools">
          {TABS.map((t) => (
            <button key={t.id} type="button" role="tab" aria-selected={tab === t.id} onClick={() => onTab(t.id)}
              className={`shrink-0 min-h-9 border px-3 text-[10px] uppercase tracking-[0.14em] font-semibold ${tab === t.id ? "border-primary bg-primary text-primary-foreground" : "border-brass/50 text-primary hover:border-accent"}`}
              data-testid={`rehearsal-tab-${t.id}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === "branches" && (
          <section className="mt-4 space-y-4 min-w-0">
            <p className="text-xs text-muted-foreground">A branch inherits the mission profile, warrant and desk state, and keeps its own bus signals and bond vector in this tab's session storage. Switching re-hydrates every desk; the saved workspace keeps the baseline posture.</p>
            <ul className="space-y-1.5">
              {[{ id: BASELINE_ID, name: "Baseline posture", createdAt: "" }, ...branches.branches].map((b) => {
                const on = branches.active === b.id;
                return (
                  <li key={b.id} className={`flex flex-wrap items-center gap-2 border p-2 ${on ? "border-accent bg-accent/10" : "border-border"}`}>
                    <GitBranch size={13} className={on ? "text-accent" : "text-muted-foreground"} />
                    <span className="min-w-0 flex-1 text-sm text-primary [overflow-wrap:anywhere]">{b.name}{on && <span className="ml-2 text-[9px] uppercase tracking-[0.14em] text-accent">On the bus</span>}</span>
                    {!on && <button type="button" onClick={() => onSwitch(b.id)} className={btn} data-testid={`switch-${b.id}`}>Switch</button>}
                    {!on && b.id !== BASELINE_ID && (
                      <button type="button" onClick={() => onDeleteBranch(b.id)} className="inline-flex min-h-10 items-center px-2 text-muted-foreground hover:text-destructive" aria-label={`Delete ${b.name}`}><Trash2 size={13} /></button>
                    )}
                  </li>
                );
              })}
            </ul>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => { e.preventDefault(); onCreateBranch(name); setName(""); }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Branch B: Total Sovereign Rupture" aria-label="Branch name" className={`${sel} flex-1`} maxLength={80} disabled={readOnly} />
              <button type="submit" className={btn} disabled={readOnly || branches.branches.length >= MAX_BRANCHES} data-testid="create-branch">
                <GitBranch size={13} /> Create posture branch
              </button>
            </form>
            {readOnly && <p className="text-[11px] text-terracotta">A sealed local snapshot is read only. Continue in a new draft to branch it.</p>}
          </section>
        )}

        {tab === "diff" && (
          <section className="mt-4 space-y-3 min-w-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Baseline
                <select value={aId} onChange={(e) => setA(e.target.value)} className={sel}>{slots.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
              </label>
              <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Active
                <select value={bSel} onChange={(e) => setB(e.target.value)} className={sel}>{slots.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}</select>
              </label>
              <label className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Pledge value (optional)
                <input type="number" inputMode="decimal" min={0} value={pledge} onChange={(e) => setPledge(e.target.value)} placeholder="e.g. 250000000" className={sel} />
              </label>
            </div>
            {!diff ? (
              <p className="text-xs text-muted-foreground">Create a branch to compare postures. The baseline is captured when the first branch opens.</p>
            ) : (
              <>
                <div className="w-full overflow-x-auto border border-border">
                  <table className="w-full min-w-[28rem] border-collapse text-xs" data-testid="posture-diff">
                    <thead>
                      <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                        <th className="py-1.5 pr-2 pl-2 font-semibold">Metric</th>
                        <th className="py-1.5 px-2 text-right font-semibold">Baseline</th>
                        <th className="py-1.5 px-2 text-right font-semibold">Active</th>
                        <th className="py-1.5 pl-2 pr-2 text-right font-semibold">Δ</th>
                      </tr>
                    </thead>
                    <tbody className="[&_td:first-child]:pl-2 [&_td:last-child]:pr-2">
                      <Row r={diff.rupture} />
                      <Row r={diff.exposure} />
                      {diff.bonds.map((r) => <Row key={r.key} r={r} />)}
                      <Row r={diff.survival} />
                      <tr className="border-t border-border">
                        <td className="py-1 pr-2">Escrow capital at risk</td>
                        <td className="py-1 px-2 text-right font-mono tabular-nums">{show(diff.escrow.atRiskBaseline, "%")}{diff.escrow.frozenBaseline ? " ·F" : ""}</td>
                        <td className="py-1 px-2 text-right font-mono tabular-nums">{show(diff.escrow.atRiskActive, "%")}{diff.escrow.frozenActive ? " ·F" : ""}</td>
                        <td className={`py-1 pl-2 text-right font-mono tabular-nums ${!diff.escrow.deltaAtRisk ? "text-muted-foreground" : diff.escrow.deltaAtRisk > 0 ? "text-terracotta" : "text-emerald"}`}>{sign(diff.escrow.deltaAtRisk, "%")}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  ΔR = R_active − R_baseline; ΔU and ΔB the same. Positive deltas on R, U and capital at risk read as deterioration; on bonds a positive delta is repair.{" "}
                  {diff.escrow.currencyDelta !== null && <span className="text-primary">Capital at risk changes by {diff.escrow.currencyDelta.toLocaleString(undefined, { maximumFractionDigits: 2 })} in the pledge's currency.</span>}
                  {" "}·F marks a frozen account (R ≥ 60).
                </p>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div className="border border-border p-2 min-w-0"><p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Contested · introduced in active</p>{diff.covenants.introduced.length ? diff.covenants.introduced.map((c) => <p key={c} className="text-terracotta [overflow-wrap:anywhere]">+ {c}</p>) : <p className="text-muted-foreground">None</p>}</div>
                  <div className="border border-border p-2 min-w-0"><p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Withdrawn from baseline</p>{diff.covenants.withdrawn.length ? diff.covenants.withdrawn.map((c) => <p key={c} className="text-muted-foreground line-through [overflow-wrap:anywhere]">− {c}</p>) : <p className="text-muted-foreground">None</p>}</div>
                </div>
              </>
            )}
          </section>
        )}

        {tab === "timeline" && (
          <section className="mt-4 min-w-0">
            <ShockTimelineScrubber
              title="Inscribed compound shocks · T0 → TN"
              steps={timeline}
              note="Inscribed shocks on the bus, one per step, applied to the bond vector exactly as the engine does (clamped 1.0 to 5.0). R follows the Sentinel's inscribed-load rule; λ uses the exposure U from Desk 12. Desks 03 and 12 carry their own scrubbers for their shock lists."
            />
          </section>
        )}

        {tab === "summary" && (
          <section className="mt-4 min-w-0">
            <ExecutiveSummary m={summary} />
          </section>
        )}

        {tab === "pouch" && (
          <section className="mt-4 space-y-3 min-w-0">
            <p className="text-xs text-muted-foreground">The diplomatic pouch, assembled in this browser from one summary model so the three files agree. The cable carries the manifest's SHA-256.</p>
            <ul className="space-y-2">
              <li className="flex flex-wrap items-center gap-2 border border-border p-2"><FileJson size={14} className="text-accent" /><span className="min-w-0 flex-1 font-mono text-xs [overflow-wrap:anywhere]">{slug}-manifest.json</span><span role="status" className="inline-flex shrink-0 items-center text-emerald">{requested.manifest && <Check size={14} aria-label="Download requested" />}</span><Button variant="ghost" type="button" className={`rounded-none hover:bg-transparent ${btn}`} disabled={!!busy} aria-label="Save manifest" onClick={() => void exportFile("manifest")}>Save</Button></li>
              <li className="flex flex-wrap items-center gap-2 border border-border p-2"><FileText size={14} className="text-accent" /><span className="min-w-0 flex-1 font-mono text-xs [overflow-wrap:anywhere]">{slug}-briefing.pdf</span><span role="status" className="inline-flex shrink-0 items-center text-emerald">{requested.briefing && <Check size={14} aria-label="Download requested" />}</span><Button variant="ghost" type="button" className={`rounded-none hover:bg-transparent ${btn}`} disabled={!!busy} aria-label="Save briefing" onClick={() => void exportFile("briefing")}>Save</Button></li>
              <li className="flex flex-wrap items-center gap-2 border border-border p-2"><FileText size={14} className="text-accent" /><span className="min-w-0 flex-1 font-mono text-xs [overflow-wrap:anywhere]">{slug}-cable.txt</span><span role="status" className="inline-flex shrink-0 items-center text-emerald">{requested.cable && <Check size={14} aria-label="Download requested" />}</span><Button variant="ghost" type="button" className={`rounded-none hover:bg-transparent ${btn}`} disabled={!!busy} aria-label="Save cable" onClick={() => void exportFile("cable")}>Save</Button></li>
            </ul>
            <Button variant="ghost" type="button" className={`rounded-none hover:bg-transparent ${btn}`} disabled={!!busy} onClick={() => void exportFile("all")} data-testid="export-pouch">
              <Package size={13} /> {busy ? "Assembling…" : "Save all three"}
            </Button>
            <pre className="max-h-56 overflow-auto border border-border bg-background p-2 font-mono text-[10px] leading-snug whitespace-pre" data-testid="cable-preview">{diplomaticCable(summary)}</pre>
          </section>
        )}
      </SheetContent>
    </Sheet>
  );
}
