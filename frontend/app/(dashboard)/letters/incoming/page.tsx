"use client"

import { useState } from "react"
import { LetterTable, type Letter } from "@/components/letters/letter-table"
import { RegisterIncomingDialog } from "@/components/letters/register-incoming-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Mail, Clock, AlertCircle, Archive, Inbox } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const initialLetters: Letter[] = [
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
  {
    reference: "SST/edu/032/2026",
    subject: "Curriculum Update Report",
    department: "Education",
    status: "Pending",
    date: "Feb 8, 2026",
    assigned: "Markos T.",
  },
]

export default function IncomingLettersPage() {
  const [letters, setLetters] = useState<Letter[]>(initialLetters)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleRegisterLetter = (letter: Letter) => {
    setLetters((prev) => [letter, ...prev])
  }

  // Calculate statistics
  const stats = {
    total: letters.length,
    pending: letters.filter(l => l.status === "Pending").length,
    urgent: letters.filter(l => l.status === "Draft").length, // Using Draft as proxy for "needs attention" for now
    archived: letters.filter(l => l.status === "Archived").length,
  }

  // Collect existing references for uniqueness check
  const existingRefs = letters.map(l => l.reference)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 pt-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-50"></div>
              <Inbox className="h-6 w-6 text-primary relative z-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Incoming Letters
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
            Manage and track all received correspondence for the church. Streamline document flows securely and efficiently.
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-md shadow-primary/20 font-medium hover:shadow-primary/40 transition-all rounded-full px-6"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Register New Letter
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Total Incoming
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Mail className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">+2</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-amber-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Pending Review
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Requiring immediate attention
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-red-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Drafts / Urgent
            </CardTitle>
            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting final approval
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-slate-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Archived
            </CardTitle>
            <div className="p-2 bg-slate-500/10 rounded-lg group-hover:bg-slate-500/20 transition-colors">
              <Archive className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.archived}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Processed and stored
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">
                  Recent Correspondence
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  A detailed list of all incoming letters to the organization.
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-normal text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 border-none shadow-sm shadow-primary/5">
              Latest Updates
            </Badge>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <LetterTable letters={letters} type="incoming" />
          </CardContent>
        </Card>
      </div>

      <RegisterIncomingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleRegisterLetter}
        existingReferences={existingRefs}
      />
    </div>
  )
}
