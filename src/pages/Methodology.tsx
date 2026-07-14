import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Cite from "@/components/Cite";
import ReadingProgress from "@/components/ReadingProgress";
import PrintFootnotes from "@/components/PrintFootnotes";

const CITED = ["diagnostic-question", "interpersonal", "communal", "intergenerational", "institutional-relational", "party-differentiated"];

const PARTIES = [
  ["Children", "Protection first; presence never treated as consent.", "Age-appropriate participation only where a mandated child-protection framework is already in force."],
  ["Youth", "Intergenerational bond; standing, not attendance.", "Delegate placement counted only after the sending community would recognise the delegate on return."],
  ["Elders", "Continuity of intergenerational transfer.", "Formal role in verifying whether knowledge and standing have actually been passed on."],
  ["Women", "Direct application of WPS as YPS's sibling framework.", "Meaningful participation tested against outcomes, not headcount; gendered harm named explicitly in the bond map."],
  ["Government", "Institutional-relational bond with the served population.", "Bond scores never substitute for a factual determination of protection obligation."],
  ["Civil Society", "Communal standing as the tested credential.", "Standing to speak for a community treated as a claim to be tested, not a credential to be assumed."],
  ["Ex-Combatants", "Interpersonal and communal bonds under reintegration.", "Reintegration measured by community-recognised standing over time, not by disarmament count alone."],
];

const INDICATORS = [
  {
    level: "Interpersonal",
    indicator: "Persistence of trust between named negotiators across sessions and setbacks.",
    question: "Would this relationship survive a bad-faith moment intact?",
  },
  {
    level: "Communal",
    indicator: "Persistence of community-recognized standing for negotiators and mediators.",
    question: "Does this actor's authority survive contact with the community, not just the institution?",
  },
  {
    level: "Intergenerational",
    indicator: "Rate of knowledge and trust transfer between youth and elder leadership in peace structures.",
    question: "Are youth present at the table, or only in the room?",
  },
  {
    level: "Institutional-Relational",
    indicator: "Continuity of relationship between an institution and its population across leadership transitions.",
    question: "Would this bond survive a change in personnel or office?",
  },
];

export default function Methodology() {
  return (
    <>
      <SEO
        title="Methodology"
        description="The diagnostic method and bond-integrity indicators used to assess a case, drawn from Section V of the Vinculum Security doctrine."
        path="/methodology"
      />
      <ReadingProgress />
      <div className="container">
        <PageHeader eyebrow="Section V" title="Operational Framework" />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="methodology">Operational Framework</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Diagnostic Tools</DiplomatBadge>
        </FadeIn>

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">V.A — The Diagnostic Method</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="mb-6">
            <PullQuote>
              Are the bonds this person, community, or generation depends upon intact — and if an intervention protected the individual or institution while ignoring those bonds, has it delivered security at all?
            </PullQuote>
          </div>
          <div className="prose-body text-foreground/85">
            <p>
              Vinculum Security is applied through a recurring{" "}
              <Cite term="diagnostic-question">diagnostic question</Cite> at each continuum level. The
              question is asked identically at the <Cite term="interpersonal">interpersonal</Cite>,{" "}
              <Cite term="communal">communal</Cite>, <Cite term="intergenerational">intergenerational</Cite>,
              and <Cite term="institutional-relational">institutional-relational</Cite> levels, producing
              a picture of where security is materially present and where it is only nominally reported.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="mb-16">
          <p className="eyebrow">V.B — Bond-Integrity Indicators</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Each continuum level has an illustrative indicator and a diagnostic question, held together across cases so
            that a comparison is grounded in the same working definitions each time.
          </p>

          <div className="space-y-6">
            {INDICATORS.map((it) => (
              <div key={it.level} className="grid md:grid-cols-[220px_1fr] gap-4 md:gap-8 border-l-2 border-accent pl-5 md:pl-6 py-2">
                <h3 className="font-serif text-primary">{it.level}</h3>
                <div>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1" style={{ letterSpacing: "0.18em" }}>
                    Indicator
                  </p>
                  <p className="mb-4 text-foreground/90">{it.indicator}</p>
                  <p className="text-sm uppercase tracking-widest text-muted-foreground mb-1" style={{ letterSpacing: "0.18em" }}>
                    Diagnostic Question
                  </p>
                  <p className="italic font-serif text-primary">{it.question}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="mb-16">
          <p className="eyebrow">VI — Party-Differentiated Application</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-6 max-w-3xl">
            The <Cite term="party-differentiated">party-differentiated layer</Cite> ensures the doctrine
            addresses children, youth, elders, women, government, civil society, and ex-combatants
            distinctly, so that a single scoring rubric does not flatten their unlike stakes into a
            common average.
          </p>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground text-left">
                  <th className="px-4 py-3 font-serif font-medium">Party</th>
                  <th className="px-4 py-3 font-serif font-medium">Bond Focus</th>
                  <th className="px-4 py-3 font-serif font-medium">Practice Adjustment</th>
                </tr>
              </thead>
              <tbody>
                {PARTIES.map((row, i) => (
                  <tr key={row[0]} className={i % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                    <td className="px-4 py-3 align-top font-medium text-primary">{row[0]}</td>
                    <td className="px-4 py-3 align-top">{row[1]}</td>
                    <td className="px-4 py-3 align-top text-foreground/85">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <PrintFootnotes terms={CITED} />
      </div>
    </>
  );
}
