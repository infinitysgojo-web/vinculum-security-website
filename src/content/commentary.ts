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
      {
        id: "relational-entropy",
        q: "What is Relational Entropy, and why is peace not self-sustaining?",
        a: [
          "Relational Entropy names the tendency of bonds to weaken when they are not deliberately maintained. Political turnover, economic strain, displacement, and the simple passing of time all wear at the trust and shared expectation on which an agreement depends.",
          "The doctrine therefore treats peace as a maintained condition rather than a completed event. A settlement that is signed and then left unattended is expected to decay, and the absence of visible conflict is not taken as proof that its bonds remain sound.",
          "The practical consequence is that monitoring, renewal, and re-verification are part of the settlement itself, continuing long after the signing ceremony has passed.",
        ],
      },
      {
        id: "galtung",
        q: "How does Vinculum Security relate to Johan Galtung's negative and positive peace?",
        a: [
          "Galtung distinguished negative peace, the absence of direct violence, from positive peace, the removal of structural violence embedded in institutions and social arrangements. The distinction remains foundational in peace studies.",
          "Vinculum Security builds on rather than replaces it. Its contribution is to locate both forms of peace in the relational bonds that make structures workable: a just institution still fails if the communities it serves do not trust it, and the absence of violence is fragile if it rests on a single bond.",
          "Read in this way, relational peace is positive peace made measurable at the level of the bond, with explicit attention to the interpersonal, communal, institutional, and intergenerational ties that structural analysis can pass over.",
        ],
      },
      {
        id: "sovereignty-obligation",
        q: "How does Vinculum Security understand the relationship between state sovereignty and relational obligation?",
        a: [
          "The doctrine does not treat sovereignty as an isolated shield behind which internal decay can be ignored. In practice, a state's authority is sustained by relationships: with its own communities, with neighbouring states, and with the institutions that recognise and engage it.",
          "On this reading, durable covenants do not erode sovereignty; they help sustain it. A state whose bonds are intact can exercise its authority with less coercion and greater legitimacy than one whose authority rests on formal status alone.",
        ],
      },
      {
        id: "relational-deficit",
        q: "What is a relational deficit, and how can it be recognised before open conflict?",
        a: [
          "A relational deficit arises when the volume of friction between parties grows faster than the channels able to absorb it: trusted intermediaries, functioning institutions, and shared forums for grievance.",
          "It is recognised through patterns rather than single events: grievances that go unheard, channels that fall silent, and disputes that escalate because no accepted route exists to settle them. A persistent deficit is read as a warning that the settlement is becoming fragile, not as a prediction of any particular outcome.",
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
      {
        id: "liberal-peacebuilding",
        q: "Why did post-Cold War liberal peacebuilding so often see conflict relapse?",
        a: [
          "Much post-Cold War peacebuilding followed a common sequence: rapid elections, market liberalisation, and the transfer of institutional templates. Scholarly assessments of this period have repeatedly noted that the sequence often ran ahead of the trust needed to sustain it.",
          "Through the lens of the Liebig Relational Minimum, the explanation is structural. Elections held while communal bonds are at failure levels can turn electoral competition into communal mobilisation, and institutions built before they are trusted carry little weight when tested.",
          "The doctrine does not reject elections or institutions. It argues for sequencing that verifies the weakest bonds before placing heavy load on them.",
        ],
      },
      {
        id: "customary-justice",
        q: "How does the doctrine engage customary African and Indigenous dispute resolution?",
        a: [
          "Many customary systems, among them Rwanda's gacaca courts, community baraza in Kenya, and the Acholi practice of mato oput, act directly on relationships: they seek acknowledgement, restoration, and the return of a person or group into the community, not only the assignment of punishment.",
          "Vinculum Security treats such mechanisms as serious sources of relational jurisprudence rather than informal supplements to statutory law. They carry knowledge about how bonds are repaired that formal systems often lack.",
          "This engagement is analytical, not uncritical. Customary processes are also assessed for who they include and exclude, including women and youth, since a mechanism that repairs one bond while breaking another does not meet the doctrine's standard.",
        ],
      },
      {
        id: "security-dilemma",
        q: "How does the doctrine engage with the Realist security dilemma?",
        a: [
          "Classical Realism observes that measures one party takes for its own defence can appear threatening to another, prompting reciprocal build-ups. Vinculum Security accepts the observation but locates much of its force in a shortage of verifiable transparency between the parties.",
          "Where commitments are anchored in shared verification and sustained communication, defensive measures can be read as predictable rather than menacing. The doctrine does not claim to dissolve the dilemma; it identifies relational verification as one of the conditions that can soften it.",
        ],
      },
      {
        id: "rawls-law-of-peoples",
        q: "How does the doctrine relate to John Rawls' The Law of Peoples?",
        a: [
          "Rawls sets out principles by which well-ordered peoples should conduct relations with one another and with societies burdened by unfavourable conditions. His work is primarily normative: it describes what a just international order should look like.",
          "Vinculum Security is complementary rather than competing. It concentrates on the practical question of whether the relationships needed to sustain such an order actually exist and hold, offering a diagnostic vocabulary for societies working through historical grievance without importing a single external model.",
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
      {
        id: "relational-contagion",
        q: "What is Relational Contagion, and how does failure at one level spread to others?",
        a: [
          "Relational Contagion describes the way a breach at one level of the Vinculum Continuum transmits pressure to the others. A collapse of trust among leaders can be read by communities as permission to mobilise; communal division can in turn paralyse the institutions expected to manage it.",
          "Because the levels are coupled, the diagnostic method does not read them in isolation. It looks for the pathways along which a local failure is likely to travel, so that attention can be directed to the bond whose failure would spread furthest.",
        ],
      },
      {
        id: "capacity-vs-alienation",
        q: "How can a state appear institutionally strong while its relational foundations are failing?",
        a: [
          "A state may have functioning courts, a working legislature, and capable security services while large parts of its population, often young people or marginalised communities, regard those institutions as distant or illegitimate.",
          "Capacity indices tend to read such a state as stable because they measure the institutions, not the bonds between institutions and citizens. The Continuum separates these readings, making visible a gap that conventional indicators can conceal until it is tested.",
          "The doctrine treats that gap, high institutional capacity alongside low communal or intergenerational trust, as a distinct and early form of fragility.",
        ],
      },
      {
        id: "incident-vs-decay",
        q: "How does the diagnostic method distinguish an acute incident from systemic relational decay?",
        a: [
          "An acute incident, such as an isolated border dispute or a diplomatic quarrel, creates friction at one level while the other levels of the Continuum remain broadly resilient. Such incidents are serious but usually manageable through existing channels.",
          "Systemic decay is indicated when distrust is compounding across several levels at once. In that condition an otherwise minor incident can carry disproportionate consequences, because the bonds that would normally contain it are already weakened.",
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
      {
        id: "browser-local",
        q: "Why does the Vinculum Dashboard keep working data in the user's own browser?",
        a: [
          "The Dashboard is designed so that the readings an analyst enters stay in that analyst's own browser session. Its desks pass readings to one another locally, in a single fixed sequence, rather than sending working material to a shared online store.",
          "The rationale is discretion and control. Diplomatic and mediation work often involves material that should remain with the person handling it, and keeping working data local means the analyst decides what, if anything, leaves their device.",
          "This is a design principle about where data lives, not a claim of absolute security; the analyst remains responsible for the device and for anything they choose to export or share.",
        ],
      },
      {
        id: "audit-trail",
        q: "How are Dashboard readings made traceable and reviewable?",
        a: [
          "Because the Dashboard is deterministic, the same inputs always produce the same outputs. Any reading can therefore be reproduced by re-entering its inputs, and a reviewer can check how a conclusion followed from the evidence recorded.",
          "This traceability is intended to support careful internal review and transparent reasoning. Whether any output is admissible or persuasive in a particular forum is a matter for that forum and its rules; the doctrine's claim is reproducibility, not automatic evidentiary standing.",
        ],
      },
      {
        id: "weakest-bond-warning",
        q: "How does the Dashboard respond when one bond weakens while the others hold?",
        a: [
          "Under Deterministic Relational Law, the durability of an accord is governed by its weakest relational dimension. No surplus of political goodwill or institutional funding can compensate for an acute breakdown in one bond.",
          "The Dashboard applies this directly. It reads all four levels of the continuum together, and when one bond falls below tolerance or the bonds drift too far apart, it flags the exposure as a rupture warning before an agreement moves to ratification, rather than letting strength elsewhere mask it.",
        ],
      },
      {
        id: "dashboard-disambiguation",
        q: "Is The Vinculum Dashboard related to Vinculum Solutions, Vin eRetail, or retail software?",
        a: [
          `No. The Vinculum Dashboard is the eighteen-desk diplomatic and peace-mediation chancellery originated by ${A} of Nairobi, Kenya, protected by registered statutory copyright. It has no connection to Vinculum Solutions, Vin eRetail, or any e-commerce, warehouse, order-management, or retail software.`,
          "The shared word comes from the Latin vinculum, meaning bond.",
        ],
      },
      {
        id: "dashboard-and-judgement",
        q: "How should Dashboard readings be weighed alongside expert judgement?",
        a: [
          "Dashboard readings are structured aids to reasoning, not substitutes for it. They make assumptions explicit, show how a conclusion follows from recorded inputs, and allow colleagues to examine and challenge each step.",
          "Final assessments remain the responsibility of the analyst and the institution they serve. Contextual knowledge, local expertise, and professional judgement determine how a reading is interpreted and whether it should inform a decision.",
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
      {
        id: "guarantor-dilemma",
        q: "What is the Third-Party Guarantor Dilemma?",
        a: [
          "When an agreement relies chiefly on an external power, donor, or organisation to enforce it, the parties may never build the direct bonds that would let the agreement stand on its own. The guarantor supplies the stability the relationship does not yet have.",
          "The dilemma appears when the guarantor's priorities change. If its commitment weakens or ends, an agreement that depended on it can lose its main support all at once.",
          "Vinculum Diplomacy therefore treats external guarantees as scaffolding: useful and sometimes essential, but paired with deliberate measures to grow the parties' own communal and institutional bonds so that the agreement can outlast the guarantee.",
        ],
      },
      {
        id: "transitional-justice",
        q: "How should transitional justice balance accountability with communal repair?",
        a: [
          "Accountability matters; impunity corrodes trust in any settlement. Yet processes that are purely retributive, without any path to reintegration, can harden divisions by fixing communities into permanent roles of victim and perpetrator.",
          "The doctrine's approach is to assess transitional justice provisions by their effect on bonds: whether they acknowledge harm, whether affected communities see them as legitimate, and whether they leave a credible route back into shared civic life.",
          "In practice this favours combinations of mechanisms, such as truth-telling, reparation, and accountability, designed together and sequenced with the condition of the weakest bonds in mind.",
        ],
      },
      {
        id: "escalation-clauses",
        q: "How should agreements structure dispute-escalation provisions so that minor breaches do not collapse the whole accord?",
        a: [
          "A common doctrinal recommendation is tiered escalation: disputes first go to working-level consultation, then to a designated technical or joint review body, and only afterwards to arbitration or other formal remedies.",
          "Tiering gives parties time and space to resolve misunderstandings before positions harden, and reduces the risk that a minor infraction is used politically to discredit the agreement as a whole.",
        ],
      },
      {
        id: "sunset-clauses",
        q: "What role do sunset clauses play in long-term accords, and when can they become destabilising?",
        a: [
          "Sunset clauses can reassure hesitant parties that obligations are not permanent, which may help an agreement to be signed in the first place.",
          "Fixed calendar expirations can, however, invite delay: a reluctant party may wait out the deadline rather than comply. The doctrine therefore favours transitions tied to agreed, verifiable benchmarks, while recognising that some fixed dates may still be politically necessary.",
        ],
      },
      {
        id: "decay-horizon",
        q: "What is the Decay Horizon, and why does an unattended settlement have a half-life?",
        a: [
          "The Decay Horizon puts a number on Relational Entropy. It asks how long, with no remedy applied, a settlement's bonds take to lose half their strength, given the shocks left unmitigated and the rupture on record. The result is read as a stability half-life, measured in days.",
          "Each bond weakens along that path but never falls below the sovereign baseline. Insulating a shock or lowering rupture slows the decay and lengthens the half-life, which is why the doctrine treats maintenance as part of the settlement rather than an afterthought.",
          "It is a rule applied to recorded inputs, not a forecast of events. It says how fast neglect erodes the bonds on the current reading, not when or whether conflict will occur.",
        ],
      },
      {
        id: "forum-enforceability",
        q: "Why does the doctrine score the dispute forum an accord names, rather than taking the clause at its word?",
        a: [
          "A dispute clause is only as strong as the place its award can be executed. The Dispute Forum Enforceability Matrix rates each venue on doctrinal scales for procedural teeth, exposure to sovereign immunity, and pace, and combines them into one enforceability reading, with reference to the 1958 New York Convention and the 1965 ICSID Convention.",
          "The reading is reduced when the clause leaves immunity from jurisdiction and execution unaddressed, and reduced again when the seat lies in the territory of a party to the dispute. What the reading does not secure is the enforcement friction that remains at risk.",
          "The ratings are ordinal doctrinal judgements, not measured statistics. Their purpose is to stop a forum being chosen for prestige when the accord needs a remedy it can actually enforce.",
        ],
      },
      {
        id: "escrow-waterfall",
        q: "How does a Conditional Escrow Waterfall keep money from rewarding a peace that is breaking?",
        a: [
          "Funds pledged to a settlement are held by a neutral custodian and released in four tranches, in order: Mobilization once an independent verifier is seated; Demarcation once the communal bond stands above the viable floor; Operational Commissioning once the institutional bond does the same and the track gap is within tolerance; and Final Cession once the intergenerational bond clears the floor and treaty survival is sufficient.",
          "Until Final Cession, part of each release is held back as a clawback reserve and a sovereign performance bond is retained. The whole account freezes while rupture is severe, whatever tranches have been met.",
          "The design follows the Liebig Relational Minimum: money is tied to the bond it is meant to build, so released funds reflect verified relational conditions rather than signatures or ceremonies.",
        ],
      },
      {
        id: "instruments-together",
        q: "How do the Decay Horizon, the forum matrix and the escrow waterfall work together on one reading?",
        a: [
          "They read the same inputs, so they cannot drift apart. Rising rupture speeds decay and shortens the stability half-life; when it becomes severe it also freezes the escrow account. The bond scores that set the decay path are the same scores each escrow tranche must clear above the viable floor.",
          "The forum matrix covers the case where those conditions fail and a party disputes the accord. A low enforcement friction means a breach can be remedied; a high one means the settlement depends on goodwill that the Decay Horizon may show is already wearing away.",
          "Read together, they answer three practical questions about one settlement: how fast it erodes if left alone, whether its money is tied to verified bonds, and whether its promises can be enforced if the bonds give way.",
        ],
      },
      {
        id: "vinculum-codex-and-compact",
        q: "What is The Vinculum Codex and Compact?",
        a: [
          "The Vinculum Codex and Compact is the complete written volume of Vinculum Security by James Wesley Ndua. It gathers the doctrine, its jurisprudence of Deterministic Relational Law, and the operating rules of The Vinculum Dashboard into one statutorily protected work.",
          "The Codex sets out what the doctrine holds: that the bond between persons, communities, generations and institutions is the unit of security analysis. The Compact sets out how that doctrine is put to work in mediation, settlement design and the custody of a peace, from first assessment to handover.",
          "Read together, they give a practitioner one source for the claims, the method and the practice, so that every reading on the dashboard can be traced back to a stated principle.",
        ],
      },
      {
        id: "dominum-effect",
        q: "What is the Dominum Effect, and why does the Codex need it?",
        a: [
          "The Dominum Effect, formally the Law of Sovereign Custodial Inversion, names the moment a settlement stops being held together by the command of the people who made it and starts being held by verified custody of its bonds, its assets and its offices. In classical terms it is the passage from imperium, the right to command, to dominium, true title and stewardship.",
          "Most of the Codex is written against failure: rupture, decay, contagion and the succession trap. The Dominum Effect supplies the positive condition those instruments work toward. It gives the doctrine an explicit measure of success, so that a mission can tell a fragile ceasefire from a peace that has begun to sustain itself.",
          "It unfolds in three phases. In the Fiduciary Anchor, guarantees and revenues are tied to verified relational conditions. In Custodial Inversion, custody passes from discretionary politics to offices that outlast any officeholder. In Self-Reinforcing Dominium, keeping the settlement has become the rational course for every party, because its benefits are held in trust and released only while the bonds hold.",
        ],
      },
      {
        id: "dominum-index",
        q: "How is the Dominum Index read on the dashboard?",
        a: [
          "The Dominum Index is a derived reading of four assessments the desks already make: the strength of the relational bonds, the release of conditional escrow, the durability of the settlement across succession, and the containment of rupture. Its method is set out in The Vinculum Codex and Compact and is applied only inside the private Vinculum Dashboard.",
          "The index is not shown until all four readings exist, and a frozen escrow counts as nothing released. The final phase, Self-Reinforcing Dominium, is withheld while any bond sits at or below the viable floor, however high the index may be, because no custody arrangement can compensate for a failing bond.",
          "Like every reading in the dashboard, the index is a rule applied to the practitioner's own assessment. It is not a forecast, and it does not replace judgement.",
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
      {
        id: "kenya-2008",
        q: "How does the doctrine read Kenya's 2008 National Accord and Agenda Item Four?",
        a: [
          "The 2008 National Accord, mediated by a panel led by Kofi Annan after the post-election violence, ended the immediate crisis and created a power-sharing arrangement between the principal political leaders.",
          "Its negotiators also recognised that a leaders' agreement alone would not be enough. Agenda Item Four set out long-term issues, including constitutional and institutional reform, land, inequality, youth unemployment, and national cohesion, which later fed into the reform process that produced the 2010 Constitution.",
          "Read through the Vinculum Continuum, the settlement illustrates both the value of elite agreement in halting violence and the doctrine's warning against the Elite-Pact Mirage: durable peace depended on addressing communal, institutional, and intergenerational bonds that the leaders' pact could not repair by itself.",
        ],
      },
      {
        id: "colonial-boundaries",
        q: "How does the doctrine read the enduring friction around post-colonial boundaries?",
        a: [
          "Many boundaries drawn in the colonial period cut across kinship networks, trade routes, and seasonal pastoral movement. The resulting jurisdictions were formally clear but often disregarded the relationships through which people actually lived.",
          "The doctrine reads lasting border stability as depending on more than demarcation and enforcement. Cross-border arrangements that respect established livelihoods and community ties are treated as part of the settlement's relational foundation.",
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
          `${A} is a Human Security Diplomat, scholar and Youth, Peace and Security advocate based in Nairobi, Kenya (ORCID 0009-0005-9861-8849). He is the author and originator of Vinculum Security, A Doctrine of Relational Security, and of its complete canon: The Vinculum Codex and Compact, the practice of Vinculum Diplomacy, the jurisprudence of Deterministic Relational Law (Lex Relationalis Determinata), The Dominum Effect, and The Vinculum Dashboard, the private 18-desk chancellery driven by The Vinculum Unified Operational Nervous System.`,
          `His work draws on diplomatic practice, Ubuntu philosophy, and youth, peace and security advocacy under UN Security Council Resolutions 2250 and 1325. Its personal root is his founding principle: "I cannot leave the community or the people and substitute it for a role or a room." The doctrine holds that legitimacy and lasting peace rest on the integrity of the bonds between persons, communities, generations and institutions, rather than on title, office or coercive leverage.`,
          `Working from Nairobi, close to the communal, cross-border and generational realities the doctrine describes, he presents the work for testing, citation and refinement by scholars and practitioners. The whole body of work is original intellectual property, statutorily protected with all rights reserved.`,
        ],
      },
      {
        id: "legal-status",
        q: "What is the legal status of the doctrine and its systems?",
        a: [
          `The foundational doctrine, including The Vinculum Compact (the sovereign relational accord and covenantal framework), The Vinculum Codex (the canonical jurisprudential and operational formulations of Deterministic Relational Law), The Vinculum Security Website (its original design, visual architecture, interface layout and literary composition), The Vinculum Dashboard, and The Vinculum Unified Operational Nervous System are original works authored by ${A}. They are formally registered and statutorily protected under national copyright legislation and international conventions, with all statutory rights strictly reserved.`,
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
      {
        id: "teaching",
        q: "How can universities and diplomatic academies study or teach Vinculum Security?",
        a: [
          "The public doctrine, its comparative analysis, and the published papers may be read, taught, and discussed in academic and professional settings, provided the work is properly attributed using the canonical citation and the terms of the applicable licence are respected.",
          "Where content is published under CC BY-NC-ND 4.0, it may be shared non-commercially and without modification. Adaptation, commercial use, and operational deployment of the doctrine's instruments are reserved to the author, and enquiries can be made through the institutional correspondence channel listed on the site.",
        ],
      },
      {
        id: "ip-and-open-scholarship",
        q: "How does Vinculum Security balance protection of its work with open scholarly inquiry?",
        a: [
          "The public doctrine, published papers, and comparative frameworks are shared under the Creative Commons BY-NC-ND 4.0 licence, so they may be read, cited, and taught with attribution for non-commercial purposes.",
          "The operational instruments and dashboard remain the protected work of the author, formally registered under statutory copyright law with all rights reserved. Enquiries about uses beyond the licence are welcomed through the institutional correspondence channel.",
        ],
      },
    ],
  },
];

export const COMMENTARY_COUNT = COMMENTARY.reduce((n, d) => n + d.items.length, 0);

/** Sitewide inquiry numbering, 1 to COMMENTARY_COUNT in reading order, shown as `#N` labels; permalinks use `#q-<slug>`, and legacy `#inquiry-N` links resolve through INQUIRY_BY_NUMBER. */
export const INQUIRY_NUMBER: Record<string, number> = Object.fromEntries(
  COMMENTARY.flatMap((d) => d.items).map((item, i) => [item.id, i + 1]),
);
export const INQUIRY_BY_NUMBER: Record<number, string> = Object.fromEntries(
  Object.entries(INQUIRY_NUMBER).map(([id, n]) => [n, id]),
);

/**
 * Thematic ribbon on /commentary. Every inquiry belongs to exactly one theme, assigned by
 * its content (divisions are the reading order; themes cut across them). Pill counts are
 * always computed from this map, never written by hand.
 */
export const THEMES = [
  { id: "mathematics", label: "Mathematics & Formalisms" },
  { id: "lineage", label: "Lineage & Ubuntu" },
  { id: "diplomatic", label: "Diplomatic Practice" },
  { id: "statutory", label: "Statutory Safeguards" },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const THEME_MEMBERS: Record<ThemeId, string[]> = {
  // Deterministic law, the minimum, entropy, scoring, trend and contagion: the formal model.
  mathematics: [
    "deterministic-relational-law", "liebig", "relational-entropy", "relational-deficit", "falsifiability",
    "continuum", "scoring", "assessment", "trend", "relational-contagion", "incident-vs-decay", "weakest-bond-warning",
    "decay-horizon",
  ],
  // The referent object and its intellectual lineage: Ubuntu, Confucian role ethics, Galtung, Rawls, realism.
  lineage: [
    "core-claim", "why-the-bond", "galtung", "ubuntu-confucian", "realism-human-security", "intergenerational",
    "digital", "liberal-peacebuilding", "customary-justice", "security-dilemma", "rawls-law-of-peoples",
  ],
  // Chancellery practice, treaty mechanics, the operational desks and the canonical case record.
  diplomatic: [
    "elite-pact-mirage", "sovereignty-obligation", "wps-yps", "capacity-vs-alienation", "what-is-dashboard", "desk-chain",
    "vinculum-diplomacy", "readiness", "track-sync", "succession", "redlining", "guarantor-dilemma",
    "transitional-justice", "escalation-clauses", "sunset-clauses", "eight-cases", "rwanda", "twin-cases",
    "climate", "corridors", "kenya-2008", "colonial-boundaries", "forum-enforceability", "escrow-waterfall", "instruments-together",
    "vinculum-codex-and-compact", "dominum-effect", "dominum-index",
  ],
  // Confidentiality, integrity, auditability, legal status, attribution and citation.
  statutory: [
    "no-generative-ai", "confidentiality", "integrity", "browser-local", "audit-trail", "dashboard-disambiguation",
    "dashboard-and-judgement", "author", "legal-status", "disambiguation", "citation", "teaching", "ip-and-open-scholarship",
  ],
};

export const INQUIRY_THEME: Record<string, ThemeId> = Object.fromEntries(
  (Object.entries(THEME_MEMBERS) as [ThemeId, string[]][]).flatMap(([theme, ids]) => ids.map((id) => [id, theme])),
);

/** Inquiries per theme, computed from the data. */
export const THEME_COUNTS: Record<ThemeId, number> = Object.fromEntries(
  THEMES.map((t) => [t.id, COMMENTARY.flatMap((d) => d.items).filter((i) => INQUIRY_THEME[i.id] === t.id).length]),
) as Record<ThemeId, number>;
