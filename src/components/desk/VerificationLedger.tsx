import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";
import { useMission } from "./mission";
import SyncPanel from "./SyncPanel";
import { telemetryLines, useEngine, usePublish, type Signals } from "./engine";

/** Covenant anchoring: every covenant drafted upstream becomes a line to verify. */
function ledgerLines(s: Signals): string[] {
  const L: string[] = [];
  (s.covenants ?? []).forEach((c, i) => L.push(`  V-${i + 1}. ${c}: verify the provision is in force and observed, with evidence from an independent source.`));
  if (s.weakestBond) L.push(`  Priority verification: the ${s.weakestBond.toLowerCase()} bond, the most exposed on the diagnostic bench.`);
  if (s.firstToBreak) L.push(`  Watch item: ${s.firstToBreak}, the first provision to break under compound shock.`);
  return L.length ? ["COVENANT-ANCHORED VERIFICATION LINES (live from the mission engine)", ...L] : [];
}


/**
 * Independent verification and compliance ledger, Section VIII safeguards and
 * Handbook §12E. Deterministic: the desk seats verifiers, fixes reporting
 * intervals, and applies the three abuse-resistance safeguards of record.
 */

type Verifier = { id: string; label: string; standing: string; conflict: string };

const VERIFIERS: Verifier[] = [
  {
    id: "civil",
    label: "Independent civil society monitor",
    standing: "Standing rests on independence from both the state and the funding party.",
    conflict: "Declare every funding relationship with a party to the agreement before the first report.",
  },
  {
    id: "elders",
    label: "Elder or customary verification council",
    standing: "Gradational evidentiary weight. Standing granted by the table is not standing granted by the community.",
    conflict: "Do not route legitimacy for an armed party through elder endorsement.",
  },
  {
    id: "youth",
    label: "Successor-generation verification panel",
    standing: "Verifies that youth participation is a vote, not attendance.",
    conflict: "A panel seated for one funding cycle cannot verify a settlement meant to outlive it.",
  },
  {
    id: "guarantor",
    label: "External guarantor or treaty body",
    standing: "Carries enforcement reach but not communal standing.",
    conflict: "Guarantor findings require a communal counter-report before they are treated as settled.",
  },
  {
    id: "ombuds",
    label: "Statutory ombuds or human rights commission",
    standing: "Institutional standing, provided its budget and appointments survive a change of office.",
    conflict: "An office appointed by one party to the agreement is not independent of that party.",
  },
  {
    id: "technical",
    label: "Technical or ceasefire monitoring mission",
    standing: "Verifies facts on the ground, not the quality of the relationship.",
    conflict: "Technical compliance is not relational compliance. Do not let one stand in for the other.",
  },
];

const OBLIGATIONS = [
  { id: "o1", text: "Published undertakings matched word for word against what was given at the table" },
  { id: "o2", text: "Named offices, not named officeholders, recorded as the obligation holder" },
  { id: "o3", text: "Successor-generation seats filled, with votes recorded" },
  { id: "o4", text: "Communal consultation outcomes published, including recorded dissent" },
  { id: "o5", text: "Budget lines for the mechanism appropriated beyond the current cycle" },
  { id: "o6", text: "Remedies available to a complainant who is not a party to the agreement" },
  { id: "o7", text: "Reporting intervals met without extension requests" },
  { id: "o8", text: "Verifier access granted without prior notice conditions" },
];

const INTERVALS = [
  { id: "30", label: "Every 30 days", note: "Appropriate in the first two quarters, or wherever a ceasefire is in force." },
  { id: "90", label: "Quarterly", note: "The standing interval once the first two quarters are clear." },
  { id: "180", label: "Twice yearly", note: "Permissible only where four consecutive reports were met in full." },
];

const SAFEGUARDS = [
  {
    name: "Delay-justification counter",
    text: "A state's own account of why compliance is delayed is a low institutional signal, not evidence. Record the claim, and record that it was not verified.",
  },
  {
    name: "Dissident-delegitimization counter",
    text: "A bond finding is never applied against an individual's right to speak. Weak communal standing is a finding about a claim to represent, never a ground to silence.",
  },
  {
    name: "R2P trigger precedence",
    text: "A factual atrocity trigger supersedes every bond reading in this ledger. Nothing recorded here delays or conditions a protection obligation.",
  },
];

export default function VerificationLedger() {
  const mission = useMission();
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const engineLines = linked ? ledgerLines(signals) : [];
  
  const [instrument, setInstrument] = useState("");
  const [seated, setSeated] = useState<string[]>(["civil", "youth"]);
  const [met, setMet] = useState<string[]>([]);
  const [interval, setInterval] = useState("90");
  usePublish("verification", { verifierSeated: seated.length > 0 });

  const toggle = (set: string[], id: string, fn: (v: string[]) => void) =>
    fn(set.includes(id) ? set.filter((x) => x !== id) : [...set, id]);

  const r = useMemo(() => {
    const rate = Math.round((met.length / OBLIGATIONS.length) * 100);
    const band =
      rate >= 85 ? "Compliant" : rate >= 60 ? "Partially compliant" : rate >= 35 ? "Deficient" : "Non-compliant";
    const escalation =
      rate >= 85
        ? "Maintain the interval. Record the clear reports and keep the mechanism funded."
        : rate >= 60
          ? "Shorten the reporting interval by one band and require a written remediation plan at the next report."
          : rate >= 35
            ? "Convene the guarantor and the communal monitor jointly. Suspend any further concession until the outstanding obligations are met."
            : "Treat the mechanism as failed in practice. Refer the instrument back to the drafting table and record the failure publicly.";
    const independence =
      seated.filter((s) => s === "civil" || s === "elders" || s === "youth").length === 0
        ? "No independent communal verifier is seated. Verification currently rests on parties with an interest in the finding."
        : seated.includes("youth")
          ? "A successor-generation panel is seated, which is the thinnest and most often omitted leg of verification."
          : "No successor-generation panel is seated. The generational cliff is unverified.";
    return { rate, band, escalation, independence };
  }, [met, seated]);

  const text = useMemo(() => {
    const L: string[] = [];
    L.push("INDEPENDENT VERIFICATION AND COMPLIANCE LEDGER");
    L.push("Compiled under Section VIII safeguards and Handbook Section 12E");
    L.push("");
    L.push(`INSTRUMENT: ${instrument.trim() || `${mission.theatre.trim() || "Mission"} Verification Protocol`}`);
    L.push(`MISSION: ${mission.theatre.trim() || "No active mission named"}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push(`REPORTING INTERVAL: ${INTERVALS.find((i) => i.id === interval)!.label}`);
    L.push("");
    L.push("I. VERIFIERS SEATED");
    L.push("");
    if (!seated.length) {
      L.push("   No verifier seated. The instrument is self-reported and therefore unverified.");
      L.push("");
    } else {
      seated.forEach((id, i) => {
        const v = VERIFIERS.find((x) => x.id === id)!;
        L.push(`${i + 1}. ${v.label.toUpperCase()}`);
        L.push(`   Standing: ${v.standing}`);
        L.push(`   Conflict rule: ${v.conflict}`);
        L.push("");
      });
    }
    L.push("II. COMPLIANCE LEDGER");
    L.push("");
    OBLIGATIONS.forEach((o) => L.push(`   [${met.includes(o.id) ? "x" : " "}] ${o.text}`));
    L.push("");
    L.push(`   Compliance rate: ${r.rate} per cent of ${OBLIGATIONS.length} obligations of record`);
    L.push(`   Band: ${r.band}`);
    L.push("");
    L.push("III. INDEPENDENCE READING");
    L.push("");
    L.push(`   ${r.independence}`);
    L.push("");
    L.push("IV. ESCALATION DIRECTIVE");
    L.push("");
    L.push(`   ${r.escalation}`);
    L.push(`   Interval note: ${INTERVALS.find((i) => i.id === interval)!.note}`);
    L.push("");
    L.push("V. STANDING SAFEGUARDS");
    L.push("");
    SAFEGUARDS.forEach((s, i) => {
      L.push(`${i + 1}. ${s.name.toUpperCase()}`);
      L.push(`   ${s.text}`);
      L.push("");
    });
    if (engineLines.length) L.push(...engineLines, "");
    if (linked) L.push(...telemetryLines(signals));
    L.push("Rule-based ledger. Nothing entered here is stored or transmitted. Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    L.push("");
    L.push("END OF LEDGER");
    return L.join("\n");
  }, [instrument, mission, seated, met, interval, r, engineLines, linked, signals]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 w-full min-w-0 [&>*]:min-w-0">
      <div className="space-y-6">
        <div className={panel}>
          <label className={label} htmlFor="vl-i">Instrument under verification</label>
          <input
            id="vl-i"
            className={`${field} text-base sm:text-sm min-h-11`}
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            placeholder="Transitional security protocol, Article 9"
          />

          <p className={`${label} mt-5`}>Verifiers seated</p>
          <div className="space-y-2">
            {VERIFIERS.map((v) => (
              <label key={v.id} className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={seated.includes(v.id)}
                  onChange={() => toggle(seated, v.id, setSeated)}
                  className="mt-1 accent-[hsl(var(--accent))]"
                />
                <span className="flex-1 text-foreground/90">{v.label}</span>
              </label>
            ))}
          </div>

          <label className={`${label} mt-5`} htmlFor="vl-int">Reporting interval</label>
          <select
            id="vl-int"
            className={`${field} text-base sm:text-sm min-h-11`}
            value={interval}
            onChange={(e) => setInterval(e.target.value)}
          >
            {INTERVALS.map((i) => (
              <option key={i.id} value={i.id}>{i.label}</option>
            ))}
          </select>
        </div>

        <div className="border border-brass/40 p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className={label}>Compliance</p>
            <span className="font-serif text-2xl text-primary">{r.rate}%</span>
          </div>
          <div className="h-2 bg-brass/20">
            <div className="h-full bg-accent transition-all" style={{ width: `${r.rate}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] font-semibold text-accent">{r.band}</p>
          <div className="mt-4 space-y-2">
            {OBLIGATIONS.map((o) => (
              <label key={o.id} className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={met.includes(o.id)}
                  onChange={() => toggle(met, o.id, setMet)}
                  className="mt-1 accent-[hsl(var(--accent))]"
                />
                <span className="flex-1 text-foreground/90">{o.text}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <SyncPanel linked={linked} onToggle={setLinked} summary={() => engineLines.length ? engineLines.slice(1).map((x) => x.trim()) : ["The upstream reading carries no covenant to verify yet."]} />

      <DeskOutput text={text} fileName="Vinculum-Verification-Ledger" />
    </div>
  );
}
