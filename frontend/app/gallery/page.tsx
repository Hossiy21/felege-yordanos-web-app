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
                {/* 
                    Removed the redundant dark blue header. 
                    GallerySection now handles its own Hero/Title presentation 
                    efficiently for a production-ready dedicated page.
                */}
                <GallerySection isDedicatedPage={true} />
            </main>
            <LandingFooter />
        </div>
    )
}
