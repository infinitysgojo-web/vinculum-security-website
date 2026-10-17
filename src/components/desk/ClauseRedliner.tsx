import { useMemo, useState } from "react";
import SyncPanel from "@/components/desk/SyncPanel";
import { telemetryLines, useEngine, usePublish } from "@/components/desk/engine";
import DeskOutput, { field, label, panel } from "./DeskOutput";

type Rule = {
  id: string;
  name: string;
  test: RegExp;
  finding: string;
  substitute: string;
  anchor: string;
};

/**
 * Deterministic clause linter. Every finding comes from a fixed rule set drawn
 * from the registered doctrine. No model, no network, nothing stored.
 */
const RULES: Rule[] = [
  {
    id: "personalisation",
    name: "Unanchored personalisation",
    test: /\b(President|Prime Minister|His Excellency|Her Excellency|Chairman|the undersigned|Mr\.|Mrs\.|Dr\.)\b/i,
    finding:
      "The provision attaches a duty to a named person or a sitting officeholder. On a change of personnel the duty travels with the individual and the settlement loses its guarantor.",
    substitute:
      "The obligations under this Article attach to the Office and not to its holder, and shall bind every successor in that Office without renegotiation, re-signature, or fresh assent.",
    anchor: "Menkiti continuity principle; Institutional-Relational level",
  },
  {
    id: "consult",
    name: "Performative consultation",
    test: /\b(shall consult|consult with|take into account|have regard to|in consultation with|seek the views)\b/i,
    finding:
      "Consultation is required but no outcome test is imposed. A meeting held and minuted satisfies the text while the decision is unchanged. This is the recorded form of Bond Theater.",
    substitute:
      "Consultation shall be evidenced by a written record identifying which submissions altered the decision and which did not, together with reasons. Consultation that alters nothing shall not be treated as compliance.",
    anchor: "Outcome test for consultation, Section VI",
  },
  {
    id: "temporal",
    name: "Temporal exhaustion",
    test: /\b(in due course|as soon as (?:is )?practicable|at an appropriate time|from time to time|shall endeavour|best efforts|when circumstances permit)\b/i,
    finding:
      "The duty is deferred without a fixed calendar date. Open-ended timing allows a party to outlast the counterpart's attention, funding, and mandate.",
    substitute:
      "The obligation shall be performed no later than [DATE]. Failure to perform by that date shall be recorded as non-compliance and shall trigger the verification mechanism under this Agreement.",
    anchor: "Temporal exhaustion trap; §12 continuity mechanisms",
  },
  {
    id: "verification",
    name: "Asymmetric verification",
    test: /\b(self-assess|self-report|the Government shall (?:verify|certify|determine)|the Party shall certify|shall be the sole judge)\b/i,
    finding:
      "A party verifies its own compliance. The doctrine's non-self-assessment rule forbids this: no party may certify the health of a bond to which it is a party.",
    substitute:
      "Compliance shall be verified by an independent body that includes community and youth co-assessors. No party to this Agreement shall certify its own compliance.",
    anchor: "Non-self-assessment rule, Section VI",
  },
  {
    id: "youth",
    name: "Missing intergenerational anchoring",
    test: /^(?![\s\S]*\b(youth|young people|successor generation|intergenerational)\b)[\s\S]+$/i,
    finding:
      "No successor generation is named anywhere in the text. A severed intergenerational bond is the least compensable by strength at the other three levels.",
    substitute:
      "Representatives of the successor generation shall hold seats with voting rights, not observer status, in every body established under this Agreement.",
    anchor: "Weighting principle, Section III.F; Generational Cliff",
  },
  {
    id: "termination",
    name: "Unilateral exit",
    test: /\b(may terminate|may withdraw|at its sole discretion|without notice|reserves the right to suspend)\b/i,
    finding:
      "A party may exit or suspend on its own motion. An instrument that can be dissolved by the stronger party is not a continuity provision.",
    substitute:
      "Withdrawal shall require ninety days written notice to the verifying body, a published statement of reasons, and the completion of a relational impact review before it takes effect.",
    anchor: "§12 continuity provisions",
  },
  {
    id: "remedy",
    name: "No consequence on breach",
    test: /^(?![\s\S]*\b(breach|non-compliance|remedy|sanction|penalt|default|enforce)\b)[\s\S]+$/i,
    finding:
      "The text creates duties with no stated consequence for breach. An unenforced duty records goodwill without anchoring it, which is Unanchored Repair.",
    substitute:
      "Any breach shall be referred to the verifying body within thirty days, published in the compliance record, and shall suspend the breaching party's entitlements under Articles [ ] until cured.",
    anchor: "Unanchored Repair trap",
  },
];

/** Deliberately flawed sample clauses, so the linter can be seen working. Fictional text. */
const PRESETS: { id: string; chip: string; title: string; body: string }[] = [
  {
    id: "consult",
    chip: "Performative consultation",
    title: "Natural Resource Protocol §9",
    body:
      "Article 9. The Provincial Authority shall consult with affected communities, including youth representatives, before any extraction licence is issued, and shall take into account the views expressed at the consultation. Licensing decisions remain with the Authority.",
  },
  {
    id: "mandate",
    chip: "Personalised executive mandate",
    title: "Elite Transitional Accord §4",
    body:
      "Article 4. The President shall appoint the Joint Security Commission and shall personally chair its sessions. The Commission shall report in due course, and the Parties shall use best efforts to complete demobilisation when circumstances permit. Youth delegates may attend as observers. Any breach shall be referred to the President for resolution.",
  },
  {
    id: "selfcert",
    chip: "Self-certified state accord",
    title: "Bilateral Ceasefire §12",
    body:
      "Article 12. The Government shall certify its own compliance with the withdrawal schedule, and its certification shall be final. The Government may terminate this Article at its sole discretion if it judges conditions to have changed. Any breach by the opposing party shall be reported to the Government for determination.",
  },
];

export default function ClauseRedliner() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const findings = useMemo(
    () => (body.trim().length < 20 ? [] : RULES.filter((r) => r.test.test(body))),
    [body]
  );

  const [own, setOwn] = useState<{ phrase: string; why: string; sub: string }[]>([]);
  const [op, setOp] = useState(""); const [ow, setOw] = useState(""); const [os, setOs] = useState("");
  const ownHits = body.trim().length >= 20 ? own.filter((r) => body.toLowerCase().includes(r.phrase.toLowerCase())) : [];
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  usePublish("redliner", { redlineFlags: findings.length });
  /** Shock-aware tests: wording that leans on a mechanism the live reading shows is failing. */
  const live: string[] = [];
  if (linked && body.trim().length >= 20) {
    const b = body.toLowerCase();
    if (signals.shocks?.some((x) => /principal/i.test(x)) && /president|minister|leader|his excellency|personally/.test(b) && !/office|successor/.test(b))
      live.push("The draft names a person, while a principal-removal shock is active upstream. Bind the Office and every successor instead.");
    if (signals.weakestBond === "Communal" && !/communit|local|village|elder/.test(b))
      live.push("The communal bond is the weakest on the bench, yet the draft gives communities no named role. Add a standing community verification seat.");
    if (signals.weakestBond === "Intergenerational" && !/youth|young|generation/.test(b))
      live.push("The intergenerational bond is failing, yet the draft is silent on the successor generation. Add a youth continuity forum.");
    if ((signals.rupture ?? 0) >= 35 && !/verif|monitor|independent/.test(b))
      live.push(`The rupture index reads ${signals.rupture} per cent, yet the draft names no independent verifier. Add one with defined reporting intervals.`);
  }
  const clean = body.trim().length >= 20 && findings.length === 0;

  const text = useMemo(() => {
    const L: string[] = [];
    const t = title.trim() || "Untitled provision";
    L.push("CLAUSE REDLINE AND ANTI-THEATRICS AUDIT");
    L.push("Vinculum Security, Legal Architecture Division");
    L.push("");
    L.push(`INSTRUMENT: ${t}`);
    L.push(`RULES APPLIED: ${RULES.length}`);
    L.push(`FINDINGS RAISED: ${findings.length}`);
    L.push("");
    L.push("I. TEXT AS SUBMITTED");
    L.push("");
    L.push(body.trim() || "[no text submitted]");
    L.push("");
    L.push("II. FINDINGS");
    L.push("");
    if (!body.trim()) {
      L.push("No text submitted for audit.");
    } else if (clean) {
      L.push(
        "No rule in the applied set was triggered. This is not a warrant of soundness; it records only that the seven tested failure modes were not detected in the submitted wording."
      );
    } else {
      findings.forEach((f, i) => {
        L.push(`${i + 1}. ${f.name.toUpperCase()}`);
        L.push(`   Doctrinal anchor: ${f.anchor}`);
        L.push(`   Finding: ${f.finding}`);
        L.push(`   Substitute wording:`);
        L.push(`   "${f.substitute}"`);
        L.push("");
      });
    }
    if (ownHits.length) {
      L.push("II-B. FINDINGS UNDER THE ANALYST'S OWN RULES");
      L.push("");
      ownHits.forEach((r, i) => L.push(`${i + 1}. Flagged phrase: "${r.phrase}"`, `   Reason: ${r.why || "Analyst rule"}`, ...(r.sub ? [`   Substitute wording: "${r.sub}"`] : []), ""));
    }
    if (live.length) {
      L.push("II-A. FINDINGS RAISED BY THE LIVE MISSION READING");
      L.push("");
      live.forEach((x, i) => L.push(`${i + 1}. ${x}`));
      L.push("");
    }
    if (linked) L.push(...telemetryLines(signals));
    L.push("III. STANDING NOTE");
    L.push("");
    L.push(
      "This audit is rule-based and deterministic. It applies a fixed set of tests from the registered doctrine to the wording submitted. It does not read context, and it does not replace counsel."
    );
    L.push("");
    L.push("END OF AUDIT");
    return L.join("\n");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, body, findings, clean, linked, signals, live.join("|"), ownHits]);

  return (
    <div className="grid gap-8 lg:grid-cols-2 [&>*]:min-w-0">
      <div className="space-y-6">
        <div className={panel}>
          <label className={label} htmlFor="rl-title">Instrument or article title</label>
          <input
            id="rl-title"
            className={field}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article 14, Transitional Security Arrangements"
          />
          <p className={`${label} mt-5`}>Sample flawed clauses</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Sample clauses">
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => { setTitle(p.title); setBody(p.body); }}
                className="min-h-11 border border-brass/50 px-3 py-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors"
              >
                {p.chip}
              </button>
            ))}
            {body && (
              <button
                type="button"
                onClick={() => { setTitle(""); setBody(""); }}
                className="min-h-11 px-3 py-2 text-[10px] uppercase tracking-[0.16em] font-semibold text-muted-foreground hover:text-accent transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <label className={`${label} mt-5`} htmlFor="rl-body">Clause text to audit</label>
          <textarea
            id="rl-body"
            className={`${field} min-h-[18rem] font-mono text-xs`}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Paste the draft clause or provision here. Nothing you paste leaves this browser."
          />
          <p className="mt-3 text-xs text-muted-foreground">
            {RULES.length + own.length} tests applied. Everything runs in this browser; nothing is saved or sent.
          </p>
          <div className="mt-5 border-t border-brass/30 pt-4 space-y-2">
            <p className={label}>Custom mode: your own rule</p>
            <input className={field} value={op} onChange={(e) => setOp(e.target.value)} placeholder="Phrase to flag, e.g. best endeavours" />
            <input className={field} value={ow} onChange={(e) => setOw(e.target.value)} placeholder="Why it is a risk" />
            <input className={field} value={os} onChange={(e) => setOs(e.target.value)} placeholder="Substitute wording (optional)" />
            <button type="button" disabled={!op.trim()} onClick={() => { setOwn((p) => [...p, { phrase: op.trim(), why: ow.trim(), sub: os.trim() }]); setOp(""); setOw(""); setOs(""); }}
              className="min-h-11 w-full border border-brass/50 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">Add rule</button>
            {own.map((r, i) => (
              <div key={i} className="flex items-center justify-between gap-2 text-xs border border-border p-2">
                <span className="min-w-0 [overflow-wrap:anywhere]">"{r.phrase}"{ownHits.includes(r) && <span className="ml-2 text-accent">flagged</span>}</span>
                <button type="button" className="text-muted-foreground hover:text-accent px-2" onClick={() => setOwn((p) => p.filter((_, j) => j !== i))}>Remove</button>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-brass/40 p-5">
          <p className={label}>Tests applied</p>
          <ul className="space-y-2">
            {RULES.map((r) => {
              const hit = findings.some((f) => f.id === r.id);
              return (
                <li key={r.id} className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">{r.name}</span>
                  <span
                    className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${
                      !body.trim() ? "text-muted-foreground/60" : hit ? "text-accent" : "text-primary/60"
                    }`}
                  >
                    {!body.trim() ? "Idle" : hit ? "Raised" : "Clear"}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="space-y-4 min-w-0">
        <SyncPanel linked={linked} onToggle={setLinked} summary={() => live.length ? live : ["The live reading raises no extra finding against this wording."]} />
        <DeskOutput text={text} fileName="Vinculum-Clause-Redline" />
      </div>
    </div>
  );
}
