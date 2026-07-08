import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function NavCard({ to, eyebrow, title, description }: { to: string; eyebrow: string; title: string; description: string }) {
  return (
    <Link
      to={to}
      className="group block bg-navy-tint border border-border p-6 md:p-7 transition-colors hover:border-accent"
    >
      <p className="eyebrow text-primary/70">{eyebrow}</p>
      <h3 className="mt-2 font-serif text-primary group-hover:text-accent transition-colors">{title}</h3>
      <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-accent" style={{ letterSpacing: "0.18em" }}>
        Read <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
