import { CalendarDays, Clock, Users, AlertTriangle, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const meetings = [
  {
    title: "Weekly Wednesday Meeting",
    date: "Feb 11, 2026 at 6:00 PM",
    attendees: 12,
    decisions: 3,
    status: "Upcoming",
    isEmergency: false,
  },
  {
    title: "Emergency: Facility Safety Review",
    date: "Feb 12, 2026 at 3:00 PM",
    attendees: 8,
    decisions: 0,
    status: "Upcoming",
    isEmergency: true,
  },
  {
    title: "Weekly Wednesday Meeting",
    date: "Feb 4, 2026 at 6:00 PM",
    attendees: 15,
    decisions: 5,
    status: "Completed",
    isEmergency: false,
  },
  {
    title: "Weekly Wednesday Meeting",
    date: "Jan 28, 2026 at 6:00 PM",
    attendees: 14,
    decisions: 4,
    status: "Completed",
    isEmergency: false,
  },
  {
    title: "Emergency: Budget Overrun Discussion",
    date: "Jan 25, 2026 at 2:00 PM",
    attendees: 10,
    decisions: 6,
    status: "Completed",
    isEmergency: true,
  },
  {
    title: "Weekly Wednesday Meeting",
    date: "Jan 21, 2026 at 6:00 PM",
    attendees: 13,
    decisions: 3,
    status: "Completed",
    isEmergency: false,
  },
]

function getStatusVariant(status: string) {
  switch (status) {
    case "Upcoming":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function MeetingsList() {
  return (
    <div className="flex flex-col gap-4">
      {meetings.map((meeting, index) => (
        <Card
          key={`${meeting.title}-${index}`}
          className="border border-border hover:shadow-sm transition-shadow"
        >
          <CardContent className="flex items-center justify-between p-5">
            <div className="flex items-center gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  meeting.isEmergency
                    ? "bg-red-50 text-red-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {meeting.isEmergency ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <CalendarDays className="h-5 w-5" />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-foreground">
                    {meeting.title}
                  </p>
                  {meeting.isEmergency && (
                    <Badge
                      variant="outline"
                      className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0"
                    >
                      Emergency
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meeting.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meeting.attendees} attendees
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {meeting.decisions} decisions
                  </span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className={`text-xs shrink-0 ${getStatusVariant(meeting.status)}`}
            >
              {meeting.status}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
