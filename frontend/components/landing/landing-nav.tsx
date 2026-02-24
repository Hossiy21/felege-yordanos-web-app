"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

const navLinks = [
  { label: "Home", href: "/home" },
  { label: "About", href: "/about" },
  { label: "News & Events", href: "/news" },
  { label: "Gallery", href: "/gallery" },
  { label: "Classes", href: "/classes" },
  { label: "Contact", href: "/contact" },
]

export function LandingNav() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-[#003366] backdrop-blur-md border-b border-border dark:border-white/10 transition-colors duration-300">
      <div className="mx-auto max-w-7xl flex items-center justify-between px-6 h-16">
        {/* Logo */}
        <Link href="/home" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#003366] dark:bg-white text-white dark:text-[#003366] font-bold text-xs shadow-lg">
            FY
          </div>
          <span className="text-lg font-bold text-[#003366] dark:text-white tracking-tight">Felege Yordanos</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-2" aria-label="Main navigation">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 text-sm font-bold transition-all relative group ${isActive
                  ? 'text-[#003366] dark:text-white'
                  : 'text-muted-foreground hover:text-[#003366] dark:text-white/80 dark:hover:text-white'
                  }`}
              >
                {link.label}
                {isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#FFB800] rounded-t-full" />
                )}
                {!isActive && (
                  <div className="absolute bottom-0 left-4 right-4 h-1 bg-[#FFB800] scale-x-0 group-hover:scale-x-100 transition-transform origin-center rounded-t-full" />
                )}
              </Link>
            )
          })}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          <ThemeToggle />
          <Link href="/signin">
            <Button variant="ghost" size="sm" className="text-[#003366] dark:text-white hover:bg-[#003366]/5 dark:hover:bg-white/10">
              Log In
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-bold">
              Enroll Now
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md hover:bg-[#003366]/5 dark:hover:bg-white/10 text-[#003366] dark:text-white"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-border dark:border-white/10 bg-white dark:bg-[#003366] px-6 py-4">
          <nav className="flex flex-col gap-3" aria-label="Mobile navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="text-sm font-bold text-muted-foreground hover:text-[#003366] dark:text-white/80 dark:hover:text-white transition-colors py-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 mt-4 pt-4 border-t border-border dark:border-white/10">
            <ThemeToggle />
            <Link href="/signin" className="flex-1">
              <Button variant="outline" size="sm" className="w-full border-[#003366]/20 dark:border-white/20 text-[#003366] dark:text-white hover:bg-[#003366]/5 dark:hover:bg-white/10">
                Log In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1">
              <Button size="sm" className="w-full bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-bold">
                Enroll Now
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
