import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Event = Tables<"events">;

const EventsPage = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("hidden", false)
      .order("event_date", { ascending: true })
      .then(({ data }) => {
        setEvents(data ?? []);
        setLoading(false);
      });
  }, []);

  return (
    <main>
      <section
        className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3636-e1717271139891.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">Events</h1>
      </section>

      <section className="w-full bg-background py-20 px-4">
        <h2 className="text-center text-[36px] font-bold mb-12">Upcoming Events</h2>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          </div>
        ) : (
          <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {events.length === 0 && (
              <p className="col-span-full text-center text-foreground/60">No upcoming events.</p>
            )}
            {events.map((e) => (
              <Link key={e.id} to={`/events/${e.slug}`} className="group flex flex-col overflow-hidden rounded-md bg-white no-underline">
                <div className="relative aspect-[16/9]">
                  {e.image_url ? (
                    <img src={e.image_url} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-background flex items-center justify-center text-foreground/30 text-sm">🌿</div>
                  )}
                  <span className="absolute left-3 top-3 rounded bg-accent px-3 py-1 text-[12px] font-semibold text-foreground-alt">
                    {e.date_display || "TBC"}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-[18px] font-bold">{e.title}</h3>
                  <span className="mt-2 inline-block self-start rounded-full bg-accent px-3 py-0.5 text-[12px] text-foreground-alt">
                    {e.location || "TBC"}
                  </span>
                  <p className="mt-3 text-[14px] leading-relaxed text-foreground line-clamp-3">{e.description}</p>
                  <span className="mt-auto pt-4 text-[14px] font-semibold text-accent border border-accent rounded px-4 py-2 text-center transition-colors group-hover:bg-accent group-hover:text-foreground-alt">
                    Learn more →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default EventsPage;
