export default function GoldRule({ full = false, className = "" }: { full?: boolean; className?: string }) {
  return <hr className={`gold-rule ${full ? "w-full" : "gold-rule-short"} ${className}`} />;
}
