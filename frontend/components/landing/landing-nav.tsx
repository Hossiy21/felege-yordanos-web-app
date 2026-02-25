"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { LanguageToggle } from "@/components/language-toggle"
import { useTranslation } from "react-i18next"

export function LandingNav() {
  const { t } = useTranslation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  const navLinks = [
    { label: t("home"), href: "/home" },
    { label: t("about"), href: "/about" },
    { label: t("news_events"), href: "/news" },
    { label: t("gallery"), href: "/gallery" },
    { label: t("contact"), href: "/contact" },
  ]

  // Handle subtle visual changes on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${scrolled
        ? "bg-background/80 backdrop-blur-xl border-border/40 shadow-[0_4px_30px_rgba(0,0,0,0.03)] supports-[backdrop-filter]:bg-background/60 py-2"
        : "bg-background/40 backdrop-blur-sm border-transparent py-4"
        }`}
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 transition-all duration-300">
        {/* Logo Area */}
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#003366] to-[#004080] dark:from-primary dark:to-primary/80 text-white font-bold text-sm shadow-md group-hover:shadow-lg group-hover:scale-105 transition-all duration-300 ring-1 ring-black/5 dark:ring-white/10">
            FY
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold text-[#003366] dark:text-foreground tracking-tight leading-none group-hover:opacity-80 transition-opacity">
              Felege Yordanos
            </span>
            <span className="text-[10px] font-medium text-muted-foreground mt-1 max-w-[200px] sm:max-w-[300px] truncate leading-tight opacity-80">
              ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1.5 p-1.5 rounded-full bg-muted/40 backdrop-blur-md border border-border/50" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-[13px] font-semibold rounded-full transition-all duration-300 ${isActive
                  ? 'bg-background text-[#003366] dark:text-foreground shadow-sm ring-1 ring-border/50'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
                  }`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Actions Desktop */}
        <div className="hidden lg:flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <div className="h-6 w-px bg-border/60 mx-1" />
          <Link href="/signin">
            <Button variant="ghost" size="sm" className="text-[13px] font-semibold hover:bg-muted/60 transition-colors h-9 px-4 rounded-full">
              {t("log_in")}
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-bold text-[13px] h-9 px-5 rounded-full shadow-sm hover:shadow transition-all group">
              {t("enroll_now")}
              <ChevronRight className="ml-1 h-3.5 w-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-muted/60 text-foreground transition-colors border border-transparent hover:border-border/50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 border-b border-border/40 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 px-6 py-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`text-[15px] font-semibold px-4 py-3 rounded-xl transition-all ${isActive
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
          <div className="flex flex-col gap-3 mt-6 pt-6 border-t border-border/40">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-muted-foreground">{t("language")}</span>
              <LanguageToggle />
            </div>
            <div className="flex items-center justify-between px-2 mb-2">
              <span className="text-sm font-medium text-muted-foreground">{t("appearance")}</span>
              <ThemeToggle />
            </div>
            <div className="flex gap-3">
              <Link href="/signin" className="flex-1">
                <Button variant="outline" size="sm" className="w-full text-foreground rounded-xl h-11 font-semibold border-border/60">
                  {t("log_in")}
                </Button>
              </Link>
              <Link href="/signup" className="flex-1">
                <Button size="sm" className="w-full bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-bold rounded-xl h-11">
                  {t("enroll_now")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
