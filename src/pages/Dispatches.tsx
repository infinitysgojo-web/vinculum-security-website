import SEO from "@/components/SEO";
import { SITE_URL, personLd, ORG_ID } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Logo from "@/components/Logo";

export default function Dispatches() {
  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": `${SITE_URL}/dispatches#blog`,
    name: "Dispatches",
    description:
      "Commentary and analysis by James Wesley Ndua through the lens of Vinculum Security and Vinculum Diplomacy, the relational security way. Published on Medium.",
    url: `${SITE_URL}/dispatches`,
    author: personLd,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };

  return (
    <>
      <SEO
        title="Dispatches"
        description="Field commentary and geopolitical analysis by James Wesley Ndua: examining world affairs through the Vinculum Security and Vinculum Diplomacy lens. Published on Medium."
        path="/dispatches"
        type="website"
        keywords="Vinculum Security dispatches, Vinculum Diplomacy commentary, relational security analysis, James Wesley Ndua Medium, diplomatic commentary"
        image="/og/dispatches.jpg"
        jsonLd={[blogLd]}
      />
      <div className="container">
        <PageHeader
          eyebrow="Commentary"
          title="Dispatches"
          lede="Field commentary and diplomatic analysis reading current affairs through the Vinculum Security lens. Published continuously on Medium."
        />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="doctrine-core">Medium Publication</DiplomatBadge>
          <DiplomatBadge variant="field-notes">Field Commentary</DiplomatBadge>
          <DiplomatBadge variant="jurisprudence">Nairobi · Relational Security</DiplomatBadge>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-12 flex items-start gap-6">
          <Logo size={72} className="mt-2 shrink-0" />
          <div>
            <h2 className="font-serif text-primary text-2xl">James Wesley Ndua</h2>
            <hr className="gold-rule gold-rule-short mt-3 mb-4" />
            <p className="text-sm uppercase tracking-widest text-muted-foreground" style={{ letterSpacing: "0.18em" }}>
              Human Security Diplomat · Youth, Peace and Security Advocate
            </p>
            <p className="text-sm uppercase tracking-widest text-muted-foreground mt-1" style={{ letterSpacing: "0.18em" }}>
              Nairobi, Kenya
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-16">
          <PullQuote cite="James Wesley Ndua, field dispatches">
            Security is not preserved in institutional abstractions. It is tested in the living texture of human relationships and diplomatic courage.
          </PullQuote>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-16">
          <p className="eyebrow">Editorial Mandate</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              The Dispatches series serves as the operational testing ground for Vinculum Security and Vinculum Diplomacy.
              While the doctrine establishes the theoretical architecture of relational security and the handbook codifies
              its practitioner methods, the dispatches examine live international events as they unfold across multilateral
              institutions, regional treaties, and fractured communities.
            </p>
            <p>
              Each essay evaluates an active dilemma—from Security Council reform and veto mechanics to transitional justice,
              climate-induced statehood dilemmas in the Pacific, and the global governance of autonomous systems—asking
              always what relational bonds are breaking, what bonds must be forged, and who bears the obligation of care.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-16">
          <p className="eyebrow">Core Thematic Inquiries</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="space-y-4 text-sm text-foreground/85">
            <div className="p-4 border border-brass/30 bg-card/30">
              <h4 className="font-serif text-base text-primary font-medium">Multilateral Reform & Council Dynamics</h4>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Veto accountability, the legacy of historical missions, and structural legitimacy under the UN Charter.
              </p>
            </div>
            <div className="p-4 border border-brass/30 bg-card/30">
              <h4 className="font-serif text-base text-primary font-medium">Transitional Justice & Ubuntu</h4>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Truth commissions, indigenous dispute mechanisms like the Palava Hut, and justice understood as an active form of relational care.
              </p>
            </div>
            <div className="p-4 border border-brass/30 bg-card/30">
              <h4 className="font-serif text-base text-primary font-medium">Ecological Sovereignty & Permanent Statehood</h4>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                The international law of statehood when territory is inundated, and the non-derogable legal standing of low-lying Pacific peoples.
              </p>
            </div>
            <div className="p-4 border border-brass/30 bg-card/30">
              <h4 className="font-serif text-base text-primary font-medium">Autonomous Intelligence & Trust Deficits</h4>
              <p className="mt-1 text-muted-foreground text-xs leading-relaxed">
                Verification, sovereign oversight, and the relational friction of introducing artificial intelligence into diplomatic custody.
              </p>
            </div>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl pb-24">
          <div className="p-8 border border-brass/60 bg-card/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-[10px] uppercase font-semibold tracking-[0.2em] text-accent">
                Continuous Publication
              </p>
              <h3 className="font-serif text-2xl text-primary font-medium">
                Read the Dispatches on Medium
              </h3>
              <p className="text-sm text-foreground/75 leading-relaxed max-w-lg">
                All long-form dispatches, analytical monographs, and active diplomatic commentaries by James Wesley Ndua are published and maintained directly on Medium.
              </p>
            </div>
            <a
              href="https://medium.com/@jamesndua"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 border border-accent bg-accent/10 px-5 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
            >
              Open Medium Profile
              <span aria-hidden>↗</span>
            </a>
          </div>
        </FadeIn>
      </div>
    </>
  );
}
