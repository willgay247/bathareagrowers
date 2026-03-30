import { useParams, Link } from "react-router-dom";
import { events } from "@/data/events";

const EventTagPage = () => {
  const { tag } = useParams<{ tag: string }>();
  const filtered = events.filter((e) => e.tags.includes(tag || ""));

  return (
    <main>
      <section className="w-full bg-background-inverse py-[60px] px-4">
        <h1 className="mx-auto max-w-[1100px] text-[40px] font-bold text-foreground-alt md:text-[48px]">
          Events tagged: {tag}
        </h1>
      </section>

      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length === 0 && <p className="text-[18px] text-foreground">No events found for this tag.</p>}
          {filtered.map((e) => (
            <Link key={e.slug} to={`/events/${e.slug}`} className="group flex flex-col overflow-hidden rounded-md bg-white no-underline">
              <div className="relative aspect-[16/9]">
                {e.image ? (
                  <img src={e.image} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full bg-background flex items-center justify-center text-foreground/30 text-sm">🌿</div>
                )}
                <span className="absolute left-3 top-3 rounded bg-accent px-3 py-1 text-[12px] font-semibold text-foreground-alt">{e.date}</span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-[18px] font-bold text-foreground">{e.title}</h3>
                <span className="mt-2 inline-block self-start rounded-full bg-background-inverse px-3 py-0.5 text-[12px] text-foreground-alt">{e.location}</span>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground">{e.description}</p>
                <span className="mt-auto pt-4 text-[14px] font-semibold text-accent border border-accent rounded px-4 py-2 text-center transition-colors group-hover:bg-accent group-hover:text-foreground-alt">Learn more →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
};

export default EventTagPage;
