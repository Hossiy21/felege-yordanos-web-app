import { LandingNav } from "@/components/landing/landing-nav"
import { HeroSection } from "@/components/landing/hero-section"
import { HomeContent } from "@/components/landing/home-content"
import { LandingFooter } from "@/components/landing/landing-footer"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home - Felege Yordanos Sunday School",
  description:
    "Official home of Bole Debre Salem Medhanealem Cathedral — Felege Yordanos Sunday School. Rooted in faith, growing in grace.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <LandingNav />
      <main>
        <HeroSection />
        <HomeContent />
      </main>
      <LandingFooter />
    </div>
  )
}
