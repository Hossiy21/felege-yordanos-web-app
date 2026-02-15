"use client"

import { useState } from "react"
import { Search, FileText, CheckSquare, Upload, LogIn } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const logs = [
  {
    user: "Abebe T.",
    action: "Created letter",
    target: "SST/EDU/001/2026",
    timestamp: "Feb 8, 2026 14:32:05",
    ip: "192.168.1.12",
    category: "Letter",
    icon: FileText,
  },
  {
    user: "Sara M.",
    action: "Submitted for approval",
    target: "SST/FIN/003/2026",
    timestamp: "Feb 7, 2026 11:15:22",
    ip: "192.168.1.15",
    category: "Workflow",
    icon: CheckSquare,
  },
  {
    user: "Admin User",
    action: "Approved letter",
    target: "SST/EDU/001/2026",
    timestamp: "Feb 8, 2026 16:45:10",
    ip: "192.168.1.10",
    category: "Workflow",
    icon: CheckSquare,
  },
  {
    user: "Daniel K.",
    action: "Uploaded attachment",
    target: "SST/ADM/012/2026",
    timestamp: "Feb 6, 2026 09:20:33",
    ip: "192.168.1.18",
    category: "Document",
    icon: Upload,
  },
  {
    user: "Admin User",
    action: "User login",
    target: "System",
    timestamp: "Feb 8, 2026 08:00:01",
    ip: "192.168.1.10",
    category: "Auth",
    icon: LogIn,
  },
  {
    user: "Helen G.",
    action: "Updated meeting minutes",
    target: "Weekly Meeting - Feb 4",
    timestamp: "Feb 5, 2026 10:12:44",
    ip: "192.168.1.20",
    category: "Meeting",
    icon: FileText,
  },
  {
    user: "Sara M.",
    action: "Rejected letter",
    target: "SST/FIN/004/2026",
    timestamp: "Feb 4, 2026 15:30:11",
    ip: "192.168.1.15",
    category: "Workflow",
    icon: CheckSquare,
  },
]

function getCategoryColor(category: string) {
  switch (category) {
    case "Letter":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Workflow":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Document":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Auth":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "Meeting":
      return "bg-teal-50 text-teal-700 border-teal-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function AuditLogsList() {
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("all")
  const [user, setUser] = useState("all")

  const filtered = logs.filter((log) => {
    const matchSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.target.toLowerCase().includes(search.toLowerCase()) ||
      log.user.toLowerCase().includes(search.toLowerCase())
    const matchCategory = category === "all" || log.category === category
    const matchUser = user === "all" || log.user === user
    return matchSearch && matchCategory && matchUser
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search actions, users, targets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Category</SelectItem>
            <SelectItem value="Letter">Letter</SelectItem>
            <SelectItem value="Workflow">Workflow</SelectItem>
            <SelectItem value="Document">Document</SelectItem>
            <SelectItem value="Auth">Auth</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
          </SelectContent>
        </Select>
        <Select value={user} onValueChange={setUser}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="User" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">User</SelectItem>
            <SelectItem value="Admin User">Admin User</SelectItem>
            <SelectItem value="Abebe T.">Abebe T.</SelectItem>
            <SelectItem value="Sara M.">Sara M.</SelectItem>
            <SelectItem value="Daniel K.">Daniel K.</SelectItem>
            <SelectItem value="Helen G.">Helen G.</SelectItem>
          </SelectContent>
        </Select>
        <Input type="date" className="w-[160px]" aria-label="Start date" />
        <Input type="date" className="w-[160px]" aria-label="End date" />
      </div>

      {/* Logs */}
      <div className="flex flex-col gap-0 bg-card border border-border rounded-lg divide-y divide-border">
        {filtered.map((log, index) => (
          <div
            key={`${log.user}-${log.timestamp}-${index}`}
            className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
                <log.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-sm text-foreground">
                  <span className="font-semibold text-info">{log.user}</span>{" "}
                  <span className="text-muted-foreground">{log.action}</span>{" "}
                  <span className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">
                    {log.target}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {log.timestamp} &middot; IP: {log.ip}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${getCategoryColor(log.category)}`}
            >
              {log.category}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
