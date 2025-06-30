"use client"

import { useState } from "react"
import { AlertCircle, Check, FileText } from "lucide-react"

// Test data for different scenarios
const testScenarios = {
  brokerFeeViolation: {
    name: "Illegal Broker Fee",
    formData: {
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@test.com",
      phone: "(555) 123-4567",
      selectedFormType: "report",
      propertyInfoType: "streeteasy",
      streetEasyLink: "https://streeteasy.com/rental/123456",
      whoReporting: "agent",
      agentFirstName: "Jane",
      agentLastName: "Smith",
      brokerageForAgent: "ABC Realty",
      violations: ["Illegal Broker/Agent Fee", "No-Fee Ad That Added a Fee"],
      feeCharges: ["Broker Fee", "Application Fee &gt; $20"],
      illegalBrokerFeeCharged: true,
      narrative: "I was charged a $3000 broker fee despite the listing being advertised as no-fee.",
      desiredOutcome: ["DCWP Investigation", "Full refund"],
    },
  },
  multipleViolations: {
    name: "Multiple Violations with Other",
    formData: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@test.com",
      phone: "(555) 987-6543",
      selectedFormType: "report",
      propertyInfoType: "manual",
      manualAddress: "123 Test St, Brooklyn, NY",
      whoReporting: "brokerage",
      brokerageName: "XYZ Properties",
      violations: ["Bait-and-Switch Listing", "High-Pressure Sales Tactics", "Other"],
      violationOtherTexts: {
        "listing-Other": "Fake photos showing different apartment",
        "agent-landlord-behavior-Other": "Threatened to show apartment to others if I didn't sign immediately",
      },
      feeCharges: ["Security Deposit &gt; 1 month rent", "Good Faith Deposit", "Other"],
      feeChargesOther: "Pet deposit of $500",
      narrative: "Multiple violations including fake listing photos and pressure tactics.",
      desiredOutcome: ["DCWP Investigation", "Other"],
      desiredOutcomeOther: "Public warning about this brokerage",
    },
  },
  managementCompany: {
    name: "Management Company Violation",
    formData: {
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.w@test.com",
      selectedFormType: "report",
      propertyInfoType: "manual",
      manualAddress: "456 Management Ave, Manhattan, NY",
      whoReporting: "management",
      managementCompanyName: "Big Management Co",
      violations: ["Excessive App/Processing Fee (&gt; $20)", "Illicit Security Deposit (&gt; 1× rent)"],
      feeCharges: ["Processing Fee", "Security Deposit &gt; 1 month rent"],
      contactedBusiness: true,
      employeeName: "Property Manager John",
      whatHappened: "Contacted about excessive fees",
      narrative: "Management company charged $150 application fee and 2 months security deposit.",
      desiredOutcome: ["Enforce fee cap", "Full refund"],
    },
  },
}

export default function FormTest() {
  const [currentTest, setCurrentTest] = useState<string>("")
  const [testResults, setTestResults] = useState<Record<string, any>>({})
  const [isRunning, setIsRunning] = useState(false)

  // Simulate form validation logic
  const validateFormData = (data: any) => {
    const errors: string[] = []

    // Required field validation
    if (!data.firstName) errors.push("First name is required")
    if (!data.lastName) errors.push("Last name is required")
    if (!data.email) errors.push("Email is required")
    if (!data.selectedFormType) errors.push("Form type is required")
    if (!data.propertyInfoType) errors.push("Property info type is required")
    if (!data.whoReporting) errors.push("Who reporting is required")
    if (!data.violations || data.violations.length === 0) errors.push("At least one violation is required")
    if (!data.narrative) errors.push("Narrative is required")
    if (!data.desiredOutcome || data.desiredOutcome.length === 0) errors.push("Desired outcome is required")

    // Conditional validation
    if (data.propertyInfoType === "streeteasy" && !data.streetEasyLink) {
      errors.push("StreetEasy link is required")
    }
    if (data.propertyInfoType === "manual" && !data.manualAddress) {
      errors.push("Manual address is required")
    }

    if (data.whoReporting === "agent") {
      if (!data.agentFirstName) errors.push("Agent first name is required")
      if (!data.agentLastName) errors.push("Agent last name is required")
      if (!data.brokerageForAgent) errors.push("Brokerage for agent is required")
    }
    if (data.whoReporting === "brokerage" && !data.brokerageName) {
      errors.push("Brokerage name is required")
    }
    if (data.whoReporting === "management" && !data.managementCompanyName) {
      errors.push("Management company name is required")
    }

    return errors
  }

  // Test violation handling
  const testViolationHandling = (data: any) => {
    const results = {
      violationsSelected: data.violations || [],
      hasOtherViolations: data.violations?.includes("Other") || false,
      otherTexts: data.violationOtherTexts || {},
      feeChargesSelected: data.feeCharges || [],
      hasOtherFeeCharges: data.feeCharges?.includes("Other") || false,
      feeChargesOther: data.feeChargesOther || "",
    }

    return results
  }

  // Test DCWP fee details
  const testDCWPFeeDetails = (data: any) => {
    return {
      illegalBrokerFeeCharged: data.illegalBrokerFeeCharged,
      requirementToUseBroker: data.requirementToUseBroker,
      feesNotDisclosed: data.feesNotDisclosed,
      improperFeesInAd: data.improperFeesInAd,
    }
  }

  const runTest = async (scenarioKey: string) => {
    setIsRunning(true)
    setCurrentTest(scenarioKey)

    const scenario = testScenarios[scenarioKey as keyof typeof testScenarios]

    // Simulate form processing delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const validationErrors = validateFormData(scenario.formData)
    const violationResults = testViolationHandling(scenario.formData)
    const dcwpResults = testDCWPFeeDetails(scenario.formData)

    const testResult = {
      scenario: scenario.name,
      passed: validationErrors.length === 0,
      validationErrors,
      violationResults,
      dcwpResults,
      timestamp: new Date().toISOString(),
    }

    setTestResults((prev) => ({
      ...prev,
      [scenarioKey]: testResult,
    }))

    setIsRunning(false)
    setCurrentTest("")
  }

  const runAllTests = async () => {
    for (const scenarioKey of Object.keys(testScenarios)) {
      await runTest(scenarioKey)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">NYC FARE Reporter Form Test Suite</h1>
          <p className="text-lg text-gray-600">Testing violation types, fee charges, and form validation</p>
        </div>

        {/* Test Controls */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">Test Controls</h2>
          <div className="flex flex-wrap gap-4 mb-4">
            {Object.entries(testScenarios).map(([key, scenario]) => (
              <button
                key={key}
                onClick={() => runTest(key)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentTest === key ? "bg-blue-600 text-white" : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isRunning && currentTest === key ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Testing...
                  </div>
                ) : (
                  scenario.name
                )}
              </button>
            ))}
          </div>
          <button
            onClick={runAllTests}
            disabled={isRunning}
            className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Run All Tests
          </button>
        </div>

        {/* Test Results */}
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900">Test Results</h2>

          {Object.keys(testResults).length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No tests run yet. Click a test button above to start.</p>
            </div>
          ) : (
            Object.entries(testResults).map(([key, result]) => (
              <div
                key={key}
                className={`p-6 rounded-lg border-2 ${
                  result.passed ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center mb-4">
                  {result.passed ? (
                    <Check className="w-6 h-6 text-green-600 mr-3" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
                  )}
                  <h3 className={`text-xl font-semibold ${result.passed ? "text-green-900" : "text-red-900"}`}>
                    {result.scenario}
                  </h3>
                  <span
                    className={`ml-auto px-3 py-1 rounded-full text-sm font-medium ${
                      result.passed ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {result.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>

                {/* Validation Errors */}
                {result.validationErrors.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-red-800 mb-2">Validation Errors:</h4>
                    <ul className="list-disc list-inside text-red-700 space-y-1">
                      {result.validationErrors.map((error: string, index: number) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Violation Results */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-medium text-gray-800 mb-3">Violations Selected</h4>
                    <div className="space-y-2">
                      {result.violationResults.violationsSelected.map((violation: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-green-500 mr-2" />
                          <span className="text-sm">{violation}</span>
                        </div>
                      ))}
                      {result.violationResults.hasOtherViolations && (
                        <div className="mt-3 p-2 bg-yellow-50 rounded">
                          <p className="text-sm font-medium text-yellow-800">Other Violation Details:</p>
                          {Object.entries(result.violationResults.otherTexts).map(([key, value]) => (
                            <p key={key} className="text-xs text-yellow-700 mt-1">
                              {key}: {value as string}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded border">
                    <h4 className="font-medium text-gray-800 mb-3">Fee Charges</h4>
                    <div className="space-y-2">
                      {result.violationResults.feeChargesSelected.map((charge: string, index: number) => (
                        <div key={index} className="flex items-center">
                          <Check className="w-4 h-4 text-blue-500 mr-2" />
                          <span className="text-sm">{charge}</span>
                        </div>
                      ))}
                      {result.violationResults.hasOtherFeeCharges && (
                        <div className="mt-3 p-2 bg-blue-50 rounded">
                          <p className="text-sm font-medium text-blue-800">Other Fee Details:</p>
                          <p className="text-xs text-blue-700 mt-1">{result.violationResults.feeChargesOther}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DCWP Fee Details */}
                <div className="mt-4 bg-white p-4 rounded border">
                  <h4 className="font-medium text-gray-800 mb-3">DCWP Fee Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Illegal Broker Fee:</span>
                      <span
                        className={`ml-2 ${
                          result.dcwpResults.illegalBrokerFeeCharged === true
                            ? "text-red-600"
                            : result.dcwpResults.illegalBrokerFeeCharged === false
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {result.dcwpResults.illegalBrokerFeeCharged === null
                          ? "Not specified"
                          : result.dcwpResults.illegalBrokerFeeCharged
                            ? "Yes"
                            : "No"}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">Required Broker:</span>
                      <span
                        className={`ml-2 ${
                          result.dcwpResults.requirementToUseBroker === true
                            ? "text-red-600"
                            : result.dcwpResults.requirementToUseBroker === false
                              ? "text-green-600"
                              : "text-gray-500"
                        }`}
                      >
                        {result.dcwpResults.requirementToUseBroker === null
                          ? "Not specified"
                          : result.dcwpResults.requirementToUseBroker
                            ? "Yes"
                            : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-xs text-gray-500">
                  Test completed: {new Date(result.timestamp).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Test Summary */}
        {Object.keys(testResults).length > 0 && (
          <div className="mt-8 p-6 bg-gray-100 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Summary</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded">
                <div className="text-2xl font-bold text-blue-600">{Object.keys(testResults).length}</div>
                <div className="text-sm text-gray-600">Total Tests</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="text-2xl font-bold text-green-600">
                  {Object.values(testResults).filter((r) => r.passed).length}
                </div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
              <div className="bg-white p-4 rounded">
                <div className="text-2xl font-bold text-red-600">
                  {Object.values(testResults).filter((r) => !r.passed).length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </div>
        )}

        {/* Feature Coverage */}
        <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">Feature Coverage</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-purple-800 mb-2">Violation Types Tested</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Listing violations (Bait-and-Switch, No-Fee Ad)</li>
                <li>• Fee violations (Illegal Broker Fee, Excessive App Fee)</li>
                <li>• Behavior violations (High-Pressure Tactics)</li>
                <li>• "Other" violation handling with custom text</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-purple-800 mb-2">Fee Charges Tested</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Broker Fee</li>
                <li>• Application Fee &gt; $20</li>
                <li>• Security Deposit &gt; 1 month rent</li>
                <li>• Good Faith Deposit</li>
                <li>• "Other" fee charges with custom text</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
