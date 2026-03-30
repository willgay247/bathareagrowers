import { useParams } from "react-router-dom";
import { events } from "@/data/events";

const EventDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const event = events.find((e) => e.slug === slug);

  if (!event) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <h1 className="text-[32px] font-bold text-foreground">Event not found</h1>
      </main>
    );
  }

  return (
    <main>
      {/* Header */}
      <section className="w-full bg-background-inverse py-[60px] px-4">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="text-[40px] font-bold text-foreground-alt md:text-[48px]">{event.title}</h1>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-accent px-4 py-1 text-[13px] font-semibold text-foreground-alt">{event.date}</span>
            <span className="rounded-full bg-accent px-4 py-1 text-[13px] font-semibold text-foreground-alt">{event.time}</span>
            <span className="rounded-full bg-accent px-4 py-1 text-[13px] font-semibold text-foreground-alt">{event.location}</span>
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section className="w-full h-[50vh]">
        {event.image ? (
          <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-background flex items-center justify-center text-foreground/30 text-lg">🌿</div>
        )}
      </section>

      {/* Content */}
      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px] flex flex-col md:flex-row gap-10">
          <div className="md:w-[70%]">
            <p className="text-[20px] leading-relaxed text-foreground">{event.description}</p>
          </div>
          <div className="md:w-[30%]">
            <div className="bg-background-inverse p-6 text-foreground-alt">
              <div className="mb-5">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">When</h4>
                <p className="text-[15px]">{event.date}</p>
                <p className="text-[15px]">{event.time}</p>
              </div>
              <div className="mb-5">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">Organiser</h4>
                <p className="text-[15px]">{event.organiser}</p>
              </div>
              <div className="mb-5">
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-1">Where</h4>
                <p className="text-[15px]">{event.location}</p>
                <p className="text-[14px] text-foreground-alt/70">{event.address}</p>
              </div>
              <div>
                <h4 className="text-[12px] font-bold uppercase tracking-wider text-foreground-alt/60 mb-2">Event Type</h4>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="rounded-full bg-accent px-3 py-0.5 text-[12px] text-foreground-alt">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default EventDetailPage;
