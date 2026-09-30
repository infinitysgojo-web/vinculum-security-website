import { useMemo, useState } from "react";
import DeskOutput, { field, label, panel, todayStamp } from "./DeskOutput";

type Actor = {
  id: string;
  label: string;
  bond: number;
  opening: string;
  probing: string;
  commitment: string;
  close: string;
  caution: string;
};

const BONDS = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"];

const ACTORS: Actor[] = [
  {
    id: "state",
    label: "State executive",
    bond: 3,
    opening: "Which office, rather than which person, will hold this commitment in twelve months?",
    probing: "What has the state conceded so far that it did not intend to concede?",
    commitment: "Will the undertaking be published in the same words it is given here?",
    close: "Who verifies performance, and what happens on the day verification fails?",
    caution: "Subject to the non-self-assessment rule. The state's account of its own compliance is a low institutional signal, not evidence.",
  },
  {
    id: "armed",
    label: "Armed faction",
    bond: 0,
    opening: "What would have to happen for this table to be worth more to you than the field?",
    probing: "Which of your commanders can you not deliver, and why?",
    commitment: "What do your people receive on the first day, not the first year?",
    close: "If you are removed tomorrow, does this hold?",
    caution: "Commitments here rest on a named principal. Treat every undertaking as personal until an institutional anchor is written in.",
  },
  {
    id: "youth",
    label: "Youth coalition",
    bond: 2,
    opening: "Were you invited to decide, or invited to attend?",
    probing: "What has been settled already that you were never asked about?",
    commitment: "What seat, with what vote, do you hold in the body this creates?",
    close: "What would tell you in a year that this was real?",
    caution: "Observer status is the Generational Cliff in procedural form. A seat without a vote is refusal recorded politely.",
  },
  {
    id: "elders",
    label: "Traditional or religious elders",
    bond: 1,
    opening: "Whose standing in this community does this arrangement rest on?",
    probing: "What would your community say about this if we were not in the room?",
    commitment: "What will you be able to tell them you secured?",
    close: "Does your authority to hold this survive contact with the community?",
    caution: "Gradational evidentiary weight applies. Standing granted by the table is not standing granted by the community.",
  },
  {
    id: "civil",
    label: "Civil society and verifiers",
    bond: 3,
    opening: "What are you able to verify independently, and what are you being asked to certify blind?",
    probing: "Where has the record diverged from what you observed?",
    commitment: "What access do you need written into the text to do this honestly?",
    close: "What will you refuse to sign?",
    caution: "Do not convert independent verifiers into parties. A verifier with a stake in the outcome is no longer a verifier.",
  },
  {
    id: "donor",
    label: "Donor or funding body",
    bond: 3,
    opening: "What survives here on the day the funding line closes?",
    probing: "Which of these commitments exist only because you are paying for them?",
    commitment: "What is the handover date, and to which domestic office?",
    close: "Will you publish the wind-down schedule now rather than at the end?",
    caution: "Donor withdrawal is the most commonly modelled shock and the least commonly drafted for.",
  },
  {
    id: "spoiler",
    label: "Spoiler or hold-out",
    bond: 0,
    opening: "What is being taken from you by this arrangement?",
    probing: "What would you accept that you have not been offered?",
    commitment: "What can you commit to that does not require you to endorse the rest?",
    close: "What is the cost to you of staying outside?",
    caution: "Do not buy silence. An unpriced hold-out returns at the verification stage with leverage.",
  },
  {
    id: "guarantor",
    label: "External guarantor state",
    bond: 3,
    opening: "What are you guaranteeing, in words you would repeat publicly?",
    probing: "What would cause you to step back, and who would be told?",
    commitment: "Does your guarantee bind your office or your current government?",
    close: "What is your obligation on the day a party defects?",
    caution: "A guarantee that changes with the guarantor's domestic politics is a comfort letter, not a guarantee.",
  },
];

/** Deterministic friction rules between pairs of actors seated at one table. */
const FRICTION: { a: string; b: string; text: string }[] = [
  {
    a: "state",
    b: "youth",
    text: "State-led sequencing tends to settle structure before the youth coalition is seated. Seat youth before the Commitment phase or the settlement is an elite pact with a youth annex.",
  },
  {
    a: "armed",
    b: "youth",
    text: "Immunity or integration offers to the armed faction at the Opening phase reliably trigger a communal and youth walkout. Hold amnesty language until after the youth commitment is secured.",
  },
  {
    a: "state",
    b: "civil",
    text: "The state will seek to define the verification scope. Fix the verifier's access in the Probing phase, before the state has an interest in narrowing it.",
  },
  {
    a: "armed",
    b: "elders",
    text: "Elders asked to vouch for an armed faction spend standing they cannot replace. Do not route legitimacy for the faction through elder endorsement.",
  },
  {
    a: "donor",
    b: "state",
    text: "Donor presence inflates state commitment at the Commitment phase and deflates it at handover. Test every state undertaking against the post-funding question before closing.",
  },
  {
    a: "spoiler",
    b: "guarantor",
    text: "A guarantor engaging the hold-out directly undercuts the table. Route hold-out contact through the mediating desk and report it at the Close.",
  },
  {
    a: "elders",
    b: "youth",
    text: "Elder authority and youth claim are treated as one communal voice at most tables. Separate the two sessions; a joint session silences the successor generation.",
  },
  {
    a: "civil",
    b: "donor",
    text: "Verifiers funded by the donor cannot audit the donor's own programme. Declare the funding relationship in the record before verification begins.",
  },
];

const PHASES = ["Opening", "Probing", "Commitment", "Close"] as const;

export default function MultiPartySequencer() {
  const [theatre, setTheatre] = useState("");
  const [picked, setPicked] = useState<string[]>(["state", "youth", "armed"]);

  const toggle = (id: string) =>
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 4 ? p : [...p, id]));

  const seated = picked.map((id) => ACTORS.find((a) => a.id === id)!).filter(Boolean);

  const frictions = useMemo(
    () => FRICTION.filter((f) => picked.includes(f.a) && picked.includes(f.b)),
    [picked]
  );

  const bondGaps = useMemo(() => {
    const covered = new Set(seated.map((a) => a.bond));
    return BONDS.filter((_, i) => !covered.has(i));
  }, [seated]);

  const text = useMemo(() => {
    const L: string[] = [];
    L.push("MULTI-PARTY SEQUENCING AND DE-CONFLICTION MATRIX");
    L.push("Vinculum Security, Diplomatic Engagement Division");
    L.push("");
    L.push(`TABLE: ${theatre.trim() || "Unnamed table"}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push(`PARTIES SEATED: ${seated.length}`);
    L.push("");
    L.push("I. SEATING AND STANDING CAUTIONS");
    L.push("");
    seated.forEach((a, i) => {
      L.push(`${i + 1}. ${a.label.toUpperCase()}  [primary bond: ${BONDS[a.bond]}]`);
      L.push(`   Caution: ${a.caution}`);
      L.push("");
    });
    L.push("II. SYNCHRONISED FOUR-PHASE TIMETABLE");
    L.push("");
    PHASES.forEach((p, pi) => {
      L.push(`PHASE ${pi + 1}. ${p.toUpperCase()}`);
      seated.forEach((a) => {
        const q = [a.opening, a.probing, a.commitment, a.close][pi];
        L.push(`   ${a.label}: "${q}"`);
      });
      L.push("");
    });
    L.push("III. CROSS-PARTY FRICTION LEDGER");
    L.push("");
    if (!frictions.length) {
      L.push("No recorded friction between the parties as seated. Re-run this ledger if the seating changes.");
    } else {
      frictions.forEach((f, i) => {
        const an = ACTORS.find((x) => x.id === f.a)!.label;
        const bn = ACTORS.find((x) => x.id === f.b)!.label;
        L.push(`${i + 1}. ${an} / ${bn}`);
        L.push(`   ${f.text}`);
        L.push("");
      });
    }
    L.push("IV. CONTINUUM COVERAGE");
    L.push("");
    if (!bondGaps.length) {
      L.push("All four levels of the continuum have a party at the table.");
    } else {
      L.push(`No party at this table carries the following level or levels: ${bondGaps.join("; ")}.`);
      L.push(
        "An unrepresented level is not a neutral absence. Record who speaks for it, or record that nobody does."
      );
    }
    L.push("");
    L.push("END OF MATRIX");
    return L.join("\n");
  }, [theatre, seated, frictions, bondGaps]);

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="space-y-6">
        <div className={panel}>
          <label className={label} htmlFor="mp-theatre">Table or theatre</label>
          <input
            id="mp-theatre"
            className={field}
            value={theatre}
            onChange={(e) => setTheatre(e.target.value)}
            placeholder="Transitional Security Committee, second round"
          />
          <p className={`${label} mt-5`}>Seat up to four parties</p>
          <div className="flex flex-wrap gap-2">
            {ACTORS.map((a) => {
              const on = picked.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  disabled={!on && picked.length >= 4}
                  onClick={() => toggle(a.id)}
                  className={`min-h-11 px-3 py-2 border text-[10px] font-semibold uppercase tracking-[0.16em] transition-all disabled:opacity-40 ${
                    on
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
                  }`}
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="border border-brass/40 p-5">
          <p className={label}>Friction detected</p>
          {frictions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No recorded friction between these parties. Seat another party to test the table further.
            </p>
          ) : (
            <ul className="space-y-3">
              {frictions.map((f, i) => (
                <li key={i} className="text-xs leading-relaxed">
                  <span className="text-terracotta font-semibold uppercase tracking-[0.16em] text-[10px] block mb-1">
                    {ACTORS.find((x) => x.id === f.a)!.label} / {ACTORS.find((x) => x.id === f.b)!.label}
                  </span>
                  <span className="text-muted-foreground">{f.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <DeskOutput text={text} fileName="Vinculum-Multi-Party-Matrix" />
    </div>
  );
}
