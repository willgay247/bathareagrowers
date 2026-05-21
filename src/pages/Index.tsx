import { SEO } from "@/components/SEO";
import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import GrowingGroupsSection from "@/components/GrowingGroupsSection";
import MappingSection from "@/components/MappingSection";
import OurWorkSection from "@/components/OurWorkSection";
import MissionAndValues from "@/components/MissionAndValues";
import CtaBanner from "@/components/CtaBanner";
import SupportersStrip from "@/components/SupportersStrip";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "NGO"],
  "name": "Bath Area Growers",
  "description": "A network of community growing projects across Bath and surrounding area",
  "url": "https://bathareagrowers.org",
  "areaServed": { "@type": "City", "name": "Bath, Somerset, UK" },
  "address": { "@type": "PostalAddress", "addressLocality": "Bath", "addressRegion": "Somerset", "addressCountry": "GB" },
};

const Index = () => {
  return (
    <main>
      <SEO
        title="Bath Area Growers"
        description="Connecting community growers, allotments, farms and surplus projects across the Bath area. Find growing spaces, events and volunteer opportunities near you."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Hero />
      <IntroSection />
      <GrowingGroupsSection />
      <MappingSection />
      <OurWorkSection />
      <MissionAndValues />
      <CtaBanner />
      <SupportersStrip />
    </main>
  );
};

export default Index;
