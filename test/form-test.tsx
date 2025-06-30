"use client"
import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import FormTest from "./form-test" // Adjust path as necessary
import { describe, it, expect } from "@jest/globals" // Import describe, it, and expect

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
        "listing-look": "Fake photos showing different apartment",
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

  return testResult
}

const runAllTests = async () => {
  const results: Record<string, any> = {}
  for (const scenarioKey of Object.keys(testScenarios)) {
    const result = await runTest(scenarioKey)
    results[scenarioKey] = result
  }
  return results
}

describe("FormTest", () => {
  it("renders all form elements correctly", () => {
    render(<FormTest />)

    // Check for text inputs
    expect(screen.getByLabelText(/First name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument()

    // Check for textarea
    expect(screen.getByLabelText(/Narrative/i)).toBeInTheDocument()

    // Check for checkbox
    expect(screen.getByLabelText(/Illegal Broker Fee/i)).toBeInTheDocument()
    expect(screen.getByRole("checkbox", { name: /Illegal Broker Fee/i })).toBeInTheDocument()

    // Check for radio group
    expect(screen.getByLabelText(/Who reporting/i)).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /Agent/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /Brokerage/i })).toBeInTheDocument()
    expect(screen.getByRole("radio", { name: /Management/i })).toBeInTheDocument()

    // Check for select
    expect(screen.getByRole("combobox", { name: /Property info type/i })).toBeInTheDocument()

    // Check for buttons
    expect(screen.getByRole("button", { name: /Run Test/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Run All Tests/i })).toBeInTheDocument()
  })

  it("allows typing into text inputs", () => {
    render(<FormTest />)
    const firstNameInput = screen.getByLabelText(/First name/i) as HTMLInputElement
    fireEvent.change(firstNameInput, { target: { value: "John" } })
    expect(firstNameInput.value).toBe("John")

    const lastNameInput = screen.getByLabelText(/Last name/i) as HTMLInputElement
    fireEvent.change(lastNameInput, { target: { value: "Doe" } })
    expect(lastNameInput.value).toBe("Doe")

    const emailInput = screen.getByLabelText(/Email/i) as HTMLInputElement
    fireEvent.change(emailInput, { target: { value: "john.doe@example.com" } })
    expect(emailInput.value).toBe("john.doe@example.com")

    const phoneInput = screen.getByLabelText(/Phone/i) as HTMLInputElement
    fireEvent.change(phoneInput, { target: { value: "(555) 123-4567" } })
    expect(phoneInput.value).toBe("(555) 123-4567")
  })

  it("allows typing into textarea", () => {
    render(<FormTest />)
    const narrativeTextarea = screen.getByLabelText(/Narrative/i) as HTMLTextAreaElement
    fireEvent.change(narrativeTextarea, { target: { value: "This is a test message." } })
    expect(narrativeTextarea.value).toBe("This is a test message.")
  })

  it("allows checking and unchecking a checkbox", () => {
    render(<FormTest />)
    const illegalBrokerFeeCheckbox = screen.getByRole("checkbox", { name: /Illegal Broker Fee/i }) as HTMLInputElement
    expect(illegalBrokerFeeCheckbox.checked).toBe(false)
    fireEvent.click(illegalBrokerFeeCheckbox)
    expect(illegalBrokerFeeCheckbox.checked).toBe(true)
    fireEvent.click(illegalBrokerFeeCheckbox)
    expect(illegalBrokerFeeCheckbox.checked).toBe(false)
  })

  it("allows selecting a radio option", () => {
    render(<FormTest />)
    const agentRadio = screen.getByRole("radio", { name: /Agent/i }) as HTMLInputElement
    const brokerageRadio = screen.getByRole("radio", { name: /Brokerage/i }) as HTMLInputElement
    const managementRadio = screen.getByRole("radio", { name: /Management/i }) as HTMLInputElement

    expect(agentRadio.checked).toBe(true) // Default value
    expect(brokerageRadio.checked).toBe(false)
    expect(managementRadio.checked).toBe(false)

    fireEvent.click(brokerageRadio)
    expect(agentRadio.checked).toBe(false)
    expect(brokerageRadio.checked).toBe(true)
    expect(managementRadio.checked).toBe(false)

    fireEvent.click(managementRadio)
    expect(agentRadio.checked).toBe(false)
    expect(brokerageRadio.checked).toBe(false)
    expect(managementRadio.checked).toBe(true)
  })

  it("allows selecting an option from a select dropdown", async () => {
    render(<FormTest />)
    const propertyInfoTypeSelect = screen.getByRole("combobox", { name: /Property info type/i })

    fireEvent.click(propertyInfoTypeSelect) // Open the dropdown

    // Wait for the options to appear
    await waitFor(() => {
      expect(screen.getByText("StreetEasy")).toBeInTheDocument()
      expect(screen.getByText("Manual")).toBeInTheDocument()
    })

    const manualOption = screen.getByText("Manual")
    fireEvent.click(manualOption) // Select 'Manual'

    // Check if the selected value is displayed
    expect(screen.getByText("Manual")).toBeInTheDocument()
  })

  it("buttons are clickable", () => {
    render(<FormTest />)
    const runTestButton = screen.getByRole("button", { name: /Run Test/i })
    const runAllTestsButton = screen.getByRole("button", { name: /Run All Tests/i })

    // Simple click test, can be extended with mock functions for actual behavior
    fireEvent.click(runTestButton)
    fireEvent.click(runAllTestsButton)
    // If there were onClick handlers, you'd assert on their calls here.
  })
})
