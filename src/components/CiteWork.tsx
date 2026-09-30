import { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Quote, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { AUTHOR_NAME, DOI, DOI_URL, SITE_URL, WORK_TITLE } from "@/lib/seo-entities";

const STYLES = ["APA", "Chicago", "Harvard", "Bluebook", "BibTeX"] as const;
type Style = (typeof STYLES)[number];

function format(style: Style, part: string | undefined, path: string) {
  const url = `${SITE_URL}${path}`;
  const t = WORK_TITLE;
  const p = part ? `"${part}." In ` : "";
  switch (style) {
    case "APA":
      return `Ndua, J. W. (2026). ${part ? `${part}. In ` : ""}${t}. Kenya Copyright Board Reg. No. RZ100967. ${DOI_URL}`;
    case "Chicago":
      return `Ndua, James Wesley. ${p}${t}. Nairobi, 2026. Kenya Copyright Board Reg. No. RZ100967. ${DOI_URL}.`;
    case "Harvard":
      return `Ndua, J.W. (2026) ${part ? `'${part}', in ` : ""}${t}. Registered with the Kenya Copyright Board, RZ100967. Available at: ${url} (Accessed: ${new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}).`;
    case "Bluebook":
      return `James Wesley Ndua, ${part ? `${part}, in ` : ""}${t.toUpperCase()} (2026), ${url}.`;
    case "BibTeX": {
      const key = `ndua2026${(part ?? "vinculum").toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 16)}`;
      return [
        `@book{${key},`,
        `  author    = {${AUTHOR_NAME}},`,
        `  title     = {${t}},`,
        part ? `  chapter   = {${part}},` : null,
        `  year      = {2026},`,
        `  address   = {Nairobi},`,
        `  doi       = {${DOI}},`,
        `  url       = {${url}},`,
        `  note      = {Kenya Copyright Board Reg. No. RZ100967}`,
        `}`,
      ].filter(Boolean).join("\n");
    }
  }
}

/** Discreet citation exporter: five standard formats, copied to the clipboard. Nothing is stored. */
export default function CiteWork({ part, path }: { part?: string; path: string }) {
  const [style, setStyle] = useState<Style>("APA");
  const [copied, setCopied] = useState(false);
  const text = format(style, part, path);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success(`${style} citation copied`);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Copy failed. Select the text and copy manually.");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="print:hidden">
          <Quote aria-hidden="true" /> Cite this work
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-[min(92vw,26rem)] bg-background border-brass/50 p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Citation</p>
        <div className="mt-3 flex flex-wrap gap-1.5" role="tablist" aria-label="Citation style">
          {STYLES.map((s) => (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={style === s}
              onClick={() => setStyle(s)}
              className={`px-2.5 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                style === s ? "bg-primary text-primary-foreground border-primary" : "border-brass/50 text-primary hover:border-accent"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <pre className="mt-3 whitespace-pre-wrap break-words border border-border bg-navy-tint/40 p-3 text-xs leading-relaxed text-foreground/90 font-sans">
          {text}
        </pre>
        <Button type="button" size="sm" variant="ghost" onClick={copy} className="mt-3 border border-brass/40">
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />} Copy {style}
        </Button>
      </PopoverContent>
    </Popover>
  );
}
