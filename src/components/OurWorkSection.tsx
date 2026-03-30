import { Link } from "react-router-dom";

const ROWS = [
  {
    label: "Connecting",
    text: "We are creating systems to share resources, information, events and trainings between people growing locally.",
    cta: "Join the growers network",
    link: "/about/growers-network/",
  },
  {
    label: "Promoting",
    text: "We publicise local regenerative growing projects in the community, including opportunities to grow, glean, donate and buy local food.",
    cta: "Find a local group..",
    link: "/our-members-2/",
  },
  {
    label: "Inclusion",
    text: "We are exploring ways to support people into growing who might otherwise be excluded. And to develop a region where everyone can access organic locally-grown food to eat.",
    cta: "Contribute to a food surplus project",
    link: "/surplus-projects/",
  },
  {
    label: "Catalysing",
    text: "We host network events for local growers that stimulate collaboration and creativity on ideas and initiatives.",
    cta: "Find out more about the Growers Convention day on October 6th..",
    link: "/events/growing-our-local-food-system/",
  },
  {
    label: "Start-ups",
    text: "We support the start-up of new local food growing projects, through providing advice, training, resources and publicity.",
    cta: "Would you like help to start a growing project? Get in touch..",
    link: "/contact/",
  },
];

const OurWorkSection = () => {
  return (
    <section className="w-full bg-background py-section-y px-4">
      <div className="mx-auto max-w-container">
        <h2 className="text-center text-foreground font-bold mb-12">Our Work</h2>
        <div className="flex flex-col">
          {ROWS.map((row, i) => (
            <div key={row.label}>
              <div className="grid md:grid-cols-4 gap-4 bg-[rgba(255,255,255,0.6)] py-5 px-6">
                <div className="md:col-span-1">
                  <h3 className="text-[22px] font-bold text-foreground">{row.label}</h3>
                </div>
                <div className="md:col-span-3">
                  <p className="text-[16px] leading-[1.6] text-foreground">{row.text}</p>
                  <Link
                    to={row.link}
                    className="inline-block mt-2 text-[15px] font-semibold text-accent no-underline hover:underline"
                  >
                    {row.cta}
                  </Link>
                </div>
              </div>
              {i < ROWS.length - 1 && (
                <hr className="border-0 h-px bg-foreground/15" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OurWorkSection;
