import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { SITE_URL, personLd, PERSON_ID, AUTHOR_NAME } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import NumeralDivider from "@/components/NumeralDivider";
import ReadingProgress from "@/components/ReadingProgress";
import { GLOSSARY } from "@/content/glossary";

const DIVISIONS = [
  {
    num: "Division I",
    title: "Assessment & Early Warning",
    desks: "Desks 01 – 04",
    summary:
      "Mathematical diagnosis of systemic bond integrity, shock simulation, and empirical case matching.",
    items: [
      { id: "01", name: "Vinculum-Bond-Diagnostic", role: "Continuous 4D vector profiling across Interpersonal, Communal, Intergenerational, and Institutional domains; Liebig capacity identification." },
      { id: "02", name: "The Sentinel Matrix", role: "Early warning tripwire scoring across twenty-four empirical indicators under deteriorating, static, or stabilizing trends." },
      { id: "03", name: "Compound Shock Tester", role: "Stress-testing systemic resiliency against simultaneous economic, political, environmental, or succession crises." },
      { id: "04", name: "Comparative Mirror", role: "Distance-normalized pattern matching against historical peace accords to anticipate recurring systemic failure modes." },
    ],
  },
  {
    num: "Division II",
    title: "Diplomatic Engagement & Counterpart Relations",
    desks: "Desks 05 – 08",
    summary:
      "Relational cartography, multilateral power-balancing, and multi-track diplomatic synchronization.",
    items: [
      { id: "05", name: "Relational Atlas", role: "Topological mapping of interpersonal ties, grievances, and communal leverage across high-stakes negotiating parties." },
      { id: "06", name: "Multi-Party Sequencer", role: "Optimizing the sequence of bilateral and multilateral consultations to prevent early-stage coalition fracture." },
      { id: "07", name: "Counterpart Prompter & Cable Composer", role: "Structured tactical briefing generators for mediation leads and front-line diplomatic envoys." },
      { id: "08", name: "Kinematic Track Sequencer", role: "Synchronizing formal Track-I state diplomacy with Track-II and Track-III communal peacebuilding to enforce kinematic tolerance." },
    ],
  },
  {
    num: "Division III",
    title: "Legal & Structural Architecture",
    desks: "Desks 09 – 12",
    summary:
      "Treaty engineering, non-fungible covenant drafting, and succession resistance verification.",
    items: [
      { id: "09", name: "Litigation Workbench", role: "Translating relational obligations into binding legal posture, jurisdictional enforcement, and defensive arbitration tactics." },
      { id: "10", name: "Clause Architect", role: "Drafting non-fungible peace covenants tied directly to physical bond-integrity conditions rather than textual nominalism." },
      { id: "11", name: "Clause Redliner", role: "Adversarial audit of counterpart treaty drafts to expose hidden opt-outs, bad-faith off-ramps, and linguistic mirages." },
      { id: "12", name: "Succession Simulator", role: "Mathematical verification of whether an accord survives the departure, death, or electoral defeat of its original signatories." },
    ],
  },
  {
    num: "Division IV",
    title: "Mission Governance & Verification",
    desks: "Desks 13 – 18",
    summary:
      "Stage-gate mission readiness, dynamic dossier compilation, and sovereign handover protocols.",
    items: [
      { id: "13", name: "Readiness Desk", role: "Enforcing strict stage gates—no diplomatic delegation advances to formal signing without verified relational thresholds." },
      { id: "14", name: "Mission Binder", role: "Dynamic aggregation of all operational desk outputs into a unified, cryptographically sealed mission file." },
      { id: "15", name: "Handover Protocol", role: "Structured transition workflows for sovereign chanceries, successor envoys, and international monitoring bodies." },
      { id: "16", name: "Verification Ledger", role: "Continuous compliance tracking against signed covenants with automated breach-detection triggers." },
      { id: "17", name: "Chancellery Breviary", role: "Rapid institutional rulebook and doctrinal reference for tactical field maneuvers under extreme pressure." },
      { id: "18", name: "Mission State Vault", role: "Cryptographic, tamper-evident archival custody of mission parameters under zero-cloud sovereign security." },
    ],
  },
];

const dashboardLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "@id": `${SITE_URL}/the-vinculum-dashboard#software`,
  name: "The Vinculum Dashboard",
  url: `${SITE_URL}/the-vinculum-dashboard`,
  applicationCategory: "Diplomatic Governance Software / Jurisprudential Decision Engine",
  operatingSystem: "Web-native / Browser-local sovereign runtime",
  description:
    "An 18-desk operational practitioner chancellery for high-stakes mediation, treaty drafting, and relational security audits. Governed by Deterministic Relational Law and powered by The Vinculum Unified Operational Nervous System.",
  alternateName: ["Vinculum Dashboard", "The Vinculum Security Dashboard", "Vinculum Diplomacy Dashboard"],
  disambiguatingDescription:
    "The diplomatic and peace-mediation chancellery originated by James Wesley Ndua of Nairobi, Kenya. Protected by statutory copyright. Not to be confused with Vinculum Solutions, Vin eRetail, or any e-commerce, warehouse, or retail software.",
  keywords: "The Vinculum Dashboard, Vinculum Security, Vinculum Diplomacy, Deterministic Relational Law, James Wesley Ndua, peace mediation, relational security",
  creator: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  sameAs: [`${SITE_URL}/the-vinculum-dashboard`],
  isPartOf: { "@id": `${SITE_URL}/#website` },
  author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  copyrightHolder: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  copyrightNotice:
    "Copyright © James Wesley Ndua. All Statutory Rights Reserved. Formally registered under statutory copyright law. Private, restricted-access software.",
};

const VOCAB = GLOSSARY.filter((g) => g.category === "field" || g.id === "liebig-relational-capacity" || g.id === "deterministic-relational-law");

const vocabLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  "@id": `${SITE_URL}/the-vinculum-dashboard#vocabulary`,
  name: "The Vinculum Dashboard Working Vocabulary",
  creator: { "@id": PERSON_ID },
  hasDefinedTerm: VOCAB.map((g) => ({
    "@type": "DefinedTerm",
    name: g.term,
    description: g.short,
    url: `${SITE_URL}/glossary#${g.id}`,
  })),
};

export default function TheVinculumDashboard() {
  return (
    <>
      <SEO
        title="The Vinculum Dashboard"
        description="The 18-desk operational practitioner chancellery for high-stakes mediation, treaty drafting, and relational security audits. Powered by Deterministic Relational Law under zero-cloud sovereign integrity."
        path="/the-vinculum-dashboard"
        keywords="The Vinculum Dashboard, Vinculum Unified Operational Nervous System, Deterministic Relational Law, diplomatic mediation software, statutory copyright, peace treaty drafting, sovereign diplomacy"
        scholarly
        citationTitle="The Vinculum Dashboard: Operational Architecture of Deterministic Relational Law"
        jsonLd={[dashboardLd, vocabLd]}
      />
      <ReadingProgress />

      <div className="container">
        <PageHeader
          eyebrow="Operational Architecture"
          title="The Vinculum Dashboard"
          lede="The 18-desk chancellery for high-stakes mediation, relational audit, and treaty engineering, powered by Deterministic Relational Law."
        />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="doctrine-core">Statutory Copyright Protected</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">All Rights Reserved</DiplomatBadge>
          <DiplomatBadge variant="methodology">18 Operational Desks</DiplomatBadge>
          <DiplomatBadge variant="field-notes">Private · Restricted Access</DiplomatBadge>
        </FadeIn>

        {/* Section 1: The Core Philosophy */}
        <FadeIn className="max-w-3xl mb-16">
          <p className="eyebrow">The Deterministic Imperative</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85 space-y-4">
            <p>
              Traditional international mediation relies heavily on subjective diplomatic memos, personal intuition,
              and linguistic compromises that conceal structural fragility behind rhetorical consensus. When these
              accords collapse, the cost is measured in violent relapse and institutional devastation.
            </p>
            <p>
              <strong>The Vinculum Dashboard</strong> (Statutorily Registered & Protected), driven by The Vinculum Unified Operational
              Nervous System (Protected Proprietary Architecture), was engineered by James Wesley Ndua to replace subjective
              optimism with <em>Deterministic Relational Law</em> (<span className="italic">Lex Relationalis Determinata</span>).
              It treats a peace accord not as a static text, but as a dynamic relational structure governed by strict
              mathematical bounds: the weakest bond determines systemic capacity, diplomatic tracks must stay
              kinematically synchronized, and no treaty is certified durable unless it clears succession resistance gates.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-16">
          <PullQuote cite="Operational Doctrine § I">
            Peace is not the nominal signing of paper by elites; it is the physical durability of the relational bonds that bind communities together across generational time.
          </PullQuote>
        </FadeIn>

        <NumeralDivider n="II" label="Four Operational Divisions" />

        {/* Section 2: The Four Divisions */}
        <div className="space-y-16 max-w-4xl my-16">
          {DIVISIONS.map((div) => (
            <FadeIn key={div.num} className="border border-brass/40 bg-card p-6 md:p-8">
              <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-brass/25 pb-3 mb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-accent block">
                    {div.num}
                  </span>
                  <h3 className="font-serif text-2xl text-primary mt-1">{div.title}</h3>
                </div>
                <span className="text-xs uppercase font-semibold tracking-widest text-muted-foreground">
                  {div.desks}
                </span>
              </div>
              <p className="text-sm text-foreground/75 mb-6">{div.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {div.items.map((item) => (
                  <div key={item.id} className="p-4 bg-background/60 border border-brass/20 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold text-accent">DESK {item.id}</span>
                      </div>
                      <h4 className="font-serif text-base font-semibold text-primary mb-2">{item.name}</h4>
                      <p className="text-xs leading-relaxed text-muted-foreground">{item.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          ))}
        </div>

        <NumeralDivider n="III" label="Sovereign Architecture" />

        {/* Section 3: Sovereign Architecture */}
        <FadeIn className="max-w-3xl my-16">
          <p className="eyebrow">Zero-Cloud Sovereign Security</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85 space-y-4">
            <p>
              High-stakes diplomatic negotiations cannot occur within centralized surveillance environments or third-party
              commercial clouds. The Vinculum Dashboard is driven by <strong>The Vinculum Unified Operational Nervous System</strong> (Statutorily Registered &amp; Protected),
              operating under strict sovereign air-gap principles:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-foreground/80">
              <li>
                <strong>Browser-Local State Execution:</strong> All mission parameters, counterpart vulnerability ratings, and tactical cables reside strictly within the practitioner's browser sandbox, never leaking to external databases.
              </li>
              <li>
                <strong>Cryptographic Integrity Seals:</strong> Every generated mission dossier, treaty redline, and readiness certification is dynamically stamped with a SHA-256 state seal for tamper-evident proof of audit.
              </li>
              <li>
                <strong>Deterministic Zero-AI Guarantee:</strong> The mathematical engine executes strictly reproducible formulas without probabilistic hallucinations, black-box guessing, or algorithmic manipulation.
              </li>
            </ul>
          </div>
        </FadeIn>

        {/* Working vocabulary — concepts only, no formulas or thresholds */}
        <FadeIn className="max-w-4xl my-16">
          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">Working Vocabulary</p>
          <h2 className="mt-2 font-serif text-3xl text-primary">The Language of the Chancellery</h2>
          <p className="mt-3 text-sm leading-relaxed text-foreground/80">
            Terms originated by {AUTHOR_NAME} for The Vinculum Dashboard and The Vinculum Unified Operational Nervous System. Each is defined here as a concept; the operative rules remain private.
          </p>
          <dl className="mt-8 grid gap-4 md:grid-cols-2">
            {VOCAB.map((g) => (
              <div key={g.id} className="border border-brass/40 p-5 min-w-0">
                <dt className="font-serif text-lg text-primary">
                  <Link to={`/glossary#${g.id}`} className="hover:text-accent">{g.term}</Link>
                </dt>
                <dd className="mt-2 text-sm text-foreground/80 leading-relaxed">{g.short}</dd>
              </div>
            ))}
          </dl>
        </FadeIn>

        {/* Section 4: Commentary inquiries on the Dashboard */}
        <div className="max-w-3xl my-16 p-8 border border-brass/50 bg-card/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-accent">
              System Inquiries
            </p>
            <h3 className="font-serif text-xl text-primary font-medium">
              The Vinculum Dashboard &amp; Its Design Principles
            </h3>
            <p className="text-sm text-foreground/75 leading-relaxed max-w-xl">
              Consult the authoritative commentary repository for inquiries into the eighteen-desk chain, deterministic analysis without generative AI, browser-local confidentiality, and the weakest-bond rupture warning.
            </p>
          </div>
          <a
            href="/commentary#dashboard"
            className="shrink-0 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider hover:bg-accent transition-colors"
          >
            Read Commentary →
          </a>
        </div>

        {/* Section 5: Access & Statutory Notice */}
        <FadeIn className="max-w-3xl my-16 p-8 border-2 border-primary bg-primary/5">
          <h3 className="font-serif text-xl text-primary mb-3">Private & Restricted Chancellery</h3>
          <p className="text-sm leading-relaxed text-foreground/80 mb-6">
            The Vinculum Dashboard is strictly private. It is not open to the public and accepts no public registration
            or unsolicited requests. Use is reserved solely for its author, James Wesley Ndua, and for accredited envoys,
            chancellery legal teams, and designated mission leads he personally authorizes under direct mandate.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link
              to="/methodology"
              className="inline-flex items-center justify-center px-6 py-2.5 text-xs uppercase tracking-[0.2em] font-semibold border border-primary text-primary hover:bg-primary/10 transition-colors"
            >
              Read Full Methodology
            </Link>
          </div>
          <div className="mt-8 pt-6 border-t border-brass/30 text-[11px] text-muted-foreground space-y-1">
            <p>
              <strong>Statutory Protection:</strong> The Vinculum Dashboard is an original proprietary work registered under statutory copyright law. All Rights Reserved.
            </p>
            <p>
              <strong>Core Nervous System:</strong> The Vinculum Unified Operational Nervous System is registered and protected by statutory copyright law. Unauthorized copying, decompilation, or derivation is strictly prohibited.
            </p>
            <p>
              <strong>Doctrinal Foundation:</strong> Vinculum Security & Vinculum Diplomacy are protected under registered statutory copyright. Copyright © James Wesley Ndua.
            </p>
          </div>

        </FadeIn>
      </div>
    </>
  );
}
