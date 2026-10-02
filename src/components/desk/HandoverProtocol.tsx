import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";
import { useMission } from "./mission";
import SyncPanel from "./SyncPanel";
import { telemetryLines, useEngine, bondBand, type Signals } from "./engine";

/** Bond restoration gate: handover is premature while any bond still fails. */
function handoverLines(s: Signals): string[] {
  const L: string[] = [];
  if (s.weakestBond && s.weakestScore !== undefined && bondBand(s.weakestScore) === "Failing")
    L.push(`  HANDOVER PREMATURE: the ${s.weakestBond.toLowerCase()} bond still reads ${s.weakestScore.toFixed(1)} of 5 (Failing). Restore it to the Fragile band (2.1) or above, and ideally Viable (3.1), before the mandate passes.`);
  if (s.rupture !== undefined && s.rupture >= 35)
    L.push(`  HANDOVER PREMATURE: rupture index at ${s.rupture} per cent. Hand over only once it falls below 35.`);
  if (s.covenants?.length)
    L.push(`  Successor office inherits these covenants: ${s.covenants.join("; ")}.`);
  if (s.gatesCleared) L.push(`  Readiness lifecycle stages cleared: ${s.gatesCleared}.`);
  return L.length ? ["BOND RESTORATION GATE (live from the mission engine)", ...L] : [];
}


/**
 * Mandate handover and durability protocol, Section VI.B and Handbook §12D.
 * Deterministic: tests whether a settlement has taken root locally or still
 * rests on external presence, and drafts the handover instrument.
 */

type Test = { id: string; group: string; text: string; weight: number; critical?: boolean };

const TESTS: Test[] = [
  { id: "t1", group: "Institutional root", text: "The mechanism has a statutory basis that does not expire with the mandate", weight: 12, critical: true },
  { id: "t2", group: "Institutional root", text: "A named permanent local office holds the obligation, not a mission post", weight: 11, critical: true },
  { id: "t3", group: "Institutional root", text: "Appointments to that office survive a change of government", weight: 8 },
  { id: "t4", group: "Funding durability", text: "The mechanism is funded from a domestic appropriation, not a donor line", weight: 11, critical: true },
  { id: "t5", group: "Funding durability", text: "Funding is appropriated for at least two cycles beyond handover", weight: 7 },
  { id: "t6", group: "Verification continuity", text: "An independent verifier remains seated after the external presence leaves", weight: 10, critical: true },
  { id: "t7", group: "Verification continuity", text: "Verification reports continue to a public record, not only to the mission", weight: 7 },
  { id: "t8", group: "Communal standing", text: "Communities can name the local office they would approach with a complaint", weight: 8 },
  { id: "t9", group: "Communal standing", text: "Recorded dissent from the consultation has a standing route to remedy", weight: 6 },
  { id: "t10", group: "Successor generation", text: "Successor-generation seats are filled and voting, not observing", weight: 9, critical: true },
  { id: "t11", group: "Successor generation", text: "A transfer of knowledge from elders to successors is recorded and verified", weight: 5 },
  { id: "t12", group: "Dispute continuity", text: "A dispute route exists that does not require the departing facilitator", weight: 6 },
];

const GROUPS = Array.from(new Set(TESTS.map((t) => t.group)));
const TOTAL = TESTS.reduce((a, t) => a + t.weight, 0);

const DEPENDENCE = [
  { id: "d1", label: "Facilitator chairs the standing body", text: "Replace the chair with a rotating local chair before departure, and record the first two rotations." },
  { id: "d2", label: "External budget pays core salaries", text: "Transfer the salary line to a domestic appropriation. A settlement on a donor payroll ends with the donor." },
  { id: "d3", label: "Parties speak to each other only through the mission", text: "Open a direct channel of record and run it for one full reporting interval before handover." },
  { id: "d4", label: "Verification data is held on mission systems", text: "Transfer the record to the local verifier in full, and confirm it is readable without mission access." },
  { id: "d5", label: "Security guarantees rest on external presence", text: "Record openly that the guarantee ends with the presence. Do not let the text imply otherwise." },
];

export default function HandoverProtocol() {
  const mission = useMission();
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const engineLines = linked ? handoverLines(signals) : [];
  const [mandate, setMandate] = useState("");
  const [successor, setSuccessor] = useState("");
  const [cleared, setCleared] = useState<string[]>([]);
  const [deps, setDeps] = useState<string[]>([]);

  const toggle = (set: string[], id: string, fn: (v: string[]) => void) =>
    fn(set.includes(id) ? set.filter((x) => x !== id) : [...set, id]);

  const r = useMemo(() => {
    const scored = TESTS.filter((t) => cleared.includes(t.id)).reduce((a, t) => a + t.weight, 0);
    const base = Math.round((scored / TOTAL) * 100);
    const penalty = deps.length * 7;
    const durability = Math.max(0, base - penalty);
    const openCritical = TESTS.filter((t) => t.critical && !cleared.includes(t.id));
    const band = openCritical.length
      ? "Handover withheld"
      : durability >= 80
        ? "Handover cleared"
        : durability >= 60
          ? "Conditional handover"
          : "Handover withheld";
    const directive = openCritical.length
      ? `Handover is withheld. ${openCritical.length} critical test${openCritical.length === 1 ? " remains" : "s remain"} open. A settlement that cannot survive the departure is not ready for it.`
      : durability >= 80
        ? "Handover is cleared. Record the instrument, fix the first post-handover reporting date, and depart on the recorded date."
        : durability >= 60
          ? "Handover may proceed on condition. Fix a residual review at the next reporting interval and name who returns if the condition fails."
          : "Handover is withheld. The settlement still rests on the external presence rather than on local offices.";
    return { base, penalty, durability, openCritical, band, directive };
  }, [cleared, deps]);

  const text = useMemo(() => {
    const L: string[] = [];
    L.push("MANDATE HANDOVER AND DURABILITY PROTOCOL");
    L.push("Compiled under Section VI.B and Handbook Section 12D");
    L.push("");
    L.push(`MANDATE: ${mandate.trim() || "Unnamed mandate"}`);
    L.push(`SUCCESSOR OFFICE: ${successor.trim() || "Not named"}`);
    L.push(`MISSION: ${mission.theatre.trim() || "No active mission named"}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push("");
    L.push("I. DURABILITY READING");
    L.push("");
    L.push(`   Root score: ${r.base} of 100`);
    L.push(`   Dependence penalty: ${r.penalty}`);
    L.push(`   Durability quotient: ${r.durability} of 100`);
    L.push(`   Determination: ${r.band}`);
    L.push("");
    L.push("II. ROOTING TESTS");
    L.push("");
    GROUPS.forEach((g) => {
      L.push(`   ${g.toUpperCase()}`);
      TESTS.filter((t) => t.group === g).forEach((t) =>
        L.push(`     [${cleared.includes(t.id) ? "x" : " "}] ${t.text}${t.critical ? "  (critical)" : ""}`)
      );
      L.push("");
    });
    L.push("III. OUTSTANDING CRITICAL TESTS");
    L.push("");
    if (!r.openCritical.length) {
      L.push("   None. Every critical test is cleared.");
    } else {
      r.openCritical.forEach((t, i) => L.push(`${i + 1}. ${t.text}`));
    }
    L.push("");
    L.push("IV. RESIDUAL DEPENDENCE AND REMEDY");
    L.push("");
    if (!deps.length) {
      L.push("   No residual dependence recorded.");
    } else {
      deps.forEach((id, i) => {
        const d = DEPENDENCE.find((x) => x.id === id)!;
        L.push(`${i + 1}. ${d.label.toUpperCase()}`);
        L.push(`   Remedy: ${d.text}`);
        L.push("");
      });
    }
    L.push("V. HANDOVER DIRECTIVE");
    L.push("");
    L.push(`   ${r.directive}`);
    L.push("");
    L.push("VI. HANDOVER INSTRUMENT, OPERATIVE TEXT");
    L.push("");
    L.push(
      `   The obligations established under ${mandate.trim() || "this mandate"} pass in full to ${successor.trim() || "the named successor office"}, which holds them as an office and not through any officeholder. The transfer takes effect on the recorded date and is not conditional on the continued presence of any external party.`
    );
    L.push("");
    L.push(
      "   Where an obligation cannot be discharged by the successor office, the failure is recorded publicly at the next reporting interval, and the parties return to the table rather than to silence."
    );
    L.push("");
    if (engineLines.length) L.push(...engineLines, "");
    if (linked) L.push(...telemetryLines(signals));
    L.push("Rule-based clearance aid. Nothing entered here is stored or transmitted. Kenya Copyright Board Registration No. RZ100967.");
    L.push("");
    L.push("END OF PROTOCOL");
    return L.join("\n");
  }, [mandate, successor, mission, cleared, deps, r, engineLines, linked, signals]);

  return (
    <div className="grid gap-6 lg:gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className={panel}>
          <label className={label} htmlFor="hp-m">Mandate under handover</label>
          <input
            id="hp-m"
            className={`${field} text-base sm:text-sm min-h-11`}
            value={mandate}
            onChange={(e) => setMandate(e.target.value)}
            placeholder="Joint monitoring mandate, phase two"
          />
          <label className={`${label} mt-5`} htmlFor="hp-s">Successor office</label>
          <input
            id="hp-s"
            className={`${field} text-base sm:text-sm min-h-11`}
            value={successor}
            onChange={(e) => setSuccessor(e.target.value)}
            placeholder="Office of the National Peace Secretariat"
          />

          {GROUPS.map((g) => (
            <div key={g} className="mt-5">
              <p className={label}>{g}</p>
              <div className="space-y-2">
                {TESTS.filter((t) => t.group === g).map((t) => (
                  <label key={t.id} className="flex items-start gap-3 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cleared.includes(t.id)}
                      onChange={() => toggle(cleared, t.id, setCleared)}
                      className="mt-1 accent-[hsl(var(--accent))]"
                    />
                    <span className="flex-1">
                      <span className="text-foreground/90">{t.text}</span>
                      {t.critical && (
                        <span className="block text-[10px] uppercase tracking-[0.16em] text-accent">Critical gate</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="border border-brass/40 p-4 sm:p-5">
          <div className="flex items-baseline justify-between mb-3">
            <p className={label}>Durability quotient</p>
            <span className="font-serif text-2xl text-primary">{r.durability}/100</span>
          </div>
          <div className="h-2 bg-brass/20">
            <div className="h-full bg-accent transition-all" style={{ width: `${r.durability}%` }} />
          </div>
          <p className="mt-3 text-xs uppercase tracking-[0.18em] font-semibold text-accent">{r.band}</p>
          <p className={`${label} mt-5`}>Residual dependence on the departing presence</p>
          <div className="space-y-2">
            {DEPENDENCE.map((d) => (
              <label key={d.id} className="flex items-start gap-3 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={deps.includes(d.id)}
                  onChange={() => toggle(deps, d.id, setDeps)}
                  className="mt-1 accent-[hsl(var(--accent))]"
                />
                <span className="flex-1 text-foreground/90">{d.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <SyncPanel linked={linked} onToggle={setLinked} summary={() => engineLines.length ? engineLines.slice(1).map((x) => x.trim()) : ["The upstream reading raises no handover condition."]} />

      <DeskOutput text={text} fileName="Vinculum-Handover-Protocol" />
    </div>
  );
}
