const Hero = () => {
  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <img
        src="https://bathareagrowers.org/wp-content/uploads/IMG_3572-1024x683.jpeg"
        alt="Fresh vegetables and produce from Bath area community gardens"
        width={1024}
        height={683}
        sizes="100vw"
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        loading="eager"
      />
      <div className="absolute inset-0 bg-background-inverse/30" />
      <h1 className="relative z-10 text-foreground-alt text-center uppercase tracking-[0.05em]">
        BATH AREA GROWERS
      </h1>
    </section>
  );
};

export default Hero;
