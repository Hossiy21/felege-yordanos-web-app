"use client"

import Link from "next/link"
import { Calendar, Clock, ArrowUpRight } from "lucide-react"
import { type NewsArticle } from "@/lib/news-store"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface NewsCardProps {
    article: NewsArticle
    className?: string
}

const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200
    const words = content.trim().split(/\s+/).length
    return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function NewsCard({ article, className }: NewsCardProps) {
    const readingTime = calculateReadingTime(article.content || "")
    const initials = article.author_name 
        ? article.author_name.split(' ').map(n => n[0]).join('').toUpperCase()
        : "UN"

    return (
        <Link 
            href={`/news/${article.slug || article.id}`}
            className={cn(
                "group flex flex-col bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
                className
            )}
        >
            {/* Image Section */}
            <div className="aspect-[16/10] relative overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                    src={article.image_url || "https://images.unsplash.com/photo-1544427928-c49cddee6eac?q=80&w=2000&auto=format&fit=crop"}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 backdrop-blur-sm text-slate-900 hover:bg-white border-none px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md shadow-sm">
                        Article
                    </Badge>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-6 flex flex-col flex-1">
                {/* Meta Row */}
                <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-slate-500 mb-4 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(article.created_at).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{readingTime} min read</span>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-[#FFB800] transition-colors">
                    {article.title}
                </h3>

                {/* Summary */}
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed mb-6 flex-1">
                    {article.summary}
                </p>

                <Separator className="bg-slate-100 dark:bg-slate-800 mb-4" />

                {/* Footer Section */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-red-500 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {initials}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-white leading-none mb-1">
                                {article.author_name || "Anonymous Member"}
                            </span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                                Author
                            </span>
                        </div>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-900 flex items-center justify-center text-slate-300 group-hover:text-blue-600 dark:group-hover:text-[#FFB800] group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-all">
                        <ArrowUpRight className="h-5 w-5" />
                    </div>
                </div>
            </div>
        </Link>
    )
}
