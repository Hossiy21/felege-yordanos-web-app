"use client"

import { useRef, useEffect } from "react"
import { useDatePicker } from 'kenat-ui'
import { Input } from "@/components/ui/input"
import { Calendar } from "lucide-react"
import { cn } from "@/lib/utils"

interface EthiopianDatePickerProps {
    onChange: (date: string) => void
    placeholder?: string
    label?: string
    value?: string
    className?: string
}

export function EthiopianDatePicker({
    onChange,
    placeholder,
    label,
    value,
    className
}: EthiopianDatePickerProps) {
    // @ts-ignore
    const { state, actions } = useDatePicker()
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync value from internal state to parent
    useEffect(() => {
        if (state.formatted) {
            onChange(state.formatted)
        }
    }, [state.formatted, onChange])

    // Sync value from parent to internal state (if needed/supported by hook, 
    // but the hook seems to control its own state. We might need a way to set initial value if the hook supports it)
    // For now, we'll rely on the hook's internal state.

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            <div className="relative group">
                <Input
                    type="text"
                    readOnly
                    // @ts-ignore
                    ref={state.inputRef}
                    value={state.formatted || value}
                    onClick={actions.toggleOpen}
                    placeholder={placeholder}
                    className="pl-10 h-11 font-mono text-sm cursor-pointer hover:bg-accent/10 transition-colors bg-background"
                />
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors pointer-events-none" />
            </div>

            {state.open && (
                <div className="absolute top-full left-0 mt-2 z-50 p-4 bg-popover/95 backdrop-blur-md text-popover-foreground rounded-xl shadow-xl border border-border/60 animate-in fade-in zoom-in-95 duration-200 min-w-[320px]">
                    <div className="flex items-center justify-between mb-4 border-b border-border/50 pb-2">
                        {/* @ts-ignore */}
                        <span className="font-semibold text-sm tracking-wide text-primary">{state.grid.monthName} {state.grid.year}</span>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center mb-2">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} className="text-[10px] uppercase text-muted-foreground font-bold">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {/* @ts-ignore */}
                        {state.days.map((day: any, i: number) =>
                            day ? (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => {
                                        actions.selectDate(day)
                                    }}
                                    className={cn(
                                        "h-9 w-9 text-sm rounded-lg flex items-center justify-center transition-all duration-200",
                                        "hover:bg-primary/10 hover:text-primary hover:scale-110",
                                        // Highlight selected
                                        state.formatted === day.formatted
                                            ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:text-primary-foreground"
                                            : "text-foreground"
                                    )}
                                >
                                    {day.ethiopian.day}
                                </button>
                            ) : <div key={i} />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
