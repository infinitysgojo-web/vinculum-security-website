import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { sectionLd, SITE_URL, PERSON_ID, AUTHOR_NAME } from "@/lib/seo-entities";
import { PANELS, VERDICT_LABEL } from "@/content/adversarial";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import DiplomatBadge from "@/components/DiplomatBadge";
import NumeralDivider from "@/components/NumeralDivider";
import Cite from "@/components/Cite";
import CiteWork from "@/components/CiteWork";
import ReadingProgress from "@/components/ReadingProgress";
import WallChart from "@/components/WallChart";


import PrintFootnotes from "@/components/PrintFootnotes";


const CITED = [
  "ubuntu", "menkiti-gyekye", "confucian-role-ethics", "human-security",
  "bond", "vinculum-continuum", "political-realism",
  "nomenclature-african", "boundary-weighting",
  "scoring-rubric", "cross-case-pattern", "adversarial-rescoring",
];


const COMPARISON = [
  ["State Security", "The state", "Security as survival against external military threat", "Westphalian tradition"],
  ["Political Realism", "The state, defined by power", "Interest defined as power; universal moral principles do not bind state action", "Morgenthau, 1948"],
  ["Human Security", "The individual person", "Shifts referent object from state to person; freedom from fear, freedom from want, freedom to live in dignity", "UNDP 1994; Haq and Sen"],
  ["Responsibility to Protect", "Populations at risk of atrocity", "Shifts locus of obligation; sovereignty as responsibility", "ICISS 2001; World Summit 2005"],
  ["Securitization", "Whatever is successfully framed as existential threat", "Security as a discursive act, not a fixed condition", "Buzan, Wæver, de Wilde, 1998"],
  ["Positive Peace", "Social structures and institutions", "Peace as absence of structural violence, not just direct violence", "Galtung, 1969"],
  ["Restorative Justice", "The relationship violated by harm", "Justice as repair of relationship, not only punishment of the state's law", "Zehr, 1990"],
  ["Confucian Role Ethics", "The person as relationally constituted role-bearer", "Personhood is constituted by lived roles and relations, not prior individual autonomy", "Ames and Rosemont, 2011"],
  ["Women, Peace and Security", "Women and girls in conflict and peace processes", "Gender-differentiated harm and participation as a distinct pillar of peace and security", "UNSCR 1325, 2000"],
  ["Agenda 2063 (Asp. 4 & 6)", "The African continent and its peoples", "Peace and people-driven development anchored in intergenerational dialogue", "AU, 2015"],
  ["Vinculum Security", "The relational bond itself", "Shifts referent object from person to the bonds that constitute the person's safety and dignity", "Ndua, 2026"],
];

const CONTINUUM = [
  { n: "I", title: "Interpersonal", body: "Bonds between two named individuals, regardless of role. The trust that survives a bad-faith moment intact." },
  { n: "II", title: "Communal", body: "Bonds between an individual or institution and a group within a single generational cohort. Standing is tested by the community itself." },
  { n: "III", title: "Intergenerational", body: "Bonds between distinct generational cohorts, carrying the transfer of knowledge, trust, and standing between youth and elder leadership." },
  { n: "IV", title: "Institutional-Relational", body: "Bonds between an institution and the population it is mandated to serve, tested across a change in personnel or office." },
];

/**
 * Section X, The Adversarial Review, expressed as structured data so search
 * engines and AI answer engines can read each challenge and its answer.
 */
const adversarialLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/doctrine#adversarial-review`,
  name: "Vinculum Security, Section X: The Adversarial Review",
  description:
    "Twelve adversarial panels put thirty challenges to the Vinculum Security doctrine, covering realist power critiques, fidelity to Ubuntu and Confucian role ethics, falsifiability, measurement, international law and sovereignty, bad-faith actors, and child protection and gender boundaries. Each challenge carries the doctrine's answer and its status: answered, partly conceded, or held open.",
  url: `${SITE_URL}/doctrine#adversarial-review`,
  numberOfItems: PANELS.reduce((n, p) => n + p.exchanges.length, 0),
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  itemListElement: PANELS.flatMap((p) =>
    p.exchanges.map((e) => ({
      "@type": "Question",
      name: e.q,
      answerCount: 1,
      about: { "@type": "Thing", name: `${p.title} (${p.lens})` },
      acceptedAnswer: {
        "@type": "Answer",
        text: `${e.a} Status: ${VERDICT_LABEL[e.verdict]}.${e.ref ? ` Doctrine ${e.ref}.` : ""}`,
        url: `${SITE_URL}/doctrine#adversarial-review`,
        author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
      },
    }))
  ).map((q, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: q,
  })),
};

export default function Doctrine() {
  return (
    <>
      <SEO
        title="The Doctrine"
        description="The canonical definition of Vinculum Security: security is the integrity of the bonds between persons, communities, and generations, read across the four-level Vinculum Continuum."
        path="/doctrine"
        image="/og/doctrine.jpg"
        keywords="Vinculum Security doctrine, a doctrine of relational security, relational security doctrine, Vinculum Continuum, bond integrity, James Wesley Ndua"
        scholarly
        citationTitle="The Vinculum Security Doctrine"
        jsonLd={[
          sectionLd({
            path: "/doctrine",
            headline: "The Vinculum Security Doctrine",
            description:
              "Section III of Vinculum Security: canonical definition, ontological claim, comparative positioning, and the four-level Vinculum Continuum.",
            section: "Section III: The Doctrine",
          }),
          adversarialLd,
        ]}
      />
      <ReadingProgress />
      
      <div className="container">
        <PageHeader eyebrow="Section III" title="The Vinculum Security Doctrine" />

        <FadeIn className="flex gap-2 flex-wrap items-center mb-10">
          <DiplomatBadge variant="doctrine-core">Doctrine Core</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Canonical Text</DiplomatBadge>
          <span className="ml-auto"><CiteWork part="Section III, The Vinculum Security Doctrine" path="/doctrine" /></span>
        </FadeIn>

        <section id="canonical" className="scroll-mt-24">
        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">III.A · Canonical Definition</p>
          <div className="mt-5">
            <PullQuote cite="Canonical Definition, 2026">
              Vinculum Security holds that security is not the absence of threat to a state or an individual, but the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible in the first place.
            </PullQuote>
          </div>
        </FadeIn>
        </section>

        <NumeralDivider n="II" label="Ontology" />

        <section id="ontology" className="scroll-mt-24">
        <FadeIn className="max-w-4xl mb-20">
          <p className="eyebrow">III.B · The Ontological Claim</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/90">
            <p>
              First, drawing on two independent civilizational traditions, <Cite term="ubuntu">Ubuntu</Cite>{" "}
              (and the internal <Cite term="menkiti-gyekye">Menkiti-Gyekye debate</Cite> within African
              philosophy itself) and <Cite term="confucian-role-ethics">Confucian Role Ethics</Cite>, the
              doctrine holds that personhood is constituted, wholly or substantially, relationally rather
              than individually. The convergence of two civilizationally independent traditions on the
              same conclusion is treated here as evidentiary strength, not coincidence.
            </p>
            <p>
              Second, in comparative dialogue with <Cite term="human-security">human security</Cite>, the doctrine
              recognizes that security must account for persons rather than states alone. Vinculum Security then makes
              its own distinct move: it identifies the relational bond as the referent object. <Cite term="political-realism">Political realism</Cite>{" "}
              is retained as counterweight rather than competitor.
            </p>
            <p>
              Third, original to this doctrine: security assessed only at the individual level is incomplete,
              because it can report a person as secure while the <Cite term="bond">bonds</Cite> constituting
              that person's safety and dignity are eroding. The proper unit of security analysis is the bond.
            </p>
          </div>
        </FadeIn>
        </section>


        <section id="comparison" className="scroll-mt-24">
        <FadeIn className="mb-20">
          <p className="eyebrow">III.C · Comparative Positioning</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-6 max-w-3xl">
            The table below situates Vinculum Security against the eleven frameworks from which it draws or against which it is distinguished.
          </p>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground text-left">
                  <th className="px-4 py-3 font-serif font-medium">Framework</th>
                  <th className="px-4 py-3 font-serif font-medium">Referent Object</th>
                  <th className="px-4 py-3 font-serif font-medium">Core Move</th>
                  <th className="px-4 py-3 font-serif font-medium">Origin</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                    <td className="px-4 py-3 align-top font-medium text-primary">{row[0]}</td>
                    <td className="px-4 py-3 align-top">{row[1]}</td>
                    <td className="px-4 py-3 align-top">{row[2]}</td>
                    <td className="px-4 py-3 align-top text-muted-foreground">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>
        </section>

        <NumeralDivider n="IV" label="The Continuum" />

        <section id="continuum" className="scroll-mt-24">
        <FadeIn className="mb-16">
          <p className="eyebrow">III.D · The Vinculum Continuum</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-8 max-w-3xl">
            <Cite term="vinculum-continuum">Vinculum Security operates across four nested levels</Cite>,
            governed by explicit boundary and weighting rules.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CONTINUUM.map((c) => (
              <div key={c.title} className="bg-navy-tint border border-border p-6 hover-lift">
                <p className="font-serif text-3xl text-accent">{c.n}</p>
                <h3 className="mt-3 font-serif text-primary">{c.title}</h3>
                <hr className="gold-rule gold-rule-short mt-3 mb-3" />
                <p className="text-sm text-foreground/80 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
        </section>

        <NumeralDivider n="V" label="Nomenclature" />

        <section id="nomenclature" className="scroll-mt-24">
        <FadeIn className="max-w-4xl mb-20">
          <p className="eyebrow">III.E · Nomenclature and the African Contribution</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/90">
            <p>
              The Latin <em>vinculum</em>, a bond or a tie, is chosen deliberately over any single
              African-language term, so that the doctrine can travel through diplomatic institutions
              already conducted in European working languages without being either mistranslated or
              treated as folk wisdom. The intellectual origin is African and remains so: the ontological
              claim is <Cite term="ubuntu">Ubuntu</Cite>'s, subsequently corroborated by Confucian role
              ethics. The doctrine is confidently African in origin and does not claim cultural
              neutrality.
            </p>
          </div>
        </FadeIn>
        </section>

        <section id="boundaries" className="scroll-mt-24">
        <FadeIn className="mb-20">
          <p className="eyebrow">III.F · Boundary Rules and Weighting</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-6 max-w-3xl">
            <Cite term="boundary-weighting">Explicit rules</Cite> govern how a bond is classified into a
            continuum level, and how bonds are weighted when they conflict.
          </p>
          <div className="grid gap-5 md:grid-cols-2">
            <div className="bg-navy-tint border border-border p-6">
              <p className="font-serif text-accent text-lg">Boundary Rules</p>
              <hr className="gold-rule gold-rule-short mt-2 mb-3" />
              <ul className="text-sm text-foreground/85 leading-relaxed space-y-2 list-disc pl-4">
                <li>Two named individuals, regardless of office → <em>Interpersonal</em>.</li>
                <li>An individual or institution and a group within one generation → <em>Communal</em>.</li>
                <li>Distinct generational cohorts → <em>Intergenerational</em>.</li>
                <li>An institution and the population it is mandated to serve → <em>Institutional-Relational</em>.</li>
              </ul>
            </div>
            <div className="bg-navy-tint border border-border p-6">
              <p className="font-serif text-accent text-lg">Weighting Principle</p>
              <hr className="gold-rule gold-rule-short mt-2 mb-3" />
              <p className="text-sm text-foreground/85 leading-relaxed">
                When bonds at different levels conflict, weight is given to the bond whose rupture would
                most reduce the affected persons' actual capacity for protection and dignity going
                forward, not to the bond most visible to the intervening institution. In practice, this
                usually elevates communal and intergenerational bonds against interventions that would
                otherwise privilege institutional convenience.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <WallChart />
          </div>
        </FadeIn>
        </section>


        <NumeralDivider n="VI" label="The Adversarial Review" />

        <section id="adversarial-review" className="scroll-mt-24">
        <FadeIn className="mb-20">
          <p className="eyebrow">Section X · The Adversarial Review</p>
          <h2 className="mt-3 font-serif text-primary">Tested by its critics</h2>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-foreground/85 leading-relaxed max-w-3xl">
            The doctrine has been put before {PANELS.length} standing lines of objection, from the
            realist and the securitisation critic to the practitioner who asks what any of this
            changes in a room. Each objection is recorded with the answer given, the ground
            conceded, and the point still open. The full record of these exchanges is held in the
            practitioner working desks rather than on the public page, so the argument here stays
            with the doctrine itself.
          </p>
        </FadeIn>

        </section>

        <FadeIn className="max-w-3xl mb-8">
          <p className="text-sm italic text-muted-foreground">
            The doctrine states explicit falsifiability criteria (Section IV); the concrete
            test-bed is the <Cite term="cross-case-pattern">Cross-Case Pattern Summary</Cite> of
            all thirty-two scores on the <Link to="/cases" className="text-accent hover:underline">Cases</Link> page,
            with the <Cite term="scoring-rubric">1-5 descriptive-anchor rubric</Cite> and the
            Rwanda <Cite term="adversarial-rescoring">adversarial-rescoring</Cite> demonstration
            supplying the method behind the numbers.
          </p>
        </FadeIn>


        <PrintFootnotes terms={CITED} />
        <div className="mt-16 p-8 border border-brass/50 bg-card/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-accent">
              Canonical Interpretation
            </p>
            <h3 className="font-serif text-xl text-primary font-medium">
              Doctrinal Commentary &amp; Interpretive Inquiries
            </h3>
            <p className="text-sm text-foreground/75 leading-relaxed max-w-xl">
              For complete derivations of Deterministic Relational Law, the Liebig Minimum, and the Arusha failure analysis, consult the formal repository.
            </p>
          </div>
          <a
            href="/commentary#ontology"
            className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-accent transition-colors"
          >
            Read Commentary →
          </a>
        </div>
      </div>
    </>
  );
}
