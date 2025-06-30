import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { cookies } from "next/headers"

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_URL")
  }
  if (!supabaseAnonKey) {
    throw new Error("Missing environment variable NEXT_PUBLIC_SUPABASE_ANON_KEY")
  }

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `cookies().set()` method can't be called from a Client Component.
          // This can happen if you are trying to set a cookie from a Client Component
          // that then gets called by a Server Component.
          // For example, if you have a page with a `Form` component that uses a
          // Server Action, and that Server Action calls `cookies().set()`, then
          // this error will be triggered if the `Form` component is a Client Component.
          // To work around this, you can pass the `cookies().set()` as a prop to the
          // Client Component, or you can use a Server Component to set the cookie.
          console.warn("Cookie set failed:", error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          console.warn("Cookie remove failed:", error)
        }
      },
    },
  })
}
