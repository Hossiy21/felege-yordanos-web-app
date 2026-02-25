"use client"

import { useState, useEffect, useCallback } from "react"
import { LetterTable, type Letter } from "@/components/letters/letter-table"
import { RegisterIncomingDialog } from "@/components/letters/register-incoming-dialog"
import { Button } from "@/components/ui/button"
import { Plus, Mail, Clock, AlertCircle, Archive, Inbox } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

export default function IncomingLettersPage() {
  const { t } = useTranslation()
  const [letters, setLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchLetters = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/letter/letters`, {
        credentials: "include",
      })

      if (!response.ok) {
        throw new Error("Failed to fetch letters")
      }

      const data = await response.json()

      // Transform backend data to frontend format
      const transformed: Letter[] = data.map((item: any) => ({
        reference: item.reference_number || "—",
        subject: item.subject || "No Subject",
        department: item.department_name || "General",
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1), // Capitalize first letter
        date: new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        assigned: item.owner_email || "Unassigned",
        pdfUrl: item.pdf_url,
      }))

      setLetters(transformed)
    } catch (err) {
      console.error("Fetch failed:", err)
      setError("Unable to load correspondence records.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLetters()
  }, [fetchLetters])

  const handleRegisterLetter = (letter: Letter) => {
    // Optimistic update or refresh
    setLetters((prev) => [letter, ...prev])
  }

  // Calculate statistics
  const stats = {
    total: letters.length,
    pending: letters.filter(l => l.status === "Pending").length,
    urgent: letters.filter(l => l.status === "Draft").length,
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
              {t("incoming_letters_title")}
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
            {t("incoming_letters_page_desc")}
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-md shadow-primary/20 font-medium hover:shadow-primary/40 transition-all rounded-full px-6"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          {t("register_new_letter")}
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("total_incoming")}
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Mail className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-medium">+2</span> {t("from_last_month")}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-amber-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("pending_review")}
            </CardTitle>
            <div className="p-2 bg-amber-500/10 rounded-lg group-hover:bg-amber-500/20 transition-colors">
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("requiring_attention")}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-red-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("drafts_urgent")}
            </CardTitle>
            <div className="p-2 bg-red-500/10 rounded-lg group-hover:bg-red-500/20 transition-colors">
              <AlertCircle className="h-4 w-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.urgent}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("awaiting_approval")}
            </p>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-slate-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("archived")}
            </CardTitle>
            <div className="p-2 bg-slate-500/10 rounded-lg group-hover:bg-slate-500/20 transition-colors">
              <Archive className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.archived}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {t("archived_desc")}
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
                  {t("recent_correspondence")}
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("detailed_list_letters")}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="font-normal text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 border-none shadow-sm shadow-primary/5">
              {t("latest_updates")}
            </Badge>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl animate-pulse" />
                </div>
                <p className="text-sm font-medium text-muted-foreground animate-pulse">{t("loading_records") || "Fetching correspondence records..."}</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center gap-4">
                <div className="p-4 bg-destructive/10 rounded-full text-destructive">
                  <AlertCircle className="h-10 w-10" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold">{t("fetch_error_title") || "Connection Error"}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">{error}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => fetchLetters()} className="mt-2">
                  Try Again
                </Button>
              </div>
            ) : letters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="p-4 bg-muted rounded-full text-muted-foreground/40">
                  <Mail className="h-12 w-12" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-muted-foreground">{t("no_letters_title") || "No Letters Found"}</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    {t("no_letters_desc") || "There are no incoming letters registered in the system yet."}
                  </p>
                </div>
                <Button size="sm" onClick={() => setDialogOpen(true)} className="mt-2">
                  Register First Letter
                </Button>
              </div>
            ) : (
              <LetterTable letters={letters} type="incoming" />
            )}
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
