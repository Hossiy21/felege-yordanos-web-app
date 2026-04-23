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
    Calendar,
    Edit2,
    Eye,
    FileIcon,
    MoreHorizontal,
    ArrowUpRight,
    CloudUpload,
    ImageIcon,
    Loader2,
    X,
    CheckCircle2,
    Library,
    Clock,
    AlertCircle,
    Maximize2,
    MoreVertical,
    FolderOpen,
    Sparkles,
    ShieldCheck,
    LayoutGrid,
    List,
    ArrowUpDown,
    SortAsc,
    SortDesc
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { useAuth } from "@/lib/auth-context"
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { DocumentViewerModal } from "@/components/documents/document-viewer-modal"
import { 
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const PREDEFINED_CATEGORIES = [
    "Manuscript",
    "Financial",
    "Liturgical",
    "Legal",
    "Administrative",
    "History",
    "General",
    "Other"
]

interface ChurchDocument {
    id: string
    title: string
    name: string
    file_type: string
    file_size: number
    url: string
    description: string
    category: string
    document_date: string
    created_at: string
}

export default function DocumentsPage() {
    const { t } = useTranslation()
    const { user } = useAuth()
    
    const [documents, setDocuments] = useState<ChurchDocument[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedCategory, setSelectedCategory] = useState<string>("All")
    const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Upload Modal State
    const [isUploadOpen, setIsUploadOpen] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [newTitle, setNewTitle] = useState("")
    const [newDocDate, setNewDocDate] = useState(new Date().toISOString().split('T')[0])
    const [newDescription, setNewDescription] = useState("")
    const [newCategory, setNewCategory] = useState("Uncategorized")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    // Edit state
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
    const [editingDoc, setEditingDoc] = useState<ChurchDocument | null>(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDocDate, setEditDocDate] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editCategory, setEditCategory] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)

    // Viewer state
    const [isViewerOpen, setIsViewerOpen] = useState(false)
    const [viewingDoc, setViewingDoc] = useState<ChurchDocument | null>(null)

    useEffect(() => {
        fetchDocuments()
    }, [])

    const fetchDocuments = async () => {
        setIsLoading(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/`, {
                credentials: 'include'
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

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            if (!newTitle) {
                const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, ' ')
                setNewTitle(cleanName)
            }
        }
    }

    const handleUpload = async () => {
        if (!selectedFile || !newTitle) {
            toast.error("Please provide both a title and a file.")
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)
        formData.append('title', newTitle)
        formData.append('document_date', newDocDate)
        formData.append('category', newCategory)
        formData.append('description', newDescription || 'Church archive upload')

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/upload`, {
                method: 'POST',
                credentials: 'include',
                body: formData
            })
            if (res.ok) {
                toast.success("Document added to library")
                setIsUploadOpen(false)
                resetUploadForm()
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

    const resetUploadForm = () => {
        setNewTitle("")
        setNewDescription("")
        setNewCategory("Uncategorized")
        setNewDocDate(new Date().toISOString().split('T')[0])
        setSelectedFile(null)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this document?")) return

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            })
            if (res.ok) {
                setDocuments(docs => docs.filter(d => d.id !== id))
                toast.success("Document removed")
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
        setEditCategory(doc.category || "Uncategorized")
        setIsEditDialogOpen(true)
    }

    const handleUpdate = async () => {
        if (!editingDoc) return
        setIsUpdating(true)
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/documents/${editingDoc.id}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: editTitle,
                    description: editDescription,
                    category: editCategory,
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

    const handleViewClick = (doc: ChurchDocument) => {
        let viewerUrl = doc.url
        if (!viewerUrl) {
            toast.error("Document path is missing")
            return
        }
        if (!viewerUrl.startsWith('http')) {
            const baseUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/storage/church-documents`
            const fileName = viewerUrl.startsWith('/') ? viewerUrl.slice(1) : viewerUrl
            viewerUrl = `${baseUrl}/${fileName}`
        } else if (viewerUrl.includes(':9000')) {
            viewerUrl = viewerUrl.replace(/http:\/\/.*:9000/, `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/storage`)
        } else if (viewerUrl.includes('/storage/') && !viewerUrl.includes('/api/storage/')) {
            viewerUrl = viewerUrl.replace('/storage/', '/api/storage/')
        }
        const urlParts = viewerUrl.split('/')
        const lastPart = urlParts.pop() || ""
        viewerUrl = [...urlParts, encodeURIComponent(lastPart)].join('/')
        setViewingDoc({ ...doc, url: viewerUrl })
        setIsViewerOpen(true)
    }

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const categories = ["All", ...Array.from(new Set(documents.map(d => d.category || "Uncategorized")))]

    const filteredDocs = documents
        .filter(doc => {
            const matchesSearch = (doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                   doc.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                  doc.description?.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesCategory = selectedCategory === "All" || (doc.category || "Uncategorized") === selectedCategory
            return matchesSearch && matchesCategory
        })
        .sort((a, b) => {
            let comparison = 0
            if (sortBy === 'date') {
                comparison = new Date(a.document_date || a.created_at).getTime() - new Date(b.document_date || b.created_at).getTime()
            } else if (sortBy === 'name') {
                comparison = (a.title || a.name).localeCompare(b.title || b.name)
            } else if (sortBy === 'size') {
                comparison = a.file_size - b.file_size
            }
            return sortOrder === 'desc' ? -comparison : comparison
        })

    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Documents</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and archive church manuscripts and official records.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-muted p-1 rounded-lg">
                        <Button 
                            variant={viewMode === 'grid' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setViewMode('grid')}
                            title="Grid View"
                        >
                            <LayoutGrid className="h-4 w-4" />
                        </Button>
                        <Button 
                            variant={viewMode === 'list' ? 'secondary' : 'ghost'} 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setViewMode('list')}
                            title="List View"
                        >
                            <List className="h-4 w-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 h-10">
                                <ArrowUpDown className="h-4 w-4" />
                                <span className="hidden sm:inline">Sort by {sortBy.charAt(0).toUpperCase() + sortBy.slice(1)}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => setSortBy('date')} className="justify-between">
                                Date {sortBy === 'date' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('name')} className="justify-between">
                                Name {sortBy === 'name' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setSortBy('size')} className="justify-between">
                                Size {sortBy === 'size' && <CheckCircle2 className="h-4 w-4 text-primary" />}
                            </DropdownMenuItem>
                            <Separator className="my-1" />
                            <DropdownMenuItem onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')} className="gap-2">
                                {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                                {sortOrder === 'asc' ? 'Ascending' : 'Descending'}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-2 h-10">
                                <Library className="h-4 w-4" />
                                <span className="hidden sm:inline">{selectedCategory}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 max-h-[300px] overflow-y-auto">
                            {categories.map(cat => (
                                <DropdownMenuItem key={cat} onClick={() => setSelectedCategory(cat)} className="justify-between">
                                    {cat} {selectedCategory === cat && <CheckCircle2 className="h-4 w-4 text-primary" />}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search documents..."
                            className="pl-9 h-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Button onClick={() => setIsUploadOpen(true)} className="h-10">
                        <Plus className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">Add Document</span>
                        <span className="sm:hidden">Add</span>
                    </Button>
                </div>
            </div>

            {/* Document Grid / List */}
            {isLoading ? (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                    {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                        <div key={i} className={`${viewMode === 'grid' ? "h-[200px]" : "h-[72px]"} bg-muted animate-pulse rounded-xl border`} />
                    ))}
                </div>
            ) : filteredDocs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center border rounded-xl bg-slate-50/50 dark:bg-slate-900/20">
                    <FolderOpen className="h-10 w-10 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold">No documents found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by uploading a new document to the archive.
                    </p>
                </div>
            ) : (
                <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                    {filteredDocs.map((doc) => (
                        <div 
                            key={doc.id} 
                            className={`group flex bg-card border text-card-foreground shadow-sm rounded-xl overflow-hidden hover:shadow-md transition-shadow cursor-pointer ${viewMode === 'grid' ? 'flex-col' : 'flex-row items-center p-4'}`}
                            onClick={() => handleViewClick(doc)}
                        >
                            {viewMode === 'grid' ? (
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="p-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                                            <FileText className="h-6 w-6" />
                                        </div>
                                        <Badge variant="secondary" className="text-[10px] uppercase tracking-tighter">
                                            {doc.category || "Uncategorized"}
                                        </Badge>
                                        <div onClick={(e) => e.stopPropagation()}>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(doc); }}>
                                                        <Edit2 className="h-4 w-4 mr-2" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>
                                                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </div>
                                    <h3 className="font-semibold text-base line-clamp-1 mb-1 group-hover:text-primary transition-colors">
                                        {doc.title || doc.name}
                                    </h3>
                                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                        {doc.description || "No description provided."}
                                    </p>
                                    <div className="mt-auto flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                                        <span className="flex items-center">
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {new Date(doc.document_date || doc.created_at).toLocaleDateString()}
                                        </span>
                                        <span>{formatBytes(doc.file_size)}</span>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg mr-4 shrink-0">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0 flex items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
                                                {doc.title || doc.name}
                                            </h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[9px] h-4 py-0 leading-none">
                                                    {doc.category || "Uncategorized"}
                                                </Badge>
                                                <p className="text-sm text-muted-foreground truncate">
                                                    {doc.description || "No description provided."}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground whitespace-nowrap shrink-0">
                                            <span className="flex items-center w-28">
                                                <Calendar className="h-3 w-3 mr-2" />
                                                {new Date(doc.document_date || doc.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="w-20 text-right">{formatBytes(doc.file_size)}</span>
                                        </div>
                                    </div>
                                    <div className="ml-4 shrink-0" onClick={(e) => e.stopPropagation()}>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditClick(doc); }}>
                                                    <Edit2 className="h-4 w-4 mr-2" /> Edit
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={(e) => { e.stopPropagation(); handleDelete(doc.id); }}>
                                                    <Trash2 className="h-4 w-4 mr-2" /> Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Standard Upload Modal */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogTitle>Upload Document</DialogTitle>
                    <div className="space-y-6 py-4">
                        <div className="space-y-2">
                            <Label>File</Label>
                            <div className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center ${selectedFile ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-accent/50'}`}>
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center w-full">
                                    <Upload className={`h-8 w-8 mb-2 ${selectedFile ? 'text-primary' : 'text-muted-foreground'}`} />
                                    <span className="font-medium text-sm">
                                        {selectedFile ? selectedFile.name : "Click or drag file to upload"}
                                    </span>
                                    <span className="text-xs text-muted-foreground mt-1">
                                        {selectedFile ? formatBytes(selectedFile.size) : "PDF, Images up to 50MB"}
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                placeholder="Enter document title"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Input
                                    type="date"
                                    value={newDocDate}
                                    onChange={(e) => setNewDocDate(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Description</Label>
                                <Input
                                    placeholder="Optional description"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={newCategory} onValueChange={setNewCategory}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREDEFINED_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleUpload} disabled={uploading || !selectedFile || !newTitle}>
                            {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            {uploading ? "Uploading..." : "Upload Document"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Standard Edit Modal */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogTitle>Edit Document</DialogTitle>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Title</Label>
                            <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Input
                                type="date"
                                value={editDocDate}
                                onChange={(e) => setEditDocDate(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={editDescription}
                                onChange={(e) => setEditDescription(e.target.value)}
                                rows={3}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={editCategory} onValueChange={setEditCategory}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PREDEFINED_CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={isUpdating}>
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Viewer Modal */}
            {viewingDoc && (
                <DocumentViewerModal 
                    open={isViewerOpen}
                    onOpenChange={setIsViewerOpen}
                    url={viewingDoc.url}
                    title={viewingDoc.title || viewingDoc.name}
                    fileType={viewingDoc.file_type}
                />
            )}
        </div>
    )
}
