import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SEO } from "@/components/SEO";
import { imageUrl } from "@/lib/imageUrl";

type Course = Tables<"courses">;

const CoursesPage = () => {
  const [items, setItems] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("courses").select("*").eq("hidden", false).order("display_order").then(({ data }) => {
      setItems(data ?? []); setLoading(false);
    });
  }, []);

  return (
    <main>
      <SEO title="Courses & Workshops" description="Learn to grow with courses and workshops from Bath Area Growers and our network of community growing projects." />
      <section
        className="relative flex h-[40vh] md:h-[60vh] w-full items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('https://fgjdlgslkwfgfzidfpyz.supabase.co/storage/v1/object/public/cms-images/IMG_3690.jpeg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[28px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Courses
        </h1>
      </section>

      <section className="w-full bg-accent py-10 md:py-[60px] px-4">
        <p className="mx-auto max-w-[700px] text-center text-[20px] leading-relaxed text-foreground-alt">
          Many of our growing projects offer learning events. Here are those offering regular workshops or training.
        </p>
      </section>

      <section className="w-full bg-white py-10 md:py-20 px-4">
        {loading ? (
          <div className="flex justify-center py-12"><div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" /></div>
        ) : items.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No courses available.</p>
        ) : (
          <div className="mx-auto max-w-[1100px] flex flex-col gap-6">
            {items.map((c) => (
              <div key={c.id} className="flex flex-col md:flex-row border border-background rounded-md p-6 gap-6">
                <div className="md:w-1/4 flex items-center justify-center">
                  {c.logo_url ? (
                    <img src={c.logo_url} alt={c.org_name} className="w-full rounded-md object-contain max-h-[140px]" loading="lazy" />
                  ) : (
                    <div className="h-[100px] w-full bg-background flex items-center justify-center rounded-md text-foreground/40 text-sm">No logo</div>
                  )}
                </div>
                <div className="md:w-3/4 flex flex-col justify-center">
                  <h3 className="text-[14px] font-bold uppercase tracking-wide text-accent">{c.org_name}</h3>
                  {c.course_name && <h4 className="mt-1 text-[22px] font-bold">{c.course_name}</h4>}
                  {(c as any).description && <p className="mt-2 text-[15px] text-foreground/80">{(c as any).description}</p>}
                  {c.location && (
                    <span className="mt-3 inline-block self-start rounded-full bg-background px-3 py-1 text-[13px] text-foreground">
                      {c.location}
                    </span>
                  )}
                  {c.link && <a href={c.link} target="_blank" rel="noreferrer" className="mt-3 text-[15px] font-semibold text-accent hover:underline">Learn more ↗</a>}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default CoursesPage;
