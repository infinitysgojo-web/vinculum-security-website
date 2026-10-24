import { useState } from "react";
import { ShieldAlert, ShieldCheck, Stamp } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { sha8, type SealDifference, type SealStatus } from "./handoverSeal";

/**
 * The header beacon of the Tamper-Evident Handover Seal.
 *   unsealed  →  "Seal assessment"
 *   intact    →  SEALED · e4a91c2f  (INTEGRITY INTACT)
 *   diverged  →  DIVERGENCE DETECTED · [modified parameters], which opens the inspection modal
 */
export default function HandoverSealBadge({
  status,
  differences,
  sealing,
  onSeal,
  onReseal,
  onClear,
}: {
  status: SealStatus;
  differences: () => SealDifference[];
  sealing: boolean;
  onSeal: () => void;
  onReseal: () => void;
  onClear: () => void;
}) {
  const [open, setOpen] = useState(false);
  const base = "inline-flex min-h-8 max-w-[16rem] shrink-0 whitespace-nowrap items-center gap-1.5 border px-2 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors";
  if (status.state === "unsealed")
    return (
      <button type="button" onClick={onSeal} disabled={sealing} className={`${base} border-brass/50 text-primary hover:border-accent hover:text-accent disabled:opacity-50`} title="Seal the mission assessment with SHA-256 before a briefing or a handover" data-testid="seal-badge">
        <Stamp size={12} /> <span className="hidden 2xl:inline">{sealing ? "Sealing…" : "Seal assessment"}</span>
      </button>
    );
  const diffs = open && status.state === "diverged" ? differences() : [];
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${base} ${status.state === "intact" ? "border-emerald/60 text-emerald" : "border-destructive bg-destructive/10 text-destructive font-semibold"}`}
        title={status.state === "intact" ? `Integrity intact · sealed by ${status.seal.sealedBy}` : "Divergence detected: open the inspection"}
        aria-label={status.state === "intact" ? `Sealed, integrity intact, ${sha8(status.seal.sealHash)}` : `Divergence detected in ${status.parameters.join(", ")}`}
        data-testid="seal-badge"
        data-seal-state={status.state}
      >
        {status.state === "intact" ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
        <span className="hidden truncate 2xl:inline">
          {status.state === "intact"
            ? `Sealed · ${sha8(status.seal.sealHash)}`
            : `Divergence detected · ${status.parameters.slice(0, 2).join(", ")}${status.parameters.length > 2 ? ` +${status.parameters.length - 2}` : ""}`}
        </span>
      </button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl rounded-none" data-testid="seal-inspection">
          <DialogHeader>
            <DialogTitle className="font-serif text-primary">{status.state === "intact" ? "Integrity intact" : "Divergence detected"}</DialogTitle>
            <DialogDescription className="font-mono text-[11px] [overflow-wrap:anywhere]">
              Sealed {status.seal.sealedAt.replace("T", " ").slice(0, 19)} UTC by {status.seal.sealedBy} · SHA-256 {status.seal.sealHash}
            </DialogDescription>
          </DialogHeader>
          {status.state === "intact" ? (
            <p className="text-sm text-foreground/85">The live mission state hashes to the sealed digest. Profile, warrant facts, assumptions and exclusions, bus signals and the decision ledger are unchanged since sealing.</p>
          ) : (
            <div className="max-h-[55vh] overflow-auto border border-border">
              <table className="w-full min-w-[30rem] border-collapse text-xs">
                <thead className="sticky top-0 bg-background">
                  <tr className="text-left text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    <th className="px-2 py-1.5 font-semibold">Parameter</th>
                    <th className="px-2 py-1.5 font-semibold">Sealed</th>
                    <th className="px-2 py-1.5 font-semibold">Current</th>
                  </tr>
                </thead>
                <tbody>
                  {diffs.slice(0, 300).map((d) => (
                    <tr key={d.path} className="border-t border-border align-top">
                      <td className="px-2 py-1 font-mono text-primary [overflow-wrap:anywhere]">{d.path}</td>
                      <td className="px-2 py-1 font-mono text-muted-foreground line-through decoration-destructive/60 [overflow-wrap:anywhere]">{d.sealed}</td>
                      <td className="px-2 py-1 font-mono bg-ochre/10 text-foreground [overflow-wrap:anywhere]">{d.current}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {diffs.length > 300 && <p className="p-2 text-[11px] text-muted-foreground">{diffs.length - 300} further differences not shown.</p>}
            </div>
          )}
          <div className="flex flex-wrap justify-end gap-2">
            <button type="button" onClick={() => { onClear(); setOpen(false); }} className="min-h-10 border border-border px-3 text-[10px] uppercase tracking-[0.14em] text-muted-foreground hover:text-accent">
              Break seal
            </button>
            <button type="button" onClick={() => { onReseal(); setOpen(false); }} disabled={sealing} className="min-h-10 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.14em] font-semibold text-primary hover:border-accent disabled:opacity-50">
              Re-seal current state
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
