import FadeIn from "./FadeIn";

export default function NumeralDivider({ n, label }: { n: string; label?: string }) {
  return (
    <FadeIn className="my-16 md:my-20">
      <div className="flex items-center gap-6 w-full">
        <span className="flex-1 h-px bg-brass rule-draw origin-left" />
        <div className="flex flex-col items-center gap-1 min-w-[3rem]">
          <span className="font-serif text-brass text-3xl md:text-4xl numeral-glow leading-none">{n}</span>
          {label && (
            <span className="text-[9px] uppercase tracking-[0.28em] font-semibold text-primary/60">
              {label}
            </span>
          )}
        </div>
        <span className="flex-1 h-px bg-brass rule-draw origin-right" />
      </div>
    </FadeIn>
  );
}
