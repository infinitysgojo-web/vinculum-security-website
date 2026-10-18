import { useState } from "react";
import { BookMarked, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { AUTHOR_NAME, DOI, DOI_URL, SITE_URL, WORK_TITLE } from "@/lib/seo-entities";
import type { CaseStudy } from "@/content/cases";

type Format = "BibTeX" | "APA 7th" | "Chicago 17th";

/** Citations for one case study, each carrying the canonical case URI and the work's DOI. */
export function caseCitations(c: CaseStudy): Record<Format, string> {
  const uri = `${SITE_URL}/cases/${c.slug}`;
  const key = `ndua2026${c.slug.replace(/[^a-z0-9]+/g, "")}`;
  return {
    BibTeX: [
      `@incollection{${key},`,
      `  author    = {${AUTHOR_NAME}},`,
      `  title     = {${c.title}},`,
      `  booktitle = {${WORK_TITLE}},`,
      `  chapter   = {Section ${c.ref}, Applied Case Engagement},`,
      `  year      = {2026},`,
      `  address   = {Nairobi},`,
      `  doi       = {${DOI}},`,
      `  url       = {${uri}},`,
      `  note      = {Protected by Statutory Copyright Law}`,
      `}`,
    ].join("\n"),
    "APA 7th": `Ndua, J. W. (2026). ${c.title} (Section ${c.ref}). In ${WORK_TITLE}. ${DOI_URL}. ${uri}`,
    "Chicago 17th": `Ndua, James Wesley. "${c.title}." Section ${c.ref} in ${WORK_TITLE}. Nairobi, 2026. ${DOI_URL}. ${uri}.`,
  };
}

const FORMATS: Format[] = ["BibTeX", "APA 7th", "Chicago 17th"];

export default function CitationDrawer({ c }: { c: CaseStudy }) {
  const cites = caseCitations(c);
  const [copied, setCopied] = useState<Format | null>(null);

  const copy = async (f: Format) => {
    try {
      await navigator.clipboard.writeText(cites[f]);
      setCopied(f);
      toast.success(`${f} citation copied`);
      window.setTimeout(() => setCopied(null), 1800);
    } catch {
      toast.error("Copy failed. Select the text and copy it manually.");
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 border border-brass/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary hover:text-accent hover:border-accent transition-colors"
        >
          <BookMarked className="h-3.5 w-3.5" aria-hidden />
          Citation drawer
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto rounded-none border-l border-brass/50 bg-card">
        <SheetHeader className="text-left">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Section {c.ref} · Citation</p>
          <SheetTitle className="font-serif text-primary text-2xl font-normal leading-tight">{c.title}</SheetTitle>
          <SheetDescription className="text-[0.82rem]">
            Canonical URI <span className="font-mono text-[0.72rem] text-primary [overflow-wrap:anywhere]">{SITE_URL}/cases/{c.slug}</span>
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          {FORMATS.map((f) => (
            <section key={f} aria-label={`${f} citation`}>
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <p className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary">{f}</p>
                <button
                  type="button"
                  onClick={() => copy(f)}
                  className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-accent hover:underline"
                  aria-label={`Copy ${f} citation`}
                >
                  {copied === f ? <Check className="h-3 w-3" aria-hidden /> : <Copy className="h-3 w-3" aria-hidden />}
                  {copied === f ? "Copied" : "Copy"}
                </button>
              </div>
              <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] border border-border bg-background p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
                {cites[f]}
              </pre>
            </section>
          ))}
        </div>
        <p className="mt-6 text-[11px] leading-relaxed text-muted-foreground">
          Made available for scholarly reading under CC BY-NC-ND 4.0. All statutory rights reserved.
        </p>
      </SheetContent>
    </Sheet>
  );
}
