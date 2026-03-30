import Hero from "@/components/Hero";
import IntroSection from "@/components/IntroSection";
import GrowingGroupsSection from "@/components/GrowingGroupsSection";
import MappingSection from "@/components/MappingSection";
import OurWorkSection from "@/components/OurWorkSection";
import MissionAndValues from "@/components/MissionAndValues";
import CtaBanner from "@/components/CtaBanner";
import NewsletterSignup from "@/components/NewsletterSignup";
import SupportersStrip from "@/components/SupportersStrip";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main>
      <Hero />
      <IntroSection />
      <GrowingGroupsSection />
      <MappingSection />
      <OurWorkSection />
      <MissionAndValues />
      <CtaBanner />
      <NewsletterSignup />
      <SupportersStrip />
      <Footer />
    </main>
  );
};

export default Index;
