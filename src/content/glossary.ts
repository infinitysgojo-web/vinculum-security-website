export type GlossaryEntry = {
  id: string;
  term: string;
  short: string;
  source: string;
  quote: string;
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    id: "vinculum-security",
    term: "Vinculum Security",
    short:
      "A doctrine holding that security is the presence and integrity of the relational bonds that make protection, dignity, and peace possible.",
    source: "Doctrine § III.A — Canonical Definition",
    quote:
      "Security is not the absence of threat, but the presence and integrity of the relational bonds, between persons, communities, and generations, that make protection, dignity, and peace possible in the first place.",
  },
  {
    id: "bond",
    term: "Bond",
    short: "The proper unit of security analysis in the doctrine — a nameable relationship on which safety and dignity depend.",
    source: "Doctrine § III.B — Ontological Claim",
    quote:
      "Security assessed only at the individual level is incomplete, because it can report a person as secure while the bonds constituting that person's safety and dignity are eroding. The proper unit of security analysis is the bond.",
  },
  {
    id: "bond-integrity",
    term: "Bond Integrity",
    short: "The persistence and quality of a specific relational bond over time and through stress.",
    source: "Doctrine § V.B — Bond-Integrity Indicators",
    quote:
      "Each continuum level has an illustrative indicator and a diagnostic question, held together across cases so that a comparison is grounded in the same working definitions each time.",
  },
  {
    id: "vinculum-continuum",
    term: "Vinculum Continuum",
    short:
      "The four nested levels at which the doctrine operates: interpersonal, communal, intergenerational, and institutional-relational.",
    source: "Doctrine § III.D",
    quote:
      "Vinculum Security operates across four nested levels, governed by explicit boundary and weighting rules.",
  },
  {
    id: "interpersonal",
    term: "Interpersonal Bond",
    short: "Trust between two named individuals that would survive a bad-faith moment intact.",
    source: "Doctrine § III.D.I",
    quote:
      "Bonds between two named individuals, regardless of role — the trust that survives a bad-faith moment intact.",
  },
  {
    id: "communal",
    term: "Communal Bond",
    short: "Standing between an individual or institution and a group within a single generational cohort.",
    source: "Doctrine § III.D.II",
    quote:
      "Bonds between an individual or institution and a group within a single generational cohort — standing tested by the community itself.",
  },
  {
    id: "intergenerational",
    term: "Intergenerational Bond",
    short: "The transfer of knowledge, trust, and standing between youth and elder leadership.",
    source: "Doctrine § III.D.III",
    quote:
      "Bonds between distinct generational cohorts — the transfer of knowledge, trust, and standing between youth and elder leadership.",
  },
  {
    id: "institutional-relational",
    term: "Institutional-Relational Bond",
    short: "The bond between an institution and the population it serves, tested across a change in personnel.",
    source: "Doctrine § III.D.IV",
    quote:
      "Bonds between an institution and the population it is mandated to serve, tested across a change in personnel or office.",
  },
  {
    id: "ubuntu",
    term: "Ubuntu",
    short:
      "A southern African philosophical tradition holding that a person is a person through other persons — personhood constituted relationally.",
    source: "Foundations § II.B",
    quote:
      "Ubuntu holds that personhood is constituted relationally: umuntu ngumuntu ngabantu — a person is a person through other persons.",
  },
  {
    id: "confucian-role-ethics",
    term: "Confucian Role Ethics",
    short: "The view that a person is relationally constituted by the roles they live, not a prior autonomous individual.",
    source: "Foundations § II.J",
    quote:
      "A person is not a discrete, autonomous individual but is relationally constituted by the roles they live.",
  },
  {
    id: "human-security",
    term: "Human Security",
    short: "The 1994 UNDP framework that shifted the referent object of security from the state to the individual person.",
    source: "Foundations § II.A",
    quote:
      "The 1994 UNDP Human Development Report redefined the referent object of security, shifting focus from the state to the individual, organized around freedom from want and freedom from fear.",
  },
  {
    id: "r2p",
    term: "Responsibility to Protect (R2P)",
    short: "The 2005 World Summit reframing of sovereignty as responsibility to protect populations from atrocity.",
    source: "Foundations § II.F",
    quote:
      "R2P relocates obligation; Vinculum Security relocates the referent object — from the protected population to the bonds that make protection possible.",
  },
  {
    id: "yps",
    term: "Youth, Peace and Security (YPS)",
    short:
      "UN Security Council architecture (Resolution 2250, 2015) with five pillars: participation, protection, prevention, partnerships, and disengagement and reintegration.",
    source: "Foundations § II.G",
    quote:
      "UNSCR 2250 (2015) established five pillars: participation, protection, prevention, partnerships, and disengagement and reintegration.",
  },
  {
    id: "wps",
    term: "Women, Peace and Security (WPS)",
    short: "UNSCR 1325 (2000) — the first resolution recognizing conflict's disproportionate impact on women and girls.",
    source: "Foundations § II.K",
    quote:
      "UNSCR 1325 (2000) was the first resolution to recognize that armed conflict affects women and girls disproportionately and distinctly.",
  },
  {
    id: "positive-peace",
    term: "Positive Peace",
    short: "Galtung's conception of peace as the absence of structural violence, not merely direct violence.",
    source: "Foundations § II.E",
    quote:
      "Peace as absence of structural violence, not just direct violence.",
  },
  {
    id: "securitization",
    term: "Securitization",
    short: "The Copenhagen School's view that security is a discursive act — something is a security matter when successfully framed as one.",
    source: "Foundations § II.D",
    quote:
      "Security as a discursive act, not a fixed condition.",
  },
  {
    id: "restorative-justice",
    term: "Restorative Justice",
    short: "Zehr's reframing of harm as a violation of people and relationships rather than only an offense against the state.",
    source: "Foundations § II.I",
    quote:
      "Justice as repair of relationship, not only punishment of the state's law.",
  },
  {
    id: "palava-hut",
    term: "Palava Hut",
    short: "A revived Liberian community dialogue tradition used alongside the Truth and Reconciliation Commission.",
    source: "Cases § VII — Liberia",
    quote:
      "A Truth and Reconciliation Commission delivering its 2009 final report alongside disarmament of over 100,000 former combatants and revival of Palava Hut dialogue.",
  },
  {
    id: "gacaca",
    term: "Gacaca Courts",
    short: "Roughly 12,000 Rwandan community tribunals that processed nearly two million genocide-related cases between 2002 and 2012.",
    source: "Cases § VII — Rwanda",
    quote:
      "Roughly 12,000 community tribunals processed close to two million genocide-related cases between 2002 and 2012.",
  },
  {
    id: "agenda-2063",
    term: "Agenda 2063",
    short:
      "The African Union's continental framework naming intergenerational dialogue (Aspiration 4) and people-driven development (Aspiration 6).",
    source: "Foundations § II.H",
    quote:
      "The African Union's Agenda 2063 names intergenerational dialogue under its fourth aspiration and commits under its sixth to people-driven development anchored in the potential of women and youth.",
  },
  {
    id: "diagnostic-question",
    term: "Diagnostic Question",
    short: "The recurring question asked identically at each continuum level to reveal where security is materially present or only nominally reported.",
    source: "Methodology § V.A",
    quote:
      "Are the bonds this person, community, or generation depends upon intact — and if an intervention protected the individual or institution while ignoring those bonds, has it delivered security at all?",
  },
];

export const GLOSSARY_MAP: Record<string, GlossaryEntry> = Object.fromEntries(
  GLOSSARY.map((g) => [g.id, g])
);
