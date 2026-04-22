import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { AboutContent } from "@/components/landing/about-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us - Felege Yordanos Sunday School",
    description:
        "Learn about the history, mission, leadership, and programs of Bole Debre Salem Medhanealem Cathedral — Felege Yordanos Sunday School.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                <AboutContent />
            </main>
            <LandingFooter />
        </div>
    )
}
