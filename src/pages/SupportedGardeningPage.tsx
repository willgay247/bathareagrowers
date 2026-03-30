const PROJECTS = [
  {
    name: "Grow for Life Therapeutic horticulture",
    image: "https://bathareagrowers.org/wp-content/uploads/IMG_3657-e1716234229612.webp",
    description: "Based from a beautiful walled garden at Newton St Loe. In small groups new gardeners work alongside Grow for Life team members for fun and informal weekly sessions. This is particularly aimed at people experiencing low confidence, anxiety, depression or isolation.",
  },
  {
    name: "Mind Greenlinks Allotment",
    image: "https://bathareagrowers.org/wp-content/uploads/IMG_3671-e1716234342773.jpeg",
    description: "A group Allotment at Monksdale Road in Oldfield Park, led by an experienced team, with a focus on improving mental wellbeing.",
  },
  {
    name: "Horticulture for Mental Health at Bath City Farm",
    image: "https://bathareagrowers.org/wp-content/uploads/IMG_3676-e1716234471596.jpeg",
    description: "A free group with activities to suit all levels from seated seed-sowing and potting on to heavy duty weeding and turning composts.",
  },
];

const SupportedGardeningPage = () => (
  <main>
    {/* 1. Hero */}
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3558-200x200.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
        Supported Gardening
      </h1>
    </section>

    {/* 2. Intro */}
    <section className="w-full bg-background py-[60px] px-4">
      <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground">
        These projects offer opportunities to garden and grow with the support of staff and volunteers who are experienced in both horticulture and supporting people's wellbeing.
      </p>
    </section>

    {/* 3. Projects grid */}
    <section className="w-full bg-white py-20 px-4">
      <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <div key={p.name} className="flex flex-col">
            <div className="aspect-[4/3] overflow-hidden rounded-md">
              <img src={p.image} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 className="mt-4 text-[22px] font-bold text-foreground">{p.name}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">{p.description}</p>
            <a href="#" className="mt-3 text-[15px] font-semibold text-accent hover:underline">More details..</a>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default SupportedGardeningPage;
