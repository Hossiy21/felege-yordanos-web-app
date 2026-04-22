"use client"

import { useState, useEffect } from "react"
import { Trash2, Edit2, Search, Filter, LayoutGrid, List, Plus, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useTranslation } from "react-i18next"
import Image from "next/image"

import { GalleryItem, getGalleryItems, uploadGalleryImage, createGalleryItem, deleteGalleryItem } from "@/lib/gallery-store"

export default function GalleryManagementPage() {
    const { t } = useTranslation()
    const [activeView, setActiveView] = useState<"grid" | "list">("grid")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [isUploading, setIsUploading] = useState(false)

    // Form state
    const [title, setTitle] = useState("")
    const [category, setCategory] = useState("")
    const [description, setDescription] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const [photos, setPhotos] = useState<GalleryItem[]>([])

    // Load items on mount
    useEffect(() => {
        loadGallery()
    }, [])

    const loadGallery = async () => {
        try {
            setIsLoading(true)
            const data = await getGalleryItems(1, 100)
            setPhotos(data.items || [])
        } catch (error) {
            console.error("Failed to load gallery:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const categories = [
        { id: "epiphany", label: t("category_epiphany") },
        { id: "activities", label: t("category_activities") },
        { id: "service", label: t("category_service") },
        { id: "graduation", label: t("category_graduation") },
    ]

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            const url = URL.createObjectURL(file)
            setPreviewUrl(url)
        }
    }

    const handleUpload = async () => {
        if (!selectedFile || !title || !category) {
            alert("Please fill in title, category, and select an image")
            return
        }

        try {
            setIsUploading(true)

            // 1. Upload image to MinIO
            const { image_url } = await uploadGalleryImage(selectedFile)

            // 2. Save metadata to DB
            await createGalleryItem({
                title,
                category,
                description,
                image_url
            })

            // 3. Reset form and reload
            setIsAddDialogOpen(false)
            setTitle("")
            setCategory("")
            setDescription("")
            setSelectedFile(null)
            setPreviewUrl(null)

            await loadGallery()
        } catch (error) {
            console.error("Upload failed:", error)
            alert("Failed to upload image. Please try again.")
        } finally {
            setIsUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this photo?")) {
            try {
                await deleteGalleryItem(id)
                setPhotos(photos.filter(p => p.id !== id))
            } catch (error) {
                console.error("Delete failed:", error)
            }
        }
    }

    return (
        <div className="flex flex-col gap-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground text-balance">{t("gallery_mgmt_title")}</h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        {t("gallery_mgmt_desc")}
                    </p>
                </div>

                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-bold rounded-xl shadow-sm hover:shadow-md transition-all gap-2 px-6 h-11">
                            <Plus className="h-5 w-5" />
                            {t("add_photo")}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] rounded-2xl border-border/40 backdrop-blur-xl">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-bold">{t("add_photo")}</DialogTitle>
                            <DialogDescription>
                                Fill in the details below to add a new photo to the public gallery.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="title" className="text-sm font-semibold">{t("photo_title")}</Label>
                                <Input id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Timket 2026 Celebration" className="rounded-xl border-border/60" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category" className="text-sm font-semibold">{t("photo_category")}</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="rounded-xl border-border/60 h-11">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {categories.map(cat => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                                <Input id="description" value={description} onChange={e => setDescription(e.target.value)} placeholder="Brief description of the photo..." className="rounded-xl border-border/60" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-sm font-semibold">{t("select_image")}</Label>
                                <label className="border-2 border-dashed border-border/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group relative overflow-hidden">
                                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                                    {previewUrl ? (
                                        <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <>
                                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                                <ImageIcon className="h-6 w-6 text-primary" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-foreground">Click to upload or drag and drop</p>
                                                <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 5MB)</p>
                                            </div>
                                        </>
                                    )}
                                </label>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl border-border/60" disabled={isUploading}>Cancel</Button>
                            <Button onClick={handleUpload} className="rounded-xl bg-primary text-primary-foreground font-bold px-8" disabled={isUploading}>
                                {isUploading ? "Uploading..." : t("upload_photo")}
                            </Button>

                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Toolbar */}
            <Card className="rounded-2xl border-border/40 shadow-sm bg-background/60 backdrop-blur-sm overflow-hidden">
                <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <div className="relative w-full md:w-[400px]">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search photos by title..."
                                className="pl-10 h-10 rounded-xl bg-muted/40 border-border/40 focus:ring-primary/20"
                            />
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="flex border border-border/60 rounded-xl overflow-hidden p-1 bg-muted/20">
                                <Button
                                    variant={activeView === "grid" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView("grid")}
                                    className={`h-8 w-8 p-0 rounded-lg ${activeView === "grid" ? "bg-background shadow-sm" : ""}`}
                                >
                                    <LayoutGrid className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant={activeView === "list" ? "secondary" : "ghost"}
                                    size="sm"
                                    onClick={() => setActiveView("list")}
                                    className={`h-8 w-8 p-0 rounded-lg ${activeView === "list" ? "bg-background shadow-sm" : ""}`}
                                >
                                    <List className="h-4 w-4" />
                                </Button>
                            </div>
                            <Separator orientation="vertical" className="h-6 hidden md:block" />
                            <Button variant="outline" size="sm" className="rounded-xl border-border/60 h-10 gap-2 px-4 whitespace-nowrap">
                                <Filter className="h-4 w-4" />
                                {t("more_filters")}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-pulse">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square bg-muted/40 rounded-2xl" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {photos.map((photo) => (
                        <Card key={photo.id} className="group overflow-hidden rounded-2xl border-border/40 shadow-sm hover:shadow-xl transition-all duration-300 bg-background/60 backdrop-blur-sm border-transparent hover:border-primary/20">
                            <div className="relative aspect-square overflow-hidden bg-muted/20">
                                <Image
                                    src={photo.image_url}
                                    alt={photo.title}
                                    fill
                                    unoptimized
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/90 hover:bg-white text-foreground shadow-sm">
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="h-10 w-10 rounded-full shadow-sm"
                                        onClick={() => handleDelete(photo.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardHeader className="p-4">
                                <div className="flex justify-between items-start gap-2">
                                    <div>
                                        <CardTitle className="text-sm font-bold line-clamp-1">{photo.title}</CardTitle>
                                        <CardDescription className="text-[11px] font-medium mt-1 uppercase tracking-wider text-primary">
                                            {t(`category_${photo.category}`)}
                                        </CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardFooter className="p-4 pt-0 text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/10 mt-2 pt-3">
                                <span>Uploaded on {new Date(photo.created_at).toLocaleDateString()}</span>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}

function Separator({ className, orientation = "horizontal" }: { className?: string, orientation?: "horizontal" | "vertical" }) {
    return (
        <div className={`shrink-0 bg-border/40 ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"} ${className}`} />
    )
}
