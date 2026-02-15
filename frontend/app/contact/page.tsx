import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { ContactSection } from "@/components/landing/contact-section"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "Contact Us - Felege Yordanos Sunday School",
    description: "Get in touch with Bole Debre Salem Medhanealem Cathedral Felege Yordanos Sunday School.",
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                <div className="bg-[#003366] py-16 text-white border-b border-white/10">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                        <p className="text-lg text-white/70 max-w-2xl mx-auto">
                            Whether you want to join our classes, volunteer, or have questions about our Sunday School, we are here to help.
                        </p>
                    </div>
                </div>

                <ContactSection />

                {/* Map Placeholder */}
                <section className="pb-24 pt-0">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="rounded-2xl border border-border bg-muted h-[400px] flex items-center justify-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[#003366]/5" />
                            <div className="text-center z-10 px-6">
                                <div className="h-12 w-12 rounded-full bg-white shadow-lg flex items-center justify-center mx-auto mb-4 text-[#003366]">
                                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-xl font-bold mb-2">Our Location</h3>
                                <p className="text-muted-foreground">Bole Debre Salem Medhanealem Cathedral, Addis Ababa, Ethiopia</p>
                                <a
                                    href="https://maps.google.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-6 inline-block text-primary font-bold hover:underline"
                                >
                                    Open in Google Maps
                                </a>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    )
}
