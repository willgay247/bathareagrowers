import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCurrentUserRole, SECTIONS } from "@/hooks/useCurrentUserRole";
import { Loader2 } from "lucide-react";

interface MemberProfile {
  group_name: string;
  group_type: string | null;
  bio: string | null;
}

const MemberDashboard = () => {
  const { loading, isAdminOrAbove, isUser, permissions, userId } = useCurrentUserRole();
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("member_profiles")
      .select("group_name, group_type, bio")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data ?? null);
        setProfileLoading(false);
      });
  }, [userId]);

  if (loading || profileLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (isAdminOrAbove) {
    return <Navigate to="/admin" replace />;
  }

  if (!isUser) {
    return (
      <div className="rounded-lg border border-border bg-white p-8">
        <h1 className="text-2xl font-bold text-foreground">Welcome</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your account is being set up. If this persists, please contact the site admin.
        </p>
      </div>
    );
  }

  const pending = permissions.length === 0;

  if (pending) {
    return (
      <div className="rounded-lg border border-border bg-white p-8">
        <h1 className="text-2xl font-bold text-foreground">Awaiting approval</h1>
        <p className="mt-2 text-sm text-foreground">
          Thanks for signing up{profile?.group_name ? `, ${profile.group_name}` : ""}.
          An admin will review your account shortly. You'll be able to post events and
          manage your listing once you're approved.
        </p>
        {profile?.group_type && (
          <p className="mt-4 text-sm text-muted-foreground">
            Group type:{" "}
            <span className="font-semibold text-foreground">
              {SECTIONS.find((s) => s.key === profile.group_type)?.label ?? profile.group_type}
            </span>
          </p>
        )}
      </div>
    );
  }

  const canAdd = (section: string) =>
    permissions.some((p) => p.section === section && p.can_add);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome{profile?.group_name ? `, ${profile.group_name}` : ""}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Use the links below to manage your events and listing.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {canAdd("events") && (
          <Link
            to="/dashboard/events"
            className="block rounded-lg border border-border bg-white p-6 hover:border-accent"
          >
            <h2 className="text-lg font-bold text-foreground">Your events</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Post new events and edit your existing ones.
            </p>
          </Link>
        )}

        {profile?.group_type && canAdd(profile.group_type) && (
          <Link
            to="/dashboard/listing"
            className="block rounded-lg border border-border bg-white p-6 hover:border-accent"
          >
            <h2 className="text-lg font-bold text-foreground">Your listing</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your {SECTIONS.find((s) => s.key === profile.group_type)?.label ?? "group"} entry on the directory.
            </p>
          </Link>
        )}

        <Link
          to="/dashboard/profile"
          className="block rounded-lg border border-border bg-white p-6 hover:border-accent"
        >
          <h2 className="text-lg font-bold text-foreground">Profile</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Update your group name or bio.
          </p>
        </Link>
      </div>
    </div>
  );
};

export default MemberDashboard;
