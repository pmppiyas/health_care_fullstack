import Footer from "@/components/shared/Footer"
import Navbar from "@/components/shared/Navbar"
import Link from "next/link"

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <Navbar />
      </header>

      {/* Main Content Area */}
      <main className="grow">{children}</main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
