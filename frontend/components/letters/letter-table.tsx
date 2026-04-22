"use client"

import { useState } from "react"
import { Search, Filter, Download, Mail, Send, Eye, Pencil, Trash2 } from "lucide-react"
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PdfViewerModal } from "@/components/letters/pdf-viewer-modal"
import { useTranslation } from "react-i18next"

export interface Letter {
  id?: string
  reference: string
  subject: string
  department: string
  status: string
  date: string
  assigned: string
  pdfUrl?: string
}

function getStatusVariant(status: string) {
  switch (status?.toLowerCase()) {
    case "approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "pending":
      return "bg-amber-50 text-amber-700 border-amber-200"
    case "archived":
      return "bg-slate-50 text-slate-600 border-slate-200"
    case "draft":
      return "bg-gray-50 text-gray-500 border-gray-200"
    case "rejected":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

interface LetterTableProps {
  letters: Letter[]
  type: "incoming" | "outgoing"
  onEditLetter?: (letter: Letter) => void
  onDeleteLetter?: (letter: Letter) => void
  onViewLetter?: (letter: Letter) => void
  currentPage?: number
  totalPages?: number
  pageSize?: number
  totalItems?: number
  onPageChange?: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function LetterTable({
  letters,
  type,
  onEditLetter,
  onDeleteLetter,
  onViewLetter,
  currentPage = 1,
  totalPages = 1,
  pageSize = 10,
  totalItems = 0,
  onPageChange,
  onPageSizeChange
}: LetterTableProps) {
  const { t } = useTranslation()
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("all")
  const [status, setStatus] = useState("all")
  const [pdfOpen, setPdfOpen] = useState(false)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [letterToDelete, setLetterToDelete] = useState<Letter | null>(null)

  const handleViewPdf = (letter: Letter) => {
    if (onViewLetter) {
      onViewLetter(letter)
    } else {
      setSelectedLetter(letter)
      setPdfOpen(true)
    }
  }

  const handleDeleteClick = (letter: Letter) => {
    setLetterToDelete(letter)
    setDeleteConfirmOpen(true)
  }

  const confirmDelete = () => {
    if (letterToDelete && onDeleteLetter) {
      onDeleteLetter(letterToDelete)
    }
    setDeleteConfirmOpen(false)
    setLetterToDelete(null)
  }

  const filtered = letters.filter((l) => {
    const matchSearch =
      l.subject.toLowerCase().includes(search.toLowerCase()) ||
      l.reference.toLowerCase().includes(search.toLowerCase())
    const matchDept = department === "all" || l.department === department
    const matchStatus = status === "all" || l.status.toLowerCase() === status.toLowerCase()
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
            placeholder={t("search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={department} onValueChange={setDepartment}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder={t("department")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("department")}</SelectItem>
            <SelectItem value="Education">Education</SelectItem>
            <SelectItem value="Finance">Finance</SelectItem>
            <SelectItem value="Administration">Administration</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={t("status")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("status")}</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Approved">Approved</SelectItem>
            <SelectItem value="Rejected">Rejected</SelectItem>
            <SelectItem value="Archived">Archived</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="h-4 w-4" />
          {t("more_filters")}
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          {t("export")}
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("reference")}
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("subject_label")}
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("department")}
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("status")}
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("date")}
                </th>
                <th className="text-left text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("assigned")}
                </th>
                <th className="text-right text-xs font-semibold text-muted-foreground px-5 py-3">
                  {t("actions")}
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
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        onClick={() => handleViewPdf(letter)}
                        title={t("view")}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-primary"
                        onClick={() => onEditLetter?.(letter)}
                        title={t("edit")}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                        onClick={() => handleDeleteClick(letter)}
                        title={t("delete")}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modern Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-border bg-muted/20 backdrop-blur-sm gap-4">
          <div className="flex items-center gap-6">
            <p className="text-sm text-muted-foreground whitespace-nowrap">
              {t("showing")} <span className="font-semibold text-foreground">{letters.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> {t("to")} <span className="font-semibold text-foreground">{Math.min(currentPage * pageSize, totalItems)}</span> {t("of")} <span className="font-semibold text-foreground">{totalItems}</span> {t("results")}
            </p>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium">{t("display") || "Display"}</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => onPageSizeChange?.(parseInt(val))}
              >
                <SelectTrigger className="h-8 w-[70px] bg-transparent border-border/50 hover:bg-muted/50 transition-colors">
                  <SelectValue placeholder={pageSize} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 50].map((size) => (
                    <SelectItem key={size} value={size.toString()} className="text-xs">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-background p-1 rounded-xl border border-border/50 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
            >
              <span className="sr-only">Previous Page</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M8.84182 3.13514C9.04327 3.32401 9.05348 3.64042 8.86462 3.84188L5.43521 7.49991L8.86462 11.1579C9.05348 11.3594 9.04327 11.6758 8.84182 11.8647C8.64036 12.0535 8.32394 12.0433 8.13508 11.8419L4.38508 7.84188C4.20477 7.64955 4.20477 7.35027 4.38508 7.15794L8.13508 3.15794C8.32394 2.95648 8.64036 2.94627 8.84182 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>

            <div className="flex items-center gap-0.5">
              {/* Logic for showing page numbers can be refined later if there are many pages */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  size="sm"
                  variant={currentPage === page ? "default" : "ghost"}
                  className={`h-8 min-w-[32px] px-2 text-xs font-semibold rounded-lg transition-all duration-200 ${currentPage === page
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
                    : "text-muted-foreground hover:bg-muted"
                    }`}
                  onClick={() => onPageChange?.(page)}
                >
                  {page}
                </Button>
              ))}
              {totalPages > 5 && <span className="text-muted-foreground px-2">...</span>}
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground disabled:opacity-30"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
            >
              <span className="sr-only">Next Page</span>
              <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-4 w-4"><path d="M6.1584 3.13514C5.95694 3.32401 5.94673 3.64042 6.13559 3.84188L9.565 7.49991L6.13559 11.1579C5.94673 11.3594 5.95694 11.6758 6.1584 11.8647C6.35986 12.0535 6.67628 12.0433 6.86514 11.8419L10.6151 7.84188C10.7955 7.64955 10.7955 7.35027 10.6151 7.15794L10.6151 7.15794L6.86514 3.15794C6.67628 2.95648 6.35986 2.94627 6.1584 3.13514Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd"></path></svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("are_you_sure") || "Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("delete_confirmation_message") || "This action cannot be undone. This will permanently delete the record and remove the associated file from our servers."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel") || "Cancel"}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t("delete") || "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* PDF Viewer Modal */}
      {!onViewLetter && selectedLetter && (
        <PdfViewerModal
          open={pdfOpen}
          onOpenChange={setPdfOpen}
          pdfUrl={(() => {
            const raw = selectedLetter.pdfUrl
            if (!raw) return `/sample-letter.pdf`
            const key = raw.split("/").slice(-1)[0]
            const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"
            return `${apiBase}/api/letter/letters/pdf-proxy?key=${encodeURIComponent(key)}`
          })()}
          title={selectedLetter.subject}
          reference={selectedLetter.reference}
          onEdit={onEditLetter ? () => onEditLetter(selectedLetter) : undefined}
          onDelete={onDeleteLetter ? () => onDeleteLetter(selectedLetter) : undefined}
        />
      )}
    </div>
  )
}
