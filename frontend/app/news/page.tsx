"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { getAllNews, type NewsArticle } from "@/lib/news-store"
import { LandingNav } from "@/components/landing/landing-nav"
import { LandingFooter } from "@/components/landing/landing-footer"
import { Search, Sparkles, ArrowUpRight } from "lucide-react"
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
                {/* Premium Immersive Header Section */}
                <div className="relative pt-32 pb-24 overflow-hidden text-white w-full">
                    {/* Premium Abstract Gradient Background */}
                    <div className="absolute inset-0 z-0 bg-[#0a192f]">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0a274a] via-[#003366] to-[#001229]" />

                        {/* Subtle architectural grid pattern */}
                        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                        {/* Colorful ambient orbs */}
                        <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#FFB800]/15 rounded-full blur-[120px]" />
                        <div className="absolute bottom-[0%] -left-[10%] w-[600px] h-[600px] bg-[#0066cc]/20 rounded-full blur-[130px]" />
                        <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[#60a5fa]/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 mx-auto max-w-7xl px-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 backdrop-blur-md px-4 py-1.5 text-[10px] font-bold text-[#FFB800] uppercase tracking-[0.2em] mb-6 shadow-lg">
                            <Sparkles className="h-3 w-3" />
                            {t('latest_updates')}
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1] drop-shadow-xl text-balance">
                            {t('news_events_title')}
                        </h1>
                        <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-medium drop-shadow-md">
                            {t('news_subtitle')}
                        </p>

                        {/* Search & Filter Bar Section */}
                        <div className="w-full max-w-2xl mx-auto pt-12">
                            <div className="p-2 rounded-[2rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl flex flex-col md:flex-row gap-2">
                                <div className="relative flex-1 group">
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-[#FFB800] transition-colors" />
                                    <Input
                                        placeholder={t('search_news_placeholder')}
                                        className="bg-transparent border-none text-white placeholder:text-white/40 h-14 pl-14 focus-visible:ring-0 focus-visible:ring-offset-0 text-base font-medium"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto no-scrollbar p-1 items-center px-2">
                                    {categories.slice(0, 4).map((cat) => (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedCategory(cat)}
                                            className={cn(
                                                "px-6 h-11 rounded-full text-[11px] font-black uppercase tracking-wider transition-all whitespace-nowrap",
                                                selectedCategory === cat
                                                    ? "bg-[#FFB800] text-[#003366] shadow-lg shadow-[#FFB800]/20"
                                                    : "bg-white/5 text-white/70 hover:bg-white/10"
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

                {/* Premium Professional CTA Section */}
                <section className="pb-32">
                    <div className="mx-auto max-w-7xl px-6">
                        <div className="relative rounded-[3rem] overflow-hidden p-12 lg:p-24 text-center text-white border border-white/10 shadow-2xl group">
                            {/* Premium Abstract Background Wrapper */}
                            <div className="absolute inset-0 z-0 bg-[#0a192f]">
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#001229] via-[#003366] to-[#0a274a]" />
                                
                                {/* Subtle architectural grid pattern */}
                                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />

                                {/* Glowing ambient orbs */}
                                <div className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-[#FFB800]/10 rounded-full blur-[120px] transition-transform duration-1000 group-hover:scale-110" />
                                <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-[#0066cc]/20 rounded-full blur-[130px] transition-transform duration-1000 group-hover:scale-110" />
                            </div>

                            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                                <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-md px-6 py-2 text-xs font-black text-[#FFB800] uppercase tracking-[0.3em] shadow-lg">
                                    <Sparkles className="h-4 w-4" />
                                    {t('media_wing')}
                                </div>
                                
                                <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1] text-balance drop-shadow-2xl">
                                    {t('want_to_submit')}
                                </h2>
                                
                                <p className="text-xl md:text-2xl text-blue-100/80 font-medium leading-relaxed max-w-2xl mx-auto italic drop-shadow-md">
                                    {t('submit_announcement_desc')}
                                </p>

                                <div className="pt-4">
                                    <Link href="/contact">
                                        <Button className="bg-[#FFB800] text-[#003366] hover:bg-white hover:text-[#003366] font-black px-12 h-16 rounded-2xl text-base shadow-2xl transition-all duration-300 uppercase tracking-widest hover:-translate-y-1 hover:shadow-[#FFB800]/20 flex items-center gap-3 mx-auto">
                                            {t('contact_editorial_team')}
                                            <ArrowUpRight className="h-5 w-5" />
                                        </Button>
                                    </Link>
                                </div>
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
