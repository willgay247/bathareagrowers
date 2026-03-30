const FARMS = [
  { name: "Undercliff Urban Farm", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3659.jpeg", description: "Nat's organic market garden is nestled next to the canal in Bathwick where he grows a range of veg and fruit for local sale, with a kiosk next to the canal." },
  { name: "Middle Ground Growers", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3658.webp", description: "Within a 16 acre regenerative farm on the edge of Weston, these young farmers have established a 2 acre market garden with a veg box scheme, volunteering, traineeships and courses open to the public." },
  { name: "Avonleigh Orchards", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3664.jpeg", description: "Jonathan has stewarded this organic farm in Bradford On Avon for many years, nurturing other local growers, woofers, and local people. There is a large orchard, vineyard and market garden." },
  { name: "The Community Farm", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3688.jpeg", description: "A not-for-profit, organic farm overlooking Chew Valley Lake, selling nourishing food and delivering across the local area. Growing community as well as food, the farm hosts wellbeing events and volunteer sessions." },
  { name: "Cam Valley Growers", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3571-e1713214446692-1024x498.jpeg", description: "Listing coming soon." },
  { name: "Abundance by Design", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3568-1024x683.jpeg", description: "Listing coming soon." },
];

const FarmsPage = () => (
  <main>
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3632-e1715201712644.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
        Farms and Market Gardens
      </h1>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground">
        Meet our network of market gardeners growing organic food for sale. You can volunteer on many of these farms, learning from experienced professional growers and helping their businesses to thrive.
      </p>
    </section>

    <section className="w-full bg-white py-20 px-4">
      <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
        {FARMS.map((f) => (
          <div key={f.name} className="flex flex-col">
            <div className="aspect-[4/3] overflow-hidden rounded-t-md">
              <img src={f.image} alt={f.name} className="h-full w-full object-cover" loading="lazy" />
            </div>
            <h3 className="mt-4 text-[22px] font-bold text-foreground">{f.name}</h3>
            <p className="mt-2 text-[15px] leading-relaxed text-foreground">{f.description}</p>
            <a href="#" className="mt-3 text-[15px] font-semibold text-accent hover:underline">More details..</a>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default FarmsPage;
