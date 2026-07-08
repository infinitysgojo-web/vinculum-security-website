import type { ReactNode } from "react";

export default function PullQuote({ children, cite, size = "lg" }: { children: ReactNode; cite?: string; size?: "lg" | "md" }) {
  return (
    <figure
      className={`border-l-2 border-accent pl-6 md:pl-8 py-2 ${
        size === "lg" ? "text-xl md:text-2xl" : "text-lg"
      } font-serif italic text-primary`}
    >
      <blockquote>{children}</blockquote>
      {cite && (
        <figcaption className="mt-4 not-italic font-sans text-xs uppercase tracking-widest text-muted-foreground" style={{ letterSpacing: "0.18em" }}>
          — {cite}
        </figcaption>
      )}
    </figure>
  );
}
