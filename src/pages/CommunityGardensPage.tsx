import { Link } from "react-router-dom";

/* ───────── data ───────── */

interface Garden {
  name: string;
  image: string;
  description: string;
  link?: string;
}

const BENEFITS = [
  { title: "Friendly", body: "A great way to meet new people in your local area and be part of community." },
  { title: "Beautiful", body: "Community and collective gardens and allotments often include tranquil orchards and wildlife areas." },
  { title: "Roles for all", body: "Community growing can accommodate disabilities and different interests." },
  { title: "Flexible", body: "Come when it works for you, knowing others are sharing the garden care." },
  { title: "Learning spaces", body: "No experience or knowledge needed, you can be guided by others." },
  { title: "Fresh food", body: "Unlike volunteering, you are growing for your own dinner!" },
];

const WEST_BATH: Garden[] = [
  { name: "Blooming Whiteway", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3653-1-e1718398726802-1024x899.jpeg", description: "Blooming Whiteway offers all sorts of projects about gardening as a neighbourhood to increase biodiversity and local food. These include planting for wildlife and food in Whiteway Green, a front gardens festival, wildlife walks, art events, and pollinator beds.", link: "https://bath.resilienceweb.org.uk/blooming-whiteway" },
  { name: "Bath City Farm horticulture", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3696-e1718392693435.jpeg", description: "Spanning 37 acres between Whiteway and Twerton, the city farm welcomes volunteers to help garden the raised vegetable beds, polytunnels, forest gardens and orchards.", link: "https://www.bathcityfarm.org.uk/for-adults/" },
  { name: "Timebank Plus Community Allotment", image: "https://bathareagrowers.org/wp-content/uploads/IMG-20240514-WA0005-e1718880329414-1024x843.jpeg", description: "Timebank Plus, a friendly charity in Twerton, has one of the allotments at the bottom of Bath City Farm. It's a social space for people who want to grow fruit and vegetables and share the harvest. Everyone is welcome – no experience is necessary, and there is nothing to pay.", link: "https://bath.resilienceweb.org.uk/timebank-allotment" },
  { name: "Roots Allotments Tuckers Meadow", image: "https://bathareagrowers.org/wp-content/uploads/IMG_4135-1024x768.webp", description: "On the edge of Newbridge in Bath, Tucker's Meadow offers private allotments and amenities such as communal garden plots, walking trails, and designated areas for wildlife." },
  { name: "From the Land", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3731.jpeg", description: "In 2012 Martin and Su bought 8 acres of beautiful, fertile land between Whiteway and Englishcombe. The group now grows fruit, vegetables and flowers with chemical free, permaculture methods.", link: "https://fromtheland.co.uk/" },
  { name: "Hanna Close Community Garden", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3715.jpeg", description: "Nestled next to a path near Twerton Park football ground, this is a space for the local community where anyone passing by can get involved or help themselves to the odd raspberry, blackcurrant or globe artichoke.", link: "https://transitionbath.org/twerton-hanna-close-community-garden/" },
];

const CENTRAL_BATH: Garden[] = [
  { name: "Bath Organic Group", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3652.jpeg", description: "'BOG' is a large community garden in Victoria Park allotments, established for over 20 years, spearheading organic growing in the area. A committee designs the garden and volunteers organise tasks to grow the produce.", link: "https://bath.resilienceweb.org.uk/bath-organic-group" },
  { name: "Smallcombe Nuttery", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3673-1024x685.jpeg", description: "Nestled by the skyline walk near Bathwick, the Nuttery was created by Transition Bath. There are around 40 nut trees including cobnuts, almonds and walnuts, a fruiting hedge, and fruit bushes.", link: "https://bath.resilienceweb.org.uk/smallcombe-nuttery" },
  { name: "The Urban Garden", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3717-1024x887.jpeg", description: "A garden centre in Victoria Park that uses all profits to support training, helping to improve the mental health and wellbeing of local adults. Volunteers help alongside staff and trainees.", link: "https://bath.resilienceweb.org.uk/the-urban-garden" },
];

const EAST_BATH: Garden[] = [
  { name: "Alice Park Community Garden", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3660-e1718389959542.jpeg", description: "Managed and gardened by volunteers, sharing skills and knowledge, Alice Park Community Garden in Larkhall aims to model community resilience and food self-sufficiency. It's also a social hub where local community members can gather.", link: "https://bath.resilienceweb.org.uk/alice-park-community-garden" },
  { name: "Dry Arch Growers", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3718-e1718389794817.jpeg", description: "A large well established community allotment in Bathampton with large vegetable beds, polytunnels, greenhouses, fruit bushes and a small orchard. Pay annual membership and share and learn from other growers.", link: "https://bath.resilienceweb.org.uk/dry-arch-growers" },
  { name: "Orchardshare", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3722-e1718390286593.jpeg", description: "A community group run by volunteers who work to conserve and maintain orchards to supply locally grown apples around Bath.", link: "https://bath.resilienceweb.org.uk/orchardshare" },
  { name: "Waterleaze Growers", image: "https://bathareagrowers.org/wp-content/uploads/1-e1718391472412.jpeg", description: "Waterleaze is half an acre of sunny, south facing land on the lower slopes of Solsbury Hill. Since 2023 an intrepid group have started to restore the mature fruit trees, overgrown ponds and coldframes.", link: "https://bath.resilienceweb.org.uk/waterleaze-growers" },
  { name: "Batheaston Forest Garden", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3668-e1718391554561-1024x926.jpeg", description: "Created lovingly by volunteers since 2021, the forest garden is full of food plants such as apple, pear, hazelnut and cherry trees, blackcurrants, herbs and perennial vegetables.", link: "https://bath.resilienceweb.org.uk/batheaston-forest-garden" },
  { name: "Roots Allotments Avon Views", image: "https://bathareagrowers.org/wp-content/uploads/IMG_3699-1024x1024.png", description: "A new commercially provided allotment site looking on rolling hills just outside Bathford. Roots offer a range of plot sizes and everything you need to get started.", link: "https://bath.resilienceweb.org.uk/roots-allotments-bathford" },
];

const SITES_ACROSS = [
  { title: "Bath & NE Somerset Allotment Association", body: "Bath Allotments Association is an independent not-for-profit organisation that supports allotment holders and leisure growers in the Bath and North-East Somerset Council area." },
  { title: "More Trees Banes", body: "Our vision is of a dynamic and diverse tree rich landscape across Bath and North East Somerset and beyond. We are building a community of people learning about trees, how to grow, plant and care for them." },
];

/* ───────── sub-components ───────── */

const GardenCard = ({ garden, reversed }: { garden: Garden; reversed: boolean }) => (
  <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10`}>
    <div className="md:w-1/2">
      <div className="aspect-[4/3] overflow-hidden rounded-md">
        <img src={garden.image} alt={garden.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
    </div>
    <div className="md:w-1/2 flex flex-col justify-center">
      <h3 className="text-[22px] font-bold text-foreground">{garden.name}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-foreground">{garden.description}</p>
      {garden.link && (
        <a href={garden.link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[15px] font-semibold text-accent hover:underline">
          More details..
        </a>
      )}
    </div>
  </div>
);

const RegionSection = ({ title, gardens, bgClass }: { title: string; gardens: Garden[]; bgClass: string }) => (
  <section className={`w-full ${bgClass} py-20 px-4`}>
    <div className="mx-auto max-w-[1100px]">
      <h2 className="text-[36px] font-bold text-foreground mb-12">{title}</h2>
      <div className="flex flex-col gap-16">
        {gardens.map((g, i) => (
          <GardenCard key={g.name} garden={g} reversed={i % 2 !== 0} />
        ))}
      </div>
    </div>
  </section>
);

/* ───────── page ───────── */

const CommunityGardensPage = () => {
  return (
    <main>
      {/* 1. Hero */}
      <section
        className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/cropped-IMG_3545-1-200x200.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Community Gardens and Allotments
        </h1>
      </section>

      {/* 2. Intro banner */}
      <section className="w-full bg-accent py-[60px] px-4">
        <h2 className="mx-auto max-w-[700px] text-center text-[28px] font-bold leading-snug text-foreground-alt md:text-[32px]">
          Joining a community garden or collective allotment is a great way to start the journey into growing.
        </h2>
      </section>

      {/* 3. Benefits grid */}
      <section className="w-full bg-background py-20 px-4">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[20px] leading-relaxed text-foreground mb-12">
            Browse all the beautiful and diverse community and collective gardens and allotments across the area. Check out more details on our Resilience Web, such as location, meeting days, cost, accessibility and how to join.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title}>
                <h3 className="text-[22px] font-bold text-foreground">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. West Bath */}
      <RegionSection title="West Bath" gardens={WEST_BATH} bgClass="bg-white" />

      {/* 5. Central Bath */}
      <RegionSection title="Central Bath" gardens={CENTRAL_BATH} bgClass="bg-background" />

      {/* 6. East Bath */}
      <RegionSection title="East Bath" gardens={EAST_BATH} bgClass="bg-white" />

      {/* 7. Sites across Bath */}
      <section className="w-full bg-background py-[60px] px-4">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[36px] font-bold text-foreground mb-10">Sites across the Bath area</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {SITES_ACROSS.map((s) => (
              <div key={s.title}>
                <h3 className="text-[22px] font-bold text-foreground">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CommunityGardensPage;
