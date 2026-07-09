import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

type Region = "Africa" | "Europe" | "Latin America" | "Southeast Asia";
type Pillar = "Interpersonal" | "Communal" | "Intergenerational" | "Institutional";
type Threat =
  | "Ethnic conflict"
  | "Civil war"
  | "Genocide"
  | "Political violence"
  | "Post-conflict transition";

type Case = {
  slug: string;
  title: string;
  summary: string;
  region: Region;
  pillar: Pillar;
  threats: Threat[];
  era: "1990s" | "2000s" | "2010s";
  scores: [number, number, number, number];
};

const CASES: Case[] = [
  {
    slug: "northern-ireland",
    title: "Northern Ireland — The Good Friday Agreement",
    summary:
      "A power-sharing government has held, with interruptions, for over 25 years; dramatic reduction in lethal violence alongside documented intergenerational trauma.",
    region: "Europe",
    pillar: "Institutional",
    threats: ["Ethnic conflict", "Political violence", "Post-conflict transition"],
    era: "1990s",
    scores: [4, 3, 2, 5],
  },
  {
    slug: "colombia",
    title: "Colombia — The 2016 Final Agreement",
    summary:
      "A dedicated ethnic and gender chapter, a Special Jurisdiction for Peace, and UN-monitored verification alongside persistent violence against social leaders.",
    region: "Latin America",
    pillar: "Institutional",
    threats: ["Civil war", "Political violence", "Post-conflict transition"],
    era: "2010s",
    scores: [3, 2, 3, 4],
  },
  {
    slug: "cambodia",
    title: "Cambodia — The Extraordinary Chambers",
    summary:
      "A hybrid UN-Cambodian tribunal that operated for sixteen years and secured convictions against only three senior Khmer Rouge leaders.",
    region: "Southeast Asia",
    pillar: "Intergenerational",
    threats: ["Genocide", "Post-conflict transition"],
    era: "2000s",
    scores: [2, 2, 2, 2],
  },
  {
    slug: "liberia",
    title: "Liberia — TRC and the Palava Hut",
    summary:
      "A Truth and Reconciliation Commission delivering its 2009 final report alongside disarmament of over 100,000 former combatants and revival of Palava Hut dialogue.",
    region: "Africa",
    pillar: "Communal",
    threats: ["Civil war", "Post-conflict transition"],
    era: "2000s",
    scores: [3, 4, 3, 2],
  },
  {
    slug: "rwanda",
    title: "Rwanda — The Gacaca Courts",
    summary:
      "Roughly 12,000 community tribunals processed close to two million genocide-related cases between 2002 and 2012.",
    region: "Africa",
    pillar: "Communal",
    threats: ["Genocide", "Post-conflict transition"],
    era: "2000s",
    scores: [3, 3, 2, 2],
  },
  {
    slug: "kenya",
    title: "Kenya — The 2008 National Accord",
    summary:
      "AU Panel mediation under Kofi Annan produced the National Accord, followed by the NCIC and a 2012 Nakuru County Peace Accord addressing Rift Valley communal trust.",
    region: "Africa",
    pillar: "Interpersonal",
    threats: ["Ethnic conflict", "Political violence"],
    era: "2000s",
    scores: [4, 2, 2, 3],
  },
];

const DOMAINS = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"];
const REGIONS: Region[] = ["Africa", "Europe", "Latin America", "Southeast Asia"];
const PILLARS: Pillar[] = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];
const THREATS: Threat[] = [
  "Ethnic conflict",
  "Civil war",
  "Genocide",
  "Political violence",
  "Post-conflict transition",
];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`px-3 py-1.5 border text-[10px] font-semibold uppercase tracking-[0.2em] transition-all hover:-translate-y-0.5 ${
        active
          ? "bg-accent text-accent-foreground border-accent"
          : "bg-transparent text-primary border-brass/50 hover:border-accent hover:text-accent"
      }`}
    >
      {children}
    </button>
  );
}

export default function Cases() {
  const [regions, setRegions] = useState<Set<Region>>(new Set());
  const [pillars, setPillars] = useState<Set<Pillar>>(new Set());
  const [threats, setThreats] = useState<Set<Threat>>(new Set());
  const [compare, setCompare] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  const toggle = <T,>(s: Set<T>, v: T, set: (s: Set<T>) => void) => {
    const next = new Set(s);
    next.has(v) ? next.delete(v) : next.add(v);
    set(next);
  };

  const filtered = useMemo(
    () =>
      CASES.filter(
        (c) =>
          (regions.size === 0 || regions.has(c.region)) &&
          (pillars.size === 0 || pillars.has(c.pillar)) &&
          (threats.size === 0 || c.threats.some((t) => threats.has(t)))
      ),
    [regions, pillars, threats]
  );

  const toggleCompare = (slug: string) => {
    setCompare((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length >= 3
          ? prev
          : [...prev, slug]
    );
  };

  const clearAll = () => {
    setRegions(new Set());
    setPillars(new Set());
    setThreats(new Set());
  };

  const anyActive = regions.size + pillars.size + threats.size > 0;
  const compareCases = compare
    .map((s) => CASES.find((c) => c.slug === s))
    .filter(Boolean) as Case[];

  return (
    <>
      <SEO
        title="Case Studies"
        description="Six documented processes — Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya — scored across the four bond domains of the Vinculum Continuum."
        path="/cases"
      />
      <div className="container">
        <PageHeader
          eyebrow="Section VII"
          title="Applied Case Engagement"
          lede="Six documented processes across Europe, Latin America, Southeast Asia, and Africa. Filter by region, doctrine pillar, or threat type, and select up to three to compare side-by-side."
        />

        <FadeIn className="flex gap-2 mb-8 flex-wrap">
          <DiplomatBadge variant="case-study">Case Study Atlas</DiplomatBadge>
          <DiplomatBadge variant="briefing-ready">Briefing Ready</DiplomatBadge>
          <DiplomatBadge variant="field-notes">Field-Tested</DiplomatBadge>
        </FadeIn>

        <FadeIn>
          <div className="border border-brass/40 bg-navy-tint/40 p-5 md:p-6 mb-8 space-y-5">
            <FilterGroup
              label="Region"
              items={REGIONS}
              active={regions}
              onToggle={(v) => toggle(regions, v, setRegions)}
            />
            <FilterGroup
              label="Doctrine Pillar"
              items={PILLARS}
              active={pillars}
              onToggle={(v) => toggle(pillars, v, setPillars)}
            />
            <FilterGroup
              label="Threat Type"
              items={THREATS}
              active={threats}
              onToggle={(v) => toggle(threats, v, setThreats)}
            />
            <div className="flex items-center justify-between pt-3 border-t border-brass/30">
              <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
                Showing {filtered.length} of {CASES.length} cases
              </p>
              {anyActive && (
                <button
                  onClick={clearAll}
                  className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        </FadeIn>

        <div className="grid gap-6 md:grid-cols-2 pb-32">
          {filtered.map((c, i) => {
            const selected = compare.includes(c.slug);
            return (
              <FadeIn key={c.slug} delay={i * 40}>
                <article className="bg-card border border-border p-6 md:p-7 h-full flex flex-col hover-lift transition-all">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex gap-1.5 flex-wrap">
                      <DiplomatBadge variant="foundation">{c.region}</DiplomatBadge>
                      <DiplomatBadge variant="methodology">{c.pillar}</DiplomatBadge>
                      <DiplomatBadge variant="handbook">{c.era}</DiplomatBadge>
                    </div>
                    <label className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-semibold text-primary cursor-pointer shrink-0">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleCompare(c.slug)}
                        disabled={!selected && compare.length >= 3}
                        className="accent-accent"
                      />
                      Compare
                    </label>
                  </div>
                  <h2 className="font-serif text-primary text-xl leading-tight">{c.title}</h2>
                  <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                  <p className="text-[0.95rem] leading-relaxed text-foreground/85 mb-6">
                    {c.summary}
                  </p>

                  <table className="w-full text-sm border border-border mt-auto">
                    <thead>
                      <tr className="bg-primary text-primary-foreground text-left">
                        <th className="px-3 py-2 font-serif font-medium">Bond Domain</th>
                        <th className="px-3 py-2 font-serif font-medium w-32 text-right">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {DOMAINS.map((d, idx) => (
                        <tr key={d} className={idx % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                          <td className="px-3 py-2">{d}</td>
                          <td className="px-3 py-2 text-right">
                            <span className="inline-flex items-center gap-2 justify-end">
                              <span className="w-16 h-1 bg-brass/30 relative overflow-hidden">
                                <span
                                  className="absolute inset-y-0 left-0 bg-accent"
                                  style={{ width: `${(c.scores[idx] / 5) * 100}%` }}
                                />
                              </span>
                              <span className="font-serif text-accent w-4">{c.scores[idx]}</span>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>
              </FadeIn>
            );
          })}
        </div>

        {compare.length > 0 && (
          <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-primary text-primary-foreground shadow-lg border border-brass/60 animate-fade-in">
            <button
              onClick={() => setOpen(true)}
              className="px-5 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold"
            >
              Compare ({compare.length})
            </button>
            <button
              onClick={() => setCompare([])}
              className="pr-4 pl-1 py-3 text-primary-foreground/70 hover:text-accent"
              aria-label="Clear comparison"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-4xl bg-background border-brass/50">
            <DialogHeader>
              <p className="eyebrow">Side-by-side comparison</p>
              <DialogTitle className="font-serif text-primary text-3xl mt-1">
                Bond Integrity Compared
              </DialogTitle>
            </DialogHeader>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border mt-4">
                <thead>
                  <tr className="bg-primary text-primary-foreground text-left">
                    <th className="px-3 py-2 font-serif font-medium">Bond Domain</th>
                    {compareCases.map((c) => (
                      <th key={c.slug} className="px-3 py-2 font-serif font-medium">
                        {c.title.split(" — ")[0]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DOMAINS.map((d, idx) => (
                    <tr key={d} className={idx % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                      <td className="px-3 py-2 font-serif italic text-primary">{d}</td>
                      {compareCases.map((c) => (
                        <td key={c.slug} className="px-3 py-2">
                          <div className="flex items-center gap-2">
                            <span className="flex-1 h-1.5 bg-brass/30 relative overflow-hidden">
                              <span
                                className="absolute inset-y-0 left-0 bg-accent"
                                style={{ width: `${(c.scores[idx] / 5) * 100}%` }}
                              />
                            </span>
                            <span className="font-serif text-accent w-4 text-right">
                              {c.scores[idx]}
                            </span>
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-foreground/60 mt-4">
              Scores 1–5 per bond domain. Higher values indicate stronger observed bond integrity in
              the doctrine's classification methodology.
            </p>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

function FilterGroup<T extends string>({
  label,
  items,
  active,
  onToggle,
}: {
  label: string;
  items: readonly T[];
  active: Set<T>;
  onToggle: (v: T) => void;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-[0.24em] font-semibold text-primary/70 mb-2">
        {label}
      </p>
      <div className="flex gap-2 flex-wrap">
        {items.map((it) => (
          <Chip key={it} active={active.has(it)} onClick={() => onToggle(it)}>
            {it}
          </Chip>
        ))}
      </div>
    </div>
  );
}
