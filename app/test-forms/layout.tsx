import type React from "react"
import { LeadProgressIndicator } from "@/components/lead-progress-indicator"

export default function TestFormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <LeadProgressIndicator />
      {children}
    </div>
  )
}
