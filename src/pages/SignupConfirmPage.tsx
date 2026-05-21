import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface LocationState {
  email?: string;
}

const SignupConfirmPage = () => {
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;
  const [resending, setResending] = useState(false);
  const [resendStatus, setResendStatus] = useState<"idle" | "sent" | "error">("idle");
  const [resendError, setResendError] = useState("");

  const handleResend = async () => {
    if (!state.email) return;
    setResending(true);
    setResendError("");
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: state.email,
    });
    setResending(false);
    if (error) {
      setResendStatus("error");
      setResendError(error.message);
    } else {
      setResendStatus("sent");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background-inverse px-4">
      <div className="w-full max-w-[440px] rounded-lg bg-white p-10 shadow-lg text-center">
        <h2 className="text-2xl font-bold text-accent">Check your inbox</h2>
        <p className="mt-4 text-sm text-foreground">
          {state.email ? (
            <>We've sent a confirmation link to <strong>{state.email}</strong>.</>
          ) : (
            <>We've sent you a confirmation link.</>
          )}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Click the link to verify your email, then sign in to access your dashboard.
        </p>

        {state.email && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleResend}
              disabled={resending || resendStatus === "sent"}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2 text-sm font-semibold text-accent hover:bg-muted disabled:opacity-60"
            >
              {resending && <Loader2 className="h-4 w-4 animate-spin" />}
              {resendStatus === "sent" ? "Email sent — check your inbox" : "Resend confirmation email"}
            </button>
            {resendStatus === "error" && resendError && (
              <p className="mt-2 text-sm text-destructive">{resendError}</p>
            )}
          </div>
        )}

        <p className="mt-8 text-sm text-muted-foreground">
          <Link to="/login" className="font-semibold text-accent hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupConfirmPage;
