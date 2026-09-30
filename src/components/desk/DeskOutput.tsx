import { createContext, useContext } from "react";
import { Copy, Download, BookPlus } from "lucide-react";
import { toast } from "sonner";

export const field = "w-full border border-input bg-background px-3 py-2.5 text-sm";
export const label = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";
export const panel = "border border-brass/40 bg-navy-tint/40 p-5 md:p-7";

export function todayStamp() {
  return new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
}

export type BinderEntry = { id: string; title: string; text: string };
/** In-memory Mission Binder shared across desks. Cleared on sign-out or refresh. */
export const BinderContext = createContext<{ add: (e: BinderEntry) => void } | null>(null);

/** Shared copy / download controls and plain-text document view for dashboard desks. */
export default function DeskOutput({ text, fileName }: { text: string; fileName: string }) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied");
    } catch {
      toast.error("Copy failed. Select the text and copy manually.");
    }
  };
  const download = () => {
    const url = URL.createObjectURL(new Blob([text], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };
  const binder = useContext(BinderContext);
  const addToBinder = () => {
    binder?.add({ id: fileName, title: text.split("\n")[0] || fileName, text });
    toast.success("Added to the Mission Binder");
  };
  const btn =
    "inline-flex items-center gap-2 border border-brass/50 px-3 py-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors";
  return (
    <div className="flex flex-col">
      <div className="flex flex-wrap gap-2 mb-3">
        <button type="button" onClick={copy} className={btn}><Copy size={13} /> Copy</button>
        <button type="button" onClick={download} className={btn}><Download size={13} /> Download</button>
        {binder && <button type="button" onClick={addToBinder} className={btn}><BookPlus size={13} /> Add to binder</button>}
      </div>
      <pre className="flex-1 whitespace-pre-wrap break-words border border-border bg-background p-4 text-[0.78rem] leading-relaxed text-foreground/90 max-h-[34rem] overflow-y-auto">
        {text}
      </pre>
    </div>
  );
}
