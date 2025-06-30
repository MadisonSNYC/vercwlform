"use client"

import { useEffect, useState } from "react"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"

export default function LeadProgressIndicator() {
  const [progress, setProgress] = useState(0)
  const [totalLeads, setTotalLeads] = useState(0)
  const [targetLeads, setTargetLeads] = useState(100) // Example target
  const supabase = createClient()

  useEffect(() => {
    const fetchLeadCount = async () => {
      const { count, error } = await supabase.from("leads").select("*", { count: "exact", head: true })

      if (error) {
        console.error("Error fetching lead count:", error)
        return
      }

      const currentLeads = count || 0
      setTotalLeads(currentLeads)
      setProgress((currentLeads / targetLeads) * 100)
    }

    fetchLeadCount()

    const channel = supabase
      .channel("lead_count_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        console.log("Lead count change received!", payload)
        fetchLeadCount() // Re-fetch count on any change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, targetLeads])

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Lead Generation Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 text-center">
          <p className="text-2xl font-bold">
            {totalLeads} / {targetLeads} Leads
          </p>
          <p className="text-sm text-gray-500">{progress.toFixed(1)}% towards your goal</p>
        </div>
        <Progress value={progress} className="w-full" />
      </CardContent>
    </Card>
  )
}
