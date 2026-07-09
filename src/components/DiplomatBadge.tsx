import type { ReactNode } from "react";

type Variant =
  | "doctrine-core"
  | "field-notes"
  | "briefing-ready"
  | "case-study"
  | "foundation"
  | "handbook"
  | "methodology";

const STYLES: Record<Variant, string> = {
  "doctrine-core": "bg-accent text-accent-foreground border-brass/60",
  "field-notes": "bg-transparent text-primary border-primary/60",
  "briefing-ready": "bg-brass text-foreground border-brass",
  "case-study": "bg-primary/10 text-primary border-primary/30",
  foundation: "bg-accent/10 text-accent border-accent/40",
  handbook: "bg-gold-tint text-primary border-brass/40",
  methodology: "bg-navy-tint text-primary border-brass/40",
};

export default function DiplomatBadge({
  variant = "doctrine-core",
  children,
  className = "",
}: {
  variant?: Variant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-[3px] border text-[10px] font-semibold uppercase tracking-[0.22em] transition-transform duration-200 hover:-translate-y-0.5 ${STYLES[variant]} ${className}`}
    >
      <span className="w-1 h-1 rounded-full bg-current opacity-70" aria-hidden />
      {children}
    </span>
  );
}
