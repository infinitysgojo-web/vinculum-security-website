import { Link } from "react-router-dom";
import CCBadge from "@/components/CCBadge";
import ScholarlyLinks from "@/components/ScholarlyLinks";

export default function SiteFooter() {
  return (
    <footer className="bg-background mt-24 border-t border-brass/40">
      <div className="container py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-[10px] uppercase font-semibold tracking-[0.2em] text-primary text-center md:text-left">
          <span className="whitespace-nowrap">
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
          <span className="whitespace-nowrap">All Rights Reserved</span>
          <span className="text-brass hidden sm:inline">·</span>
          <span className="whitespace-nowrap">First articulated MMXXVI</span>
          <span className="text-accent whitespace-nowrap">A Doctrine of Relational Security</span>
          <span className="text-brass hidden sm:inline">·</span>
          <Link to="/the-vinculum-dashboard" className="whitespace-nowrap hover:text-accent transition-colors">The Dashboard</Link>
          <span className="text-brass hidden sm:inline">·</span>
          <Link to="/commentary" className="whitespace-nowrap hover:text-accent transition-colors">Commentary</Link>
          <span className="text-brass hidden sm:inline">·</span>
          <Link to="/glossary" className="whitespace-nowrap hover:text-accent transition-colors">Glossary</Link>
        </div>
        <div className="flex items-center gap-2" aria-hidden>
          <span className="w-2 h-2 rounded-full bg-accent" />
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-brass" />
        </div>
      </div>

      <div className="border-t border-brass/30">
        <div className="container py-6 flex flex-col gap-5">
          <ScholarlyLinks variant="footer" />
          <p className="text-center sm:text-left text-[11px] text-muted-foreground">
            <span className="uppercase font-semibold tracking-[0.2em] text-primary text-[10px]">General correspondence</span>{" "}
            <span className="text-brass">·</span>{" "}
            <a href="mailto:vinculumsecurity@gmail.com" className="text-primary hover:text-accent transition-colors break-all">
              vinculumsecurity@gmail.com
            </a>
          </p>

          <div className="flex flex-col sm:flex-row items-start gap-4">
            <a
              href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
              target="_blank"
              rel="license noopener noreferrer"
              className="shrink-0 opacity-80 hover:opacity-100 transition-opacity block"
            >
              <CCBadge width={120} />
            </a>
            <p className="text-[11px] leading-relaxed text-muted-foreground max-w-2xl">
              This work is licensed under a{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                target="_blank"
                rel="license noopener noreferrer"
                className="text-primary hover:text-accent transition-colors"
              >
                Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License (CC BY-NC-ND 4.0)
              </a>
              . To view a copy of this license, visit{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
                target="_blank"
                rel="license noopener noreferrer"
                className="text-primary hover:text-accent transition-colors break-all"
              >
                creativecommons.org/licenses/by-nc-nd/4.0/
              </a>
              . All foundational doctrine, operational software, and nervous system architectures are original works created and owned by James Wesley Ndua. Protected by statutory copyright law with all rights strictly reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
