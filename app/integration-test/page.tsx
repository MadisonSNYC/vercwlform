"use client"

import { testDatabaseConnection } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"

export default function IntegrationTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleTestConnection = async () => {
    setIsConnecting(true)
    const result = await testDatabaseConnection()
    setConnectionStatus(result.message)
    setIsConnecting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Supabase Integration Test</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Click the button below to test the connection to your Supabase database.</p>
          <Button onClick={handleTestConnection} disabled={isConnecting}>
            {isConnecting ? "Connecting..." : "Test Database Connection"}
          </Button>
          {connectionStatus && (
            <div
              className={`mt-4 p-3 rounded-md ${
                connectionStatus.includes("successful") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
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
