import { Link } from "react-router-dom";

const BENEFITS = [
  "A profile of your project on our new website",
  "Social media amplification through our channels",
  "Support and advice for new projects and initiatives",
  "Shared library of equipment",
  "Priority booking on network events",
  "Contribute to how the network develops",
];

const GrowersNetworkPage = () => (
  <main>
    <section
      className="relative flex h-[40vh] md:h-[60vh] w-full items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3573-e1713295309470-200x200.jpeg')" }}
    >
      <div className="absolute inset-0 bg-black/45" />
      <h1 className="relative z-10 text-center text-[28px] font-bold text-foreground-alt px-4 md:text-[48px]">Growers Network</h1>
    </section>

    <section className="w-full bg-background py-20 px-4">
      <p className="mx-auto max-w-[700px] text-center text-[20px] leading-relaxed text-foreground mb-12">
        Join our network of growing projects in and around Bath. It's free! Get in touch to join. Benefits include…
      </p>
      <div className="mx-auto max-w-[1100px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {BENEFITS.map((b) => (
          <div key={b} className="bg-background-inverse p-6 text-[15px] leading-relaxed text-foreground-alt">{b}</div>
        ))}
      </div>
    </section>

    <section className="w-full bg-accent py-[60px] px-4 text-center">
      <h2 className="text-[32px] font-bold text-foreground-alt mb-6">Get in touch to join — it's free!</h2>
      <Link to="/contact" className="inline-block rounded-[6px] border-2 border-foreground-alt px-9 py-3 text-[15px] font-semibold text-foreground-alt no-underline transition-colors hover:bg-foreground-alt hover:text-accent">
        Contact Us
      </Link>
    </section>
  </main>
);

export default GrowersNetworkPage;
