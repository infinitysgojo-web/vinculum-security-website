import { useRef, useState, type ReactNode } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { doctrineById, segmentDoctrines, type Doctrine } from "@/content/doctrines";

/**
 * A statutory or treaty term with a dotted underline. Hover on desktop, tap on touch:
 * a small card gives the formal term, its plain meaning and the instrument it rests on.
 */
export default function DoctrinalTooltip({ doctrine, children }: { doctrine: Doctrine; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<number>();
  const hover = (v: boolean) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(v), v ? 120 : 160);
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onMouseEnter={() => hover(true)}
          onMouseLeave={() => hover(false)}
          className="inline cursor-help border-0 bg-transparent p-0 text-inherit underline decoration-dotted decoration-brass underline-offset-2 hover:text-accent"
          aria-label={`${doctrine.term}: doctrinal note`}
          data-doctrine={doctrine.id}
        >
          {children ?? doctrine.term}
        </button>
      </PopoverTrigger>
      <PopoverContent
        side="top"
        className="w-[min(20rem,calc(100vw-2rem))] rounded-none border-brass/60 p-3 text-xs"
        onMouseEnter={() => hover(true)}
        onMouseLeave={() => hover(false)}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <p className="font-serif text-sm italic text-primary">{doctrine.term}</p>
        <p className="mt-1 text-foreground/90">{doctrine.meaning}</p>
        <p className="mt-2 border-t border-border pt-1.5 text-[10px] text-muted-foreground">{doctrine.citation}</p>
      </PopoverContent>
    </Popover>
  );
}

/** Render text with every recognised doctrine underlined and annotated. */
export function DoctrineText({ text }: { text: string }) {
  return (
    <>
      {segmentDoctrines(text).map((s, i) => (s.doctrine ? <DoctrinalTooltip key={i} doctrine={s.doctrine}>{s.text}</DoctrinalTooltip> : <span key={i}>{s.text}</span>))}
    </>
  );
}

/** A compact strip of the doctrines a desk relies on. */
export function DoctrineAnchors({ ids, title = "Doctrinal anchors" }: { ids: string[]; title?: string }) {
  const list = ids.map(doctrineById).filter((d): d is Doctrine => !!d);
  if (!list.length) return null;
  return (
    <p className="text-[11px] leading-relaxed text-muted-foreground" data-testid="doctrine-anchors">
      <span className="mr-1.5 text-[9px] uppercase tracking-[0.18em] font-semibold text-primary/70">{title}</span>
      {list.map((d, i) => (
        <span key={d.id}>
          {i > 0 && <span aria-hidden> · </span>}
          <DoctrinalTooltip doctrine={d} />
        </span>
      ))}
    </p>
  );
}
