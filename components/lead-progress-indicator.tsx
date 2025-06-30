"use client"

import { Progress } from "@/components/ui/progress"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export function LeadProgressIndicator() {
  const pathname = usePathname()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // This is a simplified example. In a real app, you'd map specific paths
    // or form states to progress percentages.
    if (pathname === "/test-forms") {
      setProgress(33)
    } else if (pathname === "/test-forms/page-2") {
      setProgress(66)
    } else if (pathname === "/thank-you") {
      setProgress(100)
    } else {
      setProgress(0)
    }
  }, [pathname])

  return (
    <div className="w-full max-w-2xl mb-8">
      <h2 className="text-xl font-semibold mb-2">Form Progress</h2>
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-gray-500 mt-2">{progress}% Complete</p>
    </div>
  )
}
