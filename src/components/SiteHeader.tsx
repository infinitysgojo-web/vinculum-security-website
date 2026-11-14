import { useState, useEffect, useCallback } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Search } from "lucide-react";
import Logo from "@/components/Logo";
import QuickSearch, { useQuickSearchHotkey } from "@/components/QuickSearch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Item = { to: string; label: string; note: string };
type Group = { label: string; items: Item[] };

/** Secondary links grouped into three chancellery registers, so the header holds on 13-inch displays. */
const GROUPS: Group[] = [
  {
    label: "Doctrine",
    items: [
      { to: "/foundations", label: "Theoretical Foundations", note: "Lineage and first principles" },
      { to: "/methodology", label: "Methodology", note: "Scoring and the 3.0 viable floor" },
      { to: "/doctrine", label: "The Doctrine", note: "The canonical text" },
    ],
  },
  {
    label: "Practice",
    items: [
      { to: "/practice", label: "Field Handbook", note: "What a Vinculum diplomat does" },
      { to: "/the-vinculum-dashboard", label: "The Vinculum Dashboard", note: "Eighteen desks · operational overview" },
      { to: "/cases", label: "Case Studies", note: "Eight documented processes" },
      { to: "/dispatches", label: "Field Dispatches", note: "Notes from the field" },
    ],
  },
  {
    label: "Reference",
    items: [
      { to: "/commentary", label: "Doctrinal Commentary", note: "Answered inquiries" },
      { to: "/glossary", label: "Doctrine Glossary", note: "Terms of art" },
      { to: "/about", label: "About the Author", note: "The author and the work" },
    ],
  },
];

const triggerBase =
  "inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.12em] whitespace-nowrap pb-1 border-b-2 outline-none transition-colors focus-visible:text-accent";

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [finder, setFinder] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  const toggleFinder = useCallback((fn: (v: boolean) => boolean) => setFinder(fn), []);
  useQuickSearchHotkey(toggleFinder);

  const inGroup = (g: Group) => g.items.some((i) => pathname === i.to || pathname.startsWith(`${i.to}/`));

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-2 border-primary print:hidden">
      <div className="container flex items-center justify-between h-16 gap-4">
        <Link to="/" className="flex items-center gap-3 group shrink-0" aria-label="Vinculum Security, Home">
          <Logo size={26} />
          <span className="wordmark text-xl md:text-2xl leading-none whitespace-nowrap group-hover:text-accent transition-colors">
            Vinculum Security
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-x-6 ml-auto" aria-label="Primary">
          {GROUPS.map((g) => {
            const active = inGroup(g);
            return (
              <DropdownMenu key={g.label} modal={false}>
                <DropdownMenuTrigger
                  className={`${triggerBase} ${active ? "border-accent text-accent" : "border-transparent text-primary hover:text-accent hover:border-accent/60"}`}
                >
                  {g.label}
                  <ChevronDown className="h-3 w-3 opacity-70" aria-hidden />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" sideOffset={10} className="min-w-[15rem] rounded-none border border-brass/50 bg-card p-1">
                  {g.items.map((i) => (
                    <DropdownMenuItem key={i.to} asChild className="rounded-none cursor-pointer focus:bg-gold-tint/70">
                      <NavLink
                        to={i.to}
                        className={({ isActive }) => `flex w-full flex-col !items-start text-left gap-0 px-3 py-2 border-l-2 ${isActive ? "border-accent" : "border-transparent"}`}
                      >
                        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">{i.label}</span>
                        <span className="text-[11px] text-muted-foreground">{i.note}</span>
                      </NavLink>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            );
          })}

          <button
            type="button"
            onClick={() => setFinder(true)}
            className="inline-flex items-center gap-2 border border-border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-accent hover:border-accent/60 transition-colors"
            aria-label="Open the Lexical Quick-Finder (Command K or Control K)"
          >
            <Search className="h-3.5 w-3.5" aria-hidden />
            <span className="hidden xl:inline">Search</span>
            <kbd className="font-mono text-[10px] text-muted-foreground/80">⌘K</kbd>
          </button>

        </nav>

        <div className="lg:hidden flex items-center gap-1 -mr-2">
          <button type="button" className="p-2 text-primary" aria-label="Search" onClick={() => setFinder(true)}>
            <Search size={20} />
          </button>
          <button
            type="button"
            className="p-2 text-primary"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brass/40 bg-background max-h-[calc(100vh-4rem)] overflow-y-auto">
          <nav className="container flex flex-col py-2" aria-label="Mobile">
            {GROUPS.map((g) => (
              <div key={g.label} className="py-2">
                <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground pb-1">{g.label}</p>
                {g.items.map((n) => (
                  <NavLink
                    key={n.to}
                    to={n.to}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `block py-2.5 text-xs uppercase tracking-[0.18em] font-semibold border-b border-brass/25 ${isActive ? "text-accent" : "text-primary"}`
                    }
                  >
                    {n.label}
                  </NavLink>
                ))}
              </div>
            ))}
          </nav>
        </div>
      )}

      <QuickSearch open={finder} onOpenChange={setFinder} />
    </header>
  );
}
