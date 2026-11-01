import { useEffect, useState } from "react";
import { ChevronDown, ArrowUpRight } from "lucide-react";
import {
  alerts, hasSignal, relationalDynamics, successionDurability, dominumIndex, breachesFloor,
  BOND_NAMES, VIABLE_FLOOR, type Alert, type Signals,
} from "./engine";
import { Lex } from "./Lexicon";
import { Button } from "@/components/ui/button";

/** Telemetry labels that carry a lexicon definition. */
const LEX_FOR: Record<string, string> = { "Limiting bond": "liebig", "Rupture index": "rupture", "Track gap": "track-divergence", "Relational deficit": "deficit", "Contagion": "contagion", "Entropy": "entropy", "Decay": "decay" };

/** The bond domain an alert bears on, read from the alert itself or the live bus. */
function domainOf(a: Alert, s: Signals): string {
  const named = (BOND_NAMES as readonly string[]).find((d) => a.name.includes(d) || a.reading.includes(d.toLowerCase()));
  if (named) return named;
  if (/elite-pact/i.test(a.name)) return "Communal";
  return s.weakestBond ?? "All four bonds";
}

type Status = "breach" | "hold" | "reading" | "pending";
type Law = { name: string; reading: string; status: Status; principle: string; desk: string; deskLabel: string };
type Pillar = { title: string; laws: Law[] };

/**
 * The governing relational laws, each read strictly from the bus or the engine's own functions.
 * A status is only asserted where the engine itself defines a threshold; otherwise the law shows its reading.
 */
export function governingLaws(s: Signals): Pillar[] {
  const dyn = relationalDynamics(s);
  const suc = successionDurability(s);
  const dom = dominumIndex(s);
  const pend = (d: string): Pick<Law, "reading" | "status"> => ({ reading: `Awaiting ${d}`, status: "pending" });
  const law = (name: string, desk: string, deskLabel: string, principle: string, r: Pick<Law, "reading" | "status">): Law => ({ name, desk, deskLabel, principle, ...r });

  return [
    {
      title: "I · Bond foundation and transmission",
      laws: [
        law("Viable Floor", "diagnostics", "Desk 01", "No settlement holds while any bond sits at or below the floor; strength elsewhere cannot compensate.",
          s.weakestScore === undefined ? pend("Desk 01") : { reading: `Lowest bond ${s.weakestScore.toFixed(1)} against floor ${VIABLE_FLOOR.toFixed(1)}`, status: breachesFloor(s.weakestScore) ? "breach" : "hold" }),
        law("Liebig Limiting Factor", "diagnostics", "Desk 01", "The weakest bond, not the average, sets the ceiling on what the whole relationship can carry.",
          !s.weakestBond ? pend("Desk 01") : { reading: `${s.weakestBond}${s.weakestBand ? ` · ${s.weakestBand}` : ""}`, status: "reading" }),
        law("Relational Contagion", "diagnostics", "Desk 01", "Damage to one bond transmits into the others; an isolated fracture rarely stays isolated.",
          !dyn ? pend("Desk 01") : { reading: `${dyn.contagion}% transmission · ${dyn.bondsInDeficit} of 4 bonds in deficit`, status: dyn.bondsInDeficit ? "breach" : "hold" }),
        law("Relational Entropy and Decay Horizon", "succession", "Desk 12", "Unattended relationships lose order over time; the horizon names how long stability lasts without repair.",
          !dyn ? pend("Desk 01") : { reading: `${dyn.character} decay${s.stabilityHalfLifeDays ? ` · half-life ${Math.round(s.stabilityHalfLifeDays)} days` : ""}`, status: "reading" }),
      ],
    },
    {
      title: "II · Kinetic and shear dynamics",
      laws: [
        law("Rupture Index and Shock Radius", "sentinel", "Desk 02", "Observed warning signs, inscribed load and trend combine into the nearness of open rupture.",
          s.rupture === undefined ? pend("Desk 02") : { reading: `${s.rupture}%${s.ruptureBand ? ` · ${s.ruptureBand}` : ""}`, status: "reading" }),
        law("Compound Stress", "compound", "Desk 03", "Simultaneous shocks compound rather than add; the first bond to break decides the sequence.",
          !s.shocks?.length ? pend("Desk 03") : { reading: `${s.shocks.length} shock${s.shocks.length === 1 ? "" : "s"}${s.firstToBreak ? ` · first to break: ${s.firstToBreak}` : ""}`, status: s.firstToBreak ? "breach" : "reading" }),
        law("Track Divergence and Structural Shear", "tracks", "Desk 08", "When the elite track outruns the communal track beyond tolerance, the agreement shears.",
          s.trackGap === undefined ? pend("Desk 08") : { reading: `Gap ${s.trackGap}${s.trackTolerance !== undefined ? ` · tolerance ${s.trackTolerance}` : ""}`, status: s.trackTolerance !== undefined ? (s.trackGap > s.trackTolerance ? "breach" : "hold") : "reading" }),
        law("Elite-Pact Mirage", "tracks", "Desk 08", "An accord signed above the communities it governs looks like peace and behaves like a ceasefire.",
          s.elitePactAlert === undefined ? pend("Desk 08") : { reading: s.elitePactAlert ? "Mirage condition present" : "Not present", status: s.elitePactAlert ? "breach" : "hold" }),
        law("Critical Fracture Window", "succession", "Desk 12", "The period in which accumulated decay can turn into open fracture if nothing intervenes.",
          s.fractureMonths === undefined ? pend("Desk 12") : { reading: s.fractureMonths ? `${s.fractureMonths} months${s.fractureSeverity ? ` · ${s.fractureSeverity}` : ""}` : "No decay window", status: "reading" }),
      ],
    },
    {
      title: "III · Custodial inversion architecture",
      laws: [
        law("The Dominum Effect", "readiness", "Desk 15", "Custody replaces coercion once bonds, escrow, succession and containment together make the peace self-protecting.",
          "missing" in dom ? { reading: `Awaiting ${dom.missing.length} reading${dom.missing.length === 1 ? "" : "s"}`, status: "pending" } : { reading: `D ${dom.index.toFixed(1)}% · ${dom.phase}`, status: dom.phase === "Imperium-Bound" ? "breach" : "hold" }),
        law("Succession Trap", "succession", "Desk 12", "A settlement that cannot outlive its signatories is a truce awaiting its first funeral.",
          !suc ? pend("Desk 01") : { reading: `Durability ${suc.percent.toFixed(1)}%`, status: suc.trap ? "breach" : "hold" }),
        law("Conditional Escrow Waterfall", "multiparty", "Desk 07", "Resources release in order only as conditions are met, and freeze when rupture returns.",
          s.escrowReleasedPercent === undefined ? pend("Desk 07") : { reading: s.escrowFrozen ? "Frozen by rupture" : `${s.escrowReleasedPercent}% released${s.escrowTranchesMet !== undefined ? ` · ${s.escrowTranchesMet} of 4 tranches` : ""}`, status: s.escrowFrozen ? "breach" : "reading" }),
        law("Resource Parity", "multiparty", "Desk 07", "A covenant that shortchanges the communal share carries a legitimacy deficit into every later stage.",
          s.resourceParity === undefined ? pend("Desk 07") : { reading: `Parity ${s.resourceParity}${s.resourceCommunalShare !== undefined ? ` · communal share ${s.resourceCommunalShare}%` : ""}`, status: s.legitimacyDeficit ? "breach" : "hold" }),
        law("Dispute Forum Enforceability", "redliner", "Desk 11", "A clause is only as strong as the forum able to enforce it against the party most likely to defect.",
          s.activeForumScore === undefined ? pend("Desk 11") : { reading: `${s.disputeForum ?? "Forum"} · fitness ${s.activeForumScore}`, status: "reading" }),
        law("Fiduciary and Handover Seal", "handover", "Desk 17", "The mission closes only when custody passes to a successor able to hold it without the mission.",
          s.handoverViability === undefined ? pend("Desk 17") : { reading: `Durability quotient ${s.handoverViability}%${s.handoverBand ? ` · ${s.handoverBand}` : ""}`, status: "reading" }),
      ],
    },
  ];
}

const STATUS_STYLE: Record<Status, { label: string; cls: string }> = {
  breach: { label: "Breached", cls: "border-destructive/60 text-destructive" },
  hold: { label: "Holding", cls: "border-accent/60 text-accent" },
  reading: { label: "Live", cls: "border-brass/60 text-primary" },
  pending: { label: "Awaiting", cls: "border-border text-muted-foreground" },
};

const LAWS_KEY = "vs:lawsOpen";

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="min-w-0 border-l border-brass/40 pl-3">
      <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
        {LEX_FOR[k] ? <Lex term={LEX_FOR[k]}>{k}</Lex> : k}
      </p>
      <p className="min-h-10 text-xs sm:text-sm tabular-nums leading-snug [overflow-wrap:anywhere] text-primary">{v}</p>
    </div>
  );
}

/** The standing readout carried across the top of every desk. */
export default function TelemetryStrip({ signals, onOpenDesk }: { signals: Signals; /** Opens a desk by id; supplied by the dashboard. */ onOpenDesk?: (id: string) => void }) {
  const [open, setOpen] = useState(false);
  const [lawsOpen, setLawsOpen] = useState(() => { try { return sessionStorage.getItem(LAWS_KEY) === "1"; } catch { return false; } });
  useEffect(() => { try { sessionStorage.setItem(LAWS_KEY, lawsOpen ? "1" : "0"); } catch { /* storage unavailable */ } }, [lawsOpen]);
  if (!hasSignal(signals)) return null;
  const a = alerts(signals);
  const criticalAlerts = a.filter((x) => x.level === "critical");
  const critical = criticalAlerts.length;
  const elevated = a.filter((x) => x.level === "elevated").length;

  const strain: { k: string; v: string }[] = [];
  const custody: { k: string; v: string }[] = [];
  if (signals.bondMean !== undefined) strain.push({ k: "Bond mean", v: `${signals.bondMean.toFixed(2)} of 5` });
  if (signals.weakestBond) strain.push({ k: "Limiting bond", v: `${signals.weakestBond}${signals.weakestScore !== undefined ? ` ${signals.weakestScore.toFixed(1)}${signals.weakestBand ? ` · ${signals.weakestBand}` : ""}` : ""}` });
  if (signals.rupture !== undefined) strain.push({ k: "Rupture index", v: `${signals.rupture}% ${signals.ruptureBand ?? ""}` });
  if (signals.trackGap !== undefined) strain.push({ k: "Track gap", v: `${signals.trackGap}${signals.trackTolerance !== undefined ? ` (tolerance ${signals.trackTolerance})` : ""}` });
  if (signals.shocks?.length) strain.push({ k: "Shocks active", v: String(signals.shocks.length) });
  const dyn = relationalDynamics(signals);
  if (dyn) {
    strain.push({ k: "Relational deficit", v: `${dyn.deficit.toFixed(1)} · ${dyn.deficitPct}%` });
    strain.push({ k: "Contagion", v: `${dyn.contagion}%` });
    strain.push({ k: "Entropy", v: `H ${dyn.entropy.toFixed(2)}` });
    strain.push({ k: "Decay", v: `${dyn.character} · Ω ${dyn.omega.toFixed(2)}` });
  }
  const dom = dominumIndex(signals);
  custody.push({ k: "Dominum Index", v: "missing" in dom ? `Awaiting ${dom.missing.length} of 4 readings` : `D ${dom.index.toFixed(1)}% · ${dom.phase}` });
  if (signals.escrowReleasedPercent !== undefined) custody.push({ k: "Escrow waterfall", v: signals.escrowFrozen ? "Frozen by rupture" : `${signals.escrowReleasedPercent}% released` });
  const suc = successionDurability(signals);
  if (suc) custody.push({ k: "Succession durability", v: `${suc.percent.toFixed(1)}%${suc.trap ? " · trap" : ""}` });
  if (signals.covenants?.length) custody.push({ k: "Covenants", v: String(signals.covenants.length) });
  const alertValue = critical ? `${critical} critical` : elevated ? `${elevated} elevated` : "none standing";

  const pillars = governingLaws(signals);
  const all = pillars.flatMap((p) => p.laws);
  const live = all.filter((l) => l.status !== "pending").length;
  const breached = all.filter((l) => l.status === "breach").length;

  return (
    <div className="mb-5">
      <div
        className={`relative border px-3 py-3 sm:px-4 ${
          critical ? "border-destructive/60 bg-destructive/5" : "border-brass/40 bg-navy-tint/40"
        }`}
      >
        {critical > 0 && (
          <span aria-hidden className="pointer-events-none absolute -inset-px border-2 border-destructive/60" />
        )}
        <p className="text-[9px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2">
          Mission engine · live telemetry
        </p>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
          <section aria-label="Vulnerability and friction" className="min-w-0">
            <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-destructive/80 mb-2">Vulnerability and friction</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-3">
              {strain.map((c) => <Cell key={c.k} {...c} />)}
            </div>
          </section>
          <section aria-label="Custodial inversion and stabilisation" className="min-w-0 lg:border-l lg:border-brass/30 lg:pl-4">
            <p className="text-[9px] uppercase tracking-[0.2em] font-semibold text-accent mb-2">Custodial inversion and stabilisation</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {custody.map((c) => <Cell key={c.k} {...c} />)}
              <Button variant="ghost"
                type="button"
                onClick={() => critical && setOpen((o) => !o)}
                aria-expanded={critical ? open : undefined}
                aria-controls="vs-critical-drawer"
                disabled={!critical}
                className={`group h-auto min-w-0 flex-col items-start justify-start whitespace-normal rounded-none border-l border-brass/40 pl-3 text-left ${critical ? "cursor-pointer" : "cursor-default"}`}
              >
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">Alerts</p>
                <p className={`flex items-center gap-1 text-xs sm:text-sm font-serif leading-snug ${critical ? "text-destructive group-hover:underline" : "text-primary"}`}>
                  {alertValue}
                  {critical > 0 && <ChevronDown size={13} className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />}
                </p>
              </Button>
            </div>
          </section>
        </div>
        <button
          type="button"
          onClick={() => setLawsOpen((o) => !o)}
          aria-expanded={lawsOpen}
          aria-controls="vs-laws-console"
          className="mt-3 flex w-full min-h-9 flex-wrap items-center justify-between gap-2 border-t border-brass/30 pt-2 text-left"
        >
          <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary">Governing relational laws</span>
          <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground tabular-nums">
            {live} of {all.length} live{breached ? <span className="text-destructive">· {breached} breached</span> : null}
            <ChevronDown size={13} className={`transition-transform ${lawsOpen ? "rotate-180" : ""}`} />
          </span>
        </button>
      </div>
      {lawsOpen && (
        <div id="vs-laws-console" className="border border-t-0 border-brass/40 bg-background px-3 py-4 sm:px-4">
          <div className="grid gap-5 xl:grid-cols-3">
            {pillars.map((p) => (
              <section key={p.title} aria-label={p.title} className="min-w-0">
                <p className="text-[9px] uppercase tracking-[0.22em] font-semibold text-accent mb-2">{p.title}</p>
                <ul className="space-y-2.5">
                  {p.laws.map((l) => {
                    const st = STATUS_STYLE[l.status];
                    return (
                      <li key={l.name} className={`min-w-0 border-l-2 pl-3 ${l.status === "breach" ? "border-destructive/60" : "border-brass/40"}`}>
                        <div className="flex flex-wrap items-baseline justify-between gap-x-2 gap-y-1">
                          <p className="font-serif text-sm text-primary">{l.name}</p>
                          <span className={`border px-1.5 text-[9px] uppercase tracking-[0.14em] font-semibold ${st.cls}`}>{st.label}</span>
                        </div>
                        <p className="mt-0.5 text-xs tabular-nums text-foreground [overflow-wrap:anywhere]">{l.reading}</p>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{l.principle}</p>
                        {onOpenDesk && (
                          <button type="button" onClick={() => onOpenDesk(l.desk)} className="mt-1 inline-flex min-h-8 items-center gap-1 text-[10px] uppercase tracking-[0.14em] font-semibold text-primary hover:text-accent">
                            Open {l.deskLabel} <ArrowUpRight size={11} />
                          </button>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        </div>
      )}
      {critical > 0 && open && (
        <div id="vs-critical-drawer" className="border border-t-0 border-destructive/50 bg-background px-3 py-3 sm:px-4">
          <p className="text-[9px] uppercase tracking-[0.24em] font-semibold text-destructive mb-2">Standing critical locks</p>
          <ul className="space-y-3">
            {criticalAlerts.map((x) => (
              <li key={x.name} className="min-w-0 border-l-2 border-destructive/60 pl-3">
                <p className="text-xs font-semibold text-primary [overflow-wrap:anywhere]">
                  {x.name}
                  <span className="ml-2 text-[9px] uppercase tracking-[0.16em] font-semibold text-muted-foreground">
                    Bond · {domainOf(x, signals)}
                  </span>
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground [overflow-wrap:anywhere]">{x.reading}</p>
                <p className="mt-1 text-xs text-foreground/90 [overflow-wrap:anywhere]">
                  <span className="text-[9px] uppercase tracking-[0.16em] font-semibold text-accent">Directive · </span>
                  {x.directive}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
