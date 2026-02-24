"use client"

import { useState } from "react"
import { CalendarDays, Clock, MapPin, Users, AlignLeft, CheckCircle2, AlertTriangle } from "lucide-react"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { EthiopianDatePicker } from "@/components/ui/ethiopian-date-picker"
import { cn } from "@/lib/utils"

const MEETING_TYPES = [
    { value: "regular", label: "Regular Meeting", icon: CalendarDays, color: "text-blue-500" },
    { value: "emergency", label: "Emergency Meeting", icon: AlertTriangle, color: "text-red-500" },
    { value: "special", label: "Special Session", icon: CheckCircle2, color: "text-purple-500" },
]

export function CreateMeetingDialog({
    children,
    onCreate,
}: {
    children: React.ReactNode
    onCreate?: (meeting: any) => void
}) {
    const [open, setOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [location, setLocation] = useState("")
    const [type, setType] = useState("regular")
    const [agenda, setAgenda] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Here you would typically call an API
        console.log({ title, date, time, location, type, agenda })
        onCreate?.({ title, date, time, location, type, agenda })
        setOpen(false)
        resetForm()
    }

    const resetForm = () => {
        setTitle("")
        setDate("")
        setTime("")
        setLocation("")
        setType("regular")
        setAgenda("")
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden gap-0">
                <div className="bg-muted/40 px-6 py-4 border-b">
                    <DialogTitle className="text-xl">Schedule New Meeting</DialogTitle>
                    <DialogDescription>
                        Create a meeting event and notify attendees.
                    </DialogDescription>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Meeting Title</Label>
                            <Input
                                id="title"
                                placeholder="e.g., Weekly Staff Sync"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="font-medium"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <EthiopianDatePicker
                                    onChange={setDate}
                                    placeholder="Select Date"
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

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Meeting Type</Label>
                                <Select value={type} onValueChange={setType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MEETING_TYPES.map((t) => (
                                            <SelectItem key={t.value} value={t.value}>
                                                <div className="flex items-center gap-2">
                                                    <t.icon className={cn("h-4 w-4", t.color)} />
                                                    <span>{t.label}</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">Location</Label>
                                <div className="relative">
                                    <Input
                                        id="location"
                                        placeholder="e.g., Conference Room A"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="pl-9"
                                    />
                                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="agenda">Agenda / Notes</Label>
                            <Textarea
                                id="agenda"
                                placeholder="Briefly describe the meeting agenda..."
                                className="min-h-[100px] resize-none"
                                value={agenda}
                                onChange={(e) => setAgenda(e.target.value)}
                            />
                        </div>
                    </div>

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit">Schedule Meeting</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
