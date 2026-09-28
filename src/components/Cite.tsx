import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { GLOSSARY_MAP } from "@/content/glossary";
import { AUTHOR_NAME, SITE_URL, WORK_TITLE } from "@/lib/seo-entities";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

export default function Cite({ term, children }: { term: string; children?: ReactNode }) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const entry = GLOSSARY_MAP[term];
  
  if (!entry) return <>{children ?? term}</>;

  const copyCitation = () => {
    const citation = `${AUTHOR_NAME} (2026). "${entry.term}." ${WORK_TITLE}. ${entry.source}. ${SITE_URL}/glossary#${entry.id}`;
    navigator.clipboard.writeText(citation).then(() => {
      setCopied(true);
      toast({
        title: "Citation Copied",
        description: "Canonical citation for this term is ready to paste.",
      });
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
      <PopoverContent side="top" className="w-80 bg-background border-brass/50 shadow-[0_20px_50px_-20px_hsl(var(--primary)/0.35)] p-5">
        <div className="flex justify-between items-start gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
              {entry.source}
            </p>
            <p className="mt-2 font-serif text-primary text-lg leading-tight">{entry.term}</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={copyCitation}
            className="size-8 shrink-0 border border-brass/20 text-foreground/50"
            title="Export Citation"
            aria-label={`Copy canonical citation for ${entry.term}`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </Button>
        </div>
        
        <hr className="gold-rule gold-rule-short my-3" />
        <p className="text-sm text-foreground/85 leading-relaxed">{entry.short}</p>
        <blockquote className="mt-3 pl-3 border-l-2 border-brass text-xs italic text-foreground/70 leading-relaxed">
          {entry.quote}
        </blockquote>
        
        <div className="mt-4 flex items-center justify-between">
          <Link
            to={`/glossary#${entry.id}`}
            className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
          >
            Open in glossary →
          </Link>
          <span className="text-[8px] uppercase tracking-widest text-foreground/30 font-bold">
            {entry.category}
          </span>
        </div>
      </PopoverContent>
    </Popover>
  );
}
