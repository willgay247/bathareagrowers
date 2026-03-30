const PROJECTS = [
  { name: "Cropdrop", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3634-e1715506185777.jpeg", description: "Cropdrop coordinates the redistribution of surplus vegetables and fruit from allotments and other growing sites to charitable or community projects that alleviate food poverty in Bath and NE Somerset." },
  { name: "Ciderspace", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3635-e1715505727364.jpeg", description: "Ciderspace is an exciting offshoot of Orchardshare. Surplus harvested from small local orchards are juiced by hydropress for the production of apple juice and cider." },
  { name: "Avon Gleaning", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3633-e1715201796439-1024x638.jpeg", description: "The Avon Gleaning Network works primarily with farms around Avon and Somerset to harvest surplus vegetables and fruit from fields that would otherwise go to waste." },
];

const SurplusProjectsPage = () => (
  <main>
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3557-e1713291149232-200x200.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
        Surplus projects
      </h1>
    </section>

    <section className="w-full bg-background-inverse py-[60px] px-4">
      <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground-alt">
        Three projects in the network collect surplus vegetables and fruit and distribute it to those who can benefit. Each project is keen to hear about sources of surplus produce or crops that might go to waste. They also welcome new volunteers to help with harvesting, deliveries or admin.
      </p>
    </section>

    <section className="w-full bg-white py-20 px-4">
      <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <div key={p.name} className="flex flex-col">
            <div className="aspect-[4/3] overflow-hidden rounded-t-md">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h2 className="mt-4 text-[22px] font-bold text-foreground">{p.name}</h2>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">{p.description}</p>
            <a href="#" className="mt-3 text-[15px] font-semibold text-accent hover:underline">Read more..</a>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default SurplusProjectsPage;
