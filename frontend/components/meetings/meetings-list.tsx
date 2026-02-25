import { CalendarDays, Clock, Users, AlertTriangle, MessageSquare, Eye, Bell, MoreHorizontal } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export interface Meeting {
  id?: string
  title: string
  date: string
  time?: string
  location?: string
  attendees: number
  decisions: number
  status: "Upcoming" | "Completed" | "Cancelled"
  is_emergency: boolean
  type?: "regular" | "emergency" | "special"
  agenda?: string
}

interface MeetingsListProps {
  meetings: Meeting[]
}

function getStatusVariant(status: string) {
  switch (status) {
    case "Upcoming":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20"
    case "Completed":
      return "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
    case "Cancelled":
      return "bg-red-500/10 text-red-600 border-red-500/20"
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20"
  }
}

export function MeetingsList({ meetings }: MeetingsListProps) {
  if (!meetings?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-2xl border-muted/50 bg-muted/5">
        <div className="h-16 w-16 rounded-full bg-muted/20 flex items-center justify-center mb-4">
          <CalendarDays className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-xl font-bold text-foreground">No meetings recorded</h3>
        <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
          Start building your history by scheduling your first meeting.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {meetings.map((meeting, index) => (
        <Card
          key={`${meeting.title}-${index}`}
          className="group border-border/40 bg-card/50 backdrop-blur-sm hover:bg-card hover:shadow-md hover:border-border transition-all duration-300"
        >
          <CardContent className="p-0">
            <div className="flex flex-col sm:flex-row sm:items-center">
              {/* Date Side Pillar (Mobile: Top Bar) */}
              <div className={`w-full sm:w-24 flex sm:flex-col items-center justify-center py-4 px-2 sm:border-r border-border/40 ${meeting.status === "Upcoming" ? "bg-primary/5" : "bg-muted/30"
                }`}>
                <span className="text-xs font-bold text-muted-foreground uppercase mb-1 sm:mb-0 mr-2 sm:mr-0">Feb</span>
                <span className="text-2xl font-black text-foreground leading-none">11</span>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl shadow-sm ${meeting.is_emergency
                      ? "bg-red-100 dark:bg-red-950/30 text-red-600"
                      : "bg-primary/10 text-primary"
                      }`}
                  >
                    {meeting.is_emergency ? (
                      <AlertTriangle className="h-6 w-6" />
                    ) : (
                      <CalendarDays className="h-6 w-6" />
                    )}
                  </div>
                  <div className="space-y-1.5 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-bold text-foreground truncate max-w-[280px]">
                        {meeting.title}
                      </h3>
                      {meeting.is_emergency && (
                        <Badge className="bg-red-500 hover:bg-red-600 text-[10px] px-2 py-0 h-4 border-none">
                          EXTREME
                        </Badge>
                      )}
                      {meeting.type === 'special' && (
                        <Badge variant="secondary" className="text-[10px] px-2 py-0 h-4 bg-purple-500/10 text-purple-600 border-none">
                          Special Focus
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs font-medium text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-primary/60" />
                        {meeting.time || "TBD"}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-3.5 w-3.5 text-primary/60" />
                        {meeting.attendees} Members
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageSquare className="h-3.5 w-3.5 text-primary/60" />
                        {meeting.decisions} Decisions
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end md:self-center">
                  <Badge
                    variant="outline"
                    className={`text-[10px] font-bold tracking-tight px-2 py-0.5 rounded-full ${getStatusVariant(meeting.status)}`}
                  >
                    {(meeting.status || "Upcoming").toUpperCase()}
                  </Badge>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-primary hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                      <Bell className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
                        <DropdownMenuItem>Generate PDF Minutes</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Cancel Session</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
