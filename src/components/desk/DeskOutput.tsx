import { createContext, useContext, useEffect, useState } from "react";
import { Copy, Download, BookPlus, FileText, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { MissionContext } from "./mission";
import { sha256, sealText, shortHash } from "./integrity";

export const field = "w-full border border-input bg-background px-3 py-2.5 text-sm";
export const label = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";
export const panel = "border border-brass/40 bg-navy-tint/40 p-4 sm:p-5 md:p-7";

export function todayStamp() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export type BinderEntry = { id: string; title: string; text: string };
/** In-memory Mission Binder shared across desks. Cleared on sign-out or refresh. */
export const BinderContext = createContext<{ add: (e: BinderEntry) => void } | null>(null);

/** Identity of the desk currently open, used on the chancellery document header. */
export const DeskMetaContext = createContext<{ title: string; eyebrow: string }>({
  title: "Chancellery working document",
  eyebrow: "Operational desk",
});

function reference(fileName: string) {
  const tag = fileName.replace(/^Vinculum-/, "").replace(/[^A-Za-z0-9]+/g, "").toUpperCase().slice(0, 10);
  const d = new Date();
  const stamp = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `VS-${tag || "DOC"}-${stamp}`;
}

/**
 * Shared chancellery document view for every dashboard desk. Presents the
 * compiled text on a formal dossier sheet and exports it as plain text or as
 * a publication-grade PDF in the same house style as the case dossiers.
 * Every export carries a SHA-256 integrity stamp computed on this device.
 */
export default function DeskOutput({ text, fileName }: { text: string; fileName: string }) {
  const binder = useContext(BinderContext);
  const profile = useContext(MissionContext);
  const meta = useContext(DeskMetaContext);
  const [busy, setBusy] = useState(false);
  const [hash, setHash] = useState("");
  const ref = reference(fileName);

  // Live fingerprint of the document on screen, recomputed whenever the text changes.
  useEffect(() => {
    let active = true;
    setHash("");
    sha256(text).then((h) => {
      if (active) setHash(h);
    });
    return () => {
      active = false;
    };
  }, [text]);

  const copy = async () => {
    try {
      const { stamped } = await sealText(text);
      await navigator.clipboard.writeText(stamped);
      toast.success("Copied with SHA-256 integrity stamp");
    } catch {
      toast.error("Copy failed. Select the text and copy manually.");
    }
  };

  const downloadText = async () => {
    const { stamped } = await sealText(text);
    const url = URL.createObjectURL(new Blob([stamped], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast.success("Text dossier downloaded with integrity seal");
  };

  const downloadPdf = async () => {
    setBusy(true);
    try {
      const { buildDeskDossier } = await import("./DeskDossierPdf");
      const { stamped } = await sealText(text);
      const blob = await buildDeskDossier({
        text: stamped,
        deskTitle: meta.title,
        eyebrow: meta.eyebrow,
        reference: ref,
        profile,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${fileName}.pdf`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 4000);
      toast.success("Dossier downloaded");
    } catch {
      toast.error("The dossier could not be generated. Try again.");
    } finally {
      setBusy(false);
    }
  };

  const addToBinder = async () => {
    const { stamped } = await sealText(text);
    binder?.add({ id: fileName, title: text.split("\n")[0] || fileName, text: stamped });
    toast.success("Added to the Mission Binder with integrity seal");
  };

  const btn =
    "inline-flex items-center justify-center gap-2 border border-brass/50 px-3 py-2.5 min-h-11 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50";

  return (
    <div className="flex flex-col min-w-0">
      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
        <button type="button" onClick={copy} className={btn}><Copy size={13} /> Copy</button>
        <button type="button" onClick={downloadText} className={btn}><Download size={13} /> Text</button>
        <button type="button" onClick={downloadPdf} disabled={busy} className={btn}>
          {busy ? <Loader2 size={13} className="animate-spin" /> : <FileText size={13} />} PDF dossier
        </button>
        {binder && (
          <button type="button" onClick={addToBinder} className={btn}><BookPlus size={13} /> Add to binder</button>
        )}
      </div>

      <div className="border border-brass/50 bg-background shadow-sm">
        <div className="border-b border-brass/40 px-4 sm:px-6 py-4">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <p className="text-[9px] uppercase tracking-[0.26em] font-semibold text-primary/70">
              Vinculum Security · Chancellery document
            </p>
            <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              {profile.classification.trim() || "Unrestricted, working draft"}
            </p>
          </div>
          <h3 className="mt-2 font-serif text-primary text-lg sm:text-xl leading-tight">{meta.title}</h3>
          <div className="mt-2 h-px w-24 bg-brass/70" />
          <div className="mt-3 grid gap-x-6 gap-y-1 sm:grid-cols-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            <p>Reference · <span className="text-primary/80">{ref}</span></p>
            <p>Issued · <span className="text-primary/80">{todayStamp()}</span></p>
            <p className="truncate">Mission · <span className="text-primary/80">{profile.theatre.trim() || "Not named"}</span></p>
                        <p>Registry · <span className="text-primary/80">KECOBO RZ100967 · RZ104942 · RZ105005</span></p>
            <p className="sm:col-span-2 flex min-w-0 flex-wrap items-center gap-x-1.5">
              <ShieldCheck size={12} className="shrink-0 text-accent" />
              <span>SHA-256 ·</span>
              <span className="font-mono normal-case tracking-normal text-primary/80" title={hash}>{shortHash(hash)}</span>
            </p>
          </div>
        </div>
        <pre className="whitespace-pre-wrap [overflow-wrap:anywhere] px-4 sm:px-6 py-5 text-[0.76rem] sm:text-[0.8rem] leading-relaxed text-foreground/90 max-h-[34rem] overflow-y-auto">
          {text}
        </pre>
        {hash && (
          <div className="flex min-w-0 items-center justify-between gap-3 border-t border-brass/30 bg-muted/20 px-4 sm:px-6 py-2.5 text-[10px] text-muted-foreground">
            <span className="min-w-0 truncate font-mono" title={hash}>SEAL: {hash}</span>
            <span className="shrink-0 text-[9px] font-semibold uppercase tracking-widest text-accent">Local verified</span>
          </div>
        )}
      </div>
    </div>
  );
}
