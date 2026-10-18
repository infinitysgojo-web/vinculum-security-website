import { useState } from "react";
import { ChevronDown, KeyRound, Lock, LockOpen } from "lucide-react";
import { toast } from "sonner";
import {
  IDLE_OPTIONS,
  DEFAULT_IDLE_MINUTES,
  SENTINEL_SIGN_OUT_MINUTES,
  MIN_PASSPHRASE,
  changeEnclavePassphrase,
  clearEnclavePassphrase,
  lockEnclave,
  setEnclavePassphrase,
  setIdleMinutes,
  unsealEnclave,
  useEnclave,
  type IdleMinutes,
} from "@/lib/chancelleryEnclave";

const field = "w-full min-w-0 border border-input bg-background px-3 py-2.5 text-sm";
const label = "text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-1.5 block";
const btn =
  "inline-flex items-center justify-center gap-2 border border-brass/50 px-3 py-2 min-h-11 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50";

const errText = (e: unknown) => (e instanceof Error ? e.message : "The enclave operation failed.");

/**
 * Sovereign Enclave Security: set, unseal, change and clear the mission
 * passphrase, and the idle seal. The passphrase never leaves this component's
 * input fields and the in-memory key; it is never stored.
 */
export default function EnclaveSecurityDrawer({ sealedCount }: { sealedCount: number }) {
  const enclave = useEnclave();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [next, setNext] = useState("");
  const [mode, setMode] = useState<"idle" | "change" | "clear">("idle");

  const reset = () => {
    setPass("");
    setConfirm("");
    setNext("");
    setError("");
  };

  const act = async (job: () => Promise<void>, ok: string) => {
    setBusy(true);
    setError("");
    try {
      await job();
      reset();
      setMode("idle");
      toast.success(ok);
    } catch (e) {
      setError(errText(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-t border-brass/30 min-w-0" data-testid="enclave-drawer">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="enclave-drawer-body"
        className="flex w-full min-h-11 items-center justify-between gap-3 px-4 py-2 text-left text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/80 hover:text-accent"
      >
        <span className="inline-flex items-center gap-2">
          <KeyRound size={13} className="text-accent" /> Sovereign Enclave Security
        </span>
        <ChevronDown size={13} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div id="enclave-drawer-body" className="space-y-5 px-4 pb-5 min-w-0">
          <p className="max-w-3xl text-xs text-muted-foreground leading-relaxed">
            With a passphrase set, every theatre saved to the library is sealed with AES-256-GCM under a key derived in
            this browser (PBKDF2-SHA-256, 310,000 iterations, a fresh salt and IV per record; records sealed earlier at 100,000 are re-sealed on unseal). The passphrase and key are
            held in memory only and are gone when the tab closes. There is no recovery: a lost passphrase means the sealed
            theatres cannot be opened.
          </p>

          {!enclave.configured && (
            <form
              className="grid gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end min-w-0"
              onSubmit={(e) => {
                e.preventDefault();
                if (pass !== confirm) return setError("The two passphrases do not match.");
                void act(() => setEnclavePassphrase(pass), "Enclave sealed. The theatre library is now encrypted at rest.");
              }}
            >
              <div className="min-w-0">
                <label className={label} htmlFor="enclave-new">Mission passphrase</label>
                <input id="enclave-new" type="password" autoComplete="new-password" className={field} value={pass} onChange={(e) => setPass(e.target.value)} minLength={MIN_PASSPHRASE} required />
              </div>
              <div className="min-w-0">
                <label className={label} htmlFor="enclave-confirm">Confirm passphrase</label>
                <input id="enclave-confirm" type="password" autoComplete="new-password" className={field} value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={MIN_PASSPHRASE} required />
              </div>
              <button type="submit" className={btn} disabled={busy} data-testid="enclave-set">
                <Lock size={13} /> Set passphrase
              </button>
            </form>
          )}

          {enclave.configured && !enclave.unlocked && (
            <form
              className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end min-w-0"
              onSubmit={(e) => {
                e.preventDefault();
                void act(() => unsealEnclave(pass), "Enclave unsealed for this tab.");
              }}
            >
              <div className="min-w-0">
                <label className={label} htmlFor="enclave-unseal">
                  Enclave passphrase · {sealedCount} sealed {sealedCount === 1 ? "theatre" : "theatres"}
                </label>
                <input id="enclave-unseal" type="password" autoComplete="current-password" className={field} value={pass} onChange={(e) => setPass(e.target.value)} required />
              </div>
              <button type="submit" className={btn} disabled={busy} data-testid="enclave-unseal">
                <LockOpen size={13} /> Unseal
              </button>
            </form>
          )}

          {enclave.configured && enclave.unlocked && (
            <div className="space-y-4 min-w-0">
              <div className="flex flex-wrap gap-2">
                <button type="button" className={btn} onClick={() => { lockEnclave(); toast.success("Key cleared from memory. The library stays sealed."); }} data-testid="enclave-lock">
                  <Lock size={13} /> Seal now
                </button>
                <button type="button" className={`${btn} ${mode === "change" ? "border-accent text-accent" : ""}`} onClick={() => { reset(); setMode(mode === "change" ? "idle" : "change"); }}>
                  Change passphrase
                </button>
                <button type="button" className={`${btn} ${mode === "clear" ? "border-accent text-accent" : ""}`} onClick={() => { reset(); setMode(mode === "clear" ? "idle" : "clear"); }}>
                  Clear passphrase
                </button>
              </div>
              {mode === "change" && (
                <form
                  className="grid gap-3 sm:grid-cols-3 min-w-0"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (next !== confirm) return setError("The two new passphrases do not match.");
                    void act(() => changeEnclavePassphrase(pass, next), "Passphrase changed. Every record was re-sealed.");
                  }}
                >
                  <div className="min-w-0">
                    <label className={label} htmlFor="enclave-current">Current passphrase</label>
                    <input id="enclave-current" type="password" autoComplete="current-password" className={field} value={pass} onChange={(e) => setPass(e.target.value)} required />
                  </div>
                  <div className="min-w-0">
                    <label className={label} htmlFor="enclave-next">New passphrase</label>
                    <input id="enclave-next" type="password" autoComplete="new-password" className={field} value={next} onChange={(e) => setNext(e.target.value)} minLength={MIN_PASSPHRASE} required />
                  </div>
                  <div className="min-w-0">
                    <label className={label} htmlFor="enclave-next-confirm">Confirm new</label>
                    <input id="enclave-next-confirm" type="password" autoComplete="new-password" className={field} value={confirm} onChange={(e) => setConfirm(e.target.value)} minLength={MIN_PASSPHRASE} required />
                  </div>
                  <button type="submit" className={`${btn} sm:col-span-3 sm:justify-self-start`} disabled={busy}>Re-seal under new passphrase</button>
                </form>
              )}
              {mode === "clear" && (
                <form
                  className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end min-w-0"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void act(() => clearEnclavePassphrase(pass), "Passphrase cleared. The library is stored in plaintext in this browser.");
                  }}
                >
                  <div className="min-w-0">
                    <label className={label} htmlFor="enclave-clear">Current passphrase · records return to plaintext local storage</label>
                    <input id="enclave-clear" type="password" autoComplete="current-password" className={field} value={pass} onChange={(e) => setPass(e.target.value)} required />
                  </div>
                  <button type="submit" className={btn} disabled={busy}>Clear passphrase</button>
                </form>
              )}
            </div>
          )}

          {error && (
            <p role="alert" className="border border-destructive px-3 py-2 text-xs text-destructive" data-testid="enclave-error">
              {error}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 border-t border-border/60 pt-4 min-w-0">
            <label htmlFor="enclave-idle" className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
              Idle seal
            </label>
            <select
              id="enclave-idle"
              data-testid="enclave-idle"
              className="min-h-11 border border-input bg-background px-3 text-sm disabled:opacity-50"
              value={enclave.configured ? enclave.idleMinutes : 0}
              disabled={!enclave.configured}
              onChange={(e) => setIdleMinutes(Number(e.target.value) as IdleMinutes)}
            >
              {IDLE_OPTIONS.map((m) => (
                <option key={m} value={m}>{m === 0 ? "Off (sign out)" : `${m} min${m === DEFAULT_IDLE_MINUTES ? " (default)" : ""}`}</option>
              ))}
            </select>
            <p className="min-w-0 flex-1 basis-56 text-xs text-muted-foreground">
              {enclave.configured
                ? enclave.idleMinutes > 0
                  ? "After this long without input, the Chancellery Sentinel seals the desks: they are cleared from memory and the key is dropped until the passphrase is entered again."
                  : `Idle seal off: after ${SENTINEL_SIGN_OUT_MINUTES} minutes without input the terminal signs out instead, and unsaved work is lost.`
                : `Set a passphrase to enable the idle seal. Until then an idle terminal signs out after ${SENTINEL_SIGN_OUT_MINUTES} minutes.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
