import { Link } from "react-router-dom";

const EVENTS = [
  { title: "Growing Our Local Food System", image: "https://bathareagrowers.org/wp-content/uploads/2_20240729_214914_0001.png", date: "6th Oct 2024", location: "St Mark's, Widcombe", description: "A community convention — visioning a re-localised, nature-regenerating food growing culture in Bath.", link: "/events/growing-our-local-food-system" },
  { title: "Community Seed Saving", image: null, date: "June 2024", location: "Bath", description: "Community seed saving event for network members.", link: "/events/community-seed-saving" },
  { title: "First Aid Training", image: null, date: "July 2024", location: "Bath", description: "First aid training for community garden volunteers.", link: "/events/first-aid-training" },
  { title: "Pizza Party", image: null, date: "July 2024", location: "Roundhouse, Bath", description: "A community pizza party at the roundhouse.", link: "/events/pizza-party" },
  { title: "Network Strategy Meeting", image: null, date: "July 2024", location: "Bath", description: "Bath Area Growers network strategy meeting.", link: "/events/network-strategy-meeting" },
  { title: "Alice Park Community Garden Tour", image: null, date: "June 2024", location: "Alice Park, Larkhall", description: "A tour of Alice Park Community Garden in Larkhall.", link: "/events/alice-park-community-garden-tour" },
  { title: "Batheaston Forest Garden Open Day", image: null, date: "June 2024", location: "Batheaston", description: "Open day at the Batheaston Forest Garden.", link: "/events/batheaston-forest-garden-open-day" },
  { title: "Tours, Tea and Chat with Bath Organic Group", image: null, date: "June 2024", location: "Victoria Park", description: "Tours, tea and chat with Bath Organic Group.", link: "/events/tours-tea-and-chat-with-bath-organic-group" },
  { title: "A Community of Hedges with Blooming Whiteway", image: null, date: "June 2024", location: "Whiteway", description: "Community hedge planting with Blooming Whiteway.", link: "/events/a-community-of-hedges-with-blooming-whiteway" },
  { title: "Growing Green Open Day", image: null, date: "May 2024", location: "Bath", description: "Open day for the Growing Green project.", link: "/events/growing-green-open-day" },
  { title: "Greenlinks Plant Sale", image: null, date: "May 2024", location: "Monksdale Road", description: "Plant sale at Greenlinks allotment.", link: "/events/greenlinks-plant-sale" },
];

const EventsPage = () => (
  <main>
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3636-e1717271139891.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">Events</h1>
    </section>

    <section className="w-full bg-background py-20 px-4">
      <h2 className="text-center text-[36px] font-bold text-foreground mb-12">Upcoming Events</h2>
      <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {EVENTS.map((e) => (
          <Link key={e.title} to={e.link} className="group flex flex-col overflow-hidden rounded-md bg-white no-underline">
            <div className="relative aspect-[16/9]">
              {e.image ? (
                <img src={e.image} alt={e.title} className="h-full w-full object-cover" loading="lazy" />
              ) : (
                <div className="h-full w-full bg-background flex items-center justify-center text-foreground/30 text-sm">🌿</div>
              )}
              <span className="absolute left-3 top-3 rounded bg-accent px-3 py-1 text-[12px] font-semibold text-foreground-alt">
                {e.date}
              </span>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <h3 className="text-[18px] font-bold text-foreground">{e.title}</h3>
              <span className="mt-2 inline-block self-start rounded-full bg-background-inverse px-3 py-0.5 text-[12px] text-foreground-alt">
                {e.location}
              </span>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground">{e.description}</p>
              <span className="mt-auto pt-4 text-[14px] font-semibold text-accent border border-accent rounded px-4 py-2 text-center transition-colors group-hover:bg-accent group-hover:text-foreground-alt">
                Learn more →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  </main>
);

export default EventsPage;
