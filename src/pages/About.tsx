import SEO from "@/components/SEO";
import { SITE_URL, personLd } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Logo from "@/components/Logo";
import CCBadge from "@/components/CCBadge";


export default function About() {
  return (
    <>
      <SEO
        title="About the Author"
        description="James Wesley Ndua, diplomat and Youth, Peace and Security advocate based in Nairobi, Kenya. Originator of Vinculum Security, A Doctrine of Relational Security — a complete, copyrighted work ready for use in academic circles, mainstream policy, and public discourse."
        path="/about"
        image="/og/about.jpg"
        keywords="James Wesley Ndua, originator of Vinculum Security, relational security doctrine author, Youth Peace and Security, Nairobi, ORCID 0009-0005-9861-8849"
        citationTitle="About James Wesley Ndua, originator of Vinculum Security"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "ProfilePage",
          "@id": `${SITE_URL}/about#profilepage`,
          url: `${SITE_URL}/about`,
          name: "About James Wesley Ndua",
          inLanguage: "en",
          isPartOf: { "@id": `${SITE_URL}/#website` },
          mainEntity: personLd,
          about: personLd,
        }}
      />
      <div className="container">
        <PageHeader eyebrow="Section I" title="About the Author" />

        <FadeIn className="flex gap-2 flex-wrap mb-10">
          <DiplomatBadge variant="doctrine-core">Originator</DiplomatBadge>
          <DiplomatBadge variant="field-notes">Nairobi · YPS</DiplomatBadge>
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
          <PullQuote cite="James Wesley Ndua, founding principle">
            I cannot leave the community or the people and substitute it for a role or a room.
          </PullQuote>
        </FadeIn>

        <FadeIn className="max-w-3xl mb-16">
          <p className="eyebrow">Statement of Origination</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              Vinculum Security was conceived and first named by James Wesley Ndua in 2026, emerging from sustained
              practice and study across diplomacy, Ubuntu philosophy, and youth, peace and security
              advocacy, and from a working conviction about the nature of diplomatic legitimacy itself.
            </p>
            <p>
              The founding principle above is the doctrine's personal root. It holds that legitimacy in diplomatic
              practice, and security in the lives of the people that practice is meant to serve, are both functions of
              sustained relationship rather than of title, office, or institutional proximity.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl pb-8">
          <p className="eyebrow">Why This Author, Why Now</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              Precedent does not require institutional seniority at origination. New doctrines are judged by the clarity
              of their claims, the evidence they organize, and the scrutiny they withstand. A young author
              working directly in youth, peace and security practice, with lived proximity to the communities and
              generational dynamics the doctrine describes, has a legitimate standing to name a pattern that senior,
              institutionally distant observers are structurally less likely to notice first.
            </p>
            <p>
              This is not a claim that youth guarantee insight, but that this specific insight is one a younger
              practitioner is well positioned to make. The doctrine's credibility rests on its citation, testing, and
              refinement by others going forward, not on this justification alone.
            </p>
          </div>
        </FadeIn>

        <FadeIn className="max-w-3xl pb-8">
          <p className="eyebrow">Rights, Registration and Repositories</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
              Registered with the Kenya Copyright Board (KECOBO). Registration No. RZ100967, approved 27 July 2026.
            </p>
            <p>
              Both works are ready for use in academic circles, in mainstream policy, and in the wider public
              discourse where they can be applied.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 mt-6">
              <a
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                target="_blank"
                rel="license noopener noreferrer"
                className="shrink-0 opacity-85 hover:opacity-100 transition-opacity block"
              >
                <CCBadge width={120} />
              </a>
              <p className="m-0">
                This work is licensed under a{" "}
                <a
                  href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                  target="_blank"
                  rel="license noopener noreferrer"
                  className="text-primary underline decoration-brass/60 underline-offset-4 hover:text-accent transition-colors"
                >
                  Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)
                </a>
                . To view a copy of this license, visit{" "}
                <a
                  href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                  target="_blank"
                  rel="license noopener noreferrer"
                  className="text-primary underline decoration-brass/60 underline-offset-4 hover:text-accent transition-colors break-words"
                >
                  creativecommons.org/licenses/by-nc-nd/4.0/
                </a>
              </p>
            </div>
          </div>

          <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mt-8 mb-3">
            Profiles and Repositories
          </p>
          <p className="text-sm text-muted-foreground">
            The author’s scholarly profiles and the doctrine’s underlying repositories are accessible through the links
            below, from ORCID and HALOpenScience to Zenodo, OpenAire, OSF, Harvard Dataverse, Knowledge Commons,
            Cambridge Open Engage, SSRN, ResearchGate, and the author’s portfolio, alongside Instagram, coming soon,
            for posts on the doctrine.
          </p>
        </FadeIn>

      </div>

    </>
  );
}
