"use client"

import { Button } from "@/components/ui/button"

interface ThankYouSectionProps {
  onBackToForms: () => void
}

export function ThankYouSection({ onBackToForms }: ThankYouSectionProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="mb-4 text-4xl font-bold text-green-600">Thank You!</h2>
      <p className="mb-8 text-lg text-gray-700">Your submission has been received successfully.</p>
      <Button onClick={onBackToForms}>Back to Forms</Button>
    </div>
  )
}
