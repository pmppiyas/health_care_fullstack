import { AnalyticsPreview } from "@/components/home/AnalyticsPreview"
import { CTASection } from "@/components/home/CTASection"
import FeatureSection from "@/components/home/FeatureSection"
import { HeroSection } from "@/components/home/HeroSection"
import { HowItWorks } from "@/components/home/how-it-works"
import { StatsSection } from "@/components/home/StatsSection"

const page = () => {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeatureSection />
      <HowItWorks />
      <AnalyticsPreview />
      <CTASection />
    </main>
  )
}

export default page
