import React from "react";

export interface FormulaParameter {
  /** Typeset symbol: plain text or a node built from the Math helpers below. */
  symbol: React.ReactNode;
  name: string;
  domain: React.ReactNode;
  description: React.ReactNode;
  threshold?: React.ReactNode;
}

export interface ScholarlyFormulaProps {
  title: string;
  expression: {
    lhs: React.ReactNode;
    rhs: React.ReactNode;
    /** Typeset qualifying condition, shown beside the expression. */
    condition?: React.ReactNode;
  };
  classification?: string;
  parameters: FormulaParameter[];
  statutoryInvariant?: React.ReactNode;
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
      <div className="my-5 overflow-x-auto py-2 text-center" data-testid="scholarly-formula-display">
        <div className="inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-2 font-serif text-lg md:text-xl text-primary font-normal tracking-wide">
          <span className="inline-flex items-center">{expression.lhs}</span>
          <span className="text-brass">=</span>
          <span className="inline-flex flex-wrap items-center justify-center">{expression.rhs}</span>
          {expression.condition && (
            <span className="ml-1 inline-flex items-center text-sm md:text-base text-muted-foreground">
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
                <span className="font-serif font-semibold text-brass shrink-0 min-w-[2.6rem] text-sm">
                  {param.symbol}
                </span>
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-medium text-[11px] text-foreground">
                      {param.name}
                    </span>
                    <span className="font-serif text-[10px] text-muted-foreground shrink-0">
                      {param.domain}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-snug">
                    {param.description}
                  </p>
                  {param.threshold && (
                    <p className="font-serif text-[11px] text-accent pt-0.5">
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
    <span className="inline-flex flex-col items-center align-middle px-1 text-[0.85em]" data-math="frac">
      <span className="border-b border-current pb-0.5 text-center leading-tight">
        {numerator}
      </span>
      <span className="pt-0.5 text-center leading-tight">
        {denominator}
      </span>
    </span>
  );
}

/**
 * MathVector
 * Helper for rendering bracketed column or row vectors.
 */
export function MathVector({ elements }: { elements: React.ReactNode[] }) {
  return (
    <span className="inline-flex items-center font-serif" data-math="vector">
      <span className="text-[1.3em] font-light text-brass">[</span>
      <span className="inline-flex gap-1.5 px-1 text-[0.9em]">
        {elements.map((el, idx) => (
          <React.Fragment key={idx}>
            {el}
            {idx < elements.length - 1 && <span className="text-muted-foreground">,</span>}
          </React.Fragment>
        ))}
      </span>
      <span className="text-[1.3em] font-light text-brass">]</span>
    </span>
  );
}

/**
 * MathRadical
 * A square root with a true vinculum over its radicand.
 */
export function MathRadical({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-stretch align-middle" data-math="sqrt">
      <span className="pr-px text-[1.15em] leading-none text-primary" aria-hidden>√</span>
      <span className="border-t border-current px-0.5 pt-0.5 leading-tight">{children}</span>
    </span>
  );
}

/**
 * MathBigOperator
 * A large summation or product sign with stacked lower and upper limits.
 */
export function MathBigOperator({ symbol, lower, upper }: { symbol: "∑" | "∏"; lower?: React.ReactNode; upper?: React.ReactNode }) {
  return (
    <span className="inline-flex flex-col items-center align-middle px-0.5 leading-none" data-math="bigop">
      <span className="text-[0.6em] leading-none">{upper ?? "\u00a0"}</span>
      <span className="text-[1.5em] leading-none">{symbol}</span>
      <span className="text-[0.6em] leading-none">{lower ?? "\u00a0"}</span>
    </span>
  );
}

/**
 * MathCases
 * A piecewise definition: a tall left brace and one row per case.
 */
export function MathCases({ rows }: { rows: { value: React.ReactNode; when: React.ReactNode }[] }) {
  return (
    <span className="inline-flex items-stretch align-middle" data-math="cases">
      <span className="mr-1.5 inline-flex items-center font-light text-brass" aria-hidden>
        <span className="inline-block text-[1.4em] leading-none" style={{ transform: `scaleY(${Math.max(1, rows.length) * 1.05})` }}>{"{"}</span>
      </span>
      <span className="inline-grid grid-cols-[auto_auto] gap-x-4 gap-y-1 text-left text-[0.9em]">
        {rows.map((r, i) => (
          <React.Fragment key={i}>
            <span className="inline-flex items-center">{r.value}</span>
            <span className="inline-flex items-center text-muted-foreground">{r.when}</span>
          </React.Fragment>
        ))}
      </span>
    </span>
  );
}
