import GoldRule from "./GoldRule";

export default function PageHeader({ eyebrow, title, lede }: { eyebrow: string; title: string; lede?: string }) {
  return (
    <header className="pt-16 pb-10">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-3 font-serif text-primary">{title}</h1>
      <GoldRule className="mt-6 rule-draw" />
      {lede && <p className="mt-6 max-w-3xl text-lg text-foreground/75">{lede}</p>}
    </header>
  );
}
