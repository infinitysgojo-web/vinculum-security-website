import type { ReactNode } from "react";

export default function PullQuote({
  children,
  cite,
  size = "lg",
  tone = "terracotta",
}: {
  children: ReactNode;
  cite?: string;
  size?: "lg" | "md";
  tone?: "terracotta" | "blue";
}) {
  const toneClass = tone === "terracotta" ? "text-accent" : "text-primary";
  return (
    <figure
      className={`border-l-2 border-brass pl-6 md:pl-8 py-2 ${
        size === "lg" ? "text-2xl md:text-4xl" : "text-lg md:text-xl"
      } font-serif italic ${toneClass} leading-tight`}
    >
      <blockquote>{children}</blockquote>
      {cite && (
        <figcaption
          className="mt-5 not-italic font-sans text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70"
        >
          — {cite}
        </figcaption>
      )}
    </figure>
  );
}
