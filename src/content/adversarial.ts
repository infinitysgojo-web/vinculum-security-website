// Section X of the doctrine: The Adversarial Review. Text follows the Final Edition.
export type Verdict = "answered" | "conceded" | "open";

export type Exchange = { q: string; a: string; verdict: Verdict; ref?: string };
export type Panel = { n: number; title: string; lens: string; exchanges: Exchange[] };

export const VERDICT_LABEL: Record<Verdict, string> = {
  answered: "Answered",
  conceded: "Partly conceded",
  open: "Held open",
};

export const PANELS: Panel[] = [
  {
    n: 1, title: "Academic Security Scholars", lens: "Logic, novelty, falsifiability",
    exchanges: [
      { q: "Your ontological chain has a gap: Ubuntu says personhood is relational; you conclude security must be too. Defend the inference.", a: "The inference is stated explicitly as a three-step chain, and the doctrine survives even under Gyekye's moderate communitarian position, not only Menkiti's stronger one.", verdict: "answered", ref: "§III.B, §II.B" },
      { q: "Positive peace already covers relational harm under structural violence. What does 'bond' add?", a: "Vinculum Security is offered as a relational specification of positive peace, adding the bond as a distinct, scoreable unit that Galtung's structural-violence vocabulary does not itself operationalize.", verdict: "answered", ref: "§II.E" },
      { q: "Where is your falsifiability condition?", a: "Stated explicitly, citing Popper directly, including a case-specific falsifier tied to the Cambodia case.", verdict: "answered", ref: "§IV" },
    ],
  },
  {
    n: 2, title: "Ubuntu and African Philosophy Scholars", lens: "Fidelity to the tradition",
    exchanges: [
      { q: "Doesn't quantifying Ubuntu with 1-5 scores betray its own spirit?", a: "A fair, unresolved tension. Scoring is a diagnostic aid for institutional settings that already demand assessable metrics, not a claim that the score exhausts Ubuntu's philosophical content.", verdict: "open", ref: "§XI.3" },
      { q: "Why is this author the right person to formalize Ubuntu for a global audience?", a: "The authorship justification claims specific, limited standing rather than unique authority.", verdict: "answered", ref: "§I" },
      { q: "Doesn't relying on Ubuntu alone make this doctrine parochial?", a: "No longer applicable in the same form. Confucian Role Ethics, arrived at independently, now supports the ontological claim alongside Ubuntu: two major traditions, not one.", verdict: "answered", ref: "§II.J" },
    ],
  },
  {
    n: 3, title: "Realist and Traditional Diplomats", lens: "Power, urgency, utility",
    exchanges: [
      { q: "Wouldn't this doctrine delay urgent action to check on 'communal trust' while people are dying?", a: "The doctrine does not ask a practitioner to substitute relational assessment for timely reading of power and urgency; the handbook's practice-under-time-constraint section governs.", verdict: "answered", ref: "§II.C, Handbook" },
      { q: "Why should a practitioner take this over Morgenthau's realism?", a: "It is not either-or. Vinculum Security adds bond integrity to a realist inventory of power and interest rather than replacing it.", verdict: "answered", ref: "§II.C" },
      { q: "Isn't 'bond integrity' just a euphemism for legitimacy and stability, which realists already track?", a: "Partially conceded. The specific contribution is the four-level continuum's granularity, sharpened by explicit classification and weighting rules.", verdict: "conceded", ref: "§III.F" },
    ],
  },
  {
    n: 4, title: "Methodologists and Social Scientists", lens: "Measurement and evidence",
    exchanges: [
      { q: "You scored your own cases. That's confirmation, not evidence.", a: "Directly conceded as the doctrine's most significant open limitation, measured against the Positive Peace Index's public-data standard.", verdict: "open", ref: "§IX, §V.D" },
      { q: "'Persistence of trust' isn't measurable without a defined baseline.", a: "Partially addressed by the stated methodology and thirty-two specific, citable scores, though a fully validated instrument does not yet exist.", verdict: "conceded", ref: "§V.C, §VII" },
      { q: "Eight hand-picked cases all confirm your thesis. What would a disconfirming case look like?", a: "Answered directly, and the Cambodia case is offered precisely because its outcome is genuinely contested for the doctrine's own prediction.", verdict: "answered", ref: "§IV, §VII.C" },
    ],
  },
  {
    n: 5, title: "Institutional Gatekeepers", lens: "Standing and adoption",
    exchanges: [
      { q: "Every UN doctrine that mattered had institutional co-authorship from day one. Why engage with one that doesn't?", a: "Human security itself began without institutional co-authorship.", verdict: "answered", ref: "§I" },
      { q: "Annan never called his Kenya mediation 'Vinculum Security.' Isn't this retrofitting?", a: "Kenya illustrates the doctrine's categories applied retrospectively, not Annan's intent; case language throughout says 'viewed through Vinculum Security'.", verdict: "answered", ref: "§VII" },
      { q: "What existing UN process would actually adopt your scoring? Name the office, the budget line.", a: "Not yet answerable. Engagement with a specific YPS or WPS policy proposal is named as a needed next step, not an accomplished fact.", verdict: "open", ref: "§XI.5" },
    ],
  },
  {
    n: 6, title: "Journalists and Public Skeptics", lens: "Credibility and plain meaning",
    exchanges: [
      { q: "Why should anyone take a security doctrine from an 18-year-old seriously?", a: "Age is not the relevant credential; the specificity and testability of the claim is, and the doctrine holds itself to that standard through the Cambodia case.", verdict: "answered" },
      { q: "Latin name, African and Confucian philosophy, eight-country cases: isn't this trying to be everything to everyone?", a: "The doctrine is confidently African in origin, corroborated by an independent Confucian tradition, and does not claim cultural neutrality.", verdict: "answered", ref: "§III.E" },
      { q: "What difference does this make to someone in a conflict zone tomorrow, in one sentence?", a: "A peace agreement that stops the shooting but leaves your community's trust in ruins is not finished security; this doctrine names whose job the second part is and how to check it is being done.", verdict: "answered" },
    ],
  },
  {
    n: 7, title: "Adversarial and Bad-Faith Actors", lens: "Resistance to misuse",
    exchanges: [
      { q: "Could 'preserving communal bonds' justify slow-walking accountability?", a: "Addressed as Risk One, reinforced by the principle that a government never assesses its own institutional-relational bond.", verdict: "answered", ref: "§VIII, §VI" },
      { q: "Could 'testing standing' delegitimize genuine dissidents?", a: "Addressed as Risk Two, with the child-protection carve-out stated as an absolute limit.", verdict: "answered", ref: "§VIII, §VI" },
    ],
  },
  {
    n: 8, title: "Community and Peer Reviewers", lens: "Proximity to lived harm",
    exchanges: [
      { q: "You use Kenya's tragedy prominently. Have you spoken to people from the Rift Valley, or only read reports?", a: "The case engagement draws on public and academic reporting, not field interviews. This is named directly and is the first research priority; Kenya is no longer the flagship case.", verdict: "conceded", ref: "§IX, §XI.2" },
      { q: "Who is this doctrine actually for?", a: "YPS and WPS practitioners, diplomats and mediators applying the Vinculum Diplomacy handbook, and scholars positioned to test, cite, or refute its claims.", verdict: "answered" },
    ],
  },
  {
    n: 9, title: "International Legal Scholars", lens: "Legal standing",
    exchanges: [
      { q: "Does Vinculum Security have any standing in international law?", a: "No binding legal standing. It sits alongside human security and R2P as a soft, policy-level framework.", verdict: "answered", ref: "§II.F" },
      { q: "If a state's institutional-relational bond scores low, does that oblige other states to intervene?", a: "No. Scores are diagnostic and advisory only and generate no legal trigger, stated explicitly to prevent misapplication.", verdict: "answered" },
      { q: "Is R2P really a clean model to compare this doctrine against?", a: "No. R2P's application has been selective and its Libya legacy contested, a caution this doctrine applies to its own future use.", verdict: "conceded", ref: "§IX" },
    ],
  },
  {
    n: 10, title: "Field Practitioners and NGO Workers", lens: "Monday morning",
    exchanges: [
      { q: "What do I actually do differently on Monday morning in the field?", a: "The Vinculum Diplomacy handbook's field guide, bond-mapping templates, and scripted language. The doctrine states what security is; the handbook states what to do.", verdict: "answered", ref: "Handbook" },
      { q: "How is this different from 'do no harm' and conflict-sensitivity frameworks?", a: "A fair question without a fully worked answer yet, named directly as a research priority rather than dismissed.", verdict: "open", ref: "§XI.7" },
    ],
  },
  {
    n: 11, title: "Child Protection and Gender Specialists", lens: "Protected parties",
    exchanges: [
      { q: "Could the communal-standing test ever be applied to a child?", a: "No. An absolute carve-out, not a matter of practitioner discretion.", verdict: "answered", ref: "§VI" },
      { q: "How are gender-specific provisions treated differently from general communal provisions?", a: "Tracked as their own line under joint Vinculum Security and WPS assessment, never folded into a general score: the exact failure Colombia's implementation gap illustrates.", verdict: "answered", ref: "§VI" },
    ],
  },
  {
    n: 12, title: "East Asian and Confucian Scholars", lens: "The second tradition",
    exchanges: [
      { q: "Does applying Confucian Role Ethics to security risk the same flattening critique Ubuntu has faced?", a: "The doctrine cites Ames and Rosemont's established term of art, but has not yet engaged Confucian scholars directly; doing so is on the research agenda.", verdict: "open", ref: "§II.J, §XI.3" },
    ],
  },
];
