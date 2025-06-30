import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Form Testing Suite - NYC FARE Reporter",
  description: "Comprehensive testing interface for all application forms",
}

export default function TestFormsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
