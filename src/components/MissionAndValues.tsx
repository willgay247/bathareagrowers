const VALUES_ROW1 = [
  { title: "Local", text: "Where much of the food we eat is grown in the surrounding area, so it's fresh and has low food-miles." },
  { title: "Regenerative", text: "Organic and restorative methods increase nature's vitality and create a region rich in wildlife." },
  { title: "Connected", text: "Where it's easy to connect with other people growing and growers are a key part of the community." },
];

const VALUES_ROW2 = [
  { title: "Accessible", text: "Where everyone can get locally grown nutritious food, enjoy wildlife-rich places, and access land, resources and support for growing." },
  { title: "Diverse", text: "Where people from all backgrounds feel able to get involved in growing, and a wide variety of projects fit different needs and contexts." },
];

const MissionAndValues = () => {
  return (
    <>
      {/* Part A — Our Mission split */}
      <section className="w-full bg-accent">
        <div className="grid md:grid-cols-2">
          <div className="min-h-[300px] md:min-h-0">
            <img
              src="https://bathareagrowers.org/wp-content/uploads/IMG_3570-1024x683.jpeg"
              alt="Community growing project"
              width={1024}
              height={683}
              sizes="(min-width: 768px) 50vw, 100vw"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="flex flex-col justify-center px-8 py-12 md:p-[60px]">
            <span className="text-[13px] uppercase tracking-[0.12em] font-semibold text-foreground-alt mb-3">
              Our Mission
            </span>
            <h2 className="text-foreground-alt font-bold">
              We want to create a food system that is..
            </h2>
          </div>
        </div>
      </section>

      {/* Part B — Values grid */}
      <section className="w-full bg-background py-[60px] px-4">
        <div className="mx-auto max-w-container">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-gap-card mb-8">
            {VALUES_ROW1.map((v) => (
              <div key={v.title}>
                <h4 className="text-[22px] font-bold">{v.title}</h4>
                <p className="mt-2 text-[15px] leading-[1.6] text-foreground">{v.text}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-gap-card max-w-[800px] mx-auto">
            {VALUES_ROW2.map((v) => (
              <div key={v.title}>
                <h4 className="text-[22px] font-bold">{v.title}</h4>
                <p className="mt-2 text-[15px] leading-[1.6] text-foreground">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default MissionAndValues;
