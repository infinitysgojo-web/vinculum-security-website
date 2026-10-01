import { useEffect, useState } from "react";
import { Check, Loader2, Save } from "lucide-react";

type Props = { onSave: () => void; savedAt: string | null };

/** Save button: Saving… then Saved, with the last-saved time. */
export default function SaveSession({ onSave, savedAt }: Props) {
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    if (state === "saving") {
      const t = window.setTimeout(() => {
        onSave();
        setState("saved");
      }, 700);
      return () => window.clearTimeout(t);
    }
    if (state === "saved") {
      const t = window.setTimeout(() => setState("idle"), 2200);
      return () => window.clearTimeout(t);
    }
  }, [state, onSave]);

  return (
    <button
      type="button"
      onClick={() => state === "idle" && setState("saving")}
      aria-live="polite"
      title={savedAt ? `Last saved ${savedAt}` : "Save this session on this device"}
      className={`inline-flex items-center gap-1.5 min-h-[36px] px-3 border text-[10px] uppercase tracking-[0.18em] font-semibold transition-colors ${
        state === "saved"
          ? "border-primary bg-primary text-primary-foreground"
          : "border-brass/60 text-primary hover:bg-brass/10"
      }`}
    >
      {state === "saving" ? (
        <><Loader2 className="h-3.5 w-3.5 animate-spin" />Saving…</>
      ) : state === "saved" ? (
        <><Check className="h-3.5 w-3.5" />Saved</>
      ) : (
        <><Save className="h-3.5 w-3.5" />Save</>
      )}
    </button>
  );
}
