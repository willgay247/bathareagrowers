import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Item = Tables<"surplus_projects">;

const SurplusProjectsPage = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("surplus_projects").select("*").eq("hidden", false).order("display_order").then(({ data }) => {
      setItems(data ?? []); setLoading(false);
    });
  }, []);

  return (
    <main>
      <section
        className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3557-e1713291149232-200x200.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Surplus Projects
        </h1>
      </section>

      <section className="w-full bg-accent py-[60px] px-4">
        <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground-alt">
          Three projects in the network collect surplus vegetables and fruit and distribute it to those who can benefit. Each project is keen to hear about sources of surplus produce or crops that might go to waste. They also welcome new volunteers to help with harvesting, deliveries or admin.
        </p>
      </section>

      <section className="w-full bg-white py-20 px-4">
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No projects available.</p>
        ) : (
          <div className="mx-auto max-w-[1100px] grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((p) => (
              <div key={p.id} className="flex flex-col">
                <div className="aspect-[4/3] overflow-hidden rounded-t-md">
                  {p.image_url ? (
                    <img src={p.image_url} alt={p.name} className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    <div className="h-full w-full bg-background flex items-center justify-center text-foreground/40 text-sm">No image</div>
                  )}
                </div>
                <h2 className="mt-4 text-[22px] font-bold">{p.name}</h2>
                {p.description && <p className="mt-2 text-[15px] leading-relaxed text-foreground">{p.description}</p>}
                {p.link && <a href={p.link} target="_blank" rel="noreferrer" className="mt-3 text-[15px] font-semibold text-accent hover:underline">Read more..</a>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default SurplusProjectsPage;
