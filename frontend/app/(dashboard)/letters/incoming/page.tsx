import { LetterTable } from "@/components/letters/letter-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const incomingLetters = [
  {
    reference: "SST/ADM/012/2026",
    subject: "Invitation Letter from Diocese Office",
    department: "Administration",
    status: "Archived",
    date: "Feb 6, 2026",
    assigned: "Daniel K.",
  },
  {
    reference: "SST/ADM/013/2026",
    subject: "Facility Maintenance Request",
    department: "Administration",
    status: "Approved",
    date: "Feb 3, 2026",
    assigned: "Helen G.",
  },
  {
    reference: "SST/FIN/005/2026",
    subject: "Financial Audit Preparation Notice",
    department: "Finance",
    status: "Draft",
    date: "Feb 1, 2026",
    assigned: "Sara M.",
  },
]

export default function IncomingLettersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">
            {"Incoming Letters (\u1308\u1262)"}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Manage received correspondence
          </p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          Register Letter
        </Button>
      </div>
      <LetterTable letters={incomingLetters} type="incoming" />
    </div>
  )
}
