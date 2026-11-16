import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { FormulaProof as Proof } from "./formulaProofs";

/**
 * The [ƒx] chip beside a computed value. Opens a restrained popover with the formal
 * equation, the live numbers substituted, the step-by-step arithmetic and the citation.
 */
export default function FormulaProof({ proof, className = "" }: { proof: Proof; className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon"
          type="button"
          className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-brass/60 px-1 align-middle font-mono text-xs italic leading-none text-primary hover:border-accent hover:text-accent ${className}`}
          aria-label={`Show the proof: ${proof.title}`}
          title={`Proof: ${proof.title}`}
          data-testid={`proof-${proof.id}`}
        >
          ƒx
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="max-h-[min(36rem,80dvh)] w-[min(26rem,calc(100vw-2rem))] overflow-y-auto rounded-sm border-brass/60 p-4 text-xs leading-relaxed" data-testid="formula-proof">
        <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">{proof.title}</p>
        <output className="mt-2 block border-l-2 border-accent pl-3 font-mono text-sm font-semibold tabular-nums text-accent [overflow-wrap:anywhere]" aria-live="polite">{proof.result}</output>
        <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">1 · Equation</p>
        <p className="font-serif text-base text-primary [overflow-wrap:anywhere]">{proof.equation}</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">2 · Substituted from this mission</p>
        <p className="font-mono text-[11px] text-foreground/90 [overflow-wrap:anywhere]">{proof.substitution}</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">3 · Arithmetic</p>
        <ol className="list-decimal space-y-2 pl-4 font-mono text-[11px] tabular-nums text-foreground/90">
          {proof.steps.map((s, i) => (
            <li key={i} className="border-b border-border pb-2 pl-1 [overflow-wrap:anywhere]">{s}</li>
          ))}
        </ol>
        <p className="mt-2 border-t border-border pt-2 font-mono text-[11px] font-semibold text-accent">= {proof.result}</p>
        <p className="mt-2 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">4 · Source</p>
        <p className="text-[11px] text-muted-foreground [overflow-wrap:anywhere]">{proof.citation}</p>
      </PopoverContent>
    </Popover>
  );
}
