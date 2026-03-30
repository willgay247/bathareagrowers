import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("hidden", false)
      .maybeSingle()
      .then(({ data }) => {
        setEvent(data);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-[32px] font-bold text-foreground">Event not found</h1>
      </main>
    );
  }

  return (
    <main>
      <section className="w-full bg-background-inverse py-10 md:py-[60px] px-4">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[28px] font-bold text-foreground-alt md:text-[48px]">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {event.date_display && <span className="rounded-full bg-accent px-4 py-1 text-[13px] font-semibold text-foreground-alt">{event.date_display}</span>}
            {event.time_display && <span className="rounded-full bg-accent px-4 py-1 text-[13px] font-semibold text-foreground-alt">{event.time_display}</span>}
            {event.location && <span className="rounded-full bg-accent px-4 py-1 text-[13px] font-semibold text-foreground-alt">{event.location}</span>}
          </div>
        </div>
      </section>

      <section className="w-full h-[35vh] md:h-[50vh]">
        {event.image_url ? (
          <img src={event.image_url} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-background flex items-center justify-center text-foreground/30 text-lg">🌿</div>
        )}
      </section>

      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px] flex flex-col md:flex-row gap-10">
          <div className="md:w-[70%]">
            <p className="text-[20px] leading-relaxed text-foreground whitespace-pre-line">{event.description}</p>
            {event.booking_link && (
              <a
                href={event.booking_link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded bg-accent px-8 py-3 text-foreground-alt font-semibold hover:bg-accent/90 transition-colors"
              >
                Book Now →
              </a>
            )}
          </div>
          <div className="md:w-[30%]">
            <div className="bg-background-inverse p-6 text-foreground-alt rounded-lg">
              {(event.date_display || event.time_display) && (
                <div className="mb-5">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">When</h4>
                  {event.date_display && <p className="text-[15px]">{event.date_display}</p>}
                  {event.time_display && <p className="text-[15px]">{event.time_display}</p>}
                </div>
              )}
              <div className="mb-5">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">Organiser</h4>
                <p className="text-[15px]">{event.organiser || "Bath Area Growers"}</p>
              </div>
              {(event.location || event.address) && (
                <div className="mb-5">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">Where</h4>
                  {event.location && <p className="text-[15px]">{event.location}</p>}
                  {event.address && <p className="text-[14px] text-foreground-alt/70">{event.address}</p>}
                </div>
              )}
              {(event.tags ?? []).length > 0 && (
                <div>
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-2">Event Type</h4>
                  <div className="flex flex-wrap gap-2">
                    {(event.tags ?? []).map((tag) => (
                      <span key={tag} className="rounded-full bg-accent px-3 py-0.5 text-[12px] text-foreground-alt">{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventDetailPage;
