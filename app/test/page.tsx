"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"

export default function TestPage() {
  const [testResult, setTestResult] = useState("Running tests...")
  const supabase = createClient()

  useEffect(() => {
    async function runTests() {
      try {
        // Test database connection
        const { data, error: dbError } = await supabase.from("leads").select("*").limit(1)
        if (dbError) {
          throw new Error(`Database connection failed: ${dbError.message}`)
        }
        console.log("Database connection successful:", data)

        // Test environment variables
        if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
          throw new Error("Supabase environment variables are not set.")
        }
        console.log("Supabase environment variables are set.")

        // Test a simple insert (optional, requires RLS policy for public inserts)
        // const { data: insertData, error: insertError } = await supabase.from('leads').insert({
        //   email: `test-${Date.now()}@example.com`,
        //   first_name: 'Test',
        //   last_name: 'User',
        //   form_type: 'waitlist'
        // }).select()
        // if (insertError) {
        //   throw new Error(`Insert test failed: ${insertError.message}`)
        // }
        // console.log('Insert test successful:', insertData)

        setTestResult("All integration tests passed successfully!")
      } catch (error: any) {
        setTestResult(`Integration test failed: ${error.message}`)
        console.error("Integration test error:", error)
      }
    }

    runTests()
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-4">Test Page</h1>
      <p className="text-lg text-center">{testResult}</p>
      <p className="mt-4 text-sm text-gray-600">Check the browser console for detailed logs.</p>
    </div>
  )
}
