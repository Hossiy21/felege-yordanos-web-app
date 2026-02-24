"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Download, Loader2, AlertCircle, X, FileText } from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface PdfViewerModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  pdfUrl: string
  title: string
  reference: string
}

export function PdfViewerModal({
  open,
  onOpenChange,
  pdfUrl,
  title,
  reference,
}: PdfViewerModalProps) {
  const [zoom, setZoom] = useState(100)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200))
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50))
  const handleReset = () => {
    setZoom(100)
  }

  const handleLoad = () => {
    setLoading(false)
    setError(false)
  }

  const handleError = () => {
    setLoading(false)
    setError(true)
  }

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setZoom(100)
      setLoading(true)
      setError(false)
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[95vh] flex flex-col p-0 gap-0 overflow-hidden bg-zinc-950 border-zinc-800">

        {/* Header - Dark Theme */}
        <div className="flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0 text-zinc-100">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="h-8 w-8 rounded bg-zinc-800 flex items-center justify-center shrink-0">
              <FileText className="h-4 w-4 text-emerald-500" />
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <h3 className="text-sm font-semibold truncate leading-none">{title}</h3>
              <p className="text-[10px] font-mono text-zinc-400 truncate">{reference}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 pl-4">
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 h-8 w-8 rounded-full"
              onClick={() => handleOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800/50 shrink-0 backdrop-blur-sm">
          <div className="flex items-center gap-1 bg-zinc-900 rounded-md border border-zinc-800 p-0.5 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </Button>
            <span className="text-[10px] font-mono font-medium text-zinc-300 min-w-[40px] text-center select-none">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </Button>
            <Separator orientation="vertical" className="h-4 mx-1 bg-zinc-700" />
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
              onClick={handleReset}
            >
              <RotateCw className="h-3.5 w-3.5" />
            </Button>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-2 text-xs bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            asChild
          >
            <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
              <Download className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
          </Button>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-zinc-950 relative flex justify-center p-8">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-zinc-950/80 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
              <p className="text-sm text-zinc-400">Loading document...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 p-4 text-center">
              <div className="bg-red-500/10 p-4 rounded-full">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <p className="text-sm font-medium text-zinc-200">Failed to load document</p>
              <Button variant="outline" size="sm" className="gap-2 mt-2" asChild>
                <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </a>
              </Button>
            </div>
          )}

          <div
            className="shadow-2xl transition-transform duration-200 ease-out origin-top"
            style={{
              transform: `scale(${zoom / 100})`,
              width: '100%',
              maxWidth: '800px',
            }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full bg-white min-h-[1100px] border-none"
              title={`PDF: ${title}`}
              onLoad={handleLoad}
              onError={handleError}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
