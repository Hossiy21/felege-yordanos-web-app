"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section className="relative w-full min-h-screen flex flex-col overflow-hidden">
      {/* ── Full-screen church background image ── */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/bole-church.png"
          alt="Bole Debre Salem Medhanealem Cathedral"
          className="w-full h-full object-cover object-center animate-ken-burns"
        />
        {/* Layered dark gradient overlays for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/50 to-black/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col items-center justify-center flex-1 text-white text-center px-6 pt-32 pb-24 animate-fade-in-up">
        {/* Amharic super-label badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#FFB800]/10 backdrop-blur-sm px-5 py-2 text-sm font-semibold text-[#FFB800] tracking-wide mb-8">
          <span className="h-2 w-2 rounded-full bg-[#FFB800] animate-pulse" />
          ቦሌ ደብረ ሳሌም መድኃኔዓለም ካቴድራል
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-balance max-w-5xl mb-6 drop-shadow-lg">
          ፈለገ ዮርዳኖስ
          <br />
          <span className="text-[#FFB800]">ሰንበት ትምህርት ቤት</span>
        </h1>

        {/* English sub-heading */}
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-white/80 tracking-wide mb-4 drop-shadow">
          Felege Yordanos Sunday School
        </p>

        <p className="max-w-2xl text-base sm:text-lg text-white/65 leading-relaxed mb-12 font-medium">
          {t("hero_subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup">
            <Button
              size="lg"
              className="bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-bold text-base px-8 h-12 rounded-full shadow-2xl hover:shadow-[#FFB800]/30 hover:scale-105 transition-all group"
            >
              {t("join_sunday_school")}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/about">
            <Button
              size="lg"
              variant="outline"
              className="border-white/40 text-white hover:bg-white/15 font-bold text-base px-8 h-12 rounded-full backdrop-blur-sm"
            >
              {t("about_us")}
            </Button>
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white/50 animate-bounce">
          <span className="text-[10px] uppercase tracking-widest font-semibold">Scroll</span>
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

      {/* ── Bottom wave into next section ── */}
      <div className="relative z-10 h-16 -mt-1">
        <svg viewBox="0 0 1440 64" className="absolute bottom-0 w-full" preserveAspectRatio="none">
          <path d="M0,64 C360,0 1080,64 1440,0 L1440,64 Z" fill="currentColor" className="text-background" />
        </svg>
      </div>
    </section>
  )
}
