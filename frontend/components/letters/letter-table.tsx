"use client"

import { useState } from "react"
import { Search, Filter, Download, Mail, Send, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PdfViewerModal } from "@/components/letters/pdf-viewer-modal"

export interface Letter {
  reference: string
  subject: string
  department: string
  status: string
  date: string
  assigned: string
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Pending":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "Archived":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "Draft":
      return "bg-gray-50 text-gray-500 border-gray-200"
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

interface LetterTableProps {
  letters: Letter[]
  type: "incoming" | "outgoing"
}

export function LetterTable({ letters, type }: LetterTableProps) {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("all")
  const [status, setStatus] = useState("all")
  const [pdfOpen, setPdfOpen] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)

  const handleViewPdf = (letter: Letter) => {
    setSelectedLetter(letter)
    setPdfOpen(true)
  }

  const filtered = letters.filter((l) => {
    const matchSearch =
      l.subject.toLowerCase().includes(search.toLowerCase()) ||
      l.reference.toLowerCase().includes(search.toLowerCase())
    const matchDept = department === "all" || l.department === department
    const matchStatus = status === "all" || l.status === status
    return matchSearch && matchDept && matchStatus
  })

  const LetterIcon = type === "incoming" ? Mail : Send

  return (
    <div className="flex flex-col gap-4">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 p-4 bg-card border border-border rounded-lg">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by subject or reference..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Department" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Department</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Administration">Administration</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          More Filters
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Reference
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Subject
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Department
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Date
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  Assigned
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((letter) => (
                <tr
                  key={letter.reference}
                  className="border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <LetterIcon className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-mono text-muted-foreground">
                        {letter.reference}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-foreground font-medium">
                    {letter.subject}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {letter.department}
                  </td>
                  <td className="px-5 py-4">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getStatusVariant(letter.status)}`}
                    >
                      {letter.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {letter.date}
                  </td>
                  <td className="px-5 py-4 text-sm text-muted-foreground">
                    {letter.assigned}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                      onClick={() => handleViewPdf(letter)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-3 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Showing {filtered.length} of {letters.length} results
          </p>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="text-xs h-8">
              Previous
            </Button>
            <Button size="sm" className="text-xs h-8 bg-primary text-primary-foreground">
              1
            </Button>
            <Button variant="outline" size="sm" className="text-xs h-8">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {selectedLetter && (
        <PdfViewerModal
          open={pdfOpen}
          onOpenChange={setPdfOpen}
          pdfUrl={`/sample-letter.pdf`}
          title={selectedLetter.subject}
          reference={selectedLetter.reference}
        />
      )}
    </div>
  )
}
