import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import EngineBrief from "@/components/desk/EngineBrief";
import SyncPanel from "@/components/desk/SyncPanel";
import DeskOutput from "@/components/desk/DeskOutput";
import { useEngine, usePublish, type Signals } from "@/components/desk/engine";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type Party = readonly string[];
const CHECKS = ["Relevant evidence reviewed", "Affected party heard directly", "Independent verification recorded"];

export default function AuditBench({ parties }: { parties: readonly Party[] }) {
  const [active, setActive] = useState(0);
  const { signals } = useEngine();
  // Linked: the audit prompts follow the live mission reading. Override: the bench works standalone.
  const [linked, setLinked] = useState(true);
  const sg: Signals = linked ? signals : {};
  const [checked, setChecked] = useState<Record<string, boolean[]>>({});
  const complete = parties.filter(([name]) => (checked[name] ?? []).filter(Boolean).length === CHECKS.length).length;
  usePublish("audit", { safeguardCoverage: parties.length ? Math.round((complete / parties.length) * 100) : 0 });
  const party = parties[active];
  if (!party) return null;
  const state = checked[party[0]] ?? CHECKS.map(() => false);
  const update = (index: number) => setChecked((current) => ({
    ...current,
    [party[0]]: state.map((value, i) => i === index ? !value : value),
  }));

  const record = [
    "FIELD AUDIT RECORD · STAKEHOLDER SAFEGUARD REVIEW",
    "",
    sg.weakestBond ? `Most exposed bond (live reading): ${sg.weakestBond}` : "Most exposed bond: not linked to the diagnostic bench",
    typeof sg.rupture === "number" ? `Rupture index: ${sg.rupture}%${sg.rupture >= 35 ? " (unchecked safeguards are blocking)" : ""}` : "Rupture index: not yet read",
    (sg.frictionPairs?.length ?? 0) > 0 ? `Friction at the table: ${sg.frictionPairs!.join("; ")}` : "",
    "",
    ...parties.flatMap(([name]) => {
      const s = checked[name] ?? CHECKS.map(() => false);
      const done = s.filter(Boolean).length;
      return [
        `${name}: ${done}/${CHECKS.length} safeguards ${done === CHECKS.length ? "COMPLETE" : "OUTSTANDING"}`,
        ...CHECKS.map((c, i) => `  [${s[i] ? "x" : " "}] ${c}`),
        "",
      ];
    }),
    "A field prompt only. Completion is not certification and never replaces protection obligations.",
  ].filter((l, i, a) => !(l === "" && a[i - 1] === "")).join("\n");

  return (
    <section id="audit-bench" className="scroll-mt-24 print:hidden">
      <div className="mb-6">
        <SyncPanel
          linked={linked}
          onToggle={setLinked}
          summary={(x) =>
            x.weakestBond
              ? [`Audit order follows the live reading: the ${x.weakestBond.toLowerCase()} bond is the most exposed on the diagnostic bench.`]
              : []
          }
        />
      </div>
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
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[13rem_minmax(0,1fr)] w-full min-w-0 [&>*]:min-w-0">
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
      <div className="mt-10 min-w-0">
        <DeskOutput text={record} fileName="Vinculum-Field-Audit" />
      </div>
    </section>
  );
}
