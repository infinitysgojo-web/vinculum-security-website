import { COUNTRY_SILHOUETTE } from "@/content/geo";

/**
 * Plain outline of the territory a case belongs to, drawn from Natural Earth
 * geometry. Decorative support for the written record, not a political claim
 * about any boundary.
 */
export default function CountryOutline({
  slug,
  size = 160,
  className = "",
  label,
}: {
  slug: string;
  size?: number;
  className?: string;
  label?: string;
}) {
  const geo = COUNTRY_SILHOUETTE[slug];
  if (!geo) return null;

  return (
    <svg
      viewBox={`0 0 ${geo.w} ${geo.h}`}
      width={size}
      height={size}
      className={className}
      role="img"
      aria-label={label ? `Outline of ${label}` : "Territory outline"}
    >
      <path
        d={geo.d}
        className="fill-accent stroke-primary"
        fillOpacity={0.14}
        strokeWidth={1.1}
        strokeLinejoin="round"
      />
    </svg>
  );
}
