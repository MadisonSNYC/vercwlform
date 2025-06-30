"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { testDatabaseConnection } from "@/lib/actions" // Import the server action

export default function IntegrationTestPage() {
  const [testStatus, setTestStatus] = useState<string>("idle")
  const [progress, setProgress] = useState<number>(0)
  const [results, setResults] = useState<string[]>([])
  const [dbConnectionStatus, setDbConnectionStatus] = useState<string>("Not tested")

  const runAllTests = async () => {
    setTestStatus("running")
    setResults([])
    setProgress(0)

    const newResults: string[] = []
    let currentProgress = 0
    const totalTests = 3 // Example: Database, API Health, Form Submission

    // Test 1: Database Connection
    newResults.push("Running Database Connection Test...")
    setResults([...newResults])
    const dbResult = await testDatabaseConnection()
    if (dbResult.connected) {
      newResults.push("Database Connection: SUCCESS")
      setDbConnectionStatus("Connected")
    } else {
      newResults.push(`Database Connection: FAILED - ${dbResult.error?.message || "Unknown error"}`)
      setDbConnectionStatus("Failed")
    }
    currentProgress += (1 / totalTests) * 100
    setProgress(currentProgress)
    setResults([...newResults])

    // Test 2: API Health Check
    newResults.push("Running API Health Check...")
    setResults([...newResults])
    try {
      const response = await fetch("/api/health")
      const data = await response.json()
      if (response.ok && data.status === "healthy") {
        newResults.push(`API Health Check: SUCCESS - ${JSON.stringify(data)}`)
      } else {
        newResults.push(`API Health Check: FAILED - ${JSON.stringify(data)}`)
      }
    } catch (error: any) {
      newResults.push(`API Health Check: ERROR - ${error.message}`)
    }
    currentProgress += (1 / totalTests) * 100
    setProgress(currentProgress)
    setResults([...newResults])

    // Test 3: Simulate Form Submission (Placeholder)
    newResults.push("Simulating Form Submission (Placeholder)...")
    setResults([...newResults])
    await new Promise((resolve) => setTimeout(resolve, 1000)) // Simulate network delay
    newResults.push("Form Submission Simulation: SUCCESS (Requires actual form data for real test)")
    currentProgress += (1 / totalTests) * 100
    setProgress(currentProgress)
    setResults([...newResults])

    setTestStatus("completed")
  }

  const runDatabaseTest = async () => {
    setDbConnectionStatus("Testing...")
    const dbResult = await testDatabaseConnection()
    if (dbResult.connected) {
      setDbConnectionStatus("Connected successfully!")
    } else {
      setDbConnectionStatus(`Failed to connect: ${dbResult.error?.message || "Unknown error"}`)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test Suite</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Test Controls Card */}
        <Card>
          <CardHeader>
            <CardTitle>Test Controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runAllTests} disabled={testStatus === "running"} className="w-full">
              {testStatus === "running" ? "Running Tests..." : "Run All Tests"}
            </Button>
            <Progress value={progress} className="w-full" />
            <div className="text-sm text-gray-500">Status: {testStatus}</div>
          </CardContent>
        </Card>

        {/* Database Setup Instructions Card */}
        <Card>
          <CardHeader>
            <CardTitle>Database Setup Instructions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <p>To ensure your application connects correctly to Supabase, follow these steps:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>
                <strong>Environment Variables:</strong> Ensure `NEXT_PUBLIC_SUPABASE_URL` and
                `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in your `.env.local` file or Vercel environment variables.
              </li>
              <li>
                <strong>Run Schema Scripts:</strong> Execute the SQL scripts located in the `scripts/` directory (e.g.,
                `create-tables.sql`, `update-schema.sql`) in your Supabase SQL Editor to set up or update your database
                schema.
              </li>
              <li>
                <strong>Enable RLS:</strong> Verify Row Level Security (RLS) is enabled for `leads` and `reports` tables
                in Supabase, and appropriate policies are set.
              </li>
              <li>
                <strong>Test Connection:</strong> Use the button below to test the database connection from the
                application.
              </li>
            </ol>
            <Separator />
            <Button onClick={runDatabaseTest} disabled={dbConnectionStatus === "Testing..."}>
              Test Database Connection
            </Button>
            <div className="text-sm text-gray-500">Database Connection Status: {dbConnectionStatus}</div>
          </CardContent>
        </Card>
      </div>

      {/* Test Results Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-md h-64 overflow-auto text-sm font-mono">
            {results.length === 0 ? (
              <p className="text-gray-500">No tests run yet.</p>
            ) : (
              results.map((result, index) => (
                <p
                  key={index}
                  className={result.includes("FAILED") || result.includes("ERROR") ? "text-red-600" : "text-green-700"}
                >
                  {result}
                </p>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
