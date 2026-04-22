"use client"

import { useState } from "react"
import { CheckCircle2, Users, MessageSquare, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function CompleteMeetingDialog({
    meetingId,
    meetingTitle,
    onComplete,
    children
}: {
    meetingId: string
    meetingTitle: string
    onComplete: (id: string, data: any) => void
    children: React.ReactNode
}) {
    const [open, setOpen] = useState(false)
    const [attendees, setAttendees] = useState("")
    const [decisions, setDecisions] = useState("")
    const [minutes, setMinutes] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onComplete(meetingId, {
            attendees: parseInt(attendees) || 0,
            decisions: decisions.split('\n').filter(d => d.trim()).length,
            agenda: minutes || "Completed with decisions recorded",
            status: "Completed"
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden">
                <div className="bg-emerald-500/10 px-6 py-6 border-b border-emerald-500/20">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-600">
                            <CheckCircle2 className="h-6 w-6" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl">Complete Meeting</DialogTitle>
                            <DialogDescription className="text-emerald-700/70">
                                Record final minutes and decisions for "{meetingTitle}"
                            </DialogDescription>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="attendees" className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-primary" />
                                Final Attendee Count
                            </Label>
                            <Input
                                id="attendees"
                                type="number"
                                placeholder="Total number of attendees"
                                value={attendees}
                                onChange={(e) => setAttendees(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="decisions" className="flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                Key Decisions (One per line)
                            </Label>
                            <Textarea
                                id="decisions"
                                placeholder="Enter each decision on a new line..."
                                className="min-h-[100px] resize-none"
                                value={decisions}
                                onChange={(e) => setDecisions(e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="minutes" className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-blue-500" />
                                Meeting Summary / Minutes
                            </Label>
                            <Textarea
                                id="minutes"
                                placeholder="Optional summary of the discussion..."
                                className="min-h-[120px] resize-none"
                                value={minutes}
                                onChange={(e) => setMinutes(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="bg-muted/30 -mx-6 -mb-6 p-4 border-t gap-2 sm:gap-0">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                            <Save className="h-4 w-4" />
                            File Minutes & Close
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
