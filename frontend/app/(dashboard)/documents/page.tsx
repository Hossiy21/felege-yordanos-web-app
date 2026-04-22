"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
    FileText, 
    Upload, 
    Trash2, 
    Plus, 
    Search,
    File,
    Clock,
    HardDrive,
    ExternalLink,
    Calendar,
    Edit2,
    Eye,
    MoreVertical,
    FileIcon,
    Download
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth-context"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface ChurchDocument {
    id: string
    title: string
    name: string
    file_type: string
    file_size: number
    url: string
    description: string
    document_date: string
    created_at: string
}

export default function DocumentsPage() {
    const { t } = useTranslation()
    const { user, token } = useAuth()
    
    const [documents, setDocuments] = useState<ChurchDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")

    // New state for form inputs
    const [newTitle, setNewTitle] = useState("")
    const [newDocDate, setNewDocDate] = useState(new Date().toISOString().split('T')[0])
    const [newDescription, setNewDescription] = useState("")

    // Edit state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingDoc, setEditingDoc] = useState<ChurchDocument | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDocDate, setEditDocDate] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    useEffect(() => {
        fetchDocuments()
    }, [])

    const fetchDocuments = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                const data = await res.json()
                setDocuments(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error("Failed to fetch documents", error)
            toast.error("Failed to load documents")
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!newTitle) {
            toast.error("Please enter a title for the document first.")
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', newTitle)
        formData.append('document_date', newDocDate)
        formData.append('description', newDescription || 'Church archive upload')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            })
            if (res.ok) {
                setNewTitle("")
                setNewDescription("")
                toast.success("Document uploaded successfully")
                fetchDocuments()
            } else {
                toast.error("Upload failed")
            }
        } catch (error) {
            console.error("Upload failed", error)
            toast.error("Upload failed due to network error")
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document from the library?")) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (res.ok) {
                setDocuments(docs => docs.filter(d => d.id !== id))
                toast.success("Document deleted")
            } else {
                toast.error("Delete failed")
            }
        } catch (error) {
            console.error("Delete failed", error)
            toast.error("Delete failed")
        }
    }

    const handleEditClick = (doc: ChurchDocument) => {
        setEditingDoc(doc)
        setEditTitle(doc.title || "")
        setEditDocDate(doc.document_date ? new Date(doc.document_date).toISOString().split('T')[0] : "")
        setEditDescription(doc.description || "")
        setIsEditDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingDoc) return
        setIsUpdating(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/${editingDoc.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    document_date: editDocDate
                })
            })
            if (res.ok) {
                toast.success("Document updated")
                setIsEditDialogOpen(false)
                fetchDocuments()
            } else {
                toast.error("Update failed")
            }
        } catch (error) {
            console.error("Update failed", error)
            toast.error("Update failed")
        } finally {
            setIsUpdating(false)
        }
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const filteredDocs = documents.filter(doc => 
        (doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
         doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                        Document Library
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
                        Manage church archives, sacred records, and digital assets with precision.
                    </p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex items-center gap-3 px-4">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-center justify-center text-blue-600">
                             <FileText className="h-5 w-5" />
                        </div>
                        <div>
                             <p className="text-[10px] uppercase tracking-widest font-black text-slate-400">Total Files</p>
                             <p className="text-xl font-bold text-slate-900 dark:text-white leading-none">{documents.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Upload Bar */}
            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-xl shadow-blue-500/5">
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center">
                            <Upload className="h-4 w-4" />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Quick Upload</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Document Title</Label>
                            <Input 
                                placeholder="e.g. Annual Budget 2026"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className="rounded-xl border-slate-200 h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Document Date</Label>
                            <Input 
                                type="date"
                                value={newDocDate}
                                onChange={(e) => setNewDocDate(e.target.value)}
                                className="rounded-xl border-slate-200 h-12"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-1">Brief Description</Label>
                            <Input 
                                placeholder="Add context..."
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className="rounded-xl border-slate-200 h-12"
                            />
                        </div>
                        <div>
                            <input
                                type="file"
                                id="doc-upload"
                                className="hidden"
                                onChange={handleUpload}
                                disabled={uploading}
                            />
                            <Button 
                                asChild 
                                disabled={!newTitle || uploading}
                                className={`w-full bg-[#003366] hover:bg-[#002244] text-white rounded-xl h-12 font-bold transition-all shadow-lg active:scale-95 ${(!newTitle || uploading) ? 'opacity-50 pointer-events-none' : ''}`}
                            >
                                <label htmlFor="doc-upload" className="cursor-pointer">
                                    {uploading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                    ) : (
                                        <Plus className="h-5 w-5 mr-2" />
                                    )}
                                    {uploading ? 'Processing...' : 'Upload Document'}
                                </label>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search Band */}
            <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 font-bold" />
                <Input
                    placeholder="Search by title, filename, or description..."
                    className="pl-14 h-16 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-3xl shadow-lg shadow-slate-200/20 text-lg transition-all focus:ring-4 focus:ring-blue-500/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Documents List */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className="h-64 bg-white dark:bg-slate-900 rounded-[2.5rem] animate-pulse border border-slate-100 dark:border-slate-800 shadow-sm" />
                    ))}
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 px-6 rounded-[3rem] bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 text-center shadow-inner">
                    <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-8">
                        <FileText className="h-12 w-12 text-slate-300" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">Library Archive Empty</h3>
                    <p className="text-slate-500 mt-3 max-w-sm mx-auto font-medium">
                        No records found matching your criteria. Start by building your digital sanctuary.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredDocs.map((doc) => (
                        <div 
                            key={doc.id} 
                            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-500 relative overflow-hidden"
                        >
                            <div className="flex items-start justify-between mb-6">
                                <div className="w-14 h-14 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                                    <FileIcon className="h-7 w-7" />
                                </div>
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                                        onClick={() => handleEditClick(doc)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50"
                                        onClick={() => handleDelete(doc.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 line-clamp-1 truncate group-hover:text-blue-600 transition-colors">
                                {doc.title || doc.name}
                            </h3>
                            <p className="text-[12px] text-slate-400 line-clamp-2 min-h-[36px] font-medium leading-relaxed mb-6">
                                {doc.description || doc.name}
                            </p>

                            <Separator className="my-6 bg-slate-50 dark:bg-slate-800" />

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1.5">
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                        <HardDrive className="h-3 w-3" />
                                        {formatBytes(doc.file_size)}
                                    </span>
                                    <span className="flex items-center gap-1.5 text-[10px] font-black text-[#003366] dark:text-[#FFB800] uppercase tracking-widest">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(doc.document_date || doc.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                                    </span>
                                </div>

                                <div className="flex gap-2">
                                    <Button 
                                        asChild
                                        size="icon"
                                        className="h-11 w-11 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                                            <Eye className="h-5 w-5" />
                                        </a>
                                    </Button>
                                    <Button 
                                        asChild
                                        size="icon"
                                        className="h-11 w-11 bg-[#003366] dark:bg-blue-600 text-white rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-lg"
                                    >
                                        <a href={doc.url} download>
                                            <Download className="h-5 w-5" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[500px] rounded-[2rem] p-8">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-black">Edit Document Metadata</DialogTitle>
                        <DialogDescription>
                            Refine the record details. Changes are applied across the entire system.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-6 py-6">
                        <div className="grid gap-2">
                            <Label htmlFor="title" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Title</Label>
                            <Input
                                id="title"
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="date" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Document Date</Label>
                            <Input
                                id="date"
                                type="date"
                                value={editDocDate}
                                onChange={(e) => setEditDocDate(e.target.value)}
                                className="rounded-xl border-slate-200"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                            <Textarea
                                id="description"
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                className="rounded-xl border-slate-200 min-h-[100px]"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditDialogOpen(false)}
                            className="rounded-xl h-11 px-6 font-bold"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleUpdate} 
                            disabled={isUpdating}
                            className="bg-[#003366] hover:bg-[#002244] text-white rounded-xl h-11 px-8 font-bold shadow-lg transition-all active:scale-95"
                        >
                            {isUpdating ? "Saving Changes..." : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
