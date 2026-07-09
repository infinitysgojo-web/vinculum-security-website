import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GLOSSARY_MAP } from "@/content/glossary";

export default function Cite({ term, children }: { term: string; children?: ReactNode }) {
  const entry = GLOSSARY_MAP[term];
  if (!entry) return <>{children ?? term}</>;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="cite-term font-medium"
          aria-label={`Definition: ${entry.term}`}
        >
          {children ?? entry.term}
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" className="w-80 bg-background border-brass/50 shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.35)]">
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
          {entry.source}
        </p>
        <p className="mt-2 font-serif text-primary text-lg leading-tight">{entry.term}</p>
        <hr className="gold-rule gold-rule-short my-3" />
        <p className="text-sm text-foreground/85 leading-relaxed">{entry.short}</p>
        <blockquote className="mt-3 pl-3 border-l-2 border-brass text-xs italic text-foreground/70 leading-relaxed">
          {entry.quote}
        </blockquote>
        <Link
          to={`/glossary#${entry.id}`}
          className="mt-3 inline-block text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
        >
          Open in glossary →
        </Link>
      </PopoverContent>
    </Popover>
  );
}
