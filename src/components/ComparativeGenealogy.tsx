import { useState } from "react";

/**
 * Traditions in Dialogue: the comparative genealogy.
 * Each tradition is set beside Vinculum Security: shared ground, the point of
 * departure, and what that tradition alone cannot see in the field.
 * Text follows Sections II and III.C of the Final Edition.
 */

type Tradition = {
  id: string;
  name: string;
  year: string;
  school: string;
  lineage: "Statecraft" | "Protection" | "Relational";
  referent: string;
  thesis: string;
  agrees: string;
  departs: string;
  blindSpot: string;
  ref: string;
};

const VINCULUM_REFERENT = "The relational bond itself";

const TRADITIONS: Tradition[] = [
  {
    id: "westphalian",
    name: "State Security",
    year: "1648 onward",
    school: "Westphalian tradition",
    lineage: "Statecraft",
    referent: "The state",
    thesis:
      "Security is the survival of the sovereign state against external military threat, secured through territory, arms, and alliance.",
    agrees:
      "Territorial integrity and the survival of the state are real conditions. A doctrine that cannot speak about them is of no use in a foreign ministry.",
    departs:
      "Vinculum Security moves the referent object from the state to the bond. A state can be intact on the map while the bonds between its institutions and its population have already failed.",
    blindSpot:
      "It reports a country as secure on the day before a collapse that began years earlier inside communities the state never measured.",
    ref: "Doctrine §II.A, §III.C",
  },
  {
    id: "realism",
    name: "Political Realism",
    year: "1948",
    school: "Morgenthau",
    lineage: "Statecraft",
    referent: "The state, defined by power",
    thesis:
      "Politics is governed by objective laws rooted in human nature. Interest is defined as power, and universal moral principles do not bind state action.",
    agrees:
      "The realist description of how states behave is not disputed. Power and interest are read first, not last, and urgency is never traded for reflection.",
    departs:
      "Bond integrity is added to the realist inventory rather than set against it. The bonds an outcome rests on are themselves part of a state's actual capacity.",
    blindSpot:
      "An elite settlement signed by two principals can hold on paper and dissolve the week the personnel change, because nothing beneath the signatures was ever tested.",
    ref: "Doctrine §II.C",
  },
  {
    id: "securitization",
    name: "Securitization Theory",
    year: "1998",
    school: "Buzan, Wæver, de Wilde",
    lineage: "Statecraft",
    referent: "Whatever is successfully framed as an existential threat",
    thesis:
      "Security is a discursive act. A matter becomes a security matter when an actor speaks it into that status and an audience accepts the claim.",
    agrees:
      "Both traditions warn against the overuse of emergency framing, which hollows out the language of security and licenses exceptional measures.",
    departs:
      "Vinculum Security makes a substantive counter-claim: relational bonds are real whether or not any actor has named them as security matters.",
    blindSpot:
      "A bond can rot entirely unspoken. If nothing is said, nothing is studied, and the rupture arrives without a prior sentence about it.",
    ref: "Doctrine §II.D",
  },
  {
    id: "human-security",
    name: "Human Security",
    year: "1994",
    school: "UNDP; Haq and Sen",
    lineage: "Protection",
    referent: "The individual person",
    thesis:
      "The referent object shifts from the state to the person: freedom from fear, freedom from want, and freedom to live in dignity.",
    agrees:
      "The move away from the state as sole referent is accepted without reservation, and the dignity clause is carried directly into the doctrine's own definition.",
    departs:
      "Assessment at the individual level is incomplete. The proper unit is not only the person and not only the institution, but the relationship between them.",
    blindSpot:
      "It can report a person as secure today while the bonds that constitute that person's safety tomorrow are visibly eroding.",
    ref: "Doctrine §II.A, §III.B",
  },
  {
    id: "r2p",
    name: "Responsibility to Protect",
    year: "2001, 2005",
    school: "ICISS; World Summit",
    lineage: "Protection",
    referent: "Populations at risk of atrocity",
    thesis:
      "Sovereignty is a responsibility, not a shield. Where a state manifestly fails to protect its population, the obligation passes to the wider community.",
    agrees:
      "The relocation of obligation is accepted in full, and the doctrine holds a hard rule that a bond score never substitutes for a protection determination.",
    departs:
      "R2P relocates the obligation. Vinculum Security relocates the referent object, from the protected population to the bonds that make protection possible.",
    blindSpot:
      "It engages at the threshold of atrocity. The relational failures that carry a society toward that threshold fall outside what it is built to read.",
    ref: "Doctrine §II.F, §VI",
  },
  {
    id: "wps",
    name: "Women, Peace and Security",
    year: "2000",
    school: "UNSCR 1325",
    lineage: "Protection",
    referent: "Women and girls in conflict and peace processes",
    thesis:
      "Armed conflict affects women and girls disproportionately and distinctly, and their full and meaningful participation is essential to durable peace.",
    agrees:
      "WPS is treated as a direct sibling framework, and gendered harm is named explicitly in the bond map rather than folded into a general figure.",
    departs:
      "The doctrine adds a diagnostic supplement: whether a required activity strengthened a genuine bond, or only satisfied a procedural requirement.",
    blindSpot:
      "Compliance can be reported by headcount. Presence at a table is recorded while influence over the outcome remains at zero.",
    ref: "Doctrine §II.K",
  },
  {
    id: "yps",
    name: "Youth, Peace and Security",
    year: "2015",
    school: "UNSCR 2250",
    lineage: "Protection",
    referent: "Young people in conflict-affected societies",
    thesis:
      "Five pillars: participation, protection, prevention, partnerships, and disengagement and reintegration.",
    agrees:
      "This architecture is the doctrine's primary field of institutional application, and its participation pillar carries the intergenerational claim into policy.",
    departs:
      "Participation is tested against outcomes rather than attendance. The question is whether youth are at the table or only in the room.",
    blindSpot:
      "A youth advisory seat with no binding effect on the text satisfies the pillar and leaves the intergenerational bond exactly where it was.",
    ref: "Doctrine §II.G",
  },
  {
    id: "positive-peace",
    name: "Positive Peace",
    year: "1969 onward",
    school: "Galtung",
    lineage: "Relational",
    referent: "Social structures and institutions",
    thesis:
      "Peace is not only the absence of direct violence but the absence of structural violence built into social and institutional arrangements.",
    agrees:
      "Vinculum Security is offered as a relational specification of positive peace, not as a rival to it. Structural harm is accepted as real harm.",
    departs:
      "The bond is added as a distinct, nameable, scoreable unit. Structural-violence vocabulary describes the condition without operationalising it.",
    blindSpot:
      "Structure is diagnosed at the level of the system. The specific relationship that failed, between these parties, in this room, is not isolated.",
    ref: "Doctrine §II.E",
  },
  {
    id: "restorative",
    name: "Restorative Justice",
    year: "1990",
    school: "Zehr",
    lineage: "Relational",
    referent: "The relationship violated by harm",
    thesis:
      "Crime is a violation of people and relationships, not only an offence against the state's law. Justice is the repair of what was broken between them.",
    agrees:
      "This is a second, independent evidentiary anchor for the doctrine's claim that relationship, not only rule, is what harm destroys.",
    departs:
      "Restorative justice acts after a violation. Vinculum Security is diagnostic and prospective: it reads bond integrity before rupture and during negotiation.",
    blindSpot:
      "It requires an identified harm and an identified wrongdoer. A bond degrading through neglect offers neither.",
    ref: "Doctrine §II.I",
  },
  {
    id: "ubuntu",
    name: "Ubuntu Philosophy",
    year: "Menkiti 1984; Gyekye 1992",
    school: "African philosophy",
    lineage: "Relational",
    referent: "The person, constituted through community",
    thesis:
      "Umuntu ngumuntu ngabantu: a person is a person through other persons. Personhood is constituted relationally rather than held prior to relation.",
    agrees:
      "This is the doctrine's first ontological anchor, and the framework is deliberately built to survive either resolution of the Menkiti-Gyekye debate.",
    departs:
      "The doctrine carries the ontology into a security claim and a scoring method, which the tradition itself does not ask for.",
    blindSpot:
      "Scoring a relational philosophy on a one to five scale remains an unresolved tension, held open in the research agenda rather than declared settled.",
    ref: "Doctrine §II.B, §XI.3",
  },
  {
    id: "confucian",
    name: "Confucian Role Ethics",
    year: "2011",
    school: "Ames and Rosemont",
    lineage: "Relational",
    referent: "The person as a relationally constituted role-bearer",
    thesis:
      "A person is not a discrete autonomous individual but is constituted by the roles they live and the relations those roles carry.",
    agrees:
      "Arrived at independently, it corroborates the same ontology from an entirely separate civilizational tradition.",
    departs:
      "Role ethics is a moral philosophy. Vinculum Security converts the shared ontology into a diagnostic instrument for security practice.",
    blindSpot:
      "Read alone, it answers what a person is without telling a mediator which bond in the room is closest to breaking.",
    ref: "Doctrine §II.J",
  },
  {
    id: "agenda-2063",
    name: "Agenda 2063",
    year: "2015",
    school: "African Union, Aspirations 4 and 6",
    lineage: "Relational",
    referent: "The African continent and its peoples",
    thesis:
      "A peaceful and secure Africa, and people-driven development anchored in intergenerational dialogue and the potential of women and youth.",
    agrees:
      "It gives the intergenerational claim a continental policy anchor distinct from, and complementary to, the UN architecture.",
    departs:
      "Vinculum Security supplies the diagnostic layer the aspiration does not carry: a method for judging whether dialogue changed a bond.",
    blindSpot:
      "Aspiration sets direction without a measure. Progress can be declared without any test of what actually held.",
    ref: "Doctrine §II.H",
  },
];

const LINEAGES = ["Statecraft", "Protection", "Relational"] as const;

export default function ComparativeGenealogy() {
  const [activeId, setActiveId] = useState(TRADITIONS[3].id);
  const active = TRADITIONS.find((t) => t.id === activeId) ?? TRADITIONS[0];

  return (
    <section
      id="genealogy"
      aria-labelledby="genealogy-title"
      className="border border-brass/40 bg-navy-tint/30 p-5 md:p-8 mb-12"
    >
      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-accent mb-2">
        Section II · Comparative Genealogy
      </p>
      <h2 id="genealogy-title" className="font-serif text-primary text-2xl md:text-3xl leading-tight">
        Traditions in dialogue
      </h2>
      <hr className="gold-rule gold-rule-short mt-3 mb-4" />
      <p className="text-[0.95rem] leading-relaxed text-foreground/80 max-w-2xl">
        Choose a tradition to see where Vinculum Security agrees with it, where it parts from it, and
        what that tradition alone cannot read in the field. Nothing here is stored.
      </p>

      {/* Mobile selector */}
      <div className="mt-6 lg:hidden">
        <label
          htmlFor="tradition-menu"
          className="block text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2"
        >
          Tradition
        </label>
        <select
          id="tradition-menu"
          value={activeId}
          onChange={(e) => setActiveId(e.target.value)}
          className="w-full bg-card border border-brass/50 text-primary font-serif text-base px-3 py-3"
        >
          {LINEAGES.map((lin) => (
            <optgroup key={lin} label={lin}>
              {TRADITIONS.filter((t) => t.lineage === lin).map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} · {t.year}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[17rem_1fr] lg:items-start">
        {/* Desktop lineage list */}
        <nav aria-label="Traditions" className="hidden lg:block">
          {LINEAGES.map((lin) => (
            <div key={lin} className="mb-5">
              <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/60 mb-2">
                {lin}
              </p>
              <ul className="space-y-1">
                {TRADITIONS.filter((t) => t.lineage === lin).map((t) => {
                  const on = t.id === activeId;
                  return (
                    <li key={t.id}>
                      <button
                        type="button"
                        onClick={() => setActiveId(t.id)}
                        aria-current={on ? "true" : undefined}
                        className={`w-full text-left px-3 py-2 border transition-colors ${
                          on
                            ? "border-brass bg-gold-tint text-primary"
                            : "border-transparent hover:border-brass/40 text-foreground/80 hover:text-primary"
                        }`}
                      >
                        <span className="font-serif text-[0.98rem] leading-snug block">{t.name}</span>
                        <span className="text-[11px] text-foreground/55">{t.year}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Dialogue surface */}
        <div className="min-w-0">
          <div className="bg-card border border-border p-5 md:p-7">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h3 className="font-serif text-primary text-xl md:text-2xl leading-tight">
                {active.name}
              </h3>
              <span className="text-[11px] uppercase tracking-[0.18em] text-foreground/60">
                {active.year} · {active.school}
              </span>
            </div>
            <hr className="gold-rule gold-rule-short mt-3 mb-4" />
            <p className="text-[0.95rem] leading-relaxed text-foreground/85">{active.thesis}</p>

            {/* Referent objects, side by side */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="border border-border bg-background p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/60 mb-1.5">
                  Its referent object
                </p>
                <p className="font-serif text-primary text-base leading-snug">{active.referent}</p>
              </div>
              <div className="border border-brass/60 bg-gold-tint p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent mb-1.5">
                  Vinculum Security
                </p>
                <p className="font-serif text-primary text-base leading-snug">{VINCULUM_REFERENT}</p>
              </div>
            </div>

            <dl className="mt-6 space-y-5">
              <Exchange label="Where the doctrine agrees" body={active.agrees} />
              <Exchange label="Where the doctrine departs" body={active.departs} accent />
              <Exchange label="The diagnostic blind spot" body={active.blindSpot} />
            </dl>

            <p className="mt-6 pt-4 border-t border-brass/30 text-[11px] uppercase tracking-[0.18em] font-semibold text-primary/70">
              {active.ref}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function Exchange({ label, body, accent }: { label: string; body: string; accent?: boolean }) {
  return (
    <div className={`pl-4 border-l-2 ${accent ? "border-accent" : "border-brass/50"}`}>
      <dt className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-1.5">
        {label}
      </dt>
      <dd className="text-[0.95rem] leading-relaxed text-foreground/85">{body}</dd>
    </div>
  );
}
