"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTranslation } from "react-i18next"
import {
  LayoutDashboard,
  Mail,
  Send,
  CalendarDays,
  FileText,
  ClipboardList,
  Users,
  Settings,
  ChevronLeft,
  Newspaper,
  Image as ImageIcon,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/auth-context"
import { Shield } from "lucide-react"
import { useState } from "react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"

export function AppSidebar() {
  const pathname = usePathname()
  const { t } = useTranslation()
  const { user } = useAuth()
  const { isMobile, setOpenMobile } = useSidebar()

  const navSections = [
    {
      label: t("overview"),
      items: [
        { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: t("letter_management"),
      dept: "letters",
      items: [
        { name: t("incoming"), href: "/letters/incoming", icon: Mail },
        { name: t("outgoing"), href: "/letters/outgoing", icon: Send },
      ],
    },
    {
      label: t("operations"),
      items: [
        { name: t("meetings"), href: "/meetings", icon: CalendarDays },
        { name: t("documents"), href: "/documents", icon: FileText },
        { name: t("news_management"), href: "/news-management", icon: Newspaper, dept: "news" },
        { name: t("gallery_management"), href: "/gallery-management", icon: ImageIcon, dept: "graphics" },
      ],
    },
    {
      label: t("administration"),
      items: [
        { name: t("audit_logs"), href: "/audit", icon: ClipboardList, role: "admin" },
        { name: t("user_management"), href: "/users", icon: Users, role: "admin" },
        { name: t("security"), href: "/security", icon: Shield, role: "admin" },
        { name: t("settings"), href: "/settings", icon: Settings },
      ],
    },
  ]

  const filteredSections = navSections
    .map((section) => ({
      ...section,
      items: section.items.filter((item: any) => {
        const userRole = user?.authDetails?.role || user?.role
        const userDept = user?.authDetails?.department || user?.department
        if (userRole === "admin") return true
        if (item.role && item.role !== userRole) return false
        const itemDept = item.dept || (section as any).dept
        if (itemDept && itemDept !== userDept) return false
        return true
      }),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar shadow-xl">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#003366] to-[#004080] text-white font-bold text-sm shadow-lg ring-1 ring-white/10">
            FY
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-black text-sidebar-accent-foreground tracking-tight truncate leading-none">
              Felege Yordanos
            </span>
            <span className="text-[10px] font-bold text-sidebar-muted uppercase tracking-widest mt-1.5 opacity-70 truncate">
              {t("sunday_school")}
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="px-2 py-4 no-scrollbar">
        {filteredSections.map((section) => (
          <SidebarGroup key={section.label} className="mb-2">
            <SidebarGroupLabel className="px-3 mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-sidebar-muted/60 group-data-[collapsible=icon]:hidden">
              {section.label}
            </SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.name}
                      onClick={() => isMobile && setOpenMobile(false)}
                      className={cn(
                        "h-11 rounded-lg px-3 transition-all duration-200",
                        isActive 
                          ? "bg-[#003366] text-white shadow-md shadow-[#003366]/20" 
                          : "hover:bg-sidebar-accent/80 hover:scale-[1.02]"
                      )}
                    >
                      <Link href={item.href} className="flex items-center gap-3">
                        <item.icon className={cn("h-[18px] w-[18px] shrink-0", isActive ? "text-white" : "text-sidebar-muted")} />
                        <span className={cn("text-[13px] font-bold", isActive ? "text-white" : "text-sidebar-foreground/80")}>
                          {item.name}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-4 group-data-[collapsible=icon]:p-2">
        <div className="bg-sidebar-accent/30 rounded-xl p-3 flex items-center gap-3 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:bg-transparent">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
             <span className="text-xs font-bold text-sidebar-foreground truncate">{user?.fullName || "Guest"}</span>
             <span className="text-[10px] text-sidebar-muted truncate">{user?.role || "Visitor"}</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
