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
  const [bio, setBio] = useState("");
  const [applicantMessage, setApplicantMessage] = useState("");
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
    const trimmedMessage = applicantMessage.trim();
    if (trimmedMessage.length < 10) {
      setError("Please tell us a little about why you'd like an account (at least 10 characters).");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login`,
        data: {
          group_name: trimmedGroupName,
          group_type: groupType || null,
          bio: bio.trim() || null,
          applicant_message: trimmedMessage,
        },
      },
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Notify the site admin (best-effort; failure here shouldn't block signup)
    if (signUpData.user?.id) {
      try {
        await supabase.functions.invoke("send-notification", {
          body: { kind: "new_signup", user_id: signUpData.user.id },
        });
      } catch (notifyErr) {
        console.warn("admin notification failed:", notifyErr);
      }
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

        <label htmlFor="signup-group-name" className="mt-6 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Group / organisation name
          </span>
          <input
            id="signup-group-name"
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

        <label htmlFor="signup-group-type" className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            What kind of group?
          </span>
          <select
            id="signup-group-type"
            value={groupType}
            onChange={(e) => setGroupType(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          >
            <option value="">Not sure yet (you can update this later)</option>
            {groupTypeOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="signup-bio" className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Tell us about your group <span className="text-muted-foreground font-normal normal-case">(optional)</span>
          </span>
          <textarea
            id="signup-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
            placeholder="A short description of what your group does"
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />
        </label>

        <label htmlFor="signup-applicant-message" className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Why do you want an account? <span className="text-destructive">*</span>
          </span>
          <textarea
            id="signup-applicant-message"
            value={applicantMessage}
            onChange={(e) => setApplicantMessage(e.target.value)}
            required
            rows={3}
            minLength={10}
            maxLength={1000}
            placeholder="E.g. We're a community garden in Larkhall and want to post our weekly open days."
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-y"
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            This helps the admin decide whether to approve your account. Approval usually takes 24–48 hours.
          </span>
        </label>

        <label htmlFor="signup-email" className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Email
          </span>
          <input
            id="signup-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-1 w-full rounded-md border border-border bg-white px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </label>

        <label htmlFor="signup-password" className="mt-4 block">
          <span className="text-xs font-semibold uppercase tracking-wider text-foreground">
            Password
          </span>
          <input
            id="signup-password"
            type="password"
            autoComplete="new-password"
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
