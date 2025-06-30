"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpIcon } from "lucide-react"
import { useScrollPosition } from "@/hooks/use-scroll-position"
import { cn } from "@/lib/utils"

export default function ScrollToTopButton() {
  const scrollPosition = useScrollPosition()
  const isScrolled = scrollPosition > 200 // Show button after scrolling 200px

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <Button
      className={cn(
        "fixed bottom-4 right-4 z-50 transition-all duration-300",
        isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4",
      )}
      size="icon"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      disabled={!isScrolled}
    >
      <ArrowUpIcon className="h-5 w-5" />
    </Button>
  )
}
