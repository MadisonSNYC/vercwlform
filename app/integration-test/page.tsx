"use client"

import { useEffect, useState } from "react"
import { testDatabaseConnection } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

export default function IntegrationTestPage() {
  const [connectionStatus, setConnectionStatus] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const handleTestConnection = async () => {
    setIsConnecting(true)
    const result = await testDatabaseConnection()
    if (result.success) {
      setConnectionStatus(`Success: ${result.message}`)
    } else {
      setConnectionStatus(`Error: ${result.message}`)
    }
    setIsConnecting(false)
  }

  useEffect(() => {
    // Optionally test connection on component mount
    // handleTestConnection();
  }, [])

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
            <Alert
              className={
                connectionStatus.startsWith("Success")
                  ? "border-green-500 text-green-700"
                  : "border-red-500 text-red-700"
              }
            >
              <Terminal className="h-4 w-4" />
              <AlertTitle>Connection Status</AlertTitle>
              <AlertDescription>{connectionStatus}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
