import { useParams, Link } from "react-router-dom";
import { locations } from "@/data/locations";
import { events } from "@/data/events";

const LocationDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const location = locations.find((l) => l.slug === slug);

  if (!location) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-[32px] font-bold text-foreground">Location not found</h1>
      </main>
    );
  }

  const upcomingEvents = location.upcomingEvents
    .map((s) => events.find((e) => e.slug === s))
    .filter(Boolean);

  return (
    <main>
      <section className="w-full bg-background-inverse py-10 md:py-[60px] px-4">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[28px] font-bold text-foreground-alt md:text-[48px]">{location.name}</h1>
          <p className="mt-2 text-[18px] text-foreground-alt/60">{location.area}</p>
        </div>
      </section>

      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px] flex flex-col md:flex-row gap-10">
          <div className="md:w-[70%]">
            {location.image && (
              <img src={location.image} alt={location.name} className="mb-8 w-full rounded-md object-cover" loading="lazy" />
            )}
            <p className="text-[20px] leading-relaxed text-foreground">{location.description}</p>
          </div>
          <div className="md:w-[30%]">
            <div className="bg-background-inverse p-6 text-foreground-alt">
              <div className="mb-5">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">Location</h4>
                <p className="text-[15px]">{location.area}</p>
                <p className="text-[14px] text-foreground-alt/70">{location.address}</p>
              </div>
              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-2">Upcoming Events</h4>
                {upcomingEvents.length > 0 ? (
                  <ul className="space-y-2">
                    {upcomingEvents.map((ev) => (
                      <li key={ev!.slug}>
                        <Link to={`/events/${ev!.slug}`} className="text-[14px] text-accent-foreground underline hover:text-accent-foreground/80">
                          {ev!.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[14px] text-foreground-alt/60">No upcoming events</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default LocationDetailPage;
