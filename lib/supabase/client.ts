import { createBrowserClient } from "@supabase/ssr"

// Create a singleton instance of the Supabase client for Client Components
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null

export const supabase = (() => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error(
      "Supabase environment variables NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required.",
    )
    // In a real application, you might want to throw an error or handle this more gracefully
    // For now, we'll return null and let the consuming code handle it.
    return null
  }

  if (!supabaseInstance) {
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
})()
