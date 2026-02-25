"use client"

import { useState } from "react"
import { MeetingsList, type Meeting } from "@/components/meetings/meetings-list"
import { CreateMeetingDialog } from "@/components/meetings/create-meeting-dialog"
import { Button } from "@/components/ui/button"
import {
  Plus,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslation } from "react-i18next"
import { useEffect, useCallback } from "react"
import { toast } from "sonner"

export default function MeetingsPage() {
  const { t } = useTranslation()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMeetings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/meeting/meetings`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch meetings")
      }

      const data = await response.json()
      // Map 'id' properly if needed (backend returns 'id')
      setMeetings(data)
    } catch (err) {
      console.error("Fetch failed:", err)
      setError("Unable to load meeting records.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMeetings()
  }, [fetchMeetings])

  const handleCreateMeeting = async (newMeetingData: any) => {
    try {
      const payload = {
        title: newMeetingData.title,
        date: newMeetingData.date,
        time: newMeetingData.time,
        location: newMeetingData.location,
        attendees: 0,
        decisions: 0,
        status: "Upcoming",
        is_emergency: newMeetingData.type === 'emergency',
        type: newMeetingData.type,
        agenda: newMeetingData.agenda
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/meeting/meetings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to save meeting")
      }

      const savedMeeting = await response.json()
      setMeetings((prev) => [savedMeeting, ...prev])
      toast.success("Meeting Scheduled & Notification Sent")
    } catch (err) {
      console.error("Save failed:", err)
      toast.error("Failed to schedule meeting")
    }
  }

  // Calculate stats
  const upcomingCount = meetings.filter(m => m.status === "Upcoming").length
  const totalDecisions = meetings.reduce((acc, m) => acc + (m.decisions || 0), 0)
  const emergencyCount = meetings.filter(m => m.isEmergency).length

  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header section with professional feel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
              {t("meeting_records") || "Meeting Records"}
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl">
            {t("meeting_subtitle") || "Record, track and notify upcoming and historical meeting minutes and decisions."}
          </p>
        </div>
        <CreateMeetingDialog onCreate={handleCreateMeeting}>
          <Button className="gap-2 h-12 px-6 rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all font-semibold">
            <Plus className="h-5 w-5" />
            New Meeting
          </Button>
        </CreateMeetingDialog>
      </div>

      {/* Modern Stats Section */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden group hover:border-primary/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Upcoming</p>
                <h3 className="text-3xl font-bold mt-1">{upcomingCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                <Clock className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-blue-600 font-medium">
              <TrendingUp className="h-3 w-3" />
              <span>Next meeting: Wednesday</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden group hover:border-emerald-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Decisions</p>
                <h3 className="text-3xl font-bold mt-1">{totalDecisions}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-emerald-600 font-medium">
              <MessageSquare className="h-3 w-3" />
              <span>Policy actions implemented</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/50 backdrop-blur-sm overflow-hidden group hover:border-red-500/50 transition-colors">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Emergency Sessions</p>
                <h3 className="text-3xl font-bold mt-1">{emergencyCount}</h3>
              </div>
              <div className="h-12 w-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-red-600 font-medium">
              <Users className="h-3 w-3" />
              <span>Response readiness high</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h2 className="text-xl font-bold text-foreground">Timeline</h2>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs h-8">All</Button>
            <Button variant="ghost" size="sm" className="text-xs h-8">Scheduled</Button>
            <Button variant="ghost" size="sm" className="text-xs h-8">History</Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <p className="text-sm font-medium text-muted-foreground animate-pulse">Syncing records...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4 bg-destructive/5 rounded-2xl border border-destructive/20">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{t("fetch_error_title") || "Connection Error"}</h3>
              <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => fetchMeetings()} className="mt-2">
              Try Again
            </Button>
          </div>
        ) : (
          <MeetingsList meetings={meetings} />
        )}
      </div>
    </div>
  )
}
