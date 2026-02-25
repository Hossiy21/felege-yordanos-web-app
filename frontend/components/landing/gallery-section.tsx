"use client"

import { useState, useMemo } from "react"
import { LayoutGrid, Maximize2, X, Calendar, ChevronLeft, ChevronRight, Search, ImageIcon } from "lucide-react"
import { useTranslation } from "react-i18next"
import Image from "next/image"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface GalleryItem {
    id: number
    title: string
    category: string
    image: string
    description: string
    date: string
}

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

    const allGalleryItems: GalleryItem[] = useMemo(() => [
        {
            id: 1,
            title: "Cathedral Epiphany Celebration",
            category: "epiphany",
            description: "The grand celebration of Timket at the cathedral grounds, featuring traditional hymns and sacred water blessings.",
            date: "Jan 19, 2026",
            image: "https://images.unsplash.com/photo-1545652936-f0815437819c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 2,
            title: "Cathedral Interior & Icons",
            category: "service",
            description: "A breathtaking view of the sacred icons and architectural beauty within the main church hall.",
            date: "Feb 10, 2026",
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 3,
            title: "Divine Liturgy Service",
            category: "service",
            description: "The congregation gathering for the holy liturgy, a time of deep spiritual connection and prayer.",
            date: "Feb 15, 2026",
            image: "https://images.unsplash.com/photo-1519491050282-30cdb8fa1aff?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 4,
            title: "Sunday School Graduation",
            category: "graduation",
            description: "A joyful milestone as our students complete their intensive spiritual education program.",
            date: "Jun 15, 2025",
            image: "https://images.unsplash.com/photo-1523050335102-c3250d85720d?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 5,
            title: "Holy Sacrament Ceremony",
            category: "service",
            description: "A sacred moment during the administration of the holy sacraments at the altar.",
            date: "Mar 05, 2026",
            image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 6,
            title: "Vigil of Light",
            category: "service",
            description: "Nighttime vigil featuring candlelight prayers and ancient liturgical chants.",
            date: "Every Sunday",
            image: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 7,
            title: "Sunday School Choir",
            category: "activities",
            description: "Our youth choir rehearsing traditional Mezmurs for the upcoming feast day.",
            date: "Apr 12, 2026",
            image: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 8,
            title: "Baptism Service",
            category: "service",
            description: "Welcoming a new member into the church family through the holy sacrament of baptism.",
            date: "Aug 20, 2025",
            image: "https://images.unsplash.com/photo-1558239027-380d3ce7207b?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 9,
            title: "Youth Bible Study",
            category: "activities",
            description: "Engaging the next generation in profound scriptural study and theological discussion.",
            date: "Nov 15, 2025",
            image: "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 10,
            title: "Church Architecture Details",
            category: "service",
            description: "Focusing on the intricate details and symbolic architecture of our beloved cathedral.",
            date: "Oct 10, 2025",
            image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 11,
            title: "Liturgy Chants Rehearsal",
            category: "activities",
            description: "Students learning the ancient and sacred scales of Ethiopian Orthodox liturgical music.",
            date: "Jan 07, 2026",
            image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 12,
            title: "Altar Servants Training",
            category: "activities",
            description: "Training the young deacons and altar servers in the sacred protocols of the sanctuary.",
            date: "Weekly",
            image: "https://images.unsplash.com/photo-1548013146-72479768bbaa?q=80&w=2073&auto=format&fit=crop"
        },
        {
            id: 13,
            title: "Sacred Vessels & Items",
            category: "service",
            description: "A close-up of the blessed items and vessels used during the holy services.",
            date: "May 15, 2025",
            image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 14,
            title: "Prayer and Meditation",
            category: "service",
            description: "Moments of quiet reflection and individual prayer inside the cathedral.",
            date: "Daily",
            image: "https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 15,
            title: "Scripture Reading",
            category: "activities",
            description: "Reading from the ancient Ge'ez scriptures during a Sunday School session.",
            date: "Oct 25, 2025",
            image: "https://images.unsplash.com/photo-1504052434569-70ad531e217e?q=80&w=2070&auto=format&fit=crop"
        },
        {
            id: 16,
            title: "Community Feast Day",
            category: "activities",
            description: "Gathering after the service to celebrate a saint's feast day with the community.",
            date: "Dec 05, 2025",
            image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=2070&auto=format&fit=crop"
        }
    ], [])

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
        <section id="gallery" className={`${isDedicatedPage ? 'pt-32 pb-24' : 'py-24'} bg-background overflow-hidden relative`}>
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary blur-[100px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FFB800] blur-[100px]" />
            </div>

            <div className="mx-auto max-w-7xl px-6 relative z-10">
                <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
                        <ImageIcon className="h-3 w-3" />
                        {t("gallery")}
                    </div>
                    <h2 className="text-4xl font-black tracking-tight text-[#003366] dark:text-foreground md:text-6xl mb-6">
                        {t("our_gallery")}
                    </h2>
                    <div className="w-20 h-1.5 bg-[#FFB800] mx-auto rounded-full mb-8" />
                    <p className="mt-4 text-lg text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                        {t("gallery_subtitle")}
                    </p>
                </div>

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            onClick={() => setSelectedItem(item)}
                            className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden border border-border/20 bg-muted/10 shadow-sm hover:shadow-2xl transition-all duration-700 cursor-pointer animate-in fade-in zoom-in-95 duration-500"
                        >
                            <Image
                                src={item.image}
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

                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />
                        </div>
                    ))}
                </div>

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
                            className="h-12 w-12 rounded-2xl border-border/40 transition-all"
                        >
                            <ChevronRight className="h-5 w-5" />
                        </Button>
                    </div>
                )}
            </div>

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
                                    src={selectedItem.image}
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
                                                {selectedItem.date}
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
        </section>
    )
}
