import SEO from "@/components/SEO";
import { sectionLd } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import NumeralDivider from "@/components/NumeralDivider";
import ReadingProgress from "@/components/ReadingProgress";
import BondDiagnostic from "@/components/BondDiagnostic";
import FieldLexicon from "@/components/FieldLexicon";

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
        description="The applied diplomatic practice derived from the Vinculum Security doctrine: foundations, the core behavioral shift, and the four practice principles. An operational, field-ready companion handbook, complete and intended for direct use by practitioners."
        path="/practice"
        image="/og/practice.jpg"
        keywords="Vinculum Diplomacy, relational security practice, bond-centred diplomacy, practitioner guidance, diplomatic security, operational diplomacy handbook, field-ready peacebuilding method"
        scholarly
        citationTitle="Vinculum Diplomacy: The Companion Handbook"
        jsonLd={sectionLd({
          path: "/practice",
          headline: "Vinculum Diplomacy: The Companion Handbook",
          description:
            "The applied diplomatic practice derived from the Vinculum Security doctrine: foundations, the core behavioral shift, and the four practice principles.",
          section: "Companion Handbook — Practice",
        })}
      />
      <ReadingProgress />
      <div className="container">
        <PageHeader
          eyebrow="Companion Handbook"
          title="Practice: Vinculum Diplomacy"
          lede="The applied diplomatic practice derived from the Vinculum Security doctrine. Where the doctrine states what security is, the handbook states what a diplomat does differently once that claim is held to be true."
        />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="handbook">Practitioner Handbook</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Field-Ready</DiplomatBadge>
        </FadeIn>

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
              The working principle above, the personal root of the doctrine itself, is also the founding behavioral
              commitment of the practice. Vinculum Diplomacy is, in the simplest terms, what it looks like to conduct
              diplomacy as though this sentence were true in every room.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">Part I · Foundations of the Practice</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              A security doctrine that establishes the bond as its referent object carries an implicit demand on practice,
              whether or not that demand is made explicit. Vinculum Security begins from its own distinct claim that the
              bond is the unit of security analysis. A diplomat
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

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">§3A · Relation to the Annan Method</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              Vinculum Diplomacy stands in direct lineage with the mediation practice associated with
              Kofi Annan (most visibly the 2008 AU Panel mediation in Kenya), which treated named
              relationships, community standing, and continuity of institutions across leadership change
              as first-order diplomatic material rather than as background conditions. Where the Annan
              method modelled this practice through personal authority, Vinculum Diplomacy names its
              components so that they can be taught, tested, and carried by practitioners who do not
              have that authority to lend.
            </p>
          </div>
        </FadeIn>

        <div className="mb-16">
          <BondDiagnostic />
        </div>

        <NumeralDivider n="IV" label="Practice Principles" />


        <FadeIn className="mb-16">
          <p className="eyebrow">Part II · The Four Practice Principles</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="grid gap-5 md:grid-cols-2">
            {PRINCIPLES.map((p) => (
              <article key={p.n} className="group relative bg-navy-tint border border-border p-6 hover-lift overflow-hidden">
                <div className="flex items-baseline gap-3">
                  <span className="font-serif text-accent">§ {p.n}</span>
                  <h3 className="font-serif text-primary">{p.title}</h3>
                </div>
                <hr className="gold-rule gold-rule-short mt-3 mb-3" />
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">{p.line}</p>
                <div className="mt-4 h-px w-0 bg-accent group-hover:w-full transition-all duration-700" />
              </article>
            ))}
          </div>
        </FadeIn>

        <section id="lexicon" className="scroll-mt-24 mb-16">
          <FadeIn>
            <p className="eyebrow">§9A · The Field Lexicon</p>
            <h2 className="mt-3 font-serif text-primary">Words for the room</h2>
            <GoldRule className="mt-4 mb-6" />
            <FieldLexicon />
          </FadeIn>
        </section>

        <FadeIn className="mb-16">
          <p className="eyebrow">Part IV · Practice Under Constraint</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="grid gap-5 md:grid-cols-2">
            <article className="bg-navy-tint border border-border p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-accent">IV.B</span>
                <h3 className="font-serif text-primary">Under Time Constraint</h3>
              </div>
              <hr className="gold-rule gold-rule-short mt-3 mb-3" />
              <p className="text-[0.95rem] leading-relaxed text-foreground/85">
                When a full pre-negotiation bond map is not possible, the practitioner narrows to one
                question at each continuum level and records the single most exposed bond per level.
                The record is preserved so a fuller reading can be completed later; the shortcut is
                declared, not disguised.
              </p>
            </article>
            <article className="bg-navy-tint border border-border p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-serif text-accent">IV.C</span>
                <h3 className="font-serif text-primary">Under WPS &amp; Child-Protection Boundaries</h3>
              </div>
              <hr className="gold-rule gold-rule-short mt-3 mb-3" />
              <p className="text-[0.95rem] leading-relaxed text-foreground/85">
                Meaningful participation is tested against outcomes, not headcount; gendered harm is
                named explicitly in the bond map; and children participate only where an existing
                mandated child-protection framework is in force. A bond map that would otherwise
                improve on paper by placing children in a room without those safeguards is treated as
                a failure of the practice, not a success.
              </p>
            </article>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-20">
          <p className="text-sm italic text-muted-foreground">
            The handbook includes a live-room diagnostic method, pre-negotiation bond-mapping templates,
            and applied case walkthroughs across the doctrine's eight documented cases, including the
            introduction of the <em>continuity provision</em>: a clause or mechanism built into an
            agreement specifically to survive a change in the officeholders who negotiated it.
          </p>
          <p className="mt-4 text-sm text-foreground/75">
            The handbook is operational rather than provisional. It is complete and intended for direct use in the
            room, alongside the doctrine, by practitioners working now.
          </p>
        </FadeIn>

      </div>
    </>
  );
}
