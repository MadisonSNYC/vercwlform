"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { LeadFormSchema } from "@/components/test-utils/form-validator"
import { submitLeadCapture } from "@/lib/actions"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface LeadCaptureFormProps {
  onSubmitSuccess: () => void
}

export function LeadCaptureForm({ onSubmitSuccess }: LeadCaptureFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof LeadFormSchema>>({
    resolver: zodResolver(LeadFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      borough: "",
      leaseTerm: "",
      moveInDate: new Date(),
      budget: 0,
      notes: "",
      paymentMethod: "credit_card",
      agreedToTerms: false,
    },
  })

  async function onSubmit(values: z.infer<typeof LeadFormSchema>) {
    setIsSubmitting(true)
    const result = await submitLeadCapture(values)
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
        <h2 className="text-2xl font-bold mb-4">Lead Capture Form</h2>

        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormDescription>Enter your full name.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="john.doe@example.com" {...field} />
              </FormControl>
              <FormDescription>Enter your email address.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input type="tel" placeholder="(123) 456-7890" {...field} />
              </FormControl>
              <FormDescription>Enter your phone number.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Main St" {...field} />
              </FormControl>
              <FormDescription>Enter your current address.</FormDescription>
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
              <FormDescription>Select your preferred borough.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="leaseTerm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desired Lease Term</FormLabel>
              <FormControl>
                <Input placeholder="e.g., 12 months, 2 years" {...field} />
              </FormControl>
              <FormDescription>Specify your desired lease term.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="moveInDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Move-in Date</FormLabel>
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
                    disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your preferred move-in date.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="e.g., 2500"
                  {...field}
                  onChange={(event) => field.onChange(Number.parseFloat(event.target.value))}
                />
              </FormControl>
              <FormDescription>Your monthly budget for rent.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Additional Notes</FormLabel>
              <FormControl>
                <Textarea placeholder="Any specific requirements or preferences?" {...field} />
              </FormControl>
              <FormDescription>Add any additional notes or requirements.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Preferred Payment Method</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="credit_card" />
                    </FormControl>
                    <FormLabel className="font-normal">Credit Card</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="bank_transfer" />
                    </FormControl>
                    <FormLabel className="font-normal">Bank Transfer</FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="paypal" />
                    </FormControl>
                    <FormLabel className="font-normal">PayPal</FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agreedToTerms"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>I agree to the terms and conditions</FormLabel>
                <FormDescription>You must agree to the terms and conditions to proceed.</FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Lead"}
        </Button>
      </form>
    </Form>
  )
}
