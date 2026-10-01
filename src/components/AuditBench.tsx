import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import GoldRule from "./GoldRule";
import EngineBrief from "@/components/desk/EngineBrief";
import { useEngine } from "@/components/desk/engine";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Party = readonly string[];
const CHECKS = ["Relevant evidence reviewed", "Affected party heard directly", "Independent verification recorded"];

export default function AuditBench({ parties }: { parties: readonly Party[] }) {
  const [active, setActive] = useState(0);
  const { signals: sg } = useEngine();
  const [checked, setChecked] = useState<Record<string, boolean[]>>({});
  const party = parties[active];
  if (!party) return null;
  const state = checked[party[0]] ?? CHECKS.map(() => false);
  const update = (index: number) => setChecked((current) => ({
    ...current,
    [party[0]]: state.map((value, i) => i === index ? !value : value),
  }));

  return (
    <section id="audit-bench" className="scroll-mt-24 print:hidden">
      <p className="eyebrow">VI.A · Stakeholder Safeguard</p>
      <h2 className="mt-3 font-serif text-primary text-2xl md:text-3xl">Field audit bench</h2>
      <GoldRule className="mt-4 mb-6" />
      <EngineBrief lines={[
        sg.weakestBond && `Audit first the parties who carry the ${sg.weakestBond.toLowerCase()} bond; it is the most exposed on the diagnostic bench.`,
        (sg.rupture ?? 0) >= 35 && `With the rupture index at ${sg.rupture} per cent, treat any unchecked safeguard as blocking, not advisory.`,
        (sg.frictionPairs?.length ?? 0) > 0 && `Friction at the table: ${sg.frictionPairs!.join("; ")}. Confirm retaliation safeguards for each side separately.`,
      ]} />
      <p className="mb-8 max-w-3xl text-muted-foreground">Review one party at a time before a bond assessment is treated as ready for use.</p>
      <label htmlFor="audit-party" className="eyebrow block mb-2 md:hidden">Affected party</label>
      <select id="audit-party" value={active} onChange={(event) => setActive(Number(event.target.value))} className="mb-5 w-full border border-input bg-background px-3 py-2.5 text-sm md:hidden">
        {parties.map(([name], index) => <option key={name} value={index}>{name}</option>)}
      </select>
      <div className="grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="hidden border-r border-border pr-4 md:block" role="tablist" aria-label="Affected parties">
          {parties.map(([name], index) => (
            <Button key={name} type="button" variant="ghost" role="tab" aria-selected={active === index} onClick={() => setActive(index)} className={cn("h-auto w-full justify-between rounded-none px-3 py-2.5", active === index && "bg-secondary text-primary")}>
              {name}<span className="text-xs text-accent">{(checked[name] ?? []).filter(Boolean).length || ""}</span>
            </Button>
          ))}
        </div>
        <div role="tabpanel" className="border-l-2 border-accent pl-5 md:pl-7">
          <p className="eyebrow">{party[0]}</p>
          <p className="mt-3 font-serif text-lg leading-snug text-primary">{party[1]}</p>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{party[2]}</p>
          <div className="mt-6">
            {CHECKS.map((label, index) => (
              <label key={label} className="flex cursor-pointer items-start gap-3 border-t border-border py-3 text-sm">
                <input type="checkbox" checked={state[index]} onChange={() => update(index)} className="sr-only" />
                <span className={cn("mt-0.5 flex size-5 shrink-0 items-center justify-center border border-input", state[index] && "border-accent bg-accent text-accent-foreground")}>{state[index] && <Check className="size-3.5" />}</span>
                {label}
              </label>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-xs text-muted-foreground">A field prompt only. Completion is not certification and never replaces protection obligations.</p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setChecked({})}><RotateCcw /> Reset</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
