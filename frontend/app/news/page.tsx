"use client"

import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useEffect, useState } from "react"
import { getAllNews, type NewsArticle } from "@/lib/news-store"

export default function NewsPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([])

    useEffect(() => {
        setArticles(getAllNews())
    }, [])

    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                <div className="bg-[#003366] py-16 text-white border-b border-white/10">
                    <div className="mx-auto max-w-6xl px-6">
                        <h1 className="text-4xl font-bold mb-4">News & Announcements</h1>
                        <p className="text-lg text-white/70">
                            Connecting our community through shared moments and spiritual
                            updates.
                        </p>
                    </div>
                </div>

                {/* All News Articles */}
                <section className="py-16">
                    <div className="mx-auto max-w-6xl px-6">
                        {articles.length === 0 ? (
                            <div className="text-center py-16">
                                <p className="text-muted-foreground text-lg">
                                    No news articles available yet. Check back soon!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                {articles.map((item) => (
                                    <Link
                                        key={item.slug}
                                        href={`/news/${item.slug}`}
                                        className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg hover:border-[#FFB800]/50 transition-all"
                                    >
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    {item.category}
                                                </span>
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <Calendar className="h-3 w-3" />
                                                    {item.date}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed flex-1">
                                                {item.description}
                                            </p>
                                            <div className="mt-6 pt-6 border-t border-border">
                                                <span className="text-primary font-semibold text-sm flex items-center gap-2">
                                                    Read More
                                                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* CTA */}
                <section className="pb-24 pt-0">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="rounded-2xl border border-border bg-card p-12 text-center">
                            <h2 className="text-2xl font-bold mb-4">
                                Want to submit an announcement?
                            </h2>
                            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                                If you have news or an upcoming event relevant to our Sunday
                                School community, please contact the media department.
                            </p>
                            <Link href="/contact">
                                <Button className="bg-[#003366] text-white hover:bg-[#003366]/90 font-bold px-8">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <LandingFooter />
        </div>
    )
}
