import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import ReadingProgress from "@/components/ReadingProgress";

const ROMAN = ["I","II","III","IV","V","VI","VII","VIII","IX","X","XI"];


const FOUNDATIONS = [
  {
    letter: "A",
    title: "Human Security",
    body: "The 1994 UNDP Human Development Report redefined the referent object of security, shifting focus from the state to the individual, organized around freedom from want and freedom from fear. Vinculum Security adopts this foundational move as its own point of departure.",
  },
  {
    letter: "B",
    title: "Ubuntu Philosophy",
    body: "Ubuntu holds that personhood is constituted relationally: umuntu ngumuntu ngabantu — a person is a person through other persons. Menkiti's radical communitarian thesis and Gyekye's moderate reading debate how strongly this holds. Vinculum Security is built to survive either resolution of that debate.",
  },
  {
    letter: "C",
    title: "Political Realism",
    body: "Morgenthau's Politics Among Nations holds that politics is governed by objective laws rooted in human nature and that national interest is defined in terms of power. Vinculum Security does not dispute this; it adds that an accurate accounting of an outcome's durability must include the relational bonds it depends on, since those bonds are themselves a component of a state's actual capacity.",
  },
  {
    letter: "D",
    title: "Securitization Theory",
    body: "The Copenhagen School treats security as a discursive act rather than an objective condition. Vinculum Security makes a substantive counter-claim: relational bonds are real, independent of whether any actor has framed them as security matters. The two converge on one caution — against overuse of emergency framing.",
  },
  {
    letter: "E",
    title: "Positive Peace",
    body: "Galtung distinguished negative from positive peace, defined from 1969 onward as the absence of structural violence built into social and institutional arrangements. Vinculum Security is a relational specification of positive peace, diagnosed at the level of specific, nameable relationships rather than systemic distributive arrangements.",
  },
  {
    letter: "F",
    title: "Responsibility to Protect",
    body: "R2P, endorsed at the 2005 World Summit, reframed sovereignty as responsibility. R2P relocates obligation; Vinculum Security relocates the referent object — from the protected population to the bonds that make protection possible. Bond scores never substitute for an R2P-relevant factual determination.",
  },
  {
    letter: "G",
    title: "Youth, Peace and Security",
    body: "UNSCR 2250 (2015) established five pillars: participation, protection, prevention, partnerships, and disengagement and reintegration. Vinculum Security treats this architecture as its primary field of institutional application, adding a diagnostic supplement: whether the required activity strengthened a genuine intergenerational bond or merely satisfied a procedural requirement.",
  },
  {
    letter: "H",
    title: "African Continental Frameworks",
    body: "The African Union's Agenda 2063 names intergenerational dialogue under its fourth aspiration and commits under its sixth to people-driven development anchored in the potential of women and youth. This gives the doctrine's intergenerational claim a continental policy anchor distinct from, but complementary to, the UN's YPS architecture.",
  },
  {
    letter: "I",
    title: "Relational & Restorative Justice",
    body: "Liberia-focused relational justice scholarship argues peacebuilding approaches focused solely on formal institutions give insufficient attention to relational harm. Howard Zehr's restorative justice tradition (Changing Lenses, 1990) reframes crime as a violation of people and relationships rather than only an offense against the state — a second, independent evidentiary anchor.",
  },
  {
    letter: "J",
    title: "Confucian Role Ethics",
    body: "Ames and Rosemont's Confucian Role Ethics holds that a person is not a discrete, autonomous individual but is relationally constituted by the roles they live. This corroborates the doctrine's ontology through an entirely independent civilizational tradition, answering the charge that the doctrine's ontology rests on one region's thought alone.",
  },
  {
    letter: "K",
    title: "Women, Peace and Security",
    body: "UNSCR 1325 (2000) was the first resolution to recognize that armed conflict affects women and girls disproportionately and distinctly, and that women's full and meaningful participation is essential to durable peace. Vinculum Security treats WPS as YPS's direct sibling framework, applying the same diagnostic supplement.",
  },
];

export default function Foundations() {
  return (
    <>
      <SEO
        title="Theoretical Foundations"
        description="The eleven traditions Vinculum Security draws from — from Human Security and Ubuntu to Confucian Role Ethics and Women, Peace and Security."
        path="/foundations"
      />
      <ReadingProgress />
      <div className="container">
        <PageHeader
          eyebrow="Section II"
          title="Theoretical Foundations"
          lede="Vinculum Security is grounded in eleven independent traditions. Each entry summarizes the tradition's core move and what the doctrine takes from it."
        />

        <FadeIn className="flex gap-2 flex-wrap mb-8">
          <DiplomatBadge variant="foundation">Eleven Traditions</DiplomatBadge>
          <DiplomatBadge variant="field-notes">Comparative Reading</DiplomatBadge>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 pb-8">
          {FOUNDATIONS.map((f, i) => (
            <FadeIn key={f.letter} delay={i * 40}>
              <article className="group relative bg-card border border-border p-6 md:p-7 h-full hover-lift overflow-hidden">
                <span
                  aria-hidden
                  className="absolute top-4 right-5 font-serif text-brass/40 text-3xl group-hover:text-brass transition-colors"
                >
                  {ROMAN[i]}
                </span>
                <div className="flex items-baseline gap-4">
                  <span className="font-serif text-accent text-lg">{f.letter}</span>
                  <h2 className="font-serif text-primary text-xl pr-10">{f.title}</h2>
                </div>
                <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                <p className="text-[0.95rem] leading-relaxed text-foreground/85">{f.body}</p>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
