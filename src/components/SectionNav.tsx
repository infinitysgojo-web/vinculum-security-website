import { useEffect, useState } from "react";

export type SectionItem = { id: string; label: string; numeral?: string };

/**
 * Right-rail sticky TOC on lg+, compact disclosure on mobile.
 * Uses IntersectionObserver to highlight the section crossing the upper third.
 */
export default function SectionNav({ items }: { items: SectionItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");
  const [openMobile, setOpenMobile] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const targets = items
      .map((i) => document.getElementById(i.id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length === 0) return;
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive(visible[0].target.id);
      },
      { rootMargin: "-40% 0px -55% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [items]);

  const jump = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setOpenMobile(false);
    }
  };

  return (
    <>
      {/* Mobile: compact disclosure */}
      <div className="lg:hidden print:hidden mb-8 border-y border-brass/40">
        <button
          onClick={() => setOpenMobile((v) => !v)}
          className="w-full flex items-center justify-between py-3 text-[10px] uppercase tracking-[0.24em] font-semibold text-primary"
          aria-expanded={openMobile}
        >
          <span>Contents · {items.length}</span>
          <span className="text-accent">{openMobile ? "—" : "+"}</span>
        </button>
        {openMobile && (
          <ul className="pb-4 space-y-2">
            {items.map((it) => (
              <li key={it.id}>
                <button
                  onClick={() => jump(it.id)}
                  className={`text-left text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors ${
                    active === it.id ? "text-accent" : "text-primary/70"
                  }`}
                >
                  {it.numeral && <span className="font-serif text-brass mr-2">{it.numeral}</span>}
                  {it.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Desktop: sticky right rail */}
      <nav
        aria-label="On this page"
        className="hidden lg:block print:hidden sticky top-24 self-start pl-5 border-l border-brass/50"
      >
        <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/50 mb-4">
          On this page
        </p>
        <ul className="space-y-3">
          {items.map((it) => {
            const isActive = active === it.id;
            return (
              <li key={it.id} className="relative">
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute -left-[21px] top-1.5 h-3 w-px bg-accent"
                  />
                )}
                <button
                  onClick={() => jump(it.id)}
                  className={`text-left text-[11px] uppercase tracking-[0.18em] font-semibold transition-colors leading-snug ${
                    isActive
                      ? "text-accent"
                      : "text-primary/55 hover:text-primary"
                  }`}
                >
                  {it.numeral && (
                    <span className="font-serif text-brass mr-2 not-italic normal-case tracking-normal">
                      {it.numeral}
                    </span>
                  )}
                  {it.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
