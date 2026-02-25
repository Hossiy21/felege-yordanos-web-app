"use client"

import { Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { getAllNews, type NewsArticle } from "@/lib/news-store"
import { useTranslation } from "react-i18next"

export function NewsSection() {
    const { t } = useTranslation()
    const [articles, setArticles] = useState<NewsArticle[]>(() => {
        // Initialize with data immediately to avoid flash of empty content
        try {
            return getAllNews().slice(0, 3)
        } catch {
            return []
        }
    })

    return (
        <section id="news" className="py-24 bg-muted/30">
            <div className="mx-auto max-w-6xl px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            {t("news_events_title")}
                        </h2>
                        <p className="mt-4 text-lg text-muted-foreground">
                            {t("news_subtitle")}
                        </p>
                    </div>
                    <Link href="/news">
                        <Button variant="outline" className="hidden md:flex gap-2">
                            {t("view_all_news")}
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {articles.map((item) => (
                        <div
                            key={item.slug}
                            className="group flex flex-col bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
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
                                    <Link href={`/news/${item.slug}`}>
                                        <Button
                                            variant="link"
                                            className="p-0 h-auto text-primary font-semibold text-sm gap-2"
                                        >
                                            {t("read_more")}
                                            <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <Link href="/news" className="block md:hidden">
                    <Button variant="outline" className="w-full mt-8 gap-2">
                        {t("view_all_news")}
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </section>
    )
}
