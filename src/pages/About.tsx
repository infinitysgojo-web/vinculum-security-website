import { useState } from "react";
import SEO from "@/components/SEO";
import { SITE_URL, personLd } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Logo from "@/components/Logo";
import CCBadge from "@/components/CCBadge";
import CiteWork from "@/components/CiteWork";


export default function About() {
  const [copied, setCopied] = useState(false);
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
                        <div className="space-y-1.5 text-sm">
              <p>
                <strong>Doctrine & Handbook:</strong> Registered with the Kenya Copyright Board (KECOBO), No. RZ100967, approved 27 July 2026.
              </p>
              <p>
                <strong>The Vinculum Dashboard:</strong> Registered with KECOBO, No. RZ104942, approved 5 October 2026.
              </p>
              <p>
                <strong>The Vinculum Unified Operational Nervous System:</strong> Registered with KECOBO, No. RZ105005, approved 5 October 2026.
              </p>
            </div>
            <p>
              All three works are ready for use in academic circles, in mainstream policy, and in the wider public
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

        <FadeIn className="max-w-3xl pb-16">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-10">
            <p className="text-sm text-muted-foreground m-0">Citing the doctrine in your own work?</p>
            <CiteWork path="/about" />
          </div>
          <p className="eyebrow">Correspondence and Inquiries</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="border border-brass/40 bg-primary/[0.03] p-6 sm:p-8">
            <p className="text-sm text-muted-foreground leading-relaxed m-0">
              Correspondence is welcome on academic citation and review, policy and advisory engagements, curriculum
              use, speaking invitations, and applied use of the doctrine in field or treaty settings.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
              <a
                href="mailto:vinculumsecurity@gmail.com"
                className="font-serif text-xl sm:text-2xl text-primary hover:text-accent transition-colors break-all"
              >
                vinculumsecurity@gmail.com
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText("vinculumsecurity@gmail.com");
                  setCopied(true);
                  window.setTimeout(() => setCopied(false), 2000);
                }}
                className="self-start sm:ml-auto shrink-0 min-h-11 px-4 border border-brass/60 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:bg-brass/10 transition-colors"
              >
                {copied ? "Copied" : "Copy address"}
              </button>
            </div>
          </div>
        </FadeIn>

      </div>

    </>
  );
}
