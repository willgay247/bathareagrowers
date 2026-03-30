import { Link } from "react-router-dom";

const CARDS = [
  {
    title: "Community Gardens and Allotments",
    link: "/our-members-2/",
    image: "https://bathareagrowers.org/wp-content/uploads/IMG_3631-e1715201316237-1024x638.jpeg",
    text: "Great places to meet new people, learn from others, share tasks, enjoy beautiful surroundings and delicious food.",
  },
  {
    title: "Market Gardens",
    link: "/farm-volunteering/",
    image: "https://bathareagrowers.org/wp-content/uploads/IMG_3632-e1715201712644-1024x639.jpeg",
    text: "Learn from experienced professional growers whilst supporting their business thrive. All farms here sell their organic vegetables and fruit to the public.",
  },
  {
    title: "Supported Gardening",
    link: "/supported-gardening/",
    image: "https://bathareagrowers.org/wp-content/uploads/IMG_3657-e1716234229612.webp",
    text: "Therapeutic gardening projects offer extra support to people to enjoy all the benefits of growing: nurturing the land and themselves.",
  },
  {
    title: "Surplus Projects",
    link: "/surplus-projects/",
    image: null,
    text: "Collecting and delivering surplus fruit and veg from allotments, farm and gardens, and getting it to people who may most benefit.",
  },
  {
    title: "Wildlife Projects",
    link: "/wildlife-gardening-2/",
    image: null,
    text: "These projects have a particular emphasis on growing for biodiversity and nature regeneration in and around the city.",
  },
];

const GrowingGroupsSection = () => {
  return (
    <section className="w-full bg-background py-section-y md:py-section-y px-4">
      <div className="mx-auto max-w-container">
        <h2 className="text-center font-bold mb-12">
          Local Growing Groups
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-gap-card">
          {CARDS.map((card) => (
            <div key={card.link} className="flex flex-col">
              {card.image ? (
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-[160px] object-cover"
                />
              ) : (
                <div className="w-full h-[160px] bg-background" />
              )}
              <h3 className="mt-3 text-[18px] font-bold leading-snug">
                <Link
                  to={card.link}
                  className="text-accent no-underline hover:underline"
                >
                  {card.title}
                </Link>
              </h3>
              <p className="mt-2 text-[15px] leading-[1.5] text-foreground">
                {card.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GrowingGroupsSection;
