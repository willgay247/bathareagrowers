const GROUPS = [
  { name: "Wild About Bath", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3690.jpeg", description: "A group on the south side of Bath encouraging appreciation of nature, conserving local wildlife, and in doing so, strengthening community ties. They have a Gardening for Wildlife scheme, and offer regular guided walks and workshops." },
  { name: "Blooming Whiteway", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3653-1-e1718398726802.jpeg", description: "Originally set up as a front garden festival in 2017, Blooming Whiteway has grown to offer all sorts of projects about how we can garden as a neighbourhood to increase biodiversity. These include wildlife walks, growing in Whiteway Green, art events, tree planting, creating pollinator beds and looking after Barrowmead tree nursery." },
  { name: "Meadow in my Garden", image: "https://bathareagrowers.org/wp-content/uploads/Natural-pest-control-1-e1716507472761.jpg", description: "A local not-for-profit company promoting gardening for wildlife through supplying an extensive range of unique, expertly designed seed mixtures, providing a spectacular long-flowering succession for the benefit of people and pollinators." },
  { name: "Wild About Weston", image: null, description: "A new local group encouraging nature, including helping to plant spring bulbs at The Weal Triangle, the Orchard, and in Locksbrook cemetery, and weeding and mulching around new trees on The Rec. They are working with B&NES Parks, Avon Wildlife and residents to develop a local pollinator initiative." },
];

const WildlifeGardeningPage = () => (
  <main>
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3679.webp')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
        Wildlife Gardening
      </h1>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground">
        These local groups have a focus on gardening and managing land to support wildlife and create resilient natural ecosystems.
      </p>
    </section>

    {GROUPS.map((g, i) => {
      const reversed = i % 2 !== 0;
      const bg = i % 2 === 0 ? "bg-white" : "bg-background";
      return (
        <section key={g.name} className={`w-full ${bg} py-[60px] px-4`}>
          <div className={`mx-auto max-w-[1100px] flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12`}>
            <div className="md:w-1/2">
              <div className="aspect-[4/3] overflow-hidden rounded-md">
                {g.image ? (
                  <img src={g.image} alt={g.name} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <div className="h-full w-full bg-background flex items-center justify-center text-foreground/40 text-sm">
                    Image coming soon
                  </div>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex flex-col justify-center">
              <h2 className="text-[32px] font-bold text-foreground">{g.name}</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-foreground">{g.description}</p>
              <a href="#" className="mt-4 text-[15px] font-semibold text-accent hover:underline">More details..</a>
            </div>
          </div>
        </section>
      );
    })}
  </main>
);

export default WildlifeGardeningPage;
