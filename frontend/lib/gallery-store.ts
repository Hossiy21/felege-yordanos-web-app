const API_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8000/api"

export interface GalleryItem {
    id: string
    title: string
    category: string
    image_url: string
    description: string
    created_at: string
}

export async function getGalleryItems(page = 1, limit = 20) {
    const res = await fetch(`${API_URL}/news/gallery?page=${page}&limit=${limit}`, {
        next: { revalidate: 60, tags: ['gallery'] },
    })

    if (!res.ok) {
        throw new Error('Failed to fetch gallery')
    }

    return res.json()
}

export async function uploadGalleryImage(file: File): Promise<{ image_url: string }> {
    const formData = new FormData()
    formData.append("image", file)

    const res = await fetch(`${API_URL}/news/gallery/upload`, {
        method: "POST",
        body: formData,
        credentials: "include",
    })
    if (!res.ok) throw new Error("Upload failed")
    return res.json()
}

export async function createGalleryItem(data: Partial<GalleryItem>) {
    const res = await fetch(`${API_URL}/news/gallery`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
    })
    if (!res.ok) throw new Error("Create failed")
    return res.json()
}

export async function deleteGalleryItem(id: string) {
    const res = await fetch(`${API_URL}/news/gallery/${id}`, {
        method: "DELETE",
        credentials: "include",
    })
    if (!res.ok) throw new Error("Delete failed")
    return res.json()
}
