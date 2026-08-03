import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"
import React from "react"

export default function CommonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="overflow-hidden">
      <Navbar />
      <div className="flex flex-col items-center">{children}</div>
      <Footer />
    </div>
  )
}
