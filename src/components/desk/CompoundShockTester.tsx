import { useEffect, useMemo, useState } from "react";
import { useTheatreSeed } from "./theatres";
import DeskOutput, { field, label, panel } from "./DeskOutput";
import { useMission } from "./mission";
import BondRadar from "./BondRadar";
import { usePublish, useEngine, round1, bondBand } from "./engine";
import SyncPanel from "./SyncPanel";
import { LEGITIMACY_PENALTY } from "./instruments";
import { compoundStress, compoundTimeline, COMPOUND_AMPLIFY } from "./shockTimeline";
import ShockTimelineScrubber from "./ShockTimelineScrubber";
import { ruptureShockRadiusNm } from "./theatreGeodesy";
import FormulaProof from "./FormulaProof";
import { compoundShockProof } from "./formulaProofs";

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

const AMPLIFY = COMPOUND_AMPLIFY;

/** One-tap shock packages drawn from the registered shock list. */
const SHOCK_PACKAGES: { label: string; ids: string[] }[] = [
  { label: "Succession crisis", ids: ["principal", "election"] },
  { label: "External abandonment", ids: ["donor", "guarantor"] },
  { label: "Communal resource shock", ids: ["displacement", "currency"] },
  { label: "Capture and youth revolt", ids: ["capture", "youth"] },
];

/** Format a severity or index to one decimal place, dropping a trailing ".0". */
const fmt = (n: number) => (Number.isInteger(round1(n)) ? String(round1(n)) : round1(n).toFixed(1));

export default function CompoundShockTester() {
  // The theatre is inherited from the active mission; typing here overrides it for this desk only.
  const mission = useMission();
  const [theatreOverride, setTheatre] = useState("");
  const theatre = theatreOverride.trim() || mission.theatre.trim();
  const [on, setOn] = useState<string[]>(["principal", "donor"]);
  useTheatreSeed("compound", (s) => setOn(s.on));
  // Desk 3 reads the live bond vector scored in Desk 1; Unlink Feed cuts the feed.
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const lb = signals.bonds;
  const liveVector = useMemo<[number, number, number, number] | undefined>(
    () => (lb ? [lb.interpersonal, lb.communal, lb.intergenerational, lb.institutional] : undefined),
    [lb?.interpersonal, lb?.communal, lb?.intergenerational, lb?.institutional] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const useLive = linked && liveVector !== undefined;

  const deficitOn = linked && signals.legitimacyDeficit === true;
  const toggle = (id: string) => setOn((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const [own, setOwn] = useState<Shock[]>([]);
  const [nl, setNl] = useState(""); const [ns, setNs] = useState(18.0); const [nb, setNb] = useState(1); const [nk, setNk] = useState("");

  // Map Sovereign Custom Mode inscribed shocks into Desk 09 Shock structures
  const inscribedShocks = useMemo<Shock[]>(() => {
    return (signals.customShocks ?? []).map((cs) => {
      const deltas = [
        cs.deltas.interpersonal,
        cs.deltas.communal,
        cs.deltas.intergenerational,
        cs.deltas.institutional,
      ];
      // Target bond = bond with the most severe negative delta
      const minD = Math.min(...deltas);
      const bIdx = deltas.indexOf(minD);
      // Derived severity ω = sum of negative deltas × 20, bounded [10, 40]
      const negSum =
        Math.abs(Math.min(0, cs.deltas.interpersonal)) +
        Math.abs(Math.min(0, cs.deltas.communal)) +
        Math.abs(Math.min(0, cs.deltas.intergenerational)) +
        Math.abs(Math.min(0, cs.deltas.institutional));
      const sev = Math.max(10, Math.min(40, Math.round(negSum * 20))) || 18;
      return {
        id: cs.id,
        label: `${cs.name} [INSCRIBED]`,
        sev,
        bond: bIdx >= 0 ? bIdx : 1,
        breaker: cs.description || "Inscribed sovereign shock stress point",
        absorb: "Inscribed sovereign shock: requires covenant protection in draft treaty.",
      };
    });
  }, [signals.customShocks]);

  const ALL = useMemo(() => [...SHOCKS, ...inscribedShocks, ...own], [inscribedShocks, own]);
  const active = ALL.filter((s) => on.includes(s.id));

  // Auto-activate freshly inscribed shocks so they immediately join the strain test
  useEffect(() => {
    if (signals.customShocks?.length) {
      const ids = signals.customShocks.map((s) => s.id);
      setOn((prev) => (ids.every((id) => prev.includes(id)) ? prev : Array.from(new Set([...prev, ...ids]))));
    }
  }, [signals.customShocks]);

  const addOwn = () => {
    if (!nl.trim()) return;
    const id = `own-${Date.now()}`;
    setOwn((p) => [...p, { id, label: nl.trim(), sev: ns, bond: nb, breaker: nk.trim() || "Provisions resting on the affected bond", absorb: "Analyst-defined shock: draft a matching counter-measure in the Clause Architect's custom provisions." }]);
    setOn((p) => [...p, id]);
    setNl(""); setNk("");
  };

  const { strain, band, bondScores, sequence, deductions, failIndex } = useMemo(() => {
    // Shared with the Shock Timeline Scrubber, so its final step always equals this reading.
    // Resource covenant: a communal share under the statutory floor adds a fixed legitimacy penalty.
    const r = compoundStress(active, useLive ? liveVector : undefined, deficitOn ? LEGITIMACY_PENALTY : 0);
    const total = r.strain;
    const b =
      total >= 70 ? "Rupture likely" : total >= 45 ? "Severe strain" : total >= 22 ? "Elevated strain" : "Absorbable";
    const seq = [...active].sort((a, b2) => b2.sev - a.sev);
    // Phi_fail = argmin_i B'_i, ties to the lower bond index.
    return {
      strain: total,
      band: b,
      bondScores: r.bondScores,
      sequence: seq,
      deductions: r.deductions,
      failIndex: r.failIndex,
    };
  }, [active, useLive, liveVector, deficitOn]);
  // The package in the order it was applied, for the temporal scrubber.
  const ordered = useMemo(() => on.map((id) => ALL.find((x) => x.id === id)).filter((x): x is Shock => !!x), [on, ALL]);

  // The provision that breaks first: in live mode, the one resting on the weakest post-shock bond.
  const breakerOn = (bond: number) => sequence.find((x) => x.bond === bond)?.breaker;
  const firstToBreak: string | undefined = !active.length
    ? undefined
    : useLive
      ? breakerOn(failIndex) ?? `Provisions resting on the ${BONDS[failIndex].toLowerCase()} bond, already the weakest on the live vector`
      : sequence[0]?.breaker;

  usePublish("shocks", {
    shocks: active.map((s) => s.label),
    // An empty string clears a stale value from the bus when no shock is applied.
    firstToBreak: firstToBreak ?? "",
    shockSeverity: strain,
  });

  const text = useMemo(() => {
    const L: string[] = [];
    L.push("COMPOUND SHOCK AND RUPTURE STRESS TEST");
    L.push("Vinculum Security, Assessment and Early Warning Division");
    L.push("");
    L.push(`THEATRE: ${theatre.trim() || "Unnamed theatre"}`);
    L.push(`SHOCKS APPLIED: ${active.length} of ${ALL.length}`);
    L.push("");
    L.push("I. COMPOUND STRAIN READING");
    L.push("");
    L.push(`Compound strain index: ${fmt(strain)} of 100`);
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
        L.push(`${i + 1}. ${s.label.toUpperCase()}  [severity ${fmt(s.sev)}, ${BONDS[s.bond]}]`);
        L.push(`   First to break: ${s.breaker}`);
        L.push(`   Absorbing mechanism: ${s.absorb}`);
        L.push("");
      });
      L.push(`Primary institutional breaker: ${sequence[0].breaker}.`);
      L.push("");
    }
    L.push("III. CONTINUUM AFTER THE SHOCKS");
    L.push("");
    if (useLive && liveVector) {
      L.push("Applied against the live bond vector scored on the diagnostic bench:");
      L.push("   B'_i = max(1.0, B_i - sum(omega_a / 10)), summed over the active shocks on each bond.");
      L.push("");
      BONDS.forEach((b, i) =>
        L.push(`   ${b}: ${liveVector[i].toFixed(1)} - ${deductions[i].toFixed(1)} = ${bondScores[i].toFixed(1)} of 5 (${bondBand(bondScores[i])})`)
      );
      L.push("");
      if (active.length) L.push(`   First provision to break (argmin B'_i): ${BONDS[failIndex]}, ${bondScores[failIndex].toFixed(1)} of 5.`, "");
    } else {
      BONDS.forEach((b, i) => L.push(`   ${b}: ${bondScores[i].toFixed(1)} of 5`));
      L.push("");
    }
    L.push("IV. STANDING NOTE");
    L.push("");
    L.push(
      "This reading is deterministic and rule-based. It models the shocks selected against fixed severities from the registered doctrine. It does not forecast, and it does not replace field judgement."
    );
    L.push("");
    L.push("END OF STRESS TEST");
    return L.join("\n");
  }, [theatre, active, strain, band, sequence, bondScores, useLive, liveVector, deductions, failIndex, ALL.length]);

  return (
    <div className="space-y-6">
    <SyncPanel
      linked={linked}
      onToggle={setLinked}
      summary={(x) =>
        x.bonds
          ? [
              `Shocks are applied to the live bond vector (${[x.bonds.interpersonal, x.bonds.communal, x.bonds.intergenerational, x.bonds.institutional].map((n) => n.toFixed(1)).join(", ")}) scored in Desk 1.`,
              "B′ᵢ = max(1.0, Bᵢ − Σ ωₐ ÷ 10); the provision on the lowest B′ is the first to break.",
            ]
          : []
      }
    />
    {linked && !liveVector && (
      <p className="text-xs text-muted-foreground">
        No bond vector is on the bus yet. Score the four bonds in Desk 1 and the shocks will be applied to that vector;
        until then this desk tests against a 5.0 baseline.
      </p>
    )}
    <div className="instrument-layout w-full min-w-0">
      <div className="space-y-6">
        <div className={panel}>
          <label className={label} htmlFor="cs-theatre">Theatre under test</label>
          <input
            id="cs-theatre"
            className={field}
            value={theatreOverride}
            onChange={(e) => setTheatre(e.target.value)}
            placeholder={mission.theatre.trim() || "Transitional settlement, year two"}
          />
          {!theatreOverride.trim() && mission.theatre.trim() && (
            <p className="mt-1.5 text-[11px] text-muted-foreground">Inherited from the active mission. Type to override on this desk.</p>
          )}
          <p className={`${label} mt-5`}>Shock packages</p>
          <div className="flex flex-wrap gap-1.5 mb-4" role="group" aria-label="Shock package presets">
            {SHOCK_PACKAGES.map((p) => (
              <button key={p.label} type="button" onClick={() => setOn(p.ids)} className="min-h-9 px-2.5 border border-brass/50 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary hover:border-accent hover:text-accent transition-colors">
                {p.label}
              </button>
            ))}
            <button type="button" onClick={() => setOn([])} className="min-h-9 px-2.5 border border-border text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground hover:text-accent">Clear</button>
          </div>
          <p className={label}>Apply shocks simultaneously</p>
          <div className="space-y-2">
            {ALL.map((s) => (
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
                    Severity {fmt(s.sev)} · {BONDS[s.bond]}
                  </span>
                </span>
              </label>
            ))}
          </div>
          <div className="mt-5 border-t border-brass/30 pt-4 space-y-2">
            <p className={label}>Custom mode: model your own shock</p>
            <input className={field} value={nl} onChange={(e) => setNl(e.target.value)} placeholder="e.g. Drought displaces pastoralist herds" />
            <input className={field} value={nk} onChange={(e) => setNk(e.target.value)} placeholder="What it breaks first (optional)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 min-w-0">
              <div className="min-w-0 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <label htmlFor="cs-sev">Severity (5.0 to 35.0)</label>
                <div className="flex items-center gap-2">
                  <input aria-label="Custom shock severity, slider" type="range" min={5} max={35} step={0.5} value={ns} onChange={(e) => setNs(round1(Number(e.target.value)))} className="min-w-0 flex-1 accent-[hsl(var(--accent))]" />
                  <input id="cs-sev" type="number" inputMode="decimal" min={5} max={35} step={0.1} value={ns}
                    onChange={(e) => { const n = parseFloat(e.target.value); if (!Number.isNaN(n)) setNs(Math.min(35, Math.max(5, round1(n)))); }}
                    className="w-16 shrink-0 bg-background border border-border px-1.5 py-1 text-center text-sm normal-case tracking-normal text-foreground" />
                </div>
              </div>
              <select className={field} value={nb} onChange={(e) => setNb(Number(e.target.value))} aria-label="Bond struck">
                {BONDS.map((b, i) => <option key={b} value={i}>{b}</option>)}
              </select>
            </div>
            <button type="button" disabled={!nl.trim()} onClick={addOwn}
              className="min-h-11 w-full border border-brass/50 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">Add and apply shock</button>
            {own.map((o) => (
              <div key={o.id} className="flex items-center justify-between gap-2 text-xs border border-border p-2">
                <span className="min-w-0 [overflow-wrap:anywhere]">{o.label}</span>
                <button type="button" className="px-2 text-muted-foreground hover:text-accent" onClick={() => { setOwn((p) => p.filter((x) => x.id !== o.id)); setOn((p) => p.filter((x) => x !== o.id)); }}>Remove</button>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Right column: strain, the shocked vector and the continuum radar. */}
      <div className="space-y-5 min-w-0">
          <div className="border border-brass/40 p-4 sm:p-5">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <p className={label}>Compound strain</p>
              <FormulaProof
                proof={compoundShockProof(
                  active.length,
                  active.reduce((acc, s) => acc + s.sev, 0),
                  active.length > 1 ? (active.length - 1) * AMPLIFY * 4 : 0,
                  deficitOn ? LEGITIMACY_PENALTY : 0,
                  strain,
                )}
              />
            <span className="font-serif text-2xl text-primary">{fmt(strain)}/100</span>
          </div>
          <div className="h-2 bg-brass/20">
            <div className="h-full bg-accent transition-all" style={{ width: `${strain}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] font-semibold text-accent">{band}</p>
          <div className="mt-2 text-[11px] font-mono tabular-nums text-muted-foreground flex items-center justify-between border-t border-border/40 pt-2">
            <span className="uppercase tracking-wider text-[10px]">Contagion Envelope:</span>
            <span className="font-semibold text-foreground">
              {ruptureShockRadiusNm(strain).toLocaleString()} NM reach
            </span>
          </div>
         </div>
        {useLive && liveVector && (
          <div className="border border-brass/40 bg-background p-5 min-w-0">
            <p className={label}>Live vector after shock · B′ᵢ = max(1.0, Bᵢ − Σ ωₐ ÷ 10)</p>
            <div className="mt-3 w-full max-w-full min-w-0 overflow-x-auto">
              <table className="w-full min-w-[22rem] border-collapse text-xs">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    <th className="py-1.5 pr-2 font-semibold">Bond</th>
                    <th className="py-1.5 px-2 font-semibold text-right">Bᵢ</th>
                    <th className="py-1.5 px-2 font-semibold text-right">− Σ ωₐ ÷ 10</th>
                    <th className="py-1.5 pl-2 font-semibold text-right">B′ᵢ</th>
                  </tr>
                </thead>
                <tbody>
                  {BONDS.map((b, i) => {
                    const fails = active.length > 0 && i === failIndex;
                    return (
                      <tr key={b} className={`border-t border-border ${fails ? "bg-terracotta/10 font-semibold" : ""}`}>
                        <td className="py-1.5 pr-2 text-foreground/90">
                          {b}
                          {fails && <span className="ml-2 text-[9px] uppercase tracking-[0.14em] text-terracotta">Breaks first</span>}
                        </td>
                        <td className="py-1.5 px-2 text-right font-mono tabular-nums">{liveVector[i].toFixed(1)}</td>
                        <td className="py-1.5 px-2 text-right font-mono tabular-nums">−{deductions[i].toFixed(1)}</td>
                        <td className="py-1.5 pl-2 text-right font-mono tabular-nums text-accent">
                          {bondScores[i].toFixed(1)} <span className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{bondBand(bondScores[i])}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {active.length > 0 && (
              <p className="mt-3 text-xs text-foreground/85">
                Φ_fail = argmin B′ᵢ = <span className="font-semibold">{BONDS[failIndex]}</span> at {bondScores[failIndex].toFixed(1)}.
              </p>
            )}
          </div>
        )}

        <BondRadar scores={bondScores} caption={useLive ? "Live continuum after the applied shocks" : "Continuum after the applied shocks"} />


      </div>

    </div>
      <div className="w-full min-w-0">
        <ShockTimelineScrubber
          title="Shock timeline · sequential fracture playback"
          steps={compoundTimeline(signals, ordered, useLive ? liveVector : undefined, deficitOn ? LEGITIMACY_PENALTY : 0)}
          note="Shocks in the order applied. Bonds and strain follow this desk; R follows the Sentinel rule, where only inscribed shocks add load; λ uses the exposure U carried from Desk 12."
        />
      </div>
      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={text} fileName="Vinculum-Compound-Stress-Test" />
      </div>
    </div>
  );
}
