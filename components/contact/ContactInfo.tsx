import { Mail, Phone, MapPin, Clock } from "lucide-react"

const contactItems = [
  {
    icon: Mail,
    title: "Email",
    value: "support@doczone.com",
    description: "Send us an email anytime",
  },
  {
    icon: Phone,
    title: "Phone",
    value: "+880 1234-567890",
    description: "Mon–Fri, 9:00 AM–6:00 PM",
  },
  {
    icon: MapPin,
    title: "Office",
    value: "Dhaka, Bangladesh",
    description: "Our main office",
  },
  {
    icon: Clock,
    title: "Support Hours",
    value: "9:00 AM – 6:00 PM",
    description: "Monday to Friday",
  },
]

export function ContactInfo() {
  return (
    <section className="pb-16">
      <div className="mx-auto grid max-w-6xl gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {contactItems.map((item) => {
          const Icon = item.icon

          return (
            <div
              key={item.title}
              className="rounded-2xl border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/30"
            >
              <div className="mb-4 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>

              <h3 className="font-semibold">{item.title}</h3>

              <p className="mt-2 font-medium text-primary">{item.value}</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
