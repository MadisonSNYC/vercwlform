import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Facebook, Instagram, Twitter } from "lucide-react"

export function MainFooter() {
  return (
    <footer className="w-full bg-gray-100 py-8 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">About Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              We are dedicated to improving public transportation experiences by providing a platform for users to
              report issues and share feedback.
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <nav className="space-y-2">
              <Link
                className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Home
              </Link>
              <Link
                className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                How It Works
              </Link>
              <Link
                className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                About
              </Link>
              <Link
                className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                FAQ
              </Link>
              <Link
                className="block text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
                href="#"
              >
                Support
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Email: info@example.com
              <br />
              Phone: (123) 456-7890
            </p>
            <div className="flex space-x-4">
              <Link className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" href="#">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="text-center text-sm text-gray-600 dark:text-gray-400">
          © 2023 Public Transport Feedback. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
