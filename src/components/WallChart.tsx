import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import GoldRule from "@/components/GoldRule";

/**
 * The Doctrinal Reference Chart. A one-sheet summary of the canonical
 * definition, the continuum, the classification and weighting rules, the
 * party-differentiated table, the safeguards and the five latent traps.
 * The PDF is generated in the browser; nothing is sent or stored.
 */

const BONDS = [
  ["I", "Interpersonal", "Would this relationship survive a bad-faith moment intact?"],
  ["II", "Communal", "Does this actor's authority survive contact with the community, not just the institution?"],
  ["III", "Intergenerational", "Are youth present at the table, or only in the room?"],
  ["IV", "Institutional-Relational", "Would this bond survive a change in personnel or office?"],
];

const TRAPS = [
  "The Elite-Pact Mirage",
  "The Generational Cliff",
  "Unanchored Repair",
  "Bond Theater",
  "Systemic Bond Collapse",
];

export default function WallChart() {
  const [busy, setBusy] = useState<string | null>(null);

  async function download(landscape: boolean) {
    if (busy) return;
    setBusy(landscape ? "land" : "port");
    try {
      const { buildWallChartPdf, wallChartFileName } = await import("@/components/WallChartPdf");
      const blob = await buildWallChartPdf(landscape);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = wallChartFileName(landscape);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 4000);
    } catch (err) {
      // Details stay out of production consoles: an error can carry mission text.
      if (import.meta.env.DEV) console.error("Wall chart generation failed", err);
      toast.error("The chart could not be prepared. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const btn =
    "inline-flex items-center justify-center gap-2 border border-brass/50 px-4 py-3 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50";

  return (
    <div className="border border-brass/40 bg-navy-tint/40 p-6 md:p-8 print:hidden">
      <p className="eyebrow">Reference · One sheet</p>
      <h3 className="mt-3 font-serif text-primary text-xl md:text-2xl">The doctrinal reference chart</h3>
      <GoldRule className="mt-4 mb-5" />
      <p className="text-sm text-muted-foreground max-w-2xl">
        The canonical definition, the four-level continuum with its diagnostic inquiries, the
        classification and weighting rules, the party-differentiated table, the three abuse-resistance
        safeguards and the five latent traps, set on a single sheet for a briefing room wall.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 mt-6">
        <div className="border border-border bg-background p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-3">
            The continuum and its inquiries
          </p>
          <ul className="space-y-2.5">
            {BONDS.map(([n, name, q]) => (
              <li key={n} className="text-sm">
                <span className="text-accent font-serif mr-2">{n}</span>
                <span className="font-serif text-primary text-base">{name}</span>
                <span className="block text-xs italic text-muted-foreground mt-0.5">"{q}"</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="border border-border bg-background p-4">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-3">
            The five latent traps
          </p>
          <ul className="space-y-2 text-sm font-serif text-primary">
            {TRAPS.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
            A severed intergenerational bond is the least compensable by strength in the other three
            levels.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <button type="button" className={btn} onClick={() => download(false)} disabled={!!busy}>
          {busy === "port" ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          A3 portrait sheet
        </button>
        <button type="button" className={btn} onClick={() => download(true)} disabled={!!busy}>
          {busy === "land" ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
          A3 landscape wall chart
        </button>
      </div>
    </div>
  );
}
