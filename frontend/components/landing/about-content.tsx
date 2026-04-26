"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
    BookOpen,
    Users,
    Globe,
    Heart,
    Shield,
    Star,
    Church,
    Flame,
    HandHeart,
    GraduationCap,
    Music,
    ArrowRight,
    Quote,
    Target,
    Eye,
    ChevronDown,
    Award,
    Crown,
    UserCheck,
    Layers,
    Milestone,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTranslation } from "react-i18next"
import { cn } from "@/lib/utils"

// ─── Section Anchor Wrapper ────────────────────────────────────────────────────
function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-sm font-semibold uppercase tracking-widest text-[hsl(40,90%,45%)] mb-3">
            {children}
        </p>
    )
}

// ─── Org Node (for hierarchy chart) ──────────────────────────────────────────
function OrgNode({
    title,
    name,
    accent = false,
    children,
}: {
    title: string
    name?: string
    accent?: boolean
    children?: React.ReactNode
}) {
    return (
        <div className="flex flex-col items-center gap-0">
            {/* Card */}
            <div
                className={cn(
                    "relative flex flex-col items-center text-center px-6 py-5 rounded-2xl border shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5 w-52",
                    accent
                        ? "bg-[#003366] text-white border-[#003366] shadow-[#003366]/20"
                        : "bg-card text-foreground border-border hover:border-[#FFB800]/50"
                )}
            >
                <div
                    className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full mb-3",
                        accent ? "bg-[#FFB800] text-[#003366]" : "bg-muted text-[#003366] dark:text-[#FFB800]"
                    )}
                >
                    <Crown className="h-5 w-5" />
                </div>
                <span
                    className={cn(
                        "text-[10px] font-bold uppercase tracking-widest mb-1",
                        accent ? "text-[#FFB800]" : "text-muted-foreground"
                    )}
                >
                    {title}
                </span>
                {name && (
                    <span className={cn("text-sm font-semibold", accent ? "text-white" : "text-foreground")}>
                        {name}
                    </span>
                )}
            </div>

            {/* Children connector */}
            {children && (
                <div className="flex flex-col items-center">
                    <div className="w-px h-8 bg-border" />
                    <div className="flex flex-row items-start gap-0">
                        {/* Horizontal line spanning all children */}
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}

// ─── History Timeline Item ────────────────────────────────────────────────────
function HistoryItem({
    era,
    title,
    body,
    index,
}: {
    era: string
    title: string
    body: string
    index: number
}) {
    const isEven = index % 2 === 0
    return (
        <div className={`relative flex w-full items-start gap-6 ${isEven ? "flex-row" : "flex-row-reverse"}`}>
            {/* Card */}
            <div className="flex-1 rounded-2xl border border-border bg-card p-6 hover:border-[#FFB800]/40 hover:shadow-md transition-all group">
                <span className="inline-block rounded-full bg-[#003366] text-[#FFB800] dark:bg-[#FFB800]/10 dark:text-[#FFB800] px-3 py-1 text-xs font-bold tracking-wider mb-3">
                    {era}
                </span>
                <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-[#003366] dark:group-hover:text-[#FFB800] transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
            </div>

            {/* Center dot */}
            <div className="relative flex flex-col items-center">
                <div className="h-5 w-5 rounded-full bg-[#FFB800] ring-4 ring-background border-2 border-[#003366] z-10 mt-6" />
            </div>

            {/* Spacer on the other side */}
            <div className="flex-1" />
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function AboutContent() {
    const { t } = useTranslation()

    // ── Data ──────────────────────────────────────────────────────────────────
    const history = [
        {
            era: "Early 1990s",
            title: "Cathedral Established",
            body: "Bole Debre Salem Medhanealem Cathedral was founded as a pillar of Orthodox Christian faith in Addis Ababa, drawing worshippers from all walks of life.",
        },
        {
            era: "Late 1990s",
            title: "Sunday School Founded",
            body: 'Felege Yordanos Sunday School was established under the cathedral, taking the name "Stream of Jordan" to symbolize spiritual renewal and the life-giving path of faith.',
        },
        {
            era: "2000s",
            title: "Structured Curriculum",
            body: "Formal programs were introduced covering Holy Scripture, Ge'ez liturgy, traditional church music (Zema), and theological doctrine — creating a comprehensive spiritual education.",
        },
        {
            era: "2010s",
            title: "Community Growth",
            body: "The school expanded to include youth outreach, community service programs, and inter-department competitions, growing membership to over 400 active students.",
        },
        {
            era: "2020s",
            title: "Digital Transformation",
            body: "Launch of the SST Manager digital platform, modernizing administration with letter management, meeting records, document workflows, and secure multi-role access.",
        },
    ]

    const values = [
        {
            icon: BookOpen,
            title: t("religious_education"),
            description: t("religious_education_desc"),
            color: "bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30",
            iconBg: "bg-blue-600",
        },
        {
            icon: Users,
            title: t("community_growth"),
            description: t("community_growth_desc"),
            color: "bg-emerald-50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30",
            iconBg: "bg-emerald-600",
        },
        {
            icon: Heart,
            title: t("spiritual_service"),
            description: t("spiritual_service_desc"),
            color: "bg-rose-50 dark:bg-rose-900/10 border-rose-100 dark:border-rose-800/30",
            iconBg: "bg-rose-600",
        },
        {
            icon: Globe,
            title: t("cultural_heritage"),
            description: t("cultural_heritage_desc"),
            color: "bg-amber-50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/30",
            iconBg: "bg-amber-600",
        },
    ]

    const programs = [
        { icon: BookOpen, name: t("program_biblical"), desc: "In-depth study of the Old and New Testaments" },
        { icon: Music, name: t("program_zema"), desc: "Traditional Ethiopian Orthodox liturgical chanting" },
        { icon: GraduationCap, name: t("program_theology"), desc: "Core teachings of the Tewahedo faith" },
        { icon: HandHeart, name: t("program_community"), desc: "Outreach programs serving those in need" },
        { icon: Flame, name: t("program_prayer"), desc: "Guided spiritual disciplines and meditations" },
        { icon: Church, name: t("program_liturgy"), desc: "Preserving 2,000-year-old sacred rites" },
    ]

    return (
        <>
            {/* ══════════════════════════════════════════════════════════════════════
          1. HERO BANNER
      ══════════════════════════════════════════════════════════════════════════ */}
            <section className="relative text-white pt-40 pb-20 min-h-[70vh] flex flex-col justify-center overflow-hidden">
                {/* ── Premium Abstract Gradient Background ── */}
                <div className="absolute inset-0 z-0 bg-[#0a192f]">
                    {/* Elegant glowing gradient base */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#0a274a] via-[#003366] to-[#001229]" />

                    {/* Subtle architectural grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                    {/* Colorful ambient orbs for that 'cool' modern look */}
                    <div className="absolute -top-[20%] -right-[10%] w-[500px] h-[500px] bg-[#FFB800]/15 rounded-full blur-[120px]" />
                    <div className="absolute bottom-[0%] -left-[10%] w-[600px] h-[600px] bg-[#0066cc]/20 rounded-full blur-[130px]" />
                    <div className="absolute top-[20%] left-[20%] w-[400px] h-[400px] bg-[#60a5fa]/10 rounded-full blur-[100px]" />
                </div>

                <div className="relative mx-auto max-w-5xl px-6 text-center z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <span className="inline-flex items-center gap-2 rounded-full border border-[#FFB800]/40 bg-[#001229]/60 backdrop-blur-md px-5 py-2 text-sm font-bold text-[#FFB800] tracking-wider mb-8 uppercase shadow-lg">
                        ✝ ፈለገ ዮርዳኖስ ሰንበት ትምህርት ቤት
                    </span>
                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight text-balance mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">
                        About Our
                        <span className="text-[#FFB800]"> Sunday School</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg sm:text-xl text-white/90 leading-relaxed font-semibold mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] text-justify">
                        Discover the history, structure, vision, and values of Felege Yordanos — a spiritual community
                        rooted in the Ethiopian Orthodox Tewahedo faith.
                    </p>

                    {/* Premium glassmorphism jump links */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-4">
                        {[
                            { label: "Cathedral", href: "#cathedral-history" },
                            { label: "Leadership", href: "#leadership" },
                            { label: "Vision & Mission", href: "#vision-mission" },
                            { label: "Our Values", href: "#core-values" },
                            { label: "Our History", href: "#history" },
                            { label: "Programs", href: "#programs" },
                        ].map((l) => (
                            <a
                                key={l.href}
                                href={l.href}
                                className="rounded-full border border-white/20 bg-[#001229]/60 backdrop-blur-md px-6 py-2.5 text-sm font-semibold text-white hover:bg-white/20 hover:border-white/40 hover:-translate-y-1 transition-all duration-300 shadow-md"
                            >
                                {l.label}
                            </a>
                        ))}
                    </div>
                </div>

                {/* Bottom Diagonal Divider matching Home page */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10 mb-[-1px]">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[120px] text-background">
                        <polygon points="0,120 1440,120 1440,0" fill="currentColor"></polygon>
                    </svg>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          2. CATHEDRAL HISTORY
      ══════════════════════════════════════════════════════════════════════════ */}
            <section id="cathedral-history" className="py-24 lg:py-32 bg-background scroll-mt-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-16">
                        <div>
                            <SectionLabel>Our Heritage</SectionLabel>
                            <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance mb-6">
                                Bole Medhane Alem Cathedral
                            </h2>
                            <div className="space-y-4 text-[16px] text-muted-foreground leading-relaxed text-justify">
                                <p>
                                    Medhane Alem Cathedral (መድኃኔዓለም ካቴድራል), whose name translates to <strong>"Saviour of the World,"</strong> is an Ethiopian Orthodox Tewahedo cathedral located in the Bole area of Addis Ababa, Ethiopia.
                                </p>
                                <p>
                                    Completed in 1931 under the guidance of <strong>Emperor Haile Selassie</strong>, it holds the distinction of being the <strong>second-largest cathedral in Africa</strong> and the largest in Ethiopia. The cathedral stands as a monumental achievement of architecture and devotion, serving as the headquarters of the Ethiopian Orthodox Tewahedo Church.
                                </p>
                                <p>
                                    The cathedral was designed by the architect <strong>Zenaye Workeneh</strong> and features a striking blend of Ethiopian and European architectural styles. Constructed from stone, wood, and marble with a grand granite exterior, the interior is adorned with vibrant stained glass windows, intricate carvings, and ornate religious decorations.
                                </p>
                                <p>
                                    With a seating capacity for over <strong>5,000 worshippers</strong>, it is a vibrant center of spiritual life and culture. Beyond its architectural grandeur, it serves as a profound symbol of Ethiopia's spiritual heritage, housing sacred artifacts and preserving the living traditions of the faith.
                                </p>
                            </div>
                        </div>
                        <div className="relative mt-8 lg:mt-0">
                            <div className="absolute inset-0 bg-gradient-to-tr from-[#003366]/20 to-[#FFB800]/20 rounded-[2.5rem] transform rotate-3 lg:scale-105 transition-transform duration-500 hover:rotate-6" />
                            <div className="relative bg-card border border-border/50 rounded-[2.5rem] p-3 shadow-2xl grid grid-cols-2 gap-3">
                                <div className="col-span-2 aspect-[16/9] rounded-[1.5rem] overflow-hidden relative group bg-[#003366]">
                                    <div className="absolute inset-0 bg-[url('/images/cathedral/cathedral-main.jpg')] bg-cover bg-center transition-all duration-700 group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#003366]/60 via-transparent to-transparent" />
                                </div>
                                <div className="aspect-square rounded-[1.5rem] overflow-hidden relative group bg-[#003366]">
                                    <div className="absolute inset-0 bg-[url('/images/cathedral/cathedral-side-1.jpg')] bg-cover bg-center transition-all duration-700 group-hover:scale-110" />
                                </div>
                                <div className="aspect-square rounded-[1.5rem] overflow-hidden relative group bg-[#003366]">
                                    <div className="absolute inset-0 bg-[url('/images/cathedral/cathedral-side-2.jpg')] bg-cover bg-center transition-all duration-700 group-hover:scale-110" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Map */}
                    <div className="relative w-full rounded-3xl overflow-hidden border border-border/50 shadow-lg group">
                        <div className="absolute inset-0 bg-[#003366]/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none" />
                        <iframe
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=38.7759%2C8.9859%2C38.8039%2C9.0059&layer=mapnik&marker=8.9959%2C38.7899`}
                            className="grayscale-[20%] group-hover:grayscale-0 transition-all duration-700"
                            title="Medhane Alem Cathedral Location"
                        />
                        <div className="absolute bottom-4 right-4 z-20">
                            <a
                                href="https://geohack.toolforge.org/geohack.php?pagename=Medhane_Alem_Cathedral,_Addis_Ababa&params=8.9959_N_38.7899_E_source:openstreetmap_region:ET-AA_type:landmark"
                                target="_blank"
                                rel="noreferrer"
                                className="bg-background/90 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-semibold text-foreground shadow-sm hover:bg-background transition-colors flex items-center gap-2 border border-border/50"
                            >
                                <Globe className="h-3.5 w-3.5" />
                                Open in GeoHack
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          3. LEADERSHIP HIERARCHY
      ══════════════════════════════════════════════════════════════════════════ */}
            <section id="leadership" className="py-24 lg:py-32 scroll-mt-20">
                <div className="mx-auto max-w-6xl px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <SectionLabel>{t("administration")}</SectionLabel>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                            {t("leadership_title")}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                            {t("leadership_subtitle")}
                        </p>
                    </div>

                    {/* Hierarchy Chart — Top Level */}
                    <div className="flex flex-col items-center gap-0 w-full overflow-hidden">

                        {/* ── Level 1: Cathedral / Abbot ── */}
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-center text-center px-8 py-5 rounded-2xl bg-gradient-to-br from-[#002244] to-[#003366] text-white border border-[#FFB800]/30 shadow-xl w-64 hover:shadow-2xl transition-all">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFB800] text-[#003366] mb-3">
                                    <Church className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-1">Cathedral Abbot</span>
                                <span className="text-sm font-semibold text-white">His Holiness / Parish Head</span>
                            </div>
                            <div className="w-px h-8 bg-border" />
                        </div>

                        {/* ── Level 2: Chairman ── */}
                        <div className="flex flex-col items-center">
                            <div className="flex flex-col items-center text-center px-8 py-5 rounded-2xl bg-[#003366] text-white border border-[#FFB800]/50 shadow-lg w-64 hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFB800] text-[#003366] mb-3">
                                    <Crown className="h-6 w-6" />
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#FFB800] mb-1">{t("chairman")}</span>
                                <span className="text-sm font-semibold text-white">Sunday School Chairman</span>
                            </div>
                            {/* Branch line down */}
                            <div className="w-px h-8 bg-border" />
                        </div>

                        {/* ── Level 3: Vice + Secretary (wide connector) ── */}
                        <div className="flex flex-col items-center w-full">
                            {/* Horizontal rail - Hidden on mobile */}
                            <div className="hidden md:flex items-start justify-center gap-0 w-full max-w-3xl relative">
                                {/* Left vertical */}
                                <div className="flex-1 flex justify-end">
                                    <div className="w-px h-8 bg-border" />
                                </div>
                                {/* Top horizontal connector */}
                                <div className="absolute top-0 left-1/4 right-1/4 h-px bg-border" />
                                {/* Right vertical */}
                                <div className="flex-1 flex justify-start">
                                    <div className="w-px h-8 bg-border" />
                                </div>
                            </div>
                            {/* Mobile connector */}
                            <div className="md:hidden w-px h-8 bg-border" />
                            <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6">
                                {[
                                    { icon: Award, role: t("vice_chairman"), desc: "Deputy Head" },
                                    { icon: UserCheck, role: t("secretary"), desc: "Administration" },
                                    { icon: Shield, role: t("treasurer"), desc: "Finance & Funds" },
                                ].map((item) => (
                                    <div
                                        key={item.role}
                                        className="flex flex-col items-center text-center px-5 py-4 rounded-xl border border-border bg-card hover:border-[#FFB800]/50 hover:shadow-md hover:-translate-y-0.5 transition-all w-64 md:w-44"
                                    >
                                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#003366]/10 dark:bg-[#FFB800]/10 text-[#003366] dark:text-[#FFB800] mb-2">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                            {item.role}
                                        </span>
                                        <span className="text-xs font-medium text-foreground">{item.desc}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="w-px h-8 bg-border mt-0" />
                        </div>

                        {/* ── Level 4: Department Heads ── */}
                        <div className="flex flex-col items-center w-full">
                            <div className="w-full max-w-5xl">
                                <div className="relative flex justify-center">
                                    {/* Horizontal connector line - Hidden on mobile */}
                                    <div className="hidden md:block absolute top-0 left-[calc(100%/12)] right-[calc(100%/12)] h-px bg-border" />
                                    {/* Mobile connector */}
                                    <div className="md:hidden w-px h-8 bg-border" />
                                </div>
                                <div className="flex flex-col md:flex-row flex-wrap justify-center gap-4 pt-0">
                                    {[
                                        { icon: BookOpen, dept: t("education_dept"), sub: "Curriculum & Teaching" },
                                        { icon: Music, dept: t("zema_dept"), sub: "Liturgical Music" },
                                        { icon: HandHeart, dept: t("social_affairs"), sub: "Community Service" },
                                        { icon: GraduationCap, dept: t("youth_affairs"), sub: "Youth Programs" },
                                        { icon: Layers, dept: "Sub-Departments", sub: "Class Coordinators" },
                                    ].map((d) => (
                                        <div
                                            key={d.dept}
                                            className="flex flex-col items-center text-center px-4 py-4 rounded-xl border border-dashed border-border bg-muted/30 hover:bg-card hover:border-[#FFB800]/30 hover:shadow-sm transition-all w-64 md:w-36"
                                        >
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background border border-border text-muted-foreground mb-2">
                                                <d.icon className="h-4 w-4" />
                                            </div>
                                            <span className="text-[10px] font-bold text-foreground mb-0.5">{d.dept}</span>
                                            <span className="text-[10px] text-muted-foreground">{d.sub}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-[#003366]" /> Senior Clergy &amp; Leadership
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm bg-card border border-border" /> Management Committee
                        </span>
                        <span className="flex items-center gap-2">
                            <span className="h-3 w-3 rounded-sm border border-dashed border-border bg-muted/30" /> Departments
                        </span>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          3. VISION & MISSION
      ══════════════════════════════════════════════════════════════════════════ */}
            <section id="vision-mission" className="py-24 bg-muted/40 scroll-mt-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <SectionLabel>What We Stand For</SectionLabel>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                            Our Vision &amp; Mission
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Vision */}
                        <div className="relative flex flex-col p-8 rounded-3xl border border-border bg-card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                            {/* Accent bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#003366] to-[#004080]" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#003366] text-[#FFB800] mb-6 group-hover:scale-105 transition-transform">
                                <Eye className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4">{t("our_vision")}</h3>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                {t("our_vision_desc")}
                            </p>
                            <div className="mt-6 pt-6 border-t border-border">
                                <p className="text-sm font-semibold text-[#003366] dark:text-[#FFB800] italic">
                                    "A stream that flows from the Jordan — giving life to all it touches."
                                </p>
                            </div>
                        </div>

                        {/* Mission */}
                        <div className="relative flex flex-col p-8 rounded-3xl border border-border bg-card overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all">
                            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FFB800] to-[#f59e0b]" />
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB800] text-[#003366] mb-6 group-hover:scale-105 transition-transform">
                                <Target className="h-7 w-7" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-4">{t("our_mission")}</h3>
                            <p className="text-muted-foreground leading-relaxed text-base">
                                {t("our_mission_desc")}
                            </p>
                            <div className="mt-6 pt-6 border-t border-border">
                                <ul className="space-y-2">
                                    {[
                                        "Teach the Holy Bible and Apostolic traditions",
                                        "Preserve Ge'ez liturgy and Zema (church music)",
                                        "Foster community, fellowship, and outreach",
                                    ].map((point) => (
                                        <li key={point} className="flex items-start gap-2 text-sm text-muted-foreground">
                                            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[#FFB800] shrink-0" />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          4. SCRIPTURE QUOTE
      ══════════════════════════════════════════════════════════════════════════ */}
            <section className="py-20 bg-gradient-to-r from-[#003366] to-[#004080] relative overflow-hidden">
                <div className="absolute inset-0 opacity-5" aria-hidden>
                    <div className="absolute top-0 left-0 h-full w-full bg-[repeating-linear-gradient(45deg,white,white_1px,transparent_0,transparent_50%)] bg-[length:10px_10px]" />
                </div>
                <div className="relative mx-auto max-w-3xl px-6 text-center">
                    <Quote className="h-10 w-10 text-[#FFB800] mx-auto mb-6 opacity-80" />
                    <blockquote className="text-2xl sm:text-3xl font-bold text-white leading-snug italic">
                        "Train up a child in the way he should go; even when he is old he will not depart from it."
                    </blockquote>
                    <p className="mt-5 text-[#FFB800] font-semibold tracking-wide">— Proverbs 22:6</p>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          5. CORE VALUES
      ══════════════════════════════════════════════════════════════════════════ */}
            <section id="core-values" className="py-24 lg:py-32 scroll-mt-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <SectionLabel>What Guides Us</SectionLabel>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                            Our Core Values
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                            These foundational pillars define who we are, how we teach, and how we serve our community.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((v, i) => (
                            <div
                                key={v.title}
                                className={`group flex flex-col p-7 rounded-2xl border ${v.color} hover:shadow-lg transition-all hover:-translate-y-1`}
                            >
                                <div
                                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${v.iconBg} text-white mb-5 group-hover:scale-110 transition-transform`}
                                >
                                    <v.icon className="h-6 w-6" />
                                </div>
                                <div className="text-2xl font-extrabold text-[#003366] dark:text-[#FFB800] mb-1 opacity-20 select-none">
                                    {String(i + 1).padStart(2, "0")}
                                </div>
                                <h3 className="text-base font-bold text-foreground mb-2">{v.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          6. OUR HISTORY (Timeline)
      ══════════════════════════════════════════════════════════════════════════ */}
            <section id="history" className="py-24 lg:py-32 bg-muted/30 scroll-mt-20">
                <div className="mx-auto max-w-4xl px-6">
                    <div className="text-center mb-16">
                        <SectionLabel>{t("our_history_title")}</SectionLabel>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                            {t("our_history_title")}
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                            {t("our_history_subtitle")}
                        </p>
                    </div>

                    {/* Timeline */}
                    <div className="relative">
                        {/* Center line */}
                        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border -translate-x-1/2 hidden md:block" />

                        <div className="flex flex-col gap-8">
                            {history.map((item, i) => {
                                const isLeft = i % 2 === 0
                                return (
                                    <div key={item.era} className="relative flex flex-col md:flex-row md:items-start gap-0">
                                        {/* Left card */}
                                        {isLeft ? (
                                            <>
                                                <div className="md:w-[calc(50%-2rem)] md:pr-8">
                                                    <div className="rounded-2xl border border-border bg-card p-6 hover:border-[#FFB800]/40 hover:shadow-md transition-all group">
                                                        <span className="inline-block rounded-full bg-[#003366] text-[#FFB800] px-3 py-1 text-xs font-bold tracking-wider mb-3">
                                                            {item.era}
                                                        </span>
                                                        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-[#003366] dark:group-hover:text-[#FFB800] transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                                                    </div>
                                                </div>
                                                {/* Dot */}
                                                <div className="hidden md:flex items-start justify-center w-16 pt-6">
                                                    <div className="h-5 w-5 rounded-full bg-[#FFB800] ring-4 ring-background border-2 border-[#003366] z-10" />
                                                </div>
                                                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                                            </>
                                        ) : (
                                            <>
                                                <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                                                {/* Dot */}
                                                <div className="hidden md:flex items-start justify-center w-16 pt-6">
                                                    <div className="h-5 w-5 rounded-full bg-[#FFB800] ring-4 ring-background border-2 border-[#003366] z-10" />
                                                </div>
                                                <div className="md:w-[calc(50%-2rem)] md:pl-8">
                                                    <div className="rounded-2xl border border-border bg-card p-6 hover:border-[#FFB800]/40 hover:shadow-md transition-all group">
                                                        <span className="inline-block rounded-full bg-[#003366] text-[#FFB800] px-3 py-1 text-xs font-bold tracking-wider mb-3">
                                                            {item.era}
                                                        </span>
                                                        <h3 className="text-base font-bold text-foreground mb-2 group-hover:text-[#003366] dark:group-hover:text-[#FFB800] transition-colors">
                                                            {item.title}
                                                        </h3>
                                                        <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                                                    </div>
                                                </div>
                                            </>
                                        )}

                                        {/* Mobile card (always show) */}
                                        <div className="md:hidden rounded-2xl border border-border bg-card p-6">
                                            <span className="inline-block rounded-full bg-[#003366] text-[#FFB800] px-3 py-1 text-xs font-bold tracking-wider mb-3">
                                                {item.era}
                                            </span>
                                            <h3 className="text-base font-bold text-foreground mb-2">{item.title}</h3>
                                            <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          7. PROGRAMS
      ══════════════════════════════════════════════════════════════════════════ */}
            <section id="programs" className="py-24 lg:py-28 scroll-mt-20">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="text-center mb-16">
                        <SectionLabel>What We Offer</SectionLabel>
                        <h2 className="text-3xl font-bold text-foreground sm:text-4xl text-balance">
                            Our Spiritual Programs
                        </h2>
                        <p className="mt-4 max-w-2xl mx-auto text-muted-foreground leading-relaxed">
                            A rich and diverse set of programs designed to cultivate deep, holistic faith in every student.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((p) => (
                            <div
                                key={p.name}
                                className="group flex items-start gap-4 p-5 rounded-xl border border-border bg-card hover:border-[#FFB800]/40 hover:shadow-md transition-all"
                            >
                                <div className="flex-shrink-0 flex h-11 w-11 items-center justify-center rounded-xl bg-[#003366] dark:bg-[#FFB800]/10 text-[#FFB800] group-hover:scale-110 transition-transform">
                                    <p.icon className="h-5 w-5" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground mb-1">{p.name}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══════════════════════════════════════════════════════════════════════
          8. CALL TO ACTION
      ══════════════════════════════════════════════════════════════════════════ */}
            <section className="relative py-32 overflow-hidden mt-12">
                {/* Top Diagonal Divider seamlessly slicing from the previous section */}
                <div className="absolute top-0 left-0 w-full overflow-hidden leading-none z-10">
                    <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="block w-full h-[60px] md:h-[120px] text-background">
                        <polygon points="0,0 1440,0 1440,120" fill="currentColor"></polygon>
                    </svg>
                </div>

                {/* Premium Abstract Gradient Background */}
                <div className="absolute inset-0 z-0 bg-[#0a192f]">
                    <div className="absolute inset-0 bg-gradient-to-tr from-[#001229] via-[#003366] to-[#0a274a]" />

                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_100%,#000_70%,transparent_100%)]" />

                    {/* Ambient orbs */}
                    <div className="absolute top-[10%] -left-[10%] w-[500px] h-[500px] bg-[#FFB800]/10 rounded-full blur-[120px]" />
                    <div className="absolute -bottom-[20%] -right-[10%] w-[600px] h-[600px] bg-[#0066cc]/20 rounded-full blur-[130px]" />
                </div>

                <div className="relative mx-auto max-w-4xl px-6 text-center z-10">
                    <h2 className="text-4xl font-extrabold text-white sm:text-5xl lg:text-6xl text-balance mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)] tracking-tight">
                        Begin Your <span className="text-[#FFB800]">Spiritual Journey</span> Today
                    </h2>
                    <p className="text-white/90 text-lg sm:text-xl font-semibold leading-relaxed mb-12 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] max-w-2xl mx-auto">
                        Join the Felege Yordanos Sunday School family and grow in faith, knowledge, and fellowship.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
                        <Link href="/signup">
                            <Button
                                size="lg"
                                className="bg-[#FFB800] text-[#003366] hover:bg-[#FFB800]/90 font-extrabold text-[15px] px-10 h-14 rounded-full shadow-2xl hover:shadow-[#FFB800]/30 hover:-translate-y-1 transition-all duration-300 group"
                            >
                                Enroll Today
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1.5 transition-transform" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white/30 text-white hover:bg-white/10 hover:border-white/50 backdrop-blur-md font-bold text-[15px] px-10 h-14 rounded-full transition-all duration-300 hover:-translate-y-1"
                            >
                                Contact Us
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </>
    )
}
