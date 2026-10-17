/**
 * Discrete tactile audio for the chancellery terminal. Synthesised in the
 * browser with WebAudio oscillators: no audio files, nothing fetched.
 * Muted by default; the preference is kept in localStorage on this device.
 */

const KEY = "vs:sound_enabled";
const EVENT = "vs:sound-change";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) ctx = new Ctor();
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

export function soundEnabled(): boolean {
  try {
    return window.localStorage.getItem(KEY) === "true";
  } catch {
    return false;
  }
}

export function setSoundEnabled(on: boolean) {
  try {
    window.localStorage.setItem(KEY, on ? "true" : "false");
  } catch {
    /* storage unavailable: stay muted */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: on }));
}

export function onSoundChange(fn: (on: boolean) => void) {
  const h = (e: Event) => fn(Boolean((e as CustomEvent).detail));
  window.addEventListener(EVENT, h);
  return () => window.removeEventListener(EVENT, h);
}

function tone(freq: number, durationMs: number, peak: number, type: OscillatorType) {
  if (!soundEnabled()) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime;
  const osc = a.createOscillator();
  const gain = a.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(peak, t + 0.001);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + durationMs / 1000);
  osc.connect(gain).connect(a.destination);
  osc.start(t);
  osc.stop(t + durationMs / 1000 + 0.02);
}

/** A 4 ms damped 800 Hz click for slider increments and toggles. */
export function tick() {
  tone(800, 4, 0.12, "square");
}

/** A low resonant 120 Hz chime for vault saves and cleared stage gates. */
export function seal() {
  if (!soundEnabled()) return;
  tone(120, 900, 0.25, "sine");
  tone(240, 600, 0.06, "sine");
}
