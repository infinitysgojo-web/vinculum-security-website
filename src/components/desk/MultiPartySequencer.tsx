import { useMemo, useState } from "react";
import SyncPanel from "@/components/desk/SyncPanel";
import { telemetryLines, useEngine, usePublish, type Signals } from "@/components/desk/engine";
import DeskOutput, { field, label, panel } from "./DeskOutput";
import AsymmetryMatrix from "./AsymmetryMatrix";
import EscrowWaterfall from "./EscrowWaterfall";
import { logDecision } from "./ledgerStore";
import { DEFAULT_ESCROW, escrowWaterfall, type EscrowTerms, type EscrowInput, DEFAULT_RESOURCES, rebalance, resourceReading, RESOURCE_HEADS, COMMUNAL_FLOOR, LEGITIMACY_PENALTY } from "./instruments";
import { useTheatreSeed } from "./theatres";
import { theatreById } from "./theatres";
import { sphericalCentroid } from "./theatreGeodesy";
import { Button } from "@/components/ui/button";
import { questionLines } from "./questioning";

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

const BASE_ACTORS: Actor[] = [
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

/** Ignore stale or duplicate IDs, but never truncate available delegations. */
export function seatingSelection(ids: readonly string[], available: readonly string[]) {
  const roster = new Set(available);
  return [...new Set(ids)].filter((id) => roster.has(id));
}

/**
 * Radial seating: delegation i of N sits at θi = 2πi/N on the table's orbit,
 * measured clockwise from the head of the table (12 o'clock).
 */
export function radialSeat(i: number, n: number, cx: number, cy: number, r: number) {
  const theta = (2 * Math.PI * i) / Math.max(1, n);
  return { theta, x: cx + r * Math.sin(theta), y: cy - r * Math.cos(theta) };
}

type Fric = { a: string; b: string; text: string };

/**
 * Circular negotiation table: seated delegations on an orbit, with a chord
 * between every pair. Friction pairs glow as dashed terracotta cords carrying
 * the engine's friction multiplier (1 + 0.10 x friction pairs, from C_rel).
 */
function NegotiationTable({
  seated,
  frictions,
  multiplier,
  focusPair,
  onPick,
}: {
  seated: Actor[];
  frictions: Fric[];
  multiplier: number;
  focusPair: [string, string] | null;
  onPick: (pair: [string, string] | null) => void;
}) {
  const S = 280;
  const c = S / 2;
  const r = 92;
  const pos = seated.map((a, i) => {
    const { x, y } = radialSeat(i, seated.length, c, c, r);
    return { a, x, y };
  });
  const isFric = (x: string, y: string) => frictions.some((f) => (f.a === x && f.b === y) || (f.a === y && f.b === x));
  const pairs: { p: (typeof pos)[number]; q: (typeof pos)[number] }[] = [];
  pos.forEach((p, i) => pos.slice(i + 1).forEach((q) => pairs.push({ p, q })));
  const isFocus = (x: string, y: string) => !!focusPair && focusPair.includes(x) && focusPair.includes(y);
  const short = (s: string) => (s.length > 18 ? `${s.slice(0, 17)}…` : s);
  return (
    <div className="border border-brass/40 bg-background p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className={`${label} mb-0`}>Negotiation table · tension web</p>
        {focusPair && (
          <Button variant="ghost" type="button" onClick={() => onPick(null)} className="text-[10px] uppercase tracking-[0.16em] font-semibold text-accent hover:underline">
            Show all pairs
          </Button>
        )}
      </div>
      <div className="w-full overflow-x-auto"><svg viewBox={`0 0 ${S} ${S}`} className={`mx-auto mt-2 h-auto ${seated.length > 6 ? "w-[520px] max-w-none" : "w-full max-w-[300px]"}`} role="group" aria-label="Seated delegations and the cords between them">
        <circle cx={c} cy={c} r={r} fill="hsl(var(--navy-tint) / 0.5)" stroke="hsl(var(--brass) / 0.6)" strokeDasharray="2 4" />
        {pairs.map(({ p, q }) => {
          const fric = isFric(p.a.id, q.a.id);
          const dim = focusPair && !isFocus(p.a.id, q.a.id);
          const mx = (p.x + q.x) / 2;
          const my = (p.y + q.y) / 2;
          return (
            <g
              key={`${p.a.id}-${q.a.id}`}
              role="button"
              tabIndex={0}
              aria-label={`${p.a.label} and ${q.a.label}${fric ? ", friction pair" : ", synchronised"}`}
              onClick={() => onPick(isFocus(p.a.id, q.a.id) ? null : [p.a.id, q.a.id])}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPick(isFocus(p.a.id, q.a.id) ? null : [p.a.id, q.a.id]);
                }
              }}
              className="cursor-pointer outline-none"
              style={{ opacity: dim ? 0.25 : 1, transition: "opacity 200ms" }}
            >
              <line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke="transparent" strokeWidth="14" />
              <line
                x1={p.x} y1={p.y} x2={q.x} y2={q.y}
                stroke={fric ? "hsl(var(--terracotta))" : "hsl(var(--brass))"}
                strokeWidth={fric ? 2.4 : 1.6}
                strokeDasharray={fric ? "6 4" : undefined}
                style={fric ? { filter: "drop-shadow(0 0 3px hsl(var(--terracotta) / 0.8))" } : undefined}
              />
              {fric && (
                <text x={mx} y={my - 4} textAnchor="middle" className="fill-terracotta" style={{ fontSize: 9, fontWeight: 700 }}>
                  ×{multiplier.toFixed(2)}
                </text>
              )}
            </g>
          );
        })}
        {pos.map(({ a, x, y }) => (
          <g key={a.id}>
            <circle cx={x} cy={y} r="13" fill="hsl(var(--primary))" stroke="hsl(var(--brass))" strokeWidth="2" />
            <text x={x} y={y + 3.5} textAnchor="middle" className="fill-primary-foreground" style={{ fontSize: 9, fontWeight: 700 }}>
              {a.label.charAt(0).toUpperCase()}
            </text>
            <text x={x} y={y > c ? y + 26 : y - 19} textAnchor="middle" className="fill-primary" style={{ fontSize: 8.5, fontWeight: 600 }}>
              {short(a.label)}
            </text>
          </g>
        ))}
      </svg></div>
      <p className="mt-2 text-[10px] text-muted-foreground">
        Brass cords are synchronised pairs; dashed terracotta cords are friction pairs, marked with the engine's friction multiplier. Select a cord to read the de-confliction script for that pair.
      </p>
    </div>
  );
}

/**
 * Inscribed stakeholders enter the asymmetry matrix with a derived tolerance vector:
 * every bond at 3.0 + 0.25 × (leverage − vulnerability), and a veto holder adds 1.0
 * on the live limiting bond. Clamped to 1.0 to 5.0.
 */
function inscribedParties(s: Signals) {
  const BN = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"];
  const lim = Math.max(0, BN.indexOf(s.weakestBond ?? ""));
  return (s.customParties ?? []).map((p) => {
    const base = 3 + 0.25 * (p.leverage - p.vulnerability);
    const tol = BN.map((_, i) => Math.min(5, Math.max(1, Math.round((base + (p.vetoPower && i === lim ? 1 : 0)) * 10) / 10)));
    return { id: `custom-${p.id}`, label: p.name, bond: lim, tol, custom: true };
  });
}

export default function MultiPartySequencer({ initialPicked = ["state", "youth", "armed"] }: { /** Delegations seated on first render; theatre presets still seed over it. */ initialPicked?: string[] } = {}) {
  const [own, setOwn] = useState<Actor[]>([]);
  const [ownFric, setOwnFric] = useState<{ a: string; b: string; text: string }[]>([]);
  const [nl, setNl] = useState(""); const [nb, setNb] = useState(1); const [nc, setNc] = useState(""); const [nf, setNf] = useState("");
  const ACTORS = useMemo(() => [...BASE_ACTORS, ...own], [own]);
  const [draftQuestions, setDraftQuestions] = useState<[string, string, string, string]>(["", "", "", ""]);
  const addParty = () => {
    if (!nl.trim()) return;
    const name = nl.trim();
    const id = `own-${Date.now()}`;
    setOwn((p) => [...p, {
      id, label: name, bond: nb,
      opening: draftQuestions[0].trim() || `Open by naming what ${name} stands to lose if the bond fails, before any proposal is tabled.`,
      probing: draftQuestions[1].trim() || `Ask ${name} which commitment it could keep if its own leadership changed tomorrow.`,
      commitment: draftQuestions[2].trim() || `Record one verifiable step ${name} will take before the next session.`,
      close: draftQuestions[3].trim() || `Close by reading back ${name}'s commitment in its own words.`,
      caution: nc.trim() || `Analyst-defined party; confirm its standing with the community before seating.`,
    }]);
    if (nf) setOwnFric((p) => [...p, { a: id, b: nf, text: `Analyst-recorded friction between ${name} and ${ACTORS.find((x) => x.id === nf)?.label ?? "the named party"}. Seat them in separate opening sessions.` }]);
    setPicked((p) => [...p, id]);
    setNl(""); setNc(""); setNf("");
    setDraftQuestions(["", "", "", ""]);
  };
  const [theatre, setTheatre] = useState("");
  const [picked, setPicked] = useState<string[]>(() => seatingSelection(initialPicked, BASE_ACTORS.map((actor) => actor.id)));
  useTheatreSeed("multiparty", (x) => setPicked(seatingSelection(x.picked, BASE_ACTORS.map((actor) => actor.id))));

  const toggle = (id: string) => {
    setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  };

  const seated = picked.map((id) => ACTORS.find((a) => a.id === id)).filter((actor): actor is Actor => actor !== undefined);

  const frictions = useMemo(
    () => [...FRICTION, ...ownFric].filter((f) => picked.includes(f.a) && picked.includes(f.b)),
    [picked, ownFric]
  );

  const bondGaps = useMemo(() => {
    const covered = new Set(seated.map((a) => a.bond));
    return BONDS.filter((_, i) => !covered.has(i));
  }, [seated]);

  const { signals } = useEngine();
  const [linked, setLinked] = useState(true);
  const [focusPair, setFocusPair] = useState<[string, string] | null>(null);
  const pairOk = focusPair && picked.includes(focusPair[0]) && picked.includes(focusPair[1]) ? focusPair : null;
  const shownFrictions = pairOk ? frictions.filter((f) => pairOk.includes(f.a) && pairOk.includes(f.b)) : frictions;
  // Friction term of the engine's contagion coefficient: 1 + 0.10 per friction pair on the bus.
  const fricMultiplier = 1 + 0.1 * (linked ? signals.frictionPairs?.length ?? frictions.length : frictions.length);
  const [escrowTerms, setEscrowTerms] = useState<EscrowTerms>(DEFAULT_ESCROW);
  const escrowInput: EscrowInput = {
    verifierSeated: signals.verifierSeated,
    communal: signals.bonds?.communal,
    institutional: signals.bonds?.institutional,
    intergenerational: signals.bonds?.intergenerational,
    trackGap: signals.trackGap,
    trackTolerance: signals.trackTolerance,
    survivalScore: signals.survivalScore,
    rupture: linked ? signals.rupture : 0,
  };
  const escrow = escrowWaterfall(escrowTerms, escrowInput);
  // Changes to the tranche schedule, clawback or performance bond are decisions on the Decision Log.
  const amendEscrow = (t: EscrowTerms) => {
    const fmt = (x: EscrowTerms) => `tranches ${x.shares.join("/")}%, clawback ${x.clawback}%, bond ${x.bond}%`;
    if (JSON.stringify(t) !== JSON.stringify(escrowTerms)) logDecision("07", "ESCROW_TERMS", `Escrow terms ${fmt(escrowTerms)} -> ${fmt(t)}`);
    setEscrowTerms(t);
  };
  const [resources, setResources] = useState<[number, number, number]>(DEFAULT_RESOURCES);
  const res = resourceReading(resources);
  usePublish("multiparty", {
    resourceCommunalShare: resources[0],
    resourceParity: res.parity,
    legitimacyDeficit: res.deficit,
    escrowReleasedPercent: escrow.released,
    escrowFrozen: escrow.frozen,
    escrowTranchesMet: escrow.tranches.filter((t) => t.met).length,
    seatedParties: seated.length,
    frictionPairs: frictions.map((f) => `${ACTORS.find((a) => a.id === f.a)?.label} and ${ACTORS.find((a) => a.id === f.b)?.label}`),
  });
  const spoiler =
    linked && frictions.length >= 2 && ((signals.rupture ?? 0) >= 35 || signals.elitePactAlert)
      ? `Spoiler coalition risk: ${frictions.length} friction pairs at the table while the mission reading is under strain. Seat the frictional parties in separate opening sessions.`
      : "";
  const text = useMemo(() => {
    const L: string[] = [];
    L.push("MULTI-PARTY SEQUENCING AND DE-CONFLICTION MATRIX");
    L.push(`RESOURCE COVENANT: ${RESOURCE_HEADS.map((h, i) => `${h} ${resources[i]}%`).join(", ")}; parity ${res.parity}${res.deficit ? "; LEGITIMACY DEFICIT" : ""}`);
    L.push("Vinculum Security, Diplomatic Engagement Division");
    L.push("");
    L.push(`TABLE: ${theatre.trim() || "Unnamed table"}`);
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
        questionLines(q).forEach((line, i) => L.push(`   ${a.label} · ${i + 1}: "${line}"`));
      });
      L.push("");
    });
    L.push("III. CROSS-PARTY FRICTION LEDGER");
    L.push("");
    if (!frictions.length) {
      L.push("No recorded friction between the parties as seated. Re-run this ledger if the seating changes.");
    } else {
      frictions.forEach((f, i) => {
        const an = ACTORS.find((x) => x.id === f.a)?.label ?? "Unseated party";
        const bn = ACTORS.find((x) => x.id === f.b)?.label ?? "Unseated party";
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
    if (spoiler) L.push(spoiler, "");
    if (linked) L.push(...telemetryLines(signals));
    L.push("END OF MATRIX");
    L.push("", `CONDITIONAL ESCROW: ${escrow.frozen ? "FROZEN (rupture at or above 60%)" : `${escrow.released}% of ${escrow.total}% released; clawback ${escrowTerms.clawback}% and performance bond ${escrowTerms.bond}% ${escrow.ceded ? "discharged at Final Cession" : "held until Final Cession"}`}`);
    escrow.tranches.forEach((t) => L.push(`  [${t.met ? "x" : " "}] ${t.label} (${t.share}%): ${t.condition}`));
    return L.join("\n");
  }, [theatre, seated, frictions, bondGaps, spoiler, linked, signals, escrow, escrowTerms, resources, res, ACTORS]);

  return (
    <div className="w-full min-w-0">
    <div className="instrument-pair w-full min-w-0">
      <div className="instrument-wide min-w-0">
        <div className={panel}>
          <label className={label} htmlFor="mp-theatre">Table or theatre</label>
          <input
            id="mp-theatre"
            className={field}
            value={theatre}
            onChange={(e) => setTheatre(e.target.value)}
            placeholder="Transitional Security Committee, second round"
          />
          <p className={`${label} mt-5`}>Seat delegations</p>
          <div className="flex flex-wrap gap-2">
            {ACTORS.map((a) => {
              const on = picked.includes(a.id);
              return (
                <Button variant="ghost"
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(a.id)}
                  className={`min-h-11 px-3 py-2 border text-[10px] font-semibold uppercase tracking-[0.16em] transition-all ${
                    on
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
                  }`}
                >
                  {a.label}
                </Button>
              );
            })}
          </div>
          <div className="mt-5 border-t border-brass/30 pt-4 instrument-pair">
            <p className={`${label} instrument-wide`}>Custom mode: seat your own party</p>
            <input aria-label="Custom delegation name" className={field} value={nl} onChange={(e) => setNl(e.target.value)} placeholder="e.g. Diaspora remittance network" />
            <textarea rows={3} aria-label="Custom delegation caution" className={field} value={nc} onChange={(e) => setNc(e.target.value)} placeholder="Caution to carry into the room (optional)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select className={field} value={nb} onChange={(e) => setNb(Number(e.target.value))} aria-label="Bond it carries">
                {BONDS.map((b, i) => <option key={b} value={i}>Carries: {b}</option>)}
              </select>
              <select className={field} value={nf} onChange={(e) => setNf(e.target.value)} aria-label="Friction with">
                <option value="">No known friction</option>
                {ACTORS.map((a) => <option key={a.id} value={a.id}>Friction with: {a.label}</option>)}
              </select>
            </div>
            {PHASES.map((phase, i) => <label key={phase} className="block"><span className={label}>{phase} questions</span><textarea rows={3} aria-label={`Custom delegation ${phase.toLowerCase()} questions`} className={`${field} resize-y`} value={draftQuestions[i]} onChange={(e) => setDraftQuestions((previous) => previous.map((value, j) => i === j ? e.target.value : value) as [string, string, string, string])} placeholder={`${phase}: one question per line (optional)`} /></label>)}
            <Button variant="ghost" type="button" disabled={!nl.trim()} onClick={addParty}
              className="min-h-11 w-full border border-brass/50 text-[10px] uppercase tracking-[0.16em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-40">Add party</Button>
          </div>
        </div>

      </div>

      <div className="contents">
        <div className="instrument-wide"><SyncPanel linked={linked} onToggle={setLinked} summary={() => [spoiler || `${frictions.length} friction pair(s) at the table; no spoiler coalition flagged by the live reading.`]} /></div>
        {seated.length >= 2 && (
          <NegotiationTable seated={seated} frictions={frictions} multiplier={fricMultiplier} focusPair={pairOk} onPick={setFocusPair} />
        )}
        <div className={`mt-4 border bg-background p-4 min-w-0 ${res.deficit ? "border-terracotta/60" : "border-brass/40"}`}>
          <span className={label}>Resource-sharing covenant · allocation of proceeds</span>
          {RESOURCE_HEADS.map((h, i) => (
            <label key={h} className="mt-2 flex items-center gap-3 text-xs">
              <span className="flex-1 min-w-0 text-primary">{h}{i === 0 && <span className="block text-muted-foreground">Statutory minimum {COMMUNAL_FLOOR}%</span>}</span>
              <input type="range" min={0} max={100} value={resources[i]} onChange={(e) => setResources(rebalance(resources, i, Number(e.target.value)))} aria-label={`${h} share in per cent`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={resources[i]} className="w-28 accent-[hsl(var(--accent))]" />
              <span className="w-10 text-right font-mono tabular-nums">{resources[i]}%</span>
            </label>
          ))}
          <div
            role="meter"
            aria-label="Resource parity index"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={res.parity}
            aria-valuetext={`Parity index ${res.parity} of 100`}
            className="mt-3 flex items-center justify-between text-xs text-muted-foreground"
          >
            <span>Parity index {res.parity} of 100 = 100 − 1.5 × (largest − smallest share)</span>
            <span className="font-mono tabular-nums text-foreground/85">{res.parity}/100</span>
          </div>
          <div className="mt-1.5 h-1 w-full overflow-hidden bg-brass/20">
            <div
              className={`h-full transition-all duration-300 ${res.deficit ? "bg-terracotta" : "bg-brass"}`}
              style={{ width: `${Math.max(0, Math.min(100, res.parity))}%` }}
            />
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground">Total {res.total}%. {res.deficit ? "Under statutory threshold." : "Allocation balanced."}</p>
          {res.deficit && <p role="alert" className="mt-1 text-[10px] uppercase tracking-[0.16em] font-semibold text-terracotta">[Legitimacy deficit] Communal share under {COMMUNAL_FLOOR}%; +{LEGITIMACY_PENALTY} strain on the Compound Shock desk</p>}
        </div>
      </div>
    </div>

      <div className="mt-6 w-full min-w-0">
        <EscrowWaterfall reading={escrow} terms={escrowTerms} onTerms={amendEscrow} input={escrowInput} />
      </div>

      {/* Seated delegations: in a responsive grid, each at its radial seat 2πi/N. */}
      {seated.length > 0 && (
        <div className="mt-6 w-full min-w-0" data-testid="seated-delegations">
          <p className={label}>
            Seated delegations · {seated.length} · {frictions.length} of {(seated.length * (seated.length - 1)) / 2} bilateral pair{seated.length * (seated.length - 1) === 2 ? "" : "s"} with recorded friction
          </p>
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {seated.map((a, i) => {
              const deg = Math.round((radialSeat(i, seated.length, 0, 0, 1).theta * 180) / Math.PI);
              const pairs = frictions.filter((f) => f.a === a.id || f.b === a.id).length;
              return (
                <li key={a.id} className="min-w-0 border border-brass/40 bg-card/60 p-3">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="min-w-0 text-xs font-semibold text-primary [overflow-wrap:anywhere]">{a.label}</span>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">Seat {i + 1} · {deg}°</span>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">Carries: {BONDS[a.bond]} · {pairs} friction pair{pairs === 1 ? "" : "s"}</p>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-foreground/80 [overflow-wrap:anywhere]">{a.caution}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
      
      {/* Multilateral Diplomatic Barycentre */}
      {(() => {
        const theatre = theatreById(signals.presetId);
        if (!theatre?.coords) return null;
        // Distribute seated parties in relation to the active theatre anchor
        const points = seated.map((s, idx) => ({
          lat: theatre.coords.lat + (idx % 2 === 0 ? 0.8 : -0.8) * Math.sin((idx + 1) * 1.2),
          lng: theatre.coords.lng + (idx % 2 === 0 ? 1.1 : -1.1) * Math.cos((idx + 1) * 1.2),
          weight: s.bond + 1,
        }));
        const bary = sphericalCentroid(points);
        if (!bary) return null;
        return (
          <div className="mt-4 p-3 border border-brass/40 bg-background/50 font-mono text-xs flex flex-wrap items-center justify-between gap-3">
            <span className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground font-semibold">
              Diplomatic Barycentre ({theatre.sigil})
            </span>
            <span className="text-foreground font-medium">
              {bary.lat > 0 ? `${bary.lat}°N` : `${Math.abs(bary.lat)}°S`}, {bary.lng > 0 ? `${bary.lng}°E` : `${Math.abs(bary.lng)}°W`}
            </span>
            <span className="text-[11px] text-muted-foreground">
              ±{bary.dispersionNm} NM delegation dispersion
            </span>
          </div>
        );
      })()}
      
      {/* Tier 2: the asymmetry and leverage matrix needs the full width to read. */}
      <div className="mt-6 w-full min-w-0">
        <AsymmetryMatrix
          parties={[
            ...seated.map((a) => ({ id: a.id, label: a.label, bond: a.bond })),
            ...inscribedParties(signals),
          ]}
        />
      </div>

      <div className="mt-8 instrument-layout w-full min-w-0">
        {seated.length > 0 && (
          <div className="border border-accent/50 bg-background p-5">
            <p className={label}>De-confliction script · {(pairOk ?? picked).map((id) => ACTORS.find((x) => x.id === id)?.label).join(" / ")}</p>
            {PHASES.map((ph, pi) => (
              <div key={ph} className="mt-3">
                <p className="text-[10px] uppercase tracking-[0.16em] font-semibold text-accent">Phase {pi + 1} · {ph}</p>
                {(pairOk ?? picked).map((id) => {
                  const a = ACTORS.find((x) => x.id === id);
                  if (!a) return null;
                  return (
                    <div key={id} className="mt-2 text-xs text-foreground/85 [overflow-wrap:anywhere]">
                      <span className="font-semibold text-primary">{a.label}</span>
                      <ol className="mt-1 list-decimal pl-5 space-y-1">{questionLines([a.opening, a.probing, a.commitment, a.close][pi]).map((q, i) => <li key={i}>{q}</li>)}</ol>
                    </div>
                  );
                })}
              </div>
            ))}
            {pairOk && shownFrictions.length === 0 && (
              <p className="mt-3 text-xs text-muted-foreground">No recorded friction between this pair; the cord is synchronised.</p>
            )}
          </div>
        )}

        <div className="border border-brass/40 p-5">
          <p className={label}>Friction detected{pairOk ? " · selected pair" : ""}</p>
          {shownFrictions.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              No recorded friction between these parties. Seat another party to test the table further.
            </p>
          ) : (
            <ul className="space-y-3">
              {shownFrictions.map((f, i) => (
                <li key={i} className="text-xs leading-relaxed">
                  <span className="text-accent font-semibold uppercase tracking-[0.16em] text-[10px] block mb-1">
                    {ACTORS.find((x) => x.id === f.a)?.label ?? "Unseated party"} / {ACTORS.find((x) => x.id === f.b)?.label ?? "Unseated party"}
                  </span>
                  <span className="text-muted-foreground">{f.text}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-8 w-full min-w-0">
        <DeskOutput text={text} fileName="Vinculum-Multi-Party-Matrix" />
      </div>
    </div>
  );
}
