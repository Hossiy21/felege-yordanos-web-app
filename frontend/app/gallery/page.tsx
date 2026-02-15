import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { GallerySection } from "@/components/landing/gallery-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Gallery - Felege Yordanos Sunday School",
    description: "View photos and memories from our Sunday School events and spiritual gatherings.",
}

export default function GalleryPage() {
    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                <div className="bg-[#003366] py-16 text-white border-b border-white/10">
                    <div className="mx-auto max-w-6xl px-6">
                        <h1 className="text-4xl font-bold mb-4">Our Gallery</h1>
                        <p className="text-lg text-white/70">Capturing the beauty of our faith and fellowship.</p>
                    </div>
                </div>

                <GallerySection />

                {/* Potentially categories or more images */}
                <section className="py-12 bg-muted/20">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <p className="text-muted-foreground italic">"Give thanks to the LORD, for he is good; his love endures forever." - Psalm 107:1</p>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    )
}
