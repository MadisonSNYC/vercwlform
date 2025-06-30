import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { submitLead, submitReport } from "@/lib/actions" // Assuming these are your server actions
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function IntegrationTestPage() {
  const supabase = createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/login');
  }

  // Mock data for LeadAnalytics
  const mockLeadData = {
    totalLeads: 1234,
    leadsByFormType: [
      { name: 'Waitlist', value: 500 },
      { name: 'Schedule', value: 400 },
      { name: 'Report', value: 334 },
    ],
    leadsOverTime: [
      { date: 'Jan', count: 100 },
      { date: 'Feb', count: 120 },
      { date: 'Mar', count: 150 },
      { date: 'Apr', count: 130 },
      { date: 'May', count: 180 },
    ],
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test Page</h1>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">User Authentication Status</h2>
        <Card>
          <CardContent className="p-4">
            {user ? (
              <div className="flex items-center justify-between">
                <p>Logged in as: {user.email}</p>
                <form action="/auth/sign-out" method="post">
                  <Button type="submit">Sign Out</Button>
                </form>
              </div>
            ) : (
              <p>Not logged in. <Link href="/login" className="text-blue-500 hover:underline">Go to Login</Link></p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Lead Submission Form Test</h2>
        <Card>
          <CardHeader>
            <CardTitle>Submit a Test Lead</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitLead} className="space-y-4">
              <Input type="hidden" name="form_type" value="test_lead" />
              <div>
                <Label htmlFor="lead-first-name">First Name</Label>
                <Input id="lead-first-name" name="first_name" placeholder="John" required />
              </div>
              <div>
                <Label htmlFor="lead-last-name">Last Name</Label>
                <Input id="lead-last-name" name="last_name" placeholder="Doe" required />
              </div>
              <div>
                <Label htmlFor="lead-email">Email</Label>
                <Input id="lead-email" name="email" type="email" placeholder="john.doe@example.com" required />
              </div>
              <div>
                <Label htmlFor="lead-phone">Phone (Optional)</Label>
                <Input id="lead-phone" name="phone" type="tel" placeholder="123-456-7890" />
              </div>
              <div>
                <Label htmlFor="lead-contact-time">Preferred Contact Time (Optional)</Label>
                <Input id="lead-contact-time" name="contact_time" placeholder="Anytime" />
              </div>
              <div>
                <Label htmlFor="lead-issue-snapshot">Issue Snapshot (Optional)</Label>
                <Textarea id="lead-issue-snapshot" name="issue_snapshot" placeholder="Brief description of issue" />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="lead-mailing-list-consent" name="mailing_list_consent" />
                <Label htmlFor="lead-mailing-list-consent">Consent to mailing list</Label>
              </div>
              <Button type="submit">Submit Test Lead</Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Report Submission Form Test</h2>
        <Card>
          <CardHeader>
            <CardTitle>Submit a Test Report</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={submitReport} className="space-y-4">
              {/* Personal Information */}
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div><Label htmlFor="report-first-name">First Name</Label><Input id="report-first-name" name="first_name" required /></div>
              <div><Label htmlFor="report-last-name">Last Name</Label><Input id="report-last-name" name="last_name" required /></div>
              <div><Label htmlFor="report-email">Email</Label><Input id="report-email" name="email" type="email" required /></div>
              <div><Label htmlFor="report-phone">Phone</Label><Input id="report-phone" name="phone" type="tel" /></div>
              <div>
                <Label htmlFor="report-preferred-contact">Preferred Contact</Label>
                <Select name="preferred_contact">
                  <SelectTrigger><SelectValue placeholder="Select contact method" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="report-is-veteran" name="is_veteran" />
                <Label htmlFor="report-is-veteran">Are you a veteran?</Label>
              </div>

              {/* Property Information */}
              <h3 className="text-lg font-medium mt-6">Property Information</h3>
              <div className="flex items-center space-x-2">
                <Checkbox id="report-has-streeteasy-listing" name="has_streeteasy_listing" />
                <Label htmlFor="report-has-streeteasy-listing">Has StreetEasy Listing?</Label>
              </div>
              <div><Label htmlFor="report-streeteasy-link">StreetEasy Link</Label><Input id="report-streeteasy-link" name="streeteasy_link" /></div>
              <div><Label htmlFor="report-manual-address">Manual Address</Label><Input id="report-manual-address" name="manual_address" /></div>
              <div><Label htmlFor="report-borough">Borough</Label><Input id="report-borough" name="borough" /></div>
              <div><Label htmlFor="report-neighborhood">Neighborhood</Label><Input id="report-neighborhood" name="neighborhood" /></div>

              {/* Business Information */}
              <h3 className="text-lg font-medium mt-6">Business Information</h3>
              <div><Label htmlFor="report-landlord-name">Landlord Name</Label><Input id="report-landlord-name" name="landlord_name" /></div>
              <div>\
