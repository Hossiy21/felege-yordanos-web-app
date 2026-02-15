import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { AboutSection } from "@/components/landing/about-section"
import { BookOpen, Church, Users, Heart, Star, Shield } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
    title: "About Us - Felege Yordanos Sunday School",
    description: "Learn more about Bole Debre Salem Medhanealem Cathedral Felege Yordanos Sunday School.",
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                {/* Hero Section for About */}
                <div className="bg-[#003366] py-20 text-white">
                    <div className="mx-auto max-w-6xl px-6 text-center">
                        <h1 className="text-4xl font-bold sm:text-5xl mb-6">About Our Sunday School</h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            Rooted in tradition, growing in faith, and serving our community with love since our founding.
                        </p>
                    </div>
                </div>

                {/* Detailed Description */}
                <section className="py-24">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="prose prose-lg dark:prose-invert mx-auto">
                            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Church & History</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
                                <div>
                                    <p className="text-muted-foreground leading-relaxed mb-6">
                                        Bole Debre Salem Medhanealem Cathedral is one of the most prominent spiritual landmarks in Addis Ababa.
                                        Our cathedral stands as a testament to the enduring faith of the Ethiopian Orthodox Tewahedo Church.
                                    </p>
                                    <p className="text-muted-foreground leading-relaxed">
                                        Felege Yordanos Sunday School was established to nurture the spiritual growth of our youth.
                                        Our name, "Felege Yordanos" (Stream of Jordan), symbolizes the life-giving spiritual path
                                        we provide to our students through the teachings of the Bible and Holy Traditions.
                                    </p>
                                </div>
                                <div className="bg-muted rounded-2xl aspect-video flex items-center justify-center border border-border">
                                    <Church className="h-20 w-20 text-muted-foreground/40" />
                                </div>
                            </div>

                            <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Our Spiritual Leadership</h2>
                            <p className="text-xl text-center text-muted-foreground mb-12 italic">
                                "Train up a child in the way he should go: and when he is old, he will not depart from it." - Proverbs 22:6
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-24">
                                {[
                                    { icon: Star, title: "Spiritual Guidance", desc: "Led by dedicated clergy and experienced spiritual fathers." },
                                    { icon: Shield, title: "Sacred Tradition", desc: "Preserving the 2,000-year-old heritage of our Holy Church." },
                                    { icon: BookOpen, title: "Biblical Study", desc: "In-depth education on the Holy Scriptures and Theology." }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card">
                                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary">
                                            <item.icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="font-bold mb-2">{item.title}</h3>
                                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reusing AboutSection for Mission/Values */}
                <AboutSection />
            </main>
            <LandingFooter />
        </div>
    )
}
