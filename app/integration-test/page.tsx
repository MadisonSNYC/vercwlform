import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export default async function IntegrationTestPage() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: leads, error: leadsError } = await supabase.from("leads").select("*")
  const { data: reports, error: reportsError } = await supabase.from("reports").select("*")

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Integration Test</h1>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Leads Table Data</h2>
        {leadsError && <p className="text-red-500">Error fetching leads: {leadsError.message}</p>}
        {leads && leads.length > 0 ? (
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">{JSON.stringify(leads, null, 2)}</pre>
        ) : (
          <p>No leads found or an error occurred.</p>
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Reports Table Data</h2>
        {reportsError && <p className="text-red-500">Error fetching reports: {reportsError.message}</p>}
        {reports && reports.length > 0 ? (
          <pre className="bg-gray-100 p-4 rounded-md text-sm overflow-auto">{JSON.stringify(reports, null, 2)}</pre>
        ) : (
          <p>No reports found or an error occurred.</p>
        )}
      </div>
    </div>
  )
}
