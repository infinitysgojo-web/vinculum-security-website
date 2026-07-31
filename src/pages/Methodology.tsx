import SEO from "@/components/SEO";
import { sectionLd } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Cite from "@/components/Cite";
import ReadingProgress from "@/components/ReadingProgress";
import PrintFootnotes from "@/components/PrintFootnotes";

const CITED = ["diagnostic-question", "interpersonal", "communal", "intergenerational", "institutional-relational", "party-differentiated", "scoring-rubric", "government-non-self-assessment"];

const RUBRIC: [string, string][] = [
  ["1", "Severed or actively hostile. The bond is absent, broken, or characterized by active distrust; no functioning channel of relationship exists between the parties."],
  ["2", "Nominal or superficial. A bond exists in form, such as a signed provision, a stated commitment, or a consultative body, but shows little evidence of substantive trust or durability under stress."],
  ["3", "Mixed or contested. Credible evidence exists on both sides: genuine relational progress in some respects, alongside documented gaps, disputes, or unresolved grievance in others."],
  ["4", "Functional and tested. The bond has been tested by at least one significant setback, disagreement, or transition and has held, though some vulnerability or incompleteness remains."],
  ["5", "Fully durable and institutionalized. The bond has been tested repeatedly over an extended period, including through leadership transitions or major shocks, with strong evidence of continuity independent of any single individual or event."],
];


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
        image="/og/methodology.jpg"
        keywords="bond integrity indicators, relational security assessment, Vinculum Security methodology, diagnostic framework"
        scholarly
        citationTitle="Vinculum Security: Operational Framework and Methodology"
        jsonLd={sectionLd({
          path: "/methodology",
          headline: "Vinculum Security: Operational Framework",
          description:
            "The diagnostic method and bond-integrity indicators used to assess a case, drawn from Section V of the Vinculum Security doctrine.",
          section: "Section V — Methodology",
        })}
      />
      <ReadingProgress />
      <div className="container">
        <PageHeader eyebrow="Section V" title="Operational Framework" />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="methodology">Operational Framework</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Diagnostic Tools</DiplomatBadge>
        </FadeIn>

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">V.A · The Diagnostic Method</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="mb-6">
            <PullQuote>
              Are the bonds this person, community, or generation depends upon intact, and if an intervention protected the individual or institution while ignoring those bonds, has it delivered security at all?
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
          <p className="eyebrow">V.B · Bond-Integrity Indicators</p>
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
          <p className="eyebrow">V.E · Scoring Rubric and Descriptive Anchors</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-6 max-w-3xl">
            Earlier editions assigned numeric scores without stating, in advance, what distinguishes
            a 2 from a 3, or a 3 from a 4. The <Cite term="scoring-rubric">descriptive-anchor
            rubric</Cite> below narrows that judgment without pretending to eliminate it, and gives
            any future independent rater a stated standard to check a score against rather than only
            the doctrine's narrative framing of a case.
          </p>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground text-left">
                  <th className="px-4 py-3 font-serif font-medium w-24">Score</th>
                  <th className="px-4 py-3 font-serif font-medium">Descriptive Anchor</th>
                </tr>
              </thead>
              <tbody>
                {RUBRIC.map(([score, anchor], i) => (
                  <tr key={score} className={i % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                    <td className="px-4 py-3 align-top font-serif text-2xl text-accent">{score}</td>
                    <td className="px-4 py-3 align-top text-foreground/85">{anchor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        <FadeIn className="mb-16">
          <p className="eyebrow">VI · Party-Differentiated Application</p>
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

          <div className="grid gap-4 md:grid-cols-2 mt-6">
            <div className="border-l-2 border-accent bg-navy-tint/60 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                Child-Protection Carve-Out
              </p>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                The communal-standing verification test is <em>never</em> applied to a child's right
                to be protected or heard, and only to adults or institutions claiming to represent a
                community. The carve-out is absolute.
              </p>
            </div>
            <div className="border-l-2 border-accent bg-navy-tint/60 p-5">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                <Cite term="government-non-self-assessment">Government Non-Self-Assessment</Cite>
              </p>
              <p className="mt-2 text-sm text-foreground/85 leading-relaxed">
                A government's own claim of strong institutional-relational bond-integrity is a
                hypothesis requiring independent verification, never a self-certifying conclusion.
                A structural safeguard against the delay-justification risk.
              </p>
            </div>
          </div>
        </FadeIn>



        <PrintFootnotes terms={CITED} />
      </div>
    </>
  );
}
