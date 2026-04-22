// News data store using localStorage
// This allows admin-created news to appear on the landing page

export interface NewsArticle {
    id?: string
    slug?: string
    title: string
    summary: string
    content: string
    image_url?: string
    category?: string // We'll map this or use metadata
    author_email?: string
    author_name?: string
    tenant_id?: string
    created_at: string
    updated_at: string
}

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

// Default/seed news articles
const defaultNews: NewsArticle[] = [
    {
        id: "annual-sunday-school-symposium-2026",
        title: "Annual Sunday School Symposium 2026",
        category: "Event",
        summary: "Join us for our annual spiritual symposium featuring guest speakers and choir performances.",
        content: `Annual Sunday School Symposium...`,
        created_at: "2026-02-01T09:00:00Z",
        updated_at: "2026-02-01T09:00:00Z"
    },
    {
        id: "new-youth-mentorship-program-launched",
        title: "New Youth Mentorship Program Launched",
        category: "News",
        summary: "A new mentorship program for our young members.",
        content: `New Youth Mentorship Program...`,
        created_at: "2026-02-10T09:00:00Z",
        updated_at: "2026-02-10T09:00:00Z"
    },
    {
        id: "community-outreach-visit-to-local-shelter",
        title: "Community Outreach: Visit to Local Shelter",
        category: "Activity",
        summary: "Our members visited the local community shelter.",
        content: `Community Outreach visit...`,
        created_at: "2026-01-25T09:00:00Z",
        updated_at: "2026-01-25T09:00:00Z"
    },
]

function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim()
}

// Get all news articles from API
export async function getAllNews(page = 1, limit = 10, tenantId?: string): Promise<{ news: NewsArticle[], total: number, pages: number }> {
    try {
        let url = `${API_BASE}/api/news/news?page=${page}&limit=${limit}`
        if (tenantId) url += `&tenant_id=${tenantId}`

        const response = await fetch(url)
        if (!response.ok) throw new Error("Failed to fetch news")
        return await response.json()
    } catch (error) {
        console.error("News fetch error:", error)
        return { news: [], total: 0, pages: 0 }
    }
}

// Get basic list for simple views
export async function getRecentNews(limit = 3): Promise<NewsArticle[]> {
    const data = await getAllNews(1, limit)
    return data.news
}

// Get a single news article by ID
export async function getNewsById(id: string): Promise<NewsArticle | null> {
    try {
        const response = await fetch(`${API_BASE}/api/news/news/${id}`)
        if (!response.ok) return null
        return await response.json()
    } catch {
        return null
    }
}

// Add a new news article via API
export async function addNews(article: Partial<NewsArticle>): Promise<NewsArticle | null> {
    try {
        const response = await fetch(`${API_BASE}/api/news/news`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article),
            credentials: "include"
        })
        if (!response.ok) throw new Error("Create failed")
        return await response.json()
    } catch (error) {
        console.error("Create news error:", error)
        return null
    }
}

// Upload news image
export async function uploadImage(file: File): Promise<string | null> {
    try {
        const formData = new FormData()
        formData.append("image", file)

        const response = await fetch(`${API_BASE}/api/news/upload`, {
            method: "POST",
            body: formData,
            credentials: "include"
        })
        if (!response.ok) throw new Error("Upload failed")
        const data = await response.json()
        return data.image_url
    } catch (error) {
        console.error("Upload error:", error)
        return null
    }
}

// Update news
export async function updateNews(id: string, updates: Partial<NewsArticle>): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/api/news/news/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updates),
            credentials: "include"
        })
        return response.ok
    } catch {
        return false
    }
}

// Delete news
export async function deleteNews(id: string): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE}/api/news/news/${id}`, {
            method: "DELETE",
            credentials: "include"
        })
        return response.ok
    } catch {
        return false
    }
}
