import { type ReactNode } from "react"

interface MainLayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="container mx-auto min-h-[calc(100vh-70px)] max-w-360">
      {children}
    </div>
  )
}
