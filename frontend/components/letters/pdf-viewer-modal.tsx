"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  Loader2,
  AlertCircle,
  X,
  FileText,
  Info,
  History,
  Sparkles,
  Printer,
  Share2,
  Maximize2,
  CheckCircle2,
  Clock,
  User
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface PdfViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfUrl: string
  title: string
  reference: string
  onEdit?: () => void
  onDelete?: () => void
}

export function PdfViewerModal({
  open,
  onOpenChange,
  pdfUrl,
  title,
  reference,
}: PdfViewerModalProps) {
  const [zoom, setZoom] = useState(100)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50))
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)
  const handleReset = () => {
    setZoom(100)
    setRotation(0)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setZoom(100)
      setRotation(0)
      setLoading(true)
      setError(false)
    }
    onOpenChange(newOpen)
  }

  useEffect(() => {
    if (open && loading) {
      const timer = setTimeout(() => {
        setLoading(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [open, loading])

  useEffect(() => {
    if (open && pdfUrl) {
      setLoading(true)
      setError(false)
    }
  }, [pdfUrl, open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-[#0a0a0b] border-zinc-800/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-2xl">

        {/* ──────────────────────────────────────────────
                    TOP NAVIGATION BAR
                ────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-3 bg-[#111113] border-b border-white/5 shrink-0 z-50">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 rounded-lg bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
              <FileText className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-zinc-100 uppercase tracking-wide leading-none">{title}</h3>
              </div>
              <p className="text-[10px] font-mono text-zinc-500 tracking-[0.2em]">{reference}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/5 mr-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
              <span className="text-[11px] font-mono text-zinc-400 min-w-[40px] text-center">{zoom}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-400 hover:text-white" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
            </div>

            <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />





            <Separator orientation="vertical" className="h-6 bg-white/10 mx-1" />

            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-500 hover:text-white transition-colors"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden relative">

          {/* ──────────────────────────────────────────────
                        MAIN DOCUMENT VIEWER
                    ────────────────────────────────────────────── */}
          <div className={`flex-1 flex flex-col bg-[#0a0a0b] relative transition-all duration-500 ease-in-out`}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-900/20 via-transparent to-transparent pointer-events-none" />

            <div className="flex-1 overflow-auto flex justify-center p-6 sm:p-12 scrollbar-hide">
              {loading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 z-40 bg-[#0a0a0b]/80 backdrop-blur-xl">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-t-2 border-emerald-500 animate-spin" />
                    <Loader2 className="h-8 w-8 text-emerald-500 absolute inset-0 m-auto animate-pulse" />
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <p className="text-[11px] text-zinc-500 uppercase tracking-[0.3em] font-bold">Initializing Engine</p>
                    <div className="h-1 w-32 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 animate-[loading_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
              )}

              <div
                className="transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_30px_90px_rgba(0,0,0,0.8)] border border-white/5 rounded-lg overflow-hidden flex-1"
                style={{
                  transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                  width: '100%',
                  maxWidth: '1200px',
                  height: '100%',
                  minHeight: '80vh'
                }}
              >
                <BlobPdfViewer
                  pdfUrl={pdfUrl}
                  onLoad={() => setLoading(false)}
                  onError={() => { setLoading(false); setError(true) }}
                />
              </div>
            </div>

            {/* Floating Action Buttons */}

          </div>


        </div>
      </DialogContent>

      <style jsx global>{`
                @keyframes loading {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(300%); }
                }
            `}</style>
    </Dialog>
  )
}



function BlobPdfViewer({
  pdfUrl,
  onLoad,
  onError,
}: {
  pdfUrl: string
  onLoad: () => void
  onError: () => void
}) {
  const cleanUrl = `${pdfUrl}#toolbar=0&navpanes=0&scrollbar=1`

  return (
    <object
      data={cleanUrl}
      type="application/pdf"
      className="w-full h-full"
      onLoad={onLoad}
      onError={onError}
    >
      <embed
        src={cleanUrl}
        type="application/pdf"
        className="w-full h-full"
        onLoad={onLoad}
      />
    </object>
  )
}
