type Variant = "footer" | "page";

const ICON = "w-3.5 h-3.5 shrink-0";

function OrcidMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden>
      <circle cx="12" cy="12" r="11" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <rect x="6.6" y="9" width="1.7" height="8" />
      <circle cx="7.45" cy="6.9" r="1.15" />
      <path d="M10.9 9h3.5c2.6 0 4.3 1.7 4.3 4s-1.7 4-4.3 4h-3.5V9zm1.7 1.6v4.8h1.7c1.7 0 2.6-1 2.6-2.4s-.9-2.4-2.6-2.4h-1.7z" />
    </svg>
  );
}

function ZenodoMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 7c0-2 4-3.4 9-3.4S21 5 21 7v10c0 2-4 3.4-9 3.4S3 19 3 17V7z" />
      <path d="M3 7c0 2 4 3.4 9 3.4S21 9 21 7" />
      <path d="M3 12.5c0 2 4 3.4 9 3.4s9-1.4 9-3.4" />
    </svg>
  );
}

function FigshareMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="currentColor" aria-hidden>
      <circle cx="6.5" cy="6.5" r="2.6" />
      <circle cx="6.5" cy="17.5" r="2.6" />
      <circle cx="17.5" cy="12" r="2.6" />
      <path
        d="M8.7 7.7l6.6 3.1M8.7 16.3l6.6-3.1"
        stroke="currentColor"
        strokeWidth="1.6"
        fill="none"
      />
    </svg>
  );
}

function OsfMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="4.2" />
      <ellipse cx="12" cy="12" rx="10" ry="5" transform="rotate(-30 12 12)" />
    </svg>
  );
}

function PortfolioMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.6 2.6 3.9 5.6 3.9 9s-1.3 6.4-3.9 9c-2.6-2.6-3.9-5.6-3.9-9S9.4 5.6 12 3z" />
    </svg>
  );
}

function DataverseMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M12 2l8.5 5v10L12 22l-8.5-5V7L12 2z" />
      <path d="M12 2v10M3.5 7L12 12l8.5-5" />
    </svg>
  );
}

const LINKS = [
  { label: "ORCID", href: "https://orcid.org/0009-0005-9861-8849", Icon: OrcidMark },
  { label: "Zenodo", href: "https://zenodo.org/communities/vinculumsecurity/records/", Icon: ZenodoMark },
  {
    label: "Figshare",
    href: "https://figshare.com/articles/preprint/_b_Vinculum_Security_Vinculum_Diplomacy_b_/33103223",
    Icon: FigshareMark,
  },
  { label: "OSF", href: "https://osf.io/user/7ad5x", Icon: OsfMark },
  { label: "Portfolio", href: "https://jamesndua.kidnexus.or.ke/", Icon: PortfolioMark },
  { label: "Dataverse", href: "https://dataverse.harvard.edu/dataverse/viculumsecurity", Icon: DataverseMark },
];

export default function ScholarlyLinks({
  variant = "page",
  className = "",
}: {
  variant?: Variant;
  className?: string;
}) {
  const isFooter = variant === "footer";
  return (
    <ul
      className={`flex flex-wrap items-center gap-2 ${
        isFooter ? "justify-center sm:justify-start" : "justify-start"
      } ${className}`}
    >
      {LINKS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="me noopener noreferrer"
            aria-label={`${label} profile, opens in a new tab`}
            className={`inline-flex items-center gap-2 border border-brass/60 text-primary hover:text-accent hover:border-accent transition-colors rounded-sm uppercase font-semibold tracking-[0.14em] ${
              isFooter ? "px-2.5 py-1 text-[10px]" : "px-3 py-1.5 text-[11px]"
            }`}
          >
            <Icon />
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
