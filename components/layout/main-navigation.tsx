"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { MenuIcon } from "lucide-react"
import Image from "next/image"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import { cn } from "@/lib/utils"

export function MainNavigation() {
  const scrollPosition = useScrollPosition()
  const isScrolled = scrollPosition > 0

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md transition-all duration-300 dark:bg-gray-950/80",
        isScrolled && "border-b border-gray-200 dark:border-gray-800",
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
        <Link className="flex items-center gap-2" href="#">
          <Image src="/placeholder-logo.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
          <span className="text-lg font-semibold">Public Transport Feedback</span>
        </Link>
        <nav className="hidden space-x-4 md:flex">
          <Link
            className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            Home
          </Link>
          <Link
            className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            How It Works
          </Link>
          <Link
            className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            About
          </Link>
          <Link
            className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            FAQ
          </Link>
          <Link
            className="font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50"
            href="#"
          >
            Support
          </Link>
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button className="md:hidden bg-transparent" size="icon" variant="outline">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <Link className="flex items-center gap-2" href="#">
              <Image src="/placeholder-logo.svg" alt="Logo" width={32} height={32} className="h-8 w-8" />
              <span className="text-lg font-semibold">Public Transport Feedback</span>
            </Link>
            <div className="grid gap-2 py-6">
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                Home
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                How It Works
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                About
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                FAQ
              </Link>
              <Link className="flex w-full items-center py-2 text-lg font-semibold" href="#">
                Support
              </Link>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
