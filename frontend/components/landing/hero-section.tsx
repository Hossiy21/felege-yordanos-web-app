"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Mail, CalendarDays, FileText, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

export function HeroSection() {
  const { t } = useTranslation()

  const features = [
    { icon: Mail, label: t("letter_mgmt_feature") },
    { icon: CalendarDays, label: t("meeting_records") },
    { icon: FileText, label: t("document_security") },
    { icon: ShieldCheck, label: t("approval_workflows") },
  ]

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-24 lg:py-32">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm text-muted-foreground mb-6">
            <span className="h-2 w-2 rounded-full bg-success" />
            {t("hero_badge")}
          </div>

          {/* Heading */}
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance leading-tight">
            <span className="text-[hsl(40,90%,45%)] text-2xl sm:text-3xl block mb-4">
              ቦሌ ደብረ ሳሌም መድኃኔዓለም መጥምቁ ቅዱስ ዮሐንስ ወአቡነ አረጋዊ ካቴድራል
            </span>
            ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
          </h1>

          {/* Sub-heading */}
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed text-pretty">
            {t("hero_subtitle")}
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="gap-2 bg-[#003366] text-white hover:bg-[#003366]/90 px-8 font-bold">
                {t("join_sunday_school")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="px-8 border-[#003366] text-[#003366] font-bold">
                {t("about_us")}
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-4">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm group hover:border-[#FFB800] transition-colors"
              >
                <f.icon className="h-4 w-4 text-[#FFB800]" />
                {f.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-40 right-0 h-[500px] w-[500px] rounded-full bg-[#FFB800]/10 blur-3xl" />
        <div className="absolute -bottom-40 left-0 h-[500px] w-[500px] rounded-full bg-[#003366]/10 blur-3xl" />
      </div>
    </section>
  )
}
