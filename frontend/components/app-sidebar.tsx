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
import { useState } from "react"

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useTranslation()

  const navSections = [
    {
      label: t("overview"),
      items: [
        { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
      ],
    },
    {
      label: t("letter_management"),
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
        { name: t("news_management"), href: "/news-management", icon: Newspaper },
        { name: t("gallery_management"), href: "/gallery-management", icon: ImageIcon },
      ],
    },
    {
      label: t("administration"),
      items: [
        { name: t("audit_logs"), href: "/audit", icon: ClipboardList },
        { name: t("user_management"), href: "/users", icon: Users },
        { name: t("settings"), href: "/settings", icon: Settings },
      ],
    },
  ]

  return (
    <aside
      className={cn(
        "flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-all duration-300 relative",
        collapsed ? "w-16" : "w-60"
      )}
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">
          SST
        </div>
        {!collapsed && (
          <div className="flex flex-col overflow-hidden">
            <span className="text-sm font-semibold text-sidebar-accent-foreground truncate">
              Felege Yordanos
            </span>
            <span className="text-xs text-sidebar-muted truncate">
              {t("sunday_school")}
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2">
        {navSections.map((section) => (
          <div key={section.label} className="mb-4">
            {!collapsed && (
              <p className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-wider text-sidebar-muted">
                {section.label}
              </p>
            )}
            <ul className="flex flex-col gap-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href))
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.name}</span>}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-sidebar-muted hover:text-sidebar-accent-foreground transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        <ChevronLeft
          className={cn(
            "h-4 w-4 transition-transform",
            collapsed && "rotate-180"
          )}
        />
      </button>
    </aside>
  )
}
