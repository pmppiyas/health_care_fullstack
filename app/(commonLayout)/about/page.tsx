import AboutHero from "@/components/about/AboutHero"
import MissionSection from "@/components/about/MissionSection"
import SecuritySection from "@/components/about/SecuritySection"
import WhatWeSolveSection from "@/components/about/WhatWeSolveSection"
import WhyDocZoneSection from "@/components/about/WhyDocZoneSection"

export default function AboutPage() {
  return (
    <main className="overflow-hidden">
      <AboutHero />
      <MissionSection />
      <WhyDocZoneSection />
      <WhatWeSolveSection />
      <SecuritySection />
    </main>
  )
}
