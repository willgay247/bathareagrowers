import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

interface Props {
  event: Event | null;
  onClose: () => void;
  onSaved: () => void;
  createdBy?: string | null;
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const EventFormModal = ({ event, onClose, onSaved, createdBy }: Props) => {
  const [title, setTitle] = useState(event?.title ?? "");
  const [slug, setSlug] = useState(event?.slug ?? "");
  const [dateDisplay, setDateDisplay] = useState(event?.date_display ?? "");
  const [eventDate, setEventDate] = useState<Date | undefined>(
    event?.event_date ? new Date(event.event_date) : undefined
  );
  const [timeDisplay, setTimeDisplay] = useState(event?.time_display ?? "");
  const [location, setLocation] = useState(event?.location ?? "");
  const [address, setAddress] = useState(event?.address ?? "");
  const [organiser, setOrganiser] = useState(event?.organiser ?? "Bath Area Growers");
  const [tagsStr, setTagsStr] = useState((event?.tags ?? []).join(", "));
  const [description, setDescription] = useState(event?.description ?? "");
  const [bookingLink, setBookingLink] = useState(event?.booking_link ?? "");
  const [imageUrl, setImageUrl] = useState(event?.image_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!event) {
      setSlug(slugify(title));
    }
  }, [title, event]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const path = `events/${slug || "temp"}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("cms-images")
      .upload(path, file, { upsert: true });
    if (uploadError) {
      setError(uploadError.message);
      setUploading(false);
      return;
    }
    const { data: publicData } = supabase.storage
      .from("cms-images")
      .getPublicUrl(path);
    setImageUrl(publicData.publicUrl);
    setUploading(false);
  };

  const handleSave = async () => {
    if (!title.trim() || !slug.trim()) {
      setError("Title and slug are required.");
      return;
    }
    setSaving(true);
    setError("");

    const tags = tagsStr
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: Record<string, any> = {
      title,
      slug,
      date_display: dateDisplay || null,
      event_date: eventDate ? format(eventDate, "yyyy-MM-dd") : null,
      time_display: timeDisplay || null,
      location: location || null,
      address: address || null,
      organiser: organiser || "Bath Area Growers",
      tags,
      image_url: imageUrl || null,
      description: description || null,
      booking_link: bookingLink || null,
    };

    if (event) {
      const { error: err } = await supabase
        .from("events")
        .update(payload)
        .eq("id", event.id);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    } else {
      // Set created_by for new records
      if (createdBy) payload.created_by = createdBy;
      const { error: err } = await supabase.from("events").insert(payload as any);
      if (err) {
        setError(err.message);
        setSaving(false);
        return;
      }
    }
    setSaving(false);
    onSaved();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div
        className="my-8 w-full max-w-2xl rounded-xl bg-white p-8 shadow-xl"
        style={{ fontFamily: "'Readex Pro', sans-serif" }}
      >
        <h2 className="text-2xl font-bold mb-6" style={{ color: "#1E1E1E" }}>
          {event ? "Edit Event" : "Add New Event"}
        </h2>

        <div className="space-y-4">
          <div>
            <Label>Title *</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Slug *</Label>
            <Input value={slug} onChange={(e) => setSlug(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Date Display</Label>
              <Input
                value={dateDisplay}
                onChange={(e) => setDateDisplay(e.target.value)}
                placeholder="Saturday 6th July 2024"
              />
            </div>
            <div>
              <Label>Event Date (for sorting)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal", !eventDate && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventDate ? format(eventDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventDate}
                    onSelect={setEventDate}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <div>
            <Label>Time Display</Label>
            <Input
              value={timeDisplay}
              onChange={(e) => setTimeDisplay(e.target.value)}
              placeholder="10:00am – 12:00pm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Location</Label>
              <Input value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={address} onChange={(e) => setAddress(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Organiser</Label>
            <Input value={organiser} onChange={(e) => setOrganiser(e.target.value)} />
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input
              value={tagsStr}
              onChange={(e) => setTagsStr(e.target.value)}
              placeholder="community, food, growing"
            />
          </div>
          <div>
            <Label>Image</Label>
            {imageUrl && (
              <img src={imageUrl} alt="Preview" className="mb-2 h-32 w-full rounded-lg object-cover" />
            )}
            <Input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {uploading && <p className="mt-1 text-xs text-muted-foreground">Uploading…</p>}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
            />
          </div>
          <div>
            <Label>Booking Link</Label>
            <Input value={bookingLink} onChange={(e) => setBookingLink(e.target.value)} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-accent text-white hover:bg-accent/90"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventFormModal;
