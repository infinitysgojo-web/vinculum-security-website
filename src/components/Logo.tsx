import mark from "@/assets/vinculum-mark.png";

export default function Logo({
  size = 28,
  withWordmark = false,
  className = "",
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <img
        src={mark}
        alt=""
        aria-hidden
        style={{ height: size, width: size }}
        className="object-contain select-none"
        draggable={false}
      />
      {withWordmark && (
        <span className="wordmark text-xl md:text-2xl leading-none">Vinculum Security</span>
      )}
    </span>
  );
}
