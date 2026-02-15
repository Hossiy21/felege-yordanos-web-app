import { ImageIcon } from "lucide-react"

const galleryItems = [
    { id: 1, title: "Sunday Service", category: "Worship", className: "md:col-span-2 md:row-span-2" },
    { id: 2, title: "Youth Choir", category: "Performance", className: "md:col-span-1 md:row-span-1" },
    { id: 3, title: "Religious Study", category: "Education", className: "md:col-span-1 md:row-span-1" },
    { id: 4, title: "Annual Symposium", category: "Events", className: "md:col-span-1 md:row-span-2" },
    { id: 5, title: "Community Outreach", category: "Service", className: "md:col-span-1 md:row-span-1" },
]

export function GallerySection() {
    return (
        <section id="gallery" className="py-24 bg-background">
            <div className="mx-auto max-w-6xl px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                        Our Gallery
                    </h2>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Glimpses into the spiritual life and activities of Felege Yordanos Sunday School.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-3 gap-6 h-[800px] md:h-[600px]">
                    {galleryItems.map((item) => (
                        <div
                            key={item.id}
                            className={`group relative rounded-2xl overflow-hidden border border-border bg-muted ${item.className}`}
                        >
                            {/* Overlay with details */}
                            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-primary text-xs font-semibold tracking-wider uppercase mb-1">
                                    {item.category}
                                </span>
                                <h3 className="text-white text-xl font-bold">
                                    {item.title}
                                </h3>
                            </div>

                            {/* Placeholder Content */}
                            <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                                <ImageIcon className="h-10 w-10 text-muted-foreground/40 group-hover:scale-110 transition-transform duration-500" />
                            </div>

                            {/* Visual effect for hover */}
                            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
