import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import DiplomatBadge from "@/components/DiplomatBadge";
import NumeralDivider from "@/components/NumeralDivider";
import Cite from "@/components/Cite";

const COMPARISON = [
  ["State Security", "The state", "Security as survival against external military threat", "Westphalian tradition"],
  ["Political Realism", "The state, defined by power", "Interest defined as power; universal moral principles do not bind state action", "Morgenthau, 1948"],
  ["Human Security", "The individual person", "Shifts referent object from state to person; freedom from fear and want", "UNDP 1994; Annan"],
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
  { n: "I", title: "Interpersonal", body: "Bonds between two named individuals, regardless of role — the trust that survives a bad-faith moment intact." },
  { n: "II", title: "Communal", body: "Bonds between an individual or institution and a group within a single generational cohort — standing tested by the community itself." },
  { n: "III", title: "Intergenerational", body: "Bonds between distinct generational cohorts — the transfer of knowledge, trust, and standing between youth and elder leadership." },
  { n: "IV", title: "Institutional-Relational", body: "Bonds between an institution and the population it is mandated to serve, tested across a change in personnel or office." },
];

export default function Doctrine() {
  return (
    <>
      <SEO
        title="The Doctrine"
        description="Section III of Vinculum Security: canonical definition, ontological claim, comparative positioning, and the four-level Vinculum Continuum."
        path="/doctrine"
      />
      <div className="container">
        <PageHeader eyebrow="Section III" title="The Vinculum Security Doctrine" />

        <FadeIn className="max-w-4xl mb-16">
          <p className="eyebrow">III.A — Canonical Definition</p>
          <div className="mt-5">
            <PullQuote cite="Canonical Definition, 2026">
              Vinculum Security holds that security is not the absence of threat to a state or an individual, but the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible in the first place.
            </PullQuote>
          </div>
        </FadeIn>

        <FadeIn className="max-w-4xl mb-20">
          <p className="eyebrow">III.B — The Ontological Claim</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/90">
            <p>
              First, drawing from Ubuntu and Confucian Role Ethics independently: personhood is constituted, wholly or substantially,
              relationally rather than individually.
            </p>
            <p>
              Second, drawing from human security: security is properly assessed with reference to the person, not the state alone.
            </p>
            <p>
              Third, original to this doctrine: security assessed only at the individual level is incomplete, because it can report a
              person as secure while the bonds constituting that person's safety and dignity are eroding. The proper unit of security
              analysis is the bond.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="mb-20">
          <p className="eyebrow">III.C — Comparative Positioning</p>
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

        <FadeIn className="mb-16">
          <p className="eyebrow">III.D — The Vinculum Continuum</p>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-muted-foreground mb-8 max-w-3xl">
            Vinculum Security operates across four nested levels, governed by explicit boundary and weighting rules.
          </p>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {CONTINUUM.map((c) => (
              <div key={c.title} className="bg-navy-tint border border-border p-6">
                <p className="font-serif text-3xl text-accent">{c.n}</p>
                <h3 className="mt-3 font-serif text-primary">{c.title}</h3>
                <hr className="gold-rule gold-rule-short mt-3 mb-3" />
                <p className="text-sm text-foreground/80 leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-8">
          <p className="text-sm italic text-muted-foreground">
            The doctrine states explicit falsifiability criteria (Section IV).
          </p>
        </FadeIn>
      </div>
    </>
  );
}
