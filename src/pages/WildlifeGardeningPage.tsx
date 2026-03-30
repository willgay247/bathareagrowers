import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SEO } from "@/components/SEO";

type Item = Tables<"wildlife_gardening_entries">;

const WildlifeGardeningPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("wildlife_gardening_entries").select("*").eq("hidden", false).order("display_order").then(({ data }) => {
      setItems(data ?? []); setLoading(false);
    });
  }, []);

  return (
    <main>
      <SEO title="Wildlife Gardening" description="Wildlife gardening projects across Bath focused on biodiversity, pollinators, and creating habitats for nature." />
      <section
        className="relative flex h-[40vh] md:h-[60vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3679.webp')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Wildlife Gardening
        </h1>
      </section>

      <section className="w-full bg-accent py-[60px] px-4">
        <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground-alt">
          These local groups have a focus on gardening and managing land to support wildlife and create resilient natural ecosystems.
        </p>
      </section>

      {loading ? (
        <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
      ) : items.length === 0 ? (
        <section className="w-full bg-white py-20 px-4"><p className="text-center text-muted-foreground">No entries available.</p></section>
      ) : (
        items.map((g, i) => {
          const reversed = i % 2 !== 0;
          const bg = i % 2 === 0 ? "bg-white" : "bg-background";
          return (
            <section key={g.id} className={`w-full ${bg} py-[60px] px-4`}>
              <div className={`mx-auto max-w-[1100px] flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12`}>
                <div className="md:w-1/2">
                  <div className="aspect-[4/3] overflow-hidden rounded-md">
                    {g.image_url ? (
                      <img src={g.image_url} alt={g.title} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="h-full w-full bg-background flex items-center justify-center text-foreground/40 text-sm">Image coming soon</div>
                    )}
                  </div>
                </div>
                <div className="md:w-1/2 flex flex-col justify-center">
                  <h2 className="text-[32px] font-bold">{g.title}</h2>
                  {g.description && <p className="mt-3 text-[15px] leading-relaxed text-foreground">{g.description}</p>}
                  {g.link && <a href={g.link} target="_blank" rel="noreferrer" className="mt-4 text-[15px] font-semibold text-accent hover:underline">More details..</a>}
                </div>
              </div>
            </section>
          );
        })
      )}
    </main>
  );
};

export default WildlifeGardeningPage;
