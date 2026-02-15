"use client"

import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { useParams } from "next/navigation"
import { getNewsBySlug } from "@/lib/news-store"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar } from "lucide-react"
import { useEffect, useState } from "react"
import type { NewsArticle } from "@/lib/news-store"

export default function NewsDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [article, setArticle] = useState<NewsArticle | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const found = getNewsBySlug(slug)
        if (found) {
            setArticle(found)
        }
        setLoading(false)
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
            </div>
        )
    }

    if (!article) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background">
            <LandingNav />
            <main>
                {/* Hero Banner */}
                <div className="bg-[#003366] py-16 text-white border-b border-white/10">
                    <div className="mx-auto max-w-4xl px-6">
                        <Link href="/news">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-white/70 hover:text-white hover:bg-white/10 mb-6 gap-2 -ml-2"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to News
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3 mb-4">
                            <span className="px-3 py-1 rounded-full bg-[#FFB800] text-[#003366] text-xs font-bold">
                                {article.category}
                            </span>
                            <span className="flex items-center gap-1.5 text-sm text-white/60">
                                <Calendar className="h-3.5 w-3.5" />
                                {article.date}
                            </span>
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                            {article.title}
                        </h1>
                        <p className="mt-4 text-lg text-white/70 max-w-2xl">
                            {article.description}
                        </p>
                    </div>
                </div>

                {/* Article Content */}
                <article className="py-16">
                    <div className="mx-auto max-w-4xl px-6">
                        <div className="prose prose-lg dark:prose-invert max-w-none">
                            {article.content.split("\n\n").map((paragraph, idx) => {
                                // Handle bold headers like **Text:**
                                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                                    const text = paragraph.replace(/\*\*/g, "")
                                    return (
                                        <h2
                                            key={idx}
                                            className="text-2xl font-bold text-foreground mt-10 mb-4"
                                        >
                                            {text}
                                        </h2>
                                    )
                                }

                                // Handle section headers like **Text:**
                                if (paragraph.startsWith("**")) {
                                    const headerMatch = paragraph.match(/^\*\*(.+?)\*\*(.*)/)
                                    if (headerMatch) {
                                        return (
                                            <div key={idx} className="mt-8 mb-4">
                                                <h3 className="text-xl font-bold text-foreground mb-2">
                                                    {headerMatch[1]}
                                                </h3>
                                                {headerMatch[2] && (
                                                    <p className="text-muted-foreground leading-relaxed">
                                                        {headerMatch[2]}
                                                    </p>
                                                )}
                                            </div>
                                        )
                                    }
                                }

                                // Handle bullet lists
                                if (paragraph.startsWith("- ")) {
                                    const items = paragraph
                                        .split("\n")
                                        .filter((l) => l.startsWith("- "))
                                    return (
                                        <ul key={idx} className="space-y-3 my-6">
                                            {items.map((item, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-start gap-3 text-muted-foreground"
                                                >
                                                    <div className="mt-2 h-1.5 w-1.5 rounded-full bg-[#FFB800] shrink-0" />
                                                    <span className="leading-relaxed">
                                                        {item.replace(/^- /, "").replace(/\*\*/g, "")}
                                                    </span>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                }

                                // Handle quotes
                                if (
                                    paragraph.startsWith('"') ||
                                    paragraph.startsWith("\u201C")
                                ) {
                                    return (
                                        <blockquote
                                            key={idx}
                                            className="border-l-4 border-[#FFB800] pl-6 py-2 my-8 italic text-muted-foreground bg-muted/30 rounded-r-lg pr-6"
                                        >
                                            <p className="text-lg">{paragraph}</p>
                                        </blockquote>
                                    )
                                }

                                // Regular paragraphs
                                return (
                                    <p
                                        key={idx}
                                        className="text-muted-foreground leading-relaxed mb-6"
                                    >
                                        {paragraph}
                                    </p>
                                )
                            })}
                        </div>

                        {/* Bottom Navigation */}
                        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                            <Link href="/news">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="h-4 w-4" />
                                    All News & Events
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button className="bg-[#003366] text-white hover:bg-[#003366]/90 gap-2">
                                    Contact Us for More Info
                                </Button>
                            </Link>
                        </div>
                    </div>
                </article>
            </main>
            <LandingFooter />
        </div>
    )
}
