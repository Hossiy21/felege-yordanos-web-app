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
    <header className="sticky top-0 z-40 flex items-center justify-between h-[4.5rem] px-6 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 transition-all duration-200 shadow-sm">
      <div className="flex-1 flex flex-col justify-center">
        {mounted ? (
          <div className="animate-in fade-in slide-in-from-left-2 duration-500">
            <h2 className="text-[15px] font-bold tracking-tight text-foreground flex items-center gap-2">
              {greeting}, {user?.fullName?.split(" ")[0] || t("user")} <span className="text-sm"></span>
            </h2>
            <div className="flex items-center gap-1.5 mt-0.5 text-muted-foreground">
              <Calendar className="h-3.5 w-3.5 text-primary/80" />
              <span className="text-[12px] font-medium">{formattedDate}</span>
            </div>
          </div>
        ) : (
          <div className="h-[38px] opacity-0" />
        )}
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2 md:gap-4 ml-4">
        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />

          {/* Notification Bell */}
          <button
            className="relative group p-2.5 rounded-full hover:bg-muted/60 transition-all duration-200 border border-transparent hover:border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20"
            aria-label="Notifications"
          >
            <Bell className="h-[20px] w-[20px] text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-destructive border-[1.5px] border-background animate-pulse" />
          </button>
        </div>

        <div className="h-8 w-px bg-border/50 hidden md:block" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full md:rounded-[1rem] hover:bg-muted/50 p-1.5 pr-3 transition-all duration-200 border border-transparent hover:border-border/60 focus:outline-none focus:ring-[3px] focus:ring-primary/10 group">
              <Avatar className="h-9 w-9 rounded-full ring-[2px] ring-background shadow-sm transition-transform duration-200 group-hover:scale-105">
                <AvatarFallback className="bg-primary/10 text-primary text-sm font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:flex flex-col">
                <span className="text-[13px] font-semibold leading-tight text-foreground">
                  {user?.fullName || t("admin_user")}
                </span>
                <span className="text-[11px] font-medium text-muted-foreground mt-[2px]">
                  {user?.role || t("administrator")}
                </span>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground hidden md:block ml-1 opacity-40 group-hover:opacity-100 transition-opacity" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 mt-2 rounded-xl border-border/60 shadow-xl p-1.5 overflow-hidden" sideOffset={8}>
            <DropdownMenuLabel className="font-normal flex flex-col space-y-1 p-2 bg-muted/20 rounded-lg mb-1">
              <p className="text-sm font-semibold leading-none text-foreground">{user?.fullName || t("admin_user")}</p>
              <p className="text-[12px] text-muted-foreground leading-none mt-1.5">{user?.email || "admin@sst.org"}</p>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuGroup>
              <DropdownMenuItem className="rounded-lg cursor-pointer text-[13px] font-medium p-2.5 focus:bg-muted/60 transition-colors">
                <Settings className="mr-2.5 h-4 w-4 text-muted-foreground" />
                <span>{t("account_settings")}</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-border/40" />
            <DropdownMenuItem onClick={signOut} className="rounded-lg cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive text-[13px] font-medium p-2.5 transition-colors">
              <LogOut className="mr-2.5 h-4 w-4" />
              <span>{t("sign_out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
