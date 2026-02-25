"use client"

import { BookOpen, Users, Globe, Heart } from "lucide-react"
import { useTranslation } from "react-i18next"

export function AboutSection() {
  const { t } = useTranslation()

  const values = [
    {
      icon: BookOpen,
      title: t("religious_education"),
      description: t("religious_education_desc"),
    },
    {
      icon: Users,
      title: t("community_growth"),
      description: t("community_growth_desc"),
    },
    {
      icon: Heart,
      title: t("spiritual_service"),
      description: t("spiritual_service_desc"),
    },
    {
      icon: Globe,
      title: t("cultural_heritage"),
      description: t("cultural_heritage_desc"),
    },
  ]

  return (
    <section id="about" className="py-20 lg:py-28 bg-muted/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            {t("about_us_label")}
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            {t("our_mission")}
          </h2>
          <p className="mt-4 max-w-3xl mx-auto text-muted-foreground leading-relaxed">
            {t("about_description")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v) => (
            <div
              key={v.title}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-card border border-border"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[hsl(222,47%,11%)] text-[hsl(40,90%,50%)] mb-4">
                <v.icon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
