import { useEffect, useRef, useState } from "react";
import mark from "@/assets/vinculum-mark.png";

/**
 * First-load splash: Vinculum mark, "Pro Omni Humanitate" motto,
 * a slim brass loading bar, and the wordmark beneath the bar.
 * Self-contained fade-out, then unmounts via parent.
 */
export default function LoadingScreen({ onDone }: { onDone?: () => void }) {
  const [fading, setFading] = useState(false);
  const calledRef = useRef(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hold = reduce ? 200 : 1600;
    const fade = reduce ? 0 : 450;

    const fadeTimer = setTimeout(() => setFading(true), hold);
    const doneTimer = setTimeout(() => {
      if (!calledRef.current) {
        calledRef.current = true;
        onDone?.();
      }
    }, hold + fade);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onDone]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${
        fading ? "opacity-0" : "opacity-100"
      }`}
    >
      <img
        src={mark}
        alt=""
        aria-hidden
        className="object-contain select-none mb-7 motion-safe:animate-[numeralFade_900ms_ease-out_both]"
        style={{ height: 64, width: 64 }}
        draggable={false}
      />

      <p className="font-serif text-primary text-2xl md:text-3xl leading-none tracking-[-0.01em] mb-8">
        Pro Omni Humanitate
      </p>

      <div className="w-44 h-[3px] bg-border/70 overflow-hidden rounded-full">
        <div className="h-full bg-accent origin-left motion-safe:animate-[loadBar_1600ms_ease-out_forwards] motion-reduce:[animation:none] motion-reduce:!w-full" style={{ width: "0%" }} />
      </div>

      <span className="mt-4 text-[10px] uppercase tracking-[0.22em] font-semibold text-muted-foreground">
        Vinculum Security
      </span>

      <style>{`
        @keyframes loadBar {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
}
