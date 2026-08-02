import Link from "next/link"
import React from "react"
import { Menu } from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="shrink-0">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-primary"
            >
              HealthCare+
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-8 md:flex">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden items-center space-x-4 md:flex">
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
          </div>

          {/* Mobile Menu (Sheet) */}
          <div className="flex items-center md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-75 sm:w-100">
                <nav className="mt-8 flex flex-col gap-6 px-8">
                  <div className="flex flex-col space-y-4">
                    <Link
                      href="/"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Home
                    </Link>
                    <Link
                      href="/about"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      About Us
                    </Link>
                    <Link
                      href="/contact"
                      className="text-lg font-medium transition-colors hover:text-primary"
                    >
                      Contact
                    </Link>
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
