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

function HalMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 6h16v12H4z" />
      <path d="M8 6v12M16 6v12" />
      <path d="M4 10h16" />
    </svg>
  );
}

function OpenAireMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <circle cx="11" cy="11" r="6" />
      <path d="M15 15l5 5" />
    </svg>
  );
}

function HcommonsMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 6c4 0 6 2 9 2s5-2 9-2v13c-4 0-6-2-9-2s-5 2-9 2V6z" />
      <path d="M12 8v13" />
    </svg>
  );
}

function CambridgeMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 7.5L12 3.5l8 4v9l-8 4-8-4v-9z" />
      <path d="M8.5 10.5h7M8.5 13.5h7" />
    </svg>
  );
}

function SsrnMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M6 3.5h9l3.5 3.5v13.5H6z" />
      <path d="M14.5 3.5V7H18" />
      <path d="M9 11.5h6M9 14.5h4" />
    </svg>
  );
}

function ResearchgateMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M7 4.5h6.5c2.4 0 4 1.5 4 3.8 0 2.5-1.9 3.9-4.4 3.9H10v6.8H7z" />
      <path d="M10 10.4h2.9c1 0 1.7-.7 1.7-1.9s-.7-1.8-1.7-1.8H10z" />
      <path d="M15.8 15.2l3.2 5.8h-2.4l-2.9-5.3" />
    </svg>
  );
}

function InstagramMark() {
  return (
    <svg viewBox="0 0 24 24" className={ICON} fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

const LINKS = [
  { label: "ORCID", href: "https://orcid.org/0009-0005-9861-8849", Icon: OrcidMark },
  { label: "Zenodo", href: "https://zenodo.org/communities/vinculumsecurity/records/", Icon: ZenodoMark },
  { label: "OSF", href: "https://osf.io/user/7ad5x", Icon: OsfMark },
  { label: "Portfolio", href: "https://jamesndua.kidnexus.or.ke/", Icon: PortfolioMark },
  { label: "Dataverse", href: "https://dataverse.harvard.edu/dataverse/viculumsecurity", Icon: DataverseMark },
  { label: "HAL", href: "https://cv.hal.science/james-wesley-ndua", Icon: HalMark },
  {
    label: "OpenAire",
    href: "https://explore.openaire.eu/search/result?pid=10.5281/zenodo.21615991",
    Icon: OpenAireMark,
  },
  {
    label: "Knowledge Commons",
    href: "https://works.hcommons.org/collections/vinculumsecurity/records?q=&l=list&p=1&s=10&sort=newest",
    Icon: HcommonsMark,
  },
  {
    label: "Cambridge Open Engage",
    href: "https://www.cambridge.org/engage/coe/article-details/6a69e74c4770e67d9259a4fc",
    Icon: CambridgeMark,
  },
  {
    label: "SSRN",
    href: "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7189099",
    Icon: SsrnMark,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/vinculumsecurity/",
    Icon: InstagramMark,
  },
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
