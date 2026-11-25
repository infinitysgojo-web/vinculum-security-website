import { useCallback, useEffect, useId, useRef, useState, type ReactNode, type RefObject } from "react";
import { ChevronDown, Clock, List, X } from "lucide-react";
import { activeSection, minutesLeft, readerKeyAction, readingProgress } from "./academyReaderState";

/**
 * The Chancellery Academy lecture reader: one near-full-page reading surface shared by
 * all twenty chapters.
 *
 *   1280px and wider   panel 96vw × 94dvh (max 1600px), sticky contents rail of 260px
 *   768 to 1279px      panel full width and height less a 16px inset; Contents in the header
 *   under 768px        full-screen sheet (100vw × 100dvh, safe-area aware), compact header
 *
 * Only the panel scrolls; the page behind is locked. Escape closes an open Contents menu
 * first and the lecture next, from anywhere inside the panel; the close X is always in the
 * sticky header. Focus is trapped in the dialog and the caller restores it to the opener.
 */

export type ReaderTocEntry = { id: string; label: string; sub?: string };

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

export default function AcademyReader({
  number,
  eyebrow,
  title,
  minutes,
  toc,
  scrollRef,
  onClose,
  onProgress,
  children,
}: {
  number: string;
  eyebrow: string;
  title: string;
  minutes: number;
  toc: ReaderTocEntry[];
  scrollRef: RefObject<HTMLDivElement>;
  onClose: () => void;
  onProgress?: (fraction: number) => void;
  children: ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const [current, setCurrent] = useState(-1);
  const menuOpenRef = useRef(menuOpen);
  menuOpenRef.current = menuOpen;

  // Lock the page behind the panel and restore its scroll on close.
  useEffect(() => {
    const y = window.scrollY;
    const html = document.documentElement;
    const prev = { html: html.style.overflow, body: document.body.style.overflow };
    html.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      html.style.overflow = prev.html;
      document.body.style.overflow = prev.body;
      window.scrollTo({ top: y, left: 0, behavior: "instant" as ScrollBehavior });
    };
  }, []);

  // Escape (menu first, then lecture) and the focus trap, captured so no inner control can swallow them.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const action = readerKeyAction(e.key, { menuOpen: menuOpenRef.current });
      if (action === "close-menu") {
        e.preventDefault();
        setMenuOpen(false);
        return;
      }
      if (action === "close-lecture") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((n) => n.offsetParent !== null || n === document.activeElement);
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!panelRef.current.contains(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey, true);
    return () => document.removeEventListener("keydown", onKey, true);
  }, [onClose]);

  // Initial focus on the close control, so Escape and Tab start inside the dialog.
  useEffect(() => {
    panelRef.current?.querySelector<HTMLElement>("[data-reader-close]")?.focus({ preventScroll: true });
  }, []);

  const measure = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const p = readingProgress(el.scrollTop, el.scrollHeight, el.clientHeight);
    setProgress(p);
    onProgress?.(p);
    const base = el.getBoundingClientRect().top;
    const tops = toc.map((t) => {
      const node = el.querySelector<HTMLElement>(`#${CSS.escape(t.id)}`);
      return node ? node.getBoundingClientRect().top - base + el.scrollTop : Number.POSITIVE_INFINITY;
    });
    setCurrent(activeSection(tops, el.scrollTop));
  }, [scrollRef, toc, onProgress]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    measure();
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [scrollRef, measure]);

  const jump = (id: string) => {
    const el = scrollRef.current;
    const node = el?.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
    if (!el || !node) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const top = node.getBoundingClientRect().top - el.getBoundingClientRect().top + el.scrollTop - 16;
    el.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
    setMenuOpen(false);
    node.focus({ preventScroll: true });
  };

  const left = minutesLeft(minutes, progress);
  const pct = Math.round(progress * 100);

  const tocList = (variant: "rail" | "menu") => (
    <ol className={variant === "rail" ? "space-y-0.5" : "max-h-[60dvh] overflow-y-auto p-2"} data-testid={variant === "rail" ? "reader-rail-list" : "reader-menu-list"}>
      {toc.map((t, i) => {
        const on = i === current;
        return (
          <li key={t.id}>
            <a
              href={`#${t.id}`}
              onClick={(e) => {
                e.preventDefault();
                jump(t.id);
              }}
              aria-current={on ? "location" : undefined}
              className={`block min-h-11 border-l-2 px-3 py-2 text-left transition-colors motion-reduce:transition-none ${on ? "border-brass bg-brass/10 text-primary" : "border-transparent text-muted-foreground hover:border-brass/50 hover:text-primary"}`}
            >
              <span className="block font-serif text-[15px] leading-snug">{t.label}</span>
              {t.sub && <span className="mt-0.5 block text-[11px] leading-snug opacity-80">{t.sub}</span>}
            </a>
          </li>
        );
      })}
    </ol>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-stretch justify-center bg-background/85 backdrop-blur-sm md:p-2 xl:items-center xl:p-0"
      data-testid="tier-2-lecture-surface"
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative flex h-[100dvh] w-screen flex-col overflow-hidden bg-card shadow-2xl md:h-[calc(100dvh-16px)] md:w-[calc(100vw-16px)] md:rounded-sm md:border md:border-brass/60 xl:h-[94dvh] xl:w-[96vw] xl:max-w-[1600px]"
        data-testid="academy-reader"
      >
        {/* Sticky header: number, title, Contents (below 1280px), progress and the close X */}
        <header className="relative z-20 shrink-0 border-b border-brass/40 bg-card pt-[env(safe-area-inset-top)]">
          <div className="flex items-center gap-2 px-3 py-2 sm:px-5 md:gap-3 md:px-6 md:py-3 [@media(max-height:500px)]:py-1">
            <div className="min-w-0 flex-1">
              <p className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-brass [@media(max-height:500px)]:hidden">
                <span className="md:hidden">Chapter {number}</span>
                <span className="hidden md:inline">{eyebrow} · Chapter {number}</span>
              </p>
              <h2 id={titleId} className="truncate font-serif text-[17px] font-normal leading-snug text-primary md:text-xl" title={`${number} ${title}`}>
                {number} {title}
              </h2>
            </div>
            <div className="relative xl:hidden">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                aria-expanded={menuOpen}
                aria-controls="academy-reader-contents"
                className="inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 border border-border/80 px-3 font-mono text-xs text-primary hover:border-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                data-testid="reader-contents-button"
              >
                <List size={16} aria-hidden />
                <span className="hidden sm:inline">Contents</span>
                <span className="sr-only sm:hidden">Contents</span>
                <ChevronDown size={14} aria-hidden className={`hidden transition-transform motion-reduce:transition-none sm:block ${menuOpen ? "rotate-180" : ""}`} />
              </button>
              {menuOpen && (
                <div id="academy-reader-contents" className="absolute right-0 top-full z-30 mt-2 w-[min(22rem,calc(100vw-1.5rem))] border border-brass/50 bg-card shadow-xl" data-testid="reader-contents-menu">
                  <p className="border-b border-border/50 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Contents · {pct}% read · {left} min left</p>
                  {tocList("menu")}
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close lecture"
              data-reader-close
              data-testid="reader-close"
              className="inline-flex min-h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 border border-border/80 px-2.5 font-mono text-xs text-primary hover:border-brass focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent md:px-3"
            >
              <X size={18} aria-hidden />
              <span className="hidden md:inline">Close Lecture</span>
            </button>
          </div>
          <div className="h-[3px] w-full bg-border/40" aria-hidden>
            <div className="h-full bg-brass transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          {/* Contents rail, 1280px and wider */}
          <nav aria-label="Lecture contents" className="hidden w-[260px] shrink-0 flex-col border-r border-border/60 bg-background/30 xl:flex" data-testid="reader-rail">
            <div className="border-b border-border/50 px-4 py-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Contents</p>
              <div className="mt-2 h-1 w-full bg-border/50" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
                <div className="h-full bg-brass" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-1.5 flex items-center gap-1 font-mono text-[11px] text-muted-foreground"><Clock size={12} aria-hidden className="text-brass" /> {pct}% read · {left} min left</p>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-1 py-2">{tocList("rail")}</div>
          </nav>

          <div ref={scrollRef} className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain pb-[env(safe-area-inset-bottom)]" data-testid="reader-scroll" tabIndex={-1}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
