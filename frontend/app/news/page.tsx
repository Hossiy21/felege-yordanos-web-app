"use client"

import { useEffect, useState, useMemo } from "react"
import { getAllNews, type NewsArticle } from "@/lib/news-store"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Search, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"
import { NewsCard } from "@/components/news/news-card"

export default function NewsPage() {
    const { t } = useTranslation()
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("All")

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await getAllNews(1, 100)
                setArticles(data.news || [])
            } catch (err) {
                console.error("News fetch failed", err)
            } finally {
                setIsLoading(false)
            }
        }
        fetchNews()
    }, [])

    const categories = useMemo(() => {
        const cats = new Set(articles.map(a => a.category).filter(Boolean))
        return ["All", ...Array.from(cats)] as string[]
    }, [articles])

    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            const matchesSearch = 
                (article.title?.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (article.summary?.toLowerCase().includes(searchQuery.toLowerCase()))
            const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
            return matchesSearch && matchesCategory
        })
    }, [articles, searchQuery, selectedCategory])

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-[#020617] transition-colors duration-500">
            <LandingNav />

            <main>
                {/* Clean Header Section */}
                <div className="relative pt-32 pb-20 overflow-hidden bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                    <div className="mx-auto max-w-7xl px-6 relative z-10">
                        <div className="flex flex-col items-center text-center max-w-3xl mx-auto space-y-6">
                            <Badge className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-none px-4 py-1.5 rounded-full uppercase tracking-widest text-[10px] font-bold">
                                {t('latest_updates')}
                            </Badge>

                            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
                                {t('news_events_title')}
                            </h1>

                            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium">
                                {t('news_subtitle')}
                            </p>

                            {/* Search & Filter Bar */}
                            <div className="w-full max-w-2xl pt-8">
                                <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-800 shadow-xl border border-slate-100 dark:border-slate-700 flex flex-col md:flex-row gap-2">
                                    <div className="relative flex-1 group">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                        <Input
                                            placeholder={t('search_news_placeholder')}
                                            className="bg-transparent border-none text-slate-900 dark:text-white placeholder:text-slate-400 h-12 pl-12 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex gap-2 overflow-x-auto no-scrollbar p-1">
                                        {categories.slice(0, 4).map((cat) => (
                                            <button
                                                key={cat}
                                                onClick={() => setSelectedCategory(cat)}
                                                className={cn(
                                                    "px-5 h-10 rounded-xl text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap",
                                                    selectedCategory === cat
                                                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                                                        : "bg-slate-50 text-slate-500 hover:bg-slate-100 dark:bg-slate-700/50 dark:text-slate-400"
                                                )}
                                            >
                                                {cat}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-7xl px-6 py-20">
                    {isLoading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="h-96 bg-white dark:bg-slate-900 rounded-2xl animate-pulse border border-slate-100 dark:border-slate-800" />
                            ))}
                        </div>
                    ) : filteredArticles.length === 0 ? (
                        <div className="text-center py-32 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Search className="w-8 h-8 text-slate-300" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2 dark:text-white">{t('no_articles_found')}</h3>
                            <p className="text-slate-500 max-w-sm mx-auto mb-8">{t('no_articles_desc')}</p>
                            <Button
                                variant="outline"
                                onClick={() => { setSearchQuery(""); setSelectedCategory("All") }}
                                className="rounded-xl px-8"
                            >
                                {t('clear_filters')}
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                            {filteredArticles.map((item, index) => (
                                <NewsCard 
                                    key={item.id} 
                                    article={item} 
                                    className="animate-in fade-in slide-in-from-bottom-4 duration-700" 
                                    style={{ animationDelay: `${(index % 6) * 100}ms` } as any}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Simplified Contact Section */}
                <section className="pb-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="relative rounded-3xl bg-blue-600 dark:bg-blue-900/50 overflow-hidden p-12 lg:p-20 text-center text-white">
                            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight">
                                    {t('want_to_submit')}
                                </h2>
                                <p className="text-lg text-blue-100 font-medium italic opacity-80 pb-4">
                                    {t('submit_announcement_desc')}
                                </p>
                                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-bold px-10 h-14 rounded-xl text-base shadow-xl transition-all uppercase tracking-widest">
                                    {t('contact_editorial_team')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <LandingFooter />

            <style jsx global>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </div>
    )
}
