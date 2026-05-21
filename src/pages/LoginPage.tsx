import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotMode, setForgotMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      setError(authError?.message ?? "Sign in failed.");
      setLoading(false);
      return;
    }

    const { data: roleRow } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", authData.user.id)
      .single();

    const role = roleRow?.role;
    if (role === "admin" || role === "super_admin") {
      navigate("/admin");
    } else {
      navigate("/dashboard");
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }
    setResetSent(true);
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-inverse px-4">
      <form
        onSubmit={forgotMode ? handleForgot : handleSubmit}
        className="w-full max-w-[400px] rounded-lg bg-white p-10 shadow-lg"
      >
        <h2 className="text-center text-2xl font-bold text-accent">Bath Area Growers</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          {forgotMode ? "Reset Password" : "Sign In"}
        </p>

        {resetSent ? (
          <div className="mt-8 text-center">
            <p className="text-sm text-foreground">
              If an account exists for <strong>{email}</strong>, you'll receive a password reset email shortly.
            </p>
            <button
              type="button"
              onClick={() => { setForgotMode(false); setResetSent(false); }}
              className="mt-4 text-sm font-semibold text-accent hover:underline"
            >
              Back to sign in
            </button>
          </div>
        ) : (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-8 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            />
            {!forgotMode && (
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="mt-4 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-accent text-sm font-semibold uppercase tracking-wider text-foreground-alt transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : forgotMode ? "Send Reset Link" : "Sign In"}
            </button>

            {error && (
              <p className="mt-4 text-center text-sm text-destructive">{error}</p>
            )}

            <div className="mt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => { setForgotMode(!forgotMode); setError(""); }}
                className="text-sm text-accent hover:underline"
              >
                {forgotMode ? "Back to sign in" : "Forgot password?"}
              </button>
              {!forgotMode && (
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link to="/signup" className="font-semibold text-accent hover:underline">
                    Sign up
                  </Link>
                </p>
              )}
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
