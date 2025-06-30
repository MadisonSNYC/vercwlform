import Image from "next/image"

export function AboutSection() {
  return (
    <section id="about" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Our Mission</h2>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              At Public Transport Feedback, our mission is to empower commuters by providing a direct channel to voice
              their experiences and contribute to the improvement of public transportation services. We believe that
              every voice matters in shaping a more efficient, safer, and user-friendly transit system for everyone.
            </p>
            <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              We are a non-profit initiative driven by the desire to foster transparency and accountability within
              public transport authorities. By aggregating and analyzing user feedback, we aim to highlight areas
              needing attention and advocate for positive changes that benefit the entire community.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Image
              alt="About Us"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="400"
              src="/placeholder.svg?height=400&width=600"
              width="600"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
