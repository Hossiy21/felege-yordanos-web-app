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
  MessageSquare,
  Search
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { useEffect, useCallback } from "react"
import { toast } from "sonner"

export default function MeetingsPage() {
  const { t } = useTranslation()
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState({ upcoming: 0, total_decisions: 0, emergencies: 0 })

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [totalItems, setTotalItems] = useState(0)
  const [statusFilter, setStatusFilter] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  const fetchMeetings = useCallback(async (page: number = 1, limit: number = 5, status: string = "", search: string = "") => {
    setIsLoading(true)
    setError(null)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/meeting/meetings?page=${page}&limit=${limit}`
      if (status) url += `&status=${status}`
      if (search) url += `&search=${encodeURIComponent(search)}`

      const response = await fetch(url, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch meetings")
      }

      const data = await response.json()

      if (data.meetings) {
        setMeetings(data.meetings)
        setTotalPages(data.pages || 1)
        setTotalItems(data.total || 0)
        setCurrentPage(data.page || 1)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setMeetings(Array.isArray(data) ? data : [])
      }
    } catch (err) {
      console.error("Fetch failed:", err)
      setError("Unable to load meeting records.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMeetings(currentPage, pageSize, statusFilter, searchTerm)
    }, 500)
    return () => clearTimeout(timer)
  }, [currentPage, pageSize, statusFilter, searchTerm, fetchMeetings])

  const handleUpdateMeeting = async (id: string, updateData: any) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/meeting/meetings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        credentials: "include",
      })

      if (!response.ok) throw new Error("Update failed")

      toast.success("Meeting updated successfully")
      fetchMeetings(currentPage, pageSize, statusFilter, searchTerm)
    } catch (err) {
      toast.error("Failed to update meeting")
    }
  }

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
  const handleDeleteMeeting = async (id: string) => {
    if (!confirm("Are you sure you want to delete this meeting?")) return

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/meeting/meetings/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (!response.ok) throw new Error("Delete failed")

      toast.success("Meeting moved to trash")
      fetchMeetings(currentPage, pageSize)
    } catch (err) {
      toast.error("Failed to delete meeting")
    }
  }

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
                <h3 className="text-3xl font-bold mt-1">{stats.upcoming}</h3>
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
                <h3 className="text-3xl font-bold mt-1">{stats.total_decisions}</h3>
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
                <h3 className="text-3xl font-bold mt-1">{stats.emergencies}</h3>
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
        <div className="flex flex-col sm:flex-row items-center justify-between px-1 gap-4">
          <div className="relative w-full sm:w-64">
            <Input
              placeholder="Search meetings..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 h-9 bg-background/50 border-border/40 focus:border-primary/50"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>
          <div className="flex gap-2 self-end sm:self-auto">
            <Button
              variant={statusFilter === "" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => { setStatusFilter(""); setCurrentPage(1); }}
            >All</Button>
            <Button
              variant={statusFilter === "Upcoming" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => { setStatusFilter("Upcoming"); setCurrentPage(1); }}
            >Scheduled</Button>
            <Button
              variant={statusFilter === "Completed" ? "default" : "ghost"}
              size="sm"
              className="text-xs h-8"
              onClick={() => { setStatusFilter("Completed"); setCurrentPage(1); }}
            >History</Button>
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
          <div className="space-y-6">
            <MeetingsList
              meetings={meetings}
              onDelete={handleDeleteMeeting}
              onUpdate={handleUpdateMeeting}
            />
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-2 py-4 border-t border-border/40">
                <p className="text-sm text-muted-foreground">
                  Showing {meetings.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{" "}
                  {Math.min(currentPage * pageSize, totalItems)} of {totalItems} meetings
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
