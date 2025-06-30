"use client"

interface LeadProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function LeadProgressIndicator({ currentStep, totalSteps, stepLabels }: LeadProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {stepLabels.map((label, index) => (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                index < currentStep
                  ? "bg-green-500 text-white"
                  : index === currentStep
                    ? "bg-orange-500 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {index < currentStep ? "✓" : index + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${index <= currentStep ? "text-gray-900" : "text-gray-500"}`}>
              {label}
            </span>
            {index < totalSteps - 1 && (
              <div
                className={`mx-4 h-0.5 w-12 transition-colors ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
