import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import NumeralDivider from "@/components/NumeralDivider";
import DiplomatBadge from "@/components/DiplomatBadge";
import {
  SITE_URL,
  AUTHOR_NAME,
  PERSON_ID,
  ORG_ID,
  BOOK_ID,
  DOI,
  DOI_URL,
  PUBLISHED,
  LICENSE_URL,
  CANONICAL_DEFINITION,
  ONTOLOGICAL_CLAIM,
  DISAMBIGUATION,
} from "@/lib/seo-entities";

const PATH = "/relational-security";
const DESCRIPTION =
  "Relational security, in the Vinculum Security doctrine, is the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible. The bond is the unit of security analysis.";

const LEVELS = [
  { n: "I", title: "Interpersonal", body: "Bonds between two named individuals, regardless of role." },
  { n: "II", title: "Communal", body: "Bonds between an individual or institution and a group within a single generational cohort." },
  { n: "III", title: "Intergenerational", body: "Bonds between distinct generational cohorts, carrying the transfer of knowledge, trust, and standing." },
  { n: "IV", title: "Institutional-Relational", body: "Bonds between an institution and the population it is mandated to serve, tested across a change in personnel or office." },
];

const FAQ = [
  {
    q: "What is relational security?",
    a: "In the Vinculum Security doctrine, relational security is the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible. Security is assessed by the condition of the bond rather than by the absence of threat to a state or an individual.",
  },
  {
    q: "Who originated A Doctrine of Relational Security?",
    a: "James Wesley Ndua, a diplomat and Youth, Peace and Security advocate based in Nairobi, Kenya. The doctrine is published as Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition, and this website is its canonical source.",
  },
  {
    q: "Is relational security the same as human security?",
    a: "No. Human security is one of thirteen traditions that Vinculum Security draws from and is distinguished against. Human security shifts the referent object of security from the state to the individual person; Vinculum Security shifts it again, from the person to the bonds that constitute that person's safety and dignity. Vinculum Security is not a sub-field or branch of human security.",
  },
  {
    q: "What is the unit of analysis in relational security?",
    a: "The bond. Security assessed only at the individual level is incomplete, because it can report a person as secure while the bonds constituting that person's safety and dignity are eroding.",
  },
  {
    q: "How is this different from relational security in forensic mental health?",
    a: "The phrase is also used in forensic mental health nursing to describe staff knowledge of and familiarity with patients in secure clinical settings. That is a distinct clinical usage. The Vinculum sense is a doctrine of security analysis in peace, diplomacy, and security studies, originated by James Wesley Ndua.",
  },
];

const LD = [
  {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${SITE_URL}${PATH}#definedterm`,
    name: "Relational security",
    alternateName: ["A Doctrine of Relational Security", "Vinculum Security"],
    url: `${SITE_URL}${PATH}`,
    description: DESCRIPTION,
    disambiguatingDescription: DISAMBIGUATION,
    inDefinedTermSet: { "@id": `${SITE_URL}/#terms` },
    subjectOf: { "@id": BOOK_ID },
    creator: { "@id": PERSON_ID },
    publisher: { "@id": ORG_ID },
    identifier: { "@type": "PropertyValue", propertyID: "DOI", value: DOI, url: DOI_URL },
    datePublished: PUBLISHED,
    license: LICENSE_URL,
    inLanguage: "en",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${PATH}#faq`,
    url: `${SITE_URL}${PATH}`,
    name: "Relational security: frequently asked questions",
    author: { "@id": PERSON_ID },
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  },
];

export default function RelationalSecurity() {
  return (
    <>
      <SEO
        title="What Is Relational Security?"
        description={DESCRIPTION}
        path={PATH}
        image="/og/relational-security.jpg"
        keywords="relational security, what is relational security, a doctrine of relational security, relational security doctrine, relational security definition, bond integrity, Vinculum Continuum, Vinculum Security, James Wesley Ndua"
        scholarly
        citationTitle="Relational Security: Definition and Doctrinal Scope"
        jsonLd={LD}
      />

      <div className="container">
        <PageHeader
          eyebrow="Definition"
          title="What Is Relational Security?"
        />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="doctrine-core">Canonical Definition</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Primary Source</DiplomatBadge>
        </FadeIn>

        <FadeIn className="max-w-4xl mb-14">
          <p className="prose-body text-foreground/90">
            <strong>Relational security</strong> is the organising idea of{" "}
            <strong>Vinculum Security</strong>, an original doctrine by {AUTHOR_NAME}, also
            stated as <em>A Doctrine of Relational Security</em>. This page is the canonical
            definition; every repository deposit of the work is an archival mirror of it.
          </p>
          <div className="mt-6">
            <PullQuote cite="Canonical Definition, 2026">{CANONICAL_DEFINITION}</PullQuote>
          </div>
          <p className="prose-body text-foreground/90 mt-6">
            The doctrine's originating claim follows from it: <strong>{ONTOLOGICAL_CLAIM}</strong>{" "}
            Security assessed only at the level of the state, or only at the level of the
            individual, can report safety while the bonds that constitute that safety are
            eroding.
          </p>
        </FadeIn>

        <NumeralDivider n="I" label="Scope" />

        <FadeIn className="max-w-4xl mb-20">
          <p className="eyebrow">The four levels of the Vinculum Continuum</p>
          <GoldRule className="mt-4 mb-6" />
          <dl className="space-y-5">
            {LEVELS.map((l) => (
              <div key={l.n} className="border-l-2 border-accent/60 pl-5">
                <dt className="font-semibold text-primary">
                  Level {l.n} — {l.title}
                </dt>
                <dd className="text-muted-foreground mt-1">{l.body}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted-foreground mt-6">
            The full treatment, including the comparative table and the scoring rubric, is in{" "}
            <Link to="/doctrine" className="underline decoration-accent underline-offset-4">
              The Doctrine
            </Link>{" "}
            and{" "}
            <Link to="/methodology" className="underline decoration-accent underline-offset-4">
              Methodology
            </Link>
            .
          </p>
        </FadeIn>

        <NumeralDivider n="II" label="Disambiguation" />

        <FadeIn className="max-w-4xl mb-20">
          <p className="eyebrow">What relational security is not</p>
          <GoldRule className="mt-4 mb-6" />
          <ul className="prose-body text-foreground/90 space-y-3 list-disc pl-5">
            <li>
              <strong>Not a human security framework.</strong> Human security is one of the
              thirteen traditions Vinculum Security draws from and is distinguished against. It
              is a source, not a parent category. See{" "}
              <Link to="/foundations" className="underline decoration-accent underline-offset-4">
                Foundations
              </Link>
              .
            </li>
            <li>
              <strong>Not the forensic mental-health usage.</strong> The same phrase is used in
              secure clinical settings to describe staff familiarity with patients. That usage is
              unrelated to this doctrine.
            </li>
            <li>
              <strong>Not a restatement of positive peace, restorative justice, or Ubuntu.</strong>{" "}
              Each informs the doctrine; none of them makes the bond the unit of security
              analysis.
            </li>
            <li>
              <strong>Not a product, company, or service.</strong> Vinculum Security is a
              published doctrine and its companion practice, Vinculum Diplomacy.
            </li>
          </ul>
        </FadeIn>

        <NumeralDivider n="III" label="Questions" />

        <FadeIn className="max-w-4xl mb-24">
          <p className="eyebrow">Frequently asked</p>
          <GoldRule className="mt-4 mb-6" />
          <dl className="space-y-7">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt className="font-semibold text-primary text-lg">{f.q}</dt>
                <dd className="text-muted-foreground mt-2">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="text-muted-foreground mt-8">
            Terms used above are defined in the{" "}
            <Link to="/glossary" className="underline decoration-accent underline-offset-4">
              Glossary
            </Link>
            , and the originator is described in{" "}
            <Link to="/about" className="underline decoration-accent underline-offset-4">
              About
            </Link>
            .
          </p>
        </FadeIn>
      </div>
    </>
  );
}
