import { LandingNav } from "@/components/landing/landing-nav"
import { HeroSection } from "@/components/landing/hero-section"
import { AboutSection } from "@/components/landing/about-section"
import { NewsSection } from "@/components/landing/news-section"
import { ContactSection } from "@/components/landing/contact-section"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Home - Felege Yordanos Sunday School",
  description: "Official home of Bole Debre Salem Medhanealem Cathedral Felege Yordanos Sunday School.",
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background font-sans">
      <LandingNav />
      <main>
        <HeroSection />

        {/* Brief About Section */}
        <section className="py-12 border-y border-border bg-muted/20 text-center">
          <div className="mx-auto max-w-4xl px-6">
            <h2 className="text-3xl font-bold mb-6">Growing Together in Spirit</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our vibrant community dedicated to the service of God and growth in faith.
              We offer classes for all ages and numerous spiritual activities.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/about">
                <Button size="lg" className="bg-[#003366] text-white">Learn Our History</Button>
              </Link>
              <Link href="/classes">
                <Button size="lg" variant="outline" className="border-[#003366] text-[#003366]">Discover Classes</Button>
              </Link>
            </div>
          </div>
        </section>

        <AboutSection />
        <NewsSection />
        <ContactSection />
      </main>
      <LandingFooter />
    </div>
  )
}
