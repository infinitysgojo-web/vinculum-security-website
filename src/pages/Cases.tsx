import SEO from "@/components/SEO";
import PageHeader from "@/components/PageHeader";
import FadeIn from "@/components/FadeIn";

type Case = {
  title: string;
  summary: string;
  scores: [number, number, number, number]; // Interp, Communal, Intergen, Instit
};

const CASES: Case[] = [
  {
    title: "Northern Ireland — The Good Friday Agreement",
    summary:
      "A power-sharing government has held, with interruptions, for over 25 years; dramatic reduction in lethal violence alongside documented intergenerational trauma.",
    scores: [4, 3, 2, 5],
  },
  {
    title: "Colombia — The 2016 Final Agreement",
    summary:
      "A dedicated ethnic and gender chapter, a Special Jurisdiction for Peace, and UN-monitored verification alongside persistent violence against social leaders.",
    scores: [3, 2, 3, 4],
  },
  {
    title: "Cambodia — The Extraordinary Chambers",
    summary:
      "A hybrid UN-Cambodian tribunal that operated for sixteen years and secured convictions against only three senior Khmer Rouge leaders.",
    scores: [2, 2, 2, 2],
  },
  {
    title: "Liberia — TRC and the Palava Hut",
    summary:
      "A Truth and Reconciliation Commission delivering its 2009 final report alongside disarmament of over 100,000 former combatants and revival of Palava Hut dialogue.",
    scores: [3, 4, 3, 2],
  },
  {
    title: "Rwanda — The Gacaca Courts",
    summary:
      "Roughly 12,000 community tribunals processed close to two million genocide-related cases between 2002 and 2012.",
    scores: [3, 3, 2, 2],
  },
  {
    title: "Kenya — The 2008 National Accord",
    summary:
      "AU Panel mediation under Kofi Annan produced the National Accord, followed by the NCIC and a 2012 Nakuru County Peace Accord addressing Rift Valley communal trust.",
    scores: [4, 2, 2, 3],
  },
];

const DOMAINS = ["Interpersonal", "Communal", "Intergenerational", "Institutional-Relational"];

export default function Cases() {
  return (
    <>
      <SEO
        title="Case Studies"
        description="Six documented processes — Northern Ireland, Colombia, Cambodia, Liberia, Rwanda, Kenya — each scored across the four bond domains of the Vinculum Continuum."
        path="/cases"
      />
      <div className="container">
        <PageHeader
          eyebrow="Section VII"
          title="Applied Case Engagement"
          lede="Six documented processes across Europe, Latin America, Southeast Asia, and Africa. Each is scored 1–5 across the four continuum levels using the doctrine's classification and scoring methodology."
        />

        <div className="grid gap-6 md:grid-cols-2 pb-8">
          {CASES.map((c, i) => (
            <FadeIn key={c.title} delay={i * 40}>
              <article className="bg-card border border-border p-6 md:p-7 h-full flex flex-col">
                <h2 className="font-serif text-primary text-xl">{c.title}</h2>
                <hr className="gold-rule gold-rule-short mt-3 mb-4" />
                <p className="text-[0.95rem] leading-relaxed text-foreground/85 mb-6">{c.summary}</p>

                <table className="w-full text-sm border border-border mt-auto">
                  <thead>
                    <tr className="bg-primary text-primary-foreground text-left">
                      <th className="px-3 py-2 font-serif font-medium">Bond Domain</th>
                      <th className="px-3 py-2 font-serif font-medium w-20 text-right">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DOMAINS.map((d, idx) => (
                      <tr key={d} className={idx % 2 === 0 ? "bg-background" : "bg-gold-tint"}>
                        <td className="px-3 py-2">{d}</td>
                        <td className="px-3 py-2 text-right font-serif text-accent">{c.scores[idx]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </FadeIn>
          ))}
        </div>
      </div>
    </>
  );
}
