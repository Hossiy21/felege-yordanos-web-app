import { Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const letters = [
  {
    subject: "Annual Report Submission",
    reference: "SST/EDU/001/2026",
    department: "Education",
    status: "Approved",
    date: "Feb 8, 2026",
  },
  {
    subject: "Budget Request Q2",
    reference: "SST/FIN/003/2026",
    department: "Finance",
    status: "Pending",
    date: "Feb 7, 2026",
  },
  {
    subject: "Invitation from Diocese",
    reference: "SST/ADM/012/2026",
    department: "Administration",
    status: "Archived",
    date: "Feb 6, 2026",
  },
  {
    subject: "Teacher Training Schedule",
    reference: "SST/EDU/002/2026",
    department: "Education",
    status: "Draft",
    date: "Feb 5, 2026",
  },
  {
    subject: "Donation Acknowledgement",
    reference: "SST/FIN/002/2026",
    department: "Finance",
    status: "Approved",
    date: "Feb 4, 2026",
  },
]

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

export function RecentLetters() {
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          Recent Letters
        </CardTitle>
        <Link
          href="/letters/outgoing"
          className="text-sm font-medium text-info hover:underline"
        >
          {"View all \u2192"}
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-0 pt-0">
        {letters.map((letter) => (
          <div
            key={letter.reference}
            className="flex items-center gap-4 py-3.5 border-t border-border"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted">
              <Mail className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {letter.subject}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {letter.reference} &middot; {letter.department}
              </p>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${getStatusVariant(letter.status)}`}
            >
              {letter.status}
            </Badge>
            <span className="text-xs text-muted-foreground shrink-0 hidden sm:inline">
              {letter.date}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
