import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function IntegrationTestPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return redirect("/login")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-bold">Integration Test Page</h1>
      <p className="mt-4">This page is for testing various integrations and functionalities.</p>
      <p className="mt-2">User: {user.email}</p>
      <form action="/auth/sign-out" method="post" className="mt-4">
        <button className="px-4 py-2 text-white bg-red-500 rounded-md">Sign Out</button>
      </form>
    </div>
  )
}
