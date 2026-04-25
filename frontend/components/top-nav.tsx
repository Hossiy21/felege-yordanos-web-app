"use client"

import { useState, useEffect } from "react"
import { Bell, LogOut, Settings, ChevronDown, Calendar } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useTranslation } from "react-i18next"
import i18nInstance from "@/lib/i18n"
import { useAuth } from "@/lib/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function TopNav() {
  const { user, signOut } = useAuth()
  const { t } = useTranslation()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const initials = user?.fullName
    ? user.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
    : "AU"

  const today = new Date()
  // Use direct instance for reliable language access
  const currentLang = i18nInstance.language || "en"
  const formattedDate = new Intl.DateTimeFormat(currentLang === 'am' || currentLang === 'gez' ? 'am-ET' : 'en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(today)

  const hour = today.getHours()
  let greeting = t('greeting_evening')
  if (hour < 12) greeting = t('greeting_morning')
  else if (hour < 18) greeting = t('greeting_afternoon')

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between h-[5rem] px-4 md:px-8 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 transition-all duration-300 shadow-sm">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="md:hidden h-9 w-9" />
        <div className="flex flex-col justify-center">
          {mounted ? (
            <div className="animate-in fade-in slide-in-from-left-2 duration-700">
              <h2 className="text-[17px] font-black tracking-tight text-foreground/90 flex items-center gap-2">
                {greeting}, {user?.fullName?.split(" ")[0] || t("user")}
              </h2>
              <div className="flex items-center gap-2 mt-1 text-muted-foreground/70">
                <Calendar className="h-3.5 w-3.5 text-primary/60" />
                <span className="text-[11px] font-bold uppercase tracking-wider">{formattedDate}</span>
              </div>
            </div>
          ) : (
            <div className="h-[42px] opacity-0" />
          )}
        </div>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-1 md:gap-3 ml-4">
        <div className="flex items-center gap-0.5 md:gap-1">
          <LanguageToggle />
          <ThemeToggle />

          {/* Notification Bell */}
          <button
            className="relative group p-2.5 rounded-xl hover:bg-muted/80 transition-all duration-200 border border-transparent hover:border-border/30 focus:outline-none focus:ring-2 focus:ring-primary/10"
            aria-label="Notifications"
          >
            <Bell className="h-[20px] w-[20px] text-muted-foreground/80 group-hover:text-foreground transition-colors" />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[#FF4D4D] border-[2px] border-background" />
          </button>
        </div>

        <div className="h-10 w-px bg-border/40 hidden md:block mx-2" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3.5 rounded-2xl hover:bg-muted/60 p-1.5 pr-4 transition-all duration-300 border border-transparent hover:border-border/50 focus:outline-none focus:ring-4 focus:ring-primary/5 group">
              <Avatar className="h-10 w-10 rounded-xl ring-2 ring-background shadow-lg transition-transform duration-300 group-hover:scale-105">
                <AvatarFallback className="bg-gradient-to-br from-[#003366] to-[#004d99] text-white text-sm font-black tracking-tighter">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:flex flex-col gap-0.5">
                <span className="text-[13px] font-bold leading-none text-foreground/90 group-hover:text-primary transition-colors">
                  {user?.fullName || t("admin_user")}
                </span>
                <span className="text-[10px] font-black text-muted-foreground/60 uppercase tracking-[0.05em] leading-none">
                  {user?.role || t("administrator")}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground/40 hidden md:block ml-1 group-hover:text-foreground group-hover:rotate-180 transition-all duration-300" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-64 mt-3 rounded-2xl border-border/50 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] p-2 overflow-hidden" sideOffset={8}>
            <DropdownMenuLabel className="font-normal flex flex-col space-y-2 p-3 bg-muted/30 rounded-xl mb-2">
              <p className="text-[13px] font-bold leading-none text-foreground">{user?.fullName || t("admin_user")}</p>
              <p className="text-[11px] text-muted-foreground leading-none font-medium truncate">{user?.email || "admin@sst.org"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/30 mb-1" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-xl cursor-pointer text-[13px] font-bold p-3 focus:bg-muted/80 transition-colors group">
                <Settings className="mr-3 h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <span>{t("account_settings")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/30 my-1" />
            <DropdownMenuItem onClick={signOut} className="rounded-xl cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive text-[13px] font-black p-3 transition-colors group">
              <LogOut className="mr-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              <span>{t("sign_out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
