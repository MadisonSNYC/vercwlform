"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { ReportFormSchema } from "@/components/test-utils/form-validator"
import { submitFareReport } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface ReportFormProps {
  onSubmitSuccess: () => void
}

export function ReportForm({ onSubmitSuccess }: ReportFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof ReportFormSchema>>({
    resolver: zodResolver(ReportFormSchema),
    defaultValues: {
      reporterName: "",
      reporterEmail: "",
      incidentDate: new Date(),
      incidentTime: "",
      location: "",
      borough: "",
      fareAmount: 0,
      description: "",
      contactPermission: false,
    },
  })

  async function onSubmit(values: z.infer<typeof ReportFormSchema>) {
    setIsSubmitting(true)
    const result = await submitFareReport(values)
    if (result.success) {
      toast({
        title: "Success!",
        description: result.message,
      })
      onSubmitSuccess()
    } else {
      toast({
        title: "Error!",
        description: result.message,
        variant: "destructive",
      })
      console.error("Form submission error:", result.errors)
    }
    setIsSubmitting(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 p-4 border rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Fare Report Form</h2>

        <FormField
          control={form.control}
          name="reporterName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Name</FormLabel>
              <FormControl>
                <Input placeholder="Jane Doe" {...field} />
              </FormControl>
              <FormDescription>Enter your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reporterEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jane.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>Enter your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="incidentDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Incident Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn("w-[240px] pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                    >
                      {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>The date the incident occurred.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="incidentTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Incident Time</FormLabel>
              <FormControl>
                <Input type="time" {...field} />
              </FormControl>
              <FormDescription>The approximate time the incident occurred.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location of Incident</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 123 Main St, Subway Station" {...field} />
              </FormControl>
              <FormDescription>Where did the incident take place?</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="borough"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Borough</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a borough" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Manhattan">Manhattan</SelectItem>
                  <SelectItem value="Brooklyn">Brooklyn</SelectItem>
                  <SelectItem value="Queens">Queens</SelectItem>
                  <SelectItem value="Bronx">Bronx</SelectItem>
                  <SelectItem value="Staten Island">Staten Island</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Select the borough where the incident occurred.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fareAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Fare Amount (USD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 2.75"
                  {...field}
                  onChange={(event) => field.onChange(Number.parseFloat(event.target.value))}
                />
              </FormControl>
              <FormDescription>The amount of fare involved in the incident.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description of Incident</FormLabel>
              <FormControl>
                <Textarea placeholder="Provide details about what happened..." {...field} />
              </FormControl>
              <FormDescription>Describe the incident in detail.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="contactPermission"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I give permission to be contacted regarding this report.</FormLabel>
                <FormDescription>
                  Check this box if you are willing to be contacted for more information.
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Report"}
        </Button>
      </form>
    </Form>
  )
}
