import { useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";
import SyncPanel from "@/components/desk/SyncPanel";
import { telemetryLines, useEngine, usePublish } from "@/components/desk/engine";
import { useEffect } from "react";
import { DOMAINS } from "@/content/cases";
import DeskOutput from "@/components/desk/DeskOutput";

/**
 * The Legal & Litigation Preparation Workbench.
 *
 * Fully deterministic. No model, no network call, no storage. Every line of the
 * checklist is compiled from fixed doctrinal rules (Section VII case record,
 * Handbook §9A scripted inquiry, §12 continuity provisions, §15 failure modes).
 */

const FORUMS = [
  {
    id: "constitutional",
    label: "Constitutional or appellate court",
    note: "Domestic constitutional standing, remedies binding on state offices.",
    authority: "Constitutional petition practice; domestic bill of rights jurisprudence.",
  },
  {
    id: "regional",
    label: "Regional human rights court",
    note: "Exhaustion of domestic remedies and admissibility govern the timetable.",
    authority: "Regional human rights convention; admissibility and exhaustion rules.",
  },
  {
    id: "international",
    label: "International tribunal or court",
    note: "State responsibility, gravity thresholds, and complementarity govern entry.",
    authority: "Treaty instruments, complementarity and gravity assessments.",
  },
  {
    id: "arbitration",
    label: "Inter-state or commercial arbitration",
    note: "Consent to arbitrate, seat, and enforceability of the award govern strategy.",
    authority: "Arbitration agreement, seat law, enforcement convention.",
  },
] as const;

const POSTURES = [
  {
    id: "prefiling",
    label: "Pre-filing and factual investigation",
    focus: "Secure the record before it degrades and fix the relational chronology.",
  },
  {
    id: "discovery",
    label: "Discovery, pleadings and memorials",
    focus: "Convert the relational chronology into admissible documentary proof.",
  },
  {
    id: "provisional",
    label: "Provisional measures or injunction",
    focus: "Demonstrate irreparable relational harm and urgency on a short record.",
  },
  {
    id: "merits",
    label: "Merits hearing and oral argument",
    focus: "Carry the bond analysis into examination and closing submissions.",
  },
  {
    id: "enforcement",
    label: "Post-judgment enforcement",
    focus: "Bind offices rather than officeholders so relief survives transition.",
  },
] as const;

const COUNTERPART = [
  {
    id: "theater",
    label: "Performative compliance (bond theater)",
    risk: "The opposing party documents consultation that produced no change in outcome.",
    counter:
      "Plead the outcome test: require the respondent to identify one decision altered by the consultation it relies upon. Consultation without an altered decision is a record of process, not of compliance.",
  },
  {
    id: "capture",
    label: "Asymmetric institutional capture",
    risk: "The verifying body relied on by the respondent is not independent of it.",
    counter:
      "Invoke government non-self-assessment: a respondent's account of its own institutional bond is a hypothesis for independent verification, never a self-certifying conclusion. Seek an independent verifier appointed by the forum.",
  },
  {
    id: "immunity",
    label: "Elite-pact immunity and settlement shielding",
    risk: "A leadership-level accord is offered as a bar to the claim of affected communities.",
    counter:
      "Separate the signatories from the affected parties: an accord concluded between principals does not extinguish the standing of the community whose bond was ruptured. Test who was represented and by what mandate.",
  },
  {
    id: "exhaustion",
    label: "Temporal exhaustion and delay",
    risk: "Procedure is used to outlast the claimant community and its funding.",
    counter:
      "Move for a fixed procedural calendar and interim protective relief. Record each delay against the delay-justification failure mode so the pattern, not the single adjournment, is before the forum.",
  },
] as const;

const BOND_EVIDENCE = [
  [
    "Correspondence, minutes and call records between the named principals across the rupture period.",
    "Records of any assurance given by a named official and the decision that followed it.",
    "Succession and handover files for each named counterpart in the chain.",
  ],
  [
    "Mandate documents evidencing who was authorised to speak for the affected community.",
    "Community meeting records, attendance lists and resolutions from the relevant period.",
    "Records of grievances lodged by the community and the disposition of each.",
  ],
  [
    "Records of youth or successor-generation participation, including terms of reference and duration.",
    "Budget lines and funding cycles attached to that participation.",
    "Evidence of whether any youth input altered a documented decision.",
  ],
  [
    "Statutory instruments, standing orders and delegations governing the responsible office.",
    "Personnel and tenure records covering the transition period at issue.",
    "Internal and independent audit or oversight findings on the responsible office.",
  ],
] as const;

const BOND_INQUIRY = [
  "Which named person gave this assurance, and what did your office do when that person left?",
  "Who authorised you to speak for this community, and how would the community itself answer that question?",
  "What happened to the input of the successor generation after the session closed, and who is accountable for it?",
  "What in this arrangement survives a change of officeholder, and where is that written?",
] as const;

const BOND_RELIEF = [
  "An order binding the office, not the individual, with an automatic succession clause carrying every undertaking to the incoming officeholder.",
  "A verified community standing mechanism: relief conditioned on confirmation from the affected community, not from its nominal representatives.",
  "An intergenerational review provision surviving the current budget cycle, with reporting obligations tied to the office.",
  "An independent verification mandate, with reporting to the forum at fixed intervals and liberty to apply on default.",
] as const;

export default function LitigationWorkbench() {
  const [matter, setMatter] = useState("");
  const [facts, setFacts] = useState("");
  const [forum, setForum] = useState(0);
  const [posture, setPosture] = useState(0);
  const [bond, setBond] = useState(0);
  const [tactic, setTactic] = useState(0);
  const { signals } = useEngine();
  // Sovereign Custom Mode: inscribed tribunals and traditional assemblies become selectable forums.
  const forums = useMemo(
    () => [
      ...FORUMS,
      ...(signals.customNotes ?? []).filter((n) => n.desk === "legal").map((n) => ({
        id: `sov-${n.id}`,
        label: `Sovereign tribunal: ${n.title}`,
        note: n.body || "Customary forum inscribed by the drafting officer.",
        authority: "Customary procedure, evidentiary burdens and oaths of record as inscribed.",
      })),
    ],
    [signals.customNotes],
  );
  const activeForum = forums[forum] ?? FORUMS[0];
  usePublish("legal", { litigationForum: activeForum.label });

  const [linked, setLinked] = useState(true);
  useEffect(() => {
    if (!linked || !signals.weakestBond) return;
    const i = (DOMAINS as readonly string[]).indexOf(signals.weakestBond);
    if (i >= 0) setBond(i);
  }, [linked, signals.weakestBond]);
  const text = useMemo(() => {
    const f = activeForum;
    const p = POSTURES[posture];
    const t = COUNTERPART[tactic];
    const b = DOMAINS[bond];
    const lines: string[] = [];
    const ref = `VS-LIT-${f.id.slice(0, 4).toUpperCase()}-${String(bond + 1).padStart(2, "0")}`;

    lines.push("LITIGATION PREPARATION CHECKLIST");
    lines.push("Compiled from the Vinculum Security doctrine and the Practitioner Handbook");
    lines.push("");
    lines.push(`REFERENCE: ${ref}`);
    lines.push(`MATTER: ${matter.trim() || "Unnamed matter"}`);
    lines.push(`FORUM: ${f.label}`);
    lines.push(`POSTURE: ${p.label}`);
    lines.push(`PRIMARY STRAINED BOND: ${b}`);
    lines.push(`COUNTERPART POSTURE: ${t.label}`);
    lines.push("");
    lines.push("I. STATEMENT OF THE MATTER");
    lines.push(facts.trim() || "No facts entered.");
    lines.push("");
    lines.push(`Governing frame: ${f.note} ${f.authority}`);
    lines.push(`Stage priority: ${p.focus}`);
    lines.push("");
    lines.push(`II. EVIDENTIARY LEDGER (${b.toUpperCase()} BOND)`);
    BOND_EVIDENCE[bond].forEach((e, i) => lines.push(`  ${i + 1}. ${e}`));
    lines.push("");
    lines.push("III. ANTICIPATED DEFENCE AND DOCTRINAL ANSWER");
    lines.push(`Risk: ${t.risk}`);
    lines.push(`Answer: ${t.counter}`);
    lines.push("");
    lines.push("IV. EXAMINATION LINE (HANDBOOK §9A)");
    lines.push(`  Scripted inquiry: "${BOND_INQUIRY[bond]}"`);
    lines.push(
      "  Guardrail: no witness from an affected community is exposed without an existing protection framework in force; children are a protected party and are never examined as a bond source."
    );
    lines.push("");
    lines.push("V. PRAYER FOR CONTINUITY RELIEF (HANDBOOK §12)");
    lines.push(`  1. ${BOND_RELIEF[bond]}`);
    lines.push(`  2. ${BOND_RELIEF[3]}`);
    lines.push(
      "  3. A continuity provision drafted to survive a change in the officeholders who negotiated or conceded it."
    );
    lines.push("");
    if (linked) lines.push(...telemetryLines(signals));
    lines.push("VI. NOTE ON COMPILATION");
    lines.push(
      "This checklist is compiled deterministically from fixed doctrinal rules. No part of it is machine-generated or predictive, and nothing entered above leaves this browser."
    );
    lines.push("Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    lines.push("END OF CHECKLIST.");
    return lines.join("\n");
  }, [matter, facts, activeForum, posture, bond, tactic, linked, signals]);

  // Binder id follows the matter, so each matter keeps its own binder entry.
  const fileName = `Vinculum-Litigation-Checklist-${(matter.trim() || "matter").replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").slice(0, 40)}`;

  const reset = () => {
    setMatter("");
    setFacts("");
    setForum(0);
    setPosture(0);
    setBond(0);
    setTactic(0);
  };

  const field = "w-full border border-input bg-background px-3 py-2.5 text-sm";
  const label = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block";

  return (
    <section className="border border-brass/40 bg-navy-tint/40 p-5 md:p-7">
      <div className="mb-6"><SyncPanel linked={linked} onToggle={setLinked} summary={(x) => x.weakestBond ? [`Harmed bond set to ${x.weakestBond}, the most exposed bond on the diagnostic bench.`] : []} /></div>
      <p className="mb-7 max-w-3xl text-muted-foreground text-sm leading-relaxed">
        Enter the facts of a new matter and the desk compiles a preparation checklist from the doctrine's
        evidentiary rules, the §9A examination scripts, and the §12 continuity provisions. Nothing is saved
        or transmitted, and no model is involved.
      </p>

      <div className="grid grid-cols-1 gap-6 items-start lg:grid-cols-12 w-full min-w-0 [&>*]:min-w-0">
        <div className="space-y-5 lg:col-span-6">
          <div>
            <label className={label} htmlFor="lit-matter">Matter or caption</label>
            <input
              id="lit-matter"
              className={field}
              value={matter}
              onChange={(e) => setMatter(e.target.value)}
              placeholder="e.g. Community of Kibera v. County Government"
            />
          </div>
          <div>
            <label className={label} htmlFor="lit-facts">Facts of the case</label>
            <textarea
              id="lit-facts"
              rows={10}
              className={field}
              value={facts}
              onChange={(e) => setFacts(e.target.value)}
              placeholder="Set out the parties, the rupture, the dates, and the relief sought."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="lit-forum">Forum</label>
              <select id="lit-forum" className={field} value={forum} onChange={(e) => setForum(Number(e.target.value))}>
                {forums.map((f, i) => <option key={f.id} value={i}>{f.label}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="lit-posture">Procedural posture</label>
              <select id="lit-posture" className={field} value={posture} onChange={(e) => setPosture(Number(e.target.value))}>
                {POSTURES.map((p, i) => <option key={p.id} value={i}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="lit-bond">Primary strained bond</label>
              <select id="lit-bond" className={field} value={bond} onChange={(e) => setBond(Number(e.target.value))}>
                {DOMAINS.map((d, i) => <option key={d} value={i}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="lit-tactic">Counterpart posture</label>
              <select id="lit-tactic" className={field} value={tactic} onChange={(e) => setTactic(Number(e.target.value))}>
                {COUNTERPART.map((t, i) => <option key={t.id} value={i}>{t.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Right column: live evidentiary ledger beside the intake form. */}
        <div className="space-y-4 min-w-0 lg:col-span-6">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Evidentiary ledger · live preview</p>
          <div className="border border-border bg-background p-4">
            <p className={label}>Evidence to secure · {DOMAINS[bond]} bond</p>
            <ul className="space-y-1.5">
              {BOND_EVIDENCE[bond].map((e) => (
                <li key={e} className="flex gap-2 text-xs leading-relaxed text-foreground/85"><span className="text-brass font-bold shrink-0">&middot;</span><span>{e}</span></li>
              ))}
            </ul>
          </div>
          <div className="border border-border bg-navy-tint/40 p-4">
            <p className={label}>§9A examination question</p>
            <p className="font-serif italic text-sm text-primary/90">“{BOND_INQUIRY[bond]}”</p>
          </div>
          <div className="border border-border bg-background p-4">
            <p className={label}>Anticipated defence · {COUNTERPART[tactic].label}</p>
            <p className="text-xs text-muted-foreground">{COUNTERPART[tactic].risk}</p>
            <p className="mt-2 text-xs text-foreground/85">{COUNTERPART[tactic].counter}</p>
          </div>
          <div className="border border-brass/40 bg-gold-tint/40 p-4">
            <p className={label}>Prayer for continuity relief</p>
            <p className="text-xs leading-relaxed text-foreground/85">{BOND_RELIEF[bond]}</p>
          </div>
          <div className="flex justify-end">
            <button type="button" onClick={reset} className="inline-flex items-center gap-2 border border-brass/50 px-3 py-2 min-h-11 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors">
              <RotateCcw size={13} /> Reset matter
            </button>
          </div>
        </div>
      </div>
      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={text} fileName={fileName} />
      </div>
    </section>
  );
}
