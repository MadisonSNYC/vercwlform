import { LightbulbIcon, MessageSquareIcon, TrendingUpIcon } from "lucide-react"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our platform makes it easy to report issues and contribute to better public transport.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900">
              <MessageSquareIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">1. Report an Issue</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Easily submit detailed reports about incidents, delays, or feedback on services.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900">
              <LightbulbIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">2. Analyze & Aggregate</h3>
            <p className="text-gray-500 dark:text-gray-400">
              We collect and analyze all submissions to identify patterns and key areas for improvement.
            </p>
          </div>
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-gray-50 dark:bg-gray-50 dark:text-gray-900">
              <TrendingUpIcon className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-bold">3. Drive Change</h3>
            <p className="text-gray-500 dark:text-gray-400">
              Your collective feedback is used to advocate for positive changes with transport authorities.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
