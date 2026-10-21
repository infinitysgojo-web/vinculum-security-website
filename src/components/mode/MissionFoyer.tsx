import { BookOpen, FilePlus2, FolderOpen, History, Lock, Play, RotateCcw, ScrollText } from "lucide-react";
import GoldRule from "@/components/GoldRule";
import { LIFECYCLE_LABEL, MODE_LABEL, type Mode, type Workspace } from "./workspace";
import { btn, btnPrimary, eyebrowCls, localStamp, type NetworkState } from "./ui";

export type FoyerAction =
  | { kind: "continue-exercise" }
  | { kind: "library" }
  | { kind: "replay" }
  | { kind: "new-exercise" }
  | { kind: "new-mission" }
  | { kind: "resume-draft" }
  | { kind: "review-ready" }
  | { kind: "sealed" };

const byRecent = (a: Workspace, b: Workspace) => (b.updatedAt || "").localeCompare(a.updatedAt || "");

/**
 * The Mission Foyer: two equal entry paths after sign-in. Every count and name here is
 * read from the workspaces stored in this browser; with none, it says so.
 */
export default function MissionFoyer({
  workspaces,
  lastMode,
  network,
  legacyDraft,
  storeError,
  onAction,
}: {
  workspaces: Workspace[];
  lastMode: Mode | null;
  network: NetworkState;
  /** A saved browser session from before the two modes, offered as a draft to resume. */
  legacyDraft: boolean;
  storeError?: string;
  onAction: (a: FoyerAction) => void;
}) {
  const exercises = workspaces.filter((w) => w.mode === "preset").sort(byRecent);
  const missions = workspaces.filter((w) => w.mode === "custom").sort(byRecent);
  const drafts = missions.filter((w) => w.lifecycle === "draft");
  const review = missions.filter((w) => w.lifecycle === "review" || w.lifecycle === "ready");
  const sealed = missions.filter((w) => w.lifecycle === "sealed");
  const offline =
    network.cached === null ? "Offline availability: not reported by this browser" : network.cached ? "Offline copy cached in this browser" : "Offline copy not yet cached: needs one online load";

  return (
    <section aria-labelledby="foyer-title" className="py-2">
      <p className={eyebrowCls}>Mission Foyer</p>
      <h1 id="foyer-title" className="mt-2 font-serif text-2xl text-primary sm:text-3xl">Choose the mandate for this session</h1>
      <GoldRule className="mb-4 mt-4" />
      <p className="max-w-3xl text-sm text-muted-foreground">
        Both paths open the same eighteen desks, the same calculations and the same signal chain. Work stays in this browser: nothing is synced, shared or approved
        anywhere else.
      </p>
      {storeError && (
        <p role="status" className="mt-4 max-w-3xl border border-destructive/50 bg-destructive/5 px-3 py-2 text-xs text-destructive">
          {storeError}
        </p>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <ModeCard
          mode="preset"
          remembered={lastMode === "preset"}
          purpose="Rehearse real desk logic through guided, resettable scenarios."
          status={[
            exercises.length ? `${exercises.length} local exercise${exercises.length === 1 ? "" : "s"}` : "No local exercises yet",
            exercises[0] ? `Last opened: ${exercises[0].title}` : "Nothing opened yet",
            offline,
          ]}
        >
          <ActionButton primary icon={<Play size={13} />} label="Continue Local Exercise" disabled={!exercises.length} hint={exercises.length ? undefined : "No exercise saved in this browser"} onClick={() => onAction({ kind: "continue-exercise" })} />
          <ActionButton icon={<BookOpen size={13} />} label="Open Scenario Library" onClick={() => onAction({ kind: "library" })} />
          <ActionButton icon={<History size={13} />} label="Replay a Prior Run" disabled={!exercises.length} hint={exercises.length ? undefined : "No prior run recorded"} onClick={() => onAction({ kind: "replay" })} />
          <ActionButton icon={<RotateCcw size={13} />} label="Start a New Exercise" onClick={() => onAction({ kind: "new-exercise" })} />
        </ModeCard>

        <ModeCard
          mode="custom"
          remembered={lastMode === "custom"}
          purpose="Build a structured, evidence-aware working mission from your own material."
          status={[
            drafts.length || legacyDraft ? `${drafts.length + (legacyDraft ? 1 : 0)} local draft${drafts.length + (legacyDraft ? 1 : 0) === 1 ? "" : "s"}` : "No local drafts yet",
            sealed.length ? `${sealed.length} sealed local snapshot${sealed.length === 1 ? "" : "s"}` : "No sealed local snapshots",
            "Local only: no cloud copy, collaboration or approval",
          ]}
        >
          <ActionButton primary icon={<FilePlus2 size={13} />} label="Start New Mission" onClick={() => onAction({ kind: "new-mission" })} />
          <ActionButton icon={<FolderOpen size={13} />} label="Resume Local Draft" disabled={!drafts.length && !legacyDraft} hint={drafts.length || legacyDraft ? undefined : "No draft saved in this browser"} onClick={() => onAction({ kind: "resume-draft" })} />
          <ActionButton icon={<ScrollText size={13} />} label="Open Review-Ready Work" disabled={!review.length} hint={review.length ? undefined : "Nothing in review preparation"} onClick={() => onAction({ kind: "review-ready" })} />
          <ActionButton icon={<Lock size={13} />} label="Open Sealed Snapshot" disabled={!sealed.length} hint={sealed.length ? undefined : "No sealed snapshot yet"} onClick={() => onAction({ kind: "sealed" })} />
        </ModeCard>
      </div>
      {missions[0] && (
        <p className="mt-4 text-xs text-muted-foreground">
          Last custom mission: <span className="text-primary">{missions[0].title}</span> · {LIFECYCLE_LABEL[missions[0].lifecycle]} · {localStamp(missions[0].updatedAt)}
        </p>
      )}
    </section>
  );
}

function ModeCard({ mode, purpose, status, remembered, children }: { mode: Mode; purpose: string; status: string[]; remembered: boolean; children: React.ReactNode }) {
  const id = `foyer-${mode}`;
  return (
    <article aria-labelledby={id} className="flex min-w-0 flex-col border border-brass/50 bg-card/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className={eyebrowCls}>{mode === "preset" ? "Mandate I · Training" : "Mandate II · Operational record"}</p>
        {remembered && <span className="border border-brass/60 px-2 py-0.5 text-[9px] uppercase tracking-[0.18em] text-primary/80">Last used here</span>}
      </div>
      <h2 id={id} className="mt-2 font-serif text-xl text-primary">{MODE_LABEL[mode]}</h2>
      <p className="mt-2 text-sm text-foreground/85">{purpose}</p>
      <ul className="mt-4 space-y-1 border-l-2 border-brass/40 pl-3 text-xs text-muted-foreground">
        {status.map((s) => (
          <li key={s} className="[overflow-wrap:anywhere]">{s}</li>
        ))}
      </ul>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">{children}</div>
    </article>
  );
}

function ActionButton({ label, icon, onClick, disabled, hint, primary }: { label: string; icon: React.ReactNode; onClick: () => void; disabled?: boolean; hint?: string; primary?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={hint} className={`${primary ? btnPrimary : btn} w-full justify-start text-left`}>
      {icon}
      <span className="min-w-0">{label}</span>
      {hint && <span className="sr-only">. {hint}</span>}
    </button>
  );
}
