import { Activity } from "lucide-react";
import { hasSignal, useEngine } from "./engine";

/**
 * A compact, read-only line of directives a reference desk derives from the
 * live mission reading. Rule-based; renders nothing until Division I has data.
 */
export default function EngineBrief({ lines }: { lines: (string | false | undefined)[] }) {
  const { signals } = useEngine();
  const list = lines.filter(Boolean) as string[];
  if (!hasSignal(signals) || !list.length) return null;
  return (
    <div className="mb-6 border border-brass/40 bg-background/70 p-4 min-w-0">
      <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/70">
        <Activity size={13} className="text-accent" /> From the live mission reading
      </p>
      <ul className="mt-2 space-y-1.5 text-xs text-foreground/85">
        {list.map((n) => (
          <li key={n} className="flex gap-2"><span className="text-accent">·</span><span className="[overflow-wrap:anywhere]">{n}</span></li>
        ))}
      </ul>
    </div>
  );
}
