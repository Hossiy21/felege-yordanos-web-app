import { Mail, Send, Clock, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const stats = [
  {
    label: "Outgoing Letters",
    value: "42",
    change: "+5 this week",
    changeColor: "text-success",
    icon: Send,
    iconBg: "bg-blue-50 text-info",
  },
  {
    label: "Incoming Letters",
    value: "38",
    change: "+3 this week",
    changeColor: "text-success",
    icon: Mail,
    iconBg: "bg-emerald-50 text-success",
  },
  {
    label: "Pending Approval",
    value: "7",
    change: "2 urgent",
    changeColor: "text-warning",
    icon: Clock,
    iconBg: "bg-amber-50 text-warning",
  },
  {
    label: "Meetings This Month",
    value: "6",
    change: "Next: Wed Feb 11",
    changeColor: "text-muted-foreground",
    icon: CalendarDays,
    iconBg: "bg-slate-100 text-muted-foreground",
  },
]

export function DashboardStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border border-border">
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              <p className={`text-xs font-medium ${stat.changeColor}`}>
                {stat.change}
              </p>
            </div>
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.iconBg}`}>
              <stat.icon className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
