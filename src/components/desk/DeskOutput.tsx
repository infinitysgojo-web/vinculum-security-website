import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Copy, Download, BookPlus, FileText, Loader2, ShieldCheck, Radio, Stamp } from "lucide-react";
import { toast } from "sonner";
import { MissionContext } from "./mission";
import { sha256, sealText, shortHash } from "./integrity";
import { inscriptionLines, statutoryClearances, useEngine } from "./engine";
import { apostille, ledgerSize, mintDispatch, type Dispatch } from "./registry";

export const field = "w-full border border-input bg-background px-3 py-2.5 text-sm";
export const label = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";
export const panel = "border border-brass/40 bg-navy-tint/40 p-4 sm:p-5 md:p-7";

export function todayStamp() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export type BinderEntry = { id: string; title: string; text: string; /** Desk the excerpt was staged from. */ desk?: string };
/** In-memory Mission Binder shared across desks. Cleared on sign-out or refresh. */
export const BinderContext = createContext<{ add: (e: BinderEntry) => void } | null>(null);

/** Identity of the desk currently open, used on the chancellery document header. */
export const DeskMetaContext = createContext<{ title: string; eyebrow: string; id?: string }>({
  title: "Chancellery working document",
  eyebrow: "Operational desk",
});

function reference(fileName: string) {
  const tag = fileName.replace(/^Vinculum-/, "").replace(/[^A-Za-z0-9]+/g, "").toUpperCase().slice(0, 10);
  // Undated serial: unique per export, but carries no calendar date.
  const serial = Math.floor(Math.random() * 0xfffff).toString(36).toUpperCase().padStart(4, "0");
  return `VS-${tag || "DOC"}-${serial}`;
}

/** Telegram spacing: upper case, fixed 64-column lines, four-space indent, STOP between paragraphs. */
export function toCable(text: string, ref: string): string {
  const WIDTH = 64;
  const wrap = (line: string) => {
    const words = line.trim().split(/\s+/).filter(Boolean);
    const out: string[] = [];
    let cur = "";
    for (const w of words) {
      if ((cur + " " + w).trim().length > WIDTH - 4) {
        out.push(cur);
        cur = w;
      } else cur = (cur + " " + w).trim();
    }
    if (cur) out.push(cur);
    return out.map((l) => `    ${l}`);
  };
  const body: string[] = [];
  for (const raw of text.split("\n")) {
    const line = raw.replace(/[─-]{8,}/g, "").trim();
    if (!line) {
      if (body.length && body[body.length - 1] !== "    STOP") body.push("    STOP");
      continue;
    }
    body.push(...wrap(line.toUpperCase()));
  }
  const rule = "=".repeat(WIDTH);
  return [
    rule,
    "ORIGIN: CHANCELLERY NAIROBI",
    `REF: ${ref.startsWith("NV/") ? ref : `VS-DIP-${ref.split("-").pop()}`}`,
    "CLASSIFICATION: CONFIDENTIAL RELATIONAL AUDIT",
    rule,
    "",
    ...body,
    "",
    "    ENDS",
    rule,
  ].join("\n");
}

/**
 * Shared chancellery document view for every dashboard desk. Presents the
 * compiled text on a formal dossier sheet and exports it as plain text or as
 * a publication-grade PDF in the same house style as the case dossiers.
 * Every export carries a SHA-256 integrity stamp computed on this device.
 */
export default function DeskOutput({ text: body, fileName, cable = false }: { text: string; fileName: string; /** Offer the Telegram / Cable Mode view. */ cable?: boolean }) {
  const binder = useContext(BinderContext);
  const profile = useContext(MissionContext);
  const meta = useContext(DeskMetaContext);
  const [busy, setBusy] = useState(false);
  const [hash, setHash] = useState("");
  // Stable for the life of the view, so the screen, the PDF and the cable carry one reference.
  const { signals } = useEngine();
  // Every transmittal carries the Sovereign Inscriptions schedule, unless the desk already printed it.
  const text = useMemo(() => {
    if (body.includes("SOVEREIGN INSCRIPTIONS")) return body;
    const ins = inscriptionLines(signals);
    return ins.length ? `${body}\n\n${ins.join("\n").trimEnd()}` : body;
  }, [body, signals]);
  const ref = useMemo(() => reference(fileName), [fileName]);
  const [cableMode, setCableMode] = useState(false);
  const cableText = useMemo(() => (cable ? toCable(text, ref) : ""), [cable, text, ref]);
  const copyCable = async () => {
    try {
      // Every cable that leaves the desk carries its own registry reference and digest.
      const d = await mintDispatch(signals, "cable");
      await navigator.clipboard.writeText(`${apostille(d)}\n\n${toCable(text, d.ref)}`);
      toast.success("Diplomatic cable copied");
    } catch {
      toast.error("Copy failed. Select the text and copy manually.");
    }
  };

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

  // Chancellery minute: a registry dispatch minted from this desk, on demand.
  const [minute, setMinute] = useState<Dispatch | null>(null);
  const mintMinute = async () => {
    const d = await mintDispatch(signals, "minute", meta.id);
    setMinute(d);
    toast.success(`Minute ${d.ref} entered in the registry`);
  };
  const copySeal = async () => {
    const d = minute ?? (await mintDispatch(signals, "minute", meta.id));
    if (!minute) setMinute(d);
    try {
      await navigator.clipboard.writeText(`${apostille(d)}\n\n${text}`);
      toast.success("Sovereign seal and document copied");
    } catch {
      toast.error("Copy failed. Select the text and copy manually.");
    }
  };

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
    const d = await mintDispatch(signals, "text");
    const url = URL.createObjectURL(new Blob([`${apostille(d)}\n\n${stamped}`], { type: "text/plain;charset=utf-8" }));
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
      const d = await mintDispatch(signals, "dossier");
      const blob = await buildDeskDossier({
        attestation: { ref: d.ref, digest: d.digest, clearances: statutoryClearances(signals), gatesPassed: d.gatesPassed, gatesTotal: d.gatesTotal, floorValidated: d.floorValidated },
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
        {cable && (
          <button
            type="button"
            onClick={() => setCableMode((m) => !m)}
            aria-pressed={cableMode}
            className={`${btn} ${cableMode ? "border-accent text-accent" : ""}`}
          >
            <Radio size={13} /> Telegram / Cable Mode
          </button>
        )}
      </div>

      {cable && cableMode && (
        <div className="relative mb-4 border-2 border-double border-primary/60 bg-background p-4 sm:p-6">
          <span aria-hidden className="absolute left-1.5 top-1.5 h-4 w-4 border-l-2 border-t-2 border-accent" />
          <span aria-hidden className="absolute right-1.5 top-1.5 h-4 w-4 border-r-2 border-t-2 border-accent" />
          <span aria-hidden className="absolute bottom-1.5 left-1.5 h-4 w-4 border-b-2 border-l-2 border-accent" />
          <span aria-hidden className="absolute bottom-1.5 right-1.5 h-4 w-4 border-b-2 border-r-2 border-accent" />
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <span className="inline-block -rotate-2 border-2 border-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.24em] text-accent">
              Chancellery cable
            </span>
            <button type="button" onClick={copyCable} className={btn}>
              <Copy size={13} /> Copy Diplomatic Cable
            </button>
          </div>
          <pre className="font-mono text-xs leading-relaxed text-foreground/90 whitespace-pre max-h-[34rem] overflow-auto">
            {cableText}
          </pre>
        </div>
      )}

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
            <p className="truncate">Mission · <span className="text-primary/80">{profile.theatre.trim() || "Not named"}</span></p>
                        <p>Registry · <span className="text-primary/80">Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved</span></p>
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

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={mintMinute} className={`${btn} border-primary/60`}>
            <Stamp size={13} /> Mint chancellery minute
          </button>
          <button type="button" onClick={copySeal} className={btn}>
            <Copy size={13} /> Copy sovereign seal
          </button>
        </div>
        <p className="min-w-0 font-mono text-[10px] text-muted-foreground [overflow-wrap:anywhere]">
          {minute ? (
            <>
              REF <span className="text-primary">{minute.ref}</span> · SHA <span className="text-primary" title={minute.digest}>{minute.digest.slice(0, 12)}</span> ·{" "}
              {minute.clearancesPassed}/{minute.clearancesTotal} clearances · {ledgerSize()} in registry
            </>
          ) : (
            "No minute minted from this desk yet"
          )}
        </p>
      </div>
    </div>
  );
}
