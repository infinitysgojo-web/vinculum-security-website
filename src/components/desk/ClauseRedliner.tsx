import { useMemo, useState, type ReactNode } from "react";
import { Wand2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import SyncPanel from "@/components/desk/SyncPanel";
import { telemetryLines, useEngine, usePublish } from "@/components/desk/engine";
import ForumMatrix from "@/components/desk/ForumMatrix";
import { FORUMS, forumFitness, type ForumTerms } from "@/components/desk/instruments";
import DeskOutput, { field, label, panel } from "./DeskOutput";

/** The audit runs only once the clause carries at least this many characters. */
const REDLINE_MIN_CHARS = 20;

type Rule = {
  id: string;
  name: string;
  test: RegExp;
  finding: string;
  substitute: string;
  anchor: string;
  /** Raised by the absence of wording across the whole text, not by a phrase. */
  absence?: boolean;
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
    absence: true,
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
    absence: true,
  },
];

type Mark = { start: number; end: number; name: string; anchor: string };
type OwnRule = { phrase: string; why: string; sub: string };

/** Every flagged phrase in the text, in order, without overlaps. */
function flaggedSpans(body: string, own: OwnRule[]): Mark[] {
  const marks: Mark[] = [];
  for (const r of RULES) {
    if (r.absence) continue;
    const g = new RegExp(r.test.source, "gi");
    let m: RegExpExecArray | null;
    while ((m = g.exec(body))) {
      if (!m[0]) { g.lastIndex++; continue; }
      marks.push({ start: m.index, end: m.index + m[0].length, name: r.name, anchor: r.anchor });
    }
  }
  const lower = body.toLowerCase();
  for (const o of own) {
    const ph = o.phrase.toLowerCase();
    if (!ph) continue;
    for (let i = lower.indexOf(ph); i >= 0; i = lower.indexOf(ph, i + ph.length))
      marks.push({ start: i, end: i + ph.length, name: o.why || "Analyst rule", anchor: "Analyst's own rule" });
  }
  marks.sort((a, b) => a.start - b.start || b.end - a.end);
  const out: Mark[] = [];
  for (const m of marks) if (!out.length || m.start >= out[out.length - 1].end) out.push(m);
  return out;
}

/**
 * Replace every flagged loophole with the canonical binding wording: a sentence
 * carrying a flagged phrase gives way to that rule's substitute (each substitute
 * once), analyst phrases take their own substitute, and wording the text lacks
 * altogether (successor generation, consequence on breach) is appended.
 */
function sanitize(body: string, own: OwnRule[]): string {
  const used = new Set<string>();
  const sentences = body.trim().split(/(?<=[.;!?])\s+/);
  const kept: string[] = [];
  for (const sentence of sentences) {
    const hit = RULES.find((r) => !r.absence && r.test.test(sentence));
    if (!hit) { kept.push(sentence); continue; }
    if (!used.has(hit.id)) kept.push(hit.substitute);
    used.add(hit.id);
  }
  let next = kept.join(" ");
  for (const o of own) {
    if (!o.phrase || !o.sub) continue;
    next = next.replace(new RegExp(o.phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), o.sub);
  }
  for (const r of RULES) if (r.absence && r.test.test(next)) next = `${next} ${r.substitute}`;
  return next;
}

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
    () => (body.trim().length < REDLINE_MIN_CHARS ? [] : RULES.filter((r) => r.test.test(body))),
    [body]
  );

  const [localOwn, setOwn] = useState<OwnRule[]>([]);
  // Sovereign inscriptions from the bus join the analyst's own rules.
  const { signals: inscBus } = useEngine();
  const own = useMemo<OwnRule[]>(
    () => [...localOwn, ...(inscBus.customPhrases ?? []).map((p) => ({ phrase: p.phrase, why: p.rationale || "Sovereign inscription", sub: p.replacement }))],
    [localOwn, inscBus.customPhrases],
  );
  const [op, setOp] = useState(""); const [ow, setOw] = useState(""); const [os, setOs] = useState("");
  const ownHits = body.trim().length >= REDLINE_MIN_CHARS ? own.filter((r) => body.toLowerCase().includes(r.phrase.toLowerCase())) : [];
  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const [forumId, setForumId] = useState<string>("pca");
  const [forumTerms, setForumTerms] = useState<ForumTerms>({ immunityWaived: false, neutralSeat: true });
  const forum = FORUMS.find((f) => f.id === forumId) ?? FORUMS[0];
  const forumFit = forumFitness(forum, forumTerms);
  usePublish("redliner", {
    redlineFlags: findings.length,
    disputeForum: forum.name,
    disputeForumId: forum.id,
    activeForumScore: forumFit.fitness,
    enforcementFriction: forumFit.friction,
    immunityWaived: forumTerms.immunityWaived,
    neutralSeat: forumTerms.neutralSeat,
  });
  /** Shock-aware tests: wording that leans on a mechanism the live reading shows is failing. */
  const live: string[] = [];
  if (linked && body.trim().length >= REDLINE_MIN_CHARS) {
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
  const clean = body.trim().length >= REDLINE_MIN_CHARS && findings.length === 0;
  const spans = useMemo(() => (body.trim().length >= REDLINE_MIN_CHARS ? flaggedSpans(body, own) : []), [body, own]);
  const canSanitize = findings.length > 0 || ownHits.some((o) => o.sub);

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
    <div className="w-full min-w-0">
    <div className="instrument-layout w-full min-w-0">
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
            aria-describedby={body.trim().length < REDLINE_MIN_CHARS ? "rl-count rl-min" : "rl-count"}
          />
          <p
            id="rl-count"
            aria-live="polite"
            data-testid="redline-char-count"
            className={`mt-1.5 font-mono text-[10px] tabular-nums ${body.trim().length >= REDLINE_MIN_CHARS ? "text-primary" : "text-accent"}`}
          >
            {Math.min(body.trim().length, REDLINE_MIN_CHARS)} / {REDLINE_MIN_CHARS} characters
            {body.trim().length >= REDLINE_MIN_CHARS ? ` · threshold met · ${body.trim().length} characters audited` : ` · ${REDLINE_MIN_CHARS - body.trim().length} more to run the audit`}
          </p>
          {body.trim().length < REDLINE_MIN_CHARS && (
            <p id="rl-min" className="mt-1 text-[11px] text-accent">
              Enter at least 20 characters to execute the statutory anti-theatrics audit.
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            {RULES.length + own.length} tests applied. Everything runs in this browser; nothing is saved or sent.
          </p>
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
        {body.trim().length >= REDLINE_MIN_CHARS && (
          <div className="border border-brass/40 bg-background p-4 sm:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className={`${label} mb-0`}>Interactive redline</p>
              <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                {spans.length} phrase{spans.length === 1 ? "" : "s"} flagged · {findings.length} finding{findings.length === 1 ? "" : "s"}
              </span>
            </div>
            <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap [overflow-wrap:anywhere]">
              {(() => {
                const parts: ReactNode[] = [];
                let at = 0;
                spans.forEach((m, i) => {
                  if (m.start > at) parts.push(body.slice(at, m.start));
                  parts.push(
                    <Popover key={i}>
                      <PopoverTrigger asChild>
                        <button
                          type="button"
                          className="bg-destructive/15 text-destructive line-through decoration-destructive/60 px-1 py-0.5 rounded cursor-help"
                          aria-label={`Flagged: ${m.name}`}
                        >
                          {body.slice(m.start, m.end)}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-72 text-xs">
                        <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-destructive">{m.name}</p>
                        <p className="mt-1 text-muted-foreground">Doctrinal anchor: {m.anchor}</p>
                      </PopoverContent>
                    </Popover>,
                  );
                  at = m.end;
                });
                if (at < body.length) parts.push(body.slice(at));
                return parts;
              })()}
            </p>
            {findings.filter((f) => f.absence).length > 0 && (
              <p className="mt-3 text-xs text-muted-foreground">
                Missing altogether: {findings.filter((f) => f.absence).map((f) => f.name).join("; ")}.
              </p>
            )}
            <button
              type="button"
              disabled={!canSanitize}
              onClick={() => setBody(sanitize(body, ownHits))}
              className="mt-4 inline-flex w-full sm:w-auto min-h-11 items-center justify-center gap-2 bg-primary px-4 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary-foreground hover:bg-accent transition-colors disabled:opacity-40"
            >
              <Wand2 size={13} /> Apply Chancellery Substitutions
            </button>
          </div>
        )}
        <SyncPanel linked={linked} onToggle={setLinked} summary={() => live.length ? live : ["The live reading raises no extra finding against this wording."]} />
        <div className="border border-brass/40 bg-background p-4 sm:p-5 space-y-2">
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
    </div>
      <div className="mt-6 w-full min-w-0">
        <ForumMatrix value={forumId} onChange={setForumId} terms={forumTerms} onTerms={setForumTerms} />
      </div>
      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={text} fileName="Vinculum-Clause-Redline" />
      </div>
    </div>
  );
}
