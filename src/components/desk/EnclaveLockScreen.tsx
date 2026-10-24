import { useEffect, useRef, useState } from "react";
import { Lock, LockOpen } from "lucide-react";
import { unsealEnclave } from "@/lib/chancelleryEnclave";

/**
 * Shown in place of the desks after the idle seal: the working state and the key
 * have been cleared from memory, and only the enclave passphrase restores them.
 */
export default function EnclaveLockScreen({ onSignOut }: { onSignOut: () => void }) {
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const field = useRef<HTMLInputElement>(null);
  // On unmount the passphrase field is emptied in the DOM as well, so no typed passphrase
  // outlives the lock screen in a detached input. (A JavaScript string cannot be zeroized;
  // the Web Crypto import zeroizes its own encoded bytes.)
  useEffect(() => {
    const el = field.current;
    return () => {
      if (el) el.value = "";
    };
  }, []);
  return (
    <div className="container py-16 sm:py-24" data-testid="enclave-lock-screen">
      <div className="mx-auto max-w-xl border-2 border-double border-brass bg-card/60 p-4 sm:p-5">
        <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] font-semibold text-accent">
          <Lock size={13} /> Sovereign enclave
        </p>
        <h1 className="mt-3 font-serif text-2xl text-primary leading-tight" data-testid="enclave-sealed-message">
          SESSION SEALED · Enter enclave passphrase to restore operational desks.
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The desks, binder and session ledger were cleared from memory and sealed in this browser with AES-256-GCM.
        </p>
        <form
          className="mt-6 grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");
            try {
              await unsealEnclave(pass);
              setPass("");
            } catch (err) {
              setError(err instanceof Error ? err.message : "The enclave could not be unsealed.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <div className="min-w-0">
            <label htmlFor="enclave-restore" className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70">
              Enclave passphrase
            </label>
            <input
              id="enclave-restore"
              ref={field}
              type="password"
              autoComplete="current-password"
              autoFocus
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full min-w-0 border border-input bg-background px-3 py-2.5 text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            data-testid="enclave-restore-submit"
            className="inline-flex min-h-11 items-center justify-center gap-2 border border-brass/50 px-4 text-[10px] uppercase tracking-[0.18em] font-semibold text-primary hover:border-accent hover:text-accent disabled:opacity-50"
          >
            <LockOpen size={13} /> Restore desks
          </button>
        </form>
        {error && (
          <p role="alert" className="mt-4 border border-destructive px-3 py-2 text-xs text-destructive" data-testid="enclave-restore-error">
            {error}
          </p>
        )}
        <button type="button" onClick={onSignOut} className="mt-6 text-[10px] uppercase tracking-[0.18em] font-semibold text-accent hover:underline">
          Sign out instead
        </button>
      </div>
    </div>
  );
}
