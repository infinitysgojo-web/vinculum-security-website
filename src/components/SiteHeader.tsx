import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

const NAV = [
  { to: "/doctrine", label: "The Doctrine" },
  { to: "/relational-security", label: "Relational Security" },
  { to: "/foundations", label: "Foundations" },
  { to: "/cases", label: "Case Studies" },
  { to: "/methodology", label: "Methodology" },
  { to: "/practice", label: "Practice" },
  { to: "/glossary", label: "Glossary" },
  { to: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur border-b-2 border-primary print:hidden">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-3 group" aria-label="Vinculum Security, Home">
          <Logo size={26} />
          <span className="wordmark text-xl md:text-2xl leading-none group-hover:text-accent transition-colors">
            Vinculum Security
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors relative pb-1 border-b-2 ${
                  isActive
                    ? "border-accent text-accent"
                    : "border-transparent text-primary hover:text-accent hover:border-accent/60"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 -mr-2 text-primary"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-brass/40 bg-background">
          <nav className="container flex flex-col py-2" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `py-3 text-xs uppercase tracking-[0.18em] font-semibold border-b border-brass/25 ${
                    isActive ? "text-accent" : "text-primary"
                  }`
                }
              >
                {n.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
