"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What is DocZone?",
    answer:
      "DocZone is a healthcare management platform designed to help organizations manage doctors, patients, assignments, and healthcare analytics from one place.",
  },
  {
    question: "Who can use DocZone?",
    answer:
      "DocZone is designed for healthcare organizations and authorized staff who need a centralized system for managing doctors and patient records.",
  },
  {
    question: "Is patient data secure?",
    answer:
      "DocZone is designed with authentication, authorization, validation, and secure data-access practices to protect sensitive information.",
  },
  {
    question: "Can I get technical support?",
    answer:
      "Yes. You can contact our support team through the contact form or the support email provided above.",
  },
]

export function ContactFAQ() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold tracking-wider text-primary uppercase">
            FAQ
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            Frequently Asked Questions
          </h2>

          <p className="mt-3 text-muted-foreground">
            Quick answers to some common questions.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>

              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
