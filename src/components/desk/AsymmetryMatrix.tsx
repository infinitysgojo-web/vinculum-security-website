import { useMemo, useState } from "react";
import { frictionCoefficient, useEngine, usePublish, VIABLE_FLOOR } from "./engine";
import FormulaProof from "./FormulaProof";
import { asymmetryProof } from "./formulaProofs";
import { Button } from "@/components/ui/button";

const BONDS = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"] as const;
const SHORT = ["Inter.", "Comm.", "Gen.", "Inst."];

type Party = { id: string; label: string; bond: number; /** Fixed tolerance vector for inscribed parties. */ tol?: number[]; custom?: boolean };

/** Default tolerance: the 3.0 viable floor on every bond, with the party holding out at 4.0 on its own focus bond. */
const defaultTol = (p: Party) => p.tol ?? BONDS.map((_, i) => (i === p.bond ? 4.0 : VIABLE_FLOOR));

/**
 * Multi-party asymmetry and leverage matrix. Each delegation carries a four-bond
 * tolerance vector (the minimum it will accept on each bond). The inter-party
 * friction coefficient is the Euclidean distance between two vectors over the
 * maximum distance (0 to 1). Veto asymmetry names the party whose tolerance on the
 * limiting bond stands furthest above the live score, giving it unilateral holdout
 * leverage. Results publish to the mission bus.
 */
export default function AsymmetryMatrix({ parties }: { parties: Party[] }) {
  const { signals } = useEngine();
  const [tol, setTol] = useState<Record<string, number[]>>({});
  const [pair, setPair] = useState<[string, string] | null>(null);
  const vec = (p: Party) => tol[p.id] ?? defaultTol(p);
  const setCell = (p: Party, i: number, v: number) => {
    if (!Number.isFinite(v)) return;
    setTol((t) => ({ ...t, [p.id]: (t[p.id] ?? defaultTol(p)).map((x, j) => (j === i ? Math.max(1, Math.min(5, Math.round(v * 10) / 10)) : x)) }));
  };

  // The coefficient is the engine's own, so the Academy and this desk cannot disagree.
  const coeff = (a: Party, b: Party) => frictionCoefficient(vec(a), vec(b));

  const limIdx = Math.max(0, BONDS.findIndex((b) => b === signals.weakestBond));
  const liveLim = signals.weakestScore ?? (signals.bonds ? [signals.bonds.interpersonal, signals.bonds.communal, signals.bonds.intergenerational, signals.bonds.institutional][limIdx] : undefined);

  const { maxF, veto, vetoGap } = useMemo(() => {
    let maxF = 0;
    parties.forEach((a, i) => parties.slice(i + 1).forEach((b) => (maxF = Math.max(maxF, coeff(a, b)))));
    let veto: Party | null = null;
    let vetoGap = 0;
    if (liveLim !== undefined) {
      for (const p of parties) {
        const gap = Math.round((vec(p)[limIdx] - liveLim) * 10) / 10;
        if (gap > vetoGap) {
          vetoGap = gap;
          veto = p;
        }
      }
    }
    return { maxF, veto, vetoGap };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parties, tol, limIdx, liveLim]);

  usePublish("asymmetry", { partyFriction: parties.length >= 2 ? maxF : 0, vetoHolder: veto?.label ?? "" });

  const gapBreach = signals.trackGap !== undefined && signals.trackTolerance !== undefined && signals.trackGap > signals.trackTolerance;

  if (parties.length < 2) return null;
  const pairA = parties.find((p) => p.id === pair?.[0]);
  const pairB = parties.find((p) => p.id === pair?.[1]);
  const pairProof = pairA && pairB ? asymmetryProof(coeff(pairA, pairB), [pairA, pairB].map((p) => ({ label: p.label, vector: vec(p) }))) : null;

  return (
    <div className="border border-brass/40 bg-background p-4 sm:p-5 min-w-0" data-testid="asymmetry-matrix">
      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary mb-1">Asymmetry and leverage matrix</p>
      <FormulaProof proof={asymmetryProof(maxF, parties.map((p) => ({ label: p.label, vector: vec(p) })))} />
      <p className="mb-3 text-xs text-muted-foreground">
        Tolerance is the minimum each delegation will accept on each bond. Coefficients are Euclidean distance over the maximum (0 to 1).
      </p>
      
      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1 text-left text-[9px] uppercase tracking-[0.12em] text-muted-foreground font-semibold">Tolerance</th>
              {BONDS.map((b, i) => (
                <th key={b} className={`p-1 text-[9px] uppercase tracking-[0.12em] font-semibold ${i === limIdx ? "text-accent" : "text-muted-foreground"}`} title={b}>
                  {SHORT[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parties.map((p) => (
              <tr key={p.id} className="border-t border-border">
                <td className="p-1 pr-2 font-semibold text-primary [overflow-wrap:anywhere]">{p.label}</td>
                {vec(p).map((v, i) => (
                  <td key={i} className="p-1 text-center">
                    <input
                      type="number"
                      min={1}
                      max={5}
                      step={0.5}
                      value={v}
                      onChange={(e) => setCell(p, i, Number(e.target.value))}
                      aria-label={`${p.label} tolerance on ${BONDS[i]}`}
                      className={`w-14 border bg-background px-1 py-1 text-center tabular-nums ${i === limIdx ? "border-accent/60" : "border-input"}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 mb-1 text-[9px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">Inter-party friction coefficient</p>
      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[300px] border-collapse text-xs">
          <thead>
            <tr>
              <th className="p-1" />
              {parties.map((p) => (
                <th key={p.id} className="p-1 text-[9px] uppercase tracking-[0.1em] text-muted-foreground font-semibold whitespace-nowrap">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {parties.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="p-1 pr-2 text-[10px] font-semibold text-primary [overflow-wrap:anywhere]">{a.label}</td>
                {parties.map((b) => {
                  const c = a.id === b.id ? null : coeff(a, b);
                  return (
                    <td
                      key={b.id}
                      className={`p-1 text-center font-mono tabular-nums transition-colors ${
                        c === null
                          ? "text-muted-foreground"
                          : pairA?.id === a.id && pairB?.id === b.id
                            ? "bg-accent/20 ring-1 ring-accent text-accent font-semibold"
                            : c >= 0.25
                              ? "bg-destructive/15 text-destructive font-semibold"
                              : c >= 0.12
                                ? "bg-brass/15 text-primary"
                                : "text-primary hover:bg-brass/10"
                      }`}
                    >
                      {c === null ? "—" : <Button variant="ghost" size="sm" type="button" className="h-8 min-w-10 rounded-none p-1 font-mono text-inherit w-full transition-transform active:scale-95"
                        aria-label={`Inspect friction: ${a.label} / ${b.label}, ${c.toFixed(2)}`} aria-pressed={pairA?.id === a.id && pairB?.id === b.id}
                        onClick={() => setPair([a.id, b.id])} title={`${a.label} / ${b.label}: ${vec(a).join(", ")} versus ${vec(b).join(", ")}`}>
                        {c.toFixed(2)}
                      </Button>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-2 min-h-12 border-t border-border pt-2 text-xs text-primary [overflow-wrap:anywhere]" role="status">
        {pairProof && pairA && pairB ? <>
          <p className="font-semibold">{pairA.label} / {pairB.label} · {coeff(pairA, pairB).toFixed(2)} <FormulaProof proof={pairProof} /></p>
          <p className="font-mono text-[11px] text-muted-foreground">{pairProof.substitution}</p>
        </> : <p>Maximum inter-party friction: {maxF.toFixed(2)}</p>}
      </div>

      <div className="mt-4 space-y-2 text-xs">
        <p className="[overflow-wrap:anywhere]">
          <span className="text-[9px] uppercase tracking-[0.16em] font-semibold text-accent">Veto asymmetry · </span>
          {liveLim === undefined
            ? "Score the bonds on the Assessment Bench to locate the limiting bond."
            : veto
              ? `${veto.label} holds unilateral holdout leverage on the limiting ${BONDS[limIdx]} bond: it demands ${vec(veto)[limIdx].toFixed(1)} against a live ${liveLim.toFixed(1)}, a gap of ${vetoGap.toFixed(1)}. Sequence its concession first.`
              : `No delegation demands more than the live ${liveLim.toFixed(1)} on the limiting ${BONDS[limIdx]} bond; no holdout leverage stands.`}
        </p>
        {gapBreach && (
          <p role="status" className="border border-destructive/50 bg-destructive/10 px-2 py-1.5 font-semibold text-destructive [overflow-wrap:anywhere]">
            Sequencing warning: Track I leads Track II by {signals.trackGap} phases against a communal tolerance of {signals.trackTolerance}.
            Hold the principals at their present phase until the communal assemblies close the gap{veto ? `, and open with ${veto.label}` : ""}.
          </p>
        )}
      </div>
    </div>
  );
}
