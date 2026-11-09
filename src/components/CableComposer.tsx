import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CASES, DOMAINS } from "@/content/cases";
import { AUTHOR_NAME, SITE_URL } from "@/lib/seo-entities";
import { useEngine, hasSignal, telemetryLines } from "@/components/desk/engine";
import SyncPanel from "@/components/desk/SyncPanel";
import DeskOutput from "@/components/desk/DeskOutput";
import NoteVerbale from "@/components/desk/NoteVerbale";
import { copyText } from "@/lib/clipboardGuard";

/**
 * §12B, the Operational Briefing Desk.
 *
 * A deterministic memorandum compiler. No model, no network call, no storage:
 * every line of output is assembled from the published case record (Section VII)
 * and the Practitioner Handbook (§9A scripts, §12 protocols, §15 failure modes).
 */

type RecipientKey = "nsc" | "envoy" | "humanitarian" | "oversight";
type CableKey = "sitrep" | "action" | "interlocutor";

const RECIPIENTS: Record<
  RecipientKey,
  { label: string; office: string; frame: string; directive: string }
> = {
  nsc: {
    label: "National Security Council",
    office: "Office of the National Security Council / Head of State",
    frame:
      "strategic exposure, the durability of the settlement under leadership change, and the political cost of a relational failure surfacing late",
    directive:
      "Treat the lowest-scoring bond as a standing item on the council agenda, with a named owner and a reporting interval, rather than as a matter delegated to the process that produced it.",
  },
  envoy: {
    label: "Special Envoy / Lead Mediator",
    office: "Office of the Special Envoy, Mediation Mission",
    frame:
      "counterpart conduct in the room, the sequencing of concessions, and the specific language that tests a bond instead of assuming it",
    directive:
      "Carry the §9A inquiry for the strained bond into the next session verbatim, and record the counterpart's answer as evidence rather than as atmosphere.",
  },
  humanitarian: {
    label: "Humanitarian & Stabilisation Director",
    office: "Field Operations and Civilian Protection Directorate",
    frame:
      "civilian protection, communal access, and the field consequences of a settlement that holds at the centre while degrading at the periphery",
    directive:
      "Verify communal standing independently of the reporting institution before any dividend, distribution, or access agreement is announced as consented.",
  },
  oversight: {
    label: "Parliamentary Oversight Committee",
    office: "Legislative Committee on Foreign Affairs and Defence",
    frame:
      "institutional compliance, the continuity provisions written into the instrument, and whether appropriations follow the weakest finding",
    directive:
      "Require that the weakest bond finding carries an appropriation line and a named accountable office before the instrument is certified as implemented.",
  },
};

const CABLES: Record<CableKey, { label: string; tag: string; purpose: string }> = {
  sitrep: {
    label: "Situation Report",
    tag: "SITREP",
    purpose: "Rapid relational assessment of a developing situation, for awareness and early warning.",
  },
  action: {
    label: "Action Memorandum",
    tag: "ACTION MEMORANDUM",
    purpose: "A recommendation requiring a decision by the receiving principal.",
  },
  interlocutor: {
    label: "Interlocutor Brief",
    tag: "INTERLOCUTOR BRIEF",
    purpose: "Preparatory guidance for a practitioner entering a session with named counterparts.",
  },
};

/** Handbook §9A, the scripted inquiry for each bond. */
const SCRIPTS: Record<number, { line: string; tests: string }> = {
  0: {
    line: "Before we finalize this language, I want to raise a small point where I think we see this differently, not because it threatens the agreement, but because I would rather find out now how we handle a disagreement than discover it later.",
    tests: "Whether the relationship survives a bad-faith moment intact.",
  },
  1: {
    line: "I would like to understand how this position was arrived at with the community you represent. Was there a recent consultation, and would you be comfortable if I spoke with them directly as well?",
    tests: "Whether the counterpart's authority survives contact with the community, not only the institution.",
  },
  2: {
    line: "When the youth delegation raises this recommendation, who on our side is responsible for responding to it directly, and by when?",
    tests: "Whether youth are present at the table, or only in the room.",
  },
  3: {
    line: "If either of us were no longer in this role in two years, what in this agreement would still hold?",
    tests: "Whether the bond survives a change in personnel or office.",
  },
};

/** Handbook §15, the failure mode each bond is most exposed to when it scores low. */
const FAILURE: Record<number, { name: string; sign: string; recover: string }> = {
  0: {
    name: "Relational Overreach",
    sign: "Personal rapport is cited as reason to bypass a verification or accountability step.",
    recover: "Reinstate the bypassed step explicitly; treat rapport as what made the step easier, never as what made it unnecessary.",
  },
  1: {
    name: "The Relativism Trap",
    sign: "Cohesion is reported as success without asking who was excluded or silenced to produce it.",
    recover: "Return to the community independently of the reporting institution, seek dissenting voices, and reassess before the reading stands.",
  },
  2: {
    name: "Bond Theater",
    sign: "A consultation is reported as participation, but no named individual is responsible for acting on what was said.",
    recover: "Name the person responsible for responding, set a deadline, and communicate both back to the consulted group.",
  },
  3: {
    name: "Delay-Justification",
    sign: "Relational language is invoked to postpone a decision that credible evidence shows is urgent.",
    recover: "Treat continuity language used to justify delay as a low institutional-relational signal demanding more scrutiny, not less.",
  },
};

const PRECEDENCE = ["IMMEDIATE", "PRIORITY", "ROUTINE"] as const;

const CAVEATS = [
  { id: "open", label: "No caveat", line: "NONE. Releasable within the receiving office." },
  { id: "verifier", label: "Releasable to verifiers only", line: "RELEASABLE TO INDEPENDENT VERIFIERS ONLY. Not for party circulation." },
  { id: "eyes", label: "Addressee eyes only", line: "ADDRESSEE EYES ONLY. Onward transmission requires the originating desk's consent." },
] as const;

const BAND = (n: number) =>
  n <= 1 ? "Fractured" : n === 2 ? "Degraded" : n === 3 ? "Contested" : n === 4 ? "Stabilised" : "Reconstituted";


function stamp(d: Date) {
  return d
    .toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    .toUpperCase();
}

export default function CableComposer() {
  const [params] = useSearchParams();
  const initial = CASES.findIndex((c) => c.slug === params.get("case"));
  const [ci, setCi] = useState(initial >= 0 ? initial : 0);
  const [rk, setRk] = useState<RecipientKey>("envoy");
  const [ck, setCk] = useState<CableKey>("action");
  const [auto, setAuto] = useState(true);
  const [manual, setManual] = useState(0);
  const [theater, setTheater] = useState("");
  const [drafter, setDrafter] = useState("");
  const [prec, setPrec] = useState(1);
  const [cav, setCav] = useState(0);
  const [annex, setAnnex] = useState(false);

  // Custom mode: a live theater that is not one of the eight cases of record,
  // and a receiving office of the practitioner's own naming.
  const [ownOn, setOwnOn] = useState(false);
  const [oName, setOName] = useState("");
  const [oRef, setORef] = useState("");
  const [oSummary, setOSummary] = useState("");
  const [oScores, setOScores] = useState<[number, number, number, number]>([3, 3, 3, 3]);
  const [oRat, setORat] = useState<[string, string, string, string]>(["", "", "", ""]);
  const [oOffice, setOOffice] = useState("");
  const [oDirective, setODirective] = useState("");
  const setScore = (i: number, v: number) => setOScores((p) => p.map((x, j) => (j === i ? v : x)) as [number, number, number, number]);
  const setRat = (i: number, v: string) => setORat((p) => p.map((x, j) => (j === i ? v : x)) as [string, string, string, string]);

  const [copied, setCopied] = useState(false);
  const outRef = useRef<HTMLDivElement>(null);

  // The live feed from Division I and Division II.
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const live = linked && hasSignal(signals);

  useEffect(() => {
    if (initial >= 0 && outRef.current) {
      outRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    // Only on first mount, when a case arrives from a case page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const base = CASES[ci];
  const c = useMemo(() => {
    if (!ownOn) return base;
    const name = oName.trim() || "Unnamed theater";
    return {
      ...base,
      slug: "own-theater",
      shortTitle: name,
      title: name,
      ref: oRef.trim() || "Own file",
      summary: oSummary.trim() || "Assessment of a live theater recorded by the drafting officer.",
      pattern: "Own theater. No cross-case pattern of record applies; the reading below rests on the officer's own observation.",
      scores: oScores,
      rationales: oRat.map((t, i) => t.trim() || `No rationale recorded for the ${DOMAINS[i].toLowerCase()} bond.`) as [string, string, string, string],
      practice: base.practice,
      sources: ["Own field observation, recorded by the drafting officer."],
    };
  }, [ownOn, base, oName, oRef, oSummary, oScores, oRat]);

  const weakest = c.scores.indexOf(Math.min(...c.scores));
  // When the engine is linked, the live diagnostic decides which bond the
  // memorandum opens on, ahead of the case record's own weakest bond.
  const liveBond = live && signals.weakestBond ? (DOMAINS as readonly string[]).indexOf(signals.weakestBond) : -1;
  const bi = auto ? (liveBond >= 0 ? liveBond : weakest) : manual;
  const rBase = RECIPIENTS[rk];
  const r = useMemo(
    () => ({
      label: rBase.label,
      office: oOffice.trim() || rBase.office,
      frame: rBase.frame,
      directive: oDirective.trim() || rBase.directive,
    }),
    [rBase, oOffice, oDirective],
  );
  const cab = CABLES[ck];
  const today = useMemo(() => new Date(), []);


  const memo = useMemo(() => {
    const ref = `VS-${cab.tag.split(" ")[0].slice(0, 3).toUpperCase()}-${c.ref}-${String(bi + 1).padStart(2, "0")}`;
    const ledger = DOMAINS.map(
      (d, i) => `   ${d}: ${c.scores[i]} of 5 (${BAND(c.scores[i])})\n      ${c.rationales[i]}`
    ).join("\n");
    const f = FAILURE[bi];
    const s = SCRIPTS[bi];
    const th = theater.trim();

    return `CLASSIFICATION: UNRESTRICTED / WORKING DRAFT
${cab.tag}
PRECEDENCE: ${PRECEDENCE[prec]}
HANDLING CAVEAT: ${CAVEATS[cav].line}
REFERENCE: ${ref}
ORIGINATING DESK: Vinculum Security, Applied Case Engagement, Section ${c.ref}
DRAFTING OFFICER: ${drafter.trim() || "Not stated"}
RECIPIENT: ${r.office}
DISTRIBUTION: ${r.label}; originating desk file copy${cav === 0 ? "; implementation registry" : ""}
${th ? `ACTIVE THEATER: ${th}\n` : ""}SUBJECT: ${c.shortTitle}. Relational assessment of the ${DOMAINS[bi].toLowerCase()} bond, with required safeguards${th ? `, read against ${th}` : ""}.


PURPOSE
${cab.purpose}

I. STRATEGIC PROBLEM STATEMENT
${c.summary}
${c.pattern}
Read for this recipient, the material question is one of ${r.frame}.

II. RELATIONAL VULNERABILITY LEDGER
Vinculum Continuum scoring, 1 to 5, higher values indicating stronger observed bond integrity.
${ledger}
Most exposed bond: ${DOMAINS[bi]} at ${c.scores[bi]} of 5 (${BAND(c.scores[bi])}).
${live ? `
II-A. LIVE READING CARRIED FORWARD FROM THE ASSESSMENT DIVISION
${telemetryLines(signals).join("\n")}` : ""}
III. DIRECTIVES FOR THE RECEIVING OFFICE
${r.directive}
Scripted inquiry for the strained bond, Handbook §9A:
   "${s.line}"
   What the line tests: ${s.tests}

IV. DOCTRINAL SAFEGUARDS, HANDBOOK §12
${c.practice}
Continuity requirement: ${c.takeaway}
Failure mode to guard against, Handbook §15, ${f.name}.
   Warning sign: ${f.sign}
   Recovery: ${f.recover}

V. SOURCES OF RECORD AND AUTHORITY
${c.sources.map((x) => `   · ${x}`).join("\n")}
   · Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition, Section ${c.ref}, by ${AUTHOR_NAME}.
   · Vinculum Diplomacy: The Practitioner Handbook, Final Edition, Sections 9A, 12 and 15, by ${AUTHOR_NAME}.
   · Canonical record: ${SITE_URL}/cases/${c.slug}

${annex ? `
ANNEX A · COMPARATIVE PRECEDENT
Cases of record carrying the same most-exposed bond (${DOMAINS[bi]}):
${CASES.filter((x) => x.slug !== c.slug && x.scores.indexOf(Math.min(...x.scores)) === bi)
  .map((x) => `   · ${x.shortTitle}, Section ${x.ref}. ${x.takeaway}`)
  .join("\n") || "   · No other case of record carries this bond as its most exposed."}
` : ""}
Compiled from the published record. No part of this memorandum is machine-generated
or predictive; every statement above is drawn verbatim from the case file and handbook.
Statutorily registered and legally protected intellectual property. Formally protected under statutory copyright law and international conventions. All statutory rights reserved.
END OF ${cab.tag}`;
  }, [c, r, cab, bi, theater, drafter, prec, cav, annex, live, signals]);


  const copy = async () => {
    try {
      await copyText(memo);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const download = () => {
    const blob = new Blob([memo], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vinculum-${cab.tag.replace(/\s+/g, "-")}-${c.shortTitle.replace(/\s+/g, "-")}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const field = "w-full border border-brass/50 bg-background px-3 py-2 text-[0.9rem] text-foreground focus:outline-none focus:border-accent";
  const lab = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70";

  return (
    <div ref={outRef}>
      <p className="text-muted-foreground max-w-3xl mb-6">
        Select a case, the office receiving the memorandum, and its purpose. The desk compiles a
        chancellery briefing from the published record alone. Nothing is predicted, stored, or sent.
      </p>

      <div className="mb-6">
        <SyncPanel
          linked={linked}
          onToggle={setLinked}
          summary={(s) => {
            const n: string[] = [];
            if (s.weakestBond) n.push(`The memorandum opens on the ${s.weakestBond.toLowerCase()} bond, carried from the diagnostic bench.`);
            if (s.rupture !== undefined) n.push(`The rupture index of ${s.rupture} per cent is written into the vulnerability ledger.`);
            if (s.traps?.length) n.push(`Active traps are named in the body: ${s.traps.join("; ")}.`);
            return n;
          }}
        />
      </div>

      <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6 mb-4 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <span className={lab}>Source of the assessment</span>
          <p className="text-sm text-foreground/85 mt-1">
            {ownOn ? "Your own live theater, scored by you." : "A case of record from the published archive."}
          </p>
        </div>
        <button type="button" aria-pressed={ownOn} onClick={() => setOwnOn(!ownOn)}
          className={`min-h-11 px-4 border text-[10px] uppercase tracking-[0.18em] font-semibold ${ownOn ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"}`}>
          {ownOn ? "Using my own theater" : "Use my own theater"}
        </button>
      </div>

      {ownOn && (
        <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6 mb-4 grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className={lab}>Theater name</span>
            <input className={`${field} mt-2`} value={oName} onChange={(e) => setOName(e.target.value)} placeholder="e.g. Eastern corridor transition commission" />
          </label>
          <label className="block">
            <span className={lab}>Your file reference</span>
            <input className={`${field} mt-2`} value={oRef} onChange={(e) => setORef(e.target.value)} placeholder="e.g. FILE 2026/014" />
          </label>
          <label className="block md:col-span-2">
            <span className={lab}>Problem statement</span>
            <textarea className={`${field} mt-2 min-h-24`} value={oSummary} onChange={(e) => setOSummary(e.target.value)} placeholder="What is actually at stake in this theater." />
          </label>
          <label className="block md:col-span-2">
            <span className={lab}>Receiving office, your wording (optional)</span>
            <input className={`${field} mt-2`} value={oOffice} onChange={(e) => setOOffice(e.target.value)} placeholder="Overrides the office named by the selection above" />
          </label>
          <label className="block md:col-span-2">
            <span className={lab}>Directive to that office (optional)</span>
            <textarea className={`${field} mt-2 min-h-20`} value={oDirective} onChange={(e) => setODirective(e.target.value)} placeholder="Overrides the standard directive" />
          </label>
          <div className="md:col-span-2 space-y-3">
            <span className={lab}>Bond scoring and rationale</span>
            {DOMAINS.map((d, i) => (
              <div key={d} className="grid gap-2 sm:grid-cols-[13rem_1fr] items-start">
                <select className={field} value={oScores[i]} onChange={(e) => setScore(i, Number(e.target.value))} aria-label={`${d} score`}>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{d}: {n} of 5, {BAND(n)}</option>)}
                </select>
                <input className={field} value={oRat[i]} onChange={(e) => setRat(i, e.target.value)} placeholder={`Why the ${d.toLowerCase()} bond scores as it does`} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="briefing-fields border border-brass/40 bg-navy-tint/40 p-5 md:p-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className={lab}>{ownOn ? "Comparison case of record" : "Case of record"}</span>
          <select className={`${field} mt-2`} value={ci} onChange={(e) => setCi(Number(e.target.value))}>
            {CASES.map((x, i) => (
              <option key={x.slug} value={i}>
                {x.shortTitle}, Section {x.ref}
              </option>
            ))}
          </select>
        </label>


        <label className="block">
          <span className={lab}>Receiving office</span>
          <select className={`${field} mt-2`} value={rk} onChange={(e) => setRk(e.target.value as RecipientKey)}>
            {(Object.keys(RECIPIENTS) as RecipientKey[]).map((k) => (
              <option key={k} value={k}>
                {RECIPIENTS[k].label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={lab}>Instrument</span>
          <select className={`${field} mt-2`} value={ck} onChange={(e) => setCk(e.target.value as CableKey)}>
            {(Object.keys(CABLES) as CableKey[]).map((k) => (
              <option key={k} value={k}>
                {CABLES[k].label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className={lab}>Active theater (optional)</span>
          <input className={`${field} mt-2`} value={theater} onChange={(e) => setTheater(e.target.value)} placeholder="e.g. Northern Rift corridor, Q3 review" />
        </label>

        <label className="block">
          <span className={lab}>Drafting officer (optional)</span>
          <input className={`${field} mt-2`} value={drafter} onChange={(e) => setDrafter(e.target.value)} placeholder="Name and desk" />
        </label>

        <label className="block">
          <span className={lab}>Precedence</span>
          <select className={`${field} mt-2`} value={prec} onChange={(e) => setPrec(Number(e.target.value))}>
            {PRECEDENCE.map((p, i) => <option key={p} value={i}>{p}</option>)}
          </select>
        </label>

        <label className="block">
          <span className={lab}>Handling caveat</span>
          <select className={`${field} mt-2`} value={cav} onChange={(e) => setCav(Number(e.target.value))}>
            {CAVEATS.map((x, i) => <option key={x.id} value={i}>{x.label}</option>)}
          </select>
        </label>

        <label className="flex items-start gap-3 md:col-span-2 text-sm cursor-pointer">
          <input type="checkbox" className="mt-1 accent-[hsl(var(--accent))]" checked={annex} onChange={(e) => setAnnex(e.target.checked)} />
          <span className="text-foreground/85">Append Annex A, comparative precedent from cases sharing the same most exposed bond.</span>
        </label>

        <div className="md:col-span-2">
          <span className={lab}>Point of strain</span>

          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setAuto(true)}
              aria-pressed={auto}
              className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                auto ? "bg-accent text-accent-foreground border-accent" : "border-brass/50 text-primary hover:border-accent"
              }`}
            >
              Weakest bond
            </button>
            {DOMAINS.map((d, i) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setAuto(false);
                  setManual(i);
                }}
                aria-pressed={!auto && manual === i}
                className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                  !auto && manual === i
                    ? "bg-accent text-accent-foreground border-accent"
                    : "border-brass/50 text-primary hover:border-accent"
                }`}
              >
                {d === "Institutional-Relational" ? "Institutional" : d}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 w-full min-w-0">
        <p className="mb-3 text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
          {cab.tag} · {c.shortTitle} · {DOMAINS[bi]}
        </p>
        <DeskOutput cable text={memo} fileName={`Vinculum-Briefing-${cab.tag.replace(/\s+/g, "-")}`} />
      </div>

      <div className="mt-8 min-w-0">
        <NoteVerbale />
      </div>
    </div>
  );
}
