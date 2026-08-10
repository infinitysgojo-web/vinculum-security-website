# Loading Screen

Add a first-load splash screen that matches the site's travertine/serif aesthetic, then fades out once the app is ready.

## What it shows
- Full-screen overlay on `bg-background` (travertine cream), centered column.
- The Vinculum mark (`src/assets/vinculum-mark.png`) at ~64px.
- **"Pro Omni Humanitate"** in Cormorant Garamond serif, primary imperial-blue color, letter-spacing matching the wordmark style.
- A slim loading bar: a thin track (`border` color) with an animated fill in brass/accent that grows 0→100% over ~1.6s using a CSS keyframe.
- Below the bar, the **"Vinculum Security"** wordmark in small caps eyebrow style (uppercase, tracked) as the subtext.
- Fades out (opacity transition) when loading completes, then unmounts.

## How it works
- New component `src/components/LoadingScreen.tsx` — a self-contained overlay that accepts nothing and manages its own fade-out via an internal timeout (~2s total: ~1.6s bar + short fade).
- In `src/App.tsx`, add `loading` state initialized `true`; render `<LoadingScreen />` above `<SiteHeader/>` while true, and a `useEffect` sets it `false` after the timeout. The overlay sits `fixed inset-0 z-[100]` so it covers everything until dismissed.
- Respects `prefers-reduced-motion`: bar fills instantly, no fade animation.

## Files
- Create `src/components/LoadingScreen.tsx`
- Edit `src/App.tsx` to mount it conditionally

## Scope
Frontend/presentation only. No backend, no routing changes, no new assets.
