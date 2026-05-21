import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "file";
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

interface Props {
  title: string;
  table: string;
  storagePath?: string;
  imageField?: string;
  fields: FieldDef[];
  record: Record<string, any> | null;
  onClose: () => void;
  onSaved: () => void;
  createdBy?: string | null;
}

const SimpleFormModal = ({ title, table, storagePath, imageField = "image_url", fields, record, onClose, onSaved, createdBy }: Props) => {
  const initialValues: Record<string, any> = {};
  fields.forEach((f) => {
    if (f.type === "file") {
      initialValues[imageField] = record?.[imageField] ?? "";
    } else if (f.type === "number") {
      initialValues[f.key] = record?.[f.key] ?? 0;
    } else {
      initialValues[f.key] = record?.[f.key] ?? "";
    }
  });
  if (!initialValues[imageField] && fields.some((f) => f.type === "file")) {
    initialValues[imageField] = record?.[imageField] ?? "";
  }

  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: string, val: any) => setValues((prev) => ({ ...prev, [key]: val }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !storagePath) return;
    setUploading(true);
    const path = `${storagePath}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from("cms-images").upload(path, file, { upsert: true });
    if (uploadError) { setError(uploadError.message); setUploading(false); return; }
    const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
    set(imageField, data.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    for (const f of fields) {
      if (f.required && !values[f.key]?.toString().trim()) {
        setError(`${f.label} is required.`);
        return;
      }
    }
    setSaving(true);
    setError("");

    const payload: Record<string, any> = {};
    fields.forEach((f) => {
      if (f.type === "file") return;
      if (f.type === "number") payload[f.key] = Number(values[f.key]) || 0;
      else payload[f.key] = values[f.key]?.toString().trim() || null;
    });
    if (fields.some((f) => f.type === "file")) {
      payload[imageField] = values[imageField] || null;
    }

    if (record) {
      const { error: err } = await supabase.from(table as any).update(payload).eq("id", record.id);
      if (err) { setError(err.message); setSaving(false); return; }
    } else {
      // Set created_by for new records
      if (createdBy) payload.created_by = createdBy;
      const { error: err } = await supabase.from(table as any).insert(payload);
      if (err) { setError(err.message); setSaving(false); return; }
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-xl rounded-xl bg-white p-8 shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-foreground">
          {record ? `Edit ${title}` : `Add New ${title}`}
        </h2>
        <div className="space-y-4">
          {fields.map((f) => {
            if (f.type === "file") {
              return (
                <div key={f.key}>
                  <Label>{f.label}</Label>
                  {values[imageField] && (
                    <img src={values[imageField]} alt="Preview" className="mb-2 h-24 w-full rounded-lg object-cover" />
                  )}
                  <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  {uploading && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
                </div>
              );
            }
            if (f.type === "textarea") {
              return (
                <div key={f.key}>
                  <Label>{f.label}{f.required ? " *" : ""}</Label>
                  <Textarea value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} rows={f.rows ?? 4} placeholder={f.placeholder} />
                </div>
              );
            }
            if (f.type === "number") {
              return (
                <div key={f.key}>
                  <Label>{f.label}</Label>
                  <Input type="number" value={values[f.key] ?? 0} onChange={(e) => set(f.key, Number(e.target.value))} />
                </div>
              );
            }
            return (
              <div key={f.key}>
                <Label>{f.label}{f.required ? " *" : ""}</Label>
                <Input value={values[f.key] ?? ""} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} />
              </div>
            );
          })}
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving} className="bg-accent text-white hover:bg-accent/90">
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {record ? "Update" : "Create"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleFormModal;
