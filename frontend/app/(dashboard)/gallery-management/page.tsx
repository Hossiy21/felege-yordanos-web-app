"use client"

import { useState } from "react"
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

export default function GalleryManagementPage() {
    const { t } = useTranslation()
    const [activeView, setActiveView] = useState<"grid" | "list">("grid")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

    // Church-specific images for administration consistency
    const [photos, setPhotos] = useState([
        {
            id: 1,
            title: "Cathedral Epiphany Celebration",
            category: "epiphany",
            date: "Jan 19, 2026",
            image: "https://images.unsplash.com/photo-1545652936-f0815437819c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Divine Liturgy Gathering",
            category: "service",
            date: "Feb 10, 2026",
            image: "https://images.unsplash.com/photo-1519491050282-30cdb8fa1aff?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Cathedral Interior Icons",
            category: "service",
            date: "Feb 15, 2026",
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 4,
            title: "Sunday School Graduation",
            category: "graduation",
            date: "Jun 15, 2025",
            image: "https://images.unsplash.com/photo-1523050335102-c3250d85720d?q=80&w=2070&auto=format&fit=crop"
        },
    ])

    const categories = [
        { id: "epiphany", label: t("category_epiphany") },
        { id: "activities", label: t("category_activities") },
        { id: "service", label: t("category_service") },
        { id: "graduation", label: t("category_graduation") },
    ]

    const handleDelete = (id: number) => {
        setPhotos(photos.filter(p => p.id !== id))
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
                                <Input id="title" placeholder="e.g. Timket 2026 Celebration" className="rounded-xl border-border/60" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="category" className="text-sm font-semibold">{t("photo_category")}</Label>
                                <Select>
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
                                <Label className="text-sm font-semibold">{t("select_image")}</Label>
                                <div className="border-2 border-dashed border-border/60 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group">
                                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <ImageIcon className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-sm font-bold text-foreground">Click to upload or drag and drop</p>
                                        <p className="text-xs text-muted-foreground mt-1">PNG, JPG or WebP (max. 5MB)</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} className="rounded-xl border-border/60">Cancel</Button>
                            <Button onClick={() => setIsAddDialogOpen(false)} className="rounded-xl bg-primary text-primary-foreground font-bold px-8">
                                {t("upload_photo")}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {photos.map((photo) => (
                    <Card key={photo.id} className="group overflow-hidden rounded-2xl border-border/40 shadow-sm hover:shadow-xl transition-all duration-300 bg-background/60 backdrop-blur-sm border-transparent hover:border-primary/20">
                        <div className="relative aspect-square overflow-hidden">
                            <Image
                                src={photo.image}
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
                            <span>Uploaded on {photo.date}</span>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    )
}

function Separator({ className, orientation = "horizontal" }: { className?: string, orientation?: "horizontal" | "vertical" }) {
    return (
        <div className={`shrink-0 bg-border/40 ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"} ${className}`} />
    )
}
