import { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";

const NAV = [
  { to: "/doctrine", label: "The Doctrine" },
  { to: "/foundations", label: "Foundations" },
  { to: "/cases", label: "Case Studies" },
  { to: "/methodology", label: "Methodology" },
  { to: "/practice", label: "Practice" },
  { to: "/about", label: "About" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-primary text-primary-foreground border-b border-accent/60">
      <div className="container flex items-center justify-between h-16">
        <Link to="/" className="font-serif text-lg tracking-wider uppercase" style={{ letterSpacing: "0.15em" }}>
          Vinculum Security
        </Link>

        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              className={({ isActive }) =>
                `text-sm tracking-wide transition-colors relative pb-1 border-b-2 ${
                  isActive
                    ? "border-accent text-primary-foreground"
                    : "border-transparent text-primary-foreground/85 hover:text-primary-foreground hover:border-accent/70"
                }`
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="lg:hidden p-2 -mr-2"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-accent/40 bg-primary">
          <nav className="container flex flex-col py-3" aria-label="Mobile">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                className={({ isActive }) =>
                  `py-3 text-sm border-b border-primary-foreground/10 ${
                    isActive ? "text-accent" : "text-primary-foreground/90"
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
