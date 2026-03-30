import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SEO } from "@/components/SEO";
import { imageUrl } from "@/lib/imageUrl";

type Farm = Tables<"farms">;

const FarmsPage = () => {
  const [items, setItems] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("farms").select("*").eq("hidden", false).order("display_order").then(({ data }) => {
      setItems(data ?? []); setLoading(false);
    });
  }, []);

  return (
    <main>
      <SEO title="Farms & Market Gardens" description="Meet the organic farms and market gardens around Bath supplying local food and supporting sustainable land management." />
      <section className="relative flex h-[40vh] md:h-[60vh] w-full items-center justify-center overflow-hidden">
        <img src={imageUrl("IMG_3632-e1715201712644.jpeg", { width: 1200, quality: 75 })} alt="Organic farms around Bath" className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[28px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Farms and Market Gardens
        </h1>
      </section>

      <section className="w-full bg-accent py-10 md:py-[60px] px-4">
        <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground-alt">
          Meet our network of market gardeners growing organic food for sale. You can volunteer on many of these farms, learning from experienced professional growers and helping their businesses to thrive.
        </p>
      </section>

      <section className="w-full py-10 md:py-20 px-4 bg-background">
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No farms available.</p>
        ) : (
          <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((f) => (
              <div key={f.id} className="flex flex-col">
                <div className="aspect-[4/3] overflow-hidden rounded-t-md">
                  {f.image_url ? (
                    <img src={imageUrl(f.image_url, { width: 400, quality: 75 })} srcSet={`${imageUrl(f.image_url, { width: 400, quality: 75 })} 400w, ${imageUrl(f.image_url, { width: 800, quality: 75 })} 800w`} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" alt={f.name} className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  ) : (
                    <div className="h-full w-full bg-background flex items-center justify-center text-foreground/40 text-sm">No image</div>
                  )}
                </div>
                <h3 className="mt-4 text-[22px] font-bold">{f.name}</h3>
                {f.description && <p className="mt-2 text-[15px] leading-relaxed text-foreground">{f.description}</p>}
                {f.volunteering_link && <a href={f.volunteering_link} target="_blank" rel="noreferrer" className="mt-3 text-[15px] font-semibold text-accent hover:underline">More details..</a>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default FarmsPage;
