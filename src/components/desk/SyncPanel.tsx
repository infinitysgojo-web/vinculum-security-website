import { useState } from "react";
import { Activity, ChevronDown, Link2, Link2Off } from "lucide-react";
import { alerts, hasSignal, useEngine, type Signals } from "./engine";

const TONE: Record<string, string> = {
  critical: "border-terracotta/60 text-terracotta",
  elevated: "border-brass/70 text-primary",
  note: "border-border text-muted-foreground",
};

/**
 * The live link between a downstream desk and the divisions above it.
 * Shows what the engine is feeding this desk, and lets the analyst cut the
 * feed and work from their own figures instead.
 */
export default function SyncPanel({
  linked,
  onToggle,
  summary,
}: {
  linked: boolean;
  onToggle: (v: boolean) => void;
  /** Lines describing what this desk does with the upstream reading. */
  summary?: (s: Signals) => string[];
}) {
  const { signals } = useEngine();
  const live = hasSignal(signals);
  const list = live && linked ? alerts(signals) : [];
  const notes = live && linked && summary ? summary(signals) : [];
  // Standing alerts repeat on every desk, so only the two most severe stay open by default.
  const [open, setOpen] = useState(false);
  const rank = { critical: 0, elevated: 1, note: 2 } as Record<string, number>;
  const sorted = [...list].sort((a, b) => (rank[a.level] ?? 3) - (rank[b.level] ?? 3));
  const shown = open ? sorted : sorted.slice(0, 2);

  return (
    <div className="border border-brass/40 bg-background/70 p-4 min-w-0">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/70">
          <Activity size={13} className={live && linked ? "text-accent" : "text-muted-foreground"} />
          {live ? (linked ? "Linked to the mission engine" : "Working independently") : "No upstream reading yet"}
        </p>
        <button
          type="button"
          onClick={() => onToggle(!linked)}
          className="inline-flex items-center gap-2 border border-brass/50 px-3 py-2 min-h-10 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
        >
          {linked ? <Link2Off size={12} /> : <Link2 size={12} />}
          {linked ? "Override" : "Relink"}
        </button>
      </div>

      {!live && (
        <p className="mt-3 text-xs text-muted-foreground">
          Score the bonds and record the warning signs in Division I, and this desk will adapt to them on its own.
        </p>
      )}

      {notes.length > 0 && (
        <ul className="mt-3 space-y-1.5 text-xs text-foreground/85">
          {notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-accent">·</span>
              <span className="[overflow-wrap:anywhere]">{n}</span>
            </li>
          ))}
        </ul>
      )}

      {list.length > 0 && (
        <div className="mt-3 space-y-2">
          {shown.map((a) => (
            <div key={a.name} className={`border-l-2 pl-3 ${TONE[a.level]}`}>
              <p className="text-[10px] uppercase tracking-[0.16em] font-semibold">{a.name}</p>
              <p className="text-xs text-foreground/80 mt-0.5">{a.reading}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{a.directive}</p>
            </div>
          ))}
          {sorted.length > 2 && (
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
              className="inline-flex min-h-10 items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] font-semibold text-accent hover:text-primary"
            >
              <ChevronDown size={12} className={open ? "rotate-180 transition-transform" : "transition-transform"} />
              {open ? "Show fewer standing alerts" : `Show ${sorted.length - 2} more standing alert${sorted.length - 2 === 1 ? "" : "s"}`}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
