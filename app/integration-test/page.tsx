"use client"

import { testDatabaseConnection } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function IntegrationTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleTestConnection = async () => {
    setLoading(true)
    setConnectionStatus("Testing connection...")
    const result = await testDatabaseConnection()
    if (result.success) {
      setConnectionStatus(`Success: ${result.message}`)
    } else {
      setConnectionStatus(`Failed: ${result.message}`)
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Supabase Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">
            Click the button below to test the connection to your Supabase database.
          </p>
          <Button onClick={handleTestConnection} disabled={loading} className="w-full">
            {loading ? "Connecting..." : "Test Supabase Connection"}
          </Button>
          {connectionStatus && (
            <div
              className={`p-3 rounded-md text-center ${
                connectionStatus.startsWith("Success") ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}
            >
              {connectionStatus}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
