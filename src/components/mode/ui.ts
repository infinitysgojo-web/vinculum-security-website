import { useEffect, useState } from "react";

/** Shared class strings for the mode shell, built only from semantic tokens. */
export const btn =
  "inline-flex min-h-10 items-center justify-center gap-1.5 border border-brass/50 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-brass/50 disabled:hover:text-primary";
export const btnPrimary =
  "inline-flex min-h-10 items-center justify-center gap-1.5 border border-primary bg-primary px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";
export const fieldCls =
  "w-full border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
export const labelCls = "mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.2em] text-primary/70";
export const eyebrowCls = "text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground";

export type NetworkState = { online: boolean; cached: boolean | null };

/**
 * What the browser itself reports: navigator.onLine, and whether a service worker
 * controls this page (the app's offline copy). null means the browser cannot say.
 */
export function useNetworkState(): NetworkState {
  const read = (): NetworkState => ({
    online: typeof navigator === "undefined" ? true : navigator.onLine,
    cached: typeof navigator !== "undefined" && "serviceWorker" in navigator ? !!navigator.serviceWorker.controller : null,
  });
  const [s, setS] = useState<NetworkState>(read);
  useEffect(() => {
    const on = () => setS(read());
    window.addEventListener("online", on);
    window.addEventListener("offline", on);
    navigator.serviceWorker?.addEventListener?.("controllerchange", on);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", on);
      navigator.serviceWorker?.removeEventListener?.("controllerchange", on);
    };
  }, []);
  return s;
}

/** Local time for a stored ISO stamp. */
export const localStamp = (iso?: string) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.toLocaleString();
};
