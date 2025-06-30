import { NextResponse } from "next/server"

export async function GET() {
  const health = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: {
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓ Configured" : "✗ Missing",
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "✓ Configured" : "✗ Missing",
    },
    version: "1.0.0",
  }

  return NextResponse.json(health)
}
