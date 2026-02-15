import { Mail, CalendarDays, FileText, Upload } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const actions = [
  { label: "New Letter", href: "/letters/outgoing", icon: Mail },
  { label: "New Meeting", href: "/meetings", icon: CalendarDays },
  { label: "Upload Doc", href: "/documents", icon: Upload },
  { label: "View Logs", href: "/audit", icon: FileText },
]

export function QuickActions() {
  return (
    <Card className="border border-border">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pt-0">
        {actions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border bg-card hover:bg-muted transition-colors text-center"
          >
            <action.icon className="h-5 w-5 text-muted-foreground" />
            <span className="text-xs font-medium text-foreground">{action.label}</span>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
