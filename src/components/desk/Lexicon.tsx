import { useMemo, useState } from "react";
import { BookOpen } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LEXICON, findLex } from "./lexicon";

/** Inline term with a pop-out definition. Opens in place; working state is untouched. */
export function Lex({ term, children }: { term: string; children?: React.ReactNode }) {
  const e = findLex(term);
  if (!e) return <>{children ?? term}</>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="underline decoration-dotted decoration-brass underline-offset-2 hover:text-accent">
          {children ?? e.term}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-72 text-xs">
        <p className="font-serif text-primary text-base">{e.term}</p>
        <p className="mt-2 text-foreground/85 leading-relaxed">{e.short}</p>
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
        <button type="button" title="Lexicon" className="inline-flex items-center gap-1.5 text-primary hover:text-accent">
          <BookOpen size={14} /> <span className="hidden sm:inline">Lexicon</span>
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
          className="mt-4 w-full border border-input bg-background px-3 py-2.5 text-sm"
        />
        <ul className="mt-4 space-y-4">
          {list.map((e) => (
            <li key={e.id} className="border-b border-brass/30 pb-3">
              <p className="font-serif text-primary">{e.term}</p>
              <p className="mt-1 text-xs text-foreground/85 leading-relaxed">{e.short}</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">{e.source}</p>
            </li>
          ))}
          {!list.length && <li className="text-xs text-muted-foreground">No term matches.</li>}
        </ul>
      </SheetContent>
    </Sheet>
  );
}
