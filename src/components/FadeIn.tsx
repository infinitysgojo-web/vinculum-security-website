import { useEffect, useRef, useState, type ElementType, type ReactNode } from "react";

/**
 * Scroll-triggered fade. Content can never stay stuck at opacity 0:
 * - low threshold + rootMargin so tall blocks (mobile) still trigger
 * - immediate reveal when IntersectionObserver is unavailable or reduced motion is preferred
 * - safety timeout reveals content even if the observer stalls (e.g. after restored scroll)
 */
export default function FadeIn({
  children,
  delay = 0,
  as: Tag = "div",
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  as?: ElementType;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setVisible(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    let delayTimer: ReturnType<typeof setTimeout> | undefined;
    const safetyTimer = setTimeout(() => setVisible(true), delay + 600);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            clearTimeout(safetyTimer);
            delayTimer = setTimeout(() => setVisible(true), delay);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.01, rootMargin: "0px 0px 100px 0px" }
    );

    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(safetyTimer);
      if (delayTimer) clearTimeout(delayTimer);
    };
  }, [delay]);

  const Component = Tag;
  return (
    <Component ref={ref} className={`fade-in ${visible ? "is-visible" : ""} ${className}`}>
      {children}
    </Component>
  );
}
