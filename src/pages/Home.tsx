import SEO from "@/components/SEO";
import NavCard from "@/components/NavCard";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import Cite from "@/components/Cite";
import Logo from "@/components/Logo";
import { useParallax } from "@/hooks/useParallax";

const CARDS = [
  { to: "/doctrine", eyebrow: "Section III", title: "The Doctrine", description: "Canonical definition, ontological claim, comparative positioning, and the four-level Vinculum Continuum." },
  { to: "/foundations", eyebrow: "Section II", title: "Theoretical Foundations", description: "Thirteen traditions the doctrine draws from: Ubuntu, Confucian Role Ethics, Human Security, R2P, WPS, and the digital and climate-displacement bonds named in the Final Edition." },
  { to: "/cases", eyebrow: "Section VII", title: "Case Studies", description: "Eight documented processes across Africa, Latin America, Europe, Southeast Asia, and the Pacific, each scored across four bond domains." },
  { to: "/methodology", eyebrow: "Section V", title: "Methodology", description: "The diagnostic method and bond-integrity indicators used to assess a case in plain terms." },
  { to: "/practice", eyebrow: "Handbook", title: "Vinculum Diplomacy", description: "The applied practitioner discipline derived from the doctrine, oriented around four practice principles." },
  { to: "/glossary", eyebrow: "Reference", title: "Doctrine Glossary", description: "Canonical terms with source sections and verbatim passages from the doctrine and companion handbook." },
];

export default function Home() {
  const offset = useParallax(0.18);

  return (
    <>
      <SEO
        title="A Doctrine of Relational Security"
        description="Vinculum Security holds that security is the presence and integrity of the relational bonds that make protection, dignity, and peace possible. An original doctrine by James Wesley Ndua."
        path="/"
      />

      {/* Hero */}
      <section className="relative container pt-16 md:pt-24 pb-14 border-b-2 border-primary overflow-hidden">
        <span
          aria-hidden
          className="pointer-events-none absolute -right-6 top-4 font-serif text-brass/25 text-[7rem] md:text-[11rem] leading-none select-none"
          style={{ transform: `translateY(${offset}px)` }}
        >
          MMXXVI
        </span>

        <FadeIn>
          <div className="flex gap-2 flex-wrap mb-6">
            <DiplomatBadge variant="doctrine-core">Doctrine Core</DiplomatBadge>
            <DiplomatBadge variant="briefing-ready">Briefing Ready</DiplomatBadge>
            <DiplomatBadge variant="field-notes">Field-Tested</DiplomatBadge>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-baseline gap-8 relative">
            <div className="space-y-3">
              <div className="flex items-center gap-4 mb-2">
                <Logo size={56} />
                <span className="h-10 w-px bg-brass/60" aria-hidden />
                <span className="eyebrow">Est. MMXXVI</span>
              </div>
              <h1 className="wordmark text-6xl md:text-8xl lg:text-9xl leading-[0.9]">
                Vinculum<br />Security
              </h1>
            </div>
            <div className="max-w-sm md:text-right relative z-10">
              <p className="text-lg leading-snug text-foreground/85 font-medium">
                An original diplomatic doctrine on the bonds that make protection, dignity, and peace possible.
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.24em] font-semibold text-accent">
                James Wesley Ndua · Human Security Diplomat
              </p>
            </div>
          </div>
        </FadeIn>
      </section>

      {/* Canonical Definition */}
      <section className="container py-20 md:py-28">
        <FadeIn>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-start">
            <div className="md:col-span-8">
              <p className="eyebrow mb-6">Canonical Definition</p>
              <blockquote className="font-serif italic text-3xl md:text-5xl leading-[1.1] text-accent">
                Security is not the absence of threat, but the presence and integrity of the{" "}
                <Cite term="bond">relational bonds</Cite>, between persons, communities, and generations,
                that make protection, dignity, and peace possible in the first place.
              </blockquote>
              <p className="mt-6 text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70">
                James Wesley Ndua, 2026
              </p>
            </div>
            <aside className="md:col-span-4 md:border-l border-brass md:pl-8 py-2">
              <p className="text-[11px] uppercase tracking-[0.22em] font-bold text-primary mb-4">
                Core Doctrine
              </p>
              <p className="text-foreground/75 leading-relaxed">
                A signed agreement that leaves bonds unrepaired is unfinished business. The doctrine rests on two
                independent civilizational traditions, <Cite term="ubuntu">Ubuntu</Cite> and{" "}
                <Cite term="confucian-role-ethics">Confucian Role Ethics</Cite>, arriving at the same
                relationally constituted account of personhood.
              </p>
            </aside>
          </div>
        </FadeIn>
      </section>

      {/* Navigation Grid */}
      <section className="container pb-24">
        <FadeIn>
          <div className="flex items-baseline justify-between mb-8">
            <div>
              <p className="eyebrow">Contents</p>
              <h2 className="mt-2 font-serif text-primary">Read the doctrine</h2>
            </div>
            <p className="hidden md:block text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/60">
              I to VI
            </p>
          </div>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {CARDS.map((c, i) => (
            <FadeIn key={c.to} delay={i * 60} className="h-full">
              <NavCard {...c} index={i} />
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
