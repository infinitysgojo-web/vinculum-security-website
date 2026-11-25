import React from "react";
import ScholarlyFormula, { MathBigOperator, MathCases, MathFraction, MathRadical, MathVector } from "./ScholarlyFormula";
import type { AcademyFormula } from "./academyTypes";

/**
 * Academy mathematics.
 *
 * Curriculum text stores every formula in a small, closed notation and this module
 * typesets it with the ScholarlyFormula helpers: true fraction bars, radicals with a
 * vinculum, stacked summation limits, bracketed vectors, Greek letters and real
 * sub- and superscripts. The notation never reaches the reader as source text:
 * display formulas go through AcademyFormulaBlock, and prose carries inline
 * mathematics between \( and \) through MathText. parseMath reports any command it
 * does not know, and the Academy test suite requires zero errors across the curriculum.
 *
 * Notation: letters are italic identifiers; digits and punctuation are upright;
 * x_{...} and x^{...} attach sub- and superscripts; \frac{a}{b}; \sqrt{x};
 * \sum_{lo}^{hi} and \prod_{lo}^{hi}; \vec{a}{b}{c}{d}; \cases{value}{condition}...;
 * \text{...} for upright words; \min, \max, \ln, \round, \exp, \op{name} for upright
 * function names; Greek by name (\lambda, \mu, \Phi ...); and the symbols listed in SYMBOLS.
 */

export type MathNode =
  | { k: "id"; s: string }
  | { k: "num"; s: string }
  | { k: "op"; s: string }
  | { k: "punct"; s: string }
  | { k: "space"; s: string }
  | { k: "fn"; s: string }
  | { k: "rm"; s: string }
  | { k: "grp"; c: MathNode[] }
  | { k: "script"; base: MathNode; sub?: MathNode[]; sup?: MathNode[] }
  | { k: "frac"; n: MathNode[]; d: MathNode[] }
  | { k: "sqrt"; c: MathNode[] }
  | { k: "big"; sym: "∑" | "∏"; lo?: MathNode[]; hi?: MathNode[] }
  | { k: "vec"; els: MathNode[][] }
  | { k: "cases"; rows: { v: MathNode[]; w: MathNode[] }[] };

const GREEK: Record<string, string> = {
  alpha: "α", beta: "β", gamma: "γ", delta: "δ", epsilon: "ε", zeta: "ζ", eta: "η", theta: "θ", iota: "ι",
  kappa: "κ", lambda: "λ", mu: "μ", nu: "ν", xi: "ξ", pi: "π", rho: "ρ", sigma: "σ", tau: "τ", phi: "φ",
  varphi: "ϕ", chi: "χ", psi: "ψ", omega: "ω",
  Gamma: "Γ", Delta: "Δ", Theta: "Θ", Lambda: "Λ", Sigma: "Σ", Phi: "Φ", Psi: "Ψ", Omega: "Ω",
};

/** Upright relation and operator symbols. */
const SYMBOLS: Record<string, { k: "op" | "punct"; s: string }> = {
  times: { k: "op", s: "×" }, cdot: { k: "op", s: "·" }, div: { k: "op", s: "÷" }, pm: { k: "op", s: "±" },
  le: { k: "op", s: "≤" }, ge: { k: "op", s: "≥" }, lt: { k: "op", s: "<" }, gt: { k: "op", s: ">" }, ne: { k: "op", s: "≠" },
  approx: { k: "op", s: "≈" }, equiv: { k: "op", s: "≡" }, to: { k: "op", s: "→" }, mapsto: { k: "op", s: "↦" },
  Rightarrow: { k: "op", s: "⇒" }, iff: { k: "op", s: "⇔" }, in: { k: "op", s: "∈" }, notin: { k: "op", s: "∉" },
  land: { k: "op", s: "∧" }, lor: { k: "op", s: "∨" }, minus: { k: "op", s: "−" },
  infty: { k: "punct", s: "∞" }, ldots: { k: "punct", s: "…" }, ind: { k: "punct", s: "𝟙" }, prime: { k: "punct", s: "′" },
  lbrace: { k: "punct", s: "{" }, rbrace: { k: "punct", s: "}" }, langle: { k: "punct", s: "⟨" }, rangle: { k: "punct", s: "⟩" },
  lVert: { k: "punct", s: "‖" }, rVert: { k: "punct", s: "‖" }, percent: { k: "punct", s: "%" },
};

const FUNCTIONS = new Set(["min", "max", "ln", "exp", "round", "log", "sgn", "argmin", "argmax"]);
const SPACES: Record<string, string> = { ",": "\u2009", ";": "\u2005", quad: "\u2003", " ": "\u00a0" };
const OPS = new Set(["=", "+", "<", ">", "−", "×", "·", "÷", "≤", "≥", "≠", "≈", "→", "⇒", "⇔", "∈", "±", "∧", "∨"]);

export type ParseResult = { nodes: MathNode[]; errors: string[] };

/** Parse the Academy notation. Never throws: problems are collected in errors. */
export function parseMath(src: string): ParseResult {
  const errors: string[] = [];
  let i = 0;

  const peek = () => src[i];
  const skipWs = () => { while (i < src.length && /\s/.test(src[i])) i++; };

  function readRawGroup(): string {
    skipWs();
    if (src[i] !== "{") { errors.push(`expected { at ${i} in "${src}"`); return ""; }
    let depth = 0;
    const start = ++i;
    for (; i < src.length; i++) {
      if (src[i] === "{") depth++;
      else if (src[i] === "}") { if (depth === 0) { const out = src.slice(start, i); i++; return out; } depth--; }
    }
    errors.push(`unclosed text group in "${src}"`);
    return src.slice(start);
  }

  function readGroup(): MathNode[] {
    skipWs();
    if (src[i] !== "{") { errors.push(`expected { at ${i} in "${src}"`); return []; }
    i++;
    return parseSeq("}");
  }

  /** One atom for a script or limit: a braced group or a single token. */
  function readArg(): MathNode[] {
    skipWs();
    if (src[i] === "{") return readGroup();
    const one = parseAtom();
    return one ? [one] : [];
  }

  function readScripts(): { sub?: MathNode[]; sup?: MathNode[] } {
    const out: { sub?: MathNode[]; sup?: MathNode[] } = {};
    for (;;) {
      const save = i;
      skipWs();
      if (src[i] === "_" && !out.sub) { i++; out.sub = readArg(); }
      else if (src[i] === "^" && !out.sup) { i++; out.sup = readArg(); }
      else { i = save; return out; }
    }
  }

  function parseCommand(): MathNode | null {
    i++; // backslash
    if (i >= src.length) { errors.push(`dangling backslash in "${src}"`); return null; }
    if (!/[A-Za-z]/.test(src[i])) {
      const c = src[i++];
      if (SPACES[c]) return { k: "space", s: SPACES[c] };
      if (c === "{" || c === "}" || c === "%" || c === "|") return { k: "punct", s: c };
      errors.push(`unknown escape \\${c} in "${src}"`);
      return null;
    }
    const start = i;
    while (i < src.length && /[A-Za-z]/.test(src[i])) i++;
    const name = src.slice(start, i);
    if (name === "frac") return { k: "frac", n: readGroup(), d: readGroup() };
    if (name === "sqrt") return { k: "sqrt", c: readGroup() };
    if (name === "sum" || name === "prod") {
      const sc = readScripts();
      return { k: "big", sym: name === "sum" ? "∑" : "∏", lo: sc.sub, hi: sc.sup };
    }
    if (name === "vec") {
      const els: MathNode[][] = [];
      for (;;) { const save = i; skipWs(); if (src[i] !== "{") { i = save; break; } els.push(readGroup()); }
      if (!els.length) errors.push(`empty \\vec in "${src}"`);
      return { k: "vec", els };
    }
    if (name === "cases") {
      const groups: MathNode[][] = [];
      for (;;) { const save = i; skipWs(); if (src[i] !== "{") { i = save; break; } groups.push(readGroup()); }
      if (!groups.length || groups.length % 2) errors.push(`\\cases needs value and condition pairs in "${src}"`);
      const rows: { v: MathNode[]; w: MathNode[] }[] = [];
      for (let r = 0; r + 1 < groups.length; r += 2) rows.push({ v: groups[r], w: groups[r + 1] });
      return { k: "cases", rows };
    }
    if (name === "text") return { k: "rm", s: readRawGroup() };
    if (name === "op") return { k: "fn", s: readRawGroup() };
    if (name === "quad") return { k: "space", s: SPACES.quad };
    if (FUNCTIONS.has(name)) return { k: "fn", s: name };
    if (GREEK[name]) return name[0] === name[0].toUpperCase() ? { k: "punct", s: GREEK[name] } : { k: "id", s: GREEK[name] };
    if (SYMBOLS[name]) return { k: SYMBOLS[name].k, s: SYMBOLS[name].s };
    errors.push(`unknown command \\${name} in "${src}"`);
    return null;
  }

  function parseAtom(): MathNode | null {
    const c = peek();
    if (c === undefined) return null;
    if (c === "\\") return parseCommand();
    if (c === "{") return { k: "grp", c: readGroup() };
    if (/[A-Za-z]/.test(c)) {
      const start = i;
      while (i < src.length && /[A-Za-z]/.test(src[i])) i++;
      return { k: "id", s: src.slice(start, i) };
    }
    if (/[0-9.]/.test(c)) {
      const start = i;
      while (i < src.length && /[0-9.]/.test(src[i])) i++;
      return { k: "num", s: src.slice(start, i) };
    }
    i++;
    if (c === "-") return { k: "op", s: "−" };
    if (c === "*") return { k: "op", s: "×" };
    if (c === "_" || c === "^" || c === "}") { errors.push(`unexpected ${c} at ${i - 1} in "${src}"`); return null; }
    if (OPS.has(c)) return { k: "op", s: c };
    return { k: "punct", s: c };
  }

  function parseSeq(stop?: string): MathNode[] {
    const out: MathNode[] = [];
    for (;;) {
      skipWs();
      if (i >= src.length) { if (stop) errors.push(`unclosed group in "${src}"`); return out; }
      if (stop && src[i] === stop) { i++; return out; }
      if (src[i] === "_" || src[i] === "^") {
        const base = out.pop();
        if (!base) { errors.push(`script without base in "${src}"`); i++; continue; }
        const sc = readScripts();
        if (base.k === "script") out.push({ ...base, sub: base.sub ?? sc.sub, sup: base.sup ?? sc.sup });
        else out.push({ k: "script", base, ...sc });
        continue;
      }
      const a = parseAtom();
      if (a) out.push(a);
    }
  }

  const nodes = parseSeq();
  return { nodes, errors };
}

function renderNodes(nodes: MathNode[], keyBase = "m"): React.ReactNode[] {
  return nodes.map((n, idx) => renderNode(n, `${keyBase}-${idx}`));
}

function renderNode(n: MathNode, key: string): React.ReactNode {
  switch (n.k) {
    case "id": return <i key={key} className="font-serif">{n.s}</i>;
    case "num": return <span key={key} className="font-serif tabular-nums">{n.s}</span>;
    case "op": return <span key={key} className="px-[0.22em] font-serif">{n.s}</span>;
    case "punct": return <span key={key} className="font-serif">{n.s}</span>;
    case "space": return <span key={key}>{n.s}</span>;
    case "fn": return <span key={key} className="font-serif not-italic pr-[0.12em]">{n.s}</span>;
    case "rm": return <span key={key} className="font-serif not-italic">{n.s}</span>;
    case "grp": return <React.Fragment key={key}>{renderNodes(n.c, key)}</React.Fragment>;
    case "script":
      return (
        <span key={key} className="inline-flex items-center">
          {renderNode(n.base, `${key}-b`)}
          {n.sub && n.sup ? (
            <span className="inline-flex flex-col text-[0.68em] leading-none">
              <sup className="static top-0">{renderNodes(n.sup, `${key}-p`)}</sup>
              <sub className="static">{renderNodes(n.sub, `${key}-s`)}</sub>
            </span>
          ) : n.sup ? (
            <sup className="text-[0.68em]">{renderNodes(n.sup, `${key}-p`)}</sup>
          ) : (
            <sub className="text-[0.68em]">{renderNodes(n.sub ?? [], `${key}-s`)}</sub>
          )}
        </span>
      );
    case "frac": return <MathFraction key={key} numerator={renderNodes(n.n, `${key}-n`)} denominator={renderNodes(n.d, `${key}-d`)} />;
    case "sqrt": return <MathRadical key={key}>{renderNodes(n.c, `${key}-r`)}</MathRadical>;
    case "big": return <MathBigOperator key={key} symbol={n.sym} lower={n.lo ? renderNodes(n.lo, `${key}-l`) : undefined} upper={n.hi ? renderNodes(n.hi, `${key}-h`) : undefined} />;
    case "vec": return <MathVector key={key} elements={n.els.map((e, j) => <span key={j}>{renderNodes(e, `${key}-${j}`)}</span>)} />;
    case "cases": return <MathCases key={key} rows={n.rows.map((r, j) => ({ value: renderNodes(r.v, `${key}-v${j}`), when: renderNodes(r.w, `${key}-w${j}`) }))} />;
  }
}

/** Typeset one expression in the Academy notation. */
export function MathExpr({ src, className = "" }: { src: string; className?: string }) {
  const { nodes } = parseMath(src);
  return <span className={`inline-flex flex-wrap items-center align-middle text-primary ${className}`} data-math="expr">{renderNodes(nodes)}</span>;
}

const INLINE = /\\\(([\s\S]+?)\\\)/g;

/** Split prose into text runs and inline mathematics (between \( and \)). */
export function splitInlineMath(text: string): { math: boolean; s: string }[] {
  const out: { math: boolean; s: string }[] = [];
  let last = 0;
  for (const m of text.matchAll(INLINE)) {
    if (m.index! > last) out.push({ math: false, s: text.slice(last, m.index) });
    out.push({ math: true, s: m[1] });
    last = m.index! + m[0].length;
  }
  if (last < text.length) out.push({ math: false, s: text.slice(last) });
  return out;
}

/** Prose with inline typeset mathematics. */
export function MathText({ text }: { text: string }) {
  const parts = splitInlineMath(text);
  if (parts.length === 1 && !parts[0].math) return <>{text}</>;
  return (
    <>
      {parts.map((p, i) => (p.math ? <MathExpr key={i} src={p.s} className="mx-[0.1em]" /> : <React.Fragment key={i}>{p.s}</React.Fragment>))}
    </>
  );
}

/** A canonical Academy formula, typeset in the ScholarlyFormula frame. */
export function AcademyFormulaBlock({ formula }: { formula: AcademyFormula }) {
  return (
    <ScholarlyFormula
      title={formula.title}
      classification={formula.classification}
      expression={{
        lhs: <MathExpr src={formula.lhs} />,
        rhs: <MathExpr src={formula.rhs} />,
        condition: formula.condition ? <MathExpr src={formula.condition} /> : undefined,
      }}
      parameters={formula.parameters.map((p) => ({
        symbol: <MathExpr src={p.symbol} />,
        name: p.name,
        domain: <MathText text={p.domain} />,
        description: <MathText text={p.description} />,
        threshold: p.threshold ? <MathText text={p.threshold} /> : undefined,
      }))}
      statutoryInvariant={formula.statutoryInvariant ? <MathText text={formula.statutoryInvariant} /> : undefined}
    />
  );
}
