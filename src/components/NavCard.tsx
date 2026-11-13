import { Link } from "react-router-dom";

const ROMAN = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];

export default function NavCard({
  to,
  eyebrow,
  title,
  description,
  index = 0,
}: {
  to: string;
  eyebrow: string;
  title: string;
  description: string;
  index?: number;
}) {
  const numeral = ROMAN[index] ?? String(index + 1);
  return (
    <Link
      to={to}
      className="group relative block h-full bg-background border border-brass/40 p-8 md:p-10 overflow-hidden transition-colors duration-500 hover:bg-primary hover:border-brass"
    >
      <span
        aria-hidden
        className="absolute top-5 right-6 font-serif text-3xl md:text-4xl font-semibold text-brass opacity-30 group-hover:opacity-100 transition-opacity duration-500"
      >
        {numeral}
      </span>
      <p className="eyebrow pr-24 md:pr-28 group-hover:text-brass transition-colors">{eyebrow}</p>
      <h3 className="mt-3 font-serif text-primary group-hover:text-background transition-colors">
        {title}
      </h3>
      <p className="mt-4 text-sm text-foreground/75 group-hover:text-background/80 leading-relaxed transition-colors">
        {description}
      </p>
      <div className="mt-8 h-px w-0 bg-accent group-hover:w-full transition-all duration-700" />
    </Link>
  );
}
