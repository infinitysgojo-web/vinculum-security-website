import { useEffect, useMemo, useState } from "react";
import { useMission } from "./mission";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { statutoryClearances, telemetryLines, useEngine } from "./engine";
import { mintDispatch } from "./registry";
import { sha256, shortHash } from "./integrity";
import { toast } from "sonner";
import DeskOutput, { BinderContext, field, label, panel, type BinderEntry } from "./DeskOutput";

/**
 * Consolidated Mission Binder. Compiles documents added from any desk into one
 * numbered master briefing. Held in memory only; nothing is stored or sent.
 */
export default function MissionBinder({
  entries,
  onRemove,
  onMove,
}: {
  entries: BinderEntry[];
  onRemove: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const profile = useMission();
  const [theatre, setTheatre] = useState(profile.theatre);
  const [envoy, setEnvoy] = useState(profile.officer || "Office of the Special Envoy");
  // Inherit from the Mission Vault whenever the theatre or officer changes; manual edits remain possible.
  useEffect(() => setTheatre(profile.theatre), [profile.theatre]);
  useEffect(() => setEnvoy(profile.officer || "Office of the Special Envoy"), [profile.officer]);
  const { signals } = useEngine();

  const synopsis = useMemo(() => telemetryLines(signals).slice(1).map((l) => l.trim()).filter((l) => l && !/^STANDING ALERTS|^SOVEREIGN INSCRIPTIONS/.test(l)).slice(0, 10), [signals]);
  const clearances = useMemo(() => statutoryClearances(signals), [signals]);
  const [clearanceHash, setClearanceHash] = useState("");
  useEffect(() => {
    let live = true;
    const basis = clearances.map((c) => `${c.id}:${c.passed ? 1 : 0}`).join("|");
    sha256(basis).then((h) => live && setClearanceHash(h));
    return () => { live = false; };
  }, [clearances]);
  const [lastRef, setLastRef] = useState("");

  const text = useMemo(() => {
    const bar = "=".repeat(64);
    const L = [
      "VINCULUM SECURITY · MASTER CHANCELLERY BRIEFING BINDER",
      "Compiled under A Doctrine of Relational Security",
      "",
      `THEATRE: ${theatre.trim() || "Unspecified"}`,
      `PREPARED FOR: ${envoy.trim() || "Receiving office"}`,
      `CONTENTS: ${entries.length} document${entries.length === 1 ? "" : "s"}`,
      "",
      ...(telemetryLines(signals).length ? ["SITUATION SYNOPSIS", ...telemetryLines(signals).slice(1)] : []),
      "TABLE OF CONTENTS",
      ...entries.map((e, i) => `  Tab ${i + 1}. ${e.title}`),
    ];
    entries.forEach((e, i) => {
      L.push("", bar, `TAB ${i + 1} OF ${entries.length}`, bar, "", e.text);
    });
    L.push("", bar, "END OF BINDER. Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    return L.join("\n");
  }, [entries, theatre, envoy, signals]);

  const copyBinder = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Compiled binder copied");
    } catch {
      toast.error("Copy was blocked. Select the binder text beneath instead.");
    }
  };
  const mintBinder = async () => {
    const d = await mintDispatch(signals, "dossier", "binder");
    setLastRef(`Dossier ${d.ref}`);
    toast.success(`Dossier ${d.ref} minted`);
  };

  return (
    <section className={panel}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5 lg:col-span-6">
          <div>
            <label className={label} htmlFor="mb-t">Theatre</label>
            <input id="mb-t" className={`${field} text-base sm:text-sm min-h-11`} value={theatre} onChange={(e) => setTheatre(e.target.value)} placeholder="e.g. Northern Rift disengagement" />
          </div>
          <div>
            <label className={label} htmlFor="mb-e">Prepared for</label>
            <input id="mb-e" className={`${field} text-base sm:text-sm min-h-11`} value={envoy} onChange={(e) => setEnvoy(e.target.value)} placeholder="e.g. Office of the Special Envoy" />
          </div>
          <div>
            <span className={label}>Binder contents</span>
            {entries.length === 0 ? (
              <p className="text-sm text-muted-foreground border border-dashed border-brass/50 p-4">
                Empty. Open any desk and press "Add to binder" under its document. Adding again from the same desk replaces that tab with the latest version.
              </p>
            ) : (
              <ol className="space-y-2 max-h-[32rem] overflow-y-auto pr-1" tabIndex={0} aria-label="Staged binder documents">
                {entries.map((e, i) => (
                  <li key={e.id} className="flex items-center gap-2 border border-border bg-background p-3 text-sm">
                    <span className="font-serif text-accent w-8 shrink-0">{i + 1}</span>
                    <span className="flex-1 min-w-0 truncate text-foreground/85">{e.title}</span>
                    <button type="button" aria-label="Move up" disabled={i === 0} onClick={() => onMove(e.id, -1)} className="p-2 disabled:opacity-30 hover:text-accent"><ArrowUp size={14} /></button>
                    <button type="button" aria-label="Move down" disabled={i === entries.length - 1} onClick={() => onMove(e.id, 1)} className="p-2 disabled:opacity-30 hover:text-accent"><ArrowDown size={14} /></button>
                    <button type="button" aria-label={`Remove ${e.title}`} onClick={() => onRemove(e.id)} className="p-2 hover:text-accent"><X size={14} /></button>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="border border-brass/40 bg-background p-4">
            <p className={label}>Document export</p>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button type="button" onClick={copyBinder} className="min-h-11 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent">Copy compiled binder</button>
              <button type="button" onClick={mintBinder} className="min-h-11 border border-accent bg-accent px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-accent-foreground">Mint dossier reference</button>
            </div>
            {lastRef && <p className="mt-2 font-mono text-[11px] text-accent [overflow-wrap:anywhere]">{lastRef}</p>}
            <p className="mt-2 text-[11px] text-muted-foreground">PDF and print export sit with the compiled binder beneath.</p>
          </div>
        </div>
        {/* Right column: live master dossier, contents, synopsis and clearance hash. */}
        <div className="space-y-5 min-w-0 lg:col-span-6">
          <div className="border border-brass/40 bg-background p-4 sm:p-5">
            <p className={label}>Master dossier · table of contents</p>
            <p className="font-serif text-lg text-primary leading-tight [overflow-wrap:anywhere]">{theatre.trim() || "Unspecified theatre"}</p>
            <p className="mt-1 text-xs text-muted-foreground [overflow-wrap:anywhere]">Prepared for {envoy.trim() || "the receiving office"} · {entries.length} tab{entries.length === 1 ? "" : "s"}</p>
            <ol className="mt-4 space-y-1.5 border-t border-border pt-3">
              <li className="flex gap-3 text-xs"><span className="w-12 shrink-0 font-mono text-accent">Front</span><span className="text-foreground/85">Situation synopsis and standing alerts</span></li>
              {entries.map((e, i) => (
                <li key={e.id} className="flex gap-3 text-xs">
                  <span className="w-12 shrink-0 font-mono text-accent">Tab {i + 1}</span>
                  <span className="min-w-0 text-foreground/85 [overflow-wrap:anywhere]">{e.title}</span>
                </li>
              ))}
              {(signals.customNotes ?? []).filter((n) => n.desk === "binder").map((n) => (
                <li key={n.id} className="flex gap-3 text-xs">
                  <span className="w-12 shrink-0 font-mono text-accent">Annex</span>
                  <span className="min-w-0 text-foreground/85 [overflow-wrap:anywhere]">{n.title}</span>
                </li>
              ))}
              <li className="flex gap-3 text-xs"><span className="w-12 shrink-0 font-mono text-accent">Sched.</span><span className="text-foreground/85">Twenty statutory clearances ({clearances.filter((c) => c.passed).length} of {clearances.length} satisfied)</span></li>
            </ol>
          </div>
          <div className="border border-border bg-navy-tint/40 p-4 sm:p-5">
            <p className={label}>Situation synopsis</p>
            {synopsis.length ? (
              <ul className="space-y-1.5">
                {synopsis.map((l, i) => (
                  <li key={i} className="text-xs leading-relaxed text-foreground/85 [overflow-wrap:anywhere]">{l}</li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No upstream reading yet. Score the bonds on the diagnostic bench and the synopsis compiles here.</p>
            )}
          </div>
          <div className="border border-brass/40 bg-background p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <p className={label}>Clearance hash · 20 articles</p>
              <span className="font-mono text-[10px] text-primary">{clearances.filter((c) => c.passed).length}/{clearances.length}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-5" role="list" aria-label="Statutory clearance articles">
              {clearances.map((c) => (
                <span key={c.id} role="listitem" title={c.name} className={`border px-1.5 py-1 text-center font-mono text-[10px] ${c.passed ? "border-primary/50 text-primary" : c.binding ? "border-destructive/60 text-destructive" : "border-border text-muted-foreground"}`}>
                  {c.id}
                </span>
              ))}
            </div>
            <p className="mt-3 border-t border-border pt-2 font-mono text-[10px] text-muted-foreground [overflow-wrap:anywhere]">SHA-256 {clearanceHash ? shortHash(clearanceHash) : "computing…"}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full min-w-0">
        <BinderContext.Provider value={null}>
          <DeskOutput text={text} fileName="Vinculum-Mission-Binder" />
        </BinderContext.Provider>
      </div>
    </section>
  );
}
