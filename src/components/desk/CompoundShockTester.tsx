import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";
import BondRadar from "./BondRadar";

type Shock = { id: string; label: string; sev: number; bond: number; breaker: string; absorb: string };

const BONDS = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"];

const SHOCKS: Shock[] = [
  {
    id: "principal",
    label: "Principal incapacitation or removal",
    sev: 26,
    bond: 0,
    breaker: "Personal guarantees given by the departing principal",
    absorb: "§12 office-succession covenant: the obligation attaches to the Office and binds every successor without renegotiation.",
  },
  {
    id: "election",
    label: "Adverse electoral turnover",
    sev: 20,
    bond: 3,
    breaker: "Undertakings recorded as policy rather than as statute",
    absorb: "§12 statutory anchoring: the commitment is enacted in law before the electoral cycle closes.",
  },
  {
    id: "donor",
    label: "Donor withdrawal or funding collapse",
    sev: 18,
    bond: 3,
    breaker: "Verification and implementation bodies funded externally",
    absorb: "§12 domestic handover schedule with a named receiving office and a fixed transfer date.",
  },
  {
    id: "youth",
    label: "Youth mobilisation against the settlement",
    sev: 22,
    bond: 2,
    breaker: "Bodies seating the successor generation as observers",
    absorb: "Intergenerational seat with a vote, established before the commitment phase closes.",
  },
  {
    id: "capture",
    label: "Elite capture of the implementing body",
    sev: 24,
    bond: 3,
    breaker: "Appointment powers concentrated in a single party",
    absorb: "Split appointment with community and independent co-assessors, and published appointment reasons.",
  },
  {
    id: "guarantor",
    label: "External guarantor steps back",
    sev: 16,
    bond: 3,
    breaker: "Enforcement resting on the guarantor's continuing presence",
    absorb: "Domestic enforcement pathway written as the primary route, with the guarantor as a fallback only.",
  },
  {
    id: "theatre",
    label: "Compliance recorded without change in outcome",
    sev: 14,
    bond: 1,
    breaker: "Consultation clauses with no outcome test",
    absorb: "Outcome test: a written record of which submissions altered the decision and which did not.",
  },
  {
    id: "currency",
    label: "Currency devaluation or fiscal austerity",
    sev: 16,
    bond: 1,
    breaker: "Reparation, service and reintegration payments fixed in nominal terms",
    absorb: "Index the obligation, or state the non-monetary floor that survives fiscal contraction.",
  },
  {
    id: "displacement",
    label: "Mass displacement or demographic shift",
    sev: 18,
    bond: 1,
    breaker: "Communal standing tied to a fixed territorial roll",
    absorb: "Standing defined by community of belonging rather than by current residence register.",
  },
  {
    id: "attention",
    label: "International attention moves elsewhere",
    sev: 12,
    bond: 3,
    breaker: "Milestones dependent on external reporting cycles",
    absorb: "Domestic publication duty with fixed calendar dates, independent of external attention.",
  },
];

const AMPLIFY = 1.25;

export default function CompoundShockTester() {
  const [theatre, setTheatre] = useState("");
  const [on, setOn] = useState<string[]>(["principal", "donor"]);

  const toggle = (id: string) => setOn((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const active = SHOCKS.filter((s) => on.includes(s.id));

  const { strain, band, bondScores, sequence } = useMemo(() => {
    const base = active.reduce((a, s) => a + s.sev, 0);
    const amp = active.length > 1 ? (active.length - 1) * AMPLIFY * 4 : 0;
    const total = Math.min(100, Math.round(base + amp));
    const b =
      total >= 70 ? "Rupture likely" : total >= 45 ? "Severe strain" : total >= 22 ? "Elevated strain" : "Absorbable";
    const perBond = [0, 1, 2, 3].map((i) => {
      const s = active.filter((x) => x.bond === i).reduce((a, x) => a + x.sev, 0);
      return Math.max(1, Math.round(5 - Math.min(4, s / 14)));
    }) as [number, number, number, number];
    const seq = [...active].sort((a, b2) => b2.sev - a.sev);
    return { strain: total, band: b, bondScores: perBond, sequence: seq };
  }, [active]);

  const text = useMemo(() => {
    const L: string[] = [];
    L.push("COMPOUND SHOCK AND RUPTURE STRESS TEST");
    L.push("Vinculum Security, Assessment and Early Warning Division");
    L.push("");
    L.push(`THEATRE: ${theatre.trim() || "Unnamed theatre"}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push(`SHOCKS APPLIED: ${active.length} of ${SHOCKS.length}`);
    L.push("");
    L.push("I. COMPOUND STRAIN READING");
    L.push("");
    L.push(`Compound strain index: ${strain} of 100`);
    L.push(`Band: ${band}`);
    L.push(
      active.length > 1
        ? `Amplification applied: each shock beyond the first adds ${AMPLIFY} severity points per bond level. Shocks do not arrive in isolation and are not absorbed in isolation.`
        : "No amplification applied. A single shock is tested against its own severity only."
    );
    L.push("");
    L.push("II. FAILURE SEQUENCE LEDGER");
    L.push("");
    if (!sequence.length) {
      L.push("No shocks applied.");
    } else {
      sequence.forEach((s, i) => {
        L.push(`${i + 1}. ${s.label.toUpperCase()}  [severity ${s.sev}, ${BONDS[s.bond]}]`);
        L.push(`   First to break: ${s.breaker}`);
        L.push(`   Absorbing mechanism: ${s.absorb}`);
        L.push("");
      });
      L.push(`Primary institutional breaker: ${sequence[0].breaker}.`);
      L.push("");
    }
    L.push("III. CONTINUUM AFTER THE SHOCKS");
    L.push("");
    BONDS.forEach((b, i) => L.push(`   ${b}: ${bondScores[i]} of 5`));
    L.push("");
    L.push("IV. STANDING NOTE");
    L.push("");
    L.push(
      "This reading is deterministic and rule-based. It models the shocks selected against fixed severities from the registered doctrine. It does not forecast, and it does not replace field judgement."
    );
    L.push("");
    L.push("END OF STRESS TEST");
    return L.join("\n");
  }, [theatre, active, strain, band, sequence, bondScores]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className={panel}>
          <label className={label} htmlFor="cs-theatre">Theatre under test</label>
          <input
            id="cs-theatre"
            className={field}
            value={theatre}
            onChange={(e) => setTheatre(e.target.value)}
            placeholder="Transitional settlement, year two"
          />
          <p className={`${label} mt-5`}>Apply shocks simultaneously</p>
          <div className="space-y-2">
            {SHOCKS.map((s) => (
              <label key={s.id} className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={on.includes(s.id)}
                  onChange={() => toggle(s.id)}
                  className="mt-1 accent-[hsl(var(--accent))]"
                />
                <span className="flex-1">
                  <span className="text-foreground/90">{s.label}</span>
                  <span className="block text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                    Severity {s.sev} · {BONDS[s.bond]}
                  </span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="border border-brass/40 p-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className={label}>Compound strain</p>
            <span className="font-serif text-2xl text-primary">{strain}/100</span>
          </div>
          <div className="h-2 bg-brass/20">
            <div className="h-full bg-accent transition-all" style={{ width: `${strain}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] font-semibold text-accent">{band}</p>
        </div>

        <BondRadar scores={bondScores} caption="Continuum after the applied shocks" />
      </div>

      <DeskOutput text={text} fileName="Vinculum-Compound-Stress-Test" />
    </div>
  );
}
