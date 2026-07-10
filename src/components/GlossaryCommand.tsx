import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { GLOSSARY } from "@/content/glossary";

/**
 * Scoped ⌘K palette for the Glossary page only.
 * Jumps to a term and triggers the same highlight animation as hash-linking.
 */
export default function GlossaryCommand({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const jump = (id: string) => {
    onOpenChange(false);
    setQuery("");
    navigate(`/glossary#${id}`, { replace: false });
    setTimeout(() => {
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
      el?.classList.remove("glossary-highlight");
      // reflow so the animation replays if the user jumps to the same term twice
      void el?.offsetWidth;
      el?.classList.add("glossary-highlight");
    }, 60);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search glossary terms…"
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        <CommandEmpty>No terms match.</CommandEmpty>
        <CommandGroup heading="Doctrine terms">
          {GLOSSARY.map((g) => (
            <CommandItem
              key={g.id}
              value={`${g.term} ${g.short} ${g.source}`}
              onSelect={() => jump(g.id)}
              className="flex flex-col items-start gap-1 py-3"
            >
              <span className="font-serif text-primary text-base leading-tight">
                {g.term}
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-accent">
                {g.source}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
