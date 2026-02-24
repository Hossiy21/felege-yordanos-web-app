import { CalendarDays, Clock, Users, AlertTriangle, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export interface Meeting {
  id?: string
  title: string
  date: string
  time?: string
  location?: string
  attendees: number
  decisions: number
  status: "Upcoming" | "Completed" | "Cancelled"
  isEmergency: boolean
  type?: "regular" | "emergency" | "special"
  agenda?: string
}

interface MeetingsListProps {
  meetings: Meeting[]
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Upcoming":
      return "bg-blue-50 text-blue-700 border-blue-200"
    case "Completed":
      return "bg-emerald-50 text-emerald-700 border-emerald-200"
    case "Cancelled":
      return "bg-red-50 text-red-700 border-red-200"
    default:
      return "bg-gray-50 text-gray-500 border-gray-200"
  }
}

export function MeetingsList({ meetings }: MeetingsListProps) {
  if (!meetings?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed rounded-lg border-muted">
        <CalendarDays className="h-10 w-10 text-muted-foreground/50 mb-3" />
        <h3 className="text-lg font-medium text-foreground">No meetings scheduled</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Pass "Create New" to schedule your first meeting.
        </p>
      </div>
    )
  }

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
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${meeting.isEmergency
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
                  {meeting.type === 'special' && (
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 text-[10px] px-1.5 py-0">
                      Special
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {meeting.date} {meeting.time ? `at ${meeting.time}` : ""}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {meeting.attendees} attendees
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    {meeting.decisions} decisions
                  </span>
                  {meeting.location && (
                    <span className="flex items-center gap-1">
                      📍 {meeting.location}
                    </span>
                  )}
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
