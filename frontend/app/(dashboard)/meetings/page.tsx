"use client"

import { useState } from "react"
import { MeetingsList, type Meeting } from "@/components/meetings/meetings-list"
import { CreateMeetingDialog } from "@/components/meetings/create-meeting-dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

const INITIAL_MEETINGS: Meeting[] = [
  {
    title: "Weekly Wednesday Meeting",
    date: "Feb 11, 2026",
    time: "6:00 PM",
    attendees: 12,
    decisions: 3,
    status: "Upcoming",
    isEmergency: false,
    type: "regular"
  },
  {
    title: "Emergency: Facility Safety Review",
    date: "Feb 12, 2026",
    time: "3:00 PM",
    attendees: 8,
    decisions: 0,
    status: "Upcoming",
    isEmergency: true,
    type: "emergency"
  },
  {
    title: "Weekly Wednesday Meeting",
    date: "Feb 4, 2026",
    time: "6:00 PM",
    attendees: 15,
    decisions: 5,
    status: "Completed",
    isEmergency: false,
    type: "regular"
  },
  {
    title: "Weekly Wednesday Meeting",
    date: "Jan 28, 2026",
    time: "6:00 PM",
    attendees: 14,
    decisions: 4,
    status: "Completed",
    isEmergency: false,
    type: "regular"
  },
  {
    title: "Emergency: Budget Overrun Discussion",
    date: "Jan 25, 2026",
    time: "2:00 PM",
    attendees: 10,
    decisions: 6,
    status: "Completed",
    isEmergency: true,
    type: "emergency"
  },
  {
    title: "Weekly Wednesday Meeting",
    date: "Jan 21, 2026",
    time: "6:00 PM",
    attendees: 13,
    decisions: 3,
    status: "Completed",
    isEmergency: false,
    type: "regular"
  },
]

export default function MeetingsPage() {
  const [meetings, setMeetings] = useState<Meeting[]>(INITIAL_MEETINGS)

  const handleCreateMeeting = (newMeetingData: any) => {
    const newMeeting: Meeting = {
      title: newMeetingData.title,
      date: newMeetingData.date, // This will be Ethiopian date string from the picker
      time: newMeetingData.time,
      location: newMeetingData.location,
      attendees: 0, // Default for new meeting
      decisions: 0,
      status: "Upcoming",
      isEmergency: newMeetingData.type === 'emergency',
      type: newMeetingData.type,
      agenda: newMeetingData.agenda
    }
    setMeetings([newMeeting, ...meetings])
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Meetings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Regular and emergency meeting records and decisions
          </p>
        </div>
        <CreateMeetingDialog onCreate={handleCreateMeeting}>
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" />
            New Meeting
          </Button>
        </CreateMeetingDialog>
      </div>
      <MeetingsList meetings={meetings} />
    </div>
  )
}
