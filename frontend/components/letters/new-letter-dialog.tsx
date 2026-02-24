"use client"

import { useState, useCallback, useMemo } from "react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { RichTextEditor } from "@/components/letters/rich-text-editor"
import {
    Send,
    Save,
    FileText,
    Loader2,
    Maximize2,
    Minimize2,
    RefreshCw,
    Eye,
    Pencil,
    Printer,
    Copy,
    CheckCircle2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Letter } from "@/components/letters/letter-table"

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
interface NewLetterDialogProps {
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

const PRIORITY_OPTIONS = [
    { value: "normal", label: "Normal", color: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800" },
    { value: "high", label: "High", color: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800" },
    { value: "urgent", label: "Urgent", color: "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800" },
]

const REF_COUNTER_KEY = "sst_letter_ref_counter"

// ──────────────────────────────────────────────
// Unique Reference Generator
// ──────────────────────────────────────────────
function getNextCounter(): number {
    try {
        const stored = localStorage.getItem(REF_COUNTER_KEY)
        const counter = stored ? parseInt(stored, 10) + 1 : 1
        localStorage.setItem(REF_COUNTER_KEY, String(counter))
        return counter
    } catch {
        return Math.floor(Math.random() * 9000) + 1000
    }
}

function generateUniqueReference(deptCode: string, existingRefs: string[]): string {
    const year = new Date().getFullYear()
    let ref: string
    let attempts = 0
    do {
        const counter = getNextCounter()
        const num = String(counter).padStart(3, "0")
        ref = `SST/${deptCode}/${num}/${year}`
        attempts++
    } while (existingRefs.includes(ref) && attempts < 100)
    return ref
}

// ──────────────────────────────────────────────
// Letter Preview Component
// ──────────────────────────────────────────────
function LetterPreview({
    reference,
    date,
    from,
    to,
    cc,
    subject,
    content,
    senderName,
    senderTitle,
}: {
    reference: string
    date: string
    from: string
    to: string
    cc: string
    subject: string
    content: string
    senderName: string
    senderTitle: string
}) {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg border border-border mx-auto overflow-hidden" style={{ maxWidth: 780 }}>
            {/* Letterhead */}
            <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent px-10 pt-8 pb-6 border-b border-border">
                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-foreground tracking-tight">
                            ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
                        </h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Felege Yordanos Sunday School
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                            Bole Debre Salem Medhanealem Cathedral
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted-foreground">Addis Ababa, Ethiopia</p>
                        <p className="text-xs text-muted-foreground">+251 11 662 0000</p>
                    </div>
                </div>
            </div>

            {/* Letter Meta */}
            <div className="px-10 pt-6 pb-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Ref:</span>
                        <code className="text-xs font-mono text-foreground bg-muted px-2 py-0.5 rounded">
                            {reference || "—"}
                        </code>
                    </div>
                    <span className="text-sm text-foreground">{date}</span>
                </div>

                <Separator className="my-4" />

                {/* From / To / CC */}
                <div className="space-y-2.5 text-sm">
                    <div className="flex gap-3">
                        <span className="w-12 text-right text-muted-foreground font-medium text-xs uppercase tracking-wide pt-0.5">From:</span>
                        <span className="text-foreground">{from || "—"}</span>
                    </div>
                    <div className="flex gap-3">
                        <span className="w-12 text-right text-muted-foreground font-medium text-xs uppercase tracking-wide pt-0.5">To:</span>
                        <span className="text-foreground">{to || "—"}</span>
                    </div>
                    {cc && (
                        <div className="flex gap-3">
                            <span className="w-12 text-right text-muted-foreground font-medium text-xs uppercase tracking-wide pt-0.5">CC:</span>
                            <span className="text-foreground">{cc}</span>
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                {/* Subject */}
                <div className="mb-6">
                    <p className="text-sm">
                        <span className="font-semibold text-foreground">Subject: </span>
                        <span className="text-foreground underline underline-offset-2 decoration-foreground/30">
                            {subject || "—"}
                        </span>
                    </p>
                </div>

                {/* Body */}
                <div
                    className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed mb-8 min-h-[120px]
                    [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-3
                    [&_h2]:text-lg [&_h2]:font-bold [&_h2]:mb-2
                    [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-2
                    [&_blockquote]:border-l-4 [&_blockquote]:border-primary/30 [&_blockquote]:pl-4 [&_blockquote]:italic
                    [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:list-decimal [&_ol]:pl-6
                    [&_a]:text-primary [&_a]:underline"
                    dangerouslySetInnerHTML={{ __html: content || "<p style='color:#999'>Letter body will appear here...</p>" }}
                />

                {/* Signature Block */}
                <div className="mt-12 mb-6">
                    <p className="text-sm text-muted-foreground mb-1">Respectfully,</p>
                    <div className="mt-10 border-t border-dashed border-border pt-2 w-60">
                        <p className="text-sm font-semibold text-foreground">
                            {senderName || "________________"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {senderTitle || "Title / Position"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">{date}</p>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-muted/30 border-t border-border px-10 py-3">
                <p className="text-[10px] text-muted-foreground text-center">
                    Bole Debre Salem Medhanealem Cathedral — Felege Yordanos Sunday School — Addis Ababa, Ethiopia
                </p>
            </div>
        </div>
    )
}

// ──────────────────────────────────────────────
// Main Dialog
// ──────────────────────────────────────────────
export function NewLetterDialog({
    open,
    onOpenChange,
    onSubmit,
    existingReferences = [],
}: NewLetterDialogProps) {
    // Form state
    const [subject, setSubject] = useState("")
    const [from, setFrom] = useState("Felege Yordanos Sunday School")
    const [to, setTo] = useState("")
    const [cc, setCc] = useState("")
    const [department, setDepartment] = useState("")
    const [priority, setPriority] = useState("normal")
    const [content, setContent] = useState("")
    const [reference, setReference] = useState("")
    const [senderName, setSenderName] = useState("")
    const [senderTitle, setSenderTitle] = useState("")

    // UI state
    const [saving, setSaving] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [mode, setMode] = useState<"compose" | "preview">("compose")
    const [refGenerated, setRefGenerated] = useState(false)

    const currentDate = useMemo(() => {
        return new Date().toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        })
    }, [])

    const shortDate = useMemo(() => {
        return new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
    }, [])

    const resetForm = useCallback(() => {
        setSubject("")
        setFrom("Felege Yordanos Sunday School")
        setTo("")
        setCc("")
        setDepartment("")
        setPriority("normal")
        setContent("")
        setReference("")
        setSenderName("")
        setSenderTitle("")
        setMode("compose")
        setRefGenerated(false)
    }, [])

    // ─── Generate unique reference ───
    const handleGenerateReference = useCallback(() => {
        const deptCode = department ? department.slice(0, 3).toUpperCase() : "GEN"
        const ref = generateUniqueReference(deptCode, existingReferences)
        setReference(ref)
        setRefGenerated(true)
    }, [department, existingReferences])

    // ─── Save Draft ───
    const handleSaveDraft = useCallback(() => {
        setSaving(true)
        const ref = reference || (() => {
            const deptCode = department ? department.slice(0, 3).toUpperCase() : "GEN"
            return generateUniqueReference(deptCode, existingReferences)
        })()
        setTimeout(() => {
            const letter: Letter = {
                reference: ref,
                subject: subject || "Untitled Letter",
                department: department || "General",
                status: "Draft",
                date: shortDate,
                assigned: senderName || "You",
            }
            onSubmit?.(letter)
            resetForm()
            onOpenChange(false)
            setSaving(false)
        }, 600)
    }, [subject, department, reference, existingReferences, senderName, shortDate, onSubmit, resetForm, onOpenChange])

    // ─── Submit ───
    const handleSubmit = useCallback(() => {
        if (!subject.trim() || !department) return
        setSaving(true)
        const ref = reference || (() => {
            const deptCode = department.slice(0, 3).toUpperCase()
            return generateUniqueReference(deptCode, existingReferences)
        })()
        setTimeout(() => {
            const letter: Letter = {
                reference: ref,
                subject,
                department,
                status: "Pending",
                date: shortDate,
                assigned: senderName || "You",
            }
            onSubmit?.(letter)
            resetForm()
            onOpenChange(false)
            setSaving(false)
        }, 800)
    }, [subject, department, reference, existingReferences, senderName, shortDate, onSubmit, resetForm, onOpenChange])

    // ─── Print Preview ───
    const handlePrint = useCallback(() => {
        const printWindow = window.open("", "_blank")
        if (!printWindow) return
        printWindow.document.write(`
            <!DOCTYPE html>
            <html><head><title>${subject || "Letter"}</title>
            <style>
                body { font-family: 'Segoe UI', system-ui, Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto; }
                .letterhead { border-bottom: 2px solid #1a365d; padding-bottom: 12px; margin-bottom: 24px; }
                .letterhead h2 { margin: 0; color: #1a365d; }
                .letterhead p { margin: 2px 0; font-size: 12px; color: #666; }
                .meta { font-size: 13px; margin-bottom: 16px; }
                .meta .label { color: #666; font-weight: 600; width: 50px; display: inline-block; text-transform: uppercase; font-size: 11px; }
                .subject { font-weight: 600; text-decoration: underline; margin: 20px 0; }
                .body { line-height: 1.8; font-size: 14px; min-height: 200px; }
                .signature { margin-top: 60px; }
                .signature .line { border-top: 1px dashed #ccc; padding-top: 8px; width: 250px; }
                .footer { margin-top: 40px; border-top: 1px solid #eee; padding-top: 12px; font-size: 10px; color: #999; text-align: center; }
                hr { border: none; border-top: 1px solid #eee; margin: 16px 0; }
                @media print { body { padding: 20px; } }
            </style></head><body>
                <div class="letterhead">
                    <h2>ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት</h2>
                    <p>Felege Yordanos Sunday School</p>
                    <p>Bole Debre Salem Medhanealem Cathedral — Addis Ababa, Ethiopia</p>
                </div>
                <div class="meta">
                    <div><span class="label">Ref:</span> ${reference || "—"}</div>
                    <div><span class="label">Date:</span> ${currentDate}</div>
                </div>
                <hr />
                <div class="meta">
                    <div><span class="label">From:</span> ${from}</div>
                    <div><span class="label">To:</span> ${to || "—"}</div>
                    ${cc ? `<div><span class="label">CC:</span> ${cc}</div>` : ""}
                </div>
                <hr />
                <p class="subject">Subject: ${subject || "—"}</p>
                <div class="body">${content || ""}</div>
                <div class="signature">
                    <p>Respectfully,</p>
                    <div class="line">
                        <p><strong>${senderName || "________________"}</strong></p>
                        <p style="font-size:12px;color:#666">${senderTitle || "Title / Position"}</p>
                        <p style="font-size:12px;color:#666">${currentDate}</p>
                    </div>
                </div>
                <div class="footer">Bole Debre Salem Medhanealem Cathedral — Felege Yordanos Sunday School — Addis Ababa, Ethiopia</div>
            </body></html>
        `)
        printWindow.document.close()
        printWindow.print()
    }, [subject, reference, from, to, cc, content, senderName, senderTitle, currentDate])

    // ─── Copy reference ───
    const [refCopied, setRefCopied] = useState(false)
    const copyReference = useCallback(() => {
        if (reference) {
            navigator.clipboard.writeText(reference)
            setRefCopied(true)
            setTimeout(() => setRefCopied(false), 2000)
        }
    }, [reference])

    const priorityInfo = PRIORITY_OPTIONS.find((p) => p.value === priority)

    const dialogSizeClass = isFullscreen
        ? "max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] rounded-none"
        : "max-w-5xl max-h-[92vh]"

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${dialogSizeClass} overflow-hidden p-0 flex flex-col`}>
                {/* ═══════════════════ HEADER ═══════════════════ */}
                <div className="shrink-0 bg-card border-b border-border px-6 py-4">
                    <DialogHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <div>
                                    <DialogTitle className="text-lg font-bold">
                                        Compose New Letter
                                    </DialogTitle>
                                    <DialogDescription className="mt-0.5 text-xs">
                                        Draft a professional outgoing letter with formatting
                                    </DialogDescription>
                                </div>
                            </div>
                            <div className="flex items-center gap-1.5">
                                {/* Mode Toggle */}
                                <div className="flex items-center bg-muted rounded-lg p-0.5 mr-2">
                                    <button
                                        type="button"
                                        onClick={() => setMode("compose")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "compose"
                                            ? "bg-card text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Compose
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMode("preview")}
                                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${mode === "preview"
                                            ? "bg-card text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground"
                                            }`}
                                    >
                                        <Eye className="h-3.5 w-3.5" />
                                        Preview
                                    </button>
                                </div>

                                {/* Fullscreen Toggle */}
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
                                >
                                    {isFullscreen ? (
                                        <Minimize2 className="h-4 w-4" />
                                    ) : (
                                        <Maximize2 className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>
                    </DialogHeader>
                </div>

                {/* ═══════════════════ BODY ═══════════════════ */}
                <div className="flex-1 overflow-y-auto">
                    {mode === "compose" ? (
                        /* ━━━ COMPOSE MODE ━━━ */
                        <div className="px-6 py-5 flex flex-col gap-5">
                            {/* ── Reference Row ── */}
                            <div className="flex items-end gap-3 p-4 rounded-lg bg-muted/40 border border-border">
                                <div className="flex-1 flex flex-col gap-1.5">
                                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Reference Number
                                    </Label>
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={reference}
                                            readOnly
                                            placeholder="Click 'Generate' to create a unique reference"
                                            className="h-9 font-mono text-sm bg-card"
                                        />
                                        {reference && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-9 w-9 p-0 shrink-0"
                                                onClick={copyReference}
                                                title="Copy reference"
                                            >
                                                {refCopied ? (
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                ) : (
                                                    <Copy className="h-3.5 w-3.5" />
                                                )}
                                            </Button>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-9 gap-2 shrink-0"
                                    onClick={handleGenerateReference}
                                >
                                    <RefreshCw className={`h-3.5 w-3.5 ${refGenerated ? "" : "animate-none"}`} />
                                    {refGenerated ? "Regenerate" : "Generate"}
                                </Button>
                                {priorityInfo && (
                                    <Badge variant="outline" className={`shrink-0 text-[10px] px-2 py-1 ${priorityInfo.color}`}>
                                        {priorityInfo.label} Priority
                                    </Badge>
                                )}
                            </div>

                            {/* ── Subject & Priority ── */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-3 flex flex-col gap-1.5">
                                    <Label htmlFor="letter-subject" className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Subject *
                                    </Label>
                                    <Input
                                        id="letter-subject"
                                        placeholder="e.g. Annual Report Submission to Diocese"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        className="h-10"
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                        Priority
                                    </Label>
                                    <Select value={priority} onValueChange={setPriority}>
                                        <SelectTrigger className="h-10">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRIORITY_OPTIONS.map((p) => (
                                                <SelectItem key={p.value} value={p.value}>
                                                    <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${p.color}`}>
                                                        {p.label}
                                                    </Badge>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* ── From / To / CC / Department ── */}
                            <div className="rounded-lg border border-border bg-card overflow-hidden">
                                <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
                                    <span className="text-xs font-semibold text-muted-foreground">Letter Addressing</span>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            From
                                        </Label>
                                        <Input
                                            placeholder="Sender name / organization"
                                            value={from}
                                            onChange={(e) => setFrom(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            To *
                                        </Label>
                                        <Input
                                            placeholder="Recipient name / organization"
                                            value={to}
                                            onChange={(e) => setTo(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            CC (Optional)
                                        </Label>
                                        <Input
                                            placeholder="Carbon copy recipients"
                                            value={cc}
                                            onChange={(e) => setCc(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            Department *
                                        </Label>
                                        <Select value={department} onValueChange={setDepartment}>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Select department..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {DEPARTMENTS.map((dept) => (
                                                    <SelectItem key={dept} value={dept}>
                                                        {dept}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* ── Letter Body (Rich Text) ── */}
                            <div className="flex flex-col gap-1.5">
                                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                    Letter Body *
                                </Label>
                                <RichTextEditor
                                    value={content}
                                    onChange={setContent}
                                    placeholder="Compose your letter here. Use the toolbar above to format text professionally..."
                                    minHeight={isFullscreen ? "400px" : "260px"}
                                />
                            </div>

                            {/* ── Signature Block ── */}
                            <div className="rounded-lg border border-border bg-card overflow-hidden">
                                <div className="px-4 py-2.5 bg-muted/40 border-b border-border">
                                    <span className="text-xs font-semibold text-muted-foreground">Signature</span>
                                </div>
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            Sender Full Name
                                        </Label>
                                        <Input
                                            placeholder="e.g. Abebe Tesfaye"
                                            value={senderName}
                                            onChange={(e) => setSenderName(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            Title / Position
                                        </Label>
                                        <Input
                                            placeholder="e.g. Head of Education Department"
                                            value={senderTitle}
                                            onChange={(e) => setSenderTitle(e.target.value)}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                                <div className="px-4 pb-3 flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>Date:</span>
                                    <span className="font-medium text-foreground">{currentDate}</span>
                                    <span className="text-[10px] italic">(auto-set to today)</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* ━━━ PREVIEW MODE ━━━ */
                        <div className="px-6 py-6 bg-muted/20 min-h-full">
                            <div className="flex items-center justify-end gap-2 mb-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-xs"
                                    onClick={handlePrint}
                                >
                                    <Printer className="h-3.5 w-3.5" />
                                    Print / Export PDF
                                </Button>
                            </div>
                            <LetterPreview
                                reference={reference}
                                date={currentDate}
                                from={from}
                                to={to}
                                cc={cc}
                                subject={subject}
                                content={content}
                                senderName={senderName}
                                senderTitle={senderTitle}
                            />
                        </div>
                    )}
                </div>

                {/* ═══════════════════ FOOTER ═══════════════════ */}
                <div className="shrink-0 bg-card border-t border-border px-6 py-3">
                    <DialogFooter className="flex-row justify-between sm:justify-between gap-3">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Auto-save enabled
                            {reference && (
                                <>
                                    <Separator orientation="vertical" className="h-3 mx-1" />
                                    <code className="text-[10px] font-mono">{reference}</code>
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    resetForm()
                                    onOpenChange(false)
                                }}
                                disabled={saving}
                            >
                                Cancel
                            </Button>
                            {mode === "preview" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMode("compose")}
                                    className="gap-2"
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Back to Edit
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleSaveDraft}
                                disabled={saving}
                                className="gap-2"
                            >
                                {saving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Save className="h-3.5 w-3.5" />
                                )}
                                Save Draft
                            </Button>
                            <Button
                                type="button"
                                size="sm"
                                onClick={handleSubmit}
                                disabled={saving || !subject.trim() || !department}
                                className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                                {saving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                ) : (
                                    <Send className="h-3.5 w-3.5" />
                                )}
                                Submit for Approval
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    )
}
