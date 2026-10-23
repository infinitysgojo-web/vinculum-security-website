import { useState } from "react";

/** Medium cover image that falls back to the VS panel if the image cannot load. */
export default function DispatchCover({ src, large = false }: { src: string | null; large?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    return (
      <div className="aspect-[16/9] bg-gradient-to-br from-navy-tint to-gold-tint flex items-center justify-center">
        <span className={`font-serif ${large ? "text-4xl" : "text-3xl"} text-brass/50`}>VS</span>
      </div>
    );
  }
  return (
    <div className="aspect-[16/9] overflow-hidden bg-muted">
      <img
        src={src}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
    </div>
  );
}
