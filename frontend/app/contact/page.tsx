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
                {/* Immersive Premium Header Section */}
                <div className="relative pt-32 pb-24 overflow-hidden text-white w-full">
                    {/* Premium Abstract Gradient Background */}
                    <div className="absolute inset-0 z-0 bg-[#0a192f]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a274a] via-[#003366] to-[#001229]" />

                        {/* Subtle architectural grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                        {/* Colorful ambient orbs for that 'cool' modern look */}
                        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#FFB800]/15 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[0%] -left-[10%] w-[600px] h-[600px] bg-[#0066cc]/20 rounded-full blur-[130px]" />
                        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[#60a5fa]/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-6xl px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold text-[#FFB800] uppercase tracking-[0.2em] mb-6 shadow-lg">
                            Get In Touch
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-[1.1] drop-shadow-xl text-balance">
                            Contact Us
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                            Whether you want to volunteer or have questions about our Sunday School, we are here to help.
                        </p>
                    </div>
                </div>

                <ContactSection />

                {/* Map Section */}
                <section className="pb-24 pt-0">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="relative w-full rounded-3xl overflow-hidden border border-border/50 shadow-lg group h-[450px]">
                            <div className="absolute inset-0 bg-[#003366]/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                            <iframe
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                loading="lazy"
                                allowFullScreen
                                referrerPolicy="no-referrer-when-downgrade"
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=38.7759%2C8.9859%2C38.8039%2C9.0059&layer=mapnik&marker=8.9959%2C38.7899`}
                                className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                                title="Medhane Alem Cathedral Location"
                            />
                            <div className="absolute bottom-4 right-4 z-20">
                                <a
                                    href="https://geohack.toolforge.org/geohack.php?pagename=Medhane_Alem_Cathedral,_Addis_Ababa&params=8.9959_N_38.7899_E_source:openstreetmap_region:ET-AA_type:landmark"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-foreground shadow-sm hover:bg-background transition-colors flex items-center gap-2 border border-border/50"
                                >
                                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    Open in GeoHack
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
