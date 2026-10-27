import SEO from "@/components/SEO";
import { SITE_URL, personLd, ORG_ID } from "@/lib/seo-entities";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import { Link } from "react-router-dom";

export default function Dispatches() {
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/dispatches#blog`,
    name: "The Vinculum Dispatches",
    description:
      "Diplomatic Gazette & Field Bureau Commentary by James Wesley Ndua through the lens of Vinculum Security and Vinculum Diplomacy. Published continuously on Medium.",
    url: `${SITE_URL}/dispatches`,
    author: personLd,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };

  return (
    <>
      <SEO
        title="The Dispatches Gazette"
        description="Field commentary, diplomatic monographs, and geopolitical analysis by James Wesley Ndua: examining live international crises through the Vinculum Security lens. Published continuously on Medium."
        path="/dispatches"
        type="website"
        keywords="Vinculum Security dispatches, diplomatic gazette, Vinculum Diplomacy, relational security commentary, James Wesley Ndua Medium, multilateral reform, transitional justice"
        image="/og/dispatches.jpg"
        jsonLd={[blogLd]}
      />

      <div className="container pb-24">
        {/* ========================================================================= */}
        {/* BROADSHEET MASTHEAD BANNER                                                */}
        {/* ========================================================================= */}
        <FadeIn className="pt-8 sm:pt-12">
          <div className="border-y-2 border-brass/60 py-6 text-center">
            {/* Top Gazette Registration Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-brass/30 pb-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-semibold">
              <span>Nairobi Bureau · Field Commentary</span>
              <span>The Relational Security Record</span>
              <span>Published on Medium</span>
            </div>

            {/* Central Masthead Header */}
            <div className="py-6 sm:py-8">
              <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-accent mb-2">
                Occasional Gazette of International Affairs
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-primary font-medium tracking-tight">
                The Vinculum Dispatches
              </h1>
              <p className="mt-3 font-serif text-base sm:text-lg italic text-foreground/80 max-w-2xl mx-auto">
                Field Commentary, Diplomatic Monographs & Sovereign Analysis by James Wesley Ndua
              </p>
            </div>

            {/* Bottom Masthead Rule with Badges */}
            <div className="border-t border-brass/30 pt-3 flex flex-wrap items-center justify-center sm:justify-between gap-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              <div className="flex items-center gap-2">
                <DiplomatBadge variant="doctrine-core">Continuous Edition</DiplomatBadge>
                <DiplomatBadge variant="foundation">Four Bond Domains</DiplomatBadge>
              </div>
              <div className="flex items-center gap-4 text-xs tracking-normal font-normal">
                <Link to="/doctrine" className="hover:text-accent transition-colors">
                  The Doctrine →
                </Link>
                <Link to="/practice" className="hover:text-accent transition-colors">
                  Handbook →
                </Link>
                <Link to="/cases" className="hover:text-accent transition-colors">
                  Case Studies →
                </Link>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ========================================================================= */}
        {/* BROADSHEET LEAD ARTICLE & EDITORIAL MANDATE                               */}
        {/* ========================================================================= */}
        <FadeIn className="mt-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-brass/30">
            {/* Main Lead Column */}
            <div className="lg:col-span-7 space-y-4 text-foreground/85 leading-relaxed">
              <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-accent">
                Lead Editorial Treatise
              </p>
              <h2 className="font-serif text-2xl sm:text-3xl text-primary font-normal leading-snug">
                The Testing of Doctrinal Bonds in Live Geopolitical Friction
              </h2>
              <div className="h-px w-16 bg-accent my-3" />
              <p className="text-base font-serif italic text-foreground/90 leading-relaxed">
                Security is not preserved in institutional abstractions. It is tested in the living texture of human relationships, community trust, and diplomatic courage.
              </p>
              <p className="text-sm">
                The Dispatches series serves as the operational crucible for the Vinculum Security doctrine. While the canonical doctrine establishes the theoretical architecture of relational security and the handbook codifies its practitioner methods, these dispatches evaluate live international dilemmas as they unfold across multilateral chambers, contested boundaries, and fractured communities.
              </p>
              <p className="text-sm">
                Each dispatch bypasses traditional zero-sum deterrence calculus to ask four sovereign questions: What relational bonds are breaking? Which parties bear the non-derogable obligation of care? Where has institutional legitimacy decayed? And what restorative covenants can re-establish durable peace?
              </p>
            </div>

            {/* Gazette Sidebar / Doctrinal Anchor Column */}
            <div className="lg:col-span-5 bg-card/30 border border-brass/40 p-6 flex flex-col justify-between">
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-[0.22em] text-accent">
                  Bureau Dispatch Charter
                </p>
                <h3 className="font-serif text-lg text-primary mt-1 mb-3">
                  Criteria of Assessment
                </h3>
                <div className="space-y-3 text-xs text-muted-foreground leading-relaxed">
                  <div className="border-l-2 border-accent pl-3">
                    <strong className="text-foreground block font-serif text-sm">Bond Diagnosis over Deterrence</strong>
                    Evaluating conflicts not through armament parity, but through the four bond domains: Interpersonal, Communal, Institutional, and Sovereign.
                  </div>
                  <div className="border-l-2 border-accent pl-3">
                    <strong className="text-foreground block font-serif text-sm">Non-Derogable Care</strong>
                    Locating the exact diplomatic and state actors who hold legal and ethical custodial responsibility in moments of crisis.
                  </div>
                  <div className="border-l-2 border-accent pl-3">
                    <strong className="text-foreground block font-serif text-sm">Restorative Legitimacy</strong>
                    Measuring whether settlements merely silence artillery or genuinely repair the relational architecture required for enduring stability.
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-brass/20 mt-6">
                <a
                  href="https://medium.com/@jamesndua"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 border border-accent bg-accent/10 px-4 py-2.5 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                >
                  Access All Dispatches on Medium
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </div>
          </div>
        </FadeIn>

        {/* ========================================================================= */}
        {/* THEMATIC DOSSIERS (2x2 BROADSHEET FOLIOS)                                 */}
        {/* ========================================================================= */}
        <div className="mt-12">
          <FadeIn>
            <div className="flex flex-col sm:flex-row items-start sm:items-baseline justify-between mb-6 gap-2">
              <div>
                <p className="text-[10px] uppercase font-semibold tracking-[0.22em] text-accent">
                  Thematic Dossiers
                </p>
                <h3 className="font-serif text-2xl text-primary font-medium mt-1">
                  Active Areas of Geopolitical Inquiry
                </h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Inquiries published and maintained continuously on Medium
              </p>
            </div>
            <GoldRule className="mb-8" />
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Folio 1 */}
            <FadeIn delay={50}>
              <div className="h-full border border-brass/40 bg-card/25 p-6 hover:border-brass/70 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                    <span>Folio I · Multilateral Reform</span>
                    <span className="font-mono text-muted-foreground">REF: UNSC-VETO</span>
                  </div>
                  <h4 className="font-serif text-xl text-primary font-medium">
                    Security Council Veto Mechanics & Structural Legitimacy
                  </h4>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Analyzing the breakdown of institutional bonds in the UN Security Council, the paralysis of the veto privilege, and pathways toward General Assembly prerogative under Uniting for Peace frameworks.
                  </p>
                </div>
                <div className="pt-4 border-t border-brass/20 mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-muted-foreground">Domain: Institutional Bonds</span>
                  <a
                    href="https://medium.com/@jamesndua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors font-semibold"
                  >
                    Read on Medium ↗
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Folio 2 */}
            <FadeIn delay={100}>
              <div className="h-full border border-brass/40 bg-card/25 p-6 hover:border-brass/70 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                    <span>Folio II · Transitional Justice</span>
                    <span className="font-mono text-muted-foreground">REF: JURIS-UBUNTU</span>
                  </div>
                  <h4 className="font-serif text-xl text-primary font-medium">
                    Indigenous Dispute Resolution & Ubuntu Jurisprudence
                  </h4>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Examining truth and reconciliation architectures, indigenous African peacemaking traditions (Gacaca, Palava Hut, Mato Oput), and restorative justice as an active methodology of relational healing.
                  </p>
                </div>
                <div className="pt-4 border-t border-brass/20 mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-muted-foreground">Domain: Communal Bonds</span>
                  <a
                    href="https://medium.com/@jamesndua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors font-semibold"
                  >
                    Read on Medium ↗
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Folio 3 */}
            <FadeIn delay={150}>
              <div className="h-full border border-brass/40 bg-card/25 p-6 hover:border-brass/70 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                    <span>Folio III · Climate Sovereignty</span>
                    <span className="font-mono text-muted-foreground">REF: SIDS-UNCLOS</span>
                  </div>
                  <h4 className="font-serif text-xl text-primary font-medium">
                    Ecological Displacement & Inundated Statehood
                  </h4>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    The international jurisprudence of permanent statehood when territory is inundated, the preservation of UNCLOS maritime baselines, and the collective dignity of Small Island Developing States.
                  </p>
                </div>
                <div className="pt-4 border-t border-brass/20 mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-muted-foreground">Domain: Sovereign Bonds</span>
                  <a
                    href="https://medium.com/@jamesndua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors font-semibold"
                  >
                    Read on Medium ↗
                  </a>
                </div>
              </div>
            </FadeIn>

            {/* Folio 4 */}
            <FadeIn delay={200}>
              <div className="h-full border border-brass/40 bg-card/25 p-6 hover:border-brass/70 transition-colors flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-accent mb-2">
                    <span>Folio IV · Frontier Governance</span>
                    <span className="font-mono text-muted-foreground">REF: AI-CUSTODY</span>
                  </div>
                  <h4 className="font-serif text-xl text-primary font-medium">
                    Autonomous Intelligence & Diplomatic Custody
                  </h4>
                  <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
                    Verification, algorithmic warfare, and the trust deficits introduced when automated models enter sovereign defense and multilateral negotiation architectures.
                  </p>
                </div>
                <div className="pt-4 border-t border-brass/20 mt-6 flex items-center justify-between text-[10px] uppercase tracking-[0.18em]">
                  <span className="text-muted-foreground">Domain: Interpersonal Bonds</span>
                  <a
                    href="https://medium.com/@jamesndua"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-accent transition-colors font-semibold"
                  >
                    Read on Medium ↗
                  </a>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* BUREAU TRANSMISSION TERMINAL                                              */}
        {/* ========================================================================= */}
        <FadeIn className="mt-16">
          <div className="border border-brass/60 bg-card/40 p-8 sm:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <p className="text-[10px] uppercase font-semibold tracking-[0.25em] text-accent">
                Direct Bureau Feed · Medium
              </p>
              <h3 className="font-serif text-2xl sm:text-3xl text-primary font-normal">
                Follow Continuous Field Dispatches
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed">
                All long-form monographs, crisis assessments, and diplomatic reflections by James Wesley Ndua are published in full on Medium. Subscribe or follow the bureau feed to receive field dispatches as they are issued.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full md:w-auto">
              <Link
                to="/doctrine"
                className="inline-flex items-center justify-center border border-brass/60 px-5 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold text-primary hover:border-brass hover:text-accent transition-colors"
              >
                Explore Doctrine
              </Link>
              <a
                href="https://medium.com/@jamesndua"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 border border-accent bg-accent/15 px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
              >
                Open Medium Bureau
                <span aria-hidden>↗</span>
              </a>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
