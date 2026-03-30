import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

type Resource = Tables<"resources">;

const ResourcesPage = () => {
  const [items, setItems] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("resources")
      .select("*")
      .eq("hidden", false)
      .order("display_order")
      .then(({ data }) => { setItems(data ?? []); setLoading(false); });
  }, []);

  return (
    <main>
      <section
        className="relative flex h-[60vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://bathareagrowers.org/wp-content/uploads/IMG_3690.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[40px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Resources
        </h1>
      </section>

      <section className="w-full bg-background py-[60px] px-4">
        <p className="mx-auto max-w-[800px] text-center text-[20px] leading-relaxed text-foreground">
          Useful links and resources for growers in the Bath area.
        </p>
      </section>

      <section className="w-full bg-white py-20 px-4">
        <div className="mx-auto max-w-[900px] flex flex-col gap-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            </div>
          ) : items.length === 0 ? (
            <p className="text-center text-muted-foreground py-12">No resources available at this time.</p>
          ) : (
            items.map((r) => (
              <div key={r.id} className="rounded-lg border border-background p-6">
                <h3 className="text-[20px] font-bold">{r.title}</h3>
                {r.description && <p className="mt-2 text-[15px] leading-relaxed text-foreground">{r.description}</p>}
                {r.link && (
                  <a href={r.link} target="_blank" rel="noreferrer" className="mt-3 inline-block text-[15px] font-semibold text-accent hover:underline">
                    Visit resource ↗
                  </a>
                )}
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  );
};

export default ResourcesPage;
