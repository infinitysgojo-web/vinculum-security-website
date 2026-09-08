import { useMemo, useState } from "react";
import SEO from "@/components/SEO";
import { sectionLd } from "@/lib/seo-entities";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";
import DiplomatBadge from "@/components/DiplomatBadge";
import ReadingProgress from "@/components/ReadingProgress";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";

type Region = "Africa" | "Europe" | "Latin America" | "Southeast Asia" | "Pacific";
type Pillar = "Interpersonal" | "Communal" | "Intergenerational" | "Institutional";
type Threat =
  | "Ethnic conflict"
  | "Civil war"
  | "Genocide"
  | "Political violence"
  | "Post-conflict transition"
  | "Climate displacement";

type Case = {
  slug: string;
  title: string;
  summary: string;
  region: Region;
  pillar: Pillar;
  threats: Threat[];
  era: "1990s" | "2000s" | "2010s" | "2020s";
  scores: [number, number, number, number];
  rationales: [string, string, string, string];
};


const CASES: Case[] = [
  {
    slug: "northern-ireland",
    title: "Northern Ireland: The Good Friday Agreement",
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
      "25th-anniversary research documents intergenerational trauma affecting those born after 1998, weighted as the least compensable finding per § III.F.",
      "Power-sharing institutions have survived multiple collapses and a contested Brexit-era environment across more than 25 years: the strongest score in the entire case set.",
    ],
  },
  {
    slug: "colombia",
    title: "Colombia: The 2016 Final Agreement",
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
  },
  {
    slug: "cambodia",
    title: "Cambodia: The Extraordinary Chambers",
    summary:
      "A hybrid UN-Cambodian tribunal that operated for sixteen years and secured convictions against only three senior Khmer Rouge leaders.",
    region: "Southeast Asia",
    pillar: "Intergenerational",
    threats: ["Genocide", "Post-conflict transition"],
    era: "2000s",
    scores: [2, 2, 2, 2],
    rationales: [
      "The tribunal's scope was deliberately limited to senior leadership, leaving most direct perpetrator-victim relationships outside its process.",
      "A widespread culture of impunity is documented as persisting, alongside the tribunal's own reconciliation-oriented amnesty for lower-level fighters.",
      "Documented concern about a lack of educational material and rising historical revisionism among younger Cambodians represents an unaddressed intergenerational bond around memory and transmission.",
      "Sixteen years, immense cost, and only three convictions: a weak institutional-relational return relative to the scale of the crimes addressed.",
    ],
  },
  {
    slug: "liberia",
    title: "Liberia: TRC and the Palava Hut",
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
  },
  {
    slug: "rwanda",
    title: "Rwanda: The Gacaca Courts",
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
  },
  {
    slug: "kenya",
    title: "Kenya: The 2008 National Accord",
    summary:
      "AU Panel mediation under Kofi Annan produced the National Accord, followed by the NCIC and a 2012 Nakuru County Peace Accord addressing Rift Valley communal trust.",
    region: "Africa",
    pillar: "Interpersonal",
    threats: ["Ethnic conflict", "Political violence"],
    era: "2000s",
    scores: [4, 2, 2, 3],
    rationales: [
      "Sustained trust between the two principal negotiating parties, evidenced by the accord's rapid conclusion under AU mediation.",
      "Elite settlement did not, on its own, restore inter-ethnic trust; a separate 16-month process was required to reach the Nakuru accord.",
      "Youth were disproportionately represented among perpetrators and victims, and no dedicated youth transmission mechanism was included.",
      "NCIC and TJRC created durable institutions under statute, though public trust in findings remained contested for years.",
    ],
  },
  {
    slug: "south-africa",
    title: "South Africa: The Truth and Reconciliation Commission",
    summary:
      "Established under the Promotion of National Unity and Reconciliation Act (1995) and chaired by Archbishop Desmond Tutu, the TRC placed public testimony and conditional amnesty at the centre of a national transition from apartheid.",
    region: "Africa",
    pillar: "Communal",
    threats: ["Political violence", "Post-conflict transition"],
    era: "1990s",
    scores: [3, 3, 2, 2],
    rationales: [
      "Public testimony created real, documented encounters between perpetrators and survivors, though many victims later reported the amnesty process felt inconsistent and insufficiently consultative.",
      "Widely regarded internationally as a model of restorative justice and explicitly invoked Ubuntu, though structural economic and land inequality between communities remains largely unaddressed three decades later.",
      "The Commission's mandate did not include a dedicated mechanism for transmitting its findings or its reconciliation ethic to generations born after 1994.",
      "Reparations recommendations have been extensively documented as unimplemented, and prosecutions have been affected by missing case files and alleged political interference.",
    ],
  },
  {
    slug: "tuvalu-kiribati",
    title: "Tuvalu & Kiribati: Climate Displacement",
    summary:
      "The Australia-Tuvalu Falepili Union (concluded 2023, in force 2024) and Kiribati's earlier migration-with-dignity policy attempt to preserve nationhood, statehood, and intergenerational continuity across the potential loss of habitable territory.",
    region: "Pacific",
    pillar: "Institutional",
    threats: ["Climate displacement", "Post-conflict transition"],
    era: "2020s",
    scores: [3, 3, 2, 4],
    rationales: [
      "Existing labor and family migration pathways, such as the Pacific Access Category, maintain individual-level ties between diaspora and origin communities, though these remain informal relative to the scale of the challenge.",
      "The documented contrast between Vaitupu's successful, tie-preserving relocation to Kioa and the more coercive Banaban relocation to Rabi shows communal bond outcomes depend heavily on whether relocation is voluntary and relationship-preserving by design.",
      "Surveys documenting that up to seventy percent of Kiribati and Tuvaluan households would migrate if conditions worsen suggest the human-land bond central to cultural identity is already under significant generational strain.",
      "The Falepili Union Treaty and Tuvalu's digital preservation of national institutions represent a proactive attempt to secure institutional and sovereign continuity even against the loss of physical territory itself.",
    ],
  },
];


const CROSS_PATTERNS: Record<string, string> = {
  "northern-ireland": "Strongest institutional bond of all eight; weakest generational bond.",
  "colombia": "Institutional bond strong, communal protection weak.",
  "cambodia": "Uniformly weak across all four levels after sixteen years and three convictions.",
  "liberia": "Communal repair strong, institutional follow-through weak.",
  "rwanda": "Communal participation high, institutional trust and generational transfer weak.",
  "kenya": "Elite bond strong, communal and generational weak.",
  "south-africa": "The doctrine's own Ubuntu foundation tested directly; interpersonal and communal breakthroughs, institutional follow-through weak.",
  "tuvalu-kiribati": "The doctrine's only prospective case; proactive institutional design ahead of an unresolved intergenerational threat.",
};

const DOMAINS = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"];

const REGIONS: Region[] = ["Africa", "Europe", "Latin America", "Southeast Asia", "Pacific"];
const PILLARS: Pillar[] = ["Interpersonal", "Communal", "Intergenerational", "Institutional"];
const THREATS: Threat[] = [
  "Ethnic conflict",
  "Civil war",
  "Genocide",
  "Political violence",
  "Post-conflict transition",
  "Climate displacement",
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
        description="Eight documented processes (Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya, South Africa, and Tuvalu & Kiribati) scored across the four bond domains of the Vinculum Continuum."
        path="/cases"
        image="/og/cases.jpg"
        keywords="peace process case studies, Northern Ireland, Colombia, Rwanda, Vinculum Continuum scoring, relational security case analysis, bond domains"
        scholarly
        citationTitle="Vinculum Security: Applied Case Engagement"
        jsonLd={sectionLd({
          path: "/cases",
          headline: "Vinculum Security: Applied Case Engagement",
          description:
            "Eight documented processes (Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya, South Africa, and Tuvalu & Kiribati) scored across the four bond domains of the Vinculum Continuum.",
          section: "Section VII — Cases",
        })}
      />
      <ReadingProgress />
      <div className="container">
        <PageHeader
          eyebrow="Section VII"
          title="Applied Case Engagement"
          lede="Eight documented processes across Africa, Latin America, Europe, Southeast Asia, and the Pacific. Filter by region, doctrine pillar, or threat type, and select up to three to compare side-by-side."
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

        <div className="grid gap-6 lg:grid-cols-2 pb-32">
          {filtered.map((c, i) => {
            const selected = compare.includes(c.slug);
            return (
              <FadeIn key={c.slug} delay={i * 40} className="h-full">
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

                  <div className="mt-auto overflow-x-auto -mx-1 px-1">
                    <table className="w-full text-sm border border-border">
                      <thead>
                        <tr className="bg-primary text-primary-foreground text-left">
                          <th className="px-3 py-2 font-serif font-medium">Bond Domain</th>
                          <th className="px-2 py-2 font-serif font-medium w-12 text-right">Score</th>
                          <th className="px-3 py-2 font-serif font-medium">Rationale</th>
                        </tr>
                      </thead>
                      <tbody>
                        {DOMAINS.map((d, idx) => (
                          <tr key={d} className={idx % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                            <td className="px-3 py-2 align-top font-medium text-primary text-[0.85rem]">{d}</td>
                            <td className="px-2 py-2 align-top text-right">
                              <span className="font-serif text-accent">{c.scores[idx]}</span>
                            </td>
                            <td className="px-3 py-2 align-top text-foreground/80 text-[0.82rem] leading-snug">
                              {c.rationales[idx]}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {c.slug === "rwanda" && (
                    <div className="mt-4 border-l-2 border-accent bg-gold-tint/40 p-4">
                      <p className="text-[10px] uppercase tracking-[0.22em] font-semibold text-accent">
                        Adversarial Rescoring · Worked Demonstration
                      </p>
                      <p className="mt-2 text-[0.85rem] leading-relaxed text-foreground/85">
                        The scores above were produced by a deliberate skeptical re-pass:
                        interpersonal was reduced from a sympathetic 4 to a 3 to reflect variance
                        between genuine and coerced apology; communal from a straightforwardly
                        strong reading to a contested 3; intergenerational assigned a 2 for a gap (the
                        bond between the 1994 generation and those born after) that earlier
                        readings had not scored at all. Offered as a demonstration of method, not
                        as a substitute for genuine third-party verification.
                      </p>
                    </div>
                  )}
                </article>
              </FadeIn>
            );
          })}
        </div>

        {/* Cross-Case Pattern Summary */}
        <FadeIn className="mb-24">
          <p className="eyebrow">VII.I · Cross-Case Pattern Summary</p>
          <hr className="gold-rule mt-4 mb-6" />
          <p className="text-muted-foreground mb-6 max-w-3xl">
            All thirty-two scores across the eight cases, ordered here with no case privileged as
            flagship.
          </p>
          <div className="overflow-x-auto border border-border">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground text-left">
                  <th className="px-3 py-3 font-serif font-medium">Case</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Interp.</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Communal</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Intergen.</th>
                  <th className="px-2 py-3 font-serif font-medium text-center">Instit.</th>
                  <th className="px-3 py-3 font-serif font-medium">Pattern</th>
                </tr>
              </thead>
              <tbody>
                {CASES.map((c, i) => (
                  <tr key={c.slug} className={i % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                    <td className="px-3 py-2 align-top font-medium text-primary whitespace-nowrap">
                      {c.title.split(": ")[0]}
                    </td>
                    {c.scores.map((s, j) => (
                      <td key={j} className="px-2 py-2 align-top text-center font-serif text-accent">
                        {s}
                      </td>
                    ))}
                    <td className="px-3 py-2 align-top text-foreground/80 text-[0.8rem] leading-snug">
                      {CROSS_PATTERNS[c.slug]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-5 text-sm italic text-foreground/70 max-w-3xl">
            The pattern holds across all eight cases: no case scores uniformly high, and Cambodia is
            the only case scoring uniformly low, making it the doctrine's single most important
            test case for the falsifiability standard.
          </p>
          <p className="mt-4 text-sm text-foreground/75 max-w-3xl">
            These eight processes, among them Rwanda, Colombia, and South Africa, are the major historical and ongoing
            case studies against which both the doctrine and its companion handbook have been tested.
          </p>

        </FadeIn>


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
                        {c.title.split(": ")[0]}
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
              Scores 1-5 per bond domain. Higher values indicate stronger observed bond integrity in
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
