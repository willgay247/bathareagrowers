import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { SEO } from "@/components/SEO";
import { imageUrl } from "@/lib/imageUrl";

type Garden = Tables<"community_gardens">;

const BENEFITS = [
  { title: "Friendly", body: "A great way to meet new people in your local area and be part of community." },
  { title: "Beautiful", body: "Community and collective gardens and allotments often include tranquil orchards and wildlife areas." },
  { title: "Roles for all", body: "Community growing can accommodate disabilities and different interests." },
  { title: "Flexible", body: "Come when it works for you, knowing others are sharing the garden care." },
  { title: "Learning spaces", body: "No experience or knowledge needed, you can be guided by others." },
  { title: "Fresh food", body: "Unlike volunteering, you are growing for your own dinner!" },
];

const SITES_ACROSS = [
  { title: "Bath & NE Somerset Allotment Association", body: "Bath Allotments Association is an independent not-for-profit organisation that supports allotment holders and leisure growers in the Bath and North-East Somerset Council area." },
  { title: "More Trees Banes", body: "Our vision is of a dynamic and diverse tree rich landscape across Bath and North East Somerset and beyond. We are building a community of people learning about trees, how to grow, plant and care for them." },
];

const REGION_LABELS: Record<string, string> = { west: "West Bath", central: "Central Bath", east: "East Bath" };
const REGION_ORDER = ["west", "central", "east"];
const REGION_BG = ["bg-white", "bg-background", "bg-white"];

const GardenCard = ({ garden, reversed }: { garden: Garden; reversed: boolean }) => (
  <div className={`flex flex-col ${reversed ? "md:flex-row-reverse" : "md:flex-row"} gap-6 md:gap-10`}>
    <div className="md:w-1/2">
      <div className="aspect-[4/3] overflow-hidden rounded-md">
        {garden.image_url ? (
          <img src={garden.image_url} alt={garden.name} className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <div className="h-full w-full bg-background flex items-center justify-center text-foreground/30 text-lg">🌿</div>
        )}
      </div>
    </div>
    <div className="md:w-1/2 flex flex-col justify-center">
      <h3 className="text-[22px] font-bold">{garden.name}</h3>
      {garden.bio && <p className="mt-2 text-[15px] leading-relaxed text-foreground">{garden.bio}</p>}
      {garden.external_link && (
        <a href={garden.external_link} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[15px] font-semibold text-accent hover:underline">
          More details..
        </a>
      )}
    </div>
  </div>
);

const CommunityGardensPage = () => {
  const [gardens, setGardens] = useState<Garden[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("community_gardens")
      .select("*")
      .eq("hidden", false)
      .order("display_order", { ascending: true })
      .then(({ data }) => {
        setGardens(data ?? []);
        setLoading(false);
      });
  }, []);

  const grouped = REGION_ORDER.map((r) => gardens.filter((g) => g.region === r));

  return (
    <main>
      <SEO title="Community Gardens" description="Discover community gardens and allotments across Bath and the surrounding area. Find a plot, get involved, and grow with your neighbours." />
      {/* Hero */}
      <section className="relative flex h-[40vh] md:h-[60vh] w-full items-center justify-center overflow-hidden">
        <img src={imageUrl("cropped-IMG_3545-1-200x200.jpeg", { width: 1200, quality: 75 })} alt="Community gardens in Bath" className="absolute inset-0 w-full h-full object-cover" loading="eager" decoding="async" />
        <div className="absolute inset-0 bg-black/45" />
        <h1 className="relative z-10 text-center text-[28px] font-bold text-foreground-alt px-4 md:text-[48px]">
          Community Gardens and Allotments
        </h1>
      </section>

      {/* Intro banner */}
      <section className="w-full bg-accent py-10 md:py-[60px] px-4">
        <h2 className="mx-auto max-w-[700px] text-center text-[28px] font-bold leading-snug text-foreground-alt md:text-[32px]">
          Joining a community garden or collective allotment is a great way to start the journey into growing.
        </h2>
      </section>

      {/* Benefits grid */}
      <section className="w-full bg-background py-10 md:py-20 px-4">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-[20px] leading-relaxed text-foreground mb-12">
            Browse all the beautiful and diverse community and collective gardens and allotments across the area. Check out more details on our Resilience Web, such as location, meeting days, cost, accessibility and how to join.
          </p>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title}>
                <h3 className="text-[22px] font-bold">{b.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Region sections */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
        </div>
      ) : (
        REGION_ORDER.map((r, ri) => {
          const regionGardens = grouped[ri];
          if (regionGardens.length === 0) return null;
          return (
            <section key={r} className={`w-full ${REGION_BG[ri]} py-10 md:py-20 px-4`}>
              <div className="mx-auto max-w-[1100px]">
                <h2 className="text-[24px] md:text-[36px] font-bold mb-8 md:mb-12">{REGION_LABELS[r]}</h2>
                <div className="flex flex-col gap-16">
                  {regionGardens.map((g, i) => (
                    <GardenCard key={g.id} garden={g} reversed={i % 2 !== 0} />
                  ))}
                </div>
              </div>
            </section>
          );
        })
      )}

      {/* Sites across Bath */}
      <section className="w-full bg-background py-10 md:py-[60px] px-4">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="text-[24px] md:text-[36px] font-bold mb-8 md:mb-10">Sites across the Bath area</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {SITES_ACROSS.map((s) => (
              <div key={s.title}>
                <h3 className="text-[22px] font-bold">{s.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default CommunityGardensPage;
