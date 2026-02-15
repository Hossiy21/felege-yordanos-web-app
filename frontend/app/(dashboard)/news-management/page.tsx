"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    getAllNews,
    addNews,
    deleteNews,
    type NewsArticle,
} from "@/lib/news-store"
import {
    Plus,
    Trash2,
    Eye,
    Calendar,
    Tag,
    FileText,
    X,
    Newspaper,
    ExternalLink,
} from "lucide-react"
import Link from "next/link"

const categories = ["News", "Event", "Activity", "Announcement"]

export default function NewsManagementPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [showForm, setShowForm] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

    // Form state
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [category, setCategory] = useState("News")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        setArticles(getAllNews())
    }, [])

    function validate(): boolean {
        const newErrors: Record<string, string> = {}
        if (!title.trim()) newErrors.title = "Title is required"
        if (!date.trim()) newErrors.date = "Date is required"
        if (!description.trim()) newErrors.description = "Summary is required"
        if (!content.trim()) newErrors.content = "Content is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        addNews({
            title: title.trim(),
            date: date.trim(),
            category,
            description: description.trim(),
            content: content.trim(),
        })

        // Reset form
        setTitle("")
        setDate("")
        setCategory("News")
        setDescription("")
        setContent("")
        setErrors({})
        setShowForm(false)

        // Refresh list
        setArticles(getAllNews())
    }

    function handleDelete(slug: string) {
        deleteNews(slug)
        setArticles(getAllNews())
        setDeleteConfirm(null)
    }

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">
                        News Management
                    </h1>
                    <p className="text-muted-foreground text-sm mt-1">
                        Create, manage, and publish news articles for the website.
                    </p>
                </div>
                <Button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-[#003366] text-white hover:bg-[#003366]/90 font-bold gap-2"
                >
                    {showForm ? (
                        <>
                            <X className="h-4 w-4" /> Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="h-4 w-4" /> Add News
                        </>
                    )}
                </Button>
            </div>

            {/* Add News Form */}
            {showForm && (
                <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[#FFB800]" />
                        New Article
                    </h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        {/* Title */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Title *
                            </label>
                            <Input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter the article title..."
                                className={errors.title ? "border-destructive" : ""}
                            />
                            {errors.title && (
                                <p className="text-xs text-destructive mt-1">{errors.title}</p>
                            )}
                        </div>

                        {/* Date & Category Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1.5 block">
                                    Date *
                                </label>
                                <Input
                                    type="date"
                                    value={date}
                                    onChange={(e) => {
                                        // Format to readable string
                                        const d = new Date(e.target.value)
                                        setDate(
                                            d.toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })
                                        )
                                    }}
                                    className={errors.date ? "border-destructive" : ""}
                                />
                                {date && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Will display as: {date}
                                    </p>
                                )}
                                {errors.date && (
                                    <p className="text-xs text-destructive mt-1">{errors.date}</p>
                                )}
                            </div>
                            <div>
                                <label className="text-sm font-medium text-foreground mb-1.5 block">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>
                                            {cat}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Summary */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Summary *
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="A brief summary that appears on the news card..."
                                rows={2}
                                className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none ${errors.description ? "border-destructive" : "border-input"
                                    }`}
                            />
                            {errors.description && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Full Content */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Full Content *
                            </label>
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Write the full article content here...&#10;&#10;Use **bold** for headers and - for bullet points."
                                rows={10}
                                className={`flex w-full rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring font-mono resize-y ${errors.content ? "border-destructive" : "border-input"
                                    }`}
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Tip: Use <code className="bg-muted px-1 rounded">**text**</code>{" "}
                                for bold headers and{" "}
                                <code className="bg-muted px-1 rounded">- item</code> for bullet
                                points.
                            </p>
                            {errors.content && (
                                <p className="text-xs text-destructive mt-1">
                                    {errors.content}
                                </p>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setShowForm(false)
                                    setErrors({})
                                }}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-[#003366] text-white hover:bg-[#003366]/90 font-bold gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Publish Article
                            </Button>
                        </div>
                    </form>
                </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-2xl font-bold text-foreground">{articles.length}</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Articles</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-2xl font-bold text-foreground">
                        {articles.filter((a) => a.category === "News").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">News</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-2xl font-bold text-foreground">
                        {articles.filter((a) => a.category === "Event").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Events</p>
                </div>
                <div className="rounded-xl border border-border bg-card p-4">
                    <p className="text-2xl font-bold text-foreground">
                        {articles.filter((a) => a.category === "Activity").length}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Activities</p>
                </div>
            </div>

            {/* Articles List */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
                <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                    <h2 className="font-bold text-foreground flex items-center gap-2">
                        <Newspaper className="h-4 w-4 text-[#FFB800]" />
                        All Articles
                    </h2>
                    <Link
                        href="/news"
                        target="_blank"
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                        View Public Page
                        <ExternalLink className="h-3 w-3" />
                    </Link>
                </div>

                {articles.length === 0 ? (
                    <div className="p-12 text-center">
                        <Newspaper className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">
                            No articles yet
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Click &quot;Add News&quot; to create your first article.
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {articles.map((article) => (
                            <div
                                key={article.slug}
                                className="px-6 py-4 flex items-center gap-4 hover:bg-muted/30 transition-colors group"
                            >
                                {/* Category Badge */}
                                <span
                                    className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${article.category === "Event"
                                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                            : article.category === "Activity"
                                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                                : article.category === "Announcement"
                                                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                                                    : "bg-primary/10 text-primary"
                                        }`}
                                >
                                    {article.category}
                                </span>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-sm truncate">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                        {article.description}
                                    </p>
                                </div>

                                {/* Date */}
                                <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                    <Calendar className="h-3 w-3" />
                                    {article.date}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <Link href={`/news/${article.slug}`} target="_blank">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    {deleteConfirm === article.slug ? (
                                        <div className="flex items-center gap-1">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => setDeleteConfirm(null)}
                                                className="h-8 px-2 text-xs"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(article.slug)}
                                                className="h-8 px-2 text-xs"
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteConfirm(article.slug)}
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
