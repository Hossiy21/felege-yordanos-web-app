"use client"

import { useEffect, useState } from "react"
import { getRecentNews, type NewsArticle } from "@/lib/news-store"
import { useTranslation } from "react-i18next"
import { ArrowRight, Sparkles, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { NewsCard } from "@/components/news/news-card"

export function NewsSection() {
    const { t } = useTranslation()
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getRecentNews(3)
                setArticles(data)
            } catch (err) {
                console.error("Home news fetch failed", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNews()
    }, [])

    return (
        <section id="news" className="py-32 relative bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="max-w-xl">
                        <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-none px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-bold mb-4">
                            <Sparkles className="h-3.5 w-3.5 mr-2" />
                            {t("news_announcements")}
                        </Badge>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4">
                            {t("news_events_title")}
                        </h2>
                        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                            {t("news_subtitle")}
                        </p>
                    </div>

                    <Link href="/news" className="group">
                        <Button variant="outline" className="rounded-xl px-6 h-12 font-bold uppercase tracking-widest text-[10px] transition-all hover:bg-blue-50 dark:hover:bg-blue-900/20">
                            {t("view_all_news")}
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {isLoading ? (
                        [1, 2, 3].map(i => (
                            <div key={i} className="h-96 bg-slate-50 dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
                        ))
                    ) : articles.length === 0 ? (
                        <div className="col-span-full py-32 text-center rounded-3xl bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800">
                            <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                <Newspaper className="h-8 w-8 text-slate-300" />
                            </div>
                            <p className="text-slate-500 font-bold">{t("check_back_soon")}</p>
                        </div>
                    ) : (
                        articles.map((item) => (
                            <NewsCard key={item.id} article={item} />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}
