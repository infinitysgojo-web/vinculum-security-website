import { useEffect, useMemo, useState } from "react";
import { useMission } from "./mission";
import DeskOutput, { field, label, panel } from "./DeskOutput";
import SyncPanel from "./SyncPanel";
import { telemetryLines, useEngine, usePublish, engineLocks, stageGateAudit, statutoryClearances } from "./engine";
import { mintDispatch } from "./registry";
import { toast } from "sonner";
import { logDecision } from "./ledgerStore";
import { signOffStatus } from "./signOff";

/** Mission lifecycle clearance across four stages. Deterministic; nothing stored. */
type Gate = { id: string; group: string; text: string; critical: boolean; remedy: string };

const STAGES: { id: string; label: string; anchor: string; gates: Gate[] }[] = [
  {
    id: "auth",
    label: "Pre-deployment authorisation",
    anchor: "Methodology safeguards, Section VI.A",
    gates: [
      { id: "map", group: "Bond map", text: "All four bonds mapped for the theatre with named sources.", critical: true, remedy: "Commission a bond map from field sources before any authorisation is signed." },
      { id: "handover", group: "Bond map", text: "Counterpart succession chain identified for each principal.", critical: false, remedy: "Record, by office, who carries each relationship if the principal departs." },
      { id: "standing", group: "Standing", text: "Community recognition of every interlocutor independently confirmed.", critical: true, remedy: "Verify standing with the community directly, not through the nominating institution." },
      { id: "child", group: "Protection", text: "A mandated child-protection framework is in force before any contact.", critical: true, remedy: "Suspend contact planning until the framework is in force and staffed." },
      { id: "mandate", group: "Mandate", text: "The mandate names the relational outcome it is accountable for.", critical: true, remedy: "Return the mandate for redrafting with a stated relational outcome." },
    ],
  },
  {
    id: "deploy",
    label: "Field deployment clearance",
    anchor: "Handbook Section 11, mission conduct",
    gates: [
      { id: "witness", group: "Protection", text: "Retaliation risk assessed for every community participant.", critical: true, remedy: "Assess and mitigate retaliation exposure before the first session." },
      { id: "gender", group: "Protection", text: "Gendered harm named explicitly in the bond map.", critical: false, remedy: "Add a gendered harm reading to the bond map with its own sources." },
      { id: "youth", group: "Standing", text: "Successor-generation participants selected by their own communities.", critical: true, remedy: "Return selection to the community; appointed youth carry no standing." },
      { id: "channel", group: "Continuity", text: "A protected channel exists for each party outside the formal table.", critical: false, remedy: "Establish a protected channel before the table hardens." },
      { id: "logistics", group: "Continuity", text: "Access and movement secured without dependence on one party.", critical: true, remedy: "Remove single-party dependence in access arrangements." },
    ],
  },
  {
    id: "mid",
    label: "Mid-mandate verification",
    anchor: "Handbook Section 12, continuity provisions",
    gates: [
      { id: "verifier", group: "Verification", text: "An independent verifier agreed, not answerable to any party.", critical: true, remedy: "Appoint a verifier that no single party appoints, funds, houses or removes." },
      { id: "outcome", group: "Verification", text: "At least one decision altered by consultation, identified and dated.", critical: true, remedy: "Apply the outcome test; without an altered decision, record non-compliance." },
      { id: "continuity", group: "Verification", text: "Continuity provisions drafted to survive officeholder change.", critical: false, remedy: "Draft continuity articles binding the office rather than the officeholder." },
      { id: "budget", group: "Institutional", text: "Implementing bodies hold budgets protected from reallocation.", critical: false, remedy: "Seek statutory protection for the implementation budget line." },
      { id: "drift", group: "Institutional", text: "Mandate drift reviewed against the original relational outcome.", critical: true, remedy: "Convene a mandate fidelity review before the next reporting period." },
    ],
  },
  {
    id: "exit",
    label: "Mission exit and handover",
    anchor: "Handbook Section 12, succession and handover",
    gates: [
      { id: "exitplan", group: "Handover", text: "Exit and handover plan for the mission itself documented.", critical: true, remedy: "Document the handover file before an exit date is announced." },
      { id: "successor", group: "Handover", text: "A named local office inherits every open commitment.", critical: true, remedy: "Assign each open commitment to a named standing office." },
      { id: "record", group: "Handover", text: "The full relational record transferred, not only the final report.", critical: false, remedy: "Transfer session records and bond readings, not a summary alone." },
      { id: "review", group: "Durability", text: "A post-exit review date fixed and funded independently of the mission.", critical: true, remedy: "Fix and fund the review before closure; unreviewed exits lapse quietly." },
      { id: "youthexit", group: "Durability", text: "Successor-generation forum continues after the mission departs.", critical: false, remedy: "Anchor the youth forum in a standing institution before departure." },
    ],
  },
];

/** Host desk that resolves each canonical stage-gate. */
export const GATE_DESK: Record<string, { id: string; label: string }> = {
  "Vector Integrity": { id: "diagnostics", label: "Desk 01 · Diagnostics" },
  "Rupture Containment": { id: "verification", label: "Desk 16 · Verification Ledger" },
  "Track Synchronization": { id: "tracks", label: "Desk 08 · Track Sequencing" },
  "Structural Covenants": { id: "clauses", label: "Desk 10 · Clause Architect" },
  "Succession Durability": { id: "succession", label: "Desk 12 · Succession Simulator" },
};

export default function ReadinessDesk({ openQuestions, onOpenDesk }: { /** Opens a desk by id; supplied by the dashboard. */ onOpenDesk?: (id: string) => void;  /** Open Questions in the active workspace's Context Tray; undefined when no workspace is open. */ openQuestions?: number } = {}) {
  const profile = useMission();
  const [mission, setMission] = useState(profile.theatre);
  // Follow the Mission Vault when the theatre changes; a manual entry stays until the theatre itself changes.
  useEffect(() => setMission(profile.theatre), [profile.theatre]);
  const [si, setSi] = useState(0);
  const [done, setDone] = useState<string[]>([]);
  const toggle = (id: string) => {
    // Satisfying or reopening a statutory readiness gate is a decision on the Mission Decision Log.
    const g = STAGES.flatMap((st) => st.gates).find((x) => x.id === id);
    const was = done.includes(id);
    logDecision("15", was ? "GATE_REOPENED" : "GATE_SATISFIED", `Readiness gate ${g ? `"${g.text}"` : id}: ${was ? "met -> not met" : "not met -> met"}`);
    setDone((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const stage = STAGES[si];
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const locks = linked ? engineLocks(signals) : [];
  const openLocks = locks.filter((l) => !l.held);
  const audit = linked ? stageGateAudit(signals) : null;
  const auditLocked = audit?.locked ?? false;
  // Sovereign readiness gates: every inscribed gate must be attested before certification.
  const sovereignOpen = (signals.customGates ?? []).filter((g) => !g.verified);
  // Evidentiary hygiene: an unresolved Open Question in the Context Tray withholds clearance.
  const questionsOpen = openQuestions ?? 0;

  const r = useMemo(() => {
    const gates = stage.gates;
    const missingCritical = gates.filter((g) => g.critical && !done.includes(g.id));
    const met = gates.filter((g) => done.includes(g.id)).length;
    const pct = Math.round((met / gates.length) * 100);
    const verdict = missingCritical.length || openLocks.length || auditLocked || sovereignOpen.length || questionsOpen ? "NOT CLEARED" : pct === 100 ? "CLEARED" : "CLEARED WITH CONDITIONS";
    const lifecycle = STAGES.map((s) => {
      const mc = s.gates.filter((g) => g.critical && !done.includes(g.id)).length;
      const m = s.gates.filter((g) => done.includes(g.id)).length;
      return { label: s.label, met: m, total: s.gates.length, cleared: mc === 0 && openLocks.length === 0 && !auditLocked && sovereignOpen.length === 0 && questionsOpen === 0 };
    });
    return { missingCritical, pct, verdict, met, lifecycle };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done, stage, JSON.stringify(openLocks), auditLocked, sovereignOpen.length, questionsOpen]);

  const clearances = useMemo(() => statutoryClearances(signals), [signals]);
  const [lastRef, setLastRef] = useState("");
  const mint = async (kind: "minute" | "attestation") => {
    const d = await mintDispatch(signals, kind, "readiness");
    setLastRef(`${kind === "attestation" ? "Sign-off attestation" : "Readiness minute"} ${d.ref}`);
    toast.success(`${kind === "attestation" ? "Mission sign-off" : "Readiness minute"} ${d.ref} minted`);
  };

  usePublish("readiness", { gatesCleared: `${r.lifecycle.filter((x) => x.cleared).length}/${r.lifecycle.length}` });

  const text = useMemo(() => {
    const L = [
      "MISSION READINESS CLEARANCE",
      `Stage: ${stage.label}`,
      `Compiled under the ${stage.anchor}`,
      "",
      `MISSION: ${mission.trim() || "Unnamed mission"}`,
      `VERDICT: ${r.verdict}`,
      ...(audit ? [`DISPOSITION: ${audit.locked ? "LOCKED" : "CLEARED"}`] : []),
      `GATES MET AT THIS STAGE: ${r.met} of ${stage.gates.length} (${r.pct}%)`,
      ...(openQuestions !== undefined ? [`EVIDENTIARY HYGIENE: ${questionsOpen ? `${questionsOpen} open question${questionsOpen === 1 ? "" : "s"} unresolved in the Context Tray. Resolve, verify or formally exclude each before clearance.` : "No open questions in the Context Tray."}`] : []),
      "",
    ];
    let g = "";
    stage.gates.forEach((x) => {
      if (x.group !== g) { g = x.group; L.push(g.toUpperCase()); }
      L.push(`  [${done.includes(x.id) ? "SATISFIED" : "LOCKED   "}] ${x.text}${x.critical ? " (critical)" : ""}`);
    });
    L.push("");
    if (r.missingCritical.length) {
      L.push("BLOCKING CONDITIONS AND REMEDIATION DIRECTIVES");
      r.missingCritical.forEach((x) => {
        L.push(`  - ${x.text}`);
        L.push(`    Directive: ${x.remedy}`);
      });
      L.push("", "This stage must not be certified until every critical gate is met.");
      L.push("");
    }
    if (audit) {
      L.push("STAGE-GATE AUDIT");
      audit.gates.forEach((g) => {
        L.push(`  [${g.passed ? "PASSED" : "FAILED"}] ${g.name}: ${g.reading}`);
        if (!g.passed) L.push(`    Directive: ${g.directive}`);
      });
      L.push("");
    }
    if (locks.length) {
      L.push("ENGINE LOCKS (read from the upstream divisions)");
      locks.forEach((l) => {
        L.push(`  [${l.held ? "SATISFIED" : "LOCKED   "}] ${l.name}`);
        if (!l.held) L.push(`    Directive: ${l.remedy}`);
      });
      L.push("");
    }
    if (linked) L.push(...telemetryLines(signals));
    L.push("LIFECYCLE POSITION");
    r.lifecycle.forEach((s) => L.push(`  ${s.cleared ? "CLEARED    " : "OUTSTANDING"}  ${s.label} (${s.met}/${s.total})`));
    L.push("", "Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.");
    return L.join("\n");
  }, [mission, done, r, stage, locks, linked, signals, openQuestions, questionsOpen]);

  let group = "";
  const DIVISIONS: { id: string; title: string; note: string; prefixes: string[] }[] = [
    { id: "assess", title: "Division I · Assess", note: "Vector integrity and rupture containment", prefixes: ["1.", "2."] },
    { id: "engage", title: "Division II · Engage", note: "Track synchronisation", prefixes: ["3."] },
    { id: "legal", title: "Division III · Legal", note: "Structural covenants", prefixes: ["4."] },
    { id: "govern", title: "Division IV · Govern", note: "Succession durability", prefixes: ["5."] },
  ];
  const clearedCount = clearances.filter((c) => c.passed).length;
  const bindingOpen = clearances.filter((c) => c.binding && !c.passed).length;
  const clearancePct = Math.round((clearedCount / clearances.length) * 100);
  const canSignOff = r.verdict !== "NOT CLEARED" && bindingOpen === 0;
  // Itemised sign-off status: the five canonical gates are read straight from the
  // bus (the binding schedule decomposes them exactly), plus every desk-level hold.
  const signOff = signOffStatus({
    stageGates: stageGateAudit(signals).gates,
    bindingOpen,
    openQuestions: questionsOpen,
    stageLabel: stage.label,
    missingCritical: r.missingCritical.map((g) => g.text),
    sovereignOpen: sovereignOpen.map((g) => g.label),
    openLocks: openLocks.map((l) => l.name),
    canSignOff,
  });
  const signOffClick = () => {
    if (signOff.ready) {
      void mint("attestation");
      return;
    }
    toast.error("Sign-off held: open gates", {
      description: (
        <ul className="mt-1 space-y-1">
          {signOff.holds.map((h) => (
            <li key={h.name}><span className="font-semibold">{h.name}:</span> {h.reason}</li>
          ))}
          {signOff.holds.length === 0 && bindingOpen > 0 && <li>{bindingOpen} binding statutory clearances pending.</li>}
        </ul>
      ),
    });
  };

  return (
    <section className="w-full min-w-0">
      <div className="instrument-layout w-full min-w-0">
        {/* Left: mission inputs and the stage checklist. */}
        <div className="space-y-4">
          <div>
            <label className={label} htmlFor="rd-m">Mission</label>
            <input id="rd-m" className={field} value={mission} onChange={(e) => setMission(e.target.value)} placeholder="e.g. Lake Region mediation support mission" />
          </div>
          <div>
            <span className={label}>Lifecycle stage</span>
            <div className="grid grid-cols-2 gap-2">
              {STAGES.map((s, i) => (
                <button key={s.id} type="button" aria-pressed={si === i} onClick={() => setSi(i)}
                  className={`min-h-11 px-2 py-2 border text-[10px] font-semibold uppercase tracking-[0.12em] leading-tight ${si === i ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
          <div className="border border-brass/40 bg-background p-4">
            <p className={label}>{stage.label} · gate checklist</p>
            {stage.gates.map((x) => {
              const head = x.group !== group;
              group = x.group;
              return (
                <div key={x.id} className="pb-2">
                  {head && <p className={`${label} mt-3`}>{x.group}</p>}
                  <label className="flex gap-3 items-start text-sm cursor-pointer">
                    <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={done.includes(x.id)} onChange={() => toggle(x.id)} />
                    <span className="text-foreground/85">
                      <span className={`mr-2 inline-block border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] ${done.includes(x.id) ? "border-primary/50 text-primary bg-primary/5" : "border-terracotta/60 text-terracotta"}`}>
                        {done.includes(x.id) ? "Satisfied" : "Locked"}
                      </span>
                      {x.text}{x.critical && <span className="ml-2 text-[10px] uppercase tracking-[0.18em] text-accent">Critical</span>}
                    </span>
                  </label>
                </div>
              );
            })}
          </div>

        </div>

        {/* Right: live link, clearance meter, sign-off, audit, locks and the transmittal console. */}
        <div className="space-y-4 min-w-0">
          <SyncPanel linked={linked} onToggle={setLinked} summary={() => locks.length ? [`${locks.length - openLocks.length} of ${locks.length} engine conditions satisfied; ${openLocks.length} still locked.`] : ["No upstream condition currently locks clearance."]} />
          <div className="border border-brass/40 bg-background p-4">
            <div className="flex items-baseline justify-between gap-3">
              <p className={label}>Clearance progress</p>
              <span className="font-mono text-xs text-primary">{clearedCount}/{clearances.length}</span>
            </div>
            <div className="h-2 bg-border" aria-hidden>
              <div className={`h-2 transition-all ${bindingOpen ? "bg-accent" : "bg-primary"}`} style={{ width: `${clearancePct}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{bindingOpen ? `${bindingOpen} binding article${bindingOpen === 1 ? "" : "s"} still locked.` : "Every binding article is clear."}</p>
          </div>
          <div className={`border-2 p-4 ${canSignOff ? "border-primary/50 bg-background" : "border-destructive/60 bg-destructive/5"}`}>
            <p className={label}>Mission sign-off · {stage.label}</p>
            <p className={`font-serif text-3xl ${r.verdict === "NOT CLEARED" ? "text-destructive" : "text-primary"}`}>{r.verdict}</p>
            <p className="text-xs text-muted-foreground mt-1">{r.met} of {stage.gates.length} stage gates met</p>
            {openQuestions !== undefined && (
              <div className="mt-3 flex justify-between gap-3 border-t border-border pt-3 text-xs">
                <span className="text-foreground/85">Evidentiary hygiene · Context Tray open questions</span>
                <span className={questionsOpen ? "text-destructive shrink-0" : "text-primary shrink-0"}>{questionsOpen ? `${questionsOpen} unresolved` : "None open"}</span>
              </div>
            )}
            {(signals.customGates?.length ?? 0) > 0 && (
              <ul className="mt-3 space-y-1 border-t border-border pt-3">
                {signals.customGates?.map((g) => (
                  <li key={g.id} className="flex justify-between gap-3 text-xs">
                    <span className="text-foreground/85 [overflow-wrap:anywhere]">Sovereign gate · {g.label}</span>
                    <span className={g.verified ? "text-emerald shrink-0" : "text-destructive shrink-0"}>{g.verified ? "Attested" : "Awaiting"}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-3 space-y-1 border-t border-border pt-3">
              {r.lifecycle.map((s) => (
                <div key={s.label} className="flex justify-between gap-3 text-xs">
                  <span className="text-foreground/85">{s.label}</span>
                  <span className={s.cleared ? "text-primary" : "text-accent"}>{s.met}/{s.total}</span>
                </div>
              ))}
            </div>
          </div>
          {openLocks.length > 0 && (
            <div className="border border-terracotta/60 bg-background p-4 space-y-2">
              <p className={label}>Active locks</p>
              {openLocks.map((l) => (
                <div key={l.name} className="border-l-2 border-terracotta pl-3">
                  <p className="text-xs font-semibold text-foreground/90">{l.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{l.remedy}</p>
                </div>
              ))}
            </div>
          )}
          {audit && (
            <div className={`border p-4 space-y-2 ${audit.locked ? "border-destructive/60" : "border-primary/50"} bg-background`}>
              <p className={label}>Stage-gate audit · {audit.locked ? "Locked" : "Cleared"}</p>
              {audit.gates.map((g, i) => (
                <div key={g.name} className={`border-l-2 pl-3 ${g.passed ? "border-primary/40" : "border-destructive"}`}>
                  <p className="text-xs font-semibold text-foreground/90">Gate {i + 1} · {g.name} <span className={g.passed ? "text-primary" : "text-destructive"}>{g.passed ? "Passed" : "Failed"}</span></p>
                  {!g.passed && <p className="text-xs text-muted-foreground mt-0.5">{g.directive}</p>}
                  {!g.passed && onOpenDesk && GATE_DESK[g.name] && (
                    <button type="button" onClick={() => onOpenDesk(GATE_DESK[g.name].id)} className="mt-1.5 min-h-9 border border-brass/50 px-2.5 text-[10px] uppercase tracking-[0.14em] font-semibold text-primary hover:border-accent hover:text-accent">
                      Open {GATE_DESK[g.name].label}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          <div className="border border-brass/40 bg-navy-tint/40 p-4">
            <p className={label}>Transmittal console</p>
            <p className="text-xs text-muted-foreground">Mint a numbered readiness minute at any time. The sign-off attestation is minted once the verdict clears and every binding article is clear; until then, Sign off lists the open gates.</p>
            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button type="button" onClick={() => mint("minute")} className="min-h-11 border border-brass/50 px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent">Mint readiness minute</button>
              <button type="button" aria-describedby="rd-signoff-status" onClick={signOffClick} className="min-h-11 border border-accent bg-accent px-3 text-[10px] uppercase tracking-[0.16em] font-semibold text-accent-foreground hover:opacity-90">Sign off mission</button>
            </div>
            <p
              id="rd-signoff-status"
              role="status"
              aria-live="polite"
              className={`mt-2 border-l-2 pl-3 text-xs [overflow-wrap:anywhere] ${signOff.ready ? "border-primary text-primary" : "border-destructive text-destructive"}`}
            >
              {signOff.text}
            </p>
            {lastRef && <p className="mt-2 font-mono text-[11px] text-accent [overflow-wrap:anywhere]">{lastRef}</p>}
          </div>
        </div>
      </div>
          <div className="mt-6 w-full min-w-0">
            <p className={label}>Statutory clearances · Articles 1.1 to 5.4</p>
            <div className="instrument-pair">
              {DIVISIONS.map((d) => {
                const rows = clearances.filter((c) => d.prefixes.some((p) => c.id.startsWith(p)));
                const ok = rows.filter((c) => c.passed).length;
                return (
                  <div key={d.id} className="border border-border bg-background p-4 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="text-[10px] uppercase tracking-[0.18em] font-semibold text-primary">{d.title}</p>
                      <span className={`font-mono text-[10px] ${ok === rows.length ? "text-primary" : "text-accent"}`}>{ok}/{rows.length}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mb-2">{d.note}</p>
                    <ul className="space-y-1.5">
                      {rows.map((c) => (
                        <li key={c.id} className="flex gap-2 text-xs leading-snug">
                          <span className="w-7 shrink-0 font-mono text-accent">{c.id}</span>
                          <span className="min-w-0 flex-1 text-foreground/85">{c.name}{!c.binding && <span className="ml-1 text-[10px] text-muted-foreground">(advisory)</span>}</span>
                          <span className={`shrink-0 text-[10px] uppercase tracking-[0.12em] ${c.passed ? "text-primary" : c.binding ? "text-destructive" : "text-muted-foreground"}`}>{c.passed ? "Clear" : c.binding ? "Locked" : "Open"}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={text} fileName="Vinculum-Mission-Readiness" />
      </div>
    </section>
  );
}
