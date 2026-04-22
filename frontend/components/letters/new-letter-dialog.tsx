"use client"

import { useState, useCallback, useMemo, useEffect } from "react"
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
import QRCode from "qrcode"
import type { Letter } from "@/components/letters/letter-table"

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
interface NewLetterDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    /** Called after a successful save — page should refresh its list */
    onSubmit?: () => void
    existingReferences?: string[]
    /** When provided the dialog opens in edit mode */
    initialData?: Letter | null
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
    signatureUrl,
    stampUrl,
    qrCodeUrl,
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
    signatureUrl?: string
    stampUrl?: string
    qrCodeUrl?: string
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
                <div className="mt-12 mb-6 flex items-end justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">Respectfully,</p>
                        <div className="mt-10 border-t border-dashed border-border pt-2 w-60 relative">
                            {/* Stamp */}
                            {stampUrl && (
                                <img src={stampUrl} alt="Stamp" className="absolute -top-16 left-6 w-24 h-24 object-contain opacity-80 mix-blend-multiply pointer-events-none" />
                            )}
                            {/* Signature */}
                            {signatureUrl && (
                                <img src={signatureUrl} alt="Signature" className="absolute bottom-8 left-2 w-32 h-16 object-contain pointer-events-none" />
                            )}
                            <p className="text-sm font-semibold text-foreground relative z-10 pt-4">
                                {senderName || "________________"}
                            </p>
                            <p className="text-xs text-muted-foreground relative z-10">
                                {senderTitle || "Title / Position"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1 relative z-10">{date}</p>
                        </div>
                    </div>

                    {/* QR Code */}
                    {qrCodeUrl && (
                        <div className="flex flex-col items-center gap-1 opacity-80">
                            <img src={qrCodeUrl} alt="Verification QR" className="w-20 h-20 mix-blend-multiply border border-border/50 p-1 bg-white rounded-md" />
                            <span className="text-[8px] text-muted-foreground uppercase tracking-wider font-semibold">Scan to Verify</span>
                        </div>
                    )}
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
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export function NewLetterDialog({
    open,
    onOpenChange,
    onSubmit,
    existingReferences = [],
    initialData,
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
    const [signatureUrl, setSignatureUrl] = useState("")
    const [stampUrl, setStampUrl] = useState("")
    const [qrCodeUrl, setQrCodeUrl] = useState("")

    // Helper for file uploads to base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setter(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

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

    // Pre-populate form when editing an existing letter
    useEffect(() => {
        if (open && initialData) {
            setSubject(initialData.subject || "")
            setDepartment(initialData.department || "")
            setReference(initialData.reference || "")
            setSenderName(initialData.assigned || "")
            setRefGenerated(!!initialData.reference)
        }
    }, [open, initialData])

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
        setSignatureUrl("")
        setStampUrl("")
        setQrCodeUrl("")
        setMode("compose")
        setRefGenerated(false)
    }, [])

    // ─── Generate unique reference ───
    const handleGenerateReference = useCallback(async () => {
        const deptCode = department ? department.slice(0, 3).toUpperCase() : "GEN"
        const ref = generateUniqueReference(deptCode, existingReferences)
        setReference(ref)
        setRefGenerated(true)

        // Generate QR code for verification
        try {
            const qrData = await QRCode.toDataURL(`${API_BASE}/verify?ref=${encodeURIComponent(ref)}`, { margin: 1, width: 150 })
            setQrCodeUrl(qrData)
        } catch (err) {
            console.error("QR Code Error:", err)
        }
    }, [department, existingReferences])

    // ─── Shared API call ───
    const saveToBackend = useCallback(async (status: "draft" | "pending") => {
        setSaving(true)
        try {
            const ref = reference || (() => {
                const deptCode = department ? department.slice(0, 3).toUpperCase() : "GEN"
                return generateUniqueReference(deptCode, existingReferences)
            })()

            const isEdit = !!initialData?.id
            const url = isEdit
                ? `${API_BASE}/api/letter/letters/${initialData!.id}`
                : `${API_BASE}/api/letter/letters`
            const method = isEdit ? "PUT" : "POST"

            const formData = new FormData()
            formData.append("reference_number", ref)
            formData.append("letter_type", "outgoing")
            formData.append("subject", subject || "Untitled Letter")
            formData.append("department_name", department || "General")
            formData.append("status", status)

            if (status === "pending") {
                try {
                    const html2pdfModule = await import("html2pdf.js" as any)
                    const html2pdf = html2pdfModule.default || html2pdfModule

                    const htmlString = `
                        <div style="font-family: 'Segoe UI', system-ui, Arial, sans-serif; padding: 40px; color: #1a1a1a; max-width: 800px; margin: 0 auto;">
                            <div style="border-bottom: 2px solid #1a365d; padding-bottom: 12px; margin-bottom: 24px;">
                                <h2 style="margin: 0; color: #1a365d;">ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት</h2>
                                <p style="margin: 2px 0; font-size: 12px; color: #666;">Felege Yordanos Sunday School</p>
                                <p style="margin: 2px 0; font-size: 12px; color: #666;">Bole Debre Salem Medhanealem Cathedral — Addis Ababa, Ethiopia</p>
                            </div>
                            <div style="font-size: 13px; margin-bottom: 16px;">
                                <div><span style="color: #666; font-weight: 600; width: 50px; display: inline-block; text-transform: uppercase; font-size: 11px;">Ref:</span> ${ref}</div>
                                <div><span style="color: #666; font-weight: 600; width: 50px; display: inline-block; text-transform: uppercase; font-size: 11px;">Date:</span> ${currentDate}</div>
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
                            <div style="font-size: 13px; margin-bottom: 16px;">
                                <div><span style="color: #666; font-weight: 600; width: 50px; display: inline-block; text-transform: uppercase; font-size: 11px;">From:</span> ${from}</div>
                                <div><span style="color: #666; font-weight: 600; width: 50px; display: inline-block; text-transform: uppercase; font-size: 11px;">To:</span> ${to || "—"}</div>
                                ${cc ? `<div><span style="color: #666; font-weight: 600; width: 50px; display: inline-block; text-transform: uppercase; font-size: 11px;">CC:</span> ${cc}</div>` : ""}
                            </div>
                            <hr style="border: none; border-top: 1px solid #eee; margin: 16px 0;" />
                            <p style="font-weight: 600; text-decoration: underline; margin: 20px 0;">Subject: ${subject || "—"}</p>
                            <div style="line-height: 1.8; font-size: 14px; min-height: 200px;">${content || ""}</div>
                            
                            <div style="margin-top: 60px; display: flex; align-items: flex-end; justify-content: space-between;">
                                <div>
                                    <p>Respectfully,</p>
                                    <div style="border-top: 1px dashed #ccc; padding-top: 8px; width: 250px; position: relative; margin-top: 30px;">
                                        ${stampUrl ? `<img src="${stampUrl}" style="position: absolute; top: -60px; left: 24px; width: 90px; height: 90px; object-fit: contain; opacity: 0.8; mix-blend-mode: multiply;" />` : ''}
                                        ${signatureUrl ? `<img src="${signatureUrl}" style="position: absolute; bottom: 30px; left: 8px; width: 120px; height: 60px; object-fit: contain;" />` : ''}
                                        <p style="position: relative; z-index: 10; margin-top: 15px; font-weight: 600;"><strong>${senderName || "________________"}</strong></p>
                                        <p style="font-size:12px;color:#666; position: relative; z-index: 10; margin: 2px 0;">${senderTitle || "Title / Position"}</p>
                                        <p style="font-size:12px;color:#666; position: relative; z-index: 10; margin: 2px 0;">${currentDate}</p>
                                    </div>
                                </div>
                                ${qrCodeUrl ? `
                                    <div style="text-align: center; opacity: 0.8;">
                                        <img src="${qrCodeUrl}" style="width: 80px; height: 80px; border: 1px solid #ddd; padding: 4px; border-radius: 4px; mix-blend-mode: multiply;" />
                                        <div style="font-size: 8px; color: #666; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-top: 4px;">Verify</div>
                                    </div>
                                ` : ''}
                            </div>
                            <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 12px; font-size: 10px; color: #999; text-align: center;">
                                Bole Debre Salem Medhanealem Cathedral — Felege Yordanos Sunday School — Addis Ababa, Ethiopia
                            </div>
                        </div>
                    `

                    const element = document.createElement("div")
                    element.innerHTML = htmlString

                    const opt = {
                        margin: 10,
                        filename: 'letter.pdf',
                        image: { type: 'jpeg', quality: 0.98 },
                        html2canvas: { scale: 2 },
                        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                    }

                    const pdfBlob = await html2pdf().set(opt).from(element).outputPdf('blob')
                    const safeRef = ref.replace(/[\/\\]/g, '-')
                    formData.append("pdf", new File([pdfBlob], `${safeRef}.pdf`, { type: 'application/pdf' }))
                } catch (pdfErr) {
                    console.error("Failed to generate PDF:", pdfErr)
                    const { toast } = await import("sonner")
                    toast.warning("Letter saved, but PDF generation failed.")
                }
            }

            const res = await fetch(url, {
                method,
                body: formData,
                credentials: "include",
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || `Server returned ${res.status}`)
            }

            onSubmit?.()
            resetForm()
            onOpenChange(false)
        } catch (err: any) {
            console.error("Save letter failed:", err)
            // Surface error via a toast — sonner is already set up in the project
            const { toast } = await import("sonner")
            toast.error(err.message || "Failed to save letter. Please try again.")
        } finally {
            setSaving(false)
        }
    }, [reference, department, subject, existingReferences, initialData, onSubmit, resetForm, onOpenChange])

    // ─── Save Draft ───
    const handleSaveDraft = useCallback(() => {
        saveToBackend("draft")
    }, [saveToBackend])

    // ─── Submit for Approval ───
    const handleSubmit = useCallback(() => {
        if (!subject.trim() || !department) return
        saveToBackend("pending")
    }, [subject, department, saveToBackend])

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
                <div class="signature" style="display: flex; align-items: flex-end; justify-content: space-between;">
                    <div>
                        <p>Respectfully,</p>
                        <div class="line" style="position: relative; margin-top: 30px;">
                            ${stampUrl ? `<img src="${stampUrl}" style="position: absolute; top: -60px; left: 24px; width: 90px; height: 90px; object-fit: contain; opacity: 0.8; mix-blend-mode: multiply;" />` : ''}
                            ${signatureUrl ? `<img src="${signatureUrl}" style="position: absolute; bottom: 30px; left: 8px; width: 120px; height: 60px; object-fit: contain;" />` : ''}
                            <p style="position: relative; z-index: 10; margin-top: 15px;"><strong>${senderName || "________________"}</strong></p>
                            <p style="font-size:12px;color:#666; position: relative; z-index: 10;">${senderTitle || "Title / Position"}</p>
                            <p style="font-size:12px;color:#666; position: relative; z-index: 10;">${currentDate}</p>
                        </div>
                    </div>
                    ${qrCodeUrl ? `
                        <div style="text-align: center; opacity: 0.8;">
                            <img src="${qrCodeUrl}" style="width: 80px; height: 80px; border: 1px solid #ddd; padding: 4px; border-radius: 4px; mix-blend-mode: multiply;" />
                            <div style="font-size: 8px; color: #666; text-transform: uppercase; font-weight: 600; letter-spacing: 1px; margin-top: 4px;">Verify</div>
                        </div>
                    ` : ''}
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
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            Digital Stamp (Optional)
                                        </Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setStampUrl)}
                                            className="h-9 cursor-pointer file:text-sm"
                                        />
                                        {stampUrl && <span className="text-[10px] text-emerald-600 font-medium">Stamp attached ✓</span>}
                                    </div>
                                    <div className="flex flex-col gap-1.5">
                                        <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                                            Digital Signature (Optional)
                                        </Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => handleImageUpload(e, setSignatureUrl)}
                                            className="h-9 cursor-pointer file:text-sm"
                                        />
                                        {signatureUrl && <span className="text-[10px] text-emerald-600 font-medium">Signature attached ✓</span>}
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
                                signatureUrl={signatureUrl}
                                stampUrl={stampUrl}
                                qrCodeUrl={qrCodeUrl}
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
