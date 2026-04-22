"use client"

import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { useParams, notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    ArrowLeft,
    Calendar,
    Clock,
    Share2,
    CalendarDays,
    Timer,
    ChevronRight,
    ArrowRight,
    Sparkles
} from "lucide-react"
import { useEffect, useState, useMemo } from "react"
import { getNewsById, getRecentNews, type NewsArticle } from "@/lib/news-store"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { NewsCard } from "@/components/news/news-card"

// Helper to estimate reading time
const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content?.trim().split(/\s+/).length || 0;
    return Math.max(1, Math.ceil(words / wordsPerMinute));
};

export default function NewsDetailPage() {
    const { t } = useTranslation()
    const params = useParams()
    const id = params.slug as string
    const [article, setArticle] = useState<NewsArticle | null>(null)
    const [relatedNews, setRelatedNews] = useState<NewsArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const data = await getNewsById(id)
                setArticle(data)

                // Fetch related news (excluding current)
                const recent = await getRecentNews(6)
                if (data) {
                    setRelatedNews(recent.filter(n => n.id !== data.id).slice(0, 3))
                }
            } catch (err) {
                console.error("Article fetch failed", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchArticle()
    }, [id])

    const readingTime = useMemo(() => {
        if (!article) return 0;
        return calculateReadingTime(article.content);
    }, [article]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white dark:bg-[#020617] flex flex-col">
                <LandingNav />
                <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                            {t('unfolding_story')}
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    if (!article) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
            <LandingNav />

            <main>
                {/* Clean Detail Header */}
                <div className="pt-32 pb-16 bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="mx-auto max-w-4xl px-6">
                        <Link
                            href="/news"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors mb-10 group"
                        >
                            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span className="text-xs font-bold uppercase tracking-widest">{t('back_to_library')}</span>
                        </Link>

                        <Badge className="bg-blue-600 text-white border-none px-4 py-1.5 rounded-lg font-bold uppercase tracking-widest text-[10px] mb-6">
                            {article.category || "Insight"}
                        </Badge>

                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-8">
                            {article.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <CalendarDays className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">
                                    {new Date(article.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                            <Separator orientation="vertical" className="h-4 bg-slate-200 dark:bg-slate-700 hidden sm:block" />
                            <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-blue-500" />
                                <span className="text-sm font-medium">{readingTime} {t('min_read')}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="mx-auto max-w-4xl px-6 py-20">
                    <div className="space-y-12">
                        {/* Summary Block */}
                        <div className="text-2xl md:text-3xl text-slate-600 dark:text-slate-300 font-medium leading-relaxed italic border-l-4 border-blue-600 pl-8">
                            {article.summary}
                        </div>

                        {/* Main Image */}
                        {article.image_url && (
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                                <img
                                    src={article.image_url}
                                    alt={article.title}
                                    className="w-full h-auto object-cover max-h-[600px]"
                                />
                            </div>
                        )}

                        {/* Prose Body */}
                        <article className="prose prose-lg md:prose-xl dark:prose-invert max-w-none 
                            prose-headings:font-extrabold prose-headings:tracking-tight prose-headings:text-slate-900 dark:prose-headings:text-white
                            prose-p:text-slate-600 dark:prose-p:text-slate-300 prose-p:leading-relaxed
                            prose-strong:text-blue-600 dark:prose-strong:text-blue-400
                            prose-blockquote:border-blue-600/30 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-slate-900/50 prose-blockquote:rounded-xl prose-blockquote:py-2
                        ">
                            {article.content.split("\n\n").map((paragraph, idx) => {
                                if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                                    return <h2 key={idx}>{paragraph.replace(/\*\*/g, "")}</h2>
                                }
                                if (paragraph.startsWith(">")) {
                                    return <blockquote key={idx}>{paragraph.substring(1).trim()}</blockquote>
                                }
                                if (paragraph.includes("- ")) {
                                    return (
                                        <ul key={idx}>
                                            {paragraph.split("\n").map((line, lidx) => (
                                                <li key={lidx}>{line.replace(/^- /, "")}</li>
                                            ))}
                                        </ul>
                                    )
                                }
                                return <p key={idx}>{paragraph}</p>
                            })}
                        </article>

                        <Separator className="my-20 bg-slate-100 dark:bg-slate-800" />

                        {/* Author/Share Footer */}
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-8 px-10 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-white font-bold shadow-sm text-lg">
                                    {article.author_name ? article.author_name[0] : "A"}
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900 dark:text-white">{article.author_name || "Anonymous"}</p>
                                    <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Contributor</p>
                                </div>
                            </div>
                            <Button variant="outline" className="rounded-xl gap-2 h-12 px-6 font-bold uppercase tracking-widest text-[10px]">
                                <Share2 className="h-4 w-4" />
                                {t('share_insight')}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Related News */}
                <section className="py-32 bg-slate-50/50 dark:bg-slate-950/50">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="flex items-center justify-between mb-16">
                            <div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-2">{t('deepen_journey')}</h2>
                                <p className="text-slate-500 font-medium">{t('more_insights')}</p>
                            </div>
                            <Link href="/news" className="hidden sm:block">
                                <Button variant="ghost" className="rounded-xl font-bold uppercase tracking-widest text-[10px]">
                                    {t('explore_full_catalog')}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {relatedNews.length > 0 ? (
                                relatedNews.map((item) => (
                                    <NewsCard key={item.id} article={item} />
                                ))
                            ) : (
                                [1, 2, 3].map(i => (
                                    <div key={i} className="h-96 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
                                ))
                            )}
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />
        </div>
    )
}

