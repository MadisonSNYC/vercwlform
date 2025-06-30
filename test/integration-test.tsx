"use client"
import { render, screen, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import IntegrationTestPage from "../app/integration-test/page" // Adjust path as necessary
import { createClient } from "@/lib/supabase/client" // Mock this import
import { jest, describe, beforeEach, it, expect, afterEach } from "@jest/globals" // Import necessary Jest globals

// Mock the Supabase client to control its behavior during tests
jest.mock("@/lib/supabase/client", () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        limit: jest.fn(() => ({
          data: [{ id: 1, email: "test@example.com", first_name: "Test", last_name: "User" }],
          error: null,
        })),
      })),
      insert: jest.fn(() => ({
        select: jest.fn(() => ({
          data: [{ id: 2, email: "new@example.com", first_name: "New", last_name: "User" }],
          error: null,
        })),
      })),
    })),
  })),
}))

describe("IntegrationTestPage", () => {
  // Set up mock environment variables before each test
  beforeEach(() => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://localhost:54321"
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "mock-anon-key"
  })

  // Clean up mock environment variables after each test
  afterEach(() => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    jest.clearAllMocks()
  })

  it('displays "Running tests..." initially', () => {
    render(<IntegrationTestPage />)
    expect(screen.getByText("Running tests...")).toBeInTheDocument()
  })

  it("displays success message if all tests pass", async () => {
    render(<IntegrationTestPage />)

    await waitFor(
      () => {
        expect(screen.getByText("All integration tests passed successfully!")).toBeInTheDocument()
      },
      { timeout: 3000 },
    ) // Increased timeout for async operations
  })

  it("displays error message if database connection fails", async () => {
    // Mock createClient to return an error for database connection
    ;(createClient as jest.Mock).mockImplementationOnce(() => ({
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          limit: jest.fn(() => ({
            data: null,
            error: { message: "Network error" },
          })),
        })),
      })),
    }))

    render(<IntegrationTestPage />)

    await waitFor(
      () => {
        expect(
          screen.getByText(/Integration test failed: Database connection failed: Network error/i),
        ).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  it("displays error message if Supabase environment variables are not set", async () => {
    delete process.env.NEXT_PUBLIC_SUPABASE_URL // Unset one variable

    render(<IntegrationTestPage />)

    await waitFor(
      () => {
        expect(
          screen.getByText(/Integration test failed: Supabase environment variables are not set./i),
        ).toBeInTheDocument()
      },
      { timeout: 3000 },
    )
  })

  // You can add more specific tests here for insert, update, delete operations
  // by mocking the respective Supabase client methods.
})

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Clock, Play, AlertTriangle, Database, RefreshCw } from "lucide-react"
import { submitFareReport } from "@/lib/actions"
import { LeadAnalytics } from "@/components/lead-analytics" // Adjust path as necessary
import { LeadProgressIndicator } from "@/components/lead-progress-indicator" // Adjust path as necessary
import { setupServer } from "msw/node"
import { rest } from "msw"
import { beforeAll, afterAll } from "@jest/globals"

interface TestResult {
  name: string
  status: "pending" | "running" | "success" | "error"
  message?: string
  duration?: number
  data?: any
  error?: any
}

const mockLeadData = {
  totalLeads: 1234,
  leadsByFormType: [
    { name: "Waitlist", value: 500 },
    { name: "Schedule", value: 400 },
    { name: "Report", value: 334 },
  ],
  leadsOverTime: [
    { date: "Jan", count: 100 },
    { date: "Feb", count: 120 },
    { date: "Mar", count: 150 },
    { date: "Apr", count: 130 },
    { date: "May", count: 180 },
  ],
}

const server = setupServer(
  rest.get("/api/leads-data", (req, res, ctx) => {
    return res(ctx.json(mockLeadData))
  }),
)

beforeAll(() => server.listen())
afterAll(() => server.close())

export default function IntegrationTest() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Waitlist Submission", status: "pending" },
    { name: "Schedule Submission", status: "pending" },
    { name: "Full Report Submission", status: "pending" },
  ])

  const [isRunningAll, setIsRunningAll] = useState(false)

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) => prev.map((test, i) => (i === index ? { ...test, ...updates } : test)))
  }

  const resetTests = () => {
    setTests([
      { name: "Waitlist Submission", status: "pending" },
      { name: "Schedule Submission", status: "pending" },
      { name: "Full Report Submission", status: "pending" },
    ])
  }

  const createTestFormData = (testType: string): FormData => {
    const formData = new FormData()

    if (testType === "waitlist") {
      formData.append("formType", "waitlist")
      formData.append("firstName", "Test")
      formData.append("lastName", "User")
      formData.append("email", "test.waitlist@example.com")
      formData.append("phone", "(555) 123-4567")
      formData.append("mailingListConsent", "on")
    } else if (testType === "schedule") {
      formData.append("formType", "schedule")
      formData.append("firstName", "Schedule")
      formData.append("lastName", "Tester")
      formData.append("email", "test.schedule@example.com")
      formData.append("phone", "(555) 987-6543")
      formData.append("contactTime", "Morning (9am-12pm)")
      formData.append("issueSnapshot", "Testing the scheduling system with a sample issue description.")
      formData.append("mailingListConsent", "on")
    } else if (testType === "report") {
      formData.append("formType", "report")

      // Personal Information
      formData.append("firstName", "Report")
      formData.append("lastName", "Tester")
      formData.append("email", "test.report@example.com")
      formData.append("phone", "(555) 456-7890")
      formData.append("preferredContact", "email")

      // Property Information
      formData.append("hasStreetEasyListing", "off")
      formData.append("manualAddress", "123 Test Street, Brooklyn, NY 11201")
      formData.append("borough", "Brooklyn")
      formData.append("neighborhood", "DUMBO")

      // Violations
      formData.append("violation_Illegal Broker/Agent Fee", "on")
      formData.append("violation_No-Fee Ad That Added a Fee", "on")

      // DCWP Fee Details
      formData.append("illegalBrokerFeeCharged", "on")

      // Fee Charges
      formData.append("feeCharge", "Broker Fee")
      formData.append("feeCharge", "Application Fee > $20")

      // Report Details
      formData.append(
        "narrative",
        "This is a test submission to verify the form integration works correctly. The agent charged an illegal broker fee despite advertising as no-fee.",
      )

      // Desired Outcomes
      formData.append("desiredOutcome", "DCWP Investigation")
      formData.append("desiredOutcome", "Full refund")

      // Referral
      formData.append("referralSource", "Testing")

      // Consents
      formData.append("dcwpConsent", "on")
      formData.append("proxyConsent", "on")
      formData.append("mailingListConsent", "on")
    }

    return formData
  }

  const runTest = async (index: number, testType: string) => {
    const startTime = Date.now()
    updateTest(index, { status: "running" })

    try {
      const formData = createTestFormData(testType)
      const result = await submitFareReport(null, formData)
      const duration = Date.now() - startTime

      if (result.success) {
        updateTest(index, {
          status: "success",
          message: result.success,
          duration,
          data: Object.fromEntries(formData.entries()),
        })
      } else {
        updateTest(index, {
          status: "error",
          message: result.error || "Unknown error",
          duration,
          error: result,
        })
      }
    } catch (error) {
      const duration = Date.now() - startTime
      updateTest(index, {
        status: "error",
        message: error instanceof Error ? error.message : "Unexpected error",
        duration,
        error: error,
      })
    }
  }

  const runAllTests = async () => {
    setIsRunningAll(true)
    resetTests()

    const testTypes = ["waitlist", "schedule", "report"]

    for (let i = 0; i < testTypes.length; i++) {
      await runTest(i, testTypes[i])
      // Add a small delay between tests
      if (i < testTypes.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    setIsRunningAll(false)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4 text-gray-400" />
      case "running":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: TestResult["status"]) => {
    const colors = {
      pending: "bg-gray-100 text-gray-800",
      running: "bg-blue-100 text-blue-800",
      success: "bg-green-100 text-green-800",
      error: "bg-red-100 text-red-800",
    }

    return <Badge className={colors[status]}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>
  }

  const allTestsComplete = tests.every((test) => test.status === "success" || test.status === "error")
  const successCount = tests.filter((test) => test.status === "success").length
  const errorCount = tests.filter((test) => test.status === "error").length
  const isAnyTestRunning = tests.some((test) => test.status === "running") || isRunningAll

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">NYC FARE Reporter Integration Test</h1>
          <p className="text-gray-600">Testing real database submissions to verify server integration</p>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Warning:</strong> This will submit real data to your Supabase database. Test emails are used to
            identify test submissions.
          </AlertDescription>
        </Alert>

        <div className="flex gap-4 justify-center items-center">
          <Button onClick={runAllTests} size="lg" disabled={isAnyTestRunning} className="flex items-center gap-2">
            {isRunningAll ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Running All Tests...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                Run All Tests
              </>
            )}
          </Button>

          <Button onClick={resetTests} variant="outline" size="lg" disabled={isAnyTestRunning}>
            Reset Tests
          </Button>

          {allTestsComplete && (
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">{successCount} passed</span>
              </div>
              {errorCount > 0 && (
                <div className="flex items-center gap-1">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-600 font-medium">{errorCount} failed</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-4">
          {tests.map((test, index) => (
            <Card key={test.name} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(test.status)}
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2">
                    {test.duration && <span className="text-sm text-gray-500">{test.duration}ms</span>}
                    {getStatusBadge(test.status)}
                  </div>
                </div>
                <CardDescription>
                  {test.name === "Waitlist Submission" && "Tests basic lead capture functionality"}
                  {test.name === "Schedule Submission" && "Tests scheduling with contact preferences"}
                  {test.name === "Full Report Submission" && "Tests complete violation report with all form fields"}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      runTest(
                        index,
                        test.name === "Waitlist Submission"
                          ? "waitlist"
                          : test.name === "Schedule Submission"
                            ? "schedule"
                            : "report",
                      )
                    }
                    disabled={test.status === "running" || isRunningAll}
                  >
                    {test.status === "running" ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="h-3 w-3 animate-spin" />
                        Running...
                      </div>
                    ) : (
                      "Run Test"
                    )}
                  </Button>
                </div>

                {test.message && (
                  <Alert
                    className={test.status === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}
                  >
                    <AlertDescription className={test.status === "success" ? "text-green-800" : "text-red-800"}>
                      {test.message}
                    </AlertDescription>
                  </Alert>
                )}

                {test.error && test.status === "error" && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-red-600 hover:text-red-800 font-medium">
                      View error details
                    </summary>
                    <pre className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-xs overflow-auto text-red-800">
                      {JSON.stringify(test.error, null, 2)}
                    </pre>
                  </details>
                )}

                {test.data && test.status === "success" && (
                  <details className="text-sm">
                    <summary className="cursor-pointer text-gray-600 hover:text-gray-800">View submitted data</summary>
                    <pre className="mt-2 p-3 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(test.data, null, 2)}
                    </pre>
                  </details>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {allTestsComplete && (
          <Card className="border-2 border-dashed">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {successCount === tests.length ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                Test Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{tests.length}</div>
                  <div className="text-sm text-gray-600">Total Tests</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{successCount}</div>
                  <div className="text-sm text-gray-600">Passed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{errorCount}</div>
                  <div className="text-sm text-gray-600">Failed</div>
                </div>
              </div>

              {successCount === tests.length && (
                <Alert className="mt-4 border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    🎉 All tests passed! Your form integration is working correctly.
                  </AlertDescription>
                </Alert>
              )}

              {errorCount > 0 && (
                <Alert className="mt-4 border-red-200 bg-red-50">
                  <XCircle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    ⚠️ Some tests failed. Check the error details above and ensure your database tables are properly set
                    up.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {/* Database Setup Instructions */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-900">
              <Database className="h-5 w-5" />
              Database Setup Required
            </CardTitle>
          </CardHeader>
          <CardContent className="text-purple-800">
            <p className="mb-4">
              If tests are failing, you may need to set up your database tables. Run this SQL script in your Supabase
              SQL editor:
            </p>
            <div className="bg-white p-4 rounded border border-purple-200 text-sm">
              <p className="font-mono text-purple-900">
                Copy the contents of <code>scripts/create-tables.sql</code> and run it in your Supabase dashboard.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Lead Analytics Component */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-900">
              <Database className="h-5 w-5" />
              Lead Analytics
            </CardTitle>
          </CardHeader>
          <CardContent className="text-green-800">
            <LeadAnalytics data={mockLeadData} />
          </CardContent>
        </Card>

        {/* Lead Progress Indicator Component */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Database className="h-5 w-5" />
              Lead Progress Indicator
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <LeadProgressIndicator currentStep={1} totalSteps={5} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
