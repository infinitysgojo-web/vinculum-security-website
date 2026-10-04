import { useEffect, useMemo, useState } from "react";
import { useMission } from "./mission";
import { ArrowDown, ArrowUp, X } from "lucide-react";
import { telemetryLines, useEngine } from "./engine";
import DeskOutput, { BinderContext, field, label, panel, todayStamp, type BinderEntry } from "./DeskOutput";

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

  const text = useMemo(() => {
    const bar = "=".repeat(64);
    const L = [
      "VINCULUM SECURITY · MASTER CHANCELLERY BRIEFING BINDER",
      "Compiled under A Doctrine of Relational Security",
      "",
      `THEATRE: ${theatre.trim() || "Unspecified"}`,
      `PREPARED FOR: ${envoy.trim() || "Receiving office"}`,
      `DATE: ${todayStamp()}`,
      `CONTENTS: ${entries.length} document${entries.length === 1 ? "" : "s"}`,
      "",
      ...(telemetryLines(signals).length ? ["SITUATION SYNOPSIS", ...telemetryLines(signals).slice(1)] : []),
      "TABLE OF CONTENTS",
      ...entries.map((e, i) => `  Tab ${i + 1}. ${e.title}`),
    ];
    entries.forEach((e, i) => {
      L.push("", bar, `TAB ${i + 1} OF ${entries.length}`, bar, "", e.text);
    });
    L.push("", bar, "END OF BINDER. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [entries, theatre, envoy, signals]);

  return (
    <section className={panel}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5">
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
              <ol className="space-y-2">
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
        </div>
        <BinderContext.Provider value={null}>
          <DeskOutput text={text} fileName="Vinculum-Mission-Binder" />
        </BinderContext.Provider>
      </div>
    </section>
  );
}
