import { AUTHOR_NAME, SITE_URL } from "@/lib/seo-entities";
import { DOMAINS, type CaseStudy } from "@/content/cases";

/**
 * Print-only executive dossier. Never rendered on screen: the whole block is
 * display:none until an @media print context applies. Typeset as a formal
 * document rather than a printed web page.
 */
export default function CaseDossier({ c }: { c: CaseStudy }) {
  const url = `${SITE_URL}/cases/${c.slug}`;
  const issued = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  const docRef = `VS-CE-${c.ref.replace("VII.", "VII-")}`;

  return (
    <article className="dossier" aria-hidden="true">
      {/* Running footer, repeated on every printed page */}
      <div className="dossier-runner">
        <span>Vinculum Security · Executive Dossier · {c.shortTitle}</span>
        <span>{docRef}</span>
      </div>

      {/* ---------- Masthead ---------- */}
      <header className="dossier-masthead">
        <div className="dossier-crest">
          <p className="dossier-wordmark">Vinculum Security</p>
          <p className="dossier-motto">Pro Omni Humanitate</p>
        </div>
        <div className="dossier-classification">
          <p>Executive Dossier</p>
          <p>Applied Case Engagement</p>
          <p>Unrestricted · Public Record</p>
        </div>
      </header>

      <h1 className="dossier-title">{c.title}</h1>
      <p className="dossier-subtitle">
        Section {c.ref} · {c.region} · {c.era} · Primary pillar: {c.pillar}
      </p>

      <table className="dossier-meta">
        <tbody>
          <tr>
            <th>Document reference</th>
            <td>{docRef}</td>
            <th>Date of issue</th>
            <td>{issued}</td>
          </tr>
          <tr>
            <th>Prepared by</th>
            <td>{AUTHOR_NAME}</td>
            <th>Registration</th>
            <td>KECOBO No. RZ100967</td>
          </tr>
          <tr>
            <th>Theater</th>
            <td>{c.region}</td>
            <th>Period of record</th>
            <td>{c.era}</td>
          </tr>
          <tr>
            <th>Canonical record</th>
            <td colSpan={3}>{url}</td>
          </tr>
        </tbody>
      </table>

      {/* ---------- I ---------- */}
      <h2 className="dossier-h2">I. Executive Overview</h2>
      <p className="dossier-abstract">{c.summary}</p>
      {c.narrative.map((p, i) => (
        <p key={i} className="dossier-body">
          {p}
        </p>
      ))}

      <h3 className="dossier-h3">Conflict vector and record</h3>
      <table className="dossier-facts">
        <tbody>
          {c.facts.map((f) => (
            <tr key={f.label}>
              <th>{f.label}</th>
              <td>{f.value}</td>
            </tr>
          ))}
          <tr>
            <th>Threat classification</th>
            <td>{c.threats.join("; ")}</td>
          </tr>
        </tbody>
      </table>

      {/* ---------- II ---------- */}
      <h2 className="dossier-h2">II. The Four-Bond Continuum Matrix</h2>
      <table className="dossier-matrix">
        <thead>
          <tr>
            <th className="w-domain">Bond domain</th>
            <th className="w-score">Score</th>
            <th>Diagnostic rationale</th>
          </tr>
        </thead>
        <tbody>
          {DOMAINS.map((d, i) => (
            <tr key={d}>
              <td className="dossier-domain">{d}</td>
              <td className="dossier-score">{c.scores[i]} / 5</td>
              <td>{c.rationales[i]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="dossier-note">
        Scores run 1 to 5 within each bond domain. Higher values indicate stronger observed bond
        integrity at the period of record. Scores are diagnostic instruments for deliberation, not
        certifications of compliance.
      </p>

      <blockquote className="dossier-quote">
        {c.quote}
        <cite>
          {c.shortTitle}, Section {c.ref}
        </cite>
      </blockquote>

      {/* ---------- III ---------- */}
      <h2 className="dossier-h2">III. Doctrinal Findings</h2>
      <ol className="dossier-findings">
        {c.finding.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ol>
      <p className="dossier-pattern">
        <span>Cross-case position.</span> {c.pattern}
      </p>

      {/* ---------- IV ---------- */}
      <h2 className="dossier-h2">IV. Applied Protocols for Envoys</h2>
      <h3 className="dossier-h3">Handbook § 12 · What a Vinculum diplomat does</h3>
      <p className="dossier-body">{c.practice}</p>
      <h3 className="dossier-h3">Transferable directive</h3>
      <p className="dossier-body">{c.takeaway}</p>

      {/* ---------- V ---------- */}
      <h2 className="dossier-h2">V. Sources of Record</h2>
      <ol className="dossier-sources">
        {c.sources.map((s, i) => (
          <li key={i}>{s}</li>
        ))}
      </ol>

      <div className="dossier-colophon">
        <p>
          Drawn from <em>Vinculum Security: The Fortified Doctrine</em>, Expanded Version, Final
          Edition, Section {c.ref}, and <em>Vinculum Diplomacy: The Practitioner Handbook</em>, Final
          Edition, Section 12. Both by {AUTHOR_NAME}.
        </p>
        <p>
          © {new Date().getFullYear()} {AUTHOR_NAME}. Registered with the Kenya Copyright Board,
          Registration No. RZ100967. Released under CC BY-NC-SA 4.0. Canonical record: {url}
        </p>
      </div>
    </article>
  );
}
