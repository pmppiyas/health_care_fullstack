"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Logo from "@/components/shared/Logo"
import { useGetMeQuery } from "@/redux/features/auth.api"
import { getDashboardRoute } from "@/utils/get-dashboard-route"

const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About Us" },
    { href: "/contact", label: "Contact" },
  ]

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const { data, isLoading } = useGetMeQuery()

  const isLoggedIn = !!data

  const dblink = isLoggedIn ? getDashboardRoute(data?.role) : "/login"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden items-center space-x-8 md:flex">
            {navItems.map((item) => {
              const active = isActive(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-sm font-medium transition-colors ${
                    active
                      ? "text-primary after:absolute after:bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                      : "text-muted-foreground hover:text-primary"
                  } `}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
            {isLoading ? (
              <div className="h-9 w-24 animate-pulse rounded-md bg-muted" />
            ) : isLoggedIn ? (
              <Link
                href={dblink}
                className={buttonVariants({ variant: "default" })}
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Log in
                </Link>

                <Link
                  href="/register"
                  className={buttonVariants({ variant: "default" })}
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="-mr-4 md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-75 sm:w-100">
                <nav className="mt-8 flex flex-col gap-6 px-8">
                  <div className="flex flex-col space-y-4">
                    {navItems.map((item) => {
                      const active = isActive(item.href)

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={`relative w-fit py-1 text-lg font-medium transition-colors ${
                            active
                              ? "text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:bg-primary"
                              : "text-muted-foreground hover:text-primary"
                          } `}
                        >
                          {item.label}
                        </Link>
                      )
                    })}
                  </div>

                  <hr className="border-border" />

                  <div className="flex flex-col space-y-3">
                    <Link
                      href="/login"
                      className={buttonVariants({
                        variant: "outline",
                        className: "w-full justify-center",
                      })}
                    >
                      Log in
                    </Link>

                    <Link
                      href="/register"
                      className={buttonVariants({
                        variant: "default",
                        className: "w-full justify-center",
                      })}
                    >
                      Sign up
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
