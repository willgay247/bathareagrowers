const IntroSection = () => {
  return (
    <section className="w-full bg-accent">
      <div className="grid md:grid-cols-2">
        <div className="flex items-center px-8 py-12 md:p-[60px]">
          <p className="text-foreground-alt text-[20px] leading-[1.7] font-normal">
            Welcome to Bath Area Growers. We are a network of community projects
            growing regeneratively for food, community, and nature.
          </p>
        </div>
        <div className="min-h-[300px] md:min-h-0">
          <img
            src="https://bathareagrowers.org/wp-content/uploads/IMG_3572-1024x683.jpeg"
            alt="Community growing project"
            width={1024}
            height={683}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default IntroSection;
