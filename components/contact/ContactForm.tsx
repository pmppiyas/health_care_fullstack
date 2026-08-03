"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <p className="text-sm font-semibold tracking-wider text-primary uppercase">
              Contact Us
            </p>

            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              We&apos;d love to hear from you
            </h2>

            <p className="mt-4 max-w-lg leading-relaxed text-muted-foreground">
              Whether you have a question about DocZone, need technical support,
              or want to discuss your organization&apos;s needs, send us a
              message.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl border bg-card p-6 sm:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>

                <Input name="name" placeholder="Your name" required />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>

                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>

              <Input name="subject" placeholder="How can we help?" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>

              <Textarea
                name="message"
                placeholder="Write your message..."
                className="min-h-32"
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full gap-2">
              <Send className="size-4" />

              {loading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
