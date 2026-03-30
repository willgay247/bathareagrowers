import { imageUrl } from "@/lib/imageUrl";

const Hero = () => {
  return (
    <section className="relative w-full h-[40vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
      <img
        src={imageUrl("IMG_3572-1024x683.jpeg", { width: 1200, quality: 75 })}
        srcSet={`${imageUrl("IMG_3572-1024x683.jpeg", { width: 640, quality: 70 })} 640w, ${imageUrl("IMG_3572-1024x683.jpeg", { width: 1024, quality: 75 })} 1024w, ${imageUrl("IMG_3572-1024x683.jpeg", { width: 1600, quality: 75 })} 1600w`}
        sizes="100vw"
        alt="Fresh vegetables and produce from Bath area community gardens"
        width={1024}
        height={683}
        className="absolute inset-0 w-full h-full object-cover"
        fetchPriority="high"
        loading="eager"
        decoding="async"
      />
      <div className="absolute inset-0 bg-background-inverse/30" />
      <h1 className="relative z-10 text-foreground-alt text-center uppercase tracking-[0.05em]">
        BATH AREA GROWERS
      </h1>
    </section>
  );
};

export default Hero;
