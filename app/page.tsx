import LandingHero from "@/components/landing/LandingHero";
import SportsShowcase from "@/components/landing/SportsShowcase";
import HowItWorks from "@/components/landing/HowItWorks";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <LandingHero />
      <SportsShowcase />
      <HowItWorks />
      <LandingFooter />
    </div>
  );
}
