import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesPreview from "@/components/home/FeaturesPreview";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <HowItWorks />
      <FeaturesPreview />
      <Testimonials />
      <CTASection />
    </>
  );
}
