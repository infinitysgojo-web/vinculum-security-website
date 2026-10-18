import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import SEO from "@/components/SEO";
import { rememberCredential, verifyOffline, hasOfflineCredential, clearOfflineSession, isNetworkFailure } from "@/lib/offlineAuth";

const MAX_ATTEMPTS = 3;
const LOCK_SECONDS = 60;
const MIN_FILL_MS = 1200;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trap, setTrap] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockLeft, setLockLeft] = useState(0);
  const mountedAt = useRef(Date.now());
  const navigate = useNavigate();
  // Carries an Atlas case hydration through sign-in, so it reaches the dashboard.
  const carried = useLocation().state;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true, state: carried });
    });
  }, [navigate]);

  useEffect(() => {
    if (lockLeft <= 0) return;
    const t = setTimeout(() => setLockLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [lockLeft]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy || lockLeft > 0) return;

    // Silent bot screens: hidden decoy field and impossibly fast submission.
    if (trap.trim() !== "" || Date.now() - mountedAt.current < MIN_FILL_MS) {
      setError("Those credentials were not recognised. Please check and try again.");
      return;
    }

    setBusy(true);
    setError(null);
    const fail = () => {
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_ATTEMPTS) {
        setAttempts(0);
        setLockLeft(LOCK_SECONDS);
        setError("Too many failed attempts. This terminal is held for one minute.");
      } else {
        setError("Those credentials were not recognised. Please check and try again.");
      }
    };
    const offlineEntry = async () => {
      const ok = await verifyOffline(email, password);
      setBusy(false);
      if (!ok) {
        if (!hasOfflineCredential()) {
          setError("No connection. Sign in once while online to enable offline access on this device.");
          return;
        }
        fail();
        return;
      }
      setAttempts(0);
      navigate("/dashboard", { replace: true, state: carried });
    };

    if (!navigator.onLine) {
      await offlineEntry();
      return;
    }

    let result: Awaited<ReturnType<typeof supabase.auth.signInWithPassword>>;
    try {
      result = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    } catch (err) {
      await offlineEntry();
      return;
    }
    const { data, error } = result;

    if (error) {
      if (isNetworkFailure(error.message)) {
        await offlineEntry();
        return;
      }
      setBusy(false);
      fail();
      return;
    }

    if (data.user) await rememberCredential(email, password, data.user.id);
    clearOfflineSession();
    setBusy(false);
    setAttempts(0);
    navigate("/dashboard", { replace: true, state: carried });
  };

  const locked = lockLeft > 0;

  return (
    <>
      <SEO title="Practitioner Portal" description="Private access to the Vinculum working desks." path="/login" noIndex />
      <div className="container py-20 flex justify-center">
        <div className="w-full max-w-md border border-brass/40 bg-navy-tint/40 p-7 md:p-9">
          <div className="flex items-center gap-3">
            <Logo size={28} />
            <span className="wordmark text-xl leading-none">Vinculum Security</span>
          </div>
          <p className="eyebrow mt-6">Practitioner Portal</p>
          <h1 className="mt-3 font-serif text-primary text-2xl">The Vinculum Dashboard</h1>
          <GoldRule className="mt-4 mb-6" />
          <p className="text-sm text-muted-foreground mb-6">
            Access is by credential only. The working desks are not open to the public record.
          </p>

          <form onSubmit={submit} className="space-y-4" autoComplete="off">
            <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-px w-px overflow-hidden">
              <label htmlFor="company-reference">Company reference</label>
              <input
                id="company-reference"
                name="company-reference"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={trap}
                onChange={(e) => setTrap(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="email" className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2.5 text-base sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="text-[10px] uppercase tracking-[0.22em] font-semibold text-primary/70 mb-2 block">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-input bg-background px-3 py-2.5 text-base sm:text-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            {locked && (
              <p className="text-xs text-muted-foreground">
                Sign-in reopens in {lockLeft} second{lockLeft === 1 ? "" : "s"}.
              </p>
            )}
            <button
              type="submit"
              disabled={busy || locked}
              className="w-full border border-accent/60 px-4 py-3 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60"
            >
              {locked ? `Held · ${lockLeft}s` : busy ? "Verifying…" : "Enter the dashboard"}
            </button>
          </form>

          <p className="mt-6 text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Unauthorised access is prohibited. Sessions close after 20 minutes idle.
          </p>
        </div>
      </div>
    </>
  );
}
