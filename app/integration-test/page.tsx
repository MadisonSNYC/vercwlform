"use client"

import { testDatabaseConnection } from "@/lib/actions"
import { Button } from "@/components/ui/button"

export default async function IntegrationTestPage() {
  const { success, message } = await testDatabaseConnection()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">Integration Test</h1>
      <div className={`p-4 rounded-lg ${success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
        <p className="font-semibold">{message}</p>
      </div>
      <Button className="mt-6" onClick={() => window.location.reload()}>
        Run Test Again
      </Button>
    </div>
  )
}
