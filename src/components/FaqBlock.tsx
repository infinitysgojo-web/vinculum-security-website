import FadeIn from "@/components/FadeIn";
import GoldRule from "@/components/GoldRule";
import { SITE_URL, PERSON_ID } from "@/lib/seo-entities";

export type FaqItem = { q: string; a: string };

/** Schema.org FAQPage built from the same items shown on the page. */
export function faqLd(path: string, items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${path}#faq`,
    url: `${SITE_URL}${path}`,
    author: { "@id": PERSON_ID },
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.q,
      acceptedAnswer: { "@type": "Answer", text: i.a },
    })),
  };
}

/** Visible direct-answer block. Text must match the faqLd items exactly. */
export default function FaqBlock({
  items,
  eyebrow = "Primary Determinations",
  title = "Questions & Direct Answers",
}: { items: FaqItem[]; eyebrow?: string; title?: string }) {
  return (
    <FadeIn className="max-w-3xl my-16">
      <p className="eyebrow">{eyebrow}</p>
      <GoldRule className="mt-4 mb-6" />
      <h2 className="font-serif text-2xl text-primary mb-4">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Answers stated by James Wesley Ndua, author and originator of Vinculum Security. Protected under statutory copyright law.
      </p>
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.q} className="p-5 border border-border/60 bg-card/40">
            <h3 className="font-serif text-base text-foreground mb-1.5 font-semibold">{i.q}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed m-0">{i.a}</p>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}
