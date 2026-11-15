import { Link } from "react-router-dom";
import FadeIn from "@/components/FadeIn";

interface Step {
  label: string;
  note: string;
  to?: string;
  href?: string;
  /** Several destinations named in one step, each linked separately. */
  links?: { label: string; to: string }[];
}

interface Pathway {
  numeral: string;
  audience: string;
  question: string;
  steps: Step[];
  cta: { label: string; to: string };
}

const PATHWAYS: Pathway[] = [
  {
    numeral: "I",
    audience: "Envoys and Mediators",
    question: "How is this used at the table and after the signature?",
    steps: [
      {
        label: "Practice",
        note: "The diplomatic read, pre-negotiation bond mapping, in-session and post-agreement conduct.",
        to: "/practice",
      },
      {
        label: "Colombia and Kenya",
        note: "Two processes where formal accords advanced faster than the bonds beneath them.",
        links: [
          { label: "Colombia", to: "/cases/colombia" },
          { label: "Kenya", to: "/cases/kenya" },
        ],
      },
      {
        label: "Methodology",
        note: "Scoring anchors and boundary rules for judging a bond in a live process.",
        to: "/methodology",
      },
    ],
    cta: { label: "Begin with Practice", to: "/practice" },
  },
  {
    numeral: "II",
    audience: "Scholars and Reviewers",
    question: "What is the claim, and where does it stand up to challenge?",
    steps: [
      {
        label: "Foundations",
        note: "Ubuntu and Confucian Role Ethics arriving independently at a relational account of personhood.",
        to: "/foundations",
      },
      {
        label: "The Doctrine",
        note: "Canonical definition, the ontological claim, the continuum, and the falsifiability condition.",
        to: "/doctrine",
      },
      {
        label: "Citation and Provenance",
        note: "Authorship, licensing, registration, and the deposited copies of record.",
        to: "/about",
      },
    ],
    cta: { label: "Begin with Foundations", to: "/foundations" },
  },
  {
    numeral: "III",
    audience: "Institutions and Formation Programs",
    question: "How is this taught, and how is it applied to our own context?",
    steps: [
      {
        label: "The Four Bonds",
        note: "Interpersonal, communal, intergenerational, and institutional-relational practice.",
        to: "/practice",
      },
      {
        label: "Eight Documented Cases",
        note: "Full scoring across Africa, Latin America, Europe, and Southeast Asia.",
        to: "/cases",
      },
      {
        label: "Glossary",
        note: "Shared vocabulary for training rooms, drills, and written assessment.",
        to: "/glossary",
      },
    ],
    cta: { label: "Begin with the Cases", to: "/cases" },
  },
];

export default function ReadingPathways() {
  return (
    <section className="container pb-24">
      <FadeIn>
        <div className="flex items-baseline justify-between mb-8">
          <div>
            <p className="eyebrow">Orientation</p>
            <h2 className="mt-2 font-serif text-primary">Where to begin</h2>
          </div>
          <p className="hidden md:block text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/60">
            Three Entry Points
          </p>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-foreground/75 mb-10">
          The doctrine and its handbook are read differently depending on the remit you carry into them.
          Each route below is three steps, in order.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5">
        {PATHWAYS.map((p, i) => (
          <FadeIn key={p.numeral} delay={i * 80} className="h-full">
            <div className="relative h-full bg-background border border-brass/40 p-8 md:p-9 flex flex-col">
              <span
                aria-hidden
                className="absolute top-5 right-6 font-serif text-3xl md:text-4xl font-semibold text-brass opacity-30"
              >
                {p.numeral}
              </span>
              <p className="eyebrow">For</p>
              <h3 className="mt-3 font-serif text-primary text-2xl leading-tight">{p.audience}</h3>
              <p className="mt-3 font-serif italic text-accent leading-snug">{p.question}</p>
              <hr className="gold-rule gold-rule-short mt-5 mb-5" />

              <ol className="space-y-5 flex-1">
                {p.steps.map((s, si) => (
                  <li key={s.label} className="flex gap-4">
                    <span className="shrink-0 mt-[2px] text-[10px] uppercase tracking-[0.2em] font-bold text-brass">
                      {String(si + 1).padStart(2, "0")}
                    </span>
                    <div>
                      {s.links ? (
                        <span className="text-sm font-semibold text-primary">
                          {s.links.map((l, li) => (
                            <span key={l.to}>
                              {li > 0 && " and "}
                              <Link
                                to={l.to}
                                className="underline decoration-brass/50 underline-offset-4 hover:text-accent transition-colors"
                              >
                                {l.label}
                              </Link>
                            </span>
                          ))}
                        </span>
                      ) : s.to ? (
                        <Link
                          to={s.to}
                          className="text-sm font-semibold text-primary underline decoration-brass/50 underline-offset-4 hover:text-accent transition-colors"
                        >
                          {s.label}
                        </Link>
                      ) : (
                        <span className="text-sm font-semibold text-primary">{s.label}</span>
                      )}
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70">{s.note}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                to={p.cta.to}
                className="mt-8 inline-flex items-center justify-center border border-brass px-5 py-3 text-[10px] uppercase tracking-[0.22em] font-bold text-primary hover:bg-primary hover:text-background hover:border-primary transition-colors"
              >
                {p.cta.label} &rarr;
              </Link>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
