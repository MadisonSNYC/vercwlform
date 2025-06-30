import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import TestFormsPage from "@/app/test-forms/page"
import { submitLead, submitReport } from "@/lib/actions"
import { useToast } from "@/components/ui/use-toast"
import { jest, describe, beforeEach, it, expect } from "@jest/globals"

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock server actions
jest.mock("@/lib/actions", () => ({
  submitLead: jest.fn(),
  submitReport: jest.fn(),
}))

// Mock useToast hook
jest.mock("@/components/ui/use-toast", () => ({
  useToast: jest.fn(),
}))

describe("TestFormsPage", () => {
  const mockToast = jest.fn()
  const mockPush = jest.fn()

  beforeEach(() => {
    ;(useToast as jest.Mock).mockReturnValue({ toast: mockToast })
    require("next/navigation").useRouter.mockReturnValue({ push: mockPush })
    ;(submitLead as jest.Mock).mockClear()
    ;(submitReport as jest.Mock).mockClear()
    mockToast.mockClear()
    mockPush.mockClear()
  })

  it("renders the waitlist form by default", () => {
    render(<TestFormsPage />)
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Issue Snapshot/i)).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument()
  })

  it("switches to schedule form when selected", () => {
    render(<TestFormsPage />)
    fireEvent.click(screen.getByLabelText(/Schedule Form/i))
    expect(screen.getByLabelText(/Preferred Contact Time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Issue Snapshot/i)).toBeInTheDocument()
  })

  it("switches to report form when selected", () => {
    render(<TestFormsPage />)
    fireEvent.click(screen.getByLabelText(/Report Form/i))
    expect(screen.getByLabelText(/Preferred Contact Method/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Narrative of what happened/i)).toBeInTheDocument()
    expect(screen.getByText(/Property Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Business Information/i)).toBeInTheDocument()
    expect(screen.getByText(/Violations/i)).toBeInTheDocument()
    expect(screen.getByText(/DCWP Fee Details/i)).toBeInTheDocument()
    expect(screen.getByText(/Fee Charges/i)).toBeInTheDocument()
    expect(screen.getByText(/Report Details/i)).toBeInTheDocument()
    expect(screen.getByText(/AI Enhancement/i)).toBeInTheDocument()
    expect(screen.getByText(/Referral/i)).toBeInTheDocument()
    expect(screen.getByText(/Consents/i)).toBeInTheDocument()
  })

  it("submits waitlist form successfully", async () => {
    ;(submitLead as jest.Mock).mockResolvedValue({ success: true, message: "Lead submitted successfully!" })

    render(<TestFormsPage />)

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "vercel_test@example.com" } })
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "John" } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Doe" } })
    fireEvent.click(screen.getByLabelText(/Consent to join mailing list/i))

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(submitLead).toHaveBeenCalledWith({
        email: "vercel_test@example.com",
        firstName: "John",
        lastName: "Doe",
        phone: "",
        formType: "waitlist",
        contactTime: "",
        issueSnapshot: "",
        mailingListConsent: true,
      })
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success!",
        description: "Lead submitted successfully!",
      })
      expect(mockPush).toHaveBeenCalledWith("/thank-you")
    })
  })

  it("shows validation error for waitlist form", async () => {
    render(<TestFormsPage />)

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Validation Error",
          variant: "destructive",
        }),
      )
      expect(submitLead).not.toHaveBeenCalled()
    })
  })

  it("submits report form successfully", async () => {
    ;(submitReport as jest.Mock).mockResolvedValue({ success: true, message: "Report submitted successfully!" })

    render(<TestFormsPage />)
    fireEvent.click(screen.getByLabelText(/Report Form/i))

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "vercel_report@example.com" } })
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Jane" } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "Smith" } })
    fireEvent.change(screen.getByLabelText(/Narrative of what happened/i), { target: { value: "Test narrative." } })

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(submitReport).toHaveBeenCalledWith(
        expect.objectContaining({
          email: "vercel_report@example.com",
          firstName: "Jane",
          lastName: "Smith",
          narrative: "Test narrative.",
        }),
      )
      expect(mockToast).toHaveBeenCalledWith({
        title: "Success!",
        description: "Report submitted successfully!",
      })
      expect(mockPush).toHaveBeenCalledWith("/thank-you")
    })
  })

  it("shows validation error for report form", async () => {
    render(<TestFormsPage />)
    fireEvent.click(screen.getByLabelText(/Report Form/i))

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Validation Error",
          variant: "destructive",
        }),
      )
      expect(submitReport).not.toHaveBeenCalled()
    })
  })

  it("handles submission error for waitlist form", async () => {
    ;(submitLead as jest.Mock).mockResolvedValue({ success: false, message: "Failed to submit lead." })

    render(<TestFormsPage />)

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "vercel_error@example.com" } })
    fireEvent.change(screen.getByLabelText(/First Name/i), { target: { value: "Error" } })
    fireEvent.change(screen.getByLabelText(/Last Name/i), { target: { value: "User" } })

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Error",
        description: "Failed to submit lead.",
        variant: "destructive",
      })
      expect(mockPush).not.toHaveBeenCalled()
    })
  })
})
