const MappingSection = () => {
  return (
    <section className="w-full bg-accent">
      <div className="grid md:grid-cols-2">
        <div className="flex items-center px-8 py-12 md:p-[60px]">
          <p className="text-foreground-alt text-[20px] leading-[1.7] font-normal">
            We are{" "}
            <a
              href="https://bath.resilienceweb.org.uk/?categories=Growing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-alt underline hover:text-foreground-alt"
            >
              mapping
            </a>{" "}
            and promoting organic community-focussed growing so it's easier to
            grow, glean or buy locally-grown nutritious fruit and veg.
          </p>
        </div>
        <div className="min-h-[300px] md:min-h-0">
          <img
            src="https://bathareagrowers.org/wp-content/uploads/IMG_3561-1024x691.jpeg"
            alt="Local community growing"
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
};

export default MappingSection;
