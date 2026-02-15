import { MeetingsList } from "@/components/meetings/meetings-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function MeetingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground text-balance">Meetings</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Regular and emergency meeting records and decisions
          </p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="h-4 w-4" />
          New Meeting
        </Button>
      </div>
      <MeetingsList />
    </div>
  )
}
