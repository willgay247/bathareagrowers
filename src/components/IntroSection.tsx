import { imageUrl } from "@/lib/imageUrl";

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
            src={imageUrl("IMG_3572-1024x683.jpeg", { width: 800, quality: 75 })}
            srcSet={`${imageUrl("IMG_3572-1024x683.jpeg", { width: 400, quality: 70 })} 400w, ${imageUrl("IMG_3572-1024x683.jpeg", { width: 800, quality: 75 })} 800w`}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Community growing project"
            width={1024}
            height={683}
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
