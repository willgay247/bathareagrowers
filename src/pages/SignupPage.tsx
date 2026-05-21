import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { SECTIONS } from "@/hooks/useCurrentUserRole";

const groupTypeOptions = SECTIONS
  .filter((s) => s.key !== "contacts" && s.key !== "events")
  .map((s) => ({ value: s.key, label: s.label }));

const SignupPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedGroupName = groupName.trim();
    if (trimmedGroupName.length < 2 || trimmedGroupName.length > 80) {
      setError("Group name must be 2 to 80 characters.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          group_name: trimmedGroupName,
          group_type: groupType || null,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    navigate("/signup/confirm", { state: { email } });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-inverse px-4 py-12">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[440px] rounded-lg bg-white p-10 shadow-lg"
      >
        <h2 className="text-center text-2xl font-bold text-accent">Bath Area Growers</h2>
        <p className="mt-1 text-center text-sm text-muted-foreground">
          Create your group's account
        </p>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          After confirming your email, an admin will review your account.
          Once approved you can post your own events and manage your listing.
        </p>

        <label className="mt-6 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Group / organisation name
          </span>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
            placeholder="e.g. Bath Organic Group"
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            What kind of group?
          </span>
          <select
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Not sure yet</option>
            {groupTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Email
          </span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Password
          </span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            placeholder="At least 8 characters"
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 flex h-12 w-full items-center justify-center rounded-md bg-accent text-sm font-semibold uppercase tracking-wider text-foreground-alt transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
        </button>

        {error && (
          <p className="mt-4 text-center text-sm text-destructive">{error}</p>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
