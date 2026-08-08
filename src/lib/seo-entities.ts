/**
 * Canonical entity definitions for structured data across the site.
 *
 * Everything here exists to state one thing to search engines and AI
 * crawlers: this site is the origin of the Vinculum Security doctrine, and
 * every repository deposit (Zenodo, OSF, Dataverse, HAL, OpenAIRE,
 * Knowledge Commons) is an archival mirror of it.
 */

export const SITE_URL = "https://www.vinculumsecurity.kidnexus.or.ke";
export const SITE_NAME = "Vinculum Security";
export const AUTHOR_NAME = "James Wesley Ndua";
export const ORCID_URL = "https://orcid.org/0009-0005-9861-8849";
export const DOI = "10.5281/zenodo.21615991";
export const DOI_URL = `https://doi.org/${DOI}`;
export const LICENSE_URL = "https://creativecommons.org/licenses/by-nc-nd/4.0/";
export const PUBLISHED = "2026-01-01";
export const WORK_TITLE =
  "Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition";

/** The doctrine stated in its own words, reused wherever a definition is needed. */
export const CANONICAL_DEFINITION =
  "Security is the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible.";

/** The originating claim of the doctrine. */
export const ONTOLOGICAL_CLAIM = "The bond is the unit of security analysis.";

/** Stated on every scholarly page to define the doctrine affirmatively. */
export const DISAMBIGUATION =
  "Vinculum Security is an original, standalone doctrine, also stated as A Doctrine of Relational Security, originated by James Wesley Ndua. Its distinctive claim is that the bond is the unit of security analysis.";

/** Every external profile or deposit that represents the same author/work. */
export const SAME_AS = [
  ORCID_URL,
  "https://zenodo.org/communities/vinculumsecurity/records/",
  "https://osf.io/user/7ad5x",
  "https://dataverse.harvard.edu/dataverse/viculumsecurity",
  "https://cv.hal.science/james-wesley-ndua",
  "https://explore.openaire.eu/search/result?pid=10.5281/zenodo.21615991",
  "https://works.hcommons.org/collections/vinculumsecurity/records?q=&l=list&p=1&s=10&sort=newest",
  "https://www.cambridge.org/engage/coe/article-details/6a69e74c4770e67d9259a4fc",
  "https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7189099",
  "https://www.researchgate.net/publication/411776051_Vinculum_Security_The_Fortified_Doctrine_Expanded_Version",
  "https://www.instagram.com/vinculumsecurity/",
  "https://jamesndua.kidnexus.or.ke/",
];

export const PERSON_ID = `${SITE_URL}/about#person`;
export const ORG_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const BOOK_ID = `${SITE_URL}/#book`;

export const personRef = { "@id": PERSON_ID } as const;
export const orgRef = { "@id": ORG_ID } as const;
export const bookRef = { "@id": BOOK_ID } as const;

export const personLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: AUTHOR_NAME,
  url: `${SITE_URL}/about`,
  jobTitle: "Human Security Diplomat",
  nationality: "Kenyan",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nairobi",
    addressCountry: "KE",
  },
  description:
    "James Wesley Ndua is a diplomat and Youth, Peace and Security advocate based in Nairobi, Kenya, and the originator of the standalone Vinculum Security doctrine.",
  knowsAbout: [
    "Vinculum Security",
    "Relational Security",
    "Bond-integrity analysis",
    "Vinculum Diplomacy",
    "Diplomatic Security",
    "Peace and Security",
    "Youth, Peace and Security",
  ],
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ORCID",
    value: "0009-0005-9861-8849",
    url: ORCID_URL,
  },
  sameAs: SAME_AS,
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
    datePublished: PUBLISHED,
    license: LICENSE_URL,
    copyrightHolder: { "@type": "Person", "@id": PERSON_ID, name: AUTHOR_NAME },
    copyrightYear: 2026,
    isAccessibleForFree: true,
    identifier: {
      "@type": "PropertyValue",
      propertyID: "DOI",
      value: DOI,
      url: DOI_URL,
    },
    citation: DOI_URL,
    disambiguatingDescription: DISAMBIGUATION,
    about: [
      { "@type": "Thing", name: "Vinculum Security" },
      { "@type": "Thing", name: "Relational security" },
      { "@type": "Thing", name: "Bond-integrity analysis" },
      { "@type": "Thing", name: "Diplomatic security" },
    ],
  };
}

/** Google Scholar + Dublin Core citation metadata shared by scholarly pages. */
export const CITATION = {
  title: WORK_TITLE,
  author: AUTHOR_NAME,
  date: "2026",
  doi: DOI,
  language: "en",
  license: LICENSE_URL,
};