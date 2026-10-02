import { useMemo, useState } from "react";
import EngineBrief from "@/components/desk/EngineBrief";
import SyncPanel from "@/components/desk/SyncPanel";
import { telemetryLines, useEngine, type Signals } from "@/components/desk/engine";
import DeskOutput, { todayStamp } from "@/components/desk/DeskOutput";
import { useMission } from "@/components/desk/mission";
import { PANELS, VERDICT_LABEL, type Verdict } from "@/content/adversarial";

const VERDICT_STYLE: Record<Verdict, string> = {
  answered: "border-primary/40 text-primary",
  conceded: "border-brass text-foreground/80 bg-gold-tint",
  open: "border-accent/60 text-accent",
};

type Filter = "all" | Verdict;

export default function AdversarialChamber() {
  const [panelN, setPanelN] = useState(1);
  const { signals } = useEngine();
  // Linked: the chamber briefs and the audit memo carry the live mission reading. Override: standalone.
  const [linked, setLinked] = useState(true);
  const sg = useMemo<Signals>(() => (linked ? signals : {}), [linked, signals]);
  const [filter, setFilter] = useState<Filter>("all");
  const [openQ, setOpenQ] = useState<number | null>(0);

  const all = PANELS.flatMap((p) => p.exchanges);
  const counts = useMemo(
    () => ({
      all: all.length,
      answered: all.filter((e) => e.verdict === "answered").length,
      conceded: all.filter((e) => e.verdict === "conceded").length,
      open: all.filter((e) => e.verdict === "open").length,
    }),
    [all],
  );

  const visiblePanels = PANELS.filter(
    (p) => filter === "all" || p.exchanges.some((e) => e.verdict === filter),
  );
  const panel = visiblePanels.find((p) => p.n === panelN) ?? visiblePanels[0];
  const exchanges = panel.exchanges.filter((e) => filter === "all" || e.verdict === filter);

  const mission = useMission();
  const memo = useMemo(() => {
    const L: string[] = [];
    L.push("ADVERSARIAL CHAMBER AUDIT");
    L.push("Vinculum Security, Legal Architecture Division");
    L.push("");
    L.push(`MISSION: ${mission.theatre.trim() || "Unnamed mission"}`);
    L.push(`DATE: ${todayStamp()}`);
    L.push(`SCOPE: ${filter === "all" ? "Every question" : VERDICT_LABEL[filter]}, ${visiblePanels.length} panel(s)`);
    L.push(`TALLY (ALL PANELS): ${counts.answered} answered, ${counts.conceded} conceded, ${counts.open} held open of ${counts.all}`);
    L.push("");
    if (sg.weakestBond)
      L.push(`PRESSURE POINT: Critics will press hardest on the ${sg.weakestBond.toLowerCase()} bond${sg.weakestScore !== undefined ? ` (${sg.weakestScore.toFixed(1)} of 5)` : ""}.`, "");
    L.push(...telemetryLines(sg));
    visiblePanels.forEach((p) => {
      const ex = p.exchanges.filter((e) => filter === "all" || e.verdict === filter);
      L.push(`PANEL ${p.n}. ${p.title.toUpperCase()} (${p.lens})`);
      ex.forEach((e, i) => {
        L.push(`  Q${i + 1}. ${e.q}`);
        L.push(`  Answer: ${e.a}`);
        L.push(`  Verdict: ${VERDICT_LABEL[e.verdict]}${e.ref ? ` · Doctrine ${e.ref}` : ""}`);
        L.push("");
      });
    });
    L.push("Each held question maps to an item on the Research and Practice Agenda (Section XI).");
    L.push("Rule-based record of the doctrine's own answers. Not legal advice. Kenya Copyright Board Registration No. RZ100967.");
    L.push("END OF AUDIT");
    return L.join("\n");
  }, [mission.theatre, filter, visiblePanels, counts, sg]);

  const choose = (n: number) => {
    setPanelN(n);
    setOpenQ(0);
  };

  return (
    <div>
      <div className="mb-6">
        <SyncPanel
          linked={linked}
          onToggle={setLinked}
          summary={(x) =>
            x.weakestBond
              ? [`Critics are expected to press hardest on the ${x.weakestBond.toLowerCase()} bond${x.weakestScore !== undefined ? `, where the theatre reads ${x.weakestScore.toFixed(1)} of 5` : ""}.`]
              : []
          }
        />
      </div>
      <EngineBrief lines={[
        sg.weakestBond && `Expect critics to press hardest on the ${sg.weakestBond.toLowerCase()} bond, where your theatre reads ${sg.weakestScore?.toFixed(1)} of 5. Rehearse the open and conceded questions first.`,
        sg.elitePactAlert && "Your tracks show an Elite-Pact Mirage. Prepare for the realist charge that the deal is only between principals.",
        (sg.covenants?.length ?? 0) > 0 && `Defend the drafted covenants under challenge: ${sg.covenants!.join("; ")}.`,
        sg.survivalScore !== undefined && sg.survivalScore < 55 && `Treaty survival reads ${sg.survivalScore} per cent; concede durability limits honestly rather than overclaim.`,
      ]} />
      <p className="text-muted-foreground max-w-3xl mb-6">
        The doctrine names its own critics before they arrive. Twelve panels, from realist diplomats to
        bad-faith actors, put {counts.all} questions to it. Each answer is marked honestly: answered,
        partly conceded, or held open for independent work.
      </p>

      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by verdict">
        {(["all", "answered", "conceded", "open"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => { setFilter(f); setOpenQ(0); }}
            aria-pressed={filter === f}
            className={`px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] font-semibold border transition-colors ${
              filter === f
                ? "bg-primary text-primary-foreground border-primary"
                : "border-border text-foreground/70 hover:border-brass"
            }`}
          >
            {f === "all" ? "Every question" : VERDICT_LABEL[f]} · {counts[f]}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[18rem_1fr] border border-border bg-background">
        {/* Mobile: compact panel menu */}
        <div className="lg:hidden border-b border-border bg-navy-tint/60 p-4">
          <label htmlFor="panel-menu" className="eyebrow block mb-2">Review panel</label>
          <select
            id="panel-menu"
            value={panel.n}
            onChange={(ev) => choose(Number(ev.target.value))}
            className="w-full border border-border bg-background px-3 py-2.5 text-sm text-foreground font-medium"
          >
            {visiblePanels.map((p) => (
              <option key={p.n} value={p.n}>
                Panel {p.n} — {p.title}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop: sidebar list */}
        <nav aria-label="Review panels" className="hidden lg:block border-r border-border bg-navy-tint/60">
          <ol>
            {visiblePanels.map((p) => {
              const active = p.n === panel.n;
              return (
                <li key={p.n}>
                  <button
                    type="button"
                    onClick={() => choose(p.n)}
                    aria-current={active}
                    className={`w-full text-left px-4 py-3 flex gap-3 items-baseline border-l-2 transition-colors ${
                      active ? "border-accent bg-background" : "border-transparent hover:bg-background/60"
                    }`}
                  >
                    <span className="font-serif text-accent text-lg w-6">{p.n}</span>
                    <span className={`text-sm ${active ? "text-primary font-medium" : "text-foreground/75"}`}>
                      {p.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="p-4 sm:p-5 md:p-8">
          <p className="eyebrow">Panel {panel.n} · {panel.lens}</p>
          <h3 className="mt-2 font-serif text-primary text-2xl md:text-3xl">{panel.title}</h3>
          <hr className="gold-rule gold-rule-short mt-4 mb-6" />
          <ul className="space-y-4">
            {exchanges.map((e, i) => {
              const open = openQ === i;
              return (
                <li key={e.q} className="border border-border">
                  <button
                    type="button"
                    onClick={() => setOpenQ(open ? null : i)}
                    aria-expanded={open}
                    className="w-full text-left p-4 md:p-5 flex gap-3 md:gap-4 items-start hover:bg-gold-tint/40 transition-colors"
                  >
                    <span className="font-serif text-accent text-lg md:text-xl leading-none mt-0.5">Q</span>
                    <span className="flex-1 font-serif text-base md:text-lg text-foreground leading-snug">{e.q}</span>
                    <span className="text-brass text-xl leading-none shrink-0" aria-hidden>{open ? "−" : "+"}</span>
                  </button>
                  {open && (
                    <div className="px-4 md:px-5 pb-5">
                      <p className="text-foreground/85 leading-relaxed border-l-2 border-brass pl-4">{e.a}</p>
                      <div className="mt-4 flex flex-wrap gap-2 items-center">
                        <span className={`px-2 py-0.5 text-[10px] uppercase tracking-[0.2em] font-semibold border ${VERDICT_STYLE[e.verdict]}`}>
                          {VERDICT_LABEL[e.verdict]}
                        </span>
                        {e.ref && (
                          <span className="text-[11px] text-muted-foreground tracking-wide">Doctrine {e.ref}</span>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="mt-10">
        <p className="eyebrow mb-3">Compiled audit</p>
        <p className="mb-4 max-w-3xl text-sm text-muted-foreground">
          The audit follows the filter above. Add it to the Mission Binder to carry the critics' questions into the dossier.
        </p>
        <DeskOutput text={memo} fileName="Vinculum-Adversarial-Audit" />
      </div>

      <p className="mt-6 text-sm italic text-muted-foreground max-w-3xl">
        What remains open is not hidden. Each held question maps to an item on the doctrine's Research
        and Practice Agenda (Section XI), beginning with independent blind scoring by outside raters.
      </p>
    </div>
  );
}
