import React from "react";

export interface FormulaParameter {
  symbol: string;
  name: string;
  domain: string;
  description: string;
  threshold?: string;
}

export interface ScholarlyFormulaProps {
  title: string;
  expression: {
    lhs: React.ReactNode;
    rhs: React.ReactNode;
    condition?: string;
  };
  classification?: string;
  parameters: FormulaParameter[];
  statutoryInvariant?: string;
  className?: string;
}

/**
 * ScholarlyFormula
 * 
 * Formal academic mathematical typesetting for the Chancellery Academy.
 * Renders true division fraction bars, bracketed state vectors, and Greek
 * parameters with an accompanying statutory parameter glossary.
 */
export default function ScholarlyFormula({
  title,
  expression,
  classification,
  parameters,
  statutoryInvariant,
  className = "",
}: ScholarlyFormulaProps) {
  return (
    <div
      className={`my-6 rounded-sm border border-brass/40 bg-card/80 p-5 shadow-sm backdrop-blur-sm ${className}`}
      data-testid="scholarly-formula"
    >
      {/* Formula Masthead */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/50 pb-2.5">
        <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-brass">
          {title}
        </span>
        {classification && (
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground border border-border/60 px-2 py-0.5 rounded-sm">
            {classification}
          </span>
        )}
      </div>

      {/* Main Mathematical Display */}
      <div className="my-5 flex flex-wrap items-center justify-center gap-3 overflow-x-auto py-2 text-center">
        <div className="flex items-center gap-3 font-serif text-lg md:text-xl text-primary font-normal tracking-wide">
          <span className="italic">{expression.lhs}</span>
          <span className="text-brass font-sans">=</span>
          <div className="inline-flex items-center">{expression.rhs}</div>
          {expression.condition && (
            <span className="ml-2 font-mono text-xs text-muted-foreground">
              {expression.condition}
            </span>
          )}
        </div>
      </div>

      {/* Parameter Glossary */}
      {parameters.length > 0 && (
        <div className="mt-4 border-t border-border/40 pt-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted-foreground mb-2">
            Canonical Parameter Glossary
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {parameters.map((param, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 border border-border/30 bg-background/40 p-2 rounded-sm"
              >
                <span className="font-serif italic font-semibold text-brass shrink-0 min-w-[2.2rem]">
                  {param.symbol}
                </span>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-[11px] text-foreground">
                      {param.name}
                    </span>
                    <span className="font-mono text-[9px] text-muted-foreground shrink-0">
                      [{param.domain}]
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {param.description}
                  </p>
                  {param.threshold && (
                    <p className="font-mono text-[10px] text-accent pt-0.5">
                      Invariant: {param.threshold}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Statutory Invariant Footer */}
      {statutoryInvariant && (
        <div className="mt-3 border-t border-brass/20 pt-2 text-[10px] text-muted-foreground italic">
          <span className="font-semibold text-primary not-italic">Statutory Notice: </span>
          {statutoryInvariant}
        </div>
      )}
    </div>
  );
}

/**
 * MathFraction
 * Helper for rendering true scholarly division bars.
 */
export function MathFraction({
  numerator,
  denominator,
}: {
  numerator: React.ReactNode;
  denominator: React.ReactNode;
}) {
  return (
    <div className="inline-flex flex-col items-center align-middle px-1.5">
      <span className="border-b border-primary/70 pb-0.5 text-center text-sm md:text-base leading-tight">
        {numerator}
      </span>
      <span className="pt-0.5 text-center text-sm md:text-base leading-tight">
        {denominator}
      </span>
    </div>
  );
}

/**
 * MathVector
 * Helper for rendering bracketed column or row vectors.
 */
export function MathVector({ elements }: { elements: React.ReactNode[] }) {
  return (
    <span className="inline-flex items-center font-serif">
      <span className="text-xl font-light text-brass/80">[</span>
      <span className="inline-flex gap-2 px-1 text-sm md:text-base">
        {elements.map((el, idx) => (
          <React.Fragment key={idx}>
            {el}
            {idx < elements.length - 1 && <span className="text-muted-foreground">,</span>}
          </React.Fragment>
        ))}
      </span>
      <span className="text-xl font-light text-brass/80">]</span>
    </span>
  );
}
