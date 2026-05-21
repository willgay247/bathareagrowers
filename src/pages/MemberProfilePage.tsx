import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCurrentUserRole, SECTIONS } from "@/hooks/useCurrentUserRole";
import { Loader2 } from "lucide-react";

const MemberProfilePage = () => {
  const { userId, loading: roleLoading } = useCurrentUserRole();
  const [groupName, setGroupName] = useState("");
  const [groupType, setGroupType] = useState<string | null>(null);
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (roleLoading || !userId) return;
    supabase
      .from("member_profiles")
      .select("group_name, group_type, bio")
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setGroupName(data?.group_name ?? "");
        setGroupType(data?.group_type ?? null);
        setBio(data?.bio ?? "");
        setLoading(false);
      });
  }, [roleLoading, userId]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const trimmedName = groupName.trim();
    if (trimmedName.length < 2 || trimmedName.length > 80) {
      setError("Group name must be 2 to 80 characters.");
      return;
    }
    setError("");
    setSaving(true);
    setStatus("idle");
    const { error: updateError } = await supabase
      .from("member_profiles")
      .update({ group_name: trimmedName, bio: bio || null })
      .eq("user_id", userId);
    setSaving(false);
    if (updateError) {
      setStatus("error");
      setError(updateError.message);
    } else {
      setStatus("saved");
    }
  };

  if (roleLoading || loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  const groupTypeLabel = groupType
    ? SECTIONS.find((s) => s.key === groupType)?.label ?? groupType
    : "Not set";

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Update your group's public details. The group type is set by an admin and isn't editable here.
      </p>

      <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-lg border border-border bg-white p-6">
        <div>
          <Label htmlFor="group_name">Group / organisation name</Label>
          <Input
            id="group_name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
            minLength={2}
            maxLength={80}
          />
        </div>

        <div>
          <Label>Group type</Label>
          <p className="mt-1 text-sm text-muted-foreground">{groupTypeLabel}</p>
        </div>

        <div>
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            placeholder="A short description of your group"
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
        {status === "saved" && <p className="text-sm text-green-700">Profile saved.</p>}

        <Button
          type="submit"
          disabled={saving}
          className="bg-accent text-foreground-alt hover:bg-accent/90"
        >
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save changes
        </Button>
      </form>
    </div>
  );
};

export default MemberProfilePage;
