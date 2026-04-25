"use client"

import { useAuth } from "@/lib/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { TopNav } from "@/components/top-nav"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/signin")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col flex-1 overflow-hidden">
          <TopNav />
          <main className="flex-1 overflow-y-auto bg-background p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
