import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { Signals } from "@/components/desk/engine";
import { DESK_GUIDES, type Checkpoint } from "./scenarios";
import { btn } from "./ui";

/**
 * Compact, expandable guide for a desk in the current exercise: PURPOSE, DO, EXPECT,
 * WHY and HANDS OFF, followed by any checkpoint for this desk. A checkpoint shows the
 * live reading it asks about and an explanation only when the user asks for them. It
 * never grades.
 */
export default function DeskGuide({
  deskId,
  step,
  of,
  checkpoints,
  revealed,
  signals,
  onReveal,
}: {
  deskId: string;
  step?: number;
  of?: number;
  checkpoints: Checkpoint[];
  revealed: string[];
  signals: Signals;
  onReveal: (id: string) => void;
}) {
  const g = DESK_GUIDES[deskId];
  const [open, setOpen] = useState(false);
  if (!g) return null;
  const id = `guide-${deskId}`;
  return (
    <section aria-labelledby={`${id}-h`} className="mb-6 border border-dashed border-brass/70 bg-background">
      <h2 id={`${id}-h`} className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={id}
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-4"
        >
          <span className="min-w-0">
            <span className="block font-mono text-[9px] uppercase tracking-[0.18em] text-accent">
              Training guide{step && of ? ` · step ${step} of ${of} in this exercise` : ""}
            </span>
            <span className="mt-0.5 block text-sm text-primary [overflow-wrap:anywhere]">{g.purpose}</span>
          </span>
          <ChevronDown size={14} className={`shrink-0 text-primary/70 transition-transform ${open ? "rotate-180" : ""}`} aria-hidden />
        </button>
      </h2>
      <div id={id} hidden={!open} className="border-t border-brass/40 px-3 py-3 sm:px-4">
        <dl className="grid gap-3 text-xs sm:grid-cols-2">
          <Row term="Purpose" items={[g.purpose]} />
          <Row term="Do" items={g.do} />
          <Row term="Expect" items={g.expect} />
          <Row term="Why" items={[g.why]} />
          <Row term="Hands off" items={g.handsOff} />
        </dl>
        {checkpoints.length > 0 && (
          <div className="mt-4 space-y-3">
            {checkpoints.map((c) => {
              const shown = revealed.includes(c.id);
              return (
                <div key={c.id} className="border border-brass/40 bg-card/60 p-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">Checkpoint · a learning pause, not a score</p>
                  <p className="mt-1 text-sm text-primary [overflow-wrap:anywhere]">{c.question}</p>
                  {shown ? (
                    <div className="mt-2 space-y-1 text-xs">
                      <p className="text-foreground [overflow-wrap:anywhere]"><span className="font-semibold">Live reading:</span> {c.observe(signals)}</p>
                      <p className="text-muted-foreground [overflow-wrap:anywhere]"><span className="font-semibold text-foreground/80">Explanation:</span> {c.explain}</p>
                    </div>
                  ) : (
                    <button type="button" className={`${btn} mt-2`} onClick={() => onReveal(c.id)}>
                      I have considered it: show the reading
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

function Row({ term, items }: { term: string; items: string[] }) {
  return (
    <div className="min-w-0">
      <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70">{term}</dt>
      <dd className="mt-1">
        <ul className="space-y-0.5 text-foreground/85">
          {items.map((t) => (
            <li key={t} className="[overflow-wrap:anywhere]">{t}</li>
          ))}
        </ul>
      </dd>
    </div>
  );
}
