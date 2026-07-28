type Props = { width?: number; className?: string };

/**
 * Self-contained black-and-white CC BY-NC-ND 4.0 button.
 * Drawn inline so it never depends on an external image host.
 */
export default function CCBadge({ width = 120, className = "" }: Props) {
  const height = Math.round((width / 120) * 42);
  return (
    <svg
      viewBox="0 0 120 42"
      width={width}
      height={height}
      className={className}
      role="img"
      aria-label="Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International License"
    >
      <rect x="0.5" y="0.5" width="119" height="41" rx="5" fill="#000" stroke="#000" />

      {/* cc */}
      <g transform="translate(15,21)">
        <circle r="12" fill="none" stroke="#fff" strokeWidth="2.2" />
        <text
          x="0"
          y="4.6"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="13"
          fontWeight="700"
        >
          cc
        </text>
      </g>

      {/* BY: person */}
      <g transform="translate(43,21)">
        <circle r="12" fill="none" stroke="#fff" strokeWidth="2.2" />
        <circle cx="0" cy="-5" r="2.6" fill="#fff" />
        <path d="M-4.6 -1.2h9.2v6.2h-2.6v6h-4v-6h-2.6z" fill="#fff" />
      </g>

      {/* NC: crossed-out dollar */}
      <g transform="translate(71,21)">
        <circle r="12" fill="none" stroke="#fff" strokeWidth="2.2" />
        <text
          x="0"
          y="5.4"
          textAnchor="middle"
          fill="#fff"
          fontFamily="Helvetica, Arial, sans-serif"
          fontSize="15"
          fontWeight="700"
        >
          $
        </text>
        <line x1="-9" y1="9" x2="9" y2="-9" stroke="#fff" strokeWidth="2.2" />
      </g>

      {/* ND: equals */}
      <g transform="translate(99,21)">
        <circle r="12" fill="none" stroke="#fff" strokeWidth="2.2" />
        <rect x="-6.5" y="-4.2" width="13" height="2.6" fill="#fff" />
        <rect x="-6.5" y="1.6" width="13" height="2.6" fill="#fff" />
      </g>
    </svg>
  );
}
