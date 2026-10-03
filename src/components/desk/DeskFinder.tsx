import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

type Desk = { id: string; division: string; label: string; title: string };
type Division = { id: string; label: string };

/** Ctrl/Cmd+K quick switcher: jump to any desk without walking the divisions. */
export default function DeskFinder({
  desks,
  divisions,
  onPick,
}: {
  desks: readonly Desk[];
  divisions: readonly Division[];
  onPick: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-primary hover:text-accent transition-colors"
        aria-label="Find a desk"
        title="Find a desk (Ctrl+K)"
      >
        <Search size={13} />
        <span className="hidden sm:inline">Find desk</span>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a desk name, e.g. readiness, clause, shock…" />
        <CommandList>
          <CommandEmpty>No desk matches.</CommandEmpty>
          {divisions.map((dv) => (
            <CommandGroup key={dv.id} heading={dv.label}>
              {desks
                .filter((d) => d.division === dv.id)
                .map((d) => (
                  <CommandItem
                    key={d.id}
                    value={`${d.label} ${d.title}`}
                    onSelect={() => {
                      onPick(d.id);
                      setOpen(false);
                    }}
                  >
                    <span className="font-medium">{d.label}</span>
                    <span className="ml-2 text-xs text-muted-foreground truncate">{d.title}</span>
                  </CommandItem>
                ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
