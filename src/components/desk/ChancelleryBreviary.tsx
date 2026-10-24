import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Zap, Copy, Download, ShieldCheck, AlertTriangle, CheckCircle2, Lock, BookPlus } from "lucide-react";
import { toast } from "sonner";
import type { Signals } from "./engine";
import type { MissionProfile } from "./mission";
import type { BinderEntry } from "./DeskOutput";
import { readBreviary } from "./breviary";
import { Lex } from "./Lexicon";
import { sha256, sealText, shortHash } from "./integrity";
import { copyText } from "@/lib/clipboardGuard";

const card = "border border-brass/40 bg-navy-tint/30 p-4 space-y-2 min-w-0";
const head = "text-[10px] uppercase tracking-[0.18em] font-semibold text-primary/70";
const row = "flex items-baseline justify-between gap-3 min-w-0";

function Pending({ children }: { children: React.ReactNode }) {
  return <span className="text-muted-foreground italic text-right">{children}</span>;
}

/**
 * One-Page Chancellery Breviary: a 90-second principal briefing drawn live from
 * the MissionEngine signal bus. Opens from the dashboard header; copy or export
 * carries a SHA-256 integrity stamp computed on this device.
 */
export function ChancelleryBreviary({
  signals,
  profile,
  onAddToBinder,
}: {
  signals: Signals;
  profile: MissionProfile;
  onAddToBinder?: (e: BinderEntry) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hash, setHash] = useState("");

  // Recomputed only while the drawer is open; the text is a pure function of the bus.
  const r = useMemo(() => (open ? readBreviary(signals, profile) : null), [open, signals, profile]);

  useEffect(() => {
    if (!r) return;
    let active = true;
    setHash("");
    sha256(r.text).then((h) => active && setHash(h));
    return () => {
      active = false;
    };
  }, [r]);

  const slug = (profile.theatre.trim() || "mission").replace(/[^a-z0-9]+/gi, "-").toLowerCase();

  const copy = async () => {
    if (!r) return;
    try {
      const { stamped } = await sealText(r.text);
      await copyText(stamped);
      toast.success("Breviary copied with SHA-256 integrity stamp");
    } catch {
      toast.error("Copy failed. Use Download instead.");
    }
  };

  const download = async () => {
    if (!r) return;
    const { stamped } = await sealText(r.text);
    const url = URL.createObjectURL(new Blob([stamped], { type: "text/plain;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `Vinculum-Breviary-${new Date().toISOString().slice(0, 10)}.txt`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
    toast.success("Breviary downloaded with integrity seal");
  };

  const addToBinder = async () => {
    if (!r || !onAddToBinder) return;
    const { stamped } = await sealText(r.text);
    onAddToBinder({ id: "Vinculum-Chancellery-Breviary", title: "One-Page Chancellery Breviary", text: stamped });
    toast.success("Breviary added to the Mission Binder with integrity seal");
  };

  const btn =
    "flex-1 min-w-[9rem] inline-flex items-center justify-center gap-2 border border-brass/60 min-h-11 px-3 py-2.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open the Chancellery Breviary, a 90-second executive briefing"
          className="inline-flex items-center gap-1.5 min-h-9 border border-brass/60 bg-accent/10 px-2.5 py-1.5 text-[10px] uppercase tracking-[0.18em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors"
          title="Open 90-second executive chancellery briefing"
        >
          <Zap size={13} />
          <span className="hidden 2xl:inline">Breviary</span>
        </button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto overflow-x-hidden bg-background p-4 sm:p-6">
        <SheetHeader className="min-w-0">
          <div className="flex items-center justify-between gap-3 pr-8">
            <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-accent">Executive briefing</p>
            {hash && (
              <span className="text-[9px] font-mono text-muted-foreground flex items-center gap-1 min-w-0" title={hash}>
                <ShieldCheck size={11} className="text-accent shrink-0" /> <span className="truncate">{shortHash(hash)}</span>
              </span>
            )}
          </div>
          <SheetTitle className="font-serif text-2xl text-primary mt-1">One-Page Chancellery Breviary</SheetTitle>
          <SheetDescription className="text-xs">
            A 90-second briefing read directly from the live mission engine. Deterministic; nothing leaves this device.
          </SheetDescription>
        </SheetHeader>

        {r && (
          <>
            <div className="mt-5 space-y-3 text-xs w-full min-w-0 max-w-full">
              {/* 1. Bonds */}
              <section className={card}>
                <p className={head}>1. Bond vector and <Lex term="liebig">Liebig factor</Lex></p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-foreground/90">
                  {r.rows.map((x) => (
                    <div key={x.name} className="min-w-0">
                      <span className="block text-[10px] text-muted-foreground truncate">{x.name}</span>
                      <span className="font-mono font-semibold">{x.score.toFixed(1)}</span>
                      <span className="ml-1.5 text-[10px] text-muted-foreground">{x.band}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-brass/20 space-y-1">
                  <div className={row}>
                    <span>Limiting bond</span>
                    <span className="font-semibold text-accent text-right">
                      {r.limiting.name} ({r.limiting.score.toFixed(1)})
                    </span>
                  </div>
                  <div className={row}>
                    <span>Mean μ</span>
                    <span className="font-mono">{r.mean.toFixed(2)}</span>
                  </div>
                  <div className={row}>
                    <span><Lex term="variance">Spread variance σ²</Lex></span>
                    <span className={`font-mono ${r.facade.engaged ? "text-accent font-semibold" : ""}`}>
                      {r.variance.toFixed(3)}
                      {r.facade.engaged ? " · facade" : ""}
                    </span>
                  </div>
                </div>
                {r.bondSource !== "live" && (
                  <p className="text-[10px] text-muted-foreground">
                    {r.bondSource === "profile"
                      ? "Showing the mission profile baseline. Open Diagnostics to publish a live reading."
                      : "No bonds scored yet; showing the 3.0 default. Open Diagnostics to score them."}
                  </p>
                )}
              </section>

              {/* 2. Early warning */}
              <section className={card}>
                <p className={head}>2. Early warning and latent traps</p>
                <div className={row}>
                  <span><Lex term="rupture">Rupture index R%</Lex></span>
                  {r.rupture !== undefined ? (
                    <span className="font-mono font-semibold">
                      {r.rupture}% <span className="font-sans font-normal text-muted-foreground">{r.ruptureBand}</span>
                    </span>
                  ) : (
                    <Pending>Not read · Sentinel Matrix</Pending>
                  )}
                </div>
                <div className="space-y-1">
                  <span className="block">Latent traps</span>
                  {r.traps.length ? (
                    <ul className="space-y-1">
                      {r.traps.map((t) => (
                        <li key={t} className="flex items-start gap-1.5 text-accent font-semibold">
                          <AlertTriangle size={12} className="mt-0.5 shrink-0" />
                          <span className="min-w-0 [overflow-wrap:anywhere]">{t}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                      <CheckCircle2 size={12} /> None on the bus
                    </span>
                  )}
                </div>
              </section>

              {/* 3. Tracks */}
              <section className={card}>
                <p className={head}>3. Track I vs Track II</p>
                {r.tracks.read ? (
                  <>
                    <div className={row}>
                      <span>Track I / Track II</span>
                      <span className="font-mono">Phase {r.tracks.trackI} / Phase {r.tracks.trackII}</span>
                    </div>
                    <div className={row}>
                      <span><Lex term="track-divergence">Divergence ΔT</Lex></span>
                      <span className="font-mono font-semibold">{r.tracks.gap}</span>
                    </div>
                  </>
                ) : (
                  <div className={row}>
                    <span>Divergence ΔT</span>
                    <Pending>Not read · Track Sequencing</Pending>
                  </div>
                )}
                <div className={row}>
                  <span><Lex term="tolerance">Communal tolerance T_tol</Lex></span>
                  <span className="font-mono font-semibold">{r.tracks.tolerance} phase{r.tracks.tolerance === 1 ? "" : "s"}</span>
                </div>
                <div className={row}>
                  <span><Lex term="elite-pact">Elite-Pact Mirage</Lex></span>
                  {!r.tracks.read ? (
                    <Pending>Not assessed</Pending>
                  ) : r.tracks.mirage ? (
                    <span className="inline-flex items-center gap-1 text-accent font-semibold">
                      <AlertTriangle size={12} /> ENGAGED (ΔT {r.tracks.gap} &gt; {r.tracks.tolerance})
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-primary font-semibold">
                      <CheckCircle2 size={12} /> CLEAR
                    </span>
                  )}
                </div>
              </section>

              {/* 4. Locks and gates */}
              <section className={card}>
                <p className={head}>4. <Lex term="engine-lock">Engine locks</Lex> and <Lex term="readiness-gate">readiness gates</Lex></p>
                {r.activeLocks.length === 0 ? (
                  <div className="text-primary font-semibold flex items-start gap-1.5">
                    <CheckCircle2 size={14} className="shrink-0 mt-px" />
                    {r.locks.length
                      ? `No active lock. ${r.locks.length} of ${r.locks.length} engine conditions satisfied.`
                      : "No engine lock raised by the current readings."}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="text-accent font-semibold flex items-center gap-1.5">
                      <Lock size={13} className="shrink-0" /> {r.activeLocks.length} active of {r.locks.length}
                    </div>
                    {r.activeLocks.map((l) => (
                      <p key={l.name} className="text-[11px] text-muted-foreground pl-4 [overflow-wrap:anywhere]">
                        • <span className="text-foreground">{l.name}.</span> {l.remedy}
                      </p>
                    ))}
                  </div>
                )}
                <div className={`${row} pt-2 border-t border-brass/20`}>
                  <span>Readiness stages cleared</span>
                  {r.gatesCleared ? (
                    <span className="font-mono font-semibold">{r.gatesCleared}</span>
                  ) : (
                    <Pending>Not read · Mission Readiness</Pending>
                  )}
                </div>
              </section>

              {/* 5. Handover */}
              <section className={card}>
                <p className={head}>5. Governance and handover horizon</p>
                <div className={row}>
                  <span><Lex term="handover-viability">Handover viability H%</Lex></span>
                  {r.handover.viability !== undefined ? (
                    <span className="font-mono font-semibold">
                      {r.handover.viability}% <span className="font-sans font-normal text-muted-foreground">{r.handover.band}</span>
                    </span>
                  ) : (
                    <Pending>Not assessed · Mandate Handover</Pending>
                  )}
                </div>
                <div className={row}>
                  <span><Lex term="oversight-body">Oversight body</Lex></span>
                  <span className={`text-right min-w-0 [overflow-wrap:anywhere] ${r.handover.oversight ? "font-semibold text-primary" : "text-muted-foreground italic"}`}>
                    {r.handover.oversight ?? "Not designated"}
                  </span>
                </div>
                <div className={row}>
                  <span><Lex term="succession-trap">Succession durability S%</Lex></span>
                  {r.succession ? (
                    <span className={`font-mono font-semibold ${r.succession.trap ? "text-accent" : ""}`}>
                      {r.succession.percent}%{r.succession.trap ? " · below 55" : ""}
                    </span>
                  ) : (
                    <Pending>Awaiting bond vector</Pending>
                  )}
                </div>
              </section>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" onClick={copy} className={btn}>
                <Copy size={13} /> Copy
              </button>
              <button type="button" onClick={download} className={btn}>
                <Download size={13} /> Download .txt
              </button>
              {onAddToBinder && (
                <button type="button" onClick={addToBinder} className={btn}>
                  <BookPlus size={13} /> Add to binder
                </button>
              )}
            </div>
            {hash && (
              <p className="mt-3 text-[10px] font-mono text-muted-foreground break-all">SEAL: {hash}</p>
            )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default ChancelleryBreviary;
