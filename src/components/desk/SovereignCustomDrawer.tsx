import { useState, type ReactNode } from "react";
import { ChevronDown, ChevronUp, Feather } from "lucide-react";

/**
 * The Sovereign Inscription Drawer: one austere, collapsible container for custom mode
 * inputs, identical on every desk.
 */
export default function SovereignCustomDrawer({
  title,
  eyebrow = "Sovereign Inscription",
  badge = "Custom Mode",
  count = 0,
  description,
  defaultOpen = false,
  children,
}: {
  title: string;
  eyebrow?: string;
  badge?: string;
  /** Number of inscriptions this desk holds; shown on the closed drawer. */
  count?: number;
  description?: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="mb-6 w-full min-w-0 border border-brass/50 bg-navy-tint/30 print:hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full min-h-11 items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-brass/5"
        aria-expanded={open}
      >
        <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
          <div className="flex min-w-0 flex-col">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.2em] text-accent">
              <Feather size={11} aria-hidden /> {eyebrow}
            </span>
            <span className="mt-0.5 font-serif text-base font-medium text-primary">{title}</span>
          </div>
          {badge && (
            <span className="border border-accent/40 bg-accent/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-accent">
              {badge}
              {count > 0 ? ` · ${count} inscribed` : ""}
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
          <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] sm:inline">
            {open ? "Collapse tray" : "Inscribe custom parameters"}
          </span>
          {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
        </div>
      </button>
      {open && (
        <div className="space-y-4 border-t border-brass/30 bg-background/50 p-4 sm:p-6">
          {description && (
            <p className="border-l-2 border-accent/50 pl-3 text-xs italic leading-relaxed text-muted-foreground">{description}</p>
          )}
          {children}
        </div>
      )}
    </div>
  );
}
