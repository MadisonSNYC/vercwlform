import { createBrowserClient } from "@supabase/ssr"

export function createClient() {
  // Create a single supabase client for the client-side
  // This ensures we don't create a new client on every render
  return createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}
