"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, RotateCw, Download, Loader2, AlertCircle, X } from "lucide-react"

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
      <DialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 gap-0">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <div className="flex flex-col gap-0.5 pr-8">
            <DialogTitle className="text-base font-semibold text-foreground">
              {title}
            </DialogTitle>
            <p className="text-xs font-mono text-muted-foreground">{reference}</p>
          </div>
        </DialogHeader>

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border shrink-0">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-xs font-medium text-muted-foreground min-w-[48px] text-center">
              {zoom}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <div className="w-px h-5 bg-border mx-1" />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleReset}
              aria-label="Reset zoom"
            >
              <RotateCw className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 gap-2 text-xs"
              asChild
            >
              <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                <Download className="h-3.5 w-3.5" />
                Download
              </a>
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-muted/30 relative">
          {loading && !error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10 bg-background/80">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Loading document...</p>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10">
              <AlertCircle className="h-8 w-8 text-destructive" />
              <p className="text-sm font-medium text-foreground">Failed to load document</p>
              <p className="text-xs text-muted-foreground">The PDF could not be rendered. Try downloading instead.</p>
              <Button variant="outline" size="sm" className="gap-2 mt-2" asChild>
                <a href={pdfUrl} download target="_blank" rel="noopener noreferrer">
                  <Download className="h-3.5 w-3.5" />
                  Download PDF
                </a>
              </Button>
            </div>
          )}

          <div
            className="flex justify-center p-4 min-h-full"
            style={{
              transform: `scale(${zoom / 100})`,
              transformOrigin: "top center",
              transition: "transform 0.2s ease",
            }}
          >
            <iframe
              src={`${pdfUrl}#toolbar=0&navpanes=0`}
              className="w-full max-w-3xl bg-card rounded shadow-sm border border-border"
              style={{ height: "calc(90vh - 140px)", minHeight: "500px" }}
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
