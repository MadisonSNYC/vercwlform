"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { testDatabaseConnection } from "@/lib/actions"
import { useActionState } from "react"

export default function IntegrationTestPage() {
  const [testResults, setTestResults] = useState<string[]>([])
  const [isTesting, setIsTesting] = useState(false)
  const [dbTestState, dbTestAction, isDbTestPending] = useActionState(testDatabaseConnection, null)

  const runAllTests = async () => {
    setIsTesting(true)
    setTestResults([]) // Clear previous results

    const results: string[] = []

    // Test 1: Database Connection
    results.push("Running Database Connection Test...")
    setTestResults([...results])
    const dbResult = await testDatabaseConnection()
    results.push(`Database Connection Test: ${dbResult.message}`)
    setTestResults([...results])

    // Simulate other tests
    results.push("Running API Endpoint Test (simulated)...")
    setTestResults([...results])
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate API call
    results.push("API Endpoint Test: Success!")
    setTestResults([...results])

    results.push("Running UI Component Render Test (simulated)...")
    setTestResults([...results])
    await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate UI render
    results.push("UI Component Render Test: Success!")
    setTestResults([...results])

    setIsTesting(false)
  }

  useEffect(() => {
    if (dbTestState) {
      setTestResults((prev) => [...prev, `Database Connection Button Test: ${dbTestState.message}`])
    }
  }, [dbTestState])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test Suite</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Database Setup Instructions Card */}
        <Card className="col-span-full">
          <CardHeader>
            <CardTitle>Database Setup Instructions</CardTitle>
            <CardDescription>
              Follow these steps to ensure your Supabase database is correctly set up for this project.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-2">1. Environment Variables</h3>
              <p className="text-sm text-gray-600">
                Ensure your <code>.env.local</code> file (or Vercel environment variables) contains:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                <li>
                  <code>NEXT_PUBLIC_SUPABASE_URL</code>
                </li>
                <li>
                  <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>
                </li>
                <li>
                  <code>SUPABASE_SERVICE_ROLE_KEY</code> (for server-side actions)
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                These can be found in your Supabase project settings under "API".
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">2. Run SQL Scripts</h3>
              <p className="text-sm text-gray-600">
                Execute the following SQL scripts in your Supabase SQL Editor to create and update necessary tables:
              </p>
              <ul className="list-disc list-inside text-sm text-gray-700 ml-4">
                <li>
                  <code>scripts/create-tables.sql</code> (if starting fresh)
                </li>
                <li>
                  <code>scripts/update-schema.sql</code> (for general updates)
                </li>
                <li>
                  <code>scripts/add-report-fields.sql</code> (for specific report fields)
                </li>
                <li>
                  <code>scripts/update-reports-schema-v2.sql</code> (for latest schema)
                </li>
                <li>
                  <code>scripts/fix-reports-schema-complete.sql</code> (for any previous fixes)
                </li>
              </ul>
              <p className="text-sm text-gray-600 mt-2">
                You can find these files in the <code>scripts/</code> directory of your project.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-2">3. Enable Storage Bucket</h3>
              <p className="text-sm text-gray-600">
                If using file uploads, ensure you have a Supabase Storage bucket named <code>report_documents</code>.
                You can create and configure it in the Supabase Dashboard under "Storage".
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
            <CardDescription>Run various tests to verify application functionality.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runAllTests} disabled={isTesting} className="w-full">
              {isTesting ? "Running Tests..." : "Run All Tests"}
            </Button>
            <Button onClick={() => dbTestAction(new FormData())} disabled={isDbTestPending} className="w-full">
              {isDbTestPending ? "Testing DB Connection..." : "Test Database Connection"}
            </Button>
          </CardContent>
        </Card>

        {/* Test Results Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Output from the executed tests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-100 p-4 rounded-md h-64 overflow-auto text-sm font-mono">
              {testResults.length === 0 ? (
                <p className="text-gray-500">No tests run yet.</p>
              ) : (
                testResults.map((result, index) => (
                  <p key={index} className={result.includes("failed") ? "text-red-600" : "text-green-700"}>
                    {result}
                  </p>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
