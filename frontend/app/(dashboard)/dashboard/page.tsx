"use client"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentLetters } from "@/components/dashboard/recent-letters"
import { UpcomingMeetings } from "@/components/dashboard/upcoming-meetings"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { useTranslation } from "react-i18next"

export default function DashboardPage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground text-balance">{t("dashboard_title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("dashboard_welcome")}
        </p>
      </div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentLetters />
        </div>
        <div className="flex flex-col gap-6">
          <UpcomingMeetings />
          <QuickActions />
        </div>
      </div>
    </div>
  )
}
