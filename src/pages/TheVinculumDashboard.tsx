import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { SITE_URL, PERSON_ID, AUTHOR_NAME } from "@/lib/seo-entities";
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
    title: "Assessment and Early Warning",
    desks: "Desks 01 – 04",
    summary:
      "Mathematical diagnosis of systemic bond integrity, shock simulation, and empirical case matching.",
    items: [
      { id: "01", name: "Diagnostics", role: "Score the interpersonal, communal, intergenerational and institutional-relational bonds, identify the weakest bond, and match the profile against documented cases." },
      { id: "02", name: "Sentinel Matrix (The Eye of Humanity)", role: "The descriptive name of the existing early-warning desk: record observed signs across the four relational bonds and read rupture and latent-trap patterns. A rule-based assessment, not surveillance or a prediction." },
      { id: "03", name: "Compound Shock Tester", role: "Stress-testing systemic resiliency against simultaneous economic, political, environmental, or succession crises." },
      { id: "04", name: "Comparative Mirror", role: "Compare two or three documented theatres against the same relational rubric; historical similarities are aids to analysis, not predictions." },
    ],
  },
  {
    num: "Division II",
    title: "Diplomatic Engagement",
    desks: "Desks 05 – 09",
    summary:
      "Relational cartography, multilateral power-balancing, and multi-track diplomatic synchronization.",
    items: [
      { id: "05", name: "Briefing Desk", role: "Assemble a chancellery memorandum from documented case material, field scripts and mission protocols." },
      { id: "06", name: "Counterpart Prompter", role: "Work through meeting phases with ordered examination questions, custom wording and recorded counterpart tactics." },
      { id: "07", name: "De-confliction Bench", role: "Seat delegations and examine friction across bilateral pairs to support multi-party sequencing." },
      { id: "08", name: "Track Sequencing", role: "Read the gap between Track I formal diplomacy and Track II communal reconciliation before elite alignment obscures it." },
      { id: "09", name: "Field Audit", role: "Review affected stakeholders and protection safeguards before treating the assessment as ready for use." },
    ],
  },
  {
    num: "Division III",
    title: "Legal Architecture",
    desks: "Desks 10 – 14",
    summary:
      "Treaty engineering, non-fungible covenant drafting, and succession resistance verification.",
    items: [
      { id: "10", name: "Clause Architect", role: "Drafting non-fungible peace covenants tied directly to physical bond-integrity conditions rather than textual nominalism." },
      { id: "11", name: "Clause Redliner", role: "Adversarial audit of counterpart treaty drafts to expose hidden opt-outs, bad-faith off-ramps, and linguistic mirages." },
      { id: "12", name: "Succession Simulator", role: "Mathematical verification of whether an accord survives the departure, death, or electoral defeat of its original signatories." },
      { id: "13", name: "Legal Desk", role: "Prepare a matter checklist using the doctrine's evidentiary and continuity rules, alongside dispute-forum assessment." },
      { id: "14", name: "Adversarial Chamber", role: "Rehearse the recorded objections, answers and unresolved challenges from the doctrine's adversarial review." },
    ],
  },
  {
    num: "Division IV",
    title: "Mission Governance",
    desks: "Desks 15 – 18",
    summary:
      "Stage-gate mission readiness, dynamic dossier compilation, and sovereign handover protocols.",
    items: [
      { id: "15", name: "Mission Readiness", role: "Check mission protection and verification gates and read the Dominum Index when its underlying assessments are available." },
      { id: "16", name: "Verification Ledger", role: "Continuous compliance tracking against signed covenants with automated breach-detection triggers." },
      { id: "17", name: "Mandate Handover", role: "Test local rooting before external departure, draft the handover instrument, and carry the shared Dominum reading into its telemetry." },
      { id: "18", name: "Mission Binder", role: "Compile documents added from the desks into a numbered master briefing and retain them through the browser-local mission archive." },
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
    "An 18-desk browser-local chancellery for mediation, treaty drafting and relational security audits, with Preset Proving Ground and Custom Operational Mission mandates, governing relational laws and the Dominum Index.",
  alternateName: ["Vinculum Dashboard", "The Vinculum Security Dashboard", "Vinculum Diplomacy Dashboard"],
  disambiguatingDescription:
    "The diplomatic and peace-mediation chancellery originated by James Wesley Ndua of Nairobi, Kenya. Protected by statutory copyright. Not to be confused with Vinculum Solutions, Vin eRetail, or any e-commerce, warehouse, or retail software.",
  keywords: "The Vinculum Dashboard, Sentinel Matrix, The Eye of Humanity, Vinculum Security, Vinculum Diplomacy, Deterministic Relational Law, James Wesley Ndua, peace mediation, relational security",
  creator: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  sameAs: [`${SITE_URL}/the-vinculum-dashboard`],
  isPartOf: { "@id": `${SITE_URL}/#website` },
  author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  copyrightHolder: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  copyrightNotice:
    "Copyright © James Wesley Ndua. All Statutory Rights Reserved. Formally registered under statutory copyright law. Private, restricted-access software.",
};

const VOCAB = GLOSSARY.filter((g) => g.category === "field" || ["liebig-relational-capacity", "deterministic-relational-law", "dominum-effect", "dominium-imperium", "custodial-inversion"].includes(g.id));

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
        description="The private 18-desk chancellery: assessment, diplomatic engagement, legal architecture and mission governance, with two mandates, governing relational laws and the Dominum Index."
        path="/the-vinculum-dashboard"
        keywords="The Vinculum Dashboard, Sentinel Matrix, The Eye of Humanity, Vinculum Unified Operational Nervous System, Deterministic Relational Law, The Dominum Effect, Sovereign Custodial Inversion, Preset Proving Ground, Custom Operational Mission, diplomatic mediation software, statutory copyright, peace treaty drafting, sovereign diplomacy"
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

        <FadeIn className="max-w-3xl mb-16">
          <p className="eyebrow">Two Mandates, One Chancellery</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85 space-y-4">
            <p>
              The Mission Foyer opens either the <strong>Preset Proving Ground</strong>, for rehearsal against documented settlement profiles,
              or a <strong>Custom Operational Mission</strong>, for the practitioner's own stakeholder evidence, decisions and stage-gate progression.
              Both mandates use the same eighteen desks and the same shared readings. In a custom mission, a desk's starting values are not treated as an assessment until the practitioner works that desk.
            </p>
            <p>
              The Chancellery Breviary, Sentinel and State Vault support the whole workspace; they are not extra numbered desks.
              Mission notes, rehearsal branches and the decision record remain browser-local.
            </p>
          </div>
        </FadeIn>

        <NumeralDivider n="III" label="Sovereign Architecture" />

        {/* Section 3: Sovereign Architecture */}
        <FadeIn className="max-w-3xl my-16">
          <p className="eyebrow">Zero-Cloud Sovereign Security</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85 space-y-4">
            <p>
              High-stakes diplomatic negotiations cannot occur within centralized surveillance environments or third-party
              commercial clouds. The Vinculum Dashboard is driven by <strong>The Vinculum Unified Operational Nervous System</strong> (Statutorily Registered &amp; Protected),
              keeping working mission material browser-local. This is a confidentiality design, not a claim that the website or sign-in requires no network connection:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm text-foreground/80">
              <li>
                <strong>Browser-Local Working Material:</strong> Mission parameters, counterpart assessments and tactical cables are processed and retained on the practitioner's device. The practitioner remains responsible for device security and any material deliberately exported or shared.
              </li>
              <li>
                <strong>Bounded Integrity Verification:</strong> The Handover Seal hashes a canonical mission record using SHA-256. Sealed local archives support tamper-evident custody; a seal does not establish the truth of the input evidence or automatic legal admissibility.
              </li>
              <li>
                <strong>Deterministic Zero-AI Guarantee:</strong> The mathematical engine executes strictly reproducible formulas without probabilistic hallucinations, black-box guessing, or algorithmic manipulation.
              </li>
            </ul>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl my-16">
          <p className="eyebrow">Governing Relational Laws</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85 space-y-4">
            <p>
              The Chancellery Wire brings fifteen governing relational laws into one console, grouped under bond foundation and transmission,
              kinetic and shear dynamics, and custodial inversion. It relates the weakest bond, contagion, entropy and decay to rupture,
              compound stress, track divergence and the Elite-Pact Mirage, then to succession, conditional escrow, resource parity, forum enforceability and handover integrity.
            </p>
            <p>
              These are views of the same desk readings, not separate assessments. A holding or breach status appears only where the engine defines a threshold;
              otherwise the console shows the available reading or marks the assessment as awaiting its desk.
            </p>
            <p>
              <Link to="/glossary#dominum-effect" className="text-primary underline underline-offset-4">The Dominum Effect</Link>,
              formally the Law of Sovereign Custodial Inversion, supplies the positive custodial condition those safeguards work toward.
              Its derived <strong>Dominum Index</strong> is read at Mission Readiness and carried into Mandate Handover from the same bond,
              escrow, succession and rupture assessments. It describes the recorded posture; it does not execute an asset transfer or predict events.
              The operative formulas remain in the private dashboard and the Codex.
            </p>
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
