import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";

const PRINCIPLES = [
  {
    n: "4",
    title: "Interpersonal Practice",
    line: "Trust between named counterparts is a diplomatic asset to be built and tested deliberately, not a byproduct assumed to follow from position or protocol.",
  },
  {
    n: "5",
    title: "Communal Practice",
    line: "A practitioner's or counterpart's standing to speak for a community must be treated as a claim to be tested, not a credential to be assumed.",
  },
  {
    n: "6",
    title: "Intergenerational Practice",
    line: "The presence of youth is necessary but not sufficient; the standard is whether their presence carries standing that would survive the current funding cycle, political moment, or personal relationship that brought them into the room.",
  },
  {
    n: "7",
    title: "Institutional-Relational Practice",
    line: "Durable diplomatic outcomes are designed to survive a change in the people who negotiated them, not dependent on the continued goodwill or tenure of any single official.",
  },
];

export default function Practice() {
  return (
    <>
      <SEO
        title="Vinculum Diplomacy"
        description="The applied diplomatic practice derived from the Vinculum Security doctrine — foundations, the core behavioral shift, and the four practice principles."
        path="/practice"
      />
      <div className="container">
        <PageHeader
          eyebrow="Companion Handbook"
          title="Practice: Vinculum Diplomacy"
          lede="The applied diplomatic practice derived from the Vinculum Security doctrine. Where the doctrine states what security is, the handbook states what a diplomat does differently once that claim is held to be true."
        />

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">Statement of Origination</p>
          <div className="mt-5">
            <PullQuote cite="James Wesley Ndua, founding principle">
              I cannot leave the community or the people and substitute it for a role or a room.
            </PullQuote>
          </div>
          <div className="mt-8 prose-body text-foreground/85">
            <p>
              Vinculum Diplomacy was conceived and first named by James Wesley Ndua in 2026, as the necessary practice
              counterpart to the Vinculum Security doctrine articulated the same year. A security doctrine that redefines
              the referent object of security implies a corresponding shift in diplomatic conduct; this handbook makes
              that implication explicit and operational.
            </p>
            <p>
              The working principle above — the personal root of the doctrine itself — is also the founding behavioral
              commitment of the practice. Vinculum Diplomacy is, in the simplest terms, what it looks like to conduct
              diplomacy as though this sentence were true in every room.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">Part I — Foundations of the Practice</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              A security doctrine that redefines the referent object of security carries an implicit demand on practice,
              whether or not that demand is made explicit. Human security redefined the referent object from the state to
              the individual; Vinculum Security redefines it a step further, from the individual to the bond. A diplomat
              who takes the bond seriously as the object of security will necessarily conduct negotiation, mediation, and
              representation differently than one who does not.
            </p>
            <p>
              The single behavioral shift beneath every principle can be stated plainly: a Vinculum diplomat evaluates
              every action, agreement, and relationship not only by whether it resolves the immediate dispute, but by
              whether it strengthens, ignores, or damages the relational bonds the affected parties depend upon for
              their ongoing safety and dignity. This is a second, standing question asked alongside every conventional
              diplomatic judgment, not a replacement for it.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="mb-16">
          <p className="eyebrow">Part II — The Four Practice Principles</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <article key={p.n} className="bg-navy-tint border border-border p-6">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-accent">§ {p.n}</span>
                  <h3 className="font-serif text-primary">{p.title}</h3>
                </div>
                <hr className="gold-rule gold-rule-short mt-3 mb-3" />
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">{p.line}</p>
              </article>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl pb-8">
          <p className="text-sm italic text-muted-foreground">
            The handbook includes practical tools for negotiators and mediators — a live-room diagnostic method, pre-negotiation
            bond-mapping templates, in-session and post-agreement guidance, applied case walkthroughs, and a staged personal
            practice standard.
          </p>
        </FadeIn>
      </div>
    </>
  );
}
