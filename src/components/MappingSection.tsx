import { imageUrl } from "@/lib/imageUrl";

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
            src={imageUrl("IMG_3561-1024x691.jpeg", { width: 800, quality: 75 })}
            srcSet={`${imageUrl("IMG_3561-1024x691.jpeg", { width: 400, quality: 70 })} 400w, ${imageUrl("IMG_3561-1024x691.jpeg", { width: 800, quality: 75 })} 800w`}
            sizes="(min-width: 768px) 50vw, 100vw"
            alt="Local community growing"
            width={1024}
            height={691}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};

export default MappingSection;
