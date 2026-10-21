import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { CaseStudy } from "@/content/cases";

/**
 * Generates the executive dossier as a real PDF file and downloads it
 * directly. No browser print dialog, so no browser headers, footers,
 * page URLs or timestamps are ever stamped into the document.
 */
export default function DossierDownload({ c }: { c: CaseStudy }) {
  const [busy, setBusy] = useState(false);

  async function handleDownload() {
    if (busy) return;
    setBusy(true);
    try {
      const { buildDossierPdf, dossierFileName } = await import("@/components/CaseDossierPdf");
      const blob = await buildDossierPdf(c);
      const href = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = href;
      a.download = dossierFileName(c);
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(href), 4000);
    } catch (err) {
      // Details stay out of production consoles: an error can carry mission text.
      if (import.meta.env.DEV) console.error("Dossier generation failed", err);
      toast.error("The dossier could not be prepared. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleDownload}
      disabled={busy}
      aria-busy={busy}
      className="print:hidden"
    >
      {busy ? (
        <Loader2 aria-hidden="true" className="animate-spin" />
      ) : (
        <Download aria-hidden="true" />
      )}
      {busy ? "Preparing dossier" : "Download executive dossier"}
    </Button>
  );
}
