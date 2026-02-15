import { LetterTable } from "@/components/letters/letter-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const outgoingLetters = [
  {
    reference: "SST/EDU/001/2026",
    subject: "Annual Report Submission to Diocese",
    department: "Education",
    status: "Approved",
    date: "Feb 8, 2026",
    assigned: "Abebe T.",
  },
  {
    reference: "SST/FIN/003/2026",
    subject: "Budget Request for Q2 Programs",
    department: "Finance",
    status: "Pending",
    date: "Feb 7, 2026",
    assigned: "Sara M.",
  },
  {
    reference: "SST/EDU/002/2026",
    subject: "Teacher Training Schedule Notification",
    department: "Education",
    status: "Draft",
    date: "Feb 5, 2026",
    assigned: "Abebe T.",
  },
  {
    reference: "SST/FIN/004/2026",
    subject: "Donation Acknowledgment Letter",
    department: "Finance",
    status: "Rejected",
    date: "Feb 4, 2026",
    assigned: "Sara M.",
  },
  {
    reference: "SST/EDU/003/2026",
    subject: "Curriculum Update Proposal",
    department: "Education",
    status: "Pending",
    date: "Feb 2, 2026",
    assigned: "Abebe T.",
  },
]

export default function OutgoingLettersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            {"Outgoing Letters (\u12C8\u1322)"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Draft, approve, and send letters
          </p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Letter
        </Button>
      </div>
      <LetterTable letters={outgoingLetters} type="outgoing" />
    </div>
  )
}
