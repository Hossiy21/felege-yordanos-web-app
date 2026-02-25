"use client"

import { useTranslation } from "react-i18next"
import i18n from "@/lib/i18n"
import { Languages, Check } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function LanguageToggle() {
    const { t } = useTranslation()
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const getDisplayLang = (code: string) => {
        if (code === "am") return "አማ"
        if (code === "gez") return "ግዕዝ"
        return "Eng"
    }

    const currentLang = getDisplayLang(i18n.language)

    const changeLanguage = (code: string) => {
        if (i18n && typeof i18n.changeLanguage === 'function') {
            i18n.changeLanguage(code).catch(err => {
                console.error("Failed to change language:", err)
            })
        }
    }

    if (!mounted) {
        return (
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" aria-label="Toggle language">
                <Languages className="h-[18px] w-[18px] text-muted-foreground" />
            </Button>
        )
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full hover:bg-muted/60 transition-all duration-200 border border-transparent hover:border-border/50 focus:outline-none focus:ring-2 focus:ring-primary/20 mr-1 group"
                    aria-label="Toggle Language"
                >
                    <div className="relative flex items-center justify-center">
                        <Languages className="h-[18px] w-[18px] text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <span className="text-[13px] font-semibold text-foreground/80 group-hover:text-foreground transition-colors">
                        {currentLang}
                    </span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl border-border/60 shadow-xl p-1.5 mt-2" sideOffset={8}>
                <DropdownMenuItem
                    onClick={() => changeLanguage("en")}
                    className={`rounded-lg cursor-pointer text-[13px] font-medium p-2.5 flex items-center justify-between ${i18n.language === 'en' ? 'bg-primary/10 text-primary' : 'focus:bg-muted/60'}`}
                >
                    <div className="flex items-center gap-2">
                        <span>English</span>
                    </div>
                    {i18n.language === 'en' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage("am")}
                    className={`rounded-lg cursor-pointer text-[13px] font-medium p-2.5 flex items-center justify-between ${i18n.language === 'am' ? 'bg-primary/10 text-primary' : 'focus:bg-muted/60'}`}
                >
                    <div className="flex items-center gap-2">
                        <span>አማርኛ</span>
                    </div>
                    {i18n.language === 'am' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => changeLanguage("gez")}
                    className={`rounded-lg cursor-pointer text-[13px] font-medium p-2.5 flex items-center justify-between ${i18n.language === 'gez' ? 'bg-primary/10 text-primary' : 'focus:bg-muted/60'}`}
                >
                    <div className="flex items-center gap-2">
                        <span>ግዕዝ</span>
                    </div>
                    {i18n.language === 'gez' && <Check className="h-4 w-4 text-primary" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
