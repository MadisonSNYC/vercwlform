import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { cookies } from "next/headers"

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!, // Use service role key for server-side operations if needed, or anon key for RLS
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // The `cookies().set()` method can throw an error when called from a Server Component
            // that uses the `cookies()` hook, but only if the component is called in a route
            // that is not a Server Action or Route Handler.
            // For example:
            // - `app/layout.tsx`
            // - `app/page.tsx`
            // - `app/dashboard/page.tsx`
            console.warn("Could not set cookie from Server Component:", error)
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: "", ...options })
          } catch (error) {
            console.warn("Could not remove cookie from Server Component:", error)
          }
        },
      },
    },
  )
}
