// News data store using localStorage
// This allows admin-created news to appear on the landing page

export interface NewsArticle {
    slug: string
    title: string
    date: string
    category: string
    description: string
    content: string
    createdAt: string
}

const STORAGE_KEY = "felege-yordanos-news"

// Default/seed news articles
const defaultNews: NewsArticle[] = [
    {
        slug: "annual-sunday-school-symposium-2026",
        title: "Annual Sunday School Symposium 2026",
        date: "March 15, 2026",
        category: "Event",
        description:
            "Join us for our annual spiritual symposium featuring guest speakers and choir performances.",
        content: `We are thrilled to announce the Annual Sunday School Symposium 2026, a landmark gathering of spiritual leaders, educators, and our vibrant church community.

**Event Highlights:**

- Keynote addresses by distinguished spiritual fathers
- Panel discussions on modern Sunday School education
- Youth choir and mezmur performances
- Community fellowship lunch

**When:** March 15, 2026, starting at 9:00 AM
**Where:** Bole Debre Salem Medhanealem Cathedral Main Hall

This symposium is a wonderful opportunity for all members of our Sunday School family to come together, learn, and grow in faith. Whether you are a teacher, student, or parent, there is something for everyone.

We encourage all members to attend and invite friends and family. Let us come together to celebrate our shared faith and commitment to spiritual education.

For registration and more details, please contact the Sunday School office or reach out through our contact page.`,
        createdAt: "2026-02-01T09:00:00Z",
    },
    {
        slug: "new-youth-mentorship-program-launched",
        title: "New Youth Mentorship Program Launched",
        date: "February 10, 2026",
        category: "News",
        description:
            "We are excited to announce a new mentorship program for our young members to guide them in their spiritual journey.",
        content: `Felege Yordanos Sunday School is proud to launch a brand-new Youth Mentorship Program designed to guide our young members in their spiritual journey.

**Program Overview:**

The program pairs experienced church members and Sunday School teachers with younger students to provide one-on-one mentorship, spiritual guidance, and academic support.

**Key Features:**

- Weekly one-on-one mentorship sessions
- Monthly group activities and outings
- Scripture study and prayer partnerships
- Life skills and character development workshops

**Who Can Join?**

- Mentors: Adults aged 25+ with a strong foundation in the Orthodox faith
- Mentees: Youth aged 13-18 who are active members of our Sunday School

**How to Apply:**

Applications are now open. Visit the Sunday School office or contact us through the website to express your interest.

We believe that investing in our youth is investing in the future of our church. Together, we can raise a generation rooted in faith, love, and service.`,
        createdAt: "2026-02-10T09:00:00Z",
    },
    {
        slug: "community-outreach-visit-to-local-shelter",
        title: "Community Outreach: Visit to Local Shelter",
        date: "January 25, 2026",
        category: "Activity",
        description:
            "Our members visited the local community shelter to provide food and spiritual support.",
        content: `On January 25, 2026, members of Felege Yordanos Sunday School organized a community outreach visit to a local shelter in Addis Ababa, demonstrating the love and compassion at the heart of our faith.

**What We Did:**

- Prepared and served meals to over 100 individuals
- Distributed clothing and essential supplies
- Offered prayers and spiritual encouragement
- Spent quality time listening and sharing with shelter residents

**Volunteer Highlights:**

Over 40 Sunday School members, including youth and adults, participated in this outreach event. The enthusiasm and dedication of our volunteers was truly inspiring.

**Impact:**

The visit was met with heartfelt gratitude from the shelter community. Many expressed how the visit brought them hope and reminded them that they are not forgotten.

**Looking Ahead:**

This outreach is part of our ongoing commitment to serving the wider community. We plan to organize monthly outreach activities throughout 2026.

If you would like to volunteer for future outreach events, please contact the Sunday School service committee. Together, we can make a difference in the lives of those in need.

"Truly I tell you, whatever you did for one of the least of these brothers and sisters of mine, you did for me." - Matthew 25:40`,
        createdAt: "2026-01-25T09:00:00Z",
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

// Initialize localStorage with default news if empty
function initializeStore(): void {
    if (typeof window === "undefined") return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultNews))
    }
}

// Get all news articles, sorted by date (newest first)
export function getAllNews(): NewsArticle[] {
    if (typeof window === "undefined") return defaultNews
    initializeStore()
    try {
        const stored = localStorage.getItem(STORAGE_KEY)
        const articles: NewsArticle[] = stored ? JSON.parse(stored) : defaultNews
        return articles.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
    } catch {
        return defaultNews
    }
}

// Get a single news article by slug
export function getNewsBySlug(slug: string): NewsArticle | undefined {
    const articles = getAllNews()
    return articles.find((a) => a.slug === slug)
}

// Add a new news article
export function addNews(
    article: Omit<NewsArticle, "slug" | "createdAt">
): NewsArticle {
    const articles = getAllNews()
    const newArticle: NewsArticle = {
        ...article,
        slug: generateSlug(article.title),
        createdAt: new Date().toISOString(),
    }

    // Ensure unique slug
    let slugCount = 1
    let finalSlug = newArticle.slug
    while (articles.some((a) => a.slug === finalSlug)) {
        finalSlug = `${newArticle.slug}-${slugCount}`
        slugCount++
    }
    newArticle.slug = finalSlug

    articles.unshift(newArticle)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    return newArticle
}

// Update an existing news article
export function updateNews(
    slug: string,
    updates: Partial<Omit<NewsArticle, "slug" | "createdAt">>
): NewsArticle | null {
    const articles = getAllNews()
    const index = articles.findIndex((a) => a.slug === slug)
    if (index === -1) return null
    articles[index] = { ...articles[index], ...updates }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
    return articles[index]
}

// Delete a news article
export function deleteNews(slug: string): boolean {
    const articles = getAllNews()
    const filtered = articles.filter((a) => a.slug !== slug)
    if (filtered.length === articles.length) return false
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    return true
}
