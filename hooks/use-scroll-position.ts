"use client"

import { useState, useEffect } from "react"

/**
 * Custom hook to track the vertical scroll position of the window.
 * @returns The current vertical scroll position in pixels.
 */
export function useScrollPosition(): number {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const updateScrollPosition = () => {
      setScrollPosition(window.scrollY)
    }

    // Set initial value
    updateScrollPosition()

    // Add event listener for scroll
    window.addEventListener("scroll", updateScrollPosition)

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("scroll", updateScrollPosition)
    }
  }, [])

  return scrollPosition
}
