"use client"

import { useState } from "react"
import { CalendarDays, Clock, MapPin, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EthiopianDatePicker } from "@/components/ui/ethiopian-date-picker"
import { type Meeting } from "./meetings-list"

export function EditMeetingDialog({
    meeting,
    onSave,
    open,
    onOpenChange
}: {
    meeting: Meeting
    onSave: (id: string, data: any) => void
    open: boolean
    onOpenChange: (open: boolean) => void
}) {
    const [title, setTitle] = useState(meeting.title)
    const [date, setDate] = useState(meeting.date)
    const [time, setTime] = useState(meeting.time || "")
    const [location, setLocation] = useState(meeting.location || "")
    const [agenda, setAgenda] = useState(meeting.agenda || "")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!meeting.id) return
        onSave(meeting.id, { title, date, time, location, agenda })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden">
                <DialogHeader className="bg-muted/40 px-6 py-4 border-b">
                    <DialogTitle className="text-xl">Edit Meeting Details</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Meeting Title</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <EthiopianDatePicker
                                    onChange={setDate}
                                    value={date}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <div className="relative">
                                    <Input
                                        id="time"
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="pl-9"
                                        required
                                    />
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <div className="relative">
                                <Input
                                    id="location"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="pl-9"
                                />
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="agenda">Agenda / Notes</Label>
                            <Textarea
                                id="agenda"
                                className="min-h-[100px] resize-none"
                                value={agenda}
                                onChange={(e) => setAgenda(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" className="gap-2">
                            <Save className="h-4 w-4" />
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
