import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FAQSection() {
  return (
    <section id="faq" className="w-full bg-gray-50 py-12 md:py-24 lg:py-32 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Find answers to common questions about our platform and how it works.
            </p>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-3xl">
          <Accordion className="w-full" type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>How do I submit feedback?</AccordionTrigger>
              <AccordionContent>
                You can submit feedback by navigating to the "Report an Issue" section and filling out the form. Please
                provide as much detail as possible to help us understand your experience.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Is my feedback anonymous?</AccordionTrigger>
              <AccordionContent>
                You have the option to submit feedback anonymously. If you choose to provide your contact information,
                it will only be used for follow-up questions regarding your report.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>What happens after I submit feedback?</AccordionTrigger>
              <AccordionContent>
                Once submitted, your feedback is reviewed by our team. We aggregate similar reports and use the data to
                identify trends and areas for improvement. We then share this aggregated data with relevant public
                transport authorities to advocate for change.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>How can I support this initiative?</AccordionTrigger>
              <AccordionContent>
                You can support us by spreading the word about our platform, submitting detailed feedback, and if you
                wish, by making a donation to help us cover operational costs and expand our reach.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </section>
  )
}
