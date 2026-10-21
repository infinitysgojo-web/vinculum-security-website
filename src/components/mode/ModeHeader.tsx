import { useState } from "react";
import { ArrowLeft, ChevronDown, BookOpen, HardDrive, ClipboardList, GitBranch, History, Lock, NotebookPen, PanelRight, RotateCcw, ScrollText, ShieldCheck, Sprout, Stamp } from "lucide-react";
import { deskCanPublish, deskIsLive } from "@/components/desk/MissionChain";
import type { Signals } from "@/components/desk/engine";
import { SPINE, stageStatus, type Scenario, type SpineStage } from "./scenarios";
import { LIFECYCLE_SHORT, MODE_LABEL, type Workspace } from "./workspace";
import type { SaveStatus } from "./workspaceStore";
import { btn, type NetworkState } from "./ui";

export type HeaderAction =
  | "foyer"
  | "tray"
  | "brief"
  | "reset"
  | "branch"
  | "replay"
  | "aar"
  | "promote"
  | "warrant"
  | "lifecycle"
  | "derive"
  | "verify"
  | "continue"
  | "local-data";

const SAVE_TEXT: Record<SaveStatus, string> = {
  saved: "Locally saved",
  held: "Held in memory: enclave sealed",
  unavailable: "Not saved: this browser refused storage",
  full: "Not saved: browser storage is full. Export a backup, then free space",
  idle: "Not yet saved",
};

/**
 * The shared mode layer above the desk canvas: mode badge, title, truthful local status,
 * the browser's own network report, a return to the Foyer, the mode's controls, and the
 * Mission Spine. It reads the bus; it never writes to it.
 */
export default function ModeHeader({
  ws,
  scenario,
  network,
  saveStatus,
  signals,
  desk,
  deskLabel,
  onAction,
  onStage,
}: {
  ws: Workspace;
  scenario?: Scenario;
  network: NetworkState;
  saveStatus: SaveStatus;
  signals: Signals;
  desk: string;
  deskLabel: (id: string) => string;
  onAction: (a: HeaderAction) => void;
  onStage: (s: SpineStage) => void;
}) {
  const preset = ws.mode === "preset";
  const sealed = ws.lifecycle === "sealed";
  const status = sealed ? "Sealed local snapshot" : SAVE_TEXT[saveStatus];
  const net = `${network.online ? "Online" : "Offline"} · data stays on this device`;
  const activeStage = SPINE.find((s) => s.desks.includes(desk));
  const read = (s: SpineStage) => stageStatus(s, (d) => deskIsLive(d, signals), deskCanPublish, ws);
  const inSequence = (s: SpineStage) => !!scenario && s.desks.some((d) => scenario.sequence.includes(d));
  // On phones the controls fold away behind one button, so the desk canvas stays first.
  const [controlsOpen, setControlsOpen] = useState(false);

  return (
    <section aria-label="Mission mode" className="mb-6 border border-brass/50 bg-card/60">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-brass/40 px-3 py-3 sm:px-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.18em] ${preset ? "border-brass bg-background text-primary" : "border-primary bg-primary text-primary-foreground"}`}>
              {MODE_LABEL[ws.mode]}
            </span>
            {preset && (
              <span className="border border-dashed border-accent px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-accent">
                {ws.derived ? "Derived training / preset" : "Training / preset"}
              </span>
            )}
            <span className="inline-flex items-center gap-1 border border-border px-2 py-0.5 text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
              {sealed && <Lock size={10} aria-hidden />}
              {LIFECYCLE_SHORT[ws.lifecycle]}
            </span>
          </div>
          <h2 className="mt-2 font-serif text-lg text-primary [overflow-wrap:anywhere] sm:text-xl">{ws.title}</h2>
          <p className="mt-1 text-[11px] text-muted-foreground [overflow-wrap:anywhere]">
            {status} · {net}
            {network.cached === false ? " · Offline copy unavailable" : ""}
            {ws.lineage ? ` · ${ws.lineage.note}` : ""}
            {sealed && ws.sealed ? ` · ${ws.sealed.ref}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" className={btn} onClick={() => onAction("tray")} aria-label="Open the Context Tray">
            <PanelRight size={13} /> <span>Context</span>
          </button>
          <button type="button" className={btn} onClick={() => onAction("foyer")} aria-label="Return to the Mission Foyer">
            <ArrowLeft size={13} /> <span>Foyer</span>
          </button>
        </div>
      </div>

      <div className="border-b border-brass/40 px-3 py-2 md:hidden">
        <button type="button" className={`${btn} w-full justify-between`} aria-expanded={controlsOpen} aria-controls="mode-controls" onClick={() => setControlsOpen((v) => !v)}>
          <span>{preset ? "Exercise controls" : "Mission controls"}</span>
          <ChevronDown size={13} className={controlsOpen ? "rotate-180" : ""} aria-hidden />
        </button>
      </div>
      <div id="mode-controls" className={`${controlsOpen ? "grid grid-cols-2" : "hidden"} gap-2 border-b border-brass/40 px-3 py-2.5 sm:px-4 md:flex md:flex-wrap`} role="toolbar" aria-label={preset ? "Exercise controls" : "Mission controls"}>
        {preset ? (
          <>
            <button type="button" className={btn} onClick={() => onAction("brief")}><BookOpen size={13} /> {scenario ? "Scenario brief" : "Exercise brief"}</button>
            <button type="button" className={btn} onClick={() => onAction("reset")} disabled={!ws.baseline}><RotateCcw size={13} /> Reset</button>
            <button type="button" className={btn} onClick={() => onAction("branch")}><GitBranch size={13} /> Branch</button>
            <button type="button" className={btn} onClick={() => onAction("replay")}><History size={13} /> Replay</button>
            <button type="button" className={btn} onClick={() => onAction("aar")}><ClipboardList size={13} /> After-action review</button>
            <button type="button" className={btn} onClick={() => onAction("promote")}><Sprout size={13} /> Promote to custom mission</button>
          </>
        ) : (
          <>
            <button type="button" className={btn} onClick={() => onAction("warrant")}><NotebookPen size={13} /> Mission Warrant</button>
            <button type="button" className={btn} onClick={() => onAction("lifecycle")}><ScrollText size={13} /> {sealed ? "Snapshot record" : "Review and lifecycle"}</button>
            {sealed ? (
              <>
                <button type="button" className={btn} onClick={() => onAction("verify")}><ShieldCheck size={13} /> Verify seal</button>
                <button type="button" className={btn} onClick={() => onAction("continue")}><Stamp size={13} /> Continue in new draft</button>
              </>
            ) : null}
            <button type="button" className={btn} onClick={() => onAction("derive")}><Sprout size={13} /> Create training derivative</button>
          </>
        )}
        <button type="button" className={btn} onClick={() => onAction("local-data")}><HardDrive size={13} /> Backup and import</button>
      </div>

      {sealed && (
        <p className="border-b border-brass/40 px-3 py-2 text-[11px] text-muted-foreground sm:px-4">
          Read-only snapshot. The desks stay usable for reading, but changes made in this view are not recorded into the sealed record.
        </p>
      )}

      <nav aria-label="Mission Spine" className="px-3 py-3 sm:px-4">
        <label className="md:hidden">
          <span className="mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70">Mission Spine</span>
          <select
            className="w-full border border-input bg-background px-3 py-2 text-sm"
            value={activeStage?.id ?? ""}
            onChange={(e) => {
              const s = SPINE.find((x) => x.id === e.target.value);
              if (s) onStage(s);
            }}
          >
            {!activeStage && <option value="">Choose a stage</option>}
            {SPINE.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label} · {read(s).text}
              </option>
            ))}
          </select>
        </label>
        <ol className="hidden gap-1.5 md:grid md:grid-cols-4 xl:grid-cols-7">
          {SPINE.map((s, i) => {
            const on = activeStage?.id === s.id;
            const st = read(s);
            return (
              <li key={s.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onStage(s)}
                  aria-current={on ? "step" : undefined}
                  title={s.desks.length ? s.desks.map(deskLabel).join(", ") : s.label}
                  className={`flex h-full w-full min-w-0 flex-col items-start border px-2 py-2 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                    on ? "border-accent bg-background" : "border-border hover:border-accent"
                  }`}
                >
                  <span className="font-mono text-[9px] text-muted-foreground">{String(i + 1).padStart(2, "0")}{inSequence(s) ? " · in exercise" : ""}</span>
                  <span className={`mt-0.5 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] ${on ? "text-accent" : "text-primary"}`}>{s.label}</span>
                  <span className="mt-1 text-[10px] leading-tight text-muted-foreground">{st.text}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </nav>
    </section>
  );
}
