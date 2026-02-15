"use client"

import { useState } from "react"
import { Search, Download, FileText } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const documents = [
  {
    name: "Annual Report 2025.pdf",
    type: "Report",
    size: "2.4 MB",
    uploaded: "Jan 15, 2026",
    by: "Admin User",
  },
  {
    name: "Meeting Minutes - Jan Week 4.docx",
    type: "Minutes",
    size: "156 KB",
    uploaded: "Jan 29, 2026",
    by: "Helen G.",
  },
  {
    name: "Budget Proposal Q2.xlsx",
    type: "Finance",
    size: "89 KB",
    uploaded: "Feb 1, 2026",
    by: "Sara M.",
  },
  {
    name: "Scanned Letter - Diocese.jpg",
    type: "Scan",
    size: "1.8 MB",
    uploaded: "Feb 6, 2026",
    by: "Daniel K.",
  },
  {
    name: "Teacher Training Guide.pdf",
    type: "Guide",
    size: "5.2 MB",
    uploaded: "Feb 5, 2026",
    by: "Abebe T.",
  },
]

function getTypeColor(type: string) {
  switch (type) {
    case "Report":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Minutes":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Finance":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Scan":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "Guide":
      return "bg-teal-50 text-teal-700 border-teal-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function DocumentsTable() {
  const [search, setSearch] = useState("")

  const filtered = documents.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col gap-4">
      {/* Search */}
      <div className="p-4 bg-card border border-border rounded-lg">
        <div className="relative max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Name
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Type
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Size
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Uploaded
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  By
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr
                  key={doc.name}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="text-sm font-medium text-foreground">
                        {doc.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getTypeColor(doc.type)}`}
                    >
                      {doc.type}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {doc.size}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {doc.uploaded}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {doc.by}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={`Download ${doc.name}`}
                    >
                      <Download className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
