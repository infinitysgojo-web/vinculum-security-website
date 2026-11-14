import { useEffect, useMemo, useRef, useState } from "react";
import { BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LEXICON, findLex } from "./lexiconData";

/**
 * Inline term with a pop-out definition. Opens instantly on hover (mouse), on tap
 * (touch) and on Enter or Space (keyboard); Escape or an outside tap closes it.
 * Working state is untouched.
 */
export function Lex({ term, children }: { term: string; children?: React.ReactNode }) {
  const e = findLex(term);
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const cancel = () => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => cancel, []);
  if (!e) return <>{children ?? term}</>;

  const hoverOpen = (ev: React.PointerEvent) => {
    if (ev.pointerType !== "mouse") return;
    cancel();
    setOpen(true);
  };
  const hoverClose = (ev: React.PointerEvent) => {
    if (ev.pointerType !== "mouse") return;
    cancel();
    timer.current = window.setTimeout(() => setOpen(false), 160);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          onPointerEnter={hoverOpen}
          onPointerLeave={hoverClose}
          // Hover has already opened the card; a click must not toggle it shut again.
          onClick={(ev) => {
            ev.preventDefault();
            setOpen(true);
          }}
          className="inline text-left [text-transform:inherit] underline decoration-dotted decoration-brass underline-offset-2 hover:text-accent"
        >
          {children ?? e.term}
        </button>
      </PopoverTrigger>
      <PopoverContent
        onPointerEnter={hoverOpen}
        onPointerLeave={hoverClose}
        onOpenAutoFocus={(ev) => ev.preventDefault()}
        className="w-72 max-w-[calc(100vw-2rem)] text-xs normal-case tracking-normal"
      >
        <p className="font-serif text-primary text-base">{e.term}</p>
        <p className="mt-2 text-foreground/85 leading-relaxed font-sans">{e.short}</p>
        <p className="mt-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{e.source}</p>
      </PopoverContent>
    </Popover>
  );
}

/** Searchable lexicon drawer opened from the dashboard header. */
export function LexiconDrawer() {
  const [q, setQ] = useState("");
  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? LEXICON.filter((e) => `${e.term} ${e.short}`.toLowerCase().includes(s)) : LEXICON;
  }, [q]);
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          title="Lexicon"
          aria-label="Open the working lexicon"
          className="inline-flex h-8 min-w-8 shrink-0 items-center justify-center gap-1.5 border border-transparent px-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-border hover:text-accent transition-colors"
        >
          <BookOpen size={14} /> <span className="hidden 2xl:inline">Lexicon</span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="font-serif text-primary">Working lexicon</SheetTitle>
        </SheetHeader>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search a term"
          aria-label="Search the lexicon"
          className="mt-4 w-full border border-input bg-background px-3 py-2.5 text-sm"
        />
        <ul className="mt-4 space-y-4">
          {list.map((e) => (
            <li key={e.id} className="border-b border-brass/30 pb-3 min-w-0">
              <p className="font-serif text-primary">{e.term}</p>
              <p className="mt-1 text-xs text-foreground/85 leading-relaxed [overflow-wrap:anywhere]">{e.short}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{e.source}</p>
            </li>
          ))}
          {!list.length && <li className="text-xs text-muted-foreground">No term matches.</li>}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
