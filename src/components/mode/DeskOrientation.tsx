import { useEffect, useRef } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Check, ShieldCheck, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DESK_GUIDES } from "./scenarios";

type Desk = { id: string; division: string; label: string; title: string };
type Division = { id: string; label: string };

/** Static orientation outside desk surfaces; never reads or publishes mission values. */
export default function DeskOrientation({ desks, divisions, deskId, onDesk, onClose, onWork }: {
  desks: readonly Desk[];
  divisions: readonly Division[];
  deskId: string;
  onDesk: (id: string) => void;
  onClose: () => void;
  onWork: () => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => { heading.current?.focus(); }, [deskId]);
  const index = desks.findIndex((d) => d.id === deskId);
  const desk = desks[index];
  const guide = DESK_GUIDES[deskId];
  if (!desk || !guide) return null;
  const previous = desks[index - 1];
  const next = desks[index + 1];
  return (
    <section aria-labelledby="orientation-title" data-testid="desk-orientation" data-shroud-keep className="mb-6 border-y border-brass/60 bg-secondary/30 py-4 print:hidden">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="flex items-center gap-2 font-mono text-xs text-accent"><BookOpen size={15} aria-hidden /> Desk orientation · {String(index + 1).padStart(2, "0")} / {desks.length}</p>
          <h2 ref={heading} id="orientation-title" tabIndex={-1} className="mt-2 font-serif text-xl leading-snug text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring">{desk.label}</h2>
          <p className="mt-1 text-xs text-muted-foreground">{divisions.find((d) => d.id === desk.division)?.label}</p>
          {deskId === "sentinel" && <p className="mt-1 text-xs text-accent">The Eye of Humanity</p>}
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close desk orientation" title="Close desk orientation" className="shrink-0"><X aria-hidden /></Button>
      </div>
      <div className="mt-4 grid gap-5 lg:grid-cols-[1fr_1.3fr_1fr]">
        <div className="min-w-0"><h3 className="text-xs font-semibold text-primary">Purpose</h3><p className="mt-2 text-sm leading-relaxed text-foreground">{guide.purpose}</p></div>
        <div className="min-w-0"><h3 className="text-xs font-semibold text-primary">Key controls</h3><ul className="mt-2 space-y-2 text-sm leading-relaxed text-foreground">{guide.do.map((item) => <li key={item} className="border-l border-brass/50 pl-3">{item}</li>)}</ul></div>
        <div className="min-w-0"><h3 className="flex items-center gap-2 text-xs font-semibold text-primary"><ShieldCheck size={14} aria-hidden /> Safeguards</h3><ul className="mt-2 space-y-2 text-sm leading-relaxed text-foreground">{guide.handsOff.map((item) => <li key={item}>{item}</li>)}</ul></div>
      </div>
      <p className="mt-4 border-t border-brass/30 pt-3 text-xs leading-relaxed text-muted-foreground">Orientation changes the visible desk only. It does not adjust inputs, answer questions, clear gates or mark a custom desk as worked. The privacy mask, inactivity protection and panic controls remain active.</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <label className="min-w-0 flex-1 basis-56"><span className="sr-only">Orientation desk index</span><select data-shroud-nav aria-label="Orientation desk index" value={deskId} onChange={(e) => onDesk(e.target.value)} className="h-10 w-full max-w-full rounded-md border border-input bg-background px-2 text-sm text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{divisions.map((division) => <optgroup key={division.id} label={division.label}>{desks.filter((d) => d.division === division.id).map((d) => <option key={d.id} value={d.id}>{String(desks.indexOf(d) + 1).padStart(2, "0")} · {d.label}</option>)}</optgroup>)}</select></label>
        <Button variant="outline" size="icon" disabled={!previous} onClick={() => previous && onDesk(previous.id)} aria-label="Previous orientation desk" title="Previous desk"><ArrowLeft aria-hidden /></Button>
        <Button variant="outline" size="icon" disabled={!next} onClick={() => next && onDesk(next.id)} aria-label="Next orientation desk" title="Next desk"><ArrowRight aria-hidden /></Button>
        <Button onClick={onWork}>{next ? "Work this desk" : "Finish orientation"}<Check aria-hidden /></Button>
      </div>
    </section>
  );
}