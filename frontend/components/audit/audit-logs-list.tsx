"use client"

import { useState, useEffect } from "react"
import { Search, FileText, CheckSquare, Upload, LogIn, AlertCircle, Loader2, Shield } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AuditLog {
  id: string
  admin_email: string
  action: string
  timestamp: string
  ip_address: string
}

function getIconForAction(action: string) {
  const a = action.toLowerCase()
  if (a.includes("login")) return LogIn
  if (a.includes("upload") || a.includes("document")) return Upload
  if (a.includes("letter")) return FileText
  if (a.includes("permission") || a.includes("user")) return Shield
  return CheckSquare
}

function getCategoryFromAction(action: string) {
  const a = action.toLowerCase()
  if (a.includes("login")) return "Auth"
  if (a.includes("document") || a.includes("upload")) return "Document"
  if (a.includes("letter")) return "Letter"
  if (a.includes("permission") || a.includes("user")) return "Security"
  return "System"
}

function getCategoryColor(category: string) {
  switch (category) {
    case "Letter":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Security":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Document":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Auth":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "System":
      return "bg-teal-50 text-teal-700 border-teal-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function AuditLogsList() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")

  useEffect(() => {
    fetchLogs()
  }, [])

  const fetchLogs = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/admin/audit-logs`, {
        credentials: 'include'
      })
      if (!response.ok) throw new Error("Failed to fetch real audit logs")
      const data = await response.json()
      setLogs(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filtered = logs.filter((log) => {
    const category = getCategoryFromAction(log.action)
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.admin_email.toLowerCase().includes(search.toLowerCase())
    const matchCategory = categoryFilter === "all" || category === categoryFilter
    return matchSearch && matchCategory
  })

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card border rounded-lg">
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Fetching real audit trail...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-card border border-destructive/20 rounded-lg">
        <AlertCircle className="h-10 w-10 text-destructive mb-4" />
        <h3 className="text-lg font-semibold">Error Loading Logs</h3>
        <p className="text-muted-foreground mt-1">{error}</p>
        <button onClick={fetchLogs} className="mt-4 text-sm text-primary hover:underline font-medium">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions or admin emails..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Auth">Auth</SelectItem>
            <SelectItem value="Document">Document</SelectItem>
            <SelectItem value="Letter">Letter</SelectItem>
            <SelectItem value="Security">Security</SelectItem>
            <SelectItem value="System">System</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[160px]" aria-label="Start date" />
        <Input type="date" className="w-[160px]" aria-label="End date" />
      </div>

      {/* Logs */}
      <div className="flex flex-col gap-0 bg-card border border-border rounded-lg divide-y divide-border shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <Shield className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No audit logs found for this criteria.</p>
          </div>
        ) : (
          filtered.map((log) => {
            const Icon = getIconForAction(log.action)
            const category = getCategoryFromAction(log.action)
            return (
              <div
                key={log.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold text-primary">{log.admin_email}</span>{" "}
                      <span className="text-muted-foreground">{log.action}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()} &middot; IP: {log.ip_address}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`text-xs shrink-0 ${getCategoryColor(category)}`}
                >
                  {category}
                </Badge>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
