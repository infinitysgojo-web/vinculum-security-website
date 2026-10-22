import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { searchCommands, type CommandItem, type PaletteAction, type PaletteDesk } from "./commandIndex";

/**
 * Diplomatic Command Palette (Ctrl/Cmd + K or the magnifying glass). Jump to a desk by
 * number or title, list desks by subject (decay, arbitration, escrow, ICSID, VCLT…), or run
 * a dashboard workflow (seal, wire, export, diff, branch, mask, panic). Arrow keys move,
 * Enter runs, Escape closes. The keyboard binding itself lives in useSovereignHotkeys.
 */
export default function CommandPalette({
  open,
  onOpenChange,
  desks,
  onDesk,
  onAction,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  desks: ReadonlyArray<PaletteDesk>;
  onDesk: (id: string) => void;
  onAction: (a: PaletteAction) => void;
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const list = useRef<HTMLUListElement>(null);
  const items = useMemo(() => searchCommands(q, desks), [q, desks]);
  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
    }
  }, [open]);
  useEffect(() => setI(0), [q]);
  useEffect(() => {
    list.current?.querySelector<HTMLElement>(`[data-index="${i}"]`)?.scrollIntoView({ block: "nearest" });
  }, [i]);

  const run = (it: CommandItem | undefined) => {
    if (!it) return;
    onOpenChange(false);
    if (it.kind === "desk") onDesk(it.id);
    else onAction(it.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden rounded-none p-0" data-testid="command-palette">
        <DialogHeader className="sr-only">
          <DialogTitle>Diplomatic command palette</DialogTitle>
          <DialogDescription>Jump to a desk, search a subject, or run a dashboard action.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-2 border-b border-brass/40 px-3">
          <Search size={14} className="shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setI((x) => Math.min(items.length - 1, x + 1));
              } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setI((x) => Math.max(0, x - 1));
              } else if (e.key === "Enter") {
                e.preventDefault();
                run(items[i]);
              }
            }}
            placeholder="Desk 01–18, a subject (escrow, icsid, vclt) or an action (seal, export)…"
            aria-label="Search desks, subjects and actions"
            aria-controls="vs-palette-list"
            aria-activedescendant={items[i] ? `vs-palette-${i}` : undefined}
            role="combobox"
            aria-expanded
            data-shroud-keep
            className="h-12 w-full min-w-0 bg-transparent text-base sm:text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>
        <ul ref={list} id="vs-palette-list" role="listbox" className="max-h-[min(60vh,24rem)] overflow-y-auto py-1">
          {items.length === 0 && <li className="px-4 py-6 text-center text-sm text-muted-foreground">No desk, subject or action matches.</li>}
          {items.map((it, k) => (
            <li
              key={`${it.kind}:${it.id}`}
              id={`vs-palette-${k}`}
              data-index={k}
              role="option"
              aria-selected={k === i}
              onMouseEnter={() => setI(k)}
              onClick={() => run(it)}
              className={`flex cursor-pointer items-baseline gap-3 px-4 py-2 text-sm ${k === i ? "bg-accent/15 text-accent" : "text-primary"}`}
            >
              <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                {it.kind === "desk" ? `Desk ${it.number}` : "Action"}
              </span>
              <span className="min-w-0">
                <span className="font-medium">{it.label}</span>
                <span className="ml-2 text-xs text-muted-foreground [overflow-wrap:anywhere]">{it.detail}</span>
              </span>
            </li>
          ))}
        </ul>
        <p className="border-t border-border px-4 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">↑ ↓ move · Enter open · Esc close</p>
      </DialogContent>
    </Dialog>
  );
}

const SHORTCUTS: [string, string][] = [
  ["Ctrl/Cmd + K", "Open the command palette"],
  ["[", "Previous desk"],
  ["]", "Next desk"],
  ["Alt + ← / Alt + →", "Previous / next desk"],
  ["?", "This shortcut reference"],
  ["Esc", "Close any modal, drawer, palette or popover; with none open, leave Focus view"],
  ["Ctrl/Cmd + S", "Save the mission state to this browser"],
  ["Ctrl + Shift + X, or Esc three times within 600 ms", "Panic purge (Chancellery Sentinel)"],
];

/** The Chancellery Keyboard Shortcut Reference sheet. */
export function ShortcutSheet({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-none" data-testid="shortcut-sheet">
        <DialogHeader>
          <DialogTitle className="font-serif text-primary">Chancellery keyboard shortcuts</DialogTitle>
          <DialogDescription>Navigation keys are ignored while you type in a field.</DialogDescription>
        </DialogHeader>
        <dl className="divide-y divide-border text-sm">
          {SHORTCUTS.map(([k, v]) => (
            <div key={k} className="flex items-baseline justify-between gap-4 py-2">
              <dt className="shrink-0 font-mono text-xs text-primary">{k}</dt>
              <dd className="text-right text-xs text-muted-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </DialogContent>
    </Dialog>
  );
}
