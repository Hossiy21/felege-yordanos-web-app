"use client"

import { useState, useCallback, useMemo, useRef, useEffect } from "react"
import { toast } from "sonner"
import { EthiopianDatePicker } from "@/components/ui/ethiopian-date-picker"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import {
    Mail,
    Upload,
    FileText,
    Loader2,
    Save,
    CheckCircle2,
    Maximize2,
    Minimize2,
    Calendar,
    Building2,
    AlertCircle,
    ZoomIn,
    ZoomOut,
    Download,
    Inbox,
    Clock,
    FileCheck,
    PanelRightOpen,
    PanelRightClose,
    Eye,
    Pencil,
    X,
    Printer,
} from "lucide-react"
import type { Letter } from "@/components/letters/letter-table"
import { RichTextEditor } from "@/components/letters/rich-text-editor"
import { cn } from "@/lib/utils"

// ──────────────────────────────────────────────
// Constants & Types
// ──────────────────────────────────────────────
interface RegisterIncomingDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit?: (letter: Letter) => void
    existingReferences?: string[]
}

const DEPARTMENTS = [
    "Education",
    "Finance",
    "Administration",
    "Youth Ministry",
    "Choir",
    "Service Committee",
]

const LETTER_CATEGORIES = [
    { value: "invitation", label: "Invitation", icon: "📨" },
    { value: "request", label: "Request", icon: "📋" },
    { value: "notice", label: "Official Notice", icon: "📢" },
    { value: "report", label: "Report", icon: "📊" },
    { value: "directive", label: "Directive / Order", icon: "📜" },
    { value: "financial", label: "Financial Document", icon: "💰" },
    { value: "complaint", label: "Complaint / Inquiry", icon: "❓" },
    { value: "partnership", label: "Partnership / MoU", icon: "🤝" },
    { value: "other", label: "Other", icon: "📄" },
]

const URGENCY_OPTIONS = [
    { value: "normal", label: "Normal", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    { value: "high", label: "High", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
]

// ──────────────────────────────────────────────
// Components
// ──────────────────────────────────────────────
function PdfUploadZone({
    file,
    onFileSelect,
    onRemove,
    compact = false,
}: {
    file: File | null
    onFileSelect: (file: File) => void
    onRemove: () => void
    compact?: boolean
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [dragOver, setDragOver] = useState(false)

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files?.[0]?.type === "application/pdf") {
                onFileSelect(e.dataTransfer.files[0])
            }
        },
        [onFileSelect]
    )

    if (file) {
        return (
            <div className="group relative flex items-center gap-4 p-4 rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 dark:from-emerald-950/40 dark:to-emerald-950/20 transition-all hover:border-emerald-500/50 hover:shadow-sm hover:shadow-emerald-500/10">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-background shadow-sm ring-1 ring-emerald-500/20">
                    <FileCheck className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">{Math.round(file.size / 1024)} KB</span> • PDF Document
                    </p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => { e.stopPropagation(); onRemove() }}
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full h-8 w-8 transition-colors shrink-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>
        )
    }

    return (
        <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => inputRef.current?.click()}
            className={cn(
                "group relative flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300 overflow-hidden",
                dragOver
                    ? "border-primary bg-primary/5 scale-[1.01] shadow-lg shadow-primary/5"
                    : "border-border/60 hover:border-primary/50 hover:bg-muted/30",
                compact ? "p-6" : "p-10"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-muted/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className={cn(
                "relative flex items-center justify-center rounded-full transition-all duration-300 shadow-sm",
                dragOver ? "bg-primary text-primary-foreground shadow-xl shadow-primary/30 scale-110" : "bg-background border border-border text-muted-foreground group-hover:scale-110 group-hover:border-primary/50 group-hover:text-primary group-hover:shadow-md",
                compact ? "h-10 w-10" : "h-14 w-14"
            )}>
                <Upload className={cn(compact ? "h-5 w-5" : "h-7 w-7", dragOver && "animate-bounce")} />
            </div>
            <div className="relative text-center space-y-1">
                <p className="text-sm font-semibold text-foreground">
                    {dragOver ? "Drop file here to attach" : "Click to upload or drag and drop"}
                </p>
                {!compact && (
                    <p className="text-xs text-muted-foreground">
                        PDF documents only (max. 10MB)
                    </p>
                )}
            </div>
            <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={(e) => e.target.files?.[0] && onFileSelect(e.target.files[0])} />
        </div>
    )
}

function PdfViewer({ file }: { file: File }) {
    const [zoom, setZoom] = useState(100)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const pdfUrl = useMemo(() => URL.createObjectURL(file), [file])

    return (
        <div className="flex flex-col h-full bg-background border-l border-border">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-muted/50 border-b border-border shrink-0 z-10">
                <div className="flex items-center gap-2 overflow-hidden text-foreground">
                    <div className="h-6 w-6 rounded bg-muted flex items-center justify-center shrink-0 border border-border">
                        <FileText className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-medium truncate max-w-[200px] text-foreground">{file.name}</span>
                </div>

                <div className="flex items-center gap-1 bg-background rounded-md border border-border p-0.5">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => setZoom((p) => Math.max(p - 25, 50))}
                    >
                        <ZoomOut className="h-3 w-3" />
                    </Button>
                    <span className="text-[10px] font-mono text-muted-foreground min-w-[32px] text-center select-none">{zoom}%</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                        onClick={() => setZoom((p) => Math.min(p + 25, 200))}
                    >
                        <ZoomIn className="h-3 w-3" />
                    </Button>
                    <Separator orientation="vertical" className="h-3 mx-1 bg-border" />
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-muted-foreground hover:text-foreground hover:bg-muted"
                        asChild
                    >
                        <a href={pdfUrl} download={file.name}>
                            <Download className="h-3 w-3" />
                        </a>
                    </Button>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto p-6 relative flex justify-center bg-muted/20">
                {loading && !error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-20 backdrop-blur-sm">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}
                {error && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-destructive z-20">
                        <AlertCircle className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">Failed to load PDF</span>
                    </div>
                )}

                <div
                    style={{
                        transform: `scale(${zoom / 100})`,
                        transformOrigin: "top center",
                        width: "100%",
                        maxWidth: "800px"
                    }}
                    className="transition-transform duration-200"
                >
                    <iframe
                        src={`${pdfUrl}#toolbar=0&navpanes=0&view=FitH`}
                        className="w-full shadow-xl rounded-sm min-h-[800px] border border-border/50"
                        title="PDF Preview"
                        onLoad={() => { setLoading(false); setError(false) }}
                        onError={() => { setLoading(false); setError(true) }}
                    />
                </div>
            </div>
        </div>
    )
}



function RegistrationSummary({
    data
}: {
    data: any
}) {
    const categoryInfo = LETTER_CATEGORIES.find((c) => c.value === data.category)
    const urgencyInfo = URGENCY_OPTIONS.find((u) => u.value === data.urgency)

    return (
        <div className="max-w-3xl mx-auto p-8 space-y-8">
            {/* Header / Title */}
            <div className="space-y-4 border-b border-border pb-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                            Incoming Letter Registration
                        </p>
                        <h2 className="text-2xl font-bold text-foreground leading-tight">
                            {data.subject || "Untitled Letter"}
                        </h2>
                    </div>
                    {data.reference && (
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold">Reference No.</span>
                            <span className="text-lg font-mono font-medium text-primary">
                                {data.reference}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-2">
                    {urgencyInfo && (
                        <Badge variant="secondary" className={cn("px-3 py-1 text-sm font-normal gap-2 border", urgencyInfo.color)}>
                            <div className={cn("h-1.5 w-1.5 rounded-full bg-current")} />
                            {urgencyInfo.label} Priority
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Origin */}
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        Origin Details
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-4 border border-border/50">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Sender</span>
                            <p className="font-medium text-foreground">{data.from || "—"}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">External Ref</span>
                                <p className="text-sm font-mono text-foreground">{data.senderRef || "—"}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="text-xs text-muted-foreground">Letter Date</span>
                                <p className="text-sm text-foreground">{data.letterDate || "—"}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Column 2: Routing */}
                <section className="space-y-4">
                    <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                        <Inbox className="h-4 w-4 text-muted-foreground" />
                        Internal Routing
                    </h3>
                    <div className="bg-muted/30 rounded-lg p-4 space-y-4 border border-border/50">
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Assigned Department</span>
                            <div className="flex items-center gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary" />
                                <p className="font-medium text-foreground">{data.department || "Unassigned"}</p>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <span className="text-xs text-muted-foreground">Received Date</span>
                            <p className="text-sm text-foreground">{data.receivedDate || "—"}</p>
                        </div>
                    </div>
                </section>
            </div>

            {/* Remarks */}
            <section className="space-y-3 pt-2">
                <h3 className="text-sm font-semibold text-foreground">Remarks / Notes</h3>
                <div className="min-h-[80px] rounded-lg border border-border/60 p-4 bg-muted/10 text-sm italic text-muted-foreground">
                    {data.remarks ? (
                        <div
                            className="prose prose-sm dark:prose-invert max-w-none [&_p]:m-0"
                            dangerouslySetInnerHTML={{ __html: data.remarks }}
                        />
                    ) : (
                        <span className="opacity-50">No remarks added.</span>
                    )}
                </div>
            </section>
        </div>
    )
}

// ──────────────────────────────────────────────
// Main Dialog
// ──────────────────────────────────────────────
export function RegisterIncomingDialog({
    open,
    onOpenChange,
    onSubmit,
    existingReferences = [],
}: RegisterIncomingDialogProps) {
    // Form state
    const [subject, setSubject] = useState("")
    const [from, setFrom] = useState("")
    const [reference, setReference] = useState("")
    const [senderRef, setSenderRef] = useState("")
    const [department, setDepartment] = useState("")
    const [urgency, setUrgency] = useState("normal")
    const [letterDate, setLetterDate] = useState("")
    const [receivedDate, setReceivedDate] = useState("")
    const [remarks, setRemarks] = useState("")
    const [pdfFile, setPdfFile] = useState<File | null>(null)

    // UI state
    const [saving, setSaving] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(true)
    const [documentPanelOpen, setDocumentPanelOpen] = useState(true)
    const [mode, setMode] = useState<"edit" | "review">("edit")
    const [formKey, setFormKey] = useState(0)

    const shortDate = useMemo(() => new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), [])
    // Fix hydration mismatch by generating date on client side only
    const [registeredDate, setRegisteredDate] = useState("")



    useEffect(() => {
        setRegisteredDate(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))
    }, [])

    const resetForm = useCallback(() => {
        setSubject("")
        setFrom("")
        setReference("")
        setSenderRef("")
        setDepartment("")
        setUrgency("normal")
        setLetterDate("")
        setReceivedDate("")
        setRemarks("")
        setPdfFile(null)
        setMode("edit")
        setFormKey(prev => prev + 1)
    }, [])

    const handleSave = useCallback(
        async (status: "Draft" | "Approved") => {
            setSaving(true)
            try {
                // Determine department ID based on selection (mocking 1 for now if not found)
                const deptId = DEPARTMENTS.indexOf(department) + 1 || 1
                const referenceNo = reference || `FY/IN/${new Date().getFullYear()}/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`

                const formData = new FormData()
                formData.append("reference_number", referenceNo)
                formData.append("letter_type", "incoming")
                formData.append("subject", subject || "Untitled Letter")
                formData.append("department_id", deptId.toString())
                formData.append("department_name", department || "General")
                formData.append("status", status.toLowerCase())
                if (pdfFile) {
                    formData.append("pdf", pdfFile)
                }

                const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"}/api/letter/letters`, {
                    method: "POST",
                    body: formData,
                    credentials: "include",
                })

                if (!response.ok) {
                    throw new Error("Failed to save letter")
                }

                const result = await response.json()
                toast.success("Correspondence Saved Successfully")

                // Call onSubmit with the expected frontend format
                onSubmit?.({
                    reference: referenceNo,
                    subject: subject || "Untitled Letter",
                    department: department || "General",
                    status: status,
                    date: shortDate,
                    assigned: "You",
                    pdfUrl: result.pdf_url,
                })

                resetForm()
                onOpenChange(false)
            } catch (err) {
                console.error("Save failed:", err)
                toast.error("Failed to save correspondence")
            } finally {
                setSaving(false)
            }
        },
        [subject, department, reference, pdfFile, shortDate, onSubmit, resetForm, onOpenChange]
    )

    const formData = {
        subject, from, reference, senderRef, department, urgency, letterDate, receivedDate, remarks
    }

    const dialogSizeClass = isFullscreen
        ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
        : "max-w-6xl max-h-[95vh] h-[90vh]"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${dialogSizeClass} overflow-hidden p-0 flex flex-col gap-0`}>

                {/* ════ HEADER ════ */}
                <div className="shrink-0 bg-background/80 backdrop-blur-md border-b border-border/50 px-6 py-4 flex items-center justify-between z-10 shadow-sm relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />

                    <div className="flex items-center gap-4 relative">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-primary/20 rounded-xl blur group-hover:blur-md transition-all opacity-50"></div>
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
                                <Inbox className="h-5 w-5" />
                            </div>
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold tracking-tight text-foreground">Register Incoming Letter</DialogTitle>
                            <DialogDescription className="text-xs font-medium text-muted-foreground mt-0.5">Digitize and record received correspondence</DialogDescription>
                        </div>
                    </div>

                    <div className="flex items-center gap-1.5 relative">
                        {/* VIEW MODE TOGGLE */}
                        <div className="flex bg-muted rounded-lg p-1 mr-2 shadow-inner border border-border/50">
                            <button onClick={() => setMode("edit")} className={cn("px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5", mode === "edit" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50")}>
                                <Pencil className="h-3.5 w-3.5" /> Edit
                            </button>
                            <button onClick={() => setMode("review")} className={cn("px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5", mode === "review" ? "bg-background shadow text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-background/50")}>
                                <Eye className="h-3.5 w-3.5" /> Review
                            </button>
                        </div>

                        <Separator orientation="vertical" className="h-6 mx-2 border-border/50" />

                        <Button
                            variant={documentPanelOpen ? "secondary" : "ghost"}
                            size="sm"
                            className={cn("h-9 gap-2 text-xs font-medium px-3 transition-all", documentPanelOpen && "bg-secondary text-secondary-foreground shadow-sm")}
                            onClick={() => setDocumentPanelOpen(!documentPanelOpen)}
                        >
                            {documentPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRightOpen className="h-4 w-4" />}
                            <span className="hidden sm:inline">Document Source</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-muted transition-colors rounded-full" onClick={() => setIsFullscreen(!isFullscreen)}>
                            {isFullscreen ? <Minimize2 className="h-4 w-4 text-muted-foreground" /> : <Maximize2 className="h-4 w-4 text-muted-foreground" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive transition-colors rounded-full" onClick={() => onOpenChange(false)}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* ════ BODY (SPLIT VIEW) ════ */}
                <div className="flex-1 flex overflow-hidden">

                    {/* ━━ LEFT: FORM / REVIEW ━━ */}
                    <div className="flex-1 overflow-y-auto bg-background transition-all duration-300">
                        {mode === "edit" ? (
                            /* EDIT FORM */
                            <div className="p-8 max-w-4xl mx-auto flex flex-col gap-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                {/* Letter Details */}
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3 border-b border-border/50 pb-3">
                                        <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                                            <FileText className="h-4 w-4" />
                                        </div>
                                        <h3 className="text-base font-semibold text-foreground tracking-tight">
                                            Details & Origin
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-semibold text-foreground">Subject <span className="text-destructive">*</span></Label>
                                            <Input
                                                value={subject}
                                                onChange={e => setSubject(e.target.value)}
                                                placeholder="e.g., Invitation to Annual Youth Conference"
                                                className="font-medium text-base sm:text-lg h-14 px-4 shadow-sm border-border/60 hover:border-primary/40 focus:border-primary transition-colors focus-visible:ring-primary/20 bg-muted/20"
                                            />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium text-foreground">Internal Reference No.</Label>
                                                <Input
                                                    value={reference}
                                                    onChange={e => setReference(e.target.value)}
                                                    placeholder="e.g. FY/IN/2026/001"
                                                    className="font-mono bg-background"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Sender (From) <span className="text-destructive">*</span></Label>
                                                <Input value={from} onChange={e => setFrom(e.target.value)} placeholder="Organization or Individual Name" className="bg-background" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-sm font-medium">Sender's Reference <span className="text-muted-foreground font-normal text-xs">(If any)</span></Label>
                                                <Input value={senderRef} onChange={e => setSenderRef(e.target.value)} placeholder="e.g., ORG/2023/001" className="bg-background" />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Assignment */}
                                <section className="space-y-5">
                                    <div className="flex items-center gap-2 border-b border-border/50 pb-2">
                                        <Building2 className="h-4 w-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                            Assignment & Dates
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Assigned Department <span className="text-destructive">*</span></Label>
                                            <Select value={department} onValueChange={setDepartment}>
                                                <SelectTrigger className="h-11">
                                                    <SelectValue placeholder="Select Department" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DEPARTMENTS.map(d => <SelectItem key={d} value={d} className="py-3">{d}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Letter Date</Label>
                                            <EthiopianDatePicker
                                                key={`letter-date-${formKey}`}
                                                label="Letter Date"
                                                onChange={setLetterDate}
                                                placeholder="Select Ethiopian Date"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm font-medium">Received Date</Label>
                                            <EthiopianDatePicker
                                                key={`received-date-${formKey}`}
                                                label="Received Date"
                                                onChange={setReceivedDate}
                                                placeholder="Select Ethiopian Date"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2">
                                        <Label className="text-sm font-medium">Remarks / Notes</Label>
                                        <RichTextEditor
                                            value={remarks}
                                            onChange={setRemarks}
                                            placeholder="Add any internal notes or initial instructions..."
                                            minHeight="150px"
                                        />
                                    </div>
                                </section>
                                <div className="h-10" />
                            </div>
                        ) : (
                            /* REVIEW MODE */
                            <div className="bg-muted/10 h-full overflow-y-auto">
                                <RegistrationSummary data={formData} />
                            </div>
                        )}
                    </div>

                    {/* ━━ RIGHT: PDF PANEL ━━ */}
                    {documentPanelOpen && (
                        <div className="w-1/2 border-l border-border bg-muted/5 relative flex flex-col transition-all duration-300">
                            {pdfFile ? (
                                <PdfViewer file={pdfFile} />
                            ) : (
                                <div className="flex-1 flex flex-col p-8 overflow-y-auto">
                                    <div className="flex items-center justify-between mb-8">
                                        <Label className="text-base font-semibold text-foreground flex items-center gap-2">
                                            <div className="flex items-center justify-center p-1.5 rounded-md bg-primary/10 text-primary">
                                                <Upload className="h-4 w-4" />
                                            </div>
                                            Document Source
                                        </Label>
                                        <Badge variant="secondary" className="font-normal border-border/50 hover:bg-secondary">
                                            Required
                                        </Badge>
                                    </div>
                                    <PdfUploadZone file={pdfFile} onFileSelect={setPdfFile} onRemove={() => setPdfFile(null)} />
                                </div>
                            )}
                        </div>
                    )}

                </div>

                {/* ════ FOOTER ════ */}
                <div className="shrink-0 bg-background/80 backdrop-blur-md border-t border-border/50 px-6 py-4 flex items-center justify-between z-10">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {pdfFile ? (
                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium"><CheckCircle2 className="h-4 w-4" /> Doc Attached</span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-amber-600"><AlertCircle className="h-4 w-4" /> No Doc</span>
                        )}
                        <span className="text-muted-foreground/30">|</span>
                        <span>Registered: {registeredDate}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {mode === "review" && (
                            <Button variant="outline" onClick={() => setMode("edit")} className="mr-auto">
                                Back to Edit
                            </Button>
                        )}
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>

                        {mode === "edit" ? (
                            <Button variant="secondary" onClick={() => setMode("review")} className="shadow-sm font-medium gap-2">
                                Review Summary <PanelRightOpen className="h-4 w-4" />
                            </Button>
                        ) : (
                            <>
                                <Button variant="outline" onClick={() => handleSave("Draft")} disabled={saving} className="font-medium hover:bg-muted/80">
                                    {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2 text-muted-foreground" />}
                                    Save Draft
                                </Button>
                                <Button onClick={() => handleSave("Approved")} disabled={saving || !subject || !department} className="min-w-[140px] shadow-sm font-semibold shadow-primary/20 hover:shadow-primary/40 transition-all gap-2">
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                                    Register Letter
                                </Button>
                            </>
                        )}
                    </div>
                </div>

            </DialogContent >
        </Dialog >
    )
}
