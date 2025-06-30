"use client"

// hooks/use-mobile.tsx
import { useState, useEffect } from "react"

/**
 * Custom hook to detect if the current viewport width is considered mobile.
 * @param breakpoint The maximum width (in pixels) for a device to be considered mobile. Defaults to 768px (md breakpoint).
 * @returns `true` if the current width is less than or equal to the breakpoint, `false` otherwise.
 */
export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth <= breakpoint)
    }

    // Set initial value
    checkIsMobile()

    // Add event listener for window resize
    window.addEventListener("resize", checkIsMobile)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", checkIsMobile)
    }
  }, [breakpoint])

  return isMobile
}
