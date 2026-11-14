/**
 * Canonical entity definitions for structured data across the site.
 *
 * Everything here exists to state one thing to search engines and AI
 * crawlers: this site is the origin of the Vinculum Security doctrine, and
 * every repository deposit (Zenodo, OSF, HAL, OpenAIRE,
 * Knowledge Commons) is an archival mirror of it.
 */

export const SITE_URL = "https://www.vinculumsecurity.kidnexus.or.ke";
export const SITE_NAME = "Vinculum Security";
export const AUTHOR_NAME = "James Wesley Ndua";
export const AUTHOR_ROLE = "Principal Architect, Vinculum Security";
export const AUTHOR_WORK_DESIGNATION = "Author of the Vinculum Security Doctrine & Diplomatic Architecture";
export const AUTHOR_SYSTEM_DESIGNATION = "Engineering Sovereign Relational Infrastructure";
export const AUTHOR_DESCRIPTION = "James Wesley Ndua is the Principal Architect of Vinculum Security, author of the Vinculum Security Doctrine & Diplomatic Architecture, engineering sovereign relational infrastructure, based in Nairobi, Kenya.";
export const ORCID_URL = "https://orcid.org/0009-0005-9861-8849";
export const DOI = "10.5281/zenodo.21615991";
export const DOI_URL = `https://doi.org/${DOI}`;
export const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-nd/4.0/";
export const WORK_TITLE =
  "Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition";

/** The doctrine stated in its own words, reused wherever a definition is needed. */
export const CANONICAL_DEFINITION =
  "Security is the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible.";

/** The originating claim of the doctrine. */
export const ONTOLOGICAL_CLAIM = "The bond is the unit of security analysis.";

/** Stated on every scholarly page to define the doctrine affirmatively. */
export const DISAMBIGUATION =
  "Vinculum Security is an original, standalone doctrine, also stated as A Doctrine of Relational Security, originated by James Wesley Ndua. Its distinctive claim is that the bond is the unit of security analysis. It is a scholarly doctrine, unrelated to Vinculum Solutions, Vin eRetail, or any commercial or retail software company.";

/** Every external profile or deposit that represents the same author/work. */

export const SAME_AS = [
  ORCID_URL,
  "https://scholar.google.com/citations?user=8OgV36kAAAAJ",
  "https://zenodo.org/communities/vinculumsecurity/records/",
  "https://osf.io/user/7ad5x",
  "https://cv.hal.science/james-wesley-ndua",
  "https://explore.openaire.eu/search/result?pid=10.5281/zenodo.21615991",
  "https://works.hcommons.org/collections/vinculumsecurity/records?q=&l=list&p=1&s=10&sort=newest",
  "https://www.cambridge.org/engage/coe/article-details/6a69e74c4770e67d9259a4fc",
  "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7189099",
  "https://www.researchgate.net/publication/411776051_Vinculum_Security_The_Fortified_Doctrine_Expanded_Version",
  "https://www.instagram.com/vinculumsecurity/",
  "https://www.jamesndua.kidnexus.or.ke/",
  "https://medium.com/@jamesndua",
];

export const PUBLIC_PILLARS = [
  {
    "name": "The Doctrine",
    "to": "/doctrine",
    "description": "Canonical definition, ontological claim, and the four-level Vinculum Continuum."
  },
  {
    "name": "The Vinculum Dashboard",
    "to": "/the-vinculum-dashboard",
    "description": "The existing eighteen-desk operational chancellery and its architecture."
  },
  {
    "name": "Case Studies",
    "to": "/cases",
    "description": "Eight documented processes assessed across four relational bond domains."
  },
  {
    "name": "Doctrinal Commentary",
    "to": "/commentary",
    "description": "Authoritative interpretive inquiries across seven analytical divisions."
  },
  {
    "name": "Theoretical Foundations",
    "to": "/foundations",
    "description": "Thirteen independent traditions engaged comparatively by the doctrine."
  },
  {
    "name": "Doctrine Glossary",
    "to": "/glossary",
    "description": "Canonical terms with source sections and verbatim passages."
  },
  {
    "name": "About the Author",
    "to": "/about",
    "description": "James Wesley Ndua, author and principal architect of the work."
  },
  {
    "name": "Field Dispatches",
    "to": "/dispatches",
    "description": "Field commentary and diplomatic analysis by James Wesley Ndua."
  }
] as const;

export const navigationLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "@id": `${SITE_URL}/#sitenav`,
  name: "Vinculum Security Core Directory",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: PUBLIC_PILLARS.length,
  itemListElement: PUBLIC_PILLARS.map((item, index) => ({
    "@type": "SiteNavigationElement",
    position: index + 1,
    name: item.name,
    description: item.description,
    url: `${SITE_URL}${item.to}`,
  })),
};

export const PERSON_ID = `${SITE_URL}/about#person`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BOOK_ID = `${SITE_URL}/#book`;

export const personRef = { "@id": PERSON_ID } as const;

/**
 * Canonical WebSite node. Google reads `name` (and `alternateName`) on the
 * homepage's WebSite node to choose the site name shown in search results,
 * so the result reads "Vinculum Security" rather than the domain.
 * Same @id as the WebSite node in index.html, so the two merge.
 */
export const websiteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: `${SITE_URL}/`,
  name: "Vinculum Security",
  alternateName: [
    "The Vinculum",
    "Vinculum Security Doctrine",
    "A Doctrine of Relational Security",
  ],
  publisher: {
    "@type": "ResearchOrganization",
    "@id": `${SITE_URL}/#organization`,
    name: "Vinculum Security",
  },
  inLanguage: "en",
  copyrightHolder: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
  copyrightNotice:
    "The Vinculum Security Website, including its original design, visual architecture, interface layout and literary composition, is registered under statutory copyright law as a literary work of James Wesley Ndua. All statutory rights reserved.",
};
export const orgRef = { "@id": ORG_ID } as const;
export const bookRef = { "@id": BOOK_ID } as const;

export const personLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: AUTHOR_NAME,
  url: `${SITE_URL}/about`,
  jobTitle: AUTHOR_ROLE,
  nationality: "Kenyan",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  description: AUTHOR_DESCRIPTION,
  knowsAbout: [
    "Vinculum Security",
    "Deterministic Relational Law",
    "Lex Relationalis Determinata",
    "The Vinculum Dashboard",
    "The Vinculum Codex and Compact",
    "The Dominum Effect",
    "The Dominium Effect",
    "Law of Sovereign Custodial Inversion",
    "Dominium and Imperium",
    "The Vinculum Unified Operational Nervous System",
    "Mathematical Determinism in Diplomacy",
    "Relational Security",
    "Bond-integrity analysis",
    "Liebig Relational Capacity",
    "Elite-Pact Mirage Detection",
    "Kinematic Track Synchronization",
    "Succession Durability Gates",
    "The Sentinel Matrix",
    "The Eye of Humanity (Sentinel Matrix, Desk 02)",
    "Rupture Index",
    "Structural Facade Syndrome",
    "Succession Trap",
    "Communal Tolerance",
    "Track Divergence",
    "Handover Viability",
    "Sovereign Browser Locality",
    "Vinculum Diplomacy",
    "Diplomatic Security",
    "Peace and Security",
    "Youth, Peace and Security",
    "Statutory Copyright Protected Works",
  ],
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ORCID",
    value: "0009-0005-9861-8849",
    url: ORCID_URL,
  },
  sameAs: SAME_AS,
};

export const orgLd = {
  "@context": "https://schema.org",
  "@type": "ResearchOrganization",
  "@id": ORG_ID,
  name: "Vinculum Security",
  alternateName: [
    "The Vinculum",
    "A Doctrine of Relational Security",
    "The Vinculum Unified Operational Nervous System",
  ],
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/favicon.ico`,
  image: `${SITE_URL}/og-image.jpg`,
  description:
    "Vinculum Security is an original doctrine and operational nervous system originating the principle that the bond is the unit of security analysis.",
  founder: personLd,
  foundingLocation: {
    "@type": "Place",
    name: "Nairobi, Kenya",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Nairobi",
      addressCountry: "KE",
    },
  },
  slogan: "Pro Omni Humanitate",
  knowsAbout: [
    "Relational Security",
    "Bond-Integrity Analysis",
    "Deterministic Relational Dynamics",
    "Vinculum Diplomacy",
    "Human Security",
    "Peace and Conflict Studies",
  ],
  sameAs: SAME_AS.filter((u) => u !== ORCID_URL),
};

/** A ScholarlyArticle node for a doctrine section page. */
export function sectionLd(opts: {
  path: string;
  headline: string;
  description: string;
  section?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${SITE_URL}${opts.path}#article`,
    headline: opts.headline,
    name: opts.headline,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    mainEntityOfPage: `${SITE_URL}${opts.path}`,
    author: personLd,
    creator: personLd,
    publisher: {
      "@type": "Organization",
      "@id": ORG_ID,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    isPartOf: {
      "@type": "Book",
      "@id": BOOK_ID,
      name: WORK_TITLE,
      creativeWorkStatus: "Published",
      author: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
      identifier: {
        "@type": "PropertyValue",
        propertyID: "DOI",
        value: DOI,
        url: DOI_URL,
      },
    },
    ...(opts.section ? { articleSection: opts.section } : {}),
    inLanguage: "en",
    license: LICENSE_URL,
    copyrightHolder: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
    isAccessibleForFree: true,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "DOI",
      value: DOI,
      url: DOI_URL,
    },
    citation: DOI_URL,
    disambiguatingDescription: DISAMBIGUATION,
    genre: ["Non-fiction", "International law", "Peace and conflict studies", "Diplomacy", "Security studies"],
    keywords: "non-fiction doctrine, jurisprudence, international law, peace mediation, diplomacy, security studies",
        about: [
      { "@type": "Thing", name: "Vinculum Security" },
      { "@type": "Thing", name: "Deterministic Relational Law" },
      { "@type": "Thing", name: "The Vinculum Dashboard" },
      { "@type": "Thing", name: "The Vinculum Unified Operational Nervous System" },
      { "@type": "Thing", name: "Relational security" },
      { "@type": "Thing", name: "Bond-integrity analysis" },
      { "@type": "Thing", name: "Diplomatic security" },
      { "@type": "DefinedTerm", name: "The Dominum Effect", alternateName: ["The Dominium Effect", "The Law of Sovereign Custodial Inversion"], url: `${SITE_URL}/glossary#dominum-effect` },
      { "@type": "Thing", name: "The Vinculum Codex and Compact" },
    ],
  };
}

/** Google Scholar + Dublin Core citation metadata shared by scholarly pages. */
export const CITATION = {
  title: WORK_TITLE,
  author: AUTHOR_NAME,
  doi: DOI,
  language: "en",
  license: LICENSE_URL,
};
/**
 * Geographic anchoring for the eight documented case studies. Used to give
 * search engines and AI crawlers an explicit place for each case page.
 */
export const CASE_PLACES: Record<
  string,
  { name: string; iso: string[]; lat?: number; lon?: number }
> = {
  "northern-ireland": { name: "Northern Ireland, United Kingdom", iso: ["GB"], lat: 54.6, lon: -6.5 },
  colombia: { name: "Colombia", iso: ["CO"], lat: 4.6, lon: -74 },
  cambodia: { name: "Cambodia", iso: ["KH"], lat: 12.5, lon: 104.9 },
  liberia: { name: "Liberia", iso: ["LR"], lat: 6.4, lon: -10.8 },
  rwanda: { name: "Rwanda", iso: ["RW"], lat: -1.9, lon: 29.9 },
  kenya: { name: "Kenya", iso: ["KE"], lat: 0.5, lon: 37.9 },
  "south-africa": { name: "South Africa", iso: ["ZA"], lat: -29, lon: 25 },
  "tuvalu-kiribati": { name: "Tuvalu and Kiribati", iso: ["TV", "KI"], lat: -4, lon: 176 },
};
/** Schema.org Place nodes for a case study slug. */
export function casePlaceLd(slug: string) {
  const p = CASE_PLACES[slug];
  if (!p) return [];
  return p.iso.map((code, i) => ({
    "@type": "Place" as const,
    name: p.iso.length > 1 ? `${p.name} (${code})` : p.name,
    address: { "@type": "PostalAddress", addressCountry: code },
    ...(i === 0 && p.lat !== undefined
      ? { geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lon } }
      : {}),
  }));
}
