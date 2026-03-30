import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    // Also check hash for type=recovery
    if (window.location.hash.includes("type=recovery")) {
      setReady(true);
    }
    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    if (err) { setError(err.message); setLoading(false); return; }
    setSuccess(true);
    setLoading(false);
  };

  if (!ready && !success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-inverse px-4">
        <div className="w-full max-w-[400px] rounded-lg bg-white p-10 shadow-lg text-center">
          <p className="text-sm text-muted-foreground">Verifying reset link…</p>
          <Loader2 className="mx-auto mt-4 h-6 w-6 animate-spin text-accent" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-inverse px-4">
      <div className="w-full max-w-[400px] rounded-lg bg-white p-10 shadow-lg">
        <h2 className="text-center text-2xl font-bold text-accent">Set New Password</h2>

        {success ? (
          <div className="mt-6 text-center">
            <p className="text-sm text-foreground">Your password has been updated.</p>
            <a href="/admin/login" className="mt-4 inline-block text-sm font-semibold text-accent hover:underline">
              Back to login
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              className="w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center rounded-md bg-accent text-sm font-semibold uppercase tracking-wider text-foreground-alt transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Update Password"}
            </button>
            {error && <p className="text-center text-sm text-destructive">{error}</p>}
          </form>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
