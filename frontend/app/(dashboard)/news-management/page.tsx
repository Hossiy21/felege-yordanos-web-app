"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    getAllNews,
    addNews,
    deleteNews,
    updateNews,
    uploadImage,
    type NewsArticle,
} from "@/lib/news-store"
import { toast } from "sonner"
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
    Image as ImageIcon,
    Upload,
    Loader2,
    User,
} from "lucide-react"
import Link from "next/link"

const categories = ["News", "Event", "Activity", "Announcement"]

export default function NewsManagementPage() {
    const [articles, setArticles] = useState<NewsArticle[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
    const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null)

    // Form state
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [category, setCategory] = useState("News")
    const [authorName, setAuthorName] = useState("")
    const [description, setDescription] = useState("")
    const [content, setContent] = useState("")
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    const fetchArticles = async () => {
        setIsLoading(true)
        try {
            const data = await getAllNews()
            setArticles(data.news)
        } catch (err) {
            toast.error("Failed to load news")
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchArticles()
    }, [])

    function validate(): boolean {
        const newErrors: Record<string, string> = {}
        if (!title.trim()) newErrors.title = "Title is required"
        if (!description.trim()) newErrors.description = "Summary is required"
        if (!content.trim()) newErrors.content = "Content is required"
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!validate()) return

        setIsSubmitting(true)
        try {
            let image_url = editingArticle?.image_url || ""
            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile)
                if (uploadedUrl) {
                    image_url = uploadedUrl
                } else {
                    toast.error("Image upload failed, continuing without image")
                }
            }

            if (editingArticle?.id) {
                // Update existing
                const success = await updateNews(editingArticle.id, {
                    title: title.trim(),
                    category,
                    author_name: authorName.trim(),
                    summary: description.trim(),
                    content: content.trim(),
                    image_url: image_url,
                })

                if (success) {
                    toast.success("Article updated successfully")
                    resetForm()
                    fetchArticles()
                } else {
                    toast.error("Failed to update article")
                }
            } else {
                // Create new
                const success = await addNews({
                    title: title.trim(),
                    category,
                    author_name: authorName.trim(),
                    summary: description.trim(),
                    content: content.trim(),
                    image_url: image_url,
                })

                if (success) {
                    toast.success("News published successfully")
                    resetForm()
                    fetchArticles()
                } else {
                    toast.error("Failed to publish news")
                }
            }
        } catch (err) {
            toast.error("An error occurred")
        } finally {
            setIsSubmitting(false)
        }
    }

    function resetForm() {
        setTitle("")
        setDate("")
        setCategory("News")
        setDescription("")
        setContent("")
        setAuthorName("")
        setImageFile(null)
        setImagePreview(null)
        setErrors({})
        setShowForm(false)
        setEditingArticle(null)
    }

    function handleEdit(article: NewsArticle) {
        setEditingArticle(article)
        setTitle(article.title)
        setCategory(article.category || "News")
        setAuthorName(article.author_name || "")
        setDescription(article.summary)
        setContent(article.content)
        setImagePreview(article.image_url || null)
        setShowForm(true)
        // Scroll to form
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    async function handleDelete(id: string) {
        const success = await deleteNews(id)
        if (success) {
            toast.success("Article deleted")
            fetchArticles()
        } else {
            toast.error("Delete failed")
        }
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
                        {editingArticle ? "Edit Article" : "New Article"}
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

                        {/* Author */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Author Name
                            </label>
                            <Input
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                placeholder="Enter author name (optional)..."
                            />
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

                        {/* Photo Upload */}
                        <div>
                            <label className="text-sm font-medium text-foreground mb-1.5 block">
                                Cover Photo
                            </label>
                            <div className="flex flex-col items-center gap-4 p-6 border-2 border-dashed border-border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0]
                                        if (file) {
                                            setImageFile(file)
                                            setImagePreview(URL.createObjectURL(file))
                                        }
                                    }}
                                />
                                {imagePreview ? (
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border">
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            size="sm"
                                            className="absolute top-2 right-2 h-7 w-7 p-0 rounded-full"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setImageFile(null)
                                                setImagePreview(null)
                                            }}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="h-8 w-8" />
                                        <p className="text-sm">Click or drag to upload a news image</p>
                                        <p className="text-xs">PNG, JPG or WebP (Max 5MB)</p>
                                    </div>
                                )}
                            </div>
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
                                disabled={isSubmitting}
                                className="bg-[#003366] text-white hover:bg-[#003366]/90 font-bold gap-2 min-w-[140px]"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        {editingArticle ? "Updating..." : "Publishing..."}
                                    </>
                                ) : (
                                    <>
                                        {editingArticle ? (
                                            <>
                                                <ImageIcon className="h-4 w-4" /> Save Changes
                                            </>
                                        ) : (
                                            <>
                                                <Plus className="h-4 w-4" /> Publish Article
                                            </>
                                        )}
                                    </>
                                )}
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

                {isLoading ? (
                    <div className="p-12 text-center flex flex-col items-center gap-4">
                        <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        <p className="text-muted-foreground text-sm">Loading articles...</p>
                    </div>
                ) : articles.length === 0 ? (
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
                                key={article.id}
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
                                    {article.category || "News"}
                                </span>

                                {/* Thumbnail */}
                                <div className="shrink-0 w-12 h-12 rounded-lg bg-muted overflow-hidden border border-border">
                                    {article.image_url ? (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                                            <ImageIcon className="h-5 w-5" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-foreground text-sm truncate">
                                        {article.title}
                                    </h3>
                                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                        {article.summary}
                                    </p>
                                    {article.author_name && (
                                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground/70">
                                            <User className="h-2.5 w-2.5" />
                                            {article.author_name}
                                        </div>
                                    )}
                                </div>

                                {/* Date */}
                                <span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(article.created_at).toLocaleDateString()}
                                </span>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <Link href={`/news/${article.id}`} target="_blank">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                        >
                                            <Eye className="h-4 w-4" />
                                        </Button>
                                    </Link>

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleEdit(article)}
                                        className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                                    >
                                        <ImageIcon className="h-4 w-4" />
                                    </Button>

                                    {deleteConfirm === article.id ? (
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
                                                onClick={() => article.id && handleDelete(article.id)}
                                                className="h-8 px-2 text-xs"
                                            >
                                                Confirm
                                            </Button>
                                        </div>
                                    ) : (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setDeleteConfirm(article.id || null)}
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
