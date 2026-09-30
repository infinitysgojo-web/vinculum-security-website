import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

/** Handbook §12 Continuity Provision drafting desk. Deterministic; nothing stored. */
const AGREEMENTS = [
  { id: "power", label: "National power-sharing accord", party: "the Parties to this Accord", precedent: "Kenya (2008 National Accord) and Northern Ireland (1998 Agreement)" },
  { id: "ceasefire", label: "Inter-communal ceasefire and disengagement", party: "the Signatory Communities", precedent: "Liberia (2003 Accra Agreement)" },
  { id: "border", label: "Cross-border or resource protocol", party: "the Contracting States", precedent: "Tuvalu and Kiribati (climate mobility and statehood)" },
  { id: "transition", label: "Civil-military transition compact", party: "the Transitional Authorities", precedent: "Colombia (2016 Final Agreement) and Cambodia (1991 Paris Accords)" },
] as const;

const FRAGILITIES = [
  {
    id: "personal",
    label: "Elite personalisation",
    clause: "Every obligation assumed under this instrument attaches to the office held by the signatory and not to the person of the signatory. Upon any change of officeholder, whether by election, appointment, resignation, removal or death, the incoming officeholder shall be bound by every undertaking in force, without novation, ratification or further act.",
    note: "Counters the Elite-Pact Mirage: accords held together by personal trust between principals dissolve at the first transition.",
  },
  {
    id: "generational",
    label: "Intergenerational alienation",
    clause: "A Standing Intergenerational Review shall be constituted, not less than one third of whose members are drawn from the successor generation of each affected community and selected by that community. The Review shall report on implementation at intervals not exceeding twelve months, and no review cycle shall be tied to the budget or electoral cycle of any Party.",
    note: "Counters the Generational Cliff: youth participation that ends with the session is attendance, not standing.",
  },
  {
    id: "atrophy",
    label: "Institutional atrophy",
    clause: "The implementing bodies established under this instrument shall be constituted by statutory instrument within ninety days of signature, shall hold budgets protected from reallocation without the consent of the Joint Implementation Commission, and shall publish a handover file on every change of senior personnel.",
    note: "Counters Unanchored Repair: communal reconciliation without an institutional anchor has nowhere to settle.",
  },
  {
    id: "theater",
    label: "Performative compliance",
    clause: "Compliance shall be assessed by outcome and not by process. For each consultation relied upon as evidence of compliance, the reporting Party shall identify at least one decision altered by that consultation. Where no altered decision can be identified for two successive reporting periods, the Independent Verifier shall issue a finding of non-compliance and the benefits enumerated in the Schedule shall be suspended until remedied.",
    note: "Counters Bond Theater: consultation that changes nothing is a record of process, not of repair.",
  },
] as const;

export default function ClauseArchitect() {
  const [ag, setAg] = useState(0);
  const [picked, setPicked] = useState<number[]>([0, 3]);
  const [title, setTitle] = useState("");

  const toggle = (i: number) =>
    setPicked((p) => (p.includes(i) ? (p.length > 1 ? p.filter((x) => x !== i) : p) : [...p, i].sort()));

  const text = useMemo(() => {
    const a = AGREEMENTS[ag];
    const L: string[] = [];
    L.push("CONTINUITY PROVISIONS · DRAFT FOR NEGOTIATION");
    L.push("Compiled under Vinculum Diplomacy: The Practitioner Handbook, Section 12");
    L.push("");
    L.push(`INSTRUMENT: ${title.trim() || a.label}`);
    L.push(`AGREEMENT TYPE: ${a.label}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push("");
    L.push("PART C · CONTINUITY OF COMMITMENT");
    L.push("");
    picked.forEach((i, n) => {
      const f = FRAGILITIES[i];
      L.push(`Article C.${n + 1} (${f.label})`);
      L.push(`  ${f.clause.replace("this instrument", `this instrument between ${a.party}`)}`);
      L.push(`  Commentary: ${f.note}`);
      L.push("");
    });
    L.push(`Article C.${picked.length + 1} (Independent verification)`);
    L.push(`  An Independent Verifier, appointed jointly and not removable by any single Party, shall verify the Articles of this Part. No Party's account of its own compliance shall be treated as self-certifying.`);
    L.push("");
    L.push(`Article C.${picked.length + 2} (Survival)`);
    L.push("  This Part shall survive any change in the officeholders who negotiated, signed or conceded it, and may be amended only by the procedure that adopted it.");
    L.push("");
    L.push(`PRECEDENT OF RECORD: ${a.precedent}.`);
    L.push("");
    L.push("Drafting aid only. Compiled deterministically from the doctrine; not legal advice. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [ag, picked, title]);

  return (
    <section className={panel}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div>
            <label className={label} htmlFor="ca-title">Instrument title (optional)</label>
            <input id="ca-title" className={field} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Accord on Northern Rift Disengagement" />
          </div>
          <div>
            <label className={label} htmlFor="ca-ag">Agreement type</label>
            <select id="ca-ag" className={field} value={ag} onChange={(e) => setAg(Number(e.target.value))}>
              {AGREEMENTS.map((a, i) => <option key={a.id} value={i}>{a.label}</option>)}
            </select>
          </div>
          <div>
            <span className={label}>Fragilities to insulate against</span>
            <div className="space-y-2">
              {FRAGILITIES.map((f, i) => (
                <label key={f.id} className="flex gap-3 items-start border border-border bg-background p-3 cursor-pointer text-sm">
                  <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={picked.includes(i)} onChange={() => toggle(i)} />
                  <span><span className="font-semibold text-primary">{f.label}</span><span className="block text-muted-foreground text-xs mt-1">{f.note}</span></span>
                </label>
              ))}
            </div>
          </div>
        </div>
        <DeskOutput text={text} fileName="Vinculum-Continuity-Provisions" />
      </div>
    </section>
  );
}
