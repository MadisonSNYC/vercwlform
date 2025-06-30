import Image from "next/image"

export function MadisonStorySection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="flex items-center justify-center">
            <Image
              alt="Madison"
              className="mx-auto aspect-square overflow-hidden rounded-xl object-cover object-center sm:w-full"
              height="400"
              src="/madison-new-photo.jpeg"
              width="400"
            />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Madison&apos;s Story</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              &quot;I rely on public transport every day for my commute, and while it&apos;s generally good, there are
              times when I&apos;ve experienced issues that I wished I could report easily. From overcrowding to
              unexpected delays, these small problems add up and affect my daily routine.
            </p>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              This platform has been a game-changer. It&apos;s so simple to submit a report, and knowing that my
              feedback, along with hundreds of others, is being used to push for real improvements gives me hope. It
              feels like my voice finally matters, and I&apos;m contributing to a better system for everyone.&quot;
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-50">- Madison, Daily Commuter</p>
          </div>
        </div>
      </div>
    </section>
  )
}
