import { Link } from "react-router-dom";
import SEO from "@/components/SEO";
import GoldRule from "@/components/GoldRule";

export default function NotFound() {
  return (
    <>
      <SEO
        title="Ignotum: Page not found"
        description="The road you seek is not on the imperial map."
        path="/404"
      />
      <div className="container py-24 md:py-32">
        <div className="max-w-2xl mx-auto text-center">
          <p className="eyebrow text-accent">Ignotum · Terra Incognita</p>

          <div
            aria-hidden
            className="mt-8 font-serif text-brass leading-none tracking-[0.08em] text-7xl md:text-8xl select-none"
          >
            CDIV
          </div>

          <h1 className="mt-8 font-serif text-primary text-3xl md:text-5xl leading-tight">
            This road is not on the imperial map.
          </h1>

          <GoldRule className="mt-8 mx-auto" />

          <p className="mt-8 font-serif italic text-lg md:text-xl text-foreground/80 leading-relaxed">
            Even the Empire's cartographers left blank spaces at the edges of the folio.
            You have wandered past the last brass rule.
          </p>

          <p className="mt-4 text-sm text-muted-foreground">
            No page answers to this address. The scribes suggest returning by one of the marked routes below.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            <Link
              to="/"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-accent border-b-2 border-accent pb-1 hover:text-primary hover:border-primary transition-colors"
            >
              Return to the Forum
            </Link>
            <Link
              to="/doctrine"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80 border-b border-brass/50 pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              The Doctrine
            </Link>
            <Link
              to="/glossary"
              className="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary/80 border-b border-brass/50 pb-1 hover:text-accent hover:border-accent transition-colors"
            >
              Consult the Glossary
            </Link>
          </div>

          <p className="mt-16 text-[10px] uppercase tracking-[0.28em] text-primary/50">
            Errata · MMXXVI
          </p>
        </div>
      </div>
    </>
  );
}
