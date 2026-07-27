import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import PullQuote from "@/components/PullQuote";
import GoldRule from "@/components/GoldRule";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Logo from "@/components/Logo";

export default function About() {
  return (
    <>
      <SEO
        title="About the Author"
        description="James Wesley Ndua, Human Security Diplomat and Youth, Peace and Security Advocate based in Nairobi, Kenya. Originator of the Vinculum Security doctrine."
        path="/about"
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
              practice and study across human security diplomacy, Ubuntu philosophy, and youth, peace and security
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
              Precedent does not require institutional seniority at origination.
              Human security itself began as a single UNDP report before it carried institutional weight. A young author
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
          <p className="eyebrow">Rights and Licensing</p>
          <GoldRule className="mt-4 mb-6" />
          <div className="prose-body text-foreground/85">
            <p>
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
        </FadeIn>
      </div>

    </>
  );
}
