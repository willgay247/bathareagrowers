import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Garden = Tables<"community_gardens">;

interface Props {
  garden: Garden | null;
  onClose: () => void;
  onSaved: () => void;
}

const GardenFormModal = ({ garden, onClose, onSaved }: Props) => {
  const [name, setName] = useState(garden?.name ?? "");
  const [region, setRegion] = useState<string>(garden?.region ?? "west");
  const [bio, setBio] = useState(garden?.bio ?? "");
  const [externalLink, setExternalLink] = useState(garden?.external_link ?? "");
  const [displayOrder, setDisplayOrder] = useState(garden?.display_order ?? 0);
  const [imageUrl, setImageUrl] = useState(garden?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `gardens/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("cms-images")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
    setImageUrl(data.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }
    setSaving(true);
    setError("");

    const payload = {
      name,
      region,
      bio: bio || null,
      external_link: externalLink || null,
      display_order: displayOrder,
      image_url: imageUrl || null,
    };

    if (garden) {
      const { error: err } = await supabase
        .from("community_gardens")
        .update(payload)
        .eq("id", garden.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      const { error: err } = await supabase.from("community_gardens").insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-xl rounded-xl bg-white p-8 shadow-xl" style={{ fontFamily: "'Readex Pro', sans-serif" }}>
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#1E1E1E" }}>
          {garden ? "Edit Garden" : "Add New Garden"}
        </h2>

        <div className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label>Region *</Label>
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              <option value="west">West</option>
              <option value="central">Central</option>
              <option value="east">East</option>
            </select>
          </div>
          <div>
            <Label>Image</Label>
            {imageUrl && <img src={imageUrl} alt="Preview" className="mb-2 h-24 w-full rounded-lg object-cover" />}
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>External Link</Label>
            <Input value={externalLink} onChange={(e) => setExternalLink(e.target.value)} placeholder="https://..." />
          </div>
          <div>
            <Label>Display Order</Label>
            <Input type="number" value={displayOrder} onChange={(e) => setDisplayOrder(Number(e.target.value))} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-accent text-white hover:bg-accent/90">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {garden ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenFormModal;
