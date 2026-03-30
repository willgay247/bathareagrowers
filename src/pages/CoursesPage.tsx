const COURSES = [
  {
    image: "https://bathareagrowers.org/wp-content/uploads/WAB-logo2-2.png",
    isLogo: true,
    org: "WILD ABOUT BATH",
    course: "Educational wildlife walks and related events",
    detail: null,
    location: "In Combe Down, Southstoke and Monkton Combe",
  },
  {
    image: "https://bathareagrowers.org/wp-content/uploads/Grow-Yourself.jpg",
    isLogo: false,
    org: "GROW YOURSELF",
    course: "City and Guilds in Practical Horticulture",
    detail: "For people with mental health problems or on a low income",
    location: "At The Urban Garden, Royal Victoria Park",
  },
  {
    image: "https://bathareagrowers.org/wp-content/uploads/Middle-Ground.jpg",
    isLogo: false,
    org: "MIDDLE GROUND GROWERS",
    course: "Regenerators Course",
    detail: "12 modules including a workshop on the first Friday of every month 10:00–16:00",
    location: "At Weston Spring Farm, Weston",
  },
];

const CoursesPage = () => (
  <main>
    <section
      className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3690.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
        Courses
      </h1>
    </section>

    <section className="w-full bg-background py-[60px] px-4">
      <p className="mx-auto max-w-[700px] text-center text-[20px] leading-relaxed text-foreground">
        Many of our growing projects offer learning events. Here are those offering regular workshops or training.
      </p>
    </section>

    <section className="w-full bg-white py-20 px-4">
      <div className="mx-auto max-w-[1100px] flex flex-col gap-6">
        {COURSES.map((c) => (
          <div key={c.org} className="flex flex-col md:flex-row border border-background rounded-md p-6 gap-6">
            <div className="md:w-1/4 flex items-center justify-center">
              <img
                src={c.image}
                alt={c.org}
                className={`w-full rounded-md ${c.isLogo ? "object-contain max-h-[140px]" : "aspect-[4/3] object-cover"}`}
                loading="lazy"
              />
            </div>
            <div className="md:w-3/4 flex flex-col justify-center">
              <h3 className="text-[14px] font-bold uppercase tracking-wide text-accent">{c.org}</h3>
              <h4 className="mt-1 text-[22px] font-bold text-foreground">{c.course}</h4>
              {c.detail && <p className="mt-2 text-[15px] leading-relaxed text-foreground">{c.detail}</p>}
              <span className="mt-3 inline-block self-start rounded-full bg-background px-3 py-1 text-[13px] text-foreground">
                {c.location}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  </main>
);

export default CoursesPage;
