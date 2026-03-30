import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import type { Session } from "@supabase/supabase-js";

const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [hasRole, setHasRole] = useState<boolean | null>(null);
  const [authReady, setAuthReady] = useState(false);

  // Step 1: Restore session from storage first, then listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthReady(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setAuthReady(true);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Step 2: Once we have a session, check the role in a separate effect
  useEffect(() => {
    if (!authReady) return;

    if (!session?.user) {
      setHasRole(false);
      return;
    }

    let cancelled = false;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single()
      .then(({ data }) => {
        if (!cancelled) setHasRole(!!data);
      });

    return () => { cancelled = true; };
  }, [authReady, session?.user?.id]);

  const loading = !authReady || (session?.user && hasRole === null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-inverse">
        <Loader2 className="h-8 w-8 animate-spin text-foreground-alt" />
      </div>
    );
  }

  if (!session || !hasRole) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};

export default AdminAuthGuard;
