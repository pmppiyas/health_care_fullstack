import { ContactFAQ } from "@/components/contact/ContactFAQ"
import { ContactForm } from "@/components/contact/ContactForm"
import { ContactHero } from "@/components/contact/ContactHero"
import { ContactInfo } from "@/components/contact/ContactInfo"
import { CTASection } from "@/components/home/CTASection"

const page = () => {
  return (
    <main className="overflow-hidden">
      <ContactHero />
      <ContactInfo />
      <ContactForm />
      <ContactFAQ />
      <CTASection />
    </main>
  )
}

export default page
