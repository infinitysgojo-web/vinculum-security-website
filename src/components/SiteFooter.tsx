import { Link } from "react-router-dom";
import ccBadge from "@/assets/cc-by-nc-nd.png.asset.json";

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
          <span className="text-brass hidden sm:inline">·</span>
          <span className="text-accent whitespace-nowrap">A Doctrine of Relational Security</span>
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
        <div className="container py-6 flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
          <a
            href="https://creativecommons.org/licenses/by-nc-nd/4.0/"
            target="_blank"
            rel="license noopener noreferrer"
            className="shrink-0 opacity-80 hover:opacity-100 transition-opacity block w-[120px] h-[42px] overflow-hidden"
          >
            <img
              src={ccBadge.url}
              alt="Creative Commons BY-NC-ND 4.0"
              width={120}
              height={42}
              loading="lazy"
              className="w-[120px] h-[42px] object-contain object-left"
            />
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
          </p>
        </div>
      </div>

    </footer>
  );
}


