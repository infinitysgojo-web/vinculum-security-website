import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Command as CommandPrimitive } from "cmdk";
import { Search } from "lucide-react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { COMMENTARY, INQUIRY_NUMBER } from "@/content/commentary";
import { CASES } from "@/content/cases";
import { GLOSSARY } from "@/content/glossary";

type Kind = "Inquiry" | "Case" | "Glossary";
type Entry = { key: string; kind: Kind; title: string; detail: string; haystack: string; to: string; anchor?: string };

/** The whole scholarly corpus, flattened once: every Commentary inquiry, every case, every glossary term. */
const INDEX: Entry[] = [
  ...COMMENTARY.flatMap((d) =>
    d.items.map((item) => {
      const n = INQUIRY_NUMBER[item.id];
      return {
        key: `q-${item.id}`,
        kind: "Inquiry" as const,
        title: item.q,
        detail: `Inquiry ${n} · Division ${d.numeral}, ${d.title}`,
        haystack: `${item.q} ${item.a.join(" ")}`.toLowerCase(),
        to: `/commentary#q-${item.id}`,
        anchor: `q-${item.id}`,
      };
    }),
  ),
  ...CASES.map((c) => ({
    key: `c-${c.slug}`,
    kind: "Case" as const,
    title: c.title,
    detail: `Section ${c.ref} · ${c.region} · ${c.pillar}`,
    haystack: `${c.title} ${c.shortTitle} ${c.summary} ${c.pattern} ${c.region} ${c.threats.join(" ")}`.toLowerCase(),
    to: `/cases/${c.slug}`,
  })),
  ...GLOSSARY.map((g) => ({
    key: `g-${g.id}`,
    kind: "Glossary" as const,
    title: g.term,
    detail: g.short,
    haystack: `${g.term} ${g.short} ${g.quote}`.toLowerCase(),
    to: `/glossary#${g.id}`,
    anchor: g.id,
  })),
];

const ORDER: Kind[] = ["Glossary", "Inquiry", "Case"];
const LIMIT = 8;

function search(query: string) {
  const q = query.trim().toLowerCase();
  const out: Record<Kind, Entry[]> = { Glossary: [], Inquiry: [], Case: [] };
  if (!q) {
    out.Case = INDEX.filter((e) => e.kind === "Case");
    return out;
  }
  const terms = q.split(/\s+/);
  const scored = INDEX.flatMap((e) => {
    if (!terms.every((t) => e.haystack.includes(t))) return [];
    const title = e.title.toLowerCase();
    // Exact phrase in the title ranks first, then every term in the title, then a phrase in the body.
    const score = (title.includes(q) ? 4 : 0) + (terms.every((t) => title.includes(t)) ? 2 : 0) + (e.haystack.includes(q) ? 1 : 0);
    return [{ e, score }];
  });
  scored.sort((a, b) => b.score - a.score);
  for (const { e } of scored) if (out[e.kind].length < LIMIT) out[e.kind].push(e);
  return out;
}

export function useQuickSearchHotkey(setOpen: (fn: (v: boolean) => boolean) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);
}

export default function QuickSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const groups = useMemo(() => search(query), [query]);
  const total = ORDER.reduce((n, k) => n + groups[k].length, 0);

  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  const go = (e: Entry) => {
    onOpenChange(false);
    navigate(e.to);
    // Pages read their hash on arrival; when already on the page, bring the entry into view directly.
    if (e.anchor) {
      window.setTimeout(() => {
        const el = document.getElementById(e.anchor!);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 260);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 max-w-2xl rounded-none border border-brass/50 bg-card gap-0 top-[12%] translate-y-0 data-[state=open]:slide-in-from-top-2">
        <DialogTitle className="sr-only">Lexical Quick-Finder</DialogTitle>
        <DialogDescription className="sr-only">
          Search the Commentary inquiries, the case studies and the glossary. Use the arrow keys to move and Enter to open.
        </DialogDescription>
        <CommandPrimitive shouldFilter={false} loop className="flex flex-col bg-card text-foreground">
          <div className="flex items-center gap-3 border-b border-brass/40 px-4">
            <Search className="h-4 w-4 shrink-0 text-brass" aria-hidden />
            <CommandPrimitive.Input
              value={query}
              onValueChange={setQuery}
              placeholder="Search inquiries, cases and terms, e.g. viable floor"
              className="h-12 w-full pr-8 bg-transparent text-sm outline-none placeholder:text-muted-foreground/70"
            />
          </div>
          <CommandPrimitive.List className="max-h-[60vh] overflow-y-auto overscroll-contain p-2">
            {total === 0 && (
              <CommandPrimitive.Empty className="py-10 text-center">
                <p className="font-serif text-primary">No entry matches.</p>
                <p className="text-xs text-muted-foreground mt-1">Try a broader term, such as bond, floor or succession.</p>
              </CommandPrimitive.Empty>
            )}
            {ORDER.map((k) =>
              groups[k].length ? (
                <CommandPrimitive.Group
                  key={k}
                  heading={k === "Inquiry" ? "Commentary" : k === "Case" ? "Case studies" : "Glossary"}
                  className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:pt-3 [&_[cmdk-group-heading]]:pb-1 [&_[cmdk-group-heading]]:text-[9px] [&_[cmdk-group-heading]]:uppercase [&_[cmdk-group-heading]]:tracking-[0.22em] [&_[cmdk-group-heading]]:text-accent"
                >
                  {groups[k].map((e) => (
                    <CommandPrimitive.Item
                      key={e.key}
                      value={e.key}
                      onSelect={() => go(e)}
                      className="cursor-pointer px-2 py-2 border-l-2 border-transparent data-[selected=true]:border-accent data-[selected=true]:bg-gold-tint/60"
                    >
                      <p className="font-serif text-[0.95rem] leading-snug text-primary">{e.title}</p>
                      <p className="text-[11px] leading-snug text-muted-foreground line-clamp-1">{e.detail}</p>
                    </CommandPrimitive.Item>
                  ))}
                </CommandPrimitive.Group>
              ) : null,
            )}
          </CommandPrimitive.List>
          <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[10px] text-muted-foreground">
            <span>↑ ↓ to move · Enter to open · Esc to close</span>
            <span>⌘K / Ctrl K</span>
          </div>
        </CommandPrimitive>
      </DialogContent>
    </Dialog>
  );
}
