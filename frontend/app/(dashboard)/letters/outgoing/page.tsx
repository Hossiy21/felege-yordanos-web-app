"use client"

import { useState, useEffect, useCallback } from "react"
import { LetterTable, type Letter } from "@/components/letters/letter-table"
import { NewLetterDialog } from "@/components/letters/new-letter-dialog"
import { PdfViewerModal } from "@/components/letters/pdf-viewer-modal"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Plus, Send, Clock, AlertCircle, Archive, CheckCircle2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTranslation } from "react-i18next"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export default function OutgoingLettersPage() {
  const { t } = useTranslation()

  // ── Data State ──────────────────────────────────────────────────────────────
  const [letters, setLetters] = useState<Letter[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // ── UI State ────────────────────────────────────────────────────────────────
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pdfOpen, setPdfOpen] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [selectedLetterForEdit, setSelectedLetterForEdit] = useState<Letter | null>(null)

  // ── Pagination State ────────────────────────────────────────────────────────
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [totalItems, setTotalItems] = useState(0)

  // ── Fetch outgoing letters from the backend ──────────────────────────────────
  const fetchLetters = useCallback(async (page: number = 1, limit: number = 10) => {
    setIsLoading(true)
    setError(null)
    try {
      // Backend now supports ?type=outgoing — filtering + pagination done server-side
      const res = await fetch(
        `${API_BASE}/api/letter/letters?page=${page}&limit=${limit}&type=outgoing`,
        { credentials: "include" }
      )

      if (!res.ok) throw new Error(`Server returned ${res.status}`)

      const data = await res.json()
      if (!data.letters) throw new Error(data.error || "Invalid response from server")

      const transformed: Letter[] = data.letters.map((item: any) => ({
        id: item._id || item.id,
        reference: item.reference_number || "—",
        subject: item.subject || "No Subject",
        department: item.department_name || "General",
        status: item.status
          ? item.status.charAt(0).toUpperCase() + item.status.slice(1)
          : "Pending",
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
          : "—",
        assigned: item.owner_email || "Unassigned",
        pdfUrl: item.pdf_url,
      }))

      setLetters(transformed)
      setTotalPages(data.pages || 1)
      setTotalItems(data.total || 0)
      setCurrentPage(data.page || 1)
    } catch (err: any) {
      console.error("Fetch outgoing letters failed:", err)
      setError(err.message || "Unable to load outgoing letters.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchLetters(currentPage, pageSize)
  }, [currentPage, pageSize, fetchLetters])

  // ── Handlers ────────────────────────────────────────────────────────────────
  /** Called by NewLetterDialog after a successful API save — refresh list */
  const handleNewLetter = useCallback(() => {
    fetchLetters(1, pageSize)
    setCurrentPage(1)
  }, [fetchLetters, pageSize])

  const handleEditLetter = (letter: Letter) => {
    setSelectedLetterForEdit(letter)
    setDialogOpen(true)
  }

  const handleDeleteLetter = async (letter: Letter) => {
    if (!letter.id) {
      toast.error("Cannot delete: letter has no ID")
      return
    }
    try {
      const res = await fetch(`${API_BASE}/api/letter/letters/${letter.id}`, {
        method: "DELETE",
        credentials: "include",
      })
      if (!res.ok) throw new Error("Delete failed")
      setLetters((prev) => prev.filter((l) => l.id !== letter.id))
      toast.success("Letter moved to trash")
    } catch (err) {
      console.error("Delete failed:", err)
      toast.error("Failed to delete letter")
    }
  }

  const handleViewLetter = (letter: Letter) => {
    setSelectedLetter(letter)
    setPdfOpen(true)
  }

  const handleDialogOpenChange = (open: boolean) => {
    setDialogOpen(open)
    if (!open) setSelectedLetterForEdit(null)
  }

  // ── Stats derived from fetched data ─────────────────────────────────────────
  const stats = {
    total: totalItems,
    pending: letters.filter((l) => l.status === "Pending").length,
    approved: letters.filter((l) => l.status === "Approved").length,
    draft: letters.filter((l) => l.status === "Draft").length,
    archived: letters.filter((l) => l.status === "Archived").length,
  }

  const existingRefs = letters.map((l) => l.reference)

  return (
    <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-8">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-6 pt-2">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-primary/10 rounded-xl relative group">
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-xl group-hover:blur-2xl transition-all opacity-50" />
              <Send className="h-6 w-6 text-primary relative z-10" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              Outgoing Letters
            </h1>
          </div>
          <p className="text-muted-foreground mt-2 max-w-2xl text-sm md:text-base">
            Draft, approve, and dispatch official outgoing correspondence for Felege Yordanos Sunday School.
          </p>
        </div>
        <Button
          size="lg"
          className="gap-2 shadow-md shadow-primary/20 font-medium hover:shadow-primary/40 transition-all rounded-full px-6"
          onClick={() => setDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
          New Letter
        </Button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 animate-in fade-in slide-in-from-bottom-6 duration-700">
        {/* Total */}
        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-primary/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Total Outgoing
            </CardTitle>
            <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
              <Send className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">All outgoing correspondence</p>
          </CardContent>
        </Card>

        {/* Pending */}
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
            <p className="text-xs text-muted-foreground mt-1">{t("requiring_attention")}</p>
          </CardContent>
        </Card>

        {/* Approved */}
        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-emerald-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              Approved
            </CardTitle>
            <div className="p-2 bg-emerald-500/10 rounded-lg group-hover:bg-emerald-500/20 transition-colors">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready to dispatch</p>
          </CardContent>
        </Card>

        {/* Draft / Archived */}
        <Card className="relative overflow-hidden group border-border/50 bg-background/50 backdrop-blur-sm hover:border-slate-500/30 transition-all hover:shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
              {t("drafts_urgent")}
            </CardTitle>
            <div className="p-2 bg-slate-500/10 rounded-lg group-hover:bg-slate-500/20 transition-colors">
              <Archive className="h-4 w-4 text-slate-500 dark:text-slate-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">{stats.draft}</div>
            <p className="text-xs text-muted-foreground mt-1">Drafts in progress</p>
          </CardContent>
        </Card>
      </div>

      {/* ── Main Table Card ── */}
      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <Card className="border-border/50 shadow-sm bg-background/50 backdrop-blur-sm overflow-hidden">
          <CardHeader className="px-6 py-5 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-md">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Sent Correspondence</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  A detailed list of all outgoing letters from the organisation.
                </p>
              </div>
            </div>
            <Badge
              variant="secondary"
              className="font-normal text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1 border-none shadow-sm shadow-primary/5"
            >
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
                <p className="text-sm font-medium text-muted-foreground animate-pulse">
                  Fetching correspondence records...
                </p>
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchLetters(currentPage, pageSize)}
                  className="mt-2"
                >
                  Try Again
                </Button>
              </div>
            ) : letters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
                <div className="p-4 bg-muted rounded-full text-muted-foreground/40">
                  <Send className="h-12 w-12" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-muted-foreground">No Outgoing Letters</h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    No outgoing letters have been composed yet. Draft your first letter to get started.
                  </p>
                </div>
                <Button size="sm" onClick={() => setDialogOpen(true)} className="mt-2">
                  Compose First Letter
                </Button>
              </div>
            ) : (
              <LetterTable
                letters={letters}
                type="outgoing"
                onViewLetter={handleViewLetter}
                onEditLetter={handleEditLetter}
                onDeleteLetter={handleDeleteLetter}
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalItems={totalItems}
                onPageChange={(page) => setCurrentPage(page)}
                onPageSizeChange={(size) => {
                  setPageSize(size)
                  setCurrentPage(1)
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Compose / Edit Dialog ── */}
      <NewLetterDialog
        open={dialogOpen}
        onOpenChange={handleDialogOpenChange}
        onSubmit={handleNewLetter}
        existingReferences={existingRefs}
        initialData={selectedLetterForEdit}
      />

      {/* ── PDF Viewer ── */}
      {selectedLetter && (
        <PdfViewerModal
          open={pdfOpen}
          onOpenChange={setPdfOpen}
          pdfUrl={(() => {
            const raw = selectedLetter.pdfUrl
            if (!raw) return `/sample-letter.pdf`
            const key = raw.split("/").slice(-1)[0]
            return `${API_BASE}/api/letter/letters/pdf-proxy?key=${encodeURIComponent(key)}`
          })()}
          title={selectedLetter.subject}
          reference={selectedLetter.reference}
          onEdit={handleEditLetter ? () => handleEditLetter(selectedLetter) : undefined}
          onDelete={handleDeleteLetter ? () => handleDeleteLetter(selectedLetter) : undefined}
        />
      )}
    </div>
  )
}
