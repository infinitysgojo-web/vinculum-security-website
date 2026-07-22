import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer className="bg-background mt-24 border-t border-brass/40">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[10px] uppercase font-semibold tracking-[0.24em] text-primary">
          <span>
            Copyright © 2026{" "}
            <a
              href="https://jamesndua.kidnexus.or.ke/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-accent transition-colors"
            >
              James Wesley Ndua
            </a>
          </span>
          <span className="text-brass">·</span>
          <span>First articulated MMXXVI</span>
          <span className="text-brass">·</span>
          <span className="text-accent">A Doctrine of Relational Security</span>
          <span className="text-brass">·</span>
          <Link to="/glossary" className="hover:text-accent transition-colors">Glossary</Link>
        </div>
        <div className="flex items-center gap-2" aria-hidden>
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-brass" />
        </div>
      </div>
    </footer>
  );
}

