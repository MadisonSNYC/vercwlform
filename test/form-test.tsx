import { render, screen, fireEvent, waitFor } from "@testing-library/react"
import "@testing-library/jest-dom"
import TestFormsPage from "../app/test-forms/page" // Adjust path as necessary
import { describe, it, expect } from "@jest/globals" // Declare variables

describe("TestFormsPage", () => {
  it("renders the form with all fields", () => {
    render(<TestFormsPage />)

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Message/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Subscribe to newsletter/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Male/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Female/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Other/i)).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /Country/i })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /Submit/i })).toBeInTheDocument()
  })

  it("displays validation errors for empty required fields on submit", async () => {
    render(<TestFormsPage />)

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Name is required./i)).toBeInTheDocument()
      expect(screen.getByText(/Email is required./i)).toBeInTheDocument()
      expect(screen.getByText(/Message is required./i)).toBeInTheDocument()
      expect(screen.getByText(/Please select a gender./i)).toBeInTheDocument()
      expect(screen.getByText(/Please select a country./i)).toBeInTheDocument()
      expect(screen.getByText(/Please correct the errors in the form./i)).toBeInTheDocument()
    })
  })

  it("displays validation error for invalid email format", async () => {
    render(<TestFormsPage />)

    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "invalid-email" } })
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Email is invalid./i)).toBeInTheDocument()
    })
  })

  it("displays validation error for short message", async () => {
    render(<TestFormsPage />)

    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "short" } })
    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Message must be at least 10 characters long./i)).toBeInTheDocument()
    })
  })

  it("submits the form successfully with valid data", async () => {
    render(<TestFormsPage />)

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } })
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: "john.doe@example.com" } })
    fireEvent.change(screen.getByLabelText(/Message/i), { target: { value: "This is a valid message for testing." } })
    fireEvent.click(screen.getByLabelText(/Male/i)) // Select gender
    fireEvent.click(screen.getByRole("combobox", { name: /Country/i }))
    fireEvent.click(screen.getByText("United States")) // Select country

    fireEvent.click(screen.getByRole("button", { name: /Submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Form submitted successfully!/i)).toBeInTheDocument()
    })

    // Ensure no error messages are present
    expect(screen.queryByText(/Name is required./i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Email is required./i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Message is required./i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Please select a gender./i)).not.toBeInTheDocument()
    expect(screen.queryByText(/Please select a country./i)).not.toBeInTheDocument()
  })

  it("clears errors when input changes after an error", async () => {
    render(<TestFormsPage />)

    fireEvent.click(screen.getByRole("button", { name: /Submit/i })) // Trigger errors
    await waitFor(() => {
      expect(screen.getByText(/Name is required./i)).toBeInTheDocument()
    })

    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: "John Doe" } })
    expect(screen.queryByText(/Name is required./i)).not.toBeInTheDocument()
  })
})
