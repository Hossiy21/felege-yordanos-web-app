"use client"

import { Mail, Send, CalendarDays, FileText, ClipboardList, Users, Settings, ShieldCheck } from "lucide-react"
import { useTranslation } from "react-i18next"

export function ProgramsSection() {
  const { t } = useTranslation()

  const programs = [
    {
      icon: Mail,
      title: t("incoming_letters_title"),
      description: t("incoming_letters_desc"),
      tag: t("tag_letter_management"),
    },
    {
      icon: Send,
      title: t("outgoing_letters_title"),
      description: t("outgoing_letters_desc"),
      tag: t("tag_letter_management"),
    },
    {
      icon: CalendarDays,
      title: t("meeting_management"),
      description: t("meeting_management_desc"),
      tag: t("tag_operations"),
    },
    {
      icon: FileText,
      title: t("document_storage"),
      description: t("document_storage_desc"),
      tag: t("tag_operations"),
    },
    {
      icon: ClipboardList,
      title: t("audit_logs"),
      description: t("audit_logs_desc"),
      tag: t("tag_administration"),
    },
    {
      icon: Users,
      title: t("user_management"),
      description: t("user_management_desc"),
      tag: t("tag_administration"),
    },
    {
      icon: ShieldCheck,
      title: t("approval_workflows"),
      description: t("approval_workflows_desc"),
      tag: t("tag_workflow"),
    },
    {
      icon: Settings,
      title: t("system_settings"),
      description: t("system_settings_desc"),
      tag: t("tag_configuration"),
    },
  ]

  return (
    <section id="programs" className="py-20 lg:py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <p className="text-sm font-semibold uppercase tracking-wider text-[hsl(40,90%,45%)] mb-3">
            {t("features_programs")}
          </p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
            {t("everything_you_need")}
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
            {t("programs_subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {programs.map((p) => (
            <div
              key={p.title}
              className="group flex flex-col p-6 rounded-xl border border-border bg-card hover:border-[hsl(40,90%,50%)]/40 hover:shadow-md transition-all"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground mb-4 group-hover:bg-[hsl(222,47%,11%)] group-hover:text-[hsl(40,90%,50%)] transition-colors">
                <p.icon className="h-5 w-5" />
              </div>
              <span className="inline-block self-start rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
                {p.tag}
              </span>
              <h3 className="text-base font-semibold text-foreground mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
