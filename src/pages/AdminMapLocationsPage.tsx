import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type Row = Tables<"map_locations">;

const CATEGORIES = [
  { key: "grower", label: "Grower" },
  { key: "allotment", label: "Allotment" },
  { key: "retail", label: "Retail" },
  { key: "distributor", label: "Distributor" },
  { key: "community", label: "Community resource" },
  { key: "wildlife", label: "Wildlife" },
  { key: "climate", label: "Climate" },
  { key: "energy", label: "Energy" },
  { key: "skills", label: "Skills & repair" },
];

const REASONS = [
  { key: "district_wide", label: "Works across the whole district" },
  { key: "no_single_site", label: "Network with no growing site of its own" },
  { key: "not_published", label: "No address published anywhere" },
  { key: "privacy_hold", label: "Private address — needs consent first" },
];

const ORG_TYPES = ["charity", "cic", "community", "commercial"];

const blank: Partial<Row> = {
  slug: "", name: "", area: "", address: "", postcode: "",
  latitude: null, longitude: null, categories: [], org_type: null,
  status: "unmapped", unmapped_reason: "not_published",
  pin_precision: null, location_note: "", external_link: "", source_url: "",
  hidden: false,
};

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const AdminMapLocationsPage = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Partial<Row> | null>(null);
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "mapped" | "unmapped">("all");

  const load = async () => {
    const { data, error } = await supabase.from("map_locations").select("*").order("name");
    if (error) toast.error(error.message);
    else setRows(data ?? []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const shown = useMemo(
    () => (filter === "all" ? rows : rows.filter((r) => r.status === filter)),
    [rows, filter],
  );

  const counts = useMemo(() => ({
    mapped: rows.filter((r) => r.status === "mapped").length,
    unmapped: rows.filter((r) => r.status === "unmapped").length,
  }), [rows]);

  /** Look up a full UK postcode's coordinates. Free, no API key. */
  const geocodePostcode = async () => {
    const pc = editing?.postcode?.trim();
    if (!pc) return toast.error("Enter a postcode first");
    try {
      const res = await fetch(`https://api.postcodes.io/postcodes/${encodeURIComponent(pc)}`);
      if (!res.ok) throw new Error("Postcode not found");
      const { result } = await res.json();
      setEditing((e) => ({
        ...e!,
        latitude: result.latitude,
        longitude: result.longitude,
        status: "mapped",
        unmapped_reason: null,
        pin_precision: e?.pin_precision ?? "approx",
      }));
      toast.success(`Found ${result.admin_district} — pin set to the postcode centre`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Lookup failed");
    }
  };

  /** Mirrors the CHECK constraints so mistakes surface here, not as a 400. */
  const validate = (r: Partial<Row>): string | null => {
    if (!r.name?.trim()) return "Name is required";
    if (!r.slug?.trim()) return "Slug is required";
    if (!r.categories?.length) return "Pick at least one category";
    if (r.status === "mapped") {
      if (r.latitude == null || r.longitude == null)
        return "A pinned project needs both a latitude and a longitude";
      if (r.latitude < -90 || r.latitude > 90) return "Latitude must be between -90 and 90";
      if (r.longitude < -180 || r.longitude > 180) return "Longitude must be between -180 and 180";
    } else if (!r.unmapped_reason) {
      return "Say why this project isn't pinned";
    }
    if (r.unmapped_reason === "privacy_hold" && (r.address || r.postcode || r.latitude != null))
      return "A privacy hold must have no address, postcode or coordinates — that's the point of it";
    return null;
  };

  const save = async () => {
    if (!editing) return;
    const problem = validate(editing);
    if (problem) return toast.error(problem);

    setSaving(true);
    const payload = {
      ...editing,
      slug: editing.slug || slugify(editing.name ?? ""),
      // Keep the two states from contradicting each other.
      unmapped_reason: editing.status === "mapped" ? null : editing.unmapped_reason,
      pin_precision: editing.status === "mapped" ? (editing.pin_precision ?? "approx") : null,
    };
    const { error } = editing.id
      ? await supabase.from("map_locations").update(payload).eq("id", editing.id)
      : await supabase.from("map_locations").insert(payload as Row);

    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Saved" : "Added");
    setEditing(null);
    load();
  };

  const toggleHidden = async (row: Row) => {
    const { error } = await supabase
      .from("map_locations").update({ hidden: !row.hidden }).eq("id", row.id);
    if (error) return toast.error(error.message);
    load();
  };

  const remove = async (row: Row) => {
    if (!confirm(`Delete ${row.name}? This can't be undone.`)) return;
    const { error } = await supabase.from("map_locations").delete().eq("id", row.id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const set = <K extends keyof Row>(k: K, v: Row[K]) => setEditing((e) => ({ ...e!, [k]: v }));

  const toggleCategory = (key: string) =>
    setEditing((e) => {
      const cur = e?.categories ?? [];
      return { ...e!, categories: cur.includes(key) ? cur.filter((c) => c !== key) : [...cur, key] };
    });

  if (loading) return <p className="p-6 text-sm text-muted-foreground">Loading…</p>;

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-2xl font-bold">Map Locations</h1>
          <p className="text-sm text-muted-foreground">
            {counts.mapped} pinned · {counts.unmapped} listed without a pin
          </p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {(["all", "mapped", "unmapped"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm"
                    onClick={() => setFilter(f)}>
              {f === "all" ? "All" : f === "mapped" ? "Pinned" : "No pin"}
            </Button>
          ))}
          <Button onClick={() => setEditing({ ...blank })}>Add location</Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Area</th>
              <th className="p-3">Categories</th>
              <th className="p-3">Pin</th>
              <th className="p-3 text-center">Visible</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {shown.map((r) => (
              <tr key={r.id} className="border-t">
                <td className="p-3 font-medium">{r.name}</td>
                <td className="p-3 text-muted-foreground">{r.area}</td>
                <td className="p-3 text-muted-foreground">{r.categories.join(", ")}</td>
                <td className="p-3">
                  {r.status === "mapped" ? (
                    <span className="text-muted-foreground">
                      {r.latitude?.toFixed(4)}, {r.longitude?.toFixed(4)}
                      {r.pin_precision === "approx" && " (approx)"}
                    </span>
                  ) : (
                    <span className="rounded bg-muted px-2 py-0.5 text-xs">
                      {REASONS.find((x) => x.key === r.unmapped_reason)?.label ?? r.unmapped_reason}
                    </span>
                  )}
                </td>
                <td className="p-3 text-center">
                  <Switch checked={!r.hidden} onCheckedChange={() => toggleHidden(r)} />
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <Button variant="ghost" size="sm" onClick={() => setEditing(r)}>Edit</Button>
                  <Button variant="ghost" size="sm" onClick={() => remove(r)}>Delete</Button>
                </td>
              </tr>
            ))}
            {shown.length === 0 && (
              <tr><td colSpan={6} className="p-6 text-center text-muted-foreground">Nothing here.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing?.id ? "Edit location" : "Add location"}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Name</Label>
                  <Input value={editing.name ?? ""}
                         onChange={(e) => {
                           const name = e.target.value;
                           setEditing((p) => ({
                             ...p!, name,
                             slug: p!.id ? p!.slug : slugify(name),
                           }));
                         }} />
                </div>
                <div>
                  <Label>Area</Label>
                  <Input value={editing.area ?? ""} placeholder="Larkhall, Bath"
                         onChange={(e) => set("area", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Categories</Label>
                <div className="mt-2 flex flex-wrap gap-4">
                  {CATEGORIES.map((c) => (
                    <label key={c.key} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={editing.categories?.includes(c.key)}
                                onCheckedChange={() => toggleCategory(c.key)} />
                      {c.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <Label>Organisation type</Label>
                <Select value={editing.org_type ?? "unknown"}
                        onValueChange={(v) => set("org_type", v === "unknown" ? null : v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unknown">Not known</SelectItem>
                    {ORG_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-md border p-4">
                <div className="mb-3 flex items-center gap-3">
                  <Label className="m-0">Show a pin on the map</Label>
                  <Switch checked={editing.status === "mapped"}
                          onCheckedChange={(on) =>
                            setEditing((p) => ({
                              ...p!,
                              status: on ? "mapped" : "unmapped",
                              unmapped_reason: on ? null : (p!.unmapped_reason ?? "not_published"),
                            }))} />
                </div>

                {editing.status === "mapped" ? (
                  <div className="space-y-3">
                    <div>
                      <Label>Address</Label>
                      <Input value={editing.address ?? ""}
                             onChange={(e) => set("address", e.target.value)} />
                    </div>
                    <div className="flex items-end gap-2">
                      <div className="flex-1">
                        <Label>Postcode</Label>
                        <Input value={editing.postcode ?? ""}
                               onChange={(e) => set("postcode", e.target.value)} />
                      </div>
                      <Button type="button" variant="outline" onClick={geocodePostcode}>
                        Find coordinates
                      </Button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <Label>Latitude</Label>
                        <Input type="number" step="any" value={editing.latitude ?? ""}
                               onChange={(e) => set("latitude", e.target.value === "" ? null : Number(e.target.value))} />
                      </div>
                      <div>
                        <Label>Longitude</Label>
                        <Input type="number" step="any" value={editing.longitude ?? ""}
                               onChange={(e) => set("longitude", e.target.value === "" ? null : Number(e.target.value))} />
                      </div>
                    </div>
                    <div>
                      <Label>How accurate is the pin?</Label>
                      <Select value={editing.pin_precision ?? "approx"}
                              onValueChange={(v) => set("pin_precision", v)}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="exact">Exact — the project's own address</SelectItem>
                          <SelectItem value="approx">Approximate — postcode centre or nearby</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ) : (
                  <div>
                    <Label>Why isn't it pinned?</Label>
                    <Select value={editing.unmapped_reason ?? "not_published"}
                            onValueChange={(v) => set("unmapped_reason", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {REASONS.map((r) => (
                          <SelectItem key={r.key} value={r.key}>{r.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {editing.unmapped_reason === "privacy_hold" && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        The address and coordinates are cleared on save. This table is readable by
                        the public, so a private address must never be stored in it.
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div>
                <Label>Note shown to visitors</Label>
                <Textarea rows={2} value={editing.location_note ?? ""}
                          placeholder="Appointment only. / Free, always open. / The pin is the car park next door."
                          onChange={(e) => set("location_note", e.target.value)} />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Website</Label>
                  <Input value={editing.external_link ?? ""}
                         onChange={(e) => set("external_link", e.target.value)} />
                </div>
                <div>
                  <Label>Where the address came from</Label>
                  <Input value={editing.source_url ?? ""}
                         onChange={(e) => set("source_url", e.target.value)} />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={save} disabled={saving}>{saving ? "Saving…" : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMapLocationsPage;
