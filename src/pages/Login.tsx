import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Logo from "@/components/Logo";
import GoldRule from "@/components/GoldRule";
import SEO from "@/components/SEO";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate("/dashboard", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setBusy(false);
    if (error) {
      setError("Those credentials were not recognised. Please check and try again.");
      return;
    }
    navigate("/dashboard", { replace: true });
  };

  return (
    <>
      <SEO title="Practitioner Portal" description="Private access to the Vinculum working desks." path="/login" noindex />
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

          <form onSubmit={submit} className="space-y-4">
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
                className="w-full border border-input bg-background px-3 py-2.5 text-sm"
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
                className="w-full border border-input bg-background px-3 py-2.5 text-sm"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="w-full border border-accent/60 px-4 py-3 text-[10px] uppercase tracking-[0.22em] font-semibold text-accent hover:bg-accent hover:text-accent-foreground transition-colors disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Enter the dashboard"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
