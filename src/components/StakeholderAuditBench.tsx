import { useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import GoldRule from "@/components/GoldRule";
import { cn } from "@/lib/utils";

type Party = readonly [string, string, string];

const CHECKS = [
  "Relevant evidence has been reviewed",
  "The affected party has been heard directly",
  "Independent verification has been recorded",
] as const;

export default function StakeholderAuditBench({ parties }: { parties: readonly Party[] }) {
  const [active, setActive] = useState(0);
  const [checked, setChecked] = useState<Record<string, boolean[]>>({});
  const party = parties[active];
  if (!party) return null;

  const state = checked[party[0]] ?? CHECKS.map(() => false);
  const completed = state.filter(Boolean).length;
  const update = (index: number) => {
    setChecked((current) => ({
      ...current,
      [party[0]]: state.map((value, i) => (i === index ? !value : value)),
    }));
  };

  return (
    <section aria-labelledby="field-audit-title" className="mb-16 print:hidden">
      <p className="eyebrow">VI.A · Stakeholder Safeguard</p>
      <h2 id="field-audit-title" className="mt-3 font-serif text-primary text-2xl md:text-3xl">
        Field audit bench
      </h2>
      <GoldRule className="mt-4 mb-6" />
      <p className="max-w-3xl text-muted-foreground mb-8">
        Review one party at a time before a bond assessment is treated as ready for use.
      </p>

      <div className="md:hidden mb-5">
        <label htmlFor="audit-party" className="eyebrow block mb-2">Affected party</label>
        <select
          id="audit-party"
          value={active}
          onChange={(event) => setActive(Number(event.target.value))}
          className="w-full border border-input bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        >
          {parties.map(([name], index) => <option key={name} value={index}>{name}</option>)}
        </select>
      </div>

      <div className="grid gap-6 md:grid-cols-[13rem_minmax(0,1fr)]">
        <div className="hidden md:block border-r border-border pr-4" role="tablist" aria-label="Affected parties">
          {parties.map(([name], index) => {
            const count = (checked[name] ?? []).filter(Boolean).length;
            return (
              <Button
                key={name}
                type="button"
                variant="ghost"
                role="tab"
                aria-selected={active === index}
                onClick={() => setActive(index)}
                className={cn(
                  "w-full h-auto justify-between rounded-none px-3 py-2.5 text-left",
                  active === index && "bg-secondary text-primary",
                )}
              >
                <span>{name}</span>
                {count > 0 && <span className="text-xs text-accent">{count}/3</span>}
              </Button>
            );
          })}
        </div>

        <div role="tabpanel" className="border-l-2 border-accent pl-5 md:pl-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow">{party[0]}</p>
              <p className="mt-3 font-serif text-primary text-lg leading-snug">{party[1]}</p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">{completed}/3</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-foreground/80">{party[2]}</p>

          <div className="mt-6 space-y-2" aria-label={`${party[0]} audit checks`}>
            {CHECKS.map((label, index) => (
              <label key={label} className="flex cursor-pointer items-start gap-3 border-t border-border py-3 text-sm text-foreground/85">
                <input
                  type="checkbox"
                  checked={state[index]}
                  onChange={() => update(index)}
                  className="sr-only"
                />
                <span className={cn(
                  "mt-0.5 flex size-5 shrink-0 items-center justify-center border border-input",
                  state[index] && "border-accent bg-accent text-accent-foreground",
                )}>
                  {state[index] && <Check aria-hidden="true" className="size-3.5" />}
                </span>
                <span>{label}</span>
              </label>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
            <p className="max-w-xl text-xs leading-relaxed text-muted-foreground">
              A field prompt only. Completion is not certification and never replaces protection obligations.
            </p>
            <Button type="button" variant="ghost" size="sm" onClick={() => setChecked({})} title="Reset all audit checks">
              <RotateCcw aria-hidden="true" /> Reset
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}