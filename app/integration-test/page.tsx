"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { testDatabaseConnection } from "@/lib/actions"
import { AlertCircle, CheckCircle } from "lucide-react"

export default function IntegrationTestPage() {
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [isTesting, setIsTesting] = useState(false)

  const handleTestConnection = async () => {
    setIsTesting(true)
    const result = await testDatabaseConnection()
    setTestResult(result)
    setIsTesting(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test Page</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Database Setup Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Database Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to ensure your Supabase database is correctly set up for this application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
              <li>
                <strong>Create Tables:</strong> Open your Supabase project, navigate to the SQL Editor, and run the
                script located at `scripts/create-tables.sql`. This will set up the initial `reports`,
                `waitlist_entries`, and `scheduled_reports` tables.
              </li>
              <li>
                <strong>Update Schema:</strong> After creating tables, run the script at `scripts/update-schema.sql` to
                apply any necessary schema updates or migrations.
              </li>
              <li>
                <strong>Verify Environment Variables:</strong> Ensure your `.env.local` file (or Vercel environment
                variables) contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` with your Supabase
                project credentials.
              </li>
              <li>
                <strong>Test Connection:</strong> Use the "Test Database Connection" button on this page to verify that
                your application can connect to Supabase.
              </li>
            </ol>
            <p className="text-xs text-gray-500 mt-4">
              Note: If you encounter issues, double-check your Supabase project settings, API keys, and ensure your
              database is publicly accessible or your network settings are configured correctly.
            </p>
          </CardContent>
        </Card>

        {/* Database Connection Test Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Supabase Connection</CardTitle>
            <CardDescription>Click the button below to test the connection to your Supabase database.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? "Testing..." : "Test Database Connection"}
            </Button>
            {testResult && (
              <div
                className={`flex items-center gap-2 p-3 rounded-md ${
                  testResult.success ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                }`}
              >
                {testResult.success ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                <p className="text-sm">{testResult.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
