"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { createClient } from "@/lib/supabase/client"

interface LeadData {
  id: string
  created_at: string
  full_name: string
  email: string
  phone: string | null
  address: string | null
  borough: string
  lease_term: string | null
  move_in_date: string | null
  budget: number | null
  notes: string | null
  payment_method: string | null
  agreed_to_terms: boolean
}

interface BoroughCount {
  name: string
  count: number
}

export default function LeadAnalytics() {
  const [boroughData, setBoroughData] = useState<BoroughCount[]>([])
  const [totalLeads, setTotalLeads] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    const fetchLeads = async () => {
      const { data, error, count } = await supabase.from("leads").select("*", { count: "exact" })

      if (error) {
        console.error("Error fetching leads:", error)
        return
      }

      setTotalLeads(count || 0)

      const counts: { [key: string]: number } = {}
      data?.forEach((lead: LeadData) => {
        if (lead.borough) {
          counts[lead.borough] = (counts[lead.borough] || 0) + 1
        }
      })

      const formattedData = Object.keys(counts).map((borough) => ({
        name: borough,
        count: counts[borough],
      }))
      setBoroughData(formattedData)
    }

    fetchLeads()

    const channel = supabase
      .channel("leads_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "leads" }, (payload) => {
        console.log("Change received!", payload)
        fetchLeads() // Re-fetch data on any change
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  return (
    <div className="mt-8 grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Total Leads</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold">{totalLeads}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Leads by Borough</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={boroughData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
