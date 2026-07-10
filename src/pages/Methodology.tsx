import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Cite from "@/components/Cite";
import ReadingProgress from "@/components/ReadingProgress";
import PrintFootnotes from "@/components/PrintFootnotes";

const CITED = ["diagnostic-question", "interpersonal", "communal", "intergenerational", "institutional-relational"];

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
      </div>
    </>
  );
}
