import { useState } from "react";
import FadeIn from "./FadeIn";
import GoldRule from "./GoldRule";
import DiplomatBadge from "./DiplomatBadge";

const SAFEGUARDS = [
  {
    id: "child-protection",
    party: "Children",
    rule: "Absolute Carve-Out",
    test: "Is a mandated child-protection framework already in force?",
    requirement: "Participation is admissible only where protection is guaranteed and presence is never treated as consent.",
  },
  {
    id: "gov-non-self",
    party: "Government",
    rule: "Non-Self-Assessment",
    test: "Is the institutional-relational score provided by an independent rater?",
    requirement: "A government's own claim of bond-integrity is a hypothesis, never a self-certifying conclusion.",
  },
  {
    id: "wps-outcomes",
    party: "Women",
    rule: "Outcome Verification",
    test: "Is participation tested against outcomes rather than headcount?",
    requirement: "Gendered harm must be named explicitly in the bond map; standing is measured by material impact.",
  },
  {
    id: "adversarial-pass",
    party: "All Parties",
    rule: "Adversarial Rescoring",
    test: "Has a rescoring pass been performed from a skeptical posture?",
    requirement: "Deliberate attempt to argue against favorable tendencies to check for 'bond theater' or 'delay-justification'.",
  },
];

export default function AuditBench() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allPassed = SAFEGUARDS.every((s) => checked[s.id]);

  return (
    <section id="audit-bench" className="scroll-mt-24 border border-border bg-background p-6 md:p-8">
      <FadeIn>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <p className="eyebrow">§6B · Field Audit Bench</p>
            <h3 className="mt-2 font-serif text-2xl text-primary font-medium">Stakeholder Safeguard Check</h3>
          </div>
          <DiplomatBadge variant="briefing-ready">Audit Protocol</DiplomatBadge>
        </div>
        
        <p className="text-sm text-foreground/85 mb-8 max-w-2xl leading-relaxed">
          The Field Audit Bench is a structural safeguard for the diagnostic method. Before a bond score is 
          entered into a formal briefing, it must pass the four mandatory gates below.
        </p>

        <div className="space-y-4">
          {SAFEGUARDS.map((s) => (
            <div 
              key={s.id}
              className={`group border-l-2 transition-colors ${
                checked[s.id] ? "border-primary bg-gold-tint/30" : "border-accent/30 bg-navy-tint/40"
              } p-5`}
            >
              <div className="flex items-start gap-4">
                <input
                  type="checkbox"
                  id={s.id}
                  checked={!!checked[s.id]}
                  onChange={() => toggle(s.id)}
                  className="mt-1.5 h-4 w-4 accent-primary cursor-pointer"
                />
                <div className="flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 mb-2">
                    <label htmlFor={s.id} className="font-serif text-lg text-primary cursor-pointer select-none">
                      {s.party}: {s.rule}
                    </label>
                  </div>
                  <p className="text-sm font-medium text-accent mb-2 italic">"{s.test}"</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {s.requirement}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {allPassed ? (
          <FadeIn className="mt-8 bg-primary/5 border border-primary/20 p-5 text-center">
            <p className="font-serif text-primary text-lg italic">
              All structural safeguards verified. The assessment is cleared for field reporting.
            </p>
          </FadeIn>
        ) : (
          <div className="mt-8 text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">
              Waiting for safeguard verification...
            </p>
          </div>
        )}

        <GoldRule className="mt-10 mb-4" />
        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground text-center">
          Vinculum Security § VI · Field Audit Protocol
        </p>
      </FadeIn>
    </section>
  );
}
