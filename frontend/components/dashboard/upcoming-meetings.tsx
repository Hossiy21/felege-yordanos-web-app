import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

const meetings = [
  {
    title: "Weekly Wednesday Meeting",
    date: "Feb 11, 2026 at 6:00 PM",
    isEmergency: false,
  },
  {
    title: "Emergency: Facility Review",
    date: "Feb 12, 2026 at 3:00 PM",
    isEmergency: true,
  },
]

export function UpcomingMeetings() {
  return (
    <Card className="border border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-base font-semibold text-foreground">
          Upcoming Meetings
        </CardTitle>
        <Link
          href="/meetings"
          className="text-sm font-medium text-info hover:underline"
        >
          {"View all \u2192"}
        </Link>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 pt-0">
        {meetings.map((meeting) => (
          <div
            key={meeting.title}
            className="flex flex-col gap-1 p-3 rounded-md bg-muted/50"
          >
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium text-foreground">
                {meeting.title}
              </p>
              {meeting.isEmergency && (
                <Badge className="bg-red-100 text-red-700 border-red-200 text-[10px] px-1.5 py-0" variant="outline">
                  Emergency
                </Badge>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{meeting.date}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
