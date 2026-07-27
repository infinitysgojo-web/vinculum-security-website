import { Link } from "react-router-dom";
import ccBadge from "@/assets/cc-by-nc-nd.svg";

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
            . All Rights Reserved.
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

      <div className="border-t border-brass/30">
        <div className="container py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            target="_blank"
            rel="license noopener noreferrer"
            className="shrink-0 opacity-80 hover:opacity-100 transition-opacity"
          >
            <img
              src={ccBadge}
              alt="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License"
              width={152}
              height={38}
              loading="lazy"
            />
          </a>
          <p className="text-[10px] leading-relaxed uppercase tracking-[0.16em] text-muted-foreground max-w-3xl">
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
              className="text-primary hover:text-accent transition-colors break-words"
            >
              creativecommons.org/licenses/by-nc-nd/4.0/
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}


