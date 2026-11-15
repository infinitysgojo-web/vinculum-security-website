/**
 * Canonical case-study content for Section VII, Applied Case Engagement.
 *
 * Source of record: "Vinculum Security: The Fortified Doctrine, Expanded
 * Version, Final Edition" (Section VII) and "Vinculum Diplomacy: The
 * Practitioner Handbook, Final Edition" (Section 12). Both by James Wesley Ndua.
 */

export type Region = "Africa" | "Europe" | "Latin America" | "Southeast Asia" | "Pacific";
export type Pillar = "Interpersonal" | "Communal" | "Intergenerational" | "Institutional";
export type Threat =
  | "Ethnic conflict"
  | "Civil war"
  | "Genocide"
  | "Political violence"
  | "Post-conflict transition"
  | "Climate displacement";

export type CaseStudy = {
  slug: string;
  /** Full title as used in the doctrine. */
  title: string;
  /** Short place name, used in tables and navigation. */
  shortTitle: string;
  /** Roman numeral reference within Section VII. */
  ref: string;
  /** One sentence card summary. */
  summary: string;
  region: Region;
  pillar: Pillar;
  threats: Threat[];
  era: "1990s" | "2000s" | "2010s" | "2020s";
  /** Interpersonal, Communal, Intergenerational, Institutional-Relational. */
  scores: [number, number, number, number];
  rationales: [string, string, string, string];
  /** Cross-case one-line pattern. */
  pattern: string;
  /** Opening narrative paragraphs on the detail page. */
  narrative: string[];
  /** Quick facts panel. */
  facts: { label: string; value: string }[];
  /** The doctrine's own reading of what the case shows. */
  finding: string[];
  /** Section 12 of the handbook: what a Vinculum diplomat does. */
  practice: string;
  /** Section 12 of the handbook: the transferable takeaway. */
  takeaway: string;
  /** Pull quote for the detail page. */
  quote: string;
  /** Primary sources cited by the doctrine for this case. */
  sources: string[];
  /** Page description used for search engines and AI answers. */
  metaDescription: string;
  keywords: string;
};

export const DOMAINS = [
  "Interpersonal",
  "Communal",
  "Intergenerational",
  "Institutional-Relational",
] as const;

export const CASES: CaseStudy[] = [
  {
    slug: "northern-ireland",
    title: "Northern Ireland: The Good Friday Agreement",
    shortTitle: "Northern Ireland",
    ref: "VII.A",
    summary:
      "A power-sharing government has held, with interruptions, for over 25 years; dramatic reduction in lethal violence alongside documented intergenerational trauma.",
    region: "Europe",
    pillar: "Institutional",
    threats: ["Ethnic conflict", "Political violence", "Post-conflict transition"],
    era: "1990s",
    scores: [4, 3, 2, 5],
    rationales: [
      "Sustained trust between principal negotiators and international facilitators enabled a signed agreement after two years of talks.",
      "Cross-community trust improved substantially, though voting patterns and residential segregation remain documented indicators of incomplete communal repair.",
      "Independent 25th-anniversary research documents intergenerational trauma affecting those born after 1998, weighted as the least compensable finding in this case per Section III.F.",
      "Power-sharing institutions have survived multiple collapses and a contested Brexit-era environment across more than 25 years, the strongest score in this entire case set.",
    ],
    pattern: "Strongest institutional bond of all eight; weakest generational bond.",
    narrative: [
      "The Good Friday Agreement, signed on 10 April 1998, established a power-sharing government that has held, with interruptions, for over 25 years. It closed a conflict that had defined a generation of political life in Northern Ireland and in the wider British and Irish relationship.",
      "Independent 25th-anniversary research documents a dramatic and durable reduction in lethal violence. The same body of research documents widespread intergenerational trauma affecting those born after the settlement, people who did not live through the violence but who carry its transmitted effects.",
      "Read through the Vinculum Continuum, that combination is the case's whole significance. The institutional bond is the strongest in the doctrine's entire case set. The generational bond is among its weakest. Both statements are true of the same peace, at the same time.",
    ],
    facts: [
      { label: "Instrument", value: "Multi-Party and British-Irish Agreement, signed 10 April 1998" },
      { label: "Mechanism", value: "Power-sharing executive and cross-community consent" },
      { label: "Duration", value: "Over 25 years, with multiple institutional collapses and restorations" },
      { label: "Strongest bond", value: "Institutional-Relational, scored 5" },
      { label: "Weakest bond", value: "Intergenerational, scored 2" },
    ],
    finding: [
      "This case carries the highest institutional-relational score anywhere in the doctrine and, alongside it, one of the lowest generational scores. The doctrine's weighting principle in Section III.F treats the generational finding as the less compensable of the two, because institutional durability can be rebuilt by design while a generation's inherited trauma cannot be legislated away.",
      "The case therefore functions as a standing warning against reading state stability as proof of relational repair. Twenty-five years of surviving institutions did not, on their own, reach the bond between those who made the settlement and those born into it.",
    ],
    practice:
      "A Vinculum diplomat, aware that the doctrine's own scoring identifies the intergenerational bond as this case's most persistent weakness after 25 years, would treat legacy and intergenerational trauma work as core diplomatic business requiring dedicated, resourced attention on an ongoing basis, not as a matter left to individual civil society or mental health services operating without diplomatic-level backing.",
    takeaway:
      "Institutional-relational strength can mask an unaddressed intergenerational bond for decades precisely because the state appears stable. A Vinculum diplomat treats institutional durability as a reason to look harder at the generational level, not as evidence that it has been resolved by default.",
    quote:
      "The strongest institutional score in the doctrine's full case set coexists with the weakest generational score.",
    sources: [
      "The Multi-Party Agreement and British-Irish Agreement (Good Friday Agreement), signed 10 April 1998.",
      "Government of Ireland, \"A New Beginning: 25 Years of the Good Friday Agreement,\" 2023.",
    ],
    metaDescription:
      "The Good Friday Agreement read through Vinculum Security: the strongest institutional bond in the doctrine's case set alongside its weakest generational bond, with full four-level scoring and practice guidance.",
    keywords:
      "Good Friday Agreement, Northern Ireland peace process, intergenerational trauma, power sharing, Vinculum Continuum scoring, relational security case study",
  },
  {
    slug: "colombia",
    title: "Colombia: The 2016 Final Agreement",
    shortTitle: "Colombia",
    ref: "VII.B",
    summary:
      "A dedicated ethnic and gender chapter, a Special Jurisdiction for Peace, and UN-monitored verification alongside persistent violence against social leaders.",
    region: "Latin America",
    pillar: "Institutional",
    threats: ["Civil war", "Political violence", "Post-conflict transition"],
    era: "2010s",
    scores: [3, 2, 3, 4],
    rationales: [
      "Negotiators sustained a multi-year process to signature despite a rejected initial referendum.",
      "Continued documented violence against social leaders and signatories indicates the communal bond remains substantially unrepaired.",
      "Some youth-focused reintegration programming exists, though independent evaluation of depth is limited.",
      "The JEP and UN verification architecture were explicitly designed to outlast the signing moment and have functioned across government transitions.",
    ],
    pattern: "Institutional bond strong, communal protection weak.",
    narrative: [
      "The Final Agreement between the Government of Colombia and the FARC-EP, signed in November 2016, included a dedicated ethnic and gender chapter, a Special Jurisdiction for Peace, and UN-monitored verification.",
      "Kroc Institute and JEP reporting document real institutional progress in the years since. The same reporting documents persistent violence against social leaders and signatories in priority regions, a pattern that has continued across changes of government.",
      "This is the doctrine's primary anchor for Women, Peace and Security practice. The agreement's gender chapter is treated as its own line of assessment, never folded into a general institutional score.",
    ],
    facts: [
      { label: "Instrument", value: "Final Agreement, signed 24 November 2016" },
      { label: "Mechanism", value: "Special Jurisdiction for Peace with UN-monitored verification" },
      { label: "Distinctive feature", value: "Dedicated ethnic and gender chapter" },
      { label: "Strongest bond", value: "Institutional-Relational, scored 4" },
      { label: "Weakest bond", value: "Communal, scored 2" },
    ],
    finding: [
      "Colombia demonstrates the doctrine's clearest example of a well-designed institutional bond failing to transfer downward. Verification architecture built to outlast the signing moment has functioned as intended, while the people who carry the agreement locally continue to be killed.",
      "Under the doctrine's own corollary, a settlement resourced at one level and unresourced at another does not average out. The unprotected level remains a live source of insecurity regardless of how well the protected level performs.",
    ],
    practice:
      "A Vinculum diplomat supporting implementation would treat the persistent violence against social leaders and signatories in priority regions as the central diplomatic problem of the post-agreement period, not a peripheral security footnote to an otherwise successful institutional accord, and would advocate for resourcing communal-level protection mechanisms at the same intensity as the verification architecture.",
    takeaway:
      "Institutional-relational strength, however well designed, does not transfer automatically to the communal level. Each level of the continuum requires its own dedicated resourcing, and the gender chapter should be tracked as its own line rather than absorbed into a general score.",
    quote:
      "Each level of the continuum requires its own dedicated resourcing.",
    sources: [
      "Government of Colombia and FARC-EP, Final Agreement, signed 24 November 2016.",
      "Special Jurisdiction for Peace (JEP), Colombia, public case reporting, jep.gov.co, accessed 2026.",
      "Kroc Institute for International Peace Studies, Peace Accords Matrix reports on Colombia, 2018-2025.",
      "United Nations Security Council, Resolution 1325 (2000), S/RES/1325.",
    ],
    metaDescription:
      "Colombia's 2016 Final Agreement scored across the four bond domains of Vinculum Security: strong verification architecture alongside a communal bond left substantially unrepaired.",
    keywords:
      "Colombia 2016 Final Agreement, FARC-EP, Special Jurisdiction for Peace, social leaders, Women Peace and Security, relational security case study",
  },
  {
    slug: "cambodia",
    title: "Cambodia: The Extraordinary Chambers",
    shortTitle: "Cambodia",
    ref: "VII.C",
    summary:
      "A hybrid UN-Cambodian tribunal that operated for sixteen years and secured convictions against only three senior Khmer Rouge leaders.",
    region: "Southeast Asia",
    pillar: "Intergenerational",
    threats: ["Genocide", "Post-conflict transition"],
    era: "2000s",
    scores: [2, 2, 2, 2],
    rationales: [
      "The tribunal's scope was deliberately limited to senior leadership, leaving most direct perpetrator-victim relationships entirely outside its process.",
      "A widespread culture of impunity is documented as persisting in Cambodia to this day, alongside the tribunal's own reconciliation-oriented amnesty for lower-level fighters.",
      "Documented concern about a lack of educational material and rising historical revisionism among younger Cambodians represents an unaddressed intergenerational bond specifically around memory and transmission.",
      "Sixteen years, immense cost, and only three convictions. This represents a weak institutional-relational return relative to the scale of the crimes addressed.",
    ],
    pattern: "Uniformly weak across all four levels after sixteen years and three convictions.",
    narrative: [
      "The Extraordinary Chambers in the Courts of Cambodia, a hybrid UN-Cambodian tribunal established in 2001, operated for over sixteen years and secured convictions against only three senior Khmer Rouge leaders. It deliberately declined to prosecute tens of thousands of former low- and mid-level fighters already reintegrated into Cambodian society, in the explicit interest of preserving national reconciliation.",
      "This is the doctrine's first case engagement grounded in the Confucian relational tradition introduced in Section II.J, given Cambodia's own Buddhist and Confucian-influenced social fabric of family and communal obligation.",
      "It is also the only case in the entire set that scores uniformly low across all four levels of the continuum.",
    ],
    facts: [
      { label: "Instrument", value: "Extraordinary Chambers in the Courts of Cambodia, established 2001" },
      { label: "Duration", value: "Over sixteen years of operation" },
      { label: "Outcome", value: "Three convictions of senior Khmer Rouge leadership" },
      { label: "Profile", value: "Uniformly low, scored 2 at every level" },
      { label: "Doctrinal role", value: "The doctrine's single most important falsifiability test" },
    ],
    finding: [
      "This case is the doctrine's most important falsifiability test to date, as stated in Section IV. Because it scores uniformly low across all four levels, the doctrine's own claim requires that this translate into documented instability or unresolved grievance over time, rather than durable, low-conflict peace.",
      "Cambodia's post-tribunal stability is real, but it has been achieved alongside continued authoritarian governance and limited political freedom. That makes it a genuinely contested case for the doctrine's prediction. The doctrine states that tension directly rather than reading the case only favourably.",
    ],
    practice:
      "A Vinculum diplomat aware of this case's uniformly weak scoring would treat it as a caution against declaring a transitional-justice process complete on the basis of institutional closure alone. Sixteen years and three convictions produced a formal legal outcome, yet no bond level scored above a 2, a pattern that should prompt active concern rather than reassurance, particularly regarding documented historical revisionism among younger Cambodians.",
    takeaway:
      "A uniformly weak profile across all four levels is a distinct and more serious diagnostic finding than a mixed profile with at least one strong level, because a mixed profile at least indicates one durable foundation to build outward from. A uniformly weak reading requires comprehensive, multi-level intervention rather than a single targeted fix.",
    quote:
      "This is the doctrine's most important falsifiability test to date.",
    sources: [
      "Extraordinary Chambers in the Courts of Cambodia, case records and closing summary, eccc.gov.kh, accessed 2026.",
      "The Advocates for Human Rights, \"Khmer Rouge Tribunal,\" theadvocatesforhumanrights.org, accessed 2026.",
      "Roger T. Ames and Henry Rosemont Jr., Confucian Role Ethics: A Moral Vision for the 21st Century?",
    ],
    metaDescription:
      "The Extraordinary Chambers in the Courts of Cambodia scored uniformly low across all four bond domains, making it the single most important falsifiability test of the Vinculum Security doctrine.",
    keywords:
      "Extraordinary Chambers in the Courts of Cambodia, Khmer Rouge tribunal, transitional justice, falsifiability, historical revisionism, relational security case study",
  },
  {
    slug: "liberia",
    title: "Liberia: TRC and the Palava Hut",
    shortTitle: "Liberia",
    ref: "VII.D",
    summary:
      "A Truth and Reconciliation Commission delivering its 2009 final report alongside disarmament of over 100,000 former combatants and revival of Palava Hut dialogue.",
    region: "Africa",
    pillar: "Communal",
    threats: ["Civil war", "Post-conflict transition"],
    era: "2000s",
    scores: [3, 4, 3, 2],
    rationales: [
      "Palava Hut proceedings are designed around direct interpersonal reconciliation, though systematic outcome data is limited.",
      "The Palava Hut and supporting relational-justice scholarship represent one of the most purpose-built communal-bond repair mechanisms among these cases.",
      "Youth-focused peace camps continue this work, though independent of, rather than integrated into, the formal TRC architecture.",
      "Liberian civil society itself documents persistent underfunding and non-implementation of TRC recommendations.",
    ],
    pattern: "Communal repair strong, institutional follow-through weak.",
    narrative: [
      "Liberia's Truth and Reconciliation Commission delivered its final report in 2009, operating alongside the disarmament of over one hundred thousand former combatants. The Commission called explicitly for the revival of the Palava Hut, a traditional dialogue forum rooted in Liberian communal life.",
      "The Palava Hut is the closest thing in the doctrine's case set to a purpose-built communal-bond repair mechanism. It carries the highest communal score of any case here.",
      "Liberian civil society itself, rather than any external critic, documents the persistent underfunding and non-implementation of the Commission's recommendations. That is the case's institutional weakness, stated in the words of those closest to it.",
    ],
    facts: [
      { label: "Instrument", value: "Truth and Reconciliation Commission, final report 2009" },
      { label: "Traditional mechanism", value: "Palava Hut dialogue forum, revived at the Commission's own call" },
      { label: "Scale", value: "Over one hundred thousand former combatants disarmed" },
      { label: "Strongest bond", value: "Communal, scored 4" },
      { label: "Weakest bond", value: "Institutional-Relational, scored 2" },
    ],
    finding: [
      "Liberia inverts the Colombia pattern. Here the communal bond is the strongest in the case set while institutional follow-through is the weakest element of the process, which shows that the direction of failure is not fixed and each level must be read on its own evidence.",
      "The case also supplies the doctrine's clearest evidence that culturally rooted repair mechanisms can outperform imported formal architecture at the communal level, provided they are resourced.",
    ],
    practice:
      "A Vinculum diplomat would treat the Commission's own call for the Palava Hut's revival as a model to be replicated proactively, building traditional or community-rooted relational repair mechanisms into a peace process's initial design, rather than waiting, as Liberia's process did, for a formal commission to identify the gap after the fact.",
    takeaway:
      "Wherever a traditional or community-rooted relational repair mechanism already exists in a given cultural context, a Vinculum diplomat treats its early inclusion as a design default, not an optional addition to be considered once formal mechanisms have already proven insufficient.",
    quote: "Early inclusion of a community-rooted repair mechanism is a design default, not an addition.",
    sources: [
      "Republic of Liberia, Truth and Reconciliation Commission Final Report, Vol. I-III (Monrovia, 2009).",
      "Kennesaw State University, \"Rebuilding Relationships after Civil War: Relational Justice and Ex-Combatant Reintegration in Liberia,\" doctoral research.",
      "Howard Zehr, Changing Lenses: A New Focus for Crime and Justice (Scottdale: Herald Press, 1990).",
    ],
    metaDescription:
      "Liberia's Truth and Reconciliation Commission and the Palava Hut scored across the four bond domains of Vinculum Security: the strongest communal repair in the case set, with the weakest institutional follow-through.",
    keywords:
      "Liberia Truth and Reconciliation Commission, Palava Hut, relational justice, ex-combatant reintegration, communal bond repair, relational security case study",
  },
  {
    slug: "rwanda",
    title: "Rwanda: The Gacaca Courts",
    shortTitle: "Rwanda",
    ref: "VII.E",
    summary:
      "Roughly 12,000 community tribunals processed close to two million genocide-related cases between 2002 and 2012.",
    region: "Africa",
    pillar: "Communal",
    threats: ["Genocide", "Post-conflict transition"],
    era: "2000s",
    scores: [3, 3, 2, 2],
    rationales: [
      "Public accounts show wide variation between genuine and coerced, or performative, confession and forgiveness.",
      "High participation, but independent research is genuinely mixed on authentic reconciliation versus compulsory, state-monitored performance.",
      "No mechanism specifically addressed the bond between the 1994 generation and those born afterward.",
      "Credible concerns document the process serving state control objectives alongside reconciliation.",
    ],
    pattern: "Communal participation high, institutional trust and generational transfer weak.",
    narrative: [
      "Rwanda's Gacaca courts processed close to two million genocide-related cases through roughly twelve thousand community tribunals between 2002 and 2012. No comparable process anywhere has handled that volume of cases at community level.",
      "The scale is not in dispute. What the doctrine scores is the depth beneath the scale, and there the independent research record is genuinely mixed.",
      "This is also the case the doctrine subjected to a deliberate adversarial rescoring exercise, set out in full below, in order to take its own self-scoring limitation seriously rather than only acknowledging it in the abstract.",
    ],
    facts: [
      { label: "Instrument", value: "Gacaca community tribunals, 2002 to 2012" },
      { label: "Scale", value: "Close to two million cases across roughly twelve thousand tribunals" },
      { label: "Distinctive feature", value: "Community-led adjudication at national scale" },
      { label: "Contested reading", value: "Reconciliation alongside documented state-control objectives" },
      { label: "Doctrinal role", value: "Site of the doctrine's worked adversarial rescoring demonstration" },
    ],
    finding: [
      "Gacaca's throughput was real, but throughput is not depth. The doctrine now scores the communal level as contested rather than simply strong, and records the intergenerational level as an outright gap, since no mechanism specifically addressed the bond between the 1994 generation and those born afterward.",
      "Credible concerns that the process served state-control objectives alongside reconciliation hold the institutional-relational score to a 2, notwithstanding the machinery's undeniable reach.",
    ],
    practice:
      "A Vinculum diplomat engaging with the Gacaca process would apply the institutional-relational read specifically, seeking independent verification of whether confessed perpetrators and survivors experienced the process as genuinely community-led rather than state-directed, and would treat credible evidence of the latter as a signal to advocate for stronger independent oversight.",
    takeaway:
      "A favourable-looking communal reading should never be accepted as sufficient on its own. A practitioner should be as alert to their own tendency to round a mixed result up to a success as they are to any counterpart's.",
    quote: "Throughput was real. Throughput is not depth.",
    sources: [
      "Human Rights Watch, \"Justice Compromised: The Legacy of Rwanda's Community-Based Gacaca Courts,\" 2011.",
      "Phil Clark, The Gacaca Courts, Post-Genocide Justice and Reconciliation in Rwanda (Cambridge University Press, 2010).",
    ],
    metaDescription:
      "Rwanda's Gacaca courts scored across the four bond domains of Vinculum Security, including the doctrine's worked adversarial rescoring demonstration answering the self-scoring critique.",
    keywords:
      "Rwanda Gacaca courts, post-genocide justice, adversarial rescoring, self-scoring critique, community tribunals, relational security case study",
  },
  {
    slug: "kenya",
    title: "Kenya: The 2008 National Accord",
    shortTitle: "Kenya",
    ref: "VII.F",
    summary:
      "AU Panel mediation under Kofi Annan produced the National Accord, followed by the NCIC and a 2012 Nakuru County Peace Accord addressing Rift Valley communal trust.",
    region: "Africa",
    pillar: "Interpersonal",
    threats: ["Ethnic conflict", "Political violence"],
    era: "2000s",
    scores: [4, 2, 2, 3],
    rationales: [
      "Sustained trust between the two principal negotiating parties, evidenced by the accord's rapid conclusion under AU mediation.",
      "Elite settlement did not, on its own, restore inter-ethnic trust, and a separate 16-month process was required to reach the Nakuru accord.",
      "Youth were disproportionately represented among perpetrators and victims, and no dedicated youth transmission mechanism was included.",
      "NCIC and TJRC created durable institutions under statute, though public trust in findings remained contested for years.",
    ],
    pattern: "Elite bond strong, communal and generational weak.",
    narrative: [
      "Kenya's 2008 post-election crisis, mediated by the African Union Panel of Eminent African Personalities chaired by Kofi Annan, produced the National Accord and Reconciliation Act, signed on 28 February 2008.",
      "The Accord was followed by the National Cohesion and Integration Commission, the Truth, Justice and Reconciliation Commission, and eventually the Nakuru County Peace Accord of 19 August 2012, which addressed Rift Valley communal trust directly.",
      "The gap between February 2008 and August 2012 is the case's central finding. The elite bond was repaired in weeks. The communal bond took four more years to reach at all.",
    ],
    facts: [
      { label: "Instrument", value: "National Accord and Reconciliation Act, signed 28 February 2008" },
      { label: "Mediation", value: "AU Panel chaired by Kofi Annan" },
      { label: "Follow-on bodies", value: "NCIC under Act No. 12 of 2008, and the TJRC" },
      { label: "Communal instrument", value: "Nakuru County Peace Accord, 19 August 2012" },
      { label: "Strongest bond", value: "Interpersonal, scored 4" },
    ],
    finding: [
      "Kenya is offered as an illustration of the doctrine's categories applied retrospectively, not as a claim that the mediators were practising Vinculum Security. The Annan mediation succeeded at the level the doctrine calls interpersonal, quickly and durably.",
      "Youth were disproportionately represented among both perpetrators and victims, and no dedicated generational transmission mechanism was built into the settlement. That absence is the case's clearest unaddressed bond.",
    ],
    practice:
      "A Vinculum diplomat operating within the AU Panel's mediation, alongside the interpersonal work of restoring trust between the two principal parties, would have pressed at the same table for a resourced, time-bound communal reconciliation mechanism to begin immediately alongside the political settlement, rather than allowing four years to pass before the Nakuru process addressed the Rift Valley's communal bond directly.",
    takeaway:
      "When an elite-level settlement moves quickly because interpersonal and institutional bonds are already strong between negotiators, treat that very speed as a signal to check the communal level explicitly. A fast elite agreement is often fast precisely because it has not yet engaged the slower, harder work of communal repair.",
    quote: "A fast elite agreement is often fast because it has not yet engaged communal repair.",
    sources: [
      "United Nations, National Accord and Reconciliation Act, Kenya, signed 28 February 2008.",
      "Republic of Kenya, National Cohesion and Integration Act No. 12 of 2008.",
      "National Cohesion and Integration Commission, Nakuru County Peace Accord, 19 August 2012.",
    ],
    metaDescription:
      "Kenya's 2008 National Accord scored across the four bond domains of Vinculum Security: a rapid elite settlement under Kofi Annan's mediation with communal and generational bonds left unaddressed for years.",
    keywords:
      "Kenya 2008 National Accord, Kofi Annan mediation, NCIC, Nakuru County Peace Accord, Rift Valley, relational security case study",
  },
  {
    slug: "south-africa",
    title: "South Africa: The Truth and Reconciliation Commission",
    shortTitle: "South Africa",
    ref: "VII.G",
    summary:
      "Established under the Promotion of National Unity and Reconciliation Act (1995) and chaired by Archbishop Desmond Tutu, the Commission placed public testimony and conditional amnesty at the centre of a national transition from apartheid.",
    region: "Africa",
    pillar: "Communal",
    threats: ["Political violence", "Post-conflict transition"],
    era: "1990s",
    scores: [3, 3, 2, 2],
    rationales: [
      "Public testimony created real, documented encounters between perpetrators and survivors, though many victims later reported the amnesty process felt inconsistent and insufficiently consultative.",
      "The Commission is widely regarded internationally as a model of restorative justice and explicitly invoked Ubuntu, though structural economic and land inequality between communities remains largely unaddressed three decades later.",
      "The Commission's mandate did not include a dedicated mechanism for transmitting its findings or its reconciliation ethic to generations born after 1994, and persistent economic disparity continues to shape intergenerational opportunity along the same lines apartheid established.",
      "Reparations recommendations have been extensively documented as unimplemented, and prosecutions of implicated individuals have been affected by missing case files and alleged political interference.",
    ],
    pattern:
      "The doctrine's own Ubuntu foundation tested directly; interpersonal and communal breakthroughs, institutional follow-through weak.",
    narrative: [
      "South Africa's Truth and Reconciliation Commission, established under the Promotion of National Unity and Reconciliation Act of 1995 and chaired by Archbishop Desmond Tutu, investigated gross human rights violations committed between 1960 and 1994. It granted amnesty to 849 of 7,112 applicants who gave full disclosure of their crimes.",
      "Tutu explicitly enriched the Commission's mandate with Ubuntu, which makes this the doctrine's most direct case engagement with its own primary philosophical foundation. Public hearings took testimony from over 22,000 victims and witnesses and are widely credited with making the truth of apartheid-era abuses visible and audible to the nation.",
      "Reparations and prosecutions have been extensively documented by Amnesty International and the International Center for Transitional Justice as poorly implemented in the decades since, with land and economic inequality between racial groups remaining structurally unaddressed.",
    ],
    facts: [
      { label: "Instrument", value: "Promotion of National Unity and Reconciliation Act No. 34 of 1995" },
      { label: "Chair", value: "Archbishop Desmond Tutu" },
      { label: "Period examined", value: "Gross human rights violations from 1960 to 1994" },
      { label: "Amnesty", value: "849 grants from 7,112 applications" },
      { label: "Testimony", value: "Over 22,000 victims and witnesses heard" },
    ],
    finding: [
      "This case is the doctrine's most direct test of its own Ubuntu foundation in practice, and the finding is instructive rather than comfortable. Even a process that explicitly invoked Ubuntu and achieved genuine interpersonal and communal breakthroughs left the institutional-relational bond, meaning reparations and accountability, substantially unaddressed.",
      "That is precisely the pattern the doctrine's own working corollary predicts. Its presence in the doctrine's most Ubuntu-adjacent case is stated plainly here rather than minimised because of the case's philosophical proximity to the doctrine's own foundation.",
    ],
    practice:
      "A Vinculum diplomat engaging with a Commission modelled on South Africa's would apply the institutional-relational read with particular care, precisely because this case sits closest to the doctrine's Ubuntu foundation. Reparations and prosecutions were separately and far less successfully pursued, a gap a practitioner should treat as a distinct line item requiring its own resourcing and political will.",
    takeaway:
      "A process built directly on the same philosophical foundation as this doctrine is not thereby exempt from the doctrine's own diagnostic. If anything, an Ubuntu-invoking process warrants closer institutional-relational scrutiny, because its communal and interpersonal successes make the unaddressed accountability gap easier to overlook.",
    quote:
      "The doctrine's most Ubuntu-adjacent case is not exempt from the doctrine's own diagnostic.",
    sources: [
      "Truth and Reconciliation Commission of South Africa, Final Report, 1998, established under the Promotion of National Unity and Reconciliation Act No. 34 of 1995.",
      "Desmond Tutu, No Future Without Forgiveness (New York: Doubleday, 1999).",
      "International Center for Transitional Justice, \"South Africa,\" ictj.org, accessed 2026.",
      "Amnesty International, \"South Africa: Truth and Justice, Unfinished Business in South Africa,\" 2003.",
    ],
    metaDescription:
      "South Africa's Truth and Reconciliation Commission scored across the four bond domains of Vinculum Security, the doctrine's most direct test of its own Ubuntu foundation in practice.",
    keywords:
      "South Africa Truth and Reconciliation Commission, Desmond Tutu, Ubuntu, restorative justice, reparations, apartheid transition, relational security case study",
  },
  {
    slug: "tuvalu-kiribati",
    title: "Tuvalu and Kiribati: Climate Displacement",
    shortTitle: "Tuvalu and Kiribati",
    ref: "VII.H",
    summary:
      "The Australia-Tuvalu Falepili Union (concluded 2023, in force 2024) and Kiribati's migration-with-dignity policy attempt to preserve nationhood and intergenerational continuity across the potential loss of habitable territory.",
    region: "Pacific",
    pillar: "Institutional",
    threats: ["Climate displacement", "Post-conflict transition"],
    era: "2020s",
    scores: [3, 3, 2, 4],
    rationales: [
      "Existing labor and family migration pathways, such as the Pacific Access Category, maintain individual-level ties between diaspora and origin communities, though these remain informal relative to the scale of the challenge.",
      "The documented contrast between Vaitupu's successful, tie-preserving relocation to Kioa and the more coercive Banaban relocation to Rabi shows communal bond outcomes depend heavily on whether relocation is voluntary and relationship-preserving by design.",
      "Surveys documenting that up to seventy percent of Kiribati and Tuvaluan households would migrate if conditions worsen suggest the human-land bond central to cultural identity is already under significant generational strain.",
      "The Falepili Union Treaty and Tuvalu's digital preservation of national institutions represent a proactive, original attempt to secure institutional and sovereign continuity even against the loss of physical territory itself.",
    ],
    pattern:
      "The doctrine's only prospective case; proactive institutional design ahead of an unresolved intergenerational threat.",
    narrative: [
      "Low-lying Pacific Island states, most prominently Tuvalu and Kiribati, face existential territorial loss from sea-level rise, with UN reports estimating over fifty thousand people displaced annually across the Pacific by climate-related disasters.",
      "This case differs structurally from the doctrine's other seven. It is not a post-conflict reconciliation process but an unfolding, prospective security challenge, which allows the doctrine's diagnostic to be tested forward rather than only applied in retrospect. Kiribati's Migration with Dignity policy and Tuvalu's relocation-as-last-resort approach both prioritise preserving the human-land bond central to I-Kiribati and Tuvaluan cultural identity.",
      "The 1940s relocation of the Vaitupu community to Kioa Island in Fiji, which maintained strong cultural and economic ties to the origin community, stands as a documented positive precedent, in contrast to the more coercive colonial-era relocation of Banaban islanders to Rabi Island. In 2023 and 2024, Australia and Tuvalu concluded the Falepili Union Treaty, the first international agreement explicitly addressing the preservation of a state's sovereignty and identity in the event its physical territory becomes uninhabitable.",
    ],
    facts: [
      { label: "Instrument", value: "Australia-Tuvalu Falepili Union Treaty, concluded 2023, in force 2024" },
      { label: "Policy", value: "Kiribati's Migration with Dignity; Tuvalu's relocation as last resort" },
      { label: "Precedents", value: "Vaitupu to Kioa, tie-preserving; Banaban to Rabi, coercive" },
      { label: "Scale", value: "Over fifty thousand people displaced annually across the Pacific" },
      { label: "Doctrinal role", value: "The doctrine's only prospective, forward-tested case" },
    ],
    finding: [
      "This case's institutional-relational score is the strongest of any case in the doctrine at such an early stage of crisis. Unlike the seven retrospective cases, where institutional design was typically a response to bonds already broken, the Falepili Union represents institutional bond-building undertaken before the underlying loss is complete.",
      "Whether that proactive design succeeds in preserving the weaker intergenerational and communal bonds is a question the doctrine cannot yet answer, and it is named directly as a priority for future monitoring in Section XI.",
    ],
    practice:
      "A Vinculum diplomat supporting Pacific climate diplomacy would treat the Falepili Union Treaty's approach, preserving statehood and institutional identity ahead of physical territorial loss, as a model worth replicating in other climate-vulnerable contexts, while treating the documented generational strain on the human-land bond as the case's most urgent unresolved priority rather than a secondary cultural concern.",
    takeaway:
      "The same four-level read applies before a crisis fully resolves, not only afterward. A comparatively strong institutional score is an opportunity to invest early in the weaker communal and intergenerational bonds, following the Vaitupu precedent over the Banaban one, rather than waiting for those bonds to fail first.",
    quote: "Institutional bond-building undertaken before the underlying loss is complete.",
    sources: [
      "Australia and Tuvalu, Falepili Union Treaty, concluded 2023, entered into force 2024.",
      "Migration Policy Institute, \"No Retreat: Climate Change and Voluntary Immobility in the Pacific Islands,\" 2019.",
      "The Diplomat, \"Pacific Nations Adopt First Regional Climate Relocation Framework,\" 2026.",
    ],
    metaDescription:
      "Tuvalu and Kiribati climate displacement read through Vinculum Security: the Falepili Union Treaty, migration with dignity, and the doctrine's only prospective, forward-tested case.",
    keywords:
      "Tuvalu Kiribati climate displacement, Falepili Union Treaty, migration with dignity, human-land bond, Pacific climate diplomacy, relational security case study",
  },
];

// The canonical precedent coordinates are read-only: no desk may move a precedent.
CASES.forEach((c) => Object.freeze(c.scores));

export function getCase(slug?: string) {
  return CASES.find((c) => c.slug === slug);
}
