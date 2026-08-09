import type { Metadata } from "next";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";

export const metadata: Metadata = {
  title: "Welcome to Turfog",
  description: "Set up your player profile in a few quick steps.",
};

export default function OnboardingPage() {
  return <OnboardingFlow />;
}