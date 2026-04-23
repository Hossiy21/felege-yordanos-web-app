"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    ZoomIn,
    ZoomOut,
    X,
    FileText,
    Download,
    Loader2,
    Eye,
    Maximize2,
    ImageIcon,
    FileIcon,
    ExternalLink,
    AlertCircle,
    ShieldCheck
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

interface DocumentViewerModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    url: string
    title: string
    fileType: string
}

export function DocumentViewerModal({
    open,
    onOpenChange,
    url,
    title,
    fileType,
}: DocumentViewerModalProps) {
    const [zoom, setZoom] = useState(100)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)

    const isImage = fileType.startsWith('image/')
    const isPDF = fileType === 'application/pdf'

    const handleZoomIn = () => setZoom((prev) => Math.min(prev + 20, 200))
    const handleZoomOut = () => setZoom((prev) => Math.max(prev - 20, 50))

    const handleOpenChange = (newOpen: boolean) => {
        if (!newOpen) {
            setZoom(100)
            setLoading(true)
            setError(false)
        }
        onOpenChange(newOpen)
    }

    useEffect(() => {
        if (open && url) {
            setLoading(true)
            setError(false)
            console.log("Viewing URL:", url)
        }
    }, [url, open])

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="max-w-[95vw] w-[95vw] h-[92vh] flex flex-col p-0 gap-0 overflow-hidden bg-slate-950/95 border-slate-800 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[2.5rem] backdrop-blur-2xl">
                <DialogHeader className="sr-only">
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>Document Viewer for {title}</DialogDescription>
                </DialogHeader>

                {/* --- Top Navigation Bar --- */}
                <div className="flex items-center justify-between px-10 py-5 bg-slate-900/40 border-b border-white/5 backdrop-blur-md shrink-0 z-50">
                    <div className="flex items-center gap-5">
                        <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-2xl transition-transform hover:scale-110 duration-500 ${
                            isPDF ? 'bg-red-500/10 border-red-500/20 text-red-500 shadow-red-500/10' : 
                            isImage ? 'bg-blue-500/10 border-blue-500/20 text-blue-500 shadow-blue-500/10' : 
                            'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-emerald-500/10'
                        }`}>
                            {isPDF ? <FileText className="h-6 w-6" /> : 
                             isImage ? <ImageIcon className="h-6 w-6" /> : 
                             <FileIcon className="h-6 w-6" />}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <h3 className="text-base font-black text-white uppercase tracking-[0.1em] line-clamp-1 max-w-md">{title}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{fileType}</span>
                                <Separator orientation="vertical" className="h-3 bg-slate-800" />
                                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-1.5">
                                    <ShieldCheck className="h-3 w-3" /> Secure Node
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className="flex items-center gap-1 bg-slate-800/40 p-1.5 rounded-2xl border border-white/5 shadow-inner">
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl" onClick={handleZoomOut}><ZoomOut className="h-4 w-4" /></Button>
                            <div className="px-3 min-w-[60px] text-center">
                                <span className="text-xs font-black text-slate-200 tracking-widest">{zoom}%</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl" onClick={handleZoomIn}><ZoomIn className="h-4 w-4" /></Button>
                        </div>

                        <Separator orientation="vertical" className="h-8 bg-slate-800" />

                        <div className="flex items-center gap-2">
                            <Button 
                                asChild
                                variant="secondary" 
                                size="sm" 
                                className="h-11 px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white border-none font-black text-[10px] tracking-[0.2em] shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                            >
                                <a href={url} download>
                                    <Download className="h-4 w-4 mr-2" />
                                    DOWNLOAD
                                </a>
                            </Button>

                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-11 w-11 text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-500 transition-all rounded-2xl group"
                                onClick={() => handleOpenChange(false)}
                            >
                                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-300" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* --- Main Viewer Content --- */}
                <div className="flex-1 overflow-auto bg-slate-950 flex items-center justify-center p-12 scrollbar-thin scrollbar-thumb-slate-800 relative">
                    {/* Background Glow */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/5 via-transparent to-transparent pointer-events-none" />

                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-40 bg-slate-950/90 backdrop-blur-md">
                            <div className="relative">
                                <div className="h-24 w-24 rounded-full border-t-2 border-blue-600 animate-spin" />
                                <Loader2 className="h-10 w-10 text-blue-600 absolute inset-0 m-auto animate-pulse" />
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <p className="text-[10px] text-slate-400 uppercase tracking-[0.4em] font-black">Decrypting Payload</p>
                                <div className="h-1 w-40 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-600 animate-[loading_2s_infinite]" />
                                </div>
                            </div>
                        </div>
                    )}

                    <div 
                        className={`transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_50px_100px_rgba(0,0,0,0.6)] rounded-2xl overflow-hidden bg-white border border-white/10 ${error ? 'hidden' : 'block'}`}
                        style={{
                            transform: `scale(${zoom / 100})`,
                            maxHeight: '100%',
                            maxWidth: isPDF ? '1000px' : 'none',
                            width: isPDF ? '100%' : 'auto'
                        }}
                    >
                        {isPDF ? (
                            <div className="w-full h-[78vh] min-w-[850px] relative">
                                <iframe
                                    src={`${url}#toolbar=0&navpanes=0&scrollbar=1`}
                                    className="w-full h-full border-none"
                                    onLoad={() => setLoading(false)}
                                    onError={() => { setLoading(false); setError(true); }}
                                />
                            </div>
                        ) : isImage ? (
                            <img 
                                src={url} 
                                alt={title} 
                                className="max-h-[78vh] w-auto object-contain select-none"
                                onLoad={() => setLoading(false)}
                                onError={() => { setLoading(false); setError(true); }}
                            />
                        ) : (
                            <div className="p-32 text-center bg-slate-900 flex flex-col items-center gap-8">
                                <div className="w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center text-slate-600 border border-white/5">
                                    <FileIcon className="h-12 w-12 opacity-50" />
                                </div>
                                <div className="space-y-3">
                                    <p className="text-xl font-black text-white">ARCHIVE PREVIEW UNAVAILABLE</p>
                                    <p className="text-slate-500 max-w-xs mx-auto">This binary format requires local processing. Download the artifact to view its contents.</p>
                                </div>
                                <Button asChild className="h-14 px-10 rounded-2xl bg-blue-600 hover:bg-blue-500 font-black tracking-widest transition-all">
                                    <a href={url} download>DOWNLOAD ARTIFACT</a>
                                </Button>
                            </div>
                        )}
                    </div>
                    
                    {error && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-10 bg-slate-950 p-12 text-center">
                            <div className="w-32 h-32 bg-red-500/10 border border-red-500/20 rounded-[2.5rem] flex items-center justify-center text-red-500 shadow-2xl shadow-red-500/5 animate-pulse">
                                <AlertCircle className="h-16 w-16" />
                            </div>
                            <div className="space-y-4 max-w-md">
                                <h4 className="text-3xl font-black text-white">404 - ASSET MISSING</h4>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    The requested artifact could not be located in the MinIO Sovereign Storage. It may have been relocated or the link has expired.
                                </p>
                            </div>
                            <div className="flex gap-4">
                                <Button asChild variant="outline" className="h-14 px-10 rounded-2xl border-slate-800 hover:bg-slate-900 font-black tracking-widest">
                                    <a href={url} target="_blank">TRY DIRECT LINK</a>
                                </Button>
                                <Button variant="secondary" onClick={() => handleOpenChange(false)} className="h-14 px-10 rounded-2xl bg-white text-slate-900 font-black tracking-widest">
                                    BACK TO LIBRARY
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
                
                <style jsx global>{`
                    @keyframes loading {
                        0% { transform: translateX(-100%); }
                        100% { transform: translateX(300%); }
                    }
                    .scrollbar-hide::-webkit-scrollbar { display: none; }
                `}</style>
            </DialogContent>
        </Dialog>
    )
}
