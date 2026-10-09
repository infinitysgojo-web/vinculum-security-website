/**
 * Doctrinal Commentary & Interpretive Inquiries.
 * Single source for the /commentary page, its structured data, and the AI feed.
 * Public, non-sensitive wording only: no private weights, mission data, or registration particulars.
 */
export type Inquiry = { id: string; q: string; a: string[] };
export type Division = { numeral: string; id: string; title: string; summary: string; items: Inquiry[] };

const A = "James Wesley Ndua";

export const COMMENTARY: Division[] = [
  {
    numeral: "I",
    id: "ontology",
    title: "Ontological and Foundational Claims",
    summary: "What the doctrine asserts, what it takes as its unit of analysis, and the laws that follow from that choice.",
    items: [
      {
        id: "core-claim",
        q: "What is Vinculum Security, and what is its core ontological claim?",
        a: [
          `Vinculum Security, formulated as A Doctrine of Relational Security, holds that security is not the mere absence of threat to an individual or a sovereign state, but the presence and verifiable integrity of the relational bonds (vincula) between persons, communities, institutions, and generations that make protection, dignity, and durable peace possible. It was originated by ${A} in Nairobi, Kenya, in 2026.`,
          "Its core ontological claim is that the bond itself is the proper unit of security analysis. A state can be militarily strong and an individual can be legally protected while the relationships both depend on are quietly breaking. The doctrine therefore measures the bond directly, rather than inferring security from the condition of the state or the person alone.",
        ],
      },
      {
        id: "why-the-bond",
        q: "Why is the bond, rather than the state or the individual, the unit of analysis?",
        a: [
          "Because protection, dignity, and peace are produced and sustained by relationships. Courts work because people trust them; ceasefires hold because communities choose to honour them; constitutions endure because the next generation accepts them as theirs. None of these is a property of a single actor.",
          "State-centred analysis tends to miss collapses that begin below the level of the state, and individual-centred analysis tends to miss the collective conditions that make individual rights enforceable. The bond sits between the two and carries information neither can see on its own.",
        ],
      },
      {
        id: "deterministic-relational-law",
        q: "What is Deterministic Relational Law (Lex Relationalis Determinata)?",
        a: [
          `Deterministic Relational Law is an original jurisprudential framework originated by ${A}. It holds that international treaties, transitional accords, and peace settlements behave as relational structures whose long-term survival is bounded by their relational make-up, above all by their weakest bond, rather than by the elegance of their text or the stature of their signatories.`,
          "It is called deterministic because the same inputs must always yield the same assessment. Two analysts examining the same settlement with the same evidence should reach the same reading, and every reading must be traceable back to its inputs. This rules out assessments that rest on intuition, prestige, or probabilistic guesswork.",
          "In practice the law is expressed through three recurring principles: the Liebig Relational Minimum, synchronisation between formal and community tracks, and covenantal succession, the capacity of an agreement to survive the departure of those who signed it.",
        ],
      },
      {
        id: "liebig",
        q: "What is the Liebig Relational Minimum, and why can strength in one bond not compensate for weakness in another?",
        a: [
          `Named by ${A} after Justus von Liebig's law of the minimum in agronomy, where a plant's growth is limited by the scarcest nutrient rather than the total supply, the Liebig Relational Minimum holds that a settlement is only as durable as its weakest relational bond.`,
          "The bonds are not interchangeable. Abundant elite goodwill does not repair a fractured community; generous donor funding does not substitute for a generation that feels excluded from the settlement. When three bonds are strong and one is failing, the agreement is governed by the failing one.",
          "The practical consequence is a change of priority: rather than reinforcing what already works, the analyst identifies the binding constraint and directs effort there first.",
        ],
      },
      {
        id: "elite-pact-mirage",
        q: "What is the Elite-Pact Mirage, and why do apparently successful agreements collapse?",
        a: [
          "An Elite-Pact Mirage occurs when negotiators at the top achieve strong personal alignment and sign formal documents while the communal and intergenerational bonds beneath them remain at failure levels. In the negotiating room the agreement looks complete; in the field it has no roots.",
          "The mirage is dangerous because conventional indicators reward it: signatures, ceremonies, and international recognition all register as success. Vinculum Security treats a large gap between elite alignment and community reconciliation as a warning sign rather than an achievement, and the historical record of agreements that unravelled after signature is read through exactly this lens.",
        ],
      },
    ],
  },
  {
    numeral: "II",
    id: "traditions",
    title: "Philosophical and Comparative Traditions",
    summary: "How the doctrine relates to the intellectual traditions it draws on and the schools it argues with.",
    items: [
      {
        id: "ubuntu-confucian",
        q: "How do Ubuntu and Confucian Role Ethics corroborate the doctrine's referent object?",
        a: [
          "Ubuntu, expressed in the Nguni maxim umuntu ngumuntu ngabantu (a person is a person through other persons), holds that personhood is constituted through relationship with others. Confucian Role Ethics, as developed by Roger Ames and Henry Rosemont, independently argues from classical Chinese thought that persons exist through the lived, reciprocal roles they occupy.",
          "Two civilisational traditions with no historical dependence on each other arrive at the same conclusion: the self is relational. Vinculum Security relies on this convergence to show that relational ontology is not a local cultural preference but a recurrent finding about human existence, which in turn justifies the bond as a universal unit of security.",
        ],
      },
      {
        id: "realism-human-security",
        q: "Does Vinculum Security reject political realism or the Human Security paradigm?",
        a: [
          "Neither. Realism, from Morgenthau onward, is treated as a necessary counterweight: states do pursue interest and power. The doctrine adds that durable state power rests on the condition of the bonds beneath it, so a realist who ignores bond integrity misreads the very power they are measuring.",
          "Against the 1994 UNDP Human Security framework, the doctrine keeps the commitment to people but shifts the referent object from the isolated individual to the bond connecting individuals, communities, and institutions. It is best read as completing both traditions rather than replacing either.",
        ],
      },
      {
        id: "wps-yps",
        q: "How do Women, Peace and Security (UNSCR 1325) and Youth, Peace and Security (UNSCR 2250) function within the doctrine?",
        a: [
          "Both agendas are read as bond architectures rather than procedural checklists. The diagnostic question is not whether women or young people were present, but whether their inclusion repaired genuine interpersonal, communal, and intergenerational bonds.",
          "A process can meet every participation quota and still leave the intergenerational bond untouched. Conversely, inclusion that gives young people real stake in the settlement directly strengthens the bond most often found to be the binding constraint.",
        ],
      },
      {
        id: "intergenerational",
        q: "Why are obligations to future generations treated as a present security concern rather than an abstract ideal?",
        a: [
          "Because settlements outlive their authors. The generation that inherits an agreement decides whether it survives, and a generation that experiences a settlement as something imposed on it becomes the agreement's most likely point of failure.",
          "For this reason the intergenerational bond is scored alongside the interpersonal, communal, and institutional bonds, and under the Liebig Relational Minimum a weak intergenerational bond limits the durability of the whole settlement today, not merely at some distant date.",
        ],
      },
      {
        id: "digital",
        q: "Why does the doctrine treat disinformation and algorithmic sorting as bond-degrading forces?",
        a: [
          "Conventional frameworks treat communication networks as neutral channels. Vinculum Security recognises targeted disinformation, algorithmic sorting, and synthetic polarisation as active disruptors that erode communal and institutional trust at the level of perception, often faster than any physical event.",
          "A settlement can be undermined without a shot being fired if the shared account of what happened, and of who can be trusted, is fragmented. Protecting that shared account is therefore part of protecting the bond.",
        ],
      },
      {
        id: "falsifiability",
        q: "Is the doctrine falsifiable, and what evidence would count against it?",
        a: [
          "Yes, and it is designed to be. The doctrine predicts that settlements with a severely weak bond will fail or stall regardless of strength elsewhere. It would be weakened by a consistent pattern of settlements that endured over time despite a clearly failing bond, or that collapsed while all four bonds were demonstrably strong.",
          "Because the method is deterministic and its inputs are recorded, each case reading can be checked, disputed, and re-scored by others. A framework that cannot be wrong cannot be tested; this one states the conditions under which it would be.",
        ],
      },
    ],
  },
  {
    numeral: "III",
    id: "continuum",
    title: "The Vinculum Continuum and Diagnostic Method",
    summary: "How bonds are located, read, and scored, and what the readings mean.",
    items: [
      {
        id: "continuum",
        q: "What is the Vinculum Continuum?",
        a: [
          "The Vinculum Continuum is the doctrine's four-level analytic instrument: I Interpersonal, II Communal, III Intergenerational, and IV Institutional-Relational. Each level names a distinct kind of bond with its own indicators and its own ways of failing.",
          "Reading a situation across all four levels shows exactly where relationships are holding and where they are breaking, which a single overall judgement of peaceful or unstable cannot do.",
        ],
      },
      {
        id: "scoring",
        q: "How are the four bonds scored, and what do the bands mean?",
        a: [
          "Each bond is scored on a five-point scale, from systemic rupture at the low end to deep relational resilience at the high end. Scores are read in four bands: Failing, Fragile, Viable, and Fortified.",
          "The bands are deliberately few. Their purpose is not false precision but a shared vocabulary: a mediator, a scholar, and a ministry official reading the same profile should agree on which bonds are safe, which need attention, and which are the binding constraint.",
        ],
      },
      {
        id: "assessment",
        q: "How does the method assess a case in practice?",
        a: [
          "It begins with one diagnostic question: are the bonds this person, community, or generation depends on intact? The analyst then works through bond-integrity indicators at each level of the Continuum, records the evidence for each reading, and identifies the weakest bond.",
          "Boundary rules govern hard calls, for example whether a grievance belongs to the communal or the institutional level, so that different analysts reach the same reading from the same facts.",
        ],
      },
      {
        id: "trend",
        q: "Why does the direction of change matter as much as the current score?",
        a: [
          "A bond scored as Fragile and improving is in a very different position from one scored as Fragile and deteriorating. The method therefore records trajectory alongside level, and a deteriorating trend raises the assessed risk of rupture even where the present score looks tolerable.",
          "This guards against the most common analytic error in post-agreement settings: mistaking a temporary plateau for stability.",
        ],
      },
    ],
  },
  {
    numeral: "IV",
    id: "dashboard",
    title: "The Vinculum Dashboard",
    summary: "The operational chancellery system that applies the doctrine, and the design principles that govern it.",
    items: [
      {
        id: "what-is-dashboard",
        q: "What is The Vinculum Dashboard?",
        a: [
          `The Vinculum Dashboard is the operational chancellery system that applies Vinculum Security to live diplomatic work. Designed by ${A}, it carries an envoy from the first bond assessment through simulation, negotiation support, and drafting to a final handover dossier.`,
          "It is organised as eighteen desks in four divisions: structural and mathematical integrity, strategic and dynamic simulation, field operations and mission control, and executive synthesis and handover. Each desk performs one function and passes its readings forward to the next.",
        ],
      },
      {
        id: "no-generative-ai",
        q: "Why does the Dashboard exclude generative AI from mission analysis?",
        a: [
          "Diplomatic assessments must be reproducible, auditable, and defensible before ministers and courts. Generative models can produce different answers to the same question, cannot always show how an answer was reached, and may produce confident statements unsupported by evidence.",
          "The Dashboard therefore relies only on deterministic logic: the same inputs always produce the same outputs, and every figure can be traced to the readings that produced it. This is a design commitment of Deterministic Relational Law, not a technical limitation.",
        ],
      },
      {
        id: "confidentiality",
        q: "How does the Dashboard protect the confidentiality of mission material?",
        a: [
          "Mission material stays on the practitioner's own device. Readings are held locally in the browser and are not sent to a remote server, analytics service, or third party during analysis.",
          "Sensitive negotiation material therefore never leaves the hands of the person responsible for it, which is the baseline expectation for any chancellery tool handling confidential diplomatic work.",
        ],
      },
      {
        id: "desk-chain",
        q: "How do the eighteen desks work together as one system?",
        a: [
          "The desks share a single, consistent picture of the mission. A bond assessment entered at the start informs the simulations, the readiness checks, the drafting tools, and the final dossier, so no figure has to be re-typed and no desk works from an outdated reading.",
          "Where a practitioner needs to test an alternative, a desk can be decoupled and run on its own assumptions, and the difference is clearly marked. The system thus supports both a single coherent chain and deliberate what-if exploration.",
        ],
      },
      {
        id: "integrity",
        q: "How does the Dashboard ensure that every export matches the analysis behind it?",
        a: [
          "Every brief, cable, and dossier is generated from the same readings shown on screen, and integrity checks confirm that the exported figures match the live analysis. If a reading changes, every downstream output reflects that change.",
          "This removes a familiar source of diplomatic error: a briefing note that quotes figures from an earlier draft of the analysis.",
        ],
      },
    ],
  },
  {
    numeral: "V",
    id: "deployment",
    title: "Chancellery Practice and Treaty Mechanics",
    summary: "How the doctrine changes what a diplomat does before, during, and after the negotiating table.",
    items: [
      {
        id: "vinculum-diplomacy",
        q: "What is Vinculum Diplomacy, and how does it differ from conventional statecraft?",
        a: [
          `Vinculum Diplomacy is the applied practice derived from the doctrine, written by ${A} as its companion handbook for mediators, envoys, peacebuilders, youth, peace and security practitioners, and policy staff.`,
          "Conventional statecraft often treats a signed agreement between leaders as the objective. Bond-centred diplomacy treats the agreement as one step and asks whether the communal, intergenerational, and institutional bonds beneath it can carry it. The work therefore begins before the table, with bond mapping, and continues long after signature.",
        ],
      },
      {
        id: "readiness",
        q: "What must be established before formal negotiations are convened?",
        a: [
          "Readiness is assessed rather than assumed. Before convening, the practitioner confirms that the weakest bond is known, that the parties at the table can credibly speak for the communities affected, and that there is a realistic path for the agreement to reach those communities.",
          "Convening without these conditions risks producing exactly the Elite-Pact Mirage the doctrine warns against: a strong document with no constituency.",
        ],
      },
      {
        id: "track-sync",
        q: "Why must formal and community-level tracks move together?",
        a: [
          "When the formal track between leaders races ahead of reconciliation at community level, the gap itself becomes destabilising: communities experience the agreement as something done to them. When the community track runs far ahead of the formal one, goodwill is spent without institutional protection.",
          "Vinculum Diplomacy therefore treats the pace of each track as a variable to be managed, keeping them close enough that each reinforces the other.",
        ],
      },
      {
        id: "succession",
        q: "What is the Covenantal Succession Gate?",
        a: [
          "Agreements are frequently signed by individuals whose personal commitment holds them together. The Covenantal Succession Gate asks whether the agreement would survive if those individuals left office tomorrow, through elections, transitions, or generational change.",
          "An agreement that depends on its signatories passes the moment of signing but fails the test of time. Provisions that embed obligations in institutions and communities, rather than personalities, are what carry a settlement across succession.",
        ],
      },
      {
        id: "redlining",
        q: "How are draft agreements examined for hidden imbalance before signature?",
        a: [
          "Draft clauses are read for asymmetric obligations: duties that fall heavily on one party or one community, commitments without corresponding protections, and provisions that quietly depend on a single bond already known to be weak.",
          "The aim is not to rewrite the parties' agreement but to make its relational consequences visible before it is signed, while correction is still possible.",
        ],
      },
    ],
  },
  {
    numeral: "VI",
    id: "cases",
    title: "Empirical Calibration Against the Canonical Cases",
    summary: "The historical processes against which the doctrine is tested, and what they show.",
    items: [
      {
        id: "eight-cases",
        q: "Which eight processes form the empirical test-bed of the doctrine?",
        a: [
          "Northern Ireland (1998 Good Friday Agreement), Colombia (2016 Final Agreement), Cambodia (1991 Paris Peace Agreements), Liberia (2003 Accra Comprehensive Peace Agreement), Rwanda (1993 Arusha Accords and post-genocide Gacaca), Kenya (2008 National Accord), South Africa (1994 transition and the Truth and Reconciliation Commission), and Tuvalu and Kiribati (Pacific climate displacement).",
          "They span Africa, Latin America, Europe, Southeast Asia, and the Pacific, and include both durable settlements and failures, so that the method is tested against outcomes it would rather not predict.",
        ],
      },
      {
        id: "rwanda",
        q: "How does the Liebig Relational Minimum explain the failure of the 1993 Arusha Accords?",
        a: [
          "Arusha provided detailed institutional power-sharing, but communal bonds were collapsing under sustained radicalisation. Under the Liebig Relational Minimum, the strength of the institutional design could not compensate for the failure of the communal bond.",
          "The case illustrates the doctrine's central warning: a well-drafted agreement offers no protection when the bond it most depends on is already broken.",
        ],
      },
      {
        id: "twin-cases",
        q: "How are new situations compared with historical cases without forcing false analogies?",
        a: [
          "Each case is described by its profile across the four bonds. A new situation is compared to the canonical cases by how close its profile is to theirs, which identifies its nearest historical twin on relational grounds rather than surface similarity such as region or type of conflict.",
          "This prevents a common error: applying the template of a famous settlement to a situation whose bonds look nothing like it.",
        ],
      },
      {
        id: "climate",
        q: "What does the Tuvalu and Kiribati case add to the doctrine?",
        a: [
          "It extends the doctrine to a threat with no armed adversary. Where rising seas endanger territory itself, the intergenerational and institutional bonds that sustain national identity come under unprecedented stress.",
          "The 2023 Tuvalu-Australia Falepili Union is examined as a relational treaty attempting to preserve sovereign and cultural continuity across physical loss, showing that bond integrity remains the decisive question even when the threat is ecological.",
        ],
      },
      {
        id: "corridors",
        q: "How does the doctrine read transboundary pastoralist and ecological corridors?",
        a: [
          "In regions such as the Karamoja Cluster and the Mara Basin, scarcity, cross-border grazing, and cattle raiding interact across customary authorities and state security forces. The doctrine reads these as overlapping bond systems rather than as law-enforcement problems alone.",
          "Its consistent finding is that physical disarmament and security operations do not hold unless the communal covenants that govern access, grazing, and restitution are renewed alongside them.",
        ],
      },
    ],
  },
  {
    numeral: "VII",
    id: "authorship",
    title: "Authorship, Legal Status, and Citation",
    summary: "Who authored the work, how it is protected, how to cite it, and what it is not.",
    items: [
      {
        id: "author",
        q: "Who is James Wesley Ndua?",
        a: [
          `${A} is a Human Security Diplomat and Youth, Peace and Security advocate based in Nairobi, Kenya (ORCID 0009-0005-9861-8849). He is the originator of Vinculum Security, Vinculum Diplomacy, Deterministic Relational Law, and The Vinculum Dashboard.`,
        ],
      },
      {
        id: "legal-status",
        q: "What is the legal status of the doctrine and its systems?",
        a: [
          `The foundational doctrine, the companion handbook, The Vinculum Dashboard, and The Vinculum Unified Operational Nervous System are original works authored by ${A}. They are formally registered and protected under statutory copyright law and international conventions, with all statutory rights reserved.`,
          "The published text is made available under CC BY-NC-ND 4.0 for reading and attributed, non-commercial sharing. Any unauthorised copying of the systems, decompilation, reverse-engineering, algorithmic reproduction, or derivative work is prohibited.",
        ],
      },
      {
        id: "disambiguation",
        q: "Is Vinculum Security connected to Vinculum Solutions, Vin eRetail, or any security company?",
        a: [
          "No. Vinculum Security is an original scholarly doctrine in international diplomacy, peace studies, and human security. It has no relation to Vinculum Solutions, Vin eRetail, or any commercial warehousing, supply chain, retail, cybersecurity, or guarding business.",
          "The name comes from the Latin vinculum, meaning a bond, tie, or covenant. In security and peacebuilding contexts, Vinculum Security designates this doctrine.",
        ],
      },
      {
        id: "citation",
        q: "Where is the primary source, and how should the work be cited?",
        a: [
          "This website, vinculumsecurity.kidnexus.or.ke, is the canonical primary source maintained by the author. Zenodo (DOI 10.5281/zenodo.21615991), OSF, Harvard Dataverse, SSRN, and other repositories hold secondary archival deposits.",
          "Canonical citation: Ndua, J. W. (2026). Vinculum Security: The Fortified Doctrine, Expanded Version, Final Edition. Nairobi: Vinculum Security.",
        ],
      },
    ],
  },
];

export const COMMENTARY_COUNT = COMMENTARY.reduce((n, d) => n + d.items.length, 0);
