import { useState } from "react";

// Handbook §9A (scripts), Part IV.B (time constraint), Part V §15 (failure modes). Wording follows the Final Edition.
const SCRIPTS = [
  {
    level: "I", bond: "Interpersonal", aim: "Testing trust early",
    line: "Before we finalize this language, I want to raise a small point where I think we see this differently, not because it threatens the agreement, but because I'd rather find out now how we handle a disagreement than discover it later.",
    tests: "Whether the relationship survives a bad-faith moment intact.",
  },
  {
    level: "II", bond: "Communal", aim: "Verifying standing",
    line: "I'd like to understand how this position was arrived at with the community you represent. Was there a recent consultation, and would you be comfortable if I spoke with them directly as well?",
    tests: "Whether the counterpart's authority survives contact with the community, not just the institution.",
  },
  {
    level: "III", bond: "Intergenerational", aim: "Testing for binding input",
    line: "When the youth delegation raises this recommendation, who on our side is responsible for responding to it directly, and by when?",
    tests: "Whether youth are present at the table, or only in the room.",
  },
  {
    level: "IV", bond: "Institutional-Relational", aim: "Testing for continuity",
    line: "If either of us were no longer in this role in two years, what in this agreement would still hold?",
    tests: "Whether the bond survives a change in personnel or office.",
  },
];

const FAILURES = [
  { name: "Bond Theater", what: "Performing relational engagement, a consultation, a listening session, a photograph with elders, without standing, continuity, or binding influence.", sign: "A consultation is reported as a participation success, but no named individual is responsible for acting on what was said, and no follow-up is scheduled.", recover: "Name the person responsible for responding, set a deadline, and communicate both back to the consulted group." },
  { name: "The Relativism Trap", what: "Treating any cohesive-seeming bond as good without testing whether it is freely sustained or coercively maintained.", sign: "High communal cohesion is reported as unambiguous success without asking who was excluded or silenced to produce it.", recover: "Return to the community independently of the reporting institution, seek dissenting and marginal voices, and reassess before the score stands." },
  { name: "Relational Overreach", what: "Substituting the practitioner's personal relationships for institutional legitimacy or formal mandate.", sign: "Personal rapport is cited as reason to bypass a verification, consultation, or accountability step.", recover: "Reinstate the bypassed step explicitly; treat rapport as what made the step easier, never as what made it unnecessary." },
  { name: "Diagnosis Without Follow-Through", what: "Correctly identifying a weak bond, then treating the diagnosis as the completed task.", sign: "An assessment is filed and cited, but no budget, personnel, or named owner is attached to its lowest-scoring finding.", recover: "Attach a resource request, owner, and timeline to the weakest finding before the assessment is considered complete." },
  { name: "Delay-Justification", what: "Invoking bond preservation to delay accountability, prosecution, or urgent protective action.", sign: "A call for patience postpones a decision credible evidence shows is urgent, especially where the delay benefits the party asking.", recover: "Treat relational language used to justify delay as a low institutional-relational signal demanding more scrutiny, not less." },
  { name: "Dissident-Delegitimization", what: "Demanding that a dissident or minority voice prove a mandate establishment actors are never asked to show.", sign: "The standing test is applied selectively to critics while majority actors are exempted.", recover: "Apply the standing test symmetrically to everyone claiming representative authority, and never to an individual's right to be heard." },
  { name: "Signature-Day Release", what: "Releasing pledged funds on signature or ceremony rather than on a verified relational condition (Conditional Escrow Waterfall).", sign: "Money flows to a later tranche while an earlier bond condition is unmet, or keeps flowing while the rupture index is at 60 per cent or more.", recover: "Release tranches in order, each only on its own verified condition; hold the clawback reserve and performance bond until Final Cession, and freeze the account during high rupture." },
  { name: "Prestige Forum", what: "Naming a dispute forum for its standing rather than for whether its award can be enforced against a State (Dispute Forum Enforceability Matrix).", sign: "The clause leaves sovereign immunity from jurisdiction and execution unaddressed, or seats the dispute in a party's own territory.", recover: "Add an express immunity waiver, choose a neutral seat, and prefer a venue whose award is enforceable under the New York or ICSID Convention." },
  { name: "Unattended Settlement", what: "Treating a signed accord as finished and leaving its bonds without maintenance (Decay Horizon).", sign: "Shocks remain uninsulated and no renewal or re-verification is scheduled, so the stability half-life keeps shortening.", recover: "Insulate the open shocks, lower rupture where possible, and set re-verification dates well inside the current half-life." },
];

type Tab = "say" | "watch";

export default function FieldLexicon() {
  const [tab, setTab] = useState<Tab>("say");
  const [sel, setSel] = useState(0);
  const [fail, setFail] = useState(0);
  const [copied, setCopied] = useState(false);
  const s = SCRIPTS[sel];
  const f = FAILURES[fail];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`"${s.line}"\n(Vinculum Diplomacy Handbook §9A, ${s.bond})`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch { /* clipboard unavailable */ }
  };

  const tabBtn = (t: Tab, label: string) => (
    <button
      type="button" role="tab" aria-selected={tab === t} onClick={() => setTab(t)}
      className={`px-4 py-2 text-[11px] uppercase tracking-[0.2em] font-semibold border-b-2 transition-colors ${
        tab === t ? "border-accent text-primary" : "border-transparent text-foreground/60 hover:text-primary"
      }`}
    >{label}</button>
  );

  return (
    <div>
      <p className="text-muted-foreground max-w-3xl mb-6">
        The principles become words at the table. Each line below tests a bond rather than assuming it,
        and each failure mode is what the practice looks like when it goes wrong, with the way back.
      </p>

      <div role="tablist" className="flex gap-2 border-b border-border mb-6">
        {tabBtn("say", "In the room")}
        {tabBtn("watch", "Failure modes")}
      </div>

      {tab === "say" ? (
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {SCRIPTS.map((x, i) => (
              <button
                key={x.bond} type="button" onClick={() => setSel(i)} aria-pressed={sel === i}
                className={`text-left p-3 border transition-colors ${sel === i ? "border-brass bg-gold-tint" : "border-border hover:border-brass/60"}`}
              >
                <span className="font-serif text-accent mr-2">{x.level}</span>
                <span className={`text-sm ${sel === i ? "text-primary font-medium" : "text-foreground/75"}`}>{x.bond}</span>
                <span className="block text-[11px] text-muted-foreground mt-0.5">{x.aim}</span>
              </button>
            ))}
          </div>

          <figure className="bg-navy-tint border border-border p-6 md:p-10 relative">
            <p className="eyebrow">{s.bond} · {s.aim}</p>
            <blockquote className="mt-5 font-serif italic text-primary text-2xl md:text-3xl leading-snug">
              “{s.line}”
            </blockquote>
            <hr className="gold-rule gold-rule-short my-6" />
            <p className="text-sm text-foreground/80"><span className="font-semibold text-accent">What it tests:</span> {s.tests}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                type="button" onClick={copy}
                className="px-4 py-2 border border-brass text-[11px] uppercase tracking-[0.2em] font-semibold text-primary hover:bg-gold-tint transition-colors"
              >{copied ? "Copied" : "Copy line"}</button>
              <span className="text-[11px] text-muted-foreground">Handbook §9A</span>
            </div>
            <p className="mt-6 text-xs italic text-muted-foreground">
              Illustrative starting points, not fixed formulas. Testing rather than assuming a bond's strength
              matters more than the exact wording.
            </p>
          </figure>

          <aside className="lg:col-start-2 border-l-2 border-accent pl-5">
            <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent">When there is no time · IV.B</p>
            <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
              Compress, do not abandon: a mental bond map in the seconds before the exchange, one sharply
              targeted question on communal standing, and a note of which bond the speed left untouched,
              to return to once the acute phase passes. Never mistake speed for the absence of a gap.
            </p>
          </aside>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[16rem_1fr]">
          <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
            {FAILURES.map((x, i) => (
              <button
                key={x.name} type="button" onClick={() => setFail(i)} aria-pressed={fail === i}
                className={`text-left p-3 border text-sm transition-colors ${fail === i ? "border-brass bg-gold-tint text-primary font-medium" : "border-border text-foreground/75 hover:border-brass/60"}`}
              >{x.name}</button>
            ))}
          </div>
          <article className="bg-navy-tint border border-border p-6 md:p-10">
            <p className="eyebrow">Part V · §15 Failure Modes</p>
            <h3 className="mt-3 font-serif text-primary text-2xl md:text-3xl">{f.name}</h3>
            <p className="mt-3 text-foreground/85 leading-relaxed">{f.what}</p>
            <hr className="gold-rule gold-rule-short my-6" />
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-accent">Warning sign</p>
                <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{f.sign}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] font-semibold text-primary">Recovery</p>
                <p className="mt-2 text-sm text-foreground/85 leading-relaxed">{f.recover}</p>
              </div>
            </div>
          </article>
        </div>
      )}
    </div>
  );
}
