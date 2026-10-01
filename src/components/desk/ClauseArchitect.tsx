import { useEffect, useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";
import { useEngine, usePublish, hasSignal, telemetryLines } from "./engine";
import SyncPanel from "./SyncPanel";

/** Handbook §12 Continuity Provision drafting desk. Deterministic; nothing stored. */
const AGREEMENTS = [
  { id: "power", label: "National power-sharing accord", party: "the Parties to this Accord", precedent: "Kenya (2008 National Accord) and Northern Ireland (1998 Agreement)" },
  { id: "ceasefire", label: "Inter-communal ceasefire and disengagement", party: "the Signatory Communities", precedent: "Liberia (2003 Accra Agreement)" },
  { id: "border", label: "Cross-border or resource protocol", party: "the Contracting States", precedent: "Tuvalu and Kiribati (climate mobility and statehood)" },
  { id: "transition", label: "Civil-military transition compact", party: "the Transitional Authorities", precedent: "Colombia (2016 Final Agreement) and Cambodia (1991 Paris Accords)" },
  { id: "maritime", label: "Maritime and resource boundary protocol", party: "the Coastal States Parties", precedent: "Tuvalu and Kiribati (maritime baselines and statehood permanence)" },
  { id: "demob", label: "Ceasefire and demobilisation compact", party: "the Armed Parties and the State", precedent: "Liberia (2003 disarmament sequencing) and Colombia (2016 laying down of arms)" },
  { id: "charter", label: "Constitutional interim charter", party: "the Constituent Parties", precedent: "South Africa (1993 Interim Constitution) and Kenya (2008 Agenda Four)" },
  { id: "reparations", label: "Post-conflict reparations treaty", party: "the State and the Represented Communities", precedent: "Rwanda (Gacaca and reparation architecture) and Cambodia (victim participation)" },
] as const;

const RIGOUR = [
  {
    id: "strict",
    label: "Strict enforcement",
    article: "Any finding of non-compliance by the Independent Verifier shall take effect automatically upon publication, without further decision of the Parties, and shall suspend the benefits enumerated in the Schedule until the finding is discharged by the Verifier.",
    note: "Automatic effect removes the veto a non-compliant Party would otherwise hold over its own sanction.",
  },
  {
    id: "mediated",
    label: "Structured mediation",
    article: "Any finding of non-compliance by the Independent Verifier shall be referred to the Joint Implementation Commission, which shall convene within twenty-one days and shall record, in writing, either the remedial schedule agreed or the failure to agree. Failure to convene within the period shall itself be recorded as non-compliance.",
    note: "Preserves negotiation space while making the failure to negotiate itself a recorded breach.",
  },
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
  {
    id: "asymmetric",
    label: "Asymmetric verification",
    clause: "No Party shall verify its own compliance, nor shall any Party appoint, fund, house or remove the body that verifies it. The Independent Verifier shall hold unannounced access to the records and premises of every Party on equal terms, and any access granted to one Party's records shall be granted to all.",
    note: "Counters the Non-Self-Assessment failure: verification controlled by the verified party reports only what that party already concedes.",
  },
  {
    id: "exhaustion",
    label: "Temporal exhaustion",
    clause: "The obligations under this instrument are of indefinite duration and shall not lapse by reason of the passage of time, the completion of a funding cycle, or the absence of reported incident. Any proposal to conclude implementation shall be tabled in writing, shall state the evidence of durable repair relied upon, and shall be verified before it takes effect.",
    note: "Counters the quiet expiry of settlements that are declared finished because attention, not the grievance, has run out.",
  },
] as const;

const MATRIX = [
  ["Ceasefire bound to the signatories", "Continuity provision binding the offices they hold", "Northern Ireland: institutions survived repeated changes of First Minister."],
  ["Elite power-sharing between principals", "Intergenerational standing mechanism with binding referral", "Kenya 2008: the Accord held the principals; the youth bond stayed unrepaired."],
  ["Self-reported compliance by the parties", "Independent verifier no party can appoint or remove", "Colombia: verification carried the accord through a rejected referendum."],
  ["Consultation measured by meetings held", "Outcome test: which decision changed because of it", "Liberia: Palava Hut hearings mattered where they altered local settlement."],
  ["Fixed term that expires with the mandate", "Indefinite duration ending only on a verified conclusion test", "Cambodia: a tribunal outlasted attention but not its narrow mandate."],
  ["Sanction by consensus of the parties", "Automatic suspension of benefits on a finding of breach", "Rwanda: community-level obligation did not wait for the offender's consent."],
] as const;

type Own = { id: string; label: string; clause: string; note: string };

/** Scaffolds a continuity clause from a plain requirement, deterministically. */
function scaffold(requirement: string, partyName: string, verifier: string) {
  const r = requirement.trim().replace(/\.$/, "");
  return `The Parties undertake that ${r.charAt(0).toLowerCase() + r.slice(1)}. This undertaking attaches to the offices held by the signatories and not to their persons, shall bind every successor officeholder without further act, shall be reported upon at intervals not exceeding twelve months, and shall be verified by ${verifier}, which no Party to this instrument may appoint, fund, house or remove. Where ${partyName} cannot identify a decision altered in compliance with this Article across two successive reporting periods, the failure shall be recorded as non-compliance.`;
}

export default function ClauseArchitect() {
  const [ag, setAg] = useState(0);
  const [picked, setPicked] = useState<number[]>([0, 3]);
  const [title, setTitle] = useState("");
  const [parties, setParties] = useState("");
  const [office, setOffice] = useState("");
  const [rig, setRig] = useState(0);
  // Custom mode: the practitioner's own agreement type and own drafted requirements.
  const [ownType, setOwnType] = useState("");
  const [own, setOwn] = useState<Own[]>([]);
  const [oLabel, setOLabel] = useState("");
  const [oText, setOText] = useState("");

  // Division I and II decide which fragilities this instrument must insulate against.
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const live = linked && hasSignal(signals);
  const mandated = useMemo(() => {
    if (!live) return [] as number[];
    const need = new Set<number>();
    const trapMap: Record<string, number[]> = {
      "Elite-Pact Mirage": [0],
      "Generational Cliff": [1],
      "Unanchored Repair": [2],
      "Bond Theater": [3],
      "Systemic Bond Collapse": [0, 2, 4],
    };
    (signals.traps ?? []).forEach((t) => (trapMap[t] ?? []).forEach((i) => need.add(i)));
    const bondMap: Record<string, number> = {
      Interpersonal: 0,
      Communal: 3,
      Intergenerational: 1,
      "Institutional-Relational": 2,
    };
    if (signals.weakestBond && (signals.weakestScore ?? 5) <= 3) {
      const i = bondMap[signals.weakestBond];
      if (i !== undefined) need.add(i);
    }
    if ((signals.rupture ?? 0) >= 35) need.add(4);
    if (signals.elitePactAlert) need.add(0);
    if ((signals.shocks?.length ?? 0) >= 2) need.add(5);
    return [...need].sort((a, b) => a - b);
  }, [live, signals]);

  useEffect(() => {
    if (!mandated.length) return;
    setPicked((p) => [...new Set([...p, ...mandated])].sort((a, b) => a - b));
  }, [mandated]);
  const addOwn = () => {
    const l = oLabel.trim();
    if (!l) return;
    setOwn((p) => [...p, { id: `o${Date.now()}`, label: l, clause: oText.trim(), note: "Own requirement, drafted on the same continuity rule: the office is bound, not the officeholder." }]);
    setOLabel("");
    setOText("");
  };
  const dropOwn = (id: string) => setOwn((p) => p.filter((x) => x.id !== id));

  const toggle = (i: number) =>
    setPicked((p) => (p.includes(i) ? (p.length > 1 ? p.filter((x) => x !== i) : p) : [...p, i].sort((a, b) => a - b)));


  const text = useMemo(() => {
    const a = AGREEMENTS[ag];
    const partyName = parties.trim() || a.party;
    const verifier = office.trim() || "the Independent Verifier";
    const L: string[] = [];
    L.push("CONTINUITY PROVISIONS · DRAFT FOR NEGOTIATION");
    L.push("Compiled under Vinculum Diplomacy: The Practitioner Handbook, Section 12");
    L.push("");
    L.push(`INSTRUMENT: ${title.trim() || a.label}`);
    L.push(`AGREEMENT TYPE: ${ownType.trim() || a.label}${ownType.trim() ? " (own classification)" : ""}`);
    L.push(`PARTIES: ${partyName}`);
    L.push(`VERIFYING BODY: ${verifier}`);
    L.push(`ENFORCEMENT POSTURE: ${RIGOUR[rig].label}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push("");
    L.push("PART C · CONTINUITY OF COMMITMENT");
    L.push("");
    let n = 0;
    picked.forEach((i) => {
      const f = FRAGILITIES[i];
      const body = f.clause
        .replace("this instrument", `this instrument between ${partyName}`)
        .replace(/the Independent Verifier/g, verifier);
      n += 1;
      L.push(`Article C.${n} (${f.label})`);
      L.push(`  ${body}`);
      L.push(`  Commentary: ${f.note}`);
      L.push("");
    });
    own.forEach((o) => {
      n += 1;
      L.push(`Article C.${n} (${o.label})`);
      L.push(`  ${o.clause || scaffold(o.label, partyName, verifier)}`);
      L.push(`  Commentary: ${o.note}`);
      L.push("");
    });
    L.push(`Article C.${n + 1} (Independent verification)`);
    L.push(`  ${verifier}, appointed jointly by ${partyName} and not removable by any single Party, shall verify the Articles of this Part. No Party's account of its own compliance shall be treated as self-certifying.`);
    L.push("");
    L.push(`Article C.${n + 2} (Consequence of non-compliance)`);
    L.push(`  ${RIGOUR[rig].article.replace(/the Independent Verifier/g, verifier)}`);
    L.push(`  Commentary: ${RIGOUR[rig].note}`);
    L.push("");
    L.push(`Article C.${n + 3} (Survival)`);
    L.push("  This Part shall survive any change in the officeholders who negotiated, signed or conceded it, and may be amended only by the procedure that adopted it.");
    L.push("");
    L.push(`PRECEDENT OF RECORD: ${a.precedent}.`);
    L.push("");
    L.push("Drafting aid only. Compiled deterministically from the doctrine; not legal advice. Kenya Copyright Board Registration No. RZ100967.");
    return L.join("\n");
  }, [ag, picked, title, parties, office, rig, own, ownType]);


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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <label className={label} htmlFor="ca-p">Named parties (optional)</label>
              <input id="ca-p" className={field} value={parties} onChange={(e) => setParties(e.target.value)} placeholder={AGREEMENTS[ag].party} />
            </div>
            <div className="min-w-0">
              <label className={label} htmlFor="ca-o">Verifying body (optional)</label>
              <input id="ca-o" className={field} value={office} onChange={(e) => setOffice(e.target.value)} placeholder="the Independent Verifier" />
            </div>
          </div>
          <div>
            <span className={label}>Enforcement posture</span>
            <div className="grid grid-cols-2 gap-2">
              {RIGOUR.map((x, i) => (
                <button key={x.id} type="button" aria-pressed={rig === i} onClick={() => setRig(i)}
                  className={`min-h-11 px-3 py-2 border text-[10px] font-semibold uppercase tracking-[0.14em] ${rig === i ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                  {x.label}
                </button>
              ))}
            </div>
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

          <div className="border border-brass/40 bg-background p-4">
            <span className={label}>Your own agreement type (optional)</span>
            <input className={field} value={ownType} onChange={(e) => setOwnType(e.target.value)} placeholder="e.g. Inter-county water and pasture compact" />
            <span className={`${label} mt-5`}>Your own clause requirement</span>
            <p className="text-xs text-muted-foreground mb-3">
              Name what the clause must achieve. Leave the drafting box empty and the requirement is
              written up on the same continuity rule: the office is bound, not the officeholder.
            </p>
            <input
              className={`${field} mb-2`}
              value={oLabel}
              onChange={(e) => setOLabel(e.target.value)}
              placeholder="e.g. Grazing access is reviewed with both councils every dry season"
            />
            <textarea
              className={`${field} min-h-24`}
              value={oText}
              onChange={(e) => setOText(e.target.value)}
              placeholder="Optional: paste or type your own operative wording instead."
            />
            <button type="button" onClick={addOwn} disabled={!oLabel.trim()} className="mt-2 min-h-11 border border-brass/50 px-4 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">
              Add article
            </button>
            {own.length > 0 && (
              <ul className="mt-4 space-y-2">
                {own.map((o) => (
                  <li key={o.id} className="flex items-start gap-3 text-sm border-t border-border pt-2">
                    <span className="flex-1 text-foreground/85">{o.label}</span>
                    <button type="button" onClick={() => dropOwn(o.id)} className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-accent">Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <DeskOutput text={text} fileName="Vinculum-Continuity-Provisions" />
      </div>
          <div className="mt-10">
        <span className={label}>Westphalian and relational clauses compared</span>
        <p className="text-xs text-muted-foreground mb-3">Counter-positions for when an opposing delegation proposes a fragile clause.</p>
        <div className="overflow-x-auto border border-border bg-background">
          <table className="w-full min-w-[40rem] text-sm">
            <thead>
              <tr className="border-b border-brass/40 text-left">
                <th className="p-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-muted-foreground">Conventional clause</th>
                <th className="p-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">Relational counter-clause</th>
                <th className="p-3 text-[10px] uppercase tracking-[0.18em] font-semibold text-accent">Record</th>
              </tr>
            </thead>
            <tbody>
              {MATRIX.map(([a, b, c]) => (
                <tr key={a} className="border-b border-border last:border-0 align-top">
                  <td className="p-3 text-foreground/70">{a}</td>
                  <td className="p-3 font-serif text-base text-primary leading-snug">{b}</td>
                  <td className="p-3 text-xs text-muted-foreground">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
