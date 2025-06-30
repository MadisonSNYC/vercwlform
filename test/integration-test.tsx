import { render, screen, waitFor } from "@testing-library/react"
import IntegrationTestPage from "@/app/integration-test/page"
import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

// Mock Supabase client and cookies
jest.mock("@/lib/supabase/server", () => ({
  createClient: jest.fn(),
}))
jest.mock("next/headers", () => ({
  cookies: jest.fn(),
}))

describe('IntegrationTestPage', () => {
  const mockLeadsData = [{ id: 1, email: 'vercel_test@example.com', first_name: 'John' }]
  const mockReportsData = [{ id: 101, email: 'vercel_report@example.com', narrative: 'Test report' }]

  beforeEach(() => {
    // Mock the Supabase client to return specific data or errors
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn((tableName: string) => ({
        select: jest.fn(() => {
          if (tableName === 'vercel') { // Changed from 'leads'
            return { data: mockLeadsData, error: null }
          } else if (tableName === 'reports') {
            return { data: mockReportsData, error: null }
          }
          return { data: null, error: new Error('Table not found') }
        }),
      })),
    })
    // Mock cookies to return an empty object or specific values if needed
    (cookies as jest.Mock).mockReturnValue({
      get: jest.fn(),
      set: jest.fn(),
      remove: jest.fn(),
    })
  })

  it('renders leads and reports data correctly', async () => {
    render(await IntegrationTestPage())

    await waitFor(() => {
      expect(screen.getByText('Supabase Integration Test')).toBeInTheDocument()
      expect(screen.getByText('Vercel Table Data')).toBeInTheDocument() // Changed from Leads Table Data
      expect(screen.getByText(JSON.stringify(mockLeadsData, null, 2))).toBeInTheDocument()
      expect(screen.getByText('Reports Table Data')).toBeInTheDocument()
      expect(screen.getByText(JSON.stringify(mockReportsData, null, 2))).toBeInTheDocument()
    })
  })

  it('displays error message if leads data fetch fails', async () => {
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn((tableName: string) => ({
        select: jest.fn(() => {
          if (tableName === 'vercel') { // Changed from 'leads'
            return { data: null, error: new Error('Failed to fetch leads') }
          } else if (tableName === 'reports') {
            return { data: mockReportsData, error: null }
          }
          return { data: null, error: new Error('Table not found') }
        }),
      })),
    })

    render(await IntegrationTestPage())

    await waitFor(() => {
      expect(screen.getByText('Error fetching leads: Failed to fetch leads')).toBeInTheDocument()
      expect(screen.getByText(JSON.stringify(mockReportsData, null, 2))).toBeInTheDocument()
    })
  })

  it('displays error message if reports data fetch fails', async () => {
    (createClient as jest.Mock).mockReturnValue({
      from: jest.fn((tableName: string) => ({
        select: jest.fn(() => {
          if (tableName === 'vercel') { // Changed from 'leads'
            return { data: mockLeadsData, error: null }
          } else if (tableName === 'reports') {
            return { data: null, error: new Error('Failed to fetch reports') }
          }
          return { data: null, error:\
