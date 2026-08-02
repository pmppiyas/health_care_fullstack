import Link from "next/link"
import { MapPin, Phone, Mail } from "lucide-react"
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa"

const Footer = () => {
  return (
    <footer className="w-full border-t border-zinc-800 bg-zinc-950 pt-16 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. Brand Section */}
          <div className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-white"
            >
              HealthCare<span className="text-blue-500">+</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Streamlining clinic operations and enhancing patient care with
              modern, secure, and intuitive management tools.
            </p>
            <div className="flex space-x-4 pt-2">
              <Link
                href="#"
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-blue-600 hover:text-white"
              >
                <FaFacebook className="h-4 w-4" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-blue-600 hover:text-white"
              >
                <FaTwitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-blue-600 hover:text-white"
              >
                <FaInstagram className="h-4 w-4" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="rounded-full bg-zinc-900 p-2 text-zinc-400 transition-colors hover:bg-blue-600 hover:text-white"
              >
                <FaLinkedin className="h-4 w-4" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Quick Links
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/"
                  className="transition-colors hover:text-blue-400"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="transition-colors hover:text-blue-400"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/doctors"
                  className="transition-colors hover:text-blue-400"
                >
                  Find a Doctor
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="transition-colors hover:text-blue-400"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Legal */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Legal
            </h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/privacy"
                  className="transition-colors hover:text-blue-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="transition-colors hover:text-blue-400"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="transition-colors hover:text-blue-400"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold tracking-wider text-white uppercase">
              Contact Us
            </h3>
            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 shrink-0 text-blue-500" />
                <span>123 Health Avenue, Medical District, Dhaka 1212</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 shrink-0 text-blue-500" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="h-5 w-5 shrink-0 text-blue-500" />
                <span>support@healthcareplus.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Copyright Section */}
      <div className="mt-16 border-t border-zinc-800 bg-zinc-950/50 py-6">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-sm text-zinc-500">
            &copy; {new Date().getFullYear()} HealthCare+ Clinic Management. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
