import { createServerClient, type CookieOptions } from "@supabase/ssr"
import type { cookies } from "next/headers"

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have great confidence that you do not
          // actually need it to work in a Server Component.
          // To learn more, see https://supabase.com/docs/guides/auth/server-side/nextjs
          console.warn("Cookie set operation failed in Server Component:", error)
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have great confidence that you do not
          // actually need it to work in a Server Component.
          // To learn more, see https://supabase.com/docs/guides/auth/server-side/nextjs
          console.warn("Cookie remove operation failed in Server Component:", error)
        }
      },
    },
  })
}
