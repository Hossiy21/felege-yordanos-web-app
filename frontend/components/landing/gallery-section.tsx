"use client"

import { useState, useMemo, useEffect } from "react"
import { LayoutGrid, Maximize2, X, Calendar, ChevronLeft, ChevronRight, Search, ImageIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { getGalleryItems, GalleryItem } from "@/lib/gallery-store"

interface GallerySectionProps {
    isDedicatedPage?: boolean
}

export function GallerySection({ isDedicatedPage = false }: GallerySectionProps) {
    const { t } = useTranslation()
    const [activeCategory, setActiveCategory] = useState("all")
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const categories = [
        { id: "all", label: t("all_categories"), icon: <LayoutGrid className="h-4 w-4" /> },
        { id: "epiphany", label: t("category_epiphany") },
        { id: "activities", label: t("category_activities") },
        { id: "service", label: t("category_service") },
        { id: "graduation", label: t("category_graduation") },
    ]

    const [allGalleryItems, setAllGalleryItems] = useState<GalleryItem[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchItems = async () => {
            try {
                setIsLoading(true)
                // Fetch up to 100 recent photos for the landing page
                const data = await getGalleryItems(1, 100)
                setAllGalleryItems(data.items || [])
            } catch (error) {
                console.error("Failed to fetch gallery:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchItems()
    }, [])

    const filteredItems = useMemo(() => activeCategory === "all"
        ? allGalleryItems
        : allGalleryItems.filter(item => item.category === activeCategory), [activeCategory, allGalleryItems])

    const totalPages = Math.ceil(filteredItems.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedItems = filteredItems.slice(startIndex, startIndex + itemsPerPage)

    const handleCategoryChange = (catId: string) => {
        setActiveCategory(catId)
        setCurrentPage(1)
    }

    // Navigation logic for the preview dialog
    const currentIndex = selectedItem ? filteredItems.findIndex(item => item.id === selectedItem.id) : -1

    const handleNext = () => {
        if (currentIndex < filteredItems.length - 1) {
            setSelectedItem(filteredItems[currentIndex + 1])
        } else {
            setSelectedItem(filteredItems[0])
        }
    }

    const handlePrev = () => {
        if (currentIndex > 0) {
            setSelectedItem(filteredItems[currentIndex - 1])
        } else {
            setSelectedItem(filteredItems[filteredItems.length - 1])
        }
    }

    return (
        <div className="w-full bg-background" id="gallery">
            {/* ── Premium Abstract Header Section ── */}
            <section className={`relative overflow-hidden text-white ${isDedicatedPage ? 'pt-40 pb-28' : 'pt-24 pb-20'}`}>
                <div className="absolute inset-0 z-0 bg-[#0a192f]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a274a] via-[#003366] to-[#001229]" />
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    {/* Colorful ambient orbs */}
                    <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#FFB800]/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[0%] -left-[10%] w-[600px] h-[600px] bg-[#0066cc]/20 rounded-full blur-[130px]" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-6 text-center animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold text-[#FFB800] uppercase tracking-[0.2em] mb-4 shadow-lg">
                        <ImageIcon className="h-3 w-3" />
                        {t("gallery")}
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-white md:text-6xl mb-6 drop-shadow-lg">
                        ማዕከለ-ስዕላታችን
                    </h2>
                    <div className="w-20 h-1.5 bg-[#FFB800] mx-auto rounded-full mb-8 shadow-sm" />
                    <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto leading-relaxed drop-shadow-md font-medium">
                        የፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት መንፈሳዊ ሕይወትና ተግባራት።
                    </p>
                </div>
            </section>

            {/* ── Content Section with Original Light Background ── */}
            <section className="py-16 relative z-10 bg-background text-foreground">
                <div className="mx-auto max-w-7xl px-6">
                    {/* Filter Dock */}
                    <div className="flex flex-col gap-6 mb-16 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-200">
                        <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-muted/30 backdrop-blur-xl rounded-[2.5rem] border border-border/40 shadow-xl max-w-fit mx-auto">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategoryChange(cat.id)}
                                    className={`px-7 py-3 rounded-[2rem] text-[13px] font-black transition-all duration-500 relative ${activeCategory === cat.id
                                        ? "bg-white dark:bg-muted text-[#003366] dark:text-primary shadow-[0_10px_20px_rgba(0,0,0,0.05)] scale-105"
                                        : "text-muted-foreground hover:text-foreground hover:bg-white/40"
                                        }`}
                                >
                                    {cat.label}
                                    {activeCategory === cat.id && (
                                        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-[#FFB800] rounded-full" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <div className="flex items-center justify-center gap-4 text-[10px] font-black text-muted-foreground/50 uppercase tracking-[0.3em] px-4">
                            <div className="h-px w-8 bg-border/60" />
                            <div className="flex items-center gap-2">
                                <Search className="h-3.5 w-3.5" />
                                <span>Showing {startIndex + 1}—{Math.min(startIndex + itemsPerPage, filteredItems.length)} of {filteredItems.length} photos</span>
                            </div>
                            <div className="h-px w-8 bg-border/60" />
                        </div>
                    </div>

                    {/* Grid */}
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                                <div key={i} className="aspect-[4/5] rounded-[2rem] bg-muted/40" />
                            ))}
                        </div>
                    ) : paginatedItems.length === 0 ? (
                        <div className="text-center py-20 text-muted-foreground">
                            {t("no_photos_found", "No photos found in this category.")}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {paginatedItems.map((item, index) => (
                                <div
                                    key={`${item.id}-${index}`}
                                    onClick={() => setSelectedItem(item)}
                                    className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border/20 bg-muted/10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 cursor-pointer animate-in fade-in zoom-in-95 duration-500"
                                >
                                    <Image
                                        src={item.image_url}
                                        alt={item.title}
                                        fill
                                        unoptimized
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[20%] group-hover:grayscale-0"
                                    />

                                    <div className="absolute inset-x-4 bottom-4 z-20 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                                        <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-5 rounded-[1.5rem] shadow-2xl text-center">
                                            <h3 className="text-white text-base font-bold line-clamp-1">{item.title}</h3>
                                        </div>
                                    </div>

                                    <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/80 via-[#003366]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="mt-20 flex items-center justify-center gap-3">
                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(p => p - 1)}
                                className="h-12 w-12 rounded-2xl border-border/40 transition-all"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </Button>

                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`h-12 min-w-[3rem] px-4 rounded-2xl text-xs font-bold transition-all ${currentPage === i + 1
                                            ? "bg-[#003366] text-white"
                                            : "border border-border/40 text-muted-foreground"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                size="icon"
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(p => p + 1)}
                                className="h-12 w-12 rounded-2xl border-border/40 transition-all text-foreground"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </Button>
                        </div>
                    )}
                </div>
            </section>

            {/* Simple Minimalist Preview Dialog with Navigation */}
            <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
                <DialogContent className="max-w-[95vw] md:max-w-4xl h-auto p-0 overflow-hidden bg-white border-none rounded-3xl shadow-2xl focus:outline-none">
                    {selectedItem && (
                        <div className="relative w-full flex flex-col">
                            {/* Simple Close Button */}
                            <div className="absolute top-4 right-4 z-50">
                                <Button
                                    onClick={() => setSelectedItem(null)}
                                    variant="ghost"
                                    size="icon"
                                    className="h-9 w-9 rounded-full bg-black/5 hover:bg-black/10 text-black/30 hover:text-black transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            {/* Image Stage - Reduced Size */}
                            <div className="relative w-full h-[40vh] md:h-[55vh] bg-muted/10 flex items-center justify-center p-4">
                                <Image
                                    src={selectedItem.image_url}
                                    alt={selectedItem.title}
                                    fill
                                    unoptimized
                                    className="object-contain p-2"
                                />
                            </div>

                            {/* Info & Navigation Footer */}
                            <div className="p-6 md:p-8 bg-white border-t border-border/5">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                    <div className="flex-1 space-y-1 text-center md:text-left">
                                        <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                                            <span className="text-[9px] font-bold uppercase tracking-widest text-[#FFB800]">
                                                {t(`category_${selectedItem.category}`)}
                                            </span>
                                            <span className="w-1 h-1 rounded-full bg-border" />
                                            <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">
                                                {new Date(selectedItem.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <h3 className="text-lg md:text-xl font-medium text-[#003366] tracking-tight leading-none">
                                            {selectedItem.title}
                                        </h3>
                                    </div>

                                    {/* Navigation Buttons Block */}
                                    <div className="flex items-center gap-2 bg-muted/40 p-1 rounded-2xl border border-border/10">
                                        <Button
                                            onClick={handlePrev}
                                            variant="ghost"
                                            className="h-10 px-4 rounded-xl text-xs font-semibold hover:bg-white hover:shadow-sm gap-2"
                                        >
                                            <ChevronLeft className="h-4 w-4" />
                                            {t("prev")}
                                        </Button>
                                        <div className="w-px h-6 bg-border/20" />
                                        <Button
                                            onClick={handleNext}
                                            variant="ghost"
                                            className="h-10 px-4 rounded-xl text-xs font-semibold hover:bg-white hover:shadow-sm gap-2"
                                        >
                                            {t("next")}
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
