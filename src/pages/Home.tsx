import SEO from "@/components/SEO";
import GoldRule from "@/components/GoldRule";
import PullQuote from "@/components/PullQuote";
import NavCard from "@/components/NavCard";
import FadeIn from "@/components/FadeIn";

const CARDS = [
  { to: "/doctrine", eyebrow: "Section III", title: "The Doctrine", description: "Canonical definition, ontological claim, comparative positioning, and the four-level Vinculum Continuum." },
  { to: "/foundations", eyebrow: "Section II", title: "Theoretical Foundations", description: "Eleven traditions the doctrine draws from — from Ubuntu and Confucian Role Ethics to Human Security and R2P." },
  { to: "/cases", eyebrow: "Section VII", title: "Case Studies", description: "Six documented processes across Africa, Latin America, Europe, and Southeast Asia, each scored across four bond domains." },
  { to: "/methodology", eyebrow: "Section V", title: "Methodology", description: "The diagnostic method and bond-integrity indicators used to assess a case in plain terms." },
  { to: "/practice", eyebrow: "Handbook", title: "Vinculum Diplomacy", description: "The applied practitioner discipline derived from the doctrine, oriented around four practice principles." },
  { to: "/about", eyebrow: "Section I", title: "About the Author", description: "James Wesley Ndua — Human Security Diplomat, Youth, Peace and Security Advocate, Nairobi." },
];

export default function Home() {
  return (
    <>
      <SEO
        title="A Doctrine of Relational Security"
        description="Vinculum Security holds that security is the presence and integrity of the relational bonds that make protection, dignity, and peace possible. An original doctrine by James Wesley Ndua."
        path="/"
      />

      <section className="container pt-20 md:pt-28 pb-16">
        <FadeIn>
          <p className="eyebrow">A Doctrine of Relational Security</p>
          <h1 className="mt-4 font-serif text-primary" style={{ letterSpacing: "0.02em" }}>
            VINCULUM SECURITY
          </h1>
          <GoldRule className="mt-6" />
          <p className="mt-6 text-sm uppercase tracking-widest text-muted-foreground" style={{ letterSpacing: "0.2em" }}>
            James Wesley Ndua · Human Security Diplomat
          </p>
        </FadeIn>

        <FadeIn delay={150} className="mt-14 md:mt-20 max-w-4xl">
          <PullQuote
            size="lg"
            cite="James Wesley Ndua, Canonical Definition, 2026"
          >
            Vinculum Security holds that security is not the absence of threat to a state or an individual, but the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible in the first place.
          </PullQuote>
        </FadeIn>
      </section>

      <section className="container pb-20 max-w-4xl">
        <FadeIn>
          <p className="eyebrow">Overview</p>
          <div className="mt-4 prose-body text-lg leading-relaxed text-foreground/90">
            <p>
              Security, in this doctrine, is not measured by the absence of threat but by the integrity of the bonds
              that protect a person, community, and generation. A signed agreement that leaves those bonds unrepaired
              is treated as unfinished business, not completed business.
            </p>
            <p>
              The ontological claim rests on two independent civilizational traditions — Ubuntu philosophy and
              Confucian Role Ethics — arriving at the same relationally constituted account of personhood.
              The doctrine engages six documented processes across Africa, Latin America, Europe, and Southeast Asia,
              each scored across four continuum levels.
            </p>
          </div>
        </FadeIn>
      </section>

      <section className="container pb-24">
        <FadeIn>
          <p className="eyebrow">Contents</p>
          <h2 className="mt-3 font-serif text-primary">Read the doctrine</h2>
          <GoldRule className="mt-5 mb-10" />
        </FadeIn>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {CARDS.map((c, i) => (
            <FadeIn key={c.to} delay={i * 60}>
              <NavCard {...c} />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
